import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Search, Trash2 } from 'lucide-react';
import { CHAPTERS } from '../data/simulations';
import { getQuestionsByChapter } from '../data/questionBank';
import { LanguageMode, PhysicsSimulation } from '../types/physics';
import { getBilingualPrimary, getBilingualSecondary, UI_TEXT } from '../utils/bilingual';

interface ChapterExplorerProps {
  simulations: PhysicsSimulation[];
  customSimulations: PhysicsSimulation[];
  activeSimId: string;
  language: LanguageMode;
  onSelectSimulation: (id: string) => void;
  onOpenPractice: (chapterId: string) => void;
  onDeleteCustom: (id: string) => void;
  onOpenCustomGenerator: () => void;
}

export function ChapterExplorer({
  simulations,
  customSimulations,
  activeSimId,
  language,
  onSelectSimulation,
  onOpenPractice,
  onDeleteCustom,
  onOpenCustomGenerator,
}: ChapterExplorerProps) {
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState<'all' | 'Class 11' | 'Class 12'>('all');

  const normalizedQuery = query.trim().toLowerCase();

  const filteredChapters = useMemo(() => {
    return CHAPTERS.filter((ch) => {
      if (classFilter !== 'all' && ch.classLevel !== classFilter) return false;
      const chSims = simulations.filter((s) => s.chapterId === ch.id);
      if (!normalizedQuery) return true;
      const chMatch =
        ch.name.en.toLowerCase().includes(normalizedQuery) ||
        ch.name.hi.includes(normalizedQuery) ||
        ch.number.includes(normalizedQuery);
      const simMatch = chSims.some(
        (s) =>
          s.title.en.toLowerCase().includes(normalizedQuery) ||
          s.title.hi.includes(normalizedQuery) ||
          s.formulaDisplay.toLowerCase().includes(normalizedQuery)
      );
      return chMatch || simMatch;
    });
  }, [simulations, classFilter, normalizedQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
            {language === 'hi'
              ? `संपूर्ण कक्षा 11–12 भौतिकी पुस्तकालय (${CHAPTERS.length} अध्याय · ${simulations.length} लाइव लैब)`
              : `Complete Class 11–12 Physics Library (${CHAPTERS.length} Chapters · ${simulations.length} Live Labs)`}
          </h1>
          <p className="mt-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {language === 'hi'
              ? 'हर अध्याय में सभी मुख्य NCERT सूत्रों के लाइव 2D/3D सिमुलेशन, व्युत्पत्ति और 12 छात्र अभ्यास प्रश्न शामिल हैं।'
              : 'Every NCERT Class 11–12 chapter with dedicated live formula simulations, derivations, 3D rigs, and 12 bilingual practice questions.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg border-2 border-black dark:border-white">
            {(['all', 'Class 11', 'Class 12'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setClassFilter(lvl)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  classFilter === lvl
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {lvl === 'all' ? (language === 'hi' ? 'सभी (29)' : 'All Chapters') : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl">
        <Search className="w-4 h-4 text-black dark:text-white absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={getBilingualPrimary(UI_TEXT.searchPlaceholder, language)}
          className="w-full pl-10 pr-4 py-3 text-sm font-medium rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
      </div>

      {/* Saved Custom AI Simulations */}
      {customSimulations.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-black dark:text-white">
              {language === 'hi' ? 'मेरे कस्टम AI सिमुलेशन' : 'Saved Custom AI Labs'}
            </h2>
            <button
              type="button"
              onClick={onOpenCustomGenerator}
              className="text-xs font-bold underline underline-offset-4 text-black dark:text-white cursor-pointer"
            >
              {language === 'hi' ? '+ नया फ़ॉर्मूला बनाएँ' : '+ Generate Another Formula'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customSimulations.map((sim) => (
              <div
                key={sim.id}
                className="rounded-xl border-2 border-black dark:border-white p-5 bg-white dark:bg-black flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    <span>
                      Custom Lab · {sim.chapterName ? getBilingualPrimary(sim.chapterName, language) : 'Physics'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteCustom(sim.id)}
                      aria-label="Delete custom simulation"
                      className="p-1 text-black dark:text-white hover:opacity-60 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="mt-1.5 text-base font-bold text-black dark:text-white">
                    {getBilingualPrimary(sim.title, language)}
                  </h3>
                  {getBilingualSecondary(sim.title, language) && (
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-0.5">
                      {sim.title.hi}
                    </p>
                  )}
                  <div className="mt-3 font-mono text-sm font-bold text-black dark:text-white truncate">
                    {sim.formulaDisplay}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectSimulation(sim.id)}
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 text-xs font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 transition-opacity cursor-pointer"
                >
                  <span>{language === 'hi' ? 'लाइव चलाएँ' : 'Open Live Lab'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Built-in Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredChapters.map((chapter) => {
          const chapterSims = simulations.filter((s) => s.chapterId === chapter.id);
          const has3D = chapterSims.some((s) => s.supports3D);
          const qCount = getQuestionsByChapter(chapter.id).length;

          return (
            <section
              key={chapter.id}
              className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                  <span>Chapter {chapter.number}</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>{chapter.classLevel}</span>
                  {has3D && (
                    <>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span className="text-black dark:text-white">3D</span>
                    </>
                  )}
                  {qCount > 0 && (
                    <>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span>{qCount} Qs</span>
                    </>
                  )}
                </div>
                <h2 className="mt-1 text-xl font-bold text-black dark:text-white">
                  {getBilingualPrimary(chapter.name, language)}
                </h2>
                {getBilingualSecondary(chapter.name, language) && (
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mt-0.5">
                    {chapter.name.hi}
                  </p>
                )}
                <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {getBilingualPrimary(chapter.summary, language)}
                </p>
              </div>

              <div className="space-y-2.5 pt-3 border-t-2 border-neutral-300 dark:border-neutral-700">
                {chapterSims.map((sim) => {
                  const isActive = sim.id === activeSimId;
                  return (
                    <button
                      key={sim.id}
                      type="button"
                      onClick={() => onSelectSimulation(sim.id)}
                      className={`w-full text-left p-3.5 rounded-lg border-2 transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                        isActive
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-bold truncate">
                          {getBilingualPrimary(sim.title, language)}
                          {sim.supports3D && (
                            <span className="ml-1.5 font-mono text-xs opacity-80">· 3D</span>
                          )}
                        </div>
                        <div className="font-mono text-sm font-bold mt-0.5 truncate opacity-90">
                          {sim.formulaDisplay}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  );
                })}

                {qCount > 0 && (
                  <button
                    type="button"
                    onClick={() => onOpenPractice(chapter.id)}
                    className="w-full px-3.5 py-2 rounded-lg border-2 border-black dark:border-white text-xs font-bold text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>
                        {language === 'hi'
                          ? `अभ्यास प्रश्न हल करें (${qCount} प्रश्न)`
                          : `Practice Questions (${qCount} Qs)`}
                      </span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {filteredChapters.length === 0 && (
        <div className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-8 text-center">
          <p className="text-sm font-medium text-black dark:text-white">
            {language === 'hi'
              ? 'इस खोज से कोई बिल्ट-इन अध्याय नहीं मिला। आप इसे कस्टम AI फ़ॉर्मूला लैब में तुरंत बना सकते हैं।'
              : 'No built-in chapter matched that search. You can build any extra topic live in the Custom Formula Lab.'}
          </p>
          <button
            type="button"
            onClick={onOpenCustomGenerator}
            className="mt-4 px-5 py-2.5 text-xs font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 transition-opacity cursor-pointer"
          >
            {language === 'hi' ? 'कस्टम फ़ॉर्मूला बनाएँ' : 'Build in Custom Formula Lab'}
          </button>
        </div>
      )}
    </div>
  );
}
