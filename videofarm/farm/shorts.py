"""Shorts: one self-contained chapter (≤ 58 s) recut to 9:16 with a header, the 16:9 picture, and burned captions."""
import re
import subprocess

from PIL import Image

from . import config, gfx, style as S
from .render import Painter, audio_tracks, encoder

MAX = 58.0


def pick(tl, n):
    """Chapters whose spoken part fits in a Short; prefer ones close to 45 s, keep video order."""
    cands = []
    for ci, ch in enumerate(tl["chapters"]):
        if ch["intro"]:
            continue
        segs = [s for s in tl["segments"] if s["ci"] == ci and s["type"] != "transition"]
        dur = sum(s["dur"] for s in segs)
        cands.append((abs(min(dur, MAX) - 45) + (30 if dur > MAX else 0), ci))
    return sorted(ci for _, ci in sorted(cands)[:n])


def caption_chunks(line, start, dur, max_words=3):
    words = line.split()
    chunks, cur = [], []
    for w in words:
        cur.append(w)
        if len(cur) >= max_words or re.search(r"[.,!?;:]$", w):
            chunks.append(" ".join(cur))
            cur = []
    if cur:
        chunks.append(" ".join(cur))
    weights = [len(c) + 3 for c in chunks]
    tot, t, out = sum(weights), start, []
    for c, wgt in zip(chunks, weights):
        d = dur * wgt / tot
        out.append((t, t + d, c.rstrip(",;:")))
        t += d
    return out


def render_short(job, st, tl, ci, k):
    W, H = config.SHORT_W, config.SHORT_H
    sl = st["short_layout"]
    painter = Painter(job, st)
    chs = job.read("shots.json")["chapters"]
    durs = job.read("voice.json")["durations"]
    segs, total = [], 0.0
    for s in tl["segments"]:
        if s["ci"] != ci or s["type"] == "transition":
            continue
        if total + s["dur"] > MAX and segs:
            break
        segs.append(s)
        total += s["dur"]
    start, end = segs[0]["start"], segs[0]["start"] + total
    caps = []
    for s in segs:
        line = chs[ci]["shots"][s["si"]]["line"]
        caps += caption_chunks(line, s["start"] - start, durs[ci][s["si"]])

    canvas = painter.bg(ci, segs[0]["si"]) if sl["bg"] == st["palette"]["bg"] else sl["bg"]
    head = Image.new("RGB", (W, H), gfx.hexrgb(canvas))
    gfx.draw_center(head, job.meta["title"], st["fonts"]["title"], (60, 150, W - 60, 300),
                    gfx.hexrgb(sl["header_color"]), start=54)
    gfx.draw_center(head, gfx.clean_name(chs[ci]["name"]).upper(), st["fonts"]["card"], (50, 300, W - 50, 560),
                    gfx.hexrgb(st["palette"]["accent"] if st["name"] == "stickman" else sl["header_color"]), start=150)
    iw, ih = W, int(W * 9 / 16)
    top = 600
    path = job.path(f"render/short_{k:02d}_video.mp4")
    p = encoder(path, W, H)
    fi, ti = 0, 0.0
    for s in segs:
        n = round(s["dur"] * config.FPS)
        for j in range(n):
            tau = j / config.FPS
            inner = painter.frame(s, tau, config.LONG_W, config.LONG_H, fi).resize((iw, ih), Image.BILINEAR)
            fr = head.copy()
            fr.paste(inner, (0, top))
            cur = next((c for a, b, c in caps if a <= ti < b), None)
            if cur:
                gfx.caption(fr, cur, (60, top + ih + 110, W - 60, top + ih + 420), st, 120)
            p.stdin.write(fr.tobytes())
            fi += 1
            ti += 1 / config.FPS
    p.stdin.close()
    p.wait()
    tl_short = {**tl, "sfx": [(t, kd) for t, kd in tl["sfx"] if kd != "whoosh"]}
    mix = audio_tracks(job, st, tl_short, start, end, tag=f"short{k:02d}")
    final = job.path(f"out/short_{k:02d}.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(path), "-i", mix, "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
                    str(final)], check=True)
    job.log(f"short {k}: {chs[ci]['name']} ({total:.0f}s)")
    return final


def run(job, st):
    tl = job.read("timeline.json")
    n = int(job.meta.get("shorts") or 3)
    out = []
    for k, ci in enumerate(pick(tl, n), 1):
        job.set_stage("shorts", "running", f"{k}/{n}")
        out.append(str(render_short(job, st, tl, ci, k)))
    return out
