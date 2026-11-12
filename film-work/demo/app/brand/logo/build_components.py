#!/usr/bin/env python3
"""Generate src/components/brand/{Mark,Wordmark,Lockup}.tsx from brand/logo/*.svg.

Theme rules (Highlighter identity):
- elements fully inside their sibling volt band's bounds keep literal ink
  (#0E1116) — ink-on-volt is the 16.36:1 pair and is correct in both themes
- all other ink (#0E1116) -> currentColor (fg token: ink light / near-white dark)
- white rows -> var(--bg) so the mark reads as its on-dark variant under dark
- volt stays literal
"""
import re, xml.etree.ElementTree as ET
from pathlib import Path

NS = "{http://www.w3.org/2000/svg}"
ROOT = Path(__file__).resolve().parent
OUT = Path(__file__).resolve().parents[2] / "src" / "components" / "brand"
INK, WHITE, VOLT = "#0E1116", "#FFFFFF", "#D4FF3A"


def elem_bbox(el):
    tag = el.tag.replace(NS, "")
    f = lambda k: float(el.get(k, 0))
    if tag == "rect":
        return f("x"), f("y"), f("x") + f("width"), f("y") + f("height")
    if tag == "circle":
        r = f("r"); return f("cx") - r, f("cy") - r, f("cx") + r, f("cy") + r
    if tag == "path":
        # mini parser: commands with coordinate pairs vs H/V singles (all our
        # paths are absolute; a relative command would still approximate)
        xs, ys = [], []
        toks = re.findall(r"[A-Za-z]|-?[\d.]+", el.get("d", ""))
        cmd, i = None, 0
        pair_len = {"M": 2, "L": 2, "C": 6, "S": 4, "Q": 4, "T": 2, "A": 7}
        while i < len(toks):
            if re.fullmatch(r"[A-Za-z]", toks[i]):
                cmd, i = toks[i], i + 1
                continue
            n = pair_len.get((cmd or "").upper(), 1)
            vals = toks[i:i + n]
            if (cmd or "").upper() == "H":
                xs.append(float(vals[0]))
            elif (cmd or "").upper() == "V":
                ys.append(float(vals[0]))
            elif (cmd or "").upper() == "A":
                xs.append(float(vals[5])); ys.append(float(vals[6]))
            else:
                xs += [float(vals[j]) for j in range(0, len(vals) - 1, 2)]
                ys += [float(vals[j]) for j in range(1, len(vals), 2)]
            i += n
            if cmd == "M":
                cmd = "L"  # implicit lineto after first moveto pair
        return (min(xs), min(ys), max(xs), max(ys)) if xs else None
    return None


def inside(bb, volt_bb):
    if not bb or not volt_bb:
        return False
    # an element that fully contains the volt band (the mark tile) is not "on" it
    if bb[0] <= volt_bb[0] and bb[1] <= volt_bb[1] and bb[2] >= volt_bb[2] and bb[3] >= volt_bb[3]:
        return False
    cx, cy = (bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2
    return (volt_bb[0] - 1 <= cx <= volt_bb[2] + 1 and
            volt_bb[1] - 1 <= cy <= volt_bb[3] + 1)


def to_jsx(parent):
    # volt bounds among this element's children share one coordinate space
    volt_bb = None
    for c in parent:
        if (c.get("fill") or "").upper() == VOLT:
            b = elem_bbox(c)
            if b:
                volt_bb = b if volt_bb is None else (
                    min(volt_bb[0], b[0]), min(volt_bb[1], b[1]),
                    max(volt_bb[2], b[2]), max(volt_bb[3], b[3]))
    out = []
    for el in parent:
        tag = el.tag.replace(NS, "")
        if tag in ("title", "style", "defs"):
            continue
        attrs = []
        for k, v in el.attrib.items():
            if k == "fill":
                continue
            k = {"stroke-width": "strokeWidth", "clip-path": "clipPath",
                 "fill-rule": "fillRule"}.get(k, k)
            attrs.append(f'{k}="{v}"')
        fill = (el.get("fill") or "").upper()
        if fill == VOLT:
            attrs.append('fill="#D4FF3A"')
        elif fill == WHITE:
            attrs.append('fill="var(--bg)"')
        elif fill == INK:
            attrs.append('fill="#0E1116"' if inside(elem_bbox(el), volt_bb) else 'fill="currentColor"')
        elif fill:
            attrs.append(f'fill="{el.get("fill")}"')
        inner = to_jsx(el)
        out.append(f"<{tag} {' '.join(attrs)}>{inner}</{tag}>" if inner else f"<{tag} {' '.join(attrs)} />")
    return "".join(out)


def build(svg_name, comp_name):
    root = ET.parse(ROOT / svg_name).getroot()
    vb = root.get("viewBox", "0 0 64 64")
    body = to_jsx(root)
    return f'''export function {comp_name}({{ className = "", title = "bestvpsforme" }}: {{ className?: string; title?: string }}) {{
  return (
    <svg viewBox="{vb}" role="img" aria-label={{title}} className={{className}}>
      {body}
    </svg>
  );
}}
'''


OUT.mkdir(parents=True, exist_ok=True)
(OUT / "Mark.tsx").write_text(build("mark.svg", "Mark"))
(OUT / "Wordmark.tsx").write_text(build("wordmark-light.svg", "Wordmark"))
(OUT / "Lockup.tsx").write_text(build("lockup-horizontal-light.svg", "Lockup"))
print("generated:", sorted(p.name for p in OUT.iterdir()))
