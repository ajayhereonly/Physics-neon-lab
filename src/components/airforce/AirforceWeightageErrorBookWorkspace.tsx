import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react';
import { AirforceMockRecord, AutoFixBannerData, LanguageMode } from '../../types/physics';
import {
  AIRFORCE_X_WEIGHTAGE,
  getAirforcePyqById,
  getAirforcePyqsByChapter,
} from '../../data/airforceXBoosters';
import { BUILTIN_SIMULATIONS, CHAPTERS } from '../../data/simulations';
import { formatBilingual, getBilingualPrimary, UI_TEXT } from '../../utils/bilingual';

interface AirforceWeightageErrorBookWorkspaceProps {
  language: LanguageMode;
  errorBookIds: string[];
  mockHistory: AirforceMockRecord[];
  onRemoveError: (pyqId: string) => void;
  onClearErrorBook: () => void;
  onClearMockHistory: () => void;
  onOpenChapterPyqs: (chapterId: string) => void;
  onLaunchSimulation: (simId: string) => void;
  onAutoFixConcept?: (data: AutoFixBannerData) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const chapterById = new Map(CHAPTERS.map((c) => [c.id, c]));

export const AirforceWeightageErrorBookWorkspace: React.FC<
  AirforceWeightageErrorBookWorkspaceProps
> = ({
  language,
  errorBookIds,
  mockHistory,
  onRemoveError,
  onClearErrorBook,
  onClearMockHistory,
  onOpenChapterPyqs,
  onLaunchSimulation,
  onAutoFixConcept,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [retryPicked, setRetryPicked] = useState<Record<string, number>>({});

  const errorPyqs = useMemo(
    () => errorBookIds.map((id) => getAirforcePyqById(id)).filter((q): q is NonNullable<typeof q> => !!q),
    [errorBookIds]
  );

  const errorCountByChapter = useMemo(() => {
    const map = new Map<string, number>();
    errorPyqs.forEach((q) => map.set(q.chapterId, (map.get(q.chapterId) ?? 0) + 1));
    return map;
  }, [errorPyqs]);

  const firstSimByChapter = useMemo(() => {
    const map = new Map<string, string>();
    BUILTIN_SIMULATIONS.forEach((s) => {
      if (!map.has(s.chapterId)) map.set(s.chapterId, s.id);
    });
    return map;
  }, []);

  const stats = useMemo(() => {
    const bestScore =
      mockHistory.length > 0 ? Math.max(...mockHistory.map((m) => m.netScore)) : null;
    const avgAccuracy =
      mockHistory.length > 0
        ? Math.round(mockHistory.reduce((acc, m) => acc + m.accuracyPct, 0) / mockHistory.length)
        : null;
    const passedCount = mockHistory.filter((m) => m.passedCutoff).length;
    return { bestScore, avgAccuracy, passedCount };
  }, [mockHistory]);

  const filteredWeightage = useMemo(() => {
    return AIRFORCE_X_WEIGHTAGE.filter(
      (w) => priorityFilter === 'All' || w.priority === priorityFilter
    );
  }, [priorityFilter]);

  return (
    <div className="space-y-6">
      {/* Top 3 Monochrome Telemetry Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="border-2 border-black dark:border-white p-4 bg-white dark:bg-black">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-black/60 dark:text-white/60">
            {language === 'hi' ? 'कमज़ोर-टॉपिक त्रुटि पुस्तिका' : 'Weak-Topic Error Book'}
          </div>
          <div className="text-2xl font-mono font-extrabold tabular-nums mt-1">
            {errorPyqs.length}{' '}
            <span className="text-xs font-normal text-black/65 dark:text-white/65">
              {language === 'hi' ? 'प्रश्न लंबित' : 'PYQs pending'}
            </span>
          </div>
        </div>

        <div className="border-2 border-black dark:border-white p-4 bg-white dark:bg-black">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-black/60 dark:text-white/60">
            {language === 'hi' ? 'सर्वश्रेष्ठ CBT स्कोर' : 'Best 25-Q CBT Score'}
          </div>
          <div className="text-2xl font-mono font-extrabold tabular-nums mt-1">
            {stats.bestScore !== null ? `${stats.bestScore.toFixed(2)} / 25` : '— / 25'}
          </div>
        </div>

        <div className="border-2 border-black dark:border-white p-4 bg-white dark:bg-black">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-black/60 dark:text-white/60">
            {language === 'hi' ? 'औसत सटीकता / कट-ऑफ उत्तीर्ण' : 'Avg Accuracy · Cutoff Passes'}
          </div>
          <div className="text-2xl font-mono font-extrabold tabular-nums mt-1">
            {stats.avgAccuracy !== null ? `${stats.avgAccuracy}%` : '—'}{' '}
            <span className="text-xs font-normal text-black/65 dark:text-white/65">
              · {stats.passedCount}/{mockHistory.length} passed
            </span>
          </div>
        </div>
      </div>

      {/* SECTION A: WEAK-TOPIC ERROR BOOK (RE-PRACTICE QUEUE) */}
      <div className="border-2 border-black dark:border-white p-5 bg-white dark:bg-black space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/15 dark:border-white/15">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold">
              {language === 'hi'
                ? 'कमज़ोर-टॉपिक त्रुटि पुस्तिका (पुनः अभ्यास कतार)'
                : 'Weak-Topic Error Book (Interactive Re-Practice Queue)'}
            </h2>
            <p className="text-xs text-black/70 dark:text-white/70 mt-0.5">
              {language === 'hi'
                ? 'CBT मॉक या टॉपिक PYQs में गलत हुए प्रश्न यहाँ सहेजे जाते हैं। सही हल करके "मास्टर चिह्नित करें" दबाएँ।'
                : 'Every missed CBT Mock or Topic PYQ lands here automatically. Retry inline and click Mark Mastered once confident.'}
            </p>
          </div>
          {errorPyqs.length > 0 && (
            <button
              type="button"
              onClick={onClearErrorBook}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 border-black/40 dark:border-white/40 hover:border-black dark:hover:border-white whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {language === 'hi' ? 'सूची साफ़ करें' : 'Clear All'}
            </button>
          )}
        </div>

        {errorPyqs.length === 0 ? (
          <div className="py-6 text-center text-xs sm:text-sm text-black/70 dark:text-white/70">
            {language === 'hi'
              ? 'अभी त्रुटि पुस्तिका खाली है! कोई भी CBT मॉक टेस्ट दें या PYQ हल करें — गलत उत्तर स्वतः यहाँ दिखेंगे।'
              : 'Your Error Book is clean! Attempt a 25-Q CBT Mock or practice Topic PYQs — missed questions will appear here for targeted revision.'}
          </div>
        ) : (
          <div className="space-y-3.5">
            {errorPyqs.map((pyq) => {
              const ch = chapterById.get(pyq.chapterId);
              const picked = retryPicked[pyq.id];
              const isRevealed = picked !== undefined;
              return (
                <div
                  key={pyq.id}
                  className="border-2 border-black/80 dark:border-white/80 p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                    <span className="font-bold">
                      {pyq.yearTag} · {ch ? `Ch ${ch.number} ${ch.name.en}` : pyq.chapterId} ·{' '}
                      {pyq.questionType}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveError(pyq.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 border-2 border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-extrabold whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {language === 'hi' ? 'मास्टर चिह्नित करें' : 'Mark Mastered'}
                    </button>
                  </div>

                  <div className="text-sm font-bold">{formatBilingual(pyq.question, language)}</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pyq.options.map((opt, oIdx) => {
                      const isAns = oIdx === pyq.correctIndex;
                      const isUser = oIdx === picked;
                      let cls = 'border-black/35 dark:border-white/35';
                      if (isRevealed && isAns) {
                        cls =
                          'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-bold';
                      } else if (isRevealed && isUser && !isAns) {
                        cls = 'border-dashed border-black dark:border-white';
                      }
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setRetryPicked((p) => ({ ...p, [pyq.id]: oIdx }))}
                          className={`text-left p-2.5 border-2 text-xs flex items-start gap-2 ${cls}`}
                        >
                          <span className="font-mono font-extrabold">{OPTION_LETTERS[oIdx]}.</span>
                          <span className="flex-1">{formatBilingual(opt, language)}</span>
                          {isRevealed && isAns && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                          {isRevealed && isUser && !isAns && <XCircle className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {isRevealed && (
                    <div className="border border-black/25 dark:border-white/25 p-3 text-xs space-y-1">
                      <div className="font-mono font-extrabold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {language === 'hi' ? '20-सेकंड शॉर्टकट:' : '20-Sec Shortcut:'}
                      </div>
                      <div className="font-semibold">{formatBilingual(pyq.shortcut20s, language)}</div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    {onAutoFixConcept && (
                      <button
                        type="button"
                        onClick={() =>
                          onAutoFixConcept({
                            simId: pyq.simId,
                            questionSnippet: getBilingualPrimary(pyq.question, language),
                            explanationEn: `${pyq.shortcut20s.en} ${pyq.solution.en}`,
                            explanationHi: `${pyq.shortcut20s.hi} ${pyq.solution.hi}`,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold border-2 border-black bg-black text-white dark:border-white dark:bg-white dark:text-black hover:opacity-85 transition-opacity whitespace-nowrap cursor-pointer"
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>{getBilingualPrimary(UI_TEXT.fixConceptLive, language)}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onLaunchSimulation(pyq.simId)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold underline underline-offset-4"
                    >
                      {language === 'hi' ? 'लाइव सिमुलेशन में अभ्यास करें' : 'Practice in Live Lab'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION B: RECENT CBT MOCK HISTORY */}
      {mockHistory.length > 0 && (
        <div className="border-2 border-black dark:border-white p-5 bg-white dark:bg-black space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold uppercase tracking-wider">
              {language === 'hi' ? 'पिछले CBT मॉक टेस्ट रिकॉर्ड' : 'Recent CBT Mock History'}
            </h3>
            <button
              type="button"
              onClick={onClearMockHistory}
              className="text-xs font-bold underline underline-offset-4"
            >
              {language === 'hi' ? 'इतिहास मिटाएँ' : 'Clear History'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b-2 border-black dark:border-white">
                  <th className="py-2 pr-3">Mock Set</th>
                  <th className="py-2 px-3">Mode</th>
                  <th className="py-2 px-3">Net Score</th>
                  <th className="py-2 px-3">✓ / ✕ / Skip</th>
                  <th className="py-2 px-3">Accuracy</th>
                  <th className="py-2 pl-3">Cutoff (≥10)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/15 dark:divide-white/15 tabular-nums">
                {mockHistory.map((m) => (
                  <tr key={m.id}>
                    <td className="py-2 pr-3 font-sans font-bold">{m.setLabel}</td>
                    <td className="py-2 px-3">{m.negativeMarking ? '+1/−0.25' : '+1/0'}</td>
                    <td className="py-2 px-3 font-extrabold">
                      {m.netScore.toFixed(2)} / {m.maxScore}
                    </td>
                    <td className="py-2 px-3">
                      {m.correct} / {m.wrong} / {m.skipped}
                    </td>
                    <td className="py-2 px-3">{m.accuracyPct}%</td>
                    <td className="py-2 pl-3 font-extrabold">
                      {m.passedCutoff ? '✓ PASS' : '✕ BELOW'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION C: 30-CHAPTER IAF WEIGHTAGE RADAR */}
      <div className="border-2 border-black dark:border-white p-5 bg-white dark:bg-black space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold">
              {language === 'hi'
                ? '30-अध्याय IAF एयरफोर्स X वेटेज रडार'
                : '30-Chapter IAF Airforce X Weightage Radar'}
            </h2>
            <p className="text-xs text-black/70 dark:text-white/70 mt-0.5">
              {language === 'hi'
                ? 'अधिकतम स्कोर के लिए High-Priority अध्यायों (लगभग 18–20 प्रश्न) को पहले पक्का करें।'
                : 'Prioritize High-Priority chapters (carrying ~18–20 of the 25 exam questions) to clear sectional cutoff fast.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {(['All', 'High', 'Medium', 'Low'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1 text-xs font-bold border-2 whitespace-nowrap ${
                  priorityFilter === p
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                    : 'border-black/35 dark:border-white/35'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredWeightage.map((w) => {
            const ch = chapterById.get(w.chapterId);
            const pyqCount = getAirforcePyqsByChapter(w.chapterId).length;
            const errCount = errorCountByChapter.get(w.chapterId) ?? 0;
            const simId = firstSimByChapter.get(w.chapterId);

            return (
              <div
                key={w.chapterId}
                className="border-2 border-black/80 dark:border-white/80 p-3.5 flex flex-col justify-between gap-2.5"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                    <span className="font-bold">
                      Ch {ch?.number ?? '—'} · {ch?.classLevel ?? ''} · {w.expectedQuestions}
                    </span>
                    <span className="font-extrabold uppercase">
                      {w.priority === 'High'
                        ? '■■■ HIGH'
                        : w.priority === 'Medium'
                          ? '■■□ MED'
                          : '■□□ LOW'}
                    </span>
                  </div>
                  <div className="text-sm font-extrabold">
                    {ch ? formatBilingual(ch.name, language) : w.chapterId}
                  </div>
                  <div className="text-xs text-black/75 dark:text-white/75 leading-snug">
                    {formatBilingual(w.keyExamFocus, language)}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/15 dark:border-white/15 text-xs">
                  <span className="font-mono text-[11px]">
                    {pyqCount} PYQs{errCount > 0 ? ` · ${errCount} in Error Book` : ''}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenChapterPyqs(w.chapterId)}
                      className="px-2.5 py-1 text-[11px] font-bold border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap"
                    >
                      {language === 'hi' ? 'PYQs हल करें' : 'Practice PYQs'}
                    </button>
                    {simId && (
                      <button
                        type="button"
                        onClick={() => onLaunchSimulation(simId)}
                        className="px-2.5 py-1 text-[11px] font-bold border border-black/40 dark:border-white/40 hover:border-black dark:hover:border-white whitespace-nowrap"
                      >
                        {language === 'hi' ? 'लैब' : 'Open Lab'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
