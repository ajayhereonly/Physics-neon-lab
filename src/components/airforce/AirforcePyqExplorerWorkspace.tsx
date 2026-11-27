import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Box,
  CheckCircle2,
  Eye,
  EyeOff,
  Search,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { AirforcePYQType, AutoFixBannerData, LanguageMode } from '../../types/physics';
import { CHAPTERS } from '../../data/simulations';
import { AIRFORCE_X_PYQS } from '../../data/airforceXBoosters';
import { formatBilingual, getBilingualPrimary, UI_TEXT } from '../../utils/bilingual';
import { playExamCue } from '../../utils/physicsAudio';

interface AirforcePyqExplorerWorkspaceProps {
  language: LanguageMode;
  initialChapterId?: string;
  errorBookIds: string[];
  onToggleErrorBook: (pyqId: string) => void;
  onAddErrors: (pyqIds: string[]) => void;
  onLaunchSimulation: (simId: string) => void;
  onAutoFixConcept?: (data: AutoFixBannerData) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const chapterById = new Map(CHAPTERS.map((c) => [c.id, c]));

export const AirforcePyqExplorerWorkspace: React.FC<AirforcePyqExplorerWorkspaceProps> = ({
  language,
  initialChapterId = 'all',
  errorBookIds,
  onToggleErrorBook,
  onAddErrors,
  onLaunchSimulation,
  onAutoFixConcept,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<string>(initialChapterId);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | AirforcePYQType>('all');
  const [query, setQuery] = useState<string>('');
  const [pickedMap, setPickedMap] = useState<Record<string, number>>({});
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});

  const errorSet = useMemo(() => new Set(errorBookIds), [errorBookIds]);

  const yearTags = useMemo(() => {
    const set = new Set<string>();
    AIRFORCE_X_PYQS.forEach((q) => set.add(q.yearTag));
    return Array.from(set).sort().reverse();
  }, []);

  const countsByChapter = useMemo(() => {
    const map = new Map<string, number>();
    AIRFORCE_X_PYQS.forEach((q) => map.set(q.chapterId, (map.get(q.chapterId) ?? 0) + 1));
    return map;
  }, []);

  const filteredPyqs = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return AIRFORCE_X_PYQS.filter((q) => {
      if (selectedChapter !== 'all' && q.chapterId !== selectedChapter) return false;
      if (selectedYear !== 'all' && q.yearTag !== selectedYear) return false;
      if (selectedType !== 'all' && q.questionType !== selectedType) return false;
      if (!needle) return true;
      const hay = `${q.question.en} ${q.question.hi} ${q.shortcut20s.en} ${q.yearTag} ${q.chapterId}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [query, selectedChapter, selectedType, selectedYear]);

  const handlePickOption = (pyqId: string, optIdx: number, correctIndex: number) => {
    setPickedMap((prev) => ({ ...prev, [pyqId]: optIdx }));
    setRevealedMap((prev) => ({ ...prev, [pyqId]: true }));
    playExamCue(optIdx === correctIndex ? 'correct' : 'wrong');
    if (optIdx !== correctIndex) {
      onAddErrors([pyqId]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Filter Controls Bar */}
      <div className="border-2 border-black dark:border-white p-4 bg-white dark:bg-black space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Chapter Selector */}
          <div className="md:col-span-4">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">
              {language === 'hi' ? 'अध्याय (सभी 30 अध्याय)' : 'Chapter (All 30 Chapters)'}
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full h-10 px-3 text-xs font-bold border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
            >
              <option value="all">
                {language === 'hi'
                  ? `सभी 30 अध्याय (${AIRFORCE_X_PYQS.length} PYQs)`
                  : `All 30 Chapters (${AIRFORCE_X_PYQS.length} PYQs)`}
              </option>
              {CHAPTERS.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Ch {ch.number} · {ch.name.en} ({countsByChapter.get(ch.id) ?? 0})
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">
              {language === 'hi' ? 'परीक्षा वर्ष' : 'Exam Year'}
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full h-10 px-2.5 text-xs font-bold border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
            >
              <option value="all">{language === 'hi' ? 'सभी वर्ष' : 'All Years'}</option>
              {yearTags.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Question Type Filter */}
          <div className="md:col-span-3">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">
              {language === 'hi' ? 'प्रश्न प्रकार' : 'Question Pattern'}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'all' | AirforcePYQType)}
              className="w-full h-10 px-2.5 text-xs font-bold border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
            >
              <option value="all">{language === 'hi' ? 'सभी प्रकार' : 'All Patterns'}</option>
              <option value="Direct Formula">Direct Formula</option>
              <option value="Concept Trap">Concept Trap</option>
              <option value="Ratio Trick">Ratio Trick</option>
            </select>
          </div>

          {/* Search */}
          <div className="md:col-span-3">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">
              {language === 'hi' ? 'कीवर्ड खोजें' : 'Search Keyword'}
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. Zener, Doppler, g...' : 'e.g. Zener, Doppler, AM...'}
                className="w-full h-10 pl-8 pr-3 text-xs font-medium border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/15 dark:border-white/15 text-xs font-mono">
          <span>
            Showing <strong>{filteredPyqs.length}</strong> / {AIRFORCE_X_PYQS.length} Airforce X PYQs
          </span>
          <span className="text-black/65 dark:text-white/65">
            {language === 'hi'
              ? 'गलत प्रयास स्वतः त्रुटि पुस्तिका में जुड़ जाते हैं'
              : 'Wrong attempts auto-save to Weak-Topic Error Book'}
          </span>
        </div>
      </div>

      {/* PYQ List */}
      {filteredPyqs.length === 0 ? (
        <div className="border-2 border-dashed border-black/40 dark:border-white/40 p-10 text-center text-sm font-semibold">
          {language === 'hi'
            ? 'इस फ़िल्टर से कोई PYQ नहीं मिला। कृपया फ़िल्टर बदलें।'
            : 'No PYQs match the selected filter. Try broadening your search.'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPyqs.map((pyq, idx) => {
            const ch = chapterById.get(pyq.chapterId);
            const picked = pickedMap[pyq.id];
            const isRevealed = !!revealedMap[pyq.id];
            const isCorrect = picked === pyq.correctIndex;
            const inErrorBook = errorSet.has(pyq.id);

            return (
              <div
                key={pyq.id}
                className="border-2 border-black dark:border-white p-4 sm:p-5 bg-white dark:bg-black space-y-3.5"
              >
                {/* Unboxed metadata header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-black/15 dark:border-white/15">
                  <div className="text-[11px] font-mono font-bold text-black/75 dark:text-white/75">
                    #{String(idx + 1).padStart(2, '0')} · {pyq.yearTag} ·{' '}
                    {ch ? `Ch ${ch.number} ${ch.name.en}` : pyq.chapterId} · {pyq.questionType}
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleErrorBook(pyq.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap ${
                      inErrorBook
                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                        : 'border-black/40 dark:border-white/40 hover:border-black dark:hover:border-white'
                    }`}
                  >
                    {inErrorBook ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    {inErrorBook
                      ? language === 'hi'
                        ? 'त्रुटि पुस्तिका में'
                        : 'In Error Book'
                      : language === 'hi'
                        ? 'त्रुटि पुस्तिका में सहेजें'
                        : 'Bookmark Error'}
                  </button>
                </div>

                {/* Question prompt */}
                <div className="text-sm sm:text-base font-bold leading-snug">
                  {formatBilingual(pyq.question, language)}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {pyq.options.map((opt, oIdx) => {
                    const isPicked = picked === oIdx;
                    const isAnswer = oIdx === pyq.correctIndex;
                    let cls =
                      'border-black/35 hover:border-black dark:border-white/35 dark:hover:border-white bg-white dark:bg-black';
                    if (isRevealed && isAnswer) {
                      cls =
                        'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-bold';
                    } else if (isRevealed && isPicked && !isAnswer) {
                      cls = 'border-dashed border-black dark:border-white font-semibold';
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handlePickOption(pyq.id, oIdx, pyq.correctIndex)}
                        className={`text-left p-3 border-2 transition-colors flex items-start gap-2.5 text-xs sm:text-sm ${cls}`}
                      >
                        <span className="font-mono font-extrabold shrink-0">{OPTION_LETTERS[oIdx]}.</span>
                        <span className="flex-1">{formatBilingual(opt, language)}</span>
                        {isRevealed && isAnswer && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
                        {isRevealed && isPicked && !isAnswer && <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback + Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setRevealedMap((prev) => ({ ...prev, [pyq.id]: !prev[pyq.id] }))}
                      className="inline-flex items-center gap-1.5 text-xs font-bold underline underline-offset-4 whitespace-nowrap"
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {isRevealed
                        ? language === 'hi'
                          ? '20-सेकंड शॉर्टकट छिपाएँ'
                          : 'Hide 20-Sec Shortcut'
                        : language === 'hi'
                          ? '20-सेकंड शॉर्टकट व उत्तर देखें'
                          : 'Show 20-Sec Shortcut & Answer'}
                    </button>

                    {picked !== undefined && (
                      <span className="text-xs font-mono font-extrabold">
                        {isCorrect ? '✓ +1.00' : '✕ −0.25 (Logged to Error Book)'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {picked !== undefined && !isCorrect && onAutoFixConcept && (
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap"
                    >
                      {language === 'hi' ? 'लाइव सिमुलेशन खोलें' : 'Launch Live Lab'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded 20-Second Shortcut & Full Solution */}
                {isRevealed && (
                  <div className="border border-black/30 dark:border-white/30 p-3.5 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-mono font-extrabold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      {language === 'hi' ? '20-सेकंड शॉर्टकट ट्रिक' : '20-Second Shortcut Trick'}
                    </div>
                    <div className="font-semibold leading-relaxed">
                      {formatBilingual(pyq.shortcut20s, language)}
                    </div>
                    <div className="pt-1.5 border-t border-black/15 dark:border-white/15 text-black/80 dark:text-white/80 leading-relaxed">
                      <strong className="font-mono uppercase mr-1">
                        {language === 'hi' ? 'व्याख्या:' : 'Concept:'}
                      </strong>
                      {formatBilingual(pyq.solution, language)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
