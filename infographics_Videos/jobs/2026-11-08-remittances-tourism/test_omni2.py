import torch, time, soundfile as sf
from omnivoice import OmniVoice
model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
ref = "/home/tlab/infographics_Videos/tts/voxcpm/out/vox_darija_1.wav"
ref_text = "شنو هو الطريق السيار المائي؟ هو مشروع كبير بزاف، غادي ينقل الما من الشمال للجنوب."
text = "ف2025، السياح صرفو مية وتمانين مليار درهم، والمغاربة اللي برا صيفطو مية وجوج وعشرين مليار."
for speed,steps,name in [(0.75,8,"test_075_8"),(0.75,16,"test_075_16")]:
    t=time.time()
    audio = model.generate(text=text, ref_audio=ref, ref_text=ref_text, speed=speed, num_step=steps)
    d=len(audio[0])/24000
    sf.write(f"04-voice/{name}.wav", audio[0], 24000)
    print(name, "speed",speed,"steps",steps,"time",round(time.time()-t,1),"audio",round(d,2), flush=True)
