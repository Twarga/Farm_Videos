"""Long-form render: timeline from voice durations → frames (Pillow, one process per chapter) → ffmpeg."""
import concurrent.futures as cf
import os
import zlib
import subprocess

import numpy as np
import soundfile as sf

from . import audio, config, gfx, style as S
from .job import Job

GAP, CHAPTER_TAIL = 0.25, 0.45
TRANS = {"roster": 1.5, "titlecard": 2.0}


def timeline(job, st):
    """Every segment with absolute start/duration. Saved to timeline.json (used by shorts and chapter timestamps)."""
    chs = job.read("shots.json")["chapters"]
    durs = job.read("voice.json")["durations"]
    segs, voice, sfx, chapters = [], [], [], []
    t, num = 0.0, 0
    for ci, ch in enumerate(chs):
        ch_start = t
        if not ch.get("intro"):
            num += 1
            td = TRANS[st["transition"]]
            segs.append({"type": "transition", "ci": ci, "num": num, "start": t, "dur": td})
            sfx.append((t, "whoosh"))
            t += td
        for si, s in enumerate(ch["shots"]):
            d = durs[ci][si] + GAP + (CHAPTER_TAIL if si == len(ch["shots"]) - 1 else 0)
            segs.append({"type": s["kind"], "ci": ci, "si": si, "start": t, "dur": d})
            voice.append((t, f"voice/{ci:02d}_{si:03d}.wav"))
            if s["kind"] == "card":
                sfx.append((t, "pop"))
            t += d
        chapters.append({"name": gfx.clean_name(ch["name"]), "intro": bool(ch.get("intro")), "start": ch_start, "end": t})
    tl = {"duration": t, "segments": segs, "voice": voice, "sfx": sfx, "chapters": chapters}
    job.write("timeline.json", tl)
    return tl


class Painter:
    """Draws any segment at local time `tau`, at any output size (long 1920×1080 or the shorts' inner frame)."""

    def __init__(self, job, st):
        self.st = st
        self.chs = job.read("shots.json")["chapters"]
        self.body = [c for c in self.chs if not c.get("intro")]

    def bg(self, ci, si=0):
        """The flat background color the image model actually produced near this shot (for cards / canvases)."""
        shots = self.chs[ci]["shots"]
        order = list(range(si, -1, -1)) + list(range(si + 1, len(shots)))
        key = next((shots[k]["image"] for k in order if shots[k]["kind"] == "image"), None)
        return gfx.edge_color(key, self.st["palette"]["bg"])

    def frame(self, seg, tau, W, H, fi=0):
        st, ch = self.st, self.chs[seg["ci"]]
        bg = st["palette"]["bg"]
        if seg["type"] == "transition":
            if st["transition"] == "roster":
                idx = self.body.index(ch)
                im = gfx.roster_frame(st, self.body, idx, tau, W, H)
            else:
                im = gfx.titlecard_frame(st, seg["num"], ch["name"], tau, seg["dur"], W, H)
            return gfx.finish(im, st, fi) if st["transition"] != "roster" else im
        s = ch["shots"][seg["si"]]
        t01 = tau / seg["dur"]
        if s["kind"] == "card":
            im = gfx.camera_frame(gfx.card(st, s["text"], W, H, self.bg(seg["ci"], seg["si"])), W, H, t01, "push")
        else:
            base = gfx.source(s["image"], W, H, bg, s.get("scene", ""))
            im = gfx.camera_frame(base, W, H, t01, s.get("camera", "push"))
            if st["frame"].get("label") and not ch.get("intro"):
                im = im.convert("RGBA")
                im.alpha_composite(gfx.label_overlay(ch["name"], W, H, st["palette"]["ink"], st["fonts"]["label"],
                                                     int(H * 0.074)))
                im = im.convert("RGB")
        return gfx.finish(im, st, fi)


def encoder(path, W, H):
    return subprocess.Popen(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(config.FPS),
         "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", str(path)],
        stdin=subprocess.PIPE)


def _render_chapter(slug, ci, W, H):
    job = Job(slug)
    st = S.load(job.style)
    tl = job.read("timeline.json")
    painter = Painter(job, st)
    segs = [s for s in tl["segments"] if s["ci"] == ci]
    out = job.path(f"render/ch{ci:02d}.mp4")
    p = encoder(out, W, H)
    fi = 0
    for seg in segs:
        n = round(seg["dur"] * config.FPS)
        for k in range(n):
            p.stdin.write(painter.frame(seg, k / config.FPS, W, H, fi).tobytes())
            fi += 1
    p.stdin.close()
    p.wait()
    return str(out)


def audio_tracks(job, st, tl, start=0.0, end=None, tag="long"):
    """Voice/music/sfx wavs for the [start, end) window, then the final mix. Returns the mix path."""
    end = tl["duration"] if end is None else end
    dur = end - start
    v = np.zeros(int(dur * config.SR) + config.SR, np.float32)
    for t, f in tl["voice"]:
        if start <= t < end:
            x, _ = sf.read(job.path(f), dtype="float32")
            i = int((t - start) * config.SR)
            v[i:i + len(x)] += x[: len(v) - i]
    rd = job.path("render")
    vp, mp, sp, out = (str(rd / f"{tag}_{n}.wav") for n in ("voice", "music", "sfx", "mix"))
    sf.write(vp, v[: int(dur * config.SR)], config.SR)
    audio.write(mp, audio.music(st["music"], dur, seed=zlib.crc32(job.slug.encode()) % 1000))
    audio.write(sp, audio.sfx_track([(t - start, k) for t, k in tl["sfx"] if start <= t < end], dur))
    audio.mix(vp, mp, sp, out)
    return out


def run(job, st, workers=None):
    tl = timeline(job, st)
    job.path("render").mkdir(exist_ok=True)
    W, H = config.LONG_W, config.LONG_H
    n = len(job.read("shots.json")["chapters"])
    workers = workers or max(1, (os.cpu_count() or 2) - 1)
    job.set_stage("render", "running", f"0/{n} chapters")
    with cf.ProcessPoolExecutor(workers) as ex:
        futs = [ex.submit(_render_chapter, job.slug, ci, W, H) for ci in range(n)]
        for k, f in enumerate(cf.as_completed(futs), 1):
            f.result()
            job.set_stage("render", "running", f"{k}/{n} chapters")
    lst = job.path("render/concat.txt")
    lst.write_text("".join(f"file 'ch{ci:02d}.mp4'\n" for ci in range(n)))
    video = job.path("render/video.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy",
                    str(video)], check=True)
    mix = audio_tracks(job, st, tl)
    job.path("out").mkdir(exist_ok=True)
    final = job.path("out/long.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-i", mix, "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
                    str(final)], check=True)
    job.log(f"long video: {final} ({tl['duration'] / 60:.1f} min)")
    return final
