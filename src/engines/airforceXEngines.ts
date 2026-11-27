import { LiveSimTelemetry } from '../types/physics';
import {
  CanvasPalette,
  drawHatchRect,
  drawLegendPill,
  drawVectorArrow,
} from '../utils/canvasHelpers';
import { SimRenderContext } from './builtinEngines';

export function stepAndRenderAirforceXSim(
  rc: SimRenderContext,
  p: CanvasPalette
): LiveSimTelemetry | null {
  switch (rc.simId) {
    case 'communication-systems':
      return renderCommunicationSystems(rc, p);
    case 'transistor-zener':
      return renderTransistorZener(rc, p);
    case 'gravity-variation':
      return renderGravityVariation(rc, p);
    case 'blackbody-cooling':
      return renderBlackbodyCooling(rc, p);
    case 'organ-pipes-beats':
      return renderOrganPipesBeats(rc, p);
    case 'potentiometer-cells':
      return renderPotentiometerCells(rc, p);
    case 'eye-defects':
      return renderEyeDefects(rc, p);
    default:
      return null;
  }
}

// 1. COMMUNICATION SYSTEMS: AM MODULATION & LINE-OF-SIGHT ANTENNA RANGE
function renderCommunicationSystems(
  rc: SimRenderContext,
  p: CanvasPalette
): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const ma = params.ma ?? 0.6;
  const fm = params.fm ?? 5; // kHz
  const hT = params.hT ?? 160; // m
  const hR = params.hR ?? 40; // m

  if (state.t === undefined) state.t = 0;
  if (isPlaying) state.t += dt;
  const t = state.t as number;

  const R_EARTH = 6.4e6; // m
  const dT = Math.sqrt(2 * R_EARTH * hT) / 1000; // km
  const dR = Math.sqrt(2 * R_EARTH * hR) / 1000; // km
  const dMax = dT + dR;
  const powerRatio = 1 + (ma * ma) / 2;
  const bw = 2 * fm; // kHz
  const areaKm2 = Math.PI * dT * dT;

  // TOP HALF: Live AM Modulated Waveform + Envelope
  const waveLeft = width * 0.07;
  const waveW = width * 0.86;
  const waveCy = height * 0.28;
  const ampBase = height * 0.11;

  // Center axis
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(waveLeft, waveCy);
  ctx.lineTo(waveLeft + waveW, waveCy);
  ctx.stroke();
  ctx.setLineDash([]);

  // Upper & lower modulation envelope (dashed)
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.8;
  ctx.setLineDash([6, 4]);
  for (const sign of [1, -1]) {
    ctx.beginPath();
    for (let i = 0; i <= 140; i++) {
      const u = i / 140;
      const x = waveLeft + u * waveW;
      const env = ampBase * (1 + ma * Math.sin(u * Math.PI * 4 - t * 2.4));
      const y = waveCy - sign * env;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Carrier modulated signal (bold solid)
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  for (let i = 0; i <= 260; i++) {
    const u = i / 260;
    const x = waveLeft + u * waveW;
    const env = ampBase * (1 + ma * Math.sin(u * Math.PI * 4 - t * 2.4));
    const carrier = Math.sin(u * Math.PI * 44 - t * 14);
    const y = waveCy - env * carrier;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.font = '700 11px monospace';
  ctx.fillStyle = p.ink;
  ctx.fillText(
    ma > 1
      ? `AM WAVEFORM · OVER-MODULATED DISTORTION (m_a = ${ma.toFixed(2)} > 1)`
      : `AM WAVEFORM · m_a = ${ma.toFixed(2)} · BW = 2f_m = ${bw} kHz`,
    waveLeft,
    height * 0.1
  );

  // BOTTOM HALF: Curved Earth Horizon + Transmitter & Receiver Towers
  const arcCx = width * 0.5;
  const arcR = width * 1.15;
  const arcTopY = height * 0.78;
  const arcCy = arcTopY + arcR;

  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(arcCx, arcCy, arcR, -Math.PI * 0.62, -Math.PI * 0.38);
  ctx.stroke();

  const txX = width * 0.24;
  const txBaseY = arcCy - Math.sqrt(Math.max(1, arcR * arcR - (txX - arcCx) ** 2));
  const txH = 26 + (hT / 500) * 62;

  const rxX = width * 0.76;
  const rxBaseY = arcCy - Math.sqrt(Math.max(1, arcR * arcR - (rxX - arcCx) ** 2));
  const rxH = 14 + (hR / 200) * 44;

  // Draw Tx Tower
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(txX - 10, txBaseY);
  ctx.lineTo(txX, txBaseY - txH);
  ctx.lineTo(txX + 10, txBaseY);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(txX, txBaseY - txH, 4, 0, Math.PI * 2);
  ctx.fill();

  // Draw Rx Tower
  ctx.beginPath();
  ctx.moveTo(rxX - 8, rxBaseY);
  ctx.lineTo(rxX, rxBaseY - rxH);
  ctx.lineTo(rxX + 8, rxBaseY);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rxX, rxBaseY - rxH, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Line-of-Sight Radio Ray with moving pulse
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 5]);
  ctx.beginPath();
  ctx.moveTo(txX, txBaseY - txH);
  ctx.lineTo(rxX, rxBaseY - rxH);
  ctx.stroke();
  ctx.setLineDash([]);

  const pulseU = (t * 0.45) % 1;
  const px = txX + (rxX - txX) * pulseU;
  const py = txBaseY - txH + (rxBaseY - rxH - (txBaseY - txH)) * pulseU;
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '700 11px monospace';
  ctx.fillStyle = p.ink;
  ctx.fillText(`Tx: h_T = ${hT} m`, txX - 38, txBaseY + 18);
  ctx.fillText(`Rx: h_R = ${hR} m`, rxX - 38, rxBaseY + 18);
  ctx.fillText(`LOS d_max = ${dMax.toFixed(1)} km`, arcCx - 66, arcTopY - 12);

  drawLegendPill(ctx, 14, 14, `d_max = ${dMax.toFixed(1)} km | P_t/P_c = ${powerRatio.toFixed(2)}`, 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let h = 0; h <= 500; h += 20) {
    graphPoints.push({ x: h, y: Math.sqrt(2 * R_EARTH * h) / 1000 });
  }

  return {
    substitutedFormula: `d = √(2R·${hT}) + √(2R·${hR}) = ${dT.toFixed(1)} + ${dR.toFixed(1)} = ${dMax.toFixed(1)} km`,
    readouts: [
      { symbol: 'd_max', label: { en: 'Max LOS Range', hi: 'अधिकतम LOS परास' }, value: dMax.toFixed(1), unit: 'km' },
      { symbol: 'P_t/P_c', label: { en: 'Total/Carrier Power', hi: 'कुल/वाहक शक्ति' }, value: powerRatio.toFixed(2), unit: '×' },
      { symbol: 'BW', label: { en: 'AM Bandwidth', hi: 'AM बैंडचौड़ाई' }, value: bw.toFixed(0), unit: 'kHz' },
      { symbol: 'Area', label: { en: 'Tx Coverage Area', hi: 'प्रसारण क्षेत्रफल' }, value: areaKm2.toFixed(0), unit: 'km²' },
    ],
    graphPoints,
    graphCurrentPoint: { x: hT, y: dT },
    graphXRange: [0, 500],
    graphYRange: [0, 90],
  };
}

// 2. BJT CE TRANSISTOR AMPLIFIER & ZENER VOLTAGE REGULATOR
function renderTransistorZener(
  rc: SimRenderContext,
  p: CanvasPalette
): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const beta = params.beta ?? 100;
  const Ib_uA = params.Ib ?? 40;
  const RL = params.RL ?? 4; // kOhm
  const Rin = params.Rin ?? 1; // kOhm

  if (state.t === undefined) state.t = 0;
  if (isPlaying) state.t += dt;
  const t = state.t as number;

  const alpha = beta / (1 + beta);
  const Ic_mA = (beta * Ib_uA) / 1000;
  const Ie_mA = Ic_mA + Ib_uA / 1000;
  const Av = beta * (RL / Rin);
  const Ap = beta * Av;

  const cx = width * 0.48;
  const cy = height * 0.52;

  // Input tiny AC wave (left)
  const inX = width * 0.08;
  const inW = width * 0.22;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 80; i++) {
    const u = i / 80;
    const x = inX + u * inW;
    const y = cy - 16 * Math.sin(u * Math.PI * 4 - t * 4);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.font = '700 11px monospace';
  ctx.fillStyle = p.ink;
  ctx.fillText(`INPUT AC (I_B = ${Ib_uA} μA)`, inX, cy - 36);
  ctx.fillText('Phase: 0°', inX, cy + 42);

  // NPN Transistor Symbol in Center
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(cx, cy, 42, 0, Math.PI * 2);
  ctx.stroke();

  // Base vertical bar
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy - 22);
  ctx.lineTo(cx - 14, cy + 22);
  ctx.stroke();

  // Base, Collector, Emitter leads
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(cx - 56, cy);
  ctx.lineTo(cx - 14, cy);
  ctx.moveTo(cx - 14, cy - 10);
  ctx.lineTo(cx + 18, cy - 28);
  ctx.lineTo(cx + 18, cy - 66);
  ctx.moveTo(cx - 14, cy + 10);
  ctx.lineTo(cx + 18, cy + 28);
  ctx.lineTo(cx + 18, cy + 68);
  ctx.stroke();

  // Emitter outward arrow (NPN)
  drawVectorArrow(ctx, cx - 2, cy + 17, cx + 14, cy + 26, p, '');

  // Labels B, C, E
  ctx.font = '700 12px monospace';
  ctx.fillStyle = p.ink;
  ctx.fillText('B', cx - 58, cy - 8);
  ctx.fillText(`C (I_C=${Ic_mA.toFixed(2)}mA)`, cx + 26, cy - 52);
  ctx.fillText(`E (I_E=${Ie_mA.toFixed(2)}mA)`, cx + 26, cy + 64);
  ctx.fillText('NPN CE', cx - 24, cy + 56);

  // Output amplified & 180° inverted AC wave (right)
  const outX = width * 0.66;
  const outW = width * 0.27;
  const outAmp = Math.min(height * 0.27, 26 + (Av / 800) * (height * 0.2));
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const u = i / 100;
    const x = outX + u * outW;
    // 180-degree phase inversion (+sin instead of -sin)
    const y = cy + outAmp * Math.sin(u * Math.PI * 4 - t * 4);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.font = '700 11px monospace';
  ctx.fillStyle = p.ink;
  ctx.fillText(`OUTPUT AC · A_v = ${Av.toFixed(0)}×`, outX, cy - outAmp - 14);
  ctx.fillText('180° PHASE INVERTED', outX, cy + outAmp + 22);

  drawLegendPill(ctx, 14, 14, `α = ${alpha.toFixed(4)} | β = ${beta} | A_p = ${Ap.toLocaleString()}`, 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let a = 0.85; a <= 0.995; a += 0.005) {
    graphPoints.push({ x: Number(a.toFixed(3)), y: a / (1 - a) });
  }

  return {
    substitutedFormula: `α = ${beta}/(1+${beta}) = ${alpha.toFixed(4)}  |  A_v = ${beta}×(${RL}/${Rin}) = ${Av.toFixed(0)}`,
    readouts: [
      { symbol: 'α', label: { en: 'CB Current Gain', hi: 'CB धारा लाभ (α)' }, value: alpha.toFixed(4), unit: '' },
      { symbol: 'I_C', label: { en: 'Collector Current', hi: 'संग्राहक धारा' }, value: Ic_mA.toFixed(2), unit: 'mA' },
      { symbol: 'A_v', label: { en: 'Voltage Gain', hi: 'वोल्टेज लाभ' }, value: Av.toFixed(0), unit: '×' },
      { symbol: 'A_p', label: { en: 'Power Gain', hi: 'शक्ति लाभ' }, value: Ap >= 1000 ? `${(Ap / 1000).toFixed(1)}k` : Ap.toFixed(0), unit: '×' },
    ],
    graphPoints,
    graphCurrentPoint: { x: Number(alpha.toFixed(3)), y: beta },
    graphXRange: [0.85, 1.0],
    graphYRange: [0, 220],
  };
}

// 3. VARIATION OF GRAVITY g WITH ALTITUDE, DEPTH & LATITUDE
function renderGravityVariation(
  rc: SimRenderContext,
  p: CanvasPalette
): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, showVectors, state } = rc;
  const rRatio = params.rRatio ?? 1.0; // r/R in [0, 3]
  const latDeg = params.lat ?? 0;
  const spinFactor = params.spinFactor ?? 1;

  if (state.angle === undefined) state.angle = 0;
  if (isPlaying) state.angle += dt * (0.4 + spinFactor * 0.14);

  const g0 = 9.8;
  const gSpinEq = 0.0338 * spinFactor * spinFactor;
  const latRad = (latDeg * Math.PI) / 180;
  const gBase = rRatio <= 1 ? g0 * rRatio : g0 / (rRatio * rRatio);
  const gEff = Math.max(
    0,
    gBase - (rRatio <= 1 ? rRatio : 1) * gSpinEq * Math.cos(latRad) * Math.cos(latRad)
  );
  const pct = (gEff / g0) * 100;

  const cx = width * 0.34;
  const cy = height * 0.54;
  const Rpx = Math.min(width * 0.2, height * 0.33);

  // Outer atmosphere / orbit rings at 2R and 3R
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 4]);
  for (const mult of [2, 3]) {
    ctx.beginPath();
    ctx.arc(cx, cy, Rpx * mult * 0.65, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Earth Solid Sphere (Cross-section)
  ctx.fillStyle = p.surface;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, Rpx, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner core ring
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(cx, cy, Rpx * 0.35, 0, Math.PI * 2);
  ctx.stroke();

  // Polar axis & Equator line
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(cx, cy - Rpx - 22);
  ctx.lineTo(cx, cy + Rpx + 22);
  ctx.stroke();

  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(cx - Rpx - 16, cy);
  ctx.lineTo(cx + Rpx * 2.2, cy);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = '700 11px monospace';
  ctx.fillStyle = p.ink;
  ctx.fillText('POLE (λ=90°)', cx - 36, cy - Rpx - 28);
  ctx.fillText('EQUATOR (0°)', cx + Rpx + 8, cy + 16);
  ctx.fillText('Center (g=0)', cx - 36, cy - 6);

  // Probe position along latitude line
  const probeDistPx =
    rRatio <= 1 ? rRatio * Rpx : Rpx + (rRatio - 1) * (Rpx * 0.65);
  const px = cx + probeDistPx * Math.cos(latRad);
  const py = cy - probeDistPx * Math.sin(latRad);

  // Draw probe dot
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(px, py, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = p.bg;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Gravity vector toward center
  if (showVectors && gEff > 0.05) {
    const vLen = 18 + (gEff / g0) * 58;
    const dx = cx - px;
    const dy = cy - py;
    const mag = Math.hypot(dx, dy) || 1;
    drawVectorArrow(
      ctx,
      px,
      py,
      px + (dx / mag) * vLen,
      py + (dy / mag) * vLen,
      p,
      `g = ${gEff.toFixed(2)}`
    );
  }

  // Right-side Zone Callout
  const zoneText =
    rRatio === 0
      ? 'AT EARTH CENTER (g = 0)'
      : rRatio < 1
        ? `INSIDE EARTH · Depth d = ${((1 - rRatio) * 6400).toFixed(0)} km`
        : rRatio === 1
          ? `ON SURFACE · Latitude ${latDeg}°`
          : `ALTITUDE h = ${((rRatio - 1) * 6400).toFixed(0)} km`;

  drawLegendPill(ctx, 14, 14, `${zoneText} | g_eff = ${gEff.toFixed(2)} m/s²`, 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let rr = 0; rr <= 3.01; rr += 0.1) {
    const val = rr <= 1 ? g0 * rr : g0 / (rr * rr);
    graphPoints.push({ x: Number(rr.toFixed(2)), y: val });
  }

  return {
    substitutedFormula:
      rRatio <= 1
        ? `g_d = 9.8×(${rRatio.toFixed(2)}) − Δg_rot = ${gEff.toFixed(2)} m/s² (${pct.toFixed(0)}%)`
        : `g_h = 9.8 / (${rRatio.toFixed(2)})² = ${gEff.toFixed(2)} m/s² (${pct.toFixed(0)}%)`,
    readouts: [
      { symbol: 'g_eff', label: { en: 'Effective Gravity', hi: 'प्रभावी गुरुत्व (g)' }, value: gEff.toFixed(2), unit: 'm/s²' },
      { symbol: '%g₀', label: { en: 'Weight vs Surface', hi: 'सतह का भार %' }, value: pct.toFixed(1), unit: '%' },
      {
        symbol: rRatio <= 1 ? 'd' : 'h',
        label: rRatio <= 1 ? { en: 'Depth Below Surface', hi: 'सतह से गहराई' } : { en: 'Altitude Above Surface', hi: 'सतह से ऊँचाई' },
        value: (Math.abs(rRatio - 1) * 6400).toFixed(0),
        unit: 'km',
      },
      { symbol: 'Δg_ω', label: { en: 'Rotation Reduction', hi: 'घूर्णन कमी' }, value: (gBase - gEff).toFixed(2), unit: 'm/s²' },
    ],
    graphPoints,
    graphCurrentPoint: { x: rRatio, y: gEff },
    graphXRange: [0, 3],
    graphYRange: [0, 10.5],
  };
}

// 4. BLACKBODY RADIATION (WIEN & STEFAN-BOLTZMANN) + NEWTON'S COOLING
function renderBlackbodyCooling(
  rc: SimRenderContext,
  p: CanvasPalette
): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const T = params.T ?? 5000; // K
  const e = params.emissivity ?? 1.0;
  const Ti = params.T_init ?? 85; // °C
  const T0 = params.T_env ?? 25; // °C

  if (state.t === undefined) state.t = 0;
  if (isPlaying) state.t += dt;
  const t = state.t as number;

  const bWien = 2.898e-3; // m·K
  const sigma = 5.67e-8;
  const lambdaM_nm = (bWien / T) * 1e9;
  const flux = e * sigma * Math.pow(T, 4); // W/m²
  const fluxMW = flux / 1e6;
  const spectralBand =
    lambdaM_nm < 380 ? 'ULTRAVIOLET (Hot)' : lambdaM_nm <= 700 ? 'VISIBLE LIGHT' : 'INFRARED (Cool)';

  // LEFT HALF: Radiating Blackbody Cavity + Emitted Photon Waves
  const cx = width * 0.25;
  const cy = height * 0.52;
  const rCore = Math.min(width, height) * 0.14;

  // Concentric radiation rings proportional to T^4
  const ringCount = 3 + Math.round(((T - 1500) / 6500) * 5);
  for (let i = 0; i < ringCount; i++) {
    const phase = ((t * (0.4 + T / 9000) + i / ringCount) % 1);
    const rr = rCore + phase * (rCore * 1.45);
    ctx.strokeStyle = p.ink;
    ctx.globalAlpha = Math.max(0.12, 1 - phase);
    ctx.lineWidth = 1.5 + (T / 8000) * 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, rr, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Blackbody core
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(cx, cy, rCore, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = p.bg;
  ctx.font = '700 13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${T} K`, cx, cy - 2);
  ctx.font = '700 10px monospace';
  ctx.fillText(`λ_m = ${lambdaM_nm.toFixed(0)} nm`, cx, cy + 14);
  ctx.textAlign = 'left';

  ctx.font = '700 11px monospace';
  ctx.fillStyle = p.ink;
  ctx.fillText(`BAND: ${spectralBand}`, cx - 64, cy + rCore + 28);

  // RIGHT HALF: Newton's Law of Cooling Exponential Curve
  const gx = width * 0.54;
  const gy = height * 0.22;
  const gw = width * 0.4;
  const gh = height * 0.6;

  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(gx, gy);
  ctx.lineTo(gx, gy + gh);
  ctx.lineTo(gx + gw, gy + gh);
  ctx.stroke();

  // Room temperature asymptote T0
  const yT0 = gy + gh - (T0 / 105) * gh;
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(gx, yT0);
  ctx.lineTo(gx + gw, yT0);
  ctx.stroke();
  ctx.setLineDash([]);

  // Cooling curve T(t) = T0 + (Ti - T0) e^(-0.12 t)
  const kCool = 0.12;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  for (let i = 0; i <= 80; i++) {
    const mins = (i / 80) * 30;
    const temp = T0 + (Ti - T0) * Math.exp(-kCool * mins);
    const x = gx + (mins / 30) * gw;
    const y = gy + gh - (temp / 105) * gh;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  const probeMin = (t * 2.5) % 30;
  const probeTemp = T0 + (Ti - T0) * Math.exp(-kCool * probeMin);
  const pX = gx + (probeMin / 30) * gw;
  const pY = gy + gh - (probeTemp / 105) * gh;
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(pX, pY, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '700 11px monospace';
  ctx.fillStyle = p.ink;
  ctx.fillText(`NEWTON COOLING: T₀=${T0}°C`, gx + 8, gy - 8);
  ctx.fillText(`T(${probeMin.toFixed(0)}m) = ${probeTemp.toFixed(1)}°C`, gx + 10, gy + 16);
  ctx.fillText(`Room T₀ = ${T0}°C`, gx + gw - 95, yT0 - 6);

  drawLegendPill(ctx, 14, 14, `λ_m·T = 2.9×10⁻³ | E = ${fluxMW.toFixed(1)} MW/m²`, 'solid', p);

  // Planck-shape spectral distribution for LiveGraph
  const graphPoints: { x: number; y: number }[] = [];
  const h = 6.626e-34;
  const c = 3e8;
  const kB = 1.38e-23;
  let maxI = 0;
  const rawPts: { x: number; y: number }[] = [];
  for (let lamNm = 150; lamNm <= 2000; lamNm += 35) {
    const lam = lamNm * 1e-9;
    const expArg = Math.min(700, (h * c) / (lam * kB * T));
    const val = 1 / (Math.pow(lam, 5) * (Math.exp(expArg) - 1));
    if (val > maxI) maxI = val;
    rawPts.push({ x: lamNm, y: val });
  }
  for (const pt of rawPts) {
    graphPoints.push({ x: pt.x, y: maxI > 0 ? (pt.y / maxI) * 100 : 0 });
  }

  return {
    substitutedFormula: `λ_m = 2.898×10⁻³/${T} = ${lambdaM_nm.toFixed(0)} nm  |  E = ${e}σ(${T})⁴ = ${fluxMW.toFixed(2)} MW/m²`,
    readouts: [
      { symbol: 'λ_m', label: { en: 'Peak Wavelength', hi: 'शीर्ष तरंगदैर्घ्य' }, value: lambdaM_nm.toFixed(0), unit: 'nm' },
      { symbol: 'E', label: { en: 'Stefan Flux (σT⁴)', hi: 'स्टीफ़न ऊर्जा प्रवाह' }, value: fluxMW.toFixed(2), unit: 'MW/m²' },
      { symbol: 'T(10m)', label: { en: 'Temp after 10 min', hi: '10 min बाद ताप' }, value: (T0 + (Ti - T0) * Math.exp(-1.2)).toFixed(1), unit: '°C' },
      { symbol: 'Band', label: { en: 'Peak Region', hi: 'स्पेक्ट्रम क्षेत्र' }, value: lambdaM_nm < 380 ? 'UV' : lambdaM_nm <= 700 ? 'Visible' : 'IR', unit: '' },
    ],
    graphPoints,
    graphCurrentPoint: { x: Math.min(2000, Math.max(150, lambdaM_nm)), y: 100 },
    graphXRange: [150, 2000],
    graphYRange: [0, 110],
  };
}

// 5. ORGAN PIPES (OPEN VS CLOSED HARMONICS) & ACOUSTIC BEATS
function renderOrganPipesBeats(
  rc: SimRenderContext,
  p: CanvasPalette
): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const isOpen = Math.round(params.pipeType ?? 1) === 1;
  const mode = Math.max(1, Math.round(params.mode ?? 1));
  const L = params.L ?? 0.85; // m
  const df = params.df ?? 4; // Hz
  const vSound = 340; // m/s

  if (state.t === undefined) state.t = 0;
  if (isPlaying) state.t += dt;
  const t = state.t as number;

  const harmonicNum = isOpen ? mode : 2 * mode - 1;
  const freq = isOpen ? (mode * vSound) / (2 * L) : ((2 * mode - 1) * vSound) / (4 * L);
  const wavelength = vSound / freq;
  const nodes = isOpen ? mode : mode;
  const antinodes = isOpen ? mode + 1 : mode;

  // Draw Organ Pipe Body
  const pipeX = width * 0.14;
  const pipeW = width * 0.72;
  const pipeH = height * 0.28;
  const pipeY = height * 0.24;
  const pipeCy = pipeY + pipeH / 2;

  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  // Top and bottom pipe walls
  ctx.moveTo(pipeX, pipeY);
  ctx.lineTo(pipeX + pipeW, pipeY);
  ctx.moveTo(pipeX, pipeY + pipeH);
  ctx.lineTo(pipeX + pipeW, pipeY + pipeH);
  // Closed left cap if closed pipe
  if (!isOpen) {
    ctx.moveTo(pipeX, pipeY);
    ctx.lineTo(pipeX, pipeY + pipeH);
  }
  ctx.stroke();

  if (!isOpen) {
    drawHatchRect(ctx, pipeX - 12, pipeY, 12, pipeH, 'diagonal', p);
  }

  // Draw animated standing wave displacement envelope
  const osc = Math.cos(t * 7);
  const amp = pipeH * 0.4;

  for (const sign of [1, -1]) {
    ctx.strokeStyle = sign === 1 ? p.ink : p.inkMuted;
    ctx.lineWidth = sign === 1 ? 2.6 : 1.6;
    if (sign === -1) ctx.setLineDash([5, 4]);
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const u = i / 120;
      const x = pipeX + u * pipeW;
      const spatial = isOpen
        ? Math.cos(mode * Math.PI * u)
        : Math.sin(((2 * mode - 1) * Math.PI * u) / 2);
      const y = pipeCy - sign * amp * spatial * (sign === 1 ? osc : 1);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Mark Nodes (N) & Antinodes (A)
  ctx.font = '700 12px monospace';
  ctx.fillStyle = p.ink;
  ctx.fillText(isOpen ? 'A (Open End)' : 'N (Closed End)', pipeX - 10, pipeY - 10);
  ctx.fillText('A (Open End)', pipeX + pipeW - 68, pipeY - 10);
  ctx.fillText(
    `${isOpen ? 'OPEN PIPE' : 'CLOSED PIPE'} · Harmonic #${harmonicNum} · f = ${freq.toFixed(1)} Hz · λ = ${wavelength.toFixed(2)} m`,
    pipeX,
    pipeY + pipeH + 22
  );

  // BOTTOM BAND: Live Acoustic Beat Modulation Wave
  const bLeft = width * 0.14;
  const bW = width * 0.72;
  const bCy = height * 0.78;
  const bAmp = height * 0.12;

  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  for (let i = 0; i <= 220; i++) {
    const u = i / 220;
    const x = bLeft + u * bW;
    const env = Math.cos(Math.PI * Math.max(0.1, df) * u - t * 2);
    const carrier = Math.sin(u * Math.PI * 36 - t * 12);
    const y = bCy - bAmp * env * carrier;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.font = '700 11px monospace';
  ctx.fillStyle = p.ink;
  ctx.fillText(
    `ACOUSTIC BEATS: f₁ = ${freq.toFixed(0)} Hz, f₂ = ${(freq + df).toFixed(0)} Hz ⇒ f_beat = ${df} Hz`,
    bLeft,
    bCy - bAmp - 10
  );

  drawLegendPill(ctx, 14, 14, `${isOpen ? 'All Harmonics (1:2:3)' : 'Odd Only (1:3:5)'} | f = ${freq.toFixed(1)} Hz`, 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  for (let i = 0; i <= 100; i++) {
    const tt = i / 100;
    const y = Math.cos(Math.PI * Math.max(0.5, df) * tt) * Math.sin(2 * Math.PI * 16 * tt);
    graphPoints.push({ x: Number(tt.toFixed(2)), y });
  }

  return {
    substitutedFormula: isOpen
      ? `f_${mode} = ${mode}×340 / (2×${L}) = ${freq.toFixed(1)} Hz  |  f_beat = ${df} Hz`
      : `f_${harmonicNum} = ${harmonicNum}×340 / (4×${L}) = ${freq.toFixed(1)} Hz  |  f_beat = ${df} Hz`,
    readouts: [
      { symbol: 'f', label: { en: 'Pipe Frequency', hi: 'पाइप आवृत्ति' }, value: freq.toFixed(1), unit: 'Hz' },
      { symbol: 'λ', label: { en: 'Wavelength', hi: 'तरंगदैर्घ्य' }, value: wavelength.toFixed(2), unit: 'm' },
      { symbol: 'N / A', label: { en: 'Nodes / Antinodes', hi: 'निस्पंद / प्रस्पंद' }, value: `${nodes} / ${antinodes}`, unit: '' },
      { symbol: 'f_b', label: { en: 'Beat Frequency', hi: 'विस्पंद आवृत्ति' }, value: df.toFixed(0), unit: 'Hz' },
    ],
    graphPoints,
    graphXRange: [0, 1],
    graphYRange: [-1.1, 1.1],
  };
}

// 6. POTENTIOMETER NULL BALANCE & SERIES / PARALLEL CELL GROUPING
function renderPotentiometerCells(
  rc: SimRenderContext,
  p: CanvasPalette
): LiveSimTelemetry {
  const { ctx, width, height, params, dt, isPlaying, state } = rc;
  const Vp = params.Vwire ?? 6; // V across 100 cm wire
  const E = params.Ecell ?? 2.0; // V
  const r = params.rInt ?? 2.0; // Ohm
  const R = params.Rext ?? 6; // Ohm

  if (state.t === undefined) state.t = 0;
  if (isPlaying) state.t += dt;

  const L_WIRE = 100; // cm
  const kGrad = Vp / L_WIRE; // V/cm
  const l1 = Math.min(L_WIRE, (E / Vp) * L_WIRE); // open circuit null point
  const Vterm = (E * R) / (R + r);
  const l2 = Math.min(L_WIRE, (Vterm / Vp) * L_WIRE); // shunted null point
  const outOfRange = E > Vp;

  // 4-cell comparison
  const nCells = 4;
  const I_series = (nCells * E) / (R + nCells * r);
  const I_parallel = (nCells * E) / (nCells * R + r);

  // Draw Potentiometer Wire AB
  const ax = width * 0.1;
  const bx = width * 0.9;
  const wireY = height * 0.42;
  const wireW = bx - ax;

  // Driver battery loop (top)
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(ax, wireY);
  ctx.lineTo(ax, height * 0.18);
  ctx.lineTo(width * 0.46, height * 0.18);
  ctx.moveTo(width * 0.54, height * 0.18);
  ctx.lineTo(bx, height * 0.18);
  ctx.lineTo(bx, wireY);
  ctx.stroke();

  // Driver battery plates
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(width * 0.46, height * 0.13);
  ctx.lineTo(width * 0.46, height * 0.23);
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(width * 0.54, height * 0.155);
  ctx.lineTo(width * 0.54, height * 0.205);
  ctx.stroke();

  ctx.font = '700 12px monospace';
  ctx.fillStyle = p.ink;
  ctx.fillText(`Driver Battery V_p = ${Vp} V (L = 100 cm)`, width * 0.34, height * 0.11);

  // Thick Resistance Wire AB
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(ax, wireY);
  ctx.lineTo(bx, wireY);
  ctx.stroke();

  // Ruler ticks every 10 cm
  ctx.lineWidth = 1.2;
  ctx.font = '700 10px monospace';
  for (let cm = 0; cm <= 100; cm += 10) {
    const tx = ax + (cm / 100) * wireW;
    ctx.beginPath();
    ctx.moveTo(tx, wireY - 6);
    ctx.lineTo(tx, wireY + 6);
    ctx.stroke();
    if (cm % 20 === 0) ctx.fillText(`${cm}`, tx - 8, wireY - 12);
  }
  ctx.fillText('A (0 cm)', ax - 12, wireY + 22);
  ctx.fillText('B (100 cm)', bx - 52, wireY + 22);

  // Null point markers J1 (open) & J2 (closed shunt R)
  const j1X = ax + (l1 / 100) * wireW;
  const j2X = ax + (l2 / 100) * wireW;

  // Test cell + Galvanometer loop down to J1 & J2
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(ax, wireY);
  ctx.lineTo(ax, height * 0.72);
  ctx.lineTo(j1X, height * 0.72);
  ctx.lineTo(j1X, wireY + 6);
  ctx.stroke();

  // Shunted Jockey J2 dashed
  ctx.strokeStyle = p.inkMuted;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(j2X, height * 0.72);
  ctx.lineTo(j2X, wireY + 6);
  ctx.stroke();
  ctx.setLineDash([]);

  // Galvanometer circle (Zero Deflection = 0)
  const gX = (ax + j1X) / 2;
  const gY = height * 0.72;
  ctx.fillStyle = p.bg;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(gX, gY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.font = '700 13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('G=0', gX, gY + 5);
  ctx.textAlign = 'left';

  // Labels J1 & J2
  ctx.font = '700 11px monospace';
  ctx.fillStyle = p.ink;
  ctx.fillText(
    outOfRange ? 'NULL OFF WIRE (E > V_p!)' : `J₁ (Open): l₁ = ${l1.toFixed(1)} cm`,
    Math.min(width - 175, j1X - 24),
    wireY + 38
  );
  ctx.fillText(
    `J₂ (Shunt R=${R}Ω): l₂ = ${l2.toFixed(1)} cm`,
    Math.min(width - 185, Math.max(ax + 12, j2X - 24)),
    wireY + 54
  );

  // Bottom comparison strip: 4 Cells Series vs Parallel
  const winner = I_series >= I_parallel ? 'SERIES WINS (R > r)' : 'PARALLEL WINS (R < r)';
  ctx.fillText(
    `4 CELLS: I_series = ${I_series.toFixed(2)} A  vs  I_parallel = ${I_parallel.toFixed(2)} A  ⇒  ${winner}`,
    ax,
    height * 0.91
  );

  drawLegendPill(ctx, 14, 14, `k = ${kGrad.toFixed(3)} V/cm | r = R(l₁/l₂−1) = ${r.toFixed(1)} Ω`, 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  const graphSecondPoints: { x: number; y: number }[] = [];
  for (let rx = 0.5; rx <= 20; rx += 0.5) {
    graphPoints.push({ x: rx, y: (nCells * E) / (rx + nCells * r) });
    graphSecondPoints.push({ x: rx, y: (nCells * E) / (nCells * rx + r) });
  }

  return {
    substitutedFormula: outOfRange
      ? `E (${E}V) > V_p (${Vp}V) — Increase Driver Voltage V_p!`
      : `r = ${R}×(${l1.toFixed(1)}/${l2.toFixed(1)} − 1) = ${r.toFixed(2)} Ω  |  k = ${kGrad.toFixed(3)} V/cm`,
    readouts: [
      { symbol: 'l₁', label: { en: 'Open Null Length', hi: 'खुला संतुलन l₁' }, value: l1.toFixed(1), unit: 'cm' },
      { symbol: 'l₂', label: { en: 'Shunted Null l₂', hi: 'शंट संतुलन l₂' }, value: l2.toFixed(1), unit: 'cm' },
      { symbol: 'I_ser', label: { en: '4 Cells Series', hi: '4 सेल श्रेणीक्रम' }, value: I_series.toFixed(2), unit: 'A' },
      { symbol: 'I_par', label: { en: '4 Cells Parallel', hi: '4 सेल समांतर' }, value: I_parallel.toFixed(2), unit: 'A' },
    ],
    graphPoints,
    graphSecondPoints,
    graphCurrentPoint: { x: R, y: I_series },
    graphLegend: { primary: '4 Cells Series (A)', secondary: '4 Cells Parallel (A)' },
    graphXRange: [0, 20],
    graphYRange: [0, Math.max(2, (nCells * E) / Math.max(0.5, r) * 0.8)],
  };
}

// 7. HUMAN EYE OPTICAL DEFECTS (MYOPIA / HYPERMETROPIA & LENS POWER)
function renderEyeDefects(
  rc: SimRenderContext,
  p: CanvasPalette
): LiveSimTelemetry {
  const { ctx, width, height, params } = rc;
  const isHyper = Math.round(params.defect ?? 0) === 1;
  const farPtCm = params.farPt ?? 100;
  const nearPtCm = params.nearPt ?? 50;
  const isCorrected = Math.round(params.corrected ?? 1) === 1;

  // Power calculations (in Diopters)
  // Myopia: f = -d_far => P = -100 / farPtCm
  // Hypermetropia: 1/f = 1/(-d_near) - 1/(-25) => P = 4 - 100/nearPtCm
  const powerD = isHyper ? 4 - 100 / nearPtCm : -100 / farPtCm;
  const focalCm = Math.abs(powerD) > 0.001 ? 100 / powerD : 9999;

  const cy = height * 0.52;
  const eyeCx = width * 0.7;
  const eyeR = Math.min(width * 0.16, height * 0.27);
  const eyeLensX = eyeCx - eyeR * 0.85;
  const retinaX = eyeCx + eyeR * 0.96;
  const specX = eyeLensX - width * 0.14;

  // Optical axis
  ctx.strokeStyle = p.inkMuted;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(width * 0.06, cy);
  ctx.lineTo(width * 0.94, cy);
  ctx.stroke();
  ctx.setLineDash([]);

  // Eyeball circle
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(eyeCx, cy, eyeR, 0, Math.PI * 2);
  ctx.stroke();

  // Eye crystalline lens
  ctx.fillStyle = p.surface;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.ellipse(eyeLensX, cy, 10, eyeR * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Retina highlight arc
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(eyeCx, cy, eyeR, -0.45, 0.45);
  ctx.stroke();

  // Corrective Spectacle Lens (Concave for Myopia, Convex for Hypermetropia)
  if (isCorrected) {
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2.6;
    if (!isHyper) {
      // Concave (diverging) lens outline
      ctx.beginPath();
      ctx.moveTo(specX - 10, cy - 52);
      ctx.quadraticCurveTo(specX + 3, cy, specX - 10, cy + 52);
      ctx.lineTo(specX + 10, cy + 52);
      ctx.quadraticCurveTo(specX - 3, cy, specX + 10, cy - 52);
      ctx.closePath();
      ctx.stroke();
    } else {
      // Convex (converging) lens outline
      ctx.beginPath();
      ctx.ellipse(specX, cy, 9, 52, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.font = '700 11px monospace';
    ctx.fillStyle = p.ink;
    ctx.fillText(
      `${isHyper ? 'CONVEX' : 'CONCAVE'} (${powerD >= 0 ? '+' : ''}${powerD.toFixed(2)} D)`,
      specX - 58,
      cy - 62
    );
  }

  // Focus point X on optical axis
  const focusX = isCorrected
    ? retinaX
    : isHyper
      ? retinaX + Math.min(eyeR * 0.55, (nearPtCm / 200) * eyeR * 0.65)
      : retinaX - Math.min(eyeR * 0.65, (100 / Math.max(25, farPtCm)) * eyeR * 0.35);

  // Incoming light rays
  const rayOffsets = [-28, 28];
  const srcX = width * 0.12;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.1;

  for (const off of rayOffsets) {
    ctx.beginPath();
    if (!isHyper) {
      // Myopia: parallel rays from infinity
      ctx.moveTo(srcX, cy + off);
      if (isCorrected) {
        ctx.lineTo(specX, cy + off);
        ctx.lineTo(eyeLensX, cy + off * 1.25);
      } else {
        ctx.lineTo(eyeLensX, cy + off);
      }
      ctx.lineTo(focusX, cy);
    } else {
      // Hypermetropia: diverging rays from Near Point (25 cm)
      ctx.moveTo(srcX, cy);
      if (isCorrected) {
        ctx.lineTo(specX, cy + off * 0.85);
        ctx.lineTo(eyeLensX, cy + off * 0.72);
      } else {
        ctx.lineTo(eyeLensX, cy + off * 1.15);
      }
      ctx.lineTo(focusX, cy);
    }
    ctx.stroke();
  }

  if (isHyper) {
    ctx.fillStyle = p.ink;
    ctx.beginPath();
    ctx.arc(srcX, cy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '700 11px monospace';
    ctx.fillText('Object at D = 25 cm', srcX - 24, cy + 22);
  } else {
    ctx.font = '700 11px monospace';
    ctx.fillStyle = p.ink;
    ctx.fillText('Parallel Rays (from ∞)', srcX, cy - 42);
  }

  // Focus dot & diagnosis
  ctx.fillStyle = p.ink;
  ctx.beginPath();
  ctx.arc(focusX, cy, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '700 11px monospace';
  ctx.fillText('RETINA', retinaX - 18, cy + eyeR + 18);
  const statusStr = isCorrected
    ? 'SHARP FOCUS ON RETINA (CORRECTED)'
    : isHyper
      ? 'FOCUS BEHIND RETINA (BLURRY NEAR)'
      : 'FOCUS BEFORE RETINA (BLURRY FAR)';
  drawLegendPill(ctx, 14, 14, `${isHyper ? 'HYPERMETROPIA' : 'MYOPIA'} · ${statusStr}`, 'solid', p);

  const graphPoints: { x: number; y: number }[] = [];
  if (!isHyper) {
    for (let d = 25; d <= 400; d += 15) {
      graphPoints.push({ x: d, y: -100 / d });
    }
  } else {
    for (let d = 35; d <= 200; d += 10) {
      graphPoints.push({ x: d, y: 4 - 100 / d });
    }
  }

  return {
    substitutedFormula: isHyper
      ? `P = 4 − 100/${nearPtCm} = +${powerD.toFixed(2)} D  |  f = +${focalCm.toFixed(1)} cm (Convex)`
      : `P = −100/${farPtCm} = ${powerD.toFixed(2)} D  |  f = ${focalCm.toFixed(1)} cm (Concave)`,
    readouts: [
      { symbol: 'P', label: { en: 'Lens Power', hi: 'लेंस क्षमता (P)' }, value: `${powerD >= 0 ? '+' : ''}${powerD.toFixed(2)}`, unit: 'D' },
      { symbol: 'f', label: { en: 'Focal Length', hi: 'फोकस दूरी (f)' }, value: `${focalCm >= 0 ? '+' : ''}${focalCm.toFixed(1)}`, unit: 'cm' },
      { symbol: 'Lens', label: { en: 'Corrective Type', hi: 'संशोधक लेंस' }, value: isHyper ? 'Convex' : 'Concave', unit: '' },
      { symbol: 'Focus', label: { en: 'Image Status', hi: 'प्रतिबिंब स्थिति' }, value: isCorrected ? 'On Retina' : isHyper ? 'Behind' : 'In Front', unit: '' },
    ],
    graphPoints,
    graphCurrentPoint: { x: isHyper ? nearPtCm : farPtCm, y: powerD },
    graphXRange: isHyper ? [35, 200] : [25, 400],
    graphYRange: isHyper ? [0, 4.2] : [-4.2, 0],
  };
}
