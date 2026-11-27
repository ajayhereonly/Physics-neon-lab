import * as THREE from 'three';
import { LiveSimTelemetry, PhysicsSimulation, ThemeMode } from '../../types/physics';
import { getRealLifeScenario } from '../../data/realLifeScenarios';
import {
  addCrispEdges,
  createOpticalLensGeometry,
  createReusableLine,
  makePalette3D,
  Palette3D,
  SceneRig,
  setLinePoints,
} from './rigHelpers';

/**
 * Reusable composite 3D Sports Car (Pure B&W studio finish with crisp edges & 4 spinning wheels).
 */
function create3DSportsCar(p: Palette3D): { car: THREE.Group; wheels: THREE.Mesh[] } {
  const car = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.44, 1.15), p.solidMat());
  body.position.y = 0.42;
  addCrispEdges(body, p.edgeMat());
  const hood = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 1.05), p.contrastMat());
  hood.position.set(0.75, 0.68, 0);
  addCrispEdges(hood, p.edgeMat());
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.42, 0.96), p.glassMat(0.45));
  cabin.position.set(-0.1, 0.82, 0);
  addCrispEdges(cabin, p.edgeMat());
  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 1.24), p.solidMat());
  spoiler.position.set(-1.12, 0.86, 0);
  addCrispEdges(spoiler, p.edgeMat());
  const strutL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.08), p.matteMidMat());
  strutL.position.set(-1.08, 0.72, 0.42);
  const strutR = strutL.clone();
  strutR.position.z = -0.42;
  car.add(body, hood, cabin, spoiler, strutL, strutR);

  const wheels: THREE.Mesh[] = [];
  const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 18);
  wheelGeo.rotateX(Math.PI / 2);
  const wheelCoords: [number, number, number][] = [
    [0.72, 0.28, 0.6],
    [0.72, 0.28, -0.6],
    [-0.72, 0.28, 0.6],
    [-0.72, 0.28, -0.6],
  ];
  wheelCoords.forEach(([x, y, z]) => {
    const w = new THREE.Mesh(wheelGeo, p.matteMidMat());
    addCrispEdges(w, p.edgeMat(), 24);
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.07, 0.24), p.solidMat());
    w.add(spoke);
    w.position.set(x, y, z);
    car.add(w);
    wheels.push(w);
  });

  return { car, wheels };
}

function create3DSubmarine(p: Palette3D): { sub: THREE.Group; prop: THREE.Mesh } {
  const sub = new THREE.Group();
  const hull = new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 2.2, 12, 24), p.solidMat());
  hull.rotation.z = Math.PI / 2;
  addCrispEdges(hull, p.edgeMat(), 26);
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.75, 0.45), p.contrastMat());
  tower.position.set(0.2, 0.8, 0);
  addCrispEdges(tower, p.edgeMat());
  const periscope = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.65, 10), p.solidMat());
  periscope.position.set(0.28, 1.35, 0);
  const finL = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 1.4), p.matteMidMat());
  finL.position.set(-0.9, 0, 0);
  const prop = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.85, 0.18), p.contrastMat());
  prop.position.set(-1.8, 0, 0);
  sub.add(hull, tower, periscope, finL, prop);
  return { sub, prop };
}

function create3DAmbulance(p: Palette3D): { amb: THREE.Group; beacon: THREE.Mesh } {
  const amb = new THREE.Group();
  const van = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.15, 1.2), p.contrastMat());
  van.position.y = 0.8;
  addCrispEdges(van, p.edgeMat());
  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.75, 1.15), p.solidMat());
  cab.position.set(1.5, 0.62, 0);
  addCrispEdges(cab, p.edgeMat());
  const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 1.26), p.solidMat());
  crossH.position.set(-0.1, 0.85, 0);
  const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.55, 1.26), p.solidMat());
  crossV.position.set(-0.1, 0.85, 0);
  const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.24, 14), p.solidMat());
  beacon.position.set(0.85, 1.48, 0);
  const wGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.2, 16);
  wGeo.rotateX(Math.PI / 2);
  [[1.25, 0.28, 0.62], [1.25, 0.28, -0.62], [-0.75, 0.28, 0.62], [-0.75, 0.28, -0.62]].forEach(([x, y, z]) => {
    const w = new THREE.Mesh(wGeo, p.solidMat());
    w.position.set(x, y, z);
    amb.add(w);
  });
  amb.add(van, cab, crossH, crossV, beacon);
  return { amb, beacon };
}

/**
 * Builds an interactive 3D Real-Life Example rig for ANY of the 66 simulations.
 * Flagship topics receive dedicated multi-part everyday 3D environments (Drifting Sports Car,
 * Highway Track, F1 Banked Circuit, Eyeglasses & Book/Sign, Submarine, Airplane Wing,
 * Passing Ambulance, Concert Flute, City TV Tower, Power Substation, Roller Coaster, Solar Roof).
 * Every remaining topic receives a contextual real-world 3D environment frame wrapping its exact
 * live physics rig so all 66 topics seamlessly toggle Lab View ↔ Real-Life Example in 3D.
 */
export function buildRealLife3DRig(
  sim: PhysicsSimulation,
  theme: ThemeMode,
  fallbackLabRigFactory: () => SceneRig
): SceneRig {
  const p = makePalette3D(theme);

  switch (sim.id) {
    case 'angular-momentum':
      return buildDriftingCarAngularMomentum3D(p);
    case 'speed-velocity':
      return buildHighwaySpeedCar3D(p);
    case 'motion-1d':
      return buildHighwayAccelCar3D(p);
    case 'banking-roads':
      return buildF1BankedCircuit3D(p);
    case 'eye-defects':
      return buildEyeglassesRealLife3D(p);
    case 'density-buoyancy':
      return buildSubmarineBuoyancy3D(p);
    case 'fluids':
      return buildAirplaneWingLift3D(p);
    case 'doppler-effect':
      return buildAmbulanceDoppler3D(p);
    case 'work-energy':
      return buildRollerCoaster3D(p);
    case 'dual-nature':
      return buildSolarRoof3D(p);
    case 'organ-pipes-beats':
      return buildConcertFlute3D(p);
    case 'communication-systems':
      return buildCityBroadcastTower3D(p);
    case 'transformer':
      return buildPowerSubstation3D(p);
    default:
      return buildContextualRealLifeWrapper3D(sim, p, fallbackLabRigFactory());
  }
}

function buildDriftingCarAngularMomentum3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  // Asphalt roundabout skidpad with lane markings
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 5.8, 0.22, 64), p.contrastMat());
  pad.position.y = -0.14;
  addCrispEdges(pad, p.edgeMat(), 28);
  group.add(pad);

  const centerPylon = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.45, 1.4, 20), p.solidMat());
  centerPylon.position.y = 0.65;
  addCrispEdges(centerPylon, p.edgeMat());
  group.add(centerPylon);

  // Overhead spinning flywheel gyro visual attached to center
  const gyroRing = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.1, 12, 40), p.solidMat());
  gyroRing.rotation.x = Math.PI / 2;
  gyroRing.position.y = 1.65;
  const gyroSpoke = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.08, 0.14), p.matteMidMat());
  gyroRing.add(gyroSpoke);
  group.add(gyroRing);

  const driftTrackRing = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.06, 10, 64), p.edgeMat());
  driftTrackRing.rotation.x = Math.PI / 2;
  driftTrackRing.position.y = 0.02;
  group.add(driftTrackRing);

  const { car, wheels } = create3DSportsCar(p);
  car.scale.setScalar(0.82);
  group.add(car);

  const radiusLine = createReusableLine(2, p.dashedLineMat());
  group.add(radiusLine);
  const vArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.6, p.primaryHex, 0.35, 0.2);
  const LArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1.8, 0), 2.0, p.primaryHex, 0.38, 0.22);
  group.add(vArrow, LArrow);

  let angle = 0;
  return {
    group,
    defaultCamPos: [0, 6.2, 8.8],
    defaultTarget: [0, 0.4, 0],
    update: (dt, _t, params, showVectors) => {
      const m = Math.max(0.5, params.m ?? 2.0);
      const r = Math.max(0.4, params.r ?? 1.8);
      const L = Math.max(1.0, params.L ?? 18.0);
      const I = m * r * r;
      const omega = L / Math.max(0.05, I);
      const v = omega * r;
      const keRot = 0.5 * I * omega * omega;

      const visR = 1.35 + Math.min(3.4, r * 1.1);
      driftTrackRing.scale.setScalar(visR / 3.0);
      const visOmega = Math.min(7.5, omega * 0.45);
      angle += visOmega * dt;

      const cx = Math.cos(angle) * visR;
      const cz = Math.sin(angle) * visR;
      car.position.set(cx, 0, cz);
      // Tangential heading with subtle drift slip angle as omega rises
      const driftSlip = Math.min(0.42, visOmega * 0.06);
      car.rotation.y = -angle - Math.PI / 2 + driftSlip;
      wheels.forEach((w) => {
        w.rotation.z -= visOmega * dt * 2.4;
      });
      gyroRing.rotation.z -= visOmega * dt * 1.5;

      setLinePoints(radiusLine, [[0, 0.35, 0], [cx, 0.35, cz]], true);

      vArrow.visible = showVectors;
      vArrow.position.set(cx, 0.95, cz);
      vArrow.setDirection(new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle)).normalize());
      vArrow.setLength(Math.min(2.6, 0.6 + v * 0.12), 0.35, 0.2);

      LArrow.visible = showVectors;
      LArrow.setLength(Math.min(2.8, 0.8 + L * 0.06), 0.36, 0.22);

      const pts: { x: number; y: number }[] = [];
      for (let rr = 0.5; rr <= 3.5; rr += 0.15) {
        pts.push({ x: rr, y: L / (m * rr * rr) });
      }
      return {
        substitutedFormula: `Car Drift: ω = L/(mr²) = ${L}/(${m}×${r.toFixed(2)}²) = ${omega.toFixed(2)} rad/s | v = ${v.toFixed(1)} m/s`,
        readouts: [
          { symbol: 'ω', label: { en: 'Car Turn Spin ω', hi: 'कार कोणीय चाल ω' }, value: omega.toFixed(2), unit: 'rad/s', accent: 'velocity' },
          { symbol: 'v', label: { en: 'Car Speed (ωr)', hi: 'कार की चाल (ωr)' }, value: v.toFixed(1), unit: 'm/s', accent: 'force' },
          { symbol: 'I', label: { en: 'Inertia (mr²)', hi: 'जड़त्व आघूर्ण' }, value: I.toFixed(2), unit: 'kg·m²', accent: 'momentum' },
          { symbol: 'K_rot', label: { en: 'Rotational KE', hi: 'घूर्णन ऊर्जा' }, value: keRot.toFixed(1), unit: 'J', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: r, y: omega },
      };
    },
    getStrobePos: () => car.position.clone().add(new THREE.Vector3(0, 0.4, 0)),
    getCallouts: (_params, tel) => [
      { label: `Car Speed = ${tel.readouts[1]?.value} m/s`, pos: [car.position.x, 1.55, car.position.z] },
      { label: `L = Const | ω = ${tel.readouts[0]?.value} rad/s`, pos: [0, 3.0, 0] },
    ],
  };
}

function buildHighwaySpeedCar3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const roadOuter = new THREE.Mesh(new THREE.RingGeometry(2.6, 4.1, 64), p.contrastMat());
  roadOuter.rotation.x = -Math.PI / 2;
  roadOuter.position.y = -0.02;
  group.add(roadOuter);

  const startArch = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.6, 1.5), p.solidMat());
  addCrispEdges(startArch, p.edgeMat());
  startArch.position.set(3.35, 0.8, 0);
  group.add(startArch);

  const { car, wheels } = create3DSportsCar(p);
  car.scale.setScalar(0.75);
  group.add(car);

  const shortcutLine = createReusableLine(2, p.edgeMat());
  group.add(shortcutLine);

  return {
    group,
    defaultCamPos: [0, 6.4, 8.2],
    defaultTarget: [0, 0.2, 0],
    update: (dt, t, params) => {
      const R = Math.max(5, params.R ?? 20);
      const v = Math.max(1, params.v ?? 10);
      const tDur = Math.max(0.5, params.t ?? 6);
      const dist = v * tDur;
      const theta = dist / R;
      const disp = 2 * R * Math.abs(Math.sin(theta / 2));
      const vAvg = disp / tDur;

      const visR = 3.35;
      const ang = (t * (v / 12)) % (Math.PI * 2);
      const cx = Math.cos(ang) * visR;
      const cz = -Math.sin(ang) * visR;
      car.position.set(cx, 0, cz);
      car.rotation.y = ang + Math.PI / 2;
      wheels.forEach((w) => (w.rotation.z -= v * dt * 0.4));
      setLinePoints(shortcutLine, [[visR, 0.35, 0], [cx, 0.35, cz]]);

      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= 40; i++) {
        const ti = (i / 40) * Math.max(10, tDur * 1.4);
        pts.push({ x: ti, y: 2 * R * Math.abs(Math.sin((v * ti) / (2 * R))) });
      }
      return {
        substitutedFormula: `Odometer = ${dist.toFixed(1)} m | Straight GPS Displacement = ${disp.toFixed(1)} m`,
        readouts: [
          { symbol: 'd', label: { en: 'Odometer Path', hi: 'ओडोमीटर दूरी' }, value: dist.toFixed(1), unit: 'm', accent: 'velocity' },
          { symbol: '|Δr|', label: { en: 'GPS Shortcut', hi: 'सीधा विस्थापन' }, value: disp.toFixed(1), unit: 'm', accent: 'momentum' },
          { symbol: 'v_avg', label: { en: 'Avg Velocity', hi: 'औसत वेग' }, value: vAvg.toFixed(2), unit: 'm/s', accent: 'force' },
          { symbol: 'Speed', label: { en: 'Speedometer', hi: 'स्पीडोमीटर' }, value: (v * 3.6).toFixed(0), unit: 'km/h', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: tDur, y: disp },
      };
    },
    getStrobePos: () => car.position.clone().add(new THREE.Vector3(0, 0.4, 0)),
    getCallouts: (_params, tel) => [
      { label: `${tel.readouts[3]?.value} km/h`, pos: [car.position.x, 1.4, car.position.z] },
    ],
  };
}

function buildHighwayAccelCar3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const road = new THREE.Mesh(new THREE.BoxGeometry(13, 0.16, 3.0), p.contrastMat());
  addCrispEdges(road, p.edgeMat());
  road.position.y = -0.08;
  group.add(road);

  // Highway dashed centerline & lampposts
  for (let i = -5; i <= 5; i += 2) {
    const dash = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.14), p.solidMat());
    dash.position.set(i, 0.02, 0);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.4, 10), p.matteMidMat());
    pole.position.set(i, 1.2, -1.6);
    group.add(dash, pole);
  }

  const { car, wheels } = create3DSportsCar(p);
  group.add(car);

  return {
    group,
    defaultCamPos: [0, 3.6, 9.8],
    defaultTarget: [0, 0.5, 0],
    update: (dt, t, params) => {
      const u = params.u ?? 5;
      const a = params.a ?? 2;
      const tMax = Math.max(1, params.tMax ?? 6);
      const tSim = t % tMax;
      const v = u + a * tSim;
      const s = u * tSim + 0.5 * a * tSim * tSim;
      const sMax = Math.max(10, Math.abs(u * tMax + 0.5 * a * tMax * tMax));

      const xPos = -5.0 + Math.max(-0.5, Math.min(10.0, (s / sMax) * 10.0));
      car.position.set(xPos, 0, 0);
      wheels.forEach((w) => (w.rotation.z -= v * dt * 0.45));

      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= 40; i++) {
        const ti = (i / 40) * tMax;
        pts.push({ x: ti, y: u * ti + 0.5 * a * ti * ti });
      }
      return {
        substitutedFormula: `Highway Car: v = ${(v * 3.6).toFixed(0)} km/h | Distance s = ${s.toFixed(1)} m`,
        readouts: [
          { symbol: 's', label: { en: 'Road Covered', hi: 'तय सड़क दूरी' }, value: s.toFixed(1), unit: 'm', accent: 'momentum' },
          { symbol: 'v', label: { en: 'Car Speed', hi: 'कार वेग' }, value: v.toFixed(1), unit: 'm/s', accent: 'velocity' },
          { symbol: 'km/h', label: { en: 'Speedometer', hi: 'स्पीडोमीटर' }, value: (v * 3.6).toFixed(0), unit: 'km/h', accent: 'energy' },
          { symbol: 'a', label: { en: 'Throttle Accel', hi: 'त्वरण' }, value: a.toFixed(1), unit: 'm/s²', accent: 'force' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: tSim, y: s },
      };
    },
    getStrobePos: () => car.position.clone().add(new THREE.Vector3(0, 0.4, 0)),
  };
}

function buildF1BankedCircuit3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const trackPivot = new THREE.Group();
  const tarmac = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.25, 9.5), p.contrastMat());
  addCrispEdges(tarmac, p.edgeMat());
  const barrierOuter = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, 9.5), p.solidMat());
  barrierOuter.position.set(2.4, 0.45, 0);
  addCrispEdges(barrierOuter, p.edgeMat());
  trackPivot.add(tarmac, barrierOuter);

  const { car, wheels } = create3DSportsCar(p);
  car.rotation.y = Math.PI / 2;
  trackPivot.add(car);
  group.add(trackPivot);

  return {
    group,
    defaultCamPos: [0, 3.6, 9.4],
    defaultTarget: [0, 0.5, 0],
    update: (dt, t, params) => {
      const R = Math.max(10, params.R ?? 60);
      const thetaDeg = params.theta ?? 18;
      const mu = params.mu ?? 0.25;
      const v = params.v ?? 22;
      const g = 9.81;
      const rad = (thetaDeg * Math.PI) / 180;
      const tanT = Math.tan(rad);
      const vOpt = Math.sqrt(R * g * tanT);
      const vMax = Math.sqrt((R * g * (mu + tanT)) / Math.max(0.05, 1 - mu * tanT));

      trackPivot.rotation.z = rad;
      car.position.x = v > vMax ? 1.15 + Math.sin(t * 7) * 0.25 : 0;
      car.position.z = ((t * v * 0.16) % 5.6) - 2.8;
      wheels.forEach((w) => (w.rotation.z -= v * dt * 0.5));

      const pts: { x: number; y: number }[] = [];
      for (let ang = 0; ang <= 45; ang += 3) {
        const rr = (ang * Math.PI) / 180;
        const tt = Math.tan(rr);
        pts.push({ x: ang, y: Math.sqrt((R * g * (mu + tt)) / Math.max(0.08, 1 - mu * tt)) });
      }
      return {
        substitutedFormula: `F1 Curve: v_max = ${(vMax * 3.6).toFixed(0)} km/h (${vMax.toFixed(1)} m/s)`,
        readouts: [
          { symbol: 'v_max', label: { en: 'Max Safe Turn', hi: 'अधिकतम सुरक्षित चाल' }, value: vMax.toFixed(1), unit: 'm/s', accent: 'force' },
          { symbol: 'v_opt', label: { en: 'No-Wear Speed', hi: 'आदर्श चाल' }, value: vOpt.toFixed(1), unit: 'm/s', accent: 'velocity' },
          { symbol: 'Speed', label: { en: 'F1 Car Speed', hi: 'F1 कार चाल' }, value: (v * 3.6).toFixed(0), unit: 'km/h', accent: 'momentum' },
          { symbol: 'Grip', label: { en: 'Tire Status', hi: 'टायर पकड़' }, value: v <= vMax ? 'GRIP OK' : 'SKIDDING', unit: '', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: thetaDeg, y: vMax },
      };
    },
  };
}

function buildEyeglassesRealLife3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  // Highway sign / open book on the left
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.2, 2.8), p.contrastMat());
  signBoard.position.set(-4.6, 0.4, 0);
  addCrispEdges(signBoard, p.edgeMat());
  const letterE = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.0, 0.24), p.solidMat());
  letterE.position.set(-4.5, 0.4, 0);
  group.add(signBoard, letterE);

  // Eyeglass frame + lens in the middle
  const frameRim = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.08, 12, 36), p.solidMat());
  frameRim.rotation.y = Math.PI / 2;
  frameRim.position.set(-1.1, 0, 0);
  const templeArm = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.09, 0.09), p.solidMat());
  templeArm.position.set(0.2, 0.4, 1.12);
  const templeArm2 = templeArm.clone();
  templeArm2.position.z = -1.12;
  group.add(frameRim, templeArm, templeArm2);

  const convexSpec = new THREE.Mesh(createOpticalLensGeometry(1.08, 0.24, 'convex'), p.glassMat(0.42));
  convexSpec.position.set(-1.1, 0, 0);
  const concaveSpec = new THREE.Mesh(createOpticalLensGeometry(1.08, 0.24, 'concave'), p.glassMat(0.42));
  concaveSpec.position.set(-1.1, 0, 0);
  group.add(convexSpec, concaveSpec);

  // Cutaway eye + retina screen on the right
  const eyeball = new THREE.Mesh(new THREE.SphereGeometry(1.45, 28, 22, 0, Math.PI * 1.4), p.glassMat(0.24));
  eyeball.position.set(2.2, 0, 0);
  const retinaSpot = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), p.solidMat());
  group.add(eyeball, retinaSpot);

  const rayTop = createReusableLine(4, p.edgeMat());
  const rayBot = createReusableLine(4, p.edgeMat());
  group.add(rayTop, rayBot);

  return {
    group,
    defaultCamPos: [0.4, 2.8, 9.8],
    defaultTarget: [0, 0.1, 0],
    update: (_dt, _t, params) => {
      const defectType = Math.round(params.defectType ?? 0);
      const isMyopia = defectType === 0;
      const defectDist_cm = Math.max(25, params.defectDist ?? (isMyopia ? 100 : 75));
      const lensPower = params.lensPower ?? 0;

      const reqP = isMyopia ? -100 / defectDist_cm : 4.0 - 100 / defectDist_cm;
      const residualErr = reqP - lensPower;
      const focusShift = Math.max(-1.05, Math.min(1.05, -residualErr * 0.22));
      const focusX = 3.55 + focusShift;
      const sharp = Math.abs(residualErr) < 0.2;

      convexSpec.visible = lensPower > 0.05;
      concaveSpec.visible = lensPower < -0.05;
      frameRim.visible = Math.abs(lensPower) > 0.05;
      signBoard.position.x = isMyopia ? -4.8 : -3.1;
      letterE.position.x = signBoard.position.x + 0.1;

      retinaSpot.position.set(focusX, 0, 0);
      retinaSpot.scale.setScalar(sharp ? 0.65 : 1.45);

      const yStart = isMyopia ? 0.72 : 0.15;
      const yMid = 0.72;
      const yEye = Math.max(0.25, Math.min(1.05, yMid - lensPower * 0.06));
      setLinePoints(rayTop, [[signBoard.position.x, yStart, 0], [-1.1, yMid, 0], [0.9, yEye, 0], [focusX, 0, 0]]);
      setLinePoints(rayBot, [[signBoard.position.x, -yStart, 0], [-1.1, -yMid, 0], [0.9, -yEye, 0], [focusX, 0, 0]]);

      const pts: { x: number; y: number }[] = [];
      for (let d = 30; d <= 300; d += 15) {
        pts.push({ x: d, y: isMyopia ? -100 / d : 4 - 100 / d });
      }
      return {
        substitutedFormula: `Glasses P = ${lensPower.toFixed(2)} D | Required P = ${reqP.toFixed(2)} D ⇒ ${sharp ? 'CRISP VISION' : 'BLURRY'}`,
        readouts: [
          { symbol: 'P_req', label: { en: 'Exact Glasses Rx', hi: 'सही चश्मा नंबर' }, value: `${reqP >= 0 ? '+' : ''}${reqP.toFixed(2)}`, unit: 'D', accent: 'force' },
          { symbol: 'P_now', label: { en: 'Current Glasses', hi: 'लगा चश्मा पावर' }, value: `${lensPower >= 0 ? '+' : ''}${lensPower.toFixed(2)}`, unit: 'D', accent: 'velocity' },
          { symbol: 'Vision', label: { en: 'Clarity Status', hi: 'दृष्टि स्पष्टता' }, value: sharp ? 'SHARP' : 'BLURRY', unit: '', accent: 'energy' },
          { symbol: 'Scene', label: { en: 'Viewing Target', hi: 'देखा जा रहा लक्ष्य' }, value: isMyopia ? 'ROAD SIGN' : 'BOOK PAGE', unit: '', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: Math.min(300, defectDist_cm), y: reqP },
      };
    },
    getCallouts: (_params, tel) => [
      { label: `${tel.readouts[3]?.value}`, pos: [signBoard.position.x, 1.85, 0] },
      { label: `Rx: ${tel.readouts[0]?.value} D`, pos: [-1.1, 1.55, 0] },
      { label: `${tel.readouts[2]?.value}`, pos: [3.5, 1.55, 0] },
    ],
  };
}

function buildSubmarineBuoyancy3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const oceanTank = new THREE.Mesh(new THREE.BoxGeometry(7.2, 5.0, 4.0), p.glassMat(0.2));
  addCrispEdges(oceanTank, p.edgeMat());
  group.add(oceanTank);

  const waterSurface = new THREE.Mesh(new THREE.BoxGeometry(7.0, 3.6, 3.8), p.translucentMat(0.22));
  waterSurface.position.y = -0.65;
  group.add(waterSurface);

  const { sub, prop } = create3DSubmarine(p);
  group.add(sub);

  return {
    group,
    defaultCamPos: [3.6, 2.6, 9.2],
    defaultTarget: [0, 0, 0],
    update: (dt, t, params) => {
      const rhoObj = Math.max(100, params.rhoObj ?? 650);
      const rhoFluid = Math.max(200, params.rhoFluid ?? 1000);
      const vol = Math.max(0.05, params.vol ?? 0.5);
      const depth = Math.max(0.5, params.depth ?? 4);
      const g = 9.81;

      const subFrac = Math.min(1, rhoObj / rhoFluid);
      const Fb = rhoFluid * vol * subFrac * g;
      const W = rhoObj * vol * g;
      const yTarget = rhoObj <= rhoFluid ? 1.15 - subFrac * 1.15 : -1.45;
      sub.position.y = yTarget + Math.sin(t * 2) * 0.08;
      prop.rotation.x += dt * 7;

      const pts: { x: number; y: number }[] = [];
      for (let r = 200; r <= 2000; r += 100) {
        pts.push({ x: r, y: Math.min(1, r / rhoFluid) * 100 });
      }
      return {
        substitutedFormula: `Submarine Ballast ρ = ${rhoObj} kg/m³ vs Sea ${rhoFluid} kg/m³ ⇒ ${rhoObj < rhoFluid ? 'SURFACING' : 'DIVING'}`,
        readouts: [
          { symbol: 'F_B', label: { en: 'Ocean Upthrust', hi: 'उत्प्लावन बल' }, value: Fb.toFixed(0), unit: 'N', accent: 'force' },
          { symbol: 'W', label: { en: 'Submarine Weight', hi: 'पनडुब्बी भार' }, value: W.toFixed(0), unit: 'N', accent: 'momentum' },
          { symbol: 'Hull', label: { en: 'Submerged', hi: 'डूबा भाग' }, value: (subFrac * 100).toFixed(0), unit: '%', accent: 'velocity' },
          { symbol: 'P', label: { en: 'Hull Pressure', hi: 'समुद्री दाब' }, value: ((101325 + rhoFluid * g * depth) / 1000).toFixed(1), unit: 'kPa', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: rhoObj, y: subFrac * 100 },
      };
    },
  };
}

function buildAirplaneWingLift3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  // Cambered airfoil extruded across Z
  const wingShape = new THREE.Shape();
  wingShape.moveTo(-2.2, 0);
  wingShape.bezierCurveTo(-1.2, 0.95, 0.8, 0.65, 2.4, -0.05);
  wingShape.bezierCurveTo(0.8, -0.18, -1.0, -0.18, -2.2, 0);
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 3.4, bevelEnabled: false });
  wingGeo.translate(0, 0, -1.7);
  const wing = new THREE.Mesh(wingGeo, p.solidMat());
  addCrispEdges(wing, p.edgeMat(), 22);
  group.add(wing);

  const airTop: THREE.Mesh[] = [];
  const airBot: THREE.Mesh[] = [];
  for (let i = 0; i < 12; i++) {
    const tM = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), p.solidMat());
    tM.userData = { u: i / 12, z: ((i % 3) - 1) * 1.1 };
    const bM = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), p.matteMidMat());
    bM.userData = { u: i / 12, z: ((i % 3) - 1) * 1.1 };
    group.add(tM, bM);
    airTop.push(tM);
    airBot.push(bM);
  }

  const liftArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.6, 0), 2.2, p.primaryHex, 0.4, 0.24);
  group.add(liftArrow);

  return {
    group,
    defaultCamPos: [2.8, 2.6, 8.6],
    defaultTarget: [0, 0.4, 0],
    update: (dt, _t, params, showVectors) => {
      const v1 = Math.max(0.5, params.v1 ?? 3);
      const ratio = Math.max(1, params.ratio ?? 2.5);
      const rho = Math.max(100, params.rho ?? 1000);
      const P1 = Math.max(20, params.P1 ?? 150);
      const v2 = v1 * ratio;
      const dP = (0.5 * rho * (v2 * v2 - v1 * v1)) / 1000;
      const P2 = P1 - dP;

      airTop.forEach((m) => {
        m.userData.u = (m.userData.u + v2 * 0.08 * dt) % 1;
        const x = -4.2 + m.userData.u * 8.4;
        const bump = Math.exp(-Math.pow(x * 0.55, 2)) * 0.95;
        m.position.set(x, 0.35 + bump, m.userData.z);
      });
      airBot.forEach((m) => {
        m.userData.u = (m.userData.u + v1 * 0.08 * dt) % 1;
        const x = -4.2 + m.userData.u * 8.4;
        m.position.set(x, -0.52, m.userData.z);
      });

      liftArrow.visible = showVectors;
      liftArrow.setLength(Math.min(3.2, 0.8 + Math.max(0, dP) * 0.04), 0.38, 0.22);

      const pts: { x: number; y: number }[] = [];
      for (let rr = 1; rr <= 4; rr += 0.2) {
        const vv = v1 * rr;
        pts.push({ x: rr, y: P1 - (0.5 * rho * (vv * vv - v1 * v1)) / 1000 });
      }
      return {
        substitutedFormula: `Wing Lift ΔP = ½ρ(v_top² − v_bot²) = ${dP.toFixed(1)} kPa`,
        readouts: [
          { symbol: 'v_top', label: { en: 'Upper Wing Air', hi: 'ऊपरी वायु चाल' }, value: v2.toFixed(1), unit: 'm/s', accent: 'velocity' },
          { symbol: 'ΔP', label: { en: 'Lift Pressure', hi: 'लिफ्ट दाब अंतर' }, value: dP.toFixed(1), unit: 'kPa', accent: 'force' },
          { symbol: 'P_top', label: { en: 'Top Static P', hi: 'ऊपरी दाब' }, value: P2.toFixed(1), unit: 'kPa', accent: 'momentum' },
          { symbol: 'v_bot', label: { en: 'Lower Wing Air', hi: 'निचली वायु चाल' }, value: v1.toFixed(1), unit: 'm/s', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: ratio, y: P2 },
      };
    },
  };
}

function buildAmbulanceDoppler3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const road = new THREE.Mesh(new THREE.BoxGeometry(13, 0.16, 3.2), p.contrastMat());
  addCrispEdges(road, p.edgeMat());
  road.position.y = -0.08;
  group.add(road);

  const { amb, beacon } = create3DAmbulance(p);
  amb.scale.setScalar(0.8);
  group.add(amb);

  const observer = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 1.35, 16), p.solidMat());
  observer.position.set(3.8, 0.68, 1.5);
  group.add(observer);

  const ripples: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.035, 10, 48), p.edgeMat());
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.65;
    group.add(ring);
    ripples.push(ring);
  }

  return {
    group,
    defaultCamPos: [0, 5.2, 9.6],
    defaultTarget: [0, 0.5, 0],
    update: (_dt, t, params) => {
      const f0 = Math.max(100, params.f0 ?? 500);
      const vs = params.vs ?? 35;
      const vo = params.vo ?? 0;
      const vSound = 340;
      const fApp = f0 * ((vSound + vo) / Math.max(20, vSound - vs));
      const fRec = f0 * ((vSound - vo) / Math.max(20, vSound + vs));

      const ax = -4.6 + ((t * (1.2 + Math.abs(vs) * 0.025)) % 9.2);
      amb.position.set(ax, 0, 0);
      beacon.scale.setScalar(1 + Math.sin(t * 14) * 0.25);

      ripples.forEach((r, idx) => {
        const age = ((t * 1.4 + idx / 6) % 1);
        const radius = 0.4 + age * 4.4;
        r.scale.setScalar(radius);
        // Earlier emitted center trails behind the moving ambulance
        r.position.x = ax - age * (vs / 340) * 3.8;
      });

      const pts: { x: number; y: number }[] = [];
      for (let s = 0; s <= 120; s += 10) {
        pts.push({ x: s, y: f0 * ((vSound + vo) / Math.max(40, vSound - s)) });
      }
      return {
        substitutedFormula: `Ambulance Siren: Approach = ${fApp.toFixed(0)} Hz | Recede = ${fRec.toFixed(0)} Hz`,
        readouts: [
          { symbol: 'f_app', label: { en: 'Approaching Pitch', hi: 'पास आते समय आवृत्ति' }, value: fApp.toFixed(0), unit: 'Hz', accent: 'force' },
          { symbol: 'f_rec', label: { en: 'Passing Pitch', hi: 'दूर जाते समय आवृत्ति' }, value: fRec.toFixed(0), unit: 'Hz', accent: 'velocity' },
          { symbol: 'v_s', label: { en: 'Ambulance Speed', hi: 'एम्बुलेंस चाल' }, value: (vs * 3.6).toFixed(0), unit: 'km/h', accent: 'momentum' },
          { symbol: 'f₀', label: { en: 'True Siren Pitch', hi: 'मूल सायरन आवृत्ति' }, value: f0.toFixed(0), unit: 'Hz', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: Math.abs(vs), y: fApp },
      };
    },
    getStrobePos: () => amb.position.clone().add(new THREE.Vector3(0, 0.8, 0)),
  };
}

function buildRollerCoaster3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const railL = createReusableLine(64, p.edgeMat());
  const railR = createReusableLine(64, p.edgeMat());
  group.add(railL, railR);

  const coasterCar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.55, 0.8), p.solidMat());
  addCrispEdges(coasterCar, p.edgeMat());
  group.add(coasterCar);

  for (let i = -4; i <= 4; i += 2) {
    const h = 1.6 + Math.cos((i / 4) * Math.PI) * 1.1;
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, Math.max(0.5, h), 10), p.matteMidMat());
    pillar.position.set(i, -1.6 + h / 2, 0);
    group.add(pillar);
  }

  return {
    group,
    defaultCamPos: [0, 3.2, 9.6],
    defaultTarget: [0, 0.4, 0],
    update: (_dt, t, params) => {
      const m = Math.max(0.5, params.m ?? 2);
      const h0 = Math.max(1, params.h0 ?? 10);
      const g = Math.max(1, params.g ?? 9.8);
      const damping = Math.max(0, params.damping ?? 0);

      const cL: [number, number, number][] = [];
      const cR: [number, number, number][] = [];
      for (let i = 0; i < 64; i++) {
        const u = -1 + (i / 63) * 2;
        const y = -1.2 + (u * u) * 3.0 + Math.cos(u * Math.PI * 2) * 0.35;
        cL.push([u * 4.4, y, 0.45]);
        cR.push([u * 4.4, y, -0.45]);
      }
      setLinePoints(railL, cL);
      setLinePoints(railR, cR);

      const amp = Math.exp(-damping * (t % 12) * 0.2);
      const uPos = Math.cos(t * 1.75) * amp;
      const yPos = -1.2 + uPos * uPos * 3.0 + Math.cos(uPos * Math.PI * 2) * 0.35;
      coasterCar.position.set(uPos * 4.4, yPos + 0.3, 0);

      const hNow = Math.max(0, h0 * ((yPos + 1.55) / 3.7));
      const E = m * g * h0 * amp * amp;
      const U = Math.min(E, m * g * hNow);
      const K = Math.max(0, E - U);
      const v = Math.sqrt((2 * K) / m);

      const pts: { x: number; y: number }[] = [];
      for (let hh = 0; hh <= h0; hh += h0 / 20) {
        pts.push({ x: hh, y: m * g * (h0 - hh) });
      }
      return {
        substitutedFormula: `Coaster: Height ${hNow.toFixed(1)} m ⇒ Speed v = ${v.toFixed(1)} m/s (${(v * 3.6).toFixed(0)} km/h)`,
        readouts: [
          { symbol: 'v', label: { en: 'Coaster Speed', hi: 'कोस्टर चाल' }, value: v.toFixed(1), unit: 'm/s', accent: 'velocity' },
          { symbol: 'K', label: { en: 'Kinetic Energy', hi: 'गतिज ऊर्जा' }, value: K.toFixed(0), unit: 'J', accent: 'force' },
          { symbol: 'U', label: { en: 'Height Energy', hi: 'ऊँचाई ऊर्जा' }, value: U.toFixed(0), unit: 'J', accent: 'energy' },
          { symbol: 'h', label: { en: 'Track Height', hi: 'ट्रैक ऊँचाई' }, value: hNow.toFixed(1), unit: 'm', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: hNow, y: K },
      };
    },
    getStrobePos: () => coasterCar.position.clone(),
  };
}

function buildSolarRoof3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const roof = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.25, 3.6), p.contrastMat());
  roof.rotation.z = -0.35;
  roof.position.y = -0.8;
  addCrispEdges(roof, p.edgeMat());
  group.add(roof);

  const panel = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.14, 2.8), p.solidMat());
  panel.rotation.z = -0.35;
  panel.position.set(0, -0.58, 0);
  addCrispEdges(panel, p.edgeMat());
  group.add(panel);

  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 24), p.solidMat());
  sun.position.set(-3.4, 2.8, 0);
  group.add(sun);

  const photons: THREE.Mesh[] = [];
  for (let i = 0; i < 10; i++) {
    const ph = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), p.matteMidMat());
    ph.userData = { u: i / 10, z: ((i % 3) - 1) * 0.7 };
    group.add(ph);
    photons.push(ph);
  }

  return {
    group,
    defaultCamPos: [2.4, 3.2, 8.8],
    defaultTarget: [0, 0.2, 0],
    update: (dt, _t, params) => {
      const lambda_nm = Math.max(150, params.lambda ?? 350);
      const phi = Math.max(1.0, params.phi ?? 2.2);
      const E_ph = 1240 / lambda_nm;
      const Kmax = Math.max(0, E_ph - phi);

      photons.forEach((ph) => {
        ph.userData.u = (ph.userData.u + dt * 0.65) % 1;
        const u = ph.userData.u;
        ph.position.set(-3.2 + u * 3.4, 2.6 - u * 3.0, ph.userData.z);
      });

      const pts: { x: number; y: number }[] = [];
      for (let l = 150; l <= 750; l += 25) {
        pts.push({ x: l, y: Math.max(0, 1240 / l - phi) });
      }
      return {
        substitutedFormula: `Solar Panel: E_photon = ${E_ph.toFixed(2)} eV | Output V₀ = ${Kmax.toFixed(2)} V`,
        readouts: [
          { symbol: 'K_max', label: { en: 'Electron Energy', hi: 'इलेक्ट्रॉन ऊर्जा' }, value: Kmax.toFixed(2), unit: 'eV', accent: 'energy' },
          { symbol: 'E_ph', label: { en: 'Sunlight Photon', hi: 'सूर्य फोटॉन ऊर्जा' }, value: E_ph.toFixed(2), unit: 'eV', accent: 'velocity' },
          { symbol: 'Cell', label: { en: 'Solar Current', hi: 'सोलर धारा' }, value: Kmax > 0 ? 'CHARGING' : 'NO POWER', unit: '', accent: 'force' },
          { symbol: 'λ', label: { en: 'Light Wavelength', hi: 'तरंगदैर्ध्य' }, value: lambda_nm.toFixed(0), unit: 'nm', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: lambda_nm, y: Kmax },
      };
    },
  };
}

function buildConcertFlute3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const flute = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 7.6, 28, 1, true), p.glassMat(0.32));
  flute.rotation.z = Math.PI / 2;
  addCrispEdges(flute, p.edgeMat(), 30);
  group.add(flute);

  for (let i = 0; i < 6; i++) {
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.14, 14), p.solidMat());
    hole.position.set(-1.4 + i * 0.72, 0.42, 0);
    group.add(hole);
  }

  const waveLine = createReusableLine(64, p.edgeMat());
  group.add(waveLine);

  return {
    group,
    defaultCamPos: [0, 2.8, 8.6],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params) => {
      const pipeType = Math.round(params.pipeType ?? 0);
      const L = Math.max(0.2, params.L ?? 0.65);
      const n = Math.max(1, Math.round(params.n ?? 1));
      const vSound = 340;
      const isOpen = pipeType === 0;
      const f = isOpen ? (n * vSound) / (2 * L) : ((2 * n - 1) * vSound) / (4 * L);

      const coords: [number, number, number][] = [];
      for (let i = 0; i < 64; i++) {
        const u = i / 63;
        const x = -3.6 + u * 7.2;
        const env = isOpen ? Math.cos(n * Math.PI * u) : Math.sin(((2 * n - 1) * Math.PI * u) / 2);
        coords.push([x, env * 0.36 * Math.sin(t * 9), 0]);
      }
      setLinePoints(waveLine, coords);

      const pts: { x: number; y: number }[] = [];
      for (let ll = 0.2; ll <= 1.5; ll += 0.1) {
        pts.push({ x: ll, y: isOpen ? (n * vSound) / (2 * ll) : ((2 * n - 1) * vSound) / (4 * ll) });
      }
      return {
        substitutedFormula: `Concert Flute (${isOpen ? 'Open' : 'Closed'}): f = ${f.toFixed(0)} Hz`,
        readouts: [
          { symbol: 'f', label: { en: 'Musical Pitch', hi: 'बाँसुरी सुर आवृत्ति' }, value: f.toFixed(0), unit: 'Hz', accent: 'velocity' },
          { symbol: 'L', label: { en: 'Air Column Length', hi: 'वायु स्तंभ लंबाई' }, value: (L * 100).toFixed(0), unit: 'cm', accent: 'momentum' },
          { symbol: 'n', label: { en: 'Harmonic Mode', hi: 'संनादी क्रम' }, value: String(n), unit: '', accent: 'force' },
          { symbol: 'Pipe', label: { en: 'Flute End', hi: 'बाँसुरी सिरा' }, value: isOpen ? 'OPEN' : 'CLOSED', unit: '', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: L, y: f },
      };
    },
  };
}

function buildCityBroadcastTower3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const earthArc = new THREE.Mesh(new THREE.SphereGeometry(7.5, 36, 24), p.contrastMat());
  earthArc.position.y = -7.6;
  addCrispEdges(earthArc, p.edgeMat(), 35);
  group.add(earthArc);

  const tower = new THREE.Mesh(new THREE.ConeGeometry(0.42, 3.2, 4), p.solidMat());
  tower.position.set(0, 1.5, 0);
  addCrispEdges(tower, p.edgeMat());
  group.add(tower);

  // City buildings around tower
  [-2.6, -1.6, 1.7, 2.7].forEach((bx, idx) => {
    const h = 0.55 + (idx % 2) * 0.4;
    const bld = new THREE.Mesh(new THREE.BoxGeometry(0.55, h, 0.55), p.matteMidMat());
    addCrispEdges(bld, p.edgeMat());
    bld.position.set(bx, h / 2 - 0.35, 0.6);
    group.add(bld);
  });

  const waveRings = [0, 1, 2].map(() => {
    const r = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.03, 10, 40), p.edgeMat());
    r.rotation.x = Math.PI / 2;
    group.add(r);
    return r;
  });

  return {
    group,
    defaultCamPos: [0, 3.8, 9.8],
    defaultTarget: [0, 1.0, 0],
    update: (_dt, t, params) => {
      const hT = Math.max(10, params.hT ?? 120);
      const hR = Math.max(0, params.hR ?? 20);
      const R_E = 6400e3;
      const dMax_km = (Math.sqrt(2 * R_E * hT) + Math.sqrt(2 * R_E * hR)) / 1000;
      const area_km2 = (2 * Math.PI * R_E * hT) / 1e6;

      const tScale = 0.6 + (hT / 300) * 1.4;
      tower.scale.y = tScale;
      tower.position.y = (3.2 * tScale) / 2 - 0.1;

      waveRings.forEach((r, i) => {
        const phase = (t * 0.7 + i / 3) % 1;
        r.position.y = 3.1 * tScale;
        r.scale.setScalar(0.3 + phase * 4.5);
      });

      const pts: { x: number; y: number }[] = [];
      for (let hh = 20; hh <= 300; hh += 20) {
        pts.push({ x: hh, y: (Math.sqrt(2 * R_E * hh) + Math.sqrt(2 * R_E * hR)) / 1000 });
      }
      return {
        substitutedFormula: `City TV Tower: Range = ${dMax_km.toFixed(1)} km | City Area = ${area_km2.toFixed(0)} km²`,
        readouts: [
          { symbol: 'd_M', label: { en: 'Signal Reach', hi: 'सिग्नल परास' }, value: dMax_km.toFixed(1), unit: 'km', accent: 'velocity' },
          { symbol: 'Area', label: { en: 'City Coverage', hi: 'शहर कवरेज क्षेत्र' }, value: area_km2.toFixed(0), unit: 'km²', accent: 'energy' },
          { symbol: 'h_T', label: { en: 'Tower Height', hi: 'टावर ऊँचाई' }, value: hT.toFixed(0), unit: 'm', accent: 'force' },
          { symbol: 'h_R', label: { en: 'Home Antenna', hi: 'घर एंटीना' }, value: hR.toFixed(0), unit: 'm', accent: 'momentum' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: hT, y: dMax_km },
      };
    },
  };
}

function buildPowerSubstation3D(p: Palette3D): SceneRig {
  const group = new THREE.Group();
  const pad = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.25, 4.4), p.contrastMat());
  addCrispEdges(pad, p.edgeMat());
  pad.position.y = -1.6;
  group.add(pad);

  const tank = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.4, 2.0), p.solidMat());
  addCrispEdges(tank, p.edgeMat());
  tank.position.y = -0.3;
  group.add(tank);

  // Porcelain bushings on top
  [-1.0, 0, 1.0].forEach((x) => {
    const bush = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 1.3, 14), p.contrastMat());
    addCrispEdges(bush, p.edgeMat());
    bush.position.set(x, 1.5, 0);
    group.add(bush);
  });

  // High-voltage & home-distribution pylons
  const pylonL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.28, 3.8, 6), p.matteMidMat());
  pylonL.position.set(-3.6, 0.4, 0);
  const pylonR = pylonL.clone();
  pylonR.position.x = 3.6;
  group.add(pylonL, pylonR);

  const powerPulses: THREE.Mesh[] = [];
  for (let i = 0; i < 8; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), p.solidMat());
    s.userData = { u: i / 8 };
    group.add(s);
    powerPulses.push(s);
  }

  return {
    group,
    defaultCamPos: [2.6, 2.8, 9.2],
    defaultTarget: [0, 0.2, 0],
    update: (dt, _t, params) => {
      const Vp = Math.max(10, params.Vp ?? 220);
      const Np = Math.max(10, params.Np ?? 200);
      const Ns = Math.max(10, params.Ns ?? 600);
      const Ip = Math.max(0.5, params.Ip ?? 6);
      const k = Ns / Np;
      const Vs = Vp * k;
      const Is = Ip / k;

      powerPulses.forEach((s) => {
        s.userData.u = (s.userData.u + dt * 0.45) % 1;
        s.position.set(-3.6 + s.userData.u * 7.2, 2.15, 0);
      });

      const pts: { x: number; y: number }[] = [];
      for (let ns = 50; ns <= 1000; ns += 50) {
        pts.push({ x: ns, y: (Vp * ns) / Np });
      }
      return {
        substitutedFormula: `Grid Substation: ${Vp} V → ${Vs.toFixed(0)} V (${k > 1 ? 'Step-Up' : 'Step-Down'})`,
        readouts: [
          { symbol: 'V_s', label: { en: 'Grid Output V', hi: 'आउटपुट वोल्टेज' }, value: Vs.toFixed(0), unit: 'V', accent: 'force' },
          { symbol: 'I_s', label: { en: 'Line Current', hi: 'लाइन धारा' }, value: Is.toFixed(2), unit: 'A', accent: 'velocity' },
          { symbol: 'k', label: { en: 'Turns Ratio', hi: 'फेरा अनुपात' }, value: k.toFixed(2), unit: '×', accent: 'momentum' },
          { symbol: 'P', label: { en: 'Substation Power', hi: 'सबस्टेशन शक्ति' }, value: (Vp * Ip).toFixed(0), unit: 'W', accent: 'energy' },
        ],
        graphPoints: pts,
        graphCurrentPoint: { x: Ns, y: Vs },
      };
    },
  };
}

/**
 * Wraps any lab 3D rig inside a crisp real-world studio plinth / context frame
 * with subtle environmental landmarks and real-life formula telemetry banner,
 * guaranteeing all 66 simulations work cleanly in 3D Real-Life Example mode.
 */
function buildContextualRealLifeWrapper3D(
  sim: PhysicsSimulation,
  p: Palette3D,
  innerRig: SceneRig
): SceneRig {
  const scenario = getRealLifeScenario(sim);
  const group = new THREE.Group();

  // Architectural real-world showcase base platform with corner survey posts
  const stageBase = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 6.0, 0.22, 48), p.contrastMat());
  stageBase.position.y = -2.75;
  addCrispEdges(stageBase, p.edgeMat(), 30);
  group.add(stageBase);

  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.04, 10, 64), p.matteMidMat());
  outerRing.rotation.x = Math.PI / 2;
  outerRing.position.y = -2.62;
  group.add(outerRing);

  group.add(innerRig.group);

  return {
    group,
    defaultCamPos: [
      innerRig.defaultCamPos[0] * 1.08,
      innerRig.defaultCamPos[1] * 1.08 + 0.4,
      innerRig.defaultCamPos[2] * 1.08,
    ],
    defaultTarget: innerRig.defaultTarget,
    update: (dt, t, params, showVectors): LiveSimTelemetry => {
      const tel = innerRig.update(dt, t, params, showVectors);
      return {
        ...tel,
        substitutedFormula: `[Real-Life: ${scenario.title.en}] ${tel.substitutedFormula}`,
      };
    },
    getCallouts: innerRig.getCallouts,
    getStrobePos: innerRig.getStrobePos,
  };
}
