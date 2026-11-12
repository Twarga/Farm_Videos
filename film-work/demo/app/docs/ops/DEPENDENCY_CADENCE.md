# Dependency update cadence

Dependabot opens at most three npm updates per month plus monthly GitHub Actions updates. Merge one small batch at a time.

For each update:

1. Read the changelog and security notes.
2. Run `npm audit --omit=dev --audit-level=high`, the relevant focused checks, `npm run lint`, and `npm run build`.
3. Keep the previous lockfile/commit available for rollback.
4. Record breaking changes in the commit message and update the supported Node/Next baseline.

Do not run `npm audit fix --force` blindly in production; it can introduce a major framework migration.
