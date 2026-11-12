"""Procedural music bed (mischievous pizzicato loop) + SFX track, 48 kHz mono WAVs.
Sits under the VO; final levels are set in assemble.py."""
import json
import math
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


def pluck(freq, dur=0.5, bright=0.6):
    """Karplus-Strong plucked string."""
    n = int(dur * SR)
    p = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, p)
    out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = bright * 0.5 * (buf[i % p] + buf[(i + 1) % p]) + (1 - bright) * buf[i % p] * 0.996
    return out * np.exp(-np.linspace(0, 6, n))


def note(m):
    return 440 * 2 ** ((m - 69) / 12)


def add(track, t, sig, gain=1.0):
    i = int(t * SR)
    if i >= len(track):
        return
    sig = sig[: len(track) - i]
    track[i:i + len(sig)] += sig * gain


# ---------------- music: D minor sneaky pizzicato, 112 bpm
bpm = 112
beat = 60 / bpm
music = np.zeros(N)
prog = [(50, [62, 65, 69, 65]), (46, [62, 65, 70, 65]), (48, [64, 67, 72, 67]), (45, [61, 64, 69, 64])]
cache = {}


def cached_pluck(m, dur, bright):
    k = (m, dur, bright)
    if k not in cache:
        cache[k] = pluck(note(m), dur, bright)
    return cache[k]


t, bar = 0.0, 0
while t < DUR:
    bass, arp = prog[bar % 4]
    add(music, t, cached_pluck(bass - 12, 0.9, 0.5), 0.55)
    add(music, t + 2 * beat, cached_pluck(bass - 12, 0.6, 0.5), 0.4)
    for k in range(8):
        m = arp[k % 4] + (12 if (bar % 2 and k in (5, 7)) else 0)
        add(music, t + k * beat / 2, cached_pluck(m, 0.35, 0.7), 0.28 if k % 2 else 0.36)
    for k in range(4):           # soft tick on beats
        tick = rng.uniform(-1, 1, int(0.03 * SR)) * np.exp(-np.linspace(0, 9, int(0.03 * SR)))
        add(music, t + k * beat, np.diff(tick, prepend=0), 0.18)
    t += 4 * beat
    bar += 1
fade = np.ones(N)
fade[: int(0.3 * SR)] = np.linspace(0, 1, int(0.3 * SR))
fade[-int(0.8 * SR):] = np.linspace(1, 0, int(0.8 * SR))
music = music * fade
music /= np.abs(music).max()
write(ROOT / "audio" / "music.wav", music * 0.9)

# ---------------- SFX
sfx = np.zeros(N)


def squeak():
    d = 0.12
    n = int(d * SR)
    f = np.linspace(3200, 4200, n) + 300 * np.sin(np.linspace(0, 30, n))
    ph = np.cumsum(2 * np.pi * f / SR)
    return np.sin(ph) * np.hanning(n) * 0.5


def clink():
    d = 0.6
    n = int(d * SR)
    tt = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * dcy) for f, a, dcy in
            [(2350, 1, 9), (3730, .6, 12), (5180, .4, 16), (6900, .25, 20)])
    return s * 0.45


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


def boing():
    d = 0.5
    n = int(d * SR)
    tt = np.arange(n) / SR
    f = 180 + 120 * np.exp(-tt * 6) * np.sin(2 * np.pi * 9 * tt)
    return np.sin(np.cumsum(2 * np.pi * f / SR)) * np.exp(-tt * 5) * 0.6


def wt(line, word):
    for w in T["words"]:
        if w["line"] == line and w["w"].lower().strip(".,?!").startswith(word):
            return w["s"]
    raise KeyError((line, word))


spans = json.load(open(ROOT / "spans.json"))
for s in spans["shots"][1:]:
    add(sfx, max(0, s["g0"] / 30 - 0.2), whoosh(), 0.35 if not s["cut_in"] else 0.0)
for t0, n_sq in [(wt(0, "let"), 2), (wt(1, "crawling"), 4), (wt(7, "more"), 5), (wt(8, "rats"), 4), (wt(11, "babies"), 3),
                 (wt(13, "full"), 4), (wt(15, "rat"), 2)]:
    for k in range(n_sq):
        add(sfx, t0 + k * 0.17 + rng.uniform(0, 0.05), squeak(), 0.35)
for t0 in [wt(2, "cent"), wt(4, "hundreds"), wt(4, "thousands"), wt(10, "pays"), wt(11, "cent")]:
    add(sfx, t0, clink(), 0.5)
for k in range(5):
    add(sfx, wt(4, "thousands") + 0.12 * k, clink(), 0.25)
add(sfx, wt(9, "wait") - 0.05, boing(), 0.6)
write(ROOT / "audio" / "sfx.wav", sfx)
print("music+sfx", DUR)
