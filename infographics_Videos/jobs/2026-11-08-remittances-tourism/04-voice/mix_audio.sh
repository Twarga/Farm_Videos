#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
ffmpeg -v error -y -i voiceover.wav -i "/home/tlab/infographics_Videos/video/out/music/music.wav" \
  -filter_complex "[1:a]volume=0.06,lowpass=f=500[bg];[0:a][bg]amix=inputs=2:duration=first:dropout_transition=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" \
  -map "[a]" final_audio.wav
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 final_audio.wav
