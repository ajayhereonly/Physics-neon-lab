import { useCallback, useEffect, useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import {
  LanguageMode,
  LiveSimTelemetry,
  PhysicsSimulation,
  ThemeMode,
} from '../types/physics';
import { getComparePresetB } from '../data/simulations';
import { getBilingualPrimary } from '../utils/bilingual';
import { SimulationCanvas } from './SimulationCanvas';

interface CompareStageProps {
  simulation: PhysicsSimulation;
  paramsA: Record<string, number>;
  onParamAChange: (key: string, value: number) => void;
  isPlaying: boolean;
  simSpeed: number;
  showVectors: boolean;
  showGrid: boolean;
  theme: ThemeMode;
  language: LanguageMode;
  resetToken: number;
  stepToken: number;
}

const EMPTY_STROKES: never[] = [];
const NOOP_STROKE = () => {};

function parseNumericReadout(val: string): number | null {
  const cleaned = val.replace(/,/g, '').trim();
  if (!/^[+-]?\d+(\.\d+)?$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function CompareStage({
  simulation,
  paramsA,
  onParamAChange,
  isPlaying,
  simSpeed,
  showVectors,
  showGrid,
  theme,
  language,
  resetToken,
  stepToken,
}: CompareStageProps) {
  const [paramsB, setParamsB] = useState<Record<string, number>>(
    () => getComparePresetB(simulation).params
  );
  const [telemetryA, setTelemetryA] = useState<LiveSimTelemetry | null>(null);
  const [telemetryB, setTelemetryB] = useState<LiveSimTelemetry | null>(null);
  const [localReset, setLocalReset] = useState(0);

  const presetB = getComparePresetB(simulation);

  useEffect(() => {
    setParamsB(getComparePresetB(simulation).params);
    setTelemetryA(null);
    setTelemetryB(null);
    setLocalReset((n) => n + 1);
  }, [simulation.id]);

  const handleParamBChange = useCallback((key: string, value: number) => {
    setParamsB((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCopyAToB = () => {
    setParamsB({ ...paramsA });
    setLocalReset((n) => n + 1);
  };

  const handleResetB = () => {
    setParamsB({ ...presetB.params });
    setLocalReset((n) => n + 1);
  };

  const fillHex = theme === 'dark' ? '#FFFFFF' : '#000000';
  const emptyHex = theme === 'dark' ? '#262626' : '#E5E5E5';
  const combinedReset = resetToken + localReset;

  return (
    <div className="space-y-5">
      {/* Side-by-Side Dual Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SCENARIO A */}
        <div className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b-2 border-black dark:border-white flex items-center justify-between gap-2 bg-black text-white dark:bg-white dark:text-black">
            <span className="font-mono text-xs sm:text-sm font-extrabold uppercase tracking-wide">
              {language === 'hi' ? 'परिदृश्य A (मुख्य)' : 'SCENARIO A (PRIMARY)'}
            </span>
            <span className="font-mono text-xs font-bold truncate opacity-90">
              {telemetryA?.readouts[0]
                ? `${telemetryA.readouts[0].symbol} = ${telemetryA.readouts[0].value} ${telemetryA.readouts[0].unit}`
                : 'LIVE'}
            </span>
          </div>

          <SimulationCanvas
            simulation={simulation}
            params={paramsA}
            isPlaying={isPlaying}
            simSpeed={simSpeed}
            showVectors={showVectors}
            showGrid={showGrid}
            theme={theme}
            resetToken={combinedReset}
            stepToken={stepToken}
            isDrawing={false}
            drawTool="pen"
            drawTone="primary"
            strokes={EMPTY_STROKES}
            onAddStroke={NOOP_STROKE}
            onTelemetry={setTelemetryA}
          />

          {/* Compact Sliders for A */}
          <div className="p-4 border-t-2 border-black dark:border-white space-y-3">
            {simulation.variables.map((v) => {
              const cur = paramsA[v.key] ?? v.defaultValue;
              const pct = v.max === v.min ? 50 : ((cur - v.min) / (v.max - v.min)) * 100;
              return (
                <div key={v.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-black dark:text-white truncate">
                      <span className="font-mono underline mr-1.5">{v.symbol}</span>
                      {getBilingualPrimary(v.label, language)}
                    </span>
                    <span className="font-mono tabular-nums px-1.5 py-0.5 rounded bg-black text-white dark:bg-white dark:text-black">
                      {cur} {v.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={v.min}
                    max={v.max}
                    step={v.step}
                    value={cur}
                    onChange={(e) => onParamAChange(v.key, Number(e.target.value))}
                    className="physics-slider"
                    style={{
                      background: `linear-gradient(to right, ${fillHex} ${pct}%, ${emptyHex} ${pct}%)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* SCENARIO B */}
        <div className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b-2 border-black dark:border-white flex items-center justify-between gap-2 bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white">
            <span className="font-mono text-xs sm:text-sm font-extrabold uppercase tracking-wide truncate">
              {language === 'hi' ? 'परिदृश्य B' : 'SCENARIO B'} · {getBilingualPrimary(presetB.label, language)}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyAToB}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap cursor-pointer"
                title="Copy Scenario A parameters to B"
              >
                <Copy className="w-3 h-3" />
                <span>A → B</span>
              </button>
              <button
                type="button"
                onClick={handleResetB}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap cursor-pointer"
                title="Reset Scenario B to contrast preset"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          <SimulationCanvas
            simulation={simulation}
            params={paramsB}
            isPlaying={isPlaying}
            simSpeed={simSpeed}
            showVectors={showVectors}
            showGrid={showGrid}
            theme={theme}
            resetToken={combinedReset}
            stepToken={stepToken}
            isDrawing={false}
            drawTool="pen"
            drawTone="primary"
            strokes={EMPTY_STROKES}
            onAddStroke={NOOP_STROKE}
            onTelemetry={setTelemetryB}
          />

          {/* Compact Sliders for B */}
          <div className="p-4 border-t-2 border-black dark:border-white space-y-3">
            {simulation.variables.map((v) => {
              const cur = paramsB[v.key] ?? v.defaultValue;
              const pct = v.max === v.min ? 50 : ((cur - v.min) / (v.max - v.min)) * 100;
              const differs = Math.abs((paramsA[v.key] ?? v.defaultValue) - cur) > 1e-6;
              return (
                <div key={v.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-black dark:text-white truncate">
                      <span className="font-mono underline mr-1.5">{v.symbol}</span>
                      {getBilingualPrimary(v.label, language)}
                      {differs && (
                        <span className="ml-1.5 font-mono text-[11px] underline">
                          ({language === 'hi' ? 'भिन्न' : 'CHANGED'})
                        </span>
                      )}
                    </span>
                    <span className="font-mono tabular-nums px-1.5 py-0.5 rounded border-2 border-black dark:border-white text-black dark:text-white">
                      {cur} {v.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={v.min}
                    max={v.max}
                    step={v.step}
                    value={cur}
                    onChange={(e) => handleParamBChange(v.key, Number(e.target.value))}
                    className="physics-slider"
                    style={{
                      background: `linear-gradient(to right, ${fillHex} ${pct}%, ${emptyHex} ${pct}%)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* LIVE DELTA COMPARISON STRIP */}
      {telemetryA && telemetryB && telemetryA.readouts.length > 0 && (
        <section className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b-2 border-black dark:border-white">
            <h3 className="text-sm sm:text-base font-extrabold text-black dark:text-white uppercase tracking-wide font-mono">
              {language === 'hi'
                ? 'तुलनात्मक अंतर सारणी (Scenario A बनाम Scenario B)'
                : 'Live Delta Comparison Strip (Scenario A vs Scenario B)'}
            </h3>
            <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
              Δ = B − A  ·  Ratio = B / A
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {telemetryA.readouts.map((rA, idx) => {
              const rB = telemetryB.readouts[idx];
              if (!rB) return null;
              const numA = parseNumericReadout(rA.value);
              const numB = parseNumericReadout(rB.value);
              const diff = numA !== null && numB !== null ? numB - numA : null;
              const ratio =
                numA !== null && numB !== null && Math.abs(numA) > 1e-6 ? numB / numA : null;

              return (
                <div
                  key={`${rA.symbol}-${idx}`}
                  className="p-3.5 rounded-lg border-2 border-black dark:border-white space-y-2"
                >
                  <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300 truncate">
                    <span className="font-mono font-extrabold text-black dark:text-white mr-1.5">
                      {rA.symbol}
                    </span>
                    {getBilingualPrimary(rA.label, language)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm font-extrabold tabular-nums">
                    <div className="p-1.5 rounded bg-black text-white dark:bg-white dark:text-black">
                      <div className="text-[10px] opacity-75">A</div>
                      <div className="truncate">
                        {rA.value} <span className="text-[10px] font-semibold">{rA.unit}</span>
                      </div>
                    </div>
                    <div className="p-1.5 rounded border-2 border-black dark:border-white text-black dark:text-white">
                      <div className="text-[10px] opacity-75">B</div>
                      <div className="truncate">
                        {rB.value} <span className="text-[10px] font-semibold">{rB.unit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between font-mono text-xs font-bold text-black dark:text-white">
                    <span>
                      {diff !== null
                        ? `Δ ${diff >= 0 ? '+' : ''}${Math.abs(diff) >= 100 ? diff.toFixed(1) : diff.toFixed(2)}`
                        : rA.value === rB.value
                          ? 'SAME'
                          : 'DIFF'}
                    </span>
                    {ratio !== null && (
                      <span className="underline underline-offset-2">
                        {ratio.toFixed(2)}×
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
