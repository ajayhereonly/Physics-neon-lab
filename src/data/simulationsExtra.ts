import { PhysicsSimulation } from '../types/physics';

export const EXTRA_SIMULATIONS: PhysicsSimulation[] = [
  // =========================================================================
  // CLASS 11 — NEW CHAPTERS (7)
  // =========================================================================

  // 1. UNITS & MEASUREMENTS
  {
    id: 'units-measurements',
    chapterId: 'units-measurements',
    title: {
      en: 'Units, Vernier Caliper & Error Propagation',
      hi: 'मात्रक, वर्नियर कैलिपर और त्रुटि संचरण',
    },
    subtitle: {
      en: 'Measure length with least count and compute percentage error in Z = Aᵃ · Bᵇ',
      hi: 'अल्पतमांक (Least Count) के साथ मापन और Z = Aᵃ · Bᵇ में प्रतिशत त्रुटि',
    },
    formulaDisplay: 'ΔZ / Z = a·(ΔA / A) + b·(ΔB / B)',
    secondaryFormulas: [
      { label: { en: 'Least Count', hi: 'अल्पतमांक (LC)' }, formula: 'LC = 1 MSD − 1 VSD' },
      { label: { en: 'Relative Error', hi: 'आपेक्षिक त्रुटि' }, formula: 'δZ = ΔZ / Z × 100%' },
    ],
    variables: [
      { key: 'A', symbol: 'A', label: { en: 'Measured Value A', hi: 'मापित मान A' }, unit: 'cm', min: 2, max: 20, step: 0.5, defaultValue: 10 },
      { key: 'dA', symbol: 'ΔA', label: { en: 'Absolute Error ΔA', hi: 'निरपेक्ष त्रुटि ΔA' }, unit: 'cm', min: 0.05, max: 1.0, step: 0.05, defaultValue: 0.2 },
      { key: 'aExp', symbol: 'a', label: { en: 'Power of A (a)', hi: 'A की घात (a)' }, unit: '', min: 1, max: 4, step: 1, defaultValue: 2 },
      { key: 'B', symbol: 'B', label: { en: 'Measured Value B', hi: 'मापित मान B' }, unit: 's', min: 2, max: 20, step: 0.5, defaultValue: 5 },
      { key: 'dB', symbol: 'ΔB', label: { en: 'Absolute Error ΔB', hi: 'निरपेक्ष त्रुटि ΔB' }, unit: 's', min: 0.05, max: 1.0, step: 0.05, defaultValue: 0.1 },
      { key: 'bExp', symbol: 'b', label: { en: 'Power of B (b)', hi: 'B की घात (b)' }, unit: '', min: 1, max: 3, step: 1, defaultValue: 1 },
    ],
    presets: [
      { id: 'area-sq', label: { en: 'Area (L²)', hi: 'क्षेत्रफल (L²)' }, params: { A: 10, dA: 0.2, aExp: 2, B: 10, dB: 0.05, bExp: 1 } },
      { id: 'sphere-vol', label: { en: 'Volume (r³)', hi: 'आयतन (r³)' }, params: { A: 5, dA: 0.1, aExp: 3, B: 10, dB: 0.05, bExp: 1 } },
      { id: 'pendulum-g', label: { en: 'Gravity g = 4π²L/T²', hi: 'गुरुत्व g = 4π²L/T²' }, params: { A: 10, dA: 0.1, aExp: 1, B: 2, dB: 0.05, bExp: 2 } },
    ],
    explanation: {
      en: 'In any derived physical quantity Z = Aᵃ · Bᵇ (or Aᵃ / Bᵇ), maximum permissible fractional errors ALWAYS ADD UP, multiplied by their respective exponents. Higher powers amplify measurement uncertainty dramatically.',
      hi: 'किसी भी व्युत्पन्न भौतिक राशि Z = Aᵃ · Bᵇ (या Aᵃ / Bᵇ) में अधिकतम संभावित भिन्नात्मक त्रुटियाँ हमेशा जुड़ती हैं और अपनी घातों से गुणा हो जाती हैं। अधिक घात वाली राशि की त्रुटि सबसे बड़ा प्रभाव डालती है।',
    },
    realLife: {
      en: 'Machinists use Vernier calipers (LC = 0.01 cm) and screw gauges (LC = 0.001 cm) to minimize Δr when manufacturing precision engine pistons where volume scales as r³.',
      hi: 'इंजीनियरिंग कार्यशालाओं में पिस्टन और बॉल बेयरिंग बनाते समय वर्नियर कैलिपर (0.01 cm) और स्क्रू गेज (0.001 cm) का उपयोग त्रुटि कम करने के लिए होता है।',
    },
    whatIfPrompts: [
      {
        id: 'err-cube',
        question: {
          en: 'If radius measurement has a 2% error, what is the maximum percentage error in the volume of a sphere (V ∝ r³)?',
          hi: 'यदि त्रिज्या के मापन में 2% त्रुटि हो, तो गोले के आयतन (V ∝ r³) में अधिकतम प्रतिशत त्रुटि कितनी होगी?',
        },
        hint: { en: 'Multiply the percentage error by exponent a = 3.', hi: 'प्रतिशत त्रुटि को घात a = 3 से गुणा करें।' },
        answer: {
          en: 'Percentage error triples to 3 × 2% = 6%! Even a tiny error in radius causes a large error in volume.',
          hi: 'आयतन में प्रतिशत त्रुटि तिगुनी होकर 3 × 2% = 6% हो जाती है!',
        },
        targetParams: { A: 5, dA: 0.1, aExp: 3, B: 20, dB: 0.05, bExp: 1 },
      },
    ],
    graphTitle: { en: 'Total % Error vs Exponent a', hi: 'कुल प्रतिशत त्रुटि बनाम घात a' },
    graphXLabel: 'Exponent a',
    graphYLabel: '% Error',
  },

  // 2. MOTION IN A STRAIGHT LINE (1D KINEMATICS)
  {
    id: 'motion-1d',
    chapterId: 'motion-1d',
    title: {
      en: 'Motion in a Straight Line (1D Equations)',
      hi: 'सरल रेखा में गति (गति के समीकरण)',
    },
    subtitle: {
      en: 'Live uniformly accelerated motion demonstrating v = u + at and s = ut + ½at²',
      hi: 'एकसमान त्वरित गति का सजीव प्रदर्शन: v = u + at तथा s = ut + ½at²',
    },
    formulaDisplay: 'v = u + a·t   |   s = u·t + ½a·t²',
    secondaryFormulas: [
      { label: { en: 'Velocity-Position', hi: 'वेग-विस्थापन समीकरण' }, formula: 'v² = u² + 2·a·s' },
      { label: { en: 'Average Velocity', hi: 'औसत वेग' }, formula: 'v_avg = (u + v) / 2' },
    ],
    variables: [
      { key: 'u', symbol: 'u', label: { en: 'Initial Velocity', hi: 'प्रारंभिक वेग (u)' }, unit: 'm/s', min: -10, max: 20, step: 1, defaultValue: 4 },
      { key: 'a', symbol: 'a', label: { en: 'Acceleration', hi: 'त्वरण (a)' }, unit: 'm/s²', min: -6, max: 8, step: 0.5, defaultValue: 2.5 },
      { key: 'tMax', symbol: 'T', label: { en: 'Observation Window', hi: 'समय अवधि (T)' }, unit: 's', min: 3, max: 10, step: 1, defaultValue: 6 },
    ],
    presets: [
      { id: 'speed-up', label: { en: 'Constant Acceleration', hi: 'नियत त्वरण' }, params: { u: 2, a: 3, tMax: 6 } },
      { id: 'braking', label: { en: 'Braking (Retardation)', hi: 'मंदन (ब्रेक लगाना)' }, params: { u: 18, a: -4, tMax: 6 } },
      { id: 'uniform', label: { en: 'Uniform Velocity (a=0)', hi: 'एकसमान वेग (a=0)' }, params: { u: 10, a: 0, tMax: 6 } },
    ],
    explanation: {
      en: 'When acceleration is constant, velocity changes linearly with time (v = u + at), while displacement grows quadratically (s = ut + ½at²). Notice that the area under the v–t graph equals exact displacement s!',
      hi: 'जब त्वरण नियत हो, तो वेग समय के साथ रैखिक रूप से बदलता है (v = u + at) जबकि विस्थापन परवलयाकार (s = ut + ½at²) रूप से बढ़ता है। v–t ग्राफ के नीचे का क्षेत्रफल विस्थापन s देता है।',
    },
    realLife: {
      en: 'Calculating aircraft runway takeoff lengths (v² = u² + 2as) and car emergency braking distances directly uses these three kinematic equations.',
      hi: 'हवाई जहाज के रनवे की लंबाई और कार की इमरजेंसी ब्रेकिंग दूरी की गणना सीधे गति के इन तीन समीकरणों से की जाती है।',
    },
    whatIfPrompts: [
      {
        id: 'm1d-brake',
        question: {
          en: 'A car moves at u = 18 m/s and brakes with a = −4 m/s². When does it stop and reverse?',
          hi: 'एक कार u = 18 m/s से चल रही है और a = −4 m/s² मंदन लगता है। यह कितने समय में रुकेगी?',
        },
        hint: { en: 'Set v = 0 in v = u + at → t = −u / a.', hi: 'v = u + at में v = 0 रखें → t = −u / a।' },
        answer: {
          en: 'It reaches zero velocity at t = 18 / 4 = 4.5 s after covering s = u²/(2|a|) = 40.5 m!',
          hi: 'यह t = 18 / 4 = 4.5 सेकंड में 40.5 m दूरी तय कर रुक जाती है!',
        },
        targetParams: { u: 18, a: -4, tMax: 6 },
      },
    ],
    graphTitle: { en: 'Velocity v(t) [Solid] & Displacement s(t) [Dashed]', hi: 'वेग v(t) [ठोस] व विस्थापन s(t) [डैश]' },
    graphXLabel: 't (s)',
    graphYLabel: 'v (m/s) · s/4',
  },

  // 3. MECHANICAL PROPERTIES OF SOLIDS (ELASTICITY)
  {
    id: 'solids-elasticity',
    chapterId: 'solids-elasticity',
    title: {
      en: 'Young’s Modulus & Stress–Strain Law',
      hi: 'यंग का प्रत्यास्थता गुणांक और प्रतिबल-विकृति',
    },
    subtitle: {
      en: 'Wire stretching under load showing tensile stress, strain, and elastic energy',
      hi: 'भार लटकाने पर तार में खिंचाव, प्रतिबल, विकृति और प्रत्यास्थ ऊर्जा',
    },
    formulaDisplay: 'Y = (F · L) / (A · ΔL) = Stress / Strain',
    secondaryFormulas: [
      { label: { en: 'Extension', hi: 'लंबाई में वृद्धि' }, formula: 'ΔL = (F · L) / (A · Y)' },
      { label: { en: 'Elastic Energy Density', hi: 'प्रत्यास्थ ऊर्जा घनत्व' }, formula: 'u = ½ · Stress · Strain' },
    ],
    variables: [
      { key: 'F', symbol: 'F', label: { en: 'Hanging Load', hi: 'लटकाया गया भार (F)' }, unit: 'kN', min: 1, max: 40, step: 1, defaultValue: 15 },
      { key: 'L', symbol: 'L', label: { en: 'Wire Length', hi: 'तार की मूल लंबाई (L)' }, unit: 'm', min: 1, max: 5, step: 0.5, defaultValue: 2.5 },
      { key: 'A', symbol: 'A', label: { en: 'Cross-Section Area', hi: 'अनुप्रस्थ काट क्षेत्रफल (A)' }, unit: 'mm²', min: 1, max: 10, step: 0.5, defaultValue: 3 },
      { key: 'Y', symbol: 'Y', label: { en: 'Young’s Modulus', hi: 'यंग गुणांक (Y)' }, unit: '×10¹¹ Pa', min: 0.5, max: 2.5, step: 0.1, defaultValue: 2.0 },
    ],
    presets: [
      { id: 'steel', label: { en: 'Steel Wire (Y=2.0)', hi: 'इस्पात का तार (Y=2.0)' }, params: { F: 15, L: 2.5, A: 3, Y: 2.0 } },
      { id: 'copper', label: { en: 'Copper Wire (Y=1.1)', hi: 'ताँबे का तार (Y=1.1)' }, params: { F: 15, L: 2.5, A: 3, Y: 1.1 } },
      { id: 'aluminum', label: { en: 'Aluminum (Y=0.7)', hi: 'एल्युमीनियम (Y=0.7)' }, params: { F: 20, L: 3.0, A: 2, Y: 0.7 } },
    ],
    explanation: {
      en: 'Within the proportional limit (Hooke’s Law), tensile stress (F/A) is directly proportional to longitudinal strain (ΔL/L). Steel has a much higher Young’s modulus than rubber or aluminum, making it far MORE elastic in physics!',
      hi: 'प्रत्यास्थता सीमा के भीतर प्रतिबल (F/A), विकृति (ΔL/L) के अनुक्रमानुपाती होता है। इस्पात (Steel) का यंग गुणांक अधिक होने के कारण भौतिकी में इस्पात, रबर की तुलना में अधिक प्रत्यास्थ होता है!',
    },
    realLife: {
      en: 'Suspension bridge cables and crane ropes are sized using Young’s modulus and ultimate tensile strength so they never pass the elastic yield point.',
      hi: 'झूला पुलों के केबल और क्रेन की रस्सियों की मोटाई यंग गुणांक के आधार पर तय की जाती है ताकि वे कभी स्थायी रूप से न खिंचें।',
    },
    whatIfPrompts: [
      {
        id: 'solid-steel-vs-al',
        question: {
          en: 'Switch from Steel (Y = 2.0) to Aluminum (Y = 0.7) under the same load. How much more does the wire stretch?',
          hi: 'समान भार पर इस्पात (Y = 2.0) से एल्युमीनियम (Y = 0.7) बदलने पर तार कितना अधिक खिंचेगा?',
        },
        hint: { en: 'Extension ΔL is inversely proportional to Y.', hi: 'खिंचाव ΔL, यंग गुणांक Y के व्युत्क्रमानुपाती होता है।' },
        answer: {
          en: 'Aluminum stretches nearly 3× as much as steel for the exact same hanging load because its Young’s modulus is much smaller!',
          hi: 'एल्युमीनियम लगभग 3 गुना अधिक खिंचता है क्योंकि इसका यंग गुणांक इस्पात से बहुत कम है!',
        },
        targetParams: { F: 15, L: 2.5, A: 3, Y: 0.7 },
      },
    ],
    graphTitle: { en: 'Stress (MPa) vs Strain (×10⁻³)', hi: 'प्रतिबल (MPa) बनाम विकृति (×10⁻³)' },
    graphXLabel: 'Strain (×10⁻³)',
    graphYLabel: 'Stress (MPa)',
  },

  // 4. MECHANICAL PROPERTIES OF FLUIDS (BERNOULLI & CONTINUITY)
  {
    id: 'fluids',
    chapterId: 'fluids',
    title: {
      en: 'Bernoulli’s Principle & Venturi Flow',
      hi: 'बर्नौली का सिद्धांत और सांतत्य समीकरण',
    },
    subtitle: {
      en: 'Incompressible fluid speeding up through a constriction as pressure drops',
      hi: 'सँकरे पाइप में द्रव का वेग बढ़ना और दाब का घटना (वेंचुरीमीटर)',
    },
    formulaDisplay: 'A₁v₁ = A₂v₂   |   P₁ + ½ρv₁² = P₂ + ½ρv₂²',
    secondaryFormulas: [
      { label: { en: 'Pressure Drop', hi: 'दाबांतर (ΔP)' }, formula: 'ΔP = ½ρ·(v₂² − v₁²)' },
      { label: { en: 'Volume Flow Rate', hi: 'आयतन प्रवाह दर' }, formula: 'Q = A₁ · v₁' },
    ],
    variables: [
      { key: 'v1', symbol: 'v₁', label: { en: 'Inlet Flow Speed', hi: 'प्रवेश वेग (v₁)' }, unit: 'm/s', min: 1, max: 8, step: 0.5, defaultValue: 3 },
      { key: 'ratio', symbol: 'A₁/A₂', label: { en: 'Constriction Ratio', hi: 'सँकरापन अनुपात (A₁/A₂)' }, unit: '×', min: 1.0, max: 3.5, step: 0.1, defaultValue: 2.2 },
      { key: 'rho', symbol: 'ρ', label: { en: 'Fluid Density', hi: 'द्रव का घनत्व (ρ)' }, unit: 'kg/m³', min: 600, max: 1400, step: 100, defaultValue: 1000 },
      { key: 'P1', symbol: 'P₁', label: { en: 'Inlet Pressure', hi: 'प्रवेश दाब (P₁)' }, unit: 'kPa', min: 100, max: 220, step: 10, defaultValue: 150 },
    ],
    presets: [
      { id: 'water-venturi', label: { en: 'Water Venturi', hi: 'जल वेंचुरीमीटर' }, params: { v1: 3, ratio: 2.2, rho: 1000, P1: 150 } },
      { id: 'narrow-throat', label: { en: 'Tight Throat (3×)', hi: 'अति सँकरा गला (3×)' }, params: { v1: 3.5, ratio: 3.0, rho: 1000, P1: 180 } },
      { id: 'uniform-pipe', label: { en: 'Uniform Pipe', hi: 'समान व्यास पाइप' }, params: { v1: 4, ratio: 1.0, rho: 1000, P1: 150 } },
    ],
    explanation: {
      en: 'By the Equation of Continuity (A₁v₁ = A₂v₂), fluid accelerates inside a narrower throat. By Bernoulli’s Theorem (conservation of energy per unit volume), higher kinetic energy ½ρv² causes static pressure P₂ to DROP—visible immediately on the vertical manometer tube!',
      hi: 'सांतत्य समीकरण (A₁v₁ = A₂v₂) के अनुसार सँकरे हिस्से में द्रव का वेग बढ़ता है। बर्नौली प्रमेय (ऊर्जा संरक्षण) के अनुसार वेग बढ़ने से गतिज ऊर्जा बढ़ती है और स्थैतिक दाब P₂ घट जाता है, जो मैनोमीटर नली में स्पष्ट दिखता है!',
    },
    realLife: {
      en: 'Airplane wing lift, perfume atomizers, cricket ball swing (Magnus effect), and carburetors all work directly on Bernoulli’s pressure-speed trade-off.',
      hi: 'हवाई जहाज के पंखों पर उत्थापन (Lift), स्प्रे बोतल और क्रिकेट गेंद का स्विंग होना बर्नौली के सिद्धांत के प्रत्यक्ष उदाहरण हैं।',
    },
    whatIfPrompts: [
      {
        id: 'fluid-narrow',
        question: {
          en: 'Narrow the throat so A₁/A₂ = 3.0. What happens to throat speed v₂ and manometer height?',
          hi: 'पाइप को इतना सँकरा करें कि A₁/A₂ = 3.0 हो जाए। वेग v₂ और मैनोमीटर के स्तर पर क्या प्रभाव पड़ेगा?',
        },
        hint: { en: 'v₂ triples, so v₂² becomes 9 times larger!', hi: 'v₂ तिगुना होता है, इसलिए v₂² नौ गुना बढ़ जाता है!' },
        answer: {
          en: 'Speed v₂ triples while static pressure P₂ plunges sharply, pulling the center manometer column way down!',
          hi: 'वेग v₂ तिगुना हो जाता है और दाब P₂ तेजी से गिरता है, जिससे बीच वाली मैनोमीटर नली में द्रव का स्तर बहुत नीचे चला जाता है!',
        },
        targetParams: { v1: 3.5, ratio: 3.0, rho: 1000, P1: 180 },
      },
    ],
    graphTitle: { en: 'Throat Pressure P₂ vs Constriction Ratio A₁/A₂', hi: 'सँकरे भाग में दाब P₂ बनाम अनुपात A₁/A₂' },
    graphXLabel: 'A₁ / A₂',
    graphYLabel: 'P₂ (kPa)',
  },

  // 5. THERMAL PROPERTIES OF MATTER
  {
    id: 'thermal-matter',
    chapterId: 'thermal-matter',
    title: {
      en: 'Thermal Expansion & Heat Conduction',
      hi: 'ऊष्मीय प्रसार और ऊष्मा चालन',
    },
    subtitle: {
      en: 'Metal rod expansion ΔL = L₀αΔT and Fourier steady-state heat conduction H = kAΔT/L',
      hi: 'धातु की छड़ का रेखीय प्रसार ΔL = L₀αΔT तथा ऊष्मा चालन दर H = kAΔT/L',
    },
    formulaDisplay: 'ΔL = L₀ · α · ΔT   |   H = k · A · ΔT / L',
    secondaryFormulas: [
      { label: { en: 'Area / Volume Expansion', hi: 'क्षेत्रीय / आयतन प्रसार' }, formula: 'β = 2α   |   γ = 3α' },
      { label: { en: 'Thermal Resistance', hi: 'ऊष्मीय प्रतिरोध' }, formula: 'R_th = L / (k · A)' },
    ],
    variables: [
      { key: 'dT', symbol: 'ΔT', label: { en: 'Temp Difference', hi: 'तापांतर (ΔT)' }, unit: '°C', min: 10, max: 300, step: 10, defaultValue: 120 },
      { key: 'L0', symbol: 'L₀', label: { en: 'Rod Length', hi: 'छड़ की लंबाई (L₀)' }, unit: 'm', min: 0.5, max: 4.0, step: 0.5, defaultValue: 2.0 },
      { key: 'alpha', symbol: 'α', label: { en: 'Expansion Coeff', hi: 'प्रसार गुणांक (α)' }, unit: '×10⁻⁵/°C', min: 0.8, max: 3.0, step: 0.1, defaultValue: 1.7 },
      { key: 'k', symbol: 'k', label: { en: 'Thermal Conductivity', hi: 'ऊष्मा चालकता (k)' }, unit: 'W/mK', min: 20, max: 400, step: 10, defaultValue: 200 },
    ],
    presets: [
      { id: 'copper-rod', label: { en: 'Copper (k=385)', hi: 'ताँबा (k=385)' }, params: { dT: 150, L0: 2.0, alpha: 1.7, k: 380 } },
      { id: 'steel-rod', label: { en: 'Steel (k=50)', hi: 'इस्पात (k=50)' }, params: { dT: 200, L0: 3.0, alpha: 1.2, k: 50 } },
      { id: 'al-rod', label: { en: 'Aluminum (α=2.3)', hi: 'एल्युमीनियम (α=2.3)' }, params: { dT: 220, L0: 2.0, alpha: 2.3, k: 210 } },
    ],
    explanation: {
      en: 'Heating increases atomic vibration amplitude, lengthening a metal rod by ΔL = L₀αΔT. Simultaneously, thermal energy flows from the hot end to the cold end at rate H = kAΔT/L along a linear temperature gradient.',
      hi: 'गर्म करने पर परमाणुओं के कंपन का आयाम बढ़ता है जिससे छड़ की लंबाई ΔL = L₀αΔT बढ़ जाती है। साथ ही ऊष्मा गर्म सिरे से ठंडे सिरे की ओर H = kAΔT/L दर से प्रवाहित होती है।',
    },
    realLife: {
      en: 'Small expansion gaps are left between railway tracks and concrete bridge decks to prevent buckling in hot Indian summers.',
      hi: 'गर्मियों में ऊष्मीय प्रसार से पटरियों को मुड़ने से बचाने के लिए रेल की पटरियों के बीच थोड़ी खाली जगह छोड़ी जाती है।',
    },
    whatIfPrompts: [
      {
        id: 'therm-temp',
        question: {
          en: 'Heat a 3 m steel rail by ΔT = 250°C. Does both expansion ΔL and heat flow H increase linearly?',
          hi: '3 m लंबी छड़ का तापांतर ΔT = 250°C बढ़ाएँ। क्या प्रसार ΔL और ऊष्मा प्रवाह H दोनों रैखिक रूप से बढ़ते हैं?',
        },
        hint: { en: 'Check the exponent of ΔT in both formulas.', hi: 'दोनों सूत्रों में ΔT की घात देखें।' },
        answer: {
          en: 'Yes! Both ΔL and heat current H are directly proportional to ΔT, doubling whenever temperature difference doubles.',
          hi: 'हाँ! ΔL और ऊष्मा प्रवाह H दोनों सीधे ΔT के अनुक्रमानुपाती हैं।',
        },
        targetParams: { dT: 250, L0: 3.0, alpha: 1.2, k: 50 },
      },
    ],
    graphTitle: { en: 'Temperature Profile T(x) along the Conducting Rod', hi: 'छड़ की लंबाई के अनुदिश ताप प्रवणता T(x)' },
    graphXLabel: 'Position x (m)',
    graphYLabel: 'Temp (°C)',
  },

  // 6. THERMODYNAMICS (FIRST LAW & P-V PISTON)
  {
    id: 'thermodynamics',
    chapterId: 'thermodynamics',
    title: {
      en: 'Thermodynamics: First Law & P–V Piston',
      hi: 'ऊष्मागतिकी: प्रथम नियम और P–V पिस्टन',
    },
    subtitle: {
      en: 'Interactive gas cylinder comparing Isothermal vs Adiabatic expansion on a P–V graph',
      hi: 'समतापी बनाम रुद्धोष्म प्रसरण और P–V सूचक आरेख द्वारा किया गया कार्य',
    },
    formulaDisplay: 'ΔQ = ΔU + W   |   W = ∫ P·dV',
    secondaryFormulas: [
      { label: { en: 'Isothermal', hi: 'समतापी प्रक्रम' }, formula: 'P·V = nRT = const' },
      { label: { en: 'Adiabatic', hi: 'रुद्धोष्म प्रक्रम' }, formula: 'P·V^γ = const (ΔQ = 0)' },
    ],
    variables: [
      { key: 'V', symbol: 'V', label: { en: 'Cylinder Volume', hi: 'सिलेंडर आयतन (V)' }, unit: 'L', min: 1.0, max: 6.0, step: 0.2, defaultValue: 2.5 },
      { key: 'T0', symbol: 'T₀', label: { en: 'Initial Temp', hi: 'प्रारंभिक ताप (T₀)' }, unit: 'K', min: 250, max: 600, step: 25, defaultValue: 350 },
      { key: 'gamma', symbol: 'γ', label: { en: 'Adiabatic Index (Cp/Cv)', hi: 'रुद्धोष्म घातांक (γ)' }, unit: '', min: 1.0, max: 1.67, step: 0.07, defaultValue: 1.4 },
      { key: 'n', symbol: 'n', label: { en: 'Gas Moles', hi: 'गैस के मोल (n)' }, unit: 'mol', min: 0.5, max: 3.0, step: 0.5, defaultValue: 1.0 },
    ],
    presets: [
      { id: 'isothermal', label: { en: 'Isothermal (γ=1.0)', hi: 'समतापी (γ=1.0)' }, params: { V: 2.5, T0: 350, gamma: 1.0, n: 1.0 } },
      { id: 'diatomic', label: { en: 'Adiabatic Air (γ=1.4)', hi: 'रुद्धोष्म वायु (γ=1.4)' }, params: { V: 3.5, T0: 400, gamma: 1.4, n: 1.0 } },
      { id: 'monoatomic', label: { en: 'Monoatomic He (γ=1.67)', hi: 'एकपरमाणुक गैस (γ=1.67)' }, params: { V: 1.6, T0: 400, gamma: 1.67, n: 1.0 } },
    ],
    explanation: {
      en: 'The First Law of Thermodynamics expresses energy conservation: heat added (ΔQ) raises internal energy (ΔU) and performs mechanical work (W = ∫PdV). Adiabatic curves (PV^γ = const) are steeper than isothermal curves (PV = const) by factor γ!',
      hi: 'ऊष्मागतिकी का प्रथम नियम ऊर्जा संरक्षण है: दी गई ऊष्मा (ΔQ) आंतरिक ऊर्जा बढ़ाने (ΔU) और कार्य (W = ∫PdV) करने में व्यय होती है। रुद्धोष्म वक्र (PV^γ = नियत) का ढाल समतापी वक्र से γ गुना अधिक तीव्र होता है!',
    },
    realLife: {
      en: 'Petrol and diesel car engines compress fuel-air adiabatically (heating it rapidly) and expand hot exhaust gases to push pistons.',
      hi: 'पेट्रोल और डीज़ल इंजन में पिस्टन गैस को तेजी से रुद्धोष्म संपीडित करता है और दहन के बाद फैलती गैस पिस्टन को धकेलती है।',
    },
    whatIfPrompts: [
      {
        id: 'thermo-compress',
        question: {
          en: 'Compress a monoatomic gas (γ = 1.67) rapidly from 2.5 L down to 1.2 L adiabatically. What happens to gas temperature T?',
          hi: 'एकपरमाणुक गैस (γ = 1.67) को रुद्धोष्म रूप से 2.5 L से 1.2 L तक दबाएँ। ताप T पर क्या असर होगा?',
        },
        hint: { en: 'For adiabatic process, T · V^(γ−1) = constant.', hi: 'रुद्धोष्म प्रक्रम में T · V^(γ−1) = नियतांक होता है।' },
        answer: {
          en: 'Work done ON the gas converts directly into internal energy ΔU, shooting gas temperature T and pressure P sharply upward!',
          hi: 'गैस पर किया गया कार्य सीधे आंतरिक ऊर्जा में बदल जाता है, जिससे ताप T और दाब P बहुत तेज़ी से बढ़ जाते हैं!',
        },
        targetParams: { V: 1.2, T0: 350, gamma: 1.67, n: 1.0 },
      },
    ],
    graphTitle: { en: 'P–V Indicator Diagram: Adiabatic (Solid) vs Isothermal (Dashed)', hi: 'P–V आरेख: रुद्धोष्म (ठोस) बनाम समतापी (डैश)' },
    graphXLabel: 'Volume V (L)',
    graphYLabel: 'Pressure P (kPa)',
  },

  // 7. KINETIC THEORY OF GASES
  {
    id: 'kinetic-theory',
    chapterId: 'kinetic-theory',
    title: {
      en: 'Kinetic Theory of Gases & RMS Speed',
      hi: 'अणुगति सिद्धांत और वर्ग माध्य मूल चाल',
    },
    subtitle: {
      en: 'Live bouncing gas molecules linking temperature T to pressure P and v_rms = √(3RT/M)',
      hi: 'टकराते गैस अणुओं द्वारा ताप T, दाब P तथा v_rms = √(3RT/M) का संबंध',
    },
    formulaDisplay: 'P·V = n·R·T   |   v_rms = √(3RT / M)',
    secondaryFormulas: [
      { label: { en: 'Mean KE per Molecule', hi: 'औसत गतिज ऊर्जा' }, formula: 'K_avg = (3/2)·k_B·T' },
      { label: { en: 'Pressure Formula', hi: 'गैस का दाब' }, formula: 'P = (1/3)·ρ·v_rms²' },
    ],
    variables: [
      { key: 'T', symbol: 'T', label: { en: 'Temperature', hi: 'परम ताप (T)' }, unit: 'K', min: 150, max: 900, step: 25, defaultValue: 300 },
      { key: 'M', symbol: 'M', label: { en: 'Molar Mass', hi: 'मोलर द्रव्यमान (M)' }, unit: 'g/mol', min: 2, max: 44, step: 2, defaultValue: 28 },
      { key: 'V', symbol: 'V', label: { en: 'Box Volume', hi: 'पात्र का आयतन (V)' }, unit: 'L', min: 5, max: 25, step: 1, defaultValue: 12 },
      { key: 'N', symbol: 'N', label: { en: 'Particle Density', hi: 'कणों की संख्या' }, unit: '', min: 15, max: 60, step: 5, defaultValue: 35 },
    ],
    presets: [
      { id: 'nitrogen', label: { en: 'Nitrogen N₂ (300K)', hi: 'नाइट्रोजन N₂ (300K)' }, params: { T: 300, M: 28, V: 12, N: 35 } },
      { id: 'hydrogen', label: { en: 'Light H₂ (Fast!)', hi: 'हल्की हाइड्रोजन H₂' }, params: { T: 300, M: 2, V: 12, N: 35 } },
      { id: 'hot-gas', label: { en: 'Hot Chamber (800K)', hi: 'गर्म कक्ष (800K)' }, params: { T: 800, M: 28, V: 10, N: 45 } },
    ],
    explanation: {
      en: 'Gas pressure arises from elastic molecular collisions against the container walls. Absolute temperature T is a direct measure of average translational kinetic energy (3/2 k_B T), while lighter gases like H₂ zip around much faster than heavy CO₂ at the same temperature.',
      hi: 'गैस का दाब पात्र की दीवारों से अणुओं की लगातार प्रत्यास्थ टक्करों से उत्पन्न होता है। परम ताप T सीधे औसत गतिज ऊर्जा (3/2 k_B T) की माप है, और समान ताप पर हल्की गैसें (जैसे H₂) भारी गैसों से बहुत तेज चलती हैं।',
    },
    realLife: {
      en: 'Car tire pressure rises on hot summer highways because faster-moving air molecules strike the tire walls harder and more frequently.',
      hi: 'गर्मियों में हाईवे पर चलने से टायर के अंदर की हवा गर्म हो जाती है और अणुओं की तेज टक्करों के कारण टायर का दाब बढ़ जाता है।',
    },
    whatIfPrompts: [
      {
        id: 'ktg-h2',
        question: {
          en: 'Compare Hydrogen (M = 2) with Oxygen (M = 32) at 300 K. How many times faster is Hydrogen’s v_rms?',
          hi: '300 K पर हाइड्रोजन (M = 2) और ऑक्सीजन (M = 32) की तुलना करें। हाइड्रोजन की v_rms कितनी गुना अधिक होगी?',
        },
        hint: { en: 'v_rms ∝ 1 / √M, so check √(32 / 2) = √16.', hi: 'v_rms ∝ 1 / √M होता है, अतः √(32 / 2) निकालें।' },
        answer: {
          en: 'Hydrogen moves 4 TIMES faster (≈1934 m/s vs ≈483 m/s)! This is why light H₂ escapes Earth’s atmosphere.',
          hi: 'हाइड्रोजन ठीक 4 गुना तेज़ (≈1934 m/s बनाम ≈483 m/s) चलती है! इसी कारण हल्की H₂ पृथ्वी के वायुमंडल से पलायन कर जाती है।',
        },
        targetParams: { T: 300, M: 2, V: 12, N: 35 },
      },
    ],
    graphTitle: { en: 'Maxwell–Boltzmann Speed Distribution Curve', hi: 'मैक्सवेल-बोल्ट्ज़मैन चाल वितरण वक्र' },
    graphXLabel: 'Speed v (m/s)',
    graphYLabel: 'Rel. Count',
  },

  // =========================================================================
  // CLASS 12 — NEW CHAPTERS (10)
  // =========================================================================

  // 8. ELECTROSTATIC POTENTIAL & CAPACITANCE
  {
    id: 'capacitance',
    chapterId: 'capacitance',
    title: {
      en: 'Parallel Plate Capacitor & Dielectrics',
      hi: 'समांतर प्लेट संधारित्र और परावैद्युत',
    },
    subtitle: {
      en: 'Adjust plate area, separation d, voltage V, and dielectric κ to inspect C, Q, E, and U',
      hi: 'प्लेट क्षेत्रफल, दूरी d, विभव V और परावैद्युतांक κ से धारिता C और ऊर्जा U देखें',
    },
    formulaDisplay: 'C = κ · ε₀ · A / d   |   U = ½·C·V²',
    secondaryFormulas: [
      { label: { en: 'Stored Charge', hi: 'संचित आवेश' }, formula: 'Q = C · V' },
      { label: { en: 'Electric Field', hi: 'विद्युत क्षेत्र' }, formula: 'E = V / d' },
    ],
    variables: [
      { key: 'V', symbol: 'V', label: { en: 'Battery Voltage', hi: 'बैटरी विभव (V)' }, unit: 'V', min: 2, max: 24, step: 1, defaultValue: 12 },
      { key: 'd', symbol: 'd', label: { en: 'Plate Separation', hi: 'प्लेटों के बीच दूरी (d)' }, unit: 'mm', min: 1, max: 10, step: 0.5, defaultValue: 4 },
      { key: 'A', symbol: 'A', label: { en: 'Plate Area', hi: 'प्लेट क्षेत्रफल (A)' }, unit: 'cm²', min: 50, max: 400, step: 25, defaultValue: 200 },
      { key: 'kappa', symbol: 'κ', label: { en: 'Dielectric Constant', hi: 'परावैद्युतांक (κ)' }, unit: '', min: 1, max: 8, step: 0.5, defaultValue: 1 },
    ],
    presets: [
      { id: 'air-cap', label: { en: 'Air Gap (κ=1)', hi: 'वायु अंतराल (κ=1)' }, params: { V: 12, d: 4, A: 200, kappa: 1 } },
      { id: 'glass-dielectric', label: { en: 'Glass Slab (κ=5)', hi: 'काँच परावैद्युत (κ=5)' }, params: { V: 12, d: 4, A: 200, kappa: 5 } },
      { id: 'tight-plates', label: { en: 'Close Plates (d=1.5mm)', hi: 'निकट प्लेटें (d=1.5mm)' }, params: { V: 12, d: 1.5, A: 300, kappa: 4 } },
    ],
    explanation: {
      en: 'Capacitance measures charge stored per volt (C = κε₀A/d). Sliding a dielectric slab (κ > 1) between the plates polarizes bound dipoles, reducing the opposing internal field and multiplying capacitance and stored charge Q by factor κ!',
      hi: 'धारिता प्रति वोल्ट संचित आवेश को दर्शाती है (C = κε₀A/d)। प्लेटों के बीच परावैद्युत पट्टी (κ > 1) डालने से प्रेरित द्विध्रुव बनते हैं जिससे धारिता और संचित ऊर्जा κ गुना बढ़ जाती है!',
    },
    realLife: {
      en: 'Camera flashes, smartphone touchscreens, ceiling fan starters, and cardiac defibrillators all store and discharge energy rapidly using capacitors.',
      hi: 'कैमरा फ्लैश, टचस्क्रीन, पंखे का कंडेंसर और मेडिकल डिफाइब्रिलेटर संधारित्र (Capacitor) के सिद्धांत पर काम करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'cap-dielectric',
        question: {
          en: 'With battery connected at V = 12 V, insert a dielectric slab κ = 5. What happens to C, Q, and stored energy U?',
          hi: 'बैटरी V = 12 V जुड़े रहने पर κ = 5 का परावैद्युत डालें। धारिता C, आवेश Q और ऊर्जा U पर क्या असर होगा?',
        },
        hint: { en: 'V is fixed by the battery; check C = κC₀, Q = CV, U = ½CV².', hi: 'बैटरी जुड़े रहने से V नियत है; C, Q और U देखें।' },
        answer: {
          en: 'Capacitance C, charge Q, AND stored energy U all jump 5 TIMES higher while electric field E = V/d stays unchanged!',
          hi: 'धारिता C, आवेश Q और संचित ऊर्जा U तीनों 5 गुना बढ़ जाते हैं जबकि E = V/d नियत रहता है!',
        },
        targetParams: { V: 12, d: 4, A: 200, kappa: 5 },
      },
    ],
    graphTitle: { en: 'Capacitance C (pF) vs Plate Separation d (mm)', hi: 'धारिता C (pF) बनाम दूरी d (mm)' },
    graphXLabel: 'd (mm)',
    graphYLabel: 'C (pF)',
  },

  // 9. MAGNETISM & MATTER
  {
    id: 'magnetism-matter',
    chapterId: 'magnetism-matter',
    title: {
      en: 'Magnetic Dipole Torque & Bar Magnet',
      hi: 'चुंबकीय द्विध्रुव पर बल आघूर्ण और छड़ चुंबक',
    },
    subtitle: {
      en: 'Bar magnet oscillating in a uniform magnetic field B under restoring torque τ = MB·sinθ',
      hi: 'एकसमान चुंबकीय क्षेत्र B में छड़ चुंबक पर बल आघूर्ण τ = MB·sinθ तथा दोलन',
    },
    formulaDisplay: 'τ = M · B · sin(θ)   |   U = −M · B · cos(θ)',
    secondaryFormulas: [
      { label: { en: 'Dipole Moment', hi: 'चुंबकीय आघूर्ण' }, formula: 'M = m · (2l)' },
      { label: { en: 'Oscillation Period', hi: 'दोलन आवर्तकाल' }, formula: 'T = 2π·√(I / MB)' },
    ],
    variables: [
      { key: 'M', symbol: 'M', label: { en: 'Magnetic Moment', hi: 'चुंबकीय आघूर्ण (M)' }, unit: 'A·m²', min: 1, max: 10, step: 0.5, defaultValue: 5 },
      { key: 'B', symbol: 'B', label: { en: 'External Field B', hi: 'बाह्य चुंबकीय क्षेत्र (B)' }, unit: 'T', min: 0.2, max: 2.0, step: 0.1, defaultValue: 0.8 },
      { key: 'theta0', symbol: 'θ₀', label: { en: 'Initial Deflection', hi: 'प्रारंभिक कोण (θ₀)' }, unit: '°', min: 10, max: 165, step: 5, defaultValue: 60 },
    ],
    presets: [
      { id: 'max-torque', label: { en: 'Max Torque (90°)', hi: 'अधिकतम आघूर्ण (90°)' }, params: { M: 5, B: 0.8, theta0: 90 } },
      { id: 'small-osc', label: { en: 'Compass SHM (25°)', hi: 'कंपास दोलन (25°)' }, params: { M: 6, B: 1.2, theta0: 25 } },
      { id: 'unstable', label: { en: 'Near Unstable (160°)', hi: 'अस्थायी स्थिति (160°)' }, params: { M: 5, B: 0.8, theta0: 160 } },
    ],
    explanation: {
      en: 'A magnetic dipole in a uniform external magnetic field experiences zero net force but a restoring torque τ = M × B that twists it toward alignment (θ = 0°, stable minimum energy U = −MB). At θ = 180°, equilibrium is unstable (U = +MB).',
      hi: 'एकसमान चुंबकीय क्षेत्र में रखे चुंबकीय द्विध्रुव पर कुल बल शून्य होता है, किंतु बल-आघूर्ण τ = MB·sinθ इसे क्षेत्र की दिशा (θ = 0°, स्थायी संतुलन) में संरेखित करने का प्रयास करता है।',
    },
    realLife: {
      en: 'Magnetic compass needles align with Earth’s horizontal magnetic field B_H, and vibration magnetometers measure magnetic moments using T = 2π√(I/MB).',
      hi: 'दिकसूचक (Compass) की सुई पृथ्वी के क्षैतिज चुंबकीय क्षेत्र के साथ संरेखित होकर उत्तर-दक्षिण दिशा बताती है।',
    },
    whatIfPrompts: [
      {
        id: 'mag-90',
        question: {
          en: 'Release the bar magnet at θ₀ = 90° vs θ₀ = 0°. At which angle are torque τ and potential energy U maximum?',
          hi: 'चुंबक को θ₀ = 90° पर छोड़ें। किस कोण पर बल-आघूर्ण τ अधिकतम और किस कोण पर स्थितिज ऊर्जा U अधिकतम होती है?',
        },
        hint: { en: 'Torque uses sin(θ); potential energy uses −cos(θ).', hi: 'बल आघूर्ण में sin(θ) और स्थितिज ऊर्जा में −cos(θ) आता है।' },
        answer: {
          en: 'Torque τ is maximum at θ = 90° (sin90° = 1, where U = 0), while Potential Energy U is maximum at θ = 180° (anti-parallel)!',
          hi: 'बल आघूर्ण τ = 90° पर अधिकतम होता है (जहाँ U = 0), जबकि स्थितिज ऊर्जा U = 180° पर अधिकतम (+MB) होती है!',
        },
        targetParams: { M: 5, B: 0.8, theta0: 90 },
      },
    ],
    graphTitle: { en: 'Torque τ (Solid) & Potential Energy U (Dashed) vs Angle θ', hi: 'बल आघूर्ण τ (ठोस) व ऊर्जा U (डैश) बनाम कोण θ' },
    graphXLabel: 'θ (°)',
    graphYLabel: 'τ (N·m) / U (J)',
  },

  // 10. ELECTROMAGNETIC INDUCTION (EMI — 3D DEFAULT!)
  {
    id: 'emi',
    chapterId: 'emi',
    supports3D: true,
    default3D: true,
    title: {
      en: 'Faraday’s Law & 3D AC Generator',
      hi: 'फैराडे का नियम और 3D प्रत्यावर्ती जनित्र (EMI)',
    },
    subtitle: {
      en: '3D rotating coil in magnetic field inducing sinusoidal EMF ε = NBAω·sin(ωt)',
      hi: 'चुंबकीय क्षेत्र में घूमती 3D कुंडली से प्रेरित विद्युत वाहक बल ε = NBAω·sin(ωt)',
    },
    formulaDisplay: 'ε = −N · (dΦ / dt) = N·B·A·ω·sin(ωt)',
    secondaryFormulas: [
      { label: { en: 'Magnetic Flux', hi: 'चुंबकीय फ्लक्स' }, formula: 'Φ = B · A · cos(ωt)' },
      { label: { en: 'Peak EMF', hi: 'शिखर प्रेरित वि.वा.ब.' }, formula: 'ε₀ = N · B · A · ω' },
    ],
    variables: [
      { key: 'N', symbol: 'N', label: { en: 'Coil Turns', hi: 'कुंडली के फेरे (N)' }, unit: '', min: 5, max: 50, step: 5, defaultValue: 20 },
      { key: 'B', symbol: 'B', label: { en: 'Magnetic Field', hi: 'चुंबकीय क्षेत्र (B)' }, unit: 'T', min: 0.2, max: 2.0, step: 0.1, defaultValue: 0.8 },
      { key: 'A', symbol: 'A', label: { en: 'Coil Area', hi: 'कुंडली क्षेत्रफल (A)' }, unit: 'm²', min: 0.1, max: 1.0, step: 0.1, defaultValue: 0.4 },
      { key: 'omega', symbol: 'ω', label: { en: 'Angular Speed', hi: 'कोणीय वेग (ω)' }, unit: 'rad/s', min: 0.5, max: 6.0, step: 0.5, defaultValue: 2.5 },
    ],
    presets: [
      { id: 'standard-gen', label: { en: 'Standard Dynamo', hi: 'मानक जनरेटर' }, params: { N: 20, B: 0.8, A: 0.4, omega: 2.5 } },
      { id: 'fast-turbine', label: { en: 'Fast Turbine (2×ω)', hi: 'तेज़ टरबाइन (2×ω)' }, params: { N: 20, B: 0.8, A: 0.4, omega: 5.0 } },
      { id: 'high-turns', label: { en: 'High-Voltage Coil', hi: 'अधिक फेरों की कुंडली' }, params: { N: 45, B: 1.5, A: 0.6, omega: 3.0 } },
    ],
    explanation: {
      en: 'Faraday’s Law states that induced EMF equals the negative rate of change of magnetic flux (ε = −N dΦ/dt). Notice the 90° phase shift: when flux Φ is ZERO (coil parallel to B), the rate of cutting field lines—and induced EMF ε—reaches its MAXIMUM!',
      hi: 'फैराडे के नियम के अनुसार प्रेरित विद्युत वाहक बल चुंबकीय फ्लक्स के परिवर्तन की दर के बराबर होता है। ध्यान दें कि जब फ्लक्स Φ शून्य होता है (कुंडली क्षेत्र के समांतर), तब प्रेरित वि.वा.ब. ε अधिकतम होता है!',
    },
    realLife: {
      en: 'Hydroelectric dams, wind turbines, and power plant alternators spin huge wire coils inside magnetic fields to supply alternating electricity to entire cities.',
      hi: 'जलविद्युत बाँध, पवन चक्कियाँ और बिजलीघरों के जनरेटर इसी फैराडे के सिद्धांत पर पूरे शहर को बिजली देते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'emi-double-omega',
        question: {
          en: 'Double the rotation speed ω from 2.5 to 5.0 rad/s. How do peak EMF ε₀ and AC frequency both change?',
          hi: 'घूर्णन चाल ω को 2.5 से दोगुना 5.0 rad/s करें। शिखर वि.वा.ब. ε₀ और आवृत्ति पर क्या असर होगा?',
        },
        hint: { en: 'Check ε₀ = N·B·A·ω and f = ω / (2π).', hi: 'ε₀ = N·B·A·ω और f = ω / (2π) देखें।' },
        answer: {
          en: 'BOTH peak voltage ε₀ and AC frequency DOUBLE! Spinning a generator faster boosts output voltage and oscillation rate together.',
          hi: 'शिखर वोल्टेज ε₀ और प्रत्यावर्ती आवृत्ति दोनों दोगुने हो जाते हैं!',
        },
        targetParams: { N: 20, B: 0.8, A: 0.4, omega: 5.0 },
      },
    ],
    graphTitle: { en: 'Induced EMF ε(t) [Solid] & Magnetic Flux Φ(t) [Dashed]', hi: 'प्रेरित वि.वा.ब. ε(t) [ठोस] व फ्लक्स Φ(t) [डैश]' },
    graphXLabel: 't (s)',
    graphYLabel: 'ε (V) · Φ',
  },

  // 11. ALTERNATING CURRENT (SERIES LCR RESONANCE)
  {
    id: 'ac-circuits',
    chapterId: 'ac-circuits',
    title: {
      en: 'Series LCR Circuit & AC Resonance',
      hi: 'श्रेणी LCR परिपथ और अनुनाद (Resonance)',
    },
    subtitle: {
      en: 'Live phasor diagram (V_R, V_L, V_C), impedance Z, power factor, and resonance curve',
      hi: 'सजीव फेज़र आरेख (V_R, V_L, V_C), प्रतिबाधा Z, शक्ति गुणांक और अनुनाद वक्र',
    },
    formulaDisplay: 'Z = √(R² + (X_L − X_C)²)   |   f₀ = 1 / (2π√LC)',
    secondaryFormulas: [
      { label: { en: 'Reactances', hi: 'प्रतिघात' }, formula: 'X_L = 2πfL   |   X_C = 1/(2πfC)' },
      { label: { en: 'Power Factor', hi: 'शक्ति गुणांक' }, formula: 'cos(φ) = R / Z' },
    ],
    variables: [
      { key: 'f', symbol: 'f', label: { en: 'AC Frequency', hi: 'प्रत्यावर्ती आवृत्ति (f)' }, unit: 'Hz', min: 20, max: 200, step: 2, defaultValue: 80 },
      { key: 'R', symbol: 'R', label: { en: 'Resistance', hi: 'प्रतिरोध (R)' }, unit: 'Ω', min: 10, max: 120, step: 5, defaultValue: 30 },
      { key: 'L', symbol: 'L', label: { en: 'Inductance', hi: 'प्रेरकत्व (L)' }, unit: 'mH', min: 20, max: 200, step: 10, defaultValue: 100 },
      { key: 'C', symbol: 'C', label: { en: 'Capacitance', hi: 'धारिता (C)' }, unit: 'μF', min: 10, max: 100, step: 5, defaultValue: 40 },
    ],
    presets: [
      { id: 'resonance', label: { en: 'Exact Resonance (X_L=X_C)', hi: 'सटीक अनुनाद (X_L=X_C)' }, params: { f: 80, R: 30, L: 100, C: 40 } },
      { id: 'inductive', label: { en: 'Inductive (High f)', hi: 'प्रेरकीय (उच्च आवृत्ति)' }, params: { f: 160, R: 30, L: 100, C: 40 } },
      { id: 'capacitive', label: { en: 'Capacitive (Low f)', hi: 'धारितीय (निम्न आवृत्ति)' }, params: { f: 36, R: 30, L: 100, C: 40 } },
    ],
    explanation: {
      en: 'In a series LCR circuit, inductor voltage V_L leads current by 90° while capacitor voltage V_C lags by 90°. At resonant frequency f₀ = 1/(2π√LC), X_L = X_C cancel completely, impedance drops to its minimum Z = R, and RMS current spikes to maximum!',
      hi: 'श्रेणी LCR परिपथ में प्रेरक का विभव V_L धारा से 90° अग्रगामी और संधारित्र का विभव V_C 90° पश्चगामी होता है। अनुनाद आवृत्ति f₀ पर X_L = X_C निरस्त हो जाते हैं, प्रतिबाधा न्यूनतम Z = R हो जाती है और धारा अधिकतम हो जाती है!',
    },
    realLife: {
      en: 'Radio and TV receivers tune into a specific broadcast station by adjusting capacitance C until the LCR resonance frequency f₀ matches the station frequency.',
      hi: 'रेडियो और टीवी रिसीवर में ट्यूनर घुमाकर धारिता C बदली जाती है ताकि LCR अनुनाद आवृत्ति स्टेशन की आवृत्ति से मेल खा जाए।',
    },
    whatIfPrompts: [
      {
        id: 'lcr-res',
        question: {
          en: 'Tune frequency f to 80 Hz (with L=100mH, C=40μF) and reduce R to 15 Ω. What happens to phase angle φ and current I?',
          hi: 'L=100mH, C=40μF पर आवृत्ति f = 80 Hz और R = 15 Ω करें। कला कोण φ और धारा I पर क्या प्रभाव पड़ेगा?',
        },
        hint: { en: 'Compute f₀ = 1 / (2π√(0.1 × 40×10⁻⁶)) ≈ 79.6 Hz.', hi: 'f₀ = 1 / (2π√LC) ≈ 79.6 Hz की गणना करें।' },
        answer: {
          en: 'At resonance φ → 0°, power factor cos(φ) → 1.0, and the resonance peak becomes super sharp with maximum current!',
          hi: 'अनुनाद पर कला कोण φ → 0°, शक्ति गुणांक cos(φ) → 1.0 और धारा अधिकतम हो जाती है!',
        },
        targetParams: { f: 80, R: 15, L: 100, C: 40 },
      },
    ],
    graphTitle: { en: 'Resonance Curve: RMS Current I (A) vs Frequency f (Hz)', hi: 'अनुनाद वक्र: धारा I (A) बनाम आवृत्ति f (Hz)' },
    graphXLabel: 'f (Hz)',
    graphYLabel: 'I_rms (A)',
  },

  // 12. ELECTROMAGNETIC WAVES (3D DEFAULT!)
  {
    id: 'em-waves',
    chapterId: 'em-waves',
    supports3D: true,
    default3D: true,
    title: {
      en: '3D Electromagnetic Wave (E ⊥ B ⊥ c)',
      hi: '3D विद्युतचुंबकीय तरंग (E ⊥ B ⊥ c)',
    },
    subtitle: {
      en: 'Interactive 3D transverse wave with mutually perpendicular E-field, B-field, and propagation c',
      hi: 'परस्पर लंबवत विद्युत क्षेत्र E, चुंबकीय क्षेत्र B और संचरण दिशा c की 3D अनुप्रस्थ तरंग',
    },
    formulaDisplay: 'c = E₀ / B₀ = 1 / √(μ₀·ε₀) = f · λ',
    secondaryFormulas: [
      { label: { en: 'Wave Equation', hi: 'तरंग समीकरण' }, formula: 'E_y = E₀·sin(kx−ωt), B_z = B₀·sin(kx−ωt)' },
      { label: { en: 'Poynting Flux', hi: 'ऊर्जा घनत्व' }, formula: 'u_avg = ½·ε₀·E₀²' },
    ],
    variables: [
      { key: 'E0', symbol: 'E₀', label: { en: 'Electric Amplitude', hi: 'विद्युत क्षेत्र आयाम (E₀)' }, unit: 'V/m', min: 30, max: 300, step: 15, defaultValue: 150 },
      { key: 'lambda', symbol: 'λ', label: { en: 'Wavelength', hi: 'तरंगदैर्घ्य (λ)' }, unit: 'nm', min: 300, max: 900, step: 25, defaultValue: 550 },
      { key: 'nRef', symbol: 'n', label: { en: 'Refractive Index', hi: 'अपवर्तनांक (n)' }, unit: '', min: 1.0, max: 2.4, step: 0.1, defaultValue: 1.0 },
    ],
    presets: [
      { id: 'vacuum-vis', label: { en: 'Visible Light (Vacuum)', hi: 'दृश्य प्रकाश (निर्वात)' }, params: { E0: 150, lambda: 550, nRef: 1.0 } },
      { id: 'glass-med', label: { en: 'Inside Glass (n=1.5)', hi: 'काँच में (n=1.5)' }, params: { E0: 150, lambda: 550, nRef: 1.5 } },
      { id: 'uv-wave', label: { en: 'High-Freq UV (350nm)', hi: 'पराबैंगनी (350nm)' }, params: { E0: 240, lambda: 350, nRef: 1.0 } },
    ],
    explanation: {
      en: 'An electromagnetic wave is a self-sustaining transverse oscillation: a changing Electric field E (vertical Y-axis) induces a changing Magnetic field B (horizontal Z-axis) strictly in phase, traveling along +X at speed v = c / n. Drag the 3D scene to inspect the 90° orthogonality!',
      hi: 'विद्युतचुंबकीय तरंग एक अनुप्रस्थ तरंग है जिसमें विद्युत क्षेत्र E (ऊर्ध्वाधर Y-अक्ष) और चुंबकीय क्षेत्र B (क्षैतिज Z-अक्ष) समान कला में परस्पर 90° पर कंपन करते हुए X-दिशा में v = c/n चाल से बढ़ते हैं। 3D दृश्य को घुमाकर 90° कोण देखें!',
    },
    realLife: {
      en: 'Sunlight, Wi-Fi signals, 5G mobile waves, X-rays, and microwave ovens are all transverse electromagnetic waves differing only in wavelength λ and frequency f.',
      hi: 'सूर्य का प्रकाश, Wi-Fi, 5G मोबाइल नेटवर्क, एक्स-रे और माइक्रोवेव सभी विद्युतचुंबकीय तरंगें हैं जिनका अंतर केवल तरंगदैर्घ्य λ में है।',
    },
    whatIfPrompts: [
      {
        id: 'em-glass',
        question: {
          en: 'Send the light wave from vacuum (n = 1.0) into dense glass (n = 1.8). What happens to wave speed v and wavelength?',
          hi: 'प्रकाश तरंग को निर्वात (n = 1.0) से काँच (n = 1.8) में भेजें। तरंग चाल v और तरंगदैर्घ्य पर क्या प्रभाव होगा?',
        },
        hint: { en: 'Frequency f stays constant, while v = c / n and λ_m = λ / n.', hi: 'आवृत्ति f नियत रहती है, जबकि v = c/n और λ_m = λ/n घटते हैं।' },
        answer: {
          en: 'Wave speed drops to c/1.8 ≈ 1.67×10⁸ m/s and the wave crests pack closer together (shorter λ_m) inside the medium!',
          hi: 'माध्यम में तरंग की चाल घटकर c/1.8 हो जाती है और तरंगदैर्घ्य छोटा होकर श्रृंग पास-पास आ जाते हैं!',
        },
        targetParams: { E0: 150, lambda: 550, nRef: 1.8 },
      },
    ],
    graphTitle: { en: 'Transverse Fields E_y (Solid) & B_z (Dashed) in Phase', hi: 'समान कला में E_y (ठोस) और B_z (डैश)' },
    graphXLabel: 'Position x',
    graphYLabel: 'Field Amp',
  },

  // 13. WAVE OPTICS (YOUNG'S DOUBLE SLIT EXPERIMENT)
  {
    id: 'wave-optics',
    chapterId: 'wave-optics',
    title: {
      en: 'Young’s Double Slit Interference (YDSE)',
      hi: 'यंग का द्वि-स्लिट प्रयोग (तरंग प्रकाशिकी)',
    },
    subtitle: {
      en: 'Coherent light interference forming bright & dark fringes with fringe width β = λD/d',
      hi: 'कला-संबद्ध तरंगों के व्यतिकरण से दीप्त व अदीप्त फ्रिंजें तथा फ्रिंज चौड़ाई β = λD/d',
    },
    formulaDisplay: 'β = (λ · D) / d   |   I = 4·I₀·cos²(φ / 2)',
    secondaryFormulas: [
      { label: { en: 'Path Difference', hi: 'पथांतर' }, formula: 'Δx = d · y / D' },
      { label: { en: 'Bright Maxima', hi: 'दीप्त फ्रिंज शर्त' }, formula: 'Δx = n · λ (n = 0, ±1, ±2)' },
    ],
    variables: [
      { key: 'lambda', symbol: 'λ', label: { en: 'Wavelength', hi: 'तरंगदैर्घ्य (λ)' }, unit: 'nm', min: 400, max: 750, step: 25, defaultValue: 550 },
      { key: 'd', symbol: 'd', label: { en: 'Slit Separation', hi: 'स्लिटों की दूरी (d)' }, unit: 'mm', min: 0.2, max: 1.5, step: 0.1, defaultValue: 0.5 },
      { key: 'D', symbol: 'D', label: { en: 'Screen Distance', hi: 'पर्दे की दूरी (D)' }, unit: 'm', min: 0.5, max: 3.0, step: 0.25, defaultValue: 1.5 },
    ],
    presets: [
      { id: 'green-ydse', label: { en: 'Green Light (550nm)', hi: 'हरा प्रकाश (550nm)' }, params: { lambda: 550, d: 0.5, D: 1.5 } },
      { id: 'wide-fringes', label: { en: 'Wide Fringes (Small d)', hi: 'चौड़ी फ्रिंजें (छोटा d)' }, params: { lambda: 700, d: 0.3, D: 2.5 } },
      { id: 'tight-fringes', label: { en: 'Tight Fringes (Large d)', hi: 'सँकरी फ्रिंजें (बड़ा d)' }, params: { lambda: 425, d: 1.2, D: 1.0 } },
    ],
    explanation: {
      en: 'Coherent waves emerging from two narrow slits interfere constructively where path difference Δx = nλ (bright fringes, I = 4I₀) and destructively where Δx = (n+½)λ (dark fringes, I = 0). All fringes share identical spacing β = λD/d.',
      hi: 'दो स्लिटों से निकली कला-संबद्ध तरंगें जहाँ पथांतर nλ होता है वहाँ संपोषी व्यतिकरण (दीप्त फ्रिंज) और जहाँ (n+½)λ होता है वहाँ विनाशी व्यतिकरण (अदीप्त फ्रिंज) बनाती हैं। सभी फ्रिंजों की चौड़ाई β = λD/d समान होती है।',
    },
    realLife: {
      en: 'Anti-reflective coatings on eyeglasses, soap-bubble interference bands, and precision LIGO laser interferometers rely on optical wave interference.',
      hi: 'चश्मों पर एंटी-रिफ्लेक्टिव कोटिंग, साबुन के बुलबुले की धारियाँ और LIGO लेज़र इंटरफेरोमीटर व्यतिकरण पर आधारित हैं।',
    },
    whatIfPrompts: [
      {
        id: 'ydse-halve-d',
        question: {
          en: 'Bring the two slits closer together from d = 0.6 mm to d = 0.3 mm. Do the fringes get narrower or wider?',
          hi: 'दोनों स्लिटों की दूरी d = 0.6 mm से आधी 0.3 mm करें। फ्रिंज चौड़ाई β घटेगी या बढ़ेगी?',
        },
        hint: { en: 'd is in the denominator of β = λD / d.', hi: 'β = λD / d में d हर में है।' },
        answer: {
          en: 'Fringe width β DOUBLES! Bringing slits closer spreads the interference pattern wider across the screen.',
          hi: 'फ्रिंज चौड़ाई β दोगुनी हो जाती है! स्लिट पास लाने पर पर्दे पर फ्रिंजें अधिक चौड़ी फैल जाती हैं।',
        },
        targetParams: { lambda: 600, d: 0.3, D: 1.5 },
      },
    ],
    graphTitle: { en: 'Screen Intensity I(y) = 4I₀·cos²(πdy / λD)', hi: 'पर्दे पर तीव्रता वितरण I(y)' },
    graphXLabel: 'Screen y (mm)',
    graphYLabel: 'Intensity I/I₀',
  },

  // 14. DUAL NATURE OF RADIATION & MATTER (PHOTOELECTRIC EFFECT)
  {
    id: 'dual-nature',
    chapterId: 'dual-nature',
    title: {
      en: 'Photoelectric Effect & Einstein’s Equation',
      hi: 'प्रकाश-विद्युत प्रभाव और आइंस्टीन समीकरण',
    },
    subtitle: {
      en: 'Photon beam ejecting electrons above threshold frequency ν₀ with K_max = hν − φ₀',
      hi: 'देहली आवृत्ति ν₀ से अधिक आवृत्ति के फोटॉनों द्वारा इलेक्ट्रॉनों का उत्सर्जन',
    },
    formulaDisplay: 'K_max = h·ν − φ₀ = e·V₀',
    secondaryFormulas: [
      { label: { en: 'Photon Energy', hi: 'फोटॉन ऊर्जा' }, formula: 'E = h·c / λ = 1240 / λ(nm) eV' },
      { label: { en: 'de Broglie Wavelength', hi: 'डी-ब्रॉग्ली तरंगदैर्घ्य' }, formula: 'λ_dB = h / √(2m·K_max)' },
    ],
    variables: [
      { key: 'lambda', symbol: 'λ', label: { en: 'Light Wavelength', hi: 'आपतित तरंगदैर्घ्य (λ)' }, unit: 'nm', min: 180, max: 700, step: 10, defaultValue: 300 },
      { key: 'phi', symbol: 'φ₀', label: { en: 'Metal Work Function', hi: 'कार्यफलन (φ₀)' }, unit: 'eV', min: 1.8, max: 5.2, step: 0.1, defaultValue: 2.3 },
      { key: 'intensity', symbol: 'I', label: { en: 'Beam Intensity', hi: 'प्रकाश तीव्रता (I)' }, unit: '%', min: 20, max: 100, step: 10, defaultValue: 60 },
    ],
    presets: [
      { id: 'sodium-uv', label: { en: 'Sodium + UV (Emission)', hi: 'सोडियम + UV (उत्सर्जन)' }, params: { lambda: 300, phi: 2.3, intensity: 70 } },
      { id: 'red-cutoff', label: { en: 'Red Light (Below Cutoff!)', hi: 'लाल प्रकाश (उत्सर्जन नहीं!)' }, params: { lambda: 650, phi: 2.3, intensity: 100 } },
      { id: 'cesium-vis', label: { en: 'Cesium (φ₀=2.1 eV)', hi: 'सीज़ियम (φ₀=2.1 eV)' }, params: { lambda: 450, phi: 2.1, intensity: 80 } },
    ],
    explanation: {
      en: 'Light arrives as discrete energy packets called photons (E = hc/λ). If photon energy E < work function φ₀, ZERO electrons are emitted no matter how intense the beam is! Above threshold, higher frequency boosts K_max (stopping potential V₀), while higher intensity only increases the number of emitted electrons (photocurrent).',
      hi: 'प्रकाश ऊर्जा के पैकेटों (फोटॉन, E = hc/λ) के रूप में आता है। यदि E < कार्यफलन φ₀ हो, तो कितनी भी तीव्रता होने पर एक भी इलेक्ट्रॉन नहीं निकलता! देहली के ऊपर आवृत्ति बढ़ाने से K_max बढ़ता है और तीव्रता बढ़ाने से केवल धारा बढ़ती है।',
    },
    realLife: {
      en: 'Solar photovoltaic panels, automatic elevator door sensors, night-vision cameras, and digital camera CMOS pixels all run on the photoelectric effect.',
      hi: 'सोलर पैनल, लिफ्ट के ऑटोमैटिक दरवाज़े के सेंसर और डिजिटल कैमरे के सेंसर प्रकाश-विद्युत प्रभाव पर कार्य करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'pe-cutoff',
        question: {
          en: 'Set Sodium (φ₀ = 2.3 eV) with intense Red light (λ = 650 nm, Intensity = 100%). Do any electrons escape?',
          hi: 'सोडियम (φ₀ = 2.3 eV) पर 100% तीव्रता का लाल प्रकाश (λ = 650 nm) डालें। क्या कोई इलेक्ट्रॉन निकलेगा?',
        },
        hint: { en: 'Calculate photon energy E = 1240 / 650 ≈ 1.91 eV and compare with φ₀ = 2.3 eV.', hi: 'फोटॉन ऊर्जा E = 1240 / 650 ≈ 1.91 eV की तुलना φ₀ = 2.3 eV से करें।' },
        answer: {
          en: 'ZERO electrons escape! Each red photon carries only 1.91 eV < 2.3 eV, proving wave theory wrong and confirming Einstein’s photon model.',
          hi: 'एक भी इलेक्ट्रॉन नहीं निकलता! प्रत्येक लाल फोटॉन में केवल 1.91 eV ऊर्जा है जो 2.3 eV से कम है।',
        },
        targetParams: { lambda: 650, phi: 2.3, intensity: 100 },
      },
    ],
    graphTitle: { en: 'Max Kinetic Energy K_max (eV) vs Frequency ν (×10¹⁴ Hz)', hi: 'अधिकतम गतिज ऊर्जा K_max (eV) बनाम आवृत्ति ν' },
    graphXLabel: 'ν (×10¹⁴ Hz)',
    graphYLabel: 'K_max (eV)',
  },

  // 15. ATOMS — BOHR MODEL & QUANTUM SPECTRA (3D DEFAULT!)
  {
    id: 'atoms',
    chapterId: 'atoms',
    supports3D: true,
    default3D: true,
    title: {
      en: '3D Bohr Atom & Spectral Transitions',
      hi: '3D बोहर परमाणु मॉडल और स्पेक्ट्रमी संक्रमण',
    },
    subtitle: {
      en: '3D quantized atomic orbits (r_n ∝ n²), energy levels E_n = −13.6/n² eV, and emitted photons',
      hi: '3D क्वांटित कक्षाएँ (r_n ∝ n²), ऊर्जा स्तर E_n = −13.6/n² eV और उत्सर्जित फोटॉन',
    },
    formulaDisplay: 'E_n = −13.6 · Z² / n² eV   |   ΔE = h·c / λ',
    secondaryFormulas: [
      { label: { en: 'Orbit Radius', hi: 'कक्षीय त्रिज्या' }, formula: 'r_n = 0.529 · n² / Z Å' },
      { label: { en: 'Angular Momentum', hi: 'कोणीय संवेग क्वांटिकरण' }, formula: 'L = n · h / (2π)' },
    ],
    variables: [
      { key: 'nInit', symbol: 'nᵢ', label: { en: 'Upper Orbit nᵢ', hi: 'उच्च कक्षा (nᵢ)' }, unit: '', min: 2, max: 5, step: 1, defaultValue: 3 },
      { key: 'nFinal', symbol: 'n_f', label: { en: 'Lower Orbit n_f', hi: 'निम्न कक्षा (n_f)' }, unit: '', min: 1, max: 4, step: 1, defaultValue: 2 },
      { key: 'Z', symbol: 'Z', label: { en: 'Atomic Number', hi: 'परमाणु क्रमांक (Z)' }, unit: '', min: 1, max: 3, step: 1, defaultValue: 1 },
    ],
    presets: [
      { id: 'balmer-alpha', label: { en: 'Balmer H-α (3→2)', hi: 'बामर H-α (3→2)' }, params: { nInit: 3, nFinal: 2, Z: 1 } },
      { id: 'lyman-uv', label: { en: 'Lyman UV (2→1)', hi: 'लाइमन UV (2→1)' }, params: { nInit: 2, nFinal: 1, Z: 1 } },
      { id: 'paschen-ir', label: { en: 'Paschen IR (4→3)', hi: 'पाश्चन IR (4→3)' }, params: { nInit: 4, nFinal: 3, Z: 1 } },
      { id: 'he-ion', label: { en: 'He⁺ Ion (Z=2)', hi: 'He⁺ आयन (Z=2)' }, params: { nInit: 3, nFinal: 2, Z: 2 } },
    ],
    explanation: {
      en: 'In Bohr’s model, electrons occupy discrete quantized shells where L = nh/(2π) and r_n ∝ n². When an electron jumps from a higher shell nᵢ down to n_f, the atom emits a single photon carrying exact energy ΔE = E_i − E_f (creating Lyman, Balmer, and Paschen spectral lines).',
      hi: 'बोहर मॉडल में इलेक्ट्रॉन केवल उन्हीं कक्षाओं में घूमते हैं जहाँ कोणीय संवेग L = nh/(2π) हो। जब इलेक्ट्रॉन उच्च कक्षा nᵢ से निम्न कक्षा n_f में कूदता है, तो ठीक ΔE = E_i − E_f ऊर्जा का फोटॉन उत्सर्जित होता है।',
    },
    realLife: {
      en: 'Astronomers identify Hydrogen and Helium in distant stars and galaxies billions of light-years away by decoding their exact Balmer and Lyman emission wavelengths.',
      hi: 'खगोलविद अरबों प्रकाश-वर्ष दूर तारों में मौजूद तत्वों की पहचान उनके परमाणु स्पेक्ट्रम (बामर/लाइमन रेखाओं) से करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'bohr-lyman',
        question: {
          en: 'Compare the Balmer jump (3 → 2) with the Lyman jump (2 → 1) in Hydrogen. Which emits a higher-energy photon?',
          hi: 'हाइड्रोजन में बामर संक्रमण (3 → 2) और लाइमन (2 → 1) की तुलना करें। किसमें अधिक ऊर्जा का फोटॉन निकलेगा?',
        },
        hint: { en: 'E₁ = −13.6 eV, E₂ = −3.4 eV, E₃ = −1.51 eV.', hi: 'E₁ = −13.6 eV, E₂ = −3.4 eV, E₃ = −1.51 eV का अंतर देखें।' },
        answer: {
          en: 'Lyman (2 → 1) releases a massive 10.2 eV (Ultraviolet, 121.6 nm), over 5× more energetic than Balmer H-α (1.89 eV, Visible 656 nm)!',
          hi: 'लाइमन (2 → 1) से 10.2 eV (पराबैंगनी) निकलती है जो बामर (1.89 eV) से 5 गुना अधिक है!',
        },
        targetParams: { nInit: 2, nFinal: 1, Z: 1 },
      },
    ],
    graphTitle: { en: 'Bohr Energy Levels E_n (eV) vs Shell Number n', hi: 'बोहर ऊर्जा स्तर E_n (eV) बनाम कक्षा संख्या n' },
    graphXLabel: 'Shell n',
    graphYLabel: 'Energy E_n (eV)',
  },

  // 16. NUCLEI & RADIOACTIVE DECAY
  {
    id: 'nuclei',
    chapterId: 'nuclei',
    supports3D: true,
    title: {
      en: 'Radioactive Decay & Half-Life Law',
      hi: 'रेडियोधर्मी क्षय और अर्ध-आयु नियम',
    },
    subtitle: {
      en: 'Live decaying nucleus grid demonstrating N(t) = N₀·e^(−λt) and T½ = 0.693 / λ',
      hi: 'नाभिकों के क्षय का सजीव प्रदर्शन: N(t) = N₀·e^(−λt) तथा T½ = 0.693 / λ',
    },
    formulaDisplay: 'N(t) = N₀ · (½)^(t / T½) = N₀ · e^(−λt)',
    secondaryFormulas: [
      { label: { en: 'Decay Constant', hi: 'क्षय नियतांक' }, formula: 'λ = ln(2) / T½ ≈ 0.693 / T½' },
      { label: { en: 'Activity', hi: 'सक्रियता (Activity)' }, formula: 'R = λ · N' },
    ],
    variables: [
      { key: 'N0', symbol: 'N₀', label: { en: 'Initial Nuclei', hi: 'प्रारंभिक नाभिक (N₀)' }, unit: '', min: 40, max: 200, step: 20, defaultValue: 100 },
      { key: 'halfLife', symbol: 'T½', label: { en: 'Half-Life', hi: 'अर्ध-आयु (T½)' }, unit: 's', min: 1.0, max: 8.0, step: 0.5, defaultValue: 3.0 },
    ],
    presets: [
      { id: 'fast-decay', label: { en: 'Rapid Decay (T½=1.5s)', hi: 'तीव्र क्षय (T½=1.5s)' }, params: { N0: 120, halfLife: 1.5 } },
      { id: 'medium-decay', label: { en: 'Standard (T½=3.0s)', hi: 'मानक (T½=3.0s)' }, params: { N0: 100, halfLife: 3.0 } },
      { id: 'slow-decay', label: { en: 'Long-Lived (T½=6.5s)', hi: 'धीमा क्षय (T½=6.5s)' }, params: { N0: 160, halfLife: 6.5 } },
    ],
    explanation: {
      en: 'Radioactive decay is spontaneous and exponential: in every single half-life interval T½, exactly 50% of the REMAINING undecayed parent nuclei transform into daughter nuclei (100% → 50% → 25% → 12.5%).',
      hi: 'रेडियोधर्मी क्षय चरघातांकी होता है: प्रत्येक अर्ध-आयु T½ के बाद बचे हुए नाभिकों में से ठीक आधे (50%) क्षय हो जाते हैं (100% → 50% → 25% → 12.5%)।',
    },
    realLife: {
      en: 'Archaeologists determine the age of ancient fossils using Carbon-14 dating (T½ = 5730 years), and doctors use Technetium-99m (T½ = 6 hours) for nuclear medical imaging.',
      hi: 'पुरातत्वविद कार्बन-14 (T½ = 5730 वर्ष) से प्राचीन जीवाश्मों की आयु ज्ञात करते हैं और चिकित्सा में रेडियोआइसोटोप स्कैन किया जाता है।',
    },
    whatIfPrompts: [
      {
        id: 'nuc-3half',
        question: {
          en: 'Start with N₀ = 160 nuclei and T½ = 2.0 s. After 3 half-lives (6.0 s), how many parent nuclei remain?',
          hi: 'N₀ = 160 नाभिक और T½ = 2.0 s से शुरू करें। 3 अर्ध-आयु (6.0 s) बाद कितने नाभिक बचेंगे?',
        },
        hint: { en: 'Multiply N₀ by (½)³ = 1/8.', hi: 'N₀ को (½)³ = 1/8 से गुणा करें।' },
        answer: {
          en: 'Exactly 160 / 8 = 20 nuclei remain undecayed (12.5%), while 140 have decayed into daughter nuclei!',
          hi: 'ठीक 160 / 8 = 20 नाभिक शेष बचते हैं (12.5%), जबकि 140 क्षय हो चुके होते हैं!',
        },
        targetParams: { N0: 160, halfLife: 2.0 },
      },
    ],
    graphTitle: { en: 'Exponential Decay Curve N(t) vs Time t', hi: 'चरघातांकी क्षय वक्र N(t) बनाम समय t' },
    graphXLabel: 't (s)',
    graphYLabel: 'Remaining N',
  },

  // 17. SEMICONDUCTOR ELECTRONICS (P-N JUNCTION DIODE)
  {
    id: 'semiconductors',
    chapterId: 'semiconductors',
    title: {
      en: 'P–N Junction Diode & I–V Characteristic',
      hi: 'P–N संधि डायोड और I–V अभिलाक्षणिक',
    },
    subtitle: {
      en: 'Live depletion layer width, hole/electron drift, knee voltage V_k, and Shockley diode curve',
      hi: 'सजीव अवक्षय परत (Depletion Layer), होल-इलेक्ट्रॉन प्रवाह, नी वोल्टेज और I–V वक्र',
    },
    formulaDisplay: 'I = I_s · (e^(V / ηV_T) − 1)',
    secondaryFormulas: [
      { label: { en: 'Barrier Potential', hi: 'रोधी विभव (Knee V)' }, formula: 'Si ≈ 0.7 V   |   Ge ≈ 0.3 V' },
      { label: { en: 'Dynamic Resistance', hi: 'गतिक प्रतिरोध' }, formula: 'r_d = ΔV / ΔI' },
    ],
    variables: [
      { key: 'Vbias', symbol: 'V', label: { en: 'Bias Voltage (+Fwd / −Rev)', hi: 'बायस विभव (+अग्र / −पश्च)' }, unit: 'V', min: -3.0, max: 1.5, step: 0.05, defaultValue: 0.8 },
      { key: 'Vk', symbol: 'V_k', label: { en: 'Barrier Voltage (Ge=0.3, Si=0.7)', hi: 'रोधी विभव (Ge=0.3, Si=0.7)' }, unit: 'V', min: 0.3, max: 0.8, step: 0.1, defaultValue: 0.7 },
      { key: 'Rseries', symbol: 'R', label: { en: 'Series Resistor', hi: 'श्रेणी प्रतिरोध (R)' }, unit: 'Ω', min: 10, max: 200, step: 10, defaultValue: 50 },
    ],
    presets: [
      { id: 'si-fwd', label: { en: 'Si Forward (+0.9V)', hi: 'सिलिकॉन अग्र बायस (+0.9V)' }, params: { Vbias: 0.9, Vk: 0.7, Rseries: 50 } },
      { id: 'si-rev', label: { en: 'Reverse Bias (−2.0V)', hi: 'पश्च बायस (−2.0V)' }, params: { Vbias: -2.0, Vk: 0.7, Rseries: 50 } },
      { id: 'ge-fwd', label: { en: 'Germanium (Vk=0.3V)', hi: 'जर्मेनियम (Vk=0.3V)' }, params: { Vbias: 0.6, Vk: 0.3, Rseries: 50 } },
      { id: 'zero-bias', label: { en: 'Unbiased (0 V)', hi: 'शून्य बायस (0 V)' }, params: { Vbias: 0.0, Vk: 0.7, Rseries: 50 } },
    ],
    explanation: {
      en: 'Under Forward Bias (+V > V_k), the external battery opposes the built-in barrier potential, shrinking the depletion layer so majority holes and electrons surge across! Under Reverse Bias (−V), carriers pull away from the junction, widening the depletion layer and blocking current.',
      hi: 'अग्र बायस (+V > V_k) में बाह्य विभव रोधी विभव का विरोध करता है जिससे अवक्षय परत पतली हो जाती है और धारा बहने लगती है! पश्च बायस (−V) में अवक्षय परत चौड़ी हो जाती है और धारा लगभग शून्य रहती है।',
    },
    realLife: {
      en: 'Mobile chargers use P–N junction bridge rectifiers to convert wall AC into DC, while LEDs emit light when electrons and holes recombine across forward-biased junctions.',
      hi: 'मोबाइल चार्जर के दिष्टकारी (Rectifier) AC को DC में बदलते हैं और LED अग्र बायस में प्रकाश उत्सर्जित करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'diode-rev',
        question: {
          en: 'Flip the battery to Reverse Bias (V = −2.0 V). What happens to the depletion zone width and current I?',
          hi: 'बैटरी को पश्च बायस (V = −2.0 V) में उलट दें। अवक्षय परत की चौड़ाई और धारा I पर क्या प्रभाव होगा?',
        },
        hint: { en: 'Majority holes in P pull toward (−) and electrons in N pull toward (+).', hi: 'P-क्षेत्र के होल (−) की ओर तथा N-क्षेत्र के इलेक्ट्रॉन (+) की ओर खिंच जाते हैं।' },
        answer: {
          en: 'The depletion zone widens dramatically and diode current drops to virtually zero—acting as a one-way electrical valve!',
          hi: 'अवक्षय परत बहुत चौड़ी हो जाती है और धारा लगभग शून्य हो जाती है—डायोड एकतरफा वाल्व की तरह काम करता है!',
        },
        targetParams: { Vbias: -2.0, Vk: 0.7, Rseries: 50 },
      },
    ],
    graphTitle: { en: 'Diode I–V Characteristic Curve (mA vs Volts)', hi: 'डायोड I–V अभिलाक्षणिक वक्र (mA बनाम V)' },
    graphXLabel: 'Bias V (V)',
    graphYLabel: 'Current I (mA)',
  },
];
