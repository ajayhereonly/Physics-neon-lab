import { evaluateExpression, formatPhysicsNumber } from './mathParser';

/**
 * Safe algebraic LHS = RHS physics equation solver (no eval / no Function),
 * bidirectional SI Physics Unit Converter, and Class 11-12 Physical Constants Deck.
 */

const RESERVED_IDENTIFIERS = new Set([
  'pi',
  'PI',
  'e',
  'g',
  'G',
  'c',
  'k_e',
  'R_gas',
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'sqrt',
  'abs',
  'log',
  'ln',
  'exp',
  'pow',
  'min',
  'max',
]);

export function extractEquationVariables(equation: string): string[] {
  const cleaned = equation.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  const matches = cleaned.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) ?? [];
  const seen = new Set<string>();
  const vars: string[] = [];
  for (const token of matches) {
    if (RESERVED_IDENTIFIERS.has(token) || RESERVED_IDENTIFIERS.has(token.toLowerCase())) {
      continue;
    }
    if (!seen.has(token)) {
      seen.add(token);
      vars.push(token);
    }
  }
  return vars;
}

export interface CustomEquationResult {
  roots: number[];
  lhsExpr: string;
  rhsExpr: string;
  substitutedEquation: string;
  residual: number;
  error?: string;
}

/**
 * Solves `LHS = RHS` numerically for `unknownVar` given known values using
 * bracketed bisection + secant refinement across a wide logarithmic & linear grid.
 */
export function solveCustomEquation(
  rawEquation: string,
  unknownVar: string,
  knownValues: Record<string, number>
): CustomEquationResult {
  const parts = rawEquation.split('=');
  if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
    return {
      roots: [],
      lhsExpr: rawEquation,
      rhsExpr: '',
      substitutedEquation: '',
      residual: NaN,
      error: 'Enter an equation with exactly one "=" sign (e.g. v^2 = u^2 + 2*a*s).',
    };
  }

  const lhsExpr = parts[0].trim();
  const rhsExpr = parts[1].trim();

  const evalDiff = (x: number): number => {
    const vars = { ...knownValues, [unknownVar]: x };
    const l = evaluateExpression(lhsExpr, vars);
    const r = evaluateExpression(rhsExpr, vars);
    if (l.value === null || r.value === null || !Number.isFinite(l.value) || !Number.isFinite(r.value)) {
      return NaN;
    }
    return l.value - r.value;
  };

  // Sample grid spanning [-1e6, 1e6] densely around 0 and common classroom scales
  const sampleSet = new Set<number>([0]);
  const posGrid: number[] = [];
  for (let exp = -6; exp <= 6; exp++) {
    const base = Math.pow(10, exp);
    for (const mult of [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 8.5, 9.5]) {
      posGrid.push(base * mult);
    }
  }
  for (let x = -50; x <= 50; x += 0.5) sampleSet.add(Number(x.toFixed(4)));
  for (const v of posGrid) {
    sampleSet.add(v);
    sampleSet.add(-v);
  }
  const samples = Array.from(sampleSet).sort((a, b) => a - b);

  const rawRoots: number[] = [];

  const bisect = (a: number, b: number, fa: number): number | null => {
    let lo = a;
    let hi = b;
    let flo = fa;
    for (let iter = 0; iter < 68; iter++) {
      const mid = (lo + hi) * 0.5;
      const fmid = evalDiff(mid);
      if (!Number.isFinite(fmid)) return null;
      if (Math.abs(fmid) < 1e-11 || Math.abs(hi - lo) < 1e-11 * Math.max(1, Math.abs(mid))) {
        return mid;
      }
      if ((flo > 0 && fmid > 0) || (flo < 0 && fmid < 0)) {
        lo = mid;
        flo = fmid;
      } else {
        hi = mid;
      }
    }
    return (lo + hi) * 0.5;
  };

  let prevX: number | null = null;
  let prevF: number | null = null;

  for (const x of samples) {
    const fx = evalDiff(x);
    if (!Number.isFinite(fx)) {
      prevX = null;
      prevF = null;
      continue;
    }
    if (Math.abs(fx) < 1e-9) {
      rawRoots.push(x);
    } else if (prevX !== null && prevF !== null && ((prevF > 0 && fx < 0) || (prevF < 0 && fx > 0))) {
      // Avoid vertical asymptote false crossings where |f| explodes on both sides
      const midVal = evalDiff((prevX + x) * 0.5);
      if (Number.isFinite(midVal) && Math.abs(midVal) < Math.max(Math.abs(prevF), Math.abs(fx)) * 20 + 1e4) {
        const root = bisect(prevX, x, prevF);
        if (root !== null) {
          const check = evalDiff(root);
          if (Number.isFinite(check) && Math.abs(check) < 1e-4 * Math.max(1, Math.abs(prevF))) {
            rawRoots.push(root);
          }
        }
      }
    }
    prevX = x;
    prevF = fx;
  }

  // Deduplicate close roots & prefer positive real physics roots first
  const uniqueRoots: number[] = [];
  for (const r of rawRoots) {
    const snapped = Math.abs(r) < 1e-9 ? 0 : r;
    if (!uniqueRoots.some((u) => Math.abs(u - snapped) <= 1e-4 * Math.max(1, Math.abs(u)))) {
      uniqueRoots.push(snapped);
    }
  }
  uniqueRoots.sort((a, b) => {
    if (a >= 0 && b < 0) return -1;
    if (a < 0 && b >= 0) return 1;
    return Math.abs(a) - Math.abs(b);
  });

  if (uniqueRoots.length === 0) {
    return {
      roots: [],
      lhsExpr,
      rhsExpr,
      substitutedEquation: '',
      residual: NaN,
      error: `No real solution found for "${unknownVar}" in range [-10⁶, 10⁶]. Check signs or units.`,
    };
  }

  const primary = uniqueRoots[0];
  const residual = Math.abs(evalDiff(primary));

  // Build readable substituted equation
  const allVars: Record<string, number> = { ...knownValues, [unknownVar]: primary };
  const subst = rawEquation.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, (tok) => {
    if (tok === unknownVar) return `[${unknownVar}=${formatPhysicsNumber(primary, 4)}]`;
    if (Object.prototype.hasOwnProperty.call(allVars, tok)) {
      return formatPhysicsNumber(allVars[tok], 3);
    }
    return tok;
  });

  return {
    roots: uniqueRoots.slice(0, 4),
    lhsExpr,
    rhsExpr,
    substitutedEquation: subst,
    residual,
  };
}

export interface CustomEquationPreset {
  id: string;
  label: string;
  category: 'Foundation' | 'Class 11' | 'Class 12';
  equation: string;
  defaultUnknown: string;
  defaults: Record<string, number>;
  units: Record<string, string>;
}

export const CUSTOM_EQUATION_PRESETS: CustomEquationPreset[] = [
  {
    id: 'speed-basic',
    label: 'Speed & Distance (v = d / t)',
    category: 'Foundation',
    equation: 'v = d / t',
    defaultUnknown: 'v',
    defaults: { v: 20, d: 150, t: 7.5 },
    units: { v: 'm/s', d: 'm', t: 's' },
  },
  {
    id: 'momentum-basic',
    label: 'Linear Momentum (p = m * v)',
    category: 'Foundation',
    equation: 'p = m * v',
    defaultUnknown: 'p',
    defaults: { p: 45, m: 3, v: 15 },
    units: { p: 'kg·m/s', m: 'kg', v: 'm/s' },
  },
  {
    id: 'angular-momentum-basic',
    label: 'Angular Momentum (L = I * w)',
    category: 'Foundation',
    equation: 'L = I * w',
    defaultUnknown: 'L',
    defaults: { L: 24, I: 4, w: 6 },
    units: { L: 'kg·m²/s', I: 'kg·m²', w: 'rad/s' },
  },
  {
    id: 'moi-disc',
    label: 'Moment of Inertia (I = k * M * R^2)',
    category: 'Foundation',
    equation: 'I = k * M * R^2',
    defaultUnknown: 'I',
    defaults: { I: 1.6, k: 0.5, M: 8, R: 0.632 },
    units: { I: 'kg·m²', k: '', M: 'kg', R: 'm' },
  },
  {
    id: 'kinematics-3rd',
    label: '3rd Equation of Motion (v^2 = u^2 + 2*a*s)',
    category: 'Class 11',
    equation: 'v^2 = u^2 + 2 * a * s',
    defaultUnknown: 'v',
    defaults: { v: 20, u: 10, a: 3, s: 50 },
    units: { v: 'm/s', u: 'm/s', a: 'm/s²', s: 'm' },
  },
  {
    id: 'kinematics-2nd',
    label: '2nd Equation of Motion (s = u*t + 0.5*a*t^2)',
    category: 'Class 11',
    equation: 's = u * t + 0.5 * a * t^2',
    defaultUnknown: 't',
    defaults: { s: 80, u: 6, a: 4, t: 5 },
    units: { s: 'm', u: 'm/s', a: 'm/s²', t: 's' },
  },
  {
    id: 'centripetal',
    label: 'Centripetal Force (F = m * v^2 / r)',
    category: 'Class 11',
    equation: 'F = m * v^2 / r',
    defaultUnknown: 'v',
    defaults: { F: 100, m: 2, v: 10, r: 2 },
    units: { F: 'N', m: 'kg', v: 'm/s', r: 'm' },
  },
  {
    id: 'escape-vel',
    label: 'Escape Velocity (ve = sqrt(2 * g * R))',
    category: 'Class 11',
    equation: 've = sqrt(2 * g * R)',
    defaultUnknown: 've',
    defaults: { ve: 11186, R: 6400000 },
    units: { ve: 'm/s', R: 'm' },
  },
  {
    id: 'ideal-gas',
    label: 'Ideal Gas Law (P * V = n * R_gas * T)',
    category: 'Class 11',
    equation: 'P * V = n * R_gas * T',
    defaultUnknown: 'P',
    defaults: { P: 101325, V: 0.024, n: 1, T: 300 },
    units: { P: 'Pa', V: 'm³', n: 'mol', T: 'K' },
  },
  {
    id: 'ohms-power',
    label: 'Electric Power (P = V^2 / R)',
    category: 'Class 12',
    equation: 'P = V^2 / R',
    defaultUnknown: 'R',
    defaults: { P: 100, V: 220, R: 484 },
    units: { P: 'W', V: 'V', R: 'Ω' },
  },
  {
    id: 'thin-lens',
    label: 'Thin Lens Formula (1/f = 1/v - 1/u)',
    category: 'Class 12',
    equation: '1 / f = 1 / v - 1 / u',
    defaultUnknown: 'v',
    defaults: { f: 15, v: 30, u: -30 },
    units: { f: 'cm', v: 'cm', u: 'cm' },
  },
  {
    id: 'lcr-resonance',
    label: 'LC Resonance (f = 1 / (2 * pi * sqrt(L * C)))',
    category: 'Class 12',
    equation: 'f = 1 / (2 * pi * sqrt(L * C))',
    defaultUnknown: 'f',
    defaults: { f: 159.15, L: 0.1, C: 0.00001 },
    units: { f: 'Hz', L: 'H', C: 'F' },
  },
];

// ================= SI UNIT CONVERTER ENGINE =================

export interface UnitDefinition {
  id: string;
  symbol: string;
  name: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
  factorLabel: string;
}

export interface UnitCategory {
  id: string;
  nameEn: string;
  nameHi: string;
  baseSymbol: string;
  units: UnitDefinition[];
}

const lin = (factor: number) => ({
  toBase: (v: number) => v * factor,
  fromBase: (v: number) => v / factor,
});

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    nameEn: 'Length / Wavelength',
    nameHi: 'लंबाई / तरंगदैर्ध्य',
    baseSymbol: 'm',
    units: [
      { id: 'm', symbol: 'm', name: 'Meter (SI)', ...lin(1), factorLabel: '1 m' },
      { id: 'km', symbol: 'km', name: 'Kilometer', ...lin(1000), factorLabel: '1 km = 10³ m' },
      { id: 'cm', symbol: 'cm', name: 'Centimeter (CGS)', ...lin(0.01), factorLabel: '1 cm = 10⁻² m' },
      { id: 'mm', symbol: 'mm', name: 'Millimeter', ...lin(1e-3), factorLabel: '1 mm = 10⁻³ m' },
      { id: 'um', symbol: 'μm', name: 'Micrometer', ...lin(1e-6), factorLabel: '1 μm = 10⁻⁶ m' },
      { id: 'nm', symbol: 'nm', name: 'Nanometer', ...lin(1e-9), factorLabel: '1 nm = 10⁻⁹ m' },
      { id: 'ang', symbol: 'Å', name: 'Angstrom', ...lin(1e-10), factorLabel: '1 Å = 10⁻¹⁰ m' },
      { id: 'fm', symbol: 'fm', name: 'Fermi (Nuclear)', ...lin(1e-15), factorLabel: '1 fm = 10⁻¹⁵ m' },
    ],
  },
  {
    id: 'speed',
    nameEn: 'Speed / Velocity',
    nameHi: 'चाल / वेग',
    baseSymbol: 'm/s',
    units: [
      { id: 'ms', symbol: 'm/s', name: 'Meter per second (SI)', ...lin(1), factorLabel: '1 m/s' },
      { id: 'kmh', symbol: 'km/h', name: 'Kilometer per hour', ...lin(5 / 18), factorLabel: '1 km/h = 5/18 m/s' },
      { id: 'kms', symbol: 'km/s', name: 'Kilometer per second', ...lin(1000), factorLabel: '1 km/s = 10³ m/s' },
      { id: 'cms', symbol: 'cm/s', name: 'Centimeter per second', ...lin(0.01), factorLabel: '1 cm/s = 10⁻² m/s' },
      { id: 'mph', symbol: 'mph', name: 'Miles per hour', ...lin(0.44704), factorLabel: '1 mph = 0.447 m/s' },
    ],
  },
  {
    id: 'mass',
    nameEn: 'Mass',
    nameHi: 'द्रव्यमान',
    baseSymbol: 'kg',
    units: [
      { id: 'kg', symbol: 'kg', name: 'Kilogram (SI)', ...lin(1), factorLabel: '1 kg' },
      { id: 'g', symbol: 'g', name: 'Gram (CGS)', ...lin(1e-3), factorLabel: '1 g = 10⁻³ kg' },
      { id: 'mg', symbol: 'mg', name: 'Milligram', ...lin(1e-6), factorLabel: '1 mg = 10⁻⁶ kg' },
      { id: 't', symbol: 'tonne', name: 'Metric Tonne', ...lin(1000), factorLabel: '1 tonne = 10³ kg' },
      { id: 'u', symbol: 'u (amu)', name: 'Atomic Mass Unit', ...lin(1.66054e-27), factorLabel: '1 u = 1.66×10⁻²⁷ kg' },
    ],
  },
  {
    id: 'force',
    nameEn: 'Force',
    nameHi: 'बल',
    baseSymbol: 'N',
    units: [
      { id: 'N', symbol: 'N', name: 'Newton (SI)', ...lin(1), factorLabel: '1 N = 1 kg·m/s²' },
      { id: 'kN', symbol: 'kN', name: 'Kilonewton', ...lin(1000), factorLabel: '1 kN = 10³ N' },
      { id: 'dyne', symbol: 'dyne', name: 'Dyne (CGS)', ...lin(1e-5), factorLabel: '1 N = 10⁵ dyne' },
      { id: 'kgf', symbol: 'kgf', name: 'Kilogram-force', ...lin(9.81), factorLabel: '1 kgf = 9.81 N' },
    ],
  },
  {
    id: 'energy',
    nameEn: 'Energy / Work',
    nameHi: 'ऊर्जा / कार्य',
    baseSymbol: 'J',
    units: [
      { id: 'J', symbol: 'J', name: 'Joule (SI)', ...lin(1), factorLabel: '1 J = 1 N·m' },
      { id: 'kJ', symbol: 'kJ', name: 'Kilojoule', ...lin(1e3), factorLabel: '1 kJ = 10³ J' },
      { id: 'erg', symbol: 'erg', name: 'Erg (CGS)', ...lin(1e-7), factorLabel: '1 J = 10⁷ erg' },
      { id: 'cal', symbol: 'cal', name: 'Calorie', ...lin(4.184), factorLabel: '1 cal = 4.184 J' },
      { id: 'kcal', symbol: 'kcal', name: 'Kilocalorie', ...lin(4184), factorLabel: '1 kcal = 4184 J' },
      { id: 'eV', symbol: 'eV', name: 'Electron-Volt', ...lin(1.60218e-19), factorLabel: '1 eV = 1.602×10⁻¹⁹ J' },
      { id: 'MeV', symbol: 'MeV', name: 'Mega Electron-Volt', ...lin(1.60218e-13), factorLabel: '1 MeV = 1.602×10⁻¹³ J' },
      { id: 'kWh', symbol: 'kWh', name: 'Kilowatt-Hour', ...lin(3.6e6), factorLabel: '1 kWh = 3.6×10⁶ J' },
    ],
  },
  {
    id: 'pressure',
    nameEn: 'Pressure',
    nameHi: 'दाब',
    baseSymbol: 'Pa',
    units: [
      { id: 'Pa', symbol: 'Pa', name: 'Pascal (N/m²)', ...lin(1), factorLabel: '1 Pa = 1 N/m²' },
      { id: 'kPa', symbol: 'kPa', name: 'Kilopascal', ...lin(1000), factorLabel: '1 kPa = 10³ Pa' },
      { id: 'atm', symbol: 'atm', name: 'Standard Atmosphere', ...lin(101325), factorLabel: '1 atm = 1.013×10⁵ Pa' },
      { id: 'bar', symbol: 'bar', name: 'Bar', ...lin(1e5), factorLabel: '1 bar = 10⁵ Pa' },
      { id: 'mmHg', symbol: 'mmHg (Torr)', name: 'mm of Mercury', ...lin(133.322), factorLabel: '760 mmHg = 1 atm' },
    ],
  },
  {
    id: 'temperature',
    nameEn: 'Temperature',
    nameHi: 'तापमान',
    baseSymbol: 'K',
    units: [
      { id: 'K', symbol: 'K', name: 'Kelvin (SI)', toBase: (v) => v, fromBase: (v) => v, factorLabel: 'T(K) = T(°C) + 273.15' },
      { id: 'C', symbol: '°C', name: 'Celsius', toBase: (v) => v + 273.15, fromBase: (v) => v - 273.15, factorLabel: 'T(°C) = T(K) − 273.15' },
      {
        id: 'F',
        symbol: '°F',
        name: 'Fahrenheit',
        toBase: (v) => ((v - 32) * 5) / 9 + 273.15,
        fromBase: (v) => ((v - 273.15) * 9) / 5 + 32,
        factorLabel: 'F = (9/5)C + 32',
      },
    ],
  },
  {
    id: 'magnetic',
    nameEn: 'Magnetic Field',
    nameHi: 'चुंबकीय क्षेत्र',
    baseSymbol: 'T',
    units: [
      { id: 'T', symbol: 'T', name: 'Tesla (SI)', ...lin(1), factorLabel: '1 T = 1 Wb/m²' },
      { id: 'mT', symbol: 'mT', name: 'Millitesla', ...lin(1e-3), factorLabel: '1 mT = 10⁻³ T' },
      { id: 'G', symbol: 'G (Gauss)', name: 'Gauss (CGS)', ...lin(1e-4), factorLabel: '1 T = 10⁴ Gauss' },
    ],
  },
  {
    id: 'angle',
    nameEn: 'Angle & Rotation',
    nameHi: 'कोण व घूर्णन',
    baseSymbol: 'rad',
    units: [
      { id: 'rad', symbol: 'rad', name: 'Radian (SI)', ...lin(1), factorLabel: '2π rad = 360°' },
      { id: 'deg', symbol: '°', name: 'Degree', ...lin(Math.PI / 180), factorLabel: '1° = π/180 rad' },
      { id: 'rev', symbol: 'rev', name: 'Revolution', ...lin(2 * Math.PI), factorLabel: '1 rev = 2π rad' },
    ],
  },
  {
    id: 'time',
    nameEn: 'Time',
    nameHi: 'समय',
    baseSymbol: 's',
    units: [
      { id: 's', symbol: 's', name: 'Second (SI)', ...lin(1), factorLabel: '1 s' },
      { id: 'ms', symbol: 'ms', name: 'Millisecond', ...lin(1e-3), factorLabel: '1 ms = 10⁻³ s' },
      { id: 'min', symbol: 'min', name: 'Minute', ...lin(60), factorLabel: '1 min = 60 s' },
      { id: 'h', symbol: 'h', name: 'Hour', ...lin(3600), factorLabel: '1 h = 3600 s' },
      { id: 'day', symbol: 'day', name: 'Day', ...lin(86400), factorLabel: '1 day = 86,400 s' },
    ],
  },
];

export interface InlineUnitOption {
  label: string;
  toSI: (val: number) => number;
}

/**
 * Returns inline unit conversion dropdown options for a solver input field's SI unit.
 */
export function getInlineUnitOptions(siUnit: string): InlineUnitOption[] {
  const u = siUnit.trim();
  if (u === 'm/s') {
    return [
      { label: 'm/s', toSI: (v) => v },
      { label: 'km/h', toSI: (v) => (v * 5) / 18 },
      { label: 'cm/s', toSI: (v) => v * 0.01 },
    ];
  }
  if (u === 'm') {
    return [
      { label: 'm', toSI: (v) => v },
      { label: 'cm', toSI: (v) => v * 0.01 },
      { label: 'mm', toSI: (v) => v * 0.001 },
      { label: 'km', toSI: (v) => v * 1000 },
    ];
  }
  if (u === 'kg') {
    return [
      { label: 'kg', toSI: (v) => v },
      { label: 'g', toSI: (v) => v * 0.001 },
      { label: 'mg', toSI: (v) => v * 1e-6 },
    ];
  }
  if (u === 's') {
    return [
      { label: 's', toSI: (v) => v },
      { label: 'ms', toSI: (v) => v * 0.001 },
      { label: 'min', toSI: (v) => v * 60 },
      { label: 'h', toSI: (v) => v * 3600 },
    ];
  }
  if (u === 'J') {
    return [
      { label: 'J', toSI: (v) => v },
      { label: 'kJ', toSI: (v) => v * 1000 },
      { label: 'eV', toSI: (v) => v * 1.60218e-19 },
      { label: 'cal', toSI: (v) => v * 4.184 },
    ];
  }
  if (u === 'K') {
    return [
      { label: 'K', toSI: (v) => v },
      { label: '°C', toSI: (v) => v + 273.15 },
    ];
  }
  if (u === 'Pa') {
    return [
      { label: 'Pa', toSI: (v) => v },
      { label: 'kPa', toSI: (v) => v * 1000 },
      { label: 'atm', toSI: (v) => v * 101325 },
    ];
  }
  if (u === 'N') {
    return [
      { label: 'N', toSI: (v) => v },
      { label: 'kN', toSI: (v) => v * 1000 },
      { label: 'dyne', toSI: (v) => v * 1e-5 },
    ];
  }
  return [{ label: u || 'SI', toSI: (v) => v }];
}

// ================= PHYSICAL CONSTANTS DECK =================

export interface PhysicalConstantItem {
  id: string;
  symbol: string;
  nameEn: string;
  nameHi: string;
  displayValue: string;
  numericValue: number;
  unit: string;
  dimension: string;
  category: 'Mechanics' | 'Thermodynamics' | 'Electromagnetism' | 'Modern Physics';
}

export const PHYSICAL_CONSTANTS: PhysicalConstantItem[] = [
  { id: 'c', symbol: 'c', nameEn: 'Speed of Light in Vacuum', nameHi: 'निर्वात में प्रकाश की चाल', displayValue: '2.998 × 10⁸', numericValue: 2.99792458e8, unit: 'm/s', dimension: '[L T⁻¹]', category: 'Electromagnetism' },
  { id: 'G', symbol: 'G', nameEn: 'Universal Gravitational Constant', nameHi: 'सार्वत्रिक गुरुत्वाकर्षण नियतांक', displayValue: '6.674 × 10⁻¹¹', numericValue: 6.6743e-11, unit: 'N·m²/kg²', dimension: '[M⁻¹ L³ T⁻²]', category: 'Mechanics' },
  { id: 'g', symbol: 'g', nameEn: 'Standard Gravity (Earth)', nameHi: 'गुरुत्वीय त्वरण (पृथ्वी)', displayValue: '9.81', numericValue: 9.81, unit: 'm/s²', dimension: '[L T⁻²]', category: 'Mechanics' },
  { id: 'h', symbol: 'h', nameEn: 'Planck’s Constant', nameHi: 'प्लांक नियतांक', displayValue: '6.626 × 10⁻³⁴', numericValue: 6.62607e-34, unit: 'J·s', dimension: '[M L² T⁻¹]', category: 'Modern Physics' },
  { id: 'hbar', symbol: 'ℏ', nameEn: 'Reduced Planck Constant (h/2π)', nameHi: 'समानीत प्लांक नियतांक', displayValue: '1.055 × 10⁻³⁴', numericValue: 1.05457e-34, unit: 'J·s', dimension: '[M L² T⁻¹]', category: 'Modern Physics' },
  { id: 'e', symbol: 'e', nameEn: 'Elementary Charge', nameHi: 'मूल आवेश', displayValue: '1.602 × 10⁻¹⁹', numericValue: 1.60218e-19, unit: 'C', dimension: '[A T]', category: 'Electromagnetism' },
  { id: 'me', symbol: 'mₑ', nameEn: 'Electron Rest Mass', nameHi: 'इलेक्ट्रॉन का द्रव्यमान', displayValue: '9.109 × 10⁻³¹', numericValue: 9.10938e-31, unit: 'kg', dimension: '[M]', category: 'Modern Physics' },
  { id: 'mp', symbol: 'mₚ', nameEn: 'Proton Rest Mass', nameHi: 'प्रोटॉन का द्रव्यमान', displayValue: '1.673 × 10⁻²⁷', numericValue: 1.67262e-27, unit: 'kg', dimension: '[M]', category: 'Modern Physics' },
  { id: 'eps0', symbol: 'ε₀', nameEn: 'Permittivity of Free Space', nameHi: 'निर्वात की विद्युतशीलता', displayValue: '8.854 × 10⁻¹²', numericValue: 8.85419e-12, unit: 'F/m', dimension: '[M⁻¹ L⁻³ T⁴ A²]', category: 'Electromagnetism' },
  { id: 'mu0', symbol: 'μ₀', nameEn: 'Permeability of Free Space', nameHi: 'निर्वात की चुंबकशीलता', displayValue: '4π × 10⁻⁷', numericValue: 1.25664e-6, unit: 'T·m/A', dimension: '[M L T⁻² A⁻²]', category: 'Electromagnetism' },
  { id: 'ke', symbol: 'kₑ', nameEn: 'Coulomb Constant (1/4πε₀)', nameHi: 'कूलॉम नियतांक', displayValue: '8.988 × 10⁹', numericValue: 8.98755e9, unit: 'N·m²/C²', dimension: '[M L³ T⁻⁴ A⁻²]', category: 'Electromagnetism' },
  { id: 'kB', symbol: 'k_B', nameEn: 'Boltzmann Constant', nameHi: 'बोल्ट्ज़मान नियतांक', displayValue: '1.381 × 10⁻²³', numericValue: 1.38065e-23, unit: 'J/K', dimension: '[M L² T⁻² K⁻¹]', category: 'Thermodynamics' },
  { id: 'R', symbol: 'R', nameEn: 'Universal Gas Constant', nameHi: 'सार्वत्रिक गैस नियतांक', displayValue: '8.314', numericValue: 8.31446, unit: 'J/(mol·K)', dimension: '[M L² T⁻² K⁻¹ mol⁻¹]', category: 'Thermodynamics' },
  { id: 'NA', symbol: 'N_A', nameEn: 'Avogadro’s Number', nameHi: 'आवोगाद्रो संख्या', displayValue: '6.022 × 10²³', numericValue: 6.02214e23, unit: 'mol⁻¹', dimension: '[mol⁻¹]', category: 'Thermodynamics' },
  { id: 'sigma', symbol: 'σ', nameEn: 'Stefan–Boltzmann Constant', nameHi: 'स्टीफन–बोल्ट्ज़मान नियतांक', displayValue: '5.670 × 10⁻⁸', numericValue: 5.67037e-8, unit: 'W/(m²·K⁴)', dimension: '[M T⁻³ K⁻⁴]', category: 'Thermodynamics' },
  { id: 'a0', symbol: 'a₀', nameEn: 'Bohr Radius (n = 1)', nameHi: 'बोर त्रिज्या', displayValue: '5.292 × 10⁻¹¹', numericValue: 5.29177e-11, unit: 'm', dimension: '[L]', category: 'Modern Physics' },
  { id: 'Rinf', symbol: 'R_∞', nameEn: 'Rydberg Constant', nameHi: 'रिडबर्ग नियतांक', displayValue: '1.097 × 10⁷', numericValue: 1.09737e7, unit: 'm⁻¹', dimension: '[L⁻¹]', category: 'Modern Physics' },
];
