# Shore identity deliverables

Source of truth: approved brand/shore/mockup favicon and Ubuntu Sans wordmark. The compact shell/eye mark is copied exactly from the approved favicon, not the full animated character compressed into a tiny icon.

## Files and use
- mark-light.svg / mark-dark.svg: the original coloured transparent mark on the respective Shore surfaces.
- mark-one-colour.svg and lockup-one-colour.svg: single-ink mask versions; no fake tile.
- lockup-light.svg / lockup-dark.svg: font-free Ubuntu Sans 700 outlines shaped with HarfBuzz, with the reference -0.015em tracking and violet forme.
- favicon-16/24/32/48.png: actual-size transparent exports. src/app/favicon.ico includes all four.
- apple-icon.png: 180px opaque night surface. public/icons/maskable-512.png keeps the mark inside the central 60% safe region. public/icons/mark-192.png and mark-512.png use transparent marks.
- size-review.png / index.html: inspected day/night size board. opengraph-unavailable.png verifies an honest unavailable-publication social card, not a fixture count.

Minimum standalone size: 16px; prefer 24px and above. Horizontal lockup minimum width 128px. Keep clear space at least one-quarter mark width around the mark/lockup. Do not stretch, recolour arbitrarily, put the detailed animated character into favicons, cover prices, or substitute provider marks for the product mark. Primary header/full character remains the exact mockup frame, not this asset board.

## Rebuild
Run python3 scripts/build_shore_identity.py then npx tsx scripts/visual/build-shore-rasters.ts from the app root. Requires existing fontTools, Pillow, system libharfbuzz and Playwright Chromium. The build reads only approved local fonts/art and writes generated identity assets; no DB or network is needed.

Original WOFF2 files remain byte-identical. Static OG TTF conversion preserves copyright, ships the full Ubuntu Font Licence and uses derivative Shore OG internal naming required for non-substantially-changed format derivatives. Outlined logo documents are not redistributions of a font program. Font redistribution is under Ubuntu Font Licence, not a claimed SIL OFL equivalence.
