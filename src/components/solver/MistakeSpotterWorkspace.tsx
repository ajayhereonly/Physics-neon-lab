import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Eye, EyeOff, Play, RotateCcw } from 'lucide-react';
import { LanguageMode } from '../../types/physics';
import { PHYSICS_MISCONCEPTIONS, PhysicsMisconception } from '../../data/misconceptionsData';
import { getBilingualPrimary, getBilingualSecondary } from '../../utils/bilingual';

interface MistakeSpotterWorkspaceProps {
  language: LanguageMode;
  onLaunchSimulation: (simId: string) => void;
}

const CATEGORIES: Array<'All' | PhysicsMisconception['category']> = [
  'All',
  'Motion & Forces',
  'Energy & Rotation',
  'Thermal & Waves',
  'Electricity & Optics',
];

export function MistakeSpotterWorkspace({
  language,
  onLaunchSimulation,
}: MistakeSpotterWorkspaceProps) {
  const [category, setCategory] = useState<'All' | PhysicsMisconception['category']>('All');
  const [challengeMode, setChallengeMode] = useState(true);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [spottedIds, setSpottedIds] = useState<Record<string, boolean>>({});

  const filtered = useMemo(
    () =>
      category === 'All'
        ? PHYSICS_MISCONCEPTIONS
        : PHYSICS_MISCONCEPTIONS.filter((m) => m.category === category),
    [category]
  );

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSpotted = (id: string) => {
    setSpottedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const revealedCount = Object.values(revealedIds).filter(Boolean).length;
  const spottedCount = Object.values(spottedIds).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top Filter & Classroom Challenge Bar */}
      <div className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
            {language === 'hi'
              ? `कक्षा भ्रांति पहचान डेक · ${PHYSICS_MISCONCEPTIONS.length} प्रमुख त्रुटियाँ`
              : `Classroom Mistake Spotter · ${PHYSICS_MISCONCEPTIONS.length} Classic Traps`}
          </div>
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {language === 'hi'
              ? 'पहले छात्र का गलत कथन दिखाएँ, कक्षा से गलती पूछें, फिर सही नियम प्रकट कर लाइव सिमुलेशन में सिद्ध करें।'
              : 'Project the flawed student claim first, ask the class to spot the physics trap, then reveal the law and prove it live.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="font-mono text-xs font-extrabold tabular-nums text-black dark:text-white px-2.5 py-1.5 border-2 border-neutral-400 dark:border-neutral-600 rounded-lg">
            {language === 'hi'
              ? `पकड़ी गई त्रुटियाँ: ${spottedCount}/${PHYSICS_MISCONCEPTIONS.length}`
              : `Spotted: ${spottedCount}/${PHYSICS_MISCONCEPTIONS.length}`}
          </div>

          <button
            type="button"
            onClick={() => setChallengeMode((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white transition-colors whitespace-nowrap cursor-pointer ${
              challengeMode
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-white text-black dark:bg-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            {challengeMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>
              {challengeMode
                ? language === 'hi'
                  ? 'चुनौती मोड (उत्तर छुपे)'
                  : 'Challenge Mode (Hidden)'
                : language === 'hi'
                  ? 'सभी उत्तर दिखें'
                  : 'Show All Explanations'}
            </span>
          </button>

          {(revealedCount > 0 || spottedCount > 0) && (
            <button
              type="button"
              onClick={() => {
                setRevealedIds({});
                setSpottedIds({});
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Strip */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border-2 transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border-neutral-400 dark:border-neutral-600 bg-white dark:bg-black text-black dark:text-white hover:border-black dark:hover:border-white'
              }`}
            >
              {cat === 'All'
                ? language === 'hi'
                  ? `सभी (${PHYSICS_MISCONCEPTIONS.length})`
                  : `All (${PHYSICS_MISCONCEPTIONS.length})`
                : cat}
            </button>
          );
        })}
      </div>

      {/* Misconception Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((item, idx) => {
          const isRevealed = !challengeMode || !!revealedIds[item.id];
          const isSpotted = !!spottedIds[item.id];
          const wrongSec = getBilingualSecondary(item.wrongStatement, language);
          const whySec = getBilingualSecondary(item.whyWrong, language);
          const lawSec = getBilingualSecondary(item.correctLaw, language);

          return (
            <article
              key={item.id}
              className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                      TRAP #{String(idx + 1).padStart(2, '0')} · {item.category}
                    </div>
                    <h3 className="mt-1 text-lg font-extrabold text-black dark:text-white leading-snug">
                      {getBilingualPrimary(item.title, language)}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSpotted(item.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSpotted
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                        : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {isSpotted
                        ? language === 'hi'
                          ? 'चर्चा पूर्ण'
                          : 'Covered'
                        : language === 'hi'
                          ? 'चिह्नित करें'
                          : 'Mark Done'}
                    </span>
                  </button>
                </div>

                {/* Flawed Student Claim Box */}
                <div className="p-4 rounded-lg border-2 border-dashed border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold uppercase text-black dark:text-white">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>
                      {language === 'hi'
                        ? 'गलत छात्र कथन — त्रुटि पहचानें:'
                        : 'FLAWED CLAIM — SPOT THE MISTAKE:'}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-black dark:text-white leading-snug">
                    {getBilingualPrimary(item.wrongStatement, language)}
                  </p>
                  {wrongSec && (
                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {wrongSec}
                    </p>
                  )}
                </div>

                {/* Revealed Truth Section */}
                {isRevealed ? (
                  <div className="space-y-3 pt-1">
                    <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                      {language === 'hi' ? 'मुख्य भ्रम: ' : 'THE TRAP: '}
                      <span className="text-black dark:text-white">
                        {getBilingualPrimary(item.studentTrap, language)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-mono font-extrabold uppercase text-black dark:text-white">
                        {language === 'hi' ? 'यह गलत क्यों है' : 'WHY IT FAILS'}
                      </div>
                      <p className="text-sm font-medium text-black dark:text-white leading-relaxed">
                        {getBilingualPrimary(item.whyWrong, language)}
                      </p>
                      {whySec && (
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                          {whySec}
                        </p>
                      )}
                    </div>

                    <div className="p-3.5 rounded-lg border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black space-y-1">
                      <div className="text-[11px] font-mono font-extrabold uppercase opacity-80">
                        {language === 'hi' ? 'सही भौतिकी नियम' : 'CORRECT PHYSICS LAW'}
                      </div>
                      <p className="font-mono text-xs sm:text-sm font-extrabold leading-relaxed">
                        {getBilingualPrimary(item.correctLaw, language)}
                      </p>
                      {lawSec && (
                        <p className="text-xs opacity-90 leading-relaxed">{lawSec}</p>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 border-t border-neutral-300 dark:border-neutral-700 pt-2.5">
                      <span className="font-mono font-extrabold text-black dark:text-white mr-1.5">
                        {language === 'hi' ? 'त्वरित जाँच:' : 'QUICK CHECK:'}
                      </span>
                      {getBilingualPrimary(item.quickCheck, language)}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleReveal(item.id)}
                    className="w-full py-2.5 px-4 rounded-lg border-2 border-black dark:border-white text-xs font-extrabold text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>
                      {language === 'hi'
                        ? 'सही भौतिकी नियम और व्याख्या दिखाएँ'
                        : 'Reveal Correct Physics Law & Explanation'}
                    </span>
                  </button>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t-2 border-neutral-300 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                {challengeMode && isRevealed ? (
                  <button
                    type="button"
                    onClick={() => toggleReveal(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white cursor-pointer"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'उत्तर छुपाएँ' : 'Hide Answer'}</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400">
                    {language === 'hi' ? 'लाइव प्रयोग से सत्यापित करें' : 'Verify interactively on stage'}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => onLaunchSimulation(item.simId)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 transition-opacity whitespace-nowrap cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {language === 'hi' ? 'सिमुलेशन में सिद्ध करें' : 'Prove Live in Simulation'}
                  </span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
