# Task 3.0 / D-8: exact contract approval scope

**Status: approved — recorded as D-8 in commit `c203d65` (30 September 2026).** The three binding files carry the Highlighter contract. This document is retained as the approval record; it described the gate before sign-off.

Review [the exact three-file patch](highlighter-contract-proposal-2026-09-30.patch) and [the existing Highlighter guidelines](../../brand/BRAND.md). The destinations are `docs/product/PRODUCT_CONTRACT.md` (Design invariants only), `DESIGN.md`, and `PRODUCT.md` (Personality/Anti-references only).

The proposal replaces Plex/crimson with Mona Sans + Geist Mono and ink/paper/volt/vermilion. It allows one sticker per page, button pills and 24–32 px hero radii. Volt text on paper remains forbidden. Existing density, responsive content, motion and accessible contrast requirements remain.

Every contract section outside Design invariants is byte-for-byte preserved: integrity, routes, accessibility/interaction, data/publication, security/operations and change rules. Every PRODUCT section outside Personality/Anti-references is unchanged. Approval will be recorded explicitly as D-8 in the landing commit and ledger.

Approval is limited to this contract change. It does not approve database migration/publication, price terms, any future tracked-file deletion, or implementation beyond the separately detailed Phase 3 plan. Phase 3 implementation remains pending until this gate lands.
