# Hanoi rat tails: Ricks-Clips-style short

The whole pipeline runs on tlab and needs no GPU. Blender EEVEE renders on the Intel iGPU through headless EGL. The voice comes from the local Kokoro model.

| Step | File | Runs with |
|---|---|---|
| Script (215 words) | `script.txt` | n/a |
| Voice (Kokoro `am_michael`, speed 1.25 → about 216 wpm) | `tts.py` → `audio/vo_am_michael.wav` | `~/kokoro-web/.venv/bin/python tts.py am_michael 1.25` |
| Word timings (faster-whisper base, aligned to the script) | `align.py` → `timing.json` | `~/omnivoice-env/bin/python align.py` |
| 2D character and rat sprites | `chars.py` → `chars/*.png` | `~/omnivoice-env/bin/python chars.py` |
| 3D world, 16 camera shots, rendering | `scene.py` → `frames/sNN/####.png`, `spans.json` | `blender -b --factory-startup -P scene.py -- --shot N` |
| Music bed and SFX (generated in code) | `audio.py` → `audio/music.wav`, `audio/sfx.wav` | `~/omnivoice-env/bin/python audio.py` |
| Dissolves, colour grade, captions, mix to -14 LUFS, MP4 | `assemble.py` → `out/final.mp4` | `~/omnivoice-env/bin/python assemble.py` |

`./start_render.sh` runs every shot plus audio and assembly in the background and logs to `render.log`. Re-running is resumable because frames that already exist are skipped. To re-render a single shot, delete `frames/sNN` and run `SHOTS=N ./render_all.sh`.

Style check without a full render:

```
blender -b --factory-startup -P scene.py -- --shot 7 --scale 50 --samples 8 --still 1.5   # → stills/
~/omnivoice-env/bin/python assemble.py --test 1 --out test.mp4                             # captions + audio over flat colour
```

Each shot's camera, cast and animation are set in `stage()` in `scene.py`. Shot timing comes from the sentence boundaries in `timing.json`, one sentence per shot.
