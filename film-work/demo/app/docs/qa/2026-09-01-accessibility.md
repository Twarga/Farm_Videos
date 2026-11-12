# Runtime accessibility QA — 2026-09-01

> Historical verification record: npm aliases shown here were used at the time. For current commands, see `docs/ops/MAINTENANCE_COMMANDS.md`; behavior gates now run through Vitest/Playwright.


## Result

**Pass.** The local production build completed the keyboard, accessibility-tree, focus, reduced-motion, and live-error matrix with zero task-blocking findings.

Rerun from the repository root:

```bash
npm run build
npm run release:accessibility-check
```

The check publishes 322 reviewed offers into a temporary SQLite database, creates a disposable admin session, starts `next start`, and drives Chromium through the DevTools protocol at 390 × 844.

## Automated assistive-technology matrix

| Area | Evidence | Result |
|---|---|---|
| Screen-reader structure | Chromium `Accessibility.getFullAXTree` on home, catalog, compare, offer, and provider routes | Each exposes a `main` landmark and at least one named heading |
| Named controls | Runtime inspection of buttons, links, inputs, selects, and textareas on five public routes | Every route exposes named interactive controls |
| Keyboard search | `/` from a non-editing page target | Focus moves to `#catalog-search` |
| Filter dialog | Open at 390px, focus initial close control, wrap forward with Tab, close with Escape | Dialog has `role=dialog`, `aria-modal=true`, labelled focus trap, and restores focus to the opener |
| Progressive details | Focus mobile Details control, press Enter | `aria-expanded` changes to true and the labelled details region appears |
| Admin command palette | Activate the command trigger, inspect input, press Escape | Labelled search dialog opens and closes with Escape |
| Admin offer drawer | Activate New offer, press Escape | Labelled modal drawer opens and closes without leaving an overlay |
| Error announcement | Authenticated import route with `status=server_error` | `role=alert`, `aria-live=assertive`, and the request reference are present |
| Reduced motion | Emulate `prefers-reduced-motion: reduce` | CSS probe reports `animation-name: none` and `transition-duration: 0s` |
| Page-level overflow | 390px production profile | No task-blocking document overflow |

## Existing contract checks included

The complete remediation gate also runs the source contracts for labels, headings/landmarks, keyboard flows, contrast, icon semantics, button states, filter focus management, progressive details, reduced motion, and mobile controls.

```text
Runtime accessibility check passed: Chromium AX trees expose main/headings and named controls on five public routes; keyboard search, filter trapping/restoration, progressive details, admin palette/drawer, assertive errors, and reduced-motion behavior all pass at 390px
```

## Scope

This evidence covers Chromium’s accessibility tree and keyboard behavior on the local production build. It is not a substitute for a human VoiceOver, NVDA, or TalkBack session on the deployed origin. R7-06 and R7-08 remain responsible for deployed-origin smoke tests and owner sign-off.
