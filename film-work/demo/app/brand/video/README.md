# bestvpsforme video kit (Remotion)

Production spec for the launch demo and the social cut-downs. Nothing is rendered yet. This file is the brief, the storyboard, the script, and the build plan, so that a Remotion project can be scaffolded and built scene by scene without further design decisions.

- Brand source: `../BRAND.md`, `../tokens/tokens.json`, `../logo/*.svg`, `../fonts/*.ttf`
- Visual reference: `../mockups/*.html` (every UI shot in the video recreates a mockup screen as Remotion components, not screen recordings, so type stays sharp and every number can animate)
- Facts used on screen come from the 31 Aug 2026 snapshot. Re-check every number against the live publication on the day of the render (see "Fact lock" below).

---

## 1. Deliverables

| ID | Composition | Size | Length | Use |
|---|---|---|---|---|
| V1 | `LaunchFilm` | 1920 × 1080, 30 fps | 60 s (1,800 frames) | Home page, YouTube, X, Product Hunt |
| V2 | `LaunchVertical` | 1080 × 1920, 30 fps | 30 s (900 frames) | Reels, TikTok, Shorts |
| V3 | `TheAdSays` (data-driven) | 1080 × 1080, 30 fps | 12 s (360 frames) | Weekly "The ad says $X" series, one plan per post |
| V4 | `Bumper` | 1920 × 1080 and 1080 × 1920 | 4 s (120 frames) | Logo sting: intro/outro for everything |
| V5 | `OfferCard` (still) | 1200 × 630 | still | Programmatic OG fallback and social share of any plan |

All videos ship with burned-in captions (most social autoplay is muted) and a separate `.srt`.

## 2. Creative concept: "The highlighter"

Hosting ads are loud about one number and quiet about the rest. In our film, a volt highlighter sweeps across real fine print, and every sweep reveals a truer number. The rack mark is the recurring character: three server units, and the picked one slides out when the viewer "chooses".

**Rules for the film**
- Honest demo only. Every number on screen is a real snapshot value. No fake UI states. No "#1", no "best", no invented testimonials.
- The film is light (paper canvas) with one dark act (Act 3, "the method") for contrast, like the site.
- Motion vocabulary: highlighter swipe (left to right, `highlightFrames` = 16), the pick slide (spring `pick`), stamp press (scale 1.12 → 1 with spring `snappy`, plus a small shadow drop), and number roll (digits tween with tabular figures, 20 frames).
- One hero element per frame. Big type (min 72 px headlines, 36 px body at 1080p), 96 px safe margin, 160 px on vertical.
- No 3D in transitions. A single 3D moment is allowed: a browser frame of the catalog, tilted `rotateX(18deg) rotateY(-14deg)`, settling to flat with spring `heavy`.
- No glitch, shake, particles, lens flares, gradients, or glassmorphism. Nothing flashes more than 3 times per second.

## 3. Storyboard: V1 `LaunchFilm` (60 s @ 30 fps)

Frame ranges are inclusive. "VO" = voice-over line. "SFX" = sound design cue.

### Act 1 — The problem (0:00–0:14, f0–f419)

| # | Frames | Visual | Motion | On-screen text | VO | SFX |
|---|---|---|---|---|---|---|
| 1.1 | 0–74 | Paper canvas. A generic hosting ad fills the frame: giant "$4*" in wide 800, a grey "Get started" button. Provider-neutral (no logo). | Ad scales 1.04 → 1 (spring `smooth`). Asterisk pulses once at f45 in vermilion. | `$4/mo*` | "Every hosting ad has a number." | Soft room tone in. Tick at f45. |
| 1.2 | 75–179 | Camera pushes into the footnote under the ad (scale 1 → 3.2, origin at footnote). Fine print is now readable at 44 px. | Continuous push, `ease-in-out`, 105 f. | `*Introductory price for the first 3 months with a 12-month minimum term. Regular price applies thereafter.` | "And a paragraph they hope you won't read." | Paper rustle. |
| 1.3 | 180–299 | Volt highlighter sweeps three phrases one by one: "first 3 months", "12-month minimum term", "Regular price". Each gets a vermilion numbered pin (1, 2, 3). | Swipe 16 f each, 24 f apart. Pins pop with spring `pick`. | pins: `1` `2` `3` | "Intro periods. Contracts. Renewals." | Marker squeak × 3 (pitched up each time). |
| 1.4 | 300–419 | Pull back out. The "$4" is struck through in vermilion (stroke draws in 12 f). A sticker card slides up from the bottom: "3-year real price $10.42/mo". The number rolls from 4.00 to 10.42. | Card: translateY 120% → 0, spring `snappy`. Number roll 24 f. | `The 3-year real price` `$10.42/mo` · caption `IONOS VPS M+ · snapshot 31 Aug 2026` | "Do the maths, and four dollars is ten forty-two." | Stamp thunk on card land. |

### Act 2 — The product (0:14–0:40, f420–f1199)

| # | Frames | Visual | Motion | On-screen text | VO | SFX |
|---|---|---|---|---|---|---|
| 2.1 | 420–509 | Hard cut to the logo lockup centred, big. The rack's middle unit slides out; the highlighter sweeps behind "forme". | Bumper motion (see V4), 90 f. | `bestvpsforme` | "bestvpsforme reads the fine print for you." | Rack click + swipe. |
| 2.2 | 510–689 | Browser frame of the **catalog** (`mockups/catalog.html`) tilted in 3D, settles flat. Rows cascade in (stagger 3 f). The "3-yr real price" column header gets the highlighter. | Tilt settle, spring `heavy` 60 f. Rows stagger. | Header chip: `314 plans · 41 providers` | "Three hundred and fourteen VPS plans. Every one priced the way you'll actually pay." | Soft UI ticks per row (quiet). |
| 2.3 | 690–839 | Zoom into one row: Hostinger KVM 1. The advertised $6.49 strikes through; $8.32 lights up; the catch cell types in: "Pay 24 months upfront ($155.76). Renews at $11.99/mo." with a vermilion dot. | Zoom 1 → 2.4 on row, 40 f. Catch text reveal by words, 2 f per word. | `$8.32/mo` · `The catch` | "And the catch, written down, right next to the price." | Pen scratch under the catch. |
| 2.4 | 840–989 | Two more rows get **picked**: checkbox → volt, a volt rail on the left; the compare tray springs up from the bottom with logos flying into slots. | Tray: spring `pick`. Logos travel on a curved path, 18 f each. | Tray: `3 of 4 picked` → `Compare →` | "Pick a few." | Three soft clicks; tray whoosh. |
| 2.5 | 990–1199 | **Compare** screen (`mockups/compare.html`). Highlighter sweeps the best value in each row, top to bottom (Real price, Due today, Renewal, Disk). Verdict cards slide in. | Row sweeps 10 f apart. Cards stagger 6 f. | `Lowest 3-year cost: AlphaVPS C4G` | "See who's actually cheapest over three years, not just this month." | Marker squeaks, quieter and faster (a run). |

### Act 3 — The method, dark (0:40–0:52, f1200–f1559)

| # | Frames | Visual | Motion | On-screen text | VO | SFX |
|---|---|---|---|---|---|---|
| 3.1 | 1200–1319 | Wipe to Night (#0A0C10). The giant volt "0" from the home method panel. Caption below. | "0" scales from 0.9 with spring `snappy` (never from 0). | `0` · `paid placements` | "Nobody pays to rank." | Music drops to the low layer. |
| 3.2 | 1320–1439 | Three rule lines type in, mono, one after another: `Order never uses money.` `Unknown stays unknown.` `Every fact is dated.` A stamp presses at the end: `CHECKED 31 AUG 2026`. | Line reveal 20 f each; stamp press spring `snappy`. | the 3 rules + stamp | "Unknown facts stay unknown. Every number has a date." | Keyboard ticks; stamp thunk. |
| 3.3 | 1440–1559 | The formula block, big: `real = (due_today + renewals + extras) ÷ 36` with the volt variables lighting one at a time. | 24 f per variable. | formula | "One public formula for every plan." | Three soft chimes. |

### Act 4 — The close (0:52–1:00, f1560–f1799)

| # | Frames | Visual | Motion | On-screen text | VO | SFX |
|---|---|---|---|---|---|---|
| 4.1 | 1560–1679 | Back to paper. Headline in display 2xl: "We read the fine print." Highlighter sweeps "fine print." Then line 2 fades in: "You pick the server." | Swipe 16 f; line 2 opacity + y 14 px, 18 f. | headline | "We read the fine print." (beat) "You pick the server." | Swipe; music lifts. |
| 4.2 | 1680–1799 | Lockup + URL + volt pill button "Compare 314 plans →". Rack pick slides out one last time and settles. Hold for 60 f. | Button presses (scale .97) at f1730. | `bestvpsforme.com` | "bestvpsforme dot com." | Final chord; button click at f1730. |

### VO script (≈ 118 words, target 2.1 words/s including pauses)

> Every hosting ad has a number. And a paragraph they hope you won't read.
> Intro periods. Contracts. Renewals.
> Do the maths, and four dollars is ten forty-two.
> bestvpsforme reads the fine print for you.
> Three hundred and fourteen VPS plans. Every one priced the way you'll actually pay.
> And the catch, written down, right next to the price.
> Pick a few. See who's actually cheapest over three years, not just this month.
> Nobody pays to rank. Unknown facts stay unknown. Every number has a date.
> One public formula for every plan.
> We read the fine print. You pick the server.
> bestvpsforme dot com.

Voice direction: calm, dry, close-mic, slight smile. No hype and no upward inflection on the brand name. Following the `promo-video` skill: generate with ElevenLabs (IDs listed in that skill), check timings with Whisper, and fix any overlap by shortening lines, never by speeding them up.

## 4. V2 `LaunchVertical` (30 s)

Re-edit of V1: 1.1 → 1.3 → 1.4 (f0–299, compressed to 240 f), 2.3 (row as a full-width mobile card from `mockups/catalog.html` at 390 px scaled ×2.6), 2.4 (tray), 3.1, 4.1–4.2. Captions sit in the top third (the UI safe zone for Reels/TikTok is roughly 250 px top, 400 px bottom). Headline size 120 px.

## 5. V3 `TheAdSays` (12 s, data-driven series)

Props (zod schema): `{ provider, logo, plan, adPrice, realPrice, reason, snapshotDate }`.

| Frames | Beat |
|---|---|
| 0–59 | Volt canvas. "The ad says" + `adPrice` in wide 800 at 180 px. |
| 60–95 | Vermilion strike draws through `adPrice`. |
| 96–209 | Sticker card springs up: "The 3-year real price" + `realPrice` number roll + `reason` line. |
| 210–299 | Rack pick slides; lockup (on-volt variant) + URL. |
| 300–359 | Hold. |

Series backlog (all from the snapshot, re-verify before posting): IONOS VPS M+ ($4 → $10.42), Hostinger KVM 1 ($6.49 → $8.32), Time4VPS Linux 4 ($4.77 → $9.42), IONOS VPS L+ ($6 → $19.75).

## 6. V4 `Bumper` (4 s)

f0–20: ink tile scales 0.9 → 1 (spring `snappy`). f14–34: units fade in top to bottom (4 f stagger). f30–56: middle unit slides right 8/64 of tile width (spring `pick`) and turns volt. f44–72: wordmark types in by letter (2 f each). f60–76: highlighter swipe behind "forme". f76–119: hold. SFX: rack click at f30, swipe at f60.

## 7. Remotion project plan

Put it in `video/` at the repo root, with its own `package.json`, so the web app never bundles Remotion.

```
video/
  package.json            remotion, @remotion/cli, @remotion/fonts, @remotion/media, @remotion/transitions, zod
  remotion.config.ts
  public/
    fonts/MonaSans.ttf, GeistMono.ttf          ← copy from brand/fonts
    logo/*.svg                                  ← copy from brand/logo
    logos/*.svg|png                             ← provider marks from public/logos (unmodified)
    audio/vo.mp3, music.mp3, sfx/{swipe,click,stamp,tick}.wav
  src/
    index.ts
    Root.tsx                                    compositions + folders (Marketing / Social / Stills)
    brand.ts                                    import tokens.json → colors, type, springs
    fonts.ts                                    loadFont() for both families (local files)
    primitives/
      Highlight.tsx      progress-driven swipe (background-size via interpolate)
      Strike.tsx         vermilion line draw (SVG stroke-dashoffset)
      NumberRoll.tsx     tabular digit tween
      Stamp.tsx          press animation
      Rack.tsx           3 units + pick slide
      Sticker.tsx        ink outline + hard offset shadow
      BrowserFrame.tsx   chrome + optional 3D tilt
      Caption.tsx        burned-in captions from captions.json
    ui/                  Remotion re-implementations of mockup screens
      CatalogRows.tsx, OfferReceipt.tsx, CompareGrid.tsx, CompareTray.tsx, MethodRules.tsx
    scenes/
      Act1Ad.tsx, Act1FinePrint.tsx, Act1RealPrice.tsx,
      Act2Logo.tsx, Act2Catalog.tsx, Act2Catch.tsx, Act2Pick.tsx, Act2Compare.tsx,
      Act3Zero.tsx, Act3Rules.tsx, Act3Formula.tsx,
      Act4Headline.tsx, Act4Close.tsx
    compositions/
      LaunchFilm.tsx, LaunchVertical.tsx, TheAdSays.tsx, Bumper.tsx, OfferCard.tsx
    data/snapshot.ts     the facts used on screen (single source, see Fact lock)
```

Key implementation rules (from the Remotion best-practices skill):
- All motion comes from `useCurrentFrame()` + `interpolate` / `spring({ fps, config })`. No CSS transitions, no Tailwind `animate-*`.
- Springs come from `tokens.json → motion.spring` (`snappy`, `smooth`, `pick`, `heavy`).
- Scenes are placed with `<Series>` / `<TransitionSeries>`; transitions are 2D only (fade, slide, wipe).
- `defaultProps` stay inline on each `<Composition>`, typed with `type` (not `interface`), validated with a zod `schema` so they can be edited in Studio.
- Use `calculateMetadata` in `LaunchFilm` to set `durationInFrames` from the VO length.
- Fonts load through `@remotion/fonts` from `public/fonts` so renders match the site byte for byte.
- Images through `<Img src={staticFile(...)}>`; audio through `@remotion/media`.

Render commands:

```bash
npx remotion render LaunchFilm out/launch-1080p.mp4 --codec h264 --crf 16
npx remotion render LaunchVertical out/launch-vertical.mp4 --codec h264 --crf 18
npx remotion render TheAdSays out/ad-says-ionos.mp4 --props '{"provider":"IONOS", ... }'
npx remotion still OfferCard out/offer-hostinger-kvm-1.png --props '{...}'
```

## 8. Fact lock

`video/src/data/snapshot.ts` is generated from the live publication by a script (`scripts/export-video-facts.ts`, planned in `bigone.md` Phase 8) and records `snapshotId` and `checkedAt`. Rendering fails if the snapshot is older than 30 days or any value is `null`. The end card always shows the snapshot date.

## 9. Audio

- Music: one sparse, warm electronic bed, 96–104 BPM, with a low layer for Act 3. It must be royalty-free and licensed for commercial use (the `promo-video` skill bundles Pixabay tracks, and "Inspired Ambient" fits). Music ducks to −18 LUFS under VO.
- Master: −14 LUFS integrated, −1 dBTP.
- SFX: a real marker squeak (recorded, not synthetic), a rack-unit click, a rubber-stamp thunk, and soft UI ticks. Keep them 6–10 dB under the VO.

## 10. Accessibility and quality checklist

- [ ] Burned-in captions (Mona Sans 600, 44 px at 1080p, ink on paper at 92%, max 2 lines, max 32 characters per line) plus `.srt`
- [ ] No more than 3 flashes per second, no full-screen strobing volt
- [ ] Every number matches `snapshot.ts`, and the snapshot date is visible on the end card
- [ ] The affiliate model is disclosed in the video description: "Some links earn us a commission. It never changes the order."
- [ ] Provider logos unmodified, never animated in a way that distorts them
- [ ] Watch at 0.25× in Studio for pops and overlaps, then at 1× on a phone, muted
