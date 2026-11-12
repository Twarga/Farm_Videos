# DESIGN.md

## Governing references

1. Owner-approved reference: [finished Shore mockup](brand/shore/mockup/index.html), its unchanged shore.css/shore.js, and the owner's explicit no-redesign instruction. These confirm presentation, interaction and breakpoints.
2. [V1 implementation plan](docs/V1_IMPLEMENTATION_PLAN.md) governs phase order, safe defaults, data/publication boundaries and admin requirements. Its D-1…D-5 register supersedes the earlier design proposal's differently numbered decisions.
3. [Product contract](docs/product/PRODUCT_CONTRACT.md) retains evidence, URL, accessibility and security invariants.
4. [Earlier design proposal](docs/design/V1_SHORE_DESIGN_PLAN.md) is supporting context only where it agrees with the approved mockup. The standalone admin preview is a proposal, not an owner-approved public reference.

Highlighter-specific presentation decisions are superseded by the owner's Shore instruction. Their full historical record is preserved in [DESIGN_HIGHLIGHTER_2026-10-12.md](docs/archive/DESIGN_HIGHLIGHTER_2026-10-12.md), not silently discarded. Data, ranking, privacy, accessibility and security rules have not been superseded.

## Decisions

### Global
#### Sistema
- 2026-10-24 — The public visual/behavior reference is brand/shore/mockup; preserve its classes and CSS rather than rewriting into utility styles.
- 2026-10-24 — Shore tokens come from the approved shore.css; consume semantic variables, self-host Ubuntu Sans / Ubuntu Sans Mono and preserve the reference type/radius scales. No second generated token system is introduced during the faithful port. The unmodified source stylesheet and Patchwork CSS are checked by exact-reference parity instead of the superseded no-raw-size rule; integration styles retain token discipline.
- 2026-10-24 — Theme uses shore-theme persistence, otherwise the visitor's system preference, with first-paint bootstrap. Night/day art follows the finished mockup, superseding the earlier proposal's always-night scene rule.
- 2026-10-24 — Crab/shell identity replaces the Highlighter tile; light, dark, one-colour and simplified small-size assets remain one family.
- 2026-10-24 — Preserve 640/768/1024/1280 responsive tiers where the reference uses them; prove screenshot parity at 390/768/1440 in both themes and prevent page overflow at supported narrow widths.
- 2026-10-25 — Day-shore small text on sand uses `--footer-evidence` #835500, not `--lantern` #8a5a00; measured 5.72:1 on #f7f1e6 and 4.51:1 on #ead6ae.

#### Patrones
- 2026-10-24 — Public surfaces keep literal navigation, one main/h1, visible focus, keyboard-operable controls, Escape/focus restoration for overlays, 44px primary targets and explicit loading/no-match/unavailable/error states.
- 2026-10-24 — Import public numbers only from the active publication; preserve unknowns, evidence dates, review scope and direct/affiliate disclosure. Visual emphasis never approves a claim.
- 2026-10-24 — Use the reference's motion only where it communicates state/story; honor reduced motion, hidden-page/offscreen pause, immediate content and no artificial waiting.
- 2026-10-24 — Catalog query keys, canonical offer/provider/guide URLs, /for-me compatibility, compare max four and /go/[id] outbound behavior survive the port.
- 2026-10-24 — Provider logos are identity marks, not endorsements; third-party trademark/usage permissions are reviewed independently of mockup approval.
- 2026-10-25 — Shore unknown facts use `--text-muted`, and selected segments pair `--brand` with `--on-brand`; legacy Highlighter overrides measured 4.38:1 and 4.08:1 in night surfaces.

### Public shell
#### All public routes — shared frame

- 2026-10-24 — Port the exact header/footer, lantern theme toggle, pail count, mobile menu, skip link and tide line from the approved mockup; never ship its Mockup panel or reduced-motion review switch.
- 2026-10-24 — The existing Pages Router catalog and App Router routes consume the same frame/theme; no routing migration is implied by the handoff's mistaken src/app/catalog path.

### Catalog
#### /catalog — plans
- 2026-10-24 — D-1: catalog search remains hidden by default through catalogSearch=false; q parsing and old URLs stay compatible. Provider-directory name search is allowed.
- 2026-10-24 — D-3: budget and list amounts share displayPriceUsd; retain only supported renewal context, unknown values and the current eligible-cohort ranking semantics.
- 2026-10-24 — Keep list/cards, 24/48/96 page sizes, page clamping and reference filter-sheet behavior. Review marks remain scoped to approved price terms, not provider performance.
- 2026-10-25 — Exception to Global/Sistema source color: day transfer-spec labels use #0b6c5d instead of #0f7a6b; measured contrast improves from 4.20:1 to 5.09:1 on the fixture background.
- 2026-10-25 — Filter rail controls fill a single-column grid row sized to their actual hit areas; 44px sliders/chips must not overlap the next filter or sticky drawer controls.
- 2026-10-27 — The mockup's “Best first” is approved only as the catalog direction control label. Brand voice checks continue to reject “best” in all other public copy and in operator-authored editorial text.
- 2026-10-27 — When the 1180px sheet breakpoint hides the filter rail, results take the full row: the catalog body is a wrapping flex layout, not a second grid. No media query outside the canonical 640/768/1024/1280 tiers is added.
- 2026-10-27 — Filter chips and sliders keep a 45px minimum hit area rather than 44px: sub-pixel rounding measured 43.99997px on mobile and desktop-dark. Every other primary target stays 44px.
- 2026-10-24 — Exception to Global/Sistema source color: day disk-spec labels use --footer-evidence #835500 instead of #9a6200 because the source color measures 4.46:1 on sand and misses WCAG AA for 14px text.
- 2026-10-27 — Pick feedback reuses the shared pail and status region: the notice is the existing `role="status"` element restyled with the mockup toast edge, the count is remounted under a key so `count-pop` fires, and the flying shell is a separate on-demand chunk. It never enters the catalog's first-load JavaScript budget.
- 2026-10-27 — The loading row's Keeper is handed to the client as static server art instead of importing `art.bear` into the catalog chunk. The walk strip and bear are decorative (`aria-hidden`), and the row keeps `role="status"`.

### Home
#### / — shore finder
- 2026-10-24 — The approved home finder is a plain constraint form, not a revival of the paused /for-me workload product. Counts and one-per-provider shell choices derive from published catalog semantics.
- 2026-10-25 — Finder labels stack above controls at narrow widths; override the shared legacy `.field` flex pattern to keep each selector full-width and non-overlapping at 320px.
- 2026-10-25 — Keep Highlighter `.finder` layout rules scoped to `.hx`; Shore controls fill their grid tracks without inheriting legacy field padding/borders.
- 2026-10-27 — The finder tells the mockup story in order: reasons appear on failing shells, then leaving shells fade, entering picks animate in, the first pick gets the ribbon and the VM hops. "Nothing fits" keeps the failing shells labelled, shows up to three relax chips (memory down, budget up, any region) and a shivering VM.
- 2026-10-27 — Reduced motion commits the same final state synchronously: no `.enter`, `.leave` or intermediate pose; the ribbon and count remain readable. The count pops by remounting under a key, not by a timer.

- 2026-10-31 — Home motion follows the mockup: hero shells walk in on first paint, the pointer lantern lifts nearby shells (fine pointers only), proof counters roll up and step tiles act out working/quirk/success once in view, then rest. All skipped under reduced motion. Step 3 shows the chosen plan's mini shell; the contact crab holds the ringing phone.
### Compare
#### /compare — side-by-side plans
- 2026-10-25 — Empty comparison uses the mockup's pail art, copy and state layout; winner callouts use Shore semantic colors, never Highlighter accent surfaces.
- 2026-10-27 — The compare table sews columns with one SVG thread and lights only rows that differ; the "Only show what differs" control hides `.same` rows without removing them from the accessible table. "Add a plan" and "Clear" stay visible because the large-profile journeys and the empty state need both actions.
- 2026-10-27 — Every public route enters through a `.page` wrapper (`page-in`), including the home route's `.page--home`. The lantern theme switch keeps the view transition; reduced motion switches instantly with no `lit` or `waving` class.

### Content
#### Guides / legal / methodology — reading pages
- 2026-10-24 — Keep existing guide content/slugs and author attribution where the fixture differs; methodology states actual score behavior. D-4 keeps existing legal copy until replacement approval. D-2 ships no email signup.
- 2026-10-31 — Guide index cards carry the mockup's night tile art (the crab, cycling working/quirk/success/idle/working/error poses) above the text, matching `renderGuides()`.
- 2026-10-31 — The reading-page TOC marks the active link with `aria-current="true"` as well as `.on`; a TOC click owns the highlight for 1.2 s so the scroll-spy cannot move it mid-jump. Guide markdown headings use bare ids (`<DocToc bare>`).

### Admin
#### /admin and operating views — owner workspace
- 2026-10-24 — Exception to Global/Sistema theme default: admin starts in night theme per implementation plan §7; share Shore tokens and controls, but no characters or motion, because admin is an operating tool.
- 2026-10-24 — Preserve MFA/session/CSRF/audit controls and explicit staged publish/rollback transactions. Never replace the working admin with the standalone visual preview.
- 2026-10-24 — Missing operational measurements show unavailable/not connected, not fabricated healthy values; preview-only research counts never become publication counts.
- 2026-10-24 — New record views reuse AdminShell/AdminSidebar and one responsive data table; admin actions require server authorization and transactional audit, with explicit typed confirmation for rollback.
- 2026-10-27 — Admin navigation uses one route per job, a 232 px plain Shore sidebar with an independently scrolling nav, and a pinned footer. The overview sends only count and status summaries to the browser; missing publication or operational evidence is labeled explicitly.
- 2026-10-27 — Accessibility scans wait for finite entrance animations to settle before measuring contrast. The 320ms admin-rise fade reported false failures while `main` was partly transparent; the underlying tokens meet AA.
- 2026-10-27 — The admin data table's horizontal scroll wrapper is a focusable region named after the table caption, so keyboard users can scroll it instead of tabbing past clipped columns.
- 2026-10-31 — Every admin table scroll wrapper is `position: relative`, so absolutely positioned screen-reader text inside cells stays clipped (the price-terms queue pushed a 390 px page to 695 px).
- 2026-10-31 — A rejected admin form save keeps what the owner typed (React resets forms after actions; the homepage X-ray control now restores its submitted values).

### Delivery
#### Release candidate — readiness without deployment
- 2026-10-24 — Owner requests autonomous implementation using safe defaults, with lint/type/tests plus phase checks before advancing; build a production-ready release candidate first and defer deployment/production configuration changes until separately authorized.

## V1 visual review decisions (1 Nov 2026)

- Compared every public route and the admin routes against the mockup at 1440 and 390 px, night theme, with `scripts/audit/review-pairs.mjs` (`APP_ORIGIN` selects the app). Element counts match within a few percent and no route overflows horizontally.
- Special offers: the mockup shows 15 deals; the app shows the honest empty state ("No deal matches", 0 deals) because no promotion has a confirmed, fresh, dated billing amount. This is intentional and not a gap to close with invented deals.
- Guide article: the mockup article ("The intro price is not the price") has no counterpart; the app renders its own dated articles in the same layout.
- Admin documents render without the public brand sprite, header art and footer.
