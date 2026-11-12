# Launch review — 2026-09-01

## Decision

**Do not open production traffic.** The local release candidate passes the available automated truth, security, accessibility, performance, container, recovery, and alert contracts. The P0 production launch review remains blocked by owner-controlled infrastructure and authorization.

## Local review

| Area | Evidence | Result |
|---|---|---|
| Published data | 322 approved offers, 43 providers, 20 application tables, full public parity | Pass |
| Public routes | Home, catalog, compare, offer/provider detail, sitemap, legacy redirect, HTTPS destinations | Pass locally |
| Trust surfaces | Methodology, privacy, corrections, affiliate disclosure, dated snapshot labels | Pass locally |
| Admin boundary | Authenticated session, MFA path, CSRF, owner mutations, publication confirmation, logout | Pass by local checks |
| Runtime safety | Production CSP, bounded failure states, request IDs, no fixture fallback in production | Pass |
| UI QA | 126 viewport/theme/zoom captures, AX tree and keyboard pass, local performance budgets | Pass locally |
| Recovery contracts | Encrypted backup/restore, rollback procedure, bounded alerts | Pass locally |
| Secrets and repository | `.env*`, runtime DBs, backups, and credentials excluded; production values absent | Pass |

## Required production sign-offs

| P0 gate | State | Owner action |
|---|---|---|
| Selected VPS and firewall | Blocked | Supply host, admin source IP, SSH restriction, persistent volume, and security-update access |
| Production DNS/TLS | Blocked | Point apex and `www` DNS through Cloudflare after origin HTTPS works; verify external certificates |
| Production secrets | Blocked | Populate server secret store with auth, MFA, database, backup, email, and optional Turnstile/R2 values |
| Full approved snapshot | Blocked | Run the reviewed publication workflow on the production database and record checksum/counts |
| External health checks | Blocked | Confirm live/readiness return expected HTTPS responses from outside the host |
| Admin smoke | Blocked | Verify login, MFA, edit, publish, rollback, and logout in a private production window |
| R2 backup/recovery | Blocked | Upload encrypted backup, restore on a clean location, validate integrity, and record object identity |
| Deployed rollback | Blocked | Start previous image, validate readiness, and preserve the database during rollback |
| Alert receipt | Blocked | Trigger a monitor failure and confirm notification in the owner channel |
| Owner launch approval | Blocked | Sign the launch commit, date, backup object, rollback result, and traffic decision |

## Release decision

The repository remains in pre-production. Keep public traffic closed while any listed P0 gate is blocked. This report records the decision and handoff requirements; it does not claim that an external deployment or recovery drill occurred.
