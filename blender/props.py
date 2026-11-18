# Trackside props for Coral Coast Rally, exported to dist/assets/props.glb.
# Each prop is ONE mesh with baked vertex colours (shape colour x dirt/AO), so the game can draw
# hundreds of them with a single InstancedMesh. Props the game tints per instance (rocks, cacti,
# tree canopies) are baked in light greys; the instance colour supplies the hue.
# Run: Blender -b --factory-startup -P blender/props.py -- <out_dir>
import sys, os, math, random
sys.path.insert(0, os.path.dirname(__file__))
from common import *

out = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else '.'
reset()
random.seed(7)
VC = mat('Props', (1, 1, 1), 0.85, 0)


def mesh_from(name, verts, faces):
    me = bpy.data.meshes.new(name)
    me.from_pydata([P(*v) for v in verts], [], faces)
    me.update()
    o = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(o)
    return o


def apply_all(o):
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    if o.type != 'MESH':
        bpy.ops.object.convert(target='MESH')
        o = bpy.context.active_object
    for md in list(o.modifiers):
        bpy.ops.object.modifier_apply(modifier=md.name)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    o.select_set(False)
    return o


def paint(o, fn, dirt=0.0):
    """Bake vertex colours: fn(game_x, game_y, game_z, normal_y) -> (r,g,b), optionally darkened by cavity dirt."""
    me = o.data
    attr = me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
    me.color_attributes.active_color = attr
    me.attributes.render_color_index = me.color_attributes.find('Col')
    shade = [1.0] * len(me.vertices)
    if dirt > 0:
        bpy.context.view_layer.objects.active = o
        o.select_set(True)
        bpy.ops.object.mode_set(mode='VERTEX_PAINT')
        for d in attr.data:
            d.color = (1, 1, 1, 1)
        bpy.ops.paint.vertex_color_dirt(blur_strength=1.0, blur_iterations=1, clean_angle=3.14, dirt_angle=0.0, dirt_only=False)
        bpy.ops.object.mode_set(mode='OBJECT')
        o.select_set(False)
        shade = [1 - dirt + dirt * attr.data[i].color[0] * 1.15 for i in range(len(me.vertices))]
    for i, v in enumerate(me.vertices):
        x, y, z = v.co.x, v.co.z, -v.co.y
        r, g, b = fn(x, y, z, v.normal.z)
        s = min(1.0, shade[i])
        attr.data[i].color = (r * s, g * s, b * s, 1)


def finalize(o, name, flat=False):
    o = apply_all(o)
    o.name = name
    o.data.name = name
    o.data.materials.clear()
    o.data.materials.append(VC)
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    if flat:
        bpy.ops.object.shade_flat()
    else:
        bpy.ops.object.shade_smooth_by_angle(angle=0.9)
    o.select_set(False)
    return o


def merge(objs):
    objs = [apply_all(o) for o in objs]
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    o = bpy.context.active_object
    o.select_set(False)
    return o


def lerp3(a, b, t):
    t = max(0.0, min(1.0, t))
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


def hexc(h):
    return ((h >> 16 & 255) / 255, (h >> 8 & 255) / 255, (h & 255) / 255)


def disp(o, strength, size, kind='VORONOI', seed=0):
    tex = bpy.data.textures.new('t', kind)
    if kind == 'VORONOI':
        tex.noise_scale = size
        tex.distance_metric = 'DISTANCE'
    else:
        tex.noise_scale = size
    md = o.modifiers.new('d', 'DISPLACE')
    md.texture = tex
    md.strength = strength
    md.mid_level = 0.5
    md.texture_coords = 'OBJECT' if False else 'LOCAL'
    o.location.x += 0  # keep
    return md


# ───────── rocks (grey, tinted per instance) ─────────
def rock(name, subdiv, seed, flat_y=0.75):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdiv, radius=1, location=(seed * 7.0, 0, 0))
    o = bpy.context.active_object
    o.scale = (1, 1, flat_y)
    disp(o, 0.55, 0.9, 'VORONOI')
    disp(o, 0.25, 0.35, 'CLOUDS')
    dec = o.modifiers.new('dec', 'DECIMATE')
    dec.decimate_type = 'DISSOLVE'
    dec.angle_limit = 0.12
    o = apply_all(o)
    o.location = (0, 0, 0)
    me = o.data
    c = sum((v.co for v in me.vertices), Vector()) / len(me.vertices)
    for v in me.vertices:
        v.co -= c
    paint(o, lambda x, y, z, ny: lerp3((0.82, 0.8, 0.77), (1, 1, 1), 0.5 + ny * 0.5), dirt=0.55)
    return finalize(o, name, flat=True)


rock_s = rock('rock_small', 2, 1)
rock_b = rock('rock_big', 3, 2)


# ───────── palm (full colour) ─────────
def palm():
    parts = []
    # trunk: tapered bent tube, ringed colour bands
    cu = bpy.data.curves.new('trunk', 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = 0.3
    cu.bevel_resolution = 1
    cu.resolution_u = 3
    sp = cu.splines.new('BEZIER')
    sp.bezier_points.add(2)
    for i, (p, r) in enumerate([((0, -0.6, 0), 1.1), ((0.45, 3.6, 0), 0.85), ((1.5, 7.5, 0), 0.65)]):
        bp = sp.bezier_points[i]
        bp.co = P(*p)
        bp.handle_left_type = bp.handle_right_type = 'AUTO'
        bp.radius = r
    o = bpy.data.objects.new('trunk', cu)
    bpy.context.collection.objects.link(o)
    o = apply_all(o)
    paint(o, lambda x, y, z, ny: lerp3(hexc(0x7a5636), hexc(0xb08a5c), 0.5 + 0.5 * math.copysign(1, math.sin(y * 4.5))))
    parts.append(o)
    # fronds: arched serrated ribbons radiating from the crown
    top = (1.5, 7.5, 0)
    for k in range(11):
        ang = k / 11 * math.pi * 2 + random.uniform(-0.15, 0.15)
        L = random.uniform(3.6, 4.8) if k < 9 else 2.8
        lift = random.uniform(0.9, 1.5)
        verts, faces, seg = [], [], 9
        for i in range(seg + 1):
            t = i / seg
            reach = t * L
            h = math.sin(t * 2.0) * lift - t * t * 2.6
            w = 0.95 * math.sin(math.pi * min(1, t * 0.95 + 0.05)) ** 0.6
            jag = 0.25 if i % 2 else 0
            for side in (-1, 0, 1):
                ww = side * (w + (jag if side else 0))
                lx, lz = reach, ww
                droop = -abs(ww) * 0.45 if side else 0.1
                gx = top[0] + math.cos(ang) * lx - math.sin(ang) * lz
                gz = top[2] + math.sin(ang) * lx + math.cos(ang) * lz
                verts.append((gx, top[1] + h + droop, gz))
            if i:
                a = (i - 1) * 3
                faces += [(a, a + 3, a + 4, a + 1), (a + 1, a + 4, a + 5, a + 2)]
        f = mesh_from('frond', verts, faces)
        tip = random.uniform(0, 0.25)
        paint(f, lambda x, y, z, ny, t0=tip: lerp3(hexc(0x2f7a26), hexc(0x9cc23d), (math.hypot(x - top[0], z - top[2]) / 4.6) * 0.8 + t0))
        parts.append(f)
    for k in range(3):  # coconuts
        a = k * 2.1
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.26, location=P(top[0] + math.cos(a) * 0.3, top[1] - 0.35, top[2] + math.sin(a) * 0.3))
        c = bpy.context.active_object
        c = apply_all(c)
        paint(c, lambda x, y, z, ny: hexc(0x5b3a1e))
        parts.append(c)
    return finalize(merge(parts), 'palm')


# ───────── saguaro cactus (grey ribs, tinted per instance) ─────────
def cactus():
    star = bpy.data.curves.new('star', 'CURVE')
    sp = star.splines.new('POLY')
    n = 12
    sp.points.add(n - 1)
    for i in range(n):
        a = i / n * math.pi * 2
        r = 1.0 if i % 2 == 0 else 0.78
        sp.points[i].co = (math.cos(a) * r, math.sin(a) * r, 0, 1)
    sp.use_cyclic_u = True
    star_o = bpy.data.objects.new('star', star)
    bpy.context.collection.objects.link(star_o)
    parts = []
    for path, r in [([(0, -0.5, 0), (0, 6.0, 0)], 0.48), ([(0, 2.3, 0), (1.0, 2.35, 0), (1.3, 2.9, 0), (1.3, 4.6, 0)], 0.32),
                    ([(0, 3.1, 0), (-0.9, 3.15, 0), (-1.1, 3.6, 0), (-1.1, 5.1, 0)], 0.3)]:
        cu = bpy.data.curves.new('arm', 'CURVE')
        cu.dimensions = '3D'
        cu.bevel_mode = 'OBJECT'
        cu.bevel_object = star_o
        cu.use_fill_caps = True
        s = cu.splines.new('POLY')
        pts = fillet([P(*p) for p in path], 0.45, 4)
        s.points.add(len(pts) - 1)
        for i, p in enumerate(pts):
            s.points[i].co = (*p, 1)
            s.points[i].radius = r
        o = bpy.data.objects.new('arm', cu)
        bpy.context.collection.objects.link(o)
        parts.append(apply_all(o))
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=6, radius=r * 0.98, location=P(*path[-1]))
        cap = bpy.context.active_object
        cap.scale = (1, 1, 0.7)
        parts.append(apply_all(cap))
    o = merge(parts)
    bpy.data.objects.remove(star_o)
    # ribs read lighter on the ridges, darker in the grooves
    paint(o, lambda x, y, z, ny: lerp3((0.62, 0.66, 0.6), (1, 1, 1), 0.5 + 0.5 * math.cos(math.atan2(z, x) * 8)), dirt=0.3)
    return finalize(o, 'cactus')


# ───────── snowy pine (full colour) ─────────
def pine():
    parts = []
    tiers = [(2.5, 0.9, 2.9), (2.1, 2.3, 2.7), (1.65, 3.6, 2.4), (1.2, 4.8, 2.1), (0.7, 5.9, 1.8)]
    for r, y0, hh in tiers:
        seg = 12
        verts = [(0, y0 + hh, 0)]
        for i in range(seg):
            a = i / seg * math.pi * 2 + y0
            rr = r * (1.0 if i % 2 == 0 else 0.78)
            verts.append((math.cos(a) * rr, y0 - (0.25 if i % 2 == 0 else 0), math.sin(a) * rr))
        verts.append((0, y0 + 0.3, 0))
        faces = [(0, 1 + i, 1 + (i + 1) % seg) for i in range(seg)] + [(seg + 1, 1 + (i + 1) % seg, 1 + i) for i in range(seg)]
        o = mesh_from('tier', verts, faces)
        o.data.flip_normals() if False else None
        parts.append(o)
    bpy.ops.mesh.primitive_cylinder_add(vertices=7, radius=0.3, depth=2.0, location=P(0, 0.6, 0))
    parts.append(bpy.context.active_object)
    o = merge(parts)
    bpy.ops.object.select_all(action='DESELECT')
    o.select_set(True)
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode='OBJECT')

    # per-face-corner colours: upward faces get snow that thickens toward the outer branch tips
    me = o.data
    attr = me.color_attributes.new('Col', 'FLOAT_COLOR', 'CORNER')
    me.color_attributes.active_color = attr
    me.attributes.render_color_index = me.color_attributes.find('Col')
    for f in me.polygons:
        for li in f.loop_indices:
            v = me.vertices[me.loops[li].vertex_index].co
            x, y, z = v.x, v.z, -v.y
            rr = math.hypot(x, z)
            if y < 1.0 and rr < 0.45:
                c = hexc(0x5a3e2a)
            else:
                g = lerp3(hexc(0x143f28), hexc(0x2c6a3a), y / 7)
                if f.normal.z > 0.2:
                    c = lerp3(g, (0.93, 0.96, 1.0), 0.9 * max(0.0, min(1.0, (rr - 0.9) / 0.9)))
                else:
                    c = lerp3(g, (0, 0, 0), 0.25)
            attr.data[li].color = (*c, 1)
    return finalize(o, 'pine', flat=True)


# ───────── country broadleaf tree: trunk (full colour) + canopy (grey, tinted) ─────────
def tree():
    tparts = [tube([(0, -0.3, 0), (0.1, 2.0, 0.05), (0.05, 3.6, 0)], 0.36, VC, 0.5)]
    tparts.append(tube([(0.08, 2.4, 0), (0.9, 3.6, 0.3), (1.2, 4.4, 0.4)], 0.17, VC, 0.4))
    tparts.append(tube([(0.05, 2.9, 0), (-0.8, 4.0, -0.4), (-1.0, 4.8, -0.5)], 0.15, VC, 0.4))
    t = merge(tparts)
    paint(t, lambda x, y, z, ny: lerp3(hexc(0x4a3220), hexc(0x7a5a3a), y / 5))
    trunk = finalize(t, 'tree_trunk')
    cparts = []
    for (x, y, z, s) in [(0, 5.0, 0, 2.6), (1.0, 6.3, 0.4, 1.8), (-1.1, 5.9, -0.5, 1.9), (0.2, 7.0, -0.3, 1.5), (0.6, 4.6, -1.0, 1.6), (-0.5, 4.5, 1.0, 1.6)]:
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=s, location=P(x, y, z))
        b = bpy.context.active_object
        b.scale = (1, 1, 0.85)
        disp(b, 0.5, 0.6, 'VORONOI')
        cparts.append(b)
    c = merge(cparts)
    dec = c.modifiers.new('dec', 'DECIMATE')
    dec.ratio = 0.45
    c = apply_all(c)
    paint(c, lambda x, y, z, ny: lerp3((0.55, 0.55, 0.55), (1, 1, 1), 0.45 + 0.55 * max(0, ny) + (y - 5) * 0.05), dirt=0.45)
    return trunk, finalize(c, 'tree_canopy', flat=True)


objs = [rock_s, rock_b, palm(), cactus(), pine(), *tree()]
for o in objs:
    print('TRIS', o.name, sum(len(f.vertices) - 2 for f in o.data.polygons))
os.makedirs(out, exist_ok=True)
export_glb(os.path.join(out, 'props.glb'), objs)

# preview line-up
for i, o in enumerate(objs):
    o.location = P(i * 5.5 - 16, 0, 0)
bpy.context.scene.display.shading.color_type = 'VERTEX'
sc = bpy.context.scene
sc.render.engine = 'BLENDER_WORKBENCH'
sc.display.shading.color_type = 'VERTEX'
preview(os.path.join(os.path.dirname(__file__), 'preview_props.png'), [], dist=48, target=(0, 3, 0), az=1.5, elev=0.15, size=(1400, 500), color='VERTEX')
