# bestvpsforme V1: fix bugs and get production-ready

**For:** the AI or engineer finishing V1.
**Written:** 25 Oct 2026, after a full review of the V1 port.
**Read with:** `docs/V1_IMPLEMENTATION_PLAN.md` (the original plan) and `brand/shore/mockup/` (the design source of truth).

Status at review time: lint, typecheck, 562 unit tests and `next build` all pass. The bugs below are things those checks don't catch. Each one was reproduced on a copy of `data/bestvpsforme.db` (330 published offers, snapshot 7 Oct 2026).

---

## 0. Rules (read first)

1. **Commit first.** At review time 205 files were uncommitted. Before touching anything:
   `git add <explicit paths>` then `git commit -m "feat(v1): shore port (pre-fix snapshot)"`. Never use `git add -A`, `git stash`, `reset --hard` or `clean`; other work shares this checkout.
2. **The mockup is the design.** Don't redesign anything. "Fixed" means it matches `brand/shore/mockup/` (serve it with `python3 -m http.server` from that folder and open `index.html#<route>`).
3. **One task = one commit**, in the order below. Message format: `fix(scope): what`.
4. After each task, run: `npm run lint && npm run typecheck && npm test`. Each task also names a check you must add or run.
5. **Never invent data.** Unknown stays "Not published". Never use a guessed price to fix a sort or a count.
6. Don't run migrations, imports or publishes against `data/bestvpsforme.db` without a backup: `npm run db:backup` first.
7. Report to the owner after each phase in **5 bullets or fewer**. The owner has ADHD, so keep reports short and put the most important thing first.

---

## Phase A: Critical front-end bugs (users see them on day one)

### A1. Rebuild the Compare page from the mockup
- **Bug:** `/compare` still renders the old compare (`src/app/compare/page.tsx` + `src/components/compare/CompareClient.tsx`). Desktop shows empty columns and overlapping badges; on 390px the cells are clipped and the "Leads" chips sit on top of numbers.
- **Do:** Port `renderCompare()` + `sew()` from `brand/shore/mockup/shore.js` and the `.cmp*`, `.sew*`, `.cmp-tools*` CSS from `shore.css`:
  - Column heads: shell with logo, plan name, provider, price, Remove.
  - Sections Price / Hardware / Trust with the same rows as the mockup.
  - "Lowest" / "Highest" only when exactly one clear winner; ties get no label.
  - "N rows differ" + "Only show what differs" toggle; diff rows tinted.
  - Sewing thread animation; static under reduced motion.
  - Empty pail state with the crab + "Open the catalog".
  - Keep the existing `?id=` URL (`compare-url.ts`) and the `shore-pail` localStorage sync; max 4.
  - Horizontal scroll stays **inside** `.cmp-wrap`, never the page.
- **Done when:** a side-by-side screenshot matches the mockup at 1440 night and 390 day for 0, 1, 3 and 4 plans; axe has no violations; the page has no page-level horizontal overflow.

### A2. Home finder count and shells don't update
- **Bug:** `src/components/shore/ShoreHero.tsx`. The form `onChange={() => run()}` runs before React applies `setRam/setPrice/setRegion`, so `update()` filters with the **old** values. Choosing 16 GB still shows "330 plans fit", and the shells never change.
- **Do:** Compute from the next value, not stale state. For example, make `needs` derived and run the update in a `useEffect([ram, price, region])`, or pass the new value into `run(next)`.
- **Also fix:** line 159, `"plans fits"` → `"plans fit"`.
- **Done when:** an e2e test picks Memory = 16 GB and the count changes, the button text changes ("Show the N plans") and its href is `/catalog?ram=16`. Change two selects in a row → the count is correct after each.

### A3. Home finder uses plain browser dropdowns
- **Bug:** `#f-ram`, `#f-price` and `#f-region` render as native visible selects. The catalog sort uses the styled stitched dropdown; home doesn't.
- **Do:** Use the same Dropdown component the catalog sort uses (ARIA listbox over a hidden native select). Keyboard: arrows, Home/End, Enter, Escape, typing a letter.
- **Done when:** home has no visible native `<select>`, the dropdowns look like the mockup in day and night, and keyboard-only selection works.

### A4. "Price" sort is wrong
- **Bug:** `price` maps to sort key `real` in `src/lib/catalog-url.ts:41` and `ShoreCatalogClient.tsx:112,118`. `real` sorts by `realMonthly`, which only 4 of 330 offers have. "Lowest first" shows $5, $11, $17, $22, then $3.75 (39 of 96 rows out of order).
- **Do:** Sort the Price column by the **same number the row displays**. Choose one and use it everywhere: filters, sliders, sort and display (plan D-3):
  - preferred: `displayPriceUsd(offer)` (real price if reviewed, else effective USD)
  - Plans with no price go **last** in both directions (`compareKnown` already does this).
- **Done when:** a unit test sorts a mixed list (reviewed + unreviewed + EUR + null) and gets a non-decreasing displayed price, and the e2e `/catalog?sort=price&dir=asc&per=96` shows 0 inversions.

### A5. Phone filter sheet button says "Show  plans"
- **Bug:** `src/components/shore/CatalogFilterRail.tsx:294`. `<span id="sheetCount">plans</span>` never gets the number.
- **Do:** Render the live result count: "Show 237 plans", and "Show 1 plan" for one.
- **Done when:** at 390px, opening Filters and moving the Memory slider updates the button number.

### A6. Offer page: evidence box is squashed, and "Direct link" appears twice
- **Bug:** In `ShoreOfferPage.tsx`, "Where these numbers come from" lays out as a narrow grid, so the text wraps one word per line. Lines 176 and 186 both print a direct/affiliate line.
- **Do:** Match the mockup `.evidence` block: title row with the lantern icon, then a description paragraph, then a source link, at full card width. Keep **one** disclosure line (the line-186 version, "Direct link. No commission on this plan…" / "Ad. We may earn a commission…").
- **Done when:** the receipt matches the mockup at 1440 and 390, hovering or focusing a receipt line updates the box and draws the thread, and only one disclosure line shows.

### A7. Four provider logos are broken
- **Bug:** Some code path requests `/logos/buyvm.png`, `/logos/webdock.svg`, `/logos/leaseweb.png` and `/logos/cherryservers.svg`, which don't exist. The real files are `marks/buyvm.png`, `webdock.png`, `marks/leaseweb.png` and `cherryservers-mark.svg`, already mapped in `src/lib/assets.ts`.
- **Do:** Every logo (catalog `<img>`, `ShellSvg` `<image>`, `ProviderMark`, OG images) must resolve through `verifiedLogoSrc()` / the `assets.ts` map. Never build `/logos/${id}.ext` by hand. If there's no logo, fall back to the felt initials patch.
- **Done when:** a test loops over every published provider id and checks that the resolved logo file exists on disk, and a browser sweep of `/providers` + all catalog pages finds 0 broken images.

### A8. Small differences from the mockup
Fix all of these against `shore.css`:
- [ ] Catalog toolbar: put back the **"Sort by"** label on desktop.
- [ ] Direction button text: use the mockup wording ("Best first" / "Best last", "Lowest first" / "Highest first", "Best rated first", "Most first" / "Least first"), not "High score first".
- [ ] Remove the vertical divider line next to the filter rail.
- [ ] Home "Ranked by value score": remove the extra bordered box around the list (the mockup uses plain rows with a left accent on #1).
- [ ] Catalog rail spacing and order: Memory, Budget, Region, then "More filters", then "Reset all filters" (the search box stays hidden per D-1).
- **Done when:** visual-regression screenshots (`scripts/visual/capture-shore.ts`) match the mockup baselines in `docs/design/v1-shore/baseline/` for home, catalog, cards, offer and compare at 390/768/1440, day and night.

---

## Phase B: Data and publication correctness

### B1. One public set of offers everywhere (the count mismatch)
- **Bug:** The catalog hides offers whose provider has no Trustpilot snapshot (`filterOffers` rule), giving 317 plans from 41 providers. But these still use all 330 / 44:
  - home finder ("330 plans fit")
  - `/providers` ("44 hosting providers")
  - `/api/public/offers`
  - `sitemap.xml`
  - provider and offer pages for CloudCone, Cockbox and YourServer (13 offers in total)

  The footer says 41. Scope §12.1 requires counts, lists, details and sitemap to agree.
- **Do:** Make **one** function the source of the public set, for example `getPublicEligibleOffers()` in `src/lib/public-catalog.ts`. It applies: published, available, provider active, Trustpilot snapshot present. Use it in:
  - `readPublicShoreCatalog` / `getPublicShoreSource`
  - home (count + picks + stats)
  - `/providers` and `/providers/[slug]`
  - `/offers/[id]`
  - `/compare`
  - `/special-offers`
  - `/api/public/offers`
  - `sitemap.ts`
  - footer meta

  Ineligible offer and provider pages return **404** (or a `noindex` "not listed yet" page if the owner prefers; default 404).
- **Done when:** a new test (`scripts/check_public_parity.ts` or a vitest) asserts that home count = catalog count = API length = sitemap offer URLs, and that provider count is equal on home, `/providers` and the footer. `/providers/cloudcone` returns 404.

### B2. Free-tier plans show "$0.00"
- **Bug:** 5 offers have `effectiveMonthly = 0`: `oracle-cloud-vm-standard-a1-flex-always-free`, `oracle-cloud-vm-standard-e2-1-micro`, `microsoft-azure-azure-b1s-free`, `google-cloud-e2-micro-always-free`, `aws-ec2-ec2-t3-micro-free`. They show as "$0.00/mo", "From $0.00" on `/providers`, and top the price sort.
- **Do (default):** Treat free tiers as a separate kind of offer:
  - display "Free tier" instead of "$0.00"
  - exclude them from price sort, the budget slider and the "From" price on provider cards
  - keep them **last** in the recommended order (an existing Phase 6 rule)
  - add a short "Free tier: limits apply, check the provider's terms" note on the offer page.

  Never show a price of 0 as a number.
- **Done when:** a unit test feeds a 0-price offer and the display returns "Free tier", the price sort puts it last, and provider "From" ignores it.

### B3. Special offers skip the promotion safety check
- **Bug:** `src/app/special-offers/page.tsx` builds deals itself from reviewed intro fields. The comment claims `public-special-offers` guards apply, but `getPublishedSpecialOffers()` is never called, so expiry and freshness rules are bypassed (WEB-07).
- **Do:** Build the deal list from `getPublishedSpecialOffers()` (respects expiry/publication) intersected with the eligible set from B1. Keep the mockup card design and the "No-surprise plans" section. Delete the misleading comment.
- **Done when:** a test with an expired promotion shows it is not rendered, and `npm run check:special-offers` (or `scripts/check_special_offers.ts`) passes.

### B4. Apply the corrections migration safely
- **Bug:** `drizzle/0017_corrections.sql` and `0018_correction_staged_row.sql` are in the journal, but `data/bestvpsforme.db` has 17 applied migrations and no `corrections` table. The admin corrections page and the `/api/corrections` insert will fail on the real database.
- **Do:** `npm run db:backup` → `npm run db:migrate` → `npm run check:db-ready` (or `scripts/check_db_ready.ts`). Also add the migration step to `docs/ops/DEPLOYMENT.md` before app start, and make `/api/health/ready` fail if migrations are pending.
- **Done when:** the `corrections` table exists, a test POST to `/api/corrections` creates a row, and `/admin/corrections` lists it.

### B5. Corrections privacy
- **Issue:** `corrections.email` is stored in plain text with no retention.
- **Do:** Keep email optional. Delete or null it **90 days** after the correction is resolved (add a maintenance command in `docs/ops/MAINTENANCE_COMMANDS.md` and a scheduled run), and state that retention period on `/privacy`.
- **Done when:** a test resolves a correction with a fake old date, runs the purge, and the email is null.

### B6. Refresh stale prices (needs a human with a browser)
- **Issue:** 322 of 330 offers were last checked on 31 Aug 2026 (more than 45 days ago). Known drift: Hostinger KVM 2 is now $8.79 on the official page (catalog $8.99); DigitalOcean Basic 1 GiB is $6.00.
- **Do:** Through **Admin → Imports** (staged job) and **Admin → Terms**, re-check at least:
  - the 20 most-viewed offers
  - every offer shown in Special offers
  - every offer with `termsReviewed = true`

  Record the evidence URL and check date for each. Publish a new snapshot. Don't touch numbers you can't verify; leave them unknown.
- **New providers:** Import Hetzner, Kamatera and the OVHcloud 2027 range from `data/research/provider-candidates-2026-10-24.csv`, and HostHatch, BuyVM, netcup and GreenCloud from `docs/research/PROVIDER_EXPANSION_FOLLOWUP.md`. Only import rows verified on the official page, each with a Trustpilot snapshot. Rows marked VERIFY stay out until checked. Vultr stays out until someone reads its pricing page manually.
- **Done when:** a new publication snapshot is live, `npm run data:check` passes, and `check:phase7:freshness` reports no public price older than the freshness limit (or the old ones are clearly labelled with their check date).

---

## Phase C: Admin

### C1. Publications page contradicts itself
- **Bug:** `src/app/admin/publications/page.tsx` says "Rollback is not exposed until confirmation and audit handling are wired" and then renders working "Restore snapshot" forms.
- **Do:** Rollback *is* wired (`rollbackPublicationSnapshot` runs in a transaction, `confirmation === "rollback"`). Fix the copy, and verify the action writes an `audit_log` row with actor, from-snapshot and to-snapshot. Add a test.
- **Done when:** a test restores a snapshot, the public catalog switches to it, and an audit row exists.

### C2. Health page: backups show "Not available"
- **Do:**
  - Have `npm run db:backup` write a heartbeat (time, file, size, sha256) to `site_settings` or a small `ops_events` table.
  - Have `check:phase7:recovery` record the restore-drill date there too.
  - Show both on `/admin/health`, with a warning if the last backup is over 26 hours old or the last restore drill is over 30 days old.
- **Done when:** after running a backup, `/admin/health` shows its time; with an old fake heartbeat it shows the warning.

### C3. Make admin code maintainable
- **Issue:** `src/app/admin/{audit,health,publications,providers,affiliates,settings,corrections}/page.tsx` are minified into one or two lines.
- **Do:** Run `npm run format` (Prettier/ESLint fix), split query helpers into `src/db/admin-*.ts`, and add one render test per admin page (logged-in and logged-out redirect).
- **Done when:** no source line in `src/app/admin` is over 160 characters, and each admin page has a test.

### C4. Click through admin once with a real login
- **Do:** Create a local admin (existing bootstrap with `ADMIN_TOTP_SECRET`), log in with TOTP, then:
  - staged import → review → publish
  - roll back
  - accept a correction and reject a correction
  - edit a provider's Trustpilot data
  - change a setting

  Check that each action creates an audit entry. Record the walkthrough in `docs/qa/admin-walkthrough-<date>.md` with screenshots.

---

## Phase D: Release gates

Run all of these on the final commit and record the outputs in `docs/qa/v1-release/`:

- [ ] `npm run release:check` (audit, data check, lint, typecheck, tests, security headers, content checks, e2e)
- [ ] Visual regression vs `docs/design/v1-shore/baseline/` for every public route at 390/768/1440 × day/night
- [ ] axe: 0 violations on every public route and the admin login page
- [ ] Keyboard-only walk: home finder → catalog filters/sort/dropdown → offer receipt → add to compare → compare toggle → corrections form
- [ ] One real screen-reader journey (NVDA or VoiceOver) on catalog → offer → compare, written up in `docs/qa/`
- [ ] Reduced-motion captures of home, compare and offer
- [ ] Performance: `npm run measure:phase7` and `check:phase7:js` within budget; the home hero must not hurt LCP
- [ ] Production build + standalone start + `/api/health/ready` = 200 with **migrations applied**
- [ ] Backup + restore drill (`check:phase7:recovery`) and a rollback-to-previous-build test
- [ ] `/for-me`, old catalog URL keys (`tp=`, `trust=`, `workload=`) and `/go/[id]` still work
- [ ] The mockup "Mockup" review panel does not exist anywhere in the app

Deployment itself stays **deferred** until the owner says go (`docs/ops/DEPLOYMENT.md`, `docs/ops/LAUNCH_CHECKLIST.md`).

---

## Order and size

| Phase | Tasks | Rough effort |
|---|---|---|
| A | Front-end bugs A1–A8 | 3–4 days (A1 is the largest: about 1.5 days) |
| B | Data B1–B6 | 2–3 days + human price checks |
| C | Admin C1–C4 | 1–2 days |
| D | Release gates | 1–2 days |

**Total: about 7–11 working days.**

## Definition of ready

- [ ] All A, B, C tasks done with their "Done when" checks green
- [ ] Phase D checklist fully ticked, outputs saved
- [ ] Work committed in small `fix(...)` commits; nothing left uncommitted
- [ ] Owner sees a 5-bullet summary and approves deployment
