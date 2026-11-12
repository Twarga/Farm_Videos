"""Tech and workplace props for explainer videos (EverythingProfessor style).
All props are drawn with pycairo vector shapes with clean thick outlines and flat fills.
"""
import math
import cairo

from farm.art import Canvas, INK, PAPER, OL, rgb, shade, fc

BG_YELLOW = rgb("#E0A911")


def _ol(s):
    """Outline width scaled with s, staying OL-ish."""
    return max(6.0, s * 0.024)


def _th(s):
    """Thin detail line width scaled with s."""
    return max(3.5, s * 0.015)


def _sc(style, color):
    """Stroke colour for detail lines: colored in professor, INK in stickman."""
    return color if style == "professor" else INK


sc = _sc


def _poly(cv, pts, fill=None, lw=OL, close=True):
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
        c.fill_preserve()
    if lw:
        c.set_source_rgb(*INK)
        c.set_line_width(lw)
        c.stroke()
    else:
        c.new_path()


def _sline(cv, p1, p2, lw=OL, color=INK):
    """Draw a clean straight line segment."""
    c = cv.c
    c.new_path()
    c.move_to(*p1)
    c.line_to(*p2)
    c.set_source_rgb(*color)
    c.set_line_width(lw)
    c.stroke()


def _star(cv, cx, cy, r_out, r_in, points=5, fill=None, lw=OL, rot=-math.pi / 2):
    """Draw a symmetric star."""
    pts = []
    for i in range(points * 2):
        angle = rot + i * math.pi / points
        r = r_out if i % 2 == 0 else r_in
        pts.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    _poly(cv, pts, fill=fill, lw=lw, close=True)


# -----------------------------------------------------------------------------
# 1. phone (smartphone with generic screen)
# -----------------------------------------------------------------------------
def prop_phone(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)
    pw = s * 0.44
    ph = s * 0.82
    pr = s * 0.07

    # Phone outer body (dark sleek slate)
    cv.rrect(x - pw / 2, y - ph / 2, pw, ph, pr, fill=fc(style, rgb("#2C3E50")), lw=ol)

    # Screen
    sw = pw - s * 0.065
    sh = ph - s * 0.15
    sx = x - sw / 2
    sy = y - ph / 2 + s * 0.075
    sr = s * 0.035
    cv.rrect(sx, sy, sw, sh, sr, fill=fc(style, rgb("#74B9FF")), lw=th * 1.2)

    # Top speaker pill and selfie camera
    cv.rrect(x - s * 0.045, y - ph / 2 + s * 0.030, s * 0.09, s * 0.015, s * 0.0075,
             fill=fc(style, rgb("#1E272E")), lw=th * 0.7)
    cv.ellipse(x + s * 0.08, y - ph / 2 + s * 0.037, s * 0.011, s * 0.011,
               fill=fc(style, rgb("#1E272E")), w=th * 0.7)

    # Search bar on screen
    bar_w = sw * 0.82
    bar_h = sh * 0.09
    bar_x = sx + (sw - bar_w) / 2
    bar_y = sy + sh * 0.07
    cv.rrect(bar_x, bar_y, bar_w, bar_h, bar_h / 2, fill=fc(style, rgb("#FFFFFF")), lw=th * 0.8)
    # Search icon / dot
    cv.ellipse(bar_x + bar_h * 0.6, bar_y + bar_h * 0.5, bar_h * 0.22, bar_h * 0.22,
               fill=None, w=th * 0.6)
    _sline(cv, (bar_x + bar_h * 0.76, bar_y + bar_h * 0.66),
           (bar_x + bar_h * 0.95, bar_y + bar_h * 0.85), lw=th * 0.7, color=INK)

    # Grid of 6 app icons (2 rows of 3)
    app_s = sw * 0.21
    cols = [rgb("#FF7675"), rgb("#55EFC4"), rgb("#FFEAA7"),
            rgb("#A29BFE"), rgb("#FD79A8"), rgb("#00CEC9")]
    spacing_x = (sw - app_s * 3) / 4
    for i in range(6):
        row = i // 3
        col = i % 3
        ax = sx + spacing_x + col * (app_s + spacing_x)
        ay = sy + sh * 0.22 + row * (app_s + spacing_x * 0.9)
        cv.rrect(ax, ay, app_s, app_s, app_s * 0.28, fill=fc(style, cols[i]), lw=th * 0.8)

    # Bottom dock pill
    dock_w = sw * 0.86
    dock_h = sh * 0.16
    dock_x = sx + (sw - dock_w) / 2
    dock_y = sy + sh - dock_h - sh * 0.06
    cv.rrect(dock_x, dock_y, dock_w, dock_h, dock_h * 0.35, fill=fc(style, rgb("#EBF2FA")), lw=th * 0.8)

    # 3 dock app circles
    dock_colors = [rgb("#2ECC71"), rgb("#0984E3"), rgb("#E17055")]
    for j in range(3):
        dcx = dock_x + dock_w * (0.2 + j * 0.3)
        dcy = dock_y + dock_h * 0.5
        cv.ellipse(dcx, dcy, dock_h * 0.32, dock_h * 0.32, fill=fc(style, dock_colors[j]), w=th * 0.7)

    # Home indicator bar
    cv.rrect(x - s * 0.07, sy + sh - s * 0.024, s * 0.14, s * 0.012, s * 0.006,
             fill=fc(style, rgb("#2C3E50")), lw=th * 0.6)


# -----------------------------------------------------------------------------
# 2. laptop (open laptop, screen facing viewer)
# -----------------------------------------------------------------------------
def prop_laptop(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)

    # Screen housing (upright lid)
    sw = s * 0.72
    sh = s * 0.46
    sy = y - s * 0.34
    cv.rrect(x - sw / 2, sy, sw, sh, s * 0.03, fill=fc(style, rgb("#DFE4EA")), lw=ol)

    # Screen bezel & inner display
    bw = sw - s * 0.08
    bh = sh - s * 0.09
    bx = x - bw / 2
    by = sy + s * 0.045
    cv.rrect(bx, by, bw, bh, s * 0.016, fill=fc(style, rgb("#74B9FF")), lw=th * 1.2)

    # Webcam
    cv.ellipse(x, sy + s * 0.022, s * 0.010, s * 0.010, fill=fc(style, rgb("#2C3E50")), w=th * 0.6)

    # Screen window content (browser / editor card)
    ww = bw - s * 0.08
    wh = bh - s * 0.07
    wx = bx + s * 0.04
    wy = by + s * 0.035
    cv.rrect(wx, wy, ww, wh, s * 0.018, fill=fc(style, rgb("#FFFFFF")), lw=th)

    # Window header bar dots (red, yellow, green)
    dot_r = s * 0.012
    dot_y = wy + s * 0.035
    cv.ellipse(wx + s * 0.040, dot_y, dot_r, dot_r, fill=fc(style, rgb("#FF7675")), w=th * 0.6)
    cv.ellipse(wx + s * 0.075, dot_y, dot_r, dot_r, fill=fc(style, rgb("#FFEAA7")), w=th * 0.6)
    cv.ellipse(wx + s * 0.110, dot_y, dot_r, dot_r, fill=fc(style, rgb("#55EFC4")), w=th * 0.6)

    # Window content lines
    _sline(cv, (wx + s * 0.035, wy + s * 0.065), (wx + ww - s * 0.035, wy + s * 0.065),
           lw=th * 0.8, color=_sc(style, rgb("#DFE4EA")))
    # Blue header block and code text lines
    cv.rrect(wx + s * 0.04, wy + s * 0.09, ww * 0.45, s * 0.035, s * 0.01,
             fill=fc(style, rgb("#74B9FF")), lw=th * 0.6)
    _sline(cv, (wx + s * 0.04, wy + s * 0.16), (wx + ww * 0.85, wy + s * 0.16),
           lw=th * 0.9, color=_sc(style, rgb("#A4B0BE")))
    _sline(cv, (wx + s * 0.04, wy + s * 0.20), (wx + ww * 0.65, wy + s * 0.20),
           lw=th * 0.9, color=_sc(style, rgb("#A4B0BE")))

    # Base deck (keyboard trapezoid in perspective)
    hinge_y = sy + sh
    base_top_w = sw * 0.96
    base_bot_w = s * 0.86
    base_h = s * 0.20
    bot_y = hinge_y + base_h

    base_pts = [
        (x - base_top_w / 2, hinge_y),
        (x + base_top_w / 2, hinge_y),
        (x + base_bot_w / 2, bot_y),
        (x - base_bot_w / 2, bot_y),
    ]
    _poly(cv, base_pts, fill=fc(style, rgb("#CED6E0")), lw=ol, close=True)

    # Front lip thickness
    lip_h = s * 0.035
    lip_pts = [
        (x - base_bot_w / 2, bot_y),
        (x + base_bot_w / 2, bot_y),
        (x + base_bot_w / 2 * 0.98, bot_y + lip_h),
        (x - base_bot_w / 2 * 0.98, bot_y + lip_h),
    ]
    _poly(cv, lip_pts, fill=fc(style, rgb("#B2BEC3")), lw=ol, close=True)

    # Opening notch
    _sline(cv, (x - s * 0.06, bot_y), (x + s * 0.06, bot_y), lw=ol * 0.85, color=INK)

    # Keyboard recess
    kw = s * 0.58
    kh = s * 0.08
    ky = hinge_y + s * 0.03
    cv.rrect(x - kw / 2, ky, kw, kh, s * 0.015, fill=fc(style, rgb("#2C3E50")), lw=th)

    # Trackpad
    tw = s * 0.20
    th_pad = s * 0.06
    ty = ky + kh + s * 0.015
    cv.rrect(x - tw / 2, ty, tw, th_pad, s * 0.012, fill=fc(style, rgb("#DFE4EA")), lw=th)


# -----------------------------------------------------------------------------
# 3. notebook (open notebook with scribbles)
# -----------------------------------------------------------------------------
def prop_notebook(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)

    nw = s * 0.82
    nh = s * 0.60
    cr = s * 0.035

    # Back cover visible underneath
    cv.rrect(x - nw / 2 - s * 0.015, y - nh / 2 - s * 0.01,
             nw + s * 0.03, nh + s * 0.02, cr,
             fill=fc(style, rgb("#0984E3")), lw=ol)

    # Two open pages (left and right)
    pw = nw * 0.46
    ph = nh * 0.92
    py = y - ph / 2

    # Left page
    cv.rrect(x - pw - s * 0.015, py, pw, ph, s * 0.02,
             fill=fc(style, rgb("#FFFFFF")), lw=ol * 0.9)
    # Right page
    cv.rrect(x + s * 0.015, py, pw, ph, s * 0.02,
             fill=fc(style, rgb("#FFFFFF")), lw=ol * 0.9)

    # Left page margin line (red)
    margin_x = x - pw + s * 0.07
    _sline(cv, (margin_x, py + s * 0.03), (margin_x, py + ph - s * 0.03),
           lw=th * 0.8, color=_sc(style, rgb("#FF7675")))

    # Horizontal ruled lines on left page with wavy scribbles
    for i in range(5):
        ly = py + s * 0.08 + i * (ph - s * 0.14) / 4
        _sline(cv, (margin_x + s * 0.02, ly), (x - s * 0.04, ly),
               lw=th * 0.6, color=_sc(style, rgb("#74B9FF")))
        if i in (0, 1, 3):
            sc_pts = [
                (margin_x + s * 0.03, ly - s * 0.008),
                (margin_x + s * 0.07, ly + s * 0.008),
                (margin_x + s * 0.12, ly - s * 0.008),
                (margin_x + s * 0.17, ly + s * 0.008),
                (margin_x + s * 0.22, ly - s * 0.004),
            ]
            cv.line(sc_pts, w=th * 0.8, color=INK)

    # Right page contents: ruled lines + small doodle
    for i in range(5):
        ly = py + s * 0.08 + i * (ph - s * 0.14) / 4
        _sline(cv, (x + s * 0.04, ly), (x + pw - s * 0.04, ly),
               lw=th * 0.6, color=_sc(style, rgb("#74B9FF")))
        if i in (1, 2):
            sc_pts = [
                (x + s * 0.06, ly - s * 0.008),
                (x + s * 0.12, ly + s * 0.008),
                (x + s * 0.18, ly - s * 0.008),
                (x + s * 0.24, ly + s * 0.004),
            ]
            cv.line(sc_pts, w=th * 0.8, color=INK)

    # Cute doodle on right page (a small star)
    dx = x + pw * 0.65
    dy = py + ph * 0.72
    _star(cv, dx, dy, s * 0.045, s * 0.02, points=5, fill=fc(style, rgb("#FFEAA7")), lw=th * 0.8)

    # Center spiral binding loops (6 oval rings)
    ring_n = 6
    for k in range(ring_n):
        ry = py + s * 0.06 + k * (ph - s * 0.12) / (ring_n - 1)
        cv.ellipse(x, ry, s * 0.035, s * 0.018, fill=fc(style, rgb("#DFE4EA")), w=th * 1.1, rot=-0.2)


# -----------------------------------------------------------------------------
# 4. calendar (month grid with red header)
# -----------------------------------------------------------------------------
def prop_calendar(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)

    cw = s * 0.74
    ch = s * 0.76
    cr = s * 0.04

    # Calendar main backing paper
    cv.rrect(x - cw / 2, y - ch / 2, cw, ch, cr, fill=fc(style, rgb("#FFFFFF")), lw=ol)

    # Red header block
    hh = ch * 0.25
    cv.rrect(x - cw / 2, y - ch / 2, cw, hh, cr, fill=fc(style, rgb("#D7261E")), lw=ol)
    _sline(cv, (x - cw / 2, y - ch / 2 + hh), (x + cw / 2, y - ch / 2 + hh), lw=ol, color=INK)

    # Month label pill inside red header
    cv.rrect(x - cw * 0.22, y - ch / 2 + hh * 0.32, cw * 0.44, hh * 0.38, hh * 0.19,
             fill=fc(style, rgb("#FFFFFF")), lw=th)

    # Top hanging tabs / rings
    ring_y = y - ch / 2
    for rx_off in (-cw * 0.26, cw * 0.26):
        cv.ellipse(x + rx_off, ring_y, s * 0.032, s * 0.045, fill=fc(style, rgb("#DFE4EA")), w=ol * 0.85)

    # Days-of-week mini dots / dashes
    grid_top = y - ch / 2 + hh + s * 0.05
    grid_bot = y + ch / 2 - s * 0.06
    grid_left = x - cw / 2 + s * 0.06
    grid_right = x + cw / 2 - s * 0.06

    cols_n = 7
    rows_n = 4
    col_w = (grid_right - grid_left) / cols_n
    row_h = (grid_bot - grid_top) / rows_n

    for c in range(cols_n):
        cx_pos = grid_left + (c + 0.5) * col_w
        cv.ellipse(cx_pos, grid_top - s * 0.02, s * 0.010, s * 0.010,
                   fill=fc(style, rgb("#A4B0BE")), w=th * 0.6)

    for r in range(rows_n + 1):
        gy = grid_top + r * row_h
        _sline(cv, (grid_left, gy), (grid_right, gy), lw=th * 0.7, color=_sc(style, rgb("#DFE4EA")))

    for c in range(cols_n + 1):
        gx = grid_left + c * col_w
        _sline(cv, (gx, grid_top), (gx, grid_bot), lw=th * 0.7, color=_sc(style, rgb("#DFE4EA")))

    for r in range(rows_n):
        for c in range(cols_n):
            if r == 1 and c == 3:
                cell_cx = grid_left + (c + 0.5) * col_w
                cell_cy = grid_top + (r + 0.5) * row_h
                cv.ellipse(cell_cx, cell_cy, col_w * 0.42, row_h * 0.42,
                           fill=fc(style, rgb("#FFEAA7")), w=ol * 0.8)
                _star(cv, cell_cx, cell_cy, col_w * 0.28, col_w * 0.12, points=5,
                      fill=fc(style, rgb("#D7261E")), lw=th * 0.7)
            else:
                cell_cx = grid_left + (c + 0.5) * col_w
                cell_cy = grid_top + (r + 0.5) * row_h
                _sline(cv, (cell_cx - s * 0.015, cell_cy), (cell_cx + s * 0.015, cell_cy),
                       lw=th * 0.8, color=_sc(style, rgb("#747D8C")))


# -----------------------------------------------------------------------------
# 5. checklist (clipboard with check marks)
# -----------------------------------------------------------------------------
def prop_checklist(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)

    bw = s * 0.68
    bh = s * 0.84
    br = s * 0.05

    # Clipboard wooden base
    cv.rrect(x - bw / 2, y - bh / 2, bw, bh, br, fill=fc(style, rgb("#E67E22")), lw=ol)

    # Hanging hole at top
    cv.ellipse(x, y - bh / 2 + s * 0.045, s * 0.024, s * 0.024,
               fill=fc(style, rgb("#D35400")), w=th)

    # Paper sheet clipped on
    pw = bw - s * 0.12
    ph = bh - s * 0.15
    py = y - bh / 2 + s * 0.10
    cv.rrect(x - pw / 2, py, pw, ph, s * 0.02, fill=fc(style, rgb("#FFFFFF")), lw=ol * 0.9)

    # Metal clip plate at top
    cw = s * 0.34
    ch = s * 0.09
    cy_clip = y - bh / 2 + s * 0.06
    cv.rrect(x - cw / 2, cy_clip, cw, ch, s * 0.02, fill=fc(style, rgb("#BDC3C7")), lw=ol)
    cv.ellipse(x, cy_clip - s * 0.005, s * 0.065, s * 0.042, fill=None, w=ol * 0.85)

    # 4 Checklist items
    item_n = 4
    start_y = py + s * 0.10
    spacing = (ph - s * 0.15) / (item_n - 1)

    for i in range(item_n):
        iy = start_y + i * spacing
        bx = x - pw / 2 + s * 0.08
        box_s = s * 0.075

        cv.rrect(bx, iy - box_s / 2, box_s, box_s, s * 0.015,
                 fill=fc(style, rgb("#E8F8F5") if i < 3 else rgb("#F8F9FA")), lw=th * 1.1)

        if i < 3:
            p1 = (bx + box_s * 0.18, iy + box_s * 0.02)
            p2 = (bx + box_s * 0.42, iy + box_s * 0.34)
            p3 = (bx + box_s * 0.86, iy - box_s * 0.34)
            c = cv.c
            c.new_path()
            c.move_to(*p1)
            c.line_to(*p2)
            c.line_to(*p3)
            c.set_source_rgb(*_sc(style, rgb("#2ECC71")))
            c.set_line_width(ol * 0.95)
            c.stroke()

        tx_start = bx + box_s + s * 0.04
        tx_end1 = x + pw / 2 - s * 0.06
        tx_end2 = tx_start + (tx_end1 - tx_start) * (0.65 if i % 2 == 0 else 0.8)

        _sline(cv, (tx_start, iy - s * 0.012), (tx_end1, iy - s * 0.012),
               lw=th * 1.1, color=_sc(style, rgb("#2C3E50")))
        _sline(cv, (tx_start, iy + s * 0.018), (tx_end2, iy + s * 0.018),
               lw=th * 0.8, color=_sc(style, rgb("#BDC3C7")))


# -----------------------------------------------------------------------------
# 6. envelope
# -----------------------------------------------------------------------------
def prop_envelope(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)

    ew = s * 0.78
    eh = s * 0.52
    er = s * 0.035

    # Main envelope body
    cv.rrect(x - ew / 2, y - eh / 2, ew, eh, er, fill=fc(style, rgb("#F8F9FA")), lw=ol)

    # Diagonal folds from bottom corners to center
    cx_center = x
    cy_center = y + s * 0.05
    _sline(cv, (x - ew / 2, y + eh / 2), (cx_center, cy_center), lw=ol * 0.9, color=INK)
    _sline(cv, (x + ew / 2, y + eh / 2), (cx_center, cy_center), lw=ol * 0.9, color=INK)

    # Top V-flap (folded down over body)
    flap_pts = [
        (x - ew / 2, y - eh / 2),
        (x + ew / 2, y - eh / 2),
        (cx_center, cy_center),
    ]
    _poly(cv, flap_pts, fill=fc(style, rgb("#FFFFFF")), lw=ol, close=True)

    # Red wax seal at center V
    seal_r = s * 0.065
    cv.ellipse(cx_center, cy_center, seal_r, seal_r, fill=fc(style, rgb("#E74C3C")), w=ol * 0.85)
    _star(cv, cx_center, cy_center, seal_r * 0.55, seal_r * 0.25, points=5,
          fill=fc(style, rgb("#C0392B")), lw=th * 0.6)

    # Postage stamp in top-right corner
    sw = s * 0.14
    sh = s * 0.17
    sx = x + ew / 2 - sw - s * 0.04
    sy = y - eh / 2 + s * 0.04
    cv.rrect(sx, sy, sw, sh, s * 0.01, fill=fc(style, rgb("#3498DB")), lw=th * 0.9)
    _star(cv, sx + sw / 2, sy + sh / 2, sw * 0.32, sw * 0.15, points=5,
          fill=fc(style, rgb("#FFFFFF")), lw=th * 0.6)

    # Postmark wavy cancellation lines
    for off in (-s * 0.015, s * 0.015):
        w_pts = [
            (sx - s * 0.06, sy + sh / 2 + off),
            (sx - s * 0.02, sy + sh / 2 + off - s * 0.01),
            (sx + s * 0.02, sy + sh / 2 + off + s * 0.01),
            (sx + s * 0.06, sy + sh / 2 + off),
        ]
        cv.line(w_pts, w=th * 0.7, color=INK)


# -----------------------------------------------------------------------------
# 7. document
# -----------------------------------------------------------------------------
def prop_document(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)

    dw = s * 0.62
    dh = s * 0.82
    fold_s = s * 0.16

    # Document main sheet with top-right corner cut off
    sheet_pts = [
        (x - dw / 2, y - dh / 2),
        (x + dw / 2 - fold_s, y - dh / 2),
        (x + dw / 2, y - dh / 2 + fold_s),
        (x + dw / 2, y + dh / 2),
        (x - dw / 2, y + dh / 2),
    ]
    _poly(cv, sheet_pts, fill=fc(style, rgb("#FFFFFF")), lw=ol, close=True)

    # Folded corner triangle (dog-ear)
    fold_pts = [
        (x + dw / 2 - fold_s, y - dh / 2),
        (x + dw / 2 - fold_s, y - dh / 2 + fold_s),
        (x + dw / 2, y - dh / 2 + fold_s),
    ]
    _poly(cv, fold_pts, fill=fc(style, rgb("#DFE4EA")), lw=ol, close=True)

    # Header section: blue logo badge and title bar
    badge_x = x - dw / 2 + s * 0.07
    badge_y = y - dh / 2 + s * 0.08
    cv.rrect(badge_x, badge_y, s * 0.18, s * 0.045, s * 0.015,
             fill=fc(style, rgb("#0984E3")), lw=th * 0.8)

    _sline(cv, (badge_x + s * 0.22, badge_y + s * 0.022),
           (x + dw / 2 - fold_s - s * 0.02, badge_y + s * 0.022),
           lw=th * 1.2, color=_sc(style, rgb("#2C3E50")))

    # Body lines - paragraph 1
    p1_y = badge_y + s * 0.10
    widths = [dw * 0.78, dw * 0.72, dw * 0.50]
    for k, w_line in enumerate(widths):
        ly = p1_y + k * s * 0.045
        _sline(cv, (x - dw / 2 + s * 0.07, ly), (x - dw / 2 + s * 0.07 + w_line, ly),
               lw=th * 0.9, color=_sc(style, rgb("#747D8C")))

    # Thin divider line
    _sline(cv, (x - dw / 2 + s * 0.07, p1_y + s * 0.16),
           (x + dw / 2 - s * 0.07, p1_y + s * 0.16),
           lw=th * 0.7, color=_sc(style, rgb("#DFE4EA")))

    # Body lines - paragraph 2
    p2_y = p1_y + s * 0.20
    for k, w_line in enumerate([dw * 0.76, dw * 0.65]):
        ly = p2_y + k * s * 0.045
        _sline(cv, (x - dw / 2 + s * 0.07, ly), (x - dw / 2 + s * 0.07 + w_line, ly),
               lw=th * 0.9, color=_sc(style, rgb("#747D8C")))

    # Bottom left: miniature chart bars (red, yellow, green)
    chart_x = x - dw / 2 + s * 0.08
    chart_y = y + dh / 2 - s * 0.08
    bar_w = s * 0.04
    bar_heights = [s * 0.07, s * 0.12, s * 0.09]
    bar_cols = [rgb("#FF7675"), rgb("#FFEAA7"), rgb("#55EFC4")]
    for b in range(3):
        bx = chart_x + b * (bar_w + s * 0.015)
        bh = bar_heights[b]
        cv.rrect(bx, chart_y - bh, bar_w, bh, s * 0.01, fill=fc(style, bar_cols[b]), lw=th * 0.8)

    # Bottom right: official red seal with ribbon tails
    seal_cx = x + dw / 2 - s * 0.14
    seal_cy = y + dh / 2 - s * 0.13
    seal_r = s * 0.065

    rib1 = [(seal_cx - s * 0.03, seal_cy + s * 0.04), (seal_cx - s * 0.045, seal_cy + s * 0.10),
            (seal_cx - s * 0.02, seal_cy + s * 0.08), (seal_cx - s * 0.005, seal_cy + s * 0.04)]
    rib2 = [(seal_cx + s * 0.005, seal_cy + s * 0.04), (seal_cx + s * 0.02, seal_cy + s * 0.08),
            (seal_cx + s * 0.045, seal_cy + s * 0.10), (seal_cx + s * 0.03, seal_cy + s * 0.04)]
    _poly(cv, rib1, fill=fc(style, rgb("#0984E3")), lw=th * 0.7, close=True)
    _poly(cv, rib2, fill=fc(style, rgb("#0984E3")), lw=th * 0.7, close=True)

    cv.ellipse(seal_cx, seal_cy, seal_r, seal_r, fill=fc(style, rgb("#E74C3C")), w=ol * 0.85)
    _star(cv, seal_cx, seal_cy, seal_r * 0.5, seal_r * 0.22, points=5,
          fill=fc(style, rgb("#FFFFFF")), lw=th * 0.6)


# -----------------------------------------------------------------------------
# 8. book
# -----------------------------------------------------------------------------
def prop_book(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)
    c = cv.c

    cover_col = rgb("#C0392B")  # Rich royal crimson
    gold_col = rgb("#F1C40F")

    # Fully aligned isometric closed book
    ox, oy = x - s * 0.26, y - s * 0.27
    ux, uy = s * 0.46, -s * 0.08    # cover width vector
    vx, vy = s * 0.08, s * 0.54     # spine/height vector
    wx, wy = s * 0.09, s * 0.07     # depth / page thickness vector

    p_tl = (ox, oy)
    p_tr = (ox + ux, oy + uy)
    p_br = (ox + ux + vx, oy + uy + vy)
    p_bl = (ox + vx, oy + vy)

    p_tr_w = (p_tr[0] + wx, p_tr[1] + wy)
    p_br_w = (p_br[0] + wx, p_br[1] + wy)
    p_bl_w = (p_bl[0] + wx, p_bl[1] + wy)

    # Right page block
    page_right = [p_tr, p_tr_w, p_br_w, p_br]
    _poly(cv, page_right, fill=fc(style, rgb("#F8F9FA")), lw=ol, close=True)

    for t in (0.33, 0.66):
        lx1 = p_tr[0] * (1 - t) + p_tr_w[0] * t, p_tr[1] * (1 - t) + p_tr_w[1] * t
        lx2 = p_br[0] * (1 - t) + p_br_w[0] * t, p_br[1] * (1 - t) + p_br_w[1] * t
        _sline(cv, lx1, lx2, lw=th * 0.7, color=INK)

    # Bottom page block
    page_bot = [p_br, p_br_w, p_bl_w, p_bl]
    _poly(cv, page_bot, fill=fc(style, rgb("#DFE4EA")), lw=ol, close=True)

    for t in (0.33, 0.66):
        lx1 = p_bl[0] * (1 - t) + p_bl_w[0] * t, p_bl[1] * (1 - t) + p_bl_w[1] * t
        lx2 = p_br[0] * (1 - t) + p_br_w[0] * t, p_br[1] * (1 - t) + p_br_w[1] * t
        _sline(cv, lx1, lx2, lw=th * 0.7, color=INK)

    # Spine on left
    spine_w = s * 0.08
    spine_pts = [
        (p_tl[0] - spine_w, p_tl[1] + wy * 0.5),
        p_tl,
        p_bl,
        (p_bl[0] - spine_w, p_bl[1] + wy * 0.5),
    ]
    _poly(cv, spine_pts, fill=fc(style, shade(cover_col, 0.82)), lw=ol, close=True)

    # Gold bands on spine
    for frac in (0.22, 0.50, 0.78):
        s1 = ((p_tl[0] - spine_w) * (1 - frac) + (p_bl[0] - spine_w) * frac,
              (p_tl[1] + wy * 0.5) * (1 - frac) + (p_bl[1] + wy * 0.5) * frac)
        s2 = (p_tl[0] * (1 - frac) + p_bl[0] * frac,
              p_tl[1] * (1 - frac) + p_bl[1] * frac)
        _sline(cv, s1, s2, lw=th * 1.2, color=_sc(style, gold_col))

    # Front cover block
    cover_pts = [p_tl, p_tr, p_br, p_bl]
    _poly(cv, cover_pts, fill=fc(style, cover_col), lw=ol, close=True)

    # Inset gold border
    inset_cov = [
        (p_tl[0] + ux * 0.1 + vx * 0.08, p_tl[1] + uy * 0.1 + vy * 0.08),
        (p_tl[0] + ux * 0.9 + vx * 0.08, p_tl[1] + uy * 0.9 + vy * 0.08),
        (p_tl[0] + ux * 0.9 + vx * 0.92, p_tl[1] + uy * 0.9 + vy * 0.92),
        (p_tl[0] + ux * 0.1 + vx * 0.92, p_tl[1] + uy * 0.1 + vy * 0.92),
    ]
    _poly(cv, inset_cov, fill=None, lw=th * 1.1, close=True)

    # Star on cover
    star_cx = p_tl[0] + ux * 0.5 + vx * 0.5
    star_cy = p_tl[1] + uy * 0.5 + vy * 0.5
    _star(cv, star_cx, star_cy, s * 0.09, s * 0.04, points=5, fill=fc(style, gold_col), lw=th * 0.85)

    # Bookmark ribbon hanging from bottom
    rib_start = (p_bl[0] + ux * 0.45 + wx * 0.5, p_bl[1] + uy * 0.45 + wy * 0.5)
    rib_pts = [
        (rib_start[0] - s * 0.02, rib_start[1]),
        (rib_start[0] - s * 0.01, rib_start[1] + s * 0.12),
        (rib_start[0] + s * 0.015, rib_start[1] + s * 0.085),
        (rib_start[0] + s * 0.04, rib_start[1] + s * 0.12),
        (rib_start[0] + s * 0.03, rib_start[1]),
    ]
    _poly(cv, rib_pts, fill=fc(style, gold_col), lw=th * 0.9, close=True)


# -----------------------------------------------------------------------------
# 9. pencil
# -----------------------------------------------------------------------------
def prop_pencil(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)

    c = cv.c
    c.save()
    c.translate(x, y)
    c.rotate(math.radians(-35))

    L = s * 0.82
    h = s * 0.12

    x_eraser_start = -L / 2
    x_ferrule_start = x_eraser_start + s * 0.10
    x_shaft_start = x_ferrule_start + s * 0.10
    x_cone_start = L / 2 - s * 0.18
    x_tip_start = L / 2 - s * 0.06
    x_tip_end = L / 2

    # 1. Pink eraser
    c.new_path()
    c.arc(x_eraser_start + s * 0.03, 0, h / 2, math.pi / 2, 3 * math.pi / 2)
    c.line_to(x_ferrule_start, -h / 2)
    c.line_to(x_ferrule_start, h / 2)
    c.close_path()
    c.set_source_rgb(*fc(style, rgb("#FF7675")))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(ol)
    c.stroke()

    # 2. Silver ferrule band
    ferrule_pts = [
        (x_ferrule_start, -h / 2),
        (x_shaft_start, -h / 2),
        (x_shaft_start, h / 2),
        (x_ferrule_start, h / 2),
    ]
    _poly(cv, ferrule_pts, fill=fc(style, rgb("#BDC3C7")), lw=ol, close=True)

    for fx_off in (0.35, 0.65):
        fx = x_ferrule_start * (1 - fx_off) + x_shaft_start * fx_off
        _sline(cv, (fx, -h / 2), (fx, h / 2), lw=th * 0.8, color=INK)

    # 3. Hexagonal shaft (3 facet strips)
    facet_cols = [rgb("#FFEAA7"), rgb("#F1C40F"), rgb("#E67E22")]
    f_h = h / 3
    for k in range(3):
        fy1 = -h / 2 + k * f_h
        fy2 = fy1 + f_h
        f_pts = [
            (x_shaft_start, fy1),
            (x_cone_start, fy1),
            (x_cone_start, fy2),
            (x_shaft_start, fy2),
        ]
        _poly(cv, f_pts, fill=fc(style, facet_cols[k]), lw=ol if (k == 0 or k == 2) else th * 0.9, close=True)

    # 4. Sharpened wood cone
    wood_pts = [
        (x_cone_start, -h / 2),
        (x_tip_start, -h * 0.18),
        (x_tip_start, h * 0.18),
        (x_cone_start, h / 2),
    ]
    _poly(cv, wood_pts, fill=fc(style, rgb("#F8C291")), lw=ol, close=True)

    # 5. Graphite lead tip
    lead_pts = [
        (x_tip_start, -h * 0.18),
        (x_tip_end, 0),
        (x_tip_start, h * 0.18),
    ]
    c.new_path()
    c.move_to(*lead_pts[0])
    for p in lead_pts[1:]:
        c.line_to(*p)
    c.close_path()
    c.set_source_rgb(*INK)
    c.fill_preserve()
    c.set_line_width(ol)
    c.stroke()

    c.restore()


# -----------------------------------------------------------------------------
# 10. key
# -----------------------------------------------------------------------------
def prop_key(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)

    c = cv.c
    c.save()
    c.translate(x, y)
    c.rotate(math.radians(-35))

    gold = rgb("#F39C12")  # Warm amber gold for strong contrast

    # Key Bow (head) centered at -s * 0.22
    bow_cx = -s * 0.22
    bow_r_out = s * 0.14
    bow_r_in = s * 0.065

    # Donut using new_sub_path to avoid radial join line
    c.new_path()
    c.arc(bow_cx, 0, bow_r_out, 0, 2 * math.pi)
    c.close_path()
    c.new_sub_path()
    c.arc_negative(bow_cx, 0, bow_r_in, 2 * math.pi, 0)
    c.close_path()
    c.set_fill_rule(cairo.FILL_RULE_EVEN_ODD)
    c.set_source_rgb(*fc(style, gold))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(ol)
    c.stroke()
    c.set_fill_rule(cairo.FILL_RULE_WINDING)

    # Decorative collar beads
    for cx_off in (bow_cx + bow_r_out, bow_cx + bow_r_out + s * 0.03):
        c.new_path()
        c.save()
        c.scale(1.0, 1.8)
        c.arc(cx_off, 0, s * 0.016, 0, 2 * math.pi)
        c.restore()
        c.set_source_rgb(*fc(style, shade(gold, 0.9)))
        c.fill_preserve()
        c.set_source_rgb(*INK)
        c.set_line_width(th * 1.1)
        c.stroke()

    # Stem (shaft)
    shaft_start = bow_cx + bow_r_out + s * 0.04
    shaft_end = s * 0.30
    shaft_w = s * 0.055

    shaft_pts = [
        (shaft_start, -shaft_w / 2),
        (shaft_end, -shaft_w / 2),
        (shaft_end + s * 0.03, 0),
        (shaft_end, shaft_w / 2),
        (shaft_start, shaft_w / 2),
    ]
    _poly(cv, shaft_pts, fill=fc(style, gold), lw=ol, close=True)

    # Bit (teeth / flag) extending downward from shaft
    bit_start = s * 0.14
    bit_end = s * 0.28
    bit_depth = s * 0.15

    bit_pts = [
        (bit_start, shaft_w / 2),
        (bit_start, shaft_w / 2 + bit_depth),
        (bit_start + s * 0.04, shaft_w / 2 + bit_depth),
        (bit_start + s * 0.04, shaft_w / 2 + bit_depth * 0.45),
        (bit_start + s * 0.075, shaft_w / 2 + bit_depth * 0.45),
        (bit_start + s * 0.075, shaft_w / 2 + bit_depth),
        (bit_end, shaft_w / 2 + bit_depth),
        (bit_end, shaft_w / 2),
    ]
    _poly(cv, bit_pts, fill=fc(style, gold), lw=ol, close=True)

    # Highlight stroke along top of shaft
    _sline(cv, (shaft_start + s * 0.02, -shaft_w * 0.15),
           (shaft_end - s * 0.02, -shaft_w * 0.15),
           lw=th * 0.9, color=_sc(style, rgb("#FFFFFF")))

    c.restore()


# -----------------------------------------------------------------------------
# 11. lock (padlock)
# -----------------------------------------------------------------------------
def prop_lock(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)

    # Shackle (U-shaped hardened steel loop at top)
    shackle_top = y - s * 0.38
    shackle_bot = y - s * 0.08
    sh_r_out = s * 0.17
    sh_r_in = s * 0.105

    c = cv.c
    c.new_path()
    c.arc(x, shackle_top + sh_r_out, sh_r_out, math.pi, 2 * math.pi)
    c.line_to(x + sh_r_out, shackle_bot)
    c.line_to(x + sh_r_in, shackle_bot)
    c.arc_negative(x, shackle_top + sh_r_out, sh_r_in, 2 * math.pi, math.pi)
    c.line_to(x - sh_r_out, shackle_bot)
    c.close_path()
    c.set_source_rgb(*fc(style, rgb("#DFE4EA")))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(ol)
    c.stroke()

    # Body (solid golden brass block with rounded bottom)
    bw = s * 0.58
    bh = s * 0.44
    by = shackle_bot - s * 0.02
    br = s * 0.07

    cv.rrect(x - bw / 2, by, bw, bh, br, fill=fc(style, rgb("#F1C40F")), lw=ol)

    # Lower shaded rim of body
    rim_h = bh * 0.28
    cv.rrect(x - bw / 2, by + bh - rim_h, bw, rim_h, br,
             fill=fc(style, rgb("#F39C12")), lw=th * 1.1)

    # Keyhole in center of body
    kh_y = by + bh * 0.46
    kh_r = s * 0.038
    kh_w_bot = s * 0.046
    kh_h_bot = s * 0.06

    c.new_path()
    c.arc(x, kh_y, kh_r, math.pi * 0.75, math.pi * 2.25)
    c.line_to(x + kh_w_bot / 2, kh_y + kh_h_bot)
    c.line_to(x - kh_w_bot / 2, kh_y + kh_h_bot)
    c.close_path()
    c.set_source_rgb(*INK)
    c.fill_preserve()
    c.set_line_width(th * 0.8)
    c.stroke()

    # Specular highlight stroke down left of body
    _sline(cv, (x - bw / 2 + s * 0.05, by + s * 0.06),
           (x - bw / 2 + s * 0.05, by + bh - s * 0.06),
           lw=th * 0.9, color=_sc(style, rgb("#FFFFFF")))


# -----------------------------------------------------------------------------
# 12. shield
# -----------------------------------------------------------------------------
def prop_shield(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)

    sw = s * 0.68
    sh = s * 0.82
    top_y = y - sh / 2
    bot_y = y + sh / 2
    mid_y = y - s * 0.04
    crest = s * 0.03

    c = cv.c

    # Outer shield rim
    c.new_path()
    c.move_to(x - sw / 2, top_y)
    c.curve_to(x - sw * 0.25, top_y - crest, x + sw * 0.25, top_y - crest, x + sw / 2, top_y)
    c.line_to(x + sw / 2, mid_y)
    c.curve_to(x + sw / 2, bot_y - s * 0.16, x + sw * 0.20, bot_y - s * 0.04, x, bot_y)
    c.curve_to(x - sw * 0.20, bot_y - s * 0.04, x - sw / 2, bot_y - s * 0.16, x - sw / 2, mid_y)
    c.close_path()
    c.set_source_rgb(*fc(style, rgb("#DFE4EA")))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(ol)
    c.stroke()

    # Inner face inset
    inset = s * 0.045
    in_sw = sw - inset * 2
    in_top_y = top_y + inset
    in_bot_y = bot_y - inset * 1.1
    in_mid_y = mid_y

    # Left half face (bright blue)
    c.new_path()
    c.move_to(x, in_top_y - crest * 0.6)
    c.line_to(x, in_bot_y)
    c.curve_to(x - in_sw * 0.20, in_bot_y - s * 0.04, x - in_sw / 2, in_bot_y - s * 0.16, x - in_sw / 2, in_mid_y)
    c.line_to(x - in_sw / 2, in_top_y)
    c.curve_to(x - in_sw * 0.25, in_top_y - crest * 0.6, x - in_sw * 0.1, in_top_y - crest * 0.6, x, in_top_y - crest * 0.6)
    c.close_path()
    c.set_source_rgb(*fc(style, rgb("#3498DB")))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(th * 1.2)
    c.stroke()

    # Right half face (dark navy)
    c.new_path()
    c.move_to(x, in_top_y - crest * 0.6)
    c.curve_to(x + in_sw * 0.1, in_top_y - crest * 0.6, x + in_sw * 0.25, in_top_y - crest * 0.6, x + in_sw / 2, in_top_y)
    c.line_to(x + in_sw / 2, in_mid_y)
    c.curve_to(x + in_sw / 2, in_bot_y - s * 0.16, x + in_sw * 0.20, in_bot_y - s * 0.04, x, in_bot_y)
    c.line_to(x, in_top_y - crest * 0.6)
    c.close_path()
    c.set_source_rgb(*fc(style, rgb("#2980B9")))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(th * 1.2)
    c.stroke()

    # Vertical center dividing line
    _sline(cv, (x, in_top_y - crest * 0.6), (x, in_bot_y), lw=th * 1.2, color=INK)

    # Large bold white star emblem in center
    _star(cv, x, y - s * 0.04, s * 0.15, s * 0.065, points=5,
          fill=fc(style, rgb("#FFFFFF")), lw=ol * 0.85)


# -----------------------------------------------------------------------------
# 13. trophy
# -----------------------------------------------------------------------------
def prop_trophy(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)
    c = cv.c

    gold = rgb("#F1C40F")
    dark_gold = rgb("#F39C12")

    # Handles on left and right (volumetric curved ears)
    for flip in (-1, 1):
        hx_top = x + flip * s * 0.18
        hx_outer = x + flip * s * 0.38
        hx_bot = x + flip * s * 0.11
        hy_top = y - s * 0.18
        hy_bot = y + s * 0.06

        c.new_path()
        c.move_to(hx_top, hy_top)
        c.curve_to(hx_outer, hy_top - s * 0.02, hx_outer, hy_bot + s * 0.02, hx_bot, hy_bot)
        c.line_to(hx_bot, hy_bot - s * 0.04)
        c.curve_to(hx_outer - flip * s * 0.08, hy_bot - s * 0.01,
                    hx_outer - flip * s * 0.08, hy_top + s * 0.04,
                    hx_top, hy_top + s * 0.04)
        c.close_path()
        c.set_source_rgb(*fc(style, gold))
        c.fill_preserve()
        c.set_source_rgb(*INK)
        c.set_line_width(ol)
        c.stroke()

    # Stem connecting pedestal to cup
    stem_top_w = s * 0.14
    stem_bot_w = s * 0.20
    stem_top_y = y + s * 0.12
    stem_bot_y = y + s * 0.24

    stem_pts = [
        (x - stem_top_w / 2, stem_top_y),
        (x + stem_top_w / 2, stem_top_y),
        (x + stem_bot_w / 2, stem_bot_y),
        (x - stem_bot_w / 2, stem_bot_y),
    ]
    _poly(cv, stem_pts, fill=fc(style, dark_gold), lw=ol, close=True)

    # Spool ring in middle of stem
    cv.rrect(x - s * 0.10, y + s * 0.16, s * 0.20, s * 0.035, s * 0.012,
             fill=fc(style, gold), lw=th * 1.1)

    # Cup body
    cup_top_w = s * 0.48
    cup_top_y = y - s * 0.24
    c.new_path()
    c.move_to(x - cup_top_w / 2, cup_top_y)
    c.curve_to(x - cup_top_w / 2, y - s * 0.02, x - stem_top_w / 2, y + s * 0.06, x - stem_top_w / 2, stem_top_y)
    c.line_to(x + stem_top_w / 2, stem_top_y)
    c.curve_to(x + stem_top_w / 2, y + s * 0.06, x + cup_top_w / 2, y - s * 0.02, x + cup_top_w / 2, cup_top_y)
    c.close_path()
    c.set_source_rgb(*fc(style, gold))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(ol)
    c.stroke()

    # Top opening rim (ellipse)
    cv.ellipse(x, cup_top_y, cup_top_w / 2, s * 0.045, fill=fc(style, dark_gold), w=ol)

    # Pedestal (two-tier dark slate base)
    base_bot_w = s * 0.50
    base_bot_h = s * 0.08
    base_bot_y = y + s * 0.30
    base_top_w = s * 0.38
    base_top_h = s * 0.06
    base_top_y = base_bot_y - base_top_h

    cv.rrect(x - base_top_w / 2, base_top_y, base_top_w, base_top_h, s * 0.012,
             fill=fc(style, rgb("#34495E")), lw=ol)
    cv.rrect(x - base_bot_w / 2, base_bot_y, base_bot_w, base_bot_h, s * 0.015,
             fill=fc(style, rgb("#2C3E50")), lw=ol)

    # Gold plaque
    plaque_w = s * 0.24
    plaque_h = s * 0.045
    cv.rrect(x - plaque_w / 2, base_bot_y + (base_bot_h - plaque_h) / 2, plaque_w, plaque_h, s * 0.008,
             fill=fc(style, gold), lw=th * 0.8)

    # Center embossed star on cup
    _star(cv, x, y - s * 0.05, s * 0.09, s * 0.04, points=5,
          fill=fc(style, rgb("#FFFFFF")), lw=th * 1.1)

    # Sparkle glint star
    _star(cv, x + cup_top_w * 0.46, cup_top_y - s * 0.03, s * 0.035, s * 0.012, points=4,
          fill=fc(style, rgb("#FFFFFF")), lw=th * 0.7)


# -----------------------------------------------------------------------------
# 14. medal
# -----------------------------------------------------------------------------
def prop_medal(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)

    gold = rgb("#F1C40F")

    # V-shaped ribbon at top
    ribbon_w = s * 0.16
    top_y = y - s * 0.40
    meet_y = y - s * 0.06

    left_rib = [
        (x - s * 0.26, top_y),
        (x - s * 0.26 + ribbon_w, top_y),
        (x + ribbon_w * 0.3, meet_y),
        (x - ribbon_w * 0.3, meet_y),
    ]
    _poly(cv, left_rib, fill=fc(style, rgb("#E74C3C")), lw=ol, close=True)

    right_rib = [
        (x + s * 0.26 - ribbon_w, top_y),
        (x + s * 0.26, top_y),
        (x + ribbon_w * 0.3, meet_y),
        (x - ribbon_w * 0.3, meet_y),
    ]
    _poly(cv, right_rib, fill=fc(style, rgb("#0984E3")), lw=ol, close=True)

    _sline(cv, (x - s * 0.18, top_y), (x, meet_y), lw=th * 1.1, color=_sc(style, rgb("#FFFFFF")))
    _sline(cv, (x + s * 0.18, top_y), (x, meet_y), lw=th * 1.1, color=_sc(style, rgb("#FFFFFF")))

    # Connector ring
    cv.ellipse(x, meet_y + s * 0.02, s * 0.035, s * 0.035, fill=fc(style, gold), w=ol * 0.8)

    # Medallion (large circular gold coin)
    coin_cy = y + s * 0.16
    coin_r = s * 0.22
    cv.ellipse(x, coin_cy, coin_r, coin_r, fill=fc(style, gold), w=ol)

    # Inner concentric embossed ring
    cv.ellipse(x, coin_cy, coin_r * 0.75, coin_r * 0.75,
               fill=fc(style, rgb("#F39C12")), w=th * 1.2)

    # Large bold embossed number "1" in center
    one_h = coin_r * 0.85
    one_pts = [
        (x - s * 0.05, coin_cy - one_h * 0.25),
        (x - s * 0.01, coin_cy - one_h * 0.45),
        (x + s * 0.025, coin_cy - one_h * 0.45),
        (x + s * 0.025, coin_cy + one_h * 0.35),
        (x + s * 0.06, coin_cy + one_h * 0.35),
        (x + s * 0.06, coin_cy + one_h * 0.45),
        (x - s * 0.06, coin_cy + one_h * 0.45),
        (x - s * 0.06, coin_cy + one_h * 0.35),
        (x - s * 0.015, coin_cy + one_h * 0.35),
        (x - s * 0.015, coin_cy - one_h * 0.25),
    ]
    _poly(cv, one_pts, fill=fc(style, rgb("#FFFFFF")), lw=ol * 0.8, close=True)

    # Laurel sprigs on left and right inside medallion
    for flip in (-1, 1):
        laurel_pts = [
            (x + flip * coin_r * 0.58, coin_cy - coin_r * 0.25),
            (x + flip * coin_r * 0.62, coin_cy + coin_r * 0.10),
            (x + flip * coin_r * 0.45, coin_cy + coin_r * 0.42),
        ]
        cv.line(laurel_pts, w=th * 0.9, color=_sc(style, rgb("#2ECC71")))

    # Sparkle glint on coin rim
    _star(cv, x + coin_r * 0.68, coin_cy - coin_r * 0.68, s * 0.04, s * 0.015, points=4,
          fill=fc(style, rgb("#FFFFFF")), lw=th * 0.7)


# -----------------------------------------------------------------------------
# 15. lightbulb
# -----------------------------------------------------------------------------
def prop_lightbulb(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)

    bulb_cy = y - s * 0.08
    bulb_r = s * 0.26
    neck_w = s * 0.22
    neck_y = bulb_cy + s * 0.26

    # Glass bulb contour
    bulb_pts = [
        (x, bulb_cy - bulb_r),
        (x + bulb_r * 0.72, bulb_cy - bulb_r * 0.68),
        (x + bulb_r, bulb_cy),
        (x + bulb_r * 0.75, bulb_cy + bulb_r * 0.65),
        (x + neck_w / 2, neck_y),
        (x - neck_w / 2, neck_y),
        (x - bulb_r * 0.75, bulb_cy + bulb_r * 0.65),
        (x - bulb_r, bulb_cy),
        (x - bulb_r * 0.72, bulb_cy - bulb_r * 0.68),
    ]
    cv.shape(bulb_pts, fill=fc(style, rgb("#FED330")), w=ol, close=True)

    # Filament inside
    f_base_y = neck_y - s * 0.03
    _sline(cv, (x - s * 0.045, f_base_y), (x - s * 0.045, bulb_cy + s * 0.04),
           lw=th * 0.9, color=INK)
    _sline(cv, (x + s * 0.045, f_base_y), (x + s * 0.045, bulb_cy + s * 0.04),
           lw=th * 0.9, color=INK)

    fil_pts = [
        (x - s * 0.045, bulb_cy + s * 0.04),
        (x - s * 0.035, bulb_cy - s * 0.04),
        (x, bulb_cy - s * 0.01),
        (x + s * 0.035, bulb_cy - s * 0.04),
        (x + s * 0.045, bulb_cy + s * 0.04),
    ]
    cv.line(fil_pts, w=th * 1.2, color=_sc(style, rgb("#E17055")))

    # Screw base threads
    thread_h = s * 0.042
    thread_w = neck_w * 0.96
    for k in range(3):
        ty = neck_y + k * (thread_h * 0.85)
        cv.rrect(x - thread_w / 2, ty, thread_w, thread_h, s * 0.015,
                 fill=fc(style, rgb("#BDC3C7")), lw=ol * 0.85)

    # Bottom electrical contact
    contact_y = neck_y + 3 * (thread_h * 0.85)
    c = cv.c
    c.new_path()
    c.arc(x, contact_y, s * 0.05, 0, math.pi)
    c.close_path()
    c.set_source_rgb(*INK)
    c.fill_preserve()
    c.set_line_width(ol * 0.85)
    c.stroke()

    # Radiating glow rays
    ray_angles = [-160, -135, -110, -90, -70, -45, -20]
    for ang_deg in ray_angles:
        rad = math.radians(ang_deg)
        r1 = bulb_r + s * 0.06
        r2 = bulb_r + s * 0.16
        p1 = (x + r1 * math.cos(rad), bulb_cy + r1 * math.sin(rad))
        p2 = (x + r2 * math.cos(rad), bulb_cy + r2 * math.sin(rad))
        _sline(cv, p1, p2, lw=ol * 0.9, color=_sc(style, rgb("#F39C12")))

    # Specular curved highlight on glass
    c.new_path()
    c.arc(x, bulb_cy, bulb_r * 0.75, math.pi * 1.15, math.pi * 1.45)
    c.set_source_rgb(*_sc(style, rgb("#FFFFFF")))
    c.set_line_width(th * 1.2)
    c.stroke()


# -----------------------------------------------------------------------------
# 16. brain
# -----------------------------------------------------------------------------
def prop_brain(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)
    c = cv.c

    pink = rgb("#FF7675")
    cereb_col = rgb("#FDA7DF")

    # Brain stem at bottom
    stem_pts = [
        (x - s * 0.06, y + s * 0.16),
        (x - s * 0.04, y + s * 0.30),
        (x + s * 0.04, y + s * 0.28),
        (x + s * 0.03, y + s * 0.14),
    ]
    _poly(cv, stem_pts, fill=fc(style, shade(pink, 0.75)), lw=ol, close=True)

    # Cerebellum (tucked under occipital lobe)
    c.new_path()
    c.arc(x + s * 0.14, y + s * 0.15, s * 0.11, 0, 2 * math.pi)
    c.set_source_rgb(*fc(style, cereb_col))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(ol)
    c.stroke()

    for off in (-s * 0.04, 0.0, s * 0.04):
        c.new_path()
        c.arc(x + s * 0.14, y + s * 0.15 + off, s * 0.09, 0.2 * math.pi, 0.8 * math.pi)
        c.set_source_rgb(*INK)
        c.set_line_width(th * 0.9)
        c.stroke()

    # Cerebrum with scalloped cartoon perimeter
    c.new_path()
    c.move_to(x - s * 0.06, y + s * 0.14)
    c.curve_to(x - s * 0.14, y + s * 0.18, x - s * 0.26, y + s * 0.16, x - s * 0.28, y + s * 0.08)
    c.curve_to(x - s * 0.36, y + s * 0.04, x - s * 0.38, y - s * 0.06, x - s * 0.32, y - s * 0.12)
    c.curve_to(x - s * 0.36, y - s * 0.18, x - s * 0.28, y - s * 0.28, x - s * 0.16, y - s * 0.28)
    c.curve_to(x - s * 0.10, y - s * 0.34, x - s * 0.02, y - s * 0.34, x + s * 0.06, y - s * 0.30)
    c.curve_to(x + s * 0.14, y - s * 0.34, x + s * 0.24, y - s * 0.28, x + s * 0.28, y - s * 0.20)
    c.curve_to(x + s * 0.36, y - s * 0.18, x + s * 0.38, y - s * 0.04, x + s * 0.32, y + s * 0.04)
    c.curve_to(x + s * 0.28, y + s * 0.10, x + s * 0.18, y + s * 0.08, x + s * 0.08, y + s * 0.06)
    c.curve_to(x + s * 0.02, y + s * 0.08, x - s * 0.02, y + s * 0.12, x - s * 0.06, y + s * 0.14)
    c.close_path()

    c.set_source_rgb(*fc(style, pink))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(ol)
    c.stroke()

    # Interlocking curved convolutions
    def _curve(pts):
        c.new_path()
        c.move_to(*pts[0])
        for idx in range(1, len(pts), 2):
            if idx + 1 < len(pts):
                c.curve_to(*pts[idx], *pts[idx], *pts[idx + 1])
            else:
                c.line_to(*pts[idx])
        c.set_source_rgb(*INK)
        c.set_line_width(ol * 0.85)
        c.stroke()

    _curve([(x - s * 0.20, y + s * 0.06), (x - s * 0.08, y + s * 0.02), (x + s * 0.10, y + s * 0.02)])
    _curve([(x - s * 0.24, y - s * 0.02), (x - s * 0.16, y - s * 0.08), (x - s * 0.12, y + s * 0.01)])
    _curve([(x - s * 0.20, y - s * 0.16), (x - s * 0.12, y - s * 0.14), (x - s * 0.04, y - s * 0.08)])
    _curve([(x - s * 0.08, y - s * 0.22), (x - s * 0.02, y - s * 0.14),
            (x + s * 0.04, y - s * 0.14), (x + s * 0.08, y - s * 0.06)])
    _curve([(x + s * 0.06, y - s * 0.22), (x + s * 0.14, y - s * 0.18), (x + s * 0.18, y - s * 0.10)])
    _curve([(x + s * 0.22, y - s * 0.18), (x + s * 0.26, y - s * 0.08), (x + s * 0.18, y - s * 0.02)])
    _curve([(x - s * 0.16, y + s * 0.12), (x - s * 0.08, y + s * 0.12)])


# -----------------------------------------------------------------------------
# 17. thought_bubble (empty cloud bubble)
# -----------------------------------------------------------------------------
def prop_thought_bubble(cv, x, y, s, style):
    ol = _ol(s)
    c = cv.c

    # 3 Trailing circles leading down-left
    trail_circles = [
        (x - s * 0.26, y + s * 0.34, s * 0.024),
        (x - s * 0.20, y + s * 0.27, s * 0.038),
        (x - s * 0.12, y + s * 0.19, s * 0.055),
    ]
    for tcx, tcy, tr in trail_circles:
        cv.ellipse(tcx, tcy, tr, tr, fill=fc(style, rgb("#FFFFFF")), w=ol)

    # Main puffy cartoon cloud: continuous intersecting circular arcs
    cx0 = x + s * 0.03
    cy0 = y - s * 0.06

    lobes = [
        (cx0 - s * 0.24, cy0, s * 0.15),
        (cx0 - s * 0.17, cy0 - s * 0.16, s * 0.14),
        (cx0, cy0 - s * 0.23, s * 0.16),
        (cx0 + s * 0.18, cy0 - s * 0.16, s * 0.15),
        (cx0 + s * 0.25, cy0, s * 0.14),
        (cx0 + s * 0.18, cy0 + s * 0.16, s * 0.15),
        (cx0, cy0 + s * 0.21, s * 0.155),
        (cx0 - s * 0.17, cy0 + s * 0.16, s * 0.14),
    ]

    n = len(lobes)
    c.new_path()
    for i in range(n):
        c_prev = lobes[(i - 1) % n]
        c_curr = lobes[i]
        c_next = lobes[(i + 1) % n]

        d_prev = math.hypot(c_curr[0] - c_prev[0], c_curr[1] - c_prev[1])
        phi_prev = math.atan2(c_prev[1] - c_curr[1], c_prev[0] - c_curr[0])
        cos_prev = (c_curr[2]**2 + d_prev**2 - c_prev[2]**2) / (2 * c_curr[2] * d_prev)
        a_prev = math.acos(max(-1.0, min(1.0, cos_prev)))
        ang_start = phi_prev + a_prev

        d_next = math.hypot(c_next[0] - c_curr[0], c_next[1] - c_curr[1])
        phi_next = math.atan2(c_next[1] - c_curr[1], c_next[0] - c_curr[0])
        cos_next = (c_curr[2]**2 + d_next**2 - c_next[2]**2) / (2 * c_curr[2] * d_next)
        a_next = math.acos(max(-1.0, min(1.0, cos_next)))
        ang_end = phi_next - a_next

        while ang_end < ang_start:
            ang_end += 2 * math.pi
        if ang_end - ang_start > 2 * math.pi:
            ang_end -= 2 * math.pi

        c.arc(c_curr[0], c_curr[1], c_curr[2], ang_start, ang_end)

    c.close_path()
    c.set_source_rgb(*fc(style, rgb("#FFFFFF")))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(ol)
    c.stroke()


# -----------------------------------------------------------------------------
# 18. speech_bubble
# -----------------------------------------------------------------------------
def prop_speech_bubble(cv, x, y, s, style):
    ol = _ol(s)

    # Comic speech balloon with pointer tail pointing down-left
    bw = s * 0.74
    bh = s * 0.52
    br = s * 0.14
    bx = x + s * 0.02 - bw / 2
    by = y - s * 0.07 - bh / 2

    tail_x1 = bx + s * 0.12
    tail_tip_x = x - s * 0.26
    tail_tip_y = y + s * 0.34
    tail_x2 = bx + s * 0.28
    bot_y = by + bh

    c = cv.c
    c.new_path()
    c.arc(bx + br, by + br, br, math.pi, 1.5 * math.pi)
    c.arc(bx + bw - br, by + br, br, 1.5 * math.pi, 2 * math.pi)
    c.arc(bx + bw - br, by + bh - br, br, 0, 0.5 * math.pi)
    c.line_to(tail_x2, bot_y)
    c.line_to(tail_tip_x, tail_tip_y)
    c.line_to(tail_x1, bot_y)
    c.arc(bx + br, by + bh - br, br, 0.5 * math.pi, math.pi)
    c.close_path()

    c.set_source_rgb(*fc(style, rgb("#FFFFFF")))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(ol)
    c.stroke()


# -----------------------------------------------------------------------------
# 19. megaphone
# -----------------------------------------------------------------------------
def prop_megaphone(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)

    c = cv.c
    c.save()
    c.translate(x, y)
    c.rotate(math.radians(-15))

    red = rgb("#EB4D4B")

    flare_x = s * 0.22
    flare_rx = s * 0.075
    flare_ry = s * 0.24

    back_x = -s * 0.24
    back_rx = s * 0.035
    back_ry = s * 0.08

    # Handle under narrow end
    h_top_x = -s * 0.12
    h_bot_x = -s * 0.16
    h_top_y = s * 0.06
    h_bot_y = s * 0.28
    handle_pts = [
        (h_top_x, h_top_y),
        (h_top_x + s * 0.06, h_top_y),
        (h_bot_x + s * 0.06, h_bot_y),
        (h_bot_x, h_bot_y),
    ]
    _poly(cv, handle_pts, fill=fc(style, rgb("#2C3E50")), lw=ol, close=True)

    # Red trigger on handle
    cv.rrect(h_top_x + s * 0.05, h_top_y + s * 0.04, s * 0.03, s * 0.04, s * 0.01,
             fill=fc(style, red), lw=th * 0.7)

    # Main cone body
    cone_pts = [
        (back_x, -back_ry),
        (flare_x, -flare_ry),
        (flare_x, flare_ry),
        (back_x, back_ry),
    ]
    _poly(cv, cone_pts, fill=fc(style, red), lw=ol, close=True)

    # White racing stripe across middle of cone
    stripe_x1 = -s * 0.02
    stripe_x2 = s * 0.06
    t1 = (stripe_x1 - back_x) / (flare_x - back_x)
    t2 = (stripe_x2 - back_x) / (flare_x - back_x)
    h1 = back_ry * (1 - t1) + flare_ry * t1
    h2 = back_ry * (1 - t2) + flare_ry * t2
    stripe_pts = [
        (stripe_x1, -h1),
        (stripe_x2, -h2),
        (stripe_x2, h2),
        (stripe_x1, h1),
    ]
    _poly(cv, stripe_pts, fill=fc(style, rgb("#FFFFFF")), lw=ol * 0.85, close=True)

    # Mouthpiece cap on back
    cv.rrect(back_x - s * 0.04, -back_ry * 0.9, s * 0.04, back_ry * 1.8, s * 0.015,
             fill=fc(style, rgb("#2C3E50")), lw=ol * 0.85)

    # Front mouth rim (ellipse)
    cv.ellipse(flare_x, 0, flare_rx, flare_ry, fill=fc(style, shade(red, 0.8)), w=ol)

    # Sound blast waves radiating from front
    for rad_off in (s * 0.10, s * 0.20):
        c.new_path()
        c.arc(flare_x - s * 0.04, 0, flare_ry + rad_off, -math.pi * 0.28, math.pi * 0.28)
        c.set_source_rgb(*_sc(style, rgb("#F39C12")))
        c.set_line_width(ol * 0.9)
        c.stroke()

    c.restore()


# -----------------------------------------------------------------------------
# 20. magnifier
# -----------------------------------------------------------------------------
def prop_magnifier(cv, x, y, s, style):
    ol = _ol(s)
    th = _th(s)

    c = cv.c
    lens_cx = x - s * 0.07
    lens_cy = y - s * 0.07
    lens_r_out = s * 0.25
    lens_r_in = s * 0.19

    c.save()
    c.translate(lens_cx, lens_cy)
    c.rotate(math.radians(45))

    # Wooden handle extending at 45 degrees
    h_start = lens_r_out - s * 0.02
    h_length = s * 0.38
    h_w = s * 0.08

    h_pts = [
        (h_start + s * 0.04, -h_w * 0.35),
        (h_start + h_length - s * 0.04, -h_w * 0.48),
        (h_start + h_length, -h_w * 0.35),
        (h_start + h_length, h_w * 0.35),
        (h_start + h_length - s * 0.04, h_w * 0.48),
        (h_start + s * 0.04, h_w * 0.35),
    ]
    _poly(cv, h_pts, fill=fc(style, rgb("#D35400")), lw=ol, close=True)

    # Metal collar sleeve
    cv.rrect(h_start, -h_w * 0.42, s * 0.05, h_w * 0.84, s * 0.012,
             fill=fc(style, rgb("#BDC3C7")), lw=ol * 0.85)

    # Butt cap
    c.new_path()
    c.arc(h_start + h_length, 0, h_w * 0.35, -math.pi / 2, math.pi / 2)
    c.close_path()
    c.set_source_rgb(*fc(style, rgb("#BDC3C7")))
    c.fill_preserve()
    c.set_source_rgb(*INK)
    c.set_line_width(ol * 0.85)
    c.stroke()

    c.restore()

    # Outer lens rim (sturdy dark slate frame)
    cv.ellipse(lens_cx, lens_cy, lens_r_out, lens_r_out, fill=fc(style, rgb("#2C3E50")), w=ol)

    # Inner glass (pale ice cyan)
    cv.ellipse(lens_cx, lens_cy, lens_r_in, lens_r_in, fill=fc(style, rgb("#E0F7FA")), w=ol * 0.85)

    # Specular curved glint reflections across glass
    c.new_path()
    c.arc(lens_cx, lens_cy, lens_r_in * 0.72, math.pi * 1.08, math.pi * 1.52)
    c.set_source_rgb(*_sc(style, rgb("#FFFFFF")))
    c.set_line_width(th * 1.3)
    c.stroke()

    c.new_path()
    c.arc(lens_cx, lens_cy, lens_r_in * 0.46, math.pi * 1.15, math.pi * 1.45)
    c.set_source_rgb(*_sc(style, rgb("#FFFFFF")))
    c.set_line_width(th * 0.9)
    c.stroke()


# -----------------------------------------------------------------------------
# PROPS EXPORT
# -----------------------------------------------------------------------------
PROPS = {
    "phone": prop_phone,
    "laptop": prop_laptop,
    "notebook": prop_notebook,
    "calendar": prop_calendar,
    "checklist": prop_checklist,
    "envelope": prop_envelope,
    "document": prop_document,
    "book": prop_book,
    "pencil": prop_pencil,
    "key": prop_key,
    "lock": prop_lock,
    "shield": prop_shield,
    "trophy": prop_trophy,
    "medal": prop_medal,
    "lightbulb": prop_lightbulb,
    "brain": prop_brain,
    "thought_bubble": prop_thought_bubble,
    "speech_bubble": prop_speech_bubble,
    "megaphone": prop_megaphone,
    "magnifier": prop_magnifier,
}


if __name__ == "__main__":
    prop_names = list(PROPS.keys())
    cols = 5
    rows = 4
    cell_size = 380
    sheet_w = cols * cell_size
    sheet_h = rows * cell_size

    for style, bg_col, bg_name in [
        ("professor", BG_YELLOW, "yellow"),
        ("stickman", PAPER, "cream"),
        ("professor", PAPER, "cream"),
        ("stickman", BG_YELLOW, "yellow"),
    ]:
        cv = Canvas(bg=bg_col, w=sheet_w, h=sheet_h)
        for idx, name in enumerate(prop_names):
            r = idx // cols
            c = idx % cols
            cx = c * cell_size + cell_size / 2
            cy = r * cell_size + cell_size / 2 - 15
            s = 280

            # Subtle cell border
            cv.c.set_source_rgba(0, 0, 0, 0.08)
            cv.c.set_line_width(2)
            cv.c.rectangle(c * cell_size, r * cell_size, cell_size, cell_size)
            cv.c.stroke()

            # Render prop
            fn = PROPS[name]
            fn(cv, cx, cy, s, style)

            # Cell label
            cv.c.select_font_face("Sans", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
            cv.c.set_font_size(18)
            cv.c.set_source_rgb(*INK)
            label = f"{idx + 1}. {name}"
            extents = cv.c.text_extents(label)
            cv.c.move_to(cx - extents.width / 2, r * cell_size + cell_size - 20)
            cv.c.show_text(label)

        out1 = f"/tmp/props_props_tech_{style}.png" if bg_name == ("yellow" if style == "professor" else "cream") else None
        out2 = f"/tmp/props_tech_{style}.png" if bg_name == ("yellow" if style == "professor" else "cream") else None
        out_full = f"/tmp/props_props_tech_{style}_{bg_name}.png"

        cv.save(out_full)
        if out1:
            cv.save(out1)
        if out2:
            cv.save(out2)
        print(f"Rendered: {out_full} ({style} on {bg_name})")
