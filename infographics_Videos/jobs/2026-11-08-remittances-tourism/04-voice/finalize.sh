#!/usr/bin/env bash
set -euo pipefail
JOB="$HOME/infographics_Videos/jobs/2026-11-08-remittances-tourism"
VID="$HOME/infographics_Videos/video"
cd "$JOB"
echo "[$(date)] waiting for voice generation..."
while pgrep -f "generate_voice.py" >/dev/null; do sleep 15; done
if [ ! -s 04-voice/voiceover.wav ]; then echo "voiceover missing"; exit 1; fi
echo "[$(date)] voice ready"
python3 04-voice/make_srt.py
cp 04-voice/voiceover.wav "$VID/public/audio/voiceover_voice.wav"
bash 04-voice/mix_audio.sh
cp 04-voice/final_audio.wav "$VID/public/audio/voiceover.wav"
cp 04-voice/timing.json "$VID/src/data/timing.json"
python3 09-make_metadata.py || true
cd "$VID"
rm -rf node_modules/.cache/remotion
echo "[$(date)] rendering full video..."
npx remotion render src/index.ts Main out/video.mp4 --concurrency=4 > out/render_final.log 2>&1
echo "[$(date)] render done"
cp out/video.mp4 "$JOB/06-final.mp4"
cp -f out/thumb1.png out/thumb2.png out/thumb3.png "$JOB/08-thumbnails/"
ffprobe -v error -show_entries format=duration,size -show_entries stream=width,height,codec_name -of default=nw=1 "$JOB/06-final.mp4" > "$JOB/10-qc.txt"
ffmpeg -hide_banner -i "$JOB/06-final.mp4" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | grep -E "input_i|input_tp" >> "$JOB/10-qc.txt"
echo "[$(date)] ALL DONE"
