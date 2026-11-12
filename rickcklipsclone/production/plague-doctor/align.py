"""Word timings: faster-whisper on the VO, then mapped onto the exact script words
(so captions use script spelling). Output: timing.json with words + sentence spans."""
import difflib
import json
import re
from pathlib import Path

from faster_whisper import WhisperModel

ROOT = Path(__file__).parent
VO = ROOT / "audio" / "vo_am_michael.wav"
lines = [l.strip() for l in (ROOT / "script.txt").read_text().splitlines() if l.strip()]

m = WhisperModel("base", device="cpu", compute_type="int8")
import subprocess

import numpy as np

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(VO), "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                     capture_output=True, check=True).stdout
pcm = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
segs, _ = m.transcribe(pcm, word_timestamps=True, initial_prompt=" ".join(lines), language="en")
heard = [(w.start, w.end, w.word.strip()) for s in segs for w in s.words]


def norm(t):
    return re.sub(r"[^a-z0-9]", "", t.lower())


script_words = []          # (text, sentence_index)
for i, l in enumerate(lines):
    for w in l.split():
        script_words.append((w, i))

a = [norm(w) for w, _ in script_words]
b = [norm(w) for *_, w in heard]
times = [None] * len(a)
for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1):
            times[i1 + k] = heard[j1 + k][:2]
    elif tag == "replace":
        # spread the heard span evenly across the script span
        t0, t1 = heard[j1][0], heard[j2 - 1][1]
        n = i2 - i1
        for k in range(n):
            times[i1 + k] = (t0 + (t1 - t0) * k / n, t0 + (t1 - t0) * (k + 1) / n)
# fill gaps (deleted in audio match) by interpolation from neighbours
for i, t in enumerate(times):
    if t is None:
        prev = next((times[j][1] for j in range(i - 1, -1, -1) if times[j]), 0.0)
        nxt = next((times[j][0] for j in range(i + 1, len(times)) if times[j]), prev + 0.3)
        times[i] = (prev, max(prev + 0.05, nxt))
missing = sum(1 for t in times if t is None)

words = [{"w": w, "s": round(t[0], 3), "e": round(t[1], 3), "line": li}
         for (w, li), t in zip(script_words, times)]
sentences = []
for i, l in enumerate(lines):
    ws = [w for w in words if w["line"] == i]
    sentences.append({"i": i, "text": l, "s": ws[0]["s"], "e": ws[-1]["e"]})
import soundfile as sf
dur = sf.info(str(VO)).duration
json.dump({"duration": dur, "words": words, "sentences": sentences}, open(ROOT / "timing.json", "w"), indent=1)
eq = sum(1 for x, y in zip(a, b) if x == y)
print(f"heard={len(heard)} script={len(a)} dur={dur:.2f}")
for s in sentences:
    print(f"{s['i']:2d} {s['s']:6.2f}-{s['e']:6.2f}  {s['text'][:70]}")
