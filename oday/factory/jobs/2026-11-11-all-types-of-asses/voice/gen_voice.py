import sys, soundfile as sf, numpy as np
from kokoro_onnx import Kokoro
MODEL="/home/tlab/projects/small-model-battle-video/models/tts/kokoro-v1.0.onnx"
VOICES="/home/tlab/projects/small-model-battle-video/models/tts/voices-v1.0.bin"
k = Kokoro(MODEL, VOICES)
text = open("/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses/voice/narration.txt").read()
samples, sr = k.create(text, voice="bm_george", speed=1.0, lang="en-us")
sf.write("/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses/voice/voiceover.wav", samples, sr)
print("done", len(samples)/sr, "sec")
