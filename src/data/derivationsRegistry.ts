import {
  FormulaDerivationSpec,
  PhysicsSimulation,
  VariableSolverSpec,
} from '../types/physics';

const G_SI = 6.674e-11;
const K_SI = 8.988e9;
const EPS0_SI = 8.854e-12;
const MU0_SI = 4 * Math.PI * 1e-7;
const H_SI = 6.626e-34;

function num(v: Record<string, number>, k: string, fallback = 1): number {
  const val = v[k];
  return Number.isFinite(val) ? val : fallback;
}

const REGISTRY: Record<string, FormulaDerivationSpec> = {
  // ===== CH 08 GRAVITATION =====
  'escape-velocity': {
    simId: 'escape-velocity',
    steps: [
      {
        title: { en: 'Total Mechanical Energy at Launch', hi: 'प्रक्षेपण पर कुल यांत्रिक ऊर्जा' },
        equation: 'E_initial = K + U = ½·m·v² − G·M·m / R',
        note: {
          en: 'A rocket of mass m launches from planet surface radius R with speed v.',
          hi: 'द्रव्यमान m का रॉकेट त्रिज्या R की सतह से वेग v से प्रक्षेपित होता है।',
        },
      },
      {
        title: { en: 'Minimum Escape Condition at Infinity', hi: 'अनंत पर न्यूनतम पलायन शर्त' },
        equation: 'E_final (r → ∞) = 0 + 0 = 0',
        note: {
          en: 'To just escape gravity forever, the rocket reaches r → ∞ with zero leftover speed.',
          hi: 'गुरुत्व से बाहर निकलने के लिए अनंत दूरी पर कुल ऊर्जा शून्य होनी चाहिए।',
        },
      },
      {
        title: { en: 'Apply Conservation of Energy & Cancel m', hi: 'ऊर्जा संरक्षण लागू करें व m काटें' },
        equation: '½·m·v_e² − G·M·m / R = 0  ⇒  v_e² = 2·G·M / R',
        note: {
          en: 'Notice rocket mass m cancels out completely—heavy and light rockets need the exact same v_e!',
          hi: 'रॉकेट का द्रव्यमान m दोनों ओर से कट जाता है—पलायन वेग द्रव्यमान पर निर्भर नहीं करता!',
        },
      },
      {
        title: { en: 'Final Escape & Orbital Velocity Link', hi: 'पलायन वेग और कक्षीय वेग में संबंध' },
        equation: 'v_e = √(2·G·M / R) = √(2·g·R) = √2 · v_o',
        note: {
          en: 'For Earth (M = 6×10²⁴ kg, R = 6.4×10⁶ m): v_o ≈ 7.9 km/s and v_e ≈ 11.2 km/s.',
          hi: 'पृथ्वी के लिए कक्षीय वेग v_o ≈ 7.9 km/s और पलायन वेग v_e ≈ 11.2 km/s होता है।',
        },
      },
    ],
    solvers: [
      {
        id: 've',
        targetSymbol: 'v_e',
        targetLabel: { en: 'Escape Velocity (v_e)', hi: 'पलायन वेग (v_e)' },
        unit: 'km/s',
        rearrangedFormula: 'v_e = √(2·G·M / R)',
        inputs: [
          { key: 'M', symbol: 'M', label: { en: 'Planet Mass', hi: 'ग्रह द्रव्यमान' }, unit: '×10²⁴ kg', defaultValue: 6.0, min: 0.01 },
          { key: 'R', symbol: 'R', label: { en: 'Planet Radius', hi: 'ग्रह त्रिज्या' }, unit: '×10⁶ m', defaultValue: 6.4, min: 0.1 },
        ],
        solve: (v) => {
          const M = num(v, 'M', 6);
          const R = num(v, 'R', 6.4);
          if (M <= 0 || R <= 0) return { error: 'M and R must be positive.' };
          const ve = Math.sqrt((2 * G_SI * M * 1e24) / (R * 1e6)) / 1000;
          return { value: ve, substituted: `√(2 × 6.674×10⁻¹¹ × ${M}×10²⁴ / ${R}×10⁶) = ${ve.toFixed(2)} km/s` };
        },
      },
      {
        id: 'vo',
        targetSymbol: 'v_o',
        targetLabel: { en: 'Orbital Velocity (v_o)', hi: 'कक्षीय वेग (v_o)' },
        unit: 'km/s',
        rearrangedFormula: 'v_o = √(G·M / R)',
        inputs: [
          { key: 'M', symbol: 'M', label: { en: 'Planet Mass', hi: 'ग्रह द्रव्यमान' }, unit: '×10²⁴ kg', defaultValue: 6.0, min: 0.01 },
          { key: 'R', symbol: 'R', label: { en: 'Orbit Radius', hi: 'कक्षा त्रिज्या' }, unit: '×10⁶ m', defaultValue: 6.4, min: 0.1 },
        ],
        solve: (v) => {
          const M = num(v, 'M', 6);
          const R = num(v, 'R', 6.4);
          if (M <= 0 || R <= 0) return { error: 'M and R must be positive.' };
          const vo = Math.sqrt((G_SI * M * 1e24) / (R * 1e6)) / 1000;
          return { value: vo, substituted: `√(6.674×10⁻¹¹ × ${M}×10²⁴ / ${R}×10⁶) = ${vo.toFixed(2)} km/s` };
        },
      },
      {
        id: 'M',
        targetSymbol: 'M',
        targetLabel: { en: 'Planet Mass (M)', hi: 'ग्रह का द्रव्यमान (M)' },
        unit: '×10²⁴ kg',
        rearrangedFormula: 'M = v_e² · R / (2·G)',
        inputs: [
          { key: 've', symbol: 'v_e', label: { en: 'Escape Velocity', hi: 'पलायन वेग' }, unit: 'km/s', defaultValue: 11.2, min: 0.1 },
          { key: 'R', symbol: 'R', label: { en: 'Planet Radius', hi: 'ग्रह त्रिज्या' }, unit: '×10⁶ m', defaultValue: 6.4, min: 0.1 },
        ],
        solve: (v) => {
          const ve = num(v, 've', 11.2);
          const R = num(v, 'R', 6.4);
          if (ve <= 0 || R <= 0) return { error: 'v_e and R must be positive.' };
          const M = (Math.pow(ve * 1000, 2) * (R * 1e6)) / (2 * G_SI) / 1e24;
          return { value: M, substituted: `(${ve}×10³)² × (${R}×10⁶) / (2G) = ${M.toFixed(2)}×10²⁴ kg` };
        },
      },
      {
        id: 'R',
        targetSymbol: 'R',
        targetLabel: { en: 'Planet Radius (R)', hi: 'ग्रह की त्रिज्या (R)' },
        unit: '×10⁶ m',
        rearrangedFormula: 'R = 2·G·M / v_e²',
        inputs: [
          { key: 'M', symbol: 'M', label: { en: 'Planet Mass', hi: 'ग्रह द्रव्यमान' }, unit: '×10²⁴ kg', defaultValue: 6.0, min: 0.01 },
          { key: 've', symbol: 'v_e', label: { en: 'Escape Velocity', hi: 'पलायन वेग' }, unit: 'km/s', defaultValue: 11.2, min: 0.1 },
        ],
        solve: (v) => {
          const M = num(v, 'M', 6);
          const ve = num(v, 've', 11.2);
          if (M <= 0 || ve <= 0) return { error: 'M and v_e must be positive.' };
          const R = (2 * G_SI * M * 1e24) / Math.pow(ve * 1000, 2) / 1e6;
          return { value: R, substituted: `2G·(${M}×10²⁴) / (${ve}×10³)² = ${R.toFixed(2)}×10⁶ m` };
        },
      },
    ],
  },

  gravitation: {
    simId: 'gravitation',
    steps: [
      {
        title: { en: 'Newton’s Inverse-Square Attraction', hi: 'न्यूटन का व्युत्क्रम-वर्ग आकर्षण नियम' },
        equation: 'F ∝ M·m   and   F ∝ 1 / r²',
        note: { en: 'Gravitational pull grows with both masses and falls with square of separation.', hi: 'गुरुत्वाकर्षण बल द्रव्यमानों के गुणनफल के समानुपाती और दूरी के वर्ग के व्युत्क्रमानुपाती है।' },
      },
      {
        title: { en: 'Introduce Universal Constant G', hi: 'सार्वत्रिक नियतांक G का समावेश' },
        equation: 'F = G · (M · m) / r²   (G = 6.674 × 10⁻¹¹ N·m²/kg²)',
        note: { en: 'G is identical everywhere in the universe and independent of medium.', hi: 'G का मान ब्रह्मांड में सर्वत्र एक समान रहता है।' },
      },
      {
        title: { en: 'Circular Orbit Centripetal Balance', hi: 'वृत्ताकार कक्षा के लिए अभिकेंद्रीय संतुलन' },
        equation: 'G·M·m / r² = m·v_o² / r  ⇒  v_o = √(G·M / r)',
        note: { en: 'Gravity supplies the exact centripetal acceleration v²/r needed for a stable orbit.', hi: 'गुरुत्व बल ही उपग्रह को कक्षा में रखने हेतु अभिकेंद्रीय बल प्रदान करता है।' },
      },
    ],
    solvers: [
      {
        id: 'F',
        targetSymbol: 'F',
        targetLabel: { en: 'Gravitational Force (F)', hi: 'गुरुत्वाकर्षण बल (F)' },
        unit: 'kN',
        rearrangedFormula: 'F = G·M·m / r²',
        inputs: [
          { key: 'M', symbol: 'M', label: { en: 'Planet Mass', hi: 'ग्रह द्रव्यमान' }, unit: '×10²⁴ kg', defaultValue: 6, min: 0.1 },
          { key: 'm', symbol: 'm', label: { en: 'Satellite Mass', hi: 'उपग्रह द्रव्यमान' }, unit: '×10³ kg', defaultValue: 5, min: 0.1 },
          { key: 'r', symbol: 'r', label: { en: 'Distance', hi: 'दूरी (r)' }, unit: '×10⁶ m', defaultValue: 10, min: 0.5 },
        ],
        solve: (v) => {
          const M = num(v, 'M', 6), m = num(v, 'm', 5), r = num(v, 'r', 10);
          if (r <= 0) return { error: 'Distance r must be > 0.' };
          const FkN = (G_SI * (M * 1e24) * (m * 1e3)) / Math.pow(r * 1e6, 2) / 1000;
          return { value: FkN, substituted: `G·(${M}×10²⁴)(${m}×10³) / (${r}×10⁶)² = ${FkN.toFixed(2)} kN` };
        },
      },
      {
        id: 'r',
        targetSymbol: 'r',
        targetLabel: { en: 'Orbital Distance (r)', hi: 'कक्षीय दूरी (r)' },
        unit: '×10⁶ m',
        rearrangedFormula: 'r = √(G·M·m / F)',
        inputs: [
          { key: 'M', symbol: 'M', label: { en: 'Planet Mass', hi: 'ग्रह द्रव्यमान' }, unit: '×10²⁴ kg', defaultValue: 6, min: 0.1 },
          { key: 'm', symbol: 'm', label: { en: 'Satellite Mass', hi: 'उपग्रह द्रव्यमान' }, unit: '×10³ kg', defaultValue: 5, min: 0.1 },
          { key: 'F', symbol: 'F', label: { en: 'Force', hi: 'बल (F)' }, unit: 'kN', defaultValue: 20, min: 0.01 },
        ],
        solve: (v) => {
          const M = num(v, 'M', 6), m = num(v, 'm', 5), F = num(v, 'F', 20);
          if (F <= 0) return { error: 'Force F must be > 0.' };
          const r = Math.sqrt((G_SI * M * 1e24 * m * 1e3) / (F * 1000)) / 1e6;
          return { value: r, substituted: `√(G·M·m / ${F} kN) = ${r.toFixed(2)}×10⁶ m` };
        },
      },
    ],
  },

  'keplers-laws': {
    simId: 'keplers-laws',
    steps: [
      {
        title: { en: 'Kepler’s 2nd Law (Areal Velocity)', hi: 'केप्लर का द्वितीय नियम (क्षेत्रीय वेग)' },
        equation: 'dA / dt = L / (2·m) = constant',
        note: { en: 'Because central gravity exerts zero torque, angular momentum L = mvr is conserved—planets speed up near perihelion!', hi: 'केंद्रीय गुरुत्व का बल-आघूर्ण शून्य है, अतः कोणीय संवेग L नियत रहता है और उपसौर पर चाल बढ़ जाती है।' },
      },
      {
        title: { en: 'Equate Gravity to Centripetal Force', hi: 'गुरुत्व और अभिकेंद्रीय बल की तुलना' },
        equation: 'G·M·m / a² = m·(2π / T)²·a',
        note: { en: 'Replace orbital speed v with 2πa / T around semi-major axis a.', hi: 'कक्षीय वेग v = 2πa / T रखें।' },
      },
      {
        title: { en: 'Kepler’s 3rd Law of Periods', hi: 'केप्लर का तृतीय नियम (आवर्तकाल नियम)' },
        equation: 'T² = (4π² / G·M) · a³   ⇒   T² ∝ a³',
        note: { en: 'In solar units (AU and years), T² = a³ / M_star directly!', hi: 'सौर मात्रकों (AU व वर्ष) में T² = a³ / M_star होता है।' },
      },
    ],
    solvers: [
      {
        id: 'T',
        targetSymbol: 'T',
        targetLabel: { en: 'Orbital Period (T)', hi: 'परिक्रमण काल (T)' },
        unit: 'yr',
        rearrangedFormula: 'T = √(a³ / M_star)',
        inputs: [
          { key: 'a', symbol: 'a', label: { en: 'Semi-Major Axis', hi: 'अर्ध-दीर्घ अक्ष (a)' }, unit: 'AU', defaultValue: 1.5, min: 0.1 },
          { key: 'Mstar', symbol: 'M*', label: { en: 'Star Mass', hi: 'तारे का द्रव्यमान' }, unit: 'M☉', defaultValue: 1.0, min: 0.1 },
        ],
        solve: (v) => {
          const a = num(v, 'a', 1.5), M = num(v, 'Mstar', 1);
          if (a <= 0 || M <= 0) return { error: 'a and M* must be positive.' };
          const T = Math.sqrt((a * a * a) / M);
          return { value: T, substituted: `√(${a}³ / ${M}) = ${T.toFixed(3)} yr` };
        },
      },
      {
        id: 'a',
        targetSymbol: 'a',
        targetLabel: { en: 'Semi-Major Axis (a)', hi: 'अर्ध-दीर्घ अक्ष (a)' },
        unit: 'AU',
        rearrangedFormula: 'a = (M_star · T²)^(1/3)',
        inputs: [
          { key: 'T', symbol: 'T', label: { en: 'Orbital Period', hi: 'आवर्तकाल (T)' }, unit: 'yr', defaultValue: 8.0, min: 0.05 },
          { key: 'Mstar', symbol: 'M*', label: { en: 'Star Mass', hi: 'तारे का द्रव्यमान' }, unit: 'M☉', defaultValue: 1.0, min: 0.1 },
        ],
        solve: (v) => {
          const T = num(v, 'T', 8), M = num(v, 'Mstar', 1);
          if (T <= 0 || M <= 0) return { error: 'T and M* must be positive.' };
          const a = Math.cbrt(M * T * T);
          return { value: a, substituted: `(${M} × ${T}²)^(1/3) = ${a.toFixed(3)} AU` };
        },
      },
    ],
  },

  // ===== CH 03 PROJECTILE & RELATIVE VELOCITY =====
  projectile: {
    simId: 'projectile',
    steps: [
      {
        title: { en: 'Resolve Launch Velocity into X and Y', hi: 'प्रक्षेपण वेग के X और Y घटक' },
        equation: 'u_x = u·cos(θ)   ,   u_y = u·sin(θ)',
        note: { en: 'Horizontal motion has a_x = 0 (constant velocity); vertical motion has a_y = −g.', hi: 'क्षैतिज दिशा में त्वरण शून्य और ऊर्ध्वाधर दिशा में त्वरण −g है।' },
      },
      {
        title: { en: 'Time of Flight T & Maximum Height H', hi: 'उड्डयन काल T और अधिकतम ऊँचाई H' },
        equation: 'T = 2·u·sin(θ) / g   |   H = u²·sin²(θ) / (2·g)',
        note: { en: 'At the peak, v_y = 0 gives t_peak = u·sinθ / g; total flight time is 2·t_peak.', hi: 'उच्चतम बिंदु पर v_y = 0 रखने से t_peak और अधिकतम ऊँचाई H मिलती है।' },
      },
      {
        title: { en: 'Horizontal Range R', hi: 'क्षैतिज परास R' },
        equation: 'R = u_x · T = (u² · sin 2θ) / g',
        note: { en: 'Since sin(2θ) peaks at 2θ = 90°, maximum range occurs at θ = 45°.', hi: 'sin(2θ) का अधिकतम मान 45° पर होता है, अतः अधिकतम परास 45° पर मिलता है।' },
      },
    ],
    solvers: [
      {
        id: 'R',
        targetSymbol: 'R',
        targetLabel: { en: 'Horizontal Range (R)', hi: 'क्षैतिज परास (R)' },
        unit: 'm',
        rearrangedFormula: 'R = u² · sin(2θ) / g',
        inputs: [
          { key: 'u', symbol: 'u', label: { en: 'Launch Speed', hi: 'प्रक्षेपण वेग' }, unit: 'm/s', defaultValue: 28, min: 0.1 },
          { key: 'theta', symbol: 'θ', label: { en: 'Angle', hi: 'कोण' }, unit: '°', defaultValue: 45, min: 1, max: 89 },
          { key: 'g', symbol: 'g', label: { en: 'Gravity', hi: 'गुरुत्वीय त्वरण' }, unit: 'm/s²', defaultValue: 9.8, min: 0.5 },
        ],
        solve: (v) => {
          const u = num(v, 'u', 28), th = num(v, 'theta', 45), g = num(v, 'g', 9.8);
          if (g <= 0) return { error: 'g must be positive.' };
          const R = (u * u * Math.sin((2 * th * Math.PI) / 180)) / g;
          return { value: R, substituted: `(${u})²·sin(${2 * th}°) / ${g} = ${R.toFixed(2)} m` };
        },
      },
      {
        id: 'H',
        targetSymbol: 'H',
        targetLabel: { en: 'Max Height (H)', hi: 'अधिकतम ऊँचाई (H)' },
        unit: 'm',
        rearrangedFormula: 'H = u² · sin²(θ) / (2g)',
        inputs: [
          { key: 'u', symbol: 'u', label: { en: 'Launch Speed', hi: 'प्रक्षेपण वेग' }, unit: 'm/s', defaultValue: 28, min: 0.1 },
          { key: 'theta', symbol: 'θ', label: { en: 'Angle', hi: 'कोण' }, unit: '°', defaultValue: 45, min: 1, max: 89 },
          { key: 'g', symbol: 'g', label: { en: 'Gravity', hi: 'गुरुत्वीय त्वरण' }, unit: 'm/s²', defaultValue: 9.8, min: 0.5 },
        ],
        solve: (v) => {
          const u = num(v, 'u', 28), th = num(v, 'theta', 45), g = num(v, 'g', 9.8);
          const s = Math.sin((th * Math.PI) / 180);
          const H = (u * u * s * s) / (2 * g);
          return { value: H, substituted: `(${u})²·sin²(${th}°) / (2×${g}) = ${H.toFixed(2)} m` };
        },
      },
      {
        id: 'u',
        targetSymbol: 'u',
        targetLabel: { en: 'Required Launch Speed (u)', hi: 'आवश्यक वेग (u)' },
        unit: 'm/s',
        rearrangedFormula: 'u = √(R · g / sin 2θ)',
        inputs: [
          { key: 'R', symbol: 'R', label: { en: 'Target Range', hi: 'लक्ष्य परास' }, unit: 'm', defaultValue: 80, min: 1 },
          { key: 'theta', symbol: 'θ', label: { en: 'Angle', hi: 'कोण' }, unit: '°', defaultValue: 45, min: 5, max: 85 },
          { key: 'g', symbol: 'g', label: { en: 'Gravity', hi: 'गुरुत्वीय त्वरण' }, unit: 'm/s²', defaultValue: 9.8, min: 0.5 },
        ],
        solve: (v) => {
          const R = num(v, 'R', 80), th = num(v, 'theta', 45), g = num(v, 'g', 9.8);
          const s2 = Math.sin((2 * th * Math.PI) / 180);
          if (s2 <= 0.01) return { error: 'Angle θ must be between 1° and 89°.' };
          const u = Math.sqrt((R * g) / s2);
          return { value: u, substituted: `√(${R} × ${g} / sin ${2 * th}°) = ${u.toFixed(2)} m/s` };
        },
      },
    ],
  },

  'relative-velocity': {
    simId: 'relative-velocity',
    steps: [
      {
        title: { en: 'Vector Addition in River Frame', hi: 'नदी निर्देश तंत्र में सदिश योग' },
        equation: 'v_boat,ground = v_boat,water + v_river',
        note: { en: 'Boat velocity relative to bank equals swimmer effort plus river flow.', hi: 'तट के सापेक्ष नाव का वेग = जल में नाव का वेग + नदी का वेग।' },
      },
      {
        title: { en: 'Crossing Time & Downstream Drift', hi: 'पार करने का समय और बहाव (Drift)' },
        equation: 't = W / (v_b·cos θ)   |   Drift x = (v_r − v_b·sin θ) · t',
        note: { en: 'Minimum time occurs at θ = 0° (straight across). Zero drift requires sin θ = v_r / v_b.', hi: 'न्यूनतम समय θ = 0° पर और शून्य बहाव sin θ = v_r / v_b पर मिलता है।' },
      },
    ],
    solvers: [
      {
        id: 't',
        targetSymbol: 't',
        targetLabel: { en: 'Crossing Time (t)', hi: 'पार करने का समय (t)' },
        unit: 's',
        rearrangedFormula: 't = W / (v_b · cos θ)',
        inputs: [
          { key: 'W', symbol: 'W', label: { en: 'River Width', hi: 'नदी चौड़ाई' }, unit: 'm', defaultValue: 120, min: 10 },
          { key: 'vb', symbol: 'v_b', label: { en: 'Boat Speed', hi: 'नाव की चाल' }, unit: 'm/s', defaultValue: 6, min: 0.5 },
          { key: 'theta', symbol: 'θ', label: { en: 'Upstream Angle', hi: 'प्रवाह विरुद्ध कोण' }, unit: '°', defaultValue: 25, min: -75, max: 75 },
        ],
        solve: (v) => {
          const W = num(v, 'W', 120), vb = num(v, 'vb', 6), th = num(v, 'theta', 25);
          const vy = vb * Math.cos((th * Math.PI) / 180);
          if (vy <= 0.05) return { error: 'cos(θ) must be positive.' };
          const t = W / vy;
          return { value: t, substituted: `${W} / (${vb}·cos ${th}°) = ${t.toFixed(2)} s` };
        },
      },
      {
        id: 'theta0',
        targetSymbol: 'θ_0',
        targetLabel: { en: 'Zero-Drift Aim Angle', hi: 'शून्य बहाव कोण (θ₀)' },
        unit: '°',
        rearrangedFormula: 'θ₀ = sin⁻¹(v_r / v_b)',
        inputs: [
          { key: 'vr', symbol: 'v_r', label: { en: 'River Speed', hi: 'नदी वेग' }, unit: 'm/s', defaultValue: 3, min: 0 },
          { key: 'vb', symbol: 'v_b', label: { en: 'Boat Speed', hi: 'नाव वेग' }, unit: 'm/s', defaultValue: 6, min: 0.5 },
        ],
        solve: (v) => {
          const vr = num(v, 'vr', 3), vb = num(v, 'vb', 6);
          if (vr > vb) return { error: 'Impossible: v_r > v_b (boat cannot cancel river current).' };
          const ang = (Math.asin(vr / vb) * 180) / Math.PI;
          return { value: ang, substituted: `sin⁻¹(${vr} / ${vb}) = ${ang.toFixed(1)}° upstream` };
        },
      },
    ],
  },

  // ===== CH 04 LAWS OF MOTION, BANKING, ATWOOD =====
  'newtons-force': {
    simId: 'newtons-force',
    steps: [
      {
        title: { en: 'Free-Body Normal Force & Friction', hi: 'अभिलंब बल और घर्षण बल' },
        equation: 'N = m·g·cos(θ)   ,   f_k = μ · N = μ·m·g·cos(θ)',
        note: { en: 'Resolve weight mg perpendicular (mg·cosθ) and parallel (mg·sinθ) to the ramp.', hi: 'भार mg को तल के लंबवत और समानांतर घटकों में विभाजित करें।' },
      },
      {
        title: { en: 'Apply Newton’s 2nd Law Along Motion Axis', hi: 'गति अक्ष पर न्यूटन का द्वितीय नियम' },
        equation: 'F_net = F_app − f_k − m·g·sin(θ) = m · a',
        note: { en: 'Acceleration a = F_net / m is zero whenever applied push does not overcome static friction + gravity.', hi: 'परिणामी बल शून्य होने पर त्वरण शून्य रहता है।' },
      },
    ],
    solvers: [
      {
        id: 'a',
        targetSymbol: 'a',
        targetLabel: { en: 'Acceleration (a)', hi: 'त्वरण (a)' },
        unit: 'm/s²',
        rearrangedFormula: 'a = (F_app − μ·mg·cosθ − mg·sinθ) / m',
        inputs: [
          { key: 'F', symbol: 'F_app', label: { en: 'Applied Force', hi: 'आरोपित बल' }, unit: 'N', defaultValue: 50 },
          { key: 'm', symbol: 'm', label: { en: 'Mass', hi: 'द्रव्यमान' }, unit: 'kg', defaultValue: 5, min: 0.1 },
          { key: 'mu', symbol: 'μ', label: { en: 'Friction μ', hi: 'घर्षण गुणांक' }, unit: '', defaultValue: 0.2, min: 0 },
          { key: 'angle', symbol: 'θ', label: { en: 'Incline', hi: 'कोण' }, unit: '°', defaultValue: 0, min: 0, max: 60 },
        ],
        solve: (v) => {
          const F = num(v, 'F', 50), m = num(v, 'm', 5), mu = num(v, 'mu', 0.2), th = (num(v, 'angle', 0) * Math.PI) / 180;
          if (m <= 0) return { error: 'Mass m must be > 0.' };
          const N = m * 9.8 * Math.cos(th);
          const f = mu * N;
          const gPar = m * 9.8 * Math.sin(th);
          const a = Math.max(0, (F - f - gPar) / m);
          return { value: a, substituted: `(${F} − ${f.toFixed(1)} − ${gPar.toFixed(1)}) / ${m} = ${a.toFixed(2)} m/s²` };
        },
      },
      {
        id: 'F',
        targetSymbol: 'F_app',
        targetLabel: { en: 'Required Force (F_app)', hi: 'आवश्यक बल (F_app)' },
        unit: 'N',
        rearrangedFormula: 'F_app = m·a + μ·mg·cosθ + mg·sinθ',
        inputs: [
          { key: 'm', symbol: 'm', label: { en: 'Mass', hi: 'द्रव्यमान' }, unit: 'kg', defaultValue: 5, min: 0.1 },
          { key: 'a', symbol: 'a', label: { en: 'Target Accel', hi: 'लक्ष्य त्वरण' }, unit: 'm/s²', defaultValue: 4 },
          { key: 'mu', symbol: 'μ', label: { en: 'Friction μ', hi: 'घर्षण गुणांक' }, unit: '', defaultValue: 0.2, min: 0 },
          { key: 'angle', symbol: 'θ', label: { en: 'Incline', hi: 'कोण' }, unit: '°', defaultValue: 0, min: 0, max: 60 },
        ],
        solve: (v) => {
          const m = num(v, 'm', 5), a = num(v, 'a', 4), mu = num(v, 'mu', 0.2), th = (num(v, 'angle', 0) * Math.PI) / 180;
          const F = m * a + mu * m * 9.8 * Math.cos(th) + m * 9.8 * Math.sin(th);
          return { value: F, substituted: `${m}×${a} + friction + gravity = ${F.toFixed(2)} N` };
        },
      },
    ],
  },

  'banking-roads': {
    simId: 'banking-roads',
    steps: [
      {
        title: { en: 'Vertical & Radial Force Balance', hi: 'ऊर्ध्वाधर व त्रिज्यीय बल संतुलन' },
        equation: 'N·cosθ − f·sinθ = mg   |   N·sinθ + f·cosθ = m·v² / R',
        note: { en: 'Tilting the road lets the horizontal normal component N·sinθ push the car inward.', hi: 'सड़क के झुकाव से अभिलंब बल का घटक N·sinθ अभिकेंद्रीय बल देता है।' },
      },
      {
        title: { en: 'Divide Equations & Substitute f_max = μ·N', hi: 'भाग देकर f_max = μ·N रखें' },
        equation: 'v_max² / (R·g) = (tan θ + μ) / (1 − μ·tan θ)',
        note: { en: 'When μ = 0 (icy road), optimum speed simplifies cleanly to v_opt = √(R·g·tan θ).', hi: 'बर्फीली सड़क (μ = 0) पर इष्टतम चाल v_opt = √(R·g·tan θ) होती है।' },
      },
    ],
    solvers: [
      {
        id: 'vmax',
        targetSymbol: 'v_max',
        targetLabel: { en: 'Max Safe Speed (v_max)', hi: 'अधिकतम सुरक्षित चाल' },
        unit: 'm/s',
        rearrangedFormula: 'v_max = √[R·g·(tanθ + μ) / (1 − μ·tanθ)]',
        inputs: [
          { key: 'R', symbol: 'R', label: { en: 'Turn Radius', hi: 'मोड़ त्रिज्या' }, unit: 'm', defaultValue: 60, min: 5 },
          { key: 'theta', symbol: 'θ', label: { en: 'Bank Angle', hi: 'झुकाव कोण' }, unit: '°', defaultValue: 20, min: 0, max: 45 },
          { key: 'mu', symbol: 'μ', label: { en: 'Friction μ', hi: 'घर्षण गुणांक' }, unit: '', defaultValue: 0.3, min: 0, max: 1 },
        ],
        solve: (v) => {
          const R = num(v, 'R', 60), th = (num(v, 'theta', 20) * Math.PI) / 180, mu = num(v, 'mu', 0.3);
          const denom = 1 - mu * Math.tan(th);
          if (denom <= 0.02) return { error: '1 − μ·tanθ ≤ 0 (car cannot skid outward!).' };
          const vmax = Math.sqrt((R * 9.8 * (Math.tan(th) + mu)) / denom);
          return { value: vmax, substituted: `√[${R}×9.8×(${Math.tan(th).toFixed(2)}+${mu})/${denom.toFixed(2)}] = ${vmax.toFixed(2)} m/s` };
        },
      },
      {
        id: 'theta',
        targetSymbol: 'θ_opt',
        targetLabel: { en: 'Ideal Bank Angle (μ = 0)', hi: 'आदर्श झुकाव कोण (θ_opt)' },
        unit: '°',
        rearrangedFormula: 'θ = tan⁻¹(v² / (R·g))',
        inputs: [
          { key: 'v', symbol: 'v', label: { en: 'Design Speed', hi: 'चाल (v)' }, unit: 'm/s', defaultValue: 20, min: 1 },
          { key: 'R', symbol: 'R', label: { en: 'Turn Radius', hi: 'मोड़ त्रिज्या' }, unit: 'm', defaultValue: 60, min: 5 },
        ],
        solve: (v) => {
          const spd = num(v, 'v', 20), R = num(v, 'R', 60);
          const ang = (Math.atan((spd * spd) / (R * 9.8)) * 180) / Math.PI;
          return { value: ang, substituted: `tan⁻¹(${spd}² / (${R}×9.8)) = ${ang.toFixed(1)}°` };
        },
      },
    ],
  },

  'atwood-pulley': {
    simId: 'atwood-pulley',
    steps: [
      {
        title: { en: 'Write F = ma for Each Hanging Mass', hi: 'दोनों द्रव्यमानों के लिए F = ma लिखें' },
        equation: 'm₂·g − T = m₂·a   and   T − m₁·g = m₁·a',
        note: { en: 'An inextensible massless string has equal tension T and equal acceleration magnitude a on both sides.', hi: 'हल्की डोरी में दोनों ओर तनाव T और त्वरण का परिमाण a समान होता है।' },
      },
      {
        title: { en: 'Add Equations to Find Acceleration a', hi: 'जोड़कर त्वरण a निकालें' },
        equation: 'a = (m₂ − m₁)·g / (m₁ + m₂)',
        note: { en: 'Tension T cancels on addition! Net driving weight divides by total system inertia (m₁ + m₂).', hi: 'जोड़ने पर T कट जाता है और त्वरण a प्राप्त होता है।' },
      },
      {
        title: { en: 'Substitute Back for String Tension T', hi: 'डोरी का तनाव T निकालें' },
        equation: 'T = 2·m₁·m₂·g / (m₁ + m₂)',
        note: { en: 'Notice T always lies strictly between m₁g and m₂g whenever masses differ.', hi: 'तनाव T हमेशा m₁g और m₂g के बीच होता है।' },
      },
    ],
    solvers: [
      {
        id: 'a',
        targetSymbol: 'a',
        targetLabel: { en: 'System Acceleration (a)', hi: 'निकाय का त्वरण (a)' },
        unit: 'm/s²',
        rearrangedFormula: 'a = (m₂ − m₁)·g / (m₁ + m₂)',
        inputs: [
          { key: 'm1', symbol: 'm₁', label: { en: 'Left Mass', hi: 'बायाँ द्रव्यमान' }, unit: 'kg', defaultValue: 4, min: 0.1 },
          { key: 'm2', symbol: 'm₂', label: { en: 'Right Mass', hi: 'दायाँ द्रव्यमान' }, unit: 'kg', defaultValue: 6, min: 0.1 },
          { key: 'g', symbol: 'g', label: { en: 'Gravity', hi: 'गुरुत्वीय त्वरण' }, unit: 'm/s²', defaultValue: 9.8, min: 0.5 },
        ],
        solve: (v) => {
          const m1 = num(v, 'm1', 4), m2 = num(v, 'm2', 6), g = num(v, 'g', 9.8);
          const a = ((m2 - m1) * g) / (m1 + m2);
          return { value: a, substituted: `(${m2} − ${m1})×${g} / (${m1}+${m2}) = ${a.toFixed(2)} m/s²` };
        },
      },
      {
        id: 'T',
        targetSymbol: 'T',
        targetLabel: { en: 'String Tension (T)', hi: 'डोरी का तनाव (T)' },
        unit: 'N',
        rearrangedFormula: 'T = 2·m₁·m₂·g / (m₁ + m₂)',
        inputs: [
          { key: 'm1', symbol: 'm₁', label: { en: 'Left Mass', hi: 'बायाँ द्रव्यमान' }, unit: 'kg', defaultValue: 4, min: 0.1 },
          { key: 'm2', symbol: 'm₂', label: { en: 'Right Mass', hi: 'दायाँ द्रव्यमान' }, unit: 'kg', defaultValue: 6, min: 0.1 },
          { key: 'g', symbol: 'g', label: { en: 'Gravity', hi: 'गुरुत्वीय त्वरण' }, unit: 'm/s²', defaultValue: 9.8, min: 0.5 },
        ],
        solve: (v) => {
          const m1 = num(v, 'm1', 4), m2 = num(v, 'm2', 6), g = num(v, 'g', 9.8);
          const T = (2 * m1 * m2 * g) / (m1 + m2);
          return { value: T, substituted: `2×${m1}×${m2}×${g} / (${m1}+${m2}) = ${T.toFixed(2)} N` };
        },
      },
    ],
  },

  // ===== CH 07 ROTATIONAL =====
  'rolling-incline': {
    simId: 'rolling-incline',
    steps: [
      {
        title: { en: 'Pure Rolling Constraint', hi: 'बिना फिसले लोटनिक गति शर्त' },
        equation: 'v = ω·R   and   a = α·R',
        note: { en: 'The contact point is instantaneously at rest, so static friction performs zero work.', hi: 'संपर्क बिंदु क्षणिक विराम में होता है, अतः स्थैतिक घर्षण कोई कार्य नहीं करता।' },
      },
      {
        title: { en: 'Translation + Rotation Newton Equations', hi: 'स्थानांतरण और घूर्णन समीकरण' },
        equation: 'mg·sinθ − f_s = m·a   |   f_s·R = I·α = (β·mR²)·(a/R)',
        note: { en: 'Here β = I/(mR²) = k²/R² is the dimensionless shape factor (0.4 sphere, 0.5 cylinder, 1.0 ring).', hi: 'यहाँ β = I/(mR²) आकृति गुणांक है (गोला 0.4, बेलन 0.5, वलय 1.0)।' },
      },
      {
        title: { en: 'Eliminate Friction f_s', hi: 'घर्षण f_s को विलोपित करें' },
        equation: 'a = g·sin(θ) / (1 + β)   |   v_bottom = √[2·g·h / (1 + β)]',
        note: { en: 'Mass m and radius R cancel out completely—only geometry β decides the winner!', hi: 'द्रव्यमान m और त्रिज्या R कट जाते हैं—केवल आकृति गुणांक β विजेता तय करता है!' },
      },
    ],
    solvers: [
      {
        id: 'a',
        targetSymbol: 'a',
        targetLabel: { en: 'Rolling Acceleration (a)', hi: 'लोटनिक त्वरण (a)' },
        unit: 'm/s²',
        rearrangedFormula: 'a = g·sin(θ) / (1 + β)',
        inputs: [
          { key: 'theta', symbol: 'θ', label: { en: 'Incline Angle', hi: 'आनत कोण' }, unit: '°', defaultValue: 25, min: 1, max: 80 },
          { key: 'beta', symbol: 'β', label: { en: 'Shape I/(mR²)', hi: 'आकृति गुणांक' }, unit: '', defaultValue: 0.4, min: 0, max: 1.5 },
          { key: 'g', symbol: 'g', label: { en: 'Gravity', hi: 'गुरुत्वीय त्वरण' }, unit: 'm/s²', defaultValue: 9.8, min: 0.5 },
        ],
        solve: (v) => {
          const th = num(v, 'theta', 25), beta = num(v, 'beta', 0.4), g = num(v, 'g', 9.8);
          const a = (g * Math.sin((th * Math.PI) / 180)) / (1 + beta);
          return { value: a, substituted: `${g}·sin(${th}°) / (1 + ${beta}) = ${a.toFixed(2)} m/s²` };
        },
      },
      {
        id: 'vbot',
        targetSymbol: 'v',
        targetLabel: { en: 'Bottom Speed (v)', hi: 'तल पर वेग (v)' },
        unit: 'm/s',
        rearrangedFormula: 'v = √[2·g·L·sinθ / (1 + β)]',
        inputs: [
          { key: 'L', symbol: 'L', label: { en: 'Ramp Length', hi: 'ढलान लंबाई' }, unit: 'm', defaultValue: 10, min: 0.5 },
          { key: 'theta', symbol: 'θ', label: { en: 'Incline Angle', hi: 'कोण' }, unit: '°', defaultValue: 25, min: 1, max: 80 },
          { key: 'beta', symbol: 'β', label: { en: 'Shape I/(mR²)', hi: 'आकृति गुणांक' }, unit: '', defaultValue: 0.4, min: 0 },
        ],
        solve: (v) => {
          const L = num(v, 'L', 10), th = num(v, 'theta', 25), beta = num(v, 'beta', 0.4);
          const vb = Math.sqrt((2 * 9.8 * L * Math.sin((th * Math.PI) / 180)) / (1 + beta));
          return { value: vb, substituted: `√(2×9.8×${L}·sin${th}° / (1+${beta})) = ${vb.toFixed(2)} m/s` };
        },
      },
    ],
  },

  // ===== CH 10 FLUIDS: STOKES & CAPILLARY =====
  'stokes-terminal': {
    simId: 'stokes-terminal',
    steps: [
      {
        title: { en: 'Force Balance at Terminal Velocity', hi: 'सीमांत वेग पर बल संतुलन' },
        equation: 'Weight W = Buoyancy F_b + Stokes Viscous Drag F_v',
        note: { en: 'As speed rises, upward drag 6πηrv grows until net force becomes zero.', hi: 'वेग बढ़ने के साथ श्यान बल 6πηrv बढ़कर भार को संतुलित कर देता है।' },
      },
      {
        title: { en: 'Substitute Sphere Volume (4/3)πr³', hi: 'गोले का आयतन (4/3)πr³ रखें' },
        equation: '6π·η·r·v_t = (4/3)π·r³·(ρ − σ)·g',
        note: { en: 'Difference (ρ − σ) gives effective submerged weight density.', hi: '(ρ − σ) प्रभावी घनत्व अंतर दर्शाता है।' },
      },
      {
        title: { en: 'Solve for Terminal Speed v_t', hi: 'सीमांत वेग v_t का अंतिम सूत्र' },
        equation: 'v_t = 2·r²·(ρ − σ)·g / (9·η)',
        note: { en: 'Doubling radius quadruples terminal speed (v_t ∝ r²)!', hi: 'त्रिज्या दोगुनी करने पर सीमांत वेग 4 गुना हो जाता है (v_t ∝ r²)।' },
      },
    ],
    solvers: [
      {
        id: 'vt',
        targetSymbol: 'v_t',
        targetLabel: { en: 'Terminal Velocity (v_t)', hi: 'सीमांत वेग (v_t)' },
        unit: 'cm/s',
        rearrangedFormula: 'v_t = 2·r²·(ρ − σ)·g / (9·η)',
        inputs: [
          { key: 'r', symbol: 'r', label: { en: 'Sphere Radius', hi: 'गोले की त्रिज्या' }, unit: 'mm', defaultValue: 3, min: 0.2 },
          { key: 'rho', symbol: 'ρ', label: { en: 'Sphere Density', hi: 'गोले का घनत्व' }, unit: 'kg/m³', defaultValue: 7800, min: 500 },
          { key: 'sigma', symbol: 'σ', label: { en: 'Fluid Density', hi: 'द्रव घनत्व' }, unit: 'kg/m³', defaultValue: 1260, min: 100 },
          { key: 'eta', symbol: 'η', label: { en: 'Viscosity', hi: 'श्यानता गुणांक' }, unit: 'Pa·s', defaultValue: 0.9, min: 0.01 },
        ],
        solve: (v) => {
          const r = num(v, 'r', 3) / 1000, rho = num(v, 'rho', 7800), sig = num(v, 'sigma', 1260), eta = num(v, 'eta', 0.9);
          if (eta <= 0) return { error: 'Viscosity η must be > 0.' };
          const vtCm = ((2 * r * r * (rho - sig) * 9.8) / (9 * eta)) * 100;
          return { value: vtCm, substituted: `2·(${r * 1000}mm)²·(${rho}−${sig})·9.8 / (9·${eta}) = ${vtCm.toFixed(2)} cm/s` };
        },
      },
    ],
  },

  'capillary-rise': {
    simId: 'capillary-rise',
    steps: [
      {
        title: { en: 'Upward Surface Tension Pull Along Rim', hi: 'परिधि पर ऊपर की ओर पृष्ठ तनाव बल' },
        equation: 'F_up = (T·cos θ) · (2π·r)',
        note: { en: 'Liquid pulls along circumference 2πr at contact angle θ.', hi: 'द्रव 2πr परिधि पर स्पर्श कोण θ पर ऊपर की ओर खींचता है।' },
      },
      {
        title: { en: 'Balance Against Liquid Column Weight', hi: 'द्रव स्तंभ के भार से संतुलन' },
        equation: '2π·r·T·cos θ = (π·r²·h)·ρ·g   ⇒   h = 2·T·cos θ / (r·ρ·g)',
        note: { en: 'For mercury (θ > 90°), cos θ is negative so the liquid depresses below the bath level.', hi: 'पारे (θ > 90°) में cos θ ऋणात्मक होने से द्रव नीचे उतर जाता है।' },
      },
    ],
    solvers: [
      {
        id: 'h',
        targetSymbol: 'h',
        targetLabel: { en: 'Capillary Rise (h)', hi: 'केशिका उन्नयन (h)' },
        unit: 'mm',
        rearrangedFormula: 'h = 2·T·cos θ / (r·ρ·g)',
        inputs: [
          { key: 'T', symbol: 'T', label: { en: 'Surface Tension', hi: 'पृष्ठ तनाव' }, unit: 'mN/m', defaultValue: 72, min: 1 },
          { key: 'theta', symbol: 'θ', label: { en: 'Contact Angle', hi: 'स्पर्श कोण' }, unit: '°', defaultValue: 0, min: 0, max: 160 },
          { key: 'r', symbol: 'r', label: { en: 'Tube Radius', hi: 'नली त्रिज्या' }, unit: 'mm', defaultValue: 0.5, min: 0.05 },
          { key: 'rho', symbol: 'ρ', label: { en: 'Liquid Density', hi: 'घनत्व' }, unit: 'kg/m³', defaultValue: 1000, min: 100 },
        ],
        solve: (v) => {
          const T = num(v, 'T', 72) / 1000, th = (num(v, 'theta', 0) * Math.PI) / 180, r = num(v, 'r', 0.5) / 1000, rho = num(v, 'rho', 1000);
          if (r <= 0 || rho <= 0) return { error: 'r and ρ must be positive.' };
          const hMm = ((2 * T * Math.cos(th)) / (r * rho * 9.8)) * 1000;
          return { value: hMm, substituted: `2×${T}×cos(${num(v, 'theta', 0)}°) / (${r}×${rho}×9.8) = ${hMm.toFixed(2)} mm` };
        },
      },
    ],
  },

  // ===== CH 12 CARNOT ENGINE =====
  'carnot-engine': {
    simId: 'carnot-engine',
    steps: [
      {
        title: { en: 'Four Reversible Carnot Stages', hi: 'चार उत्क्रमणीय कार्नो प्रक्रम' },
        equation: '1→2 Isothermal Exp (T₁) | 2→3 Adiabatic Exp | 3→4 Isothermal Comp (T₂) | 4→1 Adiabatic Comp',
        note: { en: 'Heat Q₁ enters only at T₁ and Q₂ leaves only at T₂; adiabatic strokes exchange zero heat.', hi: 'ऊष्मा Q₁ केवल T₁ पर ग्रहण होती है और Q₂ केवल T₂ पर निष्कासित होती है।' },
      },
      {
        title: { en: 'Carnot Efficiency Limit', hi: 'कार्नो दक्षता सीमा' },
        equation: 'η = W / Q₁ = 1 − Q₂ / Q₁ = 1 − T₂ / T₁',
        note: { en: 'Always convert temperatures to Kelvin! Reaching η = 100% would require T₂ = 0 K (impossible).', hi: 'ताप सदैव केल्विन (K) में लें। T₂ = 0 K असंभव होने से η कभी 100% नहीं हो सकती।' },
      },
    ],
    solvers: [
      {
        id: 'eta',
        targetSymbol: 'η',
        targetLabel: { en: 'Carnot Efficiency (η)', hi: 'कार्नो दक्षता (η)' },
        unit: '%',
        rearrangedFormula: 'η = (1 − T₂ / T₁) × 100%',
        inputs: [
          { key: 'T1', symbol: 'T₁', label: { en: 'Source Temp', hi: 'स्रोत ताप' }, unit: 'K', defaultValue: 600, min: 100 },
          { key: 'T2', symbol: 'T₂', label: { en: 'Sink Temp', hi: 'सिंक ताप' }, unit: 'K', defaultValue: 300, min: 10 },
        ],
        solve: (v) => {
          const T1 = num(v, 'T1', 600), T2 = num(v, 'T2', 300);
          if (T1 <= T2) return { error: 'Source T₁ must be strictly higher than Sink T₂.' };
          const eta = (1 - T2 / T1) * 100;
          return { value: eta, substituted: `(1 − ${T2}/${T1}) × 100 = ${eta.toFixed(1)}%` };
        },
      },
      {
        id: 'T2',
        targetSymbol: 'T₂',
        targetLabel: { en: 'Required Sink Temp (T₂)', hi: 'आवश्यक सिंक ताप (T₂)' },
        unit: 'K',
        rearrangedFormula: 'T₂ = T₁ · (1 − η/100)',
        inputs: [
          { key: 'T1', symbol: 'T₁', label: { en: 'Source Temp', hi: 'स्रोत ताप' }, unit: 'K', defaultValue: 600, min: 100 },
          { key: 'eta', symbol: 'η', label: { en: 'Target Efficiency', hi: 'लक्ष्य दक्षता' }, unit: '%', defaultValue: 60, min: 1, max: 99 },
        ],
        solve: (v) => {
          const T1 = num(v, 'T1', 600), eta = num(v, 'eta', 60);
          if (eta >= 100 || eta <= 0) return { error: 'Efficiency must be between 1% and 99%.' };
          const T2 = T1 * (1 - eta / 100);
          return { value: T2, substituted: `${T1} × (1 − ${eta / 100}) = ${T2.toFixed(1)} K` };
        },
      },
    ],
  },

  // ===== CH 14 PENDULUM & SHM =====
  'simple-pendulum': {
    simId: 'simple-pendulum',
    steps: [
      {
        title: { en: 'Restoring Tangential Torque', hi: 'प्रत्यानयन स्पर्शरेखीय बल' },
        equation: 'F_t = −m·g·sin(θ) ≈ −m·g·(x / L)   (for small θ)',
        note: { en: 'For small angles (θ < 15°), sin θ ≈ θ = x/L gives linear SHM restoring force.', hi: 'छोटे कोण के लिए sin θ ≈ θ रखने पर सरल आवर्त गति प्राप्त होती है।' },
      },
      {
        title: { en: 'Compare with a = −ω²·x', hi: 'a = −ω²·x से तुलना' },
        equation: 'ω² = g / L   ⇒   T = 2π / ω = 2π · √(L / g)',
        note: { en: 'Mass m cancels out—a heavy brass bob and light wooden bob swing with the exact same period!', hi: 'द्रव्यमान m कट जाता है—आवर्तकाल T गोलक के द्रव्यमान पर निर्भर नहीं करता!' },
      },
    ],
    solvers: [
      {
        id: 'T',
        targetSymbol: 'T',
        targetLabel: { en: 'Time Period (T)', hi: 'आवर्तकाल (T)' },
        unit: 's',
        rearrangedFormula: 'T = 2π·√(L / g)',
        inputs: [
          { key: 'L', symbol: 'L', label: { en: 'String Length', hi: 'धागे की लंबाई' }, unit: 'm', defaultValue: 1.0, min: 0.05 },
          { key: 'g', symbol: 'g', label: { en: 'Gravity', hi: 'गुरुत्वीय त्वरण' }, unit: 'm/s²', defaultValue: 9.8, min: 0.5 },
        ],
        solve: (v) => {
          const L = num(v, 'L', 1), g = num(v, 'g', 9.8);
          if (L <= 0 || g <= 0) return { error: 'L and g must be positive.' };
          const T = 2 * Math.PI * Math.sqrt(L / g);
          return { value: T, substituted: `2π·√(${L} / ${g}) = ${T.toFixed(3)} s` };
        },
      },
      {
        id: 'L',
        targetSymbol: 'L',
        targetLabel: { en: 'Required Length (L)', hi: 'आवश्यक लंबाई (L)' },
        unit: 'm',
        rearrangedFormula: 'L = g · T² / (4π²)',
        inputs: [
          { key: 'T', symbol: 'T', label: { en: 'Time Period', hi: 'आवर्तकाल' }, unit: 's', defaultValue: 2.0, min: 0.1 },
          { key: 'g', symbol: 'g', label: { en: 'Gravity', hi: 'गुरुत्वीय त्वरण' }, unit: 'm/s²', defaultValue: 9.8, min: 0.5 },
        ],
        solve: (v) => {
          const T = num(v, 'T', 2), g = num(v, 'g', 9.8);
          const L = (g * T * T) / (4 * Math.PI * Math.PI);
          return { value: L, substituted: `${g} × ${T}² / (4π²) = ${L.toFixed(3)} m` };
        },
      },
    ],
  },

  // ===== CH 15 DOPPLER =====
  'doppler-effect': {
    simId: 'doppler-effect',
    steps: [
      {
        title: { en: 'Wavefront Compression Ahead of Source', hi: 'स्रोत के आगे तरंगाग्रों का संपीड़न' },
        equation: 'λ′ = (v − v_s) / f₀',
        note: { en: 'Moving toward the listener squeezes consecutive crests closer together.', hi: 'स्रोत श्रोता की ओर आने पर तरंगदैर्घ्य λ′ घट जाती है।' },
      },
      {
        title: { en: 'Relative Wave Speed at Moving Observer', hi: 'गतिमान श्रोता पर सापेक्ष तरंग वेग' },
        equation: 'f′ = (v + v_o) / λ′ = f₀ · (v + v_o) / (v − v_s)',
        note: { en: 'Flip signs when source or observer recedes away from the other.', hi: 'दूर जाने पर चिह्न विपरीत हो जाते हैं।' },
      },
    ],
    solvers: [
      {
        id: 'fprime',
        targetSymbol: 'f′',
        targetLabel: { en: 'Observed Frequency (f′)', hi: 'आभासी आवृत्ति (f′)' },
        unit: 'Hz',
        rearrangedFormula: 'f′ = f₀ · (v + v_o) / (v − v_s)',
        inputs: [
          { key: 'f0', symbol: 'f₀', label: { en: 'Source Freq', hi: 'स्रोत आवृत्ति' }, unit: 'Hz', defaultValue: 500, min: 20 },
          { key: 'v', symbol: 'v', label: { en: 'Sound Speed', hi: 'ध्वनि चाल' }, unit: 'm/s', defaultValue: 340, min: 50 },
          { key: 'vs', symbol: 'v_s', label: { en: 'Source Speed (+approach)', hi: 'स्रोत चाल' }, unit: 'm/s', defaultValue: 34 },
          { key: 'vo', symbol: 'v_o', label: { en: 'Observer Speed (+approach)', hi: 'श्रोता चाल' }, unit: 'm/s', defaultValue: 0 },
        ],
        solve: (v) => {
          const f0 = num(v, 'f0', 500), cs = num(v, 'v', 340), vs = num(v, 'vs', 34), vo = num(v, 'vo', 0);
          if (vs >= cs) return { error: 'Source speed v_s must be below speed of sound v.' };
          const fp = f0 * ((cs + vo) / (cs - vs));
          return { value: fp, substituted: `${f0} × (${cs}+${vo})/(${cs}−${vs}) = ${fp.toFixed(1)} Hz` };
        },
      },
    ],
  },

  // ===== CH 16 COULOMB & GAUSS =====
  'coulombs-law': {
    simId: 'coulombs-law',
    steps: [
      {
        title: { en: 'Electrostatic Inverse-Square Law', hi: 'स्थिरवैद्युत व्युत्क्रम-वर्ग नियम' },
        equation: 'F = (1 / 4πε₀) · |q₁·q₂| / r² = k · |q₁·q₂| / r²',
        note: { en: 'Here k = 8.99 × 10⁹ N·m²/C². Opposite signs attract; like signs repel.', hi: 'यहाँ k = 8.99 × 10⁹ N·m²/C²। विपरीत आवेश आकर्षित और समान प्रतिकर्षित करते हैं।' },
      },
    ],
    solvers: [
      {
        id: 'F',
        targetSymbol: 'F',
        targetLabel: { en: 'Coulomb Force (F)', hi: 'कूलॉम बल (F)' },
        unit: 'N',
        rearrangedFormula: 'F = k·|q₁·q₂| / r²',
        inputs: [
          { key: 'q1', symbol: 'q₁', label: { en: 'Charge 1', hi: 'आवेश 1' }, unit: 'μC', defaultValue: 6 },
          { key: 'q2', symbol: 'q₂', label: { en: 'Charge 2', hi: 'आवेश 2' }, unit: 'μC', defaultValue: -6 },
          { key: 'r', symbol: 'r', label: { en: 'Separation', hi: 'दूरी (r)' }, unit: 'cm', defaultValue: 24, min: 1 },
        ],
        solve: (v) => {
          const q1 = num(v, 'q1', 6), q2 = num(v, 'q2', -6), rM = num(v, 'r', 24) / 100;
          if (rM <= 0) return { error: 'Distance r must be > 0.' };
          const F = (K_SI * Math.abs(q1 * 1e-6 * q2 * 1e-6)) / (rM * rM);
          return { value: F, substituted: `k·|${q1}μC·${q2}μC| / (${rM}m)² = ${F.toFixed(2)} N` };
        },
      },
    ],
  },

  'gauss-dipole': {
    simId: 'gauss-dipole',
    steps: [
      {
        title: { en: 'Spherical Symmetry Surface Integral', hi: 'गोलीय सममिति पृष्ठ समाकलन' },
        equation: 'Φ_E = ∮ E · dA = E · (4π·R²)',
        note: { en: 'E is uniform and radial everywhere on a concentric Gaussian sphere of radius R.', hi: 'गॉसीय गोले पर विद्युत क्षेत्र E हर बिंदु पर त्रिज्यीय व समान है।' },
      },
      {
        title: { en: 'Cancel 4πR² to Prove Gauss’s Law', hi: '4πR² काटकर गॉस नियम सिद्ध करें' },
        equation: 'Φ_E = (q / 4πε₀R²) · (4πR²) = q_enc / ε₀',
        note: { en: 'Radius R cancels completely! Total flux depends ONLY on enclosed charge q_enc.', hi: 'त्रिज्या R कट जाती है—फ्लक्स केवल परिबद्ध आवेश पर निर्भर करता है।' },
      },
      {
        title: { en: 'Electric Dipole Torque in Uniform Field', hi: 'एकसमान क्षेत्र में द्विध्रुव बल-आघूर्ण' },
        equation: 'τ = (q·E)·(2a·sinθ) = p · E · sin(θ)',
        note: { en: 'Equal and opposite forces ±qE form a couple rotating dipole p toward E.', hi: 'समान व विपरीत बल ±qE मिलकर बलयुग्म बनाते हैं।' },
      },
    ],
    solvers: [
      {
        id: 'flux',
        targetSymbol: 'Φ_E',
        targetLabel: { en: 'Total Electric Flux (Φ_E)', hi: 'कुल विद्युत फ्लक्स (Φ_E)' },
        unit: '×10⁵ N·m²/C',
        rearrangedFormula: 'Φ_E = q_enc / ε₀',
        inputs: [
          { key: 'q', symbol: 'q', label: { en: 'Enclosed Charge', hi: 'परिबद्ध आवेश' }, unit: 'μC', defaultValue: 8 },
        ],
        solve: (v) => {
          const q = num(v, 'q', 8);
          const phi = (q * 1e-6) / EPS0_SI / 1e5;
          return { value: phi, substituted: `(${q}×10⁻⁶) / (8.854×10⁻¹²) = ${phi.toFixed(2)}×10⁵ N·m²/C` };
        },
      },
      {
        id: 'qenc',
        targetSymbol: 'q_enc',
        targetLabel: { en: 'Enclosed Charge (q)', hi: 'परिबद्ध आवेश (q)' },
        unit: 'μC',
        rearrangedFormula: 'q_enc = ε₀ · Φ_E',
        inputs: [
          { key: 'phi', symbol: 'Φ_E', label: { en: 'Electric Flux', hi: 'विद्युत फ्लक्स' }, unit: '×10⁵ N·m²/C', defaultValue: 9.04 },
        ],
        solve: (v) => {
          const phi = num(v, 'phi', 9.04);
          const q = phi * 1e5 * EPS0_SI * 1e6;
          return { value: q, substituted: `8.854×10⁻¹² × ${phi}×10⁵ = ${q.toFixed(2)} μC` };
        },
      },
    ],
  },

  // ===== CH 18 OHM'S LAW & WHEATSTONE =====
  'ohms-law': {
    simId: 'ohms-law',
    steps: [
      {
        title: { en: 'Ohm’s Law & Drift Proportionality', hi: 'ओम का नियम' },
        equation: 'V = I · R   ⇒   I = V / R',
        note: { en: 'At constant temperature, current through an ohmic conductor is proportional to voltage.', hi: 'स्थिर ताप पर धारा विभवांतर के समानुपाती होती है।' },
      },
      {
        title: { en: 'Joule Heating & Electrical Power', hi: 'जूल तापन और विद्युत शक्ति' },
        equation: 'P = V·I = I²·R = V² / R',
        note: { en: 'Doubling voltage across a fixed resistor quadruples dissipated power!', hi: 'नियत प्रतिरोध पर वोल्टेज दोगुना करने से शक्ति 4 गुना हो जाती है!' },
      },
    ],
    solvers: [
      {
        id: 'I',
        targetSymbol: 'I',
        targetLabel: { en: 'Current (I)', hi: 'विद्युत धारा (I)' },
        unit: 'A',
        rearrangedFormula: 'I = V / R',
        inputs: [
          { key: 'V', symbol: 'V', label: { en: 'Voltage', hi: 'वोल्टता' }, unit: 'V', defaultValue: 12 },
          { key: 'R', symbol: 'R', label: { en: 'Resistance', hi: 'प्रतिरोध' }, unit: 'Ω', defaultValue: 6, min: 0.1 },
        ],
        solve: (v) => {
          const V = num(v, 'V', 12), R = num(v, 'R', 6);
          if (R <= 0) return { error: 'Resistance R must be > 0.' };
          const I = V / R;
          return { value: I, substituted: `${V} / ${R} = ${I.toFixed(2)} A` };
        },
      },
      {
        id: 'R',
        targetSymbol: 'R',
        targetLabel: { en: 'Resistance (R)', hi: 'प्रतिरोध (R)' },
        unit: 'Ω',
        rearrangedFormula: 'R = V / I',
        inputs: [
          { key: 'V', symbol: 'V', label: { en: 'Voltage', hi: 'वोल्टता' }, unit: 'V', defaultValue: 12 },
          { key: 'I', symbol: 'I', label: { en: 'Current', hi: 'धारा' }, unit: 'A', defaultValue: 2, min: 0.01 },
        ],
        solve: (v) => {
          const V = num(v, 'V', 12), I = num(v, 'I', 2);
          if (I === 0) return { error: 'Current I cannot be zero.' };
          const R = V / I;
          return { value: R, substituted: `${V} / ${I} = ${R.toFixed(2)} Ω` };
        },
      },
    ],
  },

  'wheatstone-bridge': {
    simId: 'wheatstone-bridge',
    steps: [
      {
        title: { en: 'Null-Deflection Condition (I_g = 0)', hi: 'शून्य विक्षेप संतुलन शर्त' },
        equation: 'V_B = V_D   ⇒   I₁·R₁ = I₂·R₃   and   I₁·R₂ = I₂·R₄',
        note: { en: 'When galvanometer reads zero, branch currents pass cleanly through each side.', hi: 'गैल्वेनोमीटर शून्य होने पर बिंदु B और D का विभव बराबर होता है।' },
      },
      {
        title: { en: 'Divide Both Loop Equations', hi: 'दोनों समीकरणों का भाग दें' },
        equation: 'R₁ / R₂ = R₃ / R₄   ⇒   R₄ = R₃ · (R₂ / R₁)',
        note: { en: 'Allows ultra-accurate measurement of unknown resistance R₄ independent of battery voltage E!', hi: 'बैटरी वोल्टेज से स्वतंत्र अज्ञात प्रतिरोध R₄ की सटीक गणना संभव होती है।' },
      },
    ],
    solvers: [
      {
        id: 'R4',
        targetSymbol: 'R₄',
        targetLabel: { en: 'Balance Unknown Resistance (R₄)', hi: 'संतुलन अज्ञात प्रतिरोध (R₄)' },
        unit: 'Ω',
        rearrangedFormula: 'R₄ = R₃ · (R₂ / R₁)',
        inputs: [
          { key: 'R1', symbol: 'R₁', label: { en: 'Arm P (R₁)', hi: 'भुजा R₁' }, unit: 'Ω', defaultValue: 20, min: 0.1 },
          { key: 'R2', symbol: 'R₂', label: { en: 'Arm Q (R₂)', hi: 'भुजा R₂' }, unit: 'Ω', defaultValue: 40, min: 0.1 },
          { key: 'R3', symbol: 'R₃', label: { en: 'Arm R (R₃)', hi: 'भुजा R₃' }, unit: 'Ω', defaultValue: 30, min: 0.1 },
        ],
        solve: (v) => {
          const R1 = num(v, 'R1', 20), R2 = num(v, 'R2', 40), R3 = num(v, 'R3', 30);
          if (R1 <= 0) return { error: 'R₁ must be > 0.' };
          const R4 = (R3 * R2) / R1;
          return { value: R4, substituted: `${R3} × (${R2}/${R1}) = ${R4.toFixed(2)} Ω` };
        },
      },
    ],
  },

  // ===== CH 19 SOLENOID & LORENTZ =====
  'solenoid-wires': {
    simId: 'solenoid-wires',
    steps: [
      {
        title: { en: 'Apply Ampere’s Circuital Law to Rectangular Loop', hi: 'आयताकार लूप पर एम्पीयर का परिपथीय नियम' },
        equation: '∮ B · dl = B·L + 0 + 0 + 0 = μ₀ · (n·L · I)',
        note: { en: 'Field outside an ideal long solenoid is zero; perpendicular sides contribute zero dot product.', hi: 'आदर्श लंबी परिनालिका के बाहर क्षेत्र शून्य होता है और लंबवत भुजाओं का योगदान शून्य रहता है।' },
      },
      {
        title: { en: 'Cancel Loop Length L', hi: 'लूप लंबाई L को काटें' },
        equation: 'B = μ₀ · n · I',
        note: { en: 'Uniform interior magnetic field depends ONLY on turn density n and current I.', hi: 'भीतर का एकसमान क्षेत्र केवल प्रति मीटर फेरों n और धारा I पर निर्भर करता है।' },
      },
    ],
    solvers: [
      {
        id: 'B',
        targetSymbol: 'B',
        targetLabel: { en: 'Solenoid Magnetic Field (B)', hi: 'परिनालिका चुंबकीय क्षेत्र (B)' },
        unit: 'mT',
        rearrangedFormula: 'B = μ₀ · n · I',
        inputs: [
          { key: 'n', symbol: 'n', label: { en: 'Turns/meter', hi: 'प्रति मीटर फेरे' }, unit: 'm⁻¹', defaultValue: 800, min: 1 },
          { key: 'I', symbol: 'I', label: { en: 'Current', hi: 'धारा' }, unit: 'A', defaultValue: 5, min: 0.1 },
        ],
        solve: (v) => {
          const n = num(v, 'n', 800), I = num(v, 'I', 5);
          const BmT = MU0_SI * n * I * 1000;
          return { value: BmT, substituted: `(4π×10⁻⁷) × ${n} × ${I} = ${BmT.toFixed(2)} mT` };
        },
      },
      {
        id: 'I',
        targetSymbol: 'I',
        targetLabel: { en: 'Required Current (I)', hi: 'आवश्यक धारा (I)' },
        unit: 'A',
        rearrangedFormula: 'I = B / (μ₀ · n)',
        inputs: [
          { key: 'B', symbol: 'B', label: { en: 'Target Field', hi: 'लक्ष्य क्षेत्र' }, unit: 'mT', defaultValue: 10, min: 0.1 },
          { key: 'n', symbol: 'n', label: { en: 'Turns/meter', hi: 'प्रति मीटर फेरे' }, unit: 'm⁻¹', defaultValue: 800, min: 1 },
        ],
        solve: (v) => {
          const B = num(v, 'B', 10) / 1000, n = num(v, 'n', 800);
          if (n <= 0) return { error: 'n must be > 0.' };
          const I = B / (MU0_SI * n);
          return { value: I, substituted: `${B * 1000} mT / (μ₀ × ${n}) = ${I.toFixed(2)} A` };
        },
      },
    ],
  },

  // ===== CH 21 TRANSFORMER =====
  transformer: {
    simId: 'transformer',
    steps: [
      {
        title: { en: 'Faraday’s Law in Shared Iron Core', hi: 'साझा लौह क्रोड में फैराडे का नियम' },
        equation: 'V_p = −N_p · dΦ/dt   and   V_s = −N_s · dΦ/dt',
        note: { en: 'Laminated soft-iron core links virtually the same flux Φ through both primary and secondary windings.', hi: 'पटलित नरम लोहे का क्रोड दोनों कुंडलियों से समान फ्लक्स Φ जोड़ता है।' },
      },
      {
        title: { en: 'Turns Ratio & Ideal Power Conservation', hi: 'फेरों का अनुपात और शक्ति संरक्षण' },
        equation: 'V_s / V_p = N_s / N_p = I_p / I_s   (η = 100% ideal)',
        note: { en: 'Stepping voltage UP automatically steps current DOWN so power P = V·I is conserved.', hi: 'वोल्टेज बढ़ाने पर धारा उसी अनुपात में कम हो जाती है ताकि शक्ति P = V·I संरक्षित रहे।' },
      },
    ],
    solvers: [
      {
        id: 'Vs',
        targetSymbol: 'V_s',
        targetLabel: { en: 'Secondary Voltage (V_s)', hi: 'द्वितीयक वोल्टता (V_s)' },
        unit: 'V',
        rearrangedFormula: 'V_s = V_p · (N_s / N_p)',
        inputs: [
          { key: 'Vp', symbol: 'V_p', label: { en: 'Primary Voltage', hi: 'प्राथमिक वोल्टता' }, unit: 'V', defaultValue: 220, min: 1 },
          { key: 'Np', symbol: 'N_p', label: { en: 'Primary Turns', hi: 'प्राथमिक फेरे' }, unit: '', defaultValue: 100, min: 1 },
          { key: 'Ns', symbol: 'N_s', label: { en: 'Secondary Turns', hi: 'द्वितीयक फेरे' }, unit: '', defaultValue: 400, min: 1 },
        ],
        solve: (v) => {
          const Vp = num(v, 'Vp', 220), Np = num(v, 'Np', 100), Ns = num(v, 'Ns', 400);
          if (Np <= 0) return { error: 'N_p must be > 0.' };
          const Vs = Vp * (Ns / Np);
          return { value: Vs, substituted: `${Vp} × (${Ns}/${Np}) = ${Vs.toFixed(1)} V` };
        },
      },
    ],
  },

  // ===== CH 24 OPTICS: THIN LENS & SNELL/TIR =====
  'thin-lens': {
    simId: 'thin-lens',
    steps: [
      {
        title: { en: 'Gaussian Thin Lens Equation', hi: 'पतले लेंस का सूत्र' },
        equation: '1 / f = 1 / v − 1 / u   (Cartesian Sign Convention: u < 0)',
        note: { en: 'Light travels left-to-right: object distance u is negative, convex f > 0, concave f < 0.', hi: 'चिह्न परिपाटी में वस्तु दूरी u ऋणात्मक, उत्तल f धनात्मक और अवतल f ऋणात्मक होता है।' },
      },
      {
        title: { en: 'Solve for Image Distance v & Magnification m', hi: 'प्रतिबिंब दूरी v और आवर्धन m' },
        equation: 'v = (f · u) / (u + f)   |   m = v / u = h_i / h_o',
        note: { en: 'Positive v means Real & Inverted (m < 0); negative v means Virtual & Upright (m > 0).', hi: 'धनात्मक v वास्तविक उल्टा प्रतिबिंब और ऋणात्मक v आभासी सीधा प्रतिबिंब दर्शाता है।' },
      },
    ],
    solvers: [
      {
        id: 'v',
        targetSymbol: 'v',
        targetLabel: { en: 'Image Distance (v)', hi: 'प्रतिबिंब दूरी (v)' },
        unit: 'cm',
        rearrangedFormula: 'v = f·u / (u + f)  [u = −|u|]',
        inputs: [
          { key: 'f', symbol: 'f', label: { en: 'Focal Length', hi: 'फोकस दूरी' }, unit: 'cm', defaultValue: 15 },
          { key: 'uAbs', symbol: '|u|', label: { en: 'Object Distance', hi: 'वस्तु दूरी' }, unit: 'cm', defaultValue: 30, min: 1 },
        ],
        solve: (v) => {
          const f = num(v, 'f', 15), u = -Math.abs(num(v, 'uAbs', 30));
          if (Math.abs(u + f) < 1e-4) return { error: 'Object is right at focus F → image forms at ∞.' };
          const imgV = (f * u) / (u + f);
          return { value: imgV, substituted: `(${f})(${u}) / (${u} + ${f}) = ${imgV.toFixed(2)} cm` };
        },
      },
      {
        id: 'f',
        targetSymbol: 'f',
        targetLabel: { en: 'Focal Length (f)', hi: 'फोकस दूरी (f)' },
        unit: 'cm',
        rearrangedFormula: 'f = u·v / (u − v)',
        inputs: [
          { key: 'u', symbol: 'u', label: { en: 'Object Distance (signed)', hi: 'वस्तु दूरी (चिह्न सहित)' }, unit: 'cm', defaultValue: -30 },
          { key: 'v', symbol: 'v', label: { en: 'Image Distance (signed)', hi: 'प्रतिबिंब दूरी' }, unit: 'cm', defaultValue: 30 },
        ],
        solve: (v) => {
          const u = num(v, 'u', -30), imgV = num(v, 'v', 30);
          if (Math.abs(u - imgV) < 1e-4) return { error: 'u and v cannot be identical.' };
          const f = (u * imgV) / (u - imgV);
          return { value: f, substituted: `(${u})(${imgV}) / (${u} − ${imgV}) = ${f.toFixed(2)} cm` };
        },
      },
    ],
  },

  'snell-prism-tir': {
    simId: 'snell-prism-tir',
    steps: [
      {
        title: { en: 'Snell’s Law at Boundary', hi: 'सीमा पर स्नेल का नियम' },
        equation: 'n₁ · sin(i) = n₂ · sin(r)',
        note: { en: 'Light bends toward the normal entering a denser medium (n₂ > n₁), and away entering rarer (n₂ < n₁).', hi: 'विरल से सघन में जाने पर किरण अभिलंब की ओर झुकती है और सघन से विरल में दूर हटती है।' },
      },
      {
        title: { en: 'Critical Angle i_c for Total Internal Reflection', hi: 'पूर्ण आंतरिक परावर्तन का क्रांतिक कोण i_c' },
        equation: 'Set r = 90°:   sin(i_c) = n₂ / n₁   (for n₁ > n₂)',
        note: { en: 'Whenever i > i_c, sin(r) > 1 has no real solution → 100% of light reflects back inside!', hi: 'जब i > i_c होता है तो प्रकाश 100% भीतर परावर्तित हो जाता है।' },
      },
    ],
    solvers: [
      {
        id: 'ic',
        targetSymbol: 'i_c',
        targetLabel: { en: 'Critical Angle (i_c)', hi: 'क्रांतिक कोण (i_c)' },
        unit: '°',
        rearrangedFormula: 'i_c = sin⁻¹(n₂ / n₁)',
        inputs: [
          { key: 'n1', symbol: 'n₁', label: { en: 'Denser Medium n₁', hi: 'सघन माध्यम n₁' }, unit: '', defaultValue: 1.5, min: 1 },
          { key: 'n2', symbol: 'n₂', label: { en: 'Rarer Medium n₂', hi: 'विरल माध्यम n₂' }, unit: '', defaultValue: 1.0, min: 1 },
        ],
        solve: (v) => {
          const n1 = num(v, 'n1', 1.5), n2 = num(v, 'n2', 1.0);
          if (n2 >= n1) return { error: 'TIR requires denser-to-rarer light travel (n₁ > n₂).' };
          const ic = (Math.asin(n2 / n1) * 180) / Math.PI;
          return { value: ic, substituted: `sin⁻¹(${n2} / ${n1}) = ${ic.toFixed(2)}°` };
        },
      },
    ],
  },

  // ===== CH 26 DE BROGLIE =====
  'de-broglie': {
    simId: 'de-broglie',
    steps: [
      {
        title: { en: 'de Broglie Matter Wave Hypothesis', hi: 'डी-ब्रॉग्ली द्रव्य तरंग परिकल्पना' },
        equation: 'λ = h / p = h / (m · v)',
        note: { en: 'Every moving particle with momentum p possesses an associated wave of wavelength h/p.', hi: 'संवेग p वाले प्रत्येक गतिमान कण से तरंगदैर्घ्य λ = h/p की तरंग जुड़ी होती है।' },
      },
      {
        title: { en: 'Accelerate Electron Through Voltage V', hi: 'विभव V से त्वरित इलेक्ट्रॉन' },
        equation: 'K = e·V = p² / (2m)  ⇒  λ = h / √(2·m·e·V) ≈ 1.227 / √V nm',
        note: { en: 'At V = 100 V, λ_e = 0.123 nm — matching atomic crystal spacings for electron diffraction!', hi: 'V = 100 V पर λ_e = 0.123 nm होता है, जो क्रिस्टल विवर्तन के अनुकूल है।' },
      },
    ],
    solvers: [
      {
        id: 'lambda',
        targetSymbol: 'λ',
        targetLabel: { en: 'Electron Wavelength (λ)', hi: 'इलेक्ट्रॉन तरंगदैर्घ्य (λ)' },
        unit: 'nm',
        rearrangedFormula: 'λ = 1.227 / √V  nm',
        inputs: [
          { key: 'V', symbol: 'V', label: { en: 'Accelerating Voltage', hi: 'त्वरक विभव' }, unit: 'V', defaultValue: 100, min: 1 },
        ],
        solve: (v) => {
          const V = num(v, 'V', 100);
          if (V <= 0) return { error: 'Voltage V must be > 0.' };
          const lam = 1.227 / Math.sqrt(V);
          return { value: lam, substituted: `1.227 / √(${V}) = ${lam.toFixed(4)} nm` };
        },
      },
      {
        id: 'V',
        targetSymbol: 'V',
        targetLabel: { en: 'Required Voltage (V)', hi: 'आवश्यक विभव (V)' },
        unit: 'V',
        rearrangedFormula: 'V = (1.227 / λ)²',
        inputs: [
          { key: 'lam', symbol: 'λ', label: { en: 'Target Wavelength', hi: 'लक्ष्य तरंगदैर्घ्य' }, unit: 'nm', defaultValue: 0.1227, min: 0.001 },
        ],
        solve: (v) => {
          const lam = num(v, 'lam', 0.1227);
          if (lam <= 0) return { error: 'Wavelength λ must be > 0.' };
          const V = Math.pow(1.227 / lam, 2);
          return { value: V, substituted: `(1.227 / ${lam})² = ${V.toFixed(1)} V` };
        },
      },
    ],
  },

  // ===== CH 28 BINDING ENERGY =====
  'binding-energy': {
    simId: 'binding-energy',
    steps: [
      {
        title: { en: 'Nuclear Mass Defect Δm', hi: 'द्रव्यमान क्षति Δm' },
        equation: 'Δm = [Z·m_p + (A − Z)·m_n] − M_nucleus',
        note: { en: 'A bound nucleus weighs slightly LESS than the sum of its individual free protons and neutrons.', hi: 'बँधे हुए नाभिक का द्रव्यमान उसके स्वतंत्र न्यूक्लिऑनों के कुल द्रव्यमान से कम होता है।' },
      },
      {
        title: { en: 'Einstein Mass–Energy Equivalence', hi: 'आइंस्टीन द्रव्यमान-ऊर्जा तुल्यता' },
        equation: 'E_b = Δm · c² = Δm (in u) × 931.5 MeV   |   BE/A = E_b / A',
        note: { en: 'BE/A peaks at Iron-56 (~8.8 MeV); light fusion and heavy fission both move toward this peak releasing energy!', hi: 'BE/A लोहे (Fe-56) पर अधिकतम (~8.8 MeV) होता है; संलयन व विखंडन दोनों ऊर्जा मुक्त करते हैं!' },
      },
    ],
    solvers: [
      {
        id: 'Eb',
        targetSymbol: 'E_b',
        targetLabel: { en: 'Total Binding Energy (E_b)', hi: 'कुल बंधन ऊर्जा (E_b)' },
        unit: 'MeV',
        rearrangedFormula: 'E_b = Δm × 931.5 MeV',
        inputs: [
          { key: 'dm', symbol: 'Δm', label: { en: 'Mass Defect', hi: 'द्रव्यमान क्षति' }, unit: 'u', defaultValue: 0.528, min: 0.0001 },
        ],
        solve: (v) => {
          const dm = num(v, 'dm', 0.528);
          const Eb = dm * 931.5;
          return { value: Eb, substituted: `${dm} u × 931.5 MeV/u = ${Eb.toFixed(2)} MeV` };
        },
      },
    ],
  },
};

// Automatic fallback spec generator so ALL 51 built-in + custom AI sims have working derivations & solvers
function buildFallbackSpec(sim: PhysicsSimulation): FormulaDerivationSpec {
  const mainVar = sim.variables[0];
  const secondVar = sim.variables[1];
  const steps = [
    {
      title: { en: 'Governing Physical Law', hi: 'मूल भौतिक नियम एवं सूत्र' },
      equation: sim.formulaDisplay,
      note: sim.explanation,
    },
    ...(sim.secondaryFormulas ?? []).map((sf) => ({
      title: sf.label,
      equation: sf.formula,
      note: {
        en: 'Auxiliary relationship linking stage variables directly to measurable classroom telemetry.',
        hi: 'प्रमुख चरों को सजीव मापों से जोड़ने वाला सहायक समीकरण।',
      },
    })),
    {
      title: { en: 'Real-World Classroom Application', hi: 'व्यावहारिक एवं दैनिक जीवन अनुप्रयोग' },
      equation: sim.variables.map((v) => `${v.symbol} (${v.unit || 'ratio'})`).join('  ·  '),
      note: sim.realLife,
    },
  ];

  // Build smart numeric sensitivity solver for the simulation's variables
  const solvers: VariableSolverSpec[] = [];
  if (mainVar) {
    solvers.push({
      id: 'ratio-check',
      targetSymbol: 'Eval',
      targetLabel: { en: `Inspect ${sim.title.en.split('(')[0].trim()}`, hi: 'सूत्र मान जाँच (Live Ratio)' },
      unit: secondVar?.unit || mainVar.unit || '',
      rearrangedFormula: sim.formulaDisplay,
      inputs: sim.variables.slice(0, 4).map((v) => ({
        key: v.key,
        symbol: v.symbol,
        label: v.label,
        unit: v.unit,
        defaultValue: v.defaultValue,
        min: v.min,
        max: v.max,
      })),
      solve: (vals) => {
        // Compute a meaningful physics-aware check expression for standard remaining sims
        if (sim.id === 'electric-potential') {
          const q = num(vals, 'q', 6), r = Math.max(0.05, num(vals, 'r', 1.5));
          const V = (K_SI * q * 1e-6) / r / 1000;
          return { value: V, substituted: `V = k·(${q}μC)/(${r}m) = ${V.toFixed(2)} kV` };
        }
        if (sim.id === 'microscope-telescope') {
          const fo = Math.max(0.1, num(vals, 'fo', 2)), fe = Math.max(0.1, num(vals, 'fe', 5)), L = num(vals, 'L', 16), mode = num(vals, 'mode', 1);
          const M = mode >= 0 ? (L / fo) * (1 + 25 / fe) : (fo * 25) / fe;
          return { value: M, substituted: mode >= 0 ? `M = (${L}/${fo})(1 + 25/${fe}) = ${M.toFixed(1)}×` : `M = f_o/f_e = ${M.toFixed(1)}×` };
        }
        if (sim.id === 'diffraction-polarization') {
          const lam = num(vals, 'lambda', 550), a = Math.max(0.05, num(vals, 'a', 0.25)), D = num(vals, 'D', 1.5);
          const w0 = (2 * lam * 1e-6 * D) / (a * 1e-3);
          return { value: w0, substituted: `w₀ = 2λD/a = ${w0.toFixed(2)} mm` };
        }
        if (sim.id === 'logic-gates') {
          const A = num(vals, 'A', 1) >= 0.5 ? 1 : 0;
          const B = num(vals, 'B', 0) >= 0.5 ? 1 : 0;
          const g = Math.round(num(vals, 'gate', 3));
          const Y = g === 0 ? A & B : g === 1 ? A | B : g === 2 ? (A ? 0 : 1) : g === 3 ? (A & B ? 0 : 1) : g === 4 ? (A | B ? 0 : 1) : A ^ B;
          return { value: Y, substituted: `A=${A}, B=${B} ⇒ Output Y = ${Y}` };
        }
        if (sim.id === 'shm-spring') {
          const m = Math.max(0.1, num(vals, 'm', 2)), k = Math.max(1, num(vals, 'k', 20));
          const T = 2 * Math.PI * Math.sqrt(m / k);
          return { value: T, substituted: `T = 2π·√(${m}/${k}) = ${T.toFixed(3)} s` };
        }
        if (sim.id === 'capacitance') {
          const A = num(vals, 'A', 50), d = Math.max(0.1, num(vals, 'd', 2)), kappa = num(vals, 'kappa', 1);
          const C = (kappa * EPS0_SI * (A * 1e-4)) / (d * 1e-3) * 1e12;
          return { value: C, substituted: `C = ${kappa}·ε₀·(${A}cm²)/(${d}mm) = ${C.toFixed(2)} pF` };
        }
        if (sim.id === 'dual-nature') {
          const nu = num(vals, 'freq', 8), phi = num(vals, 'phi', 2.2);
          const ePh = (H_SI * nu * 1e14) / 1.602e-19;
          const kMax = Math.max(0, ePh - phi);
          return { value: kMax, substituted: `K_max = ${ePh.toFixed(2)} − ${phi} = ${kMax.toFixed(2)} eV` };
        }
        if (sim.id === 'wave-optics') {
          const lam = num(vals, 'lambda', 550), D = num(vals, 'D', 1.5), d = Math.max(0.1, num(vals, 'd', 0.5));
          const beta = (lam * 1e-6 * D) / (d * 1e-3);
          return { value: beta, substituted: `β = λD/d = ${beta.toFixed(2)} mm` };
        }
        if (sim.id === 'work-energy') {
          const m = num(vals, 'm', 2), h = num(vals, 'h', 12), g = num(vals, 'g', 9.8);
          const E = m * g * h;
          return { value: E, substituted: `E_total = m·g·h = ${m}×${g}×${h} = ${E.toFixed(1)} J` };
        }
        if (sim.id === 'linear-momentum') {
          const m1 = num(vals, 'm1', 4), u1 = num(vals, 'u1', 6), m2 = num(vals, 'm2', 4), u2 = num(vals, 'u2', 0);
          const P = m1 * u1 + m2 * u2;
          return { value: P, substituted: `P_total = (${m1})(${u1}) + (${m2})(${u2}) = ${P.toFixed(1)} kg·m/s` };
        }
        if (sim.id === 'angular-momentum') {
          const r = num(vals, 'r', 1.4), m = num(vals, 'm', 3), L = num(vals, 'L', 24);
          const I = 1 + 2 * m * r * r;
          const w = L / I;
          return { value: w, substituted: `ω = ${L} / (1 + 2·${m}·${r}²) = ${w.toFixed(2)} rad/s` };
        }
        // Generic ratio summary for any other built-in or AI-generated custom formula
        const entries = sim.variables.slice(0, 4).map((v) => `${v.symbol}=${num(vals, v.key, v.defaultValue)}`);
        const firstVal = num(vals, mainVar.key, mainVar.defaultValue);
        return {
          value: firstVal,
          substituted: `${entries.join(', ')}  →  ${sim.formulaDisplay}`,
        };
      },
    });
  }

  return { simId: sim.id, steps, solvers };
}

export function getDerivationSpec(sim: PhysicsSimulation): FormulaDerivationSpec {
  return REGISTRY[sim.id] ?? buildFallbackSpec(sim);
}
