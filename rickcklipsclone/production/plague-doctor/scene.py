"""Hanoi rat-tail short: procedural 3D world + 2D billboard characters, one shot per run.

blender -b --factory-startup -P scene.py -- --shot N [--scale 100] [--samples 16]
        [--still T]   render one frame at T seconds into the shot (style check)
"""
import json
import math
import random
import sys
from pathlib import Path

import bmesh
import bpy
from mathutils import Matrix, Vector

ROOT = Path(__file__).resolve().parent
FPS = 30
HANDLE = 8                      # extra frames rendered past a shot end for dissolves
FONT_SIGN = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
FONT_BOLD = str(Path.home() / ".local/share/fonts/Montserrat-Black.ttf")

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ARGS = {argv[i].lstrip("-"): argv[i + 1] for i in range(0, len(argv) - 1, 2)}
SHOT = int(ARGS.get("shot", 0))
SCALE = int(ARGS.get("scale", 100))
SAMPLES = int(ARGS.get("samples", 16))
STILL = float(ARGS["still"]) if "still" in ARGS else None

TIMING = json.load(open(ROOT / "timing.json"))
rnd = random.Random(7)


def hexc(h, a=1.0):
    h = h.lstrip("#")
    srgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, a)


# ------------------------------------------------------------------ materials
_MATS = {}


def mat(name, color, rough=0.85, emit=0.0, noise=0.12, metal=0.0, spec=0.2):
    if name in _MATS:
        return _MATS[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    col = hexc(color) if isinstance(color, str) else color
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    bsdf.inputs["Specular IOR Level"].default_value = spec
    if noise > 0:
        tc = nt.nodes.new("ShaderNodeTexCoord")
        nz = nt.nodes.new("ShaderNodeTexNoise")
        nz.inputs["Scale"].default_value = 3.5
        nz.inputs["Detail"].default_value = 4.0
        nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
        mix = nt.nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        dark = tuple(c * (1 - noise * 2.2) for c in col[:3]) + (1,)
        mix.inputs[6].default_value = col
        mix.inputs[7].default_value = dark
        rng = nt.nodes.new("ShaderNodeMapRange")
        rng.inputs["From Min"].default_value = 0.35
        rng.inputs["From Max"].default_value = 0.75
        nt.links.new(nz.outputs["Fac"], rng.inputs["Value"])
        nt.links.new(rng.outputs["Result"], mix.inputs[0])
        nt.links.new(mix.outputs[2], bsdf.inputs["Base Color"])
    else:
        bsdf.inputs["Base Color"].default_value = col
    if emit:
        bsdf.inputs["Emission Color"].default_value = col
        bsdf.inputs["Emission Strength"].default_value = emit
    _MATS[name] = m
    return m


def outline_mat():
    if "OUTLINE" in _MATS:
        return _MATS["OUTLINE"]
    m = bpy.data.materials.new("OUTLINE")
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = hexc("#1c1418")
    nt.links.new(em.outputs[0], nt.nodes["Material Output"].inputs["Surface"])
    m.use_backface_culling = True
    m.shadow_method = "NONE"
    _MATS["OUTLINE"] = m
    return m


# ------------------------------------------------------------------ mesh builder
class Builder:
    """Accumulates primitives into one mesh (per set) to keep object count low."""

    def __init__(self, name, outline=0.03):
        self.name, self.outline = name, outline
        self.bm = bmesh.new()
        self.mats = []

    def _mi(self, m):
        if m not in self.mats:
            self.mats.append(m)
        return self.mats.index(m)

    def _tag(self, verts, m, smooth=False):
        mi = self._mi(m)
        for f in {f for v in verts for f in v.link_faces}:
            f.material_index = mi
            f.smooth = smooth

    def box(self, c, s, m, rz=0.0):
        M = Matrix.Translation(c) @ Matrix.Rotation(rz, 4, "Z") @ Matrix.Diagonal((*s, 1))
        r = bmesh.ops.create_cube(self.bm, size=1.0, matrix=M)
        self._tag(r["verts"], m)

    def cyl(self, c, r, h, m, seg=16, r2=None, rot=None, smooth=True):
        M = Matrix.Translation(c) @ (rot or Matrix.Identity(4))
        res = bmesh.ops.create_cone(self.bm, cap_ends=True, segments=seg, radius1=r,
                                    radius2=r if r2 is None else r2, depth=h, matrix=M)
        self._tag(res["verts"], m, smooth)

    def sphere(self, c, r, m, sc=(1, 1, 1), sub=2):
        M = Matrix.Translation(c) @ Matrix.Diagonal((*sc, 1))
        res = bmesh.ops.create_icosphere(self.bm, subdivisions=sub, radius=r, matrix=M)
        self._tag(res["verts"], m, True)

    def finish(self):
        me = bpy.data.meshes.new(self.name)
        self.bm.to_mesh(me)
        self.bm.free()
        for m in self.mats:
            me.materials.append(m)
        ob = bpy.data.objects.new(self.name, me)
        bpy.context.scene.collection.objects.link(ob)
        if self.outline:
            me.materials.append(outline_mat())
            sol = ob.modifiers.new("outline", "SOLIDIFY")
            sol.thickness = self.outline
            sol.offset = 1.0
            sol.use_flip_normals = True
            sol.use_rim = False
            sol.material_offset = len(self.mats)
        return ob


def text(body, loc, size, m, rx=90, rz=0, font=FONT_SIGN, extrude=0.01, name=None):
    cu = bpy.data.curves.new(name or f"txt_{body[:8]}", "FONT")
    cu.body = body
    cu.font = bpy.data.fonts.load(font, check_existing=True)
    cu.align_x, cu.align_y = "CENTER", "CENTER"
    cu.size, cu.extrude = size, extrude
    ob = bpy.data.objects.new(cu.name, cu)
    ob.data.materials.append(m)
    ob.location = loc
    ob.rotation_euler = (math.radians(rx), 0, math.radians(rz))
    bpy.context.scene.collection.objects.link(ob)
    return ob


# ------------------------------------------------------------------ sprites
_SPR = {}


def sprite_mat(png):
    if png in _SPR:
        return _SPR[png]
    img = bpy.data.images.load(str(ROOT / "chars" / f"{png}.png"), check_existing=True)
    m = bpy.data.materials.new(f"spr_{png}")
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = img
    tex.interpolation = "Cubic"
    nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    nt.links.new(tex.outputs["Color"], bsdf.inputs["Emission Color"])
    nt.links.new(tex.outputs["Alpha"], bsdf.inputs["Alpha"])
    bsdf.inputs["Emission Strength"].default_value = 0.38
    bsdf.inputs["Roughness"].default_value = 1.0
    bsdf.inputs["Specular IOR Level"].default_value = 0.0
    m.blend_method = "CLIP"
    m.shadow_method = "CLIP"
    m.alpha_threshold = 0.5
    _SPR[png] = (m, img.size[0] / img.size[1])
    return _SPR[png]


def sprite(png, loc, height, cam, flip=False, name=None):
    m, aspect = sprite_mat(png)
    w = height * aspect
    me = bpy.data.meshes.new(name or png)
    me.from_pydata([(-w / 2, 0, 0), (w / 2, 0, 0), (w / 2, 0, height), (-w / 2, 0, height)], [], [(0, 1, 2, 3)])
    uv = me.uv_layers.new()
    for i, co in enumerate([(0, 0), (1, 0), (1, 1), (0, 1)]):
        uv.data[i].uv = co
    me.materials.append(m)
    ob = bpy.data.objects.new(me.name, me)
    ob.location = loc
    if flip:
        ob.scale.x = -1
    bpy.context.scene.collection.objects.link(ob)
    c = ob.constraints.new("LOCKED_TRACK")
    c.target = cam
    c.track_axis = "TRACK_NEGATIVE_Y"
    c.lock_axis = "LOCK_Z"
    return ob


def linear(ob):
    if ob.animation_data and ob.animation_data.action:
        for fc in ob.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = "LINEAR"


def bob(ob, strength=0.05, scale=2.0, phase=0.0):
    """Hop/jitter on Z via a noise F-modifier (cheap walk cycle)."""
    ob.keyframe_insert("location", index=2, frame=1)
    fc = next(f for f in ob.animation_data.action.fcurves if f.data_path == "location" and f.array_index == 2)
    mod = fc.modifiers.new("NOISE")
    mod.strength, mod.scale, mod.phase = strength, scale, phase


# ------------------------------------------------------------------ world: city (set A)
PALETTE = ["#e3b552", "#efe1c0", "#e8a7a0", "#9fcfb4", "#a9c4dc", "#d9825b", "#f0cf7a"]
LANTERN_LIGHTS = []


def build_city():
    b = Builder("city", outline=0.035)
    ground = mat("ground_city", "#c49a6c", noise=0.18)
    street = mat("street", "#a37f5f", noise=0.2)
    curb = mat("curb", "#d8cdb8")
    window = mat("window", "#2e2a40", rough=0.3, spec=0.6)
    shutters = [mat("shut_g", "#3f8a6e"), mat("shut_b", "#4a6f9a"), mat("shut_t", "#2f6f6a")]
    trim = mat("trim", "#f6eedc")
    roof = mat("roof", "#b8503c", noise=0.2)
    awn = [mat("awn_r", "#c8423a"), mat("awn_b", "#3b5ca8"), mat("awn_y", "#e8b33d")]
    dark = mat("doorway", "#3a2a2a")
    rail = mat("rail", "#2b2b33", metal=0.4)
    walls = [mat(f"wall{i}", c, noise=0.1) for i, c in enumerate(PALETTE)]

    b.box((0, 0, -0.05), (130, 130, 0.1), ground)
    b.box((0, 0, 0.005), (7, 96, 0.02), street)
    for s in (-1, 1):
        b.box((s * 4.1, 0, 0.08), (1.2, 96, 0.16), curb)

    # main street facades
    for s in (-1, 1):
        y = -46.0
        while y < 40:
            wdt = rnd.uniform(5, 7)
            h = rnd.choice([6.6, 6.6, 9.8, 9.8, 13.0])
            dep = 8
            x = s * (4.7 + dep / 2)
            wm = rnd.choice(walls)
            b.box((x, y + wdt / 2, h / 2), (dep, wdt - 0.08, h), wm)
            floors = int(h / 3.2)
            fx = s * 4.7
            for fl in range(floors):
                z0 = fl * 3.2
                b.box((fx - s * 0.05, y + wdt / 2, z0 + 3.2), (0.3, wdt, 0.18), trim)       # cornice
                if fl == 0:
                    b.box((fx - s * 0.02, y + wdt / 2, 1.3), (0.1, wdt * 0.55, 2.6), dark)
                    b.box((fx - s * 0.7, y + wdt / 2, 2.85), (1.4, wdt * 0.8, 0.12), rnd.choice(awn), rz=0)
                    continue
                nwin = max(2, int(wdt / 2.0))
                for k in range(nwin):
                    wy = y + wdt * (k + 0.5) / nwin
                    b.box((fx - s * 0.01, wy, z0 + 1.6), (0.1, 0.8, 1.6), window)
                    sh = rnd.choice(shutters)
                    for t in (-1, 1):
                        b.box((fx - s * 0.06, wy + t * 0.62, z0 + 1.6), (0.08, 0.42, 1.7), sh)
                    b.box((fx - s * 0.08, wy, z0 + 2.55), (0.16, 1.1, 0.14), trim)
                if fl == 1 and rnd.random() < 0.6:
                    b.box((fx - s * 0.55, y + wdt / 2, z0 + 0.25), (1.1, wdt * 0.7, 0.12), trim)
                    b.box((fx - s * 1.05, y + wdt / 2, z0 + 1.15), (0.06, wdt * 0.7, 0.07), rail)
                    for k in range(int(wdt * 2)):
                        b.box((fx - s * 1.05, y + wdt * 0.15 + k * 0.5 * 0.7, z0 + 0.7), (0.04, 0.04, 0.9), rail)
            if rnd.random() < 0.55:
                rot = Matrix.Rotation(math.radians(45), 4, "Z")
                b.cyl((x, y + wdt / 2, h + 1.0), max(dep, wdt) * 0.72, 2.0, roof, seg=4, r2=0.0, rot=rot, smooth=False)
            else:
                b.box((x, y + wdt / 2, h + 0.3), (dep + 0.2, wdt, 0.6), trim)
            y += wdt

    # back blocks of the city (seen from the air)
    for gx in range(-6, 7):
        for gy in range(-6, 4):
            cx, cy = gx * 11.0, gy * 11.0
            if abs(cx) < 16:
                continue
            for k in range(rnd.randint(2, 4)):
                w, d = rnd.uniform(3.5, 6), rnd.uniform(3.5, 6)
                h = rnd.choice([4, 6, 7, 9])
                px, py = cx + rnd.uniform(-2.5, 2.5), cy + rnd.uniform(-2.5, 2.5)
                b.box((px, py, h / 2), (w, d, h), rnd.choice(walls))
                rot = Matrix.Rotation(math.radians(45), 4, "Z")
                b.cyl((px, py, h + 0.9), max(w, d) * 0.72, 1.8, roof, seg=4, r2=0.0, rot=rot, smooth=False)
    # trees
    leaf = mat("leaf", "#4f9a55", noise=0.25)
    trunk = mat("trunk", "#6b4a35")
    for _ in range(70):
        px, py = rnd.uniform(-64, 64), rnd.uniform(-64, 40)
        if abs(px) < 12:
            continue
        b.cyl((px, py, 1.2), 0.18, 2.4, trunk, seg=6)
        b.sphere((px, py, 3.2), rnd.uniform(1.2, 2.0), leaf, sc=(1, 1, 0.85), sub=1)

    # counting house (end of street, faces -Y)
    stone = mat("stone", "#efe4c8", noise=0.08)
    door = mat("door", "#5a3a2a")
    b.box((0, 52, 6), (18, 10, 12), stone)
    b.box((0, 46.9, 11.6), (18.6, 0.6, 0.8), trim)
    for i, (dy, dz) in enumerate([(44.2, 0.15), (44.8, 0.45), (45.4, 0.75), (46.0, 1.0)]):
        b.box((0, dy + 0.3, dz / 2), (9 - i * 0.6, 4.2 - dy + 44.2, dz), curb)
    for cx in (-3.6, -1.2, 1.2, 3.6):
        b.cyl((cx, 46.5, 5.0), 0.38, 8.0, trim, seg=14)
    b.box((0, 46.95, 2.6), (2.4, 0.2, 3.2), door)
    b.box((0, 46.6, 9.4), (10.5, 0.4, 1.0), trim)
    for wx in (-7, -5.6, 5.6, 7):
        b.box((wx, 46.95, 4.4), (0.9, 0.2, 2.2), window)
    # lantern strings across the street
    lant = mat("lantern", "#ff5a2e", emit=2.6, noise=0)
    gold = mat("gold", "#d9a441", metal=0.6, rough=0.4)
    for i, y in enumerate(range(-30, 31, 6)):
        b.cyl((0, y, 5.6), 0.015, 9.4, rail, seg=4, rot=Matrix.Rotation(math.radians(90), 4, "Y"))
        for lx in (-2.4, 0, 2.4):
            b.sphere((lx, y, 5.15), 0.28, lant, sc=(1, 1, 1.15))
            b.cyl((lx, y, 5.47), 0.14, 0.08, gold, seg=10)
            b.cyl((lx, y, 4.83), 0.14, 0.08, gold, seg=10)
        if i % 2 == 0:
            ld = bpy.data.lights.new(f"lant{i}", "POINT")
            ld.energy, ld.color, ld.shadow_soft_size = 140, (1.0, 0.55, 0.3), 0.3
            lo = bpy.data.objects.new(f"lant{i}", ld)
            lo.location = (0, y, 4.6)
            bpy.context.scene.collection.objects.link(lo)
            LANTERN_LIGHTS.append(lo)
    # sewer grate
    b.box((1.8, 2.0, 0.02), (0.9, 0.55, 0.03), mat("grate_hole", "#141217"))
    for k in range(6):
        b.box((1.42 + k * 0.15, 2.0, 0.04), (0.04, 0.55, 0.03), rail)
    city = b.finish()

    signs = mat("sign_txt", "#2b2230", noise=0)
    text("BUREAU DES PRIMES", (0, 46.35, 9.4), 0.75, signs)
    banner = mat("banner", "#c8423a", noise=0)
    bb = Builder("banner", outline=0.02)
    bb.box((0, 46.3, 7.6), (6.5, 0.05, 1.1), banner)
    bb.finish()
    text("MIASME = MORT", (0, 46.22, 7.6), 0.55, mat("cream_txt", "#fff4dc", noise=0, emit=0.3))
    for y, s, word in [(-12, 1, "PHO"), (8, -1, "TRA"), (20, 1, "HANOI 1902"), (-24, -1, "GAO")]:
        tb = Builder(f"sign{y}", outline=0.015)
        tb.box((s * 4.62, y, 3.6), (0.08, 3.0, 0.7), mat("signboard", "#2f4a3a", noise=0))
        tb.finish()
        text(word, (s * 4.56, y, 3.6), 0.45, mat("gold_txt", "#f2c35a", noise=0, emit=0.4), rz=(-90 if s > 0 else 90))
    return city


# ------------------------------------------------------------------ world: interior (set B)
IX = -200.0


def build_interior():
    b = Builder("office", outline=0.012)
    floor = mat("floor", "#8a5a3c", noise=0.25)
    wall_up = mat("wall_up", "#ead9b8", noise=0.08)
    wall_lo = mat("wall_lo", "#2f6f63", noise=0.1)
    wood = mat("desk", "#6b3f2a", noise=0.2)
    top = mat("desktop", "#8c5a3a", noise=0.15)
    paper = mat("paper", "#f4ecd6", noise=0.02)
    copper = mat("copper", "#c9773a", metal=0.7, rough=0.35, noise=0)
    b.box((IX, 0, -0.05), (10, 9, 0.1), floor)
    b.box((IX, 3.6, 1.0), (10, 0.2, 2.0), wall_lo)
    b.box((IX, 3.6, 3.2), (10, 0.2, 2.4), wall_up)
    for s in (-1, 1):
        b.box((IX + s * 5, 0, 2.2), (0.2, 9, 4.4), wall_up)
        b.box((IX + s * 4.88, 0, 1.0), (0.05, 9, 2.0), wall_lo)
    b.box((IX, 3.46, 2.02), (10, 0.1, 0.1), mat("wtrim", "#f6eedc"))
    # window with daylight glow
    b.box((IX + 2.6, 3.48, 2.5), (1.6, 0.06, 1.8), mat("winglow", "#bfe3ff", emit=2.2, noise=0))
    b.box((IX + 2.6, 3.44, 2.5), (0.08, 0.06, 1.8), mat("wframe", "#f6eedc"))
    b.box((IX + 2.6, 3.44, 2.5), (1.6, 0.06, 0.08), mat("wframe", "#f6eedc"))
    # desk
    b.box((IX, 1.0, 0.45), (3.4, 1.2, 0.9), wood)
    b.box((IX, 1.0, 0.92), (3.6, 1.35, 0.06), top)
    b.box((IX - 1.3, 0.85, 0.99), (0.5, 0.35, 0.08), paper)        # ledger
    for k, (cx, n) in enumerate([(1.1, 6), (1.3, 9), (1.45, 4)]):
        for j in range(n):
            b.cyl((IX + cx, 0.7 + k * 0.08, 0.96 + j * 0.022), 0.06, 0.02, copper, seg=14)
    # chalkboard
    b.box((IX - 2.6, 3.47, 2.6), (1.8, 0.05, 1.1), mat("chalk", "#26342e", noise=0.15))
    b.box((IX - 2.6, 3.45, 2.6), (1.95, 0.04, 1.25), wood)
    # poster
    b.box((IX - 0.2, 3.47, 2.9), (1.6, 0.04, 0.9), paper)
    # lamp
    b.cyl((IX + 1.6, 1.25, 1.2), 0.04, 0.5, mat("brass", "#c99a3b", metal=0.7, rough=0.3, noise=0), seg=8)
    b.sphere((IX + 1.6, 1.25, 1.5), 0.15, mat("lampglow", "#ffd27a", emit=6, noise=0))
    b.finish()
    ink = mat("ink", "#c8423a", noise=0)
    text("MIASME = MORT", (IX - 0.2, 3.43, 2.95), 0.2, ink)
    text("PESTE 1348", (IX - 0.2, 3.43, 2.68), 0.11, mat("ink2", "#2b2230", noise=0))
    chalk = mat("chalk_txt", "#f2f2ea", noise=0, emit=0.3)
    for val in ("MORTS: 10", "MORTS: 100", "MORTS: 1 000"):
        text(val, (IX - 2.6, 3.42, 2.6), 0.2, chalk, name=f"board_{val}")
    lamp = bpy.data.lights.new("desklamp", "POINT")
    lamp.energy, lamp.color, lamp.shadow_soft_size = 260, (1.0, 0.72, 0.42), 0.2
    lo = bpy.data.objects.new("desklamp", lamp)
    lo.location = (IX + 1.6, 1.0, 1.7)
    bpy.context.scene.collection.objects.link(lo)
    win = bpy.data.lights.new("winlight", "AREA")
    win.energy, win.color, win.size = 400, (0.75, 0.85, 1.0), 2.0
    wo = bpy.data.objects.new("winlight", win)
    wo.location = (IX + 2.6, 3.2, 2.5)
    wo.rotation_euler = (math.radians(-90), 0, 0)
    bpy.context.scene.collection.objects.link(wo)
    fill = bpy.data.lights.new("fill", "AREA")
    fill.energy, fill.color, fill.size = 300, (1.0, 0.85, 0.7), 4.0
    fo = bpy.data.objects.new("fill", fill)
    fo.location = (IX, -3.5, 3.0)
    fo.rotation_euler = (math.radians(60), 0, 0)
    bpy.context.scene.collection.objects.link(fo)


def tail_bm(bm, M, m_idx):
    """One rat tail: tapered wavy tube."""
    pts = [(0.0, 0, 0), (0.08, 0.03, 0), (0.16, -0.02, 0), (0.24, 0.02, 0), (0.3, 0.0, 0)]
    for i in range(len(pts) - 1):
        a, c = Vector(pts[i]), Vector(pts[i + 1])
        d = c - a
        r = 0.026 * (1 - i / len(pts)) + 0.006
        rot = d.to_track_quat("Z", "Y").to_matrix().to_4x4()
        T = M @ Matrix.Translation((a + c) / 2) @ rot
        res = bmesh.ops.create_cone(bm, cap_ends=True, segments=6, radius1=r, radius2=r * 0.8, depth=d.length * 1.15,
                                    matrix=T)
        for f in {f for v in res["verts"] for f in v.link_faces}:
            f.material_index = m_idx
            f.smooth = True


def tail_pile(name, center, rx, ry, height, n, batches=1, seed=1):
    """Mound of tails split into `batches` objects (revealed progressively)."""
    r = random.Random(seed)
    pink = mat("tail", "#ee96a0", rough=0.5, noise=0.1, spec=0.4)
    pts = []
    for _ in range(n):
        while True:
            u, v = r.uniform(-1, 1), r.uniform(-1, 1)
            if u * u + v * v <= 1:
                break
        d = math.sqrt(u * u + v * v)
        z = height * (1 - d * d) * r.uniform(0.55, 1.0)
        pts.append((center[0] + u * rx, center[1] + v * ry, center[2] + z))
    pts.sort(key=lambda p: p[2])
    obs = []
    per = math.ceil(n / batches)
    for bi in range(batches):
        bm = bmesh.new()
        for p in pts[bi * per:(bi + 1) * per]:
            M = Matrix.Translation(p) @ Matrix.Rotation(r.uniform(0, 6.28), 4, "Z") @ Matrix.Rotation(
                r.uniform(-0.6, 0.6), 4, "X")
            tail_bm(bm, M, 0)
        me = bpy.data.meshes.new(f"{name}{bi}")
        bm.to_mesh(me)
        bm.free()
        me.materials.append(pink)
        ob = bpy.data.objects.new(me.name, me)
        bpy.context.scene.collection.objects.link(ob)
        obs.append(ob)
    return obs


# ------------------------------------------------------------------ world: sewer cutaway (set C)
SX = 200.0


def build_sewer():
    b = Builder("sewer", outline=0.03)
    layers = [(0, -1.0, "#7a4e35"), (-1.0, -3.0, "#b07a45"), (-3.0, -7.4, "#8c5a4a"), (-7.4, -12, "#4a3340")]
    for z0, z1, c in layers:
        b.box((SX, 1.0, (z0 + z1) / 2), (22, 2, z0 - z1), mat(f"soil{c}", c, noise=0.08, emit=0.45))
    peb = mat("pebble", "#e3c49a", noise=0.05, emit=0.3)
    pr = random.Random(3)
    for _ in range(70):
        b.sphere((SX + pr.uniform(-11, 11), -0.02, pr.uniform(-11.5, -0.3)), pr.uniform(0.04, 0.1), peb,
                 sc=(1.4, 0.4, 1), sub=2)
    # tunnel band (runs left-right), brick edges, glowing water
    b.box((SX, -0.03, -5.2), (22, 0.1, 3.4), mat("tunnel", "#3c6f66", noise=0.12, emit=0.25))
    brick = mat("brick", "#9a4a3a", noise=0.2)
    for z in (-3.45, -6.95):
        b.box((SX, -0.06, z), (22, 0.14, 0.32), brick)
    b.box((SX, -0.08, -6.55), (22, 0.08, 0.5), mat("sewerwater", "#52d38a", emit=0.5, noise=0.1))
    b.box((SX, -0.09, -6.25), (22, 0.08, 0.12), mat("ledge", "#5e6a63"))
    # shaft from the street grate down to the tunnel
    b.box((SX + 6, -0.05, -1.75), (1.0, 0.1, 3.5), mat("shaft", "#152826"))
    for k in range(8):
        b.box((SX + 6, -0.1, -0.3 - k * 0.4), (0.7, 0.05, 0.05), mat("rung", "#8a8f95", metal=0.6))
    # street surface + mini houses above ground
    b.box((SX, 1.0, 0.05), (22, 2, 0.1), mat("street", "#a37f5f"))
    for k, x in enumerate(range(-10, 11, 3)):
        h = 2.5 + (k % 3) * 1.1
        b.box((SX + x, 1.6, h / 2), (2.6, 1.0, h), mat(f"wall{k % 7}", PALETTE[k % 7]))
        rot = Matrix.Rotation(math.radians(45), 4, "Z")
        b.cyl((SX + x, 1.6, h + 0.5), 1.9, 1.0, mat("roof", "#b8503c"), seg=4, r2=0, rot=rot, smooth=False)
    b.finish()
    gl = bpy.data.lights.new("sewerglow", "AREA")
    gl.energy, gl.color, gl.size = 220, (0.4, 1.0, 0.6), 10
    go = bpy.data.objects.new("sewerglow", gl)
    go.location = (SX, -1.5, -6.2)
    go.rotation_euler = (math.radians(70), 0, 0)
    bpy.context.scene.collection.objects.link(go)


# ------------------------------------------------------------------ world: countryside + farms (set D)
FY = 140.0
CAGE_SPOTS = []


def build_farm():
    b = Builder("farm", outline=0.03)
    b.box((0, 120, -0.06), (320, 400, 0.1), mat("grass", "#6da75d", noise=0.2))
    b.box((0, 100, 0.0), (3.2, 90, 0.04), mat("road", "#c9a27a", noise=0.2))
    paddy = [mat("pad1", "#7cbf62", noise=0.15), mat("pad2", "#9ccf6e", noise=0.15),
             mat("padw", "#6fa8b8", rough=0.15, spec=0.6, noise=0.1)]
    dike = mat("dike", "#a58a5c")
    for ix in range(-8, 9):
        for iy in range(0, 7):
            x, y = ix * 6.0, 64 + iy * 8.0
            if abs(x) < 4:
                continue
            b.box((x, y, 0.0), (5.6, 7.6, 0.05), rnd.choice(paddy))
            b.box((x, y, -0.005), (6.0, 8.0, 0.03), dike)
    palm_l = mat("palm", "#3f8a4f", noise=0.2)
    trunk = mat("trunk", "#6b4a35")
    for _ in range(60):
        x, y = rnd.uniform(-70, 70), rnd.uniform(60, 190)
        if abs(x) < 5 or (abs(x) < 26 and 128 < y < 166):
            continue
        h = rnd.uniform(4, 7)
        b.cyl((x, y, h / 2), 0.16, h, trunk, seg=6)
        for k in range(5):
            a = k * 2 * math.pi / 5
            rot = Matrix.Rotation(a, 4, "Z") @ Matrix.Rotation(math.radians(70), 4, "Y")
            b.cyl((x + math.cos(a) * 0.9, y + math.sin(a) * 0.9, h - 0.1), 0.35, 2.2, palm_l, seg=4, r2=0.05,
                  rot=rot, smooth=False)
    # farm yard
    b.box((0, FY + 8, 0.0), (44, 40, 0.05), mat("yard", "#a9a06e", noise=0.25))
    thatch = mat("thatch", "#c9a35a", noise=0.25)
    hutw = mat("hutw", "#8a6243", noise=0.2)
    for hx, hy in [(-16, FY + 24), (0, FY + 26), (16, FY + 24), (-20, FY + 6), (20, FY + 6)]:
        b.box((hx, hy, 1.4), (5, 4, 2.8), hutw)
        rot = Matrix.Rotation(math.radians(45), 4, "Z")
        b.cyl((hx, hy, 3.6), 4.2, 1.8, thatch, seg=4, r2=0, rot=rot, smooth=False)
    wood = mat("cagewood", "#7a5236", noise=0.2)
    wire = mat("wire", "#c9c9c2", metal=0.5, rough=0.4, noise=0)
    for row in range(6):
        for col in range(8):
            cx = -15.75 + col * 4.5
            cy = FY - 2 + row * 3.6
            w, d, h = 2.4, 1.6, 1.2
            b.box((cx, cy, 0.12), (w, d, 0.24), wood)
            for sx in (-1, 1):
                for sy in (-1, 1):
                    b.box((cx + sx * w / 2, cy + sy * d / 2, h / 2 + 0.12), (0.08, 0.08, h), wood)
            b.box((cx, cy, h + 0.16), (w + 0.1, d + 0.1, 0.08), wood)
            for k in range(1, 8):
                bx = cx - w / 2 + k * w / 8
                b.box((bx, cy - d / 2, h / 2 + 0.12), (0.025, 0.025, h), wire)
                b.box((bx, cy + d / 2, h / 2 + 0.12), (0.025, 0.025, h), wire)
            CAGE_SPOTS.append((cx, cy))
    # distant hills
    hill = mat("hill", "#7aa0a8", noise=0.1)
    for k in range(18):
        a = k / 18 * 2 * math.pi
        b.sphere((math.cos(a) * 240, 60 + math.sin(a) * 240, -6), rnd.uniform(30, 55), hill, sc=(1.4, 1, 0.5), sub=2)
    b.finish()


def clouds():
    b = Builder("clouds", outline=0)
    cm = mat("cloud", "#ffffff", emit=0.55, noise=0.05)
    for _ in range(26):
        x, y, z = rnd.uniform(-120, 120), rnd.uniform(-60, 220), rnd.uniform(28, 45)
        for k in range(rnd.randint(3, 6)):
            b.sphere((x + rnd.uniform(-4, 4), y + rnd.uniform(-2, 2), z + rnd.uniform(-0.5, 1.2)),
                     rnd.uniform(2.0, 4.0), cm, sc=(1.3, 1, 0.7), sub=2)
    ob = b.finish()
    ob.visible_shadow = False


# ------------------------------------------------------------------ lighting presets
def setup_world(preset):
    sc = bpy.context.scene
    w = bpy.data.worlds.new(preset)
    sc.world = w
    w.use_nodes = True
    nt = w.node_tree
    bg = nt.nodes["Background"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    nt.links.new(tc.outputs["Generated"], sep.inputs[0])
    nt.links.new(sep.outputs["Z"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])
    P = {
        #          horizon      zenith     sun color   energy elev azim  amb  lanterns
        "day": ("#cfe6f5", "#4f8fd6", "#fff1dc", 4.2, 48, 35, 0.9, False),
        "dusk": ("#f7b98a", "#4a3c8c", "#ffb070", 3.0, 12, 70, 0.7, True),
        "night": ("#3a3f7a", "#0d1030", "#8fa2ff", 0.55, 40, -30, 0.35, True),
        "golden": ("#ffd59a", "#5f9fe0", "#ffc27a", 4.8, 40, 15, 0.8, False),
        "sunset": ("#ffc28f", "#6b5fb8", "#ffc08a", 4.2, 18, 20, 0.85, False),
        "interior": ("#3b2c2a", "#3b2c2a", "#ffe2b8", 0.0, 50, 0, 0.35, False),
        "sewer": ("#9fd2e8", "#5a8fd0", "#fff1dc", 2.0, 60, 10, 0.55, False),
    }[preset]
    hor, zen, scol, energy, elev, azim, amb, lanterns = P
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = hexc(hor)
    ramp.color_ramp.elements[1].position = 0.38
    ramp.color_ramp.elements[1].color = hexc(zen)
    bg.inputs["Strength"].default_value = amb
    sd = bpy.data.lights.new("sun", "SUN")
    sd.color = hexc(scol)[:3]
    sd.energy = energy
    sd.angle = math.radians(4)
    sd.shadow_cascade_max_distance = 120
    sd.use_contact_shadow = True
    so = bpy.data.objects.new("sun", sd)
    so.rotation_euler = (math.radians(90 - elev), 0, math.radians(azim))
    sc.collection.objects.link(so)
    for lo in LANTERN_LIGHTS:
        lo.hide_render = not lanterns
    lant = _MATS.get("lantern")
    if lant:
        lant.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 3.5 if lanterns else 0.6
    if preset == "night":
        moon = Builder("moon", outline=0)
        moon.sphere((-40, 120, 60), 5, mat("moon", "#fff6d8", emit=4, noise=0))
        moon.finish()


# ------------------------------------------------------------------ render setup
def setup_render(n_frames):
    sc = bpy.context.scene
    r = sc.render
    r.engine = "BLENDER_EEVEE"
    r.resolution_x, r.resolution_y, r.resolution_percentage = 1080, 1920, SCALE
    r.fps = FPS
    r.image_settings.file_format = "PNG"
    r.image_settings.compression = 15
    r.image_settings.color_mode = "RGB"
    sc.frame_start, sc.frame_end = 1, n_frames
    e = sc.eevee
    e.taa_render_samples = SAMPLES
    e.use_bloom, e.bloom_intensity, e.bloom_threshold, e.bloom_radius = True, 0.06, 0.9, 6.0
    e.use_gtao, e.gtao_distance = True, 0.6
    e.use_soft_shadows = True
    e.shadow_cube_size, e.shadow_cascade_size = "1024", "2048"
    e.use_ssr = True
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"
    sc.view_settings.exposure = 0.0


def make_camera(keys, lens=30, fstop=4.0):
    """keys: [(local_frame, cam_loc, target_loc), ...] — linear drone-style motion."""
    sc = bpy.context.scene
    tgt = bpy.data.objects.new("cam_target", None)
    sc.collection.objects.link(tgt)
    cd = bpy.data.cameras.new("cam")
    cd.lens = lens
    cd.clip_start, cd.clip_end = 0.05, 900
    cd.dof.use_dof = True
    cd.dof.focus_object = tgt
    cd.dof.aperture_fstop = fstop
    cam = bpy.data.objects.new("cam", cd)
    sc.collection.objects.link(cam)
    sc.camera = cam
    c = cam.constraints.new("TRACK_TO")
    c.target, c.track_axis, c.up_axis = tgt, "TRACK_NEGATIVE_Z", "UP_Y"
    for f, loc, t in keys:
        cam.location, tgt.location = loc, t
        cam.keyframe_insert("location", frame=f)
        tgt.keyframe_insert("location", frame=f)
    linear(cam)
    linear(tgt)
    return cam, tgt


def screen_right(cam_loc, tgt_loc):
    fwd = (Vector(tgt_loc) - Vector(cam_loc)).normalized()
    return fwd.cross(Vector((0, 0, 1))).normalized()


def run_rats(cam, right, n, x_rng, y_rng, direction, dist, frames, png="rat", seed=0, h=0.32, z=0.0):
    r = random.Random(seed)
    obs = []
    for i in range(n):
        dvec = Vector(direction).normalized() * (dist * r.uniform(0.7, 1.3))
        start = Vector((r.uniform(*x_rng), r.uniform(*y_rng), z))
        flip = dvec.dot(right) < 0
        ob = sprite(png, start, h * r.uniform(0.85, 1.15), cam, flip=flip, name=f"{png}{i}")
        ob.keyframe_insert("location", frame=1)
        ob.location = start + dvec
        ob.keyframe_insert("location", frame=frames)
        linear(ob)
        bob(ob, strength=0.06, scale=1.5, phase=r.uniform(0, 50))
        obs.append(ob)
    return obs


def show_between(ob, f_on, f_off, total):
    """Visible (render) only for local frames [f_on, f_off)."""
    for f, hide in ((1, f_on > 1), (f_on, False), (f_off, True)):
        if 1 <= f <= total + 1:
            ob.hide_render = hide
            ob.keyframe_insert("hide_render", frame=f)
    ob.hide_render = f_on > 1


# ------------------------------------------------------------------ shots
def word_time(line, word):
    for w in TIMING["words"]:
        if w["line"] == line and w["w"].lower().strip(".,?!").startswith(word.lower()):
            return w["s"]
    raise KeyError((line, word))


SHOTS = [
    # lines, preset, cut_in (hard cut into this shot)
    ([0], "night", False),
    ([1], "dusk", False),
    ([2], "interior", False),
    ([3], "night", False),
    ([4, 5], "sewer", False),
    ([6], "interior", False),
    ([7], "interior", False),
    ([8], "interior", False),
    ([9], "dusk", False),
    ([10, 11], "dusk", False),
    ([12, 13], "night", False),
    ([14], "golden", False),
    ([15], "night", False),
    ([16], "golden", True),
]


def shot_spans():
    sents = TIMING["sentences"]
    starts = []
    for k, (lines, _, _) in enumerate(SHOTS):
        if k == 0:
            starts.append(0.0)
        else:
            prev_end = sents[SHOTS[k - 1][0][-1]]["e"]
            starts.append((prev_end + sents[lines[0]]["s"]) / 2)
    ends = starts[1:] + [TIMING["duration"] + 0.3]
    return list(zip(starts, ends))


def stage(k, T0, n, cam_holder):
    """Place characters, camera and animation for shot k. n = rendered frames."""
    F = lambda t: max(1, round((t - T0) * FPS) + 1)   # global seconds -> local frame

    def fog(name, loc, size=0.5, col="#5fbf76", emit=1.4):
        b = Builder(name, outline=0)
        b.sphere(loc, size, mat(f"fog_{name}", col, emit=emit, noise=0), sub=2)
        return b.finish()

    def herb(name, loc, seed=0):
        r = random.Random(seed)
        b = Builder(name, outline=0.02)
        b.cyl((loc[0], loc[1], loc[2]), 0.07, 0.3, mat("stem", "#4a7a3a", noise=0), seg=6)
        for i in range(3):
            b.sphere((loc[0] + r.uniform(-0.09, 0.09), loc[1] + r.uniform(-0.05, 0.05), loc[2] + 0.14 + i * 0.06),
                     0.09, mat(f"petal{seed}_{i}", ["#e08a9a", "#f2d06b", "#9ecf8a"][i], emit=0.5, noise=0), sub=2)
        return b.finish()

    if k == 0:   # night: sick villager at the door, "send for the bird"
        cam, _ = make_camera([(1, (2.6, 40.8, 1.3), (0, 44.6, 1.5)), (n, (1.9, 42.3, 1.25), (0, 44.9, 1.6))], 30, 3.5)
        sprite("villager_sick", (0, 45.0, 0.95), 1.65, cam)
        sprite("towns_worried", (-2.4, 43.4, 0.75), 1.6, cam, flip=True)
        sprite("towns_b", (2.5, 43.6, 0.75), 1.6, cam)
        bell = text("!", (-1.05, 44.6, 2.9), 0.55, mat("warn", "#ff5a4a", emit=2.5, noise=0), font=FONT_BOLD)
        f = F(word_time(0, "die"))
        bell.scale = (0.01, 0.01, 0.01)
        bell.keyframe_insert("scale", frame=f)
        bell.scale = (1, 1, 1)
        bell.keyframe_insert("scale", frame=f + 5)
    elif k == 1:  # dusk street: the bird-masked doctor arrives
        cam, _ = make_camera([(1, (2.9, 24, 2.0), (-0.2, 34, 1.5)), (n, (1.4, 30.5, 1.7), (-0.6, 37.5, 1.7))], 28, 4)
        sprite("plague_doctor", (0, 40, 0.05), 1.9, cam)
        sprite("towns_worried", (-3.6, 32, 0.16), 1.6, cam, flip=True)
        sprite("towns_c", (3.5, 36, 0.16), 1.6, cam)
    elif k == 2:  # interior: robe / hat / beak laid out like kit
        cam, _ = make_camera([(1, (IX - 1.4, -1.1, 1.9), (IX - 0.3, 1.0, 0.95)), (n, (IX + 0.7, -0.8, 1.7), (IX + 0.2, 1.0, 1.0))], 30, 3)
        sprite("plague_doctor", (IX - 0.4, 2.0, 0.0), 1.85, cam)
        herb("hb1", (IX - 1.4, 0.7, 1.0), 1)
        herb("hb2", (IX + 1.3, 0.75, 1.0), 2)
        for nm in ("board_MORTS: 100", "board_MORTS: 1 000"):
            if nm in bpy.data.objects:
                bpy.data.objects[nm].hide_render = True
    elif k == 3:  # night close-up: gas mask 400 years early
        cam, _ = make_camera([(1, (0.4, 36.4, 1.85), (0, 40, 1.55)), (n, (0.15, 38.1, 1.75), (0, 40, 1.6))], 34, 2.2)
        sprite("plague_doctor", (0, 40, 0.05), 1.9, cam)
        yr = text("400 YRS EARLY", (0, 39.6, 3.6), 0.34, mat("yr", "#ffd76a", emit=2.0, noise=0), font=FONT_BOLD)
        f = F(word_time(3, "early"))
        yr.scale = (0.01, 0.01, 0.01)
        yr.keyframe_insert("scale", frame=f)
        yr.scale = (1, 1, 1)
        yr.keyframe_insert("scale", frame=f + 6)
    elif k == 4:  # sewer cutaway: miasma fog rises out of the dark
        cam, _ = make_camera([(1, (SX + 3.4, -10.5, -2.4), (SX + 3.2, 0, -3.8)), (n, (SX + 0.6, -8.2, -4.4), (SX + 0.8, 0, -5.0))], 30, 9)
        for i in range(5):
            ob = fog(f"mias{i}", (SX - 3 + i * 1.6, -0.5, -5.8 - i * 0.3), 0.4 + i * 0.12)
            ob.keyframe_insert("location", frame=1)
            ob.location.z += 2.6 + i * 0.4
            ob.keyframe_insert("location", frame=n)
            linear(ob)
        run_rats(cam, Vector((1, 0, 0)), 6, (SX - 8, SX + 8), (-0.6, -0.2), (-1, 0, 0), 9, n, seed=9, h=0.3, z=-6.15)
        sprite("towns_worried", (SX - 5, 1.2, 0.1), 1.0, cam)
        sprite("towns_b", (SX - 2.5, 1.2, 0.1), 1.05, cam)
    elif k == 5:  # interior: the beak gets stuffed with flowers
        cam, _ = make_camera([(1, (IX - 1.0, -1.3, 2.1), (IX - 0.5, 1.05, 1.0)), (n, (IX - 0.3, -0.6, 1.8), (IX - 0.5, 1.05, 1.05))], 30, 3)
        sprite("plague_doctor", (IX - 0.3, 2.05, 0), 1.85, cam)
        for i, w in enumerate(("roses", "mint", "camphor")):
            ob = herb(f"drop{i}", (IX - 0.55 + i * 0.35, 0.9, 1.7 + i * 0.35), 10 + i)
            f = F(word_time(6, w))
            show_between(ob, f, n + 99, n)
            ob.keyframe_insert("location", frame=f)
            ob.location.z = 1.05
            ob.keyframe_insert("location", frame=f + 7)
    elif k == 6:  # close-up: filtered breath
        cam, _ = make_camera([(1, (0.55, 37.0, 1.9), (0, 40, 1.5)), (n, (0.3, 38.4, 1.8), (0, 40, 1.55))], 36, 1.8)
        sprite("plague_doctor", (0, 40, 0.05), 1.9, cam)
        for i in range(3):
            ob = fog(f"breath{i}", (-0.35 + i * 0.35, 39.3, 0.7), 0.12, "#c8e8d0", 2.0)
            f = 1 + i * (n // 4)
            show_between(ob, f, min(n, f + n // 3), n)
            ob.keyframe_insert("location", frame=f)
            ob.location.z -= 0.5
            ob.location.y -= 0.6
            ob.keyframe_insert("location", frame=min(n, f + n // 3))
    elif k == 7:  # interior: waxed coat, sealed head to toe
        cam, _ = make_camera([(1, (IX + 0.3, -0.7, 1.4), (IX + 0.1, 2.0, 1.0)), (n, (IX + 0.1, -0.9, 2.2), (IX + 0.1, 2.0, 1.4))], 30, 2.5)
        sprite("plague_doctor", (IX + 0.1, 2.05, 0), 1.85, cam)
        wax = text("WAX", (IX - 1.6, 1.9, 1.2), 0.3, mat("waxtxt", "#e8c97a", emit=1.6, noise=0), font=FONT_BOLD)
        f = F(word_time(8, "wax"))
        wax.scale = (0.01, 0.01, 0.01)
        wax.keyframe_insert("scale", frame=f)
        wax.scale = (1, 1, 1)
        wax.keyframe_insert("scale", frame=f + 5)
    elif k == 8:  # street: the long stick, no touching
        cam, _ = make_camera([(1, (3.0, 30, 1.5), (-0.5, 36, 1.4)), (n, (2.0, 33, 1.6), (-0.5, 36.5, 1.5))], 28, 3.5)
        sprite("plague_doctor", (-0.8, 38, 0.05), 1.9, cam)
        sprite("villager_sick", (2.2, 36.2, 0.16), 1.6, cam, flip=True)
        sprite("towns_worried", (-3.9, 33, 0.16), 1.6, cam, flip=True)
    elif k == 9:  # flea close-up: the real enemy bounces off the wax
        cam, _ = make_camera([(1, (IX - 0.9, -0.5, 1.35), (IX - 0.4, 1.0, 1.0)), (n, (IX - 0.2, -0.7, 1.2), (IX - 0.4, 1.0, 1.0))], 40, 1.5)
        sprite("plague_doctor", (IX - 0.4, 2.05, 0), 1.85, cam)
        r = random.Random(4)
        for i in range(7):
            b = Builder(f"flea{i}", outline=0.01)
            x = IX - 1.6 + i * 0.42
            b.sphere((x, 0.9, 1.35), 0.05, mat("fleabody", "#2a1e1e", noise=0), sub=1)
            ob = b.finish()
            ob.keyframe_insert("location", frame=1)
            ob.location.z = 1.35 + r.uniform(0.5, 1.3)
            ob.location.x += r.uniform(-0.3, 0.3)
            ob.keyframe_insert("location", frame=max(2, n // 2))
            ob.location.z = 1.35
            ob.keyframe_insert("location", frame=n)
        f = F(word_time(12, "flea"))
        txt = text("FLEAS", (IX - 0.4, 0.95, 1.75), 0.24, mat("fleatxt", "#ff8a5a", emit=2.0, noise=0), font=FONT_BOLD)
        txt.scale = (0.01, 0.01, 0.01)
        txt.keyframe_insert("scale", frame=f)
        txt.scale = (1, 1, 1)
        txt.keyframe_insert("scale", frame=f + 5)
    elif k == 10:  # night: empty street, fallen robes, rats own the town
        cam, _ = make_camera([(1, (1.8, 18, 1.1), (-0.4, 30, 0.9)), (n, (0.8, 27, 1.2), (-0.6, 34, 1.2))], 26, 4)
        b = Builder("fallen", outline=0.02)
        for i, (x, y) in enumerate([(-0.8, 27.5), (1.6, 30.5), (-2.2, 33.0)]):
            b.sphere((x, y, 0.22), 0.55, mat("heap", "#3a3444", noise=0.1), sc=(1.4, 1.0, 0.45), sub=2)
        b.finish()
        right = screen_right((1.8, 18, 1.1), (-0.4, 30, 0.9))
        run_rats(cam, right, 18, (-3.5, 3.5), (18, 40), (0, 1, 0), 9, n, seed=10, h=0.4)
    elif k == 11:  # golden: one doctor still walking
        cam, _ = make_camera([(1, (2.6, 26, 1.9), (-0.3, 34, 1.6)), (n, (0.6, 32.5, 1.8), (-0.3, 37, 1.7))], 28, 5)
        sprite("plague_doctor", (-0.3, 39, 0.05), 1.9, cam)
        sprite("towns_c", (3.6, 34, 0.16), 1.6, cam)
    elif k == 12:  # night: the real enemy — rats in the fog behind him
        cam, _ = make_camera([(1, (1.4, 33, 1.7), (-0.2, 38, 1.4)), (n, (0.4, 35.5, 1.6), (-0.2, 38, 1.5))], 30, 3)
        sprite("plague_doctor", (-0.2, 38.5, 0.05), 1.9, cam)
        for i in range(4):
            ob = fog(f"mias{i}", (-3 + i * 2, 40.5 + i * 0.4, 0.7 + i * 0.35), 0.5 + i * 0.1, "#4f9f66", 1.0)
            ob.keyframe_insert("location", frame=1)
            ob.location.z += 1.2
            ob.keyframe_insert("location", frame=n)
            linear(ob)
        right = screen_right((1.4, 33, 1.7), (-0.2, 38, 1.4))
        run_rats(cam, right, 10, (-4, 4), (36, 44), (0, 1, 0), 7, n, seed=12, h=0.38)
    elif k == 13:  # golden day: hazmat — the mask was basically right
        cam, _ = make_camera([(1, (2.0, 30.5, 1.9), (0, 35.5, 1.4)), (n, (0.5, 33.2, 1.8), (0, 35.5, 1.5))], 30, 3.5)
        sprite("hazmat", (0, 36.0, 0.05), 1.85, cam)
        stamp = text("1600s HAZMAT", (0, 35.6, 3.4), 0.32, mat("hz", "#ffd76a", emit=2.2, noise=0), font=FONT_BOLD)
        f = F(word_time(16, "hazmat"))
        stamp.scale = (0.01, 0.01, 0.01)
        stamp.keyframe_insert("scale", frame=f)
        stamp.scale = (1, 1, 1)
        stamp.keyframe_insert("scale", frame=f + 6)
    else:
        raise ValueError(k)
    cam_holder.append(cam)


def main():
    for ob in list(bpy.data.objects):
        bpy.data.objects.remove(ob)
    preset = SHOTS[SHOT][1]
    build_city()
    build_interior()
    build_sewer()
    build_farm()
    clouds()
    setup_world(preset)
    spans = shot_spans()
    T0, T1 = spans[SHOT]
    n = round(T1 * FPS) - round(T0 * FPS) + (HANDLE if SHOT < len(SHOTS) - 1 else 0)
    json.dump({"fps": FPS, "handle": HANDLE,
               "shots": [{"g0": round(a * FPS), "g1": round(b * FPS), "cut_in": SHOTS[i][2]}
                         for i, (a, b) in enumerate(spans)]},
              open(ROOT / "spans.json", "w"), indent=1)
    setup_render(n)
    holder = []
    stage(SHOT, T0, n, holder)
    sc = bpy.context.scene
    out = ROOT / "frames" / f"s{SHOT:02d}"
    out.mkdir(parents=True, exist_ok=True)
    if STILL is not None:
        f = max(1, min(n, round(STILL * FPS) + 1))
        sc.frame_set(f)
        sc.render.filepath = str(ROOT / "stills" / f"s{SHOT:02d}_{f:04d}.png")
        bpy.ops.render.render(write_still=True)
    else:
        sc.render.filepath = f"{out}/"          # Path("x") / "" drops the slash; Blender needs it
        sc.render.use_overwrite = False      # resumable
        sc.render.use_placeholder = True
        bpy.ops.render.render(animation=True)
    print(f"SHOT {SHOT} T0={T0:.2f} T1={T1:.2f} frames={n}")


main()
