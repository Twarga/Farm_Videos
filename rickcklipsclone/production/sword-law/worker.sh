#!/usr/bin/env bash
# Extra render worker; Blender placeholders let workers share shots frame-by-frame.
cd "$(dirname "$0")"
for k in $1; do
  echo "=== worker shot $k $(date +%T)"
  blender -b --factory-startup -P scene.py -- --shot "$k" --scale 100 --samples "${SAMPLES:-16}" 2>&1 \
    | grep -E "Traceback|Error:|SHOT" | grep -v EGL || true
done
echo "=== worker done $(date +%T)"
