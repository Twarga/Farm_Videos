# V1 second review: 26 Oct 2026

**Verdict: substantial improvement; do not deploy yet.**

Reviewed commit: `e99f202` (plus its preceding V1 repair commits). Application and database changes were not made during this review. This file and accompanying evidence are review outputs only.

## How this review ran

- Copied the checkout and took a consistent SQLite `.backup` into `/tmp/bvp-review2/`.
- Built the copied application and started its **production standalone server** on loopback port 3377 with the copied database. The pre-existing server on port 3217 uses only five synthetic offers; it was not used to judge catalog coverage.
- Independently exercised home, catalog, compare, offer, special offers and providers at 1440, 768 and 390 px. Night and day included; captures used reduced motion.
- Ran axe on seven representative routes, including corrections and admin login.
- Ran existing desktop-light Playwright tests against a separate disposable five-offer fixture on port 3378. This was the desktop project, not the complete six-project/coordinator release run.
- Ran lint, typecheck, unit tests, production build, security checks, content checks, research CSV check and production-dependency audit.
- No deployment, provider import, live database write or application fix was performed. Admin authenticated actions were not repeated by this reviewer; the committed TOTP walkthrough was inspected as supporting evidence.

## Verified fixed since the first review

| Previous issue | Independent result |
|---|---|
| Old broken compare page | Replaced with Shore table, three aligned headers, sewing thread and 11 differing rows in the sample. Difference toggle hides matching rows. |
| Stale home finder | Selecting 16 GB changes 317 to 127 and points to `/catalog?ram=16`, at all three widths. Budget $5 gives 40 matches on both home and catalog. |
| Home native dropdowns | Stitched dropdowns work; the new home keyboard/count tests pass. |
| Price sorting | First 96 paid rows ascend without any inversion: $0.50, $1.83, $2.00, $2.00, $2.25… |
| Blank mobile filter count | Button reads `Show 317 plans`. |
| Receipt evidence layout | Full-width readable box; one direct-link disclosure. True monthly cost opens and shows the supported $10.99 lower bound for the sample Hostinger plan. |
| Broken provider logos | No broken HTML images in the captured representative routes; existing provider-logo browser test passes. |
| Count/publication disagreement | Home, catalog, API and sitemap agree on 317 offers / 41 providers. No-rating CloudCone, Cockbox and YourServer provider routes return 404; sampled CloudCone offer returns 404. |
| Corrections migrations | Copied real DB has all 19 migrations and the corrections table. `quick_check` = ok, foreign-key check = no violations. Readiness returns 200 with migrations ok. |
| Unsafe stale specials | Current expired/stale promotion entries no longer display; zero current deals is an honest empty state. |
| Uncommitted implementation | Fixes now have separate commits. Only `.empryo/` was untracked before this review output. |

Screenshots show the compare and receipt repairs. These are not claims of pixel-perfect parity across all pages.

## Release blockers / remaining findings

### R1. Real interaction bug: an early offer-page compare click is lost

**Priority: high.**

Locations:
- `src/components/shore/ShoreOfferPage.tsx:86,164–166`
- `src/components/CompareProvider.tsx:135`
- Existing regression: `tests/e2e/phase7-performance.spec.ts:4–30`

Reproduction on the production standalone server:
1. Store `['hostinger-kvm-1']` under `shore-pail`.
2. Delay the `/api/public/offers?...` request that restores saved selections.
3. Open `/offers/hostinger-kvm-2` and click `Pick for compare` before restoration completes.
4. Release the request.

Observed: the button was **enabled**, but `aria-pressed` stayed `false`; the pail stayed at **1**, not 2. This also fails the existing offer comparison readiness test.

Cause: the receipt reads only `{ ids, toggle }`, renders an enabled button, and `toggle()` returns immediately while `ready` is false. The visible action silently loses the click.

Required repair: disable the offer pick action until ready (and while unavailable), or queue the action explicitly. Preserve saved selections and explain unavailable state. Keep the delayed-response regression and make it pass.

### R2. The browser release gate is still red

**Priority: high; gate blocker.**

Current desktop-light result: **95 passed / 27 failed / 32 skipped** out of 154 discovered tests. Skips include profiles that need other fixture modes; these numbers do not claim the full release matrix ran.

Failure breakdown:
- **19 visual baseline failures:** committed screenshots predate the repaired layout/data behavior. Compare them against the approved Shore reference before updating expected images. A screenshot failure alone does not prove the current UI is wrong.
- **1 real behavior failure:** R1, the dropped offer compare click.
- **1 target-size failure:** R3 below.
- **6 stale/changed UI contracts:** `.cempty`, the old `Only differences` button, `Copy link`, `.grid-c .colhead`, literal font-family spelling, and the voice linter rejecting `Best first`.

Specific examples:
- `tests/e2e/csp.spec.ts:67` expects `.cempty`; current correct empty state is `.state--pail`. Removing the final plan was independently verified to empty the pail and navigate to `/compare?id=`.
- `scripts/check_accessibility_runtime.ts:160` searches for a button named `Only differences`; the mockup uses a checkbox named `Only show what differs`.
- `tests/e2e/public-routes.spec.ts:191` searches `.grid-c .colhead`; current heads live under `.cmp`.
- `tests/e2e/ui-defects.spec.ts:12–15` requires the string `Ubuntu Sans`; Next's generated CSS family is `ubuntuSans`. Do not diagnose this assertion alone as a broken font download. Verify the loaded font and then align the test.
- The `Copy link` control is absent in the approved mockup; retain URL-sharing coverage without reinstating an unapproved toolbar.
- The voice checker rejects the mockup's `Best first`. Document/approve the control-label exception or reconcile the contract without redesigning the page.

Required repair: update stale selectors/contracts and review screenshot diffs; fix real defects first. Do not skip the suite, loosen screenshot tolerance globally or replace expected screenshots blindly. Then run the full coordinator/matrix, not just desktop-light.

### R3. Filter targets fail the project's own 44 px contract

**Priority: medium; acceptance failure.**

- `src/styles/shore-tokens.css:1366`: `.rng` is 28 px high.
- `src/styles/shore-tokens.css:120`: chips have a 38 px minimum height.
- `tests/e2e/a11y-targets.spec.ts:16`: expects at least 44 px.

Measured production `#r-price` box: **266 × 28 px**. The test fails on height before completing its unobscured-target checks.

Required repair: enlarge hit areas while preserving the thin visible track and the approved spacing. Recheck both 1440 and 320 px. This is failure of the project's 44 px target contract; it is not, by itself, proof of failure of WCAG 2.2's smaller minimum target criterion. Sampled axe scans returned no violations.

### R4. Catalog exceeds the strict JavaScript budget

**Priority: high; performance gate blocker.**

Official `scripts/check_phase7_js_budget.ts`, pointed at the isolated production server:

- Measured first-load external JS, gzip level 9, framework included: **128,682 bytes**.
- Required: **less than 120,000 bytes**.
- Script exit status: **1**.

Required repair: remove/defer nonessential client code without changing the approved UI or postponing essential filter hydration. Rerun the strict accounting tool with the representative large-catalog fixture as well. Do not raise the limit to get a green report.

### R5. Data refresh B6 is not complete

**Priority: high for data-readiness; not a database-integrity error.**

Current eligible publication:
- **317 offers, 41 providers**, snapshot version 6, published 7 Oct 2026.
- **314 offer check dates are in August 2026**, three in October.
- **43** offers have reviewed terms; **4** have a computable reviewed 3-year price. Missing totals are marked unknown rather than invented.
- Hostinger KVM 2 remains `$8.99`, checked `2026-08-31`; this review did not independently re-quote today's official checkout price.
- Hetzner remains archived; Vultr and Kamatera remain draft. The requested expansion has not reached the public set.
- Promotion metadata still has old check dates. Zero live deals is the correct guard result, not proof that providers have no offers today.

Required repair: complete B6 using official dated evidence, staged import/review and deliberate publication. Do not update dates without rechecking facts. Refresh priority launches/promotions/reviewed claims first; keep genuinely unverified facts private/unknown. Run public parity again after publication.

`npm run data:check` passes with seven warnings. It checks whether raw CSV research can be staged; it does **not** certify price freshness or production publication readiness.

### R6. Fresh annual promotions lose their billing context

**Priority: high before publishing annual deals.**

Locations:
- `src/lib/public-special-offers.ts:28`: converts each `PublishedSpecialOffer` to its plain `ShoreOffer`, dropping promotion fields.
- `src/components/shore/SpecialOffersClient.tsx:66,183`: special cards show an intro strip only when intro/renewal fields exist, but the page promises every deal shows intro length and later price.

Isolated probe (no live writes): on the copied DB only, refreshed the existing RackNerd annual promotion's `checkedAt`, preserving its $21.99/12-month source amount; restored the original setting afterwards.

Observed card: **$1.83/mo, Renewal not published**. It did **not** show **$21.99 billed annually**. The promoted billing period, source/check context and eligibility metadata do not reach this card model. This is an annual upfront purchase, not necessarily an introductory monthly subscription.

Required repair: retain promotion amount, billing period, check/source and supported expiry/eligibility in a deal read model. Display the annual charge and the monthly equivalent without inventing a renewal. Use the existing card design and a concise receipt line; adjust the intro-only heading when the deal is annual recurring. Test an annual non-intro deal, a true intro deal and an expired deal.

## Operations and Phase D

- Committed admin walkthrough records a real TOTP login plus import, publish, correction acceptance/rejection, rollback, provider edits and settings audit. Reviewed as evidence, not independently re-executed here.
- Backup heartbeat plumbing exists and a backup heartbeat is present in the real DB copy.
- **No restore-drill heartbeat** was present in that copy. Complete and record the restore drill; implementing the display is not the same as demonstrating recovery.
- `docs/qa/v1-release/` did not contain a final completed gate bundle at the reviewed commit.
- This review did not complete the official freshness-runtime drill or the six-project full browser coordinator. No screen-reader sign-off or deployment/HTTPS proof is asserted.
- Deployment remains deferred until the owner approves it.

## Check results

| Check | Result |
|---|---|
| ESLint | Pass |
| TypeScript | Pass |
| Vitest | 105 files, **596 tests passed** |
| Production build | Pass |
| Security-header checks | Pass |
| Content checks | Pass |
| Production-dependency audit | **0 vulnerabilities** reported |
| Raw research CSV | Pass, 7 warnings; does not certify freshness |
| SQLite quick/foreign-key checks | ok / 0 violations |
| Production readiness endpoint | 200, migrations ok |
| Browser probe, 3 widths | No page errors or page-level overflow in tested routes |
| axe, 7 representative routes | 0 tagged WCAG violations |
| Existing desktop-light e2e | **27 failed, 95 passed, 32 skipped** |
| Strict production catalog JS budget | **Fail: 128,682 / <120,000 bytes** |

## Recommended next work

1. Fix R1 (lost compare click).
2. Fix R3 and R4 (touch-target and JS budgets).
3. Fix R6 before refreshing/publishing specials.
4. Complete R5 data work.
5. Reconcile stale tests/baselines in R2, then produce the full Phase D release evidence including recovery.

Evidence is stored beside this report in `v1-review-2026-10-26/`. No percentage-complete estimate is assigned: passing the remaining release gates is the readiness criterion.
