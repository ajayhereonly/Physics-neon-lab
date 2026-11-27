export interface BilingualText {
  en: string;
  hi: string;
}

export type LanguageMode = 'en' | 'hi' | 'dual';
export type ThemeMode = 'dark' | 'light';
export type AppView = 'simulation' | 'chapters' | 'practice' | 'custom' | 'sheet';

export type AccentKind = 'force' | 'velocity' | 'momentum' | 'energy';

export type QuestionDifficulty = 'Board' | 'Concept' | 'JEE/NEET';

export interface PracticeQuestion {
  id: string;
  chapterId: string;
  difficulty: QuestionDifficulty;
  question: BilingualText;
  options: BilingualText[];
  correctIndex: number;
  hint: BilingualText;
  solution: BilingualText;
}

export type VisualTemplate =
  | 'orbital'
  | 'projectile'
  | 'linear-force'
  | 'oscillator'
  | 'wave'
  | 'field-particles'
  | 'thermal-gas'
  | 'fluid-flow';

export interface ChapterInfo {
  id: string;
  number: string;
  classLevel: 'Class 11' | 'Class 12';
  name: BilingualText;
  summary: BilingualText;
}

export interface SimVariable {
  key: string;
  symbol: string;
  label: BilingualText;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface SimPreset {
  id: string;
  label: BilingualText;
  params: Record<string, number>;
}

export interface WhatIfPrompt {
  id: string;
  question: BilingualText;
  hint: BilingualText;
  answer: BilingualText;
  targetParams: Record<string, number>;
}

export interface ComputedReadout {
  symbol: string;
  label: BilingualText;
  value: string;
  unit: string;
  accent?: AccentKind;
}

export interface SecondaryFormulaItem {
  label: BilingualText;
  formula: string;
}

export interface CustomOutputSpec {
  symbol: string;
  label: BilingualText;
  unit: string;
  expression: string;
  accent?: AccentKind;
}

export interface PhysicsSimulation {
  id: string;
  chapterId: string;
  chapterName?: BilingualText;
  shortTabLabel?: BilingualText;
  isCustom?: boolean;
  supports3D?: boolean;
  default3D?: boolean;
  title: BilingualText;
  subtitle: BilingualText;
  formulaDisplay: string;
  secondaryFormulas?: SecondaryFormulaItem[];
  variables: SimVariable[];
  presets?: SimPreset[];
  comparePresetB?: {
    label: BilingualText;
    params: Record<string, number>;
  };
  explanation: BilingualText;
  realLife: BilingualText;
  whatIfPrompts: WhatIfPrompt[];
  graphTitle: BilingualText;
  graphXLabel: string;
  graphYLabel: string;
  // Custom AI fields
  visualTemplate?: VisualTemplate;
  primaryOutput?: CustomOutputSpec;
  secondaryOutputs?: CustomOutputSpec[];
  graphXVar?: string;
}

export interface DerivationStep {
  title: BilingualText;
  equation: string;
  note: BilingualText;
}

export interface SolverInputField {
  key: string;
  symbol: string;
  label: BilingualText;
  unit: string;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface VariableSolverSpec {
  id: string;
  targetSymbol: string;
  targetLabel: BilingualText;
  unit: string;
  rearrangedFormula: string;
  inputs: SolverInputField[];
  solve: (vals: Record<string, number>) =>
    | { value: number; substituted: string }
    | { error: string };
}

export interface FormulaDerivationSpec {
  simId?: string;
  steps: DerivationStep[];
  solvers: VariableSolverSpec[];
}

export type DrawingTool = 'pen' | 'arrow' | 'dashed-arrow' | 'highlighter' | 'eraser';
export type ChalkTone = 'primary' | 'bold' | 'muted';

export interface ChalkPoint {
  x: number;
  y: number;
}

export interface ChalkStroke {
  id: string;
  tool: DrawingTool;
  tone: ChalkTone;
  width: number;
  points: ChalkPoint[];
}

export interface LiveSimTelemetry {
  substitutedFormula: string;
  readouts: ComputedReadout[];
  graphPoints: { x: number; y: number }[];
  graphSecondPoints?: { x: number; y: number }[];
  graphCurrentPoint?: { x: number; y: number };
  graphLegend?: { primary: string; secondary?: string };
  graphXRange?: [number, number];
  graphYRange?: [number, number];
}
