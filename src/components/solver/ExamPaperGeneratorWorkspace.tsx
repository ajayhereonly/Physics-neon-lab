import { useMemo, useState } from 'react';
import { CheckSquare, Eye, EyeOff, FileText, Printer, Shuffle, Square } from 'lucide-react';
import { LanguageMode, PracticeQuestion } from '../../types/physics';
import { CHAPTERS } from '../../data/simulations';
import { ALL_PRACTICE_QUESTIONS } from '../../data/questionBank';
import { CURATED_BOARD_DERIVATIONS, CuratedBoardDerivation } from '../../data/curatedDerivations';
import { getBilingualPrimary, getBilingualSecondary } from '../../utils/bilingual';

interface ExamPaperGeneratorWorkspaceProps {
  language: LanguageMode;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = (seed * 9301 + 49297) % 233280;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = s % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

export function ExamPaperGeneratorWorkspace({ language }: ExamPaperGeneratorWorkspaceProps) {
  const [schoolName, setSchoolName] = useState('PhysicaLive Model Higher Secondary School');
  const [examTitle, setExamTitle] = useState('Physics Unit Assessment (NCERT Board Pattern)');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [classScope, setClassScope] = useState<'Class 11' | 'Class 12' | 'Both'>('Class 11');
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>(() =>
    CHAPTERS.filter((c) => c.classLevel === 'Class 11')
      .slice(0, 6)
      .map((c) => c.id)
  );
  const [secACount, setSecACount] = useState(8);
  const [secBCount, setSecBCount] = useState(4);
  const [secCCount, setSecCCount] = useState(3);
  const [seed, setSeed] = useState(1);
  const [showAnswerKey, setShowAnswerKey] = useState(true);

  const visibleChapters = useMemo(
    () =>
      classScope === 'Both'
        ? CHAPTERS
        : CHAPTERS.filter((ch) => ch.classLevel === classScope),
    [classScope]
  );

  const handleScopeChange = (next: 'Class 11' | 'Class 12' | 'Both') => {
    setClassScope(next);
    const matching =
      next === 'Both' ? CHAPTERS : CHAPTERS.filter((c) => c.classLevel === next);
    setSelectedChapterIds(matching.slice(0, 6).map((c) => c.id));
  };

  const toggleChapter = (id: string) => {
    setSelectedChapterIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const selectAllVisible = () => {
    setSelectedChapterIds(visibleChapters.map((c) => c.id));
  };

  const clearSelection = () => {
    setSelectedChapterIds([]);
  };

  const generated = useMemo(() => {
    const chSet = new Set(
      selectedChapterIds.length > 0
        ? selectedChapterIds
        : visibleChapters.map((c) => c.id)
    );

    const matchingQs = ALL_PRACTICE_QUESTIONS.filter((q) => chSet.has(q.chapterId));
    const boardPool = matchingQs.filter((q) => q.difficulty === 'Board' || q.difficulty === 'Concept');
    const numericPool = matchingQs.filter((q) => q.difficulty === 'JEE/NEET' || q.difficulty === 'Concept');

    const shuffledA = seededShuffle(boardPool.length > 0 ? boardPool : matchingQs, seed + 11);
    const secA: PracticeQuestion[] = shuffledA.slice(0, secACount);
    const usedIds = new Set(secA.map((q) => q.id));

    const remainingB = seededShuffle(
      (numericPool.length > 0 ? numericPool : matchingQs).filter((q) => !usedIds.has(q.id)),
      seed + 37
    );
    const secB: PracticeQuestion[] = remainingB.slice(0, secBCount);

    let derivPool: CuratedBoardDerivation[] = CURATED_BOARD_DERIVATIONS.filter((d) =>
      chSet.has(d.chapterId)
    );
    if (derivPool.length < secCCount) {
      const classFallback = CURATED_BOARD_DERIVATIONS.filter((d) =>
        classScope === 'Both' ? true : d.classLevel === classScope
      );
      const seen = new Set(derivPool.map((d) => d.id));
      for (const item of classFallback) {
        if (!seen.has(item.id)) {
          derivPool.push(item);
          seen.add(item.id);
        }
      }
    }
    const secC = seededShuffle(derivPool, seed + 73).slice(0, secCCount);

    const marksA = secA.length * 1;
    const marksB = secB.length * 2;
    const marksC = secC.reduce((acc, d) => acc + (d.marks === '5 Marks' ? 5 : 3), 0);
    const totalMarks = marksA + marksB + marksC;

    return { secA, secB, secC, marksA, marksB, marksC, totalMarks };
  }, [selectedChapterIds, visibleChapters, secACount, secBCount, secCCount, seed, classScope]);

  const chapterMap = useMemo(() => {
    const m = new Map<string, (typeof CHAPTERS)[number]>();
    for (const c of CHAPTERS) m.set(c.id, c);
    return m;
  }, []);

  return (
    <div className="space-y-6">
      {/* Configuration Panel (Hidden during A4 Print) */}
      <section className="no-print rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b-2 border-black dark:border-white">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
              <FileText className="w-4 h-4" />
              <span>
                {language === 'hi'
                  ? 'प्रिंट-तैयार A4 बोर्ड परीक्षा पेपर जनरेटर'
                  : 'Printable A4 Pure B&W Board Exam Paper Generator'}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {language === 'hi'
                ? 'अध्याय चुनें, खंड A/B/C के प्रश्न तय करें, पेपर शफ़ल करें और उत्तर कुंजी सहित शुद्ध ब्लैक-एंड-व्हाइट PDF प्रिंट करें।'
                : 'Pick chapters, configure Sections A/B/C, shuffle variants, and print a clean black-and-white A4 test paper with optional Teacher Answer Key.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSeed((s) => s + 1)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 whitespace-nowrap cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'नया सेट शफ़ल करें' : 'Shuffle Set'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAnswerKey((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white whitespace-nowrap cursor-pointer ${
                showAnswerKey
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-white text-black dark:bg-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              {showAnswerKey ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>
                {showAnswerKey
                  ? language === 'hi'
                    ? 'उत्तर कुंजी शामिल'
                    : 'Answer Key: ON'
                  : language === 'hi'
                    ? 'केवल छात्र पेपर'
                    : 'Student Copy Only'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'A4 PDF प्रिंट करें' : 'Print A4 Paper'}</span>
            </button>
          </div>
        </div>

        {/* Metadata Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block space-y-1">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              {language === 'hi' ? 'विद्यालय / संस्थान का नाम' : 'School / Institute Name'}
            </span>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-2 text-sm font-bold rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:outline-none"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              {language === 'hi' ? 'परीक्षा शीर्षक' : 'Examination Title'}
            </span>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm font-bold rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {language === 'hi' ? 'अवधि (मिनट)' : 'Time (min)'}
              </span>
              <input
                type="number"
                min={15}
                max={240}
                step={15}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Math.max(15, Number(e.target.value) || 60))}
                className="w-full px-3 py-2 text-sm font-mono font-bold tabular-nums rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:outline-none"
              />
            </label>

            <div className="space-y-1">
              <span className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {language === 'hi' ? 'कुल अंक' : 'Max Marks'}
              </span>
              <div className="px-3 py-2 text-sm font-mono font-extrabold tabular-nums rounded-lg border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black text-center">
                {generated.totalMarks}
              </div>
            </div>
          </div>
        </div>

        {/* Section Counts & Class Scope */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-5 space-y-1.5">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              {language === 'hi' ? 'कक्षा चुनें' : 'Syllabus Scope'}
            </span>
            <div className="flex items-center gap-1 p-1 rounded-lg border-2 border-black dark:border-white">
              {(['Class 11', 'Class 12', 'Both'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleScopeChange(lvl)}
                  className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    classScope === lvl
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  {lvl === 'Both' ? (language === 'hi' ? '11 + 12 दोनों' : 'Class 11 + 12') : lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-3 gap-3">
            <label className="block space-y-1">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Sec A (1M MCQ)
              </span>
              <input
                type="number"
                min={0}
                max={20}
                value={secACount}
                onChange={(e) => setSecACount(Math.max(0, Math.min(20, Number(e.target.value) || 0)))}
                className="w-full px-3 py-2 text-sm font-mono font-bold tabular-nums rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Sec B (2M Short)
              </span>
              <input
                type="number"
                min={0}
                max={12}
                value={secBCount}
                onChange={(e) => setSecBCount(Math.max(0, Math.min(12, Number(e.target.value) || 0)))}
                className="w-full px-3 py-2 text-sm font-mono font-bold tabular-nums rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Sec C (3/5M Deriv)
              </span>
              <input
                type="number"
                min={0}
                max={8}
                value={secCCount}
                onChange={(e) => setSecCCount(Math.max(0, Math.min(8, Number(e.target.value) || 0)))}
                className="w-full px-3 py-2 text-sm font-mono font-bold tabular-nums rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
              />
            </label>
          </div>
        </div>

        {/* Multi-Chapter Selector */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
              {language === 'hi'
                ? `अध्याय चयन (${selectedChapterIds.length}/${visibleChapters.length} चयनित)`
                : `Select Chapters (${selectedChapterIds.length}/${visibleChapters.length} selected)`}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAllVisible}
                className="text-xs font-bold underline underline-offset-4 text-black dark:text-white cursor-pointer"
              >
                {language === 'hi' ? 'सभी चुनें' : 'Select All'}
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs font-bold underline underline-offset-4 text-neutral-600 dark:text-neutral-400 cursor-pointer"
              >
                {language === 'hi' ? 'साफ़ करें' : 'Clear'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 lab-scroll">
            {visibleChapters.map((ch) => {
              const selected = selectedChapterIds.includes(ch.id);
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => toggleChapter(ch.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md border-2 transition-colors whitespace-nowrap cursor-pointer ${
                    selected
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white'
                  }`}
                >
                  {selected ? (
                    <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span className="font-mono">{ch.number}</span>
                  <span>{getBilingualPrimary(ch.name, language).split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Printable A4 Question Paper Preview */}
      <article className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-6 sm:p-8 space-y-8">
        {/* Formal Board Exam Paper Header */}
        <header className="text-center pb-5 border-b-2 border-black dark:border-white space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-black dark:text-white">
            {schoolName || 'Physics Examination Paper'}
          </h2>
          <p className="text-sm sm:text-base font-bold text-black dark:text-white">
            {examTitle} · {classScope === 'Both' ? 'Class 11 & 12 Physics' : `${classScope} Physics`} · Set #{seed}
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono font-bold text-black dark:text-white">
            <span>Time Allowed: {durationMinutes} Minutes</span>
            <span>Maximum Marks: {generated.totalMarks}</span>
          </div>
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-left text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 border-t border-neutral-400 dark:border-neutral-700">
            <div>Student Name: ______________________</div>
            <div>Roll No.: ______________</div>
            <div>Date: ______________</div>
          </div>
        </header>

        {/* General Instructions */}
        <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 space-y-1 border-b border-neutral-300 dark:border-neutral-800 pb-4">
          <div className="font-mono font-extrabold uppercase text-black dark:text-white">
            {language === 'hi' ? 'सामान्य निर्देश:' : 'General Instructions:'}
          </div>
          <p>
            1. All questions are compulsory. Use SI units and state formulas clearly before substitution.
          </p>
          <p>
            2. Section A carries 1 mark each ({generated.marksA}M), Section B carries 2 marks each ({generated.marksB}M), and Section C carries 3 or 5 marks each ({generated.marksC}M).
          </p>
        </div>

        {/* SECTION A: MCQs */}
        {generated.secA.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-baseline justify-between border-b-2 border-black dark:border-white pb-1.5">
              <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-black dark:text-white">
                {language === 'hi'
                  ? 'खंड A — बहुविकल्पीय प्रश्न (प्रत्येक 1 अंक)'
                  : 'Section A — Multiple Choice Questions (1 Mark Each)'}
              </h3>
              <span className="font-mono text-xs font-bold text-black dark:text-white">
                [{generated.secA.length} × 1 = {generated.marksA} Marks]
              </span>
            </div>

            <ol className="space-y-4">
              {generated.secA.map((q, idx) => {
                const ch = chapterMap.get(q.chapterId);
                return (
                  <li key={q.id} className="print-card space-y-2 text-sm text-black dark:text-white">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-bold leading-snug">
                        <span className="font-mono mr-2">Q{idx + 1}.</span>
                        {getBilingualPrimary(q.question, language)}
                      </p>
                      <span className="font-mono text-[11px] font-bold text-neutral-600 dark:text-neutral-400 whitespace-nowrap shrink-0">
                        {ch ? `Ch ${ch.number}` : ''} · [1M]
                      </span>
                    </div>
                    {getBilingualSecondary(q.question, language) && (
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 pl-7">
                        {q.question.hi}
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-7 text-xs sm:text-sm font-medium">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx}>
                          <span className="font-mono font-bold mr-1.5">
                            ({OPTION_LETTERS[oIdx]})
                          </span>
                          <span>{getBilingualPrimary(opt, language)}</span>
                        </div>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* SECTION B: Short Conceptual & Numericals */}
        {generated.secB.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-baseline justify-between border-b-2 border-black dark:border-white pb-1.5">
              <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-black dark:text-white">
                {language === 'hi'
                  ? 'खंड B — लघु उत्तरीय व आंकिक प्रश्न (प्रत्येक 2 अंक)'
                  : 'Section B — Short Answer & Numerical Problems (2 Marks Each)'}
              </h3>
              <span className="font-mono text-xs font-bold text-black dark:text-white">
                [{generated.secB.length} × 2 = {generated.marksB} Marks]
              </span>
            </div>

            <ol className="space-y-4">
              {generated.secB.map((q, idx) => {
                const qNum = generated.secA.length + idx + 1;
                const ch = chapterMap.get(q.chapterId);
                return (
                  <li key={q.id} className="print-card space-y-1 text-sm text-black dark:text-white">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-bold leading-snug">
                        <span className="font-mono mr-2">Q{qNum}.</span>
                        {getBilingualPrimary(q.question, language)}{' '}
                        <span className="font-normal text-neutral-700 dark:text-neutral-300">
                          {language === 'hi'
                            ? '(सूत्र व पूर्ण गणना सहित हल लिखें।)'
                            : '(Show formula, substitution, and SI unit clearly.)'}
                        </span>
                      </p>
                      <span className="font-mono text-[11px] font-bold text-neutral-600 dark:text-neutral-400 whitespace-nowrap shrink-0">
                        {ch ? `Ch ${ch.number}` : ''} · [2M]
                      </span>
                    </div>
                    {getBilingualSecondary(q.question, language) && (
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 pl-7">
                        {q.question.hi}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* SECTION C: Board Derivations */}
        {generated.secC.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-baseline justify-between border-b-2 border-black dark:border-white pb-1.5">
              <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-black dark:text-white">
                {language === 'hi'
                  ? 'खंड C — दीर्घ उत्तरीय बोर्ड व्युत्पत्तियाँ (3 / 5 अंक)'
                  : 'Section C — Long Answer Board Derivations (3 / 5 Marks)'}
              </h3>
              <span className="font-mono text-xs font-bold text-black dark:text-white">
                [{generated.marksC} Marks]
              </span>
            </div>

            <ol className="space-y-4">
              {generated.secC.map((d, idx) => {
                const qNum = generated.secA.length + generated.secB.length + idx + 1;
                return (
                  <li key={d.id} className="print-card space-y-1.5 text-sm text-black dark:text-white">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-bold leading-snug">
                        <span className="font-mono mr-2">Q{qNum}.</span>
                        {language === 'hi'
                          ? `स्वच्छ आरेख और मान्यताओं सहित व्युत्पन्न करें: ${d.title.hi}`
                          : `Derive with a neat labeled diagram and clear assumptions: ${d.title.en}`}
                      </p>
                      <span className="font-mono text-[11px] font-bold text-neutral-600 dark:text-neutral-400 whitespace-nowrap shrink-0">
                        Ch {d.chapterNumber} · [{d.marks}]
                      </span>
                    </div>
                    <div className="pl-7 font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      {language === 'hi' ? 'लक्ष्य सूत्र: ' : 'Target Relation: '}
                      {d.finalFormula}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* TEACHER ANSWER KEY & MARKING SCHEME */}
        {showAnswerKey && (
          <section className="pt-6 border-t-4 border-double border-black dark:border-white space-y-5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-extrabold uppercase tracking-wide text-black dark:text-white">
                {language === 'hi'
                  ? 'शिक्षक उत्तर कुंजी और अंक विभाजन (Teacher Answer Key)'
                  : 'Teacher Answer Key & Board Marking Scheme'}
              </h3>
              <span className="font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Set #{seed}
              </span>
            </div>

            {generated.secA.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono font-extrabold uppercase text-black dark:text-white">
                  Section A Answers (1M Each)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono font-bold">
                  {generated.secA.map((q, idx) => (
                    <div
                      key={q.id}
                      className="px-2.5 py-1.5 rounded border border-black dark:border-white text-black dark:text-white"
                    >
                      Q{idx + 1}: ({OPTION_LETTERS[q.correctIndex]})
                    </div>
                  ))}
                </div>
              </div>
            )}

            {generated.secB.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono font-extrabold uppercase text-black dark:text-white">
                  Section B Worked Solutions (2M Each)
                </div>
                <div className="space-y-2 text-xs text-black dark:text-white">
                  {generated.secB.map((q, idx) => {
                    const qNum = generated.secA.length + idx + 1;
                    return (
                      <div
                        key={q.id}
                        className="p-2.5 rounded border border-neutral-400 dark:border-neutral-700"
                      >
                        <span className="font-mono font-extrabold mr-1.5">
                          Q{qNum} ({OPTION_LETTERS[q.correctIndex]}):
                        </span>
                        <span className="font-medium">
                          {getBilingualPrimary(q.solution, language)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {generated.secC.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono font-extrabold uppercase text-black dark:text-white">
                  Section C Derivation Marking Rubric
                </div>
                <div className="space-y-2 text-xs text-black dark:text-white">
                  {generated.secC.map((d, idx) => {
                    const qNum = generated.secA.length + generated.secB.length + idx + 1;
                    return (
                      <div
                        key={d.id}
                        className="p-3 rounded border border-neutral-400 dark:border-neutral-700 space-y-1"
                      >
                        <div className="font-bold">
                          <span className="font-mono mr-1.5">Q{qNum} [{d.marks}]:</span>
                          {getBilingualPrimary(d.title, language)} —{' '}
                          <span className="font-mono">{d.finalFormula}</span>
                        </div>
                        <ul className="list-disc pl-5 space-y-0.5 text-neutral-700 dark:text-neutral-300">
                          {d.markingScheme.map((ms, mIdx) => (
                            <li key={mIdx}>{getBilingualPrimary(ms, language)}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}
      </article>
    </div>
  );
}
