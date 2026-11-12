# Guide-to-catalog analytics QA — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Result

**Pass.** Guide-to-catalog, provider, offer, and related-guide links record privacy-safe placement and target metadata without entering affiliate ranking or outbound-click KPIs.

Rerun from the repository root:

```bash
npm run content:analytics-check
npm run content:article-check
npm test -- src/lib/analytics-events.test.ts
npm run lint
npm run build
```

## Evidence

- `GuideTrackedLink` sends the existing first-party analytics endpoint on activation with `guideSlug`, `targetType`, `targetPath`, and a bounded placement label.
- The client respects `navigator.doNotTrack === "1"`; no raw IP or query string is collected by the guide event.
- Article Markdown links and the article sidebar track catalog, provider, offer, and related-guide destinations.
- The primary catalog CTA uses the real `workload=wordpress` catalog filter, so the destination is useful rather than a tracking-only URL.
- `guide_internal_click` is accepted as a current event, counted separately as `guideClicks`, and excluded from affiliate `clicks`, offer/provider commercial rankings, and outbound-rate denominators.
- The analytics regression records a guide action in a disposable database and verifies `guideClicks === 1` while affiliate clicks remain zero.
- This instrumentation measures behavior only; it never changes catalog sort order or editorial ranking.

## Scope

SEO-08 covers first-party guide-to-catalog measurement and useful internal links. It does not claim external search attribution or affiliate conversion data, which remain separate operational inputs.
