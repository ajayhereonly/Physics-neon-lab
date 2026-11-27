import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Play,
  Printer,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { CHAPTERS } from '../data/simulations';
import { ALL_PRACTICE_QUESTIONS, getQuestionsByChapter } from '../data/questionBank';
import { getAirforcePyqsByChapter } from '../data/airforceXBoosters';
import { LanguageMode, QuestionDifficulty } from '../types/physics';
import { getBilingualPrimary, getBilingualSecondary, UI_TEXT } from '../utils/bilingual';
import { ClassroomQuizRunner } from './ClassroomQuizRunner';
import { AudioControlStrip } from './AudioControlStrip';
import { playExamCue } from '../utils/physicsAudio';

const STORAGE_QUIZ_ANSWERS = 'physicalive_quiz_answers_v1';

interface PracticeBankViewProps {
  initialChapterId: string;
  language: LanguageMode;
  onLaunchChapterSim: (chapterId: string) => void;
  onOpenAirforceHub?: () => void;
}

function loadSavedAnswers(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_QUIZ_ANSWERS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function PracticeBankView({
  initialChapterId,
  language,
  onLaunchChapterSim,
  onOpenAirforceHub,
}: PracticeBankViewProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(() => {
    const exists = CHAPTERS.some((c) => c.id === initialChapterId);
    return exists ? initialChapterId : CHAPTERS[0].id;
  });
  const [practiceMode, setPracticeMode] = useState<'study' | 'quiz'>('study');
  const [printWithKey, setPrintWithKey] = useState<boolean>(false);
  const [classFilter, setClassFilter] = useState<'all' | 'Class 11' | 'Class 12'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | QuestionDifficulty | 'airforce'>('all');
  const [chapterSearch, setChapterSearch] = useState('');
  const [answers, setAnswers] = useState<Record<string, number>>(loadSavedAnswers);
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (CHAPTERS.some((c) => c.id === initialChapterId)) {
      setSelectedChapterId(initialChapterId);
    }
  }, [initialChapterId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_QUIZ_ANSWERS, JSON.stringify(answers));
    } catch {}
  }, [answers]);

  const normalizedSearch = chapterSearch.trim().toLowerCase();

  const visibleChapters = useMemo(() => {
    return CHAPTERS.filter((ch) => {
      if (classFilter !== 'all' && ch.classLevel !== classFilter) return false;
      if (!normalizedSearch) return true;
      return (
        ch.name.en.toLowerCase().includes(normalizedSearch) ||
        ch.name.hi.includes(normalizedSearch) ||
        ch.number.includes(normalizedSearch)
      );
    });
  }, [classFilter, normalizedSearch]);

  const selectedChapter = useMemo(
    () => CHAPTERS.find((c) => c.id === selectedChapterId) ?? CHAPTERS[0],
    [selectedChapterId]
  );

  const chapterQuestions = useMemo(
    () => getQuestionsByChapter(selectedChapter.id),
    [selectedChapter.id]
  );

  const chapterAirforcePyqs = useMemo(
    () => getAirforcePyqsByChapter(selectedChapter.id),
    [selectedChapter.id]
  );

  const filteredQuestions = useMemo(() => {
    if (difficultyFilter === 'airforce') return [];
    if (difficultyFilter === 'all') return chapterQuestions;
    return chapterQuestions.filter((q) => q.difficulty === difficultyFilter);
  }, [chapterQuestions, difficultyFilter]);

  const chapterStats = useMemo(() => {
    let attempted = 0;
    let correct = 0;
    for (const q of chapterQuestions) {
      if (answers[q.id] !== undefined) {
        attempted += 1;
        if (answers[q.id] === q.correctIndex) correct += 1;
      }
    }
    return { attempted, correct, total: chapterQuestions.length };
  }, [chapterQuestions, answers]);

  const overallStats = useMemo(() => {
    let attempted = 0;
    let correct = 0;
    for (const q of ALL_PRACTICE_QUESTIONS) {
      if (answers[q.id] !== undefined) {
        attempted += 1;
        if (answers[q.id] === q.correctIndex) correct += 1;
      }
    }
    return { attempted, correct, total: ALL_PRACTICE_QUESTIONS.length };
  }, [answers]);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setRevealedSolutions((prev) => ({ ...prev, [questionId]: true }));
    const targetQ =
      chapterQuestions.find((q) => q.id === questionId) ??
      chapterAirforcePyqs.find((q) => q.id === questionId);
    if (targetQ) {
      playExamCue(optionIdx === targetQ.correctIndex ? 'correct' : 'wrong');
    }
  };

  const handleResetChapter = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      for (const q of chapterQuestions) {
        delete next[q.id];
      }
      return next;
    });
    setRevealedHints((prev) => {
      const next = { ...prev };
      for (const q of chapterQuestions) delete next[q.id];
      return next;
    });
    setRevealedSolutions((prev) => {
      const next = { ...prev };
      for (const q of chapterQuestions) delete next[q.id];
      return next;
    });
  };

  const getChapterProgress = (chapterId: string) => {
    const qs = getQuestionsByChapter(chapterId);
    let correct = 0;
    let attempted = 0;
    for (const q of qs) {
      if (answers[q.id] !== undefined) {
        attempted += 1;
        if (answers[q.id] === q.correctIndex) correct += 1;
      }
    }
    return { correct, attempted, total: qs.length };
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-6">
      {/* Print-Only Formal Exam Worksheet Header */}
      <div className="print-only pb-4 mb-4 border-b-2 border-black">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-xl font-extrabold text-black">
            PhysicaLive · Chapter {selectedChapter.number}: {getBilingualPrimary(selectedChapter.name, language)}
          </h1>
          <span className="font-mono text-xs font-bold text-black">
            {selectedChapter.classLevel} · {filteredQuestions.length} Questions · {printWithKey ? 'Teacher Answer Key' : 'Student Worksheet'}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-4 text-xs font-mono font-bold text-black">
          <div>Student Name: _____________________</div>
          <div>Roll No: ___________</div>
          <div>Date: ___________</div>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b-2 border-black dark:border-white no-print">
        <div>
          <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
            <span>{CHAPTERS.length} Chapters (Class 11–12)</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span>{overallStats.total} Curated Practice Questions</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span>
              {language === 'hi'
                ? `कुल सही: ${overallStats.correct}/${overallStats.attempted} हल`
                : `Overall Score: ${overallStats.correct}/${overallStats.attempted} attempted`}
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
            {language === 'hi'
              ? 'कक्षा 11–12 भौतिकी अभ्यास प्रश्न बैंक व लाइव क्विज़'
              : 'Class 11–12 Physics Practice Bank & Classroom Quiz'}
          </h1>
          <p className="mt-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {language === 'hi'
              ? 'प्रत्येक अध्याय में 12 बोर्ड, संकल्पना और JEE/NEET स्तर के प्रश्न — तुरंत जांच, कक्षा क्विज़ टाइमर और A4 प्रिंट वर्कशीट सहित।'
              : '12 bilingual Board, Concept, and JEE/NEET questions per chapter with instant check, timed Classroom Quiz mode, and A4 printable B&W worksheets.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <AudioControlStrip language={language} compact />
          {/* Study Bank <-> Classroom Quiz Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-lg border-2 border-black dark:border-white">
            <button
              type="button"
              onClick={() => setPracticeMode('study')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                practiceMode === 'study'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              {getBilingualPrimary(UI_TEXT.studyBank, language)}
            </button>
            <button
              type="button"
              onClick={() => setPracticeMode('quiz')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                practiceMode === 'quiz'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{getBilingualPrimary(UI_TEXT.classroomQuiz, language)}</span>
            </button>
          </div>

          {practiceMode === 'study' && (
            <div className="flex items-center gap-1 p-1 rounded-lg border-2 border-black dark:border-white">
              {(['all', 'Class 11', 'Class 12'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setClassFilter(lvl)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    classFilter === lvl
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  {lvl === 'all'
                    ? language === 'hi'
                      ? `सभी (${CHAPTERS.length})`
                      : `All (${CHAPTERS.length})`
                    : lvl}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {practiceMode === 'quiz' ? (
        <ClassroomQuizRunner
          chapters={CHAPTERS}
          initialChapterId={selectedChapter.id}
          language={language}
        />
      ) : (
      /* Main Split Layout: Chapter Selector Sidebar + 12 Questions List */
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Chapter List */}
        <aside className="lg:col-span-4 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black overflow-hidden no-print">
          <div className="p-3.5 border-b-2 border-black dark:border-white">
            <div className="relative">
              <Search className="w-4 h-4 text-black dark:text-white absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={chapterSearch}
                onChange={(e) => setChapterSearch(e.target.value)}
                placeholder={
                  language === 'hi' ? `अध्याय खोजें (${CHAPTERS.length})...` : `Filter ${CHAPTERS.length} chapters...`
                }
                className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto divide-y divide-neutral-300 dark:divide-neutral-800 lab-scroll">
            {visibleChapters.map((ch) => {
              const isSelected = ch.id === selectedChapter.id;
              const prog = getChapterProgress(ch.id);
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    setSelectedChapterId(ch.id);
                    setDifficultyFilter('all');
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  <div className="min-w-0">
                    <div
                      className={`text-[11px] font-mono font-bold ${
                        isSelected
                          ? 'opacity-80'
                          : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      Ch {ch.number} · {ch.classLevel}
                    </div>
                    <div className="text-sm font-bold leading-snug mt-0.5">
                      {getBilingualPrimary(ch.name, language)}
                    </div>
                    {language === 'dual' && (
                      <div
                        className={`text-xs mt-0.5 truncate ${
                          isSelected
                            ? 'opacity-80'
                            : 'text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {ch.name.hi}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-right font-mono text-xs font-bold tabular-nums pt-0.5">
                    {prog.attempted > 0 ? `${prog.correct}/${prog.total}` : `${prog.total} Qs`}
                  </div>
                </button>
              );
            })}
            {visibleChapters.length === 0 && (
              <div className="p-6 text-center text-xs font-bold text-neutral-600 dark:text-neutral-400">
                {language === 'hi' ? 'कोई अध्याय नहीं मिला।' : 'No matching chapters.'}
              </div>
            )}
          </div>
        </aside>

        {/* Right Active Chapter Question Feed */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Chapter Action Banner */}
          <section className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5 space-y-4 no-print">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                  <span>Chapter {selectedChapter.number}</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>{selectedChapter.classLevel}</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>
                    {language === 'hi'
                      ? `स्कोर: ${chapterStats.correct}/${chapterStats.total} (${chapterStats.attempted} हल)`
                      : `Score: ${chapterStats.correct}/${chapterStats.total} (${chapterStats.attempted} attempted)`}
                  </span>
                </div>
                <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-black dark:text-white">
                  {getBilingualPrimary(selectedChapter.name, language)}
                </h2>
                {getBilingualSecondary(selectedChapter.name, language) && (
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                    {selectedChapter.name.hi}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onLaunchChapterSim(selectedChapter.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 transition-opacity whitespace-nowrap cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {language === 'hi' ? 'अध्याय का लाइव सिमुलेशन खोलें' : 'Launch Live Simulation'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{getBilingualPrimary(UI_TEXT.printWorksheet, language)}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetChapter}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border-2 border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white transition-colors whitespace-nowrap cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
                </button>
              </div>
            </div>

            {/* Print Mode Option Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
              <span>{language === 'hi' ? 'प्रिंट विकल्प:' : 'Print Export Option:'}</span>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-black dark:text-white">
                  <input
                    type="radio"
                    name="print-mode"
                    checked={!printWithKey}
                    onChange={() => setPrintWithKey(false)}
                  />
                  <span>{language === 'hi' ? 'केवल छात्र प्रश्नपत्र' : 'Student Test Paper Only'}</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-black dark:text-white">
                  <input
                    type="radio"
                    name="print-mode"
                    checked={printWithKey}
                    onChange={() => setPrintWithKey(true)}
                  />
                  <span>{language === 'hi' ? 'उत्तर कुंजी व हल सहित' : 'Include Answer Key & Solutions'}</span>
                </label>
              </div>
            </div>

            {/* Difficulty Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-neutral-300 dark:border-neutral-700">
              <div className="flex flex-wrap items-center gap-1.5">
                {(['all', 'Board', 'Concept', 'JEE/NEET', 'airforce'] as const).map((diff) => {
                  const count =
                    diff === 'all'
                      ? chapterQuestions.length
                      : diff === 'airforce'
                        ? chapterAirforcePyqs.length
                        : chapterQuestions.filter((q) => q.difficulty === diff).length;
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficultyFilter(diff)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 transition-colors whitespace-nowrap cursor-pointer ${
                        difficultyFilter === diff
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white'
                      }`}
                    >
                      {diff === 'all'
                        ? language === 'hi'
                          ? `सभी प्रश्न (${count})`
                          : `All (${count})`
                        : diff === 'airforce'
                          ? `${getBilingualPrimary(UI_TEXT.airforcePyqs, language)} (${count})`
                          : `${diff} (${count})`}
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-mono font-bold tabular-nums text-neutral-700 dark:text-neutral-300">
                {chapterStats.attempted === chapterStats.total && chapterStats.total > 0
                  ? language === 'hi'
                    ? `अध्याय पूर्ण · ${Math.round((chapterStats.correct / chapterStats.total) * 100)}%`
                    : `Completed · ${Math.round((chapterStats.correct / chapterStats.total) * 100)}% accuracy`
                  : `${chapterStats.total - chapterStats.attempted} ${
                      language === 'hi' ? 'शेष' : 'remaining'
                    }`}
              </div>
            </div>
          </section>

          {/* Questions List (Standard Bank OR Chapter Airforce X PYQs) */}
          <div className="space-y-4">
            {difficultyFilter === 'airforce' && (
              <>
                <div className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-4 flex flex-wrap items-center justify-between gap-3 no-print">
                  <div className="text-xs font-mono font-bold">
                    {language === 'hi'
                      ? `अध्याय ${selectedChapter.number} के ${chapterAirforcePyqs.length} एयरफोर्स X PYQs (20-सेकंड शॉर्टकट सहित)`
                      : `Chapter ${selectedChapter.number} · ${chapterAirforcePyqs.length} Year-Tagged Airforce X PYQs with 20-Sec Shortcuts`}
                  </div>
                  {onOpenAirforceHub && (
                    <button
                      type="button"
                      onClick={onOpenAirforceHub}
                      className="px-3.5 py-1.5 text-xs font-extrabold rounded-lg border-2 border-black bg-black text-white dark:border-white dark:bg-white dark:text-black whitespace-nowrap cursor-pointer"
                    >
                      {language === 'hi' ? '25-Q CBT मॉक हब खोलें →' : 'Open 25-Q CBT Mock Hub →'}
                    </button>
                  )}
                </div>

                {chapterAirforcePyqs.map((pyq, idx) => {
                  const selectedOption = answers[pyq.id];
                  const isAnswered = selectedOption !== undefined;
                  const isCorrect = isAnswered && selectedOption === pyq.correctIndex;
                  const isSolutionShown = !!revealedSolutions[pyq.id];
                  const qSecondary = getBilingualSecondary(pyq.question, language);

                  return (
                    <article
                      key={pyq.id}
                      className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5 space-y-4 print-card"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                        <div>
                          <span>PYQ {String(idx + 1).padStart(2, '0')}</span>
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          <span>{pyq.yearTag}</span>
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          <span>{pyq.questionType}</span>
                        </div>
                        {isAnswered && (
                          <div className="inline-flex items-center gap-1.5 text-black dark:text-white">
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{language === 'hi' ? 'सही (+1)' : 'CORRECT (+1)'}</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                <span>
                                  {language === 'hi'
                                    ? `गलत (−0.25) · सही ${OPTION_LETTERS[pyq.correctIndex]}`
                                    : `WRONG (−0.25) · Correct: ${OPTION_LETTERS[pyq.correctIndex]}`}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-black dark:text-white leading-snug">
                          {getBilingualPrimary(pyq.question, language)}
                        </h3>
                        {qSecondary && (
                          <p className="mt-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            {qSecondary}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {pyq.options.map((opt, optIdx) => {
                          const isThisSelected = selectedOption === optIdx;
                          const isThisCorrect = optIdx === pyq.correctIndex;
                          const optSecondary = getBilingualSecondary(opt, language);
                          let btnStyle =
                            'border-neutral-400 dark:border-neutral-600 bg-white dark:bg-black text-black dark:text-white hover:border-black dark:hover:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900';
                          if (isAnswered) {
                            if (isThisSelected && isThisCorrect) {
                              btnStyle = 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black';
                            } else if (isThisSelected && !isThisCorrect) {
                              btnStyle = 'border-dashed border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white';
                            } else if (isThisCorrect) {
                              btnStyle = 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white ring-2 ring-black dark:ring-white';
                            } else {
                              btnStyle = 'border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black text-neutral-500';
                            }
                          }
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectOption(pyq.id, optIdx)}
                              className={`text-left p-3.5 rounded-lg border-2 transition-colors flex items-start justify-between gap-2.5 cursor-pointer ${btnStyle}`}
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                <span className="font-mono text-xs font-extrabold shrink-0 pt-0.5">
                                  {OPTION_LETTERS[optIdx]}.
                                </span>
                                <div className="min-w-0">
                                  <div className="text-sm font-bold leading-snug">
                                    {getBilingualPrimary(opt, language)}
                                  </div>
                                  {optSecondary && (
                                    <div className="text-xs opacity-80 mt-0.5 leading-snug">{optSecondary}</div>
                                  )}
                                </div>
                              </div>
                              {isAnswered && isThisCorrect && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
                              {isAnswered && isThisSelected && !isThisCorrect && <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1 no-print">
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedSolutions((prev) => ({ ...prev, [pyq.id]: !prev[pyq.id] }))
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>
                            {isSolutionShown
                              ? language === 'hi'
                                ? '20-सेकंड शॉर्टकट छुपाएँ'
                                : 'Hide 20-Sec Shortcut'
                              : language === 'hi'
                                ? '20-सेकंड शॉर्टकट व हल देखें'
                                : 'Show 20-Sec Shortcut & Solution'}
                          </span>
                        </button>
                      </div>

                      {isSolutionShown && (
                        <div className="p-3.5 rounded-lg border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 text-sm text-black dark:text-white space-y-1.5 leading-relaxed no-print">
                          <div className="font-mono text-xs font-extrabold">
                            20-SECOND SHORTCUT · Answer: Option {OPTION_LETTERS[pyq.correctIndex]}
                          </div>
                          <p className="font-bold">{getBilingualPrimary(pyq.shortcut20s, language)}</p>
                          <p className="text-xs pt-1 border-t border-black/20 dark:border-white/20">
                            {getBilingualPrimary(pyq.solution, language)}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </>
            )}

            {filteredQuestions.map((q) => {
              const globalIndex = chapterQuestions.findIndex((item) => item.id === q.id);
              const selectedOption = answers[q.id];
              const isAnswered = selectedOption !== undefined;
              const isCorrect = isAnswered && selectedOption === q.correctIndex;
              const isHintShown = !!revealedHints[q.id];
              const isSolutionShown = !!revealedSolutions[q.id];
              const qSecondary = getBilingualSecondary(q.question, language);
              const hSecondary = getBilingualSecondary(q.hint, language);
              const sSecondary = getBilingualSecondary(q.solution, language);

              return (
                <article
                  key={q.id}
                  className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5 space-y-4 print-card"
                >
                  {/* Question Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                    <div>
                      <span>Q{String(globalIndex + 1).padStart(2, '0')}</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span>{q.difficulty}</span>
                    </div>

                    {isAnswered && (
                      <div className="inline-flex items-center gap-1.5 text-black dark:text-white">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{language === 'hi' ? 'सही उत्तर' : 'CORRECT'}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>
                              {language === 'hi'
                                ? `गलत · सही विकल्प ${OPTION_LETTERS[q.correctIndex]}`
                                : `INCORRECT · Correct: ${OPTION_LETTERS[q.correctIndex]}`}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Question Stem */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-black dark:text-white leading-snug">
                      {getBilingualPrimary(q.question, language)}
                    </h3>
                    {qSecondary && (
                      <p className="mt-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {qSecondary}
                      </p>
                    )}
                  </div>

                  {/* 4 MCQ Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, idx) => {
                      const isThisSelected = selectedOption === idx;
                      const isThisCorrect = idx === q.correctIndex;
                      const optSecondary = getBilingualSecondary(opt, language);

                      let btnStyle =
                        'border-neutral-400 dark:border-neutral-600 bg-white dark:bg-black text-black dark:text-white hover:border-black dark:hover:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900';

                      if (isAnswered) {
                        if (isThisSelected && isThisCorrect) {
                          btnStyle =
                            'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black';
                        } else if (isThisSelected && !isThisCorrect) {
                          btnStyle =
                            'border-dashed border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white';
                        } else if (isThisCorrect) {
                          btnStyle =
                            'border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white ring-2 ring-black dark:ring-white';
                        } else {
                          btnStyle =
                            'border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black text-neutral-500 dark:text-neutral-500';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, idx)}
                          className={`text-left p-3.5 rounded-lg border-2 transition-colors flex items-start justify-between gap-2.5 cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="font-mono text-xs font-extrabold shrink-0 pt-0.5">
                              {OPTION_LETTERS[idx]}.
                            </span>
                            <div className="min-w-0">
                              <div className="text-sm font-bold leading-snug">
                                {getBilingualPrimary(opt, language)}
                              </div>
                              {optSecondary && (
                                <div className="text-xs opacity-80 mt-0.5 leading-snug">
                                  {optSecondary}
                                </div>
                              )}
                            </div>
                          </div>

                          {isAnswered && isThisCorrect && (
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                          )}
                          {isAnswered && isThisSelected && !isThisCorrect && (
                            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Hint & Solution Controls */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 no-print">
                    <button
                      type="button"
                      onClick={() =>
                        setRevealedHints((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>
                        {isHintShown
                          ? getBilingualPrimary(UI_TEXT.hideHint, language)
                          : getBilingualPrimary(UI_TEXT.showHint, language)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setRevealedSolutions((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>
                        {isSolutionShown
                          ? language === 'hi'
                            ? 'हल छुपाएँ'
                            : 'Hide Solution'
                          : getBilingualPrimary(UI_TEXT.showSolution, language)}
                      </span>
                    </button>
                  </div>

                  {isHintShown && (
                    <div className="p-3.5 rounded-lg border-2 border-dashed border-black dark:border-white text-sm text-black dark:text-white leading-relaxed no-print">
                      <div className="font-mono text-xs font-bold mb-1">
                        {language === 'hi' ? 'संकेत (HINT):' : 'HINT:'}
                      </div>
                      <p className="font-medium">{getBilingualPrimary(q.hint, language)}</p>
                      {hSecondary && (
                        <p className="mt-1 text-neutral-700 dark:text-neutral-300">{hSecondary}</p>
                      )}
                    </div>
                  )}

                  {isSolutionShown && (
                    <div className="p-3.5 rounded-lg border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 text-sm text-black dark:text-white leading-relaxed no-print">
                      <div className="font-mono text-xs font-bold mb-1">
                        {language === 'hi'
                          ? `विस्तृत हल · सही उत्तर: विकल्प ${OPTION_LETTERS[q.correctIndex]}`
                          : `STEP-BY-STEP SOLUTION · Answer: Option ${OPTION_LETTERS[q.correctIndex]}`}
                      </div>
                      <p className="font-semibold">{getBilingualPrimary(q.solution, language)}</p>
                      {sSecondary && (
                        <p className="mt-1.5 text-neutral-800 dark:text-neutral-200">{sSecondary}</p>
                      )}
                    </div>
                  )}

                  {printWithKey && (
                    <div className="print-only pt-2 border-t border-black text-xs text-black">
                      <strong>Answer: {OPTION_LETTERS[q.correctIndex]}</strong> —{' '}
                      {getBilingualPrimary(q.solution, language)}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
