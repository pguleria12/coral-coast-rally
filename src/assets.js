// Loads the Blender-made assets (see blender/*.py): buggy bodies + wheels, trackside props and
// tileable ground/road textures. Everything is optional: until (or unless) loading succeeds the game
// keeps using its procedural models, so a slow or failed download never blocks play.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export const ASSETS = { ready: false, cars: {}, props: {}, tex: {}, nrm: {}, wear: {} };
const BASE = 'assets/';

// Blender stored the hand-picked sRGB colours as-is; convert so three's linear pipeline shows them as authored.
function srgbToLinear(geo) {
  const c = geo.attributes.color; if (!c) return;
  for (let i = 0; i < c.count; i++) for (let k = 0; k < c.itemSize && k < 3; k++) { const v = c.getComponent(i, k); c.setComponent(i, k, v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); }
  c.needsUpdate = true;
}

function loadGLB(loader, url) { return new Promise((res, rej) => loader.load(url, res, undefined, rej)); }
function loadTex(url, srgb) {
  return new Promise((res, rej) => new THREE.TextureLoader().load(url, (t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; res(t);
  }, undefined, rej));
}

export async function loadAssets() {
  const draco = new DRACOLoader(); draco.setDecoderPath(BASE + 'draco/'); draco.setDecoderConfig({ type: 'wasm' });
  const loader = new GLTFLoader(); loader.setDRACOLoader(draco);
  const surf = ['sand', 'cracked', 'grass', 'snow', 'gravel'];
  const WEAR = ['buggy_classic', 'buggy_sports', 'wheel_std', 'wheel_big'];
  const wearTex = Promise.all(WEAR.map(n => loadTex(BASE + `wear_${n}.jpg`, false).then(t => { t.flipY = false; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.userData.keep = true; ASSETS.wear[n] = t; })));
  const [cars, props, gate, ...tex] = await Promise.all([
    loadGLB(loader, BASE + 'cars.glb'), loadGLB(loader, BASE + 'props.glb'), loadGLB(loader, BASE + 'gate.glb'),
    ...surf.map(s => loadTex(BASE + `tex_${s}.jpg`, false)), ...surf.map(s => loadTex(BASE + `nrm_${s}.jpg`, false)),
  ]);
  await wearTex; draco.dispose();
  cars.scene.updateMatrixWorld(true);
  for (const name of ['buggy_classic', 'buggy_sports', 'wheel_std', 'wheel_big', 'rocket']) {
    const o = cars.scene.getObjectByName(name); if (!o) throw new Error('missing ' + name);
    o.position.set(0, 0, 0); o.rotation.set(0, 0, 0); o.scale.set(1, 1, 1);
    o.traverse(m => { if (m.isMesh) { m.userData.sharedGeo = true; m.castShadow = true; } });
    ASSETS.cars[name] = o;
  }
  {
    const g = gate.scene.getObjectByName('finish_gate'); if (!g) throw new Error('missing finish_gate');
    g.position.set(0, 0, 0); g.rotation.set(0, 0, 0); g.scale.set(1, 1, 1);
    // the world rebuilds per track and disposes what it built; these are shared, so mark them kept
    g.traverse(m => { if (m.isMesh) { m.geometry.userData.keep = true; m.material.userData.keep = true; m.castShadow = true; } });
    ASSETS.gate = g;
  }
  props.scene.updateMatrixWorld(true);
  props.scene.traverse(o => {
    if (!o.isMesh) return;
    const g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld);
    // only the fully coloured props; the grey ones are tint multipliers and stay as baked
    if (['palm', 'pine', 'tree_trunk'].includes(o.name)) srgbToLinear(g);
    g.deleteAttribute('uv'); g.computeBoundingSphere(); g.userData.keep = true;
    ASSETS.props[o.name] = g;
  });
  surf.forEach((s, i) => { ASSETS.tex[s] = tex[i]; ASSETS.nrm[s] = tex[i + surf.length]; tex[i].userData.keep = tex[i + surf.length].userData.keep = true; });
  ASSETS.ready = true;
  return ASSETS;
}
