# Phase 7 accessibility evidence

## Verified result — 10 October 2026

Final production build `kfsfRayDWDzMr7Vzz_twm` passed the complete current-data audit with **zero automated violations and zero journey/runtime errors**. Evidence: [sanitized results](accessibility-results.json), [browser coordinator](browser-results.json), and [real database recovery](recovery-results.json). The raw sanitized report remains `/tmp/bestvpsforme-phase7-final-2h22bhi3/accessibility-final.json`.

- 261 ordinary page/state scans: 26 public/admin templates × five widths × two themes, plus genuine expired-session UI.
- 50 additional page scans at actual browser zoom 200%, in both themes. Browser extension `chrome.tabs.getZoom()` returned 2; the same window changed from 1440 to 720 CSS pixels, DPR 1 to 2. DPR was observed, never configured as a substitute.
- 41 ordinary keyboard/fixed-bar journeys, plus zoomed catalog/correction/admin journeys. Including their modal/validation/selection states, the report contains 371 scan objects.
- Reduced motion, native validation, session expiry, focus containment/restoration, 44px primary actions and document overflow were checked. Protected catalog/price/editorial/provider/publication hashes stayed unchanged.
- Final browser coordinator: 885 passes, 207 intentional fixture/profile skips, zero failures. The applicable nonce/admin/editorial/terms/large-catalog/recovery/freshness profiles all executed.

The audit reproduced and drove repairs to the 320px header, mobile comparison controls, reviewed marks, provider/admin wrapping, skip-link focus, compact-menu reverse Tab, sticky-header correction focus and selected-row dark-mode disclosure contrast. Mobile price bounds and the four hardware cells' row alignment have a failing-before/passing-after regression in all six browser projects. Both themes' 320px current-data screenshots and intentional mobile catalog/provider baseline changes were reviewed.

VoiceOver/NVDA remains **pending**: neither is available on this Linux workstation. This is automated lab evidence, not a WCAG conformance claim. Retained axe incomplete items require the manual follow-up below; they are not counted as automated passes.

### Zoom screenshots and their limitation

Playwright's ordinary screenshot API cropped the physical image when browser zoom doubled DPR, despite correct DOM geometry and successful layout assertions. Those cropped images must not establish visual acceptance. Supplementary captures use CDP `Page.captureScreenshot` without a CSS clip: physical images are 1440 × 913 while the confirmed CSS viewport is 720 × 456. [Capture provenance](zoom-capture-evidence.json) records the same build/source and actual browser zoom, plus zero document overflow. Reviewed examples: [light catalog](screenshots/phase7-zoom-cdp-light-catalog.png), [dark corrections](screenshots/phase7-zoom-cdp-dark-corrections.png). Both themes' catalog/corrections captures are retained. This is a capture repair, not an application layout or zoom substitution.

### Retained incomplete checks and manual review

The sanitized result retains every distinct rule, selector and failure summary, including findings in keyboard/modal states. No rule or region was disabled.

| Rule | Observed reason / review | Remaining verification |
| --- | --- | --- |
| `color-contrast` | Gradient highlights, native select background arrows, image/non-text glyphs and partially clipped or overlapping offscreen content prevented axe from resolving a background. Representative home highlights, fields, selected cards, disclosures and both themes were visually reviewed. A reproduced 4.09:1 selected-row Ad label was repaired using the existing muted text token and rechecked. | Human contrast review of retained selectors across relevant visible states; automation cannot establish contrast for every incomplete item. |
| `aria-prohibited-attr` | Generic board/chip wrappers, label wrappers and fallback flag spans have names that are not universally supported for their implicit role. Critical checkbox names are explicitly on the native inputs, visible headings label the board, and country/provider context is present. These are incomplete checks, not suppressed violations. | Verify useful announcements and absence of duplicated/missing names in the actual VoiceOver/NVDA journey. |
| `th-has-data-cells` | Comparison has intentional empty Add-plan placeholder columns when fewer than four plans are selected. Factual data cells have explicit row/plan header associations; unknown values remain text. | Check real screen-reader row/column association and placeholder announcements for one-, two- and four-plan states. |

All these incomplete items remain visible in the manual launch ledger. The real screen-reader checklist is required before accessibility acceptance.

## Commands and isolation

Run only after the coordinator announces that the final production build is ready. The source is the existing read-only online backup, not the live production database:

```bash
RUNTIME_SOURCE_DATABASE=/tmp/bestvpsforme-phase7-final-2h22bhi3/source.db \
RUNTIME_BUILD_DIR=/tmp/bestvpsforme-phase7-final-2h22bhi3/build \
ACCESSIBILITY_REPORT=/tmp/bestvpsforme-phase7-final-2h22bhi3/accessibility-final.json \
npx tsx scripts/check_accessibility_runtime.mts
```

Replace `RUNTIME_BUILD_DIR` with the coordinator's actual final build workspace when different. It must contain `.next/BUILD_ID` and installed dependencies and must not contain dotenv files. Do not run against the owner's preview build or create an additional build while another measurement owns its server.

The shared `scripts/phase7-runtime.ts` requires a real existing `/tmp` source, makes a unique SQLite online backup, chooses a free loopback port and starts Next directly with synthetic configuration. It terminates its detached server process group on normal cleanup and signals. The accessibility script closes browser contexts and browsers, adds a disposable synthetic admin account/session only in that backup, and hashes protected catalog, price, editorial, provider and publication rows before/after its audit. It does not migrate, import or publish data, change the 38 held drafts, or revoke the shared browser-fixture session. The original source remains read-only.

The separate deterministic browser suite uses the existing fixture/session contracts and all six configured projects (no blanket desktop-only skip):

```bash
E2E_REUSE_BUILD=1 npx playwright test tests/e2e/phase7-accessibility.spec.ts
```

Run this through the coordinator's isolated E2E workspace/profile. Fixture preparation and production build are prerequisites, not hidden work inside the accessibility command. The E2E expired-session check removes cookies in its own browser context; the current-data runtime expires its **own** synthetic session in SQLite to test genuine expiry while the browser retains the cookie.

## Automated coverage and report contract

The runtime writes a mode-0600 JSON report outside its disposable database directory, plus public-only PNGs in the sibling `*-screenshots` directory. It checkpoints each completed profile and marks interrupted runs incomplete. The report identifies the source backup/hash, active publication/counts, build directory/ID/commit, Node/Next/React/browser/axe versions, widths, themes, all scan findings, journey outcomes, errors, catalog preservation and manual launch gates. Credentials, cookie values, DOM HTML, form values, database dumps and server logs are not stored. Authenticated admin pages are scanned but not photographed. Catalog table/Cards viewport screenshots supplement the full-page screenshots for legible visual review.

Every public template is scanned at **320, 390, 768, 1024 and 1440 CSS-pixel widths**, in **light and dark**, with **reduced motion**:

- Home; catalog table and Cards URL; no matching plans; special offers (including its actual current empty/nonempty state).
- Empty, one-plan and filled comparison; canonical offer; provider directory and inventory.
- Guide directory/article; the article's author; methodology; about; updates.
- Corrections; privacy; terms; unknown-route 404.
- Authenticated admin console, editorial queue, terms queue, imports and assertive import-action failure notice.

Offer, provider, guide and author routes are discovered from real published pages, not assumed catalog sizes or synthetic additions. Failure to discover them is an unavailable measurement/error, not a passing empty scan.

Axe uses `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` and `wcag22aa`, without excluded regions, disabled rules or severity filtering. **All violations**, including moderate/minor findings, retain rule ID, impact, tags, help URL, targets and failure summary. Incomplete checks are retained separately for human review, not converted into passes. Every reported violation or automated error causes a nonzero exit. A real screen-reader or zoom check that cannot run stays visibly pending; zero automated violations does not close that launch gate.

Keyboard journeys cover skip navigation, compact menu, filter drawer containment/Shift+Tab/Escape/focus return, facet selection and immediate application, clearing, sort, pagination where the publication has more than 24 plans, two compare picks, differences, removal, and the provider action's focus and destination. The current design has **no Apply button**: a facet immediately updates the shared URL/results. There is no public search, slash shortcut, admin command palette or scroll-reveal assumption. The comparison tray is expected **off `/compare`**, not cleared through a nonexistent tray there. Provider checkout is never opened.

Correction validation uses keyboard submission with missing evidence, verifies native invalid-field focus and confirms no correction POST. Admin validation opens an unsaved draft, verifies native invalid-field focus, trap/Escape/restoration, then keeps a failed edit open after session expiry and verifies the protected redirect. Validation/session states receive separate axe scans.

Responsive assertions cover one `main`/`h1`, page-level overflow, reduced-motion content animations, 44 × 44 CSS-pixel primary-action targets, visible keyboard focus, and hit-testing the footer disclosure with comparison/mobile purchase bars. The comparison table may scroll inside its named region; the document must not overflow. Fixed-bar states are exercised with actual saved picks, not only direct comparison URLs.

The genuine database-failure/retry UI is exercised by the separate recovery worker/runtime, coordinated to use the same five WCAG tags and preserve **all** violations. Its report is required complementary evidence; the imports query-string failure notice is not a substitute for a database outage. Recovery evidence must include light/dark, narrow/wide, a real unavailable state and successful retry.

## Actual browser zoom

The runtime creates a disposable Chromium Manifest V3 extension and persistent browser profile. It calls **`chrome.tabs.setZoom(tabId, 2)`**, checks **`chrome.tabs.getZoom() === 2`**, and requires CSS viewport width to approximately halve with the same browser window. It scans all discovered public templates and the four authenticated admin templates in both themes, then runs the catalog, correction-validation and disposable admin validation/session-expiry keyboard workflows at that zoom. Only public screenshots are stored. DPR is recorded only as evidence; it is not set. Neither `deviceScaleFactor` nor CDP `Emulation.setPageScaleFactor` is used as a zoom substitute.

If the installed Chromium cannot load the extension, or browser zoom cannot be established, the report records pending with the exact reason. If the browser confirms zoom 2 but reflow/accessibility assertions fail, the result is **failed**, not relabeled unavailable. A viewport-only 720px test supplements reflow but does not prove text enlargement.

## Optional human browser-menu 200% zoom confirmation

Use a supported desktop browser with the final isolated build and disposable session. Record OS, browser/version, build ID and active publication ID. Use the browser's own menu or keyboard shortcut until its UI displays **200%**; include that indicator in a sanitized evidence screenshot. Do not alter OS display scaling, DevTools DPR, viewport emulation or pinch/page scale and call it browser zoom.

1. At 100%, note the window dimensions and body text. At 200%, confirm text visibly enlarges and CSS reflow changes without clipped headings/labels/actions; check both themes.
2. Home → catalog: keyboard-open compact navigation, reach all destinations, close with Escape and confirm focus return.
3. Catalog: open filters; move forwards/backwards through controls; select memory/price; confirm results update immediately; clear; sort; paginate. Keep the focused control visible and the document free of horizontal scrolling.
4. Select two plans. Check the fixed tray does not cover focused content/footer disclosure. Open compare, confirm no redundant tray, scroll the **named comparison region** without document overflow, toggle differences and remove plans.
5. Offer: confirm the mobile purchase bar, optional tray and footer disclosure remain usable together; do not activate checkout.
6. Corrections: submit missing evidence and confirm the invalid field is visible, labeled and reachable. Do not submit a real correction.
7. Disposable authenticated admin: open a draft, use the whole editor by keyboard, trigger missing-name validation, close/restore, then test an expired-session save. Confirm typed input remains visible and the authorization error is readable. Do not save/publish live content.
8. Record route/theme, text clipping, overlaps, focus visibility and exact observed failures. Attach sanitized screenshots; mask any identity or privately entered text.

## Real screen-reader checklist — pending

Complete **one actual NVDA or VoiceOver journey**, not an accessibility-tree inspection. Use Windows + NVDA + Firefox/Chrome, or macOS + VoiceOver + Safari. Record exact OS/browser/screen-reader versions, build ID, publication ID, tester/date and pass/fail notes for each step. Use a disposable fixture/session; never record tokens/passwords/MFA codes.

1. Load home. Read the page title; navigate landmarks/headings. Confirm one main and a meaningful h1. Activate Skip to content and confirm it moves reading/keyboard position past navigation.
2. Browse literal primary destinations. On a narrow window open Site menu, hear its dialog/name, tab forward/backward, Escape, and confirm focus returns to Open menu.
3. Catalog: hear filter names, values and selected states. Open the filter drawer, confirm focus containment and dialog name, select a facet, hear updated results/status, clear, sort and paginate. Confirm table headings stay attached to the correct plan/specifications.
4. Pick two plans. Hear each checkbox's state and the compare count. Open Compare; hear the table/scroll region names, row/column headers and unknown values. Toggle Only differences and remove a selected plan. Confirm no redundant comparison tray is announced on this route.
5. Offer: read price, hardware, evidence date, unknown values and the affiliate/direct disclosure next to the provider action. Focus the provider action without opening checkout.
6. Corrections: activate Send correction with empty required fields. Hear which labeled field is invalid; navigate back and correct locally, without submitting real content.
7. Guide/article/author, legal pages, 404 and real recovery UI: navigate headings/landmarks, follow the available catalog/retry action and verify its announcement/focus. A database-failure result must be clearly different from no filter matches.
8. Disposable admin: navigate console/editorial/terms/imports, open a draft, hear labels, trigger missing-name validation, close with Escape and confirm restoration. Expire the disposable session, attempt a save, hear the authorization alert, verify text remains and protected navigation returns to login.
9. Repeat essential selection/error steps in dark mode and reduced motion; note duplicate announcements, silent alerts, inaccessible controls or unexpected focus changes.

## Acceptance ledger

- Automated current-data audit, keyboard/reflow and actual browser zoom: **passed**, exact-build evidence linked above.
- Real SQLite failure/retry and HTTP 404, both themes at 390/1440px: **passed**, [recovery report](recovery-results.json).
- Changed mobile/public/synthetic-admin surfaces and supplemental zoom images: **reviewed**. Private admin screenshots remain outside the repository.
- Every retained incomplete item: preserved with representative visual/code review; **human contrast/announcement follow-up remains open**.
- Actual VoiceOver/NVDA journey: **pending external workstation**, checklist above.

The build and data are identified in `build-evidence.json` and `data-preservation.json`. Phase 7 accessibility is not fully accepted until the required manual checks are recorded.
