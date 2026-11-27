import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Box,
  Calculator,
  Columns2,
  Compass,
  Contrast,
  Grid,
  Maximize2,
  Minimize2,
  Pause,
  PenTool,
  Play,
  RotateCcw,
  SkipForward,
} from 'lucide-react';
import {
  BUILTIN_SIMULATIONS,
  CHAPTERS,
  getDefaultParams,
  getSimShortTabLabel,
  getSimulationsByChapter,
} from './data/simulations';
import { ALL_PRACTICE_QUESTIONS } from './data/questionBank';
import { AIRFORCE_X_PYQS } from './data/airforceXBoosters';
import {
  AppView,
  ChalkStroke,
  ChalkTone,
  DrawingTool,
  LanguageMode,
  LiveSimTelemetry,
  PhysicsSimulation,
  SolverStudioTab,
  ThemeMode,
  WhatIfPrompt,
} from './types/physics';
import { getBilingualPrimary, getBilingualSecondary, UI_TEXT } from './utils/bilingual';
import { SimulationCanvas } from './components/SimulationCanvas';
import { Simulation3DCanvas } from './components/Simulation3DCanvas';
import { LiveGraph } from './components/LiveGraph';
import { ControlConceptDeck } from './components/ControlConceptDeck';
import { ChapterExplorer } from './components/ChapterExplorer';
import { PracticeBankView } from './components/PracticeBankView';
import { CustomFormulaLab } from './components/CustomFormulaLab';
import { FormulaSheetView } from './components/FormulaSheetView';
import { ChalkboardToolbar } from './components/ChalkboardToolbar';
import { CompareStage } from './components/CompareStage';
import { SolverStudioView } from './components/SolverStudioView';
import { AirforceXHubView } from './components/AirforceXHubView';
import { AudioControlStrip } from './components/AudioControlStrip';
import { stopPhysicsAudio } from './utils/physicsAudio';

const STORAGE_CUSTOM_SIMS = 'physicalive_custom_sims_v1';
const STORAGE_POLARITY = 'physicalive_bw_polarity';
const STORAGE_LANG = 'physicalive_lang';

function loadSavedCustomSims(): PhysicsSimulation[] {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_SIMS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  // Default to Pure White Board ('light') for bright classroom projectors; 1-click flip to Pure Black Board ('dark')
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      return localStorage.getItem(STORAGE_POLARITY) === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [language, setLanguage] = useState<LanguageMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG);
      if (saved === 'en' || saved === 'hi' || saved === 'dual') return saved;
    } catch {}
    return 'dual';
  });

  const [view, setView] = useState<AppView>('simulation');
  const [customSimulations, setCustomSimulations] = useState<PhysicsSimulation[]>(loadSavedCustomSims);
  const [activeSimId, setActiveSimId] = useState<string>('gravitation');

  const allSimulations = useMemo(
    () => [...BUILTIN_SIMULATIONS, ...customSimulations],
    [customSimulations]
  );

  const activeSimulation = useMemo(
    () => allSimulations.find((s) => s.id === activeSimId) ?? BUILTIN_SIMULATIONS[0],
    [allSimulations, activeSimId]
  );

  const [params, setParams] = useState<Record<string, number>>(() =>
    getDefaultParams(
      BUILTIN_SIMULATIONS.find((s) => s.id === 'gravitation') ?? BUILTIN_SIMULATIONS[0]
    )
  );
  const [use3D, setUse3D] = useState<boolean>(() => {
    const init = BUILTIN_SIMULATIONS.find((s) => s.id === 'gravitation') ?? BUILTIN_SIMULATIONS[0];
    return Boolean(init.default3D);
  });
  const [practiceChapterId, setPracticeChapterId] = useState<string>('gravitation');
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [showVectors, setShowVectors] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [resetToken, setResetToken] = useState(0);
  const [stepToken, setStepToken] = useState(0);
  const [telemetry, setTelemetry] = useState<LiveSimTelemetry | null>(null);
  const [activeProofId, setActiveProofId] = useState<string | null>(null);

  // Presenter, Compare Mode & Monochrome Chalkboard state
  const [isPresenterMode, setIsPresenterMode] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawTool, setDrawTool] = useState<DrawingTool>('pen');
  const [drawTone, setDrawTone] = useState<ChalkTone>('primary');
  const [strokes, setStrokes] = useState<ChalkStroke[]>([]);

  // Solver Studio deep-link handoff state
  const [solverLaunch, setSolverLaunch] = useState<{
    tab: SolverStudioTab;
    simId?: string | null;
    params?: Record<string, number> | null;
    token: number;
  }>({ tab: 'equation', simId: null, params: null, token: 0 });

  const [toast, setToast] = useState<string | null>(null);
  const proofAnimRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Sync Tailwind dark class for Pure Black Board vs Pure White Board
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_POLARITY, theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LANG, language);
    } catch {}
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_SIMS, JSON.stringify(customSimulations));
    } catch {}
  }, [customSimulations]);

  // Silence continuous physics audio immediately when leaving simulator view or entering compare mode
  useEffect(() => {
    if (view !== 'simulation' || isCompareMode) {
      stopPhysicsAudio();
    }
  }, [view, isCompareMode]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPresenterMode) {
        setIsPresenterMode(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPresenterMode]);

  const stopProofAnimation = () => {
    if (proofAnimRef.current !== null) {
      cancelAnimationFrame(proofAnimRef.current);
      proofAnimRef.current = null;
    }
  };

  const selectSimulation = useCallback(
    (id: string) => {
      stopProofAnimation();
      const target = allSimulations.find((s) => s.id === id);
      if (!target) return;
      setActiveSimId(target.id);
      setParams(getDefaultParams(target));
      setUse3D(Boolean(target.default3D));
      if (!target.isCustom) {
        setPracticeChapterId(target.chapterId);
      }
      setActiveProofId(null);
      setStrokes([]);
      setIsPlaying(true);
      setResetToken((t) => t + 1);
      setView('simulation');
    },
    [allSimulations]
  );

  const openPracticeForChapter = useCallback((chapterId: string) => {
    setIsPresenterMode(false);
    setPracticeChapterId(chapterId);
    setView('practice');
  }, []);

  const launchChapterSimulation = useCallback(
    (chapterId: string) => {
      const target = BUILTIN_SIMULATIONS.find((s) => s.chapterId === chapterId);
      if (target) {
        selectSimulation(target.id);
      }
    },
    [selectSimulation]
  );

  const openSolverForActiveSim = useCallback(() => {
    setIsPresenterMode(false);
    setSolverLaunch((prev) => ({
      tab: 'equation',
      simId: activeSimulation.isCustom ? null : activeSimulation.id,
      params: { ...params },
      token: prev.token + 1,
    }));
    setView('solver');
  }, [activeSimulation, params]);

  const openDerivationForActiveSim = useCallback(() => {
    setIsPresenterMode(false);
    setSolverLaunch((prev) => ({
      tab: 'derivations',
      simId: activeSimulation.isCustom ? null : activeSimulation.id,
      params: null,
      token: prev.token + 1,
    }));
    setView('solver');
  }, [activeSimulation]);

  const handleParamChange = useCallback((key: string, value: number) => {
    stopProofAnimation();
    setActiveProofId(null);
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleApplyParams = useCallback((nextParams: Record<string, number>) => {
    stopProofAnimation();
    setActiveProofId(null);
    setParams((prev) => ({ ...prev, ...nextParams }));
    setIsPlaying(true);
    setResetToken((t) => t + 1);
  }, []);

  const handleResetDefaults = useCallback(() => {
    stopProofAnimation();
    setActiveProofId(null);
    setParams(getDefaultParams(activeSimulation));
    setResetToken((t) => t + 1);
    setIsPlaying(true);
  }, [activeSimulation]);

  const handleRunProof = useCallback(
    (prompt: WhatIfPrompt) => {
      stopProofAnimation();
      setActiveProofId(prompt.id);
      setIsPlaying(true);

      const startParams = { ...params };
      const targetParams = { ...params, ...prompt.targetParams };
      const durationMs = 520;
      const startTime = performance.now();

      const stepAnim = (now: number) => {
        const progress = Math.min(1, (now - startTime) / durationMs);
        const eased = 1 - Math.pow(1 - progress, 3);
        const interpolated: Record<string, number> = {};
        for (const v of activeSimulation.variables) {
          const from = startParams[v.key] ?? v.defaultValue;
          const to = targetParams[v.key] ?? from;
          const raw = from + (to - from) * eased;
          const snapped = Math.round(raw / v.step) * v.step;
          interpolated[v.key] = Number(snapped.toFixed(4));
        }
        setParams(interpolated);
        if (progress < 1) {
          proofAnimRef.current = requestAnimationFrame(stepAnim);
        } else {
          setParams(targetParams);
          setResetToken((t) => t + 1);
          proofAnimRef.current = null;
        }
      };

      proofAnimRef.current = requestAnimationFrame(stepAnim);
      showToast(language === 'hi' ? 'लाइव प्रमाण सक्रिय किया गया' : 'Live What-If proof running on stage');
    },
    [params, activeSimulation, language, showToast]
  );

  const handleCustomCreated = useCallback(
    (newSim: PhysicsSimulation) => {
      setCustomSimulations((prev) => [newSim, ...prev]);
      setActiveSimId(newSim.id);
      setParams(getDefaultParams(newSim));
      setUse3D(false);
      setActiveProofId(null);
      setStrokes([]);
      setIsPlaying(true);
      setResetToken((t) => t + 1);
      setView('simulation');
      showToast(
        language === 'hi'
          ? `नया सिमुलेशन सहेजा गया: ${newSim.title.hi}`
          : `Custom lab ready & saved: ${newSim.title.en}`
      );
    },
    [language, showToast]
  );

  const handleDeleteCustom = useCallback(
    (id: string) => {
      setCustomSimulations((prev) => prev.filter((s) => s.id !== id));
      if (activeSimId === id) {
        setActiveSimId(BUILTIN_SIMULATIONS[0].id);
        setParams(getDefaultParams(BUILTIN_SIMULATIONS[0]));
      }
      showToast(language === 'hi' ? 'कस्टम सिमुलेशन हटाया गया' : 'Custom lab deleted');
    },
    [activeSimId, language, showToast]
  );

  const activeChapter = useMemo(
    () => CHAPTERS.find((c) => c.id === activeSimulation.chapterId),
    [activeSimulation.chapterId]
  );

  const activeChapterSims = useMemo(
    () =>
      activeSimulation.isCustom
        ? []
        : getSimulationsByChapter(activeSimulation.chapterId, BUILTIN_SIMULATIONS),
    [activeSimulation.isCustom, activeSimulation.chapterId]
  );

  const count3DRigs = useMemo(
    () => BUILTIN_SIMULATIONS.filter((s) => s.supports3D).length,
    []
  );

  const handleTogglePresenter = () => {
    setIsPresenterMode((prev) => {
      const next = !prev;
      if (next) {
        setView('simulation');
      } else {
        setIsDrawing(false);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white">
      {/* Strict 3-Zone Top Bar Contract — Pure B&W Projector Contrast */}
      <header className="sticky top-0 z-30 border-b-2 border-black dark:border-white bg-white dark:bg-black no-print">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => {
              setIsPresenterMode(false);
              setView('simulation');
            }}
            className="font-display text-xl font-extrabold tracking-tight text-black dark:text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            PhysicaLive
          </button>

          {/* Zone 2: 5 Clean Single-Line Nav Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-bold"
          >
            {(
              [
                { id: 'simulation', label: UI_TEXT.simulation },
                { id: 'solver', label: UI_TEXT.solver },
                { id: 'airforce', label: UI_TEXT.airforceX },
                { id: 'chapters', label: UI_TEXT.chapters },
                { id: 'practice', label: UI_TEXT.practice },
              ] as const
            ).map((item) => {
              const isActive = view === item.id && !isPresenterMode;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setIsPresenterMode(false);
                    if (item.id === 'practice' && !activeSimulation.isCustom) {
                      setPracticeChapterId(activeSimulation.chapterId);
                    }
                    setView(item.id);
                  }}
                  className={`py-1.5 border-b-[3px] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {getBilingualPrimary(item.label, language)}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary CTA Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleTogglePresenter}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isPresenterMode
                  ? 'bg-white text-black dark:bg-black dark:text-white'
                  : 'bg-black text-white dark:bg-white dark:text-black hover:opacity-85'
              }`}
            >
              {isPresenterMode ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>{getBilingualPrimary(UI_TEXT.exitPresenter, language)}</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>{getBilingualPrimary(UI_TEXT.presenterMode, language)}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Compact Mobile Sub-Nav */}
        {!isPresenterMode && (
          <div className="md:hidden border-t border-black dark:border-white px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto">
            {(
              [
                { id: 'simulation', label: UI_TEXT.simulation },
                { id: 'solver', label: UI_TEXT.solver },
                { id: 'airforce', label: UI_TEXT.airforceX },
                { id: 'chapters', label: UI_TEXT.chapters },
                { id: 'practice', label: UI_TEXT.practice },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'practice' && !activeSimulation.isCustom) {
                    setPracticeChapterId(activeSimulation.chapterId);
                  }
                  setView(item.id);
                }}
                className={`px-3 py-1 text-xs font-bold rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                  view === item.id
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-black dark:text-white'
                }`}
              >
                {getBilingualPrimary(item.label, language)}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {view === 'solver' && !isPresenterMode && (
          <SolverStudioView
            language={language}
            theme={theme}
            onLanguageChange={setLanguage}
            onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            initialTab={solverLaunch.tab}
            initialSimId={solverLaunch.simId}
            initialStageParams={solverLaunch.params}
            launchToken={solverLaunch.token}
            onLaunchSimulation={selectSimulation}
            onOpenCustomGenerator={() => setView('custom')}
            onOpenFormulaSheet={() => setView('sheet')}
          />
        )}

        {view === 'airforce' && !isPresenterMode && (
          <AirforceXHubView
            language={language}
            onLanguageChange={setLanguage}
            theme={theme}
            onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            onLaunchSimulation={selectSimulation}
            onOpenFormulaSheet={() => setView('sheet')}
          />
        )}

        {view === 'chapters' && !isPresenterMode && (
          <ChapterExplorer
            simulations={BUILTIN_SIMULATIONS}
            customSimulations={customSimulations}
            activeSimId={activeSimulation.id}
            language={language}
            onSelectSimulation={selectSimulation}
            onOpenPractice={openPracticeForChapter}
            onDeleteCustom={handleDeleteCustom}
            onOpenCustomGenerator={() => setView('custom')}
            onOpenFormulaSheet={() => setView('sheet')}
          />
        )}

        {view === 'practice' && !isPresenterMode && (
          <PracticeBankView
            initialChapterId={practiceChapterId}
            language={language}
            onLaunchChapterSim={launchChapterSimulation}
            onOpenAirforceHub={() => setView('airforce')}
          />
        )}

        {view === 'custom' && !isPresenterMode && (
          <CustomFormulaLab language={language} onSimulationCreated={handleCustomCreated} />
        )}

        {view === 'sheet' && !isPresenterMode && (
          <FormulaSheetView
            allSimulations={allSimulations}
            language={language}
            onLaunchSimulation={selectSimulation}
          />
        )}

        {(view === 'simulation' || isPresenterMode) && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5 space-y-5">
            {/* Workspace Utility Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-black dark:border-white">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                  <span>
                    {activeSimulation.isCustom
                      ? activeSimulation.chapterName
                        ? getBilingualPrimary(activeSimulation.chapterName, language)
                        : 'Custom AI Lab'
                      : `Chapter ${activeChapter?.number ?? ''} · ${activeChapter?.classLevel ?? ''}`}
                  </span>
                  <span aria-hidden="true">/</span>
                  <span>
                    {activeSimulation.isCustom
                      ? 'Parametric Live Model'
                      : activeChapter
                        ? getBilingualPrimary(activeChapter.name, language)
                        : ''}
                  </span>
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
                  {getBilingualPrimary(activeSimulation.title, language)}
                </h1>
                {getBilingualSecondary(activeSimulation.title, language) && (
                  <p className="text-base font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                    {activeSimulation.title.hi}
                  </p>
                )}
              </div>

              {/* Language & Polarity Controls */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <div
                  className="flex items-center gap-1 p-1 rounded-lg border-2 border-black dark:border-white"
                  role="group"
                  aria-label="Language mode"
                >
                  {(
                    [
                      { id: 'en', label: 'EN' },
                      { id: 'hi', label: 'हिंदी' },
                      { id: 'dual', label: 'EN + हिंदी' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setLanguage(opt.id)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        language === opt.id
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap cursor-pointer"
                  aria-label="Switch between White Board and Black Board projector polarity"
                >
                  <Contrast className="w-4 h-4" />
                  <span>{theme === 'dark' ? 'White Board (B/W)' : 'Black Board (W/B)'}</span>
                </button>
              </div>
            </div>

            {/* 29-Chapter Quick-Switcher (+ Saved Custom AI Labs) */}
            {!isPresenterMode && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 lab-scroll">
                {CHAPTERS.map((ch) => {
                  const chSims = getSimulationsByChapter(ch.id, BUILTIN_SIMULATIONS);
                  const isCurrentChapter = !activeSimulation.isCustom && activeSimulation.chapterId === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => chSims[0] && selectSimulation(chSims[0].id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isCurrentChapter
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-neutral-400 dark:border-neutral-600 bg-white dark:bg-black text-black dark:text-white hover:border-black dark:hover:border-white'
                      }`}
                    >
                      <span className="font-mono mr-1 opacity-75">{ch.number}</span>
                      {getBilingualPrimary(ch.name, language).split('(')[0].trim()}
                      {chSims.length > 1 && (
                        <span className="ml-1 font-mono opacity-75">({chSims.length})</span>
                      )}
                    </button>
                  );
                })}
                {customSimulations.map((sim) => {
                  const active = sim.id === activeSimulation.id;
                  return (
                    <button
                      key={sim.id}
                      type="button"
                      onClick={() => selectSimulation(sim.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-dashed transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                      }`}
                    >
                      AI · {getBilingualPrimary(sim.title, language).split('(')[0].trim()}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Sub-Formula Switcher Tab Strip (Shown whenever active chapter has 2+ formulas!) */}
            {activeChapterSims.length > 1 && (
              <div
                className="flex flex-wrap items-center gap-2 p-2 rounded-xl border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900"
                role="tablist"
                aria-label="Chapter formula tabs"
              >
                <span className="px-2 text-xs font-mono font-extrabold text-neutral-700 dark:text-neutral-300 uppercase">
                  Ch {activeChapter?.number} {language === 'hi' ? 'सूत्र:' : 'Formulas:'}
                </span>
                {activeChapterSims.map((sim) => {
                  const isTabActive = sim.id === activeSimulation.id;
                  return (
                    <button
                      key={sim.id}
                      type="button"
                      role="tab"
                      aria-selected={isTabActive}
                      onClick={() => selectSimulation(sim.id)}
                      className={`px-3.5 py-1.5 text-xs sm:text-sm font-extrabold rounded-lg border-2 transition-colors whitespace-nowrap cursor-pointer ${
                        isTabActive
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-transparent bg-white dark:bg-black text-black dark:text-white hover:border-black dark:hover:border-white'
                      }`}
                    >
                      {getBilingualPrimary(getSimShortTabLabel(sim), language)}
                      {sim.supports3D && (
                        <span className="ml-1.5 font-mono text-[11px] opacity-80">· 3D</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Two-Zone Sandbox Layout (or Full-Width Side-by-Side Compare Mode) */}
            <div
              className={
                isCompareMode
                  ? 'space-y-4'
                  : isPresenterMode
                    ? 'grid grid-cols-1 xl:grid-cols-12 gap-5 items-start'
                    : 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'
              }
            >
              {/* LEFT / MAIN INTERACTIVE STAGE */}
              <div
                className={
                  isCompareMode
                    ? 'space-y-4'
                    : isPresenterMode
                      ? 'xl:col-span-9 space-y-4'
                      : 'lg:col-span-8 space-y-4'
                }
              >
                {/* Extra-Bold Live Substituted Formula Strip */}
                <div className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      {getBilingualPrimary(UI_TEXT.liveFormula, language)}
                    </div>
                    <div className="font-mono text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight mt-0.5">
                      {activeSimulation.formulaDisplay}
                    </div>
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold tabular-nums bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2.5 overflow-x-auto max-w-full">
                    {isCompareMode
                      ? language === 'hi'
                        ? 'तुलना मोड सक्रिय: परिदृश्य A बनाम B'
                        : 'SIDE-BY-SIDE COMPARE ACTIVE (A vs B)'
                      : telemetry?.substitutedFormula ?? activeSimulation.formulaDisplay}
                  </div>
                </div>

                {/* Stage Playback & Teaching Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 transition-opacity whitespace-nowrap cursor-pointer"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>{getBilingualPrimary(UI_TEXT.pause, language)}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>{getBilingualPrimary(UI_TEXT.play, language)}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPlaying(false);
                        setStepToken((s) => s + 1);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                      <span>{getBilingualPrimary(UI_TEXT.step, language)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setResetToken((r) => r + 1)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{getBilingualPrimary(UI_TEXT.reset, language)}</span>
                    </button>

                    <div className="flex items-center gap-1 p-1 rounded-lg border-2 border-black dark:border-white">
                      {[0.25, 0.5, 1, 2].map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          onClick={() => setSimSpeed(spd)}
                          className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                            simSpeed === spd
                              ? 'bg-black text-white dark:bg-white dark:text-black'
                              : 'text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                          }`}
                        >
                          {spd}×
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Overlay Toggles */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCompareMode((prev) => {
                          const next = !prev;
                          if (next) {
                            setUse3D(false);
                            setIsDrawing(false);
                          }
                          return next;
                        });
                      }}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border-2 transition-colors whitespace-nowrap cursor-pointer ${
                        isCompareMode
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                      }`}
                    >
                      <Columns2 className="w-3.5 h-3.5" />
                      <span>
                        {isCompareMode
                          ? getBilingualPrimary(UI_TEXT.exitCompare, language)
                          : getBilingualPrimary(UI_TEXT.compareMode, language)}
                      </span>
                    </button>

                    {activeSimulation.supports3D && !isCompareMode && (
                      <button
                        type="button"
                        onClick={() => setUse3D((v) => !v)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border-2 transition-colors whitespace-nowrap cursor-pointer ${
                          use3D
                            ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                            : 'border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                        }`}
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>
                          {use3D
                            ? getBilingualPrimary(UI_TEXT.view3D, language)
                            : getBilingualPrimary(UI_TEXT.view2D, language)}
                        </span>
                      </button>
                    )}

                    <AudioControlStrip
                      language={language}
                      simId={isCompareMode ? undefined : activeSimulation.id}
                    />

                    <button
                      type="button"
                      onClick={() => setShowVectors((v) => !v)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border-2 transition-colors whitespace-nowrap cursor-pointer ${
                        showVectors
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-neutral-400 dark:border-neutral-600 bg-white dark:bg-black text-black dark:text-white'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{getBilingualPrimary(UI_TEXT.vectors, language)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowGrid((g) => !g)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border-2 transition-colors whitespace-nowrap cursor-pointer ${
                        showGrid
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-neutral-400 dark:border-neutral-600 bg-white dark:bg-black text-black dark:text-white'
                      }`}
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>{getBilingualPrimary(UI_TEXT.grid, language)}</span>
                    </button>

                    {!isCompareMode && (
                      <button
                        type="button"
                        onClick={() => setIsDrawing((d) => !d)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border-2 transition-colors whitespace-nowrap cursor-pointer ${
                          isDrawing
                            ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black underline underline-offset-4'
                            : 'border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                        }`}
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>{getBilingualPrimary(UI_TEXT.draw, language)}</span>
                      </button>
                    )}

                    {!isPresenterMode && (
                      <>
                        <button
                          type="button"
                          onClick={openSolverForActiveSim}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          <span>{getBilingualPrimary(UI_TEXT.openInSolver, language)}</span>
                        </button>
                        <button
                          type="button"
                          onClick={openDerivationForActiveSim}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{getBilingualPrimary(UI_TEXT.fullDerivation, language)}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Monochrome Chalkboard Toolbar */}
                {isDrawing && !isCompareMode && (
                  <ChalkboardToolbar
                    tool={drawTool}
                    tone={drawTone}
                    canUndo={strokes.length > 0}
                    language={language}
                    onSelectTool={setDrawTool}
                    onSelectTone={setDrawTone}
                    onUndo={() => setStrokes((prev) => prev.slice(0, -1))}
                    onClear={() => setStrokes([])}
                    onClose={() => setIsDrawing(false)}
                  />
                )}

                {/* SIDE-BY-SIDE COMPARE STAGE OR SINGLE 2D/3D STAGE */}
                {isCompareMode ? (
                  <CompareStage
                    simulation={activeSimulation}
                    paramsA={params}
                    onParamAChange={handleParamChange}
                    isPlaying={isPlaying}
                    simSpeed={simSpeed}
                    showVectors={showVectors}
                    showGrid={showGrid}
                    theme={theme}
                    language={language}
                    resetToken={resetToken}
                    stepToken={stepToken}
                  />
                ) : (
                  <>
                    {/* 60fps Pure B&W Physics Canvas (2D or Interactive 3D Three.js Stage) + Chalkboard */}
                    {activeSimulation.supports3D && use3D ? (
                      <Simulation3DCanvas
                        simulation={activeSimulation}
                        params={params}
                        isPlaying={isPlaying}
                        simSpeed={simSpeed}
                        showVectors={showVectors}
                        showGrid={showGrid}
                        theme={theme}
                        language={language}
                        resetToken={resetToken}
                        stepToken={stepToken}
                        isDrawing={isDrawing}
                        drawTool={drawTool}
                        drawTone={drawTone}
                        strokes={strokes}
                        onAddStroke={(stroke) => setStrokes((prev) => [...prev, stroke])}
                        onTelemetry={setTelemetry}
                        tall={isPresenterMode}
                      />
                    ) : (
                      <SimulationCanvas
                        simulation={activeSimulation}
                        params={params}
                        isPlaying={isPlaying}
                        simSpeed={simSpeed}
                        showVectors={showVectors}
                        showGrid={showGrid}
                        theme={theme}
                        resetToken={resetToken}
                        stepToken={stepToken}
                        isDrawing={isDrawing}
                        drawTool={drawTool}
                        drawTone={drawTone}
                        strokes={strokes}
                        onAddStroke={(stroke) => setStrokes((prev) => [...prev, stroke])}
                        onTelemetry={setTelemetry}
                        tall={isPresenterMode}
                      />
                    )}

                    {/* High-Contrast B&W Real-Time Graph */}
                    <LiveGraph
                      telemetry={telemetry}
                      title={getBilingualPrimary(activeSimulation.graphTitle, language)}
                      xLabel={activeSimulation.graphXLabel}
                      yLabel={activeSimulation.graphYLabel}
                      theme={theme}
                      compact={isPresenterMode}
                    />
                  </>
                )}
              </div>

              {/* RIGHT CONTROL & CONCEPT DECK */}
              {!isCompareMode && (
                <div className={isPresenterMode ? 'xl:col-span-3' : 'lg:col-span-4'}>
                  <ControlConceptDeck
                    simulation={activeSimulation}
                    params={params}
                    telemetry={telemetry}
                    language={language}
                    theme={theme}
                    activeProofId={activeProofId}
                    onParamChange={handleParamChange}
                    onApplyParams={handleApplyParams}
                    onResetDefaults={handleResetDefaults}
                    onRunProof={handleRunProof}
                    onOpenFullPractice={openPracticeForChapter}
                    onOpenInFullSolver={openSolverForActiveSim}
                    onOpenBoardDerivation={openDerivationForActiveSim}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Quiet Monochrome Footer */}
      {!isPresenterMode && (
        <footer className="border-t-2 border-black dark:border-white py-5 px-4 sm:px-6 mt-8 no-print">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
            <span>
              PhysicaLive · High-Contrast Projector Edition (Class 11–12 Physics)
            </span>
            <span>
              {CHAPTERS.length} Chapters · {BUILTIN_SIMULATIONS.length} Live Labs · {ALL_PRACTICE_QUESTIONS.length} Practice Qs · {AIRFORCE_X_PYQS.length} Airforce X PYQs · {count3DRigs} 3D WebGL
            </span>
          </div>
        </footer>
      )}

      {/* High-Contrast Inverted Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black text-sm font-bold shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
