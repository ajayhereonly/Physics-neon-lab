import React from 'react';
import {
  HelpCircle,
  Loader2,
  Mic,
  Play,
  Sparkles,
  Square,
  TrendingDown,
} from 'lucide-react';
import {
  LanguageMode,
  LiveSimTelemetry,
  NarratorLang,
  NarratorStyle,
  PhysicsSimulation,
  SceneMode,
  SimplicityLevel,
} from '../types/physics';
import { narratorEngine, useNarrator } from '../utils/narratorEngine';
import { getBilingualPrimary, UI_TEXT } from '../utils/bilingual';

interface NarratorBarProps {
  simulation: PhysicsSimulation;
  params: Record<string, number>;
  telemetry: LiveSimTelemetry | null;
  sceneMode: SceneMode;
  language: LanguageMode;
  lastChangedVarKey?: string | null;
  compact?: boolean;
}

const LEVEL_LABELS: Record<SimplicityLevel, { en: string; hi: string }> = {
  1: { en: 'L1 Exam', hi: 'L1 परीक्षा' },
  2: { en: 'L2 Friendly', hi: 'L2 सरल' },
  3: { en: 'L3 Super Simple', hi: 'L3 बहुत आसान' },
};

const STYLE_LABELS: Record<NarratorStyle, { en: string; hi: string }> = {
  'live-slider': { en: 'Live Slider Coach', hi: 'लाइव स्लाइडर कोच' },
  walkthrough: { en: 'Walkthrough', hi: 'संकल्पना पाठ' },
  reallife: { en: 'Real-Life Story', hi: 'दैनिक जीवन कथा' },
};

export const NarratorBar: React.FC<NarratorBarProps> = ({
  simulation,
  params,
  telemetry,
  sceneMode,
  language,
  lastChangedVarKey,
  compact = false,
}) => {
  const nav = useNarrator();

  const hasCaption = Boolean(nav.captionEn || nav.captionHi);
  if (!nav.enabled && !hasCaption && !nav.aiLoading) {
    return null;
  }

  const showBoth = language === 'dual' && nav.captionHi && nav.captionHi !== nav.captionEn;
  const primaryCaption =
    language === 'hi' || nav.voiceLang === 'hi'
      ? nav.captionHi || nav.captionEn
      : nav.captionEn || nav.captionHi;

  return (
    <div className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-3 space-y-2.5">
      {/* Row 1: Controls Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-black dark:text-white mr-1">
            <Mic className="w-3.5 h-3.5" />
            {language === 'hi' ? 'वाचक (Narrator)' : 'Narrator'}
          </span>

          {/* Voice Language Toggle */}
          <div className="inline-flex rounded border-2 border-black dark:border-white overflow-hidden">
            {(['auto', 'en', 'hi'] as NarratorLang[]).map((vl) => (
              <button
                key={vl}
                type="button"
                onClick={() => narratorEngine.setVoiceLang(vl)}
                className={`px-2 py-1 text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  nav.voiceLang === vl
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {vl === 'auto' ? 'Auto' : vl === 'en' ? 'EN' : 'हिंदी'}
              </button>
            ))}
          </div>

          {/* Narration Style */}
          {!compact && (
            <div className="inline-flex rounded border-2 border-black dark:border-white overflow-hidden">
              {(['live-slider', 'walkthrough', 'reallife'] as NarratorStyle[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    narratorEngine.setStyle(st);
                    if (nav.enabled) {
                      narratorEngine.narrateCurrent(simulation, params, telemetry, sceneMode, language, true);
                    }
                  }}
                  className={`px-2 py-1 text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    nav.style === st
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  {getBilingualPrimary(STYLE_LABELS[st], language)}
                </button>
              ))}
            </div>
          )}

          {/* 3-Step Simplicity Selector */}
          <div className="inline-flex rounded border-2 border-black dark:border-white overflow-hidden">
            {([1, 2, 3] as SimplicityLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() =>
                  narratorEngine.setSimplicityLevel(lvl, simulation, params, telemetry, sceneMode, language)
                }
                className={`px-2 py-1 text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  nav.simplicityLevel === lvl
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {getBilingualPrimary(LEVEL_LABELS[lvl], language)}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Explain Simpler, AI Even Simpler, Why Did That Happen, Replay/Stop, Speed */}
        <div className="flex flex-wrap items-center gap-1.5">
          {nav.simplicityLevel < 3 && (
            <button
              type="button"
              onClick={() =>
                narratorEngine.stepSimpler(simulation, params, telemetry, sceneMode, language)
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer whitespace-nowrap"
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>{getBilingualPrimary(UI_TEXT.explainSimpler, language)}</span>
            </button>
          )}

          <button
            type="button"
            disabled={nav.aiLoading}
            onClick={() =>
              narratorEngine.requestAiSimpler(simulation, params, telemetry, sceneMode, language)
            }
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:opacity-85 disabled:opacity-50 transition-opacity cursor-pointer whitespace-nowrap"
          >
            {nav.aiLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{getBilingualPrimary(UI_TEXT.aiSimpler, language)}</span>
          </button>

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
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer whitespace-nowrap"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{getBilingualPrimary(UI_TEXT.whyHappened, language)}</span>
          </button>

          {/* Speech Speed */}
          <div className="inline-flex rounded border-2 border-black dark:border-white overflow-hidden">
            {[0.85, 1, 1.25].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => narratorEngine.setRate(spd)}
                className={`px-1.5 py-1 font-mono text-[10px] font-bold tabular-nums cursor-pointer ${
                  Math.abs(nav.rate - spd) < 0.05
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {spd}×
              </button>
            ))}
          </div>

          {/* Replay / Stop */}
          {nav.speaking ? (
            <button
              type="button"
              onClick={() => narratorEngine.stopSpeaking()}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black cursor-pointer"
            >
              <Square className="w-3 h-3" />
              <span>{language === 'hi' ? 'रोकें' : 'Stop'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                narratorEngine.narrateCurrent(simulation, params, telemetry, sceneMode, language, true)
              }
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>{language === 'hi' ? 'सुनें' : 'Speak'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Live Caption Transcript */}
      {primaryCaption && (
        <div className="pt-2 border-t border-neutral-300 dark:border-neutral-800 text-xs sm:text-sm leading-relaxed text-black dark:text-white">
          {nav.aiAnalogyTag && (
            <span className="font-mono text-[11px] font-bold uppercase mr-2 underline">
              [{nav.aiAnalogyTag}]
            </span>
          )}
          <span className="font-medium">{primaryCaption}</span>
          {showBoth && (
            <p className="mt-1 text-xs text-neutral-700 dark:text-neutral-300">
              {nav.captionHi}
            </p>
          )}
        </div>
      )}

      {!nav.ttsSupported && (
        <p className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
          Browser SpeechSynthesis unavailable — live simplified bilingual captions are active above.
        </p>
      )}
    </div>
  );
};
