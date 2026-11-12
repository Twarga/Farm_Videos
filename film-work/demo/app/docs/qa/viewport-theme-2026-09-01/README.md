# Viewport, theme, and zoom matrix — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Result

**Pass.** Production-mode machine checks and contact-sheet review found no task-blocking viewport, theme, zoom, hierarchy, or page-overflow defect.

Rerun live checks from the repository root:

```bash
npm run build
npm run release:viewport-check
```

Recreate the committed contact sheets when the approved UI changes:

```bash
CAPTURE_QA_ARTIFACTS=1 npm run release:viewport-check
```

## Method

The check publishes the approved 322-offer dataset into a temporary SQLite database, creates a disposable owner session, starts `next start`, and drives Chromium through the DevTools protocol. Each capture verifies the requested light/dark theme, exact CSS viewport width, one `h1`, expected route content, no application-error text, and no page-level horizontal overflow.

Each contact sheet contains seven visible-viewport screenshots: home, catalog, filled compare, offer detail, provider detail, authenticated admin overview, and authenticated import workflow. The matrix contains 126 route/theme/viewport captures.

The 200% zoom profile uses a 640 × 360 CSS viewport at device scale factor 2, producing a 1280 × 720 image. This matches the reflow pressure of 200% browser zoom on a 1280 × 720 display.

## Matrix

| Profile | Light | Dark | Status |
|---|---|---|---|
| 320 × 568 | [contact sheet](./320-light.jpg) | [contact sheet](./320-dark.jpg) | Pass |
| 360 × 640 | [contact sheet](./360-light.jpg) | [contact sheet](./360-dark.jpg) | Pass |
| 390 × 844 | [contact sheet](./390-light.jpg) | [contact sheet](./390-dark.jpg) | Pass |
| 430 × 932 | [contact sheet](./430-light.jpg) | [contact sheet](./430-dark.jpg) | Pass |
| 768 × 1024 | [contact sheet](./768-light.jpg) | [contact sheet](./768-dark.jpg) | Pass |
| 1024 × 768 | [contact sheet](./1024-light.jpg) | [contact sheet](./1024-dark.jpg) | Pass |
| 1280 × 720 | [contact sheet](./1280-light.jpg) | [contact sheet](./1280-dark.jpg) | Pass |
| 1440 × 900 | [contact sheet](./1440-light.jpg) | [contact sheet](./1440-dark.jpg) | Pass |
| 200% zoom | [contact sheet](./zoom-200-light.jpg) | [contact sheet](./zoom-200-dark.jpg) | Pass |

## Review findings

| Check | Result |
|---|---|
| Required profiles | 8 viewports plus 200% zoom, light and dark |
| Critical surfaces per profile | 7 |
| Exact theme applied | 126/126 |
| One page-level `h1` | 126/126 |
| Expected critical content | 126/126 |
| Page-level horizontal overflow | 0 |
| Runtime error text | 0 |
| Missing contact sheets | 0 |
| Unresolved P0/P1 | 0 |

The narrow profiles retain a bounded 20-row catalog window, mobile navigation, stacked decision content, and internal table scrolling where intended. Tablet and desktop profiles keep the dense catalog and admin layouts without creating document-level overflow. Both 200% profiles reflow to the compact navigation and preserve visible actions and headings.

## Scope

These screenshots cover Chromium on the local production build. R7-04 owns keyboard and screen-reader checks. R7-05 owns measured performance. R7-06 must repeat smoke checks on the deployed HTTPS origin and target devices.
