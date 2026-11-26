import { LiveSimTelemetry } from '../types/physics';
import {
  CanvasPalette,
  drawHatchRect,
  drawLegendPill,
  drawVectorArrow,
} from '../utils/canvasHelpers';
import { SimRenderContext } from './builtinEngines';

export function stepAndRenderExtendedSim(
  rc: SimRenderContext,
  p: CanvasPalette
): LiveSimTelemetry | null {
  switch (rc.simId) {
    case 'units-measurements':
      return renderUnitsMeasurements(rc, p);
    case 'motion-1d':
      return renderMotion1D(rc, p);
    case 'solids-elasticity':
      return renderSolidsElasticity(rc, p);
    case 'fluids':
      return renderFluids(rc, p);
    case 'thermal-matter':
      return renderThermalMatter(rc, p);
    case 'thermodynamics':
      return renderThermodynamics(rc, p);
    case 'kinetic-theory':
      return renderKineticTheory(rc, p);
    case 'capacitance':
      return renderCapacitance(rc, p);
    case 'magnetism-matter':
      return renderMagnetismMatter(rc, p);
    case 'emi':
      return renderEMI2D(rc, p);
    case 'ac-circuits':
      return renderACCircuits(rc, p);
    case 'em-waves':
      return renderEMWaves2D(rc, p);
    case 'wave-optics':
      return renderWaveOptics(rc, p);
    case 'dual-nature':
      return renderDualNature(rc, p);
    case 'atoms':
      return renderAtoms2D(rc, p);
    case 'nuclei':
      return renderNuclei(rc, p);
    case 'semiconductors':
      return renderSemiconductors(rc, p);
    default:
      return null;
  }
}

// 1. UNITS & MEASUREMENTS (VERNIER CALIPER + ERROR PROPAGATION)
function renderUnitsMeasurements(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const A = params.A ?? 10;
  const dA = params.dA ?? 0.2;
  const aExp = params.aExp ?? 2;
  const B = params.B ?? 5;
  const dB = params.dB ?? 0.1;
  const bExp = params.bExp ?? 1;

  if (state.t === undefined) state.t = 0;
  if (isPlaying && dt > 0) state.t += dt;

  const pctA = (dA / A) * 100;
  const pctB = (dB / B) * 100;
  const contribA = aExp * pctA;
  const contribB = bExp * pctB;
  const totalPct = contribA + contribB;
  const Z = Math.pow(A, aExp) * Math.pow(B, bExp);
  const dZ = (totalPct / 100) * Z;

  // Draw Vernier Caliper Diagram (top half)
  const scaleX = 56;
  const scaleW = width - 112;
  const scaleY = height * 0.26;
  const pxPerCm = scaleW / 20;

  // Main scale beam
  drawHatchRect(ctx, scaleX, scaleY - 16, scaleW, 32, 'hollow', p, 4);
  ctx.strokeStyle = p.ink;
  ctx.fillStyle = p.ink;
  ctx.font = '700 11px "IBM Plex Mono", monospace';
  for (let i = 0; i <= 20; i++) {
    const tx = scaleX + i * pxPerCm;
    const h = i % 5 === 0 ? 15 : 9;
    ctx.lineWidth = i % 5 === 0 ? 2.2 : 1.3;
    ctx.beginPath();
    ctx.moveTo(tx, scaleY + 16);
    ctx.lineTo(tx, scaleY + 16 - h);
    ctx.stroke();
    if (i % 2 === 0) {
      ctx.textAlign = 'center';
      ctx.fillText(`${i}`, tx, scaleY - 22);
    }
  }
  ctx.textAlign = 'left';

  // Fixed Left Jaw
  drawHatchRect(ctx, scaleX - 18, scaleY - 16, 18, 92, 'solid', p, 2);

  // Sliding Vernier Jaw with slight live measurement jitter representing ±ΔA
  const jitter = Math.sin(state.t * 3.5) * dA;
  const jawX = scaleX + Math.min(19.5, Math.max(0.5, A + jitter)) * pxPerCm;
  drawHatchRect(ctx, jawX, scaleY + 16, Math.min(95, pxPerCm * 3), 24, 'diagonal', p, 2);
  drawHatchRect(ctx, jawX, scaleY + 16, 16, 60, 'solid', p, 2);

  // Measured Object clamped between jaws
  const objW = Math.max(6, jawX - scaleX);
  drawHatchRect(ctx, scaleX, scaleY + 26, objW, 36, 'cross', p, 4);
  ctx.fillStyle = p.bg;
  ctx.fillRect(scaleX + objW / 2 - 44, scaleY + 34, 88, 20);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(scaleX + objW / 2 - 44, scaleY + 34, 88, 20);
  ctx.fillStyle = p.ink;
  ctx.font = '700 12px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`A=${A.toFixed(1)}±${dA}`, scaleX + objW / 2, scaleY + 48);
  ctx.textAlign = 'left';

  // Error Budget Stacked Bar (bottom half)
  const barY = height * 0.7;
  const barW = width - 112;
  const barH = 38;
  const fracA = totalPct > 0 ? contribA / totalPct : 0.5;
  const wA = barW * fracA;
  const wB = barW - wA;

  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.fillText(`MAXIMUM % ERROR BUDGET:  a·(ΔA/A) + b·(ΔB/B) = ${totalPct.toFixed(2)}%`, scaleX, barY - 12);

  drawHatchRect(ctx, scaleX, barY, Math.max(4, wA), barH, 'solid', p, 4);
  drawHatchRect(ctx, scaleX + wA, barY, Math.max(4, wB), barH, 'diagonal', p, 4);

  if (wA > 75) {
    ctx.fillStyle = p.inkInvert;
    ctx.font = '700 12px "IBM Plex Mono", monospace';
    ctx.fillText(`A: ${contribA.toFixed(1)}%`, scaleX + 10, barY + 23);
  }
  if (wB > 75) {
    ctx.fillStyle = p.bg;
    ctx.fillRect(scaleX + wA + 8, barY + 9, 86, 20);
    ctx.fillStyle = p.ink;
    ctx.fillText(`B: ${contribB.toFixed(1)}%`, scaleX + wA + 14, barY + 23);
  }

  drawLegendPill(ctx, 14, 14, `Solid: a·(ΔA/A) · Hatch: b·(ΔB/B)`, 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let exp = 1; exp <= 4; exp += 0.25) {
    graphPoints.push({ x: exp, y: exp * pctA + bExp * pctB });
  }

  return {
    substitutedFormula: `ΔZ/Z = ${aExp}×(${pctA.toFixed(1)}%) + ${bExp}×(${pctB.toFixed(1)}%) = ${totalPct.toFixed(2)}%`,
    readouts: [
      { symbol: 'δZ', label: { en: 'Total % Error', hi: 'कुल प्रतिशत त्रुटि' }, value: totalPct.toFixed(2), unit: '%', accent: 'force' },
      { symbol: 'a·δA', label: { en: 'Error from A', hi: 'A से त्रुटि' }, value: contribA.toFixed(2), unit: '%', accent: 'velocity' },
      { symbol: 'b·δB', label: { en: 'Error from B', hi: 'B से त्रुटि' }, value: contribB.toFixed(2), unit: '%', accent: 'energy' },
      { symbol: '±ΔZ', label: { en: 'Absolute Error ΔZ', hi: 'निरपेक्ष त्रुटि ΔZ' }, value: dZ.toFixed(1), unit: '', accent: 'momentum' },
    ],
    graphPoints,
    graphCurrentPoint: { x: aExp, y: totalPct },
    graphLegend: { primary: 'Total % Error vs Power a' },
  };
}

// 2. MOTION IN A STRAIGHT LINE (1D KINEMATICS)
function renderMotion1D(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const u = params.u ?? 4;
  const a = params.a ?? 2.5;
  const tMax = params.tMax ?? 6;

  const initKey = `${u}_${a}_${tMax}`;
  if (state.initKey !== initKey || state.t === undefined) {
    state.initKey = initKey;
    state.t = 0;
  }
  if (isPlaying && dt > 0) {
    state.t += dt;
    if (state.t > tMax + 0.5) state.t = 0;
  }

  const t = Math.min(state.t, tMax);
  const v = u + a * t;
  const s = u * t + 0.5 * a * t * t;

  // Compute spatial bounds across [0, tMax]
  let sMin = 0;
  let sMax = 0;
  for (let i = 0; i <= 40; i++) {
    const ti = (tMax * i) / 40;
    const si = u * ti + 0.5 * a * ti * ti;
    if (si < sMin) sMin = si;
    if (si > sMax) sMax = si;
  }
  const span = Math.max(20, sMax - sMin);
  const padL = 56;
  const padR = 56;
  const trackY = height * 0.62;
  const toX = (pos: number) => padL + ((pos - sMin) / span) * (width - padL - padR);

  // Roadway & Distance Ticks
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(padL - 20, trackY);
  ctx.lineTo(width - padR + 20, trackY);
  ctx.stroke();

  for (let i = 0; i <= 5; i++) {
    const pos = sMin + (span * i) / 5;
    const tx = toX(pos);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx, trackY);
    ctx.lineTo(tx, trackY + 12);
    ctx.stroke();
    ctx.fillStyle = p.ink;
    ctx.font = '700 12px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${pos.toFixed(0)}m`, tx, trackY + 28);
  }
  ctx.textAlign = 'left';

  // Strobe position snapshots (every 1s)
  for (let ti = 0; ti < t; ti += 0.8) {
    const si = u * ti + 0.5 * a * ti * ti;
    const sx = toX(si);
    ctx.beginPath();
    ctx.arc(sx, trackY - 22, 5, 0, Math.PI * 2);
    ctx.strokeStyle = p.inkMuted;
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }

  // Moving Car/Cart
  const carX = toX(s);
  const carW = 68;
  const carH = 34;
  drawHatchRect(ctx, carX - carW / 2, trackY - carH - 10, carW, carH, 'solid', p, 6);
  ctx.fillStyle = p.inkInvert;
  ctx.font = '700 12px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`t=${t.toFixed(1)}s`, carX, trackY - carH / 2 - 6);
  ctx.textAlign = 'left';

  // Wheels
  ctx.fillStyle = p.bg;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.6;
  [-20, 20].forEach((dx) => {
    ctx.beginPath();
    ctx.arc(carX + dx, trackY - 7, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  if (showVectors) {
    if (Math.abs(v) > 0.2) {
      const vLen = Math.max(-110, Math.min(110, v * 4.5));
      drawVectorArrow(ctx, carX, trackY - carH - 28, carX + vLen, trackY - carH - 28, p, `v=${v.toFixed(1)}m/s`, 'dashed');
    }
    if (Math.abs(a) > 0.1) {
      const aLen = Math.max(-95, Math.min(95, a * 12));
      drawVectorArrow(ctx, carX, trackY - carH - 58, carX + aLen, trackY - carH - 58, p, `a=${a.toFixed(1)}m/s²`, 'solid');
    }
  }

  drawLegendPill(ctx, 14, 14, 'a Acceleration (Solid)', 'solid', p);
  drawLegendPill(ctx, 14, 46, 'v Velocity (Dashed)', 'dashed', p);

  const vPoints: { x: number; y: number }[] = [];
  const sPoints: { x: number; y: number }[] = [];
  for (let i = 0; i <= 40; i++) {
    const ti = (tMax * i) / 40;
    vPoints.push({ x: ti, y: u + a * ti });
    sPoints.push({ x: ti, y: (u * ti + 0.5 * a * ti * ti) * 0.25 });
  }

  return {
    substitutedFormula: `v = ${u} + (${a})(${t.toFixed(1)}) = ${v.toFixed(1)} m/s  |  s = ${s.toFixed(1)} m`,
    readouts: [
      { symbol: 'v', label: { en: 'Instant Velocity', hi: 'तात्क्षणिक वेग' }, value: v.toFixed(1), unit: 'm/s', accent: 'velocity' },
      { symbol: 's', label: { en: 'Displacement', hi: 'विस्थापन (s)' }, value: s.toFixed(1), unit: 'm', accent: 'momentum' },
      { symbol: 'a', label: { en: 'Acceleration', hi: 'त्वरण (a)' }, value: a.toFixed(1), unit: 'm/s²', accent: 'force' },
      { symbol: 't', label: { en: 'Elapsed Time', hi: 'बीता समय (t)' }, value: t.toFixed(2), unit: 's', accent: 'energy' },
    ],
    graphPoints: vPoints,
    graphSecondPoints: sPoints,
    graphCurrentPoint: { x: t, y: v },
    graphLegend: { primary: 'v(t) Solid', secondary: 's(t)/4 Dashed' },
  };
}

// 3. MECHANICAL PROPERTIES OF SOLIDS (YOUNG'S MODULUS)
function renderSolidsElasticity(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const F_kN = params.F ?? 15;
  const L = params.L ?? 2.5;
  const A_mm2 = params.A ?? 3;
  const Y_11 = params.Y ?? 2.0;

  if (state.t === undefined) state.t = 0;
  if (isPlaying && dt > 0) state.t += dt;

  const F = F_kN * 1000;
  const A = A_mm2 * 1e-6;
  const Y = Y_11 * 1e11;
  const stress = F / A; // Pa
  const stressMPa = stress / 1e6;
  const strain = stress / Y;
  const dL_mm = strain * L * 1000;
  const energyDensity = 0.5 * stress * strain / 1e6; // MJ/m³

  const cx = width * 0.42;
  const ceilingY = 48;

  // Ceiling mount
  drawHatchRect(ctx, cx - 80, ceilingY - 22, 160, 22, 'diagonal', p, 0);

  // Original wire length vs stretched length (exaggerated visually for clarity)
  const baseLenPx = height * 0.34 * (L / 2.5);
  const stretchPx = Math.min(82, dL_mm * 2.8);
  const wireThick = Math.max(3, Math.sqrt(A_mm2) * 2.4);

  // Reference original length bracket
  ctx.save();
  ctx.strokeStyle = p.inkMuted;
  ctx.setLineDash([4, 5]);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(cx + 36, ceilingY);
  ctx.lineTo(cx + 36, ceilingY + baseLenPx);
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.font = '700 12px "IBM Plex Mono", monospace';
  ctx.fillText(`L₀ = ${L} m`, cx + 44, ceilingY + baseLenPx * 0.5);
  ctx.restore();

  // Wire body
  ctx.fillStyle = p.ink;
  ctx.fillRect(cx - wireThick / 2, ceilingY, wireThick, baseLenPx);
  // Stretched segment ΔL (double-bordered hollow extension highlight)
  drawHatchRect(ctx, cx - wireThick / 2 - 2, ceilingY + baseLenPx, wireThick + 4, Math.max(6, stretchPx), 'hollow', p, 0);

  // ΔL Caliper callout
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx + 36, ceilingY + baseLenPx);
  ctx.lineTo(cx + 36, ceilingY + baseLenPx + stretchPx);
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.fillText(`ΔL = ${dL_mm.toFixed(2)} mm`, cx + 44, ceilingY + baseLenPx + Math.max(12, stretchPx / 2 + 4));

  // Hanging Load Weight
  const weightY = ceilingY + baseLenPx + stretchPx;
  const wSize = 46 + F_kN * 0.6;
  drawHatchRect(ctx, cx - wSize / 2, weightY, wSize, 46, 'solid', p, 6);
  ctx.fillStyle = p.inkInvert;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${F_kN} kN`, cx, weightY + 27);
  ctx.textAlign = 'left';

  if (showVectors) {
    drawVectorArrow(ctx, cx, weightY + 46, cx, Math.min(height - 16, weightY + 46 + 44 + F_kN), p, `F=${F_kN}kN`, 'solid');
    drawVectorArrow(ctx, cx - 22, weightY, cx - 22, Math.max(ceilingY + 20, weightY - 58), p, `T=Stress·A`, 'double');
  }

  // Right-side Atomic Spring Lattice Zoom Inset
  const boxX = width * 0.68;
  const boxY = height * 0.22;
  const boxW = width * 0.26;
  const boxH = height * 0.56;
  drawHatchRect(ctx, boxX, boxY, boxW, boxH, 'hollow', p, 8);
  ctx.fillStyle = p.ink;
  ctx.font = '700 11.5px "IBM Plex Mono", monospace';
  ctx.fillText('ATOMIC BOND STRETCH', boxX + 10, boxY + 20);
  const rows = 4;
  const cols = 3;
  const bondStretch = Math.min(14, strain * 1200);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ax = boxX + 26 + c * ((boxW - 52) / (cols - 1));
      const ay = boxY + 42 + r * ((boxH - 85) / (rows - 1) + bondStretch * 0.25);
      if (r < rows - 1) {
        const ny = boxY + 42 + (r + 1) * ((boxH - 85) / (rows - 1) + bondStretch * 0.25);
        ctx.strokeStyle = p.ink;
        ctx.lineWidth = 1.6;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax, ny);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.arc(ax, ay, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = p.ink;
      ctx.fill();
    }
  }

  drawLegendPill(ctx, 14, 14, 'F Load (Solid) · T Restoring (Double)', 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let sMilli = 0; sMilli <= 10; sMilli += 0.5) {
    const st = (sMilli * 1e-3) * Y / 1e6;
    graphPoints.push({ x: sMilli, y: st });
  }

  return {
    substitutedFormula: `Y = (${stressMPa.toFixed(0)} MPa) / (${(strain * 1000).toFixed(2)}×10⁻³) = ${Y_11.toFixed(1)}×10¹¹ Pa`,
    readouts: [
      { symbol: 'ΔL', label: { en: 'Extension', hi: 'लंबाई वृद्धि (ΔL)' }, value: dL_mm.toFixed(2), unit: 'mm', accent: 'force' },
      { symbol: 'σ', label: { en: 'Tensile Stress', hi: 'प्रतिबल (F/A)' }, value: stressMPa.toFixed(0), unit: 'MPa', accent: 'velocity' },
      { symbol: 'ε', label: { en: 'Longitudinal Strain', hi: 'विकृति (ΔL/L)' }, value: (strain * 1000).toFixed(2), unit: '×10⁻³', accent: 'momentum' },
      { symbol: 'u', label: { en: 'Energy Density', hi: 'ऊर्जा घनत्व' }, value: energyDensity.toFixed(2), unit: 'MJ/m³', accent: 'energy' },
    ],
    graphPoints,
    graphCurrentPoint: { x: Math.min(10, strain * 1000), y: stressMPa },
    graphLegend: { primary: `Slope = Y (${Y_11.toFixed(1)}×10¹¹ Pa)` },
  };
}

// 4. MECHANICAL PROPERTIES OF FLUIDS (BERNOULLI & VENTURI TUBE)
function renderFluids(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const v1 = params.v1 ?? 3;
  const ratio = params.ratio ?? 2.2;
  const rho = params.rho ?? 1000;
  const P1_kPa = params.P1 ?? 150;

  const v2 = v1 * ratio;
  const dP_kPa = (0.5 * rho * (v2 * v2 - v1 * v1)) / 1000;
  const P2_kPa = Math.max(5, P1_kPa - dP_kPa);

  if (!state.particles) {
    state.particles = Array.from({ length: 42 }, (_, i) => ({
      x: (i / 42),
      lane: ((i % 5) - 2) * 0.38,
    }));
  }

  const pipeLeft = 44;
  const pipeRight = width - 44;
  const pipeW = pipeRight - pipeLeft;
  const cy = height * 0.68;
  const wideHalfH = height * 0.16;
  const narrowHalfH = Math.max(18, wideHalfH / Math.sqrt(ratio));

  const halfHeightAt = (u: number) => {
    const throatBell = Math.exp(-Math.pow((u - 0.5) / 0.16, 2));
    return wideHalfH - (wideHalfH - narrowHalfH) * throatBell;
  };

  if (isPlaying && dt > 0) {
    for (const pt of state.particles) {
      const hh = halfHeightAt(pt.x);
      const localSpeed = v1 * (wideHalfH / hh);
      pt.x += localSpeed * dt * 0.048;
      if (pt.x > 1) pt.x -= 1;
    }
  }

  // Draw Venturi Pipe Contour (thick B&W outline)
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  for (let i = 0; i <= 80; i++) {
    const u = i / 80;
    const sx = pipeLeft + u * pipeW;
    const sy = cy - halfHeightAt(u);
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i <= 80; i++) {
    const u = i / 80;
    const sx = pipeLeft + u * pipeW;
    const sy = cy + halfHeightAt(u);
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.stroke();

  // Streamline Particles
  for (const pt of state.particles) {
    const sx = pipeLeft + pt.x * pipeW;
    const hh = halfHeightAt(pt.x);
    const sy = cy + pt.lane * hh;
    const isFast = Math.abs(pt.x - 0.5) < 0.16;
    ctx.beginPath();
    ctx.arc(sx, sy, isFast ? 4.5 : 3.8, 0, Math.PI * 2);
    ctx.fillStyle = p.ink;
    ctx.fill();
  }

  // Two Vertical Pressure Manometer Columns (Inlet P1 & Throat P2)
  const drawManometer = (uPos: number, pressKpa: number, lbl: string) => {
    const mx = pipeLeft + uPos * pipeW;
    const topPipeY = cy - halfHeightAt(uPos);
    const tubeH = height * 0.36;
    const tubeW = 24;
    const fillFrac = Math.max(0.06, Math.min(1, pressKpa / 220));
    const fillH = fillFrac * tubeH;

    // Glass tube outline
    ctx.fillStyle = p.bg;
    ctx.fillRect(mx - tubeW / 2, topPipeY - tubeH, tubeW, tubeH);
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2.2;
    ctx.strokeRect(mx - tubeW / 2, topPipeY - tubeH, tubeW, tubeH);

    // Liquid column (diagonal hatch)
    drawHatchRect(ctx, mx - tubeW / 2, topPipeY - fillH, tubeW, fillH, 'diagonal', p, 0);

    ctx.fillStyle = p.ink;
    ctx.font = '700 12.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${lbl}=${pressKpa.toFixed(0)}kPa`, mx, topPipeY - tubeH - 8);
    ctx.textAlign = 'left';
  };

  drawManometer(0.18, P1_kPa, 'P₁');
  drawManometer(0.5, P2_kPa, 'P₂');

  if (showVectors) {
    drawVectorArrow(ctx, pipeLeft + pipeW * 0.12, cy, pipeLeft + pipeW * 0.12 + v1 * 12, cy, p, `v₁=${v1.toFixed(1)}`, 'dashed');
    drawVectorArrow(ctx, pipeLeft + pipeW * 0.46, cy, pipeLeft + pipeW * 0.46 + Math.min(120, v2 * 10), cy, p, `v₂=${v2.toFixed(1)}`, 'solid');
  }

  drawLegendPill(ctx, 14, 14, 'v₂ Throat Speed (Solid) · v₁ Inlet (Dashed)', 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let r = 1.0; r <= 3.55; r += 0.1) {
    const vt = v1 * r;
    const pt = Math.max(0, P1_kPa - (0.5 * rho * (vt * vt - v1 * v1)) / 1000);
    graphPoints.push({ x: r, y: pt });
  }

  return {
    substitutedFormula: `P₂ = ${P1_kPa} − ½(${rho})(${v2.toFixed(1)}² − ${v1}²)/1000 = ${P2_kPa.toFixed(1)} kPa`,
    readouts: [
      { symbol: 'v₂', label: { en: 'Throat Speed', hi: 'सँकरे भाग में वेग' }, value: v2.toFixed(2), unit: 'm/s', accent: 'velocity' },
      { symbol: 'P₂', label: { en: 'Throat Pressure', hi: 'सँकरे भाग में दाब' }, value: P2_kPa.toFixed(1), unit: 'kPa', accent: 'force' },
      { symbol: 'ΔP', label: { en: 'Pressure Drop', hi: 'दाब में कमी (ΔP)' }, value: dP_kPa.toFixed(1), unit: 'kPa', accent: 'energy' },
      { symbol: 'v₂/v₁', label: { en: 'Speedup Ratio', hi: 'वेग अनुपात' }, value: `${ratio.toFixed(1)}×`, unit: '', accent: 'momentum' },
    ],
    graphPoints,
    graphCurrentPoint: { x: ratio, y: P2_kPa },
    graphLegend: { primary: 'P₂ vs Constriction Ratio A₁/A₂' },
  };
}

// 5. THERMAL PROPERTIES OF MATTER (EXPANSION & CONDUCTION)
function renderThermalMatter(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const dT = params.dT ?? 120;
  const L0 = params.L0 ?? 2.0;
  const alpha_e5 = params.alpha ?? 1.7;
  const k = params.k ?? 200;

  if (state.t === undefined) state.t = 0;
  if (isPlaying && dt > 0) state.t += dt;

  const alpha = alpha_e5 * 1e-5;
  const dL_mm = L0 * alpha * dT * 1000;
  const A_rod = 0.002; // 20 cm² standard lab bar
  const H_watts = (k * A_rod * dT) / L0;

  const rodLeft = 72;
  const baseW = width * 0.56 * (L0 / 2.5);
  const clampedBaseW = Math.min(width * 0.62, Math.max(140, baseW));
  const expPx = Math.min(90, dL_mm * 5.2);
  const cy = height * 0.52;
  const rodH = 54;

  // Hot Reservoir (Left — solid black/white block)
  drawHatchRect(ctx, rodLeft - 46, cy - 64, 46, 128, 'solid', p, 4);
  ctx.fillStyle = p.inkInvert;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`HOT`, rodLeft - 23, cy - 8);
  ctx.fillText(`${20 + dT}°C`, rodLeft - 23, cy + 12);
  ctx.textAlign = 'left';

  // Metal Rod Body with progressive hatch density representing temperature gradient
  drawHatchRect(ctx, rodLeft, cy - rodH / 2, clampedBaseW, rodH, 'diagonal', p, 4);
  // Expanded portion ΔL
  drawHatchRect(ctx, rodLeft + clampedBaseW, cy - rodH / 2, Math.max(6, expPx), rodH, 'cross', p, 2);

  // Cold Sink (Right — hollow outlined block)
  const sinkX = rodLeft + clampedBaseW + Math.max(6, expPx);
  drawHatchRect(ctx, sinkX, cy - 64, 46, 128, 'hollow', p, 4);
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`COLD`, sinkX + 23, cy - 8);
  ctx.fillText(`20°C`, sinkX + 23, cy + 12);
  ctx.textAlign = 'left';

  // Animated Heat Pulses traveling Hot → Cold at speed proportional to H
  const pulseSpeed = 0.25 + Math.min(1.6, H_watts / 60);
  for (let i = 0; i < 6; i++) {
    const u = ((state.t * pulseSpeed + i / 6) % 1);
    const px = rodLeft + u * (clampedBaseW + expPx);
    const py = cy + Math.sin(u * Math.PI * 6 + state.t * 5) * 12;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = p.bg;
    ctx.fill();
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2.4;
    ctx.stroke();
  }

  // Callout labels for L₀ and ΔL
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rodLeft, cy + rodH / 2 + 22);
  ctx.lineTo(rodLeft + clampedBaseW, cy + rodH / 2 + 22);
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.fillText(`L₀ = ${L0.toFixed(1)} m`, rodLeft + clampedBaseW / 2 - 40, cy + rodH / 2 + 40);
  ctx.fillText(`+ΔL = ${dL_mm.toFixed(2)} mm`, rodLeft + clampedBaseW, cy - rodH / 2 - 14);

  if (showVectors) {
    drawVectorArrow(ctx, rodLeft + 24, cy - rodH / 2 - 34, rodLeft + 24 + Math.min(140, 45 + H_watts * 1.4), cy - rodH / 2 - 34, p, `H = ${H_watts.toFixed(1)} W`, 'solid');
  }

  drawLegendPill(ctx, 14, 14, 'Heat Current H (Solid) · ΔL Expansion (Cross-Hatch)', 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let i = 0; i <= 20; i++) {
    const xPos = (L0 * i) / 20;
    const temp = 20 + dT * (1 - i / 20);
    graphPoints.push({ x: xPos, y: temp });
  }

  return {
    substitutedFormula: `ΔL = ${L0}×(${alpha_e5}×10⁻⁵)×${dT} = ${dL_mm.toFixed(2)} mm  |  H = ${H_watts.toFixed(1)} W`,
    readouts: [
      { symbol: 'ΔL', label: { en: 'Linear Expansion', hi: 'रेखीय प्रसार (ΔL)' }, value: dL_mm.toFixed(2), unit: 'mm', accent: 'force' },
      { symbol: 'H', label: { en: 'Heat Flow Rate', hi: 'ऊष्मा चालन दर (H)' }, value: H_watts.toFixed(1), unit: 'W', accent: 'energy' },
      { symbol: 'T_hot', label: { en: 'Hot End Temp', hi: 'गर्म सिरे का ताप' }, value: `${20 + dT}`, unit: '°C', accent: 'velocity' },
      { symbol: 'dT/dx', label: { en: 'Temp Gradient', hi: 'ताप प्रवणता' }, value: (dT / L0).toFixed(1), unit: '°C/m', accent: 'momentum' },
    ],
    graphPoints,
    graphCurrentPoint: { x: L0 * 0.5, y: 20 + dT * 0.5 },
    graphLegend: { primary: 'Steady-State T(x) Profile' },
  };
}

// 6. THERMODYNAMICS (FIRST LAW & P-V PISTON)
function renderThermodynamics(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const V = params.V ?? 2.5;
  const T0 = params.T0 ?? 350;
  const gamma = params.gamma ?? 1.4;
  const n = params.n ?? 1.0;

  const R = 8.314;
  const V0 = 2.5; // Reference initial volume in Liters
  // Adiabatic / polytropic state from reference V0, T0
  const Tcur = T0 * Math.pow(V0 / V, gamma - 1);
  const P_kPa = (n * R * Tcur) / V; // since L -> 10^-3 m^3, Pa/1000 = kPa directly!
  const P_iso_kPa = (n * R * T0) / V;
  const dU = gamma > 1.02 ? (n * R * (Tcur - T0)) / (gamma - 1) : 0;
  const work = gamma > 1.02 ? -dU : n * R * T0 * Math.log(V / V0);

  if (!state.mols) {
    state.mols = Array.from({ length: 28 }, (_, i) => ({
      rx: ((i * 37) % 100) / 100,
      ry: ((i * 53) % 100) / 100,
      vx: Math.cos(i * 1.9),
      vy: Math.sin(i * 1.9),
    }));
  }

  const speedScale = Math.sqrt(Tcur / 300) * 0.55;
  if (isPlaying && dt > 0) {
    for (const m of state.mols) {
      m.rx += m.vx * speedScale * dt;
      m.ry += m.vy * speedScale * dt;
      if (m.rx < 0.04) { m.rx = 0.04; m.vx = Math.abs(m.vx); }
      if (m.rx > 0.96) { m.rx = 0.96; m.vx = -Math.abs(m.vx); }
      if (m.ry < 0.05) { m.ry = 0.05; m.vy = Math.abs(m.vy); }
      if (m.ry > 0.95) { m.ry = 0.95; m.vy = -Math.abs(m.vy); }
    }
  }

  // Cylinder on left
  const cylX = width * 0.14;
  const cylW = width * 0.34;
  const cylBottom = height * 0.84;
  const maxCylH = height * 0.62;
  const gasH = (V / 6.0) * maxCylH;
  const pistonY = cylBottom - gasH;

  // Cylinder Walls
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cylX, cylBottom - maxCylH - 20);
  ctx.lineTo(cylX, cylBottom);
  ctx.lineTo(cylX + cylW, cylBottom);
  ctx.lineTo(cylX + cylW, cylBottom - maxCylH - 20);
  ctx.stroke();

  // Gas Molecules inside Chamber
  for (const m of state.mols) {
    const mx = cylX + 8 + m.rx * (cylW - 16);
    const my = pistonY + 8 + m.ry * Math.max(12, gasH - 16);
    ctx.beginPath();
    ctx.arc(mx, my, 4.2, 0, Math.PI * 2);
    ctx.fillStyle = p.ink;
    ctx.fill();
  }

  // Heavy Hatched Piston Head & Rod
  drawHatchRect(ctx, cylX + 3, pistonY - 22, cylW - 6, 22, 'diagonal', p, 2);
  ctx.fillStyle = p.ink;
  ctx.fillRect(cylX + cylW / 2 - 7, cylBottom - maxCylH - 36, 14, Math.max(10, pistonY - 22 - (cylBottom - maxCylH - 36)));

  if (showVectors) {
    const fLen = Math.min(82, Math.max(22, P_kPa * 0.032));
    drawVectorArrow(ctx, cylX + cylW / 2, pistonY + 12, cylX + cylW / 2, pistonY - 24 - fLen, p, `P·A (${P_kPa.toFixed(0)}kPa)`, 'solid');
  }

  // Right-side Thermometer & Energy Readout Panel
  const panelX = width * 0.56;
  const panelW = width * 0.38;
  drawHatchRect(ctx, panelX, height * 0.16, panelW, height * 0.68, 'hollow', p, 10);
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.fillText(gamma <= 1.02 ? 'PROCESS: ISOTHERMAL (ΔU = 0)' : `PROCESS: ADIABATIC (γ = ${gamma.toFixed(2)})`, panelX + 16, height * 0.16 + 28);
  ctx.font = '700 14px "IBM Plex Mono", monospace';
  ctx.fillText(`Volume V  = ${V.toFixed(1)} L`, panelX + 16, height * 0.16 + 64);
  ctx.fillText(`Temp   T  = ${Tcur.toFixed(0)} K`, panelX + 16, height * 0.16 + 92);
  ctx.fillText(`Press  P  = ${P_kPa.toFixed(0)} kPa`, panelX + 16, height * 0.16 + 120);
  ctx.fillText(`Work   W  = ${work.toFixed(0)} J`, panelX + 16, height * 0.16 + 148);
  ctx.fillText(`Int.E ΔU  = ${dU.toFixed(0)} J`, panelX + 16, height * 0.16 + 176);

  // Temperature bar inside panel
  const tBarX = panelX + 16;
  const tBarY = height * 0.16 + 200;
  const tBarW = panelW - 32;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(tBarX, tBarY, tBarW, 20);
  const tFrac = Math.max(0.05, Math.min(1, Tcur / 900));
  drawHatchRect(ctx, tBarX, tBarY, tBarW * tFrac, 20, 'solid', p, 0);

  drawLegendPill(ctx, 14, 14, 'Gas Pressure Force P·A (Solid)', 'solid', p);

  const adiabPts: { x: number; y: number }[] = [];
  const isoPts: { x: number; y: number }[] = [];
  for (let vv = 1.0; vv <= 6.05; vv += 0.2) {
    const tA = T0 * Math.pow(V0 / vv, gamma - 1);
    adiabPts.push({ x: vv, y: (n * R * tA) / vv });
    isoPts.push({ x: vv, y: (n * R * T0) / vv });
  }

  return {
    substitutedFormula: `P = nRT/V = ${P_kPa.toFixed(0)} kPa  |  T = ${Tcur.toFixed(0)} K  |  W = ${work.toFixed(0)} J`,
    readouts: [
      { symbol: 'P', label: { en: 'Gas Pressure', hi: 'गैस दाब (P)' }, value: P_kPa.toFixed(0), unit: 'kPa', accent: 'force' },
      { symbol: 'T', label: { en: 'Gas Temperature', hi: 'गैस का ताप (T)' }, value: Tcur.toFixed(0), unit: 'K', accent: 'energy' },
      { symbol: 'W', label: { en: 'Work Done', hi: 'किया गया कार्य (W)' }, value: work.toFixed(0), unit: 'J', accent: 'momentum' },
      { symbol: 'P_iso', label: { en: 'Isothermal Ref P', hi: 'समतापी संदर्भ दाब' }, value: P_iso_kPa.toFixed(0), unit: 'kPa', accent: 'velocity' },
    ],
    graphPoints: adiabPts,
    graphSecondPoints: isoPts,
    graphCurrentPoint: { x: V, y: P_kPa },
    graphLegend: { primary: `Adiabatic (γ=${gamma.toFixed(2)}) Solid`, secondary: 'Isothermal Dashed' },
  };
}

// 7. KINETIC THEORY OF GASES (BOUNCING MOLECULES & MAXWELL-BOLTZMANN)
function renderKineticTheory(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const T = params.T ?? 300;
  const M_g = params.M ?? 28;
  const V = params.V ?? 12;
  const N = Math.round(params.N ?? 35);

  const R = 8.314;
  const M_kg = M_g / 1000;
  const vRms = Math.sqrt((3 * R * T) / M_kg);
  const vAvg = Math.sqrt((8 * R * T) / (Math.PI * M_kg));
  const P_kPa = ((N / 35) * R * T) / V;

  if (!state.particles || state.particles.length !== N) {
    state.particles = Array.from({ length: N }, (_, i) => {
      const ang = (i * 2.39996) % (Math.PI * 2);
      const speedMult = 0.5 + ((i * 7) % 10) * 0.1;
      return {
        x: 0.1 + ((i * 19) % 80) / 100,
        y: 0.1 + ((i * 31) % 80) / 100,
        vx: Math.cos(ang) * speedMult,
        vy: Math.sin(ang) * speedMult,
      };
    });
  }

  const boxW = Math.min(width - 90, 210 + V * 15);
  const boxH = height * 0.68;
  const boxX = (width - boxW) / 2;
  const boxY = height * 0.2;

  const simVelScale = Math.min(2.2, vRms / 480);
  if (isPlaying && dt > 0) {
    for (const pt of state.particles) {
      pt.x += pt.vx * simVelScale * dt * 0.55;
      pt.y += pt.vy * simVelScale * dt * 0.55;
      if (pt.x < 0.03) { pt.x = 0.03; pt.vx = Math.abs(pt.vx); }
      if (pt.x > 0.97) { pt.x = 0.97; pt.vx = -Math.abs(pt.vx); }
      if (pt.y < 0.04) { pt.y = 0.04; pt.vy = Math.abs(pt.vy); }
      if (pt.y > 0.96) { pt.y = 0.96; pt.vy = -Math.abs(pt.vy); }
    }
  }

  // Thick Chamber Box
  drawHatchRect(ctx, boxX, boxY, boxW, boxH, 'hollow', p, 6);

  // Molecules
  const rad = Math.max(4, Math.min(8, 3.5 + Math.sqrt(M_g) * 0.65));
  state.particles.forEach((pt: any, idx: number) => {
    const sx = boxX + pt.x * boxW;
    const sy = boxY + pt.y * boxH;
    ctx.beginPath();
    ctx.arc(sx, sy, rad, 0, Math.PI * 2);
    if (idx === 0) {
      ctx.fillStyle = p.bg;
      ctx.fill();
      ctx.strokeStyle = p.ink;
      ctx.lineWidth = 3;
      ctx.stroke();
      if (showVectors) {
        drawVectorArrow(ctx, sx, sy, sx + pt.vx * simVelScale * 38, sy + pt.vy * simVelScale * 38, p, `v_rms`, 'solid');
      }
    } else {
      ctx.fillStyle = p.ink;
      ctx.fill();
    }
  });

  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.fillText(`CHAMBER V = ${V} L  ·  T = ${T} K  ·  M = ${M_g} g/mol`, boxX, boxY - 12);
  drawLegendPill(ctx, 14, 14, 'Tracked Molecule Velocity (Solid)', 'solid', p);

  // Maxwell-Boltzmann speed distribution
  const graphPoints: { x: number; y: number }[] = [];
  const maxV = Math.max(1500, vRms * 2.1);
  const kT_m = (R * T) / M_kg;
  for (let i = 0; i <= 45; i++) {
    const vv = (maxV * i) / 45;
    const prob = Math.pow(vv / vRms, 2) * Math.exp(-(vv * vv) / (2 * kT_m)) * 4.5;
    graphPoints.push({ x: Math.round(vv), y: prob });
  }
  const peakAtRms = Math.exp(-(vRms * vRms) / (2 * kT_m)) * 4.5;

  return {
    substitutedFormula: `v_rms = √(3 × 8.314 × ${T} / ${(M_kg).toFixed(3)}) = ${vRms.toFixed(0)} m/s`,
    readouts: [
      { symbol: 'v_rms', label: { en: 'RMS Speed', hi: 'वर्ग माध्य मूल चाल' }, value: vRms.toFixed(0), unit: 'm/s', accent: 'velocity' },
      { symbol: 'v_avg', label: { en: 'Average Speed', hi: 'औसत चाल' }, value: vAvg.toFixed(0), unit: 'm/s', accent: 'momentum' },
      { symbol: 'P', label: { en: 'Wall Pressure', hi: 'दीवार पर दाब (P)' }, value: P_kPa.toFixed(0), unit: 'kPa', accent: 'force' },
      { symbol: 'K_mol', label: { en: 'Molar KE (3/2 RT)', hi: 'मोलर गतिज ऊर्जा' }, value: ((1.5 * R * T) / 1000).toFixed(2), unit: 'kJ/mol', accent: 'energy' },
    ],
    graphPoints,
    graphCurrentPoint: { x: Math.round(vRms), y: peakAtRms },
    graphLegend: { primary: 'Maxwell Speed Distribution f(v)' },
  };
}

// 8. CAPACITANCE & DIELECTRICS
function renderCapacitance(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, showVectors } = rc;
  const V = params.V ?? 12;
  const d_mm = params.d ?? 4;
  const A_cm2 = params.A ?? 200;
  const kappa = params.kappa ?? 1;

  const eps0 = 8.854e-12;
  const C_F = (kappa * eps0 * (A_cm2 * 1e-4)) / (d_mm * 1e-3);
  const C_pF = C_F * 1e12;
  const Q_nC = C_F * V * 1e9;
  const E_kVm = (V / (d_mm * 1e-3)) / 1000;
  const U_nJ = 0.5 * C_F * V * V * 1e9;

  const cx = width * 0.5;
  const cy = height * 0.52;
  const plateW = 120 + (A_cm2 / 400) * 170;
  const plateH = 16;
  const gapPx = 36 + d_mm * 16;
  const topY = cy - gapPx / 2 - plateH;
  const botY = cy + gapPx / 2;

  // Dielectric slab if kappa > 1
  if (kappa > 1.05) {
    drawHatchRect(ctx, cx - plateW / 2 + 8, topY + plateH + 4, plateW - 16, gapPx - 8, 'diagonal', p, 4);
    ctx.fillStyle = p.bg;
    ctx.fillRect(cx - 64, cy - 12, 128, 24);
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(cx - 64, cy - 12, 128, 24);
    ctx.fillStyle = p.ink;
    ctx.font = '700 12.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`DIELECTRIC κ=${kappa}`, cx, cy + 4);
    ctx.textAlign = 'left';
  }

  // Top (+) Plate & Bottom (−) Plate
  drawHatchRect(ctx, cx - plateW / 2, topY, plateW, plateH, 'solid', p, 3);
  drawHatchRect(ctx, cx - plateW / 2, botY, plateW, plateH, 'hollow', p, 3);

  // Charge markers (+ on top, − on bottom)
  const chargeCount = Math.min(12, Math.max(3, Math.round(Q_nC * 1.4)));
  ctx.font = '700 14px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  for (let i = 0; i < chargeCount; i++) {
    const xq = cx - plateW / 2 + 18 + (i * (plateW - 36)) / Math.max(1, chargeCount - 1);
    ctx.fillStyle = p.inkInvert;
    ctx.fillText('+', xq, topY + 13);
    ctx.fillStyle = p.ink;
    ctx.fillText('−', xq, botY + 13);
  }
  ctx.textAlign = 'left';

  // Electric Field Lines Top → Bottom
  if (showVectors) {
    const lines = 5;
    for (let i = 0; i < lines; i++) {
      const xl = cx - plateW * 0.36 + (i * plateW * 0.72) / (lines - 1);
      drawVectorArrow(ctx, xl, topY + plateH + 6, xl, botY - 6, p, i === lines - 1 ? `E=${E_kVm.toFixed(1)}kV/m` : undefined, 'dashed', 2);
    }
  }

  // Battery wire loop on left
  const wireX = cx - plateW / 2 - 64;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(cx - plateW / 2, topY + plateH / 2);
  ctx.lineTo(wireX, topY + plateH / 2);
  ctx.lineTo(wireX, cy - 14);
  ctx.moveTo(wireX, cy + 14);
  ctx.lineTo(wireX, botY + plateH / 2);
  ctx.lineTo(cx - plateW / 2, botY + plateH / 2);
  ctx.stroke();
  // Battery symbol
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(wireX - 18, cy - 14);
  ctx.lineTo(wireX + 18, cy - 14);
  ctx.stroke();
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(wireX - 10, cy + 14);
  ctx.lineTo(wireX + 10, cy + 14);
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.fillText(`${V}V`, wireX - 42, cy + 5);

  drawLegendPill(ctx, 14, 14, 'E Field (Dashed) · Dielectric Slab (Hatched)', 'dashed', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let dd = 1; dd <= 10.1; dd += 0.5) {
    graphPoints.push({ x: dd, y: ((kappa * eps0 * (A_cm2 * 1e-4)) / (dd * 1e-3)) * 1e12 });
  }

  return {
    substitutedFormula: `C = ${kappa}·ε₀·(${A_cm2}cm²)/(${d_mm}mm) = ${C_pF.toFixed(1)} pF  |  U = ${U_nJ.toFixed(1)} nJ`,
    readouts: [
      { symbol: 'C', label: { en: 'Capacitance', hi: 'धारिता (C)' }, value: C_pF.toFixed(1), unit: 'pF', accent: 'momentum' },
      { symbol: 'Q', label: { en: 'Stored Charge', hi: 'संचित आवेश (Q)' }, value: Q_nC.toFixed(2), unit: 'nC', accent: 'velocity' },
      { symbol: 'U', label: { en: 'Stored Energy', hi: 'संचित ऊर्जा (U)' }, value: U_nJ.toFixed(1), unit: 'nJ', accent: 'energy' },
      { symbol: 'E', label: { en: 'Electric Field', hi: 'विद्युत क्षेत्र (E)' }, value: E_kVm.toFixed(1), unit: 'kV/m', accent: 'force' },
    ],
    graphPoints,
    graphCurrentPoint: { x: d_mm, y: C_pF },
    graphLegend: { primary: 'Capacitance C(d) ∝ 1/d' },
  };
}

// 9. MAGNETISM & MATTER (BAR MAGNET DIPOLE TORQUE)
function renderMagnetismMatter(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const M = params.M ?? 5;
  const B = params.B ?? 0.8;
  const theta0 = params.theta0 ?? 60;

  const initKey = `${M}_${B}_${theta0}`;
  if (state.initKey !== initKey || state.theta === undefined) {
    state.initKey = initKey;
    state.theta = (theta0 * Math.PI) / 180;
    state.omega = 0;
  }

  const I_mag = 0.8;
  if (isPlaying && dt > 0) {
    const alpha = (-M * B * Math.sin(state.theta) - 0.12 * state.omega) / I_mag;
    state.omega += alpha * dt;
    state.theta += state.omega * dt;
  }

  const thetaDeg = ((state.theta * 180) / Math.PI);
  const tau = M * B * Math.sin(state.theta);
  const U = -M * B * Math.cos(state.theta);
  const T_osc = 2 * Math.PI * Math.sqrt(I_mag / (M * B));

  // Uniform horizontal B-field lines across background
  ctx.save();
  ctx.strokeStyle = p.inkMuted;
  ctx.setLineDash([7, 6]);
  ctx.lineWidth = 1.6;
  for (let row = 1; row <= 5; row++) {
    const y = (height * row) / 6;
    ctx.beginPath();
    ctx.moveTo(36, y);
    ctx.lineTo(width - 36, y);
    ctx.stroke();
    // Arrow tip on right
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(width - 46, y - 5);
    ctx.lineTo(width - 36, y);
    ctx.lineTo(width - 46, y + 5);
    ctx.stroke();
    ctx.setLineDash([7, 6]);
  }
  ctx.restore();

  const cx = width * 0.5;
  const cy = height * 0.52;
  const halfLen = 96;

  // Bar Magnet rotated by -theta (so +theta is upward from horizontal B)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-state.theta);
  // South pole (left, hollow)
  drawHatchRect(ctx, -halfLen, -20, halfLen, 40, 'hollow', p, 4);
  // North pole (right, solid)
  drawHatchRect(ctx, 0, -20, halfLen, 40, 'solid', p, 4);
  ctx.font = '700 16px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = p.ink;
  ctx.fillText('S', -halfLen / 2, 6);
  ctx.fillStyle = p.inkInvert;
  ctx.fillText('N', halfLen / 2, 6);
  ctx.textAlign = 'left';
  ctx.restore();

  // Center pivot
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fillStyle = p.bg;
  ctx.fill();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.stroke();

  if (showVectors) {
    const nx = cx + Math.cos(state.theta) * halfLen;
    const ny = cy - Math.sin(state.theta) * halfLen;
    const sx = cx - Math.cos(state.theta) * halfLen;
    const sy = cy + Math.sin(state.theta) * halfLen;
    const fLen = Math.min(82, 24 + M * B * 8);
    drawVectorArrow(ctx, nx, ny, nx + fLen, ny, p, `+mB`, 'solid');
    drawVectorArrow(ctx, sx, sy, sx - fLen, sy, p, `−mB`, 'solid');
    drawVectorArrow(ctx, cx, cy, nx, ny, p, `M=${M}`, 'double');
  }

  drawLegendPill(ctx, 14, 14, `External B = ${B} T (→) · Dipole M (Double)`, 'double', p);

  const tauPts: { x: number; y: number }[] = [];
  const uPts: { x: number; y: number }[] = [];
  for (let d = 0; d <= 180; d += 6) {
    const r = (d * Math.PI) / 180;
    tauPts.push({ x: d, y: M * B * Math.sin(r) });
    uPts.push({ x: d, y: -M * B * Math.cos(r) });
  }

  return {
    substitutedFormula: `τ = (${M})(${B})·sin(${Math.abs(thetaDeg).toFixed(0)}°) = ${Math.abs(tau).toFixed(2)} N·m  |  U = ${U.toFixed(2)} J`,
    readouts: [
      { symbol: 'τ', label: { en: 'Restoring Torque', hi: 'बल आघूर्ण (τ)' }, value: tau.toFixed(2), unit: 'N·m', accent: 'force' },
      { symbol: 'U', label: { en: 'Potential Energy', hi: 'स्थितिज ऊर्जा (U)' }, value: U.toFixed(2), unit: 'J', accent: 'energy' },
      { symbol: 'θ', label: { en: 'Live Angle', hi: 'वर्तमान कोण (θ)' }, value: thetaDeg.toFixed(1), unit: '°', accent: 'velocity' },
      { symbol: 'T', label: { en: 'Small-Angle Period', hi: 'दोलन आवर्तकाल' }, value: T_osc.toFixed(2), unit: 's', accent: 'momentum' },
    ],
    graphPoints: tauPts,
    graphSecondPoints: uPts,
    graphCurrentPoint: { x: Math.min(180, Math.abs(thetaDeg)), y: Math.abs(tau) },
    graphLegend: { primary: 'Torque τ(θ) Solid', secondary: 'Energy U(θ) Dashed' },
  };
}

// 10. EMI 2D FALLBACK (FARADAY GENERATOR + GALVANOMETER)
function renderEMI2D(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const N = params.N ?? 20;
  const B = params.B ?? 0.8;
  const A = params.A ?? 0.4;
  const omega = params.omega ?? 2.5;

  if (state.t === undefined) {
    state.t = 0;
    state.histE = [];
    state.histPhi = [];
  }
  if (isPlaying && dt > 0) state.t += dt;

  const angle = omega * state.t;
  const flux = B * A * Math.cos(angle);
  const emfMax = N * B * A * omega;
  const emf = emfMax * Math.sin(angle);

  if (isPlaying && dt > 0) {
    if (state.histE.length === 0 || state.t - state.histE[state.histE.length - 1].x >= 0.04) {
      state.histE.push({ x: state.t, y: emf });
      state.histPhi.push({ x: state.t, y: flux * N });
      if (state.histE.length > 110) {
        state.histE.shift();
        state.histPhi.shift();
      }
    }
  }

  // N and S Magnet Poles
  const cx = width * 0.36;
  const cy = height * 0.54;
  drawHatchRect(ctx, cx - 155, cy - 70, 48, 140, 'solid', p, 4);
  drawHatchRect(ctx, cx + 107, cy - 70, 48, 140, 'hollow', p, 4);
  ctx.font = '700 20px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = p.inkInvert;
  ctx.fillText('N', cx - 131, cy + 7);
  ctx.fillStyle = p.ink;
  ctx.fillText('S', cx + 131, cy + 7);
  ctx.textAlign = 'left';

  // Field lines N -> S
  ctx.save();
  ctx.strokeStyle = p.inkMuted;
  ctx.setLineDash([5, 5]);
  for (let dy = -48; dy <= 48; dy += 24) {
    ctx.beginPath();
    ctx.moveTo(cx - 105, cy + dy);
    ctx.lineTo(cx + 105, cy + dy);
    ctx.stroke();
  }
  ctx.restore();

  // Rotating Coil Edge View
  const coilR = 66;
  const x1 = cx + Math.cos(angle) * coilR;
  const y1 = cy - Math.sin(angle) * coilR;
  const x2 = cx - Math.cos(angle) * coilR;
  const y2 = cy + Math.sin(angle) * coilR;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x1, y1, 8, 0, Math.PI * 2);
  ctx.fillStyle = p.ink;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x2, y2, 8, 0, Math.PI * 2);
  ctx.fillStyle = p.bg;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.stroke();

  if (showVectors) {
    // Area normal vector perpendicular to coil
    const nx = -Math.sin(angle);
    const ny = -Math.cos(angle);
    drawVectorArrow(ctx, cx, cy, cx + nx * 64, cy + ny * 64, p, `A_n`, 'double');
  }

  // Galvanometer Dial on Right
  const gx = width * 0.76;
  const gy = height * 0.56;
  const gr = 74;
  ctx.beginPath();
  ctx.arc(gx, gy, gr, Math.PI, 0);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(gx - gr, gy);
  ctx.lineTo(gx + gr, gy);
  ctx.stroke();
  const needleAng = -Math.PI / 2 + (emf / Math.max(1, emfMax)) * (Math.PI * 0.42);
  drawVectorArrow(ctx, gx, gy, gx + Math.cos(needleAng) * (gr - 10), gy + Math.sin(needleAng) * (gr - 10), p, `${emf.toFixed(1)}V`, 'solid', 3);
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GALVANOMETER (ε)', gx, gy + 24);
  ctx.textAlign = 'left';

  drawLegendPill(ctx, 14, 14, 'ε = −N·dΦ/dt (90° ahead of Flux Φ)', 'solid', p);

  return {
    substitutedFormula: `ε = (${N})(${B})(${A})(${omega})·sin(${((angle * 180) / Math.PI % 360).toFixed(0)}°) = ${emf.toFixed(2)} V`,
    readouts: [
      { symbol: 'ε', label: { en: 'Live Induced EMF', hi: 'प्रेरित वि.वा.ब. (ε)' }, value: emf.toFixed(2), unit: 'V', accent: 'force' },
      { symbol: 'ε₀', label: { en: 'Peak EMF (NBAω)', hi: 'शिखर वि.वा.ब.' }, value: emfMax.toFixed(2), unit: 'V', accent: 'energy' },
      { symbol: 'Φ', label: { en: 'Magnetic Flux', hi: 'चुंबकीय फ्लक्स (Φ)' }, value: flux.toFixed(3), unit: 'Wb', accent: 'velocity' },
      { symbol: 'f', label: { en: 'AC Frequency', hi: 'AC आवृत्ति' }, value: (omega / (2 * Math.PI)).toFixed(2), unit: 'Hz', accent: 'momentum' },
    ],
    graphPoints: state.histE.length ? state.histE : [{ x: 0, y: 0 }],
    graphSecondPoints: state.histPhi.length ? state.histPhi : [{ x: 0, y: N * B * A }],
    graphLegend: { primary: 'EMF ε(t) Solid', secondary: 'Total Flux NΦ(t) Dashed' },
  };
}

// 11. ALTERNATING CURRENT (SERIES LCR RESONANCE)
function renderACCircuits(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const f = params.f ?? 80;
  const R = params.R ?? 30;
  const L = (params.L ?? 100) * 1e-3;
  const C = (params.C ?? 40) * 1e-6;
  const Vrms = 120;

  if (state.t === undefined) state.t = 0;
  if (isPlaying && dt > 0) state.t += dt;

  const w = 2 * Math.PI * f;
  const XL = w * L;
  const XC = 1 / (w * C);
  const Z = Math.sqrt(R * R + Math.pow(XL - XC, 2));
  const Irms = Vrms / Z;
  const phiRad = Math.atan2(XL - XC, R);
  const phiDeg = (phiRad * 180) / Math.PI;
  const cosPhi = R / Z;
  const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));

  // Left: Rotating Phasor Diagram
  const pcx = width * 0.3;
  const pcy = height * 0.54;
  const scale = 0.85;
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.4;
  ctx.setLineDash([4, 5]);
  ctx.beginPath();
  ctx.arc(pcx, pcy, 98, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  const vrLen = Math.min(95, R * scale);
  const vlLen = Math.min(95, XL * scale);
  const vcLen = Math.min(95, XC * scale);

  if (showVectors) {
    drawVectorArrow(ctx, pcx, pcy, pcx + vrLen, pcy, p, `R=${R}Ω`, 'dashed');
    drawVectorArrow(ctx, pcx, pcy, pcx, pcy - vlLen, p, `X_L=${XL.toFixed(0)}Ω`, 'dotted');
    drawVectorArrow(ctx, pcx, pcy, pcx, pcy + vcLen, p, `X_C=${XC.toFixed(0)}Ω`, 'dotted');
    drawVectorArrow(ctx, pcx, pcy, pcx + vrLen, pcy - (vlLen - vcLen), p, `Z=${Z.toFixed(0)}Ω`, 'solid', 3.4);
  }

  // Right: Live V(t) & I(t) Dual Waveform Oscilloscope
  const ox = width * 0.55;
  const ow = width * 0.4;
  const oy = height * 0.54;
  const oh = height * 0.28;
  drawHatchRect(ctx, ox, oy - oh - 22, ow, oh * 2 + 44, 'hollow', p, 8);
  ctx.strokeStyle = p.axis;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(ox + 10, oy);
  ctx.lineTo(ox + ow - 10, oy);
  ctx.stroke();

  // Voltage V(t) Solid
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 80; i++) {
    const u = i / 80;
    const px = ox + 10 + u * (ow - 20);
    const py = oy - Math.sin(u * Math.PI * 4 - state.t * 4) * (oh * 0.85);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Current I(t) Dashed (phase shifted by -phiRad)
  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.4;
  ctx.setLineDash([7, 5]);
  ctx.beginPath();
  const iAmp = Math.min(oh * 0.85, (Irms / 5) * oh * 0.85);
  for (let i = 0; i <= 80; i++) {
    const u = i / 80;
    const px = ox + 10 + u * (ow - 20);
    const py = oy - Math.sin(u * Math.PI * 4 - state.t * 4 - phiRad) * iAmp;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = p.ink;
  ctx.font = '700 12px "IBM Plex Mono", monospace';
  ctx.fillText(`V(t) Solid · I(t) Dashed · φ=${phiDeg.toFixed(1)}°`, ox + 12, oy - oh - 4);
  drawLegendPill(ctx, 14, 14, `Resonance f₀ = ${f0.toFixed(1)} Hz`, 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let ff = 20; ff <= 200; ff += 4) {
    const ww = 2 * Math.PI * ff;
    const zz = Math.sqrt(R * R + Math.pow(ww * L - 1 / (ww * C), 2));
    graphPoints.push({ x: ff, y: Vrms / zz });
  }

  return {
    substitutedFormula: `Z = √(${R}² + (${XL.toFixed(1)} − ${XC.toFixed(1)})²) = ${Z.toFixed(1)} Ω  |  f₀ = ${f0.toFixed(1)} Hz`,
    readouts: [
      { symbol: 'Z', label: { en: 'Impedance', hi: 'प्रतिबाधा (Z)' }, value: Z.toFixed(1), unit: 'Ω', accent: 'force' },
      { symbol: 'I_rms', label: { en: 'RMS Current', hi: 'RMS धारा' }, value: Irms.toFixed(2), unit: 'A', accent: 'velocity' },
      { symbol: 'f₀', label: { en: 'Resonant Freq', hi: 'अनुनाद आवृत्ति (f₀)' }, value: f0.toFixed(1), unit: 'Hz', accent: 'momentum' },
      { symbol: 'cosφ', label: { en: 'Power Factor', hi: 'शक्ति गुणांक' }, value: cosPhi.toFixed(2), unit: '', accent: 'energy' },
    ],
    graphPoints,
    graphCurrentPoint: { x: f, y: Irms },
    graphLegend: { primary: 'Resonance Peak I_rms(f)' },
  };
}

// 12. EM WAVES 2D DIAGRAM FALLBACK
function renderEMWaves2D(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const E0 = params.E0 ?? 150;
  const lambdaNm = params.lambda ?? 550;
  const nRef = params.nRef ?? 1.0;

  if (state.t === undefined) state.t = 0;
  if (isPlaying && dt > 0) state.t += dt;

  const c = 3e8;
  const v = c / nRef;
  const B0_nT = (E0 / v) * 1e9;
  const freqTHz = (c / (lambdaNm * 1e-9)) / 1e12;
  const lambdaMed = lambdaNm / nRef;

  const cy = height * 0.54;
  const startX = 48;
  const spanX = width - 96;
  const ampPx = (E0 / 300) * (height * 0.28);
  const kVis = (2 * Math.PI * 2.5) / (lambdaMed / 550);

  // Propagation Axis X
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(startX, cy);
  ctx.lineTo(startX + spanX, cy);
  ctx.stroke();

  // E-field vertical wave (Solid)
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  for (let i = 0; i <= 120; i++) {
    const u = i / 120;
    const x = startX + u * spanX;
    const y = cy - Math.sin(u * kVis - state.t * 4) * ampPx;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    if (i % 6 === 0) {
      ctx.moveTo(x, cy);
      ctx.lineTo(x, y);
      ctx.moveTo(x, y);
    }
  }
  ctx.stroke();

  // B-field oblique 3D-projected horizontal wave (Dashed)
  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.4;
  ctx.setLineDash([7, 5]);
  ctx.beginPath();
  for (let i = 0; i <= 120; i++) {
    const u = i / 120;
    const val = Math.sin(u * kVis - state.t * 4) * ampPx * 0.65;
    const x = startX + u * spanX - val * 0.55;
    const y = cy + val * 0.45;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  drawLegendPill(ctx, 14, 14, 'E-Field Vertical (Solid) · B-Field Transverse (Dashed)', 'solid', p);

  const ePts: { x: number; y: number }[] = [];
  const bPts: { x: number; y: number }[] = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60;
    const s = Math.sin(u * kVis - state.t * 4);
    ePts.push({ x: Number((u * 3).toFixed(2)), y: E0 * s });
    bPts.push({ x: Number((u * 3).toFixed(2)), y: E0 * 0.65 * s });
  }

  return {
    substitutedFormula: `v = c/n = ${(v / 1e8).toFixed(2)}×10⁸ m/s  |  B₀ = E₀/v = ${B0_nT.toFixed(0)} nT`,
    readouts: [
      { symbol: 'v', label: { en: 'Wave Speed (c/n)', hi: 'तरंग वेग (c/n)' }, value: (v / 1e8).toFixed(2), unit: '×10⁸ m/s', accent: 'velocity' },
      { symbol: 'B₀', label: { en: 'Magnetic Amp', hi: 'चुंबकीय आयाम (B₀)' }, value: B0_nT.toFixed(0), unit: 'nT', accent: 'force' },
      { symbol: 'λ_m', label: { en: 'Medium Wavelength', hi: 'माध्यम में तरंगदैर्घ्य' }, value: lambdaMed.toFixed(0), unit: 'nm', accent: 'momentum' },
      { symbol: 'f', label: { en: 'Frequency', hi: 'आवृत्ति (f)' }, value: freqTHz.toFixed(0), unit: 'THz', accent: 'energy' },
    ],
    graphPoints: ePts,
    graphSecondPoints: bPts,
    graphLegend: { primary: 'E_y(x) Solid', secondary: 'B_z(x) Dashed (In-Phase)' },
  };
}

// 13. WAVE OPTICS (YOUNG'S DOUBLE SLIT INTERFERENCE — YDSE)
function renderWaveOptics(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const lambdaNm = params.lambda ?? 550;
  const d_mm = params.d ?? 0.5;
  const D = params.D ?? 1.5;

  if (state.t === undefined) state.t = 0;
  if (isPlaying && dt > 0) state.t += dt;

  const beta_mm = ((lambdaNm * 1e-9 * D) / (d_mm * 1e-3)) * 1000;

  const barrierX = width * 0.24;
  const screenX = width * 0.78;
  const cy = height * 0.52;
  const slitSepPx = Math.max(26, d_mm * 52);
  const s1y = cy - slitSepPx / 2;
  const s2y = cy + slitSepPx / 2;

  // Barrier Wall with 2 slits S1 & S2
  ctx.fillStyle = p.ink;
  ctx.fillRect(barrierX - 5, 24, 10, s1y - 32);
  ctx.fillRect(barrierX - 5, s1y + 8, 10, slitSepPx - 16);
  ctx.fillRect(barrierX - 5, s2y + 8, 10, height - 24 - (s2y + 8));

  // Expanding Semi-Circular Wavefronts from S1 and S2
  const wavePx = Math.max(16, (lambdaNm / 550) * 28);
  const phaseShift = (state.t * 36) % wavePx;
  ctx.save();
  ctx.beginPath();
  ctx.rect(barrierX, 20, screenX - barrierX, height - 40);
  ctx.clip();
  for (let r = phaseShift; r < screenX - barrierX + 60; r += wavePx) {
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(barrierX, s1y, r, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(barrierX, s2y, r, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();

  // Observation Screen showing High-Contrast B&W Interference Fringes
  const screenW = 36;
  const screenH = height - 64;
  const screenTop = 32;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(screenX, screenTop, screenW, screenH);

  const pxPerMm = 14;
  for (let py = 0; py < screenH; py += 2) {
    const yMm = (py - screenH / 2) / pxPerMm;
    const phi = (2 * Math.PI * yMm) / Math.max(0.2, beta_mm);
    const intensity = Math.pow(Math.cos(phi / 2), 2);
    // Crisp high-contrast monochrome grayscale stripes
    const shade = p.bg === '#000000'
      ? Math.round(intensity * 255)
      : Math.round((1 - intensity) * 255);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(screenX + 1, screenTop + py, screenW - 2, 2);
  }

  // Intensity curve drawn right next to screen
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  for (let py = 0; py <= screenH; py += 3) {
    const yMm = (py - screenH / 2) / pxPerMm;
    const phi = (2 * Math.PI * yMm) / Math.max(0.2, beta_mm);
    const intensity = Math.pow(Math.cos(phi / 2), 2);
    const gx = screenX + screenW + 8 + intensity * 54;
    if (py === 0) ctx.moveTo(gx, screenTop + py);
    else ctx.lineTo(gx, screenTop + py);
  }
  ctx.stroke();

  ctx.fillStyle = p.ink;
  ctx.font = '700 12px "IBM Plex Mono", monospace';
  ctx.fillText('S₁', barrierX - 28, s1y + 4);
  ctx.fillText('S₂', barrierX - 28, s2y + 4);
  ctx.fillText(`β=${beta_mm.toFixed(2)}mm`, screenX - 10, 22);

  drawLegendPill(ctx, 14, 14, 'S₁ Crests (Solid) · S₂ Crests (Dashed)', 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let ymm = -8; ymm <= 8; ymm += 0.25) {
    const phi = (2 * Math.PI * ymm) / Math.max(0.2, beta_mm);
    graphPoints.push({ x: ymm, y: 4 * Math.pow(Math.cos(phi / 2), 2) });
  }

  return {
    substitutedFormula: `β = (${lambdaNm}nm × ${D}m) / (${d_mm}mm) = ${beta_mm.toFixed(2)} mm`,
    readouts: [
      { symbol: 'β', label: { en: 'Fringe Width', hi: 'फ्रिंज चौड़ाई (β)' }, value: beta_mm.toFixed(2), unit: 'mm', accent: 'force' },
      { symbol: 'θ', label: { en: 'Angular Width (λ/d)', hi: 'कोणीय चौड़ाई' }, value: ((lambdaNm * 1e-6) / d_mm).toFixed(3), unit: 'rad', accent: 'velocity' },
      { symbol: 'I_max', label: { en: 'Peak Intensity', hi: 'अधिकतम तीव्रता' }, value: '4 I₀', unit: '', accent: 'energy' },
      { symbol: 'y₁', label: { en: '1st Bright Fringe', hi: 'प्रथम दीप्त फ्रिंज' }, value: `±${beta_mm.toFixed(2)}`, unit: 'mm', accent: 'momentum' },
    ],
    graphPoints,
    graphCurrentPoint: { x: beta_mm <= 8 ? beta_mm : 0, y: 4 },
    graphLegend: { primary: 'Intensity I(y) = 4I₀·cos²(πy/β)' },
  };
}

// 14. DUAL NATURE OF RADIATION & MATTER (PHOTOELECTRIC EFFECT)
function renderDualNature(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const lambdaNm = params.lambda ?? 300;
  const phi = params.phi ?? 2.3;
  const intensity = params.intensity ?? 60;

  const E_eV = 1240 / lambdaNm;
  const K_max = Math.max(0, E_eV - phi);
  const emits = E_eV > phi;
  const freq14 = 3e8 / (lambdaNm * 1e-9) / 1e14;
  const threshFreq14 = (phi * 1.602e-19) / 6.626e-34 / 1e14;

  if (!state.photons) {
    state.photons = Array.from({ length: 12 }, (_, i) => ({ u: i / 12, lane: (i % 5) - 2 }));
    state.electrons = Array.from({ length: 12 }, (_, i) => ({ u: i / 12, lane: (i % 5) - 2 }));
  }

  if (isPlaying && dt > 0) {
    for (const ph of state.photons) {
      ph.u = (ph.u + dt * 0.65) % 1;
    }
    if (emits) {
      const eSpeed = 0.25 + Math.sqrt(K_max) * 0.45;
      for (const el of state.electrons) {
        el.u = (el.u + dt * eSpeed) % 1;
      }
    }
  }

  const plateX = width * 0.34;
  const collectorX = width * 0.84;
  const cy = height * 0.54;
  const plateH = height * 0.56;

  // Metal Cathode Plate (solid hatched) & Anode Collector (hollow)
  drawHatchRect(ctx, plateX - 14, cy - plateH / 2, 18, plateH, 'diagonal', p, 3);
  drawHatchRect(ctx, collectorX, cy - plateH / 2, 16, plateH, 'solid', p, 3);

  ctx.fillStyle = p.ink;
  ctx.font = '700 12.5px "IBM Plex Mono", monospace';
  ctx.fillText(`METAL CATHODE (φ₀=${phi}eV)`, plateX - 72, cy + plateH / 2 + 22);
  ctx.fillText(`COLLECTOR`, collectorX - 24, cy + plateH / 2 + 22);

  // Incoming Photon Wave Packets from Top-Left
  const activeCount = Math.max(3, Math.round((intensity / 100) * 12));
  for (let i = 0; i < activeCount; i++) {
    const ph = state.photons[i];
    const sx = 34 + ph.u * (plateX - 48);
    const sy = cy - 95 + ph.lane * 26 + ph.u * 95;
    // Wavy photon glyph
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let k = -10; k <= 10; k += 2) {
      const wx = sx + k;
      const wy = sy + Math.sin(k * 0.8) * 5;
      if (k === -10) ctx.moveTo(wx, wy);
      else ctx.lineTo(wx, wy);
    }
    ctx.stroke();
  }

  // Ejected Photoelectrons (only if E > phi!)
  if (emits) {
    for (let i = 0; i < activeCount; i++) {
      const el = state.electrons[i];
      const ex = plateX + 10 + el.u * (collectorX - plateX - 18);
      const ey = cy + el.lane * 34;
      ctx.beginPath();
      ctx.arc(ex, ey, 6, 0, Math.PI * 2);
      ctx.fillStyle = p.ink;
      ctx.fill();
      ctx.fillStyle = p.inkInvert;
      ctx.font = '700 10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('e⁻', ex, ey + 3.5);
      ctx.textAlign = 'left';
    }
  } else {
    drawHatchRect(ctx, width * 0.44, cy - 26, width * 0.34, 52, 'hollow', p, 8);
    ctx.fillStyle = p.ink;
    ctx.font = '700 13px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NO EMISSION (hν < φ₀)', width * 0.61, cy + 5);
    ctx.textAlign = 'left';
  }

  drawLegendPill(ctx, 14, 14, `Photon E = ${E_eV.toFixed(2)} eV vs Work Function φ₀ = ${phi} eV`, 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let f14 = 2; f14 <= 18; f14 += 0.5) {
    const eVal = (6.626e-34 * f14 * 1e14) / 1.602e-19;
    graphPoints.push({ x: f14, y: Math.max(0, eVal - phi) });
  }

  return {
    substitutedFormula: `K_max = ${E_eV.toFixed(2)} eV − ${phi} eV = ${K_max.toFixed(2)} eV  ${emits ? '(EMITTING)' : '(BELOW CUTOFF)'}`,
    readouts: [
      { symbol: 'K_max', label: { en: 'Max Electron KE', hi: 'अधिकतम गतिज ऊर्जा' }, value: K_max.toFixed(2), unit: 'eV', accent: 'force' },
      { symbol: 'V₀', label: { en: 'Stopping Potential', hi: 'निरोधी विभव (V₀)' }, value: K_max.toFixed(2), unit: 'V', accent: 'velocity' },
      { symbol: 'hν', label: { en: 'Photon Energy', hi: 'फोटॉन ऊर्जा (hν)' }, value: E_eV.toFixed(2), unit: 'eV', accent: 'energy' },
      { symbol: 'ν₀', label: { en: 'Threshold Freq', hi: 'देहली आवृत्ति (ν₀)' }, value: threshFreq14.toFixed(2), unit: '×10¹⁴Hz', accent: 'momentum' },
    ],
    graphPoints,
    graphCurrentPoint: { x: Math.min(18, freq14), y: K_max },
    graphLegend: { primary: 'K_max(ν) = hν − φ₀ (Slope = h)' },
  };
}

// 15. ATOMS 2D DIAGRAM FALLBACK (BOHR ORBITS)
function renderAtoms2D(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const nInit = Math.round(params.nInit ?? 3);
  const nFinal = Math.min(nInit - 1, Math.round(params.nFinal ?? 2));
  const Z = Math.round(params.Z ?? 1);

  if (state.t === undefined) state.t = 0;
  if (isPlaying && dt > 0) state.t += dt;

  const eInit = (-13.6 * Z * Z) / (nInit * nInit);
  const eFinal = (-13.6 * Z * Z) / (nFinal * nFinal);
  const dE = Math.abs(eInit - eFinal);
  const lambdaNm = 1240 / Math.max(0.01, dE);

  const cx = width * 0.48;
  const cy = height * 0.52;
  const unitR = Math.min(width, height) * 0.085;

  // Nucleus
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fillStyle = p.ink;
  ctx.fill();
  ctx.fillStyle = p.inkInvert;
  ctx.font = '700 11px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`+${Z}e`, cx, cy + 4);
  ctx.textAlign = 'left';

  // Bohr Orbits n = 1..5
  for (let n = 1; n <= 5; n++) {
    const r = unitR * n;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = n === nInit || n === nFinal ? p.ink : p.inkMuted;
    ctx.lineWidth = n === nInit || n === nFinal ? 2.6 : 1.3;
    ctx.setLineDash(n === nInit ? [] : [5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = p.ink;
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.fillText(`n=${n}`, cx + r + 4, cy + 4);
  }

  // Animated Transition Electron + Emitted Photon
  const cycle = (state.t * 0.55) % 1;
  const curN = cycle < 0.45 ? nInit : cycle < 0.6 ? nInit - ((cycle - 0.45) / 0.15) * (nInit - nFinal) : nFinal;
  const ang = state.t * (3.2 / Math.sqrt(curN));
  const ex = cx + Math.cos(ang) * (unitR * curN);
  const ey = cy + Math.sin(ang) * (unitR * curN);
  ctx.beginPath();
  ctx.arc(ex, ey, 7.5, 0, Math.PI * 2);
  ctx.fillStyle = p.ink;
  ctx.fill();

  if (cycle >= 0.55) {
    const dist = (cycle - 0.55) * 280;
    const px = cx + unitR * nFinal + dist;
    const py = cy - dist * 0.5;
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let k = -14; k <= 14; k += 2) {
      const wx = px + k;
      const wy = py + Math.sin(k * 0.7) * 6;
      if (k === -14) ctx.moveTo(wx, wy);
      else ctx.lineTo(wx, wy);
    }
    ctx.stroke();
    ctx.fillStyle = p.ink;
    ctx.font = '700 12px "IBM Plex Mono", monospace';
    ctx.fillText(`hν=${dE.toFixed(2)}eV`, px + 18, py);
  }

  const series = nFinal === 1 ? 'Lyman (UV)' : nFinal === 2 ? 'Balmer (Visible)' : 'Paschen (IR)';
  drawLegendPill(ctx, 14, 14, `Jump n=${nInit} → n=${nFinal} · ${series}`, 'solid', p);

  const graphPoints: { x: number; y: number }[] = [1, 2, 3, 4, 5].map((n) => ({
    x: n,
    y: (-13.6 * Z * Z) / (n * n),
  }));

  return {
    substitutedFormula: `ΔE = E_${nInit} − E_${nFinal} = ${dE.toFixed(2)} eV  |  λ = ${lambdaNm.toFixed(1)} nm`,
    readouts: [
      { symbol: 'ΔE', label: { en: 'Emitted Photon', hi: 'उत्सर्जित ऊर्जा (ΔE)' }, value: dE.toFixed(2), unit: 'eV', accent: 'force' },
      { symbol: 'λ', label: { en: 'Spectral Wavelength', hi: 'स्पेक्ट्रमी तरंगदैर्घ्य' }, value: lambdaNm.toFixed(1), unit: 'nm', accent: 'velocity' },
      { symbol: 'r_i', label: { en: 'Upper Orbit Radius', hi: 'उच्च कक्षा त्रिज्या' }, value: ((0.529 * nInit * nInit) / Z).toFixed(2), unit: 'Å', accent: 'momentum' },
      { symbol: 'Series', label: { en: 'Spectral Series', hi: 'स्पेक्ट्रमी श्रेणी' }, value: series.split(' ')[0], unit: '', accent: 'energy' },
    ],
    graphPoints,
    graphCurrentPoint: { x: nFinal, y: eFinal },
    graphLegend: { primary: 'Energy Levels E_n = −13.6·Z²/n²' },
  };
}

// 16. NUCLEI & RADIOACTIVE DECAY
function renderNuclei(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const N0 = Math.round(params.N0 ?? 100);
  const T_half = params.halfLife ?? 3.0;
  const lambda = Math.LN2 / T_half;

  const initKey = `${N0}_${T_half}`;
  if (state.initKey !== initKey || !state.decayTimes) {
    state.initKey = initKey;
    state.t = 0;
    // Deterministic exponential survival times using inverse transform sampling so curve matches N0*e^(-lambda t) smoothly
    state.decayTimes = Array.from({ length: N0 }, (_, i) => {
      const u = ((i * 61 + 17) % N0 + 0.5) / N0;
      return -Math.log(u) / lambda;
    });
  }

  if (isPlaying && dt > 0) {
    state.t += dt;
    if (state.t > T_half * 4.5) state.t = 0;
  }

  const t = state.t;
  let remaining = 0;
  for (let i = 0; i < N0; i++) {
    if (state.decayTimes[i] > t) remaining++;
  }
  const exactN = N0 * Math.pow(0.5, t / T_half);
  const activity = lambda * exactN;

  // Draw Grid of Parent (Solid Black/White) vs Decayed Daughter (Hollow Ring) Nuclei
  const cols = Math.ceil(Math.sqrt(N0 * 1.6));
  const rows = Math.ceil(N0 / cols);
  const padX = 54;
  const padY = 64;
  const cellW = (width - padX * 2) / cols;
  const cellH = (height - padY - 40) / rows;
  const rad = Math.min(11, Math.min(cellW, cellH) * 0.34);

  for (let i = 0; i < N0; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const cx = padX + c * cellW + cellW / 2;
    const cy = padY + r * cellH + cellH / 2;
    const alive = state.decayTimes[i] > t;

    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    if (alive) {
      ctx.fillStyle = p.ink;
      ctx.fill();
    } else {
      ctx.strokeStyle = p.inkMuted;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }
  }

  drawLegendPill(ctx, 14, 14, `Solid: Undecayed Parent (${remaining}) · Hollow: Decayed (${N0 - remaining})`, 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  const tSpan = T_half * 4;
  for (let i = 0; i <= 40; i++) {
    const ti = (tSpan * i) / 40;
    graphPoints.push({ x: ti, y: N0 * Math.pow(0.5, ti / T_half) });
  }

  return {
    substitutedFormula: `N(${t.toFixed(1)}s) = ${N0} × (½)^(${(t / T_half).toFixed(2)}) = ${exactN.toFixed(1)} nuclei`,
    readouts: [
      { symbol: 'N(t)', label: { en: 'Remaining Parent', hi: 'शेष जनक नाभिक' }, value: `${remaining}`, unit: '', accent: 'force' },
      { symbol: 't/T½', label: { en: 'Half-Lives Elapsed', hi: 'बीती अर्ध-आयु' }, value: (t / T_half).toFixed(2), unit: '×T½', accent: 'velocity' },
      { symbol: 'λ', label: { en: 'Decay Constant', hi: 'क्षय नियतांक (λ)' }, value: lambda.toFixed(3), unit: 's⁻¹', accent: 'momentum' },
      { symbol: 'R', label: { en: 'Activity (λN)', hi: 'सक्रियता (R)' }, value: activity.toFixed(1), unit: 'Bq', accent: 'energy' },
    ],
    graphPoints,
    graphCurrentPoint: { x: Math.min(tSpan, t), y: exactN },
    graphLegend: { primary: 'N(t) = N₀ · e^(−λt)' },
  };
}

// 17. SEMICONDUCTOR ELECTRONICS (P-N JUNCTION DIODE)
function renderSemiconductors(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const Vbias = params.Vbias ?? 0.8;
  const Vk = params.Vk ?? 0.7;
  const Rseries = params.Rseries ?? 50;

  if (state.t === undefined) state.t = 0;
  if (isPlaying && dt > 0) state.t += dt;

  // Piecewise realistic forward + reverse diode current (mA)
  const calcCurrentMa = (v: number) => {
    if (v <= 0) return -0.02 * Math.abs(v);
    if (v < Vk * 0.7) return 0.1 * (v / Vk);
    return ((v - Vk * 0.82) / Rseries) * 1000 * (1 / (1 + Math.exp(-(v - Vk) * 12)));
  };
  const I_mA = calcCurrentMa(Vbias);
  const isForwardConducting = Vbias >= Vk;

  const cx = width * 0.5;
  const cy = height * 0.52;
  const blockW = Math.min(width - 110, 440);
  const blockH = 124;
  const bx = cx - blockW / 2;
  const by = cy - blockH / 2;

  // Depletion Layer width shrinks in forward bias, widens in reverse bias
  const depW = Math.max(12, Math.min(blockW * 0.52, 54 - Vbias * 34));

  // P-type (Left) and N-type (Right) blocks
  drawHatchRect(ctx, bx, by, blockW / 2 - depW / 2, blockH, 'hollow', p, 4);
  drawHatchRect(ctx, cx + depW / 2, by, blockW / 2 - depW / 2, blockH, 'hollow', p, 4);
  // Depletion Layer (Center hatched zone)
  drawHatchRect(ctx, cx - depW / 2, by, depW, blockH, 'cross', p, 0);

  ctx.fillStyle = p.ink;
  ctx.font = '700 14px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('P-TYPE (Holes ○)', bx + (blockW / 2 - depW / 2) / 2, by - 14);
  ctx.fillText('N-TYPE (Electrons ●)', cx + depW / 2 + (blockW / 2 - depW / 2) / 2, by - 14);
  ctx.fillText(`Depletion Zone (${depW.toFixed(0)} px)`, cx, by + blockH + 22);
  ctx.textAlign = 'left';

  // Majority Carriers (Holes = Hollow ○ on Left, Electrons = Solid ● on Right)
  const driftSpeed = isForwardConducting ? 0.35 + Math.min(1.4, I_mA / 15) : 0;
  for (let i = 0; i < 10; i++) {
    const row = i % 3;
    const baseU = ((i * 0.13 + state.t * driftSpeed) % 1);
    const py = by + 28 + row * 34;

    // Holes moving right across junction when conducting
    const hx = isForwardConducting
      ? bx + 16 + baseU * (blockW - 32)
      : bx + 16 + ((i * 0.11) % 0.85) * Math.max(20, blockW / 2 - depW / 2 - 24);
    ctx.beginPath();
    ctx.arc(hx, py, 7, 0, Math.PI * 2);
    ctx.fillStyle = p.bg;
    ctx.fill();
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2.6;
    ctx.stroke();

    // Electrons moving left across junction when conducting
    const ex = isForwardConducting
      ? bx + blockW - 16 - baseU * (blockW - 32)
      : cx + depW / 2 + 16 + ((i * 0.11) % 0.85) * Math.max(20, blockW / 2 - depW / 2 - 24);
    ctx.beginPath();
    ctx.arc(ex, py + 8, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = p.ink;
    ctx.fill();
  }

  const modeLabel =
    Vbias > Vk
      ? 'FORWARD BIAS · CONDUCTING'
      : Vbias > 0.05
        ? 'FORWARD BIAS · BELOW KNEE V_k'
        : Vbias < -0.05
          ? 'REVERSE BIAS · BLOCKED'
          : 'ZERO BIAS (EQUILIBRIUM)';
  drawLegendPill(ctx, 14, 14, modeLabel, isForwardConducting ? 'solid' : 'dashed', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let vv = -3.0; vv <= 1.55; vv += 0.1) {
    graphPoints.push({ x: Number(vv.toFixed(2)), y: calcCurrentMa(vv) });
  }

  return {
    substitutedFormula: `V = ${Vbias.toFixed(2)} V (V_k = ${Vk} V)  →  I = ${I_mA.toFixed(2)} mA`,
    readouts: [
      { symbol: 'I', label: { en: 'Diode Current', hi: 'डायोड धारा (I)' }, value: I_mA.toFixed(2), unit: 'mA', accent: 'force' },
      { symbol: 'V', label: { en: 'Applied Bias', hi: 'आरोपित बायस (V)' }, value: Vbias.toFixed(2), unit: 'V', accent: 'velocity' },
      { symbol: 'W_dep', label: { en: 'Depletion Width', hi: 'अवक्षय चौड़ाई' }, value: (depW / 54).toFixed(2), unit: '×W₀', accent: 'momentum' },
      { symbol: 'State', label: { en: 'Junction Mode', hi: 'संधि अवस्था' }, value: isForwardConducting ? 'ON' : Vbias < 0 ? 'REV' : 'OFF', unit: '', accent: 'energy' },
    ],
    graphPoints,
    graphCurrentPoint: { x: Vbias, y: I_mA },
    graphLegend: { primary: 'Diode I–V Characteristic (mA)' },
  };
}
