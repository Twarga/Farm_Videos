# Guide metadata and structured-data QA — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Result

**Pass.** Published guide pages emit canonical/Open Graph metadata plus visible-fact `BlogPosting` and `BreadcrumbList` JSON-LD.

Rerun from the repository root:

```bash
npm run content:metadata-check
npm run content:article-check
npm run lint
npm run build
```

## Evidence

- `src/lib/guide-structured-data.ts` generates `BlogPosting` and `BreadcrumbList` from the validated guide and resolved author only.
- `BlogPosting` includes the visible title, description, local hero image, published and updated dates, editorial-desk author URL, publisher, canonical main entity, topic section, and Guides collection.
- `BreadcrumbList` contains the visible Guides link and article title/link.
- `generateMetadata` emits the article canonical URL, article Open Graph type, title, description, image, published/modified times, and author URL.
- `npm run content:metadata-check` compares the generated objects to the real first article’s validated frontmatter and verifies source contracts for all required fields.
- `npm run content:article-check` confirms the same page exposes the corresponding title, dates, author, source/caveat section, and catalog action in visible HTML.
- Draft, future-dated, and unknown-author documents cannot enter the published loader used by the route.

## Scope

SEO-06 covers article metadata and structured data. SEO-07 owns RSS, sitemap inclusion, draft/preview controls, and indexation boundaries. SEO-08 owns analytics placement and richer contextual links.
