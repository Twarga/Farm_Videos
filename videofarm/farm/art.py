"""Hand-built vector art (pycairo). Everything is bezier shapes with consistent outlines; no image model involved.
Professor style: bald everyman, thick black outline, flat fills."""
import math
import cairo

INK = (0.08, 0.075, 0.07)
SKIN = (0.99, 0.86, 0.74)
BG = (0.878, 0.663, 0.067)
W, H = 1920, 1080
OL = 9  # outline width at 1080p
PAPER = (0.945, 0.92, 0.867)  # stickman cream paper


def fc(style, color):
    """Fill colour for a style: professor = flat colour, stickman = paper (line art only)."""
    return color if style == "professor" else PAPER


def rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def shade(c, k):
    return tuple(max(0, min(1, v * k)) for v in c)


class Canvas:
    def __init__(self, bg=BG, w=W, h=H):
        self.s = cairo.ImageSurface(cairo.FORMAT_ARGB32, w, h)
        self.c = cairo.Context(self.s)
        self.c.set_antialias(cairo.ANTIALIAS_BEST)
        self.c.set_line_join(cairo.LINE_JOIN_ROUND)
        self.c.set_line_cap(cairo.LINE_CAP_ROUND)
        self.c.set_source_rgb(*bg)
        self.c.paint()

    def path(self, pts, close=True):
        """Smooth closed/open curve through points (Catmull-Rom -> bezier)."""
        c = self.c
        n = len(pts)
        c.new_path()
        c.move_to(*pts[0])
        rng = range(n) if close else range(n - 1)
        for i in rng:
            p0 = pts[(i - 1) % n] if (close or i > 0) else pts[i]
            p1, p2 = pts[i], pts[(i + 1) % n]
            p3 = pts[(i + 2) % n] if (close or i + 2 < n) else p2
            c.curve_to(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
                       p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, *p2)
        if close:
            c.close_path()

    def shape(self, pts, fill=None, w=OL, close=True):
        self.path(pts, close)
        if fill is not None:
            self.c.set_source_rgb(*fill)
            self.c.fill_preserve()
        if w:
            self.c.set_source_rgb(*INK)
            self.c.set_line_width(w)
            self.c.stroke()
        else:
            self.c.new_path()

    def ellipse(self, cx, cy, rx, ry, fill=None, w=OL, rot=0):
        c = self.c
        c.save()
        c.translate(cx, cy)
        c.rotate(rot)
        c.scale(rx, ry)
        c.arc(0, 0, 1, 0, 2 * math.pi)
        c.restore()
        if fill is not None:
            c.set_source_rgb(*fill)
            c.fill_preserve()
        if w:
            c.save()
            c.set_source_rgb(*INK)
            c.set_line_width(w)
            c.stroke()
            c.restore()
        else:
            c.new_path()

    def rrect(self, x, y, w, h, r, fill=None, lw=OL):
        c = self.c
        c.new_path()
        c.arc(x + w - r, y + r, r, -math.pi / 2, 0)
        c.arc(x + w - r, y + h - r, r, 0, math.pi / 2)
        c.arc(x + r, y + h - r, r, math.pi / 2, math.pi)
        c.arc(x + r, y + r, r, math.pi, 1.5 * math.pi)
        c.close_path()
        if fill is not None:
            c.set_source_rgb(*fill)
            c.fill_preserve()
        if lw:
            c.set_source_rgb(*INK)
            c.set_line_width(lw)
            c.stroke()
        else:
            c.new_path()

    def line(self, pts, w=OL, color=INK):
        self.path(pts, close=False)
        self.c.set_source_rgb(*color)
        self.c.set_line_width(w)
        self.c.stroke()

    def limb(self, a, b, w, fill, ctrl=None):
        """Tapered-looking limb: thick outlined stroke from a to b (optionally bent through ctrl)."""
        c = self.c
        for width, col in ((w + OL * 2, INK), (w, fill)):
            c.new_path()
            c.move_to(*a)
            if ctrl:
                c.curve_to(*ctrl, *ctrl, *b)
            else:
                c.line_to(*b)
            c.set_source_rgb(*col)
            c.set_line_width(width)
            c.stroke()

    def save(self, path):
        self.s.write_to_png(path)


# ------------------------------------------------------------------ character
EXPR = {  # brow tilt, brow lift, eye size, pupil dx/dy, mouth kind
    "neutral": dict(brow=0, lift=0, eye=1.0, mouth="flat"),
    "happy": dict(brow=-.1, lift=-4, eye=1.0, mouth="smile"),
    "sad": dict(brow=.45, lift=0, eye=1.0, mouth="frown"),
    "shocked": dict(brow=0, lift=-22, eye=1.25, mouth="o"),
    "angry": dict(brow=-.55, lift=6, eye=.95, mouth="grit"),
    "worried": dict(brow=.35, lift=-6, eye=1.1, mouth="wobble"),
    "smug": dict(brow=-.25, lift=2, eye=.8, mouth="smirk"),
}


def face(cv, hx, hy, r, mood="neutral", look=(0.3, 0.1)):
    e = EXPR.get(mood, EXPR["neutral"])
    ex = r * .34
    ey = hy - r * .02
    er = r * .245 * e["eye"]
    c = cv.c
    for sgn in (-1, 1):
        x = hx + sgn * ex
        cv.ellipse(x, ey, er, er * 1.12, fill=(1, 1, 1), w=OL * .8)
        px, py = x + look[0] * er * .55, ey + look[1] * er * .55
        cv.ellipse(px, py, er * .44, er * .5, fill=INK, w=0)
        cv.ellipse(px - er * .12, py - er * .15, er * .1, er * .1, fill=(1, 1, 1), w=0)
        by = ey - er * 1.55 + e["lift"] * r / 200
        t = e["brow"] * sgn * -1
        cv.line([(x - er * .95, by + t * er * .9), (x + er * .95, by - t * er * .9)], w=OL * .9)
    m = e["mouth"]
    my = hy + r * .43
    mw = r * .22
    if m == "flat":
        cv.line([(hx - mw * .6, my), (hx + mw * .6, my + 2)], w=OL * .8)
    elif m == "smile":
        cv.line([(hx - mw, my - 4), (hx - mw * .4, my + mw * .45), (hx + mw * .5, my + mw * .45), (hx + mw, my - 6)], w=OL * .8)
    elif m == "frown":
        cv.line([(hx - mw, my + 10), (hx - mw * .3, my - 4), (hx + mw * .3, my - 4), (hx + mw, my + 10)], w=OL * .8)
    elif m == "o":
        cv.ellipse(hx, my + 4, mw * .5, mw * .7, fill=(.45, .1, .1), w=OL * .8)
    elif m == "grit":
        cv.rrect(hx - mw, my - 10, mw * 2, 24, 7, fill=(1, 1, 1), lw=OL * .8)
        cv.line([(hx, my - 10), (hx, my + 14)], w=4)
    elif m == "wobble":
        cv.line([(hx - mw, my + 2), (hx - mw * .5, my - 6), (hx, my + 4), (hx + mw * .5, my - 6), (hx + mw, my + 2)], w=OL * .8)
    elif m == "smirk":
        cv.line([(hx - mw * .5, my + 4), (hx + mw * .3, my + 4), (hx + mw, my - 8)], w=OL * .8)


def person(cv, x, floor, h, pose="stand", mood="neutral", top=rgb("#2f6fb8"), bottom=rgb("#262a33"),
           shoes=rgb("#f4f4f4"), flip=1, look=(0.3, 0.1), hair=None):
    """Bald everyman on y=floor, total height h, centred on x. flip=-1 mirrors.
    poses: stand point up shrug head hold sit walk cross facepalm"""
    f = flip
    hr = h * .205                       # head radius (big head = the look)
    leg = h * .30
    torso = h * .30
    seated = pose == "sit"
    hip_y = floor - (leg * .85 if seated else leg)
    sh_y = hip_y - torso
    hy = sh_y - hr * .95
    tw = h * .17                        # half torso width
    X = lambda dx: x + f * dx

    # legs + shoes
    for s in (-1, 1):
        lx = X(s * tw * .5)
        if seated:
            kx = lx + f * leg * .95
            cv.limb((lx, hip_y), (kx, hip_y), tw * .6, bottom)
            cv.limb((kx, hip_y), (kx, floor - 34), tw * .55, bottom)
            fx = kx
        elif pose == "walk":
            fx = lx + s * f * tw * .8
            cv.limb((lx, hip_y), (fx, floor - 34), tw * .62, bottom)
        else:
            fx = lx
            cv.limb((lx, hip_y), (lx, floor - 34), tw * .62, bottom)
        cv.ellipse(fx + f * tw * .22, floor - 17, tw * .62, 20, fill=shoes)

    arms = {
        "stand": [(-1.05, sh_y + 22, -1.35, hip_y - 20), (1.05, sh_y + 22, 1.35, hip_y - 20)],
        "walk": [(-1.05, sh_y + 22, -1.5, hip_y - 10), (1.05, sh_y + 22, 1.2, hip_y - 40)],
        "point": [(-1.05, sh_y + 22, -1.35, hip_y - 20), (1.0, sh_y + 20, 3.0, sh_y - 30)],
        "up": [(-1.0, sh_y + 20, -1.9, sh_y - h * .26 / tw * tw), (1.0, sh_y + 20, 1.9, sh_y - h * .26)],
        "shrug": [(-1.0, sh_y + 22, -2.1, sh_y + h * .02), (1.0, sh_y + 22, 2.1, sh_y + h * .02)],
        "head": [(-1.0, sh_y + 22, -1.35, hip_y - 20), (1.0, sh_y + 20, .9, hy + hr * .5)],
        "hold": [(-1.0, sh_y + 22, -.5, sh_y + torso * .66), (1.0, sh_y + 22, .5, sh_y + torso * .66)],
        "sit": [(-1.0, sh_y + 22, -.75, hip_y - 14), (1.0, sh_y + 22, .75, hip_y - 14)],
        "cross": [(-1.0, sh_y + 22, .75, sh_y + torso * .5), (1.0, sh_y + 22, -.75, sh_y + torso * .45)],
        "facepalm": [(-1.0, sh_y + 22, -1.35, hip_y - 20), (1.0, sh_y + 20, .35, hy + hr * .2)],
    }[pose]
    front = pose in ("hold", "cross")

    def arm(i):
        ax, ay, bx, by = arms[i]
        ax, bx = ax * tw, bx * tw
        out = 1 if ax > 0 else -1
        mid = (X((ax + bx) / 2 + out * 34), (ay + by) / 2 + 24)
        cv.limb((X(ax), ay), (X(bx), by), tw * .5, top, ctrl=mid)
        cv.ellipse(X(bx), by + 6, tw * .34, tw * .34, fill=SKIN)

    if not front:
        arm(0)
    # torso (hoodie) with hood + pocket
    cv.shape([(X(-tw), sh_y), (X(-tw * 1.08), sh_y + torso * .5), (X(-tw * 1.0), hip_y + 10),
              (X(tw * 1.0), hip_y + 10), (X(tw * 1.08), sh_y + torso * .5), (X(tw), sh_y)], fill=top)
    cv.shape([(X(-tw * .95), hip_y - torso * .28), (X(-tw * .5), hip_y - torso * .12), (X(tw * .5), hip_y - torso * .12),
              (X(tw * .95), hip_y - torso * .28), (X(tw * .7), hip_y - torso * .02), (X(-tw * .7), hip_y - torso * .02)],
             fill=shade(top, .9), w=OL * .7)
    cv.shape([(X(-tw * .75), sh_y - 4), (X(-tw * .35), sh_y + torso * .18), (X(0), sh_y + torso * .24),
              (X(tw * .35), sh_y + torso * .18), (X(tw * .75), sh_y - 4), (X(tw * .55), sh_y - hr * .3),
              (X(-tw * .55), sh_y - hr * .3)], fill=shade(top, 1.12), w=OL * .8)   # hood ring
    if front:
        arm(0)
    arm(1)
    # neck + head
    cv.rrect(x - 16, sh_y - 26, 32, 34, 10, fill=SKIN, lw=OL * .8)
    cv.ellipse(x, hy, hr, hr * 1.03, fill=SKIN)
    cv.ellipse(X(-hr * .98), hy + hr * .05, hr * .13, hr * .2, fill=SKIN, w=OL * .8)   # ear
    cv.ellipse(X(hr * .98), hy + hr * .05, hr * .13, hr * .2, fill=SKIN, w=OL * .8)
    if hair:
        pts = [(x + math.cos(a) * hr * 1.04, hy + math.sin(a) * hr * 1.06) for a in
               (math.radians(d) for d in range(196, 345, 18))]
        pts += [(x + hr * .86, hy - hr * .36), (x, hy - hr * .62), (x - hr * .86, hy - hr * .36)]
        cv.shape(pts, fill=hair, w=OL * .9)
    face(cv, x, hy, hr, mood, look)


def stick(cv, x, floor, h, pose="stand", mood="neutral", flip=1, w=13, look=(0.3, 0.1)):
    """Stickman: perfect circle head, dot eyes, one-line mouth, thick stick limbs."""
    f = flip
    hr = h * .165
    leg, body = h * .30, h * .27
    seated = pose == "sit"
    hip_y = floor - (leg * .85 if seated else leg)
    sh_y = hip_y - body
    hy = sh_y - hr - h * .015
    X = lambda dx: x + f * dx
    cv.line([(x, sh_y), (x, hip_y)], w=w)
    for s in (-1, 1):                                   # legs
        if seated:
            kx = x + f * leg * (.95 if s < 0 else .78) + s * 6
            cv.line([(x, hip_y), (kx, hip_y + 4), (kx + f * 4, floor - 8)], w=w)
        elif pose == "walk":
            cv.line([(x, hip_y), (X(s * h * .07), hip_y + leg * .55), (X(s * h * .17), floor - 4)], w=w)
        else:
            cv.line([(x, hip_y), (X(s * h * .05), hip_y + leg * .5), (X(s * h * .075), floor - 4)], w=w)
    S = (x, sh_y + h * .035)
    hands = {
        "stand": [(-.09, .25), (.09, .25)], "walk": [(-.12, .24), (.12, .2)], "point": [(-.09, .25), (.42, -.03)],
        "up": [(-.3, -.26), (.3, -.26)], "shrug": [(-.25, .1), (.25, .1)], "head": [(-.09, .25), (.17, -.13)],
        "hold": [(-.1, .17), (.1, .17)], "sit": [(-.1, .22), (.1, .22)], "cross": [(.08, .1), (-.08, .1)],
        "facepalm": [(-.09, .25), (.04, -.17)],
    }[pose]
    for dx, dy in hands:
        hx, hy2 = S[0] + f * dx * h, S[1] + dy * h
        ex, ey = (S[0] + hx) / 2 + (1 if dx > 0 else -1) * h * .05, (S[1] + hy2) / 2 + h * .05
        cv.line([S, (ex, ey), (hx, hy2)], w=w)
    cv.ellipse(x, hy, hr, hr, fill=PAPER, w=w)
    e = EXPR.get(mood, EXPR["neutral"])
    ex_ = hr * .36
    ey_ = hy - hr * .05
    er = hr * .09 * e["eye"]
    for sgn in (-1, 1):
        px = x + sgn * ex_ + f * look[0] * er * 1.2
        cv.ellipse(px, ey_ + look[1] * er, er, er * 1.15, fill=INK, w=0)
        t = e["brow"] * sgn * -1
        by = ey_ - hr * .28 + e["lift"] * hr / 200
        cv.line([(x + sgn * ex_ - hr * .2, by + t * hr * .16), (x + sgn * ex_ + hr * .2, by - t * hr * .16)], w=w * .5)
    my, mw = hy + hr * .42, hr * .3
    m = e["mouth"]
    if m in ("flat", "wobble"):
        cv.line([(x - mw, my), (x + mw, my)], w=w * .5)
    elif m in ("smile", "smirk"):
        cv.line([(x - mw, my - 4), (x - mw * .4, my + mw * .35), (x + mw * .5, my + mw * .35), (x + mw, my - 6)], w=w * .5)
    elif m in ("frown", "grit"):
        cv.line([(x - mw, my + 8), (x - mw * .3, my - 3), (x + mw * .3, my - 3), (x + mw, my + 8)], w=w * .5)
    else:
        cv.ellipse(x, my + 2, mw * .45, mw * .6, fill=INK, w=0)


if __name__ == "__main__":
    poses = ["stand", "point", "up", "shrug", "head", "hold", "sit", "walk", "cross", "facepalm"]
    moods = ["neutral", "smug", "shocked", "worried", "sad", "happy", "angry", "neutral", "smug", "sad"]
    cols = ["#2f6fb8", "#d7261e", "#2f9e5a", "#7a3fb0", "#e07b12"]
    for style in ("professor", "stickman"):
        cv = Canvas(BG if style == "professor" else PAPER)
        for i, (p, m) in enumerate(zip(poses, moods)):
            cx, fl = 200 + (i % 5) * 370, 500 + (i // 5) * 520
            if style == "professor":
                person(cv, cx, fl, 400, p, m, top=rgb(cols[i % 5]))
            else:
                stick(cv, cx, fl, 400, p, m)
        cv.save(f"/tmp/art_{style}.png")
