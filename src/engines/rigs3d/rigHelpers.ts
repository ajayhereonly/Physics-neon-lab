import * as THREE from 'three';
import { LiveSimTelemetry, ThemeMode } from '../../types/physics';

export interface SceneRig {
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

export interface Palette3D {
  isDark: boolean;
  bg: number;
  primaryHex: number;
  secondaryHex: number;
  midHex: number;
  gridMain: number;
  gridSub: number;
  solidMat: () => THREE.MeshStandardMaterial;
  contrastMat: () => THREE.MeshStandardMaterial;
  matteMidMat: () => THREE.MeshStandardMaterial;
  glassMat: (opacity?: number) => THREE.MeshPhysicalMaterial;
  translucentMat: (opacity?: number) => THREE.MeshStandardMaterial;
  edgeMat: () => THREE.LineBasicMaterial;
  mutedLineMat: () => THREE.LineBasicMaterial;
  dashedLineMat: () => THREE.LineDashedMaterial;
}

export function makePalette3D(theme: ThemeMode): Palette3D {
  const isDark = theme === 'dark';
  return {
    isDark,
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
    matteMidMat: () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? 0x737373 : 0x8a8a8a,
        roughness: 0.55,
        metalness: 0.1,
      }),
    glassMat: (opacity = 0.34) =>
      new THREE.MeshPhysicalMaterial({
        color: isDark ? 0xe5e5e5 : 0xd4d4d4,
        roughness: 0.08,
        metalness: 0.05,
        transparent: true,
        opacity,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    translucentMat: (opacity = 0.28) =>
      new THREE.MeshStandardMaterial({
        color: isDark ? 0xd4d4d4 : 0x262626,
        roughness: 0.35,
        metalness: 0.08,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    edgeMat: () =>
      new THREE.LineBasicMaterial({
        color: isDark ? 0xffffff : 0x000000,
      }),
    mutedLineMat: () =>
      new THREE.LineBasicMaterial({
        color: 0x737373,
      }),
    dashedLineMat: () =>
      new THREE.LineDashedMaterial({
        color: isDark ? 0xd4d4d4 : 0x262626,
        dashSize: 0.25,
        gapSize: 0.16,
      }),
  };
}

export function addCrispEdges(mesh: THREE.Mesh, edgeMat: THREE.LineBasicMaterial, threshold = 20) {
  const edges = new THREE.EdgesGeometry(mesh.geometry, threshold);
  const segs = new THREE.LineSegments(edges, edgeMat);
  mesh.add(segs);
}

/**
 * Generates an authentic sculpted 3D biconvex or biconcave optical lens
 * oriented with its optical axis along the X axis (faces facing -X and +X).
 */
export function createOpticalLensGeometry(
  radius: number,
  maxHalfThick: number,
  type: 'convex' | 'concave',
  radialSegments = 32
): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = [];
  const steps = 14;
  if (type === 'convex') {
    // Bulges thickest at r = 0, tapers smoothly to thin rim at r = radius
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const r = u * radius;
      const halfT = maxHalfThick * (1 - u * u * 0.86);
      pts.push(new THREE.Vector2(r, halfT));
    }
    for (let i = steps; i >= 0; i--) {
      const u = i / steps;
      const r = u * radius;
      const halfT = maxHalfThick * (1 - u * u * 0.86);
      pts.push(new THREE.Vector2(r, -halfT));
    }
  } else {
    // Biconcave: thinnest at center r = 0, flares cleanly to thick rim at r = radius
    const centerHalf = maxHalfThick * 0.22;
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const r = u * radius;
      const halfT = centerHalf + (maxHalfThick - centerHalf) * (u * u);
      pts.push(new THREE.Vector2(r, halfT));
    }
    for (let i = steps; i >= 0; i--) {
      const u = i / steps;
      const r = u * radius;
      const halfT = centerHalf + (maxHalfThick - centerHalf) * (u * u);
      pts.push(new THREE.Vector2(r, -halfT));
    }
  }
  const geo = new THREE.LatheGeometry(pts, radialSegments);
  // Rotate so optical axis (Lathe Y) aligns with world X axis
  geo.rotateZ(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Helper to update a reusable THREE.Line geometry with a list of 3D coordinates.
 */
export function setLinePoints(
  line: THREE.Line,
  coords: [number, number, number][],
  computeDash = false
) {
  const posAttr = line.geometry.attributes.position as THREE.BufferAttribute;
  const arr = posAttr.array as Float32Array;
  const count = Math.min(coords.length, posAttr.count);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = coords[i][0];
    arr[i * 3 + 1] = coords[i][1];
    arr[i * 3 + 2] = coords[i][2];
  }
  // Repeat last point if buffer has extra slots
  if (count > 0 && count < posAttr.count) {
    const last = coords[count - 1];
    for (let i = count; i < posAttr.count; i++) {
      arr[i * 3] = last[0];
      arr[i * 3 + 1] = last[1];
      arr[i * 3 + 2] = last[2];
    }
  }
  posAttr.needsUpdate = true;
  if (computeDash) {
    line.computeLineDistances();
  }
}

export function createReusableLine(
  maxPts: number,
  mat: THREE.LineBasicMaterial | THREE.LineDashedMaterial
): THREE.Line {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(maxPts * 3), 3));
  return new THREE.Line(geo, mat);
}
