// Driving-surface realism: a per-track splat blend of two extra ground layers over the base surface
// (dirt / mud / wet sand / slush ...) and persistent tyre tracks that build up as the buggies drive.
// Layer weights are worked out on the CPU per terrain vertex (see LAYERS) and stored as a 'splat'
// attribute; the shader breaks up the edges with the layers' own baked height so they meet like real
// ground. The same weights are kept in a grid so gameplay (mud on the cars, track depth) can ask for them.
import * as THREE from 'three';
import { ASSETS } from './assets.js';

const sst = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// per track: two layers A and B over the base. tex = Blender detail/normal pair; col = sRGB tint;
// rough = roughness; wet = how much the layer's hollows hold standing water (glossy, darker).
// w(x, h, z, ny, d, n1, n2) returns 0..1 (n1 large patches, n2 small patches, d = distance from track centre)
export const LAYERS = {
  beach: {
    A: { tex: 'sand', col: 0x9f8565, rough: 0.5, wet: 0.35, w: (x, h, z, ny, d, n1, n2) => Math.max(sst(1.6, 0.15, h), sst(0.6, 0.72, n1) * 0.7 * sst(40, 14, d)) },
    B: { tex: 'dirt', col: 0xa08a6c, rough: 0.92, wet: 0, w: (x, h, z, ny, d, n1, n2) => sst(22, 9, d) * 0.75 + sst(0.66, 0.76, n2) * 0.4 },
    mark: 0xb59a76, markA: 0.85,
  },
  desert: {
    A: { tex: 'sand', col: 0xd6a46a, rough: 0.95, wet: 0, w: (x, h, z, ny, d, n1, n2) => sst(0.55, 0.68, n1) * sst(0.88, 0.97, ny) + sst(0.66, 0.74, n2) * 0.35 },
    B: { tex: 'dirt', col: 0x8f5d3c, rough: 0.9, wet: 0, w: (x, h, z, ny, d, n1, n2) => Math.max(sst(0.9, 0.74, ny), sst(20, 9, d) * 0.8) },
    mark: 0xa8714a, markA: 0.8,
  },
  country: {
    A: { tex: 'dirt', col: 0x7a5a3a, rough: 0.92, wet: 0, w: (x, h, z, ny, d, n1, n2) => Math.max(sst(24, 9.5, d) * 0.95, sst(0.62, 0.72, n1) * 0.8) * (0.6 + 0.4 * sst(0.8, 0.95, ny)) },
    B: { tex: 'mud', col: 0x47321f, rough: 0.6, wet: 0.9, w: (x, h, z, ny, d, n1, n2) => sst(0.56, 0.68, n2 * 0.6 + n1 * 0.4) * sst(50, 14, d) * sst(0.9, 0.97, ny) },
    mark: 0x6a4f36, markA: 0.85,
  },
  snow: {
    A: { tex: 'mud', col: 0x9a9890, rough: 0.55, wet: 0.5, w: (x, h, z, ny, d, n1, n2) => sst(22, 10, d) * 0.85 + sst(0.68, 0.78, n2) * 0.3 * sst(40, 15, d) },
    B: { tex: 'gravel', col: 0x5f5448, rough: 0.9, wet: 0, w: (x, h, z, ny, d, n1, n2) => Math.max(sst(0.9, 0.74, ny), sst(0.7, 0.8, n1) * 0.6) },
    mark: 0xa9b2bd, markA: 0.85,
  },
};

// ── splat grid (same resolution as the height grid) so gameplay can ask what ground a car is on ──
let SG = null;
export function setSplatGrid(grid) { SG = grid; }
/** { a, b } layer weights at a world position (0 when no grid). */
export function splatAt(x, z) {
  if (!SG) return { a: 0, b: 0 };
  const { a, b, GS, GN } = SG, cell = GS / GN, gx = Math.min(GN - 1e-3, Math.max(0, (x + GS / 2) / cell)), gz = Math.min(GN - 1e-3, Math.max(0, (z + GS / 2) / cell));
  const ix = gx | 0, iz = gz | 0, fx = gx - ix, fz = gz - iz, W = GN + 1, o = iz * W + ix;
  const L = (A) => (A[o] * (1 - fx) + A[o + 1] * fx) * (1 - fz) + (A[o + W] * (1 - fx) + A[o + W + 1] * fx) * fz;
  return { a: L(a), b: L(b) };
}

const HEAD = /* glsl */`
uniform sampler2D splatTexA, splatTexB, splatNrmA, splatNrmB, splatBaseTex; uniform vec3 splatColA, splatColB; uniform vec4 splatMat; uniform float splatBase;
varying vec2 vSplat; varying vec3 vSplatW;
`;
/**
 * Blend the track's A/B layers into a ground material (terrain or road). The geometry needs a 'splat'
 * vec2 attribute. road = true keeps the road's own map alpha and uses world-space layer UVs.
 */
export function splatMaterial(m, id, road = false) {
  const L = LAYERS[id]; if (!L || !ASSETS.ready || !ASSETS.tex[L.A.tex] || !ASSETS.tex[L.B.tex]) return m;
  const U = {
    splatTexA: { value: ASSETS.tex[L.A.tex] }, splatTexB: { value: ASSETS.tex[L.B.tex] },
    splatNrmA: { value: ASSETS.nrm[L.A.tex] }, splatNrmB: { value: ASSETS.nrm[L.B.tex] },
    splatColA: { value: new THREE.Color(L.A.col) }, splatColB: { value: new THREE.Color(L.B.col) },
    splatMat: { value: new THREE.Vector4(L.A.rough, L.B.rough, L.A.wet, L.B.wet) },
    splatBase: { value: road ? 0.75 : 1 },
  };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = 'attribute vec2 splat; varying vec2 vSplat; varying vec3 vSplatW;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      vSplat = splat; vSplatW = (modelMatrix * vec4(position, 1.0)).xyz;`);
    sh.fragmentShader = HEAD + sh.fragmentShader
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec2 sUv = vSplatW.xz / 7.0;
        float hA = (texture2D(splatTexA, sUv).r - 0.72) / 0.28, hB = (texture2D(splatTexB, sUv * 1.3).r - 0.72) / 0.28;
        // low-frequency blotches (the same detail maps sampled very large) so layer edges wander instead of following the grid
        float blot = ((texture2D(splatTexB, sUv * 0.045 + 0.31).r * 2.0 + texture2D(splatTexA, sUv * 0.11 + 0.7).r) / 3.0 - 0.72) / 0.28 - 0.5;
        float wA = smoothstep(0.42, 0.58, vSplat.x * splatBase + (hA - 0.5) * 0.35 + blot * 0.5);
        float wB = smoothstep(0.42, 0.58, vSplat.y * splatBase + (hB - 0.5) * 0.45 + blot * 0.6);
        vec3 cA = splatColA * (0.55 + 0.6 * hA), cB = splatColB * (0.55 + 0.6 * hB);
        // standing water in the hollows of wet layers
        float pudA = splatMat.z * smoothstep(0.32, 0.12, hA) * wA, pudB = splatMat.w * smoothstep(0.38, 0.14, hB) * wB;
        cA *= 1.0 - 0.45 * splatMat.z * smoothstep(0.7, 0.2, hA); cB *= 1.0 - 0.45 * splatMat.w * smoothstep(0.7, 0.2, hB);
        diffuseColor.rgb = mix(diffuseColor.rgb, cA, wA);
        diffuseColor.rgb = mix(diffuseColor.rgb, cB, wB);
        float sPud = max(pudA, pudB); diffuseColor.rgb *= 1.0 - 0.35 * sPud;`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, splatMat.x, wA); roughnessFactor = mix(roughnessFactor, splatMat.y, wB);
        roughnessFactor = mix(roughnessFactor, 0.08, sPud);`)
      .replace('#include <normal_fragment_maps>', THREE.ShaderChunk.normal_fragment_maps.replace(
        'vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;',
        `vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
         mapN = mix(mapN, texture2D(splatNrmA, sUv).xyz * 2.0 - 1.0, wA);
         mapN = mix(mapN, texture2D(splatNrmB, sUv * 1.3).xyz * 2.0 - 1.0, wB);
         mapN.xy *= 1.0 - 0.9 * sPud;`));
  };
  m.customProgramCacheKey = () => 'splat' + (road ? 'R' : 'T');
  m.needsUpdate = true;
  return m;
}

// ───────────────────────── tyre tracks ─────────────────────────
// One big ring buffer of quads; each rear wheel extends its own ribbon by a segment every SEG metres,
// so marks stay until the buffer wraps (about a lap and a half of a full field) or the race resets.
const CAP = 24000, SEG = 0.9, TREAD = 0.75;
let mesh = null, geo, pos, uv, col, next = 0, lo = Infinity, hi = -1, used = 0;
const markCol = new THREE.Color();
let markA = 0.5;

function treadTex() {
  const c = document.createElement('canvas'); c.width = 64; c.height = 128; const g = c.getContext('2d');
  g.clearRect(0, 0, 64, 128);
  // pressed groove (darker) with chevron knob prints (darkest) and a faint lighter ridge of pushed-up soil at the edges
  const band = g.createLinearGradient(0, 0, 64, 0);
  band.addColorStop(0, 'rgba(255,255,255,0)'); band.addColorStop(0.07, 'rgba(255,255,255,.35)'); band.addColorStop(0.16, 'rgba(105,105,105,.85)');
  band.addColorStop(0.84, 'rgba(105,105,105,.85)'); band.addColorStop(0.93, 'rgba(255,255,255,.35)'); band.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = band; g.fillRect(0, 0, 64, 128);
  g.fillStyle = 'rgba(45,45,45,.95)';
  for (let y = -16; y < 144; y += 32) for (const s of [-1, 1]) {
    g.beginPath(); g.moveTo(32 + s * 3, y + 6); g.lineTo(32 + s * 25, y + 14); g.lineTo(32 + s * 25, y + 24); g.lineTo(32 + s * 3, y + 16); g.closePath(); g.fill();
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = THREE.ClampToEdgeWrapping; t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
  t.userData.keep = true; return t;
}

export function initTracks(scene) {
  if (mesh) return;
  geo = new THREE.BufferGeometry();
  pos = new Float32Array(CAP * 4 * 3); uv = new Float32Array(CAP * 4 * 2); col = new Float32Array(CAP * 4 * 4);
  const idx = new Uint32Array(CAP * 6);
  for (let i = 0; i < CAP; i++) { const v = i * 4, o = i * 6; idx[o] = v; idx[o + 1] = v + 2; idx[o + 2] = v + 1; idx[o + 3] = v + 1; idx[o + 4] = v + 2; idx[o + 5] = v + 3; }
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 4).setUsage(THREE.DynamicDrawUsage));
  geo.setDrawRange(0, 0);
  const mat = new THREE.MeshStandardMaterial({ map: treadTex(), vertexColors: true, transparent: true, depthWrite: false, roughness: 0.95, metalness: 0,
    polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
  mat.userData.keep = true;
  mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; mesh.receiveShadow = true; mesh.renderOrder = 2; scene.add(mesh);
}

/** New track: forget every mark and take the track's mark colour. */
export function clearTracks(id) {
  next = 0; used = 0; lo = Infinity; hi = -1; if (geo) geo.setDrawRange(0, 0);
  const L = LAYERS[id]; markCol.set(L ? L.mark : 0x3a2c20).convertSRGBToLinear(); markA = L ? L.markA : 0.5;
}

/**
 * Extend one wheel's ribbon. w = per-wheel state object kept by the caller ({} to start);
 * (x, y, z) = contact point on the ground; (dx, dz) = unit heading; half = half tyre width;
 * k = 0..1 strength (0 breaks the ribbon, e.g. airborne or in water).
 */
export function trackMark(w, x, y, z, dx, dz, half, k) {
  if (!mesh) return;
  if (k <= 0.02) { w.has = false; return; }
  if (!w.has || Math.hypot(x - w.x, z - w.z) > 6) { Object.assign(w, { has: true, x, y, z, px: -dz * half, pz: dx * half, v: w.v || 0, k }); return; }
  const dist = Math.hypot(x - w.x, z - w.z); if (dist < SEG) return;
  const px = -(z - w.z) / dist * half, pz = (x - w.x) / dist * half;   // tyre width, across the path actually travelled
  const i = next; next = (next + 1) % CAP; used = Math.min(CAP, used + 1);
  const v = i * 4, P = v * 3, T = v * 2, C = v * 4, v1 = w.v + dist / TREAD;
  const put = (j, X, Y, Z, U, V, a) => { pos[P + j * 3] = X; pos[P + j * 3 + 1] = Y; pos[P + j * 3 + 2] = Z; uv[T + j * 2] = U; uv[T + j * 2 + 1] = V;
    col[C + j * 4] = markCol.r; col[C + j * 4 + 1] = markCol.g; col[C + j * 4 + 2] = markCol.b; col[C + j * 4 + 3] = a * markA; };
  put(0, w.x - w.px, w.y, w.z - w.pz, 0, w.v, w.k); put(1, w.x + w.px, w.y, w.z + w.pz, 1, w.v, w.k);
  put(2, x - px, y, z - pz, 0, v1, k); put(3, x + px, y, z + pz, 1, v1, k);
  Object.assign(w, { x, y, z, px, pz, v: v1 % 64, k });
  if (v1 >= 64) { uv[T + 5] -= 64; uv[T + 7] -= 64; uv[T + 1] -= 64; uv[T + 3] -= 64; }   // keep UVs small; shift the whole quad
  lo = Math.min(lo, i); hi = Math.max(hi, i);
}

/** Upload this frame's new marks. */
export function tracksTick() {
  if (!mesh || hi < 0) return;
  for (const [a, n] of [['position', 3], ['uv', 2], ['color', 4]]) {
    const at = geo.attributes[a]; at.clearUpdateRanges(); at.addUpdateRange(lo * 4 * n, (hi - lo + 1) * 4 * n); at.needsUpdate = true;
  }
  geo.setDrawRange(0, used * 6);
  lo = Infinity; hi = -1;
}
