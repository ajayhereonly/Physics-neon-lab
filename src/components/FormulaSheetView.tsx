import { useState } from 'react';
import { Play, Search } from 'lucide-react';
import { CHAPTERS } from '../data/simulations';
import { LanguageMode, PhysicsSimulation } from '../types/physics';
import { getBilingualPrimary, getBilingualSecondary, UI_TEXT } from '../utils/bilingual';

interface FormulaSheetViewProps {
  allSimulations: PhysicsSimulation[];
  language: LanguageMode;
  onLaunchSimulation: (id: string) => void;
}

export function FormulaSheetView({
  allSimulations,
  language,
  onLaunchSimulation,
}: FormulaSheetViewProps) {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState<'all' | 'Class 11' | 'Class 12'>('all');
  const q = search.trim().toLowerCase();

  const filtered = allSimulations.filter((sim) => {
    if (classFilter !== 'all') {
      const ch = CHAPTERS.find((c) => c.id === sim.chapterId);
      if (!ch || ch.classLevel !== classFilter) return false;
    }
    if (!q) return true;
    const ch = CHAPTERS.find((c) => c.id === sim.chapterId);
    return (
      sim.title.en.toLowerCase().includes(q) ||
      sim.title.hi.includes(q) ||
      sim.formulaDisplay.toLowerCase().includes(q) ||
      (ch && (ch.name.en.toLowerCase().includes(q) || ch.name.hi.includes(q)))
    );
  });

  const getChapterLabel = (sim: PhysicsSimulation) => {
    if (sim.isCustom) {
      return sim.chapterName ? getBilingualPrimary(sim.chapterName, language) : 'Custom Lab';
    }
    const ch = CHAPTERS.find((c) => c.id === sim.chapterId);
    if (!ch) return '';
    return `${ch.number}. ${getBilingualPrimary(ch.name, language)} · ${ch.classLevel}${
      sim.supports3D ? ' · 3D' : ''
    }`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
            {language === 'hi'
              ? 'मास्टर भौतिकी फ़ॉर्मूला शीट (कक्षा 11–12)'
              : 'Master Physics Formula Sheet (Class 11–12)'}
          </h1>
          <p className="mt-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {language === 'hi'
              ? 'हर सूत्र के सामने दिए गए बटन से तुरंत उसका लाइव 2D/3D सिमुलेशन खोलें।'
              : 'All 29 NCERT Class 11–12 chapter formulas linked directly to live 2D and 3D classroom simulations.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg border-2 border-black dark:border-white">
            {(['all', 'Class 11', 'Class 12'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setClassFilter(lvl)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  classFilter === lvl
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {lvl === 'all' ? (language === 'hi' ? 'सभी' : 'All') : lvl}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-black dark:text-white absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={getBilingualPrimary(UI_TEXT.searchPlaceholder, language)}
              className="w-full pl-10 pr-4 py-2 text-sm font-medium rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-black dark:border-white text-xs font-bold text-black dark:text-white bg-neutral-100 dark:bg-neutral-900">
                <th className="py-3.5 px-5">
                  {language === 'hi' ? 'अध्याय और विषय' : 'Chapter & Concept'}
                </th>
                <th className="py-3.5 px-5">
                  {language === 'hi' ? 'मुख्य सूत्र' : 'Primary Formula'}
                </th>
                <th className="py-3.5 px-5 hidden lg:table-cell">
                  {language === 'hi' ? 'संबंधित समीकरण' : 'Key Derived Forms'}
                </th>
                <th className="py-3.5 px-5 text-right">
                  {language === 'hi' ? 'लाइव डेमो' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral-300 dark:divide-neutral-800 text-sm">
              {filtered.map((sim) => (
                <tr
                  key={sim.id}
                  className="hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  <td className="py-4 px-5 align-top">
                    <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                      {getChapterLabel(sim)}
                    </div>
                    <div className="font-bold text-base text-black dark:text-white mt-0.5">
                      {getBilingualPrimary(sim.title, language)}
                    </div>
                    {getBilingualSecondary(sim.title, language) && (
                      <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-0.5">
                        {sim.title.hi}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-5 align-top">
                    <div className="font-mono text-base font-bold text-black dark:text-white whitespace-nowrap">
                      {sim.formulaDisplay}
                    </div>
                  </td>
                  <td className="py-4 px-5 align-top hidden lg:table-cell">
                    <div className="space-y-1 font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      {(sim.secondaryFormulas ?? []).map((sf, idx) => (
                        <div key={idx}>{sf.formula}</div>
                      ))}
                      {(!sim.secondaryFormulas || sim.secondaryFormulas.length === 0) && (
                        <span>—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-5 align-top text-right">
                    <button
                      type="button"
                      onClick={() => onLaunchSimulation(sim.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 transition-opacity whitespace-nowrap cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{language === 'hi' ? 'चलाएँ' : 'Simulate'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
