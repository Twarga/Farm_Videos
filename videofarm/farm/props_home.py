"""Home props module for explainer vector illustration engine.
Exports PROPS with 20 everyday home objects:
desk, chair, couch, bed, lamp, tv, window, door, plant, bookshelf,
mirror, clock, alarm_clock, mug, fridge, trash_can, stairs, table, sink, bell.
"""
import math
import cairo
from farm.art import Canvas, INK, PAPER, BG, OL, rgb, shade, fc


def poly(cv, pts, fill=None, lw=0, close=True):
    """Draw a straight-edged polygon with optional fill and outline."""
    c = cv.c
    c.new_path()
    c.move_to(*pts[0])
    for p in pts[1:]:
        c.line_to(*p)
    if close:
        c.close_path()
    if fill is not None:
        c.set_source_rgb(*fill)
        if lw:
            c.fill_preserve()
        else:
            c.fill()
    if lw:
        c.set_source_rgb(*INK)
        c.set_line_width(lw)
        c.stroke()
    else:
        c.new_path()


def polyline(cv, pts, lw, color=INK):
    """Draw a connected series of straight line segments."""
    c = cv.c
    c.new_path()
    c.move_to(*pts[0])
    for p in pts[1:]:
        c.line_to(*p)
    c.set_source_rgb(*color)
    c.set_line_width(lw)
    c.stroke()
    c.new_path()


def draw_ellipse(cv, cx, cy, rx, ry, fill=None, w=OL, rot=0):
    """Safe ellipse wrapper that ensures cairo context has no lingering path."""
    cv.c.new_path()
    cv.ellipse(cx, cy, rx, ry, fill=fill, w=w, rot=rot)


# ==============================================================================
# 1. DESK (side view desk with drawers)
# ==============================================================================
def prop_desk(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    w = s * 0.8
    h = s * 0.52
    top_y = y - h * 0.35
    bot_y = y + h * 0.5

    col_top = rgb("#d97706")
    col_body = rgb("#b45309")
    col_drawer = rgb("#f59e0b")
    col_mat = rgb("#0284c7")

    # Modesty panel in kneehole
    ped_w = w * 0.44
    ped_x = x + w * 0.5 - ped_w
    knee_x = x - w * 0.5 + s * 0.08
    poly(cv, [(knee_x, top_y + s * 0.06), (ped_x, top_y + s * 0.06),
              (ped_x, top_y + s * 0.3), (knee_x, top_y + s * 0.3)],
         fill=fc(style, rgb("#78350f")), lw=th)

    # Left leg - Rear shadow leg
    poly(cv, [(x - w * 0.5 + s * 0.13, top_y + s * 0.06),
              (x - w * 0.5 + s * 0.17, top_y + s * 0.06),
              (x - w * 0.5 + s * 0.17, bot_y - s * 0.02),
              (x - w * 0.5 + s * 0.13, bot_y - s * 0.02)],
         fill=fc(style, rgb("#78350f")), lw=th)

    # Left leg - Front main leg
    poly(cv, [(x - w * 0.5 + s * 0.06, top_y + s * 0.06),
              (x - w * 0.5 + s * 0.11, top_y + s * 0.06),
              (x - w * 0.5 + s * 0.11, bot_y),
              (x - w * 0.5 + s * 0.06, bot_y)],
         fill=fc(style, col_body), lw=lw)
    # Foot pad
    cv.rrect(x - w * 0.5 + s * 0.045, bot_y - s * 0.02, s * 0.08, s * 0.02, s * 0.006,
             fill=fc(style, rgb("#334155")), lw=th)

    # Drawer pedestal cabinet
    cv.rrect(ped_x, top_y + s * 0.06, ped_w, bot_y - (top_y + s * 0.06), s * 0.015,
             fill=fc(style, col_body), lw=lw)

    # 3 Drawers with handles
    ped_h = bot_y - (top_y + s * 0.06) - s * 0.025
    dh = ped_h / 3.0
    for i in range(3):
        dy = top_y + s * 0.07 + i * dh
        cv.rrect(ped_x + s * 0.02, dy, ped_w - s * 0.04, dh - s * 0.016, s * 0.012,
                 fill=fc(style, col_drawer), lw=th)
        # Drawer handle (sleek bar)
        cv.rrect(ped_x + ped_w * 0.5 - s * 0.04, dy + dh * 0.5 - s * 0.012,
                 s * 0.08, s * 0.016, s * 0.008,
                 fill=fc(style, rgb("#f1f5f9")), lw=th)

    # Plinth base under pedestal
    poly(cv, [(ped_x + s * 0.03, bot_y - s * 0.02),
              (ped_x + ped_w - s * 0.03, bot_y - s * 0.02),
              (ped_x + ped_w - s * 0.03, bot_y),
              (ped_x + s * 0.03, bot_y)],
         fill=fc(style, rgb("#451a03")), lw=th)

    # Desktop top surface slab
    cv.rrect(x - w * 0.5, top_y, w, s * 0.07, s * 0.02,
             fill=fc(style, col_top), lw=lw)
    # Highlight strip on top bevel
    cv.line([(x - w * 0.47, top_y + s * 0.02), (x + w * 0.47, top_y + s * 0.02)],
            w=th, color=shade(col_top, 1.25) if style == "professor" else INK)

    # Desk items: Desk blotter pad & pencil cup with pencils
    cv.rrect(x - s * 0.08, top_y - s * 0.016, s * 0.28, s * 0.016, s * 0.005,
             fill=fc(style, col_mat), lw=th)
    cup_x = x - w * 0.5 + s * 0.08
    cv.rrect(cup_x, top_y - s * 0.09, s * 0.065, s * 0.09, s * 0.01,
             fill=fc(style, rgb("#0284c7")), lw=th)
    polyline(cv, [(cup_x + s * 0.02, top_y - s * 0.08), (cup_x - s * 0.01, top_y - s * 0.15)],
             lw=th * 1.3, color=rgb("#ef4444") if style == "professor" else INK)
    polyline(cv, [(cup_x + s * 0.045, top_y - s * 0.08), (cup_x + s * 0.07, top_y - s * 0.16)],
             lw=th * 1.3, color=rgb("#fbbf24") if style == "professor" else INK)
    cv.c.new_path()


# ==============================================================================
# 2. CHAIR (office chair)
# ==============================================================================
def prop_chair(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    col_cushion = rgb("#2563eb")
    col_cushion_dark = rgb("#1d4ed8")
    col_base = rgb("#334155")
    col_metal = rgb("#94a3b8")

    base_y = y + s * 0.32
    hub_y = y + s * 0.23

    # 5-star swivel base: 2 rear legs, 3 front legs
    for lx, ly in ((x - s * 0.16, base_y - s * 0.05), (x + s * 0.16, base_y - s * 0.05)):
        polyline(cv, [(x, hub_y), (lx, ly)], lw=lw, color=col_base if style == "professor" else INK)
        draw_ellipse(cv, lx, ly, s * 0.024, s * 0.02, fill=fc(style, rgb("#1e293b")), w=th)

    for lx, ly in ((x - s * 0.22, base_y), (x, base_y + s * 0.02), (x + s * 0.22, base_y)):
        polyline(cv, [(x, hub_y), (lx, ly - s * 0.015)], lw=lw * 1.15, color=INK)
        draw_ellipse(cv, lx, ly, s * 0.028, s * 0.022, fill=fc(style, rgb("#1e293b")), w=th)

    # Central hub & pneumatic cylinder
    cv.rrect(x - s * 0.04, hub_y - s * 0.02, s * 0.08, s * 0.04, s * 0.01,
             fill=fc(style, col_base), lw=th)
    cv.rrect(x - s * 0.022, y + s * 0.1, s * 0.044, hub_y - (y + s * 0.1), s * 0.008,
             fill=fc(style, col_metal), lw=lw)

    # Under-seat mounting bracket
    cv.rrect(x - s * 0.1, y + s * 0.08, s * 0.2, s * 0.03, s * 0.008,
             fill=fc(style, col_base), lw=th)

    # Armrests: Left and Right T-brackets with padded pads
    poly(cv, [(x - s * 0.18, y + s * 0.06), (x - s * 0.25, y + s * 0.06),
              (x - s * 0.25, y - s * 0.06), (x - s * 0.18, y - s * 0.06)],
         fill=None, lw=lw, close=False)
    cv.rrect(x - s * 0.28, y - s * 0.09, s * 0.13, s * 0.032, s * 0.012,
             fill=fc(style, col_base), lw=th)

    poly(cv, [(x + s * 0.18, y + s * 0.06), (x + s * 0.25, y + s * 0.06),
              (x + s * 0.25, y - s * 0.06), (x + s * 0.18, y - s * 0.06)],
         fill=None, lw=lw, close=False)
    cv.rrect(x + s * 0.15, y - s * 0.09, s * 0.13, s * 0.032, s * 0.012,
             fill=fc(style, col_base), lw=th)

    # Backrest spine support
    cv.rrect(x - s * 0.035, y - s * 0.15, s * 0.07, s * 0.24, s * 0.01,
             fill=fc(style, col_base), lw=th)

    # Backrest cushion
    cv.rrect(x - s * 0.2, y - s * 0.36, s * 0.4, s * 0.4, s * 0.08,
             fill=fc(style, col_cushion), lw=lw)
    cv.line([(x, y - s * 0.33), (x, y - s * 0.02)], w=th,
            color=shade(col_cushion, 0.75) if style == "professor" else INK)

    # Seat cushion
    cv.rrect(x - s * 0.24, y + s * 0.02, s * 0.48, s * 0.1, s * 0.04,
             fill=fc(style, col_cushion_dark), lw=lw)
    cv.line([(x - s * 0.18, y + s * 0.045), (x + s * 0.18, y + s * 0.045)],
            w=th, color=shade(col_cushion_dark, 1.3) if style == "professor" else INK)
    cv.c.new_path()


# ==============================================================================
# 3. COUCH
# ==============================================================================
def prop_couch(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    w = s * 0.84
    h = s * 0.52
    col_sofa = rgb("#e05244")
    col_dark = rgb("#c53d30")
    col_wood = rgb("#78350f")
    col_pillow = rgb("#f59e0b")

    leg_top = y + h * 0.28
    leg_bot = y + h * 0.5

    # 4 Tapered wooden peg legs
    poly(cv, [(x - w * 0.36, leg_top), (x - w * 0.33, leg_top),
              (x - w * 0.37, leg_bot), (x - w * 0.4, leg_bot)],
         fill=fc(style, rgb("#451a03")), lw=th)
    poly(cv, [(x + w * 0.33, leg_top), (x + w * 0.36, leg_top),
              (x + w * 0.4, leg_bot), (x + w * 0.37, leg_bot)],
         fill=fc(style, rgb("#451a03")), lw=th)

    poly(cv, [(x - w * 0.42, leg_top), (x - w * 0.38, leg_top),
              (x - w * 0.44, leg_bot), (x - w * 0.47, leg_bot)],
         fill=fc(style, col_wood), lw=lw)
    poly(cv, [(x + w * 0.38, leg_top), (x + w * 0.42, leg_top),
              (x + w * 0.47, leg_bot), (x + w * 0.44, leg_bot)],
         fill=fc(style, col_wood), lw=lw)

    # Base wooden rail under sofa
    cv.rrect(x - w * 0.48, leg_top - s * 0.02, w * 0.96, s * 0.035, s * 0.01,
             fill=fc(style, col_wood), lw=lw)

    # Backrest (2 large puffy cushions)
    cush_w = (w * 0.74) / 2.0
    back_y = y - h * 0.42
    back_h = h * 0.54
    cv.rrect(x - w * 0.37, back_y, cush_w - s * 0.01, back_h, s * 0.06,
             fill=fc(style, col_sofa), lw=lw)
    cv.rrect(x + s * 0.01, back_y, cush_w - s * 0.01, back_h, s * 0.06,
             fill=fc(style, col_sofa), lw=lw)

    # Tufting horizontal creases
    cv.line([(x - w * 0.33, back_y + back_h * 0.4), (x - w * 0.05, back_y + back_h * 0.4)],
            w=th, color=shade(col_sofa, 0.75) if style == "professor" else INK)
    cv.line([(x + w * 0.05, back_y + back_h * 0.4), (x + w * 0.33, back_y + back_h * 0.4)],
            w=th, color=shade(col_sofa, 0.75) if style == "professor" else INK)

    # Plump seat cushions
    seat_y = y + s * 0.01
    seat_h = s * 0.14
    cv.rrect(x - w * 0.38, seat_y, cush_w + s * 0.005, seat_h, s * 0.03,
             fill=fc(style, col_dark), lw=lw)
    cv.rrect(x - s * 0.005, seat_y, cush_w + s * 0.005, seat_h, s * 0.03,
             fill=fc(style, col_dark), lw=lw)

    # Cozy square throw pillow
    poly(cv, [(x - w * 0.33, seat_y - s * 0.1), (x - w * 0.18, seat_y - s * 0.14),
              (x - w * 0.15, seat_y + s * 0.03), (x - w * 0.3, seat_y + s * 0.07)],
         fill=fc(style, col_pillow), lw=lw)
    cv.line([(x - w * 0.26, seat_y - s * 0.04), (x - w * 0.22, seat_y - s * 0.04)],
            w=th, color=rgb("#b45309") if style == "professor" else INK)

    # Armrests
    arm_w = s * 0.14
    arm_h = s * 0.28
    arm_y = y - s * 0.1
    cv.rrect(x - w * 0.5, arm_y, arm_w, arm_h, s * 0.05,
             fill=fc(style, col_sofa), lw=lw)
    cv.rrect(x + w * 0.5 - arm_w, arm_y, arm_w, arm_h, s * 0.05,
             fill=fc(style, col_sofa), lw=lw)
    cv.c.new_path()


# ==============================================================================
# 4. BED (with pillow and blanket)
# ==============================================================================
def prop_bed(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    w = s * 0.8
    col_wood = rgb("#854d0e")
    col_blanket = rgb("#1d4ed8")
    col_blanket_dark = rgb("#1e3a8a")
    col_sheet = rgb("#f8fafc")

    hb_top = y - s * 0.36
    hb_bot = y + s * 0.05

    # Headboard main backboard
    cv.rrect(x - w * 0.44, hb_top + s * 0.04, w * 0.88, hb_bot - (hb_top + s * 0.04), s * 0.02,
             fill=fc(style, col_wood), lw=lw)
    cv.rrect(x - w * 0.48, hb_top + s * 0.01, w * 0.96, s * 0.05, s * 0.015,
             fill=fc(style, rgb("#78350f")), lw=lw)
    cv.rrect(x - w * 0.48, hb_top - s * 0.03, s * 0.06, s * 0.4, s * 0.015,
             fill=fc(style, col_wood), lw=lw)
    draw_ellipse(cv, x - w * 0.45, hb_top - s * 0.035, s * 0.03, s * 0.03, fill=fc(style, col_wood), w=lw)
    cv.rrect(x + w * 0.42, hb_top - s * 0.03, s * 0.06, s * 0.4, s * 0.015,
             fill=fc(style, col_wood), lw=lw)
    draw_ellipse(cv, x + w * 0.45, hb_top - s * 0.035, s * 0.03, s * 0.03, fill=fc(style, col_wood), w=lw)

    for gx in (x - w * 0.25, x, x + w * 0.25):
        cv.line([(gx, hb_top + s * 0.08), (gx, hb_bot - s * 0.05)], w=th, color=INK)

    # Two fluffy white pillows
    pil_w = w * 0.38
    pil_h = s * 0.16
    pil_y = y - s * 0.17
    cv.rrect(x - w * 0.4, pil_y, pil_w, pil_h, s * 0.04,
             fill=fc(style, col_sheet), lw=lw)
    cv.line([(x - w * 0.25, pil_y + s * 0.04), (x - w * 0.17, pil_y + s * 0.1)],
            w=th, color=shade(col_sheet, 0.75) if style == "professor" else INK)

    cv.rrect(x + w * 0.02, pil_y, pil_w, pil_h, s * 0.04,
             fill=fc(style, col_sheet), lw=lw)
    cv.line([(x + w * 0.17, pil_y + s * 0.04), (x + w * 0.25, pil_y + s * 0.1)],
            w=th, color=shade(col_sheet, 0.75) if style == "professor" else INK)

    # Turned-down crisp sheet fold
    sheet_y = y - s * 0.06
    cv.rrect(x - w * 0.42, sheet_y, w * 0.84, s * 0.08, s * 0.02,
             fill=fc(style, col_sheet), lw=lw)

    # Main cozy duvet
    duvet_y = y - s * 0.01
    duvet_h = s * 0.26
    cv.rrect(x - w * 0.43, duvet_y, w * 0.86, duvet_h, s * 0.03,
             fill=fc(style, col_blanket), lw=lw)

    for qx in (x - w * 0.2, x, x + w * 0.2):
        cv.line([(qx, duvet_y + s * 0.03), (qx, duvet_y + duvet_h - s * 0.03)],
                w=th, color=col_blanket_dark if style == "professor" else INK)

    # Footboard & front legs
    fb_y = duvet_y + duvet_h - s * 0.03
    cv.rrect(x - w * 0.46, fb_y - s * 0.02, s * 0.07, s * 0.14, s * 0.015,
             fill=fc(style, col_wood), lw=lw)
    cv.rrect(x + w * 0.39, fb_y - s * 0.02, s * 0.07, s * 0.14, s * 0.015,
             fill=fc(style, col_wood), lw=lw)
    cv.rrect(x - w * 0.44, fb_y, w * 0.88, s * 0.07, s * 0.015,
             fill=fc(style, col_wood), lw=lw)
    cv.c.new_path()


# ==============================================================================
# 5. LAMP (desk lamp)
# ==============================================================================
def prop_lamp(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)
    c = cv.c

    col_lamp = rgb("#ef4444")
    col_bulb = rgb("#fef08a")
    col_metal = rgb("#475569")

    # Weighted round base at bottom left
    bx = x - s * 0.2
    by = y + s * 0.28
    draw_ellipse(cv, bx, by, s * 0.16, s * 0.05, fill=fc(style, col_metal), w=lw)
    draw_ellipse(cv, bx, by - s * 0.015, s * 0.12, s * 0.035, fill=fc(style, rgb("#64748b")), w=th)

    # Base pivot
    j1 = (bx, by - s * 0.04)
    draw_ellipse(cv, j1[0], j1[1], s * 0.024, s * 0.024, fill=fc(style, col_metal), w=th)

    # Elbow pivot
    j2 = (x - s * 0.06, y - s * 0.06)

    # Lower articulated twin struts
    c.new_path()
    c.set_source_rgb(*INK)
    c.set_line_width(th * 1.5)
    c.move_to(j1[0] - s * 0.015, j1[1])
    c.line_to(j2[0] - s * 0.015, j2[1])
    c.move_to(j1[0] + s * 0.015, j1[1])
    c.line_to(j2[0] + s * 0.015, j2[1])
    c.stroke()

    # Tension spring between lower struts
    for sp in range(4):
        sy = j1[1] + (j2[1] - j1[1]) * (0.3 + sp * 0.12)
        sx = j1[0] + (j2[0] - j1[0]) * (0.3 + sp * 0.12)
        cv.line([(sx - s * 0.015, sy), (sx + s * 0.015, sy - s * 0.01)], w=th * 0.8, color=INK)

    draw_ellipse(cv, j2[0], j2[1], s * 0.032, s * 0.032, fill=fc(style, col_metal), w=lw)
    draw_ellipse(cv, j2[0], j2[1], s * 0.012, s * 0.012, fill=fc(style, rgb("#f1f5f9")), w=th)

    # Head pivot
    j3 = (x + s * 0.15, y - s * 0.18)

    # Upper twin struts
    c.new_path()
    c.set_source_rgb(*INK)
    c.set_line_width(th * 1.5)
    c.move_to(j2[0] - s * 0.012, j2[1])
    c.line_to(j3[0] - s * 0.012, j3[1])
    c.move_to(j2[0] + s * 0.012, j2[1])
    c.line_to(j3[0] + s * 0.012, j3[1])
    c.stroke()

    draw_ellipse(cv, j3[0], j3[1], s * 0.026, s * 0.026, fill=fc(style, col_metal), w=th)

    # Lampshade angled DOWN toward desk surface
    ang = math.radians(115)
    cos_a, sin_a = math.cos(ang), math.sin(ang)

    cap_pt = (j3[0] - s * 0.04 * cos_a, j3[1] - s * 0.04 * sin_a)
    draw_ellipse(cv, cap_pt[0], cap_pt[1], s * 0.035, s * 0.025, fill=fc(style, col_lamp), w=th, rot=ang)

    rim_c = (j3[0] + s * 0.16 * cos_a, j3[1] + s * 0.16 * sin_a)
    nx, ny = -sin_a, cos_a

    p1 = (j3[0] + nx * s * 0.05, j3[1] + ny * s * 0.05)
    p2 = (rim_c[0] + nx * s * 0.13, rim_c[1] + ny * s * 0.13)
    p3 = (rim_c[0] - nx * s * 0.13, rim_c[1] - ny * s * 0.13)
    p4 = (j3[0] - nx * s * 0.05, j3[1] - ny * s * 0.05)

    poly(cv, [p1, p2, p3, p4], fill=fc(style, col_lamp), lw=lw)
    draw_ellipse(cv, rim_c[0], rim_c[1], s * 0.13, s * 0.05, fill=fc(style, col_bulb), w=lw, rot=ang + math.pi / 2)

    # Light beam pool shining downward onto desk
    beam_left = (rim_c[0] + nx * s * 0.13, rim_c[1] + ny * s * 0.13)
    beam_right = (rim_c[0] - nx * s * 0.13, rim_c[1] - ny * s * 0.13)
    target_l = (rim_c[0] - s * 0.22, by)
    target_r = (rim_c[0] + s * 0.18, by)

    if style == "professor":
        c.save()
        c.set_source_rgba(1.0, 0.95, 0.4, 0.25)
        c.new_path()
        c.move_to(*beam_left)
        c.line_to(*target_l)
        c.line_to(*target_r)
        c.line_to(*beam_right)
        c.close_path()
        c.fill()
        c.restore()

    c.save()
    c.set_dash([s * 0.02, s * 0.015])
    polyline(cv, [beam_left, target_l], lw=th * 0.9,
             color=rgb("#f59e0b") if style == "professor" else INK)
    polyline(cv, [beam_right, target_r], lw=th * 0.9,
             color=rgb("#f59e0b") if style == "professor" else INK)
    c.restore()
    cv.c.new_path()


# ==============================================================================
# 6. TV
# ==============================================================================
def prop_tv(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    w = s * 0.78
    h = s * 0.48
    tv_y = y - s * 0.06

    col_bezel = INK
    col_screen = rgb("#0284c7")
    col_stand = rgb("#475569")

    stand_top = tv_y + h * 0.5
    stand_bot = y + s * 0.32
    cv.rrect(x - s * 0.035, stand_top, s * 0.07, stand_bot - stand_top - s * 0.015, s * 0.008,
             fill=fc(style, col_stand), lw=lw)
    cv.rrect(x - s * 0.2, stand_bot - s * 0.02, s * 0.4, s * 0.03, s * 0.012,
             fill=fc(style, col_stand), lw=lw)

    # TV Outer Bezel
    cv.rrect(x - w * 0.5, tv_y - h * 0.5, w, h, s * 0.03,
             fill=col_bezel, lw=lw)

    # Inset Screen
    sc_m = s * 0.032
    sc_w = w - sc_m * 2
    sc_h = h - sc_m * 2
    cv.rrect(x - sc_w * 0.5, tv_y - sc_h * 0.5, sc_w, sc_h, s * 0.018,
             fill=fc(style, col_screen), lw=th)

    # Center Play button
    play_x = x - s * 0.01
    play_y = tv_y - s * 0.02
    poly(cv, [(play_x - s * 0.04, play_y - s * 0.05),
              (play_x + s * 0.06, play_y),
              (play_x - s * 0.04, play_y + s * 0.05)],
         fill=fc(style, rgb("#ffffff")), lw=th)

    # Scrubber bar at bottom
    bar_x = x - sc_w * 0.5 + s * 0.04
    bar_y = tv_y + sc_h * 0.5 - s * 0.045
    bar_w = sc_w - s * 0.08
    bar_h = s * 0.016
    cv.rrect(bar_x, bar_y, bar_w, bar_h, s * 0.008,
             fill=fc(style, rgb("#1e293b")), lw=th * 0.8)
    prog_w = bar_w * 0.62
    cv.rrect(bar_x, bar_y, prog_w, bar_h, s * 0.008,
             fill=rgb("#ef4444") if style == "professor" else INK, lw=0)
    draw_ellipse(cv, bar_x + prog_w, bar_y + bar_h * 0.5, s * 0.016, s * 0.016,
                 fill=fc(style, rgb("#ffffff")), w=th * 0.8)

    # Diagonal reflection slash
    cv.line([(x - sc_w * 0.5 + s * 0.04, tv_y - sc_h * 0.5 + s * 0.04),
             (x - sc_w * 0.5 + s * 0.22, tv_y - sc_h * 0.5 + s * 0.04)],
            w=th * 1.2, color=rgb("#ffffff") if style == "professor" else INK)

    # Power LED indicator dot
    draw_ellipse(cv, x + w * 0.5 - s * 0.04, tv_y + h * 0.5 - s * 0.016,
                 s * 0.008, s * 0.008, fill=rgb("#22c55e") if style == "professor" else INK, w=0)
    cv.c.new_path()


# ==============================================================================
# 7. WINDOW (with curtain and sky)
# ==============================================================================
def prop_window(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    w = s * 0.72
    h = s * 0.72
    win_y = y + s * 0.01

    col_frame = rgb("#f1f5f9")
    col_sky = rgb("#38bdf8")
    col_curtain = rgb("#e11d48")
    col_rod = rgb("#b45309")
    col_sun = rgb("#fbbf24")

    # Main window wooden frame
    cv.rrect(x - w * 0.42, win_y - h * 0.45, w * 0.84, h * 0.85, s * 0.02,
             fill=fc(style, col_frame), lw=lw)

    # Glass pane (sky inside)
    pane_x = x - w * 0.36
    pane_y = win_y - h * 0.4
    pane_w = w * 0.72
    pane_h = h * 0.74
    cv.rrect(pane_x, pane_y, pane_w, pane_h, s * 0.01,
             fill=fc(style, col_sky), lw=lw)

    # Sun in top-right
    draw_ellipse(cv, pane_x + pane_w - s * 0.09, pane_y + s * 0.09, s * 0.065, s * 0.065,
                 fill=fc(style, col_sun), w=th)
    # Cloud in top-left
    cld_x = pane_x + s * 0.14
    cld_y = pane_y + s * 0.14
    draw_ellipse(cv, cld_x, cld_y, s * 0.05, s * 0.03, fill=fc(style, rgb("#ffffff")), w=0)
    draw_ellipse(cv, cld_x + s * 0.04, cld_y - s * 0.015, s * 0.04, s * 0.035, fill=fc(style, rgb("#ffffff")), w=0)
    draw_ellipse(cv, cld_x + s * 0.08, cld_y, s * 0.045, s * 0.028, fill=fc(style, rgb("#ffffff")), w=0)

    # Window cross bars
    cv.line([(x, pane_y), (x, pane_y + pane_h)], w=lw * 0.8, color=INK)
    cv.line([(pane_x, win_y - s * 0.02), (pane_x + pane_w, win_y - s * 0.02)], w=lw * 0.8, color=INK)

    # Curtain rod across top with finials
    rod_y = win_y - h * 0.48
    cv.line([(x - w * 0.52, rod_y), (x + w * 0.52, rod_y)], w=lw * 0.9, color=INK)
    draw_ellipse(cv, x - w * 0.53, rod_y, s * 0.028, s * 0.028, fill=fc(style, col_rod), w=th)
    draw_ellipse(cv, x + w * 0.53, rod_y, s * 0.028, s * 0.028, fill=fc(style, col_rod), w=th)

    # Draped curtains: Left & Right tied back with golden sashes
    curt_bot = pane_y + pane_h + s * 0.02
    poly(cv, [(x - w * 0.44, rod_y + s * 0.01), (x - w * 0.22, rod_y + s * 0.01),
              (x - w * 0.32, win_y), (x - w * 0.22, curt_bot),
              (x - w * 0.46, curt_bot)],
         fill=fc(style, col_curtain), lw=lw)
    cv.rrect(x - w * 0.39, win_y - s * 0.02, s * 0.1, s * 0.025, s * 0.008,
             fill=fc(style, rgb("#f59e0b")), lw=th)

    poly(cv, [(x + w * 0.22, rod_y + s * 0.01), (x + w * 0.44, rod_y + s * 0.01),
              (x + w * 0.46, curt_bot), (x + w * 0.22, curt_bot),
              (x + w * 0.32, win_y)],
         fill=fc(style, col_curtain), lw=lw)
    cv.rrect(x + w * 0.29, win_y - s * 0.02, s * 0.1, s * 0.025, s * 0.008,
             fill=fc(style, rgb("#f59e0b")), lw=th)

    # Windowsill
    sill_y = pane_y + pane_h
    cv.rrect(x - w * 0.48, sill_y, w * 0.96, s * 0.05, s * 0.012,
             fill=fc(style, rgb("#e2e8f0")), lw=lw)
    cv.c.new_path()


# ==============================================================================
# 8. DOOR
# ==============================================================================
def prop_door(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    w = s * 0.6
    h = s * 0.8
    col_trim = rgb("#f1f5f9")
    col_door = rgb("#0284c7")
    col_brass = rgb("#f59e0b")

    # Outer doorframe trim
    cv.rrect(x - w * 0.5, y - h * 0.5, w, h, s * 0.02,
             fill=fc(style, col_trim), lw=lw)
    cv.rrect(x - w * 0.54, y - h * 0.5 - s * 0.02, w * 1.08, s * 0.04, s * 0.01,
             fill=fc(style, rgb("#e2e8f0")), lw=lw)
    cv.rrect(x - w * 0.52, y + h * 0.5 - s * 0.025, w * 1.04, s * 0.035, s * 0.008,
             fill=fc(style, rgb("#94a3b8")), lw=lw)

    # Main Door slab
    dw = w * 0.82
    dh = h * 0.92
    dx = x - dw * 0.5
    dy = y - h * 0.5 + s * 0.025
    cv.rrect(dx, dy, dw, dh, s * 0.012, fill=fc(style, col_door), lw=lw)

    # 4 Inset recessed panels
    pw = dw * 0.38
    u_h = dh * 0.38
    u_y = dy + s * 0.05
    cv.rrect(dx + s * 0.04, u_y, pw, u_h, s * 0.015, fill=fc(style, col_door), lw=th)
    cv.rrect(dx + dw - s * 0.04 - pw, u_y, pw, u_h, s * 0.015, fill=fc(style, col_door), lw=th)

    l_h = dh * 0.36
    l_y = dy + dh - s * 0.05 - l_h
    cv.rrect(dx + s * 0.04, l_y, pw, l_h, s * 0.015, fill=fc(style, col_door), lw=th)
    cv.rrect(dx + dw - s * 0.04 - pw, l_y, pw, l_h, s * 0.015, fill=fc(style, col_door), lw=th)

    # Peephole
    draw_ellipse(cv, x, dy + s * 0.08, s * 0.018, s * 0.018, fill=fc(style, col_brass), w=th)
    draw_ellipse(cv, x, dy + s * 0.08, s * 0.008, s * 0.008, fill=INK, w=0)

    # Brass plate & knob
    plate_x = dx + dw - s * 0.075
    plate_y = dy + dh * 0.5 - s * 0.05
    cv.rrect(plate_x, plate_y, s * 0.045, s * 0.11, s * 0.015,
             fill=fc(style, col_brass), lw=th)
    draw_ellipse(cv, plate_x + s * 0.0225, plate_y + s * 0.035, s * 0.026, s * 0.026,
                 fill=fc(style, rgb("#fbbf24")), w=th)
    draw_ellipse(cv, plate_x + s * 0.0225, plate_y + s * 0.08, s * 0.007, s * 0.007,
                 fill=INK, w=0)
    polyline(cv, [(plate_x + s * 0.0225, plate_y + s * 0.08),
                  (plate_x + s * 0.0225, plate_y + s * 0.095)], lw=th * 0.8, color=INK)

    # Hinges
    for hy in (dy + s * 0.08, dy + dh - s * 0.1):
        cv.rrect(dx - s * 0.012, hy, s * 0.016, s * 0.05, s * 0.004,
                 fill=fc(style, col_brass), lw=th)
    cv.c.new_path()


# ==============================================================================
# 9. PLANT (pot plant)
# ==============================================================================
def draw_leaf(cv, bx, by, tx, ty, w_left, w_right, fill, lw, th, style):
    """Draw a smooth curved cartoon tropical leaf with natural contour and central vein."""
    dx = tx - bx
    dy = ty - by
    dist = math.hypot(dx, dy)
    if dist < 1e-3:
        return
    ux, uy = dx / dist, dy / dist
    nx, ny = -uy, ux

    c1x = bx + dx * 0.35 + nx * w_left
    c1y = by + dy * 0.35 + ny * w_left
    c2x = bx + dx * 0.75 + nx * (w_left * 0.65)
    c2y = by + dy * 0.75 + ny * (w_left * 0.65)

    c3x = bx + dx * 0.75 - nx * (w_right * 0.65)
    c3y = by + dy * 0.75 - ny * (w_right * 0.65)
    c4x = bx + dx * 0.35 - nx * w_right
    c4y = by + dy * 0.35 - ny * w_right

    c = cv.c
    c.new_path()
    c.move_to(bx, by)
    c.curve_to(c1x, c1y, c2x, c2y, tx, ty)
    c.curve_to(c3x, c3y, c4x, c4y, bx, by)
    c.close_path()
    if fill:
        c.set_source_rgb(*fill)
        c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Leaf center vein
    c.new_path()
    c.move_to(bx, by)
    c.curve_to(bx + dx * 0.4, by + dy * 0.4, bx + dx * 0.75, by + dy * 0.75, tx, ty)
    c.set_source_rgb(*(shade(fill, 0.7) if style == "professor" else INK))
    c.set_line_width(th)
    c.stroke()


def prop_plant(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    col_pot = rgb("#ea580c")
    col_pot_dark = rgb("#c2410c")
    col_leaf1 = rgb("#16a34a")
    col_leaf2 = rgb("#22c55e")
    col_soil = rgb("#451a03")

    pot_top_w = s * 0.4
    pot_bot_w = s * 0.3
    pot_top_y = y + s * 0.07
    pot_bot_y = y + s * 0.3

    # Lush houseplant foliage: 5 smooth organic leaves
    # 1. Tall center leaf
    draw_leaf(cv, x, pot_top_y, x, y - s * 0.35,
              s * 0.09, s * 0.09, fc(style, col_leaf1), lw, th, style)

    # 2. Left high arching leaf
    draw_leaf(cv, x, pot_top_y, x - s * 0.28, y - s * 0.22,
              s * 0.09, s * 0.08, fc(style, col_leaf2), lw, th, style)

    # 3. Right high arching leaf
    draw_leaf(cv, x, pot_top_y, x + s * 0.28, y - s * 0.22,
              s * 0.08, s * 0.09, fc(style, col_leaf1), lw, th, style)

    # 4. Left lower leaf
    draw_leaf(cv, x, pot_top_y + s * 0.02, x - s * 0.3, y - s * 0.04,
              s * 0.08, s * 0.07, fc(style, col_leaf1), lw, th, style)

    # 5. Right lower leaf
    draw_leaf(cv, x, pot_top_y + s * 0.02, x + s * 0.3, y - s * 0.04,
              s * 0.07, s * 0.08, fc(style, col_leaf2), lw, th, style)

    # Potting Soil
    draw_ellipse(cv, x, pot_top_y + s * 0.015, pot_top_w * 0.48, s * 0.04,
                 fill=fc(style, col_soil), w=0)

    # Terracotta Pot Body (tapered)
    poly(cv, [(x - pot_top_w * 0.5, pot_top_y + s * 0.03),
              (x + pot_top_w * 0.5, pot_top_y + s * 0.03),
              (x + pot_bot_w * 0.5, pot_bot_y),
              (x - pot_bot_w * 0.5, pot_bot_y)],
         fill=fc(style, col_pot), lw=lw)

    # Pot rim collar
    cv.rrect(x - pot_top_w * 0.54, pot_top_y, pot_top_w * 1.08, s * 0.06, s * 0.015,
             fill=fc(style, rgb("#f97316")), lw=lw)

    # Bottom saucer tray
    cv.rrect(x - pot_bot_w * 0.65, pot_bot_y, pot_bot_w * 1.3, s * 0.035, s * 0.012,
             fill=fc(style, col_pot_dark), lw=lw)
    cv.c.new_path()


# ==============================================================================
# 10. BOOKSHELF
# ==============================================================================
def prop_bookshelf(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    w = s * 0.72
    h = s * 0.8
    col_wood = rgb("#854d0e")
    col_back = rgb("#5c2b09")

    # Bookcase Outer Frame
    cv.rrect(x - w * 0.5, y - h * 0.5, w, h, s * 0.02,
             fill=fc(style, col_back), lw=lw)

    # Top Crown moulding & Bottom Plinth
    cv.rrect(x - w * 0.54, y - h * 0.5 - s * 0.015, w * 1.08, s * 0.045, s * 0.012,
             fill=fc(style, col_wood), lw=lw)
    cv.rrect(x - w * 0.54, y + h * 0.5 - s * 0.035, w * 1.08, s * 0.05, s * 0.012,
             fill=fc(style, col_wood), lw=lw)

    # Upright side panels
    side_w = s * 0.04
    cv.rrect(x - w * 0.5, y - h * 0.5, side_w, h, s * 0.01, fill=fc(style, col_wood), lw=lw)
    cv.rrect(x + w * 0.5 - side_w, y - h * 0.5, side_w, h, s * 0.01, fill=fc(style, col_wood), lw=lw)

    # 3 Shelves dividing bookcase
    sh_h = s * 0.032
    sh1_y = y - h * 0.18
    sh2_y = y + h * 0.15
    cv.rrect(x - w * 0.5, sh1_y, w, sh_h, s * 0.008, fill=fc(style, col_wood), lw=lw)
    cv.rrect(x - w * 0.5, sh2_y, w, sh_h, s * 0.008, fill=fc(style, col_wood), lw=lw)

    # Shelf 1 (Top): Row of books + tilted book + mini succulent
    b_colors = [rgb("#dc2626"), rgb("#f59e0b"), rgb("#2563eb"), rgb("#16a34a")]
    bx = x - w * 0.44
    for i, col in enumerate(b_colors):
        bw = s * 0.045
        bh = s * 0.16 + (i % 2) * s * 0.02
        cv.rrect(bx, sh1_y - bh, bw, bh, s * 0.008, fill=fc(style, col), lw=th)
        bx += bw + s * 0.008

    # Leaning book
    poly(cv, [(bx + s * 0.02, sh1_y), (bx + s * 0.07, sh1_y),
              (bx + s * 0.13, sh1_y - s * 0.16), (bx + s * 0.08, sh1_y - s * 0.16)],
         fill=fc(style, rgb("#7c3aed")), lw=th)

    # Mini plant pot on right
    pot_x = x + w * 0.28
    cv.rrect(pot_x, sh1_y - s * 0.06, s * 0.06, s * 0.06, s * 0.01,
             fill=fc(style, rgb("#f1f5f9")), lw=th)
    draw_ellipse(cv, pot_x + s * 0.03, sh1_y - s * 0.08, s * 0.03, s * 0.025,
                 fill=fc(style, rgb("#22c55e")), w=th)

    # Shelf 2 (Middle): Stacked horizontal books & vertical books
    hx = x - w * 0.43
    for j, hcol in enumerate([rgb("#2563eb"), rgb("#ea580c"), rgb("#eab308")]):
        cv.rrect(hx, sh2_y - (j + 1) * s * 0.038, s * 0.18, s * 0.034, s * 0.006,
                 fill=fc(style, hcol), lw=th)

    bx = x + s * 0.02
    for k, col in enumerate([rgb("#dc2626"), rgb("#0d9488"), rgb("#9333ea"), rgb("#ca8a04")]):
        bw = s * 0.05
        bh = s * 0.17 + (k % 3) * s * 0.02
        cv.rrect(bx, sh2_y - bh, bw, bh, s * 0.008, fill=fc(style, col), lw=th)
        cv.rrect(bx + s * 0.01, sh2_y - bh + s * 0.03, bw - s * 0.02, s * 0.04, s * 0.004,
                 fill=fc(style, rgb("#fef08a")), lw=0)
        bx += bw + s * 0.008

    # Shelf 3 (Bottom): Matching encyclopedia volumes
    base_shelf_y = y + h * 0.5 - s * 0.035
    bx = x - w * 0.43
    for m in range(7):
        bw = s * 0.052
        bh = s * 0.2
        cv.rrect(bx, base_shelf_y - bh, bw, bh, s * 0.008,
                 fill=fc(style, rgb("#1e3a8a") if m % 2 == 0 else rgb("#991b1b")), lw=th)
        cv.line([(bx + s * 0.008, base_shelf_y - bh + s * 0.03),
                 (bx + bw - s * 0.008, base_shelf_y - bh + s * 0.03)],
                w=th, color=rgb("#fbbf24") if style == "professor" else INK)
        bx += bw + s * 0.007
    cv.c.new_path()


# ==============================================================================
# 11. MIRROR
# ==============================================================================
def prop_mirror(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    w = s * 0.6
    h = s * 0.8
    col_wood = rgb("#b45309")
    col_glass = rgb("#e0f2fe")
    col_brass = rgb("#f59e0b")

    post_top = y - h * 0.4
    post_bot = y + h * 0.4
    lx = x - w * 0.42
    rx = x + w * 0.42

    # Left post with solid arched shoe foot
    cv.rrect(lx - s * 0.02, post_top, s * 0.04, post_bot - post_top, s * 0.01,
             fill=fc(style, col_wood), lw=lw)
    draw_ellipse(cv, lx, post_top - s * 0.02, s * 0.026, s * 0.026, fill=fc(style, col_wood), w=lw)
    poly(cv, [(lx - s * 0.1, post_bot + s * 0.05), (lx, post_bot - s * 0.02),
              (lx + s * 0.1, post_bot + s * 0.05), (lx, post_bot + s * 0.02)],
         fill=fc(style, col_wood), lw=lw)

    # Right post with solid arched shoe foot
    cv.rrect(rx - s * 0.02, post_top, s * 0.04, post_bot - post_top, s * 0.01,
             fill=fc(style, col_wood), lw=lw)
    draw_ellipse(cv, rx, post_top - s * 0.02, s * 0.026, s * 0.026, fill=fc(style, col_wood), w=lw)
    poly(cv, [(rx - s * 0.1, post_bot + s * 0.05), (rx, post_bot - s * 0.02),
              (rx + s * 0.1, post_bot + s * 0.05), (rx, post_bot + s * 0.02)],
         fill=fc(style, col_wood), lw=lw)

    # Bottom cross stretcher bar
    cv.rrect(lx, post_bot - s * 0.08, rx - lx, s * 0.035, s * 0.01,
             fill=fc(style, col_wood), lw=lw)

    # Oval Mirror Outer Frame
    mir_y = y - s * 0.05
    draw_ellipse(cv, x, mir_y, s * 0.23, s * 0.35, fill=fc(style, col_wood), w=lw)

    # Reflective Glass
    draw_ellipse(cv, x, mir_y, s * 0.18, s * 0.3, fill=fc(style, col_glass), w=th)

    # Reflection sheen strokes
    if style == "professor":
        cv.line([(x - s * 0.1, mir_y - s * 0.16), (x + s * 0.06, mir_y - s * 0.25)],
                w=lw * 1.1, color=rgb("#ffffff"))
        cv.line([(x - s * 0.06, mir_y + s * 0.05), (x + s * 0.11, mir_y - s * 0.05)],
                w=lw * 0.8, color=rgb("#ffffff"))
    else:
        cv.line([(x - s * 0.1, mir_y - s * 0.16), (x + s * 0.06, mir_y - s * 0.25)],
                w=th * 0.8, color=INK)

    # Brass Swivel Pivot thumbscrews
    draw_ellipse(cv, lx, mir_y, s * 0.024, s * 0.024, fill=fc(style, col_brass), w=th)
    draw_ellipse(cv, rx, mir_y, s * 0.024, s * 0.024, fill=fc(style, col_brass), w=th)
    cv.c.new_path()


# ==============================================================================
# 12. CLOCK (wall clock)
# ==============================================================================
def prop_clock(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    r = s * 0.38
    col_rim = rgb("#dc2626")
    col_face = rgb("#f8fafc")

    # Outer wall clock bezel / case
    draw_ellipse(cv, x, y, r, r, fill=fc(style, col_rim), w=lw)
    draw_ellipse(cv, x, y, r * 0.88, r * 0.88, fill=fc(style, rgb("#b91c1c")), w=th)

    # White dial face
    draw_ellipse(cv, x, y, r * 0.8, r * 0.8, fill=fc(style, col_face), w=lw)

    # 12 Hour tick markings
    for h in range(12):
        ang = h * (math.pi / 6.0)
        is_cardinal = (h % 3 == 0)
        r_outer = r * 0.74
        r_inner = r * 0.62 if is_cardinal else r * 0.67
        tick_w = lw * 0.9 if is_cardinal else th * 0.8
        x1 = x + r_inner * math.sin(ang)
        y1 = y - r_inner * math.cos(ang)
        x2 = x + r_outer * math.sin(ang)
        y2 = y - r_outer * math.cos(ang)
        cv.line([(x1, y1), (x2, y2)], w=tick_w, color=INK)

    # Hands (10:10 smile setting)
    ang_h = -math.pi / 3.0
    hx = x + r * 0.44 * math.sin(ang_h)
    hy = y - r * 0.44 * math.cos(ang_h)
    cv.line([(x, y), (hx, hy)], w=lw * 1.2, color=INK)

    ang_m = math.pi / 3.0
    mx = x + r * 0.66 * math.sin(ang_m)
    my = y - r * 0.66 * math.cos(ang_m)
    cv.line([(x, y), (mx, my)], w=lw * 0.85, color=INK)

    # Second hand pointing up to 12
    cv.line([(x, y + r * 0.15), (x, y - r * 0.72)], w=th * 0.75,
            color=rgb("#ef4444") if style == "professor" else INK)
    draw_ellipse(cv, x, y + r * 0.15, s * 0.012, s * 0.012,
                 fill=rgb("#ef4444") if style == "professor" else INK, w=0)

    # Center hub pin cap
    draw_ellipse(cv, x, y, s * 0.024, s * 0.024, fill=INK, w=0)
    draw_ellipse(cv, x - s * 0.005, y - s * 0.005, s * 0.006, s * 0.006, fill=rgb("#ffffff"), w=0)

    # Glass glare arc
    if style == "professor":
        c = cv.c
        c.save()
        c.set_source_rgba(1, 1, 1, 0.4)
        c.set_line_width(lw * 0.8)
        c.arc(x, y, r * 0.68, -math.pi * 0.85, -math.pi * 0.4)
        c.stroke()
        c.restore()
    cv.c.new_path()


# ==============================================================================
# 13. ALARM_CLOCK (ringing)
# ==============================================================================
def prop_alarm_clock(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)
    c = cv.c

    r = s * 0.26
    cy = y + s * 0.04
    col_body = rgb("#dc2626")
    col_bell = rgb("#f59e0b")

    # Angled peg feet at bottom
    poly(cv, [(x - r * 0.5, cy + r * 0.7), (x - r * 0.75, cy + r * 1.15),
              (x - r * 0.62, cy + r * 1.18), (x - r * 0.4, cy + r * 0.75)],
         fill=fc(style, col_bell), lw=lw)
    poly(cv, [(x + r * 0.5, cy + r * 0.7), (x + r * 0.4, cy + r * 0.75),
              (x + r * 0.62, cy + r * 1.18), (x + r * 0.75, cy + r * 1.15)],
         fill=fc(style, col_bell), lw=lw)

    # Twin bells on top
    lb_x, lb_y = x - r * 0.72, cy - r * 0.82
    draw_ellipse(cv, lb_x, lb_y, s * 0.09, s * 0.06, fill=fc(style, col_bell), w=lw, rot=-math.radians(35))
    rb_x, rb_y = x + r * 0.72, cy - r * 0.82
    draw_ellipse(cv, rb_x, rb_y, s * 0.09, s * 0.06, fill=fc(style, col_bell), w=lw, rot=math.radians(35))

    # Top carrying loop handle between bells
    cv.shape([(x - s * 0.08, cy - r * 0.88), (x, cy - r * 1.1), (x + s * 0.08, cy - r * 0.88)],
             fill=None, w=lw, close=False)

    # Clapper / hammer between bells
    draw_ellipse(cv, x, cy - r * 0.95, s * 0.025, s * 0.025, fill=fc(style, col_bell), w=th)
    cv.line([(x - s * 0.035, cy - r * 0.95), (x - s * 0.02, cy - r * 0.95)], w=th, color=INK)
    cv.line([(x + s * 0.02, cy - r * 0.95), (x + s * 0.035, cy - r * 0.95)], w=th, color=INK)

    # Ringing sound wave arcs
    c.save()
    c.set_source_rgb(*INK)
    c.set_line_width(lw * 0.8)
    c.new_path()
    c.arc(lb_x - s * 0.02, lb_y - s * 0.02, s * 0.09, math.pi * 0.8, math.pi * 1.4)
    c.stroke()
    c.new_path()
    c.arc(lb_x - s * 0.04, lb_y - s * 0.04, s * 0.14, math.pi * 0.8, math.pi * 1.4)
    c.stroke()

    c.new_path()
    c.arc(rb_x + s * 0.02, rb_y - s * 0.02, s * 0.09, -math.pi * 0.4, math.pi * 0.2)
    c.stroke()
    c.new_path()
    c.arc(rb_x + s * 0.04, rb_y - s * 0.04, s * 0.14, -math.pi * 0.4, math.pi * 0.2)
    c.stroke()
    c.restore()

    # Main clock body
    draw_ellipse(cv, x, cy, r, r, fill=fc(style, col_body), w=lw)

    # White clock face
    draw_ellipse(cv, x, cy, r * 0.78, r * 0.78, fill=fc(style, rgb("#ffffff")), w=lw)

    # Dial ticks
    for h in range(12):
        ang = h * (math.pi / 6.0)
        tx1 = x + r * 0.62 * math.sin(ang)
        ty1 = cy - r * 0.62 * math.cos(ang)
        tx2 = x + r * 0.72 * math.sin(ang)
        ty2 = cy - r * 0.72 * math.cos(ang)
        cv.line([(tx1, ty1), (tx2, ty2)], w=th * 0.9, color=INK)

    # Hands showing 7:00 AM
    ang_7 = math.pi + (math.pi / 6.0)
    cv.line([(x, cy), (x + r * 0.42 * math.sin(ang_7), cy - r * 0.42 * math.cos(ang_7))],
            w=lw * 1.1, color=INK)
    cv.line([(x, cy), (x, cy - r * 0.64)], w=lw * 0.85, color=INK)

    draw_ellipse(cv, x, cy, s * 0.022, s * 0.022, fill=INK, w=0)

    # Vibration shake squiggles
    cv.shape([(x - r - s * 0.04, cy - s * 0.05), (x - r - s * 0.07, cy),
              (x - r - s * 0.04, cy + s * 0.05)], fill=None, w=th * 1.1, close=False)
    cv.shape([(x + r + s * 0.04, cy - s * 0.05), (x + r + s * 0.07, cy),
              (x + r + s * 0.04, cy + s * 0.05)], fill=None, w=th * 1.1, close=False)
    cv.c.new_path()


# ==============================================================================
# 14. MUG (steaming coffee mug)
# ==============================================================================
def prop_mug(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)
    c = cv.c

    w = s * 0.46
    h = s * 0.46
    mug_y = y + s * 0.08
    col_mug = rgb("#0284c7")
    col_coffee = rgb("#451a03")

    # Table shadow under mug
    draw_ellipse(cv, x - s * 0.03, mug_y + h * 0.5, w * 0.56, s * 0.04,
                 fill=fc(style, shade(BG, 0.85) if style == "professor" else PAPER), w=0)

    # True Loop Handle with outer curve and inner hole
    c.new_path()
    c.move_to(x + w * 0.45, mug_y - h * 0.28)
    c.curve_to(x + w * 0.82, mug_y - h * 0.32,
               x + w * 0.82, mug_y + h * 0.32,
               x + w * 0.45, mug_y + h * 0.28)
    c.line_to(x + w * 0.45, mug_y + h * 0.14)
    c.curve_to(x + w * 0.64, mug_y + h * 0.16,
               x + w * 0.64, mug_y - h * 0.16,
               x + w * 0.45, mug_y - h * 0.14)
    c.close_path()
    c.set_source_rgb(*fc(style, col_mug))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Main Mug Body cylinder with rounded bottom corners
    cv.rrect(x - w * 0.5, mug_y - h * 0.45, w, h * 0.9, s * 0.06,
             fill=fc(style, col_mug), lw=lw)

    # Graphic stripe on mug front
    cv.rrect(x - w * 0.48, mug_y - s * 0.04, w * 0.96, s * 0.07, s * 0.015,
             fill=fc(style, rgb("#f1f5f9")), lw=0)

    # Top opening ellipse
    draw_ellipse(cv, x, mug_y - h * 0.45, w * 0.5, s * 0.08,
                 fill=fc(style, col_mug), w=lw)
    # Coffee liquid inside rim
    draw_ellipse(cv, x, mug_y - h * 0.45, w * 0.44, s * 0.06,
                 fill=col_coffee if style == "professor" else INK, w=th)
    # Crema crescent
    draw_ellipse(cv, x - s * 0.06, mug_y - h * 0.45 - s * 0.01, s * 0.06, s * 0.02,
                 fill=fc(style, rgb("#78350f")), w=0)

    # Graceful swirling steam trails rising up
    steam_y = mug_y - h * 0.5
    cv.shape([(x, steam_y - s * 0.04), (x + s * 0.03, steam_y - s * 0.15),
              (x - s * 0.03, steam_y - s * 0.26), (x + s * 0.02, steam_y - s * 0.38)],
             fill=None, w=lw * 0.8, close=False)
    cv.shape([(x - s * 0.1, steam_y - s * 0.03), (x - s * 0.15, steam_y - s * 0.12),
              (x - s * 0.1, steam_y - s * 0.22)],
             fill=None, w=th * 1.1, close=False)
    cv.shape([(x + s * 0.1, steam_y - s * 0.03), (x + s * 0.15, steam_y - s * 0.14),
              (x + s * 0.09, steam_y - s * 0.24)],
             fill=None, w=th * 1.1, close=False)
    cv.c.new_path()


# ==============================================================================
# 15. FRIDGE
# ==============================================================================
def prop_fridge(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    w = s * 0.56
    h = s * 0.82
    col_fridge = rgb("#38bdf8")
    col_handle = rgb("#f1f5f9")

    # Bottom sturdy base feet
    cv.rrect(x - w * 0.42, y + h * 0.48, s * 0.08, s * 0.04, s * 0.01,
             fill=fc(style, rgb("#334155")), lw=th)
    cv.rrect(x + w * 0.34, y + h * 0.48, s * 0.08, s * 0.04, s * 0.01,
             fill=fc(style, rgb("#334155")), lw=th)

    # Main Fridge Cabinet
    cv.rrect(x - w * 0.5, y - h * 0.5, w, h, s * 0.05,
             fill=fc(style, col_fridge), lw=lw)

    # Freezer door (top)
    fz_h = h * 0.3
    cv.rrect(x - w * 0.48, y - h * 0.48, w * 0.96, fz_h, s * 0.03,
             fill=fc(style, col_fridge), lw=th)

    # Horizontal split gap line
    seam_y = y - h * 0.5 + fz_h + s * 0.025
    cv.line([(x - w * 0.5, seam_y), (x + w * 0.5, seam_y)], w=lw, color=INK)

    # Refrigerator door (bottom)
    rf_h = h * 0.63
    cv.rrect(x - w * 0.48, seam_y + s * 0.01, w * 0.96, rf_h - s * 0.02, s * 0.03,
             fill=fc(style, col_fridge), lw=th)

    # Vertical Chrome Door Handles
    cv.rrect(x + w * 0.32, y - h * 0.38, s * 0.035, s * 0.12, s * 0.015,
             fill=fc(style, col_handle), lw=lw)
    cv.rrect(x + w * 0.32, seam_y + s * 0.06, s * 0.035, s * 0.18, s * 0.015,
             fill=fc(style, col_handle), lw=lw)

    # Sticky note on freezer door
    cv.rrect(x - w * 0.32, y - h * 0.42, s * 0.11, s * 0.11, s * 0.01,
             fill=fc(style, rgb("#fef08a")), lw=th)
    cv.line([(x - w * 0.28, y - h * 0.38), (x - w * 0.15, y - h * 0.38)], w=th * 0.7, color=INK)
    cv.line([(x - w * 0.28, y - h * 0.35), (x - w * 0.17, y - h * 0.35)], w=th * 0.7, color=INK)

    # Red strawberry / round magnet
    draw_ellipse(cv, x + w * 0.05, y - h * 0.38, s * 0.026, s * 0.026,
                 fill=fc(style, rgb("#ef4444")), w=th)

    # Postcard on bottom door
    poly(cv, [(x - w * 0.3, seam_y + s * 0.14), (x - w * 0.04, seam_y + s * 0.12),
              (x - w * 0.02, seam_y + s * 0.32), (x - w * 0.28, seam_y + s * 0.34)],
         fill=fc(style, rgb("#ffffff")), lw=th)
    draw_ellipse(cv, x - w * 0.16, seam_y + s * 0.13, s * 0.018, s * 0.018,
                 fill=fc(style, rgb("#22c55e")), w=th)
    cv.c.new_path()


# ==============================================================================
# 16. TRASH_CAN
# ==============================================================================
def prop_trash_can(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    col_metal = rgb("#94a3b8")
    col_light = rgb("#cbd5e1")
    col_dark = rgb("#64748b")

    top_w = s * 0.48
    bot_w = s * 0.38
    can_top_y = y - s * 0.06
    can_bot_y = y + s * 0.32

    # Side loop handles on can
    h_y = can_top_y + s * 0.1
    cv.shape([(x - top_w * 0.5, h_y - s * 0.04), (x - top_w * 0.5 - s * 0.07, h_y),
              (x - top_w * 0.5, h_y + s * 0.04)], fill=None, w=lw, close=False)
    cv.shape([(x + top_w * 0.5, h_y - s * 0.04), (x + top_w * 0.5 + s * 0.07, h_y),
              (x + top_w * 0.5, h_y + s * 0.04)], fill=None, w=lw, close=False)

    # Tapered fluted can body
    poly(cv, [(x - top_w * 0.5, can_top_y), (x + top_w * 0.5, can_top_y),
              (x + bot_w * 0.5, can_bot_y), (x - bot_w * 0.5, can_bot_y)],
         fill=fc(style, col_metal), lw=lw)

    # Bottom rim base ring
    cv.rrect(x - bot_w * 0.52, can_bot_y - s * 0.02, bot_w * 1.04, s * 0.035, s * 0.01,
             fill=fc(style, col_dark), lw=lw)

    # Vertical corrugated ridges
    for i in [-0.3, -0.1, 0.1, 0.3]:
        rx1 = x + top_w * i
        rx2 = x + bot_w * i
        cv.line([(rx1, can_top_y + s * 0.02), (rx2, can_bot_y - s * 0.02)],
                w=th * 1.2, color=col_light if style == "professor" else INK)

    # Horizontal reinforcing rib bands
    cv.line([(x - top_w * 0.48, can_top_y + s * 0.12), (x + top_w * 0.48, can_top_y + s * 0.12)],
            w=th * 1.2, color=col_dark if style == "professor" else INK)
    cv.line([(x - top_w * 0.44, can_top_y + s * 0.24), (x + top_w * 0.44, can_top_y + s * 0.24)],
            w=th * 1.2, color=col_dark if style == "professor" else INK)

    # Crumpled white paper wad peeking out
    draw_ellipse(cv, x - s * 0.08, can_top_y - s * 0.04, s * 0.06, s * 0.05,
                 fill=fc(style, rgb("#f8fafc")), w=th)
    draw_ellipse(cv, x + s * 0.02, can_top_y - s * 0.05, s * 0.05, s * 0.04,
                 fill=fc(style, rgb("#f8fafc")), w=th)

    # Tilted metal domed lid
    lid_ang = -math.radians(12)
    cos_l, sin_l = math.cos(lid_ang), math.sin(lid_ang)
    lid_c = (x, can_top_y - s * 0.06)

    # Lid top loop handle
    cv.shape([(lid_c[0] - sin_l * s * 0.03 - cos_l * s * 0.04, lid_c[1] - cos_l * s * 0.03 + sin_l * s * 0.04),
              (lid_c[0] - sin_l * s * 0.08, lid_c[1] - cos_l * s * 0.08),
              (lid_c[0] - sin_l * s * 0.03 + cos_l * s * 0.04, lid_c[1] - cos_l * s * 0.03 - sin_l * s * 0.04)],
             fill=None, w=lw, close=False)

    draw_ellipse(cv, lid_c[0], lid_c[1], top_w * 0.56, s * 0.09,
                 fill=fc(style, col_metal), w=lw, rot=lid_ang)
    draw_ellipse(cv, lid_c[0] + sin_l * s * 0.02, lid_c[1] + cos_l * s * 0.02,
                 top_w * 0.58, s * 0.04, fill=fc(style, col_light), w=th, rot=lid_ang)
    cv.c.new_path()


# ==============================================================================
# 17. STAIRS
# ==============================================================================
def prop_stairs(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    col_tread = rgb("#d97706")
    col_riser = rgb("#f8fafc")
    col_stringer = rgb("#92400e")
    col_rail = rgb("#78350f")

    step_dx = s * 0.13
    step_dy = s * 0.12
    tread_w = s * 0.18
    start_x = x - s * 0.28
    start_y = y + s * 0.24

    # Solid side base wall / stringer connecting under all steps
    base_pts = [
        (start_x, start_y + step_dy),
        (start_x + step_dx * 4, start_y - step_dy * 3),
        (start_x + step_dx * 4 + tread_w, start_y - step_dy * 3 - s * 0.04),
        (start_x + step_dx * 4 + tread_w, start_y + step_dy),
    ]
    poly(cv, base_pts, fill=fc(style, col_stringer), lw=lw)

    # Draw each of the 4 steps: Riser and Tread
    for i in range(4):
        sx = start_x + i * step_dx
        sy = start_y - i * step_dy

        # Vertical Riser face
        poly(cv, [(sx, sy), (sx + tread_w, sy - s * 0.04),
                  (sx + tread_w, sy + step_dy - s * 0.04), (sx, sy + step_dy)],
             fill=fc(style, col_riser), lw=lw)

        # Horizontal Tread top surface
        poly(cv, [(sx, sy), (sx + step_dx, sy - step_dy * 0.3),
                  (sx + step_dx + tread_w, sy - step_dy * 0.3 - s * 0.04),
                  (sx + tread_w, sy - s * 0.04)],
             fill=fc(style, col_tread), lw=lw)

        # Spindle / Baluster
        bal_base_x = sx + s * 0.04
        bal_base_y = sy - s * 0.02
        bal_top_x = bal_base_x
        bal_top_y = bal_base_y - s * 0.22
        cv.line([(bal_base_x, bal_base_y), (bal_top_x, bal_top_y)], w=th * 1.2, color=INK)

    # Handrail ascending alongside stairs
    hr_start = (start_x + s * 0.04, start_y - s * 0.24)
    hr_end = (start_x + step_dx * 3.8 + s * 0.04, start_y - step_dy * 3.8 - s * 0.24)
    cv.line([hr_start, hr_end], w=lw * 1.3, color=col_rail if style == "professor" else INK)
    cv.line([hr_start, hr_end], w=lw * 1.3, color=INK)

    # Front Newel post
    np_x = start_x + s * 0.04
    np_y = start_y
    cv.rrect(np_x - s * 0.025, np_y - s * 0.27, s * 0.05, s * 0.35, s * 0.01,
             fill=fc(style, col_rail), lw=lw)
    draw_ellipse(cv, np_x, np_y - s * 0.28, s * 0.032, s * 0.032, fill=fc(style, col_tread), w=lw)
    cv.c.new_path()


# ==============================================================================
# 18. TABLE
# ==============================================================================
def prop_table(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)

    w = s * 0.8
    top_y = y - s * 0.04
    bot_y = y + s * 0.32

    col_top = rgb("#d97706")
    col_apron = rgb("#b45309")
    col_vase = rgb("#0284c7")
    col_flower = rgb("#ec4899")

    # 4 Turned/Tapered wooden legs
    rear_bot = y + s * 0.22
    poly(cv, [(x - w * 0.33, top_y + s * 0.06), (x - w * 0.29, top_y + s * 0.06),
              (x - w * 0.31, rear_bot), (x - w * 0.34, rear_bot)],
         fill=fc(style, rgb("#78350f")), lw=th)
    poly(cv, [(x + w * 0.29, top_y + s * 0.06), (x + w * 0.33, top_y + s * 0.06),
              (x + w * 0.34, rear_bot), (x + w * 0.31, rear_bot)],
         fill=fc(style, rgb("#78350f")), lw=th)

    poly(cv, [(x - w * 0.42, top_y + s * 0.06), (x - w * 0.36, top_y + s * 0.06),
              (x - w * 0.38, bot_y), (x - w * 0.42, bot_y)],
         fill=fc(style, col_apron), lw=lw)
    poly(cv, [(x + w * 0.36, top_y + s * 0.06), (x + w * 0.42, top_y + s * 0.06),
              (x + w * 0.42, bot_y), (x + w * 0.38, bot_y)],
         fill=fc(style, col_apron), lw=lw)

    # Apron skirt
    cv.rrect(x - w * 0.44, top_y + s * 0.03, w * 0.88, s * 0.05, s * 0.008,
             fill=fc(style, col_apron), lw=lw)

    # Tabletop Surface
    cv.rrect(x - w * 0.5, top_y, w, s * 0.07, s * 0.025,
             fill=fc(style, col_top), lw=lw)
    cv.line([(x - w * 0.46, top_y + s * 0.02), (x + w * 0.46, top_y + s * 0.02)],
            w=th, color=shade(col_top, 1.25) if style == "professor" else INK)

    # Centerpiece: flower vase on table
    vase_y = top_y - s * 0.06
    # Flower stem & leaf (strictly INK in stickman!)
    cv.line([(x, top_y), (x, top_y - s * 0.22)], w=th * 1.2,
            color=rgb("#16a34a") if style == "professor" else INK)
    draw_ellipse(cv, x - s * 0.03, top_y - s * 0.15, s * 0.025, s * 0.015,
                 fill=fc(style, rgb("#22c55e")), w=th, rot=-math.radians(25))

    # Flower blossom
    flow_y = top_y - s * 0.24
    for fa in range(6):
        fang = fa * (math.pi / 3.0)
        px = x + s * 0.032 * math.cos(fang)
        py = flow_y + s * 0.032 * math.sin(fang)
        draw_ellipse(cv, px, py, s * 0.022, s * 0.022, fill=fc(style, col_flower), w=th)
    draw_ellipse(cv, x, flow_y, s * 0.02, s * 0.02, fill=fc(style, rgb("#f59e0b")), w=th)

    # Ceramic bulbous vase
    draw_ellipse(cv, x, vase_y, s * 0.065, s * 0.065, fill=fc(style, col_vase), w=lw)
    poly(cv, [(x - s * 0.03, vase_y - s * 0.04), (x - s * 0.04, vase_y - s * 0.08),
              (x + s * 0.04, vase_y - s * 0.08), (x + s * 0.03, vase_y - s * 0.04)],
         fill=fc(style, col_vase), lw=th)
    cv.c.new_path()


# ==============================================================================
# 19. SINK
# ==============================================================================
def prop_sink(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)
    c = cv.c

    w = s * 0.68
    col_basin = rgb("#f8fafc")
    col_vanity = rgb("#0284c7")
    col_chrome = rgb("#94a3b8")
    col_water = rgb("#38bdf8")

    basin_y = y - s * 0.04
    vanity_bot = y + s * 0.32

    # Vanity Cabinet
    van_w = w * 0.82
    cv.rrect(x - van_w * 0.5, basin_y + s * 0.08, van_w, vanity_bot - (basin_y + s * 0.08), s * 0.02,
             fill=fc(style, col_vanity), lw=lw)
    cv.line([(x, basin_y + s * 0.09), (x, vanity_bot - s * 0.02)], w=lw, color=INK)
    draw_ellipse(cv, x - s * 0.04, basin_y + s * 0.18, s * 0.015, s * 0.015, fill=fc(style, col_chrome), w=th)
    draw_ellipse(cv, x + s * 0.04, basin_y + s * 0.18, s * 0.015, s * 0.015, fill=fc(style, col_chrome), w=th)

    # Porcelain Washbasin
    cv.rrect(x - w * 0.5, basin_y, w, s * 0.16, s * 0.06,
             fill=fc(style, col_basin), lw=lw)

    # Inner bowl cavity
    draw_ellipse(cv, x, basin_y + s * 0.08, w * 0.38, s * 0.05,
                 fill=fc(style, rgb("#e2e8f0")), w=th)

    # Drain hole
    draw_ellipse(cv, x, basin_y + s * 0.095, s * 0.026, s * 0.018, fill=INK, w=0)
    draw_ellipse(cv, x, basin_y + s * 0.095, s * 0.016, s * 0.012, fill=fc(style, col_chrome), w=th * 0.7)

    # Symmetrical Arched Gooseneck Faucet pouring into center drain
    f_spout_x = x
    f_spout_y = basin_y - s * 0.08
    c.new_path()
    c.move_to(x - s * 0.06, basin_y)
    c.curve_to(x - s * 0.06, basin_y - s * 0.22,
               f_spout_x + s * 0.02, basin_y - s * 0.22,
               f_spout_x, f_spout_y)
    c.set_source_rgb(*INK)
    c.set_line_width(lw * 1.3)
    c.stroke()

    draw_ellipse(cv, f_spout_x, f_spout_y, s * 0.016, s * 0.008, fill=fc(style, col_chrome), w=th)

    # Hot & Cold Handles
    cv.rrect(x - s * 0.15, basin_y - s * 0.03, s * 0.06, s * 0.025, s * 0.008,
             fill=fc(style, col_chrome), lw=th)
    draw_ellipse(cv, x - s * 0.12, basin_y - s * 0.035, s * 0.01, s * 0.01,
                 fill=rgb("#ef4444") if style == "professor" else INK, w=0)

    cv.rrect(x + s * 0.09, basin_y - s * 0.03, s * 0.06, s * 0.025, s * 0.008,
             fill=fc(style, col_chrome), lw=th)
    draw_ellipse(cv, x + s * 0.12, basin_y - s * 0.035, s * 0.01, s * 0.01,
                 fill=rgb("#3b82f6") if style == "professor" else INK, w=0)

    # Water stream flowing straight into center drain
    cv.line([(f_spout_x, f_spout_y), (f_spout_x, basin_y + s * 0.09)],
            w=th * 1.3, color=col_water if style == "professor" else INK)
    draw_ellipse(cv, f_spout_x - s * 0.02, basin_y + s * 0.07, s * 0.008, s * 0.008,
                 fill=col_water if style == "professor" else INK, w=0)
    draw_ellipse(cv, f_spout_x + s * 0.02, basin_y + s * 0.06, s * 0.008, s * 0.008,
                 fill=col_water if style == "professor" else INK, w=0)
    cv.c.new_path()


# ==============================================================================
# 20. BELL
# ==============================================================================
def prop_bell(cv, x, y, s, style):
    cv.c.new_path()
    lw = max(4.5, s * 0.024)
    th = max(2.5, lw * 0.55)
    c = cv.c

    col_gold = rgb("#f59e0b")
    col_highlight = rgb("#fef08a")
    col_dark = rgb("#b45309")

    bell_top_y = y - s * 0.12
    bell_bot_y = y + s * 0.2
    top_w = s * 0.22
    rim_w = s * 0.62

    # Clapper hanging below bell rim
    clapper_y = bell_bot_y + s * 0.06
    cv.line([(x, bell_bot_y), (x, clapper_y)], w=lw, color=INK)
    draw_ellipse(cv, x, clapper_y, s * 0.045, s * 0.045, fill=fc(style, col_dark), w=lw)

    # Top mounting handle / ring
    draw_ellipse(cv, x, bell_top_y - s * 0.1, s * 0.05, s * 0.06, fill=None, w=lw)
    draw_ellipse(cv, x, bell_top_y - s * 0.03, s * 0.045, s * 0.025, fill=fc(style, col_dark), w=lw)

    # Smooth flared bell body with bezier curves
    c.new_path()
    c.move_to(x - top_w * 0.5, bell_top_y)
    c.curve_to(x - top_w * 0.55, y - s * 0.02,
               x - rim_w * 0.38, y + s * 0.08,
               x - rim_w * 0.5, bell_bot_y)
    c.line_to(x + rim_w * 0.5, bell_bot_y)
    c.curve_to(x + rim_w * 0.38, y + s * 0.08,
               x + top_w * 0.55, y - s * 0.02,
               x + top_w * 0.5, bell_top_y)
    c.curve_to(x + top_w * 0.2, bell_top_y - s * 0.02,
               x - top_w * 0.2, bell_top_y - s * 0.02,
               x - top_w * 0.5, bell_top_y)
    c.close_path()
    c.set_source_rgb(*fc(style, col_gold))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(lw)
    c.stroke()

    # Bottom flared rim lip ellipse
    draw_ellipse(cv, x, bell_bot_y, rim_w * 0.5, s * 0.07, fill=fc(style, col_gold), w=lw)

    # Brass Shine Highlight streak along the curve
    c.new_path()
    c.move_to(x - rim_w * 0.24, bell_top_y + s * 0.04)
    c.curve_to(x - rim_w * 0.24, y + s * 0.04,
               x - rim_w * 0.3, y + s * 0.12,
               x - rim_w * 0.35, bell_bot_y - s * 0.03)
    c.set_source_rgb(*(col_highlight if style == "professor" else INK))
    c.set_line_width(lw * 0.8)
    c.stroke()

    # Sparkle star on bell highlight
    spk_x = x - rim_w * 0.25
    spk_y = y + s * 0.02
    cv.line([(spk_x - s * 0.03, spk_y), (spk_x + s * 0.03, spk_y)], w=th,
            color=col_highlight if style == "professor" else INK)
    cv.line([(spk_x, spk_y - s * 0.03), (spk_x, spk_y + s * 0.03)], w=th,
            color=col_highlight if style == "professor" else INK)

    # Ringing sound wave brackets on left and right
    c.save()
    c.set_source_rgb(*INK)
    c.set_line_width(lw * 0.8)
    c.new_path()
    c.arc(x - rim_w * 0.45, bell_bot_y, s * 0.12, math.pi * 0.75, math.pi * 1.25)
    c.stroke()
    c.new_path()
    c.arc(x - rim_w * 0.45, bell_bot_y, s * 0.18, math.pi * 0.75, math.pi * 1.25)
    c.stroke()

    c.new_path()
    c.arc(x + rim_w * 0.45, bell_bot_y, s * 0.12, -math.pi * 0.25, math.pi * 0.25)
    c.stroke()
    c.new_path()
    c.arc(x + rim_w * 0.45, bell_bot_y, s * 0.18, -math.pi * 0.25, math.pi * 0.25)
    c.stroke()
    c.restore()
    cv.c.new_path()


# ==============================================================================
# PROPS DICTIONARY EXPORT
# ==============================================================================
PROPS = {
    "desk": prop_desk,
    "chair": prop_chair,
    "couch": prop_couch,
    "bed": prop_bed,
    "lamp": prop_lamp,
    "tv": prop_tv,
    "window": prop_window,
    "door": prop_door,
    "plant": prop_plant,
    "bookshelf": prop_bookshelf,
    "mirror": prop_mirror,
    "clock": prop_clock,
    "alarm_clock": prop_alarm_clock,
    "mug": prop_mug,
    "fridge": prop_fridge,
    "trash_can": prop_trash_can,
    "stairs": prop_stairs,
    "table": prop_table,
    "sink": prop_sink,
    "bell": prop_bell,
}


if __name__ == "__main__":
    cell = 380
    cols = 5
    rows = 4
    w = cols * cell
    h = rows * cell

    prop_keys = list(PROPS.keys())

    for style, bg_col, fname in [
        ("professor", rgb("#E0A911"), "/tmp/props_props_home_professor.png"),
        ("stickman", PAPER, "/tmp/props_props_home_stickman.png"),
    ]:
        cv = Canvas(bg=bg_col, w=w, h=h)
        for idx, name in enumerate(prop_keys):
            col = idx % cols
            row = idx // cols
            cx = col * cell + cell // 2
            cy = row * cell + cell // 2 - 18
            fn = PROPS[name]
            cv.c.new_path()
            fn(cv, cx, cy, 270, style)

            # Label at bottom of cell
            c = cv.c
            c.new_path()
            c.select_font_face("Sans", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
            c.set_font_size(20)
            ext = c.text_extents(name)
            c.set_source_rgb(*INK)
            c.move_to(cx - ext.width / 2.0, row * cell + cell - 28)
            c.show_text(name)
            c.new_path()

        cv.save(fname)
        alt_fname = f"/tmp/props_home_{style}.png"
        cv.save(alt_fname)
        print(f"Rendered {style} to {fname} and {alt_fname}")
