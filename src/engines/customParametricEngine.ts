import { ComputedReadout, LiveSimTelemetry, PhysicsSimulation, ThemeMode } from '../types/physics';
import {
  drawGrid,
  drawHatchRect,
  drawLegendPill,
  drawSpring,
  drawVectorArrow,
  getCanvasPalette,
} from '../utils/canvasHelpers';
import { evaluateExpression, formatPhysicsNumber } from '../utils/mathParser';

export interface CustomSimRenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  sim: PhysicsSimulation;
  params: Record<string, number>;
  dt: number;
  isPlaying: boolean;
  showVectors: boolean;
  showGrid: boolean;
  theme: ThemeMode;
  state: Record<string, any>;
}

export function stepAndRenderCustomSim(rc: CustomSimRenderContext): LiveSimTelemetry {
  const { ctx, width, height, sim, params, dt, isPlaying, showVectors, showGrid, theme, state } = rc;
  const p = getCanvasPalette(theme);

  ctx.save();
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, width, height);
  if (showGrid) drawGrid(ctx, width, height, p, 44);

  if (state.t === undefined) state.t = 0;
  if (isPlaying && dt > 0) state.t += dt;

  const primarySpec = sim.primaryOutput;
  const primaryEval = primarySpec
    ? evaluateExpression(primarySpec.expression, params)
    : { value: 0 };
  const primaryVal = primaryEval.value ?? 0;

  const normFactors = sim.variables.map((v) => {
    const val = params[v.key] ?? v.defaultValue;
    return v.max === v.min ? 0.5 : (val - v.min) / (v.max - v.min);
  });
  const avgIntensity =
    normFactors.length > 0 ? normFactors.reduce((a, b) => a + b, 0) / normFactors.length : 0.5;
  const v0 = normFactors[0] ?? 0.5;
  const v1 = normFactors[1] ?? 0.5;

  const template = sim.visualTemplate ?? 'linear-force';
  const cx = width * 0.5;
  const cy = height * 0.52;
  const t = state.t;

  if (template === 'orbital') {
    const orbitR = 58 + v1 * (Math.min(width, height) * 0.28);
    const omega = 0.7 + v0 * 2.4;
    const ang = t * omega;
    const sx = cx + Math.cos(ang) * orbitR;
    const sy = cy + Math.sin(ang) * orbitR;

    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 6]);
    ctx.beginPath();
    ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(cx, cy, 20 + v0 * 14, 0, Math.PI * 2);
    ctx.fillStyle = p.ink;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(sx, sy, 10, 0, Math.PI * 2);
    ctx.fillStyle = p.bg;
    ctx.fill();
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 3;
    ctx.stroke();

    if (showVectors) {
      drawVectorArrow(ctx, sx, sy, sx + (cx - sx) * 0.45, sy + (cy - sy) * 0.45, p, primarySpec?.symbol ?? 'F', 'solid');
      drawVectorArrow(ctx, sx, sy, sx - Math.sin(ang) * 62, sy + Math.cos(ang) * 62, p, 'v', 'dashed');
    }
  } else if (template === 'oscillator') {
    const wallX = 56;
    const amp = 45 + v1 * (width * 0.22);
    const freq = 1.2 + v0 * 3.2;
    const dx = Math.cos(t * freq) * amp;
    const bx = cx + dx;
    drawHatchRect(ctx, wallX - 18, cy - 60, 18, 120, 'diagonal', p, 0);
    drawSpring(ctx, wallX, cy, bx - 26, cy, 11, 18, p);
    drawHatchRect(ctx, bx - 26, cy - 26, 52, 52, 'solid', p, 6);
    if (showVectors) {
      drawVectorArrow(ctx, bx, cy - 42, bx - dx * 0.65, cy - 42, p, primarySpec?.symbol ?? 'F', 'solid');
    }
  } else if (template === 'wave') {
    const amp = 24 + v0 * 65;
    const k = 0.015 + v1 * 0.03;
    const w = 2.5 + avgIntensity * 4;
    ctx.strokeStyle = p.axis;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(28, cy);
    ctx.lineTo(width - 28, cy);
    ctx.stroke();

    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 3.8;
    ctx.beginPath();
    for (let x = 28; x <= width - 28; x += 4) {
      const y = cy - Math.sin(k * x - w * t) * amp;
      if (x === 28) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  } else if (template === 'projectile') {
    const padL = 55;
    const groundY = height - 45;
    const span = width - 110;
    const peak = 55 + v1 * (height * 0.5);
    const prog = (t * (0.35 + v0 * 0.55)) % 1;

    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(24, groundY);
    ctx.lineTo(width - 24, groundY);
    ctx.stroke();

    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2.4;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const u = i / 50;
      const sx = padL + u * span;
      const sy = groundY - 4 * u * (1 - u) * peak;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    const bx = padL + prog * span;
    const by = groundY - 4 * prog * (1 - prog) * peak;
    ctx.beginPath();
    ctx.arc(bx, by, 10, 0, Math.PI * 2);
    ctx.fillStyle = p.ink;
    ctx.fill();
    if (showVectors) {
      const slope = 4 * (1 - 2 * prog) * (peak / span);
      drawVectorArrow(ctx, bx, by, bx + 54, by - slope * 54, p, 'v', 'dashed');
    }
  } else if (template === 'thermal-gas') {
    const boxW = width * (0.35 + v1 * 0.38);
    const boxH = height * 0.54;
    const left = cx - boxW / 2;
    const top = cy - boxH / 2;
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 3.5;
    ctx.strokeRect(left, top, boxW, boxH);

    drawHatchRect(ctx, left + boxW - 8, top, 16, boxH, 'diagonal', p, 0);

    const speed = 1.2 + v0 * 3.8;
    const count = 26;
    for (let i = 0; i < count; i++) {
      const px = left + 14 + Math.abs(Math.sin(t * speed * (0.7 + (i % 5) * 0.17) + i * 1.9)) * (boxW - 32);
      const py = top + 14 + Math.abs(Math.cos(t * speed * (0.6 + (i % 7) * 0.14) + i * 2.3)) * (boxH - 28);
      ctx.beginPath();
      ctx.arc(px, py, 5.5, 0, Math.PI * 2);
      if (i % 2 === 0) {
        ctx.fillStyle = p.ink;
        ctx.fill();
      } else {
        ctx.fillStyle = p.bg;
        ctx.fill();
        ctx.strokeStyle = p.ink;
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }
    }
  } else if (template === 'fluid-flow') {
    const left = 36;
    const right = width - 36;
    const wideR = height * 0.24;
    const narrowR = height * (0.09 + (1 - v1) * 0.12);

    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 3.8;
    const drawPipeWall = (sign: number) => {
      ctx.beginPath();
      ctx.moveTo(left, cy + sign * wideR);
      ctx.lineTo(cx - 80, cy + sign * wideR);
      ctx.quadraticCurveTo(cx - 30, cy + sign * narrowR, cx, cy + sign * narrowR);
      ctx.quadraticCurveTo(cx + 30, cy + sign * narrowR, cx + 80, cy + sign * wideR);
      ctx.lineTo(right, cy + sign * wideR);
      ctx.stroke();
    };
    drawPipeWall(-1);
    drawPipeWall(1);

    const speed = 0.22 + v0 * 0.45;
    for (let row = -2; row <= 2; row++) {
      for (let i = 0; i < 8; i++) {
        const u = (i / 8 + t * speed) % 1;
        const px = left + u * (right - left);
        const squeeze = Math.exp(-Math.pow((px - cx) / 72, 2));
        const localR = wideR - squeeze * (wideR - narrowR);
        const py = cy + (row / 2.6) * localR;
        ctx.beginPath();
        ctx.arc(px, py, squeeze > 0.4 ? 5.5 : 4.2, 0, Math.PI * 2);
        ctx.fillStyle = p.ink;
        ctx.fill();
      }
    }
  } else if (template === 'field-particles') {
    const sep = 65 + v1 * (width * 0.35);
    const x1 = cx - sep / 2;
    const x2 = cx + sep / 2;
    const pulse = (t * 1.4) % 1;
    [
      { x: x1, solid: true },
      { x: x2, solid: false },
    ].forEach((node) => {
      ctx.save();
      ctx.strokeStyle = p.ink;
      ctx.globalAlpha = (1 - pulse) * 0.6;
      ctx.lineWidth = 2;
      if (!node.solid) ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(node.x, cy, 20 + pulse * 36, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(node.x, cy, 20, 0, Math.PI * 2);
      if (node.solid) {
        ctx.fillStyle = p.ink;
        ctx.fill();
      } else {
        ctx.fillStyle = p.bg;
        ctx.fill();
        ctx.strokeStyle = p.ink;
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }
    });
    if (showVectors) {
      const len = 38 + avgIntensity * 55;
      drawVectorArrow(ctx, x1, cy - 38, x1 + len, cy - 38, p, primarySpec?.symbol ?? 'F', 'solid');
      drawVectorArrow(ctx, x2, cy - 38, x2 - len, cy - 38, p, primarySpec?.symbol ?? 'F', 'solid');
    }
  } else {
    const trackY = height * 0.65;
    const pos = 70 + ((t * (55 + avgIntensity * 145)) % (width - 140));
    ctx.fillStyle = p.ink;
    ctx.fillRect(30, trackY, width - 60, 5);
    drawHatchRect(ctx, pos - 30, trackY - 50, 60, 48, 'diagonal', p, 6);

    if (showVectors) {
      drawVectorArrow(ctx, pos + 30, trackY - 26, pos + 30 + 34 + avgIntensity * 65, trackY - 26, p, primarySpec?.symbol ?? 'Result', 'solid');
    }
  }

  drawLegendPill(
    ctx,
    14,
    14,
    `${primarySpec?.symbol ?? 'Result'} = ${formatPhysicsNumber(primaryVal)} ${primarySpec?.unit ?? ''}`,
    'solid',
    p
  );

  ctx.restore();

  const readouts: ComputedReadout[] = [];
  if (primarySpec) {
    readouts.push({
      symbol: primarySpec.symbol,
      label: primarySpec.label,
      value: formatPhysicsNumber(primaryVal),
      unit: primarySpec.unit,
      accent: primarySpec.accent ?? 'velocity',
    });
  }
  for (const sec of sim.secondaryOutputs ?? []) {
    const ev = evaluateExpression(sec.expression, params);
    readouts.push({
      symbol: sec.symbol,
      label: sec.label,
      value: ev.value !== null ? formatPhysicsNumber(ev.value) : '—',
      unit: sec.unit,
      accent: 'energy',
    });
  }

  const xVarDef = sim.variables.find((v) => v.key === sim.graphXVar) ?? sim.variables[0];
  const graphPoints: { x: number; y: number }[] = [];
  if (xVarDef && primarySpec) {
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const xv = xVarDef.min + ((xVarDef.max - xVarDef.min) * i) / steps;
      const ev = evaluateExpression(primarySpec.expression, { ...params, [xVarDef.key]: xv });
      if (ev.value !== null && Number.isFinite(ev.value)) {
        graphPoints.push({ x: xv, y: ev.value });
      }
    }
  }

  const varSummary = sim.variables
    .map((v) => `${v.symbol}=${params[v.key] ?? v.defaultValue}`)
    .join(', ');

  return {
    substitutedFormula: `${sim.formulaDisplay}  [${varSummary}]  →  ${primarySpec?.symbol ?? 'Out'} = ${formatPhysicsNumber(primaryVal)} ${primarySpec?.unit ?? ''}`,
    readouts,
    graphPoints,
    graphCurrentPoint: xVarDef
      ? { x: params[xVarDef.key] ?? xVarDef.defaultValue, y: primaryVal }
      : undefined,
    graphLegend: { primary: `${primarySpec?.symbol ?? 'y'}(${xVarDef?.symbol ?? 'x'})` },
  };
}
