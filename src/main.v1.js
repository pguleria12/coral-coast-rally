// Coral Coast Rally — original beach buggy racer. Everything (models, textures, sound) is procedural.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

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

// ───────────────────────── buggy model ─────────────────────────
const tireMat = new THREE.MeshStandardMaterial({ color: 0x1b1c20, roughness: 0.92 }), darkMat = new THREE.MeshStandardMaterial({ color: 0x23262c, roughness: 0.5, metalness: 0.6 });
const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdfe6ee, roughness: 0.15, metalness: 1 });
const Y = new THREE.Vector3(0, 1, 0);
function tube(a, b, r, mat) { const d = new THREE.Vector3().subVectors(b, a), m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 7), mat);
  m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(Y, d.normalize()); return m; }
const V = (x, y, z) => new THREE.Vector3(x, y, z);
function buildBuggy(bodyCol, rimCol) {
  const G = new THREE.Group(), body = new THREE.Group(); G.add(body);
  const paint = new THREE.MeshPhysicalMaterial({ color: bodyCol, roughness: 0.32, metalness: 0.25, clearcoat: 1, clearcoatRoughness: 0.12 });
  const rim = new THREE.MeshStandardMaterial({ color: rimCol, roughness: 0.3, metalness: 0.5, emissive: rimCol, emissiveIntensity: 0.9 });
  const box = (w, h, d, x, y, z, m, rx = 0) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.rotation.x = rx; body.add(o); return o; };
  box(1.5, 0.28, 3.0, 0, 0.78, 0, darkMat);
  box(1.46, 0.42, 1.25, 0, 1.0, 1.15, paint, 0.2);       // nose
  box(0.5, 0.06, 1.2, 0, 1.24, 1.13, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }), 0.2);
  for (const s of [-1, 1]) { box(0.34, 0.5, 1.9, s * 0.86, 0.95, -0.15, paint); box(0.16, 0.16, 0.1, s * 0.5, 1.02, 1.8, new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff2c0, emissiveIntensity: 2 })); }
  box(1.5, 0.5, 0.9, 0, 1.05, -1.25, paint);              // engine cover
  box(0.9, 0.3, 0.6, 0, 1.4, -1.3, darkMat);
  box(0.62, 0.75, 0.2, 0, 1.3, -0.62, darkMat);           // seat back
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.27, 14, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 })); helmet.position.set(0, 1.78, -0.42); body.add(helmet);
  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), new THREE.MeshStandardMaterial({ color: 0x10151c, roughness: 0.1, metalness: 0.8 })); visor.position.set(0, 1.8, -0.27); body.add(visor);
  box(0.34, 0.45, 0.24, 0, 1.38, -0.42, new THREE.MeshStandardMaterial({ color: bodyCol, roughness: 0.7 })); // torso
  // roll cage
  for (const s of [-1, 1]) {
    body.add(tube(V(s * 0.7, 1.05, 0.62), V(s * 0.62, 2.1, 0.05), 0.055, darkMat), tube(V(s * 0.62, 2.1, 0.05), V(s * 0.62, 2.1, -0.95), 0.055, darkMat),
      tube(V(s * 0.62, 2.1, -0.95), V(s * 0.72, 1.1, -1.6), 0.055, darkMat), tube(V(s * 0.62, 2.1, -0.5), V(s * 0.72, 1.1, -0.6), 0.045, darkMat),
      tube(V(s * 0.45, 1.6, -1.75), V(s * 0.45, 1.98, -1.85), 0.04, darkMat), tube(V(s * 0.3, 1.5, -1.5), V(s * 0.3, 1.2, -2.0), 0.07, chromeMat));
  }
  body.add(tube(V(-0.62, 2.1, 0.05), V(0.62, 2.1, 0.05), 0.055, darkMat), tube(V(-0.62, 2.1, -0.95), V(0.62, 2.1, -0.95), 0.055, darkMat), tube(V(-0.8, 0.72, 1.86), V(0.8, 0.72, 1.86), 0.08, chromeMat));
  box(1.3, 0.06, 1.05, 0, 2.15, -0.45, paint);            // roof
  box(1.9, 0.07, 0.5, 0, 2.02, -1.88, paint);             // wing
  for (let k = 0; k < 4; k++) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.12, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe9a8, emissiveIntensity: 2.2 }));
    l.rotation.x = Math.PI / 2; l.position.set(-0.48 + k * 0.32, 2.3, 0.08); body.add(l); }
  // boost flames
  const flames = [];
  for (const s of [-1, 1]) { const fg = new THREE.ConeGeometry(0.16, 1.6, 10); fg.rotateX(-Math.PI / 2); fg.translate(0, 0, -0.8);
    const f = new THREE.Mesh(fg, new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 2.2, 4.5), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
    f.position.set(s * 0.3, 1.2, -2.0); f.visible = false; body.add(f); flames.push(f); }
  // wheels
  const wheels = [];
  const tg = new THREE.CylinderGeometry(0.62, 0.62, 0.52, 22); tg.rotateZ(Math.PI / 2);
  const rg = new THREE.CylinderGeometry(0.37, 0.37, 0.54, 14); rg.rotateZ(Math.PI / 2);
  const kg = new THREE.BoxGeometry(0.5, 0.09, 1.3);
  for (const [x, z, front] of [[1.08, 1.18, 1], [-1.08, 1.18, 1], [1.08, -1.2, 0], [-1.08, -1.2, 0]]) {
    const pivot = new THREE.Group(), spin = new THREE.Group(); pivot.position.set(x, 0.62, z); pivot.add(spin);
    spin.add(new THREE.Mesh(tg, tireMat), new THREE.Mesh(rg, rim));
    for (let k = 0; k < 6; k++) { const kn = new THREE.Mesh(kg, tireMat); kn.rotation.x = k * Math.PI / 6; spin.add(kn); }
    const sp = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.1, 0.62), chromeMat), sp2 = sp.clone(); sp2.rotation.x = Math.PI / 2; spin.add(sp, sp2);
    G.add(pivot); wheels.push({ pivot, spin, front });
    body.add(tube(V(Math.sign(x) * 0.6, 0.85, z), V(x * 0.8, 0.66, z), 0.05, darkMat));
  }
  G.traverse(o => { if (o.isMesh && !o.material.blending) o.castShadow = true; });
  flames.forEach(f => f.castShadow = false);
  return { G, body, wheels, flames };
}

// ───────────────────────── cars ─────────────────────────
const LIVERY = [[0x1e6bff, 0xffd23a], [0xffc21a, 0xff4a5c], [0x22c55e, 0xffffff], [0xa855f7, 0x5eead4], [0xff7a1a, 0x2dd4ff], [0xe8232f, 0x2b7bff]];
const NAMES = ['Azul', 'Sunny', 'Mango', 'Orchid', 'Blaze', 'YOU'];
const cars = LIVERY.map(([b, r], k) => {
  const model = buildBuggy(b, r); scene.add(model.G);
  return { k, name: NAMES[k], model, isPlayer: k === 5, x: 0, y: 0, z: 0, h: 0, vx: 0, vz: 0, vy: 0, steer: 0, idx: 0, dist: 0, lap: -1, lat: 0, off: 0,
    grounded: true, air: 0, gPrev: 0, up: new THREE.Vector3(0, 1, 0), boostT: 0, nitro: 0.5, drift: 0, base: [0.9, 0.925, 0.95, 0.97, 0.99, 1][k], skill: 1,
    lane: 0, laneT: 0, laneTarget: 0, finished: false, finishT: 0, lapStart: 0, bestLap: 0, coins: 0, wrongT: 0, spin: 0, emit: 0, vf: 0, vl: 0 };
});
const player = cars[5];
function placeCar(c, i, lat) {
  i = (i + N) % N; c.x = TX[i] + NX[i] * lat; c.z = TZ[i] + NZ[i] * lat; c.h = HD[i]; c.idx = i; c.y = Math.max(groundH(c.x, c.z), -0.55); c.gPrev = c.y;
  c.vx = c.vz = c.vy = 0; c.steer = 0; c.grounded = true; c.air = 0; c.up.set(0, 1, 0);
}
function resetRace() {
  cars.forEach((c, k) => {
    placeCar(c, N - 7 - 7 * (k >> 1), k % 2 ? -3.6 : 3.6); c.dist = c.idx - N; c.lap = -1; c.finished = false; c.finishT = 0; c.bestLap = 0; c.coins = 0; c.nitro = 0.5; c.boostT = 0;
    c.lane = c.laneTarget = k % 2 ? -3.6 : 3.6; c.laneT = 2 + rand() * 3; c.wrongT = 0; c.drift = 0; c.ai = !c.isPlayer || AUTO;
  });
  coins.forEach(c => c.t = 0); finishOrder = 0; raceT = 0;
}
let finishOrder = 0, raceT = 0, state = 'menu', countT = 0, lastCount = 9;

const inp = { throttle: 0, steer: 0, hand: false, nitro: false };
function aiInput(c, dt, out) {
  const v = Math.hypot(c.vx, c.vz), j = (c.idx + Math.floor(7 + v * 0.42)) % N;
  c.laneT -= dt; if (c.laneT < 0) { c.laneT = 2 + rand() * 4; c.laneTarget = (rand() * 2 - 1) * 5.5; }
  c.lane += (c.laneTarget - c.lane) * dt * 0.7;
  const dh = wrapA(Math.atan2(TX[j] + NX[j] * c.lane - c.x, TZ[j] + NZ[j] * c.lane - c.z) - c.h);
  out.steer = clamp(dh * 2.4, -1, 1);
  let target = 999;
  for (let k = 0; k < 54; k += 3) { const vc = VC[(c.idx + k) % N] * (0.94 + c.base * 0.1), allow = Math.sqrt(vc * vc + 2 * 28 * k * SP); if (allow < target) target = allow; }
  out.throttle = state === 'race' || state === 'finish' ? (v < target ? 1 : v > target + 4 ? -1 : 0) : 0;
  out.hand = false; out.nitro = false;
}
const aiOut = { throttle: 0, steer: 0, hand: false, nitro: false };

function stepCar(c, I, dt) {
  const sh = Math.sin(c.h), ch = Math.cos(c.h);
  let vf = c.vx * sh + c.vz * ch, vl = c.vx * ch - c.vz * sh;
  const onGround = c.air < 0.1;
  if (c.isPlayer && !c.ai) {
    if (I.nitro && c.nitro > 0 && state === 'race') { c.nitro = Math.max(0, c.nitro - 0.3 * dt); c.boostT = Math.max(c.boostT, 0.12); }
    if (I.hand && onGround && Math.abs(vl) > 3.5 && vf > 12) c.drift += dt;
    else { if (c.drift > 0.7 && !I.hand) { c.boostT = Math.max(c.boostT, Math.min(1.3, c.drift * 0.55)); sfx.boost(); } if (!I.hand) c.drift = 0; }
  }
  const boosting = c.boostT > 0; c.boostT = Math.max(0, c.boostT - dt);
  const maxV = MAXV * c.skill * (boosting ? 1.36 : 1);
  if (onGround) {
    if (I.throttle > 0) vf += ACC * (boosting ? 1.9 : 1) * I.throttle * Math.max(0, 1 - vf / maxV) * dt;
    else if (I.throttle < 0) { if (vf > 0.5) vf -= 38 * dt; else vf -= 14 * dt * Math.max(0, 1 + vf / 13); }
    else vf -= vf * 0.55 * dt;
    if (boosting && vf < maxV) vf += 10 * dt;
    const water = c.gPrev < -0.12 ? 0.1 : 0;
    vf -= vf * (0.12 + 0.7 * c.off + water) * dt;
    if (vf > maxV) vf -= (vf - maxV) * 1.2 * dt;
    vl *= Math.exp(-(I.hand ? 2.1 : 9) * dt);
    if (I.hand) vf -= vf * 0.3 * dt;
  }
  c.steer += (I.steer - c.steer) * Math.min(1, dt * 7);
  c.h += c.steer * 2.15 * clamp(vf / 10, -1, 1) / (1 + Math.abs(vf) / 75) * (I.hand ? 1.5 : 1) * (onGround ? 1 : 0.2) * dt;
  c.vx = sh * vf + ch * vl; c.vz = ch * vf - sh * vl; c.vf = vf; c.vl = vl;
  c.x += c.vx * dt; c.z += c.vz * dt;
  // track frame
  const old = c.idx; c.idx = nearestIdx(c.x, c.z, c.idx, 30);
  let dI = c.idx - old; if (dI > N / 2) dI -= N; if (dI < -N / 2) dI += N; c.dist += dI;
  const i = c.idx, nx = NX[i], nz = NZ[i]; let lat = (c.x - TX[i]) * nx + (c.z - TZ[i]) * nz;
  if (Math.abs(lat) > WALL) { const s = Math.sign(lat), over = lat - s * WALL; c.x -= nx * over; c.z -= nz * over; lat = s * WALL;
    const vn = c.vx * nx + c.vz * nz; if (vn * s > 0) { c.vx -= nx * vn * 1.25; c.vz -= nz * vn * 1.25; c.vx *= 0.99; c.vz *= 0.99; }
    const fwd = Math.abs(wrapA(c.h - HD[i])) < Math.PI / 2 ? HD[i] : HD[i] + Math.PI; // glance off: align with wall
    c.h += wrapA(fwd - c.h) * Math.min(1, 5 * dt); }
  c.lat = lat; c.off = clamp((Math.abs(lat) - RW - 0.5) / 3.5, 0, 1);
  // vertical
  const g = Math.max(groundH(c.x, c.z), -0.55);
  if (c.y <= g + 0.02) { c.vy = clamp((g - c.gPrev) / dt, -40, 26); c.y = g; if (!c.grounded && c.air > 0.25) land(c); c.grounded = true; c.air = 0; }
  else { c.vy -= GRAV * dt; c.y += c.vy * dt; if (c.y <= g) { c.y = g; c.vy = 0; if (c.air > 0.25) land(c); c.grounded = true; c.air = 0; } else { c.grounded = false; c.air += dt; } }
  c.gPrev = g;
  // pads
  for (const p of pads) if (Math.abs(p.i - c.idx) < 4 && Math.abs(p.lat - lat) < 3 && c.grounded && c.boostT < 1) { c.boostT = 1.6; if (c.isPlayer) { sfx.boost(); flash('BOOST!', 0.6, true); } }
  // laps
  const lapNow = Math.floor(c.dist / N);
  if (lapNow > c.lap && !c.finished) {
    if (c.lap >= 0) { const lt = raceT - c.lapStart; if (!c.bestLap || lt < c.bestLap) c.bestLap = lt; }
    c.lap = lapNow; c.lapStart = raceT;
    if (c.lap >= LAPS) { c.finished = true; c.finishT = raceT; c.place = ++finishOrder; if (c.isPlayer) onFinish(); }
    else if (c.isPlayer && c.lap > 0) flash(c.lap === LAPS - 1 ? 'FINAL LAP!' : 'LAP ' + (c.lap + 1), 1.4, true);
  }
}
function land(c) { for (let k = 0; k < 14; k++) emitDust(c, true); if (c.isPlayer) shake = 0.35; }

// ───────────────────────── particles ─────────────────────────
const PN = 1100, pPos = new Float32Array(PN * 3), pCol = new Float32Array(PN * 4), pSize = new Float32Array(PN), pVel = new Float32Array(PN * 3), pLife = new Float32Array(PN), pMax = new Float32Array(PN), pS0 = new Float32Array(PN), pA0 = new Float32Array(PN);
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
};
function updateAudio() {
  if (!AC) return; const v = Math.abs(player.vf), fr = clamp(v / (MAXV * 1.3), 0, 1), gear = Math.min(4, fr * 5 | 0), rpm = fr * 5 - gear, f = 62 + gear * 16 + rpm * 85 + (player.boostT > 0 ? 30 : 0), t = AC.currentTime;
  eng1.frequency.setTargetAtTime(f, t, 0.05); eng2.frequency.setTargetAtTime(f * 0.5, t, 0.05); engFilt.frequency.setTargetAtTime(380 + fr * 1500, t, 0.08);
  const on = !muted && (state === 'race' || state === 'countdown' || state === 'finish') ? 1 : 0;
  engGain.gain.setTargetAtTime(on * (0.05 + fr * 0.05), t, 0.1); windGain.gain.setTargetAtTime(on * fr * fr * 0.12, t, 0.15);
}

// ───────────────────────── HUD ─────────────────────────
const $ = (id) => document.getElementById(id);
const hud = $('hud'), centerEl = $('center'), mini = $('mini'), mctx = mini.getContext('2d');
$('laps').textContent = LAPS;
let flashT = 0;
function flash(txt, dur, small) { centerEl.textContent = txt; centerEl.className = 'hud show' + (small ? ' small' : ''); flashT = dur; }
const fmt = (t) => { const m = t / 60 | 0, s = t - m * 60; return m + ':' + (s < 10 ? '0' : '') + s.toFixed(1); };
const suf = (n) => ['st', 'nd', 'rd'][n - 1] || 'th';
const miniBg = document.createElement('canvas'); miniBg.width = miniBg.height = 336;
const MS = 336 / 640, mx = (x) => 168 + x * MS, mz = (z) => 168 + z * MS;
{
  const g = miniBg.getContext('2d'); g.lineJoin = g.lineCap = 'round';
  const path = () => { g.beginPath(); for (let i = 0; i <= N; i += 4) g.lineTo(mx(TX[i % N]), mz(TZ[i % N])); g.closePath(); };
  g.strokeStyle = 'rgba(0,25,70,.6)'; g.lineWidth = 15; path(); g.stroke(); g.strokeStyle = '#fff'; g.lineWidth = 8; path(); g.stroke();
  g.fillStyle = '#111'; g.save(); g.translate(mx(TX[0]), mz(TZ[0])); g.rotate(-HD[0]); g.fillRect(-10, -2.5, 20, 5); g.restore();
}
function ranking() { return cars.slice().sort((a, b) => (a.finished && b.finished) ? a.place - b.place : a.finished ? -1 : b.finished ? 1 : b.dist - a.dist); }
let hudT = 0;
function updateHUD(dt) {
  if (flashT > 0) { flashT -= dt; if (flashT <= 0) centerEl.className = 'hud'; }
  hudT -= dt; if (hudT > 0) return; hudT = 0.05;
  const r = ranking(), p = r.indexOf(player) + 1;
  $('pos').textContent = p; $('posSuf').textContent = suf(p); $('lap').textContent = clamp(player.lap + 1, 1, LAPS); $('time').textContent = fmt(raceT);
  $('speed').textContent = Math.round(Math.abs(player.vf) * 3.6); $('nitroFill').style.width = (player.nitro * 100) + '%'; $('coins').textContent = player.coins;
  $('wrong').style.display = player.wrongT > 1.2 && state === 'race' ? 'block' : 'none';
  mctx.clearRect(0, 0, 336, 336); mctx.drawImage(miniBg, 0, 0);
  for (const c of cars) { mctx.beginPath(); mctx.arc(mx(c.x), mz(c.z), c.isPlayer ? 11 : 7.5, 0, 6.3); mctx.fillStyle = '#' + new THREE.Color(LIVERY[c.k][0]).getHexString(); mctx.fill(); mctx.lineWidth = c.isPlayer ? 4 : 2; mctx.strokeStyle = '#fff'; mctx.stroke(); }
}
function onFinish() {
  state = 'finish'; player.ai = true; const place = player.place; if (place === 1) sfx.win();
  $('finTitle').innerHTML = place === 1 ? 'YOU <span>WIN!</span>' : `${place}${suf(place)} <span>PLACE</span>`;
  let best = 0; try { best = +localStorage.getItem('ccr_best') || 0; if (!best || player.finishT < best) { best = player.finishT; localStorage.setItem('ccr_best', best); } } catch (e) {}
  setTimeout(() => {
    $('results').innerHTML = ranking().map((c, i) => `<div class="row ${c.isPlayer ? 'me' : ''}"><span>${i + 1}. ${c.name}</span><span>${c.finished ? fmt(c.finishT) : '—'}</span></div>`).join('') +
      `<div class="row"><span>Best lap</span><span>${fmt(player.bestLap)}</span></div><div class="row"><span>Coins</span><span>${player.coins}</span></div>` + (best ? `<div class="row"><span>Record</span><span>${fmt(best)}</span></div>` : '');
    $('finish').classList.remove('hide'); hud.classList.remove('on');
  }, 2200);
}
function startRace() { initAudio(); if (AC && AC.state === 'suspended') AC.resume(); resetRace(); state = 'countdown'; countT = 3.6; lastCount = 9; $('menu').classList.add('hide'); $('finish').classList.add('hide'); hud.classList.add('on'); camSnap = true; }
$('startBtn').onclick = startRace; $('againBtn').onclick = startRace;

// input
const keys = {};
addEventListener('keydown', (e) => { keys[e.code] = true; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  if (e.code === 'KeyM') muted = !muted; if (e.code === 'KeyR' && state === 'race') { placeCar(player, player.idx, 0); }
  if ((e.code === 'Enter') && (state === 'menu' || (state === 'finish' && !$('finish').classList.contains('hide')))) startRace(); });
addEventListener('keyup', (e) => { keys[e.code] = false; });
const touch = { l: 0, r: 0, b: 0, n: 0, on: false };
if ('ontouchstart' in window) { touch.on = true; $('touch').style.display = 'block';
  for (const [id, k] of [['tL', 'l'], ['tR', 'r'], ['tB', 'b'], ['tN', 'n']]) { const el = $(id);
    el.addEventListener('touchstart', (e) => { e.preventDefault(); touch[k] = 1; el.classList.add('on'); }, { passive: false });
    const up = (e) => { e.preventDefault(); touch[k] = 0; el.classList.remove('on'); }; el.addEventListener('touchend', up); el.addEventListener('touchcancel', up); } }
function readInput() {
  const up = keys.ArrowUp || keys.KeyW, dn = keys.ArrowDown || keys.KeyS || touch.b, l = keys.ArrowLeft || keys.KeyA || touch.l, r = keys.ArrowRight || keys.KeyD || touch.r;
  inp.throttle = dn ? -1 : (up || touch.on) ? 1 : 0; inp.steer = (l ? 1 : 0) - (r ? 1 : 0); inp.hand = !!keys.Space; inp.nitro = !!(keys.ShiftLeft || keys.ShiftRight || touch.n);
  if (state !== 'race') { inp.throttle = 0; inp.nitro = false; }
}

// ───────────────────────── post + resize ─────────────────────────
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 }));
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.25, 0.6, 1.05); composer.addPass(bloom); composer.addPass(new OutputPass());
composer.addPass(new ShaderPass({
  uniforms: { tDiffuse: { value: null } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform sampler2D tDiffuse; varying vec2 vUv;
    void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.2126,.7152,.0722));
      float sat=max(c.r,max(c.g,c.b))-min(c.r,min(c.g,c.b));
      c=mix(vec3(l),c,1.28+0.12*(1.-sat));            // saturation + vibrance
      c=(c-0.5)*1.09+0.5;                              // contrast
      c*=mix(1.,0.82,smoothstep(0.45,0.95,length(vUv-0.5)*1.25)); // vignette
      gl_FragColor=vec4(clamp(c,0.,1.),1.); }`,
}));
function resize() { const w = innerWidth, h = innerHeight, pr = Math.min(devicePixelRatio, 2); renderer.setPixelRatio(pr); renderer.setSize(w, h, false); composer.setPixelRatio(pr); composer.setSize(w, h);
  camera.aspect = w / h; camera.updateProjectionMatrix(); pMat.uniforms.uScale.value = h * pr * 0.9; }
addEventListener('resize', resize); resize();

// ───────────────────────── main loop ─────────────────────────
let camH = 0, camSnap = true, shake = 0, menuA = 0, last = performance.now(), time = 0;
const camPos = new THREE.Vector3(), look = new THREE.Vector3(), vA = new THREE.Vector3(), vB = new THREE.Vector3(), vF = new THREE.Vector3(), mat4 = new THREE.Matrix4(), q = new THREE.Quaternion(), qr = new THREE.Quaternion();
const ZAX = new THREE.Vector3(0, 0, 1);
function updateCarVisual(c, dt) {
  const e = 1.2, hx = Math.max(groundH(c.x + e, c.z), -0.55) - Math.max(groundH(c.x - e, c.z), -0.55), hz = Math.max(groundH(c.x, c.z + e), -0.55) - Math.max(groundH(c.x, c.z - e), -0.55);
  if (c.grounded) vA.set(-hx / (2 * e), 1, -hz / (2 * e)).normalize(); else vA.set(-Math.sin(c.h) * clamp(c.vy * 0.012, -0.3, 0.3), 1, -Math.cos(c.h) * clamp(c.vy * 0.012, -0.3, 0.3)).normalize();
  c.up.lerp(vA, Math.min(1, dt * (c.grounded ? 10 : 3))).normalize();
  vF.set(Math.sin(c.h), 0, Math.cos(c.h)); vB.crossVectors(c.up, vF).normalize(); vF.crossVectors(vB, c.up).normalize();
  mat4.makeBasis(vB, c.up, vF); q.setFromRotationMatrix(mat4);
  const G = c.model.G; G.position.set(c.x, c.y, c.z); G.quaternion.copy(q);
  c.model.body.rotation.z = lerp(c.model.body.rotation.z, clamp(-c.vl * 0.018 + c.steer * Math.abs(c.vf) * 0.0022, -0.16, 0.16), Math.min(1, dt * 8));
  c.model.body.position.y = Math.sin(time * 31 + c.k) * 0.012 * Math.min(1, Math.abs(c.vf) / 10);
  c.spin += c.vf / 0.62 * dt;
  for (const w of c.model.wheels) { w.spin.rotation.x = c.spin; if (w.front) w.pivot.rotation.y = c.steer * 0.42; }
  const b = c.boostT > 0; for (const f of c.model.flames) { f.visible = b; if (b) f.scale.set(1 + Math.random() * 0.5, 1 + Math.random() * 0.5, 0.8 + Math.random() * 0.8); }
}
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
  readInput();
  if (state === 'countdown') { countT -= dt; const n = Math.ceil(countT - 0.6);
    if (n !== lastCount) { lastCount = n; if (n > 0) { flash(String(n), 0.8); sfx.beep(false); } else { flash('GO!', 0.9); sfx.beep(true); state = 'race'; } } }
  if (state === 'race' || state === 'finish') raceT += state === 'race' ? dt : 0;
  if (state !== 'menu') {
    const sub = 2, h = dt / sub;
    for (let s = 0; s < sub; s++) {
      for (const c of cars) {
        if (c.ai) { aiInput(c, h, aiOut); if (c.finished) { aiOut.throttle = Math.hypot(c.vx, c.vz) > 22 ? 0 : aiOut.throttle; }
          const gap = (player.dist - c.dist) * SP; c.skill = c.isPlayer ? 1 : c.base * (1 + clamp(gap / 500, -0.1, 0.1)); stepCar(c, aiOut, h); }
        else { c.skill = 1; stepCar(c, inp, h); }
      }
      for (let a = 0; a < cars.length; a++) for (let b = a + 1; b < cars.length; b++) { const A = cars[a], B = cars[b], dx = B.x - A.x, dz = B.z - A.z, d = Math.hypot(dx, dz);
        if (d < 2.7 && d > 0.001 && Math.abs(A.y - B.y) < 1.6) { const nx = dx / d, nz = dz / d, o = (2.7 - d) / 2; A.x -= nx * o; A.z -= nz * o; B.x += nx * o; B.z += nz * o;
          const rv = (B.vx - A.vx) * nx + (B.vz - A.vz) * nz; if (rv < 0) { const j = -rv * 0.65; A.vx -= nx * j; A.vz -= nz * j; B.vx += nx * j; B.vz += nz * j; } } }
    }
    // wrong way
    const i = player.idx, along = player.vx * Math.sin(HD[i]) + player.vz * Math.cos(HD[i]); player.wrongT = along < -4 ? player.wrongT + dt : 0;
    // coins
    for (const k of coins) { if (k.t > 0) { k.t -= dt; continue; } const dx = k.x - player.x, dz = k.z - player.z;
      if (dx * dx + dz * dz < 5.3 && Math.abs(k.y - player.y - 1) < 2.5 && !player.finished) { k.t = 14; player.coins++; player.nitro = Math.min(1, player.nitro + 0.07); sfx.coin();
        for (let n = 0; n < 8; n++) emit(k.x, k.y, k.z, (Math.random() - 0.5) * 7, 2 + Math.random() * 5, (Math.random() - 0.5) * 7, 0.5, 0.35, 1, 0.85, 0.2, 0.9); } }
    // dust
    for (const c of cars) { const v = Math.abs(c.vf) + Math.abs(c.vl) * 2; if (c.grounded && v > 7) { c.emit += dt * (c.isPlayer ? 70 : 28) * Math.min(1, v / 30) * (c.gPrev < -0.08 ? 1.6 : 1); while (c.emit > 1) { c.emit--; emitDust(c); } } }
  }
  for (const c of cars) updateCarVisual(c, dt);
  coins.forEach((k, n) => { dummy.position.set(k.x, k.y + Math.sin(time * 3 + k.ph) * 0.15, k.z); dummy.rotation.set(0, time * 3.2 + k.ph, 0); dummy.scale.setScalar(k.t > 0 ? 0.0001 : 1); dummy.updateMatrix(); coinMesh.setMatrixAt(n, dummy.matrix); });
  coinMesh.instanceMatrix.needsUpdate = true;
  updateParticles(dt);
  padTex.offset.y = (time * 1.6) % 1; waterMat.uniforms.uTime.value = time;

  // camera
  const P = player;
  if (state === 'menu' || (state === 'finish' && !$('finish').classList.contains('hide'))) {
    menuA += dt * 0.22; camPos.set(P.x + Math.sin(menuA) * 9.5, P.y + 2.6 + Math.sin(menuA * 0.7) * 0.8, P.z + Math.cos(menuA) * 9.5);
    camPos.y = Math.max(camPos.y, groundH(camPos.x, camPos.z) + 1.2, 0.9);
    camera.position.lerp(camPos, camSnap ? 1 : Math.min(1, dt * 3)); look.set(P.x, P.y + 1.1, P.z); camera.lookAt(look); camera.fov = lerp(camera.fov, 50, Math.min(1, dt * 3)); camSnap = false; camH = P.h;
  } else {
    const sf = clamp(Math.abs(P.vf) / MAXV, 0, 1.4), bst = P.boostT > 0 ? 1 : 0;
    const tgt = Math.hypot(P.vx, P.vz) > 6 ? lerp(0, wrapA(Math.atan2(P.vx, P.vz) - P.h), 0.45) + P.h : P.h;
    camH += wrapA(tgt - camH) * Math.min(1, dt * 5.5); if (camSnap) camH = P.h;
    const back = 8.2 + sf * 1.6 - bst * 0.6, upH = 3.3 + sf * 0.3;
    camPos.set(P.x - Math.sin(camH) * back, P.y + upH, P.z - Math.cos(camH) * back);
    camPos.y = Math.max(camPos.y, groundH(camPos.x, camPos.z) + 1.4, 1.0);
    if (camSnap) { camera.position.copy(camPos); camSnap = false; } else { camera.position.x = camPos.x; camera.position.z = camPos.z; camera.position.y = lerp(camera.position.y, camPos.y, Math.min(1, dt * 7)); }
    if (shake > 0 || bst) { const s = shake * 0.5 + bst * 0.05; camera.position.x += (Math.random() - 0.5) * s; camera.position.y += (Math.random() - 0.5) * s; shake = Math.max(0, shake - dt * 1.5); }
    look.set(P.x + Math.sin(P.h) * 5, P.y + 1.5, P.z + Math.cos(P.h) * 5); camera.lookAt(look);
    camera.fov = lerp(camera.fov, 60 + sf * 13 + bst * 9, Math.min(1, dt * 4));
  }
  camera.updateProjectionMatrix();
  sky.position.copy(camera.position);
  sun.target.position.set(Math.round(P.x / 4) * 4, P.y, Math.round(P.z / 4) * 4); sun.position.copy(sun.target.position).addScaledVector(SUN, 190);
  updateHUD(dt); updateAudio();
  composer.render(dt);
}
resetRace(); cars.forEach(c => c.ai = true);
window.__game = { cars, player, get state() { return state; }, get raceT() { return raceT; }, startRace, N, renderer };
requestAnimationFrame(frame);
