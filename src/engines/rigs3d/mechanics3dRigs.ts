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

export function buildMechanics3DRig(simId: string, theme: ThemeMode): SceneRig | null {
  const p = makePalette3D(theme);
  switch (simId) {
    case 'units-measurements':
      return buildUnitsMeasurements3D(p);
    case 'motion-1d':
      return buildMotion1D3D(p);
    case 'speed-velocity':
      return buildSpeedVelocity3D(p);
    case 'projectile':
      return buildProjectile3D(p);
    case 'relative-velocity':
      return buildRelativeVelocity3D(p);
    case 'circular-motion':
      return buildCircularMotion3D(p);
    case 'newtons-force':
      return buildNewtonsForce3D(p);
    case 'banking-roads':
      return buildBankingRoads3D(p);
    case 'atwood-pulley':
      return buildAtwoodPulley3D(p);
    case 'work-energy':
      return buildWorkEnergy3D(p);
    case 'work-power-basic':
      return buildWorkPower3D(p);
    case 'linear-momentum':
      return buildLinearMomentum3D(p);
    case 'impulse-momentum':
      return buildImpulseMomentum3D(p);
    case 'rolling-incline':
      return buildRollingIncline3D(p);
    case 'moment-of-inertia':
      return buildMomentOfInertia3D(p);
    case 'keplers-laws':
      return buildKeplersLaws3D(p);
    default:
      return null;
  }
}

function buildUnitsMeasurements3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const baseBeam = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.45, 0.45), p.contrastMat());
  addCrispEdges(baseBeam, p.edgeMat());
  baseBeam.position.set(0, 1.4, 0);
  group.add(baseBeam);

  const fixedJaw = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.5, 0.45), p.solidMat());
  addCrispEdges(fixedJaw, p.edgeMat());
  fixedJaw.position.set(-4.0, 0.4, 0);
  group.add(fixedJaw);

  const slidingJaw = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.5, 0.52), p.solidMat());
  addCrispEdges(slidingJaw, p.edgeMat());
  slidingJaw.position.set(-1.0, 0.4, 0);
  group.add(slidingJaw);

  const specimen = new THREE.Mesh(new THREE.BoxGeometry(1, 1.2, 1.2), p.matteMidMat());
  addCrispEdges(specimen, p.edgeMat());
  group.add(specimen);

  const tolBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1.35, 1.35), p.glassMat(0.28));
  addCrispEdges(tolBox, p.edgeMat());
  group.add(tolBox);

  const readoutBars = [0, 1, 2].map((i) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 0.8), i === 2 ? p.solidMat() : p.contrastMat());
    addCrispEdges(m, p.edgeMat());
    m.position.set(-1.4 + i * 1.4, -2.0, 1.8);
    group.add(m);
    return m;
  });

  return {
    group,
    defaultCamPos: [4.5, 3.6, 9.2],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params) => {
      const A = Math.max(0.1, params.A ?? 10);
      const dA = Math.max(0, params.dA ?? 0.5);
      const aExp = params.aExp ?? 2;
      const B = Math.max(0.1, params.B ?? 5);
      const dB = Math.max(0, params.dB ?? 0.2);
      const bExp = params.bExp ?? 1;

      const pctA = (Math.abs(aExp) * dA * 100) / A;
      const pctB = (Math.abs(bExp) * dB * 100) / B;
      const pctZ = pctA + pctB;
      const Z = Math.pow(A, aExp) * Math.pow(B, bExp);

      const widthVis = Math.min(6.2, Math.max(0.9, (A / 20) * 5.2));
      const wobble = Math.sin(t * 3.0) * Math.min(0.45, (dA / A) * 2.2);
      slidingJaw.position.x = -3.77 + widthVis + 0.23 + wobble;
      specimen.scale.set(widthVis, 1, 1);
      specimen.position.set(-3.77 + widthVis / 2, 0.25, 0);
      const tolW = Math.min(6.6, widthVis + (pctZ / 100) * 2.0);
      tolBox.scale.set(tolW, 1, 1);
      tolBox.position.set(-3.77 + widthVis / 2, 0.25, 0);

      const hA = Math.min(2.6, Math.max(0.2, pctA * 0.12));
      const hB = Math.min(2.6, Math.max(0.2, pctB * 0.12));
      const hZ = Math.min(2.8, Math.max(0.25, pctZ * 0.12));
      readoutBars[0].scale.y = hA;
      readoutBars[0].position.y = -2.2 + hA / 2;
      readoutBars[1].scale.y = hB;
      readoutBars[1].position.y = -2.2 + hB / 2;
      readoutBars[2].scale.y = hZ;
      readoutBars[2].position.y = -2.2 + hZ / 2;

      const pts: { x: number; y: number }[] = [];
      for (let x = 0; x <= 2.0; x += 0.1) {
        pts.push({ x, y: (Math.abs(aExp) * x * 100) / A + pctB });
      }
      return {
        substitutedFormula: `ΔZ/Z % = |${aExp}|(${dA}/${A}) + |${bExp}|(${dB}/${B}) = ${pctZ.toFixed(2)}%`,
        readouts: [
          { symbol: '%ΔZ', label: { en: 'Max % Error in Z', hi: 'अधिकतम % त्रुटि' }, value: pctZ.toFixed(2), unit: '%', accent: 'force' },
          { symbol: '%A', label: { en: 'A Contribution', hi: 'A का योगदान' }, value: pctA.toFixed(2), unit: '%', accent: 'velocity' },
          { symbol: '%B', label: { en: 'B Contribution', hi: 'B का योगदान' }, value: pctB.toFixed(2), unit: '%', accent: 'momentum' },
          { symbol: 'Z', label: { en: 'Computed Value', hi: 'गणित मान Z' }, value: Z > 9999 ? Z.toExponential(2) : Z.toFixed(2), unit: '', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: Math.min(2, dA), y: pctZ },
      };
    },
    getCallouts: (_params, tel) => [
      { label: `ΔZ/Z = ${tel.readouts[0]?.value}%`, pos: [0, 2.2, 0] },
      { label: `Fixed Jaw`, pos: [-4.0, -1.2, 0] },
    ],
  };
}

function buildMotion1D3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const track = new THREE.Mesh(new THREE.BoxGeometry(12, 0.22, 2.2), p.contrastMat());
  addCrispEdges(track, p.edgeMat());
  track.position.y = -0.5;
  group.add(track);

  // Distance tick markers
  for (let i = -5; i <= 5; i++) {
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.5), p.solidMat());
    tick.position.set(i, -0.36, 0.75);
    group.add(tick);
  }

  const cart = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 0.9), p.solidMat());
  addCrispEdges(body, p.edgeMat());
  body.position.y = 0.25;
  cart.add(body);
  const wheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.16, 16);
  wheelGeo.rotateX(Math.PI / 2);
  [[-0.45, 0.48], [0.45, 0.48], [-0.45, -0.48], [0.45, -0.48]].forEach(([wx, wz]) => {
    const w = new THREE.Mesh(wheelGeo, p.matteMidMat());
    w.position.set(wx, -0.1, wz);
    cart.add(w);
  });
  group.add(cart);

  const velArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.2, p.primaryHex, 0.35, 0.2);
  const accArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.0, p.midHex, 0.3, 0.18);
  group.add(velArrow, accArrow);

  const curveLine = createReusableLine(40, p.edgeMat());
  group.add(curveLine);

  return {
    group,
    defaultCamPos: [0, 3.8, 10.5],
    defaultTarget: [0, 0.4, 0],
    update: (_dt, t, params, showVectors) => {
      const u = params.u ?? 5;
      const a = params.a ?? 2;
      const tMax = Math.max(1, params.tMax ?? 6);
      const tSim = t % tMax;
      const v = u + a * tSim;
      const s = u * tSim + 0.5 * a * tSim * tSim;
      const sMax = Math.max(10, Math.abs(u * tMax + 0.5 * a * tMax * tMax), 1);

      const xPos = -5.0 + Math.max(-0.5, Math.min(10.0, (s / sMax) * 10.0));
      cart.position.set(xPos, -0.15, 0);

      velArrow.visible = showVectors && Math.abs(v) > 0.1;
      velArrow.position.set(xPos, 0.65, 0);
      velArrow.setDirection(new THREE.Vector3(v >= 0 ? 1 : -1, 0, 0));
      velArrow.setLength(Math.min(2.8, Math.max(0.4, Math.abs(v) * 0.1)), 0.35, 0.2);

      accArrow.visible = showVectors && Math.abs(a) > 0.1;
      accArrow.position.set(xPos, 1.05, 0);
      accArrow.setDirection(new THREE.Vector3(a >= 0 ? 1 : -1, 0, 0));
      accArrow.setLength(Math.min(2.2, Math.max(0.35, Math.abs(a) * 0.22)), 0.3, 0.16);

      // 3D displacement curve floating behind track
      const coords: [number, number, number][] = [];
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < 40; i++) {
        const ti = (i / 39) * tMax;
        const si = u * ti + 0.5 * a * ti * ti;
        pts.push({ x: ti, y: si });
        coords.push([-5 + (i / 39) * 10, 0.2 + (si / sMax) * 3.0, -1.6]);
      }
      setLinePoints(curveLine, coords);

      return {
        substitutedFormula: `s = (${u})(${tSim.toFixed(1)}) + ½(${a})(${tSim.toFixed(1)})² = ${s.toFixed(1)} m`,
        readouts: [
          { symbol: 's', label: { en: 'Displacement', hi: 'विस्थापन' }, value: s.toFixed(1), unit: 'm', accent: 'momentum' },
          { symbol: 'v', label: { en: 'Velocity', hi: 'वेग' }, value: v.toFixed(1), unit: 'm/s', accent: 'velocity' },
          { symbol: 'a', label: { en: 'Acceleration', hi: 'त्वरण' }, value: a.toFixed(1), unit: 'm/s²', accent: 'force' },
          { symbol: 't', label: { en: 'Elapsed Time', hi: 'समय' }, value: tSim.toFixed(2), unit: 's', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: tSim, y: s },
      };
    },
    getStrobePos: () => cart.position.clone(),
    getCallouts: (_params, tel) => [
      { label: `v = ${tel.readouts[1]?.value} m/s`, pos: [cart.position.x, 1.4, 0] },
      { label: `s = ${tel.readouts[0]?.value} m`, pos: [cart.position.x, -0.7, 0.6] },
    ],
  };
}

function buildSpeedVelocity3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const trackRing = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.14, 14, 72), p.contrastMat());
  trackRing.rotation.x = Math.PI / 2;
  group.add(trackRing);

  const startGate = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.2, 0.8), p.solidMat());
  addCrispEdges(startGate, p.edgeMat());
  startGate.position.set(3.2, 0.6, 0);
  group.add(startGate);

  const runner = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), p.solidMat());
  group.add(runner);

  const dispLine = createReusableLine(2, p.edgeMat());
  group.add(dispLine);
  const velArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 1.4, p.primaryHex, 0.35, 0.2);
  group.add(velArrow);

  return {
    group,
    defaultCamPos: [0, 6.2, 7.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params, showVectors) => {
      const R = Math.max(2, params.R ?? 20);
      const v = Math.max(1, params.v ?? 10);
      const tDur = Math.max(0.5, params.t ?? 6);
      const dist = v * tDur;
      const theta = dist / R;
      const disp = 2 * R * Math.abs(Math.sin(theta / 2));
      const vAvg = disp / tDur;

      const visR = 2.0 + ((R - 5) / 45) * 2.0;
      trackRing.scale.setScalar(visR / 3.2);
      startGate.position.set(visR, 0.6, 0);

      const animPhase = (t * 0.8) % Math.max(0.4, theta);
      const ang = Math.min(theta, animPhase);
      const rx = visR * Math.cos(ang);
      const rz = -visR * Math.sin(ang);
      runner.position.set(rx, 0.32, rz);
      setLinePoints(dispLine, [
        [visR, 0.32, 0],
        [rx, 0.32, rz],
      ]);

      velArrow.visible = showVectors;
      velArrow.position.set(rx, 0.32, rz);
      velArrow.setDirection(new THREE.Vector3(-Math.sin(ang), 0, -Math.cos(ang)).normalize());
      velArrow.setLength(Math.min(2.2, 0.6 + v * 0.06), 0.35, 0.2);

      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= 40; i++) {
        const ti = (i / 40) * Math.max(10, tDur * 1.4);
        const th = (v * ti) / R;
        pts.push({ x: ti, y: 2 * R * Math.abs(Math.sin(th / 2)) });
      }
      return {
        substitutedFormula: `Distance d = ${dist.toFixed(1)} m | Displacement |Δr| = 2(${R})|sin(${(theta / 2).toFixed(2)})| = ${disp.toFixed(1)} m`,
        readouts: [
          { symbol: 'd', label: { en: 'Path Distance', hi: 'कुल दूरी' }, value: dist.toFixed(1), unit: 'm', accent: 'velocity' },
          { symbol: '|Δr|', label: { en: 'Displacement', hi: 'विस्थापन' }, value: disp.toFixed(1), unit: 'm', accent: 'momentum' },
          { symbol: 'v_avg', label: { en: 'Avg Velocity', hi: 'औसत वेग' }, value: vAvg.toFixed(2), unit: 'm/s', accent: 'force' },
          { symbol: 'v', label: { en: 'Avg Speed', hi: 'औसत चाल' }, value: v.toFixed(1), unit: 'm/s', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: tDur, y: disp },
      };
    },
    getStrobePos: () => runner.position.clone(),
    getCallouts: (_params, tel) => [
      { label: `|Δr| = ${tel.readouts[1]?.value} m`, pos: [runner.position.x * 0.5, 0.9, runner.position.z * 0.5] },
      { label: `d = ${tel.readouts[0]?.value} m`, pos: [runner.position.x, 1.1, runner.position.z] },
    ],
  };
}

function buildProjectile3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const ground = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 4.5), p.contrastMat());
  addCrispEdges(ground, p.edgeMat());
  ground.position.y = -0.1;
  group.add(ground);

  const cannonBase = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 0.5, 18), p.solidMat());
  cannonBase.position.set(-4.8, 0.25, 0);
  group.add(cannonBase);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 1.3, 16), p.solidMat());
  barrel.geometry.translate(0, 0.65, 0);
  barrel.position.set(-4.8, 0.45, 0);
  group.add(barrel);

  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), p.solidMat());
  group.add(ball);

  const trajLine = createReusableLine(60, p.edgeMat());
  group.add(trajLine);
  const velArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.2, p.primaryHex, 0.3, 0.18);
  group.add(velArrow);

  const apexMarker = new THREE.Mesh(new THREE.OctahedronGeometry(0.18), p.matteMidMat());
  group.add(apexMarker);

  return {
    group,
    defaultCamPos: [0, 3.6, 10.6],
    defaultTarget: [0, 1.6, 0],
    update: (_dt, t, params, showVectors) => {
      const u = Math.max(1, params.u ?? 25);
      const thetaDeg = params.theta ?? 45;
      const g = Math.max(1, params.g ?? 9.8);
      const rad = (thetaDeg * Math.PI) / 180;
      const T = (2 * u * Math.sin(rad)) / g;
      const R = (u * u * Math.sin(2 * rad)) / g;
      const H = (u * u * Math.sin(rad) * Math.sin(rad)) / (2 * g);

      barrel.rotation.z = -(Math.PI / 2 - rad);
      const scale = Math.min(9.4 / Math.max(R, 12), 4.2 / Math.max(H, 6));
      const tSim = t % Math.max(0.2, T);
      const px = u * Math.cos(rad) * tSim;
      const py = Math.max(0, u * Math.sin(rad) * tSim - 0.5 * g * tSim * tSim);
      const vx = u * Math.cos(rad);
      const vy = u * Math.sin(rad) - g * tSim;

      const bx = -4.8 + px * scale;
      const by = 0.25 + py * scale;
      ball.position.set(bx, by, 0);
      apexMarker.position.set(-4.8 + (R / 2) * scale, 0.25 + H * scale, 0);

      const coords: [number, number, number][] = [];
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < 60; i++) {
        const ti = (i / 59) * T;
        const xi = u * Math.cos(rad) * ti;
        const yi = Math.max(0, u * Math.sin(rad) * ti - 0.5 * g * ti * ti);
        coords.push([-4.8 + xi * scale, 0.25 + yi * scale, 0]);
        pts.push({ x: xi, y: yi });
      }
      setLinePoints(trajLine, coords);

      velArrow.visible = showVectors;
      velArrow.position.set(bx, by, 0);
      velArrow.setDirection(new THREE.Vector3(vx, vy, 0).normalize());
      velArrow.setLength(Math.min(2.2, 0.5 + Math.hypot(vx, vy) * 0.04), 0.3, 0.18);

      return {
        substitutedFormula: `R = (${u}² sin ${2 * thetaDeg}°) / ${g} = ${R.toFixed(1)} m | H_max = ${H.toFixed(1)} m`,
        readouts: [
          { symbol: 'R', label: { en: 'Range', hi: 'क्षैतिज परास' }, value: R.toFixed(1), unit: 'm', accent: 'momentum' },
          { symbol: 'H', label: { en: 'Max Height', hi: 'अधिकतम ऊँचाई' }, value: H.toFixed(1), unit: 'm', accent: 'energy' },
          { symbol: 'T', label: { en: 'Time of Flight', hi: 'उड्डयन काल' }, value: T.toFixed(2), unit: 's', accent: 'velocity' },
          { symbol: 'θ', label: { en: 'Launch Angle', hi: 'प्रक्षेपण कोण' }, value: thetaDeg.toFixed(0), unit: '°', accent: 'force' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: px, y: py },
      };
    },
    getStrobePos: () => ball.position.clone(),
    getCallouts: (_params, tel) => [
      { label: `H = ${tel.readouts[1]?.value} m`, pos: [apexMarker.position.x, apexMarker.position.y + 0.5, 0] },
      { label: `R = ${tel.readouts[0]?.value} m`, pos: [0.5, 0.4, 0.8] },
    ],
  };
}

function buildRelativeVelocity3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const river = new THREE.Mesh(new THREE.BoxGeometry(10, 0.15, 5.2), p.glassMat(0.28));
  addCrispEdges(river, p.edgeMat());
  group.add(river);

  const bankNear = new THREE.Mesh(new THREE.BoxGeometry(10, 0.3, 1.0), p.contrastMat());
  bankNear.position.set(0, 0.1, 3.1);
  const bankFar = new THREE.Mesh(new THREE.BoxGeometry(10, 0.3, 1.0), p.contrastMat());
  bankFar.position.set(0, 0.1, -3.1);
  addCrispEdges(bankNear, p.edgeMat());
  addCrispEdges(bankFar, p.edgeMat());
  group.add(bankNear, bankFar);

  const boat = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.1, 4), p.solidMat());
  boat.rotation.x = -Math.PI / 2;
  addCrispEdges(boat, p.edgeMat());
  group.add(boat);

  const vBoatArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(), 1.2, p.primaryHex, 0.3, 0.18);
  const vRiverArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.0, p.midHex, 0.3, 0.16);
  group.add(vBoatArrow, vRiverArrow);

  return {
    group,
    defaultCamPos: [0, 6.2, 7.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params, showVectors) => {
      const vb = Math.max(1, params.vb ?? 6);
      const vr = params.vr ?? 3;
      const thetaDeg = params.theta ?? 0;
      const width = Math.max(20, params.width ?? 120);
      const rad = (thetaDeg * Math.PI) / 180;
      const vAcross = Math.max(0.5, vb * Math.cos(rad));
      const vDrift = vr - vb * Math.sin(rad);
      const tCross = width / vAcross;
      const drift = vDrift * tCross;
      const vRes = Math.hypot(vAcross, vDrift);

      const frac = (t * 0.35) % 1;
      const bz = 2.4 - frac * 4.8;
      const bx = Math.max(-4.5, Math.min(4.5, (drift / width) * 3.0 * frac));
      boat.position.set(bx, 0.25, bz);
      boat.rotation.z = rad;

      vBoatArrow.visible = showVectors;
      vBoatArrow.position.set(bx, 0.45, bz);
      vBoatArrow.setDirection(new THREE.Vector3(-Math.sin(rad), 0, -Math.cos(rad)).normalize());
      vBoatArrow.setLength(Math.min(2.2, vb * 0.22), 0.3, 0.18);

      vRiverArrow.visible = showVectors;
      vRiverArrow.position.set(bx, 0.45, bz);
      vRiverArrow.setDirection(new THREE.Vector3(1, 0, 0));
      vRiverArrow.setLength(Math.min(2.0, Math.max(0.3, vr * 0.22)), 0.28, 0.16);

      const pts: { x: number; y: number }[] = [];
      for (let ang = -60; ang <= 60; ang += 5) {
        const r = (ang * Math.PI) / 180;
        const va = Math.max(0.3, vb * Math.cos(r));
        pts.push({ x: ang, y: ((vr - vb * Math.sin(r)) * width) / va });
      }
      return {
        substitutedFormula: `t = ${width}/(${vAcross.toFixed(2)}) = ${tCross.toFixed(1)} s | Drift = ${drift.toFixed(1)} m`,
        readouts: [
          { symbol: 't', label: { en: 'Crossing Time', hi: 'पार समय' }, value: tCross.toFixed(1), unit: 's', accent: 'velocity' },
          { symbol: 'x', label: { en: 'Downstream Drift', hi: 'बहाव दूरी' }, value: drift.toFixed(1), unit: 'm', accent: 'force' },
          { symbol: 'v_net', label: { en: 'Resultant Speed', hi: 'परिणामी चाल' }, value: vRes.toFixed(2), unit: 'm/s', accent: 'momentum' },
          { symbol: 'v_y', label: { en: 'Across Speed', hi: 'लंबवत चाल' }, value: vAcross.toFixed(2), unit: 'm/s', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: thetaDeg, y: drift },
      };
    },
    getStrobePos: () => boat.position.clone(),
  };
}

function buildCircularMotion3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 1.4, 20), p.contrastMat());
  addCrispEdges(post, p.edgeMat());
  group.add(post);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.05, 10, 64), p.matteMidMat());
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const bob = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 24), p.solidMat());
  group.add(bob);

  const tether = createReusableLine(2, p.edgeMat());
  group.add(tether);

  const fcArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(), 1.5, p.primaryHex, 0.35, 0.2);
  const vArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 1.5, p.midHex, 0.35, 0.2);
  group.add(fcArrow, vArrow);

  return {
    group,
    defaultCamPos: [0, 5.8, 7.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params, showVectors) => {
      const m = Math.max(0.2, params.m ?? 2);
      const r = Math.max(0.5, params.r ?? 2.5);
      const omega = Math.max(0.2, params.omega ?? 2.5);
      const v = omega * r;
      const ac = omega * omega * r;
      const Fc = m * ac;

      const visR = 1.4 + (r / 6) * 2.4;
      ring.scale.setScalar(visR / 3.0);
      const ang = t * omega * 0.7;
      const bx = visR * Math.cos(ang);
      const bz = visR * Math.sin(ang);
      bob.position.set(bx, 0, bz);
      bob.scale.setScalar(0.75 + Math.min(0.6, m * 0.08));
      setLinePoints(tether, [[0, 0, 0], [bx, 0, bz]]);

      fcArrow.visible = showVectors;
      fcArrow.position.set(bx, 0, bz);
      fcArrow.setDirection(new THREE.Vector3(-bx, 0, -bz).normalize());
      fcArrow.setLength(Math.min(visR * 0.85, 0.5 + Fc * 0.025), 0.32, 0.18);

      vArrow.visible = showVectors;
      vArrow.position.set(bx, 0, bz);
      vArrow.setDirection(new THREE.Vector3(-Math.sin(ang), 0, Math.cos(ang)).normalize());
      vArrow.setLength(Math.min(2.4, 0.5 + v * 0.12), 0.32, 0.18);

      const pts: { x: number; y: number }[] = [];
      for (let w = 0.5; w <= 8; w += 0.25) {
        pts.push({ x: w, y: m * w * w * r });
      }
      return {
        substitutedFormula: `F_c = (${m})(${omega}²)(${r}) = ${Fc.toFixed(1)} N`,
        readouts: [
          { symbol: 'F_c', label: { en: 'Centripetal Force', hi: 'अभिकेंद्रीय बल' }, value: Fc.toFixed(1), unit: 'N', accent: 'force' },
          { symbol: 'a_c', label: { en: 'Centripetal Accel', hi: 'अभिकेंद्रीय त्वरण' }, value: ac.toFixed(1), unit: 'm/s²', accent: 'momentum' },
          { symbol: 'v', label: { en: 'Tangential Speed', hi: 'स्पर्शरेखीय चाल' }, value: v.toFixed(2), unit: 'm/s', accent: 'velocity' },
          { symbol: 'T', label: { en: 'Time Period', hi: 'आवर्तकाल' }, value: ((2 * Math.PI) / omega).toFixed(2), unit: 's', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: omega, y: Fc },
      };
    },
    getStrobePos: () => bob.position.clone(),
    getCallouts: (_params, tel) => [
      { label: `F_c = ${tel.readouts[0]?.value} N`, pos: [bob.position.x * 0.5, 0.7, bob.position.z * 0.5] },
    ],
  };
}

function buildNewtonsForce3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const rampGroup = new THREE.Group();
  const surface = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.22, 2.8), p.contrastMat());
  addCrispEdges(surface, p.edgeMat());
  rampGroup.add(surface);

  const crate = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 1.4), p.solidMat());
  addCrispEdges(crate, p.edgeMat());
  crate.position.set(-2.5, 0.66, 0);
  rampGroup.add(crate);

  const pushArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.4, p.primaryHex, 0.35, 0.2);
  const fricArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(), 1.0, p.midHex, 0.3, 0.18);
  rampGroup.add(pushArrow, fricArrow);
  group.add(rampGroup);

  let posX = -3.0;
  return {
    group,
    defaultCamPos: [2.2, 3.8, 9.5],
    defaultTarget: [0, 0.5, 0],
    update: (dt, _t, params, showVectors) => {
      const F = params.F ?? 40;
      const m = Math.max(0.5, params.m ?? 5);
      const mu = params.mu ?? 0.25;
      const angleDeg = params.angle ?? 0;
      const rad = (angleDeg * Math.PI) / 180;
      const g = 9.81;

      const N = m * g * Math.cos(rad);
      const fMax = mu * N;
      const mgSin = m * g * Math.sin(rad);
      const drive = F - mgSin;
      const netF = Math.abs(drive) <= fMax ? 0 : drive - Math.sign(drive) * fMax;
      const acc = netF / m;

      rampGroup.rotation.z = rad;
      posX += acc * dt * 0.45;
      if (posX > 4.2) posX = -4.2;
      if (posX < -4.2) posX = 4.2;
      crate.position.x = posX;
      crate.scale.setScalar(0.85 + Math.min(0.45, m * 0.03));

      pushArrow.visible = showVectors && F > 0.1;
      pushArrow.position.set(posX + 0.7, 0.75, 0);
      pushArrow.setLength(Math.min(2.6, 0.5 + F * 0.025), 0.32, 0.18);

      fricArrow.visible = showVectors && fMax > 0.1;
      fricArrow.position.set(posX - 0.7, 0.45, 0);
      fricArrow.setLength(Math.min(2.2, 0.4 + fMax * 0.025), 0.28, 0.16);

      const pts: { x: number; y: number }[] = [];
      for (let f = 0; f <= 100; f += 4) {
        const d = f - mgSin;
        const nf = Math.abs(d) <= fMax ? 0 : d - Math.sign(d) * fMax;
        pts.push({ x: f, y: nf / m });
      }
      return {
        substitutedFormula: `a = (${F.toFixed(1)} − ${mgSin.toFixed(1)} − ${fMax.toFixed(1)}) / ${m} = ${acc.toFixed(2)} m/s²`,
        readouts: [
          { symbol: 'a', label: { en: 'Net Acceleration', hi: 'परिणामी त्वरण' }, value: acc.toFixed(2), unit: 'm/s²', accent: 'velocity' },
          { symbol: 'F_net', label: { en: 'Net Force', hi: 'परिणामी बल' }, value: netF.toFixed(1), unit: 'N', accent: 'force' },
          { symbol: 'f_max', label: { en: 'Max Friction', hi: 'अधिकतम घर्षण' }, value: fMax.toFixed(1), unit: 'N', accent: 'momentum' },
          { symbol: 'N', label: { en: 'Normal Force', hi: 'अभिलंब बल' }, value: N.toFixed(1), unit: 'N', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: F, y: acc },
      };
    },
    getStrobePos: () => crate.getWorldPosition(new THREE.Vector3()),
  };
}

function buildBankingRoads3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const roadSlope = new THREE.Group();
  const roadSlab = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.24, 9.0), p.contrastMat());
  addCrispEdges(roadSlab, p.edgeMat());
  roadSlope.add(roadSlab);

  const car = new THREE.Group();
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 2.6), p.solidMat());
  addCrispEdges(chassis, p.edgeMat());
  chassis.position.y = 0.42;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.42, 1.3), p.matteMidMat());
  addCrispEdges(cabin, p.edgeMat());
  cabin.position.set(0, 0.85, -0.1);
  car.add(chassis, cabin);
  roadSlope.add(car);

  const normalArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.7, 0), 2.2, p.primaryHex, 0.35, 0.2);
  roadSlope.add(normalArrow);
  group.add(roadSlope);

  const weightArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0.6, 0), 2.0, p.midHex, 0.35, 0.2);
  group.add(weightArrow);

  return {
    group,
    defaultCamPos: [0, 3.6, 9.2],
    defaultTarget: [0, 0.6, 0],
    update: (_dt, t, params, showVectors) => {
      const R = Math.max(10, params.R ?? 60);
      const thetaDeg = params.theta ?? 18;
      const mu = params.mu ?? 0.25;
      const v = params.v ?? 22;
      const g = 9.81;
      const rad = (thetaDeg * Math.PI) / 180;
      const tanT = Math.tan(rad);
      const vOpt = Math.sqrt(R * g * tanT);
      const denom = Math.max(0.05, 1 - mu * tanT);
      const vMax = Math.sqrt((R * g * (mu + tanT)) / denom);

      roadSlope.rotation.z = rad;
      const skid = v > vMax ? Math.sin(t * 6) * 0.45 + 0.65 : Math.sin(t * 2.5) * 0.12;
      car.position.x = skid;
      car.position.z = ((t * v * 0.14) % 5.0) - 2.5;
      normalArrow.visible = showVectors;
      weightArrow.visible = showVectors;

      const pts: { x: number; y: number }[] = [];
      for (let ang = 0; ang <= 45; ang += 3) {
        const rr = (ang * Math.PI) / 180;
        const tt = Math.tan(rr);
        pts.push({ x: ang, y: Math.sqrt((R * g * (mu + tt)) / Math.max(0.08, 1 - mu * tt)) });
      }
      return {
        substitutedFormula: `v_max = √[Rg(μ+tanθ)/(1−μtanθ)] = ${vMax.toFixed(1)} m/s | v_opt = ${vOpt.toFixed(1)} m/s`,
        readouts: [
          { symbol: 'v_max', label: { en: 'Max Safe Speed', hi: 'अधिकतम सुरक्षित चाल' }, value: vMax.toFixed(1), unit: 'm/s', accent: 'force' },
          { symbol: 'v_opt', label: { en: 'Frictionless Speed', hi: 'बिना घर्षण चाल' }, value: vOpt.toFixed(1), unit: 'm/s', accent: 'velocity' },
          { symbol: 'v', label: { en: 'Current Speed', hi: 'वर्तमान चाल' }, value: v.toFixed(1), unit: 'm/s', accent: 'momentum' },
          { symbol: 'Status', label: { en: 'Road Grip', hi: 'पकड़ स्थिति' }, value: v <= vMax ? 'SAFE' : 'SKID', unit: '', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: thetaDeg, y: vMax },
      };
    },
    getCallouts: (_params, tel) => [
      { label: `v_max = ${tel.readouts[0]?.value} m/s`, pos: [0, 2.5, 0] },
      { label: `Grip: ${tel.readouts[3]?.value}`, pos: [2.2, 1.2, 0] },
    ],
  };
}

function buildAtwoodPulley3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const beam = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.25, 0.6), p.contrastMat());
  addCrispEdges(beam, p.edgeMat());
  beam.position.y = 3.2;
  group.add(beam);

  const pulley = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.28, 28), p.matteMidMat());
  pulley.rotation.x = Math.PI / 2;
  addCrispEdges(pulley, p.edgeMat());
  pulley.position.y = 2.4;
  group.add(pulley);

  const m1Box = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.95), p.solidMat());
  const m2Box = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.95), p.contrastMat());
  addCrispEdges(m1Box, p.edgeMat());
  addCrispEdges(m2Box, p.edgeMat());
  group.add(m1Box, m2Box);

  const ropeLeft = createReusableLine(2, p.edgeMat());
  const ropeRight = createReusableLine(2, p.edgeMat());
  group.add(ropeLeft, ropeRight);

  let offset = 0;
  return {
    group,
    defaultCamPos: [0, 1.5, 9.2],
    defaultTarget: [0, 0.5, 0],
    update: (dt, _t, params) => {
      const m1 = Math.max(0.5, params.m1 ?? 5);
      const m2 = Math.max(0.5, params.m2 ?? 3);
      const g = Math.max(1, params.g ?? 9.8);
      const a = ((m1 - m2) * g) / (m1 + m2);
      const T = (2 * m1 * m2 * g) / (m1 + m2);

      offset += a * dt * 0.25;
      if (offset > 1.7) offset = -1.7;
      if (offset < -1.7) offset = 1.7;

      const y1 = 0 - offset;
      const y2 = 0 + offset;
      m1Box.position.set(-0.75, y1, 0);
      m2Box.position.set(0.75, y2, 0);
      m1Box.scale.setScalar(0.7 + Math.min(0.65, m1 * 0.06));
      m2Box.scale.setScalar(0.7 + Math.min(0.65, m2 * 0.06));
      pulley.rotation.z -= a * dt * 0.6;

      setLinePoints(ropeLeft, [[-0.75, 2.4, 0], [-0.75, y1 + 0.45, 0]]);
      setLinePoints(ropeRight, [[0.75, 2.4, 0], [0.75, y2 + 0.45, 0]]);

      const pts: { x: number; y: number }[] = [];
      for (let x = 1; x <= 15; x += 0.5) {
        pts.push({ x, y: ((x - m2) * g) / (x + m2) });
      }
      return {
        substitutedFormula: `a = (${m1}−${m2})g/(${m1}+${m2}) = ${a.toFixed(2)} m/s² | T = ${T.toFixed(1)} N`,
        readouts: [
          { symbol: 'a', label: { en: 'Acceleration', hi: 'त्वरण' }, value: a.toFixed(2), unit: 'm/s²', accent: 'velocity' },
          { symbol: 'T', label: { en: 'String Tension', hi: 'डोरी का तनाव' }, value: T.toFixed(1), unit: 'N', accent: 'force' },
          { symbol: 'W₁', label: { en: 'Weight m₁g', hi: 'भार m₁g' }, value: (m1 * g).toFixed(1), unit: 'N', accent: 'momentum' },
          { symbol: 'W₂', label: { en: 'Weight m₂g', hi: 'भार m₂g' }, value: (m2 * g).toFixed(1), unit: 'N', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: m1, y: a },
      };
    },
    getCallouts: (_params, tel) => [
      { label: `T = ${tel.readouts[1]?.value} N`, pos: [0, 3.1, 0] },
      { label: `a = ${tel.readouts[0]?.value} m/s²`, pos: [-1.8, m1Box.position.y, 0] },
    ],
  };
}

function buildWorkEnergy3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const trackLine = createReusableLine(64, p.edgeMat());
  group.add(trackLine);
  const trackBack = createReusableLine(64, p.mutedLineMat());
  group.add(trackBack);

  const cart = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), p.solidMat());
  group.add(cart);

  // Live 3D energy bars (K, U, Total)
  const kBar = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1, 0.65), p.solidMat());
  const uBar = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1, 0.65), p.contrastMat());
  addCrispEdges(kBar, p.edgeMat());
  addCrispEdges(uBar, p.edgeMat());
  kBar.position.set(4.2, -1, 0);
  uBar.position.set(5.1, -1, 0);
  group.add(kBar, uBar);

  return {
    group,
    defaultCamPos: [0.5, 3.6, 10.2],
    defaultTarget: [0.4, 0.5, 0],
    update: (_dt, t, params) => {
      const m = Math.max(0.5, params.m ?? 2);
      const h0 = Math.max(1, params.h0 ?? 10);
      const g = Math.max(1, params.g ?? 9.8);
      const damping = Math.max(0, params.damping ?? 0);

      const amp = Math.exp(-damping * (t % 12) * 0.25);
      const phase = Math.cos(t * 1.9);
      const xNorm = phase * amp; // -1 to 1
      const h = h0 * xNorm * xNorm;
      const E0 = m * g * h0 * amp * amp;
      const U = m * g * h;
      const K = Math.max(0, E0 - U);
      const v = Math.sqrt((2 * K) / m);

      const coordsF: [number, number, number][] = [];
      const coordsB: [number, number, number][] = [];
      for (let i = 0; i < 64; i++) {
        const u = -1 + (i / 63) * 2;
        const y = -1.6 + u * u * 3.6;
        coordsF.push([u * 3.6, y, 0.4]);
        coordsB.push([u * 3.6, y, -0.4]);
      }
      setLinePoints(trackLine, coordsF);
      setLinePoints(trackBack, coordsB);

      const cx = xNorm * 3.6;
      const cy = -1.6 + xNorm * xNorm * 3.6 + 0.36;
      cart.position.set(cx, cy, 0);

      const Emax = Math.max(1, m * g * h0);
      const hk = Math.max(0.12, (K / Emax) * 3.2);
      const hu = Math.max(0.12, (U / Emax) * 3.2);
      kBar.scale.y = hk;
      kBar.position.y = -1.6 + hk / 2;
      uBar.scale.y = hu;
      uBar.position.y = -1.6 + hu / 2;

      const pts: { x: number; y: number }[] = [];
      for (let hh = 0; hh <= h0; hh += h0 / 24) {
        pts.push({ x: hh, y: m * g * (h0 - hh) });
      }
      return {
        substitutedFormula: `E = K(${K.toFixed(1)}) + U(${U.toFixed(1)}) = ${(K + U).toFixed(1)} J`,
        readouts: [
          { symbol: 'K', label: { en: 'Kinetic Energy', hi: 'गतिज ऊर्जा' }, value: K.toFixed(1), unit: 'J', accent: 'velocity' },
          { symbol: 'U', label: { en: 'Potential Energy', hi: 'स्थितिज ऊर्जा' }, value: U.toFixed(1), unit: 'J', accent: 'energy' },
          { symbol: 'v', label: { en: 'Speed', hi: 'चाल' }, value: v.toFixed(2), unit: 'm/s', accent: 'momentum' },
          { symbol: 'E', label: { en: 'Total Mechanical E', hi: 'कुल ऊर्जा' }, value: (K + U).toFixed(1), unit: 'J', accent: 'force' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: h, y: K },
      };
    },
    getStrobePos: () => cart.position.clone(),
  };
}

function buildWorkPower3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const floor = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.2, 3.0), p.contrastMat());
  addCrispEdges(floor, p.edgeMat());
  floor.position.y = -0.5;
  group.add(floor);

  const block = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 1.2), p.solidMat());
  addCrispEdges(block, p.edgeMat());
  group.add(block);

  const pullArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 2.0, p.primaryHex, 0.35, 0.2);
  group.add(pullArrow);

  return {
    group,
    defaultCamPos: [0, 3.2, 8.8],
    defaultTarget: [0, 0.3, 0],
    update: (_dt, t, params, showVectors) => {
      const F = params.F ?? 50;
      const d = params.d ?? 10;
      const thetaDeg = params.theta ?? 30;
      const tSec = Math.max(0.5, params.t ?? 4);
      const rad = (thetaDeg * Math.PI) / 180;
      const W = F * d * Math.cos(rad);
      const P = W / tSec;

      const frac = (t % tSec) / tSec;
      const bx = -4.0 + frac * Math.min(8.0, d * 0.4);
      block.position.set(bx, 0.1, 0);

      pullArrow.visible = showVectors;
      pullArrow.position.set(bx + 0.7, 0.3, 0);
      pullArrow.setDirection(new THREE.Vector3(Math.cos(rad), Math.sin(rad), 0).normalize());
      pullArrow.setLength(Math.min(2.6, 0.6 + F * 0.02), 0.35, 0.2);

      const pts: { x: number; y: number }[] = [];
      for (let ang = 0; ang <= 180; ang += 6) {
        pts.push({ x: ang, y: F * d * Math.cos((ang * Math.PI) / 180) });
      }
      return {
        substitutedFormula: `W = (${F})(${d})cos(${thetaDeg}°) = ${W.toFixed(1)} J | P = ${P.toFixed(1)} W`,
        readouts: [
          { symbol: 'W', label: { en: 'Work Done', hi: 'किया गया कार्य' }, value: W.toFixed(1), unit: 'J', accent: 'energy' },
          { symbol: 'P', label: { en: 'Average Power', hi: 'औसत शक्ति' }, value: P.toFixed(1), unit: 'W', accent: 'force' },
          { symbol: 'Fcosθ', label: { en: 'Effective Force', hi: 'प्रभावी बल' }, value: (F * Math.cos(rad)).toFixed(1), unit: 'N', accent: 'momentum' },
          { symbol: 't', label: { en: 'Time Taken', hi: 'समय' }, value: tSec.toFixed(1), unit: 's', accent: 'velocity' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: thetaDeg, y: W },
      };
    },
    getStrobePos: () => block.position.clone(),
  };
}

function buildLinearMomentum3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const rail = new THREE.Mesh(new THREE.BoxGeometry(11, 0.22, 2.2), p.contrastMat());
  addCrispEdges(rail, p.edgeMat());
  rail.position.y = -0.5;
  group.add(rail);

  const b1 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, 1.1), p.solidMat());
  const b2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, 1.1), p.matteMidMat());
  addCrispEdges(b1, p.edgeMat());
  addCrispEdges(b2, p.edgeMat());
  group.add(b1, b2);

  return {
    group,
    defaultCamPos: [0, 3.2, 9.4],
    defaultTarget: [0, 0.2, 0],
    update: (_dt, t, params) => {
      const m1 = Math.max(0.5, params.m1 ?? 3);
      const u1 = params.u1 ?? 6;
      const m2 = Math.max(0.5, params.m2 ?? 2);
      const u2 = params.u2 ?? -2;
      const e = Math.max(0, Math.min(1, params.e ?? 1));

      const v1 = ((m1 - e * m2) * u1 + (1 + e) * m2 * u2) / (m1 + m2);
      const v2 = ((m2 - e * m1) * u2 + (1 + e) * m1 * u1) / (m1 + m2);
      const pTot = m1 * u1 + m2 * u2;
      const keBefore = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;
      const keAfter = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;

      const cycle = t % 4.0;
      const tHit = 2.0;
      let x1 = -0.65;
      let x2 = 0.65;
      if (cycle < tHit) {
        const dtPre = tHit - cycle;
        x1 = -0.65 - u1 * dtPre * 0.22;
        x2 = 0.65 - u2 * dtPre * 0.22;
      } else {
        const dtPost = cycle - tHit;
        x1 = -0.65 + v1 * dtPost * 0.22;
        x2 = 0.65 + v2 * dtPost * 0.22;
      }
      b1.position.set(Math.max(-4.8, Math.min(4.8, x1)), 0.12, 0);
      b2.position.set(Math.max(-4.8, Math.min(4.8, x2)), 0.12, 0);
      b1.scale.setScalar(0.7 + Math.min(0.6, m1 * 0.08));
      b2.scale.setScalar(0.7 + Math.min(0.6, m2 * 0.08));

      const pts: { x: number; y: number }[] = [];
      for (let ee = 0; ee <= 1.01; ee += 0.05) {
        const vv1 = ((m1 - ee * m2) * u1 + (1 + ee) * m2 * u2) / (m1 + m2);
        const vv2 = ((m2 - ee * m1) * u2 + (1 + ee) * m1 * u1) / (m1 + m2);
        pts.push({ x: ee, y: 0.5 * m1 * vv1 * vv1 + 0.5 * m2 * vv2 * vv2 });
      }
      return {
        substitutedFormula: `p = ${pTot.toFixed(1)} kg·m/s | v₁ = ${v1.toFixed(2)}, v₂ = ${v2.toFixed(2)} m/s`,
        readouts: [
          { symbol: 'v₁', label: { en: 'Final Speed 1', hi: 'अंतिम वेग 1' }, value: v1.toFixed(2), unit: 'm/s', accent: 'velocity' },
          { symbol: 'v₂', label: { en: 'Final Speed 2', hi: 'अंतिम वेग 2' }, value: v2.toFixed(2), unit: 'm/s', accent: 'force' },
          { symbol: 'p_tot', label: { en: 'Total Momentum', hi: 'कुल संवेग' }, value: pTot.toFixed(1), unit: 'kg·m/s', accent: 'momentum' },
          { symbol: 'ΔK', label: { en: 'KE Retained', hi: 'शेष गतिज ऊर्जा' }, value: `${keBefore > 0 ? ((keAfter / keBefore) * 100).toFixed(0) : 100}`, unit: '%', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: e, y: keAfter },
      };
    },
    getStrobePos: () => b1.position.clone(),
  };
}

function buildImpulseMomentum3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const wall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.4, 2.8), p.contrastMat());
  addCrispEdges(wall, p.edgeMat());
  wall.position.set(3.2, 0.5, 0);
  group.add(wall);

  const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.6, 2.4), p.glassMat(0.35));
  addCrispEdges(cushion, p.edgeMat());
  cushion.position.set(2.55, 0.5, 0);
  group.add(cushion);

  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), p.solidMat());
  group.add(ball);

  const forceArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(2.2, 0.5, 0), 1.5, p.primaryHex, 0.35, 0.2);
  group.add(forceArrow);

  return {
    group,
    defaultCamPos: [0, 3.0, 9.0],
    defaultTarget: [0.5, 0.4, 0],
    update: (_dt, t, params, showVectors) => {
      const m = Math.max(0.05, params.m ?? 0.5);
      const u = Math.max(1, params.u ?? 20);
      const dtImpact = Math.max(0.01, params.dtImpact ?? 0.15);
      const J = m * u;
      const Favg = J / dtImpact;

      const phase = (t * 0.75) % 2.4;
      let bx = -3.8 + phase * 3.8;
      let squash = 1.0;
      if (bx > 2.0) {
        const comp = Math.min(1, (bx - 2.0) / 1.5);
        bx = 2.0 + comp * Math.min(0.8, dtImpact * 1.6);
        squash = 1 - comp * 0.32;
      }
      ball.position.set(bx, 0.5, 0);
      ball.scale.set(squash, 1 / Math.sqrt(squash), 1 / Math.sqrt(squash));
      cushion.scale.x = Math.max(0.25, Math.min(2.2, dtImpact * 3.0));

      forceArrow.visible = showVectors && bx >= 1.8;
      forceArrow.setLength(Math.min(3.5, 0.6 + Favg * 0.008), 0.35, 0.2);

      const pts: { x: number; y: number }[] = [];
      for (let dti = 0.02; dti <= 0.6; dti += 0.02) {
        pts.push({ x: dti, y: J / dti });
      }
      return {
        substitutedFormula: `F_avg = Δp / Δt = (${m}×${u}) / ${dtImpact.toFixed(2)} = ${Favg.toFixed(1)} N`,
        readouts: [
          { symbol: 'F_avg', label: { en: 'Impact Force', hi: 'आघात बल' }, value: Favg.toFixed(1), unit: 'N', accent: 'force' },
          { symbol: 'J', label: { en: 'Impulse Δp', hi: 'आवेग Δp' }, value: J.toFixed(2), unit: 'N·s', accent: 'momentum' },
          { symbol: 'Δt', label: { en: 'Contact Time', hi: 'संपर्क समय' }, value: dtImpact.toFixed(2), unit: 's', accent: 'velocity' },
          { symbol: 'u', label: { en: 'Impact Speed', hi: 'प्रारंभिक चाल' }, value: u.toFixed(1), unit: 'm/s', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: dtImpact, y: Favg },
      };
    },
    getStrobePos: () => ball.position.clone(),
  };
}

function buildRollingIncline3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const rampGroup = new THREE.Group();
  const slab = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.25, 2.8), p.contrastMat());
  addCrispEdges(slab, p.edgeMat());
  rampGroup.add(slab);

  const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.2, 24), p.solidMat());
  roller.rotation.x = Math.PI / 2;
  addCrispEdges(roller, p.edgeMat());
  const spoke = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.12, 1.3), p.contrastMat());
  roller.add(spoke);
  rampGroup.add(roller);
  group.add(rampGroup);

  return {
    group,
    defaultCamPos: [0.5, 3.6, 9.6],
    defaultTarget: [0, 0.4, 0],
    update: (_dt, t, params) => {
      const thetaDeg = params.theta ?? 30;
      const beta = Math.max(0, params.beta ?? 0.5);
      const L = Math.max(1, params.L ?? 10);
      const g = Math.max(1, params.g ?? 9.8);
      const rad = (thetaDeg * Math.PI) / 180;
      const a = (g * Math.sin(rad)) / (1 + beta);
      const tEnd = Math.sqrt((2 * L) / Math.max(0.1, a));
      const vBottom = Math.sqrt(2 * a * L);

      rampGroup.rotation.z = -rad;
      const tSim = t % Math.max(0.4, tEnd);
      const s = 0.5 * a * tSim * tSim;
      const frac = Math.min(1, s / L);
      const xPos = -4.2 + frac * 8.4;
      roller.position.set(xPos, 0.75, 0);
      roller.rotation.y = -(frac * 8.4) / 0.62;

      const pts: { x: number; y: number }[] = [];
      for (let b = 0; b <= 1.05; b += 0.05) {
        pts.push({ x: b, y: (g * Math.sin(rad)) / (1 + b) });
      }
      return {
        substitutedFormula: `a = g sin(${thetaDeg}°) / (1 + ${beta.toFixed(2)}) = ${a.toFixed(2)} m/s²`,
        readouts: [
          { symbol: 'a', label: { en: 'Rolling Accel', hi: 'लोटनिक त्वरण' }, value: a.toFixed(2), unit: 'm/s²', accent: 'velocity' },
          { symbol: 'v', label: { en: 'Bottom Speed', hi: 'तल पर चाल' }, value: vBottom.toFixed(2), unit: 'm/s', accent: 'momentum' },
          { symbol: 't', label: { en: 'Descent Time', hi: 'नीचे आने का समय' }, value: tEnd.toFixed(2), unit: 's', accent: 'energy' },
          { symbol: 'β', label: { en: 'Shape Factor k²/R²', hi: 'आकृति गुणांक' }, value: beta.toFixed(2), unit: '', accent: 'force' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: beta, y: a },
      };
    },
    getStrobePos: () => roller.getWorldPosition(new THREE.Vector3()),
  };
}

function buildMomentOfInertia3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.0, 16), p.matteMidMat());
  group.add(axle);

  const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.22, 16, 48), p.solidMat());
  ringMesh.rotation.x = Math.PI / 2;
  const discMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.32, 36), p.solidMat());
  addCrispEdges(discMesh, p.edgeMat());
  const sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(1.5, 28, 24), p.solidMat());
  addCrispEdges(sphereMesh, p.edgeMat(), 26);

  const rotor = new THREE.Group();
  rotor.add(ringMesh, discMesh, sphereMesh);
  group.add(rotor);

  return {
    group,
    defaultCamPos: [3.2, 4.2, 7.2],
    defaultTarget: [0, 0, 0],
    update: (dt, _t, params) => {
      const shape = Math.round(params.shape ?? 1);
      const M = Math.max(0.5, params.M ?? 4);
      const R = Math.max(0.3, params.R ?? 1.5);
      const F = Math.max(0.5, params.F ?? 12);

      const factors = [1.0, 0.5, 0.4];
      const names = ['Ring (MR²)', 'Solid Disc (½MR²)', 'Solid Sphere (⅖MR²)'];
      const idx = Math.max(0, Math.min(2, shape));
      const k = factors[idx];
      const I = k * M * R * R;
      const tau = F * R;
      const alpha = tau / Math.max(0.01, I);

      ringMesh.visible = idx === 0;
      discMesh.visible = idx === 1;
      sphereMesh.visible = idx === 2;
      rotor.scale.setScalar(0.65 + (R / 3) * 0.7);
      rotor.rotation.y += Math.min(8, alpha * 0.45) * dt;

      const pts: { x: number; y: number }[] = [];
      for (let rr = 0.4; rr <= 3.0; rr += 0.15) {
        pts.push({ x: rr, y: k * M * rr * rr });
      }
      return {
        substitutedFormula: `I = ${k}(${M})(${R}²) = ${I.toFixed(2)} kg·m² | α = τ/I = ${alpha.toFixed(2)} rad/s²`,
        readouts: [
          { symbol: 'I', label: { en: 'Moment of Inertia', hi: 'जड़त्व आघूर्ण' }, value: I.toFixed(2), unit: 'kg·m²', accent: 'momentum' },
          { symbol: 'α', label: { en: 'Angular Accel', hi: 'कोणीय त्वरण' }, value: alpha.toFixed(2), unit: 'rad/s²', accent: 'velocity' },
          { symbol: 'τ', label: { en: 'Applied Torque', hi: 'बलाघूर्ण' }, value: tau.toFixed(1), unit: 'N·m', accent: 'force' },
          { symbol: 'Shape', label: { en: 'Body Geometry', hi: 'पिंड आकृति' }, value: names[idx].split(' ')[0], unit: '', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: R, y: I },
      };
    },
  };
}

function buildKeplersLaws3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.65, 28, 28), p.solidMat());
  group.add(sun);

  const planet = new THREE.Mesh(new THREE.SphereGeometry(0.28, 22, 22), p.matteMidMat());
  addCrispEdges(planet, p.edgeMat(), 30);
  group.add(planet);

  const orbitLine = createReusableLine(96, p.edgeMat());
  const sweepLine = createReusableLine(2, p.mutedLineMat());
  group.add(orbitLine, sweepLine);

  let angle = 0;
  return {
    group,
    defaultCamPos: [0, 6.2, 7.6],
    defaultTarget: [0, 0, 0],
    update: (dt, _t, params) => {
      const a = Math.max(0.5, params.a ?? 2.0);
      const e = Math.max(0, Math.min(0.8, params.e ?? 0.45));
      const Mstar = Math.max(0.2, params.Mstar ?? 1.0);
      const T = Math.sqrt((a * a * a) / Mstar);
      const b = a * Math.sqrt(1 - e * e);

      const scale = 3.2 / Math.max(1.2, a);
      const cFocus = a * e * scale;
      sun.position.set(cFocus, 0, 0);

      const rNow = (a * (1 - e * e)) / (1 + e * Math.cos(angle));
      const omegaEff = (2.4 / Math.max(0.25, rNow * rNow)) * Math.sqrt(Mstar);
      angle += Math.min(6, omegaEff) * dt;

      const px = cFocus - rNow * Math.cos(angle) * scale;
      const pz = rNow * Math.sin(angle) * scale;
      planet.position.set(px, 0, pz);
      setLinePoints(sweepLine, [[cFocus, 0, 0], [px, 0, pz]]);

      const coords: [number, number, number][] = [];
      for (let i = 0; i < 96; i++) {
        const th = (i / 95) * Math.PI * 2;
        coords.push([Math.cos(th) * a * scale, 0, Math.sin(th) * b * scale]);
      }
      setLinePoints(orbitLine, coords);

      const pts: { x: number; y: number }[] = [];
      for (let aa = 0.5; aa <= 5.0; aa += 0.25) {
        pts.push({ x: aa, y: Math.sqrt((aa * aa * aa) / Mstar) });
      }
      return {
        substitutedFormula: `T² = a³/M = (${a.toFixed(1)}³)/${Mstar.toFixed(1)} ⇒ T = ${T.toFixed(2)} yr`,
        readouts: [
          { symbol: 'T', label: { en: 'Orbital Period', hi: 'परिक्रमण काल' }, value: T.toFixed(2), unit: 'yr', accent: 'velocity' },
          { symbol: 'r', label: { en: 'Current Distance', hi: 'वर्तमान दूरी' }, value: rNow.toFixed(2), unit: 'AU', accent: 'momentum' },
          { symbol: 'e', label: { en: 'Eccentricity', hi: 'उत्केंद्रता' }, value: e.toFixed(2), unit: '', accent: 'force' },
          { symbol: 'a', label: { en: 'Semi-Major Axis', hi: 'अर्ध-दीर्घ अक्ष' }, value: a.toFixed(2), unit: 'AU', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: a, y: T },
      };
    },
    getStrobePos: () => planet.position.clone(),
  };
}
