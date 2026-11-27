import { LiveSimTelemetry } from '../types/physics';
import {
  CanvasPalette,
  drawHatchRect as baseDrawHatchRect,
  drawLegendPill as baseDrawLegendPill,
  drawVectorArrow as baseDrawVectorArrow,
  VectorLineStyle,
} from '../utils/canvasHelpers';
import { formatPhysicsNumber } from '../utils/mathParser';
import type { SimRenderContext } from './builtinEngines';

const G_CONST = 6.674e-11;
let currentPalette11: CanvasPalette;

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
  baseDrawVectorArrow(ctx, x1, y1, x2, y2, currentPalette11, label, style);
}

function drawLegendPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  items: { label: string; color: string; style: VectorLineStyle }[],
  palette: CanvasPalette
) {
  let cursorX = x;
  for (const item of items) {
    baseDrawLegendPill(ctx, cursorX, y, item.label, item.style, palette);
    cursorX += item.label.length * 7.8 + 64;
  }
}

export function stepAndRenderRemaining11(
  rc: SimRenderContext,
  palette: CanvasPalette
): LiveSimTelemetry | null {
  currentPalette11 = palette;
  switch (rc.simId) {
    case 'relative-velocity':
      return renderRelativeVelocity(rc, palette);
    case 'banking-roads':
      return renderBankingRoads(rc, palette);
    case 'atwood-pulley':
      return renderAtwoodPulley(rc, palette);
    case 'rolling-incline':
      return renderRollingIncline(rc, palette);
    case 'escape-velocity':
      return renderEscapeVelocity(rc, palette);
    case 'keplers-laws':
      return renderKeplersLaws(rc, palette);
    case 'stokes-terminal':
      return renderStokesTerminal(rc, palette);
    case 'capillary-rise':
      return renderCapillaryRise(rc, palette);
    case 'carnot-engine':
      return renderCarnotEngine(rc, palette);
    case 'simple-pendulum':
      return renderSimplePendulum(rc, palette);
    case 'doppler-effect':
      return renderDopplerEffect(rc, palette);
    default:
      return null;
  }
}

// 1. RELATIVE VELOCITY (RIVER-BOAT)
function renderRelativeVelocity(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const vb = params.vb ?? 6;
  const vr = params.vr ?? 3;
  const thetaDeg = params.theta ?? 0;
  const d = params.width ?? 120;
  const th = (thetaDeg * Math.PI) / 180;

  const vy = Math.max(0.2, vb * Math.cos(th));
  const vx = vr - vb * Math.sin(th);
  const vNet = Math.hypot(vx, vy);
  const tCross = d / vy;
  const drift = vx * tCross;

  if (state.t === undefined) state.t = 0;
  if (isPlaying) {
    state.t += dt * 4;
    if (state.t > tCross) state.t = 0;
  }
  const frac = Math.min(1, state.t / tCross);

  const bankTop = 64;
  const bankBot = height - 64;
  const riverH = bankBot - bankTop;

  // Banks with hatch
  drawHatchRect(ctx, 20, 26, width - 40, bankTop - 26, p, 10);
  drawHatchRect(ctx, 20, bankBot, width - 40, height - bankBot - 20, p, 10);

  // Flowing water dashes
  ctx.save();
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([12, 16]);
  const shift = ((state.t * 36) % 28);
  for (let row = 1; row <= 4; row++) {
    const ry = bankTop + (row / 5) * riverH;
    ctx.beginPath();
    ctx.moveTo(28 + shift, ry);
    ctx.lineTo(width - 28, ry);
    ctx.stroke();
  }
  ctx.restore();

  const startX = width * 0.34;
  const startY = bankBot - 12;
  const pxPerMeter = (riverH - 24) / d;
  const endX = Math.max(40, Math.min(width - 40, startX + drift * pxPerMeter));
  const endY = bankTop + 12;

  // Straight target line (dotted)
  ctx.save();
  ctx.setLineDash([4, 6]);
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX, endY);
  ctx.stroke();
  ctx.restore();

  // Boat path (dashed)
  ctx.save();
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.restore();

  const bx = startX + (endX - startX) * frac;
  const by = startY + (endY - startY) * frac;

  // Draw boat hull rotated by heading
  ctx.save();
  ctx.translate(bx, by);
  ctx.rotate(-th);
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(10, 6);
  ctx.lineTo(7, 16);
  ctx.lineTo(-7, 16);
  ctx.lineTo(-10, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (showVectors) {
    const vScale = 9;
    drawVectorArrow(ctx, bx, by, bx - vb * Math.sin(th) * vScale, by - vb * Math.cos(th) * vScale, p.ink, `v_b=${vb}`, 'solid');
    drawVectorArrow(ctx, bx, by, bx + vr * vScale, by, p.ink, `v_r=${vr}`, 'dashed');
    drawVectorArrow(ctx, bx, by, bx + vx * vScale, by - vy * vScale, p.ink, `v_net=${vNet.toFixed(1)}`, 'double');
  }

  drawLegendPill(ctx, 20, height - 34, [
    { label: 'v_b (Boat)', color: p.ink, style: 'solid' },
    { label: 'v_r (River)', color: p.ink, style: 'dashed' },
    { label: 'v_net (Resultant)', color: p.ink, style: 'double' },
  ], p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let ang = 0; ang <= 75; ang += 3) {
    const rad = (ang * Math.PI) / 180;
    graphPoints.push({ x: ang, y: d / Math.max(0.4, vb * Math.cos(rad)) });
  }

  return {
    substitutedFormula: `t = ${d} / (${vb}·cos${thetaDeg}°) = ${tCross.toFixed(1)} s  |  Drift x = ${drift.toFixed(1)} m`,
    readouts: [
      { symbol: 'v_net', label: { en: 'Resultant Speed', hi: 'परिणामी चाल' }, value: vNet.toFixed(2), unit: 'm/s' },
      { symbol: 't', label: { en: 'Crossing Time', hi: 'पार करने का समय' }, value: tCross.toFixed(1), unit: 's' },
      { symbol: 'x', label: { en: 'Downstream Drift', hi: 'बहाव (Drift)' }, value: drift.toFixed(1), unit: 'm' },
      { symbol: 'θ_0', label: { en: 'Zero-Drift Angle', hi: 'शून्य-बहाव कोण' }, value: vr <= vb ? `${((Math.asin(vr / vb) * 180) / Math.PI).toFixed(1)}°` : 'Impossible', unit: '' },
    ],
    graphPoints,
    graphCurrentPoint: { x: thetaDeg, y: tCross },
    graphXRange: [0, 75],
    graphYRange: [0, Math.min(200, (d / vb) * 4)],
  };
}

// 2. BANKING OF ROADS
function renderBankingRoads(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const R = params.R ?? 80;
  const thetaDeg = params.theta ?? 15;
  const mu = params.mu ?? 0.25;
  const v = params.v ?? 18;
  const g = 9.8;
  const th = (thetaDeg * Math.PI) / 180;
  const tanT = Math.tan(th);

  const vOpt = Math.sqrt(R * g * tanT);
  const denom = 1 - mu * tanT;
  const vMax = denom > 0.05 ? Math.sqrt((R * g * (mu + tanT)) / denom) : 99;
  const status = v > vMax ? 'SKIDDING OUT!' : v < vOpt * 0.96 ? 'SAFE (f UP)' : v > vOpt * 1.04 ? 'SAFE (f DOWN)' : 'OPTIMUM (f = 0)';

  if (state.t === undefined) state.t = 0;
  if (isPlaying) state.t += dt;

  const cx = width * 0.5;
  const cy = height * 0.62;
  const roadLen = 280;

  // Horizontal reference ground
  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - roadLen * 0.55, cy + 40);
  ctx.lineTo(cx + roadLen * 0.55, cy + 40);
  ctx.stroke();
  ctx.restore();

  // Banked wedge
  const xL = cx - roadLen * 0.5;
  const yL = cy + 40;
  const xR = xL + roadLen * Math.cos(th);
  const yR = yL - roadLen * Math.sin(th);

  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(xL, yL);
  ctx.lineTo(xR, yR);
  ctx.lineTo(xR, yL);
  ctx.closePath();
  ctx.stroke();

  // Angle label
  ctx.fillStyle = p.ink;
  ctx.font = 'bold 13px "IBM Plex Mono", monospace';
  ctx.fillText(`θ = ${thetaDeg}°`, xL + 36, yL - 10);

  // Car on incline (rear view)
  const skidOffset = v > vMax ? Math.sin(state.t * 10) * 8 + 18 : 0;
  const midX = (xL + xR) * 0.5 + skidOffset * Math.cos(th);
  const midY = (yL + yR) * 0.5 - skidOffset * Math.sin(th);

  ctx.save();
  ctx.translate(midX, midY);
  ctx.rotate(-th);
  ctx.fillStyle = p.bg;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.fillRect(-34, -36, 68, 28);
  ctx.strokeRect(-34, -36, 68, 28);
  ctx.strokeRect(-22, -52, 44, 16);
  // Wheels
  ctx.fillStyle = p.ink;
  ctx.fillRect(-30, -10, 12, 10);
  ctx.fillRect(18, -10, 12, 10);
  ctx.restore();

  if (showVectors) {
    const carCx = midX - 24 * Math.sin(th);
    const carCy = midY - 24 * Math.cos(th);
    drawVectorArrow(ctx, carCx, carCy, carCx, carCy + 75, p.ink, 'mg', 'solid');
    drawVectorArrow(ctx, carCx, carCy, carCx - 80 * Math.sin(th), carCy - 80 * Math.cos(th), p.ink, 'N', 'solid');
    drawVectorArrow(ctx, carCx, carCy, carCx - 72, carCy, p.ink, 'mv²/R', 'double');
    if (mu > 0 && Math.abs(v - vOpt) > 0.5) {
      const dir = v > vOpt ? -1 : 1; // down-incline if fast, up-incline if slow
      drawVectorArrow(
        ctx,
        midX,
        midY,
        midX + dir * 52 * Math.cos(th),
        midY - dir * 52 * Math.sin(th),
        p.ink,
        'f_s',
        'dashed'
      );
    }
  }

  // Status banner (high-contrast monochrome)
  ctx.fillStyle = v > vMax ? p.ink : p.surface;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.fillRect(20, 18, 230, 32);
  ctx.strokeRect(20, 18, 230, 32);
  ctx.fillStyle = v > vMax ? p.bg : p.ink;
  ctx.font = 'bold 12px "IBM Plex Mono", monospace';
  ctx.fillText(status, 32, 39);
  ctx.restore();

  const graphPoints: { x: number; y: number }[] = [];
  for (let a = 0; a <= 35; a += 1) {
    const t = Math.tan((a * Math.PI) / 180);
    const d = 1 - mu * t;
    const vm = d > 0.05 ? Math.sqrt((R * g * (mu + t)) / d) : 65;
    graphPoints.push({ x: a, y: Math.min(65, vm) });
  }

  return {
    substitutedFormula: `v_max = √(${R}·9.8·(${mu}+tan${thetaDeg}°)/(1−${mu}·tan${thetaDeg}°)) = ${vMax.toFixed(1)} m/s`,
    readouts: [
      { symbol: 'v_max', label: { en: 'Max Safe Speed', hi: 'अधिकतम सुरक्षित चाल' }, value: vMax.toFixed(1), unit: 'm/s' },
      { symbol: 'v_opt', label: { en: 'Optimum Speed (f=0)', hi: 'आदर्श चाल (f=0)' }, value: vOpt.toFixed(1), unit: 'm/s' },
      { symbol: 'a_c', label: { en: 'Centripetal Accel', hi: 'अभिकेंद्रीय त्वरण' }, value: ((v * v) / R).toFixed(2), unit: 'm/s²' },
      { symbol: 'State', label: { en: 'Turn Status', hi: 'मोड़ की स्थिति' }, value: v > vMax ? 'SKID' : 'SAFE', unit: '' },
    ],
    graphPoints,
    graphCurrentPoint: { x: thetaDeg, y: Math.min(65, vMax) },
    graphXRange: [0, 35],
    graphYRange: [0, 65],
  };
}

// 3. ATWOOD PULLEY MACHINE
function renderAtwoodPulley(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const m1 = params.m1 ?? 4;
  const m2 = params.m2 ?? 8;
  const g = params.g ?? 9.8;

  const a = ((m2 - m1) * g) / (m1 + m2);
  const T = (2 * m1 * m2 * g) / (m1 + m2);
  const Fhook = 2 * T;

  if (state.disp === undefined) {
    state.disp = 0;
    state.vel = 0;
    state.t = 0;
  }
  if (isPlaying) {
    state.t += dt;
    state.vel += a * dt * 0.45;
    state.disp += state.vel * dt * 42;
    if (Math.abs(state.disp) > 78) {
      state.disp = 0;
      state.vel = 0;
      state.t = 0;
    }
  }

  const cx = width * 0.5;
  const pulleyY = 92;
  const pulleyR = 36;

  // Ceiling support
  drawHatchRect(ctx, cx - 70, 22, 140, 18, p, 8);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, 40);
  ctx.lineTo(cx, pulleyY);
  ctx.stroke();

  // Pulley wheel
  ctx.fillStyle = p.bg;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(cx, pulleyY, pulleyR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Rotating spokes
  const rot = state.disp / pulleyR;
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const ang = rot + (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(cx, pulleyY);
    ctx.lineTo(cx + Math.cos(ang) * (pulleyR - 4), pulleyY + Math.sin(ang) * (pulleyR - 4));
    ctx.stroke();
  }

  const leftX = cx - pulleyR;
  const rightX = cx + pulleyR;
  const baseBlockY = height * 0.55;
  const y1 = baseBlockY - state.disp;
  const y2 = baseBlockY + state.disp;

  // Strings
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(leftX, pulleyY);
  ctx.lineTo(leftX, y1 - 24);
  ctx.moveTo(rightX, pulleyY);
  ctx.lineTo(rightX, y2 - 24);
  ctx.stroke();

  // Blocks
  const drawBlock = (bx: number, by: number, mass: number, lbl: string) => {
    const sz = 40 + Math.min(20, mass * 1.1);
    ctx.fillStyle = p.surface;
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 3;
    ctx.fillRect(bx - sz / 2, by - sz / 2, sz, sz);
    ctx.strokeRect(bx - sz / 2, by - sz / 2, sz, sz);
    ctx.fillStyle = p.ink;
    ctx.font = 'bold 13px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${lbl}=${mass}kg`, bx, by + 5);
    ctx.textAlign = 'left';
  };
  drawBlock(leftX, y1, m1, 'm₁');
  drawBlock(rightX, y2, m2, 'm₂');

  if (showVectors) {
    const tLen = Math.min(68, 20 + T * 0.45);
    drawVectorArrow(ctx, leftX, y1 - 24, leftX, y1 - 24 - tLen, p.ink, `T=${T.toFixed(0)}N`, 'dashed');
    drawVectorArrow(ctx, leftX, y1 + 24, leftX, y1 + 24 + Math.min(70, 18 + m1 * g * 0.35), p.ink, 'm₁g', 'solid');
    drawVectorArrow(ctx, rightX, y2 - 24, rightX, y2 - 24 - tLen, p.ink, `T=${T.toFixed(0)}N`, 'dashed');
    drawVectorArrow(ctx, rightX, y2 + 24, rightX, y2 + 24 + Math.min(70, 18 + m2 * g * 0.35), p.ink, 'm₂g', 'solid');
    if (Math.abs(a) > 0.05) {
      const sign = a > 0 ? 1 : -1;
      drawVectorArrow(ctx, rightX + 44, y2 - sign * 24, rightX + 44, y2 + sign * 24, p.ink, `a=${Math.abs(a).toFixed(1)}`, 'double');
    }
  }

  const graphPoints: { x: number; y: number }[] = [];
  for (let m = 1; m <= 20; m += 0.5) {
    graphPoints.push({ x: m, y: ((m - m1) * g) / (m + m1) });
  }

  return {
    substitutedFormula: `a = (${m2}−${m1})·${g}/(${m1}+${m2}) = ${a.toFixed(2)} m/s²  |  T = ${T.toFixed(1)} N`,
    readouts: [
      { symbol: 'a', label: { en: 'Acceleration', hi: 'त्वरण' }, value: a.toFixed(2), unit: 'm/s²' },
      { symbol: 'T', label: { en: 'String Tension', hi: 'डोरी तनाव' }, value: T.toFixed(1), unit: 'N' },
      { symbol: '2T', label: { en: 'Pulley Hook Load', hi: 'घिरनी हुक भार' }, value: Fhook.toFixed(1), unit: 'N' },
      { symbol: 'W_tot', label: { en: 'Static Weight', hi: 'स्थिर कुल भार' }, value: ((m1 + m2) * g).toFixed(1), unit: 'N' },
    ],
    graphPoints,
    graphCurrentPoint: { x: m2, y: a },
    graphXRange: [1, 20],
    graphYRange: [-g, g],
  };
}

// 4. ROLLING WITHOUT SLIPPING RACE
function renderRollingIncline(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const thetaDeg = params.theta ?? 25;
  const beta = params.beta ?? 0.4;
  const L = params.L ?? 10;
  const g = params.g ?? 9.8;
  const th = (thetaDeg * Math.PI) / 180;

  const aSel = (g * Math.sin(th)) / (1 + beta);
  const vEnd = Math.sqrt((2 * g * L * Math.sin(th)) / (1 + beta));
  const tEnd = Math.sqrt((2 * L) / Math.max(0.1, aSel));

  if (state.t === undefined) state.t = 0;
  if (isPlaying) {
    state.t += dt * 1.2;
    const tRing = Math.sqrt((2 * L) / Math.max(0.1, (g * Math.sin(th)) / 2));
    if (state.t > tRing + 0.8) state.t = 0;
  }

  // Draw 3 racing lanes: Solid Sphere (0.4), Selected Body (beta), Hollow Ring (1.0)
  const racers = [
    { name: 'Sphere (2/5)', b: 0.4, offsetY: -62, active: Math.abs(beta - 0.4) < 0.05 },
    { name: `Selected (${beta.toFixed(1)})`, b: beta, offsetY: 0, active: true },
    { name: 'Ring (1.0)', b: 1.0, offsetY: 62, active: Math.abs(beta - 1.0) < 0.05 },
  ];

  const startX = 76;
  const rampPx = Math.min(width - 150, 420);
  const dx = rampPx * Math.cos(th);
  const dy = rampPx * Math.sin(th);

  for (const r of racers) {
    const baseY = height * 0.34 + r.offsetY;
    // Ramp line
    ctx.strokeStyle = r.active ? p.ink : p.inkMuted;
    ctx.lineWidth = r.active ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(startX, baseY);
    ctx.lineTo(startX + dx, baseY + dy);
    ctx.stroke();

    const acc = (g * Math.sin(th)) / (1 + r.b);
    const dist = Math.min(L, 0.5 * acc * state.t * state.t);
    const frac = dist / L;
    const rad = 16;
    const rx = startX + dx * frac + rad * Math.sin(th);
    const ry = baseY + dy * frac - rad * Math.cos(th);
    const spin = (dist * 30) / rad;

    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(spin);
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = r.b >= 0.9 ? 4.5 : 2.5;
    ctx.fillStyle = r.b <= 0.45 ? p.ink : p.bg;
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Spoke marker
    ctx.strokeStyle = r.b <= 0.45 ? p.bg : p.ink;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(rad - 2, 0);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = p.ink;
    ctx.font = r.active ? 'bold 12px "IBM Plex Mono", monospace' : '11px "IBM Plex Mono", monospace';
    ctx.fillText(`${r.name} · a=${acc.toFixed(2)}`, startX + dx + 10, baseY + dy + 4);

    if (showVectors && r.offsetY === 0) {
      drawVectorArrow(ctx, rx, ry, rx + 50 * Math.cos(th), ry + 50 * Math.sin(th), p.ink, 'a_cm', 'double');
      drawVectorArrow(ctx, rx, ry + rad, rx - 32 * Math.cos(th), ry + rad - 32 * Math.sin(th), p.ink, 'f_s', 'dashed');
    }
  }

  const graphPoints: { x: number; y: number }[] = [];
  for (let b = 0; b <= 1.0; b += 0.05) {
    graphPoints.push({ x: Number(b.toFixed(2)), y: (g * Math.sin(th)) / (1 + b) });
  }

  return {
    substitutedFormula: `a = ${g}·sin${thetaDeg}° / (1 + ${beta.toFixed(1)}) = ${aSel.toFixed(2)} m/s²`,
    readouts: [
      { symbol: 'a', label: { en: 'Rolling Accel', hi: 'लोटनिक त्वरण' }, value: aSel.toFixed(2), unit: 'm/s²' },
      { symbol: 'v', label: { en: 'Bottom Speed', hi: 'निचले सिरे पर चाल' }, value: vEnd.toFixed(2), unit: 'm/s' },
      { symbol: 't', label: { en: 'Time to Bottom', hi: 'नीचे पहुँचने का समय' }, value: tEnd.toFixed(2), unit: 's' },
      { symbol: 'K_rot', label: { en: 'Rotational Share', hi: 'घूर्णन ऊर्जा अंश' }, value: `${((beta / (1 + beta)) * 100).toFixed(0)}%`, unit: '' },
    ],
    graphPoints,
    graphCurrentPoint: { x: beta, y: aSel },
    graphXRange: [0, 1],
    graphYRange: [0, g * Math.sin(th) * 1.15],
  };
}

// 5. ESCAPE VELOCITY & ORBITAL VELOCITY (2D)
function renderEscapeVelocity(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const M = (params.M ?? 6.0) * 1e24;
  const R = (params.R ?? 6.4) * 1e6;
  const vLaunch = params.vLaunch ?? 11.2; // km/s

  const vo = Math.sqrt((G_CONST * M) / R) / 1000;
  const ve = Math.sqrt((2 * G_CONST * M) / R) / 1000;
  const ratio = vLaunch / ve;
  const gSurf = (G_CONST * M) / (R * R);

  const regime =
    vLaunch < vo * 0.96
      ? 'SUB-ORBITAL FALL'
      : Math.abs(vLaunch - vo) <= vo * 0.05
        ? 'CIRCULAR ORBIT'
        : vLaunch < ve * 0.98
          ? 'ELLIPTICAL ORBIT'
          : vLaunch <= ve * 1.03
            ? 'PARABOLIC ESCAPE!'
            : 'HYPERBOLIC ESCAPE!';

  if (state.t === undefined) state.t = 0;
  if (isPlaying) {
    state.t += dt * 0.9;
    if (state.t > 6.5) state.t = 0;
  }

  const cx = width * 0.42;
  const cy = height * 0.54;
  const planetR = 46;

  // Planet with latitude wireframe
  ctx.fillStyle = p.surface;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.lineWidth = 1.2;
  ctx.strokeStyle = p.inkMuted;
  ctx.beginPath();
  ctx.ellipse(cx, cy, planetR, planetR * 0.35, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Reference circular orbit ring (dotted)
  const orbitR = planetR + 28;
  ctx.save();
  ctx.setLineDash([4, 6]);
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Compute trajectory curve & rocket position
  const pts: { x: number; y: number }[] = [];
  const startX = cx;
  const startY = cy - orbitR;

  if (vLaunch < vo * 0.96) {
    // Sub-orbital arc crashing into planet
    const span = (vLaunch / vo) * Math.PI * 0.85;
    for (let i = 0; i <= 50; i++) {
      const f = i / 50;
      const ang = -Math.PI / 2 + f * span;
      const rad = orbitR * (1 - f * 0.42);
      pts.push({ x: cx + rad * Math.cos(ang), y: cy + rad * Math.sin(ang) });
    }
  } else if (vLaunch < ve * 0.98) {
    // Bound circular or elliptical orbit
    const e = Math.min(0.68, Math.max(0, (vLaunch * vLaunch) / (vo * vo) - 1));
    const aSemi = orbitR / (1 - e);
    const bSemi = aSemi * Math.sqrt(1 - e * e);
    const focusShift = aSemi * e;
    for (let i = 0; i <= 80; i++) {
      const ang = -Math.PI / 2 + (i / 80) * Math.PI * 2;
      const x = cx + bSemi * Math.cos(ang);
      const y = cy + focusShift + aSemi * Math.sin(ang);
      pts.push({ x, y });
    }
  } else {
    // Parabolic / Hyperbolic escape curve shooting away from planet
    const flare = Math.min(1.8, (vLaunch / ve));
    for (let i = 0; i <= 60; i++) {
      const s = (i / 60) * 3.2;
      const x = startX + s * 95;
      const y = startY + (s * s * 42) / (flare * flare);
      pts.push({ x, y });
    }
  }

  // Draw trajectory
  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.5;
  ctx.setLineDash(vLaunch >= ve * 0.98 ? [10, 5] : []);
  ctx.beginPath();
  pts.forEach((pt, idx) => (idx === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
  ctx.stroke();
  ctx.restore();

  // Moving rocket dot
  const idx = Math.min(pts.length - 1, Math.floor(((state.t % 4.5) / 4.5) * pts.length));
  const rPt = pts[idx] ?? { x: startX, y: startY };
  const nPt = pts[Math.min(pts.length - 1, idx + 1)] ?? rPt;
  const heading = Math.atan2(nPt.y - rPt.y, nPt.x - rPt.x);

  ctx.save();
  ctx.translate(rPt.x, rPt.y);
  ctx.rotate(heading);
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.moveTo(12, 0);
  ctx.lineTo(-8, -6);
  ctx.lineTo(-5, 0);
  ctx.lineTo(-8, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (showVectors) {
    drawVectorArrow(ctx, startX, startY, startX + Math.min(110, vLaunch * 7), startY, p.ink, `v=${vLaunch.toFixed(1)}`, 'double');
    drawVectorArrow(ctx, rPt.x, rPt.y, rPt.x + (cx - rPt.x) * 0.35, rPt.y + (cy - rPt.y) * 0.35, p.ink, 'F_g', 'solid');
  }

  // Status badge
  ctx.fillStyle = vLaunch >= ve * 0.98 ? p.ink : p.surface;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.fillRect(18, 18, 225, 32);
  ctx.strokeRect(18, 18, 225, 32);
  ctx.fillStyle = vLaunch >= ve * 0.98 ? p.bg : p.ink;
  ctx.font = 'bold 12px "IBM Plex Mono", monospace';
  ctx.fillText(regime, 28, 39);

  const graphPoints: { x: number; y: number }[] = [];
  const graphSecondPoints: { x: number; y: number }[] = [];
  for (let rad6 = 1.5; rad6 <= 12; rad6 += 0.35) {
    const rM = rad6 * 1e6;
    graphPoints.push({ x: Number(rad6.toFixed(2)), y: Math.sqrt((2 * G_CONST * M) / rM) / 1000 });
    graphSecondPoints.push({ x: Number(rad6.toFixed(2)), y: Math.sqrt((G_CONST * M) / rM) / 1000 });
  }

  return {
    substitutedFormula: `v_e = √(2GM/R) = ${ve.toFixed(2)} km/s  |  v_o = ${vo.toFixed(2)} km/s  |  v/v_e = ${ratio.toFixed(2)}`,
    readouts: [
      { symbol: 'v_e', label: { en: 'Escape Velocity', hi: 'पलायन वेग' }, value: ve.toFixed(2), unit: 'km/s' },
      { symbol: 'v_o', label: { en: 'Orbital Velocity', hi: 'कक्षीय वेग' }, value: vo.toFixed(2), unit: 'km/s' },
      { symbol: 'g', label: { en: 'Surface Gravity', hi: 'पृष्ठ गुरुत्व' }, value: gSurf.toFixed(2), unit: 'm/s²' },
      { symbol: 'Path', label: { en: 'Trajectory', hi: 'पथ प्रकार' }, value: vLaunch >= ve * 0.98 ? 'ESCAPE' : vLaunch >= vo * 0.96 ? 'ORBIT' : 'FALL', unit: '' },
    ],
    graphPoints,
    graphSecondPoints,
    graphCurrentPoint: { x: params.R ?? 6.4, y: ve },
    graphLegend: { primary: 'Escape v_e', secondary: 'Orbital v_o' },
    graphXRange: [1.5, 12],
    graphYRange: [0, 30],
  };
}

// 6. KEPLER'S LAWS
function renderKeplersLaws(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const a = params.a ?? 1.5;
  const e = params.e ?? 0.55;
  const Mstar = params.Mstar ?? 1.0;

  const T = Math.sqrt((a * a * a) / Mstar);
  const rPeri = a * (1 - e);
  const rAph = a * (1 + e);

  if (state.theta === undefined) state.theta = 0;
  const rCurAU = (a * (1 - e * e)) / (1 + e * Math.cos(state.theta));
  const omega = (1.6 / (rCurAU * rCurAU)) * Math.sqrt(Mstar); // Kepler 2nd law: r²ω = const!
  if (isPlaying) {
    state.theta = (state.theta + Math.min(0.14, omega * dt)) % (Math.PI * 2);
  }

  const cx = width * 0.52;
  const cy = height * 0.5;
  const semiPxA = Math.min(width * 0.36, 175);
  const semiPxB = semiPxA * Math.sqrt(1 - e * e);
  const focusC = semiPxA * e;
  const sunX = cx + focusC;
  const sunY = cy;

  // Ellipse
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, semiPxA, semiPxB, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Equal-area swept wedges (Perihelion vs Aphelion)
  const drawWedge = (ang1: number, ang2: number, hatched: boolean) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    for (let i = 0; i <= 16; i++) {
      const th = ang1 + ((ang2 - ang1) * i) / 16;
      const rr = (semiPxA * (1 - e * e)) / (1 + e * Math.cos(th));
      ctx.lineTo(sunX + rr * Math.cos(th), sunY + rr * Math.sin(th));
    }
    ctx.closePath();
    ctx.fillStyle = hatched ? p.surface : p.gridMajor;
    ctx.fill();
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  };
  drawWedge(-0.32, 0.32, true);
  drawWedge(Math.PI - 0.12, Math.PI + 0.12, false);

  // Sun at right focus
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = p.bg;
  ctx.font = 'bold 11px "IBM Plex Mono", monospace';
  ctx.fillText('S', sunX - 4, sunY + 4);

  // Planet
  const rPx = (semiPxA * (1 - e * e)) / (1 + e * Math.cos(state.theta));
  const px = sunX + rPx * Math.cos(state.theta);
  const py = sunY + rPx * Math.sin(state.theta);
  ctx.fillStyle = p.bg;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(px, py, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const vRel = Math.sqrt(Mstar * (2 / rCurAU - 1 / a)) * 29.78;
  if (showVectors) {
    const tangAng = state.theta + Math.PI / 2;
    const vLen = Math.min(72, vRel * 1.4);
    drawVectorArrow(ctx, px, py, px + Math.cos(tangAng) * vLen, py + Math.sin(tangAng) * vLen, p.ink, 'v', 'double');
  }

  const graphPoints: { x: number; y: number }[] = [];
  for (let ax = 0.5; ax <= 4.0; ax += 0.15) {
    graphPoints.push({ x: Number(ax.toFixed(2)), y: Math.sqrt((ax * ax * ax) / Mstar) });
  }

  return {
    substitutedFormula: `T = √(${a}³ / ${Mstar}) = ${T.toFixed(2)} yr  |  v_now = ${vRel.toFixed(1)} km/s`,
    readouts: [
      { symbol: 'T', label: { en: 'Orbital Period', hi: 'परिक्रमण काल' }, value: T.toFixed(2), unit: 'yr' },
      { symbol: 'v', label: { en: 'Current Speed', hi: 'तात्कालिक चाल' }, value: vRel.toFixed(1), unit: 'km/s' },
      { symbol: 'r_p', label: { en: 'Perihelion', hi: 'उपसौर दूरी' }, value: rPeri.toFixed(2), unit: 'AU' },
      { symbol: 'r_a', label: { en: 'Aphelion', hi: 'अपसौर दूरी' }, value: rAph.toFixed(2), unit: 'AU' },
    ],
    graphPoints,
    graphCurrentPoint: { x: a, y: T },
    graphXRange: [0.5, 4.0],
    graphYRange: [0, 11],
  };
}

// 7. STOKES' LAW & TERMINAL VELOCITY
function renderStokesTerminal(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const rMm = params.r ?? 2.5;
  const r = rMm * 1e-3;
  const eta = params.eta ?? 0.9;
  const rho = params.rho ?? 7800;
  const sigma = params.sigma ?? 1250;
  const g = 9.8;

  const vt = Math.max(0.01, (2 * r * r * (rho - sigma) * g) / (9 * eta));
  const tau = (2 * r * r * rho) / (9 * eta);

  if (state.t === undefined) {
    state.t = 0;
    state.y = 0;
  }
  if (isPlaying) {
    state.t += dt;
    const vNow = vt * (1 - Math.exp(-state.t / Math.max(0.08, tau * 6)));
    state.y += vNow * dt * 220;
    if (state.y > height - 110) {
      state.y = 0;
      state.t = 0;
    }
  }
  const vCur = vt * (1 - Math.exp(-state.t / Math.max(0.08, tau * 6)));
  const Fv = 6 * Math.PI * eta * r * vCur;
  const W = (4 / 3) * Math.PI * r * r * r * rho * g;

  // Fluid cylinder
  const jarW = 190;
  const jarX = width * 0.5 - jarW / 2;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(jarX, 42, jarW, height - 80);

  // Horizontal depth markers
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  for (let k = 1; k <= 5; k++) {
    const yy = 42 + ((height - 80) * k) / 6;
    ctx.beginPath();
    ctx.moveTo(jarX, yy);
    ctx.lineTo(jarX + jarW, yy);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  const ballY = 66 + state.y;
  const ballR = 8 + rMm * 2.5;
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(width * 0.5, ballY, ballR, 0, Math.PI * 2);
  ctx.fill();

  if (showVectors) {
    const wLen = 58;
    const dragLen = Math.min(54, (vCur / vt) * 48);
    drawVectorArrow(ctx, width * 0.5, ballY + ballR, width * 0.5, ballY + ballR + wLen, p.ink, 'mg', 'solid');
    drawVectorArrow(ctx, width * 0.5 - 12, ballY - ballR, width * 0.5 - 12, ballY - ballR - dragLen, p.ink, 'F_v=6πηrv', 'dashed');
    drawVectorArrow(ctx, width * 0.5 + 16, ballY - ballR, width * 0.5 + 16, ballY - ballR - 18, p.ink, 'F_B', 'double');
  }

  const graphPoints: { x: number; y: number }[] = [];
  const tSpan = Math.max(0.5, tau * 30);
  for (let i = 0; i <= 40; i++) {
    const tt = (i / 40) * tSpan;
    graphPoints.push({ x: Number(tt.toFixed(2)), y: vt * (1 - Math.exp(-tt / Math.max(0.08, tau * 6))) });
  }

  return {
    substitutedFormula: `v_t = 2·(${rMm}mm)²·(${rho}−${sigma})·9.8 / (9·${eta}) = ${vt.toFixed(3)} m/s`,
    readouts: [
      { symbol: 'v_t', label: { en: 'Terminal Velocity', hi: 'सीमांत वेग' }, value: vt.toFixed(3), unit: 'm/s' },
      { symbol: 'v(t)', label: { en: 'Instant Speed', hi: 'तात्कालिक वेग' }, value: vCur.toFixed(3), unit: 'm/s' },
      { symbol: 'F_v', label: { en: 'Viscous Drag', hi: 'श्यान बल' }, value: formatPhysicsNumber(Fv), unit: 'N' },
      { symbol: 'W', label: { en: 'Sphere Weight', hi: 'गोले का भार' }, value: formatPhysicsNumber(W), unit: 'N' },
    ],
    graphPoints,
    graphCurrentPoint: { x: Math.min(tSpan, state.t), y: vCur },
    graphXRange: [0, tSpan],
    graphYRange: [0, vt * 1.15],
  };
}

// 8. CAPILLARY RISE
function renderCapillaryRise(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, showVectors } = rc;
  const T = (params.T ?? 73) * 1e-3;
  const rMm = params.r ?? 0.5;
  const r = rMm * 1e-3;
  const thetaDeg = params.theta ?? 0;
  const rho = params.rho ?? 1000;
  const g = 9.8;

  const hMeters = (2 * T * Math.cos((thetaDeg * Math.PI) / 180)) / (r * rho * g);
  const hCm = hMeters * 100;

  // Dish & Liquid bath
  const dishTop = height * 0.62;
  const dishBot = height - 32;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(width * 0.2, dishTop - 16, width * 0.6, dishBot - dishTop + 16);

  // Dish liquid hatch
  drawHatchRect(ctx, width * 0.2 + 2, dishTop, width * 0.6 - 4, dishBot - dishTop - 2, p, 12);

  // Capillary tube
  const tubeW = Math.max(18, Math.min(64, rMm * 28));
  const tubeX = width * 0.5 - tubeW / 2;
  const clampedPx = Math.max(-55, Math.min(130, hCm * 24));
  const meniscusY = dishTop - clampedPx;

  ctx.fillStyle = p.bg;
  ctx.fillRect(tubeX, 34, tubeW, dishBot - 52);

  // Liquid column inside tube
  ctx.fillStyle = p.ink;
  ctx.fillRect(tubeX + 2, meniscusY, tubeW - 4, dishBot - 18 - meniscusY);

  // Curved meniscus (concave if θ<90, convex if θ>90)
  ctx.fillStyle = thetaDeg < 90 ? p.bg : p.ink;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, meniscusY, tubeW / 2 - 2, thetaDeg < 90 ? 7 : 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tube walls
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(tubeX, 34);
  ctx.lineTo(tubeX, dishBot - 18);
  ctx.moveTo(tubeX + tubeW, 34);
  ctx.lineTo(tubeX + tubeW, dishBot - 18);
  ctx.stroke();

  if (showVectors) {
    drawVectorArrow(ctx, tubeX + tubeW + 24, dishTop, tubeX + tubeW + 24, meniscusY, p.ink, `h=${hCm.toFixed(2)}cm`, 'double');
  }

  const graphPoints: { x: number; y: number }[] = [];
  for (let rr = 0.2; rr <= 2.5; rr += 0.08) {
    const hc = ((2 * T * Math.cos((thetaDeg * Math.PI) / 180)) / (rr * 1e-3 * rho * g)) * 100;
    graphPoints.push({ x: Number(rr.toFixed(2)), y: Math.max(-10, Math.min(12, hc)) });
  }

  return {
    substitutedFormula: `h = 2·${(T * 1000).toFixed(0)}mN/m·cos${thetaDeg}° / (${rMm}mm·${rho}·9.8) = ${hCm.toFixed(2)} cm`,
    readouts: [
      { symbol: 'h', label: { en: 'Capillary Height', hi: 'केशिकीय ऊँचाई' }, value: hCm.toFixed(2), unit: 'cm' },
      { symbol: 'cosθ', label: { en: 'Meniscus Factor', hi: 'नवचंद्रक गुणांक' }, value: Math.cos((thetaDeg * Math.PI) / 180).toFixed(2), unit: '' },
      { symbol: 'Type', label: { en: 'Meniscus Shape', hi: 'नवचंद्रक आकार' }, value: thetaDeg < 90 ? 'CONCAVE ↑' : thetaDeg > 90 ? 'CONVEX ↓' : 'FLAT', unit: '' },
      { symbol: 'ΔP', label: { en: 'Laplace ΔP', hi: 'अतिरिक्त दाब' }, value: ((2 * T) / r).toFixed(0), unit: 'Pa' },
    ],
    graphPoints,
    graphCurrentPoint: { x: rMm, y: Math.max(-10, Math.min(12, hCm)) },
    graphXRange: [0.2, 2.5],
    graphYRange: [-6, 12],
  };
}

// 9. CARNOT HEAT ENGINE
function renderCarnotEngine(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const T1 = Math.max((params.T2 ?? 300) + 20, params.T1 ?? 600);
  const T2 = Math.min(T1 - 20, params.T2 ?? 300);
  const Q1 = params.Q1 ?? 1000;

  const eta = 1 - T2 / T1;
  const W = eta * Q1;
  const Q2 = Q1 - W;
  const cop = T2 / (T1 - T2);

  if (state.phase === undefined) state.phase = 0;
  if (isPlaying) state.phase = (state.phase + dt * 0.55) % 4;

  // Left: Energy Flow Sankey (Pure B&W)
  const fx = width * 0.24;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  // Hot Reservoir
  ctx.fillStyle = p.ink;
  ctx.fillRect(fx - 70, 32, 140, 44);
  ctx.fillStyle = p.bg;
  ctx.font = 'bold 13px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`HOT T₁=${T1}K`, fx, 59);

  // Engine circle
  const engY = height * 0.5;
  ctx.fillStyle = p.bg;
  ctx.beginPath();
  ctx.arc(fx, engY, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.fillText(`η=${(eta * 100).toFixed(0)}%`, fx, engY + 5);

  // Cold Sink
  ctx.fillStyle = p.surface;
  ctx.fillRect(fx - 70, height - 76, 140, 44);
  ctx.strokeRect(fx - 70, height - 76, 140, 44);
  ctx.fillStyle = p.ink;
  ctx.fillText(`SINK T₂=${T2}K`, fx, height - 49);
  ctx.textAlign = 'left';

  drawVectorArrow(ctx, fx, 78, fx, engY - 38, p.ink, `Q₁=${Q1}J`, 'solid');
  drawVectorArrow(ctx, fx, engY + 38, fx, height - 80, p.ink, `Q₂=${Q2.toFixed(0)}J`, 'dashed');
  drawVectorArrow(ctx, fx + 36, engY, fx + 110, engY, p.ink, `W=${W.toFixed(0)}J`, 'double');

  // Right: 4-stroke Carnot P-V Loop
  const gx = width * 0.56;
  const gy = 48;
  const gw = width * 0.36;
  const gh = height - 96;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(gx, gy);
  ctx.lineTo(gx, gy + gh);
  ctx.lineTo(gx + gw, gy + gh);
  ctx.stroke();
  ctx.font = 'bold 12px "IBM Plex Mono", monospace';
  ctx.fillStyle = p.ink;
  ctx.fillText('P', gx - 16, gy + 12);
  ctx.fillText('V', gx + gw - 8, gy + gh + 18);

  // Carnot corners A, B, C, D
  const A = { x: gx + gw * 0.16, y: gy + gh * 0.16 };
  const B = { x: gx + gw * 0.55, y: gy + gh * 0.36 };
  const C = { x: gx + gw * 0.85, y: gy + gh * 0.78 };
  const D = { x: gx + gw * 0.34, y: gy + gh * 0.62 };

  ctx.fillStyle = p.surface;
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.quadraticCurveTo(gx + gw * 0.32, gy + gh * 0.3, B.x, B.y);
  ctx.quadraticCurveTo(gx + gw * 0.68, gy + gh * 0.62, C.x, C.y);
  ctx.quadraticCurveTo(gx + gw * 0.56, gy + gh * 0.75, D.x, D.y);
  ctx.quadraticCurveTo(gx + gw * 0.22, gy + gh * 0.42, A.x, A.y);
  ctx.fill();
  ctx.lineWidth = 2.8;
  ctx.stroke();

  // Animated dot traversing A->B->C->D->A
  const corners = [A, B, C, D];
  const seg = Math.floor(state.phase) % 4;
  const frac = state.phase - Math.floor(state.phase);
  const c0 = corners[seg];
  const c1 = corners[(seg + 1) % 4];
  const dotX = c0.x + (c1.x - c0.x) * frac;
  const dotY = c0.y + (c1.y - c0.y) * frac;
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
  ctx.fill();

  const graphPoints: { x: number; y: number }[] = [];
  for (let t = Math.max(350, T2 + 20); t <= 1200; t += 25) {
    graphPoints.push({ x: t, y: (1 - T2 / t) * 100 });
  }

  return {
    substitutedFormula: `η = 1 − (${T2} / ${T1}) = ${(eta * 100).toFixed(1)}%  |  W = ${W.toFixed(0)} J`,
    readouts: [
      { symbol: 'η', label: { en: 'Carnot Efficiency', hi: 'कार्नोट दक्षता' }, value: (eta * 100).toFixed(1), unit: '%' },
      { symbol: 'W', label: { en: 'Net Work Output', hi: 'शुद्ध कार्य' }, value: W.toFixed(0), unit: 'J' },
      { symbol: 'Q₂', label: { en: 'Heat Rejected', hi: 'निष्कासित ऊष्मा' }, value: Q2.toFixed(0), unit: 'J' },
      { symbol: 'COP', label: { en: 'Reverse Fridge β', hi: 'प्रशीतक गुणांक' }, value: cop.toFixed(2), unit: '' },
    ],
    graphPoints,
    graphCurrentPoint: { x: T1, y: eta * 100 },
    graphXRange: [350, 1200],
    graphYRange: [0, 100],
  };
}

// 10. SIMPLE PENDULUM
function renderSimplePendulum(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const L = params.L ?? 1.0;
  const g = params.g ?? 9.8;
  const theta0Deg = params.theta0 ?? 20;
  const m = params.m ?? 1.0;

  const th0 = (theta0Deg * Math.PI) / 180;
  const omega = Math.sqrt(g / L);
  const T = 2 * Math.PI * Math.sqrt(L / g);

  if (state.t === undefined) state.t = 0;
  if (isPlaying) state.t += dt;

  const theta = th0 * Math.cos(omega * state.t);
  const thDot = -th0 * omega * Math.sin(omega * state.t);
  const vNow = Math.abs(L * thDot);
  const vMax = Math.sqrt(2 * g * L * (1 - Math.cos(th0)));

  const pivotX = width * 0.5;
  const pivotY = 44;
  const rodPx = 82 + L * 46;
  const bobX = pivotX + rodPx * Math.sin(theta);
  const bobY = pivotY + rodPx * Math.cos(theta);

  // Pivot support
  drawHatchRect(ctx, pivotX - 56, 22, 112, 22, p, 8);

  // Arc trace
  ctx.save();
  ctx.setLineDash([5, 6]);
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, rodPx, Math.PI / 2 - th0, Math.PI / 2 + th0);
  ctx.stroke();
  ctx.restore();

  // Vertical ref
  ctx.strokeStyle = p.gridMajor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(pivotX, pivotY + rodPx + 24);
  ctx.stroke();

  // Rod & bob
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(bobX, bobY);
  ctx.stroke();

  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(bobX, bobY, 14 + m * 1.6, 0, Math.PI * 2);
  ctx.fill();

  if (showVectors) {
    drawVectorArrow(ctx, bobX, bobY, bobX, bobY + 58, p.ink, 'mg', 'solid');
    drawVectorArrow(ctx, bobX, bobY, bobX - 54 * Math.sin(theta), bobY - 54 * Math.cos(theta), p.ink, 'T', 'dashed');
    const rest = -Math.sin(theta) * 68;
    if (Math.abs(rest) > 6) {
      drawVectorArrow(
        ctx,
        bobX,
        bobY,
        bobX + rest * Math.cos(theta),
        bobY - rest * Math.sin(theta),
        p.ink,
        '−mg·sinθ',
        'double'
      );
    }
  }

  const graphPoints: { x: number; y: number }[] = [];
  for (let len = 0.4; len <= 4.0; len += 0.12) {
    graphPoints.push({ x: Number(len.toFixed(2)), y: 2 * Math.PI * Math.sqrt(len / g) });
  }

  return {
    substitutedFormula: `T = 2π·√(${L} / ${g}) = ${T.toFixed(2)} s  |  f = ${(1 / T).toFixed(2)} Hz`,
    readouts: [
      { symbol: 'T', label: { en: 'Time Period', hi: 'आवर्तकाल' }, value: T.toFixed(2), unit: 's' },
      { symbol: 'v', label: { en: 'Current Speed', hi: 'तात्कालिक चाल' }, value: vNow.toFixed(2), unit: 'm/s' },
      { symbol: 'v_max', label: { en: 'Bottom Max Speed', hi: 'अधिकतम चाल' }, value: vMax.toFixed(2), unit: 'm/s' },
      { symbol: 'ω', label: { en: 'Angular Freq', hi: 'कोणीय आवृत्ति' }, value: omega.toFixed(2), unit: 'rad/s' },
    ],
    graphPoints,
    graphCurrentPoint: { x: L, y: T },
    graphXRange: [0.4, 4.0],
    graphYRange: [0, Math.max(5, 2 * Math.PI * Math.sqrt(4 / g) * 1.1)],
  };
}

// 11. DOPPLER EFFECT
function renderDopplerEffect(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const f0 = params.f0 ?? 500;
  const vs = params.vs ?? 80;
  const vo = params.vo ?? 0;
  const v = params.v ?? 340;

  const fApp = f0 * ((v + vo) / Math.max(10, v - vs));
  const lamFront = Math.max(0.05, (v - vs) / f0);
  const lamBack = (v + vs) / f0;

  if (state.t === undefined) state.t = 0;
  if (isPlaying) state.t += dt;

  const cy = height * 0.52;
  const sourceX = width * 0.42 + ((state.t * vs * 0.35) % 140) - 70;
  const obsX = width * 0.84;

  // Concentric shifted wavefront rings
  const ringCount = 9;
  const maxR = 230;
  const beta = Math.max(-0.85, Math.min(0.85, vs / v));
  for (let i = 0; i < ringCount; i++) {
    const phase = ((state.t * 1.4 + i / ringCount) % 1);
    const radius = phase * maxR;
    const centerShift = -beta * radius;
    ctx.strokeStyle = i % 2 === 0 ? p.ink : p.inkMuted;
    ctx.lineWidth = i % 2 === 0 ? 2.4 : 1.4;
    ctx.beginPath();
    ctx.arc(sourceX + centerShift, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Moving source box
  ctx.fillStyle = p.ink;
  ctx.fillRect(sourceX - 16, cy - 12, 32, 24);
  ctx.fillStyle = p.bg;
  ctx.font = 'bold 11px "IBM Plex Mono", monospace';
  ctx.fillText('S', sourceX - 4, cy + 4);

  // Observer icon
  ctx.fillStyle = p.bg;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(obsX, cy, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.fillText('O', obsX - 4, cy + 4);

  if (showVectors && Math.abs(vs) > 2) {
    drawVectorArrow(ctx, sourceX, cy - 26, sourceX + vs * 0.35, cy - 26, p.ink, `v_s=${vs}`, 'double');
  }

  const graphPoints: { x: number; y: number }[] = [];
  for (let sv = -150; sv <= 250; sv += 10) {
    graphPoints.push({ x: sv, y: Math.min(2000, f0 * ((v + vo) / Math.max(20, v - sv))) });
  }

  return {
    substitutedFormula: `f' = ${f0} · (${v}+${vo}) / (${v}−(${vs})) = ${fApp.toFixed(1)} Hz`,
    readouts: [
      { symbol: "f'", label: { en: 'Observed Pitch', hi: 'आभासी आवृत्ति' }, value: fApp.toFixed(1), unit: 'Hz' },
      { symbol: "λ'", label: { en: 'Front Wavelength', hi: 'अग्र तरंगदैर्घ्य' }, value: lamFront.toFixed(2), unit: 'm' },
      { symbol: 'λ_b', label: { en: 'Rear Wavelength', hi: 'पश्च तरंगदैर्घ्य' }, value: lamBack.toFixed(2), unit: 'm' },
      { symbol: 'Δf', label: { en: 'Doppler Shift', hi: 'आवृत्ति विस्थापन' }, value: `${fApp - f0 >= 0 ? '+' : ''}${(fApp - f0).toFixed(1)}`, unit: 'Hz' },
    ],
    graphPoints,
    graphCurrentPoint: { x: vs, y: Math.min(2000, fApp) },
    graphXRange: [-150, 250],
    graphYRange: [0, Math.min(2000, f0 * 3.8)],
  };
}
