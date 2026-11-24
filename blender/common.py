# Shared helpers for the Coral Coast Rally Blender scripts.
# All positions are given in GAME coordinates (three.js: +Y up, +Z forward) and converted to
# Blender's Z-up space, so the glTF exporter's Y-up conversion lands them exactly where the game expects.
import bpy, bmesh, math
from mathutils import Vector


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def P(x, y, z):
    return Vector((x, -z, y))


_mats = {}


def mat(name, col=(0.8, 0.8, 0.8), rough=0.5, metal=0.0, emit=None, alpha=1.0):
    if name in _mats:
        return _mats[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    m.diffuse_color = (*col, alpha)
    m.roughness = rough
    m.metallic = metal
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = (*col, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if emit:
        b.inputs['Emission Color'].default_value = (*emit, 1)
        b.inputs['Emission Strength'].default_value = 2.0
    if alpha < 1:
        b.inputs['Alpha'].default_value = alpha
    _mats[name] = m
    return m


def finish(o, m, bevel=0.0, segs=2, smooth=0.6, parent=None):
    o.data.materials.clear()
    o.data.materials.append(m)
    if bevel > 0:
        md = o.modifiers.new('bev', 'BEVEL')
        md.width = bevel
        md.segments = segs
        md.limit_method = 'ANGLE'
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    if smooth:
        bpy.ops.object.shade_smooth_by_angle(angle=smooth)
    o.select_set(False)
    if parent:
        o.parent = parent
    return o


def box(w, h, d, pos, m, bevel=0.04, rx=0.0, ry=0.0, rz=0.0, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=P(*pos))
    o = bpy.context.active_object
    o.scale = (w, d, h)
    # game rotations about X / Y / Z map to Blender X / Z / -Y
    o.rotation_euler = (rx, -rz, ry)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(o, m, bevel, parent=parent)


def cyl(r, length, pos, m, axis='y', verts=20, r2=None, bevel=0.0, parent=None, rot=None):
    """Cylinder (or cone when r2 is given) along a game axis."""
    if r2 is None:
        bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=length, vertices=verts, location=P(*pos))
    else:
        bpy.ops.mesh.primitive_cone_add(radius1=r, radius2=r2, depth=length, vertices=verts, location=P(*pos))
    o = bpy.context.active_object
    # Blender default axis is +Z == game +Y
    if axis == 'x':
        o.rotation_euler = (0, math.pi / 2, 0)
    elif axis == 'z':
        o.rotation_euler = (math.pi / 2, 0, 0)
    if rot:
        o.rotation_euler = rot
    return finish(o, m, bevel, parent=parent)


def sphere(r, pos, m, scale=(1, 1, 1), segs=24, rings=14, parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=segs, ring_count=rings, location=P(*pos))
    o = bpy.context.active_object
    o.scale = (scale[0], scale[2], scale[1])
    return finish(o, m, 0, smooth=1.2, parent=parent)


def fillet(pts, rad, steps=5):
    """Round every interior corner of a polyline (list of Vectors)."""
    if len(pts) < 3:
        return pts
    out = [pts[0]]
    for i in range(1, len(pts) - 1):
        a, b, c = pts[i - 1], pts[i], pts[i + 1]
        da, dc = (a - b), (c - b)
        r = min(rad, da.length * 0.45, dc.length * 0.45)
        p0, p1 = b + da.normalized() * r, b + dc.normalized() * r
        for k in range(steps + 1):
            t = k / steps
            out.append(p0 * (1 - t) ** 2 + b * 2 * t * (1 - t) + p1 * t * t)
    out.append(pts[-1])
    return out


def tube(points, r, m, round_r=0.18, parent=None, res=10):
    """A bent pipe through game-space points with rounded bends (roll cages, exhausts)."""
    pts = fillet([P(*p) for p in points], round_r)
    cu = bpy.data.curves.new('tube', 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = r
    cu.bevel_resolution = 3
    cu.use_fill_caps = True
    sp = cu.splines.new('POLY')
    sp.points.add(len(pts) - 1)
    for i, p in enumerate(pts):
        sp.points[i].co = (*p, 1)
    o = bpy.data.objects.new('tube', cu)
    bpy.context.collection.objects.link(o)
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.convert(target='MESH')
    o = bpy.context.active_object
    o.select_set(False)
    return finish(o, m, 0, smooth=1.0, parent=parent)


def join(objs, name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
        bpy.context.view_layer.objects.active = o
        for md in list(o.modifiers):
            bpy.ops.object.modifier_apply(modifier=md.name)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    o = bpy.context.active_object
    # bake the joined object's transform into the vertices so the exported node is identity
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    o.name = name
    o.data.name = name
    o.select_set(False)
    return o


def export_glb(path, objs=None):
    bpy.ops.object.select_all(action='DESELECT')
    if objs:
        for o in objs:
            o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=bool(objs), export_apply=True,
                              export_yup=True, export_texcoords=True, export_normals=True,
                              export_vertex_color='ACTIVE', export_all_vertex_colors=False,
                              export_materials='EXPORT', export_animations=False, export_cameras=False, export_lights=False,
                              export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
                              export_draco_position_quantization=14, export_draco_normal_quantization=10,
                              export_draco_color_quantization=10, export_draco_texcoord_quantization=10)


def preview(path, objs, dist=9, elev=0.45, az=0.8, size=(900, 600), target=(0, 1, 0), color='MATERIAL'):
    """Quick Workbench render so the model can be eyeballed without opening Blender."""
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_WORKBENCH'
    sc.display.shading.light = 'STUDIO'
    sc.display.shading.color_type = color
    sc.display.shading.show_shadows = True
    sc.display.shading.show_cavity = True
    sc.render.resolution_x, sc.render.resolution_y = size
    sc.render.film_transparent = False
    t = P(*target)
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam'))
    bpy.context.collection.objects.link(cam)
    cam.location = t + Vector((math.cos(az) * dist * math.cos(elev), -math.sin(az) * dist * math.cos(elev), math.sin(elev) * dist))
    d = t - cam.location
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    sc.camera = cam
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(cam)


def uv_unwrap(o, margin=0.01):
    """Smart-project UVs so the object can carry baked textures (kept in the glTF export)."""
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=margin, scale_to_bounds=True)
    bpy.ops.object.mode_set(mode='OBJECT')
    o.select_set(False)


def bake_wear(o, path, res=1024, mud_top=1.0, wheel=False, samples=48):
    """Bake a packed wear map with Cycles: R = grime/ambient occlusion multiplier, G = edge scratches
    (bare metal shows through), B = caked mud on the lower body (or the tread, for wheels).
    The game multiplies/blends this over each car's own colours, so one map serves every livery."""
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = samples
    sc.render.bake.margin = 6
    sc.view_settings.view_transform = 'Standard'
    img = bpy.data.images.new(o.name + '_wear', res, res)
    img.colorspace_settings.name = 'Non-Color'
    m = bpy.data.materials.new('WearBake')
    m.use_nodes = True
    nt = m.node_tree
    n, l = nt.nodes, nt.links
    n.clear()

    def node(kind, **inputs):
        x = n.new(kind)
        for k, v in inputs.items():
            if isinstance(v, bpy.types.NodeSocket):
                l.new(v, x.inputs[k])
            else:
                x.inputs[k].default_value = v
        return x

    def maprange(v, a, b, lo=0.0, hi=1.0):
        return node('ShaderNodeMapRange', Value=v, **{'From Min': a, 'From Max': b, 'To Min': lo, 'To Max': hi}).outputs['Result']

    def math_(op, a, b):
        x = n.new('ShaderNodeMath')
        x.operation = op
        x.use_clamp = True
        for i, v in enumerate((a, b)):
            if isinstance(v, bpy.types.NodeSocket):
                l.new(v, x.inputs[i])
            else:
                x.inputs[i].default_value = v
        return x.outputs[0]

    geo = n.new('ShaderNodeNewGeometry')
    pos = geo.outputs['Position']
    ao = n.new('ShaderNodeAmbientOcclusion')
    ao.samples = 16
    ao.inputs['Distance'].default_value = 0.6
    big = node('ShaderNodeTexNoise', Vector=pos, Scale=1.8, Detail=4.0, Roughness=0.55).outputs['Fac']
    fine = node('ShaderNodeTexNoise', Vector=pos, Scale=22.0, Detail=8.0, Roughness=0.7).outputs['Fac']
    # R: grime collects in crevices (AO) plus broad blotches
    grime = math_('MULTIPLY', maprange(ao.outputs['AO'], 0.15, 1.0, 0.42, 1.0), maprange(big, 0.3, 0.75, 0.82, 1.0))
    # G: chipped edges and scattered scratches. Bevel-normal vs true normal marks convex edges
    bev = n.new('ShaderNodeBevel')
    bev.samples = 8
    bev.inputs['Radius'].default_value = 0.05
    dot = n.new('ShaderNodeVectorMath')
    dot.operation = 'DOT_PRODUCT'
    l.new(bev.outputs['Normal'], dot.inputs[0])
    l.new(geo.outputs['Normal'], dot.inputs[1])
    edge = maprange(dot.outputs['Value'], 0.995, 0.9)
    chips = maprange(fine, 0.52, 0.62)
    sc_vec = node('ShaderNodeVectorMath', Vector=pos)
    sc_vec.operation = 'MULTIPLY'
    sc_vec.inputs[1].default_value = (3.0, 3.0, 60.0)
    lines = maprange(node('ShaderNodeTexNoise', Vector=sc_vec.outputs['Vector'], Scale=6.0, Detail=2.0).outputs['Fac'], 0.66, 0.72)
    scratch = math_('MAXIMUM', math_('MULTIPLY', edge, chips), math_('MULTIPLY', lines, 0.6))
    # B: mud splashed up from the wheels: strongest low down, broken up by noise
    if wheel:
        sep = node('ShaderNodeSeparateXYZ', Vector=pos)
        rad = node('ShaderNodeVectorMath', Vector=pos)
        rad.operation = 'LENGTH'
        cyl = node('ShaderNodeCombineXYZ', X=0.0, Y=sep.outputs['Y'], Z=sep.outputs['Z'])
        rlen = node('ShaderNodeVectorMath', Vector=cyl.outputs['Vector'])
        rlen.operation = 'LENGTH'
        low = maprange(rlen.outputs['Value'], 0.6, 0.95)
    else:
        sep = node('ShaderNodeSeparateXYZ', Vector=pos)
        low = maprange(sep.outputs['Z'], mud_top, mud_top - 0.55)
    splat = maprange(math_('ADD', math_('MULTIPLY', big, 0.6), math_('MULTIPLY', fine, 0.4)), 0.38, 0.55)
    mud = math_('MULTIPLY', low, splat)
    comb = node('ShaderNodeCombineColor', Red=grime, Green=scratch, Blue=mud)
    em = node('ShaderNodeEmission', Color=comb.outputs['Color'])
    outn = n.new('ShaderNodeOutputMaterial')
    l.new(em.outputs[0], outn.inputs['Surface'])
    tex = n.new('ShaderNodeTexImage')
    tex.image = img
    nt.nodes.active = tex
    saved = list(o.data.materials)
    for i in range(len(o.data.materials)):
        o.data.materials[i] = m
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.bake(type='EMIT')
    o.select_set(False)
    for i, mm in enumerate(saved):
        o.data.materials[i] = mm
    img.filepath_raw = path
    img.file_format = 'JPEG'
    img.save()
    return img


def coilover(a, b, spring_m, shaft_m, body_m, r=0.075, turns=7):
    """Coil-over shock between game points a (top mount) and b (lower mount): reservoir body, chrome shaft,
    and a coil spring wound around it. Returns a list of mesh objects."""
    A, B = P(*a), P(*b)
    ax = (B - A)
    L = ax.length
    d = ax.normalized()
    # any vector perpendicular to the axis, for winding the spring
    u = d.cross(Vector((0, 0, 1)) if abs(d.z) < 0.9 else Vector((1, 0, 0))).normalized()
    v = d.cross(u)
    parts = []

    def seg(p0, p1, rad, m, verts=12):
        bpy.ops.mesh.primitive_cylinder_add(radius=rad, depth=(p1 - p0).length, vertices=verts, location=(p0 + p1) / 2)
        o = bpy.context.active_object
        o.rotation_euler = (p1 - p0).to_track_quat('Z', 'Y').to_euler()
        return finish(o, m, 0, smooth=0.6)
    parts.append(seg(A, A + d * L * 0.45, r * 0.62, body_m))               # damper body
    parts.append(seg(A + d * L * 0.4, B, r * 0.28, shaft_m))               # chrome shaft
    for p_, rr in ((A, r * 0.5), (B, r * 0.5)):                             # mount eyes
        parts.append(seg(p_ - u * 0.06, p_ + u * 0.06, rr, body_m, 10))
    pts = []
    n = turns * 14
    for i in range(n + 1):
        t = i / n
        ang = t * turns * 2 * math.pi
        c = A + d * (L * (0.12 + 0.76 * t))
        pts.append(c + (u * math.cos(ang) + v * math.sin(ang)) * r)
    cu = bpy.data.curves.new('spring', 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = r * 0.22
    cu.bevel_resolution = 2
    sp = cu.splines.new('POLY')
    sp.points.add(len(pts) - 1)
    for i, p_ in enumerate(pts):
        sp.points[i].co = (*p_, 1)
    o = bpy.data.objects.new('spring', cu)
    bpy.context.collection.objects.link(o)
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.convert(target='MESH')
    o = bpy.context.active_object
    o.select_set(False)
    parts.append(finish(o, spring_m, 0, smooth=1.0))
    return parts
