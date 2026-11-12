# bestvpsforme product and route contract

This contract records behavior that remediation work must preserve. It is intentionally short and testable. Detailed product reasoning remains in [PRODUCT.md](../../PRODUCT.md), [DESIGN.md](../../DESIGN.md), and [REMEDIATION_PLAN.md](../archive/REMEDIATION_PLAN.md).

## Product promise

bestvpsforme helps a beginner or practical self-hoster scan VPS offers, understand the real monthly price, see where the server runs, compare the important hardware, notice the catch, shortlist plans, and leave through an accurately labeled provider link.

## Non-negotiable integrity rules

1. Recommendation and organic catalog order never use affiliate status, commission, revenue, conversion rate, EPC, sponsorship, or partnership approval.
2. An affiliate link is labeled beside the commercial action. A direct provider link is not presented as an affiliate link.
3. Unknown information stays unknown. The application never converts a missing value into zero, unlimited, included, available, or a fabricated default.
4. Public facts come from an explicitly published database snapshot. Raw research is staged and reviewed before publication.
5. Prices and Trustpilot values are dated snapshots, not represented as live checkout data.
6. Canonical provider and offer URLs remain stable; known aliases redirect instead of creating duplicate pages.
7. The former workload Finder remains paused and `/for-me` redirects to `/catalog`. The approved Shore home constraint form may count/filter real published offers; it must not imply an additional workload recommendation service.
8. Public users do not need an account to browse, filter, compare, read evidence, or follow a provider link.

## Critical route contract

| Route | Required purpose | Required behavior |
|---|---|---|
| `/` | Decision door | Explains the promise, shows a small published shortlist and provider coverage, and leads to the catalog |
| `/catalog` | Primary comparison workspace | Reads published offers, supports shareable filtering/sorting/view state, compare selection, offer navigation, and labeled outbound actions |
| `/compare` | Shortlist comparison | Handles empty, partial, and filled selections; exposes differences without inventing missing facts |
| `/offers/[id]` | Canonical offer evidence page | Shows provider, price, hardware, location, catch, billing, verification, affiliate status, compare, and provider action |
| `/providers/[slug]` | Canonical provider inventory | Shows one provider identity and its published plans; aliases redirect to the canonical slug |
| `/methodology` | Ranking and evidence explanation | Explains normalization, dated snapshots, unknown values, affiliate independence, and corrections |
| `/corrections` | Evidence-based correction intake | Accepts a specific field, explanation, and source under rate-limit/Turnstile rules |
| `/updates` | Publication freshness record | Shows the latest reviewed snapshot without claiming a live feed |
| `/privacy` | Actual privacy behavior | Describes only events and identifiers the application really collects |
| `/admin` | Private operating surface | Requires authenticated owner access before exposing catalog, import, publication, analytics, or operational controls |

## Design invariants

- The owner-approved finished brand/shore/mockup is the public visual and behavioral reference; preserve CSS/classes, not a Tailwind rewrite. DESIGN.md records the superseded Highlighter decisions.
- Shore uses local Ubuntu Sans and Ubuntu Sans Mono, semantic tokens, crab/shell identity, night/day parity and shore-theme persistence with system preference when no choice is saved.
- Header/footer, mobile menu, compare pail, lantern transition, filters, receipt and evidence interactions follow the mockup; review tools and data.js never ship.
- Desktop catalog stays dense with a left rail; cards are optional. Narrow layouts preserve identity, price, hardware, rating, compare and outbound access.
- D-1: no global search/command palette; catalog search is off by default. Provider-name filtering is allowed; q URLs remain compatible.
- The approved home constraint finder computes real counts through existing catalog logic; it does not revive the retired /for-me workload product.
- Reference motion honors reduced motion, offscreen/hidden pause and immediate access to content. Primary tasks remain keyboard-operable and prices never wait for animation.
- Admin consumes Shore foundations without characters/motion, starts in night, and preserves its real auth, CSRF and audited actions.
- Typography, controls and responsive composition follow the approved reference; accessibility, evidence and third-party usage rights remain independent release gates.

## Accessibility and interaction invariants

- Every page has one meaningful `h1` and one `main` landmark.
- Every form control and icon-only action has a programmatic name.
- All primary tasks work by keyboard; overlays close with Escape and restore focus.
- Visible focus is never removed.
- Normal text targets WCAG AA contrast and mobile primary actions expose at least a 44 × 44 px hit area.
- The application distinguishes loading, no matches, no publication, unavailable service, validation error, and authorization failure.
- No page-level horizontal overflow is accepted at supported viewport widths.

## Data and publication invariants

- `data/vps-offers-2026-08-31.csv` remains immutable source evidence.
- Blocking source rows may be staged and rejected without modifying the original file.
- Missing optional facts follow explicit publication rules; missing effective price is non-publishable.
- Provider affiliate research is stored separately from offer facts.
- Publication is an explicit reviewed transaction with immutable job/checksum evidence and a rollback snapshot.
- Homepage counts, catalog results, provider inventories, offer pages, sitemap entries, and outbound destinations reconcile to the same active snapshot.
- Production never falls back to static TypeScript offers when the database is empty or unavailable.

## Security and operations invariants

- Admin mutations require authentication, authorization, CSRF protection, bounded inputs, and durable audit evidence.
- Redirect destinations are validated HTTPS URLs from reviewed records.
- Production retains CSP, HSTS, frame, MIME, referrer, and permissions protections; development exceptions never leak into production headers.
- Logs never expose passwords, recovery codes, raw session tokens, full IP addresses, raw user agents, imported secrets, or database contents.
- Release requires health checks, external monitoring, encrypted backup, restore proof, rollback instructions, and no unresolved P0/P1 launch defect.

## Change rule

If a requested change conflicts with this contract, stop and update the product decision explicitly before changing code. A test failure is not permission to weaken the contract.
