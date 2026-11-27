import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCcw } from 'lucide-react';
import {
  ChalkStroke,
  ChalkTone,
  DrawingTool,
  LanguageMode,
  LiveSimTelemetry,
  PhysicsSimulation,
  ThemeMode,
} from '../types/physics';
import { getBilingualPrimary, UI_TEXT } from '../utils/bilingual';
import { ChalkboardOverlay } from './ChalkboardOverlay';
import { stopPhysicsAudio, syncPhysicsAudioFrame } from '../utils/physicsAudio';
import {
  buildEyeDefectsRig,
  buildMicroscopeTelescopeRig,
  buildSnellPrismTirRig,
  buildThinLensRig,
} from '../engines/rigs3d/optics3dRigs';
import {
  buildCommunicationSystemsRig,
  buildDopplerEffectRig,
  buildGravityVariationRig,
  buildOrganPipesBeatsRig,
} from '../engines/rigs3d/airforceWaves3dRigs';
import {
  buildNucleiRig,
  buildSimplePendulumRig,
  buildTransformerRig,
} from '../engines/rigs3d/mechEmNuclear3dRigs';

interface Simulation3DCanvasProps {
  simulation: PhysicsSimulation;
  params: Record<string, number>;
  isPlaying: boolean;
  simSpeed: number;
  showVectors: boolean;
  showGrid: boolean;
  theme: ThemeMode;
  language: LanguageMode;
  resetToken: number;
  stepToken: number;
  isDrawing: boolean;
  drawTool: DrawingTool;
  drawTone: ChalkTone;
  strokes: ChalkStroke[];
  onAddStroke: (stroke: ChalkStroke) => void;
  onTelemetry: (t: LiveSimTelemetry) => void;
  tall?: boolean;
}

const G_CONST = 6.674e-11;
const K_COULOMB = 8.988e9;

interface SceneRig {
  group: THREE.Group;
  defaultCamPos: [number, number, number];
  defaultTarget: [number, number, number];
  update: (
    dt: number,
    t: number,
    params: Record<string, number>,
    showVectors: boolean
  ) => LiveSimTelemetry;
}

function disposeObject3D(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
  });
}

function makePalette3D(theme: ThemeMode) {
  const isDark = theme === 'dark';
  return {
    bg: isDark ? 0x000000 : 0xffffff,
    primaryHex: isDark ? 0xffffff : 0x0a0a0a,
    secondaryHex: isDark ? 0x161616 : 0xf4f4f4,
    midHex: isDark ? 0xa3a3a3 : 0x525252,
    gridMain: isDark ? 0x525252 : 0x999999,
    gridSub: isDark ? 0x262626 : 0xe5e5e5,
    solidMat: () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? 0xf5f5f5 : 0x141414,
        roughness: 0.42,
        metalness: 0.12,
      }),
    contrastMat: () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? 0x222222 : 0xe8e8e8,
        roughness: 0.5,
        metalness: 0.08,
      }),
    edgeMat: () =>
      new THREE.LineBasicMaterial({
        color: isDark ? 0xffffff : 0x000000,
      }),
    mutedLineMat: () =>
      new THREE.LineBasicMaterial({
        color: isDark ? 0x737373 : 0x737373,
      }),
    dashedLineMat: () =>
      new THREE.LineDashedMaterial({
        color: isDark ? 0xd4d4d4 : 0x262626,
        dashSize: 0.25,
        gapSize: 0.16,
      }),
  };
}

function addCrispEdges(mesh: THREE.Mesh, edgeMat: THREE.LineBasicMaterial) {
  const edges = new THREE.EdgesGeometry(mesh.geometry, 20);
  const segs = new THREE.LineSegments(edges, edgeMat);
  mesh.add(segs);
}

// ============================================================================
// 1. 3D ELECTROMAGNETIC WAVES (E ⊥ B ⊥ c)
// ============================================================================
function buildEMWavesRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Axes (X = propagation c, Y = E-field, Z = B-field)
  const axisX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-6, 0, 0), 12.6, pal.primaryHex, 0.55, 0.28);
  const axisY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-6, -2.5, 0), 5.2, pal.primaryHex, 0.4, 0.22);
  const axisZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(-6, 0, -2.5), 5.2, pal.midHex, 0.4, 0.22);
  group.add(axisX, axisY, axisZ);

  // Wave curves
  const N_PTS = 120;
  const ePositions = new Float32Array(N_PTS * 3);
  const bPositions = new Float32Array(N_PTS * 3);
  const eGeo = new THREE.BufferGeometry();
  const bGeo = new THREE.BufferGeometry();
  eGeo.setAttribute('position', new THREE.BufferAttribute(ePositions, 3));
  bGeo.setAttribute('position', new THREE.BufferAttribute(bPositions, 3));

  const eLine = new THREE.Line(eGeo, new THREE.LineBasicMaterial({ color: pal.primaryHex }));
  const bLine = new THREE.Line(bGeo, pal.dashedLineMat());
  group.add(eLine, bLine);

  // Vector comb lines (vertical E bars & horizontal B bars)
  const N_BARS = 28;
  const eBarPos = new Float32Array(N_BARS * 2 * 3);
  const bBarPos = new Float32Array(N_BARS * 2 * 3);
  const eBarGeo = new THREE.BufferGeometry();
  const bBarGeo = new THREE.BufferGeometry();
  eBarGeo.setAttribute('position', new THREE.BufferAttribute(eBarPos, 3));
  bBarGeo.setAttribute('position', new THREE.BufferAttribute(bBarPos, 3));

  const eBars = new THREE.LineSegments(eBarGeo, new THREE.LineBasicMaterial({ color: pal.primaryHex }));
  const bBars = new THREE.LineSegments(bBarGeo, new THREE.LineBasicMaterial({ color: pal.midHex }));
  group.add(eBars, bBars);

  // Travelling crest markers (solid spheres on E, hollow torus rings on B)
  const eTipMeshes: THREE.Mesh[] = [];
  const bTipMeshes: THREE.Mesh[] = [];
  const tipSphere = new THREE.SphereGeometry(0.08, 10, 10);
  const tipRing = new THREE.TorusGeometry(0.09, 0.025, 8, 14);
  const sMat = pal.solidMat();
  const cMat = pal.contrastMat();
  for (let i = 0; i < N_BARS; i++) {
    const em = new THREE.Mesh(tipSphere, sMat);
    const bm = new THREE.Mesh(tipRing, cMat);
    bm.rotation.x = Math.PI / 2;
    group.add(em, bm);
    eTipMeshes.push(em);
    bTipMeshes.push(bm);
  }

  return {
    group,
    defaultCamPos: [6.8, 4.4, 7.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params, showVectors) => {
      const E0 = params.E0 ?? 150;
      const lambdaNm = params.lambda ?? 550;
      const nRef = params.nRef ?? 1.0;

      const c = 3e8;
      const v = c / nRef;
      const B0_nT = (E0 / v) * 1e9;
      const freqTHz = (c / (lambdaNm * 1e-9)) / 1e12;
      const lambdaMed = lambdaNm / nRef;

      const amp = (E0 / 300) * 2.25;
      const k = (2 * Math.PI * 2.2) / (lambdaMed / 550);
      const speedPhase = t * (3.6 / nRef);

      for (let i = 0; i < N_PTS; i++) {
        const u = i / (N_PTS - 1);
        const x = -5.8 + u * 11.6;
        const val = Math.sin(u * k - speedPhase) * amp;
        ePositions[i * 3] = x;
        ePositions[i * 3 + 1] = val;
        ePositions[i * 3 + 2] = 0;

        bPositions[i * 3] = x;
        bPositions[i * 3 + 1] = 0;
        bPositions[i * 3 + 2] = val * 0.85;
      }
      eGeo.attributes.position.needsUpdate = true;
      bGeo.attributes.position.needsUpdate = true;
      bLine.computeLineDistances();

      eBars.visible = showVectors;
      bBars.visible = showVectors;

      for (let i = 0; i < N_BARS; i++) {
        const u = i / (N_BARS - 1);
        const x = -5.8 + u * 11.6;
        const val = Math.sin(u * k - speedPhase) * amp;
        const idx = i * 6;

        eBarPos[idx] = x; eBarPos[idx + 1] = 0; eBarPos[idx + 2] = 0;
        eBarPos[idx + 3] = x; eBarPos[idx + 4] = val; eBarPos[idx + 5] = 0;

        bBarPos[idx] = x; bBarPos[idx + 1] = 0; bBarPos[idx + 2] = 0;
        bBarPos[idx + 3] = x; bBarPos[idx + 4] = 0; bBarPos[idx + 5] = val * 0.85;

        eTipMeshes[i].position.set(x, val, 0);
        eTipMeshes[i].visible = showVectors;
        bTipMeshes[i].position.set(x, 0, val * 0.85);
        bTipMeshes[i].visible = showVectors;
      }
      eBarGeo.attributes.position.needsUpdate = true;
      bBarGeo.attributes.position.needsUpdate = true;

      const ePts: { x: number; y: number }[] = [];
      const bPts: { x: number; y: number }[] = [];
      for (let i = 0; i <= 50; i++) {
        const u = i / 50;
        const s = Math.sin(u * k - speedPhase);
        ePts.push({ x: Number((u * 3).toFixed(2)), y: E0 * s });
        bPts.push({ x: Number((u * 3).toFixed(2)), y: E0 * 0.65 * s });
      }

      return {
        substitutedFormula: `v = c/n = ${(v / 1e8).toFixed(2)}×10⁸ m/s  |  B₀ = E₀/v = ${B0_nT.toFixed(0)} nT`,
        readouts: [
          { symbol: 'v', label: { en: 'Wave Speed (c/n)', hi: 'तरंग वेग (c/n)' }, value: (v / 1e8).toFixed(2), unit: '×10⁸ m/s', accent: 'velocity' },
          { symbol: 'B₀', label: { en: 'Magnetic Amp', hi: 'चुंबकीय आयाम (B₀)' }, value: B0_nT.toFixed(0), unit: 'nT', accent: 'force' },
          { symbol: 'λ_m', label: { en: 'Medium Wavelength', hi: 'माध्यम में तरंगदैर्घ्य' }, value: lambdaMed.toFixed(0), unit: 'nm', accent: 'momentum' },
          { symbol: 'f', label: { en: 'Frequency', hi: 'आवृत्ति (f)' }, value: freqTHz.toFixed(0), unit: 'THz', accent: 'energy' },
        ],
        graphPoints: ePts,
        graphSecondPoints: bPts,
        graphLegend: { primary: 'E_y(x) Solid', secondary: 'B_z(x) Dashed' },
      };
    },
  };
}

// ============================================================================
// 2. 3D BOHR ATOM & QUANTUM TRANSITIONS
// ============================================================================
function buildAtomsRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Composite Nucleus Cluster (protons + neutrons)
  const nucGroup = new THREE.Group();
  const nucleonGeo = new THREE.SphereGeometry(0.24, 14, 14);
  const offsets: [number, number, number][] = [
    [0, 0, 0],
    [0.2, 0.14, 0.1],
    [-0.18, -0.14, 0.12],
    [0.12, -0.18, -0.14],
    [-0.14, 0.18, -0.12],
  ];
  offsets.forEach(([x, y, z], i) => {
    const m = new THREE.Mesh(nucleonGeo, i % 2 === 0 ? pal.solidMat() : pal.contrastMat());
    m.position.set(x, y, z);
    addCrispEdges(m, pal.edgeMat());
    nucGroup.add(m);
  });
  group.add(nucGroup);

  // 5 Concentric 3D Bohr Orbital Shells
  const shellRings: THREE.Mesh[] = [];
  const shellRadii = [1.05, 1.9, 2.85, 3.85, 4.9];
  for (let i = 0; i < 5; i++) {
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(shellRadii[i], 0.032, 10, 72),
      pal.contrastMat()
    );
    torus.rotation.x = Math.PI / 2;
    group.add(torus);
    shellRings.push(torus);
  }

  // Electron Composite (core sphere + equatorial gyro ring)
  const electronGroup = new THREE.Group();
  const eCore = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), pal.solidMat());
  const eHalo = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.028, 8, 24), pal.solidMat());
  electronGroup.add(eCore, eHalo);
  group.add(electronGroup);

  // Emitted Photon Wavy Helix
  const PHOTON_PTS = 48;
  const photonPos = new Float32Array(PHOTON_PTS * 3);
  const photonGeo = new THREE.BufferGeometry();
  photonGeo.setAttribute('position', new THREE.BufferAttribute(photonPos, 3));
  const photonLine = new THREE.Line(photonGeo, new THREE.LineBasicMaterial({ color: pal.primaryHex }));
  group.add(photonLine);

  const solidMat = pal.solidMat();
  const mutedMat = pal.contrastMat();

  return {
    group,
    defaultCamPos: [0, 5.4, 8.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params) => {
      const nInit = Math.round(params.nInit ?? 3);
      const nFinal = Math.min(nInit - 1, Math.round(params.nFinal ?? 2));
      const Z = Math.round(params.Z ?? 1);

      const eInit = (-13.6 * Z * Z) / (nInit * nInit);
      const eFinal = (-13.6 * Z * Z) / (nFinal * nFinal);
      const dE = Math.abs(eInit - eFinal);
      const lambdaNm = 1240 / Math.max(0.01, dE);

      nucGroup.rotation.y = t * 0.9;
      nucGroup.rotation.x = t * 0.5;

      shellRings.forEach((ring, idx) => {
        const n = idx + 1;
        const isActive = n === nInit || n === nFinal;
        ring.material = isActive ? solidMat : mutedMat;
        ring.scale.setScalar(isActive ? 1.0 : 0.99);
      });

      const cycle = (t * 0.45) % 1;
      const rInit = shellRadii[nInit - 1];
      const rFinal = shellRadii[nFinal - 1];
      const rCur =
        cycle < 0.45
          ? rInit
          : cycle < 0.62
            ? rInit + ((cycle - 0.45) / 0.17) * (rFinal - rInit)
            : rFinal;

      const ang = t * (3.0 / Math.sqrt(rCur));
      electronGroup.position.set(Math.cos(ang) * rCur, 0, Math.sin(ang) * rCur);
      eHalo.rotation.y = t * 4;
      eHalo.rotation.x = t * 2.5;

      // Photon wave packet shooting upward-right after jump
      if (cycle >= 0.58) {
        photonLine.visible = true;
        const dist = (cycle - 0.58) * 14;
        const freq = Math.min(18, Math.max(5, dE * 2.4));
        for (let i = 0; i < PHOTON_PTS; i++) {
          const u = i / (PHOTON_PTS - 1);
          const s = dist + u * 2.0;
          photonPos[i * 3] = rFinal + s * 0.85;
          photonPos[i * 3 + 1] = s * 0.48 + Math.sin(u * Math.PI * freq) * 0.25;
          photonPos[i * 3 + 2] = Math.cos(u * Math.PI * freq) * 0.25;
        }
        photonGeo.attributes.position.needsUpdate = true;
      } else {
        photonLine.visible = false;
      }

      const series = nFinal === 1 ? 'Lyman' : nFinal === 2 ? 'Balmer' : 'Paschen';
      const graphPoints = [1, 2, 3, 4, 5].map((n) => ({
        x: n,
        y: (-13.6 * Z * Z) / (n * n),
      }));

      return {
        substitutedFormula: `ΔE = E_${nInit} − E_${nFinal} = ${dE.toFixed(2)} eV  |  λ = ${lambdaNm.toFixed(1)} nm`,
        readouts: [
          { symbol: 'ΔE', label: { en: 'Emitted Photon', hi: 'उत्सर्जित ऊर्जा (ΔE)' }, value: dE.toFixed(2), unit: 'eV', accent: 'force' },
          { symbol: 'λ', label: { en: 'Spectral Wavelength', hi: 'स्पेक्ट्रमी तरंगदैर्घ्य' }, value: lambdaNm.toFixed(1), unit: 'nm', accent: 'velocity' },
          { symbol: 'r_i', label: { en: 'Upper Orbit Radius', hi: 'उच्च कक्षा त्रिज्या' }, value: ((0.529 * nInit * nInit) / Z).toFixed(2), unit: 'Å', accent: 'momentum' },
          { symbol: 'Series', label: { en: 'Spectral Series', hi: 'स्पेक्ट्रमी श्रेणी' }, value: series, unit: '', accent: 'energy' },
        ],
        graphPoints,
        graphCurrentPoint: { x: nFinal, y: eFinal },
        graphLegend: { primary: 'Energy Levels E_n = −13.6·Z²/n²' },
      };
    },
  };
}

// ============================================================================
// 3. 3D AC GENERATOR (ELECTROMAGNETIC INDUCTION)
// ============================================================================
function buildEMIRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Left N Pole (solid dark/light) & Right S Pole (contrast + crisp edges)
  const poleGeo = new THREE.BoxGeometry(1.4, 3.0, 3.6);
  const northPole = new THREE.Mesh(poleGeo, pal.solidMat());
  northPole.position.set(-3.6, 0, 0);
  addCrispEdges(northPole, pal.edgeMat());

  const southPole = new THREE.Mesh(poleGeo, pal.contrastMat());
  southPole.position.set(3.6, 0, 0);
  addCrispEdges(southPole, pal.edgeMat());
  group.add(northPole, southPole);

  // Uniform B-field arrows N -> S
  const fieldGroup = new THREE.Group();
  for (const y of [-0.9, 0, 0.9]) {
    for (const z of [-1.0, 0, 1.0]) {
      const arr = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-2.7, y, z),
        5.4,
        pal.midHex,
        0.34,
        0.16
      );
      fieldGroup.add(arr);
    }
  }
  group.add(fieldGroup);

  // Rotating Rectangular Coil Armature around Z axis
  const coilGroup = new THREE.Group();
  const barThick = 0.14;
  const topBar = new THREE.Mesh(new THREE.BoxGeometry(2.6, barThick, barThick), pal.solidMat());
  topBar.position.set(0, 0, -1.3);
  const botBar = new THREE.Mesh(new THREE.BoxGeometry(2.6, barThick, barThick), pal.solidMat());
  botBar.position.set(0, 0, 1.3);
  const sideL = new THREE.Mesh(new THREE.BoxGeometry(barThick, barThick, 2.74), pal.solidMat());
  sideL.position.set(-1.3, 0, 0);
  const sideR = new THREE.Mesh(new THREE.BoxGeometry(barThick, barThick, 2.74), pal.solidMat());
  sideR.position.set(1.3, 0, 0);
  [topBar, botBar, sideL, sideR].forEach((m) => addCrispEdges(m, pal.edgeMat()));

  // Axle shaft + slip rings
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.6, 12), pal.contrastMat());
  axle.rotation.x = Math.PI / 2;
  axle.position.z = 0.6;
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 10, 24), pal.solidMat());
  ring1.position.z = 2.05;
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 10, 24), pal.contrastMat());
  ring2.position.z = 2.45;
  addCrispEdges(ring2, pal.edgeMat());

  // Area Normal Arrow perpendicular to coil plane (pointing along +Y in coil local space)
  const normalArrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 0),
    2.1,
    pal.primaryHex,
    0.45,
    0.24
  );

  coilGroup.add(topBar, botBar, sideL, sideR, axle, ring1, ring2, normalArrow);
  group.add(coilGroup);

  const histE: { x: number; y: number }[] = [];
  const histPhi: { x: number; y: number }[] = [];

  return {
    group,
    defaultCamPos: [3.2, 3.8, 7.8],
    defaultTarget: [0, 0, 0],
    update: (dt, t, params, showVectors) => {
      const N = params.N ?? 20;
      const B = params.B ?? 0.8;
      const A = params.A ?? 0.4;
      const omega = params.omega ?? 2.5;

      const angle = omega * t;
      coilGroup.rotation.z = angle;
      fieldGroup.visible = showVectors;
      normalArrow.visible = showVectors;

      const flux = B * A * Math.cos(angle);
      const emfMax = N * B * A * omega;
      const emf = emfMax * Math.sin(angle);

      if (dt > 0 && (histE.length === 0 || t - histE[histE.length - 1].x >= 0.04)) {
        histE.push({ x: t, y: emf });
        histPhi.push({ x: t, y: flux * N });
        if (histE.length > 90) {
          histE.shift();
          histPhi.shift();
        }
      }

      return {
        substitutedFormula: `ε = (${N})(${B})(${A})(${omega})·sin(${(((angle * 180) / Math.PI) % 360).toFixed(0)}°) = ${emf.toFixed(2)} V`,
        readouts: [
          { symbol: 'ε', label: { en: 'Live Induced EMF', hi: 'प्रेरित वि.वा.ब. (ε)' }, value: emf.toFixed(2), unit: 'V', accent: 'force' },
          { symbol: 'ε₀', label: { en: 'Peak EMF (NBAω)', hi: 'शिखर वि.वा.ब.' }, value: emfMax.toFixed(2), unit: 'V', accent: 'energy' },
          { symbol: 'Φ', label: { en: 'Magnetic Flux', hi: 'चुंबकीय फ्लक्स (Φ)' }, value: flux.toFixed(3), unit: 'Wb', accent: 'velocity' },
          { symbol: 'f', label: { en: 'AC Frequency', hi: 'AC आवृत्ति' }, value: (omega / (2 * Math.PI)).toFixed(2), unit: 'Hz', accent: 'momentum' },
        ],
        graphPoints: histE.length ? [...histE] : [{ x: 0, y: 0 }],
        graphSecondPoints: histPhi.length ? [...histPhi] : [{ x: 0, y: N * B * A }],
        graphLegend: { primary: 'EMF ε(t) Solid', secondary: 'Flux NΦ(t) Dashed' },
      };
    },
  };
}

// ============================================================================
// 4. 3D LORENTZ FORCE (HELICAL CYCLOTRON MOTION)
// ============================================================================
function buildLorentzRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Uniform 3D Magnetic Field B pointing upward along +Y
  const bFieldGroup = new THREE.Group();
  for (const x of [-3.2, 0, 3.2]) {
    for (const z of [-3.2, 0, 3.2]) {
      if (x === 0 && z === 0) continue;
      const arr = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(x, -3.2, z),
        6.4,
        pal.midHex,
        0.4,
        0.18
      );
      bFieldGroup.add(arr);
    }
  }
  group.add(bFieldGroup);

  // Helical trail curve
  const MAX_TRAIL = 220;
  const trailPos = new Float32Array(MAX_TRAIL * 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
  const trailLine = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: pal.primaryHex }));
  group.add(trailLine);

  // Charged particle composite
  const particle = new THREE.Group();
  const pCore = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), pal.solidMat());
  const pRing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 8, 20), pal.solidMat());
  particle.add(pCore, pRing);
  group.add(particle);

  const vArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.6, pal.midHex, 0.35, 0.18);
  const fArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(), 1.6, pal.primaryHex, 0.4, 0.22);
  group.add(vArrow, fArrow);

  return {
    group,
    defaultCamPos: [6.5, 4.2, 7.2],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params, showVectors) => {
      const v = params.v ?? 5;
      const B = params.B ?? 0.8;
      const q = params.q ?? 1;
      const m = params.m ?? 2;

      const qAbs = Math.abs(q);
      const rReal = qAbs > 0 ? (m * v) / (qAbs * B) : 50;
      const rVis = qAbs > 0 ? Math.min(3.1, Math.max(0.75, rReal * 0.2)) : 3.0;
      const omega = qAbs > 0 ? (q * B) / m * 2.4 : 0;

      // Continuous helical cycle along Y from -3 to +3
      const yCycle = ((t * 0.75) % 6.0) - 3.0;
      const ang = omega * t;

      const px = Math.cos(ang) * rVis;
      const pz = Math.sin(ang) * rVis;
      particle.position.set(px, yCycle, pz);
      pRing.rotation.y = t * 3;

      // Recompute helical path up to current height
      for (let i = 0; i < MAX_TRAIL; i++) {
        const u = i / (MAX_TRAIL - 1);
        const tHist = t - (1 - u) * ((yCycle + 3.0) / 0.75);
        const yH = -3.0 + u * (yCycle + 3.0);
        const aH = omega * tHist;
        trailPos[i * 3] = Math.cos(aH) * rVis;
        trailPos[i * 3 + 1] = yH;
        trailPos[i * 3 + 2] = Math.sin(aH) * rVis;
      }
      trailGeo.attributes.position.needsUpdate = true;

      bFieldGroup.visible = showVectors;
      vArrow.visible = showVectors;
      fArrow.visible = showVectors && qAbs > 0;

      // Velocity tangent + inward magnetic centripetal force
      const vDir = new THREE.Vector3(-Math.sin(ang) * Math.sign(q || 1), 0.35, Math.cos(ang) * Math.sign(q || 1)).normalize();
      const fDir = new THREE.Vector3(-px, 0, -pz).normalize();
      vArrow.position.copy(particle.position);
      vArrow.setDirection(vDir);
      fArrow.position.copy(particle.position);
      fArrow.setDirection(fDir);

      const fMag = qAbs * 1.602e-19 * (v * 1e6) * B * 1e12;
      const graphPoints: { x: number; y: number }[] = [];
      for (let bv = 0.2; bv <= 2.05; bv += 0.1) {
        graphPoints.push({ x: Number(bv.toFixed(1)), y: qAbs > 0 ? (m * v) / (qAbs * bv) : 0 });
      }

      return {
        substitutedFormula: `F = |${q}e|×(${v}×10⁶)×${B} = ${fMag.toFixed(2)} pN  |  r = ${rReal.toFixed(2)}`,
        readouts: [
          { symbol: 'F_B', label: { en: 'Lorentz Force', hi: 'लॉरेंत्ज़ बल (F_B)' }, value: fMag.toFixed(2), unit: 'pN', accent: 'force' },
          { symbol: 'r', label: { en: 'Helix Radius', hi: 'कक्षीय त्रिज्या (r)' }, value: qAbs > 0 ? rReal.toFixed(2) : '∞', unit: 'scaled', accent: 'momentum' },
          { symbol: 'v', label: { en: 'Particle Speed', hi: 'कण की चाल' }, value: v.toFixed(1), unit: '×10⁶ m/s', accent: 'velocity' },
          { symbol: 'W', label: { en: 'Magnetic Work', hi: 'चुंबकीय कार्य' }, value: '0.00', unit: 'J', accent: 'energy' },
        ],
        graphPoints,
        graphCurrentPoint: { x: B, y: qAbs > 0 ? rReal : 0 },
        graphLegend: { primary: 'Helix Radius r(B) ∝ 1/B' },
      };
    },
  };
}

// ============================================================================
// 5. 3D GRAVITATION & SATELLITE ORBIT
// ============================================================================
function buildGravitationRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Central Planet with meridian wireframe cage
  const planetGroup = new THREE.Group();
  const planetCore = new THREE.Mesh(new THREE.SphereGeometry(1.15, 24, 18), pal.solidMat());
  const planetWire = new THREE.Mesh(
    new THREE.SphereGeometry(1.22, 16, 12),
    new THREE.MeshBasicMaterial({ color: pal.primaryHex, wireframe: true })
  );
  planetGroup.add(planetCore, planetWire);
  group.add(planetGroup);

  // Reference orbit torus
  const orbitRef = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.025, 8, 72), pal.contrastMat());
  orbitRef.rotation.x = Math.PI / 2;
  group.add(orbitRef);

  // Composite Satellite (main bus + twin solar panels)
  const satGroup = new THREE.Group();
  const satBody = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.38), pal.solidMat());
  const panelL = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.04, 0.32), pal.contrastMat());
  panelL.position.x = -0.62;
  const panelR = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.04, 0.32), pal.contrastMat());
  panelR.position.x = 0.62;
  [satBody, panelL, panelR].forEach((m) => addCrispEdges(m, pal.edgeMat()));
  satGroup.add(satBody, panelL, panelR);
  group.add(satGroup);

  const fArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(), 1.8, pal.primaryHex, 0.4, 0.22);
  const vArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(), 1.8, pal.midHex, 0.35, 0.18);
  group.add(fArrow, vArrow);

  return {
    group,
    defaultCamPos: [4.6, 4.8, 6.8],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params, showVectors) => {
      const M = params.M ?? 6;
      const m = params.m ?? 5;
      const r0 = params.r ?? 10;
      const vFactor = params.vFactor ?? 1.0;

      planetGroup.rotation.y = t * 0.35;
      const pScale = 0.8 + (M / 20) * 0.55;
      planetGroup.scale.setScalar(pScale);

      const ecc = Math.min(0.45, Math.abs(vFactor - 1.0) * 1.1);
      const aVis = (r0 / 10) * 3.4;
      orbitRef.scale.set(aVis / 3.5, aVis / 3.5, 1);

      const ang = t * Math.sqrt(M / r0) * 1.65;
      const rCurVis = (aVis * (1 - ecc * ecc)) / (1 + ecc * Math.cos(ang));
      const sx = Math.cos(ang) * rCurVis;
      const sz = Math.sin(ang) * rCurVis;
      const sy = Math.sin(ang) * rCurVis * 0.18; // slight 3D orbital inclination!

      satGroup.position.set(sx, sy, sz);
      satGroup.lookAt(0, 0, 0);

      const rCurReal = r0 * (rCurVis / Math.max(0.5, aVis));
      const F_newtons = (G_CONST * (M * 1e24) * (m * 1e3)) / Math.pow(rCurReal * 1e6, 2);
      const F_kN = F_newtons / 1000;
      const vOrbReal = Math.sqrt((G_CONST * M * 1e24) / (r0 * 1e6)) / 1000;
      const vEscReal = vOrbReal * Math.SQRT2;

      fArrow.visible = showVectors;
      vArrow.visible = showVectors;
      const toCenter = new THREE.Vector3(-sx, -sy, -sz).normalize();
      const tang = new THREE.Vector3(-Math.sin(ang), Math.cos(ang) * 0.18, Math.cos(ang)).normalize();
      fArrow.position.copy(satGroup.position);
      fArrow.setDirection(toCenter);
      fArrow.setLength(Math.min(2.6, Math.max(0.9, Math.sqrt(F_kN) * 0.45)), 0.38, 0.2);
      vArrow.position.copy(satGroup.position);
      vArrow.setDirection(tang);

      const graphPoints: { x: number; y: number }[] = [];
      for (let rv = 5; rv <= 25; rv += 0.5) {
        graphPoints.push({ x: rv, y: (G_CONST * (M * 1e24) * (m * 1e3)) / Math.pow(rv * 1e6, 2) / 1000 });
      }

      return {
        substitutedFormula: `F = G·(${M}×10²⁴)(${m}×10³) / (${rCurReal.toFixed(1)}×10⁶)² = ${F_kN.toFixed(2)} kN`,
        readouts: [
          { symbol: 'F_g', label: { en: 'Gravitational Force', hi: 'गुरुत्वाकर्षण बल' }, value: F_kN.toFixed(2), unit: 'kN', accent: 'force' },
          { symbol: 'v_orb', label: { en: 'Orbital Speed', hi: 'कक्षीय चाल' }, value: vOrbReal.toFixed(2), unit: 'km/s', accent: 'velocity' },
          { symbol: 'v_esc', label: { en: 'Escape Speed', hi: 'पलायन वेग' }, value: vEscReal.toFixed(2), unit: 'km/s', accent: 'energy' },
          { symbol: 'g_loc', label: { en: 'Field Strength', hi: 'गुरुत्वीय तीव्रता' }, value: (F_newtons / (m * 1e3)).toFixed(2), unit: 'm/s²', accent: 'momentum' },
        ],
        graphPoints,
        graphCurrentPoint: { x: Math.min(25, Math.max(5, rCurReal)), y: F_kN },
        graphLegend: { primary: 'Inverse-Square F(r)' },
      };
    },
  };
}

// ============================================================================
// 6. 3D ANGULAR MOMENTUM (GYROSCOPE + AXIAL L VECTOR)
// ============================================================================
function buildAngularMomentumRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Base pedestal & vertical axis
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, 0.32, 24), pal.contrastMat());
  base.position.y = -2.1;
  addCrispEdges(base, pal.edgeMat());
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 4.2, 16), pal.solidMat());
  group.add(base, shaft);

  // Rotating Assembly
  const rotor = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 6.2, 12), pal.contrastMat());
  bar.rotation.z = Math.PI / 2;
  addCrispEdges(bar, pal.edgeMat());

  const makeWeight = () => {
    const wg = new THREE.Group();
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.5, 18), pal.solidMat());
    cyl.rotation.z = Math.PI / 2;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.05, 8, 20), pal.contrastMat());
    rim.rotation.y = Math.PI / 2;
    addCrispEdges(cyl, pal.edgeMat());
    wg.add(cyl, rim);
    return wg;
  };
  const massA = makeWeight();
  const massB = makeWeight();
  rotor.add(bar, massA, massB);
  group.add(rotor);

  // Sweep circle guide
  const sweepRing = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.025, 8, 64), pal.contrastMat());
  sweepRing.rotation.x = Math.PI / 2;
  group.add(sweepRing);

  // Axial Angular Momentum Vector L (Right-Hand Thumb Rule!)
  const lArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.4, 0), 2.8, pal.primaryHex, 0.55, 0.3);
  group.add(lArrow);

  let theta = 0;
  let rSmooth = 1.4;

  return {
    group,
    defaultCamPos: [5.4, 4.0, 6.2],
    defaultTarget: [0, 0.2, 0],
    update: (dt, _t, params, showVectors) => {
      const rTarget = params.r ?? 1.4;
      const m = params.m ?? 3;
      const L = params.L ?? 24;
      const I_hub = 1.0;

      rSmooth += (rTarget - rSmooth) * Math.min(1, dt * 8 || 0.2);
      const I = I_hub + 2 * m * rSmooth * rSmooth;
      const omega = L / I;
      const kRot = 0.5 * I * omega * omega;

      theta = (theta + omega * dt) % (Math.PI * 2);
      rotor.rotation.y = theta;

      const armVis = (rSmooth / 1.8) * 2.9;
      massA.position.x = armVis;
      massB.position.x = -armVis;
      const mScale = 0.72 + (m / 10) * 0.55;
      massA.scale.setScalar(mScale);
      massB.scale.setScalar(mScale);
      sweepRing.scale.set(armVis / 2.5, armVis / 2.5, 1);

      lArrow.visible = showVectors;
      lArrow.setLength(1.4 + (L / 50) * 2.0, 0.5, 0.26);

      const graphPoints: { x: number; y: number }[] = [];
      for (let rv = 0.3; rv <= 1.81; rv += 0.05) {
        graphPoints.push({ x: rv, y: L / (I_hub + 2 * m * rv * rv) });
      }

      return {
        substitutedFormula: `L = I·ω = (${I.toFixed(2)}) × (${omega.toFixed(2)}) = ${L.toFixed(1)} kg·m²/s`,
        readouts: [
          { symbol: 'ω', label: { en: 'Angular Velocity', hi: 'कोणीय वेग (ω)' }, value: omega.toFixed(2), unit: 'rad/s', accent: 'momentum' },
          { symbol: 'I', label: { en: 'Moment of Inertia', hi: 'जड़त्व आघूर्ण (I)' }, value: I.toFixed(2), unit: 'kg·m²', accent: 'energy' },
          { symbol: 'L', label: { en: 'Axial L (Conserved)', hi: 'कोणीय संवेग (नियत)' }, value: L.toFixed(1), unit: 'kg·m²/s', accent: 'momentum' },
          { symbol: 'K_rot', label: { en: 'Rotational KE', hi: 'घूर्णन गतिज ऊर्जा' }, value: kRot.toFixed(1), unit: 'J', accent: 'force' },
        ],
        graphPoints,
        graphCurrentPoint: { x: rSmooth, y: omega },
        graphLegend: { primary: 'ω(r) = L / (1 + 2mr²)' },
      };
    },
  };
}

// ============================================================================
// 7. 3D COULOMB'S LAW & ELECTRIC DIPOLE FIELD
// ============================================================================
function buildCoulombRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  const q1Mesh = new THREE.Mesh(new THREE.SphereGeometry(0.62, 22, 18), pal.solidMat());
  const q2Mesh = new THREE.Mesh(new THREE.SphereGeometry(0.62, 22, 18), pal.contrastMat());
  addCrispEdges(q2Mesh, pal.edgeMat());
  group.add(q1Mesh, q2Mesh);

  // 12 3D field loops around symmetry axis X
  const N_LOOPS = 12;
  const LOOP_PTS = 36;
  const loops: { line: THREE.Line; geo: THREE.BufferGeometry; pos: Float32Array; phi: number; tier: number }[] = [];
  for (let i = 0; i < N_LOOPS; i++) {
    const phi = ((i % 6) / 6) * Math.PI * 2;
    const tier = i < 6 ? 1.15 : 2.15;
    const pos = new Float32Array(LOOP_PTS * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: pal.midHex }));
    group.add(line);
    loops.push({ line, geo, pos, phi, tier });
  }

  const f1Arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.8, pal.primaryHex, 0.4, 0.22);
  const f2Arrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(), 1.8, pal.primaryHex, 0.4, 0.22);
  group.add(f1Arrow, f2Arrow);

  return {
    group,
    defaultCamPos: [0, 3.8, 8.2],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params, showVectors) => {
      const q1 = params.q1 ?? 6;
      const q2 = params.q2 ?? -6;
      const rCm = params.r ?? 24;

      const halfSep = (rCm / 60) * 3.4 + 0.7;
      q1Mesh.position.set(-halfSep, 0, 0);
      q2Mesh.position.set(halfSep, 0, 0);
      q1Mesh.scale.setScalar(0.75 + (Math.abs(q1) / 10) * 0.45);
      q2Mesh.scale.setScalar(0.75 + (Math.abs(q2) / 10) * 0.45);

      const attract = q1 * q2 < 0;
      const rMeters = rCm / 100;
      const F = (K_COULOMB * Math.abs(q1 * 1e-6 * q2 * 1e-6)) / (rMeters * rMeters);
      const E1 = (K_COULOMB * Math.abs(q1 * 1e-6)) / (rMeters * rMeters) / 1e6;

      loops.forEach((lp) => {
        lp.line.visible = showVectors && q1 !== 0 && q2 !== 0;
        const rotPhi = lp.phi + t * 0.25;
        for (let j = 0; j < LOOP_PTS; j++) {
          const u = j / (LOOP_PTS - 1);
          if (attract) {
            const x = -halfSep + u * (2 * halfSep);
            const arch = Math.sin(u * Math.PI) * lp.tier * (halfSep * 0.65);
            lp.pos[j * 3] = x;
            lp.pos[j * 3 + 1] = Math.cos(rotPhi) * arch;
            lp.pos[j * 3 + 2] = Math.sin(rotPhi) * arch;
          } else {
            // Repelling field lines flaring away from neutral midpoint
            const side = lp.tier < 1.5 ? -1 : 1;
            const x = side * (halfSep + u * 2.2);
            const flare = (0.3 + u * 2.1) * 1.1;
            lp.pos[j * 3] = x;
            lp.pos[j * 3 + 1] = Math.cos(rotPhi) * flare;
            lp.pos[j * 3 + 2] = Math.sin(rotPhi) * flare;
          }
        }
        lp.geo.attributes.position.needsUpdate = true;
      });

      const dir1 = attract ? 1 : -1;
      const fLen = Math.min(2.4, Math.max(0.8, Math.sqrt(F) * 0.45));
      f1Arrow.visible = showVectors && F > 0.01;
      f2Arrow.visible = showVectors && F > 0.01;
      f1Arrow.position.set(-halfSep, 0, 0);
      f1Arrow.setDirection(new THREE.Vector3(dir1, 0, 0));
      f1Arrow.setLength(fLen, 0.36, 0.2);
      f2Arrow.position.set(halfSep, 0, 0);
      f2Arrow.setDirection(new THREE.Vector3(-dir1, 0, 0));
      f2Arrow.setLength(fLen, 0.36, 0.2);

      const graphPoints: { x: number; y: number }[] = [];
      for (let rv = 10; rv <= 60; rv += 2) {
        const rm = rv / 100;
        graphPoints.push({ x: rv, y: (K_COULOMB * Math.abs(q1 * 1e-6 * q2 * 1e-6)) / (rm * rm) });
      }

      return {
        substitutedFormula: `F = k·|(${q1}μC)(${q2}μC)| / (${rMeters.toFixed(2)}m)² = ${F.toFixed(2)} N`,
        readouts: [
          { symbol: 'F_e', label: { en: 'Coulomb Force', hi: 'विद्युत बल (F)' }, value: F.toFixed(2), unit: 'N', accent: 'force' },
          { symbol: 'Type', label: { en: 'Interaction', hi: 'प्रकृति' }, value: attract ? 'ATTRACT' : 'REPEL', unit: '', accent: 'momentum' },
          { symbol: 'E₁', label: { en: 'Field at q₂', hi: 'q₂ पर विद्युत क्षेत्र' }, value: E1.toFixed(2), unit: 'MN/C', accent: 'velocity' },
          { symbol: 'r', label: { en: 'Separation', hi: 'दूरी (r)' }, value: `${rCm}`, unit: 'cm', accent: 'energy' },
        ],
        graphPoints,
        graphCurrentPoint: { x: rCm, y: F },
        graphLegend: { primary: 'Electrostatic Force F(r) ∝ 1/r²' },
      };
    },
  };
}

// ============================================================================
// 8. 3D ESCAPE VELOCITY & ORBITAL LAUNCH
// ============================================================================
function buildEscapeVelocityRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Central Planet with meridian grid + gravity well rings
  const planetGroup = new THREE.Group();
  const planetCore = new THREE.Mesh(new THREE.SphereGeometry(1.4, 24, 18), pal.solidMat());
  const planetWire = new THREE.Mesh(
    new THREE.SphereGeometry(1.47, 16, 12),
    new THREE.MeshBasicMaterial({ color: pal.primaryHex, wireframe: true })
  );
  planetGroup.add(planetCore, planetWire);
  group.add(planetGroup);

  // Orbital reference shell & escape threshold dashed ring
  const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.025, 8, 72), pal.contrastMat());
  orbitRing.rotation.x = Math.PI / 2;
  group.add(orbitRing);

  // Composite Multi-Stage Rocket (nose cone + fuselage + 3 fins + nozzle)
  const rocketGroup = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.72, 12), pal.solidMat());
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.34, 12), pal.contrastMat());
  nose.position.y = 0.53;
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.16, 10), pal.contrastMat());
  nozzle.position.y = -0.44;
  [body, nose, nozzle].forEach((m) => addCrispEdges(m, pal.edgeMat()));
  for (let i = 0; i < 3; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.24, 0.22), pal.solidMat());
    const a = (i / 3) * Math.PI * 2;
    fin.position.set(Math.cos(a) * 0.18, -0.24, Math.sin(a) * 0.18);
    fin.rotation.y = -a;
    rocketGroup.add(fin);
  }
  rocketGroup.add(body, nose, nozzle);
  group.add(rocketGroup);

  // Live trajectory trail buffer (zero per-frame alloc)
  const TRAIL_N = 140;
  const trailPos = new Float32Array(TRAIL_N * 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
  const trailLine = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: pal.primaryHex }));
  group.add(trailLine);

  const vArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(), 1.8, pal.primaryHex, 0.4, 0.2);
  const gArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(), 1.4, pal.midHex, 0.35, 0.18);
  group.add(vArrow, gArrow);

  const tmpDir = new THREE.Vector3();
  const tmpUp = new THREE.Vector3(0, 1, 0);
  const tmpQuat = new THREE.Quaternion();

  return {
    group,
    defaultCamPos: [4.8, 5.2, 7.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params, showVectors) => {
      const M = params.M ?? 6.0;
      const R = params.R ?? 6.4;
      const vLaunch = params.vLaunch ?? 11.2;

      const vOrb = Math.sqrt((G_CONST * M * 1e24) / (R * 1e6)) / 1000;
      const vEsc = vOrb * Math.SQRT2;
      const gSurf = (G_CONST * M * 1e24) / Math.pow(R * 1e6, 2);
      const ratio = vLaunch / Math.max(0.1, vOrb);

      planetGroup.rotation.y = t * 0.3;
      const pScale = 0.72 + (R / 12) * 0.6;
      planetGroup.scale.setScalar(pScale);
      const rSurf = 1.47 * pScale;
      const rStart = rSurf + 0.48;
      orbitRing.scale.set(rStart / 2.35, rStart / 2.35, 1);

      const isEscape = vLaunch >= vEsc - 0.05;
      const isSubOrbital = vLaunch < vOrb * 0.92;
      const phase = (t * 0.32) % 1;

      // Compute 3D trajectory path
      const evalPoint = (u: number, out: [number, number, number]) => {
        if (isEscape) {
          const s = u * 3.1;
          const ang = s * 0.65;
          const rad = rStart + Math.pow(s, 1.55) * (0.95 + (vLaunch - vEsc) * 0.16);
          out[0] = Math.cos(ang) * rad;
          out[1] = Math.sin(u * Math.PI * 0.6) * (rad - rStart) * 0.35;
          out[2] = Math.sin(ang) * rad;
        } else if (isSubOrbital) {
          const arcSpan = 0.65 + (vLaunch / Math.max(0.1, vOrb)) * 1.4;
          const ang = u * arcSpan;
          const peak = rStart + Math.sin(u * Math.PI) * (0.45 + (vLaunch / Math.max(0.1, vOrb)) * 1.45);
          out[0] = Math.cos(ang) * peak;
          out[1] = Math.sin(u * Math.PI) * 0.4;
          out[2] = Math.sin(ang) * peak;
        } else {
          const ecc = Math.min(0.62, Math.max(0, (ratio * ratio) - 1));
          const ang = u * Math.PI * 2;
          const rad = (rStart * (1 + ecc)) / (1 + ecc * Math.cos(ang));
          out[0] = Math.cos(ang) * rad;
          out[1] = Math.sin(ang) * rad * 0.16;
          out[2] = Math.sin(ang) * rad;
        }
      };

      const pt: [number, number, number] = [0, 0, 0];
      for (let i = 0; i < TRAIL_N; i++) {
        const u = (i / (TRAIL_N - 1)) * (isEscape || isSubOrbital ? phase : 1);
        evalPoint(u, pt);
        trailPos[i * 3] = pt[0];
        trailPos[i * 3 + 1] = pt[1];
        trailPos[i * 3 + 2] = pt[2];
      }
      trailGeo.attributes.position.needsUpdate = true;

      const curPt: [number, number, number] = [0, 0, 0];
      const nextPt: [number, number, number] = [0, 0, 0];
      evalPoint(phase, curPt);
      evalPoint(Math.min(1, phase + 0.015), nextPt);

      rocketGroup.position.set(curPt[0], curPt[1], curPt[2]);
      tmpDir.set(nextPt[0] - curPt[0], nextPt[1] - curPt[1], nextPt[2] - curPt[2]);
      if (tmpDir.lengthSq() > 1e-6) {
        tmpDir.normalize();
        tmpQuat.setFromUnitVectors(tmpUp, tmpDir);
        rocketGroup.quaternion.copy(tmpQuat);
      }

      vArrow.visible = showVectors;
      gArrow.visible = showVectors;
      vArrow.position.copy(rocketGroup.position);
      if (tmpDir.lengthSq() > 1e-6) vArrow.setDirection(tmpDir);
      vArrow.setLength(Math.min(2.2, 0.8 + (vLaunch / 20) * 1.4), 0.36, 0.18);

      gArrow.position.copy(rocketGroup.position);
      gArrow.setDirection(new THREE.Vector3(-curPt[0], -curPt[1], -curPt[2]).normalize());
      gArrow.setLength(1.2, 0.32, 0.16);

      const graphPoints: { x: number; y: number }[] = [];
      const graphSecondPoints: { x: number; y: number }[] = [];
      for (let rv = 1.5; rv <= 12.01; rv += 0.5) {
        const vo = Math.sqrt((G_CONST * M * 1e24) / (rv * 1e6)) / 1000;
        graphPoints.push({ x: Number(rv.toFixed(1)), y: vo * Math.SQRT2 });
        graphSecondPoints.push({ x: Number(rv.toFixed(1)), y: vo });
      }
      const regime = isEscape ? 'ESCAPED' : isSubOrbital ? 'SUB-ORBITAL' : Math.abs(vLaunch - vOrb) < 0.35 ? 'CIRCULAR' : 'ELLIPTICAL';

      return {
        substitutedFormula: `v_e = √(2GM/R) = ${vEsc.toFixed(2)} km/s  |  v_o = ${vOrb.toFixed(2)} km/s  |  v = ${vLaunch.toFixed(1)} km/s`,
        readouts: [
          { symbol: 'v_e', label: { en: 'Escape Velocity', hi: 'पलायन वेग (v_e)' }, value: vEsc.toFixed(2), unit: 'km/s', accent: 'force' },
          { symbol: 'v_o', label: { en: 'Orbital Velocity', hi: 'कक्षीय वेग (v_o)' }, value: vOrb.toFixed(2), unit: 'km/s', accent: 'velocity' },
          { symbol: 'g', label: { en: 'Surface Gravity', hi: 'पृष्ठ गुरुत्व (g)' }, value: gSurf.toFixed(2), unit: 'm/s²', accent: 'momentum' },
          { symbol: 'Path', label: { en: 'Trajectory Regime', hi: 'पथ की प्रकृति' }, value: regime, unit: '', accent: 'energy' },
        ],
        graphPoints,
        graphSecondPoints,
        graphCurrentPoint: { x: R, y: vEsc },
        graphLegend: { primary: 'v_e(R) Solid', secondary: 'v_o(R) Dashed' },
      };
    },
  };
}

// ============================================================================
// 9. 3D GAUSS'S LAW SPHERE & ELECTRIC DIPOLE TORQUE
// ============================================================================
function buildGaussDipoleRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Central enclosed charge +q
  const chargeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 16), pal.solidMat());
  group.add(chargeMesh);

  // Translucent Gaussian Sphere Shell with crisp latitude/longitude wireframe
  const gaussShell = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 18, 12),
    new THREE.MeshBasicMaterial({ color: pal.primaryHex, wireframe: true })
  );
  group.add(gaussShell);

  // 14 Radial E-field Arrows piercing through the Gaussian surface (Fibonacci sphere distribution)
  const radialArrows: THREE.ArrowHelper[] = [];
  const N_RAYS = 14;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N_RAYS; i++) {
    const y = 1 - (i / (N_RAYS - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = golden * i;
    const dir = new THREE.Vector3(Math.cos(phi) * rad, y, Math.sin(phi) * rad).normalize();
    const arr = new THREE.ArrowHelper(dir, dir.clone().multiplyScalar(0.55), 3.4, pal.midHex, 0.34, 0.16);
    group.add(arr);
    radialArrows.push(arr);
  }

  // Side Dipole Assembly (rod +q solid sphere, -q hollow/contrast sphere)
  const dipoleGroup = new THREE.Group();
  dipoleGroup.position.set(4.1, 0, 0);
  const dRod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.0, 12), pal.contrastMat());
  const dPlus = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 14), pal.solidMat());
  dPlus.position.y = 1.0;
  const dMinus = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 14), pal.contrastMat());
  dMinus.position.y = -1.0;
  addCrispEdges(dMinus, pal.edgeMat());
  dipoleGroup.add(dRod, dPlus, dMinus);
  group.add(dipoleGroup);

  const extEArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(2.8, -1.6, 0), 2.8, pal.primaryHex, 0.38, 0.18);
  group.add(extEArrow);

  const EPS0 = 8.854e-12;

  return {
    group,
    defaultCamPos: [2.2, 4.6, 8.6],
    defaultTarget: [1.0, 0, 0],
    update: (_dt, t, params, showVectors) => {
      const q = params.q ?? 8;
      const R = params.R ?? 1.2;
      const Eext = params.Eext ?? 8;
      const thetaDeg = params.theta ?? 60;

      const flux = (q * 1e-6) / EPS0 / 1e5; // ×10^5 N·m²/C
      const E_surf = (K_COULOMB * q * 1e-6) / (R * R) / 1000; // kN/C
      const pDipole = 2.0; // ×10^-6 C·m
      const radTheta = (thetaDeg * Math.PI) / 180;
      const torque = pDipole * 1e-6 * (Eext * 1000) * Math.sin(radTheta) * 1000; // mN·m
      const potEnergy = -pDipole * 1e-6 * (Eext * 1000) * Math.cos(radTheta) * 1000; // mJ

      chargeMesh.scale.setScalar(0.7 + (q / 20) * 0.6);
      gaussShell.scale.setScalar(0.55 + (R / 3.0) * 1.15);
      gaussShell.rotation.y = t * 0.22;

      radialArrows.forEach((arr) => {
        arr.visible = showVectors;
        arr.setLength(1.6 + (q / 20) * 2.2, 0.32, 0.15);
      });

      // Dipole rocks slightly around θ under torque
      const wobble = Math.sin(t * 2.5) * 0.08 * Math.sin(radTheta);
      dipoleGroup.rotation.z = -(Math.PI / 2 - radTheta + wobble);
      extEArrow.visible = showVectors;

      const graphPoints: { x: number; y: number }[] = [];
      const graphSecondPoints: { x: number; y: number }[] = [];
      for (let rv = 0.5; rv <= 3.01; rv += 0.1) {
        graphPoints.push({ x: Number(rv.toFixed(1)), y: (K_COULOMB * q * 1e-6) / (rv * rv) / 1000 });
        graphSecondPoints.push({ x: Number(rv.toFixed(1)), y: flux * 10 });
      }

      return {
        substitutedFormula: `Φ_E = (${q}μC)/ε₀ = ${flux.toFixed(2)}×10⁵ N·m²/C  |  τ = pE·sin(${thetaDeg}°) = ${torque.toFixed(2)} mN·m`,
        readouts: [
          { symbol: 'Φ_E', label: { en: 'Total Flux (Const!)', hi: 'कुल फ्लक्स (नियत!)' }, value: flux.toFixed(2), unit: '×10⁵ N·m²/C', accent: 'energy' },
          { symbol: 'E_R', label: { en: 'Field at Radius R', hi: 'त्रिज्या R पर क्षेत्र' }, value: E_surf.toFixed(1), unit: 'kN/C', accent: 'force' },
          { symbol: 'τ', label: { en: 'Dipole Torque', hi: 'द्विध्रुव बल-आघूर्ण' }, value: torque.toFixed(2), unit: 'mN·m', accent: 'momentum' },
          { symbol: 'U', label: { en: 'Dipole Energy', hi: 'द्विध्रुव ऊर्जा' }, value: potEnergy.toFixed(2), unit: 'mJ', accent: 'velocity' },
        ],
        graphPoints,
        graphSecondPoints,
        graphCurrentPoint: { x: R, y: E_surf },
        graphLegend: { primary: 'Surface Field E(R) Solid', secondary: 'Constant Flux Φ_E Dashed' },
      };
    },
  };
}

// ============================================================================
// 10. 3D HELICAL SOLENOID & MAGNETIC FIELD B = μ₀nI
// ============================================================================
function buildSolenoidWiresRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Helical solenoid tube built with TubeGeometry along a CatmullRomCurve3
  const coilPts: THREE.Vector3[] = [];
  const turns = 12;
  const samples = 220;
  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    const ang = u * turns * Math.PI * 2;
    coilPts.push(new THREE.Vector3(-3.8 + u * 7.6, Math.cos(ang) * 1.35, Math.sin(ang) * 1.35));
  }
  const helixCurve = new THREE.CatmullRomCurve3(coilPts);
  const coilMesh = new THREE.Mesh(
    new THREE.TubeGeometry(helixCurve, 220, 0.085, 8, false),
    pal.solidMat()
  );
  group.add(coilMesh);

  // Uniform interior magnetic field arrows parallel to solenoid axis (+X)
  const bArrows: THREE.ArrowHelper[] = [];
  const offsets: [number, number][] = [
    [0, 0],
    [0.55, 0],
    [-0.55, 0],
    [0, 0.55],
    [0, -0.55],
  ];
  offsets.forEach(([y, z]) => {
    const arr = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-4.2, y, z), 8.6, pal.primaryHex, 0.48, 0.22);
    group.add(arr);
    bArrows.push(arr);
  });

  // Animated current beads gliding around the helix
  const N_BEADS = 18;
  const beadGeo = new THREE.SphereGeometry(0.14, 12, 10);
  const beadMat = pal.contrastMat();
  const beads: THREE.Mesh[] = [];
  for (let i = 0; i < N_BEADS; i++) {
    const b = new THREE.Mesh(beadGeo, beadMat);
    addCrispEdges(b, pal.edgeMat());
    group.add(b);
    beads.push(b);
  }

  // Two parallel wires below the solenoid demonstrating F/L attraction/repulsion
  const wire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 6.2, 10), pal.solidMat());
  wire1.rotation.z = Math.PI / 2;
  const wire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 6.2, 10), pal.contrastMat());
  wire2.rotation.z = Math.PI / 2;
  addCrispEdges(wire2, pal.edgeMat());
  group.add(wire1, wire2);

  const wf1 = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 0.9, pal.primaryHex, 0.28, 0.14);
  const wf2 = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(), 0.9, pal.primaryHex, 0.28, 0.14);
  group.add(wf1, wf2);

  const MU0 = 4 * Math.PI * 1e-7;

  return {
    group,
    defaultCamPos: [4.8, 3.8, 7.6],
    defaultTarget: [0, -0.4, 0],
    update: (_dt, t, params, showVectors) => {
      const n = params.n ?? 800;
      const I = params.I ?? 5;
      const dCm = params.d ?? 4;
      const sameDir = params.sameDir ?? 1;

      const B_mT = MU0 * n * I * 1000;
      const forcePerLen_uN = ((MU0 * I * I) / (2 * Math.PI * (dCm / 100))) * 1e6;

      // Move current beads along helix curve
      for (let i = 0; i < N_BEADS; i++) {
        const u = (i / N_BEADS + t * (0.04 + I * 0.012)) % 1;
        const p = helixCurve.getPointAt(u);
        beads[i].position.copy(p);
      }

      const bLen = Math.min(9.6, 5.5 + (B_mT / 35) * 4.0);
      bArrows.forEach((arr) => {
        arr.visible = showVectors;
        arr.setLength(bLen, 0.45, 0.22);
      });

      const zSep = 0.45 + (dCm / 15) * 1.1;
      wire1.position.set(0, -2.05, -zSep);
      wire2.position.set(0, -2.05, zSep);

      const dirSign = sameDir >= 0 ? 1 : -1;
      wf1.visible = showVectors;
      wf2.visible = showVectors;
      wf1.position.set(0, -2.05, -zSep);
      wf1.setDirection(new THREE.Vector3(0, 0, dirSign));
      wf2.position.set(0, -2.05, zSep);
      wf2.setDirection(new THREE.Vector3(0, 0, -dirSign));

      const graphPoints: { x: number; y: number }[] = [];
      for (let iv = 0.5; iv <= 15.01; iv += 0.5) {
        graphPoints.push({ x: Number(iv.toFixed(1)), y: MU0 * n * iv * 1000 });
      }

      return {
        substitutedFormula: `B = μ₀·(${n})·(${I}A) = ${B_mT.toFixed(2)} mT  |  F/L = ${forcePerLen_uN.toFixed(1)} μN/m`,
        readouts: [
          { symbol: 'B', label: { en: 'Solenoid Field', hi: 'परिनालिका क्षेत्र (B)' }, value: B_mT.toFixed(2), unit: 'mT', accent: 'force' },
          { symbol: 'F/L', label: { en: 'Wire Force/m', hi: 'प्रति मीटर बल' }, value: forcePerLen_uN.toFixed(1), unit: 'μN/m', accent: 'momentum' },
          { symbol: 'Wires', label: { en: 'Wire Force Dir', hi: 'तारों की प्रकृति' }, value: sameDir >= 0 ? 'ATTRACT' : 'REPEL', unit: '', accent: 'velocity' },
          { symbol: 'n·I', label: { en: 'Ampere-Turns/m', hi: 'एम्पीयर-फेरे/m' }, value: (n * I).toFixed(0), unit: 'A/m', accent: 'energy' },
        ],
        graphPoints,
        graphCurrentPoint: { x: I, y: B_mT },
        graphLegend: { primary: 'Solenoid Field B(I) = μ₀·n·I' },
      };
    },
  };
}

function buildRigForSim(simId: string, theme: ThemeMode): SceneRig {
  switch (simId) {
    case 'em-waves':
      return buildEMWavesRig(theme);
    case 'atoms':
      return buildAtomsRig(theme);
    case 'emi':
      return buildEMIRig(theme);
    case 'lorentz-force':
      return buildLorentzRig(theme);
    case 'gravitation':
      return buildGravitationRig(theme);
    case 'angular-momentum':
      return buildAngularMomentumRig(theme);
    case 'coulombs-law':
      return buildCoulombRig(theme);
    case 'escape-velocity':
      return buildEscapeVelocityRig(theme);
    case 'gauss-dipole':
      return buildGaussDipoleRig(theme);
    case 'solenoid-wires':
      return buildSolenoidWiresRig(theme);
    case 'eye-defects':
      return buildEyeDefectsRig(theme);
    case 'thin-lens':
      return buildThinLensRig(theme);
    case 'snell-prism-tir':
      return buildSnellPrismTirRig(theme);
    case 'microscope-telescope':
      return buildMicroscopeTelescopeRig(theme);
    case 'gravity-variation':
      return buildGravityVariationRig(theme);
    case 'communication-systems':
      return buildCommunicationSystemsRig(theme);
    case 'organ-pipes-beats':
      return buildOrganPipesBeatsRig(theme);
    case 'doppler-effect':
      return buildDopplerEffectRig(theme);
    case 'simple-pendulum':
      return buildSimplePendulumRig(theme);
    case 'transformer':
      return buildTransformerRig(theme);
    case 'nuclei':
      return buildNucleiRig(theme);
    default:
      return buildEMWavesRig(theme);
  }
}

export function Simulation3DCanvas({
  simulation,
  params,
  isPlaying,
  simSpeed,
  showVectors,
  showGrid,
  theme,
  language,
  resetToken,
  stepToken,
  isDrawing,
  drawTool,
  drawTone,
  strokes,
  onAddStroke,
  onTelemetry,
  tall = false,
}: Simulation3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const defaultPoseRef = useRef<{ pos: [number, number, number]; target: [number, number, number] }>({
    pos: [6, 4, 7],
    target: [0, 0, 0],
  });
  const simTimeRef = useRef(0);
  const [contextLost, setContextLost] = useState(false);

  const propsRef = useRef({
    params,
    isPlaying,
    simSpeed,
    showVectors,
    showGrid,
    onTelemetry,
  });
  propsRef.current = { params, isPlaying, simSpeed, showVectors, showGrid, onTelemetry };

  useEffect(() => {
    simTimeRef.current = 0;
  }, [simulation.id, resetToken]);

  useEffect(() => {
    if (stepToken > 0) {
      simTimeRef.current += (1 / 25) * propsRef.current.simSpeed;
    }
  }, [stepToken]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    setContextLost(false);

    const width = Math.max(300, host.clientWidth || 720);
    const height = Math.max(260, host.clientHeight || 420);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    host.appendChild(renderer.domElement);

    // Software WebGL detection (avoids saturating SwiftShader/llvmpipe)
    const gl = renderer.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|ANGLE.*Software|Microsoft Basic Render/i.test(rendererStr);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => setContextLost(false);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const pal = makePalette3D(theme);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(pal.bg);

    // Studio IBL lighting via RoomEnvironment + directional key/rim for crisp B&W depth
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, theme === 'dark' ? 1.15 : 1.0);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.45);
    keyLight.position.set(8, 12, 9);
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.7);
    rimLight.position.set(-7, -4, -8);
    scene.add(hemiLight, keyLight, rimLight);

    const gridHelper = new THREE.GridHelper(14, 14, pal.gridMain, pal.gridSub);
    gridHelper.position.y = -2.4;
    scene.add(gridHelper);

    const rig = buildRigForSim(simulation.id, theme);
    scene.add(rig.group);
    defaultPoseRef.current = { pos: rig.defaultCamPos, target: rig.defaultTarget };

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(...rig.defaultCamPos);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4;
    controls.maxDistance = 22;
    controls.target.set(...rig.defaultTarget);
    controls.update();
    controlsRef.current = controls;

    const resizeObserver = new ResizeObserver(() => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    });
    resizeObserver.observe(host);

    let disposed = false;
    let rafId = 0;
    let timerId = 0;
    let lastTime = performance.now();
    let lastTelemetryEmit = 0;

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const rawDt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;

      const p = propsRef.current;
      const dt = p.isPlaying ? rawDt * p.simSpeed : 0;
      simTimeRef.current += dt;

      gridHelper.visible = p.showGrid;
      const telemetry = rig.update(dt, simTimeRef.current, p.params, p.showVectors);
      syncPhysicsAudioFrame(
        simulation.id,
        simTimeRef.current,
        dt,
        p.params,
        p.isPlaying,
        p.simSpeed
      );

      controls.update();
      renderer.render(scene, camera);

      if (now - lastTelemetryEmit >= 70) {
        lastTelemetryEmit = now;
        p.onTelemetry(telemetry);
      }

      if (isSoftwareGl) {
        timerId = window.setTimeout(() => {
          rafId = requestAnimationFrame(tick);
        }, 32);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      stopPhysicsAudio();
      cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      disposeObject3D(scene);
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [simulation.id, theme]);

  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(...defaultPoseRef.current.pos);
    controlsRef.current.target.set(...defaultPoseRef.current.target);
    controlsRef.current.update();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black ${
        tall ? 'h-[54vh] min-h-[400px] max-h-[660px]' : 'h-[390px] lg:h-[440px]'
      }`}
    >
      <div ref={hostRef} className="w-full h-full" />

      {/* Minimal Pure B&W 3D Orbit Hint + Reset Camera (Solid background, zero backdrop-filter over WebGL) */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none px-2.5 py-1 rounded border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-mono text-xs font-bold">
        3D · {language === 'hi' ? 'घुमाने के लिए खींचें · ज़ूम करें' : 'Drag to Rotate · Scroll to Zoom'}
      </div>

      <button
        type="button"
        onClick={handleResetCamera}
        className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-mono text-xs font-bold transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{getBilingualPrimary(UI_TEXT.resetCamera, language)}</span>
      </button>

      {contextLost && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white dark:bg-black text-black dark:text-white font-mono text-sm font-bold p-4 text-center">
          3D WebGL context interrupted — switch to 2D Diagram or reload.
        </div>
      )}

      <ChalkboardOverlay
        active={isDrawing}
        tool={drawTool}
        tone={drawTone}
        theme={theme}
        strokes={strokes}
        onAddStroke={onAddStroke}
      />
    </div>
  );
}
