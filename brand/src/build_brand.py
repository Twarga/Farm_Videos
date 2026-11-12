#!/usr/bin/env python3
"""Flat Money brand kit generator.

Writes banner.html + logo.html (rendered by Chromium for the PNGs) and a
standalone logo.svg. Matches the explainer videos: gray paper with fibers,
thick ink outlines, soft offset shadows, Baloo 2 + Patrick Hand type.
"""
import math
import random
from pathlib import Path

OUT = Path(__file__).parent
INK = "#26211c"

DEFS = f"""
<linearGradient id="bodyG" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#8aa6ec"/><stop offset="1" stop-color="#4967bc"/>
</linearGradient>
<linearGradient id="limbG" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#5a75c8"/><stop offset="1" stop-color="#3e59a7"/>
</linearGradient>
<linearGradient id="hatG" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#49b568"/><stop offset="1" stop-color="#2a7c46"/>
</linearGradient>
<linearGradient id="goldG" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#f9d56e"/><stop offset="1" stop-color="#e9ae38"/>
</linearGradient>
<linearGradient id="billG" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#97da88"/><stop offset="1" stop-color="#60b65a"/>
</linearGradient>
<radialGradient id="irisG" cx=".4" cy=".35" r=".8">
  <stop offset="0" stop-color="#cbffb0"/><stop offset=".55" stop-color="#6fe06d"/>
  <stop offset="1" stop-color="#2dad51"/>
</radialGradient>
<clipPath id="bodyClip"><rect x="-125" y="-240" width="250" height="204" rx="40"/></clipPath>
<filter id="wob" filterUnits="userSpaceOnUse" x="-500" y="-500" width="3700" height="2200">
  <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="4" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="soft" x="-30%" y="-300%" width="160%" height="700%"><feGaussianBlur stdDeviation="8"/></filter>
"""

ROBOT = f"""
<g id="robot">
  <ellipse cx="0" cy="8" rx="150" ry="15" fill="{INK}" opacity=".24" filter="url(#soft)"/>
  <circle cx="-10" cy="-150" r="44" fill="#7ee07a" opacity=".38" filter="url(#glow)"/>
  <circle cx="56" cy="-150" r="44" fill="#7ee07a" opacity=".38" filter="url(#glow)"/>
  <g filter="url(#wob)" stroke="{INK}" stroke-linejoin="round" stroke-linecap="round">
    <g fill="url(#limbG)" stroke-width="8">
      <rect x="-100" y="-50" width="32" height="50" rx="14"/>
      <rect x="-44" y="-50" width="32" height="50" rx="14"/>
      <rect x="12" y="-50" width="32" height="50" rx="14"/>
      <rect x="68" y="-50" width="32" height="50" rx="14"/>
      <rect x="-145" y="-138" width="28" height="60" rx="13"/>
      <rect x="117" y="-138" width="28" height="60" rx="13"/>
    </g>
    <rect x="-125" y="-240" width="250" height="204" rx="40" fill="url(#bodyG)" stroke-width="10"/>
    <g clip-path="url(#bodyClip)" stroke="none">
      <rect x="-130" y="-96" width="260" height="70" fill="#101a50" opacity=".2"/>
      <rect x="-104" y="-224" width="112" height="24" rx="12" fill="#fff" opacity=".32"/>
    </g>
    <circle cx="-92" cy="-208" r="9" fill="#f6c744" stroke-width="4"/>
    <circle cx="-10" cy="-150" r="26" fill="#16202f" stroke-width="6"/>
    <circle cx="56" cy="-150" r="26" fill="#16202f" stroke-width="6"/>
    <g stroke="none">
      <circle cx="-10" cy="-150" r="17" fill="url(#irisG)"/>
      <circle cx="56" cy="-150" r="17" fill="url(#irisG)"/>
      <circle cx="-16" cy="-157" r="5.5" fill="#fff"/>
      <circle cx="50" cy="-157" r="5.5" fill="#fff"/>
      <circle cx="-3" cy="-143" r="2.5" fill="#fff" opacity=".7"/>
      <circle cx="63" cy="-143" r="2.5" fill="#fff" opacity=".7"/>
    </g>
    <g stroke-width="8" fill="none">
      <path d="M 6 -96 L 90 -96"/>
      <path d="M 6 -78 L 90 -78"/>
      <path d="M 6 -60 L 52 -60"/>
    </g>
    <g transform="translate(-12 -238) rotate(-7)">
      <rect x="-56" y="-112" width="112" height="114" rx="14" fill="url(#hatG)" stroke-width="8"/>
      <rect x="-42" y="-100" width="16" height="70" rx="8" fill="#fff" opacity=".24" stroke="none"/>
      <rect x="-56" y="-36" width="112" height="28" fill="#f2c14e" stroke-width="6"/>
      <rect x="-86" y="-12" width="172" height="26" rx="13" fill="url(#hatG)" stroke-width="8"/>
    </g>
  </g>
</g>
"""


def coin(cx, cy, r, dollar=True):
    sw = max(5.0, r * 0.14)
    s = (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#goldG)" stroke="{INK}" stroke-width="{sw:.1f}"/>'
         f'<circle cx="{cx}" cy="{cy}" r="{r * 0.7:.1f}" fill="none" stroke="{INK}" '
         f'stroke-width="{max(3.0, r * 0.07):.1f}" opacity=".75"/>')
    if dollar:
        s += (f'<text x="{cx}" y="{cy + r * 0.3:.1f}" text-anchor="middle" font-family="Baloo 2" '
              f'font-weight="800" font-size="{r * 0.9:.0f}" fill="{INK}">$</text>')
    return f"<g>{s}</g>"


def stack(cx, gy, n, w=170, h=34):
    jit = [0, 7, -6, 5, -4, 3]
    out = []
    for i in range(n):
        x = cx - w / 2 + jit[i % len(jit)]
        y = gy - (h - 5) * (i + 1) - 5
        out.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{w}" height="{h}" rx="{h / 2:.0f}" '
                   f'fill="url(#goldG)" stroke="{INK}" stroke-width="7"/>'
                   f'<path d="M {x + 22:.0f} {y + h * 0.62:.0f} L {x + w - 22:.0f} {y + h * 0.62:.0f}" '
                   f'stroke="{INK}" stroke-width="3" opacity=".35" stroke-linecap="round"/>')
    return "<g>" + "".join(out) + "</g>"


def bill(cx, cy, w, h, rot, label="20"):
    r = h * 0.3
    return (f'<g transform="rotate({rot} {cx} {cy})">'
            f'<rect x="{cx - w / 2}" y="{cy - h / 2}" width="{w}" height="{h}" rx="12" fill="url(#billG)" '
            f'stroke="{INK}" stroke-width="8"/>'
            f'<rect x="{cx - w / 2 + 14}" y="{cy - h / 2 + 14}" width="{w - 28}" height="{h - 28}" rx="6" '
            f'fill="none" stroke="{INK}" stroke-width="3" opacity=".3"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#eaf7de" stroke="{INK}" stroke-width="5"/>'
            f'<text x="{cx}" y="{cy + r * 0.38:.1f}" text-anchor="middle" font-family="Baloo 2" font-weight="800" '
            f'font-size="{r * 1.1:.0f}" fill="{INK}">$</text>'
            f'<text x="{cx - w / 2 + 22}" y="{cy - h / 2 + 34}" font-family="Baloo 2" font-weight="700" '
            f'font-size="{h * 0.2:.0f}" fill="{INK}" opacity=".7">{label}</text>'
            f'<text x="{cx + w / 2 - 22}" y="{cy + h / 2 - 20}" text-anchor="end" font-family="Baloo 2" '
            f'font-weight="700" font-size="{h * 0.2:.0f}" fill="{INK}" opacity=".7">{label}</text></g>')


def sparkle(cx, cy, r, fill="#f2c14e"):
    k = r * 0.16
    return (f'<path d="M {cx} {cy - r} Q {cx + k} {cy - k} {cx + r} {cy} Q {cx + k} {cy + k} {cx} {cy + r} '
            f'Q {cx - k} {cy + k} {cx - r} {cy} Q {cx - k} {cy - k} {cx} {cy - r} Z" fill="{fill}" '
            f'stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>')


def paper(W, H, seed=5):
    rnd = random.Random(seed)
    parts = [f'<rect width="{W}" height="{H}" fill="#e0ddd5"/>']
    for _ in range(16):
        cx, cy = rnd.uniform(0, W), rnd.uniform(0, H)
        rx = rnd.uniform(260, 620)
        ry = rx * rnd.uniform(0.5, 0.9)
        gid = "bl" if rnd.random() < 0.5 else "bd"
        parts.append(f'<ellipse cx="{cx:.0f}" cy="{cy:.0f}" rx="{rx:.0f}" ry="{ry:.0f}" fill="url(#{gid})"/>')

    def fibers(n, stroke, op):
        d = []
        for _ in range(n):
            x, y = rnd.uniform(0, W), rnd.uniform(0, H)
            ln, a = rnd.uniform(14, 46), rnd.uniform(0, 6.283)
            dx, dy = math.cos(a) * ln, math.sin(a) * ln
            qx, qy = x + dx / 2 + rnd.uniform(-8, 8), y + dy / 2 + rnd.uniform(-8, 8)
            d.append(f"M{x:.0f} {y:.0f}Q{qx:.0f} {qy:.0f} {x + dx:.0f} {y + dy:.0f}")
        return (f'<path d="{" ".join(d)}" fill="none" stroke="{stroke}" stroke-opacity="{op}" '
                f'stroke-width="1.6" stroke-linecap="round"/>')

    parts.append(fibers(360, "#8d8576", 0.32))
    parts.append(fibers(200, "#ffffff", 0.55))
    parts.append(f'<rect width="{W}" height="{H}" filter="url(#grain)" opacity=".75" style="mix-blend-mode:multiply"/>')
    parts.append(f'<rect width="{W}" height="{H}" fill="url(#vig)"/>')
    return "".join(parts)


PAPER_DEFS = """
<radialGradient id="bl"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<radialGradient id="bd"><stop offset="0" stop-color="#7a705f" stop-opacity=".17"/><stop offset="1" stop-color="#7a705f" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#3c3428" stop-opacity="0"/><stop offset="1" stop-color="#3c3428" stop-opacity=".28"/></radialGradient>
<filter id="grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9"/>
  <feColorMatrix type="matrix" values="0 0 0 0 .2  0 0 0 0 .17  0 0 0 0 .13  .9 0 0 0 -.38"/>
</filter>
"""

SHADOW = "filter:drop-shadow(5px 7px 0 rgba(38,33,28,.17))"


def deco(inner):
    return f'<g style="{SHADOW}"><g filter="url(#wob)">{inner}</g></g>'


def banner_html():
    W, H = 2560, 1440
    gy = 905
    ground = (f'<path d="M -30 {gy} C 400 {gy - 8}, 900 {gy + 8}, 1400 {gy - 2} S 2200 {gy + 7}, 2600 {gy - 3}" '
              f'fill="none" stroke="{INK}" stroke-width="9" stroke-linecap="round"/>')
    extras = "".join([
        deco(coin(262, 250, 46)), deco(sparkle(420, 190, 26)),
        deco(bill(2290, 262, 230, 98, 13)), deco(sparkle(2110, 330, 22)),
        deco(sparkle(1380, 190, 30)),
        deco(bill(560, 1210, 220, 94, -11)), deco(coin(2160, 1190, 42)),
        deco(sparkle(1010, 1160, 24)), deco(sparkle(1900, 1250, 28)),
    ])
    left = deco(bill(352, 806, 262, 112, 8) + bill(318, 846, 270, 116, -8) + coin(496, 848, 54))
    right = deco(stack(2250, gy, 5) + coin(2398, gy - 68, 68))
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:'Baloo 2';src:url('Baloo2.ttf');font-weight:400 800}}
@font-face{{font-family:'Patrick Hand';src:url('PatrickHand-Regular.ttf')}}
html,body{{margin:0;background:#e0ddd5}} svg{{display:block}}
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs>{DEFS}{PAPER_DEFS}</defs>
{paper(W, H)}
{extras}
<g style="{SHADOW}"><g filter="url(#wob)">{ground}</g></g>
{left}
{right}
<g style="{SHADOW}"><use href="#robot" transform="translate(715 {gy})"/></g>
<g id="hl" filter="url(#wob)"></g>
<text id="word" x="960" y="745" font-family="Baloo 2" font-weight="800" font-size="190" fill="{INK}"
      style="filter:drop-shadow(4px 6px 0 rgba(38,33,28,.17))">flat money</text>
<text x="964" y="838" font-family="Patrick Hand" font-size="76" fill="#5c5246">money, explained in about 45 seconds</text>
</svg>
<script>
Promise.all([document.fonts.load('800 190px "Baloo 2"'), document.fonts.load('76px "Patrick Hand"')]).then(()=>{{
  const t=document.getElementById('word');
  t.setAttribute('font-size',190);
  const fs=190*1060/t.getComputedTextLength();
  t.setAttribute('font-size',fs);
  const x0=t.getStartPositionOfChar(5).x, len=t.getSubStringLength(5,5);
  const y=745-fs*0.16, th=fs*0.27;
  const p=document.createElementNS('http://www.w3.org/2000/svg','path');
  p.setAttribute('d',`M ${{x0-10}} ${{y+4}} C ${{x0+len*0.3}} ${{y-7}}, ${{x0+len*0.7}} ${{y+8}}, ${{x0+len+12}} ${{y-3}}`);
  p.setAttribute('stroke','#f4a62a'); p.setAttribute('stroke-opacity','.92');
  p.setAttribute('stroke-width',th); p.setAttribute('stroke-linecap','round'); p.setAttribute('fill','none');
  document.getElementById('hl').appendChild(p);
  document.title='ready';
}});
</script></body></html>"""


def logo_svg(with_paper=False):
    rays = []
    cx, cy, n = 256, 300, 16
    for i in range(0, n, 2):
        a0 = math.radians(i * 360 / n)
        a1 = math.radians((i + 1) * 360 / n)
        R = 700
        rays.append(f"M {cx} {cy} L {cx + R * math.cos(a0):.0f} {cy + R * math.sin(a0):.0f} "
                    f"L {cx + R * math.cos(a1):.0f} {cy + R * math.sin(a1):.0f} Z")
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 512 512">
<defs>{DEFS}
<radialGradient id="bgG" cx=".5" cy=".55" r=".75"><stop offset="0" stop-color="#fcde80"/><stop offset="1" stop-color="#e9a82c"/></radialGradient>
</defs>
<rect width="512" height="512" fill="url(#bgG)"/>
<path d="{' '.join(rays)}" fill="#fff" opacity=".16"/>
<g style="{SHADOW}"><use href="#robot" transform="translate(256 455) scale(1.05)"/></g>
</svg>"""


if __name__ == "__main__":
    (OUT / "banner.html").write_text(banner_html())
    svg = logo_svg()
    (OUT / "logo.svg").write_text(svg)
    (OUT / "logo.html").write_text(
        "<!doctype html><html><body style='margin:0;background:#e9a82c'>"
        + svg.replace("<svg ", "<svg style='display:block' ", 1).replace("<defs>", f"<defs>", 1)
        + "</body></html>")
    # robot group is injected into every output; 'Baloo 2' is invalid unquoted CSS
    # (digit-led identifier), so the family is renamed 'Baloo2' everywhere.
    for name in ("banner.html", "logo.html", "logo.svg"):
        p = OUT / name
        s = p.read_text()
        s = s.replace("</defs>", f"{ROBOT}</defs>", 1).replace("Baloo 2", "Baloo2")
        p.write_text(s)
    print("written")
