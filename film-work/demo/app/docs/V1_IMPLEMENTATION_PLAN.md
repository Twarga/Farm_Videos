# bestvpsforme V1 — implementation plan (handoff)

**For:** the engineer or AI agent who ships V1 to production.
**Date:** 24 Oct 2026. **Owner:** Twarga (TwargaOps).
**Read first:** this file → `Scope.md` §5–§12, §27–§31 → `docs/design/V1_SHORE_DESIGN_PLAN.md` → `brand/shore/mockup/README.md`.

---

## 0. Ground rules for the implementer

1. **The front end is finished. Do not redesign it.** The static mockup in `brand/shore/mockup/` is the visual and behavioural source of truth: layout, copy, colours, motion, states, breakpoints. Port it into the Next.js app so a side-by-side screenshot at 390 / 768 / 1440 px in day and night shows no visible difference. Allowed changes: real URLs instead of `#hash` routes, real data instead of `data.js`, server rendering, and bug fixes that keep the look.
2. **The backend mostly exists. Reuse it.** `src/db`, `src/lib`, `src/app/admin`, `src/app/api` already implement publication snapshots, staged imports, price-terms review, editorial review, corrections, outbound `/go/[id]`, analytics, admin auth with TOTP MFA, CSRF and audit log. Build on these modules; do not start a new backend.
3. **Integrity rules are non-negotiable (Scope §6).** Unknown stays "Not published". No invented totals, renewals, urgency, "live" claims or benchmarks. Commission never changes the order. Every public number has a source and a check date.
4. **Mockup data is a fixture.** `brand/shore/mockup/data.js` was exported from the dev server on 23 Oct 2026. Never ship it. Production reads the current publication snapshot.
5. Work in the phases of §9. Each phase ends green on `npm run lint && npm run typecheck && npm test` plus the phase's own checks.
6. Owner decisions in §3 block only the items they name. Default to the safe option and keep going.

---

## 1. What exists today

| Area | State | Where |
|---|---|---|
| Product scope V1→V3 | Done | `Scope.md` |
| V1 design plan (Shore) | Done | `docs/design/V1_SHORE_DESIGN_PLAN.md` |
| Front-end mockup, all V1 pages | Done, tested at 10 widths, day/night, reduced motion | `brand/shore/mockup/` (`index.html`, `shore.css`, `shore.js`, `kit/patchwork.js`, `logos/`, `fonts/`) |
| Character kit (Patchwork crab, bear) | Done | `brand/shore/mockup/kit/patchwork.js` (from `design_system/brand/characters/v2`) |
| Next.js app (old "Highlighter" design) | Live code, to be re-skinned | `src/app` |
| DB schema + publication pipeline | Done | `src/db/schema.ts` (providers, offers, offer_prices, offer_editorial, fx_rates, locations, provider_affiliate_programs, import_jobs, staged_import_rows, verification_issues, publication_snapshots, admin_*, audit_log, site_settings, analytics_*, affiliate_*) |
| Catalog logic | Done | `src/lib/catalog.ts` (`filterOffers`, `sortOffers`, `getSpecBounds`), `catalog-controls.ts`, `catalog-url.ts`, `score.ts`, `real-price.ts` |
| Admin | Done (imports, terms, editorial, home) | `src/app/admin` |
| Public APIs | `/api/public/offers`, `/api/corrections`, `/api/health/{live,ready}`, `/api/analytics/events`, `/go/[id]` | `src/app/api`, `src/app/go` |
| Release checks | Done | `npm run release:check` and `scripts/check_*` |
| New provider research | Candidates only | `docs/research/PROVIDER_EXPANSION_2026-10-24.md`, `data/research/provider-candidates-2026-10-24.csv` |

---

## 2. Scope check: V1 requirements vs the finished front end

Legend: ✅ covered by mockup · 🔧 needs backend wiring · ⚠️ gap or conflict to resolve.

| Req | Requirement (Scope) | Mockup | Backend work |
|---|---|---|---|
| BR-01..04 | Crab/shell identity in TwargaOps family, not Highlighter | ✅ crab + shell mark, stitched Patchwork art, bear footer | ⚠️ Logo deliverables §8.2 (favicon 16–48 px, OG card, one-colour, clear-space sheet) not produced yet. Task P1-4. |
| §8.5 | Motion contract, reduced motion, pause off-screen | ✅ IntersectionObserver sleepers, `.rm` + `prefers-reduced-motion` | Port as-is |
| WEB-01 | Home: purpose + catalog in first viewport, shortlist, company link | ✅ finder, shore hero with real logo shells, ranked board, how-it-works, contact | 🔧 shortlist from snapshot; counts from snapshot |
| WEB-02 | Catalog: table + cards, filters, sort, URL state, pagination, loading/empty/unavailable | ✅ ledger + cards, sliders, chips, switches, provider/country lists, 24/48/96, three states | 🔧 server data, URL key compatibility (§5) · ⚠️ **text search** (see D-1) |
| WEB-03 | Offer receipt with evidence, unknowns, 36-month estimate only when supported, correction path, outbound | ✅ receipt + evidence threads, true monthly cost, 36-month chart, "Report a wrong price" | 🔧 SKU/stable ID line, due-today vs allocated cost, review-scope label from `current-price-terms.ts` |
| WEB-04 | Compare up to 4, empty/partial, no sole winner on ties | ✅ sewing thread, diff rows, "only differs", ties unlabeled | 🔧 `/compare?id=…` via `compare-url.ts` |
| WEB-05 | Providers with dated third-party rating | ✅ directory + provider page | 🔧 `public-providers.ts` |
| WEB-06 | Guides with author attribution; methodology | ✅ 6 guides + methodology | ⚠️ author byline missing in mockup → add from `src/lib/authors.ts` (style as kicker line). Guide copy must be reviewed; keep existing `src/lib/guides.ts` content where it differs. Methodology must state real score inputs from `score.ts` (no invented weights). |
| WEB-07 | Special offers: reviewed promos, dates, caveats, expiry | ✅ deal cards with intro/then strip | 🔧 source from `public-special-offers.ts` (reviewed promos with expiry), not the mockup's derived list |
| WEB-08 | Updates without "live feed" claims | ✅ snapshot timeline | 🔧 `publication_snapshots` |
| WEB-09 | Corrections: bounded fields, evidence, rate limits | ✅ form with validation | 🔧 POST `/api/corrections` (exists) |
| WEB-10 | Privacy/terms describe real behaviour | ✅ draft pages marked "draft" | ⚠️ legal review; must mention analytics (`analytics_*` tables) and server logs as actually built |
| §10.9 | Keep canonical routes, `/go`, `/for-me` compat, old catalog URLs | — (hash routes) | 🔧 route map §4 |
| OPS-01..04 | Admin auth/MFA/CSRF/audit, staged imports, deliberate publish/rollback, partner records separate | n/a | ✅ exists; 🔧 re-skin + add missing views §7 |
| §11.2 | Admin views: import status, terms holds + age, editorial states, publication history/rollback, correction queue, affiliate status, health | n/a | 🔧 partly exists; build the missing ones §7 |
| §12.2 | Email: choose one | No signup in mockup | Default **"No email collection"** (D-2) |
| §12.1 | Gates: a11y, perf budgets, security, HTTPS, backup/restore, monitoring, rollback | — | 🔧 Phase 6–7 |

---

## 3. Owner decisions (defaults let work continue)

| ID | Decision | Default if no answer |
|---|---|---|
| D-1 | Scope §10.2 says do **not** reintroduce global text search without owner approval. The mockup has a search box in the filter rail and on Providers. Keep it? | Keep the Providers page search (name filter on one page). **Hide the catalog rail search** behind `site_settings.catalogSearch=false` until approved. Backend already supports `q`. |
| D-2 | Email option for V1 | No email collection. No signup UI ships. |
| D-3 | Price per month shown in lists: advertised price (mockup) or reviewed 3-year real price (`displayPriceUsd`)? | Use `displayPriceUsd` so filters, sliders and the shown number agree (comment in `catalog-controls.ts`). Keep the mockup's renewal line under it. |
| D-4 | Final legal text for Privacy / Terms / Affiliate disclosure | Ship mockup copy only after a lawyer or owner sign-off; otherwise keep existing `src/app/privacy` and `terms` copy inside the new layout. |
| D-5 | Add researched providers (Hetzner, Kamatera, OVH 2027 range, DO price rise) before launch? | Yes, through staged import and terms review. Launch is not blocked on them. |

---

## 4. Route map (mockup hash → production route)

| Mockup | Production route | Source today | Notes |
|---|---|---|---|
| `#home` | `/` | `src/app/page.tsx` | Replace body with Shore home |
| `#catalog?…` | `/catalog?…` | `src/app/catalog` | Server-render first page; client islands for filters |
| `#catalog?view=cards` | `/catalog?view=cards` | same | |
| `#offer/<id>` | `/offers/<id>` | `src/app/offers/[id]` | Keep id format (`offer-id.ts`) |
| `#compare` | `/compare?id=a&id=b…` | `src/app/compare` | Pail state in localStorage key `shore-pail` mirrors URL |
| `#special-offers` | `/special-offers` | exists | |
| `#providers` | `/providers` | exists | |
| `#provider/<pid>` | `/providers/<slug>` | exists | Keep `providerRedirect` |
| `#guides`, `#guide/<slug>` | `/guides`, `/guides/<slug>` | exists | Keep existing slugs; mockup slugs are examples |
| `#methodology` | `/methodology` | exists | |
| `#corrections?plan=<id>` | `/corrections?plan=<id>` | exists | |
| `#updates` | `/updates` | exists | |
| `#privacy`, `#terms` | `/privacy`, `/terms` | exist | |
| `#affiliate` | `/affiliate-disclosure` | **new** | Link from footer + every "Ad" chip |
| `#nope` | `not-found.tsx` | exists | Keeper fishing art |
| Visit button | `/go/<id>` | exists | Never link providers directly; `/go` records the click and applies affiliate URL |
| — | `/about`, `/authors/<slug>`, `/feed.xml`, `/sitemap.xml`, `/robots.txt`, `/for-me` | exist | Keep; restyle `/about` and `/authors` with doc layout |

The mockup's "Mockup" review button and `#rmToggle` are review tools. **Do not ship them.**

---

## 5. Data contract: what each mockup field becomes

Production builds a **public read model** per offer with exactly these fields (names may be camelCase in TS). Source modules in brackets.

| Mockup field | Meaning | Production source |
|---|---|---|
| `id` | stable offer id | `offers.id` |
| `pid`, `p`, `hq` | provider id, name, HQ country | `providers.slug/name/hqCountry` via `resolveOfferProvider` |
| `name` | plan name | `offers.planName` |
| `vcpu`, `cpu` | vCPU count, CPU kind | `offers.vcpus`, `offers.cpuKind` |
| `ram`, `disk`, `dk` | GB, GB, disk type | `offers.ramGb`, `diskGb`, `diskType` |
| `bw`, `transfer` | TB/month, label | `offers.bandwidthTb` |
| `loc[]` | country codes | `offer_locations` → `locations.isoCountry` |
| `cur`, `fx`, `fxDate` | source currency and dated USD rate | `offer_prices.currency`, `fx_rates` |
| `eff`, `adv`, `usd` | effective/advertised monthly; USD shown | `offer_prices`, `usd()` / `displayPriceUsd()` (D-3) |
| `introM`, `intro`, `ren`, `term`, `upfront`, `cash`, `setup` | intro months, intro price, renewal, commitment, months paid up front, due today, setup fee | reviewed terms: `current-price-terms.ts`, `price-terms.ts`, `setup-fee-evidence.ts`, `renewal-evidence.ts` |
| `tr` | billing terms reviewed? | price-terms approval state (`price-terms-approval.ts`) |
| `real` | reviewed 3-year monthly average | `real-price.ts` (`reviewedPrice`) — null when any input unreviewed |
| `ipv4` | included / extra / location-dependent / unknown | `offers.ipv4Status` |
| `backups`, `managed`, `vat` | nullable facts | offer facts; `null` = "Confirm at checkout" |
| `fit`, `catch` | "Good for" / "The catch" copy | `offer_editorial` **only when editorial status is approved**; else omit |
| `aff` | link earns commission | `provider_affiliate_programs` active for this offer (drives the "Ad" label only) |
| `checked`, `url` | price check date, source URL | `offer_prices.checkedAt`, `offers.officialUrl` |
| `tp`, `tpc`, `tpDate` | Trustpilot score, count, date | `providers.trustpilot*` |
| `rank` | value rank | `sortOffers(…, "recommended", …, cohort)` position in the full eligible cohort |
| `BVP_META` | count, providers, snapshot date, source | current `publication_snapshots` row |

Rules: a field the backend cannot prove is `null`, never a guess. The UI already renders every `null` correctly ("Not published", "Confirm at checkout", "At least …", "Not computable").

---

## 6. Catalog filter, sort and URL contract

The mockup's filters are a one-to-one match for `filterOffers` (minus workload, removed from V1 UI). **Use the existing URL keys** so old links keep working (Scope §10.9); accept the mockup keys as aliases.

| Control (mockup) | Mockup key | Canonical key (keep) | `CatalogQuery` field | Note |
|---|---|---|---|---|
| Search (D-1) | `q` | `q` | `q` | hidden by default |
| Memory slider: Any,1,2,4,8,16,32,64 GB | `ram` | `ram` | `ram: [n]` | floor |
| Budget slider: $3,5,7,10,15,20,25,30,50,100,Any | `price` | `price` | `maxPrice` | ceiling on `displayPriceUsd` |
| CPU slider: Any,1,2,4,6,8,16 | `cpu` | `cpu` | `cpus: [n]` | floor |
| Storage slider: Any,20,40,80,100,200,400 GB | `disk` | `disk` | `diskMin` | floor. Update `CPU_STEPS`/`DISK_STEPS`/`RAM_STEPS` in `catalog-controls.ts` to these lists |
| Region chips | `regions` | `regions` | `regions` | europe, na, asia, oceania |
| Trustpilot Any/3.5/4.0/4.5 | `tp` | `trust` | `trustMin` | |
| Honest terms switches | `flags` | `honesty` | `honesty` | contract, flat, ipv4 |
| Providers checklist | `prov` | `providers` | `providers` | |
| Countries checklist | `loc` | `locations` | `locations` | |
| Sort menu + header click | `sort` | `sort` | `sort` | map: value→recommended, price→real (or effective, follow D-3), ram→ram, cpu→cpu, disk→disk, bw→bandwidth, tp→trustpilot |
| Direction button | `dir` | `dir` | `sortDirection` | defaults: recommended/price asc in UI wording "Best first"/"Lowest first" — check `sortOffers` sign convention and translate |
| List / Cards | `view` | `view` | `view` | persisted in localStorage `shore-view` |
| 24 / 48 / 96 | `per` | `per` | `perPage` | persisted in localStorage `shore-per` |
| Page | `page` | `page` | — | add if missing; clamp to range |

Old `workload=` links: accept and ignore (no error, no redirect loop).

---

## 7. Admin panel (V1)

Keep the existing auth, MFA, CSRF, audit and server actions (`src/app/admin/actions.ts`, `src/lib/admin-auth.ts`, `csrf.ts`). Re-skin with the Shore tokens (`shore.css` `:root` + night/day variables, `.btn`, `.pill`, `.seg`, `.ledger`, `.dd`, `.tgl`, `.ck`) but **no characters or motion** inside admin. Night theme default.

### 7.1 Screens

| Screen | Route | Exists? | Must show / do |
|---|---|---|---|
| Sign-in + TOTP | `/admin` (unauthenticated) | yes | Email, password, 6-digit code, recovery code path, lockout message |
| Dashboard | `/admin` | partly | Cards: current snapshot (date, plans, providers), open import jobs, blocking issues, terms holds (count + oldest age), editorial drafts, open corrections, last backup time, `/api/health/ready` status, recent errors |
| Imports | `/admin/imports` | yes | Upload CSV (schema = `data/vps-offers-*.csv` header) → staged job → row diff (new / changed / removed) → validation issues with severity → approve → publish. Never publish from upload directly |
| Terms review | `/admin/terms` | yes | Per offer: intro months, intro price, renewal, setup, commitment, due today, IPv4, VAT basis, each with evidence URL + screenshot + checked date; hold reasons; hold age; approve/hold |
| Editorial | `/admin/editorial` | yes | "Good for" / "The catch" drafts; approved vs draft; only approved reaches public |
| Publications | `/admin/publications` | **new view on existing data** | List `publication_snapshots` (date, counts, author, diff summary). Actions: publish staged, roll back to previous (confirm dialog, audit entry) |
| Corrections | `/admin/corrections` | **new** (queue exists as JSON) | Store corrections in a table (`corrections`: id, offerId, field, claimedValue, sourceUrl, email?, status open/accepted/rejected, createdAt, resolvedAt, resolverId, note). List, filter by status, open offer, accept → creates a staged change; reject with note. Rate-limit already in `public-rate-limit.ts` |
| Providers | `/admin/providers` | partly (import) | Edit provider identity, logo upload (SVG/PNG, 1:1, max 100 KB), HQ, Trustpilot score/count/URL/checked date, status (active/archived) |
| Affiliate programs | `/admin/affiliates` | data exists | Program per provider: status, network, link template, checked date, notes. **Separate screen from editorial and terms** (OPS-04). No field here feeds `score.ts` |
| Settings | `/admin/settings` | `site_settings` | Toggles: catalog search (D-1), home x-ray, maintenance banner. Each change audited |
| Audit log | `/admin/audit` | table exists | Read-only, filter by actor/action/date |
| Health | `/admin/health` | partly | DB size, WAL size, last backup + restore test date, snapshot freshness (`check_phase7_freshness`), outbound link failures |

### 7.2 Admin rules
- Every mutating action: server action, CSRF token, re-check session, write `audit_log` (actor, action, target, before/after JSON).
- Publish and rollback run in one SQLite transaction and are idempotent.
- Destructive actions need a typed confirmation ("publish", "rollback").
- Admin pages send `noindex`, `Cache-Control: no-store`, and are excluded from sitemap and analytics.

---

## 8. Front-end port: component map

Port `shore.js` render functions to React Server Components, with small client islands only where the mockup has interaction. Keep class names and CSS from `shore.css` (move to `src/app/shore.css` or split by layer; do not convert to Tailwind utilities — that risks visual drift). Keep `kit/patchwork.js` as a module that returns SVG strings (render with a sanitized `dangerouslySetInnerHTML` from a trusted static source only).

| Mockup function | Component | Server/Client |
|---|---|---|
| header in `index.html`, theme button, pail pill, menu | `SiteHeader`, `ThemeToggle`, `PailButton`, `MobileMenu` | client islands for toggle/pail/menu |
| footer | `SiteFooter` | server |
| `renderHome`, `heroWire`, `shellNode`, `callCrab` | `HomePage`, `ShoreHero` (client), `ValueBoard`, `HowItWorks`, `ContactCrab` | hero client; rest server |
| `renderCatalog`, `railHtml`, `rangeHtml`, `checklist` | `CatalogPage`, `FilterRail` (client), `RangeFilter`, `ChecklistFilter`, `ActiveFilterPatches` | rail client; first results page server-rendered |
| `ledgerHtml`, `ledgerRow`, `cardHtml`, `pagerHtml`, `meter`, `tpBadge`, `renewLine` | `OfferLedger`, `OfferRow`, `OfferCard`, `Pager`, `SpecMeter`, `TrustpilotBadge`, `RenewLine` | server, with sort header buttons as links |
| `enhanceSelects` | `Dropdown` (ARIA listbox over native select) | client |
| `renderOffer`, `receiptLines`, `trueCost`, `costChart`, `drawThread` | `OfferPage`, `PriceReceipt` (client for evidence threads), `TrueMonthlyCost` (client disclosure), `CostChart` | mixed |
| `renderCompare`, `sew` | `ComparePage`, `SewingThread` (client) | mixed |
| `renderOffers` | `SpecialOffersPage` | server + filter segment client |
| `renderProviders`, `renderProvider`, `provCard` | `ProvidersPage` (search client, D-1), `ProviderPage` | |
| `renderGuides`, `renderGuide`, `docShell`, `wireToc` | `GuidesIndex`, `GuidePage`, `DocLayout`, `Toc` (client scroll-spy) | |
| `renderDoc` (methodology, privacy, terms, affiliate) | `DocLayout` pages | server |
| `renderUpdates`, `renderCorrections` | `UpdatesPage`, `CorrectionForm` (client, posts to `/api/corrections`) | |
| `render404`, `fishArt`, `walkArt`, `stateArt` | `NotFound`, `EmptyState`, `LoadingState` | |
| `fly`, `toast`, `roll`, tide line, lantern view transition | `useFlyToPail`, `Toast`, `CountRoll`, `TideLine`, theme transition | client |

Theme: persist in localStorage `shore-theme`, set `data-theme` before paint with the inline script from `index.html` (prevents flash). Fonts: self-host Ubuntu Sans / Ubuntu Sans Mono from `mockup/fonts` via `next/font/local`.

---

## 9. Phased task list

Each task: **Do → Done when**.

### Phase 0 — Setup (½ day)
- P0-1 Branch `v1-shore`. Copy `brand/shore/mockup` assets (fonts, logos, kit) into `public/shore/` and `src/shore/`. → Done when the app builds unchanged.
- P0-2 Baseline screenshots of the mockup at 390/768/1440 × day/night for every route (scripts like `/tmp/shore/*.cjs` used in design review; reproduce under `scripts/visual/`). → Stored in `docs/design/v1-shore/baseline/`.
- P0-3 Record D-1…D-5 answers in `Scope.md` §32.3.

### Phase 1 — Foundations (2 days)
- P1-1 Move `shore.css` tokens and components into the app; remove Highlighter styles from public routes (keep admin working).
- P1-2 `SiteHeader`, `SiteFooter`, theme toggle (with lantern view transition), mobile menu, skip link, tide line.
- P1-3 `Dropdown`, `Button`, `Pill`, `Segmented`, `Toggle`, `Checkbox`, `RangeFilter` with the mockup's ARIA.
- P1-4 Logo deliverables (§8.2): SVG lockup + mark, light/dark/one-colour, favicons 16/24/32/48, apple-icon, OG image with crab mark (`opengraph-image.tsx`). → Inspected at each size.
- Done when: header/footer screenshots match baseline; axe has no violations on an empty page.

### Phase 2 — Public read model (2 days)
- P2-1 `getPublicOffers()` returns the §5 shape from the current snapshot (extend `public-catalog.ts`). Unit-test every nullable field.
- P2-2 `rank` = position in `sortOffers(cohort, "recommended")`.
- P2-3 URL parser/serializer per §6 (extend `catalog-url.ts` with aliases + new step lists). Tests: every old key, every alias, bad values ignored.
- P2-4 Meta: count, providers, snapshot date for header/footer/home.
- Done when `check_public_parity` and `check_catalog_payload` pass with the new shape.

### Phase 3 — Pages (6–8 days)
- P3-1 Home (finder counts live client-side from a compact payload; shells show top 4 one-per-provider).
- P3-2 Catalog: SSR first page; client rail updates URL with `router.replace` (no scroll jump); loading/no-match/unavailable states; filter sheet on < 1024 px with focus trap and focus return.
- P3-3 Offer page with receipt, evidence threads, true monthly cost, 36-month chart, siblings, correction link, `/go` button, Ad/Direct label, SKU + id line.
- P3-4 Compare with pail (localStorage + `?id=`), sewing, "only differs".
- P3-5 Special offers (reviewed promos only, expiry respected), Providers, Provider page.
- P3-6 Guides index + guide (keep existing content and slugs, add author byline), Methodology (real inputs), Updates, Corrections (POST), Privacy, Terms, Affiliate disclosure, About, Authors, 404.
- Done when every route matches its baseline screenshot within review tolerance and all links resolve.

### Phase 4 — Admin (4–5 days)
- P4-1 Re-skin existing admin screens.
- P4-2 Build Publications, Corrections (table + migration), Providers, Affiliates, Settings, Audit, Health views (§7.1).
- P4-3 Migrate `app/admin/terms/correction-queue.json` into the `corrections` table.
- Done when every OPS requirement has a test (`actions.test.ts` pattern) and an audit entry.

### Phase 5 — Data refresh (2–3 days, parallel)
- P5-1 Re-check prices older than 45 days; DO 1 GiB now $6, Hostinger KVM 2 $8.79 (research file).
- P5-2 Import Hetzner, Kamatera, OVH 2027 range from `data/research/provider-candidates-2026-10-24.csv` after verifying the rows marked VERIFY; add Trustpilot data; research Vultr, HostHatch, Cloudzy, Hosting.com, IONOS renewals.
- P5-3 Provider logos into `public/logos` (same rules as `src/lib/assets.ts`).
- Done when a new snapshot publishes with `npm run data:check` green and no offer shows an unsupported total.

### Phase 6 — Quality gates (3 days)
- A11y: axe on every route, keyboard walkthrough (filters, dropdowns, compare, receipt), one real screen-reader journey (NVDA or VoiceOver) recorded in `docs/qa/`.
- Performance (Scope §28.1): `npm run measure:phase7`, `check:phase7:js`. Lazy-load character kit below the fold; hero must not block LCP; pause animations off-screen.
- Security: `npm run check:security`, CSP allows only self + inline theme script hash; `npm audit`.
- Visual regression vs Phase 0 baselines; reduced-motion captures.
- `npm run release:check` fully green.

### Phase 7 — Deploy (1–2 days)
- Follow `docs/ops/DEPLOYMENT.md` and `docs/ops/LAUNCH_CHECKLIST.md`.
- HTTPS on target server, `/api/health/ready` external monitor, daily `db:backup` + one restore drill (`check:phase7:recovery`), rollback to previous build tested.
- Owner sign-off recorded with build id and snapshot id.

Rough total: **20–25 working days** for one experienced full-stack engineer.

---

## 10. Definition of done (V1)

- [ ] Every route in §4 renders the Shore design and matches baseline screenshots (day/night, 390/768/1440).
- [ ] All data comes from the current publication snapshot; no fixture data ships.
- [ ] Filters, sort, view, per-page, page live in the URL; old URLs still work.
- [ ] Unknown facts render as unknown; no invented totals; "Ad" labels and `/go` outbound everywhere.
- [ ] Admin: staged import → review → publish → rollback works and is audited; corrections queue works.
- [ ] D-1…D-5 recorded.
- [ ] `npm run release:check` green; axe clean; screen-reader journey recorded; perf budgets met.
- [ ] Production HTTPS, monitoring, backup + restore drill, rollback proof.
- [ ] Review tools (Mockup panel) removed.

---

## 11. Known mockup quirks to fix during the port
- Some fixture plans show **$0.00/mo** and sort first by price. Production must exclude offers without a valid price from price sorting or show them last (`compareKnown` already does this).
- Guide copy (memory ranges, VPN/WordPress advice) was written for the mockup and is not sourced. Prefer existing reviewed guides.
- Methodology lists score inputs but no weights. Copy the real behaviour from `score.ts`.
- Legal pages are marked draft (D-4).
