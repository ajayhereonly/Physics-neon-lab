import { useEffect, useRef } from 'react';
import { LiveSimTelemetry, ThemeMode } from '../types/physics';
import { getCanvasPalette } from '../utils/canvasHelpers';
import { formatPhysicsNumber } from '../utils/mathParser';

interface LiveGraphProps {
  telemetry: LiveSimTelemetry | null;
  title: string;
  xLabel: string;
  yLabel: string;
  theme: ThemeMode;
  compact?: boolean;
}

export function LiveGraph({ telemetry, title, xLabel, yLabel, theme, compact = false }: LiveGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !telemetry) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;
    const p = getCanvasPalette(theme);

    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, w, h);

    const padL = 56;
    const padR = 20;
    const padT = 16;
    const padB = 32;
    const plotW = Math.max(20, w - padL - padR);
    const plotH = Math.max(20, h - padT - padB);

    const pts1 = telemetry.graphPoints ?? [];
    const pts2 = telemetry.graphSecondPoints ?? [];
    const allPts = [...pts1, ...pts2];
    if (telemetry.graphCurrentPoint) allPts.push(telemetry.graphCurrentPoint);

    if (allPts.length === 0) return;

    let minX = Math.min(...allPts.map((pt) => pt.x));
    let maxX = Math.max(...allPts.map((pt) => pt.x));
    let minY = Math.min(...allPts.map((pt) => pt.y));
    let maxY = Math.max(...allPts.map((pt) => pt.y));

    if (Math.abs(maxX - minX) < 1e-6) {
      minX -= 1;
      maxX += 1;
    }
    if (Math.abs(maxY - minY) < 1e-6) {
      minY -= 1;
      maxY += 1;
    } else {
      const marginY = (maxY - minY) * 0.12;
      minY = minY >= 0 && minY - marginY < 0 ? 0 : minY - marginY;
      maxY += marginY;
    }

    const mapX = (x: number) => padL + ((x - minX) / (maxX - minX)) * plotW;
    const mapY = (y: number) => padT + plotH - ((y - minY) / (maxY - minY)) * plotH;

    // Grid lines & bold projector Y ticks
    ctx.strokeStyle = p.gridMajor;
    ctx.lineWidth = 1.1;
    ctx.font = '700 12px "IBM Plex Mono", monospace';
    ctx.fillStyle = p.ink;
    ctx.textAlign = 'right';

    const yTicks = 4;
    for (let i = 0; i <= yTicks; i++) {
      const val = minY + ((maxY - minY) * i) / yTicks;
      const py = mapY(val);
      ctx.beginPath();
      ctx.moveTo(padL, py);
      ctx.lineTo(w - padR, py);
      ctx.stroke();
      ctx.fillText(formatPhysicsNumber(val, 1), padL - 8, py + 4);
    }

    // Thick high-contrast axes
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(w - padR, padT + plotH);
    ctx.stroke();

    // X ticks
    ctx.textAlign = 'center';
    const xTicks = 4;
    for (let i = 0; i <= xTicks; i++) {
      const val = minX + ((maxX - minX) * i) / xTicks;
      const px = mapX(val);
      ctx.fillText(formatPhysicsNumber(val, 1), px, h - 10);
    }

    const drawSeries = (series: { x: number; y: number }[], dashed: boolean) => {
      if (series.length < 2) return;
      ctx.save();
      ctx.strokeStyle = p.ink;
      ctx.lineWidth = dashed ? 2.6 : 3.4;
      if (dashed) ctx.setLineDash([8, 5]);
      ctx.lineJoin = 'round';
      ctx.beginPath();
      let started = false;
      let prevY = 0;
      for (let i = 0; i < series.length; i++) {
        const px = mapX(series[i].x);
        const py = mapY(series[i].y);
        if (started && Math.abs(py - prevY) > plotH * 0.75) {
          ctx.moveTo(px, py);
        } else if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
        prevY = py;
      }
      ctx.stroke();
      ctx.restore();
    };

    // Primary Series = Thick Solid; Secondary Series = Bold Dashed
    drawSeries(pts1, false);
    if (pts2.length > 1) {
      drawSeries(pts2, true);
      // Hollow square marker at end of secondary series
      const last2 = pts2[pts2.length - 1];
      const lx2 = mapX(last2.x);
      const ly2 = mapY(last2.y);
      ctx.fillStyle = p.bg;
      ctx.strokeStyle = p.ink;
      ctx.lineWidth = 2.5;
      ctx.fillRect(lx2 - 5, ly2 - 5, 10, 10);
      ctx.strokeRect(lx2 - 5, ly2 - 5, 10, 10);
    }

    // Current active operating point (bold target crosshair + filled dot)
    if (telemetry.graphCurrentPoint) {
      const cx = mapX(telemetry.graphCurrentPoint.x);
      const cy = mapY(telemetry.graphCurrentPoint.y);
      ctx.save();
      ctx.strokeStyle = p.ink;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx, padT + plotH);
      ctx.lineTo(cx, cy);
      ctx.lineTo(padL, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = p.ink;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = p.inkInvert;
      ctx.fill();
      ctx.restore();
    }
  }, [telemetry, theme]);

  return (
    <div className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b-2 border-black dark:border-white">
        <div className="flex items-center gap-2 text-sm font-bold text-black dark:text-white">
          <span className="font-display">{title}</span>
          <span className="text-neutral-500 dark:text-neutral-400" aria-hidden="true">·</span>
          <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300">
            {yLabel} vs {xLabel}
          </span>
        </div>
        {telemetry?.graphLegend && (
          <div className="flex items-center gap-4 text-xs font-mono font-bold text-black dark:text-white">
            <span className="inline-flex items-center gap-2">
              <span className="w-5 h-[3px] bg-black dark:bg-white inline-block" />
              {telemetry.graphLegend.primary}
            </span>
            {telemetry.graphLegend.secondary && (
              <span className="inline-flex items-center gap-2">
                <span className="w-5 h-0 border-t-[3px] border-dashed border-black dark:border-white inline-block" />
                {telemetry.graphLegend.secondary}
              </span>
            )}
          </div>
        )}
      </div>
      <div className={compact ? 'h-40 w-full' : 'h-48 w-full'}>
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
}
