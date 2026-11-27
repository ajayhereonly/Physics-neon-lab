import { useMemo, useState } from 'react';
import { ArrowLeftRight, ArrowUpRight, Check, Copy, Search } from 'lucide-react';
import { LanguageMode } from '../../types/physics';
import {
  PHYSICAL_CONSTANTS,
  UNIT_CATEGORIES,
} from '../../utils/equationSolverEngine';
import { formatPhysicsNumber } from '../../utils/mathParser';

interface UnitsConstantsWorkspaceProps {
  language: LanguageMode;
  onSendConstantToSolver: (symbol: string, value: number) => void;
}

export function UnitsConstantsWorkspace({
  language,
  onSendConstantToSolver,
}: UnitsConstantsWorkspaceProps) {
  const [catId, setCatId] = useState('speed');
  const category = useMemo(
    () => UNIT_CATEGORIES.find((c) => c.id === catId) ?? UNIT_CATEGORIES[0],
    [catId]
  );
  const [fromUnitId, setFromUnitId] = useState('kmh');
  const [toUnitId, setToUnitId] = useState('ms');
  const [inputValue, setInputValue] = useState('72');

  const [constQuery, setConstQuery] = useState('');
  const [constCat, setConstCat] = useState<'All' | 'Mechanics' | 'Thermodynamics' | 'Electromagnetism' | 'Modern Physics'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fromUnit = category.units.find((u) => u.id === fromUnitId) ?? category.units[0];
  const toUnit = category.units.find((u) => u.id === toUnitId) ?? category.units[1] ?? category.units[0];

  const handleCategoryChange = (nextId: string) => {
    setCatId(nextId);
    const nextCat = UNIT_CATEGORIES.find((c) => c.id === nextId) ?? UNIT_CATEGORIES[0];
    setFromUnitId(nextCat.units[0].id);
    setToUnitId((nextCat.units[1] ?? nextCat.units[0]).id);
  };

  const converted = useMemo(() => {
    const n = Number(inputValue);
    if (inputValue === '' || Number.isNaN(n)) return null;
    const baseVal = fromUnit.toBase(n);
    const targetVal = toUnit.fromBase(baseVal);
    return { baseVal, targetVal };
  }, [inputValue, fromUnit, toUnit]);

  const filteredConstants = useMemo(() => {
    const q = constQuery.trim().toLowerCase();
    return PHYSICAL_CONSTANTS.filter((c) => {
      if (constCat !== 'All' && c.category !== constCat) return false;
      if (!q) return true;
      return (
        c.nameEn.toLowerCase().includes(q) ||
        c.nameHi.includes(q) ||
        c.symbol.toLowerCase().includes(q) ||
        c.unit.toLowerCase().includes(q)
      );
    });
  }, [constQuery, constCat]);

  const handleCopy = (id: string, val: number) => {
    navigator.clipboard?.writeText(String(val)).catch(() => {});
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-8">
      {/* PART 1: SI Physics Unit Converter */}
      <section className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-6 space-y-5">
        <div className="pb-3 border-b-2 border-black dark:border-white">
          <h2 className="text-xl font-extrabold text-black dark:text-white">
            {language === 'hi'
              ? 'भौतिकी SI मात्रक रूपांतरक (10 श्रेणियाँ)'
              : 'Physics SI Unit Converter (10 NCERT Categories)'}
          </h2>
          <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-0.5">
            Instant conversion with classroom identity formulas visible for board explanation.
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {UNIT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCategoryChange(c.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 whitespace-nowrap cursor-pointer ${
                c.id === category.id
                  ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                  : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white'
              }`}
            >
              {language === 'hi' ? c.nameHi : c.nameEn}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-end">
          <div className="md:col-span-3 space-y-1">
            <label className="block text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
              VALUE
            </label>
            <input
              type="number"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black font-mono text-lg font-extrabold tabular-nums text-black dark:text-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="block text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
              FROM UNIT
            </label>
            <select
              value={fromUnit.id}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black font-mono text-sm font-bold text-black dark:text-white"
            >
              {category.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.symbol} — {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setFromUnitId(toUnit.id);
                setToUnitId(fromUnit.id);
              }}
              aria-label="Swap units"
              className="p-2.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="block text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
              TO UNIT
            </label>
            <select
              value={toUnit.id}
              onChange={(e) => setToUnitId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black font-mono text-sm font-bold text-black dark:text-white"
            >
              {category.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.symbol} — {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Inverted Result Banner */}
        <div className="p-5 rounded-xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono opacity-80">CONVERTED RESULT</div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold tabular-nums mt-0.5">
              {inputValue || '0'} {fromUnit.symbol} ={' '}
              {converted ? formatPhysicsNumber(converted.targetVal, 5) : '—'} {toUnit.symbol}
            </div>
          </div>
          <div className="text-xs font-mono opacity-90 space-y-0.5 text-right">
            <div>Base SI: {converted ? `${formatPhysicsNumber(converted.baseVal, 5)} ${category.baseSymbol}` : '—'}</div>
            <div>Identity: {fromUnit.factorLabel} · {toUnit.factorLabel}</div>
          </div>
        </div>
      </section>

      {/* PART 2: Class 11-12 Physical Constants Deck */}
      <section className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-black dark:border-white">
          <div>
            <h2 className="text-xl font-extrabold text-black dark:text-white">
              {language === 'hi'
                ? 'प्रमुख भौतिक नियतांक तालिका (Physical Constants)'
                : 'Class 11–12 Physical Constants Deck'}
            </h2>
            <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-0.5">
              Copy exact numerical values or send directly into the Equation Solver.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-white pointer-events-none" />
            <input
              type="text"
              value={constQuery}
              onChange={(e) => setConstQuery(e.target.value)}
              placeholder="Filter constant..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-medium rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Mechanics', 'Thermodynamics', 'Electromagnetism', 'Modern Physics'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setConstCat(cat)}
              className={`px-3 py-1 text-xs font-bold rounded-md border-2 cursor-pointer ${
                constCat === cat
                  ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                  : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto border-2 border-black dark:border-white rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-black text-white dark:bg-white dark:text-black font-mono">
              <tr>
                <th className="px-3.5 py-2.5">Symbol</th>
                <th className="px-3.5 py-2.5">Constant Name</th>
                <th className="px-3.5 py-2.5">Value</th>
                <th className="px-3.5 py-2.5">SI Unit</th>
                <th className="px-3.5 py-2.5">Dimension</th>
                <th className="px-3.5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300 dark:divide-neutral-700">
              {filteredConstants.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-950">
                  <td className="px-3.5 py-2.5 font-mono text-base font-extrabold">{c.symbol}</td>
                  <td className="px-3.5 py-2.5 font-bold">
                    <div>{language === 'hi' ? c.nameHi : c.nameEn}</div>
                    {language === 'dual' && (
                      <div className="text-xs font-normal text-neutral-600 dark:text-neutral-400">
                        {c.nameHi}
                      </div>
                    )}
                  </td>
                  <td className="px-3.5 py-2.5 font-mono font-extrabold tabular-nums">{c.displayValue}</td>
                  <td className="px-3.5 py-2.5 font-mono">{c.unit}</td>
                  <td className="px-3.5 py-2.5 font-mono text-xs">{c.dimension}</td>
                  <td className="px-3.5 py-2.5 text-right whitespace-nowrap space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(c.id, c.numericValue)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer"
                    >
                      {copiedId === c.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === c.id ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSendConstantToSolver(c.symbol, c.numericValue)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded bg-black text-white dark:bg-white dark:text-black hover:opacity-85 cursor-pointer"
                    >
                      <span>Solver</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
