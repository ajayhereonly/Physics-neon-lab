import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Compass,
  Grid3X3,
  HelpCircle,
  Minimize2,
  Pause,
  PenTool,
  Play,
  RotateCcw,
  SlidersHorizontal,
  StepForward,
  Trash2,
  Undo2,
  X,
} from 'lucide-react';
import {
  ChalkStroke,
  ChalkTone,
  DrawingTool,
  LanguageMode,
  LiveSimTelemetry,
  PhysicsSimulation,
  SceneMode,
  ThemeMode,
} from '../types/physics';
import { SimulationCanvas } from './SimulationCanvas';
import { Simulation3DCanvas } from './Simulation3DCanvas';
import { AudioControlStrip } from './AudioControlStrip';
import { NarratorBar } from './NarratorBar';
import { getBilingualPrimary, UI_TEXT } from '../utils/bilingual';
import { narratorEngine } from '../utils/narratorEngine';

interface FullScreenExperimentModalProps {
  open: boolean;
  onClose: () => void;
  simulation: PhysicsSimulation;
  params: Record<string, number>;
  telemetry: LiveSimTelemetry | null;
  onParamChange: (key: string, value: number) => void;
  onApplyPreset: (presetParams: Record<string, number>) => void;
  onResetDefaults: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onResetSim: () => void;
  simSpeed: number;
  onSpeedChange: (spd: number) => void;
  is3DView: boolean;
  onToggle3D: (use3D: boolean) => void;
  sceneMode: SceneMode;
  onSceneModeChange: (mode: SceneMode) => void;
  showVectors: boolean;
  onToggleVectors: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  isDrawing: boolean;
  onToggleDrawing: () => void;
  drawTool: DrawingTool;
  onDrawToolChange: (tool: DrawingTool) => void;
  drawTone: ChalkTone;
  onDrawToneChange: (tone: ChalkTone) => void;
  strokes: ChalkStroke[];
  onAddStroke: (stroke: ChalkStroke) => void;
  onUndoStroke: () => void;
  onClearStrokes: () => void;
  resetToken: number;
  stepToken: number;
  theme: ThemeMode;
  language: LanguageMode;
  onTelemetry: (t: LiveSimTelemetry) => void;
  lastChangedVarKey?: string | null;
}

export const FullScreenExperimentModal: React.FC<FullScreenExperimentModalProps> = ({
  open,
  onClose,
  simulation,
  params,
  telemetry,
  onParamChange,
  onApplyPreset,
  onResetDefaults,
  isPlaying,
  onTogglePlay,
  onStep,
  onResetSim,
  simSpeed,
  onSpeedChange,
  is3DView,
  onToggle3D,
  sceneMode,
  onSceneModeChange,
  showVectors,
  onToggleVectors,
  showGrid,
  onToggleGrid,
  isDrawing,
  onToggleDrawing,
  drawTool,
  onDrawToolChange,
  drawTone,
  onDrawToneChange,
  strokes,
  onAddStroke,
  onUndoStroke,
  onClearStrokes,
  resetToken,
  stepToken,
  theme,
  language,
  onTelemetry,
  lastChangedVarKey,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [dockOpen, setDockOpen] = useState(true);

  useEffect(() => {
    if (!open) return;

    // Request native browser fullscreen cleanly; gracefully fallback to fixed inset-0 inside iframes
    const el = rootRef.current;
    if (el && el.requestFullscreen) {
      el.requestFullscreen().catch(() => {
        // Fallback already active via fixed inset-0
      });
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleToggleNarrator = () => {
    narratorEngine.toggleEnabled(simulation, params, telemetry, sceneMode, language);
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-black text-black dark:text-white"
    >
      {/* Top Compact Playback & Toggle Bar */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b-2 border-black dark:border-white bg-white dark:bg-black">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-extrabold text-sm tracking-tight mr-2 max-w-[200px] sm:max-w-[260px] truncate">
            {getBilingualPrimary(simulation.title, language)}
          </span>

          <button
            type="button"
            onClick={onTogglePlay}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black cursor-pointer whitespace-nowrap"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? getBilingualPrimary(UI_TEXT.pause, language) : getBilingualPrimary(UI_TEXT.play, language)}</span>
          </button>

          <button
            type="button"
            onClick={onStep}
            title={getBilingualPrimary(UI_TEXT.step, language)}
            className="p-1.5 rounded-lg border-2 border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
          >
            <StepForward className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onResetSim}
            title={getBilingualPrimary(UI_TEXT.reset, language)}
            className="p-1.5 rounded-lg border-2 border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed */}
          <div className="inline-flex rounded-lg border-2 border-black dark:border-white overflow-hidden">
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => onSpeedChange(spd)}
                className={`px-2 py-1 font-mono text-[11px] font-bold cursor-pointer ${
                  simSpeed === spd
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {spd}×
              </button>
            ))}
          </div>

          {/* 2D | 3D */}
          <div className="inline-flex rounded-lg border-2 border-black dark:border-white overflow-hidden">
            <button
              type="button"
              onClick={() => onToggle3D(false)}
              className={`px-2.5 py-1 text-xs font-bold cursor-pointer ${
                !is3DView ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              2D
            </button>
            <button
              type="button"
              onClick={() => onToggle3D(true)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold cursor-pointer ${
                is3DView ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Box className="w-3 h-3" />
              3D
            </button>
          </div>

          {/* Lab View | Real-Life Example */}
          <div className="inline-flex rounded-lg border-2 border-black dark:border-white overflow-hidden">
            <button
              type="button"
              onClick={() => onSceneModeChange('lab')}
              className={`px-2.5 py-1 text-xs font-bold cursor-pointer whitespace-nowrap ${
                sceneMode === 'lab'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              {getBilingualPrimary(UI_TEXT.labView, language)}
            </button>
            <button
              type="button"
              onClick={() => onSceneModeChange('reallife')}
              className={`px-2.5 py-1 text-xs font-bold cursor-pointer whitespace-nowrap ${
                sceneMode === 'reallife'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              {getBilingualPrimary(UI_TEXT.realLifeView, language)}
            </button>
          </div>
        </div>

        {/* Right Controls: Vectors, Grid, Chalkboard, Audio+Narrator, Why?, Dock Toggle, Exit */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleVectors}
            title={getBilingualPrimary(UI_TEXT.vectors, language)}
            className={`p-1.5 rounded-lg border-2 border-black dark:border-white cursor-pointer ${
              showVectors ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggleGrid}
            title={getBilingualPrimary(UI_TEXT.grid, language)}
            className={`p-1.5 rounded-lg border-2 border-black dark:border-white cursor-pointer ${
              showGrid ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggleDrawing}
            title={getBilingualPrimary(UI_TEXT.draw, language)}
            className={`p-1.5 rounded-lg border-2 border-black dark:border-white cursor-pointer ${
              isDrawing ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
          </button>

          <AudioControlStrip
            language={language}
            simId={simulation.id}
            compact
            showNarrator
            onToggleNarrator={handleToggleNarrator}
          />

          <button
            type="button"
            onClick={() =>
              narratorEngine.narrateWhyDidThatHappen(
                simulation,
                params,
                telemetry,
                sceneMode,
                language,
                lastChangedVarKey
              )
            }
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer whitespace-nowrap"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{language === 'hi' ? 'क्यों?' : 'Why?'}</span>
          </button>

          <button
            type="button"
            onClick={() => setDockOpen((v) => !v)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white cursor-pointer whitespace-nowrap ${
              dockOpen ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{getBilingualPrimary(UI_TEXT.controlsDock, language)}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer whitespace-nowrap"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>{getBilingualPrimary(UI_TEXT.exitFullScreen, language)}</span>
          </button>
        </div>
      </div>

      {/* Main Full-Screen Stage + Collapsible Floating Right Side Dock */}
      <div className="relative flex-1 min-h-0 flex overflow-hidden">
        <div className="flex-1 min-w-0 h-full relative">
          {is3DView ? (
            <Simulation3DCanvas
              simulation={simulation}
              params={params}
              isPlaying={isPlaying}
              simSpeed={simSpeed}
              showVectors={showVectors}
              showGrid={showGrid}
              theme={theme}
              language={language}
              sceneMode={sceneMode}
              resetToken={resetToken}
              stepToken={stepToken}
              isDrawing={isDrawing}
              drawTool={drawTool}
              drawTone={drawTone}
              strokes={strokes}
              onAddStroke={onAddStroke}
              onTelemetry={onTelemetry}
              fillHeight
            />
          ) : (
            <SimulationCanvas
              simulation={simulation}
              params={params}
              isPlaying={isPlaying}
              simSpeed={simSpeed}
              showVectors={showVectors}
              showGrid={showGrid}
              theme={theme}
              language={language}
              sceneMode={sceneMode}
              resetToken={resetToken}
              stepToken={stepToken}
              isDrawing={isDrawing}
              drawTool={drawTool}
              drawTone={drawTone}
              strokes={strokes}
              onAddStroke={onAddStroke}
              onTelemetry={onTelemetry}
              fillHeight
            />
          )}
        </div>

        {/* Collapsible Solid Pure B&W Right Side Dock (No backdrop-filter over WebGL) */}
        {dockOpen && (
          <aside className="w-[330px] sm:w-[360px] max-w-[85vw] shrink-0 h-full overflow-y-auto border-l-2 border-black dark:border-white bg-white dark:bg-black p-3.5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-neutral-300 dark:border-neutral-800 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider">
                {getBilingualPrimary(UI_TEXT.parameters, language)}
              </span>
              <button
                type="button"
                onClick={() => setDockOpen(false)}
                aria-label="Hide Controls Dock"
                className="p-1 rounded border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Live Substituted Formula */}
            <div className="p-2.5 rounded-lg border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-950">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                {getBilingualPrimary(UI_TEXT.liveFormula, language)}
              </div>
              <div className="mt-1 font-mono text-xs font-bold break-words">
                {telemetry?.substitutedFormula || simulation.formulaDisplay}
              </div>
            </div>

            {/* Live Telemetry Readouts */}
            {telemetry && telemetry.readouts.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {telemetry.readouts.map((r, i) => (
                  <div
                    key={`${r.symbol}-${i}`}
                    className="p-2 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black"
                  >
                    <div className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 truncate">
                      {getBilingualPrimary(r.label, language)}
                    </div>
                    <div className="font-mono text-sm font-extrabold tabular-nums">
                      {r.value}{' '}
                      <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                        {r.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Variable Sliders */}
            <div className="space-y-3">
              {simulation.variables.map((v) => {
                const val = params[v.key] ?? v.defaultValue;
                return (
                  <div key={v.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold">
                        {getBilingualPrimary(v.label, language)}{' '}
                        <span className="font-mono text-neutral-600 dark:text-neutral-400">({v.symbol})</span>
                      </span>
                      <span className="font-mono font-extrabold tabular-nums">
                        {val} {v.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={v.min}
                      max={v.max}
                      step={v.step}
                      value={val}
                      onChange={(e) => onParamChange(v.key, Number(e.target.value))}
                      className="w-full accent-black dark:accent-white cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            {/* Presets & Reset Defaults */}
            <div className="space-y-2 pt-2 border-t border-neutral-300 dark:border-neutral-800">
              {simulation.presets && simulation.presets.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {simulation.presets.map((pr) => (
                    <button
                      key={pr.id}
                      type="button"
                      onClick={() => onApplyPreset(pr.params)}
                      className="px-2 py-1 text-[11px] font-bold rounded border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
                    >
                      {getBilingualPrimary(pr.label, language)}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={onResetDefaults}
                className="w-full py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'डिफ़ॉल्ट मान रीसेट करें' : 'Reset Default Values'}
              </button>
            </div>

            {/* Chalkboard Tools inside Dock when active */}
            {isDrawing && (
              <div className="p-2.5 rounded-lg border-2 border-black dark:border-white space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider">
                  {getBilingualPrimary(UI_TEXT.draw, language)}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(['pen', 'arrow', 'dashed-arrow', 'highlighter', 'eraser'] as DrawingTool[]).map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => onDrawToolChange(tool)}
                      className={`px-2 py-1 text-[10px] font-bold uppercase rounded border border-black dark:border-white cursor-pointer ${
                        drawTool === tool
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  {(['primary', 'bold', 'muted'] as ChalkTone[]).map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => onDrawToneChange(tone)}
                      className={`px-2 py-1 text-[10px] font-bold uppercase rounded border border-black dark:border-white cursor-pointer ${
                        drawTone === tone
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : ''
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={onUndoStroke}
                    className="ml-auto p-1 rounded border border-black dark:border-white cursor-pointer"
                    title="Undo"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onClearStrokes}
                    className="p-1 rounded border border-black dark:border-white cursor-pointer"
                    title="Clear"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Compact Narrator & Simplifier inside Full-Screen Dock */}
            <NarratorBar
              simulation={simulation}
              params={params}
              telemetry={telemetry}
              sceneMode={sceneMode}
              language={language}
              lastChangedVarKey={lastChangedVarKey}
              compact
            />
          </aside>
        )}
      </div>
    </div>
  );
};
