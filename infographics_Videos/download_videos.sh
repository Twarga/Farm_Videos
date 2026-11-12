#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")"

OUTDIR="downloads"
mkdir -p "$OUTDIR"

sed -nE 's#^.*(youtu\.be/|youtube\.com/watch\?v=|/shorts/|/embed/)([A-Za-z0-9_-]{11}).*#\2#p' list_videos.txt \
  | awk '!seen[$0]++' > unique_video_ids.txt

total=$(wc -l < unique_video_ids.txt)
echo "[$(date '+%H:%M:%S')] $total unique videos to download"

i=0
while read -r id; do
  i=$((i + 1))
  echo ""
  echo "[$(date '+%H:%M:%S')] ($i/$total) Downloading $id"
  yt-dlp \
    "https://www.youtube.com/watch?v=$id" \
    --no-playlist \
    --js-runtimes node \
    --format "bestvideo[height<=1080][ext=mp4][vcodec^=avc1]+bestaudio[ext=m4a]/bestvideo[height<=1080]+bestaudio/best[height<=1080]/best" \
    --merge-output-format mp4 \
    --write-thumbnail \
    --convert-thumbnails jpg \
    --write-subs \
    --write-auto-subs \
    --sub-langs "ar.*,en.*" \
    --convert-subs srt \
    --embed-metadata \
    --download-archive "$OUTDIR/.download-archive.txt" \
    --no-overwrites \
    --continue \
    --ignore-errors \
    --retries 10 \
    --fragment-retries 10 \
    --sleep-requests 1 \
    --sleep-subtitles 6 \
    --output "$OUTDIR/%(title).150B [%(id)s]/%(title).150B [%(id)s].%(ext)s" \
    || echo "[$(date '+%H:%M:%S')] FAILED: $id"
done < unique_video_ids.txt

echo ""
echo "[$(date '+%H:%M:%S')] All done"
