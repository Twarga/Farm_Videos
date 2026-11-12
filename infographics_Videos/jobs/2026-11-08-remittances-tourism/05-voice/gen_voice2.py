#!/usr/bin/env python3
"""Sentence-level Darija narration with OmniVoice.

Goals vs the previous run:
- One beat per sentence -> real subtitle + visual timing (beats.json, .srt).
- Tight gaps: ~0.18s between sentences, ~0.7s at chapter boundaries (was 0.8s+ everywhere).
- speed 0.85 for a less sluggish pace.
- Resumable: chunks/*.wav are reused.

Outputs (in 05-voice/):
  chunks/sNNNN.wav        sentence audio
  voiceover.wav           assembled, normalized 48k wav
  beats.json              [{scene,type,start,end,dur,text,last}]
  subtitles.srt
  stats.txt
"""
import json
import os
import re
import sys
import time

import numpy as np
import soundfile as sf
import torch
from omnivoice import OmniVoice

ROOT = os.path.dirname(os.path.abspath(__file__))
JOB = os.path.dirname(ROOT)
SCRIPT = os.path.join(JOB, "03-script.md")
OUT = ROOT
CHUNKS = os.path.join(OUT, "chunks")
os.makedirs(CHUNKS, exist_ok=True)

REF = "/home/tlab/infographics_Videos/tts/voxcpm/out/vox_darija_1.wav"
REF_TEXT = "شنو هو الطريق السيار المائي؟ هو مشروع كبير بزاف، غادي ينقل الما من الشمال للجنوب."
SR = 24000
SPEED = float(os.environ.get("SPEED", "0.85"))
STEPS = int(os.environ.get("STEPS", "10"))
GAP_SENT = float(os.environ.get("GAP_SENT", "0.18"))
GAP_SCENE = float(os.environ.get("GAP_SCENE", "0.75"))
GAP_CHAPTER = float(os.environ.get("GAP_CHAPTER", "0.95"))
LEAD = float(os.environ.get("LEAD", "0.4"))
WORKER = int(os.environ.get("WORKER", "0"))
NWORKERS = int(os.environ.get("NWORKERS", "1"))
GEN_ONLY = os.environ.get("GEN_ONLY", "0") == "1"

# ---------------- script -> scene groups -> sentences ----------------

def parse_scenes(path):
    groups = []
    cur_type, buf = None, []
    for line in open(path, encoding="utf-8"):
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        m = re.match(r"\[SCENE:\s*([a-zA-Z_-]+)\]", s)
        if m:
            if cur_type is not None:
                groups.append({"type": cur_type, "text": " ".join(buf).strip()})
            cur_type, buf = m.group(1), []
        else:
            buf.append(s)
    if cur_type is not None:
        groups.append({"type": cur_type, "text": " ".join(buf).strip()})
    return groups


def split_sentences(text):
    # split on sentence terminators; keep decimal numbers like 138.6 intact
    t = re.sub(r"(\d)\.(\d)", r"\1․\2", text)
    parts = re.split(r"(?<=[.!؟?])\s+", t)
    out = [p.replace("․", ".").strip() for p in parts if p.strip()]
    return out


def to_srt(t):
    h = int(t // 3600)
    m = int((t % 3600) // 60)
    s = t % 60
    return f"{h:02d}:{m:02d}:{s:06.3f}".replace(".", ",")


def norm_peak(w, target=0.85):
    p = float(np.abs(w).max()) or 1.0
    return w / p * target


def trim_silence(y, sr, thresh_db=-45, pad_ms=60):
    abs_y = np.abs(y)
    thresh = 10 ** (thresh_db / 20)
    idx = np.where(abs_y > thresh)[0]
    if len(idx) == 0:
        return y
    pad = int(sr * pad_ms / 1000)
    start = max(0, idx[0] - pad)
    end = min(len(y), idx[-1] + pad)
    return y[start:end]


def main():
    groups = parse_scenes(SCRIPT)
    units = []
    for gi, g in enumerate(groups):
        for si, sent in enumerate(split_sentences(g["text"])):
            units.append({
                "scene": gi,
                "type": g["type"],
                "sent": sent,
                "last": False,
            })
        if units and any(u["scene"] == gi for u in units):
            for u in reversed(units):
                if u["scene"] == gi:
                    u["last"] = True
                    break

    print(f"{len(groups)} scene groups, {len(units)} sentences", flush=True)

    model = OmniVoice.from_pretrained(
        "k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32
    )
    prompt = model.create_voice_clone_prompt(ref_audio=REF, ref_text=REF_TEXT)
    print("voice prompt ready", flush=True)

    # generate sentence wavs (split across workers by index)
    for i, u in enumerate(units):
        if i % NWORKERS != WORKER:
            continue
        cp = os.path.join(CHUNKS, f"s{i:04d}.wav")
        if os.path.exists(cp):
            continue
        t = time.time()
        audio = model.generate(
            text=u["sent"], voice_clone_prompt=prompt,
            speed=SPEED, num_step=STEPS,
        )
        y = np.asarray(audio[0], dtype=np.float32)
        sf.write(cp, y, SR)
        print(f"{i+1}/{len(units)} '{u['sent'][:40]}' -> {len(y)/SR:.1f}s in {time.time()-t:.0f}s", flush=True)

    if GEN_ONLY:
        print("GEN_ONLY done", flush=True)
        return

    beats = []
    parts = [np.zeros(int(LEAD * SR), dtype=np.float32)]
    cursor = LEAD
    prev_scene = units[0]["scene"]


    for i, u in enumerate(units):
        cp = os.path.join(CHUNKS, f"s{i:04d}.wav")
        y, sr = sf.read(cp, dtype="float32")
        y = norm_peak(trim_silence(y, sr))

        if u["scene"] != prev_scene:
            # gap was already added after prev; extend it a bit for scene/chapter change
            extra = GAP_CHAPTER if groups[u["scene"]]["type"] == "chapter" else GAP_SCENE
            parts.append(np.zeros(int(extra * SR), dtype=np.float32))
            cursor += extra
            prev_scene = u["scene"]

        start = cursor
        # small fade-in to avoid clicks
        fade = int(0.02 * SR)
        y[:fade] *= np.linspace(0, 1, fade)
        y[-fade:] *= np.linspace(1, 0, fade)
        parts.append(y)
        cursor += len(y) / SR
        end = cursor

        beats.append({
            "i": i,
            "scene": u["scene"],
            "type": u["type"],
            "start": round(start, 3),
            "end": round(end, 3),
            "dur": round(end - start, 3),
            "text": u["sent"],
            "last": u["last"],
        })

        if not u["last"]:
            parts.append(np.zeros(int(GAP_SENT * SR), dtype=np.float32))
            cursor += GAP_SENT

    parts.append(np.zeros(int(0.8 * SR), dtype=np.float32))
    voice = np.concatenate(parts)
    raw = os.path.join(OUT, "voiceover_raw.wav")
    sf.write(raw, voice, SR)

    import subprocess
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-i", raw,
        "-ar", "48000", "-ac", "1",
        "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
        os.path.join(OUT, "voiceover.wav"),
    ], check=True)

    json.dump(beats, open(os.path.join(OUT, "beats.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)

    with open(os.path.join(OUT, "subtitles.srt"), "w", encoding="utf-8") as f:
        for b in beats:
            f.write(f"{b['i']+1}\n{to_srt(b['start'])} --> {to_srt(b['end'])}\n{b['text']}\n\n")

    total = len(voice) / SR
    words = sum(len(b["text"].split()) for b in beats)
    with open(os.path.join(OUT, "stats.txt"), "w", encoding="utf-8") as f:
        f.write(f"duration: {total:.1f}s\nwords: {words}\nwpm: {words/total*60:.0f}\nbeats: {len(beats)}\n")
    print(f"DONE total {total:.0f}s, {words} words, {words/total*60:.0f} wpm", flush=True)


if __name__ == "__main__":
    main()
