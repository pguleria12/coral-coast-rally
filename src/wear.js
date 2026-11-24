// Worn-in look for the Blender buggies: a packed wear map baked in Blender (blender/common.py bake_wear)
// is blended over each car's own materials in the shader, so every livery keeps its colours.
//   R = grime / ambient occlusion (multiplies the colour)
//   G = chipped edges and scratches (bare metal shows through)
//   B = caked mud on the lower body and tyre tread (colour follows the track)
// The same patch draws crash damage: up to 8 impact points in the body's local space scorch, scratch and
// crumple the surface around them until the car is reset.
import * as THREE from 'three';

export const MAX_DMG = 8;
export const WEAR_GLOBAL = { mudCol: { value: new THREE.Color(0x6b5136) } };

// per-car uniforms shared by all of that car's materials
export function wearUniforms(amt) {
  return { wearAmt: { value: amt }, dmg: { value: Array.from({ length: MAX_DMG }, () => new THREE.Vector4(0, -99, 0, 0)) }, dmgN: 0 };
}
export function clearDamage(U) { for (const v of U.dmg.value) v.set(0, -99, 0, 0); U.dmgN = 0; }
export function addDamage(U, local, strength) {
  // merge with a nearby dent if there is one, else take the next slot (oldest overwritten)
  for (const v of U.dmg.value) if (v.w > 0 && Math.hypot(v.x - local.x, v.y - local.y, v.z - local.z) < 0.5) { v.w = Math.min(1, v.w + strength * 0.6); return; }
  U.dmg.value[U.dmgN % MAX_DMG].set(local.x, local.y, local.z, Math.min(1, strength)); U.dmgN++;
}

const HEAD = /* glsl */`
uniform sampler2D wearMap; uniform float wearAmt;
#ifdef WEAR_DECAL
uniform sampler2D decalSide, decalHood; uniform vec4 sideBox, hoodBox;
#endif
varying vec3 vWearNrm; uniform float wearScr; uniform vec3 mudCol; uniform vec4 dmg[${MAX_DMG}];
varying vec3 vWearPos;
float wHash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float wNoise(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(wHash(i), wHash(i + vec3(1,0,0)), f.x), mix(wHash(i + vec3(0,1,0)), wHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(wHash(i + vec3(0,0,1)), wHash(i + vec3(1,0,1)), f.x), mix(wHash(i + vec3(0,1,1)), wHash(i + vec3(1,1,1)), f.x), f.y), f.z); }
`;

/** Patch a material in place. tex = baked wear map; U = per-car uniforms; scr = how much scratches show bare metal.
 *  decal (optional) = { side, hood: textures, sideBox: (z0, z1, y0, y1), hoodBox: (x0, x1, z0, z1) } projects the
 *  livery onto the body's side panels and bonnet in local space; wear and mud are laid over it. */
export function makeWorn(m, tex, U, scr = 1, decal = null) {
  m.defines = Object.assign(m.defines || {}, { USE_UV: '' }, decal ? { WEAR_DECAL: '' } : {});
  m.userData.worn = true;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.wearMap = { value: tex }; sh.uniforms.wearAmt = U.wearAmt; sh.uniforms.wearScr = { value: scr };
    sh.uniforms.mudCol = WEAR_GLOBAL.mudCol; sh.uniforms.dmg = U.dmg;
    if (decal) { sh.uniforms.decalSide = { value: decal.side }; sh.uniforms.decalHood = { value: decal.hood }; sh.uniforms.sideBox = { value: decal.sideBox }; sh.uniforms.hoodBox = { value: decal.hoodBox }; }
    sh.vertexShader = 'varying vec3 vWearPos; varying vec3 vWearNrm;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vWearPos = position; vWearNrm = normal;');
    sh.fragmentShader = HEAD + sh.fragmentShader
      .replace('#include <map_fragment>', `#include <map_fragment>
        vec3 wr = texture2D(wearMap, vUv).rgb;
        float dm = 0.0;
        for (int i = 0; i < ${MAX_DMG}; i++) { float d = length(vWearPos - dmg[i].xyz) + (wNoise(vWearPos * 7.0) - 0.5) * 0.45; dm = max(dm, dmg[i].w * (1.0 - smoothstep(0.12, 0.8, d))); }
        float mudK = clamp(wr.b * (0.3 + wearAmt) * 1.7, 0.0, 1.0);
        float scrK = clamp(wr.g * (0.3 + wearAmt) * 2.0 + dm * smoothstep(0.42, 0.6, wNoise(vWearPos * vec3(30.0, 30.0, 4.0))), 0.0, 1.0) * wearScr;
        diffuseColor.rgb *= mix(1.0, wr.r * wr.r, min(1.0, 0.45 + wearAmt));
        #ifdef WEAR_DECAL
        { vec3 an = normalize(vWearNrm);
          if (abs(an.x) > 0.5) {   // side panels: read front-to-back on the right, back-to-front on the left, so text reads normally
            float L = sideBox.y - sideBox.x, u = an.x > 0.0 ? (sideBox.y - vWearPos.z) / L : (vWearPos.z - sideBox.x) / L, v = (vWearPos.y - sideBox.z) / (sideBox.w - sideBox.z);
            if (u > 0.0 && u < 1.0 && v > 0.0 && v < 1.0) { vec4 dc = texture2D(decalSide, vec2(u, v)); diffuseColor.rgb = mix(diffuseColor.rgb, dc.rgb, dc.a); } }
          if (an.y > 0.55) {       // bonnet number, upright for the chase camera
            vec2 q = vec2((hoodBox.y - vWearPos.x) / (hoodBox.y - hoodBox.x), (vWearPos.z - hoodBox.z) / (hoodBox.w - hoodBox.z));
            if (q.x > 0.0 && q.x < 1.0 && q.y > 0.0 && q.y < 1.0) { vec4 dc = texture2D(decalHood, q); diffuseColor.rgb = mix(diffuseColor.rgb, dc.rgb, dc.a); } } }
        #endif
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.5, 0.51, 0.53), scrK);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.035, 0.03, 0.028), dm * 0.6 * smoothstep(0.3, 0.7, wNoise(vWearPos * 3.0 + 4.0)));
        diffuseColor.rgb = mix(diffuseColor.rgb, mudCol * (0.75 + 0.5 * wNoise(vWearPos * 11.0)), mudK);`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.4, scrK * 0.6); roughnessFactor = mix(roughnessFactor, 0.95, max(mudK, dm * 0.5));`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>
        metalnessFactor = mix(metalnessFactor, 0.9, scrK); metalnessFactor *= 1.0 - mudK;`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        if (dm > 0.01) normal = normalize(normal + dm * 0.55 * vec3(wNoise(vWearPos * 6.0) - 0.5, wNoise(vWearPos * 6.0 + 9.0) - 0.5, 0.0));`)
      .replace('#include <lights_physical_fragment>', `#include <lights_physical_fragment>
        #ifdef USE_CLEARCOAT
          material.clearcoat *= 1.0 - max(mudK, max(scrK, dm));
        #endif`);
  };
  m.customProgramCacheKey = () => 'worn' + (m.isMeshPhysicalMaterial ? 'P' : 'S') + (decal ? 'D' : '');
  m.needsUpdate = true;
  return m;
}
