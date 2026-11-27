import * as THREE from 'three';
import { ThemeMode } from '../../types/physics';
import {
  addCrispEdges,
  createReusableLine,
  makePalette3D,
  Palette3D,
  SceneRig,
  setLinePoints,
} from './rigHelpers';

export function buildWavesElectricity3DRig(simId: string, theme: ThemeMode): SceneRig | null {
  const p = makePalette3D(theme);
  switch (simId) {
    case 'shm-spring':
      return buildShmSpring3D(p);
    case 'wave-superposition':
      return buildWaveSuperposition3D(p);
    case 'wave-speed-basic':
      return buildWaveSpeedBasic3D(p);
    case 'capacitance':
      return buildCapacitance3D(p);
    case 'electric-potential':
      return buildElectricPotential3D(p);
    case 'ohms-law':
      return buildOhmsLaw3D(p);
    case 'wheatstone-bridge':
      return buildWheatstoneBridge3D(p);
    case 'charge-current-power':
      return buildChargeCurrentPower3D(p);
    case 'potentiometer-cells':
      return buildPotentiometer3D(p);
    case 'magnetism-matter':
      return buildMagnetismMatter3D(p);
    case 'ac-circuits':
      return buildAcCircuits3D(p);
    default:
      return null;
  }
}

function buildShmSpring3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const wall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.0, 2.2), p.contrastMat());
  addCrispEdges(wall, p.edgeMat());
  wall.position.set(-4.5, 0.3, 0);
  group.add(wall);

  const springLine = createReusableLine(80, p.edgeMat());
  group.add(springLine);

  const massBlock = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 1.3), p.solidMat());
  addCrispEdges(massBlock, p.edgeMat());
  group.add(massBlock);

  const forceArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(), 1.2, p.primaryHex, 0.3, 0.18);
  group.add(forceArrow);

  return {
    group,
    defaultCamPos: [0.5, 3.0, 8.8],
    defaultTarget: [0, 0.3, 0],
    update: (_dt, t, params, showVectors) => {
      const k = Math.max(1, params.k ?? 25);
      const m = Math.max(0.2, params.m ?? 2);
      const A = Math.max(0.2, params.A ?? 1.5);
      const c = Math.max(0, params.c ?? 0.1);
      const omega = Math.sqrt(k / m);
      const T = (2 * Math.PI) / omega;

      const damp = Math.exp(-(c / (2 * m)) * (t % 14));
      const xDisp = A * damp * Math.cos(omega * t);
      const F = -k * xDisp;
      const bx = 0.2 + xDisp * 1.4;
      massBlock.position.set(bx, 0.3, 0);

      const coords: [number, number, number][] = [];
      for (let i = 0; i < 80; i++) {
        const u = i / 79;
        const sx = -4.3 + u * (bx - 0.65 + 4.3);
        const angle = u * Math.PI * 16;
        const rCoil = i === 0 || i === 79 ? 0 : 0.38;
        coords.push([sx, 0.3 + Math.sin(angle) * rCoil, Math.cos(angle) * rCoil]);
      }
      setLinePoints(springLine, coords);

      forceArrow.visible = showVectors && Math.abs(F) > 0.5;
      forceArrow.position.set(bx, 1.2, 0);
      forceArrow.setDirection(new THREE.Vector3(F >= 0 ? 1 : -1, 0, 0));
      forceArrow.setLength(Math.min(2.2, 0.3 + Math.abs(F) * 0.03), 0.3, 0.18);

      const pts: { x: number; y: number }[] = [];
      for (let tt = 0; tt <= 6; tt += 0.15) {
        pts.push({ x: tt, y: A * Math.exp(-(c / (2 * m)) * tt) * Math.cos(omega * tt) });
      }
      return {
        substitutedFormula: `T = 2π√(${m}/${k}) = ${T.toFixed(2)} s | x = ${xDisp.toFixed(2)} m`,
        readouts: [
          { symbol: 'T', label: { en: 'Time Period', hi: 'आवर्तकाल' }, value: T.toFixed(2), unit: 's', accent: 'velocity' },
          { symbol: 'ω', label: { en: 'Angular Freq', hi: 'कोणीय आवृत्ति' }, value: omega.toFixed(2), unit: 'rad/s', accent: 'momentum' },
          { symbol: 'F', label: { en: 'Restoring Force', hi: 'प्रत्यानयन बल' }, value: F.toFixed(1), unit: 'N', accent: 'force' },
          { symbol: 'E', label: { en: 'Total Energy', hi: 'कुल ऊर्जा' }, value: (0.5 * k * A * A).toFixed(1), unit: 'J', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: t % 6, y: xDisp },
      };
    },
    getStrobePos: () => massBlock.position.clone(),
  };
}

function buildWaveSuperposition3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const w1 = createReusableLine(80, p.mutedLineMat());
  const w2 = createReusableLine(80, p.dashedLineMat());
  const wSum = createReusableLine(80, p.edgeMat());
  group.add(w1, w2, wSum);

  const beads: THREE.Mesh[] = [];
  for (let i = 0; i < 20; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), p.solidMat());
    group.add(b);
    beads.push(b);
  }

  return {
    group,
    defaultCamPos: [0, 3.0, 9.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params) => {
      const f = Math.max(0.2, params.f ?? 1.5);
      const lambda = Math.max(0.5, params.lambda ?? 3.0);
      const A = Math.max(0.2, params.A ?? 1.0);
      const phaseDeg = params.phase ?? 60;
      const phi = (phaseDeg * Math.PI) / 180;
      const A_res = 2 * A * Math.abs(Math.cos(phi / 2));

      const k = (2 * Math.PI) / lambda;
      const w = 2 * Math.PI * f;
      const c1: [number, number, number][] = [];
      const c2: [number, number, number][] = [];
      const cS: [number, number, number][] = [];
      const pts: { x: number; y: number }[] = [];

      for (let i = 0; i < 80; i++) {
        const x = -5 + (i / 79) * 10;
        const y1 = A * Math.sin(k * x - w * t);
        const y2 = A * Math.sin(k * x - w * t + phi);
        c1.push([x, y1, -1.2]);
        c2.push([x, y2, 1.2]);
        cS.push([x, y1 + y2, 0]);
        pts.push({ x, y: y1 + y2 });
      }
      setLinePoints(w1, c1);
      setLinePoints(w2, c2, true);
      setLinePoints(wSum, cS);

      beads.forEach((b, idx) => {
        const x = -4.8 + (idx / 19) * 9.6;
        const y = A * Math.sin(k * x - w * t) + A * Math.sin(k * x - w * t + phi);
        b.position.set(x, y, 0);
      });

      return {
        substitutedFormula: `A_res = 2(${A})cos(${(phaseDeg / 2).toFixed(0)}°) = ${A_res.toFixed(2)} m`,
        readouts: [
          { symbol: 'A_res', label: { en: 'Resultant Amp', hi: 'परिणामी आयाम' }, value: A_res.toFixed(2), unit: 'm', accent: 'force' },
          { symbol: 'φ', label: { en: 'Phase Diff', hi: 'कलांतर' }, value: phaseDeg.toFixed(0), unit: '°', accent: 'momentum' },
          { symbol: 'v', label: { en: 'Wave Speed', hi: 'तरंग चाल' }, value: (f * lambda).toFixed(2), unit: 'm/s', accent: 'velocity' },
          { symbol: 'Type', label: { en: 'Interference', hi: 'व्यतिकरण' }, value: A_res > 1.5 * A ? 'CONSTRUCT' : A_res < 0.4 * A ? 'DESTRUCT' : 'PARTIAL', unit: '', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: 0, y: cS[40][1] },
      };
    },
  };
}

function buildWaveSpeedBasic3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const stringLine = createReusableLine(80, p.edgeMat());
  group.add(stringLine);
  const pegL = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.2, 14), p.solidMat());
  const pegR = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.2, 14), p.solidMat());
  pegL.position.set(-5, 0, 0);
  pegR.position.set(5, 0, 0);
  group.add(pegL, pegR);

  const marker = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 18), p.solidMat());
  group.add(marker);

  return {
    group,
    defaultCamPos: [0, 2.6, 9.2],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params) => {
      const f = Math.max(0.2, params.f ?? 2.0);
      const lam = Math.max(0.5, params.lam ?? 2.5);
      const amp = Math.max(0.2, params.amp ?? 1.0);
      const v = f * lam;

      const coords: [number, number, number][] = [];
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < 80; i++) {
        const x = -5 + (i / 79) * 10;
        const y = amp * Math.sin((2 * Math.PI * x) / lam - 2 * Math.PI * f * t);
        coords.push([x, y, 0]);
        pts.push({ x, y });
      }
      setLinePoints(stringLine, coords);
      marker.position.set(0, amp * Math.sin(-2 * Math.PI * f * t), 0);

      return {
        substitutedFormula: `v = fλ = (${f})(${lam}) = ${v.toFixed(2)} m/s`,
        readouts: [
          { symbol: 'v', label: { en: 'Wave Speed', hi: 'तरंग वेग' }, value: v.toFixed(2), unit: 'm/s', accent: 'velocity' },
          { symbol: 'T', label: { en: 'Time Period', hi: 'आवर्तकाल' }, value: (1 / f).toFixed(2), unit: 's', accent: 'momentum' },
          { symbol: 'λ', label: { en: 'Wavelength', hi: 'तरंगदैर्ध्य' }, value: lam.toFixed(2), unit: 'm', accent: 'force' },
          { symbol: 'f', label: { en: 'Frequency', hi: 'आवृत्ति' }, value: f.toFixed(2), unit: 'Hz', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: 0, y: marker.position.y },
      };
    },
  };
}

function buildCapacitance3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const plateL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.2, 3.2), p.solidMat());
  const plateR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.2, 3.2), p.contrastMat());
  addCrispEdges(plateL, p.edgeMat());
  addCrispEdges(plateR, p.edgeMat());
  const dielectric = new THREE.Mesh(new THREE.BoxGeometry(1.0, 3.0, 3.0), p.glassMat(0.32));
  addCrispEdges(dielectric, p.edgeMat());
  group.add(plateL, plateR, dielectric);

  const eArrows: THREE.ArrowHelper[] = [];
  for (let i = -1; i <= 1; i++) {
    const arr = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-0.8, i * 0.9, 0), 1.6, p.primaryHex, 0.28, 0.16);
    group.add(arr);
    eArrows.push(arr);
  }

  return {
    group,
    defaultCamPos: [3.2, 2.8, 7.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, _t, params, showVectors) => {
      const V = Math.max(1, params.V ?? 12);
      const d = Math.max(1, params.d ?? 5); // mm
      const A = Math.max(10, params.A ?? 100); // cm²
      const kappa = Math.max(1, params.kappa ?? 2);
      const eps0 = 8.854e-12;
      const C_pF = (kappa * eps0 * (A * 1e-4)) / (d * 1e-3) * 1e12;
      const Q_nC = (C_pF * V) / 1000;
      const U_nJ = 0.5 * C_pF * V * V / 1000;
      const E_kVm = V / (d * 1e-3) / 1000;

      const halfGap = 0.6 + (d / 15) * 2.0;
      const pScale = 0.7 + Math.sqrt(A / 200) * 0.6;
      plateL.position.x = -halfGap;
      plateR.position.x = halfGap;
      plateL.scale.set(1, pScale, pScale);
      plateR.scale.set(1, pScale, pScale);
      dielectric.visible = kappa > 1.05;
      dielectric.scale.set(Math.max(0.2, halfGap * 1.8), pScale * 0.95, pScale * 0.95);

      eArrows.forEach((arr) => {
        arr.visible = showVectors;
        arr.position.x = -halfGap + 0.2;
        arr.setLength(Math.max(0.4, halfGap * 2 - 0.4), 0.28, 0.16);
      });

      const pts: { x: number; y: number }[] = [];
      for (let dd = 1; dd <= 15; dd += 1) {
        pts.push({ x: dd, y: ((kappa * eps0 * A * 1e-4) / (dd * 1e-3)) * 1e12 });
      }
      return {
        substitutedFormula: `C = κε₀A/d = ${C_pF.toFixed(1)} pF | U = ½CV² = ${U_nJ.toFixed(2)} nJ`,
        readouts: [
          { symbol: 'C', label: { en: 'Capacitance', hi: 'धारिता' }, value: C_pF.toFixed(1), unit: 'pF', accent: 'velocity' },
          { symbol: 'Q', label: { en: 'Stored Charge', hi: 'संचित आवेश' }, value: Q_nC.toFixed(2), unit: 'nC', accent: 'momentum' },
          { symbol: 'U', label: { en: 'Stored Energy', hi: 'संचित ऊर्जा' }, value: U_nJ.toFixed(2), unit: 'nJ', accent: 'energy' },
          { symbol: 'E', label: { en: 'Electric Field', hi: 'विद्युत क्षेत्र' }, value: E_kVm.toFixed(1), unit: 'kV/m', accent: 'force' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: d, y: C_pF },
      };
    },
  };
}

function buildElectricPotential3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const source = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), p.solidMat());
  group.add(source);

  const shells = [1.4, 2.4, 3.5].map((rad) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.03, 8, 56), p.matteMidMat());
    m.rotation.x = Math.PI / 2;
    group.add(m);
    return m;
  });

  const probe = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 18), p.contrastMat());
  addCrispEdges(probe, p.edgeMat());
  group.add(probe);

  return {
    group,
    defaultCamPos: [0, 5.2, 7.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params) => {
      const q = params.q ?? 5; // µC
      const r = Math.max(0.5, params.r ?? 2.0);
      const q0 = params.q0 ?? 2; // µC
      const k = 8.99e9;
      const V_kV = ((k * q * 1e-6) / r) / 1000;
      const U_mJ = (k * q * q0 * 1e-12) / r * 1000;
      const E_kVm = ((k * Math.abs(q) * 1e-6) / (r * r)) / 1000;

      const visR = 0.8 + (r / 6) * 3.0;
      probe.position.set(visR * Math.cos(t * 0.6), 0, visR * Math.sin(t * 0.6));
      shells.forEach((s, i) => {
        s.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.03);
      });

      const pts: { x: number; y: number }[] = [];
      for (let rr = 0.5; rr <= 6.0; rr += 0.25) {
        pts.push({ x: rr, y: ((k * q * 1e-6) / rr) / 1000 });
      }
      return {
        substitutedFormula: `V = kq/r = ${V_kV.toFixed(1)} kV | U = q₀V = ${U_mJ.toFixed(2)} mJ`,
        readouts: [
          { symbol: 'V', label: { en: 'Potential V', hi: 'विद्युत विभव' }, value: V_kV.toFixed(1), unit: 'kV', accent: 'velocity' },
          { symbol: 'U', label: { en: 'Potential Energy', hi: 'स्थितिज ऊर्जा' }, value: U_mJ.toFixed(2), unit: 'mJ', accent: 'energy' },
          { symbol: 'E', label: { en: 'Field Magnitude', hi: 'विद्युत क्षेत्र' }, value: E_kVm.toFixed(1), unit: 'kV/m', accent: 'force' },
          { symbol: 'r', label: { en: 'Distance r', hi: 'दूरी r' }, value: r.toFixed(2), unit: 'm', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: r, y: V_kV },
      };
    },
  };
}

function buildOhmsLaw3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const loopWire = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.08, 12, 64), p.matteMidMat());
  loopWire.rotation.x = Math.PI / 2;
  group.add(loopWire);

  const battery = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.4, 20), p.solidMat());
  battery.position.set(-2.6, 0, 0);
  addCrispEdges(battery, p.edgeMat());
  const resistor = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 2.0), p.contrastMat());
  resistor.position.set(2.6, 0, 0);
  addCrispEdges(resistor, p.edgeMat());
  group.add(battery, resistor);

  const electrons: THREE.Mesh[] = [];
  for (let i = 0; i < 16; i++) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), p.solidMat());
    group.add(e);
    electrons.push(e);
  }

  let phase = 0;
  return {
    group,
    defaultCamPos: [0, 5.2, 6.8],
    defaultTarget: [0, 0, 0],
    update: (dt, _t, params) => {
      const V = Math.max(0.5, params.V ?? 12);
      const R = Math.max(0.5, params.R ?? 6);
      const I = V / R;
      const P = V * I;

      phase += Math.min(8, I * 0.45) * dt;
      electrons.forEach((e, i) => {
        const ang = phase + (i / 16) * Math.PI * 2;
        e.position.set(Math.cos(ang) * 2.6, 0.16, Math.sin(ang) * 2.6);
      });

      const pts: { x: number; y: number }[] = [];
      for (let vv = 0; vv <= 24; vv += 2) {
        pts.push({ x: vv, y: vv / R });
      }
      return {
        substitutedFormula: `I = V/R = ${V}/${R} = ${I.toFixed(2)} A | P = ${P.toFixed(1)} W`,
        readouts: [
          { symbol: 'I', label: { en: 'Current', hi: 'विद्युत धारा' }, value: I.toFixed(2), unit: 'A', accent: 'velocity' },
          { symbol: 'P', label: { en: 'Power Dissipated', hi: 'शक्ति क्षय' }, value: P.toFixed(1), unit: 'W', accent: 'energy' },
          { symbol: 'V', label: { en: 'Voltage', hi: 'विभवांतर' }, value: V.toFixed(1), unit: 'V', accent: 'force' },
          { symbol: 'R', label: { en: 'Resistance', hi: 'प्रतिरोध' }, value: R.toFixed(1), unit: 'Ω', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: V, y: I },
      };
    },
  };
}

function buildWheatstoneBridge3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const diamond = createReusableLine(5, p.edgeMat());
  setLinePoints(diamond, [
    [-3, 0, 0],
    [0, 0, -2.6],
    [3, 0, 0],
    [0, 0, 2.6],
    [-3, 0, 0],
  ]);
  group.add(diamond);

  const galvLine = createReusableLine(2, p.dashedLineMat());
  setLinePoints(galvLine, [[0, 0, -2.6], [0, 0, 2.6]], true);
  group.add(galvLine);

  const armPositions: [number, number, number][] = [
    [-1.5, 0.25, -1.3],
    [1.5, 0.25, -1.3],
    [-1.5, 0.25, 1.3],
    [1.5, 0.25, 1.3],
  ];
  const armBoxes = armPositions.map((pos) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.5), p.contrastMat());
    addCrispEdges(b, p.edgeMat());
    b.position.set(...pos);
    group.add(b);
    return b;
  });

  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 1.6), p.solidMat());
  needle.position.set(0, 0.6, 0);
  group.add(needle);

  return {
    group,
    defaultCamPos: [0, 5.4, 6.8],
    defaultTarget: [0, 0, 0],
    update: (_dt, _t, params) => {
      const R1 = Math.max(1, params.R1 ?? 10);
      const R2 = Math.max(1, params.R2 ?? 20);
      const R3 = Math.max(1, params.R3 ?? 15);
      const R4 = Math.max(1, params.R4 ?? 30);
      const E = Math.max(1, params.E ?? 12);

      const VB = (E * R2) / (R1 + R2);
      const VD = (E * R4) / (R3 + R4);
      const Vbd = VB - VD;
      const ratioDiff = R1 * R4 - R2 * R3;
      const balanced = Math.abs(Vbd) < 0.15;

      needle.rotation.y = Math.max(-1.2, Math.min(1.2, Vbd * 0.25));
      [R1, R2, R3, R4].forEach((r, i) => {
        armBoxes[i].scale.y = 0.6 + Math.min(1.6, r / 35);
      });

      const pts: { x: number; y: number }[] = [];
      for (let r4 = 5; r4 <= 60; r4 += 3) {
        pts.push({ x: r4, y: (E * R2) / (R1 + R2) - (E * r4) / (R3 + r4) });
      }
      return {
        substitutedFormula: `V_BD = ${Vbd.toFixed(2)} V | R₁R₄ − R₂R₃ = ${ratioDiff.toFixed(0)}`,
        readouts: [
          { symbol: 'V_BD', label: { en: 'Bridge Imbalance', hi: 'सेतु विभवांतर' }, value: Vbd.toFixed(2), unit: 'V', accent: 'force' },
          { symbol: 'State', label: { en: 'Null Point', hi: 'संतुलन स्थिति' }, value: balanced ? 'BALANCED' : 'DEFLECT', unit: '', accent: 'energy' },
          { symbol: 'R₁/R₂', label: { en: 'Top Ratio', hi: 'ऊपरी अनुपात' }, value: (R1 / R2).toFixed(2), unit: '', accent: 'velocity' },
          { symbol: 'R₃/R₄', label: { en: 'Bottom Ratio', hi: 'निचला अनुपात' }, value: (R3 / R4).toFixed(2), unit: '', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: R4, y: Vbd },
      };
    },
  };
}

function buildChargeCurrentPower3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const coil = new THREE.Mesh(new THREE.TorusKnotGeometry(1.4, 0.14, 72, 12, 2, 3), p.solidMat());
  group.add(coil);

  const meterBar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.8), p.contrastMat());
  addCrispEdges(meterBar, p.edgeMat());
  meterBar.position.set(3.2, -1, 0);
  group.add(meterBar);

  return {
    group,
    defaultCamPos: [2.2, 2.8, 7.8],
    defaultTarget: [0.5, 0, 0],
    update: (dt, _t, params) => {
      const I = Math.max(0.2, params.I ?? 4);
      const R = Math.max(1, params.R ?? 10);
      const tSec = Math.max(1, params.t ?? 20);
      const Q = I * tSec;
      const P = I * I * R;
      const H = P * tSec;

      coil.rotation.y += Math.min(5, I * 0.35) * dt;
      const barH = Math.min(3.5, Math.max(0.3, H / 1500));
      meterBar.scale.y = barH;
      meterBar.position.y = -1.6 + barH / 2;

      const pts: { x: number; y: number }[] = [];
      for (let ii = 0; ii <= 12; ii += 0.5) {
        pts.push({ x: ii, y: ii * ii * R * tSec });
      }
      return {
        substitutedFormula: `H = I²Rt = (${I}²)(${R})(${tSec}) = ${H.toFixed(0)} J`,
        readouts: [
          { symbol: 'H', label: { en: 'Joule Heat', hi: 'जूल ऊष्मा' }, value: H.toFixed(0), unit: 'J', accent: 'energy' },
          { symbol: 'P', label: { en: 'Electric Power', hi: 'विद्युत शक्ति' }, value: P.toFixed(1), unit: 'W', accent: 'force' },
          { symbol: 'Q', label: { en: 'Total Charge', hi: 'कुल आवेश' }, value: Q.toFixed(1), unit: 'C', accent: 'momentum' },
          { symbol: 'V', label: { en: 'Voltage Drop', hi: 'विभव पतन' }, value: (I * R).toFixed(1), unit: 'V', accent: 'velocity' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: I, y: H },
      };
    },
  };
}

function buildPotentiometer3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.25, 2.8), p.contrastMat());
  addCrispEdges(board, p.edgeMat());
  group.add(board);

  const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 8.6, 12), p.solidMat());
  wire.rotation.z = Math.PI / 2;
  wire.position.y = 0.24;
  group.add(wire);

  const jockey = new THREE.Mesh(new THREE.ConeGeometry(0.24, 1.1, 14), p.solidMat());
  jockey.rotation.x = Math.PI;
  addCrispEdges(jockey, p.edgeMat());
  group.add(jockey);

  return {
    group,
    defaultCamPos: [0, 3.8, 8.4],
    defaultTarget: [0, 0.2, 0],
    update: (_dt, _t, params) => {
      const Vwire = Math.max(2, params.Vwire ?? 6);
      const Ecell = Math.max(0.5, params.Ecell ?? 2.4);
      const rInt = Math.max(0.1, params.rInt ?? 1.5);
      const Rext = Math.max(0.5, params.Rext ?? 6);
      const L = 100; // cm
      const kGrad = Vwire / L;
      const l1 = Math.min(L, Ecell / kGrad);
      const Vterm = (Ecell * Rext) / (Rext + rInt);
      const l2 = Math.min(L, Vterm / kGrad);

      jockey.position.set(-4.3 + (l2 / 100) * 8.6, 0.85, 0);

      const pts: { x: number; y: number }[] = [];
      for (let rr = 1; rr <= 20; rr += 1) {
        pts.push({ x: rr, y: ((Ecell * rr) / (rr + rInt)) / kGrad });
      }
      return {
        substitutedFormula: `l₁ = ${l1.toFixed(1)} cm | l₂ = ${l2.toFixed(1)} cm | r = R(l₁−l₂)/l₂ = ${rInt.toFixed(2)} Ω`,
        readouts: [
          { symbol: 'l₁', label: { en: 'Open Balance l₁', hi: 'खुला संतुलन l₁' }, value: l1.toFixed(1), unit: 'cm', accent: 'velocity' },
          { symbol: 'l₂', label: { en: 'Loaded Balance l₂', hi: 'लोड संतुलन l₂' }, value: l2.toFixed(1), unit: 'cm', accent: 'momentum' },
          { symbol: 'k', label: { en: 'Potential Grad', hi: 'विभव प्रवणता' }, value: (kGrad * 100).toFixed(2), unit: 'V/m', accent: 'force' },
          { symbol: 'V', label: { en: 'Terminal Voltage', hi: 'टर्मिनल वोल्टता' }, value: Vterm.toFixed(2), unit: 'V', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: Rext, y: l2 },
      };
    },
  };
}

function buildMagnetismMatter3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const fieldArrows: THREE.ArrowHelper[] = [];
  for (let i = -1; i <= 1; i++) {
    const a = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-4, i * 1.4, -1.5), 8.0, p.midHex, 0.4, 0.22);
    group.add(a);
    fieldArrows.push(a);
  }

  const magnet = new THREE.Group();
  const north = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.65, 0.65), p.solidMat());
  north.position.x = 0.9;
  const south = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.65, 0.65), p.contrastMat());
  south.position.x = -0.9;
  addCrispEdges(north, p.edgeMat());
  addCrispEdges(south, p.edgeMat());
  magnet.add(north, south);
  group.add(magnet);

  return {
    group,
    defaultCamPos: [0, 4.8, 7.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params, showVectors) => {
      const M = Math.max(0.5, params.M ?? 4);
      const B = Math.max(0.05, params.B ?? 0.5);
      const theta0 = params.theta0 ?? 45;
      const rad0 = (theta0 * Math.PI) / 180;
      const omega = Math.sqrt(M * B * 2.5);
      const theta = rad0 * Math.cos(omega * t);
      const tau = M * B * Math.sin(Math.abs(rad0));
      const U = -M * B * Math.cos(rad0);

      magnet.rotation.y = theta;
      fieldArrows.forEach((a) => (a.visible = showVectors));

      const pts: { x: number; y: number }[] = [];
      for (let ang = 0; ang <= 180; ang += 6) {
        pts.push({ x: ang, y: M * B * Math.sin((ang * Math.PI) / 180) });
      }
      return {
        substitutedFormula: `τ = MB sin(${theta0}°) = ${tau.toFixed(2)} N·m | U = ${U.toFixed(2)} J`,
        readouts: [
          { symbol: 'τ', label: { en: 'Magnetic Torque', hi: 'चुंबकीय बलाघूर्ण' }, value: tau.toFixed(2), unit: 'N·m', accent: 'force' },
          { symbol: 'U', label: { en: 'Potential Energy', hi: 'स्थितिज ऊर्जा' }, value: U.toFixed(2), unit: 'J', accent: 'energy' },
          { symbol: 'T', label: { en: 'Oscillation Period', hi: 'दोलन काल' }, value: ((2 * Math.PI) / omega).toFixed(2), unit: 's', accent: 'velocity' },
          { symbol: 'B', label: { en: 'Magnetic Field', hi: 'चुंबकीय क्षेत्र' }, value: B.toFixed(2), unit: 'T', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: theta0, y: tau },
      };
    },
  };
}

function buildAcCircuits3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.14, 48), p.contrastMat());
  basePlate.position.y = -0.15;
  group.add(basePlate);

  const phasorR = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 2.0, p.midHex, 0.3, 0.18);
  const phasorX = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 1.5, p.midHex, 0.3, 0.18);
  const phasorZ = new THREE.ArrowHelper(new THREE.Vector3(1, 1, 0).normalize(), new THREE.Vector3(), 2.4, p.primaryHex, 0.35, 0.22);
  group.add(phasorR, phasorX, phasorZ);

  const acWave = createReusableLine(64, p.edgeMat());
  group.add(acWave);

  return {
    group,
    defaultCamPos: [2.8, 3.4, 8.6],
    defaultTarget: [0, 0.5, 0],
    update: (_dt, t, params) => {
      const f = Math.max(5, params.f ?? 50);
      const R = Math.max(5, params.R ?? 40);
      const L = Math.max(0.01, params.L ?? 0.2); // H
      const C_uF = Math.max(1, params.C ?? 50); // µF
      const C = C_uF * 1e-6;
      const w = 2 * Math.PI * f;
      const XL = w * L;
      const XC = 1 / (w * C);
      const Xnet = XL - XC;
      const Z = Math.hypot(R, Xnet);
      const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
      const cosPhi = R / Z;

      const scale = 2.6 / Math.max(40, Z);
      phasorR.setLength(Math.max(0.3, R * scale), 0.25, 0.16);
      phasorX.setDirection(new THREE.Vector3(0, Xnet >= 0 ? 1 : -1, 0));
      phasorX.setLength(Math.max(0.2, Math.abs(Xnet) * scale), 0.25, 0.16);
      phasorZ.setDirection(new THREE.Vector3(R, Xnet, 0).normalize());
      phasorZ.setLength(Math.max(0.35, Z * scale), 0.35, 0.2);

      const coords: [number, number, number][] = [];
      for (let i = 0; i < 64; i++) {
        const x = -4.5 + (i / 63) * 9.0;
        const y = Math.sin((i / 63) * Math.PI * 4 - t * 3.5) * (1.2 * cosPhi + 0.3);
        coords.push([x, y, -2.2]);
      }
      setLinePoints(acWave, coords);

      const pts: { x: number; y: number }[] = [];
      for (let ff = 10; ff <= 160; ff += 5) {
        const ww = 2 * Math.PI * ff;
        const zz = Math.hypot(R, ww * L - 1 / (ww * C));
        pts.push({ x: ff, y: 220 / zz });
      }
      return {
        substitutedFormula: `Z = √[R² + (X_L − X_C)²] = ${Z.toFixed(1)} Ω | f₀ = ${f0.toFixed(1)} Hz`,
        readouts: [
          { symbol: 'Z', label: { en: 'Impedance', hi: 'प्रतिबाधा' }, value: Z.toFixed(1), unit: 'Ω', accent: 'force' },
          { symbol: 'f₀', label: { en: 'Resonance Freq', hi: 'अनुनाद आवृत्ति' }, value: f0.toFixed(1), unit: 'Hz', accent: 'velocity' },
          { symbol: 'cosφ', label: { en: 'Power Factor', hi: 'शक्ति गुणांक' }, value: cosPhi.toFixed(2), unit: '', accent: 'energy' },
          { symbol: 'X_L−X_C', label: { en: 'Net Reactance', hi: 'नेट प्रतिघात' }, value: Xnet.toFixed(1), unit: 'Ω', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: f, y: 220 / Z },
      };
    },
  };
}
