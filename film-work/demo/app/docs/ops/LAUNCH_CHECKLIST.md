# Production launch sign-off

This checklist is completed on the real server, after the owner supplies the VPS and DNS credentials.

- [ ] VPS firewall allows only SSH-from-admin-IP, HTTP, and HTTPS.
- [ ] `.env.production` exists only on the server and contains strong secrets.
- [ ] Encrypted backup uploaded to private R2 and restore drill has passed.
- [ ] Database migration completed before traffic switch.
- [ ] `/api/health/live` and `/api/health/ready` return 200 externally.
- [ ] Home, catalog, compare, offer, corrections, the `/for-me` compatibility redirect, and `/go/[id]` smoke checks pass.
- [ ] Admin login, MFA, edit, publish, and logout work from a private window.
- [ ] Uptime alerts are armed and a test notification was received.
- [ ] Cloudflare DNS/proxy and email routing are verified.
- [ ] Owner records the launch commit, date, backup object, and rollback image.

Do not open public traffic while any P0 item is unchecked.
