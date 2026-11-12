import torch, time, os, re, sys
import soundfile as sf
import numpy as np
from omnivoice import OmniVoice

OUT = "/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses/voice/omni_chunks"
os.makedirs(OUT, exist_ok=True)

print("loading model...", flush=True)
m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
print("loaded", flush=True)

ref = "/home/tlab/oday/factory/refvoice/ref_zaaM.wav"
ref_text = "Imagine the Prophet, peace be upon him, asking you to recite the Quran to him. That is exactly what happened with a companion named Abdullah ibn Masud."

text = open("/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses/voice/narration.txt").read().strip()
# split into sentences, group into ~2-sentence chunks for speed/stability
sents = re.split(r"(?<=[.!?])\s+", text)
chunks, cur = [], ""
for s in sents:
    cur = (cur + " " + s).strip()
    if len(cur) > 220:
        chunks.append(cur); cur = ""
if cur: chunks.append(cur)
print(f"{len(chunks)} chunks to generate", flush=True)

done = sorted([f for f in os.listdir(OUT) if f.endswith(".wav")])
start = len(done)
print(f"resuming at chunk {start}", flush=True)

for i, chunk in enumerate(chunks[start:], start):
    fn = f"{OUT}/c{i:03d}.wav"
    if os.path.exists(fn): continue
    t = time.time()
    try:
        audio = m.generate(text=chunk, ref_audio=ref, ref_text=ref_text, speed=1.0, num_step=10)
        sf.write(fn, np.asarray(audio[0]), 24000)
        print(f"chunk {i+1}/{len(chunks)} done {round(time.time()-t)}s", flush=True)
    except Exception as e:
        print(f"chunk {i} FAIL {e}", flush=True)

# concat
files = sorted(f for f in os.listdir(OUT) if f.endswith(".wav"))
if files:
    wavs = [sf.read(f"{OUT}/{f}")[0] for f in files]
    out = np.concatenate(wavs)
    sf.write("/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses/voice/voiceover_omni.wav", out, 24000)
    print("CONCAT DONE", round(len(out)/24000,1), "s", flush=True)
