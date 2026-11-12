# Admin walkthrough — 2026-10-26

Manual click-through of every administrative action named in
[`docs/FIX_BUGS_READY_PRODUCTION_PLAN.md`](../FIX_BUGS_READY_PRODUCTION_PLAN.md) C4, signed in with a
password and a real TOTP code.

## Environment

- `next dev` on `http://127.0.0.1:3300`, started from a throwaway working copy of the app.
- Database: `/tmp/opencode/bvp-render.db`, a consistent copy of `data/bestvpsforme.db` taken with
  SQLite `.backup`. **No production database or deployment was touched.**
- Local owner account `owner@example.com` bootstrapped from `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` and
  `ADMIN_TOTP_SECRET`; the six-digit code was generated from that secret for each sign-in.
- Browser: Playwright Chromium at 1440 × 1000. The final run reported **no page errors and no console
  errors**.
- Screenshots: [`admin-walkthrough-2026-10-26/`](admin-walkthrough-2026-10-26/).

## Result

| Step | Action | Evidence | Audit row |
| --- | --- | --- | --- |
| 1 | Password + TOTP sign-in | `01-login.png`, `02-overview.png` | none — only failed sign-ins are audited (`admin.login_failed`) |
| 2 | `Start CSV review` → preview → type `publish` → publish | `03-import-preview.png`, `04-import-published.png` | `admin.import_published` |
| 3 | Accept the `racknerd-special-1gb` price correction against the approved staged row | `05-corrections-open.png`, `06-corrections-accepted.png` | `admin.correction_accepted` |
| 4 | Reject the `racknerd-special-2gb` price correction | `07-corrections-rejected.png` | `admin.correction_rejected` |
| 5 | Roll the catalog back to release #6 | `08-rollback.png` | `admin.snapshot_rollback` |
| 6 | Edit RackNerd Trustpilot score 4.3 → 4.4, then restore 4.3 | `09-provider-edited.png`, `10-provider-restored.png` | two `admin.provider_saved` |
| 7 | Enable catalog search, then restore “disabled” | `11-setting-enabled.png`, `12-setting-restored.png` | two `admin.setting_saved` |
| 8 | Review the audit log | `13-audit.png` | — |

### Import and rollback

The staged CSV (`data/vps-offers-2026-08-31.csv`) previewed **0 created · 0 updated · 322 unchanged ·
76 hidden · 59 rejected**, with no unresolved verification issues, and published 322 public rows as
snapshot #8. Rolling back snapshot #6 (`Published import special-offers-2026-10-07.json`) restored the
previous catalog (`restoredOffers: 330`); snapshot #8 is now `rolled-back` and #6 is `published`.

### Corrections

Both corrections were submitted through the public `POST /api/corrections` endpoint with the
provider’s specials page as the cited source. The accepted correction is linked to an approved staged
row (`a8b2f1c4-…-5b37497186:228`), so the claim, source, resolution note and staged row stay together;
the rejected one keeps its claim and rationale for the public record. This is QA data in a throwaway
database, not editorial evidence for production.

### Audit excerpt

```
admin.import_published      import_job:a8b2f1c4-…  after {"status":"published","publishedRows":322,"snapshotId":"fa130a7c-…","snapshotVersion":8}
admin.correction_accepted   correction:fdfff5e6-…  after {"status":"accepted","stagedRowId":"a8b2f1c4-…:228"}
admin.correction_rejected   correction:c5dee885-…  after {"status":"rejected","note":"The cited page lists $35.99 per year…"}
admin.snapshot_rollback     publication_snapshot:341cd929-…  before {"fromSnapshotIds":["fa130a7c-…"],"fromSnapshotVersions":[8]} after {"toSnapshotVersion":6,"restoredOffers":330}
admin.provider_saved        provider:racknerd    4.3 → 4.4, then 4.4 → 4.3
admin.setting_saved         catalogSearch        false → true, then true → false
```

All rows name `owner@example.com` as the actor. The public correction submissions have their own audit
rows written from the unauthenticated endpoint, not from this walkthrough.

## Bug found and fixed during the walkthrough

Accepting a correction was impossible in the browser. Staged import rows use the id
`<importJobId>:<rowNumber>` (see `src/db/staging.ts`), but `acceptCorrection` required
`z.string().uuid()` and the input’s `pattern` only allowed 36 hex/dash characters. The server rejected
every real id with *“Select an approved staged row and explain how it resolves the claim.”*

Fix (committed separately): accept the real `job-id:row-number` key on the server, correct the input
pattern so browsers validate it (the old pattern was also invalid under the `v` regex flag and was
silently ignored), and change the action test to build ids the way staging does. After the fix the
same click path succeeded, and the final run is the evidence above.

## Notes and limits

- The provider score and catalog-search setting were restored to their recorded values after the
  edit; both changes are visible in the audit log as separate rows.
- The QA resolution note for the accepted correction is generic. A production acceptance must cite
  the specific reviewed row and its source.
- Screenshots of the import pages are viewport-sized because the review page lists hundreds of price
  terms; the other pages are full-page captures.
