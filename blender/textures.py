# Bakes tileable surface detail for Coral Coast Rally with Cycles: for each surface a greyscale
# detail map (multiplied over the game's vertex colours) and a tangent-space normal map.
# Procedural node height -> Cycles EMIT bake -> numpy seamless blend -> normals from height -> JPEG.
# Run: Blender -b --factory-startup -P blender/textures.py -- <out_dir>
import sys, os, math
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from common import *

out = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else '.'
reset()
RES = 512
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
sc.cycles.device = 'CPU'
sc.cycles.samples = 4
sc.render.bake.margin = 0

bpy.ops.mesh.primitive_plane_add(size=2)
plane = bpy.context.active_object


def node_graph(kind, nt):
    n, l = nt.nodes, nt.links
    tc = n.new('ShaderNodeTexCoord')

    def noise(scale, detail=4, rough=0.5, dist=0.0):
        t = n.new('ShaderNodeTexNoise')
        t.inputs['Scale'].default_value = scale
        t.inputs['Detail'].default_value = detail
        t.inputs['Roughness'].default_value = rough
        t.inputs['Distortion'].default_value = dist
        l.new(tc.outputs['UV'], t.inputs['Vector'])
        return t.outputs['Fac']

    def voronoi(scale, feature='F1', rand=1.0):
        t = n.new('ShaderNodeTexVoronoi')
        t.feature = feature
        t.inputs['Scale'].default_value = scale
        t.inputs['Randomness'].default_value = rand
        l.new(tc.outputs['UV'], t.inputs['Vector'])
        return t.outputs['Distance']

    def wave(scale, dist):
        t = n.new('ShaderNodeTexWave')
        t.wave_type = 'BANDS'
        t.bands_direction = 'Y'
        t.inputs['Scale'].default_value = scale
        t.inputs['Distortion'].default_value = dist
        t.inputs['Detail'].default_value = 3
        l.new(tc.outputs['UV'], t.inputs['Vector'])
        return t.outputs['Fac']

    def mix(a, b, f):
        m = n.new('ShaderNodeMath')
        m.operation = 'MULTIPLY_ADD'  # a*f + b
        l.new(a, m.inputs[0])
        m.inputs[1].default_value = f
        if isinstance(b, float):
            m.inputs[2].default_value = b
        else:
            l.new(b, m.inputs[2])
        return m.outputs[0]

    def ramp(x, lo, hi):
        m = n.new('ShaderNodeMapRange')
        m.inputs['From Min'].default_value = lo
        m.inputs['From Max'].default_value = hi
        l.new(x, m.inputs['Value'])
        return m.outputs['Result']

    if kind == 'sand':       # wind ripples with fine grain
        h = mix(wave(9, 7), mix(noise(160, 2), 0.0, 0.25), 0.75)
    elif kind == 'cracked':  # dry baked earth: polygons with dark cracks, pitted
        h = mix(ramp(voronoi(9, 'DISTANCE_TO_EDGE'), 0.0, 0.06), mix(noise(90, 6), 0.0, 0.3), 0.7)
    elif kind == 'grass':    # tufts and clumps
        h = mix(ramp(voronoi(70, 'F1'), 0.6, 0.0), mix(noise(30, 6, 0.6), 0.0, 0.45), 0.55)
    elif kind == 'snow':     # soft drifts with a little crust
        h = mix(noise(6, 3, 0.4), mix(noise(110, 2), 0.0, 0.12), 0.88)
    else:                    # gravel: packed pebbles in grit
        h = mix(ramp(voronoi(42, 'F1'), 0.55, 0.05), mix(noise(140, 3), 0.0, 0.35), 0.65)
    em = n.new('ShaderNodeEmission')
    l.new(h, em.inputs['Color'])
    o = n.new('ShaderNodeOutputMaterial')
    l.new(em.outputs[0], o.inputs['Surface'])


def bake(kind):
    m = bpy.data.materials.new(kind)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    node_graph(kind, nt)
    img = bpy.data.images.new(kind, RES, RES, float_buffer=True)
    it = nt.nodes.new('ShaderNodeTexImage')
    it.image = img
    nt.nodes.active = it
    plane.data.materials.clear()
    plane.data.materials.append(m)
    bpy.context.view_layer.objects.active = plane
    plane.select_set(True)
    bpy.ops.object.bake(type='EMIT')
    a = np.array(img.pixels[:], dtype=np.float32).reshape(RES, RES, 4)[:, :, 0]
    return a


def seamless(a):
    """Four-way blend of the image and its half-shifted copies. Each copy's wrap seam sits where its
    weight is zero, so the result tiles with no visible join."""
    r = a.shape[0]
    t = np.linspace(0, 1, r, endpoint=False)
    w = np.sin(np.pi * t) ** 2
    wy, wx = w[:, None], w[None, :]
    h = r // 2
    ax, ay = np.roll(a, h, 1), np.roll(a, h, 0)
    axy = np.roll(ax, h, 0)
    o = a * wx * wy + ax * (1 - wx) * wy + ay * wx * (1 - wy) + axy * (1 - wx) * (1 - wy)
    # blending flattens contrast in the overlaps; restore it locally
    return (o - o.mean()) / (np.sqrt(wx ** 2 + (1 - wx) ** 2) * np.sqrt(wy ** 2 + (1 - wy) ** 2)) + o.mean()


def save(name, rgb):
    img = bpy.data.images.new(name, RES, RES)
    px = np.ones((RES, RES, 4), dtype=np.float32)
    px[:, :, :3] = rgb
    img.pixels = px.ravel()
    sc.render.image_settings.file_format = 'JPEG'
    sc.render.image_settings.quality = 86
    sc.render.image_settings.color_mode = 'RGB'
    img.save_render(os.path.join(out, name + '.jpg'), scene=sc)


os.makedirs(out, exist_ok=True)
STRENGTH = {'sand': 3.0, 'cracked': 4.0, 'grass': 3.5, 'snow': 2.0, 'gravel': 5.0}
for kind in ('sand', 'cracked', 'grass', 'snow', 'gravel'):
    h = seamless(bake(kind))
    h = (h - h.min()) / max(1e-6, h.max() - h.min())
    # detail map: mostly bright so it only modulates the vertex colours
    d = 0.72 + 0.28 * h
    save('tex_' + kind, np.repeat(d[:, :, None], 3, 2))
    # normal map from the wrapped height gradient (OpenGL convention, +Y up)
    s = STRENGTH[kind]
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * s
    dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * s
    nrm = np.dstack([-dx, -dy, np.ones_like(h)])
    nrm /= np.linalg.norm(nrm, axis=2, keepdims=True)
    save('nrm_' + kind, nrm * 0.5 + 0.5)
    print('BAKED', kind, float(h.mean()))
