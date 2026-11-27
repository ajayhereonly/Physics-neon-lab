/**
 * Pure TypeScript Dimensional Analysis & Formula Homogeneity Checker.
 * Supports [M, L, T, A, K] exponent algebra and linear-system exponent derivation.
 */

export interface DimVec {
  M: number;
  L: number;
  T: number;
  A: number;
  K: number;
}

export interface PhysicsSymbolDim {
  symbol: string;
  nameEn: string;
  nameHi: string;
  dim: DimVec;
}

const d = (M = 0, L = 0, T = 0, A = 0, K = 0): DimVec => ({ M, L, T, A, K });

export const DIM_SYMBOLS: PhysicsSymbolDim[] = [
  // Kinematics & Mechanics
  { symbol: 'm', nameEn: 'Mass', nameHi: 'द्रव्यमान', dim: d(1, 0, 0, 0, 0) },
  { symbol: 'M', nameEn: 'Mass (Large)', nameHi: 'द्रव्यमान', dim: d(1, 0, 0, 0, 0) },
  { symbol: 'l', nameEn: 'Length', nameHi: 'लंबाई', dim: d(0, 1, 0, 0, 0) },
  { symbol: 's', nameEn: 'Displacement / Distance', nameHi: 'विस्थापन / दूरी', dim: d(0, 1, 0, 0, 0) },
  { symbol: 'd', nameEn: 'Distance', nameHi: 'दूरी', dim: d(0, 1, 0, 0, 0) },
  { symbol: 'h', nameEn: 'Height', nameHi: 'ऊँचाई', dim: d(0, 1, 0, 0, 0) },
  { symbol: 'r', nameEn: 'Radius', nameHi: 'त्रिज्या', dim: d(0, 1, 0, 0, 0) },
  { symbol: 'R', nameEn: 'Radius', nameHi: 'त्रिज्या', dim: d(0, 1, 0, 0, 0) },
  { symbol: 'x', nameEn: 'Position', nameHi: 'स्थिति', dim: d(0, 1, 0, 0, 0) },
  { symbol: 'A_area', nameEn: 'Area', nameHi: 'क्षेत्रफल', dim: d(0, 2, 0, 0, 0) },
  { symbol: 'Vol', nameEn: 'Volume', nameHi: 'आयतन', dim: d(0, 3, 0, 0, 0) },
  { symbol: 't', nameEn: 'Time', nameHi: 'समय', dim: d(0, 0, 1, 0, 0) },
  { symbol: 'T_period', nameEn: 'Time Period', nameHi: 'आवर्तकाल', dim: d(0, 0, 1, 0, 0) },
  { symbol: 'v', nameEn: 'Velocity / Speed', nameHi: 'वेग / चाल', dim: d(0, 1, -1, 0, 0) },
  { symbol: 'u', nameEn: 'Initial Velocity', nameHi: 'प्रारंभिक वेग', dim: d(0, 1, -1, 0, 0) },
  { symbol: 'c', nameEn: 'Speed of Light', nameHi: 'प्रकाश की चाल', dim: d(0, 1, -1, 0, 0) },
  { symbol: 'a', nameEn: 'Acceleration', nameHi: 'त्वरण', dim: d(0, 1, -2, 0, 0) },
  { symbol: 'g', nameEn: 'Gravitational Accel.', nameHi: 'गुरुत्वीय त्वरण', dim: d(0, 1, -2, 0, 0) },
  { symbol: 'F', nameEn: 'Force', nameHi: 'बल', dim: d(1, 1, -2, 0, 0) },
  { symbol: 'p', nameEn: 'Linear Momentum', nameHi: 'रैखिक संवेग', dim: d(1, 1, -1, 0, 0) },
  { symbol: 'J', nameEn: 'Impulse', nameHi: 'आवेग', dim: d(1, 1, -1, 0, 0) },
  { symbol: 'W', nameEn: 'Work / Energy', nameHi: 'कार्य / ऊर्जा', dim: d(1, 2, -2, 0, 0) },
  { symbol: 'E', nameEn: 'Energy', nameHi: 'ऊर्जा', dim: d(1, 2, -2, 0, 0) },
  { symbol: 'K', nameEn: 'Kinetic Energy', nameHi: 'गतिज ऊर्जा', dim: d(1, 2, -2, 0, 0) },
  { symbol: 'U', nameEn: 'Potential Energy', nameHi: 'स्थितिज ऊर्जा', dim: d(1, 2, -2, 0, 0) },
  { symbol: 'Pow', nameEn: 'Power', nameHi: 'शक्ति', dim: d(1, 2, -3, 0, 0) },
  { symbol: 'P', nameEn: 'Pressure / Stress', nameHi: 'दाब / प्रतिबल', dim: d(1, -1, -2, 0, 0) },
  { symbol: 'rho', nameEn: 'Density', nameHi: 'घनत्व', dim: d(1, -3, 0, 0, 0) },
  { symbol: 'eta', nameEn: 'Viscosity', nameHi: 'श्यानता गुणांक', dim: d(1, -1, -1, 0, 0) },
  { symbol: 'S_ten', nameEn: 'Surface Tension', nameHi: 'पृष्ठ तनाव', dim: d(1, 0, -2, 0, 0) },
  { symbol: 'Y', nameEn: 'Young’s Modulus', nameHi: 'यंग गुणांक', dim: d(1, -1, -2, 0, 0) },
  { symbol: 'k', nameEn: 'Spring Constant', nameHi: 'स्प्रिंग नियतांक', dim: d(1, 0, -2, 0, 0) },
  // Rotational & Gravitation
  { symbol: 'I_moi', nameEn: 'Moment of Inertia', nameHi: 'जड़त्व आघूर्ण', dim: d(1, 2, 0, 0, 0) },
  { symbol: 'L', nameEn: 'Angular Momentum', nameHi: 'कोणीय संवेग', dim: d(1, 2, -1, 0, 0) },
  { symbol: 'tau', nameEn: 'Torque', nameHi: 'बल आघूर्ण', dim: d(1, 2, -2, 0, 0) },
  { symbol: 'omega', nameEn: 'Angular Velocity', nameHi: 'कोणीय वेग', dim: d(0, 0, -1, 0, 0) },
  { symbol: 'alpha', nameEn: 'Angular Accel.', nameHi: 'कोणीय त्वरण', dim: d(0, 0, -2, 0, 0) },
  { symbol: 'f', nameEn: 'Frequency', nameHi: 'आवृत्ति', dim: d(0, 0, -1, 0, 0) },
  { symbol: 'lambda', nameEn: 'Wavelength', nameHi: 'तरंगदैर्ध्य', dim: d(0, 1, 0, 0, 0) },
  { symbol: 'G', nameEn: 'Gravitational Constant', nameHi: 'गुरुत्वाकर्षण नियतांक', dim: d(-1, 3, -2, 0, 0) },
  // Electromagnetism & Modern
  { symbol: 'I', nameEn: 'Electric Current', nameHi: 'विद्युत धारा', dim: d(0, 0, 0, 1, 0) },
  { symbol: 'q', nameEn: 'Electric Charge', nameHi: 'विद्युत आवेश', dim: d(0, 0, 1, 1, 0) },
  { symbol: 'Q', nameEn: 'Electric Charge', nameHi: 'विद्युत आवेश', dim: d(0, 0, 1, 1, 0) },
  { symbol: 'V', nameEn: 'Electric Potential / Voltage', nameHi: 'विभवांतर', dim: d(1, 2, -3, -1, 0) },
  { symbol: 'R_res', nameEn: 'Resistance', nameHi: 'प्रतिरोध', dim: d(1, 2, -3, -2, 0) },
  { symbol: 'C', nameEn: 'Capacitance', nameHi: 'धारिता', dim: d(-1, -2, 4, 2, 0) },
  { symbol: 'L_ind', nameEn: 'Inductance', nameHi: 'प्रेरकत्व', dim: d(1, 2, -2, -2, 0) },
  { symbol: 'E_field', nameEn: 'Electric Field', nameHi: 'विद्युत क्षेत्र', dim: d(1, 1, -3, -1, 0) },
  { symbol: 'B', nameEn: 'Magnetic Field', nameHi: 'चुंबकीय क्षेत्र', dim: d(1, 0, -2, -1, 0) },
  { symbol: 'eps0', nameEn: 'Permittivity (ε₀)', nameHi: 'विद्युतशीलता', dim: d(-1, -3, 4, 2, 0) },
  { symbol: 'mu0', nameEn: 'Permeability (μ₀)', nameHi: 'चुंबकशीलता', dim: d(1, 1, -2, -2, 0) },
  { symbol: 'h_p', nameEn: 'Planck’s Constant', nameHi: 'प्लांक नियतांक', dim: d(1, 2, -1, 0, 0) },
  { symbol: 'Temp', nameEn: 'Temperature', nameHi: 'तापमान', dim: d(0, 0, 0, 0, 1) },
  { symbol: 'k_B', nameEn: 'Boltzmann Constant', nameHi: 'बोल्ट्ज़मान नियतांक', dim: d(1, 2, -2, 0, -1) },
  { symbol: 'pi', nameEn: 'Pi (Dimensionless)', nameHi: 'पाई (विमाहीन)', dim: d(0, 0, 0, 0, 0) },
  { symbol: 'theta', nameEn: 'Angle (Dimensionless)', nameHi: 'कोण (विमाहीन)', dim: d(0, 0, 0, 0, 0) },
];

const SYMBOL_MAP = new Map<string, DimVec>(DIM_SYMBOLS.map((s) => [s.symbol, s.dim]));

export function dimsEqual(a: DimVec, b: DimVec): boolean {
  const eps = 1e-6;
  return (
    Math.abs(a.M - b.M) < eps &&
    Math.abs(a.L - b.L) < eps &&
    Math.abs(a.T - b.T) < eps &&
    Math.abs(a.A - b.A) < eps &&
    Math.abs(a.K - b.K) < eps
  );
}

function addDim(a: DimVec, b: DimVec): DimVec {
  return { M: a.M + b.M, L: a.L + b.L, T: a.T + b.T, A: a.A + b.A, K: a.K + b.K };
}

function subDim(a: DimVec, b: DimVec): DimVec {
  return { M: a.M - b.M, L: a.L - b.L, T: a.T - b.T, A: a.A - b.A, K: a.K - b.K };
}

function scaleDim(a: DimVec, k: number): DimVec {
  return { M: a.M * k, L: a.L * k, T: a.T * k, A: a.A * k, K: a.K * k };
}

function toSuper(n: number): string {
  const rounded = Math.abs(n - Math.round(n)) < 1e-6 ? String(Math.round(n)) : Number(n.toFixed(2)).toString();
  const map: Record<string, string> = {
    '-': '⁻',
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
    '.': '·',
  };
  return rounded
    .split('')
    .map((c) => map[c] ?? c)
    .join('');
}

export function formatDimVec(v: DimVec): string {
  const parts: string[] = [];
  const entries: [string, number][] = [
    ['M', v.M],
    ['L', v.L],
    ['T', v.T],
    ['A', v.A],
    ['K', v.K],
  ];
  for (const [label, exp] of entries) {
    if (Math.abs(exp) > 1e-6) {
      parts.push(Math.abs(exp - 1) < 1e-6 ? label : `${label}${toSuper(exp)}`);
    }
  }
  return parts.length === 0 ? '[M⁰ L⁰ T⁰] (Dimensionless)' : `[${parts.join(' ')}]`;
}

interface DimEvalResult {
  dim: DimVec | null;
  error?: string;
}

/**
 * Recursive-descent dimensional expression evaluator.
 */
export function evaluateDimension(expr: string): DimEvalResult {
  const cleaned = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').trim();
  if (!cleaned) return { dim: null, error: 'Empty expression' };

  type Tok = { type: 'num' | 'id' | 'op' | 'lp' | 'rp' | 'eof'; val: string };
  const tokens: Tok[] = [];
  let i = 0;
  while (i < cleaned.length) {
    const ch = cleaned[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let s = '';
      while (i < cleaned.length && /[0-9.]/.test(cleaned[i])) s += cleaned[i++];
      tokens.push({ type: 'num', val: s });
      continue;
    }
    if (/[a-zA-Z_]/.test(ch)) {
      let s = '';
      while (i < cleaned.length && /[a-zA-Z0-9_]/.test(cleaned[i])) s += cleaned[i++];
      tokens.push({ type: 'id', val: s });
      continue;
    }
    if (ch === '(') {
      tokens.push({ type: 'lp', val: '(' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'rp', val: ')' });
      i++;
      continue;
    }
    if ('+-*/^'.includes(ch)) {
      tokens.push({ type: 'op', val: ch });
      i++;
      continue;
    }
    return { dim: null, error: `Unsupported symbol "${ch}"` };
  }
  tokens.push({ type: 'eof', val: '' });

  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  function parseNumericScalar(): number {
    let sign = 1;
    if (peek().type === 'op' && (peek().val === '+' || peek().val === '-')) {
      sign = next().val === '-' ? -1 : 1;
    }
    if (peek().type === 'lp') {
      next();
      const left = parseNumericScalar();
      if (peek().type === 'op' && peek().val === '/') {
        next();
        const right = parseNumericScalar();
        if (peek().type !== 'rp') throw new Error('Missing closing parenthesis in exponent');
        next();
        return sign * (left / right);
      }
      if (peek().type !== 'rp') throw new Error('Missing closing parenthesis in exponent');
      next();
      return sign * left;
    }
    if (peek().type === 'num') {
      return sign * Number(next().val);
    }
    throw new Error('Exponents must be numeric constants (e.g. ^2, ^0.5, ^(-1))');
  }

  function parseAddSub(): DimVec {
    const left = parseMulDiv();
    while (peek().type === 'op' && (peek().val === '+' || peek().val === '-')) {
      const op = next().val;
      const right = parseMulDiv();
      if (!dimsEqual(left, right)) {
        throw new Error(
          `Cannot ${op === '+' ? 'add' : 'subtract'} incompatible dimensions ${formatDimVec(left)} and ${formatDimVec(right)}`
        );
      }
    }
    return left;
  }

  function parseMulDiv(): DimVec {
    let left = parseUnary();
    while (peek().type === 'op' && (peek().val === '*' || peek().val === '/')) {
      const op = next().val;
      const right = parseUnary();
      left = op === '*' ? addDim(left, right) : subDim(left, right);
    }
    return left;
  }

  function parseUnary(): DimVec {
    if (peek().type === 'op' && (peek().val === '+' || peek().val === '-')) {
      next();
      return parseUnary();
    }
    return parsePow();
  }

  function parsePow(): DimVec {
    const base = parsePrimary();
    if (peek().type === 'op' && peek().val === '^') {
      next();
      const exp = parseNumericScalar();
      return scaleDim(base, exp);
    }
    return base;
  }

  function parsePrimary(): DimVec {
    const tok = peek();
    if (tok.type === 'num') {
      next();
      return d(0, 0, 0, 0, 0);
    }
    if (tok.type === 'id') {
      next();
      const name = tok.val;
      if (peek().type === 'lp') {
        next();
        const arg = parseAddSub();
        if (peek().type !== 'rp') throw new Error(`Missing ')' after ${name}(`);
        next();
        if (name === 'sqrt') return scaleDim(arg, 0.5);
        if (['sin', 'cos', 'tan', 'exp', 'ln', 'log'].includes(name)) {
          if (!dimsEqual(arg, d())) {
            throw new Error(`Argument of ${name}() must be dimensionless, got ${formatDimVec(arg)}`);
          }
          return d();
        }
        throw new Error(`Unknown function "${name}"`);
      }
      const found = SYMBOL_MAP.get(name);
      if (found) return found;
      throw new Error(`Unknown physics symbol "${name}". Open Symbol Reference to see valid keys.`);
    }
    if (tok.type === 'lp') {
      next();
      const inner = parseAddSub();
      if (peek().type !== 'rp') throw new Error('Missing closing parenthesis ")"');
      next();
      return inner;
    }
    throw new Error(`Unexpected token "${tok.val || tok.type}"`);
  }

  try {
    const res = parseAddSub();
    if (peek().type !== 'eof') {
      return { dim: null, error: `Unexpected trailing token "${peek().val}"` };
    }
    return { dim: res };
  } catch (err) {
    return { dim: null, error: err instanceof Error ? err.message : 'Dimensional parse error' };
  }
}

export interface HomogeneityCheckResult {
  isConsistent: boolean;
  lhsDim: DimVec | null;
  rhsDim: DimVec | null;
  lhsFormatted: string;
  rhsFormatted: string;
  error?: string;
}

export function checkDimensionalEquation(lhs: string, rhs: string): HomogeneityCheckResult {
  const l = evaluateDimension(lhs);
  if (!l.dim) {
    return { isConsistent: false, lhsDim: null, rhsDim: null, lhsFormatted: '—', rhsFormatted: '—', error: `LHS: ${l.error}` };
  }
  const r = evaluateDimension(rhs);
  if (!r.dim) {
    return {
      isConsistent: false,
      lhsDim: l.dim,
      rhsDim: null,
      lhsFormatted: formatDimVec(l.dim),
      rhsFormatted: '—',
      error: `RHS: ${r.error}`,
    };
  }
  return {
    isConsistent: dimsEqual(l.dim, r.dim),
    lhsDim: l.dim,
    rhsDim: r.dim,
    lhsFormatted: formatDimVec(l.dim),
    rhsFormatted: formatDimVec(r.dim),
  };
}

/**
 * Solves target ∝ v1^a * v2^b (* v3^c) via Gaussian elimination over [M, L, T, A, K].
 */
export function deriveDimensionalExponents(
  targetSymbol: string,
  varSymbols: string[]
): { exponents: number[]; formulaText: string } | { error: string } {
  const target = SYMBOL_MAP.get(targetSymbol);
  if (!target) return { error: `Unknown target quantity "${targetSymbol}".` };
  const cols = varSymbols.map((s) => SYMBOL_MAP.get(s));
  if (cols.some((c) => !c)) return { error: 'One or more variable symbols are unknown.' };
  const vecs = cols as DimVec[];
  const k = vecs.length;
  if (k === 0 || k > 3) return { error: 'Pick 1 to 3 independent base variables.' };

  const rows: number[][] = [
    [...vecs.map((v) => v.M), target.M],
    [...vecs.map((v) => v.L), target.L],
    [...vecs.map((v) => v.T), target.T],
    [...vecs.map((v) => v.A), target.A],
    [...vecs.map((v) => v.K), target.K],
  ];

  // Solve least-squares normal equations (A^T A x = A^T b) then verify exact zero residual!
  const ata: number[][] = Array.from({ length: k }, () => Array(k + 1).fill(0));
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      let s = 0;
      for (let r = 0; r < 5; r++) s += rows[r][i] * rows[r][j];
      ata[i][j] = s;
    }
    let sb = 0;
    for (let r = 0; r < 5; r++) sb += rows[r][i] * rows[r][k];
    ata[i][k] = sb;
  }

  // Gaussian elimination with partial pivoting
  for (let col = 0; col < k; col++) {
    let pivotRow = col;
    for (let r = col + 1; r < k; r++) {
      if (Math.abs(ata[r][col]) > Math.abs(ata[pivotRow][col])) pivotRow = r;
    }
    if (Math.abs(ata[pivotRow][col]) < 1e-9) {
      return { error: 'Chosen variables are dimensionally dependent (no unique solution).' };
    }
    [ata[col], ata[pivotRow]] = [ata[pivotRow], ata[col]];
    const div = ata[col][col];
    for (let j = col; j <= k; j++) ata[col][j] /= div;
    for (let r = 0; r < k; r++) {
      if (r === col) continue;
      const factor = ata[r][col];
      for (let j = col; j <= k; j++) ata[r][j] -= factor * ata[col][j];
    }
  }

  const sol = ata.map((row) => row[k]);
  // Verify exact dimensional match across all 5 axes
  for (let r = 0; r < 5; r++) {
    let lhs = 0;
    for (let j = 0; j < k; j++) lhs += rows[r][j] * sol[j];
    if (Math.abs(lhs - rows[r][k]) > 1e-5) {
      return {
        error: `Cannot express ${targetSymbol} purely in terms of (${varSymbols.join(', ')}) — missing a fundamental dimension.`,
      };
    }
  }

  const fmtExp = (n: number) => {
    const clean = Math.abs(n) < 1e-6 ? 0 : n;
    if (Math.abs(clean - 0.5) < 1e-4) return '^(1/2)';
    if (Math.abs(clean + 0.5) < 1e-4) return '^(-1/2)';
    if (Math.abs(clean - 1.5) < 1e-4) return '^(3/2)';
    if (Math.abs(clean - Math.round(clean)) < 1e-4) {
      const r = Math.round(clean);
      return r === 1 ? '' : `^${r}`;
    }
    return `^(${clean.toFixed(2)})`;
  };

  const rhsParts = varSymbols
    .map((sym, idx) => (Math.abs(sol[idx]) < 1e-6 ? null : `${sym}${fmtExp(sol[idx])}`))
    .filter(Boolean);

  return {
    exponents: sol,
    formulaText: `${targetSymbol} ∝ ${rhsParts.length > 0 ? rhsParts.join(' · ') : '1 (Dimensionless)'}`,
  };
}
