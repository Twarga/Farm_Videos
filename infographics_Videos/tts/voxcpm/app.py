"""Paste Darija text, pick a voice description, get audio. No cloning, no reference clip."""
import tempfile, time
import torch
import gradio as gr
import soundfile as sf
from voxcpm import VoxCPM

model = VoxCPM.from_pretrained("openbmb/VoxCPM2", load_denoiser=False, optimize=False, device="cpu")
SR = model.tts_model.sample_rate

VOICES = {
    "News narrator (man, calm)": "A Moroccan man in his forties, calm and confident news narrator, natural conversational pace, clear Darija pronunciation",
    "News narrator (woman, warm)": "A Moroccan woman in her thirties, warm and clear news presenter, natural pace, clear Darija pronunciation",
    "Storyteller (man, deep)": "A Moroccan man, deep and resonant storyteller voice, slow dramatic pace, clear Darija pronunciation",
    "Custom (write below)": "",
}

def synth(text, preset, custom, cfg, steps, seed):
    desc = custom.strip() if preset.startswith("Custom") else VOICES[preset]
    prompt = f"({desc}){text}" if desc else text
    t = time.time()
    torch.manual_seed(int(seed))
    wav = model.generate(text=prompt, cfg_value=float(cfg), inference_timesteps=int(steps))
    f = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    sf.write(f.name, wav, SR)
    return f.name, f"{len(wav)/SR:.1f}s audio in {time.time()-t:.0f}s"

with gr.Blocks(title="Darija voice (VoxCPM2)") as app:
    gr.Markdown("## Darija voice, no cloning. Keep each paragraph short (one or two sentences).")
    text = gr.Textbox(label="Darija text", lines=4, rtl=True,
                      value="شنو هو الطريق السيار المائي؟ هو مشروع كبير بزاف، غادي ينقل الما من الشمال للجنوب.")
    preset = gr.Dropdown(list(VOICES), value="News narrator (man, calm)", label="Voice")
    custom = gr.Textbox(label="Custom voice description (English)", lines=2)
    with gr.Row():
        cfg = gr.Slider(1.0, 3.0, value=2.0, step=0.1, label="Guidance")
        steps = gr.Slider(4, 30, value=10, step=1, label="Quality steps (more = slower)")
        seed = gr.Number(value=42, label="Seed (same seed = same voice)", precision=0)
    btn = gr.Button("Generate")
    audio = gr.Audio(label="Result", type="filepath")
    info = gr.Textbox(label="Time", interactive=False)
    btn.click(synth, [text, preset, custom, cfg, steps, seed], [audio, info])

app.queue().launch(server_name="127.0.0.1", server_port=7861)
