import React, { useMemo, useState } from 'react';
import { Printer, Shuffle } from 'lucide-react';
import { LanguageMode } from '../../types/physics';
import { AIRFORCE_MOCK_SETS, generateBalancedAirforceMock } from '../../data/airforceXBoosters';
import { formatBilingual } from '../../utils/bilingual';

interface AirforcePrintMockWorkspaceProps {
  language: LanguageMode;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const AirforcePrintMockWorkspace: React.FC<AirforcePrintMockWorkspaceProps> = ({
  language,
}) => {
  const [instituteName, setInstituteName] = useState<string>(
    'PhysicaLive Defence Academy — Airforce X Group (Agniveer Vayu)'
  );
  const [batchLabel, setBatchLabel] = useState<string>('Agniveer Vayu Batch · Physics Mock Paper');
  const [selectedSetIdx, setSelectedSetIdx] = useState<number>(0);
  const [customSeed, setCustomSeed] = useState<number | null>(null);
  const [includeOmr, setIncludeOmr] = useState<boolean>(true);
  const [includeTeacherKey, setIncludeTeacherKey] = useState<boolean>(true);
  const [markingMode, setMarkingMode] = useState<'official' | 'practice'>('official');

  const activeSeed =
    customSeed !== null ? customSeed : AIRFORCE_MOCK_SETS[selectedSetIdx]?.seed ?? 202401;

  const questions = useMemo(() => generateBalancedAirforceMock(activeSeed), [activeSeed]);

  const setTitle =
    customSeed !== null
      ? `Custom Balanced Set #${String(customSeed).slice(-4)}`
      : AIRFORCE_MOCK_SETS[selectedSetIdx]?.label.en ?? 'Agniveer Vayu Mock 01';

  return (
    <div className="space-y-5">
      {/* Non-Printable Configuration Toolbar */}
      <div className="no-print border-2 border-black dark:border-white p-4 sm:p-5 bg-white dark:bg-black space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
              PURE B&W A4 PHOTOCOPY-READY · 25 QUESTIONS + OMR SHEET
            </div>
            <h2 className="text-lg font-extrabold mt-0.5">
              {language === 'hi'
                ? 'प्रिंटेबल 25-प्रश्न एयरफोर्स X मॉक पेपर + OMR उत्तर पत्रक'
                : 'Printable 25-Q Airforce X Mock PDF + Circular OMR Sheet'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold border-2 border-black bg-black text-white hover:bg-black/85 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/85 whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            {language === 'hi' ? 'A4 PDF प्रिंट / सेव करें' : 'Print / Save A4 PDF'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">
              {language === 'hi' ? 'संस्थान / कोचिंग शीर्षक' : 'Institute / Coaching Header'}
            </label>
            <input
              type="text"
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
              className="w-full h-9 px-3 text-xs font-bold border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">
              {language === 'hi' ? 'बैच / परीक्षा विवरण' : 'Batch / Exam Subtitle'}
            </label>
            <input
              type="text"
              value={batchLabel}
              onChange={(e) => setBatchLabel(e.target.value)}
              className="w-full h-9 px-3 text-xs font-bold border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/15 dark:border-white/15">
          {/* Set Picker + Shuffle */}
          <div className="flex flex-wrap items-center gap-1.5">
            {AIRFORCE_MOCK_SETS.map((preset, idx) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setSelectedSetIdx(idx);
                  setCustomSeed(null);
                }}
                className={`px-3 py-1.5 text-xs font-bold border-2 whitespace-nowrap ${
                  customSeed === null && selectedSetIdx === idx
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                    : 'border-black/35 dark:border-white/35'
                }`}
              >
                Set 0{idx + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCustomSeed(Math.floor(10000 + Math.random() * 89999))}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 whitespace-nowrap ${
                customSeed !== null
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                  : 'border-black dark:border-white'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              {language === 'hi' ? 'नया रैंडम सेट' : 'Shuffle New 25-Q Set'}
            </button>
          </div>

          {/* Toggle Options */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <label className="inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={markingMode === 'official'}
                onChange={(e) => setMarkingMode(e.target.checked ? 'official' : 'practice')}
                className="accent-black dark:accent-white"
              />
              +1 / −0.25 Header
            </label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={includeOmr}
                onChange={(e) => setIncludeOmr(e.target.checked)}
                className="accent-black dark:accent-white"
              />
              25-Row OMR Sheet
            </label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={includeTeacherKey}
                onChange={(e) => setIncludeTeacherKey(e.target.checked)}
                className="accent-black dark:accent-white"
              />
              Teacher Answer + Shortcut Key
            </label>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* PRINTABLE PURE BLACK & WHITE A4 EXAM PAPER                            */}
      {/* ===================================================================== */}
      <div className="bg-white text-black border-2 border-black p-6 sm:p-8 space-y-6">
        {/* Official Exam Header */}
        <div className="border-2 border-black p-4 text-center space-y-1.5">
          <div className="text-lg sm:text-xl font-extrabold uppercase tracking-tight">
            {instituteName}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider">
            {batchLabel} · {setTitle}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] font-mono font-bold pt-2 border-t border-black">
            <span>QUESTIONS: 25 (PHYSICS)</span>
            <span>TIME: 20 MINUTES</span>
            <span>MAX MARKS: 25</span>
            <span>
              MARKING: {markingMode === 'official' ? '+1 CORRECT / −0.25 WRONG' : '+1 CORRECT / 0 WRONG'}
            </span>
            <span>SECTIONAL CUTOFF: 10/25</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-left text-xs font-mono">
            <div className="border-b border-black pb-1">Candidate Name: ______________________</div>
            <div className="border-b border-black pb-1">Roll / Batch No.: ________________</div>
            <div className="border-b border-black pb-1">Score: ______ / 25</div>
          </div>
        </div>

        {/* 25 Questions Grid (Compact Print Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="break-inside-avoid border-b border-black/30 pb-3 space-y-1.5 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold leading-snug">
                  <span className="font-mono font-extrabold mr-1.5">
                    Q{String(idx + 1).padStart(2, '0')}.
                  </span>
                  {formatBilingual(q.question, language)}
                </div>
                <span className="font-mono text-[10px] shrink-0 text-black/70">[{q.yearTag}]</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 pl-4 text-[11px]">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="leading-snug">
                    <span className="font-mono font-bold mr-1">({OPTION_LETTERS[oIdx]})</span>
                    {formatBilingual(opt, language)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 25-Row Circular OMR Answer Sheet */}
        {includeOmr && (
          <div className="break-before-page break-inside-avoid border-2 border-black p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-black">
              <div>
                <div className="text-sm font-extrabold uppercase tracking-wider">
                  OMR ANSWER SHEET (Q01 – Q25)
                </div>
                <div className="text-[11px] font-mono">
                  Darken only ONE circle completely with Black/Blue Ballpoint Pen ●
                </div>
              </div>
              <div className="text-[11px] font-mono font-bold">
                {setTitle} · {markingMode === 'official' ? '+1 / −0.25' : '+1 / 0'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[0, 5, 10, 15, 20].map((start) => (
                <div key={start} className="border border-black p-2 space-y-1.5">
                  <div className="grid grid-cols-5 text-center font-mono text-[10px] font-extrabold border-b border-black pb-1">
                    <span>Q#</span>
                    <span>A</span>
                    <span>B</span>
                    <span>C</span>
                    <span>D</span>
                  </div>
                  {Array.from({ length: 5 }, (_, offset) => {
                    const qNum = start + offset + 1;
                    return (
                      <div
                        key={qNum}
                        className="grid grid-cols-5 items-center justify-items-center py-0.5 font-mono text-[10px]"
                      >
                        <span className="font-extrabold tabular-nums">
                          {String(qNum).padStart(2, '0')}
                        </span>
                        {OPTION_LETTERS.map((letter) => (
                          <span
                            key={letter}
                            className="w-5 h-5 rounded-full border-[1.5px] border-black inline-flex items-center justify-center text-[9px] font-bold"
                          >
                            {letter}
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teacher Answer Key + 20-Second Shortcut Reference */}
        {includeTeacherKey && (
          <div className="break-before-page border-2 border-black p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-black">
              <div className="text-sm font-extrabold uppercase tracking-wider">
                TEACHER ANSWER KEY & 20-SECOND SHORTCUTS ({setTitle})
              </div>
              <div className="text-[11px] font-mono font-bold">DETACH BEFORE STUDENT EXAM</div>
            </div>

            {/* Quick OMR Grid Key */}
            <div className="grid grid-cols-5 sm:grid-cols-5 gap-1.5 font-mono text-[11px] pb-2 border-b border-black/40">
              {questions.map((q, idx) => (
                <div key={q.id} className="border border-black/40 px-2 py-1 tabular-nums">
                  <strong>Q{String(idx + 1).padStart(2, '0')}:</strong> {OPTION_LETTERS[q.correctIndex]}
                </div>
              ))}
            </div>

            {/* 20-Second Shortcut Solutions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2 text-[11px]">
              {questions.map((q, idx) => (
                <div key={q.id} className="break-inside-avoid pb-1.5 border-b border-black/20">
                  <span className="font-mono font-extrabold mr-1.5">
                    Q{String(idx + 1).padStart(2, '0')} ({OPTION_LETTERS[q.correctIndex]}):
                  </span>
                  <span className="font-semibold">{formatBilingual(q.shortcut20s, language)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
