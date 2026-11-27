import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Calculator,
  Compass,
  Contrast,
  Cpu,
  FileSpreadsheet,
  FileText,
  Ruler,
  Scale,
  Sparkles,
  Sun,
  Wrench,
} from 'lucide-react';
import {
  LanguageMode,
  SolverStudioGroup,
  SolverStudioTab,
  ThemeMode,
} from '../types/physics';
import { EquationSolverWorkspace } from './solver/EquationSolverWorkspace';
import { DerivationReplayerWorkspace } from './solver/DerivationReplayerWorkspace';
import { DimensionalCheckerWorkspace } from './solver/DimensionalCheckerWorkspace';
import { UnitsConstantsWorkspace } from './solver/UnitsConstantsWorkspace';
import { PracticalLabWorkspace } from './solver/PracticalLabWorkspace';
import { VectorFbdBoardWorkspace } from './solver/VectorFbdBoardWorkspace';
import { OpticsRaySandboxWorkspace } from './solver/OpticsRaySandboxWorkspace';
import { CircuitsLogicWorkspace } from './solver/CircuitsLogicWorkspace';
import { MistakeSpotterWorkspace } from './solver/MistakeSpotterWorkspace';
import { ExamPaperGeneratorWorkspace } from './solver/ExamPaperGeneratorWorkspace';

interface SolverStudioViewProps {
  language: LanguageMode;
  theme: ThemeMode;
  onLanguageChange: (lang: LanguageMode) => void;
  onToggleTheme: () => void;
  initialTab?: SolverStudioTab;
  initialSimId?: string | null;
  initialStageParams?: Record<string, number> | null;
  launchToken?: number;
  onLaunchSimulation: (simId: string) => void;
  onOpenCustomGenerator: () => void;
  onOpenFormulaSheet?: () => void;
}

interface TabDef {
  id: SolverStudioTab;
  group: SolverStudioGroup;
  labelEn: string;
  labelHi: string;
  icon: typeof Calculator;
}

const STUDIO_GROUPS: Array<{
  id: SolverStudioGroup;
  labelEn: string;
  labelHi: string;
}> = [
  { id: 'solve-derive', labelEn: 'Solve & Derive', labelHi: 'हल और व्युत्पत्ति' },
  { id: 'boards', labelEn: 'Interactive Boards', labelHi: 'इंटरैक्टिव बोर्ड व प्रैक्टिकल' },
  { id: 'teaching', labelEn: 'Teaching & Exam Prep', labelHi: 'शिक्षण व परीक्षा तैयारी' },
];

const STUDIO_TABS: TabDef[] = [
  // Group A: Solve & Derive
  { id: 'equation', group: 'solve-derive', labelEn: 'Equation Solver', labelHi: 'समीकरण सॉल्वर', icon: Calculator },
  { id: 'derivations', group: 'solve-derive', labelEn: 'Board Derivations', labelHi: 'बोर्ड व्युत्पत्तियाँ', icon: BookOpen },
  { id: 'dimensions', group: 'solve-derive', labelEn: 'Dimensional Checker', labelHi: 'विमीय विश्लेषण', icon: Scale },
  { id: 'units', group: 'solve-derive', labelEn: 'SI Units & Constants', labelHi: 'SI मात्रक व नियतांक', icon: Ruler },

  // Group B: Interactive Boards & Practicals
  { id: 'practical', group: 'boards', labelEn: 'Practical Lab (Vernier & Screw)', labelHi: 'प्रैक्टिकल लैब (वर्नियर / स्क्रू)', icon: Wrench },
  { id: 'vectors-fbd', group: 'boards', labelEn: 'Vectors & FBD Builder', labelHi: 'सदिश व FBD बोर्ड', icon: Compass },
  { id: 'optics-ray', group: 'boards', labelEn: 'Optics Ray Sandbox', labelHi: 'प्रकाशिकी किरण बोर्ड', icon: Sun },
  { id: 'circuits-logic', group: 'boards', labelEn: 'Logic Gates & Circuits', labelHi: 'लॉजिक गेट व परिपथ', icon: Cpu },

  // Group C: Teaching & Exam Prep
  { id: 'mistakes', group: 'teaching', labelEn: 'Mistake Spotter', labelHi: 'भ्रांति पहचान डेक', icon: AlertTriangle },
  { id: 'exam-paper', group: 'teaching', labelEn: 'Board Exam Paper Generator', labelHi: 'बोर्ड पेपर जनरेटर', icon: FileText },
];

function getGroupForTab(tab: SolverStudioTab): SolverStudioGroup {
  return STUDIO_TABS.find((t) => t.id === tab)?.group ?? 'solve-derive';
}

export function SolverStudioView({
  language,
  theme,
  onLanguageChange,
  onToggleTheme,
  initialTab = 'equation',
  initialSimId = null,
  initialStageParams = null,
  launchToken = 0,
  onLaunchSimulation,
  onOpenCustomGenerator,
  onOpenFormulaSheet,
}: SolverStudioViewProps) {
  const [activeTab, setActiveTab] = useState<SolverStudioTab>(initialTab);
  const [activeGroup, setActiveGroup] = useState<SolverStudioGroup>(() =>
    getGroupForTab(initialTab)
  );
  const [focusedSimId, setFocusedSimId] = useState<string | null>(initialSimId);
  const [focusedStageParams, setFocusedStageParams] = useState<Record<string, number> | null>(
    initialStageParams
  );
  const [injectedConstant, setInjectedConstant] = useState<{
    symbol: string;
    value: number;
  } | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setActiveGroup(getGroupForTab(initialTab));
    if (initialSimId !== undefined) {
      setFocusedSimId(initialSimId);
    }
    if (initialStageParams !== undefined) {
      setFocusedStageParams(initialStageParams);
    }
  }, [initialTab, initialSimId, initialStageParams, launchToken]);

  const handleGroupSelect = (group: SolverStudioGroup) => {
    setActiveGroup(group);
    const firstTab = STUDIO_TABS.find((t) => t.group === group);
    if (firstTab) {
      setActiveTab(firstTab.id);
    }
  };

  const handleOpenDerivationForSim = (simId: string) => {
    setFocusedSimId(simId);
    setActiveGroup('solve-derive');
    setActiveTab('derivations');
  };

  const handleSendConstantToSolver = (symbol: string, value: number) => {
    setInjectedConstant({ symbol, value });
    setActiveGroup('solve-derive');
    setActiveTab('equation');
  };

  const groupTabs = STUDIO_TABS.filter((t) => t.group === activeGroup);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Studio Header Bar (Hidden in Print) */}
      <div className="no-print flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b-2 border-black dark:border-white">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
            {language === 'hi'
              ? 'कक्षा 11–12 भौतिकी सॉल्वर, व्युत्पत्ति और प्रैक्टिकल स्टूडियो'
              : 'Class 11–12 Physics Solver, Derivation & Classroom Practical Studio'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
            {language === 'hi'
              ? 'भौतिकी सॉल्वर और टीचिंग स्टूडियो'
              : 'Physics Solver & Teaching Studio'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onOpenFormulaSheet && (
            <button
              type="button"
              onClick={onOpenFormulaSheet}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सूत्र पत्रक' : 'Formula Sheet'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenCustomGenerator}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 transition-opacity whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === 'hi' ? '+ कस्टम AI फ़ॉर्मूला लैब' : '+ Custom AI Formula Lab'}
            </span>
          </button>

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
                onClick={() => onLanguageChange(opt.id)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
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
            onClick={onToggleTheme}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap cursor-pointer"
          >
            <Contrast className="w-3.5 h-3.5" />
            <span>{theme === 'dark' ? 'White Board' : 'Black Board'}</span>
          </button>
        </div>
      </div>

      {/* Two-Tier Studio Navigation: 3 Groups + Active Group's Sub-Tabs (Hidden in Print) */}
      <div className="no-print space-y-3">
        {/* Level 1: 3 Clean Workspace Groups */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-2"
          role="tablist"
          aria-label="Solver studio workspace groups"
        >
          {STUDIO_GROUPS.map((grp, idx) => {
            const isSelected = activeGroup === grp.id;
            const count = STUDIO_TABS.filter((t) => t.group === grp.id).length;
            return (
              <button
                key={grp.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleGroupSelect(grp.id)}
                className={`px-4 py-3 rounded-xl border-2 text-left transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                    : 'border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                <div>
                  <div className="text-[11px] font-mono font-bold opacity-75">
                    0{idx + 1} · {count} TOOLS
                  </div>
                  <div className="text-sm font-extrabold">
                    {language === 'hi' ? grp.labelHi : grp.labelEn}
                  </div>
                </div>
                {isSelected && (
                  <span className="font-mono text-xs font-extrabold uppercase">ACTIVE</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Level 2: Active Group Sub-Tabs */}
        <div
          className="flex flex-wrap items-center gap-2 p-2 rounded-xl border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900"
          role="tablist"
          aria-label="Workspace tool tabs"
        >
          {groupTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-extrabold rounded-lg border-2 transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                    : 'border-transparent bg-white dark:bg-black text-black dark:text-white hover:border-black dark:hover:border-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{language === 'hi' ? tab.labelHi : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Studio Workspace */}
      <div>
        {activeTab === 'equation' && (
          <EquationSolverWorkspace
            language={language}
            initialSimId={focusedSimId}
            initialStageParams={focusedStageParams}
            injectedConstant={injectedConstant}
            onClearInjectedConstant={() => setInjectedConstant(null)}
            onLaunchSimulation={onLaunchSimulation}
            onOpenDerivation={handleOpenDerivationForSim}
          />
        )}

        {activeTab === 'derivations' && (
          <DerivationReplayerWorkspace
            language={language}
            initialSimId={focusedSimId}
            onLaunchSimulation={onLaunchSimulation}
          />
        )}

        {activeTab === 'dimensions' && (
          <DimensionalCheckerWorkspace language={language} />
        )}

        {activeTab === 'units' && (
          <UnitsConstantsWorkspace
            language={language}
            onSendConstantToSolver={handleSendConstantToSolver}
          />
        )}

        {activeTab === 'practical' && (
          <PracticalLabWorkspace language={language} theme={theme} />
        )}

        {activeTab === 'vectors-fbd' && (
          <VectorFbdBoardWorkspace language={language} theme={theme} />
        )}

        {activeTab === 'optics-ray' && (
          <OpticsRaySandboxWorkspace language={language} theme={theme} />
        )}

        {activeTab === 'circuits-logic' && (
          <CircuitsLogicWorkspace language={language} />
        )}

        {activeTab === 'mistakes' && (
          <MistakeSpotterWorkspace
            language={language}
            onLaunchSimulation={onLaunchSimulation}
          />
        )}

        {activeTab === 'exam-paper' && (
          <ExamPaperGeneratorWorkspace language={language} />
        )}
      </div>
    </div>
  );
}
