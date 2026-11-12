# Browser and CSS verification — 30 September 2026

## Completion-goal verification

Next 16.3.6: the complete browser coordinator passed **240 checks**: 210 standard, 24 large-catalog, 6 synthetic authenticated admin actions. Standard coverage includes 156 functional/axe/theme tests and 54 visual baselines; 51 baselines are unchanged and only three reviewed mobile catalog/USD-offer/EUR-offer captures changed for the real 44px paid-link correction. Home/privacy baselines were preserved after correcting a fixture/build mismatch. No diff threshold was relaxed.

Expanded behaviors include read-only authenticated admin overview/import review, real save pending/disabled/audit feedback and expired-session edit retention, correction labels/native-required checks, privacy/DNT, responsive table semantics, mobile 20→40→50/reset and deferred evidence, filter/search keyboard focus, empty/pending states, measured analytics, comparison maximum/clear and unobstructed dock actions. Browser tests observed genuine failures before fixes to mobile paid-link height, admin command naming, raw query storage and comparison feedback obstruction; each passed after correction.

The coordinator uses separate synthetic `/tmp` databases and never publishes snapshots or approves terms. Final log: `/tmp/bestvpsforme-e2e/full-coordinator-final.log`; retained summary below. Current raw catalog HTML is 258,141 bytes, still above 150,000; Phase 1 stays open. The earlier159-test gate and pre-security-patch Lighthouse evidence below are historical.

## Earlier verification

Next **16.3.6**: `npm run test:e2e` passed **159 tests in 50.0 seconds**. The command prepared a deterministic SQLite backup in `/tmp`, completed the production build/start, then ran 105 functional, axe and theme checks plus 54 unchanged visual baseline comparisons. No snapshot updates were requested; the configured maximum visual difference is 1%. Remote GitHub CI has not run because this work has not been pushed.

The three projects cover desktop light/dark at 1440×1000 and mobile light at 390×844. Eighteen routes cover home, catalog, USD/EUR offers, compare, a provider, guides index/article, methodology, about, author, terms, privacy, corrections, updates, 404, admin login and invalid-login error. The serious/critical axe gate runs on every route and selected functional states. Private authenticated admin pages are not claimed as browser coverage.

Functional checks include filter-to-URL-to-Back, server-rendered catalog results, trailing search-space preservation, comparison add/share/fresh-context/reload/soft-navigation, paid-link disclosure and attributes, honest unreviewed billing terms, dated ECB/VAT presentation, guide navigation, protected admin login, `/go` redirect and persisted click record, and modal/desktop filters. Theme tests hold Next client chunks and observe the first frame, including CPU-throttled reload, system preference, and unavailable storage.

The CSS before/after matrix contains **108 captures per stage**: 18 routes × 390/1024/1440 pixels × light/dark. These captures were taken on Next 16.3.3 before the dependency-only security patch. The final patched run passed all 54 visual comparisons against the resulting baselines. Latest captures show **0 document horizontal overflow**, **0 theme mismatches**, and 27 pixel-identical pairs using an RGB difference threshold of 8. Thirty cases changed sampled computed styles; 20 screenshots changed full-page height. The comparison includes the approved contrast, disclosure/price readability, wrapping and animation fixes alongside CSS layering, so it is not an assertion that the layer refactor was pixel-identical. At 1024 the wide catalog table remains scrollable within its container.

Reviewed representative captures include mobile catalog in both themes, desktop catalog before/after, mobile home, and mobile Hostinger detail. The retained snapshots are under `tests/e2e/__screenshots__/`; compact matrix results are in `cascade-summary.json`. Full temporary captures and detailed pixel differences are under `/tmp/bestvpsforme-e2e/cascade-{before,after}/` and `/tmp/bestvpsforme-e2e/cascade-diff.json`.

Actual-data catalog HTML (50 desktop rows, plus 20 mobile rows) measured **306,127 bytes** raw and **21,211 bytes** gzip after shared-icon optimization, down from 719,062 raw bytes. This **does not meet the <150 KB raw-HTML target**. The remaining payload proposal is recorded separately; no responsive-row exception is approved here.

Lighthouse **13.5.0** measured the actual-data `/tmp` backup on Next **16.3.3**, mobile 390×844, simulated 4× CPU/150 ms RTT: performance **94**, LCP **2,567 ms**, FCP **912 ms**, TBT **94.5 ms**, CLS **0.0912**. It reported “The page loaded too slowly to finish within the time limit. Results may be incomplete.” This is limited measurement evidence, not a clean performance-target pass, and predates the dependency security patch. Exact metrics/settings are retained in `lighthouse-catalog-mobile-summary.json`.

The initial red runs exposed SSR results, disclosure, filter visibility, transient contrast, comparison navigation, search draft and theme issues. Those were fixed in the app and the final suite verifies the behavior. Detailed logs remain at `/tmp/bestvpsforme-e2e/`; the final patched log is `patched-browser-verification.log`.

## Latest actual-copy performance measurement

Lighthouse 13.5.0 / Next 16.3.6 / actual `/tmp` catalog: performance 94, LCP 2568ms, TBT 132.5ms, CLS 0.0912. Mobile 390×844, 4× CPU and 150 ms RTT. The slow-load warning says results may be incomplete; this remains limited measurement evidence. Raw HTML 258,141 bytes independently fails the 150,000-byte guard. Exact settings and metrics: `lighthouse-catalog-goal-summary.json`.
