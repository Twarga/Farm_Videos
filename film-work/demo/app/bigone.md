# bigone — bestvpsforme brand, UI, code, and repo overhaul

> Continuation status (28 September 2026): see [the recovered progress ledger](docs/progress/session-resume-2026-09-28.md) for verified work and remaining tasks. The original checkboxes below have not been retroactively marked as complete.

> **Update 30 September 2026:** Parts C and D were rewritten for the chosen **bold "Highlighter" identity** (volt + ink, Mona Sans + Geist Mono, lowercase wordmark). Its assets, tokens, clickable mockups, marketing kit and video brief are in [`brand/`](brand/README.md). New P0 data findings D12–D13, Tasks 1.9–1.10, Task 3.0 (contract update) and Phase 8 (marketing + Remotion video) were added. Work done by the continuation session (ledger above) is reflected in the phase status table.

> **Update 4 October 2026:** The owner-requested interface clarity redesign supersedes the original promotional layout, global search/command palette, reveal animations and plan-morph requirements in Parts C/D and Phases 4/5. Current presentation and navigation decisions live in [`DESIGN.md`](DESIGN.md) and [`docs/product/PRODUCT_CONTRACT.md`](docs/product/PRODUCT_CONTRACT.md). Pricing, evidence, ranking, authentication and publication rules are unchanged; Phase 6 editorial and production owner gates remain separate.

> **For agentic workers:** Execute phase by phase. Each phase ends in a working, shippable app. Phases 0–2 are written as concrete tasks with files and code. Phases 3–7 are specs with acceptance criteria; write a detailed task plan for each (same format as Phase 1) before you touch code. Steps use `- [ ]` checkboxes.

**Goal:** Turn bestvpsforme from a well-guarded but plain pre-production tool into a premium, recognisable brand: the most trusted place to find out what a VPS really costs. Keep the integrity rules that already make it different.

**Architecture:** Next.js 16.3 App Router + React 19.2, SQLite through Drizzle, Tailwind v4 plus one 3,000-line `globals.css`. Public pages read a reviewed publication snapshot. The owner admin handles imports, publication, and analytics.

**Tech stack:** next 16.3.3 (Turbopack), react 19.2, drizzle-orm 0.45, better-sqlite3, zod 4, Tailwind 4, Vitest 4.1.11, Phosphor icons. Fonts today: IBM Plex Sans/Mono. Target: Mona Sans + Geist Mono (`brand/fonts/`, OFL).

**Spec:** `PRODUCT.md`, `docs/product/PRODUCT_CONTRACT.md`, `DESIGN.md`, and for the new identity `brand/BRAND.md` + `brand/tokens/tokens.css` + `brand/mockups/`. This plan changes `DESIGN.md` and the design invariants of `docs/product/PRODUCT_CONTRACT.md` on purpose (Task 3.0). `docs/product/PRODUCT_CONTRACT.md` stays binding. Its change rule says to stop and update the contract before any conflicting change, and this plan follows that rule.

**Evidence base:** Audit run on 2026-09-28. `npm ci`, `eslint`, and `tsc --noEmit` all passed. I ran the dev server on the local DB (323 offers, 314 visible after the Trustpilot filter) and took headless Chromium screenshots of home, catalog, offer, provider, compare, methodology, and guides at 1440 px and 390 px. The web research is listed in the appendix.

## Global constraints

- Next.js is **16.3.3** and its APIs differ from older versions. Before you write routing, caching, font, metadata, or transition code, read the matching guide in `node_modules/next/dist/docs/`.
- Ranking never uses affiliate status, commission, revenue, EPC, or partnership (Contract rule 1).
- Unknown stays unknown. Never turn a missing value into 0, "None", "Unmanaged", "month to month", or "included" (Contract rule 3).
- Production never falls back to static TypeScript offers (Contract data invariant).
- Light is the default theme and dark is a first-class twin.
- Visual identity = `brand/` (Highlighter), but only after Task 3.0 updates the contract. Volt is never text on paper, and there are at most three volt uses per screen.
- Anti-references stay banned: gamer-dark hosting templates, affiliate listicles, fake "live prices", cream-paper magazine UI, three equal feature cards, AI-purple glow, glassmorphism, decorative gradients.
- No price claim ships (site, marketing, or video) until D12 and D13 are fixed. The 3-year real price depends on real term, renewal, and currency data.
- WCAG 2.2 AA. Hit targets are at least 24 px on desktop and 44 px on touch. Motion honours `prefers-reduced-motion`.
- There are uncommitted changes in 22 files right now (`git status`). **Commit or stash them before Phase 0.**
- Nothing destructive (deleting files, rewriting history) runs without the owner's explicit OK for that specific action.

---

## Part A — What this project is today

### A1. Product in one paragraph

bestvpsforme.com compares VPS plans for beginners and practical self-hosters. It normalises the "real" monthly price (effective, due today, renewal) and puts hardware, locations, a dated Trustpilot snapshot, and "the catch" side by side. Users leave through a labelled `/go/[id]` redirect. The integrity rules are unusually strong for this category, and they are the brand's biggest asset: commission never affects rank, unknowns are shown as unknown, and every fact is dated.

### A2. Map

| Area | Where | Notes |
|---|---|---|
| Public routes | `src/app/{page,catalog,compare,offers/[id],providers/[slug],methodology,guides,authors,about,privacy,terms,corrections,updates}` | `/for-me` is a legacy redirect |
| Outbound | `src/app/go/[id]/route.ts` | Records click, 302 to reviewed HTTPS URL |
| API | `src/app/api/{public/offers,analytics/events,corrections,health/*}` | |
| Admin | `src/app/admin/*`, `src/components/admin/*` | CSS modules, TOTP auth, CSRF |
| Data | `src/db/*` (24 files, `schema.ts` 927 lines), `drizzle/` | Import → stage → review → publish → snapshot |
| Domain logic | `src/lib/*` (35 files) | `catalog.ts` filter/sort, `public-catalog.ts` row mapping |
| Static fixture | `src/lib/offers.ts` (1,037 lines), `src/lib/providers.ts` | Still imported by production code (see B1) |
| UI | `src/components/*` (22 files) | `FilterRail.tsx` 582 lines, `CatalogClient.tsx` 286 lines |
| Styles | `src/app/globals.css` (2,998 lines) + Tailwind utilities inline + 2 CSS modules | Three styling systems at once |
| Content | `content/guides/*.mdx` (7 guides) | Custom markdown renderer |
| "Tests" | `scripts/` (158 files, 165 npm scripts) | 50 of them regex-match source files |
| Ops docs | 32 Markdown files in repo root (2,346 lines) | |

### A3. What already works well (keep it)

- The integrity contract (`docs/product/PRODUCT_CONTRACT.md`) is clear, testable, and rare in affiliate-funded comparison sites.
- The data pipeline is serious: staged import, review, checksummed publication, rollback snapshot.
- Security basics are in place: CSP, HSTS, CSRF, TOTP admin, rate limiting, secure logging.
- Numbers use mono tabular figures, prices come as a triple (advertised / effective / due today), and labels are in plain English.
- The desktop catalog uses a dense table as the default. That is the right call for this user.
- Lint and typecheck are clean.

---

## Part B — Audit findings

Severity: **P0** breaks the contract, is a legal or security risk, or is visibly broken. **P1** is a real bug or a large UX/perf cost. **P2** is quality or maintainability.

### B1. Data integrity (P0, because it contradicts the product's own promise)

| # | Finding | Evidence | Fix |
|---|---|---|---|
| D1 | **Fixture data leaks into production mapping.** `niches`, `featured`, `backups`, `managed`, `gpus`, and fallback `catch`/`whyFit` come from the static `offerMap`, not from the published snapshot. | `src/lib/public-catalog.ts:42-80` | Move these fields into the DB (`offer_editorial` / offer columns). Map them only from the row. |
| D2 | **Unknowns are fabricated.** `gpus ?? 0` renders "None", `managed ?? false` renders "Unmanaged server", `cashDueToday ?? effectiveMonthly` renders "$X due today", `termMonths ?? 1` renders "month to month". | `public-catalog.ts:65-80`, `OfferDetail.tsx:189-193` | Keep these as nullable types and render "Not published". |
| D3 | **The offer page lists sibling plans from the static fixture**, not from the active publication. | `OfferDetail.tsx:28` calls `siblingOffers()` → `catalog.ts:186` reads `offers` from `./offers` | Query siblings from the published repository by `providerId`. |
| D4 | **The editorial table is empty** (`select count(*) from offer_editorial` → 0). Nearly every offer shows "No reviewed caveat is available yet" and "No reviewed workload fit is available yet". The catch is the product's signature, and it is missing. | Offer and mobile catalog screenshots | Content sprint: write catches for the top 100 offers by traffic or recommendation. Hide the empty slot instead of printing a placeholder sentence. |
| D5 | **The "Recommended" sort is not explained, and it depends on fixture `featured` (+8).** Contabo 18-core at $49 sits in position 2 because RAM/price dominates the score. | `catalog.ts:160-167`, catalog screenshot | Publish the formula on `/methodology`. Make `featured` an editorial DB field with an audit trail, or drop it from scoring. Use a documented value score (see E3). |
| D6 | **"Hourly" sort sorts by monthly price.** It duplicates "Effective". | `catalog.ts:153` | Sort by the real hourly price or remove the option. |
| D7 | **Bandwidth sort is a string compare** ("Not published", "32 TB", "Unlimited"). | `catalog.ts:150` | Sort on numeric `bandwidthTb`, with unknowns last. |
| D8 | **The Trustpilot requirement is a hidden publication rule inside `filterOffers`.** It explains why the home page shows 314 while the README says 322. | `catalog.ts:114` | Move it into the publication policy and state it on `/methodology`. |
| D9 | **"Featured this week" is false.** The snapshot is dated 31 Aug and nothing is weekly. "Why it is here" then shows the catch text ("Snapshots extra. Mostly Germany."). | `HeroShortlist.tsx:19,42` | Rename it ("Strong value in the 31 Aug snapshot"). Show `whyFit` under "Why it's here" and the catch under "Watch out". |
| D10 | The raw region enum leaks into copy ("Germany · MULTI"). | Home screenshot | Map enum values to human labels. |
| D11 | Offers with no locations render an empty cell (Hostinger rows). | Catalog screenshot | Render "Not published". |
| D12 | **Currency is never converted.** 202 EUR and 14 GBP prices have `exchange_rate = NULL` but are stored with `normalized_currency = 'USD'` and shown with "$". netcup's €5.91 shows as "$5.91". VAT treatment also differs by provider (Hetzner excl. VAT, netcup incl. 19%). | `select original_currency, count(*), sum(exchange_rate is null) from offer_prices group by 1` → EUR 202/202, GBP 14/14 | Task 1.10: convert at the ECB reference rate on the check date, store the rate and date, show "€5.91 · $6.44 at 1.09 (31 Aug)", and record VAT basis per provider. |
| D13 | **Renewal and due-today are copies of the effective price.** In all 322 published offers, advertised = effective = due today = renewal, including the 43 with 12- or 24-month terms. The CSV has no renewal/due-today columns; the facts live only in free-text `billing_notes` (e.g. Hostinger KVM 1: "renews $11.99/mo", 24-month term → $155.76 due today; IONOS VPS M+: "$4 for 3 months, then $11"). **The site currently tells users Hostinger renews at $6.49.** | Published offers joined to current prices: renewal = effective in 322/322 rows, due today > effective in 0 rows; CSV has only `price_monthly_usd` + `effective_monthly_usd` | Task 1.9: add structured columns (intro months, intro price, term months, billed upfront, renewal price, setup fee) to the research schema, extract from the notes with human review, and render "Not published" until reviewed. |
| D14 | `offers.catch_notes` / `fit_notes` columns exist, but only **1 of 322** published offers has either (the `offer_editorial` table is also empty). | `sum(catch_notes != '')` → 1 | Phase 6 content sprint; the admin needs an editorial queue ordered by traffic. |
| D15 | **"Recommended" led with $0 free tiers.** `setup_fee` is NULL on all 322 current published prices, so `realMonthly` and `reviewedPrice()` are null for every offer and `valueScore` returns `-1` for all of them. The recommended branch then fell through to a tie-break that sorted ascending on the effective price with no free-last term, so `/catalog` page 1 opened with five $0 always-free tiers (Oracle ×2, Azure, GCP, AWS) — the opposite of the documented intent at `score.ts:49-51`. | Measured on `createCatalogPage` against a copy of the local DB, 2 Oct 2026 | Fixed in Phase 6 Task 6.A: the recommended tie-break now applies the same free-last rule as the generic fallback (`catalog.ts:216-226`), covered by `catalog-behavior.test.ts`. The underlying data gap — no verified setup fee anywhere, so the 3-year real price renders nowhere — is Phase 6 Task 6.7. |

**Phase 6 update (3 October 2026), D5:** `featured` no longer reaches the public `Offer`, catalog reconstruction, sitemap priority, or admin filters, badges, editors and metrics. Every offer URL uses priority 0.6. The database column and snapshot rollback remain for historical integrity. Money-blind ranking still excludes commercial fields.

### B2. Legal and compliance (P0, verify with counsel)

| # | Finding | Fix |
|---|---|---|
| L1 | **Affiliate disclosure is too weak for the FTC's "clear and conspicuous" standard.** The catalog shows a 10 px muted "Affiliate" under the button, and the site-level statement lives in the footer. 2026 guidance says to put a disclosure above comparison tables and next to each paid CTA, at least as large as the surrounding text. | Add a one-line disclosure bar above every table, list, and hero shortlist. Make the per-row label legible (≥12 px, AA contrast, icon + word). |
| L2 | **Outbound paid links have no `rel="sponsored"`.** | `GetDealButton` → `rel="sponsored nofollow"` on affiliate destinations. |
| L3 | **Trustpilot brand use.** Trustpilot's Legal Brand Guidelines (Sept 2026) say "A third party that wants to display Trustpilot content needs its own agreement with us". The site renders Trustpilot's logo (`/logos/trustpilot*.svg`) and star graphics. | Pick one of: (a) get an agreement or API access, or (b) show plain text "Trustpilot 4.7/5 · 1,966 reviews · checked 31 Aug 2026" with a link and no Trustpilot logo or star art. Decision **D-5**. |
| L4 | Provider logos are shown without a documented licence basis. The footer line helps, but nominative use should stay unmodified and never imply endorsement. | Keep "names and logos belong to their owners". Never recolour logos. Add a logo-removal contact to `/corrections`. |

### B3. Correctness, rendering, SEO, performance (P1)

| # | Finding | Evidence | Fix |
|---|---|---|---|
| R1 | **The catalog is not server-rendered.** SSR HTML holds only the pending skeleton (`class="deal-table"` count = 0) because `mobileViewport` starts as `null` and query state is read in `useEffect`. Crawlers and no-JS users get no plans, and LCP waits on hydration. | `CatalogClient.tsx:41,276-282`, `curl /catalog` | Parse `searchParams` on the server, pass `initialQuery`, render the table in SSR, and switch mobile/desktop layout **with CSS**, not JS. |
| R2 | **The catalog page ships ~496 KB of HTML/RSC.** Every published offer is serialised into the client payload. | `curl /catalog \| wc -c` | Server-filter and paginate (50 rows), send slim row DTOs, and fetch more on scroll or page. |
| R3 | **Compare downloads all offers (420 KB JSON) to show at most 4.** Compare state lives in `localStorage`, so it can't be shared. | `CompareProvider.tsx`, `/api/public/offers` | Put compare state in the URL (`/compare?ids=a,b,c`) and render it on the server. Keep `localStorage` only as a restore hint. |
| R4 | **Theme flashes on load.** The theme is set in `useEffect`, and there is no inline head script. | `SiteChrome.tsx:26-43` | Add an inline head script with `useLayoutEffect` re-apply, per `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`. |
| R5 | **Unlayered CSS beats Tailwind utilities.** `.ui-button { display:inline-flex }` sits outside any `@layer`, so `lg:hidden` loses and the mobile "Filters" button shows on desktop. | Catalog 1440 px screenshot; Tailwind v4 cascade-layer docs | Wrap all custom CSS in `@layer base` / `@layer components` (Task 1.6). |
| R6 | **JSON-LD is not escaped** (`JSON.stringify` straight into `<script>`). The Next docs recommend `.replace(/</g, "\\u003c")`. The Product schema also claims `availability: InStock`, which nobody verified. | `offers/[id]/page.tsx:58` | Use a shared `jsonLd()` helper and drop the unverified availability. |
| R7 | **Duplicate DB reads.** `generateMetadata` and the page both call `getPublishedCatalogOfferState`. `layout.tsx` hits the DB on every request for the snapshot date. | `offers/[id]/page.tsx`, `layout.tsx:50` | Wrap reads in React `cache()`. Then evaluate `cacheComponents` + `'use cache'` + `cacheTag(PUBLIC_CATALOG_TAG)`, revalidated on publish (read `01-getting-started/08-caching.md`). |
| R8 | **The OG image is an SVG.** Facebook, LinkedIn, Slack, and X don't render SVG `og:image`. It is also dark, while the brand is light. | `public/og-default.svg`, `layout.tsx:38` | Generate PNGs with `ImageResponse` (`opengraph-image.tsx`) per route: offer, provider, guide. |
| R9 | **The favicon is an off-brand "B" on `#C23A3A`**, while the primary colour is `oklch(0.48 0.2 18)`. There is no apple-icon and no manifest. | `src/app/icon.tsx` | Build a brand monogram and ship `icon.svg`, `apple-icon.png`, `manifest.ts` (Phase 3). |
| R10 | **Third-party favicon fetching** (`icons.duckduckgo.com`) leaks visitor IPs to DuckDuckGo, adds a CSP exception, and gives inconsistent logo quality. | `lib/assets.ts:77-85`, `security-headers.ts:7` | Self-host every provider mark in `public/logos/` and drop the CSP host. |
| R11 | **`ProviderLogo` is a client component only because of `onError`.** It hydrates on every table row. | `ProviderLogo.tsx` | Make it a server component that renders a known-good local asset or the monogram fallback. |
| R12 | Price slider max is **2765 $/mo** because one outlier stretches the whole track. | Catalog screenshot | Use a log-scale or preset price bands ($5 / $10 / $20 / $50 / $100+). |
| R13 | The CSP allows `'unsafe-inline'` scripts. | `security-headers.ts:8` | Move to a nonce-based CSP once the inline theme script exists (`02-guides/content-security-policy.md`). |

### B4. React and code quality (P2)

| # | Finding | Fix |
|---|---|---|
| C1 | `CatalogClient` mixes URL sync, analytics, keyboard shortcuts, viewport detection, filtering, and rendering (4 effects). | Extract `useCatalogQuery()` (URL state), `useSlashFocus()`, and pure `buildActiveChips(query)`. |
| C2 | The view toggle uses inline styles with a `WebkitTextFillColor` hack. | Build a `SegmentedControl` component with `aria-pressed` and token styles. |
| C3 | The whole site chrome is a client component (`SiteChrome`) only for `usePathname` and the theme button. | Split into a server `SiteHeader`/`SiteFooter` plus small client islands (`NavLinks`, `ThemeToggle`, `PageViewTracker`). |
| C4 | There are three styling systems: a 3k-line global sheet with BEM-ish classes, Tailwind utilities with arbitrary values (`text-[12.5px]`, `h-[34px]`), and CSS modules. 4 selectors are duplicated (`.catalog-clear-filters`, `.compare-dock`, `.compare-notice`, `.hero-shortlist__foot`). There are 9 different breakpoints (480/640/700/760/767/860/900 px…). | Phase 3 tokens, then split CSS by component (co-located CSS modules or `@layer components` files). Standardise 3 breakpoints. |
| C5 | Overlapping components: `CompareBar` + `CompareDock`, `DealCards` + `MobileDealList` + `MobileOfferRow`. | Merge into `OfferRow` (responsive) + `OfferCard`, and `CompareTray`. |
| C6 | `src/lib/offers.ts` (1,037 lines of fixture) is imported by `catalog.ts`, `public-catalog.ts`, `public-providers.ts`, and `app/page.tsx` (`providers`). | Move it to `scripts/fixtures/` and import it only from fixture mode and tests. Add an ESLint `no-restricted-imports` rule for `src/app/**` and `src/components/**`. |
| C7 | Magic numbers and copy live in components: `SORTS`, the workloads list, the recommended-score weights. | Move to `src/lib/catalog/config.ts` with tests. |
| C8 | Footer year is hard-coded to "© 2026". | Derive it from the snapshot date. |
| C9 | The nav has only Catalog and Compare. Guides, Methodology, and Providers are hidden. The nav reads as a segmented toggle, not as navigation. | New IA (Part D). |

### B5. Testing and CI (P1)

- 158 scripts, 165 npm scripts. **50 scripts assert on source text** with `readFileSync("src/...")` and regex. Example: `scripts/check_home_polish.ts` asserts the home page contains "The details we never hide". The current page says "The facts you need to choose", so **this check fails right now**. These scripts block copy changes and prove nothing about behaviour.
- CI (`.github/workflows/ci.yml`) runs audit, data check, content checks, lint, and build. It does **not** run `remediation:check` or any runtime or e2e test.
- There is no unit test runner, no Playwright, no axe in the dependency tree. The runtime checks drive Chromium over raw CDP by hand (`check_viewport_theme_matrix.ts`).

**Target:** Vitest for `src/lib` and `src/db` logic, Playwright for e2e, visual snapshots, and `@axe-core/playwright`, and fewer than 15 npm scripts (`dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `db:*`, `data:check`, `release:check`). Delete source-grep checks and keep the data/DB integrity checks as Vitest suites.

### B6. Visual and UX critique (screenshots, 2026-09-28)

**Home (desktop)**
- The hero left column is half empty: the headline sits at the top and the CTAs are pushed ~220 px down by `lg:mt-auto`. The eye has no path from promise to action.
- "314 offers · 41 providers" in 12 px muted mono is the strongest proof on the page, and it's the smallest text.
- The marquee opens with a half-faded "20i" and then sorts alphabetically. "A few you will recognize" is followed by names most people won't recognise.
- The facts section is 4 + 3 icon-title-sentence items, which is exactly the "equal feature cards" anti-reference without borders.
- The footer is airy but empty: link rows have 36 px gaps, there's no brand line, and there's no newsletter or updates hook.

**Catalog (desktop)**
- Toolbar controls use four different heights and type sizes (Filters 44 px, search 32 px with a larger font, the select, the segmented control).
- Filter rail headings mix 12 px bold ("Filters"), 13 px semibold ("Price"), and 15 px regular ("Trustpilot", "Workload").
- "Reset" shows in pale crimson even when no filter is active.
- Every row repeats a full crimson "Get deal" button, so a column of 25 identical red blocks dominates the page and pulls attention away from price. The contract keeps crimson for the primary action, but when every row has one, nothing is primary.
- The Term and Hourly columns fall off the visible table at 1440 px.
- Missing hierarchy: price, the decision number, carries the same visual weight as CPU and RAM.

**Offer page**
- The strongest element is the crimson price. Everything below it is small, grey, and generic. Most pages then say "No reviewed … available yet" twice.
- Details are collapsed by default under "Open only what you need", so the evidence that justifies trust sits behind three clicks.
- There's no cost-over-time view (12 and 36 months, renewal), no cross-provider alternatives, and no "who this is for".

**Compare (empty)**
- A dashed-border grey box with a centred scale icon offset to the left. It gives no suggested starting set ("Compare the 3 cheapest 4 GB plans").

**Mobile catalog**
- Cards are clean, but the full-width Compare + Get deal pair repeats on every card, and each card spends ~40% of its height on actions.

---

## Part C — Brand identity: "Highlighter" (bold new identity, chosen 28 Sep 2026)

> Supersedes the earlier "Receipts / crimson" proposal. The owner chose a **bold new identity** with a lowercase wordmark. Everything below is built and lives in [`brand/`](brand/README.md). The rulebook is [`brand/BRAND.md`](brand/BRAND.md) and the tokens are [`brand/tokens/tokens.css`](brand/tokens/tokens.css). Open [`brand/mockups/index.html`](brand/mockups/index.html) to click through every redesigned screen.
>
> **Contract gate:** `docs/product/PRODUCT_CONTRACT.md` and `DESIGN.md` still say "IBM Plex + restrained crimson". Its change rule requires updating the contract *before* any of this ships (Task 3.0). Until then the identity is approved design work, not live product.

### C1. Positioning (unchanged in substance, sharper in words)

- **Idea:** *We read the fine print.*
- **Tagline:** *We read the fine print. You pick the server.*
- **Promise:** See what a server really costs before you pay for it.
- **Category:** independent VPS price research. Not a directory, not a listicle.
- **Enemy:** the headline price. IONOS VPS M+ is advertised at $4, but over three years it averages **$10.42/mo** ($4 for 3 months, then $11 on a 1-year contract). Hostinger KVM 1 is advertised at $6.49 but costs **$155.76 on day one** and renews at **$11.99**.
- **Proof pillars** (at least one on every page): the **3-year real price**, **the catch**, **dated evidence**, **money-blind order**.

### C2. Why this identity wins the category

| Competitor colour territory (checked 28 Sep 2026) | |
|---|---|
| DigitalOcean cyan/blue, Vultr blue, OVHcloud blue, Contabo blue, IONOS blue, Hostinger purple, Hetzner red, Linode green, AWS orange | **No one owns volt/chartreuse.** A volt highlighter over ink is instantly ownable, and it *is* the product metaphor (highlighting fine print). |

The identity is loud in colour and type, and strict in behaviour: volt appears in at most three places per screen and never as text on white.

### C3. The system (full detail in `brand/BRAND.md`)

| Element | Decision | File |
|---|---|---|
| **Mark: "the Pick"** | Ink tile (radius 23.4%) with three rack units. The middle unit is pulled out 22% and filled volt. It reads as a server, a list, and your choice. Hand-tuned for 16 px. | `brand/logo/mark.svg` (+ on-dark, volt, glyph, favicon, app icon) |
| **Wordmark** | `bestvpsforme`, Mona Sans Wide ExtraBold, −2.8% tracking, HarfBuzz-kerned, outlined. A volt highlighter swipe behind **forme** ("for me"). | `brand/logo/wordmark-*.svg`, `lockup-*.svg` |
| **Colour** | Ink 950 `#0E1116`, Paper `#FFFFFF`, Volt 400 `#D4FF3A`, Vermilion 500/700 `#F4511E`/`#B53A12`, Signal 700 `#0B7A4C`, Night `#0A0C10`. Proportion 70/20/≤8/≤2. Every text pair is AA-checked (table in BRAND.md §3.4). | `brand/tokens/tokens.css` |
| **Type** | Mona Sans (OFL, wdth 75–125, wght 200–900) for display, UI, and body. Geist Mono (OFL) for table numbers, receipts, and stamps. Hero numbers use Mona Sans Wide (mono spacing looks gappy above 80 px). | `brand/fonts/` |
| **Devices** | Highlighter swipe · catch mark (wavy vermilion underline) · stamp (dated pill) · sticker (ink outline + 6 px hard shadow, one per page) · rack illustration · tags | `brand/mockups/brand.html` |
| **Motion** | 140/200/320/520/640 ms, `ease-out (.22,1,.36,1)`, a CSS `linear()` spring, and four named springs for video | `tokens.json → motion` |
| **Voice** | Short, dry, numbers first, always dated. Banned: best, #1, deal, exclusive, live price. | BRAND.md §9 |
| **Third-party marks** | Provider logos unmodified in a white tile. Trustpilot shown as plain text (no logo or stars) until there's an agreement. | BRAND.md §10 |

### C4. Built assets (all in `brand/`)

- [x] Logo system: 16 SVGs generated by `brand/logo/build_logo.py` (wordmark outlined from the font), plus PNGs at 16–1024 px and 2000 px lockups
- [x] Tokens: `tokens.css` (web) and `tokens.json` (Remotion/Figma), light and dark
- [x] Mockups: home, catalog, offer, compare, provider, guide, methodology, mobile, brand sheet, gallery (`brand/mockups/`)
- [x] Marketing kit: OG home, OG offer template, social square, social story (`brand/marketing/`, PNGs in `png/`)
- [x] Video brief: storyboard, VO script, Remotion architecture, six key frames (`brand/video/`)
- [x] Previews: 20 PNG screenshots, desktop/mobile/dark (`brand/previews/`)
- [ ] Integrated into the Next.js app (Phases 3–5)
- [ ] Remotion project scaffolded and rendered (Phase 8)

---

## Part D — Full UI remake specification

Section numbers here are written **§D0–§D12** when cited elsewhere, to keep them apart from the data findings D1–D14 in Part B. The mockups in `brand/mockups/` are the visual source of truth. This part is the build spec behind them, detailed enough to implement without re-deciding anything. Measurements are CSS px at 1440 × 900 unless stated. Every token referenced is in `brand/tokens/tokens.css`.

### D0. Principles for the remake

1. **Same jobs, fewer steps.** The flows stay the same: scan → filter → pick → compare → leave. Nothing that works today gets harder, and the catalog table stays the default.
2. **One honest number first.** The 3-year real price is the largest figure wherever a plan appears. The advertised price appears struck through only when it differs.
3. **The catch is never more than one glance away.** It has a column in the catalog, a card on mobile, a box in the offer hero, and a row in compare.
4. **One hero device per view.** One highlighter swipe per heading, one sticker per page, volt in at most three places.
5. **Unknown looks unknown.** `—` in tables (with a `title="Not published"`), "Not published" in cards and specs, in `--fg-subtle`. Never 0, never "None".
6. **Disclosure before the first paid link** on every commercial surface.

### D1. Global shell

#### D1.1 Navigation bar (`SiteHeader`, server component with client islands)
- Sticky, `height: var(--nav-h)` = 64 px (58 px under 640 px). Background `color-mix(var(--bg) 96%)`, 1 px bottom border. No blur, no shadow.
- Container: `--container-wide` (1440), gutters `--gutter`.
- Left: horizontal lockup, 30 px tall (26 px mobile). Links to `/`. Swaps to the dark lockup when `data-theme="dark"`.
- Links (≥ 1024 px): **Plans** `/catalog` · **Compare** `/compare` · **Providers** `/providers` · **Guides** `/guides` · **How we check** `/methodology`. Each link is 36 px tall with 12 px padding, Mona Sans 580 14.5 px at 104% width, `--fg-muted`. Hover: `--fg` + `--bg-muted` pill. The current page gets `aria-current="page"` and a 3 px ink bar flush with the bottom border.
- Search trigger: a 300 × 40 pill, `--bg-muted`, placeholder "Search 314 plans, 41 providers…" (live counts), `⌘K` keycap. Opens `CommandPalette`. Hidden under 1024 px (a search icon button replaces it).
- Right: `Compare (n)` line button (34 px) with a volt count badge (Geist Mono 700 11.5 px), then the theme toggle (40 px icon button, `aria-label="Switch to dark theme"`).
- Mobile (< 1024 px): logo · compare button · theme · menu button (44 × 44) opening a full-height `Sheet` with the five links at 24 px, plus search.
- Keyboard: `/` and `⌘K`/`Ctrl+K` open search (not while typing in an input). Skip link "Skip to content" as the first focusable element.

#### D1.2 Disclosure bar (`DisclosureBar`)
- On offer, provider, compare, and any page with a paid link, directly under the nav: 36 px min height, `--bg-subtle`, 13 px text. "**This page has an affiliate link.** If you buy through it we may earn a commission. It never changes the order. How we check".
- On the catalog it sits inline above the table (a 13.5 px line with an info icon), so the sticky header stays one bar.
- `role="note"`, `aria-label="Commission disclosure"`. It is never dismissible (FTC "clear and conspicuous").

#### D1.3 Footer (`SiteFooter`, server)
- Ink 950 band, always dark in both themes.
- Grid `1.4fr repeat(4, 1fr)`, 80 px top padding. Column 1 has the dark lockup (34 px), the lede "Independent VPS price research. We read the fine print so you can pick the server.", and a snapshot stamp. Columns: Product (All plans, Compare, Providers, Updates) · Research (How we check, Guides, Dataset, Report a correction) · Company (About, Brand kit, email) · Legal (Privacy, Terms, Affiliate disclosure).
- Bottom row: © year from the snapshot date, "Provider names and logos belong to their owners.", and the disclosure sentence.
- A giant outlined wordmark (`wordmark-dark.svg`) spans 100% width and bleeds 2.2% off the bottom edge. It's decorative: `aria-hidden`, empty alt.

#### D1.4 Command palette (`CommandPalette`, client)
- Native `<dialog>` 640 px wide, radius 20, `--sh-pop`, with a 42% ink backdrop.
- Input 60 px tall at 18 px text. Groups: Quick filters (presets such as "Cheapest 4 GB real price", "EU only, under $10"), Providers (logo + plan count), Plans (top matches, with real price on the right), Guides.
- `role="combobox"` + `listbox`, arrow-key navigation, Enter opens, Esc closes and returns focus to the trigger. Results come from a prebuilt server index (JSON of id, name, provider, price) fetched on first open (< 30 KB gzip).
- Analytics: `search_open`, `search_select { kind }`.

#### D1.5 Compare tray (`CompareTray`, client)
- Fixed and centred, bottom 20 px, ink pill (`--r-full`), `--sh-pop`. Contents: "**2** of 4 picked" (the count in volt Geist Mono), four 36 px slots (dashed when empty, provider tile when filled), and a volt "Compare →" button.
- Appears with a spring when picks > 0 (`transform var(--d-slow) var(--ease-spring)`). Hidden with `hidden` + translate when the count is 0. Under 640 px it spans the full width (12 px insets, radius 22) and the slots are hidden.
- State lives in the URL: `/compare?p=a,b,c`, mirrored to `localStorage` only as a restore hint. `aria-live="polite"` announces "Hostinger KVM 1 added. 2 of 4 picked."
- A 5th pick shows an inline toast, "You can compare up to 4. Remove one first." It doesn't fail silently.

#### D1.6 Theme
Inline head script (Task 1.5) with `data-theme="light"` as the default. The toggle uses `useLayoutEffect` to re-apply. Dark is a full twin: tokens swap, and components never hard-code colours. The sticker switches its outline to volt in dark mode.

### D2. Home `/` (mockup: `brand/mockups/home.html`)

Order, spacing, and content. Section padding is `clamp(64px, 9vw, 136px)`.

1. **Hero** (grid `1.12fr / .88fr`, gap `clamp(40, 5vw, 88)`, vertically centred)
   - Meta row: stamp "Checked {snapshotDate}" + eyebrow "{plans} plans · {providers} providers · 0 paid placements".
   - H1 `d-2xl` (56–112 px, wide 125%, 800, −4.5%): "We read the **fine print.**" (highlighter swipe animates on load) with line 2 "You pick the server." in `--fg-muted` at weight 720. `max-width: 12ch`.
   - Lede `b-lg` 19 px, max 46ch.
   - **Mad-lib search** in a `--bg-subtle` card, radius 24: "I'm building [a Docker stack ▾] and want to pay under [$10 ▾] a month, hosted in [Europe ▾]." The selects are underlined 2.5 px ink, 720 weight, with a custom chevron. The CTA is a volt `btn--lg`, "Show {n} plans →", where n is **computed live** from the publication (16 for the default combination on 28 Sep). The secondary button is "Browse all {plans}". Submitting navigates to `/catalog?workload=docker&max=10&region=eu`.
   - Promise row, 13.5 px with icons: "Commission never changes the order" · "Affiliate links labelled" · "Unknown shown as unknown".
   - **Price X-ray card** (sticker, radius 24, padding 24): provider tile 64 + "Hostinger KVM 1" + a spec line in mono, and a segmented toggle **The ad / Real price** (default Real). Real mode: "$8.32" `n-2xl` + "/mo", a volt tag "3-year real price", then dashed receipt lines (Advertised ~~$6.49/mo~~, Due today · 24 months upfront $155.76, Renews at · from month 25 $11.99/mo, 3-year total $299.64), then a catch box. Ad mode: "$6.49 /mo*" with "*Terms apply. Switch to Real price to read them." Footer: source line + "See the plan →" ink button. A rotated ink pin "**+85%** at renewal" hangs off the top-right corner.
   - The X-ray plan is chosen by the editor in admin (`homeXrayOfferId`) and must have a catch and a real price ≥ 20% above the advertised price. If none qualifies, the card falls back to the cheapest 4 GB plan without the toggle.
2. **Provider strip**: a full-width bordered band, "Prices read straight from the source at", then 9 provider chips (tile 28 + name), ordered by plan count and cropped by breakpoint (9 / 7 / 4 / 2). Colour logos, unmodified. No marquee.
3. **Anatomy of an ad** (grid `.9fr / 1.1fr`): copy on the left (eyebrow, `d-lg` "The ad says $4. The contract says **$10.42.**", lede, a numbered 1–3 list). On the right, a neutral mock ad (IONOS tile, huge "$4*", a grey "Get started" button, 10.5 px fine print) with three vermilion leader-line notes ("$4 only for months 1–3", "12-month contract", "then $11/mo") and a volt sticker verdict "Our 3-year real price $10.42/mo". The data comes from the X-ray-eligible plan with the biggest gap. On mobile the notes stack under the ad.
4. **Market chart**: eyebrow "The market, {date} snapshot", `d-md` "What 4 GB of RAM really costs.", a legend, and a strip plot of every 4 GB plan (3 lanes, 6 px dots, volt for the cheapest quartile, dashed median line with a label) in a radius-24 bordered card. Below it, four stats in `n-xl`: price gap ×, median, "plans that need a 12- or 24-month commitment" (43), "plans where IPv4 costs extra" (40). All come from `getSnapshotStats()`.
5. **Jobs grid** "What are you building?": 6 tiles in 3 columns (2 on tablet, 1 on mobile), radius 24, padding 24. Each has a title (21 px, 112% width), a one-line description, a mini rack (the pick slides further on hover), and a footer with "{count} plans · {ram}+" and "from $x". Hover lifts 2 px and adds `--sh-3`. Each links to `/catalog?workload=…`.
6. **Method panel** (ink, radius 32, padding `clamp(48, 6vw, 88)`): eyebrow, `d-lg` "Commission never moves a plan.", a giant volt "0" (136 px wide 800) + "paid placements, sponsored slots or 'partner picks'.", a volt CTA "Read the method", and three numbered steps on the right (Geist Mono volt numbers, hairline separators).
7. **Guides**: 3 cards (`1.3fr 1fr 1fr`). The first is volt-filled with an ink outline (feature), and the rest are outlined. Each has an eyebrow (topic · minutes), title, dek, and date or stamp.
8. **Final CTA band**: volt, radius 32, inset ink outline. `d-lg` "Stop guessing. Start comparing." + ink `btn--lg` "Compare {plans} plans →".
9. Footer (D1.3).

Reveal: sections get `data-reveal` (fade + 14 px rise, 640 ms, once). Headline swipes use `data-animate`. All of it is off under reduced motion.

### D3. Catalog `/catalog` (mockup: `brand/mockups/catalog.html`)

Layout: a CSS grid of `288px` rail + `1fr` main, filling the viewport under the nav. The rail is sticky with its own scroll (`height: calc(100dvh - nav)`).

#### D3.1 Filter rail (`FilterRail`, client, URL-bound)
- Header: "Filters" (17 px, 700, 112%) and "Reset {n}" (only when n > 0).
- Groups are separated by hairlines with 20 px padding. Group titles are 13 px 650 with a right-aligned meta in mono.
  1. **Real price / month**: a 14-bar histogram of the current result set (ink bars for the selected range, `--ink-200` otherwise; volt in dark) above a 3 × 2 grid of **price bands** (`<$5 <$10 <$25 <$50 <$100 Any`), 36 px tall, radius 10, Geist Mono 600 13 px. This replaces the linear slider, which the $2,765 outlier stretched.
  2. **Memory**: bands `1 2 4 8 16 32+ GB` (a minimum).
  3. **vCPU**: `Any 2+ 4+`.
  4. **Honesty filters** (new, and a differentiator): switches for *No long contracts* (term ≤ 1 month), *Flat renewal price*, *IPv4 included*, *Trustpilot 4.0+*. Switch 38 × 22, and the thumb turns volt when on. `role="switch"` + `aria-checked`, and each label is clickable.
  5. **Where it runs**: region bands (Europe, N. America, Asia, Oceania), expanding to a country list with flags and counts.
  6. **Provider**: a search field, then the top 4 providers by count with tile + name + count, and "Show all 41".
- Every change updates the URL (`router.replace` with `scroll: false`) and the results server-render on reload (Task 1.7).
- Mobile: the rail becomes a bottom `Sheet` (90 dvh, drag handle, focus trap) opened from a sticky chip row under the toolbar ("Filters · 2", "Price", "RAM", "Region", "Honesty", "Sort").

#### D3.2 Toolbar and summary
- H1 as a sentence: "**11 plans fit.**" (44 px wide 800). The sub-line restates the filters in words ("4 GB+ · under $25. Sorted by 3-year real price, the same formula for every plan.").
- Tools: a 280 × 40 search field with a `/` keycap; a Sort select (Real price low→high, Value score, Most RAM per $, Trustpilot, Due today); and a Table/Cards segmented control.
- **Summary strip** (`--bg-subtle`, radius 16): From / Median / Catches in mono, then a mini strip plot of the result set with the median dashed. It updates with filters.
- Active chips: volt-soft pills with an ink outline and ×, plus "Clear all".
- Disclosure line (D1.2).

#### D3.3 Table (`OfferTable` + `OfferRow`)
- `table-layout: fixed`. Columns: Pick 48 · Plan 25% · 3-yr real price 150 (right-aligned, sorted by default) · CPU·RAM·Disk 200 · Trustpilot 104 · The catch (auto) · Action 124.
- Header: sticky at `top: nav-h`. 11.5 px, 620 weight, uppercase with +6% tracking, `--fg-subtle`. The sorted column is `--fg` with an arrow. Sortable headers are `<button>`s with `aria-sort` on the `th`.
- Row (min 72 px, 14 px padding):
  - Pick: a 20 px custom checkbox that fills volt with an ink check. `aria-label="Pick {provider} {plan} to compare"`.
  - Plan: provider tile 40 + plan name (650 14.5 px) + a sub-line with provider name and up to 4 flags (16 × 11) + "+n". The whole cell is a link to the offer.
  - Price: real price in Geist Mono 620 20 px with "/mo" small. Below: "~~$6.49~~ advertised" when it differs, else "$60.00 due today" when due today > real, else "same every month".
  - Specs: `2 vCPU · 4 GB · 40 GB NVMe` in mono 13.5 px with units in 11.5 px sans. Transfer sits on its own line in 12 px `--fg-subtle`. Unknown values render `—` with `title="Not published"`.
  - Trustpilot: plain text "4.7" in mono with "66k reviews" below (D-5). No stars or logo.
  - Catch: a vermilion dot + sentence (max 46ch, wraps to 3 lines). When the reviewed record says there's none: a signal dot + "No catch found in the source". When there's no review yet: "Not reviewed yet" in `--fg-subtle`. Absence is never shown as "no catch".
  - Action: a line button "Visit ↗" (34 px) that turns volt on row hover or focus-within, with "Affiliate link" or "Direct link" (11 px) under it. `rel="sponsored nofollow"` on affiliate links.
- A picked row gets a 13% volt tint and a 4 px volt inset rail on the left.
- The row click opens the offer (`Link` overlay, with Cmd/Ctrl+click honoured). Controls stop propagation.
- Pagination: `CATALOG_PAGE_SIZE` (24) rows server-rendered, then "Show more" (a button with `aria-controls`). The URL records `page`. (Set to 24 on 30 Sep to keep page-one HTML under 150 KB.)
- Density toggle (Comfortable 72 px / Compact 52 px) in the column menu, stored in `localStorage`.

#### D3.4 Mobile cards (`OfferCard`, < 760 px)
Radius 18, padding 16. Top: tile + plan/provider·Trustpilot + real price (right). Then spec chips (`--bg-muted` radius 8 in mono), the catch in `--catch-fg` 13 px with a dot, and an actions row (a Pick checkbox with a 44 px target, "Visit ↗" 44 px). Picked: ink border + volt inset rail.

#### D3.5 States
- **Loading** (client refetch): rows keep their height and the price cells pulse with a rack-style skeleton (three bars, LED dots blinking 1.2 s), with a 150 ms show-delay.
- **No matches**: rack illustration + "No plan fits all of that." + the filter that removed the most results ("Trustpilot 4.0+ removed 212 plans. Remove it?") + Clear all.
- **Publication unavailable**: the existing fail-closed copy, restyled with the stamp "No active snapshot" and a retry button.
- **Outbound unavailable**: an inline alert above the table with a request id and a dismiss button (the existing behaviour, restyled).

### D4. Offer `/offers/[id]` (mockup: `brand/mockups/offer.html`)

- Disclosure bar (D1.2) + breadcrumb (Plans › Provider › Plan, chevrons, 13.5 px).
- **Hero** (grid `1fr / 440px`, gap `clamp(40, 5vw, 80)`):
  - Left: provider tile 88 + "Provider · HQ {country}" + a Trustpilot text line; H1 plan name at `d-2xl`; a spec line in Geist Mono 17 px; tags (stamp "Price checked …", catch tags, ok tags such as "IPv4 included"); a verdict pair in 2 columns: **Good for** (signal heading, outlined card) and **Watch out** (vermilion-bg card with catch marks on the exact phrases). Either card is omitted when its editorial note is missing.
  - Right: the **Receipt**, a sticker card sticky at `nav + 20`. Volt tag "3-year real price" + "USD", `n-2xl` value, dashed lines (Advertised struck, Due today · term, Renews at · month n+, Setup fee *or "Not published"*, 3-year total `n-md`), a volt `btn--lg` "Visit {provider} ↗", a line button with a checkbox "Pick for compare / Picked for compare", and the fine print "**Affiliate link.** We may earn a commission if you buy. It never changes the order, and the price you pay is the same."
- **Cost over time**: `d-md` "What you'll actually spend." + legend + an SVG step chart of cumulative cost over months 0–36 (the real line solid 3.5 px ink, the ad-implied line dashed, a volt tint over the renewal period). Annotations: "Day 1: $155.76 due", "Month 25: renews at $11.99", the total, and the ad total. Computed by `costSeries(offer, 36)`. Under 760 px the chart scrolls horizontally at 760 px min width. It has a text alternative (`role="img"` + `aria-label` with the numbers).
- **What's in the box**: a 4 × 2 spec grid (radius 24, hairline dividers). Label 11.5 px uppercase; value in Geist Mono 620 24 px; note 13 px. Unknown values use "Not published" in 17 px sans `--fg-subtle` plus a hint ("Confirm at checkout").
- **Evidence**: three `--bg-subtle` cards, each led by a stamp: source + date, confidence + why, and "Spot an error?" linking to `/corrections?offer={id}&field=`.
- **Alternatives**: "Same {ram} GB, lower 3-year price." A table of up to 3 plans from *other* providers (same RAM tier, lower real price, sorted by real price) with a "You save −$x over 3 yrs" column in signal mono, then "Other {provider} plans" (siblings from the publication, Task 1.1).
- Mobile: the Visit button in the receipt is hidden and replaced by a sticky bottom bar (real price + label + volt Visit button, with safe-area padding).
- `generateMetadata` + `opengraph-image.tsx` using the OG offer template (`brand/marketing/og-offer.html`).
- JSON-LD: Product + BreadcrumbList, escaped, with no `availability` claim.

### D5. Compare `/compare` (mockup: `brand/mockups/compare.html`)

- Server-rendered from `?p=id1,id2,id3,id4`. The client only handles removal, reordering, and copy-link.
- Head: eyebrow "Compare · 3 of 4", `d-lg` "Three 4 GB plans, **side by side.**" (the title adapts: "{n} plans…" or "{ram} GB" when the RAM matches). Tools: a segmented **All rows / Only differences** control and a share pill showing the canonical URL + ink "Copy link" (copies, then announces "Link copied").
- Grid: a `220px` label column + one column per plan (max 4) + an "Add a plan" dashed column with a suggestion when fewer than 4. The column heads are sticky under the nav: tile, name, provider, remove ×, and a Visit button (volt only for the winning column) with its link label.
- Sections: **Price** (3-yr real price as a big mono number, Due today, Renewal, 3-year total), **Hardware** (vCPU, Disk, Transfer, Backups), **Trust** (Trustpilot with review count, The catch).
- **Best in row**: the value gets the volt highlighter and a "BEST" micro-label in `--accent-text`. Worst-in-row price values turn `--catch-fg`. Ties go to the higher review count and are marked "tie". Rows where every value is equal hide under "Only differences".
- Verdict cards under the grid: "Lowest 3-year cost" (volt card), "Most disk", "Most reviewed", generated from the data with plain sentences ("$143.04 less than Hostinger over three years…").
- Empty state (0 plans): rack illustration + "Pick up to 4 plans." + three preset buttons ("Cheapest 2 GB", "Best 4 GB value", "EU only under $10") that open prefilled comparisons.
- Mobile: the grid scrolls horizontally with a sticky label column; plan columns are 230 px with scroll-snap.

### D6. Providers `/providers` and `/providers/[slug]` (mockup: `provider.html`)

- Index: a 4-column grid of provider cards (tile 64, name, HQ flag, plan count, real-price range, Trustpilot text), with filters for region and "has flat renewals". Sorted by plan count by default and A–Z optionally.
- Detail hero: tile 104 + eyebrow "Provider · HQ {country}" + `d-xl` name + an editorial lede (2 sentences, from admin). Right side: stamp + "{domain} ↗" line button.
- Five-number strip in a hairline band: Plans · Real price range · Ad price "from" (with its caveat) · Trustpilot · Locations.
- Three cards: **Strong at** (signal) · **Watch out** (vermilion bg) · **Good to know**. Each is omitted when empty.
- The plans table reuses `OfferTable`. The rail appears only when there are more than 12 plans.

### D7. Guides and articles (mockup: `guide.html`)

- Index: a volt feature card + list rows (topic eyebrow, title, dek, read time, updated date), filterable by topic.
- Article: a header band (eyebrow, `d-xl` title with one highlighter phrase, a 22 px dek at max 54ch, a byline with the "b/" avatar, author, and stamp). A 3-column layout: a sticky TOC at 220 px (numbered, current section highlighted via IntersectionObserver), prose at 720 px (19/1.7, h2 at 34 px wide 118%), and a sticky aside card ("Skip the maths." + catalog CTA).
- Prose components: `Callout` (catch variant: vermilion-bg + warn icon), `Formula` (ink block, mono, volt variables), `PlansMentioned` (a live table from the publication with snapshot date), and `catch-mark` for inline fine print. Links are underlined with a 2 px volt-600 line.

### D8. How we check `/methodology` (mockup: `methodology.html`, shown in dark)

- Hero: `d-2xl` "Receipts for **every number.**" + a lede.
- A four-rule strip (01–04 in volt mono): Order never uses money · Unknown stays unknown · Every fact is dated · Links are labelled.
- Parts in a 320 px sticky heading + prose layout: **The 3-year real price** (formula block, currency and VAT rules), **How "Value" is ordered** (weights table with volt bars, rendered from `score.ts` constants so page and code can't drift), **What we never do** (struck-through list with vermilion "never" tags), then Corrections and Changelog.

### D9. System pages
- 404: rack with the pick missing + "This plan isn't in the current snapshot." + search field + links to Plans and Updates.
- Error: "Something broke on our side." + request id in mono + retry. No stack traces.
- `/updates`: a timeline of snapshots, each a stamp (date) + counts added/removed/changed + a link to the diff.
- Admin keeps its own CSS modules but adopts the tokens (fonts, colours, radii) in Phase 5, so it matches without a redesign.

### D10. Motion map

| Interaction | Motion | Duration / easing |
|---|---|---|
| Heading highlight (first view) | `background-size` 0 → 100% | 520 ms `ease-out` |
| Section reveal | opacity 0 → 1, y 14 → 0 | 640 ms `ease-out`, once |
| Button press | scale .97 | 140 ms |
| Volt button hover | translate(−1, −1) + 3 px ink offset shadow | 140 ms |
| Pick checkbox | fill + check draw | 140 ms |
| Tray appear/disappear | translateY 140% ↔ 0 | 320 ms spring |
| Switch thumb | translateX 16 | 200 ms spring |
| Job tile hover | lift 2 px, rack pick +6% | 200 ms |
| X-ray toggle | crossfade value, lines stagger 30 ms | 200 ms |
| Catalog → offer | `<ViewTransition>` morph of tile + plan name | browser default, reduced-motion off |
| Palette open | opacity + scale .98 → 1 from the trigger origin | 160 ms |

### D11. Accessibility acceptance (applies to every surface)
- Contrast pairs as in BRAND.md §3.4. Volt is never text on paper.
- Focus ring: 2 px paper + 2 px ink + 3 px volt halo (`--focus-ring`), never removed.
- Targets: 44 × 44 on touch, 24 × 24 minimum on desktop (checkboxes have 44 px label hit areas).
- Tables use real `<table>`, `<th scope>`, and `aria-sort`. Charts have text equivalents. Flags always have country names available.
- Every animation has a reduced-motion path. No content depends on hover.
- axe: zero serious or critical issues on every route in both themes (Playwright, Phase 2).

### D12. Analytics events for the new UI
`xray_toggle {mode}`, `madlib_submit {workload, max, region, result_count}`, `honesty_filter {name, on}`, `price_band {band}`, `pick {offer_id, source}`, `tray_open`, `compare_share`, `catch_expand {offer_id}`, `palette_select {kind}`. All go into `docs/product/ANALYTICS_CONTRACT.md` before they ship. None carry personal data.

---

## Part E — Design system and frontend architecture

### E1. CSS architecture

```
src/styles/
  tokens.css        primitives + semantic roles + dark twin      (@layer base)
  base.css          element defaults, focus, selection, prose    (@layer base)
  components/*.css  one file per component, or co-located modules (@layer components)
src/app/globals.css @import "tailwindcss"; @import "../styles/*.css";
```

- All custom CSS lives inside `@layer base` or `@layer components`, so Tailwind utilities override it predictably (fixes R5).
- Tailwind `@theme` exposes only semantic tokens: `bg-surface`, `text-ink-muted`, `text-step-14`, `rounded-control`.
- Add an ESLint rule or CI grep that fails on arbitrary values like `text-[` / `h-[` in `src/components`.
- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`. Delete 480/700/760/860/900.

### E2. Component inventory (target, mapped to mockup classes)

| Component | Mockup class | Replaces | Props / notes |
|---|---|---|---|
| `Button` | `.btn--volt/ink/line/ghost/icon`, `--sm/--lg` | `.ui-button*` | `variant`, `size` (34/44/54), `asChild`; volt = the single commercial CTA per view |
| `Price` | `.price`, `.n-*` | scattered `money()` | `value`, `currency`, `period`, `size`, `strikeFrom?`; `aria-label` spells out the price ("8 dollars 32 per month, 3-year real price") |
| `Receipt` | `.xray__lines`, `.receipt` | offer hero box | `offer`, `horizon=36`; lines hide when null → "Not published" |
| `PriceXRay` | `.xray` | `HeroShortlist` | `offer`; ad/real toggle (`aria-pressed`) |
| `Stamp` | `.stamp` | "Checked …" strings | `date`, `label`, `icon`; renders `<time dateTime>` |
| `Tag` / `CatchTag` | `.tag--catch/ok/volt/line` | inline warnings | `tone`, children |
| `Highlight` | `.hl`, `.hl--thin` | — | `animate?`; reduced-motion safe |
| `CatchMark` | `.catch-mark` | — | inline fine-print flag |
| `ProviderMark` (server) | `.pmark` | `ProviderLogo` (client) | `provider`, `size` 28/40/64/88/104; local asset or monogram |
| `Spec` | `.spec3`, `.spec` | spec cells | `label`, `value: T \| null`, `unit`; null → "Not published" / `—` |
| `OfferTable` / `OfferRow` / `OfferCard` | `.dtable`, `.mcard` | `DealTable`, `DealCards`, `MobileOfferRow`, `MobileDealList` | one `OfferRowDTO` contract |
| `FilterRail`, `PriceBands`, `Histogram`, `HonestySwitch` | `.rail`, `.bands`, `.hist`, `.switch` | current 582-line `FilterRail` | URL-bound, split per group |
| `SummaryStrip`, `StripPlot`, `CostChart` | `.sumbar`, `[data-strip]`, `.chart` | — | pure SVG, server-rendered, `role="img"` + text alt |
| `MadLib` | `.madlib` | — | native `<select>`s in a sentence; submits GET |
| `CompareTray`, `CompareGrid` | `.tray`, `.grid-c` | `CompareBar`, `CompareDock`, compare page | URL state `?p=` |
| `CommandPalette` | `dialog.palette` | — | combobox/listbox APG |
| `SegmentedControl`, `Chip`, `Sheet`, `Switch`, `Checkbox` | `.seg`, `.chip`, `.switch`, `.check` | ad-hoc | APG keyboard patterns |
| `DisclosureBar`, `AffiliateLabel` | `.disclosure`, `.affil` | 10 px label | L1 |
| `Rack` | `.rack` | — | illustration, empty states, skeletons |
| `SiteHeader`, `SiteFooter` | `.nav`, `.footer` | `SiteChrome` (client) | server + islands |

### E3. Domain logic

- `src/lib/catalog/` gets `filter.ts`, `sort.ts`, `score.ts`, `query.ts` (parse/serialize), and `config.ts`. They are pure and covered by Vitest.
- A documented value score, for example `score = 0.45·priceRank + 0.25·ramPerDollar + 0.15·trust + 0.15·confidence − unknownPenalty`, published on `/methodology`. `featured` and any commercial field are banned from it by test (`analytics:ranking-check` becomes a Vitest property test).
- `Offer` type fields that can be unknown become `T | null` (`gpus`, `managed`, `backups`, `cashDueNow`, `commitmentMonths`). *Done by the continuation session for billing/management/backups/GPU (ledger).*
- New pure functions: `realPrice(offer, months = 36)`, `costSeries(offer, months)`, `snapshotStats(offers)`, `bestInRow(values, direction)`. Each needs Vitest cases for intro periods, upfront terms, renewals, extras, nulls, and ties.

---

## Part F — Repository cleanup

Measured 2026-09-28. **Nothing here runs without the owner's confirmation** (Phase 0 asks per group).

### F1. Untracked or ignored local junk (safe to delete from disk)

| Path | Size | Status | Action |
|---|---|---|---|
| `.next/` | 1.1 GB | ignored build cache | delete (regenerates) |
| `third design/` | 39 MB | ignored old experiment with its own `.next` + broken `node_modules` symlink | delete, or archive outside the repo |
| `tmp/` (PDF build scripts, `__pycache__`, renders) | 36 MB | ignored | delete |
| `research-app/` | 228 KB | ignored, duplicate CSV + static HTML | delete (CSV already in `data/`) |
| `tsconfig.tsbuildinfo` | 768 KB | ignored | delete (regenerates) |
| `.ralph/` | 20 KB | **untracked, not ignored**, agent loop state (`"active": true`, iteration 28/50) | delete and add to `.gitignore` |
| `.impeccable/` | 16 KB | ignored critique output | delete |

### F2. Tracked files to remove or move (needs a commit)

| Path | Why | Action |
|---|---|---|
| `output/` (3 PDFs + 3 MD, 780 KB) | Generated planning documents, not app code | Move to an external drive or `docs/archive/research/` (MD only). Remove the PDFs from git. |
| `public/{file,globe,next,vercel,window}.svg` | Next.js starter leftovers, unused | delete |
| 22 unused logo files: `buyvm.png`, `bwh.png`, `cherryservers.png`, `cherryservers.svg`, `contabo.png`, `digitalocean.png`, `hetzner.png`, `hosthatch.jpg`, `hostinger.png`, `infomaniak.png`, `ionos.png`, `leaseweb.png`, `lightsail.png`, `linode.png`, `netcup.png`, `oracle.png`, `ovh.png`, `scaleway.png`, `upcloud.png`, `vultr.png`, `webdock.jpg`, `webdock.svg` | Not referenced from `src/` or `scripts/` | delete after the logo-normalisation pass (Phase 3) confirms each replacement |
| `public/og-default.svg` | Replaced by generated PNGs (R8) | delete in Phase 3 |
| `data/_expand_research.py` | One-off research helper | move to `scripts/research/` or delete |
| `docs/qa/**/*.jpg` (38 images, ~3.8 MB) | Screenshot evidence bloats git history | Keep the latest set as Playwright visual baselines under `tests/e2e/__screenshots__/`, delete the rest. Optionally move to Git LFS. |
| 50 source-grep scripts in `scripts/check_*.ts` + their npm scripts | Replaced by Vitest/Playwright (B5) | delete in Phase 2 after each replacement lands |
| `src/app/for-me/` | Legacy redirect | Move to a `redirects()` entry in `next.config.ts` |

### F3. Docs consolidation (32 root Markdown files → 5)

Keep in root: `README.md`, `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md`, plus the master roadmap `bigone.md`.

```
docs/
  product/     PRODUCT_CONTRACT.md, EDITORIAL_INDEPENDENCE.md, ANALYTICS_CONTRACT.md, CONTENT_GUIDE.md
  data/        DATA_QUALITY.md, DATA_REFRESH.md, publication-*.md
  ops/         DEPLOYMENT.md, RELEASE_RUNBOOK.md, BACKUPS.md, MONITORING.md, OPERATIONS_*.md,
               OPERATING_CHECKLIST.md, LAUNCH_CHECKLIST.md, PERFORMANCE_BUDGET.md, PRIVACY_OPERATIONS.md,
               DEPENDENCY_CADENCE.md
  growth/      GROWTH_KPIS.md, PARTNERSHIP_*.md, CONTENT_REVIEW.md, POST_LAUNCH_REVIEW.md
  archive/     APP_AUDIT_2026-08-31.md, REMEDIATION_PLAN.md, IMPLEMENTATION_PLAN.md, PROJECT_PROGRESS.md (66 KB)
  qa/          latest reports only
```

Update the links in `README.md` and in any `scripts/check_*` that read doc paths (for example `check_release_runbook.ts`, `check_launch_checklist.ts`) in the same commit, or delete those checks.

### F4. `.gitignore` additions

```gitignore
/.ralph/
/output/pdf/
/playwright-report/
/test-results/
```

---

## Part G — Phased roadmap

| Phase | Outcome | Size | Status (1 Oct 2026) |
|---|---|---|---|
| 0 | Clean repo, WIP committed, docs moved | S | Complete: Tasks 0.1–0.4 verified on `codex/resume-overhaul` |
| 1 | Contract-breaking bugs fixed (data, legal, SSR, CSS layers, **real renewal + currency data**) | M+ | **Complete (30 Sep):** 1.1–1.6, 1.8 verified earlier. **1.7 done** — one shared responsive result DOM replaces the duplicated desktop/mobile markup; page-one HTML is **109,008 bytes** (< 150 KB target) with a 24-row server page and a 20→24 mobile window (owner decision: page size 24 keeps the byte budget without losing features). **1.9 done** — renewal/due-today null unless reviewed; snapshot v5 carries 59 reviewed-term stamps, of which 43 survive the 1 Oct evidence quarantine (16 queued for owner correction in `docs/data/renewal-correction-queue-2026-10-01.*`). **1.10 done** — 106 EUR/GBP rows converted with dated ECB rates (31 Aug snapshot); production DB migrated + snapshot v5 published. |
| 2 | Real test harness, CI gate, source-grep checks retired | M | **Complete** — current gate: 334 tests / 64 suites; 532 browser checks across four profiles / 120 visual baselines in six projects; 77 owner-approved retirements total; 76 useful checks retained, zero direct application-source readers, 14 npm entries. CI configured and all component gates verified locally; remote Actions unrun (no push). |
| 3 | Brand foundations: contract update, tokens, fonts, logo, icons, OG from `brand/` | M | **Complete (30 Sep)** — D-8 contract committed (`c203d65`); tokens + `@theme inline` live; Mona Sans/Geist Mono WOFF2 via `next/font/local`; inline `Lockup/Mark/Wordmark`; branded favicon set + manifest; OG PNG routes for `/` and `/offers/[id]` verified rendering; 22 provider marks self-hosted (DDG favicon + CSP host removed); `ProviderMark`/`.pmark`; Trustpilot plain text. 262 unit tests at phase end (334 now), 54 regenerated baselines (120 now), all browser profiles green; catalog HTML 116,830 B. |
| 4 | Component system + shell + home + catalog to `brand/mockups` | L | **Complete (30 Sep)** — `SiteChrome` replaced by `SiteHeader`/`DisclosureBar`/`SiteFooter`/`CompareTray`; home and catalog rebuilt to the mockups incl. admin-picked X-ray (`site_settings` + migration 0014), filter rail, 24-row pagination. Verified on real data; audit corrections landed 1 Oct (X-ray eligibility gate, effective-price honesty, catch/editorial separation). |
| 5 | Offer, compare, providers, guides, methodology, system pages to mockups | L | **Complete (30 Sep), corrected 1 Oct** — all surfaces shipped; the 1 Oct audit correction pass restored the reviewed-price gate across offer/compare/provider surfaces, semantic compare table, mobile tray/buy-bar coexistence, providers-link ARIA, guide TOC tracking, dated `PlansMentioned`, and tightened test/CI coverage. |
| 6 | Content: catches, fit notes, X-ray pick, dataset stats | M (editorial) | Closed 7 Oct with evidence holds: 62 published, 38 documented drafts |
| 7 | Performance, caching, CSP nonce, launch polish, visual regression baseline | M | Not started |
| 8 | Marketing kit live + Remotion launch film and social series | M | Brief, storyboard, key frames, templates done; no Remotion project yet |

### Phase 0 — Cleanup

#### Task 0.1: Save work in progress

**Status (30 September 2026):** checkpoint saved. Fresh inspection found 40 modified tracked files, the terms route, four test suites, test fixtures, Vitest configuration, and untracked brand/planning assets. App and test/dependency changes are preserved in `4e15cec`; brand assets and progress/plan documents are preserved in a separate commit. All four required checks passed; see the progress ledger. This updates the stale 22-file scope without changing the approval gates. Exact proposed cleanup: [Task 0.2–0.4 approval scope](docs/progress/phase-0-cleanup-approval-2026-09-30.md).

**Files:** existing WIP under `src/`, `scripts/`, `next.config.ts`, `eslint.config.mjs`, `package.json`, `package-lock.json`, `tests/`, `vitest.config.mts`; then `brand/`, `bigone.md`, and `docs/progress/`.

- [x] **Step 1:** Run `git status` and `git diff --stat`. Review the WIP with the owner.
- [x] **Step 2:** Commit it as its own commit:

```bash
git add src scripts next.config.ts eslint.config.mjs package.json package-lock.json tests vitest.config.mts
git commit -m "Checkpoint catalog, filter, and terms work before overhaul"
```

- [x] **Step 3:** Save brand/planning assets in their own commit, then confirm `git status` shows only `.ralph/` (untracked).

#### Task 0.2: Delete local junk (F1). **Ask the owner first.**

**Status (30 September 2026):** complete. The owner explicitly approved deleting the seven Task 0.2 paths in this chat. They were removed through system Trash after automatic review rejected force-delete commands. The generated caches were subsequently rebuilt by verification. Homepage HTTP 200, all four required checks and the ignore rule passed. Tasks 0.3–0.4 retain their separate approval gates.

- [x] **Step 1:** Show the owner the F1 table and get an explicit yes.
- [x] **Step 2:**

```bash
gio trash -- .next "third design" tmp research-app tsconfig.tsbuildinfo .ralph .impeccable
```

- [x] **Step 3:** Add `/.ralph/` to `.gitignore`. Run `npm run dev` and confirm `/` returns 200.
- [x] **Step 4:** Commit `.gitignore`.

#### Task 0.3: Remove tracked leftovers (F2 first half). **Ask the owner first.**

**Status (30 September 2026):** complete. The owner explicitly approved Task 0.3's five starter SVGs, three PDFs, three Markdown moves, and replacement of the Finder page with a permanent config redirect. The two new behavioral Vitest cases failed before implementation and passed afterward. All four required checks, three affected legacy checks, and live HTTP 308/query-preservation checks passed. Task 0.4 remains pending approval.

- [x] **Step 1:** `git rm public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg`
- [x] **Step 2:** Remove the three tracked `output/pdf/*.pdf` files and move the three tracked `output/*.md` files into `docs/archive/research/`, preserving filenames and contents.
- [x] **Step 3:** Move the `/for-me` redirect into `next.config.ts`:

```ts
async redirects() {
  return [{ source: "/for-me", destination: "/catalog", permanent: true }];
},
```

then remove `src/app/for-me/page.tsx`. Updated `scripts/check_finder_archive.ts`, `scripts/check_product_contract.ts`, and `scripts/check_frontend_readiness.ts` to check the real Next.js config response instead of requiring the removed page. Added `src/lib/finder-redirect.test.ts` for the permanent redirect and query preservation.
- [x] **Step 4:** `npx tsc --noEmit && npx eslint src scripts && curl -sI http://127.0.0.1:3002/for-me | head -3` (expect 308 to `/catalog`).
- [x] **Step 5:** Commit: `Remove starter assets, generated PDFs, and page-based legacy redirect`.

#### Task 0.4: Consolidate docs (F3)

**Status (30 September 2026):** complete. The owner requested this next task after reviewing its 27-document scope. All documents moved with their contents preserved apart from reference paths; README is 40 lines and exposes the binding contract. All 39 local Markdown document links, 18 affected checks, 28 Vitest tests, typecheck, lint and build passed. Contract/design rules are unchanged.

- [x] **Step 1:** `git mv` each file into the F3 tree.
- [x] **Step 2:** Search for broken references with the grep tool: pattern `\b[A-Z_]+\.md\b` over `README.md`, `scripts/`, `src/`. Fix each path.
- [x] **Step 3:** Rewrite `README.md` to be ≤ 60 lines: what it is, how to run it, how to test it, where the docs live.
- [x] **Step 4:** Commit: `Move operating docs under docs/ and slim README`.

### Phase 1 — Contract and correctness fixes

#### Task 1.1: Stop reading the static fixture in production paths (D1, D3, C6)

**Status (30 September 2026):** verified. Migration 0013 adds nullable reviewed editorial facts and was exercised only on in-memory/disposable databases. Nineteen targeted tests pass, including schema round-trip, draft isolation, relative fixture-import rejection and the empty-publication homepage. Initial mapping regressions were reproduced in the previous continuation; new schema and guard regressions failed before their fixes. No production migration or editorial approval occurred.

**Files:**
- Modify: `src/lib/public-catalog.ts:40-83`
- Modify: `src/lib/catalog.ts` (remove the `offers` import, and make `getSpecBounds`, `siblingOffers`, `featuredOffers`, `getOffer`, and `availableOfferCount` take a `source` argument or delete them)
- Modify: `src/components/OfferDetail.tsx:28` (accept `siblings: Offer[]` as a prop)
- Modify: `src/app/offers/[id]/page.tsx` (load siblings from the publication)
- Modify: `src/db/repositories.ts` (add `listPublishedOffersByProvider(providerId)`)
- Modify: `eslint.config.mjs`
- Test: `src/lib/public-catalog.test.ts` (needs Vitest and `tests/fixtures/*` from Task 2.1; run Task 2.1 before Phase 1)

**Interfaces:**
- Produces: `listPublishedOffersByProvider(providerId: string): PublishedRow[]`, `OfferDetail({ offer, siblings }: { offer: Offer; siblings: Offer[] })`

- [x] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { mapPublishedRow } from "./public-catalog";
import { publishedRowFixture } from "../../tests/fixtures/published-row";

describe("mapPublishedRow", () => {
  it("never borrows editorial fields from the static fixture", () => {
    const row = publishedRowFixture({ offerId: "netcup-vps-500-g12", editorial: null });
    const offer = mapPublishedRow(row)!;
    expect(offer.catch).toBeNull();
    expect(offer.whyFit).toBeNull();
    expect(offer.featured).toBe(false);
    expect(offer.gpus).toBeNull();
    expect(offer.managed).toBeNull();
  });
});
```

- [x] **Step 2:** Run `npx vitest run src/lib/public-catalog.test.ts`. Expected: FAIL (catch is a fixture string, gpus is 0).
- [x] **Step 3:** In `mapPublishedRow`, delete `const known = offerMap[...]`. Map `catch`, `whyFit`, `niches`, `featured`, `backups`, `managed`, and `gpus` from `row.editorial` / `row.offer` columns, defaulting to `null` (or `[]` for niches). If the columns don't exist yet, add them to `offer_editorial` with a Drizzle migration (`drizzle-kit generate`) and follow the `drizzle-safe-migrations` skill.
- [x] **Step 4:** Update `src/lib/types.ts`: `catch: string | null; whyFit: string | null; gpus: number | null; managed: boolean | null; backups: boolean | null; cashDueNow: number | null; commitmentMonths: number | null;`. Fix every type error (`npx tsc --noEmit`) by rendering "Not published" through a single `Spec` helper.
- [x] **Step 5:** Add the ESLint guard:

```js
{
  files: ["src/app/**", "src/components/**", "src/lib/public-*.ts", "src/lib/catalog.ts"],
  rules: { "no-restricted-imports": ["error", { paths: [
    { name: "@/lib/offers", message: "Static fixture: use the published repository." },
    { name: "./offers", message: "Static fixture: use the published repository." },
  ] }] },
}
```

Fixture mode can import it through `src/lib/public-data-mode.ts` with a targeted `eslint-disable-next-line` and a reason.
- [x] **Step 6:** Run `npx vitest run && npx tsc --noEmit && npx eslint src`. Expected: PASS.
- [x] **Step 7:** Commit: `Map public offers only from the published snapshot`.

#### Task 1.2: Honest sorts (D6, D7)

**Status (30 September 2026):** Verified numeric bandwidth/hourly sorting, with unknowns last in both directions. Original red run and implementation are recorded in the 28 September ledger; fresh catalog tests pass.

**Files:** `src/lib/catalog.ts:141-173`, test `src/lib/catalog.test.ts`

- [x] **Step 1: Failing tests**

```ts
it("sorts bandwidth numerically with unknown last", () => {
  const list = [offer({ bandwidthTb: null }), offer({ bandwidthTb: 32 }), offer({ bandwidthTb: 4 })];
  expect(sortOffers(list, "bandwidth", "desc").map((o) => o.bandwidthTb)).toEqual([32, 4, null]);
});
it("sorts hourly by hourly price, not monthly", () => {
  const a = offer({ hourlyPrice: 0.01, effectiveMonthly: 9 });
  const b = offer({ hourlyPrice: 0.02, effectiveMonthly: 5 });
  expect(sortOffers([b, a], "hourly", "asc")[0]).toBe(a);
});
```

- [x] **Step 2:** Run it. Expected: FAIL.
- [x] **Step 3:** Add `bandwidthTb: number | null` and `hourlyPrice: number | null` to `Offer` (mapped from `row.offer.bandwidthTb` and `row.price.hourly*`). Put unknowns last in both directions:

```ts
const nullsLast = (x: number | null, y: number | null, sign: number) =>
  x == null && y == null ? 0 : x == null ? 1 : y == null ? -1 : sign * (x - y);
```

If the DB has no hourly price, remove `hourly` from `SORTS` and from the table.
- [x] **Step 4:** Run it. Expected: PASS. Commit: `Sort bandwidth and hourly on real numbers`.

#### Task 1.3: Affiliate disclosure and `rel="sponsored"` (L1, L2)

**Status (30 September 2026):** Verified paid-link rel attributes and disclosure ordering on home/catalog/offer/compare. Actual browser tests reproduce the old failure and pass after implementation; labels meet the serious/critical axe gates.

**Files:** create `src/components/AffiliateLabel.tsx` and `src/components/DisclosureBar.tsx`. Modify `GetDealButton.tsx`, `DealTable.tsx:158-160`, `CatalogClient.tsx` (above the table), `HeroShortlist.tsx`, `OfferDetail.tsx:110`.

- [x] **Step 1: Failing e2e** (Playwright, Task 2.2):

```ts
test("catalog shows a disclosure before the first paid link", async ({ page }) => {
  await page.goto("/catalog");
  const bar = page.getByRole("note", { name: /commission/i });
  await expect(bar).toBeVisible();
  const firstPaid = page.locator('a[href^="/go/"][rel~="sponsored"]').first();
  const barBox = await bar.boundingBox();
  const linkBox = await firstPaid.boundingBox();
  expect(barBox!.y).toBeLessThan(linkBox!.y);
});
```

- [x] **Step 2:** Implement:

```tsx
export function DisclosureBar() {
  return (
    <p role="note" aria-label="Commission disclosure" className="disclosure-bar">
      Some links earn us a commission. It never changes the order.{" "}
      <a href="/methodology#independence">How we check</a>
    </p>
  );
}
```

`GetDealButton` gets `rel={offer.affiliate ? "sponsored nofollow" : "nofollow"}` and renders `<AffiliateLabel />` (12 px, `--ink-muted` at AA contrast, link icon + "Affiliate link") beside the button when `offer.affiliate`.
- [x] **Step 3:** Run the e2e. Expected: PASS. Commit: `Disclose commissions before paid links`.

#### Task 1.4: Truthful hero shortlist and labels (D9, D10, D11)

**Status (30 September 2026):** Verified snapshot-based shortlist title, reviewed fit/catch copy and plain region/location labels. Unit regressions and 1440/390 browser captures pass.

**Files:** `HeroShortlist.tsx`, `OfferDetail.tsx`, create `src/lib/labels.ts`

- [x] **Step 1:** Test `regionLabel("MULTI") === "Several regions"`, `regionLabel("UNKNOWN") === null`, `locationsLabel([]) === "Not published"`.
- [x] **Step 2:** Implement `labels.ts`. Replace "Featured this week" with `` `Strong value · ${snapshotLabel}` ``. Put `whyFit` under "Why it's here" and the catch under "Watch out", and hide each when it's null.
- [x] **Step 3:** Run the test and view `/` at 1440 and 390. Commit.

#### Task 1.5: Theme without flash (R4)

**Status (30 September 2026):** verified. Eight VM cases plus nine production-browser first-frame/toggle cases pass across desktop light/dark and mobile, including blocked storage and delayed hydration. Browser evidence: `/tmp/bestvpsforme-e2e/pre-layer-functional.log`.

**Files:** `src/app/layout.tsx`, `src/components/SiteChrome.tsx` (`ThemeToggle`)

- [x] **Step 1:** Read `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md` (Themes + dev re-apply sections).
- [x] **Step 2:** In `layout.tsx`, set `<html lang="en" data-theme="light" suppressHydrationWarning>` and add to `<head>`:

```tsx
<script dangerouslySetInnerHTML={{ __html:
  `(function(){try{var t=localStorage.getItem("bvf-theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t)}catch(e){}})()` }} />
```

- [x] **Step 3:** In `ThemeToggle`, replace `useEffect` with `useLayoutEffect` re-apply. Initialise state lazily from `document.documentElement.dataset.theme` inside the effect.
- [x] **Step 4:** Check it: set dark, hard-reload with CPU throttling, and see no white frame. Commit.

#### Task 1.6: Put custom CSS in cascade layers (R5)

**Status (30 September 2026):** verified. Desktop filter visibility regression and serious/critical axe checks pass. Compared all 108 route/viewport/theme pairs; no document overflow or theme mismatch. Four duplicated base selectors are consolidated (responsive overrides retained). The layer verification passed 54 unchanged baselines on Next 16.3.6; the completion goal subsequently reviewed three mobile target-size updates, and all 54 pass again. Compact evidence: `docs/qa/2026-09-30/cascade-summary.json`.

**Files:** `src/app/globals.css`

- [x] **Step 1: Failing e2e** at 1440 px: `await expect(page.getByRole("button", { name: /^Open filters/ })).toBeHidden();`
- [x] **Step 2:** Wrap the token block and element rules in `@layer base { … }` and every class rule (`.ui-button`, `.deal-table`, …) in `@layer components { … }`. Leave `@theme inline` outside.
- [x] **Step 3:** Remove the 4 duplicated selectors by merging their declarations.
- [x] **Step 4:** Take screenshots of every route at 390 / 1024 / 1440 in both themes and diff them against the pre-change set. Fix regressions caused by utilities now winning.
- [x] **Step 5:** Commit: `Layer custom CSS so Tailwind utilities apply`.

#### Task 1.7: Server-render the catalog (R1, R2)

**Status (30 September 2026):** complete. Page-one HTML is **109,008 bytes** (was 719,062), verified by `scripts/check_catalog_payload.ts`. The duplicated desktop-table/mobile-list DOM was replaced by one shared responsive `<table>` (each offer renders once; the same `<tr>` reflows into a card under 760 px; mobile keeps its 20-row progressive window via `data-window`). Per-row markup was put on a diet (sprite icons, bare logo frames, terse spec cells). Owner decision: the server page is **24 rows** (`CATALOG_PAGE_SIZE`) — 24 × ~2.6 KB fits the byte budget where 50 could not. Mobile window stays 20→rest.

**Files:** `src/app/catalog/page.tsx`, `src/components/CatalogClient.tsx`, create `src/lib/catalog/use-catalog-query.ts`, `src/app/providers/[slug]/page.tsx`

- [x] **Step 1:** Read `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` and `02-guides/preserving-ui-state.md`.
- [x] **Step 2: Failing test:** `curl -s /catalog?ram=4 | rg -c 'class="deal-table"'` ≥ 1, and the first row's provider name appears in the HTML.
- [x] **Step 3:** The page reads `searchParams` (a Promise in 16.x), calls `parseCatalogQuery`, filters, sorts, and slices the first `CATALOG_PAGE_SIZE` (24) rows on the server, and passes `initialQuery`, `rows`, and `total` to the client. `useState(initialQuery)` replaces the parse-in-effect.
- [x] **Step 4:** Remove `mobileViewport`. One shared responsive `<table>` now renders each offer once — a semantic table on desktop that reflows into cards under 760 px (the mobile-only Details toggle/catch/location live inside each row and are hidden on desktop). `MobileDealList`/`MobileOfferRow` deleted.
- [x] **Step 5:** Send slim DTOs: only the fields the row renders.
- [x] **Step 6:** Measured 109,008 bytes for a 24-row page (< 150 KB target); committed. (Owner decision 30 Sep: `CATALOG_PAGE_SIZE` 50 → 24 so the shared DOM fits the budget.)

#### Task 1.8: Escaped JSON-LD and deduped reads (R6, R7)

**Status (30 September 2026):** verified. Shared serializer escapes opening brackets; offer, provider and guide pages use it. Unreviewed availability is omitted and database reads are request-memoized with React `cache`. Actual Hostinger page code passed Schema Markup Validator with zero errors and zero warnings (Product + BreadcrumbList); proof: `docs/qa/2026-09-30/hostinger-schema-validator.jpg`.

**Files:** create `src/lib/json-ld.tsx`. Modify `offers/[id]/page.tsx`, `providers/[slug]/page.tsx`, `guides/[slug]/page.tsx`, `lib/public-catalog.ts`.

- [x] **Step 1: Test:** `jsonLdString({ name: "</script><x>" })` contains no `<`.
- [x] **Step 2:**

```tsx
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}
```

Remove `availability` from the Product offer. Wrap `getPublishedCatalogOfferState` and `getActiveSnapshotDate` with `cache` from `react`.
- [x] **Step 3:** Run the tests and validate one offer page in the Schema Markup Validator. Commit.

#### Task 1.9: Real renewal, term and due-today data (D13) — P0 for the whole brand

**Status (updated 1 October 2026):** Schema, parser, review workflow and publication are implemented and the production publication (snapshot v5) contains 59 reviewed-term stamps. The October evidence guard (`unsupportedRenewalReason`) quarantines 16 of those stamps whose evidence asserts flat renewal without a renewal statement — **43 reviewed-term records remain valid**. Corrections are queued in `docs/data/renewal-correction-queue-2026-10-01.*` and require the owner's explicit approval before the real database changes; none were applied by the correction pass.

**Files:**
- Modify: `src/db/schema.ts` (`offer_prices`: add `intro_months integer`, `intro_monthly real`, `billed_upfront_months integer`, `setup_fee real`, `renewal_source text`; keep existing nullable columns)
- Create: `drizzle/<next>_offer_price_terms.sql` via `npx drizzle-kit generate` (follow the `drizzle-safe-migrations` skill: additive, nullable, no backfill in the migration)
- Create: `src/db/price-terms.ts` (pure parser that *suggests* terms from `billing_notes`)
- Modify: `src/db/import-publish.ts:175-178`. **This is the root cause of D13:** it writes `cashDueToday` and `renewalMonthly` as copies of `effectiveMonthly`. Write `null` unless a reviewed term exists, and add a test proving an unreviewed long-term offer publishes with null renewal/due-today. Also update `src/db/seed.ts` fixtures.
- Modify: `src/db/row-normalization.ts`, `src/db/import-review.ts` (show suggestions for human approval), `src/lib/public-catalog.ts` (map the new fields)
- Create: `src/lib/real-price.ts` + `src/lib/real-price.test.ts`

**Interfaces:**
- Produces: `suggestPriceTerms(notes: string): { introMonths?: number; introMonthly?: number; renewalMonthly?: number; termMonths?: number; confidence: "high" | "low"; evidence: string }`
- Produces: `realPrice(p: PriceTerms, horizon = 36): number | null` and `costSeries(p: PriceTerms, horizon = 36): number[]`, where `PriceTerms = { effectiveMonthly: number; introMonths: number | null; introMonthly: number | null; termMonths: number | null; billedUpfrontMonths: number | null; renewalMonthly: number | null; setupFee: number | null }`

- [x] **Step 1: Failing tests** (`src/lib/real-price.test.ts`)

```ts
import { describe, expect, it } from "vitest";
import { realPrice, costSeries } from "./real-price";

const base = { introMonths: null, introMonthly: null, termMonths: 1, billedUpfrontMonths: null, renewalMonthly: null, setupFee: null };

describe("realPrice", () => {
  it("prices a 24-month prepay with a higher renewal (Hostinger KVM 1)", () => {
    const p = { ...base, effectiveMonthly: 6.49, termMonths: 24, billedUpfrontMonths: 24, renewalMonthly: 11.99 };
    expect(realPrice(p)).toBeCloseTo(8.32, 2);
    expect(costSeries(p)[0]).toBeCloseTo(155.76, 2);
  });
  it("prices a 3-month intro on a 12-month term (IONOS VPS M+)", () => {
    const p = { ...base, effectiveMonthly: 4, introMonths: 3, introMonthly: 4, termMonths: 12, renewalMonthly: 11 };
    expect(realPrice(p)).toBeCloseTo(10.42, 2);
  });
  it("returns null when a long term has no reviewed renewal", () => {
    expect(realPrice({ ...base, effectiveMonthly: 6.49, termMonths: 24, billedUpfrontMonths: 24 })).toBeNull();
  });
  it("is flat for month-to-month plans with no intro", () => {
    expect(realPrice({ ...base, effectiveMonthly: 4.54 })).toBeCloseTo(4.54, 2);
  });
});
```

- [x] **Step 2:** `npx vitest run src/lib/real-price.test.ts`. Expected: FAIL (module not found).
- [x] **Step 3: Implement**

```ts
export type PriceTerms = { effectiveMonthly: number; introMonths: number | null; introMonthly: number | null; termMonths: number | null; billedUpfrontMonths: number | null; renewalMonthly: number | null; setupFee: number | null };

export function costSeries(p: PriceTerms, horizon = 36): number[] {
  const introMonths = p.introMonths ?? (p.billedUpfrontMonths ?? 0);
  const introPrice = p.introMonthly ?? p.effectiveMonthly;
  const renewal = p.renewalMonthly ?? p.effectiveMonthly;
  const series: number[] = [];
  let total = p.setupFee ?? 0;
  for (let m = 0; m < horizon; m++) {
    const inIntro = m < introMonths;
    if (p.billedUpfrontMonths && m % p.billedUpfrontMonths === 0 && inIntro) total += introPrice * p.billedUpfrontMonths;
    else if (!(p.billedUpfrontMonths && inIntro)) total += inIntro ? introPrice : renewal;
    series.push(Math.round(total * 100) / 100);
  }
  return series;
}

export function realPrice(p: PriceTerms, horizon = 36): number | null {
  const needsRenewal = (p.termMonths ?? 1) > 1 || p.introMonths != null || p.billedUpfrontMonths != null;
  if (needsRenewal && p.renewalMonthly == null) return null;
  return Math.round((costSeries(p, horizon).at(-1)! / horizon) * 100) / 100;
}
```

- [x] **Step 4:** Run the tests again. Expected: PASS. Add cases for setup fees, renewal lower than intro, and a 1-month term with a 1-month intro (Time4VPS).
- [x] **Step 5:** Write the migration, the `suggestPriceTerms` parser, and its tests using the real note strings from the CSV (Hostinger, IONOS, Time4VPS, AlphaVPS "flat at renewal"). Suggestions are **never** published directly: the admin import review shows each suggestion next to its evidence text, and an operator approves it.
- [x] **Step 6:** The UI shows `realPrice` where it's non-null. Otherwise it shows the effective price with a "Renewal not reviewed" tag, and the plan is excluded from "3-yr real price" sorting (it sorts last, explained in a tooltip).
- [x] **Step 7:** Commit: `Store reviewed price terms and compute the 3-year real price`.

#### Task 1.10: Currency conversion and VAT basis (D12)

**Status (30 September 2026):** All four steps verified. The owner approved the prepared disposable publication test by asking to start the proposed series. Full publication produced 322 current prices; all 99 EUR and 7 GBP prices have exact check-date rates. No terms were approved and no production migration or publication occurred. Evidence: `docs/data/pricing-verification-2026-09-30.md`.

**Files:** `src/db/schema.ts` (`offer_prices.exchange_rate`, `exchange_rate_date` already exist; add `vat_basis text check in ('incl','excl','unknown')`), `src/db/fx.ts`, `src/db/fx.test.ts`, `scripts/import_fx_rates.ts`, `src/lib/format.ts`.

- [x] **Step 1: Failing test:** `toUsd({ amount: 5.91, currency: "EUR", rate: 1.09 })` returns `6.44`; `toUsd({ amount: 5.91, currency: "EUR", rate: null })` returns `null` (never assume 1.0).
- [x] **Step 2:** Implement `toUsd`. Add `scripts/import_fx_rates.ts`, which loads the ECB reference rates CSV for the check date into a new `fx_rates(date, currency, usd_rate, source_url)` table, and the publish step fills `exchange_rate` + `exchange_rate_date` for every non-USD price. Publishing is **blocked** when a non-USD price has no rate (extend `publication-policy.ts`).
- [x] **Step 3:** Display: the primary value is USD, with "€5.91 · ECB 1.09 on 31 Aug" beneath it in 12 px `--fg-subtle`. The VAT basis is shown on the offer page ("Price excludes VAT" for Hetzner).
- [x] **Step 4:** Tests pass. `npm run data:publish-full` against a disposable DB shows zero non-USD prices without a rate. Commit.

### Phase 2 — Test harness and CI

#### Task 2.1: Vitest

**Status (30 September 2026):** Complete. 252 tests / 53 suites pass, including real migrated SQLite, pricing/currency, catalog/query, publication/auth/cache, corrections/health, metadata/disclosure and analytics behaviors. Characterization ports do not invent a failing implementation phase.

- [x] `npm i -D vitest` (pin a release published ≥ 7 days ago; check with `npm view vitest time`). Add `vitest.config.ts` with the `@` alias.
- [x] Create `tests/fixtures/published-row.ts` exporting `publishedRowFixture(overrides)` (returns a `PublishedRow` shaped like `listPublishedOffers()` output) and `tests/fixtures/offer.ts` exporting `offer(overrides): Offer`. Tasks 1.1 and 1.2 use both. Add scripts `"test": "vitest run"` and `"test:watch": "vitest"`.
- [x] Port the logic checks into `*.test.ts` next to their source: catalog filter/sort/score, catalog-url round-trip, format, publication policy, import policy, normalisation, provider normalisation, CSRF, admin auth, rate limit, secure log redaction, analytics taxonomy, and ranking independence (property test: flipping `affiliate` on any offer never changes order).
- [x] Use an in-memory SQLite (`DATABASE_URL=:memory:` + `migrate`) for repository tests. Don't mock Drizzle.

#### Task 2.2: Playwright + axe

**Status (30 September 2026):** Complete on Next 16.3.6: 240 browser checks pass (210 standard, 24 large-catalog and 6 synthetic authenticated admin-action checks). Includes 54 visual baselines: 51 unchanged and three reviewed mobile paid-link target corrections. Synthetic profiles use distinct `/tmp` databases; actual-data integration uses read-only backups. Serious/critical axe, keyboard, theme, admin feedback, privacy/DNT, 20→40→50 reveal and comparison-limit behavior pass. Evidence: `docs/qa/2026-09-30/browser-verification.md`.

- [x] `npm i -D @playwright/test @axe-core/playwright`, then `npx playwright install chromium`.
- [x] `playwright.config.ts`: `webServer: npm run build && npm start` on a free port. Projects: `desktop-light` (1440), `desktop-dark`, `mobile` (390).
- [x] Specs: home, catalog (filter → URL → back button restores), offer, compare (add 2 → share URL → reload), provider, guides, 404, admin login gate, and `/go/[id]` redirect + click row.
- [x] Run `AxeBuilder` on every route. Fail on serious or critical issues.
- [x] Visual snapshots per route and project (`toHaveScreenshot`, `maxDiffPixelRatio: 0.01`). These replace `docs/qa/**/*.jpg`.

#### Task 2.3: Retire source-grep scripts and slim `package.json`

**Status (30 September 2026):** Complete. The owner approved and retired 21 checks, then the exact additional 56-file proposal. All replacement behavior gates pass; remaining useful CLIs retain real assertions and no direct application-source text readers remain. Menu:14 npm commands, with meaningful maintenance commands documented directly. Active callers repaired; historical command references labeled. Records: `docs/progress/source-check-retirement-2026-09-30.md` and `docs/progress/source-check-final-retirement-2026-09-30.md`.

- [x] Retire the owner-approved 21 files/entries and verify their replacement/dependent commands.

- [x] For each remaining source-text check that `readFileSync("src/…")`: if a Vitest or Playwright test now covers the behaviour, delete the script and its npm entry. If it guards documentation only, delete it.
- [x] The target `scripts` block (14 entries; the browser coordinator builds before testing):

```json
"dev": "next dev --turbopack",
"build": "next build --turbopack",
"start": "next start",
"lint": "eslint src scripts tests",
"typecheck": "tsc --noEmit",
"test": "vitest run",
"test:e2e": "tsx scripts/run_browser_checks.ts",
"test:e2e:prepare": "tsx scripts/prepare_e2e_db.ts",
"data:check": "python3 scripts/check_vps_data.py data/vps-offers-2026-08-31.csv",
"db:migrate": "tsx scripts/migrate_db.ts",
"db:seed": "tsx scripts/seed_db.ts",
"db:backup": "tsx scripts/backup_sqlite.ts",
"data:publish-full": "tsx scripts/publish_full_catalog.ts",
"release:check": "npm run lint && npm run typecheck && npm test && npm run test:e2e"
```

#### Task 2.4: CI

**Status (30 September 2026):** workflow configured and component commands verified locally: clean npm install, production audit, raw CSV, lint, typecheck, unit, retained content checks, disposable build and browser suite. Reports upload on failure. Remote GitHub Actions has not run because nothing was pushed. The release command invokes the browser pipeline, which prepares `/tmp` data and builds before testing.

- [x] `.github/workflows/ci.yml`: `npm ci` → `npm audit --omit=dev --audit-level=high` → `data:check` → `lint` → `typecheck` → `test` → `build` → `playwright install --with-deps chromium` → `test:e2e`. Upload `playwright-report/` on failure. Raise `timeout-minutes` to 20.

### Phase 3 — Brand foundations from `brand/` (spec; write the detailed task plan before starting)

**Task 3.0 (gate): update the contract.** Edit `docs/product/PRODUCT_CONTRACT.md` → "Design invariants", `DESIGN.md`, and `PRODUCT.md` → "Personality/Anti-references" to the Highlighter identity: Mona Sans + Geist Mono, ink/paper/volt/vermilion, volt never as text on paper, the sticker device allowed once per page, pills allowed for buttons, 24–32 px radii allowed on hero surfaces. Keep every integrity, a11y, and data invariant unchanged. The owner signs off in the commit message. Nothing below starts before this lands.

**Status (30 September 2026): complete.** Every acceptance criterion landed and verified; see the task checklist below and the session ledger. Notable adaptation: OG fonts are static TTF instances in `src/lib/og-fonts/` (Satori rejects variable fonts), while browsers get the variable WOFF2 files.

Acceptance criteria:
- [x] `brand/tokens/tokens.css` copied to `src/styles/tokens.css` inside `@layer base`, with Tailwind `@theme inline` exposing the semantic tokens only (`bg-surface`, `text-fg-muted`, `bg-accent`, `rounded-card`…). A Vitest contrast suite parses the file and asserts every pair in BRAND.md §3.4.
- [x] Fonts via `next/font/local` from `brand/fonts/*.ttf` converted to WOFF2 (`fonttools ttLib.woff2 compress`), variable axes kept (`wdth` 75–125), `display: swap`, `adjustFontFallback`. IBM Plex removed. Read `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` first.
- [x] `src/components/brand/{Lockup,Mark,Wordmark}.tsx` as inline SVG components generated from `brand/logo/*.svg` (theme-aware, `aria-label="bestvpsforme"`).
- [x] `src/app/icon.svg` = `brand/logo/favicon.svg`, `apple-icon.png` from `png/mark-180.png`, `manifest.ts` with 192/512 icons, `theme_color #0E1116`. `icon.tsx` deleted.
- [x] `opengraph-image.tsx` for `/` and `/offers/[id]`, reproducing `brand/marketing/og-home.html` and `og-offer.html` with `ImageResponse` (fonts loaded from the local files). `curl -sI …/opengraph-image | grep image/png`. `public/og-default.svg` deleted.
- [x] Provider marks self-hosted and normalised (square SVG preferred), DuckDuckGo favicon code and its CSP host removed, 22 unused logo files deleted (with approval).
- [x] `ProviderMark` server component (`.pmark` spec).
- [x] Trustpilot as plain text (D-5).

### Phase 4 — Components, shell, home, catalog (spec; source of truth `brand/mockups/`)

**Status (1 October 2026): complete — SUPERSEDED 5 October 2026.** Every acceptance criterion landed and verified. The whole public surface now renders the Highlighter system: new `SiteHeader`/`SiteFooter`/`CommandPalette`/`CompareTray` shell, home per §D2 (X-ray card, provider ribbon, mad-lib fit line, proof, method, FAQ), catalog per §D3 (filter rail with price bands + honesty switches + region chips, dot-scatter summary strip, catch column, 24-row pagination, density toggle, mobile filter sheet with focus trap). Styles live in `src/styles/{system,home,catalog}.css` inside `@layer components`; ~1,371 lines of dead pre-remake CSS were stripped from `globals.css`. Verification: 260 unit tests, tsc + ESLint clean, catalog HTML ~130 KB (< 150 KB), and 240 browser checks green across standard/large/action profiles in all three projects — including 54 axe scans (reduced-motion-emulated for determinism) and 54 regenerated visual baselines. Notable fixes: `/` focuses catalog search while `⌘K`/`Ctrl+K` opens the palette; standalone deploys now copy `public/` + `.next/static` via `postbuild` (the bundle ships without them); dev-only `/system` renders the component-state gallery. **Superseded:** the palette, home mad-lib, search focus and `/system` gallery were removed by the owner-requested clarity redesign (3–5 Oct) and the minimal remake (`docs/progress/minimal-remake-plan-2026-10-05.md`); current truth is `DESIGN.md`.

- [x] E2 components built with every state (hover, focus-visible, active, disabled, loading, empty) and shown on a dev-only `/system` route next to the mockup screenshot for comparison.
- [x] `SiteHeader`, `DisclosureBar`, `SiteFooter`, `CommandPalette`, `CompareTray` per §D1. `SiteChrome` deleted.
- [x] Home per §D2. `getSnapshotStats()` powers every number (plans, providers, median, commitments, IPv4-extra, workload counts, mad-lib count). The X-ray plan is chosen in admin (`homeXrayOfferId`, `site_settings` table + migration 0014).
- [x] Catalog per §D3, server-rendered (Task 1.7), with price bands + histogram, honesty switches (the Flat renewal switch depends on Task 1.9), summary strip, catch column, pagination, density, mobile sheet.
- [x] No arbitrary Tailwind values in `src/components`. CSS split per component in `@layer components`.
- [x] Playwright visual snapshots of home and catalog at 1440/390, light and dark, compared with `brand/previews/*.png` by the owner in the browser preview.

### Phase 5 — Offer, compare, providers, guides, methodology, system pages (spec)

**Status (1 October 2026): complete — SUPERSEDED 5 October 2026.** All acceptance criteria landed and verified across offer, compare, providers, guides, methodology and system pages (`src/styles/{offer,compare,content,transitions}.css`). Verification: 353 unit tests, tsc + ESLint clean, 448 standard + 44 large + 12 actions + 44 audit browser checks green across six projects, 120 visual baselines matched. Second-pass corrections recorded in `docs/progress/phase-4-5-implementation-record-2026-10-01.md` (routable `/system` gallery, mad-lib region + live count, APG-clean palette with plan search, displayed-price filter basis). **Superseded:** `PlanMorph` transitions, `/system` and the mad-lib surfaces were removed in the 3–5 Oct clarity redesign; the minimal-remake plan now governs.

- [x] Offer per §D4: `Receipt` from `realPrice()`, `CostChart` from `costSeries()`, honest spec grid, evidence cards, cross-provider alternatives, mobile buy bar.
- [x] `<ViewTransition>` morph from catalog row identity to the offer hero (via `PlanMorph`, which no-ops where `react.ViewTransition` is unavailable — e.g. stable React in Vitest — and honours reduced motion through `transitions.css`).
- [x] Compare per §D5: `?p=` URL state, server-rendered, best-in-row, differences-only, verdict cards, presets for the empty state. `/api/public/offers` no longer fetched for compare.
- [x] `/providers` index and provider detail per §D6.
- [x] Guides and articles per §D7 (`Callout`, `Formula`, `PlansMentioned` MDX components via `:::callout`/`:::formula`/`:::plans` directives).
- [x] Methodology per §D8. The weights render from `src/lib/score.ts` (`VALUE_WEIGHTS`), and a test asserts the page equals the code. Recommended sort now includes a confidence gate so unverified prices cannot outrank reviewed ones.
- [x] 404, error, `/updates` per §D9. `/updates` renders snapshot history with added/removed/changed diffs per publication. Admin adopts tokens via the compat alias map.

### Phase 6 — Content (spec, editorial)

- [x] Frozen top-100 editorial cohort reviewed with audits: 62 supported entries published; 38 evidence-held drafts recorded individually. Unsupported catches/fits remain omitted.
- [x] `featured` retired from public and admin output; historical DB column and snapshot rollback retained (D6-4).
- [x] Dataset guide derives active publication counts and explains the homepage/default-catalog comparison set; home floors use the catalog's displayed-price basis.
- [x] Current public route copy passes the voice rules (`brand/BRAND.md` §9), with automated route checks and an editorial stop-slop review recorded in the 7 October delivery.
- [x] Reviewed price terms or an individual written reason for each of the 47 frozen targets; owner-gated corrections remain on hold.

Status, 3 October 2026: the frozen top-100 worklist and first 20 copy-only audited drafts are in `docs/progress/phase-6-editorial-batches-2026-10-02.md`. The current-price admin queue, separate setup-fee evidence and additive migration 0016 are implemented; `docs/data/terms-backlog-2026-10-02.md` records four source-backed IONOS zero-fee candidates and the remaining unknowns. Production migration/writes and editorial publication require owner approval. The 20 open renewals and 16 correction rows remain untouched; Phase 6 is not fully accepted.

Status, 7 October 2026: implementation and the production draft load are delivered. All 100 frozen editorial entries have a real owner audit author and remain drafts; unsupported catches/fits stay empty with documented reasons. All saved entries remain reachable in the admin queue when new offers change its first 100 positions. Four matching Liquid Web plans now have source-backed $0 setup fees. Each frozen price-term target has an individual disposition; 20 open renewals and 16 correction rows remain unchanged. The special-offers page has 13 verified highlights and the catalog has 330 published offers. See `docs/progress/phase-6-delivery-2026-10-07.md` for receipts, verification and the remaining owner publication step. The public-copy automated checks pass; final owner acceptance and editorial publication remain open. The current home design has no X-ray section, so the old home-pick task does not apply to that surface.

Final closure, 7 October 2026: after being told review and publication were next, the owner instructed the agent to finish Phase 6. That authorizes delegated evidence review and publication of supported entries. The fresh-copy rehearsal and production save published 62 entries with reviewed author/date fields and audits; 38 remain drafts with individual evidence holds. The hold list includes eight first-batch plans whose provider research conflicts with the stored snapshot. Public catches, fits and workload filters were verified. Phase 6 closes with these documented data exceptions, not a claim that all 100 plans have complete published sentences. Follow-up SKU, price, term, availability and hardware reconciliation remains in `docs/progress/phase-6-final-review-2026-10-07.json`.

### Phase 7 — Performance, security, launch polish (spec)

10 October 2026: safe implementation and integrated verification delivered. Full acceptance remains open for the strict JavaScript budget and human accessibility checks. See [delivery ledger](docs/progress/phase-7-delivery.md) for exact-build measurements and launch gates.

12 October 2026: prior-phase repairs and preserved catalog routing pass the full no-retry local gate (497 unit tests; 891 browser checks). The strict webpack initial catalog JavaScript gate now passes at 118706 gzip bytes, with later cross-router downloads explicitly retained in the receipt. The new-build full performance/accessibility matrices and human acceptance still belong to Phase 7. See [prerequisite handoff](docs/progress/pre-phase-7-repairs-2026-10-12.md).

- [x] Evaluate Cache Components and persistent public caching: deferred because the installed nonce-CSP guide requires dynamic HTML and documents PPR incompatibility. Request-scoped deduplication remains; separate-process mutation/freshness checks passed. See `docs/qa/phase-7/rendering-decision.md`.
- [x] Nonce-based CSP with `'unsafe-inline'` removed from production `script-src`; unique matching response/rendered-script nonces and existing interactions verified.
- [ ] Budgets met on Lighthouse mobile: LCP < 2.0 s, CLS < 0.05, lab INP < 200 ms, JS on `/catalog` < 120 KB gzip. The 12 October initial JS receipt passes at 118706 bytes, including framework/shared code. The 10 October 42 mobile loads and 24 lab interaction runs passed their speed/shift targets on the old build; refresh that matrix on the new build before closing this combined item.
- [x] Branded 404 and error pages with genuine failure/restore/retry checks, plus accurate `/updates`, in the current approved restrained design (supersedes decorative Stamp styling).
- [ ] Final a11y acceptance: automated keyboard/reflow checks and actual 200% zoom passed; real VoiceOver/NVDA and retained incomplete-check human review remain pending.

### Phase 8 — Marketing kit live + Remotion video (spec; brief in `brand/video/README.md`)

- [ ] `scripts/export-video-facts.ts` writes `video/src/data/snapshot.ts` from the active publication (snapshot id, date, and every number used on screen). It fails if any value is null or the snapshot is older than 30 days.
- [ ] `video/` Remotion project scaffolded per the brief's §7 tree (own `package.json`, never bundled with the app). Fonts and logos copied from `brand/`. Springs from `tokens.json`.
- [ ] Primitives built and scrubbed in Studio: `Highlight`, `Strike`, `NumberRoll`, `Stamp`, `Rack`, `Sticker`, `BrowserFrame`, `Caption`.
- [ ] `Bumper` (4 s) → `LaunchFilm` (60 s) → `LaunchVertical` (30 s) → `TheAdSays` (data-driven, zod props) → `OfferCard` still, each reviewed against `brand/video/frames/*.png`.
- [ ] VO recorded or generated (the `promo-video` skill flow: ElevenLabs + Whisper timing check, zero overlaps), music licensed, master at −14 LUFS, captions burned in + `.srt`.
- [ ] Marketing templates in production: OG images live (Phase 3), `/brand` page (logo downloads, colours, "how to cite our data"), and the "The ad says" weekly series from `TheAdSays` renders.
- [ ] No video or post publishes a price until Tasks 1.9 and 1.10 have shipped and the number matches the live snapshot.

---

## Decisions needed from the owner

| ID | Question | Status / recommended default |
|---|---|---|
| D-1 | Wordmark casing | **Decided:** lowercase `bestvpsforme` (28 Sep) |
| D-2 | Type | **Decided with the bold identity:** Mona Sans + Geist Mono (both OFL) |
| D-3 | Marquee or static provider wall | **Built as static provider chips** in the mockups |
| D-4 | Keep `featured` as an editorial field or drop it? | **Decided (D6-4, 2 Oct):** retired from public DTO, sitemap distinction and admin output. Historical DB column and rollback retained. `homeXrayOfferId` remains the separate reasoned home-pick setting. |
| D-5 | Trustpilot display | Plain text + link, no logo or stars, until there's an agreement (the mockups already do this) |
| D-6 | Cleanup: approve F1 deletes and F2 removals? | Yes, after Task 0.1. Still awaiting explicit approval |
| D-7 | Real-price horizon | **Decided by owner (30 Sep):** 36 months ("3-year real price") |
| D-8 | Approve the contract/design update in Task 3.0 (crimson/Plex → Highlighter) | Required before any brand code ships |
| D-9 | FX source and VAT policy (Task 1.10) | **Decided by owner (30 Sep):** ECB reference rate on the price check date for EUR/GBP; preserve provider-listed VAT and state incl./excl./unknown on the offer page |
| D-10 | Video voice: generated (ElevenLabs) or a recorded human | A recorded human for the launch film; generated is fine for the weekly series |

---

## Self-review

- Coverage: understanding (A), bad code and fixes (B, E), a bold brand with logo, colour, type, and devices (C + `brand/`), a full UI remake at build-spec detail (D + `brand/mockups/`), cleanup (F), a phased plan (G), marketing and video (Phase 8 + `brand/marketing`, `brand/video`).
- Honesty check: the mockups compute 3-year real prices from providers' own billing notes and convert EUR at an illustrative 1.09. The live data can't produce those numbers yet (D12, D13), so the plan blocks every price claim until Tasks 1.9–1.10 ship.
- Contract conflicts: the identity changes the design invariants (fonts, colour, radii, pills). Task 3.0 updates the contract first. Integrity, a11y, and data invariants are unchanged.
- Placeholders: Phases 3–8 are specs with acceptance criteria. Expand each into a task plan (Phase 1 format) before execution.
- Names used across tasks: `listPublishedOffersByProvider`, `OfferDetail({ offer, siblings })`, `jsonLdString`, `JsonLd`, `DisclosureBar`, `AffiliateLabel`, `regionLabel`, `locationsLabel`, `realPrice`, `costSeries`, `suggestPriceTerms`, `toUsd`, `getSnapshotStats`, `ProviderMark`, `PriceXRay`, `Receipt`, `CompareTray`, `CommandPalette`, `homeXrayOfferId`.

---

## Appendix — Research sources

- Next.js 16.3 bundled docs: `preventing-flash-before-hydration.md`, `json-ld.md`, `08-caching.md`, `13-fonts.md`, `view-transitions.md`, `content-security-policy.md` (in `node_modules/next/dist/docs/`).
- Tailwind v4 cascade layers, where unlayered CSS beats utilities: github.com/tailwindlabs/tailwindcss/discussions/19781 and /20306; css-tricks.com "Using CSS Cascade Layers to Manage Custom Styles in a Tailwind Project".
- OG image formats (SVG unsupported on major platforms): dev.to "The Complete Guide to Open Graph Tags"; ctrl.blog "Can you use a WebP file as an Open Graph Protocol image?".
- FTC affiliate disclosure placement (above comparison tables, next to CTAs): seoplugin.ai/blog/affiliate-disclosure-compliance; velantio.com/blog/affiliate-disclosure-requirements-2026.
- Trustpilot Legal Brand Guidelines, Sept 2026: uk.corporate.trustpilot.com/legal/for-businesses/legal-brand-guidelines/sept-2026.
- Trust architecture: nytimes.com/wirecutter/editorial-standards and /reviews/anatomy-of-a-guide.
- Category references: servers.fyi (list-first VPS table), getdeploying.com/reference/compute-prices (dated, first-person method, reference tiers), serverhunter.com (scale), serverspotter.com (benchmark claims).
- Interface quality: vercel.com/design/guidelines (URL-as-state, focus, hit targets, loading-state timing).
- Restraint and density: linear.app/now/behind-the-latest-design-refresh (fewer icons, dimmer chrome); Karri Saarinen on brand authenticity for early-stage companies.
- Type: vercel.com/font (Geist), fontalternatives.com/compare/geist-vs-inter.
- Brand/colour territory: provider brand palettes (colorfetch.com/palette/digitalocean.com; seekcolors.com/brand/hostinger), DigitalOcean trademark usage guidelines (digitalocean.com/legal/trademark-usage-guidelines).
- Fintech/data design benchmarks: toimi.pro "Top 10 Best Fintech Website Designs 2026" (product-as-demo heroes, published brand portals), DesignRush F-Prime (interactive comparison data), gummble.com (Fey/Mercury/Revolut density patterns).
- Type: fonts.google.com/specimen/Mona+Sans, github.com/github/mona-sans (wdth/opsz axes), google/fonts ofl/monasans and ofl/geistmono (OFL 1.1).
- Remotion: github.com/remotion-dev/skills (compositions, defaultProps, calculateMetadata, folders), the local `promo-video` skill (VO timing with Whisper, audio mixing, no 3D transitions).
