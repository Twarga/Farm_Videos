# Video farm

Give it a **subject + title**, pick a **style**, get back:
- a long video, 16:9, 1920×1080, ≥ 8 minutes (mid-roll eligible), −14 LUFS
- 3 Shorts, 9:16, ≤ 58 s, with burned captions
- a thumbnail
- YouTube text: title, description, chapter timestamps, tags

Research behind the styles: `STYLE_BIBLE.md`. Architecture: `FARM_SPEC.md`.

## Where things run
| Part | Machine | How |
|---|---|---|
| Farm (LLM writing, voice, scene drawing, render, web UI) | tlab `~/videofarm` | `tmux` session `farmweb`, http://192.168.100.26:8686 |
| LLM | tlab router `127.0.0.1:7187` | model `gpt-6.1-sol` (`FARM_LLM_MODEL` to change) |
| Voice | tlab | Kokoro-82M ONNX, voice per style |

## Use it
Web: open http://192.168.100.26:8686 → subject + title → **Suggest styles** → pick a style card and a title →
watch the stages → play/download the long video, Shorts, thumbnail; copy the YouTube text.

CLI (on tlab, in `~/videofarm`):
```bash
.venv/bin/python -m farm new "subject in plain words" "Title"      # prints the job id
.venv/bin/python -m farm suggest <job>                             # style scores + title ideas
.venv/bin/python -m farm pick <job> professor|stickman [--title "…"]
.venv/bin/python -m farm run <job>                                 # runs or resumes everything
.venv/bin/python -m farm run <job> --rerender                      # re-render video/shorts/package only
.venv/bin/python -m farm status
```
Scene plates are drawn in code (`farm/scenes.py`) during the `images` stage — no external image service.
(`--no-wait` still renders whatever is missing as labeled placeholders.)

## Pipeline
`suggest → outline → script → shots → voice ∥ images → render → shorts → package`

- Each LLM stage returns one small JSON document per call (outline once, script and shots once per chapter).
  It is validated (word counts, sentence length, one shot per sentence, card rules) and retried with the error message.
  This is why a small model can drive it.
- **Shot = sentence.** The voice clip's length is the shot's length, so audio and picture never drift.
- Images are cached in `cache/images/<hash>.png`, keyed by style + reference image + prompt. Re-renders are free.
- Typography (chapter labels, text cards, roster transitions, captions, thumbnails) is drawn by code: no garbled letters.
- Music and sound effects are synthesized (`farm/audio.py`), so there are no copyright claims.
- Every stage is resumable. Fix whatever broke and `run` again.

## Job folder (`jobs/<id>/`)
`job.json` (state) · `styles.json` · `outline.json` · `script.json` · `shots.json` · `images.json` (image queue) ·
`voice/*.wav` · `timeline.json` · `render/` (intermediates) · `out/long.mp4, short_NN.mp4, thumbnail.png, youtube.txt` · `log.txt`

## Add a style
Create `styles/<name>/` with:
- `style.json`: copy an existing one. Key fields: `voice`, `words_per_minute`, `long.chapters`, `chapter_words`,
  `palette`, `fonts` (files in `fonts/`, `File.ttf:Variation`), `image.prefix/character/composition/text_*`
  (the image prompt is assembled from these + the shot's scene), `frame` (`label`, `vignette`, `grain`),
  `transition` (`roster` or `titlecard`), `music` (`bright` or `lofi`), `short_layout`.
- `character.png`: the locked character/style reference every image is generated against.
- `prompts/outline.md`, `prompts/script.md`, `prompts/shots.md`: the writing rules for that style
  (placeholders in `{braces}`; copy an existing style and change the voice and rules).
No code changes are needed; the web UI shows the new style automatically.

## Measured numbers (this setup)
- Scenes: `farm/scenes.py` draws each plate in ~50 ms on tlab CPU; a whole video's ~130 plates take seconds.
- LLM: ~10–40 s per call; a full script + storyboard is ~30 calls.
- Voice: a few minutes on tlab CPU. Render: a few minutes (one process per chapter).
