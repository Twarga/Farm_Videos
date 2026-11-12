# AI self-check — write, check, fix, repeat

The AI must not send a script to voice or scenes until the checker passes.

## Command

```bash
python3 ai/check_script.py jobs/<job>/03-script.md --minutes 15
```

Add `--json` for the pipeline.

## What it checks

| Check | Pass condition |
|---|---|
| Word count | within ±15% of `minutes × 131` |
| Pace | 120–145 words per minute |
| Hook | first 2 sentences contain a number, date or year |
| Questions | at least 8 for a 15-minute script |
| Numbers + “يعني” | at least one “يعني” per 6 numbers |
| Darija | at least 5% Darija markers |
| Sentence length | average ≤ 15 words |
| Early CTA | like/subscribe/comment in the first ~300 words |
| Chapters | at least 3 chapter markers |
| Scene markers | at least 8 for 15 minutes |
| Outro | comment ask + “next episode” + two choices (A ولا B) |

## The loop

1. Write the script.
2. Run the checker.
3. For every **FAIL**: rewrite that part.
4. For every **WARN**: improve it or explain why it is intentional.
5. Run again.
6. Only continue when the score is **90+** and there are no FAILs.

## What to fix first

1. **FAIL** items.
2. The hook.
3. The ending.
4. The pace.
5. The sentence length.
6. The Darija ratio.

## Example report

```
WORDS: 2180 (target ~1965) | WPM: 145 | QUESTIONS: 12 | NUMBERS: 34 | يعني: 9
SCORE: 92/100
  [PASS] Word count: 2180 (~1965).
  [PASS] Pace: 145 wpm.
  [PASS] Hook: contains a number/date.
  [PASS] Questions: 12.
  [PASS] Number explanations: 9 'يعني' for 34 numbers.
  [PASS] Darija markers: 12%.
  [PASS] Average sentence: 11.4 words.
  [PASS] Early CTA found.
  [PASS] Chapter markers: 5.
  [PASS] Scene markers: 18.
  [PASS] Outro: comment + next episode + two choices.
```

## Important

- The checker is not a suggestion. It is the gate.
- If the checker says FAIL, the AI rewrites; it does not send the script.
- The human does not run the checker. The AI does.
