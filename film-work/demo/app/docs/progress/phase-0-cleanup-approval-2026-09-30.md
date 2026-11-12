# Phase 0 cleanup approval scope — 30 September 2026

Status: Tasks 0.2–0.4 completed on 30 September 2026 following the owner's task-specific instructions in this chat. Task 0.2's seven paths were removed through system Trash and remain recoverable; `.next/` and `tsconfig.tsbuildinfo` were regenerated during verification. Task 0.3's tracked cleanup and permanent Finder redirect are verified. Task 0.4 moved all 27 listed documents, fixed references and shortened README to 40 lines. Task 0.1's app checkpoint is `4e15cec` on `codex/resume-overhaul`.

The listed cleanup scope is complete. Later removal tasks require their own approval.

## Task 0.2 — local files

Measured before the checkpoint build; generated cache sizes can change.

| Path | Size | Proposed action |
|---|---:|---|
| `.next/` | 1.1 GB | Delete generated build cache |
| `third design/` | 39 MB | Delete old ignored experiment |
| `tmp/` | 36 MB | Delete ignored document working files and renders |
| `research-app/` | 228 KB | Delete ignored research experiment |
| `tsconfig.tsbuildinfo` | 776 KB | Delete generated TypeScript cache |
| `.ralph/` | 20 KB | Delete untracked agent loop state |
| `.impeccable/` | 16 KB | Delete ignored critique output |

Add `/.ralph/` to `.gitignore`, verify the development homepage returns HTTP 200 using a disposable database, then commit.

## Task 0.3 — tracked files

Delete the five starter assets:

- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`

Delete these three generated PDFs from the checkout and Git's current tree (history remains recoverable):

- `output/pdf/best-vps-for-me-market-handbook.pdf`
- `output/pdf/bestvpsforme-product-blueprint.pdf`
- `output/pdf/interface-design-pattern-field-guide.pdf`

Move these Markdown files into `docs/archive/research/`, preserving each filename:

- `output/bestvpsforme-product-blueprint.md`
- `output/designer-ai-master-prompt.md`
- `output/interface-design-pattern-field-guide.md`

Replace `src/app/for-me/page.tsx` with a permanent `/for-me` → `/catalog` redirect in `next.config.ts`, then delete the page file. Update its existing check to verify the redirect behavior. Read the bundled Next.js redirect guide before implementation. Verify typecheck, lint and HTTP 308 with the correct Location header, then commit.

## Task 0.4 — documentation moves

Move the 27 root documents listed below, preserving each filename. Update references throughout the repository, keep the master plan accessible at `bigone.md`, and reduce `README.md` to at most 60 lines. The root `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md`, and `DESIGN.md` remain alongside `README.md` and the master plan.

| Destination | Source files |
|---|---|
| `docs/product/` | `PRODUCT_CONTRACT.md`, `EDITORIAL_INDEPENDENCE.md`, `ANALYTICS_CONTRACT.md`, `CONTENT_GUIDE.md` |
| `docs/data/` | `DATA_QUALITY.md`, `DATA_REFRESH.md` |
| `docs/ops/` | `DEPLOYMENT.md`, `RELEASE_RUNBOOK.md`, `BACKUPS.md`, `MONITORING.md`, `OPERATIONS_ALERTS.md`, `OPERATIONS_SCHEDULE.md`, `OPERATIONS_EMAIL.md`, `OPERATING_CHECKLIST.md`, `LAUNCH_CHECKLIST.md`, `PERFORMANCE_BUDGET.md`, `PRIVACY_OPERATIONS.md`, `DEPENDENCY_CADENCE.md` |
| `docs/growth/` | `GROWTH_KPIS.md`, `PARTNERSHIP_OPERATIONS.md`, `PARTNERSHIP_PIPELINE.md`, `CONTENT_REVIEW.md`, `POST_LAUNCH_REVIEW.md` |
| `docs/archive/` | `APP_AUDIT_2026-08-31.md`, `REMEDIATION_PLAN.md`, `IMPLEMENTATION_PLAN.md`, `PROJECT_PROGRESS.md` |

Existing `docs/data/publication-2026-08-31.md` is already in its intended directory. Run the four required checks and affected documentation checks before committing the moves.

## Following work

After cleanup, start Task 1.9, then Task 1.10. Decisions D-7 (price horizon) and D-9 (FX/VAT) require owner input before their dependent implementation. Task 3.0 has a separate D-8 approval gate; the checkpoint does not grant brand integration approval.
