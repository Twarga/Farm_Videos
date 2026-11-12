# Phase 7 handoff for another AI

Original planning handoff prepared 7 October 2026. **Superseded by the [10 October delivery ledger](phase-7-delivery.md): implementation and final local checks are delivered.** Continue only the documented strict JavaScript-size and human accessibility acceptance requirements; do not restart the original implementation prompt below.

## What this phase does

1. Measure the site as it is today.
2. Make the browser protections work without breaking forms or the theme.
3. Make pages and interactions faster where measurements show a problem.
4. Verify that saved changes and expiring offers appear correctly.
5. Finish useful error messages and recovery.
6. Check phones, keyboards, zoom and screen readers.
7. Run the full checks and explain what is ready for launch.

Keep the existing design. The 38 evidence-held editorial drafts remain private.

## Original execution prompt (historical)

```text
Implement Phase 7 of bestvpsforme in:
/home/twarga/Documents/bestvpsforme

Read and follow the complete implementation plan:
/home/twarga/Documents/bestvpsforme/docs/superpowers/plans/2026-10-07-phase-7-launch-readiness.md

Read AGENTS.md, docs/product/PRODUCT_CONTRACT.md, DESIGN.md,
brand/BRAND.md and docs/progress/phase-6-closure-2026-10-07.md first.
Use the installed Next.js documentation under node_modules/next/dist/docs/.

The last Phase 6 closure commit was ad1df6b on codex/resume-overhaul.
Inspect the current tree and preserve newer changes; do not reset it to that commit.
The last recorded state was 330 published offers, 62 reviewed editorial entries,
38 held drafts and 17 migrations. Verify rather than hard-code these counts.

Work through the plan in order. Make reversible code changes and run the necessary
checks without repeatedly asking for permission. Keep progress in docs/progress/phase-7-status.md.
Use /tmp database copies for all experiments and admin mutations.

Do not change production catalog facts, publish held drafts, alter ranking/price
math, disable authentication, expose credentials, or deploy externally.
Keep the current design. Security hardening is part of this phase, but real
credential rotation and external launch configuration remain owner-operated steps.

Important: nonce-based CSP conflicts with partial prerendering in the installed
Next.js guide. Evaluate Cache Components; do not blindly enable it. A documented
negative evaluation is valid. Old runtime scripts still expect deleted search
controls: repair those checks to match the current interface.

Targets: LCP <2.0s, CLS <0.05, lab INP <200ms, and full first-load catalog JS
<120,000 gzip bytes. Distinguish lab measurements from field data. Never silently
relax a target or call a missing screen-reader/zoom check passed.

Run focused regressions as you work and the full final gate. Do not build while
browser tests use the same .next directory. Preserve the local preview where
possible. Commit coherent steps if Git permissions allow; otherwise retain the
verified changes and report that limitation without discarding work.

Finish with: changes delivered, actual measurements, fresh test results,
remaining launch gates, and links to the final report. Do not claim Phase 7 is
fully accepted while a required check or budget is unresolved.
```

## Files the next AI should produce

- `docs/progress/phase-7-status.md` — progress and where to resume.
- `docs/qa/phase-7/rendering-decision.md` — caching/CSP decision.
- `docs/qa/phase-7/performance-method.md` — how the measurements were taken.
- `docs/qa/phase-7/performance-baseline.json` and `performance-final.json` — before/after evidence.
- `docs/qa/phase-7/accessibility.md` — automated and manual checks.
- `docs/qa/phase-7/launch-checklist.md` — what remains before a public launch.
- `docs/progress/phase-7-delivery.md` — final result and limitations.

The full plan includes the file map, implementation contracts, regression examples, run commands, task dependencies and acceptance ledger. Use it as the source of task detail; this handoff is the starting prompt.
