import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Box,
  CheckCircle2,
  Clock,
  Flag,
  Play,
  RotateCcw,
  Shuffle,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  AirforceMockRecord,
  AirforcePYQ,
  AutoFixBannerData,
  LanguageMode,
} from '../../types/physics';
import { CHAPTERS } from '../../data/simulations';
import { AIRFORCE_MOCK_SETS, generateBalancedAirforceMock } from '../../data/airforceXBoosters';
import { formatBilingual, getBilingualPrimary, UI_TEXT } from '../../utils/bilingual';
import { playExamCue } from '../../utils/physicsAudio';

interface AirforceCbtMockWorkspaceProps {
  language: LanguageMode;
  onAddErrors: (pyqIds: string[]) => void;
  onSaveMockRecord: (record: AirforceMockRecord) => void;
  onLaunchSimulation: (simId: string) => void;
  onAutoFixConcept?: (data: AutoFixBannerData) => void;
}

const EXAM_DURATION_SEC = 20 * 60; // 20 minutes
const SECTIONAL_CUTOFF = 10; // Official IAF X Group Physics sectional cutoff (10/25)
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const chapterById = new Map(CHAPTERS.map((c) => [c.id, c]));

function formatClock(sec: number): string {
  const clamped = Math.max(0, Math.floor(sec));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const AirforceCbtMockWorkspace: React.FC<AirforceCbtMockWorkspaceProps> = ({
  language,
  onAddErrors,
  onSaveMockRecord,
  onLaunchSimulation,
  onAutoFixConcept,
}) => {
  const [phase, setPhase] = useState<'setup' | 'active' | 'submitted'>('setup');
  const [selectedSetId, setSelectedSetId] = useState<string>(AIRFORCE_MOCK_SETS[0].id);
  const [negativeMarking, setNegativeMarking] = useState<boolean>(true); // Default: Real IAF +1 / -0.25
  const [activeSetLabel, setActiveSetLabel] = useState<string>(AIRFORCE_MOCK_SETS[0].label.en);
  const [questions, setQuestions] = useState<AirforcePYQ[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true });
  const [secondsLeft, setSecondsLeft] = useState<number>(EXAM_DURATION_SEC);
  const [lastRecord, setLastRecord] = useState<AirforceMockRecord | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'skipped'>('all');

  const submittedRef = useRef<boolean>(false);

  const finalizeExam = useCallback(
    (remainingSec: number) => {
      if (submittedRef.current) return;
      submittedRef.current = true;

      let correct = 0;
      let wrong = 0;
      let skipped = 0;
      const wrongIds: string[] = [];

      questions.forEach((q, idx) => {
        const picked = answers[idx];
        if (picked === undefined) {
          skipped++;
        } else if (picked === q.correctIndex) {
          correct++;
        } else {
          wrong++;
          wrongIds.push(q.id);
        }
      });

      const netScore = Number((correct - (negativeMarking ? wrong * 0.25 : 0)).toFixed(2));
      const attempted = correct + wrong;
      const accuracyPct = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
      const durationSec = Math.max(1, EXAM_DURATION_SEC - remainingSec);

      const record: AirforceMockRecord = {
        id: `mock-${Date.now()}`,
        timestamp: Date.now(),
        setLabel: activeSetLabel,
        negativeMarking,
        netScore,
        maxScore: questions.length,
        correct,
        wrong,
        skipped,
        accuracyPct,
        passedCutoff: netScore >= SECTIONAL_CUTOFF,
        durationSec,
      };

      setLastRecord(record);
      onSaveMockRecord(record);
      if (wrongIds.length > 0) {
        onAddErrors(wrongIds);
      }
      playExamCue('submit');
      setPhase('submitted');
    },
    [activeSetLabel, answers, negativeMarking, onAddErrors, onSaveMockRecord, questions]
  );

  useEffect(() => {
    if (phase !== 'active') return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          finalizeExam(0);
          return 0;
        }
        const next = prev - 1;
        if (next === 120) {
          playExamCue('warning');
        } else if (next <= 10 && next > 0) {
          playExamCue('tick');
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, finalizeExam]);

  const startMock = (mode: 'preset' | 'random') => {
    const preset = AIRFORCE_MOCK_SETS.find((s) => s.id === selectedSetId) ?? AIRFORCE_MOCK_SETS[0];
    const seed = mode === 'random' ? Math.floor(Date.now() % 1000000) : preset.seed;
    const qs = generateBalancedAirforceMock(seed);
    submittedRef.current = false;
    setQuestions(qs);
    setActiveSetLabel(
      mode === 'random'
        ? language === 'hi'
          ? 'संतुलित रैंडम मॉक (25 प्रश्न)'
          : 'Balanced Random Mock (25 Q)'
        : formatBilingual(preset.label, language)
    );
    setCurrentIdx(0);
    setAnswers({});
    setMarked({});
    setVisited({ 0: true });
    setSecondsLeft(EXAM_DURATION_SEC);
    setLastRecord(null);
    setReviewFilter('all');
    setPhase('active');
  };

  const jumpToQuestion = (idx: number) => {
    setCurrentIdx(idx);
    setVisited((prev) => ({ ...prev, [idx]: true }));
  };

  const selectOption = (optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
  };

  const clearResponse = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentIdx];
      return next;
    });
  };

  const toggleMarkForReview = () => {
    setMarked((prev) => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
  };

  const saveAndNext = () => {
    if (currentIdx < questions.length - 1) {
      jumpToQuestion(currentIdx + 1);
    }
  };

  const paletteCounts = useMemo(() => {
    let answered = 0;
    let markedCount = 0;
    let notAnswered = 0;
    let notVisited = 0;
    questions.forEach((_, idx) => {
      const hasAns = answers[idx] !== undefined;
      const isMarked = !!marked[idx];
      const isVis = !!visited[idx];
      if (isMarked) markedCount++;
      if (hasAns) answered++;
      else if (isVis) notAnswered++;
      else notVisited++;
    });
    return { answered, markedCount, notAnswered, notVisited };
  }, [answers, marked, questions, visited]);

  const chapterBreakdown = useMemo(() => {
    if (phase !== 'submitted') return [];
    const map = new Map<string, { chapterId: string; total: number; correct: number; wrong: number }>();
    questions.forEach((q, idx) => {
      const entry = map.get(q.chapterId) ?? { chapterId: q.chapterId, total: 0, correct: 0, wrong: 0 };
      entry.total++;
      const picked = answers[idx];
      if (picked === q.correctIndex) entry.correct++;
      else if (picked !== undefined) entry.wrong++;
      map.set(q.chapterId, entry);
    });
    return Array.from(map.values()).sort((a, b) => b.wrong - a.wrong || a.correct - b.correct);
  }, [answers, phase, questions]);

  // ============================================================================
  // 1. PRE-EXAM SETUP VIEW
  // ============================================================================
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        {/* Exam Specification Banner */}
        <div className="border-2 border-black dark:border-white p-5 sm:p-6 bg-white dark:bg-black">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
                IAF AGNIVEER VAYU · SCIENCE SUBJECTS PHYSICS CBT
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
                {language === 'hi'
                  ? '25-प्रश्न / 20-मिनट एयरफोर्स X ग्रुप CBT मॉक टेस्ट'
                  : '25-Question / 20-Minute Airforce X Group CBT Mock'}
              </h2>
              <p className="text-xs sm:text-sm text-black/75 dark:text-white/75 mt-1">
                {language === 'hi'
                  ? 'वास्तविक IAF परीक्षा पैटर्न: 25 वस्तुनिष्ठ प्रश्न · 20:00 मिनट · अनुभागीय कट-ऑफ 10/25 · गलत उत्तर स्वतः त्रुटि पुस्तिका में सहेजे जाते हैं।'
                  : 'Real IAF exam pattern: 25 MCQs · 20:00 countdown · Sectional cutoff 10/25 · Wrong answers auto-logged to your Error Book.'}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 shrink-0 text-center">
              <div className="border-2 border-black dark:border-white px-3 py-2">
                <div className="text-lg font-mono font-extrabold tabular-nums">25</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60">
                  {language === 'hi' ? 'प्रश्न' : 'Questions'}
                </div>
              </div>
              <div className="border-2 border-black dark:border-white px-3 py-2">
                <div className="text-lg font-mono font-extrabold tabular-nums">20:00</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60">
                  {language === 'hi' ? 'मिनट' : 'Minutes'}
                </div>
              </div>
              <div className="border-2 border-black dark:border-white px-3 py-2">
                <div className="text-lg font-mono font-extrabold tabular-nums">10/25</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60">
                  {language === 'hi' ? 'कट-ऑफ' : 'Cutoff'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marking Scheme Selector */}
        <div className="border-2 border-black dark:border-white p-5 bg-white dark:bg-black space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-black/70 dark:text-white/70">
            {language === 'hi' ? 'अंकन प्रणाली चुनें (Marking Scheme)' : 'Select Marking Scheme'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setNegativeMarking(true)}
              className={`text-left p-4 border-2 transition-colors ${
                negativeMarking
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                  : 'bg-white text-black border-black/40 hover:border-black dark:bg-black dark:text-white dark:border-white/40 dark:hover:border-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm">
                  {language === 'hi' ? 'आधिकारिक IAF पैटर्न (+1 / −0.25)' : 'Official IAF Pattern (+1 / −0.25)'}
                </span>
                <span className="text-[11px] font-mono font-bold uppercase">
                  {negativeMarking ? '● ACTIVE' : '○'}
                </span>
              </div>
              <p
                className={`text-xs mt-1 ${
                  negativeMarking ? 'text-white/80 dark:text-black/80' : 'text-black/65 dark:text-white/65'
                }`}
              >
                {language === 'hi'
                  ? 'सही उत्तर: +1 · गलत उत्तर: −0.25 नकारात्मक अंकन · अनुत्तरित: 0'
                  : 'Correct: +1 · Wrong: −0.25 negative marking · Unattempted: 0'}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setNegativeMarking(false)}
              className={`text-left p-4 border-2 transition-colors ${
                !negativeMarking
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                  : 'bg-white text-black border-black/40 hover:border-black dark:bg-black dark:text-white dark:border-white/40 dark:hover:border-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm">
                  {language === 'hi' ? 'अभ्यास मोड (+1 / 0 कोई नकारात्मक नहीं)' : 'Practice Mode (+1 / 0 No Negative)'}
                </span>
                <span className="text-[11px] font-mono font-bold uppercase">
                  {!negativeMarking ? '● ACTIVE' : '○'}
                </span>
              </div>
              <p
                className={`text-xs mt-1 ${
                  !negativeMarking ? 'text-white/80 dark:text-black/80' : 'text-black/65 dark:text-white/65'
                }`}
              >
                {language === 'hi'
                  ? 'गति अभ्यास के लिए: सही उत्तर +1 और गलत उत्तर पर 0 कटौती।'
                  : 'Speed-building mode: +1 for correct answers, 0 penalty for wrong attempts.'}
              </p>
            </button>
          </div>
        </div>

        {/* Preset Set Selection */}
        <div className="border-2 border-black dark:border-white p-5 bg-white dark:bg-black space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-black/70 dark:text-white/70">
            {language === 'hi' ? 'मॉक टेस्ट पेपर चुनें' : 'Choose Mock Test Paper'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AIRFORCE_MOCK_SETS.map((preset) => {
              const active = selectedSetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedSetId(preset.id)}
                  className={`text-left p-4 border-2 transition-colors ${
                    active
                      ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                      : 'bg-white text-black border-black/35 hover:border-black dark:bg-black dark:text-white dark:border-white/35 dark:hover:border-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-sm">{formatBilingual(preset.label, language)}</span>
                    <span className="text-[11px] font-mono font-bold">25 Q · 20m</span>
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      active ? 'text-white/80 dark:text-black/80' : 'text-black/65 dark:text-white/65'
                    }`}
                  >
                    {formatBilingual(preset.subtitle, language)}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => startMock('preset')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-extrabold border-2 border-black bg-black text-white hover:bg-black/85 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/85 whitespace-nowrap"
            >
              <Play className="w-4 h-4" />
              {language === 'hi' ? 'चयनित CBT मॉक शुरू करें' : 'Start Selected CBT Mock'}
            </button>
            <button
              type="button"
              onClick={() => startMock('random')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap"
            >
              <Shuffle className="w-4 h-4" />
              {language === 'hi' ? 'स्मार्ट रैंडम 25-Q मॉक चलाएँ' : 'Launch Smart Balanced Random Mock'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. ACTIVE CBT EXAM VIEW
  // ============================================================================
  if (phase === 'active' && questions.length > 0) {
    const q = questions[currentIdx];
    const ch = chapterById.get(q.chapterId);
    const selectedOpt = answers[currentIdx];
    const isMarked = !!marked[currentIdx];
    const isLowTime = secondsLeft <= 120;

    return (
      <div className="space-y-4">
        {/* Top Live Exam Strip */}
        <div className="border-2 border-black dark:border-white p-3.5 bg-white dark:bg-black flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold">{activeSetLabel}</div>
            <div className="text-[11px] font-mono text-black/65 dark:text-white/65">
              {negativeMarking ? 'Official +1 / −0.25' : 'Practice +1 / 0'} · {paletteCounts.answered}/25 Answered
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 border-2 font-mono font-extrabold text-sm tabular-nums ${
                isLowTime
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                  : 'border-black dark:border-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              {formatClock(secondsLeft)}
            </div>

            <button
              type="button"
              onClick={() => finalizeExam(secondsLeft)}
              className="px-4 py-1.5 text-xs font-extrabold border-2 border-black bg-black text-white hover:bg-black/85 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/85 whitespace-nowrap"
            >
              {language === 'hi' ? 'टेस्ट सबमिट करें' : 'Submit Test'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Main Question Area */}
          <div className="lg:col-span-8 border-2 border-black dark:border-white p-5 bg-white dark:bg-black space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-black/20 dark:border-white/20">
              <div className="font-mono text-sm font-extrabold tabular-nums">
                Q{String(currentIdx + 1).padStart(2, '0')} / {questions.length}
              </div>
              <div className="text-[11px] font-mono text-black/65 dark:text-white/65">
                {q.yearTag} · {ch ? `Ch ${ch.number} ${ch.name.en}` : q.chapterId} · {q.questionType}
              </div>
            </div>

            <div className="text-base sm:text-lg font-bold leading-snug">
              {formatBilingual(q.question, language)}
            </div>

            <div className="space-y-2.5">
              {q.options.map((opt, oIdx) => {
                const isSelected = selectedOpt === oIdx;
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => selectOption(oIdx)}
                    className={`w-full text-left p-3.5 border-2 transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white font-bold'
                        : 'bg-white text-black border-black/35 hover:border-black dark:bg-black dark:text-white dark:border-white/35 dark:hover:border-white'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 shrink-0 flex items-center justify-center font-mono text-xs font-extrabold border ${
                        isSelected
                          ? 'border-white dark:border-black'
                          : 'border-black/40 dark:border-white/40'
                      }`}
                    >
                      {OPTION_LETTERS[oIdx]}
                    </span>
                    <span className="text-sm leading-snug">{formatBilingual(opt, language)}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-black/20 dark:border-white/20">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMarkForReview}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-2 whitespace-nowrap ${
                    isMarked
                      ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                      : 'border-black dark:border-white'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  {isMarked
                    ? language === 'hi'
                      ? 'रिव्यू चिह्नित ★'
                      : 'Marked ★'
                    : language === 'hi'
                      ? 'रिव्यू हेतु चिह्नित'
                      : 'Mark for Review'}
                </button>
                <button
                  type="button"
                  onClick={clearResponse}
                  disabled={selectedOpt === undefined}
                  className="px-3 py-2 text-xs font-bold border-2 border-black/40 dark:border-white/40 hover:border-black dark:hover:border-white disabled:opacity-40 whitespace-nowrap"
                >
                  {language === 'hi' ? 'उत्तर साफ़ करें' : 'Clear Response'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => jumpToQuestion(Math.max(0, currentIdx - 1))}
                  disabled={currentIdx === 0}
                  className="px-3 py-2 text-xs font-bold border-2 border-black dark:border-white disabled:opacity-35 whitespace-nowrap"
                >
                  {language === 'hi' ? 'पिछला' : 'Prev'}
                </button>
                <button
                  type="button"
                  onClick={currentIdx === questions.length - 1 ? () => finalizeExam(secondsLeft) : saveAndNext}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold border-2 border-black bg-black text-white hover:bg-black/85 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/85 whitespace-nowrap"
                >
                  {currentIdx === questions.length - 1
                    ? language === 'hi'
                      ? 'सबमिट करें'
                      : 'Finish & Submit'
                    : language === 'hi'
                      ? 'सहेजें व अगला'
                      : 'Save & Next'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right 1-25 Monochrome Question Palette */}
          <div className="lg:col-span-4 border-2 border-black dark:border-white p-4 bg-white dark:bg-black space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider">
              {language === 'hi' ? 'प्रश्न पैलेट (1–25)' : 'Question Palette (1–25)'}
            </div>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, idx) => {
                const hasAns = answers[idx] !== undefined;
                const isMk = !!marked[idx];
                const isVis = !!visited[idx];
                const isCur = idx === currentIdx;

                let stateCls =
                  'bg-white text-black/55 border-black/30 dark:bg-black dark:text-white/55 dark:border-white/30';
                if (hasAns && isMk) {
                  stateCls =
                    'bg-black text-white border-dashed border-black dark:bg-white dark:text-black dark:border-white';
                } else if (hasAns) {
                  stateCls = 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white';
                } else if (isMk) {
                  stateCls =
                    'bg-white text-black border-dashed border-black dark:bg-black dark:text-white dark:border-white';
                } else if (isVis) {
                  stateCls = 'bg-white text-black border-black dark:bg-black dark:text-white dark:border-white';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => jumpToQuestion(idx)}
                    className={`h-10 border-2 font-mono text-xs font-extrabold tabular-nums relative transition-transform ${stateCls} ${
                      isCur ? 'ring-2 ring-offset-2 ring-black dark:ring-white dark:ring-offset-black' : ''
                    }`}
                  >
                    {idx + 1}
                    {isMk && <span className="absolute top-0.5 right-0.5 text-[9px] leading-none">★</span>}
                  </button>
                );
              })}
            </div>

            {/* Distinct Pure B&W Legend (never hue-only) */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-black/20 dark:border-white/20 text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black bg-black dark:border-white dark:bg-white inline-block" />
                <span>Answered ({paletteCounts.answered})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-dashed border-black dark:border-white inline-flex items-center justify-center text-[9px]">
                  ★
                </span>
                <span>Review ({paletteCounts.markedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black dark:border-white inline-block" />
                <span>Skipped ({paletteCounts.notAnswered})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 dark:border-white/30 inline-block" />
                <span>Unseen ({paletteCounts.notVisited})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 3. SUBMITTED RESULT SCORECARD & SHORTCUT REVIEW
  // ============================================================================
  const filteredReview = questions
    .map((q, idx) => ({ q, idx, picked: answers[idx] }))
    .filter(({ q, picked }) => {
      if (reviewFilter === 'wrong') return picked !== undefined && picked !== q.correctIndex;
      if (reviewFilter === 'skipped') return picked === undefined;
      return true;
    });

  return (
    <div className="space-y-6">
      {lastRecord && (
        <div className="border-2 border-black dark:border-white bg-white dark:bg-black overflow-hidden">
          {/* Pass / Cutoff Status Bar */}
          <div className="p-5 bg-black text-white dark:bg-white dark:text-black flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              {lastRecord.passedCutoff ? (
                <CheckCircle2 className="w-7 h-7 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-7 h-7 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-widest opacity-80">
                  {lastRecord.setLabel} · {lastRecord.negativeMarking ? '+1 / −0.25' : '+1 / 0'}
                </div>
                <h2 className="text-xl font-extrabold mt-0.5">
                  {lastRecord.passedCutoff
                    ? language === 'hi'
                      ? 'अनुभागीय कट-ऑफ उत्तीर्ण (≥ 10/25)'
                      : 'Sectional Cutoff Cleared (≥ 10/25)'
                    : language === 'hi'
                      ? 'अनुभागीय कट-ऑफ से नीचे (< 10/25) — त्रुटियाँ अभ्यास करें'
                      : 'Below Sectional Cutoff (< 10/25) — Revise Error Book'}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPhase('setup')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold border-2 border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {language === 'hi' ? 'नया मॉक टेस्ट दें' : 'Take Another Mock'}
            </button>
          </div>

          {/* Key Scorecard Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-black/20 dark:divide-white/20 text-center">
            <div className="p-4">
              <div className="text-2xl font-mono font-extrabold tabular-nums">
                {lastRecord.netScore.toFixed(2)} / {lastRecord.maxScore}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mt-0.5">
                {language === 'hi' ? 'कुल स्कोर' : 'Net Score'}
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-mono font-extrabold tabular-nums">{lastRecord.correct}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mt-0.5">
                {language === 'hi' ? 'सही (+1)' : 'Correct (+1)'}
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-mono font-extrabold tabular-nums">{lastRecord.wrong}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mt-0.5">
                {language === 'hi'
                  ? lastRecord.negativeMarking
                    ? 'गलत (−0.25)'
                    : 'गलत (0)'
                  : lastRecord.negativeMarking
                    ? 'Wrong (−0.25)'
                    : 'Wrong (0)'}
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-mono font-extrabold tabular-nums">{lastRecord.accuracyPct}%</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mt-0.5">
                {language === 'hi' ? 'सटीकता' : 'Accuracy'}
              </div>
            </div>
            <div className="p-4 col-span-2 sm:col-span-1">
              <div className="text-2xl font-mono font-extrabold tabular-nums">
                {formatClock(lastRecord.durationSec)}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mt-0.5">
                {language === 'hi' ? 'समय लिया' : 'Time Taken'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapter-wise Accuracy Breakdown */}
      {chapterBreakdown.length > 0 && (
        <div className="border-2 border-black dark:border-white p-5 bg-white dark:bg-black space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-black/70 dark:text-white/70">
            {language === 'hi' ? 'अध्याय-वार प्रदर्शन विश्लेषण' : 'Chapter-Wise Performance'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {chapterBreakdown.map((item) => {
              const ch = chapterById.get(item.chapterId);
              return (
                <div
                  key={item.chapterId}
                  className="border border-black/30 dark:border-white/30 p-3 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">
                      {ch ? `Ch ${ch.number} · ${formatBilingual(ch.name, language)}` : item.chapterId}
                    </div>
                    <div className="text-[11px] font-mono text-black/60 dark:text-white/60">
                      {item.correct} ✓ · {item.wrong} ✕ · {item.total - item.correct - item.wrong} skipped
                    </div>
                  </div>
                  <div className="font-mono text-xs font-extrabold tabular-nums shrink-0">
                    {item.correct}/{item.total}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Answer Key & 20-Second Shortcut Review */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider">
            {language === 'hi' ? '20-सेकंड शॉर्टकट समाधान समीक्षा' : '20-Second Shortcut Solution Review'}
          </h3>
          <div className="flex items-center gap-2">
            {(
              [
                ['all', language === 'hi' ? `सभी (${questions.length})` : `All (${questions.length})`],
                ['wrong', language === 'hi' ? `गलत (${lastRecord?.wrong ?? 0})` : `Wrong (${lastRecord?.wrong ?? 0})`],
                [
                  'skipped',
                  language === 'hi' ? `छोड़े (${lastRecord?.skipped ?? 0})` : `Skipped (${lastRecord?.skipped ?? 0})`,
                ],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setReviewFilter(key)}
                className={`px-3 py-1.5 text-xs font-bold border-2 whitespace-nowrap ${
                  reviewFilter === key
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                    : 'border-black/35 dark:border-white/35'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filteredReview.map(({ q, idx, picked }) => {
          const isCorrect = picked === q.correctIndex;
          const isSkipped = picked === undefined;
          const ch = chapterById.get(q.chapterId);

          return (
            <div
              key={q.id}
              className="border-2 border-black dark:border-white p-4 sm:p-5 bg-white dark:bg-black space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                  <span>Q{String(idx + 1).padStart(2, '0')}</span>
                  <span>·</span>
                  <span>{q.yearTag}</span>
                  <span>·</span>
                  <span>{ch ? `Ch ${ch.number}` : q.chapterId}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> CORRECT (+1)
                    </>
                  ) : isSkipped ? (
                    <>SKIPPED (0)</>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> WRONG ({negativeMarking ? '−0.25' : '0'}) · Saved to Error Book
                    </>
                  )}
                </div>
              </div>

              <div className="text-sm sm:text-base font-bold">{formatBilingual(q.question, language)}</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options.map((opt, oIdx) => {
                  const isAns = oIdx === q.correctIndex;
                  const isUserPick = oIdx === picked;
                  return (
                    <div
                      key={oIdx}
                      className={`p-2.5 border ${
                        isAns
                          ? 'border-2 border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-bold'
                          : isUserPick
                            ? 'border-2 border-dashed border-black dark:border-white font-semibold'
                            : 'border-black/25 dark:border-white/25 text-black/75 dark:text-white/75'
                      }`}
                    >
                      <span className="font-mono font-extrabold mr-2">{OPTION_LETTERS[oIdx]}.</span>
                      {formatBilingual(opt, language)}
                      {isAns && <span className="ml-2 font-mono text-[10px]">[✓ ANSWER]</span>}
                      {isUserPick && !isAns && <span className="ml-2 font-mono text-[10px]">[✕ YOURS]</span>}
                    </div>
                  );
                })}
              </div>

              <div className="border border-black/30 dark:border-white/30 p-3 space-y-1.5 text-xs">
                <div className="font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === 'hi' ? '20-सेकंड शॉर्टकट:' : '20-Second Shortcut:'}
                </div>
                <div className="font-semibold">{formatBilingual(q.shortcut20s, language)}</div>
                <div className="text-black/75 dark:text-white/75 pt-1">
                  {formatBilingual(q.solution, language)}
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {!isCorrect && onAutoFixConcept && (
                  <button
                    type="button"
                    onClick={() =>
                      onAutoFixConcept({
                        simId: q.simId,
                        questionSnippet: getBilingualPrimary(q.question, language),
                        explanationEn: `${q.shortcut20s.en} ${q.solution.en}`,
                        explanationHi: `${q.shortcut20s.hi} ${q.solution.hi}`,
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
                  onClick={() => onLaunchSimulation(q.simId)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap"
                >
                  {language === 'hi' ? 'लाइव सिमुलेशन खोलें' : 'Launch Live Lab'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
