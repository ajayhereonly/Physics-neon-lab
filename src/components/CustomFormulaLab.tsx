import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Loader2, Wand2 } from 'lucide-react';
import { LanguageMode, PhysicsSimulation, VisualTemplate } from '../types/physics';
import { evaluateExpression } from '../utils/mathParser';

interface CustomFormulaLabProps {
  language: LanguageMode;
  onSimulationCreated: (sim: PhysicsSimulation) => void;
}

const EXAMPLE_PROMPTS = [
  { label: 'Escape Velocity (v = √(2GM/R))', query: 'Escape Velocity of a planet v = sqrt(2*G*M/R)' },
  { label: 'Centripetal Force (F = mv²/r)', query: 'Centripetal Force F = m*v^2/r in circular motion' },
  { label: 'Ideal Gas Law (PV = nRT)', query: 'Ideal Gas Law P = n*R*T/V with gas molecules' },
  { label: 'Simple Pendulum (T = 2π√(L/g))', query: 'Simple Pendulum Time Period T = 2*pi*sqrt(L/g)' },
  { label: 'Doppler Effect (Sound Frequency)', query: 'Doppler Effect apparent frequency of sound wave' },
  { label: 'Bernoulli Fluid Speed (Venturi)', query: 'Bernoulli equation fluid flow speed and pressure drop in pipe' },
];

export function CustomFormulaLab({ language, onSimulationCreated }: CustomFormulaLabProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (topicText?: string) => {
    const query = (topicText ?? prompt).trim();
    if (!query || isLoading) return;

    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to generate custom physics simulation.');
      }

      const bp = data.blueprint;
      if (!bp || !Array.isArray(bp.variables) || bp.variables.length === 0 || !bp.primaryOutput) {
        throw new Error('Incomplete simulation blueprint returned. Please try rephrasing the formula.');
      }

      const defaultVars: Record<string, number> = {};
      const variables = bp.variables.slice(0, 4).map((v: any) => {
        const min = Number.isFinite(v.min) ? Number(v.min) : 1;
        const max = Number.isFinite(v.max) && Number(v.max) > min ? Number(v.max) : min + 10;
        const step = Number.isFinite(v.step) && Number(v.step) > 0 ? Number(v.step) : (max - min) / 20;
        const def = Number.isFinite(v.defaultValue)
          ? Math.min(max, Math.max(min, Number(v.defaultValue)))
          : (min + max) / 2;
        const key = String(v.key).replace(/[^a-zA-Z0-9_]/g, '') || 'x';
        defaultVars[key] = def;
        return {
          key,
          symbol: String(v.symbol || key),
          label: { en: String(v.labelEn || key), hi: String(v.labelHi || v.labelEn || key) },
          unit: String(v.unit || ''),
          min,
          max,
          step,
          defaultValue: def,
        };
      });

      const testEval = evaluateExpression(String(bp.primaryOutput.expression), defaultVars);
      if (testEval.value === null) {
        throw new Error(
          `Generated formula expression could not be evaluated safely (${testEval.error}). Please try again.`
        );
      }

      const validTemplates: VisualTemplate[] = [
        'orbital',
        'projectile',
        'linear-force',
        'oscillator',
        'wave',
        'field-particles',
        'thermal-gas',
        'fluid-flow',
      ];
      const visualTemplate: VisualTemplate = validTemplates.includes(bp.visualTemplate)
        ? bp.visualTemplate
        : 'linear-force';

      const xVarKey = variables.some((v: any) => v.key === bp.graphXVar)
        ? bp.graphXVar
        : variables[0].key;
      const xVarObj = variables.find((v: any) => v.key === xVarKey) ?? variables[0];

      const sim: PhysicsSimulation = {
        id: `custom_${Date.now()}`,
        chapterId: 'custom',
        chapterName: {
          en: String(bp.chapterEn || 'Custom Topic'),
          hi: String(bp.chapterHi || 'कस्टम अध्याय'),
        },
        isCustom: true,
        title: {
          en: String(bp.titleEn || query),
          hi: String(bp.titleHi || bp.titleEn || query),
        },
        subtitle: {
          en: String(bp.subtitleEn || 'Interactive AI-generated physics simulation'),
          hi: String(bp.subtitleHi || bp.subtitleEn || 'इंटरैक्टिव भौतिकी सिमुलेशन'),
        },
        formulaDisplay: String(bp.formulaDisplay || bp.primaryOutput.expression),
        variables,
        explanation: {
          en: String(bp.explanationEn || ''),
          hi: String(bp.explanationHi || bp.explanationEn || ''),
        },
        realLife: {
          en: String(bp.realLifeEn || ''),
          hi: String(bp.realLifeHi || bp.realLifeEn || ''),
        },
        whatIfPrompts: (bp.whatIfPrompts ?? []).slice(0, 2).map((wp: any, idx: number) => {
          const targetParams: Record<string, number> = { ...defaultVars };
          if (Array.isArray(wp.targetValues)) {
            for (const item of wp.targetValues) {
              const matched = variables.find((v: any) => v.key === item.key);
              if (matched && Number.isFinite(item.value)) {
                targetParams[matched.key] = Math.min(
                  matched.max,
                  Math.max(matched.min, Number(item.value))
                );
              }
            }
          }
          return {
            id: `custom_wp_${Date.now()}_${idx}`,
            question: { en: String(wp.questionEn || ''), hi: String(wp.questionHi || wp.questionEn || '') },
            hint: { en: String(wp.hintEn || ''), hi: String(wp.hintHi || wp.hintEn || '') },
            answer: { en: String(wp.answerEn || ''), hi: String(wp.answerHi || wp.answerEn || '') },
            targetParams,
          };
        }),
        graphTitle: {
          en: `${bp.primaryOutput.labelEn} vs ${xVarObj.label.en}`,
          hi: `${bp.primaryOutput.labelHi} बनाम ${xVarObj.label.hi}`,
        },
        graphXLabel: `${xVarObj.symbol} (${xVarObj.unit})`,
        graphYLabel: `${bp.primaryOutput.symbol} (${bp.primaryOutput.unit})`,
        visualTemplate,
        primaryOutput: {
          symbol: String(bp.primaryOutput.symbol),
          label: { en: String(bp.primaryOutput.labelEn), hi: String(bp.primaryOutput.labelHi) },
          unit: String(bp.primaryOutput.unit || ''),
          expression: String(bp.primaryOutput.expression),
          accent: bp.primaryOutput.accent || 'velocity',
        },
        secondaryOutputs: (bp.secondaryOutputs ?? []).slice(0, 2).map((so: any) => ({
          symbol: String(so.symbol),
          label: { en: String(so.labelEn), hi: String(so.labelHi) },
          unit: String(so.unit || ''),
          expression: String(so.expression),
        })),
        graphXVar: xVarKey,
      };

      onSimulationCreated(sim);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while building the simulation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
          {language === 'hi'
            ? 'AI कस्टम फ़ॉर्मूला सिम्युलेटर'
            : 'AI Custom Formula Simulator'}
        </h1>
        <p className="mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {language === 'hi'
            ? 'भौतिकी का कोई भी अतिरिक्त सूत्र या टॉपिक (English या Hinglish में) लिखें — PhysicaLive तुरंत उसके लिए ब्लैक एंड व्हाइट प्रोजेक्टर सिमुलेशन, स्लाइडर्स और ग्राफ बना देगा।'
            : 'Type any physics formula or chapter topic in English or Hinglish. PhysicaLive synthesizes interactive sliders, high-contrast line-coded vectors, a real-time graph, bilingual explanations, and What-If classroom proofs.'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-6 space-y-4"
      >
        <label
          htmlFor="custom-formula-input"
          className="block text-sm font-bold text-black dark:text-white"
        >
          {language === 'hi' ? 'फ़ॉर्मूला या टॉपिक का नाम लिखें' : 'Enter Physics Formula or Topic'}
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="custom-formula-input"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder={
              language === 'hi'
                ? 'उदाहरण: Escape velocity, Centripetal force, PV = nRT, Doppler effect...'
                : 'e.g., Centripetal Force F = mv²/r, Escape Velocity, Ideal Gas Law, Doppler Effect...'
            }
            className="flex-1 px-4 py-3 text-sm font-medium rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
          <button
            type="submit"
            disabled={isLoading || prompt.trim().length < 2}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 disabled:opacity-40 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'hi' ? 'बनाया जा रहा है...' : 'Building Lab...'}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'लाइव सिमुलेशन बनाएँ' : 'Build Live Simulation'}</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-lg border-2 border-dashed border-black dark:border-white text-sm font-semibold text-black dark:text-white">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </form>

      <section className="space-y-3">
        <h2 className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
          {language === 'hi' ? 'लोकप्रिय अतिरिक्त विषय (एक क्लिक में बनाएँ)' : 'Popular Extra Topics (One-Click Build)'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXAMPLE_PROMPTS.map((ex) => (
            <button
              key={ex.label}
              type="button"
              disabled={isLoading}
              onClick={() => {
                setPrompt(ex.query);
                handleGenerate(ex.query);
              }}
              className="flex items-center justify-between gap-3 p-4 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white text-left transition-colors disabled:opacity-40 cursor-pointer"
            >
              <span className="text-sm font-bold">{ex.label}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
