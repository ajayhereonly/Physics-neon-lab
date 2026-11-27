import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import { LanguageMode } from '../../types/physics';
import {
  checkDimensionalEquation,
  deriveDimensionalExponents,
  DIM_SYMBOLS,
  formatDimVec,
} from '../../utils/dimensionalEngine';

interface DimensionalCheckerWorkspaceProps {
  language: LanguageMode;
}

const DIM_PRESETS = [
  { label: '2nd Law of Motion (Valid)', lhs: 's', rhs: 'u*t + 0.5*a*t^2' },
  { label: '3rd Law of Motion (Valid)', lhs: 'v^2', rhs: 'u^2 + 2*a*s' },
  { label: 'Escape Velocity (Valid)', lhs: 'v', rhs: 'sqrt(2*G*M/R)' },
  { label: 'Angular Momentum (Valid)', lhs: 'L', rhs: 'I_moi * omega' },
  { label: 'Centripetal Force (Valid)', lhs: 'F', rhs: 'm*v^2/r' },
  { label: 'Simple Pendulum (Valid)', lhs: 'T_period', rhs: '2*pi*sqrt(l/g)' },
  { label: 'Broken Formula Trap: F = m*v', lhs: 'F', rhs: 'm*v' },
  { label: 'Broken Formula Trap: E = m*c', lhs: 'E', rhs: 'm*c' },
];

const DERIVE_PRESETS = [
  { label: 'Pendulum Period T(l, g)', target: 'T_period', vars: ['l', 'g'] },
  { label: 'Centripetal Force F(m, v, r)', target: 'F', vars: ['m', 'v', 'r'] },
  { label: 'Escape Velocity v(G, M, R)', target: 'v', vars: ['G', 'M', 'R'] },
  { label: 'Stokes Drag F(eta, r, v)', target: 'F', vars: ['eta', 'r', 'v'] },
  { label: 'Kinetic Energy K(m, v)', target: 'K', vars: ['m', 'v'] },
];

export function DimensionalCheckerWorkspace({ language }: DimensionalCheckerWorkspaceProps) {
  const [lhs, setLhs] = useState('s');
  const [rhs, setRhs] = useState('u*t + 0.5*a*t^2');
  const [showSymbols, setShowSymbols] = useState(false);

  // Exponent Deriver state
  const [targetSym, setTargetSym] = useState('T_period');
  const [var1, setVar1] = useState('l');
  const [var2, setVar2] = useState('g');
  const [var3, setVar3] = useState('');

  const checkResult = useMemo(() => checkDimensionalEquation(lhs, rhs), [lhs, rhs]);

  const deriveResult = useMemo(() => {
    const vars = [var1, var2, var3].filter(Boolean);
    return deriveDimensionalExponents(targetSym, vars);
  }, [targetSym, var1, var2, var3]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Formula Homogeneity Validator */}
        <div className="lg:col-span-7 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-black dark:border-white">
            <div>
              <h2 className="text-xl font-extrabold text-black dark:text-white">
                {language === 'hi'
                  ? 'विमीय समांगता जाँचकर्ता (LHS = RHS)'
                  : 'Dimensional Consistency Checker (LHS = RHS)'}
              </h2>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-0.5">
                {language === 'hi'
                  ? 'किसी भी सूत्र के दोनों पक्षों की विमा [Mᵃ Lᵇ Tᶜ Aᵈ Kᵉ] की तुलना करें।'
                  : 'Verify whether any physics equation is dimensionally consistent across [M, L, T, A, K].'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSymbols((s) => !s)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showSymbols ? 'Hide Symbols' : 'Symbol Key'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
            <label className="sm:col-span-5 space-y-1">
              <span className="block text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                LEFT-HAND SIDE (LHS)
              </span>
              <input
                type="text"
                value={lhs}
                onChange={(e) => setLhs(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black font-mono text-base font-extrabold text-black dark:text-white focus:outline-none"
              />
            </label>
            <div className="sm:col-span-1 text-center font-mono text-2xl font-extrabold text-black dark:text-white pt-4">
              =
            </div>
            <label className="sm:col-span-5 space-y-1">
              <span className="block text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                RIGHT-HAND SIDE (RHS)
              </span>
              <input
                type="text"
                value={rhs}
                onChange={(e) => setRhs(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black font-mono text-base font-extrabold text-black dark:text-white focus:outline-none"
              />
            </label>
          </div>

          {/* Preset Test Chips */}
          <div className="flex flex-wrap gap-1.5">
            {DIM_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setLhs(p.lhs);
                  setRhs(p.rhs);
                }}
                className="px-2.5 py-1 text-xs font-bold rounded-md border-2 border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Verdict Panel (Explicit Icons + Text, Never Hue-Only) */}
          <div
            className={`p-5 rounded-xl border-2 border-black dark:border-white space-y-3 ${
              checkResult.isConsistent
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white'
            }`}
          >
            <div className="flex items-center gap-2 text-base font-extrabold">
              {checkResult.error ? (
                <>
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>DIMENSIONAL / SYNTAX ERROR</span>
                </>
              ) : checkResult.isConsistent ? (
                <>
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>
                    {language === 'hi'
                      ? 'विमीय रूप से सही (DIMENSIONALLY CONSISTENT)'
                      : 'DIMENSIONALLY CONSISTENT (LHS = RHS)'}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 shrink-0" />
                  <span>
                    {language === 'hi'
                      ? 'विमीय असंगति! सूत्र गलत है (MISMATCH)'
                      : 'DIMENSIONAL MISMATCH — FORMULA INVALID'}
                  </span>
                </>
              )}
            </div>

            {checkResult.error ? (
              <p className="text-sm font-mono font-bold">{checkResult.error}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono">
                <div className="p-3 rounded-lg border border-current/40">
                  <div className="text-xs opacity-80">LHS Dimension ({lhs})</div>
                  <div className="text-lg font-extrabold mt-0.5">{checkResult.lhsFormatted}</div>
                </div>
                <div className="p-3 rounded-lg border border-current/40">
                  <div className="text-xs opacity-80">RHS Dimension ({rhs})</div>
                  <div className="text-lg font-extrabold mt-0.5">{checkResult.rhsFormatted}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Derive Formula Exponents Solver */}
        <div className="lg:col-span-5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-6 space-y-4">
          <div className="pb-3 border-b-2 border-black dark:border-white">
            <h2 className="text-lg font-extrabold text-black dark:text-white">
              {language === 'hi'
                ? 'विमीय विश्लेषण से सूत्र व्युत्पन्न करें'
                : 'Derive Formula Exponents (Scaling Law)'}
            </h2>
            <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-0.5">
              Solve Target ∝ (Var₁)ᵃ · (Var₂)ᵇ · (Var₃)ᶜ automatically via linear algebra.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {DERIVE_PRESETS.map((dp) => (
              <button
                key={dp.label}
                type="button"
                onClick={() => {
                  setTargetSym(dp.target);
                  setVar1(dp.vars[0] ?? '');
                  setVar2(dp.vars[1] ?? '');
                  setVar3(dp.vars[2] ?? '');
                }}
                className="px-2.5 py-1 text-xs font-bold rounded-md border-2 border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white cursor-pointer"
              >
                {dp.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <label className="block space-y-1">
              <span className="text-xs font-mono font-bold text-black dark:text-white">Target Quantity</span>
              <select
                value={targetSym}
                onChange={(e) => setTargetSym(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black font-mono text-sm font-bold text-black dark:text-white"
              >
                {DIM_SYMBOLS.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} — {s.nameEn} {formatDimVec(s.dim)}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Var 1', val: var1, set: setVar1, optional: false },
                { label: 'Var 2', val: var2, set: setVar2, optional: true },
                { label: 'Var 3', val: var3, set: setVar3, optional: true },
              ].map((slot) => (
                <label key={slot.label} className="block space-y-1">
                  <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                    {slot.label}
                  </span>
                  <select
                    value={slot.val}
                    onChange={(e) => slot.set(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black font-mono text-xs font-bold text-black dark:text-white"
                  >
                    {slot.optional && <option value="">(None)</option>}
                    {DIM_SYMBOLS.map((s) => (
                      <option key={s.symbol} value={s.symbol}>
                        {s.symbol} ({s.nameEn.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black">
            {'error' in deriveResult ? (
              <p className="text-xs font-bold">{deriveResult.error}</p>
            ) : (
              <div className="space-y-1.5">
                <div className="text-xs font-mono font-bold uppercase opacity-80">
                  Derived Dimensional Law
                </div>
                <div className="font-mono text-xl font-extrabold">{deriveResult.formulaText}</div>
                <div className="text-xs font-mono opacity-85">
                  Exponents: {[var1, var2, var3]
                    .filter(Boolean)
                    .map((sym, idx) => `${sym} → ${Number(deriveResult.exponents[idx].toFixed(3))}`)
                    .join('  ·  ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Full Symbol Reference Table */}
      {showSymbols && (
        <div className="rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5 space-y-3">
          <div className="text-sm font-extrabold text-black dark:text-white">
            Supported Physics Symbols & Dimensions (Click to insert into RHS)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {DIM_SYMBOLS.map((s) => (
              <button
                key={s.symbol}
                type="button"
                onClick={() => setRhs((prev) => (prev ? `${prev} * ${s.symbol}` : s.symbol))}
                className="text-left p-2 rounded-lg border border-neutral-400 dark:border-neutral-600 hover:border-black dark:hover:border-white cursor-pointer"
              >
                <div className="font-mono text-xs font-extrabold text-black dark:text-white">
                  {s.symbol} <span className="opacity-70">{formatDimVec(s.dim)}</span>
                </div>
                <div className="text-[11px] text-neutral-700 dark:text-neutral-300 truncate">
                  {language === 'hi' ? s.nameHi : s.nameEn}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
