# Builds the two buggy bodies (classic + sports) and two wheel sets for Coral Coast Rally, exports dist/assets/cars.glb.
# Run: Blender -b --factory-startup -P blender/buggy.py -- <out_dir>
# Proportions are locked to the game's physics: wheels at x=±1.08, z=+1.18 / -1.2, radius 0.62 (std tyres).
# Material names are a contract with the game, which swaps in per-car paint/rim colours:
#   Paint, Dark, Chrome, Lamp, Tail, Glass, Seat, Suit, Helmet, Visor, Accent, Tire, Rim
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
from common import *

out = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else '.'
reset()

PAINT = mat('Paint', (0.85, 0.08, 0.1), 0.3, 0.2)
DARK = mat('Dark', (0.03, 0.035, 0.045), 0.5, 0.6)
CHROME = mat('Chrome', (0.9, 0.92, 0.95), 0.12, 1.0)
LAMP = mat('Lamp', (1, 1, 1), 0.2, 0, emit=(1, 0.95, 0.75))
TAIL = mat('Tail', (0.8, 0.02, 0.02), 0.3, 0, emit=(1, 0.05, 0.03))
GLASS = mat('Glass', (0.6, 0.8, 0.95), 0.05, 0, alpha=0.45)
SEAT = mat('Seat', (0.05, 0.05, 0.06), 0.85, 0)
SUIT = mat('Suit', (0.85, 0.08, 0.1), 0.7, 0)
HELMET = mat('Helmet', (0.96, 0.96, 0.96), 0.25, 0.1)
VISOR = mat('Visor', (0.03, 0.04, 0.06), 0.08, 0.9)
ACCENT = mat('Accent', (0.15, 0.45, 1.0), 0.35, 0.3)
TIRE = mat('Tire', (0.03, 0.03, 0.035), 0.92, 0)
RIM = mat('Rim', (0.2, 0.5, 1.0), 0.3, 0.5)


def driver(y, z, parts):
    """Seat, torso, arms and helmeted head. y = helmet centre height, z = helmet z."""
    parts += [
        box(0.62, 0.12, 0.62, (0, y - 1.02, z - 0.02), SEAT, 0.05),            # seat base
        box(0.62, 0.72, 0.14, (0, y - 0.62, z - 0.34), SEAT, 0.05, rx=-0.18),  # seat back
        box(0.44, 0.5, 0.3, (0, y - 0.62, z - 0.05), SUIT, 0.1),               # torso
        cyl(0.07, 0.14, (0, y - 0.3, z), SUIT, verts=12),                       # neck
        sphere(0.27, (0, y, z), HELMET, segs=24, rings=16),
        sphere(0.205, (0, y + 0.02, z + 0.12), VISOR, scale=(1.05, 0.62, 0.8)),
    ]
    for s in (-1, 1):  # arms reaching to the wheel
        parts.append(tube([(s * 0.25, y - 0.45, z - 0.02), (s * 0.3, y - 0.62, z + 0.28), (s * 0.15, y - 0.5, z + 0.55)], 0.075, SUIT, 0.12))
    parts.append(cyl(0.18, 0.04, (0, y - 0.48, z + 0.6), DARK, axis='z', verts=20, rot=(math.pi / 2 - 0.5, 0, 0)))  # steering wheel
    bpy.ops.mesh.primitive_torus_add(major_radius=0.19, minor_radius=0.025, location=P(0, y - 0.48, z + 0.6))
    t = bpy.context.active_object
    t.rotation_euler = (-0.5, 0, 0)
    parts.append(finish(t, DARK, smooth=1.2))


def classic():
    p = []
    # chassis tub + skid plate
    p.append(box(1.46, 0.26, 3.0, (0, 0.78, 0), DARK, 0.06))
    p.append(box(1.2, 0.08, 0.7, (0, 0.62, 1.55), CHROME, 0.03, rx=0.35))
    # nose: raked bonnet with a centre crease and stripe
    p.append(box(1.42, 0.36, 1.2, (0, 1.0, 1.12), PAINT, 0.12, rx=0.2))
    p.append(box(1.1, 0.2, 0.5, (0, 1.12, 1.55), PAINT, 0.1, rx=0.42))
    p.append(box(0.36, 0.02, 1.22, (0, 1.2, 1.1), ACCENT, 0.01, rx=0.2))
    p.append(box(0.9, 0.06, 0.1, (0, 1.0, 1.82), DARK, 0.02))               # grille slot
    # side pods with intake vents
    for s in (-1, 1):
        p.append(box(0.32, 0.52, 1.9, (s * 0.84, 0.95, -0.15), PAINT, 0.1))
        for k in range(3):
            p.append(box(0.04, 0.05, 0.6, (s * 1.0, 0.85 + k * 0.11, 0.1), DARK, 0.01))
        p.append(box(0.04, 0.1, 1.5, (s * 1.01, 1.12, -0.2), ACCENT, 0.02))
        # headlights: chrome bucket + lens
        p.append(cyl(0.13, 0.1, (s * 0.52, 1.02, 1.79), CHROME, axis='z', verts=20, bevel=0.015))
        p.append(cyl(0.105, 0.04, (s * 0.52, 1.02, 1.85), LAMP, axis='z', verts=20))
        # tail lights
        p.append(box(0.22, 0.1, 0.05, (s * 0.52, 1.12, -1.71), TAIL, 0.02))
        # mirror
        p.append(tube([(s * 0.7, 1.25, 0.45), (s * 0.86, 1.45, 0.4)], 0.025, DARK, 0.05))
        p.append(box(0.06, 0.12, 0.2, (s * 0.88, 1.48, 0.4), PAINT, 0.03))
    # engine bay: cover, block, cooling fins, air filter
    p.append(box(1.46, 0.46, 0.9, (0, 1.04, -1.25), PAINT, 0.1))
    p.append(box(0.9, 0.3, 0.6, (0, 1.38, -1.3), DARK, 0.05))
    for k in range(5):
        p.append(box(0.94, 0.03, 0.62, (0, 1.29 + k * 0.05, -1.3), CHROME, 0.0))
    p.append(cyl(0.2, 0.16, (0, 1.6, -1.25), CHROME, verts=24, bevel=0.03))
    p.append(cyl(0.22, 0.04, (0, 1.69, -1.25), DARK, verts=24))
    p.append(box(0.62, 0.75, 0.2, (0, 1.3, -0.62), DARK, 0.05))              # firewall
    driver(1.78, -0.42, p)
    # roll cage: one continuous hoop each side plus cross bars and diagonals
    for s in (-1, 1):
        p.append(tube([(s * 0.7, 1.0, 0.7), (s * 0.62, 2.1, 0.05), (s * 0.62, 2.1, -0.95), (s * 0.72, 1.05, -1.65)], 0.055, DARK, 0.25))
        p.append(tube([(s * 0.62, 2.1, -0.5), (s * 0.72, 1.1, -0.6)], 0.045, DARK, 0.1))
        p.append(tube([(s * 0.45, 1.6, -1.75), (s * 0.45, 1.98, -1.85)], 0.04, DARK, 0.05))
        # chrome exhausts sweeping out the back (game flames sit at x=±0.3, y=1.2, z=-2.0)
        p.append(tube([(s * 0.3, 1.5, -1.45), (s * 0.3, 1.45, -1.7), (s * 0.3, 1.22, -1.95)], 0.07, CHROME, 0.15))
        p.append(cyl(0.085, 0.12, (s * 0.3, 1.2, -1.98), DARK, axis='z', verts=16))
    for zz in (0.05, -0.95):
        p.append(tube([(-0.62, 2.1, zz), (0.62, 2.1, zz)], 0.055, DARK, 0.1))
    p.append(tube([(-0.62, 2.1, -0.95), (0.62, 1.1, -0.95)], 0.045, DARK, 0.1))
    p.append(tube([(-0.85, 0.72, 1.86), (-0.8, 0.95, 1.95), (0.8, 0.95, 1.95), (0.85, 0.72, 1.86)], 0.07, CHROME, 0.15))  # bull bar
    # roof panel, rear wing on struts
    p.append(box(1.3, 0.06, 1.05, (0, 2.16, -0.45), PAINT, 0.03))
    p.append(box(1.9, 0.07, 0.5, (0, 2.02, -1.88), PAINT, 0.03, rx=-0.08))
    for s in (-1, 1):
        p.append(box(0.04, 0.4, 0.62, (s * 0.96, 2.0, -1.88), DARK, 0.02))
    # light bar: housing + four lamps
    p.append(box(1.4, 0.2, 0.18, (0, 2.3, 0.06), DARK, 0.04))
    for k in range(4):
        x = -0.48 + k * 0.32
        p.append(cyl(0.12, 0.08, (x, 2.3, 0.16), CHROME, axis='z', verts=16, bevel=0.01))
        p.append(cyl(0.1, 0.03, (x, 2.3, 0.2), LAMP, axis='z', verts=16))
    # race number plate
    p.append(box(0.5, 0.36, 0.03, (0, 1.05, -1.71), ACCENT, 0.02))
    return p


def sports():
    p = []
    p.append(box(1.62, 0.2, 3.5, (0, 0.66, 0), DARK, 0.05))
    p.append(box(1.5, 0.28, 1.6, (0, 0.85, 1.22), PAINT, 0.14, rx=0.14))        # wedge nose
    p.append(box(1.3, 0.16, 0.6, (0, 0.78, 1.95), PAINT, 0.07, rx=0.22))
    p.append(box(1.7, 0.05, 0.4, (0, 0.6, 2.1), DARK, 0.02))                     # front splitter
    p.append(box(0.34, 0.015, 1.62, (0, 1.0, 1.22), ACCENT, 0.005, rx=0.14))
    p.append(box(1.2, 0.05, 0.05, (0, 0.88, 2.06), LAMP, 0.02))                  # LED strip
    for s in (-1, 1):
        p.append(box(0.44, 0.42, 2.1, (s * 0.84, 0.86, -0.25), PAINT, 0.14))
        p.append(box(0.46, 0.08, 1.6, (s * 0.84, 1.1, -0.25), DARK, 0.03))
        p.append(box(0.05, 0.22, 0.5, (s * 1.07, 0.84, 0.35), DARK, 0.02))       # side intake
        p.append(box(0.2, 0.06, 0.04, (s * 0.55, 1.1, -2.08), TAIL, 0.01))
        p.append(box(0.3, 0.12, 0.05, (s * 0.5, 0.92, 2.0), LAMP, 0.03, rx=0.2))
    p.append(box(1.0, 0.3, 1.25, (0, 0.92, -0.25), DARK, 0.06))                  # cockpit tub
    p.append(box(1.05, 0.38, 0.04, (0, 1.18, 0.42), GLASS, 0.02, rx=-0.65))      # windscreen
    p.append(box(1.34, 0.5, 1.2, (0, 1.05, -1.45), PAINT, 0.14, rx=-0.18))       # engine cover
    p.append(box(0.5, 0.34, 0.55, (0, 1.42, -1.0), DARK, 0.08))                  # airbox scoop
    p.append(box(0.36, 0.2, 0.05, (0, 1.45, -0.72), DARK, 0.02))
    for k in range(4):
        p.append(box(1.0, 0.025, 0.05, (0, 1.12 + k * 0.07, -2.0), DARK, 0.0))   # rear vent slats
    # big rear wing with endplates and swan-neck struts
    p.append(box(2.3, 0.08, 0.62, (0, 1.98, -2.05), PAINT, 0.03, rx=-0.1))
    p.append(box(2.2, 0.04, 0.25, (0, 2.08, -2.32), ACCENT, 0.02, rx=-0.35))
    for s in (-1, 1):
        p.append(box(0.06, 0.6, 0.8, (s * 1.16, 1.88, -2.08), DARK, 0.03))
        p.append(tube([(s * 0.45, 1.2, -1.75), (s * 0.45, 1.6, -1.85), (s * 0.45, 1.98, -2.0)], 0.045, DARK, 0.1))
        p.append(tube([(s * 0.48, 1.0, -0.82), (s * 0.44, 1.78, -0.86)], 0.06, CHROME, 0.1))
        p.append(tube([(s * 0.3, 1.25, -1.9), (s * 0.3, 1.12, -2.2)], 0.08, CHROME, 0.1))
        p.append(cyl(0.095, 0.1, (s * 0.3, 1.1, -2.24), DARK, axis='z', verts=16))
    p.append(tube([(-0.44, 1.78, -0.86), (0.44, 1.78, -0.86)], 0.06, CHROME, 0.1))
    driver(1.5, -0.45, p)
    return p


def wheel(name, big):
    """Unit wheel: radius 1, width 1, axle along game X. The game scales it to each car's tyre size."""
    p = []
    bpy.ops.mesh.primitive_cylinder_add(radius=0.9, depth=0.92, vertices=48, location=P(0, 0, 0))
    t = bpy.context.active_object
    t.rotation_euler = (0, math.pi / 2, 0)
    p.append(finish(t, TIRE, bevel=0.22, segs=4, smooth=0.9))
    n = 22 if big else 24
    for k in range(n):  # chunky tread blocks, staggered
        a = k / n * math.pi * 2
        for side in ((-0.24, 0.24) if big else (0,)):
            off = side + (0.07 if (k % 2 and big) else 0)
            w = 0.36 if big else 0.82
            h = 0.11 if big else 0.08
            bpy.ops.mesh.primitive_cube_add(size=1, location=P(off, math.cos(a) * (0.92 + h / 2 - 0.04), math.sin(a) * (0.92 + h / 2 - 0.04)))
            b = bpy.context.active_object
            b.scale = (w, 0.21 if big else 0.17, h)
            b.rotation_euler = (a, 0, 0)
            bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
            p.append(finish(b, TIRE, bevel=0.03, segs=1, smooth=0))
    for s in (-1, 1):  # rim faces, spokes and hub on both sides
        p.append(cyl(0.62, 0.06, (s * 0.44, 0, 0), RIM, axis='x', verts=40, bevel=0.02))
        p.append(cyl(0.5, 0.07, (s * 0.46, 0, 0), DARK, axis='x', verts=40))
        for k in range(6 if big else 5):
            a = k / (6 if big else 5) * math.pi * 2
            bpy.ops.mesh.primitive_cube_add(size=1, location=P(s * 0.49, math.cos(a) * 0.27, math.sin(a) * 0.27))
            b = bpy.context.active_object
            b.scale = (0.06, 0.13, 0.5)
            b.rotation_euler = (a, 0, 0)
            bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
            p.append(finish(b, RIM, bevel=0.02, segs=1))
        p.append(cyl(0.16, 0.12, (s * 0.5, 0, 0), CHROME, axis='x', verts=20, bevel=0.03))
        for k in range(5):
            a = k / 5 * math.pi * 2
            p.append(cyl(0.025, 0.06, (s * 0.55, math.cos(a) * 0.1, math.sin(a) * 0.1), DARK, axis='x', verts=8))
    return join(p, name)


ROCKET_W = mat('RocketWhite', (0.94, 0.95, 0.97), 0.3, 0.5)
ROCKET_R = mat('RocketRed', (0.9, 0.08, 0.12), 0.35, 0.3)
NOZZLE = mat('Nozzle', (1.0, 0.45, 0.1), 0.4, 0, emit=(1.0, 0.35, 0.05))


def rocket():
    """One booster, centred on its mount point, nose toward game +Z (the game mirrors it to both sides).
    Envelope matches the old one: body radius 0.2, nose tip at z~1.1, nozzle exit at z~-0.85."""
    p = []
    p.append(cyl(0.2, 1.3, (0, 0, -0.1), ROCKET_W, axis='z', verts=24, bevel=0.03))
    for z in (0.42, -0.62):  # chrome bands
        p.append(cyl(0.212, 0.06, (0, 0, z), CHROME, axis='z', verts=24))
    p.append(cyl(0.205, 0.22, (0, 0, 0.1), ROCKET_R, axis='z', verts=24))  # livery band
    # ogive nose: squashed sphere half + cone
    nose = sphere(0.2, (0, 0, 0.55), ROCKET_R, scale=(1, 1, 2.6), segs=24, rings=12)
    p.append(nose)
    # nozzle bell, glowing throat
    p.append(cyl(0.16, 0.12, (0, 0, -0.8), DARK, axis='z', verts=20, r2=0.24))
    p.append(cyl(0.11, 0.02, (0, 0, -0.85), NOZZLE, axis='z', verts=16))
    # three swept fins
    for k in range(3):
        a = k * 2 * math.pi / 3 + math.pi / 2
        bpy.ops.mesh.primitive_cube_add(size=1, location=P(math.cos(a) * 0.3, math.sin(a) * 0.3, -0.52))
        f = bpy.context.active_object
        f.scale = (0.03, 0.42, 0.24)
        f.rotation_euler = (0, -a + math.pi / 2, 0)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        me = f.data  # sweep the outer trailing edge back
        for v in me.vertices:
            if v.co.z > 0.05 and v.co.y > 0:
                v.co.y += 0.12
        p.append(finish(f, ROCKET_R, bevel=0.012, segs=1))
    # mounting saddle down toward the cage
    p.append(box(0.1, 0.32, 0.5, (0, -0.28, -0.1), DARK, 0.03))
    p.append(box(0.3, 0.06, 0.6, (0, -0.44, -0.1), DARK, 0.02))
    return join(p, 'rocket')


body_c = join(classic(), 'buggy_classic')
body_s = join(sports(), 'buggy_sports')
w_std = wheel('wheel_std', False)
w_big = wheel('wheel_big', True)
rk = rocket()
for o in (body_c, body_s, w_std, w_big, rk):
    print('TRIS', o.name, sum(len(f.vertices) - 2 for f in o.data.polygons))

os.makedirs(out, exist_ok=True)
export_glb(os.path.join(out, 'cars.glb'), [body_c, body_s, w_std, w_big, rk])

# previews: lay the parts out side by side
body_s.location.x += 4.5
w_std.location = P(-1.08, 0.62, 1.18); w_std.scale = (0.52, 0.62, 0.62)
w_big.location = P(4.5 - 1.2, 0.86, 1.18); w_big.scale = (0.78, 0.86, 0.86)
for x in (-0.62, 0.62):  # show rockets on the classic body
    r2 = rk.copy(); bpy.context.collection.objects.link(r2); r2.location = P(x, 1.45, -1.45)
rk.hide_render = True
preview(os.path.join(os.path.dirname(__file__), 'preview_cars.png'), [], dist=13, target=(2.2, 1.0, 0), az=2.4)
