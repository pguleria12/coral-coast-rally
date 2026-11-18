// Coral Coast Rally: procedural instrumental music, one original tune per track, synthesised live with Web Audio.
// Each song loops 16 bars as verse (8 bars, filter opening, ending in a riser and snare roll) then drop (8 bars:
// full chords, lead hook, crash). Chords, bass and arp sit on a bus that ducks on every kick (sidechain pump),
// and everything shares a generated reverb plus a tempo-synced delay.
// Menus get a light arrangement: filtered chords, arp and soft percussion, no kick or build.

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const MAJOR = [0, 2, 4, 5, 7, 9, 11], DORIAN = [0, 2, 3, 5, 7, 9, 10], PHRYG_DOM = [0, 1, 4, 5, 7, 8, 10];
const ALL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], EVEN = [0, 2, 4, 6, 8, 10, 12, 14], OFF = [2, 6, 10, 14];

// prog: chord root as scale degree per bar. motif: [step, length] over two bars (32 sixteenths).
// bass: [step, octave shift, length in steps]. drums: drop kit; verse: kit before the drop.
const SONGS = {
  beach: { // tropical house: breathy flute hook, marimba arp, pumping chords
    bpm: 112, root: 60, scale: MAJOR, prog: [5, 3, 0, 4], seed: 7, lead: 'flute', arp: 'marimba', arpRate: 1, cut: [600, 4200], swing: 0.05,
    motif: [[0, 3], [3, 3], [6, 2], [8, 2], [10, 4], [16, 3], [19, 3], [22, 2], [24, 6]],
    bass: [[0, 0, 2], [3, 0, 2], [6, 12, 1], [8, 0, 2], [11, 0, 2], [14, 12, 1]],
    drums: { kick: [0, 4, 8, 12], clap: [4, 12], ohat: OFF, shaker: ALL }, verse: { kick: [0, 4, 8, 12], hat: OFF, shaker: ALL },
  },
  desert: { // desert synthwave: tremolo-picked oud lead, darbuka, drone
    bpm: 100, root: 52, scale: PHRYG_DOM, prog: [0, 1, 0, 6], seed: 21, lead: 'oud', arp: 'pluck', arpRate: 2, cut: [450, 2400], swing: 0, drone: true,
    motif: [[0, 2], [2, 1], [3, 3], [6, 2], [8, 6], [16, 2], [18, 2], [20, 2], [22, 2], [24, 8]],
    bass: [[0, 0, 3], [6, 0, 2], [8, 0, 3], [12, 0, 2], [14, 12, 1]],
    drums: { kick: [0, 7, 10], clap: [4, 12], dum: [0, 8], tek: [3, 6, 10, 14], tik: [1, 5, 9, 13, 15] }, verse: { dum: [0, 8], tek: [3, 6, 10, 12, 14], tik: [1, 5, 9, 13, 15] },
  },
  country: { // feel-good country-pop: bright synth lead, banjo-style pluck rolls, stomp-clap
    bpm: 124, root: 55, scale: MAJOR, prog: [0, 4, 5, 3], seed: 33, lead: 'synth', arp: 'pluck', arpRate: 1, cut: [700, 5000], swing: 0.06,
    motif: [[0, 2], [2, 2], [4, 2], [6, 4], [10, 2], [12, 4], [16, 2], [18, 2], [20, 2], [22, 2], [24, 8]],
    bass: [[0, 0, 2], [2, 0, 2], [6, 0, 2], [10, 0, 2], [14, 12, 2]],
    drums: { kick: [0, 4, 8, 12], clap: [4, 12], hat: EVEN, ohat: OFF }, verse: { kick: [0, 8], clap: [4, 12], hat: EVEN },
  },
  snow: { // half-time future bass: wobbling chord stabs, glassy lead, airy hats
    bpm: 86, root: 62, scale: DORIAN, prog: [0, 3, 6, 4], seed: 47, lead: 'glass', arp: 'marimba', arpRate: 1, cut: [500, 3800], swing: 0.03, stabs: [0, 3, 6, 8, 11, 14],
    motif: [[0, 4], [4, 2], [6, 4], [10, 6], [16, 3], [19, 3], [22, 6], [28, 4]],
    bass: [[0, 0, 6], [6, 0, 4], [10, 0, 6]],
    drums: { kick: [0, 10], clap: [8], hat: OFF, shaker: ALL }, verse: { kick: [0, 10], shaker: OFF },
  },
};

function impulse(AC, sec, decay) {
  const n = Math.floor(AC.sampleRate * sec), b = AC.createBuffer(2, n, AC.sampleRate);
  for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); let lp = 0;
    for (let i = 0; i < n; i++) { lp += (Math.random() * 2 - 1 - lp) * (0.25 + 0.6 * (1 - i / n)); d[i] = lp * Math.pow(1 - i / n, decay); } }
  return b;
}

export function createMusic(AC, dest) {
  const out = AC.createGain(); out.gain.value = 0; out.connect(dest);
  const comp = AC.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3.5; comp.attack.value = 0.01; comp.release.value = 0.2; comp.connect(out);
  const mix = AC.createGain(); mix.gain.value = 0.9; mix.connect(comp);
  const duck = AC.createGain(); duck.connect(mix);   // pumped by the kick
  const dry = AC.createGain(); dry.connect(mix);
  const rev = AC.createConvolver(); rev.buffer = impulse(AC, 2.0, 2.4); const revOut = AC.createGain(); revOut.gain.value = 0.5; rev.connect(revOut); revOut.connect(mix);
  const dly = AC.createDelay(2), dfb = AC.createGain(), dlp = AC.createBiquadFilter(), dOut = AC.createGain();
  dfb.gain.value = 0.38; dlp.type = 'lowpass'; dlp.frequency.value = 2800; dOut.gain.value = 0.3;
  dly.connect(dlp); dlp.connect(dfb); dfb.connect(dly); dlp.connect(dOut); dOut.connect(mix); dOut.connect(rev);
  const noise = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }

  // ── building blocks ──
  const env = (g, t, a, peak, dec, sus = 0.0001, hold = 0) => { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setTargetAtTime(sus, t + a + hold, dec / 3); };
  const osc = (type, f, t, stop, det = 0) => { const o = AC.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); o.detune.value = det; o.start(t); o.stop(stop); return o; };
  const filt = (type, f, q = 0.7) => { const b = AC.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; };
  const panned = (node, p) => { const s = AC.createStereoPanner(); s.pan.value = p; node.connect(s); return s; };
  function route(node, bus, r = 0, d = 0) {
    node.connect(bus);
    if (r) { const g = AC.createGain(); g.gain.value = r; node.connect(g); g.connect(rev); }
    if (d) { const g = AC.createGain(); g.gain.value = d; node.connect(g); g.connect(dly); }
  }
  function vibrato(o, f, t, stop, depth = 0.008, rate = 5.2, delay = 0.18) {
    const l = osc('sine', rate, t, stop), g = AC.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(f * depth, t + delay + 0.25); l.connect(g); g.connect(o.frequency);
  }
  let lastLead = 0;

  const V = {
    // leads: f, t, v, dur
    flute(f, t, v, dur) {
      const end = t + dur + 0.5, g = AC.createGain(), lp = filt('lowpass', 3200);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * 0.3, t + 0.04); g.gain.setTargetAtTime(v * 0.22, t + 0.05, 0.1); g.gain.setTargetAtTime(0.0001, t + dur * 0.92, 0.07);
      for (const det of [-6, 6]) { const o = osc('triangle', f, t, end, det); if (lastLead && Math.abs(Math.log2(f / lastLead)) < 0.6) { o.frequency.setValueAtTime(lastLead, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.05); } vibrato(o, f, t, end); o.connect(lp); }
      const h = osc('sine', f * 2, t, end), hg = AC.createGain(); hg.gain.value = 0.12; h.connect(hg); hg.connect(lp);
      const s = AC.createBufferSource(), bp = filt('bandpass', f * 2, 1.5), ng = AC.createGain(); s.buffer = noise; ng.gain.setValueAtTime(0.5, t); ng.gain.setTargetAtTime(0.12, t + 0.03, 0.05);
      s.connect(bp); bp.connect(ng); ng.connect(lp); s.start(t, Math.random() * 0.5); s.stop(end);
      lp.connect(g); route(g, dry, 0.35, 0.25);
    },
    synth(f, t, v, dur) {
      const end = t + dur + 0.4, g = AC.createGain(), lp = filt('lowpass', f * 6, 3);
      lp.frequency.setValueAtTime(f * 9, t); lp.frequency.setTargetAtTime(f * 3.5, t + 0.01, 0.15);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * 0.17, t + 0.01); g.gain.setTargetAtTime(v * 0.13, t + 0.02, 0.12); g.gain.setTargetAtTime(0.0001, t + dur * 0.9, 0.06);
      for (const [ty, det, m] of [['sawtooth', -9, 1], ['sawtooth', 9, 1], ['square', 0, 0.5]]) { const o = osc(ty, f * m, t, end, det);
        if (lastLead && Math.abs(Math.log2(f / lastLead)) < 0.6) { o.frequency.setValueAtTime(lastLead * m, t); o.frequency.exponentialRampToValueAtTime(f * m, t + 0.04); } vibrato(o, f * m, t, end, 0.006); o.connect(lp); }
      lp.connect(g); route(g, dry, 0.3, 0.3);
    },
    oud(f, t, v, dur, sp) { // long notes are tremolo-picked like a real oud
      const n = dur > sp * 2.5 ? Math.round(dur / sp) : 1;
      for (let k = 0; k < n; k++) V.pick(f, t + k * sp, v * (k ? 0.7 : 1), n > 1 ? sp * 1.2 : 0.7, k === 0);
    },
    pick(f, t, v, dec, bend) {
      const g = AC.createGain(), lp = filt('lowpass', f * 8, 5); lp.frequency.setValueAtTime(f * 11, t); lp.frequency.exponentialRampToValueAtTime(f * 1.4, t + 0.3);
      env(g, t, 0.003, v * 0.3, dec);
      for (const [ty, det] of [['sawtooth', -5], ['square', 5]]) { const o = osc(ty, f, t, t + dec + 0.3, det); if (bend) { o.frequency.setValueAtTime(f * 0.975, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.05); } o.connect(lp); }
      lp.connect(g); route(panned(g, (Math.random() - 0.5) * 0.3), dry, 0.4, 0.2);
    },
    glass(f, t, v, dur) {
      const end = t + dur + 1.6, g = AC.createGain(); env(g, t, 0.01, v * 0.26, Math.max(0.8, dur * 1.2));
      const c = osc('sine', f, t, end), m = osc('sine', f * 2, t, end), mg = AC.createGain(); mg.gain.setValueAtTime(f * 0.9, t); mg.gain.exponentialRampToValueAtTime(f * 0.08, t + 0.6); m.connect(mg); mg.connect(c.frequency);
      vibrato(c, f, t, end, 0.005, 4.5, 0.3);
      const pad = osc('triangle', f, t, end, 7), pg = AC.createGain(); pg.gain.setValueAtTime(0, t); pg.gain.linearRampToValueAtTime(0.4, t + 0.12); pad.connect(pg); pg.connect(g); c.connect(g);
      route(g, dry, 0.5, 0.35);
    },
    // arps: f, t, v, pan
    marimba(f, t, v, p) {
      const g = AC.createGain(); env(g, t, 0.002, v * 0.22, 0.4);
      osc('sine', f, t, t + 0.6).connect(g); const h = osc('sine', f * 4, t, t + 0.12), hg = AC.createGain(); env(hg, t, 0.001, 0.35, 0.06); h.connect(hg); hg.connect(g);
      route(panned(g, p), duck, 0.25, 0.3);
    },
    pluck(f, t, v, p) {
      const g = AC.createGain(), lp = filt('lowpass', f * 6, 2); lp.frequency.setValueAtTime(f * 7, t); lp.frequency.exponentialRampToValueAtTime(f * 1.2, t + 0.2);
      env(g, t, 0.002, v * 0.16, 0.26); osc('sawtooth', f, t, t + 0.4, 4).connect(lp); osc('sawtooth', f, t, t + 0.4, -4).connect(lp); lp.connect(g);
      route(panned(g, p), duck, 0.2, 0.3);
    },
    // lush detuned-saw chord. stab = short and percussive (future bass)
    chord(fs, t, dur, cut, v, stab) {
      const g = AC.createGain(), lp = filt('lowpass', cut, 0.9), end = t + dur + 0.6;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + (stab ? 0.006 : 0.03)); if (!stab) g.gain.setValueAtTime(v, t + dur - 0.04); g.gain.setTargetAtTime(0.0001, t + (stab ? 0.02 : dur - 0.04), stab ? dur * 0.45 : 0.1);
      if (stab) { lp.frequency.setValueAtTime(cut * 1.6, t); lp.frequency.exponentialRampToValueAtTime(cut * 0.6, t + dur); }
      fs.forEach((f, i) => { for (const [det, p] of [[-11, -0.7], [11, 0.7]]) { const o = osc('sawtooth', f, t, end, det + (i - 1.5) * 1.5); panned(o, p * (0.6 + i * 0.1)).connect(lp); } });
      lp.connect(g); route(g, duck, 0.35, 0);
    },
    drone(f, t, dur) {
      const g = AC.createGain(), lp = filt('lowpass', 500); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.06, t + 0.5); g.gain.setTargetAtTime(0.0001, t + dur - 0.1, 0.15);
      for (const [m, det] of [[0.5, -6], [0.5, 6], [0.75, 0]]) osc('sawtooth', f * m, t, t + dur + 0.6, det).connect(lp); lp.connect(g); route(g, duck, 0.4);
    },
    bass(f, t, len) {
      const g = AC.createGain(), lp = filt('lowpass', 200, 4); lp.frequency.setValueAtTime(900, t); lp.frequency.setTargetAtTime(220, t + 0.005, 0.07);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.32, t + 0.006); g.gain.setTargetAtTime(0.0001, t + len * 0.85, 0.04);
      osc('sawtooth', f, t, t + len + 0.3).connect(lp); lp.connect(g);
      const sg = AC.createGain(); sg.gain.value = 0.9; osc('sine', f, t, t + len + 0.3).connect(sg); sg.connect(g); g.connect(duck);
    },
    // drums
    kick(t, v = 1) {
      const g = AC.createGain(), o = osc('sine', 165, t, t + 0.45); o.frequency.exponentialRampToValueAtTime(48, t + 0.11);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * 0.95, t + 0.003); g.gain.setTargetAtTime(0.0001, t + 0.06, 0.1); o.connect(g); g.connect(dry);
      V.noise(t, v * 0.2, 'highpass', 3500, 0.7, 0.012, dry);
      duck.gain.setValueAtTime(0.25, t); duck.gain.setTargetAtTime(1, t + 0.02, 0.075);
    },
    noise(t, v, type, f, q, dec, bus, r = 0, start = 0) {
      const s = AC.createBufferSource(), b = filt(type, f, q), g = AC.createGain(); s.buffer = noise;
      env(g, t, 0.001, v, dec); s.connect(b); b.connect(g); route(g, bus, r); s.start(t, start || Math.random() * 0.5); s.stop(t + dec * 1.5 + 0.1);
    },
    clap(t, v = 1) {
      for (const k of [0, 0.011, 0.023]) V.noise(t + k, v * 0.28, 'bandpass', 1400, 1.1, 0.025, dry);
      V.noise(t + 0.03, v * 0.3, 'bandpass', 1300, 0.9, 0.16, dry, 0.35);
    },
    snare(t, v) { V.noise(t, v * 0.32, 'bandpass', 1900, 0.8, 0.12, dry, 0.25); const g = AC.createGain(), o = osc('triangle', 210, t, t + 0.1); env(g, t, 0.001, v * 0.18, 0.06); o.connect(g); g.connect(dry); },
    tom(t, v, f0, f1, dec) { const g = AC.createGain(), o = osc('sine', f0, t, t + dec + 0.1); o.frequency.exponentialRampToValueAtTime(f1, t + dec); env(g, t, 0.002, v, dec); o.connect(g); route(g, dry, 0.15); },
    riser(t, dur) {
      const s = AC.createBufferSource(), b = filt('bandpass', 300, 3), g = AC.createGain(); s.buffer = noise; s.loop = true;
      b.frequency.setValueAtTime(300, t); b.frequency.exponentialRampToValueAtTime(9000, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.16, t + dur); g.gain.setValueAtTime(0.0001, t + dur + 0.01);
      s.connect(b); b.connect(g); route(g, dry, 0.5); s.start(t); s.stop(t + dur + 0.05);
    },
    impact(t) {
      V.noise(t, 0.22, 'highpass', 5000, 0.5, 1.6, dry, 0.6);
      const g = AC.createGain(), o = osc('sine', 70, t, t + 1.2); o.frequency.exponentialRampToValueAtTime(32, t + 0.9); env(g, t, 0.005, 0.5, 0.9); o.connect(g); g.connect(dry);
    },
  };
  const DR = {
    kick: (t) => V.kick(t), clap: (t) => V.clap(t),
    hat: (t, s) => V.noise(t, s % 4 === 2 ? 0.09 : 0.055, 'highpass', 8000, 0.8, 0.035, dry),
    ohat: (t) => V.noise(t, 0.085, 'highpass', 7500, 0.8, 0.2, dry, 0.1),
    shaker: (t, s) => V.noise(t, s % 2 ? 0.03 : 0.05, 'bandpass', 7000, 1.2, 0.045, dry),
    dum: (t) => V.tom(t, 0.6, 140, 70, 0.32), tek: (t) => { V.noise(t, 0.2, 'bandpass', 3400, 2, 0.05, dry, 0.15); V.tom(t, 0.1, 520, 430, 0.05); },
    tik: (t) => V.noise(t, 0.06, 'bandpass', 5200, 3, 0.03, dry),
  };

  // ── composition ──
  const noteOf = (S, deg, oct = 0) => { const n = S.scale.length, o = Math.floor(deg / n); return S.root + S.scale[((deg % n) + n) % n] + 12 * (o + oct); };
  // four-note chord (triad + 7th) voiced close around the middle of the keyboard for smooth voice leading
  const voicing = (S, d) => [d, d + 2, d + 4, d + 6].map(x => { let m = noteOf(S, x); while (m < 57) m += 12; while (m >= 69) m -= 12; return mtof(m); }).sort((a, b) => a - b);
  const tonesOf = (d) => [d, d + 2, d + 4];
  // hook = 2-bar motif, answered, restated, resolved; strong beats snap to the bar's chord
  function compose(S) {
    const r = rng(S.seed * 101), snap = (deg, chord) => { let best = deg, bd = 99; for (const c of tonesOf(chord)) for (const o of [-7, 0, 7, 14]) { const x = c + o; if (Math.abs(x - deg) < bd) { bd = Math.abs(x - deg); best = x; } } return best; };
    const motif = []; let deg = 9;
    for (const [st, len] of S.motif) { const mv = r(); deg += mv < 0.35 ? -1 : mv < 0.7 ? 1 : mv < 0.85 ? (r() < 0.5 ? -2 : 2) : 0; deg = Math.max(5, Math.min(14, deg)); motif.push([st, len, deg]); }
    const phrase = (b0, end) => motif.map(([st, len, d], i) => { const bar = b0 + (st >> 4), chord = S.prog[bar % 4]; let x = (st % 8 === 0 || len >= 4) ? snap(d, chord) : d;
      if (i === motif.length - 1 && end != null) x = snap(end, chord); return [bar * 16 + (st % 16), len, x]; });
    return [...phrase(0), ...phrase(2, 11), ...phrase(4), ...phrase(6, 7)];
  }

  let S = null, mel = null, step = 0, next = 0, on = false, level = 0, timer = 0, cyc = 0;
  function schedule(st, t) {
    const bar = st >> 4, s = st & 15, sp = 60 / S.bpm / 4, barDur = sp * 16, chord = S.prog[bar % 4];
    const tt = t + (s % 2 ? S.swing * sp * 2 : 0), full = level > 0.85, drop = full && bar >= 8, gap = full && bar === 7 && s >= 12;
    const vbar = bar % 8;
    // chords: filter opens through the verse; drop is bright (and stabbed for future bass)
    const cut = !full ? S.cut[0] : drop ? S.cut[1] : S.cut[0] + (S.cut[1] * 0.6 - S.cut[0]) * vbar / 7;
    const vc = voicing(S, chord);
    if (drop && S.stabs) { if (S.stabs.includes(s)) V.chord(vc, tt, sp * 2.2, cut, 0.055); }
    else if (s === 0) V.chord(vc, tt, barDur, cut, full ? 0.05 : 0.06);
    if (S.drone && s === 0) V.drone(mtof(noteOf(S, 0, -1)), tt, barDur);
    // arp: up-down through the voicing plus the octave
    if (s % S.arpRate === 0 && !gap) { const tones = [...vc, vc[0] * 2], k = [0, 1, 2, 3, 4, 3, 2, 1][(s / S.arpRate) % 8];
      V[S.arp](tones[k] * (drop ? 2 : 1), tt, full ? (drop ? 0.8 : 0.9) : 0.6, (s % 4 < 2 ? -0.35 : 0.35)); }
    if (full && !gap) for (const [bs, oc, len] of S.bass) if (bs === s) V.bass(mtof(noteOf(S, chord, -2) + oc), tt, len * sp);
    // lead hook in the drop; on every other loop it is doubled an octave up
    if (drop) for (const [ms, len, d] of mel) if (ms === vbar * 16 + s) { const f = mtof(noteOf(S, d, 0)); V[S.lead](f, tt, 1, len * sp, sp); if (cyc % 2) V[S.lead](f * 2, tt, 0.45, len * sp, sp); lastLead = f; }
    // drums
    const kit = drop ? S.drums : S.verse;
    if (!gap) for (const k in kit) if (kit[k].includes(s) && (full || k === 'shaker' || k === 'tik' || k === 'hat')) DR[k](tt, s);
    if (full) {
      if (bar === 6 && s === 0) V.riser(tt, barDur * 2);
      if (bar === 7) { if (s % (s < 8 ? 2 : 1) === 0) V.snare(tt, 0.35 + 0.65 * s / 15); }
      if (bar === 8 && s === 0) V.impact(tt);
      if (bar === 15 && s >= 12) V.snare(tt, 0.5 + s * 0.03);
    }
  }
  function pump() {
    if (!S || !on) return;
    const ahead = AC.currentTime + 0.15, sp = 60 / S.bpm / 4;
    if (next < AC.currentTime - 0.2) next = AC.currentTime + 0.05; // after a stall, don't machine-gun the backlog
    while (next < ahead) { schedule(step, next); next += sp; step = (step + 1) % 256; if (!step) cyc++; }
  }
  function setTheme(id) { const ns = SONGS[id] || SONGS.beach; if (ns === S) return; S = ns; mel = compose(S); step = 0; cyc = 0; lastLead = 0; next = AC.currentTime + 0.1; dly.delayTime.value = 3 * 60 / S.bpm / 4; }
  function setOn(v) { on = !!v; if (on && !timer) timer = setInterval(pump, 25); if (!on && timer) { clearInterval(timer); timer = 0; } out.gain.setTargetAtTime(on ? level * 0.5 : 0, AC.currentTime, 0.2); if (on) next = AC.currentTime + 0.1; }
  function setLevel(l) { if (Math.abs(l - level) < 0.01) return; level = l; out.gain.setTargetAtTime(on ? level * 0.5 : 0, AC.currentTime, 0.4); }
  // offline check: schedule `sec` seconds starting at the beginning of the song (for OfflineAudioContext renders)
  function prerender(id, sec, lvl = 1) { S = null; setTheme(id); level = lvl; out.gain.value = lvl * 0.5; let t = 0.05; const sp = 60 / S.bpm / 4; for (let k = 0; t < sec; k++, t += sp) { schedule(step, t); step = (step + 1) % 256; if (!step) cyc++; } }
  return { setTheme, setOn, setLevel, prerender };
}
