import * as THREE from 'three';
import { ThemeMode } from '../../types/physics';
import {
  addCrispEdges,
  createOpticalLensGeometry,
  createReusableLine,
  makePalette3D,
  SceneRig,
  setLinePoints,
} from './rigHelpers';

// ============================================================================
// 1. 3D HUMAN EYE & DEFECTS OF VISION (MYOPIA / HYPERMETROPIA + SPECTACLE LENS)
// ============================================================================
export function buildEyeDefectsRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Principal optical axis dashed line
  const axisLine = createReusableLine(2, pal.dashedLineMat());
  setLinePoints(
    axisLine,
    [
      [-6.2, 0, 0],
      [4.2, 0, 0],
    ],
    true
  );
  group.add(axisLine);

  // ---- COMPOSITE 3D CUTAWAY HUMAN EYEBALL (centered at x = +0.5) ----
  const eyeCenterX = 0.5;
  const eyeR = 1.95;
  const eyeGroup = new THREE.Group();
  eyeGroup.position.set(eyeCenterX, 0, 0);

  // Outer Sclera cutaway shell (leaves front-facing +Z quadrant open to inspect internal rays)
  const scleraShell = new THREE.Mesh(
    new THREE.SphereGeometry(eyeR, 36, 26, Math.PI * 0.35, Math.PI * 1.42, 0.08, Math.PI - 0.16),
    pal.contrastMat()
  );
  scleraShell.material.side = THREE.DoubleSide;
  eyeGroup.add(scleraShell);

  // Subtle translucent meridian dome covering cutaway for clean 3D spherical volume read
  const scleraGlass = new THREE.Mesh(
    new THREE.SphereGeometry(eyeR * 1.005, 24, 18),
    pal.glassMat(0.12)
  );
  eyeGroup.add(scleraGlass);

  // Equatorial + Sagittal anatomical outline rings
  const sagRing = new THREE.Mesh(new THREE.TorusGeometry(eyeR, 0.032, 10, 64), pal.solidMat());
  const eqRing = new THREE.Mesh(new THREE.TorusGeometry(eyeR, 0.022, 8, 64), pal.matteMidMat());
  eqRing.rotation.x = Math.PI / 2;
  eyeGroup.add(sagRing, eqRing);

  // Protruding Cornea Dome on front (-X side of eyeball)
  const cornea = new THREE.Mesh(
    new THREE.SphereGeometry(1.06, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.46),
    pal.glassMat(0.32)
  );
  cornea.rotation.z = Math.PI / 2;
  cornea.position.set(-eyeR + 0.54, 0, 0);
  const limbusRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.96, 0.038, 10, 48),
    pal.solidMat()
  );
  limbusRing.rotation.y = Math.PI / 2;
  limbusRing.position.set(-eyeR + 0.25, 0, 0);
  eyeGroup.add(cornea, limbusRing);

  // Iris Aperture Ring + Pupil opening
  const irisMesh = new THREE.Mesh(
    new THREE.RingGeometry(0.46, 0.92, 36),
    pal.matteMidMat()
  );
  irisMesh.material.side = THREE.DoubleSide;
  irisMesh.rotation.y = Math.PI / 2;
  irisMesh.position.set(-eyeR + 0.45, 0, 0);
  const pupilRing = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.032, 8, 36), pal.solidMat());
  pupilRing.rotation.y = Math.PI / 2;
  pupilRing.position.set(-eyeR + 0.45, 0, 0);
  eyeGroup.add(irisMesh, pupilRing);

  // Deformable Crystalline Eye Lens + Ciliary Suspensory Ligaments
  const eyeLensGeo = createOpticalLensGeometry(0.68, 0.28, 'convex', 32);
  const eyeLens = new THREE.Mesh(eyeLensGeo, pal.glassMat(0.48));
  eyeLens.position.set(-eyeR + 0.72, 0, 0);
  const eyeLensRim = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.028, 10, 40), pal.solidMat());
  eyeLensRim.rotation.y = Math.PI / 2;
  eyeLensRim.position.copy(eyeLens.position);
  eyeGroup.add(eyeLens, eyeLensRim);

  // 8 Ciliary Fibers anchoring eye lens to sclera wall
  const ciliaryMat = pal.mutedLineMat();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const fib = createReusableLine(2, ciliaryMat);
    setLinePoints(fib, [
      [-eyeR + 0.72, Math.cos(a) * 0.68, Math.sin(a) * 0.68],
      [-eyeR + 0.72, Math.cos(a) * 1.48, Math.sin(a) * 1.48],
    ]);
    eyeGroup.add(fib);
  }

  // Concave Retina Screen + Fovea Target Bullseye at rear (+X)
  const retinaCap = new THREE.Mesh(
    new THREE.SphereGeometry(eyeR - 0.06, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.34),
    pal.translucentMat(0.24)
  );
  retinaCap.rotation.z = -Math.PI / 2;
  const foveaOuter = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.032, 10, 32), pal.solidMat());
  foveaOuter.rotation.y = Math.PI / 2;
  foveaOuter.position.set(eyeR - 0.08, 0, 0);
  const foveaDot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), pal.solidMat());
  foveaDot.position.set(eyeR - 0.06, 0, 0);
  eyeGroup.add(retinaCap, foveaOuter, foveaDot);

  // Optic Nerve Stalk exiting posterior pole slightly inferiorly
  const opticNerve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.32, 1.35, 16),
    pal.contrastMat()
  );
  opticNerve.rotation.z = -Math.PI / 2 - 0.16;
  opticNerve.position.set(eyeR + 0.52, -0.26, 0);
  addCrispEdges(opticNerve, pal.edgeMat());
  eyeGroup.add(opticNerve);

  group.add(eyeGroup);

  // ---- TOGGLEABLE 3D CORRECTIVE SPECTACLE LENS ASSEMBLY (x = -2.85) ----
  const specX = -2.85;
  const spectacleGroup = new THREE.Group();
  spectacleGroup.position.set(specX, 0, 0);

  const specFrame = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.055, 12, 48), pal.solidMat());
  specFrame.rotation.y = Math.PI / 2;
  const specHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.75, 10), pal.solidMat());
  specHandle.position.set(0, -1.48, 0);
  const specMount = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.48), pal.contrastMat());
  specMount.position.set(0, -1.85, 0);
  addCrispEdges(specMount, pal.edgeMat());

  const concaveLens = new THREE.Mesh(
    createOpticalLensGeometry(1.08, 0.28, 'concave', 32),
    pal.glassMat(0.42)
  );
  const convexLens = new THREE.Mesh(
    createOpticalLensGeometry(1.08, 0.32, 'convex', 32),
    pal.glassMat(0.42)
  );
  spectacleGroup.add(specFrame, specHandle, specMount, concaveLens, convexLens);
  group.add(spectacleGroup);

  // Near-point glowing object beacon (visible in Hypermetropia mode)
  const nearObjGroup = new THREE.Group();
  const nearPin = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 14), pal.solidMat());
  const nearHalo = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.025, 8, 24), pal.solidMat());
  nearHalo.rotation.y = Math.PI / 2;
  nearObjGroup.add(nearPin, nearHalo);
  nearObjGroup.position.set(-5.35, 0, 0);
  group.add(nearObjGroup);

  // ---- 6 CONICAL 3D LIGHT RAYS + PHOTON PULSE BEADS + FOCUS MARKER ----
  const RAY_ANGLES = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];
  const rayLines: THREE.Line[] = [];
  const extLines: THREE.Line[] = [];
  const pulseSpheres: THREE.Mesh[] = [];
  const pulseGeo = new THREE.SphereGeometry(0.075, 10, 10);
  const pulseMat = pal.solidMat();

  for (let i = 0; i < RAY_ANGLES.length; i++) {
    const rl = createReusableLine(4, new THREE.LineBasicMaterial({ color: pal.primaryHex }));
    const el = createReusableLine(2, pal.dashedLineMat());
    const ps = new THREE.Mesh(pulseGeo, pulseMat);
    group.add(rl, el, ps);
    rayLines.push(rl);
    extLines.push(el);
    pulseSpheres.push(ps);
  }

  // Focal Point Indicator (solid core + double target rings)
  const focusGroup = new THREE.Group();
  const focusCore = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), pal.solidMat());
  const focusRingA = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.026, 8, 28), pal.solidMat());
  const focusRingB = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.026, 8, 28), pal.solidMat());
  focusRingB.rotation.y = Math.PI / 2;
  focusGroup.add(focusCore, focusRingA, focusRingB);
  group.add(focusGroup);

  // Blur circle disc projected onto retina when uncorrected
  const blurRing = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.03, 10, 32), pal.matteMidMat());
  blurRing.rotation.y = Math.PI / 2;
  blurRing.position.set(eyeCenterX + eyeR - 0.1, 0, 0);
  group.add(blurRing);

  let specSlideY = 0;

  return {
    group,
    defaultCamPos: [-1.4, 2.9, 8.2],
    defaultTarget: [-0.3, 0, 0],
    update: (dt, t, params) => {
      const isMyopia = (params.defect ?? 0) < 0.5;
      const farPt = params.farPt ?? 100;
      const nearPt = params.nearPt ?? 50;
      const corrected = (params.corrected ?? 1) >= 0.5;

      // Exact textbook power equations
      const fCm = isMyopia ? -farPt : (25 * nearPt) / Math.max(1, nearPt - 25);
      const powerD = 100 / fCm;

      // Smoothly slide spectacle lens in/out vertically
      const targetSpecY = corrected ? 0 : 2.9;
      specSlideY += (targetSpecY - specSlideY) * Math.min(1, (dt || 0.04) * 9);
      spectacleGroup.position.y = specSlideY;
      spectacleGroup.visible = specSlideY < 2.75;
      concaveLens.visible = isMyopia;
      convexLens.visible = !isMyopia;

      // Subtle accommodation curvature change on crystalline lens
      eyeLens.scale.set(isMyopia ? 1.15 : 0.88, 1, 1);

      nearObjGroup.visible = !isMyopia;
      nearHalo.rotation.x = t * 2.1;

      const lensX = eyeCenterX - eyeR + 0.72; // x = -0.73
      const retinaX = eyeCenterX + eyeR - 0.08; // x = +2.37

      // Compute exact 3D focus point along X
      let focusX = retinaX;
      if (!corrected) {
        if (isMyopia) {
          // Stronger myopia (smaller farPt) focuses further in front of retina
          const severity = Math.min(1, Math.max(0.25, (420 - farPt) / 395));
          focusX = retinaX - 0.45 - severity * 0.95;
        } else {
          // Stronger hypermetropia (larger nearPt) focuses further behind retina
          const severity = Math.min(1, Math.max(0.25, (nearPt - 25) / 175));
          focusX = retinaX + 0.55 + severity * 1.15;
        }
      }

      focusGroup.position.set(focusX, 0, 0);
      focusRingA.rotation.x = t * 2.2;
      focusRingB.rotation.z = t * 1.8;

      // Blur ring on retina when out of focus
      blurRing.visible = !corrected;
      if (!corrected) {
        const blurScale = Math.max(0.4, Math.abs(focusX - retinaX) * 0.55);
        blurRing.scale.setScalar(blurScale);
      }

      // Update all 6 conical 3D rays & travelling photon beads
      const rayOriginX = -5.35;
      const lensHitR = 0.56;
      const pulsePhase = (t * 0.75) % 1;

      for (let i = 0; i < RAY_ANGLES.length; i++) {
        const a = RAY_ANGLES[i];
        const cy = Math.cos(a);
        const cz = Math.sin(a);

        // Start point (parallel beam for Myopia, point source for Hypermetropia)
        const rStart = isMyopia ? 0.56 : 0.02;
        const rAtSpec = isMyopia
          ? 0.56
          : (0.48 * (specX - rayOriginX)) / (lensX - rayOriginX);
        const rAtEyeLens = corrected
          ? isMyopia
            ? 0.68 // diverged by concave spectacle lens before hitting eye lens
            : 0.52 // pre-converged by convex spectacle lens
          : lensHitR;

        // Where the ray strikes the retina wall (x = retinaX)
        const slopeToFocus = -rAtEyeLens / (focusX - lensX);
        const rAtRetina = rAtEyeLens + slopeToFocus * (retinaX - lensX);

        const p0: [number, number, number] = [rayOriginX, cy * rStart, cz * rStart];
        const p1: [number, number, number] = [specX, cy * rAtSpec, cz * rAtSpec];
        const p2: [number, number, number] = [lensX, cy * rAtEyeLens, cz * rAtEyeLens];
        const p3: [number, number, number] = [retinaX, cy * rAtRetina, cz * rAtRetina];

        setLinePoints(rayLines[i], [p0, p1, p2, p3]);

        // Show dashed virtual extension behind retina for uncorrected Hypermetropia
        if (!corrected && !isMyopia) {
          extLines[i].visible = true;
          setLinePoints(extLines[i], [p3, [focusX, 0, 0]], true);
        } else {
          extLines[i].visible = false;
        }

        // Interpolate travelling photon bead along the 3 segments
        const segPhase = (pulsePhase + i * 0.05) % 1;
        const segIdx = segPhase < 0.33 ? 0 : segPhase < 0.66 ? 1 : 2;
        const localU = (segPhase - segIdx * 0.333) / 0.333;
        const pts = [p0, p1, p2, p3];
        const aPt = pts[segIdx];
        const bPt = pts[segIdx + 1];
        pulseSpheres[i].position.set(
          aPt[0] + (bPt[0] - aPt[0]) * localU,
          aPt[1] + (bPt[1] - aPt[1]) * localU,
          aPt[2] + (bPt[2] - aPt[2]) * localU
        );
      }

      const graphPoints: { x: number; y: number }[] = [];
      for (let d = 35; d <= 200; d += 10) {
        const pVal = isMyopia ? 100 / d : Math.abs(4 - 100 / d);
        graphPoints.push({ x: d, y: pVal });
      }

      return {
        substitutedFormula: isMyopia
          ? `Myopia: f = −${farPt} cm  ⇒  P = −100/${farPt} = ${powerD.toFixed(2)} D (Concave Lens)`
          : `Hypermetropia: 1/f = 1/25 − 1/${nearPt}  ⇒  P = +${powerD.toFixed(2)} D (Convex Lens)`,
        readouts: [
          { symbol: 'P', label: { en: 'Lens Power', hi: 'लेंस क्षमता (P)' }, value: `${powerD >= 0 ? '+' : ''}${powerD.toFixed(2)}`, unit: 'D', accent: 'force' },
          { symbol: 'f', label: { en: 'Focal Length', hi: 'फ़ोकस दूरी (f)' }, value: fCm.toFixed(1), unit: 'cm', accent: 'velocity' },
          { symbol: 'Lens', label: { en: 'Corrective Type', hi: 'संशोधक लेंस' }, value: isMyopia ? 'CONCAVE' : 'CONVEX', unit: '', accent: 'momentum' },
          { symbol: 'Focus', label: { en: 'Retina Status', hi: 'रेटिना स्थिति' }, value: corrected ? 'ON RETINA' : isMyopia ? 'BEFORE' : 'BEHIND', unit: '', accent: 'energy' },
        ],
        graphPoints,
        graphCurrentPoint: { x: Math.min(200, isMyopia ? farPt : nearPt), y: Math.abs(powerD) },
        graphLegend: { primary: '|Power| (D) vs Defect Point (cm)' },
      };
    },
  };
}

// ============================================================================
// 2. 3D THIN LENS OPTICAL BENCH (CONVEX / CONCAVE + REAL/VIRTUAL IMAGE)
// ============================================================================
export function buildThinLensRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Optical bench rail + principal axis
  const rail = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.24, 0.72), pal.contrastMat());
  rail.position.y = -2.1;
  addCrispEdges(rail, pal.edgeMat());
  group.add(rail);

  const axisLine = createReusableLine(2, pal.dashedLineMat());
  setLinePoints(axisLine, [[-5.7, 0, 0], [5.7, 0, 0]], true);
  group.add(axisLine);

  // Lens Stand + Dual Lens Meshes (Convex / Concave)
  const standPost = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.85, 12), pal.solidMat());
  standPost.position.y = -1.55;
  const lensRim = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.05, 10, 48), pal.solidMat());
  lensRim.rotation.y = Math.PI / 2;
  const convexLens = new THREE.Mesh(
    createOpticalLensGeometry(1.42, 0.36, 'convex', 32),
    pal.glassMat(0.42)
  );
  const concaveLens = new THREE.Mesh(
    createOpticalLensGeometry(1.42, 0.34, 'concave', 32),
    pal.glassMat(0.42)
  );
  group.add(standPost, lensRim, convexLens, concaveLens);

  // Focal markers F1, F2, 2F1, 2F2
  const fMarkGeo = new THREE.TorusGeometry(0.14, 0.03, 8, 20);
  const f1 = new THREE.Mesh(fMarkGeo, pal.solidMat());
  const f2 = new THREE.Mesh(fMarkGeo, pal.solidMat());
  const twoF1 = new THREE.Mesh(fMarkGeo, pal.matteMidMat());
  const twoF2 = new THREE.Mesh(fMarkGeo, pal.matteMidMat());
  [f1, f2, twoF1, twoF2].forEach((m) => {
    m.rotation.y = Math.PI / 2;
    group.add(m);
  });

  // Object Arrow Assembly (slides along -X)
  const objGroup = new THREE.Group();
  const objBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.18, 0.56), pal.solidMat());
  objBase.position.y = -1.92;
  const objShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 12), pal.solidMat());
  const objHead = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.32, 14), pal.solidMat());
  objGroup.add(objBase, objShaft, objHead);
  group.add(objGroup);

  // Image Arrow Assembly + Translucent Screen
  const imgGroup = new THREE.Group();
  const imgShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.0, 12), pal.contrastMat());
  const imgHead = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.3, 14), pal.contrastMat());
  addCrispEdges(imgShaft, pal.edgeMat());
  addCrispEdges(imgHead, pal.edgeMat());
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.5, 1.8), pal.glassMat(0.18));
  addCrispEdges(screen, pal.edgeMat());
  imgGroup.add(imgShaft, imgHead, screen);
  group.add(imgGroup);

  // 3 Principal Rays (solid) + 2 Virtual Back-Extension Rays (dashed)
  const ray1 = createReusableLine(3, new THREE.LineBasicMaterial({ color: pal.primaryHex }));
  const ray2 = createReusableLine(3, new THREE.LineBasicMaterial({ color: pal.primaryHex }));
  const ray3 = createReusableLine(3, new THREE.LineBasicMaterial({ color: pal.midHex }));
  const vExt1 = createReusableLine(2, pal.dashedLineMat());
  const vExt2 = createReusableLine(2, pal.dashedLineMat());
  group.add(ray1, ray2, ray3, vExt1, vExt2);

  return {
    group,
    defaultCamPos: [0.6, 3.1, 8.8],
    defaultTarget: [0, -0.2, 0],
    update: (_dt, t, params) => {
      let f = params.f ?? 15;
      if (Math.abs(f) < 2) f = f >= 0 ? 2 : -2;
      const uAbs = params.uAbs ?? 30;
      const ho = params.ho ?? 6;
      const u = -uAbs;
      const invV = 1 / f + 1 / u;
      const v = Math.abs(invV) < 1e-4 ? 999 : 1 / invV;
      const m = v / u;
      const hi = m * ho;
      const power = 100 / f;

      const scaleX = 0.085; // 1 cm -> 0.085 world units
      const scaleY = 0.16;

      const isConvex = f > 0;
      convexLens.visible = isConvex;
      concaveLens.visible = !isConvex;

      const fVis = Math.min(4.8, Math.abs(f) * scaleX);
      f1.position.set(-fVis, 0, 0);
      f2.position.set(fVis, 0, 0);
      twoF1.position.set(-Math.min(5.4, fVis * 2), 0, 0);
      twoF2.position.set(Math.min(5.4, fVis * 2), 0, 0);

      const ox = Math.max(-5.2, u * scaleX);
      const oy = Math.min(1.35, Math.max(0.35, ho * scaleY));
      objGroup.position.x = ox;
      objShaft.scale.set(1, oy, 1);
      objShaft.position.y = oy * 0.5;
      objHead.position.y = oy + 0.14;

      const vClamped = Math.max(-5.2, Math.min(5.2, v * scaleX));
      const iyRaw = hi * scaleY;
      const iy = Math.max(-1.65, Math.min(1.65, iyRaw));
      const isReal = v > 0 && Math.abs(v) < 500;

      imgGroup.visible = Math.abs(v) < 500;
      imgGroup.position.x = vClamped;
      const absIy = Math.max(0.18, Math.abs(iy));
      imgShaft.scale.set(1, absIy, 1);
      imgShaft.position.y = iy >= 0 ? absIy * 0.5 : -absIy * 0.5;
      imgHead.position.y = iy >= 0 ? absIy + 0.12 : -(absIy + 0.12);
      imgHead.rotation.z = iy >= 0 ? 0 : Math.PI;
      screen.visible = isReal;
      screen.rotation.y = Math.sin(t * 0.6) * 0.02;

      // Principal Ray 1: Parallel to axis -> refracts through F (or appears from F)
      const fSignedVis = f * scaleX;
      const endX = isReal ? vClamped : 5.1;
      const endY1 = isReal ? iy : oy - (oy / fSignedVis) * endX;
      setLinePoints(ray1, [
        [ox, oy, 0],
        [0, oy, 0],
        [endX, Math.max(-2.2, Math.min(2.2, endY1)), 0],
      ]);

      // Principal Ray 2: Straight through optical center (0, 0, 0)
      const endY2 = isReal ? iy : (oy / ox) * endX;
      setLinePoints(ray2, [
        [ox, oy, 0],
        [0, 0, 0],
        [endX, Math.max(-2.2, Math.min(2.2, endY2)), 0],
      ]);

      // 3D off-axis ray (Z = +0.45) to show full 3D conical refraction
      setLinePoints(ray3, [
        [ox, oy, 0],
        [0, oy * 0.72, 0.45],
        [isReal ? vClamped : 5.1, isReal ? iy : Math.max(-2.2, Math.min(2.2, endY1 * 0.85)), isReal ? 0 : 0.75],
      ]);

      // Virtual dashed back-extensions when image is virtual (v < 0)
      if (!isReal && Math.abs(v) < 500) {
        vExt1.visible = true;
        vExt2.visible = true;
        setLinePoints(vExt1, [[0, oy, 0], [vClamped, iy, 0]], true);
        setLinePoints(vExt2, [[0, 0, 0], [vClamped, iy, 0]], true);
      } else {
        vExt1.visible = false;
        vExt2.visible = false;
      }

      const graphPoints: { x: number; y: number }[] = [];
      for (let uv = 6; uv <= 55; uv += 2) {
        const iv = 1 / f - 1 / uv;
        if (Math.abs(iv) > 0.015) {
          const vv = 1 / iv;
          if (Math.abs(vv) < 120) graphPoints.push({ x: uv, y: vv });
        }
      }

      return {
        substitutedFormula: `1/v = 1/(${f}) + 1/(−${uAbs})  ⇒  v = ${Math.abs(v) > 500 ? '∞' : v.toFixed(1) + ' cm'}  |  m = ${m.toFixed(2)}`,
        readouts: [
          { symbol: 'v', label: { en: 'Image Distance', hi: 'प्रतिबिंब दूरी (v)' }, value: Math.abs(v) > 500 ? '∞' : v.toFixed(1), unit: 'cm', accent: 'velocity' },
          { symbol: 'm', label: { en: 'Magnification', hi: 'आवर्धन (m)' }, value: Math.abs(v) > 500 ? '∞' : m.toFixed(2), unit: '×', accent: 'force' },
          { symbol: 'P', label: { en: 'Lens Power', hi: 'लेंस क्षमता' }, value: `${power >= 0 ? '+' : ''}${power.toFixed(2)}`, unit: 'D', accent: 'energy' },
          { symbol: 'Type', label: { en: 'Image Nature', hi: 'प्रतिबिंब प्रकृति' }, value: isReal ? 'REAL INV' : 'VIRTUAL', unit: '', accent: 'momentum' },
        ],
        graphPoints,
        graphCurrentPoint: Math.abs(v) < 120 ? { x: uAbs, y: v } : undefined,
        graphLegend: { primary: 'Image Distance v(u)' },
      };
    },
  };
}

// ============================================================================
// 3. 3D SNELL'S LAW, GLASS PRISM & TOTAL INTERNAL REFLECTION (TIR)
// ============================================================================
export function buildSnellPrismTirRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Turntable Protractor Pedestal
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.4, 0.24, 48), pal.contrastMat());
  pedestal.position.y = -1.65;
  addCrispEdges(pedestal, pal.edgeMat());
  const protractorRing = new THREE.Mesh(new THREE.TorusGeometry(3.05, 0.03, 8, 64), pal.solidMat());
  protractorRing.rotation.x = Math.PI / 2;
  protractorRing.position.y = -1.5;
  group.add(pedestal, protractorRing);

  // Lower Medium (n1) Transparent Glass Block + Upper Air/Medium (n2) Boundary
  const lowerBlock = new THREE.Mesh(new THREE.BoxGeometry(6.2, 2.2, 3.2), pal.glassMat(0.32));
  lowerBlock.position.set(0, -0.42, 0);
  addCrispEdges(lowerBlock, pal.edgeMat());
  group.add(lowerBlock);

  // Decorative 3D Equilateral Triangular Optical Prism perched beside interface to emphasize dispersion/prism geometry
  const triShape = new THREE.Shape();
  triShape.moveTo(0, 1.35);
  triShape.lineTo(-1.18, -0.68);
  triShape.lineTo(1.18, -0.68);
  triShape.closePath();
  const prismGeo = new THREE.ExtrudeGeometry(triShape, {
    depth: 1.4,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 2,
  });
  prismGeo.center();
  const prismMesh = new THREE.Mesh(prismGeo, pal.glassMat(0.28));
  prismMesh.position.set(0, 0.72, -1.9);
  addCrispEdges(prismMesh, pal.edgeMat());
  group.add(prismMesh);

  // Interface Boundary Plane Ring & Vertical Normal Line at (0, +0.68, 0)
  const hitY = 0.68;
  const normalLine = createReusableLine(2, pal.dashedLineMat());
  setLinePoints(normalLine, [[0, hitY - 2.1, 0], [0, hitY + 2.3, 0]], true);
  group.add(normalLine);

  const hitSphere = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), pal.solidMat());
  hitSphere.position.set(0, hitY, 0);
  group.add(hitSphere);

  // Pivoting 3D Laser Emitter Assembly in Medium 1 (below interface)
  const laserGroup = new THREE.Group();
  const laserTube = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.95, 16), pal.solidMat());
  laserTube.rotation.z = Math.PI / 2;
  const laserTip = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.22, 12), pal.contrastMat());
  laserTip.rotation.z = Math.PI / 2;
  laserTip.position.x = 0.56;
  addCrispEdges(laserTube, pal.edgeMat());
  laserGroup.add(laserTube, laserTip);
  group.add(laserGroup);

  // Rays (Incident, Refracted/Emergent, Reflected/TIR)
  const incRay = createReusableLine(2, new THREE.LineBasicMaterial({ color: pal.primaryHex }));
  const refRay = createReusableLine(2, new THREE.LineBasicMaterial({ color: pal.primaryHex }));
  const reflRay = createReusableLine(2, pal.dashedLineMat());
  const tirGlow = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.035, 8, 32), pal.solidMat());
  tirGlow.rotation.x = Math.PI / 2;
  tirGlow.position.set(0, hitY + 0.02, 0);
  group.add(incRay, refRay, reflRay, tirGlow);

  // Animated photon pulse along incident & outgoing ray
  const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), pal.solidMat());
  group.add(pulse);

  return {
    group,
    defaultCamPos: [3.2, 3.6, 8.2],
    defaultTarget: [0, 0.3, 0],
    update: (_dt, t, params) => {
      const n1 = params.n1 ?? 1.5;
      const n2 = params.n2 ?? 1.0;
      const iDeg = params.iDeg ?? 35;
      const iRad = (iDeg * Math.PI) / 180;

      const sinR = (n1 / n2) * Math.sin(iRad);
      const isTir = sinR >= 1.0;
      const rRad = isTir ? iRad : Math.asin(Math.min(1, Math.max(-1, sinR)));
      const rDeg = (rRad * 180) / Math.PI;
      const critDeg = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : 90;

      // Incident beam travels upward-right from inside medium 1 toward (0, hitY, 0)
      const len = 2.65;
      const sx = -Math.sin(iRad) * len;
      const sy = hitY - Math.cos(iRad) * len;

      laserGroup.position.set(sx, sy, 0);
      laserGroup.rotation.z = Math.atan2(hitY - sy, -sx);

      setLinePoints(incRay, [
        [sx, sy, 0],
        [0, hitY, 0],
      ]);

      let ox = 0;
      let oy = hitY;
      if (isTir) {
        // Total Internal Reflection back downward-right into medium 1!
        ox = Math.sin(iRad) * len;
        oy = hitY - Math.cos(iRad) * len;
        refRay.visible = true;
        setLinePoints(refRay, [
          [0, hitY, 0],
          [ox, oy, 0],
        ]);
        reflRay.visible = false;
        tirGlow.visible = true;
        tirGlow.scale.setScalar(1 + Math.sin(t * 6) * 0.14);
      } else {
        // Refracted beam entering medium 2 upward-right
        ox = Math.sin(rRad) * len;
        oy = hitY + Math.cos(rRad) * len;
        refRay.visible = true;
        setLinePoints(refRay, [
          [0, hitY, 0],
          [ox, oy, 0],
        ]);
        // Faint partial reflection dashed line
        reflRay.visible = true;
        setLinePoints(
          reflRay,
          [
            [0, hitY, 0],
            [Math.sin(iRad) * 1.9, hitY - Math.cos(iRad) * 1.9, 0],
          ],
          true
        );
        tirGlow.visible = false;
      }

      // Travelling light bead
      const phase = (t * 0.9) % 1;
      if (phase < 0.5) {
        const u = phase * 2;
        pulse.position.set(sx * (1 - u), sy + (hitY - sy) * u, 0);
      } else {
        const u = (phase - 0.5) * 2;
        pulse.position.set(ox * u, hitY + (oy - hitY) * u, 0);
      }

      const graphPoints: { x: number; y: number }[] = [];
      for (let ang = 0; ang <= 85; ang += 3) {
        const sr = (n1 / n2) * Math.sin((ang * Math.PI) / 180);
        graphPoints.push({ x: ang, y: sr >= 1 ? 90 : (Math.asin(sr) * 180) / Math.PI });
      }

      return {
        substitutedFormula: isTir
          ? `TOTAL INTERNAL REFLECTION!  i = ${iDeg}° ≥ θ_c (${critDeg.toFixed(1)}°)  ⇒  100% Reflected`
          : `n₁·sin(i) = n₂·sin(r)  ⇒  ${n1.toFixed(2)}·sin(${iDeg}°) = ${n2.toFixed(2)}·sin(${rDeg.toFixed(1)}°)`,
        readouts: [
          { symbol: 'r', label: { en: isTir ? 'Reflected Angle' : 'Refracted Angle', hi: isTir ? 'परावर्तन कोण' : 'अपवर्तन कोण (r)' }, value: isTir ? `${iDeg}° (TIR)` : `${rDeg.toFixed(1)}°`, unit: '', accent: 'force' },
          { symbol: 'θ_c', label: { en: 'Critical Angle', hi: 'क्रांतिक कोण (θ_c)' }, value: n1 > n2 ? `${critDeg.toFixed(1)}°` : 'None', unit: '', accent: 'energy' },
          { symbol: 'n₁/n₂', label: { en: 'Relative Index', hi: 'सापेक्ष अपवर्तनांक' }, value: (n1 / n2).toFixed(2), unit: '', accent: 'velocity' },
          { symbol: 'Mode', label: { en: 'Optical Regime', hi: 'प्रकाशिकी स्थिति' }, value: isTir ? 'TIR LOCK' : 'REFRACT', unit: '', accent: 'momentum' },
        ],
        graphPoints,
        graphCurrentPoint: { x: iDeg, y: isTir ? 90 : rDeg },
        graphLegend: { primary: 'Refracted Angle r(i) — Flat at 90° during TIR' },
      };
    },
  };
}

// ============================================================================
// 4. 3D COMPOUND MICROSCOPE & ASTRONOMICAL TELESCOPE
// ============================================================================
export function buildMicroscopeTelescopeRig(theme: ThemeMode): SceneRig {
  const pal = makePalette3D(theme);
  const group = new THREE.Group();

  // Principal optical axis
  const axisLine = createReusableLine(2, pal.dashedLineMat());
  setLinePoints(axisLine, [[-5.8, 0, 0], [5.8, 0, 0]], true);
  group.add(axisLine);

  // Coaxial Cutaway Optical Tube Barrel (translucent + front/rear flanges)
  const tubeBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(1.18, 1.18, 5.2, 32, 1, true),
    pal.glassMat(0.14)
  );
  tubeBarrel.rotation.z = Math.PI / 2;
  const collarL = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.06, 10, 40), pal.solidMat());
  collarL.rotation.y = Math.PI / 2;
  const collarR = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.06, 10, 40), pal.solidMat());
  collarR.rotation.y = Math.PI / 2;
  const tripodStand = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.24, 1.7, 14), pal.contrastMat());
  tripodStand.position.set(0, -1.9, 0);
  addCrispEdges(tripodStand, pal.edgeMat());
  group.add(tubeBarrel, collarL, collarR, tripodStand);

  // Objective & Eyepiece sculpted 3D Convex Lenses
  const objLens = new THREE.Mesh(
    createOpticalLensGeometry(0.95, 0.26, 'convex', 28),
    pal.glassMat(0.45)
  );
  const eyeLens = new THREE.Mesh(
    createOpticalLensGeometry(0.82, 0.24, 'convex', 28),
    pal.glassMat(0.45)
  );
  group.add(objLens, eyeLens);

  // Object specimen arrow + Intermediate real image marker
  const objArrow = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.65, 12), pal.solidMat());
  const midImgArrow = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.9, 12), pal.contrastMat());
  midImgArrow.rotation.z = Math.PI;
  addCrispEdges(midImgArrow, pal.edgeMat());
  group.add(objArrow, midImgArrow);

  // 4 Conical 3D Rays through Objective -> Intermediate Image -> Eyepiece -> Eye
  const rays: THREE.Line[] = [];
  for (let i = 0; i < 4; i++) {
    const line = createReusableLine(4, new THREE.LineBasicMaterial({ color: pal.primaryHex }));
    group.add(line);
    rays.push(line);
  }

  return {
    group,
    defaultCamPos: [2.2, 3.4, 8.8],
    defaultTarget: [0, 0, 0],
    update: (_dt, t, params) => {
      const isTelescope = (params.mode ?? 0) >= 0.5;
      const fo = params.fo ?? (isTelescope ? 60 : 2);
      const fe = params.fe ?? 5;
      const L = params.L ?? 20;

      const mag = isTelescope ? fo / Math.max(0.5, fe) : (L / Math.max(0.4, fo)) * (25 / Math.max(0.5, fe));
      const tubeLen = isTelescope ? fo + fe : L;

      const halfSpan = Math.min(3.1, Math.max(1.8, (L / 20) * 2.5));
      tubeBarrel.scale.set(1, (halfSpan * 2) / 5.2, 1);
      collarL.position.x = -halfSpan;
      collarR.position.x = halfSpan;
      objLens.position.x = -halfSpan;
      eyeLens.position.x = halfSpan;

      // Telescope has larger objective aperture than microscope
      const objScale = isTelescope ? 1.15 : 0.72;
      objLens.scale.set(1, objScale, objScale);
      eyeLens.scale.set(1, 0.85, 0.85);

      const midX = halfSpan - 0.95;
      const midH = Math.min(0.95, 0.35 + (mag / 150) * 0.55);
      midImgArrow.position.set(midX, -midH * 0.5, 0);
      midImgArrow.scale.set(1, midH / 0.9, 1);

      objArrow.visible = !isTelescope;
      objArrow.position.set(-halfSpan - 1.35, 0.32, 0);

      // 4 conical rays in 3D
      const offsets: [number, number][] = [
        [0.52, 0],
        [-0.52, 0],
        [0, 0.52],
        [0, -0.52],
      ];
      const pulse = Math.sin(t * 2) * 0.02;
      offsets.forEach(([oy, oz], idx) => {
        const startX = isTelescope ? -5.5 : -halfSpan - 1.35;
        const startY = isTelescope ? oy * 1.1 : 0.62;
        const startZ = isTelescope ? oz * 1.1 : 0;
        const pObj: [number, number, number] = [-halfSpan, oy * objScale, oz * objScale];
        const pMid: [number, number, number] = [midX, -midH + pulse, 0];
        const pEye: [number, number, number] = [halfSpan, -oy * 0.55, -oz * 0.55];
        const pOut: [number, number, number] = [halfSpan + 2.1, -oy * 0.35 - 0.35, -oz * 0.35];
        setLinePoints(rays[idx], [[startX, startY, startZ], pObj, pMid, pEye]);
        if (idx === 0) {
          // Keep final segment visible via pOut cleanly
          setLinePoints(rays[idx], [[startX, startY, startZ], pObj, pMid, pOut]);
        }
      });

      const graphPoints: { x: number; y: number }[] = [];
      for (let f = 1; f <= 15; f += 1) {
        const mv = isTelescope ? fo / f : (L / Math.max(0.5, fo)) * (25 / f);
        graphPoints.push({ x: f, y: Math.min(250, mv) });
      }

      return {
        substitutedFormula: isTelescope
          ? `Telescope: M = f_o / f_e = ${fo}/${fe} = ${mag.toFixed(1)}×  |  Tube L = f_o + f_e = ${tubeLen.toFixed(1)} cm`
          : `Microscope: M ≈ (L/f_o)(D/f_e) = (${L}/${fo})(25/${fe}) = ${mag.toFixed(1)}×`,
        readouts: [
          { symbol: 'M', label: { en: 'Angular Magnification', hi: 'कोणीय आवर्धन (M)' }, value: mag.toFixed(1), unit: '×', accent: 'force' },
          { symbol: 'L_tube', label: { en: 'Optical Tube Length', hi: 'नली की लंबाई' }, value: tubeLen.toFixed(1), unit: 'cm', accent: 'velocity' },
          { symbol: 'f_o', label: { en: 'Objective Focal', hi: 'अभिदृश्यक f_o' }, value: fo.toFixed(1), unit: 'cm', accent: 'momentum' },
          { symbol: 'Mode', label: { en: 'Instrument', hi: 'यंत्र प्रकार' }, value: isTelescope ? 'TELESCOPE' : 'MICROSCOPE', unit: '', accent: 'energy' },
        ],
        graphPoints,
        graphCurrentPoint: { x: fe, y: Math.min(250, mag) },
        graphLegend: { primary: 'Magnification M vs Eyepiece f_e' },
      };
    },
  };
}
