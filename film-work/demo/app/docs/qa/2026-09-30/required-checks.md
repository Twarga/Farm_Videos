# Required checks — 30 September 2026

## Completion-goal required checks

```text
$ npm test
Test Files 53 passed (53)
     Tests 252 passed (252)
  Start at 19:29:10
  Duration 4.51s

$ npx tsc --noEmit
[no stdout; exit 0]

$ npx eslint src scripts tests
[no stdout; exit 0]

$ npm audit --omit=dev --audit-level=high
found 0 vulnerabilities

$ DATABASE_URL=/tmp/bestvpsforme-e2e/current-data.db npm run build
Next 16.3.6; compiled successfully; TypeScript passed; 16/16 static pages generated; exit 0

$ E2E_FIXTURE=1 DATABASE_URL=/tmp/bestvpsforme-e2e/catalog.db PUBLIC_DATA_MODE=published npm run build
Next 16.3.6; compiled successfully; TypeScript passed; 16/16 static pages generated; exit 0

$ E2E_REUSE_BUILD=1 npm run test:e2e
210 standard passed (53.9s)
24 large-catalog passed (13.7s)
6 synthetic admin-action passed (7.2s)
Browser checks passed for standard, large-catalog and synthetic-admin-action profiles.
```

All ten explicit editorial CI commands passed. Actual-copy full-dataset/runtime CLIs passed with unchanged snapshot counts. Raw 457-row CSV: 0 errors / 7 documented warnings. Menu 14, retained checks 76, direct application-source readers 0, approved retirements 77 total. Real production database untouched. Remote Actions unrun; no push.

The HTTP budget check independently reports 258,141 bytes with 50 desktop / 20 initial mobile rows and fails the 150,000-byte target. This failure is why Phase 1 is still open. Latest Hostinger proof: [HTML excerpt](hostinger-goal-pricing-excerpt.txt). Dev server 3002 uses `/tmp/bestvpsforme-e2e/current-data.db`.

## Earlier verified checkpoint

Branch: `codex/resume-overhaul`. Next.js 16.3.6. These are console excerpts from the fresh final run after `npm ci`; silent commands exited 0.

```text
$ npm test
Test Files  37 passed (37)
     Tests  179 passed (179)
  Start at  18:08:49
  Duration  2.18s

$ npx tsc --noEmit
[no stdout; exit 0]

$ npx eslint src scripts tests
[no stdout; exit 0]

$ npm audit --omit=dev --audit-level=high
found 0 vulnerabilities

$ DATABASE_URL=/tmp/bestvpsforme-pricing-ykaym217/catalog.db PUBLIC_DATA_MODE=published npm run build
▲ Next.js 16.3.6 (Turbopack)
✓ Compiled successfully in 1213ms
  Finished TypeScript in 1937ms
✓ Generating static pages using 19 workers (16/16) in 548ms
[exit 0]

$ npm run test:e2e
159 passed (50.0s)
[Next 16.3.6 production build/start on synthetic /tmp backup, no visual updates]
```

Raw CSV: 457 rows, 24 columns, 63 providers; zero errors, seven warnings. The missing-price row remains nonpublishable. Retained ten-command content aggregate, source-baseline check, and data/CI workflow checks exit 0. No full legacy aggregate containing migration/publication was run.

[Browser coverage and limitations](browser-verification.md), [fresh Hostinger excerpt](hostinger-final-excerpt.txt), [pricing/publication proof](../../data/pricing-verification-2026-09-30.md), [43-plan review queue](../../data/price-terms-review-2026-09-30.md).

Dev server: `http://127.0.0.1:3002`, database `/tmp/bestvpsforme-pricing-ykaym217/catalog.db`; Hostinger returns 200. Due today and renewal remain Not published, with Renewal not reviewed visible. The real database is not migrated or published. Remote CI was not run; nothing was pushed.

The catalog raw-HTML target remains open (306,127 bytes vs <150 KB). Lighthouse evidence predates the security patch and includes an incomplete-results warning. D-8 and the narrow shared-row exception remain pending owner decisions.

![Hostinger before term review](hostinger-final-pricing.jpg)

## Final actual-copy build stdout

```text

> bestvpsforme@0.2.0 build
> next build --turbopack

▲ Next.js 16.3.6 (Turbopack)
✓ Running next.config.ts took 38ms

  Creating an optimized production build ...
✓ Compiled successfully in 1392ms
  Running TypeScript ...
  Finished TypeScript in 2.8s ...
  Collecting page data using 19 workers ...
  Generating static pages using 19 workers (0/16) ...
  Generating static pages using 19 workers (4/16)
  Generating static pages using 19 workers (8/16)
  Generating static pages using 19 workers (12/16)
✓ Generating static pages using 19 workers (16/16) in 426ms
  Finalizing page optimization ...

Route (app)                Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ƒ /admin
├ ƒ /admin/imports
├ ƒ /api/analytics/events
├ ƒ /api/corrections
├ ƒ /api/health/live
├ ƒ /api/health/ready
├ ƒ /api/public/offers
├ ƒ /authors/[slug]
├ ƒ /catalog
├ ○ /compare
├ ○ /corrections
├ ○ /feed.xml                      1h      1y
├ ƒ /go/[id]
├ ƒ /guides
├ ƒ /guides/[slug]
├ ○ /icon
├ ○ /methodology
├ ƒ /offers/[id]
├ ○ /privacy
├ ƒ /providers/[slug]
├ ○ /robots.txt
├ ○ /sitemap.xml                   1h      1y
├ ○ /terms
└ ○ /updates


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

```
