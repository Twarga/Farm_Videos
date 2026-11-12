# Phase 7 rendering decision

## Decision

Keep Cache Components and PPR disabled. Render HTML per request with a fresh cryptographic CSP nonce. Keep React `cache()` request-scoped deduplication; do not introduce a persistent public-data cache.

The installed Next.js 16.3.8 CSP guide (rechecked after the security patch from 16.3.6) (`node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md:179-207,385-407`) requires dynamic rendering and explicitly states PPR is incompatible: static shell scripts cannot access a request nonce. The installed caching guide covers the opt-in Cache Components model; the migration guide replaces `dynamic`/`revalidate` with cache scopes, not a compatibility guarantee for nonce HTML. The proxy guide requires a literal matcher and Node runtime; no separate runtime configuration is permitted.

## Boundaries

- `src/proxy.ts` is the only HTML CSP owner. It overwrites untrusted incoming `x-nonce` and CSP request headers, then supplies Next's renderer and the response with the same policy.
- Root `headers()` access opts HTML into request-time rendering. Theme bootstrap uses the matching nonce. Production script policy excludes `unsafe-inline` and `unsafe-eval`; style attributes remain supported separately.
- No CDN/shared caching of nonce-bearing HTML or authenticated pages. API/static/redirect responses retain non-CSP headers.
- Editorial, price and setting changes can occur without a snapshot change and through CLI processes. Snapshot-only persistent cache keys would be incorrect.
- Special-offer time eligibility must be reevaluated on every request; cached publication must not extend 24/72-hour windows.
- React request memoization does not persist across users and must never capture a response nonce in shared state.

## Verified evidence — 10 October 2026

Final build `kfsfRayDWDzMr7Vzz_twm`: lint/TypeScript and 495 unit tests passed; complete browser coordinator passed 885 tests with 207 intentional fixture/profile skips. Runtime nonce, theme, unauthorized/authorized actions and missing-route HTML regressions passed under the production policy.

The independent [freshness oracle](freshness-results.json) exercised warm baseline, reviewed save, draft reversion, terms save, append publication and rollback from a process separate from the application, without Next invalidation calls. Home, catalog, provider, offer, compare, dataset guide, updates, sitemap and public API reconciled with stored state. Pure tests cover 24/72-hour, sold-out and explicit-expiry boundaries. [Recovery checks](recovery-results.json) proved real unavailable dependencies recover through `retry()`.

Full initial catalog JS is 168903 gzip-9 bytes, failing the unchanged <120000-byte target. All 42 repeated mobile loads and 24 lab interaction runs passed (worst LCP 1018.478ms, CLS 0.01216666, lab INP 176ms); results are in `performance-final.json`; the caching decision does not waive a failed performance budget. There is no valid timing-gain claim against the old baseline because that baseline's Lighthouse instrumentation failed. No shared cache was introduced merely to improve a score at the expense of nonce or publication freshness.

## Catalog routing after the 12 October prerequisite repairs

The preserved catalog implementation uses Pages Router `getServerSideProps`, with App Router retained for other routes. It reuses the existing publication mapper, query/pricing functions and navigation contract. `_document` supplies the request nonce to the theme script and framework scripts; catalog HTML remains private/no-store. Cache Components and shared HTML caching remain disabled.

The strict budget still counts all external first-load JavaScript, including the Pages framework. The [current budget receipt](catalog-js-budget.json) reports later cross-router scripts and the SVG artwork separately. The [old App Router receipt](catalog-js-budget-app-router-2026-10-10.json) remains unchanged. Passing a first-load budget does not establish that cross-router journeys download less overall.

See the [repair handoff](../../progress/pre-phase-7-repairs-2026-10-12.md) for the exact current build and the measurements still required before Phase 7 acceptance.
