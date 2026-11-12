# bestvpsforme V1 design plan: "The Shore"

**Written:** 23 October 2026
**Status:** plan for owner review. No code changed yet.
**Scope:** the V1 website remake from [Scope.md](../../Scope.md), section 8–12.

---

## The one-minute version

**Your server is a shell. Your project is a little machine looking for a home. The Hermit Crab tries every shell and finds the one that fits. The Keeper's lantern shows the fine print.**

- The site moves into the TwargaOps night world: stitched art, felt characters, lantern light.
- The crab appears on every page and every state: home, empty results, loading, errors, compare, 404, footer.
- Prices and tables stay clean, fast and readable. It is still a tool.
- Seven signature moments give the wow. Each one shows something true.
- We keep the current backend, routes and data rules. We change the look, the motion and the empty/error states.

**Next step:** approve the 5 decisions in [section 16](#decisions). Then we build the identity board and one vertical slice (home, catalog, offer page) for review.

![Frames from the existing bestvpsforme launch film](v1-shore/reference/film-frames.jpg)

*Reference: frames from `design_system/brand/characters/v2/bestvpsforme.mp4`. This is the world we bring into the website.*

---

## Contents

1. [The idea: every picture is a real thing](#idea)
2. [Keep, change, remove](#keep-change)
3. [Identity: logo and wordmark](#identity)
4. [Colour tokens, with measured contrast](#color)
5. [Type](#type)
6. [Texture, shape and icons](#texture)
7. [The crab system: avatar on everything](#crab)
8. [Seven signature moments (the wow)](#wow)
9. [Page by page](#pages)
10. [Motion system](#motion)
11. [Layout and responsive](#layout)
12. [Accessibility](#a11y)
13. [Performance and how we build the art](#perf)
14. [Anti-slop rules](#anti-slop)
15. [Build plan in phases](#phases)
16. [Decisions for the owner](#decisions)
17. [Risks](#risks)
18. [References](#references)

---

<a id="idea"></a>
## 1. The idea: every picture is a real thing

The bestvpsforme film already tells the story: the crab wakes, meets a homeless little machine, tries shells ("Too small. Too pricey."), gets stuck in one that is too tight, then finds the right home.

The website uses the same story. **Every story object maps to a real function.** If a picture does not map to a fact or a state, we cut it.

| Story object | What it means on the site |
|---|---|
| A shell | One VPS plan |
| The little machine (Baby VM) | Your project and its needs (RAM, CPU, budget, region) |
| "Too small" | Plan is below your RAM/CPU/disk needs |
| "Too pricey" | Plan is above your budget |
| "This one" with a green ✓ | Plan fits your needs and its price is reviewed |
| The Keeper's lantern light | Evidence: check dates, sources, keyboard focus |
| Price tag on a thread | The cost receipt |
| Thread from a tag to a source | Where a fact came from (provenance) |
| A fish hook | "The catch": a caveat on the plan |
| The tide line | The snapshot date of the data |
| A pail of shells | Your compare selection (up to 4) |
| A shell too tight, dizzy crab | No results or an error |
| An empty shell, crab asleep | 404 page |
| Shells washed ashore | Special offers |
| The tide log | Updates page |
| A bottle with a note | Corrections form |

The crab's line becomes the product promise: **Too small. Too pricey. This one.**

---

<a id="keep-change"></a>
## 2. Keep, change, remove

### Keep
- All routes and URLs, including `/for-me` redirect and catalog query URLs.
- Catalog table density, left filter rail, cards view, page sizes 24/48/96.
- Compare up to 4 plans.
- Offer receipt facts, unknowns shown as unknown, affiliate label next to the button.
- Data, ranking, publication, admin logic. No change.
- Breakpoints 640/768/1024/1280.

### Change
- Brand: Highlighter becomes The Shore.
- Fonts, colours, icons, header, footer.
- Home hero becomes a live shore finder (W1).
- Empty, loading, error, 404 and no-data states get the crab (W6).
- Offer page cost chart becomes the Cost Shell (W3) plus evidence threads (W4).
- Compare page gets mini Cost Shells and fit verdicts (W3, W5).
- Special offers and Updates get their own story treatment.

### Remove
- Volt highlighter swipes and volt fills.
- The ink-tile logo and "iorme" volt box.
- Mona Sans and Geist Mono.
- Generic grey empty boxes (like the current empty compare page).

---

<a id="identity"></a>
## 3. Identity: logo and wordmark

![The film's title mark](v1-shore/reference/film-title-mark.jpg)

*The launch film already ends on this mark: Bear and Crab on a stitched horizon, "bestvps" in chalk, "forme" in violet.*

### 3.1 Product mark
- **The crab peeking out of its violet spiral shell.** No tile, no rectangle behind it. The films rejected tiles behind the bear logo; the crab follows the same rule.
- Three drawings, one character:

| Size | Drawing |
|---|---|
| 64 px and up | Full Patchwork crab: felt, stitches, eye stalks, shell spiral |
| 24–48 px | Simplified felt: flat colours, one stitch line, no texture |
| 16 px favicon | Silhouette: spiral shell plus two eye stalks |

### 3.2 Wordmark
- **bestvps** in chalk (night) or ink (day). **forme** in violet.
- Ubuntu Sans 700, same as the film title and twargaops.com.
- Tagline: *Too small. Too pricey. This one.*

### 3.3 Lockups
- Horizontal: mark + wordmark (header).
- Stacked: mark over wordmark (social, app icon).
- Company: wordmark + "a TwargaOps product" + small Keeper (footer, about).
- Launch mark: Bear + Crab on the horizon (film, launch posts, OG card only).

### 3.4 Deliverables
- SVG sources for every variant, light and dark, plus one-colour.
- `favicon.ico` (16/32/48), `apple-icon.png`, maskable 512 icon.
- OG cards: home, offer (generated), guide (generated).
- Clear-space and minimum-size rules.
- A review board: `brand/shore/index.html`, the same idea as the v5 `sheet.html`.

---

<a id="color"></a>
## 4. Colour tokens, with measured contrast

Contrast ratios were calculated for this plan (WCAG formula). AA needs 4.5:1 for normal text and 3:1 for large text and control boundaries.

### 4.1 Roles first
- **Violet (shell)** is the product colour: primary buttons, links, selection, "forme".
- **Amber (lantern)** is evidence: focus ring, check dates, the lantern beam.
- **Green** means fits or reviewed: the ✓.
- **Red-coral** means the catch: caveats, with the hook icon.
- **Coral (crab body)** is only for the character. Never text, never buttons.
- Colour never carries meaning alone. Every state also has a word or icon.

### 4.2 Night tide (dark)

| Token | Hex | Use | Contrast on bg / surface / raised |
|---|---|---|---|
| `--bg` | `#070a1c` | Page | (base) |
| `--surface` | `#0e1330` | Panels, table | (base) |
| `--raised` | `#161c40` | Menus, sheets | (base) |
| `--text` | `#efe3c8` | Body text (chalk) | 15.4 / 14.3 / 12.9 |
| `--text-muted` | `#a79f8c` | Secondary text | 7.5 / 6.9 / 6.3 |
| `--text-faint` | `#8c8577` | Meta text | 5.4 / 5.0 / 4.5 |
| `--accent` | `#9b7bff` | Links, selected | 6.2 / 5.8 / 5.2 |
| `--accent-hover` | `#b8a4ff` | Link hover | 9.2 / 8.5 / 7.7 |
| `--lantern` | `#e9a23b` | Focus, evidence | 9.1 / 8.4 / 7.6 |
| `--fit` | `#3ddc84` | ✓ Fits / reviewed | 11.0 / 10.2 / 9.2 |
| `--catch` | `#ff7a6b` | The catch | 7.7 / 7.1 / 6.5 |
| `--border-control` | `#6a72a3` | Inputs, buttons | 4.3 / 3.9 / 3.6 |
| `--hairline` | `#2a3160` | Row dividers only | decorative |
| `--crab` | `#e89d88` | Character only | n/a |

- Primary button: violet fill `#9b7bff` with night text `#070a1c`: **6.2:1**.
- **Never** chalk text on violet: 2.5:1, fails.
- The v4 faint `#6f6a5d` measures 3.6:1 on night. Use it for decoration only, not text.

### 4.3 Day shore (light)

| Token | Hex | Use | Contrast on bg / surface / raised |
|---|---|---|---|
| `--bg` | `#f7f1e6` | Page (sand paper) | (base) |
| `--surface` | `#fffaf1` | Panels, table | (base) |
| `--raised` | `#efe6d5` | Menus, sheets | (base) |
| `--text` | `#1f1d2b` | Body text (ink) | 14.7 / 15.9 / 13.4 |
| `--text-muted` | `#4f4b46` | Secondary | 7.7 / 8.3 / 7.0 |
| `--text-faint` | `#6b655d` | Meta | 5.1 / 5.5 / 4.65 |
| `--accent` | `#5c47a8` | Links, selected | 6.4 / 6.9 / 5.8 |
| `--lantern` | `#8a5a00` | Evidence text | 5.3 / 5.7 / 4.8 |
| `--fit` | `#17663a` | ✓ Fits | 6.2 / – / 5.7 |
| `--catch` | `#b3261e` | The catch | 5.8 / 6.3 / 5.3 |
| `--border-control` | `#857a66` | Inputs, buttons | 3.8 / 4.1 / 3.4 |

- Primary button: `#5c47a8` with white text: **7.2:1**.
- Day focus ring: ink `#1f1d2b` with an amber halo for the lantern feel.
- `#1d7a45` green fails on raised (4.3:1). Use `#17663a`.

### 4.4 Scenes
- Story scenes (home hero, 404, tide log) are always night, in both themes. They are illustrations, like a film still.
- Data surfaces follow the theme.

---

<a id="type"></a>
## 5. Type

| Role | Font | Size |
|---|---|---|
| Home display | Ubuntu Sans 700 | clamp(40px, 6vw, 76px) |
| Page title | Ubuntu Sans 700 | 30–48 px (contract range) |
| Section heading | Ubuntu Sans 600 | 22–28 px |
| Body | Ubuntu Sans 400 | 16 px, line-height 1.55 |
| Reading pages | Ubuntu Sans 400 | 18 px, 720 px column |
| Small / meta | Ubuntu Sans 400 | 14 px minimum |
| Prices, specs, IDs | Ubuntu Sans Mono 500, tabular | role-based |

- Same family as twargaops.com v4 and the films.
- No handwriting font in the product. Patrick Hand stays on twarga.tech.
- Load with `next/font` from local files; keep the existing six size tokens (`--t-display`, `--t-title`, `--t-heading`, `--t-body`, `--t-small`, `--t-num*`) and change their values. `src/styles/css-system.test.ts` keeps guarding them.

---

<a id="texture"></a>
## 6. Texture, shape and icons

### 6.1 The five marks of the world
1. **Stitch line:** dashed chalk outline, 1.5 px, dash 6 / gap 4. For cards in scenes, empty states, the Cost Shell.
2. **Felt patch:** slightly rotated (−1.5°) chip with a hatch texture, like the v4 status chips. Only for status chips and active filters.
3. **Halftone sand:** dot texture on scene floors only.
4. **Paper grain:** 3–4% noise on scenes only. **Never behind tables or prices.**
5. **Lantern glow:** soft amber halo with no hard edge. For focus and evidence.

### 6.2 Shape
- Radii: 6 (controls), 10 (cards), 16 (sheets), pill (chips).
- No shadows on data surfaces. Felt patches get a small offset shadow, like fabric on paper.
- No gradients as decoration, no glass blur.

### 6.3 Icons
- **A custom stitched set of about 20 brand icons**, 24 px, 1.75 stroke, round caps, one dashed accent stroke:
  shell (plan), pail (compare), tag (price), hook (catch), lantern (evidence), tide (updates), bottle (corrections), check (fits), compass (region), chip (CPU), memory, disk, transfer arrows, IPv4 pin, shield (backups), wrench (managed), moon/sun (theme), crab claw (filters).
- Keep Phosphor for generic icons (chevrons, close, external link) with matching stroke weight.

---

<a id="crab"></a>
## 7. The crab system: avatar on everything

### 7.1 The cast in bestvpsforme

| Character | Role on the site |
|---|---|
| **Hermit Crab, the Shell Shopper** | Main character. Every page. Reacts to what you do. |
| **Baby VM** | Your project. It grows with the RAM you pick. |
| **Shells** | Plans. Real plans in scenes are real links. |
| **The Keeper (bear)** | Cameo: methodology ("who checks the fine print"), footer ("a TwargaOps product"). |

### 7.2 Pose library

Existing moves from `lore.js`, already built in `styles/patchwork.js`:

| Pose | From lore |
|---|---|
| `idle` | Eye stalks look around, claw clicks, shell bobs |
| `working` | Eyes two shells, crosses one off, ✓ on the other |
| `quirk` | Ducks in, peeks out, squints at a price tag |
| `success` | Sideways victory dance, both claws up |
| `error` | Squeezed into a too-tight shell, dizzy eyes |
| `sleep` | Tucked in, sleepy eye stalks drooping out |

New poses to draw for V1, same kit and stitches:

| New pose | Used for |
|---|---|
| `present` | Holds up a price tag toward content (offer page, home) |
| `carry` | Carries the compare pail (compare page, full pail) |
| `measure` | Holds a tape against a shell: "too small" (fit verdicts) |
| `push` | Pushes the right shell forward: "this one" (best match) |
| `peek` | Only eyes above the shell rim (header mark) |
| `wave` | One claw wave (footer, success messages) |
| `read` | Squints at a long receipt (methodology, guides) |
| `bottle` | Sends a bottle out to sea (corrections success) |

Baby VM sizes, matched to the existing RAM steps: **S** (up to 2 GB), **M** (4–8 GB), **L** (16 GB and up). States: `idle`, `shiver` (no home), `happy` (found home). All three exist in the film's `drawBabyVM`.

### 7.3 Where the crab appears (every page, every state)

| Surface | Crab | Trigger |
|---|---|---|
| Header logo | `peek`; ducks in when you scroll down, peeks out when you scroll up | Scroll direction |
| Favicon | Blinking crab | Always (static under reduced motion) |
| Home hero | Full scene: crab, Baby VM, shells | W1 |
| Catalog loading | `working` | Request longer than 300 ms |
| Catalog no results | `error` (tight shell) | Zero matches |
| Catalog no data | Tide out, crab `sleep` | Publication unavailable |
| Compare tray / header | Pail with shells | Selection count |
| Compare empty | `carry` with an empty pail | 0 plans |
| Compare full | `carry`, pail overflowing | 4 plans, tries a 5th |
| Offer page | `present` beside the price tag | Page load (once) |
| Offer page, terms unknown | `quirk` squinting at the tag | Price not reviewed |
| Provider page | Small shell house with the provider's mark | Header |
| Special offers | Shells washed ashore | Page header |
| Guides | `read` | Guide header |
| Methodology | Keeper and crab reading the receipt by the lantern | Page header |
| Updates | Tide log scene | Page header |
| Corrections | `bottle` | Form success |
| 404 | Empty shell, crab `sleep` | Not found |
| Error page | `error`, then a "Try again" button | Crash |
| Footer | `wave`, beside a small Keeper | Always |
| OG / social cards | Crab with the plan's price tag | Generated |

### 7.4 Where the crab never goes
- Inside table cells, price numbers or spec values.
- As the only content of a button. Buttons keep their words.
- Over form fields or in front of results.
- In legal text.
- Moving while you type.

This keeps the crab everywhere you look but never in the way of a decision. It also follows the company rule: characters live in the story canvas, not as generic UI chrome.

### 7.5 Pixel crab
The terminal Pixel crab belongs to the V2 CLI. V1 does not show fake terminal sessions.

---

<a id="wow"></a>
## 8. Seven signature moments (the wow)

Each moment answers: **what do you see, what does it tell you, how does it work, what happens without motion.**

### W1. Home: "Find your machine a home"

**You see:** a night shore. The crab, a little Baby VM, and 5–7 shells. The shells are **real plans**: the current top of "Ranked by value score". Each has a felt price tag.

**You do:** pick RAM, budget and region in three plain controls under the headline.
- Pick more RAM: the Baby VM grows (S, M, L).
- Shells that no longer fit dim and get a tag: "Too small" or "Too pricey".
- The count rolls: **"37 plans fit"**.
- The crab runs `working`, then `success` when matches exist, `error` when none do.
- Button: **"Show the 37 plans"** opens `/catalog?ram=…&price=…&regions=…`.

**It tells you:** how many real plans fit before you open the catalog.

**How it works:**
- The server sends a tiny count table (RAM step × budget step × region), computed with the same `filterOffers`. No offer list goes to the browser.
- The crab and shells are inline SVG with CSS animation. The shore painting is a prerendered image.
- The pointer is a lantern (as on twargaops.com): shells light up as it passes.
- Each shell is a real link with a name like "Cloud VPS 1 GB, Liquid Web, $5.00 a month, value rank 1".

**Without motion:** same scene as a still, same form, same count text.

**Headline:** "The right server, at an honest price." (the line twargaops.com already uses). Sub: live plan and provider counts from the active snapshot, plus "Paid links never change the ranking."

### W2. The compare pail

**You see:** tick "Compare" on a catalog row. A small shell flies from the row into the pail in the header. The pail bobs once. The button text updates: "Compare 2".

**At 4 plans:** the pail is full. Trying a 5th makes the crab do `carry` with a wobble, and a message says "You can compare up to 4. Remove one first."

**It tells you:** your selection was saved, and where it went.

**How it works:** FLIP animation with the Web Animations API, 280 ms, transform only. A live region says "Added Cloud VPS 1 GB. 2 of 4 selected."

**Without motion:** no flight. The count updates and the live region speaks.

### W3. The Cost Shell

**You see:** on the offer page, a spiral shell made of 36 stitched segments, one per month.
- Segment thickness = that month's cost. The jump at renewal is visible at a glance.
- Intro months glow amber (lantern). Renewal months are violet.
- The setup fee is a knot at the centre, sized by the fee.
- Unknown months are dashed empty stitches with "Not published".
- Centre label: "36 months · $180 total · $5.00/mo average".

**On compare:** each column header has a mini Cost Shell. You see which plan jumps at renewal before reading a row.

**It tells you:** what you pay over 3 years and when the price jumps.

**How it works:**
- SVG computed from the existing `reviewedPrice` / `serviceCostProjection` series. Same numbers as today's chart.
- Shown only when `reviewedPrice` returns a value. Otherwise the shell is drawn empty with "Not enough reviewed terms for a 3-year total."
- Hover or focus a segment: tooltip with the month range and cost.
- "Show as table" toggle gives the same data as a real table.

**Without motion:** the spiral appears complete. No draw-in.

**Honesty rule:** linear thickness scale, a printed legend, no 3D, no cropped axis tricks.

### W4. Evidence threads

**You see:** each line of the price receipt has a small stitched knot. Hover or focus a line: a thread draws from the knot to its source card in the evidence column: "Checked 31 Aug 2026 · provider pricing page".

**It tells you:** where every number came from and how old it is.

**How it works:** SVG path drawn in 240 ms. On phones, tapping a line opens a bottom sheet with the source. Without JavaScript, the evidence list sits under the receipt.

**Without motion:** the thread appears instantly.

### W5. Fit verdicts: "Too small. Too pricey. This one."

**You see:** when you arrive with needs set (from the home finder or catalog filters), the offer and compare pages show a verdict:
- ✓ **This one:** fits RAM, CPU and budget.
- **Too small:** "2 GB RAM, you asked for 4 GB."
- **Too pricey:** "$14/mo, your budget is $10."

The crab shows the matching pose: `push`, `measure` or `quirk`.

**It tells you:** whether this plan fits *your* needs, in plain words.

**How it works:** needs travel in the URL, as catalog filters already do. Pure functions on known values. Unknown values say "Can't tell: not published", never a guess.

### W6. Shore states (loading, empty, error)

| State | Picture | Words | Action |
|---|---|---|---|
| Loading (over 300 ms) | Rows drawn as marching stitch outlines; crab `working` | "Checking shells…" | None |
| No results | Crab in a too-tight shell | "Nothing fits these needs." | **Relax chips** with real counts: "Remove 'Under $5' → 23 plans", "Allow 2 GB RAM → 41 plans" |
| No data | Tide out, crab asleep | "Plan data is unavailable right now. We don't show old prices." | Retry |
| Error | Crab `error` | "Something broke on our side." | Try again, go home |
| 404 | Empty shell, crab asleep | "Nobody lives in this shell." | Catalog, home |

**Relax chips** are computed on the server by re-running `filterOffers` with one filter removed at a time. Useful, not decoration.

### W7. Night and day tide

**You see:** the theme toggle is a tiny moon and sun. Switching rolls a single tide wave across the header (400 ms). Data surfaces switch theme instantly.

**Without motion:** instant switch.

### Bonus: the launch film
A "Watch the film" button on home opens the 64-second film in a dialog. It plays only after you click.

**Problem found:** Act V of the current film shows a `bvp compare` terminal session. That CLI does not exist yet (it is V2). The brand rule says CLI output must be real. **Cut Act V for the website version** until the CLI ships. See decision D3.

---

<a id="pages"></a>
## 9. Page by page

Each page: purpose, what changes, the crab, done-when.

### 9.1 Header and footer (every page)
- **Header:** crab mark (peek), wordmark, literal nav (VPS plans, Special offers, Providers, Guides, How we compare), Compare pail button with count, moon/sun toggle. Opaque background. Mobile: menu button, pail stays visible.
- **Footer:** a thin stitched shoreline strip (static SVG). Crab `wave` beside a small Keeper. "bestvpsforme is a TwargaOps product." Existing link columns and the commission line stay.
- **Done when:** 44 px touch targets, Escape closes the menu, focus returns, no overflow at 320 px.

### 9.2 Home `/`
- **Purpose:** explain the promise and start a search in the first screen.
- **Layout:** W1 scene with headline and finder in the first viewport. Below: "Ranked by value score" board in catalog row style. Then provider strip, how it works (3 numbered steps on a stitch line, not cards), guides, film button.
- **Done when:** headline is the LCP (text, not the painting), finder works without JS (plain GET form), counts match the catalog.

### 9.3 Catalog `/catalog`
- **Purpose:** the main tool. Must stay dense and fast.
- **Changes:** new tokens and fonts. Active filters as felt patches. Result count as a rolling mono number (180 ms). W2 pail. W6 states. Mobile filter becomes a bottom "tide sheet" with a drag handle and a close button.
- **No change:** columns, sort, pagination, URL state, cards view.
- **Crab:** only in loading, empty and no-data states. Never in rows.
- **Done when:** first-load JS still under 120,000 gzip bytes, keyboard path unchanged, all existing browser journeys pass.

### 9.4 Offer `/offers/[id]`
- **Purpose:** the receipt. Price next to hardware.
- **Layout:** left: identity, felt price tag with the main price, hardware grid, Good for / The catch (hook icon). Right column: the receipt with W4 threads, Visit button, Pick for compare. Below: W3 Cost Shell, then siblings.
- **Crab:** `present` once on load beside the tag; `quirk` if terms are not reviewed. W5 verdict when needs exist.
- **Done when:** receipt identical in numbers to today, unknowns say "Not published", affiliate label beside the Visit button.

### 9.5 Compare `/compare`
- **Empty:** crab with an empty pail, "Pick up to 4 plans from the catalog." Button to catalog. (Replaces today's grey dashed box.)
- **Filled:** column headers with mini Cost Shells and W5 verdicts. Rows highlight the best value with a stitched underline; ties get no label. Sticky headers. Mobile: first column pinned, swipe between plans.
- **Done when:** empty, 1, partial and 4-plan states pass; "Not published" rows collapse as today.

### 9.6 Providers `/providers` and `/providers/[slug]`
- **Index:** provider cards on felt patches with normalized logo frames, plan count, "from $X/mo", rating line. No crab per card.
- **Detail:** header scene: a small shell house carrying the provider's mark. Then the provider's plans in catalog row style.

### 9.7 Special offers `/special-offers`
- Header scene: shells washed ashore, each with a tag. List keeps the existing hairline rows: period total first, monthly equivalent, dated evidence link. No countdowns.

### 9.8 Guides `/guides` and articles
- Index: each guide gets one art-engine picture seeded by its slug (same picture every time). Topic filter stays.
- Article: day paper, 720 px column, 18 px text, "On this page" rail at 1280 px. Crab `read` in the header. End: one CTA box, related guides.

### 9.9 How we compare `/methodology`
- Header: Keeper and crab reading a receipt by the lantern.
- The ranking weights (45 / 25 / 15 / 15, from `score.ts`) drawn as four threads braided into one rope; thread width = weight, each labelled. Values come from `VALUE_WEIGHTS`, so the picture stays true when weights change.
- "What we never do" as a list with hook icons.

### 9.10 Updates `/updates`
- The tide log: each publication is a wave mark on a tide line with its date, status chip and "+added / −removed / changed" in mono.

### 9.11 Corrections `/corrections`
- Plain form, same fields and protections. Success: crab `bottle`, message "Thanks. We review every correction against its source."

### 9.12 About, privacy, terms, authors
- Reading layout. Crab only in the about page header. Legal pages: no character.

### 9.13 404 and error
- W6 scenes, with clear links out.

### 9.14 Admin
- New tokens and fonts only. No characters, no new motion. Admin is a work tool.

---

<a id="motion"></a>
## 10. Motion system

### 10.1 Tokens

| Token | Value | Use |
|---|---|---|
| `--dur-instant` | 100 ms | Press feedback |
| `--dur-fast` | 160 ms | Hover, toggles, count roll |
| `--dur-base` | 220 ms | Panels, chips, threads (UI state, contract range 150–220) |
| `--dur-flight` | 280 ms | Compare shell flight |
| `--dur-scene` | 2.4–4 s | Character idle loops |
| `--ease-out` | `cubic-bezier(.2,.8,.2,1)` | Things arriving |
| `--ease-in-out` | `cubic-bezier(.65,0,.35,1)` | Things moving across |

### 10.2 Rules
- **Every animation must tell you something.** If it doesn't, cut it.
- UI elements never bounce. Bounce belongs only to character moves from `lore.js`.
- Only `transform` and `opacity` animate.
- Scenes pause off screen (IntersectionObserver, the v4 `.asleep` pattern) and when the tab is hidden.
- Content never waits for an animation. Prices are visible on first paint.
- `prefers-reduced-motion`: no loops, no flights, no draw-ins. Characters hold one still pose.
- `Save-Data` or slow connection: static scene image only.

### 10.3 Full motion list

| Motion | Tells you | Duration | Reduced motion |
|---|---|---|---|
| Header crab ducks/peeks | Scroll direction, page alive | 180 ms | Static peek |
| Finder Baby VM grows | Your RAM need | 220 ms | Instant size |
| Shells dim + tag | Which plans stopped fitting | 220 ms | Instant |
| Count roll | Result count changed | 160 ms | Instant number |
| Crab working → success/error | Search result outcome | 1.2–2 s | Final pose only |
| Compare shell flight | Selection saved, where it went | 280 ms | None; count updates |
| Pail bob | Count changed | 220 ms | None |
| Felt patch in/out | Filter added/removed | 160 ms | Instant |
| Tide sheet open | Filters panel opened | 220 ms | Instant |
| Evidence thread draw | Source of this fact | 240 ms | Instant line |
| Cost Shell draw-in | Months adding up | 900 ms, once | Complete shell |
| Loading stitches march | Still loading | Loop, after 300 ms | Static outline |
| Theme tide wave | Theme switched | 400 ms | Instant |
| Character idle | The world is alive | 2.4–4 s loop | Still |

---

<a id="layout"></a>
## 11. Layout and responsive

- Breakpoints stay 640 / 768 / 1024 / 1280.
- Tool pages: max width 1280 px. Reading pages: 720 px column.
- Catalog filter rail on the left from 1024 px. Below that: tide sheet.
- Home scene: the picture takes the top 58% on phones with the finder below it (the v4 phone framing rule), full width on desktop with the finder over the left side.
- The crab is framed on its own body on phones, as v4 frames characters.
- Test widths: 320, 360, 390, 768, 1024, 1440, plus 844×390 sideways.

---

<a id="a11y"></a>
## 12. Accessibility

- WCAG 2.2 AA. Contrast from section 4.
- All character SVGs are `aria-hidden`. Every state they show is also in text.
- Live regions for count changes and compare selection. Polite, not repeated on every keystroke.
- Focus: amber lantern ring, 2 px, 2 px offset, visible on both themes.
- Scene shells are real links with full names. Tab order follows the visual order left to right.
- Cost Shell and rope have a table alternative.
- Tide sheet and dialogs: focus trap, Escape closes, focus returns.
- One `h1` and one `main` per page, as the contract requires.
- A human screen-reader pass (VoiceOver or NVDA) on home, catalog, offer and compare before launch.

---

<a id="perf"></a>
## 13. Performance and how we build the art

### 13.1 Budgets

| Item | Budget |
|---|---|
| Catalog first-load JS | Under 120,000 gzip bytes (existing gate, same method) |
| Home extra JS for W1 | Under 15 KB gzip, loaded after first paint |
| Crab SVG + CSS | Under 15 KB gzip for all poses used on a page |
| Home scene image | Under 180 KB (AVIF/WebP), phone and desktop sizes |
| LCP | Under 2.5 s on a mid-range phone, LCP element is text |
| CLS | Under 0.1 |

### 13.2 How
- **Scenes are painted once, at build time.** The art engine draws the shore (seeded, deterministic) and we save images. No art engine code ships to the browser.
- **Characters are SVG + CSS keyframes** from the Patchwork kit, ported to a React `<Crab pose size />` component. No animation library.
- **Only the moving bits are JavaScript:** lantern pointer, compare flight, evidence threads, finder counts.
- **View transitions:** the installed Next.js docs say `<ViewTransition>` works in the App Router. The catalog uses the Pages Router, so catalog → offer gets no shared transition. Use it only between App Router pages (offer ↔ compare, guides) and treat it as a bonus.
- No memory-heavy live painting like the v4 story site (about 600 MB for a full walk). This is a shopping tool.

---

<a id="anti-slop"></a>
## 14. Anti-slop rules

Check every screen against this list before review.

- [ ] Every picture maps to a real plan, fact or state (section 1 table).
- [ ] Every animation tells the user something (section 10.3).
- [ ] No gradient blobs, glass blur, glow pulses or neon.
- [ ] No three equal feature cards in a row.
- [ ] No fake terminal, fake dashboard or fake "AI is analysing" theatre.
- [ ] No invented numbers. Counts come from the active snapshot.
- [ ] No text baked into images.
- [ ] Headlines say what the page is. No slogans in place of titles.
- [ ] The crab never covers data and never replaces button text.
- [ ] Unknown stays "Not published", in words.
- [ ] Copy is plain: short sentences, no "unlock", "seamless", "supercharge", "elevate".
- [ ] The page works and reads well with all motion off.

---

<a id="phases"></a>
## 15. Build plan in phases

Small phases. Each ends with something you can open and judge.

### Phase 0: Decisions and contracts
1. Owner answers D1–D5 (section 16).
2. Update `PRODUCT_CONTRACT.md` design invariants, `DESIGN.md`, `PRODUCT.md` and `brand/BRAND.md` from Highlighter to The Shore. Data, ranking and accessibility rules stay as they are.

**Done when:** no document still requires Highlighter, volt or Mona Sans.

### Phase 1: Identity kit and review board
1. Port the crab, Baby VM and shell drawings from `design_system/brand/characters/v2/styles/patchwork.js` into a shared module.
2. Draw the 8 new poses.
3. Build mark, wordmark, lockups, favicons, OG templates.
4. Draw the ~20 stitched icons.
5. Build `brand/shore/index.html`: every pose, mark size, colour token, icon and both themes on one page.

**Done when:** owner approves the board.

### Phase 2: Foundations and frame
1. New tokens in `src/styles/tokens.css` for night and day.
2. Ubuntu Sans and Ubuntu Sans Mono through `next/font`.
3. `SiteHeader`, `SiteFooter`, `CompareTray`, `brand/Lockup`, `brand/symbols`, `ReviewedMark`, favicons.
4. Update `css-system.test.ts` and `tokens.test.ts` to the new values.

**Done when:** every page renders in the new frame and colours with no broken layout.

### Phase 3: Vertical slice (owner review gate)
1. Home with W1.
2. Catalog with W2 and W6.
3. Offer page with W3, W4, W5.
4. Check at 390 and 1440 px, both themes, reduced motion on and off.

**Done when:** owner says "yes, this is it" in the browser. **Do not start Phase 4 before this.**

### Phase 4: Every other page
Compare, providers, special offers, guides, methodology, updates, corrections, about, legal, 404, error, admin tokens.

**Done when:** every route in section 9 matches its done-when.

### Phase 5: Motion and performance pass
1. Walk the motion list (10.3) and cut anything that tells nothing.
2. Measure budgets (13.1) on the release build.
3. Low-end phone and slow-network check.

### Phase 6: Verify and launch
1. `npm run release:check` on a disposable database.
2. Full browser journeys, visual review of changed baselines (no blind regeneration).
3. Human screen-reader pass.
4. Launch checklist on the real server (`docs/ops/LAUNCH_CHECKLIST.md`).

### Likely files touched

| Area | Files |
|---|---|
| Tokens, fonts | `src/styles/tokens.css`, `src/app/globals.css`, `src/app/layout.tsx`, `src/pages/_app.tsx`, `src/pages/_document.tsx` |
| Page styles | `src/styles/{home,catalog,offer,compare,content,system,special-offers}.css` |
| Frame | `src/components/shell/*`, `src/components/brand/*`, `src/components/navigation/*` |
| Catalog | `src/components/CatalogClient.tsx`, `FilterRail.tsx`, `catalog/OfferTable.tsx`, `catalog/IconSprite.tsx` |
| Offer | `src/components/offer/OfferPage.tsx`, `offer/CostChart.tsx`, `offer/ComparePick.tsx`, `GetDealButton.tsx` |
| Compare | `src/components/compare/CompareClient.tsx`, `CompareProvider.tsx` |
| Other | `ProviderLogo.tsx`, `ProviderMark.tsx`, `SpecialOffersList.tsx`, `CorrectionForm.tsx`, `guides/*`, `ui/*` |
| New | `src/components/shore/` (Crab, BabyVM, Shell, CostShell, EvidenceThread, ShoreScene, PriceTag, FeltPatch) |
| Icons and art | `public/` icons and scene images, `src/app/icon.svg`, `apple-icon.png`, `favicon.ico`, `opengraph-image.tsx` |

---

<a id="decisions"></a>
## 16. Decisions for the owner

Five decisions. Each has a recommended answer.

| # | Question | Recommended |
|---|---|---|
| **D1** | Default theme? The contract says light. The company world is night. | **Follow the visitor's system setting.** Story scenes are always night. |
| **D2** | Which crab mark? | Pick 1 of 3 sketches on the Phase 1 board. |
| **D3** | The film shows a `bvp` CLI that does not exist yet. | **Cut Act V on the website** until the V2 CLI ships. |
| **D4** | Custom stitched icons? | **Yes, about 20 brand icons.** Keep Phosphor for generic ones. |
| **D5** | Shells in the home scene: real plans or decoration? | **Real plans** (top of the value ranking), each a real link. |

---

<a id="risks"></a>
## 17. Risks

| Risk | What we do |
|---|---|
| The remake never ends | Phase 3 slice and owner gate before other pages |
| Motion slows the catalog | Catalog gets almost no new JS; budget gate stays |
| Characters feel childish | Calm night tone from the films; crab stays out of data; plain copy |
| Art hides prices | Grain and scenes never behind tables or prices |
| Fake claims in scenes | Scenes use live counts and real plans only; film Act V cut |
| Contrast fails on night | Use the measured tokens in section 4 only |
| Old baselines hide regressions | Review every visual diff, don't regenerate blindly |

---

<a id="references"></a>
## 18. References

### Pictures saved with this plan
- [Film frames](v1-shore/reference/film-frames.jpg): shore world, crab, Baby VM, Keeper, shell check.
- [Film title mark](v1-shore/reference/film-title-mark.jpg): Bear + Crab, wordmark, tagline.
- [twargaops.com v4 home](v1-shore/reference/twargaops-v4-home.jpg): company night world, Ubuntu Sans, header style.
- [Current offer page](v1-shore/reference/current-offer-page.jpg): Highlighter version, before.
- [Current empty compare](v1-shore/reference/current-compare-empty.jpg): grey empty state, before.

### Source files
- Character bible: `design_system/brand/characters/v2/lore.js`
- Patchwork renderer: `design_system/brand/characters/v2/styles/patchwork.js`
- Pixel renderer (V2 CLI): `design_system/brand/characters/v2/styles/pixel.js`
- Film playbook: `design_system/brand/characters/v2/FILMS.md`
- bestvpsforme film: `design_system/brand/characters/v2/bestvpsforme/shots.js`, `bestvpsforme.mp4`
- Company brand rules: `design_system/plans-and-designs/BRAND.md`
- Company site tokens: `design_system/twargaops-site-v4/src/styles/app.css`
- Art engine: `design_system/art/`
- Price math to reuse: `src/lib/real-price.ts`
- Ranking weights to draw: `src/lib/score.ts`
- Filters for counts and relax chips: `src/lib/catalog.ts`
- Full product scope: [Scope.md](../../Scope.md)
