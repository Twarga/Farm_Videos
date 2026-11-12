#!/usr/bin/env bash
# Launch render_all.sh fully detached from the SSH session; log in render.log.
cd "$(dirname "$0")"
setsid nohup ./render_all.sh > render.log 2>&1 < /dev/null &
echo "started pid $!"
