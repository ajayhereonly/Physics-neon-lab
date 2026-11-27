import { LiveSimTelemetry } from '../types/physics';
import {
  CanvasPalette,
  drawHatchRect as baseDrawHatchRect,
  drawVectorArrow as baseDrawVectorArrow,
  VectorLineStyle,
} from '../utils/canvasHelpers';
import { formatPhysicsNumber } from '../utils/mathParser';
import type { SimRenderContext } from './builtinEngines';

const EPS0 = 8.854e-12;
const K_COULOMB = 8.988e9;
const MU0 = 4 * Math.PI * 1e-7;
let currentPalette12: CanvasPalette;

function drawHatchRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  palette: CanvasPalette,
  _spacing = 10
) {
  baseDrawHatchRect(ctx, x, y, w, h, 'diagonal', palette);
}

function drawVectorArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  _color: string,
  label?: string,
  style: VectorLineStyle = 'solid'
) {
  baseDrawVectorArrow(ctx, x1, y1, x2, y2, currentPalette12, label, style);
}

export function stepAndRenderRemaining12(
  rc: SimRenderContext,
  palette: CanvasPalette
): LiveSimTelemetry | null {
  currentPalette12 = palette;
  switch (rc.simId) {
    case 'gauss-dipole':
      return renderGaussDipole(rc, palette);
    case 'electric-potential':
      return renderElectricPotential(rc, palette);
    case 'wheatstone-bridge':
      return renderWheatstoneBridge(rc, palette);
    case 'solenoid-wires':
      return renderSolenoidWires(rc, palette);
    case 'transformer':
      return renderTransformer(rc, palette);
    case 'snell-prism-tir':
      return renderSnellPrismTir(rc, palette);
    case 'microscope-telescope':
      return renderMicroscopeTelescope(rc, palette);
    case 'diffraction-polarization':
      return renderDiffractionPolarization(rc, palette);
    case 'de-broglie':
      return renderDeBroglie(rc, palette);
    case 'binding-energy':
      return renderBindingEnergy(rc, palette);
    case 'logic-gates':
      return renderLogicGates(rc, palette);
    default:
      return null;
  }
}

// 12. GAUSS'S LAW & ELECTRIC DIPOLE TORQUE
function renderGaussDipole(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, showVectors } = rc;
  const q = (params.q ?? 8) * 1e-6;
  const R = params.R ?? 1.2;
  const Eext = (params.Eext ?? 8) * 1e3;
  const thetaDeg = params.theta ?? 60;
  const th = (thetaDeg * Math.PI) / 180;

  const flux = q / EPS0;
  const Esurf = (K_COULOMB * q) / (R * R);
  const pDipole = 2e-6; // 2 μC·m reference dipole
  const torque = pDipole * Eext * Math.sin(th);

  // Left: Gaussian Sphere & radial E-lines
  const gCx = width * 0.3;
  const gCy = height * 0.52;
  const gRad = 32 + R * 32;

  const lineCount = Math.max(8, Math.min(20, Math.round((params.q ?? 8) * 1.2)));
  for (let i = 0; i < lineCount; i++) {
    const a = (i / lineCount) * Math.PI * 2;
    const x2 = gCx + (gRad + 34) * Math.cos(a);
    const y2 = gCy + (gRad + 34) * Math.sin(a);
    if (showVectors) {
      drawVectorArrow(ctx, gCx + 16 * Math.cos(a), gCy + 16 * Math.sin(a), x2, y2, p.ink, '', 'solid');
    }
  }

  // Gaussian dashed surface
  ctx.save();
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(gCx, gCy, gRad, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Enclosed charge
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(gCx, gCy, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = p.bg;
  ctx.font = 'bold 11px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`+${params.q ?? 8}`, gCx, gCy + 4);

  // Right: Electric Dipole in Uniform Field E
  const dCx = width * 0.74;
  const dCy = height * 0.52;
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.5;
  for (let row = -2; row <= 2; row++) {
    const ry = dCy + row * 34;
    drawVectorArrow(ctx, dCx - 95, ry, dCx + 95, ry, p.inkMuted, row === -2 ? 'E_ext' : '', 'dashed');
  }

  const halfL = 48;
  const px1 = dCx - halfL * Math.cos(th);
  const py1 = dCy + halfL * Math.sin(th);
  const px2 = dCx + halfL * Math.cos(th);
  const py2 = dCy - halfL * Math.sin(th);

  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(px1, py1);
  ctx.lineTo(px2, py2);
  ctx.stroke();

  // -q and +q ends
  ctx.fillStyle = p.bg;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(px1, py1, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.fillText('−', px1, py1 + 4);

  ctx.beginPath();
  ctx.arc(px2, py2, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = p.bg;
  ctx.fillText('+', px2, py2 + 4);
  ctx.textAlign = 'left';

  if (showVectors) {
    drawVectorArrow(ctx, px2, py2, px2 + 44, py2, p.ink, '+qE', 'double');
    drawVectorArrow(ctx, px1, py1, px1 - 44, py1, p.ink, '−qE', 'double');
  }

  const graphPoints: { x: number; y: number }[] = [];
  for (let rr = 0.5; rr <= 3.0; rr += 0.1) {
    graphPoints.push({ x: Number(rr.toFixed(2)), y: (K_COULOMB * q) / (rr * rr) / 1000 });
  }

  return {
    substitutedFormula: `Φ_E = ${params.q}μC / ε₀ = ${formatPhysicsNumber(flux)} N·m²/C  |  τ = ${(torque * 1000).toFixed(2)} mN·m`,
    readouts: [
      { symbol: 'Φ_E', label: { en: 'Total Flux (Const)', hi: 'कुल विद्युत फ्लक्स' }, value: formatPhysicsNumber(flux), unit: 'N·m²/C' },
      { symbol: 'E_R', label: { en: 'Surface Field E', hi: 'पृष्ठ विद्युत क्षेत्र' }, value: (Esurf / 1000).toFixed(1), unit: 'kN/C' },
      { symbol: 'τ', label: { en: 'Dipole Torque', hi: 'द्विध्रुव बल-आघूर्ण' }, value: (torque * 1000).toFixed(2), unit: 'mN·m' },
      { symbol: 'U', label: { en: 'Dipole Energy', hi: 'द्विध्रुव ऊर्जा' }, value: (-pDipole * Eext * Math.cos(th) * 1000).toFixed(2), unit: 'mJ' },
    ],
    graphPoints,
    graphCurrentPoint: { x: R, y: Esurf / 1000 },
    graphXRange: [0.5, 3.0],
    graphYRange: [0, Math.max(50, (K_COULOMB * q) / 0.25 / 1000)],
  };
}

// 13. ELECTRIC POTENTIAL & EQUIPOTENTIALS
function renderElectricPotential(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, showVectors } = rc;
  const qMicro = params.q ?? 6;
  const q = qMicro * 1e-6;
  const r = params.r ?? 1.5;
  const q0 = (params.q0 ?? 2) * 1e-6;

  const V = (K_COULOMB * q) / r;
  const E = (K_COULOMB * Math.abs(q)) / (r * r);
  const U = q0 * V;

  const cx = width * 0.44;
  const cy = height * 0.52;

  // Equipotential concentric rings spaced as r = kq/V (tighter near charge!)
  ctx.save();
  ctx.setLineDash([6, 6]);
  for (let k = 1; k <= 6; k++) {
    const rad = 26 * Math.pow(k, 1.15);
    ctx.strokeStyle = k % 2 === 0 ? p.ink : p.inkMuted;
    ctx.lineWidth = k % 2 === 0 ? 2 : 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Source charge
  ctx.fillStyle = qMicro >= 0 ? p.ink : p.bg;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = qMicro >= 0 ? p.bg : p.ink;
  ctx.font = 'bold 12px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${qMicro >= 0 ? '+' : ''}${qMicro}`, cx, cy + 4);

  // Test probe at distance r
  const probeX = cx + r * 48;
  const probeY = cy;
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(probeX, probeY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.textAlign = 'left';
  ctx.fillText(`q₀ (r=${r}m)`, probeX - 18, probeY - 14);

  if (showVectors && qMicro !== 0) {
    const dir = qMicro > 0 ? 1 : -1;
    drawVectorArrow(ctx, probeX, probeY, probeX + dir * 56, probeY, p.ink, 'E = −dV/dr', 'double');
  }

  const graphPoints: { x: number; y: number }[] = [];
  for (let rr = 0.4; rr <= 4.0; rr += 0.12) {
    graphPoints.push({ x: Number(rr.toFixed(2)), y: (K_COULOMB * q) / rr / 1000 });
  }

  return {
    substitutedFormula: `V = k·(${qMicro}μC) / ${r}m = ${(V / 1000).toFixed(1)} kV  |  U = ${(U * 1000).toFixed(1)} mJ`,
    readouts: [
      { symbol: 'V', label: { en: 'Electric Potential', hi: 'विद्युत विभव' }, value: (V / 1000).toFixed(1), unit: 'kV' },
      { symbol: 'E', label: { en: 'Electric Field', hi: 'विद्युत क्षेत्र' }, value: (E / 1000).toFixed(1), unit: 'kN/C' },
      { symbol: 'U', label: { en: 'Potential Energy', hi: 'स्थितिज ऊर्जा' }, value: (U * 1000).toFixed(1), unit: 'mJ' },
      { symbol: 'W_eq', label: { en: 'Work Along Ring', hi: 'समविभव पर कार्य' }, value: '0.0', unit: 'J' },
    ],
    graphPoints,
    graphCurrentPoint: { x: r, y: V / 1000 },
    graphXRange: [0.4, 4.0],
    graphYRange: [-250, 250],
  };
}

// 14. WHEATSTONE BRIDGE
function renderWheatstoneBridge(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params } = rc;
  const R1 = params.R1 ?? 20;
  const R2 = params.R2 ?? 40;
  const R3 = params.R3 ?? 30;
  const R4 = params.R4 ?? 60;
  const E = params.E ?? 12;

  const VB = E * (R2 / (R1 + R2));
  const VD = E * (R4 / (R3 + R4));
  const dV = VB - VD;
  const Rg = 25;
  const Ig = (dV / Rg) * 1000; // mA
  const balanced = Math.abs(R1 * R4 - R2 * R3) < 0.1;

  const cx = width * 0.5;
  const cy = height * 0.5;
  const dx = 140;
  const dy = 96;

  const A = { x: cx - dx, y: cy };
  const B = { x: cx, y: cy - dy };
  const C = { x: cx + dx, y: cy };
  const D = { x: cx, y: cy + dy };

  // Diamond arms
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.lineTo(D.x, D.y);
  ctx.closePath();
  ctx.stroke();

  // Central Galvanometer branch B–D
  ctx.beginPath();
  ctx.moveTo(B.x, B.y);
  ctx.lineTo(D.x, D.y);
  ctx.stroke();

  // Resistor boxes on 4 arms
  const drawArmBox = (p1: { x: number; y: number }, p2: { x: number; y: number }, lbl: string) => {
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    ctx.fillStyle = p.bg;
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2.5;
    ctx.fillRect(mx - 36, my - 13, 72, 26);
    ctx.strokeRect(mx - 36, my - 13, 72, 26);
    ctx.fillStyle = p.ink;
    ctx.font = 'bold 12px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(lbl, mx, my + 4);
    ctx.textAlign = 'left';
  };
  drawArmBox(A, B, `R₁=${R1}Ω`);
  drawArmBox(B, C, `R₂=${R2}Ω`);
  drawArmBox(A, D, `R₃=${R3}Ω`);
  drawArmBox(D, C, `R₄=${R4}Ω`);

  // Galvanometer dial at center
  ctx.fillStyle = p.bg;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Deflection needle
  const needleAng = -Math.PI / 2 + Math.max(-1.1, Math.min(1.1, dV * 0.3));
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + 22 * Math.cos(needleAng), cy + 22 * Math.sin(needleAng));
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.font = 'bold 11px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('G', cx, cy + 20);
  ctx.textAlign = 'left';

  // Status banner
  ctx.fillStyle = balanced ? p.ink : p.surface;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.fillRect(18, 18, 228, 32);
  ctx.strokeRect(18, 18, 228, 32);
  ctx.fillStyle = balanced ? p.bg : p.ink;
  ctx.font = 'bold 12px "IBM Plex Mono", monospace';
  ctx.fillText(balanced ? 'BRIDGE BALANCED (I_g = 0)' : `UNBALANCED (ΔV=${dV.toFixed(2)}V)`, 28, 39);

  const graphPoints: { x: number; y: number }[] = [];
  for (let r4 = 5; r4 <= 120; r4 += 5) {
    graphPoints.push({ x: r4, y: E * (R2 / (R1 + R2) - r4 / (R3 + r4)) });
  }

  return {
    substitutedFormula: `R₁/R₂ = ${(R1 / R2).toFixed(2)}  vs  R₃/R₄ = ${(R3 / R4).toFixed(2)}  |  ΔV_BD = ${dV.toFixed(2)} V`,
    readouts: [
      { symbol: 'ΔV', label: { en: 'Bridge Voltage', hi: 'सेतु विभवांतर' }, value: dV.toFixed(2), unit: 'V' },
      { symbol: 'I_g', label: { en: 'Galvanometer I_g', hi: 'गैल्वेनोमीटर धारा' }, value: Ig.toFixed(1), unit: 'mA' },
      { symbol: 'S_bal', label: { en: 'Balance R₄ Value', hi: 'संतुलन हेतु R₄' }, value: ((R2 * R3) / R1).toFixed(1), unit: 'Ω' },
      { symbol: 'State', label: { en: 'Null Condition', hi: 'शून्य विक्षेप' }, value: balanced ? 'NULL' : 'DEFLECT', unit: '' },
    ],
    graphPoints,
    graphCurrentPoint: { x: R4, y: dV },
    graphXRange: [5, 120],
    graphYRange: [-E * 0.6, E * 0.6],
  };
}

// 15. SOLENOID & PARALLEL WIRES
function renderSolenoidWires(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const n = params.n ?? 800;
  const I = params.I ?? 5;
  const dCm = params.d ?? 4;
  const sameDir = (params.sameDir ?? 1) >= 0 ? 1 : -1;

  const B = MU0 * n * I; // Tesla
  const BmT = B * 1000;
  const FperL = (MU0 * I * I) / (2 * Math.PI * (dCm * 0.01));

  if (state.t === undefined) state.t = 0;
  if (isPlaying) state.t += dt;

  // Top Half: Solenoid cross-section & uniform interior B lines
  const sx = width * 0.16;
  const sw = width * 0.68;
  const sy = height * 0.34;
  const sh = 74;

  // Uniform interior B arrows
  for (let row = -1; row <= 1; row++) {
    const ry = sy + row * 20;
    if (showVectors) {
      drawVectorArrow(ctx, sx - 24, ry, sx + sw + 24, ry, p.ink, row === -1 ? `B=${BmT.toFixed(2)}mT` : '', 'solid');
    }
  }

  // Coil turns
  const turns = Math.max(7, Math.min(20, Math.round(n / 100)));
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  for (let i = 0; i < turns; i++) {
    const tx = sx + (i / (turns - 1)) * sw;
    ctx.beginPath();
    ctx.ellipse(tx, sy, 8, sh / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Bottom Half: Two parallel current-carrying wires
  const wy1 = height * 0.72;
  const wy2 = wy1 + 36 + dCm * 2.2;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(sx, wy1);
  ctx.lineTo(sx + sw, wy1);
  ctx.moveTo(sx, wy2);
  ctx.lineTo(sx + sw, wy2);
  ctx.stroke();

  if (showVectors) {
    drawVectorArrow(ctx, sx + 40, wy1 - 12, sx + 120, wy1 - 12, p.ink, `I₁=${I}A`, 'solid');
    drawVectorArrow(
      ctx,
      sameDir > 0 ? sx + 40 : sx + 120,
      wy2 + 14,
      sameDir > 0 ? sx + 120 : sx + 40,
      wy2 + 14,
      p.ink,
      `I₂=${I}A`,
      'solid'
    );
    // Attraction or Repulsion arrows
    const midX = width * 0.56;
    drawVectorArrow(ctx, midX, wy1, midX, wy1 + (sameDir > 0 ? 22 : -22), p.ink, sameDir > 0 ? 'ATTRACT' : 'REPEL', 'double');
    drawVectorArrow(ctx, midX, wy2, midX, wy2 + (sameDir > 0 ? -22 : 22), p.ink, '', 'double');
  }

  const graphPoints: { x: number; y: number }[] = [];
  for (let cur = 0.5; cur <= 15; cur += 0.5) {
    graphPoints.push({ x: cur, y: MU0 * n * cur * 1000 });
  }

  return {
    substitutedFormula: `B = μ₀·${n}·${I} = ${BmT.toFixed(2)} mT  |  F/L = ${formatPhysicsNumber(FperL)} N/m`,
    readouts: [
      { symbol: 'B', label: { en: 'Solenoid Field', hi: 'परिनालिका क्षेत्र' }, value: BmT.toFixed(2), unit: 'mT' },
      { symbol: 'F/L', label: { en: 'Force per Length', hi: 'प्रति लंबाई बल' }, value: (FperL * 1e6).toFixed(1), unit: 'μN/m' },
      { symbol: 'Wire', label: { en: 'Wire Interaction', hi: 'तारों का बल' }, value: sameDir > 0 ? 'ATTRACT' : 'REPEL', unit: '' },
      { symbol: 'n·I', label: { en: 'Ampere-Turns/m', hi: 'एम्पीयर-फेरे/मी' }, value: (n * I).toFixed(0), unit: 'A/m' },
    ],
    graphPoints,
    graphCurrentPoint: { x: I, y: BmT },
    graphXRange: [0.5, 15],
    graphYRange: [0, MU0 * n * 15 * 1000 * 1.1],
  };
}

// 16. TRANSFORMER
function renderTransformer(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const Vp = params.Vp ?? 220;
  const Np = params.Np ?? 400;
  const Ns = params.Ns ?? 800;
  const Ip = params.Ip ?? 4;

  const K = Ns / Np;
  const Vs = Vp * K;
  const Is = Ip / K;
  const Power = Vp * Ip;

  if (state.t === undefined) state.t = 0;
  if (isPlaying) state.t += dt * 3;

  const cx = width * 0.5;
  const cy = height * 0.52;
  const coreW = 240;
  const coreH = 160;

  // Laminated Iron Core
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  drawHatchRect(ctx, cx - coreW / 2, cy - coreH / 2, coreW, coreH, p, 12);
  ctx.fillStyle = p.bg;
  ctx.fillRect(cx - coreW / 2 + 34, cy - coreH / 2 + 34, coreW - 68, coreH - 68);
  ctx.strokeRect(cx - coreW / 2 + 34, cy - coreH / 2 + 34, coreW - 68, coreH - 68);

  // Pulsing flux arrows around core
  const pulse = Math.sin(state.t);
  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.2;
  ctx.setLineDash([8, 6]);
  ctx.lineDashOffset = -state.t * 18;
  ctx.strokeRect(cx - coreW / 2 + 17, cy - coreH / 2 + 17, coreW - 34, coreH - 34);
  ctx.restore();

  // Primary & Secondary Coil windings
  const drawWindings = (xCenter: number, count: number, label: string) => {
    const nDraw = Math.max(4, Math.min(12, Math.round(count / 80)));
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 3.5;
    for (let i = 0; i < nDraw; i++) {
      const yy = cy - 44 + (i / Math.max(1, nDraw - 1)) * 88;
      ctx.beginPath();
      ctx.moveTo(xCenter - 22, yy);
      ctx.lineTo(xCenter + 22, yy + 4);
      ctx.stroke();
    }
    ctx.fillStyle = p.ink;
    ctx.font = 'bold 12px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, xCenter, cy + coreH / 2 + 24);
    ctx.textAlign = 'left';
  };

  drawWindings(cx - coreW / 2 + 17, Np, `Primary N_p=${Np}`);
  drawWindings(cx + coreW / 2 - 17, Ns, `Secondary N_s=${Ns}`);

  // Live instant V labels
  ctx.fillStyle = p.ink;
  ctx.font = 'bold 13px "IBM Plex Mono", monospace';
  ctx.fillText(`V_p = ${Vp} V`, 22, cy - 10);
  ctx.fillText(`I_p = ${Ip.toFixed(1)} A`, 22, cy + 14);
  ctx.fillText(`V_s = ${Vs.toFixed(0)} V`, width - 135, cy - 10);
  ctx.fillText(`I_s = ${Is.toFixed(2)} A`, width - 135, cy + 14);

  const kind = K > 1.02 ? 'STEP-UP' : K < 0.98 ? 'STEP-DOWN' : '1:1 ISOLATION';
  ctx.fillStyle = p.ink;
  ctx.fillRect(18, 18, 180, 30);
  ctx.fillStyle = p.bg;
  ctx.fillText(`${kind} (K=${K.toFixed(2)})`, 28, 38);

  const graphPoints: { x: number; y: number }[] = [];
  const graphSecondPoints: { x: number; y: number }[] = [];
  for (let i = 0; i <= 48; i++) {
    const ph = (i / 48) * Math.PI * 2;
    graphPoints.push({ x: Number(ph.toFixed(2)), y: Vp * Math.sin(ph) });
    graphSecondPoints.push({ x: Number(ph.toFixed(2)), y: Vs * Math.sin(ph) });
  }
  const peakMax = Math.max(Vp, Vs) * 1.15;

  return {
    substitutedFormula: `V_s = ${Vp} × (${Ns}/${Np}) = ${Vs.toFixed(1)} V  |  I_s = ${Is.toFixed(2)} A  (P = ${Power.toFixed(0)} W)`,
    readouts: [
      { symbol: 'V_s', label: { en: 'Secondary Voltage', hi: 'द्वितीयक वोल्टता' }, value: Vs.toFixed(1), unit: 'V' },
      { symbol: 'I_s', label: { en: 'Secondary Current', hi: 'द्वितीयक धारा' }, value: Is.toFixed(2), unit: 'A' },
      { symbol: 'K', label: { en: 'Turns Ratio', hi: 'परिणमन अनुपात' }, value: K.toFixed(2), unit: '' },
      { symbol: 'P', label: { en: 'Ideal Power', hi: 'आदर्श शक्ति' }, value: (Power * Math.abs(pulse) * 0 + Power).toFixed(0), unit: 'W' },
    ],
    graphPoints,
    graphSecondPoints,
    graphLegend: { primary: 'Primary V_p', secondary: 'Secondary V_s' },
    graphXRange: [0, 6.28],
    graphYRange: [-peakMax, peakMax],
  };
}

// 17. SNELL'S LAW & TIR
function renderSnellPrismTir(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params } = rc;
  const n1 = params.n1 ?? 1.5;
  const n2 = params.n2 ?? 1.0;
  const iDeg = params.iDeg ?? 35;

  const iRad = (iDeg * Math.PI) / 180;
  const sinR = (n1 / n2) * Math.sin(iRad);
  const isTIR = sinR >= 1.0;
  const rDeg = isTIR ? 90 : (Math.asin(sinR) * 180) / Math.PI;
  const icDeg = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;

  const midY = height * 0.5;
  const cx = width * 0.5;

  // Medium 1 (bottom, hatched if denser) and Medium 2 (top)
  if (n1 > n2) {
    drawHatchRect(ctx, 20, midY, width - 40, height - midY - 20, p, 14);
  } else if (n2 > n1) {
    drawHatchRect(ctx, 20, 20, width - 40, midY - 20, p, 14);
  }

  // Interface & Normal
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, midY);
  ctx.lineTo(width - 20, midY);
  ctx.stroke();

  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, 26);
  ctx.lineTo(cx, height - 26);
  ctx.stroke();
  ctx.restore();

  const rayL = 140;
  // Incident ray coming from bottom-left to (cx, midY)
  const incX = cx - rayL * Math.sin(iRad);
  const incY = midY + rayL * Math.cos(iRad);
  drawVectorArrow(ctx, incX, incY, cx, midY, p.ink, `i=${iDeg}°`, 'solid');

  if (isTIR) {
    // 100% Reflected ray back into bottom-right
    const refX = cx + rayL * Math.sin(iRad);
    const refY = midY + rayL * Math.cos(iRad);
    drawVectorArrow(ctx, cx, midY, refX, refY, p.ink, `TIR ${iDeg}°`, 'double');
  } else {
    const rRad = (rDeg * Math.PI) / 180;
    const trX = cx + rayL * Math.sin(rRad);
    const trY = midY - rayL * Math.cos(rRad);
    drawVectorArrow(ctx, cx, midY, trX, trY, p.ink, `r=${rDeg.toFixed(1)}°`, 'double');
    // Weak partial reflection
    const refX = cx + rayL * 0.55 * Math.sin(iRad);
    const refY = midY + rayL * 0.55 * Math.cos(iRad);
    drawVectorArrow(ctx, cx, midY, refX, refY, p.inkMuted, '', 'dashed');
  }

  ctx.fillStyle = p.ink;
  ctx.font = 'bold 12px "IBM Plex Mono", monospace';
  ctx.fillText(`Medium 2 (n₂ = ${n2.toFixed(2)})`, 28, 42);
  ctx.fillText(`Medium 1 (n₁ = ${n1.toFixed(2)})`, 28, height - 30);

  if (isTIR) {
    ctx.fillStyle = p.ink;
    ctx.fillRect(width - 240, 20, 220, 32);
    ctx.fillStyle = p.bg;
    ctx.fillText('TOTAL INTERNAL REFLECTION!', width - 228, 41);
  }

  const graphPoints: { x: number; y: number }[] = [];
  for (let ang = 0; ang <= 85; ang += 2) {
    const sr = (n1 / n2) * Math.sin((ang * Math.PI) / 180);
    if (sr <= 1) graphPoints.push({ x: ang, y: (Math.asin(sr) * 180) / Math.PI });
  }

  return {
    substitutedFormula: isTIR
      ? `i = ${iDeg}° > i_c (${icDeg?.toFixed(1)}°)  ⇒  TOTAL INTERNAL REFLECTION!`
      : `${n1.toFixed(2)}·sin(${iDeg}°) = ${n2.toFixed(2)}·sin(${rDeg.toFixed(1)}°)`,
    readouts: [
      { symbol: 'r', label: { en: 'Refraction Angle', hi: 'अपवर्तन कोण' }, value: isTIR ? 'TIR' : `${rDeg.toFixed(1)}°`, unit: '' },
      { symbol: 'i_c', label: { en: 'Critical Angle', hi: 'क्रांतिक कोण' }, value: icDeg ? `${icDeg.toFixed(1)}°` : 'None', unit: '' },
      { symbol: 'δ', label: { en: 'Ray Deviation', hi: 'किरण विचलन' }, value: (isTIR ? 180 - 2 * iDeg : Math.abs(rDeg - iDeg)).toFixed(1), unit: '°' },
      { symbol: 'v₁/c', label: { en: 'Speed Ratio', hi: 'चाल अनुपात' }, value: (1 / n1).toFixed(2), unit: 'c' },
    ],
    graphPoints,
    graphCurrentPoint: isTIR ? undefined : { x: iDeg, y: rDeg },
    graphXRange: [0, 85],
    graphYRange: [0, 90],
  };
}

// 18. MICROSCOPE & TELESCOPE
function renderMicroscopeTelescope(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params } = rc;
  const isTel = (params.mode ?? 0) >= 0.5;
  const fo = params.fo ?? 2.0;
  const fe = params.fe ?? 5.0;
  const L = params.L ?? 20;
  const D = 25;

  const mag = isTel ? fo / fe : (L / fo) * (1 + D / fe);
  const tubeLen = isTel ? fo + fe : L;

  const cy = height * 0.52;
  const objX = width * 0.34;
  const eyeX = width * 0.72;

  // Optical axis
  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(24, cy);
  ctx.lineTo(width - 24, cy);
  ctx.stroke();
  ctx.restore();

  // Optical tube barrel
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(objX, cy - 68, eyeX - objX, 136);

  // Two convex lenses
  const drawConvex = (x: number, h: number, label: string) => {
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(x, cy, 10, h, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = p.ink;
    ctx.font = 'bold 12px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, cy + h + 22);
    ctx.textAlign = 'left';
  };
  drawConvex(objX, isTel ? 64 : 40, `Obj f_o=${fo}cm`);
  drawConvex(eyeX, isTel ? 38 : 54, `Eye f_e=${fe}cm`);

  // Rays
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.2;
  const interX = objX + (eyeX - objX) * (isTel ? 0.74 : 0.65);
  if (isTel) {
    // Parallel rays from distant star
    ctx.beginPath();
    ctx.moveTo(30, cy - 42);
    ctx.lineTo(objX, cy - 42);
    ctx.lineTo(interX, cy + 16);
    ctx.lineTo(eyeX, cy + 32);
    ctx.lineTo(width - 28, cy + 12);
    ctx.moveTo(30, cy + 28);
    ctx.lineTo(objX, cy + 28);
    ctx.lineTo(interX, cy + 16);
    ctx.lineTo(eyeX, cy - 8);
    ctx.lineTo(width - 28, cy - 28);
    ctx.stroke();
  } else {
    // Small nearby object
    drawVectorArrow(ctx, objX - 66, cy, objX - 66, cy - 24, p.ink, 'Obj', 'solid');
    ctx.beginPath();
    ctx.moveTo(objX - 66, cy - 24);
    ctx.lineTo(objX, cy - 24);
    ctx.lineTo(interX, cy + 36);
    ctx.lineTo(eyeX, cy + 44);
    ctx.lineTo(width - 26, cy + 24);
    ctx.stroke();
    drawVectorArrow(ctx, interX, cy, interX, cy + 36, p.ink, 'I₁', 'dashed');
  }

  ctx.fillStyle = p.ink;
  ctx.fillRect(18, 18, 250, 30);
  ctx.fillStyle = p.bg;
  ctx.font = 'bold 12px "IBM Plex Mono", monospace';
  ctx.fillText(isTel ? `ASTRONOMICAL TELESCOPE (${mag.toFixed(1)}×)` : `COMPOUND MICROSCOPE (${mag.toFixed(0)}×)`, 28, 38);

  const graphPoints: { x: number; y: number }[] = [];
  for (let f = 1; f <= 15; f += 0.5) {
    const mVal = isTel ? fo / f : (L / fo) * (1 + D / f);
    graphPoints.push({ x: f, y: Math.min(400, mVal) });
  }

  return {
    substitutedFormula: isTel
      ? `M = f_o / f_e = ${fo} / ${fe} = ${mag.toFixed(1)}×  |  L = ${tubeLen.toFixed(1)} cm`
      : `M = (${L}/${fo})·(1 + 25/${fe}) = ${mag.toFixed(1)}×`,
    readouts: [
      { symbol: 'M', label: { en: 'Magnification', hi: 'कोणीय आवर्धन' }, value: `${mag.toFixed(1)}×`, unit: '' },
      { symbol: 'L_tot', label: { en: 'Tube Length', hi: 'नली लंबाई' }, value: tubeLen.toFixed(1), unit: 'cm' },
      { symbol: 'm_e', label: { en: 'Eyepiece Power', hi: 'नेत्रिका आवर्धन' }, value: (isTel ? 1 : 1 + D / fe).toFixed(1), unit: '×' },
      { symbol: 'Mode', label: { en: 'Instrument', hi: 'यंत्र प्रकार' }, value: isTel ? 'TELESCOPE' : 'MICROSCOPE', unit: '' },
    ],
    graphPoints,
    graphCurrentPoint: { x: fe, y: Math.min(400, mag) },
    graphXRange: [1, 15],
    graphYRange: [0, Math.min(400, Math.max(30, mag * 2))],
  };
}

// 19. SINGLE-SLIT DIFFRACTION & POLARIZATION
function renderDiffractionPolarization(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params } = rc;
  const lamNm = params.lambda ?? 550;
  const aMm = params.a ?? 0.3;
  const D = params.D ?? 1.5;
  const phiDeg = params.phi ?? 45;

  const lam = lamNm * 1e-9;
  const a = aMm * 1e-3;
  const W0Mm = ((2 * lam * D) / a) * 1000;
  const cos2 = Math.pow(Math.cos((phiDeg * Math.PI) / 180), 2);

  // Left: Slit + Screen intensity pattern
  const slitX = width * 0.18;
  const screenX = width * 0.56;
  const cy = height * 0.5;
  const gap = Math.max(6, aMm * 28);

  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(slitX, 34);
  ctx.lineTo(slitX, cy - gap / 2);
  ctx.moveTo(slitX, cy + gap / 2);
  ctx.lineTo(slitX, height - 34);
  ctx.stroke();

  // Screen & sinc² curve
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(screenX, 34);
  ctx.lineTo(screenX, height - 34);
  ctx.stroke();

  ctx.beginPath();
  for (let py = 38; py <= height - 38; py += 2) {
    const dyMm = ((py - cy) / (height - 76)) * 28;
    const beta = (Math.PI * a * (dyMm * 1e-3)) / (lam * D);
    const intens = Math.abs(beta) < 0.001 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
    const px = screenX + intens * 92;
    if (py === 38) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Right: Malus Polarizer Discs
  const polX = width * 0.83;
  const polY = height * 0.5;
  const polR = 46;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(polX, polY, polR, 0, Math.PI * 2);
  ctx.stroke();

  // Analyzer transmission axis at angle phi
  const phiRad = (phiDeg * Math.PI) / 180;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(polX - polR * Math.sin(phiRad), polY - polR * Math.cos(phiRad));
  ctx.lineTo(polX + polR * Math.sin(phiRad), polY + polR * Math.cos(phiRad));
  ctx.stroke();

  // Output intensity bar
  ctx.fillStyle = p.ink;
  ctx.fillRect(polX - 36, polY + polR + 18, 72 * cos2, 12);
  ctx.strokeRect(polX - 36, polY + polR + 18, 72, 12);
  ctx.font = 'bold 11px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`Malus I = ${(cos2 * 100).toFixed(0)}%`, polX, polY + polR + 48);
  ctx.textAlign = 'left';

  const graphPoints: { x: number; y: number }[] = [];
  for (let ym = -12; ym <= 12; ym += 0.4) {
    const beta = (Math.PI * a * (ym * 1e-3)) / (lam * D);
    const intens = Math.abs(beta) < 0.001 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
    graphPoints.push({ x: Number(ym.toFixed(1)), y: Number(intens.toFixed(3)) });
  }

  return {
    substitutedFormula: `W₀ = 2λD/a = ${W0Mm.toFixed(2)} mm  |  I = I₀·cos²(${phiDeg}°) = ${(cos2 * 100).toFixed(1)}%`,
    readouts: [
      { symbol: 'W₀', label: { en: 'Central Fringe Width', hi: 'केंद्रीय उच्चिष्ठ चौड़ाई' }, value: W0Mm.toFixed(2), unit: 'mm' },
      { symbol: 'θ₁', label: { en: '1st Minimum Angle', hi: 'प्रथम निम्निष्ठ कोण' }, value: ((lam / a) * 1000).toFixed(2), unit: 'mrad' },
      { symbol: 'I/I₀', label: { en: 'Malus Transmitted', hi: 'मैलस तीव्रता' }, value: `${(cos2 * 100).toFixed(1)}%`, unit: '' },
      { symbol: 'cos²φ', label: { en: 'Polarization Factor', hi: 'ध्रुवण गुणांक' }, value: cos2.toFixed(3), unit: '' },
    ],
    graphPoints,
    graphXRange: [-12, 12],
    graphYRange: [0, 1.1],
  };
}

// 20. DE BROGLIE MATTER WAVE
function renderDeBroglie(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const V = params.V ?? 54;
  const mRatio = params.massRatio ?? 1;

  const lamNm = 1.227 / Math.sqrt(V * mRatio);
  const speed = Math.sqrt((2 * 1.602e-19 * V) / (9.109e-31 * mRatio));

  if (state.t === undefined) state.t = 0;
  if (isPlaying) state.t += dt * 4;

  const cy = height * 0.52;
  // Electron gun anode/cathode on left
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(24, cy - 42, 72, 84);
  ctx.fillStyle = p.ink;
  ctx.font = 'bold 12px "IBM Plex Mono", monospace';
  ctx.fillText(`+${V} V`, 36, cy + 5);

  // Matter wave packet propagating right
  const pxWavelength = Math.max(12, Math.min(130, lamNm * 220));
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 104; x <= width - 36; x += 2) {
    const env = Math.sin(((x - 104) / (width - 140)) * Math.PI);
    const y = cy + Math.sin(((x - 104) / pxWavelength) * Math.PI * 2 - state.t * 3) * 44 * (0.35 + 0.65 * env);
    if (x === 104) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Wavelength caliper marker
  const calY = cy - 66;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(160, calY);
  ctx.lineTo(160 + pxWavelength, calY);
  ctx.moveTo(160, calY - 8);
  ctx.lineTo(160, calY + 8);
  ctx.moveTo(160 + pxWavelength, calY - 8);
  ctx.lineTo(160 + pxWavelength, calY + 8);
  ctx.stroke();
  ctx.fillText(`λ = ${lamNm.toFixed(3)} nm`, 160, calY - 12);

  const graphPoints: { x: number; y: number }[] = [];
  for (let vv = 10; vv <= 1000; vv += 20) {
    graphPoints.push({ x: vv, y: 1.227 / Math.sqrt(vv * mRatio) });
  }

  return {
    substitutedFormula: `λ = 1.227 / √(${V}×${mRatio}) = ${lamNm.toFixed(4)} nm  (${(lamNm * 10).toFixed(2)} Å)`,
    readouts: [
      { symbol: 'λ', label: { en: 'de Broglie λ', hi: 'डी-ब्रॉग्ली तरंगदैर्घ्य' }, value: lamNm.toFixed(4), unit: 'nm' },
      { symbol: 'λ(Å)', label: { en: 'In Angstroms', hi: 'एंग्स्ट्रॉम में' }, value: (lamNm * 10).toFixed(2), unit: 'Å' },
      { symbol: 'v', label: { en: 'Particle Speed', hi: 'कण की चाल' }, value: (speed / 1e6).toFixed(2), unit: '×10⁶ m/s' },
      { symbol: 'K', label: { en: 'Kinetic Energy', hi: 'गतिज ऊर्जा' }, value: `${V}`, unit: 'eV' },
    ],
    graphPoints,
    graphCurrentPoint: { x: V, y: lamNm },
    graphXRange: [10, 1000],
    graphYRange: [0, 0.42],
  };
}

// 21. MASS-ENERGY & BINDING ENERGY CURVE
function bePerNucleon(A: number): number {
  if (A <= 2) return 1.11;
  if (A <= 4) return 7.07;
  // Semi-empirical Bethe-Weizsacker curve matching Fe-56 peak (~8.75 MeV) and U-238 (~7.57 MeV)
  const Z = Math.round(A / (2 + 0.015 * Math.pow(A, 2 / 3)));
  const aV = 15.75;
  const aS = 17.8;
  const aC = 0.711;
  const aA = 23.7;
  const BE =
    aV * A -
    aS * Math.pow(A, 2 / 3) -
    aC * (Z * (Z - 1)) / Math.pow(A, 1 / 3) -
    (aA * (A - 2 * Z) * (A - 2 * Z)) / A;
  return Math.max(1.1, BE / A);
}

function renderBindingEnergy(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params } = rc;
  const A = params.A ?? 56;
  const dm = params.dm ?? 0.21;

  const beA = bePerNucleon(A);
  const totalBE = beA * A;
  const energyMeV = dm * 931.5;
  const nucRadiusFm = 1.2 * Math.pow(A, 1 / 3);

  const padL = 56;
  const padR = 26;
  const padT = 36;
  const padB = 46;
  const gw = width - padL - padR;
  const gh = height - padT - padB;

  // Axes
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, padT + gh);
  ctx.lineTo(padL + gw, padT + gh);
  ctx.stroke();

  // Fusion / Stable / Fission zone labels
  ctx.fillStyle = p.inkMuted;
  ctx.font = 'bold 11px "IBM Plex Mono", monospace';
  ctx.fillText('← FUSION', padL + 8, padT + 18);
  ctx.fillText('Fe-56 PEAK (8.75 MeV)', padL + gw * 0.18, padT + 14);
  ctx.fillText('FISSION →', padL + gw * 0.72, padT + 18);

  // Curve
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let aVal = 2; aVal <= 238; aVal += 2) {
    const x = padL + (aVal / 240) * gw;
    const y = padT + gh - (bePerNucleon(aVal) / 10) * gh;
    if (aVal === 2) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Active Nucleus marker
  const curX = padL + (A / 240) * gw;
  const curY = padT + gh - (beA / 10) * gh;
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(curX, curY, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 12px "IBM Plex Mono", monospace';
  ctx.fillText(`A=${A} (${beA.toFixed(2)} MeV)`, Math.min(width - 155, curX + 12), curY - 8);

  // E = Δm·c² readout box
  ctx.fillStyle = p.surface;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.fillRect(padL + 16, padT + gh - 54, 240, 38);
  ctx.strokeRect(padL + 16, padT + gh - 54, 240, 38);
  ctx.fillStyle = p.ink;
  ctx.fillText(`E = ${dm.toFixed(2)}u × 931.5 = ${energyMeV.toFixed(1)} MeV`, padL + 26, padT + gh - 30);

  const graphPoints: { x: number; y: number }[] = [];
  for (let aVal = 2; aVal <= 238; aVal += 4) {
    graphPoints.push({ x: aVal, y: Number(bePerNucleon(aVal).toFixed(2)) });
  }

  return {
    substitutedFormula: `E = ${dm.toFixed(2)} u × 931.5 = ${energyMeV.toFixed(1)} MeV  |  BE/A(A=${A}) = ${beA.toFixed(2)} MeV`,
    readouts: [
      { symbol: 'E', label: { en: 'Mass-Energy Δmc²', hi: 'मुक्त ऊर्जा Δmc²' }, value: energyMeV.toFixed(1), unit: 'MeV' },
      { symbol: 'BE/A', label: { en: 'Binding / Nucleon', hi: 'बंधन ऊर्जा / A' }, value: beA.toFixed(2), unit: 'MeV' },
      { symbol: 'E_b', label: { en: 'Total Binding E', hi: 'कुल बंधन ऊर्जा' }, value: totalBE.toFixed(0), unit: 'MeV' },
      { symbol: 'R', label: { en: 'Nuclear Radius', hi: 'नाभिकीय त्रिज्या' }, value: nucRadiusFm.toFixed(2), unit: 'fm' },
    ],
    graphPoints,
    graphCurrentPoint: { x: A, y: Number(beA.toFixed(2)) },
    graphXRange: [2, 238],
    graphYRange: [0, 10],
  };
}

// 22. DIGITAL LOGIC GATES SIMULATOR
const GATE_NAMES = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'] as const;

function evalGate(gateIdx: number, a: number, b: number): number {
  const A = a >= 0.5 ? 1 : 0;
  const B = b >= 0.5 ? 1 : 0;
  switch (gateIdx) {
    case 0: return A & B;
    case 1: return A | B;
    case 2: return A ? 0 : 1;
    case 3: return (A & B) ? 0 : 1;
    case 4: return (A | B) ? 0 : 1;
    case 5: return A ^ B;
    default: return 0;
  }
}

function renderLogicGates(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params } = rc;
  const gateIdx = Math.max(0, Math.min(5, Math.round(params.gate ?? 3)));
  const A = (params.A ?? 1) >= 0.5 ? 1 : 0;
  const B = (params.B ?? 0) >= 0.5 ? 1 : 0;
  const Y = evalGate(gateIdx, A, B);
  const gName = GATE_NAMES[gateIdx];
  const isUnary = gateIdx === 2;

  const gx = width * 0.34;
  const gy = height * 0.5;

  // Input wires & switches
  const drawInput = (yPos: number, label: string, val: number) => {
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = val ? 4 : 2;
    ctx.setLineDash(val ? [] : [5, 5]);
    ctx.beginPath();
    ctx.moveTo(74, yPos);
    ctx.lineTo(gx - 40, yPos);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = val ? p.ink : p.bg;
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2.5;
    ctx.fillRect(24, yPos - 18, 50, 36);
    ctx.strokeRect(24, yPos - 18, 50, 36);
    ctx.fillStyle = val ? p.bg : p.ink;
    ctx.font = 'bold 13px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${label}=${val}`, 49, yPos + 5);
    ctx.textAlign = 'left';
  };

  if (isUnary) {
    drawInput(gy, 'A', A);
  } else {
    drawInput(gy - 28, 'A', A);
    drawInput(gy + 28, 'B', B);
  }

  // IEEE Logic Gate Symbol (Pure B&W)
  ctx.fillStyle = p.bg;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  if (isUnary) {
    ctx.moveTo(gx - 40, gy - 36);
    ctx.lineTo(gx - 40, gy + 36);
    ctx.lineTo(gx + 26, gy);
    ctx.closePath();
  } else if (gateIdx === 0 || gateIdx === 3) {
    // D-shaped AND / NAND
    ctx.moveTo(gx - 40, gy - 40);
    ctx.lineTo(gx, gy - 40);
    ctx.arc(gx, gy, 40, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(gx - 40, gy + 40);
    ctx.closePath();
  } else {
    // Curved OR / NOR / XOR
    ctx.moveTo(gx - 40, gy - 40);
    ctx.quadraticCurveTo(gx + 10, gy - 40, gx + 40, gy);
    ctx.quadraticCurveTo(gx + 10, gy + 40, gx - 40, gy + 40);
    ctx.quadraticCurveTo(gx - 22, gy, gx - 40, gy - 40);
  }
  ctx.fill();
  ctx.stroke();

  if (gateIdx === 5) {
    // Extra XOR rear curve
    ctx.beginPath();
    ctx.moveTo(gx - 50, gy - 38);
    ctx.quadraticCurveTo(gx - 32, gy, gx - 50, gy + 38);
    ctx.stroke();
  }

  // Inversion bubble for NOT, NAND, NOR
  const hasBubble = gateIdx === 2 || gateIdx === 3 || gateIdx === 4;
  const outStart = hasBubble ? gx + (isUnary ? 40 : 54) : gx + 40;
  if (hasBubble) {
    ctx.fillStyle = p.bg;
    ctx.beginPath();
    ctx.arc(outStart - 7, gy, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = p.ink;
  ctx.font = 'bold 14px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(gName, gx - 6, gy + 5);
  ctx.textAlign = 'left';

  // Output wire & Bulb
  const bulbX = gx + 122;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = Y ? 4.5 : 2;
  ctx.setLineDash(Y ? [] : [5, 5]);
  ctx.beginPath();
  ctx.moveTo(outStart, gy);
  ctx.lineTo(bulbX - 24, gy);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = Y ? p.ink : p.bg;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(bulbX, gy, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = Y ? p.bg : p.ink;
  ctx.font = 'bold 14px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`Y=${Y}`, bulbX, gy + 5);
  ctx.textAlign = 'left';

  // Right-side Live Truth Table (highlighting active row!)
  const tx = width * 0.67;
  const ty = 46;
  const tw = Math.min(180, width - tx - 18);
  const rows = isUnary ? [[0, 0], [1, 0]] : [[0, 0], [0, 1], [1, 0], [1, 1]];

  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.fillStyle = p.surface;
  ctx.fillRect(tx, ty, tw, 28);
  ctx.strokeRect(tx, ty, tw, 28);
  ctx.fillStyle = p.ink;
  ctx.font = 'bold 12px "IBM Plex Mono", monospace';
  ctx.fillText(isUnary ? '  A   |  Y' : '  A   B  |  Y', tx + 10, ty + 19);

  rows.forEach(([ra, rb], idx) => {
    const ry = ty + 28 + idx * 32;
    const active = ra === A && (isUnary || rb === B);
    const rv = evalGate(gateIdx, ra, rb);
    ctx.fillStyle = active ? p.ink : p.bg;
    ctx.fillRect(tx, ry, tw, 32);
    ctx.strokeRect(tx, ry, tw, 32);
    ctx.fillStyle = active ? p.bg : p.ink;
    ctx.fillText(isUnary ? `  ${ra}   |  ${rv}` : `  ${ra}   ${rb}  |  ${rv}`, tx + 10, ry + 21);
  });

  const graphPoints: { x: number; y: number }[] = [
    { x: 0, y: evalGate(gateIdx, 0, 0) },
    { x: 1, y: evalGate(gateIdx, 0, 1) },
    { x: 2, y: evalGate(gateIdx, 1, 0) },
    { x: 3, y: evalGate(gateIdx, 1, 1) },
  ];

  return {
    substitutedFormula: `${gName}(A=${A}${isUnary ? '' : `, B=${B}`}) ⇒ Y = ${Y} (${Y ? 'HIGH / +5V' : 'LOW / 0V'})`,
    readouts: [
      { symbol: 'Gate', label: { en: 'Active Gate', hi: 'सक्रिय गेट' }, value: gName, unit: '' },
      { symbol: 'In', label: { en: 'Binary Inputs', hi: 'बाइनरी इनपुट' }, value: isUnary ? `${A}` : `${A}, ${B}`, unit: '' },
      { symbol: 'Y', label: { en: 'Logic Output', hi: 'लॉजिक आउटपुट' }, value: `${Y}`, unit: Y ? 'HIGH' : 'LOW' },
      { symbol: 'V_out', label: { en: 'TTL Voltage', hi: 'वोल्टेज स्तर' }, value: Y ? '5.0' : '0.0', unit: 'V' },
    ],
    graphPoints,
    graphCurrentPoint: { x: A * 2 + (isUnary ? 0 : B), y: Y },
    graphXRange: [0, 3],
    graphYRange: [-0.2, 1.3],
  };
}
