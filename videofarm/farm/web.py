"""Farm web UI.  python -m farm.web  (PORT env, default 8686)

POST /api/jobs {subject, title, minutes?, shorts?}  → creates a job and runs the style suggester
POST /api/jobs/<slug>/pick {style, title?}           → starts the pipeline (subprocess)
GET  /api/jobs                                       → all jobs with stage progress
GET  /api/jobs/<slug>                                → one job (+ styles.json, outputs, log tail)
GET  /files/<slug>/<path>                            → job outputs (HTTP Range for video seeking)
GET  /styles/<name>/character.png                    → style preview image
"""
import json
import mimetypes
import os
import subprocess
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from . import config, style as S, write
from .job import Job, all_jobs

STATIC = Path(__file__).parent / "static"
RUNNING = {}  # slug -> Popen
MAX_PARALLEL = int(os.environ.get("FARM_PARALLEL", "2"))
QUEUE = []
LOCK = threading.Lock()


def _start_runs():
    with LOCK:
        for slug in [s for s, p in RUNNING.items() if p.poll() is not None]:
            del RUNNING[slug]
        while QUEUE and len(RUNNING) < MAX_PARALLEL:
            slug = QUEUE.pop(0)
            log = open(config.JOBS / slug / "run.out", "a")
            RUNNING[slug] = subprocess.Popen([sys.executable, "-m", "farm", "run", slug], cwd=config.ROOT,
                                             stdout=log, stderr=subprocess.STDOUT)


def _scheduler():
    import time
    while True:
        _start_runs()
        time.sleep(3)


def job_view(j, full=False):
    out = {"slug": j.slug, "title": j.meta["title"], "subject": j.meta["subject"], "style": j.style,
           "stages": j.meta.get("stages", {}), "running": j.slug in RUNNING, "queued": j.slug in QUEUE,
           "outputs": sorted(p.name for p in j.path("out").glob("*")) if j.path("out").exists() else []}
    if full:
        out["styles"] = j.read("styles.json")
        out["outline"] = j.read("outline.json")
        log = j.path("log.txt")
        out["log"] = log.read_text().splitlines()[-40:] if log.exists() else []
        tl = j.read("timeline.json")
        out["duration"] = tl["duration"] if tl else None
    return out


class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _json(self, code, obj):
        b = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def _file(self, f, ctype=None):
        if not f.is_file():
            return self._json(404, {"error": "not found"})
        ctype = ctype or mimetypes.guess_type(f.name)[0] or "application/octet-stream"
        size = f.stat().st_size
        rng = self.headers.get("Range")
        if rng and rng.startswith("bytes="):
            a, _, b = rng[6:].split(",")[0].partition("-")
            start = int(a) if a else 0
            end = min(size - 1, int(b) if b else size - 1)
            if start > end:
                self.send_response(416)
                self.end_headers()
                return
            self.send_response(206)
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
            length = end - start + 1
        else:
            start, length = 0, size
            self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(length))
        self.end_headers()
        with f.open("rb") as fh:
            fh.seek(start)
            left = length
            while left > 0:
                chunk = fh.read(min(1 << 18, left))
                if not chunk:
                    break
                try:
                    self.wfile.write(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    return
                left -= len(chunk)

    def do_GET(self):
        p = self.path.split("?")[0]
        if p == "/":
            return self._file(STATIC / "index.html", "text/html; charset=utf-8")
        if p == "/gallery":
            return self._file(STATIC / "gallery.html", "text/html; charset=utf-8")
        if p == "/api/jobs":
            return self._json(200, [job_view(j) for j in all_jobs()])
        if p == "/api/styles":
            return self._json(200, [{k: S.load(n)[k] for k in ("name", "label", "pitch", "best_for", "title_examples")}
                                    for n in S.names()])
        parts = p.strip("/").split("/")
        if parts[:2] == ["api", "jobs"] and len(parts) == 3 and (config.JOBS / parts[2] / "job.json").exists():
            return self._json(200, job_view(Job(parts[2]), full=True))
        if parts[0] == "files" and len(parts) >= 3:
            base = (config.JOBS / parts[1]).resolve()
            f = (base / "/".join(parts[2:])).resolve()
            if base in f.parents:
                return self._file(f)
        if parts[0] == "styles" and len(parts) == 3 and parts[2] == "character.png" and parts[1] in S.names():
            return self._file(config.STYLES / parts[1] / "character.png", "image/png")
        if parts[0] == "fonts" and len(parts) == 2 and (config.FONTS / parts[1]).is_file():
            return self._file(config.FONTS / parts[1], "font/ttf")
        self._json(404, {"error": "not found"})

    def do_POST(self):
        parts = self.path.strip("/").split("/")
        try:
            body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or b"{}")
        except ValueError:
            return self._json(400, {"error": "bad json"})
        if parts == ["api", "jobs"]:
            subject, title = str(body.get("subject", "")).strip(), str(body.get("title", "")).strip()
            if not subject or not title:
                return self._json(400, {"error": "subject and title are required"})
            minutes = float(body["minutes"]) if body.get("minutes") else None
            j = Job.create(subject, title, None, minutes, int(body.get("shorts") or 3))

            def suggest(j=j):
                j.set_stage("suggest", "running")
                try:
                    write.suggest(j)
                    j.set_stage("suggest", "done")
                except Exception as e:
                    j.set_stage("suggest", "error", str(e))
            threading.Thread(target=suggest, daemon=True).start()
            return self._json(200, {"slug": j.slug})
        if len(parts) == 4 and parts[:2] == ["api", "jobs"] and parts[3] in ("pick", "rerun"):
            j = Job(parts[2])
            if parts[3] == "pick":
                if body.get("style") not in S.names():
                    return self._json(400, {"error": "unknown style"})
                j.meta["style"] = body["style"]
                if body.get("title"):
                    j.meta["title"] = str(body["title"]).strip()
                j.save()
            with LOCK:
                if j.slug not in QUEUE and j.slug not in RUNNING:
                    QUEUE.append(j.slug)
            return self._json(200, job_view(j))
        self._json(404, {"error": "not found"})


def main():
    threading.Thread(target=_scheduler, daemon=True).start()
    port = int(os.environ.get("PORT", "8686"))
    srv = ThreadingHTTPServer(("0.0.0.0", port), H)
    print(f"farm web on http://0.0.0.0:{port}", flush=True)
    srv.serve_forever()


if __name__ == "__main__":
    main()
