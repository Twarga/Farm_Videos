# Phase 7 Acceptance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish exact-build Phase 7 performance, security, accessibility, recovery and local launch readiness without altering production data or claiming unperformed human/external acceptance.

**Architecture:** Reuse the production measurement runtime and existing browser coordinator. Build one credential-free snapshot and give every current-data measurement the same immutable SQLite online backup. Run load/interaction measurements serially without competing builds or browser tests; source-only security and operations research can proceed independently.

**Tech Stack:** Next 16.3.8, React 19.2, webpack, Node 24, SQLite, Playwright, axe, Lighthouse 13.5, web-vitals 6.2.

**Spec:** `bigone.md` Phase 7; `docs/qa/phase-7/launch-checklist.md`; `docs/qa/phase-7/performance-method.md`; `docs/qa/phase-7/accessibility.md`.

## Global Constraints

- Lighthouse mobile: LCP < 2.0 s, CLS < 0.05, lab INP < 200 ms, JS on `/catalog` < 120 KB gzip. Complete initial script set includes framework/shared scripts; KB = 1000 bytes. Preserve all failed/invalid samples.
- Three cold/warm pairs on all seven public templates, and three repeats of each of eight lab interaction journeys. Local lab results are not field p75.
- Both themes, 320/390/768/1024/1440 CSS widths, keyboard workflows and actual browser zoom 200%. No axe rule suppression or severity filtering.
- Preserve all 38 editorial draft holds and all publication/price facts. No production migration, import, publishing or credentials changes; generated authentication exists only on private database copies.
- Nonce-bearing and authenticated HTML must not enter shared caching. Keep production script policy free of unsafe-inline and unsafe-eval.
- The owner approved Linux + Orca + Firefox on 12 October because only Linux is available. Record the same real screen-reader journey and human incomplete-check review; NVDA/VoiceOver remain alternative supported-platform checks. Automation is not a replacement or conformance claim.
- DNS, public HTTPS, monitoring alerts, external secrets, off-host backup ownership and traffic opening remain external gates unless genuinely exercised with authorized access.

## Task 1: Exact build and security

**Files:** Reuse `scripts/phase7-runtime.ts`, `scripts/measurement-workspace.ts`, `scripts/check_security_headers.ts`. Record current provenance in `docs/qa/phase-7/build-evidence.json` and preservation in `data-preservation.json`; preserve historical evidence before replacement.

- [ ] Make a private `/tmp` online backup from SQLite `mode=ro`; record integrity, foreign keys and all table row hashes without serializing private rows.
- [ ] Copy the known build inputs and lockfile without dotenv/data, install/link existing resolved dependencies, and run `env -i PATH="$PATH" HOME="$HOME" NODE_ENV=production DATABASE_URL=:memory: BESTVPSFORME_PUBLIC_DATA_MODE= NEXT_TELEMETRY_DISABLED=1 npm run build` in that snapshot.
- [ ] Record source input hashes, installed versions and BUILD_ID. Review installed Next CSP guides before any implementation repair.
- [ ] On a disposable runtime from this build, probe fresh document nonces, matching rendered script nonces, policy/cache headers, Pages data route, private admin routes and readiness. Preserve source-backed rendering rationale.

## Task 2: Full unchanged performance acceptance

**Files:** Reuse `scripts/check_performance_runtime.mts`, `scripts/check_phase7_js_budget.ts`. Update `docs/qa/phase-7/performance-final.json`, `catalog-js-budget.json`, `performance-findings.md`.

- [ ] Run `RUNTIME_SOURCE_DATABASE=BACKUP RUNTIME_BUILD_DIR=BUILD PERFORMANCE_PHASE=final PERF_RUNS=3 PERF_REPORT_PATH=docs/qa/phase-7/performance-final.json PERF_ARTIFACT_DIR=PRIVATE_ARTIFACT_DIR npm run measure:phase7` after the build, with no competing measurement workload.
- [ ] Require all 42 loads and 24 journeys, unchanged strict thresholds, complete provenance and unchanged protected content.
- [ ] Run `RUNTIME_SOURCE_DATABASE=BACKUP RUNTIME_BUILD_DIR=BUILD JS_BUDGET_REPORT_PATH=docs/qa/phase-7/catalog-js-budget.json npm run check:phase7:js`; retain HTML, inline data, SVG and later cross-router download costs separately.
- [ ] If a real defect fails a budget/journey, reproduce and identify the cause before a minimal source repair. Keep failed evidence; rebuild changed runtime sources and rerun the complete matrix against the resulting build.

## Task 3: Freshness, recovery and accessibility

**Files:** Reuse `scripts/check_phase7_freshness.ts`, `check_phase7_recovery.ts`, `check_accessibility_runtime.mts` and existing six-profile browser suite. Update current `freshness-results.json`, `recovery-results.json`, `accessibility-results.json`, `accessibility.md` and public screenshots.

- [ ] Run existing freshness and recovery commands against the exact build; inspect publication mutation visibility, expiration, genuine unavailable/failure/retry, 404 and restored health.
- [ ] Run `RUNTIME_SOURCE_DATABASE=BACKUP RUNTIME_BUILD_DIR=BUILD ACCESSIBILITY_REPORT=PRIVATE_REPORT npm run check:phase7:a11y` against current publication data.
- [ ] Review sanitized results and public screenshots, including actual zoom captures. Retain every incomplete rule/selector; review resolvable contrast directly and keep human announcement/association checks explicit.
- [ ] Repair observed defects at their source, preserve failing-before evidence, and reverify affected runtime behavior. Do not substitute structural/text tests for consumer behavior.
- [ ] Record actual supported-platform screen-reader acceptance if accessible; otherwise identify the exact missing human/workstation prerequisite and do not tick the accessibility acceptance box.

## Task 4: Launch readiness and integrated closure

**Files:** Reuse existing backup/restore, health/auth/security scripts and the Dockerfile's existing `builder` administration target. Correct `.env.example`, `docs/ops/DEPLOYMENT.md`, `BACKUPS.md` and `RELEASE_RUNBOOK.md` where launch commands differ from the shipped standalone payload. Update `docs/qa/phase-7/launch-checklist.md`, `docs/progress/phase-7-delivery.md`, Phase 7 status and `bigone.md` only where proven.

- [ ] Rehearse encrypted backup restoration on a separate disposable database and verify integrity, foreign keys, publication identity and readiness. Never call an external backup service or live write command.
- [ ] Verify packaged standalone public routes/assets, admin protection and genuine 404; establish isolated rollback compatibility without changing the live release.
- [ ] Reproduce the standalone `db:migrate` failure, use the source-bearing builder image for one-off administration, and verify container/standalone startup and migrated-copy compatibility without touching a real volume. Keep container-build database input in memory; correct unused/mismatched environment-template names without changing owner secrets.
- [ ] Run `env CI= npm run release:check` serially after measurements/repairs. Preserve observed gate counts and separate synthetic browser-fixture evidence from current-data evidence.
- [ ] Recompare every live/source table with the initial read-only hashes. Stop owned servers/contexts and remove throwaway scaffolds while retaining evidence.
- [ ] Record external deployment/monitoring/human gates honestly, update acceptance checkboxes only when all named requirements pass, and commit scoped verified changes without pushing or deploying.
