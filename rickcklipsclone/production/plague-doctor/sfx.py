"""SFX track for the plague-doctor short: toll, whooshes, coughs, pops. 48 kHz mono WAV."""
import json
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).parent
SR = 48000
T = json.load(open(ROOT / "timing.json"))
DUR = T["duration"] + 0.6
N = int(DUR * SR)
rng = np.random.default_rng(5)


def write(path, a):
    a = np.clip(a, -1, 1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((a * 32767).astype(np.int16).tobytes())


def add(buf, t0, s, gain=1.0):
    i0 = max(0, int(t0 * SR))
    i1 = min(len(buf), i0 + len(s))
    if i1 > i0:
        buf[i0:i1] += s[: i1 - i0] * gain


def whoosh(d=0.45):
    n = int(d * SR)
    noise = rng.normal(0, 1, n)
    out = np.zeros(n)
    a = 0.0
    cut = np.linspace(0.02, 0.25, n) * np.hanning(n) + 0.01
    for i in range(n):
        a += cut[i] * (noise[i] - a)
        out[i] = a
    return out * np.hanning(n) * 1.2


def toll():
    d = 1.6
    n = int(d * SR)
    tt = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * dcy) for f, a, dcy in
            [(392, 1, 2.2), (585, .55, 3.0), (792, .3, 4.0), (1568, .12, 6)])
    return s * 0.5


def cough():
    n = int(0.16 * SR)
    noise = rng.normal(0, 1, n) * np.hanning(n)
    tt = np.arange(n) / SR
    return noise * np.sin(2 * np.pi * 140 * tt) * 1.4


def boing():
    d = 0.5
    n = int(d * SR)
    tt = np.arange(n) / SR
    f = 180 + 120 * np.exp(-tt * 6) * np.sin(2 * np.pi * 9 * tt)
    return np.sin(np.cumsum(2 * np.pi * f / SR)) * np.exp(-tt * 5) * 0.6


def pluck(f=520):
    n = int(0.35 * SR)
    tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * f * 2.01 * tt)
    return s * np.exp(-tt * 11) * 0.5


def wt(line, word):
    for w in T["words"]:
        if w["line"] == line and w["w"].lower().strip(".,?!").startswith(word):
            return w["s"]
    raise KeyError((line, word))


sfx = np.zeros(N)
spans = json.load(open(ROOT / "spans.json"))
for s in spans["shots"][1:]:
    add(sfx, max(0, s["g0"] / 30 - 0.2), whoosh(), 0.35 if not s["cut_in"] else 0.0)

add(sfx, wt(0, "sent"), toll(), 0.9)                      # funeral bell on "sent for the bird"
for k in range(3):                                       # sick villager coughs
    add(sfx, wt(0, "die") + 0.15 * k, cough(), 0.5)
for w in ("roses", "mint", "camphor"):                   # herbs dropping into the beak
    add(sfx, wt(6, w), pluck(rng.uniform(480, 620)), 0.5)
for k in range(5):                                       # flea circus
    add(sfx, wt(12, "flea") + 0.14 * k, boing() * 0.5, 0.35)
add(sfx, wt(16, "hazmat"), pluck(880), 0.6)              # payoff ping
write(ROOT / "audio" / "sfx.wav", sfx)
print("sfx", DUR)
