# Phase 7 measured performance findings

These findings were collected on 9 October 2026 against disposable online backups and sanitized production builds. Final acceptance requires the complete route/cache/interaction matrix; a diagnostic pair is not that matrix.

## Completed repairs

- The native `.mts` performance entry preserves Lighthouse's serialized browser helpers. The old CommonJS instrumentation report containing `__name is not defined` cannot establish a speed baseline.
- Public telemetry now consumes its response body. Before this repair, the catalog Lighthouse network audit retained two unfinished analytics requests and reported incomplete loading. After repair, the diagnostic catalog cold/warm pair had no warnings or unfinished requests. The response-consumption behavioral test was observed failing before the change and passing afterward.
- Scripted interaction readiness uses document load and hydration of the existing theme control rather than waiting for all streaming/prefetch network activity to stop.
- Every Lighthouse sample has a 75-second outer deadline. A hung sample remains failed evidence; its warm pair is marked unattempted rather than silently omitted.
- Repeated catalog offer links no longer fetch offer-detail routes merely because rows enter the viewport. The browser regression caught 13 automatic offer requests before the change and also checks that following a plan still opens its details.

## Diagnostic results, not final acceptance

The report `performance-diagnostic-2026-10-09.json` is explicitly marked `diagnosticOnly: true` and `passed: false`. It covers one catalog cold/warm pair and one filter interaction journey on Turbopack build `ceedf3SlpkOUfiPfCTm6_`:

| Observation | Result |
| --- | --- |
| Cold catalog LCP / CLS | 1015.174 ms / 0.00010533 |
| Warm catalog LCP / CLS | 360.806 ms / 0 |
| Filter journey lab INP | 136 ms |
| Lighthouse run warnings | None |
| Field INP | Unavailable; these are local lab results |

The invalid earlier load and the repaired diagnostic are not a valid before/after timing comparison. The evidence establishes completed loading after the stream repair.

## JavaScript budget remains failed

Both official bundlers were tested with the same accounting: unique decoded response bodies, individually gzip-compressed at level 9, including framework/shared scripts, a fresh catalog context, hydration and quiet script traffic. Follow-up filter/sort/pagination/compare/theme journeys also completed.

| Build | Full initial catalog JS | Catalog-only diagnostic subset | Strict gate |
| --- | ---: | ---: | --- |
| Next 16.3.8 Turbopack | 168732 bytes | 19151 bytes | Fails `<120000` |
| Next 16.3.8 official Webpack experiment | 169980 bytes | See JSON report | Fails `<120000` |

Reports: `catalog-js-turbopack.json` and `catalog-js-webpack.json`. Webpack increased the measured total by 1248 bytes, so it was not adopted. These results do not justify changing the budget or counting only the catalog-specific subset. Framework/shared code accounts for 149581 bytes in the Turbopack report; that subset also includes the application shell, so it is not presented as a pure framework-only attribution.

The Webpack experiment exposed an existing route type mismatch: a declared request parameter cannot include `undefined` under Next's generated handler contract. The public-offers handler now accepts a real `Request`; standalone parity/data-mode scripts supply one, preserving query filtering, fail-closed behavior and request IDs. The strict production type check and both scripts passed after the fix.

The final report must retain the failed JavaScript gate unless a later measured implementation actually meets it. No framework dependency was patched, no feature was hidden behind a delayed interaction to manipulate first-load accounting, and no catalog/editorial facts were changed.

## Final-build JavaScript — 10 October 2026

Build `kfsfRayDWDzMr7Vzz_twm` measures **168903 gzip-9 bytes**, failing the unchanged `<120000` gate by 48903 bytes. `catalog-js-budget.json` records only that budget failure; all follow-up filter, sort, pagination, compare and theme journeys completed. The catalog-only diagnostic subset is not the acceptance denominator. HTML is 21220 gzip bytes; its inline bootstrap (236) and embedded RSC scripts (9397) are overlapping subsets, reported separately. Later interactions fetched one additional script, 3005 gzip bytes.

The shared/framework/application-shell scripts are already larger than the complete budget. The supported webpack trial was worse and remains discarded. Meeting the limit needs a separate measured architecture decision; neither dependency patching, delayed essential controls nor a smaller denominator was used to manufacture a pass. The final source/build manifest is `build-evidence.json`.

## Final complete matrix — 10 October 2026

[Final report](performance-final.json), build `kfsfRayDWDzMr7Vzz_twm`: **42/42 valid passing mobile Lighthouse loads and 24/24 valid passing lab interaction runs**, no failures or loading warnings. Worst LCP **1018.478 ms**, worst CLS **0.01216666**, worst lab INP **176 ms**. These meet the unchanged `<2000 ms`, `<0.05` and `<200 ms` limits. Protected content hashes stayed unchanged. Three independent cold/warm pairs per route were collected without competing build/browser/test jobs. The complete JavaScript size gate remains failed separately.

| Route | Cache | LCP median / worst (ms) | CLS median / worst | Valid samples |
| --- | --- | ---: | ---: | ---: |
| `/` | cold | 889.849 / 912.989 | 0.00100859 / 0.00100859 | 3 |
| `/` | warm | 299.073 / 317.305 | 0.00000000 / 0.00000000 | 3 |
| `/catalog` | cold | 981.214 / 1018.478 | 0.00010533 / 0.00010533 | 3 |
| `/catalog` | warm | 309.324 / 359.327 | 0.00000000 / 0.00315364 | 3 |
| `/special-offers` | cold | 810.643 / 812.792 | 0.00297305 / 0.00297305 | 3 |
| `/special-offers` | warm | 270.704 / 283.601 | 0.00000000 / 0.00000000 | 3 |
| `/compare?p=liquid-web-lw-6g,liquid-web-lw-4g` | cold | 907.571 / 913.700 | 0.00031363 / 0.00031363 | 3 |
| `/compare?p=liquid-web-lw-6g,liquid-web-lw-4g` | warm | 270.195 / 317.050 | 0.00000000 / 0.00000000 | 3 |
| `/providers/liquid-web` | cold | 925.101 / 925.835 | 0.01216666 / 0.01216666 | 3 |
| `/providers/liquid-web` | warm | 274.424 / 322.593 | 0.00000000 / 0.00000000 | 3 |
| `/guides/vps-market-snapshot-457-rows` | cold | 933.635 / 934.169 | 0.00025258 / 0.00025258 | 3 |
| `/guides/vps-market-snapshot-457-rows` | warm | 273.257 / 315.432 | 0.00000000 / 0.00000000 | 3 |
| `/offers/liquid-web-lw-6g` | cold | 936.089 / 963.692 | 0.00000000 / 0.00000000 | 3 |
| `/offers/liquid-web-lw-6g` | warm | 265.895 / 268.384 | 0.00000000 / 0.00000000 | 3 |

| Lab journey | INP median / worst (ms) | Valid samples |
| --- | ---: | ---: |
| filters-auto-apply-clear | 128 / 136 | 3 |
| sort-keyboard | 104 / 128 | 3 |
| pagination | 88 / 112 | 3 |
| compare-picks | 72 / 72 | 3 |
| compare-removal | 24 / 32 | 3 |
| theme | 72 / 80 | 3 |
| admin-client-validation | 24 / 32 | 3 |
| admin-authenticated-offer-validation | 176 / 176 | 3 |

Field INP remains unavailable; these are local scripted sessions. The initially failed final matrix is preserved as `performance-final-initial-2026-10-10.json`. Its lost compare pick led to the delayed-restore regression and native readiness repair, then this complete rerun. Invalid or slow samples were not dropped, retried into a smaller denominator or relabeled as passes.

## Catalog prerequisite verification, 12 October 2026

Webpack build `6laP8FWQHs7sJtc76DsdX` passes the unchanged complete first-load gate at **118706 gzip bytes**, counting framework/shared scripts. Later filter/sort/pagination/compare/theme journeys fetched **144297 additional gzip bytes** across the Pages/App Router boundary. SVG artwork is **7910 gzip bytes**, reported separately as an image. These are the measurements in `catalog-js-budget.json`, not a route-only denominator.

The 10 October failed App Router receipt remains at `catalog-js-budget-app-router-2026-10-10.json`. The same-tree Turbopack experiment during the audit measured 136589 bytes and failed, so the preserved catalog implementation builds with webpack. Passing first-load size does not establish a smaller whole visit.

The no-retry prerequisite gate passed 497 unit tests and 891 browser checks. The old Lighthouse matrix above remains historical: the full current-build matrix is still required for Phase 7 acceptance. See `docs/progress/pre-phase-7-repairs-2026-10-12.md` for the new guide packaging, runtime, contrast and data-evidence repairs.
