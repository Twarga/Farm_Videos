#!/bin/bash
cd ~/rickcklipsclone/production
# wait for sword-law render already running
while pgrep -f "blender -b" >/dev/null; do sleep 60; done
cd sword-law && rm -rf timeline && python3 assemble.py
cd ~/rickcklipsclone/production
for d in eyepatch ice-emperor loophole-city; do
  cd ~/rickcklipsclone/production/$d
  ./render_all.sh >> render.log 2>&1
  rm -rf timeline
  python3 assemble.py >> render.log 2>&1
  echo "=== $d done $(date +%T)" >> render.log
done
echo ALLDONE
