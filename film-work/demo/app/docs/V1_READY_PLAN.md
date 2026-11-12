# bestvpsforme V1 — plan to reach "ready" (no deployment)

Written 31 Oct 2026. Hand this file to the next AI as its instructions.
Deployment, servers, DNS, HTTPS and production config are **out of scope**. Do not deploy.

Repo: `bestvpsforme/bestvpsforme/`. Read first: `AGENTS.md`, `DESIGN.md`, `docs/V1_FINISH_PLAN.md`, `docs/research/PROVIDER_EXPANSION_FOLLOWUP.md`.

---

## 0. Where it stands (verified 31 Oct 2026)

| Area | State |
|---|---|
| Lint, typecheck, unit tests | Pass (629 / 629) |
| Production build | Pass |
| Full browser suite (`npm run test:e2e`, 6 projects + isolated fixtures) | Pass, catalog JS 119,990 B (< 120,000) |
| Public pages vs mockup | Home, catalog, offer, compare, providers, guides match; home motion ported |
| Admin | Route-based, paginated, usable; no page renders >1 edit form |
| Restore drill heartbeat | Recorded 27 Oct |
| **Uncommitted work** | ~78 files (review fixes, motion, baselines) |
| **Data freshness** | 650 of 658 published price rows checked **2026-08-31** (2 months old) |
| **Provider coverage** | Hetzner archived; Vultr, Kamatera draft; HostHatch absent; several big names absent |
| **Special offers** | 0 live deals (all old, correctly hidden) |
| Screen-reader pass, legal sign-off | Not done (needs a human / the owner) |

**Verdict: code is release-candidate quality. The site is NOT ready, because the data is stale and coverage is thin.**

---

## Rules (apply to every step)

1. Work step by step. Do not start the next step until this one's checks pass.
2. Fix problems yourself. Stop only for: a destructive action, deployment, or a price you cannot verify on an official page.
3. **Never invent data.** Every price/spec row needs an official source URL and a check date. Unknown stays "Not published". Never bypass a 403/captcha; list that provider for the owner instead.
4. All data goes through the **staged admin import** (Admin → Import → review → approve terms → publish). Never write to `data/bestvpsforme.db` directly with SQL.
5. Browser checks use disposable `/tmp` databases only.
6. Never weaken tests, loosen screenshot tolerance or raise budgets.
7. Commit each step separately (conventional commits). Stage files by path. Never use `git stash`, `add -A`, `commit -a`, `reset --hard`.
8. No "passing" claim without command output from this session.
9. Run the full gate after each step: `npm run lint && npm run typecheck && npm test && npm run build`, then `E2E_PORT=<free> npm run test:e2e`.

---

## Step 1 — Commit the open work

- Review `git status`; group into commits: review fixes (DocToc, CompareProvider clear race, admin table overflow, X-ray form), home motion (`HomeMotion.tsx`, `ShoreHero.tsx`, `page.tsx`), lazy tips (`tips.ts`, `SiteFrame.tsx`, removed `TipLayer.tsx`), test updates + screenshot baselines, docs (`DESIGN.md`, this file).
- Do not commit `.empryo/`, `test-results/`, `playwright-report/`.
- Done when: `git status` shows only ignored/untracked tool folders; full gate green.

## Step 2 — Provider coverage (the main gap)

Target: every major VPS provider a buyer would expect is either **published with dated evidence** or **explicitly listed as blocked with the reason**.

### 2a. Restore / finish existing providers
| Provider | Current | Needed |
|---|---|---|
| **Hetzner** | archived, 0 plans | Cloud CX/CPX/CAX (shared + Arm + dedicated CCX). EUR prices incl./excl. VAT, IPv4 now billed separately, hourly cap = monthly. Fill Trustpilot score/count/URL/date. Un-archive via admin. |
| **Vultr** | draft, 0 plans | Official pricing page returned 403 before. Retry once normally; if still blocked, list for owner (do not scrape around it). Need Trustpilot. |
| **Kamatera** | draft, 0 plans | Configurable pricing: publish only fixed published presets with exact config. Need Trustpilot. |
| **AWS Lightsail (aws-lightsail-aws)** | draft duplicate | Merge into `aws-lightsail` or delete the duplicate via admin (owner confirm). |
| **CloudCone, Cockbox, YourServer** | active, no Trustpilot → hidden | Add dated Trustpilot data, or record "no rating" decision. |
| **netcup** | 6 plans | Add VPS G12.5 range + Root Server (dedicated vCPU KVM). Verify EUR price shown at checkout (multiple prices on page), 12-month term, VAT. |
| **OVHcloud, Hostinger, IONOS** | 4 plans each | Add the full current VPS range (OVH VPS-1…6; Hostinger KVM 1/2/4/8; IONOS VPS XS…XXL). Hostinger renewal + 24-month intro must be reviewed terms. |
| **Webdock** | 3 plans | Full plan table. |

### 2b. Add missing providers (new rows)
Priority order (add as many as can be verified):
1. **HostHatch** (NVMe + storage; regional prices).
2. **Hostinger-class budget**: **VirMach**, **Hosteons**, **Servarica**, **Letbox**.
3. **Big brands buyers search for**: **Cloudways**, **A2 Hosting**, **InMotion**, **Bluehost VPS**, **HostGator VPS**, **Strato** (DE), **Fasthosts** (UK), **UltaHost**.
4. Optional EU: **Hetzner** (2a), **Evolution Host**, **PQ Hosting**.

For each new provider: create via Admin → Providers (identity, HQ, official URL, logo SVG/PNG through the sanitized upload), Trustpilot evidence, then import plans.

### 2c. How to research each plan
- Official pricing page **and** checkout for: exact plan name, vCPU (shared/dedicated), RAM, disk + type, transfer, locations, native currency price, billing term, intro length, renewal price, setup fee, IPv4 included/extra, VAT basis.
- Record in `data/research/provider-candidates-YYYY-MM-DD.csv` (same columns as `provider-candidates-2026-10-24.csv`) with `official_url` and `checked_date`.
- Save evidence excerpts in `docs/research/evidence/`.
- Anything ambiguous (VAT unclear, renewal not shown, captcha) → leave blank and add to `docs/research/OWNER_CHECKLIST.md`.

### 2d. Import
- `npm run data:check` on the CSV (must pass; warnings explained).
- Admin → Import (staged) → resolve every blocking issue → approve price terms → publish one snapshot.
- Done when: `npx tsx scripts/check_public_parity.ts` passes on the new snapshot; home/catalog/sitemap provider counts agree.

## Step 3 — Refresh all existing prices

- Every published offer with `source_checked_at` older than 45 days gets re-checked on the official page (same method as 2c). Change = new staged row; unchanged = refresh date **only after actually checking**.
- Priority: providers in the home board top 5, then by plan count (DigitalOcean 31, Linode 23, Scaleway 22, AWS Lightsail 25, …).
- Review billing terms for every plan with an intro price so the "3-year real price" can be computed (currently only ~63 reviewed).
- Done when: no published price is older than 45 days, or each stale one is listed in `OWNER_CHECKLIST.md` with the reason; new snapshot published; parity passes.

## Step 4 — Special offers

- Re-check RackNerd annual specials, netcup deals, GreenCloud sales, and current Black Friday pages (late Nov) on official pages.
- Publish only promotions with a confirmed billing amount, term, renewal/recurring rule and check date (`src/lib/public-special-offers.ts` rules). No countdowns or invented discounts.
- Done when: `/special-offers` shows real dated deals or an honest empty state; `npm run check:special-offers` passes.

## Step 5 — Admin page-size budget (measured)

- Build a real-size disposable DB and admin session per `docs/V1_FINISH_PLAN.md` §7.1.
- Run `scripts/audit/route-dom-audit.mjs` against every admin route at 1440 and 390.
- Meet §3.1 budgets; no horizontal overflow at 390 (fixed for tables on 31 Oct; verify all routes, incl. `/admin/offers/[id]`, `/admin/imports`).
- Paste the table into `docs/design/v1-shore/IMPLEMENTATION_STATUS.md`.

## Step 6 — Final visual pass vs mockup

- `node scripts/audit/review-pairs.mjs` (needs the mockup served on :8794 and the app on :3271) → compare every route at 1440/390, day/night.
- Remaining known gaps to check: special offers (mockup shows 15 deals; ours depends on Step 4), guide article pages, provider page, 404.
- Record any decision in `DESIGN.md` under the right module.

## Step 7 — Final gate

- `npm run release:check` green.
- `npm run check:phase7:recovery`, `npm run check:security`, `npm audit --omit=dev --audit-level=high`.
- Save logs to `docs/qa/v1-release/`.
- Update `docs/design/v1-shore/IMPLEMENTATION_STATUS.md` with measured numbers.

---

## Needs the owner (cannot be done by an AI)

1. Prices the AI could not verify (`docs/research/OWNER_CHECKLIST.md`), e.g. Vultr if still 403.
2. Sign-off on Privacy, Terms, Affiliate disclosure copy.
3. One real screen-reader journey (NVDA or VoiceOver), recorded in `docs/qa/`.
4. Approve deleting the duplicate `aws-lightsail-aws` provider.

## Final report expected from the AI

- One table: step, status, command, result.
- Provider table: provider, plans published, oldest check date, blocked reason (if any).
- The owner checklist.
