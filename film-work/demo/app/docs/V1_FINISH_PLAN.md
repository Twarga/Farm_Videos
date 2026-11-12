# bestvpsforme V1 — finish plan (admin rebuild, front-end parity, release readiness)

**For:** the next engineer/AI. **Written:** 27 Oct 2026. **Owner:** Twarga.
**Supersedes nothing.** `docs/V1_IMPLEMENTATION_PLAN.md` still defines scope, integrity rules and owner defaults (D-1…D-5). This file is the concrete work list to close V1.
**Do not deploy.** Deployment, production config, DNS and owner sign-off stay out of scope until the owner says so.

---

## 0. Ground rules (read before touching code)

1. Repo root: `bestvpsforme/bestvpsforme/`. Run every command from there. There is no git repo at the workspace root.
2. Read in this order: this file → `docs/V1_IMPLEMENTATION_PLAN.md` §0, §3, §5, §7 → `DESIGN.md` (decision log, binding) → `brand/shore/mockup/README.md` → `brand/shore/admin-preview/README.md`.
3. Public visual source of truth: `brand/shore/mockup/` (`index.html`, `shore.css`, `shore.js`). Do not redesign it. Port it.
4. Admin visual direction: `brand/shore/admin-preview/` (a static proposal built on the same Shore tokens). Use its look (night default, Shore tokens/pills/buttons, **no characters, no motion**). It is not wired to data; the behaviour spec below is.
5. Never edit `src/styles/shore-tokens.css` or `src/styles/shore-patchwork.css`. A unit test (`src/styles/css-system.test.ts`) requires them to equal the mockup byte-for-byte except font URLs. Put overrides in `src/styles/shore-shell.css` and record them in `DESIGN.md`.
6. Integrity rules from Scope §6 are absolute: unknown stays "Not published", no invented totals/renewals, commission never changes order, every public number has a source and date. Admin redesign must not loosen any server-side validation, CSRF, session re-check, revision check or audit write.
7. Every phase ends green on: `npm run lint && npm run typecheck && npm test && npm run build`, plus the phase's own checks listed below.
8. Shared working tree: other agents may edit concurrently. Never run `git stash`, `git checkout -- .`, `git reset --hard`, `git clean`, `git add -A`. Do not commit unless the owner asks.
9. Disposable data only. All browser checks use `/tmp/...` databases. Never write to a production database or backup.
10. The machine hits the OS file-watch limit with `next dev`. Use `npm run build` + `npx next start` for local checks.

---

## 1. Where V1 stands (27 Oct 2026)

| Plan phase | State | Evidence / gap |
|---|---|---|
| 0 Setup, baselines | Done | `docs/design/v1-shore/baseline/` (144 mockup captures) |
| 1 Shore foundations (tokens, header/footer, theme, logo set) | Done | `docs/design/v1-shore/IMPLEMENTATION_STATUS.md` |
| 2 Public read model | Done | `src/lib/shore-offer.ts`, `check_public_parity` |
| 3 Public pages | Routes work; **visual/motion parity not done** | §5 of this file |
| 4 Admin | Screens exist; **UX is unusable at real data size** | §2–§4 of this file |
| 5 Data refresh | **Not started** | §6.1 |
| 6 Quality gates | Partly (axe, keyboard, security, content pass) | §6.3–§6.6 |
| 7 Deploy | Deferred by owner | — |

Unit tests: 96 files / 562 tests pass (25 Oct). Lint, typecheck and build pass.

---

## 2. Admin: measured baseline (why it feels broken)

Measured 27 Oct with a real-size disposable database: the full research CSV (`data/vps-offers-2026-08-31.csv`, 457 rows) pushed through the normal staged import → **216 published offers, 29 providers, 30 affiliate programs**. Production build, Chromium, night theme. Reproduce with §7.1.

| Route | DOM elements | Forms | Inputs | HTML | Page height @1440 | Page height @390 |
|---|---|---|---|---|---|---|
| `/admin` (overview) | 785 | 0 | 1 | **487 KB** | 1,361 px | 2,600 px |
| `/admin?view=offers` | **5,795** | 0 | 2 | **769 KB** | — (217 rows) | — |
| `/admin?view=providers` | 1,123 | 0 | 1 | 512 KB | 2,472 | 2,855 |
| `/admin?view=quality` | 4,494 | 0 | 1 (451 buttons) | 740 KB | **30,864** | **32,886** |
| `/admin?view=analytics` | 1,441 | 0 | 1 | 503 KB | 5,284 | 7,521 |
| `/admin?view=activity` | 597 (**11 visible**) | 0 | 1 | **476 KB** | 900 | 900 |
| `/admin/editorial` | **11,497** | **100** | **2,400** | **831 KB** | **116,819** | **202,068** |
| `/admin/terms` | 2,445 | 31 | 527 | 341 KB | **29,671** | **53,120** |
| `/admin/providers` | 2,321 | 41 | 451 | 331 KB | 4,300 | 16,150 |
| `/admin/affiliates` | 2,310 | 30 | 420 | 355 KB | 3,598 | 14,168 |
| `/admin/settings` | 613 | 2 | 4 | **465 KB** | 900 | 1,074 |
| `/admin/imports`, `/corrections`, `/publications`, `/audit`, `/health` | 585–633 | 0–3 | 0–7 | 104–111 KB | 900 | 900–1,271 |

For comparison the public catalog page is 2,940 elements / 162 KB.

### 2.1 Root causes (verified in code)

1. **One giant client component.** `src/components/admin/AdminConsole.tsx` (601 lines, 65 KB, `"use client"`) renders Overview, Offers, Providers, Data quality, Analytics and Activity as client-side "views". `src/app/admin/page.tsx:28-30` passes the **entire public catalog** (`initialCatalog`), all offer revisions and analytics as props, so every `/admin?view=…` page ships 476–769 KB of serialized data even when it shows 11 elements.
2. **Everything is rendered at once, nothing is paginated.**
   - Editorial (`src/app/admin/editorial/page.tsx` + `src/components/admin/EditorialEntry.tsx`) renders 100 full edit forms (24 inputs each) on one page.
   - Price terms (`src/app/admin/terms/page.tsx`, `PriceTermsReview`, `CurrentPriceTermsReview`, `PriceTermsFields`) renders 31 open forms.
   - Providers and Affiliates (`src/app/admin/providers/page.tsx`, `src/app/admin/affiliates/page.tsx`) render one hidden `<details><form>` per record under the table (41 and 30 forms).
   - Offers view renders all 217 rows; Quality view renders all 433 issues with a button each.
3. **Two parallel navigation models.** `src/components/admin/AdminSidebar.tsx:31-56` mixes console views (`/admin?view=offers`, swapped client-side) with real routes (`/admin/editorial`). Back/forward, reloads and focus behave differently per item.
4. **Two different "Providers" screens with different data.** `/admin?view=providers` reads the static list `@/lib/providers` (imported in `AdminConsole.tsx`); `/admin/providers` reads the database. They disagree.
5. **Data quality is computed in the browser and is misleading.** `AdminConsole.tsx:165-172` builds issues client-side from the public catalog and the static provider list. "Renewal price is missing" is marked high/"Blocking" for every published plan (216 "blocking"), although publication policy already allows unknown renewals (they publish as "Not published"). Staleness uses a hard 14-day rule; the plan says 45 days (V1 plan §9 P5-1). The real issue table (`verification_issues`) is ignored.
6. **Overview metrics are not trustworthy.** "Affiliate coverage 0%" and "Data ready 0%" while 30 affiliate programs exist; "Median monthly $34.00 / mean $226.41" is dominated by dedicated/cloud outliers. Every number must state its source and denominator.
7. **Layout defects.** At 1440×900 the last sidebar item ("Settings") is hidden behind the "Private workspace" card (sidebar does not scroll its nav independently). Provider table is sorted Z→A (`providers/page.tsx:8`, `desc(providers.name)`). Long evidence text overflows narrow cells on Price terms.
8. **Seven competing admin stylesheets.** `AdminConsole.module.css` (1,420 lines), `src/styles/admin.css`, `AdminEditorial.module.css`, `AdminImports.module.css`, `AdminDataTable.module.css`, `AdminLogin.module.css`, `app/admin/affiliates/page.module.css`, `app/admin/corrections/page.module.css`. Sizes, spacing and controls differ between screens; little of it uses Shore classes (`.btn`, `.pill`, `.seg`, `.chip`, `.ledger`, `.dd`).
9. **Missing V1 admin features** (V1 plan §7.1): provider logo upload, backup/restore heartbeat, outbound link checks, publication diff summary, audit filters (actor/action/date), typed "rollback" confirmation everywhere.

---

## 3. Admin target design (the spec to build)

### 3.1 Principles
- **One screen = one route = one job.** No `?view=` console. Server Components fetch only what the screen shows.
- **List → detail.** Lists are compact tables. Editing happens on a detail page (`/admin/<area>/<id>`) or a single drawer — never N forms on one page.
- **Budgets (hard, tested):** ≤ 1,500 DOM elements per admin route at 1440 px; ≤ 150 KB HTML; ≤ 1 editable form rendered per page (except Settings); list pages paginate at 50 rows with server-side search/filter/sort in the URL; page height of a list ≤ 6,000 px at 1440.
- **Night theme default** (DESIGN.md Admin entry). Shore tokens and controls. No characters, no motion, no decorative gradients.
- **Every number names its source and denominator.** Unknown/unmeasured = "Not connected" or "Not measured", never 0.
- **Every mutation:** server action → `requireAdmin()` → CSRF/origin check as today → zod validation → revision check → one transaction including `audit_log` (actor, action, entity, before/after JSON) → `revalidateTag/Path`. Keep the existing actions; only their UI changes.

### 3.2 Information architecture (final sidebar)

```
Overview            /admin
— Catalog —
Offers              /admin/offers            detail /admin/offers/[id]
Providers           /admin/providers         detail /admin/providers/[id]
Affiliates          /admin/affiliates        detail /admin/affiliates/[id]
— Review queues —
Price terms         /admin/terms             detail /admin/terms/[offerId]
Editorial           /admin/editorial         detail /admin/editorial/[offerId]
Corrections         /admin/corrections       detail /admin/corrections/[id]
Data quality        /admin/quality
— Publish —
Import              /admin/imports           detail /admin/imports/[jobId]
Publications        /admin/publications
— System —
Analytics           /admin/analytics
Health              /admin/health
Audit log           /admin/audit
Settings            /admin/settings
```
- Remove the "Activity" item (fold into Audit log).
- Each queue item shows a count badge (open items) computed server-side in `AdminSidebar` data loader (one cheap `count(*)` per queue).
- Redirects: `/admin?view=offers` → `/admin/offers`, `?view=providers` → `/admin/providers`, `?view=quality` → `/admin/quality`, `?view=analytics` → `/admin/analytics`, `?view=activity` → `/admin/audit`. Keep `/admin` (unauthenticated) as the login page.

### 3.3 Shell layout
- `AdminShell`: fixed 232 px sidebar (≥ 1024 px), collapsible drawer below 1024 px (existing "Open navigation" button; keep focus trap + Escape + focus return). Sidebar: logo, nav (scrolls independently, `overflow-y: auto; min-height: 0`), footer card (session, theme toggle, sign out) pinned at bottom without covering nav.
- Topbar: breadcrumb (`Control room / Offers / KVM 1`), page-level primary action on the right, "View site" link.
- Content width max 1280 px, 24 px gutters, 8 px spacing scale.
- Page head: eyebrow (≤ 3 words), `h1`, one-sentence description, optional actions. No paragraph longer than 2 lines.

### 3.4 Shared components (build once in `src/components/admin/ui/`)
| Component | Purpose | Notes |
|---|---|---|
| `AdminPage` | page head + content slots | replaces ad-hoc `page_head` markup |
| `DataTable` | server-rendered table, sticky header, row link, empty state | extend existing `AdminDataTable`; column `align`, `mono`, `width`; whole row clickable via one link, not N buttons |
| `TableToolbar` | search box (GET form), filter `seg`/chips, sort select, result count | all state in URL query |
| `Pagination` | `?page=` with 50 per page, prev/next + "1–50 of 216" | server-side `limit/offset` |
| `StatusPill` | draft / active / paused / archived / open / accepted / rejected / blocking / review / published | one colour map, AA contrast in day and night |
| `Metric` | label, value, source/denominator note, optional link | "Not measured" variant |
| `FormSection`, `Field`, `FieldRow` | consistent labels, hints, errors (`aria-describedby`, `aria-invalid`) | 44 px inputs, error summary at top on submit failure |
| `EvidencePanel` | read-only evidence facts (source URL, checked date, notes) | collapses long text after 4 lines with "Show all" |
| `ConfirmAction` | typed confirmation ("publish", "rollback", "reject") | wraps existing typed-confirm patterns |
| `Toast/Feedback` | result banner after redirect (`?status=…&requestId=…`) | reuse `admin-action-feedback.ts` |
| `EmptyState` | text + next action | no art |

Styles: one stylesheet `src/components/admin/admin.module.css` (or `src/styles/admin-shore.css`) built on Shore variables. Delete the other admin stylesheets as each screen migrates. Target ≤ 600 lines total admin CSS.

### 3.5 Screen specs

**Overview `/admin`** (Server Component)
- Row 1 metrics (each links to its screen): Published plans (snapshot count + snapshot date), Providers published, Open price-term reviews, Open editorial drafts, Open corrections, Blocking import issues.
- Row 2 "Needs you now": top 5 items across queues, oldest first (title, age, link).
- Row 3 System: last publication (date, author, counts), last backup + restore drill (or "Not connected"), `/api/health/ready` status, outbound link failures (or "Not measured").
- Analytics summary: 30-day visitors, outbound clicks (or "No events yet"). No commission/conversion numbers unless imported reports exist.
- Budget: ≤ 600 elements. No catalog payload.

**Offers `/admin/offers`**
- Table columns: Plan (name + provider, logo 24 px), Specs (`2 vCPU · 4 GB · 80 GB`), Price (native + USD), Terms (Reviewed / Open / Not reviewed pill), Checked (date + age, amber > 45 days), Status (published/draft/hidden), Affiliate (Ad/Direct).
- Toolbar: search (provider, plan, SKU), filters: provider, status, terms state, stale only; sort: provider, price, checked.
- Row → `/admin/offers/[id]`.
- **Detail `/admin/offers/[id]`**: header (plan, provider, status, public link, `/go` link); tabs or sections: Facts (current edit form from `saveOfferFromAdmin`, unchanged validation), Price terms (link/summary of review state), Editorial (summary), Evidence & history (offer_prices rows, audit entries for this offer). "New offer" opens `/admin/offers/new` with the same form.
- Delete the client-side offer drawer in `AdminConsole.tsx` after the route works.

**Providers `/admin/providers`** (DB only; delete the static-list view)
- Table: Provider (logo), Slug, Status pill, HQ, Plans (published count), Trustpilot (score · count · checked date or "Not published"), Affiliate program state. Sort A→Z.
- **Detail `/admin/providers/[id]`**: identity form (existing `saveProviderProfile`), **logo upload** (§4 A9), rating evidence fields, list of this provider's offers (link), affiliate program summary link. One form.

**Affiliates `/admin/affiliates`**: table (provider, program, network, status, link template present y/n, last checked). Detail page with the existing `saveAffiliateProgram` form. Banner: "Affiliate status never changes ranking" (OPS-04).

**Price terms `/admin/terms`**
- Queue table: Plan, Provider, Why queued (long term / intro price / missing setup / renewal), Age (days since checked), Hold reason, State. Filters: state (open/quarantined/reviewed), reason. Sort oldest first.
- **Detail `/admin/terms/[offerId]`**: left `EvidencePanel` (source URL, currency, checked date, FX, billing notes), right form (existing `PriceTermsFields` + approval checkbox), previous reviewed terms read-only, "Approve" and "Hold with reason". After save: redirect to next item in queue (`?next=` keeps filters).
- The 16-row owner-gated correction worklist (`app/admin/terms/correction-queue.json`) becomes a filter ("Owner-gated") on this queue; drop the giant collapsible block.

**Editorial `/admin/editorial`**
- Queue table: Plan, Provider, State (Empty / Draft / Reviewed / Rejected), Outbound clicks (30 d), Priority rank. Same ordering rule as today (unwritten first, one per provider, then rank). 50 per page.
- **Detail `/admin/editorial/[offerId]`**: evidence panel + form (catch, catch evidence, why it fits, backups, managed…), existing banned-word and evidence validation, "Save draft", "Approve", "Next in queue".

**Corrections `/admin/corrections`**: keep current tabs (Open/Accepted/Rejected) as `seg` with counts; table rows (plan, field, claimed value, source domain, age); detail page with accept (must link an approved staged row — keep rule) / reject with note.

**Data quality `/admin/quality`** (server-side)
- Source: `verification_issues` + server checks. Severities: **Blocking** = prevents the next publish (unresolved `verification_issues` with `severity = 'error'` on a staged, unpublished import job — reuse the rule in `src/app/admin/imports/actions.ts`); **Review** = published but needs attention (stale > 45 days, low confidence, missing Trustpilot for a published provider, renewal unknown). Unknown renewal is **not** blocking.
- Group by rule with counts (e.g. "Stale price check · 216 plans") and expand to a paginated table. Fix the 433-row flat list.

**Import `/admin/imports`**: list of jobs (date, file, checksum short, rows, blocked, status). Detail `/admin/imports/[jobId]`: summary counts (new/changed/removed/rejected), issues table paginated, typed "publish" confirm. Keep existing actions.

**Publications `/admin/publications`**: table (version, date, author, offers, providers, diff vs previous: +added/−removed/~changed). Row action: "Roll back to this" with typed "rollback". Mark current.

**Analytics `/admin/analytics`**: move out of the console; server-rendered; 30-day funnel, top outbound offers, guide actions. Show "No events yet" clearly.

**Health `/admin/health`**: existing checks + DB size, WAL size, last backup + last restore drill (§A10), snapshot freshness, outbound link failures (§A11). Each row: status pill, evidence, checked at.

**Audit log `/admin/audit`**: filters actor, action, entity, date range (GET form); 50 per page; row expands before/after JSON diff (pretty, collapsible). Merge "Activity".

**Settings `/admin/settings`**: catalog search toggle (D-1), home X-ray (offer picker must be a searchable select or offer-id input, **not** the full catalog in props — that is why Settings ships 465 KB), maintenance banner. Each save audited (exists).

---

## 4. Admin work packages (do in this order)

Each package: **Do → Files → Done when**.

**A1 — Admin shell, tokens, shared UI**
- Do: create `src/components/admin/ui/*` (§3.4) and one admin stylesheet on Shore variables. Rewrite `AdminShell` + `AdminSidebar` to the §3.2 IA (links only; remove `onNavigate`/view swapping), fix sidebar scroll/footer overlap, add queue count badges from a server loader.
- Files: `src/components/admin/AdminShell.tsx`, `AdminSidebar.tsx`, new `ui/`, new stylesheet, `src/db/admin-*.ts` for counts.
- Done when: every existing admin route renders inside the new shell; "Settings" visible at 1440×900 and 1280×720; axe clean night/day; keyboard: Tab order sidebar → topbar → main; drawer Escape returns focus.

**A2 — Route-based Overview, Offers, Analytics, Quality; retire `AdminConsole`**
- Do: new Server Component pages `/admin` (overview), `/admin/offers`, `/admin/offers/[id]`, `/admin/offers/new`, `/admin/analytics`, `/admin/quality`. Move the offer edit form into a small client component used only on the detail page. Add redirects for old `?view=` URLs. Delete `AdminConsole.tsx`, `AdminConsole.module.css`, `AdminMetricInventory.tsx` when nothing imports them.
- Data: write `src/db/admin-offers.ts` (paged query with filters), `src/db/admin-quality.ts` (server issue builder per §3.5), `src/db/admin-overview.ts`.
- Done when: `/admin` ≤ 600 elements and ≤ 120 KB HTML; `/admin/offers` ≤ 1,500 elements with 216 offers; offer save still passes `src/app/admin/actions.test.ts` and `tests/e2e/admin-actions.spec.ts` (update selectors); quality "Blocking" count equals blocking import issues (0 on the measured DB), not 216.

**A3 — Providers (DB only) + detail + sort fix**
- Done when: one Providers screen; A→Z; detail form saves with audit (existing `providers/actions.test.ts` stays green); `/admin/providers` ≤ 1,200 elements.

**A4 — Affiliates list + detail** (same pattern). Keep `affiliates/actions.test.ts` green.

**A5 — Price terms queue + detail + "next item"**
- Done when: queue page has 0 forms; detail page has exactly 1 form; approving redirects to the next queued item; `tests/e2e/admin-terms.spec.ts` updated and green; `src/lib/current-price-terms.test.ts` untouched and green.

**A6 — Editorial queue + detail + "next item"**
- Done when: queue ≤ 1,500 elements, 0 forms; detail 1 form; banned-word and evidence rules still enforced (`tests/e2e/admin-editorial.spec.ts` updated, green); mobile page height of the queue ≤ 8,000 px.

**A7 — Corrections, Publications, Imports, Audit, Health, Settings restyle**
- Corrections/Publications/Imports/Audit/Health already have reasonable size; restyle to shared UI, add audit filters + pagination, publication diff counts, import job detail route, Settings offer picker without full catalog.
- Done when: Settings ≤ 120 KB HTML; audit filter by actor/action/date works via URL.

**A8 — Day theme + responsive pass**: every admin route at 390/768/1440 in night and day; no horizontal page overflow (tables scroll inside their own container); 44 px targets on touch widths.

**A9 — Provider logo upload** (V1 plan §7.1)
- Do: on provider detail, `<input type="file" accept="image/svg+xml,image/png">`, server action validates: ≤ 100 KB, PNG dimensions square (1:1, ≥ 64 px), SVG sanitized (reject `<script>`, `on*=` attributes, external `href`, `foreignObject`; or rasterize). Store under a configured upload dir (`UPLOAD_DIR`, default `data/uploads/logos/<slug>.<ext>`), write `providers.logo_path`, audit before/after. Serve via a route with `Content-Type` fixed and `Content-Security-Policy: default-src 'none'` for SVG. Public `ProviderMark` prefers `logoPath` then `src/lib/assets.ts` map.
- Done when: unit tests for size/ratio/SVG sanitization rejections; e2e uploads a fixture PNG and sees it on `/providers/<slug>`.

**A10 — Backup heartbeat**: `scripts/backup_sqlite.ts` and `scripts/check_backup_restore.ts` write a row to a new `ops_events` table (or `site_settings` key) `{kind: backup|restore_drill, at, ok, bytes, sha256}`; Health and Overview read it. Migration + test. Never store the backup key.

**A11 — Outbound link checks**: script `scripts/check_outbound_links.ts` HEAD/GET each published offer URL with timeout, polite rate (1 req/s per host), records status in `ops_events` or `outbound_checks`; Health lists failures. Manual/cron only, not on page load.

**A12 — Admin budget test**: `tests/e2e/admin-budgets.spec.ts` seeds the large fixture (or imports the full CSV into a `/tmp` DB like §7.1) and asserts the §3.1 budgets per route. Add to `scripts/run_browser_checks.ts` profile list.

---

## 5. Public front-end: mockup parity work (motion + polish)

The app uses the mockup CSS but not most of the mockup **behaviour** in `brand/shore/mockup/shore.js`. Port behaviour into React without changing classes. All motion must respect `prefers-reduced-motion` (instant final state) and the existing sleeper/`tab-hidden` pausing.

| # | Gap | Mockup source | App file(s) | Do |
|---|---|---|---|---|
| F1 | Cost chart bars never animate | `sleepers()` adds `cs-draw` | `src/components/shell/SiteFrame.tsx:16-18` | In the IntersectionObserver callback: if intersecting and element matches `[data-draw]` and not reduced motion → add `cs-draw`, remove `data-draw`. Threshold 0.15. |
| F2 | Hero finder has no story | `heroWire()`, `run()`, `place()`, `crown()`, `reasonFor()` | `src/components/shore/ShoreHero.tsx` | On change: bubble "N plans fit.", crab pose `working` (set `data-state` on the `.pet` svg), shells that fail get `.out` + `.why` text ("Too small", "Too pricey", "Wrong region"), then `.leave`; new picks get `.enter` (shell-in); after placement `.win` on the first (ribbon), VM `.happy`; nothing fits → crab `error`, VM `.shiver`, show `finder__relax` chips ("Drop the budget"…) that loosen one need. Count `<b>` gets `.pop`. Fix copy bug "plans fits" → "plans fit". |
| F3 | No pick feedback | `togglePail()`, `fly()`, `bobPail()`, `toast()` | `PailButton.tsx`, `OfferLedger.tsx`, `OfferCard.tsx`, `CompareProvider.tsx` | On add: clone the row's shell/logo, animate to `#pailBtn` (fixed-position element, 450 ms, then remove), pail `.bob`, count `.pop`, toast "Added to your pail · 2 of 4" (`role="status"`, 2.5 s). On full: toast with reason (already a notice; restyle to `.toast`). |
| F4 | Chart tooltips missing | `.tip` + `pointerover` on `[data-tip]` | new `src/components/shore/TipLayer.tsx` mounted in `SiteFrame` | One `div.tip[aria-hidden]` following the pointer; text from `data-tip`. Keyboard users already get the month table. |
| F5 | True-cost tag doesn't "unpick" | `trueCost()` adds `unpick` | `CostShell.tsx` `TrueMonthlyCost` | On first open add `.unpick` to `.tc` for 620 ms. |
| F6 | Evidence threads | `drawThread()` | `ShoreOfferPage.tsx` | Verify threads draw between receipt lines and evidence notes on hover/focus with `.draw`; compare with mockup `#offer/…`. |
| F7 | Compare sewing | `renderCompare()`, `sew()` | `src/components/shore/ShoreCompare.tsx` (new, unverified) | Verify against `compare-selected-*` baselines: thread path between column shells, `.sewing` animation, `.lit` rows that differ, "Only show what differs" checkbox, "Lowest/Highest" chips only for a single clear winner, cost strip row. Remove the legacy `src/styles/compare.css` rules if no longer used. |
| F8 | Footer bear walk / 404 fishing | `.walk__bear`, `fish` | `SiteFooter.tsx`, `not-found.tsx` | Confirm the walking bear strip exists where the mockup has it (`walk-x`, `walk-bob`); if missing, port markup. |
| F9 | Custom dropdowns everywhere | `enhanceSelects()` | `src/components/shore/controls.tsx` `Dropdown` | Every public `select.select` uses `Dropdown` (sort, per-page, special-offers filters, correction form plan). Keep native select fallback without JS. |
| F10 | Legacy Highlighter CSS bleeding into Shore pages | — | `src/styles/system.css`, `home.css`, `catalog.css`, `offer.css`, `compare.css`, `content.css` | For each Shore page, list legacy selectors that match its DOM (DevTools "matched rules" or a script) and either scope them under the legacy class (`.hx`, `.catalog-results`…) or delete if unused. Record each override in `DESIGN.md`. |
| F11 | CSP console error on offer page | — | offer page, `/go` links | Production console shows `connect-src` violation fetching `https://www.hostinger.com/vps-hosting`. Find the fetch/prefetch of the external URL (likely a `next/link` to an external/redirect URL or a client fetch) and remove it; `/go/[id]` links must be plain `<a>` with `rel="sponsored nofollow noopener"` where affiliate. |
| F12 | Page enter + theme lantern | `.page` `page-in`, view transition | all public pages | Confirm every public route's main wrapper has `class="page wrap…"` (page-in) and the lantern transition fires; reduced motion skips. |

**Visual acceptance for F-packages:** run `scripts/visual/capture-shore.ts` (mockup) and the same routes on the app at 390/768/1440 × day/night; compare with the project's 0.2 threshold / 1 % pixel allowance (see `scripts/visual/check-shore-shell.ts`). Data differences (counts, plan names) are expected; layout, spacing, type, colours, art and states must match. Then refresh `tests/e2e/__screenshots__/` only after a human-reviewed side-by-side.

**Motion acceptance:** a Playwright spec per wow-moment asserting the class sequence (e.g. finder change → `.pshell.out` then `.pshell.enter` then `.pshell.win`), and the same spec with `reducedMotion: "reduce"` asserting final state without intermediate classes.

---

## 6. Remaining V1 scope (non-UI)

**6.1 Data refresh (Phase 5)**
- Re-check prices older than 45 days (all current rows are dated 2026-08-31). Use `docs/research/PROVIDER_EXPANSION_2026-10-24.md` + `data/research/provider-candidates-2026-10-24.csv`.
- Rows marked VERIFY (Hetzner stock/IPv4, OVH term, Contabo VAT ambiguity, Hostinger renewal) need a human/browser check of the official page; do not publish guesses.
- Fill Trustpilot score/count/URL/date for draft providers (netcup, Webdock, Vultr, UpCloud, Time4VPS, Scaleway were draft in the measured DB → they never appear publicly).
- Import through Admin → Import (staged), resolve issues, approve terms, publish. Done when `npm run data:check` passes and `scripts/check_public_parity.ts` passes on the new snapshot.

**6.2 Legal/D-4:** Privacy/Terms/Affiliate disclosure keep existing copy until owner sign-off; ensure Privacy mentions analytics tables and server logs as built.

**6.3 Accessibility gate:** `tests/e2e/phase7-accessibility.spec.ts` green in all six Playwright projects; add admin routes from §3.2 to `keyboardAdminJourney`. One real screen-reader journey (NVDA or VoiceOver) recorded in `docs/qa/` — this needs a human.

**6.4 Performance gate:** `npm run check:phase7:js` (catalog JS < 120 KB) and `npm run measure:phase7` (needs `RUNTIME_SOURCE_DATABASE=/tmp/...` — use the §7.1 DB). Budgets: LCP < 2 s, CLS < 0.05, lab INP < 200 ms on the listed routes. Hero art must not block LCP; patchwork kit lazy below the fold.

**6.5 Security gate:** `npm run check:security`, `npm audit --omit=dev --audit-level=high`, CSP nonce-only (keep), SVG upload sanitization (A9), admin `noindex` + `Cache-Control: no-store` on every new admin route, admin excluded from sitemap/analytics.

**6.6 Recovery gate:** `npm run check:phase7:recovery` (passes as of 25 Oct after the updates heading fix), `scripts/check_backup_restore.ts`, plus A10 heartbeat.

**6.7 Full suite:** `npm run release:check` must be green. Note: run `E2E_PORT=<free port> npm run test:e2e` if 3100 is taken; the suite currently has failing public **visual baselines** (expected until §5 is reviewed) and older admin selectors that must be updated as screens move.

---

## 7. How to measure and verify

### 7.1 Real-size local database + admin session (disposable)
```sh
rm -rf /tmp/bvf-full && mkdir -p /tmp/bvf-full
DATABASE_URL=/tmp/bvf-full/catalog.db npx tsx scripts/publish_full_catalog.ts
DATABASE_URL=/tmp/bvf-full/catalog.db AUTH_SECRET=local-audit-secret-0123456789abcdefghij npx tsx -e '
import {getDb,closeDatabase} from "./src/db/client";import {adminUsers} from "./src/db/schema";
import {createAdminSession,hashAdminPassword} from "./src/lib/admin-auth";import fs from "node:fs";
(async()=>{getDb().insert(adminUsers).values({id:"audit-admin",email:"audit@example.invalid",passwordHash:await hashAdminPassword("x-audit-password-123"),isActive:true}).run();
fs.writeFileSync("/tmp/bvf-full/session.txt",createAdminSession("audit-admin","local audit").token,{mode:0o600});closeDatabase();})()'
npm run build
DATABASE_URL=/tmp/bvf-full/catalog.db AUTH_SECRET=local-audit-secret-0123456789abcdefghij BESTVPSFORME_PUBLIC_DATA_MODE= npx next start --hostname 127.0.0.1 --port 3261
```
Then: `ORIGIN=http://127.0.0.1:3261 SESSION_FILE=/tmp/bvf-full/session.txt OUT=/tmp/bvf-audit node scripts/audit/route-dom-audit.mjs` → prints elements/forms/inputs/HTML/height per route and writes screenshots to `/tmp/bvf-audit/shots/`. Re-run after each package; paste the table into `docs/design/v1-shore/IMPLEMENTATION_STATUS.md`.

If Playwright says the browser is missing: `npx playwright install chromium`.

### 7.2 Gates per package
- Always: `npm run lint && npm run typecheck && npm test && npm run build`.
- Admin packages: targeted Playwright specs (`admin-readonly`, `admin-actions`, `admin-editorial`, `admin-terms`, `admin-settings`, new `admin-budgets`) with `E2E_PORT=<free> E2E_DATABASE_URL=/tmp/<new>/catalog.db`.
- Public packages: `public-routes`, `phase7-accessibility`, `ui-contracts`, `catalog-large`, `home-finder`, new motion specs.

---

## 8. Milestones (suggested order)

1. **M1 Admin usable (A1–A6, A12):** biggest pain. Ship shell + route split + list/detail for Offers, Providers, Affiliates, Terms, Editorial; budgets enforced by test.
2. **M2 Admin complete (A7–A11):** remaining screens, day theme, logo upload, backup heartbeat, outbound checks.
3. **M3 Public parity (F1–F12):** quick wins first (F1, F4, F5, F11, F2 copy fix), then hero (F2), pick feedback (F3), compare verification (F7), CSS cleanup (F10), screenshot review.
4. **M4 Data refresh (6.1).**
5. **M5 Gates (6.3–6.7):** full `release:check`, performance, recovery, human screen-reader pass, owner review. Stop before deployment.

---

## 9. Definition of done (V1 release candidate, not deployed)
- Every admin route meets §3.1 budgets on the real-size DB; no admin page renders more than one edit form; old `?view=` URLs redirect.
- Each V1 plan §7.1 admin screen exists with its listed fields and actions, each mutation audited and covered by an `actions.test.ts` and one e2e spec.
- Public pages pass reviewed side-by-side comparison with the mockup at 390/768/1440 × day/night, including the motion moments in §5 with reduced-motion fallbacks.
- No browser console errors on any public or admin route (CSP violation fixed).
- New snapshot published from refreshed data; `data:check`, public parity, accessibility, performance, security, recovery and `release:check` all green.
- `DESIGN.md` records every new decision/override; `IMPLEMENTATION_STATUS.md` updated with measured numbers.
- Owner sign-off pending; deployment not performed.

---

## 10. Pitfalls already hit
- `shore-tokens.css` is checked against the mockup byte-for-byte; edits there break `css-system.test.ts`.
- Legacy `.field`, `.finder`, `.seg`, `.unk` rules in `system.css`/`home.css`/`compare.css` silently override Shore styles; scope or delete them.
- axe contrast scans during CSS transitions report false mid-transition colours; scans set `reducedMotion: "reduce"` (`check_accessibility_runtime.ts`).
- Port 3100 is often in use; always pass `E2E_PORT`.
- `next dev` crashes with "OS file watch limit reached"; use build + start.
- E2E fixture IDs must be unique per test run (see `seedProviderEditorFixtures` in `tests/e2e/admin-readonly.spec.ts`) or retries collide.
- `/compare` is now rendered by `src/components/shore/ShoreCompare.tsx` (added by another session); verify it before building on it.
