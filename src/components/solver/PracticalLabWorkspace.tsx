import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, RefreshCw, XCircle } from 'lucide-react';
import { LanguageMode, ThemeMode } from '../../types/physics';
import { getCanvasPalette } from '../../utils/canvasHelpers';

interface PracticalLabWorkspaceProps {
  language: LanguageMode;
  theme: ThemeMode;
}

const VERNIER_OBJECTS = [
  { id: 'sphere', labelEn: 'Steel Pendulum Bob', labelHi: 'इस्पात लोलक गोला', valueCm: 2.36 },
  { id: 'cylinder', labelEn: 'Copper Cylinder', labelHi: 'ताँबे का बेलन', valueCm: 1.74 },
  { id: 'cube', labelEn: 'Brass Block', labelHi: 'पीतल का गुटका', valueCm: 3.18 },
  { id: 'coin', labelEn: 'Metal Coin', labelHi: 'धातु सिक्का', valueCm: 2.52 },
];

const SCREW_OBJECTS = [
  { id: 'wire', labelEn: 'Copper Wire Gauge', labelHi: 'ताँबे का तार', valueMm: 1.42 },
  { id: 'glass', labelEn: 'Microscope Glass Slide', labelHi: 'काँच की स्लाइड', valueMm: 2.68 },
  { id: 'sheet', labelEn: 'Aluminium Sheet', labelHi: 'एल्युमीनियम पट्टी', valueMm: 0.86 },
  { id: 'shot', labelEn: 'Lead Shot Sphere', labelHi: 'सीसे की गोली', valueMm: 4.35 },
];

export function PracticalLabWorkspace({ language, theme }: PracticalLabWorkspaceProps) {
  const [instrument, setInstrument] = useState<'vernier' | 'screw'>('vernier');

  // Vernier state (in cm)
  const [trueCm, setTrueCm] = useState(2.36);
  const [vernierZeroErrDiv, setVernierZeroErrDiv] = useState(0); // -4 to +4 divisions (each 0.01 cm)
  const [vernierLC, setVernierLC] = useState<0.01 | 0.02>(0.01);

  // Screw gauge state (in mm)
  const [trueMm, setTrueMm] = useState(2.68);
  const [screwPitch, setScrewPitch] = useState<0.5 | 1.0>(1.0);
  const [screwDivisions, setScrewDivisions] = useState<50 | 100>(100);
  const [screwZeroErrDiv, setScrewZeroErrDiv] = useState(0); // -5 to +5 divisions

  // Student Viva Challenge mode
  const [challengeMode, setChallengeMode] = useState(false);
  const [studentInput, setStudentInput] = useState('');
  const [challengeFeedback, setChallengeFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Vernier calculations
  const vernierZeroErrCm = vernierZeroErrDiv * vernierLC;
  const vernierObservedCm = Math.max(0, trueCm + vernierZeroErrCm);
  const vernierMSR = Math.floor(vernierObservedCm * 10 + 1e-6) / 10; // in cm (0.1 cm main scale marks)
  const vernierVSD = Math.round((vernierObservedCm - vernierMSR) / vernierLC);
  const vernierTotalObserved = vernierMSR + vernierVSD * vernierLC;
  const vernierCorrected = vernierTotalObserved - vernierZeroErrCm;

  // Screw gauge calculations
  const screwLC = screwPitch / screwDivisions; // e.g., 1.0/100 = 0.01 mm or 0.5/50 = 0.01 mm
  const screwZeroErrMm = screwZeroErrDiv * screwLC;
  const screwObservedMm = Math.max(0, trueMm + screwZeroErrMm);
  const screwPSR = Math.floor(screwObservedMm / screwPitch + 1e-6) * screwPitch;
  const screwCSR = Math.round((screwObservedMm - screwPSR) / screwLC) % screwDivisions;
  const screwTotalObserved = screwPSR + screwCSR * screwLC;
  const screwCorrected = screwTotalObserved - screwZeroErrMm;

  const startRandomChallenge = () => {
    setChallengeMode(true);
    setStudentInput('');
    setChallengeFeedback('idle');
    if (instrument === 'vernier') {
      const steps = Math.floor(Math.random() * 340) + 45; // 0.45 to 3.85 cm
      setTrueCm(Number((steps * vernierLC).toFixed(2)));
    } else {
      const steps = Math.floor(Math.random() * 480) + 55; // 0.55 to 5.35 mm
      setTrueMm(Number((steps * screwLC).toFixed(2)));
    }
  };

  const checkStudentAnswer = () => {
    const guess = Number(studentInput);
    if (Number.isNaN(guess)) {
      setChallengeFeedback('wrong');
      return;
    }
    const target = instrument === 'vernier' ? vernierCorrected : screwCorrected;
    const tol = instrument === 'vernier' ? vernierLC * 1.1 : screwLC * 1.1;
    setChallengeFeedback(Math.abs(guess - target) <= tol ? 'correct' : 'wrong');
  };

  // Draw Pure B&W High-DPI Instrument + 4x Zoomed Coincidence Loupe
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth || 780;
    const height = 390;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const p = getCanvasPalette(theme);
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, width, height);

    if (instrument === 'vernier') {
      // ===== VERNIER CALIPER MAIN VIEW =====
      const scaleLeft = 72;
      const pxPerCm = Math.min(110, (width - 140) / 5.5);
      const beamY = 104;
      const beamH = 44;

      // Fixed jaw (left)
      ctx.strokeStyle = p.ink;
      ctx.fillStyle = p.bg;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(scaleLeft, beamY);
      ctx.lineTo(scaleLeft, beamY + 115);
      ctx.lineTo(scaleLeft - 24, beamY + 95);
      ctx.lineTo(scaleLeft - 24, beamY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Main scale beam
      ctx.fillStyle = p.bg;
      ctx.fillRect(scaleLeft, beamY, pxPerCm * 5.2, beamH);
      ctx.strokeRect(scaleLeft, beamY, pxPerCm * 5.2, beamH);

      // Main scale ticks (mm & cm)
      ctx.fillStyle = p.ink;
      ctx.font = '700 12px "IBM Plex Mono", monospace';
      for (let mm = 0; mm <= 50; mm++) {
        const x = scaleLeft + (mm / 10) * pxPerCm;
        const isCm = mm % 10 === 0;
        const isHalf = mm % 5 === 0;
        const tickH = isCm ? 20 : isHalf ? 14 : 9;
        ctx.lineWidth = isCm ? 2.4 : 1.4;
        ctx.beginPath();
        ctx.moveTo(x, beamY + beamH);
        ctx.lineTo(x, beamY + beamH - tickH);
        ctx.stroke();
        if (isCm) {
          ctx.fillText(String(mm / 10), x - 4, beamY + 17);
        }
      }
      ctx.fillText('MAIN SCALE (cm)', scaleLeft + pxPerCm * 3.6, beamY - 10);

      // Clamped object between jaws
      const jawX = scaleLeft + vernierObservedCm * pxPerCm;
      const objW = Math.max(4, vernierObservedCm * pxPerCm);
      ctx.fillStyle = p.fillSoft;
      ctx.fillRect(scaleLeft + 1.5, beamY + beamH + 20, objW - 3, 54);
      ctx.strokeStyle = p.ink;
      ctx.lineWidth = 2.4;
      ctx.strokeRect(scaleLeft + 1.5, beamY + beamH + 20, objW - 3, 54);

      // Movable Vernier jaw & slider window
      const vernierDivs = Math.round(0.1 / vernierLC); // 10 or 5
      const vernierTotalCm = (vernierDivs - 1) * 0.1; // 9 mm for 10 divs
      const vernierW = vernierTotalCm * pxPerCm;

      ctx.fillStyle = p.bg;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(jawX, beamY + beamH);
      ctx.lineTo(jawX, beamY + 115);
      ctx.lineTo(jawX + 24, beamY + 95);
      ctx.lineTo(jawX + 24, beamY + beamH + 28);
      ctx.lineTo(jawX + vernierW + 24, beamY + beamH + 28);
      ctx.lineTo(jawX + vernierW + 24, beamY + beamH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Vernier ticks
      for (let i = 0; i <= vernierDivs; i++) {
        const vx = jawX + (i / vernierDivs) * vernierW;
        const isMajor = i === 0 || i === vernierDivs || i === Math.floor(vernierDivs / 2);
        ctx.lineWidth = isMajor ? 2.2 : 1.4;
        ctx.beginPath();
        ctx.moveTo(vx, beamY + beamH);
        ctx.lineTo(vx, beamY + beamH + (isMajor ? 15 : 10));
        ctx.stroke();
      }

      // ===== 4× ZOOMED COINCIDENCE MAGNIFIER LOUPE =====
      const loupeX = 28;
      const loupeY = 236;
      const loupeW = width - 56;
      const loupeH = 136;

      ctx.fillStyle = p.bg;
      ctx.strokeStyle = p.ink;
      ctx.lineWidth = 3;
      ctx.strokeRect(loupeX, loupeY, loupeW, loupeH);
      ctx.fillRect(loupeX, loupeY, loupeW, loupeH);

      ctx.fillStyle = p.ink;
      ctx.font = '800 12.5px "IBM Plex Mono", monospace';
      ctx.fillText(
        `4× PROJECTOR MAGNIFIER LOUPE — FIND COINCIDING VERNIER DIVISION (LC = ${vernierLC} cm)`,
        loupeX + 12,
        loupeY + 20
      );

      const midLineY = loupeY + 76;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(loupeX + 12, midLineY);
      ctx.lineTo(loupeX + loupeW - 12, midLineY);
      ctx.stroke();

      const zoomOriginCm = Math.max(0, vernierMSR - 0.1);
      const zoomSpanCm = 1.25;
      const zoomPxPerCm = (loupeW - 56) / zoomSpanCm;
      const mapZoomX = (cm: number) => loupeX + 28 + (cm - zoomOriginCm) * zoomPxPerCm;

      // Zoomed Main Scale (above midline)
      const startMm = Math.floor(zoomOriginCm * 10);
      for (let mm = startMm; mm <= startMm + 13; mm++) {
        const x = mapZoomX(mm / 10);
        if (x < loupeX + 14 || x > loupeX + loupeW - 14) continue;
        const isCm = mm % 10 === 0;
        const isHalf = mm % 5 === 0;
        ctx.lineWidth = isCm ? 3 : 1.8;
        ctx.beginPath();
        ctx.moveTo(x, midLineY);
        ctx.lineTo(x, midLineY - (isCm ? 32 : isHalf ? 24 : 16));
        ctx.stroke();
        if (isCm || isHalf) {
          ctx.font = '700 11.5px "IBM Plex Mono", monospace';
          ctx.fillText((mm / 10).toFixed(1), x - 11, midLineY - 36);
        }
      }

      // Zoomed Vernier Scale (below midline)
      const vernierStepCm = (vernierDivs - 1) * 0.1 / vernierDivs; // 0.09 cm
      for (let i = 0; i <= vernierDivs; i++) {
        const cmPos = vernierObservedCm + i * vernierStepCm;
        const x = mapZoomX(cmPos);
        if (x < loupeX + 14 || x > loupeX + loupeW - 14) continue;
        const isCoinciding = !challengeMode && i === vernierVSD;
        ctx.strokeStyle = p.ink;
        ctx.lineWidth = isCoinciding ? 4 : i === 0 ? 3 : 1.8;
        ctx.beginPath();
        ctx.moveTo(x, midLineY);
        ctx.lineTo(x, midLineY + (isCoinciding ? 32 : 20));
        ctx.stroke();

        ctx.fillStyle = p.ink;
        ctx.font = isCoinciding ? '800 13px "IBM Plex Mono", monospace' : '700 11px "IBM Plex Mono", monospace';
        ctx.fillText(String(i), x - 4, midLineY + (isCoinciding ? 48 : 34));

        if (isCoinciding) {
          // Bold coincidence marker arrow
          ctx.beginPath();
          ctx.arc(x, midLineY, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else {
      // ===== MICROMETER SCREW GAUGE MAIN VIEW =====
      const anvilX = 95;
      const axisY = 122;
      const pxPerMm = 18;
      const gapPx = Math.max(8, screwObservedMm * pxPerMm);
      const spindleEndX = anvilX + gapPx;

      // C-Frame
      ctx.strokeStyle = p.ink;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(anvilX - 18, axisY);
      ctx.lineTo(anvilX - 38, axisY);
      ctx.bezierCurveTo(anvilX - 50, axisY + 95, spindleEndX + 95, axisY + 95, spindleEndX + 80, axisY + 24);
      ctx.stroke();

      // Fixed Anvil
      ctx.fillStyle = p.ink;
      ctx.fillRect(anvilX - 18, axisY - 14, 18, 28);

      // Clamped Wire / Sheet
      ctx.fillStyle = p.fillSoft;
      ctx.fillRect(anvilX, axisY - 22, gapPx, 44);
      ctx.lineWidth = 2.4;
      ctx.strokeRect(anvilX, axisY - 22, gapPx, 44);

      // Spindle + Sleeve (Pitch Scale)
      const sleeveX = anvilX + 135;
      ctx.fillStyle = p.bg;
      ctx.lineWidth = 3;
      ctx.fillRect(spindleEndX, axisY - 12, sleeveX - spindleEndX, 24);
      ctx.strokeRect(spindleEndX, axisY - 12, sleeveX - spindleEndX, 24);

      // Main Sleeve
      ctx.fillRect(sleeveX, axisY - 24, 170, 48);
      ctx.strokeRect(sleeveX, axisY - 24, 170, 48);

      // Datum Line on Sleeve
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(sleeveX, axisY);
      ctx.lineTo(sleeveX + 170, axisY);
      ctx.stroke();

      // Pitch ticks on sleeve
      const thimbleX = sleeveX + 20 + screwObservedMm * 14;
      ctx.fillStyle = p.ink;
      ctx.font = '700 11px "IBM Plex Mono", monospace';
      for (let mm = 0; mm <= 10; mm++) {
        const tx = sleeveX + 20 + mm * 14;
        if (tx > thimbleX) break;
        ctx.lineWidth = mm % 5 === 0 ? 2.4 : 1.5;
        ctx.beginPath();
        ctx.moveTo(tx, axisY);
        ctx.lineTo(tx, axisY - (mm % 5 === 0 ? 15 : 10));
        ctx.stroke();
        if (mm % 5 === 0) ctx.fillText(String(mm), tx - 3, axisY - 17);
      }

      // Rotating Circular Thimble
      ctx.fillStyle = p.bg;
      ctx.lineWidth = 3.2;
      ctx.fillRect(thimbleX, axisY - 34, 118, 68);
      ctx.strokeRect(thimbleX, axisY - 34, 118, 68);

      // Circular scale divisions on thimble edge
      for (let offset = -5; offset <= 5; offset++) {
        const divNum = (screwCSR + offset + screwDivisions) % screwDivisions;
        const dy = axisY - offset * 5.8;
        const isFive = divNum % 5 === 0;
        ctx.lineWidth = offset === 0 ? 3 : 1.4;
        ctx.beginPath();
        ctx.moveTo(thimbleX, dy);
        ctx.lineTo(thimbleX + (isFive ? 22 : 12), dy);
        ctx.stroke();
        if (isFive) {
          ctx.fillStyle = p.ink;
          ctx.fillText(String(divNum), thimbleX + 26, dy + 4);
        }
      }

      // ===== 4× ZOOMED SCREW GAUGE LOUPE =====
      const loupeX = 28;
      const loupeY = 232;
      const loupeW = width - 56;
      const loupeH = 140;

      ctx.fillStyle = p.bg;
      ctx.strokeStyle = p.ink;
      ctx.lineWidth = 3;
      ctx.fillRect(loupeX, loupeY, loupeW, loupeH);
      ctx.strokeRect(loupeX, loupeY, loupeW, loupeH);

      ctx.fillStyle = p.ink;
      ctx.font = '800 12.5px "IBM Plex Mono", monospace';
      ctx.fillText(
        `4× THIMBLE & PITCH SCALE LOUPE (Pitch = ${screwPitch} mm · ${screwDivisions} Divs · LC = ${screwLC} mm)`,
        loupeX + 12,
        loupeY + 20
      );

      const datumY = loupeY + 86;
      const edgeX = loupeX + loupeW * 0.62;

      // Zoomed Pitch Scale (left of bevel edge)
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(loupeX + 22, datumY);
      ctx.lineTo(edgeX, datumY);
      ctx.stroke();

      const mmZoom = 46;
      const maxMmVisible = Math.floor(screwObservedMm / screwPitch);
      for (let k = Math.max(0, maxMmVisible - 5); k <= maxMmVisible; k++) {
        const mmVal = k * screwPitch;
        const x = edgeX - (screwObservedMm - mmVal) * mmZoom;
        if (x < loupeX + 26) continue;
        const isWhole = Math.abs(mmVal - Math.round(mmVal)) < 1e-6;
        ctx.lineWidth = isWhole ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(x, datumY);
        ctx.lineTo(x, isWhole ? datumY - 26 : datumY + 22);
        ctx.stroke();
        if (isWhole) {
          ctx.font = '800 12px "IBM Plex Mono", monospace';
          ctx.fillText(`${mmVal} mm`, x - 14, datumY - 32);
        }
      }

      // Zoomed Beveled Thimble Vertical Edge
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(edgeX, loupeY + 32);
      ctx.lineTo(edgeX, loupeY + loupeH - 10);
      ctx.stroke();

      for (let off = -4; off <= 4; off++) {
        const div = (screwCSR + off + screwDivisions) % screwDivisions;
        const y = datumY - off * 11.5;
        const isAligned = off === 0;
        ctx.lineWidth = isAligned ? 4 : div % 5 === 0 ? 2.4 : 1.5;
        ctx.beginPath();
        ctx.moveTo(edgeX, y);
        ctx.lineTo(edgeX + (isAligned ? 48 : div % 5 === 0 ? 34 : 20), y);
        ctx.stroke();
        if (isAligned || div % 5 === 0) {
          ctx.font = isAligned ? '800 14px "IBM Plex Mono", monospace' : '700 11.5px "IBM Plex Mono", monospace';
          ctx.fillText(
            isAligned && !challengeMode ? `${div}  ◀ COINCIDES` : String(div),
            edgeX + 54,
            y + 5
          );
        }
      }
    }
  }, [
    instrument,
    theme,
    vernierObservedCm,
    vernierMSR,
    vernierVSD,
    vernierLC,
    screwObservedMm,
    screwPitch,
    screwDivisions,
    screwLC,
    screwCSR,
    challengeMode,
  ]);

  return (
    <div className="space-y-5">
      {/* Instrument Switcher & Challenge Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900">
          <button
            type="button"
            onClick={() => {
              setInstrument('vernier');
              setChallengeMode(false);
              setChallengeFeedback('idle');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-lg cursor-pointer ${
              instrument === 'vernier'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-black dark:text-white'
            }`}
          >
            {language === 'hi' ? 'वर्नियर कैलिपर्स (Vernier Caliper)' : 'Vernier Caliper Lab'}
          </button>
          <button
            type="button"
            onClick={() => {
              setInstrument('screw');
              setChallengeMode(false);
              setChallengeFeedback('idle');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-lg cursor-pointer ${
              instrument === 'screw'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-black dark:text-white'
            }`}
          >
            {language === 'hi' ? 'स्क्रू गेज (Screw Gauge)' : 'Micrometer Screw Gauge Lab'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (challengeMode) {
                setChallengeMode(false);
                setChallengeFeedback('idle');
              } else {
                startRandomChallenge();
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold rounded-lg border-2 border-black dark:border-white cursor-pointer ${
              challengeMode
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            {challengeMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{challengeMode ? 'Exit Viva Challenge' : 'Student Reading Challenge'}</span>
          </button>
          {challengeMode && (
            <button
              type="button"
              onClick={startRandomChallenge}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Object</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split: High-Contrast Canvas + Instrument Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border-2 border-black dark:border-white overflow-hidden bg-white dark:bg-black">
            <canvas ref={canvasRef} className="w-full h-[390px] block" />
          </div>

          {/* Reading Breakdown / Viva Check Box */}
          {challengeMode ? (
            <div className="p-5 rounded-xl border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-950 space-y-3">
              <div className="text-sm font-extrabold text-black dark:text-white">
                {language === 'hi'
                  ? `छात्र वाइवा चुनौती: ज़ूम लूप पढ़कर सही मान (${instrument === 'vernier' ? 'cm' : 'mm'}) दर्ज करें`
                  : `Student Viva Challenge: Read the 4× Loupe and enter the corrected diameter (${instrument === 'vernier' ? 'cm' : 'mm'})`}
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  type="number"
                  step="0.01"
                  value={studentInput}
                  onChange={(e) => setStudentInput(e.target.value)}
                  placeholder={instrument === 'vernier' ? 'e.g. 2.36' : 'e.g. 2.68'}
                  className="w-44 px-3.5 py-2 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black font-mono text-base font-extrabold text-black dark:text-white"
                />
                <span className="font-mono text-sm font-bold">{instrument === 'vernier' ? 'cm' : 'mm'}</span>
                <button
                  type="button"
                  onClick={checkStudentAnswer}
                  className="px-4 py-2 text-xs font-extrabold rounded-lg bg-black text-white dark:bg-white dark:text-black cursor-pointer"
                >
                  Check Reading
                </button>
              </div>
              {challengeFeedback === 'correct' && (
                <div className="inline-flex items-center gap-2 text-sm font-extrabold text-black dark:text-white">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Correct! Exact diameter ={' '}
                    {instrument === 'vernier'
                      ? `${vernierCorrected.toFixed(2)} cm`
                      : `${screwCorrected.toFixed(2)} mm`}
                  </span>
                </div>
              )}
              {challengeFeedback === 'wrong' && (
                <div className="inline-flex items-center gap-2 text-sm font-extrabold text-black dark:text-white">
                  <XCircle className="w-4 h-4" />
                  <span>Not quite — check the zero error sign and coinciding division again!</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 rounded-xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black space-y-2">
              {instrument === 'vernier' ? (
                <>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-xs font-mono font-bold uppercase opacity-80">
                      Corrected Reading = MSR + (VSD × LC) − Zero Error
                    </span>
                    <span className="font-mono text-3xl font-extrabold tabular-nums">
                      {vernierCorrected.toFixed(2)} cm
                    </span>
                  </div>
                  <div className="font-mono text-xs sm:text-sm opacity-95">
                    = {vernierMSR.toFixed(1)} cm + ({vernierVSD} × {vernierLC} cm) − ({vernierZeroErrCm >= 0 ? '+' : ''}
                    {vernierZeroErrCm.toFixed(2)} cm) = {vernierTotalObserved.toFixed(2)} − ({vernierZeroErrCm.toFixed(2)}) ={' '}
                    <strong>{vernierCorrected.toFixed(2)} cm</strong>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-xs font-mono font-bold uppercase opacity-80">
                      Corrected Reading = PSR + (CSR × LC) − Zero Error
                    </span>
                    <span className="font-mono text-3xl font-extrabold tabular-nums">
                      {screwCorrected.toFixed(2)} mm
                    </span>
                  </div>
                  <div className="font-mono text-xs sm:text-sm opacity-95">
                    = {screwPSR.toFixed(1)} mm + ({screwCSR} × {screwLC} mm) − ({screwZeroErrMm >= 0 ? '+' : ''}
                    {screwZeroErrMm.toFixed(2)} mm) = {screwTotalObserved.toFixed(2)} − ({screwZeroErrMm.toFixed(2)}) ={' '}
                    <strong>{screwCorrected.toFixed(2)} mm</strong>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Controls Deck */}
        <div className="lg:col-span-4 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5 space-y-5">
          {instrument === 'vernier' ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{language === 'hi' ? 'वस्तु का वास्तविक व्यास' : 'Jaw Opening (True Diameter)'}</span>
                  <span className="font-mono font-extrabold tabular-nums">
                    {challengeMode ? 'HIDDEN' : `${trueCm.toFixed(2)} cm`}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={4.0}
                  step={vernierLC}
                  value={trueCm}
                  disabled={challengeMode}
                  onChange={(e) => setTrueCm(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                  TEST SPECIMENS
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {VERNIER_OBJECTS.map((obj) => (
                    <button
                      key={obj.id}
                      type="button"
                      disabled={challengeMode}
                      onClick={() => setTrueCm(obj.valueCm)}
                      className="p-2 text-left text-xs font-bold rounded-lg border-2 border-neutral-400 dark:border-neutral-600 hover:border-black dark:hover:border-white disabled:opacity-40 cursor-pointer"
                    >
                      <div>{language === 'hi' ? obj.labelHi : obj.labelEn}</div>
                      <div className="font-mono opacity-75">{obj.valueCm.toFixed(2)} cm</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                  LEAST COUNT (LC)
                </div>
                <div className="flex gap-2">
                  {([0.01, 0.02] as const).map((lc) => (
                    <button
                      key={lc}
                      type="button"
                      onClick={() => setVernierLC(lc)}
                      className={`flex-1 py-1.5 text-xs font-mono font-extrabold rounded-lg border-2 cursor-pointer ${
                        vernierLC === lc
                          ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                          : 'border-neutral-400 dark:border-neutral-600'
                      }`}
                    >
                      {lc} cm
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Zero Error (ZE)</span>
                  <span className="font-mono font-extrabold">
                    {vernierZeroErrCm >= 0 ? '+' : ''}
                    {vernierZeroErrCm.toFixed(2)} cm ({vernierZeroErrDiv} div)
                  </span>
                </div>
                <input
                  type="range"
                  min={-4}
                  max={4}
                  step={1}
                  value={vernierZeroErrDiv}
                  onChange={(e) => setVernierZeroErrDiv(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{language === 'hi' ? 'तार / पट्टी की मोटाई' : 'Object Thickness (True)'}</span>
                  <span className="font-mono font-extrabold tabular-nums">
                    {challengeMode ? 'HIDDEN' : `${trueMm.toFixed(2)} mm`}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={6.5}
                  step={screwLC}
                  value={trueMm}
                  disabled={challengeMode}
                  onChange={(e) => setTrueMm(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                  TEST SPECIMENS
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SCREW_OBJECTS.map((obj) => (
                    <button
                      key={obj.id}
                      type="button"
                      disabled={challengeMode}
                      onClick={() => setTrueMm(obj.valueMm)}
                      className="p-2 text-left text-xs font-bold rounded-lg border-2 border-neutral-400 dark:border-neutral-600 hover:border-black dark:hover:border-white disabled:opacity-40 cursor-pointer"
                    >
                      <div>{language === 'hi' ? obj.labelHi : obj.labelEn}</div>
                      <div className="font-mono opacity-75">{obj.valueMm.toFixed(2)} mm</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">PITCH</div>
                  <div className="flex gap-1">
                    {([0.5, 1.0] as const).map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => setScrewPitch(pt)}
                        className={`flex-1 py-1.5 text-xs font-mono font-bold rounded border-2 cursor-pointer ${
                          screwPitch === pt
                            ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                            : 'border-neutral-400 dark:border-neutral-600'
                        }`}
                      >
                        {pt}mm
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">DIVISIONS</div>
                  <div className="flex gap-1">
                    {([50, 100] as const).map((dv) => (
                      <button
                        key={dv}
                        type="button"
                        onClick={() => setScrewDivisions(dv)}
                        className={`flex-1 py-1.5 text-xs font-mono font-bold rounded border-2 cursor-pointer ${
                          screwDivisions === dv
                            ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                            : 'border-neutral-400 dark:border-neutral-600'
                        }`}
                      >
                        {dv}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Zero Error (ZE)</span>
                  <span className="font-mono font-extrabold">
                    {screwZeroErrMm >= 0 ? '+' : ''}
                    {screwZeroErrMm.toFixed(2)} mm ({screwZeroErrDiv} div)
                  </span>
                </div>
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={1}
                  value={screwZeroErrDiv}
                  onChange={(e) => setScrewZeroErrDiv(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
