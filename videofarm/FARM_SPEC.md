# Video farm — architecture

Goal: give a **subject + title**, pick a **style**, get a monetizable **long video (16:9, ≥ 8 min)** plus
**3–5 Shorts (9:16, ≤ 60 s)**, thumbnail, and YouTube metadata. Runs on tlab. Any model can drive it,
including small ones, because the model only fills small validated JSON pieces; everything else is fixed code.

## Principles (from the research, see STYLE_BIBLE.md)
1. **Shot = sentence.** Every spoken sentence gets one visual (2–5 s). Audio length = shot length, so voice and
   picture can never drift.
2. **Character-first.** Each style has one locked character reference image; every image prompt starts from it.
3. **Pictures come from the image model, typography comes from code.** Chapter labels, text beat cards, roster
   transitions, captions, and thumbnails are drawn by the renderer: pixel-perfect text, no garbled letters.
4. **Small steps, hard validation.** Each LLM call produces one small JSON document, checked against a schema
   and rules (word counts, sentence length, banned phrases). On failure, retry with the error message.
   A weak model just needs more retries.
5. **Everything is a file and every stage is resumable.** Re-running skips finished work. Images are cached by
   prompt hash, so re-renders are free.

## Stages
| # | Stage | Who | Output |
|---|---|---|---|
| 0 | `new` | user (web/CLI) | `job.json` {subject, title, style?, long_minutes, shorts} |
| 1 | `suggest` | LLM | `styles.json`: per-style fit score + 1-line pitch + 3 alternative titles; user picks |
| 2 | `outline` | LLM | `outline.json`: N chapters (items) with angle + key facts; N sized to hit the minutes target |
| 3 | `script` | LLM, one call per chapter | `script/NN.json`: sentences following the style's script skeleton |
| 4 | `shots` | LLM, one call per chapter | `shots/NN.json`: per sentence {kind: image/card, prompt parts, camera} |
| 5 | `voice` | Kokoro (tlab, CPU) | `voice/NN-SS.wav`, durations |
| 6 | `images` | `farm/scenes.py` (Pillow, deterministic code-drawn plates) | `cache/images/<hash>.png` |
| 7 | `render` | Pillow + ffmpeg | `out/long.mp4` (1920×1080, −14 LUFS) |
| 8 | `shorts` | renderer | `out/short_NN.mp4` (1080×1920, captions burned in) |
| 9 | `package` | renderer + LLM | `out/thumbnail.png`, `out/youtube.txt` (title, description with chapter timestamps, tags) |

## Style pack (`styles/<name>/`)
- `style.json`: palette, fonts, voice, wpm, shot length, caption rules, transition device, image prompt
  prefix/suffix, negative rules, script skeleton, title formulas, chapter count per minute.
- `character.png`: locked character reference (generated once, reused for every job).
- `prompts/*.md`: the exact LLM prompts for outline / script / shots / titles, with style examples.
- Adding a third style = adding a folder. No code changes.

## Backends (pluggable, in `farm/backends.py`)
- LLM: Anthropic-compatible router on tlab `127.0.0.1:7187` (gpt-6.1-sol), or Ollama, or any OpenAI-compatible URL.
- Images: drawn in code by `farm/scenes.py` — the LLM's free-text `scene` is parsed into a spec
  (shot size, pose, mood, props, set) and composed with Pillow primitives. Instant, no quota, reproducible.
  Fallback: a style-colored placeholder card, so renders never block.
- TTS: Kokoro-82M ONNX on tlab (style chooses the voice).

## Interfaces
- CLI: `farm new "subject" "title"` · `farm run <job>` · `farm status`
- Web (tlab): form → style cards with sample frames and the model's fit score → pick → live stage progress →
  player for the long video + shorts + thumbnail + copyable YouTube text.
