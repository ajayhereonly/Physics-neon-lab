import { useEffect, useMemo, useState } from 'react';
import { Calculator, ChevronRight, Eye, RefreshCw, RotateCcw } from 'lucide-react';
import { LanguageMode, PhysicsSimulation } from '../types/physics';
import { getDerivationSpec } from '../data/derivationsRegistry';
import { getBilingualPrimary, getBilingualSecondary } from '../utils/bilingual';

interface DeriveSolvePanelProps {
  simulation: PhysicsSimulation;
  stageParams: Record<string, number>;
  language: LanguageMode;
}

export function DeriveSolvePanel({
  simulation,
  stageParams,
  language,
}: DeriveSolvePanelProps) {
  const spec = useMemo(() => getDerivationSpec(simulation), [simulation]);
  const [revealedCount, setRevealedCount] = useState(1);
  const [selectedSolverIdx, setSelectedSolverIdx] = useState(0);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setRevealedCount(1);
    setSelectedSolverIdx(0);
  }, [simulation.id]);

  const activeSolver = spec.solvers[selectedSolverIdx] ?? spec.solvers[0];

  useEffect(() => {
    if (!activeSolver) return;
    const init: Record<string, string> = {};
    for (const inp of activeSolver.inputs) {
      const fromStage = stageParams[inp.key];
      init[inp.key] = String(
        fromStage !== undefined && Number.isFinite(fromStage) ? fromStage : inp.defaultValue
      );
    }
    setInputValues(init);
  }, [activeSolver?.id, simulation.id]);

  const handleSyncFromStage = () => {
    if (!activeSolver) return;
    const synced: Record<string, string> = {};
    for (const inp of activeSolver.inputs) {
      const fromStage = stageParams[inp.key];
      synced[inp.key] = String(
        fromStage !== undefined && Number.isFinite(fromStage) ? fromStage : inp.defaultValue
      );
    }
    setInputValues(synced);
  };

  const solverResult = useMemo(() => {
    if (!activeSolver) return null;
    const parsed: Record<string, number> = {};
    for (const inp of activeSolver.inputs) {
      const raw = inputValues[inp.key];
      const n = Number(raw);
      if (raw === '' || raw === undefined || Number.isNaN(n)) {
        return { error: language === 'hi' ? `कृपया ${inp.symbol} का मान्य मान दर्ज करें।` : `Enter a valid number for ${inp.symbol}.` };
      }
      parsed[inp.key] = n;
    }
    return activeSolver.solve(parsed);
  }, [activeSolver, inputValues, language]);

  const totalSteps = spec.steps.length;
  const visibleSteps = spec.steps.slice(0, revealedCount);

  return (
    <div className="space-y-6">
      {/* PART A: Step-by-Step Board Derivation */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
            {language === 'hi'
              ? `क्रमबद्ध व्युत्पत्ति (${revealedCount}/${totalSteps})`
              : `Step-by-Step Derivation (${revealedCount}/${totalSteps})`}
          </div>
          <div className="flex items-center gap-1.5">
            {revealedCount < totalSteps && (
              <>
                <button
                  type="button"
                  onClick={() => setRevealedCount((c) => Math.min(totalSteps, c + 1))}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 whitespace-nowrap cursor-pointer"
                >
                  <span>{language === 'hi' ? 'अगला चरण' : 'Next Step'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRevealedCount(totalSteps)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 whitespace-nowrap cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'सभी' : 'All'}</span>
                </button>
              </>
            )}
            {revealedCount > 1 && (
              <button
                type="button"
                onClick={() => setRevealedCount(1)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg border-2 border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white whitespace-nowrap cursor-pointer"
                title={language === 'hi' ? 'पुनः प्रारंभ' : 'Reset steps'}
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <ol className="space-y-3">
          {visibleSteps.map((step, idx) => {
            const secNote = getBilingualSecondary(step.note, language);
            return (
              <li
                key={idx}
                className="p-3.5 rounded-lg border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-950 space-y-1.5"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-mono font-extrabold text-black dark:text-white">
                    STEP 0{idx + 1} · {getBilingualPrimary(step.title, language)}
                  </span>
                </div>
                <div className="font-mono text-sm sm:text-base font-extrabold text-black dark:text-white bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 rounded px-2.5 py-2 overflow-x-auto">
                  {step.equation}
                </div>
                <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  {getBilingualPrimary(step.note, language)}
                </p>
                {secNote && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {secNote}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* PART B: Interactive Variable Formula Solver */}
      {activeSolver && (
        <div className="pt-5 border-t-2 border-black dark:border-white space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wide text-black dark:text-white">
              <Calculator className="w-3.5 h-3.5" />
              <span>
                {language === 'hi' ? 'सूत्र कैलकुलेटर (चर हल करें)' : 'Solve For Any Variable'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSyncFromStage}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{language === 'hi' ? 'मंच से मान लें' : 'Sync from Stage'}</span>
            </button>
          </div>

          {/* Target Variable Picker */}
          {spec.solvers.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {spec.solvers.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSolverIdx(idx)}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 transition-colors whitespace-nowrap cursor-pointer ${
                    idx === selectedSolverIdx
                      ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                      : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white'
                  }`}
                >
                  {language === 'hi' ? `निकालें: ${s.targetSymbol}` : `Find ${s.targetSymbol}`}
                </button>
              ))}
            </div>
          )}

          {/* Rearranged Formula Display */}
          <div className="px-3 py-2 rounded-lg border-2 border-dashed border-black dark:border-white font-mono text-sm font-extrabold text-black dark:text-white overflow-x-auto">
            {activeSolver.rearrangedFormula}
          </div>

          {/* Numeric Inputs Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {activeSolver.inputs.map((inp) => (
              <label key={inp.key} className="block space-y-1">
                <span className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 truncate">
                  <span className="font-mono text-black dark:text-white mr-1">{inp.symbol}</span>
                  {getBilingualPrimary(inp.label, language)}
                  {inp.unit ? ` (${inp.unit})` : ''}
                </span>
                <input
                  type="number"
                  step="any"
                  value={inputValues[inp.key] ?? ''}
                  onChange={(e) =>
                    setInputValues((prev) => ({ ...prev, [inp.key]: e.target.value }))
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-sm font-mono font-bold tabular-nums text-black dark:text-white focus:outline-none"
                />
              </label>
            ))}
          </div>

          {/* Live Solved Result */}
          {solverResult && (
            <div className="p-3.5 rounded-lg border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black">
              {'error' in solverResult ? (
                <p className="text-xs font-bold">{solverResult.error}</p>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-bold opacity-80">
                      {getBilingualPrimary(activeSolver.targetLabel, language)}
                    </span>
                    <span className="font-mono text-xl font-extrabold tabular-nums">
                      {Number.isFinite(solverResult.value)
                        ? Math.abs(solverResult.value) >= 100
                          ? solverResult.value.toFixed(1)
                          : solverResult.value.toFixed(3).replace(/\.?0+$/, '')
                        : '—'}
                      {activeSolver.unit ? ` ${activeSolver.unit}` : ''}
                    </span>
                  </div>
                  <div className="font-mono text-xs opacity-90 break-words">
                    {solverResult.substituted}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
