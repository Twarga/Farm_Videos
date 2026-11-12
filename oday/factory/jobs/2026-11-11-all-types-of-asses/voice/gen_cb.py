import torch, time, os, re
import soundfile as sf
import numpy as np
from chatterbox.tts import ChatterboxTTS

OUT = "/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses/voice/cb_chunks"
os.makedirs(OUT, exist_ok=True)

print("loading chatterbox...", flush=True)
m = ChatterboxTTS.from_pretrained(device="cpu")
print("loaded", flush=True)

ref = "/home/tlab/oday/factory/refvoice/ref_zaaM.wav"

text = open("/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses/voice/narration.txt").read().strip()
sents = re.split(r"(?<=[.!?])\s+", text)
chunks, cur = [], ""
for s in sents:
    cur = (cur + " " + s).strip()
    if len(cur) > 200:
        chunks.append(cur); cur = ""
if cur: chunks.append(cur)
print(f"{len(chunks)} chunks", flush=True)

start = len([f for f in os.listdir(OUT) if f.endswith(".wav")])
print(f"resuming at chunk {start}", flush=True)

for i, chunk in enumerate(chunks[start:], start):
    fn = f"{OUT}/c{i:03d}.wav"
    if os.path.exists(fn): continue
    t = time.time()
    try:
        wav = m.generate(chunk, audio_prompt_path=ref)
        sf.write(fn, np.asarray(wav).flatten(), m.sr)
        print(f"chunk {i+1}/{len(chunks)} {round(time.time()-t)}s", flush=True)
    except Exception as e:
        print(f"chunk {i} FAIL {e}", flush=True)

files = sorted(f for f in os.listdir(OUT) if f.endswith(".wav"))
wavs = [sf.read(f"{OUT}/{f}")[0] for f in files]
out = np.concatenate(wavs)
sf.write("/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses/voice/voiceover_cb.wav", out, m.sr)
print("CONCAT DONE", round(len(out)/m.sr,1), "s", flush=True)
