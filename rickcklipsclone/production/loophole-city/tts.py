"""Narration via Kokoro ONNX (CPU). Sentence-by-sentence synthesis, tight gaps."""
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

K = Path.home() / "kokoro-web"
OUT = Path(__file__).parent / "audio"
VOICE = sys.argv[1] if len(sys.argv) > 1 else "am_michael"
SPEED = float(sys.argv[2]) if len(sys.argv) > 2 else 1.12

LINES = Path(__file__).with_name("script.txt").read_text().strip().splitlines()

kokoro = Kokoro(str(K / "kokoro-v1.0.onnx"), str(K / "voices-v1.0.bin"))
SR = 24000


def trim(a, thr=0.012):
    idx = np.where(np.abs(a) > thr)[0]
    if len(idx) == 0:
        return a
    s = max(idx[0] - int(0.01 * SR), 0)
    e = min(idx[-1] + int(0.04 * SR), len(a))
    return a[s:e]


parts = []
for i, line in enumerate(LINES):
    line = line.strip()
    if not line:
        continue
    a, sr = kokoro.create(line, voice=VOICE, speed=SPEED, lang="en-us")
    assert sr == SR
    a = trim(a)
    parts.append(a)
    # short beat between sentences; slightly longer after questions / reveals
    gap = 0.22 if line.endswith(("?", "…")) else 0.12
    parts.append(np.zeros(int(gap * SR), dtype=a.dtype))
audio = np.concatenate(parts[:-1])
audio = audio / np.abs(audio).max() * 0.89
OUT.mkdir(exist_ok=True)
out = OUT / f"vo_{VOICE}.wav"
sf.write(out, audio, SR)
words = sum(len(l.split()) for l in LINES)
print(f"{out} dur={len(audio)/SR:.1f}s words={words} wpm={words/(len(audio)/SR)*60:.0f}")
