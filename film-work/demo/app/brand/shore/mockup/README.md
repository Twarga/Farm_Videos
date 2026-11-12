# The Shore: clickable design mockup

A working mockup of the V1 remake described in [the design plan](../../../docs/design/V1_SHORE_DESIGN_PLAN.md). It is for judging the design before we change the real app. Nothing here ships.

## Open it

Serve the workspace root so the film and reference images resolve:

```sh
cd ~/Documents/TwargaOps_Company
python3 -m http.server 8794 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8794/bestvpsforme/bestvpsforme/brand/shore/mockup/index.html>.

## What to try

- **Home:** change Memory, Budget and Region. Shells that stop fitting get a "Too small" or "Too pricey" tag, the crab checks them, and the count updates. Pick 16 GB and under $5 to see the "nothing fits" state with suggestions.
- **Catalog:** tick Compare on a few rows. A shell flies into the pail in the header. A fifth pick shows the "pail is full" message.
- **Offer page:** point at or tab to a receipt line. A thread runs to its source. Scroll to the 36-month cost shell.
- **Compare:** mini cost shells share one scale, so thicker stitches cost more in every column.
- **Review controls** (bottom right): jump to every screen and state, including loading, no data, no results and 404, and turn motion off.
- **Theme:** the moon/sun button switches night and day. Scenes stay night in both.

## Files

| File | What it is |
|---|---|
| `index.html` | Page shell: header, footer, icon sprite, film dialog, review controls |
| `shore.css` | Tokens (contrast-checked night and day), components, motion, responsive rules |
| `shore.js` | Screens, filters, compare pail, cost shell, evidence threads, fit verdicts |
| `data.js` | Local fixture snapshot exported from the dev server on 23 Oct 2026 (317 plans, 41 providers). Not production data |
| `kit/patchwork.js` | Copy of the company Patchwork character kit (`design_system/brand/characters/v2/styles/patchwork.js`) |
| `logos/` | Provider logos copied from `public/logos/`; raster marks trimmed and squared so they fill their plate |
| `fonts/` | Ubuntu Sans and Ubuntu Sans Mono, copied from the company site's packages |

## Limits

- Data is a fixture snapshot; prices, counts and reviews are for layout only.
- Only Home, Catalog, Offer, Compare and 404 are built. The other nav items are greyed out.
- The contact section uses `hello@bestvpsforme.com` (from the current site footer) and @Twarga_Dev on X. The correction link is greyed out in the mockup.
- Tested in Chromium at 360, 390 and 1440 px, both themes and reduced motion: no console errors and no horizontal overflow.

## Wow moments (v4)

| Moment | Where | How to see it |
|---|---|---|
| Tide washes the shore, price tags lift | Home hero | Wait about 2 s, repeats every 11 s |
| Compare by sewing | `#compare` | Thread stitches the picked shells; rows that differ light up; "Only show what differs" filter |
| Hidden cost reveal | `#offer/…` receipt | "See the true monthly cost": the tag unstitches into advertised + renewal + setup + IPv4 + VAT. "At least" when a cost is not published |
| Lantern night mode | Theme button | Light opens or closes in a circle around the lantern (View Transitions; plain swap elsewhere) |
| Keeper walks while loading | Catalog loading state | Review panel → Loading |
| Keeper fishing | 404 and "Nothing fits" | `#nope`, or Review panel → Empty |
| Tide scroll line | Header bottom edge | Scroll any long page |

Reduced motion keeps every price and label, and drops the movement.

## Pages (v5)

| Route | Page |
|---|---|
| `#home` | Landing, finder, shore hero |
| `#catalog` | Plans: list or cards, sortable columns, 24/48/96 per page |
| `#offer/<id>` | Plan page, price receipt, true monthly cost |
| `#compare` | Compare up to 4 plans |
| `#special-offers` | Intro deals with renewal shown, plus no-surprise plans |
| `#providers`, `#provider/<pid>` | Provider directory with search and sort; provider page |
| `#guides`, `#guide/<slug>` | 6 guides, each ending in matching plans |
| `#methodology` | How we compare |
| `#corrections` | Price correction form (validates, sends nothing) |
| `#updates` | Snapshot and price checks by month |
| `#privacy`, `#terms`, `#affiliate` | Legal pages (draft wording) |

Catalog colours: CPU blue, memory violet, storage amber, transfer teal. Each spec has a 5-step meter. Trustpilot uses its own star colours. The price column says whether the plan renews higher, stays flat, or is not reviewed.

## Catalog filters (v6)

Same filters as `src/lib/catalog.ts` `filterOffers` minus workload (removed from V1 UI): search, memory / budget / CPU / storage sliders, region, Trustpilot minimum, honest terms, providers, countries. URL keys: `q ram price cpu disk tp regions loc prov flags`.
