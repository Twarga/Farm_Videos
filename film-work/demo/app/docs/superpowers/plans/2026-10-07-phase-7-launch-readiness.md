# Phase 7 Launch Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Environment adaptation:** Those names are the planning template's names. This workspace exposes `executing-plans`, `verification-before-completion`, `test-driven-development` and relevant accessibility skills. Use the installed equivalents; do not install a missing skill or block the work just because its prefix differs. Delegation is optional and must follow the executor's actual instructions.

**Goal:** Make the existing site fast, dependable, accessible and ready for a launch decision, with measured evidence and no changes to catalog facts.

**Architecture:** Keep the existing Next.js App Router application, SQLite/Drizzle data access and public design. Establish trustworthy measurements, implement request-specific CSP nonces, then optimize the measured bottlenecks. Evaluate Cache Components against the nonce requirement before enabling it; keep private data and time-sensitive promotion eligibility outside persistent caches.

**Tech Stack:** Installed Next.js 16.3.6, React 19, TypeScript, Node 24, better-sqlite3, Drizzle, Vitest, Playwright and axe-core. Resolve actual installed versions at execution time. Lighthouse is not currently a package dependency.

**Spec:** `bigone.md` Phase 7; `docs/product/PRODUCT_CONTRACT.md`; `DESIGN.md`; `brand/BRAND.md`; `docs/progress/phase-6-closure-2026-10-07.md`.

## Plain-language outcome

Visitors should open pages quickly, filter and compare without delays, recover from errors, and use the site on a phone or with a keyboard. The browser should block unauthorized scripts while the theme, forms and admin continue working. Completion requires evidence, not only a high Lighthouse score.

This document was the implementation plan. Execution and exact-build verification are recorded in [the delivery ledger](../../progress/phase-7-delivery.md). The original step checkboxes below preserve the planning document; use the delivery acceptance ledger for final status. The strict JavaScript budget and required human accessibility checks remain open.

## Global constraints

Copied project requirements:

- “Unknown information stays unknown.”
- “Public users do not need an account to browse, filter, compare, read evidence, or follow a provider link.”
- “Production never falls back to static TypeScript offers when the database is empty or unavailable.”
- “Visible focus is never removed.”
- “No page-level horizontal overflow is accepted at supported viewport widths.”
- “Light mode is the default; dark mode is a first-class twin with the same hierarchy.”
- “Public browsing uses labeled catalog facets and links, not text search or a command palette. Existing shared query URLs remain valid.”
- Master-plan budgets: **LCP < 2.0 s, CLS < 0.05, INP < 200 ms, JS on `/catalog` < 120 KB gzip**.

Additional execution boundaries:

- Preserve organic ranking, 36-month price math, columns, provider identities, original CSV, current publication and the Phase 6 editorial dispositions.
- The 38 held drafts, 20 open renewals and 16 correction rows are a separate evidence backlog. Do not publish, revise or clear them for this phase.
- Work against `/tmp` databases. No migration or production content write is needed by this plan.
- Never disable admin authentication to simplify a test. Use a disposable test account/session in the test database.
- Keep passwords, MFA secrets, cookies, database dumps and `.env` values out of logs and commits. Do not run live correction submissions or provider checkout actions as tests.
- Do not deploy publicly, rotate real credentials, configure paid services or change external infrastructure under this implementation plan. Prepare a concrete launch checklist instead.
- Ordinary reversible code changes and tests do not need repeated owner confirmation. Ask only for a material scope decision or an external action not authorized by the execution prompt.
- Follow `AGENTS.md`: read the installed Next.js guide before changing its APIs. Do not use remembered Next.js 14/15 conventions.
- Avoid redesigns. The current restrained interface supersedes the original decorative “Stamp style” mockups.

## Verified starting point and known traps

Inspected on 7 October 2026 at commit `ad1df6b`, branch `codex/resume-overhaul`. Recheck on entry and preserve newer user changes.

| Area | Starting point | Consequence |
|---|---|---|
| Phase 6 | 330 published offers; 62 reviewed editorial entries; 38 drafts; 17 migrations; 660 price history rows | Preserve these records; numbers are a dated reference, not hard-coded app constants |
| Tests | Last recorded 466 unit tests; 685 browser passes and 173 profile/viewport skips | Establish a fresh baseline; every profile needs to run |
| Rendering | Many routes use `force-dynamic`, `revalidate = 0` and/or `noStore`; Cache Components is not enabled | Do not flip one config flag and assume compatibility |
| CSP | `src/lib/security-headers.ts` allows script `unsafe-inline`; no `src/proxy.ts` | Implement per-request nonces and verify runtime behavior |
| Theme | Inline bootstrap in `src/app/layout.tsx` | It needs the same nonce as the response CSP; preserve no-flash theme behavior |
| Errors | `error.tsx`, `not-found.tsx`, `/updates` already exist | Verify and refine them, do not recreate them |
| Next error API | Installed docs use `retry()`, and the app already uses it | Do not “fix” it to older `reset()` examples |
| Old runtime checks | Performance and accessibility scripts expect removed public search/old interaction patterns | Repair the tests to match the product contract, not the site to match old tests |
| Existing performance report | 30 Sept catalog report: LCP about 2.568 s, CLS about 0.091, warning about incomplete loading | Historical only; not a Phase 7 pass or current baseline |
| Special offers | Time-sensitive 24-hour limited-stock / 72-hour other freshness guards | Never cache an expired offer into visibility; do not expect 13 highlights forever |
| Credentials | Local production configuration exists and is ignored by Git | Use synthetic configuration for tests; do not print real values |
| Preview | Local user preview was on port 3115 | Avoid taking it down during measurement; use a separate build workspace/server if necessary |

### Architecture decision that must happen first

Installed `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md` explicitly says nonce-based CSP needs dynamic rendering and PPR is incompatible with it. The master plan asks to **evaluate** Cache Components, not enable it regardless of consequences.

**Default decision:** implement the nonce CSP, keep `cacheComponents` disabled, retain request-scoped deduplication, and measure the result. Record why full Cache Components/PPR adoption is deferred. Only adopt an alternative if the installed version demonstrably supports it and the combined CSP/freshness tests pass. Never store a response nonce in a shared cache or reuse it across users.

A documented negative Cache Components evaluation satisfies that evaluation task. A missed performance budget does not become a pass because the caching decision was reasonable.

## Order and deliverables

| Task | Deliverable | Depends on |
|---|---|---|
| 1 | Baseline, isolated test data, rendering decision | None |
| 2 | Working nonce CSP and auth/form regressions | 1 |
| 3 | Accurate performance and byte-budget checks | 1; final measurements after 2 |
| 4 | Measured performance improvements | 2, 3 |
| 5 | Cache/freshness decision and mutation visibility proof | 1, 2; optimize only if justified by 4 |
| 6 | Error recovery and publication-update polish | 1 |
| 7 | Keyboard, zoom, contrast and screen-reader evidence | 2, 4, 6 |
| 8 | Integrated release report and handoff | All |

Tasks are ordered for one worker. If the executor is allowed to delegate, measurement tooling and error/accessibility review can be assigned separately. Workers must have explicit file ownership and must preserve one another's edits. Only one worker may run a build that writes the shared `.next` directory at a time.

## Task 1 — Establish an honest baseline

**Read:** `AGENTS.md`, the spec documents above, `next.config.ts`, `src/app/layout.tsx`, `src/lib/public-catalog.ts`, `src/lib/public-special-offers.ts`, `scripts/run_browser_checks.ts`, `.github/workflows/ci.yml`.

**Create:** `docs/progress/phase-7-status.md`, `docs/qa/phase-7/rendering-decision.md`.

**Interfaces:** Preserve `getPublicCatalogState(): PublicCatalogState` and `PUBLIC_CATALOG_TAG = "public-catalog"`. React `cache()` currently deduplicates some reads; it is not proof of a persistent data cache.

- [ ] Record branch, commit, changed files and installed versions without dumping environment variables.

```bash
pwd
git status --short
git log -1 --oneline
node -v
npm ls next react @playwright/test --depth=0
```

- [ ] Create a consistent SQLite backup in `/tmp` for current-data testing; never use a plain filesystem copy of a database with an active WAL. Use a unique directory and retain its path in the status document.

```bash
python3 - <<'PY'
import pathlib, sqlite3, tempfile, os
root = pathlib.Path(tempfile.mkdtemp(prefix='bestvpsforme-phase7-'))
source = sqlite3.connect('file:data/bestvpsforme.db?mode=ro', uri=True)
target = root / 'current-data.db'
copy = sqlite3.connect(target)
source.backup(copy)
assert copy.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
assert not list(copy.execute('PRAGMA foreign_key_check'))
copy.close(); source.close(); os.chmod(target, 0o600)
print(target)
PY
```

- [ ] Run `npm run lint`, `npm run typecheck`, `npm test`; record actual failures. Do not use an old test count as a pass.
- [ ] Build and run browser profiles sequentially. The build may replace the user preview's `.next` assets; use an isolated checkout/build workspace if the preview must remain uninterrupted. Do not build concurrently with browser profiles.

```bash
E2E_FIXTURE=1 DATABASE_URL=/tmp/bestvpsforme-e2e/catalog.db npm run test:e2e:prepare
E2E_FIXTURE=1 DATABASE_URL=/tmp/bestvpsforme-e2e/catalog.db npm run build
E2E_REUSE_BUILD=1 npm run test:e2e
```

- [ ] Read these installed guides, then write `rendering-decision.md`: `01-app/01-getting-started/08-caching.md`, `01-app/02-guides/migrating-to-cache-components.md`, `01-app/02-guides/content-security-policy.md`, `01-app/03-api-reference/03-file-conventions/proxy.md`. All paths are below `node_modules/next/dist/docs/`.
- [ ] Record default decision: nonce CSP with dynamic HTML; Cache Components/PPR deferred because of the documented incompatibility. Include baseline impact measurements once Task 3 supplies them.
- [ ] Commit only the baseline/decision documents, with no database or private configuration.

**Done when:** another worker can identify the exact code/build/data under test, known baseline failures, and the chosen rendering strategy.

## Task 2 — Enforce nonce CSP without breaking the app

**Modify:** `src/lib/security-headers.ts`, `next.config.ts`, `src/app/layout.tsx`, `scripts/check_security_headers.ts`.
**Create:** `src/proxy.ts`, `src/lib/security-headers.test.ts`, `tests/e2e/csp.spec.ts`.
**Reuse:** `tests/e2e/theme.spec.ts`, `admin-actions.spec.ts`, `admin-editorial.spec.ts`, `admin-terms.spec.ts`, `src/components/CorrectionForm.tsx`, `src/lib/admin-auth.test.ts`.

**Interfaces to implement:**

```ts
contentSecurityPolicy(environment: string | undefined, nonce: string): string
securityHeaders(environment?: string): SecurityHeader[] // non-CSP headers only
```

`proxy()` becomes the only owner of HTML CSP. The non-CSP headers remain in `next.config.ts`; avoid two conflicting CSP headers.

- [ ] Add a failing helper test using a fixed synthetic nonce. Require production script policy to contain the nonce and exclude `unsafe-inline` and `unsafe-eval`; permit the development-only eval exception. Verify unchanged frame, MIME, referrer and permissions protections.

```ts
import { expect, it } from 'vitest';
import { contentSecurityPolicy } from './security-headers';
it('restricts production scripts to the nonce policy', () => {
  const csp = contentSecurityPolicy('production', 'synthetic-nonce-for-test');
  const script = csp.split(';').find(part => part.trim().startsWith('script-src '))!;
  expect(script).toContain("'nonce-synthetic-nonce-for-test'");
  expect(script).not.toContain("'unsafe-inline'");
  expect(script).not.toContain("'unsafe-eval'");
});
```

- [ ] Run `npx vitest run src/lib/security-headers.test.ts`; observe the failure before changing the helper.
- [ ] Implement a unique cryptographic nonce per HTML request in `src/proxy.ts`, using the installed guide. Propagate it on the request headers for Next rendering and on the response CSP. Overwrite any incoming `x-nonce` value; never trust a client-supplied nonce.

```ts
const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
const csp = contentSecurityPolicy(process.env.NODE_ENV, nonce);
const requestHeaders = new Headers(request.headers);
requestHeaders.set('x-nonce', nonce);
requestHeaders.set('Content-Security-Policy', csp);
const response = NextResponse.next({ request: { headers: requestHeaders } });
response.headers.set('Content-Security-Policy', csp);
return response;
```

Import `NextRequest`/`NextResponse` from `next/server` and the helper from `@/lib/security-headers`. Export `proxy(request: NextRequest)`. Define a literal matcher excluding `_next/static`, `_next/image`, public assets, API/health and `/go` routes where an HTML nonce is unnecessary; verify those routes retain their other protections. Cover all HTML pages, including admin, errors and not-found routes. Start without a prefetch bypass; test navigation before adding exclusions.

- [ ] Make the root layout request-aware using installed `headers()`/`connection()` guidance. Add the nonce to the existing theme bootstrap; preserve fonts and theme markup.

```tsx
const nonce = (await headers()).get('x-nonce') ?? undefined;
<script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
```

Do not add `'use cache'` around the layout. Keep style policy separate: Phase 7 removes script `unsafe-inline`; the existing inline styles need not be rewritten merely to remove style `unsafe-inline`. Keep required same-origin and Cloudflare connections/frames narrowly scoped to the actual correction flow. Do not enable insecure-request upgrading on the HTTP localhost preview.

- [ ] Add a production-browser test fetching `/` twice: both CSPs contain nonempty, different nonces; the theme script's `nonce` property matches its response header. Validate generated framework scripts, not only the custom theme script. Include a request with a forged incoming nonce and assert it is replaced.
- [ ] Collect `securitypolicyviolation` events before navigation. Test light/dark first paint, catalog filter/pagination, comparison navigation, corrections validation and authorized/unauthorized admin actions. A blocked injected script should be tested in a synthetic browser test only, with no production mutations.
- [ ] Confirm private pages and protected APIs are not shared-cacheable. Exercise anonymous access, session expiry and invalid actions on the disposable action fixture; keep the user's real session/configuration intact.
- [ ] Update `scripts/check_security_headers.ts` to call the revised helper and assert behavior rather than the previous literal `unsafe-inline` policy.
- [ ] Run focused tests, rebuild once, run `csp.spec.ts` and the existing theme/action profiles; fix CSP violations before performance tuning. Document any real Turnstile verification that requires a configured deployment as pending, not passed.
- [ ] Commit this working boundary separately.

**Done when:** production script CSP has no unsafe-inline/eval, each HTML response gets its own matching nonce, and all existing interactions work.

## Task 3 — Repair measurement tools and establish budgets

**Modify:** `scripts/check_performance_runtime.ts`, `scripts/check_accessibility_runtime.ts`, `package.json`, lockfile only if adding measurement dependencies.
**Create:** `scripts/check_phase7_js_budget.ts`, `docs/qa/phase-7/performance-baseline.json`, `docs/qa/phase-7/performance-method.md`.

**Interfaces:** Performance tooling takes `RUNTIME_SOURCE_DATABASE` pointing to an existing `/tmp` copy and makes its own disposable backup. It starts an isolated production server, exits nonzero on a failed budget, and writes machine-readable measurements. Byte tooling takes `PERF_BASE_URL` for that test server and writes unique script URLs plus compressed byte totals.

- [ ] Remove obsolete search-box, slash-shortcut and palette assumptions from both runtime scripts. Keep actual keyboard/filter/compare assertions. Update old 322-row setup expectations by reading the copied publication, without importing/publishing another catalog just to run a performance check.
- [ ] Use the installed Playwright Chromium executable where possible; do not require an unrelated system browser. Preserve database path guards and process cleanup.
- [ ] Measure `/`, `/catalog`, `/special-offers`, filled `/compare`, a provider, a guide and a supported offer. Include cold browser context and fresh server, then separate warm results. Do not average different routes into one “passing” number.
- [ ] Use at least three valid mobile Lighthouse runs per route with fixed mobile/network/CPU settings, retain all samples and report median plus worst sample. A runtime error or incomplete-loading warning makes a run invalid; resolve or report it instead of counting it as a pass.
- [ ] If Lighthouse is needed, pin a compatible dev-only version after verifying its Node requirements. The historical report used 13.5.0; that is context, not permission to assume an installed version. Save the lockfile and record the exact browser, Lighthouse, Next and Node versions.
- [ ] Apply the master's strict `<` budgets: LCP 2000 ms, CLS 0.05, scripted-session INP 200 ms. Record per-route failures. Lighthouse load-only TBT is diagnostic, not proof of INP. Use a maintained Event Timing/INP implementation with real click/key sequences, and label it **lab INP**. If field data is unavailable, say so; do not claim field p75.
- [ ] Script filter opening, selection, clearing, sort, pagination, compare picks/removal, theme toggle and an admin validation failure in separate realistic journeys. Preserve interactions below the observer threshold correctly; “no samples” is unavailable, never 0 ms.
- [ ] Count unique first-load JavaScript response bodies on a clean `/catalog` navigation, including framework/shared chunks; wait for hydration and observed script traffic to settle. Report HTML, embedded RSC/inline script bytes and later interaction chunks separately so moving code into HTML cannot hide its cost. Deduplicate URLs, decode transfer compression first, then gzip consistently at level 9.

```ts
import { gzipSync } from 'node:zlib';
export function gzipScriptBytes(uniqueScriptBodies: ReadonlyMap<string, Uint8Array>): number {
  if (uniqueScriptBodies.size === 0) throw new Error('No script bodies measured');
  return [...uniqueScriptBodies.values()]
    .reduce((sum, body) => sum + gzipSync(body, { level: 9 }).byteLength, 0);
}
export function assertCatalogJsBudget(bytes: number): void {
  if (!Number.isFinite(bytes) || bytes < 0 || bytes >= 120_000) {
    throw new Error(`Catalog JavaScript ${bytes} bytes fails the <120 KB budget`);
  }
}
```

The document defines KB as 1000 bytes. Record an empty script set as a measurement failure. Include total initial JS and route-specific JS separately; only the full total satisfies this acceptance budget. Reconcile this definition with the owner if framework overhead makes the target unattainable; never silently subtract the framework.

- [ ] Add small tooling tests for duplicate URLs, already-decoded input, missing measurements and strict threshold boundaries. A synthetic body test validates accounting, not the site's actual budget.
- [ ] Write the baseline report from actual runs, including errors. Commit the corrected tooling before optimization.

**Done when:** the measurements reflect today's interface and dataset, are repeatable, and clearly distinguish lab evidence from field metrics.

## Task 4 — Improve the measured bottlenecks

**Inspect/modify only where measurements justify:** `src/components/CatalogClient.tsx`, `src/components/FilterRail.tsx`, `src/components/catalog/OfferTable.tsx`, `src/components/CompareProvider.tsx`, `src/components/compare/CompareClient.tsx`, `src/components/shell/SiteFrame.tsx`, `src/lib/catalog-page.ts`, `src/lib/catalog-transport.ts`, `src/lib/catalog/use-catalog-query.ts`, `src/app/layout.tsx`, `src/app/globals.css` and the relevant imported style modules.
**Tests:** existing catalog behavior/page/transport tests, `tests/e2e/catalog-large.spec.ts`, `ui-contracts.spec.ts`, `theme.spec.ts`; new regressions only for observed bugs.
**Create:** `docs/qa/phase-7/performance-final.json`.

- [ ] Read the bundle/script list, Lighthouse LCP element and layout-shift trace. Record the three largest contributors with concrete evidence.
- [ ] Fix one contributor per commit. Prefer removing unused shipped modules, keeping static markup on the server, deferring genuinely optional controls, and reserving dimensions for logos/fonts/media. Preserve accessible names and above-the-fold content.
- [ ] If transport cost dominates, preserve the existing `EncodedCatalogRows` lossless contract; add a failing encode/decode regression for any proposed change before editing it.

```ts
expect(decodeCatalogRows(encodeCatalogRows(rows))).toEqual(rows);
```

Reuse real `CatalogRow` fixtures from `src/lib/catalog-transport.test.ts`, including nulls, currencies, dated evidence and affiliate flags. Do not make unknown values smaller by turning them into zero or dropping disclosure.

- [ ] If duplicated DOM causes slow interactions, use the existing large-catalog test to prove each offer appears once, keyboard focus survives pagination, and mobile/desktop use the intended responsive structure. Do not hide a duplicate table offscreen and count it as fixed.
- [ ] If layout shift is measured, fix the specific element's stable sizing or font metrics. Keep the brand fonts, dark mode and visible focus. Add a screenshot comparison for the changed surface only.
- [ ] If client work dominates, inspect import boundaries before using dynamic imports. Keep filter, compare and provider-link controls immediately usable; defer optional UI only with a usable loading state.
- [ ] After each substantive change run focused regressions and compare the same measurement profile. Keep improvements that demonstrate benefit; undo experiments that worsen the measured result or UX.
- [ ] Run the full budget suite under the final nonce CSP. Record a missed budget honestly; do not increase thresholds to get green output.

**Done when:** measured budgets pass, or the report explicitly identifies the remaining blocker without claiming Phase 7 complete.

## Task 5 — Resolve caching and prove freshness

**Primary output:** `docs/qa/phase-7/rendering-decision.md` with final measurements and decision.
**Inspect:** `src/lib/public-catalog.ts`, `src/lib/public-home.ts`, `src/lib/public-special-offers.ts`, `src/lib/special-offers.ts`, `src/lib/dataset-stats.ts`, `src/lib/site-settings.ts`, `src/lib/admin-offer-operation.ts`, `src/app/admin/imports/actions.ts`, `src/app/admin/editorial/actions.ts`, `src/app/admin/terms/actions.ts`, `src/app/admin/actions.ts`, `scripts/publish_special_offers.ts`.
**Tests:** reuse publication, editorial and price-terms tests; create `tests/e2e/public-freshness.spec.ts` if integration coverage is missing.

- [ ] Keep Cache Components disabled if Task 1's incompatibility remains. Benchmark request-scoped deduplication before adding a persistent cache; document no-cache as a deliberate valid evaluation result.
- [ ] Test a synthetic reviewed save, unpublish/revert-to-draft, terms save, append publication and rollback. Request home, catalog, provider, offer, compare, dataset guide, updates and sitemap afterward; verify they agree with the committed state.
- [ ] Verify a draft transition removes public catch/fit/workload tags. Use the action fixture only; no owner record is edited.
- [ ] Test special-offer eligibility across its 24/72-hour freshness thresholds and explicit expiry/sold-out boundaries using a fake clock in pure selection tests. Keep time eligibility outside cached payloads; never change `checkedAt` to extend visibility without new evidence.
- [ ] If persistent data caching is actually proposed, define revision inputs for snapshot, editorial, prices and settings before implementing it. Snapshot ID alone is insufficient: Phase 6 editorial/terms saves did not create a new snapshot. Handle CLI writes from another process as well as server actions. Do not cache an unavailable database result into a healthy response.
- [ ] Read `revalidateTag`, `updateTag`, `cacheLife` and `cacheTag` installed references before using them. Existing `revalidateTag(tag, 'max')` allows stale-while-revalidate; it does not promise immediate removal of a revoked claim. Choose and test expiration semantics deliberately. `updateTag` is Server-Action-only; CLI jobs cannot call it as a general invalidator.
- [ ] Adopt `'use cache'` only if the combined strategy has demonstrated nonce compatibility, safe auth boundaries, bounded cardinality for query keys, fresh mutations and better measured performance. Include the required async caller/migration changes explicitly if choosing that route. Otherwise close this task as evaluated and deferred with evidence.

**Done when:** cache choice is documented and all publication/freshness boundaries remain correct. A new cache is not mandatory.

## Task 6 — Finish recovery and update-page UX

**Modify only as needed:** `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/updates/page.tsx`, existing shared styles.
**Tests:** `tests/e2e/public-routes.spec.ts`, `ui-defects.spec.ts`; create `tests/e2e/recovery.spec.ts` for missing recovery coverage.
**Read:** installed `03-api-reference/03-file-conventions/error.md` and `not-found.md` before editing.

- [ ] Prove unknown URLs return HTTP 404 and display a useful catalog link. Keep exactly one main landmark and one h1.
- [ ] Create a disposable failure case that makes a public read fail. Assert the page shows unavailable/error feedback and never seeded fallback plans. Restore the test dependency and activate “Try again”; prove the page recovers.
- [ ] Preserve Next.js 16.3's current `retry()` prop. The existing error page is already using it correctly.
- [ ] Show user-facing copy such as “We couldn't load this page. Try again or open the catalog.” Keep technical exception strings, SQL, filesystem paths and secrets out of the UI; a safe request/reference ID is acceptable.
- [ ] Verify `/updates` derives dates/counts and rollback states from stored publications, handles no publication and avoids leaking internal import filenames. Review the current compact timeline before changing its appearance.
- [ ] Test error copy, retry control, fallback links and timeline in both themes and at narrow widths. Update only intentional visual baselines after inspecting the difference.
- [ ] Do not add an always-enabled production fault-injection route. Use the established fixture/server isolation pattern.

**Done when:** errors are understandable, recovery works, update history is truthful, and the existing design stays consistent.

## Task 7 — Complete accessibility and device checks

**Modify:** `scripts/check_accessibility_runtime.ts` and only components with reproduced issues.
**Create:** `docs/qa/phase-7/accessibility.md`; extend existing browser tests rather than cloning the entire suite.
**Use if available:** `a11y-testing`, `accessibility-inclusive-design`, `visual-feedback-loop`.

- [ ] Repair stale runtime selectors first. Exercise the current catalog filters and compact navigation; do not restore deleted search or command-palette UI for test compatibility.
- [ ] Run axe on all public route templates, special offers, empty/filled compare, 404 and failure states, plus authenticated admin/editorial/terms pages in the disposable database. Fix serious/critical findings; also review relevant A/AA findings of lower automated severity rather than equating severity with compliance.
- [ ] Complete keyboard journeys: skip link → navigation → filters → apply/clear → sort/pagination → compare selection → compare removal → provider action; then correction validation and admin draft validation/session expiry. Verify Escape closes overlays, focus is contained where required and returns to the trigger.

```ts
const opener = page.getByRole('button', { name: /^Open filters/ });
await opener.focus();
await page.keyboard.press('Enter');
const dialog = page.getByRole('dialog', { name: 'Catalog filters' });
await expect(dialog).toBeVisible();
await page.keyboard.press('Escape');
await expect(dialog).toBeHidden();
await expect(opener).toBeFocused();
```

This example belongs in the repository's Playwright test environment. If using an interactive browser tool instead, follow that tool's supported API.

- [ ] Test 320, 390, 768, 1024 and 1440 CSS-pixel widths, both themes, reduced motion, and **actual browser zoom at 200%**. Changing device pixel ratio is not browser zoom. A narrower viewport can supplement reflow testing but is not sufficient evidence of text enlargement.
- [ ] Check readable labels, selected states, 44px primary touch targets, visible focus, sticky CTA/compare tray overlap, and page-level horizontal overflow. A comparison table may scroll inside its own labeled region; the page itself should not spill horizontally.
- [ ] Perform one real VoiceOver or NVDA smoke journey and record OS, browser, screen reader and results. If neither is available on this Linux workstation, prepare the exact manual checklist and mark the result pending. An accessibility tree or axe scan is not a substitute. Continue all other work without pretending this check passed.
- [ ] Inspect screenshots of changed surfaces. Store only sanitized screenshots without private credentials or user data.

**Done when:** automated and manual evidence is recorded; any unavailable real screen-reader/zoom test remains a visible launch gate.

## Task 8 — Integrate, document and hand off

**Modify:** `.github/workflows/ci.yml`, `package.json` only to add stable checks; `bigone.md` Phase 7 status.
**Create:** `docs/progress/phase-7-delivery.md`, `docs/qa/phase-7/launch-checklist.md`.

- [ ] Wire deterministic nonce, JS-budget, recovery and freshness regressions into the relevant test profiles. Profile-specific tests must not all be skipped by the coordinator. Put slower/noisy Lighthouse runs in a clearly named measurement job or command, with stored reports; do not add timing-flaky assertions to ordinary unit tests.
- [ ] Run this ordered final gate against disposable fixtures. Set a separate port/build workspace when needed. Do not launch another build while the coordinator is using `.next`.

```bash
npm run data:check
npm run lint
npm run typecheck
npm test
E2E_FIXTURE=1 DATABASE_URL=/tmp/bestvpsforme-e2e/catalog.db npm run test:e2e:prepare
E2E_FIXTURE=1 DATABASE_URL=/tmp/bestvpsforme-e2e/catalog.db npm run build
E2E_REUSE_BUILD=1 npm run test:e2e
npx tsx scripts/check_security_headers.ts
```

- [ ] Run the corrected current-data performance/accessibility and JS-budget tools using Task 1's actual `/tmp` path and the final production build. Record the exact commands and artifact paths. Do not rely only on the small synthetic fixture for performance claims.
- [ ] Confirm production catalog/editorial/price/publication rows are unchanged by Phase 7. Recheck counts with a read-only connection and compare against the Task 1 copy where no user changes occurred; account for concurrent user edits rather than reverting them.
- [ ] Prepare launch checklist: runtime/hosting assumptions, HTTPS, required environment **names only**, session behavior, CSP validation on the real origin, correction-service configuration, health/monitoring, encrypted-backup ownership, restore rehearsal and rollback procedure. Inspect existing `docs/qa/2026-09-01-deployment-readiness.md` and launch review first; do not claim old checks are current.
- [ ] Report local code/test readiness separately from external deployment readiness. No public deployment or external monitoring subscription is part of this plan.
- [ ] Record all measured values, test counts, screenshots, preserved holds, pending manual checks and rollback instructions. Update master checkboxes only when their evidence exists.
- [ ] Commit coherent changes and leave the working tree understandable. Do not include `.env`, databases, reports containing sessions, or generated bulk artifacts unrelated to the phase.

### Acceptance ledger

| Requirement | Evidence required | Completion rule |
|---|---|---|
| Cache Components evaluated | Installed-doc analysis plus measured decision | Implemented safely or explicitly deferred due nonce incompatibility |
| Nonce CSP | Production response and browser tests | Unique matching nonces; no script unsafe-inline/eval; existing flows work |
| Performance | Per-route valid measurements with versions/settings | Strict budget pass; field INP unavailable is labeled, not fabricated |
| Catalog JS | Deduplicated full first-load gzip byte report | Less than 120,000 bytes including shared/framework code |
| Errors and updates | 404, failure/retry and publication-history tests | Useful recovery and accurate content in both themes |
| Accessibility | Axe, keyboard, reflow/zoom, screen-reader record | Actual checked results; pending manual checks remain open |
| Data integrity | Read-only comparison and unchanged held records | No unauthorized catalog or editorial mutation |
| Delivery | Fresh integrated checks and launch checklist | No undocumented failure or unsupported “production ready” claim |

If a strict target remains unmet, finish the safe implementation and report the exact remaining gap. Do not close Phase 7 as fully accepted by weakening a threshold, renaming a failed test, or treating unavailable verification as a pass.

## Sources and continuation notes

Next.js implementation guidance is the bundled documentation listed in Tasks 1/2/5/6, matching the installed framework rather than an older tutorial.

For measurement terminology, see [INP guidance](https://web.dev/articles/inp): realistic interactions can be measured in a lab, but a page-load-only proxy is not field INP. [Lighthouse scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring) explains why the aggregate score alone is insufficient for the project's individual budgets.

At every handoff, update `docs/progress/phase-7-status.md` with: last verified commit, completed task, next task, running server/build ownership, disposable DB path, tests run, current measurements and unresolved decisions. This prevents another AI from restarting completed work or treating historical results as current.
