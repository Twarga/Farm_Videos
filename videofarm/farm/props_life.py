"""Props: life / daily / symbols.
Every prop fits prop_NAME(cv, x, y, s, style) where style is 'professor' or 'stickman'.
"""
import math
import cairo
from farm.art import Canvas, INK, OL, PAPER, fc, rgb, shade


def _lw(s):
    return max(5.0, s * 0.025)


def _thin(s):
    return max(3.0, s * 0.014)


def _poly(cv, pts, fill=None, w=0, close=True):
    c = cv.c
    c.new_path()
    c.move_to(*pts[0])
    for p in pts[1:]:
        c.line_to(*p)
    if close:
        c.close_path()
    if fill is not None:
        c.set_source_rgb(*fill)
        c.fill_preserve()
    if w:
        c.set_source_rgb(*INK)
        c.set_line_width(w)
        c.stroke()
    else:
        c.new_path()


# ------------------------------------------------------------------ 1. car
def prop_car(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_body = fc(style, rgb("#E63946"))
    col_glass = fc(style, rgb("#E0F2FE"))
    col_chrome = fc(style, rgb("#E2E8F0"))
    col_light = fc(style, rgb("#FFD166"))
    col_tail = fc(style, rgb("#FF5400"))
    col_smoke = fc(style, rgb("#FFFFFF"))

    # Wheels placement: grounded stance
    wx1 = x - 0.21 * s
    wx2 = x + 0.21 * s
    wy = y + 0.08 * s
    wr = 0.085 * s
    arch_r = wr + 0.018 * s

    # Main sedan body silhouette
    c.new_path()
    c.move_to(x - 0.38 * s, wy)
    # Rear wheel arch
    c.line_to(wx1 - arch_r, wy)
    c.arc_negative(wx1, wy, arch_r, math.pi, 0)
    # Rocker panel between wheels
    c.line_to(wx2 - arch_r, wy)
    # Front wheel arch
    c.arc_negative(wx2, wy, arch_r, math.pi, 0)
    # Front bumper lower
    c.line_to(x + 0.38 * s, wy)
    # Front nose curve up to hood
    c.curve_to(x + 0.40 * s, wy - 0.02 * s, x + 0.40 * s, y - 0.02 * s, x + 0.36 * s, y - 0.03 * s)
    # Hood across to windshield base
    c.line_to(x + 0.16 * s, y - 0.03 * s)
    # Sloped front windshield up to roof
    c.curve_to(x + 0.12 * s, y - 0.14 * s, x + 0.07 * s, y - 0.18 * s, x + 0.01 * s, y - 0.18 * s)
    # Roof across
    c.line_to(x - 0.16 * s, y - 0.18 * s)
    # Sloped rear windshield down to trunk
    c.curve_to(x - 0.22 * s, y - 0.14 * s, x - 0.25 * s, y - 0.03 * s, x - 0.29 * s, y - 0.03 * s)
    # Trunk deck
    c.line_to(x - 0.36 * s, y - 0.03 * s)
    # Rear curve down
    c.curve_to(x - 0.40 * s, y - 0.01 * s, x - 0.40 * s, wy - 0.02 * s, x - 0.38 * s, wy)
    c.close_path()

    c.set_source_rgb(*col_body)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Front window
    c.new_path()
    c.move_to(x + 0.01 * s, y - 0.15 * s)
    c.line_to(x - 0.005 * s, y - 0.04 * s)
    c.line_to(x + 0.14 * s, y - 0.04 * s)
    c.curve_to(x + 0.12 * s, y - 0.09 * s, x + 0.08 * s, y - 0.14 * s, x + 0.01 * s, y - 0.15 * s)
    c.close_path()
    c.set_source_rgb(*col_glass)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw_thin)
    c.stroke()

    # Front window glare slash
    c.new_path()
    c.move_to(x + 0.05 * s, y - 0.13 * s)
    c.line_to(x + 0.09 * s, y - 0.06 * s)
    c.set_source_rgb(*fc(style, rgb("#FFFFFF")))
    c.set_line_width(lw_thin * 1.3)
    c.stroke()

    # Rear window
    c.new_path()
    c.move_to(x - 0.025 * s, y - 0.15 * s)
    c.line_to(x - 0.14 * s, y - 0.15 * s)
    c.curve_to(x - 0.19 * s, y - 0.11 * s, x - 0.22 * s, y - 0.06 * s, x - 0.25 * s, y - 0.04 * s)
    c.line_to(x - 0.025 * s, y - 0.04 * s)
    c.close_path()
    c.set_source_rgb(*col_glass)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw_thin)
    c.stroke()

    # Door cut line
    c.new_path()
    c.move_to(x - 0.015 * s, y - 0.04 * s)
    c.line_to(x - 0.015 * s, wy - 0.01 * s)
    c.set_source_rgb(*INK)
    c.set_line_width(lw_thin)
    c.stroke()

    # Door handle
    cv.rrect(x + 0.03 * s, y - 0.005 * s, 0.045 * s, 0.014 * s, 0.007 * s, fill=col_chrome, lw=lw_thin)

    # Headlight
    c.new_path()
    c.arc(x + 0.36 * s, y + 0.005 * s, 0.028 * s, -math.pi / 2, math.pi / 2)
    c.close_path()
    c.set_source_rgb(*col_light)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw_thin)
    c.stroke()

    # Taillight
    cv.rrect(x - 0.39 * s, y - 0.005 * s, 0.025 * s, 0.035 * s, 0.008 * s, fill=col_tail, lw=lw_thin)

    # Bumpers
    cv.rrect(x - 0.40 * s, wy - 0.035 * s, 0.035 * s, 0.028 * s, 0.01 * s, fill=col_chrome, lw=lw_thin)
    cv.rrect(x + 0.365 * s, wy - 0.035 * s, 0.035 * s, 0.028 * s, 0.01 * s, fill=col_chrome, lw=lw_thin)

    # Wheels (drawn on top)
    for wx in (wx1, wx2):
        cv.ellipse(wx, wy, wr, wr, fill=INK, w=lw)
        cv.ellipse(wx, wy, wr * 0.52, wr * 0.52, fill=col_chrome, w=lw_thin)
        cv.ellipse(wx, wy, wr * 0.18, wr * 0.18, fill=INK, w=0)

    # Exhaust puff behind car
    cv.ellipse(x - 0.42 * s, wy - 0.02 * s, 0.018 * s, 0.015 * s, fill=col_smoke, w=lw_thin * 0.8)
    cv.ellipse(x - 0.46 * s, wy - 0.03 * s, 0.024 * s, 0.020 * s, fill=col_smoke, w=lw_thin * 0.8)


# ------------------------------------------------------------------ 2. house
def prop_house(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_wall = fc(style, rgb("#FDF0D5"))
    col_roof = fc(style, rgb("#C84B31"))
    col_door = fc(style, rgb("#2A9D8F"))
    col_chim = fc(style, rgb("#A04028"))
    col_glass = fc(style, rgb("#E0F2FE"))
    col_gold = fc(style, rgb("#FFD166"))
    col_bush = fc(style, rgb("#52B788"))

    # Chimney behind roof
    chim_x = x - 0.18 * s
    chim_w = 0.09 * s
    cv.rrect(chim_x, y - 0.28 * s, chim_w, 0.18 * s, 0.01 * s, fill=col_chim, lw=lw)
    cv.rrect(chim_x - 0.015 * s, y - 0.30 * s, chim_w + 0.03 * s, 0.025 * s, 0.006 * s, fill=col_chim, lw=lw_thin)

    # Smoke puffs
    smoke_col = fc(style, rgb("#FFFFFF"))
    cv.ellipse(chim_x + 0.03 * s, y - 0.34 * s, 0.024 * s, 0.020 * s, fill=smoke_col, w=lw_thin)
    cv.ellipse(chim_x + 0.07 * s, y - 0.38 * s, 0.030 * s, 0.026 * s, fill=smoke_col, w=lw_thin)
    cv.ellipse(chim_x + 0.12 * s, y - 0.42 * s, 0.038 * s, 0.032 * s, fill=smoke_col, w=lw_thin)

    # Main wall
    wall_w = 0.52 * s
    wall_h = 0.35 * s
    wall_x = x - wall_w / 2
    wall_y = y - 0.05 * s
    cv.rrect(wall_x, wall_y, wall_w, wall_h, 0.015 * s, fill=col_wall, lw=lw)

    # Triangle roof with overhang
    _poly(cv, [(x, y - 0.30 * s), (x + 0.33 * s, y - 0.04 * s), (x - 0.33 * s, y - 0.04 * s)],
          fill=col_roof, w=lw, close=True)

    # Attic round window
    cv.ellipse(x, y - 0.15 * s, 0.05 * s, 0.05 * s, fill=col_gold, w=lw)
    c.new_path()
    c.move_to(x - 0.05 * s, y - 0.15 * s)
    c.line_to(x + 0.05 * s, y - 0.15 * s)
    c.move_to(x, y - 0.20 * s)
    c.line_to(x, y - 0.10 * s)
    c.set_source_rgb(*INK)
    c.set_line_width(lw_thin)
    c.stroke()

    # Front door
    door_w = 0.14 * s
    door_h = 0.21 * s
    door_x = x + 0.07 * s
    door_y = wall_y + wall_h - door_h
    cv.rrect(door_x, door_y, door_w, door_h, 0.012 * s, fill=col_door, lw=lw)
    cv.ellipse(door_x + 0.11 * s, door_y + door_h * 0.55, 0.013 * s, 0.013 * s, fill=col_gold, w=lw_thin)
    # Doorstep
    cv.rrect(door_x - 0.015 * s, door_y + door_h - 0.01 * s, door_w + 0.03 * s, 0.025 * s, 0.006 * s, fill=col_wall, lw=lw_thin)

    # Lower window
    win_w = 0.15 * s
    win_h = 0.15 * s
    win_x = x - 0.20 * s
    win_y = y + 0.04 * s
    cv.rrect(win_x, win_y, win_w, win_h, 0.012 * s, fill=col_glass, lw=lw)
    c.new_path()
    c.move_to(win_x, win_y + win_h / 2)
    c.line_to(win_x + win_w, win_y + win_h / 2)
    c.move_to(win_x + win_w / 2, win_y)
    c.line_to(win_x + win_w / 2, win_y + win_h)
    c.set_source_rgb(*INK)
    c.set_line_width(lw_thin)
    c.stroke()
    # Window sill
    cv.rrect(win_x - 0.02 * s, win_y + win_h - 0.01 * s, win_w + 0.04 * s, 0.022 * s, 0.006 * s, fill=col_roof, lw=lw_thin)

    # Cute little green shrub beside doorstep
    cv.ellipse(door_x + door_w + 0.04 * s, wall_y + wall_h - 0.02 * s, 0.045 * s, 0.035 * s, fill=col_bush, w=lw_thin)


# ------------------------------------------------------------------ 3. dumbbell
def prop_dumbbell(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_steel = fc(style, rgb("#CBD5E1"))
    col_plate = fc(style, rgb("#334155"))
    col_rim = fc(style, rgb("#475569"))

    c.save()
    c.translate(x, y)
    c.rotate(-0.45)

    bar_w = 0.52 * s
    bar_h = 0.05 * s
    cv.rrect(-bar_w / 2, -bar_h / 2, bar_w, bar_h, 0.015 * s, fill=col_steel, lw=lw)

    # Cross knurling on grip
    for gx in (-0.08 * s, -0.05 * s, -0.02 * s, 0.01 * s, 0.04 * s, 0.07 * s):
        c.new_path()
        c.move_to(gx - 0.012 * s, -bar_h / 2 + 1)
        c.line_to(gx + 0.012 * s, bar_h / 2 - 1)
        c.move_to(gx + 0.012 * s, -bar_h / 2 + 1)
        c.line_to(gx - 0.012 * s, bar_h / 2 - 1)
        c.set_source_rgb(*INK)
        c.set_line_width(lw_thin * 0.7)
        c.stroke()

    # Weight plates
    for side in (-1, 1):
        ip_x = side * 0.16 * s
        cv.rrect(ip_x - 0.025 * s, -0.15 * s, 0.05 * s, 0.30 * s, 0.02 * s, fill=col_plate, lw=lw)
        cv.ellipse(ip_x, 0, 0.014 * s, 0.12 * s, fill=col_rim, w=0)

        op_x = side * 0.23 * s
        cv.rrect(op_x - 0.035 * s, -0.19 * s, 0.07 * s, 0.38 * s, 0.025 * s, fill=col_plate, lw=lw)
        cv.ellipse(op_x, 0, 0.018 * s, 0.16 * s, fill=col_rim, w=0)

        ec_x = side * 0.28 * s
        cv.rrect(ec_x - 0.015 * s, -0.045 * s, 0.03 * s, 0.09 * s, 0.01 * s, fill=col_steel, lw=lw_thin)

    c.restore()


# ------------------------------------------------------------------ 4. scale
def prop_scale(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_body = fc(style, rgb("#2EC4B6"))
    col_tread = fc(style, rgb("#1F8A80"))
    col_dial = fc(style, rgb("#FFFFFF"))
    col_needle = fc(style, rgb("#E63946"))
    col_metal = fc(style, rgb("#E2E8F0"))

    w = 0.68 * s
    h = 0.68 * s
    cv.rrect(x - w / 2, y - h / 2, w, h, 0.10 * s, fill=col_body, lw=lw)

    # Foot tread pads
    tw = 0.14 * s
    th = 0.34 * s
    for side in (-1, 1):
        tx = x + side * 0.20 * s - tw / 2
        ty = y + 0.08 * s - th / 2
        cv.rrect(tx, ty, tw, th, 0.04 * s, fill=col_tread, lw=lw_thin)
        for step in (-0.10 * s, -0.05 * s, 0, 0.05 * s, 0.10 * s):
            c.new_path()
            c.move_to(tx + 0.02 * s, ty + th / 2 + step)
            c.line_to(tx + tw - 0.02 * s, ty + th / 2 + step)
            c.set_source_rgb(*INK)
            c.set_line_width(lw_thin * 0.8)
            c.stroke()

    # Dial rim and face
    dial_cx = x
    dial_cy = y - 0.14 * s
    dial_r = 0.14 * s
    cv.ellipse(dial_cx, dial_cy, dial_r + 0.02 * s, dial_r + 0.02 * s, fill=col_metal, w=lw)
    cv.ellipse(dial_cx, dial_cy, dial_r, dial_r, fill=col_dial, w=lw_thin)

    # Dial ticks
    for deg in range(-140, -40 + 1, 20):
        rad = math.radians(deg)
        c.new_path()
        c.move_to(dial_cx + (dial_r - 0.035 * s) * math.cos(rad), dial_cy + (dial_r - 0.035 * s) * math.sin(rad))
        c.line_to(dial_cx + (dial_r - 0.01 * s) * math.cos(rad), dial_cy + (dial_r - 0.01 * s) * math.sin(rad))
        c.set_source_rgb(*INK)
        c.set_line_width(lw_thin)
        c.stroke()

    # Needle
    n_rad = math.radians(-70)
    c.new_path()
    c.move_to(dial_cx, dial_cy)
    c.line_to(dial_cx + (dial_r - 0.02 * s) * math.cos(n_rad), dial_cy + (dial_r - 0.02 * s) * math.sin(n_rad))
    c.set_source_rgb(*col_needle)
    c.set_line_width(lw)
    c.stroke()
    cv.ellipse(dial_cx, dial_cy, 0.022 * s, 0.022 * s, fill=INK, w=0)


# ------------------------------------------------------------------ 5. shoes
def _single_sneaker(cv, x, y, scale, style, lw, lw_thin):
    c = cv.c
    col_upper = fc(style, rgb("#E63946"))
    col_sole = fc(style, rgb("#FFFFFF"))

    # Canvas upper with curved ankle collar and tongue
    c.new_path()
    c.move_to(x - 0.26 * scale, y + 0.06 * scale)
    c.curve_to(x - 0.28 * scale, y - 0.04 * scale, x - 0.26 * scale, y - 0.12 * scale, x - 0.18 * scale, y - 0.15 * scale)
    c.line_to(x - 0.08 * scale, y - 0.15 * scale)
    c.curve_to(x - 0.04 * scale, y - 0.16 * scale, x, y - 0.13 * scale, x + 0.02 * scale, y - 0.08 * scale)
    c.line_to(x + 0.15 * scale, y + 0.01 * scale)
    c.curve_to(x + 0.24 * scale, y + 0.02 * scale, x + 0.28 * scale, y + 0.04 * scale, x + 0.28 * scale, y + 0.08 * scale)
    c.line_to(x - 0.26 * scale, y + 0.08 * scale)
    c.close_path()
    c.set_source_rgb(*col_upper)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # White rubber toe cap
    c.new_path()
    c.move_to(x + 0.17 * scale, y + 0.01 * scale)
    c.curve_to(x + 0.24 * scale, y + 0.03 * scale, x + 0.28 * scale, y + 0.05 * scale, x + 0.28 * scale, y + 0.08 * scale)
    c.line_to(x + 0.15 * scale, y + 0.08 * scale)
    c.close_path()
    c.set_source_rgb(*col_sole)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw_thin)
    c.stroke()

    # Thick white rubber sole curving up at toe
    c.new_path()
    c.move_to(x - 0.27 * scale, y + 0.075 * scale)
    c.line_to(x + 0.24 * scale, y + 0.075 * scale)
    c.curve_to(x + 0.28 * scale, y + 0.075 * scale, x + 0.30 * scale, y + 0.07 * scale, x + 0.30 * scale, y + 0.07 * scale)
    c.line_to(x + 0.28 * scale, y + 0.15 * scale)
    c.line_to(x - 0.27 * scale, y + 0.15 * scale)
    c.close_path()
    c.set_source_rgb(*col_sole)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Black stripe on sole
    c.new_path()
    c.move_to(x - 0.26 * scale, y + 0.11 * scale)
    c.line_to(x + 0.27 * scale, y + 0.11 * scale)
    c.set_source_rgb(*INK)
    c.set_line_width(lw_thin)
    c.stroke()

    # Laces
    for i in range(3):
        lx = x + (i * 0.05 - 0.03) * scale
        ly = y - (0.07 - i * 0.028) * scale
        c.new_path()
        c.move_to(lx, ly)
        c.line_to(lx + 0.05 * scale, ly + 0.035 * scale)
        c.set_source_rgb(*col_sole)
        c.set_line_width(lw_thin * 1.5)
        c.stroke()
        cv.ellipse(lx, ly, 0.012 * scale, 0.012 * scale, fill=INK, w=0)
        cv.ellipse(lx + 0.05 * scale, ly + 0.035 * scale, 0.012 * scale, 0.012 * scale, fill=INK, w=0)

    # Ankle circle patch with star
    cv.ellipse(x - 0.15 * scale, y - 0.05 * scale, 0.045 * scale, 0.045 * scale, fill=col_sole, w=lw_thin)
    star_x = x - 0.15 * scale
    star_y = y - 0.05 * scale
    star_r = 0.022 * scale
    c.new_path()
    for pt_i in range(5):
        ang1 = pt_i * 2 * math.pi / 5 - math.pi / 2
        ang2 = (pt_i + 0.5) * 2 * math.pi / 5 - math.pi / 2
        px1 = star_x + star_r * math.cos(ang1)
        py1 = star_y + star_r * math.sin(ang1)
        px2 = star_x + star_r * 0.45 * math.cos(ang2)
        py2 = star_y + star_r * 0.45 * math.sin(ang2)
        if pt_i == 0:
            c.move_to(px1, py1)
        else:
            c.line_to(px1, py1)
        c.line_to(px2, py2)
    c.close_path()
    c.set_source_rgb(*col_upper)
    c.fill()


def prop_shoes(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    _single_sneaker(cv, x - 0.08 * s, y - 0.06 * s, s * 0.88, style, lw, lw_thin)
    _single_sneaker(cv, x + 0.06 * s, y + 0.07 * s, s * 0.96, style, lw, lw_thin)


# ------------------------------------------------------------------ 6. apple
def prop_apple(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_apple = fc(style, rgb("#E63946"))
    col_leaf = fc(style, rgb("#48BB78"))
    col_stem = fc(style, rgb("#6F4E37"))

    # Stem behind apple
    c.new_path()
    c.move_to(x, y - 0.14 * s)
    c.curve_to(x + 0.02 * s, y - 0.24 * s, x + 0.06 * s, y - 0.30 * s, x + 0.10 * s, y - 0.33 * s)
    c.set_source_rgb(*col_stem)
    c.set_line_width(lw * 1.5)
    c.set_line_cap(cairo.LINE_CAP_ROUND)
    c.stroke()

    # Leaf attached to stem
    leaf_pts = [
        (x + 0.03 * s, y - 0.20 * s),
        (x + 0.14 * s, y - 0.32 * s),
        (x + 0.25 * s, y - 0.28 * s),
        (x + 0.19 * s, y - 0.18 * s),
    ]
    cv.shape(leaf_pts, fill=col_leaf, w=lw, close=True)
    c.new_path()
    c.move_to(x + 0.04 * s, y - 0.20 * s)
    c.curve_to(x + 0.13 * s, y - 0.24 * s, x + 0.17 * s, y - 0.25 * s, x + 0.23 * s, y - 0.26 * s)
    c.set_source_rgb(*INK)
    c.set_line_width(lw_thin)
    c.stroke()

    # Apple body
    apple_pts = [
        (x, y - 0.15 * s),
        (x + 0.22 * s, y - 0.24 * s),
        (x + 0.32 * s, y - 0.02 * s),
        (x + 0.20 * s, y + 0.26 * s),
        (x, y + 0.22 * s),
        (x - 0.20 * s, y + 0.26 * s),
        (x - 0.32 * s, y - 0.02 * s),
        (x - 0.22 * s, y - 0.24 * s),
    ]
    cv.shape(apple_pts, fill=col_apple, w=lw, close=True)

    # Highlight crescent
    c.new_path()
    c.arc(x - 0.10 * s, y - 0.04 * s, 0.18 * s, -math.pi * 0.85, -math.pi * 0.55)
    c.set_source_rgb(*fc(style, rgb("#FFFFFF")))
    c.set_line_width(lw * 0.9)
    c.stroke()


# ------------------------------------------------------------------ 7. burger
def prop_burger(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_bun = fc(style, rgb("#E09F3E"))
    col_bun_bot = fc(style, rgb("#D48B30"))
    col_patty = fc(style, rgb("#5C3D2E"))
    col_cheese = fc(style, rgb("#FFB703"))
    col_tomato = fc(style, rgb("#E63946"))
    col_lettuce = fc(style, rgb("#52B788"))
    col_seed = fc(style, rgb("#FFF8E7"))

    # Bottom bun
    cv.rrect(x - 0.28 * s, y + 0.12 * s, 0.56 * s, 0.10 * s, 0.04 * s, fill=col_bun_bot, lw=lw)

    # Burger Patty
    cv.rrect(x - 0.31 * s, y + 0.04 * s, 0.62 * s, 0.09 * s, 0.04 * s, fill=col_patty, lw=lw)

    # Melted cheese
    cheese_pts = [
        (x - 0.30 * s, y + 0.03 * s),
        (x - 0.20 * s, y + 0.03 * s),
        (x - 0.14 * s, y + 0.11 * s),
        (x - 0.08 * s, y + 0.03 * s),
        (x + 0.10 * s, y + 0.03 * s),
        (x + 0.18 * s, y + 0.12 * s),
        (x + 0.24 * s, y + 0.03 * s),
        (x + 0.30 * s, y + 0.03 * s),
        (x + 0.28 * s, y - 0.01 * s),
        (x - 0.28 * s, y - 0.01 * s),
    ]
    _poly(cv, cheese_pts, fill=col_cheese, w=lw, close=True)

    # Tomato slice
    cv.rrect(x - 0.28 * s, y - 0.04 * s, 0.56 * s, 0.06 * s, 0.02 * s, fill=col_tomato, lw=lw)

    # Lettuce (wavy ribbon)
    lettuce_pts = [
        (x - 0.32 * s, y - 0.05 * s),
        (x - 0.24 * s, y - 0.02 * s),
        (x - 0.16 * s, y - 0.07 * s),
        (x - 0.08 * s, y - 0.02 * s),
        (x, y - 0.07 * s),
        (x + 0.08 * s, y - 0.02 * s),
        (x + 0.16 * s, y - 0.07 * s),
        (x + 0.24 * s, y - 0.02 * s),
        (x + 0.32 * s, y - 0.05 * s),
        (x + 0.28 * s, y - 0.10 * s),
        (x - 0.28 * s, y - 0.10 * s),
    ]
    cv.shape(lettuce_pts, fill=col_lettuce, w=lw, close=True)

    # Top bun dome
    c.new_path()
    c.move_to(x - 0.32 * s, y - 0.09 * s)
    c.curve_to(x - 0.32 * s, y - 0.26 * s, x - 0.15 * s, y - 0.28 * s, x, y - 0.28 * s)
    c.curve_to(x + 0.15 * s, y - 0.28 * s, x + 0.32 * s, y - 0.26 * s, x + 0.32 * s, y - 0.09 * s)
    c.close_path()
    c.set_source_rgb(*col_bun)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Sesame seeds
    for sx, sy in ((-0.16, -0.20), (-0.08, -0.24), (0.02, -0.22), (0.12, -0.24), (0.18, -0.19), (-0.02, -0.17)):
        cv.ellipse(x + sx * s, y + sy * s, 0.016 * s, 0.009 * s, fill=col_seed, w=lw_thin * 0.8, rot=0.3)


# ------------------------------------------------------------------ 8. pizza
def prop_pizza(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_crust = fc(style, rgb("#E9C46A"))
    col_cheese = fc(style, rgb("#FFD166"))
    col_pep = fc(style, rgb("#9E2A2B"))

    tip = (x, y + 0.30 * s)
    left_top = (x - 0.28 * s, y - 0.18 * s)
    right_top = (x + 0.28 * s, y - 0.18 * s)

    # Cheese triangle
    c.new_path()
    c.move_to(*tip)
    c.line_to(*left_top)
    c.curve_to(x - 0.14 * s, y - 0.24 * s, x + 0.14 * s, y - 0.24 * s, *right_top)
    c.close_path()
    c.set_source_rgb(*col_cheese)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Crust arc at top
    c.new_path()
    c.move_to(x - 0.30 * s, y - 0.18 * s)
    c.curve_to(x - 0.15 * s, y - 0.25 * s, x + 0.15 * s, y - 0.25 * s, x + 0.30 * s, y - 0.18 * s)
    c.curve_to(x + 0.32 * s, y - 0.26 * s, x + 0.16 * s, y - 0.33 * s, x, y - 0.33 * s)
    c.curve_to(x - 0.16 * s, y - 0.33 * s, x - 0.32 * s, y - 0.26 * s, x - 0.30 * s, y - 0.18 * s)
    c.close_path()
    c.set_source_rgb(*col_crust)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Pepperonis
    peps = [
        (x - 0.08 * s, y - 0.10 * s, 0.055 * s),
        (x + 0.11 * s, y - 0.08 * s, 0.050 * s),
        (x - 0.02 * s, y + 0.05 * s, 0.052 * s),
        (x + 0.04 * s, y + 0.17 * s, 0.042 * s),
    ]
    for px, py, pr in peps:
        cv.ellipse(px, py, pr, pr, fill=col_pep, w=lw)
        cv.ellipse(px - pr * 0.25, py - pr * 0.25, pr * 0.2, pr * 0.2, fill=fc(style, rgb("#FF8500")), w=0)

    # Green pepper slivers
    pep_greens = [
        (x - 0.12 * s, y + 0.01 * s, -0.5),
        (x + 0.13 * s, y + 0.05 * s, 0.8),
    ]
    for gx, gy, rot in pep_greens:
        c.save()
        c.translate(gx, gy)
        c.rotate(rot)
        c.new_path()
        c.arc(0, 0, 0.035 * s, -1.2, 1.2)
        c.set_source_rgb(*fc(style, rgb("#52B788")))
        c.set_line_width(lw_thin * 1.8)
        c.set_line_cap(cairo.LINE_CAP_ROUND)
        c.stroke()
        c.restore()

    # Cheese drip at tip
    c.new_path()
    c.move_to(x - 0.02 * s, y + 0.28 * s)
    c.curve_to(x - 0.03 * s, y + 0.34 * s, x + 0.02 * s, y + 0.36 * s, x + 0.01 * s, y + 0.28 * s)
    c.set_source_rgb(*col_cheese)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw_thin)
    c.stroke()


# ------------------------------------------------------------------ 9. bottle
def prop_bottle(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_glass = fc(style, rgb("#00B4D8"))
    col_cap = fc(style, rgb("#E63946"))
    col_label = fc(style, rgb("#FFFFFF"))
    col_stripe = fc(style, rgb("#FFB703"))

    # Bottle silhouette
    c.new_path()
    c.move_to(x - 0.055 * s, y - 0.28 * s)
    c.line_to(x - 0.055 * s, y - 0.14 * s)
    c.curve_to(x - 0.06 * s, y - 0.06 * s, x - 0.15 * s, y - 0.03 * s, x - 0.15 * s, y + 0.06 * s)
    c.line_to(x - 0.15 * s, y + 0.28 * s)
    c.curve_to(x - 0.15 * s, y + 0.33 * s, x - 0.08 * s, y + 0.33 * s, x, y + 0.33 * s)
    c.curve_to(x + 0.08 * s, y + 0.33 * s, x + 0.15 * s, y + 0.33 * s, x + 0.15 * s, y + 0.28 * s)
    c.line_to(x + 0.15 * s, y + 0.06 * s)
    c.curve_to(x + 0.15 * s, y - 0.03 * s, x + 0.06 * s, y - 0.06 * s, x + 0.055 * s, y - 0.14 * s)
    c.line_to(x + 0.055 * s, y - 0.28 * s)
    c.close_path()

    c.set_source_rgb(*col_glass)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Liquid level line
    c.new_path()
    c.move_to(x - 0.14 * s, y + 0.02 * s)
    c.curve_to(x - 0.06 * s, y + 0.04 * s, x + 0.06 * s, y, x + 0.14 * s, y + 0.02 * s)
    c.set_source_rgb(*INK)
    c.set_line_width(lw_thin * 0.9)
    c.stroke()

    # White label
    cv.rrect(x - 0.14 * s, y + 0.06 * s, 0.28 * s, 0.16 * s, 0.02 * s, fill=col_label, lw=lw_thin)
    c.new_path()
    c.move_to(x - 0.12 * s, y + 0.14 * s)
    c.curve_to(x - 0.04 * s, y + 0.10 * s, x + 0.04 * s, y + 0.18 * s, x + 0.12 * s, y + 0.14 * s)
    c.set_source_rgb(*col_stripe)
    c.set_line_width(lw * 0.8)
    c.stroke()

    # Cap at top
    cv.rrect(x - 0.07 * s, y - 0.34 * s, 0.14 * s, 0.06 * s, 0.015 * s, fill=col_cap, lw=lw)
    cv.rrect(x - 0.065 * s, y - 0.28 * s, 0.13 * s, 0.02 * s, 0.008 * s, fill=col_glass, lw=lw_thin)

    # Glass shine reflection
    c.new_path()
    c.move_to(x - 0.11 * s, y - 0.02 * s)
    c.line_to(x - 0.11 * s, y + 0.26 * s)
    c.set_source_rgb(*fc(style, rgb("#FFFFFF")))
    c.set_line_width(lw_thin * 1.2)
    c.stroke()


# ------------------------------------------------------------------ 10. cup
def prop_cup(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_cup = fc(style, rgb("#FDFBF7"))
    col_lid = fc(style, rgb("#FFFFFF"))
    col_sleeve = fc(style, rgb("#C68B59"))
    col_seal = fc(style, rgb("#6F4E37"))

    # Steam wisps
    for offset_x in (-0.05 * s, 0.05 * s):
        c.new_path()
        c.move_to(x + offset_x, y - 0.24 * s)
        c.curve_to(x + offset_x - 0.04 * s, y - 0.30 * s, x + offset_x + 0.04 * s, y - 0.34 * s, x + offset_x, y - 0.40 * s)
        c.set_source_rgb(*INK)
        c.set_line_width(lw_thin)
        c.stroke()

    # Cup body trapezoid
    top_w = 0.44 * s
    bot_w = 0.32 * s
    cup_top = y - 0.16 * s
    cup_bot = y + 0.28 * s
    cup_pts = [
        (x - top_w / 2, cup_top),
        (x + top_w / 2, cup_top),
        (x + bot_w / 2, cup_bot),
        (x - bot_w / 2, cup_bot),
    ]
    _poly(cv, cup_pts, fill=col_cup, w=lw, close=True)

    # Kraft Cardboard Sleeve
    slv_top = y - 0.05 * s
    slv_bot = y + 0.14 * s
    t1 = (slv_top - cup_top) / (cup_bot - cup_top)
    w1 = top_w + t1 * (bot_w - top_w)
    t2 = (slv_bot - cup_top) / (cup_bot - cup_top)
    w2 = top_w + t2 * (bot_w - top_w)
    slv_pts = [
        (x - w1 / 2 - 0.01 * s, slv_top),
        (x + w1 / 2 + 0.01 * s, slv_top),
        (x + w2 / 2 + 0.01 * s, slv_bot),
        (x - w2 / 2 - 0.01 * s, slv_bot),
    ]
    _poly(cv, slv_pts, fill=col_sleeve, w=lw, close=True)

    # Coffee bean badge on sleeve
    cv.ellipse(x, (slv_top + slv_bot) / 2, 0.055 * s, 0.055 * s, fill=col_seal, w=0)
    cv.ellipse(x, (slv_top + slv_bot) / 2, 0.03 * s, 0.04 * s, fill=col_sleeve, w=0, rot=0.3)
    c.new_path()
    c.move_to(x - 0.015 * s, (slv_top + slv_bot) / 2 - 0.03 * s)
    c.curve_to(x + 0.01 * s, (slv_top + slv_bot) / 2, x - 0.01 * s, (slv_top + slv_bot) / 2, x + 0.015 * s, (slv_top + slv_bot) / 2 + 0.03 * s)
    c.set_source_rgb(*col_seal)
    c.set_line_width(lw_thin)
    c.stroke()

    # Plastic lid
    cv.rrect(x - top_w / 2 - 0.02 * s, y - 0.20 * s, top_w + 0.04 * s, 0.045 * s, 0.015 * s, fill=col_lid, lw=lw)
    cv.rrect(x - top_w / 2 + 0.02 * s, y - 0.24 * s, top_w - 0.04 * s, 0.045 * s, 0.015 * s, fill=col_lid, lw=lw)
    cv.rrect(x + top_w / 2 - 0.07 * s, y - 0.25 * s, 0.04 * s, 0.015 * s, 0.005 * s, fill=INK, lw=0)


# ------------------------------------------------------------------ 11. heart
def prop_heart(cv, x, y, s, style):
    lw = _lw(s)
    c = cv.c

    col_heart = fc(style, rgb("#E63946"))

    c.new_path()
    c.move_to(x, y - 0.12 * s)
    c.curve_to(x - 0.10 * s, y - 0.32 * s, x - 0.36 * s, y - 0.28 * s, x - 0.36 * s, y - 0.04 * s)
    c.curve_to(x - 0.36 * s, y + 0.14 * s, x - 0.18 * s, y + 0.24 * s, x, y + 0.34 * s)
    c.curve_to(x + 0.18 * s, y + 0.24 * s, x + 0.36 * s, y + 0.14 * s, x + 0.36 * s, y - 0.04 * s)
    c.curve_to(x + 0.36 * s, y - 0.28 * s, x + 0.10 * s, y - 0.32 * s, x, y - 0.12 * s)
    c.close_path()

    c.set_source_rgb(*col_heart)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Gloss shine reflection
    c.new_path()
    c.arc(x - 0.16 * s, y - 0.10 * s, 0.12 * s, -math.pi * 0.85, -math.pi * 0.35)
    c.set_source_rgb(*fc(style, rgb("#FFFFFF")))
    c.set_line_width(lw)
    c.set_line_cap(cairo.LINE_CAP_ROUND)
    c.stroke()
    cv.ellipse(x - 0.05 * s, y - 0.18 * s, 0.018 * s, 0.018 * s, fill=fc(style, rgb("#FFFFFF")), w=0)


# ------------------------------------------------------------------ 12. fire
def prop_fire(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_red = fc(style, rgb("#E63946"))
    col_orange = fc(style, rgb("#FF7B00"))
    col_yellow = fc(style, rgb("#FFE066"))

    # Outer red flame
    c.new_path()
    c.move_to(x, y - 0.36 * s)
    c.curve_to(x + 0.08 * s, y - 0.25 * s, x + 0.18 * s, y - 0.26 * s, x + 0.20 * s, y - 0.18 * s)
    c.curve_to(x + 0.28 * s, y - 0.12 * s, x + 0.30 * s, y + 0.08 * s, x + 0.22 * s, y + 0.22 * s)
    c.curve_to(x + 0.14 * s, y + 0.32 * s, x - 0.14 * s, y + 0.32 * s, x - 0.22 * s, y + 0.22 * s)
    c.curve_to(x - 0.30 * s, y + 0.08 * s, x - 0.28 * s, y - 0.10 * s, x - 0.20 * s, y - 0.18 * s)
    c.curve_to(x - 0.16 * s, y - 0.24 * s, x - 0.08 * s, y - 0.25 * s, x, y - 0.36 * s)
    c.close_path()
    c.set_source_rgb(*col_red)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Middle orange flame
    c.new_path()
    c.move_to(x + 0.01 * s, y - 0.24 * s)
    c.curve_to(x + 0.14 * s, y - 0.14 * s, x + 0.20 * s, y + 0.02 * s, x + 0.14 * s, y + 0.18 * s)
    c.curve_to(x + 0.08 * s, y + 0.26 * s, x - 0.08 * s, y + 0.26 * s, x - 0.14 * s, y + 0.18 * s)
    c.curve_to(x - 0.20 * s, y + 0.02 * s, x - 0.12 * s, y - 0.12 * s, x + 0.01 * s, y - 0.24 * s)
    c.close_path()
    c.set_source_rgb(*col_orange)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw_thin)
    c.stroke()

    # Inner yellow core
    c.new_path()
    c.move_to(x, y - 0.10 * s)
    c.curve_to(x + 0.08 * s, y - 0.02 * s, x + 0.10 * s, y + 0.10 * s, x + 0.06 * s, y + 0.20 * s)
    c.curve_to(x + 0.03 * s, y + 0.24 * s, x - 0.03 * s, y + 0.24 * s, x - 0.06 * s, y + 0.20 * s)
    c.curve_to(x - 0.10 * s, y + 0.10 * s, x - 0.06 * s, y - 0.02 * s, x, y - 0.10 * s)
    c.close_path()
    c.set_source_rgb(*col_yellow)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw_thin * 0.8)
    c.stroke()

    # Floating spark
    cv.ellipse(x + 0.16 * s, y - 0.32 * s, 0.022 * s, 0.032 * s, fill=col_orange, w=lw_thin, rot=0.4)


# ------------------------------------------------------------------ 13. rocket
def prop_rocket(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_hull = fc(style, rgb("#F8F9FA"))
    col_red = fc(style, rgb("#E63946"))
    col_glass = fc(style, rgb("#A8DADC"))
    col_flame = fc(style, rgb("#FFB703"))
    col_steel = fc(style, rgb("#475569"))

    c.save()
    c.translate(x, y)
    c.rotate(-0.70)

    # Exhaust flame
    flame_pts = [
        (-0.06 * s, 0.20 * s),
        (-0.12 * s, 0.36 * s),
        (-0.04 * s, 0.30 * s),
        (0, 0.42 * s),
        (0.04 * s, 0.30 * s),
        (0.12 * s, 0.36 * s),
        (0.06 * s, 0.20 * s),
    ]
    _poly(cv, flame_pts, fill=col_flame, w=lw, close=True)

    # Rocket nozzle
    cv.rrect(-0.08 * s, 0.18 * s, 0.16 * s, 0.05 * s, 0.015 * s, fill=col_steel, lw=lw)

    # Swept side fins
    fin_l = [
        (-0.12 * s, 0.08 * s),
        (-0.25 * s, 0.20 * s),
        (-0.22 * s, 0.23 * s),
        (-0.10 * s, 0.19 * s),
    ]
    _poly(cv, fin_l, fill=col_red, w=lw, close=True)
    fin_r = [
        (0.12 * s, 0.08 * s),
        (0.25 * s, 0.20 * s),
        (0.22 * s, 0.23 * s),
        (0.10 * s, 0.19 * s),
    ]
    _poly(cv, fin_r, fill=col_red, w=lw, close=True)

    # Fuselage
    c.new_path()
    c.move_to(0, -0.32 * s)
    c.curve_to(0.10 * s, -0.22 * s, 0.14 * s, -0.05 * s, 0.13 * s, 0.18 * s)
    c.line_to(-0.13 * s, 0.18 * s)
    c.curve_to(-0.14 * s, -0.05 * s, -0.10 * s, -0.22 * s, 0, -0.32 * s)
    c.close_path()
    c.set_source_rgb(*col_hull)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Red nose cone
    c.new_path()
    c.move_to(0, -0.32 * s)
    c.curve_to(0.06 * s, -0.26 * s, 0.09 * s, -0.20 * s, 0.10 * s, -0.16 * s)
    c.line_to(-0.10 * s, -0.16 * s)
    c.curve_to(-0.09 * s, -0.20 * s, -0.06 * s, -0.26 * s, 0, -0.32 * s)
    c.close_path()
    c.set_source_rgb(*col_red)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Center spine fin
    cv.rrect(-0.015 * s, 0.06 * s, 0.03 * s, 0.13 * s, 0.01 * s, fill=col_red, lw=lw_thin)

    # Porthole window
    cv.ellipse(0, -0.02 * s, 0.065 * s, 0.065 * s, fill=col_steel, w=lw)
    cv.ellipse(0, -0.02 * s, 0.048 * s, 0.048 * s, fill=col_glass, w=lw_thin)
    c.new_path()
    c.move_to(-0.02 * s, -0.05 * s)
    c.line_to(0.02 * s, 0.01 * s)
    c.set_source_rgb(*fc(style, rgb("#FFFFFF")))
    c.set_line_width(lw_thin * 1.2)
    c.stroke()

    c.restore()


# ------------------------------------------------------------------ 14. check
def prop_check(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_green = fc(style, rgb("#22C55E"))
    col_light = fc(style, rgb("#86EFAC"))

    # Stylized 6-vertex checkmark polygon with crisp inner corner
    pts = [
        (x - 0.28 * s, y - 0.02 * s),
        (x - 0.20 * s, y - 0.09 * s),
        (x - 0.08 * s, y + 0.06 * s),
        (x + 0.24 * s, y - 0.27 * s),
        (x + 0.31 * s, y - 0.20 * s),
        (x - 0.08 * s, y + 0.25 * s),
    ]
    _poly(cv, pts, fill=col_green, w=lw, close=True)

    # Interior highlight facet
    c.new_path()
    c.move_to(x - 0.20 * s, y - 0.07 * s)
    c.line_to(x - 0.08 * s, y + 0.06 * s)
    c.line_to(x + 0.24 * s, y - 0.24 * s)
    c.set_source_rgb(*col_light)
    c.set_line_width(lw_thin * 1.4)
    c.stroke()


# ------------------------------------------------------------------ 15. cross
def prop_cross(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_red = fc(style, rgb("#EF233C"))
    col_light = fc(style, rgb("#FFA69E"))

    arm_w = 0.15 * s
    span = 0.26 * s

    c.set_line_cap(cairo.LINE_CAP_ROUND)
    c.set_line_join(cairo.LINE_JOIN_ROUND)

    # Outer black stroke
    for (x1, y1, x2, y2) in (
        (x - span, y - span, x + span, y + span),
        (x - span, y + span, x + span, y - span)
    ):
        c.new_path()
        c.move_to(x1, y1)
        c.line_to(x2, y2)
        c.set_source_rgb(*INK)
        c.set_line_width(arm_w + lw * 2)
        c.stroke()

    # Inner red fill
    for (x1, y1, x2, y2) in (
        (x - span, y - span, x + span, y + span),
        (x - span, y + span, x + span, y - span)
    ):
        c.new_path()
        c.move_to(x1, y1)
        c.line_to(x2, y2)
        c.set_source_rgb(*col_red)
        c.set_line_width(arm_w)
        c.stroke()

    # Bevel highlight
    c.new_path()
    c.move_to(x - span + 0.02 * s, y - span - 0.02 * s)
    c.line_to(x + 0.02 * s, y - 0.02 * s)
    c.move_to(x - span + 0.02 * s, y + span - 0.02 * s)
    c.line_to(x - 0.02 * s, y + 0.02 * s)
    c.set_source_rgb(*col_light)
    c.set_line_width(lw_thin * 1.3)
    c.stroke()


# ------------------------------------------------------------------ 16. question
def prop_question(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_blue = fc(style, rgb("#3A86FF"))
    col_light = fc(style, rgb("#93C5FD"))
    arm_w = 0.13 * s

    c.set_line_cap(cairo.LINE_CAP_ROUND)
    c.set_line_join(cairo.LINE_JOIN_ROUND)

    def _draw_hook():
        c.new_path()
        c.move_to(x - 0.14 * s, y - 0.14 * s)
        c.curve_to(x - 0.14 * s, y - 0.32 * s, x + 0.18 * s, y - 0.32 * s, x + 0.18 * s, y - 0.14 * s)
        c.curve_to(x + 0.18 * s, y - 0.02 * s, x, y - 0.04 * s, x, y + 0.08 * s)

    _draw_hook()
    c.set_source_rgb(*INK)
    c.set_line_width(arm_w + lw * 2)
    c.stroke()

    _draw_hook()
    c.set_source_rgb(*col_blue)
    c.set_line_width(arm_w)
    c.stroke()

    c.new_path()
    c.arc(x, y - 0.14 * s, 0.16 * s, -math.pi * 0.85, -math.pi * 0.25)
    c.set_source_rgb(*col_light)
    c.set_line_width(lw_thin * 1.4)
    c.stroke()

    # Lower dot
    dot_y = y + 0.25 * s
    dot_r = arm_w * 0.52
    cv.ellipse(x, dot_y, dot_r, dot_r, fill=col_blue, w=lw)
    cv.ellipse(x - dot_r * 0.3, dot_y - dot_r * 0.3, dot_r * 0.25, dot_r * 0.25, fill=col_light, w=0)


# ------------------------------------------------------------------ 17. exclamation
def prop_exclamation(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_orange = fc(style, rgb("#FF5400"))
    col_light = fc(style, rgb("#FFBD59"))

    c.save()
    c.translate(x, y)
    c.rotate(0.08)

    top_w = 0.16 * s
    bot_w = 0.09 * s
    bar_top = -0.30 * s
    bar_bot = 0.09 * s

    c.new_path()
    c.arc(-top_w / 2 + 0.04 * s, bar_top + 0.04 * s, 0.04 * s, math.pi, -math.pi / 2)
    c.arc(top_w / 2 - 0.04 * s, bar_top + 0.04 * s, 0.04 * s, -math.pi / 2, 0)
    c.line_to(bot_w / 2, bar_bot - 0.02 * s)
    c.arc(0, bar_bot - 0.02 * s, bot_w / 2, 0, math.pi)
    c.line_to(-top_w / 2, bar_top + 0.04 * s)
    c.close_path()

    c.set_source_rgb(*col_orange)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    c.new_path()
    c.move_to(-top_w / 2 + 0.03 * s, bar_top + 0.06 * s)
    c.line_to(-bot_w / 2 + 0.02 * s, bar_bot - 0.04 * s)
    c.set_source_rgb(*col_light)
    c.set_line_width(lw_thin * 1.3)
    c.stroke()

    # Dot
    dot_y = 0.25 * s
    dot_r = 0.055 * s
    cv.ellipse(0, dot_y, dot_r, dot_r, fill=col_orange, w=lw)
    cv.ellipse(-dot_r * 0.3, dot_y - dot_r * 0.3, dot_r * 0.25, dot_r * 0.25, fill=col_light, w=0)

    # Energy impact sparks
    sparks = [
        (-0.20 * s, -0.26 * s, -0.12 * s, -0.22 * s),
        (0, -0.38 * s, 0, -0.33 * s),
        (0.20 * s, -0.26 * s, 0.12 * s, -0.22 * s),
    ]
    for x1, y1, x2, y2 in sparks:
        c.new_path()
        c.move_to(x1, y1)
        c.line_to(x2, y2)
        c.set_source_rgb(*INK)
        c.set_line_width(lw_thin * 1.3)
        c.stroke()

    c.restore()


# ------------------------------------------------------------------ 18. stopwatch
def prop_stopwatch(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_case = fc(style, rgb("#475569"))
    col_dial = fc(style, rgb("#FFFFFF"))
    col_red = fc(style, rgb("#E63946"))
    col_steel = fc(style, rgb("#CBD5E1"))

    cy = y + 0.04 * s
    body_r = 0.30 * s
    dial_r = 0.23 * s

    # Top loop ring
    c.new_path()
    c.arc(x, cy - body_r - 0.10 * s, 0.065 * s, 0, 2 * math.pi)
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Top button
    cv.rrect(x - 0.035 * s, cy - body_r - 0.08 * s, 0.07 * s, 0.08 * s, 0.01 * s, fill=col_steel, lw=lw)

    # Side buttons
    for ang in (-0.75, 0.75):
        bx = x + (body_r + 0.02 * s) * math.sin(ang)
        by = cy - (body_r + 0.02 * s) * math.cos(ang)
        c.save()
        c.translate(bx, by)
        c.rotate(ang)
        cv.rrect(-0.025 * s, -0.025 * s, 0.05 * s, 0.035 * s, 0.008 * s, fill=col_steel, lw=lw_thin)
        c.restore()

    # Casing and dial
    cv.ellipse(x, cy, body_r, body_r, fill=col_case, w=lw)
    cv.ellipse(x, cy, dial_r, dial_r, fill=col_dial, w=lw)

    # Secondary 30-min sub-dial at top-center
    sub_y = cy - dial_r * 0.42
    sub_r = dial_r * 0.32
    cv.ellipse(x, sub_y, sub_r, sub_r, fill=col_dial, w=lw_thin * 0.8)
    for si in range(4):
        srad = si * math.pi / 2
        c.new_path()
        c.move_to(x + (sub_r - 0.015 * s) * math.sin(srad), sub_y - (sub_r - 0.015 * s) * math.cos(srad))
        c.line_to(x + sub_r * math.sin(srad), sub_y - sub_r * math.cos(srad))
        c.set_source_rgb(*INK)
        c.set_line_width(lw_thin * 0.7)
        c.stroke()
    # Sub-dial tiny hand
    c.new_path()
    c.move_to(x, sub_y)
    c.line_to(x + sub_r * 0.7 * math.sin(0.8), sub_y - sub_r * 0.7 * math.cos(0.8))
    c.set_source_rgb(*col_red)
    c.set_line_width(lw_thin * 0.8)
    c.stroke()

    # Main dial ticks
    for i in range(12):
        rad = i * math.pi / 6
        is_major = (i % 3 == 0)
        tick_len = 0.035 * s if is_major else 0.020 * s
        w_tick = lw if is_major else lw_thin
        c.new_path()
        c.move_to(x + (dial_r - tick_len) * math.sin(rad), cy - (dial_r - tick_len) * math.cos(rad))
        c.line_to(x + (dial_r - 0.005 * s) * math.sin(rad), cy - (dial_r - 0.005 * s) * math.cos(rad))
        c.set_source_rgb(*INK)
        c.set_line_width(w_tick)
        c.stroke()

    # Needle pointing at ~12 seconds
    n_rad = math.radians(72)
    c.new_path()
    c.move_to(x - 0.04 * s * math.sin(n_rad), cy + 0.04 * s * math.cos(n_rad))
    c.line_to(x + (dial_r - 0.03 * s) * math.sin(n_rad), cy - (dial_r - 0.03 * s) * math.cos(n_rad))
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    cv.ellipse(x, cy, 0.025 * s, 0.025 * s, fill=col_red, w=lw_thin)


# ------------------------------------------------------------------ 19. trash_pile
def prop_trash_pile(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_paper = fc(style, rgb("#FDFBF7"))
    col_rule = fc(style, rgb("#93C5FD"))
    col_margin = fc(style, rgb("#F87171"))

    # Bottom wrinkled paper sheet lying flat
    sheet_pts = [
        (x - 0.34 * s, y + 0.16 * s),
        (x - 0.10 * s, y + 0.14 * s),
        (x + 0.28 * s, y + 0.12 * s),
        (x + 0.34 * s, y + 0.18 * s),
        (x + 0.30 * s, y + 0.28 * s),
        (x - 0.05 * s, y + 0.29 * s),
        (x - 0.32 * s, y + 0.27 * s),
    ]
    _poly(cv, sheet_pts, fill=col_paper, w=lw, close=True)
    if style == "professor":
        for ly in (0.17 * s, 0.21 * s, 0.25 * s):
            c.new_path()
            c.move_to(x - 0.28 * s, y + ly)
            c.line_to(x + 0.26 * s, y + ly - 0.02 * s)
            c.set_source_rgb(*col_rule)
            c.set_line_width(lw_thin * 0.9)
            c.stroke()

    def _draw_ball(bx, by, br, lines=False, scribble=False, margin=False):
        # Jagged polygon vertices mimicking crumpled paper crinkles
        offsets = [
            (0.05, -0.98), (0.45, -0.85), (0.85, -0.55), (0.98, -0.05),
            (0.80, 0.55), (0.45, 0.90), (-0.10, 0.98), (-0.65, 0.80),
            (-0.95, 0.35), (-0.90, -0.30), (-0.55, -0.75)
        ]
        pts = [(bx + ox * br, by + oy * br) for ox, oy in offsets]
        _poly(cv, pts, fill=col_paper, w=lw, close=True)

        if lines and style == "professor":
            for ly in (-0.35 * br, 0, 0.35 * br):
                c.new_path()
                c.move_to(bx - 0.60 * br, by + ly)
                c.line_to(bx + 0.60 * br, by + ly)
                c.set_source_rgb(*col_rule)
                c.set_line_width(lw_thin * 0.8)
                c.stroke()

        if margin and style == "professor":
            c.new_path()
            c.move_to(bx - 0.30 * br, by - 0.65 * br)
            c.line_to(bx - 0.30 * br, by + 0.65 * br)
            c.set_source_rgb(*col_margin)
            c.set_line_width(lw_thin * 0.8)
            c.stroke()

        # Sharp crinkle creases radiating inward
        creases = [
            [(bx - 0.85 * br, by - 0.15 * br), (bx - 0.20 * br, by + 0.10 * br), (bx + 0.65 * br, by - 0.25 * br)],
            [(bx - 0.20 * br, by + 0.10 * br), (bx + 0.20 * br, by + 0.75 * br)],
            [(bx - 0.35 * br, by - 0.70 * br), (bx - 0.15 * br, by - 0.15 * br), (bx + 0.75 * br, by + 0.20 * br)],
            [(bx + 0.30 * br, by - 0.75 * br), (bx + 0.15 * br, by - 0.30 * br)],
            [(bx - 0.70 * br, by + 0.55 * br), (bx - 0.35 * br, by + 0.30 * br)],
        ]
        for cr in creases:
            c.new_path()
            c.move_to(*cr[0])
            for pt in cr[1:]:
                c.line_to(*pt)
            c.set_source_rgb(*INK)
            c.set_line_width(lw_thin)
            c.stroke()

        if scribble:
            c.new_path()
            c.move_to(bx - 0.22 * br, by - 0.22 * br)
            c.line_to(bx + 0.22 * br, by + 0.22 * br)
            c.move_to(bx + 0.22 * br, by - 0.22 * br)
            c.line_to(bx - 0.22 * br, by + 0.22 * br)
            c.set_source_rgb(*INK)
            c.set_line_width(lw_thin * 1.3)
            c.stroke()

    # Heap of crumpled balls
    _draw_ball(x - 0.20 * s, y + 0.10 * s, 0.14 * s, lines=True, margin=True)
    _draw_ball(x + 0.20 * s, y + 0.10 * s, 0.13 * s, lines=False)
    _draw_ball(x + 0.01 * s, y + 0.13 * s, 0.15 * s, scribble=True)
    _draw_ball(x - 0.08 * s, y - 0.05 * s, 0.135 * s, lines=True)
    _draw_ball(x + 0.12 * s, y - 0.07 * s, 0.13 * s, lines=False)


# ------------------------------------------------------------------ 20. umbrella
def prop_umbrella(cv, x, y, s, style):
    lw = _lw(s)
    lw_thin = _thin(s)
    c = cv.c

    col_blue = fc(style, rgb("#3A86FF"))
    col_yellow = fc(style, rgb("#FFD166"))
    col_wood = fc(style, rgb("#BC6C25"))
    col_steel = fc(style, rgb("#CBD5E1"))

    # Top ferrule tip
    cv.rrect(x - 0.015 * s, y - 0.33 * s, 0.03 * s, 0.08 * s, 0.01 * s, fill=col_steel, lw=lw)
    cv.ellipse(x, y - 0.33 * s, 0.02 * s, 0.02 * s, fill=col_steel, w=lw_thin)

    # Central shaft
    c.new_path()
    c.move_to(x, y - 0.24 * s)
    c.line_to(x, y + 0.20 * s)
    c.set_source_rgb(*INK)
    c.set_line_width(lw * 1.2)
    c.stroke()

    # Full canopy dome outline
    c.new_path()
    c.move_to(x - 0.36 * s, y - 0.02 * s)
    c.curve_to(x - 0.36 * s, y - 0.22 * s, x - 0.18 * s, y - 0.26 * s, x, y - 0.26 * s)
    c.curve_to(x + 0.18 * s, y - 0.26 * s, x + 0.36 * s, y - 0.22 * s, x + 0.36 * s, y - 0.02 * s)
    # Scallops from right to left
    c.curve_to(x + 0.27 * s, y - 0.06 * s, x + 0.27 * s, y - 0.06 * s, x + 0.18 * s, y - 0.02 * s)
    c.curve_to(x + 0.09 * s, y - 0.06 * s, x + 0.09 * s, y - 0.06 * s, x, y - 0.02 * s)
    c.curve_to(x - 0.09 * s, y - 0.06 * s, x - 0.09 * s, y - 0.06 * s, x - 0.18 * s, y - 0.02 * s)
    c.curve_to(x - 0.27 * s, y - 0.06 * s, x - 0.27 * s, y - 0.06 * s, x - 0.36 * s, y - 0.02 * s)
    c.close_path()
    c.set_source_rgb(*col_blue)
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Yellow panels (panel 2: -0.18 to 0, panel 4: 0.18 to 0.36)
    for (x_left, x_right) in ((-0.18 * s, 0), (0.18 * s, 0.36 * s)):
        c.new_path()
        c.move_to(x, y - 0.26 * s)
        c.curve_to(x + x_left * 0.5, y - 0.18 * s, x + x_left + 0.02 * s, y - 0.08 * s, x + x_left, y - 0.02 * s)
        c.curve_to(x + (x_left + x_right) / 2, y - 0.06 * s, x + (x_left + x_right) / 2, y - 0.06 * s, x + x_right, y - 0.02 * s)
        c.curve_to(x + x_right - 0.02 * s, y - 0.08 * s, x + x_right * 0.5, y - 0.18 * s, x, y - 0.26 * s)
        c.close_path()
        c.set_source_rgb(*col_yellow)
        c.fill_preserve()
        c.set_source_rgb(*INK)
        c.set_line_width(lw)
        c.stroke()

    # Inner rib lines
    for xr in (-0.18 * s, 0, 0.18 * s):
        c.new_path()
        c.move_to(x, y - 0.26 * s)
        c.curve_to(x + xr * 0.5, y - 0.16 * s, x + xr * 0.9, y - 0.08 * s, x + xr, y - 0.02 * s)
        c.set_source_rgb(*INK)
        c.set_line_width(lw_thin * 1.2)
        c.stroke()

    # Tiny round rib tips
    for xr in (-0.36 * s, -0.18 * s, 0, 0.18 * s, 0.36 * s):
        cv.ellipse(x + xr, y - 0.02 * s, 0.012 * s, 0.012 * s, fill=col_steel, w=lw_thin * 0.7)

    # J-hook Handle
    c.new_path()
    c.move_to(x, y + 0.18 * s)
    c.line_to(x, y + 0.28 * s)
    c.arc(x - 0.045 * s, y + 0.28 * s, 0.045 * s, 0, math.pi)
    c.line_to(x - 0.09 * s, y + 0.25 * s)
    c.set_line_cap(cairo.LINE_CAP_ROUND)
    c.set_source_rgb(*INK)
    c.set_line_width(lw * 2.4)
    c.stroke_preserve()
    c.set_source_rgb(*col_wood)
    c.set_line_width(lw * 1.6)
    c.stroke()

    # Metal ferrule ring on handle
    cv.rrect(x - 0.025 * s, y + 0.19 * s, 0.05 * s, 0.02 * s, 0.005 * s, fill=col_steel, lw=lw_thin)

    # Raindrops
    drops = [(x - 0.28 * s, y + 0.18 * s), (x + 0.26 * s, y + 0.22 * s)]
    for dx, dy in drops:
        cv.ellipse(dx, dy, 0.015 * s, 0.025 * s, fill=fc(style, rgb("#00B4D8")), w=lw_thin, rot=-0.2)


PROPS = {
    "car": prop_car,
    "house": prop_house,
    "dumbbell": prop_dumbbell,
    "scale": prop_scale,
    "shoes": prop_shoes,
    "apple": prop_apple,
    "burger": prop_burger,
    "pizza": prop_pizza,
    "bottle": prop_bottle,
    "cup": prop_cup,
    "heart": prop_heart,
    "fire": prop_fire,
    "rocket": prop_rocket,
    "check": prop_check,
    "cross": prop_cross,
    "question": prop_question,
    "exclamation": prop_exclamation,
    "stopwatch": prop_stopwatch,
    "trash_pile": prop_trash_pile,
    "umbrella": prop_umbrella,
}


if __name__ == "__main__":
    prop_names = list(PROPS.keys())
    cols = 5
    rows_per_section = 4
    cell_size = 380
    w = cols * cell_size
    h = rows_per_section * cell_size * 2

    for style in ("professor", "stickman"):
        cv = Canvas(bg=PAPER, w=w, h=h)

        for row in range(rows_per_section * 2):
            bg = PAPER if row < rows_per_section else rgb("#E0A911")
            for col in range(cols):
                cx = col * cell_size + cell_size // 2
                cy = row * cell_size + cell_size // 2

                # Cell background
                cv.c.new_path()
                cv.c.rectangle(col * cell_size, row * cell_size, cell_size, cell_size)
                cv.c.set_source_rgb(*bg)
                cv.c.fill()

                idx = (row % rows_per_section) * cols + col
                if idx < len(prop_names):
                    name = prop_names[idx]
                    fn = PROPS[name]
                    fn(cv, cx, cy - 15, 290, style)

                    # Label
                    cv.c.select_font_face("Sans", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
                    cv.c.set_font_size(18)
                    cv.c.set_source_rgb(*INK)
                    ext = cv.c.text_extents(name)
                    cv.c.move_to(cx - ext.width / 2, cy + cell_size // 2 - 25)
                    cv.c.show_text(name)

        out_path = f"/tmp/props_props_life_{style}.png"
        cv.save(out_path)
        print(f"Saved contact sheet to {out_path}")
