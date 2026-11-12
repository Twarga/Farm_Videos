# AI rulebook — the AI writes, the human approves

This folder is **for the AI**, not for the human.

The AI must:

1. Read `WRITING-RULES.md`, `SCENE-RULES.md` and `EXAMPLES.md`.
2. Read the approved fact sheet.
3. Write the script with scene markers.
4. Run `check_script.py` and fix every FAIL and WARN.
5. Only then send the script for voice and scenes.

The human only does four things:
- gives the link or topic;
- approves the angle;
- approves the script;
- watches the final video.

No human exercises. No human homework. The AI learns the style, writes, checks
itself, and improves.

## Files

| File | What it is |
|---|---|
| `WRITING-RULES.md` | How the channel writes |
| `SCENE-RULES.md` | How the channel builds scenes |
| `EXAMPLES.md` | Real openings explained line by line |
| `SCRIPT-TEMPLATE.md` | The blank structure |
| `WRITER-PROMPT.md` | The system prompt for the AI writer |
| `SELF-CHECK.md` | The write → check → fix loop |
| `check_script.py` | The automatic checker |
| `HOW-AI-STUDIES-VIDEOS.md` | How the AI studies a new reference video |

## The loop

```
fact sheet
   ↓
write script (with scene markers)
   ↓
run check_script.py
   ↓
fix all FAIL / WARN
   ↓
run again until score ≥ 90
   ↓
voice + scenes + video
```

The checker is the teacher. The AI does not need a human lesson; it needs a
clear rulebook and a pass/fail report.
