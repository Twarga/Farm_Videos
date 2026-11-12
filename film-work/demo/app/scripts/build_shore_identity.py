from pathlib import Path
import base64
import ctypes as c
import ctypes.util
import io
import json
import re
from urllib.parse import unquote
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "brand/shore/identity"
PUBLIC = ROOT / "public/shore/identity"
FONT_OUT = ROOT / "src/lib/og-fonts"


def font_instance(source, weight):
    font = TTFont(source)
    if "fvar" in font:
        font = instantiateVariableFont(font, {"wght": weight}, inplace=False)
    font.flavor = None
    names = font["name"]
    family = names.getDebugName(16) or names.getDebugName(1)
    derivative = family + " derivative Shore OG"
    for record in list(names.names):
        if record.nameID in (1, 16):
            value = derivative
        elif record.nameID == 4:
            value = derivative + " " + str(weight)
        elif record.nameID == 6:
            value = derivative.replace(" ", "") + "-" + str(weight)
        else:
            continue
        names.setName(value, record.nameID, record.platformID, record.platEncID, record.langID)
    names.setName((ROOT / "public/shore/fonts/LICENSE.txt").read_text(), 13, 3, 1, 0x409)
    data = io.BytesIO()
    font.save(data)
    return font, data.getvalue()


def shaped_paths(font, data, text, size):
    hb = c.CDLL(ctypes.util.find_library("harfbuzz"))
    ptr = c.c_void_p
    for name, args, rest in [
        ("hb_blob_create", [c.c_char_p, c.c_uint, c.c_int, ptr, ptr], ptr),
        ("hb_face_create", [ptr, c.c_uint], ptr), ("hb_font_create", [ptr], ptr),
        ("hb_ot_font_set_funcs", [ptr], None), ("hb_font_set_scale", [ptr, c.c_int, c.c_int], None),
        ("hb_buffer_create", [], ptr),
        ("hb_buffer_add_utf8", [ptr, c.c_char_p, c.c_int, c.c_uint, c.c_int], None),
        ("hb_buffer_guess_segment_properties", [ptr], None),
        ("hb_shape", [ptr, ptr, ptr, c.c_uint], None),
        ("hb_buffer_get_glyph_infos", [ptr, c.POINTER(c.c_uint)], ptr),
        ("hb_buffer_get_glyph_positions", [ptr, c.POINTER(c.c_uint)], ptr),
    ]:
        getattr(hb, name).argtypes = args
        getattr(hb, name).restype = rest
    class Info(c.Structure):
        _fields_ = [(name, c.c_uint32) for name in ["glyph", "mask", "cluster", "var1", "var2"]]
    class Position(c.Structure):
        _fields_ = [(name, c.c_int32) for name in ["advance", "y_advance", "x", "y", "var"]]
    blob = hb.hb_blob_create(data, len(data), 0, None, None)
    face = hb.hb_face_create(blob, 0)
    hfont = hb.hb_font_create(face)
    hb.hb_ot_font_set_funcs(hfont)
    upem = font["head"].unitsPerEm
    hb.hb_font_set_scale(hfont, upem, upem)
    buf = hb.hb_buffer_create()
    encoded = text.encode()
    hb.hb_buffer_add_utf8(buf, encoded, len(encoded), 0, len(encoded))
    hb.hb_buffer_guess_segment_properties(buf)
    hb.hb_shape(hfont, buf, None, 0)
    count = c.c_uint()
    infos = c.cast(hb.hb_buffer_get_glyph_infos(buf, c.byref(count)), c.POINTER(Info))
    positions = c.cast(hb.hb_buffer_get_glyph_positions(buf, c.byref(count)), c.POINTER(Position))
    glyphs = font.getGlyphSet()
    order = font.getGlyphOrder()
    scale = size / upem
    x = 0
    paths = []
    for i in range(count.value):
        pen = SVGPathPen(glyphs, ntos=lambda value: f"{value:.3f}".rstrip("0").rstrip("."))
        glyphs[order[infos[i].glyph]].draw(TransformPen(pen, (scale, 0, 0, -scale, x + positions[i].x * scale, positions[i].y * scale)))
        paths.append((infos[i].cluster, pen.getCommands()))
        x += positions[i].advance * scale - size * .015
    for name, obj in [("hb_buffer_destroy", buf), ("hb_font_destroy", hfont), ("hb_face_destroy", face), ("hb_blob_destroy", blob)]:
        getattr(hb, name).argtypes = [ptr]
        getattr(hb, name)(obj)
    return paths, x + size * .015


def main():
    for directory in [OUT, PUBLIC, FONT_OUT]:
        directory.mkdir(parents=True, exist_ok=True)
    source = (ROOT / "brand/shore/mockup/index.html").read_text()
    data_url = re.search(r'rel="icon" href="(data:image/svg\+xml,[^"]+)"', source).group(1)
    mark = unquote(data_url.split(",", 1)[1])
    body = mark.split(">", 1)[1].rsplit("</svg>", 1)[0]
    font, data = font_instance(ROOT / "public/shore/fonts/ubuntu-sans.woff2", 700)
    paths, advance = shaped_paths(font, data, "bestvpsforme", 52)
    width = round(86 + advance + 10, 3)
    for variant, ink, accent in [("light", "#1f1d2b", "#5c47a8"), ("dark", "#efe3c8", "#9b7bff")]:
        word = "".join(f'<path d="{d}" fill="{ink if cluster < 7 else accent}"/>' for cluster, d in paths)
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 80" role="img" aria-label="bestvpsforme"><g transform="translate(0 8) scale(2)">{body}</g><g transform="translate(86 58)">{word}</g></svg>'
        (OUT / f"lockup-{variant}.svg").write_text(svg)
        (PUBLIC / f"lockup-{variant}.svg").write_text(svg)
    mono = body.replace("#9b7bff", "white").replace("#e89d88", "white").replace("#efe3c8", "black").replace("#070a1c", "black")
    monochrome = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><mask id="crab"><rect width="32" height="32" fill="black"/>{mono}</mask></defs><rect width="32" height="32" fill="currentColor" mask="url(#crab)"/></svg>'
    for variant in ["light", "dark"]:
        (OUT / f"mark-{variant}.svg").write_text(mark)
    (OUT / "mark-one-colour.svg").write_text(monochrome)
    word = "".join(f'<path d="{d}" fill="currentColor"/>' for _, d in paths)
    (OUT / "lockup-one-colour.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 80"><g transform="translate(0 8) scale(2)">{monochrome}</g><g transform="translate(86 58)">{word}</g></svg>')
    (PUBLIC / "mark.svg").write_text(mark)
    (ROOT / "src/app/icon.svg").write_text(mark)
    for family, source_name, weights in [("UbuntuSans", "ubuntu-sans.woff2", [500, 600, 700, 800]), ("UbuntuSansMono", "ubuntu-sans-mono-500.woff2", [500])]:
        for weight in weights:
            _, ttf = font_instance(ROOT / "public/shore/fonts" / source_name, weight)
            (FONT_OUT / f"{family}-{weight}.ttf").write_bytes(ttf)
    manifest = {"source": "brand/shore/mockup/index.html favicon; local Ubuntu Sans 700 outlined with HarfBuzz", "lockup": {"width": width, "height": 80}, "sizes": [16, 24, 32, 48]}
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    (PUBLIC / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print("Built outlined Shore identity and local OG font instances")


if __name__ == "__main__":
    main()
