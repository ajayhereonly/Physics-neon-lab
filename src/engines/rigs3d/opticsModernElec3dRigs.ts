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

export function buildOpticsModernElec3DRig(simId: string, theme: ThemeMode): SceneRig | null {
  const p = makePalette3D(theme);
  switch (simId) {
    case 'wave-optics':
      return buildWaveOptics3D(p);
    case 'diffraction-polarization':
      return buildDiffractionPolarization3D(p);
    case 'dual-nature':
      return buildDualNature3D(p);
    case 'de-broglie':
      return buildDeBroglie3D(p);
    case 'binding-energy':
      return buildBindingEnergy3D(p);
    case 'semiconductors':
      return buildSemiconductors3D(p);
    case 'logic-gates':
      return buildLogicGates3D(p);
    case 'transistor-zener':
      return buildTransistorZener3D(p);
    default:
      return null;
  }
}

function buildWaveOptics3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const slitBarrier = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.6, 3.2), p.contrastMat());
  addCrispEdges(slitBarrier, p.edgeMat());
  slitBarrier.position.x = -2.4;
  group.add(slitBarrier);

  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.18, 4.2, 3.4), p.contrastMat());
  addCrispEdges(screen, p.edgeMat());
  screen.position.x = 3.4;
  group.add(screen);

  const fringes: THREE.Mesh[] = [];
  for (let i = -4; i <= 4; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 2.8), p.solidMat());
    bar.position.set(3.32, i * 0.42, 0);
    group.add(bar);
    fringes.push(bar);
  }

  const ray1 = createReusableLine(2, p.edgeMat());
  const ray2 = createReusableLine(2, p.dashedLineMat());
  group.add(ray1, ray2);

  return {
    group,
    defaultCamPos: [1.2, 2.6, 9.2],
    defaultTarget: [0.4, 0, 0],
    update: (_dt, t, params) => {
      const lambda_nm = Math.max(380, params.lambda ?? 550);
      const d_mm = Math.max(0.1, params.d ?? 0.5);
      const D = Math.max(0.5, params.D ?? 1.5);
      const beta_mm = ((lambda_nm * 1e-9 * D) / (d_mm * 1e-3)) * 1000;

      const screenX = -2.4 + Math.min(6.4, Math.max(2.6, D * 3.0));
      screen.position.x = screenX;
      const stepY = Math.min(0.65, Math.max(0.2, beta_mm * 0.24));
      fringes.forEach((fBar, idx) => {
        const order = idx - 4;
        fBar.position.set(screenX - 0.12, order * stepY, 0);
        fBar.scale.y = Math.max(0.4, Math.min(1.4, beta_mm * 0.4));
      });

      const targetY = Math.sin(t * 1.4) * stepY * 2;
      setLinePoints(ray1, [[-2.3, 0.45, 0], [screenX - 0.1, targetY, 0]]);
      setLinePoints(ray2, [[-2.3, -0.45, 0], [screenX - 0.1, targetY, 0]], true);

      const pts: { x: number; y: number }[] = [];
      for (let y = -4; y <= 4; y += 0.15) {
        const c = Math.cos((Math.PI * y) / Math.max(0.3, beta_mm));
        pts.push({ x: y, y: c * c });
      }
      return {
        substitutedFormula: `β = λD/d = (${lambda_nm}nm)(${D}m)/(${d_mm}mm) = ${beta_mm.toFixed(2)} mm`,
        readouts: [
          { symbol: 'β', label: { en: 'Fringe Width', hi: 'फ्रिंज चौड़ाई' }, value: beta_mm.toFixed(2), unit: 'mm', accent: 'velocity' },
          { symbol: 'λ', label: { en: 'Wavelength', hi: 'तरंगदैर्ध्य' }, value: lambda_nm.toFixed(0), unit: 'nm', accent: 'energy' },
          { symbol: 'd', label: { en: 'Slit Separation', hi: 'स्लिट दूरी' }, value: d_mm.toFixed(2), unit: 'mm', accent: 'momentum' },
          { symbol: 'D', label: { en: 'Screen Distance', hi: 'पर्दे की दूरी' }, value: D.toFixed(2), unit: 'm', accent: 'force' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: 0, y: 1 },
      };
    },
  };
}

function buildDiffractionPolarization3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const polarizer = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.15, 28), p.glassMat(0.32));
  polarizer.rotation.z = Math.PI / 2;
  polarizer.position.x = -2.0;
  const analyzer = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.15, 28), p.glassMat(0.32));
  analyzer.rotation.z = Math.PI / 2;
  analyzer.position.x = 1.6;
  const slitBar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.5, 0.12), p.solidMat());
  analyzer.add(slitBar);
  group.add(polarizer, analyzer);

  const waveBefore = createReusableLine(48, p.edgeMat());
  const waveAfter = createReusableLine(48, p.edgeMat());
  group.add(waveBefore, waveAfter);

  return {
    group,
    defaultCamPos: [2.2, 2.6, 8.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params) => {
      const lambda_nm = Math.max(380, params.lambda ?? 600);
      const a_mm = Math.max(0.05, params.a ?? 0.25);
      const D = Math.max(0.5, params.D ?? 1.5);
      const phiDeg = params.phi ?? 45;
      const rad = (phiDeg * Math.PI) / 180;
      const malusPct = Math.cos(rad) * Math.cos(rad) * 100;
      const centralW_mm = ((2 * lambda_nm * 1e-9 * D) / (a_mm * 1e-3)) * 1000;

      analyzer.rotation.x = rad;
      const c1: [number, number, number][] = [];
      const c2: [number, number, number][] = [];
      for (let i = 0; i < 48; i++) {
        const u = i / 47;
        const x1 = -4.8 + u * 6.4;
        const y1 = Math.sin(u * Math.PI * 6 - t * 4) * 1.0;
        c1.push([x1, y1, 0]);
        const x2 = 1.6 + u * 3.4;
        const amp2 = Math.cos(rad);
        const w = Math.sin(u * Math.PI * 3.2 - t * 4) * amp2;
        c2.push([x2, w * Math.cos(rad), w * Math.sin(rad)]);
      }
      setLinePoints(waveBefore, c1);
      setLinePoints(waveAfter, c2);

      const pts: { x: number; y: number }[] = [];
      for (let ang = 0; ang <= 180; ang += 6) {
        const c = Math.cos((ang * Math.PI) / 180);
        pts.push({ x: ang, y: c * c * 100 });
      }
      return {
        substitutedFormula: `I = I₀ cos²(${phiDeg}°) = ${malusPct.toFixed(1)}% I₀ | W₀ = ${centralW_mm.toFixed(1)} mm`,
        readouts: [
          { symbol: 'I/I₀', label: { en: 'Malus Intensity', hi: 'मैलस तीव्रता' }, value: malusPct.toFixed(1), unit: '%', accent: 'energy' },
          { symbol: 'W₀', label: { en: 'Central Max Width', hi: 'केंद्रीय उच्चिष्ठ' }, value: centralW_mm.toFixed(2), unit: 'mm', accent: 'velocity' },
          { symbol: 'φ', label: { en: 'Analyzer Angle', hi: 'विश्लेषक कोण' }, value: phiDeg.toFixed(0), unit: '°', accent: 'force' },
          { symbol: 'a', label: { en: 'Slit Width', hi: 'स्लिट चौड़ाई' }, value: a_mm.toFixed(2), unit: 'mm', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: phiDeg, y: malusPct },
      };
    },
  };
}

function buildDualNature3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const cathode = new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.2, 2.8), p.solidMat());
  cathode.position.x = -2.8;
  const anode = new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.2, 2.8), p.contrastMat());
  anode.position.x = 3.2;
  addCrispEdges(cathode, p.edgeMat());
  addCrispEdges(anode, p.edgeMat());
  group.add(cathode, anode);

  const electrons: THREE.Mesh[] = [];
  for (let i = 0; i < 14; i++) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), p.solidMat());
    e.userData = { u: i / 14, y: ((i % 5) - 2) * 0.55, z: ((i % 3) - 1) * 0.6 };
    group.add(e);
    electrons.push(e);
  }

  const beamLine = createReusableLine(2, p.dashedLineMat());
  setLinePoints(beamLine, [[-5.2, 2.2, 0], [-2.7, 0, 0]], true);
  group.add(beamLine);

  return {
    group,
    defaultCamPos: [1.4, 2.8, 8.8],
    defaultTarget: [0, 0, 0],
    update: (dt, _t, params) => {
      const lambda_nm = Math.max(150, params.lambda ?? 350);
      const phi = Math.max(1.0, params.phi ?? 2.2); // eV
      const intensity = Math.max(1, params.intensity ?? 5);
      const E_photon = 1240 / lambda_nm; // eV
      const Kmax = Math.max(0, E_photon - phi);
      const emitting = E_photon > phi;

      const activeCount = emitting ? Math.min(14, Math.max(2, Math.round(intensity * 1.4))) : 0;
      electrons.forEach((e, i) => {
        e.visible = i < activeCount;
        if (!e.visible) return;
        e.userData.u = (e.userData.u + (0.35 + Kmax * 0.22) * dt) % 1;
        e.position.set(-2.6 + e.userData.u * 5.6, e.userData.y, e.userData.z);
      });

      const pts: { x: number; y: number }[] = [];
      for (let l = 150; l <= 750; l += 25) {
        pts.push({ x: l, y: Math.max(0, 1240 / l - phi) });
      }
      return {
        substitutedFormula: `K_max = hc/λ − φ₀ = ${E_photon.toFixed(2)} − ${phi.toFixed(2)} = ${Kmax.toFixed(2)} eV`,
        readouts: [
          { symbol: 'K_max', label: { en: 'Max Electron KE', hi: 'अधिकतम गतिज ऊर्जा' }, value: Kmax.toFixed(2), unit: 'eV', accent: 'energy' },
          { symbol: 'V₀', label: { en: 'Stopping Potential', hi: 'निरोधी विभव' }, value: Kmax.toFixed(2), unit: 'V', accent: 'force' },
          { symbol: 'E_ph', label: { en: 'Photon Energy', hi: 'फोटॉन ऊर्जा' }, value: E_photon.toFixed(2), unit: 'eV', accent: 'velocity' },
          { symbol: 'Status', label: { en: 'Emission', hi: 'उत्सर्जन' }, value: emitting ? 'EMITTING' : 'CUTOFF', unit: '', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: lambda_nm, y: Kmax },
      };
    },
  };
}

function buildDeBroglie3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const gun = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 1.4, 20), p.contrastMat());
  gun.rotation.z = Math.PI / 2;
  gun.position.x = -4.2;
  addCrispEdges(gun, p.edgeMat());
  group.add(gun);

  const waveLine = createReusableLine(80, p.edgeMat());
  group.add(waveLine);

  const packet = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), p.solidMat());
  group.add(packet);

  return {
    group,
    defaultCamPos: [0, 2.8, 9.0],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params) => {
      const V = Math.max(10, params.V ?? 150);
      const massRatio = Math.max(1, params.massRatio ?? 1);
      const lambda_A = 12.27 / Math.sqrt(V * massRatio);

      const freqVis = Math.min(18, Math.max(2, 12 / Math.max(0.25, lambda_A)));
      const coords: [number, number, number][] = [];
      for (let i = 0; i < 80; i++) {
        const u = i / 79;
        const x = -3.4 + u * 8.0;
        const env = Math.exp(-Math.pow((x - (-3.4 + ((t * 2.5) % 8.0))) * 0.9, 2));
        coords.push([x, Math.sin(u * Math.PI * freqVis - t * 6) * (0.35 + env * 0.75), 0]);
      }
      setLinePoints(waveLine, coords);
      packet.position.set(-3.4 + ((t * 2.5) % 8.0), 0, 0);

      const pts: { x: number; y: number }[] = [];
      for (let vv = 20; vv <= 1000; vv += 40) {
        pts.push({ x: vv, y: 12.27 / Math.sqrt(vv * massRatio) });
      }
      return {
        substitutedFormula: `λ = 12.27 / √(${V}×${massRatio}) = ${lambda_A.toFixed(3)} Å`,
        readouts: [
          { symbol: 'λ', label: { en: 'de Broglie λ', hi: 'डी-ब्रॉग्ली λ' }, value: lambda_A.toFixed(3), unit: 'Å', accent: 'velocity' },
          { symbol: 'V', label: { en: 'Accel Voltage', hi: 'त्वरक विभव' }, value: V.toFixed(0), unit: 'V', accent: 'force' },
          { symbol: 'm/m_e', label: { en: 'Mass Ratio', hi: 'द्रव्यमान अनुपात' }, value: massRatio.toFixed(0), unit: '×', accent: 'momentum' },
          { symbol: 'K', label: { en: 'Kinetic Energy', hi: 'गतिज ऊर्जा' }, value: V.toFixed(0), unit: 'eV', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: V, y: lambda_A },
      };
    },
  };
}

function buildBindingEnergy3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const cluster = new THREE.Group();
  const nucleons: THREE.Mesh[] = [];
  for (let i = 0; i < 32; i++) {
    const n = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 14, 14),
      i % 2 === 0 ? p.solidMat() : p.contrastMat()
    );
    const phi = Math.acos(1 - (2 * (i + 0.5)) / 32);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = 0.85 + (i % 3) * 0.22;
    n.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    cluster.add(n);
    nucleons.push(n);
  }
  group.add(cluster);

  return {
    group,
    defaultCamPos: [2.8, 2.4, 6.8],
    defaultTarget: [0, 0, 0],
    update: (dt, _t, params) => {
      const A = Math.max(2, params.A ?? 56);
      const dm = Math.max(0.01, params.dm ?? 0.52);
      const BE = dm * 931.5;
      const bePerA = BE / A;

      cluster.rotation.y += dt * 0.65;
      cluster.rotation.x += dt * 0.25;
      const active = Math.min(32, Math.max(4, Math.round((A / 240) * 32)));
      nucleons.forEach((n, i) => (n.visible = i < active));

      const pts: { x: number; y: number }[] = [
        { x: 2, y: 1.1 }, { x: 4, y: 7.1 }, { x: 12, y: 7.7 }, { x: 16, y: 8.0 },
        { x: 56, y: 8.8 }, { x: 120, y: 8.5 }, { x: 200, y: 7.9 }, { x: 238, y: 7.6 },
      ];
      return {
        substitutedFormula: `BE = Δm × 931.5 = ${BE.toFixed(1)} MeV | BE/A = ${bePerA.toFixed(2)} MeV`,
        readouts: [
          { symbol: 'BE/A', label: { en: 'Binding Energy / A', hi: 'प्रति न्यूक्लियॉन ऊर्जा' }, value: bePerA.toFixed(2), unit: 'MeV', accent: 'energy' },
          { symbol: 'BE', label: { en: 'Total Binding E', hi: 'कुल बंधन ऊर्जा' }, value: BE.toFixed(1), unit: 'MeV', accent: 'force' },
          { symbol: 'A', label: { en: 'Mass Number', hi: 'द्रव्यमान संख्या' }, value: A.toFixed(0), unit: '', accent: 'momentum' },
          { symbol: 'Δm', label: { en: 'Mass Defect', hi: 'द्रव्यमान क्षति' }, value: dm.toFixed(3), unit: 'u', accent: 'velocity' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: A, y: bePerA },
      };
    },
  };
}

function buildSemiconductors3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const pBlock = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 2.0), p.solidMat());
  pBlock.position.x = -1.7;
  const nBlock = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 2.0), p.contrastMat());
  nBlock.position.x = 1.7;
  const depletion = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.25, 2.05), p.glassMat(0.45));
  addCrispEdges(pBlock, p.edgeMat());
  addCrispEdges(nBlock, p.edgeMat());
  addCrispEdges(depletion, p.edgeMat());
  group.add(pBlock, nBlock, depletion);

  const carriers: THREE.Mesh[] = [];
  for (let i = 0; i < 12; i++) {
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), p.solidMat());
    c.userData = { u: i / 12, y: ((i % 4) - 1.5) * 0.45 };
    group.add(c);
    carriers.push(c);
  }

  return {
    group,
    defaultCamPos: [1.8, 2.8, 8.2],
    defaultTarget: [0, 0, 0],
    update: (dt, _t, params) => {
      const Vbias = params.Vbias ?? 1.2;
      const Vk = Math.max(0.2, params.Vk ?? 0.7);
      const Rseries = Math.max(10, params.Rseries ?? 100);
      const conducting = Vbias > Vk;
      const I_mA = conducting ? ((Vbias - Vk) / Rseries) * 1000 : 0;

      const depW = Vbias >= 0 ? Math.max(0.2, 1.0 - (Vbias / (Vk * 2)) * 0.75) : Math.min(2.2, 1.0 + Math.abs(Vbias) * 0.35);
      depletion.scale.x = depW;

      carriers.forEach((c) => {
        c.visible = conducting;
        if (!conducting) return;
        c.userData.u = (c.userData.u + Math.min(2.5, I_mA * 0.03) * dt) % 1;
        c.position.set(-2.9 + c.userData.u * 5.8, c.userData.y, 1.15);
      });

      const pts: { x: number; y: number }[] = [];
      for (let v = -2; v <= 3; v += 0.2) {
        pts.push({ x: v, y: v > Vk ? ((v - Vk) / Rseries) * 1000 : 0 });
      }
      return {
        substitutedFormula: `I = ${conducting ? `(${Vbias.toFixed(2)}−${Vk})/${Rseries} = ${I_mA.toFixed(1)} mA` : '0 mA (Blocked)'}`,
        readouts: [
          { symbol: 'I', label: { en: 'Diode Current', hi: 'डायोड धारा' }, value: I_mA.toFixed(1), unit: 'mA', accent: 'velocity' },
          { symbol: 'Mode', label: { en: 'Bias State', hi: 'अभिनति अवस्था' }, value: Vbias >= 0 ? (conducting ? 'FORWARD ON' : 'KNEE WAIT') : 'REVERSE OFF', unit: '', accent: 'force' },
          { symbol: 'V_b', label: { en: 'Bias Voltage', hi: 'बायस वोल्टेज' }, value: Vbias.toFixed(2), unit: 'V', accent: 'energy' },
          { symbol: 'V_k', label: { en: 'Knee Voltage', hi: 'नी वोल्टता' }, value: Vk.toFixed(2), unit: 'V', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: Vbias, y: I_mA },
      };
    },
  };
}

function buildLogicGates3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const chip = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.4, 2.2), p.contrastMat());
  addCrispEdges(chip, p.edgeMat());
  group.add(chip);

  const inA = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.8, 16), p.solidMat());
  inA.rotation.z = Math.PI / 2;
  inA.position.set(-2.4, 0, -0.6);
  const inB = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.8, 16), p.solidMat());
  inB.rotation.z = Math.PI / 2;
  inB.position.set(-2.4, 0, 0.6);
  const outLamp = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 24), p.solidMat());
  outLamp.position.set(2.8, 0.3, 0);
  addCrispEdges(outLamp, p.edgeMat(), 28);
  group.add(inA, inB, outLamp);

  return {
    group,
    defaultCamPos: [1.2, 3.6, 7.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params) => {
      const gate = Math.round(params.gate ?? 0);
      const A = Math.round(params.A ?? 1) ? 1 : 0;
      const B = Math.round(params.B ?? 1) ? 1 : 0;
      const names = ['AND', 'OR', 'NAND', 'NOR', 'XOR'];
      const gIdx = Math.max(0, Math.min(4, gate));
      let Y = 0;
      if (gIdx === 0) Y = A & B;
      else if (gIdx === 1) Y = A | B;
      else if (gIdx === 2) Y = (A & B) ? 0 : 1;
      else if (gIdx === 3) Y = (A | B) ? 0 : 1;
      else Y = A ^ B;

      inA.scale.set(1, A ? 1.25 : 0.65, 1);
      inB.scale.set(1, B ? 1.25 : 0.65, 1);
      outLamp.scale.setScalar(Y ? 1.25 + Math.sin(t * 5) * 0.08 : 0.55);

      return {
        substitutedFormula: `${names[gIdx]}(A=${A}, B=${B}) ⇒ Y = ${Y}`,
        readouts: [
          { symbol: 'Y', label: { en: 'Logic Output', hi: 'लॉजिक आउटपुट' }, value: String(Y), unit: Y ? 'HIGH' : 'LOW', accent: 'energy' },
          { symbol: 'Gate', label: { en: 'Active Gate', hi: 'लॉजिक गेट' }, value: names[gIdx], unit: '', accent: 'force' },
          { symbol: 'A', label: { en: 'Input A', hi: 'इनपुट A' }, value: String(A), unit: '', accent: 'velocity' },
          { symbol: 'B', label: { en: 'Input B', hi: 'इनपुट B' }, value: String(B), unit: '', accent: 'momentum' },
        ],
        graphPoints: [
          { x: 0, y: gIdx === 2 || gIdx === 3 ? 1 : 0 },
          { x: 1, y: gIdx === 1 || gIdx === 2 || gIdx === 4 ? 1 : 0 },
          { x: 2, y: gIdx === 1 || gIdx === 2 || gIdx === 4 ? 1 : 0 },
          { x: 3, y: gIdx === 0 || gIdx === 1 ? 1 : 0 },
        ],
        graphCurrentPoint: { x: A * 2 + B, y: Y },
      };
    },
  };
}

function buildTransistorZener3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const transistor = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 1.8, 24), p.solidMat());
  addCrispEdges(transistor, p.edgeMat());
  group.add(transistor);

  const inWave = createReusableLine(40, p.mutedLineMat());
  const outWave = createReusableLine(40, p.edgeMat());
  group.add(inWave, outWave);

  return {
    group,
    defaultCamPos: [0.5, 2.8, 9.2],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params) => {
      const beta = Math.max(10, params.beta ?? 80);
      const Ib = Math.max(1, params.Ib ?? 20); // µA
      const RL = Math.max(100, params.RL ?? 2000);
      const Rin = Math.max(100, params.Rin ?? 1000);
      const Ic_mA = (beta * Ib) / 1000;
      const Av = beta * (RL / Rin);
      const Ap = beta * Av;

      const cIn: [number, number, number][] = [];
      const cOut: [number, number, number][] = [];
      const gainVis = Math.min(2.4, Math.max(0.4, Av / 80));
      for (let i = 0; i < 40; i++) {
        const u = i / 39;
        cIn.push([-4.6 + u * 3.2, Math.sin(u * Math.PI * 4 - t * 4) * 0.35, 0]);
        cOut.push([1.4 + u * 3.2, -Math.sin(u * Math.PI * 4 - t * 4) * gainVis, 0]);
      }
      setLinePoints(inWave, cIn);
      setLinePoints(outWave, cOut);

      const pts: { x: number; y: number }[] = [];
      for (let b = 20; b <= 200; b += 10) {
        pts.push({ x: b, y: b * (RL / Rin) });
      }
      return {
        substitutedFormula: `I_C = βI_B = ${Ic_mA.toFixed(2)} mA | A_v = β(R_L/R_in) = ${Av.toFixed(1)}`,
        readouts: [
          { symbol: 'A_v', label: { en: 'Voltage Gain', hi: 'वोल्टेज लाभ' }, value: Av.toFixed(1), unit: '×', accent: 'force' },
          { symbol: 'I_C', label: { en: 'Collector Current', hi: 'संग्राहक धारा' }, value: Ic_mA.toFixed(2), unit: 'mA', accent: 'velocity' },
          { symbol: 'A_p', label: { en: 'Power Gain', hi: 'शक्ति लाभ' }, value: Ap.toFixed(0), unit: '×', accent: 'energy' },
          { symbol: 'β', label: { en: 'Current Gain β', hi: 'धारा लाभ β' }, value: beta.toFixed(0), unit: '', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: beta, y: Av },
      };
    },
  };
}
