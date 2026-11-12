# Guides content QA and freshness — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Result

**Pass.** Published Guides have deterministic metadata and internal-link validation, while an operations queue flags overdue review and stale snapshot claims without rewriting content or publishing thin pages.

Rerun from the repository root:

```bash
npm run content:freshness-check
npm run content:ci-check
npm run lint
npm run build
```

## Evidence

- `content:freshness-check` validates every published article’s relative Markdown links against known Guide slugs and supported public routes; HTTPS source links are accepted without pretending they were fetched in CI.
- `getGuideFreshnessQueue()` uses the article `updatedAt` and optional `dataSnapshotAt` with a documented 30-day interval. It emits `review-overdue` and/or `snapshot-stale` items with a slug, title, reason, and due date.
- The freshness regression proves the current 2026-09-01 set is clear and an old published fixture produces both expected queue reasons in deterministic order.
- The queue is read-only: it does not alter frontmatter, indexation, publication, or catalog data. An editor must review and update or retire an article.
- CI runs the content guide, frontmatter, index, article, author, metadata, discovery, analytics, volume, dataset-report, and freshness checks before lint/build.

## Scope

SEO-11 covers local CI content quality and the operational freshness queue. External link reachability, Search Console data, and production alert delivery still require the deployment infrastructure described in the launch review.
