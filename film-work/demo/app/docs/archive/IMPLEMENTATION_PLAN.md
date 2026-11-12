# bestvpsforme full implementation plan

For the task-by-task status view, use [PROJECT_PROGRESS.md](PROJECT_PROGRESS.md). This file remains the detailed technical reference. The audit repair sequence, target states, acceptance criteria, and release gates are in [REMEDIATION_PLAN.md](REMEDIATION_PLAN.md).

## Production-readiness decision

The public and admin application layers are implemented and the reviewed dataset has a database-backed publication path. The product remains in pre-production until the real VPS deployment, monitoring, encrypted off-host backup/restore, rollback, and final accessibility/performance rehearsal pass.

Preserve the current public design and maintain the existing single-process architecture while completing the remaining launch evidence.

### Ready to keep

- Product direction and market research
- Homepage, catalog, compare, methodology, provider, and offer-detail routes
- Responsive light/dark design system and bounded catalog rendering
- Provider logos and country flags
- Authenticated admin editing, reviewed publication/rollback, quality queue, and measured analytics
- SQLite/Drizzle data layer with migrations, readiness checks, audit history, and first-party events
- Research covering 457 offers and 63 providers; 322 reviewed offers in current local publication evidence

### Production blockers

- The real VPS, DNS, production secrets, monitoring destinations, and external smoke-test rehearsal require owner infrastructure access.
- Encrypted off-host backup upload and a clean-host recovery drill require the production R2 destination and deployment host.
- Final device/browser accessibility and performance evidence must be captured against the deployed production origin.
- Launch remains closed until the dated QA, rollback, monitoring, backup/restore, and release sign-offs are complete.

## Architecture

Use one maintainable production unit:

- Next.js App Router and TypeScript
- Server Components by default and small client components for interaction
- SQLite in WAL mode
- Drizzle ORM with committed migrations
- Zod at every form, import, event, and server-action boundary
- One Node.js process behind Caddy
- Cloudflare for DNS, proxy, Web Analytics, Turnstile when needed, and inbound email
- Privacy-safe first-party product events in SQLite
- Cron or systemd timers for checks and backups
- Encrypted SQLite-safe backups to Cloudflare R2

Do not add microservices, Redis, Kubernetes, queue infrastructure, or multiple databases for the initial production version.

---

# Phase 1 — Repository and quality baseline

## Goal

Make every later change safe and reproducible.

## Tasks

1. Initialize Git and use only `main`.
2. Push the current project to the private GitHub repository.
3. Keep `.env*`, SQLite files, WAL files, backups, uploads, and credentials ignored.
4. Add `.env.example` containing variable names only.
5. Keep `npm run lint`, `npm run build`, and `npm run data:check` available.
6. Add a small GitHub Actions workflow for install, lint, build, and data validation.
7. Treat the current frontend as the approved UI baseline.
8. Use small commits and avoid unrelated refactors.
9. Keep dependency-audit results visible; do not use forced breaking upgrades without migration testing.

## Done when

- A clean clone installs and builds from the README.
- No secrets or generated production data are committed.
- Pulling `main` always gives the latest working state.

---

# Phase 2 — Production database

Status: complete. The schema, migrations, seed, readiness check, relations, and typed repositories are implemented and tested. Continue with Phase 3 data staging/import.

## Goal

Create one trustworthy source of truth.

## Main tables

### Providers

- ID, slug, name, official URL, headquarters country, logo, status, note, timestamps

### Offers

- Provider relationship, slug, plan name, product type, publication status
- CPU count, allocation, architecture, and source text
- RAM, disk amount/type, bandwidth value/source text
- IPv4 normalized status and source text
- Billing term, official URL, confidence, source checked date
- Editorial fit, catch, created, updated, and published timestamps

### Offer prices

- Original amount and currency
- Advertised monthly, effective monthly, cash due today, renewal amount
- Normalization currency and exchange-rate date
- Valid-from and valid-to dates

Keep price history instead of overwriting previous prices.

### Locations

- ISO country code, country name, city/region, provider location name
- Many-to-many relationship between offers and locations

### Provider affiliate programs

- Program status: none, closed, public, application, partner-only, applied, approved, rejected
- Difficulty, notes, network, signup URL, tracking template
- Cookie duration, commission description, application/approval dates, last checked date

### Operational tables

- Import jobs and staged import rows
- Verification issues
- Audit log and admin sessions
- Analytics events and affiliate conversions
- Backup runs

## Tasks

1. Install Drizzle, SQLite driver, and Zod.
2. Define schemas, relations, indexes, and types.
3. Commit migrations.
4. Add development seed data.
5. Add typed repository/query functions.
6. Add database readiness and migration checks.

## Done when

- A database is created from migrations only.
- Seed data loads without manual editing.
- Providers, offers, prices, locations, and affiliates round-trip through typed queries.

---

# Phase 3 — CSV staging and affiliate import

## Goal

Turn research into reviewed production records without publishing bad data.

## Import flow

1. Select or upload a CSV.
2. Create an immutable import job and source checksum.
3. Parse every row into staging.
4. Preserve original source values.
5. Normalize provider identity, product type, currency, IPv4, CPU, and locations.
6. Run validation.
7. Show blockers and warnings in admin.
8. Allow operator corrections without rewriting the source file.
9. Preview created, updated, unchanged, hidden, and rejected records.
10. Publish approved rows in one transaction.
11. Store a full audit entry and allow rollback to the prior published snapshot.

## Validation rules

- Unique `provider + plan_slug`
- Valid provider relationship
- Required identity, URL, date, currency, and effective price
- Non-negative numeric values
- VPS-specific RAM, CPU, disk, and location requirements
- Separate exceptions for dedicated, PaaS, free-tier, and from-price products
- Accepted normalized enums
- Freshness and scheduled recheck date
- Suspicious price changes from the prior snapshot
- Broken or redirected source links

## Work for the current files

1. Fix or block the incomplete Cherry Servers row.
2. Classify all 457 rows by product type.
3. Decide which non-VPS rows belong in the public catalog.
4. Normalize all 63 provider identities.
5. Normalize location text while retaining the original text.
6. Import all rows into staging, never directly into published offers.
7. Import `affiliate-signup-difficulty-2026-08-31.md` into provider affiliate records.
8. Distinguish program availability from the project’s application status.
9. Mark Hetzner closed; distinguish none from partner-only.

## Admin screens

- Import history
- Blocking/warning filters
- Row corrections
- Before/after diff
- Bulk approve/reject
- Publish preview and summary
- Rollback

## Done when

- Every source row is accepted, corrected, blocked, or intentionally excluded.
- Invalid rows cannot become public.
- Affiliate status exists once per provider and is auditable.

---

# Phase 4 — Secure production admin

## Goal

Complete the secure single-operator admin application and its durable publication workflow.

## Tasks

1. Add single-admin login.
2. Use memory-hard password hashing.
3. Add TOTP or WebAuthn and recovery codes.
4. Use secure httpOnly same-site sessions.
5. Rate-limit login attempts.
6. Make `/admin` dynamic, authenticated, and `no-store`.
7. Protect mutations against CSRF.
8. Validate all forms and server actions with Zod.
9. Replace localStorage drafts with database drafts.
10. Add audit entries for login, edit, import, publish, rollback, affiliate change, and settings.
11. Add session revocation and logout.
12. Optionally restrict admin with Cloudflare Access.

## Modules to finish

- Real overview metrics
- Offer and provider editors
- Affiliate program/application tracker
- Data-quality and verification queue
- Import, publish, and rollback
- Click, visitor-country, conversion, and revenue analytics
- Settings, activity, backup, and system health

## Done when

- Unauthenticated users cannot read or mutate admin data.
- Every edit survives restart and appears in the audit log.
- The complete import-to-publish workflow works in admin.

---

# Phase 5 — Connect public pages to production data

## Goal

Replace static arrays without changing the approved experience.

## Tasks

1. Read homepage recommendations from published offers.
2. Read catalog filters and results from normalized data.
3. Preserve shareable URL filters and sorting.
4. Connect offer and provider pages to current price/history records.
5. Make compare validate published offer IDs.
6. Retain `/for-me` only as a compatibility redirect; keep guided Finder rules archived in Git history unless future catalog evidence justifies rebuilding them.
7. Show unknown values honestly.
8. Add cache tags and invalidate after publishing.
9. Exclude staged, blocked, draft, hidden, and archived records from public queries.
10. Generate sitemap and metadata from published entities.
11. Add redirects for changed slugs.

## Done when

- Static offer/provider arrays can be removed.
- An approved publish updates the correct public pages.
- Private or invalid data never leaks publicly.

---

# Phase 6 — Affiliate redirects and analytics

## Goal

Measure product behavior and revenue without influencing editorial ranking.

## Outbound redirects

1. Route commercial links through `/go/[id]`.
2. Validate the offer and destination allowlist.
3. Select the active direct or affiliate URL.
4. Record a minimal event.
5. Return a fast `302`.
6. Never accept an arbitrary destination from the request.

## Event parameters

- Event ID/name, anonymous visitor ID, session ID
- Page route and placement
- Offer ID and provider ID
- Country group, device class, referrer class
- Occurred timestamp and privacy/Do Not Track result

Do not store raw IP addresses, full user-agent strings, emails, or raw search parameters for ordinary analytics.

## Events

- Page view
- Catalog search and filter change
- Compare add, remove, and open
- Offer view
- Shortlist view/click
- Outbound click

## Conversion imports

- Provider/network and conversion ID
- Offer/provider attribution or click sub-ID
- Pending, approved, reversed, and paid status
- Commission amount/currency
- Conversion and payout dates

## Dashboard outputs

- Most-clicked VPS plans
- Views, clicks, unique clicks, CTR, conversions, CVR, commission, and EPC
- Provider and placement performance
- Visitor countries and devices
- Searches and zero-result demand
- Catalog search/filter engagement and comparison use
- Revenue status and payout pipeline

## Integrity rule

Recommendation scoring must never read commission, revenue, conversion rate, or affiliate approval. Commercial analytics guide partnership work only.

## Done when

- Analytics tables display real values instead of placeholders.
- Redirect latency remains fast.
- Conversion imports are idempotent and auditable.
- Privacy and retention settings work.

---

# Phase 7 — SEO, email, and routine operations

## Goal

Make the product discoverable, trustworthy, and maintainable by one person.

## SEO and trust

- Provider and validated use-case pages
- Methodology and affiliate disclosure
- Correction and privacy policies
- Accurate structured data
- Canonical URLs, sitemap, robots, and social metadata
- Search Console integration and content analytics

## Communication

- Cloudflare Email Routing for `hello@`, `partners@`, `corrections@`, and `security@`
- Authenticated outbound email through Resend or a mailbox provider
- SPF, DKIM, and DMARC
- Correction form with evidence URL and Turnstile
- Partnership notes and follow-up dates in admin

## Scheduled operations

- Price freshness and affiliate-program rechecks
- Source-link health checks
- Trustpilot snapshot reminders
- Failed import/job alerts
- Backup status

## Done when

- Visitors can understand ranking, disclosure, and correction procedures.
- Domain email works correctly.
- Routine work appears as a small admin queue.

---

# Phase 8 — Testing, deployment, and launch

## Automated tests

- Price normalization and recommendation rules
- CSV normalization and validation
- Import, publish, rollback, and redirect integration tests
- Authorization tests for every admin mutation
- End-to-end catalog, compare, offer, login, edit, publish, and `/for-me` compatibility-redirect flows
- Accessibility, keyboard, metadata, and link checks

## Security

- CSP, HSTS, frame restrictions, and referrer policy
- CSRF, rate limits, and safe redirect allowlist
- Secret scanning and dependency review
- Upgrade Next.js to a supported patched release, then require no unresolved high-severity production dependency advisories
- Upload limits and protected database/backup files
- Sanitized structured logs with request IDs

## Performance targets

- LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 at p75
- Catalog response <= 100ms after data is loaded
- Minimal client JavaScript on public pages
- Fixed logo dimensions and lazy loading below the fold

## Deployment

1. Provision one small production VPS.
2. Deploy one reproducible Node/Docker application.
3. Mount persistent SQLite and evidence volumes.
4. Put Caddy in front for TLS, compression, and request limits.
5. Configure Cloudflare DNS/proxy.
6. Run migrations before traffic switches.
7. Add process/database `/health` checks and external uptime monitoring.
8. Configure nightly SQLite-safe encrypted R2 backups.
9. Initially retain 14 daily, 8 weekly, and 6 monthly backups.
10. Perform a real restore before launch and monthly afterward.
11. Document deploy, rollback, restore, and secret rotation.

## Launch checklist

- Database migrated
- Admin login and second factor verified
- Research imported, reviewed, and published
- Affiliate labels verified
- Analytics privacy verified
- Corrections and contact email working
- Backup and restore proven
- Accessibility and mobile review passed
- Core Web Vitals measured
- No secrets in source or logs
- Methodology, privacy, disclosure, and correction pages public

## Done when

- A fresh server deploys from the repository.
- A failed deploy rolls back.
- A lost database restores.
- Public site, admin, analytics, email, monitoring, and backups work together.

---

# Execution order

1. Repository baseline
2. Database schema
3. CSV and affiliate import
4. Authenticated admin
5. Public database connection
6. Analytics and affiliate tracking
7. SEO, email, and operations
8. Testing, security, deployment, and launch
9. Post-launch growth and maintenance
10. Guides and research content engine

Complete one phase before expanding the next. Do not redesign the frontend again unless backend integration exposes a real usability problem.

---

# Phase 9 — Post-launch growth and maintenance

After the real launch rehearsal, keep iteration deliberately small. Every change should pass CI, preserve editorial independence, and have one measurable reason to exist.

1. Run the same data, security, lint, and build checks in GitHub Actions.
2. Validate the dated CSV before an import can be reviewed; never silently publish source drift.
3. Use structured correction/provider issue templates so evidence arrives complete.
4. Show the latest publication/check date publicly without turning the homepage into a dashboard.
5. Review analytics weekly: catalog engagement, catalog-to-offer clicks, outbound rate, conversion rate, EPC, and correction volume.
6. Refresh SEO copy only when a page has a real search intent and current offer facts.
7. Track partner outreach as a small pipeline; commercial status must never enter ranking.
8. Handle privacy requests with minimum data, short retention, and documented deletion/export responses.
9. Update dependencies in small batches with audit, lint, build, and rollback notes.
10. Hold a monthly stop/start/continue review so this remains a low-maintenance side project.

---

# Phase 10 — Guides and research content engine

## Goal

Create a low-cost editorial system that teaches beginners, earns search traffic, and turns first-party VPS research into durable trust. Publicly call the section **Guides** or **Research**; avoid a generic company-news blog.

## Product rules

- Use local MDX first; do not add a paid CMS until Git-based publishing becomes a demonstrated bottleneck.
- Publish for a real reader question, not for keyword volume alone.
- Prefer first-party catalog evidence, dated provider sources, and reproducible comparisons.
- Every material claim must identify its source or method.
- Every page must show author, published date, updated date, snapshot date where applicable, and affiliate disclosure.
- Commission, sponsorship, and conversion data never influence editorial conclusions or catalog ranking.
- Do not mass-publish thin or lightly rewritten AI articles.

## Information architecture

- `/guides` for a featured guide, topic navigation, and a compact chronological list
- `/guides/[slug]` for the article template
- `/about` or `/authors/[slug]` for author experience and editorial standards
- `/feed.xml` for RSS
- Topic groups for beginner foundations, workloads, comparisons, dataset research, and founder/trust notes
- Contextual links from articles to prefiltered catalog results, relevant providers, offers, and methodology

## Article model

Required frontmatter:

- `title`
- `description`
- `slug`
- `author`
- `publishedAt`
- `updatedAt`
- `topics`
- `heroImage`
- `canonicalUrl` when externally syndicated
- `dataSnapshotAt` when catalog facts are used
- `reviewStatus`

The rendered article must support a table of contents for long guides, source notes, inline caveats, related guides, a prefiltered catalog action, and visible update history.

## Technical SEO

- `BlogPosting` and `BreadcrumbList` JSON-LD using only visible page facts
- Author URLs and author profile metadata
- Canonical URL, Open Graph, Twitter metadata, and representative images
- Automatic sitemap inclusion and RSS generation
- Descriptive internal links between guide, provider, offer, methodology, and catalog pages
- No indexation for drafts, previews, duplicate filters, or thin tag pages

## Initial publication set

1. What is a VPS? A beginner's guide
2. VPS vs shared hosting vs cloud vs dedicated server
3. How much RAM do n8n, Coolify, and WordPress need?
4. Why a cheap VPS price can be misleading
5. Hetzner vs netcup for a first European VPS
6. What 457 VPS offers reveal about the 2026 market
7. How bestvpsforme ranks plans without affiliate influence
8. How to choose the right server location

## Workflow

1. Draft against a defined reader question.
2. Add original analysis, examples, and source links.
3. Run factual, link, spelling, metadata, and structured-data checks.
4. Verify price and provider claims against the dated source snapshot.
5. Review disclosure and recommendation independence.
6. Publish through the normal build and deployment pipeline.
7. Recheck time-sensitive articles monthly or when source data changes.

## Done when

- The Guides index, article template, author/editorial page, RSS, sitemap, metadata, and structured data work in light and dark themes.
- At least six foundational guides and one dataset-backed research article are published.
- Articles link naturally into the catalog and report useful content-to-catalog analytics.
- A documented freshness queue identifies articles containing expired or changed offer facts.
