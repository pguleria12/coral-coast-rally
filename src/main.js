// Coral Coast Rally — original beach buggy racer. Everything (models, textures, sound) is procedural.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createNet } from './net.js';
import { createMusic } from './music.js';
import { ASSETS, loadAssets } from './assets.js';
import { clamp, lerp, wrapA, rand, canvasTex, LAPS, RW, WALL, MAXV, ACC, GRAV, SUN, AUTO, renderer, scene, camera, sky, sun, dummy, nearestIdx, groundH,
  TX, TZ, HD, NX, NZ, VC, CURV, N, SP, pads, coins, coinMesh, buildWorld, worldTick, followWeather, gripAt, trackFrame, SC, THEMES, TRACK_IDS, setNight, theme, SCDBG } from './world.js';

// build the last-used track (and time of day) before anything reads the track data
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
let trackId = TRACK_IDS.includes(lsGet('ccr_track', 'beach')) ? lsGet('ccr_track', 'beach') : 'beach', isNight = !!lsGet('ccr_night', false);
setNight(isNight); buildWorld(trackId);

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
  const BB = ASSETS.ready && ASSETS.cars[sports ? 'buggy_sports' : 'buggy_classic'];
  if (BB) {
    // Blender body (blender/buggy.py): swap its named materials for this car's livery
    const suit = new THREE.MeshStandardMaterial({ color: look.paint, roughness: 0.7 }), accent = new THREE.MeshStandardMaterial({ color: look.rim, roughness: 0.35, metalness: 0.3 });
    const MAP = { Paint: paint, Dark: darkMat, Chrome: chromeMat, Tire: tireMat, Rim: rim, Lamp: lamp, Suit: suit, Accent: accent };
    const b = BB.clone(); b.position.y = L;
    b.traverse(o => { if (o.isMesh) { const m = MAP[o.material.name]; if (m) o.material = m; else SHARED.add(o.material); } });
    body.add(b);
    if (sports) { exY = 1.12; exZ = -2.25; }
  } else if (!sports) {
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
  if (!BB) body.add(helmet, visor);
  // rockets
  const flames = []; const rocket = !!look.rocket;
  const RK = rocket && ASSETS.ready && ASSETS.cars.rocket;
  if (RK) for (const s of [-1, 1]) {
    // Blender booster (blender/buggy.py), same mount point as the built-in one
    const x = s * 0.62, y = (sports ? 1.38 : 1.45) + L, r = RK.clone(); r.position.set(x, y, -1.45);
    r.traverse(o => { if (o.isMesh) { const m = { Chrome: chromeMat, Dark: darkMat }[o.material.name]; if (m) o.material = m; else SHARED.add(o.material); } });
    body.add(r); exY = y; exZ = -2.3;
  }
  else if (rocket) for (const s of [-1, 1]) {
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
    const BW = ASSETS.ready && ASSETS.cars[big ? 'wheel_big' : 'wheel_std'];
    if (BW) { const w = BW.clone(); w.scale.set(WW, WR, WR); w.traverse(o => { if (o.isMesh) o.material = { Tire: tireMat, Rim: rim, Dark: darkMat, Chrome: chromeMat }[o.material.name] || o.material; }); spin.add(w); }
    else {
    spin.add(new THREE.Mesh(tg, tireMat), new THREE.Mesh(rg, rim));
    for (let k = 0; k < (big ? 8 : 6); k++) { const kn = new THREE.Mesh(kg, tireMat); kn.rotation.x = k * Math.PI / (big ? 8 : 6); spin.add(kn); }
    const sp = new THREE.Mesh(new THREE.BoxGeometry(WW + 0.06, 0.1, WR), chromeMat), sp2 = sp.clone(); sp2.rotation.x = Math.PI / 2; spin.add(sp, sp2);
    }
    G.add(pivot); wheels.push({ pivot, spin, front });
    body.add(tube(V(sx * 0.6, 0.85, z), new THREE.Vector3(x * 0.82, WR + 0.04, z), big ? 0.07 : 0.05, darkMat));
  }
  G.traverse(o => { if (o.isMesh) o.castShadow = o.material.blending !== THREE.AdditiveBlending; });
  return { G, body, wheels, flames, wr: WR };
}
function disposeModel(m) { m.G.traverse(o => { if (o.isMesh) { if (!o.userData.sharedGeo) o.geometry.dispose(); if (!SHARED.has(o.material)) o.material.dispose(); } }); }

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
const newProfile = (nick) => ({ nick, coins: 0, owned: ['lava'], eq: { paint: 'lava' }, races: 0, wins: 0, best: 0, lap: 0, tb: {}, earned: 0, ts: 0 });
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
function trackBests(p) { const tb = Object.assign({}, p.tb || {}); if (!tb.beach && p.best) tb.beach = [p.best, p.lap || 0]; return tb; }
function boardEntry(p) { return { nick: p.nick, wins: p.wins, races: p.races, best: p.best, lap: p.lap, tb: trackBests(p), earned: p.earned, paint: paintOf(p).col, body: p.eq.sports ? 1 : 0, ts: p.ts }; }
const bestOn = (e, id) => (e.tb && e.tb[id]) ? e.tb[id] : (id === 'beach' && e.best ? [e.best, e.lap || 0] : [0, 0]);
function mergeBoard(list) {
  let ch = false;
  for (const e of list || []) {
    if (!e || typeof e.nick !== 'string' || !/^[\w \-]{2,14}$/.test(e.nick)) continue;
    const key = e.nick.toLowerCase(), cur = board[key];
    const tb = {}; if (e.tb && typeof e.tb === 'object') for (const id of TRACK_IDS) { const v = e.tb[id]; if (Array.isArray(v)) tb[id] = [+v[0] || 0, +v[1] || 0]; }
    const clean = { nick: e.nick, wins: +e.wins | 0, races: +e.races | 0, best: +e.best || 0, lap: +e.lap || 0, tb, earned: +e.earned | 0, paint: +e.paint | 0, body: +e.body | 0, ts: +e.ts || 0 };
    if (!cur || clean.races > cur.races || (clean.races === cur.races && clean.ts > cur.ts)) { board[key] = clean; ch = true; }
  }
  if (ch) store.set('ccr_board', board);
  return ch;
}
const sortedBoard = () => Object.values(board).sort((a, b) => b.wins - a.wins || (bestOn(a, trackId)[0] || 1e9) - (bestOn(b, trackId)[0] || 1e9) || b.earned - a.earned);
for (const p of Object.values(profiles)) mergeBoard([boardEntry(p)]);

// ───────────────────────── cars ─────────────────────────
const cars = LIVERY.map((_, k) => ({ k, name: BOT_NAMES[k], model: null, lookKey: '', ctrl: 'ai', st: BASE_ST, view: null, prof: null, x: 0, y: 0, z: 0, h: 0, vx: 0, vz: 0, vy: 0, steer: 0, surf: 1, idx: 0, mi: -1, sc: false, si: 0, dist: 0, lap: -1, lat: 0, off: 0,
  grounded: true, air: 0, gPrev: 0, up: new THREE.Vector3(0, 1, 0), boostT: 0, nitro: 0.5, drift: 0, base: [0.9, 0.925, 0.95, 0.97, 0.99, 1][k], skill: 1,
  lane: 0, laneT: 0, laneTarget: 0, finished: false, finishT: 0, lapStart: 0, bestLap: 0, coins: 0, wrongT: 0, spin: 0, emit: 0, vf: 0, vl: 0, net: null, reward: null }));
function setLook(c, look) {
  const key = JSON.stringify(look); if (key === c.lookKey && c.model) return;
  const keep = c.model && c.model.G.position.clone();
  if (c.model) { scene.remove(c.model.G); disposeModel(c.model); }
  c.model = buildBuggy(look); c.lookKey = key; c.look = look; scene.add(c.model.G); if (keep) c.model.G.position.copy(keep);
}
function placeCar(c, i, lat) {
  i = (i + N) % N; c.x = TX[i] + NX[i] * lat; c.z = TZ[i] + NZ[i] * lat; c.h = HD[i]; c.idx = i; c.mi = i; c.sc = false; c.si = 0; c.y = Math.max(groundH(c.x, c.z), -0.55); c.gPrev = c.y;
  c.vx = c.vz = c.vy = 0; c.vf = c.vl = 0; c.steer = 0; c.grounded = true; c.air = 0; c.up.set(0, 1, 0);
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
  let tx = TX[j] + NX[j] * c.lane, tz = TZ[j] + NZ[j] * c.lane;
  if (c.sc && SC) { const s = Math.min(SC.M - 1, c.si + Math.floor(6 + v * 0.3)); tx = SC.X[s]; tz = SC.Z[s]; }
  const dh = wrapA(Math.atan2(tx - c.x, tz - c.z) - c.h);
  out.steer = clamp(dh * 2.4, -1, 1);
  let target = 999;
  for (let k = 0; k < 54; k += 3) { const vc = VC[(c.idx + k) % N] * (0.94 + c.base * 0.1) * c.st.top, allow = Math.sqrt(vc * vc + 2 * 28 * k * SP); if (allow < target) target = allow; }
  out.throttle = state === 'race' || state === 'finish' ? (v < target ? 1 : v > target + 4 ? -1 : 0) : 0;
  out.hand = false; out.nitro = false;
}

function stepCar(c, I, dt) {
  const S = c.st, sh = Math.sin(c.h), ch = Math.cos(c.h);
  let vf = c.vx * sh + c.vz * ch, vl = c.vx * ch - c.vz * sh;
  c.surf = gripAt(c.x, c.z);
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
    vl *= Math.exp(-(I.hand ? 2.1 : 9 * S.grip * c.surf) * dt);
    if (I.hand) vf -= vf * 0.3 * dt;
  }
  c.steer += (I.steer - c.steer) * Math.min(1, dt * 7);
  c.h += c.steer * 2.15 * S.grip * clamp(vf / 10, -1, 1) / (1 + Math.abs(vf) / 75) * (I.hand ? 1.5 / S.grip : 1) * (onGround ? 1 : 0.2) * dt;
  c.vx = sh * vf + ch * vl; c.vz = ch * vf - sh * vl; c.vf = vf; c.vl = vl;
  c.x += c.vx * dt; c.z += c.vz * dt;
  const old = c.idx, wasSC = c.sc, F = trackFrame(c, c.ctrl === 'local');
  if (c.sc && !wasSC && c.view && !c.auto) { flash(c.view, '🚧 SECRET BYPASS!', 1.1, true); sfx.boost(); }
  let dI = c.idx - old; if (dI > N / 2) dI -= N; if (dI < -N / 2) dI += N; c.dist += dI;
  const nx = F.nx, nz = F.nz, WL = F.wall, hd = F.hd; let lat = (c.x - F.px) * nx + (c.z - F.pz) * nz;
  if (Math.abs(lat) > WL) { const s = Math.sign(lat), over = lat - s * WL; c.x -= nx * over; c.z -= nz * over; lat = s * WL;
    const vn = c.vx * nx + c.vz * nz; if (vn * s > 0) { c.vx -= nx * vn * 1.25; c.vz -= nz * vn * 1.25; c.vx *= 0.99; c.vz *= 0.99; }
    const fwd = Math.abs(wrapA(c.h - hd)) < Math.PI / 2 ? hd : hd + Math.PI;
    c.h += wrapA(fwd - c.h) * Math.min(1, 5 * dt); }
  c.lat = lat; c.off = clamp((Math.abs(lat) - F.rw - 0.5) / 3.5, 0, 1);
  const g = Math.max(groundH(c.x, c.z), -0.55);
  if (c.y <= g + 0.02) { c.vy = clamp((g - c.gPrev) / dt, -40, 26); c.y = g; if (!c.grounded && c.air > 0.25) land(c); c.grounded = true; c.air = 0; }
  else { c.vy -= GRAV * dt; c.y += c.vy * dt; if (c.y <= g) { c.y = g; c.vy = 0; if (c.air > 0.25) land(c); c.grounded = true; c.air = 0; } else { c.grounded = false; c.air += dt; } }
  c.gPrev = g;
  for (const p of pads) if (!c.sc && Math.abs(p.i - c.idx) < 4 && Math.abs(p.lat - lat) < 3 && c.grounded && c.boostT < 1) { c.boostT = 1.6; if (c.view) { sfx.boost(); flash(c.view, 'BOOST!', 0.6, true); } }
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
let pNext = 0; const pWet = new Uint8Array(PN);
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pGeo.setAttribute('aColor', new THREE.BufferAttribute(pCol, 4)); pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
const pMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uScale: { value: 600 } },
  vertexShader: `attribute vec4 aColor; attribute float aSize; uniform float uScale; varying vec4 vC; void main(){ vC=aColor; vec4 mv=modelViewMatrix*vec4(position,1.); vC.a*=smoothstep(2.5,7.,-mv.z); gl_PointSize=min(aSize*uScale/max(-mv.z,0.1),160.); gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `varying vec4 vC; void main(){ float r=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.12,r)*vC.a; if(a<0.004) discard; gl_FragColor=vec4(vC.rgb,a); }` });
const pts = new THREE.Points(pGeo, pMat); pts.frustumCulled = false; pts.renderOrder = 5; scene.add(pts);
function emit(x, y, z, vx, vy, vz, life, size, r, g, b, a, wet = 0) {
  const i = pNext; pWet[i] = wet; pNext = (pNext + 1) % PN; pPos[i * 3] = x; pPos[i * 3 + 1] = y; pPos[i * 3 + 2] = z; pVel[i * 3] = vx; pVel[i * 3 + 1] = vy; pVel[i * 3 + 2] = vz;
  pLife[i] = pMax[i] = life; pS0[i] = size; pA0[i] = a; pCol[i * 4] = r; pCol[i * 4 + 1] = g; pCol[i * 4 + 2] = b;
}
function emitDust(c, burst) {
  const sh = Math.sin(c.h), ch = Math.cos(c.h), side = (Math.random() < 0.5 ? -1 : 1) * 1.05, bx = c.x - sh * 1.3 + ch * side, bz = c.z - ch * 1.3 - sh * side;
  const wet = c.gPrev < -0.08, sp = burst ? 5 : 2.5, D = theme.dust;
  if (wet) emit(bx, 0.15, bz, -c.vx * 0.12 + (Math.random() - 0.5) * 5, 3.5 + Math.random() * 5, -c.vz * 0.12 + (Math.random() - 0.5) * 5, 0.7 + Math.random() * 0.4, 0.5 + Math.random() * 0.6, 0.92, 1, 1, 0.75, 1);
  else emit(bx, c.y + 0.25, bz, c.vx * 0.12 + (Math.random() - 0.5) * sp, 0.8 + Math.random() * 2.2, c.vz * 0.12 + (Math.random() - 0.5) * sp, 0.7 + Math.random() * 0.6, 0.5 + Math.random() * 0.5, D[0], D[1], D[2], (burst ? 0.3 : 0.16) * (theme.id === 'snow' ? 1.8 : 1));
}
function updateParticles(dt) {
  for (let i = 0; i < PN; i++) {
    if (pLife[i] <= 0) { pSize[i] = 0; continue; }
    pLife[i] -= dt; const t = 1 - pLife[i] / pMax[i], wet = pWet[i];
    pVel[i * 3 + 1] -= (wet ? 14 : 1.2) * dt; pPos[i * 3] += pVel[i * 3] * dt; pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt; pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt;
    pSize[i] = pS0[i] * (1 + t * (wet ? 1.2 : 3.2)); pCol[i * 4 + 3] = pA0[i] * (1 - t) * Math.min(1, t * 8);
  }
  pGeo.attributes.position.needsUpdate = pGeo.attributes.aColor.needsUpdate = pGeo.attributes.aSize.needsUpdate = true;
}

// ───────────────────────── audio ─────────────────────────
let AC = null, muted = false, music = null, musicOn = true, master, eng1, eng2, engGain, engFilt, windGain, noiseBuf;
function initAudio() {
  if (AC) return; try {
    AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = 0.6; master.connect(AC.destination);
    engFilt = AC.createBiquadFilter(); engFilt.type = 'lowpass'; engFilt.frequency.value = 500; engGain = AC.createGain(); engGain.gain.value = 0; engFilt.connect(engGain); engGain.connect(master);
    eng1 = AC.createOscillator(); eng1.type = 'sawtooth'; eng2 = AC.createOscillator(); eng2.type = 'square'; const g2 = AC.createGain(); g2.gain.value = 0.5;
    eng1.connect(engFilt); eng2.connect(g2); g2.connect(engFilt); eng1.start(); eng2.start();
    noiseBuf = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const ws = AC.createBufferSource(); ws.buffer = noiseBuf; ws.loop = true; const wf = AC.createBiquadFilter(); wf.type = 'bandpass'; wf.frequency.value = 900; wf.Q.value = 0.4;
    windGain = AC.createGain(); windGain.gain.value = 0; ws.connect(wf); wf.connect(windGain); windGain.connect(master); ws.start();
    music = createMusic(AC, master); music.setTheme(trackId); syncMusic();
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
function syncMusic() {
  const play = musicOn && !muted;
  if (music) { music.setLevel(state === 'race' || state === 'countdown' || state === 'finish' ? 1 : 0.7); music.setOn(play); }
  const lbl = musicOn ? '🎵 Music: ON' : '🔇 Music: OFF';
  for (const id of ['musicBtn', 'musicHud']) { const b = $(id); if (b) { b.textContent = id === 'musicHud' ? (play ? '🎵' : '🔇') : lbl; b.classList.toggle('off', !play); } }
}
function toggleMusic() { unlockAudio(); musicOn = !musicOn; store.set('ccr_music', musicOn); if (musicOn) muted = false; syncMusic(); }
function updateAudio() {
  if (music) music.setLevel(state === 'race' || state === 'countdown' || state === 'finish' ? 1 : 0.7);
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
// Graphics quality. Every frame is drawn at full Retina resolution through several full-screen passes,
// so resolution and frame-rate caps are what keep laptops cool. 'eco' drops bloom and halves shadow cost.
const QUALITY = {
  high:     { label: 'High',     pr: 2,   fps: 0,  menuFps: 60, bloom: true,  shadow: 2048 },
  balanced: { label: 'Balanced', pr: 1.5, fps: 60, menuFps: 30, bloom: true,  shadow: 2048 },
  eco:      { label: 'Eco',      pr: 1,   fps: 60, menuFps: 30, bloom: false, shadow: 1024 },
};
let quality = QUALITY[lsGet('ccr_quality', 'balanced')] ? lsGet('ccr_quality', 'balanced') : 'balanced';
const QUAL = () => QUALITY[quality];
function applyQuality() {
  const q = QUAL();
  if (sun.shadow.mapSize.x !== q.shadow) { sun.shadow.mapSize.set(q.shadow, q.shadow); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } }
  renderer.shadowMap.type = q.shadow < 2048 ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
  for (const v of views) v.bloom.enabled = q.bloom;
  const b = $('qualBtn'); if (b) b.textContent = '⚙️ Graphics: ' + q.label;
  layout();
}
function cycleQuality() { const k = Object.keys(QUALITY); quality = k[(k.indexOf(quality) + 1) % k.length]; store.set('ccr_quality', quality); applyQuality(); }
const HUD_HTML = `<div class="tl hud"><div class="panel"><div class="lbl">POSITION</div><div class="posBox"><span class="pos">6</span><small class="suf">th</small><span class="tot">/ 6</span></div></div>
  <div class="panel"><div class="lbl">LAP</div><div class="val"><span class="lap">1</span> / ${LAPS}</div></div></div>
  <div class="tr hud"><div class="panel coinsBox"><div class="lbl">COINS</div><div class="val">● <span class="coins">0</span></div></div><div class="panel"><div class="lbl">TIME</div><div class="val time">0:00.0</div></div></div>
  <div class="bl hud panel"><canvas class="mini" width="336" height="336"></canvas></div>
  <div class="br hud panel"><div><span class="speed">0</span><span class="speedUnit">KM/H</span></div><div class="lbl" style="margin-top:6px">NITRO</div><div class="nitro"><div class="nitroFill"></div></div></div>
  <div class="wrong hud">⟲ WRONG WAY</div><div class="ptag hud"></div><div class="center hud"></div>`;
function makeView(i, cam) {
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 }));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.25, 0.6, 1.05); bloom.enabled = QUAL().bloom;
  composer.addPass(new RenderPass(scene, cam)); composer.addPass(bloom); composer.addPass(new OutputPass()); composer.addPass(new ShaderPass(GRADE));
  const el = document.createElement('div'); el.className = 'phud'; el.innerHTML = HUD_HTML; $('huds').appendChild(el);
  const q = (s) => el.querySelector(s), mini = q('.mini');
  return { i, cam, composer, bloom, el, car: null, camH: 0, snap: true, shake: 0, rect: { x: 0, y: 0, w: 1, h: 1 }, flashT: 0, sized: '',
    hud: { pos: q('.pos'), suf: q('.suf'), lap: q('.lap'), time: q('.time'), coins: q('.coins'), speed: q('.speed'), nitro: q('.nitroFill'), wrong: q('.wrong'), center: q('.center'), tag: q('.ptag'), mctx: mini.getContext('2d') } };
}
const views = [makeView(0, camera), makeView(1, new THREE.PerspectiveCamera(62, 1, 0.3, 7000))];
function flash(v, txt, dur, small) { if (!v) return; v.hud.center.textContent = txt; v.hud.center.className = 'center hud show' + (small ? ' small' : ''); v.flashT = dur; }
const miniBg = document.createElement('canvas'); miniBg.width = miniBg.height = 336;
const MS = 336 / 640, mx = (x) => 168 + x * MS, mz = (z) => 168 + z * MS;
function drawMini() { // the secret bypass is deliberately left off the map
  const g = miniBg.getContext('2d'); g.clearRect(0, 0, 336, 336); g.lineJoin = g.lineCap = 'round';
  const path = () => { g.beginPath(); for (let i = 0; i <= N; i += 4) g.lineTo(mx(TX[i % N]), mz(TZ[i % N])); g.closePath(); };
  g.strokeStyle = 'rgba(0,25,70,.6)'; g.lineWidth = 15; path(); g.stroke(); g.strokeStyle = '#fff'; g.lineWidth = 8; path(); g.stroke();
  g.fillStyle = '#111'; g.save(); g.translate(mx(TX[0]), mz(TZ[0])); g.rotate(-HD[0]); g.fillRect(-10, -2.5, 20, 5); g.restore();
}
drawMini();
// headlights for the player cars (always in the scene so shaders never recompile; dark during the day)
const heads = [0, 1].map(() => { const l = new THREE.SpotLight(0xfff1d6, 0, 75, 0.52, 0.55, 1.4); scene.add(l, l.target); return l; });
let headK = 0;
function updateHeadlights() { headK = isNight ? 260 : 0; }
function aimHeadlight(i, c) {
  heads.forEach((l, k) => { l.intensity = k === i && c ? headK : 0; });
  if (!c || !headK) return; const l = heads[i], sh = Math.sin(c.h), ch = Math.cos(c.h);
  l.position.set(c.x + sh * 1.9, c.y + 1.5, c.z + ch * 1.9); l.target.position.set(c.x + sh * 22, c.y - 0.5, c.z + ch * 22); l.target.updateMatrixWorld();
}
function ranking() { return cars.slice().sort((a, b) => (a.finished && b.finished) ? a.finishT - b.finishT : a.finished ? -1 : b.finished ? 1 : b.dist - a.dist); }
const nViews = () => (mode === 'split' && state !== 'menu') ? 2 : 1;
function layout() {
  const W = innerWidth, H = innerHeight, pr = Math.min(devicePixelRatio, QUAL().pr), n = nViews();
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
  unlockAudio();
  resetRace(); state = 'countdown'; countT = 3.6; if (touch.tiltOk) recentre(); lastCount = 9; resultsOpen = false;
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
  const tb = p.tb || (p.tb = {}), cur = tb[trackId] || (trackId === 'beach' && p.best ? [p.best, p.lap || 0] : [0, 0]);
  tb[trackId] = [!cur[0] || c.finishT < cur[0] ? c.finishT : cur[0], c.bestLap && (!cur[1] || c.bestLap < cur[1]) ? c.bestLap : cur[1]];
  if (trackId === 'beach') { p.best = tb.beach[0]; p.lap = tb.beach[1]; } p.ts = Date.now();
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
  if (e.code === 'KeyM') { muted = !muted; syncMusic(); }
  if (e.code === 'KeyN') toggleMusic();
  if (state === 'race') { if (e.code === 'KeyR' && locals[0]) placeCar(locals[0].car, locals[0].car.idx, 0); if (e.code === 'Backspace' && locals[1]) placeCar(locals[1].car, locals[1].car.idx, 0); }
  if (e.code === 'Escape' && state === 'menu') showScreen('scrMain');
});
addEventListener('keyup', (e) => { keys[e.code] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
// touch: tilt-to-steer (or ◀ ▶ buttons) + a round NITRO / DRIFT / BRAKE dial in the corner
const touch = { l: 0, r: 0, b: 0, n: 0, d: 0, on: false, tilt: lsGet('ccr_tilt', true), tiltOk: false, asked: false, raw: 0, zero: 0, steer: 0, lastEv: 0 };
const D2R = Math.PI / 180;
function onOrient(e) {
  if (e.beta == null || e.gamma == null) return;
  const b = e.beta * D2R, g = e.gamma * D2R, ux = -Math.sin(g) * Math.cos(b), uy = Math.sin(b); // "up" in device axes, screen plane
  const ang = (((screen.orientation && screen.orientation.angle != null ? screen.orientation.angle : window.orientation) || 0) % 360 + 360) % 360;
  const sx = ang === 90 ? -uy : ang === 270 ? uy : ang === 180 ? -ux : ux; // up-vector along the screen's right edge
  touch.raw = Math.asin(clamp(sx, -1, 1)) / D2R; touch.lastEv = performance.now();
  if (!touch.tiltOk) { touch.tiltOk = true; touch.zero = touch.raw; syncTouchUI(); }
}
function enableTilt() {
  if (touch.asked || touch.granted) return;
  const DOE = window.DeviceOrientationEvent, grant = () => { touch.granted = true; addEventListener('deviceorientation', onOrient); };
  if (!DOE) return;
  if (typeof DOE.requestPermission !== 'function') return grant();
  touch.asked = true;
  DOE.requestPermission().then(r => { touch.asked = false; if (r === 'granted') grant(); else { touch.tilt = false; syncTouchUI(); toast('Tilt not allowed — using ◀ ▶ buttons'); } }).catch(() => { touch.asked = false; });
}
const recentre = () => { touch.zero = touch.raw; };
function syncTouchUI() {
  if (!touch.on) return; const tiltMode = touch.tilt && touch.tiltOk;
  $('touch').classList.toggle('tilt', tiltMode);
  const tb = $('tiltBtn'); if (tb) tb.textContent = touch.tilt ? '📱 Tilt steering: ON' : '📱 Tilt steering: OFF (buttons)';
}
if ('ontouchstart' in window || (navigator.maxTouchPoints > 0 && matchMedia('(pointer:coarse)').matches) || /[?&]touch=1/.test(location.search)) {
  touch.on = true; document.body.classList.add('touchui');
  for (const [id, k] of [['tL', 'l'], ['tR', 'r']]) { const el = $(id);
    el.addEventListener('touchstart', (e) => { e.preventDefault(); touch[k] = 1; el.classList.add('on'); }, { passive: false });
    const up = (e) => { e.preventDefault(); touch[k] = 0; el.classList.remove('on'); }; el.addEventListener('touchend', up); el.addEventListener('touchcancel', up); }
  // dial: three 120° wedges, any number of fingers, slide between wedges
  const dial = $('dial'), seg = (a0, a1, r0, r1) => { const p = (a, r) => `${(100 + Math.cos(a * D2R) * r).toFixed(2)} ${(100 + Math.sin(a * D2R) * r).toFixed(2)}`;
    return `M${p(a0, r1)} A${r1} ${r1} 0 0 1 ${p(a1, r1)} L${p(a1, r0)} A${r0} ${r0} 0 0 0 ${p(a0, r0)} Z`; };
  const W3 = [['n', -150, -30, 'NITRO', '🔥'], ['b', -30, 90, 'BRAKE', '⏪'], ['d', 90, 210, 'DRIFT', '🌀']];
  dial.innerHTML = `<svg viewBox="0 0 200 200">${W3.map(([k, a0, a1, t, ic]) => { const m = (a0 + a1) / 2, tx = 100 + Math.cos(m * D2R) * 64, ty = 100 + Math.sin(m * D2R) * 64;
    return `<path class="w w-${k}" d="${seg(a0 + 2, a1 - 2, 33, 97)}"/><text x="${tx}" y="${ty - 6}" class="ic">${ic}</text><text x="${tx}" y="${ty + 15}">${k === 'b' ? 'BRAKE/REV' : t}</text>`; }).join('')}
    <circle cx="100" cy="100" r="29" class="hub"/><text x="100" y="98" class="hubt">AUTO</text><text x="100" y="112" class="hubt">GAS</text></svg>`;
  const dialTouch = (e) => { e.preventDefault(); const r = dial.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, R = r.width / 2; const on = { n: 0, b: 0, d: 0 };
    for (const t of e.targetTouches) { const dx = t.clientX - cx, dy = t.clientY - cy; if (Math.hypot(dx, dy) < R * 0.3) continue; let a = Math.atan2(dy, dx) / D2R; if (a < -150) a += 360;
      on[a < -30 ? 'n' : a < 90 ? 'b' : 'd'] = 1; }
    for (const k of ['n', 'b', 'd']) { touch[k] = on[k]; dial.querySelector('.w-' + k).classList.toggle('on', !!on[k]); } };
  for (const ev of ['touchstart', 'touchmove', 'touchend', 'touchcancel']) dial.addEventListener(ev, dialTouch, { passive: false });
  $('wheel').addEventListener('touchstart', (e) => { e.preventDefault(); recentre(); toast('Steering centred'); }, { passive: false });
  // iOS only lets a page read the gyro after a tap, so ask on the first one
  // some browsers (iOS Safari, newer Chrome) only hand out the gyro after a tap, so keep asking on taps until it's granted
  document.addEventListener('click', () => { if (touch.tilt) enableTilt(); }, true); document.addEventListener('touchend', () => { if (touch.tilt) enableTilt(); }, true);
  if (touch.tilt && typeof (window.DeviceOrientationEvent || {}).requestPermission !== 'function') enableTilt();
  const tb = $('tiltBtn'); if (tb) { tb.style.display = ''; tb.onclick = () => { touch.tilt = !touch.tilt; store.set('ccr_tilt', touch.tilt); if (touch.tilt) enableTilt(); syncTouchUI(); }; }
  syncTouchUI();
}
let wheelDeg = 0;
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
    if (mode !== 'split' && touch.on) { if (touch.b) thr = -1; else if (thr === 0) thr = 1;
      if (touch.tilt && touch.tiltOk) { let d = touch.raw - touch.zero; d = Math.abs(d) < 1.5 ? 0 : d - Math.sign(d) * 1.5; touch.steer = clamp(d / 20, -1, 1); steer = touch.steer;
        const wd = Math.round(-touch.steer * 90); if (wd !== wheelDeg) { wheelDeg = wd; $('wheel').style.transform = `rotate(${wd}deg)`; } }
      else if (touch.l || touch.r) steer = touch.l - touch.r;
      hand = hand || !!touch.d; nit = nit || !!touch.n; }
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
function renderPickers() {
  $('trackSeg').innerHTML = TRACK_IDS.map(id => { const T = THEMES[id]; return `<button class="${id === trackId ? 'on' : ''}" data-t="${id}"><i>${T.icon}</i><b>${T.name}</b><small>${T.sub}</small></button>`; }).join('');
  document.querySelectorAll('#todSeg button').forEach(b => b.classList.toggle('on', (b.dataset.n === '1') === isNight));
}
function setTrack(id, quiet) {
  if (!TRACK_IDS.includes(id) || id === trackId) return;
  trackId = id; if (!quiet) store.set('ccr_track', id);
  buildWorld(id); if (music) music.setTheme(id); drawMini(); resetRace(); views.forEach(v => v.snap = true);
  renderPickers(); if (screen === 'scrBoard') renderBoard(); if (screen === 'scrOnline') renderLobby();
}
function setTimeOfDay(n, quiet) { if (n === isNight) return; isNight = n; if (!quiet) store.set('ccr_night', n); setNight(n); renderPickers(); if (screen === 'scrOnline') renderLobby(); }
musicOn = store.get('ccr_music', true);
syncMusic(); $('musicBtn').onclick = toggleMusic; $('qualBtn').onclick = cycleQuality; $('musicHud').onclick = (e) => { e.stopPropagation(); toggleMusic(); };
// browsers only allow audio after a user gesture: start menu music on the first tap/key
// Phones only let audio start inside a real tap (touchend / click, not pointerdown), so keep trying on every
// gesture until the context is running, and re-arm if the OS suspends it (calls, backgrounding, lock screen).
// iPhones also mute Web Audio when the silent switch is on unless the page claims a 'playback' audio session:
// navigator.audioSession does that on iOS 17+, and a looping silent <audio> element does it on older versions.
let silentEl = null;
function silentWav() { const n = 4410, b = new ArrayBuffer(44 + n * 2), v = new DataView(b), w = (o, str) => { for (let i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, 44100, true); v.setUint32(28, 88200, true);
  v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true); return URL.createObjectURL(new Blob([b], { type: 'audio/wav' })); }
const GESTURES = ['touchend', 'click', 'keydown', 'pointerup'];
function unlockAudio() {
  initAudio(); if (!AC) return;
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
  if (!navigator.audioSession && !silentEl && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 0) {
    silentEl = document.createElement('audio'); silentEl.src = silentWav(); silentEl.loop = true; silentEl.setAttribute('playsinline', ''); silentEl.volume = 0.01; }
  if (silentEl && silentEl.paused) silentEl.play().catch(() => {});
  const s = AC.createBufferSource(); s.buffer = AC.createBuffer(1, 1, 22050); s.connect(AC.destination); s.start(0);   // iOS needs a sound started in the gesture
  if (AC.state !== 'running') AC.resume().then(syncMusic, () => {});
  syncMusic();
  if (AC.state === 'running') armUnlock(false);
}
function armUnlock(on) { for (const ev of GESTURES) (on ? addEventListener : removeEventListener)(ev, unlockAudio, true); }
armUnlock(true);
addEventListener('pointerdown', () => initAudio(), { capture: true, once: true });   // create early; desktop browsers unlock here
document.addEventListener('visibilitychange', () => { if (!AC || document.hidden) return; if (AC.state !== 'running') { AC.resume().then(syncMusic, () => {}); armUnlock(true); } });
const watchAC = setInterval(() => { if (AC) { clearInterval(watchAC); AC.addEventListener('statechange', () => { if (AC.state !== 'running') armUnlock(true); else syncMusic(); }); } }, 500);
$('trackSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-t]'); if (b) { initAudio(); setTrack(b.dataset.t); } });
document.querySelectorAll('#todSeg button').forEach(b => b.onclick = () => setTimeOfDay(b.dataset.n === '1'));
function refreshMain() { renderPickers(); if (!me) return; $('nickLbl').textContent = me.nick; $('walletLbl').textContent = me.coins; $('statsLbl').textContent = `${me.wins} wins · ${me.races} races`; }
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
  $('boardTrack').textContent = THEMES[trackId].icon + ' ' + THEMES[trackId].name;
  $('boardBody').innerHTML = list.length ? list.slice(0, 100).map((e, i) => `<tr class="${me && e.nick.toLowerCase() === me.nick.toLowerCase() ? 'me' : ''}">
    <td class="rk">${i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</td><td><i class="dot" style="background:${hex(e.paint)}"></i>${esc(e.nick)}${on.has(e.nick.toLowerCase()) ? ' <em class="live">online</em>' : ''}${e.body ? ' <em>sports</em>' : ''}</td>
    <td>${e.wins}</td><td>${e.races}</td><td>${fmt(bestOn(e, trackId)[0])}</td><td>${fmt(bestOn(e, trackId)[1])}</td><td class="gold">● ${e.earned}</td></tr>`).join('')
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
  if (!guest) rh += `<p class="hint">You host on <b>${THEMES[trackId].icon} ${THEMES[trackId].name}</b> · ${isNight ? '🌙 night' : '☀️ day'} — change both on the main menu.</p>`;
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
  net.startRoom({ t: 'start', slots, track: trackId, night: isNight }); beginOnline(slots, true);
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
    start: (d) => { setTrack(d.track, true); setTimeOfDay(!!d.night, true); beginOnline(d.slots, false); },
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
let drawn = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const cap = state === 'menu' ? QUAL().menuFps : QUAL().fps;
  if (cap && now - drawn < 1000 / cap - 2) return;   // skip vsyncs above the cap (120 Hz screens)
  drawn = now;
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
    for (const L of locals) { const c = L.car, i = c.idx, along = c.vx * Math.sin(HD[i]) + c.vz * Math.cos(HD[i]); c.wrongT = along < -4 && !c.sc ? c.wrongT + dt : 0; }
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
  worldTick(dt, time); updateHeadlights();
  updateHUD(dt); updateAudio();
  // render every viewport with its own camera, shadows centred on its car
  const n = nViews(), H = innerHeight, pr = renderer.getPixelRatio();
  renderer.setScissorTest(n > 1);
  for (let i = 0; i < n; i++) {
    const v = views[i], r = v.rect, P = v.car || cars[5]; updateCam(v, dt);
    const yGL = H - r.y - r.h; renderer.setViewport(r.x, yGL, r.w, r.h); renderer.setScissor(r.x, yGL, r.w, r.h);
    pMat.uniforms.uScale.value = r.h * pr * 0.9; sky.position.copy(v.cam.position);
    sun.target.position.set(Math.round(P.x / 4) * 4, P.y, Math.round(P.z / 4) * 4); sun.position.copy(sun.target.position).addScaledVector(SUN, 190);
    followWeather(v.cam, r.h * pr * 0.9); aimHeadlight(i, v.car);
    v.composer.render(dt);
  }
}

// ───────────────────────── boot ─────────────────────────
{
  const saved = store.get('ccr_nick', '');
  const legacy = +(() => { try { return localStorage.getItem('ccr_best'); } catch (e) { return 0; } })() || 0;
  if (saved && NICK_RE.test(saved)) { setNick(saved); showScreen('scrMain'); }
  else { me = newProfile('Racer'); if (legacy && !me.best) me.best = legacy; setupSolo(); showScreen('scrNick'); }
  resetRace(); applyQuality();
}
window.__game = { SCDBG, get SC() { return SC; }, get N() { return N; }, get SP() { return SP; }, get track() { return trackId; }, setTrack, setTimeOfDay, placeCar, cars, views, get locals() { return locals; }, get state() { return state; }, get mode() { return mode; }, get raceT() { return raceT; }, startRace, setupSplit, getProfile, get me() { return me; }, net, renderer, profiles, board, ASSETS, setLook, createMusic, get AC() { return AC; } };
requestAnimationFrame(frame);

// Blender assets stream in after the first frame; once ready, rebuild the world and the buggies with them.
if (!/[?&]noassets=1/.test(location.search)) loadAssets().then(() => {
  buildWorld(trackId); drawMini(); views.forEach(v => v.snap = true);
  if (state === 'menu') resetRace();
  for (const c of cars) if (c.model && c.look) { c.lookKey = ''; setLook(c, c.look); }
}).catch((e) => console.warn('Blender assets unavailable, using built-in models', e));
