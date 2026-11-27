import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Loader2,
  Play,
  RotateCcw,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  AIWordProblemSolution,
  LanguageMode,
  PhysicsSimulation,
} from '../../types/physics';
import { BUILTIN_SIMULATIONS, CHAPTERS } from '../../data/simulations';
import { getDerivationSpec } from '../../data/derivationsRegistry';
import {
  CUSTOM_EQUATION_PRESETS,
  extractEquationVariables,
  getInlineUnitOptions,
  PHYSICAL_CONSTANTS,
  solveCustomEquation,
} from '../../utils/equationSolverEngine';
import { formatPhysicsNumber } from '../../utils/mathParser';
import { getBilingualPrimary, getBilingualSecondary } from '../../utils/bilingual';

interface EquationSolverWorkspaceProps {
  language: LanguageMode;
  initialSimId?: string | null;
  initialStageParams?: Record<string, number> | null;
  injectedConstant?: { symbol: string; value: number } | null;
  onClearInjectedConstant?: () => void;
  onLaunchSimulation: (simId: string) => void;
  onOpenDerivation: (simId: string) => void;
}

const SAMPLE_WORD_PROBLEMS = [
  {
    label: 'Kinematics (72 km/h braking)',
    text: 'A car moving at 72 km/h applies brakes and comes to rest in 5 seconds with uniform retardation. Find its retardation and the distance covered before stopping.',
  },
  {
    label: 'Escape Velocity (Planet)',
    text: 'A planet has mass equal to 2 times Earth mass (M = 1.2 × 10^25 kg) and radius 8000 km. Calculate the escape velocity on its surface.',
  },
  {
    label: 'Moment of Inertia & Torque',
    text: 'A solid disc of mass 4 kg and radius 50 cm is acted upon by a tangential force of 12 N at its rim. Find its moment of inertia and angular acceleration.',
  },
  {
    label: 'Thin Convex Lens',
    text: 'An object of height 4 cm is placed 30 cm in front of a convex lens of focal length 20 cm. Find the image position, magnification, and nature of image.',
  },
  {
    label: 'Ohm’s Law & Heat (Hindi)',
    text: '20 Ω प्रतिरोध के हीटर से 5 A की विद्युत धारा 2 मिनट तक प्रवाहित होती है। उत्पन्न कुल जूल ऊष्मा और विद्युत शक्ति ज्ञात कीजिए।',
  },
];

export function EquationSolverWorkspace({
  language,
  initialSimId,
  initialStageParams,
  injectedConstant,
  onClearInjectedConstant,
  onLaunchSimulation,
  onOpenDerivation,
}: EquationSolverWorkspaceProps) {
  const [mode, setMode] = useState<'formula' | 'algebraic' | 'word'>('formula');

  // --- Mode 1: Built-in 59 NCERT & Foundation Formula Presets ---
  const [filterScope, setFilterScope] = useState<'all' | 'foundation' | 'Class 11' | 'Class 12'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSimId, setSelectedSimId] = useState<string>(initialSimId || 'speed-velocity');
  const [selectedSolverIdx, setSelectedSolverIdx] = useState(0);
  const [formulaInputs, setFormulaInputs] = useState<Record<string, string>>({});
  const [formulaUnitIdx, setFormulaUnitIdx] = useState<Record<string, number>>({});

  useEffect(() => {
    if (initialSimId) {
      setSelectedSimId(initialSimId);
      setMode('formula');
      setSelectedSolverIdx(0);
    }
  }, [initialSimId]);

  const chapterMap = useMemo(() => new Map(CHAPTERS.map((c) => [c.id, c])), []);

  const filteredSims = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BUILTIN_SIMULATIONS.filter((sim) => {
      const ch = chapterMap.get(sim.chapterId);
      if (filterScope === 'foundation' && !sim.isFoundation) return false;
      if (filterScope === 'Class 11' && ch?.classLevel !== 'Class 11') return false;
      if (filterScope === 'Class 12' && ch?.classLevel !== 'Class 12') return false;
      if (!q) return true;
      return (
        sim.title.en.toLowerCase().includes(q) ||
        sim.title.hi.includes(q) ||
        sim.formulaDisplay.toLowerCase().includes(q) ||
        (ch?.name.en.toLowerCase().includes(q) ?? false)
      );
    });
  }, [filterScope, searchQuery, chapterMap]);

  const activeSim: PhysicsSimulation = useMemo(
    () => BUILTIN_SIMULATIONS.find((s) => s.id === selectedSimId) ?? BUILTIN_SIMULATIONS[0],
    [selectedSimId]
  );

  const activeSpec = useMemo(() => getDerivationSpec(activeSim), [activeSim]);
  const activeSolver = activeSpec.solvers[selectedSolverIdx] ?? activeSpec.solvers[0];

  useEffect(() => {
    if (!activeSolver) return;
    const initVals: Record<string, string> = {};
    const initUnits: Record<string, number> = {};
    for (const inp of activeSolver.inputs) {
      const fromStage = initialSimId === activeSim.id ? initialStageParams?.[inp.key] : undefined;
      initVals[inp.key] = String(
        fromStage !== undefined && Number.isFinite(fromStage) ? fromStage : inp.defaultValue
      );
      initUnits[inp.key] = 0;
    }
    setFormulaInputs(initVals);
    setFormulaUnitIdx(initUnits);
  }, [activeSolver?.id, activeSim.id, initialSimId, initialStageParams]);

  const formulaResult = useMemo(() => {
    if (!activeSolver) return null;
    const siVals: Record<string, number> = {};
    const conversions: string[] = [];

    for (const inp of activeSolver.inputs) {
      const rawStr = formulaInputs[inp.key];
      const rawNum = Number(rawStr);
      if (rawStr === '' || rawStr === undefined || Number.isNaN(rawNum)) {
        return { error: `Enter a valid number for ${inp.symbol}.`, conversions: [] };
      }
      const opts = getInlineUnitOptions(inp.unit);
      const chosen = opts[formulaUnitIdx[inp.key] ?? 0] ?? opts[0];
      const siNum = chosen.toSI(rawNum);
      siVals[inp.key] = siNum;
      if ((formulaUnitIdx[inp.key] ?? 0) !== 0) {
        conversions.push(`${inp.symbol}: ${rawNum} ${chosen.label} → ${formatPhysicsNumber(siNum, 4)} ${inp.unit}`);
      }
    }
    const solved = activeSolver.solve(siVals);
    return { ...solved, conversions };
  }, [activeSolver, formulaInputs, formulaUnitIdx]);

  // --- Mode 2: Custom Algebraic Equation (LHS = RHS) ---
  const [eqText, setEqText] = useState('v^2 = u^2 + 2 * a * s');
  const eqVars = useMemo(() => extractEquationVariables(eqText), [eqText]);
  const [unknownVar, setUnknownVar] = useState('v');
  const [algValues, setAlgValues] = useState<Record<string, string>>({
    v: '20',
    u: '10',
    a: '3',
    s: '50',
  });

  useEffect(() => {
    if (eqVars.length > 0 && !eqVars.includes(unknownVar)) {
      setUnknownVar(eqVars[0]);
    }
    setAlgValues((prev) => {
      const next = { ...prev };
      for (const v of eqVars) {
        if (next[v] === undefined) next[v] = '2';
      }
      return next;
    });
  }, [eqVars, unknownVar]);

  // Handle injected constant from Constants Deck
  useEffect(() => {
    if (!injectedConstant) return;
    setMode('algebraic');
    const firstKnown = eqVars.find((v) => v !== unknownVar);
    if (firstKnown) {
      setAlgValues((prev) => ({ ...prev, [firstKnown]: String(injectedConstant.value) }));
    }
    onClearInjectedConstant?.();
  }, [injectedConstant, eqVars, unknownVar, onClearInjectedConstant]);

  const applyCustomPreset = (presetId: string) => {
    const p = CUSTOM_EQUATION_PRESETS.find((x) => x.id === presetId);
    if (!p) return;
    setEqText(p.equation);
    setUnknownVar(p.defaultUnknown);
    const strMap: Record<string, string> = {};
    Object.entries(p.defaults).forEach(([k, val]) => {
      strMap[k] = String(val);
    });
    setAlgValues(strMap);
  };

  const algResult = useMemo(() => {
    if (!unknownVar || eqVars.length === 0) return null;
    const known: Record<string, number> = {};
    for (const v of eqVars) {
      if (v === unknownVar) continue;
      const num = Number(algValues[v]);
      if (algValues[v] === '' || Number.isNaN(num)) {
        return {
          roots: [],
          lhsExpr: '',
          rhsExpr: '',
          substitutedEquation: '',
          residual: NaN,
          error: `Enter a valid number for known variable "${v}".`,
        };
      }
      known[v] = num;
    }
    return solveCustomEquation(eqText, unknownVar, known);
  }, [eqText, unknownVar, eqVars, algValues]);

  // --- Mode 3: AI Word-Problem Solver ---
  const [wordPrompt, setWordPrompt] = useState(SAMPLE_WORD_PROBLEMS[0].text);
  const [wordLoading, setWordLoading] = useState(false);
  const [wordError, setWordError] = useState<string | null>(null);
  const [wordSolution, setWordSolution] = useState<AIWordProblemSolution | null>(null);

  const handleSolveWordProblem = async () => {
    const trimmed = wordPrompt.trim();
    if (trimmed.length < 5) {
      setWordError(language === 'hi' ? 'कृपया कोई संख्यात्मक प्रश्न लिखें।' : 'Please enter a physics numerical problem.');
      return;
    }
    setWordLoading(true);
    setWordError(null);
    try {
      const res = await fetch('/api/solve-physics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWordError(data?.error || 'Could not solve this problem right now.');
        setWordSolution(null);
      } else {
        setWordSolution(data.solution as AIWordProblemSolution);
      }
    } catch {
      setWordError('Network error while contacting the solver server.');
      setWordSolution(null);
    } finally {
      setWordLoading(false);
    }
  };

  const matchedWordSim = useMemo(() => {
    if (!wordSolution?.relatedSimId) return null;
    return BUILTIN_SIMULATIONS.find((s) => s.id === wordSolution.relatedSimId) ?? null;
  }, [wordSolution]);

  return (
    <div className="space-y-6">
      {/* Solver Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900"
          role="tablist"
        >
          {(
            [
              { id: 'formula', en: '59 NCERT & Basic Formulas', hi: '59 NCERT व बेसिक सूत्र' },
              { id: 'algebraic', en: 'Custom Equation (LHS = RHS)', hi: 'कस्टम समीकरण (LHS = RHS)' },
              { id: 'word', en: 'AI Word-Problem Solver', hi: 'AI शब्द-प्रश्न सॉल्वर' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={mode === tab.id}
              onClick={() => setMode(tab.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                mode === tab.id
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-black dark:text-white hover:bg-white dark:hover:bg-black'
              }`}
            >
              {language === 'hi' ? tab.hi : tab.en}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
          {mode === 'word'
            ? language === 'hi'
              ? 'अंग्रेज़ी या हिंदी में पूरा प्रश्न लिखें'
              : 'Type any English or Hindi numerical problem'
            : language === 'hi'
              ? 'ऑफ़लाइन सटीक गणित इंजन · SI मात्रक रूपांतरण सहित'
              : 'Instant deterministic math engine · Built-in SI unit conversion'}
        </div>
      </div>

      {/* ================= MODE 1: 59 BUILT-IN FORMULAS ================= */}
      {mode === 'formula' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Formula Catalog */}
          <div className="lg:col-span-5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-white pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'सूत्र खोजें (वेग, संवेग, जड़त्व आघूर्ण, ओम)...'
                    : 'Search formula (Speed, Momentum, Inertia, Escape, Lens)...'
                }
                className="w-full pl-9 pr-3 py-2 text-sm font-medium rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'all', label: 'All (59)' },
                  { id: 'foundation', label: 'Basic Foundation (8)' },
                  { id: 'Class 11', label: 'Class 11' },
                  { id: 'Class 12', label: 'Class 12' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterScope(f.id)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md border-2 whitespace-nowrap cursor-pointer ${
                    filterScope === f.id
                      ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                      : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="max-h-[520px] overflow-y-auto space-y-2 pr-1 lab-scroll">
              {filteredSims.map((sim) => {
                const isSel = sim.id === activeSim.id;
                const ch = chapterMap.get(sim.chapterId);
                return (
                  <button
                    key={sim.id}
                    type="button"
                    onClick={() => {
                      setSelectedSimId(sim.id);
                      setSelectedSolverIdx(0);
                    }}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                      isSel
                        ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                        : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black text-black dark:text-white hover:border-black dark:hover:border-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono font-bold opacity-80">
                      <span>
                        Ch {ch?.number ?? '—'} · {sim.isFoundation ? 'Basic Foundation' : ch?.classLevel ?? ''}
                      </span>
                    </div>
                    <div className="font-bold text-sm mt-0.5">
                      {getBilingualPrimary(sim.title, language)}
                    </div>
                    <div className="font-mono text-xs mt-1 truncate opacity-90">
                      {sim.formulaDisplay}
                    </div>
                  </button>
                );
              })}
              {filteredSims.length === 0 && (
                <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400 py-6 text-center">
                  No matching formulas found.
                </p>
              )}
            </div>
          </div>

          {/* Right Active Formula Solver Board */}
          <div className="lg:col-span-7 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b-2 border-black dark:border-white">
              <div>
                <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                  {activeSim.isFoundation ? 'BASIC FOUNDATION FORMULA' : `NCERT CH ${chapterMap.get(activeSim.chapterId)?.number ?? ''}`}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-black dark:text-white mt-0.5">
                  {getBilingualPrimary(activeSim.title, language)}
                </h2>
                {getBilingualSecondary(activeSim.title, language) && (
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    {activeSim.title.hi}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenDerivation(activeSim.id)}
                  className="px-3 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 whitespace-nowrap cursor-pointer"
                >
                  {language === 'hi' ? 'बोर्ड व्युत्पत्ति देखें' : 'View Derivation'}
                </button>
                <button
                  type="button"
                  onClick={() => onLaunchSimulation(activeSim.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 whitespace-nowrap cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'hi' ? 'लाइव सिमुलेशन' : 'Launch Live Lab'}</span>
                </button>
              </div>
            </div>

            {/* Master Symbolic Formula Banner */}
            <div className="p-4 rounded-lg border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-950 font-mono text-lg sm:text-xl font-extrabold text-black dark:text-white overflow-x-auto">
              {activeSim.formulaDisplay}
            </div>

            {activeSolver && (
              <>
                {/* Choose Unknown Variable */}
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
                    {language === 'hi' ? '1. कौन-सा अज्ञात चर निकालना है?' : '1. Choose Unknown Variable to Solve For'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeSpec.solvers.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedSolverIdx(idx)}
                        className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg border-2 transition-colors whitespace-nowrap cursor-pointer ${
                          idx === selectedSolverIdx
                            ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                            : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white'
                        }`}
                      >
                        Find {s.targetSymbol} — {getBilingualPrimary(s.targetLabel, language)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rearranged Symbolic Equation */}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
                    {language === 'hi' ? '2. पुनर्व्यवस्थित सूत्र' : '2. Rearranged Formula'}
                  </div>
                  <div className="px-4 py-3 rounded-lg border-2 border-dashed border-black dark:border-white font-mono text-base sm:text-lg font-extrabold text-black dark:text-white">
                    {activeSolver.rearrangedFormula}
                  </div>
                </div>

                {/* Inputs with Inline Unit Conversion Dropdowns */}
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
                    {language === 'hi' ? '3. ज्ञात मान व मात्रक दर्ज करें' : '3. Enter Known Values (Auto-Converts to SI)'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {activeSolver.inputs.map((inp) => {
                      const unitOpts = getInlineUnitOptions(inp.unit);
                      return (
                        <div key={inp.key} className="space-y-1">
                          <label className="block text-xs font-bold text-black dark:text-white">
                            <span className="font-mono mr-1.5">{inp.symbol}</span>
                            {getBilingualPrimary(inp.label, language)}
                          </label>
                          <div className="flex items-stretch gap-1.5">
                            <input
                              type="number"
                              step="any"
                              value={formulaInputs[inp.key] ?? ''}
                              onChange={(e) =>
                                setFormulaInputs((prev) => ({ ...prev, [inp.key]: e.target.value }))
                              }
                              className="flex-1 min-w-0 px-3 py-2 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-base font-mono font-bold tabular-nums text-black dark:text-white focus:outline-none"
                            />
                            {unitOpts.length > 1 ? (
                              <select
                                value={formulaUnitIdx[inp.key] ?? 0}
                                onChange={(e) =>
                                  setFormulaUnitIdx((prev) => ({
                                    ...prev,
                                    [inp.key]: Number(e.target.value),
                                  }))
                                }
                                aria-label={`Unit for ${inp.symbol}`}
                                className="px-2.5 py-2 rounded-lg border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 text-xs font-mono font-bold text-black dark:text-white cursor-pointer"
                              >
                                {unitOpts.map((u, idx) => (
                                  <option key={u.label} value={idx}>
                                    {u.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="inline-flex items-center px-2.5 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                                {inp.unit || '—'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Board Solution Box */}
                {formulaResult && (
                  <div className="p-5 rounded-xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black space-y-3">
                    {'error' in formulaResult && formulaResult.error ? (
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{formulaResult.error}</span>
                      </div>
                    ) : (
                      <>
                        {formulaResult.conversions && formulaResult.conversions.length > 0 && (
                          <div className="text-xs font-mono opacity-85 border-b border-neutral-600 dark:border-neutral-400 pb-2 space-y-0.5">
                            <div className="font-bold uppercase">SI Unit Conversion Step:</div>
                            {formulaResult.conversions.map((c, idx) => (
                              <div key={idx}>{c}</div>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                          <span className="text-sm font-bold opacity-85">
                            {getBilingualPrimary(activeSolver.targetLabel, language)}
                          </span>
                          <span className="font-mono text-3xl font-extrabold tabular-nums">
                            {'value' in formulaResult && Number.isFinite(formulaResult.value)
                              ? formatPhysicsNumber(formulaResult.value, 4)
                              : '—'}{' '}
                            <span className="text-xl">{activeSolver.unit}</span>
                          </span>
                        </div>
                        {'substituted' in formulaResult && (
                          <div className="font-mono text-xs sm:text-sm opacity-95 pt-1 break-words">
                            Step: {formulaResult.substituted}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= MODE 2: CUSTOM ALGEBRAIC LHS = RHS SOLVER ================= */}
      {mode === 'algebraic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-black dark:text-white">
                {language === 'hi' ? 'त्वरित बेसिक व NCERT समीकरण' : 'Quick Foundation & NCERT Equations'}
              </h3>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-0.5">
                {language === 'hi'
                  ? 'किसी भी समीकरण पर क्लिक करें या दाईं ओर अपना समीकरण लिखें।'
                  : 'Click any preset to load it, or type any custom LHS = RHS equation on the right.'}
              </p>
            </div>
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 lab-scroll">
              {CUSTOM_EQUATION_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyCustomPreset(p.id)}
                  className="w-full text-left p-3 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-neutral-600 dark:text-neutral-400">
                    <span>{p.category}</span>
                    <span>Solve for {p.defaultUnknown}</span>
                  </div>
                  <div className="text-sm font-bold text-black dark:text-white mt-0.5">{p.label}</div>
                  <div className="font-mono text-xs text-neutral-700 dark:text-neutral-300 mt-0.5">
                    {p.equation}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-6 space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
                {language === 'hi' ? 'कोई भी भौतिकी समीकरण लिखें (LHS = RHS)' : 'Type Any Physics Equation (LHS = RHS)'}
              </label>
              <input
                type="text"
                value={eqText}
                onChange={(e) => setEqText(e.target.value)}
                placeholder="e.g. v^2 = u^2 + 2*a*s  or  L = I*w  or  1/f = 1/v - 1/u"
                className="w-full px-4 py-3 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black font-mono text-lg font-extrabold text-black dark:text-white focus:outline-none"
              />
              <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                Built-in constants: <span className="font-bold">pi</span>, <span className="font-bold">g</span> (9.81), <span className="font-bold">G</span>, <span className="font-bold">c</span>, <span className="font-bold">k_e</span>, <span className="font-bold">R_gas</span> · Functions: sqrt, sin, cos, tan, ln, log, exp
              </p>
            </div>

            {eqVars.length > 0 && (
              <>
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
                    {language === 'hi' ? 'अज्ञात चर चुनें (जिसे निकालना है)' : 'Select Unknown Variable to Solve'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {eqVars.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setUnknownVar(v)}
                        className={`px-3.5 py-1.5 font-mono text-sm font-extrabold rounded-lg border-2 cursor-pointer ${
                          unknownVar === v
                            ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                            : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white'
                        }`}
                      >
                        Solve for {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {eqVars
                    .filter((v) => v !== unknownVar)
                    .map((v) => (
                      <label key={v} className="block space-y-1">
                        <span className="block text-xs font-mono font-bold text-black dark:text-white">
                          Known {v}
                        </span>
                        <input
                          type="number"
                          step="any"
                          value={algValues[v] ?? ''}
                          onChange={(e) =>
                            setAlgValues((prev) => ({ ...prev, [v]: e.target.value }))
                          }
                          className="w-full px-3 py-2 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black font-mono text-base font-bold tabular-nums text-black dark:text-white focus:outline-none"
                        />
                      </label>
                    ))}
                </div>

                {/* Quick Constant Insert Pills */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-mono font-bold text-neutral-700 dark:text-neutral-300">
                    Insert constant into {eqVars.find((v) => v !== unknownVar) ?? 'input'}:
                  </span>
                  {PHYSICAL_CONSTANTS.slice(0, 5).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        const firstKnown = eqVars.find((v) => v !== unknownVar);
                        if (firstKnown) {
                          setAlgValues((prev) => ({ ...prev, [firstKnown]: String(c.numericValue) }));
                        }
                      }}
                      className="px-2 py-1 font-mono font-bold rounded border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer"
                    >
                      {c.symbol}
                    </button>
                  ))}
                </div>

                {/* Solved Roots Output */}
                {algResult && (
                  <div className="p-5 rounded-xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black space-y-2.5">
                    {algResult.error ? (
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{algResult.error}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-xs font-mono font-bold uppercase opacity-80">
                            Solved Real Root{algResult.roots.length > 1 ? 's' : ''} for {unknownVar}
                          </span>
                          <span className="font-mono text-3xl font-extrabold tabular-nums">
                            {unknownVar} = {formatPhysicsNumber(algResult.roots[0], 5)}
                          </span>
                        </div>
                        {algResult.roots.length > 1 && (
                          <div className="text-xs font-mono opacity-90">
                            All real roots: {algResult.roots.map((r) => formatPhysicsNumber(r, 4)).join('  ,  ')}
                          </div>
                        )}
                        <div className="text-xs sm:text-sm font-mono opacity-95 border-t border-neutral-600 dark:border-neutral-400 pt-2 break-words">
                          Verification: {algResult.substitutedEquation}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= MODE 3: AI WORD-PROBLEM SOLVER ================= */}
      {mode === 'word' && (
        <div className="space-y-5">
          <div className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 text-sm font-extrabold text-black dark:text-white">
                <Sparkles className="w-4 h-4" />
                <span>
                  {language === 'hi'
                    ? 'कोई भी कक्षा 11–12 का संख्यात्मक प्रश्न लिखें या पेस्ट करें'
                    : 'Paste or Type Any Class 11–12 Physics Numerical Problem'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setWordPrompt('');
                  setWordSolution(null);
                  setWordError(null);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold underline underline-offset-4 text-black dark:text-white cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={wordPrompt}
              onChange={(e) => setWordPrompt(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'उदाहरण: 72 km/h से चलती कार 5 सेकंड में रुक जाती है। मंदन व दूरी ज्ञात कीजिए...'
                  : 'Example: A 2 kg block slides down a 30° frictionless incline of length 10 m. Find its acceleration and speed at the bottom...'
              }
              className="w-full p-3.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-sm sm:text-base font-medium text-black dark:text-white focus:outline-none"
            />

            {/* Quick Sample Problems */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                Quick Examples:
              </span>
              {SAMPLE_WORD_PROBLEMS.map((sp) => (
                <button
                  key={sp.label}
                  type="button"
                  onClick={() => setWordPrompt(sp.text)}
                  className="px-2.5 py-1 text-xs font-bold rounded-md border-2 border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white cursor-pointer"
                >
                  {sp.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={wordLoading}
                onClick={handleSolveWordProblem}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-extrabold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 disabled:opacity-50 cursor-pointer"
              >
                {wordLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'हल तैयार हो रहा है...' : 'Solving Step-by-Step...'}</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4" />
                    <span>{language === 'hi' ? 'बोर्ड हल निकालें' : 'Solve on Chalkboard'}</span>
                  </>
                )}
              </button>
              <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                Extracts Givens → SI Conversion → Formula → Numbered Steps → Dimensional Check
              </span>
            </div>

            {wordError && (
              <div className="p-3.5 rounded-lg border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 flex items-center gap-2 text-sm font-bold text-black dark:text-white">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{wordError}</span>
              </div>
            )}
          </div>

          {/* Structured Board Solution Display */}
          {wordSolution && (
            <div className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-6 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b-2 border-black dark:border-white">
                <div>
                  <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                    {language === 'hi' ? wordSolution.chapterHi : wordSolution.chapterEn}
                  </div>
                  <h3 className="text-xl font-extrabold text-black dark:text-white mt-0.5">
                    {language === 'hi' ? wordSolution.problemSummaryHi : wordSolution.problemSummaryEn}
                  </h3>
                  {language === 'dual' && (
                    <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                      {wordSolution.problemSummaryHi}
                    </p>
                  )}
                </div>
                {matchedWordSim && (
                  <button
                    type="button"
                    onClick={() => onLaunchSimulation(matchedWordSim.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 whitespace-nowrap cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {language === 'hi'
                        ? `लाइव सिमुलेशन: ${matchedWordSim.title.hi}`
                        : `Verify in Lab: ${matchedWordSim.title.en.split('(')[0].trim()}`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Step 1: Extracted Givens & SI Conversions */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-extrabold uppercase text-neutral-700 dark:text-neutral-300">
                  1. {language === 'hi' ? 'दिए गए मान व SI रूपांतरण' : 'Given Quantities & SI Conversions'}
                </h4>
                <div className="overflow-x-auto border-2 border-black dark:border-white rounded-lg">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-black text-white dark:bg-white dark:text-black font-mono">
                      <tr>
                        <th className="px-3 py-2">Symbol</th>
                        <th className="px-3 py-2">Quantity</th>
                        <th className="px-3 py-2">Given</th>
                        <th className="px-3 py-2">SI Value</th>
                        <th className="px-3 py-2">Conversion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-300 dark:divide-neutral-700 font-mono">
                      {wordSolution.givens.map((g, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 font-extrabold">{g.symbol}</td>
                          <td className="px-3 py-2 font-sans font-bold">
                            {language === 'hi' ? g.labelHi : g.labelEn}
                          </td>
                          <td className="px-3 py-2 tabular-nums">{g.rawValue}</td>
                          <td className="px-3 py-2 font-extrabold tabular-nums">{g.siValue}</td>
                          <td className="px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300">
                            {g.conversionNote}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step 2: Formula Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-lg border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-950">
                  <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                    PRIMARY FORMULA
                  </div>
                  <div className="font-mono text-lg font-extrabold text-black dark:text-white mt-1">
                    {wordSolution.formulaUsed}
                  </div>
                </div>
                <div className="p-4 rounded-lg border-2 border-dashed border-black dark:border-white">
                  <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                    REARRANGED FOR UNKNOWN
                  </div>
                  <div className="font-mono text-lg font-extrabold text-black dark:text-white mt-1">
                    {wordSolution.rearrangedFormula}
                  </div>
                </div>
              </div>

              {/* Step 3: Numbered Chalkboard Steps */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-extrabold uppercase text-neutral-700 dark:text-neutral-300">
                  2. {language === 'hi' ? 'क्रमबद्ध गणना चरण' : 'Step-by-Step Board Calculation'}
                </h4>
                <ol className="space-y-3">
                  {wordSolution.steps.map((st, idx) => (
                    <li
                      key={idx}
                      className="p-4 rounded-lg border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-950 space-y-2"
                    >
                      <div className="text-xs font-mono font-extrabold text-black dark:text-white">
                        STEP 0{idx + 1} · {language === 'hi' ? st.stepTitleHi : st.stepTitleEn}
                      </div>
                      <div className="px-3 py-2.5 rounded bg-white dark:bg-black border border-neutral-400 dark:border-neutral-600 font-mono text-base sm:text-lg font-extrabold text-black dark:text-white overflow-x-auto">
                        {st.equation}
                      </div>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        {language === 'hi' ? st.explanationHi : st.explanationEn}
                      </p>
                      {language === 'dual' && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">{st.explanationHi}</p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Final Answer + Dimensional Verification */}
              <div className="p-5 rounded-xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-extrabold uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'hi' ? 'अंतिम उत्तर' : 'Final Answer'}</span>
                  </div>
                  <div className="font-mono text-3xl sm:text-4xl font-extrabold tabular-nums">
                    {wordSolution.finalAnswer} {wordSolution.finalUnit}
                  </div>
                </div>
                <div className="text-xs font-mono opacity-90 pt-2 border-t border-neutral-600 dark:border-neutral-400">
                  Dimensional Check: {wordSolution.dimensionalCheck}
                </div>
                <div className="text-xs sm:text-sm font-medium opacity-95">
                  Tip: {language === 'hi' ? wordSolution.keyTakeawayHi : wordSolution.keyTakeawayEn}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
