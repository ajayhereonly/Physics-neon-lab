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

export function buildFluidsThermal3DRig(simId: string, theme: ThemeMode): SceneRig | null {
  const p = makePalette3D(theme);
  switch (simId) {
    case 'solids-elasticity':
      return buildSolidsElasticity3D(p);
    case 'fluids':
      return buildFluidsBernoulli3D(p);
    case 'stokes-terminal':
      return buildStokesTerminal3D(p);
    case 'capillary-rise':
      return buildCapillaryRise3D(p);
    case 'density-buoyancy':
      return buildDensityBuoyancy3D(p);
    case 'thermal-matter':
      return buildThermalMatter3D(p);
    case 'blackbody-cooling':
      return buildBlackbodyCooling3D(p);
    case 'thermodynamics':
      return buildThermodynamics3D(p);
    case 'carnot-engine':
      return buildCarnotEngine3D(p);
    case 'kinetic-theory':
      return buildKineticTheory3D(p);
    default:
      return null;
  }
}

function buildSolidsElasticity3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const topClamp = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.35, 1.4), p.contrastMat());
  addCrispEdges(topClamp, p.edgeMat());
  topClamp.position.y = 3.0;
  group.add(topClamp);

  const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 3.4, 20), p.solidMat());
  group.add(wire);

  const weight = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.72, 1.0, 22), p.matteMidMat());
  addCrispEdges(weight, p.edgeMat());
  group.add(weight);

  return {
    group,
    defaultCamPos: [3.2, 2.2, 8.2],
    defaultTarget: [0, 0.5, 0],
    update: (_dt, _t, params) => {
      const F = Math.max(1, params.F ?? 500);
      const L = Math.max(0.5, params.L ?? 2);
      const A = Math.max(0.2, params.A ?? 2); // mm²
      const Y = Math.max(10, params.Y ?? 200); // GPa
      const A_m2 = A * 1e-6;
      const Y_Pa = Y * 1e9;
      const stress = F / A_m2; // Pa -> MPa
      const strain = stress / Y_Pa;
      const dL_mm = strain * L * 1000;

      const visStretch = Math.min(2.0, dL_mm * 0.28);
      const wireLen = 2.6 + visStretch;
      wire.scale.set(Math.sqrt(A / 2), wireLen / 3.4, Math.sqrt(A / 2));
      wire.position.y = 2.8 - wireLen / 2;
      weight.position.y = 2.8 - wireLen - 0.5;
      weight.scale.setScalar(0.75 + Math.min(0.5, F / 1500));

      const pts: { x: number; y: number }[] = [];
      for (let ff = 0; ff <= 1000; ff += 50) {
        pts.push({ x: ff, y: (ff / (A_m2 * Y_Pa)) * L * 1000 });
      }
      return {
        substitutedFormula: `ΔL = FL/(AY) = ${dL_mm.toFixed(3)} mm | Stress = ${(stress / 1e6).toFixed(1)} MPa`,
        readouts: [
          { symbol: 'ΔL', label: { en: 'Extension', hi: 'लंबाई में वृद्धि' }, value: dL_mm.toFixed(3), unit: 'mm', accent: 'velocity' },
          { symbol: 'σ', label: { en: 'Tensile Stress', hi: 'प्रतिबल' }, value: (stress / 1e6).toFixed(1), unit: 'MPa', accent: 'force' },
          { symbol: 'ε', label: { en: 'Strain (×10⁻³)', hi: 'विकृति' }, value: (strain * 1000).toFixed(3), unit: '', accent: 'momentum' },
          { symbol: 'Y', label: { en: 'Young Modulus', hi: 'यंग गुणांक' }, value: Y.toFixed(0), unit: 'GPa', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: F, y: dL_mm },
      };
    },
  };
}

function buildFluidsBernoulli3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const wideLeft = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 3.2, 24, 1, true), p.glassMat(0.32));
  wideLeft.rotation.z = Math.PI / 2;
  wideLeft.position.set(-3.2, 0, 0);
  const throat = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.8, 24, 1, true), p.glassMat(0.38));
  throat.rotation.z = Math.PI / 2;
  const wideRight = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 3.2, 24, 1, true), p.glassMat(0.32));
  wideRight.rotation.z = Math.PI / 2;
  wideRight.position.set(3.2, 0, 0);
  group.add(wideLeft, throat, wideRight);

  const gauge1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.6, 16), p.solidMat());
  const gauge2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.6, 16), p.matteMidMat());
  gauge1.position.set(-3.0, 2.0, 0);
  gauge2.position.set(0, 1.4, 0);
  group.add(gauge1, gauge2);

  const particles: THREE.Mesh[] = [];
  for (let i = 0; i < 24; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), p.solidMat());
    m.userData = { u: i / 24, rOff: ((i % 5) - 2) * 0.22, zOff: ((i % 3) - 1) * 0.22 };
    group.add(m);
    particles.push(m);
  }

  return {
    group,
    defaultCamPos: [0, 2.8, 9.6],
    defaultTarget: [0, 0.6, 0],
    update: (dt, _t, params) => {
      const v1 = Math.max(0.5, params.v1 ?? 3);
      const ratio = Math.max(1, params.ratio ?? 2.5);
      const rho = Math.max(100, params.rho ?? 1000);
      const P1 = Math.max(20, params.P1 ?? 150); // kPa
      const v2 = v1 * ratio;
      const dP = 0.5 * rho * (v2 * v2 - v1 * v1) / 1000; // kPa
      const P2 = P1 - dP;

      const throatR = Math.max(0.35, 1.1 / Math.sqrt(ratio));
      throat.scale.set(throatR / 0.55, 1, throatR / 0.55);

      const h1 = Math.min(3.2, Math.max(0.3, P1 * 0.015));
      const h2 = Math.min(3.2, Math.max(0.2, Math.max(5, P2) * 0.015));
      gauge1.scale.y = h1 / 2.6;
      gauge1.position.y = 1.1 + h1 / 2;
      gauge2.scale.y = h2 / 2.6;
      gauge2.position.y = throatR + h2 / 2;

      particles.forEach((m) => {
        const inThroat = m.userData.u > 0.34 && m.userData.u < 0.66;
        const spd = (inThroat ? v2 : v1) * 0.06;
        m.userData.u = (m.userData.u + spd * dt) % 1;
        const x = -4.6 + m.userData.u * 9.2;
        const squeeze = inThroat ? throatR / 1.1 : 1;
        m.position.set(x, m.userData.rOff * squeeze, m.userData.zOff * squeeze);
      });

      const pts: { x: number; y: number }[] = [];
      for (let rr = 1; rr <= 4; rr += 0.2) {
        const vv2 = v1 * rr;
        pts.push({ x: rr, y: P1 - (0.5 * rho * (vv2 * vv2 - v1 * v1)) / 1000 });
      }
      return {
        substitutedFormula: `v₂ = ${v2.toFixed(1)} m/s | P₂ = ${P1} − ${dP.toFixed(1)} = ${P2.toFixed(1)} kPa`,
        readouts: [
          { symbol: 'v₂', label: { en: 'Throat Speed', hi: 'संकरे भाग की चाल' }, value: v2.toFixed(2), unit: 'm/s', accent: 'velocity' },
          { symbol: 'P₂', label: { en: 'Throat Pressure', hi: 'संकरे भाग का दाब' }, value: P2.toFixed(1), unit: 'kPa', accent: 'force' },
          { symbol: 'ΔP', label: { en: 'Pressure Drop', hi: 'दाब अंतर' }, value: dP.toFixed(1), unit: 'kPa', accent: 'momentum' },
          { symbol: 'A₁/A₂', label: { en: 'Area Ratio', hi: 'क्षेत्रफल अनुपात' }, value: ratio.toFixed(1), unit: '×', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: ratio, y: P2 },
      };
    },
  };
}

function buildStokesTerminal3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const jar = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 6.2, 28, 1, true), p.glassMat(0.28));
  addCrispEdges(jar, p.edgeMat(), 30);
  group.add(jar);

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), p.solidMat());
  group.add(sphere);

  const dragArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 1.4, p.primaryHex, 0.3, 0.18);
  const weightArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(), 1.4, p.midHex, 0.3, 0.18);
  group.add(dragArrow, weightArrow);

  let yPos = 2.6;
  return {
    group,
    defaultCamPos: [3.2, 1.8, 8.2],
    defaultTarget: [0, 0, 0],
    update: (dt, _t, params, showVectors) => {
      const r_mm = Math.max(0.5, params.r ?? 3);
      const eta = Math.max(0.05, params.eta ?? 0.8);
      const rho = params.rho ?? 7800;
      const sigma = params.sigma ?? 1200;
      const g = 9.81;
      const r_m = r_mm * 1e-3;
      const vt = (2 * r_m * r_m * (rho - sigma) * g) / (9 * eta);

      yPos -= Math.max(0.15, Math.min(3.5, Math.abs(vt) * 2.5)) * dt;
      if (yPos < -2.6) yPos = 2.6;
      sphere.position.set(0, yPos, 0);
      sphere.scale.setScalar(0.5 + (r_mm / 8) * 0.8);

      dragArrow.visible = showVectors;
      dragArrow.position.set(0, yPos + 0.3, 0);
      weightArrow.visible = showVectors;
      weightArrow.position.set(0, yPos - 0.3, 0);

      const pts: { x: number; y: number }[] = [];
      for (let rr = 0.5; rr <= 8; rr += 0.5) {
        const rm = rr * 1e-3;
        pts.push({ x: rr, y: (2 * rm * rm * (rho - sigma) * g) / (9 * eta) });
      }
      return {
        substitutedFormula: `v_T = 2r²(ρ−σ)g / (9η) = ${vt.toFixed(3)} m/s`,
        readouts: [
          { symbol: 'v_T', label: { en: 'Terminal Velocity', hi: 'सीमांत वेग' }, value: vt.toFixed(3), unit: 'm/s', accent: 'velocity' },
          { symbol: 'η', label: { en: 'Viscosity', hi: 'श्यानता' }, value: eta.toFixed(2), unit: 'Pa·s', accent: 'force' },
          { symbol: 'r', label: { en: 'Sphere Radius', hi: 'त्रिज्या' }, value: r_mm.toFixed(1), unit: 'mm', accent: 'momentum' },
          { symbol: 'Δρ', label: { en: 'Density Diff', hi: 'घनत्व अंतर' }, value: (rho - sigma).toFixed(0), unit: 'kg/m³', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: r_mm, y: vt },
      };
    },
    getStrobePos: () => sphere.position.clone(),
  };
}

function buildCapillaryRise3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const trough = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 1.4, 28, 1, true), p.glassMat(0.28));
  trough.position.y = -2.0;
  const liquidBase = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1.0, 28), p.translucentMat(0.3));
  liquidBase.position.y = -2.2;
  group.add(trough, liquidBase);

  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 5.4, 24, 1, true), p.glassMat(0.36));
  tube.position.y = 0.6;
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 1.0, 22), p.solidMat());
  group.add(tube, column);

  return {
    group,
    defaultCamPos: [3.2, 2.2, 8.0],
    defaultTarget: [0, 0.2, 0],
    update: (_dt, _t, params) => {
      const T = Math.max(0.01, params.T ?? 0.072);
      const r_mm = Math.max(0.1, params.r ?? 0.5);
      const thetaDeg = params.theta ?? 10;
      const rho = Math.max(200, params.rho ?? 1000);
      const g = 9.81;
      const rad = (thetaDeg * Math.PI) / 180;
      const h_m = (2 * T * Math.cos(rad)) / (rho * g * (r_mm * 1e-3));
      const h_cm = h_m * 100;

      const radScale = 0.45 + Math.min(1.2, r_mm * 0.6);
      tube.scale.set(radScale, 1, radScale);
      const colH = Math.max(0.25, Math.min(4.6, Math.abs(h_cm) * 0.45));
      column.scale.set(radScale * 0.85, colH, radScale * 0.85);
      column.position.y = h_cm >= 0 ? -1.7 + colH / 2 : -1.7 - colH * 0.35;

      const pts: { x: number; y: number }[] = [];
      for (let rr = 0.2; rr <= 2.0; rr += 0.1) {
        pts.push({ x: rr, y: ((2 * T * Math.cos(rad)) / (rho * g * rr * 1e-3)) * 100 });
      }
      return {
        substitutedFormula: `h = 2(${T})cos(${thetaDeg}°) / (ρgr) = ${h_cm.toFixed(2)} cm`,
        readouts: [
          { symbol: 'h', label: { en: 'Capillary Rise', hi: 'केशिका चढ़ाव' }, value: h_cm.toFixed(2), unit: 'cm', accent: 'velocity' },
          { symbol: 'T', label: { en: 'Surface Tension', hi: 'पृष्ठ तनाव' }, value: T.toFixed(3), unit: 'N/m', accent: 'force' },
          { symbol: 'θ', label: { en: 'Contact Angle', hi: 'स्पर्श कोण' }, value: thetaDeg.toFixed(0), unit: '°', accent: 'momentum' },
          { symbol: 'r', label: { en: 'Tube Radius', hi: 'नलिका त्रिज्या' }, value: r_mm.toFixed(2), unit: 'mm', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: r_mm, y: h_cm },
      };
    },
  };
}

function buildDensityBuoyancy3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const tank = new THREE.Mesh(new THREE.BoxGeometry(5.6, 4.8, 3.6), p.glassMat(0.22));
  addCrispEdges(tank, p.edgeMat());
  group.add(tank);

  const water = new THREE.Mesh(new THREE.BoxGeometry(5.4, 3.4, 3.4), p.translucentMat(0.24));
  water.position.y = -0.65;
  group.add(water);

  const block = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.3, 1.5), p.solidMat());
  addCrispEdges(block, p.edgeMat());
  group.add(block);

  const buoyArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 1.5, p.primaryHex, 0.35, 0.2);
  const weightArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(), 1.5, p.midHex, 0.35, 0.2);
  group.add(buoyArrow, weightArrow);

  return {
    group,
    defaultCamPos: [3.6, 2.8, 8.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params, showVectors) => {
      const rhoObj = Math.max(100, params.rhoObj ?? 650);
      const rhoFluid = Math.max(200, params.rhoFluid ?? 1000);
      const vol = Math.max(0.05, params.vol ?? 0.5);
      const depth = Math.max(0.5, params.depth ?? 4);
      const g = 9.81;

      const subFrac = Math.min(1, rhoObj / rhoFluid);
      const W = rhoObj * vol * g;
      const Fb = rhoFluid * (vol * subFrac) * g;
      const P_kPa = (101325 + rhoFluid * g * depth) / 1000;

      const waterTopY = 1.05;
      const targetY = rhoObj <= rhoFluid ? waterTopY + 0.65 - subFrac * 1.3 : -1.65;
      const bobY = targetY + (rhoObj <= rhoFluid ? Math.sin(t * 2.2) * 0.08 : 0);
      block.position.set(0, bobY, 0);

      buoyArrow.visible = showVectors;
      buoyArrow.position.set(0.95, bobY, 0);
      buoyArrow.setLength(Math.min(2.4, 0.5 + Fb * 0.0003), 0.32, 0.18);

      weightArrow.visible = showVectors;
      weightArrow.position.set(-0.95, bobY, 0);
      weightArrow.setLength(Math.min(2.4, 0.5 + W * 0.0003), 0.32, 0.18);

      const pts: { x: number; y: number }[] = [];
      for (let r = 200; r <= 2000; r += 100) {
        pts.push({ x: r, y: Math.min(1, r / rhoFluid) * 100 });
      }
      return {
        substitutedFormula: `F_B = ρ_f V_sub g = ${Fb.toFixed(0)} N | Submerged = ${(subFrac * 100).toFixed(0)}%`,
        readouts: [
          { symbol: 'F_B', label: { en: 'Buoyant Force', hi: 'उत्प्लावन बल' }, value: Fb.toFixed(0), unit: 'N', accent: 'force' },
          { symbol: 'W', label: { en: 'Object Weight', hi: 'वस्तु का भार' }, value: W.toFixed(0), unit: 'N', accent: 'momentum' },
          { symbol: 'Sub%', label: { en: 'Submerged Fraction', hi: 'डूबा भाग' }, value: (subFrac * 100).toFixed(0), unit: '%', accent: 'velocity' },
          { symbol: 'P', label: { en: 'Hydrostatic Press', hi: 'द्रव दाब' }, value: P_kPa.toFixed(1), unit: 'kPa', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: rhoObj, y: subFrac * 100 },
      };
    },
    getCallouts: (_params, tel) => [
      { label: `F_B = ${tel.readouts[0]?.value} N`, pos: [1.8, block.position.y + 0.8, 0] },
      { label: `Submerged: ${tel.readouts[2]?.value}%`, pos: [0, 1.8, 0] },
    ],
  };
}

function buildThermalMatter3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const hotWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.4, 2.2), p.solidMat());
  hotWall.position.set(-3.6, 0, 0);
  const coldWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.4, 2.2), p.contrastMat());
  coldWall.position.set(3.6, 0, 0);
  addCrispEdges(hotWall, p.edgeMat());
  addCrispEdges(coldWall, p.edgeMat());
  group.add(hotWall, coldWall);

  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 5.2, 24), p.matteMidMat());
  rod.rotation.z = Math.PI / 2;
  addCrispEdges(rod, p.edgeMat(), 25);
  group.add(rod);

  return {
    group,
    defaultCamPos: [2.2, 2.8, 8.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params) => {
      const dT = Math.max(1, params.dT ?? 80);
      const L0 = Math.max(0.5, params.L0 ?? 2.0);
      const alpha = Math.max(1, params.alpha ?? 12); // ×10⁻⁶ /K
      const k = Math.max(10, params.k ?? 200); // W/mK

      const dL_mm = L0 * (alpha * 1e-6) * dT * 1000;
      const heatRate = (k * 0.01 * dT) / L0; // A = 0.01 m²

      const grow = 1 + Math.min(0.45, dL_mm * 0.08) + Math.sin(t * 4) * 0.008;
      rod.scale.set(1, grow, 1);

      const pts: { x: number; y: number }[] = [];
      for (let dtVal = 0; dtVal <= 200; dtVal += 10) {
        pts.push({ x: dtVal, y: L0 * alpha * 1e-6 * dtVal * 1000 });
      }
      return {
        substitutedFormula: `ΔL = L₀αΔT = ${dL_mm.toFixed(3)} mm | H = kAΔT/L = ${heatRate.toFixed(1)} W`,
        readouts: [
          { symbol: 'ΔL', label: { en: 'Linear Expansion', hi: 'रेखीय प्रसार' }, value: dL_mm.toFixed(3), unit: 'mm', accent: 'velocity' },
          { symbol: 'H', label: { en: 'Heat Flow Rate', hi: 'ऊष्मा प्रवाह दर' }, value: heatRate.toFixed(1), unit: 'W', accent: 'energy' },
          { symbol: 'ΔT', label: { en: 'Temp Difference', hi: 'तापांतर' }, value: dT.toFixed(0), unit: 'K', accent: 'force' },
          { symbol: 'α', label: { en: 'Expansion Coeff', hi: 'प्रसार गुणांक' }, value: `${alpha}×10⁻⁶`, unit: '/K', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: dT, y: dL_mm },
      };
    },
  };
}

function buildBlackbodyCooling3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(1.35, 32, 32), p.solidMat());
  group.add(body);

  const rings: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(1.7 + i * 0.55, 0.04, 10, 48), p.matteMidMat());
    r.rotation.x = Math.PI / 2 + i * 0.35;
    group.add(r);
    rings.push(r);
  }

  return {
    group,
    defaultCamPos: [2.6, 3.0, 7.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params) => {
      const T = Math.max(300, params.T ?? 3000);
      const emissivity = Math.max(0.1, params.emissivity ?? 0.9);
      const T_init = params.T_init ?? 90;
      const T_env = params.T_env ?? 25;
      const lambdaMax_nm = (2.898e6) / T;
      const power = emissivity * 5.67e-8 * Math.pow(T, 4); // W/m²

      rings.forEach((r, idx) => {
        const s = 1 + ((t * 0.8 + idx * 0.25) % 1) * 0.85;
        r.scale.setScalar(s);
        r.rotation.z = t * 0.3 * (idx % 2 ? 1 : -1);
      });

      const pts: { x: number; y: number }[] = [];
      for (let tt = 0; tt <= 20; tt += 1) {
        pts.push({ x: tt, y: T_env + (T_init - T_env) * Math.exp(-0.12 * tt) });
      }
      return {
        substitutedFormula: `λ_m = b/T = ${lambdaMax_nm.toFixed(0)} nm | E = eσT⁴ = ${(power / 1e6).toFixed(2)} MW/m²`,
        readouts: [
          { symbol: 'λ_m', label: { en: 'Wien Peak λ', hi: 'वीन शिखर λ' }, value: lambdaMax_nm.toFixed(0), unit: 'nm', accent: 'velocity' },
          { symbol: 'E', label: { en: 'Radiated Flux', hi: 'विकिरण तीव्रता' }, value: (power / 1e6).toFixed(2), unit: 'MW/m²', accent: 'energy' },
          { symbol: 'T', label: { en: 'Blackbody Temp', hi: 'तापमान' }, value: T.toFixed(0), unit: 'K', accent: 'force' },
          { symbol: 'ΔT', label: { en: 'Cooling Excess', hi: 'अतिरिक्त ताप' }, value: (T_init - T_env).toFixed(0), unit: '°C', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: 5, y: T_env + (T_init - T_env) * Math.exp(-0.6) },
      };
    },
  };
}

function buildThermodynamics3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 4.8, 28, 1, true), p.glassMat(0.28));
  addCrispEdges(cylinder, p.edgeMat(), 30);
  group.add(cylinder);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.52, 1.52, 0.25, 28), p.contrastMat());
  base.position.y = -2.4;
  group.add(base);

  const piston = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.42, 0.45, 28), p.solidMat());
  addCrispEdges(piston, p.edgeMat());
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.2, 16), p.matteMidMat());
  rod.position.y = 1.3;
  piston.add(rod);
  group.add(piston);

  const molecules: THREE.Mesh[] = [];
  for (let i = 0; i < 20; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), p.solidMat());
    m.userData = {
      vx: (Math.sin(i * 1.7) * 1.8),
      vy: (Math.cos(i * 2.3) * 1.8),
      vz: (Math.sin(i * 3.1) * 1.5),
    };
    m.position.set(Math.sin(i) * 0.8, -1.2 + (i % 4) * 0.3, Math.cos(i) * 0.8);
    group.add(m);
    molecules.push(m);
  }

  return {
    group,
    defaultCamPos: [3.6, 2.6, 8.4],
    defaultTarget: [0, 0.2, 0],
    update: (dt, _t, params) => {
      const V = Math.max(0.5, params.V ?? 2.0); // L or scaled
      const T0 = Math.max(150, params.T0 ?? 300);
      const gamma = Math.max(1.1, params.gamma ?? 1.4);
      const n = Math.max(0.2, params.n ?? 1.0);
      const R = 8.314;
      const P_iso = (n * R * T0) / V;
      const T_adia = T0 * Math.pow(2.0 / V, gamma - 1);
      const P_adia = (n * R * T_adia) / V;

      const pistonY = -1.6 + Math.min(3.2, (V / 5) * 3.2);
      piston.position.y = pistonY;

      const spdScale = Math.sqrt(T0 / 300);
      molecules.forEach((m) => {
        m.position.x += m.userData.vx * spdScale * dt;
        m.position.y += m.userData.vy * spdScale * dt;
        m.position.z += m.userData.vz * spdScale * dt;
        if (Math.hypot(m.position.x, m.position.z) > 1.2) {
          m.userData.vx *= -1;
          m.userData.vz *= -1;
        }
        if (m.position.y < -2.1) {
          m.position.y = -2.1;
          m.userData.vy = Math.abs(m.userData.vy);
        }
        if (m.position.y > pistonY - 0.35) {
          m.position.y = pistonY - 0.35;
          m.userData.vy = -Math.abs(m.userData.vy);
        }
      });

      const pts: { x: number; y: number }[] = [];
      const pts2: { x: number; y: number }[] = [];
      for (let vv = 0.6; vv <= 5.0; vv += 0.2) {
        pts.push({ x: vv, y: (n * R * T0) / vv });
        pts2.push({ x: vv, y: (n * R * T0 * Math.pow(2.0 / vv, gamma - 1)) / vv });
      }
      return {
        substitutedFormula: `P_iso = nRT/V = ${P_iso.toFixed(0)} Pa | P_adia = ${P_adia.toFixed(0)} Pa`,
        readouts: [
          { symbol: 'P_iso', label: { en: 'Isothermal P', hi: 'समतापी दाब' }, value: P_iso.toFixed(0), unit: 'Pa', accent: 'force' },
          { symbol: 'P_ad', label: { en: 'Adiabatic P', hi: 'रुद्धोष्म दाब' }, value: P_adia.toFixed(0), unit: 'Pa', accent: 'velocity' },
          { symbol: 'T_ad', label: { en: 'Adiabatic Temp', hi: 'रुद्धोष्म ताप' }, value: T_adia.toFixed(0), unit: 'K', accent: 'energy' },
          { symbol: 'γ', label: { en: 'Adiabatic Index', hi: 'रुद्धोष्म घातांक' }, value: gamma.toFixed(2), unit: '', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphSecondPoints: pts2,
        graphCurrentPoint: { x: V, y: P_iso },
      };
    },
  };
}

function buildCarnotEngine3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const hotRes = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 2.0), p.solidMat());
  hotRes.position.set(0, 2.6, 0);
  const coldRes = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 2.0), p.contrastMat());
  coldRes.position.set(0, -2.4, 0);
  addCrispEdges(hotRes, p.edgeMat());
  addCrispEdges(coldRes, p.edgeMat());
  group.add(hotRes, coldRes);

  const flywheel = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.22, 16, 40), p.matteMidMat());
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.45, 20), p.solidMat());
  hub.rotation.x = Math.PI / 2;
  const spoke = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.16, 0.18), p.solidMat());
  flywheel.add(hub, spoke);
  group.add(flywheel);

  return {
    group,
    defaultCamPos: [3.4, 2.4, 8.6],
    defaultTarget: [0, 0.1, 0],
    update: (dt, _t, params) => {
      const T1 = Math.max(350, params.T1 ?? 600);
      const T2 = Math.min(T1 - 20, Math.max(100, params.T2 ?? 300));
      const Q1 = Math.max(100, params.Q1 ?? 1000);
      const eta = 1 - T2 / T1;
      const W = eta * Q1;
      const Q2 = Q1 - W;

      flywheel.rotation.z -= (1.0 + eta * 4.5) * dt;

      const pts: { x: number; y: number }[] = [];
      for (let tHot = Math.max(320, T2 + 20); tHot <= 1200; tHot += 40) {
        pts.push({ x: tHot, y: (1 - T2 / tHot) * 100 });
      }
      return {
        substitutedFormula: `η = 1 − (${T2}/${T1}) = ${(eta * 100).toFixed(1)}% | W = ${W.toFixed(0)} J`,
        readouts: [
          { symbol: 'η', label: { en: 'Efficiency', hi: 'दक्षता' }, value: (eta * 100).toFixed(1), unit: '%', accent: 'energy' },
          { symbol: 'W', label: { en: 'Work Output', hi: 'प्राप्त कार्य' }, value: W.toFixed(0), unit: 'J', accent: 'velocity' },
          { symbol: 'Q₂', label: { en: 'Rejected Heat', hi: 'निष्कासित ऊष्मा' }, value: Q2.toFixed(0), unit: 'J', accent: 'force' },
          { symbol: 'COP', label: { en: 'Fridge COP', hi: 'रेफ्रिजरेटर COP' }, value: (T2 / Math.max(1, T1 - T2)).toFixed(2), unit: '', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: T1, y: eta * 100 },
      };
    },
  };
}

function buildKineticTheory3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const box = new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.2, 4.2), p.glassMat(0.18));
  addCrispEdges(box, p.edgeMat());
  group.add(box);

  const particles: THREE.Mesh[] = [];
  for (let i = 0; i < 36; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), p.solidMat());
    s.position.set(((i % 6) - 2.5) * 0.6, ((Math.floor(i / 6) % 6) - 2.5) * 0.6, ((i % 4) - 1.5) * 0.7);
    s.userData = {
      vx: Math.sin(i * 2.1 + 0.5) * 1.8,
      vy: Math.cos(i * 1.7 + 0.3) * 1.8,
      vz: Math.sin(i * 3.3 + 0.2) * 1.8,
    };
    group.add(s);
    particles.push(s);
  }

  return {
    group,
    defaultCamPos: [4.2, 3.6, 7.6],
    defaultTarget: [0, 0, 0],
    update: (dt, _t, params) => {
      const T = Math.max(100, params.T ?? 300);
      const M = Math.max(2, params.M ?? 28); // g/mol
      const V = Math.max(1, params.V ?? 22.4);
      const N = Math.max(5, Math.min(36, Math.round(params.N ?? 24)));
      const R = 8.314;
      const vRms = Math.sqrt((3 * R * T) / (M * 1e-3));
      const keAvg = 1.5 * 1.38e-23 * T * 1e21; // ×10⁻²¹ J

      const half = 1.3 + Math.min(1.0, (V / 40) * 1.0);
      box.scale.setScalar(half / 2.1);
      const spd = Math.min(3.5, vRms / 350);

      particles.forEach((s, i) => {
        s.visible = i < N;
        if (!s.visible) return;
        s.position.x += s.userData.vx * spd * dt;
        s.position.y += s.userData.vy * spd * dt;
        s.position.z += s.userData.vz * spd * dt;
        const lim = half - 0.16;
        if (Math.abs(s.position.x) > lim) { s.position.x = Math.sign(s.position.x) * lim; s.userData.vx *= -1; }
        if (Math.abs(s.position.y) > lim) { s.position.y = Math.sign(s.position.y) * lim; s.userData.vy *= -1; }
        if (Math.abs(s.position.z) > lim) { s.position.z = Math.sign(s.position.z) * lim; s.userData.vz *= -1; }
      });

      const pts: { x: number; y: number }[] = [];
      for (let tt = 100; tt <= 1000; tt += 50) {
        pts.push({ x: tt, y: Math.sqrt((3 * R * tt) / (M * 1e-3)) });
      }
      return {
        substitutedFormula: `v_rms = √(3RT/M) = ${vRms.toFixed(0)} m/s`,
        readouts: [
          { symbol: 'v_rms', label: { en: 'RMS Speed', hi: 'वर्ग-माध्य-मूल चाल' }, value: vRms.toFixed(0), unit: 'm/s', accent: 'velocity' },
          { symbol: 'K_avg', label: { en: 'Avg Molecular KE', hi: 'औसत अणु ऊर्जा' }, value: keAvg.toFixed(2), unit: '×10⁻²¹ J', accent: 'energy' },
          { symbol: 'T', label: { en: 'Gas Temp', hi: 'गैस तापमान' }, value: T.toFixed(0), unit: 'K', accent: 'force' },
          { symbol: 'M', label: { en: 'Molar Mass', hi: 'मोलर द्रव्यमान' }, value: M.toFixed(0), unit: 'g/mol', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: T, y: vRms },
      };
    },
  };
}
