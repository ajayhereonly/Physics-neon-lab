import { useEffect, useRef, useState } from 'react';
import { LanguageMode, ThemeMode } from '../../types/physics';
import {
  drawGrid,
  drawHatchRect,
  drawLegendPill,
  drawVectorArrow,
  getCanvasPalette,
} from '../../utils/canvasHelpers';

interface VectorFbdBoardWorkspaceProps {
  language: LanguageMode;
  theme: ThemeMode;
}

const G = 9.81;

export function VectorFbdBoardWorkspace({ language, theme }: VectorFbdBoardWorkspaceProps) {
  const [boardMode, setBoardMode] = useState<'vectors' | 'fbd'>('vectors');

  // Vector Resolver state
  const [magA, setMagA] = useState(40);
  const [angA, setAngA] = useState(20);
  const [magB, setMagB] = useState(30);
  const [angB, setAngB] = useState(85);
  const [showComponents, setShowComponents] = useState(true);
  const [lawMode, setLawMode] = useState<'parallelogram' | 'triangle'>('parallelogram');

  // FBD Builder state
  const [fbdScene, setFbdScene] = useState<'incline' | 'horizontal' | 'atwood'>('incline');
  const [mass1, setMass1] = useState(5);
  const [mass2, setMass2] = useState(8);
  const [inclineDeg, setInclineDeg] = useState(30);
  const [mu, setMu] = useState(0.2);
  const [appliedF, setAppliedF] = useState(35);
  const [showMg, setShowMg] = useState(true);
  const [showMgParts, setShowMgParts] = useState(true);
  const [showNormal, setShowNormal] = useState(true);
  const [showFriction, setShowFriction] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Vector math
  const radA = (angA * Math.PI) / 180;
  const radB = (angB * Math.PI) / 180;
  const ax = magA * Math.cos(radA);
  const ay = magA * Math.sin(radA);
  const bx = magB * Math.cos(radB);
  const by = magB * Math.sin(radB);
  const rx = ax + bx;
  const ry = ay + by;
  const magR = Math.hypot(rx, ry);
  const angR = (Math.atan2(ry, rx) * 180) / Math.PI;
  const betweenAngle = Math.abs(angB - angA);

  // FBD math
  const radInc = (inclineDeg * Math.PI) / 180;
  const mg1 = mass1 * G;
  const mgSin = mg1 * Math.sin(radInc);
  const mgCos = mg1 * Math.cos(radInc);
  const fIncline = Math.min(mgSin, mu * mgCos);
  const aIncline = Math.max(0, (mgSin - mu * mgCos) / mass1);

  const fHorizFriction = Math.min(appliedF, mu * mg1);
  const aHoriz = Math.max(0, (appliedF - mu * mg1) / mass1);

  const aAtwood = ((mass2 - mass1) * G) / (mass1 + mass2);
  const tAtwood = (2 * mass1 * mass2 * G) / (mass1 + mass2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth || 720;
    const height = 400;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const p = getCanvasPalette(theme);
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, width, height);
    drawGrid(ctx, width, height, p, 40);

    if (boardMode === 'vectors') {
      const ox = width * 0.42;
      const oy = height * 0.64;
      const scale = 2.3;

      // Axes
      ctx.strokeStyle = p.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(24, oy);
      ctx.lineTo(width - 24, oy);
      ctx.moveTo(ox, 20);
      ctx.lineTo(ox, height - 20);
      ctx.stroke();

      const axPx = ox + ax * scale;
      const ayPx = oy - ay * scale;
      const bxPx = ox + bx * scale;
      const byPx = oy - by * scale;
      const rxPx = ox + rx * scale;
      const ryPx = oy - ry * scale;

      if (showComponents) {
        drawVectorArrow(ctx, ox, oy, axPx, oy, p, `Ax=${ax.toFixed(1)}`, 'dotted', 2);
        drawVectorArrow(ctx, axPx, oy, axPx, ayPx, p, `Ay=${ay.toFixed(1)}`, 'dotted', 2);
      }

      if (lawMode === 'parallelogram') {
        // Construction parallelogram lines
        ctx.strokeStyle = p.inkMuted;
        ctx.lineWidth = 1.6;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(axPx, ayPx);
        ctx.lineTo(rxPx, ryPx);
        ctx.moveTo(bxPx, byPx);
        ctx.lineTo(rxPx, ryPx);
        ctx.stroke();
        ctx.setLineDash([]);

        drawVectorArrow(ctx, ox, oy, axPx, ayPx, p, `A=${magA}`, 'dashed');
        drawVectorArrow(ctx, ox, oy, bxPx, byPx, p, `B=${magB}`, 'double');
      } else {
        // Head-to-tail Triangle Law
        drawVectorArrow(ctx, ox, oy, axPx, ayPx, p, `A=${magA}`, 'dashed');
        drawVectorArrow(ctx, axPx, ayPx, rxPx, ryPx, p, `B=${magB}`, 'double');
      }

      // Resultant Vector R
      drawVectorArrow(ctx, ox, oy, rxPx, ryPx, p, `R=${magR.toFixed(1)} (${angR.toFixed(0)}°)`, 'solid', 4.5);

      drawLegendPill(ctx, 16, 16, 'Resultant R (Solid)', 'solid', p);
      drawLegendPill(ctx, 16, 48, 'Vector A (Dashed)', 'dashed', p);
      drawLegendPill(ctx, 16, 80, 'Vector B (Double)', 'double', p);
    } else if (fbdScene === 'incline') {
      // ===== INCLINED PLANE FBD =====
      const baseX = width * 0.14;
      const baseY = height * 0.84;
      const run = width * 0.66;
      const rise = run * Math.tan(Math.min(radInc, 0.72));

      ctx.strokeStyle = p.ink;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(baseX + run, baseY);
      ctx.lineTo(baseX + run, baseY - rise);
      ctx.closePath();
      ctx.stroke();

      // Block center halfway up slope
      const slopeAng = Math.atan2(rise, run);
      const midX = baseX + run * 0.52;
      const midY = baseY - rise * 0.52;
      const nx = -Math.sin(slopeAng);
      const ny = -Math.cos(slopeAng);
      const bx = midX + nx * 24;
      const by = midY + ny * 24;

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(-slopeAng);
      drawHatchRect(ctx, -34, -22, 68, 44, 'diagonal', p, 4);
      ctx.restore();

      const fScale = 1.9;
      if (showMg) {
        drawVectorArrow(ctx, bx, by, bx, by + Math.min(125, mg1 * fScale), p, `mg=${mg1.toFixed(1)}N`, 'solid');
      }
      if (showMgParts) {
        const downX = -Math.cos(slopeAng);
        const downY = Math.sin(slopeAng);
        const perpX = Math.sin(slopeAng);
        const perpY = Math.cos(slopeAng);
        drawVectorArrow(ctx, bx, by, bx + downX * Math.min(115, mgSin * fScale), by + downY * Math.min(115, mgSin * fScale), p, `mg·sinθ=${mgSin.toFixed(1)}N`, 'dashed');
        drawVectorArrow(ctx, bx, by, bx + perpX * Math.min(110, mgCos * fScale), by + perpY * Math.min(110, mgCos * fScale), p, `mg·cosθ=${mgCos.toFixed(1)}N`, 'dotted');
      }
      if (showNormal) {
        drawVectorArrow(ctx, bx, by, bx + nx * Math.min(110, mgCos * fScale), by + ny * Math.min(110, mgCos * fScale), p, `N=${mgCos.toFixed(1)}N`, 'double');
      }
      if (showFriction && fIncline > 0.1) {
        const upX = Math.cos(slopeAng);
        const upY = -Math.sin(slopeAng);
        drawVectorArrow(ctx, bx, by, bx + upX * Math.min(100, fIncline * fScale + 20), by + upY * Math.min(100, fIncline * fScale + 20), p, `f=${fIncline.toFixed(1)}N`, 'dotted');
      }
      drawLegendPill(ctx, 16, 16, `Incline θ = ${inclineDeg}° · a = ${aIncline.toFixed(2)} m/s²`, 'solid', p);
    } else if (fbdScene === 'horizontal') {
      const floorY = height * 0.68;
      const cx = width * 0.48;
      const cy = floorY - 32;
      ctx.strokeStyle = p.ink;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(width * 0.1, floorY);
      ctx.lineTo(width * 0.9, floorY);
      ctx.stroke();

      drawHatchRect(ctx, cx - 44, floorY - 64, 88, 64, 'diagonal', p, 4);
      const sc = 2.0;
      if (showMg) drawVectorArrow(ctx, cx, cy, cx, cy + Math.min(110, mg1 * sc), p, `mg=${mg1.toFixed(1)}N`, 'dotted');
      if (showNormal) drawVectorArrow(ctx, cx, cy, cx, cy - Math.min(110, mg1 * sc), p, `N=${mg1.toFixed(1)}N`, 'double');
      drawVectorArrow(ctx, cx + 44, cy, cx + 44 + Math.min(140, appliedF * sc), cy, p, `F_app=${appliedF}N`, 'solid');
      if (showFriction && fHorizFriction > 0.1) {
        drawVectorArrow(ctx, cx - 44, floorY - 12, cx - 44 - Math.min(125, fHorizFriction * sc + 16), floorY - 12, p, `f=${fHorizFriction.toFixed(1)}N`, 'dashed');
      }
      drawLegendPill(ctx, 16, 16, `Net a = ${aHoriz.toFixed(2)} m/s²`, 'solid', p);
    } else {
      // ===== ATWOOD PULLEY FBD =====
      const px = width * 0.5;
      const py = 92;
      const pr = 34;

      ctx.strokeStyle = p.ink;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(px - 60, 26);
      ctx.lineTo(px + 60, 26);
      ctx.moveTo(px, 26);
      ctx.lineTo(px, py);
      ctx.stroke();

      ctx.fillStyle = p.bg;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      const x1 = px - pr;
      const x2 = px + pr;
      const y1 = 235;
      const y2 = 265;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(x1, py);
      ctx.lineTo(x1, y1);
      ctx.moveTo(x2, py);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      drawHatchRect(ctx, x1 - 28, y1, 56, 48, 'diagonal', p, 4);
      drawHatchRect(ctx, x2 - 30, y2, 60, 52, 'cross', p, 4);

      if (showNormal) {
        drawVectorArrow(ctx, x1, y1, x1, y1 - 68, p, `T=${tAtwood.toFixed(1)}N`, 'double');
        drawVectorArrow(ctx, x2, y2, x2, y2 - 68, p, `T=${tAtwood.toFixed(1)}N`, 'double');
      }
      if (showMg) {
        drawVectorArrow(ctx, x1, y1 + 48, x1, y1 + 108, p, `m₁g=${(mass1 * G).toFixed(1)}N`, 'solid');
        drawVectorArrow(ctx, x2, y2 + 52, x2, y2 + 122, p, `m₂g=${(mass2 * G).toFixed(1)}N`, 'solid');
      }
      drawLegendPill(ctx, 16, 16, `Atwood a = ${aAtwood.toFixed(2)} m/s² · T = ${tAtwood.toFixed(1)} N`, 'solid', p);
    }
  }, [
    boardMode,
    theme,
    magA,
    angA,
    magB,
    angB,
    ax,
    ay,
    bx,
    by,
    rx,
    ry,
    magR,
    angR,
    showComponents,
    lawMode,
    fbdScene,
    mass1,
    mass2,
    inclineDeg,
    mu,
    appliedF,
    showMg,
    showMgParts,
    showNormal,
    showFriction,
    mg1,
    mgSin,
    mgCos,
    fIncline,
    aIncline,
    fHorizFriction,
    aHoriz,
    aAtwood,
    tAtwood,
    radInc,
  ]);

  return (
    <div className="space-y-5">
      <div className="inline-flex items-center gap-1 p-1 rounded-xl border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900">
        <button
          type="button"
          onClick={() => setBoardMode('vectors')}
          className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-lg cursor-pointer ${
            boardMode === 'vectors'
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'text-black dark:text-white'
          }`}
        >
          {language === 'hi' ? 'सदिश योग व घटक बोर्ड (Vectors)' : 'Vector Addition & Component Resolver'}
        </button>
        <button
          type="button"
          onClick={() => setBoardMode('fbd')}
          className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-lg cursor-pointer ${
            boardMode === 'fbd'
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'text-black dark:text-white'
          }`}
        >
          {language === 'hi' ? 'मुक्त-पिंड आरेख निर्माता (FBD Builder)' : 'Free-Body Diagram (FBD) Builder'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border-2 border-black dark:border-white overflow-hidden bg-white dark:bg-black">
            <canvas ref={canvasRef} className="w-full h-[400px] block" />
          </div>

          <div className="p-4 rounded-xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-mono text-xs sm:text-sm">
            {boardMode === 'vectors' ? (
              <div className="space-y-1">
                <div className="font-extrabold text-base">
                  |R⃗| = √({magA}² + {magB}² + 2·{magA}·{magB}·cos({betweenAngle}°)) = {magR.toFixed(2)} units at θ_R = {angR.toFixed(1)}°
                </div>
                <div className="opacity-90">
                  R_x = A_x + B_x = {ax.toFixed(1)} + ({bx.toFixed(1)}) = {rx.toFixed(1)}  |  R_y = {ay.toFixed(1)} + ({by.toFixed(1)}) = {ry.toFixed(1)}
                </div>
              </div>
            ) : fbdScene === 'incline' ? (
              <div className="space-y-1">
                <div className="font-extrabold text-base">
                  N = mg cosθ = {mgCos.toFixed(1)} N  |  mg sinθ = {mgSin.toFixed(1)} N  |  a = {aIncline.toFixed(2)} m/s²
                </div>
                <div className="opacity-90">
                  Max Friction f_max = μ·N = {(mu * mgCos).toFixed(1)} N ({mgSin > mu * mgCos ? 'Block Slides Down' : 'Static Equilibrium — Stays at Rest'})
                </div>
              </div>
            ) : fbdScene === 'horizontal' ? (
              <div className="font-extrabold text-base">
                F_net = F_app − f = {Math.max(0, appliedF - mu * mg1).toFixed(1)} N  |  a = {aHoriz.toFixed(2)} m/s²  |  N = {mg1.toFixed(1)} N
              </div>
            ) : (
              <div className="font-extrabold text-base">
                a = (m₂ − m₁)g / (m₁ + m₂) = {aAtwood.toFixed(2)} m/s²  |  Tension T = {tAtwood.toFixed(1)} N
              </div>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="lg:col-span-4 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5 space-y-4">
          {boardMode === 'vectors' ? (
            <>
              <div className="flex gap-2">
                {(['parallelogram', 'triangle'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setLawMode(m)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border-2 capitalize cursor-pointer ${
                      lawMode === m
                        ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                        : 'border-neutral-400 dark:border-neutral-600'
                    }`}
                  >
                    {m} Law
                  </button>
                ))}
              </div>

              {[
                { label: 'Magnitude |A|', val: magA, set: setMagA, min: 5, max: 60, unit: 'N' },
                { label: 'Angle θ_A', val: angA, set: setAngA, min: 0, max: 360, unit: '°' },
                { label: 'Magnitude |B|', val: magB, set: setMagB, min: 5, max: 60, unit: 'N' },
                { label: 'Angle θ_B', val: angB, set: setAngB, min: 0, max: 360, unit: '°' },
              ].map((s) => (
                <div key={s.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{s.label}</span>
                    <span className="font-mono font-extrabold">{s.val}{s.unit}</span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    value={s.val}
                    onChange={(e) => s.set(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              ))}

              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer pt-2 border-t border-neutral-300 dark:border-neutral-700">
                <input
                  type="checkbox"
                  checked={showComponents}
                  onChange={(e) => setShowComponents(e.target.checked)}
                />
                <span>Show Rectangular Components (A cos θ, A sin θ)</span>
              </label>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'incline', label: 'Incline' },
                    { id: 'horizontal', label: 'Flat Block' },
                    { id: 'atwood', label: 'Pulley' },
                  ] as const
                ).map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setFbdScene(sc.id)}
                    className={`py-1.5 text-xs font-bold rounded-lg border-2 cursor-pointer ${
                      fbdScene === sc.id
                        ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                        : 'border-neutral-400 dark:border-neutral-600'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Mass m₁</span>
                    <span className="font-mono font-extrabold">{mass1} kg</span>
                  </div>
                  <input type="range" min={1} max={15} value={mass1} onChange={(e) => setMass1(Number(e.target.value))} className="w-full" />
                </div>

                {fbdScene === 'atwood' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Mass m₂</span>
                      <span className="font-mono font-extrabold">{mass2} kg</span>
                    </div>
                    <input type="range" min={1} max={15} value={mass2} onChange={(e) => setMass2(Number(e.target.value))} className="w-full" />
                  </div>
                )}

                {fbdScene === 'incline' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Incline Angle θ</span>
                      <span className="font-mono font-extrabold">{inclineDeg}°</span>
                    </div>
                    <input type="range" min={10} max={55} value={inclineDeg} onChange={(e) => setInclineDeg(Number(e.target.value))} className="w-full" />
                  </div>
                )}

                {fbdScene === 'horizontal' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Applied Pull Force F</span>
                      <span className="font-mono font-extrabold">{appliedF} N</span>
                    </div>
                    <input type="range" min={0} max={80} value={appliedF} onChange={(e) => setAppliedF(Number(e.target.value))} className="w-full" />
                  </div>
                )}

                {fbdScene !== 'atwood' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Friction Coeff. μ</span>
                      <span className="font-mono font-extrabold">{mu.toFixed(2)}</span>
                    </div>
                    <input type="range" min={0} max={0.8} step={0.05} value={mu} onChange={(e) => setMu(Number(e.target.value))} className="w-full" />
                  </div>
                )}
              </div>

              {/* Step-by-Step Force Reveal Checkboxes */}
              <div className="space-y-2 pt-3 border-t-2 border-black dark:border-white">
                <div className="text-xs font-mono font-extrabold uppercase text-neutral-700 dark:text-neutral-300">
                  Toggle FBD Forces Step-by-Step
                </div>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input type="checkbox" checked={showMg} onChange={(e) => setShowMg(e.target.checked)} />
                  <span>Weight Vector (mg)</span>
                </label>
                {fbdScene === 'incline' && (
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input type="checkbox" checked={showMgParts} onChange={(e) => setShowMgParts(e.target.checked)} />
                    <span>Resolved Components (mg sin θ, mg cos θ)</span>
                  </label>
                )}
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input type="checkbox" checked={showNormal} onChange={(e) => setShowNormal(e.target.checked)} />
                  <span>{fbdScene === 'atwood' ? 'String Tension (T)' : 'Normal Reaction (N)'}</span>
                </label>
                {fbdScene !== 'atwood' && (
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input type="checkbox" checked={showFriction} onChange={(e) => setShowFriction(e.target.checked)} />
                    <span>Friction Force (f)</span>
                  </label>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
