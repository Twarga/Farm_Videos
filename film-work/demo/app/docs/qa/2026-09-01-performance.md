# Runtime performance QA — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Result

**Pass.** The production build meets the documented local performance budgets under a cold-cache, throttled 4G mobile profile.

Rerun from the repository root:

```bash
npm run build
npm run release:performance-check
```

## Profile and method

- Production `next start` build with the approved 322-offer publication in a temporary SQLite database.
- Chromium headless on Linux x64, 390 × 844 CSS pixels, device scale factor 1.
- Cold-cache profile with browser cache disabled and 40 ms latency, 4 Mbps download, 3 Mbps upload, cellular 4G emulation.
- Routes measured: `/`, `/catalog`, `/compare`, one published offer, and one published provider.
- LCP and CLS use browser PerformanceObserver entries. TTFB uses the navigation timing response start. Filter/search interaction uses two animation frames as the local INP proxy. `/go/[id]` uses 30 manual redirect samples.

## Measurements

| Metric | Budget | Measured | Result |
|---|---:|---:|---|
| LCP p75 | ≤ 2,500 ms | 184.0 ms | Pass |
| CLS maximum | ≤ 0.10 | 0.000 | Pass |
| TTFB p95 | ≤ 800 ms | 77.7 ms | Pass |
| Filter/search interaction p95, local INP proxy | ≤ 200 ms | 14.6 ms | Pass |
| `/go/[id]` redirect p95 | ≤ 500 ms | 5.3 ms | Pass |

The runner fails if any measured value exceeds its budget.

## Route sample

The runner measured all five routes under the same cold-cache mobile profile. Aggregate results: LCP p75 184.0 ms, CLS maximum 0.000, TTFB p95 77.7 ms, filter/search interaction p95 14.6 ms, and `/go/[id]` redirect p95 5.3 ms.

## Scope and limits

This is a repeatable local lab profile, not field CrUX data. The INP value is a local interaction-to-next-two-animation-frames proxy because a short synthetic run cannot establish a statistically representative field INP. R7-06 and R7-08 remain responsible for deployed-origin smoke checks, owner review, and production traffic monitoring.

R7-05 local evidence is complete. The deployed production origin still needs a field performance sample under R7-06/R7-08.
