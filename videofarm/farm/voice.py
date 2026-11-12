"""Kokoro TTS, one wav per sentence. The clip length is the shot length — picture and voice cannot drift."""
import numpy as np
import soundfile as sf

from . import config

_kokoro = None


def _engine():
    global _kokoro
    if _kokoro is None:
        from kokoro_onnx import Kokoro
        _kokoro = Kokoro(str(config.MODELS / "kokoro-v1.0.onnx"), str(config.MODELS / "voices-v1.0.bin"))
    return _kokoro


def _trim(x, thr=0.008, keep=0.04):
    idx = np.flatnonzero(np.abs(x) > thr)
    if not len(idx):
        return x
    pad = int(keep * config.SR)
    return x[max(0, idx[0] - pad): idx[-1] + pad]


def say(text, voice, speed):
    lang = "en-gb" if voice.startswith("b") else "en-us"
    samples, sr = _engine().create(text, voice=voice, speed=speed, lang=lang)
    assert sr == config.SR, sr
    return _trim(np.asarray(samples, dtype=np.float32))


def run(job, st):
    shots = job.read("shots.json")["chapters"]
    vdir = job.path("voice")
    vdir.mkdir(exist_ok=True)
    v = st["voice"]
    durs = []
    total = sum(len(c["shots"]) for c in shots)
    done = 0
    for ci, ch in enumerate(shots):
        row = []
        for si, s in enumerate(ch["shots"]):
            f = vdir / f"{ci:02d}_{si:03d}.wav"
            if not f.exists():
                sf.write(f, say(s["line"], v["id"], v["speed"]), config.SR)
            row.append(round(sf.info(f).duration, 3))
            done += 1
        durs.append(row)
        job.set_stage("voice", "running", f"{done}/{total}")
    job.write("voice.json", {"durations": durs})
    secs = sum(map(sum, durs))
    job.log(f"voice: {total} clips, {secs / 60:.1f} min of speech")
    return durs
