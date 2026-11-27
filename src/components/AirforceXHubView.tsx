import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  Clock,
  FileSpreadsheet,
  FileText,
  Layers,
  Moon,
  Printer,
  Radar,
  Sparkles,
  Sun,
  Zap,
} from 'lucide-react';
import {
  AirforceHubTab,
  AirforceMockRecord,
  LanguageMode,
  ThemeMode,
} from '../types/physics';
import { BUILTIN_SIMULATIONS, CHAPTERS } from '../data/simulations';
import {
  AIRFORCE_X_FLASHCARDS,
  AIRFORCE_X_PYQS,
  AIRFORCE_X_SHORTCUTS,
  FlashcardMasteryMap,
  getAirforcePyqsByChapter,
  loadAirforceErrorBook,
  loadAirforceMockHistory,
  loadFlashcardMastery,
  saveAirforceErrorBook,
  saveAirforceMockHistory,
  saveFlashcardMastery,
} from '../data/airforceXBoosters';
import { formatBilingual } from '../utils/bilingual';
import { AirforceCbtMockWorkspace } from './airforce/AirforceCbtMockWorkspace';
import { AirforcePyqExplorerWorkspace } from './airforce/AirforcePyqExplorerWorkspace';
import {
  AirforceFlashcardsWorkspace,
  AirforceShortcutsWorkspace,
} from './airforce/AirforceShortcutsFlashcardsWorkspace';
import { AirforceWeightageErrorBookWorkspace } from './airforce/AirforceWeightageErrorBookWorkspace';
import { AirforcePrintMockWorkspace } from './airforce/AirforcePrintMockWorkspace';

interface AirforceXHubViewProps {
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onLaunchSimulation: (simId: string) => void;
  onOpenFormulaSheet: () => void;
}

const chapterById = new Map(CHAPTERS.map((c) => [c.id, c]));

// Additional high-yield existing labs to showcase alongside the 7 new Airforce X labs
const EXTRA_HIGH_YIELD_X_SIM_IDS = [
  'capillary-rise',
  'stokes-terminal',
  'doppler-effect',
  'nuclei',
  'logic-gates',
  'escape-velocity',
  'carnot-engine',
  'de-broglie',
];

export const AirforceXHubView: React.FC<AirforceXHubViewProps> = ({
  language,
  onLanguageChange,
  theme,
  onToggleTheme,
  onLaunchSimulation,
  onOpenFormulaSheet,
}) => {
  const [activeTab, setActiveTab] = useState<AirforceHubTab>('cbt-mock');
  const [pyqChapterJump, setPyqChapterJump] = useState<string>('all');

  const [errorBookIds, setErrorBookIds] = useState<string[]>(() => loadAirforceErrorBook());
  const [mockHistory, setMockHistory] = useState<AirforceMockRecord[]>(() =>
    loadAirforceMockHistory()
  );
  const [flashcardMastery, setFlashcardMastery] = useState<FlashcardMasteryMap>(() =>
    loadFlashcardMastery()
  );

  const handleAddErrors = (ids: string[]) => {
    setErrorBookIds((prev) => {
      const merged = Array.from(new Set([...ids, ...prev]));
      saveAirforceErrorBook(merged);
      return merged;
    });
  };

  const handleToggleErrorBook = (pyqId: string) => {
    setErrorBookIds((prev) => {
      const exists = prev.includes(pyqId);
      const next = exists ? prev.filter((id) => id !== pyqId) : [pyqId, ...prev];
      saveAirforceErrorBook(next);
      return next;
    });
  };

  const handleRemoveError = (pyqId: string) => {
    setErrorBookIds((prev) => {
      const next = prev.filter((id) => id !== pyqId);
      saveAirforceErrorBook(next);
      return next;
    });
  };

  const handleClearErrorBook = () => {
    saveAirforceErrorBook([]);
    setErrorBookIds([]);
  };

  const handleSaveMockRecord = (record: AirforceMockRecord) => {
    setMockHistory((prev) => {
      const next = [record, ...prev].slice(0, 25);
      saveAirforceMockHistory(next);
      return next;
    });
  };

  const handleClearMockHistory = () => {
    saveAirforceMockHistory([]);
    setMockHistory([]);
  };

  const handleSetFlashcardMastery = (cardId: string, status: 'known' | 'revise') => {
    setFlashcardMastery((prev) => {
      const next = { ...prev, [cardId]: status };
      saveFlashcardMastery(next);
      return next;
    });
  };

  const handleResetFlashcardMastery = () => {
    saveFlashcardMastery({});
    setFlashcardMastery({});
  };

  const handleOpenChapterPyqs = (chapterId: string) => {
    setPyqChapterJump(chapterId);
    setActiveTab('topic-pyq');
  };

  const newAirforceSims = useMemo(
    () => BUILTIN_SIMULATIONS.filter((s) => s.isAirforceX),
    []
  );

  const coreHighYieldSims = useMemo(
    () =>
      EXTRA_HIGH_YIELD_X_SIM_IDS.map((id) =>
        BUILTIN_SIMULATIONS.find((s) => s.id === id)
      ).filter((s): s is NonNullable<typeof s> => !!s),
    []
  );

  const examTabs: Array<{ id: AirforceHubTab; label: string; icon: React.ReactNode }> = [
    {
      id: 'cbt-mock',
      label: language === 'hi' ? '25-Q CBT मॉक (20m)' : '25-Q CBT Mock (20m)',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    {
      id: 'topic-pyq',
      label:
        language === 'hi'
          ? `टॉपिक PYQs (${AIRFORCE_X_PYQS.length})`
          : `Topic-Wise PYQs (${AIRFORCE_X_PYQS.length})`,
      icon: <BookOpenCheck className="w-3.5 h-3.5" />,
    },
    {
      id: 'concepts-labs',
      label: language === 'hi' ? 'X-ग्रुप कॉन्सेप्ट लैब्स' : 'X-Group Concept Labs',
      icon: <Zap className="w-3.5 h-3.5" />,
    },
  ];

  const boosterTabs: Array<{ id: AirforceHubTab; label: string; icon: React.ReactNode }> = [
    {
      id: 'shortcuts',
      label:
        language === 'hi'
          ? `20-सेकंड शॉर्टकट (${AIRFORCE_X_SHORTCUTS.length})`
          : `20-Sec Shortcuts (${AIRFORCE_X_SHORTCUTS.length})`,
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'flashcards',
      label:
        language === 'hi'
          ? `वन-लाइनर कार्ड (${AIRFORCE_X_FLASHCARDS.length})`
          : `One-Liner Flashcards (${AIRFORCE_X_FLASHCARDS.length})`,
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: 'weightage-errors',
      label:
        language === 'hi'
          ? `वेटेज व त्रुटियाँ (${errorBookIds.length})`
          : `Weightage & Error Book (${errorBookIds.length})`,
      icon: <Radar className="w-3.5 h-3.5" />,
    },
    {
      id: 'print-mock',
      label: language === 'hi' ? 'प्रिंट 25-Q + OMR' : 'Printable 25-Q + OMR',
      icon: <Printer className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Studio Header Bar (hidden in print) */}
      <div className="no-print flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 pb-4 border-b-2 border-black dark:border-white">
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
            INDIAN AIR FORCE · AGNIVEER VAYU (GROUP X SCIENCE) · 30 CHAPTERS · {AIRFORCE_X_PYQS.length} PYQS
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            {language === 'hi'
              ? 'एयरफोर्स X ग्रुप फिजिक्स हब'
              : 'Airforce X Group Physics Exam Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-black/75 dark:text-white/75 mt-1">
            {language === 'hi'
              ? '7 नई एयरफोर्स X लैब्स, 124 वर्ष-टैग्ड PYQs, 20-मिनट CBT मॉक (+1/−0.25), 20-सेकंड शॉर्टकट, फ्लैशकार्ड्स व प्रिंटेबल OMR पेपर।'
              : '7 dedicated Airforce X simulations, 124 year-tagged PYQs, 20-min CBT Mock (+1/−0.25), 20-sec shortcuts, flashcards & printable OMR PDF.'}
          </p>
        </div>

        {/* Studio Utility Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenFormulaSheet}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            {language === 'hi' ? 'सूत्र पत्रक' : 'Formula Sheet'}
          </button>

          <div className="inline-flex border-2 border-black dark:border-white">
            {(['en', 'hi', 'dual'] as LanguageMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onLanguageChange(m)}
                className={`px-2.5 py-1.5 text-xs font-bold whitespace-nowrap ${
                  language === m
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-white text-black dark:bg-black dark:text-white'
                }`}
              >
                {m === 'en' ? 'EN' : m === 'hi' ? 'हिंदी' : 'EN+हिं'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 border-black dark:border-white whitespace-nowrap"
            title="Toggle Black/White Board"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            {theme === 'dark' ? 'White Board' : 'Black Board'}
          </button>
        </div>
      </div>

      {/* 2-Group Sub-Navigation Strip (hidden in print) */}
      <div className="no-print grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="border-2 border-black dark:border-white p-3 bg-white dark:bg-black space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
            {language === 'hi' ? '1. परीक्षा अभ्यास और कॉन्सेप्ट लैब्स' : '1. Exam Practice & Concept Labs'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {examTabs.map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-2 transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                      : 'border-black/35 dark:border-white/35 hover:border-black dark:hover:border-white'
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-2 border-black dark:border-white p-3 bg-white dark:bg-black space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
            {language === 'hi' ? '2. स्कोर बूस्टर और प्रिंटेबल OMR' : '2. Score Boosters & Printable OMR'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {boosterTabs.map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-2 transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                      : 'border-black/35 dark:border-white/35 hover:border-black dark:hover:border-white'
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Workspace Renderer */}
      {activeTab === 'cbt-mock' && (
        <AirforceCbtMockWorkspace
          language={language}
          onAddErrors={handleAddErrors}
          onSaveMockRecord={handleSaveMockRecord}
          onLaunchSimulation={onLaunchSimulation}
        />
      )}

      {activeTab === 'topic-pyq' && (
        <AirforcePyqExplorerWorkspace
          key={pyqChapterJump}
          language={language}
          initialChapterId={pyqChapterJump}
          errorBookIds={errorBookIds}
          onToggleErrorBook={handleToggleErrorBook}
          onAddErrors={handleAddErrors}
          onLaunchSimulation={onLaunchSimulation}
        />
      )}

      {activeTab === 'concepts-labs' && (
        <div className="space-y-6">
          {/* 7 Newly Added Airforce X Group Simulations */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
                  DEDICATED AIRFORCE X GROUP MODULES ({newAirforceSims.length} LIVE LABS)
                </div>
                <h2 className="text-lg font-extrabold">
                  {language === 'hi'
                    ? 'विशेष एयरफोर्स X ग्रुप कॉन्सेप्ट सिमुलेशंस'
                    : 'Dedicated Airforce X Group Concept Simulations'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onOpenFormulaSheet}
                className="inline-flex items-center gap-1.5 text-xs font-bold underline underline-offset-4"
              >
                <FileText className="w-3.5 h-3.5" />
                {language === 'hi' ? 'सभी सूत्र देखें' : 'View All Formulas'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newAirforceSims.map((sim) => {
                const ch = chapterById.get(sim.chapterId);
                const pyqCount = getAirforcePyqsByChapter(sim.chapterId).length;
                return (
                  <div
                    key={sim.id}
                    className="border-2 border-black dark:border-white p-4 bg-white dark:bg-black flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono font-bold text-black/65 dark:text-white/65">
                        {ch ? `Ch ${ch.number} · ${ch.classLevel}` : sim.chapterId} · Airforce X · {pyqCount} PYQs
                      </div>
                      <h3 className="text-base font-extrabold leading-snug">
                        {formatBilingual(sim.title, language)}
                      </h3>
                      <div className="p-2.5 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold overflow-x-auto">
                        {sim.formulaDisplay}
                      </div>
                      <p className="text-xs text-black/75 dark:text-white/75 leading-relaxed">
                        {formatBilingual(sim.subtitle, language)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-black/15 dark:border-white/15">
                      <button
                        type="button"
                        onClick={() => onLaunchSimulation(sim.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-extrabold border-2 border-black bg-black text-white hover:bg-black/85 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/85 whitespace-nowrap"
                      >
                        {language === 'hi' ? 'लैब खोलें' : 'Launch Lab'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenChapterPyqs(sim.chapterId)}
                        className="px-3 py-2 text-xs font-bold border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap"
                      >
                        {pyqCount} PYQs
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* High-Yield Core Labs Also Frequently Tested in Airforce X */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
                ESSENTIAL HIGH-YIELD LABS ({coreHighYieldSims.length} CORE MODULES)
              </div>
              <h2 className="text-lg font-extrabold">
                {language === 'hi'
                  ? 'अन्य महत्वपूर्ण एयरफोर्स X परीक्षा लैब्स (केशिकत्व, डॉप्लर, रेडियोधर्मिता, लॉजिक गेट्स)'
                  : 'Additional High-Yield Airforce X Labs (Capillarity, Doppler, Radioactivity, Logic Gates)'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {coreHighYieldSims.map((sim) => {
                const ch = chapterById.get(sim.chapterId);
                const pyqCount = getAirforcePyqsByChapter(sim.chapterId).length;
                return (
                  <div
                    key={sim.id}
                    className="border-2 border-black/80 dark:border-white/80 p-3.5 bg-white dark:bg-black flex flex-col justify-between gap-2.5"
                  >
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono font-bold text-black/65 dark:text-white/65">
                        {ch ? `Ch ${ch.number}` : sim.chapterId} · {pyqCount} PYQs
                      </div>
                      <div className="text-sm font-extrabold leading-snug">
                        {formatBilingual(sim.title, language)}
                      </div>
                      <div className="font-mono text-[11px] text-black/75 dark:text-white/75 truncate">
                        {sim.formulaDisplay}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => onLaunchSimulation(sim.id)}
                        className="flex-1 px-2.5 py-1.5 text-[11px] font-extrabold border border-black bg-black text-white dark:border-white dark:bg-white dark:text-black whitespace-nowrap"
                      >
                        {language === 'hi' ? 'लैब खोलें' : 'Open Lab'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenChapterPyqs(sim.chapterId)}
                        className="px-2.5 py-1.5 text-[11px] font-bold border border-black dark:border-white whitespace-nowrap"
                      >
                        PYQs
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'shortcuts' && (
        <AirforceShortcutsWorkspace
          language={language}
          onLaunchSimulation={onLaunchSimulation}
        />
      )}

      {activeTab === 'flashcards' && (
        <AirforceFlashcardsWorkspace
          language={language}
          masteryMap={flashcardMastery}
          onSetMastery={handleSetFlashcardMastery}
          onResetMastery={handleResetFlashcardMastery}
        />
      )}

      {activeTab === 'weightage-errors' && (
        <AirforceWeightageErrorBookWorkspace
          language={language}
          errorBookIds={errorBookIds}
          mockHistory={mockHistory}
          onRemoveError={handleRemoveError}
          onClearErrorBook={handleClearErrorBook}
          onClearMockHistory={handleClearMockHistory}
          onOpenChapterPyqs={handleOpenChapterPyqs}
          onLaunchSimulation={onLaunchSimulation}
        />
      )}

      {activeTab === 'print-mock' && <AirforcePrintMockWorkspace language={language} />}
    </div>
  );
};
