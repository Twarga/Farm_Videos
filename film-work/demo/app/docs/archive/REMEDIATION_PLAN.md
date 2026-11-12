# bestvpsforme remediation plan

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


Historical plan: some npm checks named below were retired with owner approval on 30 September 2026. See the [retirement record and current replacements](../progress/source-check-retirement-2026-09-30.md). Original references remain as historical scope.

This document converts the 31 August 2026 application audit into an executable repair program. It describes what changes, what the finished state looks like, how every task is verified, and when the project is allowed to move to the next phase.

Use [PROJECT_PROGRESS.md](PROJECT_PROGRESS.md) for status and [APP_AUDIT_2026-08-31.md](APP_AUDIT_2026-08-31.md) for the evidence behind this plan.

## Final objective

Ship one trustworthy, beginner-friendly VPS comparison application in which:

1. every public offer comes from one reviewed database publication;
2. the catalog is fast to scan on desktop and mobile;
3. important actions are accessible by keyboard, screen reader, and touch;
4. prices, dates, locations, hardware, affiliate status, and caveats are visibly honest;
5. the admin is one coherent, secure operating tool rather than a visual prototype beside a separate real workflow;
6. paused features and misleading prototype language do not distort the product or analytics;
7. production security stays strict while local development remains usable;
8. the application passes a repeatable production rehearsal before public traffic opens;
9. Guides/Research can later grow acquisition without adding a paid CMS or a content farm.

## Non-goals

- No complete visual redesign.
- No new frontend framework, component library, CMS, microservice, queue, Redis, or second database.
- No live-price claim unless a provider supplies a verified live API.
- No automated publication of unreviewed CSV rows.
- No affiliate, commission, conversion, or revenue field may enter recommendation order.
- No return of Finder until catalog evidence proves a wizard is necessary.
- No decorative animation project before task completion and accessibility are fixed.

## Completion metrics

| Objective | Current evidence | Required target |
|---|---|---|
| Public data truth | 2 DB seed offers, 33 development fallback offers, 457 CSV rows | One active reviewed database snapshot; public counts match the published snapshot; no static production fallback |
| Data validation | 1 blocking error, 6 warning classes | 0 blocking errors; every warning is either resolved or explicitly classified as allowed/non-publishable |
| Provider coverage | Static editorial maps are required by several public components | Every published provider has a normalized record, safe visual fallback, official URL, and publishable identity |
| Mobile catalog | About 8,000 px for 33 rows at 390 px | First 10 results are quickly scannable; secondary facts are progressive; no page overflow; result loading is bounded |
| Touch operation | Many 28–40 px controls | All primary mobile actions and icon-only controls expose at least a 44 × 44 px hit area |
| Accessibility | Unlabelled catalog search and duplicate provider-page `h1` | Unique page `h1`; every form control named; keyboard and focus flow verified; WCAG AA contrast |
| Freshness | Hard-coded 27 August copy while source is 31 August | All public freshness labels come from the active publication snapshot |
| Admin cohesion | Styled local prototype plus separate inline-styled secure import page | One authenticated shell using tokens and real server/database actions |
| Development console | CSP blocks framework development evaluation | Clean local console for application-owned errors; production CSP still rejects `unsafe-eval` |
| Release confidence | Build/tests pass but no real external rehearsal | Mobile/desktop QA, full-data smoke, production VPS, DNS, monitoring, backup, restore, and rollback rehearsal pass |

## Priority model

- **P0 — truth or launch blocking:** incorrect/incomplete data, unsafe publication, failed deployment, or broken primary task.
- **P1 — release quality:** accessibility, mobile usability, admin operation, misleading content, or significant friction.
- **P2 — maintenance and polish:** prototype cleanup, small consistency work, and acquisition work that can follow the launch gates.

Do not begin a later phase merely because its visual work is more enjoyable. Each phase has an explicit exit gate.

---

# Phase R0 — Freeze the target and establish regression evidence

## Objective

Protect the existing working product while repairs begin. This phase creates the fixtures and measurable contracts needed to prove that later changes improve the application without quietly deleting behavior.

## Target state

- The current light/dark design tokens and core route set are documented as invariants.
- A known database fixture represents published, unpublished, incomplete, affiliate, direct, unavailable, and unknown-data offers.
- Desktop and mobile reference screenshots exist for the routes being changed.
- The team can run one remediation check command before every commit.

## Tasks

| ID | Priority | Task | Exact implementation | Acceptance evidence |
|---|---|---|---|---|
| R0-01 | P0 | Record route and product invariants | Add a short contract covering `/`, `/catalog`, `/compare`, `/offers/[id]`, `/providers/[slug]`, `/methodology`, `/corrections`, `/updates`, and `/admin`; preserve ranking independence, affiliate labels, unknown-state honesty, light/dark parity, and canonical offer URLs | Contract is committed and referenced by the readiness check |
| R0-02 | P0 | Create a deterministic production-like data fixture | Include several providers, different currencies, missing optional fields, one non-publishable row, affiliate/direct destinations, locations, current/stale checks, and snapshots | Fixture loads into a disposable DB and produces deterministic counts |
| R0-03 | P1 | Capture baseline viewports | Capture home, catalog list, catalog cards, compare empty/filled, offer, provider, admin login, admin dashboard, and import review at 390, 768, 1280, and 1440 px where relevant | Screenshot folder or QA record identifies route, viewport, theme, and date |
| R0-04 | P0 | Add a remediation check script | Compose data validation, DB readiness, public route checks, analytics ranking independence, lint, and build into one fail-fast command without deleting the focused commands | `npm run remediation:check` fails on a deliberately broken fixture and passes on the known fixture |

## Required tests

- `npm run data:check`
- `npm run db:ready-check`
- `npm run public:home-check`
- `npm run public:catalog-check`
- `npm run public:offer-check`
- `npm run public:provider-check`
- `npm run analytics:ranking-check`
- `npm run lint`
- `npm run build`

## Exit gate

Do not touch the catalog architecture or publication fallback until the fixture and regression command exist.

---

# Phase R1 — Make the reviewed database the only public truth

## Objective

Reconcile the 457-row research source, normalize every publishable record, publish it through the existing review transaction, and remove the possibility that production silently shows static TypeScript offers.

## Current problem

`data/vps-offers-2026-08-31.csv` contains 457 rows and 63 providers. Row 289 has no `effective_monthly_usd`, which blocks publication. Six warning classes describe missing optional or product-dependent facts. `src/lib/public-catalog.ts`, `src/lib/public-home.ts`, and `src/lib/public-providers.ts` can substitute static data in development, while public rendering still relies on editorial maps from `src/lib/offers.ts` and `src/lib/providers.ts`.

## Target state

- Raw research remains immutable and auditable.
- Row 289 is either corrected from evidence or staged as non-publishable with a reason.
- Every warning class has an explicit publication rule.
- Every valid provider and offer can render without a static editorial record.
- Homepage, catalog, provider, offer, compare, sitemap, destination redirects, and admin all read the same active snapshot.
- Development can opt into fixture data explicitly, but never substitutes it based on a low record count.

## Tasks

| ID | Priority | Task | Exact implementation | Acceptance evidence |
|---|---|---|---|---|
| R1-01 | P0 | Resolve row 289 safely | Identify the provider/plan; verify the official source; fill the normalized effective USD value only when evidence supports it, otherwise retain the raw row and mark it rejected/non-publishable with a reason | Data check has 0 blocking errors or the review system explicitly excludes the row without altering raw evidence |
| R1-02 | P0 | Define warning policy by field | RAM/vCPU may be absent for dedicated/PaaS/from-price products; disk may be separately priced; bandwidth may be unmetered/location-dependent; Trustpilot may be unavailable; affiliate data remains provider-level | Publication policy tests demonstrate allowed, rejected, and “unknown” outcomes for each warning class |
| R1-03 | P0 | Separate raw, normalized, and editorial data | Preserve raw CSV values; store normalized decision facts in DB fields; store human explanation/catch/fit copy separately so factual imports do not overwrite editorial review | Re-import preserves raw evidence and does not erase reviewed copy |
| R1-04 | P0 | Complete provider normalization | Produce stable provider IDs/slugs, canonical names, official URLs, HQ country, logo key/fallback mark, status, Trustpilot snapshot fields, and alias redirects for all 63 providers | No published offer refers to an unknown provider; aliases redirect deterministically |
| R1-05 | P0 | Remove static-offer dependency from DB mapping | Change `mapPublishedRow` so a complete DB row becomes a public `Offer` even when it has no entry in `offerMap`; use reviewed DB copy when available and honest fallback text only for optional explanations | A fixture offer absent from `src/lib/offers.ts` renders in catalog, offer page, compare, and provider page |
| R1-06 | P0 | Make provider rendering data-driven | Replace direct `providerMap[id]` assumptions in catalog, compare, offer, shortlist, analytics, and admin paths with a safe provider resolver backed by published provider records | Unknown-provider crashes are impossible; a normalized provider without a custom logo renders a consistent monogram fallback |
| R1-07 | P0 | Replace implicit development fallback | Remove “fewer than 3/4 records” fallback rules; introduce an explicit fixture/dev-data flag used only locally and fail closed in production | Production mode with an empty DB shows a clear unavailable state and health failure, never static offers |
| R1-08 | P0 | Stage, review, and publish the full source | Run validation → immutable job → normalization → preview → issue resolution → approval → atomic snapshot publish → cache invalidation | One active snapshot exists; counts by provider and offer reconcile with approved rows |
| R1-09 | P0 | Prove public parity | Compare DB snapshot counts and IDs against catalog API, homepage counts, provider totals, sitemap URLs, offer URLs, and outbound destinations | Automated parity report has no missing, duplicate, orphaned, or unexpected public rows |

## Warning treatment contract

| Missing fact | Public behavior | Ranking behavior |
|---|---|---|
| Effective monthly price | Do not publish the offer | Never rank |
| vCPU or RAM | Publish only when product class legitimately does not expose the field and the UI labels it “Not published” | Exclude from workload recommendations requiring that field |
| Disk | Show “Storage priced separately” or “Not published,” based on source evidence | Never interpret missing disk as zero or unlimited |
| Bandwidth | Preserve “Unmetered,” “Location dependent,” or “Not published” instead of inventing TB | Use only explicit normalized quantities in numeric filters |
| Trustpilot | Show “No reliable snapshot” | Never substitute zero; treat as unknown |
| Affiliate program | Keep provider-level commercial status separate | Never influence organic rank |

## Required tests

- All `data:*` and `db:*` checks relevant to import/publication
- Public home/catalog/offer/provider checks against the full fixture
- Destination and ranking-independence checks
- A production-mode empty-DB test
- A full import → publish → rollback → republish test

## Exit gate

The public catalog must not proceed to UI tuning until a production-like build displays the reviewed database snapshot without static offer dependencies.

---

# Phase R2 — Rebuild mobile catalog scanning without weakening desktop density

## Objective

Keep the desktop cockpit/table, but make mobile users able to understand, filter, compare, and leave through a deal without reading an 8,000 px wall of repeated facts.

## Target experience

On mobile, every collapsed result answers four questions in one glance:

1. Who sells it and what is the plan?
2. What does it cost per month?
3. What core hardware do I get?
4. What is the important catch or trust signal?

Locations, billing details, CPU type, additional badges, and commercial disclosure remain available through a deliberate expansion—not repeated at full height in every row.

## Tasks

| ID | Priority | Task | Exact implementation | Acceptance evidence |
|---|---|---|---|---|
| R2-01 | P1 | Define the mobile information hierarchy | Primary: provider/logo, plan, effective price; secondary: vCPU/RAM/disk; tertiary: location, Trustpilot, term, catch, affiliate label | Content inventory is encoded in one reusable mobile-row component, not duplicated across views |
| R2-02 | P1 | Build compact collapsed rows | Use a 3-band row: identity + price, icon-led hardware strip, then one trust/catch line with compare/deal actions | At 390 px the row is readable without horizontal scroll and substantially shorter than the current card |
| R2-03 | P1 | Add accessible progressive detail | Expand inline for locations, billing, renewal, CPU type, bandwidth, availability, catch, and disclosure; keep `aria-expanded`, focus behavior, and stable layout | Keyboard and screen reader can open/close details; collapsed rows retain enough information to decide whether to expand |
| R2-04 | P1 | Bound the initial result set | Render an initial result group, then “Show more” or URL-backed pagination; preserve search/filter/sort state and server-shareable URLs | Initial mobile page height is bounded; reaching result 30 does not require mounting all detail content immediately |
| R2-05 | P1 | Improve mobile filter access | Use one 44 px Filters button, active-filter count, compact active-filter chips, clear-all action, focus-trapped drawer, and restored focus on close | Filter state is always visible; drawer works with touch, keyboard, Escape, and screen reader labels |
| R2-06 | P1 | Make result state persistent and understandable | Keep result count, sort, active filters, and list/card choice near the catalog heading; do not hide the user’s current constraints | Back/forward navigation and shared URLs recreate the same catalog state |
| R2-07 | P1 | Add explicit loading, empty, and data-unavailable states | Skeleton rows for loading; useful zero-results recovery; separate unavailable state for DB/health failure | Users can distinguish “no matches” from “catalog failed to load” |
| R2-08 | P1 | Preserve desktop comparison density | Keep sticky header, filter rail, aligned numeric columns, mono prices/specs, and table semantics; do not convert desktop into oversized cards | Desktop can compare at least the same information per viewport as before and passes keyboard/table semantics checks |

## Mobile row target

```text
[logo] Provider · Plan                       €4.96/mo
       [CPU icon] 2 vCPU  [RAM icon] 4 GB  [Disk icon] 80 GB NVMe
       ★ 4.5 · Germany +2                    Details ▾
       [Compare]                             [Get deal ↗]
```

Icons assist scanning but never replace visible text or accessible names. Affiliate status stays adjacent to the deal action.

## Exit gate

- No horizontal page overflow at 320, 360, 390, 430, 768, 1024, 1280, and 1440 px.
- Primary mobile actions have 44 px hit areas.
- The first useful results appear without scrolling through explanatory content.
- Filter/search/sort/query state survives navigation.
- Full-data rendering remains responsive with hundreds of approved offers.

---

# Phase R3 — Accessibility and component-system correction

## Objective

Fix systemic control, semantic, contrast, and state problems once in shared primitives instead of applying one-off CSS patches page by page.

## Tasks

| ID | Priority | Task | Exact implementation | Acceptance evidence |
|---|---|---|---|---|
| R3-01 | P1 | Establish control-size tokens | Define compact desktop visual height and minimum mobile hit-area tokens; use pseudo-elements/padding when a small visual control needs a larger target | No primary mobile action or icon-only button has a hit area below 44 × 44 px |
| R3-02 | P1 | Normalize button states | One vocabulary for primary, secondary, quiet, icon, destructive, disabled, loading, hover, focus, and active states across public/admin | Same action type looks and behaves consistently across routes and themes |
| R3-03 | P1 | Label every input | Give catalog search a real label; audit correction, login, admin search, command palette, import notes, filter inputs, and selects | Accessibility tree exposes a unique name for every control; placeholders are only examples |
| R3-04 | P1 | Correct heading and landmark hierarchy | Keep exactly one `h1` per page; provider catalog title becomes `h2`; ensure main/nav/footer/section landmarks are meaningful | Automated heading check and manual outline review pass every public/admin route |
| R3-05 | P1 | Verify keyboard flows | Check nav, filters, drawer, compare, offer actions, theme, command palette, admin editing, import review, and dialogs; restore focus after overlays | No keyboard trap; Escape closes overlays; logical focus order; focused item always visible |
| R3-06 | P1 | Verify contrast in both themes | Measure body, muted, placeholder, status, disabled, chart/table, and text-on-primary combinations against WCAG AA | Normal text ≥4.5:1; large text and UI boundaries meet applicable AA requirements |
| R3-07 | P2 | Normalize icon semantics | Decorative icons use `aria-hidden`; icon-only actions have names; repeated hardware icons use consistent size/stroke and adjacent text | Screen reader output contains no meaningless icon noise or unnamed actions |

## Exit gate

Run automated accessibility checks plus a manual keyboard and 200% zoom pass. Do not mark complete from static source inspection alone.

---

# Phase R4 — Clarify and polish the public decision journey

## Objective

Improve hierarchy and comprehension on the homepage, provider pages, offer pages, compare, and footer without adding containers, decorative cards, or more text density.

## Tasks

| ID | Priority | Task | Exact implementation | Acceptance evidence |
|---|---|---|---|---|
| R4-01 | P1 | Replace the lower homepage explanation | Merge the repetitive blocks into “The details we never hide”; keep Price, Location, Hardware, Catch; add a quieter Cash due/Trustpilot/Affiliate proof strip and catalog CTA | Section is about one-third shorter, uses 15–16 px body copy and 20–22 px icons, and has no nested boxes |
| R4-02 | P1 | Make snapshot dates dynamic | Read checked/published date from the active snapshot for home, catalog, methodology, footer, updates, metadata, and structured data | No public component contains a hard-coded research date; all visible dates agree |
| R4-03 | P1 | Polish provider pages | One provider `h1`, concise trust/coverage summary, official link, published-plan count, and catalog section headed by `h2`; avoid repeating the provider name unnecessarily | Provider page communicates identity and inventory before the first row without duplicate hierarchy |
| R4-04 | P1 | Polish offer pages | Keep price, provider, hardware, location, catch, billing, verification, compare, and deal; shorten repeated prose; put the primary decision and deal action above secondary evidence | A beginner can answer fit, price, catch, and next action in the first viewport on common desktop sizes |
| R4-05 | P1 | Improve compare states | Make empty state teach “add from catalog”; make 1-item state invite a second plan; align unknown values and differences; keep clear/remove actions obvious | Compare remains useful at 0, 1, 2, 3, and 4 selected plans on mobile and desktop |
| R4-06 | P2 | Tighten site chrome and footer | Remove paused Finder references, keep Catalog/Compare/Methodology/Guides as appropriate, enlarge touch areas, and avoid tiny operational copy as navigation | Navigation reflects real features and stays usable at narrow widths |
| R4-07 | P2 | Standardize plain-language copy | Replace “listicles,” “operator snapshot” where unclear, internal IDs, prototype wording, and technical database language with beginner-facing labels | Copy review finds no internal implementation terms on decision pages unless explicitly explained |

## Homepage target copy

- **Price:** Monthly price, cash due today, and renewal.
- **Location:** Countries and cities where the server actually runs.
- **Hardware:** CPU type, RAM, storage, and bandwidth in plain English.
- **The catch:** Limits, missing extras, and support risk.
- **Cash due:** What you pay today—not the teaser price.
- **Trustpilot:** A dated snapshot, not a live rating.
- **Affiliate:** Clearly labeled and never used to rank plans.

## Exit gate

The public journey must remain visually restrained: no feature-card grid, no boxed proof strip inside a boxed section, no gradient, no decorative motion, and no extra paragraph that does not help a user decide.

---

# Phase R5 — Unify the secure admin into one real operating product

## Objective

Preserve the existing authentication, CSRF, staging, publication, rollback, and analytics logic, but present every real operation inside one coherent admin shell powered by server/database data.

## Target navigation

- Overview
- Offers
- Providers
- Imports
- Data quality
- Analytics
- Partnerships
- Operations/settings

The sidebar and command menu navigate to real routes or stable URL state. No production control may only modify local storage.

## Tasks

| ID | Priority | Task | Exact implementation | Acceptance evidence |
|---|---|---|---|---|
| R5-01 | P0 | Separate admin shell from views | Create reusable authenticated layout, sidebar, topbar, page header, table frame, empty state, status pill, field, and action components | Login aside, every authenticated admin page shares one layout and token system |
| R5-02 | P1 | Rebuild login with tokens | Remove hard-coded colors/inline layout; keep generic invalid/locked errors; add password-manager attributes, visible labels, theme support, and a clear private-area message | Login works in light/dark, keyboard, autofill, invalid, locked, and expired-session states |
| R5-03 | P0 | Connect overview to real data | Replace static/local catalog summaries with DB offer/provider/snapshot/quality/analytics queries; show last publish, blocking issues, stale records, click leaders, and operational failures | Every overview number can be traced to a query and has an honest empty state |
| R5-04 | P0 | Connect offer/provider management | Use server actions and authorization for edit, status, source, notes, affiliate program, and follow-up fields; keep optimistic UI limited to reversible presentation | Refreshing or using another browser preserves approved changes |
| R5-05 | P0 | Integrate import review | Move start review, preview counts, unresolved issues, resolution notes, approve/publish, snapshots, and rollback from the inline-styled page into the admin shell | Full import workflow completes without leaving admin navigation and retains all security checks |
| R5-06 | P1 | Add safe publication confirmation | Before publish, summarize created/updated/hidden/rejected, unresolved blockers, source hash, and snapshot label; destructive rollback requires explicit target confirmation | Owner cannot accidentally publish unresolved blockers or roll back the wrong snapshot |
| R5-07 | P1 | Make analytics operational | Show real most-clicked offers/providers, unique sessions, placements, country visitors, outbound rate, conversion/revenue when imported, and “not collected yet” instead of fabricated values | Dashboard never presents planned metrics as measured data |
| R5-08 | P1 | Standardize dense admin tables | Use readable 11–14 px text, sticky headings where useful, controlled horizontal scroll, flags/logos, consistent numeric alignment, and 44 px mobile actions | Tables remain compact on desktop and operable on mobile without shrinking text to 8–9 px |
| R5-09 | P1 | Add durable action feedback | Pending, success, validation error, authorization failure, conflict, stale form, and server error states; include request ID where support needs it | Every mutation has visible result and cannot silently fail |

## Admin design rules

- Dark mode is a first-class twin, not an inverted afterthought.
- Analytics answer a decision; they do not decorate the dashboard.
- Country/visitor data uses flags plus accessible country names.
- Tables may be dense, but normal explanatory text must not drop to 8–9 px.
- Use inline/progressive editing before modal dialogs.
- Commercial metrics remain visibly separate from organic ranking controls.

## Exit gate

Admin is complete only when a fresh authenticated browser can review data, change a record, publish a snapshot, inspect analytics, and see the same durable state after refresh. A beautiful localStorage prototype does not count.

---

# Phase R6 — Remove paused feature residue and harden runtime behavior

## Objective

Remove misleading Finder/prototype residue, fix the development security-policy conflict, and ensure performance/error behavior remains simple and observable.

## Tasks

| ID | Priority | Task | Exact implementation | Acceptance evidence |
|---|---|---|---|---|
| R6-01 | P2 | Define Finder archival boundary | Keep `/for-me` redirect for old links; remove Finder from visible navigation, sitemap, tests, dashboards, and active product documentation; decide whether component/rule code moves to an archive branch or is deleted | No public/admin surface suggests Finder is currently available |
| R6-02 | P2 | Clean analytics taxonomy | Stop accepting new `finder_start`/`finder_complete` events; preserve historical rows; remove Finder funnel labels from current dashboards; document schema compatibility | Current analytics contain no impossible Finder KPIs while old data remains queryable if needed |
| R6-03 | P1 | Split development and production CSP | Permit only the minimum framework development requirement in development; retain strict production `script-src` without `unsafe-eval`; keep all other headers consistent | Local console has no CSP framework error; production header regression proves `unsafe-eval` absent |
| R6-04 | P1 | Audit client bundle and rendering | Keep Server Components by default; lazy-load noncritical admin/compare behavior; avoid mounting hidden detail content for hundreds of rows; preserve fixed logo dimensions | Bundle report and interaction profile show no avoidable large client dependency or mass hidden rendering |
| R6-05 | P1 | Verify media and logo behavior | Normalize logo canvas/contain sizing, dimensions, fallbacks, alt semantics, and lazy loading below the fold | Provider logos have consistent optical size without stretch, layout shift, or unreadable tiny marks |
| R6-06 | P1 | Harden unavailable/error states | Database unavailable, empty publication, invalid offer, retired provider, broken destination, analytics failure, and admin action failure each receive truthful bounded behavior | No exception exposes raw internals; request IDs and health status support diagnosis |
| R6-07 | P2 | Remove stale prototype wording and package metadata | Change package/README status from “interactive prototype” to accurate pre-production application wording after the real data path is active | Documentation and runtime product labels agree with actual state |

## Exit gate

Development must be clean enough to expose real application errors, production headers must stay strict, and no removed feature may continue generating current-product metrics.

---

# Phase R7 — Full-data QA and real production rehearsal

## Objective

Prove the repaired application with the complete approved dataset in real production conditions before opening traffic.

## Tasks

| ID | Priority | Task | Exact implementation | Acceptance evidence |
|---|---|---|---|---|
| R7-01 | P0 | Run the complete automated gate | Execute remediation, data, DB, import, admin auth/CSRF, public, analytics, operations, launch, lint, build, audit, and dependency checks | One dated report records commands, versions, counts, and zero unresolved P0/P1 failures |
| R7-02 | P0 | Test the full approved dataset | Exercise catalog filters, provider pages, offer pages, compare, sitemap, destinations, admin lists, and analytics with every published record | No orphan, crash, missing provider, duplicate ID, broken route, or impossible numeric value |
| R7-03 | P1 | Complete viewport/theme matrix | Manually test 320, 360, 390, 430, 768, 1024, 1280, 1440 and 200% zoom in light/dark for primary routes | QA table records pass/fail and screenshots for every critical surface |
| R7-04 | P1 | Complete assistive-technology pass | Keyboard-only, screen-reader spot check, focus restoration, reduced motion, high zoom, labels, headings, and error announcements | No task-blocking accessibility issue remains |
| R7-05 | P1 | Measure performance budgets | Measure LCP, INP, CLS, catalog server response, filter interaction, and outbound redirect latency with cold/mobile profiles | Meets documented budgets or has an explicit owner-approved launch exception |
| R7-06 | P0 | Deploy to the selected VPS | Configure production environment, persistent SQLite/evidence storage, migrations, Caddy, Cloudflare DNS/proxy, email, monitoring, and secrets | Public readiness/health and protected admin work over HTTPS on the production hostname |
| R7-07 | P0 | Prove backup, restore, rollback, and alerts | Create encrypted R2 backup, restore into a clean location, validate integrity/counts, test application rollback, trigger/receive an alert | Dated recovery record proves each path rather than only documenting it |
| R7-08 | P0 | Conduct final launch review | Verify publication date/counts, affiliate labels/destinations, corrections/contact, privacy, no secrets, no unresolved blocker, and owner admin access | Launch checklist signed; production traffic opens only after all P0 gates pass |

## Release rule

P2 polish may move after launch. P0 truth/security/recovery work and P1 primary-journey accessibility/mobile issues may not.

---

# Phase R8 — Guides and Research after truth and launch gates

## Objective

Execute Phase 10 from [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) only after the catalog is a trustworthy source worth linking to.

## Sequence

1. Confirm **Guides** naming and five-topic taxonomy.
2. Add typed MDX/frontmatter validation.
3. Build `/guides` and `/guides/[slug]` in the existing public design system.
4. Add author/editorial policy, RSS, sitemap, canonical metadata, `BlogPosting`, and breadcrumbs.
5. Link articles to prefiltered catalog/provider/offer pages and measure content-to-catalog actions.
6. Publish six foundational guides, then one reproducible 457-row dataset report.
7. Add source/date/disclosure/freshness checks before expanding volume.
8. Evaluate an admin editor only after Git/MDX proves too costly in actual use.

## Exit gate

No article launches without a named author, sources, published/updated dates, snapshot date where relevant, disclosure, useful catalog action, and a real reader question. Do not trade the project's trust for page count.

---

# Master execution order

| Order | Phase | Outcome | May overlap? |
|---:|---|---|---|
| 1 | R0 | Regression evidence and fixed target | No; required first |
| 2 | R1 | One reviewed data truth | No; blocks meaningful UI QA |
| 3 | R2 | Scannable desktop/mobile catalog | R3 can begin after mobile hierarchy is fixed |
| 4 | R3 | Accessible shared component system | Can overlap late R2 with non-conflicting files |
| 5 | R4 | Clear public journey | After R2/R3 primitives stabilize |
| 6 | R5 | Unified real admin | Can overlap R4 with separate file ownership, but publication contracts come from R1 |
| 7 | R6 | Clean product/runtime residue | After current analytics and navigation behavior are understood |
| 8 | R7 | Full-data production proof | No launch before completion |
| 9 | R8 | Guides/Research growth | After truth and launch gates; content preparation may begin earlier |

## Task execution rule

For every task:

1. read the relevant source and existing tests;
2. state the exact observable behavior being changed;
3. add or update the failing regression test first where practical;
4. implement the smallest coherent change;
5. run focused tests, then lint/build when the task affects runtime code;
6. inspect the changed route in light/dark and relevant viewports;
7. update the task evidence in `docs/archive/PROJECT_PROGRESS.md`;
8. commit and push that completed task before starting the next one;
9. at each phase exit, run the whole phase gate and fix regressions before moving forward.

## Definition of done for the remediation program

The remediation is complete when the application uses one reviewed database snapshot, exposes the complete approved catalog, passes primary mobile/desktop tasks accessibly, operates through one durable secure admin, contains no misleading active prototype features, runs with strict production security and clean development diagnostics, and survives a real deployment/backup/restore/rollback rehearsal.
