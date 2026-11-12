"""High-quality Darija narration with VoxCPM2 on CPU.

Quality changes vs long_darija.py:
- float32 weights/compute (checkpoint is bf16; bf16 on CPU was the suspected noise source).
- 30 diffusion steps instead of 10.
- Continuation mode: every chunk gets the previous chunk's audio + text as prompt, so
  prosody flows across chunks, while reference_wav_path keeps the speaker identical.
- No silent gaps; chunks are joined with short fades.
Resumable: finished chunks in out/max/NN.wav are reused.
"""
import json, os, re, sys, time
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
from huggingface_hub import snapshot_download
from voxcpm import VoxCPM

INF_STEPS = int(os.environ.get("INF_STEPS", "30"))
CFG = float(os.environ.get("CFG", "2.0"))
MAX_CHARS = int(os.environ.get("MAX_CHARS", "220"))
OUT = Path("out/max")
OUT.mkdir(parents=True, exist_ok=True)

VOICE = "(A Moroccan man in his forties, calm and confident news narrator, natural conversational pace, clear Darija pronunciation)"

SCRIPT = Path(os.environ.get("SCRIPT_FILE", "script_darija.txt")).read_text(encoding="utf-8")


def fp32_model_dir() -> str:
    """Local copy of the snapshot with config dtype forced to float32 (weights symlinked)."""
    dst = Path("model_fp32")
    if (dst / "config.json").exists():
        return str(dst)
    src = Path(snapshot_download("openbmb/VoxCPM2"))
    dst.mkdir(exist_ok=True)
    for f in src.iterdir():
        if f.name != "config.json":
            (dst / f.name).symlink_to(f.resolve())
    cfg = json.loads((src / "config.json").read_text(encoding="utf-8"))
    cfg["dtype"] = "float32"
    (dst / "config.json").write_text(json.dumps(cfg, ensure_ascii=False, indent=2), encoding="utf-8")
    return str(dst)


def split_chunks(text: str, max_chars: int) -> list[str]:
    sentences = [s.strip() for s in re.split(r"(?<=[.؟?!])\s+|\n", text) if s.strip()]
    chunks, cur = [], ""
    for s in sentences:
        if cur and len(cur) + len(s) + 1 > max_chars:
            chunks.append(cur)
            cur = s
        else:
            cur = (cur + " " + s).strip()
    if cur:
        chunks.append(cur)
    return chunks


def main() -> None:
    chunks = split_chunks(SCRIPT, MAX_CHARS)
    (OUT / "script_chunks.txt").write_text("\n".join(chunks), encoding="utf-8")
    print(f"{len(chunks)} chunks, steps={INF_STEPS} cfg={CFG} dtype=float32", flush=True)

    model = VoxCPM.from_pretrained(fp32_model_dir(), load_denoiser=False, optimize=False, device="cpu")
    SR = model.tts_model.sample_rate
    ref = OUT / "ref_voice.wav"
    t0 = time.time()
    for i, text in enumerate(chunks, 1):
        path = OUT / f"{i:02d}.wav"
        if path.exists():
            continue
        s = time.time()
        torch.manual_seed(1234)
        if i == 1:
            wav = model.generate(text=f"{VOICE}{text}", cfg_value=CFG, inference_timesteps=INF_STEPS)
            sf.write(ref, wav, SR)
        else:
            prev = OUT / f"{i-1:02d}.wav"
            wav = model.generate(
                text=text,
                reference_wav_path=str(ref),
                prompt_wav_path=str(prev),
                prompt_text=chunks[i - 2],
                cfg_value=CFG,
                inference_timesteps=INF_STEPS,
            )
        sf.write(path, wav, SR)
        print(f"{i}/{len(chunks)} {len(wav)/SR:.1f}s audio in {time.time()-s:.0f}s "
              f"(total {(time.time()-t0)/60:.1f} min)", flush=True)

    # Join with short fades (no silent gaps).
    fade = int(SR * 0.012)
    parts = []
    for i in range(1, len(chunks) + 1):
        w, _ = sf.read(OUT / f"{i:02d}.wav", dtype="float32")
        if w.ndim > 1:
            w = w.mean(axis=1)
        w = w.copy()
        w[:fade] *= np.linspace(0, 1, fade, dtype=np.float32)
        w[-fade:] *= np.linspace(1, 0, fade, dtype=np.float32)
        parts.append(w)
    final = np.concatenate(parts)
    peak = float(np.abs(final).max()) or 1.0
    final = final / peak * 0.89  # about -1 dBFS peak
    sf.write("out/darija_max.wav", final, SR, subtype="PCM_24")
    print(f"DONE {len(final)/SR:.1f}s -> out/darija_max.wav @ {SR} Hz", flush=True)


if __name__ == "__main__":
    main()
