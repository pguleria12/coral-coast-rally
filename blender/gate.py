# Start/finish gantry for Coral Coast Rally, exported to dist/assets/gate.glb.
# Same footprint as the old gate: towers at x=±14.6 spanning a 29.5 m beam centred at y=9.4.
# Material names are a contract with the game:
#   Gate (tinted to each track's colour), Banner (game supplies the track-name texture; UVs are 0..1 per face),
#   Bulb (tower-top beacons, glow at night), Lamp (floodlights), StartRed / StartGreen (start lights),
#   Dark, Concrete, Steel
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
from common import *

out = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else '.'
reset()
GATE = mat('Gate', (0.1, 0.4, 1.0), 0.4, 0.2)
BANNER = mat('Banner', (1, 1, 1), 0.6, 0)
BULB = mat('Bulb', (1, 0.78, 0.23), 0.3, 0, emit=(1, 0.65, 0))
LAMP = mat('Lamp', (1, 1, 1), 0.2, 0, emit=(1, 0.95, 0.8))
RED = mat('StartRed', (0.9, 0.05, 0.05), 0.3, 0, emit=(1, 0.05, 0.03))
GREEN = mat('StartGreen', (0.1, 0.9, 0.2), 0.3, 0, emit=(0.1, 1, 0.2))
DARK = mat('Dark', (0.04, 0.045, 0.055), 0.5, 0.5)
CONC = mat('Concrete', (0.62, 0.6, 0.57), 0.95, 0)
STEEL = mat('Steel', (0.75, 0.77, 0.8), 0.35, 0.9)


def rod(a, b, r, m, verts=6):
    a, b = P(*a), P(*b)
    d = b - a
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d.length, vertices=verts, location=(a + b) / 2)
    o = bpy.context.active_object
    o.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    return finish(o, m, 0, smooth=0.6)


parts = []
# ── lattice towers ──
H, W2 = 10.9, 0.7   # tower top, half-width of the square section
for sx in (-1, 1):
    cx = sx * 14.6
    parts.append(box(2.6, 1.0, 2.6, (cx, -0.2, 0), CONC, 0.08))             # footing
    parts.append(box(1.9, 0.18, 1.9, (cx, 0.36, 0), STEEL, 0.03))           # base plate
    corners = [(cx + a * W2, b * W2) for a, b in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
    for x, z in corners:
        parts.append(rod((x, 0.3, z), (x, H, z), 0.11, GATE, 8))
    levels = [0.4 + k * 1.25 for k in range(9)]
    for y in levels:
        for k in range(4):
            (x0, z0), (x1, z1) = corners[k], corners[(k + 1) % 4]
            parts.append(rod((x0, y, z0), (x1, y, z1), 0.05, GATE))
    for j in range(len(levels) - 1):  # zig-zag bracing on every face
        y0, y1 = levels[j], levels[j + 1]
        for k in range(4):
            (x0, z0), (x1, z1) = corners[k], corners[(k + 1) % 4]
            if j % 2:
                x0, z0, x1, z1 = x1, z1, x0, z0
            parts.append(rod((x0, y0, z0), (x1, y1, z1), 0.04, STEEL))
    parts.append(box(1.8, 0.3, 1.8, (cx, H + 0.05, 0), DARK, 0.05))         # cap
    parts.append(cyl(0.18, 0.5, (cx, H + 0.45, 0), STEEL, verts=12))
    parts.append(sphere(1.0, (cx, H + 1.25, 0), BULB, segs=20, rings=12))    # beacon
    parts.append(cyl(1.02, 0.12, (cx, H + 1.25, 0), DARK, verts=24))        # beacon belt
    # pennant flag on a mast
    parts.append(rod((cx + sx * 0.5, H + 0.2, -0.5), (cx + sx * 0.5, H + 3.6, -0.5), 0.05, STEEL, 8))
    bpy.ops.mesh.primitive_cone_add(vertices=3, radius1=0.7, depth=1.6, location=P(cx + sx * 0.5 + sx * 0.8, H + 3.2, -0.5))
    f = bpy.context.active_object
    f.scale = (1, 0.06, 1)
    f.rotation_euler = (0, sx * math.pi / 2, 0)
    parts.append(finish(f, GATE, 0, smooth=0))

# ── beam: box girder with chamfers, banner panels front and back ──
parts.append(box(29.5, 3.0, 0.5, (0, 9.4, 0), GATE, 0.12))
for y in (7.85, 10.95):  # top/bottom chords
    parts.append(rod((-14.9, y, 0), (14.9, y, 0), 0.14, STEEL, 10))
for side in (1, -1):
    bpy.ops.mesh.primitive_plane_add(size=1, location=P(0, 9.4, side * 0.265))
    pl = bpy.context.active_object
    pl.scale = (25.4, 2.6, 1)                    # 1024x128 banner -> wide panel
    pl.rotation_euler = (math.pi / 2, 0, 0 if side > 0 else math.pi)
    parts.append(finish(pl, BANNER, 0, smooth=0))
# floodlights under the beam aimed at the line
for k in range(6):
    x = -11 + k * 4.4
    if abs(x) < 3:
        continue
    parts.append(box(0.12, 0.5, 0.12, (x, 7.65, 0.3), DARK, 0.02))
    parts.append(box(0.9, 0.35, 0.5, (x, 7.3, 0.45), DARK, 0.05, rx=0.5))
    parts.append(box(0.75, 0.04, 0.38, (x, 7.13, 0.56), LAMP, 0.01, rx=0.5))
# start-light pod hanging at centre: five pairs (red row over green row) facing the grid
parts.append(box(0.15, 0.6, 0.15, (0, 7.6, 0), DARK, 0.02))
parts.append(box(4.2, 1.3, 0.5, (0, 6.85, 0), DARK, 0.1))
for k in range(5):
    x = -1.6 + k * 0.8
    for side in (1, -1):
        parts.append(cyl(0.26, 0.08, (x, 7.15, side * 0.27), RED, axis='z', verts=16))
        parts.append(cyl(0.26, 0.08, (x, 6.55, side * 0.27), GREEN, axis='z', verts=16))
        parts.append(box(0.62, 0.04, 0.32, (x, 7.45, side * 0.42), DARK, 0.01, rx=side * 0.25))  # sun visor over the red

gate = join(parts, 'finish_gate')
print('TRIS', gate.name, sum(len(f.vertices) - 2 for f in gate.data.polygons))
os.makedirs(out, exist_ok=True)
export_glb(os.path.join(out, 'gate.glb'), [gate])
preview(os.path.join(os.path.dirname(__file__), 'preview_gate.png'), [], dist=46, target=(0, 6, 0), az=1.75, elev=0.1, size=(1200, 600))
