"""All drawing: camera moves on still images, chapter labels, text cards, roster/title transitions, captions,
vignette and grain. Pillow only; frames are RGB `Image`s."""
import math
import re
from functools import lru_cache

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from . import config


def clean_name(name):
    """Drop list numbering the LLM sometimes prefixes ("2. Your Phone Wins" → "Your Phone Wins")."""
    return re.sub(r"^\s*(#?\d+\s*[.):-]|\d+\s+)\s*", "", str(name)).strip()


def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def ease(t):
    t = min(1.0, max(0.0, t))
    return t * t * (3 - 2 * t)


@lru_cache(maxsize=64)
def font(spec, size):
    name, _, var = spec.partition(":")
    f = ImageFont.truetype(str(config.FONTS / name), size)
    if var:
        for n in f.get_variation_names():
            if n.decode().replace(" ", "").lower() == var.lower():
                f.set_variation_by_name(n)
                break
    return f


def fit_font(spec, text, max_w, max_h, start, stroke=0):
    size = start
    while size > 14:
        f = font(spec, size)
        l, t, r, b = ImageDraw.Draw(Image.new("L", (1, 1))).multiline_textbbox(
            (0, 0), text, font=f, stroke_width=stroke, align="center", spacing=size * 0.08)
        if r - l <= max_w and b - t <= max_h:
            return f
        size = int(size * 0.92)
    return font(spec, 14)


def wrap(text, spec, size, max_w):
    f = font(spec, size)
    d = ImageDraw.Draw(Image.new("L", (1, 1)))
    lines, cur = [], ""
    for w in text.split():
        trial = f"{cur} {w}".strip()
        if d.textlength(trial, font=f) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return "\n".join(lines)


def draw_center(img, text, spec, box, color, start=200, stroke=0, stroke_color=None, max_lines_w=None):
    """Draw multi-line text centered inside box=(x0,y0,x1,y1), shrinking the font until it fits."""
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    size = start
    while True:
        txt = wrap(text, spec, size, max_lines_w or w)
        f = fit_font(spec, txt, w, h, size, stroke)
        if f.size == size or size < 16:
            break
        size = f.size
    d = ImageDraw.Draw(img)
    l, t, r, b = d.multiline_textbbox((0, 0), txt, font=f, stroke_width=stroke, align="center", spacing=f.size * 0.08)
    x = x0 + (w - (r - l)) / 2 - l
    y = y0 + (h - (b - t)) / 2 - t
    d.multiline_text((x, y), txt, font=f, fill=color, align="center", spacing=f.size * 0.08,
                     stroke_width=stroke, stroke_fill=stroke_color)
    return img


# ------------------------------------------------------------------ images
@lru_cache(maxsize=48)
def source(key, w, h, bg, note=""):
    """Cached image scaled to cover (w, h). Missing images render as a labeled placeholder so renders never block."""
    p = config.IMAGE_CACHE / f"{key}.png" if key else None
    if p and p.exists():
        im = Image.open(p).convert("RGB")
        s = max(w / im.width, h / im.height)
        im = im.resize((math.ceil(im.width * s), math.ceil(im.height * s)), Image.LANCZOS)
        return im
    im = Image.new("RGB", (w, h), hexrgb(bg))
    draw_center(im, f"[ image pending ]\n{note[:160]}", "Baloo2.ttf:SemiBold", (w * .12, h * .3, w * .88, h * .7),
                (60, 60, 60), start=46)
    return im

@lru_cache(maxsize=256)
def edge_color(key, fallback):
    """Median color of an image's border — the generated 'flat background' color. Cards and Shorts canvases use it so
    the code-drawn parts match the model's actual yellow (it never hits the requested hex exactly)."""
    p = config.IMAGE_CACHE / f"{key}.png" if key else None
    if not (p and p.exists()):
        return fallback
    a = np.asarray(Image.open(p).convert("RGB"))
    edge = np.concatenate([a[:4].reshape(-1, 3), a[-4:].reshape(-1, 3), a[:, :4].reshape(-1, 3), a[:, -4:].reshape(-1, 3)])
    r, g, b = (int(v) for v in np.median(edge, axis=0))
    return f"#{r:02X}{g:02X}{b:02X}"



def camera_frame(base, W, H, t, cam):
    """Ken Burns on a cover-scaled image. t in [0,1] over the shot."""
    e = ease(t)
    if cam == "push":
        s, fx, fy = 1.0 + 0.07 * e, 0.5, 0.5
    elif cam == "pull":
        s, fx, fy = 1.07 - 0.07 * e, 0.5, 0.5
    elif cam == "left":
        s, fx, fy = 1.07, 0.62 - 0.24 * e, 0.5
    elif cam == "right":
        s, fx, fy = 1.07, 0.38 + 0.24 * e, 0.5
    else:
        s, fx, fy = 1.02 + 0.01 * e, 0.5, 0.5
    bw, bh = base.size
    k = min(bw / W, bh / H)  # base pixels per output pixel at s=1 (cover)
    a = k / s
    half_w, half_h = W * a / 2, H * a / 2
    cx = min(max(bw * fx, half_w), bw - half_w)
    cy = min(max(bh * fy, half_h), bh - half_h)
    return base.transform((W, H), Image.AFFINE, (a, 0, cx - half_w, 0, a, cy - half_h), Image.BILINEAR)


# ------------------------------------------------------------------ overlays
@lru_cache(maxsize=32)
def label_overlay(text, W, H, color, spec, size):
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_center(ov, text.upper(), spec, (W * .1, H * .015, W * .9, H * .115), hexrgb(color) + (255,), start=size)
    return ov


@lru_cache(maxsize=4)
def vignette(W, H, strength):
    y, x = np.ogrid[:H, :W]
    d = np.sqrt(((x - W / 2) / (W / 2)) ** 2 + ((y - H / 2) / (H / 2)) ** 2) / math.sqrt(2)
    a = np.clip((d - 0.45) / 0.55, 0, 1) ** 1.6 * strength * 255
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ov.putalpha(Image.fromarray(a.astype(np.uint8)))
    return ov


@lru_cache(maxsize=8)
def grain(W, H, amount, seed):
    rng = np.random.default_rng(seed)
    n = rng.normal(0, 1, (H // 2, W // 2)).astype(np.float32)
    g = Image.fromarray(np.clip(128 + n * 255 * amount, 0, 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)
    return g


def finish(frame, st, fi):
    """Style post-processing applied to every frame (vignette, film grain)."""
    fr = st["frame"]
    W, H = frame.size
    if fr.get("vignette"):
        frame = frame.convert("RGBA")
        frame.alpha_composite(vignette(W, H, fr["vignette"]))
        frame = frame.convert("RGB")
    if fr.get("grain"):
        g = grain(W, H, fr["grain"], fi % 4).convert("RGB")
        frame = Image.blend(frame, g, 0.06)
    return frame


# ------------------------------------------------------------------ cards & transitions
def card(st, text, W, H, bg=None):
    pal = st["palette"]
    im = Image.new("RGB", (W, H), hexrgb(bg or pal["bg"]))
    draw_center(im, text.upper(), st["fonts"]["card"], (W * .1, H * .2, W * .9, H * .8), hexrgb(pal["ink"]),
                start=int(H * .26))
    return im


@lru_cache(maxsize=64)
def icon_disc(key, color, d):
    """Chapter icon: colored disc + black ring + icon (white background keyed out)."""
    disc = Image.new("RGBA", (d, d), (0, 0, 0, 0))
    dr = ImageDraw.Draw(disc)
    dr.ellipse((6, 6, d - 6, d - 6), fill=hexrgb(color) + (255,), outline=(20, 20, 20, 255), width=max(6, d // 40))
    p = config.IMAGE_CACHE / f"{key}.png" if key else None
    if p and p.exists():
        ic = Image.open(p).convert("RGBA")
        arr = np.asarray(ic).copy()
        white = (arr[..., :3].min(axis=2) > 232)
        arr[..., 3] = np.where(white, 0, 255).astype(np.uint8)
        ic = Image.fromarray(arr)
        bbox = ic.getbbox()
        if bbox:
            ic = ic.crop(bbox)
        s = (d * 0.62) / max(ic.size)
        ic = ic.resize((max(1, int(ic.width * s)), max(1, int(ic.height * s))), Image.LANCZOS)
        mask = Image.new("L", (d, d), 0)
        ImageDraw.Draw(mask).ellipse((14, 14, d - 14, d - 14), fill=255)
        layer = Image.new("RGBA", (d, d), (0, 0, 0, 0))
        layer.alpha_composite(ic, ((d - ic.width) // 2, (d - ic.height) // 2))
        layer.putalpha(Image.fromarray(np.minimum(np.asarray(layer)[..., 3], np.asarray(mask))))
        disc.alpha_composite(layer)
    return disc


def roster_frame(st, chapters, idx, t, W, H):
    """EverythingProfessor chapter transition: white board, row of icon circles sliding to chapter idx."""
    im = Image.new("RGB", (W, H), (255, 255, 255))
    gap, d = int(W * 0.30), int(H * 0.40)
    pos = (idx - 1) + ease(t / 0.65) if idx > 0 else 0.0
    grow = 1 + 0.14 * ease((t - 0.6) / 0.35)
    lab = font(st["fonts"]["label"], int(H * .052))
    dr = ImageDraw.Draw(im)
    for i, ch in enumerate(chapters):
        x = W / 2 + (i - pos) * gap
        if x < -d or x > W + d:
            continue
        dd = int(d * (grow if i == idx else 1))
        disc = icon_disc(ch.get("icon_image"), ch.get("color") or "#888888", dd)
        cy = H * .40
        im.paste(disc, (int(x - dd / 2), int(cy - dd / 2)), disc)
        name = wrap(ch["name"], st["fonts"]["label"], lab.size, gap * 0.92)
        dr.multiline_text((x, cy + d * 0.57 + H * .03), name, font=lab, fill=(20, 20, 20), anchor="ma",
                          align="center", spacing=4)
    return im


def titlecard_frame(st, num, name, t, dur, W, H):
    """Stickman chapter card: cream paper, red number, big black headline; fades in and out."""
    pal = st["palette"]
    im = Image.new("RGB", (W, H), hexrgb(pal["paper"]))
    d = ImageDraw.Draw(im)
    if num:
        f = font(st["fonts"]["card"], int(H * .11))
        d.text((W / 2, H * .30), f"#{num}", font=f, fill=hexrgb(pal["accent"]), anchor="mm")
    name = clean_name(name)
    draw_center(im, name.upper(), st["fonts"]["card"], (W * .1, H * .38, W * .9, H * .74), hexrgb(pal["ink"]),
                start=int(H * .15))
    a = min(ease(t / 0.35), ease((dur - t) / 0.35))
    black = Image.new("RGB", (W, H), (8, 8, 8))
    return Image.blend(black, im, a)


def caption(frame, text, box, st, size):
    sl = st["short_layout"]
    draw_center(frame, text.upper(), st["fonts"]["caption"], box, hexrgb(sl["caption_fill"]), start=size,
                stroke=max(4, size // 11), stroke_color=hexrgb(sl["caption_stroke"]))
    return frame
