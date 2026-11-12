# Guide author and editorial policy QA — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Result

**Pass.** Published guides link to a named editorial profile and a separate standards page covering sources, corrections, and affiliate independence.

Rerun from the repository root:

```bash
npm run content:author-check
npm run content:article-check
npm run lint
npm run build
```

## Evidence

- `/authors/bestvpsforme` identifies the `bestvpsforme editorial desk`, its VPS research role, covered expertise, published guides, correction path, and editorial standards.
- `/about` explains the service, source checks, dated facts, correction workflow, privacy, and independence from affiliate revenue.
- Every loaded published guide must reference an author slug present in `src/lib/authors.ts`.
- `/guides/what-is-a-vps` resolves the author slug to the named profile rather than displaying an orphaned identifier.
- `content:author-check` verifies metadata/main/h1 landmarks, source/correction/independence copy, author linkage, and the named record.
- The production build includes both `/authors/[slug]` and `/about` dynamic routes.

## Editorial boundary

The profile describes the editorial desk’s work and scope without inventing a personal biography or unsupported credentials. Provider requests cannot change ranking inputs; sourced corrections remain the route for factual changes.
