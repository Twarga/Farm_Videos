# Shore mockup baselines

Run from the application root:

```sh
npx tsx scripts/visual/capture-shore.ts
```

The static server must serve the workspace root, as described in brand/shore/mockup/README.md. SHORE_MOCKUP_URL may override the local URL. No database is read or modified.

Each route template is captured full-page in Chromium at 390×844, 768×1000 and 1440×1000, in day and night. All six fixture guides are included. About/authors are not implemented in the mockup; their production layouts must reuse the reading-page pattern, not invent a baseline.

The mockup remains unmodified. The review panel is hidden only for capture because it must not ship. Playwright disables animations during screenshots; the browser's motion preference remains normal. Capture promotes logo images from lazy to eager loading without changing pixels, so offscreen logos finish loading before full-page capture. These are visual reference fixtures, not evidence of real production prices or accessibility/performance certification.

manifest.json records source hashes (including fixture data for reproducibility), copied-asset equality, browser version, source commit, route titles, overflow and page/request errors. The source commit alone is not the mockup identity because the handoff files began untracked; sourceSha256 is authoritative. Never copy data.js into public/ or application runtime code.
