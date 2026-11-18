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
