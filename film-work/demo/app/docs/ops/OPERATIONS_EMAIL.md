# Email operations

Use Cloudflare Email Routing for inbound mail and a transactional sender for outbound mail. Keep all credentials in the deployment environment, never in Git.

## Inbound addresses

Route these Cloudflare aliases to the owner mailbox:

- `hello@bestvpsforme.com` — general questions
- `partners@bestvpsforme.com` — provider and affiliate conversations
- `corrections@bestvpsforme.com` — sourced corrections
- `security@bestvpsforme.com` — security reports
- `privacy@bestvpsforme.com` — privacy requests

Cloudflare DNS must retain the MX records shown in Email Routing. Do not add a second competing MX provider.

## Outbound setup

Set `RESEND_API_KEY` and `EMAIL_FROM` (for example, `Best VPS for Me <hello@bestvpsforme.com>`). Add the sender domain's SPF, DKIM, and DMARC records exactly as the sender dashboard provides. Start with DMARC `p=none`, review reports, then move to `quarantine`/`reject` when legitimate mail passes.
