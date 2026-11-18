// Coral Coast Rally — procedural instrumental music, one original tune per track, synthesised live with Web Audio.
// A small step sequencer schedules a little ahead of the audio clock; each track has its own key, tempo, groove and lead voice.

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const MAJOR = [0, 2, 4, 5, 7, 9, 11], DORIAN = [0, 2, 3, 5, 7, 9, 10], PHRYG_DOM = [0, 1, 4, 5, 7, 8, 10];

// step patterns are 16 sixteenth-notes per bar; prog = chord root as scale degree per bar
const SONGS = {
  beach: { // breezy island groove: steel-drum lead, off-beat skank, shaker
    bpm: 116, root: 60, scale: MAJOR, prog: [0, 5, 3, 4], seed: 7, lead: 'steel', leadOct: 12, rhythm: [0, 3, 6, 8, 10, 11, 14],
    bass: [[0, 0], [3, 0], [6, 4], [8, 0], [11, 0], [14, 4]], comp: { steps: [2, 6, 10, 14], voice: 'skank' },
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14], shaker: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }, swing: 0.08,
  },
  desert: { // desert caravan: plucked oud lead, drone, darbuka dum/tek
    bpm: 98, root: 52, scale: PHRYG_DOM, prog: [0, 0, 6, 1], seed: 21, lead: 'oud', leadOct: 12, rhythm: [0, 2, 3, 6, 8, 9, 10, 12, 14],
    bass: [[0, 0], [6, 0], [8, 4], [12, 0]], comp: { steps: [0], voice: 'drone' },
    drums: { dum: [0, 8], tek: [3, 6, 10, 12, 14], tik: [1, 5, 9, 13, 15] }, swing: 0,
  },
  country: { // rolling hills hoedown: banjo rolls, oom-pah bass, brushes
    bpm: 124, root: 55, scale: MAJOR, prog: [0, 3, 0, 4], seed: 33, lead: 'fiddle', leadOct: 12, rhythm: [0, 2, 4, 6, 8, 10, 12, 14],
    bass: [[0, 0], [4, 4], [8, 0], [12, 4]], comp: { steps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], voice: 'banjo' },
    drums: { kick: [0, 8], brush: [4, 12], hat: [2, 6, 10, 14] }, swing: 0.12,
  },
  snow: { // frosty glide: celesta bells over a soft pad
    bpm: 88, root: 62, scale: DORIAN, prog: [0, 6, 3, 0], seed: 47, lead: 'bell', leadOct: 12, rhythm: [0, 4, 6, 10, 12],
    bass: [[0, 0], [10, 4]], comp: { steps: [0], voice: 'pad' },
    drums: { kick: [0, 10], hat: [4, 12], shaker: [2, 6, 10, 14] }, swing: 0.05,
  },
};

export function createMusic(AC, dest) {
  const out = AC.createGain(); out.gain.value = 0; out.connect(dest);
  // light stereo-ish space: feedback delay
  const dly = AC.createDelay(1), fb = AC.createGain(), wet = AC.createGain(); dly.delayTime.value = 0.28; fb.gain.value = 0.28; wet.gain.value = 0.22;
  const bus = AC.createGain(); bus.connect(out); bus.connect(dly); dly.connect(fb); fb.connect(dly); dly.connect(wet); wet.connect(out);
  const noise = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }

  const env = (g, t, a, peak, dec, sus = 0.0001, hold = 0) => { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setTargetAtTime(sus, t + a + hold, dec / 3); };
  const osc = (type, f, t, stop) => { const o = AC.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); o.start(t); o.stop(stop); return o; };
  const lp = (f, q = 0.7) => { const b = AC.createBiquadFilter(); b.type = 'lowpass'; b.frequency.value = f; b.Q.value = q; return b; };
  const V = {
    steel(f, t, v) { const g = AC.createGain(); env(g, t, 0.005, v * 0.5, 0.55); g.connect(bus);
      osc('sine', f, t, t + 0.8).connect(g); const g2 = AC.createGain(); g2.gain.value = 0.35; osc('sine', f * 2.01, t, t + 0.5).connect(g2); g2.connect(g);
      const g3 = AC.createGain(); g3.gain.value = 0.12; osc('triangle', f * 3.98, t, t + 0.25).connect(g3); g3.connect(g); },
    oud(f, t, v) { const g = AC.createGain(), fl = lp(f * 5, 2); env(g, t, 0.004, v * 0.55, 0.45); fl.frequency.setValueAtTime(f * 7, t); fl.frequency.exponentialRampToValueAtTime(f * 1.6, t + 0.35);
      osc('sawtooth', f, t, t + 0.7).connect(fl); osc('square', f * 1.003, t, t + 0.7).connect(fl); fl.connect(g); g.connect(bus); },
    fiddle(f, t, v, dur) { const g = AC.createGain(), fl = lp(2400, 1.5); env(g, t, 0.04, v * 0.32, Math.min(0.5, dur), 0.0001, dur * 0.6); g.connect(bus); fl.connect(g);
      const o = osc('sawtooth', f, t, t + dur + 0.4); const vib = osc('sine', 5.5, t, t + dur + 0.4), vg = AC.createGain(); vg.gain.value = f * 0.006; vib.connect(vg); vg.connect(o.frequency); o.connect(fl); },
    bell(f, t, v) { const g = AC.createGain(); env(g, t, 0.003, v * 0.45, 1.6); g.connect(bus);
      const c = osc('sine', f, t, t + 2.2), m = osc('sine', f * 3.5, t, t + 2.2), mg = AC.createGain(); mg.gain.setValueAtTime(f * 1.8, t); mg.gain.exponentialRampToValueAtTime(f * 0.05, t + 1.2); m.connect(mg); mg.connect(c.frequency); c.connect(g); },
    skank(fs, t, v) { for (const f of fs) { const g = AC.createGain(), fl = lp(2600); env(g, t, 0.003, v * 0.14, 0.12); osc('square', f, t, t + 0.25).connect(fl); fl.connect(g); g.connect(bus); } },
    banjo(fs, t, v, step) { const f = fs[[0, 1, 2, 1, 0, 2, 1, 2][step % 8]] * 2, g = AC.createGain(), fl = lp(3200); env(g, t, 0.002, v * 0.16, 0.18); osc('square', f, t, t + 0.3).connect(fl); fl.connect(g); g.connect(bus); },
    drone(fs, t, v, _s, bar) { const g = AC.createGain(), fl = lp(700); env(g, t, 0.6, v * 0.11, 1.2, v * 0.08, bar * 0.6); g.gain.setTargetAtTime(0.0001, t + bar * 0.95, 0.15);
      for (const [f, ty] of [[fs[0] / 2, 'sawtooth'], [fs[0] * 0.75, 'sawtooth'], [fs[0] / 2 * 1.005, 'triangle']]) osc(ty, f, t, t + bar + 0.6).connect(fl); fl.connect(g); g.connect(bus); },
    pad(fs, t, v, _s, bar) { const g = AC.createGain(), fl = lp(1100); env(g, t, 0.9, v * 0.09, 1.5, v * 0.07, bar * 0.5); g.gain.setTargetAtTime(0.0001, t + bar * 0.9, 0.3);
      for (const f of fs) for (const dt of [-4, 4]) { const o = osc('sawtooth', f, t, t + bar + 1); o.detune.value = dt; o.connect(fl); } fl.connect(g); g.connect(bus); },
    bass(f, t, v, type = 'triangle') { const g = AC.createGain(), fl = lp(420, 1.2); env(g, t, 0.006, v * 0.5, 0.32); osc(type, f, t, t + 0.45).connect(fl); osc('sine', f, t, t + 0.45).connect(g); fl.connect(g); g.connect(out); },
    kick(t, v) { const g = AC.createGain(), o = osc('sine', 130, t, t + 0.35); o.frequency.exponentialRampToValueAtTime(42, t + 0.18); env(g, t, 0.002, v * 0.7, 0.22); o.connect(g); g.connect(out); },
    hit(t, v, f, q, dec, type = 'bandpass') { const s = AC.createBufferSource(), b = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = noise; b.type = type; b.frequency.value = f; b.Q.value = q;
      env(g, t, 0.001, v, dec); s.connect(b); b.connect(g); g.connect(out); s.start(t, Math.random() * 0.5); s.stop(t + dec + 0.1); },
    tom(t, v, f0, f1, dec) { const g = AC.createGain(), o = osc('sine', f0, t, t + dec + 0.1); o.frequency.exponentialRampToValueAtTime(f1, t + dec); env(g, t, 0.002, v, dec); o.connect(g); g.connect(out); },
  };
  const DR = {
    kick: (t) => V.kick(t, 0.9), snare: (t) => { V.hit(t, 0.32, 1800, 0.8, 0.14); V.tom(t, 0.15, 220, 180, 0.08); }, hat: (t) => V.hit(t, 0.08, 9000, 1, 0.04, 'highpass'),
    shaker: (t, k) => V.hit(t, k % 2 ? 0.035 : 0.06, 6000, 1.2, 0.05, 'highpass'), brush: (t) => V.hit(t, 0.16, 3000, 0.5, 0.2),
    dum: (t) => V.tom(t, 0.65, 150, 75, 0.3), tek: (t) => { V.hit(t, 0.22, 3500, 2, 0.06); V.tom(t, 0.12, 520, 430, 0.05); }, tik: (t) => V.hit(t, 0.07, 5200, 3, 0.03),
  };

  // compose an 8-bar melody per song (A phrase + varied B phrase), deterministic per track
  function compose(S) {
    const r = rng(S.seed * 101), bars = [];
    let deg = 4;
    for (let b = 0; b < 8; b++) {
      const chord = S.prog[b % S.prog.length], notes = [];
      for (const st of S.rhythm) { if (st && r() < (b % 4 === 3 ? 0.45 : 0.22)) continue;
        const strong = st % 4 === 0; let target = deg + Math.round((r() - 0.5) * 4);
        if (strong) { const tones = [chord, chord + 2, chord + 4, chord + 7]; target = tones.reduce((a, c) => Math.abs(c - deg) < Math.abs(a - deg) ? c : a, tones[0]) + (r() < 0.3 ? 2 : 0); }
        deg = Math.max(0, Math.min(11, target)); notes.push([st, deg]); }
      bars.push(notes);
    }
    for (let b = 4; b < 8; b++) if (b !== 7) bars[b] = bars[b - 4].map(([s, d]) => [s, r() < 0.3 ? d + (r() < 0.5 ? 1 : -1) : d]); // B echoes A with variations
    bars[7].push([14, S.prog[0] + 7]);
    return bars;
  }
  const noteOf = (S, deg, oct = 0) => { const n = S.scale.length, o = Math.floor(deg / n); return S.root + S.scale[((deg % n) + n) % n] + 12 * (o + oct); };
  const chordOf = (S, d) => [d, d + 2, d + 4].map(x => mtof(noteOf(S, x)));

  let S = null, mel = null, step = 0, next = 0, on = false, level = 0, timer = 0;
  function schedule(st, t) {
    const bar = Math.floor(st / 16) % 8, s = st % 16, chord = S.prog[bar % S.prog.length], sp = 60 / S.bpm / 4, barDur = sp * 16;
    const tt = t + (s % 2 ? S.swing * sp * 2 : 0);
    const full = level > 0.85; // menus play a lighter arrangement
    for (const [ms, d] of mel[bar]) if (ms === s) { const nxt = mel[bar].find(([x]) => x > s), dur = ((nxt ? nxt[0] : 16) - s) * sp; V[S.lead](mtof(noteOf(S, d, S.leadOct / 12)), tt, 0.9, dur); }
    if (S.comp.steps.includes(s)) V[S.comp.voice](chordOf(S, chord), tt, 1, s, barDur);
    for (const [bs, iv] of S.bass) if (bs === s) V.bass(mtof(noteOf(S, chord + iv, -1)) , tt, 1, S.lead === 'oud' ? 'sawtooth' : 'triangle');
    for (const k in S.drums) if (S.drums[k].includes(s) && (full || k === 'shaker' || k === 'hat' || k === 'tik')) DR[k](tt, s);
  }
  function pump() {
    if (!S || !on) return;
    const ahead = AC.currentTime + 0.15, sp = 60 / S.bpm / 4;
    if (next < AC.currentTime - 0.2) next = AC.currentTime + 0.05; // after a stall, don't machine-gun the backlog
    while (next < ahead) { schedule(step, next); next += sp; step = (step + 1) % 128; }
  }
  function setTheme(id) { const ns = SONGS[id] || SONGS.beach; if (ns === S) return; S = ns; mel = compose(S); step = 0; next = AC.currentTime + 0.1; }
  function setOn(v) { on = !!v; if (on && !timer) timer = setInterval(pump, 25); if (!on && timer) { clearInterval(timer); timer = 0; } out.gain.setTargetAtTime(on ? level * 0.42 : 0, AC.currentTime, 0.2); if (on) next = AC.currentTime + 0.1; }
  function setLevel(l) { if (Math.abs(l - level) < 0.01) return; level = l; out.gain.setTargetAtTime(on ? level * 0.42 : 0, AC.currentTime, 0.4); }
  return { setTheme, setOn, setLevel };
}
