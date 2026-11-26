import { LiveSimTelemetry, ThemeMode } from '../types/physics';
import {
  CanvasPalette,
  drawGrid,
  drawHatchRect,
  drawLegendPill,
  drawSpring,
  drawVectorArrow,
  getCanvasPalette,
} from '../utils/canvasHelpers';
import { formatPhysicsNumber } from '../utils/mathParser';
import { stepAndRenderExtendedSim } from './extendedEngines';

export interface SimRenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  simId: string;
  params: Record<string, number>;
  dt: number;
  isPlaying: boolean;
  showVectors: boolean;
  showGrid: boolean;
  theme: ThemeMode;
  state: Record<string, any>;
}

const G_CONST = 6.674e-11;
const K_COULOMB = 8.988e9;

export function resetBuiltinState(state: Record<string, any>) {
  Object.keys(state).forEach((k) => delete state[k]);
}

export function stepAndRenderBuiltinSim(rc: SimRenderContext): LiveSimTelemetry {
  const { ctx, width, height, simId, showGrid, theme } = rc;
  const palette = getCanvasPalette(theme);

  ctx.save();
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  if (showGrid) {
    drawGrid(ctx, width, height, palette, 44);
  }

  let telemetry: LiveSimTelemetry;
  const extendedTelemetry = stepAndRenderExtendedSim(rc, palette);
  if (extendedTelemetry) {
    ctx.restore();
    return extendedTelemetry;
  }

  switch (simId) {
    case 'gravitation':
      telemetry = renderGravitation(rc, palette);
      break;
    case 'newtons-force':
      telemetry = renderNewtonsForce(rc, palette);
      break;
    case 'linear-momentum':
      telemetry = renderLinearMomentum(rc, palette);
      break;
    case 'angular-momentum':
      telemetry = renderAngularMomentum(rc, palette);
      break;
    case 'projectile':
      telemetry = renderProjectile(rc, palette);
      break;
    case 'work-energy':
      telemetry = renderWorkEnergy(rc, palette);
      break;
    case 'shm-spring':
      telemetry = renderShmSpring(rc, palette);
      break;
    case 'wave-superposition':
      telemetry = renderWaveSuperposition(rc, palette);
      break;
    case 'coulombs-law':
      telemetry = renderCoulombsLaw(rc, palette);
      break;
    case 'ohms-law':
      telemetry = renderOhmsLaw(rc, palette);
      break;
    case 'lorentz-force':
      telemetry = renderLorentzForce(rc, palette);
      break;
    case 'thin-lens':
      telemetry = renderThinLens(rc, palette);
      break;
    default:
      telemetry = renderGravitation(rc, palette);
  }

  ctx.restore();
  return telemetry;
}

// 1. UNIVERSAL GRAVITATION & ORBITS
function renderGravitation(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const M = params.M ?? 6;
  const m = params.m ?? 5;
  const r0 = params.r ?? 10;
  const vFactor = params.vFactor ?? 1.0;

  const initKey = `${M}_${r0}_${vFactor}`;
  const cx = width * 0.48;
  const cy = height * 0.5;
  const pxPerUnit = Math.min(width, height) * 0.0175;
  const muScaled = M * 220;

  if (state.initKey !== initKey || state.x === undefined) {
    state.initKey = initKey;
    state.x = r0;
    state.y = 0;
    const vCirc = Math.sqrt(muScaled / r0);
    state.vx = 0;
    state.vy = -vCirc * vFactor;
    state.trail = [];
  }

  if (isPlaying && dt > 0) {
    const subSteps = 6;
    const h = dt / subSteps;
    for (let i = 0; i < subSteps; i++) {
      const dist = Math.max(2.2, Math.hypot(state.x, state.y));
      const acc = -muScaled / (dist * dist * dist);
      state.vx += acc * state.x * h;
      state.vy += acc * state.y * h;
      state.x += state.vx * h;
      state.y += state.vy * h;
    }
    state.trail.push({ x: state.x, y: state.y });
    if (state.trail.length > 260) state.trail.shift();

    const distNow = Math.hypot(state.x, state.y);
    if (distNow > 36 || distNow < 2.4) {
      state.x = r0;
      state.y = 0;
      const vCirc = Math.sqrt(muScaled / r0);
      state.vx = 0;
      state.vy = -vCirc * vFactor;
      state.trail = [];
    }
  }

  const rCur = Math.max(2.2, Math.hypot(state.x, state.y));
  const sx = cx + state.x * pxPerUnit;
  const sy = cy + state.y * pxPerUnit;

  // Reference circular orbit ring (dotted)
  ctx.save();
  ctx.strokeStyle = p.inkMuted;
  ctx.setLineDash([4, 6]);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(cx, cy, r0 * pxPerUnit, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Traveled orbital trail (bold dashed)
  if (state.trail.length > 1) {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < state.trail.length; i++) {
      const pt = state.trail[i];
      const tx = cx + pt.x * pxPerUnit;
      const ty = cy + pt.y * pxPerUnit;
      if (i === 0) ctx.moveTo(tx, ty);
      else ctx.lineTo(tx, ty);
    }
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2.6;
    ctx.setLineDash([8, 5]);
    ctx.stroke();
    ctx.restore();
  }

  // Distance line r
  ctx.save();
  ctx.strokeStyle = p.inkMuted;
  ctx.setLineDash([3, 4]);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(sx, sy);
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.fillText(`r=${rCur.toFixed(1)}×10⁶m`, (cx + sx) / 2 + 8, (cy + sy) / 2 - 8);
  ctx.restore();

  // Planet (solid high-contrast circle with double outline ring)
  const planetR = 20 + M * 0.9;
  ctx.beginPath();
  ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
  ctx.fillStyle = p.ink;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, planetR + 5, 0, Math.PI * 2);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.fillStyle = p.inkInvert;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`M=${M}`, cx, cy + 4.5);
  ctx.textAlign = 'left';

  // Satellite (crisp hollow ring with solid core)
  const satR = 8 + m * 0.35;
  ctx.beginPath();
  ctx.arc(sx, sy, satR, 0, Math.PI * 2);
  ctx.fillStyle = p.bg;
  ctx.fill();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = p.ink;
  ctx.fill();

  const F_newtons = (G_CONST * (M * 1e24) * (m * 1e3)) / Math.pow(rCur * 1e6, 2);
  const F_kN = F_newtons / 1000;
  const vOrbReal = Math.sqrt((G_CONST * M * 1e24) / (r0 * 1e6)) / 1000;
  const vEscReal = vOrbReal * Math.SQRT2;
  const vCurReal = vOrbReal * vFactor * (r0 / rCur);

  if (showVectors) {
    const ux = -state.x / rCur;
    const uy = -state.y / rCur;
    const fLen = Math.min(105, Math.max(30, Math.sqrt(F_kN) * 15));
    drawVectorArrow(ctx, sx, sy, sx + ux * fLen, sy + uy * fLen, p, `F_g=${F_kN.toFixed(1)}kN`, 'solid');

    const vMag = Math.hypot(state.vx, state.vy);
    if (vMag > 0.01) {
      const vLen = Math.min(94, Math.max(30, vMag * 5.8));
      drawVectorArrow(
        ctx,
        sx,
        sy,
        sx + (state.vx / vMag) * vLen,
        sy + (state.vy / vMag) * vLen,
        p,
        `v=${vCurReal.toFixed(2)}km/s`,
        'dashed'
      );
    }
  }

  drawLegendPill(ctx, 14, 14, 'F_g Gravity (Solid)', 'solid', p);
  drawLegendPill(ctx, 14, 46, 'v Velocity (Dashed)', 'dashed', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let rv = 5; rv <= 25; rv += 0.5) {
    const fk = (G_CONST * (M * 1e24) * (m * 1e3)) / Math.pow(rv * 1e6, 2) / 1000;
    graphPoints.push({ x: rv, y: fk });
  }
  const F_at_r0 = (G_CONST * (M * 1e24) * (m * 1e3)) / Math.pow(r0 * 1e6, 2) / 1000;

  return {
    substitutedFormula: `F = (6.67×10⁻¹¹ × ${M}×10²⁴ × ${m}×10³) / (${rCur.toFixed(1)}×10⁶)² = ${F_kN.toFixed(2)} kN`,
    readouts: [
      { symbol: 'F_g', label: { en: 'Gravitational Force', hi: 'गुरुत्वाकर्षण बल' }, value: F_kN.toFixed(2), unit: 'kN', accent: 'force' },
      { symbol: 'v_orb', label: { en: 'Circular Orbit Speed', hi: 'वृत्ताकार कक्षीय चाल' }, value: vOrbReal.toFixed(2), unit: 'km/s', accent: 'velocity' },
      { symbol: 'v_esc', label: { en: 'Escape Velocity', hi: 'पलायन वेग' }, value: vEscReal.toFixed(2), unit: 'km/s', accent: 'energy' },
      { symbol: 'g_loc', label: { en: 'Field Strength (GM/r²)', hi: 'गुरुत्वीय क्षेत्र तीव्रता' }, value: (F_newtons / (m * 1e3)).toFixed(2), unit: 'm/s²', accent: 'momentum' },
    ],
    graphPoints,
    graphCurrentPoint: { x: Math.min(25, Math.max(5, rCur)), y: F_kN },
    graphLegend: { primary: `F(r) at r₀ → ${F_at_r0.toFixed(1)} kN` },
  };
}

// 2. NEWTON'S SECOND LAW & FRICTION
function renderNewtonsForce(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const F = params.F ?? 50;
  const m = params.m ?? 5;
  const mu = params.mu ?? 0.2;
  const angleDeg = params.angle ?? 0;
  const g = 9.81;
  const rad = (angleDeg * Math.PI) / 180;

  const N = m * g * Math.cos(rad);
  const mgSin = m * g * Math.sin(rad);
  const fMax = mu * N;

  if (state.v === undefined) {
    state.v = 0;
    state.s = 0;
    state.t = 0;
    state.history = [];
  }

  let fFriction = 0;
  let fNet = 0;
  const driving = F - mgSin;

  if (Math.abs(state.v) < 0.05) {
    if (Math.abs(driving) <= fMax) {
      fFriction = -driving;
      fNet = 0;
      state.v = 0;
    } else {
      fFriction = -Math.sign(driving) * fMax;
      fNet = driving + fFriction;
    }
  } else {
    fFriction = -Math.sign(state.v) * fMax;
    fNet = driving + fFriction;
  }

  const a = fNet / m;

  if (isPlaying && dt > 0) {
    const prevV = state.v;
    state.v += a * dt;
    if (prevV !== 0 && Math.sign(prevV) !== Math.sign(state.v) && Math.abs(driving) <= fMax) {
      state.v = 0;
    }
    state.v = Math.max(-28, Math.min(35, state.v));
    state.s += state.v * dt;
    state.t += dt;

    if (state.history.length === 0 || state.t - state.history[state.history.length - 1].x >= 0.05) {
      state.history.push({ x: state.t, y: state.v });
      if (state.history.length > 120) state.history.shift();
    }
  }

  const cx = width * 0.5;
  const cy = height * 0.6;
  const trackLen = width * 0.78;
  const blockW = 62 + m * 1.8;
  const blockH = 48 + m * 1.1;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-rad);

  // Track surface (crisp monochrome rail + moving hatch ticks)
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-trackLen / 2, 0);
  ctx.lineTo(trackLen / 2, 0);
  ctx.stroke();

  const tickSpacing = 32;
  const offset = (((state.s * 24) % tickSpacing) + tickSpacing) % tickSpacing;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let tx = -trackLen / 2 + tickSpacing - offset; tx < trackLen / 2; tx += tickSpacing) {
    ctx.moveTo(tx, 0);
    ctx.lineTo(tx - 10, 14);
  }
  ctx.stroke();

  // Block (diagonal-hatched fill + bold inverted mass plaque)
  const bx = -blockW / 2;
  const by = -blockH;
  drawHatchRect(ctx, bx, by, blockW, blockH, 'diagonal', p, 6);

  // Crisp inner mass label plaque
  const lblW = 54;
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.roundRect(-lblW / 2, -blockH / 2 - 11, lblW, 22, 4);
  ctx.fill();
  ctx.fillStyle = p.inkInvert;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${m}kg`, 0, -blockH / 2 + 4.5);
  ctx.textAlign = 'left';

  if (showVectors) {
    const scale = 1.2;
    const midY = -blockH / 2;
    if (F > 0.5) {
      drawVectorArrow(ctx, blockW / 2, midY, blockW / 2 + Math.min(125, F * scale), midY, p, `F=${F}N`, 'solid');
    }
    if (Math.abs(fFriction) > 0.4) {
      const dir = Math.sign(fFriction);
      const startX = dir < 0 ? -blockW / 2 : blockW / 2;
      drawVectorArrow(
        ctx,
        startX,
        -8,
        startX + dir * Math.min(105, Math.abs(fFriction) * scale),
        -8,
        p,
        `f=${Math.abs(fFriction).toFixed(1)}N`,
        'dotted'
      );
    }
    drawVectorArrow(ctx, 0, -blockH, 0, -blockH - Math.min(95, N * 0.78), p, `N=${N.toFixed(0)}N`, 'double');
    if (Math.abs(state.v) > 0.15) {
      const vLen = Math.min(100, Math.abs(state.v) * 4.6) * Math.sign(state.v);
      drawVectorArrow(ctx, 0, -blockH - 18, vLen, -blockH - 18, p, `v=${state.v.toFixed(1)}m/s`, 'dashed');
    }
  }

  ctx.restore();

  if (showVectors) {
    const mgPx = Math.min(95, m * g * 0.78);
    const blockCenterX = cx - Math.sin(rad) * (blockH / 2);
    const blockCenterY = cy - Math.cos(rad) * (blockH / 2);
    drawVectorArrow(ctx, blockCenterX, blockCenterY, blockCenterX, blockCenterY + mgPx, p, `mg=${(m * g).toFixed(0)}N`, 'dotted');
  }

  if (angleDeg > 0) {
    ctx.save();
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cx - trackLen * 0.35, cy + Math.sin(rad) * trackLen * 0.35);
    ctx.lineTo(cx + 80, cy + Math.sin(rad) * trackLen * 0.35);
    ctx.stroke();
    ctx.fillStyle = p.ink;
    ctx.font = '700 14px "IBM Plex Mono", monospace';
    ctx.fillText(`θ = ${angleDeg}°`, cx - trackLen * 0.22, cy + Math.sin(rad) * trackLen * 0.35 - 10);
    ctx.restore();
  }

  drawLegendPill(ctx, 14, 14, 'F Applied (Solid)', 'solid', p);
  drawLegendPill(ctx, 14, 46, 'N Normal (Double)', 'double', p);
  drawLegendPill(ctx, 14, 78, 'f / mg (Dotted)', 'dotted', p);

  return {
    substitutedFormula: `a = (${F} − ${Math.abs(fFriction).toFixed(1)}${angleDeg > 0 ? ` − ${mgSin.toFixed(1)}` : ''}) / ${m} = ${a.toFixed(2)} m/s²`,
    readouts: [
      { symbol: 'a', label: { en: 'Acceleration', hi: 'त्वरण (a)' }, value: a.toFixed(2), unit: 'm/s²', accent: 'force' },
      { symbol: 'F_net', label: { en: 'Net Force', hi: 'परिणामी बल' }, value: fNet.toFixed(1), unit: 'N', accent: 'force' },
      { symbol: 'f', label: { en: 'Friction Force', hi: 'घर्षण बल' }, value: Math.abs(fFriction).toFixed(1), unit: 'N', accent: 'energy' },
      { symbol: 'v', label: { en: 'Live Velocity', hi: 'सजीव वेग' }, value: state.v.toFixed(1), unit: 'm/s', accent: 'velocity' },
    ],
    graphPoints: state.history.length ? state.history : [{ x: 0, y: 0 }],
    graphCurrentPoint: state.history.length ? state.history[state.history.length - 1] : { x: 0, y: 0 },
    graphLegend: { primary: 'Velocity v(t)' },
  };
}

// 3. LINEAR MOMENTUM & 1D COLLISIONS
function renderLinearMomentum(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const m1 = params.m1 ?? 4;
  const u1 = params.u1 ?? 6;
  const m2 = params.m2 ?? 4;
  const u2 = params.u2 ?? 0;
  const e = params.e ?? 1;

  const initKey = `${m1}_${u1}_${m2}_${u2}_${e}`;
  const trackY = height * 0.64;
  const w1 = 52 + m1 * 3.2;
  const w2 = 52 + m2 * 3.2;

  if (state.initKey !== initKey || state.x1 === undefined) {
    state.initKey = initKey;
    state.x1 = width * 0.22;
    state.x2 = width * 0.62;
    state.v1 = u1;
    state.v2 = u2;
    state.collided = false;
    state.flash = 0;
    state.t = 0;
    state.hist1 = [];
    state.hist2 = [];
  }

  const pxScale = 26;
  if (isPlaying && dt > 0) {
    state.x1 += state.v1 * pxScale * dt;
    state.x2 += state.v2 * pxScale * dt;
    state.t += dt;
    if (state.flash > 0) state.flash = Math.max(0, state.flash - dt * 2.5);

    if (!state.collided && state.x1 + w1 / 2 >= state.x2 - w2 / 2) {
      const overlap = state.x1 + w1 / 2 - (state.x2 - w2 / 2);
      state.x1 -= overlap / 2;
      state.x2 += overlap / 2;
      const v1New = ((m1 - e * m2) * state.v1 + (1 + e) * m2 * state.v2) / (m1 + m2);
      const v2New = ((m2 - e * m1) * state.v2 + (1 + e) * m1 * state.v1) / (m1 + m2);
      state.v1 = v1New;
      state.v2 = v2New;
      state.collided = true;
      state.flash = 1;
    }

    if (state.hist1.length === 0 || state.t - state.hist1[state.hist1.length - 1].x >= 0.04) {
      state.hist1.push({ x: state.t, y: m1 * state.v1 });
      state.hist2.push({ x: state.t, y: m2 * state.v2 });
      if (state.hist1.length > 100) {
        state.hist1.shift();
        state.hist2.shift();
      }
    }

    const outOfBounds = state.x1 < -w1 || state.x1 > width + w1 || state.x2 < -w2 || state.x2 > width + w2 || state.t > 7.5;
    if (outOfBounds) {
      state.x1 = width * 0.2;
      state.x2 = width * 0.62;
      state.v1 = u1;
      state.v2 = u2;
      state.collided = false;
      state.t = 0;
      state.hist1 = [];
      state.hist2 = [];
    }
  }

  // Track rail
  ctx.fillStyle = p.ink;
  ctx.fillRect(24, trackY, width - 48, 5);

  // Impact shock rings
  if (state.flash > 0) {
    const mx = (state.x1 + w1 / 2 + state.x2 - w2 / 2) / 2;
    ctx.save();
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 3;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(mx, trackY - 28, (1 - state.flash) * 52 + 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Cart 1: SOLID filled monochrome cart
  const h1 = 48;
  drawHatchRect(ctx, state.x1 - w1 / 2, trackY - h1 - 10, w1, h1, 'solid', p, 6);
  ctx.fillStyle = p.inkInvert;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`m₁=${m1}kg`, state.x1, trackY - h1 / 2 - 5);
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(state.x1 - w1 * 0.28, trackY - 5, 6, 0, Math.PI * 2);
  ctx.arc(state.x1 + w1 * 0.28, trackY - 5, 6, 0, Math.PI * 2);
  ctx.fill();

  // Cart 2: DIAGONAL-HATCHED distinct monochrome cart
  const h2 = 48;
  drawHatchRect(ctx, state.x2 - w2 / 2, trackY - h2 - 10, w2, h2, 'diagonal', p, 6);
  const badgeW = 64;
  ctx.fillStyle = p.bg;
  ctx.fillRect(state.x2 - badgeW / 2, trackY - h2 / 2 - 19, badgeW, 20);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(state.x2 - badgeW / 2, trackY - h2 / 2 - 19, badgeW, 20);
  ctx.fillStyle = p.ink;
  ctx.fillText(`m₂=${m2}kg`, state.x2, trackY - h2 / 2 - 4);
  ctx.beginPath();
  ctx.arc(state.x2 - w2 * 0.28, trackY - 5, 6, 0, Math.PI * 2);
  ctx.arc(state.x2 + w2 * 0.28, trackY - 5, 6, 0, Math.PI * 2);
  ctx.fillStyle = p.bg;
  ctx.fill();
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.textAlign = 'left';

  const p1 = m1 * state.v1;
  const p2 = m2 * state.v2;
  const pTotal = p1 + p2;
  const keTotal = 0.5 * m1 * state.v1 * state.v1 + 0.5 * m2 * state.v2 * state.v2;

  if (showVectors) {
    if (Math.abs(state.v1) > 0.08) {
      drawVectorArrow(ctx, state.x1, trackY - h1 - 28, state.x1 + state.v1 * 13, trackY - h1 - 28, p, `v₁=${state.v1.toFixed(1)}`, 'solid');
    }
    if (Math.abs(state.v2) > 0.08) {
      drawVectorArrow(ctx, state.x2, trackY - h2 - 28, state.x2 + state.v2 * 13, trackY - h2 - 28, p, `v₂=${state.v2.toFixed(1)}`, 'dashed');
    }
  }

  // Crisp phase header
  ctx.fillStyle = p.ink;
  ctx.font = '700 13.5px "IBM Plex Mono", monospace';
  ctx.fillText(
    state.collided ? `POST-COLLISION  ·  P_total = ${pTotal.toFixed(1)} kg·m/s (CONSERVED)` : `PRE-COLLISION  ·  P_total = ${pTotal.toFixed(1)} kg·m/s`,
    16,
    28
  );

  return {
    substitutedFormula: `P = (${m1}×${state.v1.toFixed(1)}) + (${m2}×${state.v2.toFixed(1)}) = ${pTotal.toFixed(1)} kg·m/s`,
    readouts: [
      { symbol: 'P_tot', label: { en: 'Total Momentum', hi: 'कुल संवेग (संरक्षित)' }, value: pTotal.toFixed(1), unit: 'kg·m/s', accent: 'momentum' },
      { symbol: 'p₁', label: { en: 'Cart 1 (Solid)', hi: 'गाड़ी 1 (ठोस)' }, value: p1.toFixed(1), unit: 'kg·m/s', accent: 'velocity' },
      { symbol: 'p₂', label: { en: 'Cart 2 (Hatched)', hi: 'गाड़ी 2 (धारीदार)' }, value: p2.toFixed(1), unit: 'kg·m/s', accent: 'momentum' },
      { symbol: 'KE', label: { en: 'Total Kinetic Energy', hi: 'कुल गतिज ऊर्जा' }, value: keTotal.toFixed(1), unit: 'J', accent: 'energy' },
    ],
    graphPoints: state.hist1.length ? state.hist1 : [{ x: 0, y: m1 * u1 }],
    graphSecondPoints: state.hist2.length ? state.hist2 : [{ x: 0, y: m2 * u2 }],
    graphLegend: { primary: 'p₁ Solid Line', secondary: 'p₂ Dashed Line' },
  };
}

// 4. CONSERVATION OF ANGULAR MOMENTUM (L = I * omega)
function renderAngularMomentum(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const rTarget = params.r ?? 1.4;
  const m = params.m ?? 3;
  const L = params.L ?? 24;
  const I_hub = 1.0;

  if (state.theta === undefined) {
    state.theta = 0;
    state.rSmooth = rTarget;
  }

  state.rSmooth += (rTarget - state.rSmooth) * Math.min(1, dt * 10 || 0.25);
  const r = state.rSmooth;

  const I = I_hub + 2 * m * r * r;
  const omega = L / I;
  const vTan = omega * r;
  const kRot = 0.5 * I * omega * omega;

  if (isPlaying && dt > 0) {
    state.theta = (state.theta + omega * dt) % (Math.PI * 2);
  }

  const cx = width * 0.5;
  const cy = height * 0.5;
  const maxPx = Math.min(width, height) * 0.37;
  const armPx = (r / 1.8) * maxPx;

  // Sweep circle (dashed)
  ctx.save();
  ctx.strokeStyle = p.inkMuted;
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(cx, cy, armPx, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Double-ring angular velocity spin arc
  const arcLen = Math.min(Math.PI * 1.45, omega * 0.22 + 0.45);
  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(cx, cy, 42, state.theta, state.theta + arcLen);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 48, state.theta, state.theta + arcLen);
  ctx.stroke();
  ctx.restore();

  // Rotating bar
  const xA = cx + Math.cos(state.theta) * armPx;
  const yA = cy + Math.sin(state.theta) * armPx;
  const xB = cx - Math.cos(state.theta) * armPx;
  const yB = cy - Math.sin(state.theta) * armPx;

  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(xA, yA);
  ctx.lineTo(xB, yB);
  ctx.stroke();

  // Central hub
  ctx.beginPath();
  ctx.arc(cx, cy, 20, 0, Math.PI * 2);
  ctx.fillStyle = p.ink;
  ctx.fill();
  ctx.fillStyle = p.inkInvert;
  ctx.font = '700 14px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('L', cx, cy + 5);
  ctx.textAlign = 'left';

  // Retractable masses (bold concentric rings)
  const massR = 13 + m * 1.1;
  [
    { x: xA, y: yA, sign: 1 },
    { x: xB, y: yB, sign: -1 },
  ].forEach(({ x, y, sign }) => {
    ctx.beginPath();
    ctx.arc(x, y, massR, 0, Math.PI * 2);
    ctx.fillStyle = p.bg;
    ctx.fill();
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, massR * 0.48, 0, Math.PI * 2);
    ctx.fillStyle = p.ink;
    ctx.fill();

    if (showVectors) {
      const tx = -Math.sin(state.theta) * sign;
      const ty = Math.cos(state.theta) * sign;
      const vLen = Math.min(86, Math.max(24, vTan * 8.5));
      drawVectorArrow(ctx, x, y, x + tx * vLen, y + ty * vLen, p, sign === 1 ? `v=${vTan.toFixed(1)}m/s` : undefined, 'dashed');
    }
  });

  if (showVectors) {
    drawVectorArrow(ctx, cx, cy, (cx + xA) / 2, (cy + yA) / 2, p, `r=${r.toFixed(2)}m`, 'solid');
  }

  drawLegendPill(ctx, 14, 14, `ω = ${omega.toFixed(2)} rad/s (Double Arc)`, 'double', p);
  drawLegendPill(ctx, 14, 46, `v Tangential (Dashed)`, 'dashed', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let rv = 0.3; rv <= 1.81; rv += 0.05) {
    const iv = I_hub + 2 * m * rv * rv;
    graphPoints.push({ x: rv, y: L / iv });
  }

  return {
    substitutedFormula: `L = I·ω = (${I.toFixed(2)}) × (${omega.toFixed(2)}) = ${L.toFixed(1)} kg·m²/s`,
    readouts: [
      { symbol: 'ω', label: { en: 'Angular Velocity', hi: 'कोणीय वेग (ω)' }, value: omega.toFixed(2), unit: 'rad/s', accent: 'momentum' },
      { symbol: 'I', label: { en: 'Moment of Inertia', hi: 'जड़त्व आघूर्ण (I)' }, value: I.toFixed(2), unit: 'kg·m²', accent: 'energy' },
      { symbol: 'L', label: { en: 'Angular Momentum', hi: 'कोणीय संवेग (नियत)' }, value: L.toFixed(1), unit: 'kg·m²/s', accent: 'momentum' },
      { symbol: 'K_rot', label: { en: 'Rotational KE', hi: 'घूर्णन गतिज ऊर्जा' }, value: kRot.toFixed(1), unit: 'J', accent: 'force' },
    ],
    graphPoints,
    graphCurrentPoint: { x: r, y: omega },
    graphLegend: { primary: `ω(r) = L / (1 + 2mr²)` },
  };
}

// 5. PROJECTILE MOTION
function renderProjectile(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const u = params.u ?? 28;
  const thetaDeg = params.theta ?? 45;
  const g = params.g ?? 9.8;
  const rad = (thetaDeg * Math.PI) / 180;

  const vx0 = u * Math.cos(rad);
  const vy0 = u * Math.sin(rad);
  const T = (2 * vy0) / g;
  const R = vx0 * T;
  const H = (vy0 * vy0) / (2 * g);

  const initKey = `${u}_${thetaDeg}_${g}`;
  if (state.initKey !== initKey || state.t === undefined) {
    state.initKey = initKey;
    state.t = 0;
  }

  if (isPlaying && dt > 0) {
    state.t += dt;
    if (state.t > T + 0.6) state.t = 0;
  }

  const tClamped = Math.min(state.t, T);
  const x = vx0 * tClamped;
  const y = Math.max(0, vy0 * tClamped - 0.5 * g * tClamped * tClamped);
  const vy = vy0 - g * tClamped;

  const padL = 52;
  const padB = 46;
  const padT = 38;
  const padR = 36;
  const usableW = width - padL - padR;
  const usableH = height - padT - padB;
  const maxSpanX = Math.max(R * 1.12, 40);
  const maxSpanY = Math.max(H * 1.25, 18);
  const scale = Math.min(usableW / maxSpanX, usableH / maxSpanY);

  const groundY = height - padB;
  const toScreen = (mx: number, my: number) => ({
    sx: padL + mx * scale,
    sy: groundY - my * scale,
  });

  // Ground line
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(20, groundY);
  ctx.lineTo(width - 20, groundY);
  ctx.stroke();

  // Full predicted path (dotted)
  ctx.save();
  ctx.strokeStyle = p.inkMuted;
  ctx.setLineDash([4, 6]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 60; i++) {
    const ti = (T * i) / 60;
    const pt = toScreen(vx0 * ti, Math.max(0, vy0 * ti - 0.5 * g * ti * ti));
    if (i === 0) ctx.moveTo(pt.sx, pt.sy);
    else ctx.lineTo(pt.sx, pt.sy);
  }
  ctx.stroke();
  ctx.restore();

  // Traveled path (extra-bold solid)
  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  const steps = Math.max(2, Math.floor((tClamped / Math.max(T, 0.01)) * 60));
  for (let i = 0; i <= steps; i++) {
    const ti = (tClamped * i) / steps;
    const pt = toScreen(vx0 * ti, Math.max(0, vy0 * ti - 0.5 * g * ti * ti));
    if (i === 0) ctx.moveTo(pt.sx, pt.sy);
    else ctx.lineTo(pt.sx, pt.sy);
  }
  ctx.stroke();
  ctx.restore();

  // Peak H & Range R callouts
  const peakPt = toScreen(R / 2, H);
  const endPt = toScreen(R, 0);
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.fillText(`H=${H.toFixed(1)}m`, peakPt.sx - 30, peakPt.sy - 12);
  ctx.fillText(`R=${R.toFixed(1)}m`, endPt.sx - 34, groundY + 22);

  // Projectile ball
  const ball = toScreen(x, y);
  ctx.beginPath();
  ctx.arc(ball.sx, ball.sy, 10, 0, Math.PI * 2);
  ctx.fillStyle = p.ink;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(ball.sx, ball.sy, 4, 0, Math.PI * 2);
  ctx.fillStyle = p.inkInvert;
  ctx.fill();

  if (showVectors) {
    const vScale = 2.2;
    drawVectorArrow(ctx, ball.sx, ball.sy, ball.sx + vx0 * vScale, ball.sy, p, `vx=${vx0.toFixed(1)}`, 'dashed');
    if (Math.abs(vy) > 0.4) {
      drawVectorArrow(ctx, ball.sx, ball.sy, ball.sx, ball.sy - vy * vScale, p, `vy=${vy.toFixed(1)}`, 'dotted');
    }
    drawVectorArrow(ctx, ball.sx, ball.sy, ball.sx + vx0 * vScale, ball.sy - vy * vScale, p, `v`, 'solid', 3.2);
  }

  drawLegendPill(ctx, 14, 14, 'v Total (Solid)', 'solid', p);
  drawLegendPill(ctx, 14, 46, 'vx (Dashed) · vy (Dotted)', 'dashed', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let a = 5; a <= 85; a += 2) {
    const rVal = (u * u * Math.sin((2 * a * Math.PI) / 180)) / g;
    graphPoints.push({ x: a, y: rVal });
  }

  return {
    substitutedFormula: `R = (${u}² × sin(${2 * thetaDeg}°)) / ${g} = ${R.toFixed(1)} m`,
    readouts: [
      { symbol: 'R', label: { en: 'Horizontal Range', hi: 'क्षैतिज परास (R)' }, value: R.toFixed(1), unit: 'm', accent: 'momentum' },
      { symbol: 'H', label: { en: 'Max Height', hi: 'अधिकतम ऊँचाई (H)' }, value: H.toFixed(1), unit: 'm', accent: 'energy' },
      { symbol: 'T', label: { en: 'Time of Flight', hi: 'उड्डयन काल (T)' }, value: T.toFixed(2), unit: 's', accent: 'velocity' },
      { symbol: 'vy', label: { en: 'Live Vertical Speed', hi: 'सजीव ऊर्ध्वाधर वेग' }, value: vy.toFixed(1), unit: 'm/s', accent: 'force' },
    ],
    graphPoints,
    graphCurrentPoint: { x: thetaDeg, y: R },
    graphLegend: { primary: 'Range R(θ)' },
  };
}

// 6. WORK, ENERGY & POWER (ROLLER TRACK)
function renderWorkEnergy(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const m = params.m ?? 5;
  const h0 = params.h0 ?? 9;
  const g = params.g ?? 9.8;
  const damping = params.damping ?? 0;

  const initKey = `${h0}_${g}_${damping}`;
  const omegaBase = Math.sqrt(g / 4.5);

  if (state.initKey !== initKey || state.t === undefined) {
    state.initKey = initKey;
    state.t = 0;
    state.histK = [];
    state.histU = [];
  }

  if (isPlaying && dt > 0) {
    state.t += dt;
  }

  const decay = Math.exp(-damping * state.t * 1.4);
  const phase = omegaBase * state.t;
  const xNorm = -Math.cos(phase) * decay;
  const h = h0 * xNorm * xNorm;
  const E_init = m * g * h0;
  const E_mech = E_init * decay * decay;
  const U = m * g * h;
  const K = Math.max(0, E_mech - U);
  const E_th = Math.max(0, E_init - E_mech);
  const v = Math.sqrt((2 * K) / m) * (Math.sin(phase) >= 0 ? 1 : -1);

  if (isPlaying && dt > 0) {
    if (state.histK.length === 0 || state.t - state.histK[state.histK.length - 1].x >= 0.05) {
      state.histK.push({ x: state.t, y: K });
      state.histU.push({ x: state.t, y: U });
      if (state.histK.length > 100) {
        state.histK.shift();
        state.histU.shift();
      }
    }
  }

  const trackCx = width * 0.37;
  const trackHalfW = width * 0.29;
  const bottomY = height * 0.82;
  const maxHpx = height * 0.58;
  const topH = 12;

  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  for (let i = -30; i <= 30; i++) {
    const xn = i / 30;
    const sx = trackCx + xn * trackHalfW;
    const sy = bottomY - ((h0 * xn * xn) / topH) * maxHpx;
    if (i === -30) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.stroke();

  const bx = trackCx + xNorm * trackHalfW;
  const by = bottomY - (h / topH) * maxHpx;

  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(bx, bottomY);
  ctx.stroke();
  ctx.restore();

  // Ball
  ctx.beginPath();
  ctx.arc(bx, by - 12, 11 + m * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = p.ink;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bx, by - 12, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = p.inkInvert;
  ctx.fill();

  if (showVectors && Math.abs(v) > 0.2) {
    const slope = (2 * h0 * xNorm) / topH;
    const tx = 1 / Math.hypot(1, slope);
    const ty = -slope / Math.hypot(1, slope);
    const dir = Math.sign(v);
    const len = Math.min(78, Math.abs(v) * 4.8);
    drawVectorArrow(ctx, bx, by - 12, bx + tx * dir * len, by - 12 + ty * dir * len, p, `v=${Math.abs(v).toFixed(1)}`, 'dashed');
  }

  // Monochrome Hatch-Patterned Energy Bar Chart
  const barAreaX = width * 0.7;
  const barW = 32;
  const gap = 14;
  const barMaxH = height * 0.56;
  const bars = [
    { label: 'K', val: K, pat: 'solid' as const },
    { label: 'U', val: U, pat: 'diagonal' as const },
    { label: 'Th', val: E_th, pat: 'cross' as const },
    { label: 'E', val: E_init, pat: 'hollow' as const },
  ];

  bars.forEach((b, idx) => {
    const x = barAreaX + idx * (barW + gap);
    const frac = Math.min(1, b.val / Math.max(1, E_init));
    const bh = Math.max(2, frac * barMaxH);

    // Outer frame guide
    ctx.strokeStyle = p.gridMajor;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x, bottomY - barMaxH, barW, barMaxH);

    if (frac > 0.005) {
      drawHatchRect(ctx, x, bottomY - bh, barW, bh, b.pat, p, 3);
    }

    ctx.fillStyle = p.ink;
    ctx.font = '700 13px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(b.label, x + barW / 2, bottomY + 19);
  });
  ctx.textAlign = 'left';

  drawLegendPill(ctx, 14, 14, 'K Solid · U Hatch · Th Cross · E Outline', 'solid', p);

  return {
    substitutedFormula: `E = K + U = ${K.toFixed(0)} J + ${U.toFixed(0)} J = ${(K + U).toFixed(0)} J`,
    readouts: [
      { symbol: 'K', label: { en: 'Kinetic (Solid)', hi: 'गतिज ऊर्जा (ठोस)' }, value: K.toFixed(1), unit: 'J', accent: 'velocity' },
      { symbol: 'U', label: { en: 'Potential (Hatched)', hi: 'स्थितिज ऊर्जा (धारी)' }, value: U.toFixed(1), unit: 'J', accent: 'energy' },
      { symbol: 'v', label: { en: 'Live Speed', hi: 'सजीव चाल' }, value: Math.abs(v).toFixed(2), unit: 'm/s', accent: 'momentum' },
      { symbol: 'v_max', label: { en: 'Peak Speed √(2gh)', hi: 'अधिकतम चाल' }, value: Math.sqrt(2 * g * h0).toFixed(2), unit: 'm/s', accent: 'force' },
    ],
    graphPoints: state.histK.length ? state.histK : [{ x: 0, y: 0 }],
    graphSecondPoints: state.histU.length ? state.histU : [{ x: 0, y: E_init }],
    graphLegend: { primary: 'K(t) Solid', secondary: 'U(t) Dashed' },
  };
}

// 7. SIMPLE HARMONIC MOTION (SPRING-MASS)
function renderShmSpring(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const k = params.k ?? 35;
  const m = params.m ?? 2;
  const A = params.A ?? 1.2;
  const c = params.c ?? 0;

  const initKey = `${k}_${m}_${A}_${c}`;
  if (state.initKey !== initKey || state.t === undefined) {
    state.initKey = initKey;
    state.t = 0;
    state.x = A;
    state.v = 0;
    state.histX = [];
    state.histV = [];
  }

  if (isPlaying && dt > 0) {
    const sub = 6;
    const h = dt / sub;
    for (let i = 0; i < sub; i++) {
      const acc = (-k * state.x - c * state.v) / m;
      state.v += acc * h;
      state.x += state.v * h;
    }
    state.t += dt;
    if (state.histX.length === 0 || state.t - state.histX[state.histX.length - 1].x >= 0.03) {
      state.histX.push({ x: state.t, y: state.x });
      state.histV.push({ x: state.t, y: state.v * 0.25 });
      if (state.histX.length > 130) {
        state.histX.shift();
        state.histV.shift();
      }
    }
  }

  const omega = Math.sqrt(k / m);
  const T = (2 * Math.PI) / omega;
  const F = -k * state.x;

  const wallX = 52;
  const eqX = width * 0.54;
  const railY = height * 0.55;
  const pxPerMeter = width * 0.16;
  const bx = eqX + state.x * pxPerMeter;
  const boxSize = 48 + m * 2.5;

  // Hatched rigid wall & rail
  drawHatchRect(ctx, wallX - 20, railY - 82, 20, 120, 'diagonal', p, 0);
  ctx.fillStyle = p.ink;
  ctx.fillRect(wallX - 20, railY + boxSize / 2, width - wallX - 10, 5);

  // Equilibrium line
  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 1.8;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(eqX, railY - 92);
  ctx.lineTo(eqX, railY + boxSize / 2 + 26);
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.fillText('x = 0 (Equilibrium)', eqX - 72, railY - 98);
  ctx.restore();

  // Spring
  drawSpring(ctx, wallX, railY, bx - boxSize / 2, railY, 12, 18, p);

  // Mass block (solid inverted block)
  drawHatchRect(ctx, bx - boxSize / 2, railY - boxSize / 2, boxSize, boxSize, 'solid', p, 8);
  ctx.fillStyle = p.inkInvert;
  ctx.font = '700 14px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${m}kg`, bx, railY + 5);
  ctx.textAlign = 'left';

  if (showVectors) {
    if (Math.abs(F) > 0.5) {
      const fLen = Math.min(115, Math.abs(F) * 1.45) * Math.sign(F);
      drawVectorArrow(ctx, bx, railY - boxSize / 2 - 18, bx + fLen, railY - boxSize / 2 - 18, p, `F=${F.toFixed(1)}N`, 'solid');
    }
    if (Math.abs(state.v) > 0.1) {
      const vLen = Math.min(100, Math.abs(state.v) * 12.5) * Math.sign(state.v);
      drawVectorArrow(ctx, bx, railY + boxSize / 2 + 32, bx + vLen, railY + boxSize / 2 + 32, p, `v=${state.v.toFixed(1)}m/s`, 'dashed');
    }
  }

  drawLegendPill(ctx, 14, 14, 'F Restoring (Solid)', 'solid', p);
  drawLegendPill(ctx, 14, 46, 'v Velocity (Dashed)', 'dashed', p);

  return {
    substitutedFormula: `F = −(${k}) × (${state.x.toFixed(2)}) = ${F.toFixed(1)} N  |  T = ${T.toFixed(2)} s`,
    readouts: [
      { symbol: 'T', label: { en: 'Time Period', hi: 'आवर्तकाल (T)' }, value: T.toFixed(2), unit: 's', accent: 'momentum' },
      { symbol: 'F', label: { en: 'Restoring Force', hi: 'प्रत्यानयन बल' }, value: F.toFixed(1), unit: 'N', accent: 'force' },
      { symbol: 'x', label: { en: 'Displacement', hi: 'विस्थापन (x)' }, value: state.x.toFixed(2), unit: 'm', accent: 'energy' },
      { symbol: 'ω', label: { en: 'Angular Freq √(k/m)', hi: 'कोणीय आवृत्ति' }, value: omega.toFixed(2), unit: 'rad/s', accent: 'velocity' },
    ],
    graphPoints: state.histX.length ? state.histX : [{ x: 0, y: A }],
    graphSecondPoints: state.histV.length ? state.histV : [{ x: 0, y: 0 }],
    graphLegend: { primary: 'x(t) Solid', secondary: 'v(t) Dashed' },
  };
}

// 8. WAVES & SUPERPOSITION
function renderWaveSuperposition(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const f = params.f ?? 1.5;
  const lambda = params.lambda ?? 3.0;
  const A = params.A ?? 0.9;
  const phaseDeg = params.phase ?? 0;

  if (state.t === undefined) state.t = 0;
  if (isPlaying && dt > 0) state.t += dt;

  const v = f * lambda;
  const k = (2 * Math.PI) / lambda;
  const omega = 2 * Math.PI * f;
  const phi = (phaseDeg * Math.PI) / 180;
  const aNet = Math.sqrt(A * A + A * A + 2 * A * A * Math.cos(phi));

  const midY = height * 0.54;
  const ampPx = height * 0.16;
  const padX = 32;
  const spanMeters = 9;
  const pxPerMeter = (width - padX * 2) / spanMeters;

  ctx.strokeStyle = p.axis;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(padX, midY);
  ctx.lineTo(width - padX, midY);
  ctx.stroke();

  const drawCurve = (fn: (xm: number) => number, lineW: number, dash: number[] = [], muted = false) => {
    ctx.save();
    ctx.strokeStyle = muted ? p.inkMuted : p.ink;
    ctx.lineWidth = lineW;
    ctx.setLineDash(dash);
    ctx.beginPath();
    for (let i = 0; i <= 180; i++) {
      const xm = (spanMeters * i) / 180;
      const ym = fn(xm);
      const sx = padX + xm * pxPerMeter;
      const sy = midY - ym * ampPx;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.restore();
  };

  drawCurve((xm) => A * Math.sin(k * xm - omega * state.t), 2.2, [9, 6], true);
  drawCurve((xm) => A * Math.sin(k * xm - omega * state.t + phi), 2.2, [3, 5], true);
  drawCurve(
    (xm) => A * Math.sin(k * xm - omega * state.t) + A * Math.sin(k * xm - omega * state.t + phi),
    4.2,
    [],
    false
  );

  // Oscillator tracer bead
  const xmBead = 4.5;
  const yBead = A * Math.sin(k * xmBead - omega * state.t) + A * Math.sin(k * xmBead - omega * state.t + phi);
  const vyBead = -omega * A * Math.cos(k * xmBead - omega * state.t) - omega * A * Math.cos(k * xmBead - omega * state.t + phi);
  const bx = padX + xmBead * pxPerMeter;
  const by = midY - yBead * ampPx;

  ctx.beginPath();
  ctx.arc(bx, by, 8.5, 0, Math.PI * 2);
  ctx.fillStyle = p.ink;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = p.inkInvert;
  ctx.fill();

  if (showVectors && Math.abs(vyBead) > 0.2) {
    drawVectorArrow(ctx, bx, by, bx, by - Math.max(-70, Math.min(70, vyBead * 5.2)), p, `v_y`, 'solid');
  }

  // Wavelength caliper
  const wlPx = lambda * pxPerMeter;
  if (padX + wlPx < width - padX) {
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2.2;
    const byLine = height - 28;
    ctx.beginPath();
    ctx.moveTo(padX, byLine);
    ctx.lineTo(padX + wlPx, byLine);
    ctx.moveTo(padX, byLine - 7);
    ctx.lineTo(padX, byLine + 7);
    ctx.moveTo(padX + wlPx, byLine - 7);
    ctx.lineTo(padX + wlPx, byLine + 7);
    ctx.stroke();
    ctx.fillStyle = p.ink;
    ctx.font = '700 13px "IBM Plex Mono", monospace';
    ctx.fillText(`λ = ${lambda.toFixed(1)} m`, padX + wlPx / 2 - 36, byLine - 8);
  }

  drawLegendPill(ctx, 14, 14, 'y₁+y₂ Resultant (Thick Solid)', 'solid', p);
  drawLegendPill(ctx, 14, 46, 'y₁ (Dashed) · y₂ (Dotted)', 'dashed', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let d = 0; d <= 360; d += 10) {
    const rPhi = (d * Math.PI) / 180;
    graphPoints.push({ x: d, y: Math.sqrt(Math.max(0, 2 * A * A * (1 + Math.cos(rPhi)))) });
  }

  return {
    substitutedFormula: `v = f·λ = ${f} × ${lambda} = ${v.toFixed(2)} m/s  |  A_net = ${aNet.toFixed(2)} m`,
    readouts: [
      { symbol: 'v', label: { en: 'Wave Speed', hi: 'तरंग वेग (v)' }, value: v.toFixed(2), unit: 'm/s', accent: 'velocity' },
      { symbol: 'A_net', label: { en: 'Resultant Amplitude', hi: 'परिणामी आयाम' }, value: aNet.toFixed(2), unit: 'm', accent: 'momentum' },
      { symbol: 'T', label: { en: 'Time Period (1/f)', hi: 'आवर्तकाल (1/f)' }, value: (1 / f).toFixed(2), unit: 's', accent: 'energy' },
      { symbol: 'φ', label: { en: 'Phase Shift', hi: 'कलांतर (φ)' }, value: `${phaseDeg}`, unit: '°', accent: 'force' },
    ],
    graphPoints,
    graphCurrentPoint: { x: phaseDeg, y: aNet },
    graphLegend: { primary: 'Resultant Amplitude A_net(φ)' },
  };
}

// 9. COULOMB'S LAW & ELECTRIC FIELD
function renderCoulombsLaw(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const q1 = params.q1 ?? 6;
  const q2 = params.q2 ?? -6;
  const rCm = params.r ?? 24;

  if (state.pulse === undefined) state.pulse = 0;
  if (isPlaying && dt > 0) state.pulse = (state.pulse + dt * 1.6) % 1;

  const rMeters = rCm / 100;
  const F = (K_COULOMB * Math.abs(q1 * 1e-6 * q2 * 1e-6)) / (rMeters * rMeters);
  const E1 = (K_COULOMB * Math.abs(q1 * 1e-6)) / (rMeters * rMeters);
  const isAttract = q1 * q2 < 0;
  const isRepel = q1 * q2 > 0;

  const cx = width * 0.5;
  const cy = height * 0.54;
  const sepPx = ((rCm - 10) / 50) * (width * 0.44) + width * 0.16;
  const x1 = cx - sepPx / 2;
  const x2 = cx + sepPx / 2;

  if (showVectors) {
    const cols = 12;
    const rows = 6;
    for (let i = 1; i < cols; i++) {
      for (let j = 1; j < rows; j++) {
        const gx = (width * i) / cols;
        const gy = (height * j) / rows;
        const d1x = gx - x1;
        const d1y = gy - cy;
        const d2x = gx - x2;
        const d2y = gy - cy;
        const r1 = Math.hypot(d1x, d1y);
        const r2 = Math.hypot(d2x, d2y);
        if (r1 < 42 || r2 < 42) continue;

        const ex = (q1 * d1x) / Math.pow(r1, 3) + (q2 * d2x) / Math.pow(r2, 3);
        const ey = (q1 * d1y) / Math.pow(r1, 3) + (q2 * d2y) / Math.pow(r2, 3);
        const emag = Math.hypot(ex, ey);
        if (emag < 1e-7) continue;

        const ux = ex / emag;
        const uy = ey / emag;
        ctx.save();
        ctx.globalAlpha = Math.min(0.75, 0.25 + emag * 3800);
        drawVectorArrow(ctx, gx - ux * 7, gy - uy * 7, gx + ux * 13, gy + uy * 13, p, undefined, 'dotted', 1.6);
        ctx.restore();
      }
    }
  }

  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 1.8;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(x1, cy);
  ctx.lineTo(x2, cy);
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`r = ${rCm} cm`, cx, cy + 24);
  ctx.textAlign = 'left';
  ctx.restore();

  // Distinct Monochrome Charges: Positive (+) = SOLID filled circle, Negative (−) = THICK HOLLOW ring
  const drawCharge = (x: number, q: number, tag: string) => {
    const rad = 22 + Math.abs(q) * 0.9;
    if (q !== 0) {
      ctx.save();
      ctx.strokeStyle = p.ink;
      ctx.globalAlpha = (1 - state.pulse) * 0.5;
      ctx.lineWidth = 2;
      if (q < 0) ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(x, cy, rad + state.pulse * 32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(x, cy, rad, 0, Math.PI * 2);
    if (q > 0) {
      ctx.fillStyle = p.ink;
      ctx.fill();
      ctx.fillStyle = p.inkInvert;
    } else {
      ctx.fillStyle = p.bg;
      ctx.fill();
      ctx.strokeStyle = p.ink;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = p.ink;
    }
    ctx.font = '700 13.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${q > 0 ? '+' : ''}${q}μC`, x, cy + 5);
    ctx.fillStyle = p.ink;
    ctx.fillText(`${tag} ${q > 0 ? '(+Solid)' : q < 0 ? '(−Ring)' : '(0)'}`, x, cy + rad + 18);
    ctx.textAlign = 'left';
  };

  drawCharge(x1, q1, 'q₁');
  drawCharge(x2, q2, 'q₂');

  if (showVectors && F > 0.01) {
    const fLen = Math.min(104, Math.max(30, Math.sqrt(F) * 29));
    const dir1 = isAttract ? 1 : -1;
    const dir2 = isAttract ? -1 : 1;
    drawVectorArrow(ctx, x1, cy - 42, x1 + dir1 * fLen, cy - 42, p, `F₁₂=${F.toFixed(2)}N`, 'solid');
    drawVectorArrow(ctx, x2, cy - 42, x2 + dir2 * fLen, cy - 42, p, `F₂₁=${F.toFixed(2)}N`, 'solid');
  }

  drawLegendPill(
    ctx,
    14,
    14,
    isAttract ? 'ATTRACTION (● + / ○ −)' : isRepel ? 'REPULSION (Like Charges)' : 'NEUTRAL (F = 0)',
    'solid',
    p
  );

  const graphPoints: { x: number; y: number }[] = [];
  for (let rcVal = 10; rcVal <= 60; rcVal += 2) {
    const fv = (K_COULOMB * Math.abs(q1 * 1e-6 * q2 * 1e-6)) / Math.pow(rcVal / 100, 2);
    graphPoints.push({ x: rcVal, y: fv });
  }

  return {
    substitutedFormula: `F = 8.99×10⁹ × |${q1}μ × ${q2}μ| / (${rMeters.toFixed(2)})² = ${F.toFixed(2)} N`,
    readouts: [
      { symbol: 'F', label: { en: 'Coulomb Force', hi: 'स्थिरवैद्युत बल (F)' }, value: F.toFixed(2), unit: 'N', accent: 'energy' },
      { symbol: 'Type', label: { en: 'Interaction', hi: 'बल की प्रकृति' }, value: isAttract ? 'Attract' : isRepel ? 'Repel' : 'None', unit: '', accent: isAttract ? 'momentum' : 'force' },
      { symbol: 'E₁', label: { en: 'Field of q₁ at q₂', hi: 'q₁ का विद्युत क्षेत्र' }, value: formatPhysicsNumber(E1 / 1e5, 2), unit: '×10⁵ N/C', accent: 'velocity' },
    ],
    graphPoints,
    graphCurrentPoint: { x: rCm, y: F },
    graphLegend: { primary: 'Electrostatic Force F(r)' },
  };
}

// 10. OHM'S LAW & CIRCUIT POWER
function renderOhmsLaw(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const V = params.V ?? 12;
  const R = params.R ?? 6;
  const I = V / R;
  const P = V * I;

  if (state.phase === undefined) state.phase = 0;
  if (isPlaying && dt > 0) {
    state.phase = (state.phase + I * dt * 0.22) % 1;
  }

  const left = width * 0.18;
  const right = width * 0.82;
  const top = height * 0.24;
  const bottom = height * 0.78;
  const midX = (left + right) / 2;
  const midY = (top + bottom) / 2;

  // Circuit loop wire
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.5;
  ctx.strokeRect(left, top, right - left, bottom - top);

  // Moving current beads
  const perimW = right - left;
  const perimH = bottom - top;
  const totalLen = 2 * (perimW + perimH);
  const numDots = 20;

  for (let i = 0; i < numDots; i++) {
    const d = ((i / numDots + state.phase) % 1) * totalLen;
    let dx = left;
    let dy = top;
    if (d < perimW) {
      dx = left + d;
      dy = top;
    } else if (d < perimW + perimH) {
      dx = right;
      dy = top + (d - perimW);
    } else if (d < 2 * perimW + perimH) {
      dx = right - (d - perimW - perimH);
      dy = bottom;
    } else {
      dx = left;
      dy = bottom - (d - 2 * perimW - perimH);
    }
    ctx.beginPath();
    ctx.arc(dx, dy, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = p.bg;
    ctx.fill();
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2.6;
    ctx.stroke();
  }

  // Battery symbol
  ctx.fillStyle = p.bg;
  ctx.fillRect(left - 22, midY - 26, 44, 52);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(left - 20, midY - 10);
  ctx.lineTo(left + 20, midY - 10);
  ctx.stroke();
  ctx.lineWidth = 6.5;
  ctx.beginPath();
  ctx.moveTo(left - 11, midY + 12);
  ctx.lineTo(left + 11, midY + 12);
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.font = '700 14px "IBM Plex Mono", monospace';
  ctx.fillText(`+ ${V}V`, left - 74, midY - 4);

  // Resistor zig-zag
  ctx.fillStyle = p.bg;
  ctx.fillRect(midX - 58, bottom - 18, 116, 36);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(midX - 56, bottom);
  for (let i = 0; i < 6; i++) {
    ctx.lineTo(midX - 45 + i * 18, bottom + (i % 2 === 0 ? -14 : 14));
  }
  ctx.lineTo(midX + 56, bottom);
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.textAlign = 'center';
  ctx.fillText(`R = ${R} Ω`, midX, bottom + 32);

  // Monochrome Lamp with Radial Power Brightness Rays (100% crisp in pure B&W!)
  const rayStrength = Math.min(1, P / 96);
  const rayCount = Math.round(6 + rayStrength * 10);
  const rayLen = 10 + rayStrength * 28;
  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.2 + rayStrength * 1.4;
  for (let i = 0; i < rayCount; i++) {
    const ang = (i / rayCount) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(midX + Math.cos(ang) * 26, top + Math.sin(ang) * 26);
    ctx.lineTo(midX + Math.cos(ang) * (26 + rayLen), top + Math.sin(ang) * (26 + rayLen));
    ctx.stroke();
  }
  ctx.restore();

  ctx.beginPath();
  ctx.arc(midX, top, 22, 0, Math.PI * 2);
  ctx.fillStyle = rayStrength > 0.5 ? p.ink : p.bg;
  ctx.fill();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.2;
  ctx.stroke();
  ctx.fillStyle = rayStrength > 0.5 ? p.inkInvert : p.ink;
  ctx.font = '700 12.5px "IBM Plex Mono", monospace';
  ctx.fillText(`${P.toFixed(0)}W`, midX, top + 4.5);

  // Ammeter
  ctx.beginPath();
  ctx.arc(right, midY, 26, 0, Math.PI * 2);
  ctx.fillStyle = p.bg;
  ctx.fill();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.2;
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.fillText(`${I.toFixed(1)}A`, right, midY + 5);
  ctx.textAlign = 'left';

  if (showVectors) {
    drawVectorArrow(ctx, left + 38, top - 22, left + 114, top - 22, p, `I=${I.toFixed(2)}A`, 'double');
  }

  const graphPoints: { x: number; y: number }[] = [];
  for (let vv = 0; vv <= 24; vv += 2) {
    graphPoints.push({ x: vv, y: vv / R });
  }

  return {
    substitutedFormula: `I = V / R = ${V} / ${R} = ${I.toFixed(2)} A   |   P = ${P.toFixed(1)} W`,
    readouts: [
      { symbol: 'I', label: { en: 'Current (V/R)', hi: 'विद्युत धारा (I)' }, value: I.toFixed(2), unit: 'A', accent: 'velocity' },
      { symbol: 'P', label: { en: 'Power (V·I)', hi: 'विद्युत शक्ति (P)' }, value: P.toFixed(1), unit: 'W', accent: 'energy' },
      { symbol: 'H₁₀', label: { en: 'Heat in 10s (I²Rt)', hi: '10 सेकंड में ऊष्मा' }, value: (P * 10).toFixed(0), unit: 'J', accent: 'force' },
    ],
    graphPoints,
    graphCurrentPoint: { x: V, y: I },
    graphLegend: { primary: `I = V / ${R}Ω (Slope = 1/R)` },
  };
}

// 11. LORENTZ MAGNETIC FORCE (CYCLOTRON)
function renderLorentzForce(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const v = params.v ?? 5;
  const B = params.B ?? 0.8;
  const q = params.q ?? 1;
  const m = params.m ?? 2;

  ctx.save();
  ctx.fillStyle = p.inkMuted;
  ctx.globalAlpha = 0.55;
  ctx.font = '700 15px "IBM Plex Mono", monospace';
  for (let gx = 44; gx < width - 24; gx += 68) {
    for (let gy = 48; gy < height - 24; gy += 56) {
      ctx.fillText('⊗', gx, gy);
    }
  }
  ctx.restore();

  const cx = width * 0.5;
  const cy = height * 0.5;

  const isNeutral = q === 0;
  const rPhys = isNeutral ? 999 : (m * v) / (Math.abs(q) * B);
  const omega = isNeutral ? 0 : (q * B) / m;
  const radiusPx = isNeutral ? 0 : Math.min(Math.min(width, height) * 0.38, Math.max(30, rPhys * 11));

  if (state.angle === undefined) {
    state.angle = 0;
    state.straightX = 40;
  }

  if (isPlaying && dt > 0) {
    if (isNeutral) {
      state.straightX += v * 28 * dt;
      if (state.straightX > width - 30) state.straightX = 40;
    } else {
      state.angle = (state.angle + omega * 2.2 * dt) % (Math.PI * 2);
    }
  }

  let px = cx;
  let py = cy;
  let vDirX = 1;
  let vDirY = 0;

  if (isNeutral) {
    px = state.straightX;
    py = cy;
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([7, 6]);
    ctx.beginPath();
    ctx.moveTo(30, cy);
    ctx.lineTo(width - 30, cy);
    ctx.stroke();
    ctx.setLineDash([]);
  } else {
    ctx.save();
    ctx.strokeStyle = p.ink;
    ctx.setLineDash([8, 6]);
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(cx, cy, radiusPx, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    px = cx + Math.cos(state.angle) * radiusPx;
    py = cy + Math.sin(state.angle) * radiusPx;
    const sign = Math.sign(q);
    vDirX = -Math.sin(state.angle) * sign;
    vDirY = Math.cos(state.angle) * sign;
  }

  // Particle: (+) solid, (-) thick hollow ring
  ctx.beginPath();
  ctx.arc(px, py, 13, 0, Math.PI * 2);
  if (q > 0) {
    ctx.fillStyle = p.ink;
    ctx.fill();
    ctx.fillStyle = p.inkInvert;
  } else {
    ctx.fillStyle = p.bg;
    ctx.fill();
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.fillStyle = p.ink;
  }
  ctx.font = '700 15px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(q > 0 ? '+' : q < 0 ? '−' : '0', px, py + 5);
  ctx.textAlign = 'left';

  const forceScaled = Math.abs(q) * v * B;

  if (showVectors) {
    drawVectorArrow(ctx, px, py, px + vDirX * 64, py + vDirY * 64, p, `v=${v}`, 'dashed');
    if (!isNeutral) {
      const fDirX = (cx - px) / radiusPx;
      const fDirY = (cy - py) / radiusPx;
      drawVectorArrow(ctx, px, py, px + fDirX * 60, py + fDirY * 60, p, `F_B (⊥v)`, 'solid');
    }
  }

  drawLegendPill(ctx, 14, 14, `⊗ Field B=${B}T · F_B (Solid) · v (Dashed)`, 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let bv = 0.2; bv <= 2.05; bv += 0.1) {
    graphPoints.push({ x: bv, y: isNeutral ? 0 : (m * v) / (Math.abs(q) * bv) });
  }

  return {
    substitutedFormula: isNeutral
      ? `q = 0 → F = 0 (Undeflected Straight Path)`
      : `r = (${m} × ${v}) / (|${q}| × ${B}) = ${rPhys.toFixed(2)} units`,
    readouts: [
      { symbol: 'F_B', label: { en: 'Magnetic Force', hi: 'चुंबकीय बल (F_B)' }, value: forceScaled.toFixed(2), unit: '×q₀', accent: 'force' },
      { symbol: 'r', label: { en: 'Cyclotron Radius', hi: 'वृत्ताकार त्रिज्या (r)' }, value: isNeutral ? '∞' : rPhys.toFixed(2), unit: 'cm', accent: 'velocity' },
      { symbol: 'Sense', label: { en: 'Rotation Direction', hi: 'घूर्णन दिशा' }, value: q > 0 ? 'Clockwise' : q < 0 ? 'Counter-CW' : 'Straight', unit: '', accent: 'momentum' },
    ],
    graphPoints,
    graphCurrentPoint: isNeutral ? undefined : { x: B, y: rPhys },
    graphLegend: { primary: 'Radius r(B) = mv / (qB)' },
  };
}

// 12. THIN LENS FORMULA & RAY TRACING
function renderThinLens(rc: SimRenderContext, p: CanvasPalette): LiveSimTelemetry {
  const { ctx, width, height, params } = rc;
  let f = params.f ?? 15;
  if (Math.abs(f) < 4) f = f >= 0 ? 4 : -4;
  const uAbs = params.uAbs ?? 30;
  const ho = params.ho ?? 6;
  const u = -uAbs;

  const invV = 1 / f + 1 / u;
  const isAtFocus = Math.abs(invV) < 0.002;
  const v = isAtFocus ? 9999 : 1 / invV;
  const mag = isAtFocus ? 99 : v / u;
  const hi = mag * ho;
  const power = 100 / f;

  const cx = width * 0.5;
  const cy = height * 0.54;
  const pxPerCm = Math.min(width / 115, 7.2);
  const lensHalfH = height * 0.35;

  // Principal optical axis
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, cy);
  ctx.lineTo(width - 20, cy);
  ctx.stroke();

  // Focal markers
  const markers = [
    { x: -2 * Math.abs(f), lbl: '2F' },
    { x: -Math.abs(f), lbl: 'F' },
    { x: Math.abs(f), lbl: "F'" },
    { x: 2 * Math.abs(f), lbl: "2F'" },
  ];
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  markers.forEach((mk) => {
    const mx = cx + mk.x * pxPerCm;
    if (mx > 20 && mx < width - 20) {
      ctx.beginPath();
      ctx.arc(mx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(mk.lbl, mx, cy + 20);
    }
  });
  ctx.textAlign = 'left';

  // High-contrast Monochrome Lens contour
  ctx.save();
  ctx.fillStyle = p.fillSoft;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  if (f > 0) {
    ctx.moveTo(cx, cy - lensHalfH);
    ctx.quadraticCurveTo(cx + 24, cy, cx, cy + lensHalfH);
    ctx.quadraticCurveTo(cx - 24, cy, cx, cy - lensHalfH);
  } else {
    ctx.moveTo(cx - 14, cy - lensHalfH);
    ctx.lineTo(cx + 14, cy - lensHalfH);
    ctx.quadraticCurveTo(cx + 3, cy, cx + 14, cy + lensHalfH);
    ctx.lineTo(cx - 14, cy + lensHalfH);
    ctx.quadraticCurveTo(cx - 3, cy, cx - 14, cy - lensHalfH);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Object arrow (double-line)
  const objX = cx + u * pxPerCm;
  const objTopY = cy - ho * pxPerCm * 1.4;
  drawVectorArrow(ctx, objX, cy, objX, objTopY, p, `Object`, 'double');

  // Principal Rays
  const fRightX = cx + f * pxPerCm;
  const ray1EndX = width - 24;
  const ray1Slope = (cy - objTopY) / (fRightX - cx);
  const ray1EndY = objTopY + ray1Slope * (ray1EndX - cx);

  const ray2Slope = (cy - objTopY) / (cx - objX);
  const ray2EndY = cy + ray2Slope * (ray1EndX - cx);

  ctx.save();
  // Ray 1 (Solid)
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(objX, objTopY);
  ctx.lineTo(cx, objTopY);
  ctx.lineTo(ray1EndX, ray1EndY);
  ctx.stroke();

  // Ray 2 (Dashed through optical center)
  ctx.setLineDash([8, 5]);
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(objX, objTopY);
  ctx.lineTo(ray1EndX, ray2EndY);
  ctx.stroke();
  ctx.setLineDash([]);

  if (!isAtFocus) {
    const imgX = cx + v * pxPerCm;
    const imgTopY = cy - hi * pxPerCm * 1.4;

    if (v < 0) {
      ctx.setLineDash([3, 5]);
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(cx, objTopY);
      ctx.lineTo(imgX, imgTopY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (imgX > 16 && imgX < width - 16) {
      drawVectorArrow(
        ctx,
        imgX,
        cy,
        imgX,
        Math.max(24, Math.min(height - 24, imgTopY)),
        p,
        v > 0 ? 'Real Image' : 'Virtual Image',
        v > 0 ? 'solid' : 'dashed'
      );
    }
  }
  ctx.restore();

  drawLegendPill(
    ctx,
    14,
    14,
    `${f > 0 ? 'Convex (+f)' : 'Concave (−f)'} · ${isAtFocus ? 'Image at ∞' : v > 0 ? 'Real Inverted (Solid)' : 'Virtual Upright (Dashed)'}`,
    'solid',
    p
  );

  const graphPoints: { x: number; y: number }[] = [];
  for (let ua = 6; ua <= 55; ua += 1.5) {
    const iv = 1 / f - 1 / ua;
    if (Math.abs(iv) > 0.015) {
      const vv = 1 / iv;
      if (Math.abs(vv) < 120) graphPoints.push({ x: ua, y: vv });
    }
  }

  return {
    substitutedFormula: `1/v = 1/(${f}) + 1/(${u}) → v = ${isAtFocus ? '∞' : `${v.toFixed(1)} cm`}`,
    readouts: [
      { symbol: 'v', label: { en: 'Image Distance', hi: 'प्रतिबिंब दूरी (v)' }, value: isAtFocus ? '∞' : v.toFixed(1), unit: 'cm', accent: 'force' },
      { symbol: 'm', label: { en: 'Magnification (v/u)', hi: 'आवर्धन (m)' }, value: isAtFocus ? '∞' : mag.toFixed(2), unit: '×', accent: 'energy' },
      { symbol: 'P', label: { en: 'Lens Power', hi: 'लेंस की क्षमता' }, value: power.toFixed(2), unit: 'D', accent: 'velocity' },
    ],
    graphPoints,
    graphCurrentPoint: !isAtFocus && Math.abs(v) < 120 ? { x: uAbs, y: v } : undefined,
    graphLegend: { primary: 'Image Distance v(|u|)' },
  };
}
