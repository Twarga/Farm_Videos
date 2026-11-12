"""Join shot renders (dissolves between shots), burn 1-3 word captions, mix audio, export.

python assemble.py [--out final.mp4] [--test 1]
  --test 1: skip the frame timeline, captions + audio over a flat colour (checks timing/mix early)
"""
import json
import os
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).parent
args = dict(zip(sys.argv[1::2], sys.argv[2::2]))
OUT = ROOT / "out" / args.get("--out", "final.mp4")
TEST = args.get("--test") == "1"
spans = json.load(open(ROOT / "spans.json"))
timing = json.load(open(ROOT / "timing.json"))
FPS, HANDLE = spans["fps"], spans["handle"]
shots = spans["shots"]

# ---------------- timeline: symlinks for plain frames, blended PNGs for dissolves
tl = ROOT / "timeline"
tl.mkdir(exist_ok=True)
for f in tl.iterdir():
    f.unlink()


def src(k, local):          # 1-based local frame of shot k
    return ROOT / "frames" / f"s{k:02d}" / f"{local:04d}.png"


g = 0
for k, s in enumerate(shots):
    length = s["g1"] - s["g0"]
    if TEST:
        g += length
        continue
    for j in range(length):
        dst = tl / f"{g:05d}.png"
        blend = k > 0 and not s["cut_in"] and j < HANDLE
        if blend:
            prev = shots[k - 1]
            a = (j + 1) / (HANDLE + 1)
            pa = np.asarray(Image.open(src(k - 1, prev["g1"] - prev["g0"] + j + 1)).convert("RGB"), np.float32)
            pb = np.asarray(Image.open(src(k, j + 1)).convert("RGB"), np.float32)
            Image.fromarray((pa * (1 - a) + pb * a).astype(np.uint8)).save(dst, compress_level=1)
        else:
            os.symlink(src(k, j + 1), dst)
        g += 1
total = g
print("timeline frames", total, total / FPS)

# ---------------- captions (ASS), 1-3 words per card
SHORT = {"a", "an", "the", "to", "of", "in", "and", "my", "your", "his", "their", "one", "no", "for", "with", "at",
         "on", "by", "is", "it", "us", "we'll", "so", "but", "then", "every", "more", "rat", "bigger", "brand", "new",
         "dead", "entire", "whole", "past", "not", "they"}
DANGLING = {"a", "an", "the", "of", "to", "my", "your", "his", "their", "we'll"}   # glue to the next word
MAX_CHARS = 15                                                                          # keeps cards inside 1080 px
words = timing["words"]
units, pend = [], []
for w in words:                       # a unit = dangling words + the word they lead into
    pend.append(w)
    if w["w"].lower() not in DANGLING or w["w"][-1] in ",.?!":
        units.append(pend)
        pend = []
if pend:
    units.append(pend)


def chars(ws):
    return len(" ".join(x["w"] for x in ws))


chunks, cur = [], []
for i, u in enumerate(units):
    if cur and (chars(cur + u) > MAX_CHARS or u[0]["line"] != cur[-1]["line"]):
        chunks.append(cur)
        cur = []
    cur += u
    last = cur[-1]["w"]
    if last[-1] in ",.?!" or len(cur) >= 3 or (len(cur) >= 2 and last.lower() not in SHORT):
        chunks.append(cur)
        cur = []
if cur:
    chunks.append(cur)


def ts(t):
    h, rem = divmod(max(t, 0), 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


lines = []
for i, c in enumerate(chunks):
    start = c[0]["s"]
    end = chunks[i + 1][0]["s"] if i + 1 < len(chunks) else c[-1]["e"] + 0.3
    end = min(end, c[-1]["e"] + 0.45)
    txt = " ".join(x["w"] for x in c)
    lines.append(f"Dialogue: 0,{ts(start)},{ts(end)},Cap,,0,0,0,,{{\\an5\\pos(540,1345)}}{txt}")
ass = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Montserrat Black,100,&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,0,0,0,0,100,100,0,0,1,6,4,5,40,40,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""" + "\n".join(lines) + "\n"
(ROOT / "captions.ass").write_text(ass)
print("captions", len(chunks))

# ---------------- encode: frames + captions + VO/music/sfx mix, -14 LUFS
fonts = Path.home() / ".local/share/fonts"
# grade in display space: richer colour + gentle vignette (reference look), then captions on top
vf = f"eq=saturation=1.15:contrast=1.05,vignette=angle=PI/9,subtitles={ROOT / 'captions.ass'}:fontsdir={fonts}"
dur = total / FPS
video_in = (["-f", "lavfi", "-i", f"color=c=0x4a6a8a:s=1080x1920:r={FPS}:d={dur:.3f}"] if TEST
            else ["-framerate", str(FPS), "-i", str(tl / "%05d.png")])
cmd = [
    "ffmpeg", "-y", "-v", "error", "-stats",
    *video_in,
    "-i", str(ROOT / "audio" / "vo_am_michael.wav"),
    "-i", str(ROOT / "audio" / "music.wav"),
    "-i", str(ROOT / "audio" / "sfx.wav"),
    "-filter_complex",
    f"[0:v]{vf},format=yuv420p[v];"
    "[1:a]aresample=48000,volume=1.0[vo];"
    "[2:a]volume=0.05[mu];"
    "[3:a]volume=0.55[fx];"
    "[vo][mu][fx]amix=inputs=3:normalize=0:duration=longest,"
    f"atrim=0:{dur:.3f},loudnorm=I=-14:TP=-1.5:LRA=11[a]",
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-profile:v", "high", "-r", str(FPS),
    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart",
    "-t", f"{dur:.3f}", str(OUT),
]
OUT.parent.mkdir(exist_ok=True)
subprocess.run(cmd, check=True)
print("wrote", OUT)
