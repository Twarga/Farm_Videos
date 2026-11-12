# Guides discovery and indexation QA — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Result

**Pass.** The Guides discovery surfaces expose published content through the RSS feed and sitemap while excluding drafts, previews, and filtered duplicate views from indexation.

Rerun from the repository root:

```bash
npm run content:discovery-check
npm run content:index-check
npm run content:frontmatter-check
npm run build
```

## Evidence

- `/feed.xml` returns RSS 2.0 with a self link, channel metadata, escaped titles/descriptions, stable article links, update dates, and the editorial author.
- `src/app/sitemap.ts` includes `/guides`, `/about`, `/authors/bestvpsforme`, and only `listPublishedGuides()` article URLs.
- `/guides` uses the same published-only loader and returns `robots: { index: false, follow: true }` for topic-filtered views.
- `/guides/[slug]` resolves only published date-valid documents, so drafts and future articles do not render as public pages.
- `content:discovery-check` validates RSS content, draft parsing, source contracts, noindex behavior, sitemap wiring, XML escaping, and this dated report.
- The production build includes the `/feed.xml` route and no draft article is present in its output contract.

## Scope

SEO-07 covers local discovery and indexation controls. Search-engine submission and external cache behavior still belong to the production deployment process. SEO-08 adds content-to-catalog analytics and richer contextual links.
