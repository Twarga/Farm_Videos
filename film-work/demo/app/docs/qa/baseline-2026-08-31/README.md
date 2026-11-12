# Responsive baseline — 31 August 2026

These viewport screenshots freeze the pre-remediation presentation. They are comparison evidence, not design approval. Screenshots show the visible viewport rather than the full page so very long catalog routes remain reviewable and repository weight stays bounded.

## Capture environment

- Local application: `http://127.0.0.1:3002`
- Browser: Codex in-app Chromium surface
- Mobile viewport: 390 × 844 (375 px document width after browser scrollbar allocation)
- Desktop viewport: 1280 × 720 (1265 px document width after browser scrollbar allocation)
- Data: 33-offer development fallback
- Themes: light and dark for the two primary discovery routes; light for secondary routes
- Capture type: visible viewport JPEG

## Route matrix

| Surface | Mobile | Desktop | Dark evidence | Notes |
|---|---|---|---|---|
| Home | [light](./home-mobile-light.jpg), [dark](./home-mobile-dark.jpg) | [light](./home-desktop-light.jpg), [dark](./home-desktop-dark.jpg) | Yes | One `h1`; 2,451 px mobile document height |
| Catalog list | [light](./catalog-list-mobile-light.jpg), [dark](./catalog-list-mobile-dark.jpg) | [light](./catalog-list-desktop-light.jpg), [dark](./catalog-list-desktop-dark.jpg) | Yes | 33 results; 8,016 px mobile document height |
| Catalog cards | [mobile](./catalog-cards-mobile-light.jpg) | [desktop](./catalog-cards-desktop-light.jpg) | No | 12,426 px mobile document height; materially worse than list |
| Compare empty | [mobile](./compare-empty-mobile-light.jpg) | [desktop](./compare-empty-desktop-light.jpg) | No | Empty route currently exposes two `h1` elements |
| Compare filled | [mobile](./compare-filled-mobile-light.jpg) | [desktop](./compare-filled-desktop-light.jpg) | No | Two plans selected through public controls; one `h1` |
| Offer detail | [mobile](./offer-mobile-light.jpg) | [desktop](./offer-desktop-light.jpg) | No | Hetzner CX32; one `h1` |
| Provider detail | [mobile](./provider-mobile-light.jpg) | [desktop](./provider-desktop-light.jpg) | No | Hetzner route currently exposes two `h1` elements |
| Admin login | [mobile](./admin-login-mobile-light.jpg) | [desktop](./admin-login-desktop-light.jpg) | No | Unauthenticated protected state |

## Baseline measurements

| Route/state | Mobile document height | Desktop document height | `h1` count | Page overflow |
|---|---:|---:|---:|---|
| Home light | 2,451 px | 1,571 px | 1 | None |
| Catalog list light | 8,016 px | 2,518 px | 1 | None |
| Catalog cards light | 12,426 px | 4,386 px | 1 | None |
| Compare empty | 1,069 px | 927 px | 2 | None |
| Compare filled | 1,471 px | 1,254 px | 1 | None |
| Offer detail | 1,649 px | 1,208 px | 1 | None |
| Provider detail | 1,522 px | 1,046 px | 2 | None |
| Admin login | 844 px | 720 px | 1 | None |

“None” means document width did not exceed the captured viewport's document width. It does not approve intentionally clipped marquee content or every internal scroll container.

## Verified findings carried into remediation

1. Mobile catalog list height is excessive; cards are roughly 55% taller again.
2. Compare empty and provider pages violate the one-`h1` contract.
3. The public pages do not create page-level horizontal overflow at the captured widths.
4. Light/dark hierarchy is structurally consistent on Home and Catalog.
5. `/admin/imports` redirects an unauthenticated browser to `/admin`, confirming the protection boundary.
6. Authenticated admin dashboard/import screenshots are intentionally not bypassed or fabricated. They will be captured with a disposable authenticated fixture when the real admin views are integrated in Phase R5.
7. The visible Next.js issue badge is development-only evidence of the CSP conflict scheduled for R6-03.

## Re-capture rule

Do not overwrite these files. Post-remediation evidence must use a new dated folder and repeat the same route, theme, viewport, and state names. Compare document height, heading count, visible hierarchy, control density, and overflow rather than relying only on visual impression.
