// Coral Coast Rally — the world: renderer/scene, sky + lights, and four switchable track themes
// (Coral Coast beach, Dune Run desert, Meadow Valley countryside with passing showers, Frost Peak snow mountain).
// Track data is exported as live bindings, so the game code always sees the currently built track.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { ASSETS } from './assets.js';
import { LAYERS, splatMaterial, setSplatGrid, splatAt } from './surface.js';

// ───────────────────────── helpers ─────────────────────────
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export const wrapA = (a) => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };
export function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export const rand = rng(20261117);
export const hash2 = (ix, iz) => { const n = Math.sin(ix * 127.1 + iz * 311.7) * 43758.5453; return n - Math.floor(n); };
export function vnoise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash2(ix, iz), b = hash2(ix + 1, iz), c = hash2(ix, iz + 1), d = hash2(ix + 1, iz + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x, z) { let s = 0, a = 0.5; for (let i = 0; i < 4; i++) { s += a * vnoise(x, z); x *= 2.03; z *= 2.03; a *= 0.5; } return s; }
export function canvasTex(w, h, draw, opts = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (opts.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  return t;
}
const keep = (o) => { o.userData.keep = true; return o; };

// ───────────────────────── constants ─────────────────────────
export const LAPS = 3, RW = 8, WALL = 13, MAXV = 46, ACC = 21, GRAV = 30;
export const SUN = new THREE.Vector3(0.48, 0.72, 0.38).normalize();
export const AUTO = /[?&]auto=1/.test(location.search);
const GS = 780, GN = 300, CELL = GS / GN, GW = GN + 1, EDGE = GS / 2 - 2;
const HG = new Float32Array(GW * GW), DG = new Float32Array(GW * GW);
const edgeK = (x, z) => sstep(352, 386, Math.max(Math.abs(x), Math.abs(z)));
const toEdge = (h, x, z, E) => lerp(h, E, edgeK(x, z));

// ───────────────────────── renderer / scene / sky / lights ─────────────────────────
export const canvas = document.getElementById('game');
export const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.AgXToneMapping; renderer.toneMappingExposure = 1.05;
export const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xa8d8f5, 420, 2400);
export const camera = new THREE.PerspectiveCamera(62, 1, 0.3, 7000);
export const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false,
  uniforms: { uSun: { value: SUN }, uZen: { value: new THREE.Color(0x0b52c9) }, uHor: { value: new THREE.Color(0x9fd6f7) }, uLow: { value: new THREE.Color(0.45, 0.78, 0.9) }, uSunK: { value: 1 }, uSunCol: { value: new THREE.Color(1, 0.92, 0.75) }, uGlow: { value: 1 } },
  vertexShader: `varying vec3 vDir; void main(){ vDir=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `varying vec3 vDir; uniform vec3 uSun,uZen,uHor,uLow,uSunCol; uniform float uSunK,uGlow;
    void main(){ vec3 d=normalize(vDir); float h=max(d.y,0.);
      vec3 col=mix(uHor,uZen,pow(h,0.5)); col=mix(col,uLow,smoothstep(0.,-0.25,d.y)*0.6);
      float s=max(dot(d,uSun),0.); col+=uSunK*uSunCol*(smoothstep(0.9993,0.9997,s)*14.+(pow(s,24.)*0.28+pow(s,400.)*1.2)*uGlow);
      gl_FragColor=vec4(col,1.); }`,
});
export const sky = new THREE.Mesh(new THREE.SphereGeometry(4000, 32, 16), skyMat); sky.frustumCulled = false; scene.add(sky);
// stars (night only) ride along with the sky dome
const stars = (() => { const n = 1800, p = new Float32Array(n * 3), v = new THREE.Vector3();
  for (let i = 0; i < n; i++) { do { v.set(Math.random() * 2 - 1, Math.random(), Math.random() * 2 - 1); } while (v.lengthSq() > 1 || v.y < 0.04); v.normalize().multiplyScalar(3500); p.set([v.x, v.y, v.z], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const o = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xdfe8ff, size: 2.2, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.9, depthWrite: false }));
  o.frustumCulled = false; o.visible = false; sky.add(o); return o; })();
export const hemi = new THREE.HemisphereLight(0xbfe0ff, 0xd9b26e, 0.6); scene.add(hemi);
export const sun = new THREE.DirectionalLight(0xfff0d2, 3.6); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.06;
Object.assign(sun.shadow.camera, { left: -75, right: 75, top: 75, bottom: -75, near: 1, far: 420 }); sun.shadow.camera.updateProjectionMatrix();
scene.add(sun, sun.target);
let envTex = null;
function bakeEnv() {
  const es = new THREE.Scene(); es.add(new THREE.Mesh(sky.geometry, skyMat));
  const pm = new THREE.PMREMGenerator(renderer); const t = pm.fromScene(es, 0, 1, 6000).texture; pm.dispose();
  if (envTex) envTex.dispose(); envTex = t; scene.environment = t;
}

// ───────────────────────── shared materials / textures ─────────────────────────
export const sandTex = keep(canvasTex(256, 256, (g, w, h) => {
  const id = g.createImageData(w, h);
  for (let i = 0; i < w * h; i++) { const v = 215 + Math.random() * 40; id.data[i * 4] = v; id.data[i * 4 + 1] = v; id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = 255; }
  g.putImageData(id, 0, 0);
  g.globalAlpha = 0.06; g.strokeStyle = '#765'; g.lineWidth = 3;
  for (let k = 0; k < 26; k++) { const y = k * 10 + 3; g.beginPath(); for (let x = 0; x <= w; x += 8) g.lineTo(x, y + Math.sin(x / w * Math.PI * 4 + k) * 2.5); g.stroke(); }
}, { repeat: true }));
export const waterMat = keep(new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, fog: true,
  uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
    uTime: { value: 0 }, uSun: { value: SUN }, uShallow: { value: new THREE.Color(0x58f0dc) }, uMid: { value: new THREE.Color(0x12c2cf) },
    uDeep: { value: new THREE.Color(0x0a5fb8) }, uSky: { value: new THREE.Color(0xa9dcff) }, uRain: { value: 0 },
  }]),
  vertexShader: `attribute float aDepth; uniform float uTime; varying float vDepth; varying vec3 vWorld;
    #include <fog_pars_vertex>
    void main(){ vDepth=aDepth; vec3 p=position; float k=clamp(-aDepth/3.,0.,1.);
      p.y+=(sin(p.x*0.07+uTime*1.1)+sin(p.z*0.09-uTime*0.9))*0.09*k;
      vec4 wp=modelMatrix*vec4(p,1.); vWorld=wp.xyz; vec4 mvPosition=viewMatrix*wp; gl_Position=projectionMatrix*mvPosition;
      #include <fog_vertex>
    }`,
  fragmentShader: `uniform float uTime,uRain; uniform vec3 uSun,uShallow,uMid,uDeep,uSky; varying float vDepth; varying vec3 vWorld;
    #include <fog_pars_fragment>
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    void main(){ float d=clamp(-vDepth,0.,8.); vec2 uv=vWorld.xz; float t=uTime;
      vec2 g=0.10*vec2(cos(uv.x*0.35+t*1.3),cos(uv.y*0.4-t*1.1));
      g+=0.08*vec2(cos(uv.x*0.9-uv.y*0.6+t*1.9),cos(uv.y*1.1+uv.x*0.5-t*1.6));
      g+=0.06*vec2(cos(uv.x*2.3+uv.y*1.7+t*2.6),cos(uv.y*2.7-uv.x*1.3+t*2.2));
      g+=0.10*(vec2(noise(uv*0.8+t*0.5),noise(uv*0.8-t*0.5+7.))-0.5);
      g+=uRain*0.35*(vec2(noise(uv*6.+t*9.),noise(uv*6.-t*8.+3.))-0.5);
      vec3 n=normalize(vec3(-g.x,1.,-g.y)); vec3 v=normalize(cameraPosition-vWorld);
      float fres=pow(1.-max(dot(n,v),0.),4.);
      vec3 col=mix(uShallow,uMid,smoothstep(0.1,1.8,d)); col=mix(col,uDeep,smoothstep(1.4,6.5,d));
      float ca=noise(uv*0.9+vec2(t*0.6,-t*0.4))*noise(uv*1.7-vec2(t*0.5,t*0.7));
      col+=vec3(0.35,0.42,0.3)*ca*(1.-smoothstep(0.,3.5,d))*(1.-uRain);
      col=mix(col,uSky,fres*0.7);
      float spec=pow(max(dot(n,normalize(v+uSun)),0.),260.); col+=vec3(1.,.95,.8)*spec*3.*(1.-uRain*0.8);
      float fn=noise(uv*0.35+vec2(t*0.25,0.));
      float line=0.16+0.14*sin(t*1.3+fn*6.283);
      float foam=(1.-smoothstep(line,line+0.16,d))+(1.-smoothstep(0.,0.12,abs(d-0.55-0.25*sin(t*0.9+fn*9.))))*0.55;
      foam*=0.55+0.45*noise(uv*2.6+t*0.4); foam=clamp(foam,0.,1.)*step(0.004,d);
      col=mix(col,vec3(1.),foam);
      float a=max(max(mix(0.42,0.95,smoothstep(0.,2.6,d)),foam),fres);
      gl_FragColor=vec4(col,a);
      #include <fog_fragment>
    }`,
}));
export const padTex = keep(canvasTex(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(20,120,255,.55)'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = 12; g.lineJoin = 'miter';
  for (let k = -1; k < 3; k++) { g.beginPath(); g.moveTo(14, k * 64 + 10); g.lineTo(64, k * 64 + 48); g.lineTo(114, k * 64 + 10); g.stroke(); } }, { repeat: true }));
const coinGeo = keep(new THREE.CylinderGeometry(0.85, 0.85, 0.16, 22)); coinGeo.rotateX(Math.PI / 2);
const coinMat = keep(new THREE.MeshStandardMaterial({ color: 0xffc21a, metalness: 1, roughness: 0.22, emissive: 0xff9a00, emissiveIntensity: 0.55 }));

// ───────────────────────── live track data (rebuilt by buildWorld) ─────────────────────────
export let theme = null, TRACK_LEN = 0, N = 0, SP = 1;
export let TX, TZ, TY, HD, NX, NZ, VC, CURV;
export let pads = [], coins = [], coinMesh = null;
export function nearestIdx(x, z, hint = -1, range = 40) {
  let best = 0, bd = 1e18;
  if (hint < 0) {
    for (let i = 0; i < N; i += 6) { const dx = x - TX[i], dz = z - TZ[i], d = dx * dx + dz * dz; if (d < bd) { bd = d; best = i; } }
    hint = best; range = 6;
  }
  for (let k = -range; k <= range; k++) { const i = (hint + k + N) % N, dx = x - TX[i], dz = z - TZ[i], d = dx * dx + dz * dz; if (d < bd) { bd = d; best = i; } }
  return best;
}
function gridS(A, x, z) {
  const fx = clamp((x + GS / 2) / CELL, 0, GN - 1e-3), fz = clamp((z + GS / 2) / CELL, 0, GN - 1e-3);
  const ix = fx | 0, iz = fz | 0, u = fx - ix, v = fz - iz, o = iz * GW + ix;
  return (A[o] * (1 - u) + A[o + 1] * u) * (1 - v) + (A[o + GW] * (1 - u) + A[o + GW + 1] * u) * v;
}
export const groundH = (x, z) => gridS(HG, x, z), trackDist = (x, z) => gridS(DG, x, z);

// ───────────────────────── geometry helpers ─────────────────────────
export const dummy = new THREE.Object3D(), tmpC = new THREE.Color();
let W = null; // the current world group
const anim = [];
export function instanced(geo, mat, list, shadow = true) {
  if (geo.attributes.color && !mat.vertexColors) mat.vertexColors = true; // Blender props carry baked colour/dirt
  const m = new THREE.InstancedMesh(geo, mat, Math.max(1, list.length)); m.count = list.length;
  list.forEach((it, i) => {
    dummy.position.set(it.x, it.y, it.z); dummy.rotation.set(it.rx || 0, it.ry || 0, it.rz || 0);
    if (it.s && it.s.length) dummy.scale.set(it.s[0], it.s[1], it.s[2]); else dummy.scale.setScalar(it.s || 1);
    dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); if (it.c !== undefined) m.setColorAt(i, tmpC.set(it.c));
  });
  m.castShadow = shadow; m.receiveShadow = true; W.add(m); return m;
}
// Blender-made prop geometry when loaded (see src/assets.js), else null so callers fall back to procedural shapes
const AP = (n) => (ASSETS.ready && ASSETS.props[n]) || null;
const rockA = (detail, amp, seed) => { const g = AP(detail >= 2 ? 'rock_big' : 'rock_small'); if (!g) return rockGeo(detail, amp, seed); const c = g.clone(); c.userData = {}; return c; };
const SURF = { beach: 'sand', desert: 'cracked', country: 'grass', snow: 'snow' };
function detailMaps(m, id, nscale = 0.7) { const s = SURF[id]; if (!ASSETS.ready || !s) return; m.map = ASSETS.tex[s]; m.normalMap = ASSETS.nrm[s]; m.normalScale.set(nscale, nscale); m.needsUpdate = true; }
export function rockGeo(detail, amp, seed = 0) {
  const g = new THREE.IcosahedronGeometry(1, detail), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + (fbm(x * 1.7 + z * 0.9 + 3 + seed, y * 1.7 - z * 0.6 + 8) - 0.47) * amp; p.setXYZ(i, x * k, y * k, z * k); }
  g.computeVertexNormals(); return g;
}
const std = (o) => new THREE.MeshStandardMaterial(Object.assign({ roughness: 0.9 }, o));
const cylBetween = (a, b, r, seg = 7) => { const d = new THREE.Vector3().subVectors(b, a), g = new THREE.CylinderGeometry(r, r, d.length(), seg);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); g.applyQuaternion(q); g.translate(a.x + d.x / 2, a.y + d.y / 2, a.z + d.z / 2); return g; };
const vcol = (g, fn) => { const p = g.attributes.position, n = g.attributes.normal, col = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) { fn(c, p.getX(i), p.getY(i), p.getZ(i), n ? n.getY(i) : 1); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); return g; };
const prism = (r, len) => { const g = new THREE.CylinderGeometry(r, r, len, 3, 1, false, Math.PI / 2); g.rotateZ(Math.PI / 2); return g; }; // roof: apex up, ridge along x
function group(x, y, z, ry, ...meshes) { const G = new THREE.Group(); G.add(...meshes); G.position.set(x, y, z); G.rotation.y = ry; G.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; }); W.add(G); return G; }
const mesh = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); return m; };
// scatter n items: test(x, z, h, d) returns an instance descriptor or null
function scatter(rnd, n, half, test, tries = 40000) { const out = []; let g = 0;
  while (out.length < n && g++ < tries) { const x = (rnd() - 0.5) * half * 2, z = (rnd() - 0.5) * half * 2, it = test(x, z, groundH(x, z), trackDist(x, z)); if (it) out.push(it); } return out; }
const flatEnough = (x, z, h, lim = 2.6) => Math.abs(groundH(x + 3, z) - h) + Math.abs(groundH(x, z + 3) - h) < lim;
function addArch(i, R, tubeR, rockCol, topCol) {
  const g = new THREE.TorusGeometry(R, tubeR, 12, 30, Math.PI), p = g.attributes.position, nr = g.attributes.normal, col = new Float32Array(p.count * 3);
  const rc = new THREE.Color(rockCol), gc = new THREE.Color(topCol), c = new THREE.Color();
  for (let k = 0; k < p.count; k++) {
    const x = p.getX(k), y = p.getY(k), z = p.getZ(k), f = (fbm(x * 0.16 + z * 0.3 + i, y * 0.16 - z * 0.2) - 0.5) * 5.5, base = 1 + sstep(9, 0, y) * 0.5;
    p.setXYZ(k, x + nr.getX(k) * (f + (base - 1) * 4), y + nr.getY(k) * f * 0.8, (z + nr.getZ(k) * f) * 1.5 * base);
    c.copy(rc).multiplyScalar(0.8 + fbm(x * 0.4, y * 0.4) * 0.5).lerp(gc, sstep(0.45, 0.8, nr.getY(k)) * sstep(R * 0.7, R, y));
    col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals();
  const m = new THREE.Mesh(g, std({ vertexColors: true, roughness: 0.92, flatShading: true }));
  m.position.set(TX[i], TY[i] - 3.5, TZ[i]); m.rotation.y = HD[i]; m.castShadow = m.receiveShadow = true; W.add(m);
}
function palmParts(rnd) {
  const trunk = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, -0.6, 0), new THREE.Vector3(0.5, 4, 0), new THREE.Vector3(1.5, 7.6, 0)), 8, 0.27, 6);
  const frond = (len, wid) => { const g = new THREE.PlaneGeometry(wid, len, 2, 6), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), t = (p.getY(i) + len / 2) / len; p.setXYZ(i, t * len * 0.92, Math.sin(t * 2.2) * 1.3 - t * t * 2.7 - Math.abs(x) * 0.4, x); }
    return g; };
  const fr = [];
  for (let k = 0; k < 9; k++) { const g = frond(4.6, 1.7); g.rotateZ((rnd() - 0.5) * 0.35); g.rotateY(k / 9 * Math.PI * 2 + rnd() * 0.3); g.translate(1.5, 7.5, 0); fr.push(g); }
  for (let k = 0; k < 5; k++) { const g = frond(3.4, 1.4); g.rotateZ(0.55); g.rotateY(k / 5 * Math.PI * 2 + 0.4); g.translate(1.5, 7.6, 0); fr.push(g); }
  const leaf = mergeGeometries(fr); leaf.computeVertexNormals();
  const leafTex = canvasTex(64, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.lineCap = 'round';
    for (let y = h - 4; y > 4; y -= 5) { const t = 1 - y / h, sp = 29 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.9 + 0.1)), 0.5);
      g.strokeStyle = `hsl(${105 + Math.random() * 20},${55 + Math.random() * 15}%,${27 + Math.random() * 14}%)`; g.lineWidth = 4.2;
      g.beginPath(); g.moveTo(32, y); g.lineTo(32 - sp, y - 13); g.moveTo(32, y); g.lineTo(32 + sp, y - 13); g.stroke(); }
    g.strokeStyle = '#6f8a2c'; g.lineWidth = 3; g.beginPath(); g.moveTo(32, h); g.lineTo(32, 6); g.stroke();
  });
  return { trunk, leaf, trunkMat: std({ color: 0x9a7350, roughness: 0.95 }), leafMat: std({ map: leafTex, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.75 }) };
}
function placePalms(P, list) { const g = AP('palm'); if (g) { instanced(g, std({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.8 }), list); return; } instanced(P.trunk, P.trunkMat, list); instanced(P.leaf, P.leafMat, list); }
const polarPts = (cp) => cp.map(([a, r]) => { const th = a * Math.PI / 180; return new THREE.Vector3(Math.cos(th) * r, 0, Math.sin(th) * r); });
// far-off ground so the land doesn't end at the edge of the height grid
function outerGround(h, col) {
  const m = std({ color: col, map: sandTex, roughness: 1 }); m.map = sandTex; detailMaps(m, theme && theme.id, 0.5);
  for (const [x0, x1, z0, z1] of [[-6000, 6000, EDGE, 6000], [-6000, 6000, -6000, -EDGE], [-6000, -EDGE, -EDGE, EDGE], [EDGE, 6000, -EDGE, EDGE]]) {
    const g = new THREE.PlaneGeometry(x1 - x0, z1 - z0); g.rotateX(-Math.PI / 2);
    const o = mesh(g, m, (x0 + x1) / 2, h - 0.02, (z0 + z1) / 2); o.receiveShadow = true; W.add(o); }
}
// distant ring of big shapes that hide the horizon
function backdrop(rnd, n, geo, mat, rMin, rMax, y, sMin, sMax, hMin, hMax, colFn) {
  const list = []; for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2 + rnd() * 0.2, r = rMin + rnd() * (rMax - rMin), s = sMin + rnd() * (sMax - sMin);
    list.push({ x: Math.cos(a) * r, y, z: Math.sin(a) * r, ry: rnd() * 6, s: [s, hMin + rnd() * (hMax - hMin), s * (0.7 + rnd() * 0.5)], c: colFn ? colFn(rnd) : undefined }); }
  const m = instanced(geo, mat, list, false); m.receiveShadow = false; return m;
}

// ───────────────────────── themes ─────────────────────────
const shoreR = (th) => 235 + 22 * Math.sin(3 * th + 0.8) + 12 * Math.sin(5 * th + 2.1) + 8 * Math.sin(2 * th);
const BEACH_CP = [[0, 16], [20, 14], [40, 18], [58, -12], [74, -16], [90, -6], [104, 30], [112, 80], [128, 108], [150, 94], [160, 50],
  [172, 16], [195, 12], [215, -10], [232, -14], [248, 20], [256, 70], [250, 115], [266, 132], [284, 100], [292, 50], [305, 16], [330, 14]];
const beachPt = (deg, d) => { const th = deg * Math.PI / 180, r = shoreR(th) - d; return [Math.cos(th) * r, Math.sin(th) * r]; };
let iceC = null;
const SNOW_CP = [[0, 215], [25, 250], [40, 262], [50, 315], [62, 318], [72, 285], [82, 250], [95, 220], [112, 178], [135, 168], [160, 188], [180, 235], [205, 280], [230, 265], [250, 215], [268, 182], [290, 172], [315, 190], [340, 200]];

export const THEMES = {
  beach: {
    id: 'beach', name: 'Coral Coast', icon: '🏝️', sub: 'Tropical island', banner: 'CORAL COAST', seed: 11,
    sky: [0x0b52c9, 0x9fd6f7, 0x73c7e6], fog: [0xa8d8f5, 420, 2400], hemi: [0xbfe0ff, 0xd9b26e, 0.6], sun: [0xfff0d2, 3.6], exposure: 1.05, env: 0.55,
    clouds: 22, cloudCol: [0xffffff, 0x9fb6cc], water: [0x58f0dc, 0x12c2cf, 0x0a5fb8, 0xa9dcff], ocean: true,
    road: ['#d2a96a', '#8a6436', '#f1d59c'], dust: [0.9, 0.87, 0.82], grip: 1, gate: 0x1668ff,
    cpts: () => polarPts(BEACH_CP.map(([a, d]) => [a, shoreR(a * Math.PI / 180) - d])),
    baseH(x, z) {
      const r = Math.hypot(x, z), th = Math.atan2(z, x), d = shoreR(th) - r;
      if (d < 0) return Math.max(-8, d * 0.085) + 0.25 * (vnoise(x * 0.05, z * 0.05) - 0.5);
      const beach = Math.min(d, 45) * 0.035 + 0.35 * fbm(x * 0.06, z * 0.06) * sstep(4, 20, d);
      return beach + sstep(38, 130, d) * (9 + 36 * fbm(x * 0.012 + 5, z * 0.012 + 9)) + 26 * sstep(150, 235, d);
    },
    paint(C, x, h, z, ny, d) {
      const sand = 0xf0cf8a, n = fbm(x * 0.03 + 40, z * 0.03 + 12);
      C.set(sand).multiplyScalar(0.93 + 0.14 * vnoise(x * 0.11, z * 0.11));
      if (h < 0.45) C.lerp(tmpC.set(0xc39c62), 1 - sstep(-0.1, 0.45, h));
      if (h < -0.3) C.lerp(tmpC.set(0xe9dcae), sstep(-0.3, -2.5, h) * 0.9);
      const gAmt = sstep(2.0 + n * 2.2, 4.2 + n * 2.2, h) * sstep(RW + 6, RW + 16, d);
      if (gAmt > 0) { C.lerp(tmpC.set(0x4fae2a), gAmt); C.lerp(tmpC.set(0x2c7d34), gAmt * sstep(0.35, 0.7, fbm(x * 0.05, z * 0.05))); }
      if (h > 1.5) C.lerp(tmpC.set(0x8f7d6b), sstep(0.86, 0.68, ny));
    },
    scenery(rnd) {
      const P = palmParts(rnd);
      placePalms(P, scatter(rnd, 300, 330, (x, z, h, d) => (d < 17.5 || h < 0.75 || h > 26 || (d > 70 && rnd() < 0.72) || !flatEnough(x, z, h)) ? null
        : { x, y: h, z, ry: rnd() * 6.3, rx: (rnd() - 0.5) * 0.12, rz: (rnd() - 0.5) * 0.12, s: 0.85 + rnd() * 0.75 }));
      instanced(rockA(1, 0.5), std({ color: 0xffffff, flatShading: true }), scatter(rnd, 420, 310, (x, z, h, d) => { if (d < 19 || h < 3) return null; const s = 1.4 + rnd() * 2.6;
        return { x, y: h + s * 0.25, z, ry: rnd() * 6, s: [s, s * (0.6 + rnd() * 0.4), s], c: new THREE.Color().setHSL(0.27 + rnd() * 0.08, 0.6, 0.24 + rnd() * 0.14) }; }));
      const rocks = scatter(rnd, 150, 320, (x, z, h, d) => { if (d < 16 || d > 48 || h < -1.2) return null; const s = 0.7 + rnd() * rnd() * 3.4;
        return { x, y: h + s * 0.2, z, ry: rnd() * 6, rx: rnd(), s: [s * (0.8 + rnd() * 0.6), s * (0.6 + rnd() * 0.5), s], c: new THREE.Color().setHSL(0.07 + rnd() * 0.03, 0.14, 0.42 + rnd() * 0.16) }; });
      const caps = [];
      for (let k = 0; k < 16; k++) {
        const th = rnd() * Math.PI * 2, r = shoreR(th) + 48 + rnd() * 120, x = Math.cos(th) * r, z = Math.sin(th) * r, s = 7 + rnd() * 13, sy = s * (1.1 + rnd() * 1.1);
        rocks.push({ x, y: sy * 0.25, z, ry: rnd() * 6, s: [s, sy, s * (0.8 + rnd() * 0.4)], c: new THREE.Color().setHSL(0.075, 0.2, 0.5 + rnd() * 0.1) });
        caps.push({ x, y: sy * 1.12, z, ry: rnd() * 6, s: [s * 0.78, s * 0.22, s * 0.7], c: 0x58ad3c });
      }
      instanced(rockA(2, 0.7), std({ color: 0xffffff, flatShading: true }), rocks);
      instanced(rockGeo(1, 0.3), std({ color: 0xffffff, flatShading: true }), caps);
      const UC = [0xff4a5c, 0xffc83a, 0x22b8ee, 0xff7ad1, 0xffffff, 0x44d07a];
      const umb = scatter(rnd, 46, 310, (x, z, h, d) => (d < 17 || d > 40 || h < 0.5 || h > 1.9) ? null : { x, y: h, z, ry: rnd() * 6, rz: (rnd() - 0.5) * 0.3, s: 1 + rnd() * 0.3, c: UC[rnd() * UC.length | 0] });
      const cone = new THREE.ConeGeometry(2, 0.8, 12); cone.translate(0, 2.6, 0);
      const pole = new THREE.CylinderGeometry(0.05, 0.05, 2.7, 6); pole.translate(0, 1.3, 0);
      instanced(cone, std({ color: 0xffffff, roughness: 0.6, side: THREE.DoubleSide }), umb);
      instanced(pole, std({ color: 0xeeeeee, roughness: 0.4 }), umb);
      const at = (deg, d) => nearestIdx(...beachPt(deg, d));
      addArch(at(128, 108), 22, 6, 0xa08a72, 0x58ad3c); addArch(at(224, -12), 23, 6.5, 0xa08a72, 0x58ad3c); addArch(at(66, -14), 23, 6, 0xa08a72, 0x58ad3c);
      { // lighthouse
        const [x, z] = beachPt(-16, -42);
        const base = mesh(rockA(2, 0.6), std({ color: 0x94826f, flatShading: true }), 0, -1, 0); base.scale.set(17, 8, 15);
        const stripes = canvasTex(8, 64, (g) => { for (let k = 0; k < 4; k++) { g.fillStyle = k % 2 ? '#fff' : '#e8323c'; g.fillRect(0, k * 16, 8, 16); } });
        group(x, 0, z, 0, base, mesh(new THREE.CylinderGeometry(1.9, 3.1, 20, 20), std({ map: stripes, roughness: 0.55 }), 0, 15.5, 0),
          mesh(new THREE.CylinderGeometry(2.9, 2.6, 0.6, 20), std({ color: 0x24303d, roughness: 0.5 }), 0, 25.8, 0),
          mesh(new THREE.CylinderGeometry(1.5, 1.5, 2.6, 12), glow(std({ color: 0xfff3b0, emissive: 0xffd76a, emissiveIntensity: 2.5 }), 2.5, 6), 0, 27.4, 0),
          mesh(new THREE.ConeGeometry(2.2, 2.4, 12), std({ color: 0xe8323c, roughness: 0.5 }), 0, 29.9, 0));
      }
      const wood = std({ color: 0xc08a52, roughness: 0.85 }), dark = std({ color: 0x7a5232 }), thatch = std({ color: 0xe2bc62, roughness: 1, flatShading: true });
      const hut = (x, z, ry) => { const rf = mesh(new THREE.ConeGeometry(5, 3.2, 4), thatch, 0, 6, 0); rf.rotation.y = Math.PI / 4;
        const legs = [[-3, -3], [3, -3], [-3, 3], [3, 3]].map(([a, b]) => mesh(new THREE.CylinderGeometry(0.18, 0.18, 6, 6), dark, a, -1.2, b));
        group(x, 0, z, ry, mesh(new THREE.BoxGeometry(7, 0.3, 7), dark, 0, 1.7, 0), mesh(new THREE.BoxGeometry(5, 2.6, 5), wood, 0, 3.15, 0), rf, ...legs); };
      for (const [deg, d] of [[58, -12], [78, -14], [232, -14], [212, -10]]) { const i0 = at(deg, d);
        for (let k = 0; k < 3; k++) { const i = (i0 + k * 11) % N, side = Math.sign(NX[i] * TX[i] + NZ[i] * TZ[i]) || 1, lat = side * (25 + (k % 2) * 7); hut(TX[i] + NX[i] * lat, TZ[i] + NZ[i] * lat, HD[i] + rnd()); } }
      for (let k = 0; k < 7; k++) { const a = rnd() * 6.3, r = 480 + rnd() * 500;
        const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute([0, 1.5, 4, 0, 1.5, -4, 0, 17, -1], 3)); sg.computeVertexNormals();
        group(Math.cos(a) * r, 0, Math.sin(a) * r, rnd() * 6, mesh(new THREE.BoxGeometry(3, 1.6, 11), std({ color: 0xffffff }), 0, 0.5, 0),
          mesh(sg, new THREE.MeshBasicMaterial({ color: [0xffffff, 0xff5a6a, 0xffd04a][k % 3], side: THREE.DoubleSide }))); }
    },
  },

  desert: {
    id: 'desert', name: 'Dune Run', icon: '🌵', sub: 'Desert canyons', banner: 'DUNE RUN', seed: 23,
    sky: [0x2f6fd0, 0xf6d8aa, 0xe8b583], fog: [0xf3cf9c, 300, 1900], hemi: [0xffe4c0, 0xc7804a, 0.65], sun: [0xffe6bf, 4.2], exposure: 1.0, env: 0.5,
    clouds: 7, cloudCol: [0xfff6ea, 0xd8b890], water: [0x6ff0cf, 0x16b3a6, 0x0d6f8a, 0xbfe6ff], ocean: false, edgeH: 4, edgeCol: 0xe7a65c,
    road: ['#b9773f', '#7a4a22', '#e0a768'], dust: [0.93, 0.72, 0.5], grip: 0.97, gate: 0xe8642a,
    cpts: () => polarPts([[0, 250], [22, 272], [45, 245], [65, 185], [82, 155], [102, 175], [122, 240], [138, 262], [147, 312], [159, 316], [168, 285], [175, 240], [188, 195], [205, 165], [226, 200], [250, 262], [275, 282], [298, 240], [316, 180], [334, 170], [350, 215]]),
    baseH(x, z) {
      const r = Math.hypot(x, z);
      let h = 2.5 + 6 * Math.pow(Math.abs(Math.sin(x * 0.016 + z * 0.007 + 5 * fbm(x * 0.005 + 3, z * 0.005))), 1.6) + 3 * fbm(x * 0.02, z * 0.02);
      h += 20 * sstep(0.6, 0.8, fbm(x * 0.006 + 20, z * 0.006 - 4));
      h = lerp(h, -2.8, sstep(60, 24, r)); // oasis
      return toEdge(h, x, z, this.edgeH);
    },
    paint(C, x, h, z, ny, d) {
      C.set(0xeaaa5e).multiplyScalar(0.9 + 0.18 * vnoise(x * 0.09, z * 0.09));
      C.lerp(tmpC.set(0xd08440), 0.5 * sstep(0.45, 0.75, fbm(x * 0.02 + 7, z * 0.02)));
      if (h > 6) C.lerp(tmpC.set(0xb4572f), sstep(0.88, 0.7, ny));
      const r = Math.hypot(x, z);
      if (r < 85) { C.lerp(tmpC.set(0xc39c62), sstep(1.2, 0.2, h)); C.lerp(tmpC.set(0x6fa83a), sstep(85, 55, r) * sstep(0.3, 1.4, h) * 0.85); }
      C.lerp(tmpC.set(this.edgeCol), edgeK(x, z));
    },
    scenery(rnd) {
      // saguaro cacti
      const V = (x, y, z) => new THREE.Vector3(x, y, z), sph = (r, x, y, z) => { const g = new THREE.SphereGeometry(r, 8, 6); g.translate(x, y, z); return g; };
      const cact = AP('cactus') || mergeGeometries([cylBetween(V(0, -0.5, 0), V(0, 6, 0), 0.48, 9), sph(0.48, 0, 6, 0), cylBetween(V(0, 2.4, 0), V(1.3, 2.4, 0), 0.32), cylBetween(V(1.3, 2.4, 0), V(1.3, 4.6, 0), 0.32), sph(0.32, 1.3, 4.6, 0),
        cylBetween(V(0, 3.2, 0), V(-1.1, 3.2, 0), 0.3), cylBetween(V(-1.1, 3.2, 0), V(-1.1, 5.1, 0), 0.3), sph(0.3, -1.1, 5.1, 0)].map(g => g.toNonIndexed ? (g.index ? g.toNonIndexed() : g) : g));
      instanced(cact, std({ color: 0xffffff, roughness: 0.8 }), scatter(rnd, 140, 340, (x, z, h, d) => (d < 18 || Math.hypot(x, z) < 70 || !flatEnough(x, z, h, 4)) ? null
        : { x, y: h, z, ry: rnd() * 6, s: 0.7 + rnd() * 0.7, c: new THREE.Color().setHSL(0.3 + rnd() * 0.04, 0.45, 0.32 + rnd() * 0.08) }));
      instanced(rockA(1, 0.6), std({ color: 0xffffff, flatShading: true }), scatter(rnd, 260, 340, (x, z, h, d) => { if (d < 16) return null; const s = 0.5 + rnd() * 0.9;
        return { x, y: h + s * 0.3, z, ry: rnd() * 6, s: [s * 1.3, s * 0.8, s * 1.3], c: new THREE.Color().setHSL(0.13 + rnd() * 0.05, 0.35, 0.3 + rnd() * 0.1) }; }));
      instanced(rockA(2, 0.7), std({ color: 0xffffff, flatShading: true }), scatter(rnd, 160, 330, (x, z, h, d) => { if (d < 15 || d > 55) return null; const s = 0.8 + rnd() * rnd() * 4;
        return { x, y: h + s * 0.15, z, ry: rnd() * 6, rx: rnd(), s: [s * (0.8 + rnd() * 0.6), s * (0.5 + rnd() * 0.5), s], c: new THREE.Color().setHSL(0.04 + rnd() * 0.03, 0.45, 0.38 + rnd() * 0.12) }; }));
      // mesas with strata
      const mg = new THREE.CylinderGeometry(1, 1.22, 1, 11, 6); { const p = mg.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + (fbm(x * 2 + 4, z * 2 + y) - 0.5) * 0.35; p.setXYZ(i, x * k, y, z * k); } mg.translate(0, 0.5, 0); mg.computeVertexNormals(); }
      vcol(mg, (c, x, y) => c.set(0xc4643a).lerp(tmpC.set(0xe7a06a), (Math.sin(y * 22) * 0.5 + 0.5) * 0.45).lerp(tmpC.set(0x8d3f24), sstep(0.3, 0, y) * 0.5));
      const mm = std({ vertexColors: true, flatShading: true });
      instanced(mg, mm, scatter(rnd, 9, 330, (x, z, h, d) => { if (d < 55 || Math.hypot(x, z) < 90) return null; const s = 14 + rnd() * 18; return { x, y: h - 2, z, ry: rnd() * 6, s: [s, 16 + rnd() * 22, s * (0.7 + rnd() * 0.5)] }; }));
      backdrop(rnd, 30, mg, mm, 520, 1500, this.edgeH - 3, 50, 130, 40, 130);
      // oasis
      const P = palmParts(rnd), ring = [];
      for (let k = 0; k < 16; k++) { const a = k / 16 * 6.283 + rnd() * 0.3, r = 44 + rnd() * 22, x = Math.cos(a) * r, z = Math.sin(a) * r; ring.push({ x, y: groundH(x, z), z, ry: rnd() * 6.3, rx: (rnd() - 0.5) * 0.15, rz: (rnd() - 0.5) * 0.15, s: 0.8 + rnd() * 0.6 }); }
      placePalms(P, ring);
      // a couple of canvas tents by the oasis
      for (let k = 0; k < 3; k++) { const a = 0.6 + k * 2.1, x = Math.cos(a) * 70, z = Math.sin(a) * 70;
        group(x, groundH(x, z), z, a, mesh(new THREE.ConeGeometry(4, 4.2, 4), std({ color: [0xf5e6c8, 0xd9563a, 0xf2c14e][k], flatShading: true }), 0, 2.1, 0)); }
      addArch(Math.round(N * 0.28), 23, 6.5, 0xb85a33, 0xe2a066); addArch(Math.round(N * 0.71), 22, 6, 0xb85a33, 0xe2a066);
    },
  },

  country: {
    id: 'country', name: 'Meadow Valley', icon: '🌧️', sub: 'Countryside · passing showers', banner: 'MEADOW VALLEY', seed: 37,
    sky: [0x2d74d6, 0xbfe3f7, 0x8fb980], fog: [0xbfdcef, 320, 2000], hemi: [0xcfe6ff, 0x6a8a3a, 0.65], sun: [0xfff2da, 3.4], exposure: 1.02, env: 0.55,
    clouds: 30, cloudCol: [0xffffff, 0xa9b9c9], water: [0x86c9b4, 0x3f8f8a, 0x2a5f70, 0xbcd6e6], ocean: false, edgeH: 12, edgeCol: 0x5a9e3a,
    road: ['#8d6b48', '#5a3f26', '#b08a60'], dust: [0.55, 0.45, 0.32], grip: 1, gate: 0x2f9e44, weather: 'rain',
    rainSky: [0x5a6673, 0x9ea8b2, 0x6f7f6c], rainFog: [0x8f9aa5, 40, 650],
    cpts: () => polarPts([[0, 240], [20, 265], [42, 255], [60, 205], [74, 152], [92, 130], [112, 152], [128, 215], [148, 268], [172, 272], [194, 225], [210, 172], [228, 158], [248, 198], [268, 250], [282, 262], [292, 312], [304, 318], [314, 290], [324, 252], [338, 232]]),
    river: (x, z) => Math.abs(z - (60 * Math.sin(x * 0.0085 + 0.6) + 25 * Math.sin(x * 0.023 + 2)) + 20),
    baseH(x, z) {
      let h = 2 + 18 * fbm(x * 0.0065 + 11, z * 0.0065 + 3) - 5 + 7 * sstep(0.55, 0.75, fbm(x * 0.004, z * 0.004 + 9));
      h = lerp(h, -2.0, sstep(26, 7, this.river(x, z)));
      return toEdge(h, x, z, this.edgeH);
    },
    paint(C, x, h, z, ny, d) {
      C.set(0x5fae3c).multiplyScalar(0.88 + 0.2 * vnoise(x * 0.1, z * 0.1));
      C.lerp(tmpC.set(0x3f8a2e), 0.6 * sstep(0.4, 0.7, fbm(x * 0.03 + 3, z * 0.03)));
      // patchwork fields away from the track
      const fx = Math.floor((x + 13) / 62), fz = Math.floor((z - 7) / 48), f = hash2(fx, fz), far = sstep(RW + 10, RW + 22, d) * sstep(4, 1.2, this.river(x, z) / 8);
      if (f < 0.22) C.lerp(tmpC.set(0xd9c25e).multiplyScalar(0.92 + 0.12 * Math.sin(x * 1.6)), far * 0.85);
      else if (f < 0.34) C.lerp(tmpC.set(0x8a6a42).multiplyScalar(0.9 + 0.15 * Math.sin((x + z) * 1.4)), far * 0.85);
      else if (f < 0.45) C.lerp(tmpC.set(0x86c34a), far * 0.6);
      if (h < 0.9) C.lerp(tmpC.set(0x7a6040), sstep(0.9, -0.2, h));
      C.lerp(tmpC.set(0x7d7a70), sstep(0.8, 0.62, ny));
      C.lerp(tmpC.set(this.edgeCol), edgeK(x, z));
    },
    scenery(rnd) {
      const okLand = (x, z, h, d, dm = 16) => d > dm && h > 0.8 && this.river(x, z) > 22 && flatEnough(x, z, h, 3);
      // trees: trunk + canopy share transforms
      const trunk = new THREE.CylinderGeometry(0.3, 0.45, 3.6, 7); trunk.translate(0, 1.7, 0);
      const can = mergeGeometries([rockGeo(1, 0.45, 1).scale(2.7, 2.3, 2.7).translate(0, 5, 0), rockGeo(1, 0.45, 5).scale(1.9, 1.7, 1.9).translate(0.9, 6.6, 0.4)]);
      const trees = scatter(rnd, 300, 345, (x, z, h, d) => (!okLand(x, z, h, d, 17) || (d > 60 && rnd() < 0.55)) ? null
        : { x, y: h, z, ry: rnd() * 6, s: 0.75 + rnd() * 0.7, c: new THREE.Color().setHSL(0.25 + rnd() * 0.08, 0.55, 0.25 + rnd() * 0.12) });
      instanced(AP('tree_trunk') || trunk, std({ color: AP('tree_trunk') ? 0xffffff : 0x6b4a2e }), trees.map(t => ({ ...t, c: undefined })));
      instanced(AP('tree_canopy') || can, std({ color: 0xffffff, flatShading: true }), trees.map(t => AP('tree_canopy') ? { ...t, c: new THREE.Color(t.c).multiplyScalar(1.5) } : t));
      instanced(rockA(1, 0.4), std({ color: 0xffffff, flatShading: true }), scatter(rnd, 260, 330, (x, z, h, d) => { if (!okLand(x, z, h, d, 15)) return null; const s = 1 + rnd() * 1.6;
        return { x, y: h + s * 0.2, z, ry: rnd() * 6, s: [s * 1.4, s * 0.7, s], c: new THREE.Color().setHSL(0.27 + rnd() * 0.06, 0.5, 0.22 + rnd() * 0.1) }; }));
      // farm buildings
      const cream = std({ color: 0xf2ead8 }), red = std({ color: 0xb8342b }), roofD = std({ color: 0x4a3a36, flatShading: true }), roofR = std({ color: 0xa8322a, flatShading: true }), white = std({ color: 0xffffff });
      const farm = scatter(rnd, 7, 300, (x, z, h, d) => (d > 30 && d < 75 && okLand(x, z, h, d, 30) && flatEnough(x, z, h, 1.2)) ? { x, z, h } : null);
      farm.forEach((f, k) => { const ry = rnd() * 6;
        if (k % 3 === 2) group(f.x, f.h, f.z, ry, mesh(new THREE.BoxGeometry(14, 7, 10), red, 0, 3.5, 0), mesh(prism(6.2, 15), roofD, 0, 9.4, 0), mesh(new THREE.BoxGeometry(0.2, 4.4, 4), white, 7.05, 2.2, 0));
        else group(f.x, f.h, f.z, ry, mesh(new THREE.BoxGeometry(8, 4.6, 6), cream, 0, 2.3, 0), mesh(prism(4.1, 9), roofR, 0, 6.6, 0), mesh(new THREE.BoxGeometry(0.9, 2.2, 0.9), std({ color: 0x8a7a70 }), 2.3, 7.6, 1.2)); });
      // windmills
      for (const f of scatter(rnd, 3, 300, (x, z, h, d) => (d > 34 && d < 90 && okLand(x, z, h, d, 34)) ? { x, z, h } : null)) {
        const blades = new THREE.Group(); for (let k = 0; k < 4; k++) { const b = mesh(new THREE.BoxGeometry(0.7, 9, 0.15), white, 0, 4.6, 0); const arm = new THREE.Group(); arm.add(b); arm.rotation.z = k * Math.PI / 2; blades.add(arm); }
        blades.position.set(0, 13, 1.9); const sp = 0.8 + rnd() * 0.6; anim.push((dt) => { blades.rotation.z += dt * sp; });
        group(f.x, f.h, f.z, rnd() * 6, mesh(new THREE.CylinderGeometry(1.5, 2.6, 13, 8), cream, 0, 6.5, 0), mesh(new THREE.ConeGeometry(2.2, 2.6, 8), roofR, 0, 14.2, 0), blades);
      }
      // hay bales and sheep
      const bale = new THREE.CylinderGeometry(1, 1, 1.5, 14); bale.rotateZ(Math.PI / 2); bale.translate(0, 1, 0);
      instanced(bale, std({ color: 0xe0c46a }), scatter(rnd, 46, 330, (x, z, h, d) => okLand(x, z, h, d, 20) && hash2(Math.floor((x + 13) / 62), Math.floor((z - 7) / 48)) < 0.22 ? { x, y: h, z, ry: rnd() * 6 } : null));
      const sheep = scatter(rnd, 44, 330, (x, z, h, d) => okLand(x, z, h, d, 22) ? { x, y: h + 0.75, z, ry: rnd() * 6, s: 0.8 + rnd() * 0.3 } : null);
      instanced(rockGeo(1, 0.25, 9).scale(1, 0.75, 1.35), std({ color: 0xf6f3ea, flatShading: true }), sheep);
      instanced(new THREE.BoxGeometry(0.5, 0.55, 0.65).translate(0, 0.25, 1.35), std({ color: 0x2a2626 }), sheep);
      // wooden fences along straights
      const posts = [], rails = [];
      for (let i = 0; i < N; i += 3) { if ((i % 260) > 120 || Math.abs(CURV[i]) > 0.012) continue;
        for (const s of [-1, 1]) { const lat = s * (RW + 3.4), x = TX[i] + NX[i] * lat, z = TZ[i] + NZ[i] * lat, h = groundH(x, z); if (h < 0.4) continue;
          posts.push({ x, y: h + 0.6, z }); const j = (i + 3) % N, x2 = TX[j] + NX[j] * lat, z2 = TZ[j] + NZ[j] * lat;
          for (const yy of [0.55, 1.05]) rails.push({ x: (x + x2) / 2, y: (h + groundH(x2, z2)) / 2 + yy, z: (z + z2) / 2, ry: HD[i], s: [1, 1, Math.hypot(x2 - x, z2 - z)] }); } }
      instanced(new THREE.BoxGeometry(0.22, 1.25, 0.22), std({ color: 0x8a6440 }), posts);
      instanced(new THREE.BoxGeometry(0.1, 0.14, 1), std({ color: 0x9c7450 }), rails);
      // wooden bridge decks where the track crosses the river
      const planks = [];
      for (let i = 0; i < N; i++) if (this.river(TX[i], TZ[i]) < 20) { const y = groundH(TX[i], TZ[i]) + 0.12;
        planks.push({ x: TX[i], y, z: TZ[i], ry: HD[i] });
        for (const s of [-1, 1]) if (i % 2 === 0) planks.push({ x: TX[i] + NX[i] * s * (RW + 1.4), y: y + 0.9, z: TZ[i] + NZ[i] * s * (RW + 1.4), ry: HD[i], s: [0.25, 1.8, 0.25] }); }
      instanced(new THREE.BoxGeometry(RW * 2 + 3, 0.18, 1.35), std({ color: 0x8a5f3c }), planks);
    },
  },

  snow: {
    id: 'snow', name: 'Frost Peak', icon: '🏔️', sub: 'Snowy mountain · icy lake', banner: 'FROST PEAK', seed: 51,
    sky: [0x3c78cc, 0xd8e8f7, 0xc8d8ea], fog: [0xdce8f5, 260, 1600], hemi: [0xe6f1ff, 0x9aa8b8, 0.75], sun: [0xfff4e6, 3.0], exposure: 0.95, env: 0.6,
    clouds: 18, cloudCol: [0xffffff, 0xb8c8dc], water: null, ocean: false, edgeH: 40, edgeCol: 0xeef4fb,
    road: ['#c9d4e2', '#8796ab', '#f1f5fb'], dust: [0.96, 0.98, 1.0], grip: 0.9, gate: 0x2563eb, weather: 'snow',
    cpts: () => polarPts(SNOW_CP),
    init() { const [a, r] = SNOW_CP[12], th = a * Math.PI / 180; iceC = { x: Math.cos(th) * r, z: Math.sin(th) * r, r: 46 }; },
    baseH(x, z) {
      const r = Math.hypot(x, z);
      let h = 3 + 115 * Math.exp(-(r * r) / (125 * 125)) + 10 * fbm(x * 0.012, z * 0.012) + 14 * sstep(0.6, 0.85, fbm(x * 0.005 + 7, z * 0.005 + 1));
      if (iceC) h = lerp(h, 1.2, sstep(75, iceC.r, Math.hypot(x - iceC.x, z - iceC.z)));
      return toEdge(h, x, z, this.edgeH);
    },
    paint(C, x, h, z, ny, d) {
      C.set(0xf2f6fc).multiplyScalar(0.94 + 0.08 * vnoise(x * 0.12, z * 0.12));
      C.lerp(tmpC.set(0xc9d8ec), 0.5 * sstep(0.45, 0.7, fbm(x * 0.04 + 2, z * 0.04)));
      C.lerp(tmpC.set(0x6b7380), sstep(0.8, 0.6, ny));
      if (iceC) C.lerp(tmpC.set(0x9fd2ec), sstep(iceC.r + 4, iceC.r - 4, Math.hypot(x - iceC.x, z - iceC.z)) * 0.9);
      C.lerp(tmpC.set(this.edgeCol), edgeK(x, z));
    },
    scenery(rnd) {
      // snowy pines: green tiers dusted white towards each tip
      const tiers = [[2.4, 3.2, 2.6], [1.9, 2.8, 4.3], [1.3, 2.4, 5.9]].map(([r, hh, y]) => { const g = new THREE.ConeGeometry(r, hh, 8, 1, true); g.translate(0, y, 0); return g; });
      const tr = new THREE.CylinderGeometry(0.25, 0.35, 2.4, 6); tr.translate(0, 0.9, 0);
      const pine = mergeGeometries([...tiers.map(g => g.toNonIndexed()), tr.toNonIndexed()]);
      vcol(pine, (c, x, y, z) => { const rr = Math.hypot(x, z); if (y < 1.4 && rr < 0.4) c.set(0x5a3e2a); else c.set(0x1f5a3a).lerp(tmpC.set(0xffffff), sstep(0.9, 0.2, rr / (0.4 + (7.2 - y) * 0.5)) * 0.9); });
      const pm = std({ vertexColors: true, flatShading: true, side: THREE.DoubleSide });
      instanced(AP('pine') || pine, pm, scatter(rnd, 420, 350, (x, z, h, d) => (d < 17 || (d > 70 && rnd() < 0.5) || !flatEnough(x, z, h, 4) || (iceC && Math.hypot(x - iceC.x, z - iceC.z) < iceC.r + 6)) ? null
        : { x, y: h - 0.3, z, ry: rnd() * 6, s: 0.8 + rnd() * 0.9, c: new THREE.Color(1, 1, 1).multiplyScalar(0.85 + rnd() * 0.15) }));
      // rocks with snow caps
      const rg = vcol(rockA(2, 0.7, 3), (c, x, y, z, ny) => c.set(0x707884).lerp(tmpC.set(0xf4f8ff), sstep(0.25, 0.6, ny)));
      instanced(rg, std({ vertexColors: true, flatShading: true }), scatter(rnd, 160, 330, (x, z, h, d) => { if (d < 15 || d > 70) return null; const s = 0.8 + rnd() * rnd() * 5;
        return { x, y: h + s * 0.1, z, ry: rnd() * 6, s: [s * (0.8 + rnd() * 0.6), s * (0.6 + rnd() * 0.6), s] }; }));
      // backdrop peaks
      const pk = new THREE.ConeGeometry(1, 1, 9, 6); { const p = pk.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + (fbm(x * 3 + 2, z * 3 + y * 2) - 0.5) * 0.5 * (y < 0.49 ? 1 : 0); p.setXYZ(i, x * k, y, z * k); } pk.translate(0, 0.5, 0); pk.computeVertexNormals(); }
      vcol(pk, (c, x, y) => c.set(0x6d7584).lerp(tmpC.set(0xf6f9ff), sstep(0.35, 0.55, y + (fbm(x * 4, y * 4) - 0.5) * 0.2)));
      backdrop(rnd, 34, pk, std({ vertexColors: true, flatShading: true }), 480, 1500, this.edgeH - 6, 120, 300, 160, 420);
      // log cabins with glowing windows
      const log = std({ color: 0x6a4630 }), roof = std({ color: 0xf4f8ff, flatShading: true }), win = glow(std({ color: 0xffe2a0, emissive: 0xffb84a, emissiveIntensity: 1.6 }), 1.6, 4);
      for (const f of scatter(rnd, 6, 320, (x, z, h, d) => (d > 22 && d < 50 && flatEnough(x, z, h, 1.6)) ? { x, z, h } : null))
        group(f.x, f.h, f.z, rnd() * 6, mesh(new THREE.BoxGeometry(7, 3.6, 5.5), log, 0, 1.8, 0), mesh(prism(3.9, 8.2), roof, 0, 5.4, 0), mesh(new THREE.BoxGeometry(1.4, 1.1, 0.1), win, -1.6, 2, 2.78), mesh(new THREE.BoxGeometry(1.4, 1.1, 0.1), win, 1.6, 2, 2.78), mesh(new THREE.BoxGeometry(0.8, 2, 0.8), std({ color: 0x777777 }), 2.4, 6, -0.8));
      // snowmen
      const snowM = std({ color: 0xffffff, roughness: 0.8 }), black = std({ color: 0x111111 }), carrot = std({ color: 0xff7a1a });
      for (const f of scatter(rnd, 8, 300, (x, z, h, d) => (d > 14 && d < 26 && flatEnough(x, z, h, 1.5)) ? { x, z, h } : null)) {
        const nose = mesh(new THREE.ConeGeometry(0.12, 0.6, 8), carrot, 0, 3.05, 0.6); nose.rotation.x = Math.PI / 2;
        group(f.x, f.h, f.z, rnd() * 6, mesh(new THREE.SphereGeometry(1.1, 14, 10), snowM, 0, 0.9, 0), mesh(new THREE.SphereGeometry(0.8, 14, 10), snowM, 0, 2.2, 0), mesh(new THREE.SphereGeometry(0.55, 14, 10), snowM, 0, 3.05, 0),
          nose, mesh(new THREE.SphereGeometry(0.07, 6, 4), black, -0.2, 3.2, 0.48), mesh(new THREE.SphereGeometry(0.07, 6, 4), black, 0.2, 3.2, 0.48), mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.6, 12), black, 0, 3.7, 0));
      }
      // icy blue arch and ski-gate flags along the track
      addArch(Math.round(N * 0.12), 22, 6, 0x9fb8cc, 0xffffff); addArch(Math.round(N * 0.82), 23, 6.5, 0x9fb8cc, 0xffffff);
      const flags = [];
      for (let i = 20; i < N; i += 46) { const s = (i / 46 | 0) % 2 ? 1 : -1, lat = s * (RW + 2.6), x = TX[i] + NX[i] * lat, z = TZ[i] + NZ[i] * lat; flags.push({ x, y: groundH(x, z), z, ry: HD[i], c: s > 0 ? 0xe63946 : 0x2563eb }); }
      const fg = mergeGeometries([new THREE.CylinderGeometry(0.06, 0.06, 2.6, 6).translate(0, 1.3, 0), new THREE.BoxGeometry(0.05, 0.9, 1.2).translate(0, 2.1, 0.6)]);
      instanced(fg, std({ color: 0xffffff, roughness: 0.5 }), flags);
    },
  },
};
export const TRACK_IDS = Object.keys(THEMES);

// ───────────────────────── weather (rain streaks / snowflakes that follow the camera) ─────────────────────────
export const weather = { rain: 0, snow: 0, target: 0 };
const WB = new THREE.Vector3(80, 46, 80);
function weatherMesh(count, lines, frag, vert) {
  const g = new THREE.BufferGeometry(), seeds = new Float32Array(count * (lines ? 2 : 1) * 3), ends = new Float32Array(count * (lines ? 2 : 1));
  for (let i = 0; i < count; i++) { const s = [Math.random(), Math.random(), Math.random()]; for (let e = 0; e < (lines ? 2 : 1); e++) { const o = lines ? i * 2 + e : i; seeds.set(s, o * 3); ends[o] = e; } }
  g.setAttribute('position', new THREE.BufferAttribute(seeds, 3)); g.setAttribute('aEnd', new THREE.BufferAttribute(ends, 1));
  const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, fog: false, uniforms: { uTime: { value: 0 }, uCam: { value: new THREE.Vector3() }, uAmt: { value: 0 }, uB: { value: WB }, uScale: { value: 600 } }, vertexShader: vert, fragmentShader: frag });
  const o = lines ? new THREE.LineSegments(g, m) : new THREE.Points(g, m); o.frustumCulled = false; o.renderOrder = 6; o.visible = false; scene.add(o); return o;
}
const WRAP = `vec3 wrapPos(vec3 p){ return uCam + mod(p - uCam, uB) - uB * 0.5; }`;
const rainObj = weatherMesh(3200, true,
  `varying float vA; void main(){ gl_FragColor=vec4(0.78,0.84,0.92,vA); }`,
  `attribute float aEnd; uniform float uTime,uAmt; uniform vec3 uCam,uB; varying float vA; ${WRAP}
   void main(){ vec3 p=position*uB; p.y-=uTime*30.+position.x*13.; p.x+=uTime*4.; vec3 w=wrapPos(p); w-=vec3(4.,30.,0.)*0.045*aEnd;
     vec4 mv=modelViewMatrix*vec4(w,1.); vA=step(fract(position.z*7.31),uAmt)*0.42*smoothstep(1.,6.,-mv.z); gl_Position=projectionMatrix*mv; }`);
const snowObj = weatherMesh(2600, false,
  `varying float vA; void main(){ float r=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.1,r)*vA; if(a<0.01) discard; gl_FragColor=vec4(1.,1.,1.,a); }`,
  `uniform float uTime,uAmt,uScale; uniform vec3 uCam,uB; varying float vA; ${WRAP}
   void main(){ vec3 p=position*uB; p.y-=uTime*(2.2+position.x*1.6); p.x+=sin(uTime*0.7+position.z*20.)*2.+uTime*1.2; p.z+=cos(uTime*0.5+position.x*17.)*2.;
     vec3 w=wrapPos(p); vec4 mv=modelViewMatrix*vec4(w,1.); vA=step(fract(position.z*5.17),uAmt)*0.9*smoothstep(0.8,4.,-mv.z);
     gl_PointSize=min((0.09+position.y*0.08)*uScale/max(-mv.z,0.1),24.); gl_Position=projectionMatrix*mv; }`);
export function followWeather(cam, pixScale) {
  for (const o of [rainObj, snowObj]) if (o.visible) { o.material.uniforms.uCam.value.copy(cam.position); o.material.uniforms.uScale.value = pixScale; }
}
const base = { fog: new THREE.Color(), near: 0, far: 0, zen: new THREE.Color(), hor: new THREE.Color(), low: new THREE.Color(), cloud: new THREE.Color(), sun: 0, hemi: 0, rainSky: null, rainFog: null };
const cA = new THREE.Color();
export function worldTick(dt, time) {
  for (const f of anim) f(dt, time);
  const T = theme; if (!T) return;
  waterMat.uniforms.uTime.value = time; padTex.offset.y = (time * 1.6) % 1;
  if (T.weather === 'rain') {
    // passing showers: dry spells and rain come and go on a slow cycle
    const s = Math.sin(time * 0.045 + 0.5) + 0.7 * Math.sin(time * 0.121 + 2.2);
    weather.target = s > 0.25 ? 1 : 0;
    weather.rain += clamp(weather.target - weather.rain, -dt / 6, dt / 6);
    const a = weather.rain;
    const RF = base.rainFog, RS = base.rainSky;
    scene.fog.color.copy(base.fog).lerp(cA.set(RF[0]), a); scene.fog.near = lerp(base.near, RF[1], a); scene.fog.far = lerp(base.far, RF[2], a);
    skyMat.uniforms.uZen.value.copy(base.zen).lerp(cA.set(RS[0]), a); skyMat.uniforms.uHor.value.copy(base.hor).lerp(cA.set(RS[1]), a); skyMat.uniforms.uLow.value.copy(base.low).lerp(cA.set(RS[2]), a);
    skyMat.uniforms.uSunK.value = 1 - a; sun.intensity = base.sun * (1 - 0.62 * a); hemi.intensity = base.hemi * (1 - 0.25 * a);
    waterMat.uniforms.uRain.value = a; rainObj.material.uniforms.uAmt.value = a; rainObj.visible = a > 0.01;
    for (const c of cloudMats) c.color.copy(base.cloud).lerp(cA.set(night ? 0x151a24 : 0x7d8794), a);
  } else if (T.weather === 'snow') { weather.snow = 0.75; snowObj.material.uniforms.uAmt.value = 0.75; snowObj.visible = true; }
  rainObj.material.uniforms.uTime.value = snowObj.material.uniforms.uTime.value = time;
}
export function gripAt(x, z) {
  const T = theme; let g = T.grip;
  if (iceC && T.id === 'snow' && Math.hypot(x - iceC.x, z - iceC.z) < iceC.r) g *= 0.55;
  return g * (1 - 0.22 * weather.rain);
}
export const onIce = (x, z) => !!(iceC && theme && theme.id === 'snow' && Math.hypot(x - iceC.x, z - iceC.z) < iceC.r);

// ───────────────────────── build ─────────────────────────
const cloudMats = [];
function disposeTree(root) {
  root.traverse(o => {
    if (o.geometry && !o.geometry.userData.keep) o.geometry.dispose();
    const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    for (const m of ms) if (!m.userData.keep) { for (const k of ['map', 'alphaMap']) if (m[k] && !m[k].userData.keep) m[k].dispose(); m.dispose(); }
    if (o.isInstancedMesh) o.dispose();
  });
}
export function buildWorld(id) {
  const T = THEMES[id] || THEMES.beach; theme = T;
  if (W) { scene.remove(W); disposeTree(W); }
  W = new THREE.Group(); scene.add(W); anim.length = 0; cloudMats.length = 0; iceC = null;
  const rnd = rng(T.seed * 7919);
  if (T.init) T.init();
  const bh = (x, z) => T.baseH(x, z);

  // ── track centre-line ──
  const curve = new THREE.CatmullRomCurve3(T.cpts(), true, 'centripetal'); curve.arcLengthDivisions = 4000;
  TRACK_LEN = curve.getLength(); N = Math.round(TRACK_LEN / 1.5); SP = TRACK_LEN / N;
  SCDBG.n = N; SCDBG.len = TRACK_LEN; SCDBG.cp = T.cpts().length;
  TX = new Float32Array(N); TZ = new Float32Array(N); TY = new Float32Array(N); HD = new Float32Array(N); NX = new Float32Array(N); NZ = new Float32Array(N); VC = new Float32Array(N); CURV = new Float32Array(N);
  const pts = curve.getSpacedPoints(N);
  for (let i = 0; i < N; i++) { TX[i] = pts[i].x; TZ[i] = pts[i].z; TY[i] = Math.max(bh(TX[i], TZ[i]), -0.35); }
  for (let pass = 0; pass < 3; pass++) {
    const tmp = new Float32Array(N), Wd = 14;
    for (let i = 0; i < N; i++) { let s = 0; for (let k = -Wd; k <= Wd; k++) s += TY[(i + k + N) % N]; tmp[i] = s / (2 * Wd + 1); }
    TY.set(tmp);
  }
  for (let i = 0; i < N; i++) {
    const a = (i + N - 1) % N, b = (i + 1) % N; let tx = TX[b] - TX[a], tz = TZ[b] - TZ[a]; const l = Math.hypot(tx, tz); tx /= l; tz /= l;
    HD[i] = Math.atan2(tx, tz); NX[i] = tz; NZ[i] = -tx; // N = car's left
  }
  const raw = new Float32Array(N);
  for (let i = 0; i < N; i++) raw[i] = wrapA(HD[(i + 4) % N] - HD[(i + N - 4) % N]) / (8 * SP);
  for (let i = 0; i < N; i++) { let s = 0; for (let k = -5; k <= 5; k++) s += raw[(i + k + N) % N]; CURV[i] = s / 11; VC[i] = Math.min(80, Math.sqrt(40 / Math.max(Math.abs(CURV[i]), 1e-4))); }

  // ── secret shortcut ──
  SC = findShortcut(bh);
  // ── height grid (main road + bypass) ──
  for (let iz = 0; iz < GW; iz++) for (let ix = 0; ix < GW; ix++) {
    const x = -GS / 2 + ix * CELL, z = -GS / 2 + iz * CELL, i = nearestIdx(x, z);
    let dist = Math.hypot(x - TX[i], z - TZ[i]), y = TY[i];
    if (inBox(x, z)) { const s = nearestSi(x, z), ds = Math.hypot(x - SC.X[s], z - SC.Z[s]); if (ds < dist) { dist = ds; y = SC.Y[s]; } }
    HG[iz * GW + ix] = lerp(y, bh(x, z), sstep(RW + 2, RW + 17, dist)); DG[iz * GW + ix] = dist;
  }

  weather.rain = 0; weather.snow = 0; rainObj.visible = snowObj.visible = false; waterMat.uniforms.uRain.value = 0;
  glowMats.length = 0;

  // ── clouds ──
  {
    const mat = std({ color: T.cloudCol[0], emissive: T.cloudCol[1], emissiveIntensity: 0.55, fog: false }); cloudMats.push(mat);
    const blob = new THREE.IcosahedronGeometry(1, 2);
    for (let c = 0; c < T.clouds; c++) {
      const parts = [], n = 5 + (rnd() * 5 | 0);
      for (let k = 0; k < n; k++) { const g = blob.clone(); const s = 0.6 + rnd() * 0.8; g.scale(s * 1.5, s * 0.8, s); g.translate((k - n / 2) * 0.95 + rnd() * 0.4, rnd() * 0.35, (rnd() - 0.5) * 1.1); parts.push(g); }
      const m = new THREE.Mesh(mergeGeometries(parts), mat), a = rnd() * Math.PI * 2, r = 700 + rnd() * 1500;
      m.position.set(Math.cos(a) * r, (T.weather === 'rain' ? 150 : 190) + rnd() * 260, Math.sin(a) * r); m.scale.setScalar(45 + rnd() * 70); m.rotation.y = rnd() * 6; W.add(m);
    }
  }

  // ── terrain ──
  {
    const pos = new Float32Array(GW * GW * 3), col = new Float32Array(GW * GW * 3), uv = new Float32Array(GW * GW * 2), idx = [];
    for (let iz = 0; iz < GW; iz++) for (let ix = 0; ix < GW; ix++) {
      const o = iz * GW + ix, x = -GS / 2 + ix * CELL, z = -GS / 2 + iz * CELL;
      pos[o * 3] = x; pos[o * 3 + 1] = HG[o]; pos[o * 3 + 2] = z; uv[o * 2] = x / 7; uv[o * 2 + 1] = z / 7;
    }
    for (let iz = 0; iz < GN; iz++) for (let ix = 0; ix < GN; ix++) { const a = iz * GW + ix, b = a + 1, c = a + GW, d = c + 1; idx.push(a, c, b, b, c, d); }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
    const nrm = geo.attributes.normal, C = new THREE.Color();
    for (let o = 0; o < GW * GW; o++) { T.paint(C, pos[o * 3], pos[o * 3 + 1], pos[o * 3 + 2], nrm.getY(o), DG[o]); col[o * 3] = C.r; col[o * 3 + 1] = C.g; col[o * 3 + 2] = C.b; }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    // extra ground layers (dirt / mud / wet sand / slush), see src/surface.js
    const LY = LAYERS[T.id], sp = new Float32Array(GW * GW * 2), sa = new Float32Array(GW * GW), sb = new Float32Array(GW * GW);
    if (LY) for (let o = 0; o < GW * GW; o++) {
      const x = pos[o * 3], h = pos[o * 3 + 1], z = pos[o * 3 + 2], ny = nrm.getY(o), d = DG[o];
      const n1 = fbm(x * 0.03 + 11.3, z * 0.03 - 7.1), n2 = fbm(x * 0.11 - 3.7, z * 0.11 + 5.2);
      sa[o] = sp[o * 2] = clamp(LY.A.w(x, h, z, ny, d, n1, n2), 0, 1); sb[o] = sp[o * 2 + 1] = clamp(LY.B.w(x, h, z, ny, d, n1, n2), 0, 1);
    }
    geo.setAttribute('splat', new THREE.BufferAttribute(sp, 2)); setSplatGrid({ a: sa, b: sb, GS, GN });
    const m = new THREE.Mesh(geo, std({ vertexColors: true, map: sandTex, roughness: 0.95, metalness: 0 })); m.material.map = sandTex; detailMaps(m.material, T.id); splatMaterial(m.material, T.id);
    m.receiveShadow = true; W.add(m);
    if (!T.ocean) outerGround(T.edgeH, T.edgeCol);
  }

  // ── track ribbon ──
  {
    const LAT = [-10.5, -8, -4, 0, 4, 8, 10.5], C = LAT.length, pos = [], uv = [], idx = [], vrep = Math.round(TRACK_LEN / 14);
    for (let i = 0; i <= N; i++) { const j = i % N; for (let c = 0; c < C; c++) {
      const x = TX[j] + NX[j] * LAT[c], z = TZ[j] + NZ[j] * LAT[c]; pos.push(x, groundH(x, z) + 0.14, z); uv.push(c / (C - 1), i / N * vrep);
    } }
    for (let i = 0; i < N; i++) for (let c = 0; c < C - 1; c++) { const a = i * C + c, b = a + 1, d = a + C, e = d + 1; idx.push(a, d, b, b, d, e); }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
    { const sp = []; for (let k = 0; k < pos.length; k += 3) { const w = splatAt(pos[k], pos[k + 2]); sp.push(w.a, w.b); } geo.setAttribute('splat', new THREE.Float32BufferAttribute(sp, 2)); }
    const [c0, c1, c2] = T.road;
    const tex = canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = c0; g.fillRect(0, 0, w, h);
      for (let k = 0; k < 90; k++) { g.globalAlpha = 0.05 + Math.random() * 0.12; g.fillStyle = Math.random() < 0.6 ? c1 : c2; g.fillRect(30 + Math.random() * (w - 60), 0, 1 + Math.random() * 4, h); }
      if (T.id !== 'beach') { g.globalAlpha = 0.18; g.fillStyle = c1; for (const x of [78, 100, 156, 178]) g.fillRect(x, 0, 9, h); }
      if (ASSETS.ready) { g.globalAlpha = 1; g.globalCompositeOperation = 'multiply'; g.drawImage(ASSETS.tex.gravel.image, 0, 0, w, h); g.globalCompositeOperation = 'source-over'; }
      g.globalAlpha = 1; g.globalCompositeOperation = 'destination-in';
      const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.16, 'rgba(0,0,0,.92)'); gr.addColorStop(0.84, 'rgba(0,0,0,.92)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    }, { repeat: true });
    const m = new THREE.Mesh(geo, std({ map: tex, transparent: true, depthWrite: false, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    if (ASSETS.ready) { m.material.normalMap = ASSETS.nrm.gravel; m.material.normalScale.set(0.8, 0.8); splatMaterial(m.material, T.id, true); }
    m.receiveShadow = true; m.renderOrder = 1; W.add(m);
  }

  // ── water ──
  if (T.water) {
    const u = waterMat.uniforms; u.uShallow.value.set(T.water[0]); u.uMid.value.set(T.water[1]); u.uDeep.value.set(T.water[2]); u.uSky.value.set(T.water[3]);
    const WN = 200, geo = new THREE.PlaneGeometry(GS, GS, WN, WN); geo.rotateX(-Math.PI / 2);
    const p = geo.attributes.position, dep = new Float32Array(p.count);
    for (let i = 0; i < p.count; i++) dep[i] = Math.min(groundH(p.getX(i), p.getZ(i)), 0.4);
    geo.setAttribute('aDepth', new THREE.BufferAttribute(dep, 1));
    const w = new THREE.Mesh(geo, waterMat); w.renderOrder = 2; W.add(w);
    if (T.ocean) { const og = new THREE.PlaneGeometry(9000, 9000); og.rotateX(-Math.PI / 2);
      og.setAttribute('aDepth', new THREE.BufferAttribute(new Float32Array(4).fill(-9), 1));
      const o = new THREE.Mesh(og, waterMat); o.position.y = -0.06; o.renderOrder = 2; W.add(o); }
  }

  // ── theme scenery ──
  T.scenery(rnd);

  // ── edge posts + corner chevrons ──
  {
    const posts = [], signs = [], refl = [];
    const gap = (i, s) => SC && s === SC.side && ((i > SC.a - 6 && i < SC.a + 46) || (i > SC.b - 46 && i < SC.b + 6)); // leave the bypass mouths open
    for (let i = 0; i < N; i += 7) for (const s of [-1, 1]) { if (gap(i, s)) continue; const lat = s * (RW + 1.6), x = TX[i] + NX[i] * lat, z = TZ[i] + NZ[i] * lat, h = groundH(x, z);
      posts.push({ x, y: Math.max(h, -0.1) + 0.45, z, c: ((i / 7) | 0) % 2 ? 0xffffff : 0xff3344 }); refl.push({ x, y: Math.max(h, -0.1) + 0.95, z }); }
    instanced(new THREE.CylinderGeometry(0.2, 0.26, 0.9, 8), std({ color: 0xffffff, roughness: 0.5 }), posts);
    instanced(new THREE.CylinderGeometry(0.21, 0.21, 0.12, 8), glow(std({ color: 0xffb020, emissive: 0xffa010, emissiveIntensity: 0.2 }), 0.2, 2.4), refl, false);
    for (let i = 0; i < N; i += 5) if (Math.abs(CURV[i]) > 0.013 && !gap(i, -Math.sign(CURV[i]))) { const s = -Math.sign(CURV[i]), lat = s * (RW + 4.2), x = TX[i] + NX[i] * lat, z = TZ[i] + NZ[i] * lat;
      signs.push({ x, y: Math.max(groundH(x, z), 0) + 1.2, z, ry: HD[i] + Math.PI - s * 0.5 }); }
    const st = canvasTex(128, 64, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#ff2f45';
      for (let k = -1; k < 5; k++) { g.beginPath(); g.moveTo(k * 32, 0); g.lineTo(k * 32 + 16, 0); g.lineTo(k * 32 + 40, 32); g.lineTo(k * 32 + 16, 64); g.lineTo(k * 32, 64); g.lineTo(k * 32 + 24, 32); g.fill(); } });
    instanced(new THREE.BoxGeometry(4.4, 1.5, 0.15), std({ map: st, roughness: 0.6 }), signs);
  }
  // ── start gate + line ──
  {
    const i = 0, G = new THREE.Group(), pole = std({ color: T.gate, roughness: 0.4, metalness: 0.2 });
    for (const s of [-1, 1]) { G.add(mesh(new THREE.CylinderGeometry(0.7, 0.9, 11, 14), pole, s * 14.6, 5, 0));
      G.add(mesh(new THREE.SphereGeometry(1.1, 14, 10), glow(std({ color: 0xffc83a, emissive: 0xffa600, emissiveIntensity: 0.8 }), 0.8, 3), s * 14.6, 11.2, 0)); }
    const hexc = '#' + new THREE.Color(T.gate).getHexString();
    const bt = canvasTex(1024, 128, (g) => { for (let y = 0; y < 4; y++) for (let x = 0; x < 32; x++) { g.fillStyle = (x + y) % 2 ? '#fff' : '#111'; g.fillRect(x * 32, y * 32, 32, 32); }
      g.fillStyle = hexc; g.fillRect(222, 14, 580, 100); g.fillStyle = '#fff'; g.font = 'italic 900 80px Avenir Next, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(T.banner, 512, 68); });
    const bm = std({ map: bt, roughness: 0.6 });
    if (ASSETS.ready && ASSETS.gate) {
      // Blender gantry (blender/gate.py): tint its frame to the track colour, print the banner, light the beacons
      G.clear(); bt.flipY = false; bt.needsUpdate = true;
      const MAP = { Gate: pole, Banner: bm, Bulb: glow(std({ color: 0xffc83a, emissive: 0xffa600, emissiveIntensity: 0.8 }), 0.8, 3),
        Lamp: glow(std({ color: 0xffffff, emissive: 0xfff2d0, emissiveIntensity: 0.4 }), 0.4, 3) };
      const g = ASSETS.gate.clone(); g.traverse(o => { if (o.isMesh && MAP[o.material.name]) o.material = MAP[o.material.name]; }); G.add(g);
    } else
    G.add(mesh(new THREE.BoxGeometry(29.5, 3, 0.5), [pole, pole, pole, pole, bm, bm], 0, 9.4, 0));
    G.position.set(TX[i], TY[i], TZ[i]); G.rotation.y = HD[i]; G.traverse(o => { if (o.isMesh) o.castShadow = true; }); W.add(G);
    const lt = canvasTex(256, 32, (g) => { for (let y = 0; y < 2; y++) for (let x = 0; x < 16; x++) { g.fillStyle = (x + y) % 2 ? '#fff' : '#111'; g.fillRect(x * 16, y * 16, 16, 16); } });
    const lg = new THREE.PlaneGeometry(RW * 2 + 2, 2.2); lg.rotateX(-Math.PI / 2);
    const line = new THREE.Mesh(lg, std({ map: lt, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6, transparent: true, opacity: 0.92, depthWrite: false }));
    line.position.set(TX[i], TY[i] + 0.1, TZ[i]); line.rotation.y = HD[i]; line.renderOrder = 3; line.receiveShadow = true; W.add(line);
  }
  // ── boost pads ──
  pads = [];
  {
    const pg = new THREE.PlaneGeometry(5.2, 8); pg.rotateX(-Math.PI / 2);
    const pm = new THREE.MeshBasicMaterial({ map: padTex, color: new THREE.Color(1.0, 2.2, 3.2), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -8 });
    for (const f of [0.05, 0.17, 0.34, 0.5, 0.63, 0.8, 0.92]) {
      let i = Math.round(f * N), g = 0; while (g++ < 90 && (Math.abs(TY[(i + 6) % N] - TY[i]) > 0.25 || TY[i] < 0.2 || onIce(TX[i], TZ[i]))) i = (i + 1) % N;
      const lat = (rnd() - 0.5) * 8, x = TX[i] + NX[i] * lat, z = TZ[i] + NZ[i] * lat, m = new THREE.Mesh(pg, pm);
      m.position.set(x, groundH(x, z) + 0.16, z); m.rotation.y = HD[i]; m.renderOrder = 4; W.add(m); pads.push({ i, lat });
    }
  }
  // ── coins ──
  coins = [];
  for (let i = 30; i < N - 30; i += 34) { const lane = [-5, 0, 5][rnd() * 3 | 0], bend = (rnd() - 0.5) * 1.2;
    if (pads.some(p => Math.abs(p.i - i) < 14)) continue;
    for (let k = 0; k < 5; k++) { const j = i + k * 3, lat = lane + bend * (k - 2), x = TX[j] + NX[j] * lat, z = TZ[j] + NZ[j] * lat;
      coins.push({ x, y: Math.max(groundH(x, z), 0) + 1.15, z, t: 0, ph: k * 0.5 }); } }
  if (SC) buildShortcutDressing(rnd);
  coinMesh = new THREE.InstancedMesh(coinGeo, coinMat, coins.length);
  coinMesh.castShadow = true; coinMesh.frustumCulled = false; W.add(coinMesh);
  applyLight();
  return T;
}

// ───────────────────────── day / night ─────────────────────────
export let night = false;
const glowMats = [];
const glow = (m, day, nite) => { m.userData.gd = day; m.userData.gn = nite; glowMats.push(m); return m; };
const NIGHT = { sky: [0x040a1c, 0x1a2a4c, 0x0a1430], fog: [0x0e1a33, 200, 1300], hemi: [0x5070b0, 0x141c28, 0.5], sun: [0xa8c0ff, 1.1], exposure: 1.18, env: 0.22,
  rainSky: [0x0a0f18, 0x1e2530, 0x10161e], rainFog: [0x151c26, 40, 520] };
export function setNight(v) { night = !!v; if (theme) applyLight(); }
function applyLight() {
  const T = theme, L = night ? Object.assign({}, NIGHT, T.id === 'snow' ? { hemi: [0x7090d0, 0x5a6a88, 0.7], exposure: 1.05 } : {}) : T;
  skyMat.uniforms.uZen.value.set(L.sky[0]); skyMat.uniforms.uHor.value.set(L.sky[1]); skyMat.uniforms.uLow.value.set(L.sky[2]); skyMat.uniforms.uSunK.value = 1;
  skyMat.uniforms.uSunCol.value.set(night ? 0xdfe8ff : 0xffebc0); skyMat.uniforms.uGlow.value = night ? 0.25 : 1;
  scene.fog.color.set(L.fog[0]); scene.fog.near = L.fog[1]; scene.fog.far = L.fog[2];
  hemi.color.set(L.hemi[0]); hemi.groundColor.set(L.hemi[1]); hemi.intensity = L.hemi[2]; sun.color.set(L.sun[0]); sun.intensity = L.sun[1];
  renderer.toneMappingExposure = L.exposure; scene.environmentIntensity = L.env;
  Object.assign(base, { near: L.fog[1], far: L.fog[2], sun: L.sun[1], hemi: L.hemi[2], rainSky: night ? NIGHT.rainSky : T.rainSky, rainFog: night ? NIGHT.rainFog : T.rainFog });
  base.fog.set(L.fog[0]); base.zen.set(L.sky[0]); base.hor.set(L.sky[1]); base.low.set(L.sky[2]);
  stars.visible = night;
  base.cloud.set(night ? 0x2a3550 : T.cloudCol[0]);
  for (const m of cloudMats) { m.color.copy(base.cloud); m.emissive.set(night ? 0x0c1428 : T.cloudCol[1]); }
  for (const m of glowMats) m.emissiveIntensity = night ? m.userData.gn : m.userData.gd;
  coinMat.emissiveIntensity = night ? 0.9 : 0.55;
  bakeEnv();
  document.body.style.background = '#' + new THREE.Color(L.sky[1]).getHexString();
}

// ───────────────────────── secret shortcut ─────────────────────────
// Each track hides one corner-cutting bypass. It is found automatically: a smooth curve that leaves the racing line,
// skips a long detour, stays well clear of every other part of the track and isn't too steep. Only player-driven cars use it.
export let SC = null;
const SRW = 6.5, SWALL = 9.5;
export const SCDBG = {}; const why = (k) => { SCDBG.fail[k] = (SCDBG.fail[k] || 0) + 1; return null; };
function findShortcut(bh) {
  const cand = [];
  for (let a = 70; a < N - 140; a += 5) for (let b = a + 60; b < Math.min(N - 60, a + 460); b += 5) {
    const L = Math.hypot(TX[b] - TX[a], TZ[b] - TZ[a]), path = (b - a) * SP;
    if (L < 50 || L > 240 || path < L * 1.3) continue;
    const save = path - L * 1.2; cand.push({ a, b, L, save: Math.min(save, 150) - L * 0.05 - Math.max(0, L - 170) });
  }
  cand.sort((p, q) => q.save - p.save); SCDBG.cand = cand.length; SCDBG.fail = {};
  for (const c of cand.slice(0, 2500)) { const s = tryShortcut(c.a, c.b, c.L, bh); if (s) return s; }
  return null;
}
function tryShortcut(a, b, L, bh) {
  const P0 = new THREE.Vector3(TX[a], 0, TZ[a]), P3 = new THREE.Vector3(TX[b], 0, TZ[b]);
  const dA = new THREE.Vector3(Math.sin(HD[a]), 0, Math.cos(HD[a])), dB = new THREE.Vector3(Math.sin(HD[b]), 0, Math.cos(HD[b]));
  const crv = new THREE.CubicBezierCurve3(P0, P0.clone().addScaledVector(dA, L * 0.24), P3.clone().addScaledVector(dB, -L * 0.24), P3);
  const len = crv.getLength(); if (len > (b - a) * SP * 0.8) return why('len');
  // clearance from the rest of the track (coarse)
  for (let k = 1; k < 20; k++) { const t = k / 20, p = crv.getPoint(t), need = t < 0.1 || t > 0.9 ? 0 : (t < 0.3 || t > 0.7 ? 21 : 30);
    if (!need) continue;
    for (let j = 0; j < N; j += 3) { if ((j > a - 12 && j < a + 50 && t < 0.35) || (j > b - 50 && j < b + 12 && t > 0.65)) continue;
      const dx = p.x - TX[j], dz = p.z - TZ[j]; if (dx * dx + dz * dz < need * need) return why('clear'); }
    if (Math.max(Math.abs(p.x), Math.abs(p.z)) > 330) return why('edge'); }
  const M = Math.max(20, Math.round(len / 1.5)), pts = crv.getSpacedPoints(M - 1);
  const X = new Float32Array(M), Z = new Float32Array(M), Yr = new Float32Array(M), H = new Float32Array(M), NXs = new Float32Array(M), NZs = new Float32Array(M);
  for (let i = 0; i < M; i++) { X[i] = pts[i].x; Z[i] = pts[i].z; const t = i / (M - 1), w = sstep(0, 0.22, t) * sstep(1, 0.78, t);
    Yr[i] = lerp(lerp(TY[a], TY[b], t), Math.max(bh(X[i], Z[i]), -0.35), w); }
  let Y = Yr;
  for (let pass = 0; pass < 3; pass++) { const tmp = new Float32Array(M); for (let i = 0; i < M; i++) { if (i < 2 || i > M - 3) { tmp[i] = Y[i]; continue; } let s = 0, n = 0; for (let k = -8; k <= 8; k++) { const j = clamp(i + k, 0, M - 1); s += Y[j]; n++; } tmp[i] = s / n; } Y = tmp; }
  for (let i = 1; i < M; i++) if (Math.abs(Y[i] - Y[i - 1]) / 1.5 > 0.36) return why('slope');
  for (let i = 0; i < M; i++) { const p = Math.max(0, i - 1), q = Math.min(M - 1, i + 1); let tx = X[q] - X[p], tz = Z[q] - Z[p]; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l; H[i] = Math.atan2(tx, tz); NXs[i] = tz; NZs[i] = -tx; }
  let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9; for (let i = 0; i < M; i++) { minX = Math.min(minX, X[i]); maxX = Math.max(maxX, X[i]); minZ = Math.min(minZ, Z[i]); maxZ = Math.max(maxZ, Z[i]); }
  const mid = M >> 1, side = Math.sign((X[mid] - TX[a]) * NX[a] + (Z[mid] - TZ[a]) * NZ[a]) || 1;
  return { a, b, M, X, Z, Y, H, NX: NXs, NZ: NZs, side, len, save: (b - a) * SP - len, box: [minX - 30, maxX + 30, minZ - 30, maxZ + 30] };
}
export function nearestSi(x, z, hint = -1) {
  const S = SC; let best = 0, bd = 1e18, lo = 0, hi = S.M - 1;
  if (hint >= 0) { lo = Math.max(0, hint - 25); hi = Math.min(S.M - 1, hint + 25); }
  for (let i = lo; i <= hi; i++) { const dx = x - S.X[i], dz = z - S.Z[i], d = dx * dx + dz * dz; if (d < bd) { bd = d; best = i; } }
  return best;
}
const inBox = (x, z) => SC && x > SC.box[0] && x < SC.box[1] && z > SC.box[2] && z < SC.box[3];
// Where is this car relative to the road it is on? Updates c.idx (race progress), c.mi, c.sc, c.si.
const FR = { px: 0, pz: 0, nx: 0, nz: 0, hd: 0, rw: RW, wall: WALL };
export function trackFrame(c, canShortcut) {
  const mi = nearestIdx(c.x, c.z, c.mi >= 0 ? c.mi : c.idx, 30); c.mi = mi;
  let useS = false;
  if (SC && (c.sc || canShortcut) && inBox(c.x, c.z)) {
    const si = nearestSi(c.x, c.z, c.sc ? c.si : -1), dS = Math.hypot(c.x - SC.X[si], c.z - SC.Z[si]), dM = Math.hypot(c.x - TX[mi], c.z - TZ[mi]);
    if (si > 0 && si < SC.M - 1 && (c.sc ? dS < dM + 0.6 : dS < dM - 0.6)) { useS = true; c.si = si; }
  }
  c.sc = useS;
  if (useS) { const s = c.si; c.idx = Math.round(SC.a + s / (SC.M - 1) * (SC.b - SC.a)); Object.assign(FR, { px: SC.X[s], pz: SC.Z[s], nx: SC.NX[s], nz: SC.NZ[s], hd: SC.H[s], rw: SRW, wall: SWALL }); }
  else { c.idx = mi; Object.assign(FR, { px: TX[mi], pz: TZ[mi], nx: NX[mi], nz: NZ[mi], hd: HD[mi], rw: RW, wall: WALL }); }
  return FR;
}
// gravel road, warning sign, cones, barrier boards and a reward line of coins
function buildShortcutDressing(rnd) {
  const S = SC, LAT = [-8.2, -6, -3, 0, 3, 6, 8.2], C = LAT.length, pos = [], uv = [], idx = [];
  for (let i = 0; i < S.M; i++) for (let c = 0; c < C; c++) { const x = S.X[i] + S.NX[i] * LAT[c], z = S.Z[i] + S.NZ[i] * LAT[c]; pos.push(x, groundH(x, z) + 0.06, z); uv.push(c / (C - 1), i * 1.5 / 12); }
  for (let i = 0; i < S.M - 1; i++) for (let c = 0; c < C - 1; c++) { const a = i * C + c, b = a + 1, d = a + C, e = d + 1; idx.push(a, d, b, b, d, e); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
  const tex = canvasTex(128, 128, (g, w, h) => { g.fillStyle = '#8f8676'; g.fillRect(0, 0, w, h);
    for (let k = 0; k < 900; k++) { g.fillStyle = `hsl(35,${8 + Math.random() * 10}%,${30 + Math.random() * 40}%)`; g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 1 + Math.random() * 3); }
    g.globalCompositeOperation = 'destination-in'; const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.18, 'rgba(0,0,0,.95)'); gr.addColorStop(0.82, 'rgba(0,0,0,.95)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }, { repeat: true });
  const rm = new THREE.Mesh(geo, std({ map: tex, transparent: true, depthWrite: false, roughness: 1, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 })); rm.receiveShadow = true; rm.renderOrder = 1; W.add(rm);
  // the yellow WORK IN PROGRESS sign, just past where the bypass splits off, on its outer edge
  const st = canvasTex(512, 384, (g, w, h) => {
    g.fillStyle = '#111'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd21a'; g.beginPath(); g.roundRect(10, 10, w - 20, h - 20, 26); g.fill();
    g.lineWidth = 10; g.strokeStyle = '#111'; g.beginPath(); g.roundRect(30, 30, w - 60, h - 60, 18); g.stroke();
    g.fillStyle = '#111'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 64px Avenir Next, Arial'; g.fillText('🚧', w / 2, 92);
    g.font = 'italic 900 70px Avenir Next, Arial'; g.fillText('WORK IN', w / 2, 178); g.fillText('PROGRESS', w / 2, 258);
    g.save(); g.beginPath(); g.rect(40, 300, w - 80, 40); g.clip(); for (let x = 20; x < w; x += 48) { g.beginPath(); g.moveTo(x, 300); g.lineTo(x + 24, 300); g.lineTo(x - 16, 340); g.lineTo(x - 40, 340); g.fill(); } g.restore();
  });
  const sm = glow(std({ map: st, emissive: 0xffffff, emissiveMap: st, emissiveIntensity: 0, roughness: 0.5 }), 0, 0.55), legM = std({ color: 0x777777, roughness: 0.4, metalness: 0.6 });
  const si = Math.min(S.M - 1, 9), lat = S.side * (SRW + 3.4), sx = S.X[si] + S.NX[si] * lat, sz = S.Z[si] + S.NZ[si] * lat, sy = groundH(sx, sz);
  group(sx, sy, sz, S.H[si] + Math.PI - S.side * 0.35, mesh(new THREE.BoxGeometry(4.2, 3.15, 0.14), [legM, legM, legM, legM, sm, legM], 0, 3.5, 0),
    mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.6, 8), legM, -1.5, 1.4, -0.1), mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.6, 8), legM, 1.5, 1.4, -0.1));
  // traffic cones along both edges of the bypass mouth + striped barrier boards
  const cones = [], boards = [];
  for (let k = 2; k < Math.min(S.M, 30); k += 4) for (const s of [-1, 1]) { const l = s * (SRW + 1.2), x = S.X[k] + S.NX[k] * l, z = S.Z[k] + S.NZ[k] * l; cones.push({ x, y: groundH(x, z), z, ry: rnd() * 6 }); }
  for (const k of [Math.round(S.M * 0.35), Math.round(S.M * 0.65)]) for (const s of [-1, 1]) { const l = s * (SRW + 2), x = S.X[k] + S.NX[k] * l, z = S.Z[k] + S.NZ[k] * l; boards.push({ x, y: groundH(x, z) + 0.9, z, ry: S.H[k] }); }
  const cg = mergeGeometries([new THREE.ConeGeometry(0.34, 0.95, 12).translate(0, 0.52, 0), new THREE.BoxGeometry(0.75, 0.06, 0.75).translate(0, 0.03, 0)]);
  instanced(cg, glow(std({ color: 0xff6a00, emissive: 0xff4a00, emissiveIntensity: 0.1, roughness: 0.5 }), 0.1, 0.6), cones);
  const bt = canvasTex(128, 32, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8232f'; for (let x = -32; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 16, 0); g.lineTo(x + 32, h); g.lineTo(x + 16, h); g.fill(); } });
  instanced(new THREE.BoxGeometry(0.12, 0.7, 3.6), std({ map: bt, roughness: 0.6 }), boards);
  // bonus coins down the middle of the bypass
  for (let i = Math.round(S.M * 0.3); i < S.M * 0.75; i += 5) coins.push({ x: S.X[i], y: Math.max(groundH(S.X[i], S.Z[i]), 0) + 1.15, z: S.Z[i], t: 0, ph: i * 0.3 });
}
