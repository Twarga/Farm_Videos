#!/usr/bin/env bash
# Mix voiceover + music bed, normalize to -14 LUFS / -1 dBTP.
set -euo pipefail
JOB="${1:-/home/tlab/infographics_Videos/jobs/2026-11-08-remittances-tourism}"
V="${2:-$JOB/05-voice}"
VOC="$V/voiceover.wav"
MUS="/home/tlab/infographics_Videos/video/out/music/loop.wav"
[ -f "$MUS" ] || MUS="/home/tlab/infographics_Videos/video/out/music/music.wav"

ffmpeg -hide_banner -y \
  -i "$VOC" -stream_loop -1 -i "$MUS" \
  -filter_complex "
    [0:a]highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=12:release=250:makeup=1.5[voc];
    [1:a]volume=0.08,afade=t=in:st=0:d=1.5[mus];
    [voc][mus]amix=inputs=2:duration=shortest:dropout_transition=0,alimiter=limit=0.9[mix];
    [mix]loudnorm=I=-14:TP=-1.0:LRA=11[out]" \
  -map "[out]" -shortest -ar 48000 -ac 2 -b:a 192k "$V/mix.aac"

ffprobe -v error -show_entries format=duration -of default=nw=1 "$V/mix.aac"
ffmpeg -hide_banner -i "$V/mix.aac" -af loudnorm=print_format=summary -f null - 2>&1 | grep -E "Input Integrated|Input True Peak"
echo "done: $V/mix.aac"
