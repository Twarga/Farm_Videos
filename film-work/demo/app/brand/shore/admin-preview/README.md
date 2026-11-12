# Shore admin design preview

Standalone proposal, not the authenticated admin and not a completed implementation phase. The production Next.js app, database, auth, MFA, CSRF, audit and publication actions are unchanged.

## Open

Serve the workspace root using the existing mockup server on port 8794, then open:
http://127.0.0.1:8794/bestvpsforme/bestvpsforme/brand/shore/admin-preview/index.html

## What works

- Eleven sidebar sections, with deep-link hashes and keyboard focus.
- Night/day theme button; night default.
- Responsive sidebar and horizontally scrollable evidence tables.
- Actual candidate counts from PROVIDER_EXPANSION_FOLLOWUP.md; no production snapshot/health/backup numbers.

## Visual contract

Uses the unchanged ../mockup/shore.css for tokens, fonts, buttons and pills. preview.css adds only admin layout, without characters or motion. No mockup data.js is loaded. Authentication, uploads, provider edits, publishing, rollback and settings writes are deliberately not wired. Research observations are not approved public facts.

## Verification

From the application root run npx tsx scripts/visual/check-admin-preview.ts with the local static server running. It exercises all eleven sections at 390/768/1440 in day/night, scans overview/providers/settings with axe and captures twelve screenshots under docs/design/v1-shore/admin-preview/. Automated accessibility checks do not replace a human screen-reader pass. This is not certification of the real admin panel.
