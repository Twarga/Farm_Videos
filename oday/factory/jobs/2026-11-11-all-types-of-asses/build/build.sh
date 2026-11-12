#!/bin/bash
# Assemble: Ken Burns images + voice + subs -> final.mp4
JOB="/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses"
IMG="$JOB/images"
OUT="$JOB/final"

mkdir -p "$OUT/clips"
cd "$IMG"

# build per-image Ken Burns clips from beats.json timing
python3 << 'PYEOF'
import json, os, subprocess
beats = json.load(open("/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses/build/beats.json"))
img_dir = "/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses/images"
out_dir = "/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses/final/clips"
os.makedirs(out_dir, exist_ok=True)

for i, seg in enumerate(beats):
    img = seg.get("image") or seg.get("file") or ""
    if not img or not os.path.exists(f"{img_dir}/{img}"):
        # fallback: pick any image for this index
        imgs = sorted([f for f in os.listdir(img_dir) if f.endswith(".png")])
        img = imgs[i % len(imgs)] if imgs else None
    if not img: continue
    dur = max(1.5, seg.get("end",0) - seg.get("start",0))
    kb = f"zoompan=z='1+0.0015*on':d={int(dur*30)}:s=1920x1080:fps=30"
    subprocess.run(["ffmpeg","-y","-loop","1","-i",f"{img_dir}/{img}","-vf",kb,"-t",str(dur),"-c:v","libx264","-preset","fast","-crf","20","-pix_fmt","yuv420p","-r","30",f"{out_dir}/seg_{i:03d}.mp4"],capture_output=True)

# concat list
clips = sorted([f"{out_dir}/{f}" for f in os.listdir(out_dir) if f.endswith(".mp4")])
open("/tmp/concat.txt","w").write("\n".join(f"file '{c}'" for c in clips))
PYEOF

ffmpeg -y -f concat -safe 0 -i /tmp/concat.txt -i "$JOB/voice/voiceover.wav" -i "$JOB/build/subs.srt" \
  -map 0:v -map 1:a -c:v libx264 -preset medium -crf 20 -c:a aac -b:a 192k \
  -vf "subtitles=$JOB/build/subs.srt:force_style='FontSize=22,PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,BackColour=&H80000000&,BorderStyle=4,Outline=1,Shadow=0,Fontname=DejaVu Sans'" \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" \
  -shortest "$OUT/final.mp4" 2>&1 | tail -3

echo "DONE: $OUT/final.mp4"
ls -lh "$OUT/final.mp4"
