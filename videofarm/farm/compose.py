"""Compose a shot spec into a plate with the hand-built vector art (farm/art.py + farm/props_*.py).

spec = {"shot": "wide|medium|close",
        "people": [{"who": "hero|other", "pose": ..., "mood": ..., "side": "left|center|right"}],
        "props":  [{"name": ..., "slot": "far_left|left|center|right|far_right|hand", "size": "s|m|l"}],
        "bubble": {"kind": "thought|speech", "prop": name or null, "text": str or null},
        "text":   short in-scene label or ""}
"""
import importlib
import math
import re

import cairo
from PIL import Image, ImageDraw

from . import art, gfx
from .art import BG, INK, PAPER, W, H, Canvas, person, rgb, shade, stick

PROPS = {}
for _m in ("props_money", "props_home", "props_tech", "props_life"):
    try:
        PROPS.update(importlib.import_module(f"farm.{_m}").PROPS)
    except ImportError:
        pass

POSES = ["stand", "point", "up", "shrug", "head", "hold", "sit", "walk", "cross", "facepalm"]
MOODS = list(art.EXPR)
SLOTS = {"far_left": 230, "left": 560, "center": 960, "right": 1360, "far_right": 1690}
SIZES = {"s": 300, "m": 440, "l": 620}
WALL = {"window", "clock", "mirror", "calendar", "bell", "lightbulb", "thought_bubble", "speech_bubble", "trophy",
        "medal", "megaphone", "bookshelf", "door", "chart_up", "chart_down", "bar_chart", "pie_chart", "safe",
        "alarm_clock", "tv", "shield"}
COLORS = {"orange": "#e07b12", "blue": "#2f6fb8", "navy": "#1f3a7a", "red": "#d7261e", "maroon": "#8a2332",
          "green": "#2f9e5a", "teal": "#1f9aa0", "purple": "#7a3fb0", "pink": "#e8639a", "grey": "#7d838c",
          "gray": "#7d838c", "yellow": "#e9d23b", "brown": "#8a5a36", "black": "#2a2a2e", "white": "#f1f1f1",
          "beige": "#d9c7a3", "khaki": "#b9a66b"}
OTHERS = ["#2a2f3a", "#5a6b7d", "#a33b3b", "#3b7d5a", "#7d5a9e", "#b58a2f"]
FLOOR = {"wide": (660, 965), "medium": (860, 1040), "close": (1500, 1800)}   # (person height, floor y)


def outfit_color(outfit, default="#2f6fb8"):
    for w in re.findall(r"[a-z]+", (outfit or "").lower()):
        if w in COLORS:
            return rgb(COLORS[w])
    return rgb(default)


def _bubble(cv, cx, cy, r, kind, style, tail_to):
    c = cv.c
    fill = (1, 1, 1) if style == "professor" else PAPER
    if kind == "thought":
        for dx, dy, rr in ((-.55, .1, .55), (0, -.25, .7), (.6, .05, .6), (.1, .3, .6)):
            cv.ellipse(cx + dx * r, cy + dy * r, rr * r, rr * r * .85, fill=fill)
        for dx, dy, rr in ((-.55, .1, .55), (0, -.25, .7), (.6, .05, .6), (.1, .3, .6)):
            cv.ellipse(cx + dx * r, cy + dy * r, rr * r - 5, rr * r * .85 - 5, fill=fill, w=0)
        tx, ty = tail_to
        for k, rr in ((.3, 22), (.55, 15), (.78, 9)):
            cv.ellipse(cx + (tx - cx) * k, cy + r * .6 + (ty - cy - r * .6) * k, rr, rr * .85, fill=fill)
    else:
        cv.rrect(cx - r * 1.2, cy - r * .8, r * 2.4, r * 1.6, r * .5, fill=fill)
        tx, ty = tail_to
        cv.shape([(cx - r * .3, cy + r * .78), (tx, ty), (cx + r * .25, cy + r * .78)], fill=fill)
        cv.rrect(cx - r * 1.2 + 6, cy - r * .8 + 6, r * 2.4 - 12, r * 1.6 - 12, r * .45, fill=fill, lw=0)


def render(style, spec, outfit="", palette=None):
    """Return a PIL RGB image (1920x1080) for the spec."""
    pal = palette or {}
    prof = style == "professor"
    bg = rgb(pal.get("bg", "#E0A911")) if prof else PAPER
    cv = Canvas(bg)
    shot = spec.get("shot") if spec.get("shot") in FLOOR else "wide"
    ph, floor = FLOOR[shot]
    people = (spec.get("people") or [])[:2] or [{"who": "hero", "pose": "stand", "mood": "neutral"}]
    props = [p for p in (spec.get("props") or []) if p.get("name") in PROPS][:4]

    # floor
    if shot != "close":
        if prof:
            cv.c.set_source_rgb(*shade(bg, .86))
            cv.c.rectangle(0, floor, W, H - floor)
            cv.c.fill()
            cv.line([(0, floor), (W, floor)], w=6)
        else:
            cv.line([(0, floor), (W, floor)], w=8)
            for k, xx in enumerate((300, 800, 1400)):
                cv.line([(xx, floor + 60 + k * 10), (xx + 260, floor + 60 + k * 10)], w=5)

    # people x positions
    xs = {"left": SLOTS["left"], "center": SLOTS["center"], "right": SLOTS["right"]}
    px = []
    if len(people) == 1:
        side = people[0].get("side") or ("center" if shot == "close" else "left")
        px = [xs.get(side, SLOTS["left"])]
        if shot == "close":
            px = [SLOTS["center"] if not props else (SLOTS["left"] + 120)]
    else:
        px = [SLOTS["left"], SLOTS["right"]]
        if shot != "wide":
            px = [SLOTS["left"] - 60, SLOTS["right"] + 60]
    pw = 200 if shot == "wide" else 280

    # prop placement
    free = [SLOTS[k] for k in ("far_left", "left", "center", "right", "far_right")]
    placed = []
    for p in props:
        if p.get("slot") == "hand":
            placed.append((p, None))
            continue
        want = SLOTS.get(p.get("slot"), None)
        cand = sorted((x for x in free if all(abs(x - q) > pw + 130 for q in px)), key=lambda x: abs(x - (want or px[0] + 400)))
        if not cand:
            continue
        x = cand[0]
        free.remove(x)
        placed.append((p, x))
    anchor = None
    wall_y = floor * .42
    scale = 1.0 if shot != "close" else .7
    for p, x in placed:
        if x is None:
            continue
        s = SIZES.get(p.get("size"), 400) * scale
        x = min(max(x, s / 2 + 30), W - s / 2 - 30)
        name = p["name"]
        cy = wall_y if name in WALL and name not in ("tv", "safe", "bookshelf", "door") else floor - s * .5
        PROPS[name](cv, x, cy, s, style)
        if anchor is None:
            anchor = (x, cy - s * .5)

    # seats for sitting people
    for pe, x in zip(people, px):
        if pe.get("pose") == "sit":
            seat_y = floor - ph * .3 * .85 + 14
            cv.rrect(x - ph * .16, seat_y, ph * .56, ph * .045, 10, fill=art.fc(style, (.55, .36, .2)))
            for lx in (x - ph * .1, x + ph * .34):
                cv.rrect(lx, seat_y + ph * .045, ph * .03, floor - seat_y - ph * .045, 6, fill=art.fc(style, (.45, .3, .17)))

    # people
    hero_col = outfit_color(outfit)
    for i, (pe, x) in enumerate(zip(people, px)):
        pose = pe.get("pose") if pe.get("pose") in POSES else "stand"
        mood = pe.get("mood") if pe.get("mood") in MOODS else "neutral"
        flip = 1 if x <= W / 2 else -1
        if len(people) == 1 and shot != "close" and placed and placed[0][1]:
            flip = 1 if placed[0][1] > x else -1
        if prof:
            col = hero_col if pe.get("who", "hero") == "hero" else rgb(OTHERS[i % len(OTHERS)])
            hair = None if pe.get("who", "hero") == "hero" else rgb(["#4a3424", "#1d1a1a", "#b0752f", "#7a2d2d"][i % 4])
            person(cv, x, floor, ph, pose, mood, top=col, flip=flip, hair=hair)
        else:
            stick(cv, x, floor, ph, pose, mood, flip=flip, w=13 if shot != "close" else 22)

    # hand-held props
    for p, x in placed:
        if x is None and p["name"] in PROPS:
            s = SIZES.get(p.get("size"), 260) * (.8 if shot == "wide" else 1.0) * (1.6 if shot == "close" else 1)
            PROPS[p["name"]](cv, px[0] + (120 if shot != "close" else 330), floor - ph * .42, s * .7, style)

    # bubble
    b = spec.get("bubble")
    if b and shot != "close":
        r = 170
        bx, by = px[0] + ph * .5, floor - ph - 40
        by = max(by, 330)
        _bubble(cv, bx, by, r, b.get("kind", "thought"), style, (px[0] + ph * .12, floor - ph * .9))
        if b.get("prop") in PROPS:
            PROPS[b["prop"]](cv, bx, by, r * 1.15, style)

    surf = cv.s
    im = Image.frombuffer("RGBA", (surf.get_width(), surf.get_height()), bytes(surf.get_data()), "raw", "BGRA", 0, 1).convert("RGB")

    # in-scene label
    t = (spec.get("text") or "").strip().upper()
    if t:
        d = ImageDraw.Draw(im)
        f = gfx.fit_font("Anton-Regular.ttf", t, 640, 120, 120)
        tw = d.textlength(t, font=f)
        cx = anchor[0] if anchor else W - 520
        cy = max(240, anchor[1] - 90) if anchor else 400
        box = (cx - tw / 2 - 40, cy - 70, cx + tw / 2 + 40, cy + 70)
        d.rounded_rectangle(box, 22, fill=(255, 255, 255) if prof else (245, 240, 230), outline=(20, 18, 16), width=9)
        d.text((cx, cy + 4), t, font=f, fill=(20, 18, 16) if not prof else (190, 30, 24), anchor="mm")
    return im
