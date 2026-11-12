# Phase 7 launch checklist

Updated 10 October 2026. This is a deployment handoff, not evidence of an external deployment. The September launch reports are historical; the current verification is recorded in `docs/progress/phase-7-delivery.md`.

## Application and data

- [ ] Review the final performance report against every unchanged budget. A successful build does not override a failed budget.
- [ ] Complete the real VoiceOver or NVDA journey and retained incomplete contrast/announcement review in `accessibility.md`; record the operating system, browser, screen reader and result.
- [ ] Keep all 38 editorial evidence holds, 20 open renewal targets and 16 quarantined corrections private/unmodified until their separate evidence review.
- [ ] Use the reviewed published SQLite database on persistent storage. Never seed or prepare E2E fixtures against that database.
- [ ] Build the exact release lockfile on Node 24. Run the current lint, typecheck, unit, browser and dependency gates before promoting it.

## Hosting and configuration

- [ ] Select the host and verify persistent database storage, ownership, disk capacity, restart policy and firewall. Expose the application through an HTTPS reverse proxy.
- [ ] Configure DNS and HTTPS for the canonical origin. Verify redirects, canonical URLs, sitemap and health endpoints from outside the host.
- [ ] Place secret values outside Git and logs. Configuration names include `APP_URL`, `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_TOTP_SECRET` and `BACKUP_KEY`. Keep `BESTVPSFORME_PUBLIC_DATA_MODE` unset/empty in production.
- [ ] Configure `CLOUDFLARE_TURNSTILE_SITE_KEY` and `CLOUDFLARE_TURNSTILE_SECRET_KEY` if enabling the correction challenge; verify the public form on the actual origin. Configure `RESEND_API_KEY` and `EMAIL_FROM` only for the email features actually enabled.
- [ ] If using R2 backups, configure `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY` and `CLOUDFLARE_R2_BUCKET` privately.
- [ ] Validate the response nonce on the actual HTTPS origin: fresh per HTML request, matching rendered scripts, no script `unsafe-inline`/`unsafe-eval`, and no duplicate policy from the proxy/CDN.
- [ ] Do not cache nonce-bearing HTML at the CDN or reverse proxy. Respect private/no-store responses; never share authenticated HTML. Static content-hashed assets may retain their normal caching.
- [ ] Verify admin login, MFA, validation, session expiry and logout in a private browser window. Rotate temporary credentials through the owner's private setup process before public launch.

## Operations and rollback

- [ ] Verify `/api/health/live` and `/api/health/ready` over HTTPS; configure monitoring and confirm a real alert reaches the owner.
- [ ] Assign ownership of encrypted off-host backups and their retention. Rehearse restoration to a separate location, run SQLite integrity/foreign-key checks, and verify the published offer count and readiness. Record backup identity without exposing credentials or data.
- [ ] Retain the previous application image/release and a consistent pre-release database backup. Phase 7 adds no migration, so application rollback restores the prior release without reversing catalog/editorial data.
- [ ] Rehearse rollback on an isolated restore before traffic opens. Confirm the old application can read the preserved database and serves healthy public routes.
- [ ] Record the release commit/image, backup identity, test evidence, remaining exceptions and the owner's traffic-opening decision.

No external service, DNS, monitoring subscription, credential rotation or public deployment was performed by this implementation.
