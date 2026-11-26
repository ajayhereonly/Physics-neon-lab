import { BilingualText, LanguageMode } from '../types/physics';

export function getBilingualPrimary(text: BilingualText, lang: LanguageMode): string {
  if (lang === 'hi') return text.hi;
  return text.en;
}

export function getBilingualSecondary(text: BilingualText, lang: LanguageMode): string | null {
  if (lang === 'dual') return text.hi;
  return null;
}

export const UI_TEXT = {
  chapters: { en: 'Chapters', hi: 'अध्याय' },
  simulation: { en: 'Simulation', hi: 'सिमुलेशन' },
  customFormula: { en: 'Custom Formula', hi: 'कस्टम फ़ॉर्मूला' },
  formulaSheet: { en: 'Formula Sheet', hi: 'फ़ॉर्मूला शीट' },
  presenterMode: { en: 'Presenter Mode', hi: 'प्रेज़ेंटर मोड' },
  exitPresenter: { en: 'Exit Presenter', hi: 'प्रेज़ेंटर बंद करें' },
  play: { en: 'Play', hi: 'चलाएँ' },
  pause: { en: 'Pause', hi: 'रोकें' },
  step: { en: 'Step', hi: 'एक कदम' },
  reset: { en: 'Reset', hi: 'रीसेट' },
  vectors: { en: 'Vectors', hi: 'सदिश (Vectors)' },
  grid: { en: 'Grid', hi: 'ग्रिड' },
  draw: { en: 'Chalkboard', hi: 'चॉकबोर्ड' },
  parameters: { en: 'Controls & Variables', hi: 'नियंत्रण और चर (Variables)' },
  liveOutputs: { en: 'Live Calculated Values', hi: 'लाइव गणना मान' },
  conceptGuide: { en: 'Concept Guide', hi: 'संकल्पना गाइड' },
  whatIfTitle: { en: 'What-If Prompts', hi: 'क्या होगा यदि (What-If)' },
  showHint: { en: 'Show Hint', hi: 'संकेत देखें' },
  hideHint: { en: 'Hide Hint', hi: 'संकेत छुपाएँ' },
  runProof: { en: 'Run Live Proof', hi: 'लाइव प्रमाण चलाएँ' },
  realLifeExample: { en: 'Everyday Example', hi: 'दैनिक जीवन का उदाहरण' },
  presets: { en: 'Quick Scenarios', hi: 'त्वरित परिदृश्य' },
  liveFormula: { en: 'Live Formula Substitution', hi: 'लाइव सूत्र प्रतिस्थापन' },
  searchPlaceholder: {
    en: 'Search formula or chapter (e.g. Gravity, Momentum, Ohm)...',
    hi: 'फ़ॉर्मूला या अध्याय खोजें (जैसे गुरुत्वाकर्षण, संवेग, ओम)...',
  },
};
