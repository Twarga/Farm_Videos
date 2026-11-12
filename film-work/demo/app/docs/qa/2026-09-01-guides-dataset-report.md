# Dataset-backed Guide report QA — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Result

**Pass.** The published `vps-market-snapshot-457-rows` Guide explains the reviewed 457-row source and its 322-offer public result with reproducible evidence and explicit limitations.

Rerun from the repository root:

```bash
npm run content:dataset-report-check
npm run content:volume-check
npm run content:frontmatter-check
npm run content:article-check
npm run content:metadata-check
npm run release:full-data-check
npm run build
```

## Evidence

- The article records the source snapshot date (`2026-08-31`), 457 input rows, 63 provider identities, 322 public offers, 43 active providers, 76 review-only rows, 59 rejected/non-public rows, and 784 location links.
- `docs/data/publication-2026-08-31.md` is the source-of-record for the reviewed publication counts; `docs/qa/2026-09-01-full-dataset.md` records exhaustive public-data QA.
- The article distinguishes catalog coverage from market share and says it cannot establish cheapest-provider status, future availability, uptime, workload performance, taxes, or legal suitability.
- It links readers to the current catalog and methodology, keeps unknown facts unknown, and includes the named editorial desk's affiliate disclosure.
- `content:dataset-report-check` matches the article's core claims to the dated publication and QA records and checks the limitation language.

## Scope

SEO-10 publishes one reproducible dataset-backed report. It does not promote a timeless “best provider” conclusion; new snapshot claims require a new dated report and the same evidence checks.
