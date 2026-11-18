// Coral Coast Rally — original beach buggy racer. Everything (models, textures, sound) is procedural.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createNet } from './net.js';

// ───────────────────────── helpers ─────────────────────────
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const wrapA = (a) => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rand = rng(20261117);
const hash2 = (ix, iz) => { const n = Math.sin(ix * 127.1 + iz * 311.7) * 43758.5453; return n - Math.floor(n); };
function vnoise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash2(ix, iz), b = hash2(ix + 1, iz), c = hash2(ix, iz + 1), d = hash2(ix + 1, iz + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, z) { let s = 0, a = 0.5; for (let i = 0; i < 4; i++) { s += a * vnoise(x, z); x *= 2.03; z *= 2.03; a *= 0.5; } return s; }
function canvasTex(w, h, draw, opts = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (opts.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  return t;
}

// ───────────────────────── constants ─────────────────────────
const LAPS = 3, RW = 8, WALL = 13, MAXV = 46, ACC = 21, GRAV = 30;
const SUN = new THREE.Vector3(0.48, 0.72, 0.38).normalize();
const AUTO = /[?&]auto=1/.test(location.search);

// ───────────────────────── island + track definition ─────────────────────────
const shoreR = (th) => 235 + 22 * Math.sin(3 * th + 0.8) + 12 * Math.sin(5 * th + 2.1) + 8 * Math.sin(2 * th);
function baseH(x, z) {
  const r = Math.hypot(x, z), th = Math.atan2(z, x), d = shoreR(th) - r;
  if (d < 0) return Math.max(-8, d * 0.085) + 0.25 * (vnoise(x * 0.05, z * 0.05) - 0.5);
  const beach = Math.min(d, 45) * 0.035 + 0.35 * fbm(x * 0.06, z * 0.06) * sstep(4, 20, d);
  const hill = sstep(38, 130, d) * (9 + 36 * fbm(x * 0.012 + 5, z * 0.012 + 9)) + 26 * sstep(150, 235, d);
  return beach + hill;
}
// polar control points: [angle°, metres inland from shoreline (negative = out in the shallows)]
const CP = [[0, 16], [20, 14], [40, 18], [58, -12], [74, -16], [90, -6], [104, 30], [112, 80], [128, 108], [150, 94], [160, 50],
  [172, 16], [195, 12], [215, -10], [232, -14], [248, 20], [256, 70], [250, 115], [266, 132], [284, 100], [292, 50], [305, 16], [330, 14]];
const curve = new THREE.CatmullRomCurve3(CP.map(([a, d]) => {
  const th = a * Math.PI / 180, r = shoreR(th) - d; return new THREE.Vector3(Math.cos(th) * r, 0, Math.sin(th) * r);
}), true, 'centripetal');
curve.arcLengthDivisions = 4000;
const TRACK_LEN = curve.getLength();
const N = Math.round(TRACK_LEN / 1.5), SP = TRACK_LEN / N;
const TX = new Float32Array(N), TZ = new Float32Array(N), TY = new Float32Array(N), HD = new Float32Array(N);
const NX = new Float32Array(N), NZ = new Float32Array(N), VC = new Float32Array(N), CURV = new Float32Array(N);
{
  const pts = curve.getSpacedPoints(N);
  for (let i = 0; i < N; i++) { TX[i] = pts[i].x; TZ[i] = pts[i].z; TY[i] = Math.max(baseH(TX[i], TZ[i]), -0.35); }
  for (let pass = 0; pass < 3; pass++) {
    const tmp = new Float32Array(N), W = 14;
    for (let i = 0; i < N; i++) { let s = 0; for (let k = -W; k <= W; k++) s += TY[(i + k + N) % N]; tmp[i] = s / (2 * W + 1); }
    TY.set(tmp);
  }
  for (let i = 0; i < N; i++) {
    const a = (i + N - 1) % N, b = (i + 1) % N; let tx = TX[b] - TX[a], tz = TZ[b] - TZ[a]; const l = Math.hypot(tx, tz); tx /= l; tz /= l;
    HD[i] = Math.atan2(tx, tz); NX[i] = tz; NZ[i] = -tx; // N = car's left
  }
  const raw = new Float32Array(N);
  for (let i = 0; i < N; i++) raw[i] = wrapA(HD[(i + 4) % N] - HD[(i + N - 4) % N]) / (8 * SP);
  for (let i = 0; i < N; i++) { let s = 0; for (let k = -5; k <= 5; k++) s += raw[(i + k + N) % N]; CURV[i] = s / 11; VC[i] = Math.min(80, Math.sqrt(40 / Math.max(Math.abs(CURV[i]), 1e-4))); }
}
function nearestIdx(x, z, hint = -1, range = 40) {
  let best = 0, bd = 1e18;
  if (hint < 0) {
    for (let i = 0; i < N; i += 6) { const dx = x - TX[i], dz = z - TZ[i], d = dx * dx + dz * dz; if (d < bd) { bd = d; best = i; } }
    hint = best; range = 6;
  }
  for (let k = -range; k <= range; k++) { const i = (hint + k + N) % N, dx = x - TX[i], dz = z - TZ[i], d = dx * dx + dz * dz; if (d < bd) { bd = d; best = i; } }
  return best;
}

// ───────────────────────── height grid ─────────────────────────
const GS = 780, GN = 300, CELL = GS / GN, GW = GN + 1;
const HG = new Float32Array(GW * GW), DG = new Float32Array(GW * GW);
for (let iz = 0; iz < GW; iz++) for (let ix = 0; ix < GW; ix++) {
  const x = -GS / 2 + ix * CELL, z = -GS / 2 + iz * CELL, i = nearestIdx(x, z);
  const dist = Math.hypot(x - TX[i], z - TZ[i]);
  HG[iz * GW + ix] = lerp(TY[i], baseH(x, z), sstep(RW + 2, RW + 17, dist)); DG[iz * GW + ix] = dist;
}
function gridS(A, x, z) {
  const fx = clamp((x + GS / 2) / CELL, 0, GN - 1e-3), fz = clamp((z + GS / 2) / CELL, 0, GN - 1e-3);
  const ix = fx | 0, iz = fz | 0, u = fx - ix, v = fz - iz, o = iz * GW + ix;
  return (A[o] * (1 - u) + A[o + 1] * u) * (1 - v) + (A[o + GW] * (1 - u) + A[o + GW + 1] * u) * v;
}
const groundH = (x, z) => gridS(HG, x, z), trackDist = (x, z) => gridS(DG, x, z);

// ───────────────────────── renderer / scene ─────────────────────────
const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.AgXToneMapping; renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xa8d8f5, 420, 2400);
const camera = new THREE.PerspectiveCamera(62, 1, 0.3, 7000);

// sky
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false,
  uniforms: { uSun: { value: SUN }, uZen: { value: new THREE.Color(0x0b52c9) }, uHor: { value: new THREE.Color(0x9fd6f7) } },
  vertexShader: `varying vec3 vDir; void main(){ vDir=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `varying vec3 vDir; uniform vec3 uSun,uZen,uHor;
    void main(){ vec3 d=normalize(vDir); float h=max(d.y,0.);
      vec3 col=mix(uHor,uZen,pow(h,0.5)); col=mix(col,vec3(0.45,0.78,0.9),smoothstep(0.,-0.25,d.y)*0.6+0.0);
      float s=max(dot(d,uSun),0.); col+=vec3(1.,.92,.75)*(smoothstep(0.9993,0.9997,s)*14.+pow(s,24.)*0.28+pow(s,400.)*1.2);
      gl_FragColor=vec4(col,1.); }`,
});
const sky = new THREE.Mesh(new THREE.SphereGeometry(4000, 32, 16), skyMat); sky.frustumCulled = false; scene.add(sky);
{
  const es = new THREE.Scene(); es.add(new THREE.Mesh(sky.geometry, skyMat));
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(es, 0, 1, 6000).texture; pm.dispose();
  scene.environmentIntensity = 0.55;
}
const hemi = new THREE.HemisphereLight(0xbfe0ff, 0xd9b26e, 0.6); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d2, 3.6); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.06;
Object.assign(sun.shadow.camera, { left: -75, right: 75, top: 75, bottom: -75, near: 1, far: 420 }); sun.shadow.camera.updateProjectionMatrix();
scene.add(sun, sun.target);

// clouds
{
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x9fb6cc, emissiveIntensity: 0.55, fog: false });
  const blob = new THREE.IcosahedronGeometry(1, 2);
  for (let c = 0; c < 22; c++) {
    const parts = [], n = 5 + (rand() * 5 | 0);
    for (let k = 0; k < n; k++) { const g = blob.clone(); const s = 0.6 + rand() * 0.8; g.scale(s * 1.5, s * 0.8, s); g.translate((k - n / 2) * 0.95 + rand() * 0.4, rand() * 0.35, (rand() - 0.5) * 1.1); parts.push(g); }
    const m = new THREE.Mesh(mergeGeometries(parts), mat), a = rand() * Math.PI * 2, r = 700 + rand() * 1500;
    m.position.set(Math.cos(a) * r, 190 + rand() * 260, Math.sin(a) * r); m.scale.setScalar(45 + rand() * 70); m.rotation.y = rand() * 6;
    m.userData.cloud = 1; scene.add(m);
  }
}

// ───────────────────────── terrain ─────────────────────────
const sandTex = canvasTex(256, 256, (g, w, h) => {
  const id = g.createImageData(w, h);
  for (let i = 0; i < w * h; i++) { const v = 215 + Math.random() * 40; id.data[i * 4] = v; id.data[i * 4 + 1] = v; id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = 255; }
  g.putImageData(id, 0, 0);
  g.globalAlpha = 0.06; g.strokeStyle = '#765'; g.lineWidth = 3;
  for (let k = 0; k < 26; k++) { const y = k * 10 + 3; g.beginPath(); for (let x = 0; x <= w; x += 8) g.lineTo(x, y + Math.sin(x / w * Math.PI * 4 + k) * 2.5); g.stroke(); }
}, { repeat: true });
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
  const sand = new THREE.Color(0xf0cf8a), wet = new THREE.Color(0xc39c62), grass = new THREE.Color(0x4fae2a), jungle = new THREE.Color(0x2c7d34), rock = new THREE.Color(0x8f7d6b), sea = new THREE.Color(0xe9dcae);
  for (let o = 0; o < GW * GW; o++) {
    const x = pos[o * 3], h = pos[o * 3 + 1], z = pos[o * 3 + 2], n = fbm(x * 0.03 + 40, z * 0.03 + 12), ny = nrm.getY(o);
    C.copy(sand).multiplyScalar(0.93 + 0.14 * vnoise(x * 0.11, z * 0.11));
    if (h < 0.45) C.lerp(wet, 1 - sstep(-0.1, 0.45, h));
    if (h < -0.3) C.lerp(sea, sstep(-0.3, -2.5, h) * 0.9);
    const gAmt = sstep(2.0 + n * 2.2, 4.2 + n * 2.2, h) * sstep(RW + 6, RW + 16, DG[o]);
    if (gAmt > 0) C.lerp(grass, gAmt).lerp(jungle, gAmt * sstep(0.35, 0.7, fbm(x * 0.05, z * 0.05)));
    if (h > 1.5) C.lerp(rock, sstep(0.86, 0.68, ny));
    col[o * 3] = C.r; col[o * 3 + 1] = C.g; col[o * 3 + 2] = C.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, map: sandTex, roughness: 0.95, metalness: 0 }));
  m.receiveShadow = true; scene.add(m);
}

// track ribbon
{
  const LAT = [-10.5, -8, -4, 0, 4, 8, 10.5], C = LAT.length, pos = [], uv = [], idx = [], vrep = Math.round(TRACK_LEN / 14);
  for (let i = 0; i <= N; i++) { const j = i % N; for (let c = 0; c < C; c++) {
    const x = TX[j] + NX[j] * LAT[c], z = TZ[j] + NZ[j] * LAT[c]; pos.push(x, groundH(x, z) + 0.07, z); uv.push(c / (C - 1), i / N * vrep);
  } }
  for (let i = 0; i < N; i++) for (let c = 0; c < C - 1; c++) { const a = i * C + c, b = a + 1, d = a + C, e = d + 1; idx.push(a, d, b, b, d, e); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
  const tex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#d2a96a'; g.fillRect(0, 0, w, h);
    for (let k = 0; k < 90; k++) { g.globalAlpha = 0.05 + Math.random() * 0.12; g.fillStyle = Math.random() < 0.6 ? '#8a6436' : '#f1d59c'; g.fillRect(30 + Math.random() * (w - 60), 0, 1 + Math.random() * 4, h); }
    g.globalAlpha = 1; g.globalCompositeOperation = 'destination-in';
    const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.16, 'rgba(0,0,0,.92)'); gr.addColorStop(0.84, 'rgba(0,0,0,.92)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }, { repeat: true });
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, transparent: true, depthWrite: false, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  m.receiveShadow = true; m.renderOrder = 1; scene.add(m);
}

// ───────────────────────── water ─────────────────────────
const waterMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, fog: true,
  uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
    uTime: { value: 0 }, uSun: { value: SUN }, uShallow: { value: new THREE.Color(0x58f0dc) }, uMid: { value: new THREE.Color(0x12c2cf) },
    uDeep: { value: new THREE.Color(0x0a5fb8) }, uSky: { value: new THREE.Color(0xa9dcff) },
  }]),
  vertexShader: `attribute float aDepth; uniform float uTime; varying float vDepth; varying vec3 vWorld;
    #include <fog_pars_vertex>
    void main(){ vDepth=aDepth; vec3 p=position; float k=clamp(-aDepth/3.,0.,1.);
      p.y+=(sin(p.x*0.07+uTime*1.1)+sin(p.z*0.09-uTime*0.9))*0.09*k;
      vec4 wp=modelMatrix*vec4(p,1.); vWorld=wp.xyz; vec4 mvPosition=viewMatrix*wp; gl_Position=projectionMatrix*mvPosition;
      #include <fog_vertex>
    }`,
  fragmentShader: `uniform float uTime; uniform vec3 uSun,uShallow,uMid,uDeep,uSky; varying float vDepth; varying vec3 vWorld;
    #include <fog_pars_fragment>
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    void main(){ float d=clamp(-vDepth,0.,8.); vec2 uv=vWorld.xz; float t=uTime;
      vec2 g=0.10*vec2(cos(uv.x*0.35+t*1.3),cos(uv.y*0.4-t*1.1));
      g+=0.08*vec2(cos(uv.x*0.9-uv.y*0.6+t*1.9),cos(uv.y*1.1+uv.x*0.5-t*1.6));
      g+=0.06*vec2(cos(uv.x*2.3+uv.y*1.7+t*2.6),cos(uv.y*2.7-uv.x*1.3+t*2.2));
      g+=0.10*(vec2(noise(uv*0.8+t*0.5),noise(uv*0.8-t*0.5+7.))-0.5);
      vec3 n=normalize(vec3(-g.x,1.,-g.y)); vec3 v=normalize(cameraPosition-vWorld);
      float fres=pow(1.-max(dot(n,v),0.),4.);
      vec3 col=mix(uShallow,uMid,smoothstep(0.1,1.8,d)); col=mix(col,uDeep,smoothstep(1.4,6.5,d));
      float ca=noise(uv*0.9+vec2(t*0.6,-t*0.4))*noise(uv*1.7-vec2(t*0.5,t*0.7));
      col+=vec3(0.35,0.42,0.3)*ca*(1.-smoothstep(0.,3.5,d));
      col=mix(col,uSky,fres*0.7);
      float spec=pow(max(dot(n,normalize(v+uSun)),0.),260.); col+=vec3(1.,.95,.8)*spec*3.;
      float fn=noise(uv*0.35+vec2(t*0.25,0.));
      float line=0.16+0.14*sin(t*1.3+fn*6.283);
      float foam=(1.-smoothstep(line,line+0.16,d))+(1.-smoothstep(0.,0.12,abs(d-0.55-0.25*sin(t*0.9+fn*9.))))*0.55;
      foam*=0.55+0.45*noise(uv*2.6+t*0.4); foam=clamp(foam,0.,1.)*step(0.004,d);
      col=mix(col,vec3(1.),foam);
      float a=max(max(mix(0.42,0.95,smoothstep(0.,2.6,d)),foam),fres);
      gl_FragColor=vec4(col,a);
      #include <fog_fragment>
    }`,
});
{
  const WN = 200, geo = new THREE.PlaneGeometry(GS, GS, WN, WN); geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position, dep = new Float32Array(p.count);
  for (let i = 0; i < p.count; i++) dep[i] = Math.min(groundH(p.getX(i), p.getZ(i)), 0.4);
  geo.setAttribute('aDepth', new THREE.BufferAttribute(dep, 1));
  const w = new THREE.Mesh(geo, waterMat); w.renderOrder = 2; scene.add(w);
  const og = new THREE.PlaneGeometry(9000, 9000); og.rotateX(-Math.PI / 2);
  og.setAttribute('aDepth', new THREE.BufferAttribute(new Float32Array(4).fill(-9), 1));
  const o = new THREE.Mesh(og, waterMat); o.position.y = -0.06; o.renderOrder = 2; scene.add(o);
}

// ───────────────────────── scenery ─────────────────────────
const dummy = new THREE.Object3D(), tmpC = new THREE.Color();
function instanced(geo, mat, list, shadow = true) {
  const m = new THREE.InstancedMesh(geo, mat, list.length);
  list.forEach((it, i) => {
    dummy.position.set(it.x, it.y, it.z); dummy.rotation.set(it.rx || 0, it.ry || 0, it.rz || 0);
    if (it.s && it.s.length) dummy.scale.set(it.s[0], it.s[1], it.s[2]); else dummy.scale.setScalar(it.s || 1);
    dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); if (it.c !== undefined) m.setColorAt(i, tmpC.set(it.c));
  });
  m.castShadow = shadow; m.receiveShadow = true; scene.add(m); return m;
}
function rockGeo(detail, amp) {
  const g = new THREE.IcosahedronGeometry(1, detail), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + (fbm(x * 1.7 + z * 0.9 + 3, y * 1.7 - z * 0.6 + 8) - 0.47) * amp; p.setXYZ(i, x * k, y * k, z * k); }
  g.computeVertexNormals(); return g;
}
const rockMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true });
{
  // palms
  const trunk = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, -0.6, 0), new THREE.Vector3(0.5, 4, 0), new THREE.Vector3(1.5, 7.6, 0)), 8, 0.27, 6);
  const frond = (len, wid) => { const g = new THREE.PlaneGeometry(wid, len, 2, 6), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), t = (p.getY(i) + len / 2) / len; p.setXYZ(i, t * len * 0.92, Math.sin(t * 2.2) * 1.3 - t * t * 2.7 - Math.abs(x) * 0.4, x); }
    return g; };
  const fr = [];
  for (let k = 0; k < 9; k++) { const g = frond(4.6, 1.7); g.rotateZ((rand() - 0.5) * 0.35); g.rotateY(k / 9 * Math.PI * 2 + rand() * 0.3); g.translate(1.5, 7.5, 0); fr.push(g); }
  for (let k = 0; k < 5; k++) { const g = frond(3.4, 1.4); g.rotateZ(0.55); g.rotateY(k / 5 * Math.PI * 2 + 0.4); g.translate(1.5, 7.6, 0); fr.push(g); }
  const leafGeo = mergeGeometries(fr); leafGeo.computeVertexNormals();
  const leafTex = canvasTex(64, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.lineCap = 'round';
    for (let y = h - 4; y > 4; y -= 5) { const t = 1 - y / h, sp = 29 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.9 + 0.1)), 0.5);
      g.strokeStyle = `hsl(${105 + Math.random() * 20},${55 + Math.random() * 15}%,${27 + Math.random() * 14}%)`; g.lineWidth = 4.2;
      g.beginPath(); g.moveTo(32, y); g.lineTo(32 - sp, y - 13); g.moveTo(32, y); g.lineTo(32 + sp, y - 13); g.stroke(); }
    g.strokeStyle = '#6f8a2c'; g.lineWidth = 3; g.beginPath(); g.moveTo(32, h); g.lineTo(32, 6); g.stroke();
  });
  const palms = [], bushes = [], rocks = [], umb = [];
  let guard = 0;
  while (palms.length < 300 && guard++ < 40000) {
    const x = (rand() - 0.5) * 660, z = (rand() - 0.5) * 660, h = groundH(x, z), d = trackDist(x, z);
    if (d < 17.5 || h < 0.75 || h > 26) continue; if (d > 70 && rand() < 0.72) continue;
    if (Math.abs(groundH(x + 3, z) - h) + Math.abs(groundH(x, z + 3) - h) > 2.6) continue;
    palms.push({ x, y: h, z, ry: rand() * 6.3, rx: (rand() - 0.5) * 0.12, rz: (rand() - 0.5) * 0.12, s: 0.85 + rand() * 0.75 });
  }
  instanced(trunk, new THREE.MeshStandardMaterial({ color: 0x9a7350, roughness: 0.95 }), palms);
  instanced(leafGeo, new THREE.MeshStandardMaterial({ map: leafTex, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.75 }), palms);
  guard = 0;
  while (bushes.length < 420 && guard++ < 40000) {
    const x = (rand() - 0.5) * 620, z = (rand() - 0.5) * 620, h = groundH(x, z), d = trackDist(x, z);
    if (d < 19 || h < 3) continue; const s = 1.4 + rand() * 2.6;
    bushes.push({ x, y: h + s * 0.25, z, ry: rand() * 6, s: [s, s * (0.6 + rand() * 0.4), s], c: new THREE.Color().setHSL(0.27 + rand() * 0.08, 0.6, 0.24 + rand() * 0.14) });
  }
  instanced(rockGeo(1, 0.5), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true }), bushes);
  guard = 0;
  while (rocks.length < 150 && guard++ < 40000) {
    const x = (rand() - 0.5) * 640, z = (rand() - 0.5) * 640, h = groundH(x, z), d = trackDist(x, z);
    if (d < 16 || d > 48 || h < -1.2) continue; const s = 0.7 + rand() * rand() * 3.4;
    rocks.push({ x, y: h + s * 0.2, z, ry: rand() * 6, rx: rand(), s: [s * (0.8 + rand() * 0.6), s * (0.6 + rand() * 0.5), s], c: new THREE.Color().setHSL(0.07 + rand() * 0.03, 0.14, 0.42 + rand() * 0.16) });
  }
  // sea stacks with grassy caps
  const caps = [];
  for (let k = 0; k < 16; k++) {
    const th = rand() * Math.PI * 2, r = shoreR(th) + 48 + rand() * 120, x = Math.cos(th) * r, z = Math.sin(th) * r, s = 7 + rand() * 13, sy = s * (1.1 + rand() * 1.1);
    rocks.push({ x, y: sy * 0.25, z, ry: rand() * 6, s: [s, sy, s * (0.8 + rand() * 0.4)], c: new THREE.Color().setHSL(0.075, 0.2, 0.5 + rand() * 0.1) });
    caps.push({ x, y: sy * 1.12, z, ry: rand() * 6, s: [s * 0.78, s * 0.22, s * 0.7], c: 0x58ad3c });
    if (rand() < 0.7) palms.length; // (kept simple)
  }
  instanced(rockGeo(2, 0.7), rockMat, rocks);
  instanced(rockGeo(1, 0.3), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true }), caps);
  // beach umbrellas
  guard = 0; const UC = [0xff4a5c, 0xffc83a, 0x22b8ee, 0xff7ad1, 0xffffff, 0x44d07a];
  while (umb.length < 46 && guard++ < 40000) {
    const x = (rand() - 0.5) * 620, z = (rand() - 0.5) * 620, h = groundH(x, z), d = trackDist(x, z);
    if (d < 17 || d > 40 || h < 0.5 || h > 1.9) continue;
    umb.push({ x, y: h, z, ry: rand() * 6, rz: (rand() - 0.5) * 0.3, s: 1 + rand() * 0.3, c: UC[rand() * UC.length | 0] });
  }
  const cone = new THREE.ConeGeometry(2, 0.8, 12); cone.translate(0, 2.6, 0);
  const pole = new THREE.CylinderGeometry(0.05, 0.05, 2.7, 6); pole.translate(0, 1.3, 0);
  instanced(cone, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, side: THREE.DoubleSide }), umb);
  instanced(pole, new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.4 }), umb);
}
// rock arches over the track
const idxAtAngle = (deg, d) => { const th = deg * Math.PI / 180, r = shoreR(th) - d; return nearestIdx(Math.cos(th) * r, Math.sin(th) * r); };
function addArch(i, R = 22, tubeR = 6) {
  const g = new THREE.TorusGeometry(R, tubeR, 12, 30, Math.PI), p = g.attributes.position, nr = g.attributes.normal, col = new Float32Array(p.count * 3);
  const rc = new THREE.Color(0xa08a72), gc = new THREE.Color(0x58ad3c), c = new THREE.Color();
  for (let k = 0; k < p.count; k++) {
    const x = p.getX(k), y = p.getY(k), z = p.getZ(k), f = (fbm(x * 0.16 + z * 0.3 + i, y * 0.16 - z * 0.2) - 0.5) * 5.5, base = 1 + sstep(9, 0, y) * 0.5;
    p.setXYZ(k, x + nr.getX(k) * (f + (base - 1) * 4), y + nr.getY(k) * f * 0.8, (z + nr.getZ(k) * f) * 1.5 * base);
    c.copy(rc).multiplyScalar(0.8 + fbm(x * 0.4, y * 0.4) * 0.5).lerp(gc, sstep(0.45, 0.8, nr.getY(k)) * sstep(R * 0.7, R, y));
    col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, flatShading: true }));
  m.position.set(TX[i], TY[i] - 3.5, TZ[i]); m.rotation.y = HD[i]; m.castShadow = m.receiveShadow = true; scene.add(m);
}
addArch(idxAtAngle(128, 108)); addArch(idxAtAngle(224, -12), 23, 6.5); addArch(idxAtAngle(66, -14), 23, 6);

// lighthouse
{
  const th = -16 * Math.PI / 180, r = shoreR(th) + 42, x = Math.cos(th) * r, z = Math.sin(th) * r, G = new THREE.Group();
  const base = new THREE.Mesh(rockGeo(2, 0.6), new THREE.MeshStandardMaterial({ color: 0x94826f, roughness: 0.9, flatShading: true })); base.scale.set(17, 8, 15); base.position.y = -1;
  const stripes = canvasTex(8, 64, (g) => { for (let k = 0; k < 4; k++) { g.fillStyle = k % 2 ? '#fff' : '#e8323c'; g.fillRect(0, k * 16, 8, 16); } });
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 3.1, 20, 20), new THREE.MeshStandardMaterial({ map: stripes, roughness: 0.55 })); tower.position.y = 15.5;
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 2.6, 0.6, 20), new THREE.MeshStandardMaterial({ color: 0x24303d, roughness: 0.5 })); deck.position.y = 25.8;
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 2.6, 12), new THREE.MeshStandardMaterial({ color: 0xfff3b0, emissive: 0xffd76a, emissiveIntensity: 2.5 })); lamp.position.y = 27.4;
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.2, 2.4, 12), new THREE.MeshStandardMaterial({ color: 0xe8323c, roughness: 0.5 })); roof.position.y = 29.9;
  G.add(base, tower, deck, lamp, roof); G.position.set(x, 0, z); G.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; }); scene.add(G);
}
// stilt huts on the sea side of water sections
{
  const wood = new THREE.MeshStandardMaterial({ color: 0xc08a52, roughness: 0.85 }), dark = new THREE.MeshStandardMaterial({ color: 0x7a5232, roughness: 0.9 }), thatch = new THREE.MeshStandardMaterial({ color: 0xe2bc62, roughness: 1, flatShading: true });
  const hut = (x, z, ry) => { const G = new THREE.Group();
    const pf = new THREE.Mesh(new THREE.BoxGeometry(7, 0.3, 7), dark); pf.position.y = 1.7;
    const wl = new THREE.Mesh(new THREE.BoxGeometry(5, 2.6, 5), wood); wl.position.y = 3.15;
    const rf = new THREE.Mesh(new THREE.ConeGeometry(5, 3.2, 4), thatch); rf.position.y = 6; rf.rotation.y = Math.PI / 4;
    G.add(pf, wl, rf);
    for (const [a, b] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 6, 6), dark); s.position.set(a, -1.2, b); G.add(s); }
    G.position.set(x, 0, z); G.rotation.y = ry; G.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; }); scene.add(G); };
  for (const [deg, d] of [[58, -12], [78, -14], [232, -14], [212, -10]]) {
    const i0 = idxAtAngle(deg, d);
    for (let k = 0; k < 3; k++) { const i = (i0 + k * 11) % N, side = Math.sign(NX[i] * TX[i] + NZ[i] * TZ[i]) || 1, lat = side * (25 + (k % 2) * 7);
      hut(TX[i] + NX[i] * lat, TZ[i] + NZ[i] * lat, HD[i] + rand()); }
  }
  // sailboats far out
  for (let k = 0; k < 7; k++) { const a = rand() * 6.3, r = 480 + rand() * 500, G = new THREE.Group();
    const hull = new THREE.Mesh(new THREE.BoxGeometry(3, 1.6, 11), new THREE.MeshStandardMaterial({ color: 0xffffff })); hull.position.y = 0.5;
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute([0, 1.5, 4, 0, 1.5, -4, 0, 17, -1], 3)); sg.computeVertexNormals();
    const sail = new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ color: [0xffffff, 0xff5a6a, 0xffd04a][k % 3], side: THREE.DoubleSide }));
    G.add(hull, sail); G.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); G.rotation.y = rand() * 6; scene.add(G); }
}
// edge posts + corner chevrons
{
  const posts = [], signs = [];
  for (let i = 0; i < N; i += 7) for (const s of [-1, 1]) { const lat = s * (RW + 1.6), x = TX[i] + NX[i] * lat, z = TZ[i] + NZ[i] * lat, h = groundH(x, z);
    posts.push({ x, y: Math.max(h, -0.1) + 0.45, z, c: ((i / 7) | 0) % 2 ? 0xffffff : 0xff3344 }); }
  instanced(new THREE.CylinderGeometry(0.2, 0.26, 0.9, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }), posts);
  for (let i = 0; i < N; i += 5) if (Math.abs(CURV[i]) > 0.013) { const s = -Math.sign(CURV[i]), lat = s * (RW + 4.2), x = TX[i] + NX[i] * lat, z = TZ[i] + NZ[i] * lat;
    signs.push({ x, y: Math.max(groundH(x, z), 0) + 1.2, z, ry: HD[i] + Math.PI - s * 0.5 }); }
  const st = canvasTex(128, 64, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#ff2f45';
    for (let k = -1; k < 5; k++) { g.beginPath(); g.moveTo(k * 32, 0); g.lineTo(k * 32 + 16, 0); g.lineTo(k * 32 + 40, 32); g.lineTo(k * 32 + 16, 64); g.lineTo(k * 32, 64); g.lineTo(k * 32 + 24, 32); g.fill(); } });
  instanced(new THREE.BoxGeometry(4.4, 1.5, 0.15), new THREE.MeshStandardMaterial({ map: st, roughness: 0.6 }), signs);
}
// start gate + line
{
  const i = 0, G = new THREE.Group(), red = new THREE.MeshStandardMaterial({ color: 0x1668ff, roughness: 0.4, metalness: 0.2 });
  for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 11, 14), red); p.position.set(s * 14.6, 5, 0); G.add(p);
    const b = new THREE.Mesh(new THREE.SphereGeometry(1.1, 14, 10), new THREE.MeshStandardMaterial({ color: 0xffc83a, emissive: 0xffa600, emissiveIntensity: 0.8 })); b.position.set(s * 14.6, 11.2, 0); G.add(b); }
  const bt = canvasTex(1024, 128, (g, w, h) => { for (let y = 0; y < 4; y++) for (let x = 0; x < 32; x++) { g.fillStyle = (x + y) % 2 ? '#fff' : '#111'; g.fillRect(x * 32, y * 32, 32, 32); }
    g.fillStyle = '#1668ff'; g.fillRect(262, 14, 500, 100); g.fillStyle = '#fff'; g.font = 'italic 900 84px Avenir Next, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CORAL COAST', 512, 68); });
  const ban = new THREE.Mesh(new THREE.BoxGeometry(29.5, 3, 0.5), [red, red, red, red, new THREE.MeshStandardMaterial({ map: bt, roughness: 0.6 }), new THREE.MeshStandardMaterial({ map: bt, roughness: 0.6 })]); ban.position.y = 9.4; G.add(ban);
  G.position.set(TX[i], TY[i], TZ[i]); G.rotation.y = HD[i]; G.traverse(o => { if (o.isMesh) o.castShadow = true; }); scene.add(G);
  const lt = canvasTex(256, 32, (g) => { for (let y = 0; y < 2; y++) for (let x = 0; x < 16; x++) { g.fillStyle = (x + y) % 2 ? '#fff' : '#111'; g.fillRect(x * 16, y * 16, 16, 16); } });
  const lg = new THREE.PlaneGeometry(RW * 2 + 2, 2.2); lg.rotateX(-Math.PI / 2);
  const line = new THREE.Mesh(lg, new THREE.MeshStandardMaterial({ map: lt, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6, transparent: true, opacity: 0.92, depthWrite: false }));
  line.position.set(TX[i], TY[i] + 0.1, TZ[i]); line.rotation.y = HD[i]; line.renderOrder = 3; line.receiveShadow = true; scene.add(line);
}
// boost pads
const padTex = canvasTex(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(20,120,255,.55)'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = 12; g.lineJoin = 'miter';
  for (let k = -1; k < 3; k++) { g.beginPath(); g.moveTo(14, k * 64 + 10); g.lineTo(64, k * 64 + 48); g.lineTo(114, k * 64 + 10); g.stroke(); } }, { repeat: true });
const pads = [];
{
  const pg = new THREE.PlaneGeometry(5.2, 8); pg.rotateX(-Math.PI / 2);
  const pm = new THREE.MeshBasicMaterial({ map: padTex, color: new THREE.Color(1.0, 2.2, 3.2), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -8 });
  for (const f of [0.05, 0.17, 0.34, 0.5, 0.63, 0.8, 0.92]) {
    let i = Math.round(f * N), g = 0; while (g++ < 90 && (Math.abs(TY[(i + 6) % N] - TY[i]) > 0.25 || TY[i] < 0.2)) i = (i + 1) % N;
    const lat = (rand() - 0.5) * 8, x = TX[i] + NX[i] * lat, z = TZ[i] + NZ[i] * lat, m = new THREE.Mesh(pg, pm);
    m.position.set(x, groundH(x, z) + 0.16, z); m.rotation.y = HD[i]; m.renderOrder = 4; scene.add(m); pads.push({ i, lat });
  }
}
// coins
const coins = [];
{
  for (let i = 30; i < N - 30; i += 34) { const lane = [-5, 0, 5][rand() * 3 | 0], bend = (rand() - 0.5) * 1.2;
    if (pads.some(p => Math.abs(p.i - i) < 14)) continue;
    for (let k = 0; k < 5; k++) { const j = i + k * 3, lat = lane + bend * (k - 2), x = TX[j] + NX[j] * lat, z = TZ[j] + NZ[j] * lat;
      coins.push({ x, y: Math.max(groundH(x, z), 0) + 1.15, z, t: 0, ph: k * 0.5 }); } }
}
const coinGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.16, 22); coinGeo.rotateX(Math.PI / 2);
const coinMesh = new THREE.InstancedMesh(coinGeo, new THREE.MeshStandardMaterial({ color: 0xffc21a, metalness: 1, roughness: 0.22, emissive: 0xff9a00, emissiveIntensity: 0.55 }), coins.length);
coinMesh.castShadow = true; coinMesh.frustumCulled = false; scene.add(coinMesh);


// ───────────────────────── buggy models (classic / sports, tyre + rocket + glow options) ─────────────────────────
const tireMat = new THREE.MeshStandardMaterial({ color: 0x1b1c20, roughness: 0.92 }), darkMat = new THREE.MeshStandardMaterial({ color: 0x23262c, roughness: 0.5, metalness: 0.6 });
const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdfe6ee, roughness: 0.15, metalness: 1 });
const SHARED = new Set([tireMat, darkMat, chromeMat]);
const Y = new THREE.Vector3(0, 1, 0);
function tube(a, b, r, mat) { const d = new THREE.Vector3().subVectors(b, a), m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 7), mat);
  m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(Y, d.normalize()); return m; }
const glowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.clearRect(0, 0, w, h); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
function buildBuggy(look) {
  const sports = look.body === 'sports', big = look.tyres === 'big';
  const WR = big ? 0.86 : 0.62, WW = big ? 0.78 : 0.52, L = WR - 0.62, WX = big ? 1.2 : 1.08;
  const V = (x, y, z) => new THREE.Vector3(x, y + L, z);
  const G = new THREE.Group(), body = new THREE.Group(); G.add(body);
  const paint = new THREE.MeshPhysicalMaterial({ color: look.paint, roughness: look.metal ? 0.12 : 0.32, metalness: look.metal ? 1 : 0.25, clearcoat: 1, clearcoatRoughness: 0.1 });
  const rim = new THREE.MeshStandardMaterial({ color: look.rim, roughness: 0.3, metalness: 0.5, emissive: look.rim, emissiveIntensity: 0.9 });
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }), lamp = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff2c0, emissiveIntensity: 2 });
  const box = (w, h, d, x, y, z, m, rx = 0) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y + L, z); o.rotation.x = rx; body.add(o); return o; };
  // driver
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.27, 14, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 }));
  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), new THREE.MeshStandardMaterial({ color: 0x10151c, roughness: 0.1, metalness: 0.8 }));
  let exY = 1.2, exZ = -2.0;
  if (!sports) {
    box(1.5, 0.28, 3.0, 0, 0.78, 0, darkMat);
    box(1.46, 0.42, 1.25, 0, 1.0, 1.15, paint, 0.2);
    box(0.5, 0.06, 1.2, 0, 1.24, 1.13, white, 0.2);
    for (const s of [-1, 1]) { box(0.34, 0.5, 1.9, s * 0.86, 0.95, -0.15, paint); box(0.16, 0.16, 0.1, s * 0.5, 1.02, 1.8, lamp); }
    box(1.5, 0.5, 0.9, 0, 1.05, -1.25, paint); box(0.9, 0.3, 0.6, 0, 1.4, -1.3, darkMat); box(0.62, 0.75, 0.2, 0, 1.3, -0.62, darkMat);
    helmet.position.set(0, 1.78 + L, -0.42); visor.position.set(0, 1.8 + L, -0.27);
    box(0.34, 0.45, 0.24, 0, 1.38, -0.42, new THREE.MeshStandardMaterial({ color: look.paint, roughness: 0.7 }));
    for (const s of [-1, 1]) {
      body.add(tube(V(s * 0.7, 1.05, 0.62), V(s * 0.62, 2.1, 0.05), 0.055, darkMat), tube(V(s * 0.62, 2.1, 0.05), V(s * 0.62, 2.1, -0.95), 0.055, darkMat),
        tube(V(s * 0.62, 2.1, -0.95), V(s * 0.72, 1.1, -1.6), 0.055, darkMat), tube(V(s * 0.62, 2.1, -0.5), V(s * 0.72, 1.1, -0.6), 0.045, darkMat),
        tube(V(s * 0.45, 1.6, -1.75), V(s * 0.45, 1.98, -1.85), 0.04, darkMat));
      if (!look.rocket) body.add(tube(V(s * 0.3, 1.5, -1.5), V(s * 0.3, 1.2, -2.0), 0.07, chromeMat));
    }
    body.add(tube(V(-0.62, 2.1, 0.05), V(0.62, 2.1, 0.05), 0.055, darkMat), tube(V(-0.62, 2.1, -0.95), V(0.62, 2.1, -0.95), 0.055, darkMat), tube(V(-0.8, 0.72, 1.86), V(0.8, 0.72, 1.86), 0.08, chromeMat));
    box(1.3, 0.06, 1.05, 0, 2.15, -0.45, paint); box(1.9, 0.07, 0.5, 0, 2.02, -1.88, paint);
    for (let k = 0; k < 4; k++) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.12, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe9a8, emissiveIntensity: 2.2 }));
      l.rotation.x = Math.PI / 2; l.position.set(-0.48 + k * 0.32, 2.3 + L, 0.08); body.add(l); }
  } else {
    // low wedge sports buggy
    box(1.62, 0.22, 3.5, 0, 0.66, 0, darkMat);
    box(1.52, 0.3, 1.6, 0, 0.84, 1.25, paint, 0.14);
    box(0.34, 0.02, 1.62, 0, 1.0, 1.25, white, 0.14);
    box(1.2, 0.05, 0.05, 0, 0.88, 2.05, lamp);
    for (const s of [-1, 1]) { box(0.44, 0.44, 2.1, s * 0.84, 0.86, -0.25, paint); box(0.46, 0.08, 1.6, s * 0.84, 1.1, -0.25, darkMat); }
    box(1.0, 0.32, 1.25, 0, 0.92, -0.25, darkMat);
    box(1.05, 0.38, 0.05, 0, 1.18, 0.42, new THREE.MeshPhysicalMaterial({ color: 0x9fd8ff, roughness: 0.05, metalness: 0, transmission: 0.6, transparent: true, opacity: 0.55 }), -0.65);
    box(1.34, 0.5, 1.2, 0, 1.05, -1.45, paint, -0.18); box(0.5, 0.34, 0.55, 0, 1.42, -1.0, darkMat);
    box(2.3, 0.08, 0.62, 0, 1.98, -2.05, paint); for (const s of [-1, 1]) { box(0.06, 0.55, 0.75, s * 1.15, 1.85, -2.05, darkMat); body.add(tube(V(s * 0.45, 1.25, -1.85), V(s * 0.45, 1.95, -2.0), 0.05, darkMat)); }
    for (const s of [-1, 1]) body.add(tube(V(s * 0.48, 1.0, -0.82), V(s * 0.44, 1.78, -0.86), 0.06, chromeMat));
    body.add(tube(V(-0.44, 1.78, -0.86), V(0.44, 1.78, -0.86), 0.06, chromeMat));
    helmet.position.set(0, 1.5 + L, -0.45); visor.position.set(0, 1.52 + L, -0.3);
    box(0.34, 0.36, 0.24, 0, 1.18, -0.45, new THREE.MeshStandardMaterial({ color: look.paint, roughness: 0.7 }));
    if (!look.rocket) for (const s of [-1, 1]) body.add(tube(V(s * 0.3, 1.2, -1.95), V(s * 0.3, 1.1, -2.25), 0.08, chromeMat));
    exY = 1.12; exZ = -2.25;
  }
  body.add(helmet, visor);
  // rockets
  const flames = []; const rocket = !!look.rocket;
  if (rocket) for (const s of [-1, 1]) {
    const x = s * 0.62, y = (sports ? 1.38 : 1.45) + L;
    const rb = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.3, 14), new THREE.MeshStandardMaterial({ color: 0xf2f4f7, roughness: 0.3, metalness: 0.7 })); rb.rotation.x = Math.PI / 2; rb.position.set(x, y, -1.45); body.add(rb);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.42, 14), new THREE.MeshStandardMaterial({ color: 0xff2a3d, roughness: 0.35, metalness: 0.4 })); tip.rotation.x = Math.PI / 2; tip.position.set(x, y, -0.6); body.add(tip);
    const nz = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.25, 0.3, 14, 1, true), darkMat); nz.rotation.x = Math.PI / 2; nz.position.set(x, y, -2.2); body.add(nz);
    for (const r of [0, 1, 2]) { const fin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.26, 0.34), new THREE.MeshStandardMaterial({ color: 0xff2a3d })); const a = r * 2.094; fin.position.set(x + Math.sin(a) * 0.24, y + Math.cos(a) * 0.24, -1.95); fin.rotation.z = -a; body.add(fin); }
    exY = y; exZ = -2.35;
  }
  const flameCol = rocket ? new THREE.Color(4.5, 1.7, 0.45) : new THREE.Color(0.5, 2.2, 4.5);
  for (const s of [-1, 1]) { const fg = new THREE.ConeGeometry(rocket ? 0.22 : 0.16, rocket ? 2.6 : 1.6, 10); fg.rotateX(-Math.PI / 2); fg.translate(0, 0, rocket ? -1.3 : -0.8);
    const f = new THREE.Mesh(fg, new THREE.MeshBasicMaterial({ color: flameCol, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
    f.position.set(s * (rocket ? 0.62 : 0.3), rocket ? exY : exY + L, exZ); f.visible = false; body.add(f); flames.push(f); }
  // underglow
  if (look.glow) { const gm = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4.6), new THREE.MeshBasicMaterial({ map: glowTex, color: new THREE.Color(look.glow).multiplyScalar(2.2), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
    gm.rotation.x = -Math.PI / 2; gm.position.y = 0.08; gm.renderOrder = 3; G.add(gm); flames.glow = gm; }
  // wheels
  const wheels = [];
  const tg = new THREE.CylinderGeometry(WR, WR, WW, 22); tg.rotateZ(Math.PI / 2);
  const rg = new THREE.CylinderGeometry(WR * 0.6, WR * 0.6, WW + 0.02, 14); rg.rotateZ(Math.PI / 2);
  const kg = new THREE.BoxGeometry(WW - 0.02, big ? 0.14 : 0.09, WR * 2.1);
  for (const [sx, z, front] of [[1, 1.18, 1], [-1, 1.18, 1], [1, -1.2, 0], [-1, -1.2, 0]]) {
    const x = sx * WX, pivot = new THREE.Group(), spin = new THREE.Group(); pivot.position.set(x, WR, z); pivot.add(spin);
    spin.add(new THREE.Mesh(tg, tireMat), new THREE.Mesh(rg, rim));
    for (let k = 0; k < (big ? 8 : 6); k++) { const kn = new THREE.Mesh(kg, tireMat); kn.rotation.x = k * Math.PI / (big ? 8 : 6); spin.add(kn); }
    const sp = new THREE.Mesh(new THREE.BoxGeometry(WW + 0.06, 0.1, WR), chromeMat), sp2 = sp.clone(); sp2.rotation.x = Math.PI / 2; spin.add(sp, sp2);
    G.add(pivot); wheels.push({ pivot, spin, front });
    body.add(tube(V(sx * 0.6, 0.85, z), new THREE.Vector3(x * 0.82, WR + 0.04, z), big ? 0.07 : 0.05, darkMat));
  }
  G.traverse(o => { if (o.isMesh) o.castShadow = o.material.blending !== THREE.AdditiveBlending; });
  return { G, body, wheels, flames, wr: WR };
}
function disposeModel(m) { m.G.traverse(o => { if (o.isMesh) { o.geometry.dispose(); if (!SHARED.has(o.material)) o.material.dispose(); } }); }

// ───────────────────────── garage catalogue, profiles, leaderboard ─────────────────────────
const PAINTS = [
  { id: 'lava', name: 'Lava Red', col: 0xe8232f, rim: 0x2b7bff, price: 0 },
  { id: 'ocean', name: 'Ocean Blue', col: 0x1e6bff, rim: 0xffd23a, price: 40 },
  { id: 'lime', name: 'Lagoon Lime', col: 0x5fd31f, rim: 0xff3d9a, price: 40 },
  { id: 'sunset', name: 'Sunset Gold', col: 0xffb000, rim: 0xff3d7f, price: 60 },
  { id: 'violet', name: 'Neon Violet', col: 0x8b2cf5, rim: 0x22f5d0, price: 60 },
  { id: 'midnight', name: 'Midnight', col: 0x1a1d29, rim: 0xff6a00, price: 80 },
  { id: 'pearl', name: 'Pearl White', col: 0xf2f2ee, rim: 0x00c2ff, price: 80 },
  { id: 'chrome', name: 'Liquid Chrome', col: 0xc9d3dd, rim: 0xff2e88, price: 300, metal: true },
];
const PARTS = [
  { id: 'magnet', name: 'Coin Magnet', price: 120, icon: '🧲', desc: 'Pulls in coins from more than twice as far away.' },
  { id: 'tyres', name: 'Monster Tyres', price: 150, icon: '🛞', desc: 'Huge knobbly tyres. Sand, grass and shallows barely slow you down.' },
  { id: 'drift', name: 'Drift Kit', price: 200, icon: '🌀', desc: 'Drift boosts charge faster and fire 45% longer.' },
  { id: 'engine', name: 'Turbo Engine', price: 250, icon: '⚙️', desc: '+12% acceleration and +3% top speed.' },
  { id: 'rocket', name: 'Rocket Boost', price: 400, icon: '🚀', desc: 'Twin rockets: nitro pushes harder (+55%) and burns 25% slower.' },
  { id: 'sports', name: 'Sports Buggy', price: 600, icon: '🏎️', desc: 'Low-slung race body: +5% top speed, +4% acceleration, sharper grip.' },
  { id: 'glow', name: 'Neon Underglow', price: 90, icon: '✨', desc: 'Glows under your buggy in your rim colour. Pure style.' },
];
const PLACE_BONUS = [30, 20, 14, 10, 7, 5];
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
const profiles = store.get('ccr_profiles', {});
const newProfile = (nick) => ({ nick, coins: 0, owned: ['lava'], eq: { paint: 'lava' }, races: 0, wins: 0, best: 0, lap: 0, earned: 0, ts: 0 });
function getProfile(nick) { const key = nick.toLowerCase(); if (!profiles[key]) { profiles[key] = newProfile(nick); saveProfiles(); } return profiles[key]; }
function saveProfiles() { store.set('ccr_profiles', profiles); }
function paintOf(p) { return PAINTS.find(x => x.id === p.eq.paint) || PAINTS[0]; }
function lookOf(p) { const pa = paintOf(p), e = p.eq; return { paint: pa.col, rim: pa.rim, metal: !!pa.metal, body: e.sports ? 'sports' : 'classic', tyres: e.tyres ? 'big' : 'std', rocket: !!e.rocket, glow: e.glow ? pa.rim : 0 }; }
const BASE_ST = { top: 1, acc: 1, grip: 1, off: 1, boost: 1.36, burn: 0.3, magnet: 1, drift: 0.55, driftT: 0.7 };
function statsOf(p) {
  const e = p.eq, s = { ...BASE_ST };
  if (e.engine) { s.acc *= 1.12; s.top *= 1.03; }
  if (e.tyres) s.off = 0.4;
  if (e.sports) { s.top *= 1.05; s.acc *= 1.04; s.grip = 1.15; }
  if (e.rocket) { s.boost = 1.55; s.burn = 0.225; }
  if (e.drift) { s.drift = 0.8; s.driftT = 0.5; }
  if (e.magnet) s.magnet = 2.3;
  return s;
}
const LIVERY = [[0x1e6bff, 0xffd23a], [0xffc21a, 0xff4a5c], [0x22c55e, 0xffffff], [0xa855f7, 0x5eead4], [0xff7a1a, 0x2dd4ff], [0xe8232f, 0x2b7bff]];
const BOT_NAMES = ['Azul', 'Sunny', 'Mango', 'Orchid', 'Blaze', 'Coral'];
const botLook = (k) => ({ paint: LIVERY[k][0], rim: LIVERY[k][1], metal: false, body: 'classic', tyres: 'std', rocket: false, glow: 0 });
const board = store.get('ccr_board', {});
function boardEntry(p) { return { nick: p.nick, wins: p.wins, races: p.races, best: p.best, lap: p.lap, earned: p.earned, paint: paintOf(p).col, body: p.eq.sports ? 1 : 0, ts: p.ts }; }
function mergeBoard(list) {
  let ch = false;
  for (const e of list || []) {
    if (!e || typeof e.nick !== 'string' || !/^[\w \-]{2,14}$/.test(e.nick)) continue;
    const key = e.nick.toLowerCase(), cur = board[key];
    const clean = { nick: e.nick, wins: +e.wins | 0, races: +e.races | 0, best: +e.best || 0, lap: +e.lap || 0, earned: +e.earned | 0, paint: +e.paint | 0, body: +e.body | 0, ts: +e.ts || 0 };
    if (!cur || clean.races > cur.races || (clean.races === cur.races && clean.ts > cur.ts)) { board[key] = clean; ch = true; }
  }
  if (ch) store.set('ccr_board', board);
  return ch;
}
const sortedBoard = () => Object.values(board).sort((a, b) => b.wins - a.wins || (a.best || 1e9) - (b.best || 1e9) || b.earned - a.earned);
for (const p of Object.values(profiles)) mergeBoard([boardEntry(p)]);

// ───────────────────────── cars ─────────────────────────
const cars = LIVERY.map((_, k) => ({ k, name: BOT_NAMES[k], model: null, lookKey: '', ctrl: 'ai', st: BASE_ST, view: null, prof: null, x: 0, y: 0, z: 0, h: 0, vx: 0, vz: 0, vy: 0, steer: 0, idx: 0, dist: 0, lap: -1, lat: 0, off: 0,
  grounded: true, air: 0, gPrev: 0, up: new THREE.Vector3(0, 1, 0), boostT: 0, nitro: 0.5, drift: 0, base: [0.9, 0.925, 0.95, 0.97, 0.99, 1][k], skill: 1,
  lane: 0, laneT: 0, laneTarget: 0, finished: false, finishT: 0, lapStart: 0, bestLap: 0, coins: 0, wrongT: 0, spin: 0, emit: 0, vf: 0, vl: 0, net: null, reward: null }));
function setLook(c, look) {
  const key = JSON.stringify(look); if (key === c.lookKey && c.model) return;
  const keep = c.model && c.model.G.position.clone();
  if (c.model) { scene.remove(c.model.G); disposeModel(c.model); }
  c.model = buildBuggy(look); c.lookKey = key; c.look = look; scene.add(c.model.G); if (keep) c.model.G.position.copy(keep);
}
function placeCar(c, i, lat) {
  i = (i + N) % N; c.x = TX[i] + NX[i] * lat; c.z = TZ[i] + NZ[i] * lat; c.h = HD[i]; c.idx = i; c.y = Math.max(groundH(c.x, c.z), -0.55); c.gPrev = c.y;
  c.vx = c.vz = c.vy = 0; c.steer = 0; c.grounded = true; c.air = 0; c.up.set(0, 1, 0);
}
let mode = 'solo', locals = [], netHost = false, splitLayout = store.get('ccr_split', 'lr');
let finishOrder = 0, raceT = 0, state = 'menu', countT = 0, lastCount = 9, resultsOpen = false, resultsT = 0;
function resetRace() {
  cars.forEach((c, k) => {
    placeCar(c, N - 7 - 7 * (k >> 1), k % 2 ? -3.6 : 3.6); c.dist = c.idx - N; c.lap = -1; c.finished = false; c.finishT = 0; c.bestLap = 0; c.coins = 0; c.nitro = 0.5; c.boostT = 0;
    c.lane = c.laneTarget = k % 2 ? -3.6 : 3.6; c.laneT = 2 + rand() * 3; c.wrongT = 0; c.drift = 0; c.auto = AUTO && c.ctrl === 'local'; c.net = null; c.reward = null; c.spin = 0;
  });
  coins.forEach(c => c.t = 0); finishOrder = 0; raceT = 0;
}
const isHuman = (c) => c.ctrl === 'local' || (c.ctrl === 'remote' && !c.bot);

const aiOut = { throttle: 0, steer: 0, hand: false, nitro: false };
function aiInput(c, dt, out) {
  const v = Math.hypot(c.vx, c.vz), j = (c.idx + Math.floor(7 + v * 0.42)) % N;
  c.laneT -= dt; if (c.laneT < 0) { c.laneT = 2 + rand() * 4; c.laneTarget = (rand() * 2 - 1) * 5.5; }
  c.lane += (c.laneTarget - c.lane) * dt * 0.7;
  const dh = wrapA(Math.atan2(TX[j] + NX[j] * c.lane - c.x, TZ[j] + NZ[j] * c.lane - c.z) - c.h);
  out.steer = clamp(dh * 2.4, -1, 1);
  let target = 999;
  for (let k = 0; k < 54; k += 3) { const vc = VC[(c.idx + k) % N] * (0.94 + c.base * 0.1) * c.st.top, allow = Math.sqrt(vc * vc + 2 * 28 * k * SP); if (allow < target) target = allow; }
  out.throttle = state === 'race' || state === 'finish' ? (v < target ? 1 : v > target + 4 ? -1 : 0) : 0;
  out.hand = false; out.nitro = false;
}

function stepCar(c, I, dt) {
  const S = c.st, sh = Math.sin(c.h), ch = Math.cos(c.h);
  let vf = c.vx * sh + c.vz * ch, vl = c.vx * ch - c.vz * sh;
  const onGround = c.air < 0.1, human = c.ctrl === 'local' && !c.auto && !c.finished;
  if (human) {
    if (I.nitro && c.nitro > 0 && state === 'race') { c.nitro = Math.max(0, c.nitro - S.burn * dt); c.boostT = Math.max(c.boostT, 0.12); }
    if (I.hand && onGround && Math.abs(vl) > 3.5 && vf > 12) c.drift += dt;
    else { if (c.drift > S.driftT && !I.hand) { c.boostT = Math.max(c.boostT, Math.min(1.6, c.drift * S.drift)); sfx.boost(); flash(c.view, 'DRIFT BOOST!', 0.6, true); } if (!I.hand) c.drift = 0; }
  }
  const boosting = c.boostT > 0; c.boostT = Math.max(0, c.boostT - dt);
  const maxV = MAXV * c.skill * S.top * (boosting ? S.boost : 1);
  if (onGround) {
    if (I.throttle > 0) vf += ACC * S.acc * (boosting ? 1.9 : 1) * I.throttle * Math.max(0, 1 - vf / maxV) * dt;
    else if (I.throttle < 0) { if (vf > 0.5) vf -= 38 * dt; else vf -= 14 * dt * Math.max(0, 1 + vf / 13); }
    else vf -= vf * 0.55 * dt;
    if (boosting && vf < maxV) vf += 10 * dt;
    const water = c.gPrev < -0.12 ? 0.1 * S.off : 0;
    vf -= vf * (0.12 + 0.7 * c.off * S.off + water) * dt;
    if (vf > maxV) vf -= (vf - maxV) * 1.2 * dt;
    vl *= Math.exp(-(I.hand ? 2.1 : 9 * S.grip) * dt);
    if (I.hand) vf -= vf * 0.3 * dt;
  }
  c.steer += (I.steer - c.steer) * Math.min(1, dt * 7);
  c.h += c.steer * 2.15 * S.grip * clamp(vf / 10, -1, 1) / (1 + Math.abs(vf) / 75) * (I.hand ? 1.5 / S.grip : 1) * (onGround ? 1 : 0.2) * dt;
  c.vx = sh * vf + ch * vl; c.vz = ch * vf - sh * vl; c.vf = vf; c.vl = vl;
  c.x += c.vx * dt; c.z += c.vz * dt;
  const old = c.idx; c.idx = nearestIdx(c.x, c.z, c.idx, 30);
  let dI = c.idx - old; if (dI > N / 2) dI -= N; if (dI < -N / 2) dI += N; c.dist += dI;
  const i = c.idx, nx = NX[i], nz = NZ[i]; let lat = (c.x - TX[i]) * nx + (c.z - TZ[i]) * nz;
  if (Math.abs(lat) > WALL) { const s = Math.sign(lat), over = lat - s * WALL; c.x -= nx * over; c.z -= nz * over; lat = s * WALL;
    const vn = c.vx * nx + c.vz * nz; if (vn * s > 0) { c.vx -= nx * vn * 1.25; c.vz -= nz * vn * 1.25; c.vx *= 0.99; c.vz *= 0.99; }
    const fwd = Math.abs(wrapA(c.h - HD[i])) < Math.PI / 2 ? HD[i] : HD[i] + Math.PI;
    c.h += wrapA(fwd - c.h) * Math.min(1, 5 * dt); }
  c.lat = lat; c.off = clamp((Math.abs(lat) - RW - 0.5) / 3.5, 0, 1);
  const g = Math.max(groundH(c.x, c.z), -0.55);
  if (c.y <= g + 0.02) { c.vy = clamp((g - c.gPrev) / dt, -40, 26); c.y = g; if (!c.grounded && c.air > 0.25) land(c); c.grounded = true; c.air = 0; }
  else { c.vy -= GRAV * dt; c.y += c.vy * dt; if (c.y <= g) { c.y = g; c.vy = 0; if (c.air > 0.25) land(c); c.grounded = true; c.air = 0; } else { c.grounded = false; c.air += dt; } }
  c.gPrev = g;
  for (const p of pads) if (Math.abs(p.i - c.idx) < 4 && Math.abs(p.lat - lat) < 3 && c.grounded && c.boostT < 1) { c.boostT = 1.6; if (c.view) { sfx.boost(); flash(c.view, 'BOOST!', 0.6, true); } }
  const lapNow = Math.floor(c.dist / N);
  if (lapNow > c.lap && !c.finished) {
    if (c.lap >= 0) { const lt = raceT - c.lapStart; if (!c.bestLap || lt < c.bestLap) c.bestLap = lt; }
    c.lap = lapNow; c.lapStart = raceT;
    if (c.lap >= LAPS) { c.finished = true; c.finishT = raceT; finishOrder++; if (c.ctrl === 'local') onLocalFinish(c); }
    else if (c.view && c.lap > 0) flash(c.view, c.lap === LAPS - 1 ? 'FINAL LAP!' : 'LAP ' + (c.lap + 1), 1.4, true);
  }
}
function land(c) { for (let k = 0; k < 14; k++) emitDust(c, true); if (c.view) c.view.shake = 0.35; }
// remote cars: smooth towards the latest snapshot, extrapolated by its velocity
const r2 = (v) => Math.round(v * 100) / 100;
function packCar(c) { return [c.k, r2(c.x), r2(c.y), r2(c.z), r2(c.h), r2(c.vx), r2(c.vy), r2(c.vz), r2(c.vf), r2(c.vl), r2(c.steer), c.dist, c.boostT > 0 ? 1 : 0, c.finished ? r2(c.finishT) : 0, c.coins, r2(c.bestLap)]; }
function applyRemote(a) {
  const c = cars[a[0]]; if (!c || c.ctrl !== 'remote' || !Array.isArray(a)) return;
  c.net = { x: +a[1], y: +a[2], z: +a[3], h: +a[4], vx: +a[5], vy: +a[6], vz: +a[7], t: performance.now() };
  c.vf = +a[8]; c.vl = +a[9]; c.steer = +a[10]; c.dist = +a[11]; c.boostT = a[12] ? 0.15 : 0; c.coins = a[14] | 0; c.bestLap = +a[15] || 0;
  c.lap = Math.floor(c.dist / N);
  if (a[13] && !c.finished) { c.finished = true; c.finishT = +a[13]; finishOrder++; }
}
function stepRemote(c, dt) {
  const n = c.net; if (!n) return;
  const age = Math.min(0.3, (performance.now() - n.t) / 1000), tx = n.x + n.vx * age, tz = n.z + n.vz * age, ty = n.y + n.vy * age;
  if (Math.hypot(tx - c.x, tz - c.z) > 18) { c.x = tx; c.z = tz; c.y = ty; c.h = n.h; }
  const k = Math.min(1, dt * 12); c.x += (tx - c.x) * k; c.z += (tz - c.z) * k; c.y += (Math.max(ty, groundH(c.x, c.z)) - c.y) * k; c.h += wrapA(n.h - c.h) * k;
  c.vx = n.vx; c.vz = n.vz; c.vy = n.vy;
  const g = Math.max(groundH(c.x, c.z), -0.55); c.y = Math.max(c.y, g); c.grounded = c.y < g + 0.25; c.air = c.grounded ? 0 : c.air + dt; c.gPrev = g;
  c.idx = nearestIdx(c.x, c.z, c.idx, 30);
}

// ───────────────────────── particles ─────────────────────────
const PN = 1400, pPos = new Float32Array(PN * 3), pCol = new Float32Array(PN * 4), pSize = new Float32Array(PN), pVel = new Float32Array(PN * 3), pLife = new Float32Array(PN), pMax = new Float32Array(PN), pS0 = new Float32Array(PN), pA0 = new Float32Array(PN);
let pNext = 0;
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pGeo.setAttribute('aColor', new THREE.BufferAttribute(pCol, 4)); pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
const pMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uScale: { value: 600 } },
  vertexShader: `attribute vec4 aColor; attribute float aSize; uniform float uScale; varying vec4 vC; void main(){ vC=aColor; vec4 mv=modelViewMatrix*vec4(position,1.); vC.a*=smoothstep(2.5,7.,-mv.z); gl_PointSize=min(aSize*uScale/max(-mv.z,0.1),160.); gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `varying vec4 vC; void main(){ float r=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.12,r)*vC.a; if(a<0.004) discard; gl_FragColor=vec4(vC.rgb,a); }` });
const pts = new THREE.Points(pGeo, pMat); pts.frustumCulled = false; pts.renderOrder = 5; scene.add(pts);
function emit(x, y, z, vx, vy, vz, life, size, r, g, b, a) {
  const i = pNext; pNext = (pNext + 1) % PN; pPos[i * 3] = x; pPos[i * 3 + 1] = y; pPos[i * 3 + 2] = z; pVel[i * 3] = vx; pVel[i * 3 + 1] = vy; pVel[i * 3 + 2] = vz;
  pLife[i] = pMax[i] = life; pS0[i] = size; pA0[i] = a; pCol[i * 4] = r; pCol[i * 4 + 1] = g; pCol[i * 4 + 2] = b;
}
function emitDust(c, burst) {
  const sh = Math.sin(c.h), ch = Math.cos(c.h), side = (Math.random() < 0.5 ? -1 : 1) * 1.05, bx = c.x - sh * 1.3 + ch * side, bz = c.z - ch * 1.3 - sh * side;
  const wet = c.gPrev < -0.08, sp = burst ? 5 : 2.5;
  if (wet) emit(bx, 0.15, bz, -c.vx * 0.12 + (Math.random() - 0.5) * 5, 3.5 + Math.random() * 5, -c.vz * 0.12 + (Math.random() - 0.5) * 5, 0.7 + Math.random() * 0.4, 0.5 + Math.random() * 0.6, 0.92, 1, 1, 0.75);
  else emit(bx, c.y + 0.25, bz, c.vx * 0.12 + (Math.random() - 0.5) * sp, 0.8 + Math.random() * 2.2, c.vz * 0.12 + (Math.random() - 0.5) * sp, 0.7 + Math.random() * 0.6, 0.5 + Math.random() * 0.5, 0.9, 0.87, 0.82, burst ? 0.3 : 0.16);
}
function updateParticles(dt) {
  for (let i = 0; i < PN; i++) {
    if (pLife[i] <= 0) { pSize[i] = 0; continue; }
    pLife[i] -= dt; const t = 1 - pLife[i] / pMax[i], wet = pCol[i * 4 + 2] > 0.9;
    pVel[i * 3 + 1] -= (wet ? 14 : 1.2) * dt; pPos[i * 3] += pVel[i * 3] * dt; pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt; pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt;
    pSize[i] = pS0[i] * (1 + t * (wet ? 1.2 : 3.2)); pCol[i * 4 + 3] = pA0[i] * (1 - t) * Math.min(1, t * 8);
  }
  pGeo.attributes.position.needsUpdate = pGeo.attributes.aColor.needsUpdate = pGeo.attributes.aSize.needsUpdate = true;
}

// ───────────────────────── audio ─────────────────────────
let AC = null, muted = false, master, eng1, eng2, engGain, engFilt, windGain, noiseBuf;
function initAudio() {
  if (AC) return; try {
    AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = 0.6; master.connect(AC.destination);
    engFilt = AC.createBiquadFilter(); engFilt.type = 'lowpass'; engFilt.frequency.value = 500; engGain = AC.createGain(); engGain.gain.value = 0; engFilt.connect(engGain); engGain.connect(master);
    eng1 = AC.createOscillator(); eng1.type = 'sawtooth'; eng2 = AC.createOscillator(); eng2.type = 'square'; const g2 = AC.createGain(); g2.gain.value = 0.5;
    eng1.connect(engFilt); eng2.connect(g2); g2.connect(engFilt); eng1.start(); eng2.start();
    noiseBuf = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const ws = AC.createBufferSource(); ws.buffer = noiseBuf; ws.loop = true; const wf = AC.createBiquadFilter(); wf.type = 'bandpass'; wf.frequency.value = 900; wf.Q.value = 0.4;
    windGain = AC.createGain(); windGain.gain.value = 0; ws.connect(wf); wf.connect(windGain); windGain.connect(master); ws.start();
  } catch (e) { AC = null; }
}
function tone(f0, f1, dur, type = 'sine', vol = 0.2) { if (!AC || muted) return; const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime; o.type = type;
  o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur); o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02); }
const sfx = {
  coin() { tone(1250, 1300, 0.07, 'square', 0.07); setTimeout(() => tone(1880, 1900, 0.16, 'square', 0.07), 60); },
  beep(hi) { tone(hi ? 980 : 490, hi ? 980 : 490, hi ? 0.6 : 0.22, 'square', 0.12); },
  boost() { if (!AC || muted) return; const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(), t = AC.currentTime; s.buffer = noiseBuf; f.type = 'bandpass'; f.Q.value = 1.2;
    f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(3200, t + 0.5); g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.8); s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + 0.85); },
  win() { [523, 659, 784, 1047].forEach((f, k) => setTimeout(() => tone(f, f, 0.3, 'triangle', 0.16), k * 130)); },
  buy() { [660, 880, 1320].forEach((f, k) => setTimeout(() => tone(f, f * 1.01, 0.12, 'square', 0.06), k * 70)); },
  ping() { tone(880, 1320, 0.18, 'triangle', 0.14); setTimeout(() => tone(1320, 1760, 0.22, 'triangle', 0.12), 160); },
};
function updateAudio() {
  if (!AC || !locals.length) return; const lead = locals.reduce((a, L) => Math.abs(L.car.vf) > Math.abs(a.vf) ? L.car : a, locals[0].car);
  const v = Math.abs(lead.vf), fr = clamp(v / (MAXV * 1.3), 0, 1), gear = Math.min(4, fr * 5 | 0), rpm = fr * 5 - gear, f = 62 + gear * 16 + rpm * 85 + (lead.boostT > 0 ? 30 : 0), t = AC.currentTime;
  eng1.frequency.setTargetAtTime(f, t, 0.05); eng2.frequency.setTargetAtTime(f * 0.5, t, 0.05); engFilt.frequency.setTargetAtTime(380 + fr * 1500, t, 0.08);
  const on = !muted && (state === 'race' || state === 'countdown' || state === 'finish') ? 1 : 0;
  engGain.gain.setTargetAtTime(on * (0.05 + fr * 0.05), t, 0.1); windGain.gain.setTargetAtTime(on * fr * fr * 0.12, t, 0.15);
}

// ───────────────────────── views (one per local player): camera + post chain + HUD ─────────────────────────
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const fmt = (t) => { if (!t) return '—'; const m = t / 60 | 0, s = t - m * 60; return m + ':' + (s < 10 ? '0' : '') + s.toFixed(1); };
const suf = (n) => ['st', 'nd', 'rd'][n - 1] || 'th';
const hex = (n) => '#' + (n >>> 0).toString(16).padStart(6, '0');
const GRADE = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform sampler2D tDiffuse; varying vec2 vUv;
    void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.2126,.7152,.0722));
      float sat=max(c.r,max(c.g,c.b))-min(c.r,min(c.g,c.b));
      c=mix(vec3(l),c,1.28+0.12*(1.-sat)); c=(c-0.5)*1.09+0.5;
      c*=mix(1.,0.82,smoothstep(0.45,0.95,length(vUv-0.5)*1.25));
      gl_FragColor=vec4(clamp(c,0.,1.),1.); }`,
};
const HUD_HTML = `<div class="tl hud"><div class="panel"><div class="lbl">POSITION</div><div class="posBox"><span class="pos">6</span><small class="suf">th</small><span class="tot">/ 6</span></div></div>
  <div class="panel"><div class="lbl">LAP</div><div class="val"><span class="lap">1</span> / ${LAPS}</div></div></div>
  <div class="tr hud"><div class="panel coinsBox"><div class="lbl">COINS</div><div class="val">● <span class="coins">0</span></div></div><div class="panel"><div class="lbl">TIME</div><div class="val time">0:00.0</div></div></div>
  <div class="bl hud panel"><canvas class="mini" width="336" height="336"></canvas></div>
  <div class="br hud panel"><div><span class="speed">0</span><span class="speedUnit">KM/H</span></div><div class="lbl" style="margin-top:6px">NITRO</div><div class="nitro"><div class="nitroFill"></div></div></div>
  <div class="wrong hud">⟲ WRONG WAY</div><div class="ptag hud"></div><div class="center hud"></div>`;
function makeView(i, cam) {
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 }));
  composer.addPass(new RenderPass(scene, cam)); composer.addPass(new UnrealBloomPass(new THREE.Vector2(256, 256), 0.25, 0.6, 1.05)); composer.addPass(new OutputPass()); composer.addPass(new ShaderPass(GRADE));
  const el = document.createElement('div'); el.className = 'phud'; el.innerHTML = HUD_HTML; $('huds').appendChild(el);
  const q = (s) => el.querySelector(s), mini = q('.mini');
  return { i, cam, composer, el, car: null, camH: 0, snap: true, shake: 0, rect: { x: 0, y: 0, w: 1, h: 1 }, flashT: 0, sized: '',
    hud: { pos: q('.pos'), suf: q('.suf'), lap: q('.lap'), time: q('.time'), coins: q('.coins'), speed: q('.speed'), nitro: q('.nitroFill'), wrong: q('.wrong'), center: q('.center'), tag: q('.ptag'), mctx: mini.getContext('2d') } };
}
const views = [makeView(0, camera), makeView(1, new THREE.PerspectiveCamera(62, 1, 0.3, 7000))];
function flash(v, txt, dur, small) { if (!v) return; v.hud.center.textContent = txt; v.hud.center.className = 'center hud show' + (small ? ' small' : ''); v.flashT = dur; }
const miniBg = document.createElement('canvas'); miniBg.width = miniBg.height = 336;
const MS = 336 / 640, mx = (x) => 168 + x * MS, mz = (z) => 168 + z * MS;
{
  const g = miniBg.getContext('2d'); g.lineJoin = g.lineCap = 'round';
  const path = () => { g.beginPath(); for (let i = 0; i <= N; i += 4) g.lineTo(mx(TX[i % N]), mz(TZ[i % N])); g.closePath(); };
  g.strokeStyle = 'rgba(0,25,70,.6)'; g.lineWidth = 15; path(); g.stroke(); g.strokeStyle = '#fff'; g.lineWidth = 8; path(); g.stroke();
  g.fillStyle = '#111'; g.save(); g.translate(mx(TX[0]), mz(TZ[0])); g.rotate(-HD[0]); g.fillRect(-10, -2.5, 20, 5); g.restore();
}
function ranking() { return cars.slice().sort((a, b) => (a.finished && b.finished) ? a.finishT - b.finishT : a.finished ? -1 : b.finished ? 1 : b.dist - a.dist); }
const nViews = () => (mode === 'split' && state !== 'menu') ? 2 : 1;
function layout() {
  const W = innerWidth, H = innerHeight, pr = Math.min(devicePixelRatio, 2), n = nViews();
  renderer.setPixelRatio(pr); renderer.setSize(W, H, false);
  const rects = n === 1 ? [{ x: 0, y: 0, w: W, h: H }] : splitLayout === 'tb'
    ? [{ x: 0, y: 0, w: W, h: Math.floor(H / 2) }, { x: 0, y: Math.floor(H / 2), w: W, h: H - Math.floor(H / 2) }]
    : [{ x: 0, y: 0, w: Math.floor(W / 2), h: H }, { x: Math.floor(W / 2), y: 0, w: W - Math.floor(W / 2), h: H }];
  views.forEach((v, i) => {
    const r = rects[i]; v.el.style.display = r ? '' : 'none'; if (!r) return;
    v.rect = r; const key = r.w + 'x' + r.h + '@' + pr;
    if (v.sized !== key) { v.composer.setPixelRatio(pr); v.composer.setSize(r.w, r.h); v.sized = key; }
    v.cam.aspect = r.w / r.h; v.cam.updateProjectionMatrix();
    Object.assign(v.el.style, { left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px' });
    v.el.classList.toggle('compact', n > 1 && (r.w < 900 || r.h < 560));
  });
  $('divider').className = n > 1 ? 'on ' + splitLayout : '';
}
addEventListener('resize', layout);
let hudT = 0;
function updateHUD(dt) {
  for (const v of views) if (v.flashT > 0) { v.flashT -= dt; if (v.flashT <= 0) v.hud.center.className = 'center hud'; }
  hudT -= dt; if (hudT > 0) return; hudT = 0.05;
  const r = ranking();
  for (let i = 0; i < nViews(); i++) {
    const v = views[i], c = v.car, H = v.hud; if (!c) continue; const p = r.indexOf(c) + 1;
    H.pos.textContent = p; H.suf.textContent = suf(p); H.lap.textContent = clamp(c.lap + 1, 1, LAPS); H.time.textContent = fmt(raceT) === '—' ? '0:00.0' : fmt(raceT);
    H.speed.textContent = Math.round(Math.abs(c.vf) * 3.6); H.nitro.style.width = (c.nitro * 100) + '%'; H.coins.textContent = c.coins;
    H.wrong.style.display = c.wrongT > 1.2 && state === 'race' ? 'block' : 'none';
    const m = H.mctx; m.clearRect(0, 0, 336, 336); m.drawImage(miniBg, 0, 0);
    for (const o of cars) { if (o === c) continue; m.beginPath(); m.arc(mx(o.x), mz(o.z), isHuman(o) ? 9.5 : 7, 0, 6.3); m.fillStyle = hex(o.look.paint); m.fill(); m.lineWidth = isHuman(o) ? 3 : 2; m.strokeStyle = isHuman(o) ? '#ffd23a' : '#fff'; m.stroke(); }
    m.beginPath(); m.arc(mx(c.x), mz(c.z), 12, 0, 6.3); m.fillStyle = hex(c.look.paint); m.fill(); m.lineWidth = 4; m.strokeStyle = '#fff'; m.stroke();
  }
}

// ───────────────────────── race flow ─────────────────────────
let me = null; // active profile (player 1)
function setupSolo() {
  mode = 'solo';
  cars.forEach((c, k) => { c.ctrl = k === 5 ? 'local' : 'ai'; c.bot = k !== 5; c.prof = k === 5 ? me : null; c.name = k === 5 ? me.nick : BOT_NAMES[k]; c.st = k === 5 ? statsOf(me) : BASE_ST; c.view = null; setLook(c, k === 5 ? lookOf(me) : botLook(k)); });
  locals = [{ car: cars[5], prof: me, pi: 0 }];
  bindViews();
}
function setupSplit(p2) {
  setupSolo(); mode = 'split';
  const c = cars[4]; c.ctrl = 'local'; c.bot = false; c.prof = p2; c.name = p2.nick; c.st = statsOf(p2); setLook(c, lookOf(p2));
  locals.push({ car: c, prof: p2, pi: 1 });
  bindViews();
}
function bindViews() {
  views.forEach((v, i) => { v.car = locals[i] ? locals[i].car : null; if (v.car) v.car.view = v; v.snap = true; v.hud.tag.textContent = locals[i] ? (mode === 'split' ? `P${i + 1} · ` : '') + locals[i].prof.nick : ''; v.hud.tag.style.display = mode === 'split' ? '' : 'none'; });
}
function startRace() {
  initAudio(); if (AC && AC.state === 'suspended') AC.resume();
  resetRace(); state = 'countdown'; countT = 3.6; lastCount = 9; resultsOpen = false;
  $('menu').classList.add('hide'); $('finish').classList.add('hide'); $('huds').classList.add('on');
  views.forEach(v => { v.snap = true; v.cam.clearViewOffset(); });
  layout();
  if (mode !== 'online') net && net.setStatus('racing');
}
function onLocalFinish(c) {
  c.auto = true;
  const place = cars.filter(o => o.finished && o.finishT <= c.finishT).length;
  const p = c.prof, humansBeaten = mode === 'online' ? cars.filter(o => o !== c && isHuman(o) && !(o.finished && o.finishT < c.finishT)).length : 0;
  const bonus = PLACE_BONUS[place - 1] || 0, online = humansBeaten * 15, total = c.coins + bonus + online;
  c.reward = { place, collected: c.coins, bonus, online, total };
  p.coins += total; p.earned += total; p.races++; if (place === 1) p.wins++;
  if (!p.best || c.finishT < p.best) p.best = c.finishT; if (c.bestLap && (!p.lap || c.bestLap < p.lap)) p.lap = c.bestLap; p.ts = Date.now();
  saveProfiles(); const e = boardEntry(p); mergeBoard([e]); if (net) net.reportStat(e);
  flash(c.view, place === 1 ? 'WINNER!' : `${place}${suf(place)}!`, 2, false); if (place === 1) sfx.win();
  if (locals.every(L => L.car.finished)) { state = 'finish'; setTimeout(showResults, 2200); }
}
function showResults() {
  resultsOpen = true; renderResults();
  const solo1 = locals.length === 1 ? locals[0].car.reward.place : 0;
  $('finTitle').innerHTML = mode === 'split' ? (() => { const w = locals.slice().sort((a, b) => a.car.reward.place - b.car.reward.place)[0]; return `${esc(w.prof.nick)} <span>WINS!</span>`; })()
    : solo1 === 1 ? 'YOU <span>WIN!</span>' : `${solo1}${suf(solo1)} <span>PLACE</span>`;
  $('againBtn').style.display = mode === 'online' ? 'none' : '';
  $('menuBtn').textContent = mode === 'online' ? 'BACK TO LOBBY' : 'MENU';
  $('finish').classList.remove('hide'); $('huds').classList.remove('on');
}
function renderResults() {
  const r = ranking();
  let h = r.map((c, i) => `<div class="row ${c.ctrl === 'local' ? 'me' : ''}"><span>${i + 1}. <i class="dot" style="background:${hex(c.look.paint)}"></i>${esc(c.name)}${isHuman(c) && c.ctrl !== 'local' ? ' <em>racer</em>' : ''}</span><span>${c.finished ? fmt(c.finishT) : (c.ctrl === 'remote' && !c.bot ? 'racing…' : '—')}</span></div>`).join('');
  for (const L of locals) { const w = L.car.reward; if (!w) continue;
    h += `<div class="earn"><b>${esc(L.prof.nick)}</b> earned <span class="gold">● ${w.total}</span><small>${w.collected} collected + ${w.bonus} for ${w.place}${suf(w.place)}${w.online ? ` + ${w.online} for beating racers` : ''} · best lap ${fmt(L.car.bestLap)} · wallet ● ${L.prof.coins}</small></div>`; }
  $('results').innerHTML = h;
}
function exitRace() {
  const wasOnline = mode === 'online';
  if (wasOnline && net) net.closeRoom();
  resultsOpen = false; $('finish').classList.add('hide'); $('huds').classList.remove('on');
  setupSolo(); resetRace(); state = 'menu'; layout(); if (net) net.setStatus('idle');
  showScreen(wasOnline ? 'scrOnline' : 'scrMain');
}
$('againBtn').onclick = () => startRace();
$('menuBtn').onclick = exitRace;

// ───────────────────────── input: keyboard (shared or split), gamepads, touch ─────────────────────────
const keys = {};
const KM = {
  solo: { up: ['KeyW', 'ArrowUp'], down: ['KeyS', 'ArrowDown'], left: ['KeyA', 'ArrowLeft'], right: ['KeyD', 'ArrowRight'], drift: ['Space'], nitro: ['ShiftLeft', 'ShiftRight'] },
  p1: { up: ['KeyW'], down: ['KeyS'], left: ['KeyA'], right: ['KeyD'], drift: ['Space'], nitro: ['ShiftLeft'] },
  p2: { up: ['ArrowUp'], down: ['ArrowDown'], left: ['ArrowLeft'], right: ['ArrowRight'], drift: ['Period', 'Numpad0'], nitro: ['Slash', 'ShiftRight', 'NumpadEnter'] },
};
const typing = () => { const a = document.activeElement; return a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA'); };
addEventListener('keydown', (e) => {
  if (typing()) return;
  keys[e.code] = true; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Slash'].includes(e.code)) e.preventDefault();
  if (e.code === 'KeyM') muted = !muted;
  if (state === 'race') { if (e.code === 'KeyR' && locals[0]) placeCar(locals[0].car, locals[0].car.idx, 0); if (e.code === 'Backspace' && locals[1]) placeCar(locals[1].car, locals[1].car.idx, 0); }
  if (e.code === 'Escape' && state === 'menu') showScreen('scrMain');
});
addEventListener('keyup', (e) => { keys[e.code] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
const touch = { l: 0, r: 0, b: 0, n: 0, d: 0, on: false };
if ('ontouchstart' in window) { touch.on = true; $('touch').style.display = 'block';
  for (const [id, k] of [['tL', 'l'], ['tR', 'r'], ['tB', 'b'], ['tN', 'n'], ['tD', 'd']]) { const el = $(id); if (!el) continue;
    el.addEventListener('touchstart', (e) => { e.preventDefault(); touch[k] = 1; el.classList.add('on'); }, { passive: false });
    const up = (e) => { e.preventDefault(); touch[k] = 0; el.classList.remove('on'); }; el.addEventListener('touchend', up); el.addEventListener('touchcancel', up); } }
function readInputs() {
  const pads = (navigator.getGamepads ? [...navigator.getGamepads()] : []).filter(Boolean);
  for (const L of locals) {
    const I = L.inp || (L.inp = { throttle: 0, steer: 0, hand: false, nitro: false });
    const map = mode === 'split' ? (L.pi ? KM.p2 : KM.p1) : KM.solo, any = (a) => a.some(c => keys[c]);
    let thr = any(map.down) ? -1 : any(map.up) ? 1 : 0, steer = (any(map.left) ? 1 : 0) - (any(map.right) ? 1 : 0), hand = any(map.drift), nit = any(map.nitro);
    const gp = pads[mode === 'split' ? L.pi : 0];
    if (gp) { const b = (n) => gp.buttons[n] || { pressed: false, value: 0 }, ax = gp.axes[0] || 0;
      if (Math.abs(ax) > 0.14) steer = -Math.sign(ax) * Math.min(1, (Math.abs(ax) - 0.14) / 0.8);
      if (b(6).value > 0.2) thr = -1; else if (b(7).value > 0.1 || b(0).pressed) thr = Math.max(thr, b(0).pressed ? 1 : b(7).value);
      hand = hand || b(2).pressed || b(5).pressed; nit = nit || b(1).pressed || b(4).pressed || b(3).pressed; }
    if (mode !== 'split' && touch.on) { if (touch.b) thr = -1; else if (thr === 0) thr = 1; if (touch.l || touch.r) steer = touch.l - touch.r; hand = hand || !!touch.d; nit = nit || !!touch.n; }
    if (state !== 'race') { thr = 0; nit = false; }
    I.throttle = thr; I.steer = steer; I.hand = hand; I.nitro = nit;
  }
}

// ───────────────────────── menus: nickname, garage, split setup, leaderboard, online lobby ─────────────────────────
const SCREENS = ['scrMain', 'scrNick', 'scrSplit', 'scrOnline', 'scrGarage', 'scrBoard'];
let screen = 'scrMain', garageFor = null;
function showScreen(id) {
  screen = id; SCREENS.forEach(s => $(s).classList.toggle('on', s === id));
  $('menu').classList.toggle('garage', id === 'scrGarage'); $('menu').classList.remove('hide');
  if (id === 'scrMain') refreshMain();
  if (id === 'scrGarage') renderGarage();
  if (id === 'scrBoard') renderBoard();
  if (id === 'scrOnline') renderLobby();
  if (id === 'scrNick') { $('nickIn').value = me && profiles[me.nick.toLowerCase()] ? me.nick : ''; setTimeout(() => $('nickIn').focus(), 50); }
  if (id !== 'scrGarage' && garageFor && garageFor !== me) { garageFor = null; }
  if (state === 'menu' && locals[0]) { setLook(locals[0].car, lookOf(id === 'scrGarage' && garageFor ? garageFor : me)); }
}
function refreshMain() { if (!me) return; $('nickLbl').textContent = me.nick; $('walletLbl').textContent = me.coins; $('statsLbl').textContent = `${me.wins} wins · ${me.races} races`; }
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { initAudio(); showScreen(b.dataset.go); }));
const NICK_RE = /^[A-Za-z0-9_\- ]{2,14}$/;
function setNick(raw) {
  const nick = raw.trim().replace(/\s+/g, ' ');
  if (!NICK_RE.test(nick)) { $('nickErr').textContent = '2–14 letters, numbers, spaces, - or _'; return false; }
  me = getProfile(nick); store.set('ccr_nick', me.nick); $('nickErr').textContent = '';
  setupSolo(); mergeBoard([boardEntry(me)]);
  if (net) net.start(me.nick, paintOf(me).col);
  return true;
}
$('nickGo').onclick = () => { if (setNick($('nickIn').value)) showScreen('scrMain'); };
$('nickIn').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('nickGo').click(); });
$('bSolo').onclick = () => { setupSolo(); startRace(); };
// split screen
function renderSplitSetup() { document.querySelectorAll('#layoutSeg button').forEach(b => b.classList.toggle('on', b.dataset.l === splitLayout)); $('p1Lbl').textContent = me.nick; }
document.querySelectorAll('#layoutSeg button').forEach(b => b.onclick = () => { splitLayout = b.dataset.l; store.set('ccr_split', splitLayout); renderSplitSetup(); });
$('bSplit').onclick = () => { renderSplitSetup(); const p2 = store.get('ccr_p2', ''); $('p2In').value = p2; showScreen('scrSplit'); };
$('p2Garage').onclick = () => { const n = $('p2In').value.trim(); if (!NICK_RE.test(n) || n.toLowerCase() === me.nick.toLowerCase()) { $('p2Err').textContent = 'Enter a different 2–14 character nickname first'; return; } garageFor = getProfile(n); showScreen('scrGarage'); };
$('splitGo').onclick = () => {
  const n = $('p2In').value.trim().replace(/\s+/g, ' ');
  if (!NICK_RE.test(n)) { $('p2Err').textContent = 'Player 2 needs a 2–14 character nickname'; return; }
  if (n.toLowerCase() === me.nick.toLowerCase()) { $('p2Err').textContent = 'Pick a different nickname from Player 1'; return; }
  $('p2Err').textContent = ''; store.set('ccr_p2', n); const p2 = getProfile(n); mergeBoard([boardEntry(p2)]);
  setupSplit(p2); startRace();
};
// garage
$('bGarage').onclick = () => { garageFor = me; showScreen('scrGarage'); };
function renderGarage() {
  const p = garageFor || me; $('garWho').textContent = p.nick; $('garCoins').textContent = p.coins;
  const owned = (id) => p.owned.includes(id);
  $('paintGrid').innerHTML = PAINTS.map(pa => `<button class="swatch ${p.eq.paint === pa.id ? 'sel' : ''}" data-paint="${pa.id}" title="${pa.name}">
    <i style="background:${pa.metal ? 'linear-gradient(135deg,#f5f8fb,#8d99a6 45%,#e9eef3 60%,#7d8996)' : hex(pa.col)};box-shadow:0 0 0 3px ${hex(pa.rim)} inset"></i>
    <span>${pa.name}</span><b>${owned(pa.id) ? (p.eq.paint === pa.id ? 'ON' : 'OWNED') : '● ' + pa.price}</b></button>`).join('');
  $('partGrid').innerHTML = PARTS.map(it => { const o = owned(it.id), on = !!p.eq[it.id], afford = p.coins >= it.price;
    return `<div class="part ${on ? 'equipped' : ''}"><div class="ic">${it.icon}</div><div class="pt"><b>${it.name}</b><small>${it.desc}</small></div>
      ${o ? `<button class="mini-btn ${on ? 'on' : ''}" data-eq="${it.id}">${on ? 'EQUIPPED' : 'EQUIP'}</button>` : `<button class="mini-btn buy" data-buy="${it.id}" ${afford ? '' : 'disabled'}>● ${it.price}</button>`}</div>`; }).join('');
  const s = statsOf(p), bar = (v) => `<i style="width:${clamp(v, 0, 1) * 100}%"></i>`;
  $('statBars').innerHTML = [['Top speed', (s.top - 0.95) / 0.15], ['Acceleration', (s.acc - 0.95) / 0.25], ['Off-road', (1.1 - s.off) / 0.75], ['Nitro', (s.boost - 1.25) / 0.35], ['Grip', (s.grip - 0.9) / 0.3]]
    .map(([n, v]) => `<div class="sb"><span>${n}</span><div>${bar(v)}</div></div>`).join('');
  if (state === 'menu') setLook(locals[0].car, lookOf(p));
}
$('scrGarage').addEventListener('click', (e) => {
  const p = garageFor || me, t = e.target.closest('button'); if (!t) return;
  if (t.dataset.paint) { const pa = PAINTS.find(x => x.id === t.dataset.paint);
    if (!p.owned.includes(pa.id)) { if (p.coins < pa.price) { toast(`Need ● ${pa.price - p.coins} more coins for ${pa.name}`); return; } p.coins -= pa.price; p.owned.push(pa.id); sfx.buy(); toast(`${pa.name} paint unlocked!`); }
    p.eq.paint = pa.id; }
  else if (t.dataset.buy) { const it = PARTS.find(x => x.id === t.dataset.buy); if (p.coins < it.price || p.owned.includes(it.id)) return;
    p.coins -= it.price; p.owned.push(it.id); p.eq[it.id] = true; sfx.buy(); toast(`${it.icon} ${it.name} installed!`); }
  else if (t.dataset.eq) { p.eq[t.dataset.eq] = !p.eq[t.dataset.eq]; }
  else return;
  p.ts = Date.now(); saveProfiles(); mergeBoard([boardEntry(p)]); renderGarage();
  if (p === me && net) net.start(me.nick, paintOf(me).col);
});
$('garBack').onclick = () => { const back = garageFor && garageFor !== me ? 'scrSplit' : 'scrMain'; garageFor = null; showScreen(back); };
// leaderboard
let boardFilter = 'all';
function renderBoard() {
  const on = new Set((net ? net.roster : []).map(r => r.nick.toLowerCase()));
  let list = sortedBoard(); if (boardFilter === 'online') list = list.filter(e => on.has(e.nick.toLowerCase()));
  document.querySelectorAll('#boardSeg button').forEach(b => b.classList.toggle('on', b.dataset.f === boardFilter));
  $('boardBody').innerHTML = list.length ? list.slice(0, 100).map((e, i) => `<tr class="${me && e.nick.toLowerCase() === me.nick.toLowerCase() ? 'me' : ''}">
    <td class="rk">${i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</td><td><i class="dot" style="background:${hex(e.paint)}"></i>${esc(e.nick)}${on.has(e.nick.toLowerCase()) ? ' <em class="live">online</em>' : ''}${e.body ? ' <em>sports</em>' : ''}</td>
    <td>${e.wins}</td><td>${e.races}</td><td>${fmt(e.best)}</td><td>${fmt(e.lap)}</td><td class="gold">● ${e.earned}</td></tr>`).join('')
    : `<tr><td colspan="7" class="empty">No racers yet — finish a race to get on the board.</td></tr>`;
}
document.querySelectorAll('#boardSeg button').forEach(b => b.onclick = () => { boardFilter = b.dataset.f; renderBoard(); });
// toasts + invite popup
let toastTO = 0;
function toast(msg) { const el = $('toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastTO); toastTO = setTimeout(() => el.classList.remove('show'), 2600); }
let inviteQ = [];
function showInvite() {
  const inv = inviteQ[0], el = $('invite');
  if (!inv) { el.classList.remove('show'); return; }
  $('invFrom').textContent = inv.nick; el.classList.add('show'); sfx.ping();
}
$('invYes').onclick = () => { const inv = inviteQ.shift(); if (!inv) return; inviteQ = []; showInvite();
  if (net.respond(inv.id, true, lookOf(me))) { roomGuestList = [inv.nick, me.nick]; showScreen('scrOnline'); toast(`Joined ${inv.nick}'s race — waiting for the start`); } else toast('That challenge expired'); };
$('invNo').onclick = () => { const inv = inviteQ.shift(); if (inv) net.respond(inv.id, false); showInvite(); };
// online lobby
let roster = [], roomGuestList = [], netStatus = { txt: 'Offline', lvl: '' };
function renderLobby() {
  if (!net) return;
  $('netStatus').textContent = netStatus.txt; $('netStatus').className = 'netst ' + (netStatus.lvl || '');
  const others = roster.filter(r => r.id !== net.id), guest = net.inRoomAsGuest, room = net.room;
  $('onlineCount').textContent = roster.length ? `${roster.length} online` : '';
  const stLbl = { idle: 'in menus', room: 'in a race room', racing: 'racing' };
  $('rosterList').innerHTML = others.length ? others.map(r => { const g = room && room.guests.get(r.id);
    const btn = guest ? '' : g ? `<span class="tagst ${g.state}">${{ invited: 'invited…', ready: 'ready ✓', declined: 'declined', busy: 'busy', offline: 'offline' }[g.state]}</span>`
      : `<button class="mini-btn buy" data-ch="${r.id}" ${r.status === 'idle' ? '' : 'disabled'}>CHALLENGE</button>`;
    return `<div class="racer"><i class="dot" style="background:${hex(r.paint)}"></i><b>${esc(r.nick)}</b><small>${stLbl[r.status] || ''}</small>${btn}</div>`; }).join('')
    : `<div class="empty">${net.online ? 'Nobody else is online right now. Send a friend this page\'s link — when they open it, they appear here.' : 'Connecting…'}</div>`;
  let rh = '';
  if (guest) rh = `<p>You're in <b>${esc(net.hostNick || roomGuestList[0] || 'a')}</b>'s race room.</p><div class="roomlist">${roomGuestList.map(n => `<span>${esc(n)}</span>`).join('')}</div><p class="hint">Waiting for the host to start…</p><button class="go small alt" id="roomLeave">LEAVE ROOM</button>`;
  else if (room && room.guests.size) { const ready = [...room.guests.values()].filter(g => g.state === 'ready').length;
    rh = `<p>Your race room — challenge more racers, then start. Empty grid slots are filled with bots.</p><div class="roomlist"><span>${esc(me.nick)} (host)</span>${[...room.guests.values()].map(g => `<span class="${g.state}">${esc(g.nick)} · ${g.state}</span>`).join('')}</div>
      <button class="go" id="roomStart" ${ready ? '' : 'disabled'}>START RACE (${ready + 1} racers)</button><button class="go small alt" id="roomLeave">CANCEL ROOM</button>`; }
  else rh = `<p class="hint">Hit <b>CHALLENGE</b> next to a racer. Challenge several to race up to 6 together.</p>`;
  $('roomBox').innerHTML = rh;
  const rs = $('roomStart'); if (rs) rs.onclick = hostStartOnline;
  const rl = $('roomLeave'); if (rl) rl.onclick = () => { net.closeRoom(); roomGuestList = []; renderLobby(); };
}
$('rosterList').addEventListener('click', (e) => { const b = e.target.closest('[data-ch]'); if (!b || !net) return; net.challenge(b.dataset.ch, lookOf(me)); toast('Challenge sent!'); renderLobby(); });
$('bOnline').onclick = () => { if (net) net.start(me.nick, paintOf(me).col); showScreen('scrOnline'); };
function hostStartOnline() {
  const guests = net.readyGuests().slice(0, 5); if (!guests.length) return;
  const humans = [{ id: net.id, nick: me.nick, look: lookOf(me) }, ...guests.map(g => ({ id: g.id, nick: g.nick, look: g.look }))];
  const slots = []; humans.forEach((h, i) => { slots[5 - i] = { id: h.id, nick: h.nick, look: sanitizeLook(h.look) }; });
  for (let k = 0; k < 6; k++) if (!slots[k]) slots[k] = { ai: 1, nick: BOT_NAMES[k], look: botLook(k) };
  net.startRoom({ t: 'start', slots }); beginOnline(slots, true);
}
function sanitizeLook(l) { l = l || {}; return { paint: +l.paint | 0, rim: +l.rim | 0, metal: !!l.metal, body: l.body === 'sports' ? 'sports' : 'classic', tyres: l.tyres === 'big' ? 'big' : 'std', rocket: !!l.rocket, glow: +l.glow | 0 }; }
function beginOnline(slots, isHost) {
  if (!Array.isArray(slots) || slots.length !== 6) return;
  mode = 'online'; netHost = isHost; locals = [];
  cars.forEach((c, k) => { const s = slots[k] || { ai: 1, nick: BOT_NAMES[k], look: botLook(k) };
    c.name = String(s.nick || BOT_NAMES[k]).slice(0, 14); c.bot = !!s.ai; c.peer = s.id || null; c.view = null; c.prof = null;
    c.ctrl = s.id && s.id === net.id ? 'local' : s.ai ? (isHost ? 'ai' : 'remote') : 'remote';
    c.st = c.ctrl === 'local' ? statsOf(me) : BASE_ST; setLook(c, c.ctrl === 'local' ? lookOf(me) : sanitizeLook(s.look));
    if (c.ctrl === 'local') { c.prof = me; locals.push({ car: c, prof: me, pi: 0 }); } });
  if (!locals.length) return;
  bindViews(); startRace();
}
let netT = 0;
function netTick(dt) {
  if (mode !== 'online' || state === 'menu' || !net) return;
  netT -= dt; if (netT > 0) return; netT = 0.05;
  if (netHost) net.broadcast({ t: 'S', l: cars.map(packCar) });
  else net.toHost({ t: 's', d: packCar(locals[0].car) });
}
function botTakeover(c, why) { if (c.ctrl !== 'remote') return; const n = c.net; if (n) { c.x = n.x; c.z = n.z; c.y = n.y; c.h = n.h; } c.ctrl = 'ai'; c.st = BASE_ST; c.vf = Math.hypot(c.vx, c.vz); if (!c.bot) c.name += ' 🤖'; c.bot = true; if (why) toast(why); }
let net = null;
try {
  net = createNet({
    status: (txt, lvl) => { netStatus = { txt, lvl }; if (screen === 'scrOnline') renderLobby(); $('netDot').className = 'netdot ' + (lvl || ''); $('netDot').title = txt; },
    getBoard: () => sortedBoard().slice(0, 100),
    mergeBoard: (list) => mergeBoard(list),
    boardChanged: () => { if (screen === 'scrBoard' && state === 'menu') renderBoard(); },
    roster: (list) => { roster = list; $('onlineLbl').textContent = list.length > 1 ? `${list.length - 1} online` : ''; if (state === 'menu') { if (screen === 'scrOnline') renderLobby(); if (screen === 'scrBoard') renderBoard(); } },
    room: () => { if (screen === 'scrOnline' && state === 'menu') renderLobby(); },
    canAccept: () => state === 'menu' && !!me,
    invite: (inv) => { if (state !== 'menu') return; inviteQ = inviteQ.filter(x => x.id !== inv.id); inviteQ.push(inv); showInvite(); },
    inviteGone: (id) => { inviteQ = inviteQ.filter(x => x.id !== id); showInvite(); },
    roomList: (list) => { roomGuestList = (list || []).map(String); if (screen === 'scrOnline') renderLobby(); },
    start: (d) => { beginOnline(d.slots, false); },
    hostStates: (l) => { if (mode === 'online' && Array.isArray(l)) for (const a of l) applyRemote(a); },
    guestState: (id, a) => { if (mode === 'online' && netHost && Array.isArray(a)) { const c = cars[a[0]]; if (c && c.peer === id) applyRemote(a); } },
    guestLeft: (id) => { if (mode === 'online' && netHost) { const c = cars.find(o => o.peer === id); if (c && !c.finished) botTakeover(c, `${c.name} left — a bot takes over`); } },
    hostLeft: () => {
      if (mode === 'online' && state !== 'menu') { cars.forEach(c => { if (c.ctrl === 'remote' && !c.finished) botTakeover(c); }); toast('Host disconnected — bots take over'); }
      else if (state === 'menu') { toast('The race room was closed'); roomGuestList = []; if (screen === 'scrOnline') renderLobby(); }
    },
  });
} catch (e) { net = null; }

// ───────────────────────── main loop ─────────────────────────
let menuA = 0, last = performance.now(), time = 0;
const camPos = new THREE.Vector3(), look = new THREE.Vector3(), vA = new THREE.Vector3(), vB = new THREE.Vector3(), vF = new THREE.Vector3(), mat4 = new THREE.Matrix4(), q = new THREE.Quaternion();
function updateCarVisual(c, dt) {
  const e = 1.2, hx = Math.max(groundH(c.x + e, c.z), -0.55) - Math.max(groundH(c.x - e, c.z), -0.55), hz = Math.max(groundH(c.x, c.z + e), -0.55) - Math.max(groundH(c.x, c.z - e), -0.55);
  if (c.grounded) vA.set(-hx / (2 * e), 1, -hz / (2 * e)).normalize(); else vA.set(-Math.sin(c.h) * clamp(c.vy * 0.012, -0.3, 0.3), 1, -Math.cos(c.h) * clamp(c.vy * 0.012, -0.3, 0.3)).normalize();
  c.up.lerp(vA, Math.min(1, dt * (c.grounded ? 10 : 3))).normalize();
  vF.set(Math.sin(c.h), 0, Math.cos(c.h)); vB.crossVectors(c.up, vF).normalize(); vF.crossVectors(vB, c.up).normalize();
  mat4.makeBasis(vB, c.up, vF); q.setFromRotationMatrix(mat4);
  const G = c.model.G; G.position.set(c.x, c.y, c.z); G.quaternion.copy(q);
  c.model.body.rotation.z = lerp(c.model.body.rotation.z, clamp(-c.vl * 0.018 + c.steer * Math.abs(c.vf) * 0.0022, -0.16, 0.16), Math.min(1, dt * 8));
  c.model.body.position.y = Math.sin(time * 31 + c.k) * 0.012 * Math.min(1, Math.abs(c.vf) / 10);
  c.spin += c.vf / c.model.wr * dt;
  for (const w of c.model.wheels) { w.spin.rotation.x = c.spin; if (w.front) w.pivot.rotation.y = c.steer * 0.42; }
  const b = c.boostT > 0; for (const f of c.model.flames) { f.visible = b; if (b) f.scale.set(1 + Math.random() * 0.5, 1 + Math.random() * 0.5, 0.8 + Math.random() * 0.8); }
  if (c.model.flames.glow) c.model.flames.glow.material.opacity = 0.7 + Math.sin(time * 6 + c.k) * 0.15;
}
function updateCam(v, dt) {
  const P = v.car, cam = v.cam; if (!P) return;
  if (state === 'menu' || (state === 'finish' && resultsOpen)) {
    const gar = state === 'menu' && screen === 'scrGarage', R = gar ? 8.2 : 9.5;
    menuA += dt * (gar ? 0.35 : 0.22); camPos.set(P.x + Math.sin(menuA) * R, P.y + (gar ? 2.2 : 2.6) + Math.sin(menuA * 0.7) * 0.8, P.z + Math.cos(menuA) * R);
    camPos.y = Math.max(camPos.y, groundH(camPos.x, camPos.z) + 1.2, 0.9);
    cam.position.lerp(camPos, v.snap ? 1 : Math.min(1, dt * 3)); look.set(P.x, P.y + 1.1, P.z); cam.lookAt(look); cam.fov = lerp(cam.fov, 50, Math.min(1, dt * 3)); v.snap = false; v.camH = P.h;
    const W = v.rect.w, H = v.rect.h;
    if (gar) { if (W > 760) cam.setViewOffset(W, H, Math.min(260, W * 0.2), 0, W, H); else cam.setViewOffset(W, H, 0, H * 0.24, W, H); } else if (cam.view && cam.view.enabled) cam.clearViewOffset();
  } else {
    const sf = clamp(Math.abs(P.vf) / MAXV, 0, 1.4), bst = P.boostT > 0 ? 1 : 0;
    const tgt = Math.hypot(P.vx, P.vz) > 6 ? lerp(0, wrapA(Math.atan2(P.vx, P.vz) - P.h), 0.45) + P.h : P.h;
    v.camH += wrapA(tgt - v.camH) * Math.min(1, dt * 5.5); if (v.snap) v.camH = P.h;
    const back = 8.2 + sf * 1.6 - bst * 0.6, upH = 3.3 + sf * 0.3;
    camPos.set(P.x - Math.sin(v.camH) * back, P.y + upH, P.z - Math.cos(v.camH) * back);
    camPos.y = Math.max(camPos.y, groundH(camPos.x, camPos.z) + 1.4, 1.0);
    if (v.snap) { cam.position.copy(camPos); v.snap = false; } else { cam.position.x = camPos.x; cam.position.z = camPos.z; cam.position.y = lerp(cam.position.y, camPos.y, Math.min(1, dt * 7)); }
    if (v.shake > 0 || bst) { const s = v.shake * 0.5 + bst * 0.05; cam.position.x += (Math.random() - 0.5) * s; cam.position.y += (Math.random() - 0.5) * s; v.shake = Math.max(0, v.shake - dt * 1.5); }
    look.set(P.x + Math.sin(P.h) * 5, P.y + 1.5, P.z + Math.cos(P.h) * 5); cam.lookAt(look);
    cam.fov = lerp(cam.fov, 60 + sf * 13 + bst * 9, Math.min(1, dt * 4));
  }
  cam.updateProjectionMatrix();
}
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
  readInputs();
  if (state === 'countdown') { countT -= dt; const n = Math.ceil(countT - 0.6);
    if (n !== lastCount) { lastCount = n; if (n > 0) { views.forEach(v => flash(v, String(n), 0.8)); sfx.beep(false); } else { views.forEach(v => flash(v, 'GO!', 0.9)); sfx.beep(true); state = 'race'; } } }
  if (state === 'race') raceT += dt;
  if (state !== 'menu') {
    const sub = 2, h = dt / sub;
    let lead = -1e9; for (const c of cars) if (isHuman(c)) lead = Math.max(lead, c.dist);
    for (let s = 0; s < sub; s++) {
      for (const c of cars) {
        if (c.ctrl === 'remote') { if (s === 0) stepRemote(c, dt); continue; }
        if (c.ctrl === 'ai' || c.auto) { aiInput(c, h, aiOut); if (c.finished) aiOut.throttle = Math.hypot(c.vx, c.vz) > 22 ? 0 : aiOut.throttle;
          c.skill = c.ctrl === 'local' ? 1 : c.base * (1 + clamp((lead - c.dist) * SP / 500, -0.1, 0.1)); stepCar(c, aiOut, h); }
        else { c.skill = 1; const L = locals.find(L => L.car === c); stepCar(c, (L && L.inp) || aiOut, h); }
      }
      for (let a = 0; a < cars.length; a++) for (let b = a + 1; b < cars.length; b++) { const A = cars[a], B = cars[b], dx = B.x - A.x, dz = B.z - A.z, d = Math.hypot(dx, dz);
        if (d < 2.7 && d > 0.001 && Math.abs(A.y - B.y) < 1.6) { const nx = dx / d, nz = dz / d, ra = A.ctrl === 'remote', rb = B.ctrl === 'remote'; if (ra && rb) continue;
          const wa = ra ? 0 : rb ? 1 : 0.5, wb = 1 - wa, o = 2.7 - d; A.x -= nx * o * wa; A.z -= nz * o * wa; B.x += nx * o * wb; B.z += nz * o * wb;
          const rv = (B.vx - A.vx) * nx + (B.vz - A.vz) * nz; if (rv < 0) { const j = -rv * 0.65 * 2; A.vx -= nx * j * wa; A.vz -= nz * j * wa; B.vx += nx * j * wb; B.vz += nz * j * wb; } } }
    }
    for (const L of locals) { const c = L.car, i = c.idx, along = c.vx * Math.sin(HD[i]) + c.vz * Math.cos(HD[i]); c.wrongT = along < -4 ? c.wrongT + dt : 0; }
    for (const k of coins) { if (k.t > 0) { k.t -= dt; continue; }
      for (const L of locals) { const c = L.car; if (c.finished) continue; const dx = k.x - c.x, dz = k.z - c.z, r = 5.3 * c.st.magnet * c.st.magnet;
        if (dx * dx + dz * dz < r && Math.abs(k.y - c.y - 1) < 2.5 + (c.st.magnet - 1) * 2) { k.t = 14; c.coins++; c.nitro = Math.min(1, c.nitro + 0.07); sfx.coin();
          for (let n = 0; n < 8; n++) emit(k.x, k.y, k.z, (Math.random() - 0.5) * 7, 2 + Math.random() * 5, (Math.random() - 0.5) * 7, 0.5, 0.35, 1, 0.85, 0.2, 0.9); break; } } }
    for (const c of cars) { const v = Math.abs(c.vf) + Math.abs(c.vl) * 2; if (c.grounded && v > 7) { c.emit += dt * (c.view ? 60 : 28) * Math.min(1, v / 30) * (c.gPrev < -0.08 ? 1.6 : 1); while (c.emit > 1) { c.emit--; emitDust(c); } } }
    netTick(dt);
    if (resultsOpen) { resultsT -= dt; if (resultsT <= 0) { resultsT = 0.5; renderResults(); } }
  }
  for (const c of cars) updateCarVisual(c, dt);
  coins.forEach((k, n) => { dummy.position.set(k.x, k.y + Math.sin(time * 3 + k.ph) * 0.15, k.z); dummy.rotation.set(0, time * 3.2 + k.ph, 0); dummy.scale.setScalar(k.t > 0 ? 0.0001 : 1); dummy.updateMatrix(); coinMesh.setMatrixAt(n, dummy.matrix); });
  coinMesh.instanceMatrix.needsUpdate = true;
  updateParticles(dt);
  padTex.offset.y = (time * 1.6) % 1; waterMat.uniforms.uTime.value = time;
  updateHUD(dt); updateAudio();
  // render every viewport with its own camera, shadows centred on its car
  const n = nViews(), H = innerHeight, pr = renderer.getPixelRatio();
  renderer.setScissorTest(n > 1);
  for (let i = 0; i < n; i++) {
    const v = views[i], r = v.rect, P = v.car || cars[5]; updateCam(v, dt);
    const yGL = H - r.y - r.h; renderer.setViewport(r.x, yGL, r.w, r.h); renderer.setScissor(r.x, yGL, r.w, r.h);
    pMat.uniforms.uScale.value = r.h * pr * 0.9; sky.position.copy(v.cam.position);
    sun.target.position.set(Math.round(P.x / 4) * 4, P.y, Math.round(P.z / 4) * 4); sun.position.copy(sun.target.position).addScaledVector(SUN, 190);
    v.composer.render(dt);
  }
}

// ───────────────────────── boot ─────────────────────────
{
  const saved = store.get('ccr_nick', '');
  const legacy = +(() => { try { return localStorage.getItem('ccr_best'); } catch (e) { return 0; } })() || 0;
  if (saved && NICK_RE.test(saved)) { setNick(saved); showScreen('scrMain'); }
  else { me = newProfile('Racer'); if (legacy && !me.best) me.best = legacy; setupSolo(); showScreen('scrNick'); }
  resetRace(); layout();
}
window.__game = { cars, views, get locals() { return locals; }, get state() { return state; }, get mode() { return mode; }, get raceT() { return raceT; }, startRace, setupSplit, getProfile, get me() { return me; }, net, N, renderer, profiles, board };
requestAnimationFrame(frame);
