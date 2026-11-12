#!/bin/bash
cd ~/rickcklipsclone/production
# wait for current sword-law render_all to finish
while pgrep -f "render_all.sh" >/dev/null; do sleep 60; done
while pgrep -f "blender -b" >/dev/null; do sleep 60; done
cd sword-law
# render any missing/short shots
for i in $(seq 0 14); do d=$(printf "frames/s%02d" $i); n=$(ls $d 2>/dev/null | wc -l); [ "$n" -lt 50 ] && rm -rf $d && blender -b --factory-startup -P scene.py -- --shot $i --scale 100 --samples 16 >> render.log 2>&1; done
rm -rf timeline && python3 assemble.py >> render.log 2>&1
echo "=== sword-law done $(date +%T)" >> render.log
for d in eyepatch ice-emperor loophole-city; do
  cd ~/rickcklipsclone/production/$d
  ./render_all.sh >> render.log 2>&1
  rm -rf timeline
  python3 assemble.py >> render.log 2>&1
  echo "=== $d done $(date +%T)" >> render.log
done
echo ALLDONE
