import { useSyncExternalStore } from 'react';
import { BilingualText } from '../types/physics';

export type ExamCueType = 'correct' | 'wrong' | 'tick' | 'warning' | 'submit' | 'flip';

export interface AudioProfileMeta {
  kind: 'continuous' | 'event';
  label: BilingualText;
}

export const AUDIO_CAPABLE_SIMS: Record<string, AudioProfileMeta> = {
  'organ-pipes-beats': {
    kind: 'continuous',
    label: { en: 'Pipe Harmonics + Beats', hi: 'पाइप संनादी व विस्पंद ध्वनि' },
  },
  'doppler-effect': {
    kind: 'continuous',
    label: { en: 'Live Doppler Siren', hi: 'सजीव डॉपलर सायरन' },
  },
  'wave-superposition': {
    kind: 'continuous',
    label: { en: 'Interference Beat Tone', hi: 'व्यतिकरण ध्वनि' },
  },
  'wave-speed-basic': {
    kind: 'continuous',
    label: { en: 'Wave Frequency Pitch', hi: 'तरंग आवृत्ति स्वर' },
  },
  'communication-systems': {
    kind: 'continuous',
    label: { en: 'AM Modulated Carrier', hi: 'AM मॉडुलित रेडियो ध्वनि' },
  },
  'ac-circuits': {
    kind: 'continuous',
    label: { en: 'LCR Resonance Hum', hi: 'LCR अनुनाद ध्वनि' },
  },
  emi: {
    kind: 'continuous',
    label: { en: 'AC Generator Hum', hi: 'AC जनित्र ध्वनि' },
  },
  transformer: {
    kind: 'continuous',
    label: { en: 'Transformer Core Hum', hi: 'ट्रांसफ़ॉर्मर कोर ध्वनि' },
  },
  nuclei: {
    kind: 'event',
    label: { en: 'Geiger-Müller Clicks', hi: 'गाइगर-म्यूलर क्लिक' },
  },
  'simple-pendulum': {
    kind: 'event',
    label: { en: 'Pendulum Period Tick', hi: 'लोलक आवर्तकाल टिक' },
  },
  'shm-spring': {
    kind: 'event',
    label: { en: 'SHM Equilibrium Tick', hi: 'SHM मध्य-बिंदु टिक' },
  },
  'linear-momentum': {
    kind: 'event',
    label: { en: 'Collision Impact Thud', hi: 'टक्कर आघात ध्वनि' },
  },
  'impulse-momentum': {
    kind: 'event',
    label: { en: 'Impulse Impact Thud', hi: 'आवेग आघात ध्वनि' },
  },
  atoms: {
    kind: 'event',
    label: { en: 'Photon Emission Chime', hi: 'फ़ोटॉन उत्सर्जन स्वर' },
  },
  'eye-defects': {
    kind: 'event',
    label: { en: 'Retina Focus Cue', hi: 'रेटिना फ़ोकस संकेत' },
  },
  'thin-lens': {
    kind: 'event',
    label: { en: 'Optical Focus Cue', hi: 'लेंस फ़ोकस संकेत' },
  },
  'snell-prism-tir': {
    kind: 'event',
    label: { en: 'TIR Critical Angle Cue', hi: 'पूर्ण आंतरिक परावर्तन संकेत' },
  },
  'microscope-telescope': {
    kind: 'event',
    label: { en: 'Optical Mode Cue', hi: 'प्रकाशिकी संकेत' },
  },
};

export function hasPhysicsAudio(simId: string): boolean {
  return simId in AUDIO_CAPABLE_SIMS;
}

// ============================================================================
// REACTIVE CLASSROOM AUDIO STORE (MUTED BY DEFAULT)
// ============================================================================
interface AudioSettingsSnapshot {
  enabled: boolean;
  volume: number; // 0..1
}

let snapshot: AudioSettingsSnapshot = {
  enabled: false, // Classroom-safe default: muted until 1-click toggle
  volume: 0.55,
};

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((fn) => fn());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): AudioSettingsSnapshot {
  return snapshot;
}

export function usePhysicsAudio(): AudioSettingsSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// ============================================================================
// WEB AUDIO SYNTHESIS ENGINE (100% PROCEDURAL — ZERO EXTERNAL ASSETS)
// ============================================================================
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

interface ContinuousNodes {
  simId: string;
  osc1: OscillatorNode;
  osc2: OscillatorNode | null;
  lfo: OscillatorNode | null;
  lfoGain: GainNode | null;
  gain1: GainNode;
  gain2: GainNode | null;
  filter: BiquadFilterNode;
  outGain: GainNode;
}

let activeCont: ContinuousNodes | null = null;

// Event trigger memory so discrete sounds only fire once per crossing/change
const eventMem = {
  simId: '',
  lastSign: 0,
  lastPhaseBucket: -1,
  lastBoolFlag: -1,
  lastCollisionTime: -10,
  lastGeigerTime: -10,
  lastAtomCycle: -1,
};

function ensureAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  if (!audioCtx) {
    audioCtx = new Ctor();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = snapshot.enabled ? snapshot.volume * 0.35 : 0;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended' && snapshot.enabled) {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function ensureNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) {
    return noiseBuffer;
  }
  const len = Math.floor(ctx.sampleRate * 0.08);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.25));
  }
  noiseBuffer = buf;
  return buf;
}

export function setAudioEnabled(nextEnabled: boolean) {
  if (snapshot.enabled === nextEnabled) return;
  snapshot = { ...snapshot, enabled: nextEnabled };
  emitChange();

  if (nextEnabled) {
    const ctx = ensureAudioContext();
    if (ctx && masterGain) {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      masterGain.gain.setTargetAtTime(snapshot.volume * 0.35, ctx.currentTime, 0.03);
    }
  } else {
    stopPhysicsAudio();
    if (audioCtx && masterGain) {
      masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.025);
    }
  }
}

export function toggleAudio() {
  setAudioEnabled(!snapshot.enabled);
}

export function setAudioVolume(nextVol: number) {
  const clamped = Math.max(0, Math.min(1, nextVol));
  snapshot = { ...snapshot, volume: clamped };
  emitChange();
  if (audioCtx && masterGain && snapshot.enabled) {
    masterGain.gain.setTargetAtTime(clamped * 0.35, audioCtx.currentTime, 0.03);
  }
}

export function stopPhysicsAudio() {
  if (!activeCont) return;
  const nodes = activeCont;
  activeCont = null;
  try {
    const now = audioCtx ? audioCtx.currentTime : 0;
    nodes.outGain.gain.cancelScheduledValues(now);
    nodes.outGain.gain.setTargetAtTime(0.0001, now, 0.02);
    window.setTimeout(() => {
      try {
        nodes.osc1.stop();
        nodes.osc1.disconnect();
        if (nodes.osc2) {
          nodes.osc2.stop();
          nodes.osc2.disconnect();
        }
        if (nodes.lfo) {
          nodes.lfo.stop();
          nodes.lfo.disconnect();
        }
        if (nodes.lfoGain) nodes.lfoGain.disconnect();
        nodes.gain1.disconnect();
        if (nodes.gain2) nodes.gain2.disconnect();
        nodes.filter.disconnect();
        nodes.outGain.disconnect();
      } catch {
        // Already stopped
      }
    }, 90);
  } catch {
    // Ignore cleanup errors
  }
}

function startContinuousForSim(simId: string): ContinuousNodes | null {
  const ctx = ensureAudioContext();
  if (!ctx || !masterGain) return null;

  if (activeCont && activeCont.simId === simId) {
    return activeCont;
  }
  stopPhysicsAudio();

  const outGain = ctx.createGain();
  outGain.gain.value = 0.0001;
  outGain.connect(masterGain);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1800;
  filter.connect(outGain);

  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  gain1.gain.value = 0.5;
  osc1.connect(gain1);
  gain1.connect(filter);

  let osc2: OscillatorNode | null = null;
  let gain2: GainNode | null = null;
  let lfo: OscillatorNode | null = null;
  let lfoGain: GainNode | null = null;

  if (simId === 'organ-pipes-beats' || simId === 'wave-superposition') {
    osc1.type = 'triangle';
    osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    gain2 = ctx.createGain();
    gain2.gain.value = 0.5;
    osc2.connect(gain2);
    gain2.connect(filter);
    osc2.start();
  } else if (simId === 'communication-systems') {
    osc1.type = 'sine';
    lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.25;
    lfo.connect(lfoGain);
    lfoGain.connect(gain1.gain);
    lfo.start();
  } else if (simId === 'doppler-effect') {
    osc1.type = 'sawtooth';
    filter.frequency.value = 1150;
  } else if (simId === 'ac-circuits' || simId === 'emi' || simId === 'transformer') {
    osc1.type = 'triangle';
    filter.frequency.value = 520;
  } else {
    osc1.type = 'sine';
  }

  osc1.start();

  activeCont = {
    simId,
    osc1,
    osc2,
    lfo,
    lfoGain,
    gain1,
    gain2,
    filter,
    outGain,
  };
  return activeCont;
}

// Discrete one-shot procedural physics sounds
function triggerTick(freq = 860, dur = 0.032, level = 0.45) {
  if (!snapshot.enabled) return;
  const ctx = ensureAudioContext();
  if (!ctx || !masterGain) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.45, now + dur);
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(level, now + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0008, now + dur);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + dur + 0.01);
}

function triggerGeigerClick() {
  if (!snapshot.enabled) return;
  const ctx = ensureAudioContext();
  if (!ctx || !masterGain) return;
  const now = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = ensureNoiseBuffer(ctx);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2400 + Math.random() * 1400;
  bp.Q.value = 3.2;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.65, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.016);
  src.connect(bp);
  bp.connect(g);
  g.connect(masterGain);
  src.start(now);
  src.stop(now + 0.02);
}

function triggerImpactThud(intensity = 0.7) {
  if (!snapshot.enabled) return;
  const ctx = ensureAudioContext();
  if (!ctx || !masterGain) return;
  const now = ctx.currentTime;
  const lvl = Math.min(0.95, Math.max(0.2, intensity));
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(160 + lvl * 70, now);
  osc.frequency.exponentialRampToValueAtTime(42, now + 0.14);
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(lvl, now + 0.006);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.17);
}

function triggerPhotonChime(energyEv: number) {
  if (!snapshot.enabled) return;
  const ctx = ensureAudioContext();
  if (!ctx || !masterGain) return;
  const now = ctx.currentTime;
  const freq = Math.min(1320, Math.max(290, 320 + energyEv * 68));
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(0.45, now + 0.012);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.3);
}

function triggerFocusCue(locked: boolean) {
  if (!snapshot.enabled) return;
  const ctx = ensureAudioContext();
  if (!ctx || !masterGain) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  if (locked) {
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.setValueAtTime(880, now + 0.065);
  } else {
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(349.23, now + 0.065);
  }
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(0.32, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.24);
}

// ============================================================================
// FRAME-SYNCHRONIZED PHYSICS AUDIO DRIVER (CALLED FROM 2D & 3D LOOPS)
// ============================================================================
export function syncPhysicsAudioFrame(
  simId: string,
  t: number,
  dt: number,
  params: Record<string, number>,
  isPlaying: boolean,
  simSpeed: number
) {
  if (!snapshot.enabled || !hasPhysicsAudio(simId)) {
    if (activeCont) stopPhysicsAudio();
    return;
  }

  const profile = AUDIO_CAPABLE_SIMS[simId];

  // Reset per-sim event trackers when switching simulations
  if (eventMem.simId !== simId) {
    eventMem.simId = simId;
    eventMem.lastSign = 0;
    eventMem.lastPhaseBucket = -1;
    eventMem.lastBoolFlag = -1;
    eventMem.lastCollisionTime = -10;
    eventMem.lastGeigerTime = -10;
    eventMem.lastAtomCycle = -1;
  }

  // Optical state-change cues work even while paused when toggling sliders!
  if (simId === 'eye-defects') {
    if (activeCont) stopPhysicsAudio();
    const corrected = Math.round(params.corrected ?? 1);
    const defect = Math.round(params.defect ?? 0);
    const key = defect * 10 + corrected;
    if (eventMem.lastBoolFlag !== -1 && eventMem.lastBoolFlag !== key) {
      triggerFocusCue(corrected === 1);
    }
    eventMem.lastBoolFlag = key;
    return;
  }

  if (simId === 'snell-prism-tir') {
    if (activeCont) stopPhysicsAudio();
    const n1 = params.n1 ?? 1.5;
    const n2 = params.n2 ?? 1.0;
    const iDeg = params.iDeg ?? 35;
    const isTir = n1 > n2 && Math.sin((iDeg * Math.PI) / 180) >= n2 / n1 ? 1 : 0;
    if (eventMem.lastBoolFlag !== -1 && eventMem.lastBoolFlag !== isTir) {
      triggerFocusCue(isTir === 1);
    }
    eventMem.lastBoolFlag = isTir;
    return;
  }

  if (simId === 'thin-lens') {
    if (activeCont) stopPhysicsAudio();
    const f = params.f ?? 15;
    const uAbs = params.uAbs ?? 30;
    const isVirtual = f < 0 || uAbs < f ? 0 : 1;
    if (eventMem.lastBoolFlag !== -1 && eventMem.lastBoolFlag !== isVirtual) {
      triggerFocusCue(isVirtual === 1);
    }
    eventMem.lastBoolFlag = isVirtual;
    return;
  }

  if (simId === 'microscope-telescope') {
    if (activeCont) stopPhysicsAudio();
    const mode = Math.round(params.mode ?? 0);
    if (eventMem.lastBoolFlag !== -1 && eventMem.lastBoolFlag !== mode) {
      triggerFocusCue(true);
    }
    eventMem.lastBoolFlag = mode;
    return;
  }

  // All time-evolving physics sounds silence cleanly when paused
  if (!isPlaying) {
    if (activeCont) stopPhysicsAudio();
    return;
  }

  const ctx = ensureAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  if (profile.kind === 'continuous') {
    const nodes = startContinuousForSim(simId);
    if (!nodes) return;

    if (simId === 'organ-pipes-beats') {
      const isOpen = (params.pipeType ?? 1) >= 0.5;
      const mode = Math.max(1, Math.round(params.mode ?? 1));
      const L = Math.max(0.2, params.L ?? 0.85);
      const df = params.df ?? 4;
      const vSound = 340;
      const fFund = isOpen ? vSound / (2 * L) : vSound / (4 * L);
      const harmonicNum = isOpen ? mode : 2 * mode - 1;
      const fPipe = Math.min(1400, Math.max(85, fFund * harmonicNum));

      nodes.osc1.type = isOpen ? 'triangle' : 'square';
      nodes.filter.frequency.setTargetAtTime(isOpen ? 2200 : 950, now, 0.04);
      nodes.osc1.frequency.setTargetAtTime(fPipe, now, 0.03);
      nodes.gain1.gain.setTargetAtTime(0.42, now, 0.03);

      if (nodes.osc2 && nodes.gain2) {
        nodes.osc2.frequency.setTargetAtTime(fPipe + df, now, 0.03);
        nodes.gain2.gain.setTargetAtTime(df > 0 ? 0.42 : 0.0001, now, 0.03);
      }
      nodes.outGain.gain.setTargetAtTime(0.48, now, 0.04);
      return;
    }

    if (simId === 'doppler-effect') {
      const f0 = params.f0 ?? 500;
      const vs = params.vs ?? 80;
      const vo = params.vo ?? 0;
      const v = params.v ?? 340;
      // Source passes observer periodically along track
      const cycle = ((t * 0.22) % 1);
      const approaching = cycle < 0.5;
      const effVs = approaching ? vs : -vs;
      const effVo = approaching ? vo : -vo;
      const denom = Math.max(25, v - effVs);
      const fObs = Math.min(1500, Math.max(140, f0 * ((v + effVo) / denom)));
      const proximity = 1 - Math.abs(cycle - 0.5) * 1.45;
      const level = Math.max(0.14, Math.min(0.52, 0.18 + proximity * 0.34));

      nodes.osc1.frequency.setTargetAtTime(fObs, now, 0.045);
      nodes.outGain.gain.setTargetAtTime(level, now, 0.05);
      return;
    }

    if (simId === 'wave-superposition') {
      const f = params.f ?? 1.5;
      const A = params.A ?? 0.9;
      const phaseDeg = params.phase ?? 0;
      const baseFreq = 180 + f * 95;
      // Exact vector resultant amplitude |2 A cos(Δφ/2)|
      const resultantFactor = Math.abs(Math.cos(((phaseDeg * Math.PI) / 180) / 2));
      nodes.osc1.frequency.setTargetAtTime(baseFreq, now, 0.03);
      if (nodes.osc2 && nodes.gain2) {
        nodes.osc2.frequency.setTargetAtTime(baseFreq * 1.003, now, 0.03);
        nodes.gain2.gain.setTargetAtTime(0.35 * resultantFactor, now, 0.04);
      }
      nodes.outGain.gain.setTargetAtTime(
        Math.max(0.01, (A / 1.5) * 0.45 * resultantFactor),
        now,
        0.04
      );
      return;
    }

    if (simId === 'wave-speed-basic') {
      const f = params.f ?? 2;
      const amp = params.amp ?? 1.5;
      const freq = 160 + f * 85;
      nodes.osc1.frequency.setTargetAtTime(freq, now, 0.03);
      nodes.outGain.gain.setTargetAtTime(0.14 + (amp / 3) * 0.28, now, 0.04);
      return;
    }

    if (simId === 'communication-systems') {
      const ma = params.ma ?? 0.6;
      const fm = params.fm ?? 5;
      const modHz = Math.min(18, Math.max(1.5, fm * 0.85));
      const overMod = ma > 1.0;
      nodes.osc1.type = overMod ? 'sawtooth' : 'sine';
      nodes.osc1.frequency.setTargetAtTime(overMod ? 520 : 440, now, 0.04);
      nodes.filter.frequency.setTargetAtTime(overMod ? 2100 : 1200, now, 0.04);
      if (nodes.lfo && nodes.lfoGain) {
        nodes.lfo.frequency.setTargetAtTime(modHz, now, 0.04);
        nodes.lfoGain.gain.setTargetAtTime(Math.min(0.45, ma * 0.35), now, 0.04);
      }
      nodes.gain1.gain.setTargetAtTime(0.5, now, 0.04);
      nodes.outGain.gain.setTargetAtTime(0.36, now, 0.04);
      return;
    }

    if (simId === 'ac-circuits') {
      const f = params.f ?? 80;
      const R = params.R ?? 30;
      const L = (params.L ?? 100) * 1e-3;
      const C = (params.C ?? 40) * 1e-6;
      const w = 2 * Math.PI * f;
      const XL = w * L;
      const XC = 1 / Math.max(1e-9, w * C);
      const Z = Math.sqrt(R * R + (XL - XC) * (XL - XC));
      const resFactor = Math.min(1, R / Math.max(1, Z));
      nodes.osc1.frequency.setTargetAtTime(60 + f * 1.15, now, 0.04);
      nodes.outGain.gain.setTargetAtTime(0.12 + resFactor * 0.36, now, 0.05);
      return;
    }

    if (simId === 'emi') {
      const omega = params.omega ?? 2.5;
      const B = params.B ?? 0.8;
      const emfMag = Math.abs(Math.sin(omega * t));
      nodes.osc1.frequency.setTargetAtTime(90 + omega * 26, now, 0.03);
      nodes.outGain.gain.setTargetAtTime(0.1 + (B / 2) * emfMag * 0.32, now, 0.04);
      return;
    }

    if (simId === 'transformer') {
      const Vp = params.Vp ?? 220;
      const Np = Math.max(1, params.Np ?? 400);
      const Ns = params.Ns ?? 800;
      const Vs = (Vp * Ns) / Np;
      const stepFactor = Math.min(1.4, Math.max(0.3, Vs / 220));
      nodes.osc1.frequency.setTargetAtTime(100 + stepFactor * 45, now, 0.04);
      nodes.outGain.gain.setTargetAtTime(0.16 + Math.min(0.28, stepFactor * 0.18), now, 0.04);
      return;
    }
    return;
  }

  // Event-driven physics audio (stop any leftover continuous node)
  if (activeCont) stopPhysicsAudio();

  if (simId === 'nuclei') {
    const N0 = params.N0 ?? 100;
    const T_half = Math.max(1, params.halfLife ?? 3);
    const tCycle = t % (T_half * 5);
    const N_rem = N0 * Math.pow(0.5, tCycle / T_half);
    const rateHz = Math.min(26, (N_rem / 12) * Math.max(0.5, simSpeed));
    const prob = rateHz * Math.max(0.008, dt);
    if (Math.random() < prob && t - eventMem.lastGeigerTime > 0.03) {
      eventMem.lastGeigerTime = t;
      triggerGeigerClick();
    }
    return;
  }

  if (simId === 'simple-pendulum') {
    const L = Math.max(0.4, params.L ?? 1);
    const g = Math.max(1.6, params.g ?? 9.8);
    const omega = Math.sqrt(g / L);
    const val = Math.cos(omega * t);
    const sign = val >= 0 ? 1 : -1;
    if (eventMem.lastSign !== 0 && sign !== eventMem.lastSign) {
      triggerTick(sign > 0 ? 920 : 760, 0.032, 0.48);
    }
    eventMem.lastSign = sign;
    return;
  }

  if (simId === 'shm-spring') {
    const k = params.k ?? 35;
    const m = Math.max(0.5, params.m ?? 2);
    const omega = Math.sqrt(k / m);
    const val = Math.cos(omega * t);
    const sign = val >= 0 ? 1 : -1;
    if (eventMem.lastSign !== 0 && sign !== eventMem.lastSign) {
      triggerTick(sign > 0 ? 840 : 680, 0.03, 0.42);
    }
    eventMem.lastSign = sign;
    return;
  }

  if (simId === 'linear-momentum' || simId === 'impulse-momentum') {
    const cycle = t % 3.2;
    const bucket = cycle >= 1.25 && cycle < 1.55 ? 1 : 0;
    if (bucket === 1 && eventMem.lastPhaseBucket === 0 && t - eventMem.lastCollisionTime > 0.6) {
      eventMem.lastCollisionTime = t;
      const intensity =
        simId === 'impulse-momentum'
          ? Math.min(1, ((params.m ?? 0.5) * (params.u ?? 20)) / 30)
          : Math.min(1, ((params.m1 ?? 4) * Math.abs((params.u1 ?? 6) - (params.u2 ?? 0))) / 45);
      triggerImpactThud(0.35 + intensity * 0.6);
    }
    eventMem.lastPhaseBucket = bucket;
    return;
  }

  if (simId === 'atoms') {
    const nInit = Math.round(params.nInit ?? 3);
    const nFinal = Math.min(nInit - 1, Math.round(params.nFinal ?? 2));
    const Z = Math.round(params.Z ?? 1);
    const dE = Math.abs((-13.6 * Z * Z) / (nInit * nInit) - (-13.6 * Z * Z) / (nFinal * nFinal));
    const cycle = (t * 0.45) % 1;
    const emitted = cycle >= 0.58 ? 1 : 0;
    if (emitted === 1 && eventMem.lastAtomCycle === 0) {
      triggerPhotonChime(dE);
    }
    eventMem.lastAtomCycle = emitted;
  }
}

// ============================================================================
// SUBTLE CLASSROOM EXAM, QUIZ & FLASHCARD AUDIO CUES
// ============================================================================
export function playExamCue(type: ExamCueType) {
  if (!snapshot.enabled) return;
  const ctx = ensureAudioContext();
  if (!ctx || !masterGain) return;
  const now = ctx.currentTime;

  const playNote = (
    freq: number,
    startOffset: number,
    dur: number,
    wave: OscillatorType,
    level: number
  ) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, now + startOffset);
    g.gain.setValueAtTime(0.0008, now + startOffset);
    g.gain.linearRampToValueAtTime(level, now + startOffset + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0008, now + startOffset + dur);
    osc.connect(g);
    g.connect(masterGain!);
    osc.start(now + startOffset);
    osc.stop(now + startOffset + dur + 0.015);
  };

  switch (type) {
    case 'correct':
      playNote(587.33, 0, 0.11, 'sine', 0.36); // D5
      playNote(880.0, 0.085, 0.18, 'sine', 0.4); // A5
      break;
    case 'wrong':
      playNote(260, 0, 0.1, 'triangle', 0.32);
      playNote(215, 0.095, 0.14, 'triangle', 0.28);
      break;
    case 'tick':
      playNote(980, 0, 0.028, 'triangle', 0.22);
      break;
    case 'warning':
      playNote(660, 0, 0.12, 'sine', 0.34);
      playNote(660, 0.16, 0.14, 'sine', 0.34);
      break;
    case 'submit':
      playNote(523.25, 0, 0.14, 'sine', 0.32); // C5
      playNote(659.25, 0.08, 0.16, 'sine', 0.32); // E5
      playNote(783.99, 0.16, 0.24, 'sine', 0.36); // G5
      break;
    case 'flip':
      playNote(620, 0, 0.025, 'sine', 0.18);
      break;
  }
}
