import json, os, re, subprocess, time
import numpy as np, soundfile as sf, torch
from omnivoice import OmniVoice

ROOT = os.path.dirname(os.path.abspath(__file__))
SCENES = json.load(open(os.path.join(ROOT, "tts_scenes.json"), encoding="utf-8"))
REF = "/home/tlab/infographics_Videos/tts/voxcpm/out/vox_darija_1.wav"
REF_TEXT = "شنو هو الطريق السيار المائي؟ هو مشروع كبير بزاف، غادي ينقل الما من الشمال للجنوب."
SR = 24000
SPEED = 0.75
STEPS = 8

def split_chunks(text, max_chars=300):
    sentences = [s.strip() for s in re.split(r"(?<=[.!؟?])\s+", text) if s.strip()]
    chunks, cur = [], ""
    for s in sentences:
        if len(s) > max_chars:
            # split a very long sentence on commas
            parts = [p.strip() for p in re.split(r"[،,]\s*", s) if p.strip()]
            for p in parts:
                if cur and len(cur) + len(p) + 2 > max_chars:
                    chunks.append(cur); cur = p
                else:
                    cur = (cur + "، " + p).strip("، ")
        elif cur and len(cur) + len(s) + 1 > max_chars:
            chunks.append(cur); cur = s
        else:
            cur = (cur + " " + s).strip()
    if cur: chunks.append(cur)
    return chunks

def norm_peak(w, target=0.9):
    peak = float(np.abs(w).max()) or 1.0
    return w / peak * target

print("loading model...", flush=True)
t0 = time.time()
model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
print("loaded in", round(time.time()-t0,1), "s", flush=True)
prompt = model.create_voice_clone_prompt(ref_audio=REF, ref_text=REF_TEXT)
print("prompt ready", flush=True)

timing = []
for i, sc in enumerate(SCENES):
    text = sc.get("text", "").strip()
    scene_path = os.path.join(ROOT, "scene_%02d.wav" % i)
    if not text:
        timing.append({"index": i, "type": sc["type"], "text": "", "audio": None, "duration": 2.0})
        print(i, sc["type"], "chapter card", flush=True)
        continue
    if os.path.exists(scene_path):
        y, sr = sf.read(scene_path, dtype="float32")
        d = len(y)/sr
        timing.append({"index": i, "type": sc["type"], "text": text, "audio": scene_path, "duration": d})
        print(i, sc["type"], "cached", round(d,1), "s", flush=True)
        continue
    chunks = split_chunks(text)
    parts = []
    for j, ch in enumerate(chunks):
        cp = os.path.join(ROOT, "chunks", "scene_%02d_%02d.wav" % (i, j))
        if os.path.exists(cp):
            y, sr = sf.read(cp, dtype="float32")
        else:
            t = time.time()
            audio = model.generate(text=ch, voice_clone_prompt=prompt, speed=SPEED, num_step=STEPS)
            y = np.asarray(audio[0], dtype=np.float32)
            sf.write(cp, y, SR)
            print("  chunk", i, j, len(ch.split()), "words ->", round(len(y)/SR,1), "s in", round(time.time()-t,1), "s", flush=True)
        y = norm_peak(y)
        parts.append(y)
        parts.append(np.zeros(int(0.15*SR), dtype=np.float32))
    final = np.concatenate(parts[:-1]) if parts else np.zeros(0, dtype=np.float32)
    sf.write(scene_path, final, SR)
    d = len(final)/SR
    timing.append({"index": i, "type": sc["type"], "text": text, "audio": scene_path, "duration": d})
    print(i, sc["type"], "done", round(d,1), "s", flush=True)

json.dump(timing, open(os.path.join(ROOT, "timing_raw.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)

# assemble with pauses
cursor = 0.7
parts = [np.zeros(int(0.7*SR), dtype=np.float32)]
timeline = []
for t in timing:
    start = cursor
    if t["duration"] <= 0:
        t["duration"] = 2.0
    if t["audio"] and os.path.exists(t["audio"]):
        y, sr = sf.read(t["audio"], dtype="float32")
    else:
        y = np.zeros(int(2.0*SR), dtype=np.float32)
    parts.append(y)
    cursor += len(y)/SR
    timeline.append({**t, "start": round(start,3), "end": round(cursor,3), "duration": round(len(y)/SR,3)})
    gap = np.zeros(int(0.35*SR), dtype=np.float32)
    parts.append(gap); cursor += 0.35
parts.append(np.zeros(int(0.8*SR), dtype=np.float32))
voice = np.concatenate(parts)
sf.write(os.path.join(ROOT, "voiceover_raw.wav"), voice, SR)
json.dump(timeline, open(os.path.join(ROOT, "timing.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("assembled", round(len(voice)/SR,1), "s", flush=True)

subprocess.run(["ffmpeg","-v","error","-y","-i",os.path.join(ROOT,"voiceover_raw.wav"),
                "-ar","48000","-ac","1","-af","loudnorm=I=-14:TP=-1.5:LRA=11",
                os.path.join(ROOT,"voiceover.wav")], check=True)
print("normalized voiceover.wav", flush=True)
