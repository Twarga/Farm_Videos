# Performance budget

Run a production build (`npm run build && npm run start`) and measure the public home, catalog, compare, offer, and `/go/[id]` redirect on representative mobile hardware. Use Lighthouse or Chrome DevTools with a cold cache and a throttled 4G profile.

## Launch targets

| Metric | Target | Why |
|---|---:|---|
| Largest Contentful Paint (LCP) | ≤ 2.5 s | Main comparison content appears quickly |
| Interaction to Next Paint (INP) | ≤ 200 ms | Filters and compare controls feel immediate |
| Cumulative Layout Shift (CLS) | ≤ 0.10 | Logos/prices do not jump while loading |
| Server response (TTFB) | ≤ 800 ms | Dynamic catalog/admin requests start promptly |
| `/go/[id]` redirect | ≤ 500 ms server time | Outbound intent is not delayed |

Record date, route, device/profile, and result in the release notes. Do not add an analytics vendor just to measure these; use first-party logs and an occasional local Lighthouse run while traffic is small.
