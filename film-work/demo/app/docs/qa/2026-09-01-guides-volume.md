# Guides volume and editorial QA — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Result

**Pass.** Six reviewed Guides answer distinct beginner and workload questions with validated dates, source links, practical examples, caveats, and disclosures.

Rerun from the repository root:

```bash
npm run content:volume-check
npm run content:frontmatter-check
npm run content:article-check
npm run content:metadata-check
npm run content:analytics-check
npm run build
```

## Published set

- `what-is-a-vps` — the basic VPS model, costs, and decision facts.
- `vps-vs-shared-hosting` — control and maintenance trade-offs for beginners.
- `how-much-vps-ram-do-you-need` — workload-based memory planning.
- `secure-a-new-linux-vps` — a first-day security and recovery checklist.
- `choosing-vps-location` — latency, workload placement, and data-handling boundaries.
- `compare-vps-prices-without-traps` — effective monthly price, renewal, extras, and unknown facts.

Every article uses the named editorial desk, has a source/caveat section with at least one external source, explains that the advice is not a provider guarantee, and includes the affiliate disclosure. The content loader and publication filter keep the six documents typed, filename-aligned, date-valid, and discoverable only when published.

## Scope

SEO-09 publishes the initial six-guide set without adding a CMS or manufacturing thin pages. Dataset-specific claims remain reserved for SEO-10, while freshness automation remains SEO-11.
