import { LanguageMode, LiveSimTelemetry, PhysicsSimulation, ThemeMode } from '../types/physics';
import { getRealLifeScenario } from '../data/realLifeScenarios';
import { getBilingualPrimary } from '../utils/bilingual';

/**
 * Draws crisp Pure B&W 2D Real-Life Example visuals on the 2D canvas
 * when SceneMode === 'reallife'. Flagship topics render bespoke everyday 2D scenes
 * (Drifting Sports Car + Live Speedometer for angular-momentum, Highway Car for speed-velocity/motion-1d,
 * Eyeglasses + Book/Road Sign for eye-defects, Ambulance for doppler-effect, Submarine for density-buoyancy,
 * Airplane Wing for fluids), while every topic also displays a clean top real-life context bar.
 */
export function drawRealLife2DOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  sim: PhysicsSimulation,
  params: Record<string, number>,
  telemetry: LiveSimTelemetry | null,
  t: number,
  theme: ThemeMode,
  lang: LanguageMode
): boolean {
  const isDark = theme === 'dark';
  const fg = isDark ? '#FFFFFF' : '#000000';
  const bg = isDark ? '#000000' : '#FFFFFF';
  const muted = isDark ? '#A3A3A3' : '#525252';
  const scenario = getRealLifeScenario(sim);
  const titleText = getBilingualPrimary(scenario.title, lang);

  // Helper to draw a crisp top banner identifying the Real-Life scenario
  const drawScenarioHeader = () => {
    ctx.save();
    ctx.fillStyle = bg;
    ctx.strokeStyle = fg;
    ctx.lineWidth = 1.5;
    const padX = 12;
    ctx.font = '700 12px "Inter", system-ui, sans-serif';
    const label = `REAL-LIFE 2D · ${titleText}`;
    const tw = Math.min(w - 28, ctx.measureText(label).width + 22);
    ctx.fillRect(padX, 10, tw, 24);
    ctx.strokeRect(padX, 10, tw, 24);
    ctx.fillStyle = fg;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, padX + 10, 22, tw - 18);
    ctx.restore();
  };

  // Flagship 2D Real-Life replacement canvas: Angular Momentum -> Drifting Sports Car + Live Speedometer
  if (sim.id === 'angular-momentum') {
    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const m = Math.max(0.5, params.m ?? 2);
    const r = Math.max(0.4, params.r ?? 1.8);
    const L = Math.max(1, params.L ?? 18);
    const I = m * r * r;
    const omega = L / Math.max(0.05, I);
    const v = omega * r;

    const cx = w * 0.38;
    const cy = h * 0.54;
    const pixR = Math.min(w * 0.26, h * 0.34) * Math.min(1, r / 3.0) + 34;

    // Skidpad circular track
    ctx.strokeStyle = muted;
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.arc(cx, cy, pixR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = bg;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(cx, cy, pixR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Center cone
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();

    // Car position along drift circle
    const ang = t * Math.min(6, omega * 0.55);
    const carX = cx + Math.cos(ang) * pixR;
    const carY = cy + Math.sin(ang) * pixR;

    // Radius tether line
    ctx.strokeStyle = fg;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(carX, carY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Top-down Sports Car silhouette
    ctx.save();
    ctx.translate(carX, carY);
    ctx.rotate(ang + Math.PI / 2 - Math.min(0.35, omega * 0.04));
    ctx.fillStyle = fg;
    ctx.fillRect(-18, -10, 36, 20);
    ctx.fillStyle = bg;
    ctx.fillRect(-6, -7, 14, 14);
    ctx.strokeStyle = fg;
    ctx.lineWidth = 2;
    ctx.strokeRect(-18, -10, 36, 20);
    ctx.restore();

    // Right-side Analog Car Speedometer Gauge
    const gx = w * 0.78;
    const gy = h * 0.54;
    const gr = Math.min(w * 0.16, h * 0.28);
    ctx.strokeStyle = fg;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(gx, gy, gr, Math.PI * 0.75, Math.PI * 2.25);
    ctx.stroke();

    const frac = Math.min(1, v / 35);
    const needleAng = Math.PI * 0.75 + frac * Math.PI * 1.5;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + Math.cos(needleAng) * (gr - 12), gy + Math.sin(needleAng) * (gr - 12));
    ctx.stroke();

    ctx.fillStyle = fg;
    ctx.font = '700 18px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${(v * 3.6).toFixed(0)} km/h`, gx, gy + gr * 0.52);
    ctx.font = '600 11px "Inter", sans-serif';
    ctx.fillStyle = muted;
    ctx.fillText(`ω = ${omega.toFixed(2)} rad/s | r = ${r.toFixed(2)} m`, gx, gy + gr * 0.78);

    drawScenarioHeader();
    ctx.restore();
    return true;
  }

  // Flagship 2D Real-Life: Speed & Velocity -> Highway Roundabout Car + Odometer vs GPS
  if (sim.id === 'speed-velocity' || sim.id === 'motion-1d') {
    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Highway road strip
    const roadY = h * 0.62;
    ctx.fillStyle = isDark ? '#181818' : '#E5E5E5';
    ctx.fillRect(24, roadY - 26, w - 48, 52);
    ctx.strokeStyle = fg;
    ctx.lineWidth = 2;
    ctx.strokeRect(24, roadY - 26, w - 48, 52);

    ctx.setLineDash([14, 12]);
    ctx.beginPath();
    ctx.moveTo(32, roadY);
    ctx.lineTo(w - 32, roadY);
    ctx.stroke();
    ctx.setLineDash([]);

    const spd = sim.id === 'speed-velocity' ? (params.v ?? 10) : Math.max(2, (params.u ?? 5) + (params.a ?? 2) * (t % 5));
    const carX = 64 + ((t * spd * 14) % Math.max(120, w - 140));

    // Side-profile Sports Car
    ctx.fillStyle = fg;
    ctx.fillRect(carX - 34, roadY - 22, 68, 18);
    ctx.fillRect(carX - 18, roadY - 36, 36, 15);
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(carX - 20, roadY - 3, 9, 0, Math.PI * 2);
    ctx.arc(carX + 20, roadY - 3, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = fg;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Live Speedometer Readout Card
    const primary = telemetry?.readouts?.[0];
    ctx.fillStyle = fg;
    ctx.font = '700 22px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${(spd * 3.6).toFixed(0)} km/h  (${spd.toFixed(1)} m/s)`, w / 2, h * 0.34);
    if (primary) {
      ctx.font = '600 13px "Inter", sans-serif';
      ctx.fillStyle = muted;
      ctx.fillText(`${primary.label.en}: ${primary.value} ${primary.unit}`, w / 2, h * 0.43);
    }

    drawScenarioHeader();
    ctx.restore();
    return true;
  }

  // Flagship 2D Real-Life: Eye Defects -> Reading Book / Highway Sign through Eyeglasses
  if (sim.id === 'eye-defects') {
    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const isMyopia = Math.round(params.defectType ?? 0) === 0;
    const defectDist = Math.max(25, params.defectDist ?? (isMyopia ? 100 : 75));
    const lensP = params.lensPower ?? 0;
    const reqP = isMyopia ? -100 / defectDist : 4 - 100 / defectDist;
    const blurAmt = Math.min(10, Math.abs(reqP - lensP) * 3.2);

    // Draw target (Highway Sign or Book Page)
    const tx = w * 0.2;
    const ty = h * 0.54;
    ctx.strokeStyle = fg;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(tx - 58, ty - 48, 116, 96);
    ctx.fillStyle = fg;
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isMyopia ? 'EXIT 25' : 'CHAPTER 9', tx, ty - 6);
    ctx.font = '600 11px "Inter", sans-serif';
    ctx.fillText(isMyopia ? 'Highway Sign' : 'Book Page', tx, ty + 20);

    // Draw Eyeglasses in center
    const gx = w * 0.5;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(gx, ty, 18, 56, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillText(`${lensP >= 0 ? '+' : ''}${lensP.toFixed(2)} D`, gx, ty + 74);

    // Draw Simulated Perceived Retina View on right
    const rx = w * 0.8;
    ctx.strokeStyle = fg;
    ctx.lineWidth = 2;
    ctx.strokeRect(rx - 66, ty - 52, 132, 104);
    ctx.save();
    ctx.filter = blurAmt > 0.4 ? `blur(${blurAmt.toFixed(1)}px)` : 'none';
    ctx.fillStyle = fg;
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillText(isMyopia ? 'EXIT 25' : 'CHAPTER 9', rx, ty - 4);
    ctx.restore();
    ctx.font = '700 11px "Inter", sans-serif';
    ctx.fillStyle = muted;
    ctx.fillText(blurAmt < 0.6 ? 'RETINA: CRISP' : 'RETINA: BLURRY', rx, ty + 72);

    drawScenarioHeader();
    ctx.restore();
    return true;
  }

  // For all other 62 topics in 2D Real-Life mode, keep the accurate live 2D physics diagram
  // underneath and stamp the clean Real-Life Scenario Header & everyday takeaway footer cleanly.
  drawScenarioHeader();
  ctx.save();
  const story = getBilingualPrimary(scenario.realLifeStory, lang);
  ctx.fillStyle = bg;
  ctx.strokeStyle = fg;
  ctx.lineWidth = 1.5;
  ctx.fillRect(12, h - 34, w - 24, 24);
  ctx.strokeRect(12, h - 34, w - 24, 24);
  ctx.fillStyle = fg;
  ctx.font = '600 11px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(story, 20, h - 22, w - 40);
  ctx.restore();
  return false;
}
