# brand/

The bestvpsforme identity ("Highlighter"), the full UI remake as clickable mockups, the marketing kit, and the video brief. The rules are in `BRAND.md`.

## Open

- Mockup gallery: `mockups/index.html` (double-click; no server needed)
- Brand sheet: `mockups/brand.html`
- Marketing kit: `marketing/index.html`
- Video storyboard: `video/README.md`, key frames in `video/frames/`
- Dark twin of any mockup: add `?theme=dark` to the URL. Add `?static` to skip scroll animations (used for screenshots).

## Rebuild

```bash
# Logo SVGs (outlines the wordmark from brand/fonts/MonaSans.ttf)
python3 -m venv /tmp/fontvenv && /tmp/fontvenv/bin/pip install fonttools uharfbuzz
/tmp/fontvenv/bin/python brand/logo/build_logo.py

# PNG exports of the mark
cd brand/logo && for s in 16 32 48 180 192 512 1024; do magick -background none -density 1200 mark.svg -resize ${s}x${s} png/mark-$s.png; done

# Screenshots of a mockup (Chromium headless)
chromium-browser --headless=new --hide-scrollbars --allow-file-access-from-files \
  --window-size=1440,1100 --virtual-time-budget=3500 \
  --screenshot=brand/previews/home-desktop.png "file://$PWD/brand/mockups/home.html?static"
```

## Data in the mockups

Specs, Trustpilot figures, and billing notes come from `data/vps-offers-2026-08-31.csv` (checked 31 Aug 2026). The 3-year real prices are computed from the providers' own billing notes. EUR prices are converted at an **illustrative** 1.09 rate; the product must use a dated published rate. Affiliate flags in the mockups are illustrative. See `mockups/assets/bvf-data.js`.
