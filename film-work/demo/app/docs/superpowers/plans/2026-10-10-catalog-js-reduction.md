# Catalog JavaScript Reduction Implementation Plan

> **For agentic workers:** Use the executing-plans skill to implement this plan inline. Steps use checkbox syntax for tracking.

**Goal:** Reduce the complete first-load catalog JavaScript below 120,000 gzip bytes while retaining the current controls, visual design, shared URLs and published data rules.

**Architecture:** First measure a supported server-rendered Pages Router catalog in an isolated copy. It retains the existing React components but avoids the larger App Router client runtime. Adopt only if its complete payload meets the budget and navigation, CSP and recovery behavior pass; otherwise retain the working catalog and document the measured result before considering native HTML rendering.

**Tech Stack:** Next.js 16.3.8, React 19, TypeScript, SQLite, Playwright, Vitest.

**Spec:** docs/qa/phase-7/performance-method.md and docs/progress/phase-7-delivery.md.

12 October prerequisite handoff: existing routing/artwork work is preserved and verified. The strict webpack first-load gate passes at 118,706 gzip bytes; later cross-router scripts total 144,297 bytes. See `docs/progress/pre-phase-7-repairs-2026-10-12.md`. Task 4 is recorded below. The new-build full performance/current-data accessibility matrices and human screen-reader acceptance remain open; do not mark Task 3's matrix item complete from old-build results.

## Global Constraints

- Complete first-load JavaScript must be strictly below 120,000 gzip bytes; count framework scripts and essential controls.
- Preserve the existing production database and user preview on port 3115.
- Use isolated build directories and database copies; never rebuild a running server's output.
- Keep real author requirements and reviewed publication rules unchanged.
- Preserve nonce CSP, fresh publication reads, accessible controls and working comparison restoration.
- Retain honest pending status for manual screen-reader testing.

### Task 1: Measure a supported smaller runtime

**Files:** Prototype only in /tmp/bestvpsforme-phase7-js-reduction/src/pages; existing catalog query and shared navigation components in the same isolated directory.

- [ ] Add a server-rendered catalog using getServerSideProps, the existing CatalogClient and a Pages Router navigation adapter.
- [ ] Add shared shell, fonts, document nonce and metadata using the installed Custom App and Custom Document guides.
- [ ] Build with the copied database and measure all first-load scripts using gzip level 9.
- [ ] Reject this approach if its complete payload cannot meet the budget, without changing production routing.

### Task 2: Remove static artwork from browser code

**Files:** src/app/layout.tsx, src/components/shell/SiteFrame.tsx, src/components/brand/Lockup.tsx, src/components/brand/symbols.tsx, src/components/brand/ids.ts.

- [ ] Render BrandSymbols in the server layout and pass it as a React node to SiteFrame.
- [ ] Move LOCKUP_ID into a dependency-free module so client Lockup does not pull in symbol path data.
- [ ] Run the existing brand and shell tests, lint and typecheck.
- [ ] Build and measure actual first-load savings, including any increase in HTML and RSC.

### Task 3: Adopt only a verified catalog route

**Files:** src/pages/catalog.tsx, src/pages/_app.tsx, src/pages/_document.tsx, shared navigation adapter and relevant browser tests if Task 1 succeeds.

- [ ] Write failing behavior tests for server publication, filtering, Back restoration, comparison readiness and nonce CSP.
- [ ] Implement the router boundary with shared rendering and business functions; do not duplicate ranking or pricing calculations.
- [ ] Verify cross-router links in both directions, error recovery, metadata, both themes and narrow layouts.
- [ ] Run unit tests, browser checks, accessibility checks and the full performance matrix against one exact build.

### Task 4: Record the actual outcome

**Files:** docs/qa/phase-7/catalog-js-budget.json, performance-findings.md, rendering-decision.md, docs/progress/phase-7-delivery.md.

- [x] Preserve previous measurements and report the exact new build and script inventory.
- [x] Check production data preservation and document any unfinished gate without claiming Phase 7 complete.
