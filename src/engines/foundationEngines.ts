import { LiveSimTelemetry } from '../types/physics';
import {
  CanvasPalette,
  drawHatchRect,
  drawLegendPill,
  drawVectorArrow,
} from '../utils/canvasHelpers';
import { formatPhysicsNumber } from '../utils/mathParser';
import { SimRenderContext } from './builtinEngines';

const G_ACC = 9.81;

export function stepAndRenderFoundationSim(
  rc: SimRenderContext,
  p: CanvasPalette
): LiveSimTelemetry | null {
  switch (rc.simId) {
    case 'speed-velocity':
      return renderSpeedVelocity(rc, p);
    case 'impulse-momentum':
      return renderImpulseMomentum(rc, p);
    case 'moment-of-inertia':
      return renderMomentOfInertia(rc, p);
    case 'work-power-basic':
      return renderWorkPowerBasic(rc, p);
    case 'circular-motion':
      return renderCircularMotion(rc, p);
    case 'density-buoyancy':
      return renderDensityBuoyancy(rc, p);
    case 'wave-speed-basic':
      return renderWaveSpeedBasic(rc, p);
    case 'charge-current-power':
      return renderChargeCurrentPower(rc, p);
    default:
      return null;
  }
}

// 1. SPEED VS VELOCITY & DISTANCE-DISPLACEMENT
function renderSpeedVelocity(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const R = params.R ?? 50;
  const v = params.v ?? 10;
  const tTarget = params.t ?? 15.5;

  if (state.animT === undefined || state.lastTarget !== tTarget || state.lastR !== R || state.lastV !== v) {
    state.animT = tTarget;
    state.lastTarget = tTarget;
    state.lastR = R;
    state.lastV = v;
  }
  if (isPlaying) {
    state.animT = ((state.animT + dt * 2.2) % Math.max(tTarget + 1, 2 * Math.PI * R / v));
  }

  const tNow = isPlaying ? Math.min(state.animT, tTarget) : tTarget;
  const dist = v * tNow;
  const theta = dist / R;
  const disp = 2 * R * Math.abs(Math.sin(theta / 2));
  const avgVel = tNow > 0 ? disp / tNow : v;

  const cx = width * 0.48;
  const cy = height * 0.52;
  const radPx = Math.min(width, height) * 0.31;

  // Track circle
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.arc(cx, cy, radPx, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Swept distance arc (solid bold)
  const startAng = -Math.PI / 2;
  const endAng = startAng + theta;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.arc(cx, cy, radPx, startAng, endAng);
  ctx.stroke();

  const sx = cx + radPx * Math.cos(startAng);
  const sy = cy + radPx * Math.sin(startAng);
  const px = cx + radPx * Math.cos(endAng);
  const py = cy + radPx * Math.sin(endAng);

  // Start marker
  ctx.fillStyle = p.bg;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sx, sy, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.fillText('START (A)', sx - 36, sy - 16);

  // Displacement straight chord vector
  if (disp > 0.2) {
    drawVectorArrow(ctx, sx, sy, px, py, p, `|Δx⃗|=${disp.toFixed(1)}m`, 'dashed');
  }

  // Tangential velocity vector
  if (showVectors) {
    const vx = -Math.sin(endAng);
    const vy = Math.cos(endAng);
    const vLen = Math.min(82, 34 + v * 1.8);
    drawVectorArrow(ctx, px, py, px + vx * vLen, py + vy * vLen, p, `v=${v}m/s`, 'solid');
  }

  // Runner dot
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(px, py, 10, 0, Math.PI * 2);
  ctx.fill();

  // Center radius label
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(px, py);
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.fillText(`R = ${R} m`, cx - 32, cy + 5);

  drawLegendPill(ctx, 16, 16, 'Arc = Distance d', 'solid', p);
  drawLegendPill(ctx, 16, 48, 'Chord = Displacement Δx⃗', 'dashed', p);

  const maxT = Math.max(tTarget, (2 * Math.PI * R) / v);
  const ptsDist: { x: number; y: number }[] = [];
  const ptsDisp: { x: number; y: number }[] = [];
  for (let i = 0; i <= 40; i++) {
    const ti = (maxT * i) / 40;
    const di = v * ti;
    ptsDist.push({ x: ti, y: di });
    ptsDisp.push({ x: ti, y: 2 * R * Math.abs(Math.sin(di / (2 * R))) });
  }

  return {
    substitutedFormula: `d = ${v}×${tNow.toFixed(1)} = ${dist.toFixed(1)} m  |  |Δx⃗| = ${disp.toFixed(1)} m  |  |v⃗_avg| = ${avgVel.toFixed(2)} m/s`,
    readouts: [
      { symbol: 'd', label: { en: 'Distance (Path)', hi: 'दूरी (पथ लंबाई)' }, value: formatPhysicsNumber(dist, 1), unit: 'm' },
      { symbol: '|Δx⃗|', label: { en: 'Displacement', hi: 'विस्थापन' }, value: formatPhysicsNumber(disp, 1), unit: 'm' },
      { symbol: 'v', label: { en: 'Average Speed', hi: 'औसत चाल' }, value: formatPhysicsNumber(v, 2), unit: 'm/s' },
      { symbol: '|v⃗|', label: { en: 'Avg Velocity', hi: 'औसत वेग' }, value: formatPhysicsNumber(avgVel, 2), unit: 'm/s' },
    ],
    graphPoints: ptsDist,
    graphSecondPoints: ptsDisp,
    graphCurrentPoint: { x: tNow, y: disp },
    graphLegend: { primary: 'Distance d', secondary: 'Displacement |Δx⃗|' },
  };
}

// 2. LINEAR MOMENTUM & IMPULSE
function renderImpulseMomentum(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const m = params.m ?? 0.5;
  const u = params.u ?? 20;
  const dtImpact = params.dtImpact ?? 0.1;

  const pInit = m * u;
  const impulse = pInit; // stopping ball from u to 0
  const fAvg = impulse / dtImpact;
  const fPeak = fAvg * 1.57; // half-sine peak

  if (state.phase === undefined) state.phase = 0;
  if (isPlaying) {
    state.phase = (state.phase + dt * 0.75) % 1;
  }

  const groundY = height * 0.72;
  const wallX = width * 0.76;

  // Floor & cushioned wall
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width * 0.08, groundY);
  ctx.lineTo(width * 0.88, groundY);
  ctx.stroke();

  const cushionW = Math.min(72, 14 + dtImpact * 110);
  drawHatchRect(ctx, wallX, height * 0.25, 28, groundY - height * 0.25, 'diagonal', p, 3);
  drawHatchRect(ctx, wallX - cushionW, height * 0.34, cushionW, groundY - height * 0.34, 'cross', p, 4);

  ctx.fillStyle = p.ink;
  ctx.font = '700 12.5px "IBM Plex Mono", monospace';
  ctx.fillText(`CUSHION Δt = ${dtImpact.toFixed(2)}s`, wallX - cushionW - 22, height * 0.31);

  // Ball position
  const startX = width * 0.16;
  const hitX = wallX - cushionW - 22;
  const t = state.phase;
  let ballX = startX;
  let squash = 0;
  if (t < 0.55) {
    ballX = startX + (hitX - startX) * (t / 0.55);
  } else if (t < 0.85) {
    const impProgress = (t - 0.55) / 0.3;
    squash = Math.sin(impProgress * Math.PI) * 9;
    ballX = hitX + Math.sin(impProgress * Math.PI) * Math.min(cushionW * 0.55, 26);
  } else {
    ballX = hitX;
  }

  const ballR = 20 + m * 2.2;
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.ellipse(ballX, groundY - ballR, Math.max(12, ballR - squash), ballR + squash * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = p.inkInvert;
  ctx.font = '700 12px "IBM Plex Mono", monospace';
  ctx.fillText(`${m}kg`, ballX - 15, groundY - ballR + 4);

  if (showVectors) {
    if (t < 0.55) {
      drawVectorArrow(ctx, ballX + ballR, groundY - ballR, ballX + ballR + Math.min(110, 36 + pInit * 2.4), groundY - ballR, p, `p=${pInit.toFixed(1)}`, 'double');
    } else if (t < 0.85) {
      const fLen = Math.min(140, 32 + Math.log10(1 + fAvg) * 38);
      drawVectorArrow(ctx, ballX, groundY - ballR - 26, ballX - fLen, groundY - ballR - 26, p, `F_avg=${fAvg.toFixed(0)}N`, 'solid');
    }
  }

  drawLegendPill(ctx, 16, 16, `Impulse J = Δp = ${impulse.toFixed(1)} N·s`, 'double', p);
  drawLegendPill(ctx, 16, 48, `Peak Force ≈ ${fPeak.toFixed(0)} N`, 'solid', p);

  const pts: { x: number; y: number }[] = [];
  const totalT = Math.max(0.5, dtImpact * 1.4);
  for (let i = 0; i <= 48; i++) {
    const ti = (totalT * i) / 48;
    const fVal = ti <= dtImpact ? fPeak * Math.sin((Math.PI * ti) / dtImpact) : 0;
    pts.push({ x: ti, y: fVal });
  }

  return {
    substitutedFormula: `p = ${m}×${u} = ${pInit.toFixed(1)} kg·m/s  |  F_avg = ${pInit.toFixed(1)} / ${dtImpact.toFixed(2)} = ${fAvg.toFixed(1)} N`,
    readouts: [
      { symbol: 'p', label: { en: 'Initial Momentum', hi: 'प्रारंभिक संवेग' }, value: formatPhysicsNumber(pInit, 2), unit: 'kg·m/s' },
      { symbol: 'J', label: { en: 'Impulse (Δp)', hi: 'आवेग (Δp)' }, value: formatPhysicsNumber(impulse, 2), unit: 'N·s' },
      { symbol: 'F_avg', label: { en: 'Average Force', hi: 'औसत बल' }, value: formatPhysicsNumber(fAvg, 1), unit: 'N' },
      { symbol: 'F_max', label: { en: 'Peak Impact Force', hi: 'अधिकतम बल' }, value: formatPhysicsNumber(fPeak, 1), unit: 'N' },
    ],
    graphPoints: pts,
    graphCurrentPoint: { x: dtImpact * 0.5, y: fPeak },
  };
}

// 3. MOMENT OF INERTIA & TORQUE
const SHAPES = [
  { id: 1, k: 0.4, name: 'Solid Sphere (2/5 MR²)' },
  { id: 2, k: 0.5, name: 'Solid Disc (1/2 MR²)' },
  { id: 3, k: 2 / 3, name: 'Hollow Sphere (2/3 MR²)' },
  { id: 4, k: 1.0, name: 'Thin Ring (1 MR²)' },
];

function renderMomentOfInertia(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const shapeIdx = Math.max(1, Math.min(4, Math.round(params.shape ?? 2))) - 1;
  const shape = SHAPES[shapeIdx];
  const M = params.M ?? 6;
  const R = params.R ?? 0.8;
  const F = params.F ?? 12;

  const I = shape.k * M * R * R;
  const tau = F * R;
  const alpha = tau / I;

  if (state.angle === undefined) state.angle = 0;
  if (state.omega === undefined) state.omega = 0;
  if (isPlaying) {
    state.omega = (state.omega + alpha * dt * 0.45) % 10;
    state.angle += (0.8 + state.omega * 0.7) * dt;
  }

  const cx = width * 0.38;
  const cy = height * 0.52;
  const radPx = Math.min(width, height) * (0.14 + (R / 2) * 0.17);

  // Draw chosen rotating rigid body in crisp B&W pattern
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(state.angle);

  if (shape.id === 4) {
    // Thin ring
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(0, 0, radPx, 0, Math.PI * 2);
    ctx.stroke();
  } else if (shape.id === 3) {
    // Hollow sphere
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, radPx, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.ellipse(0, 0, radPx, radPx * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (shape.id === 2) {
    // Solid disc with hatched wedges
    ctx.fillStyle = p.fillSoft;
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, radPx, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = p.ink;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radPx, 0, Math.PI / 2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radPx, Math.PI, Math.PI * 1.5);
    ctx.closePath();
    ctx.fill();
  } else {
    // Solid sphere with dense center
    ctx.fillStyle = p.bg;
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, radPx, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = p.ink;
    ctx.beginPath();
    ctx.arc(0, 0, radPx * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }

  // Reference spoke
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(radPx, 0);
  ctx.stroke();
  ctx.restore();

  // Tangential Force vector at top
  if (showVectors) {
    const fLen = Math.min(110, 35 + F * 2);
    drawVectorArrow(ctx, cx, cy - radPx, cx + fLen, cy - radPx, p, `F=${F}N (τ=${tau.toFixed(1)})`, 'solid');
  }

  // Right-side comparative bar chart of I for all 4 shapes
  const barX = width * 0.64;
  const barWMax = width * 0.28;
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.fillText('SHAPE COMPARISON (Same M, R)', barX, height * 0.22);

  SHAPES.forEach((s, idx) => {
    const y = height * 0.29 + idx * 52;
    const sI = s.k * M * R * R;
    const w = barWMax * s.k;
    drawHatchRect(ctx, barX, y, w, 22, idx === shapeIdx ? 'solid' : 'diagonal', p, 3);
    ctx.fillStyle = p.ink;
    ctx.font = idx === shapeIdx ? '800 12px "IBM Plex Mono", monospace' : '600 11.5px "IBM Plex Mono", monospace';
    ctx.fillText(`${s.name}: ${sI.toFixed(2)}`, barX, y - 6);
  });

  drawLegendPill(ctx, 16, 16, `${shape.name}`, 'solid', p);

  const pts: { x: number; y: number }[] = [];
  for (let i = 1; i <= 40; i++) {
    const ri = (2.0 * i) / 40;
    pts.push({ x: ri, y: shape.k * M * ri * ri });
  }

  return {
    substitutedFormula: `I = ${shape.k.toFixed(2)}×${M}×${R}² = ${I.toFixed(2)} kg·m²  |  α = τ/I = ${alpha.toFixed(2)} rad/s²`,
    readouts: [
      { symbol: 'I', label: { en: 'Moment of Inertia', hi: 'जड़त्व आघूर्ण' }, value: formatPhysicsNumber(I, 2), unit: 'kg·m²' },
      { symbol: 'τ', label: { en: 'Torque (F·R)', hi: 'बल आघूर्ण' }, value: formatPhysicsNumber(tau, 2), unit: 'N·m' },
      { symbol: 'α', label: { en: 'Angular Accel.', hi: 'कोणीय त्वरण' }, value: formatPhysicsNumber(alpha, 2), unit: 'rad/s²' },
      { symbol: 'k', label: { en: 'Shape Factor', hi: 'आकृति गुणांक' }, value: shape.k.toFixed(2), unit: '' },
    ],
    graphPoints: pts,
    graphCurrentPoint: { x: R, y: I },
  };
}

// 4. WORK & POWER BASICS
function renderWorkPowerBasic(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const F = params.F ?? 40;
  const d = params.d ?? 12;
  const thetaDeg = params.theta ?? 30;
  const tTime = params.t ?? 4;

  const rad = (thetaDeg * Math.PI) / 180;
  const fParallel = F * Math.cos(rad);
  const fPerp = F * Math.sin(rad);
  const W = fParallel * d;
  const P = W / tTime;
  const vAvg = d / tTime;

  if (state.prog === undefined) state.prog = 0.5;
  if (isPlaying) {
    state.prog = (state.prog + dt * 0.35) % 1;
  }

  const floorY = height * 0.72;
  const startX = width * 0.16;
  const endX = width * 0.76;
  const curX = startX + (endX - startX) * state.prog;

  // Floor
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width * 0.08, floorY);
  ctx.lineTo(width * 0.92, floorY);
  ctx.stroke();

  // Displacement bracket
  drawVectorArrow(ctx, startX, floorY + 26, endX, floorY + 26, p, `d = ${d} m`, 'dashed');

  // Block
  const bw = 72;
  const bh = 48;
  drawHatchRect(ctx, curX - bw / 2, floorY - bh, bw, bh, 'diagonal', p, 4);

  if (showVectors) {
    const fLen = Math.min(130, 44 + F * 0.9);
    const fx = curX + Math.cos(rad) * fLen;
    const fy = floorY - bh / 2 - Math.sin(rad) * fLen;
    drawVectorArrow(ctx, curX, floorY - bh / 2, fx, fy, p, `F=${F}N (${thetaDeg}°)`, 'solid');
    if (Math.abs(fParallel) > 0.5) {
      drawVectorArrow(ctx, curX, floorY - bh / 2, curX + Math.cos(rad) * fLen, floorY - bh / 2, p, `F·cosθ=${fParallel.toFixed(1)}N`, 'double');
    }
    if (Math.abs(fPerp) > 0.5) {
      drawVectorArrow(ctx, curX, floorY - bh / 2, curX, floorY - bh / 2 - Math.sin(rad) * fLen, p, `F·sinθ=${fPerp.toFixed(1)}N`, 'dotted');
    }
  }

  const workSign = Math.abs(W) < 0.05 ? 'ZERO WORK (θ = 90°)' : W > 0 ? 'POSITIVE WORK' : 'NEGATIVE WORK';
  drawLegendPill(ctx, 16, 16, workSign, 'solid', p);
  drawLegendPill(ctx, 16, 48, `Power P = ${P.toFixed(1)} W`, 'double', p);

  const pts: { x: number; y: number }[] = [];
  for (let a = 0; a <= 180; a += 5) {
    pts.push({ x: a, y: F * d * Math.cos((a * Math.PI) / 180) });
  }

  return {
    substitutedFormula: `W = ${F}×${d}×cos(${thetaDeg}°) = ${W.toFixed(1)} J  |  P = ${W.toFixed(1)} / ${tTime} = ${P.toFixed(1)} W`,
    readouts: [
      { symbol: 'W', label: { en: 'Work Done', hi: 'किया गया कार्य' }, value: formatPhysicsNumber(W, 1), unit: 'J' },
      { symbol: 'P', label: { en: 'Average Power', hi: 'औसत शक्ति' }, value: formatPhysicsNumber(P, 1), unit: 'W' },
      { symbol: 'F∥', label: { en: 'Effective Force', hi: 'प्रभावी बल' }, value: formatPhysicsNumber(fParallel, 1), unit: 'N' },
      { symbol: 'v', label: { en: 'Avg Speed', hi: 'औसत चाल' }, value: formatPhysicsNumber(vAvg, 2), unit: 'm/s' },
    ],
    graphPoints: pts,
    graphCurrentPoint: { x: thetaDeg, y: W },
  };
}

// 5. UNIFORM CIRCULAR MOTION
function renderCircularMotion(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const m = params.m ?? 2;
  const r = params.r ?? 4;
  const omega = params.omega ?? 2.5;

  const v = omega * r;
  const ac = omega * omega * r;
  const Fc = m * ac;
  const T = (2 * Math.PI) / omega;

  if (state.theta === undefined) state.theta = 0;
  if (isPlaying) {
    state.theta += omega * dt;
  }

  const cx = width * 0.5;
  const cy = height * 0.52;
  const radPx = Math.min(width, height) * (0.14 + (r / 12) * 0.22);

  // Orbit path
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.4;
  ctx.setLineDash([7, 5]);
  ctx.beginPath();
  ctx.arc(cx, cy, radPx, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Center pin & tether string
  const bx = cx + radPx * Math.cos(state.theta);
  const by = cy + radPx * Math.sin(state.theta);

  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(bx, by);
  ctx.stroke();

  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fill();

  // Mass bob
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(bx, by, 12, 0, Math.PI * 2);
  ctx.fill();

  if (showVectors) {
    // Tangential velocity (dashed)
    const tx = -Math.sin(state.theta);
    const ty = Math.cos(state.theta);
    const vLen = Math.min(115, 36 + v * 3);
    drawVectorArrow(ctx, bx, by, bx + tx * vLen, by + ty * vLen, p, `v=${v.toFixed(1)}m/s`, 'dashed');

    // Inward centripetal force (solid)
    const ix = -Math.cos(state.theta);
    const iy = -Math.sin(state.theta);
    const fLen = Math.min(radPx - 14, 34 + Math.log10(1 + Fc) * 28);
    drawVectorArrow(ctx, bx, by, bx + ix * fLen, by + iy * fLen, p, `Fc=${Fc.toFixed(1)}N`, 'solid');
  }

  drawLegendPill(ctx, 16, 16, 'Fc ⊥ v (Always 90°)', 'solid', p);
  drawLegendPill(ctx, 16, 48, `Period T = ${T.toFixed(2)} s`, 'dashed', p);

  const pts: { x: number; y: number }[] = [];
  const maxV = Math.max(v * 1.4, 20);
  for (let i = 0; i <= 40; i++) {
    const vi = (maxV * i) / 40;
    pts.push({ x: vi, y: (m * vi * vi) / r });
  }

  return {
    substitutedFormula: `v = ${omega}×${r} = ${v.toFixed(1)} m/s  |  a_c = ${ac.toFixed(1)} m/s²  |  F_c = ${Fc.toFixed(1)} N`,
    readouts: [
      { symbol: 'v', label: { en: 'Linear Speed', hi: 'रैखिक चाल' }, value: formatPhysicsNumber(v, 2), unit: 'm/s' },
      { symbol: 'a_c', label: { en: 'Centripetal Accel.', hi: 'अभिकेंद्र त्वरण' }, value: formatPhysicsNumber(ac, 2), unit: 'm/s²' },
      { symbol: 'F_c', label: { en: 'Centripetal Force', hi: 'अभिकेंद्र बल' }, value: formatPhysicsNumber(Fc, 1), unit: 'N' },
      { symbol: 'T', label: { en: 'Time Period', hi: 'आवर्तकाल' }, value: formatPhysicsNumber(T, 2), unit: 's' },
    ],
    graphPoints: pts,
    graphCurrentPoint: { x: v, y: Fc },
  };
}

// 6. DENSITY, PRESSURE & ARCHIMEDES BUOYANCY
function renderDensityBuoyancy(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const rhoObj = params.rhoObj ?? 750;
  const rhoFluid = params.rhoFluid ?? 1000;
  const vol = params.vol ?? 0.05;
  const depth = params.depth ?? 2.0;

  const mass = rhoObj * vol;
  const weight = mass * G_ACC;
  const floats = rhoObj <= rhoFluid;
  const subFrac = floats ? rhoObj / rhoFluid : 1;
  const vSub = vol * subFrac;
  const fBuoy = rhoFluid * vSub * G_ACC;
  const wApp = Math.max(0, weight - fBuoy);
  const gaugeP = (rhoFluid * G_ACC * depth) / 1000; // kPa

  if (state.bob === undefined) state.bob = 0;
  if (isPlaying) state.bob += dt * 2.4;

  const tankX = width * 0.22;
  const tankW = width * 0.56;
  const tankTop = height * 0.16;
  const tankBot = height * 0.84;
  const waterY = height * 0.36;

  // Fluid region (light hatching/horizontal ripples)
  ctx.fillStyle = p.fillSoft;
  ctx.fillRect(tankX, waterY, tankW, tankBot - waterY);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(tankX, waterY);
  ctx.lineTo(tankX + tankW, waterY);
  ctx.stroke();

  // Tank walls (U-shape)
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(tankX, tankTop);
  ctx.lineTo(tankX, tankBot);
  ctx.lineTo(tankX + tankW, tankBot);
  ctx.lineTo(tankX + tankW, tankTop);
  ctx.stroke();

  // Block placement
  const bw = 96;
  const bh = 76;
  const bx = tankX + tankW / 2 - bw / 2;
  const bobOffset = floats ? Math.sin(state.bob) * 3 : 0;
  const by = floats ? waterY - bh * (1 - subFrac) + bobOffset : tankBot - bh - 4;

  drawHatchRect(ctx, bx, by, bw, bh, floats ? 'diagonal' : 'cross', p, 4);

  ctx.fillStyle = p.ink;
  ctx.font = '700 12.5px "IBM Plex Mono", monospace';
  ctx.fillText(`ρ_obj = ${rhoObj}`, bx + 4, by - 8);
  ctx.fillText(`ρ_fluid = ${rhoFluid} kg/m³`, tankX + 12, tankBot - 12);

  if (showVectors) {
    const fScale = Math.min(82, 28 + Math.log10(1 + Math.max(weight, fBuoy)) * 18);
    drawVectorArrow(ctx, bx + bw / 2 + 16, by + bh / 2, bx + bw / 2 + 16, by + bh / 2 + fScale, p, `W=${weight.toFixed(0)}N`, 'solid');
    const bScale = fScale * (fBuoy / Math.max(weight, 1));
    drawVectorArrow(ctx, bx + bw / 2 - 16, by + bh / 2, bx + bw / 2 - 16, by + bh / 2 - bScale, p, `Fb=${fBuoy.toFixed(0)}N`, 'double');
  }

  drawLegendPill(ctx, 16, 16, floats ? `FLOATS (${(subFrac * 100).toFixed(0)}% submerged)` : 'SINKS (W > F_b)', 'solid', p);

  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= 40; i++) {
    const hi = (10 * i) / 40;
    pts.push({ x: hi, y: (rhoFluid * G_ACC * hi) / 1000 });
  }

  return {
    substitutedFormula: `W = ${weight.toFixed(1)} N  |  F_b = ${fBuoy.toFixed(1)} N  |  ΔP(${depth}m) = ${gaugeP.toFixed(2)} kPa`,
    readouts: [
      { symbol: 'F_b', label: { en: 'Buoyant Force', hi: 'उत्प्लावन बल' }, value: formatPhysicsNumber(fBuoy, 1), unit: 'N' },
      { symbol: 'W', label: { en: 'True Weight', hi: 'वास्तविक भार' }, value: formatPhysicsNumber(weight, 1), unit: 'N' },
      { symbol: 'W_app', label: { en: 'Apparent Weight', hi: 'आभासी भार' }, value: formatPhysicsNumber(wApp, 1), unit: 'N' },
      { symbol: 'ΔP', label: { en: 'Gauge Pressure', hi: 'द्रव दाब' }, value: formatPhysicsNumber(gaugeP, 2), unit: 'kPa' },
    ],
    graphPoints: pts,
    graphCurrentPoint: { x: depth, y: gaugeP },
  };
}

// 7. WAVE SPEED v = fλ
function renderWaveSpeedBasic(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const f = params.f ?? 2;
  const lam = params.lam ?? 4;
  const amp = params.amp ?? 1.5;

  const v = f * lam;
  const T = 1 / f;
  const k = (2 * Math.PI) / lam;
  const omega = 2 * Math.PI * f;

  if (state.t === undefined) state.t = 0;
  if (isPlaying) state.t += dt * 0.45;

  const midY = height * 0.54;
  const leftX = width * 0.08;
  const rightX = width * 0.92;
  const spanX = rightX - leftX;
  const xMeters = 14;
  const pxPerM = spanX / xMeters;
  const pxPerAmp = height * 0.1;

  // Equilibrium midline
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.6;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(leftX, midY);
  ctx.lineTo(rightX, midY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Wave curve
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.8;
  ctx.beginPath();
  for (let i = 0; i <= 180; i++) {
    const xm = (xMeters * i) / 180;
    const ym = amp * Math.sin(k * xm - omega * state.t);
    const sx = leftX + xm * pxPerM;
    const sy = midY - ym * pxPerAmp;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.stroke();

  // Wavelength caliper bracket between two crests
  const phaseShift = ((omega * state.t) / k) % lam;
  let c1 = phaseShift + lam / 4;
  if (c1 > xMeters - lam - 0.5) c1 -= lam;
  if (c1 < 0.5) c1 += lam;
  const c2 = c1 + lam;
  const c1x = leftX + c1 * pxPerM;
  const c2x = leftX + c2 * pxPerM;
  const crestY = midY - amp * pxPerAmp;

  if (c2 <= xMeters) {
    drawVectorArrow(ctx, c1x, crestY - 26, c2x, crestY - 26, p, `λ = ${lam} m`, 'double');
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(c1x, crestY);
    ctx.lineTo(c1x, crestY - 30);
    ctx.moveTo(c2x, crestY);
    ctx.lineTo(c2x, crestY - 30);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Amplitude arrow
  const ampX = leftX + Math.min(c1, xMeters * 0.5) * pxPerM;
  drawVectorArrow(ctx, ampX, midY, ampX, crestY, p, `A=${amp}m`, 'solid');

  drawLegendPill(ctx, 16, 16, `v = f·λ = ${v.toFixed(1)} m/s`, 'solid', p);
  drawLegendPill(ctx, 16, 48, `T = 1/f = ${T.toFixed(3)} s`, 'double', p);

  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= 60; i++) {
    const xm = (xMeters * i) / 60;
    pts.push({ x: xm, y: amp * Math.sin(k * xm - omega * state.t) });
  }

  return {
    substitutedFormula: `v = ${f} Hz × ${lam} m = ${v.toFixed(2)} m/s  |  T = ${T.toFixed(3)} s`,
    readouts: [
      { symbol: 'v', label: { en: 'Wave Speed', hi: 'तरंग वेग' }, value: formatPhysicsNumber(v, 2), unit: 'm/s' },
      { symbol: 'T', label: { en: 'Time Period', hi: 'आवर्तकाल' }, value: formatPhysicsNumber(T, 3), unit: 's' },
      { symbol: 'ω', label: { en: 'Angular Freq.', hi: 'कोणीय आवृत्ति' }, value: formatPhysicsNumber(omega, 2), unit: 'rad/s' },
      { symbol: 'k', label: { en: 'Wave Number', hi: 'तरंग संख्या' }, value: formatPhysicsNumber(k, 2), unit: 'rad/m' },
    ],
    graphPoints: pts,
  };
}

// 8. ELECTRIC CHARGE, CURRENT & JOULE HEATING
function renderChargeCurrentPower(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const I = params.I ?? 4;
  const R = params.R ?? 10;
  const t = params.t ?? 30;

  const Q = I * t;
  const V = I * R;
  const P = I * I * R;
  const H = P * t;
  const electronsPerSec = I / 1.602e-19;

  if (state.offset === undefined) state.offset = 0;
  if (isPlaying) state.offset = (state.offset + dt * (25 + I * 14)) % 40;

  // Draw clean rectangular monochrome circuit loop
  const x1 = width * 0.16;
  const x2 = width * 0.84;
  const y1 = height * 0.28;
  const y2 = height * 0.72;

  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.5;
  ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

  // Resistor coil on top branch
  const rx1 = width * 0.38;
  const rx2 = width * 0.62;
  ctx.fillStyle = p.bg;
  ctx.fillRect(rx1, y1 - 18, rx2 - rx1, 36);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(rx1, y1);
  const teeth = 7;
  for (let i = 0; i < teeth; i++) {
    const tx = rx1 + ((i + 0.5) * (rx2 - rx1)) / teeth;
    ctx.lineTo(tx, i % 2 === 0 ? y1 - 15 : y1 + 15);
  }
  ctx.lineTo(rx2, y1);
  ctx.stroke();

  // Rising monochrome heat waves proportional to Power
  const waveCount = Math.min(7, Math.max(2, Math.round(P / 200) + 1));
  ctx.lineWidth = 2.2;
  ctx.setLineDash([4, 3]);
  for (let i = 0; i < waveCount; i++) {
    const wx = rx1 + 14 + ((rx2 - rx1 - 28) * i) / Math.max(1, waveCount - 1);
    ctx.beginPath();
    ctx.moveTo(wx, y1 - 24);
    ctx.quadraticCurveTo(wx - 8, y1 - 42, wx, y1 - 56);
    ctx.quadraticCurveTo(wx + 8, y1 - 68, wx, y1 - 80);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.fillText(`R = ${R} Ω  |  P = ${P.toFixed(0)} W`, rx1 + 10, y1 + 36);

  // Battery symbol on bottom branch
  const bx = width * 0.5;
  ctx.fillStyle = p.bg;
  ctx.fillRect(bx - 16, y2 - 20, 32, 40);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(bx - 8, y2 - 20);
  ctx.lineTo(bx - 8, y2 + 20);
  ctx.stroke();
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(bx + 8, y2 - 11);
  ctx.lineTo(bx + 8, y2 + 11);
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.fillText(`V = ${V.toFixed(1)} V`, bx - 40, y2 + 38);

  // Moving charge beads along perimeter
  ctx.fillStyle = p.ink;
  for (let x = x1 + state.offset; x < x2; x += 40) {
    if (x < rx1 - 8 || x > rx2 + 8) {
      ctx.beginPath();
      ctx.arc(x, y1, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  for (let x = x2 - state.offset; x > x1; x -= 40) {
    if (Math.abs(x - bx) > 22) {
      ctx.beginPath();
      ctx.arc(x, y2, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawLegendPill(ctx, 16, 16, `Q = I·t = ${Q.toFixed(1)} C`, 'solid', p);
  drawLegendPill(ctx, 16, 48, `Heat H = ${(H / 1000).toFixed(2)} kJ`, 'double', p);

  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= 30; i++) {
    const ii = (15 * i) / 30;
    pts.push({ x: ii, y: ii * ii * R });
  }

  return {
    substitutedFormula: `Q = ${I}×${t} = ${Q.toFixed(0)} C  |  H = ${I}²×${R}×${t} = ${(H / 1000).toFixed(2)} kJ`,
    readouts: [
      { symbol: 'Q', label: { en: 'Total Charge', hi: 'कुल आवेश' }, value: formatPhysicsNumber(Q, 1), unit: 'C' },
      { symbol: 'P', label: { en: 'Electric Power', hi: 'विद्युत शक्ति' }, value: formatPhysicsNumber(P, 1), unit: 'W' },
      { symbol: 'H', label: { en: 'Joule Heat', hi: 'जूल ऊष्मा' }, value: formatPhysicsNumber(H / 1000, 2), unit: 'kJ' },
      { symbol: 'n/s', label: { en: 'Electrons / sec', hi: 'इलेक्ट्रॉन / सेकंड' }, value: formatPhysicsNumber(electronsPerSec, 2), unit: 'e⁻/s' },
    ],
    graphPoints: pts,
    graphCurrentPoint: { x: I, y: P },
  };
}
