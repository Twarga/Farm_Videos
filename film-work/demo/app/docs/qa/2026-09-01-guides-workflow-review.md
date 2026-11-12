# Guides workflow review — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Decision

**Keep Git/MDX; do not add an admin editor yet.** The workflow has been used for seven published articles and remains small, typed, auditable, and fast enough for the current editorial cadence. No observed bottleneck justifies the security and maintenance cost of a CMS or browser editor.

## Measured current workflow

- 7 published `.mdx` files in `content/guides/`.
- 1 named editorial author profile linked by the loader.
- 5 documented topic groups represented by the published set.
- 11 content checks run by `npm run content:ci-check`: guide policy, frontmatter, index, article, author, metadata, discovery, analytics, volume, dataset-report, and freshness.
- 1 production build follows the content checks in CI.
- 0 CMS/editor dependencies or admin content mutations are required for publication; review happens through normal Git changes and the existing validation/build pipeline.

## Observed trade-offs

Git/MDX is effective while the editorial team is small and changes are reviewable in pull requests. The real costs are editor familiarity with Markdown/frontmatter, no browser-based preview for non-developers, and external link reachability needing a separate check. These are known limitations, not current release blockers; the source, metadata, indexation, and freshness contracts fail closed when content is malformed.

## Reevaluation triggers

Revisit this decision if any of these become true:

1. More than two active editors need to publish without Git access.
2. More than 20 Guides require coordinated draft/review scheduling.
3. Preview, correction, or freshness work repeatedly blocks a release despite the existing checks.
4. Measured publishing/review overhead exceeds one working day per article for two consecutive articles.

Any editor proposal must retain typed frontmatter, named authors, source/disclosure requirements, published-only loading, audit history, and the same CI gate. Do not add a CMS for page volume alone.

## Evidence and rerun

```bash
npm run content:workflow-check
npm run content:ci-check
npm run lint
npm run build
```

`content:workflow-check` validates the seven-file count, five-topic coverage, CI wiring, absence of an editor dependency, and this decision record. The local workflow remains separate from the external production deployment blockers recorded in the launch review.
