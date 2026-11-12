import torch
import time, sys
import soundfile as sf
from voxcpm import VoxCPM

VOICE = "(A Moroccan man in his forties, calm and confident news narrator, natural conversational pace, clear Darija pronunciation)"
LINES = {
    "vox_darija_1": "شنو هو الطريق السيار المائي؟ هو مشروع كبير بزاف، غادي ينقل الما من الشمال للجنوب.",
    "vox_darija_2": "الحكومة قررات تحارب الشناقة، وغادي تبدا من الشهر الجاي. شنو غادي يتبدل فالأسعار؟ هادشي هو لي غادي نشوفو.",
}

t = time.time()
model = VoxCPM.from_pretrained("openbmb/VoxCPM2", load_denoiser=False, optimize=False, device="cpu")
print("loaded", round(time.time() - t), "s", flush=True)
for name, text in LINES.items():
    s = time.time()
    torch.manual_seed(42)
    wav = model.generate(text=f"{VOICE}{text}", cfg_value=2.0, inference_timesteps=10)
    sf.write(f"out/{name}.wav", wav, model.tts_model.sample_rate)
    print(name, round(time.time() - s), "s", round(len(wav) / model.tts_model.sample_rate, 1), "s audio", flush=True)
