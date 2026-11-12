# Next source-check retirement batch — 30 September 2026

Prepared for review; no deletion in this proposal has been approved or performed. The earlier approved 21-file batch is committed. Inventory remains 131 retained TS checks and 150 npm entries.

Four checks have defensible replacements now:

| Exact file | npm entry | Replacement | Caller to update on approval |
|---|---|---|---|
| `scripts/check_catalog_state.ts` | `ui:catalog-state-check` | Catalog URL/query unit cases and browser URL/Back/trailing-space cases | `scripts/check_remediation.ts` |
| `scripts/check_analytics_session.ts` | `analytics:session-check` | Real handler session hashing/reuse/rotation case in `src/lib/analytics-events.test.ts` | `scripts/check_r7_automated_gate.ts` |
| `scripts/check_source_baseline.ts` | `remediation:source-baseline-check` | Full 457-row immutability/nonpublication subprocess cases in `src/db/research-csv-cli.test.ts` | `scripts/check_remediation.ts` |
| `scripts/check_contrast.ts` | `ui:contrast-check` | Rendered serious/critical axe checks across public pages and selected interaction states | `scripts/check_remediation.ts` |

The retained source-baseline check has been repaired to the current staging policy and passes; its future retirement avoids redundant checking. The contrast script duplicates a hardcoded palette rather than reading CSS. Its retirement would not claim every unused token or private admin state has been tested. Replace callers with relevant unit/browser commands and annotate historical reports; do not silently remove the gate.

Nine subsequent coverage tasks need these assertions before their checks can be proposed for deletion:

| Check | Required additional behavior assertion |
|---|---|
| `check_structured_data.ts` | Published seller facts and absence of unsupported aggregateRating in actual rendered JSON-LD |
| `check_provider_normalization.ts` | Three legacy aliases and presentation bounds across all research identities |
| `check_editorial_independence.ts` | Actual rendered methodology independence promise |
| `check_operations_trust.ts` | Methodology rule, footer disclosure, and offer disclosure preceding paid CTA |
| `check_home_polish.ts` | Rendered proof strip, details and catalog CTA |
| `check_provider_polish.ts` | Provider heading, subordinate catalog heading, plan count and official-site URL/target |
| `check_offer_polish.ts` | Decision actions/specifications precede operable progressive evidence |
| `check_chrome_polish.ts` | Navigation excludes Finder; computed responsive navigation/footer target dimensions |
| `check_frontend_readiness.ts` | Reduced-motion behavior |

No new tests are claimed by this inventory review. Preserve authenticated-admin checks, correction endpoints, publication/rollback invalidation, import transactions, failure matrices, bundle/performance budgets and guide parsing/discovery until their real behaviors are ported. Screenshots alone do not replace these. The fewer-than-15 npm target remains open.
