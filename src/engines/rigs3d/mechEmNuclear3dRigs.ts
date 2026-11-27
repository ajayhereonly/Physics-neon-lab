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
// 9. 3D LABORATORY SIMPLE PENDULUM (GANTRY STAND, BOB & 3D VECTORS)
// ============================================================================
export function buildSimplePendulumRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Heavy Laboratory Base Plate + Dual A-Frame Support Uprights + Overhead Pivot Beam
  const basePlate = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.24, 2.8), pal.contrastMat());
  basePlate.position.y = -2.25;
  addCrispEdges(basePlate, pal.edgeMat());

  const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 4.9, 12), pal.solidMat());
  postL.position.set(-2.3, 0.2, 0);
  const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 4.9, 12), pal.solidMat());
  postR.position.set(2.3, 0.2, 0);
  const topBeam = new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.24, 0.32), pal.solidMat());
  topBeam.position.set(0, 2.65, 0);
  addCrispEdges(topBeam, pal.edgeMat());

  const pivotClamp = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.42, 16), pal.contrastMat());
  pivotClamp.rotation.x = Math.PI / 2;
  pivotClamp.position.set(0, 2.52, 0);
  addCrispEdges(pivotClamp, pal.edgeMat());
  group.add(basePlate, postL, postR, topBeam, pivotClamp);

  // Pivoting Pendulum Arm Group (origin at pivot (0, 2.52, 0))
  const armGroup = new THREE.Group();
  armGroup.position.set(0, 2.52, 0);

  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 1.0, 10), pal.solidMat());
  const bobGroup = new THREE.Group();
  const bobSphere = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 18), pal.solidMat());
  const bobBand = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.032, 8, 32), pal.contrastMat());
  bobBand.rotation.x = Math.PI / 2;
  bobGroup.add(bobSphere, bobBand);
  armGroup.add(cord, bobGroup);
  group.add(armGroup);

  // Equilibrium vertical dashed line + Swept Arc Trail
  const eqLine = createReusableLine(2, pal.dashedLineMat());
  setLinePoints(eqLine, [[0, 2.52, 0], [0, -2.0, 0]], true);
  const arcTrail = createReusableLine(48, pal.mutedLineMat());
  group.add(eqLine, arcTrail);

  // Live 3D Vectors: Velocity v, Gravity mg, Tension T
  const vArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.4, pal.primaryHex, 0.34, 0.18);
  const mgArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(), 1.2, pal.midHex, 0.3, 0.16);
  const tArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 1.2, pal.primaryHex, 0.3, 0.16);
  group.add(vArrow, mgArrow, tArrow);

  const histTheta: { x: number; y: number }[] = [];

  return {
    group,
    defaultCamPos: [3.2, 2.2, 8.4],
    defaultTarget: [0, 0.2, 0],
    update: (dt, t, params, showVectors) => {
      const L = Math.max(0.4, params.L ?? 1.0);
      const g = Math.max(1.6, params.g ?? 9.8);
      const theta0Deg = params.theta0 ?? 20;
      const m = params.m ?? 1.0;

      const omega = Math.sqrt(g / L);
      const T = (2 * Math.PI) / omega;
      const theta0 = (theta0Deg * Math.PI) / 180;
      const theta = theta0 * Math.cos(omega * t);
      const thetaDot = -theta0 * omega * Math.sin(omega * t);
      const vSpeed = L * thetaDot;
      const tension = m * g * Math.cos(theta) + m * L * thetaDot * thetaDot;

      // Scale visual cord length nicely within gantry frame
      const lVis = 1.45 + ((L - 0.4) / 3.6) * 2.45;
      cord.scale.set(1, lVis, 1);
      cord.position.y = -lVis / 2;
      bobGroup.position.y = -lVis;
      bobGroup.scale.setScalar(0.75 + (m / 5) * 0.48);
      armGroup.rotation.z = theta;

      // Update swept arc curve
      const arcPts: [number, number, number][] = [];
      for (let i = 0; i < 48; i++) {
        const u = i / 47;
        const a = -theta0 + u * 2 * theta0;
        arcPts.push([Math.sin(a) * lVis, 2.52 - Math.cos(a) * lVis, 0]);
      }
      setLinePoints(arcTrail, arcPts);

      // World bob position
      const bx = Math.sin(theta) * lVis;
      const by = 2.52 - Math.cos(theta) * lVis;

      vArrow.visible = showVectors && Math.abs(vSpeed) > 0.08;
      mgArrow.visible = showVectors;
      tArrow.visible = showVectors;

      if (vArrow.visible) {
        const sign = vSpeed >= 0 ? 1 : -1;
        vArrow.position.set(bx, by, 0);
        vArrow.setDirection(new THREE.Vector3(Math.cos(theta) * sign, Math.sin(theta) * sign, 0).normalize());
        vArrow.setLength(Math.min(2.1, 0.5 + Math.abs(vSpeed) * 0.4), 0.32, 0.16);
      }
      mgArrow.position.set(bx, by, 0);
      mgArrow.setLength(Math.min(1.8, 0.55 + (m * g) / 30), 0.28, 0.15);

      tArrow.position.set(bx, by, 0);
      tArrow.setDirection(new THREE.Vector3(-Math.sin(theta), Math.cos(theta), 0).normalize());
      tArrow.setLength(Math.min(2.0, 0.6 + tension / 30), 0.28, 0.15);

      if (dt > 0 && (histTheta.length === 0 || t - histTheta[histTheta.length - 1].x >= 0.04)) {
        histTheta.push({ x: t, y: (theta * 180) / Math.PI });
        if (histTheta.length > 90) histTheta.shift();
      }

      return {
        substitutedFormula: `T = 2π·√(${L.toFixed(2)} / ${g.toFixed(1)}) = ${T.toFixed(2)} s  |  f = ${(1 / T).toFixed(2)} Hz`,
        readouts: [
          { symbol: 'T', label: { en: 'Time Period', hi: 'आवर्तकाल (T)' }, value: T.toFixed(2), unit: 's', accent: 'force' },
          { symbol: 'v', label: { en: 'Instantaneous Speed', hi: 'तात्क्षणिक चाल' }, value: Math.abs(vSpeed).toFixed(2), unit: 'm/s', accent: 'velocity' },
          { symbol: 'T_str', label: { en: 'String Tension', hi: 'डोरी तनाव' }, value: tension.toFixed(1), unit: 'N', accent: 'momentum' },
          { symbol: 'θ', label: { en: 'Angle θ(t)', hi: 'कोण θ(t)' }, value: ((theta * 180) / Math.PI).toFixed(1), unit: '°', accent: 'energy' },
        ],
        graphPoints: histTheta.length ? [...histTheta] : [{ x: 0, y: theta0Deg }],
        graphLegend: { primary: 'Angular Displacement θ(t) [deg]' },
      };
    },
  };
}

// ============================================================================
// 10. 3D LAMINATED-CORE STEP-UP / STEP-DOWN TRANSFORMER
// ============================================================================
export function buildTransformerRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Rectangular Laminated Soft-Iron Core (4 limbs with crisp lamination edges)
  const coreGroup = new THREE.Group();
  const limbL = new THREE.Mesh(new THREE.BoxGeometry(0.75, 3.6, 1.05), pal.contrastMat());
  limbL.position.set(-2.1, 0, 0);
  const limbR = new THREE.Mesh(new THREE.BoxGeometry(0.75, 3.6, 1.05), pal.contrastMat());
  limbR.position.set(2.1, 0, 0);
  const yokeT = new THREE.Mesh(new THREE.BoxGeometry(4.95, 0.72, 1.05), pal.contrastMat());
  yokeT.position.set(0, 1.8, 0);
  const yokeB = new THREE.Mesh(new THREE.BoxGeometry(4.95, 0.72, 1.05), pal.contrastMat());
  yokeB.position.set(0, -1.8, 0);
  [limbL, limbR, yokeT, yokeB].forEach((m) => addCrispEdges(m, pal.edgeMat()));
  coreGroup.add(limbL, limbR, yokeT, yokeB);
  group.add(coreGroup);

  // Stacked Coil Rings on Primary (Left) & Secondary (Right) Limbs (up to 14 rings each)
  const MAX_COILS = 14;
  const coilGeo = new THREE.TorusGeometry(0.78, 0.055, 10, 32);
  const primMat = pal.solidMat();
  const secMat = pal.solidMat();
  const primCoils: THREE.Mesh[] = [];
  const secCoils: THREE.Mesh[] = [];

  for (let i = 0; i < MAX_COILS; i++) {
    const pm = new THREE.Mesh(coilGeo, primMat);
    pm.rotation.x = Math.PI / 2;
    pm.position.set(-2.1, 0, 0);
    group.add(pm);
    primCoils.push(pm);

    const sm = new THREE.Mesh(coilGeo, secMat);
    sm.rotation.x = Math.PI / 2;
    sm.position.set(2.1, 0, 0);
    group.add(sm);
    secCoils.push(sm);
  }

  // Animated Circulating Magnetic Flux Loop Arrows inside the Iron Core
  const N_FLUX = 8;
  const fluxCones: THREE.Mesh[] = [];
  const coneGeo = new THREE.ConeGeometry(0.14, 0.36, 10);
  for (let i = 0; i < N_FLUX; i++) {
    const fc = new THREE.Mesh(coneGeo, pal.solidMat());
    group.add(fc);
    fluxCones.push(fc);
  }

  // Path helper around rectangular perimeter of iron core
  const evalCoreLoop = (u: number): [number, number, number] => {
    const w = 2.1;
    const h = 1.8;
    const p = ((u % 1) + 1) % 1;
    if (p < 0.25) {
      const s = p / 0.25;
      return [-w + s * (2 * w), h, 0.62];
    } else if (p < 0.5) {
      const s = (p - 0.25) / 0.25;
      return [w, h - s * (2 * h), 0.62];
    } else if (p < 0.75) {
      const s = (p - 0.5) / 0.25;
      return [w - s * (2 * w), -h, 0.62];
    } else {
      const s = (p - 0.75) / 0.25;
      return [-w, -h + s * (2 * h), 0.62];
    }
  };

  return {
    group,
    defaultCamPos: [2.4, 3.0, 8.2],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params, showVectors) => {
      const Vp = params.Vp ?? 220;
      const Np = Math.max(50, params.Np ?? 400);
      const Ns = Math.max(50, params.Ns ?? 800);
      const Ip = params.Ip ?? 4;

      const kRatio = Ns / Np;
      const Vs = Vp * kRatio;
      const Is = Ip / kRatio;
      const power = Vp * Ip;

      // Display visible coil turn count proportional to Np and Ns
      const nVisP = Math.max(3, Math.min(MAX_COILS, Math.round((Np / 1000) * MAX_COILS)));
      const nVisS = Math.max(3, Math.min(MAX_COILS, Math.round((Ns / 1000) * MAX_COILS)));

      primCoils.forEach((c, idx) => {
        c.visible = idx < nVisP;
        if (c.visible) {
          c.position.y = -1.25 + (idx / Math.max(1, nVisP - 1)) * 2.5;
        }
      });
      secCoils.forEach((c, idx) => {
        c.visible = idx < nVisS;
        if (c.visible) {
          c.position.y = -1.25 + (idx / Math.max(1, nVisS - 1)) * 2.5;
        }
      });

      // Animate AC oscillating magnetic flux direction around the laminated core
      const acSign = Math.sin(t * 2.4) >= 0 ? 1 : -1;
      const fluxPhase = (t * 0.28 * acSign) % 1;
      fluxCones.forEach((fc, i) => {
        fc.visible = showVectors;
        const u = (i / N_FLUX + fluxPhase + 2) % 1;
        const [x, y, z] = evalCoreLoop(u);
        const [nx, ny] = evalCoreLoop(u + 0.01 * acSign);
        fc.position.set(x, y, z);
        fc.rotation.z = Math.atan2(ny - y, nx - x) - Math.PI / 2;
      });

      const graphPoints: { x: number; y: number }[] = [];
      for (let n = 100; n <= 1000; n += 50) {
        graphPoints.push({ x: n, y: Vp * (n / Np) });
      }

      return {
        substitutedFormula: `V_s = V_p·(N_s/N_p) = ${Vp}×(${Ns}/${Np}) = ${Vs.toFixed(0)} V  |  I_s = ${Is.toFixed(2)} A`,
        readouts: [
          { symbol: 'V_s', label: { en: 'Secondary Voltage', hi: 'द्वितीयक वोल्टता (V_s)' }, value: Vs.toFixed(0), unit: 'V', accent: 'force' },
          { symbol: 'I_s', label: { en: 'Secondary Current', hi: 'द्वितीयक धारा (I_s)' }, value: Is.toFixed(2), unit: 'A', accent: 'velocity' },
          { symbol: 'k', label: { en: 'Turns Ratio (N_s/N_p)', hi: 'फेरों का अनुपात' }, value: kRatio.toFixed(2), unit: '', accent: 'momentum' },
          { symbol: 'Mode', label: { en: 'Transformer Type', hi: 'ट्रांसफ़ॉर्मर प्रकार' }, value: kRatio > 1.02 ? 'STEP-UP' : kRatio < 0.98 ? 'STEP-DOWN' : 'ISOLATION', unit: '', accent: 'energy' },
        ],
        graphPoints,
        graphCurrentPoint: { x: Ns, y: Vs },
        graphLegend: { primary: `Secondary Voltage V_s(N_s)  |  Ideal Power = ${power.toFixed(0)} W` },
      };
    },
  };
}

// ============================================================================
// 11. 3D RADIOACTIVE DECAY CHAMBER & HALF-LIFE LATTICE (NUCLEI)
// ============================================================================
export function buildNucleiRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Wireframe Nuclear Containment Chamber Cube
  const chamber = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 4.4, 4.4),
    new THREE.MeshBasicMaterial({ color: pal.midHex, wireframe: true })
  );
  group.add(chamber);

  // 4x4x4 = 64 Deterministic Nuclear Lattice Spheres (each assigned an exact decay threshold u_i)
  const N_LATTICE = 64;
  const nucGeo = new THREE.SphereGeometry(0.24, 14, 12);
  const parentMat = pal.solidMat();
  const daughterMat = pal.contrastMat();
  const edgeMat = pal.edgeMat();

  interface LatticeNode {
    mesh: THREE.Mesh;
    threshold: number; // decays when remaining fraction < threshold
    dir: THREE.Vector3;
    basePos: THREE.Vector3;
    wasDecayed: boolean;
  }

  const nodes: LatticeNode[] = [];
  let idx = 0;
  for (let ix = 0; ix < 4; ix++) {
    for (let iy = 0; iy < 4; iy++) {
      for (let iz = 0; iz < 4; iz++) {
        const mesh = new THREE.Mesh(nucGeo, parentMat);
        const bx = (ix - 1.5) * 0.96;
        const by = (iy - 1.5) * 0.96;
        const bz = (iz - 1.5) * 0.96;
        mesh.position.set(bx, by, bz);
        addCrispEdges(mesh, edgeMat, 35);
        group.add(mesh);

        // Deterministic golden-ratio permutation so decay looks authentically stochastic across the 3D volume
        const threshold = ((idx * 0.61803398875) % 1);
        const dir = new THREE.Vector3(bx + 0.13, by - 0.17, bz + 0.19).normalize();
        nodes.push({
          mesh,
          threshold,
          dir,
          basePos: new THREE.Vector3(bx, by, bz),
          wasDecayed: false,
        });
        idx++;
      }
    }
  }

  // Pool of 12 flying α/β/γ decay streaks bursting outward
  const N_RAYS = 12;
  const streaks: { line: THREE.Line; active: number; origin: THREE.Vector3; dir: THREE.Vector3 }[] = [];
  const rayMat = new THREE.LineBasicMaterial({ color: pal.primaryHex });
  for (let i = 0; i < N_RAYS; i++) {
    const line = createReusableLine(2, rayMat);
    line.visible = false;
    group.add(line);
    streaks.push({
      line,
      active: 0,
      origin: new THREE.Vector3(),
      dir: new THREE.Vector3(1, 0, 0),
    });
  }
  let streakCursor = 0;

  return {
    group,
    defaultCamPos: [5.4, 4.2, 6.8],
    defaultTarget: [0, 0, 0],
    update: (dt, t, params) => {
      const N0 = params.N0 ?? 100;
      const halfLife = Math.max(1, params.halfLife ?? 3);
      const lambda = Math.LN2 / halfLife;
      const tCycle = t % (halfLife * 5);
      const frac = Math.pow(0.5, tCycle / halfLife);
      const N_rem = N0 * frac;
      const activity = lambda * N_rem;

      group.rotation.y = t * 0.22;

      // Update each nucleus state & spawn radial radiation streaks on fresh decay
      for (let i = 0; i < N_LATTICE; i++) {
        const nd = nodes[i];
        const isDecayed = frac < nd.threshold;
        nd.mesh.material = isDecayed ? daughterMat : parentMat;
        nd.mesh.scale.setScalar(isDecayed ? 0.68 : 1.0);

        if (isDecayed && !nd.wasDecayed && dt > 0) {
          const st = streaks[streakCursor % N_RAYS];
          streakCursor++;
          st.active = 1.0;
          st.origin.copy(nd.basePos);
          st.dir.copy(nd.dir);
        }
        nd.wasDecayed = isDecayed;
      }

      // Animate active α/β/γ emission streaks flying out of chamber
      for (let i = 0; i < N_RAYS; i++) {
        const st = streaks[i];
        if (st.active > 0) {
          st.active = Math.max(0, st.active - (dt || 0.016) * 1.9);
          const dist = (1 - st.active) * 3.6;
          const tail = Math.max(0, dist - 0.85);
          st.line.visible = st.active > 0.02;
          setLinePoints(st.line, [
            [
              st.origin.x + st.dir.x * tail,
              st.origin.y + st.dir.y * tail,
              st.origin.z + st.dir.z * tail,
            ],
            [
              st.origin.x + st.dir.x * dist,
              st.origin.y + st.dir.y * dist,
              st.origin.z + st.dir.z * dist,
            ],
          ]);
        } else {
          st.line.visible = false;
        }
      }

      const graphPoints: { x: number; y: number }[] = [];
      for (let tv = 0; tv <= halfLife * 5; tv += halfLife * 0.25) {
        graphPoints.push({ x: Number(tv.toFixed(1)), y: N0 * Math.pow(0.5, tv / halfLife) });
      }

      return {
        substitutedFormula: `N(t) = ${N0} · (1/2)^(${tCycle.toFixed(1)}/${halfLife}) = ${N_rem.toFixed(1)} nuclei  |  A = λN = ${activity.toFixed(1)} Bq`,
        readouts: [
          { symbol: 'N(t)', label: { en: 'Undecayed Nuclei', hi: 'शेष नाभिक N(t)' }, value: N_rem.toFixed(1), unit: '', accent: 'force' },
          { symbol: 'A', label: { en: 'Decay Activity (λN)', hi: 'सक्रियता (λN)' }, value: activity.toFixed(1), unit: 'Bq', accent: 'velocity' },
          { symbol: 'T½', label: { en: 'Half-Life', hi: 'अर्ध-आयु (T½)' }, value: halfLife.toFixed(1), unit: 's', accent: 'energy' },
          { symbol: 't/T½', label: { en: 'Half-Lives Elapsed', hi: 'बीती अर्ध-आयु' }, value: (tCycle / halfLife).toFixed(2), unit: '', accent: 'momentum' },
        ],
        graphPoints,
        graphCurrentPoint: { x: tCycle, y: N_rem },
        graphLegend: { primary: 'Exponential Decay N(t) = N₀ · e^(−λt)' },
      };
    },
  };
}
