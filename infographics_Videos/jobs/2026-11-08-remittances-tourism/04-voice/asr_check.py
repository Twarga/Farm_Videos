from faster_whisper import WhisperModel
import sys, time, soundfile as sf, numpy as np
path=sys.argv[1] if len(sys.argv)>1 else "04-voice/scene_00.wav"
y, sr = sf.read(path, dtype="float32")
if y.ndim>1: y=y.mean(axis=1)
if sr != 16000:
    t=np.arange(len(y))/sr
    y=np.interp(np.arange(0, len(y)/sr, 1/16000), t, y).astype(np.float32)
print("audio", round(len(y)/16000,1), "s", flush=True)
t=time.time()
model=WhisperModel("large-v3", device="cpu", compute_type="int8", download_root="/home/tlab/.cache/huggingface/hub")
print("loaded", round(time.time()-t,1), flush=True)
segments, info=model.transcribe(y, language="ar", beam_size=5, vad_filter=True)
print("detected", info.language, round(info.language_probability,2), flush=True)
for s in segments:
    print(f"[{s.start:.1f}-{s.end:.1f}] {s.text}", flush=True)
