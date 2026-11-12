import torch, time, soundfile as sf
from omnivoice import OmniVoice
print("loading model...", flush=True)
t0=time.time()
model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
print("loaded in", round(time.time()-t0,1), "s", flush=True)
ref = "/home/tlab/infographics_Videos/tts/voxcpm/out/vox_darija_1.wav"
ref_text = "شنو هو الطريق السيار المائي؟ هو مشروع كبير بزاف، غادي ينقل الما من الشمال للجنوب."
text = "ف2025، السياح صرفو مية وتمانين مليار درهم، والمغاربة اللي برا صيفطو مية وجوج وعشرين مليار."
t=time.time()
audio = model.generate(text=text, ref_audio=ref, ref_text=ref_text, speed=0.9, num_step=16)
print("generated in", round(time.time()-t,1), "s; audio", round(len(audio[0])/24000,2), "s", flush=True)
sf.write("04-voice/test_omni.wav", audio[0], 24000)
print("saved", flush=True)
