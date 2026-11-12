"""Build the bestvpsforme logo system as outlined SVGs.

Run:  python3 -m venv .venv && .venv/bin/pip install fonttools uharfbuzz
      .venv/bin/python brand/logo/build_logo.py

The wordmark is set in Mona Sans (OFL) at wdth 125 / wght 800, shaped with
HarfBuzz for kerning, then converted to outlines so the SVGs need no fonts.
"""

from __future__ import annotations

import io
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "logo"
FONT = ROOT / "fonts" / "MonaSans.ttf"

INK = "#0E1116"
PAPER = "#FFFFFF"
VOLT = "#D4FF3A"

WORD = "bestvpsforme"
HIGHLIGHT_FROM = WORD.index("forme")
TRACKING_EM = -0.028


def instance(wdth: float, wght: float) -> tuple[TTFont, bytes]:
    font = TTFont(FONT)
    inst = instancer.instantiateVariableFont(font, {"wdth": wdth, "wght": wght})
    buf = io.BytesIO()
    inst.save(buf)
    data = buf.getvalue()
    return TTFont(io.BytesIO(data)), data


def shape(data: bytes, text: str):
    face = hb.Face(data)
    font = hb.Font(face)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {"kern": True, "liga": False})
    return buf.glyph_infos, buf.glyph_positions


def wordmark_paths(size: float = 100.0):
    """Return (list of (char_index, path_d)), advance width, metrics in px at `size` px/em."""
    font, data = instance(125, 800)
    upem = font["head"].unitsPerEm
    scale = size / upem
    glyph_set = font.getGlyphSet()
    order = font.getGlyphOrder()
    infos, positions = shape(data, WORD)
    x = 0.0
    paths = []
    for info, pos in zip(infos, positions):
        name = order[info.codepoint]
        pen = SVGPathPen(glyph_set, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
        tpen = TransformPen(pen, (scale, 0, 0, -scale, x + pos.x_offset * scale, 0))
        glyph_set[name].draw(tpen)
        paths.append((info.cluster, pen.getCommands()))
        x += pos.x_advance * scale + TRACKING_EM * size
    x -= TRACKING_EM * size
    os2 = font["OS/2"]
    metrics = {
        "xheight": os2.sxHeight * scale,
        "cap": os2.sCapHeight * scale,
        "ascender": font["hhea"].ascent * scale,
        "descender": font["hhea"].descent * scale,
    }
    starts = []
    xx = 0.0
    for info, pos in zip(infos, positions):
        starts.append((info.cluster, xx, pos.x_advance * scale))
        xx += pos.x_advance * scale + TRACKING_EM * size
    return paths, x, metrics, starts


def wordmark_group(ink: str, highlight_ink: str, size: float = 100.0, with_highlight: bool = True, hl_fill: str = VOLT):
    paths, width, m, starts = wordmark_paths(size)
    hl_x0 = next(x for c, x, _ in starts if c == HIGHLIGHT_FROM) - 0.012 * size
    hl_x1 = width + 0.06 * size
    top = -m["xheight"] - 0.13 * size
    bottom = 0.14 * size
    skew = 0.035 * size
    hl = (
        f'<path d="M{hl_x0 + skew:.2f} {top:.2f} L{hl_x1 + skew:.2f} {top:.2f} '
        f'L{hl_x1:.2f} {bottom:.2f} L{hl_x0:.2f} {bottom:.2f} Z" fill="{hl_fill}"/>'
        if with_highlight
        else ""
    )
    body = "".join(
        f'<path d="{d}" fill="{highlight_ink if (with_highlight and c >= HIGHLIGHT_FROM) else ink}"/>'
        for c, d in paths
        if d
    )
    return hl + body, hl_x1 + skew if with_highlight else width, m


def mark_group(x: float, y: float, s: float, tile: str, unit: str, led: str, pick: str, pick_led: str) -> str:
    """The Pick: an ink tile holding three rack units; the middle unit is pulled out and highlighted."""
    k = s / 64
    r = lambda v: f"{v * k:.2f}"
    tile_svg = f'<rect x="{x:.2f}" y="{y:.2f}" width="{r(64)}" height="{r(64)}" rx="{r(15)}" fill="{tile}"/>' if tile else ""
    units = [(10, 13.5, unit, led), (18, 26.75, pick, pick_led), (10, 40, unit, led)]
    parts = [tile_svg]
    for ux, uy, fill, dot in units:
        parts.append(
            f'<rect x="{x + ux * k:.2f}" y="{y + uy * k:.2f}" width="{r(36)}" height="{r(10.5)}" rx="{r(3)}" fill="{fill}"/>'
        )
        parts.append(f'<circle cx="{x + (ux + 5.5) * k:.2f}" cy="{y + (uy + 5.25) * k:.2f}" r="{r(2)}" fill="{dot}"/>')
        parts.append(
            f'<rect x="{x + (ux + 26) * k:.2f}" y="{y + (uy + 4.05) * k:.2f}" width="{r(6)}" height="{r(2.4)}" rx="{r(1.2)}" fill="{dot}" opacity=".55"/>'
        )
    return "".join(parts)


def svg(w: float, h: float, body: str, title: str, bg: str | None = None) -> str:
    background = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" width="{w:.0f}" height="{h:.0f}" '
        f'role="img" aria-label="{title}"><title>{title}</title>{background}{body}</svg>\n'
    )


def write(name: str, content: str) -> None:
    (OUT / name).write_text(content)
    print("wrote", name)


def build() -> None:
    size = 100.0
    pad = 0.3 * size

    for theme, ink, bg in (("light", INK, None), ("dark", PAPER, None)):
        group, width, m = wordmark_group(ink, INK, size)
        top = -m["xheight"] - 0.13 * size - 0.02 * size
        asc = -m["ascender"]
        y0 = min(top, asc) - pad * 0.2
        h = (0.14 * size + -m["descender"]) - y0 + pad * 0.2
        body = f'<g transform="translate({pad:.2f} {-y0:.2f})">{group}</g>'
        write(f"wordmark-{theme}.svg", svg(width + 2 * pad, h, body, "bestvpsforme"))

        mark_size = 1.18 * size
        gap = 0.28 * size
        group2, width2, _ = wordmark_group(ink, INK, size)
        H = mark_size + 2 * pad * 0.6
        baseline = pad * 0.6 + mark_size / 2 + m["xheight"] / 2
        tile = INK if theme == "light" else PAPER
        unit = PAPER if theme == "light" else INK
        led = INK if theme == "light" else PAPER
        lockup = mark_group(pad * 0.6, pad * 0.6, mark_size, tile, unit, led, VOLT, INK)
        lockup += f'<g transform="translate({pad * 0.6 + mark_size + gap:.2f} {baseline:.2f})">{group2}</g>'
        write(
            f"lockup-horizontal-{theme}.svg",
            svg(pad * 1.2 + mark_size + gap + width2, H, lockup, "bestvpsforme"),
        )

        stack_mark = 1.9 * size
        W = max(width2, stack_mark) + 2 * pad
        stacked = mark_group((W - stack_mark) / 2, pad, stack_mark, tile, unit, led, VOLT, INK)
        stacked += f'<g transform="translate({(W - width2) / 2:.2f} {pad + stack_mark + 0.62 * size + m["xheight"] / 2:.2f})">{group2}</g>'
        write(f"lockup-stacked-{theme}.svg", svg(W, pad * 2 + stack_mark + 0.95 * size, stacked, "bestvpsforme"))

    # On volt backgrounds the highlight inverts: ink swipe, volt letters.
    group3, width3, m3 = wordmark_group(INK, VOLT, size, hl_fill=INK)
    mark_size = 1.18 * size
    gap = 0.28 * size
    baseline = pad * 0.6 + mark_size / 2 + m3["xheight"] / 2
    onv = mark_group(pad * 0.6, pad * 0.6, mark_size, INK, PAPER, INK, PAPER, INK)
    onv += f'<g transform="translate({pad * 0.6 + mark_size + gap:.2f} {baseline:.2f})">{group3}</g>'
    write("lockup-horizontal-on-volt.svg", svg(pad * 1.2 + mark_size + gap + width3, mark_size + 2 * pad * 0.6, onv, "bestvpsforme"))

    write("mark.svg", svg(64, 64, mark_group(0, 0, 64, INK, PAPER, INK, VOLT, INK), "bestvpsforme mark"))
    write("mark-on-dark.svg", svg(64, 64, mark_group(0, 0, 64, PAPER, INK, PAPER, VOLT, INK), "bestvpsforme mark"))
    write("mark-volt.svg", svg(64, 64, mark_group(0, 0, 64, VOLT, INK, VOLT, PAPER, INK), "bestvpsforme mark"))
    write("glyph-ink.svg", svg(64, 64, mark_group(0, 0, 64, "", INK, PAPER, INK, VOLT), "bestvpsforme glyph"))
    write("glyph-paper.svg", svg(64, 64, mark_group(0, 0, 64, "", PAPER, INK, VOLT, INK), "bestvpsforme glyph"))

    favicon = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
        '<style>@media (prefers-color-scheme: dark){.t{fill:#FFFFFF}.u{fill:#0E1116}.l{fill:#FFFFFF}}</style>'
        f'<rect class="t" width="64" height="64" rx="15" fill="{INK}"/>'
        f'<rect class="u" x="10" y="13.5" width="36" height="10.5" rx="3" fill="{PAPER}"/>'
        f'<rect x="18" y="26.75" width="36" height="10.5" rx="3" fill="{VOLT}"/>'
        f'<rect class="u" x="10" y="40" width="36" height="10.5" rx="3" fill="{PAPER}"/>'
        f'<circle class="l" cx="15.5" cy="18.75" r="2" fill="{INK}"/>'
        f'<circle cx="23.5" cy="32" r="2" fill="{INK}"/>'
        f'<circle class="l" cx="15.5" cy="45.25" r="2" fill="{INK}"/>'
        "</svg>\n"
    )
    write("favicon.svg", favicon)

    app = mark_group(0, 0, 512, INK, PAPER, INK, VOLT, INK).replace(f'rx="{15 * 8:.2f}"', 'rx="0"')
    write("app-icon-512.svg", svg(512, 512, app, "bestvpsforme app icon"))

    write("wordmark-mono-ink.svg", svg(*_mono(INK), "bestvpsforme"))
    write("wordmark-mono-paper.svg", svg(*_mono(PAPER), "bestvpsforme"))


def _mono(color: str):
    size, pad = 100.0, 30.0
    group, width, m = wordmark_group(color, color, size, with_highlight=False)
    y0 = -m["ascender"] - 6
    h = -m["descender"] - y0 + 12
    return width + 2 * pad, h, f'<g transform="translate({pad} {-y0:.2f})">{group}</g>'


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    build()
