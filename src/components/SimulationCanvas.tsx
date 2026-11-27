import { useEffect, useRef } from 'react';
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
import { resetBuiltinState, stepAndRenderBuiltinSim } from '../engines/builtinEngines';
import { stepAndRenderCustomSim } from '../engines/customParametricEngine';
import { drawRealLife2DOverlay } from '../engines/realLife2dOverlay';
import { ChalkboardOverlay } from './ChalkboardOverlay';
import { stopPhysicsAudio, syncPhysicsAudioFrame } from '../utils/physicsAudio';

interface SimulationCanvasProps {
  simulation: PhysicsSimulation;
  params: Record<string, number>;
  isPlaying: boolean;
  simSpeed: number;
  showVectors: boolean;
  showGrid: boolean;
  theme: ThemeMode;
  language?: LanguageMode;
  sceneMode?: SceneMode;
  resetToken: number;
  stepToken: number;
  isDrawing: boolean;
  drawTool: DrawingTool;
  drawTone: ChalkTone;
  strokes: ChalkStroke[];
  onAddStroke: (stroke: ChalkStroke) => void;
  onTelemetry: (t: LiveSimTelemetry) => void;
  tall?: boolean;
  fillHeight?: boolean;
}

export function SimulationCanvas({
  simulation,
  params,
  isPlaying,
  simSpeed,
  showVectors,
  showGrid,
  theme,
  language = 'en',
  sceneMode = 'lab',
  resetToken,
  stepToken,
  isDrawing,
  drawTool,
  drawTone,
  strokes,
  onAddStroke,
  onTelemetry,
  tall = false,
  fillHeight = false,
}: SimulationCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<Record<string, any>>({});
  const simTimeRef = useRef(0);
  const sizeRef = useRef<{ width: number; height: number }>({ width: 720, height: 420 });

  const propsRef = useRef({
    simulation,
    params,
    isPlaying,
    simSpeed,
    showVectors,
    showGrid,
    theme,
    language,
    sceneMode,
    onTelemetry,
  });
  propsRef.current = {
    simulation,
    params,
    isPlaying,
    simSpeed,
    showVectors,
    showGrid,
    theme,
    language,
    sceneMode,
    onTelemetry,
  };

  useEffect(() => {
    resetBuiltinState(stateRef.current);
    simTimeRef.current = 0;
    stopPhysicsAudio();
  }, [simulation.id, resetToken]);

  useEffect(() => {
    if (stepToken === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = sizeRef.current;
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const p = propsRef.current;
    const telemetry = p.simulation.isCustom
      ? stepAndRenderCustomSim({
          ctx,
          width,
          height,
          sim: p.simulation,
          params: p.params,
          dt: (1 / 30) * p.simSpeed,
          isPlaying: true,
          showVectors: p.showVectors,
          showGrid: p.showGrid,
          theme: p.theme,
          state: stateRef.current,
        })
      : stepAndRenderBuiltinSim({
          ctx,
          width,
          height,
          simId: p.simulation.id,
          params: p.params,
          dt: (1 / 30) * p.simSpeed,
          isPlaying: true,
          showVectors: p.showVectors,
          showGrid: p.showGrid,
          theme: p.theme,
          state: stateRef.current,
        });
    ctx.restore();
    p.onTelemetry(telemetry);
  }, [stepToken]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = window.devicePixelRatio || 1;
      sizeRef.current = { width: rect.width, height: rect.height };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [tall]);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    let lastTelemetryEmit = 0;

    const loop = (now: number) => {
      const rawDt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const { width, height } = sizeRef.current;
          const dpr = window.devicePixelRatio || 1;
          ctx.save();
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          const p = propsRef.current;
          const dt = p.isPlaying ? rawDt * p.simSpeed : 0;
          simTimeRef.current += dt;

          const telemetry = p.simulation.isCustom
            ? stepAndRenderCustomSim({
                ctx,
                width,
                height,
                sim: p.simulation,
                params: p.params,
                dt,
                isPlaying: p.isPlaying,
                showVectors: p.showVectors,
                showGrid: p.showGrid,
                theme: p.theme,
                state: stateRef.current,
              })
            : stepAndRenderBuiltinSim({
                ctx,
                width,
                height,
                simId: p.simulation.id,
                params: p.params,
                dt,
                isPlaying: p.isPlaying,
                showVectors: p.showVectors,
                showGrid: p.showGrid,
                theme: p.theme,
                state: stateRef.current,
              });
          if (p.sceneMode === 'reallife') {
            drawRealLife2DOverlay(
              ctx,
              width,
              height,
              p.simulation,
              p.params,
              telemetry,
              simTimeRef.current,
              p.theme,
              p.language
            );
          }
          ctx.restore();

          if (!p.simulation.isCustom) {
            syncPhysicsAudioFrame(
              p.simulation.id,
              simTimeRef.current,
              dt,
              p.params,
              p.isPlaying,
              p.simSpeed
            );
          } else {
            stopPhysicsAudio();
          }

          if (now - lastTelemetryEmit >= 65) {
            lastTelemetryEmit = now;
            p.onTelemetry(telemetry);
          }
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      stopPhysicsAudio();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden border-2 border-black dark:border-white bg-white dark:bg-black ${
        fillHeight
          ? 'h-full rounded-none border-0'
          : tall
            ? 'rounded-xl h-[54vh] min-h-[400px] max-h-[660px]'
            : 'rounded-xl h-[390px] lg:h-[440px]'
      }`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      <ChalkboardOverlay
        active={isDrawing}
        tool={drawTool}
        tone={drawTone}
        theme={theme}
        strokes={strokes}
        onAddStroke={onAddStroke}
      />
    </div>
  );
}
