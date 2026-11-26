/**
 * Pure TypeScript recursive-descent mathematical expression evaluator.
 * Safely evaluates physics expressions without eval() or new Function().
 */

const BUILTIN_CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  PI: Math.PI,
  e: Math.E,
  g: 9.81,
  G: 6.674e-11,
  c: 3e8,
  k_e: 8.988e9,
  R_gas: 8.314,
};

const BUILTIN_FUNCTIONS: Record<string, (...args: number[]) => number> = {
  sin: (x) => Math.sin(x),
  cos: (x) => Math.cos(x),
  tan: (x) => Math.tan(x),
  asin: (x) => Math.asin(x),
  acos: (x) => Math.acos(x),
  atan: (x) => Math.atan(x),
  sqrt: (x) => (x < 0 ? NaN : Math.sqrt(x)),
  abs: (x) => Math.abs(x),
  log: (x) => Math.log10(x),
  ln: (x) => Math.log(x),
  exp: (x) => Math.exp(x),
  pow: (a, b) => Math.pow(a, b),
  min: (...args) => Math.min(...args),
  max: (...args) => Math.max(...args),
};

type TokenType = 'number' | 'ident' | 'op' | 'lparen' | 'rparen' | 'comma' | 'eof';

interface Token {
  type: TokenType;
  value: string;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const cleaned = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

  while (i < cleaned.length) {
    const ch = cleaned[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      while (i < cleaned.length && /[0-9.]/.test(cleaned[i])) {
        numStr += cleaned[i++];
      }
      if (i < cleaned.length && (cleaned[i] === 'e' || cleaned[i] === 'E')) {
        const next = cleaned[i + 1];
        if (next && /[0-9+-]/.test(next)) {
          numStr += cleaned[i++];
          if (cleaned[i] === '+' || cleaned[i] === '-') {
            numStr += cleaned[i++];
          }
          while (i < cleaned.length && /[0-9]/.test(cleaned[i])) {
            numStr += cleaned[i++];
          }
        }
      }
      tokens.push({ type: 'number', value: numStr });
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let ident = '';
      while (i < cleaned.length && /[a-zA-Z0-9_]/.test(cleaned[i])) {
        ident += cleaned[i++];
      }
      tokens.push({ type: 'ident', value: ident });
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen', value: '(' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'rparen', value: ')' });
      i++;
      continue;
    }
    if (ch === ',') {
      tokens.push({ type: 'comma', value: ',' });
      i++;
      continue;
    }
    if ('+-*/^'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    throw new Error(`Unexpected character "${ch}"`);
  }

  tokens.push({ type: 'eof', value: '' });
  return tokens;
}

export function evaluateExpression(
  expression: string,
  variables: Record<string, number>
): { value: number | null; error?: string } {
  if (!expression || !expression.trim()) {
    return { value: null, error: 'Empty expression' };
  }

  try {
    const tokens = tokenize(expression);
    let pos = 0;

    const peek = () => tokens[pos];
    const consume = () => tokens[pos++];

    function parseAddSub(): number {
      let left = parseMulDiv();
      while (peek().type === 'op' && (peek().value === '+' || peek().value === '-')) {
        const op = consume().value;
        const right = parseMulDiv();
        left = op === '+' ? left + right : left - right;
      }
      return left;
    }

    function parseMulDiv(): number {
      let left = parseUnary();
      while (peek().type === 'op' && (peek().value === '*' || peek().value === '/')) {
        const op = consume().value;
        const right = parseUnary();
        left = op === '*' ? left * right : right === 0 ? NaN : left / right;
      }
      return left;
    }

    function parseUnary(): number {
      if (peek().type === 'op' && (peek().value === '+' || peek().value === '-')) {
        const op = consume().value;
        const val = parseUnary();
        return op === '-' ? -val : val;
      }
      return parsePower();
    }

    function parsePower(): number {
      const base = parsePrimary();
      if (peek().type === 'op' && peek().value === '^') {
        consume();
        const exponent = parseUnary();
        return Math.pow(base, exponent);
      }
      return base;
    }

    function parsePrimary(): number {
      const tok = peek();
      if (tok.type === 'number') {
        consume();
        const n = Number(tok.value);
        if (Number.isNaN(n)) throw new Error(`Invalid number ${tok.value}`);
        return n;
      }

      if (tok.type === 'ident') {
        consume();
        const name = tok.value;

        if (peek().type === 'lparen') {
          consume();
          const args: number[] = [];
          if (peek().type !== 'rparen') {
            args.push(parseAddSub());
            while (peek().type === 'comma') {
              consume();
              args.push(parseAddSub());
            }
          }
          if (peek().type !== 'rparen') {
            throw new Error(`Missing closing parenthesis for ${name}`);
          }
          consume();
          const fn = BUILTIN_FUNCTIONS[name.toLowerCase()];
          if (!fn) throw new Error(`Unknown function ${name}`);
          return fn(...args);
        }

        if (Object.prototype.hasOwnProperty.call(variables, name)) {
          return variables[name];
        }
        if (Object.prototype.hasOwnProperty.call(BUILTIN_CONSTANTS, name)) {
          return BUILTIN_CONSTANTS[name];
        }
        // Fallback case-insensitive lookup
        const lowerKey = Object.keys(variables).find((k) => k.toLowerCase() === name.toLowerCase());
        if (lowerKey !== undefined) {
          return variables[lowerKey];
        }
        throw new Error(`Unknown variable ${name}`);
      }

      if (tok.type === 'lparen') {
        consume();
        const val = parseAddSub();
        if (peek().type !== 'rparen') {
          throw new Error('Missing closing parenthesis');
        }
        consume();
        return val;
      }

      throw new Error(`Unexpected token "${tok.value || tok.type}"`);
    }

    const result = parseAddSub();
    if (peek().type !== 'eof') {
      return { value: null, error: `Unexpected trailing token "${peek().value}"` };
    }
    if (!Number.isFinite(result)) {
      return { value: null, error: 'Non-finite result' };
    }
    return { value: result };
  } catch (err) {
    return {
      value: null,
      error: err instanceof Error ? err.message : 'Expression error',
    };
  }
}

export function formatPhysicsNumber(val: number, decimals = 2): string {
  if (!Number.isFinite(val)) return '—';
  const abs = Math.abs(val);
  if (abs === 0) return '0';
  if (abs >= 1e5 || (abs > 0 && abs < 1e-3)) {
    const expStr = val.toExponential(2);
    const [mantissa, exp] = expStr.split('e');
    const expNum = Number(exp);
    return `${mantissa} × 10^${expNum}`;
  }
  if (abs >= 100) return val.toFixed(1);
  return Number(val.toFixed(decimals)).toString();
}
