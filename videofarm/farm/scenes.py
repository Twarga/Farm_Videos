"""Code-drawn scene plates: the LLM's free-text `scene` is parsed into a small spec (shot, pose, mood, props, set)
and drawn with Pillow into cache/images/<key>.png. No image model anywhere.

Per style:
- professor: flat cartoon everyman (bald round head, white eyes, black pupils, peach skin) on #F7C325.
- stickman:  black ink stick figure + line-art props on cream paper.
"""
import math
import re

from PIL import Image, ImageDraw

from . import config, gfx

W, H = 1920, 1080
INK = (20, 20, 20)

# ---------------------------------------------------------------- vocabulary
MOODS = [
    ("shock", ["shock", "jaw drop", "wide-eyed", "stunned", "horrif"]),
    ("anger", ["angry", "furious", "rage", "glares", "glaring", "frustrat", "clench", "steam"]),
    ("sad", ["sad", "tear", "cry", "depress", "slump", "defeated", "miserable", "guilt", "regret", "heartbroken"]),
    ("worry", ["anxious", "worried", "frown", "nervous", "sweat", "tense", "uneasy", "stress", "fear", "panic", "dread"]),
    ("tired", ["tired", "exhaust", "weary", "yawn", "drained", "sleepy", "baggy eyes", "burnout"]),
    ("think", ["think", "ponder", "chin", "curious", "wonder", "consider", "thoughtful", "puzzle"]),
    ("smug", ["smug", "proud", "confident", "smirk", "cocky", "pleased", "satisf", "proud"]),
    ("happy", ["smile", "grin", "happy", "pleased", "laugh", "cheer", "delight", "relief", "relieved", "calm"]),
]
POSES = [
    ("sit", ["sit", "sits", "sitting", "seated", "hunches over a desk", "desk", "laptop"]),
    ("hunch", ["hunch", "slouch", "leans over", "leaning over", "bent over", "crane"]),
    ("point", ["point", "gesture", "indicat", "tap", "present", "shoving a", "shows"]),
    ("armsup", ["raise", "arms up", "celebrat", "fist pump", "cheer", "stretch", "hands up", "shrug"]),
    ("walk", ["walk", "stride", "march", "stroll"]),
    ("run", ["run", "jog", "sprint", "chase", "flee"]),
    ("sleep", ["sleep", "lies in bed", "lying in bed", "asleep", "in bed", "bed"]),
    ("kneel", ["kneel", "crouch", "squat", "on his knees"]),
    ("hold", ["hold", "grip", "clutch", "carries", "carry", "lifts", "lift", "hands a", "examines", "reads", "look at a", "phone", "statement", "bill"]),
]
SET_PROPS = ["desk", "chair", "lamp", "window", "door", "shelf", "bed", "sofa", "couch", "counter", "fridge",
             "treadmill", "table", "bench", "whiteboard", "easel", "mirror", "toilet", "shelf", "stairs", "car", "couch"]
PROP_PROPS = [
    "phone", "laptop", "tv", "credit card", "card", "coin", "coins", "check", "bill", "money", "cash", "envelope",
    "chart", "graph", "arrow", "scale", "clock", "calendar", "coffee", "mug", "plate", "donut", "salad", "burger",
    "book", "notebook", "paper", "document", "letter", "package", "box", "bag", "cart", "stroller", "baby", "dog",
    "cat", "tree", "plant", "house", "key", "car", "bicycle", "bus", "plane", "phone", "watch", "alarm", "battery",
    "thermometer", "pill", "cigarette", "drink", "bottle", "glass", "wine", "beer", "water", "tap", "dumbbell",
    "barbell", "weights", "medal", "trophy", "flag", "map", "globe", "lightbulb", "heart", "brain", "muscle",
    "tooth", "pillow", "blanket", "alarm clock", "sun", "moon", "star", "cloud", "rain", "umbrella", "hammer",
    "wrench", "scissors", "needle", "thread", "paintbrush", "camera", "microphone", "headphone", "speaker",
    "notification", "bell", "speech", "bubble", "magnif", "lock", "key", "chain", "rope", "ladder", "bridge",
    "mountain", "flag", "crown", "diamond", "gem", "apple", "banana", "carrot", "pizza", "ice cream", "cake",
]
PROF_COLORS = {
    "red": (229, 57, 53), "blue": (30, 105, 180), "green": (67, 160, 71), "yellow": (255, 213, 79),
    "orange": (251, 140, 0), "purple": (142, 36, 170), "pink": (240, 98, 146), "brown": (121, 85, 72),
    "black": (38, 38, 38), "white": (245, 245, 245), "gray": (120, 120, 120), "grey": (120, 120, 120),
    "navy": (26, 35, 126), "teal": (0, 128, 128), "khaki": (195, 176, 145), "beige": (220, 205, 175),
}
SKIN = (255, 224, 200)


def parse(shot, ch):
    """Free-text scene -> draw spec. Never fails; unknown scenes become a lone standing character."""
    s = (shot.get("scene") or "").lower()
    spec = {"shot": "medium", "mood": "neutral", "pose": "stand", "props": [], "set": None,
            "text": shot.get("text") or "", "person": True}
    for name, kws in (("wide", ["wide shot", "wide establishing", "far away", "long shot"]),
                      ("close", ["close-up", "close up", "over-the-shoulder", "over the shoulder", "extreme close"]),
                      ("still", ["still life", "no one", "empty", "just the", "object only"])):
        if any(k in s for k in kws):
            spec["shot"] = name
            if name == "still":
                spec["person"] = False
            break
    for mood, kws in MOODS:
        if any(k in s for k in kws):
            spec["mood"] = mood
            break
    for pose, kws in POSES:
        if any(k in s for k in kws):
            spec["pose"] = pose
            break
    spec["props"] = [p for p in PROP_PROPS if re.search(rf"\b{re.escape(p)}", s)][:3]
    spec["set"] = next((p for p in SET_PROPS if re.search(rf"\b{re.escape(p)}", s)), None)
    if "he" not in s and "she" not in s and "man" not in s and "woman" not in s and "figure" not in s and "person" not in s and "people" not in s and "his " not in s and "her " not in s:
        spec["person"] = spec["props"] == []
    return spec


# ---------------------------------------------------------------- small drawing helpers
def _c(col):
    return gfx.hexrgb(col) if isinstance(col, str) else col


def _o(d):  # professor outline width
    return max(4, int(d * 0.045))


def person_prof(d, x, y, h, pose="stand", mood="neutral", top=(30, 105, 180), bottom=(40, 40, 45), flip=False, behind=None):
    """Bald cartoon everyman. Feet at (x, y), total height h. `behind` = y of occluding surface (desk):
    legs shorter than that are skipped."""
    ow = int(max(5, h // 60))
    hd = h * 0.40                      # big cartoon head
    sit = pose == "sit"
    hipy = y - h * (0.20 if sit else 0.30)
    head_cy = y - h + hd / 2
    hx = x + (h * 0.06 if pose == "hunch" else 0)
    # legs first (torso overlaps tops)
    lw = int(h * 0.085)
    leg_top = hipy
    draw_legs = behind is None or leg_top < behind - 6
    if draw_legs:
        if sit:
            for s in (-1, 1):
                lx = x + s * h * 0.07
                d.line([lx, hipy, lx + s * h * 0.10, hipy + h * 0.10], fill=bottom, width=lw)
                d.line([lx + s * h * 0.10, hipy + h * 0.10, lx + s * h * 0.10, y], fill=bottom, width=lw)
                d.line([lx + s * h * 0.10, y, lx + s * h * 0.15, y], fill=bottom, width=lw)
        elif pose in ("walk", "run"):
            spread = h * 0.22 if pose == "run" else h * 0.14
            d.line([x, hipy, x - spread, y], fill=bottom, width=lw)
            d.line([x, hipy, x + spread, y - h * (0.10 if pose == "run" else 0.0)], fill=bottom, width=lw)
        else:
            for s in (-1, 1):
                lx = x + s * h * 0.07
                d.line([lx, hipy, lx, y], fill=bottom, width=lw)
                d.line([lx, y, lx + s * h * 0.05, y], fill=bottom, width=lw)  # foot
    # torso
    tw = h * 0.34
    d.rounded_rectangle([x - tw / 2, head_cy + hd * 0.36, x + tw / 2, hipy + h * 0.02], radius=tw * 0.34, fill=top, outline=INK, width=ow)
    # arms
    sh = head_cy + hd * 0.48
    hl = h * 0.17
    hands = [(x - tw * 0.88, sh + hl * 1.3), (x + tw * 0.88, sh + hl * 1.3)]
    if pose == "point":
        hands = [(x - tw * 0.74, sh + hl * 1.1), (x + tw * 1.0, sh - hl * 0.2)]
    elif pose == "armsup":
        hands = [(x - tw * 1.05, sh - hl * 1.1), (x + tw * 1.05, sh - hl * 1.1)]
    elif pose in ("hold", "hunch", "sit"):
        hands = [(x - tw * 0.30, sh + hl * 1.05), (x + tw * 0.30, sh + hl * 1.05)]
    for (hx2, hy), s in zip(hands, (-1, 1)):
        sx = x + s * tw * 0.38
        d.line([sx, sh, hx2, hy], fill=top, width=int(h * 0.08))
        d.ellipse([hx2 - h * 0.038, hy - h * 0.038, hx2 + h * 0.038, hy + h * 0.038], fill=SKIN, outline=INK, width=ow)
    # head + ear
    d.ellipse([hx - hd / 2, head_cy - hd / 2, hx + hd / 2, head_cy + hd / 2], fill=SKIN, outline=INK, width=ow)
    ex = hx - hd * (0.5 if not flip else -0.5)
    d.ellipse([ex - hd * 0.07, head_cy - hd * 0.05, ex + hd * 0.07, head_cy + hd * 0.09], fill=SKIN, outline=INK, width=ow)
    face_prof(d, hx, head_cy, hd, mood, flip)
    return head_cy - hd / 2, hx


def face_prof(d, hx, cy, hd, mood, flip=False):
    ow = int(max(4, hd // 22))
    ey = cy - hd * 0.06
    off = hd * 0.17
    dirx = -1 if flip else 1
    # eyes: white oval + pupil
    for s in (-1, 1):
        ex = hx + s * off * dirx + hd * 0.04 * dirx
        d.ellipse([ex - hd * 0.075, ey - hd * 0.1, ex + hd * 0.075, ey + hd * 0.1], fill=(255, 255, 255), outline=INK, width=ow)
        if mood == "tired":
            d.arc([ex - hd * 0.075, ey - hd * 0.04, ex + hd * 0.075, ey + hd * 0.14], 200, 340, fill=INK, width=ow)
            d.line([ex - hd * 0.08, ey - hd * 0.02, ex + hd * 0.08, ey - hd * 0.02], fill=INK, width=ow)
        elif mood == "sad":
            d.arc([ex - hd * 0.075, ey, ex + hd * 0.075, ey + hd * 0.12], 200, 340, fill=INK, width=ow)
        else:
            d.ellipse([ex - hd * 0.028, ey - hd * 0.028, ex + hd * 0.028, ey + hd * 0.028], fill=INK)
    # brows: worry/sad tilt up toward the middle, anger tilts down toward the middle
    by = ey - hd * 0.14
    for s in (-1, 1):
        ex = hx + s * off * dirx + hd * 0.04 * dirx
        if mood in ("worry", "sad", "shock"):
            d.line([ex - s * hd * 0.09, by + hd * 0.045, ex + s * hd * 0.09, by - hd * 0.02], fill=INK, width=ow)
        elif mood == "anger":
            d.line([ex - s * hd * 0.09, by - hd * 0.03, ex + s * hd * 0.09, by + hd * 0.04], fill=INK, width=ow)
        elif mood in ("happy", "smug"):
            d.arc([ex - hd * 0.09, by - hd * 0.05, ex + hd * 0.09, by + hd * 0.06], 180, 360, fill=INK, width=ow)
    # mouth
    my = cy + hd * 0.22
    if mood == "shock":
        d.ellipse([hx - hd * 0.07, my - hd * 0.06, hx + hd * 0.07, my + hd * 0.1], fill=(60, 20, 20), outline=INK, width=ow)
    elif mood in ("happy", "smug", "think"):
        d.arc([hx - hd * 0.14, my - hd * 0.1, hx + hd * 0.14, my + hd * 0.12], 15, 165, fill=INK, width=ow)
    elif mood in ("sad", "worry"):
        d.arc([hx - hd * 0.13, my - hd * 0.02, hx + hd * 0.13, my + hd * 0.16], 195, 345, fill=INK, width=ow)
    elif mood == "anger":
        d.arc([hx - hd * 0.12, my - hd * 0.04, hx + hd * 0.12, my + hd * 0.14], 195, 345, fill=INK, width=ow)
    elif mood == "tired":
        d.line([hx - hd * 0.1, my, hx + hd * 0.1, my], fill=INK, width=ow)
    else:
        d.line([hx - hd * 0.11, my, hx + hd * 0.11, my], fill=INK, width=ow)
    if mood == "worry":  # sweat drop
        sx = hx + hd * 0.52
        d.polygon([(sx, cy - hd * 0.28), (sx - hd * 0.05, cy - hd * 0.12), (sx + hd * 0.05, cy - hd * 0.12)], fill=(140, 200, 235), outline=INK)


def person_stick(d, x, y, h, pose="stand", mood="neutral", flip=False, behind=None):
    """Stick figure: circle head, dot eyes, line mouth, stick limbs. Feet at (x,y). `behind` = occluding y (desk)."""
    lw = int(max(5, h // 55))
    hd = h * 0.30
    head_cy = y - h + hd / 2
    hx = x + (h * 0.05 if pose == "hunch" else 0)
    d.ellipse([hx - hd / 2, head_cy - hd / 2, hx + hd / 2, head_cy + hd / 2], outline=INK, width=lw + 1)
    neck = (x, head_cy + hd / 2)
    sit = pose == "sit"
    hip = (x - h * 0.02, y - h * 0.20) if sit else (x, y - h * 0.38)
    d.line([neck, hip], fill=INK, width=lw)
    draw_legs = behind is None or hip[1] < behind - 6
    if draw_legs:
        if sit:
            for i, dx in enumerate((0.12, 0.16)):
                kx = x + h * dx
                d.line([hip, (kx, y - h * 0.16), (kx, y)], fill=INK, width=lw)
        elif pose in ("walk", "run"):
            sp = h * 0.20 if pose == "run" else h * 0.12
            d.line([hip, (x - sp, y - h * 0.02)], fill=INK, width=lw)
            d.line([hip, (x + sp, y - (h * 0.10 if pose == "run" else h * 0.02))], fill=INK, width=lw)
        elif pose == "sleep":
            pass
        else:
            d.line([hip, (x - h * 0.06, y)], fill=INK, width=lw)
            d.line([hip, (x + h * 0.06, y)], fill=INK, width=lw)
    # arms
    sh = (x, head_cy + hd * 0.62)
    if pose == "armsup":
        d.line([sh, (x - h * 0.26, head_cy - hd * 0.60)], fill=INK, width=lw)
        d.line([sh, (x + h * 0.26, head_cy - hd * 0.60)], fill=INK, width=lw)
    elif pose == "point":
        d.line([sh, (x - h * 0.10, head_cy + hd * 0.9)], fill=INK, width=lw)
        d.line([sh, (x + h * 0.20, head_cy + hd * 0.35)], fill=INK, width=lw)
    elif pose in ("hold", "hunch", "sit"):
        d.line([sh, (x - h * 0.09, hip[1] - h * 0.04)], fill=INK, width=lw)
        d.line([sh, (x + h * 0.14, hip[1] - h * 0.02)], fill=INK, width=lw)
    else:
        d.line([sh, (x - h * 0.11, hip[1] + h * 0.02)], fill=INK, width=lw)
        d.line([sh, (x + h * 0.11, hip[1] + h * 0.02)], fill=INK, width=lw)
    # face
    ey = head_cy - hd * 0.04
    for s in (-1, 1):
        ex = hx + s * hd * 0.15
        if mood in ("sad", "worry", "tired"):
            d.arc([ex - hd * 0.06, ey - hd * 0.01, ex + hd * 0.06, ey + hd * 0.06], 200, 340, fill=INK, width=max(3, lw - 2))
        else:
            d.ellipse([ex - hd * 0.035, ey - hd * 0.035, ex + hd * 0.035, ey + hd * 0.035], fill=INK)
        brow = {"anger": 0.5, "worry": -0.5, "sad": -0.5, "happy": -0.8}.get(mood)
        if brow:
            d.line([ex - hd * 0.07, ey - hd * 0.14 + hd * 0.05 * brow * s,
                    ex + hd * 0.07, ey - hd * 0.14 - hd * 0.05 * brow * s], fill=INK, width=max(3, lw - 2))
    my = head_cy + hd * 0.18
    if mood == "shock":
        d.ellipse([hx - hd * 0.06, my - hd * 0.02, hx + hd * 0.06, my + hd * 0.08], outline=INK, width=max(3, lw - 2))
    elif mood in ("happy", "smug", "think"):
        d.arc([hx - hd * 0.12, my - hd * 0.08, hx + hd * 0.12, my + hd * 0.08], 20, 160, fill=INK, width=max(3, lw - 2))
    elif mood in ("sad", "worry"):
        d.arc([hx - hd * 0.11, my - hd * 0.02, hx + hd * 0.11, my + hd * 0.10], 200, 340, fill=INK, width=max(3, lw - 2))
    else:
        d.line([hx - hd * 0.10, my + hd * 0.02, hx + hd * 0.10, my + hd * 0.02], fill=INK, width=max(3, lw - 2))
    return head_cy - hd / 2, hx


# ---------------------------------------------------------------- props (draw in given box)
def prop(d, name, box, style, im=None):
    """Draw one prop inside box=(x0,y0,x1,y1). Professor: filled + outlined. Stickman: ink outlines on cream."""
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    ow = int(max(4, min(w, h) * 0.05))
    prof = style == "professor"
    def F(col): return col if prof else None
    def OL(): return dict(outline=INK, width=ow)
    n = name
    if n in ("window", "picture"):
        d.rectangle([x0, y0, x1, y1], fill=F((30, 30, 55)), **OL())
        d.line([cx, y0, cx, y1], fill=INK, width=ow)
        d.line([x0, cy, x1, cy], fill=INK, width=ow)
        mx, my = x0 + w * .72, y0 + h * .28
        d.ellipse([mx - w * .09, my - h * .09, mx + w * .09, my + h * .09], fill=(250, 240, 190) if prof else (241, 235, 221), outline=INK, width=max(2, ow - 2))
        for i in range(3):
            sx, sy = x0 + w * (.15 + i * .22), y0 + h * (.15 + (i % 2) * .3)
            d.ellipse([sx - 3, sy - 3, sx + 3, sy + 3], fill=(250, 240, 190) if prof else (241, 235, 221))
    elif n in ("phone",):
        d.rounded_rectangle([cx - w * .28, y0, cx + w * .28, y1], radius=w * .08, fill=F((35, 35, 40)), **OL())
        d.rounded_rectangle([cx - w * .20, y0 + h * .08, cx + w * .20, y1 - h * .12], radius=w * .04, fill=F((200, 225, 240)), outline=INK, width=max(2, ow - 2))
        for i in range(3):
            d.line([cx - w * .14, y0 + h * (.2 + i * .18), cx + w * .10, y0 + h * (.2 + i * .18)], fill=(120, 120, 120) if prof else INK, width=max(2, ow - 3))
    elif n in ("laptop", "tv", "computer", "monitor", "screen"):
        d.rounded_rectangle([x0, y0, x1, y1 - h * .18], radius=w * .03, fill=F((40, 40, 45)), **OL())
        d.rectangle([x0 + w * .06, y0 + h * .07, x1 - w * .06, y1 - h * .25], fill=F((225, 235, 240)))
        for i in range(3):
            d.line([x0 + w * .12, y0 + h * (.15 + i * .15), x1 - w * .2, y0 + h * (.15 + i * .15)], fill=(110, 110, 110) if prof else INK, width=max(2, ow - 3))
        if n == "laptop":
            d.polygon([(x0 - w * .08, y1), (x1 + w * .08, y1), (x1 - w * .04, y1 - h * .16), (x0 + w * .04, y1 - h * .16)], fill=F((70, 70, 75)), **OL())
    elif n in ("credit card", "card"):
        d.rounded_rectangle([x0, y0 + h * .2, x1, y1 - h * .2], radius=h * .1, fill=F((240, 240, 245)), **OL())
        d.rectangle([x0, y0 + h * .33, x1, y0 + h * .45], fill=INK)
        d.rounded_rectangle([x0 + w * .08, y1 - h * .38, x0 + w * .3, y1 - h * .26], radius=4, fill=F((245, 190, 60)), outline=INK, width=max(2, ow - 2))
    elif n in ("coin", "coins"):
        for i, r in enumerate((0.36, 0.30, 0.24)):
            cy2 = y1 - h * (0.2 + i * 0.28)
            d.ellipse([cx - w * r, cy2 - h * r * 0.5, cx + w * r, cy2 + h * r * 0.5], fill=F((245, 200, 70)), **OL())
            d.ellipse([cx - w * r * .6, cy2 - h * r * 0.3, cx + w * r * .6, cy2 + h * r * 0.3], outline=INK, width=max(2, ow - 2))
    elif n == "check":
        d.ellipse([x0, y0, x1, y1], fill=F((120, 200, 120)), **OL())
        d.line([cx - w * .18, cy, cx - w * .04, cy + h * .16, cx + w * .22, cy - h * .18], fill=(255, 255, 255) if prof else INK, width=ow + 2, joint="curve")
    elif n in ("bill", "document", "paper", "letter", "statement", "invoice", "notebook"):
        d.rectangle([cx - w * .32, y0, cx + w * .32, y1], fill=F((252, 250, 245)), **OL())
        for i in range(4):
            d.line([cx - w * .22, y0 + h * (.18 + i * .18), cx + w * .22, y0 + h * (.18 + i * .18)], fill=(150, 150, 150) if prof else INK, width=max(2, ow - 3))
        d.line([cx - w * .22, y0 + h * .82, cx + w * .05, y0 + h * .82], fill=INK, width=max(2, ow - 2))
    elif n in ("money", "cash", "dollar"):
        for i in range(3):
            off = i * w * .05
            d.rounded_rectangle([x0 + off, y0 + h * .25 + off * .8, x1 - w * .2 + off, y1 - h * .25 + off * .8], radius=4, fill=F((140, 200, 140)), **OL())
        d.ellipse([cx - w * .1, cy - h * .12, cx + w * .1, cy + h * .12], fill=F((240, 245, 220)), outline=INK, width=max(2, ow - 2))
    elif n in ("chart", "graph", "arrow", "stonks"):
        d.rectangle([x0, y0, x1, y1], fill=F((250, 250, 248)), **OL())
        d.line([x0 + w * .12, y1 - h * .15, x0 + w * .12, y0 + h * .15], fill=INK, width=ow)
        d.line([x0 + w * .12, y1 - h * .15, x1 - w * .08, y1 - h * .15], fill=INK, width=ow)
        pts = [(x0 + w * .16, y1 - h * .25), (x0 + w * .4, y1 - h * .45), (x0 + w * .55, y1 - h * .35),
               (x0 + w * .72, y1 - h * .62), (x1 - w * .12, y1 - h * .72)]
        if "down" in n or "loss" in n:
            pts = [(px, y0 + y1 - py) for px, py in pts]
        d.line(pts, fill=(215, 60, 50) if prof else INK, width=ow + 2, joint="curve")
        d.polygon([pts[-1], (pts[-1][0] - w * .07, pts[-1][1] + (h * .02 if "down" not in n else -h * .02)),
                   (pts[-1][0] - w * .015, pts[-1][1] + (h * .07 if "down" not in n else -h * .07))],
                  fill=(215, 60, 50) if prof else INK)
    elif n == "scale":
        d.rounded_rectangle([cx - w * .35, y1 - h * .25, cx + w * .35, y1], radius=h * .05, fill=F((235, 235, 240)), **OL())
        d.rounded_rectangle([cx - w * .15, y1 - h * .2, cx + w * .15, y1 - h * .1], radius=4, fill=F((90, 90, 95)), outline=INK, width=max(2, ow - 2))
    elif n in ("clock", "alarm clock", "alarm"):
        d.ellipse([cx - w * .3, y0 + h * .1, cx + w * .3, y1 - h * .1], fill=F((252, 250, 245)), **OL())
        d.line([cx, cy, cx, y0 + h * .25], fill=INK, width=ow)
        d.line([cx, cy, cx + w * .14, cy + h * .05], fill=INK, width=ow)
        for a in range(0, 360, 90):
            mx = cx + math.cos(math.radians(a)) * w * .25
            my2 = cy + math.sin(math.radians(a)) * h * .33
            d.ellipse([mx - 3, my2 - 3, mx + 3, my2 + 3], fill=INK)
        if n == "alarm clock" or n == "alarm":
            d.ellipse([cx - w * .3, y0 - h * .02, cx - w * .14, y0 + h * .14], fill=F((230, 60, 50)), **OL())
            d.ellipse([cx + w * .14, y0 - h * .02, cx + w * .3, y0 + h * .14], fill=F((230, 60, 50)), **OL())
    elif n == "calendar":
        d.rectangle([cx - w * .32, y0 + h * .1, cx + w * .32, y1], fill=F((252, 250, 245)), **OL())
        d.rectangle([cx - w * .32, y0 + h * .1, cx + w * .32, y0 + h * .28], fill=F((230, 60, 50)), outline=INK, width=ow)
        for i in range(3):
            for j in range(2):
                d.rectangle([cx - w * .24 + i * w * .18, y0 + h * (.4 + j * .25), cx - w * .12 + i * w * .18, y0 + h * (.52 + j * .25)],
                            outline=INK, width=max(2, ow - 3))
    elif n in ("coffee", "mug", "cup"):
        d.rounded_rectangle([cx - w * .20, y0 + h * .32, cx + w * .20, y1 - h * .08], radius=w * .07, fill=F((250, 250, 250)), **OL())
        d.arc([cx + w * .12, y0 + h * .44, cx + w * .34, y0 + h * .72], 270, 90, fill=INK, width=ow)  # handle
        for i in (-1, 1):  # steam
            d.arc([cx + i * w * .07 - w * .03, y0 + h * .04, cx + i * w * .07 + w * .03, y0 + h * .28], 80, 270, fill=(150, 150, 150) if prof else INK, width=max(2, ow - 2))
    elif n in ("plate", "donut", "burger", "salad", "pizza", "cake", "ice cream", "apple", "banana", "carrot", "food"):
        d.ellipse([x0 + w * .1, y1 - h * .28, x1 - w * .1, y1 - h * .04], fill=F((250, 250, 250)), **OL())
        if n == "donut":
            d.ellipse([cx - w * .2, y0 + h * .18, cx + w * .2, y1 - h * .3], fill=F((225, 160, 90)), **OL())
            d.ellipse([cx - w * .07, y0 + h * .4, cx + w * .07, y1 - h * .52], fill=F((120, 70, 30)), outline=INK, width=max(2, ow - 2))
        elif n == "burger":
            d.pieslice([cx - w * .24, y0 + h * .1, cx + w * .24, y1 - h * .25], 180, 360, fill=F((235, 185, 110)), outline=INK, width=ow)
            d.rectangle([cx - w * .26, y0 + h * .48, cx + w * .26, y0 + h * .6], fill=F((120, 75, 40)), outline=INK, width=max(2, ow - 2))
            d.pieslice([cx - w * .24, y0 + h * .55, cx + w * .24, y1 - h * .15], 0, 180, fill=F((235, 185, 110)), outline=INK, width=ow)
        elif n == "salad":
            d.pieslice([cx - w * .3, y0 + h * .25, cx + w * .3, y1 + h * .1], 180, 360, fill=F((245, 245, 245)), outline=INK, width=ow)
            for i in range(4):
                lx = cx - w * .18 + i * w * .12
                d.ellipse([lx, y0 + h * .3 + (i % 2) * h * .1, lx + w * .1, y0 + h * .42 + (i % 2) * h * .1], fill=F((100, 175, 90)), outline=INK, width=max(2, ow - 3))
        else:
            d.ellipse([cx - w * .18, y0 + h * .2, cx + w * .18, y1 - h * .35], fill=F((235, 185, 110)), **OL())
    elif n in ("book",):
        d.polygon([(x0 + w * .1, y0 + h * .3), (cx, y0 + h * .42), (x1 - w * .1, y0 + h * .3), (x1 - w * .1, y1 - h * .15),
                   (cx, y1 - h * .03), (x0 + w * .1, y1 - h * .15)], fill=F((250, 248, 240)), **OL())
        d.line([cx, y0 + h * .42, cx, y1 - h * .03], fill=INK, width=max(2, ow - 2))
    elif n in ("package", "box", "bag", "cart"):
        if n == "bag":
            d.polygon([(cx - w * .28, y0 + h * .3), (cx + w * .28, y0 + h * .3), (cx + w * .34, y1), (cx - w * .34, y1)], fill=F((235, 210, 160)), **OL())
            d.arc([cx - w * .2, y0 + h * .08, cx + w * .2, y0 + h * .5], 180, 360, fill=INK, width=ow)
        elif n == "cart":
            d.rectangle([x0 + w * .1, y0 + h * .3, x1 - w * .05, y1 - h * .25], outline=INK, width=ow)
            for i in range(1, 4):
                d.line([x0 + w * (.1 + i * .22), y0 + h * .3, x0 + w * (.1 + i * .22), y1 - h * .25], fill=INK, width=max(2, ow - 3))
            for i in range(1, 3):
                d.line([x0 + w * .1, y0 + h * (.3 + i * .15), x1 - w * .05, y0 + h * (.3 + i * .15)], fill=INK, width=max(2, ow - 3))
            d.line([x0 + w * .1, y0 + h * .3, x0, y0 + h * .1], fill=INK, width=ow)
            for wx in (x0 + w * .25, x1 - w * .2):
                d.ellipse([wx - w * .06, y1 - h * .14, wx + w * .06, y1 - h * .02], outline=INK, width=ow)
        else:
            d.rectangle([cx - w * .3, y0 + h * .25, cx + w * .3, y1 - h * .05], fill=F((215, 175, 120)), **OL())
            d.line([cx - w * .3, y0 + h * .25, cx, y0 + h * .1, cx + w * .3, y0 + h * .25], fill=INK, width=ow)
            d.line([cx, y0 + h * .1, cx, y0 + h * .25], fill=INK, width=max(2, ow - 2))
    elif n in ("house", "key", "door"):
        if n == "key":
            d.ellipse([x0 + w * .05, cy - h * .18, x0 + w * .4, cy + h * .18], outline=INK, width=ow)
            d.line([x0 + w * .4, cy, x1 - w * .05, cy], fill=INK, width=ow)
            d.line([x1 - w * .22, cy, x1 - w * .22, cy + h * .16], fill=INK, width=ow)
            d.line([x1 - w * .1, cy, x1 - w * .1, cy + h * .12], fill=INK, width=ow)
        else:
            d.rectangle([cx - w * .3, y0 + h * .4, cx + w * .3, y1], fill=F((245, 240, 230)), **OL())
            d.polygon([(cx - w * .36, y0 + h * .4), (cx, y0), (cx + w * .36, y0 + h * .4)], fill=F((205, 75, 60)), **OL())
            d.rectangle([cx - w * .06, y1 - h * .3, cx + w * .06, y1], fill=F((150, 100, 70)), outline=INK, width=max(2, ow - 2))
    elif n in ("car", "bicycle", "bus", "plane"):
        if n == "bicycle":
            for wx in (x0 + w * .15, x1 - w * .15):
                d.ellipse([wx - w * .15, y1 - h * .4, wx + w * .15, y1 - h * .05], outline=INK, width=ow)
            d.line([x0 + w * .15, y1 - h * .22, x0 + w * .5, y0 + h * .3, x1 - w * .15, y1 - h * .22,
                    x0 + w * .55, y1 - h * .22, x0 + w * .15, y1 - h * .22], fill=INK, width=ow)
            d.line([x0 + w * .5, y0 + h * .3, x0 + w * .45, y0 + h * .15], fill=INK, width=ow)
        else:
            d.rounded_rectangle([x0 + w * .05, y0 + h * .35, x1 - w * .05, y1 - h * .2], radius=h * .08, fill=F((90, 140, 200)), **OL())
            d.polygon([(x0 + w * .25, y0 + h * .36), (x0 + w * .38, y0 + h * .12), (x1 - w * .3, y0 + h * .12), (x1 - w * .18, y0 + h * .36)],
                      fill=F((140, 180, 220)), **OL())
            for wx in (x0 + w * .28, x1 - w * .28):
                d.ellipse([wx - w * .09, y1 - h * .26, wx + w * .09, y1 - h * .06], fill=F((50, 50, 55)), **OL())
                d.ellipse([wx - w * .04, y1 - h * .2, wx + w * .04, y1 - h * .12], fill=F((160, 160, 165)))
    elif n in ("dumbbell", "barbell", "weights", "treadmill", "gym"):
        if n == "treadmill":
            d.rectangle([x0 + w * .1, y1 - h * .3, x1 - w * .05, y1 - h * .12], outline=INK, width=ow)
            d.polygon([(x1 - w * .3, y1 - h * .3), (x1 - w * .3, y0 + h * .25), (x1 - w * .12, y0 + h * .3), (x1 - w * .12, y1 - h * .3)], outline=INK, width=ow)
            d.rectangle([x0 + w * .18, y1 - h * .24, x1 - w * .12, y1 - h * .18], fill=F((80, 80, 85)))
        else:
            d.line([x0 + w * .1, cy, x1 - w * .1, cy], fill=INK, width=ow + 2)
            for i, bw in enumerate((0.10, 0.16, 0.16, 0.10)):
                bx = x0 + w * (.12 + i * .76 / 3)
                d.rounded_rectangle([bx, cy - h * (.22 + .12 * (i % 2)), bx + w * .1, cy + h * (.22 + .12 * (i % 2))],
                                    radius=4, fill=F((60, 60, 65)), **OL())
    elif n in ("medal", "trophy", "crown", "flag"):
        if n == "trophy":
            d.polygon([(cx - w * .2, y0 + h * .15), (cx + w * .2, y0 + h * .15), (cx + w * .12, y0 + h * .6), (cx - w * .12, y0 + h * .6)], fill=F((245, 200, 70)), **OL())
            d.arc([cx - w * .42, y0 + h * .1, cx - w * .1, y0 + h * .45], 90, 270, fill=INK, width=ow)
            d.arc([cx + w * .1, y0 + h * .1, cx + w * .42, y0 + h * .45], 270, 90, fill=INK, width=ow)
            d.rectangle([cx - w * .1, y0 + h * .6, cx + w * .1, y1 - h * .2], fill=F((245, 200, 70)), **OL())
            d.rectangle([cx - w * .22, y1 - h * .2, cx + w * .22, y1], fill=F((120, 85, 60)), **OL())
        elif n == "crown":
            d.polygon([(cx - w * .3, y1 - h * .1), (cx - w * .3, y0 + h * .3), (cx - w * .15, y0 + h * .5), (cx, y0 + h * .1),
                       (cx + w * .15, y0 + h * .5), (cx + w * .3, y0 + h * .3), (cx + w * .3, y1 - h * .1)], fill=F((245, 200, 70)), **OL())
        else:
            d.ellipse([cx - w * .2, y0 + h * .15, cx + w * .2, y0 + h * .75], fill=F((245, 200, 70)), **OL())
            d.line([cx - w * .1, y0 + h * .75, cx - w * .2, y1], fill=(180, 60, 50) if prof else INK, width=ow + 2)
            d.line([cx + w * .1, y0 + h * .75, cx + w * .2, y1], fill=(180, 60, 50) if prof else INK, width=ow + 2)
    elif n in ("heart", "brain", "muscle", "tooth"):
        if n == "heart":
            d.pieslice([cx - w * .3, y0 + h * .1, cx, y0 + h * .55], 180, 360, fill=F((215, 60, 70)), outline=INK, width=ow)
            d.pieslice([cx, y0 + h * .1, cx + w * .3, y0 + h * .55], 180, 360, fill=F((215, 60, 70)), outline=INK, width=ow)
            d.polygon([(cx - w * .28, y0 + h * .4), (cx + w * .28, y0 + h * .4), (cx, y1 - h * .1)], fill=F((215, 60, 70)), **OL())
        elif n == "brain":
            d.ellipse([cx - w * .3, y0 + h * .15, cx + w * .3, y1 - h * .2], fill=F((240, 160, 170)), **OL())
            for i in range(3):
                bx = cx - w * .2 + i * w * .15
                d.arc([bx - w * .07, y0 + h * .3, bx + w * .12, y0 + h * .6], 120, 320, fill=INK, width=max(2, ow - 2))
        else:
            d.arc([cx - w * .32, y0 + h * .2, cx + w * .1, y1 - h * .1], 90, 300, fill=SKIN if prof else INK, width=int(w * .18))
            d.arc([cx - w * .32, y0 + h * .2, cx + w * .1, y1 - h * .1], 90, 300, fill=INK, width=ow)
    elif n in ("plant", "tree", "flower"):
        d.polygon([(cx - w * .14, y1), (cx + w * .14, y1), (cx + w * .2, y1 - h * .3), (cx - w * .2, y1 - h * .3)], fill=F((190, 110, 70)), **OL())
        for i, (dx, dy, r) in enumerate(((-.14, .45, .13), (.12, .5, .11), (0, .28, .15))):
            d.ellipse([cx + w * dx - w * r, y0 + h * dy - w * r, cx + w * dx + w * r, y0 + h * dy + w * r], fill=F((95, 170, 85)), **OL())
        if n == "tree":
            d.rectangle([cx - w * .05, y1 - h * .3, cx + w * .05, y1], fill=F((130, 85, 55)), outline=INK, width=max(2, ow - 2))
    elif n in ("lightbulb", "idea"):
        d.ellipse([cx - w * .18, y0 + h * .05, cx + w * .18, y0 + h * .6], fill=F((250, 225, 110)), **OL())
        d.rectangle([cx - w * .09, y0 + h * .6, cx + w * .09, y0 + h * .78], fill=F((150, 150, 155)), **OL())
        for a in range(0, 360, 45):
            rx = cx + math.cos(math.radians(a)) * w * .3
            ry = y0 + h * .33 + math.sin(math.radians(a)) * h * .3
            d.line([cx + math.cos(math.radians(a)) * w * .22, y0 + h * .33 + math.sin(math.radians(a)) * h * .36, rx, ry],
                   fill=(250, 200, 80) if prof else INK, width=max(3, ow - 2))
    elif n in ("moon", "sun", "star", "cloud", "rain", "umbrella"):
        if n == "moon":
            d.ellipse([cx - w * .22, y0 + h * .1, cx + w * .18, y1 - h * .15], fill=F((250, 240, 190)), **OL())
            d.ellipse([cx - w * .1, y0 + h * .02, cx + w * .26, y1 - h * .28], fill=(241, 235, 221) if not prof else _bg(style))
        elif n == "sun":
            d.ellipse([cx - w * .16, cy - h * .24, cx + w * .16, cy + h * .24], fill=F((250, 215, 90)), **OL())
            for a in range(0, 360, 30):
                d.line([cx + math.cos(math.radians(a)) * w * .2, cy + math.sin(math.radians(a)) * h * .3,
                        cx + math.cos(math.radians(a)) * w * .3, cy + math.sin(math.radians(a)) * h * .44], fill=INK, width=ow)
        elif n == "umbrella":
            d.pieslice([cx - w * .34, y0, cx + w * .34, y1 - h * .15], 180, 360, fill=F((215, 60, 60)), **OL())
            d.line([cx, y0 + h * .32, cx, y1 - h * .08], fill=INK, width=ow)
            d.arc([cx - w * .08, y1 - h * .18, cx + w * .08, y1 - h * .02], 0, 180, fill=INK, width=ow)
        else:
            for dx, dy, r in ((- .2, .55, .18), (.05, .45, .22), (.25, .58, .15)):
                d.ellipse([cx + w * dx - w * r, y0 + h * dy - h * r * .7, cx + w * dx + w * r, y0 + h * dy + h * r * .7], fill=F((250, 250, 252)), **OL())
    elif n in ("baby", "stroller", "dog", "cat"):
        if n == "stroller":
            d.ellipse([cx - w * .3, y0 + h * .25, cx + w * .05, y0 + h * .7], outline=INK, width=ow)
            d.line([cx + w * .05, y0 + h * .45, x1 - w * .1, y0 + h * .2], fill=INK, width=ow)
            d.polygon([(cx - w * .3, y0 + h * .3), (cx + w * .05, y0 + h * .3), (cx + w * .05, y0 + h * .55), (cx - w * .22, y0 + h * .55)], fill=F((120, 170, 220)), **OL())
            for wx in (cx - w * .2, cx + w * .1):
                d.ellipse([wx - w * .05, y1 - h * .15, wx + w * .05, y1 - h * .03], outline=INK, width=ow)
        elif n == "baby":
            d.ellipse([cx - w * .14, y0 + h * .15, cx + w * .14, y0 + h * .5], fill=SKIN if prof else None, **OL())
            d.rounded_rectangle([cx - w * .18, y0 + h * .45, cx + w * .18, y1 - h * .1], radius=w * .1, fill=F((250, 250, 250)), **OL())
            for s in (-1, 1):
                d.ellipse([cx + s * w * .07 - 3, y0 + h * .3 - 3, cx + s * w * .07 + 3, y0 + h * .3 + 3], fill=INK)
            d.arc([cx - w * .05, y0 + h * .36, cx + w * .05, y0 + h * .44], 0, 180, fill=INK, width=max(2, ow - 2))
        else:  # dog / cat
            d.ellipse([cx - w * .28, y0 + h * .45, cx + w * .2, y1 - h * .1], fill=F((225, 185, 140)), **OL())
            d.ellipse([cx + w * .1, y0 + h * .2, cx + w * .36, y0 + h * .55], fill=F((225, 185, 140)), **OL())
            for s in (-1, 1):
                d.polygon([(cx + w * (.16 + s * .08), y0 + h * .24), (cx + w * (.13 + s * .11), y0 + h * .06), (cx + w * (.24 + s * .04), y0 + h * .2)],
                          fill=F((225, 185, 140)), **OL())
            d.ellipse([cx + w * .19, y0 + h * .33, cx + w * .23, y0 + h * .37], fill=INK)
            d.ellipse([cx + w * .3, y0 + h * .38, cx + w * .36, y0 + h * .44], fill=INK)
            d.arc([cx - w * .38, y0 + h * .3, cx - w * .1, y0 + h * .6], 60, 200, fill=INK, width=ow)
    elif n in ("watch", "battery", "pill", "thermometer"):
        if n == "battery":
            d.rounded_rectangle([cx - w * .3, y0 + h * .3, cx + w * .3, y1 - h * .3], radius=h * .06, outline=INK, width=ow)
            d.rectangle([cx + w * .3, cy - h * .08, cx + w * .36, cy + h * .08], fill=INK)
            d.rectangle([cx - w * .26, y0 + h * .34, cx - w * .1, y1 - h * .34], fill=F((230, 70, 50)))
        elif n == "watch":
            d.ellipse([cx - w * .2, cy - h * .22, cx + w * .2, cy + h * .22], fill=F((250, 250, 250)), **OL())
            d.rectangle([cx - w * .08, y0 + h * .05, cx + w * .08, cy - h * .2], fill=F((90, 60, 40)), outline=INK, width=max(2, ow - 2))
            d.rectangle([cx - w * .08, cy + h * .2, cx + w * .08, y1 - h * .05], fill=F((90, 60, 40)), outline=INK, width=max(2, ow - 2))
            d.line([cx, cy, cx + w * .1, cy - h * .05], fill=INK, width=max(2, ow - 2))
            d.line([cx, cy, cx - w * .03, cy - h * .12], fill=INK, width=max(2, ow - 2))
        else:
            d.rounded_rectangle([cx - w * .3, cy - h * .12, cx + w * .3, cy + h * .12], radius=h * .12, fill=F((245, 130, 130)), **OL())
            d.line([cx, cy - h * .12, cx, cy + h * .12], fill=INK, width=max(2, ow - 2))
    elif n in ("hammer", "wrench", "scissors", "needle", "paintbrush"):
        d.line([cx - w * .1, cy + h * .1, cx + w * .12, cy - h * .22], fill=(150, 100, 60) if prof else INK, width=ow + 4)
        d.rectangle([cx + w * .02, cy - h * .34, cx + w * .32, cy - h * .18], fill=F((150, 150, 160)), **OL())
    elif n in ("camera", "microphone", "headphone", "speaker"):
        if n == "microphone":
            d.ellipse([cx - w * .12, y0 + h * .1, cx + w * .12, y0 + h * .55], fill=F((90, 90, 95)), **OL())
            d.line([cx, y0 + h * .55, cx, y1 - h * .25], fill=INK, width=ow)
            d.line([cx - w * .15, y1 - h * .25, cx + w * .15, y1 - h * .25], fill=INK, width=ow)
            d.arc([cx - w * .2, y0 + h * .3, cx + w * .2, y0 + h * .7], 0, 180, fill=INK, width=ow)
        else:
            d.rectangle([cx - w * .3, y0 + h * .3, cx + w * .3, y1 - h * .25], fill=F((70, 70, 75)), **OL())
            d.ellipse([cx - w * .12, y0 + h * .4, cx + w * .12, y1 - h * .35], fill=F((160, 200, 230)), **OL())
    elif n in ("notification", "bell"):
        d.pieslice([cx - w * .22, y0 + h * .12, cx + w * .22, y1 - h * .25], 180, 360, fill=F((250, 210, 80)), **OL())
        d.rectangle([cx - w * .26, y0 + h * .55, cx + w * .26, y0 + h * .62], fill=F((250, 210, 80)), outline=INK, width=ow)
        d.ellipse([cx - w * .06, y0 + h * .68, cx + w * .06, y0 + h * .78], fill=F((250, 210, 80)), outline=INK, width=max(2, ow - 2))
    elif n in ("magnif", "lock", "ladder", "bridge", "mountain", "flag"):
        if n == "lock":
            d.rounded_rectangle([cx - w * .22, cy - h * .05, cx + w * .22, y1 - h * .15], radius=h * .04, fill=F((250, 205, 90)), **OL())
            d.arc([cx - w * .14, y0 + h * .1, cx + w * .14, cy + h * .08], 180, 360, fill=INK, width=ow)
        elif n == "mountain":
            d.polygon([(x0 + w * .05, y1 - h * .1), (x0 + w * .4, y0 + h * .15), (x0 + w * .7, y1 - h * .1)], fill=F((150, 160, 180)), **OL())
            d.polygon([(x0 + w * .45, y1 - h * .1), (x0 + w * .75, y0 + h * .3), (x1 - w * .05, y1 - h * .1)], fill=F((120, 130, 155)), **OL())
        else:
            d.ellipse([cx - w * .2, cy - h * .2, cx + w * .2, cy + h * .2], outline=INK, width=ow)
            d.line([cx + w * .15, cy + h * .15, cx + w * .32, cy + h * .32], fill=INK, width=ow)
    elif n in ("speech", "bubble"):
        d.rounded_rectangle([x0 + w * .1, y0 + h * .15, x1 - w * .1, y1 - h * .3], radius=h * .12, fill=F((252, 250, 245)), **OL())
        d.polygon([(cx - w * .05, y1 - h * .3), (cx + w * .05, y1 - h * .3), (cx - w * .12, y1 - h * .05)], fill=F((252, 250, 245)), **OL())
        for i in range(3):
            d.ellipse([cx - w * .14 + i * w * .12 - 3, cy - h * .1 - 3, cx - w * .14 + i * w * .12 + 3, cy - h * .1 + 3], fill=INK)
    elif n in ("pillow", "blanket"):
        d.rounded_rectangle([cx - w * .32, y0 + h * .3, cx + w * .32, y1 - h * .25], radius=h * .1, fill=F((252, 250, 245)), **OL())
        for s in (-1, 1):
            d.arc([cx + s * w * .32 - w * .06, y0 + h * .4, cx + s * w * .32 + w * .06, y1 - h * .35],
                  90 if s < 0 else 270, 270 if s < 0 else 90, fill=INK, width=max(2, ow - 2))
    else:  # generic: paper note with the word on it
        d.rectangle([cx - w * .3, y0 + h * .2, cx + w * .3, y1 - h * .2], fill=F((252, 250, 245)), **OL())
        if im is not None:
            gfx.draw_center(im, n.upper(), "Baloo2.ttf:SemiBold",
                            (cx - w * .26, y0 + h * .32, cx + w * .26, y1 - h * .32), INK, start=int(h * .18))


def _bg(style):
    return (247, 195, 37) if style == "professor" else (241, 235, 221)


# ---------------------------------------------------------------- sets (room furniture, drawn behind person)
def draw_set(d, name, box, style):
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    ow = int(max(4, h * 0.02))
    prof = style == "professor"
    cream = (241, 235, 221)
    fill = lambda c: c if prof else None
    line = dict(outline=INK, width=ow)
    wood = (185, 140, 95) if prof else None
    if name in ("desk", "table", "counter"):
        d.rectangle([x0, y1 - h * .42, x1, y1 - h * .32], fill=fill(wood) or cream, **line)
        for lx in (x0 + w * .06, x1 - w * .12):
            d.rectangle([lx, y1 - h * .32, lx + w * .06, y1], fill=fill(wood) or cream, **line)
    elif name in ("chair", "bench"):
        d.rectangle([x0 + w * .15, y1 - h * .4, x1 - w * .15, y1 - h * .3], fill=fill(wood) or cream, **line)
        for lx in (x0 + w * .2, x1 - w * .28):
            d.line([lx, y1 - h * .3, lx, y1], fill=INK, width=ow)
        d.line([x0 + w * .2, y1 - h * .4, x0 + w * .2, y0 + h * .25], fill=INK, width=ow)
        d.line([x1 - w * .22, y1 - h * .4, x1 - w * .22, y0 + h * .25], fill=INK, width=ow)
    elif name == "lamp":
        d.line([x1 - w * .3, y1, x1 - w * .3, y0 + h * .35], fill=INK, width=ow)
        d.polygon([(x1 - w * .45, y0 + h * .35), (x1 - w * .15, y0 + h * .35), (x1 - w * .22, y0 + h * .15), (x1 - w * .38, y0 + h * .15)],
                  fill=fill((250, 240, 200)) or cream, **line)
        for i in range(3):
            d.line([x1 - w * (.38 - i * .07), y0 + h * .38, x1 - w * (.40 - i * .07), y0 + h * .5], fill=(120, 120, 120) if prof else INK, width=max(2, ow - 2))
    elif name == "window":
        d.rectangle([x0 + w * .55, y0, x1 - w * .05, y0 + h * .55], fill=fill((35, 35, 60)) or cream, **line)
        d.line([(x0 + w * .55 + x1 - w * .05) / 2, y0, (x0 + w * .55 + x1 - w * .05) / 2, y0 + h * .55], fill=INK, width=ow)
        d.line([x0 + w * .55, y0 + h * .27, x1 - w * .05, y0 + h * .27], fill=INK, width=ow)
        mx, my = x0 + w * .78, y0 + h * .16
        d.ellipse([mx - w * .05, my - w * .05, mx + w * .05, my + w * .05], fill=(250, 240, 190) if prof else cream, outline=INK, width=max(2, ow - 2))
    elif name == "bed":
        d.rectangle([x0, y1 - h * .35, x1, y1 - h * .2], fill=fill((245, 245, 248)) or cream, **line)
        d.rectangle([x0, y1 - h * .35, x0 + w * .22, y1 - h * .2], fill=fill((252, 252, 252)) or cream, **line)
        for lx in (x0 + w * .03, x1 - w * .07):
            d.line([lx, y1 - h * .2, lx, y1], fill=INK, width=ow)
        d.line([x0, y1 - h * .35, x0, y0 + h * .3], fill=INK, width=ow)
        d.line([x0, y0 + h * .3, x0 + w * .1, y0 + h * .35], fill=INK, width=ow)
    elif name in ("sofa", "couch"):
        d.rounded_rectangle([x0 + w * .05, y1 - h * .45, x1 - w * .05, y1 - h * .15], radius=h * .08, fill=fill((160, 110, 80)) or cream, **line)
        d.rounded_rectangle([x0 + w * .12, y1 - h * .62, x1 - w * .12, y1 - h * .4], radius=h * .08, fill=fill((175, 125, 90)) or cream, **line)
        for ax in (x0 + w * .05, x1 - w * .14):
            d.rounded_rectangle([ax, y1 - h * .6, ax + w * .09, y1 - h * .15], radius=h * .04, fill=fill((160, 110, 80)) or cream, **line)
    elif name == "shelf":
        for i in range(3):
            sy = y0 + h * (.15 + i * .3)
            d.rectangle([x0 + w * .6, sy, x1 - w * .02, sy + h * .05], fill=fill(wood) or cream, **line)
        for i in range(4):
            bx = x0 + w * (.64 + i * .08)
            d.rectangle([bx, y0 + h * .02, bx + w * .05, y0 + h * .13], fill=fill((120 + i * 30, 90 + i * 20, 80)) or cream, outline=INK, width=max(2, ow - 2))
    elif name == "whiteboard" or name == "easel":
        d.rectangle([x0 + w * .2, y0, x1 - w * .1, y0 + h * .55], fill=(252, 252, 250) if prof else cream, **line)
        d.line([x0 + w * .35, y0 + h * .55, x0 + w * .28, y1], fill=INK, width=ow)
        d.line([x0 + w * .75, y0 + h * .55, x0 + w * .82, y1], fill=INK, width=ow)
        for i in range(2):
            d.line([x0 + w * .28, y0 + h * (.12 + i * .16), x1 - w * .2, y0 + h * (.12 + i * .16)], fill=(160, 160, 160) if prof else INK, width=max(2, ow - 2))
    elif name == "mirror":
        d.ellipse([x0 + w * .6, y0, x1 - w * .05, y0 + h * .5], outline=INK, width=ow)
        d.line([x0 + w * .68, y0 + h * .12, x0 + w * .8, y0 + h * .32], fill=(200, 220, 235) if prof else INK, width=max(2, ow - 2))
    elif name == "stairs":
        for i in range(4):
            d.rectangle([x0 + w * .55 + i * w * .1, y1 - h * (.15 + i * .14), x1 - w * .02, y1 - h * (i * .14)],
                        outline=INK, width=max(2, ow - 1))
    elif name == "car":
        prop(d, "car", (x0 + w * .1, y0 + h * .3, x1 - w * .1, y1), style)
    elif name == "door":
        d.rectangle([x0 + w * .65, y0, x1 - w * .05, y1], fill=fill(wood) or cream, **line)
        d.ellipse([x1 - w * .14, y0 + h * .48, x1 - w * .1, y0 + h * .53], fill=INK)
    elif name == "fridge":
        d.rounded_rectangle([x0 + w * .55, y0 + h * .05, x1 - w * .08, y1], radius=w * .03, fill=fill((235, 238, 242)) or cream, **line)
        d.line([x0 + w * .55, y0 + h * .4, x1 - w * .08, y0 + h * .4], fill=INK, width=ow)
        d.line([x1 - w * .2, y0 + h * .15, x1 - w * .2, y0 + h * .3], fill=INK, width=ow)
        d.line([x1 - w * .2, y0 + h * .5, x1 - w * .2, y0 + h * .7], fill=INK, width=ow)


# ---------------------------------------------------------------- plate composer
def outfit_colors(outfit):
    top, bottom = (30, 105, 180), (40, 40, 45)
    o = (outfit or "").lower()
    cols = [c for c in PROF_COLORS if re.search(rf"\b{c}\b", o)]
    if cols:
        top = PROF_COLORS[cols[0]]
        if len(cols) > 1:
            bottom = PROF_COLORS[cols[1]]
    return top, bottom


WALL_PROPS = {"clock", "alarm clock", "calendar", "window", "shelf", "mirror", "whiteboard", "easel", "map", "picture"}
DESK_PROPS = {"laptop", "tv", "computer", "monitor", "screen", "phone", "coffee", "mug", "cup", "plate", "donut",
              "burger", "salad", "pizza", "cake", "ice cream", "apple", "banana", "carrot", "food", "book", "notebook",
              "paper", "document", "letter", "statement", "invoice", "bill", "credit card", "card", "money", "cash",
              "dollar", "coin", "coins", "envelope", "pen", "keyboard", "pill", "cigarette", "drink", "bottle", "glass",
              "wine", "beer", "water", "camera", "microphone", "headphone", "speaker", "notification", "bell"}
BIG_FLOOR = {"bed", "sofa", "couch", "fridge", "treadmill", "stairs", "door", "car", "bicycle", "bus", "tree",
             "plant", "counter", "toilet", "barbell", "weights"}


def _desk(d, x0, y, x1, style):
    """Desk seen straight on: thin top slab + full apron to the floor (hides seated legs)."""
    prof = style == "professor"
    fill = (185, 140, 95) if prof else (241, 235, 221)
    d.rectangle([x0, y, x1, y + H * 0.035], fill=fill, outline=INK, width=6)
    d.rectangle([x0 + (x1 - x0) * .05, y + H * 0.035, x1 - (x1 - x0) * .05, int(H * 0.84)],
                fill=fill, outline=INK, width=6)


def desk_top_y(person_feet):
    return int(person_feet - H * 0.20)


def scene(style, spec, ch):
    """Full 1920×1080 plate. Zones: wall props top-left, big furniture right, person right-of-center,
    desk in front of person, small props on the desk, rest on floor left."""
    im = Image.new("RGB", (W, H), _bg(style))
    d = ImageDraw.Draw(im)
    floor_y = int(H * 0.84)
    prof = style == "professor"
    d.line([(0, floor_y), (W, floor_y)], fill=(200, 170, 110) if prof else INK, width=4)

    wall, desk_p, floor_p, big = [], [], [], []
    for p in spec["props"]:
        if p in WALL_PROPS:
            wall.append(p)
        elif p in BIG_FLOOR:
            big.append(p)
        elif p in DESK_PROPS and spec["person"]:
            desk_p.append(p)
        else:
            floor_p.append(p)
    has_desk = spec["set"] in ("desk", "table", "counter") or (desk_p and spec["person"] and spec["pose"] in ("sit", "hunch"))
    if spec["set"] in ("bed", "sofa", "couch") and spec["set"] not in big:
        big.insert(0, spec["set"])
    elif spec["set"] in WALL_PROPS:
        wall.insert(0, spec["set"])

    for i, p in enumerate(wall[:2]):
        prop(d, p, (int(W * (.04 + i * .28)), int(H * .15), int(W * (.20 + i * .28)), int(H * .40)), style, im)
    for i, p in enumerate(big[:1]):
        draw_set(d, p, (int(W * .55), int(H * .30), int(W * .97), floor_y), style)

    ph, px = {"wide": (H * .50, W * .66), "medium": (H * .66, W * .64), "close": (H * .76, W * .58), "still": (0, 0)}[spec["shot"]]
    if spec["person"] and ph:
        py = int(H * 0.76) if has_desk or spec["pose"] == "sit" else floor_y
        behind = desk_top_y(py) if has_desk else None
        top, bottom = outfit_colors(ch.get("outfit"))
        if spec["pose"] == "sleep":
            _sleeping(style, d, px, floor_y, ph, top, bottom)
        elif prof:
            person_prof(d, px, py, int(ph), spec["pose"], spec["mood"], top, bottom, behind=behind)
        else:
            person_stick(d, px, py, int(ph), spec["pose"], spec["mood"], behind=behind)

    if has_desk:
        desk_y = desk_top_y(int(H * 0.76))
        _desk(d, int(px - W * .46), desk_y, int(px + W * .12), style)
        for i, p in enumerate(desk_p[:2]):
            dw = int(W * .14)
            dx = int(px - W * (.44 - i * .18))
            prop(d, p, (dx, desk_y - int(H * .34), dx + dw, desk_y - 4), style, im)
    else:
        floor_p = floor_p + desk_p
    for i, p in enumerate(floor_p[:2]):
        prop(d, p, (int(W * (.05 + i * .26)), int(floor_y - H * .48), int(W * (.27 + i * .26)), int(floor_y)), style, im)

    if spec["text"]:
        tw, th = int(W * .15), int(W * .15 * .58)
        tx = int(px - W * .40)
        ty = (desk_y - th - 6) if has_desk else int(H * .20)
        d.rectangle([tx, ty, tx + tw, ty + th], fill=(252, 250, 245), outline=INK, width=5)
        gfx.draw_center(im, spec["text"].upper(), "Anton-Regular.ttf",
                        (tx + 12, ty + 8, tx + tw - 12, ty + th - 8), INK, start=int(tw * .15))
    return im


def _sleeping(style, d, x, floor_y, h, top, bottom):
    """Lying down: pillow + head on it, blanket covering the body."""
    prof = style == "professor"
    cream = (241, 235, 221)
    fill = SKIN if prof else cream
    hd = h * 0.34
    hx, hy = x - W * .16, int(floor_y - H * .30)
    d.rectangle([hx - hd * .8, hy - hd * .1, hx + hd * .5, hy + hd * .55], fill=(252, 250, 245) if prof else cream,
                outline=INK, width=int(h * .012) + 3)
    d.ellipse([hx - hd / 2, hy - hd / 2, hx + hd / 2, hy + hd / 2], fill=fill, outline=INK, width=int(h * .012) + 3)
    for s in (-1, 1):
        ex = hx + s * hd * .15
        d.arc([ex - hd * .06, hy - hd * .04, ex + hd * .06, hy + hd * .04], 200, 340, fill=INK, width=max(3, int(h * .01)))
    d.line([hx - hd * .09, hy + hd * .18, hx + hd * .09, hy + hd * .18], fill=INK, width=max(3, int(h * .01)))
    d.rounded_rectangle([hx + hd * .35, hy - hd * .25, x + W * .30, floor_y - H * .04], radius=hd * .25,
                        fill=top if prof else cream, outline=INK, width=int(h * .012) + 3)


def icon(style, name):
    """Roster icon: first known prop word in the phrase, centered on a plate."""
    low = (name or "").lower()
    word = next((p for p in PROP_PROPS if re.search(rf"\b{re.escape(p)}", low)), None) or "lightbulb"
    im = Image.new("RGB", (512, 512), (255, 255, 255) if style == "professor" else _bg(style))
    d = ImageDraw.Draw(im)
    prop(d, word, (70, 70, 442, 442), style, im)
    return im


# ---------------------------------------------------------------- queue entry point
def render_item(style_name, item, job_dir):
    """Draw one images.json item to cache/images/<key>.png."""
    kind = item.get("kind")
    if kind == "icon":
        im = icon(style_name, item["icon"])
    else:
        spec = item.get("spec") or parse(item.get("shot", {}), item.get("chapter", {}))
        im = scene(style_name, spec, item.get("chapter", {}))
    out = config.IMAGE_CACHE / f"{item['key']}.png"
    im.save(out, "PNG")
    return out
