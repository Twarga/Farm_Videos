# Guides index QA — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Result

**Pass.** The `/guides` index loads validated local MDX content and presents a featured guide, five-topic navigation, a compact library, and a catalog action without a generic card wall.

Rerun from the repository root:

```bash
npm run content:frontmatter-check
npm run content:index-check
npm run lint
npm run build
```

## Evidence

- `content/guides/what-is-a-vps.mdx` is the first reviewed foundational article and supplies the required typed frontmatter, snapshot date, source-based body, catalog/methodology links, and affiliate disclosure.
- `src/lib/guides.ts` validates frontmatter before the index reads it, limits topics to the five documented groups, excludes future/unreviewed content, and requires the slug to match the `.mdx` filename.
- `/guides` renders one page-level heading, topic links for foundations, workloads, comparisons, dataset research, and founder/trust notes, a featured guide, a chronological list, and an explicit no-guides state.
- Topic query links preserve the same page and filter to matching validated content.
- `npm run content:index-check` verifies the real article, page source contracts, and non-card-wall layout.
- `npm run content:frontmatter-check` verifies valid loading plus missing title, future/stale dates, unsupported topic, invalid slug, and empty-body failures.
- `npm run build` includes the dynamic `/guides` route and passes TypeScript.

## Scope

SEO-03 establishes the index shell and one article for route proof. SEO-04 owns article-body rendering, source-note presentation, related guides, catalog actions inside articles, and article structured data. SEO-09 owns the remaining foundational/workload publication set.
