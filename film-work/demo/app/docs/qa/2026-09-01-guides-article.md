# Guide article QA — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Result

**Pass.** `/guides/[slug]` renders the validated first guide as an accessible, source-conscious article without raw HTML or a CMS dependency.

Rerun from the repository root:

```bash
npm run content:frontmatter-check
npm run content:index-check
npm run content:article-check
npm run lint
npm run build
```

## Verified behavior

- `src/lib/guide-markdown.ts` parses headings, paragraphs, unordered/ordered lists, and pipe tables into typed blocks.
- `GuideArticleBody` renders those blocks as React elements and accepts only internal links or HTTPS external links.
- The page exposes one `h1`, an accessible article, a generated “On this page” table of contents, source/caveat notes, visible publication/update history, affiliate disclosure, related-guide slot, methodology/update links, and a catalog CTA.
- The first article contains a comparison table, dated snapshot, methodology link, catalog link, and disclosure.
- Future/unreviewed guides do not resolve as published article pages.
- Missing or invalid slugs reach the shared not-found behavior.
- `content:article-check` rejects a raw-HTML rendering path and verifies the real article body contains headings, table, and catalog context.

## Scope

SEO-04 establishes the article template and safe Markdown subset. SEO-05 adds the real author/editorial profile. SEO-06 adds complete article JSON-LD and social metadata. SEO-07 adds feed/sitemap/draft controls. SEO-08 adds article event placements and deeper contextual catalog links.
