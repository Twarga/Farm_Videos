# Recovery, rollback, and alert QA — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


Historical command evidence below predates the [30 September check retirement](../progress/source-check-retirement-2026-09-30.md). Runbook/checklist phrase checks were retired; review those documents and verify actual rollback separately.

## Result

**Local recovery and alert contracts pass. Production recovery rehearsal remains blocked by owner infrastructure.**

## Local evidence

| Path | Command/result |
|---|---|
| Encrypted backup | `npm run launch:backup-check` passed: AES-256-GCM `BVF1` backup, owner-only `0600` mode, all 20 application tables and the migration table restore with `PRAGMA integrity_check = ok`, seeded counts remain 2 providers/2 offers, and a wrong key is rejected |
| SQLite consistency | The backup helper uses SQLite’s online backup API, so WAL contents are captured into the encrypted snapshot before restore |
| Alert formatting | `npm run operations:alerts-check` passed: severity and source are present, message details are capped at ten, and missing webhook configuration returns `{ sent: false }` |
| Alert delivery | The same check used a disposable localhost HTTP receiver; a configured webhook returned `{ sent: true }`, received JSON with `source: "bestvpsforme"`, preserved the critical severity, and excluded detail 10+ |
| Deployment rollback code | `npm run launch:runbook-check` and `npm run launch:checklist-check` passed; the runbook keeps the previous image and never deletes the database during rollback |
| Publication rollback | `npm run data:full-publication-check` passed atomic snapshot rollback and clean republish for the 322-offer publication |

## Recovery commands

Local contract rerun:

```sh
npm run launch:backup-check
npm run operations:alerts-check
# Review docs/ops/RELEASE_RUNBOOK.md and docs/ops/LAUNCH_CHECKLIST.md manually.
# Their retired phrase checks did not prove an actual deployment rollback.
```

Production drill after owner access exists:

```sh
BACKUP_KEY="$BACKUP_KEY" npm run launch:backup
# Upload the encrypted artifact to private R2 over TLS, then download it to a clean host.
# Restore to a temporary path, run PRAGMA integrity_check, migrate, and check readiness.
```

## Production blockers

The worktree cannot prove the following without owner-controlled infrastructure:

1. Uploading an encrypted backup to the real private Cloudflare R2 bucket and verifying the object listing.
2. Downloading that object to a clean host and replacing the application database atomically after integrity validation.
3. Starting the deployed previous image, running readiness, and testing application rollback on the selected VPS.
4. Triggering a real liveness/readiness failure through the external monitor and receiving the owner-channel notification.
5. Recording the production backup object, host, image digest, rollback result, and alert receipt.

No production traffic should open until these P0 paths pass on the deployed HTTPS origin. The local report proves the application’s cryptographic, database, rollback-procedure, and webhook contracts without claiming external execution.
