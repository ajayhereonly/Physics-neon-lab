import { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pause,
  Play,
  Printer,
  RotateCcw,
  Search,
} from 'lucide-react';
import { LanguageMode } from '../../types/physics';
import {
  CURATED_BOARD_DERIVATIONS,
  CuratedBoardDerivation,
  DerivationDiagramKind,
} from '../../data/curatedDerivations';
import { getBilingualPrimary, getBilingualSecondary } from '../../utils/bilingual';

interface DerivationReplayerWorkspaceProps {
  language: LanguageMode;
  initialSimId?: string | null;
  onLaunchSimulation: (simId: string) => void;
}

/**
 * Pure Black & White geometric SVG schematic diagrams for classroom board derivations.
 */
function DerivationSchematicSvg({ kind }: { kind: DerivationDiagramKind }) {
  const strokeCls = 'stroke-black dark:stroke-white';
  const fillCls = 'fill-black dark:fill-white';
  return (
    <svg
      viewBox="0 0 360 175"
      className="w-full h-44 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black"
      role="img"
      aria-label={`Physics derivation schematic for ${kind}`}
    >
      {kind === 'kinematics-vt' && (
        <g>
          <line x1="45" y1="145" x2="320" y2="145" className={strokeCls} strokeWidth="2.5" />
          <line x1="45" y1="145" x2="45" y2="20" className={strokeCls} strokeWidth="2.5" />
          <polygon points="45,145 45,95 270,35 270,145" className="fill-neutral-200 dark:fill-neutral-800" />
          <line x1="45" y1="95" x2="270" y2="35" className={strokeCls} strokeWidth="3.5" />
          <line x1="45" y1="95" x2="270" y2="95" className={strokeCls} strokeWidth="1.8" strokeDasharray="5 4" />
          <line x1="270" y1="35" x2="270" y2="145" className={strokeCls} strokeWidth="1.8" strokeDasharray="5 4" />
          <text x="22" y="99" className={`${fillCls} font-mono text-xs font-bold`}>u</text>
          <text x="22" y="40" className={`${fillCls} font-mono text-xs font-bold`}>v</text>
          <text x="264" y="162" className={`${fillCls} font-mono text-xs font-bold`}>t</text>
          <text x="125" y="128" className={`${fillCls} font-mono text-xs font-bold`}>Area = s = ut + ½at²</text>
          <text x="145" y="55" className={`${fillCls} font-mono text-xs font-bold`}>Slope = a</text>
        </g>
      )}
      {kind === 'projectile' && (
        <g>
          <line x1="30" y1="145" x2="335" y2="145" className={strokeCls} strokeWidth="2.5" />
          <path d="M 45 145 Q 185 5 320 145" fill="none" className={strokeCls} strokeWidth="3.2" />
          <line x1="45" y1="145" x2="115" y2="75" className={strokeCls} strokeWidth="3" />
          <line x1="185" y1="75" x2="185" y2="145" className={strokeCls} strokeWidth="2" strokeDasharray="5 4" />
          <text x="86" y="74" className={`${fillCls} font-mono text-xs font-bold`}>u (θ)</text>
          <text x="192" y="115" className={`${fillCls} font-mono text-xs font-bold`}>H_max</text>
          <text x="160" y="164" className={`${fillCls} font-mono text-xs font-bold`}>Range R = u²sin2θ / g</text>
        </g>
      )}
      {kind === 'banking-road' && (
        <g>
          <line x1="40" y1="145" x2="320" y2="145" className={strokeCls} strokeWidth="2" strokeDasharray="5 4" />
          <line x1="55" y1="145" x2="300" y2="60" className={strokeCls} strokeWidth="3.5" />
          <rect x="165" y="72" width="44" height="24" transform="rotate(-19 187 84)" fill="none" className={strokeCls} strokeWidth="3" />
          <line x1="187" y1="84" x2="162" y2="22" className={strokeCls} strokeWidth="3" />
          <line x1="187" y1="84" x2="187" y2="142" className={strokeCls} strokeWidth="3" />
          <text x="148" y="24" className={`${fillCls} font-mono text-xs font-bold`}>N</text>
          <text x="193" y="138" className={`${fillCls} font-mono text-xs font-bold`}>mg</text>
          <text x="95" y="140" className={`${fillCls} font-mono text-xs font-bold`}>θ</text>
        </g>
      )}
      {kind === 'rolling-incline' && (
        <g>
          <polygon points="45,145 315,145 45,35" fill="none" className={strokeCls} strokeWidth="2.8" />
          <circle cx="155" cy="64" r="22" fill="none" className={strokeCls} strokeWidth="3.5" />
          <line x1="155" y1="64" x2="177" y2="64" className={strokeCls} strokeWidth="2.5" />
          <text x="148" y="34" className={`${fillCls} font-mono text-xs font-bold`}>ω, v_cm</text>
          <text x="20" y="95" className={`${fillCls} font-mono text-xs font-bold`}>h</text>
          <text x="258" y="140" className={`${fillCls} font-mono text-xs font-bold`}>θ</text>
        </g>
      )}
      {kind === 'escape-velocity' && (
        <g>
          <circle cx="115" cy="95" r="46" fill="none" className={strokeCls} strokeWidth="3.5" />
          <line x1="115" y1="95" x2="161" y2="95" className={strokeCls} strokeWidth="2" />
          <line x1="161" y1="95" x2="310" y2="95" className={strokeCls} strokeWidth="2.6" strokeDasharray="7 5" />
          <polygon points="315,95 302,88 302,102" className={fillCls} />
          <text x="95" y="99" className={`${fillCls} font-mono text-xs font-bold`}>M, R</text>
          <text x="195" y="84" className={`${fillCls} font-mono text-xs font-bold`}>v_e → r = ∞ (E=0)</text>
        </g>
      )}
      {kind === 'bernoulli' && (
        <g>
          <path d="M 35 120 C 120 120 140 60 220 60 L 325 60" fill="none" className={strokeCls} strokeWidth="3" />
          <path d="M 35 150 C 120 150 140 85 220 85 L 325 85" fill="none" className={strokeCls} strokeWidth="3" />
          <text x="50" y="110" className={`${fillCls} font-mono text-xs font-bold`}>A₁, P₁, v₁</text>
          <text x="230" y="50" className={`${fillCls} font-mono text-xs font-bold`}>A₂, P₂, v₂ (h₂)</text>
        </g>
      )}
      {kind === 'simple-pendulum' && (
        <g>
          <line x1="110" y1="22" x2="250" y2="22" className={strokeCls} strokeWidth="4" />
          <line x1="180" y1="22" x2="180" y2="142" className={strokeCls} strokeWidth="1.6" strokeDasharray="5 4" />
          <line x1="180" y1="22" x2="232" y2="128" className={strokeCls} strokeWidth="2.8" />
          <circle cx="232" cy="128" r="14" className={fillCls} />
          <text x="188" y="65" className={`${fillCls} font-mono text-xs font-bold`}>θ</text>
          <text x="214" y="82" className={`${fillCls} font-mono text-xs font-bold`}>L</text>
          <text x="252" y="132" className={`${fillCls} font-mono text-xs font-bold`}>−mg sinθ</text>
        </g>
      )}
      {kind === 'carnot' && (
        <g>
          <line x1="50" y1="145" x2="310" y2="145" className={strokeCls} strokeWidth="2.5" />
          <line x1="50" y1="145" x2="50" y2="20" className={strokeCls} strokeWidth="2.5" />
          <path d="M 95 45 Q 150 58 205 68 Q 235 100 265 122 Q 190 116 140 105 Q 112 75 95 45 Z" fill="none" className={strokeCls} strokeWidth="3" />
          <text x="132" y="42" className={`${fillCls} font-mono text-xs font-bold`}>Isotherm T₁ (Q₁ in)</text>
          <text x="145" y="134" className={`${fillCls} font-mono text-xs font-bold`}>Isotherm T₂ (Q₂ out)</text>
          <text x="28" y="34" className={`${fillCls} font-mono text-xs font-bold`}>P</text>
          <text x="300" y="160" className={`${fillCls} font-mono text-xs font-bold`}>V</text>
        </g>
      )}
      {kind === 'gauss-wire' && (
        <g>
          <line x1="180" y1="15" x2="180" y2="160" className={strokeCls} strokeWidth="4" />
          <ellipse cx="180" cy="45" rx="58" ry="14" fill="none" className={strokeCls} strokeWidth="2.2" strokeDasharray="5 4" />
          <ellipse cx="180" cy="130" rx="58" ry="14" fill="none" className={strokeCls} strokeWidth="2.2" strokeDasharray="5 4" />
          <line x1="122" y1="45" x2="122" y2="130" className={strokeCls} strokeWidth="2.2" strokeDasharray="5 4" />
          <line x1="238" y1="45" x2="238" y2="130" className={strokeCls} strokeWidth="2.2" strokeDasharray="5 4" />
          <line x1="238" y1="88" x2="292" y2="88" className={strokeCls} strokeWidth="3" />
          <text x="252" y="80" className={`${fillCls} font-mono text-xs font-bold`}>E⃗ (radial)</text>
          <text x="188" y="34" className={`${fillCls} font-mono text-xs font-bold`}>+λ</text>
        </g>
      )}
      {kind === 'lcr-phasor' && (
        <g>
          <line x1="100" y1="95" x2="265" y2="95" className={strokeCls} strokeWidth="3" />
          <line x1="100" y1="95" x2="100" y2="25" className={strokeCls} strokeWidth="3" />
          <line x1="100" y1="95" x2="100" y2="145" className={strokeCls} strokeWidth="2.5" strokeDasharray="4 3" />
          <line x1="100" y1="95" x2="245" y2="42" className={strokeCls} strokeWidth="3.5" />
          <text x="108" y="32" className={`${fillCls} font-mono text-xs font-bold`}>V_L (+90°)</text>
          <text x="108" y="152" className={`${fillCls} font-mono text-xs font-bold`}>V_C (−90°)</text>
          <text x="258" y="110" className={`${fillCls} font-mono text-xs font-bold`}>V_R, I</text>
          <text x="215" y="42" className={`${fillCls} font-mono text-xs font-bold`}>V_net (φ)</text>
        </g>
      )}
      {kind === 'lens-maker' && (
        <g>
          <line x1="25" y1="90" x2="335" y2="90" className={strokeCls} strokeWidth="1.8" strokeDasharray="6 4" />
          <path d="M 180 28 Q 206 90 180 152 Q 154 90 180 28 Z" fill="none" className={strokeCls} strokeWidth="3" />
          <line x1="65" y1="90" x2="178" y2="52" className={strokeCls} strokeWidth="2.5" />
          <line x1="178" y1="52" x2="295" y2="90" className={strokeCls} strokeWidth="2.5" />
          <text x="58" y="108" className={`${fillCls} font-mono text-xs font-bold`}>O (u)</text>
          <text x="168" y="22" className={`${fillCls} font-mono text-xs font-bold`}>R₁, R₂ (n₂)</text>
          <text x="288" y="108" className={`${fillCls} font-mono text-xs font-bold`}>I (v)</text>
        </g>
      )}
      {kind === 'prism' && (
        <g>
          <polygon points="180,26 105,148 255,148" fill="none" className={strokeCls} strokeWidth="3.2" />
          <polyline points="40,120 140,92 220,92 318,125" fill="none" className={strokeCls} strokeWidth="2.8" />
          <text x="174" y="54" className={`${fillCls} font-mono text-xs font-bold`}>A</text>
          <text x="55" y="104" className={`${fillCls} font-mono text-xs font-bold`}>i</text>
          <text x="285" y="108" className={`${fillCls} font-mono text-xs font-bold`}>e (δ=D_m)</text>
        </g>
      )}
      {kind === 'ydse' && (
        <g>
          <line x1="95" y1="20" x2="95" y2="62" className={strokeCls} strokeWidth="4" />
          <line x1="95" y1="74" x2="95" y2="106" className={strokeCls} strokeWidth="4" />
          <line x1="95" y1="118" x2="95" y2="158" className={strokeCls} strokeWidth="4" />
          <line x1="295" y1="18" x2="295" y2="160" className={strokeCls} strokeWidth="3.5" />
          <line x1="95" y1="68" x2="295" y2="48" className={strokeCls} strokeWidth="2" />
          <line x1="95" y1="112" x2="295" y2="48" className={strokeCls} strokeWidth="2" strokeDasharray="5 4" />
          <text x="72" y="72" className={`${fillCls} font-mono text-xs font-bold`}>S₁</text>
          <text x="72" y="116" className={`${fillCls} font-mono text-xs font-bold`}>S₂</text>
          <text x="180" y="152" className={`${fillCls} font-mono text-xs font-bold`}>D ≫ d  |  β = λD/d</text>
          <text x="302" y="52" className={`${fillCls} font-mono text-xs font-bold`}>P(y)</text>
        </g>
      )}
      {![
        'kinematics-vt',
        'projectile',
        'banking-road',
        'rolling-incline',
        'escape-velocity',
        'bernoulli',
        'simple-pendulum',
        'carnot',
        'gauss-wire',
        'lcr-phasor',
        'lens-maker',
        'prism',
        'ydse',
      ].includes(kind) && (
        <g>
          <circle cx="180" cy="88" r="46" fill="none" className={strokeCls} strokeWidth="2.8" strokeDasharray="6 4" />
          <circle cx="180" cy="88" r="14" className={fillCls} />
          <line x1="55" y1="88" x2="305" y2="88" className={strokeCls} strokeWidth="2" />
          <line x1="180" y1="22" x2="180" y2="154" className={strokeCls} strokeWidth="2" />
          <text x="234" y="78" className={`${fillCls} font-mono text-xs font-bold`}>
            Board Schematic
          </text>
        </g>
      )}
    </svg>
  );
}

export function DerivationReplayerWorkspace({
  language,
  initialSimId,
  onLaunchSimulation,
}: DerivationReplayerWorkspaceProps) {
  const [classFilter, setClassFilter] = useState<'all' | 'Class 11' | 'Class 12'>('all');
  const [marksFilter, setMarksFilter] = useState<'all' | '3 Marks' | '5 Marks'>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (initialSimId) {
      const found = CURATED_BOARD_DERIVATIONS.find((d) => d.simId === initialSimId);
      if (found) return found.id;
    }
    return CURATED_BOARD_DERIVATIONS[0].id;
  });
  const [revealedCount, setRevealedCount] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  useEffect(() => {
    if (!initialSimId) return;
    const found = CURATED_BOARD_DERIVATIONS.find((d) => d.simId === initialSimId);
    if (found) {
      setSelectedId(found.id);
      setRevealedCount(1);
      setIsAutoPlaying(false);
    }
  }, [initialSimId]);

  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CURATED_BOARD_DERIVATIONS.filter((item) => {
      if (classFilter !== 'all' && item.classLevel !== classFilter) return false;
      if (marksFilter !== 'all' && item.marks !== marksFilter) return false;
      if (!q) return true;
      return (
        item.title.en.toLowerCase().includes(q) ||
        item.title.hi.includes(q) ||
        item.finalFormula.toLowerCase().includes(q)
      );
    });
  }, [classFilter, marksFilter, query]);

  const activeDerivation: CuratedBoardDerivation = useMemo(
    () => CURATED_BOARD_DERIVATIONS.find((d) => d.id === selectedId) ?? CURATED_BOARD_DERIVATIONS[0],
    [selectedId]
  );

  const totalSteps = activeDerivation.steps.length;

  useEffect(() => {
    if (!isAutoPlaying) return;
    if (revealedCount >= totalSteps) {
      setIsAutoPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setRevealedCount((c) => Math.min(totalSteps, c + 1));
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [isAutoPlaying, revealedCount, totalSteps]);

  const handleSelectDerivation = (id: string) => {
    setSelectedId(id);
    setRevealedCount(1);
    setIsAutoPlaying(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Curated Syllabus Index */}
      <div className="lg:col-span-4 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-4 space-y-3 no-print">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-white pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'hi' ? 'व्युत्पत्ति खोजें (लेंस, गॉस, बोर)...' : 'Search NCERT derivation (Lens, Gauss, Bohr)...'}
            className="w-full pl-9 pr-3 py-2 text-sm font-medium rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(['all', 'Class 11', 'Class 12'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setClassFilter(c)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md border-2 cursor-pointer ${
                classFilter === c
                  ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                  : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white'
              }`}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
          {(['all', '3 Marks', '5 Marks'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMarksFilter(m)}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md border-2 cursor-pointer ${
                marksFilter === m
                  ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                  : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white'
              }`}
            >
              {m === 'all' ? 'All Marks' : m}
            </button>
          ))}
        </div>

        <div className="max-h-[560px] overflow-y-auto space-y-2 pr-1 lab-scroll">
          {filteredList.map((item) => {
            const active = item.id === activeDerivation.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectDerivation(item.id)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                  active
                    ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                    : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black text-black dark:text-white hover:border-black dark:hover:border-white'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono font-bold opacity-80">
                  <span>Ch {item.chapterNumber} · {item.classLevel}</span>
                  <span>{item.marks}</span>
                </div>
                <div className="text-sm font-bold mt-0.5 leading-snug">
                  {getBilingualPrimary(item.title, language)}
                </div>
                <div className="font-mono text-xs mt-1 truncate opacity-90">
                  {item.finalFormula}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Projector Chalkboard Derivation Replayer */}
      <div className="lg:col-span-8 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-6 space-y-5">
        {/* Header & Actions */}
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b-2 border-black dark:border-white">
          <div className="min-w-0">
            <div className="text-xs font-mono font-extrabold text-neutral-700 dark:text-neutral-300">
              NCERT {activeDerivation.classLevel} · Ch {activeDerivation.chapterNumber} · Board Weightage: {activeDerivation.marks}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-black dark:text-white mt-1">
              {getBilingualPrimary(activeDerivation.title, language)}
            </h2>
            {getBilingualSecondary(activeDerivation.title, language) && (
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                {activeDerivation.title.hi}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              type="button"
              onClick={() => {
                setRevealedCount(totalSteps);
                window.setTimeout(() => window.print(), 120);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => onLaunchSimulation(activeDerivation.simId)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 whitespace-nowrap cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'hi' ? 'लाइव सिमुलेशन' : 'Prove in Lab'}</span>
            </button>
          </div>
        </div>

        {/* Schematic + Assumptions Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          <div className="md:col-span-6">
            <DerivationSchematicSvg kind={activeDerivation.diagram} />
          </div>
          <div className="md:col-span-6 p-4 rounded-lg border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-mono font-extrabold uppercase text-neutral-700 dark:text-neutral-300 mb-1.5">
                {language === 'hi' ? 'मान्यताएँ व शर्तें' : 'Key Physical Assumptions'}
              </div>
              <ul className="space-y-1 text-xs sm:text-sm font-medium text-black dark:text-white list-disc pl-4">
                {activeDerivation.assumptions.map((a, i) => (
                  <li key={i}>{getBilingualPrimary(a, language)}</li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-neutral-300 dark:border-neutral-700">
              <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                TARGET RESULT
              </div>
              <div className="font-mono text-sm sm:text-base font-extrabold text-black dark:text-white mt-0.5">
                {activeDerivation.finalFormula}
              </div>
            </div>
          </div>
        </div>

        {/* Chalkboard Replay Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 rounded-xl border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 no-print">
          <div className="text-xs sm:text-sm font-mono font-extrabold text-black dark:text-white">
            STEP {revealedCount} / {totalSteps}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={revealedCount <= 1}
              onClick={() => {
                setIsAutoPlaying(false);
                setRevealedCount((c) => Math.max(1, c - 1));
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <button
              type="button"
              disabled={revealedCount >= totalSteps}
              onClick={() => {
                setIsAutoPlaying(false);
                setRevealedCount((c) => Math.min(totalSteps, c + 1));
              }}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-extrabold rounded-lg bg-black text-white dark:bg-white dark:text-black disabled:opacity-40 cursor-pointer"
            >
              <span>{language === 'hi' ? 'अगला चरण' : 'Next Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (revealedCount >= totalSteps) setRevealedCount(1);
                setIsAutoPlaying((p) => !p);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white cursor-pointer"
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? 'Pause' : 'Auto-Play'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAutoPlaying(false);
                setRevealedCount(totalSteps);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Reveal All</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAutoPlaying(false);
                setRevealedCount(1);
              }}
              className="p-1.5 rounded-lg border-2 border-neutral-500 text-black dark:text-white hover:border-black dark:hover:border-white cursor-pointer"
              title="Reset steps"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progressive Steps Board */}
        <ol className="space-y-3.5">
          {activeDerivation.steps.slice(0, revealedCount).map((st, idx) => {
            const isFinal = idx === totalSteps - 1;
            const secNote = getBilingualSecondary(st.note, language);
            return (
              <li
                key={idx}
                className={`p-4 rounded-xl border-2 space-y-2 ${
                  isFinal
                    ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                    : 'border-black dark:border-white bg-white dark:bg-black text-black dark:text-white'
                }`}
              >
                <div className="text-xs font-mono font-extrabold uppercase opacity-80">
                  STEP 0{idx + 1} · {getBilingualPrimary(st.title, language)}
                </div>
                <div
                  className={`font-mono text-lg sm:text-xl font-extrabold px-3.5 py-2.5 rounded-lg overflow-x-auto ${
                    isFinal
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black border border-neutral-600 dark:border-neutral-400'
                      : 'bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  {st.equation}
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-95">
                  {getBilingualPrimary(st.note, language)}
                </p>
                {secNote && <p className="text-xs opacity-75 leading-relaxed">{secNote}</p>}
              </li>
            );
          })}
        </ol>

        {/* Board Exam Marking Scheme Breakdown */}
        <div className="p-4 rounded-xl border-2 border-dashed border-black dark:border-white space-y-2">
          <div className="text-xs font-mono font-extrabold uppercase text-black dark:text-white">
            {language === 'hi'
              ? `बोर्ड परीक्षा अंक विभाजन (${activeDerivation.marks})`
              : `CBSE / NCERT Board Exam Step Marking (${activeDerivation.marks})`}
          </div>
          <ul className="space-y-1 text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 list-disc pl-4">
            {activeDerivation.markingScheme.map((m, i) => (
              <li key={i}>{getBilingualPrimary(m, language)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
