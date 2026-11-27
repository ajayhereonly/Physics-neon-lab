import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Timer,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';
import { ChapterInfo, LanguageMode, PracticeQuestion } from '../types/physics';
import { ALL_PRACTICE_QUESTIONS } from '../data/questionBank';
import { getBilingualPrimary, getBilingualSecondary } from '../utils/bilingual';

interface ClassroomQuizRunnerProps {
  chapters: ChapterInfo[];
  initialChapterId: string;
  language: LanguageMode;
}

type QuizScope = 'current' | 'Class 11' | 'Class 12' | 'all';
type ScoringMode = 'solo' | 'teams';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

function shuffleQuestions(list: PracticeQuestion[], count: number): PracticeQuestion[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

export function ClassroomQuizRunner({
  chapters,
  initialChapterId,
  language,
}: ClassroomQuizRunnerProps) {
  const [scope, setScope] = useState<QuizScope>('current');
  const [chapterId, setChapterId] = useState<string>(initialChapterId);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [secondsPerQ, setSecondsPerQ] = useState<number>(30); // 0 = Off
  const [scoringMode, setScoringMode] = useState<ScoringMode>('teams');

  const [phase, setPhase] = useState<'setup' | 'running' | 'summary'>('setup');
  const [quizDeck, setQuizDeck] = useState<PracticeQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerPaused, setTimerPaused] = useState(false);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [awardedThisQ, setAwardedThisQ] = useState<'solo' | 'A' | 'B' | null>(null);

  const [soloScore, setSoloScore] = useState(0);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [teamTurn, setTeamTurn] = useState<'A' | 'B'>('A');

  useEffect(() => {
    setChapterId(initialChapterId);
  }, [initialChapterId]);

  const chapterMap = useMemo(() => new Map(chapters.map((c) => [c.id, c])), [chapters]);

  const pool = useMemo(() => {
    if (scope === 'current') {
      return ALL_PRACTICE_QUESTIONS.filter((q) => q.chapterId === chapterId);
    }
    if (scope === 'Class 11' || scope === 'Class 12') {
      return ALL_PRACTICE_QUESTIONS.filter(
        (q) => chapterMap.get(q.chapterId)?.classLevel === scope
      );
    }
    return ALL_PRACTICE_QUESTIONS;
  }, [scope, chapterId, chapterMap]);

  // Countdown tick
  useEffect(() => {
    if (phase !== 'running' || secondsPerQ === 0 || timerPaused || revealed) return;
    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }
    const id = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, secondsPerQ, timerPaused, revealed, timeLeft]);

  const handleStartQuiz = () => {
    const selected = shuffleQuestions(pool, questionCount);
    setQuizDeck(selected);
    setQIdx(0);
    setTimeLeft(secondsPerQ);
    setTimerPaused(false);
    setPickedOption(null);
    setRevealed(false);
    setAwardedThisQ(null);
    setSoloScore(0);
    setTeamAScore(0);
    setTeamBScore(0);
    setTeamTurn('A');
    setPhase('running');
  };

  const currentQ = quizDeck[qIdx];

  const handlePickOption = (idx: number) => {
    if (revealed || !currentQ) return;
    setPickedOption(idx);
    setRevealed(true);
    if (idx === currentQ.correctIndex) {
      if (scoringMode === 'solo') {
        setSoloScore((s) => s + 1);
        setAwardedThisQ('solo');
      } else if (teamTurn === 'A') {
        setTeamAScore((s) => s + 1);
        setAwardedThisQ('A');
      } else {
        setTeamBScore((s) => s + 1);
        setAwardedThisQ('B');
      }
    }
  };

  const handleManualAward = (team: 'A' | 'B') => {
    if (awardedThisQ === team) return;
    if (awardedThisQ === 'A') setTeamAScore((s) => Math.max(0, s - 1));
    if (awardedThisQ === 'B') setTeamBScore((s) => Math.max(0, s - 1));
    if (team === 'A') setTeamAScore((s) => s + 1);
    if (team === 'B') setTeamBScore((s) => s + 1);
    setAwardedThisQ(team);
  };

  const handleNextQuestion = () => {
    if (qIdx + 1 >= quizDeck.length) {
      setPhase('summary');
      return;
    }
    setQIdx((i) => i + 1);
    setTimeLeft(secondsPerQ);
    setTimerPaused(false);
    setPickedOption(null);
    setRevealed(false);
    setAwardedThisQ(null);
    setTeamTurn((t) => (t === 'A' ? 'B' : 'A'));
  };

  // ================= SETUP SCREEN =================
  if (phase === 'setup') {
    return (
      <section className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-6 sm:p-8 space-y-6">
        <div className="border-b-2 border-black dark:border-white pb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight">
            {language === 'hi'
              ? 'कक्षा लाइव क्विज़ मोड (टाइमर व स्कोरबोर्ड)'
              : 'Classroom Live Quiz Mode'}
          </h2>
          <p className="mt-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {language === 'hi'
              ? 'प्रोजेक्टर पर बड़े अक्षरों में समयबद्ध बहुविकल्पीय प्रश्न और टीम A बनाम टीम B स्कोरबोर्ड चलाएँ।'
              : 'Run timed projector-sized MCQ rounds with instant solution reveal and Solo or Team A vs Team B scoring.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scope Selector */}
          <div className="space-y-2.5">
            <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
              {language === 'hi' ? '1. पाठ्यक्रम क्षेत्र' : '1. Question Scope'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'current', label: language === 'hi' ? 'चयनित अध्याय' : 'Single Chapter' },
                  { id: 'Class 11', label: language === 'hi' ? 'संपूर्ण कक्षा 11' : 'All Class 11' },
                  { id: 'Class 12', label: language === 'hi' ? 'संपूर्ण कक्षा 12' : 'All Class 12' },
                  { id: 'all', label: language === 'hi' ? 'पूर्ण पाठ्यक्रम (348)' : 'Full Syllabus (348)' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setScope(opt.id)}
                  className={`px-3 py-2.5 text-xs sm:text-sm font-bold rounded-lg border-2 transition-colors cursor-pointer ${
                    scope === opt.id
                      ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                      : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {scope === 'current' && (
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full mt-2 px-3 py-2.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-sm font-bold text-black dark:text-white"
              >
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    Ch {ch.number} · {getBilingualPrimary(ch.name, language)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Count, Timer & Scoring */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
                {language === 'hi' ? '2. प्रश्नों की संख्या' : '2. Number of Questions'}
              </label>
              <div className="flex gap-2">
                {[5, 10, 12].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`flex-1 py-2 text-sm font-mono font-extrabold rounded-lg border-2 cursor-pointer ${
                      questionCount === cnt
                        ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                        : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white'
                    }`}
                  >
                    {cnt} Qs
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
                {language === 'hi' ? '3. प्रति प्रश्न टाइमर' : '3. Timer Per Question'}
              </label>
              <div className="flex gap-2">
                {[15, 30, 60, 0].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSecondsPerQ(sec)}
                    className={`flex-1 py-2 text-xs sm:text-sm font-mono font-extrabold rounded-lg border-2 cursor-pointer ${
                      secondsPerQ === sec
                        ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                        : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white'
                    }`}
                  >
                    {sec === 0 ? 'OFF' : `${sec}s`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
                {language === 'hi' ? '4. स्कोरिंग मोड' : '4. Scoring Mode'}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setScoringMode('teams')}
                  className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg border-2 inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                    scoringMode === 'teams'
                      ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                      : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Team A vs Team B</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScoringMode('solo')}
                  className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg border-2 inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                    scoringMode === 'solo'
                      ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                      : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>{language === 'hi' ? 'संपूर्ण कक्षा' : 'Solo Class'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t-2 border-neutral-300 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm font-mono font-bold text-neutral-700 dark:text-neutral-300">
            {pool.length} {language === 'hi' ? 'उपलब्ध प्रश्न' : 'questions in selected pool'}
          </div>
          <button
            type="button"
            onClick={handleStartQuiz}
            disabled={pool.length === 0}
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-extrabold rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-85 disabled:opacity-30 transition-opacity cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'hi' ? 'लाइव क्विज़ शुरू करें' : 'Start Classroom Quiz'}</span>
          </button>
        </div>
      </section>
    );
  }

  // ================= SUMMARY SCREEN =================
  if (phase === 'summary') {
    const winner =
      teamAScore > teamBScore
        ? 'TEAM A WINS!'
        : teamBScore > teamAScore
          ? 'TEAM B WINS!'
          : 'TIE MATCH!';

    return (
      <section className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-black dark:border-white">
          <Trophy className="w-7 h-7 text-black dark:text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-black dark:text-white">
            {scoringMode === 'teams'
              ? winner
              : `${soloScore} / ${quizDeck.length} ${language === 'hi' ? 'सही उत्तर' : 'Correct'}`}
          </h2>
          <p className="mt-1 text-sm font-mono font-bold text-neutral-700 dark:text-neutral-300">
            {quizDeck.length} {language === 'hi' ? 'प्रश्न पूर्ण' : 'Questions Completed'}
          </p>
        </div>

        {scoringMode === 'teams' && (
          <div className="max-w-lg mx-auto grid grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black">
              <div className="text-xs font-mono font-bold uppercase opacity-80">TEAM A</div>
              <div className="text-4xl font-mono font-extrabold tabular-nums mt-1">
                {teamAScore}
              </div>
            </div>
            <div className="p-5 rounded-xl border-2 border-black dark:border-white text-black dark:text-white">
              <div className="text-xs font-mono font-bold uppercase opacity-80">TEAM B</div>
              <div className="text-4xl font-mono font-extrabold tabular-nums mt-1">
                {teamBScore}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleStartQuiz}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-extrabold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'hi' ? 'नया राउंड शुरू करें' : 'Play Another Round'}</span>
          </button>
          <button
            type="button"
            onClick={() => setPhase('setup')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
          >
            <span>{language === 'hi' ? 'सेटिंग्स बदलें' : 'Change Quiz Settings'}</span>
          </button>
        </div>
      </section>
    );
  }

  // ================= LIVE RUNNING QUIZ =================
  if (!currentQ) return null;
  const pctTime = secondsPerQ > 0 ? (timeLeft / secondsPerQ) * 100 : 100;
  const qCh = chapterMap.get(currentQ.chapterId);

  return (
    <div className="space-y-5">
      {/* Live Scoreboard & Timer Strip */}
      <div className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-base sm:text-lg font-extrabold text-black dark:text-white">
            Q{String(qIdx + 1).padStart(2, '0')} / {quizDeck.length}
          </span>
          {qCh && (
            <span className="text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Ch {qCh.number} · {currentQ.difficulty}
            </span>
          )}
        </div>

        {/* Scoreboard */}
        <div className="flex items-center gap-3 font-mono text-sm sm:text-base font-extrabold">
          {scoringMode === 'teams' ? (
            <>
              <span
                className={`px-3 py-1 rounded-lg border-2 border-black dark:border-white ${
                  teamTurn === 'A'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-black dark:text-white'
                }`}
              >
                TEAM A: {teamAScore}
              </span>
              <span
                className={`px-3 py-1 rounded-lg border-2 border-black dark:border-white ${
                  teamTurn === 'B'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-black dark:text-white'
                }`}
              >
                TEAM B: {teamBScore}
              </span>
            </>
          ) : (
            <span className="px-3 py-1 rounded-lg bg-black text-white dark:bg-white dark:text-black">
              SCORE: {soloScore} / {quizDeck.length}
            </span>
          )}
        </div>

        {/* Timer Controls */}
        <div className="flex items-center gap-2">
          {secondsPerQ > 0 && (
            <>
              <span className="inline-flex items-center gap-1.5 font-mono text-lg font-extrabold tabular-nums text-black dark:text-white">
                <Timer className="w-4 h-4" />
                {timeLeft}s
              </span>
              <button
                type="button"
                onClick={() => setTimerPaused((p) => !p)}
                disabled={revealed}
                className="p-2 rounded-lg border-2 border-black dark:border-white text-black dark:text-white disabled:opacity-30 cursor-pointer"
                title={timerPaused ? 'Resume timer' : 'Pause timer'}
              >
                {timerPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setPhase('setup')}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white cursor-pointer"
          >
            {language === 'hi' ? 'समाप्त' : 'Exit'}
          </button>
        </div>

        {/* Countdown Progress Bar */}
        {secondsPerQ > 0 && (
          <div className="w-full h-2.5 rounded-full border border-black dark:border-white bg-white dark:bg-black overflow-hidden">
            <div
              className="h-full bg-black dark:bg-white transition-all duration-500"
              style={{ width: `${pctTime}%` }}
            />
          </div>
        )}
      </div>

      {/* Extra-Large Projector Question Card */}
      <article className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-6 sm:p-8 space-y-6">
        {scoringMode === 'teams' && (
          <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            {language === 'hi' ? `वर्तमान बारी: टीम ${teamTurn}` : `ACTIVE TURN: TEAM ${teamTurn}`}
          </div>
        )}

        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-black dark:text-white leading-snug">
            {getBilingualPrimary(currentQ.question, language)}
          </h3>
          {getBilingualSecondary(currentQ.question, language) && (
            <p className="mt-2 text-base font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {currentQ.question.hi}
            </p>
          )}
        </div>

        {/* Large Clickable Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQ.options.map((opt, idx) => {
            const isCorrect = idx === currentQ.correctIndex;
            const isPicked = pickedOption === idx;
            let cls =
              'border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900';
            if (revealed) {
              if (isCorrect) {
                cls =
                  'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black';
              } else if (isPicked && !isCorrect) {
                cls =
                  'border-dashed border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white';
              } else {
                cls = 'border-neutral-300 dark:border-neutral-800 text-neutral-500';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePickOption(idx)}
                className={`text-left p-4 rounded-xl border-2 transition-colors flex items-start justify-between gap-3 cursor-pointer ${cls}`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="font-mono text-base font-extrabold shrink-0">
                    {OPTION_LETTERS[idx]}.
                  </span>
                  <div className="min-w-0">
                    <div className="text-base font-bold leading-snug">
                      {getBilingualPrimary(opt, language)}
                    </div>
                    {getBilingualSecondary(opt, language) && (
                      <div className="text-xs opacity-80 mt-0.5">{opt.hi}</div>
                    )}
                  </div>
                </div>
                {revealed && isCorrect && <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
                {revealed && isPicked && !isCorrect && (
                  <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Solution & Teacher Controls */}
        {revealed && (
          <div className="p-4 rounded-xl border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 space-y-1.5">
            <div className="font-mono text-xs font-extrabold text-black dark:text-white">
              {language === 'hi'
                ? `सही उत्तर: विकल्प ${OPTION_LETTERS[currentQ.correctIndex]}`
                : `CORRECT ANSWER: OPTION ${OPTION_LETTERS[currentQ.correctIndex]}`}
            </div>
            <p className="text-sm sm:text-base font-semibold text-black dark:text-white leading-relaxed">
              {getBilingualPrimary(currentQ.solution, language)}
            </p>
            {getBilingualSecondary(currentQ.solution, language) && (
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {currentQ.solution.hi}
              </p>
            )}
          </div>
        )}

        <div className="pt-3 border-t-2 border-neutral-300 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {!revealed && (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="px-4 py-2 text-xs sm:text-sm font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
              >
                {language === 'hi' ? 'उत्तर व हल दिखाएँ' : 'Reveal Answer & Solution'}
              </button>
            )}
            {scoringMode === 'teams' && revealed && (
              <>
                <button
                  type="button"
                  onClick={() => handleManualAward('A')}
                  className={`px-3 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white cursor-pointer ${
                    awardedThisQ === 'A'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-black dark:text-white'
                  }`}
                >
                  +1 Team A
                </button>
                <button
                  type="button"
                  onClick={() => handleManualAward('B')}
                  className={`px-3 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white cursor-pointer ${
                    awardedThisQ === 'B'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-black dark:text-white'
                  }`}
                >
                  +1 Team B
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextQuestion}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-extrabold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 cursor-pointer"
          >
            <span>
              {qIdx + 1 >= quizDeck.length
                ? language === 'hi'
                  ? 'अंतिम परिणाम देखें'
                  : 'View Final Scoreboard'
                : language === 'hi'
                  ? 'अगला प्रश्न'
                  : 'Next Question'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </article>
    </div>
  );
}
