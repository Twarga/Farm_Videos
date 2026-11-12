import torch, time, soundfile as sf
from omnivoice import OmniVoice
model=OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
ref="/home/tlab/infographics_Videos/tts/voxcpm/out/vox_darija_1.wav"
ref_text="شنو هو الطريق السيار المائي؟ هو مشروع كبير بزاف، غادي ينقل الما من الشمال للجنوب."
prompt=model.create_voice_clone_prompt(ref_audio=ref, ref_text=ref_text)
cases={
 "digits":"ف2025، مداخيل السياحة وصلو 138.6 مليار درهم، والتحويلات 122 مليار.",
 "words":"فألفين وخمسة وعشرين، مداخيل السياحة وصلو مية وتمانين مليار وستمية مليون درهم، والتحويلات مية وجوج وعشرين مليار."
}
for name,text in cases.items():
    t=time.time(); audio=model.generate(text=text, voice_clone_prompt=prompt, speed=0.75, num_step=8)
    d=len(audio[0])/24000; sf.write(f"04-voice/num_{name}.wav",audio[0],24000)
    print(name, round(d,2), "s in", round(time.time()-t,1), "s", flush=True)
