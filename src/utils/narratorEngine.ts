import { useEffect, useState } from 'react';
import {
  BilingualText,
  LanguageMode,
  LiveSimTelemetry,
  NarratorLang,
  NarratorStyle,
  PhysicsSimulation,
  SceneMode,
  SimplicityLevel,
} from '../types/physics';
import { buildWhyDidThatHappen, getRealLifeScenario } from '../data/realLifeScenarios';

export interface NarratorSnapshot {
  enabled: boolean;
  speaking: boolean;
  ttsSupported: boolean;
  voiceLang: NarratorLang;
  rate: number;
  style: NarratorStyle;
  simplicityLevel: SimplicityLevel;
  aiLoading: boolean;
  aiError: string | null;
  aiAnalogyTag: string | null;
  captionEn: string;
  captionHi: string;
  captionSource: 'concept' | 'slider' | 'why' | 'ai' | 'autofix';
}

const DEFAULT_SNAPSHOT: NarratorSnapshot = {
  enabled: false, // Classroom-safe default: OFF until teacher/student clicks Narrator On
  speaking: false,
  ttsSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  voiceLang: 'auto',
  rate: 1.0,
  style: 'live-slider',
  simplicityLevel: 1,
  aiLoading: false,
  aiError: null,
  aiAnalogyTag: null,
  captionEn: '',
  captionHi: '',
  captionSource: 'concept',
};

class BilingualNarratorEngine {
  private state: NarratorSnapshot = { ...DEFAULT_SNAPSHOT };
  private listeners = new Set<() => void>();
  private debounceTimer: number | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private voicesBound = false;

  private emit() {
    for (const fn of this.listeners) fn();
  }

  public subscribe(fn: () => void) {
    this.listeners.add(fn);
    this.ensureVoicesLoaded();
    return () => {
      this.listeners.delete(fn);
    };
  }

  public getState(): NarratorSnapshot {
    return this.state;
  }

  private patch(partial: Partial<NarratorSnapshot>) {
    this.state = { ...this.state, ...partial };
    this.emit();
  }

  private ensureVoicesLoaded() {
    if (this.voicesBound || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voicesBound = true;
    const load = () => {
      try {
        this.cachedVoices = window.speechSynthesis.getVoices() || [];
      } catch {
        this.cachedVoices = [];
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }

  private resolveTargetLang(appLang: LanguageMode): 'en' | 'hi' {
    if (this.state.voiceLang === 'hi') return 'hi';
    if (this.state.voiceLang === 'en') return 'en';
    return appLang === 'hi' ? 'hi' : 'en';
  }

  private pickBestVoice(lang: 'en' | 'hi'): SpeechSynthesisVoice | null {
    this.ensureVoicesLoaded();
    const voices = this.cachedVoices;
    if (!voices.length) return null;

    if (lang === 'hi') {
      return (
        voices.find((v) => v.lang.toLowerCase() === 'hi-in') ||
        voices.find((v) => v.lang.toLowerCase().startsWith('hi')) ||
        voices.find((v) => v.name.toLowerCase().includes('hindi')) ||
        null
      );
    }

    return (
      voices.find((v) => v.lang.toLowerCase() === 'en-in') ||
      voices.find((v) => v.lang.toLowerCase() === 'en-us' && v.name.toLowerCase().includes('google')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('en-us')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
      null
    );
  }

  private cleanForSpeech(text: string): string {
    return text
      .replace(/²/g, ' squared ')
      .replace(/³/g, ' cubed ')
      .replace(/√/g, ' square root of ')
      .replace(/θ/g, ' theta ')
      .replace(/ω/g, ' omega ')
      .replace(/λ/g, ' lambda ')
      .replace(/Δ/g, ' delta ')
      .replace(/ρ/g, ' rho ')
      .replace(/π/g, ' pi ')
      .replace(/μ/g, ' mu ')
      .replace(/φ/g, ' phi ')
      .replace(/×/g, ' times ')
      .replace(/−/g, ' minus ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  public stopSpeaking() {
    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore browser cancel errors
      }
    }
    if (this.state.speaking) {
      this.patch({ speaking: false });
    }
  }

  public setEnabled(enabled: boolean) {
    if (!enabled) {
      this.stopSpeaking();
    }
    this.patch({ enabled, aiError: null });
  }

  public toggleEnabled(
    sim?: PhysicsSimulation,
    params?: Record<string, number>,
    telemetry?: LiveSimTelemetry | null,
    sceneMode: SceneMode = 'lab',
    appLang: LanguageMode = 'en'
  ) {
    const next = !this.state.enabled;
    this.setEnabled(next);
    if (next && sim && params) {
      this.narrateCurrent(sim, params, telemetry ?? null, sceneMode, appLang);
    }
  }

  public setVoiceLang(voiceLang: NarratorLang) {
    this.patch({ voiceLang });
  }

  public setRate(rate: number) {
    this.patch({ rate: Math.max(0.75, Math.min(1.5, rate)) });
  }

  public setStyle(style: NarratorStyle) {
    this.patch({ style });
  }

  public setSimplicityLevel(
    level: SimplicityLevel,
    sim?: PhysicsSimulation,
    params?: Record<string, number>,
    telemetry?: LiveSimTelemetry | null,
    sceneMode: SceneMode = 'lab',
    appLang: LanguageMode = 'en'
  ) {
    this.patch({ simplicityLevel: level, aiAnalogyTag: null, aiError: null });
    if (sim && params) {
      this.narrateCurrent(sim, params, telemetry ?? null, sceneMode, appLang, true);
    }
  }

  public stepSimpler(
    sim: PhysicsSimulation,
    params: Record<string, number>,
    telemetry: LiveSimTelemetry | null,
    sceneMode: SceneMode,
    appLang: LanguageMode
  ) {
    const nextLevel: SimplicityLevel =
      this.state.simplicityLevel === 1 ? 2 : this.state.simplicityLevel === 2 ? 3 : 3;
    this.patch({ simplicityLevel: nextLevel, aiAnalogyTag: null, aiError: null });
    this.narrateCurrent(sim, params, telemetry, sceneMode, appLang, true);
  }

  public speakBilingual(
    text: BilingualText,
    appLang: LanguageMode,
    source: NarratorSnapshot['captionSource'],
    forceSpeak = false
  ) {
    this.patch({
      captionEn: text.en,
      captionHi: text.hi,
      captionSource: source,
      aiError: null,
    });

    if (!this.state.enabled && !forceSpeak) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const targetLang = this.resolveTargetLang(appLang);
    const spokenRaw = targetLang === 'hi' ? text.hi || text.en : text.en;
    const spoken = targetLang === 'hi' ? spokenRaw : this.cleanForSpeech(spokenRaw);
    if (!spoken) return;

    this.stopSpeaking();
    try {
      const utter = new SpeechSynthesisUtterance(spoken);
      const voice = this.pickBestVoice(targetLang);
      if (voice) utter.voice = voice;
      utter.lang = targetLang === 'hi' ? 'hi-IN' : 'en-IN';
      utter.rate = this.state.rate;
      utter.pitch = 1.0;
      utter.onstart = () => this.patch({ speaking: true });
      utter.onend = () => this.patch({ speaking: false });
      utter.onerror = () => this.patch({ speaking: false });
      window.speechSynthesis.speak(utter);
    } catch {
      this.patch({ speaking: false });
    }
  }

  public narrateCurrent(
    sim: PhysicsSimulation,
    params: Record<string, number>,
    telemetry: LiveSimTelemetry | null,
    sceneMode: SceneMode,
    appLang: LanguageMode,
    forceSpeak = false
  ) {
    const scenario = getRealLifeScenario(sim);
    let text: BilingualText;

    if (this.state.style === 'reallife' || sceneMode === 'reallife') {
      const levelText = scenario.levels[this.state.simplicityLevel];
      text =
        this.state.simplicityLevel === 3
          ? levelText
          : {
              en: `${scenario.realLifeStory.en} ${levelText.en}`,
              hi: `${scenario.realLifeStory.hi} ${levelText.hi}`,
            };
    } else if (this.state.style === 'walkthrough') {
      const levelText = scenario.levels[this.state.simplicityLevel];
      const primary = telemetry?.readouts?.[0];
      text = {
        en: `${sim.title.en}. ${levelText.en}${primary ? ` Right now, ${primary.label.en} is ${primary.value} ${primary.unit}.` : ''}`,
        hi: `${sim.title.hi}। ${levelText.hi}${primary ? ` अभी ${primary.label.hi} का मान ${primary.value} ${primary.unit} है।` : ''}`,
      };
    } else {
      text = scenario.levels[this.state.simplicityLevel];
    }

    this.speakBilingual(text, appLang, 'concept', forceSpeak);
  }

  public narrateSliderChange(
    sim: PhysicsSimulation,
    changedKey: string,
    newValue: number,
    params: Record<string, number>,
    telemetry: LiveSimTelemetry | null,
    sceneMode: SceneMode,
    appLang: LanguageMode
  ) {
    if (!this.state.enabled || this.state.style !== 'live-slider') return;

    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      const vDef = sim.variables.find((v) => v.key === changedKey);
      const primary = telemetry?.readouts?.[0];
      const scenario = getRealLifeScenario(sim);

      if (this.state.simplicityLevel === 3) {
        const why = buildWhyDidThatHappen(sim, params, telemetry, sceneMode, changedKey);
        this.speakBilingual(why, appLang, 'slider');
        return;
      }

      const enText = vDef
        ? `${vDef.label.en} is now ${newValue} ${vDef.unit}. ${
            primary
              ? `${primary.label.en} updates to ${primary.value} ${primary.unit}.`
              : scenario.levels[this.state.simplicityLevel].en
          }`
        : scenario.levels[this.state.simplicityLevel].en;

      const hiText = vDef
        ? `${vDef.label.hi} अब ${newValue} ${vDef.unit} है। ${
            primary
              ? `${primary.label.hi} बदलकर ${primary.value} ${primary.unit} हो गया।`
              : scenario.levels[this.state.simplicityLevel].hi
          }`
        : scenario.levels[this.state.simplicityLevel].hi;

      this.speakBilingual({ en: enText, hi: hiText }, appLang, 'slider');
    }, 520);
  }

  public narrateWhyDidThatHappen(
    sim: PhysicsSimulation,
    params: Record<string, number>,
    telemetry: LiveSimTelemetry | null,
    sceneMode: SceneMode,
    appLang: LanguageMode,
    lastChangedVarKey?: string | null
  ) {
    const why = buildWhyDidThatHappen(sim, params, telemetry, sceneMode, lastChangedVarKey);
    // Ensure narrator turns on when user explicitly clicks "Why Did That Happen?" if they want audio, or always updates captions & speaks if enabled
    this.speakBilingual(why, appLang, 'why', this.state.enabled);
  }

  public async requestAiSimpler(
    sim: PhysicsSimulation,
    params: Record<string, number>,
    telemetry: LiveSimTelemetry | null,
    sceneMode: SceneMode,
    appLang: LanguageMode
  ) {
    this.patch({ aiLoading: true, aiError: null });
    const paramsSummary = sim.variables
      .map((v) => `${v.label.en} (${v.symbol}) = ${params[v.key] ?? v.defaultValue} ${v.unit}`)
      .join(', ');
    try {
      const res = await fetch('/api/narrate-simpler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simTitle: sim.title.en,
          formula: sim.formulaDisplay,
          telemetryFormula: telemetry?.substitutedFormula || sim.formulaDisplay,
          paramsSummary,
          sceneMode,
          currentLevel: this.state.simplicityLevel,
          previousText: this.state.captionEn,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.narration) {
        throw new Error(data?.error || 'Could not generate simpler explanation right now.');
      }
      const { explanationEn, explanationHi, analogyTag } = data.narration;
      this.patch({
        aiLoading: false,
        simplicityLevel: 3,
        aiAnalogyTag: analogyTag || 'Everyday Analogy',
      });
      this.speakBilingual(
        { en: explanationEn, hi: explanationHi || explanationEn },
        appLang,
        'ai',
        true
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI simplifier unavailable.';
      // Graceful offline fallback to Level 3 super-simple built-in analogy
      const fallback = getRealLifeScenario(sim).levels[3];
      this.patch({
        aiLoading: false,
        simplicityLevel: 3,
        aiAnalogyTag: 'Built-In Simple Analogy',
        aiError: msg,
      });
      this.speakBilingual(fallback, appLang, 'concept', this.state.enabled);
    }
  }
}

export const narratorEngine = new BilingualNarratorEngine();

export function useNarrator(): NarratorSnapshot {
  const [snap, setSnap] = useState<NarratorSnapshot>(() => narratorEngine.getState());
  useEffect(() => {
    return narratorEngine.subscribe(() => setSnap(narratorEngine.getState()));
  }, []);
  return snap;
}
