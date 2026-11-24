// Crash effects: Blender-made debris (blender/debris.py) thrown out as instanced physics pieces that
// bounce, settle and fade, plus bright additive sparks that catch the bloom.
// main.js decides when a hit happens and how hard; this module only draws the aftermath.
import * as THREE from 'three';
import { scene, groundH } from './world.js';
import { ASSETS } from './assets.js';

const KINDS = { shard_panel: { cap: 70, metal: 0.35, rough: 0.35 }, shard_chip: { cap: 50, metal: 0.1, rough: 0.5 }, bolt: { cap: 40, metal: 1, rough: 0.25 }, clod: { cap: 70, metal: 0, rough: 0.95 } };
const pools = {};
const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3(), col = new THREE.Color();
const WHITE = new THREE.Color(0xffffff);
const floor = (x, z) => Math.max(groundH(x, z), -0.55);

function initPools() {
  if (pools.ready || !ASSETS.ready || !ASSETS.debris) return !!pools.ready;
  for (const [k, o] of Object.entries(KINDS)) {
    const geo = ASSETS.debris[k]; if (!geo) continue;
    const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: o.metal, roughness: o.rough }), o.cap);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.count = 0; mesh.frustumCulled = false; mesh.castShadow = false;
    mesh.setColorAt(0, col.set(0xffffff)); scene.add(mesh);
    pools[k] = { mesh, list: [], cap: o.cap };
  }
  pools.ready = true; return true;
}

// ── sparks: additive points, colours above 1.0 so the bloom pass makes them glow ──
const SN = 500, sPos = new Float32Array(SN * 3), sVel = new Float32Array(SN * 3), sLife = new Float32Array(SN), sMax = new Float32Array(SN), sSize = new Float32Array(SN), sHeat = new Float32Array(SN);
let sNext = 0;
const sGeo = new THREE.BufferGeometry();
sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3)); sGeo.setAttribute('aSize', new THREE.BufferAttribute(sSize, 1)); sGeo.setAttribute('aHeat', new THREE.BufferAttribute(sHeat, 1));
export const sparkMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uScale: { value: 600 } },
  vertexShader: `attribute float aSize; attribute float aHeat; uniform float uScale; varying float vH; void main(){ vH = aHeat; vec4 mv = modelViewMatrix * vec4(position, 1.); gl_PointSize = min(aSize * uScale / max(-mv.z, 0.1), 40.); gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `varying float vH; void main(){ float r = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, r); if (a < 0.01 || vH <= 0.0) discard;
    vec3 c = mix(vec3(1.4, 0.25, 0.02), vec3(3.6, 1.7, 0.35), vH); gl_FragColor = vec4(c * a * vH, a * vH); }`,
});
const sparks = new THREE.Points(sGeo, sparkMat); sparks.frustumCulled = false; sparks.renderOrder = 6; scene.add(sparks);

function spark(x, y, z, vx, vy, vz) {
  const i = sNext; sNext = (sNext + 1) % SN;
  sPos[i * 3] = x; sPos[i * 3 + 1] = y; sPos[i * 3 + 2] = z; sVel[i * 3] = vx; sVel[i * 3 + 1] = vy; sVel[i * 3 + 2] = vz;
  sLife[i] = sMax[i] = 0.25 + Math.random() * 0.45; sSize[i] = 0.06 + Math.random() * 0.08;
}

function throwPiece(kind, x, y, z, vx, vy, vz, color, scale) {
  const P = pools[kind]; if (!P) return;
  const it = { x, y, z, vx, vy, vz, rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6,
    wx: (Math.random() - 0.5) * 22, wy: (Math.random() - 0.5) * 22, wz: (Math.random() - 0.5) * 22, life: 5 + Math.random() * 3, scale, rest: false };
  if (P.list.length >= P.cap) P.list.shift();
  P.list.push(it); it.color = color;
}

/**
 * Something hit something. (x, y, z) = contact point; (nx, nz) = direction the hit car is pushed (sparks and
 * debris fly that way); k = strength 0..1; paint = hex colour of the car's body; dirt = [r, g, b] of the ground.
 */
export function impact(x, y, z, nx, nz, k, paint, dirt) {
  initPools();
  const n = 10 + Math.round(40 * k);
  for (let i = 0; i < n; i++) {
    const sp = 5 + Math.random() * 12 * (0.5 + k), a = Math.random() * Math.PI * 2;
    spark(x, y, z, nx * sp * 0.7 + Math.cos(a) * sp * 0.5, 1.5 + Math.random() * 6, nz * sp * 0.7 + Math.sin(a) * sp * 0.5);
  }
  const fling = (kind, count, color, scale = 1) => { for (let i = 0; i < count; i++) {
    const sp = 2.5 + Math.random() * 6 * (0.4 + k);
    throwPiece(kind, x + (Math.random() - 0.5) * 0.4, y + (Math.random() - 0.2) * 0.4, z + (Math.random() - 0.5) * 0.4,
      nx * sp + (Math.random() - 0.5) * 4, 2 + Math.random() * 5 * (0.5 + k), nz * sp + (Math.random() - 0.5) * 4, color, scale * (0.7 + Math.random() * 0.6)); } };
  const pc = new THREE.Color(paint), dc = new THREE.Color().setRGB(dirt[0], dirt[1], dirt[2]);
  fling('shard_panel', Math.round(1 + 5 * k), pc);
  fling('shard_chip', Math.round(1 + 3 * k), pc.clone().multiplyScalar(0.85));
  fling('bolt', Math.round(3 * k), null);
  fling('clod', Math.round(2 + 5 * k), dc, 1.2);
}

export function clearDebris() { for (const k in KINDS) if (pools[k]) { pools[k].list.length = 0; pools[k].mesh.count = 0; } }

export function crashTick(dt, pixScale) {
  sparkMat.uniforms.uScale.value = pixScale;
  for (let i = 0; i < SN; i++) {
    if (sLife[i] <= 0) { sHeat[i] = 0; continue; }
    sLife[i] -= dt; sVel[i * 3 + 1] -= 16 * dt;
    sPos[i * 3] += sVel[i * 3] * dt; sPos[i * 3 + 1] += sVel[i * 3 + 1] * dt; sPos[i * 3 + 2] += sVel[i * 3 + 2] * dt;
    const g = floor(sPos[i * 3], sPos[i * 3 + 2]);
    if (sPos[i * 3 + 1] < g) { sPos[i * 3 + 1] = g; sVel[i * 3 + 1] *= -0.35; sVel[i * 3] *= 0.6; sVel[i * 3 + 2] *= 0.6; }
    sHeat[i] = Math.max(0, sLife[i] / sMax[i]);
  }
  sGeo.attributes.position.needsUpdate = sGeo.attributes.aHeat.needsUpdate = sGeo.attributes.aSize.needsUpdate = true;
  if (!pools.ready) return;
  for (const k in KINDS) {
    const P = pools[k]; if (!P) continue;
    let w = 0;
    for (const it of P.list) {
      it.life -= dt; if (it.life <= 0) continue;
      if (!it.rest) {
        it.vy -= 18 * dt; it.x += it.vx * dt; it.y += it.vy * dt; it.z += it.vz * dt;
        it.rx += it.wx * dt; it.ry += it.wy * dt; it.rz += it.wz * dt;
        const g = floor(it.x, it.z) + 0.03 * it.scale;
        if (it.y < g) { it.y = g; it.vy = Math.abs(it.vy) * 0.3; it.vx *= 0.55; it.vz *= 0.55; it.wx *= 0.5; it.wy *= 0.5; it.wz *= 0.5;
          if (it.vy < 0.8 && Math.hypot(it.vx, it.vz) < 0.6) { it.rest = true; it.rx = Math.round(it.rx / Math.PI) * Math.PI; it.rz = Math.round(it.rz / Math.PI) * Math.PI; } }
      }
      const fade = Math.min(1, it.life / 0.8);
      p.set(it.x, it.y, it.z); q.setFromEuler(e.set(it.rx, it.ry, it.rz)); s.setScalar(it.scale * fade);
      P.mesh.setMatrixAt(w, m4.compose(p, q, s));
      P.mesh.setColorAt(w, it.color || WHITE);
      P.list[w++] = it;
    }
    P.list.length = w; P.mesh.count = w;
    P.mesh.instanceMatrix.needsUpdate = true; if (P.mesh.instanceColor) P.mesh.instanceColor.needsUpdate = true;
  }
}
