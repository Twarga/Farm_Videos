"""Draw Ricks-Clips-style 2D characters (big round head, bean body, stick limbs,
thick dark outline) as transparent PNGs. 4x supersampled for clean edges."""
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).parent / "chars"
OUT.mkdir(exist_ok=True)

SS = 4
W, H = 600, 1000          # final sprite size (px); 1 px ≈ 1.6 mm in scene
LINE = (28, 20, 24, 255)
HEAD = (243, 238, 228, 255)
LW = 9                    # outline width (final px)


def S(v):
    return int(round(v * SS))


class Pen:
    def __init__(self):
        self.im = Image.new("RGBA", (S(W), S(H)), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.im)

    def ellipse(self, box, fill, lw=LW):
        x0, y0, x1, y1 = box
        self.d.ellipse([S(x0), S(y0), S(x1), S(y1)], fill=fill, outline=LINE, width=S(lw))

    def line(self, pts, lw=LW, col=LINE):
        pts = [(S(x), S(y)) for x, y in pts]
        self.d.line(pts, fill=col, width=S(lw), joint="curve")
        r = S(lw) / 2
        for x, y in (pts[0], pts[-1]):
            self.d.ellipse([x - r, y - r, x + r, y + r], fill=col)

    def poly(self, pts, fill, lw=LW):
        pts = [(S(x), S(y)) for x, y in pts]
        self.d.polygon(pts, fill=fill, outline=LINE, width=S(lw))

    def arc(self, box, a0, a1, lw=LW, col=LINE):
        x0, y0, x1, y1 = box
        self.d.arc([S(x0), S(y0), S(x1), S(y1)], a0, a1, fill=col, width=S(lw))

    def rrect(self, box, r, fill, lw=LW):
        x0, y0, x1, y1 = box
        self.d.rounded_rectangle([S(x0), S(y0), S(x1), S(y1)], S(r), fill=fill, outline=LINE, width=S(lw))

    def save(self, name):
        im = self.im.resize((W, H), Image.LANCZOS)
        bbox = im.getbbox()
        im = im.crop((0, bbox[1], im.width, bbox[3]))     # feet touch the plane bottom; keep x centred
        im.save(OUT / f"{name}.png")


# ---------- face parts (head center cx, cy, radius r) ----------

def eyes(p, cx, cy, r, kind):
    ex = r * 0.32
    ey = cy + r * 0.02
    if kind == "dots":
        for s in (-1, 1):
            p.ellipse((cx + s * ex - 11, ey - 14, cx + s * ex + 11, ey + 14), LINE, lw=1)
    elif kind == "rings":       # shocked
        for s in (-1, 1):
            p.ellipse((cx + s * ex - 34, ey - 34, cx + s * ex + 34, ey + 34), (255, 255, 255, 255), lw=8)
            p.ellipse((cx + s * ex - 8, ey - 8, cx + s * ex + 8, ey + 8), LINE, lw=1)
    elif kind == "happy":       # ^ ^
        for s in (-1, 1):
            p.arc((cx + s * ex - 24, ey - 10, cx + s * ex + 24, ey + 30), 200, 340, lw=8)
    elif kind == "glasses":
        for s in (-1, 1):
            p.ellipse((cx + s * ex - 38, ey - 34, cx + s * ex + 38, ey + 34), (255, 255, 255, 120), lw=7)
            p.ellipse((cx + s * ex - 9, ey - 9, cx + s * ex + 9, ey + 9), LINE, lw=1)
        p.line([(cx - ex + 38, ey), (cx + ex - 38, ey)], lw=6)
    elif kind == "smug":        # half-lidded
        for s in (-1, 1):
            p.ellipse((cx + s * ex - 11, ey - 8, cx + s * ex + 11, ey + 14), LINE, lw=1)
            p.line([(cx + s * ex - 22, ey - 10), (cx + s * ex + 22, ey - 10)], lw=7)


def brows(p, cx, cy, r, kind):
    ex = r * 0.32
    by = cy - r * 0.27
    for s in (-1, 1):
        x0, x1 = cx + s * (ex - 30), cx + s * (ex + 30)
        if kind == "angry":
            p.line([(x0, by + 12), (x1, by - 12)], lw=11)
        elif kind == "worried":
            p.line([(x0, by - 14), (x1, by + 8)], lw=10)
        elif kind == "smug":
            p.line([(x0, by + (8 if s < 0 else -10)), (x1, by + (0 if s < 0 else -2))], lw=10)
        elif kind == "up":
            p.line([(x0, by - 18), ((x0 + x1) / 2, by - 26), (x1, by - 18)], lw=10)
        else:
            p.line([(x0, by), (x1, by)], lw=10)


def mouth(p, cx, cy, r, kind):
    my = cy + r * 0.42
    if kind == "line":
        p.line([(cx - 34, my), (cx + 34, my)], lw=9)
    elif kind == "smile":
        p.arc((cx - 46, my - 46, cx + 46, my + 18), 20, 160, lw=9)
    elif kind == "grin":          # wide toothy grin
        p.d.chord([S(cx - 80), S(my - 50), S(cx + 80), S(my + 50)], 0, 180,
                  fill=(255, 255, 255, 255), outline=LINE, width=S(8))
        for i in range(-2, 3):
            p.line([(cx + i * 26, my), (cx + i * 26, my + 40)], lw=5)
    elif kind == "teeth":         # gritted, nervous
        p.rrect((cx - 62, my - 22, cx + 62, my + 22), 10, (255, 255, 255, 255), lw=8)
        p.line([(cx - 60, my), (cx + 60, my)], lw=5)
        for i in range(-2, 3):
            p.line([(cx + i * 22, my - 20), (cx + i * 22, my + 20)], lw=4)
    elif kind == "o":
        p.ellipse((cx - 22, my - 26, cx + 22, my + 22), (60, 30, 35, 255), lw=8)
    elif kind == "smirk":
        p.d.line([(S(cx - 30), S(my + 4)), (S(cx + 10), S(my + 4)), (S(cx + 40), S(my - 14))],
                 fill=LINE, width=S(9), joint="curve")


def sweat(p, cx, cy, r):
    x, y = cx - r * 0.85, cy - r * 0.45
    p.d.polygon([(S(x), S(y - 34)), (S(x - 20), S(y + 4)), (S(x + 20), S(y + 4))], fill=(140, 205, 235, 255))
    p.ellipse((x - 21, y - 14, x + 21, y + 26), (140, 205, 235, 255), lw=5)


def moustache(p, cx, cy, r):
    my = cy + r * 0.27
    for s in (-1, 1):
        p.d.ellipse([S(cx + s * 30 - 34), S(my - 14), S(cx + s * 30 + 34), S(my + 16)], fill=(70, 45, 35, 255))


# ---------- hats ----------

def hat(p, cx, cy, r, kind):
    top = cy - r
    if kind == "pith":          # French colonial pith helmet
        p.d.ellipse([S(cx - r * 1.25), S(top + 18), S(cx + r * 1.25), S(top + 70)], fill=(232, 222, 190, 255),
                    outline=LINE, width=S(8))
        p.d.chord([S(cx - r * 0.92), S(top - 85), S(cx + r * 0.92), S(top + 95)], 180, 360,
                  fill=(240, 232, 205, 255), outline=LINE, width=S(8))
        p.line([(cx - r * 0.9, top + 40), (cx + r * 0.9, top + 40)], lw=12, col=(160, 120, 70, 255))
        p.ellipse((cx - 12, top - 92, cx + 12, top - 70), (232, 222, 190, 255), lw=6)
    elif kind == "conical":     # nón lá
        p.poly([(cx - r * 1.45, top + 62), (cx, top - 120), (cx + r * 1.45, top + 62)], (226, 196, 120, 255), lw=8)
        for i in (0.3, 0.55, 0.8):
            y = top - 120 + (182) * i
            w = r * 1.45 * i
            p.line([(cx - w, y), (cx + w, y)], lw=4, col=(170, 135, 70, 255))
    elif kind == "kepi":        # French police / inspector kepi
        p.rrect((cx - r * 0.72, top - 70, cx + r * 0.72, top + 40), 14, (40, 55, 120, 255), lw=8)
        p.rrect((cx - r * 0.74, top + 4, cx + r * 0.74, top + 40), 6, (190, 40, 45, 255), lw=7)
        p.ellipse((cx - 14, top - 40, cx + 14, top - 12), (230, 190, 70, 255), lw=5)
        p.poly([(cx - r * 0.8, top + 40), (cx + r * 0.8, top + 40), (cx + r * 0.95, top + 66), (cx - r * 0.95, top + 66)],
               (25, 25, 30, 255), lw=6)
    elif kind == "hair_black":
        p.d.chord([S(cx - r - 4), S(top - 6), S(cx + r + 4), S(cy + r * 0.2)], 180, 360,
                  fill=(30, 26, 30, 255), outline=LINE, width=S(8))
    elif kind == "hair_bun":
        p.ellipse((cx - 40, top - 60, cx + 40, top + 14), (30, 26, 30, 255), lw=7)
        p.d.chord([S(cx - r - 4), S(top - 6), S(cx + r + 4), S(cy + r * 0.25)], 180, 360,
                  fill=(30, 26, 30, 255), outline=LINE, width=S(8))
    elif kind == "visor":       # clerk green visor + side hair
        p.d.chord([S(cx - r - 4), S(top - 6), S(cx + r + 4), S(cy + r * 0.1)], 180, 360,
                  fill=(90, 70, 55, 255), outline=LINE, width=S(8))
        p.poly([(cx - r * 0.95, top + 52), (cx + r * 0.95, top + 52), (cx + r * 1.15, top + 92), (cx - r * 1.15, top + 92)],
               (60, 170, 110, 220), lw=7)


# ---------- body ----------

def character(name, body, hat_kind=None, eye="dots", brow="flat", mth="line", arms="down",
              sweat_drop=False, stache=False, collar=None, belt=None, item=None):
    p = Pen()
    cx = W / 2
    r = 150                   # head radius
    cy = 70 + 150 + 60        # leave room for hats
    by0, by1 = cy + r - 30, cy + r + 330
    bw = 120
    leg_top = by1 - 20
    foot_y = H - 30
    # legs (behind body)
    for s in (-1, 1):
        p.line([(cx + s * 38, leg_top), (cx + s * 50, foot_y - 30), (cx + s * 78, foot_y - 26)], lw=11)
    # arms
    sh_y = by0 + 70
    def arm(s, pose):
        x0 = cx + s * (bw - 10)
        if pose == "down":
            pts = [(x0, sh_y), (x0 + s * 50, sh_y + 130), (x0 + s * 40, sh_y + 230)]
        elif pose == "up":
            pts = [(x0, sh_y), (x0 + s * 90, sh_y - 80), (x0 + s * 110, sh_y - 210)]
        elif pose == "point":
            pts = [(x0, sh_y), (x0 + s * 110, sh_y - 60), (x0 + s * 170, sh_y - 170)]
        elif pose == "hip":
            pts = [(x0, sh_y), (x0 + s * 80, sh_y + 70), (x0 + s * 10, sh_y + 140)]
        elif pose == "hold":
            pts = [(x0, sh_y), (x0 + s * 40, sh_y + 120), (cx + s * 40, sh_y + 150)]
        else:
            pts = [(x0, sh_y), (x0 + s * 60, sh_y + 120), (x0 + s * 50, sh_y + 220)]
        p.line(pts, lw=11)
        hx, hy = pts[-1]
        p.ellipse((hx - 20, hy - 20, hx + 20, hy + 20), HEAD, lw=7)
    al, ar = (arms, arms) if isinstance(arms, str) else arms
    # body bean
    p.rrect((cx - bw, by0, cx + bw, by1), 110, body)
    if collar:
        p.poly([(cx - 45, by0 + 8), (cx, by0 + 70), (cx + 45, by0 + 8)], collar, lw=6)
    if belt:
        p.rrect((cx - bw + 6, by0 + 190, cx + bw - 6, by0 + 222), 4, belt, lw=6)
        p.rrect((cx - 20, by0 + 186, cx + 20, by0 + 226), 4, (220, 180, 70, 255), lw=5)
    arm(-1, al)
    arm(1, ar)
    if item == "scissors":
        hx, hy = cx + (bw - 10) + 40, sh_y + 150
        for a in (-1, 1):
            p.line([(hx, hy), (hx + 90, hy + a * 30)], lw=8, col=(160, 165, 175, 255))
        p.ellipse((hx - 34, hy - 30, hx - 4, hy), (200, 50, 50, 255), lw=6)
        p.ellipse((hx - 34, hy + 2, hx - 4, hy + 32), (200, 50, 50, 255), lw=6)
    if item == "coin":
        hx, hy = cx + (bw - 10) + 110, sh_y - 170
        p.ellipse((hx - 36, hy - 36, hx + 36, hy + 36), (215, 150, 70, 255), lw=7)
        p.ellipse((hx - 18, hy - 18, hx + 18, hy + 18), (0, 0, 0, 0), lw=5)
    # head
    p.ellipse((cx - r, cy - r, cx + r, cy + r), HEAD)
    if hat_kind:
        hat(p, cx, cy, r, hat_kind)
    brows(p, cx, cy, r, brow)
    eyes(p, cx, cy, r, eye)
    if stache:
        moustache(p, cx, cy, r)
    mouth(p, cx, cy, r, mth)
    if sweat_drop:
        sweat(p, cx, cy, r)
    p.save(name)


def rat(name, tail=True, baby=False, golden_tail=False, dead=False):
    """Side-view rat, facing right."""
    w, h = 700, 360
    p = Pen()
    p.im = Image.new("RGBA", (S(w), S(h)), (0, 0, 0, 0))
    p.d = ImageDraw.Draw(p.im)
    fur = (128, 112, 112, 255)
    pink = (238, 150, 160, 255)
    if golden_tail:
        pink = (240, 185, 70, 255)
    if tail:
        p.d.line([(S(250), S(230)), (S(150), S(250)), (S(80), S(200)), (S(30), S(240))], fill=LINE,
                 width=S(24), joint="curve")
        p.d.line([(S(250), S(230)), (S(150), S(250)), (S(80), S(200)), (S(30), S(240))], fill=pink,
                 width=S(12), joint="curve")
    else:
        p.ellipse((228, 212, 262, 246), pink, lw=6)   # stub
    for x in (300, 470):
        p.line([(x, 260), (x - 6, 320), (x + 14, 322)], lw=9)
    p.ellipse((230, 120, 560, 290), fur)
    p.poly([(500, 150), (660, 215), (520, 270)], fur)
    p.ellipse((640, 200, 672, 230), pink, lw=5)
    p.ellipse((470, 80, 560, 170), pink, lw=8)
    if dead:
        p.line([(560, 175), (585, 200)], lw=6)
        p.line([(585, 175), (560, 200)], lw=6)
    else:
        p.ellipse((560, 172, 584, 196), LINE, lw=1)
    for a in (-1, 1):
        p.line([(640, 212), (690, 212 + a * 22)], lw=3)
    im = p.im.resize((w, h), Image.LANCZOS)
    if dead:
        im = im.rotate(180, expand=False)
    if baby:
        im = im.resize((w // 2, h // 2), Image.LANCZOS)
    im.crop(im.getbbox()).save(OUT / f"{name}.png")


# ---------- cast ----------
KHAKI = (214, 198, 150, 255)
NAVY = (45, 60, 125, 255)
character("official_smug", (240, 236, 222, 255), "pith", eye="smug", brow="smug", mth="smirk", arms=("hip", "point"),
          stache=True, collar=(190, 50, 50, 255), belt=(120, 85, 50, 255))
character("official_happy", (240, 236, 222, 255), "pith", eye="happy", brow="up", mth="grin", arms=("down", "up"),
          stache=True, collar=(190, 50, 50, 255), belt=(120, 85, 50, 255), item="coin")
character("official_shock", (240, 236, 222, 255), "pith", eye="rings", brow="worried", mth="o", arms="up",
          stache=True, collar=(190, 50, 50, 255), belt=(120, 85, 50, 255), sweat_drop=True)
character("official_sweat", (240, 236, 222, 255), "pith", eye="dots", brow="worried", mth="teeth", arms="down",
          stache=True, collar=(190, 50, 50, 255), belt=(120, 85, 50, 255), sweat_drop=True)
character("clerk_sweat", (120, 140, 170, 255), "visor", eye="glasses", brow="worried", mth="teeth", arms="hold",
          sweat_drop=True, collar=(240, 240, 240, 255))
character("clerk_neutral", (120, 140, 170, 255), "visor", eye="glasses", brow="flat", mth="line", arms="hold",
          collar=(240, 240, 240, 255))
character("farmer_smug", (70, 120, 110, 255), "conical", eye="smug", brow="smug", mth="smirk", arms=("hip", "down"),
          belt=(150, 100, 60, 255))
character("farmer_scissors", (70, 120, 110, 255), "conical", eye="smug", brow="angry", mth="grin", arms=("down", "hold"),
          belt=(150, 100, 60, 255), item="scissors")
character("farmer_happy", (70, 120, 110, 255), "conical", eye="happy", brow="up", mth="grin", arms="up",
          belt=(150, 100, 60, 255))
character("towns_a", (170, 80, 70, 255), "conical", eye="happy", brow="up", mth="smile", arms="down")
character("towns_b", (200, 150, 60, 255), "hair_bun", eye="dots", brow="flat", mth="smile", arms="hold")
character("towns_c", (90, 70, 140, 255), "hair_black", eye="happy", brow="up", mth="grin", arms=("down", "up"))
character("towns_worried", (170, 80, 70, 255), "conical", eye="rings", brow="worried", mth="o", arms="down",
          sweat_drop=True)
character("inspector", NAVY, "kepi", eye="dots", brow="angry", mth="line", arms="hip", belt=(30, 30, 30, 255),
          collar=(200, 170, 70, 255))
character("inspector_shock", NAVY, "kepi", eye="rings", brow="worried", mth="o", arms="up", belt=(30, 30, 30, 255),
          collar=(200, 170, 70, 255), sweat_drop=True)
rat("rat")
rat("rat_notail", tail=False)
rat("rat_baby_gold", baby=True, golden_tail=True)
rat("rat_baby", baby=True)
rat("rat_dead", dead=True)
print(sorted(f.name for f in OUT.glob("*.png")))

# ---------- plague-doctor additions ----------

def plague_doctor(name="plague_doctor"):
    p = Pen()
    cx = W / 2
    r = 150
    cy = 70 + 150 + 60
    by0, by1 = cy + r - 30, cy + r + 330
    # bell-shaped waxed leather robe
    p.poly([(cx - 115, by0 + 40), (cx + 115, by0 + 40), (cx + 150, by1), (cx - 150, by1)], (40, 36, 48, 255))
    p.poly([(cx - 118, by0 - 8), (cx + 118, by0 - 8), (cx + 92, by0 + 62), (cx - 92, by0 + 62)], (56, 50, 64, 255))
    # stick arms
    p.line([(cx - 112, by0 + 70), (cx - 192, by0 + 185)], lw=10)
    p.line([(cx + 112, by0 + 70), (cx + 188, by0 + 150)], lw=10)
    # cane in right hand
    p.line([(cx + 188, by0 + 95), (cx + 188, by1 + 95)], lw=9, col=(150, 110, 70, 255))
    p.ellipse((cx + 188 - 18, by0 + 78, cx + 188 + 18, by0 + 100), (150, 110, 70, 255), lw=5)
    # stick legs
    p.line([(cx - 42, by1), (cx - 42, by1 + 95)], lw=12)
    p.line([(cx + 42, by1), (cx + 42, by1 + 95)], lw=12)
    # head: pale mask face
    p.ellipse((cx - r * 0.82, cy - r * 0.95, cx + r * 0.82, cy + r * 0.8), (226, 221, 205, 255))
    # beak: long dark wedge pointing down
    p.poly([(cx - 54, cy + 58), (cx + 54, cy + 58), (cx + 16, cy + 262), (cx - 16, cy + 262)], (62, 56, 66, 255))
    p.line([(cx, cy + 66), (cx, cy + 240)], lw=6, col=LINE)
    p.ellipse((cx - 22, cy + 214, cx + 10, cy + 238), (30, 26, 30, 255), lw=4)
    # goggle strap behind goggles
    p.line([(cx - r * 0.8, cy + 12), (cx + r * 0.8, cy + 12)], lw=16, col=(95, 72, 50, 255))
    # goggles
    for s in (-1, 1):
        gx = cx + s * r * 0.42
        p.ellipse((gx - 44, cy - 30, gx + 44, cy + 54), (22, 24, 32, 255))
        p.ellipse((gx - 34, cy - 20, gx + 34, cy + 44), (158, 188, 198, 255), lw=6)
        p.ellipse((gx - 20, cy - 6, gx - 2, cy + 10), (232, 242, 246, 255), lw=1)
    # wide-brim hat with red band
    top = cy - r * 0.95
    p.d.ellipse([S(cx - r * 1.55), S(top - 10), S(cx + r * 1.55), S(top + 74)], fill=(40, 36, 48, 255),
                outline=LINE, width=S(9))
    p.d.chord([S(cx - r * 0.82), S(top - 98), S(cx + r * 0.82), S(top + 76)], 180, 360,
              fill=(40, 36, 48, 255), outline=LINE, width=S(9))
    p.line([(cx - r * 0.82, top + 48), (cx + r * 0.82, top + 48)], lw=12, col=(145, 32, 38, 255))
    p.save(name)


def hazmat(name="hazmat"):
    """Modern hazmat callback: bright yellow suit, big dark visor."""
    p = Pen()
    cx = W / 2
    r = 150
    cy = 70 + 150 + 60
    by0, by1 = cy + r - 30, cy + r + 330
    YEL = (240, 190, 60, 255)
    p.ellipse((cx - 125, by0, cx + 125, by1), YEL)
    p.line([(cx - 115, by0 + 60), (cx - 185, by0 + 170)], lw=11)
    p.line([(cx + 115, by0 + 60), (cx + 185, by0 + 170)], lw=11)
    p.line([(cx - 48, by1), (cx - 48, by1 + 90)], lw=13)
    p.line([(cx + 48, by1), (cx + 48, by1 + 90)], lw=13)
    # head inside hood: yellow ring + visor
    p.ellipse((cx - r, cy - r, cx + r, cy + r), YEL)
    p.rrect((cx - r * 0.72, cy - r * 0.45, cx + r * 0.72, cy + r * 0.35), 30, (30, 34, 42, 255), lw=9)
    p.rrect((cx - r * 0.62, cy - r * 0.35, cx + r * 0.62, cy + r * 0.25), 22, (120, 170, 190, 255), lw=5)
    p.ellipse((cx - r * 0.3, cy - r * 0.2, cx - r * 0.14, cy - r * 0.04), (230, 242, 246, 255), lw=1)
    # respirator
    p.ellipse((cx - 34, cy + r * 0.5, cx + 34, cy + r * 0.82), (70, 75, 80, 255), lw=7)
    p.line([(cx - 34, cy + r * 0.66), (cx + 34, cy + r * 0.66)], lw=5, col=LINE)
    p.save(name)


plague_doctor()
hazmat()
character("villager_sick", (170, 80, 70, 255), "conical", eye="rings", brow="worried", mth="line", sweat_drop=True)
_im = Image.open(OUT / "villager_sick.png").convert("RGBA")
_d = ImageDraw.Draw(_im)
for _sx, _sy in [(300, 120), (238, 158), (362, 152), (285, 185), (332, 132)]:
    _d.ellipse([_sx - 9, _sy - 9, _sx + 9, _sy + 9], fill=(150, 58, 52, 255), outline=LINE, width=3)
_im.save(OUT / "villager_sick.png")
