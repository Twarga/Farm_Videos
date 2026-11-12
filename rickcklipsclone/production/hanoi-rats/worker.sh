#!/usr/bin/env bash
# Extra render worker. Blender placeholders (use_placeholder + no overwrite) let several
# workers share the same shots frame-by-frame without duplicating work.
# usage: ./worker.sh "15 14 13 ..."   (detached: setsid nohup ./worker.sh "..." > worker.log 2>&1 &)
cd "$(dirname "$0")"
for k in $1; do
  echo "=== worker shot $k $(date +%T)"
  blender -b --factory-startup -P scene.py -- --shot "$k" --scale 100 --samples "${SAMPLES:-16}" 2>&1 \
    | grep -E "Traceback|Error:|SHOT" | grep -v EGL || true
done
echo "=== worker done $(date +%T)"
