#!/usr/bin/env bash
# Render every shot (resumable: existing frames are skipped), then assemble the final MP4.
set -euo pipefail
cd "$(dirname "$0")"
SAMPLES=${SAMPLES:-16}
SHOTS=${SHOTS:-$(seq 0 15)}
for k in $SHOTS; do
  echo "=== shot $k $(date +%T)"
  blender -b --factory-startup -P scene.py -- --shot "$k" --scale 100 --samples "$SAMPLES" 2>&1 \
    | grep -E "Traceback|Error:|SHOT" | grep -v EGL || true
done
echo "=== frames done $(date +%T)"
~/omnivoice-env/bin/python audio.py
~/omnivoice-env/bin/python assemble.py
echo "=== ALL DONE $(date +%T)"
