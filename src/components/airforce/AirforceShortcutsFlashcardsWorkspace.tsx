import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Layers,
  List,
  RotateCcw,
  Search,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import { AirforceFlashcard, AirforceShortcut, LanguageMode } from '../../types/physics';
import {
  AIRFORCE_X_FLASHCARDS,
  AIRFORCE_X_SHORTCUTS,
  FlashcardMasteryMap,
} from '../../data/airforceXBoosters';
import { CHAPTERS } from '../../data/simulations';
import { formatBilingual } from '../../utils/bilingual';
import { playExamCue } from '../../utils/physicsAudio';

const chapterById = new Map(CHAPTERS.map((c) => [c.id, c]));

// ============================================================================
// 1. 20-SECOND SHORTCUT TRICKS & RATIO CHEAT DECK (30 CARDS)
// ============================================================================
interface AirforceShortcutsWorkspaceProps {
  language: LanguageMode;
  onLaunchSimulation: (simId: string) => void;
}

const SHORTCUT_CATEGORIES: Array<'All' | AirforceShortcut['category']> = [
  'All',
  'Mechanics',
  'Thermal & Waves',
  'Electricity & Magnetism',
  'Optics & Modern',
];

export const AirforceShortcutsWorkspace: React.FC<AirforceShortcutsWorkspaceProps> = ({
  language,
  onLaunchSimulation,
}) => {
  const [category, setCategory] = useState<'All' | AirforceShortcut['category']>('All');
  const [query, setQuery] = useState<string>('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return AIRFORCE_X_SHORTCUTS.filter((sc) => {
      if (category !== 'All' && sc.category !== category) return false;
      if (!needle) return true;
      const hay = `${sc.title.en} ${sc.title.hi} ${sc.formulaTrick} ${sc.whenToUse.en} ${sc.workedExample.en}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [category, query]);

  return (
    <div className="space-y-5">
      {/* Header & Filter Bar */}
      <div className="border-2 border-black dark:border-white p-4 bg-white dark:bg-black space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
              SPEED MASTERY · 48 SECONDS / QUESTION BUDGET
            </div>
            <h2 className="text-lg font-extrabold mt-0.5">
              {language === 'hi'
                ? '30 प्रमुख 20-सेकंड शॉर्टकट ट्रिक्स और अनुपात डेक'
                : '30 High-Yield 20-Second Shortcut Tricks & Ratio Cheat Deck'}
            </h2>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'hi' ? 'ट्रिक खोजें (उदा. Carnot, n²)...' : 'Search trick (Carnot, n², β)...'}
              className="w-full h-9 pl-8 pr-3 text-xs font-medium border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {SHORTCUT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold border-2 whitespace-nowrap ${
                category === cat
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                  : 'border-black/35 dark:border-white/35 hover:border-black dark:hover:border-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Shortcut Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((sc, idx) => {
          const ch = chapterById.get(sc.chapterId);
          return (
            <div
              key={sc.id}
              className="border-2 border-black dark:border-white p-4 sm:p-5 bg-white dark:bg-black flex flex-col justify-between gap-3.5"
            >
              <div className="space-y-3">
                <div className="text-[11px] font-mono font-bold text-black/65 dark:text-white/65">
                  TRICK #{String(idx + 1).padStart(2, '0')} · {sc.category} ·{' '}
                  {ch ? `Ch ${ch.number}` : sc.chapterId}
                </div>

                <h3 className="text-base font-extrabold leading-snug">
                  {formatBilingual(sc.title, language)}
                </h3>

                {/* High-Contrast Monochrome Formula Box */}
                <div className="p-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs sm:text-sm font-extrabold tracking-tight overflow-x-auto">
                  {sc.formulaTrick}
                </div>

                <div className="text-xs text-black/80 dark:text-white/80 leading-relaxed">
                  <strong className="font-mono uppercase mr-1">
                    {language === 'hi' ? 'कब लगाएँ:' : 'When to use:'}
                  </strong>
                  {formatBilingual(sc.whenToUse, language)}
                </div>

                <div className="border-t border-black/15 dark:border-white/15 pt-2.5 text-xs leading-relaxed">
                  <strong className="font-mono uppercase mr-1">
                    {language === 'hi' ? '10-सेकंड उदाहरण:' : 'Worked Example:'}
                  </strong>
                  {formatBilingual(sc.workedExample, language)}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => onLaunchSimulation(sc.simId)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'लाइव लैब में सत्यापित करें' : 'Verify in Live Lab'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 2. HIGH-YIELD ONE-LINER RAPID REVISION FLASHCARDS (40 CARDS)
// ============================================================================
interface AirforceFlashcardsWorkspaceProps {
  language: LanguageMode;
  masteryMap: FlashcardMasteryMap;
  onSetMastery: (cardId: string, status: 'known' | 'revise') => void;
  onResetMastery: () => void;
}

const FLASHCARD_CATEGORIES: Array<'All' | AirforceFlashcard['category']> = [
  'All',
  'Units & Dimensions',
  'Mechanics',
  'Thermal & Waves',
  'Electricity & Magnetism',
  'Optics & Modern',
];

export const AirforceFlashcardsWorkspace: React.FC<AirforceFlashcardsWorkspaceProps> = ({
  language,
  masteryMap,
  onSetMastery,
  onResetMastery,
}) => {
  const [category, setCategory] = useState<'All' | AirforceFlashcard['category']>('All');
  const [onlyRevise, setOnlyRevise] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'deck' | 'list'>('deck');
  const [orderSeed, setOrderSeed] = useState<number>(0);
  const [cardIdx, setCardIdx] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);

  const cards = useMemo(() => {
    const base = AIRFORCE_X_FLASHCARDS.filter((fc) => {
      if (category !== 'All' && fc.category !== category) return false;
      if (onlyRevise && masteryMap[fc.id] === 'known') return false;
      return true;
    });
    if (orderSeed === 0) return base;
    // Deterministic shuffle from orderSeed
    const copy = [...base];
    let s = orderSeed;
    for (let i = copy.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) >>> 0;
      const j = s % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [category, masteryMap, onlyRevise, orderSeed]);

  const safeIdx = cards.length > 0 ? Math.min(cardIdx, cards.length - 1) : 0;
  const activeCard = cards[safeIdx];

  const knownCount = useMemo(
    () => AIRFORCE_X_FLASHCARDS.filter((c) => masteryMap[c.id] === 'known').length,
    [masteryMap]
  );
  const reviseCount = useMemo(
    () => AIRFORCE_X_FLASHCARDS.filter((c) => masteryMap[c.id] === 'revise').length,
    [masteryMap]
  );

  const goNext = () => {
    if (cards.length === 0) return;
    setFlipped(false);
    setCardIdx((prev) => (prev + 1) % cards.length);
  };

  const goPrev = () => {
    if (cards.length === 0) return;
    setFlipped(false);
    setCardIdx((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const markCard = (status: 'known' | 'revise') => {
    if (!activeCard) return;
    onSetMastery(activeCard.id, status);
    setFlipped(false);
    if (safeIdx < cards.length - 1) {
      setCardIdx(safeIdx + 1);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Progress & Controls */}
      <div className="border-2 border-black dark:border-white p-4 bg-white dark:bg-black space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
              RAPID MEMORY DRILL · {knownCount}/{AIRFORCE_X_FLASHCARDS.length} KNOWN · {reviseCount} REVISE
            </div>
            <h2 className="text-lg font-extrabold mt-0.5">
              {language === 'hi'
                ? '40 उच्च-अंक वन-लाइनर त्वरित रिवीजन फ्लैशकार्ड्स'
                : '40 High-Yield One-Liner Rapid Revision Flashcards'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'deck' ? 'list' : 'deck')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 border-black dark:border-white whitespace-nowrap"
            >
              {viewMode === 'deck' ? <List className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
              {viewMode === 'deck'
                ? language === 'hi'
                  ? 'सभी सूची देखें'
                  : 'List View'
                : language === 'hi'
                  ? 'फ्लिप कार्ड मोड'
                  : 'Flip Deck Mode'}
            </button>
            <button
              type="button"
              onClick={() => {
                setOrderSeed((s) => s + 17);
                setCardIdx(0);
                setFlipped(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 border-black dark:border-white whitespace-nowrap"
            >
              <Shuffle className="w-3.5 h-3.5" />
              {language === 'hi' ? 'शफल' : 'Shuffle'}
            </button>
            <button
              type="button"
              onClick={onResetMastery}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 border-black/40 dark:border-white/40 hover:border-black dark:hover:border-white whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {language === 'hi' ? 'रीसेट' : 'Reset'}
            </button>
          </div>
        </div>

        {/* Category Filter + Unmastered Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {FLASHCARD_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setCardIdx(0);
                  setFlipped(false);
                }}
                className={`px-2.5 py-1 text-xs font-bold border-2 whitespace-nowrap ${
                  category === cat
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                    : 'border-black/35 dark:border-white/35'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setOnlyRevise((v) => !v);
              setCardIdx(0);
              setFlipped(false);
            }}
            className={`px-3 py-1 text-xs font-bold border-2 whitespace-nowrap ${
              onlyRevise
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                : 'border-black/40 dark:border-white/40'
            }`}
          >
            {onlyRevise
              ? language === 'hi'
                ? '✓ केवल अपूर्ण कार्ड'
                : '✓ Unmastered Only'
              : language === 'hi'
                ? 'केवल अपूर्ण फ़िल्टर करें'
                : 'Filter Unmastered Only'}
          </button>
        </div>
      </div>

      {/* Empty State */}
      {cards.length === 0 ? (
        <div className="border-2 border-black dark:border-white p-10 text-center space-y-3 bg-white dark:bg-black">
          <CheckCircle2 className="w-8 h-8 mx-auto" />
          <div className="text-base font-extrabold">
            {language === 'hi'
              ? 'बधाई! इस श्रेणी के सभी फ्लैशकार्ड्स तैयार हो गए हैं।'
              : 'All flashcards in this filter are marked Known!'}
          </div>
          <button
            type="button"
            onClick={() => setOnlyRevise(false)}
            className="px-4 py-2 text-xs font-bold border-2 border-black dark:border-white"
          >
            {language === 'hi' ? 'सभी कार्ड फिर से देखें' : 'Show All Cards'}
          </button>
        </div>
      ) : viewMode === 'deck' && activeCard ? (
        /* Interactive Tap-to-Flip Deck */
        <div className="max-w-3xl mx-auto space-y-4">
          <button
            type="button"
            onClick={() => {
              playExamCue('flip');
              setFlipped((f) => !f);
            }}
            className={`w-full min-h-[260px] p-6 sm:p-8 border-2 border-black dark:border-white text-left flex flex-col justify-between transition-colors ${
              flipped
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-white text-black dark:bg-black dark:text-white'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono font-bold uppercase tracking-wider opacity-75">
              <span>
                CARD {safeIdx + 1} / {cards.length} · {activeCard.category}
              </span>
              <span>
                {flipped
                  ? language === 'hi'
                    ? 'उत्तर (वापस पलटने हेतु क्लिक करें)'
                    : 'ANSWER (CLICK TO FLIP BACK)'
                  : language === 'hi'
                    ? 'प्रश्न (उत्तर देखने हेतु क्लिक करें)'
                    : 'PROMPT (CLICK TO REVEAL)'}
              </span>
            </div>

            <div className="py-6 text-lg sm:text-2xl font-extrabold leading-snug">
              {flipped
                ? formatBilingual(activeCard.answer, language)
                : formatBilingual(activeCard.prompt, language)}
            </div>

            <div className="flex items-center justify-between text-xs font-mono opacity-75">
              <span>
                {masteryMap[activeCard.id] === 'known'
                  ? 'STATUS: ✓ KNOWN'
                  : masteryMap[activeCard.id] === 'revise'
                    ? 'STATUS: ↻ REVISE AGAIN'
                    : 'STATUS: UNREVIEWED'}
              </span>
              <span>
                {flipped
                  ? language === 'hi'
                    ? 'नीचे से स्थिति चुनें'
                    : 'Mark status below'
                  : language === 'hi'
                    ? 'टैप करके उत्तर पलटें'
                    : 'Tap card to flip'}
              </span>
            </div>
          </button>

          {/* Navigation & Mastery Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-2 border-black dark:border-white whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {language === 'hi' ? 'पिछला' : 'Prev'}
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-2 border-black dark:border-white whitespace-nowrap"
              >
                {language === 'hi' ? 'अगला' : 'Next'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => markCard('revise')}
                className="px-4 py-2 text-xs font-extrabold border-2 border-dashed border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap"
              >
                ↻ {language === 'hi' ? 'फिर दोहराएँ (Revise)' : 'Revise Again'}
              </button>
              <button
                type="button"
                onClick={() => markCard('known')}
                className="px-4 py-2 text-xs font-extrabold border-2 border-black bg-black text-white hover:bg-black/85 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/85 whitespace-nowrap"
              >
                ✓ {language === 'hi' ? 'याद हो गया (Know It)' : 'Know It'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Rapid Revision Sheet / List Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cards.map((fc, idx) => {
            const st = masteryMap[fc.id];
            return (
              <div
                key={fc.id}
                className="border-2 border-black dark:border-white p-4 bg-white dark:bg-black space-y-2"
              >
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-black/65 dark:text-white/65">
                  <span>
                    #{String(idx + 1).padStart(2, '0')} · {fc.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSetMastery(fc.id, st === 'known' ? 'revise' : 'known')}
                    className={`px-2 py-0.5 border font-bold ${
                      st === 'known'
                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                        : 'border-black/40 dark:border-white/40'
                    }`}
                  >
                    {st === 'known' ? '✓ Known' : '↻ Revise'}
                  </button>
                </div>
                <div className="text-sm font-bold">{formatBilingual(fc.prompt, language)}</div>
                <div className="text-xs font-semibold pt-2 border-t border-black/15 dark:border-white/15">
                  → {formatBilingual(fc.answer, language)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
