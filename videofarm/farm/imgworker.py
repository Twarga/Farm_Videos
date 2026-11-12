"""Image worker: Nano Banana (via the Antigravity CLI, `agy`) fills the farm's plate queue.

Run it on the machine where `agy` is logged in, pointed at the farm host:

    python -m farm.imgworker --host tlab@192.168.100.26 --workers 8 [--job SLUG ...] [--sample N] [--watch]

Each round it asks the farm for every plate still missing (`python -m farm pending`), generates them in parallel from
the stored prompt plus the style's character reference, validates the picture, keeps a copy in the local cache and
pushes it to <host>:<root>/cache/images/<key>.png. Plates already in the local cache are only pushed, so a lost
remote cache is restored without spending image quota.
"""
import argparse
import json
import os
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import numpy as np
from PIL import Image

from . import config, style as S

MODEL = os.environ.get("FARM_AGY_MODEL", "gemini-3.8-flash-low")
SSH = ["-o", "BatchMode=yes", "-o", "ControlMaster=auto", "-o", "ControlPath=/tmp/farm-cm-%C",
       "-o", "ControlPersist=600"]

WRAP = """Generate exactly ONE image with your image generation tool (Nano Banana), then stop.
./ref.png is the reference image: copy its exact character design and its exact art style.
Save the generated image as ./plate.png in the current directory. Create no other files and ask no questions.

IMAGE PROMPT:
{prompt}
"""


class Quota:
    """Shared back-off: one 429 pauses every worker until the quota window should have reset."""

    def __init__(self):
        self.until, self.lock = 0.0, threading.Lock()

    def wait(self):
        while (left := self.until - time.time()) > 0:
            time.sleep(min(left, 5))

    def hit(self, text):
        m = re.search(r"(\d+)\s*minutes?", text)
        secs = (int(m.group(1)) + 1) * 60 if m else 180
        with self.lock:
            self.until = max(self.until, time.time() + secs)
        return secs


QUOTA = Quota()


class Retry(RuntimeError):
    pass


def ssh(host, cmd, stdin=None):
    return subprocess.run(["ssh", *SSH, host, cmd], stdin=stdin, capture_output=True, text=stdin is None, check=True)


def fetch_pending(host, root):
    out = ssh(host, f"cd {root} && .venv/bin/python -m farm pending").stdout
    return json.loads(out.strip().splitlines()[-1])


def push(host, root, key, path):
    dest = f"{root}/cache/images/{key}"
    with open(path, "rb") as f:
        ssh(host, f"cat > {dest}.part && mv {dest}.part {dest}.png", stdin=f)


def check(path, item):
    """Cheap sanity gate. Wrong-looking pictures are retried, not shipped."""
    im = Image.open(path).convert("RGB")
    w, h = im.size
    if min(w, h) < 600:
        raise Retry(f"too small {w}x{h}")
    a = np.asarray(im.convert("L"), dtype=np.float32)
    if a.std() < 6:
        raise Retry("blank picture")
    if item.get("kind") == "icon":
        edge = np.concatenate([a[:6].ravel(), a[-6:].ravel(), a[:, :6].ravel(), a[:, -6:].ravel()])
        if np.median(edge) < 235:
            raise Retry("icon background is not white")
    elif not 1.6 <= w / h <= 1.95:
        raise Retry(f"not 16:9 ({w}x{h})")


def generate(item, ref, timeout):
    """One plate through agy. Returns the generated file (inside a temp dir the caller removes)."""
    QUOTA.wait()
    tmp = Path(tempfile.mkdtemp(prefix="plate-"))
    shutil.copy(ref, tmp / "ref.png")
    cmd = ["agy", "-p", WRAP.format(prompt=item["prompt"]), "--dangerously-skip-permissions",
           "--model", MODEL, "--effort", "low", "--print-timeout", str(timeout)]
    p = subprocess.Popen(cmd, cwd=tmp, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                         text=True, start_new_session=True)
    try:
        out, _ = p.communicate(timeout=timeout + 30)
    except subprocess.TimeoutExpired:
        os.killpg(p.pid, signal.SIGKILL)
        shutil.rmtree(tmp, ignore_errors=True)
        raise Retry("agy timed out")
    if re.search(r"RESOURCE_EXHAUSTED|QUOTA_EXHAUSTED|\b429\b", out):
        secs = QUOTA.hit(out)
        shutil.rmtree(tmp, ignore_errors=True)
        raise Retry(f"quota hit, pausing {secs}s")
    plate = tmp / "plate.png"
    if not plate.exists():
        others = sorted((f for f in tmp.iterdir() if f.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp")
                         and f.name != "ref.png"), key=lambda f: f.stat().st_size, reverse=True)
        if not others:
            shutil.rmtree(tmp, ignore_errors=True)
            raise Retry("no image produced: " + " ".join(out.split())[-200:])
        plate = others[0]
    return plate


def make(item, host, root, timeout, attempts):
    ref = Path(S.load(item["style"])["ref"])
    local = config.IMAGE_CACHE / f"{item['key']}.png"
    t0, why = time.time(), ""
    if not local.exists():
        for n in range(1, attempts + 1):
            plate = None
            try:
                plate = generate(item, ref, timeout)
                check(plate, item)
                shutil.copy(plate, local.with_suffix(".part"))
                local.with_suffix(".part").replace(local)
                break
            except Retry as e:
                why = str(e)
            finally:
                if plate:
                    shutil.rmtree(plate.parent, ignore_errors=True)
        else:
            return item, False, f"gave up after {attempts} attempts: {why}", time.time() - t0
    push(host, root, item["key"], local)
    return item, True, "", time.time() - t0


def pick(queue, jobs, sample):
    if jobs:
        queue = [i for i in queue if i["job"] in jobs]
        queue.sort(key=lambda i: jobs.index(i["job"]))
    if sample:
        by_job = {}
        for i in queue:
            by_job.setdefault(i["job"], []).append(i)
        queue = [grp[round(k * (len(grp) - 1) / max(sample - 1, 1))] for grp in by_job.values() for k in range(sample)]
    return queue


def main(argv=None):
    ap = argparse.ArgumentParser(prog="farm.imgworker", description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--host", default=os.environ.get("FARM_HOST", "tlab@192.168.100.26"))
    ap.add_argument("--root", default="videofarm", help="farm directory on the host (relative to its home)")
    ap.add_argument("--workers", type=int, default=8)
    ap.add_argument("--timeout", type=int, default=420, help="seconds per agy call")
    ap.add_argument("--attempts", type=int, default=4)
    ap.add_argument("--job", action="append", help="only these jobs, in this priority order")
    ap.add_argument("--sample", type=int, help="only N evenly spaced plates per job (quality check)")
    ap.add_argument("--watch", action="store_true", help="keep polling the farm for new plates")
    a = ap.parse_args(argv)

    failed = []
    while True:
        queue = pick(fetch_pending(a.host, a.root), a.job, a.sample)
        queue = [i for i in queue if i["key"] not in {f["key"] for f in failed}]
        if queue:
            print(f"{len(queue)} plates to make with {a.workers} workers ({MODEL})", flush=True)
            done = 0
            with ThreadPoolExecutor(a.workers) as ex:
                futs = [ex.submit(make, i, a.host, a.root, a.timeout, a.attempts) for i in queue]
                for f in as_completed(futs):
                    item, ok, why, secs = f.result()
                    done += ok
                    if not ok:
                        failed.append(item)
                    print(f"[{done}/{len(queue)}] {item['job'][:24]} {item['key']} "
                          f"{'ok' if ok else 'FAILED ' + why} {secs:.0f}s", flush=True)
        if not a.watch or a.sample:
            break
        time.sleep(20)
    if failed:
        Path("imgworker-failed.json").write_text(json.dumps(failed, indent=2))
        print(f"{len(failed)} plates failed; see imgworker-failed.json", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
