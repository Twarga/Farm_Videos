# Phase 7 performance measurement method

## Safety and provenance

Run against a sanitized, already-built isolated workspace, not the user's preview or production database. `RUNTIME_SOURCE_DATABASE` is required and must resolve to an existing real `/tmp` file made with SQLite's online backup API. The runtime tool makes another online backup in a unique private `/tmp/bestvpsforme-phase7-runtime-*` directory. It never imports, migrates or republishes research. The source is opened read-only; source facts, organic order, prices and held drafts are unchanged.

`RUNTIME_BUILD_DIR` optionally selects the built workspace; otherwise the current workspace is used. Runtime rejects `.env`, `.env.local`, `.env.production` and `.env.production.local` there. The server inherits no credential configuration: it receives production mode, the disposable database, a generated synthetic auth key and the local origin. Authentication stays enabled. The helper launches Next directly in a detached process group and terminates that group, including descendants, after every pair and at final cleanup. Disposable databases are removed; reports outside that directory survive.

Each performance report records Node, Next, React, Playwright, Chromium executable/version, Lighthouse and web-vitals versions, BUILD_ID/build directory/available Git commit, source-backup path, disposable backup SHA-256, active publication identity and dynamically read published/draft/snapshot counts. Pair byte reports with this build/data identity. Never dump environment values, credentials or database contents into evidence.

Pinned dev dependencies are `lighthouse@13.5.0` and `web-vitals@6.2.3`. The registry's Lighthouse Node requirement is `>=22.19`, compatible with Node 24. Versions are recorded from installed packages at measurement time, not assumed from historical reports.

Use the `.mts` native-ESM entry. A controlled loader probe found tsx's CommonJS transform injecting `__name` references into seven Lighthouse browser helpers while Lighthouse's installed-dependency wrapper remained empty. Native ESM preserved the original helpers. Do not add a browser-global shim or patch Lighthouse dependencies to hide this instrumentation failure.

## Commands

After the coordinator has finished the isolated baseline build, run the new tooling from the working repository while targeting the pre-change built snapshot:

```sh
RUNTIME_SOURCE_DATABASE=/tmp/bestvpsforme-phase7-8mkpmcnf/current-data.db \
RUNTIME_BUILD_DIR=/tmp/bestvpsforme-phase7-8mkpmcnf/baseline \
PERFORMANCE_PHASE=baseline PERF_RUNS=3 \
PERF_REPORT_PATH=docs/qa/phase-7/performance-baseline.json \
npx tsx scripts/check_performance_runtime.mts
```

For the final build, set `RUNTIME_BUILD_DIR` to the coordinator's final isolated built workspace, `PERFORMANCE_PHASE=final`, and `PERF_REPORT_PATH=docs/qa/phase-7/performance-final.json`. `PERF_RUNS` must be an integer at least 3. Both phases use identical settings and the same immutable source backup; they do not weaken budgets.

Byte tooling targets an already-running isolated server owned by the coordinator (or the runtime helper):

```sh
PERF_BASE_URL=http://127.0.0.1:PORT \
JS_BUDGET_REPORT_PATH=docs/qa/phase-7/catalog-js-budget.json \
npx tsx scripts/check_phase7_js_budget.ts
```

Only loopback HTTP origins are accepted, so these commands cannot accidentally follow an external production origin. The byte tool owns and closes its browser, but does not stop a server supplied by `PERF_BASE_URL`.

The coordinator runs pure accounting tests with:

```sh
npx vitest run src/lib/phase7-measurement.test.ts
```

A synthetic accounting test is not evidence that the actual website passes its byte budget.

## Load measurements

Seven templates are measured independently: home, catalog, special offers, filled two-plan comparison, canonical provider, published guide and supported published offer. Offer/provider/guide choices and publication counts are read from the copied data/content, with no fixed historical 322-row assertion.

Every route gets at least three requested cold/warm pairs. Each cold run starts a fresh production server and fresh Chromium process/profile, using the Playwright-installed executable. The following warm run reuses that server/browser with Lighthouse storage reset disabled, retaining the first run's cache. Warm does not mean a cross-route average. Readiness polling is outside the measured navigation and does not load the measured route.

Fixed mobile settings are 390 × 844 CSS pixels, DPR 1, mobile form factor, DevTools applied throttling: 150 ms latency, 1638.4 Kbps download, 750 Kbps upload and 4× CPU slowdown. Lighthouse's resolved settings are retained per sample. `onlyCategories=performance` plus the `errors-in-console` audit captures runtime-console validity as well as performance diagnostics.

All samples remain in summary JSON. Full Lighthouse results default to `<report>.artifacts/`; `PERF_ARTIFACT_DIR` can retain them in a separate `/tmp` directory, such as `/tmp/bestvpsforme-phase7-8mkpmcnf/baseline-lighthouse`, without committing bulky screenshots. Every summary sample records its full-result artifact path. A runtime exception, missing metric, console/runtime error or any Lighthouse run warning makes a sample invalid. Incomplete loading warnings are never waived. Invalid samples do not enter medians/worst values and cannot count toward the minimum. Missing evidence is null/unavailable, not 0.

Each Lighthouse call has a 75-second outer deadline in addition to its 45-second load limit. A hung call is retained as a failed sample and closes its browser; its warm pair is not attempted against a compromised CDP session. Progress is printed for each sample and interaction. Exception stacks are retained to diagnose instrumentation failures.

LCP and CLS medians and worst values are reported separately for every route and cache mode. Every valid sample must satisfy **LCP <2000 ms** and **CLS <0.05**; exact boundaries fail. A valid slow sample is a budget failure, not discarded as an outlier. TBT is diagnostic only and is not renamed INP. Any invalid or failed sample exits nonzero after saving collected JSON. A failing baseline is useful evidence, not an excuse to adjust thresholds.

## Scripted lab INP

Separate fresh mobile contexts repeat each of these realistic journeys at least three times with the same applied CPU/network throttling:

- Open the catalog filter drawer, pick a RAM facet, assert automatic URL application, close with Escape and clear filters. The current interface applies immediately; there is no invented Apply button.
- Change sort using real keyboard input.
- Follow pagination and assert the next page.
- Pick two comparison plans and remove a pick.
- Remove a plan from the filled comparison.
- Toggle dark/light themes and assert resulting document state.
- Type a synthetic invalid email into the anonymous admin login and click Sign in; assert native validation prevents submission.
- Use a synthetic authenticated session on the disposable copy, open the first offer editor, clear its required product name and attempt Save changes. Assert focus/native validation, zero admin POSTs and unchanged protected content. No real login, correction or checkout submission occurs.

The default final matrix contains 42 load samples and 24 scripted interaction runs (three runs per journey). The synthetic admin is created only after all public load measurements.

The maintained web-vitals browser distribution registers `onINP` before navigation with `reportAllChanges=true` and `durationThreshold=16`. Real Playwright click/key input generates trusted Event Timing interactions. The tool records the maintained metric value/identity, native `performance.interactionCount`, observer support and the count (not maximum duration) of Event Timing entries. The additional observer only establishes whether thresholded entries exist; it does not manufacture INP.

Journeys wait for document load and hydration of the existing theme control before input. They do not use Playwright's `networkidle` as a readiness signal for a streaming Next application. Browser/runtime and failed-request checks still apply. Telemetry now consumes its response body, preventing ignored response streams from keeping background requests open.

No native interactions, unsupported observation, missing callback despite recorded thresholded entries or invalid values mean unavailable and fail evidence completeness. A supported session with proven interactions but no thresholded entries/callback is labeled **below-observer-threshold**, with an upper bound of 16 ms; it is not assigned a fictional INP of 0. If web-vitals itself reports 0, that observed value is retained. Numeric lab INP must be **<200 ms**, including strict failure at exactly 200. Numeric medians/worst and below-threshold sample counts are separate. Browser errors or failed requests invalidate a journey.

These are local scripted-session results, not field data and not field p75. Field INP is explicitly unavailable until a real configured deployment supplies suitable data.

## First-load JavaScript accounting

The byte tool uses fresh mobile contexts for separate home and catalog navigations. It captures actual script responses, including all framework/shared/bootstrap/route chunks and JavaScript MIME responses. Playwright `Response.body()` supplies bytes after transfer-content-encoding decompression. Unique complete URLs are counted once, and duplicate URLs with inconsistent bodies are rejected.

Catalog collection waits for page load, a React fiber attached to the theme client control (hydration without a probe click), font readiness, two animation frames, completed response-body reads and 1.5 seconds of quiet script traffic. A bounded quiet timeout, failed script, missing/empty body, runtime error or an empty first-load script set is a measurement failure.

Each unique decoded body is gzipped separately at level 9; their compressed sizes are summed. **The complete first-load catalog total, including framework, must be <120,000 bytes** (KB = 1000 bytes). Exactly 120,000 fails. Catalog-only URLs absent from a separate clean home navigation are a diagnostic subset, not a reduced budget denominator; shared framework overhead is never subtracted.

Decoded and gzip-9 HTML bytes are reported alongside inline executable/data scripts and embedded `self.__next_f.push` RSC script bytes. Inline/RSC are subsets of HTML, so their totals overlap and must not be added twice. They remain visible in the evidence even if moving code into HTML lowers external-JS bytes. Content-hashed asset URLs and an HTML SHA-256 are retained; nonce-bearing HTML hashes can vary per request.

After first-load capture, filter/clear, keyboard sort, pagination, compare picks/navigation/removal and theme journeys capture newly fetched script URLs separately. A genuine empty later-chunk set is 0 because an already-valid initial script set was measured; an empty initial set is never a pass. Reports are saved before throwing a budget failure, and later chunks are collected even when the initial total already exceeds its budget.

## Interpretation and remaining evidence

The tooling implementation does not claim an actual performance pass. Only executed reports from the recorded builds establish baseline/final values. Held editorial/renewal/correction evidence is outside this measurement task. Browser/system load variability is visible in retained samples; invalid runs require investigation rather than a passing average or a relaxed budget. Real Turnstile, deployment/network behavior, field metrics and external uptime are not established by these local checks.
