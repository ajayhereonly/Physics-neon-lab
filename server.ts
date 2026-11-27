import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SIMULATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    titleEn: { type: Type.STRING, description: 'Clear English simulation title (e.g. Escape Velocity).' },
    titleHi: { type: Type.STRING, description: 'Accurate Hindi Devanagari title (e.g. पलायन वेग).' },
    subtitleEn: { type: Type.STRING, description: 'Short 1-line English concept subtitle.' },
    subtitleHi: { type: Type.STRING, description: 'Short 1-line Hindi Devanagari concept subtitle.' },
    chapterEn: { type: Type.STRING, description: 'Physics chapter name in English.' },
    chapterHi: { type: Type.STRING, description: 'Physics chapter name in Hindi.' },
    formulaDisplay: { type: Type.STRING, description: 'Standard readable symbolic formula, e.g. v_e = √(2GM / R).' },
    visualTemplate: {
      type: Type.STRING,
      enum: [
        'orbital',
        'projectile',
        'linear-force',
        'oscillator',
        'wave',
        'field-particles',
        'thermal-gas',
        'fluid-flow',
      ],
      description: 'Best matching interactive physics animation engine template.',
    },
    variables: {
      type: Type.ARRAY,
      description: '2 to 4 controllable slider variables used in the math expressions.',
      items: {
        type: Type.OBJECT,
        properties: {
          key: { type: Type.STRING, description: 'Short ASCII variable key used in expressions, e.g. m, r, v, T, P, f.' },
          symbol: { type: Type.STRING, description: 'Display symbol, e.g. M, R, θ, ω.' },
          labelEn: { type: Type.STRING, description: 'English parameter name.' },
          labelHi: { type: Type.STRING, description: 'Hindi Devanagari parameter name.' },
          unit: { type: Type.STRING, description: 'SI unit symbol, e.g. kg, m, m/s, K, Hz, rad.' },
          min: { type: Type.NUMBER },
          max: { type: Type.NUMBER },
          step: { type: Type.NUMBER },
          defaultValue: { type: Type.NUMBER },
        },
        required: ['key', 'symbol', 'labelEn', 'labelHi', 'unit', 'min', 'max', 'step', 'defaultValue'],
      },
    },
    primaryOutput: {
      type: Type.OBJECT,
      properties: {
        symbol: { type: Type.STRING, description: 'Output symbol e.g. F, v_e, P, f_obs.' },
        labelEn: { type: Type.STRING },
        labelHi: { type: Type.STRING },
        unit: { type: Type.STRING },
        expression: {
          type: Type.STRING,
          description:
            'Valid ASCII math expression using variable keys and operators + - * / ^ ( ) and functions sqrt, sin, cos, tan, abs, log, exp, and constants pi, g (9.81). Keep numbers in sensible classroom scale (avoid tiny 1e-11 unless handled cleanly).',
        },
        accent: {
          type: Type.STRING,
          enum: ['force', 'velocity', 'momentum', 'energy'],
        },
      },
      required: ['symbol', 'labelEn', 'labelHi', 'unit', 'expression', 'accent'],
    },
    secondaryOutputs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          symbol: { type: Type.STRING },
          labelEn: { type: Type.STRING },
          labelHi: { type: Type.STRING },
          unit: { type: Type.STRING },
          expression: { type: Type.STRING },
        },
        required: ['symbol', 'labelEn', 'labelHi', 'unit', 'expression'],
      },
    },
    graphXVar: {
      type: Type.STRING,
      description: 'Must match one of the variable keys to sweep on the X-axis of the live curve.',
    },
    explanationEn: {
      type: Type.STRING,
      description: 'Concise, vivid 2-sentence classroom explanation in English.',
    },
    explanationHi: {
      type: Type.STRING,
      description: 'Concise, natural 2-sentence classroom explanation in Hindi (Devanagari).',
    },
    realLifeEn: {
      type: Type.STRING,
      description: '1-sentence everyday real-life example in English.',
    },
    realLifeHi: {
      type: Type.STRING,
      description: '1-sentence everyday real-life example in Hindi (Devanagari).',
    },
    whatIfPrompts: {
      type: Type.ARRAY,
      description: 'Exactly 2 classroom What-If prediction challenges.',
      items: {
        type: Type.OBJECT,
        properties: {
          questionEn: { type: Type.STRING },
          questionHi: { type: Type.STRING },
          hintEn: { type: Type.STRING },
          hintHi: { type: Type.STRING },
          answerEn: { type: Type.STRING },
          answerHi: { type: Type.STRING },
          targetValues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                key: { type: Type.STRING },
                value: { type: Type.NUMBER },
              },
              required: ['key', 'value'],
            },
          },
        },
        required: ['questionEn', 'questionHi', 'hintEn', 'hintHi', 'answerEn', 'answerHi', 'targetValues'],
      },
    },
  },
  required: [
    'titleEn',
    'titleHi',
    'subtitleEn',
    'subtitleHi',
    'chapterEn',
    'chapterHi',
    'formulaDisplay',
    'visualTemplate',
    'variables',
    'primaryOutput',
    'secondaryOutputs',
    'graphXVar',
    'explanationEn',
    'explanationHi',
    'realLifeEn',
    'realLifeHi',
    'whatIfPrompts',
  ],
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/generate-simulation', async (req, res) => {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!prompt || prompt.length < 2) {
    res.status(400).json({ error: 'Please enter a physics formula or topic name.' });
    return;
  }
  if (prompt.length > 300) {
    res.status(400).json({ error: 'Topic prompt is too long. Please keep it under 300 characters.' });
    return;
  }

  const ai = createGeminiClient();
  if (!ai) {
    res.status(503).json({
      error: 'Gemini API key is not configured on the server. Please configure GEMINI_API_KEY in Settings > Secrets.',
    });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Create a live interactive Class 11-12 physics simulation blueprint for: "${prompt}".`,
      config: {
        systemInstruction:
          'You are a master Indian Class 11-12 physics teacher and simulation architect. Convert any requested physics formula or topic (whether asked in English, Hindi, or Hinglish) into a mathematically accurate, classroom-ready parametric simulation blueprint. Ensure: (1) variable keys are simple single-word ASCII identifiers like m, v, r, T, P, f, A, theta; (2) expressions use ONLY those exact variable keys plus basic operators (+, -, *, /, ^, parentheses) and functions (sqrt, sin, cos, tan, abs, log, exp) and constant pi or g; (3) for trigonometric formulas where degrees are intuitive to students, convert inside expression using (theta * pi / 180); (4) avoid dividing by zero by keeping min > 0 for denominator variables; (5) pick the visualTemplate that best animates the physical phenomenon; (6) write crystal-clear, natural Hindi Devanagari alongside English for classroom teaching.',
        responseMimeType: 'application/json',
        responseSchema: SIMULATION_SCHEMA,
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      res.status(502).json({ error: 'Empty response returned from Gemini model.' });
      return;
    }

    const parsed = JSON.parse(rawText);
    res.json({ blueprint: parsed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate physics simulation.';
    const lower = message.toLowerCase();
    if (lower.includes('api_key_invalid') || lower.includes('permission_denied') || lower.includes('403')) {
      res.status(403).json({
        error: 'Gemini API key error. Please verify your API key in Settings > Secrets.',
      });
      return;
    }
    if (lower.includes('resource_exhausted') || lower.includes('429')) {
      res.status(429).json({
        error: 'Rate limit reached for the Gemini API. Please wait a moment and try again.',
      });
      return;
    }
    res.status(500).json({ error: `Could not build simulation: ${message}` });
  }
});

const WORD_PROBLEM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    problemSummaryEn: {
      type: Type.STRING,
      description: 'Short 1-sentence English restatement of what the problem asks to find.',
    },
    problemSummaryHi: {
      type: Type.STRING,
      description: 'Short 1-sentence Hindi Devanagari restatement of what the problem asks to find.',
    },
    chapterEn: { type: Type.STRING, description: 'NCERT Class 11 or 12 Physics chapter name in English.' },
    chapterHi: { type: Type.STRING, description: 'NCERT Class 11 or 12 Physics chapter name in Hindi.' },
    relatedSimId: {
      type: Type.STRING,
      description:
        'Optional best-matching simulation ID from PhysicaLive if applicable (e.g. speed-velocity, motion-1d, projectile, newtons-force, banking-roads, atwood-pulley, work-energy, work-power-basic, linear-momentum, impulse-momentum, angular-momentum, moment-of-inertia, rolling-incline, circular-motion, gravitation, escape-velocity, keplers-laws, fluids, density-buoyancy, thermodynamics, carnot-engine, shm-spring, simple-pendulum, wave-speed-basic, doppler-effect, coulombs-law, capacitance, ohms-law, charge-current-power, lorentz-force, emi, transformer, ac-circuits, thin-lens, snell-prism-tir, wave-optics, dual-nature, atoms, nuclei). Leave empty string if none matches.',
    },
    givens: {
      type: Type.ARRAY,
      description: 'All given physical quantities extracted from the question with explicit SI conversions.',
      items: {
        type: Type.OBJECT,
        properties: {
          symbol: { type: Type.STRING, description: 'Physics symbol, e.g. u, v, m, r, t, R, I.' },
          labelEn: { type: Type.STRING },
          labelHi: { type: Type.STRING },
          rawValue: { type: Type.STRING, description: 'Value as given in the problem, e.g. 72 km/h.' },
          siValue: { type: Type.STRING, description: 'Converted SI value, e.g. 20 m/s.' },
          conversionNote: {
            type: Type.STRING,
            description: 'Short conversion rule if converted (e.g. 72 × 5/18 = 20 m/s), or "Already in SI".',
          },
        },
        required: ['symbol', 'labelEn', 'labelHi', 'rawValue', 'siValue', 'conversionNote'],
      },
    },
    formulaUsed: { type: Type.STRING, description: 'Primary NCERT formula used, e.g. v² = u² + 2as.' },
    rearrangedFormula: {
      type: Type.STRING,
      description: 'Formula rearranged to isolate the unknown variable, e.g. a = (v² − u²) / (2s).',
    },
    steps: {
      type: Type.ARRAY,
      description: '3 to 6 crisp, numbered board calculation steps with full numeric substitution.',
      items: {
        type: Type.OBJECT,
        properties: {
          stepTitleEn: { type: Type.STRING },
          stepTitleHi: { type: Type.STRING },
          equation: { type: Type.STRING, description: 'Monospace equation / calculation line for the chalkboard.' },
          explanationEn: { type: Type.STRING },
          explanationHi: { type: Type.STRING },
        },
        required: ['stepTitleEn', 'stepTitleHi', 'equation', 'explanationEn', 'explanationHi'],
      },
    },
    dimensionalCheck: {
      type: Type.STRING,
      description: 'Explicit dimensional consistency check, e.g. LHS [L T⁻²] = RHS [L² T⁻²] / [L] = [L T⁻²] (Verified).',
    },
    finalAnswer: { type: Type.STRING, description: 'Final numeric answer cleanly formatted, e.g. 11.2 or 4.5 × 10³.' },
    finalUnit: { type: Type.STRING, description: 'SI or requested unit of the final answer, e.g. m/s², N, J, km/s.' },
    keyTakeawayEn: { type: Type.STRING, description: '1-sentence exam tip or sanity check in English.' },
    keyTakeawayHi: { type: Type.STRING, description: '1-sentence exam tip or sanity check in Hindi.' },
  },
  required: [
    'problemSummaryEn',
    'problemSummaryHi',
    'chapterEn',
    'chapterHi',
    'relatedSimId',
    'givens',
    'formulaUsed',
    'rearrangedFormula',
    'steps',
    'dimensionalCheck',
    'finalAnswer',
    'finalUnit',
    'keyTakeawayEn',
    'keyTakeawayHi',
  ],
};

app.post('/api/solve-physics', async (req, res) => {
  const problem = typeof req.body?.problem === 'string' ? req.body.problem.trim() : '';
  if (!problem || problem.length < 5) {
    res.status(400).json({ error: 'Please enter a physics numerical problem or equation to solve.' });
    return;
  }
  if (problem.length > 1200) {
    res.status(400).json({ error: 'Problem text is too long. Please keep it under 1200 characters.' });
    return;
  }

  const ai = createGeminiClient();
  if (!ai) {
    res.status(503).json({
      error: 'Gemini API key is not configured on the server. Please configure GEMINI_API_KEY in Settings > Secrets.',
    });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Solve this Class 11-12 physics numerical problem step-by-step for a classroom chalkboard:\n\n${problem}`,
      config: {
        systemInstruction:
          'You are an expert Indian Class 11-12 NCERT Physics teacher solving numericals live on a classroom board. Follow strict rules: (1) Convert all non-SI givens to SI units transparently and show exact arithmetic; (2) Double-check every calculation carefully so the final numerical answer is 100% accurate (use g = 9.8 m/s² unless the problem states g = 10 m/s²); (3) Use clean Unicode math symbols (×, ÷, −, ², ³, √, π, θ, ω, Δ, ε₀, μ₀) instead of raw LaTeX backslashes; (4) Provide both clear English and natural Hindi Devanagari text for every label and explanation; (5) Include a concise dimensional verification line.',
        responseMimeType: 'application/json',
        responseSchema: WORD_PROBLEM_SCHEMA,
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      res.status(502).json({ error: 'Empty response returned from Gemini model.' });
      return;
    }

    const parsed = JSON.parse(rawText);
    res.json({ solution: parsed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to solve physics problem.';
    const lower = message.toLowerCase();
    if (lower.includes('api_key_invalid') || lower.includes('permission_denied') || lower.includes('403')) {
      res.status(403).json({
        error: 'Gemini API key error. Please verify your API key in Settings > Secrets.',
      });
      return;
    }
    if (lower.includes('resource_exhausted') || lower.includes('429')) {
      res.status(429).json({
        error: 'Rate limit reached for the Gemini API. Please wait a moment and try again.',
      });
      return;
    }
    res.status(500).json({ error: `Could not solve problem: ${message}` });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PhysicaLive server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
