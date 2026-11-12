#!/bin/bash
# Assemble video: images + voiceover + subtitles + loudnorm.
# Run on tlab inside job dir. Usage: build_video.sh <images_dir> <voice.wav> <srt> <out.mp4>
set -e
IMG=${1:-images}; AUD=${2:-voice/voiceover.wav}; SRT=${3:-build/subs.srt}; OUT=${4:-final.mp4}
FPS=30; W=1920; H=1080

# total duration from audio
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$AUD")
echo "audio dur: $DUR"

# list images sorted
mapfile -t IMGS < <(ls "$IMG"/*.{png,jpg,jpeg,webp} 2>/dev/null | sort)
N=${#IMGS[@]}
[ "$N" -eq 0 ] && { echo "no images"; exit 1; }
echo "$N images"

# per-image segment length
SEG=$(python3 -c "print($DUR/$N)")
echo "seg: $SEG s each"

# build concat: each image -> 3s crossfade-able clip w/ slow zoom (zoompan)
TMPD=$(mktemp -d)
for i in "${!IMGS[@]}"; do
  f="${IMGS[$i]}"
  # alternate zoom in / zoom out for ken burns
  if [ $((i % 2)) -eq 0 ]; then Z="zoom+0.0015"; else Z="1.5-0.0015*on"; fi
  FRAMES=$(python3 -c "print(int($SEG*$FPS))")
  ffmpeg -y -loglevel error -loop 1 -i "$f" -vf "scale=8000:4500,zoompan=z='min(${Z},1.5)':d=${FRAMES}:s=${W}x${H}:fps=${FPS},format=yuv420p" -t "$SEG" -c:v libx264 -preset medium -crf 20 "$TMPD/c$(printf %04d $i).mp4"
done

# concat
for i in "${!IMGS[@]}"; do echo "file '$TMPD/c$(printf %04d $i).mp4'"; done > "$TMPD/list.txt"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$TMPD/list.txt" -c copy "$TMPD/video.mp4"

# mux audio + loudnorm + subtitles burn
if [ -f "$SRT" ]; then
  SUB="subtitles=$SRT:force_style='FontName=DejaVu Sans,FontSize=20,PrimaryColour=&H00FFFFFF,OutlineColour=&H80000000,BorderStyle=1,Outline=2,Shadow=0,MarginV=36'"
else
  SUB="null"
fi
ffmpeg -y -loglevel error -i "$TMPD/video.mp4" -i "$AUD" -vf "$SUB" -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:v libx264 -preset medium -crf 20 -c:a aac -b:a 192k -shortest "$OUT"
echo "DONE: $OUT ($(du -h "$OUT" | cut -f1))"
rm -rf "$TMPD"
