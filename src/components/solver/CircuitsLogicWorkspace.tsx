import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { LanguageMode } from '../../types/physics';

interface CircuitsLogicWorkspaceProps {
  language: LanguageMode;
}

type GateKind = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

const GATES: { kind: GateKind; expr: string; fn: (a: number, b: number) => number; unary?: boolean }[] = [
  { kind: 'AND', expr: 'Y = A · B', fn: (a, b) => a & b },
  { kind: 'OR', expr: 'Y = A + B', fn: (a, b) => a | b },
  { kind: 'NOT', expr: 'Y = Ā', fn: (a) => (a ? 0 : 1), unary: true },
  { kind: 'NAND', expr: 'Y = (A · B)′', fn: (a, b) => ((a & b) ? 0 : 1) },
  { kind: 'NOR', expr: 'Y = (A + B)′', fn: (a, b) => ((a | b) ? 0 : 1) },
  { kind: 'XOR', expr: 'Y = A ⊕ B', fn: (a, b) => a ^ b },
  { kind: 'XNOR', expr: 'Y = (A ⊕ B)′', fn: (a, b) => ((a ^ b) ? 0 : 1) },
];

export function CircuitsLogicWorkspace({ language }: CircuitsLogicWorkspaceProps) {
  const [subMode, setSubMode] = useState<'logic' | 'resistors'>('logic');

  // Logic Gates state
  const [gateKind, setGateKind] = useState<GateKind>('AND');
  const [inA, setInA] = useState<0 | 1>(1);
  const [inB, setInB] = useState<0 | 1>(0);

  const activeGate = GATES.find((g) => g.kind === gateKind) ?? GATES[0];
  const outY = activeGate.fn(inA, inB);

  // Series / Parallel Resistors state
  const [topology, setTopology] = useState<'series' | 'parallel'>('series');
  const [voltage, setVoltage] = useState(12);
  const [resistors, setResistors] = useState<number[]>([4, 6, 12]);

  const rEq =
    topology === 'series'
      ? resistors.reduce((s, r) => s + r, 0)
      : 1 / resistors.reduce((s, r) => s + 1 / Math.max(0.1, r), 0);
  const totalI = voltage / Math.max(0.01, rEq);
  const totalP = voltage * totalI;

  return (
    <div className="space-y-5">
      <div className="inline-flex items-center gap-1 p-1 rounded-xl border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900">
        <button
          type="button"
          onClick={() => setSubMode('logic')}
          className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-lg cursor-pointer ${
            subMode === 'logic'
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'text-black dark:text-white'
          }`}
        >
          {language === 'hi' ? 'डिजिटल लॉजिक गेट्स व सत्यमान सारणी' : 'Class 12 Logic Gates & Truth Tables'}
        </button>
        <button
          type="button"
          onClick={() => setSubMode('resistors')}
          className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-lg cursor-pointer ${
            subMode === 'resistors'
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'text-black dark:text-white'
          }`}
        >
          {language === 'hi' ? 'श्रेणी व समांतर प्रतिरोध परिपथ' : 'Series & Parallel Resistor Builder'}
        </button>
      </div>

      {subMode === 'logic' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Gate Interactive Board */}
          <div className="lg:col-span-7 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-6 space-y-5">
            <div className="flex flex-wrap gap-1.5">
              {GATES.map((g) => (
                <button
                  key={g.kind}
                  type="button"
                  onClick={() => setGateKind(g.kind)}
                  className={`px-3.5 py-1.5 font-mono text-xs sm:text-sm font-extrabold rounded-lg border-2 cursor-pointer ${
                    gateKind === g.kind
                      ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                      : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white'
                  }`}
                >
                  {g.kind}
                </button>
              ))}
            </div>

            {/* Interactive SVG IEEE Monochrome Gate Schematic */}
            <svg
              viewBox="0 0 420 200"
              className="w-full h-56 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black"
            >
              {/* Input wires */}
              <line
                x1="70"
                y1={activeGate.unary ? 100 : 72}
                x2="155"
                y2={activeGate.unary ? 100 : 72}
                className="stroke-black dark:stroke-white"
                strokeWidth={inA ? 5 : 2}
                strokeDasharray={inA ? undefined : '6 4'}
              />
              {!activeGate.unary && (
                <line
                  x1="70"
                  y1="128"
                  x2="155"
                  y2="128"
                  className="stroke-black dark:stroke-white"
                  strokeWidth={inB ? 5 : 2}
                  strokeDasharray={inB ? undefined : '6 4'}
                />
              )}

              {/* Gate Body */}
              {activeGate.unary ? (
                <g>
                  <polygon
                    points="155,58 155,142 238,100"
                    fill="none"
                    className="stroke-black dark:stroke-white"
                    strokeWidth="4"
                  />
                  <circle cx="248" cy="100" r="8" fill="none" className="stroke-black dark:stroke-white" strokeWidth="3.5" />
                </g>
              ) : gateKind === 'AND' || gateKind === 'NAND' ? (
                <g>
                  <path
                    d="M 155 55 L 205 55 A 45 45 0 0 1 205 145 L 155 145 Z"
                    fill="none"
                    className="stroke-black dark:stroke-white"
                    strokeWidth="4"
                  />
                  {gateKind === 'NAND' && (
                    <circle cx="260" cy="100" r="8" fill="none" className="stroke-black dark:stroke-white" strokeWidth="3.5" />
                  )}
                </g>
              ) : (
                <g>
                  {(gateKind === 'XOR' || gateKind === 'XNOR') && (
                    <path
                      d="M 142 55 Q 162 100 142 145"
                      fill="none"
                      className="stroke-black dark:stroke-white"
                      strokeWidth="3.5"
                    />
                  )}
                  <path
                    d="M 154 55 Q 174 100 154 145 Q 222 145 252 100 Q 222 55 154 55 Z"
                    fill="none"
                    className="stroke-black dark:stroke-white"
                    strokeWidth="4"
                  />
                  {(gateKind === 'NOR' || gateKind === 'XNOR') && (
                    <circle cx="262" cy="100" r="8" fill="none" className="stroke-black dark:stroke-white" strokeWidth="3.5" />
                  )}
                </g>
              )}

              {/* Output wire */}
              <line
                x1={gateKind === 'AND' || gateKind === 'OR' || gateKind === 'XOR' ? 250 : 270}
                y1="100"
                x2="345"
                y2="100"
                className="stroke-black dark:stroke-white"
                strokeWidth={outY ? 5 : 2}
                strokeDasharray={outY ? undefined : '6 4'}
              />

              {/* Output Indicator Bulb */}
              <circle
                cx="368"
                cy="100"
                r="22"
                className={
                  outY
                    ? 'fill-black dark:fill-white stroke-black dark:stroke-white'
                    : 'fill-white dark:fill-black stroke-black dark:stroke-white'
                }
                strokeWidth="3.5"
              />
              <text
                x="362"
                y="106"
                className={
                  outY
                    ? 'fill-white dark:fill-black font-mono text-lg font-extrabold'
                    : 'fill-black dark:fill-white font-mono text-lg font-extrabold'
                }
              >
                {outY}
              </text>

              <text x="175" y="105" className="fill-black dark:fill-white font-mono text-sm font-extrabold">
                {gateKind}
              </text>
              <text x="20" y={activeGate.unary ? 105 : 77} className="fill-black dark:fill-white font-mono text-sm font-extrabold">
                A = {inA}
              </text>
              {!activeGate.unary && (
                <text x="20" y="133" className="fill-black dark:fill-white font-mono text-sm font-extrabold">
                  B = {inB}
                </text>
              )}
            </svg>

            {/* Clickable Input Switches */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setInA((v) => (v === 1 ? 0 : 1))}
                  className={`px-4 py-2 font-mono text-sm font-extrabold rounded-lg border-2 border-black dark:border-white cursor-pointer ${
                    inA ? 'bg-black text-white dark:bg-white dark:text-black' : ''
                  }`}
                >
                  Input A: {inA} ({inA ? 'HIGH' : 'LOW'})
                </button>
                {!activeGate.unary && (
                  <button
                    type="button"
                    onClick={() => setInB((v) => (v === 1 ? 0 : 1))}
                    className={`px-4 py-2 font-mono text-sm font-extrabold rounded-lg border-2 border-black dark:border-white cursor-pointer ${
                      inB ? 'bg-black text-white dark:bg-white dark:text-black' : ''
                    }`}
                  >
                    Input B: {inB} ({inB ? 'HIGH' : 'LOW'})
                  </button>
                )}
              </div>
              <div className="font-mono text-base font-extrabold">
                {activeGate.expr} ⇒ Output Y = {outY}
              </div>
            </div>
          </div>

          {/* Live Highlighted Truth Table */}
          <div className="lg:col-span-5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5 space-y-3">
            <h3 className="text-base font-extrabold text-black dark:text-white">
              Truth Table — {gateKind} Gate ({activeGate.expr})
            </h3>
            <table className="w-full text-center font-mono text-sm border-2 border-black dark:border-white">
              <thead className="bg-black text-white dark:bg-white dark:text-black">
                <tr>
                  <th className="py-2">A</th>
                  {!activeGate.unary && <th className="py-2">B</th>}
                  <th className="py-2">Output Y</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-400 dark:divide-neutral-600">
                {(activeGate.unary
                  ? [
                      [0, 0],
                      [1, 0],
                    ]
                  : [
                      [0, 0],
                      [0, 1],
                      [1, 0],
                      [1, 1],
                    ]
                ).map(([a, b], idx) => {
                  const y = activeGate.fn(a, b);
                  const isCurrent = a === inA && (activeGate.unary || b === inB);
                  return (
                    <tr
                      key={idx}
                      className={
                        isCurrent
                          ? 'bg-black text-white dark:bg-white dark:text-black font-extrabold'
                          : ''
                      }
                    >
                      <td className="py-2.5">{a}</td>
                      {!activeGate.unary && <td className="py-2.5">{b}</td>}
                      <td className="py-2.5 font-extrabold">{y}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Thick solid wire = HIGH (1) · Dashed wire = LOW (0). Click inputs A or B to watch the active row highlight live.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Resistor Builder Controls */}
          <div className="lg:col-span-5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-5 space-y-4">
            <div className="flex gap-2">
              {(['series', 'parallel'] as const).map((top) => (
                <button
                  key={top}
                  type="button"
                  onClick={() => setTopology(top)}
                  className={`flex-1 py-2 text-xs sm:text-sm font-extrabold rounded-lg border-2 capitalize cursor-pointer ${
                    topology === top
                      ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                      : 'border-neutral-400 dark:border-neutral-600'
                  }`}
                >
                  {top} Circuit
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>Supply Voltage (V)</span>
                <span className="font-mono font-extrabold">{voltage} V</span>
              </div>
              <input type="range" min={2} max={48} step={1} value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} className="w-full" />
            </div>

            <div className="space-y-2.5 pt-2 border-t-2 border-black dark:border-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold">RESISTORS ({resistors.length}/5)</span>
                {resistors.length < 5 && (
                  <button
                    type="button"
                    onClick={() => setResistors((prev) => [...prev, 10])}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded border-2 border-black dark:border-white cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add R</span>
                  </button>
                )}
              </div>

              {resistors.map((r, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold w-8">R{idx + 1}</span>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={r}
                    onChange={(e) => {
                      const val = Math.max(0.5, Number(e.target.value) || 1);
                      setResistors((prev) => prev.map((item, i) => (i === idx ? val : item)));
                    }}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black font-mono text-sm font-bold"
                  />
                  <span className="font-mono text-xs font-bold">Ω</span>
                  {resistors.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setResistors((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-1.5 hover:opacity-60 cursor-pointer"
                      aria-label={`Remove R${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live Equivalent Calculation & Per-Resistor Table */}
          <div className="lg:col-span-7 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black p-6 space-y-5">
            <div className="p-5 rounded-xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black space-y-1 font-mono">
              <div className="text-xs opacity-80">
                {topology === 'series'
                  ? 'R_eq = R₁ + R₂ + ... (Same Current I through each resistor)'
                  : '1/R_eq = 1/R₁ + 1/R₂ + ... (Same Voltage V across each branch)'}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tabular-nums">
                R_eq = {rEq.toFixed(2)} Ω  |  I_total = {totalI.toFixed(2)} A  |  P = {totalP.toFixed(1)} W
              </div>
            </div>

            <div className="overflow-x-auto border-2 border-black dark:border-white rounded-xl">
              <table className="w-full text-left font-mono text-xs sm:text-sm">
                <thead className="bg-black text-white dark:bg-white dark:text-black">
                  <tr>
                    <th className="px-3 py-2">Resistor</th>
                    <th className="px-3 py-2">Resistance</th>
                    <th className="px-3 py-2">Voltage Drop (V)</th>
                    <th className="px-3 py-2">Branch Current (I)</th>
                    <th className="px-3 py-2">Power (W)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300 dark:divide-neutral-700">
                  {resistors.map((r, i) => {
                    const vi = topology === 'series' ? totalI * r : voltage;
                    const ii = topology === 'series' ? totalI : voltage / r;
                    const pi = vi * ii;
                    return (
                      <tr key={i}>
                        <td className="px-3 py-2 font-extrabold">R{i + 1}</td>
                        <td className="px-3 py-2 tabular-nums">{r.toFixed(1)} Ω</td>
                        <td className="px-3 py-2 font-bold tabular-nums">{vi.toFixed(2)} V</td>
                        <td className="px-3 py-2 font-bold tabular-nums">{ii.toFixed(2)} A</td>
                        <td className="px-3 py-2 tabular-nums">{pi.toFixed(2)} W</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
