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
  solver: { en: 'Solver', hi: 'सॉल्वर व टूल्स' },
  practice: { en: 'Practice', hi: 'अभ्यास प्रश्न' },
  customFormula: { en: 'Custom AI Lab', hi: 'कस्टम AI लैब' },
  formulaSheet: { en: 'Formula Sheet', hi: 'फ़ॉर्मूला शीट' },
  openInSolver: { en: 'Open in Solver', hi: 'सॉल्वर में खोलें' },
  fullDerivation: { en: 'Board Derivation', hi: 'बोर्ड व्युत्पत्ति' },
  presenterMode: { en: 'Presenter Mode', hi: 'प्रेज़ेंटर मोड' },
  exitPresenter: { en: 'Exit Presenter', hi: 'प्रेज़ेंटर बंद करें' },
  play: { en: 'Play', hi: 'चलाएँ' },
  pause: { en: 'Pause', hi: 'रोकें' },
  step: { en: 'Step', hi: 'एक कदम' },
  reset: { en: 'Reset', hi: 'रीसेट' },
  vectors: { en: 'Vectors', hi: 'सदिश (Vectors)' },
  grid: { en: 'Grid', hi: 'ग्रिड' },
  draw: { en: 'Chalkboard', hi: 'चॉकबोर्ड' },
  view3D: { en: '3D Stage', hi: '3D दृश्य' },
  view2D: { en: '2D Diagram', hi: '2D आरेख' },
  resetCamera: { en: 'Reset Camera', hi: 'कैमरा रीसेट' },
  parameters: { en: 'Controls & Variables', hi: 'नियंत्रण और चर (Variables)' },
  liveOutputs: { en: 'Live Calculated Values', hi: 'लाइव गणना मान' },
  conceptGuide: { en: 'Concept Guide', hi: 'संकल्पना गाइड' },
  whatIfTitle: { en: 'What-If', hi: 'क्या होगा यदि' },
  deriveSolveTab: { en: 'Derive & Solve', hi: 'व्युत्पत्ति व हल' },
  practiceTab: { en: 'Practice (12)', hi: 'अभ्यास (12)' },
  compareMode: { en: 'Compare A | B', hi: 'तुलना A | B' },
  exitCompare: { en: 'Exit Compare', hi: 'तुलना बंद करें' },
  studyBank: { en: 'Study Bank', hi: 'अभ्यास बैंक' },
  classroomQuiz: { en: 'Classroom Quiz Mode', hi: 'क्लासरूम क्विज़ मोड' },
  printWorksheet: { en: 'Print Worksheet / PDF', hi: 'वर्कशीट प्रिंट / PDF' },
  printFormulaSheet: { en: 'Print Formula Sheet / PDF', hi: 'फ़ॉर्मूला शीट प्रिंट / PDF' },
  showHint: { en: 'Show Hint', hi: 'संकेत देखें' },
  hideHint: { en: 'Hide Hint', hi: 'संकेत छुपाएँ' },
  showSolution: { en: 'Step-by-Step Solution', hi: 'विस्तृत हल देखें' },
  runProof: { en: 'Run Live Proof', hi: 'लाइव प्रमाण चलाएँ' },
  realLifeExample: { en: 'Everyday Example', hi: 'दैनिक जीवन का उदाहरण' },
  presets: { en: 'Quick Scenarios', hi: 'त्वरित परिदृश्य' },
  liveFormula: { en: 'Live Formula Substitution', hi: 'लाइव सूत्र प्रतिस्थापन' },
  searchPlaceholder: {
    en: 'Search formula or chapter (e.g. Escape Velocity, Carnot, Doppler, Logic Gates)...',
    hi: 'फ़ॉर्मूला या अध्याय खोजें (जैसे पलायन वेग, कार्नोट, डॉपलर, लॉजिक गेट)...',
  },
};
