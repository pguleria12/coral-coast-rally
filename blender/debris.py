# Crash debris for Coral Coast Rally, exported to dist/assets/debris.glb.
# Small single-material pieces the game instances and throws around on impacts. Paint and Clod pieces are
# neutral grey so the game can tint each instance (car paint / track dirt); Bolt is chrome.
# Sizes are real-world-ish (metres) and each piece is centred on its own origin so it tumbles naturally.
# Run: Blender -b --factory-startup -P blender/debris.py -- <out_dir>
import sys, os, math, random
import bmesh
sys.path.insert(0, os.path.dirname(__file__))
from common import *

out = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else '.'
reset()
random.seed(11)
PAINT = mat('DebrisPaint', (0.8, 0.8, 0.8), 0.35, 0.3)
BOLT = mat('DebrisBolt', (0.85, 0.86, 0.88), 0.25, 1.0)
CLOD = mat('DebrisClod', (0.75, 0.75, 0.75), 0.95, 0.0)


def jitter(o, amt, seed):
    rnd = random.Random(seed)
    for v in o.data.vertices:
        v.co += Vector((rnd.uniform(-amt, amt), rnd.uniform(-amt, amt), rnd.uniform(-amt, amt)))


def panel_shard():
    """A torn, slightly bent piece of body panel with a thin edge."""
    bm = bmesh.new()
    pts = [(-0.18, -0.1), (0.05, -0.13), (0.2, -0.04), (0.16, 0.09), (-0.02, 0.12), (-0.15, 0.06)]
    top = [bm.verts.new((x, y, 0.012 + 0.08 * x * x)) for x, y in pts]
    bot = [bm.verts.new((x, y, -0.012 + 0.08 * x * x)) for x, y in pts]
    bm.faces.new(top)
    bm.faces.new(list(reversed(bot)))
    n = len(pts)
    for i in range(n):
        bm.faces.new([top[i], bot[i], bot[(i + 1) % n], top[(i + 1) % n]])
    me = bpy.data.meshes.new('shard_panel')
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new('shard_panel', me)
    bpy.context.collection.objects.link(o)
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode='OBJECT')
    return finish(o, PAINT, 0.004, smooth=0.5)


def chip():
    """A chunky fibreglass / plastic fragment."""
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.09)
    o = bpy.context.active_object
    o.scale = (1.4, 1.0, 0.45)
    bpy.ops.object.transform_apply(scale=True)
    jitter(o, 0.025, 3)
    o.name = 'shard_chip'
    return finish(o, PAINT, 0, smooth=0)


def bolt():
    """Hex nut threaded on a short bolt."""
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.035, depth=0.03)
    nut = finish(bpy.context.active_object, BOLT, 0.004, smooth=0)
    bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=0.014, depth=0.11, location=(0, 0, 0.02))
    shaft = finish(bpy.context.active_object, BOLT, 0, smooth=0.8)
    return join([nut, shaft], 'bolt')


def clod():
    """A lump of dirt / snow kicked up in the impact."""
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.08)
    o = bpy.context.active_object
    jitter(o, 0.022, 7)
    o.scale = (1.2, 1.0, 0.8)
    bpy.ops.object.transform_apply(scale=True)
    o.name = 'clod'
    return finish(o, CLOD, 0, smooth=0.9)


pieces = [panel_shard(), chip(), bolt(), clod()]
for o in pieces:
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    o.location = (0, 0, 0)
    print('TRIS', o.name, sum(len(f.vertices) - 2 for f in o.data.polygons))
os.makedirs(out, exist_ok=True)
export_glb(os.path.join(out, 'debris.glb'), pieces)
for i, o in enumerate(pieces):
    o.location = (i * 0.45 - 0.7, 0, 0)
preview(os.path.join(os.path.dirname(__file__), 'preview_debris.png'), [], dist=1.6, target=(0, 0, 0), az=0.9, elev=0.6, size=(800, 400))
