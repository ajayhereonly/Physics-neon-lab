import * as THREE from 'three';
import { ThemeMode } from '../../types/physics';
import {
  addCrispEdges,
  createReusableLine,
  makePalette3D,
  SceneRig,
  setLinePoints,
} from './rigHelpers';

// ============================================================================
// 5. 3D VARIATION OF GRAVITY g (EARTH CORE -> SURFACE -> ORBIT + ROTATION)
// ============================================================================
export function buildGravityVariationRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  const earthR = 1.9;
  const earthGroup = new THREE.Group();

  // Inner Solid Core (visible through cutaway!)
  const coreMesh = new THREE.Mesh(new THREE.SphereGeometry(0.58, 22, 16), pal.solidMat());
  const coreHalo = new THREE.Mesh(
    new THREE.SphereGeometry(0.62, 12, 10),
    new THREE.MeshBasicMaterial({ color: pal.primaryHex, wireframe: true })
  );
  earthGroup.add(coreMesh, coreHalo);

  // Mantle Cutaway Shell (270° sweep exposing interior shaft to center r = 0)
  const mantleShell = new THREE.Mesh(
    new THREE.SphereGeometry(1.3, 28, 20, Math.PI * 0.45, Math.PI * 1.5),
    pal.matteMidMat()
  );
  mantleShell.material.side = THREE.DoubleSide;
  earthGroup.add(mantleShell);

  // Outer Crust Cutaway + Meridian Cage
  const crustShell = new THREE.Mesh(
    new THREE.SphereGeometry(earthR, 32, 24, Math.PI * 0.45, Math.PI * 1.5),
    pal.contrastMat()
  );
  crustShell.material.side = THREE.DoubleSide;
  const crustWire = new THREE.Mesh(
    new THREE.SphereGeometry(earthR * 1.01, 18, 12),
    new THREE.MeshBasicMaterial({ color: pal.primaryHex, wireframe: true, transparent: true, opacity: 0.32 })
  );
  earthGroup.add(crustShell, crustWire);

  // Spin Axis Pole Rod (North <-> South)
  const spinAxis = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 5.2, 10), pal.solidMat());
  earthGroup.add(spinAxis);
  group.add(earthGroup);

  // Highlighted Latitude Ring (moves up/down with λ)
  const latRing = new THREE.Mesh(new THREE.TorusGeometry(earthR + 0.04, 0.032, 8, 56), pal.solidMat());
  latRing.rotation.x = Math.PI / 2;
  group.add(latRing);

  // Radial Track Line from Center (0) to Space (3R)
  const radialTrack = createReusableLine(2, pal.dashedLineMat());
  group.add(radialTrack);

  // Movable 3D Gravity Probe Satellite / Capsule
  const probeGroup = new THREE.Group();
  const probeBody = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), pal.solidMat());
  addCrispEdges(probeBody, pal.edgeMat());
  const probeRing = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.03, 8, 24), pal.solidMat());
  probeGroup.add(probeBody, probeRing);
  group.add(probeGroup);

  // Inward Gravity Arrow g & Outward Centrifugal Arrow ω²R·cosλ
  const gArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(), 1.6, pal.primaryHex, 0.4, 0.22);
  const cArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.2, pal.midHex, 0.35, 0.18);
  group.add(gArrow, cArrow);

  return {
    group,
    defaultCamPos: [4.6, 3.6, 7.6],
    defaultTarget: [0.6, 0, 0],
    update: (_dt, t, params, showVectors) => {
      const rRatio = params.rRatio ?? 1.0;
      const latDeg = params.lat ?? 0;
      const spinFactor = params.spinFactor ?? 1.0;

      const g0 = 9.8;
      const latRad = (latDeg * Math.PI) / 180;
      const cosLat = Math.cos(latRad);
      const sinLat = Math.sin(latRad);

      const gRadial = rRatio <= 1 ? g0 * rRatio : g0 / (rRatio * rRatio);
      const centTerm = 0.0339 * spinFactor * spinFactor * cosLat * cosLat * (rRatio <= 1 ? rRatio : 0);
      const gEff = Math.max(0, gRadial - centTerm);

      // Spin Earth smoothly proportional to spinFactor
      earthGroup.rotation.y = t * (0.28 + spinFactor * 0.22);
      probeRing.rotation.x = t * 2.5;
      probeRing.rotation.y = t * 1.8;

      // Latitude ring position & radius on surface
      const ringR = Math.max(0.08, earthR * cosLat);
      latRing.position.y = earthR * sinLat;
      latRing.scale.set(ringR / (earthR + 0.04), ringR / (earthR + 0.04), 1);

      // Probe positioned at radial distance rRatio * earthR along latitude angle in +X/+Y plane
      const rVis = rRatio * earthR;
      const px = rVis * cosLat;
      const py = rVis * sinLat;
      probeGroup.position.set(px, py, 0);

      setLinePoints(
        radialTrack,
        [
          [0, 0, 0],
          [3 * earthR * cosLat, 3 * earthR * sinLat, 0],
        ],
        true
      );

      // Gravity vector pointing inward toward Earth center (0,0,0)
      gArrow.visible = showVectors && gEff > 0.05 && rVis > 0.08;
      if (gArrow.visible) {
        const inward = new THREE.Vector3(-px, -py, 0).normalize();
        gArrow.position.set(px, py, 0);
        gArrow.setDirection(inward);
        gArrow.setLength(Math.max(0.55, (gEff / g0) * 1.85), 0.34, 0.18);
      }

      // Centrifugal vector pointing outward perpendicular to spin axis (+X)
      const showCent = showVectors && rRatio <= 1.05 && rRatio > 0.05 && centTerm > 0.05;
      cArrow.visible = showCent;
      if (showCent) {
        cArrow.position.set(px, py, 0);
        cArrow.setDirection(new THREE.Vector3(1, 0, 0));
        cArrow.setLength(Math.min(1.9, Math.max(0.45, (centTerm / g0) * 1.85)), 0.32, 0.16);
      }

      const graphPoints: { x: number; y: number }[] = [];
      for (let rr = 0; rr <= 3.01; rr += 0.1) {
        graphPoints.push({ x: Number(rr.toFixed(2)), y: rr <= 1 ? g0 * rr : g0 / (rr * rr) });
      }

      const zone = rRatio < 0.02 ? 'CENTER (g=0)' : rRatio < 0.99 ? 'INSIDE' : rRatio <= 1.01 ? 'SURFACE' : 'ALTITUDE';

      return {
        substitutedFormula:
          rRatio <= 1
            ? `Inside (r/R = ${rRatio.toFixed(2)}): g_eff = ${gRadial.toFixed(2)} − ${centTerm.toFixed(2)} = ${gEff.toFixed(2)} m/s²`
            : `Outside (h = ${(rRatio - 1).toFixed(2)}R): g_h = 9.8 / (${rRatio.toFixed(2)})² = ${gEff.toFixed(2)} m/s²`,
        readouts: [
          { symbol: 'g_eff', label: { en: 'Effective Gravity', hi: 'प्रभावी गुरुत्व (g_eff)' }, value: gEff.toFixed(2), unit: 'm/s²', accent: 'force' },
          { symbol: '% g₀', label: { en: 'Weight Fraction', hi: 'भार प्रतिशत' }, value: ((gEff / g0) * 100).toFixed(1), unit: '%', accent: 'energy' },
          { symbol: 'ω²R', label: { en: 'Centrifugal Drop', hi: 'अपकेंद्रीय कमी' }, value: centTerm.toFixed(2), unit: 'm/s²', accent: 'velocity' },
          { symbol: 'Zone', label: { en: 'Probe Position', hi: 'स्थिति' }, value: gEff < 0.15 ? 'WEIGHTLESS' : zone, unit: '', accent: 'momentum' },
        ],
        graphPoints,
        graphCurrentPoint: { x: rRatio, y: gEff },
        graphLegend: { primary: 'Gravity Profile g(r) — Linear Inside, 1/r² Outside' },
      };
    },
  };
}

// ============================================================================
// 6. 3D COMMUNICATION SYSTEMS (EARTH CURVATURE, LOS TOWER & AM WAVE)
// ============================================================================
export function buildCommunicationSystemsRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Curved Earth Horizon Dome (large sphere shifted down so top arc sits at y = -0.3)
  const globeR = 9.5;
  const globeCenterY = -9.8;
  const earthDome = new THREE.Mesh(
    new THREE.SphereGeometry(globeR, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.24),
    pal.contrastMat()
  );
  earthDome.position.y = globeCenterY;
  const earthWire = new THREE.Mesh(
    new THREE.SphereGeometry(globeR + 0.02, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.24),
    new THREE.MeshBasicMaterial({ color: pal.primaryHex, wireframe: true, transparent: true, opacity: 0.25 })
  );
  earthWire.position.y = globeCenterY;
  group.add(earthDome, earthWire);

  // Transmitter Lattice Tower (left of summit)
  const txGroup = new THREE.Group();
  const txMast = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.8, 4), pal.solidMat());
  txMast.position.y = 0.9;
  addCrispEdges(txMast, pal.edgeMat());
  const txBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), pal.solidMat());
  txBeacon.position.y = 1.85;
  const txDish = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.035, 8, 24), pal.solidMat());
  txDish.position.y = 1.85;
  txGroup.add(txMast, txBeacon, txDish);
  group.add(txGroup);

  // Receiver Tower (shifts right with LOS range)
  const rxGroup = new THREE.Group();
  const rxMast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 1.2, 8), pal.contrastMat());
  rxMast.position.y = 0.6;
  addCrispEdges(rxMast, pal.edgeMat());
  const rxTip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), pal.solidMat());
  rxTip.position.y = 1.24;
  rxGroup.add(rxMast, rxTip);
  group.add(rxGroup);

  // Circular Coverage Footprint Ring around Transmitter
  const footprintRing = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.03, 8, 64), pal.solidMat());
  footprintRing.rotation.x = Math.PI / 2;
  group.add(footprintRing);

  // Tangent LOS Ray + Animated 3D AM Modulated Carrier Wave along the beam
  const losLine = createReusableLine(2, pal.dashedLineMat());
  group.add(losLine);

  const WAVE_N = 120;
  const amWaveLine = createReusableLine(WAVE_N, new THREE.LineBasicMaterial({ color: pal.primaryHex }));
  const envTop = createReusableLine(WAVE_N, pal.mutedLineMat());
  const envBot = createReusableLine(WAVE_N, pal.mutedLineMat());
  group.add(amWaveLine, envTop, envBot);

  return {
    group,
    defaultCamPos: [0.5, 3.6, 8.6],
    defaultTarget: [0.4, 0.5, 0],
    update: (_dt, t, params) => {
      const ma = params.ma ?? 0.6;
      const fm = params.fm ?? 5;
      const hT = params.hT ?? 160;
      const hR = params.hR ?? 40;

      const R_earth = 6.4e6;
      const dT = Math.sqrt(2 * R_earth * hT) / 1000; // km
      const dR = Math.sqrt(2 * R_earth * hR) / 1000; // km
      const dTotal = dT + dR;
      const areaKm2 = Math.PI * dT * dT;
      const powerRatio = 1 + (ma * ma) / 2;
      const bwKHz = 2 * fm;

      // Place Tx at angle -thetaT and Rx at +thetaR on curved Earth dome
      const thetaT = 0.14 + Math.min(0.22, (dT / 100) * 0.24);
      const thetaR = Math.min(0.24, (dR / 100) * 0.24) + 0.08;

      const txBaseX = -globeR * Math.sin(thetaT);
      const txBaseY = globeCenterY + globeR * Math.cos(thetaT);
      const rxBaseX = globeR * Math.sin(thetaR);
      const rxBaseY = globeCenterY + globeR * Math.cos(thetaR);

      const txScale = 0.5 + (hT / 500) * 1.15;
      const rxScale = Math.max(0.25, 0.35 + (hR / 200) * 0.95);

      txGroup.position.set(txBaseX, txBaseY, 0);
      txGroup.rotation.z = thetaT;
      txGroup.scale.set(1, txScale, 1);
      txDish.rotation.y = t * 2.5;

      rxGroup.position.set(rxBaseX, rxBaseY, 0);
      rxGroup.rotation.z = -thetaR;
      rxGroup.scale.set(1, rxScale, 1);

      // Compute world tip coordinates
      const txTipX = txBaseX - Math.sin(thetaT) * (1.85 * txScale);
      const txTipY = txBaseY + Math.cos(thetaT) * (1.85 * txScale);
      const rxTipX = rxBaseX + Math.sin(thetaR) * (1.24 * rxScale);
      const rxTipY = rxBaseY + Math.cos(thetaR) * (1.24 * rxScale);

      // Footprint disc centered on Tx base
      footprintRing.position.set(txBaseX, txBaseY + 0.08, 0);
      const fpScale = Math.max(0.45, Math.min(2.2, dT / 42));
      footprintRing.scale.set(fpScale, fpScale, 1);

      setLinePoints(losLine, [[txTipX, txTipY, 0], [rxTipX, rxTipY, 0]], true);

      // Build live 3D AM-modulated radio wave riding above the LOS beam
      const waveCoords: [number, number, number][] = [];
      const topCoords: [number, number, number][] = [];
      const botCoords: [number, number, number][] = [];
      const dx = rxTipX - txTipX;
      const dy = rxTipY - txTipY;
      const beamLen = Math.hypot(dx, dy) || 1;
      const nx = -dy / beamLen;
      const ny = dx / beamLen;

      for (let i = 0; i < WAVE_N; i++) {
        const u = i / (WAVE_N - 1);
        const bx = txTipX + dx * u;
        const by = txTipY + dy * u + 0.85;
        const env = 0.38 * (1 + ma * Math.sin(u * Math.PI * (2 + fm * 0.25) - t * 3.2));
        const carrier = Math.sin(u * Math.PI * 36 - t * 14);
        const val = env * carrier;
        waveCoords.push([bx + nx * val, by + ny * val, Math.cos(u * Math.PI * 36 - t * 14) * env * 0.22]);
        topCoords.push([bx + nx * Math.abs(env), by + ny * Math.abs(env), 0]);
        botCoords.push([bx - nx * Math.abs(env), by - ny * Math.abs(env), 0]);
      }
      setLinePoints(amWaveLine, waveCoords);
      setLinePoints(envTop, topCoords);
      setLinePoints(envBot, botCoords);

      const graphPoints: { x: number; y: number }[] = [];
      for (let h = 20; h <= 500; h += 20) {
        graphPoints.push({ x: h, y: Math.sqrt(2 * R_earth * h) / 1000 });
      }

      return {
        substitutedFormula: `d_LOS = √(2Rh_T) + √(2Rh_R) = ${dT.toFixed(1)} + ${dR.toFixed(1)} = ${dTotal.toFixed(1)} km  |  P_t/P_c = ${powerRatio.toFixed(2)}`,
        readouts: [
          { symbol: 'd_LOS', label: { en: 'Total LOS Range', hi: 'कुल परास (d_LOS)' }, value: dTotal.toFixed(1), unit: 'km', accent: 'velocity' },
          { symbol: 'Area', label: { en: 'Tower Coverage', hi: 'टावर क्षेत्रफल' }, value: areaKm2.toFixed(0), unit: 'km²', accent: 'energy' },
          { symbol: 'BW', label: { en: 'AM Bandwidth (2f_m)', hi: 'बैंडचौड़ाई (2f_m)' }, value: bwKHz.toFixed(0), unit: 'kHz', accent: 'momentum' },
          { symbol: 'State', label: { en: 'Signal Quality', hi: 'सिग्नल गुणवत्ता' }, value: ma > 1 ? 'OVERMOD!' : 'CLEAN AM', unit: '', accent: 'force' },
        ],
        graphPoints,
        graphCurrentPoint: { x: hT, y: dT },
        graphLegend: { primary: 'Radio Horizon Range d_T = √(2Rh_T)' },
      };
    },
  };
}

// ============================================================================
// 7. 3D ORGAN PIPES (OPEN VS CLOSED HARMONICS) & ACOUSTIC BEATS
// ============================================================================
export function buildOrganPipesBeatsRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Translucent 3D Cylindrical Resonant Organ Pipe along X axis
  const pipeBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.92, 0.92, 6.2, 32, 1, true),
    pal.glassMat(0.24)
  );
  pipeBody.rotation.z = Math.PI / 2;
  pipeBody.position.y = 0.85;
  group.add(pipeBody);

  // Open rim rings on both ends
  const rimL = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.048, 10, 44), pal.solidMat());
  rimL.rotation.y = Math.PI / 2;
  rimL.position.set(-3.1, 0.85, 0);
  const rimR = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.048, 10, 44), pal.solidMat());
  rimR.rotation.y = Math.PI / 2;
  rimR.position.set(3.1, 0.85, 0);
  group.add(rimL, rimR);

  // Solid End-Cap Lid (visible ONLY when pipeType === 0 [Closed Organ Pipe])
  const closedCap = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.18, 32), pal.solidMat());
  closedCap.rotation.z = Math.PI / 2;
  closedCap.position.set(-3.14, 0.85, 0);
  addCrispEdges(closedCap, pal.edgeMat());
  group.add(closedCap);

  // 24 Oscillating Longitudinal Air-Column Discs inside the pipe!
  const N_DISCS = 24;
  const airDiscs: THREE.Mesh[] = [];
  const discGeo = new THREE.TorusGeometry(0.68, 0.03, 8, 28);
  const discSolid = pal.solidMat();
  const discMuted = pal.matteMidMat();
  for (let i = 0; i < N_DISCS; i++) {
    const m = new THREE.Mesh(discGeo, i % 2 === 0 ? discSolid : discMuted);
    m.rotation.y = Math.PI / 2;
    m.position.y = 0.85;
    group.add(m);
    airDiscs.push(m);
  }

  // Standing Wave Displacement Envelopes (Top + Bottom curves inside pipe)
  const ENV_N = 90;
  const waveTop = createReusableLine(ENV_N, new THREE.LineBasicMaterial({ color: pal.primaryHex }));
  const waveBot = createReusableLine(ENV_N, pal.dashedLineMat());
  group.add(waveTop, waveBot);

  // Lower Beat Wave Ribbon (3D visual of resultant beat envelope f_b = |f1 - f2|)
  const BEAT_N = 120;
  const beatLine = createReusableLine(BEAT_N, new THREE.LineBasicMaterial({ color: pal.primaryHex }));
  const beatAxis = createReusableLine(2, pal.mutedLineMat());
  setLinePoints(beatAxis, [[-4.2, -1.65, 0], [4.2, -1.65, 0]]);
  group.add(beatLine, beatAxis);

  // Twin Vibrating Tuning Fork Prongs on right end
  const makeFork = (zPos: number) => {
    const fg = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.55, 10), pal.solidMat());
    stem.position.y = -0.35;
    const baseBar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.1), pal.solidMat());
    const prongL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.1), pal.solidMat());
    prongL.position.set(-0.17, 0.45, 0);
    const prongR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.1), pal.solidMat());
    prongR.position.set(0.17, 0.45, 0);
    fg.add(stem, baseBar, prongL, prongR);
    fg.position.set(4.15, -1.45, zPos);
    return fg;
  };
  const fork1 = makeFork(-0.45);
  const fork2 = makeFork(0.45);
  group.add(fork1, fork2);

  return {
    group,
    defaultCamPos: [2.8, 3.2, 8.6],
    defaultTarget: [0.2, -0.2, 0],
    update: (_dt, t, params) => {
      const isOpen = (params.pipeType ?? 1) >= 0.5;
      const mode = Math.max(1, Math.round(params.mode ?? 1));
      const L = Math.max(0.2, params.L ?? 0.85);
      const df = params.df ?? 4;
      const vSound = 340;

      const fFund = isOpen ? vSound / (2 * L) : vSound / (4 * L);
      const harmonicNum = isOpen ? mode : 2 * mode - 1;
      const fCur = fFund * harmonicNum;
      const lambda = vSound / fCur;

      const pipeVisLen = 3.2 + (L / 2.0) * 3.4;
      const halfL = pipeVisLen / 2;
      pipeBody.scale.set(1, pipeVisLen / 6.2, 1);
      rimL.position.x = -halfL;
      rimR.position.x = halfL;
      closedCap.visible = !isOpen;
      closedCap.position.x = -halfL - 0.06;

      // Standing wave spatial displacement profile A(u) for u in [0, 1]
      // Open pipe: cos(mode * pi * u) -> Antinodes at BOTH ends u=0 & u=1
      // Closed pipe: sin((2*mode - 1) * pi/2 * u) -> Node at u=0 (closed), Antinode at u=1 (open)
      const spatialAmp = (u: number) =>
        isOpen
          ? Math.cos(mode * Math.PI * u)
          : Math.sin(((2 * mode - 1) * Math.PI * u) / 2);

      const timeOsc = Math.sin(t * (4 + mode * 1.4));

      // Animate longitudinal air discs along pipe axis
      for (let i = 0; i < N_DISCS; i++) {
        const u = (i + 0.5) / N_DISCS;
        const baseX = -halfL + u * pipeVisLen;
        const disp = spatialAmp(u) * timeOsc * 0.24;
        airDiscs[i].position.x = baseX + disp;
        const scale = 0.72 + Math.abs(spatialAmp(u)) * 0.34;
        airDiscs[i].scale.set(scale, scale, 1);
      }

      // Standing wave envelope curves
      const topPts: [number, number, number][] = [];
      const botPts: [number, number, number][] = [];
      for (let i = 0; i < ENV_N; i++) {
        const u = i / (ENV_N - 1);
        const x = -halfL + u * pipeVisLen;
        const a = spatialAmp(u) * 0.72;
        topPts.push([x, 0.85 + a * timeOsc, 0]);
        botPts.push([x, 0.85 - a * timeOsc, 0]);
      }
      setLinePoints(waveTop, topPts);
      setLinePoints(waveBot, botPts, true);

      // 3D Acoustic Beat waveform below pipe
      const beatPts: [number, number, number][] = [];
      const graphPoints: { x: number; y: number }[] = [];
      for (let i = 0; i < BEAT_N; i++) {
        const u = i / (BEAT_N - 1);
        const x = -4.2 + u * 8.4;
        const env = Math.cos(Math.PI * Math.max(0.2, df) * (u * 1.0 - t * 0.22));
        const val = env * Math.sin(u * Math.PI * 30 - t * 10) * 0.65;
        beatPts.push([x, -1.65 + val, Math.sin(u * Math.PI * 30 - t * 10) * env * 0.18]);
        if (i % 2 === 0) {
          graphPoints.push({ x: Number((u * 1.0).toFixed(2)), y: val * 1.5 });
        }
      }
      setLinePoints(beatLine, beatPts);

      // Vibrate tuning forks subtly
      fork1.rotation.z = Math.sin(t * 28) * 0.04;
      fork2.rotation.z = Math.sin(t * (28 + df * 0.8)) * 0.04;

      return {
        substitutedFormula: `${isOpen ? 'Open' : 'Closed'} Pipe (Harmonic #${harmonicNum}): f = ${fCur.toFixed(1)} Hz  |  f_beat = ${df} Hz`,
        readouts: [
          { symbol: 'f', label: { en: 'Pipe Frequency', hi: 'पाइप आवृत्ति (f)' }, value: fCur.toFixed(1), unit: 'Hz', accent: 'force' },
          { symbol: 'λ', label: { en: 'Wavelength', hi: 'तरंगदैर्घ्य (λ)' }, value: lambda.toFixed(2), unit: 'm', accent: 'velocity' },
          { symbol: 'f_b', label: { en: 'Beat Frequency', hi: 'विस्पंद आवृत्ति' }, value: `${df}`, unit: 'Hz', accent: 'energy' },
          { symbol: 'Ratio', label: { en: 'Allowed Harmonics', hi: 'अनुमत संनादी' }, value: isOpen ? '1:2:3:4' : '1:3:5:7', unit: '', accent: 'momentum' },
        ],
        graphPoints,
        graphLegend: { primary: `Acoustic Beat Pattern (f_b = ${df} beats/s)` },
      };
    },
  };
}

// ============================================================================
// 8. 3D DOPPLER EFFECT (EXPANDING 3D SPHERICAL WAVEFRONT SHELLS)
// ============================================================================
export function buildDopplerEffectRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Highway Track Bed
  const road = new THREE.Mesh(new THREE.BoxGeometry(12.2, 0.18, 2.2), pal.contrastMat());
  road.position.y = -1.2;
  addCrispEdges(road, pal.edgeMat());
  group.add(road);

  // Moving Siren Source Vehicle (composite chassis + roof siren dome)
  const srcGroup = new THREE.Group();
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.42, 0.56), pal.solidMat());
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.3, 0.5), pal.contrastMat());
  cabin.position.set(-0.08, 0.32, 0);
  const sirenDome = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), pal.solidMat());
  sirenDome.position.set(0.05, 0.54, 0);
  addCrispEdges(chassis, pal.edgeMat());
  addCrispEdges(cabin, pal.edgeMat());
  srcGroup.add(chassis, cabin, sirenDome);
  srcGroup.position.set(-2.5, -0.82, 0);
  group.add(srcGroup);

  // Observer Receiver Station on right
  const obsGroup = new THREE.Group();
  const obsBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.9, 14), pal.contrastMat());
  const obsDish = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 10, 24), pal.solidMat());
  obsDish.position.y = 0.72;
  obsDish.rotation.y = Math.PI / 2;
  addCrispEdges(obsBase, pal.edgeMat());
  obsGroup.add(obsBase, obsDish);
  obsGroup.position.set(3.2, -0.66, 0);
  group.add(obsGroup);

  // 10 Concentric Expanding 3D Spherical Wavefront Rings (XY + XZ orthogonal rings per shell)
  const N_SHELLS = 10;
  const shells: THREE.Group[] = [];
  const ringGeo = new THREE.TorusGeometry(1.0, 0.018, 8, 48);
  for (let i = 0; i < N_SHELLS; i++) {
    const sg = new THREE.Group();
    const rXY = new THREE.Mesh(ringGeo, pal.solidMat());
    const rXZ = new THREE.Mesh(ringGeo, pal.matteMidMat());
    rXZ.rotation.x = Math.PI / 2;
    sg.add(rXY, rXZ);
    group.add(sg);
    shells.push(sg);
  }

  const vsArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.5, pal.primaryHex, 0.36, 0.18);
  group.add(vsArrow);

  return {
    group,
    defaultCamPos: [0.5, 4.4, 8.6],
    defaultTarget: [0.2, -0.3, 0],
    update: (_dt, t, params, showVectors) => {
      const f0 = params.f0 ?? 500;
      const vs = params.vs ?? 80;
      const vo = params.vo ?? 0;
      const v = params.v ?? 340;

      const cycle = (t * 0.22) % 1;
      const srcX = -4.8 + cycle * 9.6;
      const obsX = 0.0;
      const approaching = srcX < obsX;

      srcGroup.position.x = srcX;
      obsGroup.position.x = obsX;
      obsDish.rotation.z = Math.sin(t * 4) * 0.1;

      const effVs = approaching ? vs : -vs;
      const effVo = approaching ? vo : -vo;
      const fObs = f0 * ((v + effVo) / Math.max(20, v - effVs));
      const machRatio = Math.min(0.85, Math.max(-0.85, vs / v));

      // Place expanding wavefront shells emitted at staggered past positions
      const waveSpeedVis = 3.2;
      const emitPeriod = 0.32;
      for (let i = 0; i < N_SHELLS; i++) {
        const age = ((t + i * emitPeriod) % (N_SHELLS * emitPeriod));
        const r = Math.max(0.15, age * waveSpeedVis);
        // Emission point trails behind current source proportional to machRatio
        const emitX = srcX - machRatio * r;
        shells[i].position.set(emitX, -0.5, 0);
        shells[i].scale.setScalar(r);
        shells[i].visible = r < 6.4;
      }

      vsArrow.visible = showVectors && Math.abs(vs) > 2;
      vsArrow.position.set(srcX, 0.1, 0);
      vsArrow.setDirection(new THREE.Vector3(vs >= 0 ? 1 : -1, 0, 0));
      vsArrow.setLength(Math.min(2.2, 0.65 + (Math.abs(vs) / 250) * 1.4), 0.34, 0.18);

      const graphPoints: { x: number; y: number }[] = [];
      for (let s = -150; s <= 250; s += 15) {
        graphPoints.push({ x: s, y: f0 * ((v + vo) / Math.max(40, v - s)) });
      }

      return {
        substitutedFormula: `f′ = ${f0} · (${v} ${effVo >= 0 ? '+' : '−'} ${Math.abs(effVo)}) / (${v} ${effVs >= 0 ? '−' : '+'} ${Math.abs(effVs)}) = ${fObs.toFixed(1)} Hz`,
        readouts: [
          { symbol: 'f′', label: { en: 'Observed Pitch', hi: 'प्रेक्षित आवृत्ति (f′)' }, value: fObs.toFixed(1), unit: 'Hz', accent: 'force' },
          { symbol: 'Δf', label: { en: 'Doppler Shift', hi: 'डॉपलर विस्थापन' }, value: `${fObs - f0 >= 0 ? '+' : ''}${(fObs - f0).toFixed(1)}`, unit: 'Hz', accent: 'velocity' },
          { symbol: 'v_s/v', label: { en: 'Mach Fraction', hi: 'मैक अनुपात' }, value: (Math.abs(vs) / v).toFixed(2), unit: '', accent: 'energy' },
          { symbol: 'State', label: { en: 'Motion Relative', hi: 'सापेक्ष गति' }, value: approaching ? 'APPROACH' : 'RECEDING', unit: '', accent: 'momentum' },
        ],
        graphPoints,
        graphCurrentPoint: { x: vs, y: f0 * ((v + vo) / Math.max(40, v - vs)) },
        graphLegend: { primary: 'Apparent Frequency f′ vs Source Speed v_s' },
      };
    },
  };
}
