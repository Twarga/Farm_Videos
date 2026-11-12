"""Money and finance props for explainer videos (pycairo).
Vector illustration: clean black outlines, flat fills, EverythingProfessor style.
"""
import math
import cairo
from farm.art import Canvas, INK, OL, PAPER, fc, rgb, shade

# ---------------------------------------------------------------------- Palette
GOLD = rgb("#F7C828")
GOLD_SHADOW = rgb("#DE9F0C")
GOLD_LIGHT = rgb("#FDE884")

GREEN_BILL = rgb("#48A962")
GREEN_DARK = rgb("#2B743E")
GREEN_MINT = rgb("#C2E7CA")

RED_VIVID = rgb("#EF4444")
RED_DARK = rgb("#B91C1C")
RED_LIGHT = rgb("#FCA5A5")

BLUE_CARD = rgb("#1E40AF")
BLUE_ACCENT = rgb("#38BDF8")
BLUE_DARK = rgb("#0F172A")

BROWN_LEATHER = rgb("#8B4513")
BROWN_LIGHT = rgb("#B45309")
BROWN_DARK = rgb("#5B2B0A")

GRAY_STEEL = rgb("#334155")
GRAY_LIGHT = rgb("#F1F5F9")
GRAY_MID = rgb("#94A3B8")
GRAY_DARK = rgb("#1E293B")

BURLAP = rgb("#DDA75E")
BURLAP_SHADOW = rgb("#B8833B")

PIG_PINK = rgb("#F472B6")
PIG_DARK = rgb("#DB2777")
PIG_LIGHT = rgb("#FBCFE8")


# ---------------------------------------------------------------------- Helpers
def _lw(s):
    """Standard outline width scaled from s."""
    return max(4.0, s * (OL / 350.0))


def _thin(s):
    """Fine detail stroke width."""
    return max(2.5, s * 0.015)


def _med(s):
    """Medium detail stroke width."""
    return max(3.5, s * 0.020)


def _poly(cv, pts, fill=None, lw=None):
    """Draw a straight-edged polygon with fill and stroke."""
    c = cv.c
    c.new_path()
    c.move_to(*pts[0])
    for p in pts[1:]:
        c.line_to(*p)
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


def _poly_line(cv, pts, lw, color=INK):
    """Draw an unclosed polygonal line."""
    c = cv.c
    c.new_path()
    c.move_to(*pts[0])
    for p in pts[1:]:
        c.line_to(*p)
    c.set_source_rgb(*color)
    c.set_line_width(lw)
    c.stroke()


def _text(cv, text, cx, cy, size, color=INK, bold=True):
    """Draw bold sans text centered at (cx, cy)."""
    c = cv.c
    c.save()
    c.select_font_face("Sans", cairo.FONT_SLANT_NORMAL,
                       cairo.FONT_WEIGHT_BOLD if bold else cairo.FONT_WEIGHT_NORMAL)
    c.set_font_size(size)
    xbear, ybear, w, h, _, _ = c.text_extents(text)
    c.move_to(cx - xbear - w / 2, cy - ybear - h / 2)
    c.set_source_rgb(*color)
    c.show_text(text)
    c.restore()


# ---------------------------------------------------------------------- Props

def prop_coin(cv, x, y, s, style):
    """Gold shiny coin with 3D rim and embossed $ symbol."""
    lw = _lw(s)
    thin = _thin(s)
    rx = s * 0.34
    ry = s * 0.19
    dy = s * 0.11
    top_y = y - dy * 0.5
    bot_y = y + dy * 0.5

    # 3D side edge cylinder
    c = cv.c
    c.new_path()
    c.move_to(x - rx, top_y)
    c.line_to(x - rx, bot_y)
    # Bottom half-ellipse
    steps = 28
    for i in range(steps + 1):
        angle = math.pi - i * math.pi / steps
        c.line_to(x + rx * math.cos(angle), bot_y + ry * math.sin(angle))
    c.line_to(x + rx, top_y)
    # Top half-ellipse backward
    for i in range(steps + 1):
        angle = 0 - i * math.pi / steps
        c.line_to(x + rx * math.cos(angle), top_y + ry * math.sin(angle))
    c.close_path()

    fill_edge = fc(style, GOLD_SHADOW)
    c.set_source_rgb(*fill_edge)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Milled rim vertical tick marks on edge
    for i in range(1, 9):
        ang = math.pi * (0.1 + 0.8 * i / 9.0)
        tx = x + rx * math.cos(ang)
        ty1 = top_y + ry * math.sin(ang)
        ty2 = bot_y + ry * math.sin(ang)
        cv.line([(tx, ty1), (tx, ty2)], w=thin * 0.9, color=INK)

    # Top face
    cv.ellipse(x, top_y, rx, ry, fill=fc(style, GOLD), w=lw)

    # Inner concentric rim groove
    cv.ellipse(x, top_y, rx * 0.76, ry * 0.76, fill=None, w=thin)

    # Embossed $ symbol
    _text(cv, "$", x, top_y, s * 0.22, color=INK, bold=True)

    # Two subtle glint highlights on upper-left rim
    for a_start, a_end in [(math.pi * 1.10, math.pi * 1.25), (math.pi * 1.32, math.pi * 1.45)]:
        c.save()
        c.new_path()
        c.translate(x, top_y)
        c.scale(rx * 0.88, ry * 0.88)
        c.arc(0, 0, 1.0, a_start, a_end)
        c.restore()
        c.set_source_rgb(*INK if style == "stickman" else GOLD_LIGHT)
        c.set_line_width(thin * 1.5)
        c.stroke()


def prop_coins(cv, x, y, s, style):
    """Stack of 3 coins plus 1 leaning coin."""
    lw = _lw(s)
    thin = _thin(s)
    rx = s * 0.26
    ry = s * 0.13
    dy = s * 0.08

    # 3 stacked coins (bottom to top)
    stack_pos = [
        (x - s * 0.07, y + s * 0.18),
        (x - s * 0.08, y + s * 0.06),
        (x - s * 0.06, y - s * 0.06),
    ]

    for idx, (cx, cy) in enumerate(stack_pos):
        top_y = cy - dy * 0.5
        bot_y = cy + dy * 0.5

        # Side rim
        c = cv.c
        c.new_path()
        c.move_to(cx - rx, top_y)
        c.line_to(cx - rx, bot_y)
        steps = 24
        for i in range(steps + 1):
            angle = math.pi - i * math.pi / steps
            c.line_to(cx + rx * math.cos(angle), bot_y + ry * math.sin(angle))
        c.line_to(cx + rx, top_y)
        for i in range(steps + 1):
            angle = -i * math.pi / steps
            c.line_to(cx + rx * math.cos(angle), top_y + ry * math.sin(angle))
        c.close_path()

        c.set_source_rgb(*fc(style, GOLD_SHADOW))
        c.fill_preserve()
        c.set_source_rgb(*INK)
        c.set_line_width(lw)
        c.stroke()

        # Milled edge ticks
        for ti in range(1, 6):
            tang = math.pi * (0.15 + 0.7 * ti / 6.0)
            tx = cx + rx * math.cos(tang)
            ty1 = top_y + ry * math.sin(tang)
            ty2 = bot_y + ry * math.sin(tang)
            cv.line([(tx, ty1), (tx, ty2)], w=thin * 0.8, color=INK)

        # Top face
        cv.ellipse(cx, top_y, rx, ry, fill=fc(style, GOLD), w=lw)
        cv.ellipse(cx, top_y, rx * 0.74, ry * 0.74, fill=None, w=thin)

        # Show $ on top coin
        if idx == 2:
            _text(cv, "$", cx, top_y, s * 0.16, color=INK, bold=True)

    # Leaning coin on right
    lx = x + s * 0.18
    ly = y + s * 0.10
    rot = -0.40
    c = cv.c
    c.save()
    c.translate(lx, ly)
    c.rotate(rot)

    top_y = -dy * 0.5
    bot_y = dy * 0.5
    c.new_path()
    c.move_to(-rx, top_y)
    c.line_to(-rx, bot_y)
    steps = 24
    for i in range(steps + 1):
        angle = math.pi - i * math.pi / steps
        c.line_to(rx * math.cos(angle), bot_y + ry * math.sin(angle))
    c.line_to(rx, top_y)
    for i in range(steps + 1):
        angle = -i * math.pi / steps
        c.line_to(rx * math.cos(angle), top_y + ry * math.sin(angle))
    c.close_path()
    c.set_source_rgb(*fc(style, GOLD_SHADOW))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Leaning top face
    c.save()
    c.translate(0, top_y)
    c.scale(rx, ry)
    c.arc(0, 0, 1.0, 0, 2 * math.pi)
    c.restore()
    c.set_source_rgb(*fc(style, GOLD))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Inner groove
    c.save()
    c.translate(0, top_y)
    c.scale(rx * 0.74, ry * 0.74)
    c.arc(0, 0, 1.0, 0, 2 * math.pi)
    c.restore()
    c.set_source_rgb(*INK)
    c.set_line_width(thin)
    c.stroke()

    # Text $ on leaning coin
    _text(cv, "$", 0, top_y, s * 0.15, color=INK, bold=True)
    c.restore()


def prop_cash(cv, x, y, s, style):
    """Thick bundle of banknotes with dollar sign and paper band in true 3D isometric view."""
    lw = _lw(s)
    thin = _thin(s)
    dy = s * 0.14

    # Top face corners (tilted parallelogram)
    p_top = (x, y - s * 0.20)
    p_right = (x + s * 0.36, y - s * 0.06)
    p_bot = (x, y + s * 0.08)
    p_left = (x - s * 0.36, y - s * 0.06)

    # Left thickness side
    _poly(cv, [p_left, p_bot, (p_bot[0], p_bot[1] + dy), (p_left[0], p_left[1] + dy)],
          fill=fc(style, GREEN_DARK), lw=lw)
    # Bill strata lines on left
    for f in (0.25, 0.50, 0.75):
        _poly_line(cv, [(p_left[0], p_left[1] + dy * f), (p_bot[0], p_bot[1] + dy * f)],
                   lw=thin, color=INK)

    # Right thickness side
    _poly(cv, [p_bot, p_right, (p_right[0], p_right[1] + dy), (p_bot[0], p_bot[1] + dy)],
          fill=fc(style, shade(GREEN_DARK, 0.85)), lw=lw)
    # Bill strata lines on right
    for f in (0.25, 0.50, 0.75):
        _poly_line(cv, [(p_bot[0], p_bot[1] + dy * f), (p_right[0], p_right[1] + dy * f)],
                   lw=thin, color=INK)

    # Top bill face
    _poly(cv, [p_top, p_right, p_bot, p_left], fill=fc(style, GREEN_BILL), lw=lw)

    # Inset border on top face
    inset = 0.12
    i_top = (x, y - s * 0.20 + (s * 0.28) * inset)
    i_bot = (x, y + s * 0.08 - (s * 0.28) * inset)
    i_right = (x + s * 0.36 * (1 - inset), y - s * 0.06)
    i_left = (x - s * 0.36 * (1 - inset), y - s * 0.06)
    _poly_line(cv, [i_top, i_right, i_bot, i_left, i_top], lw=thin, color=INK)

    # Center oval
    cv.ellipse(x, y - s * 0.06, s * 0.16, s * 0.08, fill=fc(style, GREEN_MINT), w=thin)
    _text(cv, "$", x, y - s * 0.06, s * 0.15, color=INK, bold=True)

    # Mini corner dollar signs
    _text(cv, "$", x - s * 0.26, y - s * 0.06, s * 0.05, color=INK, bold=True)
    _text(cv, "$", x + s * 0.26, y - s * 0.06, s * 0.05, color=INK, bold=True)

    # Paper band strap around middle (wrapped along isometric axis)
    bf1 = 0.38
    bf2 = 0.62
    b_tl = (p_top[0] + (p_left[0] - p_top[0]) * bf1, p_top[1] + (p_left[1] - p_top[1]) * bf1)
    b_tr = (p_top[0] + (p_left[0] - p_top[0]) * bf2, p_top[1] + (p_left[1] - p_top[1]) * bf2)
    b_br = (p_right[0] + (p_bot[0] - p_right[0]) * bf2, p_right[1] + (p_bot[1] - p_right[1]) * bf2)
    b_bl = (p_right[0] + (p_bot[0] - p_right[0]) * bf1, p_right[1] + (p_bot[1] - p_right[1]) * bf1)

    # Side band dropping down right side
    _poly(cv, [b_bl, b_br, (b_br[0], b_br[1] + dy), (b_bl[0], b_bl[1] + dy)],
          fill=fc(style, rgb("#E5D7B7")), lw=thin)

    # Top band across bill face
    _poly(cv, [b_tl, b_tr, b_br, b_bl], fill=fc(style, rgb("#F5EADB")), lw=thin)

    # Red security stripe along band
    m1 = ((b_tl[0] + b_tr[0]) * 0.5, (b_tl[1] + b_tr[1]) * 0.5)
    m2 = ((b_bl[0] + b_br[0]) * 0.5, (b_bl[1] + b_br[1]) * 0.5)
    _poly_line(cv, [m1, m2], lw=thin * 1.5, color=fc(style, RED_VIVID))
    _poly_line(cv, [m2, (m2[0], m2[1] + dy)], lw=thin * 1.5, color=fc(style, RED_VIVID))


def prop_money_bag(cv, x, y, s, style):
    """Plump burlap money sack tied with rope, stamped with $."""
    lw = _lw(s)
    thin = _thin(s)

    # Sack body points (pear shape)
    pts_body = [
        (x - s * 0.11, y - s * 0.08),
        (x - s * 0.25, y + s * 0.02),
        (x - s * 0.33, y + s * 0.17),
        (x - s * 0.22, y + s * 0.33),
        (x, y + s * 0.36),
        (x + s * 0.22, y + s * 0.33),
        (x + s * 0.33, y + s * 0.17),
        (x + s * 0.25, y + s * 0.02),
        (x + s * 0.11, y - s * 0.08),
    ]
    cv.shape(pts_body, fill=fc(style, BURLAP), w=lw, close=True)

    # Top frill ruffle (flaring cloth above cinch)
    pts_frill = [
        (x - s * 0.11, y - s * 0.08),
        (x - s * 0.17, y - s * 0.24),
        (x - s * 0.07, y - s * 0.20),
        (x, y - s * 0.26),
        (x + s * 0.07, y - s * 0.20),
        (x + s * 0.17, y - s * 0.24),
        (x + s * 0.11, y - s * 0.08),
    ]
    cv.shape(pts_frill, fill=fc(style, shade(BURLAP, 1.05)), w=lw, close=True)

    # Crease lines from cinch
    _poly_line(cv, [(x - s * 0.05, y - s * 0.05), (x - s * 0.14, y + s * 0.09)], lw=thin, color=INK)
    _poly_line(cv, [(x + s * 0.05, y - s * 0.05), (x + s * 0.14, y + s * 0.09)], lw=thin, color=INK)

    # Rope wrap around cinch
    cv.rrect(x - s * 0.13, y - s * 0.10, s * 0.26, s * 0.055, s * 0.025,
             fill=fc(style, rgb("#E5A823")), lw=lw)
    # Rope twists
    for rx in (-s * 0.06, 0, s * 0.06):
        cv.line([(x + rx, y - s * 0.10), (x + rx + s * 0.012, y - s * 0.045)], w=thin, color=INK)

    # Knot circle
    cv.ellipse(x + s * 0.05, y - s * 0.06, s * 0.035, s * 0.035, fill=fc(style, rgb("#E5A823")), w=lw * 0.8)

    # Dangling rope ends with tassels
    cv.shape([(x + s * 0.05, y - s * 0.05), (x + s * 0.10, y + s * 0.02),
              (x + s * 0.07, y + s * 0.10)], fill=None, w=lw * 0.8, close=False)
    cv.ellipse(x + s * 0.07, y + s * 0.11, s * 0.028, s * 0.035, fill=fc(style, rgb("#E5A823")), w=thin)

    cv.shape([(x + s * 0.04, y - s * 0.05), (x - s * 0.01, y + s * 0.02),
              (x + s * 0.02, y + s * 0.08)], fill=None, w=lw * 0.8, close=False)
    cv.ellipse(x + s * 0.02, y + s * 0.09, s * 0.025, s * 0.032, fill=fc(style, rgb("#E5A823")), w=thin)

    # Bold $ symbol on belly
    _text(cv, "$", x, y + s * 0.16, s * 0.27, color=INK, bold=True)


def prop_piggy_bank(cv, x, y, s, style):
    """Cute pink piggy bank with coin slipping into slot."""
    lw = _lw(s)
    thin = _thin(s)

    # Back legs (darker)
    cv.rrect(x - s * 0.20, y + s * 0.14, s * 0.09, s * 0.16, s * 0.04,
             fill=fc(style, shade(PIG_PINK, 0.8)), lw=lw)
    cv.rrect(x + s * 0.11, y + s * 0.14, s * 0.09, s * 0.16, s * 0.04,
             fill=fc(style, shade(PIG_PINK, 0.8)), lw=lw)

    # Coin in top slot (half visible)
    coin_x = x + s * 0.04
    coin_y = y - s * 0.21
    cv.ellipse(coin_x, coin_y, s * 0.09, s * 0.11, fill=fc(style, GOLD), w=lw, rot=-0.2)
    _text(cv, "$", coin_x, coin_y, s * 0.09, color=INK, bold=True)

    # Main oval body
    cv.ellipse(x + s * 0.02, y + s * 0.03, s * 0.29, s * 0.23,
               fill=fc(style, PIG_PINK), w=lw)

    # Front legs
    cv.rrect(x - s * 0.14, y + s * 0.16, s * 0.09, s * 0.16, s * 0.04,
             fill=fc(style, PIG_PINK), lw=lw)
    cv.rrect(x + s * 0.17, y + s * 0.16, s * 0.09, s * 0.16, s * 0.04,
             fill=fc(style, PIG_PINK), lw=lw)

    # Curly corkscrew tail on right
    c = cv.c
    c.save()
    c.new_path()
    c.move_to(x + s * 0.30, y + s * 0.01)
    c.curve_to(x + s * 0.37, y - s * 0.02, x + s * 0.38, y - s * 0.12, x + s * 0.32, y - s * 0.10)
    c.curve_to(x + s * 0.28, y - s * 0.08, x + s * 0.38, y - s * 0.02, x + s * 0.39, y - s * 0.06)
    c.set_source_rgb(*INK)
    c.set_line_width(lw * 0.9)
    c.stroke()
    c.restore()

    # Floppy ear
    pts_ear = [
        (x - s * 0.09, y - s * 0.17),
        (x - s * 0.18, y - s * 0.19),
        (x - s * 0.14, y - s * 0.05),
    ]
    cv.shape(pts_ear, fill=fc(style, PIG_DARK), w=lw, close=True)

    # Snout on left
    snout_x = x - s * 0.26
    snout_y = y + s * 0.06
    cv.ellipse(snout_x, snout_y, s * 0.065, s * 0.09, fill=fc(style, PIG_DARK), w=lw)
    # Nostrils
    cv.ellipse(snout_x, snout_y - s * 0.03, s * 0.012, s * 0.02, fill=INK, w=0)
    cv.ellipse(snout_x, snout_y + s * 0.03, s * 0.012, s * 0.02, fill=INK, w=0)

    # Eye with glint
    eye_x = x - s * 0.15
    eye_y = y - s * 0.04
    cv.ellipse(eye_x, eye_y, s * 0.025, s * 0.025, fill=INK, w=0)
    cv.ellipse(eye_x - s * 0.007, eye_y - s * 0.007, s * 0.008, s * 0.008, fill=PAPER, w=0)

    # Coin slot slit
    cv.rrect(x - s * 0.02, y - s * 0.19, s * 0.13, s * 0.028, s * 0.012, fill=INK, lw=0)


def prop_credit_card(cv, x, y, s, style):
    """Modern banking card with EMV chip, contactless wave, and dual-circle logo."""
    lw = _lw(s)
    thin = _thin(s)
    w = s * 0.74
    h = s * 0.48
    r = s * 0.04

    c = cv.c
    c.save()
    c.translate(x, y)
    c.rotate(-0.16)

    # Base card
    cv.rrect(-w * 0.5, -h * 0.5, w, h, r, fill=fc(style, BLUE_CARD), lw=lw)

    # Dynamic wave graphic across card
    c.save()
    c.new_path()
    c.arc(-w * 0.5 + r, -h * 0.5 + r, r, math.pi, 1.5 * math.pi)
    c.line_to(w * 0.5 - r, -h * 0.5)
    c.arc(w * 0.5 - r, -h * 0.5 + r, r, 1.5 * math.pi, 2 * math.pi)
    c.line_to(w * 0.5, h * 0.5 - r)
    c.arc(w * 0.5 - r, h * 0.5 - r, r, 0, 0.5 * math.pi)
    c.line_to(-w * 0.5 + r, h * 0.5)
    c.arc(-w * 0.5 + r, h * 0.5 - r, r, 0.5 * math.pi, math.pi)
    c.close_path()
    c.clip()

    # Wave shape inside card
    c.new_path()
    c.move_to(-w * 0.5, h * 0.10)
    c.curve_to(-w * 0.10, -h * 0.15, w * 0.10, h * 0.35, w * 0.5, h * 0.05)
    c.line_to(w * 0.5, h * 0.5)
    c.line_to(-w * 0.5, h * 0.5)
    c.close_path()
    c.set_source_rgb(*fc(style, BLUE_ACCENT))
    c.fill()
    c.restore()

    # Card outline re-stroked
    cv.rrect(-w * 0.5, -h * 0.5, w, h, r, fill=None, lw=lw)

    # EMV Gold Chip
    chip_x = -w * 0.32
    chip_y = -h * 0.18
    chip_w = s * 0.12
    chip_h = s * 0.09
    cv.rrect(chip_x, chip_y, chip_w, chip_h, s * 0.015, fill=fc(style, GOLD), lw=thin)
    # Chip circuit grid
    cv.line([(chip_x + chip_w * 0.5, chip_y), (chip_x + chip_w * 0.5, chip_y + chip_h)],
            w=thin * 0.8, color=INK)
    cv.line([(chip_x, chip_y + chip_h * 0.5), (chip_x + chip_w, chip_y + chip_h * 0.5)],
            w=thin * 0.8, color=INK)

    # Contactless wave arcs
    cw_x = chip_x + chip_w + s * 0.045
    cw_y = chip_y + chip_h * 0.5
    for rad_f in (0.02, 0.038, 0.056):
        c.new_path()
        c.arc(cw_x, cw_y, s * rad_f, -0.6, 0.6)
        c.set_source_rgb(*INK if style == "stickman" else PAPER)
        c.set_line_width(thin * 1.2)
        c.stroke()

    # Card number dots / pills
    dot_y = h * 0.08
    for grp in range(4):
        gx = -w * 0.34 + grp * (w * 0.22)
        for d in range(4):
            dx = gx + d * (s * 0.024)
            cv.ellipse(dx, dot_y, s * 0.007, s * 0.007,
                       fill=INK if style == "stickman" else PAPER, w=0)

    # Cardholder name line
    cv.line([(-w * 0.34, h * 0.30), (-w * 0.08, h * 0.30)], w=thin * 1.5,
            color=INK if style == "stickman" else PAPER)

    # Brand dual overlapping circles at bottom right
    c1_x = w * 0.22
    c2_x = w * 0.33
    circ_y = h * 0.26
    circ_r = s * 0.06
    cv.ellipse(c1_x, circ_y, circ_r, circ_r, fill=fc(style, RED_VIVID), w=thin)
    cv.ellipse(c2_x, circ_y, circ_r, circ_r, fill=fc(style, GOLD), w=thin)

    c.restore()


def prop_wallet(cv, x, y, s, style):
    """Rich leather bifold wallet with dollar bills and cards peeking out."""
    lw = _lw(s)
    thin = _thin(s)

    # Cash bills emerging from top
    bill1_pts = [
        (x - s * 0.24, y - s * 0.06),
        (x - s * 0.20, y - s * 0.26),
        (x + s * 0.12, y - s * 0.24),
        (x + s * 0.08, y - s * 0.06),
    ]
    _poly(cv, bill1_pts, fill=fc(style, GREEN_DARK), lw=lw)
    _text(cv, "$", x - s * 0.04, y - s * 0.17, s * 0.13, color=INK, bold=True)

    bill2_pts = [
        (x - s * 0.06, y - s * 0.06),
        (x - s * 0.02, y - s * 0.30),
        (x + s * 0.26, y - s * 0.25),
        (x + s * 0.22, y - s * 0.06),
    ]
    _poly(cv, bill2_pts, fill=fc(style, GREEN_BILL), lw=lw)

    # Outer wallet leather body
    w_w = s * 0.68
    w_h = s * 0.44
    cv.rrect(x - w_w * 0.5, y - s * 0.06, w_w, w_h, s * 0.045,
             fill=fc(style, BROWN_LEATHER), lw=lw)

    # Perimeter stitching line
    c = cv.c
    c.save()
    c.set_dash([s * 0.02, s * 0.015], 0)
    cv.rrect(x - w_w * 0.5 + s * 0.02, y - s * 0.06 + s * 0.02,
             w_w - s * 0.04, w_h - s * 0.04, s * 0.035,
             fill=None, lw=thin)
    c.restore()

    # Inner fold / card flap
    flap_w = w_w * 0.88
    flap_h = w_h * 0.72
    flap_x = x - flap_w * 0.5
    flap_y = y - s * 0.01
    cv.rrect(flap_x, flap_y, flap_w, flap_h, s * 0.025,
             fill=fc(style, BROWN_LIGHT), lw=lw)

    # Credit card peeking from slot
    card_x = x - flap_w * 0.40
    card_y = flap_y + s * 0.04
    cv.rrect(card_x, card_y, flap_w * 0.80, s * 0.08, s * 0.015,
             fill=fc(style, BLUE_CARD), lw=thin)

    # Card slot lip lines
    cv.line([(flap_x + s * 0.03, flap_y + s * 0.11), (flap_x + flap_w - s * 0.03, flap_y + s * 0.11)],
            w=lw * 0.8, color=INK)
    cv.line([(flap_x + s * 0.03, flap_y + s * 0.19), (flap_x + flap_w - s * 0.03, flap_y + s * 0.19)],
            w=lw * 0.8, color=INK)

    # Center spine crease
    cv.line([(x, y - s * 0.06), (x, y - s * 0.06 + w_h)], w=lw * 0.7, color=INK)


def prop_receipt(cv, x, y, s, style):
    """Long sales receipt slip with zig-zag tear and barcode."""
    lw = _lw(s)
    thin = _thin(s)
    w = s * 0.46
    h = s * 0.68

    c = cv.c
    c.save()
    c.translate(x, y)
    c.rotate(0.06)

    # Receipt polygon with zig-zag bottom
    teeth = 6
    tooth_w = w / teeth
    tooth_h = s * 0.035

    c.new_path()
    c.move_to(-w * 0.5, -h * 0.5)
    c.line_to(w * 0.5, -h * 0.5)
    c.line_to(w * 0.5, h * 0.5 - tooth_h)
    for i in range(teeth):
        tx = w * 0.5 - (i + 0.5) * tooth_w
        c.line_to(tx, h * 0.5)
        tx_next = w * 0.5 - (i + 1.0) * tooth_w
        c.line_to(tx_next, h * 0.5 - tooth_h)
    c.line_to(-w * 0.5, -h * 0.5)
    c.close_path()

    c.set_source_rgb(*fc(style, GRAY_LIGHT))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Header text & star
    cv.ellipse(0, -h * 0.40, s * 0.02, s * 0.02, fill=INK, w=0)
    _text(cv, "RECEIPT", 0, -h * 0.32, s * 0.065, color=INK, bold=True)

    # Separator
    cv.line([(-w * 0.38, -h * 0.25), (w * 0.38, -h * 0.25)], w=thin * 1.2, color=INK)

    # Item rows
    for row_idx, r_y in enumerate([-h * 0.17, -h * 0.09, -h * 0.01, h * 0.07]):
        cv.line([(-w * 0.36, r_y), (-w * 0.36 + s * (0.12 + row_idx * 0.02), r_y)],
                w=thin * 1.8, color=INK)
        cv.line([(w * 0.16, r_y), (w * 0.36, r_y)], w=thin * 1.8, color=INK)

    # Total double separator
    cv.line([(-w * 0.38, h * 0.15), (w * 0.38, h * 0.15)], w=lw * 0.8, color=INK)

    # Bold total
    _text(cv, "$ 84.50", 0, h * 0.22, s * 0.075, color=INK, bold=True)

    # Barcode
    bar_y = h * 0.33
    bar_h = s * 0.065
    bar_widths = [2.0, 1.0, 3.0, 1.5, 1.0, 3.5, 2.0, 1.0, 2.5, 1.5, 3.0, 1.0]
    curr_bx = -w * 0.34
    for bw in bar_widths:
        cv.line([(curr_bx, bar_y - bar_h * 0.5), (curr_bx, bar_y + bar_h * 0.5)],
                w=thin * bw * 0.7, color=INK)
        curr_bx += s * 0.025

    c.restore()


def prop_price_tag(cv, x, y, s, style):
    """Hanging merchandise swing-tag with string and bold price."""
    lw = _lw(s)
    thin = _thin(s)
    w = s * 0.44
    h = s * 0.62

    c = cv.c
    c.save()
    c.translate(x, y)
    c.rotate(-0.35)

    # Tag polygon with clipped top corners
    c_clip = w * 0.30
    pts = [
        (-w * 0.5 + c_clip, -h * 0.5),
        (w * 0.5 - c_clip, -h * 0.5),
        (w * 0.5, -h * 0.5 + c_clip),
        (w * 0.5, h * 0.5),
        (-w * 0.5, h * 0.5),
        (-w * 0.5, -h * 0.5 + c_clip),
    ]
    _poly(cv, pts, fill=fc(style, RED_VIVID), lw=lw)

    # Metallic eyelet hole at top
    hole_y = -h * 0.5 + c_clip * 0.8
    cv.ellipse(0, hole_y, s * 0.045, s * 0.045, fill=fc(style, PAPER), w=thin)
    cv.ellipse(0, hole_y, s * 0.025, s * 0.025, fill=INK, w=0)

    # Looping hanging twine / string
    c.new_path()
    c.move_to(0, hole_y - s * 0.03)
    c.curve_to(-s * 0.12, hole_y - s * 0.18, s * 0.08, -h * 0.5 - s * 0.22, 0, -h * 0.5 - s * 0.28)
    c.curve_to(-s * 0.06, -h * 0.5 - s * 0.22, -s * 0.04, hole_y - s * 0.15, 0, hole_y - s * 0.03)
    c.set_source_rgb(*INK)
    c.set_line_width(lw * 0.8)
    c.stroke()

    # White label patch on tag
    patch_w = w * 0.78
    patch_h = h * 0.48
    cv.rrect(-patch_w * 0.5, -h * 0.10, patch_w, patch_h, s * 0.03,
             fill=fc(style, PAPER), lw=thin)

    # Price inside patch
    _text(cv, "$", 0, -h * 0.01, s * 0.13, color=INK, bold=True)
    _text(cv, "49", 0, h * 0.18, s * 0.18, color=INK, bold=True)

    c.restore()


def prop_bank(cv, x, y, s, style):
    """Classical Neoclassical bank building with pediment and columns."""
    lw = _lw(s)
    thin = _thin(s)

    # Building base dimensions
    ped_base_y = y - s * 0.14
    steps_top_y = y + s * 0.22

    # Background wall behind columns
    wall_w = s * 0.64
    cv.rrect(x - wall_w * 0.5, ped_base_y, wall_w, steps_top_y - ped_base_y, s * 0.02,
             fill=fc(style, shade(GRAY_LIGHT, 0.88)), lw=lw)

    # Double mahogany entrance door in center
    door_w = s * 0.18
    door_h = s * 0.22
    door_y = steps_top_y - door_h
    cv.rrect(x - door_w * 0.5, door_y, door_w, door_h, s * 0.015,
             fill=fc(style, BROWN_DARK), lw=lw * 0.8)
    # Door division & panels
    cv.line([(x, door_y), (x, door_y + door_h)], w=thin * 1.2, color=INK)
    cv.rrect(x - door_w * 0.42, door_y + s * 0.03, door_w * 0.36, door_h * 0.38,
             s * 0.01, fill=fc(style, BROWN_LEATHER), lw=thin)
    cv.rrect(x + door_w * 0.06, door_y + s * 0.03, door_w * 0.36, door_h * 0.38,
             s * 0.01, fill=fc(style, BROWN_LEATHER), lw=thin)

    # 4 Classical Columns
    col_w = s * 0.065
    col_h = steps_top_y - (ped_base_y + s * 0.05)
    col_top = ped_base_y + s * 0.05
    col_xs = [x - s * 0.26, x - s * 0.088, x + s * 0.088, x + s * 0.26]

    for cx in col_xs:
        # Capital
        cv.rrect(cx - col_w * 0.65, col_top, col_w * 1.3, s * 0.025, s * 0.008,
                 fill=fc(style, GRAY_MID), lw=thin)
        # Shaft
        cv.rrect(cx - col_w * 0.5, col_top + s * 0.02, col_w, col_h - s * 0.04,
                 s * 0.005, fill=fc(style, GRAY_LIGHT), lw=lw * 0.85)
        # Flute lines
        cv.line([(cx, col_top + s * 0.03), (cx, col_top + col_h - s * 0.03)],
                w=thin * 0.7, color=INK)
        # Base
        cv.rrect(cx - col_w * 0.65, col_top + col_h - s * 0.025, col_w * 1.3, s * 0.025,
                 s * 0.008, fill=fc(style, GRAY_MID), lw=thin)

    # Entablature beam
    cv.rrect(x - s * 0.35, ped_base_y, s * 0.70, s * 0.05, s * 0.01,
             fill=fc(style, GRAY_LIGHT), lw=lw)

    # Pediment triangle on top
    ped_pts = [
        (x - s * 0.35, ped_base_y),
        (x, y - s * 0.34),
        (x + s * 0.35, ped_base_y),
    ]
    _poly(cv, ped_pts, fill=fc(style, GRAY_LIGHT), lw=lw)

    # Pediment medallion
    cv.ellipse(x, y - s * 0.22, s * 0.055, s * 0.055, fill=fc(style, GOLD), w=thin)
    _text(cv, "$", x, y - s * 0.22, s * 0.07, color=INK, bold=True)

    # 3 Stepped Stairs at bottom
    st_height = s * 0.038
    for st_idx, st_w in enumerate([0.72, 0.78, 0.84]):
        st_y = steps_top_y + st_idx * st_height
        cv.rrect(x - s * st_w * 0.5, st_y, s * st_w, st_height, s * 0.008,
                 fill=fc(style, GRAY_LIGHT), lw=lw)


def prop_atm(cv, x, y, s, style):
    """ATM cash machine kiosk with glowing screen and cash dispensing."""
    lw = _lw(s)
    thin = _thin(s)

    # Main kiosk body
    k_w = s * 0.52
    k_h = s * 0.70
    k_x = x - k_w * 0.5
    k_y = y - k_h * 0.5
    cv.rrect(k_x, k_y, k_w, k_h, s * 0.04, fill=fc(style, GRAY_DARK), lw=lw)

    # Top illuminated sign "ATM"
    sign_w = k_w * 0.84
    sign_h = s * 0.11
    sign_x = x - sign_w * 0.5
    sign_y = k_y + s * 0.04
    cv.rrect(sign_x, sign_y, sign_w, sign_h, s * 0.02, fill=fc(style, rgb("#2563EB")), lw=lw)
    _text(cv, "ATM", x, sign_y + sign_h * 0.5, s * 0.08,
          color=INK if style == "stickman" else PAPER, bold=True)

    # Recessed monitor screen
    scr_w = k_w * 0.84
    scr_h = s * 0.20
    scr_x = x - scr_w * 0.5
    scr_y = sign_y + sign_h + s * 0.04
    cv.rrect(scr_x, scr_y, scr_w, scr_h, s * 0.02,
             fill=fc(style, rgb("#0284C7")), lw=lw)

    # Screen UI graphics
    _text(cv, "$$$", x, scr_y + scr_h * 0.40, s * 0.09,
          color=INK if style == "stickman" else PAPER, bold=True)
    cv.line([(x - scr_w * 0.30, scr_y + scr_h * 0.75), (x + scr_w * 0.30, scr_y + scr_h * 0.75)],
            w=thin * 1.5, color=INK if style == "stickman" else PAPER)

    # Keypad (left)
    kp_w = s * 0.18
    kp_h = s * 0.12
    kp_x = k_x + s * 0.05
    kp_y = scr_y + scr_h + s * 0.04
    cv.rrect(kp_x, kp_y, kp_w, kp_h, s * 0.015, fill=fc(style, GRAY_MID), lw=thin)
    for row in range(3):
        for col in range(3):
            bx = kp_x + s * (0.025 + col * 0.045)
            by = kp_y + s * (0.025 + row * 0.035)
            cv.ellipse(bx, by, s * 0.012, s * 0.01, fill=INK, w=0)

    # Card slot (right)
    cs_w = s * 0.15
    cs_h = s * 0.03
    cs_x = k_x + k_w - s * 0.20
    cs_y = kp_y + s * 0.03
    cv.rrect(cs_x, cs_y, cs_w, cs_h, s * 0.01, fill=INK, lw=0)
    cv.ellipse(cs_x + cs_w * 0.5, cs_y - s * 0.02, s * 0.015, s * 0.015,
               fill=fc(style, rgb("#22C55E")), w=thin)

    # Cash dispenser slot below
    disp_w = k_w * 0.74
    disp_h = s * 0.035
    disp_x = x - disp_w * 0.5
    disp_y = kp_y + kp_h + s * 0.04
    cv.rrect(disp_x, disp_y, disp_w, disp_h, s * 0.01, fill=INK, lw=0)

    # Banknote sticking out of dispenser
    bill_w = disp_w * 0.85
    bill_h = s * 0.10
    bill_x = x - bill_w * 0.5
    bill_y = disp_y + disp_h * 0.5
    cv.rrect(bill_x, bill_y, bill_w, bill_h, s * 0.015,
             fill=fc(style, GREEN_BILL), lw=lw)
    _text(cv, "$", x, bill_y + bill_h * 0.5, s * 0.09, color=INK, bold=True)


def prop_gift(cv, x, y, s, style):
    """3D gift box with lid and big horizontal ribbon bow."""
    lw = _lw(s)
    thin = _thin(s)

    # Box base
    b_w = s * 0.54
    b_h = s * 0.38
    b_x = x - b_w * 0.5
    b_y = y - s * 0.06
    cv.rrect(b_x, b_y, b_w, b_h, s * 0.02, fill=fc(style, RED_VIVID), lw=lw)

    # Vertical ribbon on box base
    rib_w = s * 0.11
    cv.rrect(x - rib_w * 0.5, b_y, rib_w, b_h, 0, fill=fc(style, GOLD), lw=thin)
    cv.line([(x - rib_w * 0.5, b_y), (x - rib_w * 0.5, b_y + b_h)], w=thin, color=INK)
    cv.line([(x + rib_w * 0.5, b_y), (x + rib_w * 0.5, b_y + b_h)], w=thin, color=INK)

    # Horizontal ribbon on box base
    rib_h = s * 0.09
    rib_y = b_y + b_h * 0.45
    cv.rrect(b_x, rib_y, b_w, rib_h, 0, fill=fc(style, GOLD), lw=thin)
    cv.line([(b_x, rib_y), (b_x + b_w, rib_y)], w=thin, color=INK)
    cv.line([(b_x, rib_y + rib_h), (b_x + b_w, rib_y + rib_h)], w=thin, color=INK)

    # Box Lid (slightly wider)
    lid_w = s * 0.60
    lid_h = s * 0.10
    lid_x = x - lid_w * 0.5
    lid_y = b_y - lid_h + s * 0.01
    cv.rrect(lid_x, lid_y, lid_w, lid_h, s * 0.02,
             fill=fc(style, shade(RED_VIVID, 1.1)), lw=lw)

    # Vertical ribbon on lid
    cv.rrect(x - rib_w * 0.5, lid_y, rib_w, lid_h, 0, fill=fc(style, GOLD), lw=thin)
    cv.line([(x - rib_w * 0.5, lid_y), (x - rib_w * 0.5, lid_y + lid_h)], w=thin, color=INK)
    cv.line([(x + rib_w * 0.5, lid_y), (x + rib_w * 0.5, lid_y + lid_h)], w=thin, color=INK)

    # Luxurious horizontal ribbon bow loops on top
    knot_y = lid_y - s * 0.02

    # Left loop (flaring out to left)
    pts_left = [
        (x, knot_y),
        (x - s * 0.12, knot_y - s * 0.14),
        (x - s * 0.25, knot_y - s * 0.08),
        (x - s * 0.20, knot_y + s * 0.04),
        (x, knot_y),
    ]
    cv.shape(pts_left, fill=fc(style, GOLD), w=lw, close=True)

    # Right loop (flaring out to right)
    pts_right = [
        (x, knot_y),
        (x + s * 0.12, knot_y - s * 0.14),
        (x + s * 0.25, knot_y - s * 0.08),
        (x + s * 0.20, knot_y + s * 0.04),
        (x, knot_y),
    ]
    cv.shape(pts_right, fill=fc(style, GOLD), w=lw, close=True)

    # Hanging ribbon tails with V-notches
    pts_tail_l = [
        (x - s * 0.03, knot_y),
        (x - s * 0.14, knot_y + s * 0.22),
        (x - s * 0.09, knot_y + s * 0.18),
        (x - s * 0.04, knot_y + s * 0.22),
        (x, knot_y),
    ]
    cv.shape(pts_tail_l, fill=fc(style, shade(GOLD, 0.9)), w=lw, close=True)

    pts_tail_r = [
        (x, knot_y),
        (x + s * 0.04, knot_y + s * 0.22),
        (x + s * 0.09, knot_y + s * 0.18),
        (x + s * 0.14, knot_y + s * 0.22),
        (x + s * 0.03, knot_y),
    ]
    cv.shape(pts_tail_r, fill=fc(style, shade(GOLD, 0.9)), w=lw, close=True)

    # Center knot
    cv.ellipse(x, knot_y, s * 0.055, s * 0.045, fill=fc(style, GOLD_SHADOW), w=lw)


def prop_shopping_bag(cv, x, y, s, style):
    """Paper retail shopping bag with dual rope handles and tissue paper."""
    lw = _lw(s)
    thin = _thin(s)

    f_w = s * 0.46
    f_h = s * 0.48
    f_x = x - s * 0.25
    f_y = y - s * 0.14

    g1_x = f_x + f_w * 0.28
    g2_x = f_x + f_w * 0.72
    g_y = f_y + s * 0.06

    # Back rope handle (drawn first so it attaches inside rear rim)
    c = cv.c
    c.new_path()
    c.move_to(g1_x + s * 0.07, g_y - s * 0.035)
    c.curve_to(g1_x + s * 0.03, f_y - s * 0.26, g2_x + s * 0.11, f_y - s * 0.26, g2_x + s * 0.07, g_y - s * 0.035)
    c.set_source_rgb(*INK)
    c.set_line_width(lw * 0.85)
    c.stroke()

    # Tissue paper puffing out of the top opening
    pts_tissue = [
        (x - s * 0.16, y - s * 0.12),
        (x - s * 0.18, y - s * 0.28),
        (x - s * 0.08, y - s * 0.22),
        (x, y - s * 0.30),
        (x + s * 0.10, y - s * 0.24),
        (x + s * 0.18, y - s * 0.28),
        (x + s * 0.16, y - s * 0.12),
    ]
    cv.shape(pts_tissue, fill=fc(style, GOLD_LIGHT), w=lw, close=True)

    # Bag front face
    cv.rrect(f_x, f_y, f_w, f_h, s * 0.02, fill=fc(style, rgb("#EA580C")), lw=lw)

    # Bag 3D side gusset (perspective fold to right)
    pts_side = [
        (f_x + f_w, f_y),
        (f_x + f_w + s * 0.14, f_y - s * 0.07),
        (f_x + f_w + s * 0.14, f_y + f_h - s * 0.07),
        (f_x + f_w, f_y + f_h),
    ]
    _poly(cv, pts_side, fill=fc(style, shade(rgb("#EA580C"), 0.82)), lw=lw)

    # Side accordion crease line
    _poly_line(cv, [
        (f_x + f_w + s * 0.07, f_y - s * 0.035),
        (f_x + f_w + s * 0.07, f_y + f_h - s * 0.035)
    ], lw=thin, color=INK)

    # Front emblem
    em_y = f_y + f_h * 0.46
    em_r = s * 0.075
    cv.ellipse(f_x + f_w * 0.5, em_y, em_r, em_r, fill=fc(style, PAPER), w=thin)
    _text(cv, "%", f_x + f_w * 0.5, em_y, s * 0.10, color=INK, bold=True)

    # Front grommets for handles
    cv.ellipse(g1_x, g_y, s * 0.02, s * 0.02, fill=INK, w=0)
    cv.ellipse(g2_x, g_y, s * 0.02, s * 0.02, fill=INK, w=0)

    # Front arching rope handle
    c.new_path()
    c.move_to(g1_x, g_y)
    c.curve_to(g1_x - s * 0.04, f_y - s * 0.24, g2_x + s * 0.04, f_y - s * 0.24, g2_x, g_y)
    c.set_source_rgb(*INK)
    c.set_line_width(lw * 0.9)
    c.stroke()


def prop_shopping_cart(cv, x, y, s, style):
    """Supermarket wire shopping trolley with red handle and wheels."""
    lw = _lw(s)
    thin = _thin(s)

    # Wire basket points
    p_rear_top = (x - s * 0.22, y - s * 0.18)
    p_front_top = (x + s * 0.26, y - s * 0.14)
    p_front_bot = (x + s * 0.18, y + s * 0.08)
    p_rear_bot = (x - s * 0.18, y + s * 0.08)

    # Basket fill & outline
    _poly(cv, [p_rear_top, p_front_top, p_front_bot, p_rear_bot],
          fill=fc(style, shade(GRAY_LIGHT, 0.95)), lw=lw)

    # Basket wire grid
    for f in (0.33, 0.66):
        y_l = p_rear_top[1] + (p_rear_bot[1] - p_rear_top[1]) * f
        y_r = p_front_top[1] + (p_front_bot[1] - p_front_top[1]) * f
        x_l = p_rear_top[0] + (p_rear_bot[0] - p_rear_top[0]) * f
        x_r = p_front_top[0] + (p_front_bot[0] - p_front_top[0]) * f
        cv.line([(x_l, y_l), (x_r, y_r)], w=thin, color=INK)

    for f in (0.25, 0.5, 0.75):
        x_t = p_rear_top[0] + (p_front_top[0] - p_rear_top[0]) * f
        y_t = p_rear_top[1] + (p_front_top[1] - p_rear_top[1]) * f
        x_b = p_rear_bot[0] + (p_front_bot[0] - p_rear_bot[0]) * f
        y_b = p_rear_bot[1] + (p_front_bot[1] - p_rear_bot[1]) * f
        cv.line([(x_t, y_t), (x_b, y_b)], w=thin, color=INK)

    # Handlebar assembly extending up-left from rear top
    h_grip_end = (x - s * 0.32, y - s * 0.24)
    cv.line([p_rear_top, h_grip_end], w=lw, color=INK)
    # Red plastic handle grip
    cv.ellipse(h_grip_end[0], h_grip_end[1], s * 0.035, s * 0.055,
               fill=fc(style, RED_VIVID), w=lw * 0.8, rot=0.4)

    # Lower tubular chassis frame
    wh_rear = (x - s * 0.14, y + s * 0.22)
    wh_front = (x + s * 0.18, y + s * 0.22)

    # Chassis tubes
    cv.line([p_rear_bot, wh_rear], w=lw, color=INK)
    cv.line([wh_rear, wh_front], w=lw, color=INK)
    cv.line([p_front_bot, wh_front], w=lw, color=INK)

    # Bottom wire rack
    cv.line([(x - s * 0.10, y + s * 0.18), (x + s * 0.14, y + s * 0.18)], w=thin * 1.5, color=INK)

    # 2 Rubber Wheels
    for wx, wy in (wh_rear, wh_front):
        cv.ellipse(wx, wy, s * 0.065, s * 0.065, fill=INK, w=0)
        cv.ellipse(wx, wy, s * 0.025, s * 0.025, fill=fc(style, GRAY_LIGHT), w=thin)


def prop_safe(cv, x, y, s, style):
    """Heavy steel bank vault floor safe with combination dial and turn wheel."""
    lw = _lw(s)
    thin = _thin(s)

    # Heavy corner feet
    foot_w = s * 0.11
    foot_h = s * 0.06
    cv.rrect(x - s * 0.28, y + s * 0.28, foot_w, foot_h, s * 0.015, fill=INK, lw=0)
    cv.rrect(x + s * 0.17, y + s * 0.28, foot_w, foot_h, s * 0.015, fill=INK, lw=0)

    # Outer safe body
    box_s = s * 0.64
    cv.rrect(x - box_s * 0.5, y - box_s * 0.5, box_s, box_s, s * 0.045,
             fill=fc(style, GRAY_DARK), lw=lw)

    # Inner recessed door
    door_s = s * 0.52
    door_x = x - door_s * 0.5
    door_y = y - door_s * 0.5
    cv.rrect(door_x, door_y, door_s, door_s, s * 0.025,
             fill=fc(style, GRAY_STEEL), lw=lw)

    # Heavy door hinges on right
    for hy in (y - s * 0.16, y + s * 0.16):
        cv.rrect(x + door_s * 0.5 - s * 0.02, hy - s * 0.045, s * 0.055, s * 0.09,
                 s * 0.015, fill=fc(style, GRAY_MID), lw=thin * 1.5)

    # 3-spoke turn wheel / vault handle on left
    wh_x = x - s * 0.08
    wh_y = y + s * 0.04
    spoke_len = s * 0.09
    for ang in (0, 2 * math.pi / 3, 4 * math.pi / 3):
        sx = wh_x + spoke_len * math.cos(ang)
        sy = wh_y + spoke_len * math.sin(ang)
        cv.line([(wh_x, wh_y), (sx, sy)], w=lw * 1.1, color=INK)
        cv.ellipse(sx, sy, s * 0.025, s * 0.025, fill=fc(style, GRAY_MID), w=thin)
    cv.ellipse(wh_x, wh_y, s * 0.045, s * 0.045, fill=fc(style, GRAY_DARK), w=thin)

    # Combination Dial (top right)
    dial_x = x + s * 0.08
    dial_y = y - s * 0.06
    dial_r = s * 0.085
    cv.ellipse(dial_x, dial_y, dial_r, dial_r, fill=fc(style, GRAY_MID), w=lw)
    # Dial tick marks
    for i in range(12):
        tang = i * math.pi / 6
        x1 = dial_x + (dial_r - s * 0.015) * math.cos(tang)
        y1 = dial_y + (dial_r - s * 0.015) * math.sin(tang)
        x2 = dial_x + dial_r * math.cos(tang)
        y2 = dial_y + dial_r * math.sin(tang)
        cv.line([(x1, y1), (x2, y2)], w=thin * 0.8, color=INK)
    # Center knob
    cv.ellipse(dial_x, dial_y, dial_r * 0.5, dial_r * 0.5,
               fill=fc(style, GRAY_DARK), w=thin)

    # Keyhole below dial
    cv.ellipse(dial_x, y + s * 0.12, s * 0.016, s * 0.016, fill=INK, w=0)
    _poly(cv, [(dial_x - s * 0.009, y + s * 0.12), (dial_x + s * 0.009, y + s * 0.12),
               (dial_x + s * 0.013, y + s * 0.17), (dial_x - s * 0.013, y + s * 0.17)],
          fill=INK, lw=0)


def prop_calculator(cv, x, y, s, style):
    """Desktop office calculator with LCD screen and colorful button matrix."""
    lw = _lw(s)
    thin = _thin(s)

    w = s * 0.54
    h = s * 0.70
    bx = x - w * 0.5
    by = y - h * 0.5

    # Casing
    cv.rrect(bx, by, w, h, s * 0.05, fill=fc(style, GRAY_DARK), lw=lw)

    # Solar cell strip
    solar_w = w * 0.76
    solar_h = s * 0.04
    cv.rrect(x - solar_w * 0.5, by + s * 0.04, solar_w, solar_h, s * 0.01,
             fill=fc(style, rgb("#78350F")), lw=thin)
    for sx_i in range(1, 4):
        cx_s = x - solar_w * 0.5 + sx_i * (solar_w * 0.25)
        cv.line([(cx_s, by + s * 0.04), (cx_s, by + s * 0.04 + solar_h)], w=thin * 0.7, color=INK)

    # LCD screen
    scr_w = w * 0.82
    scr_h = s * 0.13
    scr_x = x - scr_w * 0.5
    scr_y = by + s * 0.10
    cv.rrect(scr_x, scr_y, scr_w, scr_h, s * 0.02,
             fill=fc(style, rgb("#A7F3D0")), lw=lw)

    # LCD digits
    _text(cv, "1234.56", scr_x + scr_w * 0.5, scr_y + scr_h * 0.52, s * 0.08,
          color=INK, bold=True)

    # Button grid: 4 columns x 4 rows
    cols = 4
    rows = 4
    grid_top = scr_y + scr_h + s * 0.04
    btn_gap = s * 0.018
    btn_w = (scr_w - (cols - 1) * btn_gap) / cols
    btn_h = s * 0.075

    btn_labels = [
        ["C", "±", "%", "÷"],
        ["7", "8", "9", "×"],
        ["4", "5", "6", "-"],
        ["1", "2", "3", "+"],
    ]

    for r_idx in range(rows):
        for c_idx in range(cols):
            btn_x = scr_x + c_idx * (btn_w + btn_gap)
            btn_y = grid_top + r_idx * (btn_h + btn_gap)

            if r_idx == 0 and c_idx == 0:
                b_col = RED_VIVID
            elif c_idx == 3:
                b_col = rgb("#EA580C")
            else:
                b_col = GRAY_LIGHT

            cv.rrect(btn_x, btn_y, btn_w, btn_h, s * 0.015,
                     fill=fc(style, b_col), lw=thin * 1.2)
            lbl = btn_labels[r_idx][c_idx]
            lbl_col = PAPER if (style != "stickman" and (b_col in (RED_VIVID, rgb("#EA580C")))) else INK
            _text(cv, lbl, btn_x + btn_w * 0.5, btn_y + btn_h * 0.5, s * 0.045,
                  color=lbl_col, bold=True)


def prop_invoice(cv, x, y, s, style):
    """Invoice document with line items, bold total, and big green PAID stamp."""
    lw = _lw(s)
    thin = _thin(s)

    w = s * 0.54
    h = s * 0.70

    c = cv.c
    c.save()
    c.translate(x, y)
    c.rotate(-0.04)

    # Document sheet with dog-ear fold at top-right
    ear = s * 0.08
    pts_sheet = [
        (-w * 0.5, -h * 0.5),
        (w * 0.5 - ear, -h * 0.5),
        (w * 0.5, -h * 0.5 + ear),
        (w * 0.5, h * 0.5),
        (-w * 0.5, h * 0.5),
    ]
    _poly(cv, pts_sheet, fill=fc(style, GRAY_LIGHT), lw=lw)

    # Dog-ear triangle fold
    pts_ear = [
        (w * 0.5 - ear, -h * 0.5),
        (w * 0.5 - ear, -h * 0.5 + ear),
        (w * 0.5, -h * 0.5 + ear),
    ]
    _poly(cv, pts_ear, fill=fc(style, shade(GRAY_LIGHT, 0.85)), lw=thin)

    # Top header bar
    _text(cv, "INVOICE", -w * 0.16, -h * 0.38, s * 0.07, color=INK, bold=True)
    cv.ellipse(w * 0.30, -h * 0.38, s * 0.035, s * 0.035, fill=fc(style, GOLD), w=thin)
    _text(cv, "$", w * 0.30, -h * 0.38, s * 0.045, color=INK, bold=True)

    # Header separator
    cv.line([(-w * 0.40, -h * 0.28), (w * 0.40, -h * 0.28)], w=lw * 0.8, color=INK)

    # Customer info lines
    for f in (-h * 0.22, -h * 0.16):
        cv.line([(-w * 0.40, f), (-w * 0.05, f)], w=thin * 1.5, color=INK)

    # Line item rows
    for row_y in (-h * 0.06, h * 0.04, h * 0.14):
        cv.line([(-w * 0.40, row_y), (-w * 0.10, row_y)], w=thin * 1.8, color=INK)
        cv.line([(w * 0.15, row_y), (w * 0.40, row_y)], w=thin * 1.8, color=INK)

    # Total box
    tot_y = h * 0.26
    cv.rrect(w * 0.02, tot_y - s * 0.05, w * 0.40, s * 0.10, s * 0.015,
             fill=fc(style, PAPER), lw=thin * 1.5)
    _text(cv, "$ 2,450", w * 0.22, tot_y, s * 0.065, color=INK, bold=True)

    # Big vibrant PAID stamp across center (filled with white/paper to mask background lines)
    c.save()
    c.translate(0, -h * 0.01)
    c.rotate(-0.30)

    stamp_w = s * 0.38
    stamp_h = s * 0.13
    # Solid backing fill to cover table lines cleanly
    cv.rrect(-stamp_w * 0.5, -stamp_h * 0.5, stamp_w, stamp_h, s * 0.02,
             fill=fc(style, PAPER), lw=lw)
    # Inner border
    cv.rrect(-stamp_w * 0.5 + s * 0.012, -stamp_h * 0.5 + s * 0.012,
             stamp_w - s * 0.024, stamp_h - s * 0.024, s * 0.015,
             fill=None, lw=thin * 1.2)

    stamp_col = INK if style == "stickman" else GREEN_DARK
    _text(cv, "PAID", 0, 0, s * 0.095, color=stamp_col, bold=True)
    c.restore()

    c.restore()


def prop_chart_up(cv, x, y, s, style):
    """Rising stock market chart with upward green arrow."""
    lw = _lw(s)
    thin = _thin(s)

    # Axes origin and limits
    ox = x - s * 0.34
    oy = y + s * 0.26
    x_max = x + s * 0.34
    y_min = y - s * 0.28

    # Background grid lines
    for gf in (0.25, 0.5, 0.75):
        gy = oy - (oy - y_min) * gf
        cv.line([(ox, gy), (x_max, gy)], w=thin * 0.8, color=fc(style, shade(GRAY_LIGHT, 0.8)))

    # Axes
    cv.line([(ox, oy), (ox, y_min)], w=lw, color=INK)  # Y-axis
    cv.line([(ox, oy), (x_max, oy)], w=lw, color=INK)  # X-axis

    # Y-axis top arrow
    _poly(cv, [(ox, y_min - s * 0.03), (ox - s * 0.02, y_min), (ox + s * 0.02, y_min)],
          fill=INK, lw=0)
    # X-axis right arrow
    _poly(cv, [(x_max + s * 0.03, oy), (x_max, oy - s * 0.02), (x_max, oy + s * 0.02)],
          fill=INK, lw=0)

    # Chart line points
    pts = [
        (ox + s * 0.06, oy - s * 0.08),
        (ox + s * 0.20, oy - s * 0.18),
        (ox + s * 0.34, oy - s * 0.14),
        (ox + s * 0.48, oy - s * 0.32),
        (ox + s * 0.60, oy - s * 0.44),
    ]

    # Shaded polygon under curve
    poly_pts = [(pts[0][0], oy)] + pts + [(pts[-1][0], oy)]
    _poly(cv, poly_pts, fill=fc(style, GREEN_MINT), lw=0)

    # Bold trendline
    line_col = INK if style == "stickman" else GREEN_BILL
    _poly_line(cv, pts, lw=lw * 1.4, color=line_col)

    # Upward green arrow at peak
    last_p = pts[-1]
    prev_p = pts[-2]
    ang = math.atan2(last_p[1] - prev_p[1], last_p[0] - prev_p[0])

    c = cv.c
    c.save()
    c.translate(last_p[0], last_p[1])
    c.rotate(ang)
    arr_len = s * 0.09
    arr_w = s * 0.055
    pts_arr = [(arr_len, 0), (0, -arr_w), (arr_len * 0.25, 0), (0, arr_w)]
    _poly(cv, pts_arr, fill=line_col, lw=lw * 0.7)
    c.restore()

    # Data point circles
    for px, py in pts[:-1]:
        cv.ellipse(px, py, s * 0.025, s * 0.025, fill=fc(style, PAPER), w=lw * 0.8)


def prop_chart_down(cv, x, y, s, style):
    """Falling stock market graph with steep plunging red arrow."""
    lw = _lw(s)
    thin = _thin(s)

    # Axes origin and limits
    ox = x - s * 0.34
    oy = y + s * 0.26
    x_max = x + s * 0.34
    y_min = y - s * 0.28

    # Background grid lines
    for gf in (0.25, 0.5, 0.75):
        gy = oy - (oy - y_min) * gf
        cv.line([(ox, gy), (x_max, gy)], w=thin * 0.8, color=fc(style, shade(GRAY_LIGHT, 0.8)))

    # Axes
    cv.line([(ox, oy), (ox, y_min)], w=lw, color=INK)  # Y-axis
    cv.line([(ox, oy), (x_max, oy)], w=lw, color=INK)  # X-axis

    # Y-axis top arrow
    _poly(cv, [(ox, y_min - s * 0.03), (ox - s * 0.02, y_min), (ox + s * 0.02, y_min)],
          fill=INK, lw=0)
    # X-axis right arrow
    _poly(cv, [(x_max + s * 0.03, oy), (x_max, oy - s * 0.02), (x_max, oy + s * 0.02)],
          fill=INK, lw=0)

    # Chart line points (plunging downward)
    pts = [
        (ox + s * 0.06, y_min + s * 0.08),
        (ox + s * 0.20, y_min + s * 0.16),
        (ox + s * 0.34, y_min + s * 0.12),
        (ox + s * 0.48, y_min + s * 0.32),
        (ox + s * 0.60, oy - s * 0.06),
    ]

    # Shaded polygon under curve
    poly_pts = [(pts[0][0], oy)] + pts + [(pts[-1][0], oy)]
    _poly(cv, poly_pts, fill=fc(style, RED_LIGHT), lw=0)

    # Bold trendline
    line_col = INK if style == "stickman" else RED_VIVID
    _poly_line(cv, pts, lw=lw * 1.4, color=line_col)

    # Steep downward red arrow at end
    last_p = pts[-1]
    prev_p = pts[-2]
    ang = math.atan2(last_p[1] - prev_p[1], last_p[0] - prev_p[0])

    c = cv.c
    c.save()
    c.translate(last_p[0], last_p[1])
    c.rotate(ang)
    arr_len = s * 0.09
    arr_w = s * 0.055
    pts_arr = [(arr_len, 0), (0, -arr_w), (arr_len * 0.25, 0), (0, arr_w)]
    _poly(cv, pts_arr, fill=line_col, lw=lw * 0.7)
    c.restore()

    # Data point circles
    for px, py in pts[:-1]:
        cv.ellipse(px, py, s * 0.025, s * 0.025, fill=fc(style, PAPER), w=lw * 0.8)


def prop_bar_chart(cv, x, y, s, style):
    """Vertical bar chart with growing columns and upward trendline."""
    lw = _lw(s)
    thin = _thin(s)

    base_y = y + s * 0.24
    ox = x - s * 0.34
    x_max = x + s * 0.34

    # Baseline & Y axis
    cv.line([(ox, base_y), (x_max, base_y)], w=lw, color=INK)
    cv.line([(ox, base_y), (ox, y - s * 0.26)], w=lw, color=INK)

    # 4 Columns of increasing height
    bar_w = s * 0.115
    bar_gap = s * 0.04
    bars_data = [
        (s * 0.16, rgb("#60A5FA")),
        (s * 0.26, rgb("#3B82F6")),
        (s * 0.36, rgb("#2563EB")),
        (s * 0.46, rgb("#10B981")),
    ]

    trend_pts = []
    for idx, (bh, bcol) in enumerate(bars_data):
        bx = ox + s * 0.06 + idx * (bar_w + bar_gap)
        by = base_y - bh
        cv.rrect(bx, by, bar_w, bh, s * 0.015, fill=fc(style, bcol), lw=lw)
        trend_pts.append((bx + bar_w * 0.5, by - s * 0.04))

    # Curved trendline arching over bars
    c = cv.c
    c.save()
    c.set_dash([s * 0.015, s * 0.015], 0)
    _poly_line(cv, trend_pts, lw=thin * 1.8, color=INK)
    c.restore()

    # Arrow on trendline end
    last_pt = trend_pts[-1]
    prev_pt = trend_pts[-2]
    ang = math.atan2(last_pt[1] - prev_pt[1], last_pt[0] - prev_pt[0])
    c.save()
    c.translate(last_pt[0], last_pt[1])
    c.rotate(ang)
    _poly(cv, [(s * 0.05, 0), (0, -s * 0.03), (0, s * 0.03)], fill=INK, lw=0)
    c.restore()


def prop_pie_chart(cv, x, y, s, style):
    """3D tilted circular pie chart with a clean exploded focal wedge."""
    lw = _lw(s)
    rx = s * 0.33
    ry = s * 0.18
    dy = s * 0.08
    cy = y - dy * 0.4

    # Slices:
    # A (Blue): [0.35*pi, 0.90*pi]
    # B (Green): [0.90*pi, 1.65*pi]
    # C (Red): [1.65*pi, 2.05*pi]
    # Exploded D (Gold): [0.05*pi, 0.35*pi] (pulled out towards front-right)

    c = cv.c

    # Main Pie:
    # 1. Front-facing outer cylinder rim: angles in [0.35*pi, pi]
    s_start = 0.35 * math.pi
    s_end = math.pi
    c.new_path()
    c.move_to(x + rx * math.cos(s_start), cy + ry * math.sin(s_start))
    c.line_to(x + rx * math.cos(s_start), cy + dy + ry * math.sin(s_start))
    steps = 20
    for st in range(steps + 1):
        ang = s_start + (s_end - s_start) * st / steps
        c.line_to(x + rx * math.cos(ang), cy + dy + ry * math.sin(ang))
    c.line_to(x + rx * math.cos(s_end), cy + ry * math.sin(s_end))
    for st in range(steps + 1):
        ang = s_end - (s_end - s_start) * st / steps
        c.line_to(x + rx * math.cos(ang), cy + ry * math.sin(ang))
    c.close_path()
    c.set_source_rgb(*fc(style, shade(BLUE_CARD, 0.75)))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # 2. Main pie radial cut wall at 0.35*pi
    a_cut = 0.35 * math.pi
    _poly(cv, [
        (x, cy),
        (x + rx * math.cos(a_cut), cy + ry * math.sin(a_cut)),
        (x + rx * math.cos(a_cut), cy + dy + ry * math.sin(a_cut)),
        (x, cy + dy),
    ], fill=fc(style, shade(BLUE_CARD, 0.85)), lw=lw)

    # 3. Main pie top sectors
    main_sectors = [
        (0.35 * math.pi, 0.90 * math.pi, BLUE_CARD),
        (0.90 * math.pi, 1.65 * math.pi, rgb("#10B981")),
        (1.65 * math.pi, 2.05 * math.pi, RED_VIVID),
    ]

    for a1, a2, col in main_sectors:
        c.new_path()
        c.move_to(x, cy)
        steps = 18
        for st in range(steps + 1):
            ang = a1 + (a2 - a1) * st / steps
            c.line_to(x + rx * math.cos(ang), cy + ry * math.sin(ang))
        c.close_path()
        c.set_source_rgb(*fc(style, col))
        c.fill_preserve()
        c.set_source_rgb(*INK)
        c.set_line_width(lw)
        c.stroke()

    # Exploded Wedge (Gold):
    mid_ang = 0.20 * math.pi
    ex_dist = s * 0.08
    ex = x + ex_dist * math.cos(mid_ang)
    ey = cy + ex_dist * math.sin(mid_ang)

    ex_a1 = 0.05 * math.pi
    ex_a2 = 0.35 * math.pi

    # Wedge outer curved bottom rim
    c.new_path()
    c.move_to(ex + rx * math.cos(ex_a1), ey + ry * math.sin(ex_a1))
    c.line_to(ex + rx * math.cos(ex_a1), ey + dy + ry * math.sin(ex_a1))
    steps = 14
    for st in range(steps + 1):
        ang = ex_a1 + (ex_a2 - ex_a1) * st / steps
        c.line_to(ex + rx * math.cos(ang), ey + dy + ry * math.sin(ang))
    c.line_to(ex + rx * math.cos(ex_a2), ey + ry * math.sin(ex_a2))
    for st in range(steps + 1):
        ang = ex_a2 - (ex_a2 - ex_a1) * st / steps
        c.line_to(ex + rx * math.cos(ang), ey + ry * math.sin(ang))
    c.close_path()
    c.set_source_rgb(*fc(style, GOLD_SHADOW))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Wedge radial cut side at 0.35*pi
    _poly(cv, [
        (ex, ey),
        (ex + rx * math.cos(ex_a2), ey + ry * math.sin(ex_a2)),
        (ex + rx * math.cos(ex_a2), ey + dy + ry * math.sin(ex_a2)),
        (ex, ey + dy),
    ], fill=fc(style, shade(GOLD, 0.88)), lw=lw)

    # Wedge top sector
    c.new_path()
    c.move_to(ex, ey)
    for st in range(steps + 1):
        ang = ex_a1 + (ex_a2 - ex_a1) * st / steps
        c.line_to(ex + rx * math.cos(ang), ey + ry * math.sin(ang))
    c.close_path()
    c.set_source_rgb(*fc(style, GOLD))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()


def prop_handshake_contract(cv, x, y, s, style):
    """Legal agreement document with cursive signature, wax seal, and luxury fountain pen."""
    lw = _lw(s)
    thin = _thin(s)

    w = s * 0.54
    h = s * 0.70

    c = cv.c
    c.save()
    c.translate(x, y)
    c.rotate(-0.05)

    # Document paper
    cv.rrect(-w * 0.5, -h * 0.5, w, h, s * 0.025,
             fill=fc(style, GRAY_LIGHT), lw=lw)

    # Top header icon (scales of justice balance)
    _text(cv, "AGREEMENT", 0, -h * 0.38, s * 0.065, color=INK, bold=True)
    cv.line([(-w * 0.38, -h * 0.30), (w * 0.38, -h * 0.30)], w=lw * 0.8, color=INK)

    # Paragraph text lines
    for ly in (-h * 0.22, -h * 0.16, -h * 0.10, -h * 0.04, h * 0.04, h * 0.10):
        cv.line([(-w * 0.38, ly), (w * 0.38, ly)], w=thin * 1.5, color=INK)

    # Two signature lines at bottom
    sig_y = h * 0.26
    cv.line([(-w * 0.38, sig_y), (-w * 0.05, sig_y)], w=thin * 1.8, color=INK)
    cv.line([(w * 0.05, sig_y), (w * 0.38, sig_y)], w=thin * 1.8, color=INK)

    # Fluid cursive ink signature on left
    c.new_path()
    c.move_to(-w * 0.36, sig_y - s * 0.02)
    c.curve_to(-w * 0.30, sig_y - s * 0.08, -w * 0.26, sig_y + s * 0.01, -w * 0.22, sig_y - s * 0.04)
    c.curve_to(-w * 0.18, sig_y - s * 0.07, -w * 0.14, sig_y + s * 0.02, -w * 0.08, sig_y - s * 0.02)
    c.set_source_rgb(*INK)
    c.set_line_width(thin * 1.8)
    c.stroke()

    # Red wax seal stamp on bottom right
    seal_x = w * 0.24
    seal_y = sig_y - s * 0.02
    seal_r = s * 0.05
    # Seal ribbon tails
    pts_tail = [(seal_x, seal_y), (seal_x - s * 0.03, seal_y + s * 0.09),
                (seal_x, seal_y + s * 0.07), (seal_x + s * 0.03, seal_y + s * 0.09)]
    _poly(cv, pts_tail, fill=fc(style, RED_DARK), lw=0)
    # Wax seal circle
    cv.ellipse(seal_x, seal_y, seal_r, seal_r, fill=fc(style, RED_VIVID), w=thin)
    cv.ellipse(seal_x, seal_y, seal_r * 0.65, seal_r * 0.65, fill=None, w=thin)

    # Fountain pen resting diagonally across document
    pen_x = s * 0.08
    pen_y = s * 0.10
    c.save()
    c.translate(pen_x, pen_y)
    c.rotate(-0.75)

    pen_len = s * 0.40
    pen_w = s * 0.045

    # Pen barrel
    cv.rrect(-pen_w * 0.5, -pen_len * 0.5, pen_w, pen_len * 0.65, s * 0.012,
             fill=fc(style, BLUE_DARK), lw=lw * 0.7)
    # Gold ring band
    cv.rrect(-pen_w * 0.5, pen_len * 0.15, pen_w, s * 0.025, 0,
             fill=fc(style, GOLD), lw=thin)
    # Grip section
    cv.rrect(-pen_w * 0.45, pen_len * 0.175, pen_w * 0.9, pen_len * 0.15, s * 0.008,
             fill=fc(style, GRAY_DARK), lw=thin)
    # Gold nib
    pts_nib = [
        (-pen_w * 0.45, pen_len * 0.325),
        (0, pen_len * 0.48),
        (pen_w * 0.45, pen_len * 0.325),
    ]
    _poly(cv, pts_nib, fill=fc(style, GOLD), lw=lw * 0.7)
    cv.line([(0, pen_len * 0.34), (0, pen_len * 0.44)], w=thin * 0.8, color=INK)

    c.restore()

    c.restore()


# ---------------------------------------------------------------------- Exports
PROPS = {
    "coin": prop_coin,
    "coins": prop_coins,
    "cash": prop_cash,
    "money_bag": prop_money_bag,
    "piggy_bank": prop_piggy_bank,
    "credit_card": prop_credit_card,
    "wallet": prop_wallet,
    "receipt": prop_receipt,
    "price_tag": prop_price_tag,
    "bank": prop_bank,
    "atm": prop_atm,
    "gift": prop_gift,
    "shopping_bag": prop_shopping_bag,
    "shopping_cart": prop_shopping_cart,
    "safe": prop_safe,
    "calculator": prop_calculator,
    "invoice": prop_invoice,
    "chart_up": prop_chart_up,
    "chart_down": prop_chart_down,
    "bar_chart": prop_bar_chart,
    "pie_chart": prop_pie_chart,
    "handshake_contract": prop_handshake_contract,
}


# ---------------------------------------------------------------------- Contact sheet
if __name__ == "__main__":
    prop_list = list(PROPS.items())
    cols = 5
    rows = (len(prop_list) + cols - 1) // cols
    cell = 380
    w_sheet = cols * cell
    h_sheet = rows * cell

    styles_bg = [
        ("professor", rgb("#E0A911"), "/tmp/props_props_money_professor.png"),
        ("stickman", PAPER, "/tmp/props_props_money_stickman.png"),
    ]

    for style, bg_col, out_path in styles_bg:
        cv_test = Canvas(bg=bg_col, w=w_sheet, h=h_sheet)
        for i, (name, fn) in enumerate(prop_list):
            r = i // cols
            c_idx = i % cols
            cx = c_idx * cell + cell // 2
            cy = r * cell + cell // 2

            # Prop drawing
            fn(cv_test, cx, cy - 20, 270, style)

            # Label at bottom of cell
            _text(cv_test, name, cx, cy + cell // 2 - 25, 20, color=INK, bold=True)

        cv_test.save(out_path)
        print(f"Saved contact sheet: {out_path}")

        alt_path = f"/tmp/props_money_{style}.png"
        cv_test.save(alt_path)
        print(f"Saved alt contact sheet: {alt_path}")
