import { useState } from 'react';
import { Lightbulb, Play, RotateCcw } from 'lucide-react';
import {
  LanguageMode,
  LiveSimTelemetry,
  PhysicsSimulation,
  ThemeMode,
  WhatIfPrompt,
} from '../types/physics';
import { getBilingualPrimary, getBilingualSecondary, UI_TEXT } from '../utils/bilingual';

interface ControlConceptDeckProps {
  simulation: PhysicsSimulation;
  params: Record<string, number>;
  telemetry: LiveSimTelemetry | null;
  language: LanguageMode;
  theme: ThemeMode;
  activeProofId: string | null;
  onParamChange: (key: string, value: number) => void;
  onApplyParams: (nextParams: Record<string, number>) => void;
  onResetDefaults: () => void;
  onRunProof: (prompt: WhatIfPrompt) => void;
}

export function ControlConceptDeck({
  simulation,
  params,
  telemetry,
  language,
  theme,
  activeProofId,
  onParamChange,
  onApplyParams,
  onResetDefaults,
  onRunProof,
}: ControlConceptDeckProps) {
  const [deckTab, setDeckTab] = useState<'whatif' | 'concept'>('whatif');
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const toggleHint = (id: string) => {
    setRevealedHints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRunProof = (prompt: WhatIfPrompt) => {
    setRevealedAnswers((prev) => ({ ...prev, [prompt.id]: true }));
    onRunProof(prompt);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Parameter Sliders Card */}
      <section className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5">
        <div className="flex items-center justify-between gap-2 pb-4 border-b-2 border-black dark:border-white">
          <div>
            <h2 className="text-base font-bold text-black dark:text-white">
              {getBilingualPrimary(UI_TEXT.parameters, language)}
            </h2>
            {language === 'dual' && (
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-0.5">
                {UI_TEXT.parameters.hi}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{getBilingualPrimary(UI_TEXT.reset, language)}</span>
          </button>
        </div>

        {/* Presets */}
        {simulation.presets && simulation.presets.length > 0 && (
          <div className="pt-4 pb-1">
            <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">
              {getBilingualPrimary(UI_TEXT.presets, language)}
            </div>
            <div className="flex flex-wrap gap-2">
              {simulation.presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onApplyParams(preset.params)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black hover:bg-black hover:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap cursor-pointer"
                >
                  {getBilingualPrimary(preset.label, language)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Extra-Bold Sliders */}
        <div className="mt-5 space-y-5">
          {simulation.variables.map((v) => {
            const currentVal = params[v.key] ?? v.defaultValue;
            const pct = v.max === v.min ? 50 : ((currentVal - v.min) / (v.max - v.min)) * 100;
            const secondaryLabel = getBilingualSecondary(v.label, language);
            const fillHex = theme === 'dark' ? '#FFFFFF' : '#000000';
            const emptyHex = theme === 'dark' ? '#262626' : '#E5E5E5';

            return (
              <div key={v.key} className="space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <label
                    htmlFor={`slider-${v.key}`}
                    className="text-sm font-bold text-black dark:text-white"
                  >
                    <span className="font-mono font-bold mr-2 underline underline-offset-2">
                      {v.symbol}
                    </span>
                    <span>{getBilingualPrimary(v.label, language)}</span>
                    {secondaryLabel && (
                      <span className="text-neutral-700 dark:text-neutral-300 ml-1.5 text-xs font-medium">
                        ({secondaryLabel})
                      </span>
                    )}
                  </label>
                  <span className="font-mono text-sm font-bold tabular-nums px-2 py-0.5 rounded bg-black text-white dark:bg-white dark:text-black whitespace-nowrap shrink-0">
                    {currentVal}
                    {v.unit ? ` ${v.unit}` : ''}
                  </span>
                </div>
                <input
                  id={`slider-${v.key}`}
                  type="range"
                  min={v.min}
                  max={v.max}
                  step={v.step}
                  value={currentVal}
                  onChange={(e) => onParamChange(v.key, Number(e.target.value))}
                  className="physics-slider"
                  style={{
                    background: `linear-gradient(to right, ${fillHex} ${pct}%, ${emptyHex} ${pct}%)`,
                  }}
                />
                <div className="flex justify-between text-xs font-mono font-semibold tabular-nums text-neutral-700 dark:text-neutral-300">
                  <span>
                    {v.min} {v.unit}
                  </span>
                  <span>
                    {v.max} {v.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Extra-Bold Live Calculated Values */}
      {telemetry && telemetry.readouts.length > 0 && (
        <section className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5">
          <h3 className="text-sm font-bold text-black dark:text-white mb-3">
            {getBilingualPrimary(UI_TEXT.liveOutputs, language)}
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {telemetry.readouts.map((r, idx) => (
              <div
                key={`${r.symbol}-${idx}`}
                className="pt-2.5 border-t-2 border-neutral-300 dark:border-neutral-700"
              >
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate">
                  <span className="font-mono font-bold text-black dark:text-white mr-1.5">
                    {r.symbol}
                  </span>
                  {getBilingualPrimary(r.label, language)}
                </div>
                <div className="mt-1 font-mono text-xl font-bold tabular-nums text-black dark:text-white">
                  {r.value}
                  {r.unit && (
                    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 ml-1">
                      {r.unit}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Teaching Deck: What-If Prompts & Concept Guide */}
      <section className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black overflow-hidden">
        <div className="flex items-center gap-1.5 p-2 border-b-2 border-black dark:border-white">
          <button
            type="button"
            onClick={() => setDeckTab('whatif')}
            className={`flex-1 px-3 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              deckTab === 'whatif'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            {getBilingualPrimary(UI_TEXT.whatIfTitle, language)}
          </button>
          <button
            type="button"
            onClick={() => setDeckTab('concept')}
            className={`flex-1 px-3 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              deckTab === 'concept'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            {getBilingualPrimary(UI_TEXT.conceptGuide, language)}
          </button>
        </div>

        <div className="p-5">
          {deckTab === 'whatif' ? (
            <div className="space-y-5">
              {simulation.whatIfPrompts.map((prompt, idx) => {
                const isHintShown = !!revealedHints[prompt.id];
                const isAnswerShown = !!revealedAnswers[prompt.id] || activeProofId === prompt.id;
                const qSecondary = getBilingualSecondary(prompt.question, language);
                const hSecondary = getBilingualSecondary(prompt.hint, language);
                const aSecondary = getBilingualSecondary(prompt.answer, language);

                return (
                  <div
                    key={prompt.id}
                    className={
                      idx > 0
                        ? 'pt-5 border-t-2 border-neutral-300 dark:border-neutral-700'
                        : ''
                    }
                  >
                    <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Challenge 0{idx + 1}
                    </div>
                    <p className="text-base font-bold text-black dark:text-white leading-snug">
                      {getBilingualPrimary(prompt.question, language)}
                    </p>
                    {qSecondary && (
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed mt-1.5">
                        {qSecondary}
                      </p>
                    )}

                    <div className="mt-3.5 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRunProof(prompt)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 transition-opacity whitespace-nowrap cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{getBilingualPrimary(UI_TEXT.runProof, language)}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleHint(prompt.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>
                          {isHintShown
                            ? getBilingualPrimary(UI_TEXT.hideHint, language)
                            : getBilingualPrimary(UI_TEXT.showHint, language)}
                        </span>
                      </button>
                    </div>

                    {isHintShown && (
                      <div className="mt-3 p-3.5 rounded-lg border-2 border-dashed border-black dark:border-white text-sm text-black dark:text-white leading-relaxed">
                        <div className="font-mono text-xs font-bold mb-1">
                          {language === 'hi' ? 'संकेत (HINT):' : 'HINT:'}
                        </div>
                        <p className="font-medium">{getBilingualPrimary(prompt.hint, language)}</p>
                        {hSecondary && <p className="mt-1 text-neutral-700 dark:text-neutral-300">{hSecondary}</p>}
                      </div>
                    )}

                    {isAnswerShown && (
                      <div className="mt-3 p-3.5 rounded-lg border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 text-sm text-black dark:text-white leading-relaxed">
                        <div className="font-mono text-xs font-bold mb-1">
                          {language === 'hi' ? 'लाइव प्रमाण निष्कर्ष:' : 'LIVE PROOF OBSERVATION:'}
                        </div>
                        <p className="font-semibold">{getBilingualPrimary(prompt.answer, language)}</p>
                        {aSecondary && <p className="mt-1.5 text-neutral-800 dark:text-neutral-200">{aSecondary}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {language === 'hi' ? 'मुख्य सिद्धांत' : 'Core Intuition'}
                </h4>
                <p className="text-sm font-medium text-black dark:text-white leading-relaxed">
                  {getBilingualPrimary(simulation.explanation, language)}
                </p>
                {getBilingualSecondary(simulation.explanation, language) && (
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mt-2">
                    {simulation.explanation.hi}
                  </p>
                )}
              </div>

              {simulation.secondaryFormulas && simulation.secondaryFormulas.length > 0 && (
                <div className="pt-4 border-t-2 border-neutral-300 dark:border-neutral-700 space-y-2.5">
                  <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    {language === 'hi' ? 'संबंधित सूत्र' : 'Related Equations'}
                  </h4>
                  {simulation.secondaryFormulas.map((sf, i) => (
                    <div key={i} className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                        {getBilingualPrimary(sf.label, language)}
                      </span>
                      <span className="font-mono font-bold text-black dark:text-white whitespace-nowrap">
                        {sf.formula}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t-2 border-neutral-300 dark:border-neutral-700">
                <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {getBilingualPrimary(UI_TEXT.realLifeExample, language)}
                </h4>
                <p className="text-sm font-medium text-black dark:text-white leading-relaxed">
                  {getBilingualPrimary(simulation.realLife, language)}
                </p>
                {getBilingualSecondary(simulation.realLife, language) && (
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mt-1.5">
                    {simulation.realLife.hi}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
