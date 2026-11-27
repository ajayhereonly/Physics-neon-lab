import { useEffect, useRef, useState } from 'react';
import { LanguageMode, ThemeMode } from '../../types/physics';
import { drawGrid, drawLegendPill, drawVectorArrow, getCanvasPalette } from '../../utils/canvasHelpers';

interface OpticsRaySandboxWorkspaceProps {
  language: LanguageMode;
  theme: ThemeMode;
}

type OpticKind = 'concave-mirror' | 'convex-mirror' | 'convex-lens' | 'concave-lens';

export function OpticsRaySandboxWorkspace({ language, theme }: OpticsRaySandboxWorkspaceProps) {
  const [optic, setOptic] = useState<OpticKind>('concave-mirror');
  const [fMag, setFMag] = useState(15); // cm
  const [uMag, setUMag] = useState(25); // cm (object placed at x = -uMag)
  const [hObj, setHObj] = useState(6); // cm

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isMirror = optic === 'concave-mirror' || optic === 'convex-mirror';
  const fSigned = optic === 'concave-mirror' || optic === 'concave-lens' ? -fMag : fMag;
  const uSigned = -uMag;

  // Mirror: 1/v = 1/f - 1/u, m = -v/u
  // Lens:   1/v = 1/f + 1/u, m = +v/u
  const invV = isMirror ? 1 / fSigned - 1 / uSigned : 1 / fSigned + 1 / uSigned;
  const atInfinity = Math.abs(invV) < 1e-4;
  const vSigned = atInfinity ? Infinity : 1 / invV;
  const mag = atInfinity ? Infinity : isMirror ? -vSigned / uSigned : vSigned / uSigned;
  const hImg = atInfinity ? Infinity : mag * hObj;

  const isReal = atInfinity ? false : isMirror ? vSigned < 0 : vSigned > 0;
  const natureText = atInfinity
    ? 'Image at Infinity (Parallel Emergent Rays)'
    : `${isReal ? 'Real & Inverted' : 'Virtual & Erect'} · ${
        Math.abs(mag) > 1.05 ? 'Magnified' : Math.abs(mag) < 0.95 ? 'Diminished' : 'Same Size'
      }`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth || 760;
    const height = 390;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const p = getCanvasPalette(theme);
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, width, height);
    drawGrid(ctx, width, height, p, 36);

    const cx = width * 0.52;
    const cy = height * 0.54;
    const pxPerCm = Math.min(6.2, width / 128);

    const toX = (cm: number) => cx + cm * pxPerCm;
    const toY = (cm: number) => cy - cm * pxPerCm;

    // Principal Axis
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 5]);
    ctx.beginPath();
    ctx.moveTo(16, cy);
    ctx.lineTo(width - 16, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Optical Element at x = 0
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 4;
    const elemH = 126;
    if (optic === 'concave-mirror') {
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy - elemH);
      ctx.quadraticCurveTo(cx + 16, cy, cx - 12, cy + elemH);
      ctx.stroke();
      // Back silvering hatch
      ctx.lineWidth = 1.6;
      for (let y = -elemH + 10; y <= elemH - 10; y += 14) {
        const edgeX = cx + 4 - (y * y) / (elemH * elemH) * 14;
        ctx.beginPath();
        ctx.moveTo(edgeX, cy + y);
        ctx.lineTo(edgeX + 10, cy + y - 6);
        ctx.stroke();
      }
    } else if (optic === 'convex-mirror') {
      ctx.beginPath();
      ctx.moveTo(cx + 12, cy - elemH);
      ctx.quadraticCurveTo(cx - 16, cy, cx + 12, cy + elemH);
      ctx.stroke();
      ctx.lineWidth = 1.6;
      for (let y = -elemH + 10; y <= elemH - 10; y += 14) {
        const edgeX = cx - 4 + (y * y) / (elemH * elemH) * 14;
        ctx.beginPath();
        ctx.moveTo(edgeX, cy + y);
        ctx.lineTo(edgeX + 10, cy + y - 6);
        ctx.stroke();
      }
    } else if (optic === 'convex-lens') {
      ctx.beginPath();
      ctx.moveTo(cx, cy - elemH);
      ctx.quadraticCurveTo(cx + 22, cy, cx, cy + elemH);
      ctx.quadraticCurveTo(cx - 22, cy, cx, cy - elemH);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy - elemH);
      ctx.lineTo(cx + 14, cy - elemH);
      ctx.quadraticCurveTo(cx + 2, cy, cx + 14, cy + elemH);
      ctx.lineTo(cx - 14, cy + elemH);
      ctx.quadraticCurveTo(cx - 2, cy, cx - 14, cy - elemH);
      ctx.stroke();
    }

    // Mark F and 2F/C points
    const markPoint = (cm: number, label: string) => {
      const x = toX(cm);
      ctx.fillStyle = p.ink;
      ctx.beginPath();
      ctx.arc(x, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '700 12px "IBM Plex Mono", monospace';
      ctx.fillText(label, x - 9, cy + 20);
    };
    markPoint(-fMag, isMirror ? 'F' : 'F₁');
    markPoint(-2 * fMag, isMirror ? 'C' : '2F₁');
    markPoint(fMag, isMirror ? 'F′' : 'F₂');
    markPoint(2 * fMag, isMirror ? 'C′' : '2F₂');

    // Draw Object Arrow
    const ox = toX(uSigned);
    const oyTop = toY(hObj);
    drawVectorArrow(ctx, ox, cy, ox, oyTop, p, `Object`, 'solid', 4);

    // Trace Principal Rays
    const drawRay = (x1: number, y1: number, x2: number, y2: number, dashed = false) => {
      ctx.save();
      ctx.strokeStyle = p.ink;
      ctx.lineWidth = dashed ? 1.8 : 2.6;
      if (dashed) ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    };

    const ix = atInfinity ? cx : toX(vSigned);
    const iyTop = atInfinity ? cy : toY(hImg);

    // Ray 1: Parallel to principal axis → through Focus
    drawRay(ox, oyTop, cx, oyTop, false);
    if (!atInfinity) {
      if (isReal) {
        drawRay(cx, oyTop, ix, iyTop, false);
      } else {
        // Real reflected/refracted ray continues outward; virtual dashed back-extension meets image
        const dx = cx - ix;
        const dy = oyTop - iyTop;
        const len = Math.hypot(dx, dy) || 1;
        drawRay(cx, oyTop, cx + (dx / len) * 260, oyTop + (dy / len) * 260, false);
        drawRay(cx, oyTop, ix, iyTop, true);
      }
    }

    // Ray 2: Through Pole / Optical Center
    drawRay(ox, oyTop, cx, cy, false);
    if (!atInfinity) {
      if (isReal) {
        drawRay(cx, cy, ix, iyTop, false);
      } else {
        const dx = cx - ix;
        const dy = cy - iyTop;
        const len = Math.hypot(dx, dy) || 1;
        drawRay(cx, cy, cx + (dx / len) * 260, cy + (dy / len) * 260, false);
        drawRay(cx, cy, ix, iyTop, true);
      }
    }

    // Draw Image Arrow
    if (!atInfinity && ix > 12 && ix < width - 12 && Math.abs(hImg) < 35) {
      drawVectorArrow(ctx, ix, cy, ix, iyTop, p, isReal ? 'Real Image' : 'Virtual Image', isReal ? 'double' : 'dashed', 3.4);
    }

    drawLegendPill(ctx, 16, 16, 'Real Rays (Solid)', 'solid', p);
    drawLegendPill(ctx, 16, 48, 'Virtual Extensions (Dashed)', 'dashed', p);
  }, [optic, theme, fMag, uMag, hObj, uSigned, vSigned, hImg, isMirror, isReal, atInfinity]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'concave-mirror', en: 'Concave Mirror', hi: 'अवतल दर्पण' },
            { id: 'convex-mirror', en: 'Convex Mirror', hi: 'उत्तल दर्पण' },
            { id: 'convex-lens', en: 'Convex Lens', hi: 'उत्तल लेंस' },
            { id: 'concave-lens', en: 'Concave Lens', hi: 'अवतल लेंस' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOptic(item.id)}
            className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-lg border-2 cursor-pointer ${
              optic === item.id
                ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white'
            }`}
          >
            {language === 'hi' ? item.hi : item.en}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border-2 border-black dark:border-white overflow-hidden bg-white dark:bg-black">
            <canvas ref={canvasRef} className="w-full h-[390px] block" />
          </div>

          <div className="p-4 rounded-xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black space-y-1 font-mono">
            <div className="text-base font-extrabold">{natureText}</div>
            <div className="text-xs sm:text-sm opacity-90">
              {isMirror ? 'Mirror Formula: 1/f = 1/v + 1/u' : 'Lens Formula: 1/f = 1/v − 1/u'}  |  u = {uSigned} cm  |  f = {fSigned} cm  |  v ={' '}
              {atInfinity ? '∞' : `${vSigned.toFixed(1)} cm`}  |  m = {atInfinity ? '∞' : mag.toFixed(2)}×
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5 space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>Object Distance |u|</span>
              <span className="font-mono font-extrabold">{uMag} cm</span>
            </div>
            <input type="range" min={5} max={50} step={1} value={uMag} onChange={(e) => setUMag(Number(e.target.value))} className="w-full" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>Focal Length |f|</span>
              <span className="font-mono font-extrabold">{fMag} cm</span>
            </div>
            <input type="range" min={8} max={25} step={1} value={fMag} onChange={(e) => setFMag(Number(e.target.value))} className="w-full" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>Object Height h_o</span>
              <span className="font-mono font-extrabold">{hObj} cm</span>
            </div>
            <input type="range" min={3} max={12} step={1} value={hObj} onChange={(e) => setHObj(Number(e.target.value))} className="w-full" />
          </div>

          <div className="pt-3 border-t-2 border-black dark:border-white space-y-2">
            <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
              CLASSIC NCERT POSITIONS
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'Beyond 2F/C', u: Math.min(50, Math.round(fMag * 2.6)) },
                { label: 'At 2F/C', u: Math.min(50, fMag * 2) },
                { label: 'Between F & 2F', u: Math.round(fMag * 1.45) },
                { label: 'Inside Focus (< F)', u: Math.max(5, Math.round(fMag * 0.6)) },
              ].map((pos) => (
                <button
                  key={pos.label}
                  type="button"
                  onClick={() => setUMag(pos.u)}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 border-neutral-400 dark:border-neutral-600 hover:border-black dark:hover:border-white cursor-pointer"
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
