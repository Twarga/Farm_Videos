"""Copyright-free music beds and sound effects synthesized in numpy, plus the final mix recipe (ffmpeg)."""
import subprocess

import numpy as np
import soundfile as sf

MSR = 48000
NOTE = {n: i for i, n in enumerate(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"])}


def hz(n):
    name, octv = (n[:-1], int(n[-1]))
    return 440.0 * 2 ** ((NOTE[name] + 12 * (octv + 1) - 69) / 12)


def env(n, a, r, sr=MSR):
    e = np.ones(n, np.float32)
    na, nr = min(n, int(a * sr)), min(n, int(r * sr))
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def add(buf, t, x):
    i = int(t * MSR)
    if i >= len(buf):
        return
    x = x[: len(buf) - i]
    buf[i:i + len(x)] += x


def pluck(f, dur, bright=0.5, rng=None):
    rng = rng or np.random.default_rng(0)
    n, p = int(dur * MSR), max(2, int(MSR / f))
    wave = rng.uniform(-1, 1, p).astype(np.float32)
    out = np.empty(n, np.float32)
    for i in range(n):
        out[i] = wave[i % p]
        wave[i % p] = (wave[i % p] + wave[(i + 1) % p]) * (0.5 * (0.994 + 0.005 * bright))
    return out * env(n, 0.002, 0.08)


def keys(f, dur):
    t = np.arange(int(dur * MSR)) / MSR
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t + 0.5)
    return (x * np.exp(-t * 2.2) * env(len(t), 0.004, 0.15)).astype(np.float32)


def pad(freqs, dur):
    t = np.arange(int(dur * MSR)) / MSR
    x = sum(np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.004 * t + 1.3) for f in freqs) / len(freqs)
    return (x * env(len(t), dur * 0.3, dur * 0.35)).astype(np.float32)


def kick(v=1.0):
    t = np.arange(int(0.25 * MSR)) / MSR
    f = 110 * np.exp(-t * 18) + 45
    return (np.sin(2 * np.pi * np.cumsum(f) / MSR) * np.exp(-t * 14) * v).astype(np.float32)


def noise(dur, rng, lp=0.2):
    x = rng.normal(0, 1, int(dur * MSR)).astype(np.float32)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):  # one-pole lowpass
        acc += lp * (x[i] - acc)
        y[i] = acc
    return y


def hat(rng):
    x = rng.normal(0, 1, int(0.05 * MSR)).astype(np.float32)
    x = np.diff(x, prepend=0)  # crude highpass
    return x * np.exp(-np.arange(len(x)) / MSR * 90) * 0.25


PROGS = {
    "bright": {"bpm": 104, "chords": [["C4", "E4", "G4"], ["G3", "B3", "D4"], ["A3", "C4", "E4"], ["F3", "A3", "C4"]],
               "bass": ["C2", "G2", "A2", "F2"]},
    "lofi": {"bpm": 76, "chords": [["A3", "C4", "E4", "G4"], ["F3", "A3", "C4", "E4"], ["C4", "E4", "G4", "B4"],
                                   ["G3", "B3", "D4", "F4"]], "bass": ["A1", "F1", "C2", "G1"]},
}


def music(kind, seconds, seed=7):
    """An 8-bar loop tiled to `seconds`, with fades. Returns float32 stereo at 48k."""
    rng = np.random.default_rng(seed)
    P = PROGS[kind]
    beat = 60 / P["bpm"]
    bars = 8
    loop = np.zeros(int(bars * 4 * beat * MSR) + MSR, np.float32)
    for b in range(bars):
        ci = b % 4
        t0 = b * 4 * beat
        chord = [hz(n) for n in P["chords"][ci]]
        add(loop, t0, pad(chord, 4 * beat) * 0.18)
        add(loop, t0, keys(hz(P["bass"][ci]), 2 * beat) * 0.35)
        add(loop, t0 + 2 * beat, keys(hz(P["bass"][ci]), 2 * beat) * 0.25)
        if kind == "bright":
            for k in range(8):  # eighth-note arpeggio
                f = chord[(k * 2 + b) % len(chord)] * (2 if k % 4 == 3 else 1)
                add(loop, t0 + k * beat / 2, pluck(f, 0.5, rng=rng) * (0.22 if k % 2 == 0 else 0.15))
            for k in range(4):
                add(loop, t0 + k * beat, kick(0.35 if k % 2 == 0 else 0.2))
                add(loop, t0 + k * beat + beat / 2, hat(rng))
        else:
            for k, step in enumerate([0, 1.5, 2.5, 3.25]):
                add(loop, t0 + step * beat, keys(chord[(k + b) % len(chord)] * 2, 1.2) * 0.16)
            add(loop, t0, kick(0.3))
            add(loop, t0 + 2.5 * beat, kick(0.2))
            for k in range(8):
                add(loop, t0 + k * beat / 2 + (0.03 if k % 2 else 0), hat(rng) * 0.7)
    L = int(bars * 4 * beat * MSR)
    loop = loop[:L]
    n = int(seconds * MSR)
    out = np.tile(loop, n // L + 1)[:n]
    if kind == "lofi":  # vinyl crackle
        crack = np.zeros(n, np.float32)
        idx = rng.integers(0, n, n // 1800)
        crack[idx] = rng.uniform(-0.5, 0.5, len(idx))
        out += crack * 0.15 + rng.normal(0, 0.004, n).astype(np.float32)
    out /= max(1e-6, np.abs(out).max())
    out *= env(n, 2.0, 4.0)
    st = np.stack([out, np.roll(out, 240)], axis=1) * 0.8
    return st


def whoosh(rng):
    dur = 0.6
    x = noise(dur, rng, 0.08) * 6
    e = np.sin(np.linspace(0, np.pi, len(x))) ** 2
    return x * e * 0.5


def pop(f0=600, f1=1000):
    t = np.arange(int(0.12 * MSR)) / MSR
    f = np.linspace(f0, f1, len(t))
    return (np.sin(2 * np.pi * np.cumsum(f) / MSR) * np.exp(-t * 30) * 0.45).astype(np.float32)


def sfx_track(events, seconds, seed=3):
    """events: list of (time, kind) with kind in {'whoosh','pop','tick'}."""
    rng = np.random.default_rng(seed)
    buf = np.zeros(int(seconds * MSR) + MSR, np.float32)
    for t, kind in events:
        if kind == "whoosh":
            add(buf, max(0, t - 0.25), whoosh(rng))
        elif kind == "pop":
            add(buf, t, pop())
        elif kind == "tick":
            add(buf, t, pop(1400, 1200) * 0.5)
    buf = buf[: int(seconds * MSR)]
    return np.stack([buf, buf], axis=1)


def mix(voice_wav, music_wav, sfx_wav, out_wav, music_db=-15, sfx_db=-6):
    """Voice: high-pass + light compression. Music: ducked under the voice (sidechain). Then limiter + -14 LUFS."""
    fc = (f"[0]aresample=48000,highpass=f=70,acompressor=threshold=0.12:ratio=2.5:attack=5:release=120:makeup=1.3,"
          f"asplit=2[vo][key];"
          f"[1]volume={music_db}dB[m0];[m0][key]sidechaincompress=threshold=0.02:ratio=6:attack=30:release=500[m];"
          f"[2]volume={sfx_db}dB[s];"
          f"[vo][m][s]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.89:level=false,"
          f"loudnorm=I=-14:TP=-1.5:LRA=9[a]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", voice_wav, "-i", music_wav, "-i", sfx_wav,
                    "-filter_complex", fc, "-map", "[a]", "-ar", "48000", "-ac", "2", out_wav], check=True)


def write(path, data, sr=MSR):
    sf.write(path, data, sr)
