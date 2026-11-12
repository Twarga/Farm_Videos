# Workflow home — tlab

Everything runs on the home server `tlab`.

- **Project root:** `/home/tlab/infographics_Videos`
- **AI rulebook:** `ai/` — the AI reads this and checks its own work.
- **Reference videos:** `downloads/` (13 videos, thumbnails, Arabic subtitles)
- **Style breakdown:** `style_analysis/`
- **Research:** `research/`
- **Style rules:** `style.md`
- **Jobs:** `jobs/<date>-<slug>/`
- **Assets:** `assets/`
- **TTS:** `/home/tlab/darija_tts` (VoxCPM2) and the new OmniVoice environment

## Who does what

### The AI does the work

1. **Researcher** — reads the link, finds 2 sources per key fact, builds the fact sheet.
2. **Writer** — writes the script in Darija with scene markers, using `ai/`.
3. **Self-check** — runs `ai/check_script.py` and fixes every FAIL/WARN.
4. **Scene planner** — turns the script into the 10 scene types.
5. **Voice** — OmniVoice with a cloned male Darija reference, ~131 wpm.
6. **Video builder** — mint/teal/yellow templates, motion, charts, maps.
7. **QC** — loudness -14 LUFS, text fit, sources, frozen frames.
8. **Packaging** — 3 titles, 3 thumbnails, subtitles.

### The human only approves

1. The link or topic.
2. The angle (3 options).
3. The script.
4. The final video before upload.

No human exercises, no human homework. The AI learns from `ai/` and the checker.

## The pipeline

```
link/topic
  → research + fact sheet (2 sources per key fact)
  → angle (3 hooks, human picks one)
  → script (2,200 words, Darija)
  → check_script.py → fix → pass (score 90+)
  → voice (OmniVoice, cloned reference, ~131 wpm)
  → scene plan (10 scene types)
  → visuals (mint/teal/yellow)
  → music + subtitles
  → QC
  → human review
  → title + 3 thumbnails
  → private upload
```

## Job folder

```
jobs/2026-11-08-nador-port/
  01-source.md
  02-facts.json
  03-script.md
  04-voice.wav
  05-scenes/
  06-final.mp4
  07-subtitles.srt
  08-thumbnails/
```

## Rules

- Do not invent facts or numbers.
- Every map and photo gets a source credit.
- The AI checks its own script before voice.
- Human approval before upload.
- Do not clone another creator's voice.
