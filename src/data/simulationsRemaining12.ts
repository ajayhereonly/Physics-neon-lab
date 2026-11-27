import { PhysicsSimulation } from '../types/physics';

export const REMAINING_SIMULATIONS_12: PhysicsSimulation[] = [
  // 12. GAUSS'S LAW & ELECTRIC DIPOLE TORQUE — Ch 16 (SUPPORTS 3D!)
  {
    id: 'gauss-dipole',
    chapterId: 'electric-charges',
    supports3D: true,
    shortTabLabel: { en: 'Gauss’s Law & Dipole', hi: 'गॉस नियम व द्विध्रुव' },
    title: {
      en: 'Gauss’s Law Flux & Electric Dipole Torque',
      hi: 'गॉस का नियम (विद्युत फ्लक्स) और द्विध्रुव आघूर्ण',
    },
    subtitle: {
      en: 'Enclosed charge electric flux Φ = q/ε₀ (independent of Gaussian radius R) and dipole torque τ = pE·sinθ',
      hi: 'परिबद्ध आवेश का विद्युत फ्लक्स Φ = q/ε₀ और द्विध्रुव पर बल-आघूर्ण τ = pE·sinθ',
    },
    formulaDisplay: 'Φ_E = ∮ E·dA = q_enc / ε₀   |   τ = p · E · sin(θ)',
    secondaryFormulas: [
      { label: { en: 'Field Outside Sphere', hi: 'गोले के बाहर क्षेत्र' }, formula: 'E = q / (4π·ε₀·R²)' },
      { label: { en: 'Dipole Potential Energy', hi: 'द्विध्रुव स्थितिज ऊर्जा' }, formula: 'U = −p · E · cos(θ)' },
    ],
    variables: [
      { key: 'q', symbol: 'q', label: { en: 'Enclosed Charge', hi: 'परिबद्ध आवेश (q)' }, unit: 'μC', min: 1, max: 20, step: 1, defaultValue: 8 },
      { key: 'R', symbol: 'R', label: { en: 'Gaussian Sphere Radius', hi: 'गॉसीय गोले की त्रिज्या (R)' }, unit: 'm', min: 0.5, max: 3.0, step: 0.1, defaultValue: 1.2 },
      { key: 'Eext', symbol: 'E', label: { en: 'Uniform External Field', hi: 'बाह्य विद्युत क्षेत्र (E)' }, unit: 'kN/C', min: 1, max: 20, step: 1, defaultValue: 8 },
      { key: 'theta', symbol: 'θ', label: { en: 'Dipole Angle', hi: 'द्विध्रुव कोण (θ)' }, unit: '°', min: 0, max: 180, step: 5, defaultValue: 60 },
    ],
    presets: [
      { id: 'small-gauss', label: { en: 'Small Sphere (R=0.8m)', hi: 'छोटा गोला (R=0.8m)' }, params: { q: 8, R: 0.8, Eext: 8, theta: 60 } },
      { id: 'large-gauss', label: { en: 'Double Radius (Same Φ!)', hi: 'दोगुनी त्रिज्या (समान Φ!)' }, params: { q: 8, R: 1.6, Eext: 8, theta: 60 } },
      { id: 'max-torque', label: { en: 'Max Dipole Torque (90°)', hi: 'अधिकतम बल-आघूर्ण (90°)' }, params: { q: 8, R: 1.2, Eext: 14, theta: 90 } },
    ],
    comparePresetB: {
      label: { en: 'Double Radius (R = 2.4 m)', hi: 'दोगुनी त्रिज्या (R = 2.4 m)' },
      params: { q: 8, R: 2.4, Eext: 8, theta: 60 },
    },
    explanation: {
      en: 'By Gauss’s Law, total electric flux Φ_E = q_enc / ε₀ depends ONLY on enclosed charge—doubling the Gaussian sphere radius drops E by 1/4 while surface area 4πR² grows 4×, leaving total flux completely unchanged!',
      hi: 'गॉस के नियम के अनुसार कुल विद्युत फ्लक्स Φ_E = q_enc / ε₀ केवल परिबद्ध आवेश पर निर्भर करता है—गोले की त्रिज्या दोगुनी करने पर क्षेत्र 1/4 होता है और क्षेत्रफल 4 गुना, अतः कुल फ्लक्स अपरिवर्तित रहता है!',
    },
    realLife: {
      en: 'Microwave ovens spin polar water molecules rapidly back and forth using electric dipole torque τ = pE·sinθ, while coaxial cables shield signals using cylindrical Gauss’s law.',
      hi: 'माइक्रोवेव ओवन में ध्रुवीय जल अणु विद्युत द्विध्रुव आघूर्ण τ = pE·sinθ के कारण घूमकर भोजन गर्म करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'gauss-radius',
        question: {
          en: 'Double the Gaussian sphere radius R from 1.2 m to 2.4 m while keeping q = 8 μC. Does total electric flux Φ_E change?',
          hi: 'q = 8 μC स्थिर रखकर गॉसीय गोले की त्रिज्या 1.2 m से 2.4 m करें। क्या कुल फ्लक्स Φ_E बदलेगा?',
        },
        hint: { en: 'Check the formula Φ_E = q_enc / ε₀ — does R appear anywhere?', hi: 'Φ_E = q_enc / ε₀ में देखें—क्या इसमें R है?' },
        answer: {
          en: 'NO! Total flux stays fixed at 9.04 × 10⁵ N·m²/C because every field line crossing the inner sphere also crosses the outer sphere.',
          hi: 'नहीं! कुल फ्लक्स 9.04 × 10⁵ N·m²/C स्थिर रहता है क्योंकि उतनी ही बल रेखाएँ बड़े गोले से भी बाहर निकलती हैं।',
        },
        targetParams: { q: 8, R: 2.4, Eext: 8, theta: 60 },
      },
    ],
    graphTitle: { en: 'Surface Field E (1/R²) vs Constant Flux Φ_E', hi: 'विद्युत क्षेत्र E (1/R²) बनाम नियत फ्लक्स Φ_E' },
    graphXLabel: 'Radius R (m)',
    graphYLabel: 'Field E (kN/C)',
  },

  // 13. ELECTRIC POTENTIAL & EQUIPOTENTIAL SURFACES — Ch 17
  {
    id: 'electric-potential',
    chapterId: 'capacitance',
    shortTabLabel: { en: 'Electric Potential (V)', hi: 'विद्युत विभव (V)' },
    title: {
      en: 'Electric Potential & Equipotential Surfaces',
      hi: 'विद्युत विभव और समविभव पृष्ठ (Equipotential)',
    },
    subtitle: {
      en: 'Scalar potential V = kq/r, concentric equipotential rings, and E = −dV/dr perpendicular to contours',
      hi: 'अदिश विभव V = kq/r, समविभव वृत्त और क्षेत्र-विभव संबंध E = −dV/dr',
    },
    formulaDisplay: 'V = k · q / r   |   E = −dV / dr   |   W = q₀ · ΔV',
    secondaryFormulas: [
      { label: { en: 'Potential Energy of Pair', hi: 'युग्म की स्थितिज ऊर्जा' }, formula: 'U = k · q₁·q₂ / r' },
      { label: { en: 'Equipotential Work', hi: 'समविभव पृष्ठ पर कार्य' }, formula: 'W_eq = q₀·(V_A − V_A) = 0' },
    ],
    variables: [
      { key: 'q', symbol: 'q', label: { en: 'Source Charge', hi: 'स्रोत आवेश (q)' }, unit: 'μC', min: -12, max: 12, step: 1, defaultValue: 6 },
      { key: 'r', symbol: 'r', label: { en: 'Probe Distance', hi: 'परीक्षण दूरी (r)' }, unit: 'm', min: 0.4, max: 4.0, step: 0.1, defaultValue: 1.5 },
      { key: 'q0', symbol: 'q₀', label: { en: 'Test Charge', hi: 'परीक्षण आवेश (q₀)' }, unit: 'μC', min: 1, max: 10, step: 1, defaultValue: 2 },
    ],
    presets: [
      { id: 'pos-hill', label: { en: 'Positive Potential Hill', hi: 'धनात्मक विभव शिखर' }, params: { q: 8, r: 1.2, q0: 2 } },
      { id: 'neg-well', label: { en: 'Negative Potential Well', hi: 'ऋणात्मक विभव कूप' }, params: { q: -8, r: 1.2, q0: 2 } },
      { id: 'far-probe', label: { en: 'Far Distance (r = 3.5 m)', hi: 'अधिक दूरी (r = 3.5 m)' }, params: { q: 8, r: 3.5, q0: 2 } },
    ],
    comparePresetB: {
      label: { en: 'Negative Charge (−6 μC)', hi: 'ऋणात्मक आवेश (−6 μC)' },
      params: { q: -6, r: 1.5, q0: 2 },
    },
    explanation: {
      en: 'Electric potential V = kq/r falls slower (1/r) than electric field E = kq/r² (1/r²). Moving a test charge along any equipotential contour requires ZERO work because E is always perpendicular to equipotential surfaces.',
      hi: 'विद्युत विभव V = kq/r दूरी के व्युत्क्रमानुपाती (1/r) होता है। किसी भी समविभव पृष्ठ पर आवेश को घुमाने में किया गया कार्य शून्य होता है क्योंकि विद्युत क्षेत्र सदैव पृष्ठ के लंबवत होता है।',
    },
    realLife: {
      en: 'Electrocardiograms (ECG) map equipotential voltage contours across the human chest created by the heart’s electrical dipole cycle.',
      hi: 'ईसीजी (ECG) मशीन हृदय के विद्युत द्विध्रुव द्वारा छाती पर बनने वाले समविभव वोल्टेज का मानचित्रण करती है।',
    },
    whatIfPrompts: [
      {
        id: 'epot-double-r',
        question: {
          en: 'Double probe distance r from 1.5 m to 3.0 m. Compare how much V drops versus how much E drops.',
          hi: 'दूरी r को 1.5 m से 3.0 m (दोगुना) करें। विभव V और क्षेत्र E की कमी की तुलना करें।',
        },
        hint: { en: 'V ∝ 1/r becomes ½, while E ∝ 1/r² becomes ¼.', hi: 'V ∝ 1/r आधा होता है, जबकि E ∝ 1/r² एक-चौथाई हो जाता है।' },
        answer: {
          en: 'Potential V cuts in HALF (36 kV → 18 kV), while Electric Field E drops to ONE-QUARTER (24 → 6 kN/C)!',
          hi: 'विभव V आधा (36 → 18 kV) होता है जबकि विद्युत क्षेत्र E एक-चौथाई (24 → 6 kN/C) रह जाता है!',
        },
        targetParams: { q: 6, r: 3.0, q0: 2 },
      },
    ],
    graphTitle: { en: 'Electric Potential V (1/r) vs Distance r', hi: 'विद्युत विभव V (1/r) बनाम दूरी r' },
    graphXLabel: 'Distance r (m)',
    graphYLabel: 'Potential V (kV)',
  },

  // 14. KIRCHHOFF'S LAWS & WHEATSTONE BRIDGE — Ch 18
  {
    id: 'wheatstone-bridge',
    chapterId: 'current-electricity',
    shortTabLabel: { en: 'Wheatstone Bridge & EMF', hi: 'व्हीटस्टोन सेतु व EMF' },
    title: {
      en: 'Wheatstone Bridge & Cell Internal Resistance',
      hi: 'व्हीटस्टोन सेतु और सेल का आंतरिक प्रतिरोध',
    },
    subtitle: {
      en: 'Null-deflection bridge balance P/Q = R/S with live galvanometer needle and terminal voltage V = E − Ir',
      hi: 'शून्य विक्षेप संतुलन P/Q = R/S, गैल्वेनोमीटर सुई और टर्मिनल वोल्टता V = E − Ir',
    },
    formulaDisplay: 'R₁ / R₂ = R₃ / R₄  (I_g = 0)   |   V = E − I · r',
    secondaryFormulas: [
      { label: { en: 'Bridge Voltage Diff', hi: 'सेतु विभवांतर' }, formula: 'ΔV_BD = V·(R₂/(R₁+R₂) − R₄/(R₃+R₄))' },
      { label: { en: 'Kirchhoff Loop Law', hi: 'किरचॉफ लूप नियम' }, formula: 'ΣΔV = 0  ,  ΣI_in = ΣI_out' },
    ],
    variables: [
      { key: 'R1', symbol: 'R₁', label: { en: 'Arm P (R₁)', hi: 'भुजा P (R₁)' }, unit: 'Ω', min: 5, max: 100, step: 5, defaultValue: 20 },
      { key: 'R2', symbol: 'R₂', label: { en: 'Arm Q (R₂)', hi: 'भुजा Q (R₂)' }, unit: 'Ω', min: 5, max: 100, step: 5, defaultValue: 40 },
      { key: 'R3', symbol: 'R₃', label: { en: 'Arm R (R₃)', hi: 'भुजा R (R₃)' }, unit: 'Ω', min: 5, max: 100, step: 5, defaultValue: 30 },
      { key: 'R4', symbol: 'R₄', label: { en: 'Unknown Arm S (R₄)', hi: 'अज्ञात भुजा S (R₄)' }, unit: 'Ω', min: 5, max: 120, step: 5, defaultValue: 60 },
      { key: 'E', symbol: 'E', label: { en: 'Cell EMF', hi: 'सेल का EMF (E)' }, unit: 'V', min: 2, max: 24, step: 1, defaultValue: 12 },
    ],
    presets: [
      { id: 'balanced', label: { en: 'Balanced Null (I_g = 0)', hi: 'संतुलित सेतु (I_g = 0)' }, params: { R1: 20, R2: 40, R3: 30, R4: 60, E: 12 } },
      { id: 'unbalanced-left', label: { en: 'Unbalanced (R₄ = 20 Ω)', hi: 'असंतुलित (R₄ = 20 Ω)' }, params: { R1: 20, R2: 40, R3: 30, R4: 20, E: 12 } },
      { id: 'unbalanced-right', label: { en: 'Unbalanced (R₄ = 100 Ω)', hi: 'असंतुलित (R₄ = 100 Ω)' }, params: { R1: 20, R2: 40, R3: 30, R4: 100, E: 12 } },
    ],
    comparePresetB: {
      label: { en: 'Unbalanced (R₄ = 100 Ω)', hi: 'असंतुलित (R₄ = 100 Ω)' },
      params: { R1: 20, R2: 40, R3: 30, R4: 100, E: 12 },
    },
    explanation: {
      en: 'When R₁/R₂ = R₃/R₄, nodes B and D sit at the exact same electric potential so zero current flows through the central galvanometer (I_g = 0). This null method measures unknown resistance S = R₃·(R₂/R₁) with extreme precision.',
      hi: 'जब R₁/R₂ = R₃/R₄ होता है, तब बिंदु B और D समान विभव पर होते हैं और गैल्वेनोमीटर में धारा शून्य (I_g = 0) हो जाती है। इस शून्य विक्षेप विधि से अज्ञात प्रतिरोध अत्यंत सटीकता से मापा जाता है।',
    },
    realLife: {
      en: 'Digital weighing scales and bridge strain gauges use micro-Wheatstone bridges to detect tiny resistance shifts caused by weight bending a metal sensor.',
      hi: 'डिजिटल तराजू (weighing scale) और स्ट्रेन गेज सेंसर सूक्ष्म प्रतिरोध परिवर्तन मापने के लिए व्हीटस्टोन सेतु का उपयोग करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'wb-balance',
        question: {
          en: 'Set R₁ = 20 Ω, R₂ = 40 Ω, R₃ = 30 Ω, and R₄ = 100 Ω. Which way does galvanometer current flow, and what R₄ restores balance?',
          hi: 'R₁ = 20, R₂ = 40, R₃ = 30 और R₄ = 100 Ω पर गैल्वेनोमीटर किस ओर विक्षेपित होगा और संतुलन के लिए R₄ कितना होना चाहिए?',
        },
        hint: { en: 'Balance requires R₄ = R₃·(R₂/R₁) = 30 × (40/20).', hi: 'संतुलन के लिए R₄ = R₃·(R₂/R₁) की गणना करें।' },
        answer: {
          en: 'At R₄ = 100 Ω, node D is higher than B so current deflects left; setting R₄ = 60 Ω brings I_g back to exact ZERO!',
          hi: 'R₄ = 100 Ω पर विक्षेप बाईं ओर होता है; R₄ = 60 Ω रखने पर I_g फिर से शून्य हो जाता है!',
        },
        targetParams: { R1: 20, R2: 40, R3: 30, R4: 60, E: 12 },
      },
    ],
    graphTitle: { en: 'Galvanometer Deflection Voltage ΔV_BD vs R₄', hi: 'गैल्वेनोमीटर विभवांतर ΔV_BD बनाम R₄' },
    graphXLabel: 'R₄ (Ω)',
    graphYLabel: 'ΔV_BD (V)',
  },

  // 15. BIOT-SAVART LAW, SOLENOID & PARALLEL WIRES — Ch 19 (SUPPORTS 3D!)
  {
    id: 'solenoid-wires',
    chapterId: 'moving-charges',
    supports3D: true,
    shortTabLabel: { en: 'Solenoid & Ampere Law', hi: 'परिनालिका व एम्पीयर नियम' },
    title: {
      en: 'Solenoid Magnetic Field & Parallel Wires Force',
      hi: 'परिनालिका का चुंबकीय क्षेत्र और समानांतर तारों के बीच बल',
    },
    subtitle: {
      en: 'Uniform interior magnetic field B = μ₀nI via Ampere’s Law and attractive/repulsive force between currents',
      hi: 'एम्पीयर नियम से परिनालिका के भीतर एकसमान क्षेत्र B = μ₀nI और समानांतर धारावाही तारों का बल',
    },
    formulaDisplay: 'B = μ₀ · n · I   |   F / L = (μ₀ · I₁ · I₂) / (2π · d)',
    secondaryFormulas: [
      { label: { en: 'Circular Loop Center', hi: 'वृत्ताकार लूप केंद्र पर' }, formula: 'B = μ₀·N·I / (2R)' },
      { label: { en: 'Long Straight Wire', hi: 'सीधे तार के पास क्षेत्र' }, formula: 'B = μ₀·I / (2π·r)' },
    ],
    variables: [
      { key: 'n', symbol: 'n', label: { en: 'Turns per Meter', hi: 'प्रति मीटर फेरे (n)' }, unit: 'm⁻¹', min: 100, max: 2000, step: 100, defaultValue: 800 },
      { key: 'I', symbol: 'I', label: { en: 'Solenoid Current', hi: 'परिनालिका धारा (I)' }, unit: 'A', min: 0.5, max: 15, step: 0.5, defaultValue: 5 },
      { key: 'd', symbol: 'd', label: { en: 'Wire Separation', hi: 'तारों की दूरी (d)' }, unit: 'cm', min: 1, max: 15, step: 1, defaultValue: 4 },
      { key: 'sameDir', symbol: 'dir', label: { en: 'Wire Current Dir (+1 Same, −1 Opp)', hi: 'धारा दिशा (+1 समान, −1 विपरीत)' }, unit: '', min: -1, max: 1, step: 2, defaultValue: 1 },
    ],
    presets: [
      { id: 'standard', label: { en: 'Lab Solenoid (5 A)', hi: 'प्रयोगशाला परिनालिका (5 A)' }, params: { n: 800, I: 5, d: 4, sameDir: 1 } },
      { id: 'mri-coil', label: { en: 'High-Density Coil (15 A)', hi: 'उच्च घनत्व कुंडली (15 A)' }, params: { n: 2000, I: 15, d: 2, sameDir: 1 } },
      { id: 'repel-wires', label: { en: 'Opposite Currents (Repel)', hi: 'विपरीत धाराएँ (प्रतिकर्षण)' }, params: { n: 800, I: 8, d: 3, sameDir: -1 } },
    ],
    comparePresetB: {
      label: { en: 'Double Turns (n = 1600)', hi: 'दोगुने फेरे (n = 1600)' },
      params: { n: 1600, I: 5, d: 4, sameDir: 1 },
    },
    explanation: {
      en: 'Inside a long solenoid, magnetic field lines run straight and parallel with uniform strength B = μ₀nI, independent of radius. Parallel wires carrying current in the SAME direction attract each other; opposite currents repel.',
      hi: 'लंबी परिनालिका के भीतर चुंबकीय क्षेत्र एकसमान और अक्ष के समानांतर (B = μ₀nI) होता है। समान दिशा में धारा ले जाने वाले दो समानांतर तार एक-दूसरे को आकर्षित करते हैं जबकि विपरीत धाराएँ प्रतिकर्षित करती हैं।',
    },
    realLife: {
      en: 'Hospital MRI scanners use superconducting solenoids to generate ultra-uniform Tesla-level fields, and the SI unit Ampere was historically defined from the force between two parallel wires.',
      hi: 'अस्पताल की MRI मशीनों में अतिचालक परिनालिका (solenoid) का उपयोग होता है और 1 एम्पीयर की परिभाषा समानांतर तारों के बल से दी गई थी।',
    },
    whatIfPrompts: [
      {
        id: 'sol-double',
        question: {
          en: 'Double both turn density n (800 → 1600 m⁻¹) and current I (5 → 10 A). How many times stronger does B become?',
          hi: 'फेरों की संख्या n और धारा I दोनों को दोगुना करने पर चुंबकीय क्षेत्र B कितने गुना हो जाएगा?',
        },
        hint: { en: 'B = μ₀·n·I is proportional to the product n × I.', hi: 'B = μ₀·n·I गुणनफल n × I के समानुपाती है।' },
        answer: {
          en: 'B quadruples (4× stronger, from 5.03 mT to 20.11 mT)!',
          hi: 'चुंबकीय क्षेत्र 4 गुना (5.03 mT से 20.11 mT) बढ़ जाता है!',
        },
        targetParams: { n: 1600, I: 10, d: 4, sameDir: 1 },
      },
    ],
    graphTitle: { en: 'Solenoid Magnetic Field B (mT) vs Current I', hi: 'परिनालिका चुंबकीय क्षेत्र B बनाम धारा I' },
    graphXLabel: 'Current I (A)',
    graphYLabel: 'B (mT)',
  },

  // 16. TRANSFORMER & MUTUAL INDUCTANCE — Ch 21
  {
    id: 'transformer',
    chapterId: 'emi',
    supports3D: true,
    shortTabLabel: { en: 'Transformer & Ratio', hi: 'ट्रांसफॉर्मर (Transformer)' },
    title: {
      en: 'Step-Up / Step-Down Transformer & Mutual Inductance',
      hi: 'उच्चायी / अपचायी ट्रांसफॉर्मर और अन्योन्य प्रेरण',
    },
    subtitle: {
      en: 'Iron-core magnetic flux coupling showing voltage ratio V_s/V_p = N_s/N_p and power conservation',
      hi: 'लौह क्रोड फ्लक्स युग्मन: वोल्टता अनुपात V_s/V_p = N_s/N_p और शक्ति संरक्षण',
    },
    formulaDisplay: 'V_s / V_p = N_s / N_p = I_p / I_s   |   P_out = η · P_in',
    secondaryFormulas: [
      { label: { en: 'Turns Ratio', hi: 'परिणमन अनुपात' }, formula: 'K = N_s / N_p' },
      { label: { en: 'Mutual EMF', hi: 'अन्योन्य प्रेरित EMF' }, formula: 'ε₂ = −M · (dI₁ / dt)' },
    ],
    variables: [
      { key: 'Vp', symbol: 'V_p', label: { en: 'Primary AC Voltage', hi: 'प्राथमिक वोल्टता (V_p)' }, unit: 'V', min: 10, max: 440, step: 10, defaultValue: 220 },
      { key: 'Np', symbol: 'N_p', label: { en: 'Primary Turns', hi: 'प्राथमिक फेरे (N_p)' }, unit: '', min: 50, max: 1000, step: 50, defaultValue: 400 },
      { key: 'Ns', symbol: 'N_s', label: { en: 'Secondary Turns', hi: 'द्वितीयक फेरे (N_s)' }, unit: '', min: 50, max: 1000, step: 50, defaultValue: 800 },
      { key: 'Ip', symbol: 'I_p', label: { en: 'Primary Current', hi: 'प्राथमिक धारा (I_p)' }, unit: 'A', min: 0.5, max: 10, step: 0.5, defaultValue: 4 },
    ],
    presets: [
      { id: 'step-up', label: { en: 'Step-Up (2× Voltage)', hi: 'उच्चायी (2× वोल्टता)' }, params: { Vp: 220, Np: 400, Ns: 800, Ip: 4 } },
      { id: 'step-down', label: { en: 'Phone Charger (Step-Down)', hi: 'अपचायी (चार्जर)' }, params: { Vp: 220, Np: 1000, Ns: 50, Ip: 0.5 } },
      { id: 'isolation', label: { en: '1:1 Isolation', hi: '1:1 पृथक्करण' }, params: { Vp: 220, Np: 500, Ns: 500, Ip: 3 } },
    ],
    comparePresetB: {
      label: { en: 'Step-Down (N_s = 100)', hi: 'अपचायी (N_s = 100)' },
      params: { Vp: 220, Np: 400, Ns: 100, Ip: 4 },
    },
    explanation: {
      en: 'An alternating current in the primary coil creates a changing magnetic flux inside the laminated iron core that induces V_s = V_p·(N_s/N_p) in the secondary. Because power V·I is conserved, stepping voltage UP automatically steps current DOWN!',
      hi: 'प्राथमिक कुंडली की प्रत्यावर्ती धारा क्रोड में परिवर्ती चुंबकीय फ्लक्स बनाती है जिससे द्वितीयक में V_s = V_p·(N_s/N_p) प्रेरित होता है। शक्ति संरक्षण के कारण वोल्टता बढ़ने पर धारा उसी अनुपात में घट जाती है!',
    },
    realLife: {
      en: 'Power grids step voltage up to 400 kV for long-distance transmission so current I stays tiny and I²R wire heating losses drop dramatically, then step back down to 220 V for homes.',
      hi: 'विद्युत ग्रिड लंबी दूरी तक बिजली भेजने के लिए वोल्टता 400 kV तक बढ़ाते हैं ताकि I²R ऊष्मा हानि न्यूनतम रहे, फिर घरों के लिए 220 V पर घटाते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'trans-current',
        question: {
          en: 'In a Step-Up transformer (N_p = 400, N_s = 800, V_p = 220 V, I_p = 4 A), does secondary current I_s also double?',
          hi: 'उच्चायी ट्रांसफॉर्मर (N_p = 400, N_s = 800, I_p = 4 A) में क्या द्वितीयक धारा I_s भी दोगुनी हो जाएगी?',
        },
        hint: { en: 'Power conservation requires V_p·I_p = V_s·I_s.', hi: 'शक्ति संरक्षण के लिए V_p·I_p = V_s·I_s होना आवश्यक है।' },
        answer: {
          en: 'NO! Voltage doubles to 440 V, so current cuts in HALF to I_s = 2.0 A to conserve power (880 W)!',
          hi: 'नहीं! वोल्टता दोगुनी (440 V) होने से धारा घटकर आधी (2.0 A) रह जाती है ताकि शक्ति 880 W संरक्षित रहे!',
        },
        targetParams: { Vp: 220, Np: 400, Ns: 800, Ip: 4 },
      },
    ],
    graphTitle: { en: 'Primary V_p (Solid) vs Secondary V_s (Dashed) AC Waveforms', hi: 'प्राथमिक V_p और द्वितीयक V_s प्रत्यावर्ती तरंगें' },
    graphXLabel: 'Phase (rad)',
    graphYLabel: 'Voltage (V)',
  },

  // 17. SNELL'S LAW, PRISM DEVIATION & TOTAL INTERNAL REFLECTION — Ch 24
  {
    id: 'snell-prism-tir',
    chapterId: 'ray-optics',
    supports3D: true,
    shortTabLabel: { en: 'Snell, Prism & TIR', hi: 'स्नेल, प्रिज्म व TIR' },
    title: {
      en: 'Snell’s Law, Critical Angle & Total Internal Reflection',
      hi: 'स्नेल का नियम, क्रांतिक कोण और पूर्ण आंतरिक परावर्तन (TIR)',
    },
    subtitle: {
      en: 'Ray bending across dense-to-rarer boundary with live critical angle i_c = sin⁻¹(n₂/n₁) and prism deviation',
      hi: 'सघन से विरल माध्यम में प्रकाश अपवर्तन, क्रांतिक कोण i_c और पूर्ण आंतरिक परावर्तन',
    },
    formulaDisplay: 'n₁·sin(i) = n₂·sin(r)   |   sin(i_c) = n₂ / n₁',
    secondaryFormulas: [
      { label: { en: 'Prism Minimum Deviation', hi: 'प्रिज्म न्यूनतम विचलन' }, formula: 'n = sin((A+δ_m)/2) / sin(A/2)' },
      { label: { en: 'Speed in Medium', hi: 'माध्यम में चाल' }, formula: 'v = c / n' },
    ],
    variables: [
      { key: 'n1', symbol: 'n₁', label: { en: 'Incident Medium Index', hi: 'आपतन माध्यम अपवर्तनांक (n₁)' }, unit: '', min: 1.0, max: 2.42, step: 0.02, defaultValue: 1.5 },
      { key: 'n2', symbol: 'n₂', label: { en: 'Second Medium Index', hi: 'द्वितीय माध्यम अपवर्तनांक (n₂)' }, unit: '', min: 1.0, max: 2.0, step: 0.02, defaultValue: 1.0 },
      { key: 'iDeg', symbol: 'i', label: { en: 'Angle of Incidence', hi: 'आपतन कोण (i)' }, unit: '°', min: 0, max: 85, step: 1, defaultValue: 35 },
    ],
    presets: [
      { id: 'glass-air', label: { en: 'Glass → Air (Refraction)', hi: 'काँच → वायु (अपवर्तन)' }, params: { n1: 1.5, n2: 1.0, iDeg: 35 } },
      { id: 'glass-tir', label: { en: 'Glass → Air (Full TIR!)', hi: 'काँच → वायु (पूर्ण TIR!)' }, params: { n1: 1.5, n2: 1.0, iDeg: 52 } },
      { id: 'diamond', label: { en: 'Diamond Sparkle (n=2.42)', hi: 'हीरा (i_c = 24.4°)' }, params: { n1: 2.42, n2: 1.0, iDeg: 30 } },
      { id: 'air-water', label: { en: 'Air → Water (Bends In)', hi: 'वायु → जल (अभिलंब की ओर)' }, params: { n1: 1.0, n2: 1.33, iDeg: 45 } },
    ],
    comparePresetB: {
      label: { en: 'Beyond Critical (i = 52°, TIR)', hi: 'क्रांतिक कोण से अधिक (TIR)' },
      params: { n1: 1.5, n2: 1.0, iDeg: 52 },
    },
    explanation: {
      en: 'When light travels from a denser medium (n₁ > n₂) to a rarer one, it bends away from the normal. Once incidence angle i exceeds critical angle i_c = sin⁻¹(n₂/n₁), 100% of the light reflects internally—Total Internal Reflection (TIR).',
      hi: 'जब प्रकाश सघन से विरल माध्यम (n₁ > n₂) में जाता है तो अभिलंब से दूर हटता है। आपतन कोण i क्रांतिक कोण i_c से अधिक होते ही 100% प्रकाश वापस लौट आता है—इसे पूर्ण आंतरिक परावर्तन (TIR) कहते हैं।',
    },
    realLife: {
      en: 'Optical fiber internet cables trap laser pulses over thousands of kilometers via TIR, and diamonds sparkle intensely because their tiny 24.4° critical angle traps light inside.',
      hi: 'ऑप्टिकल फाइबर इंटरनेट केबल, हीरे की चमक और रेगिस्तान की मरीचिका (mirage) पूर्ण आंतरिक परावर्तन पर आधारित हैं।',
    },
    whatIfPrompts: [
      {
        id: 'tir-threshold',
        question: {
          en: 'In Glass (n₁ = 1.50) to Air (n₂ = 1.00), increase incidence angle i past 41.8° to 52°. What happens to the refracted ray?',
          hi: 'काँच (1.50) से वायु (1.00) में आपतन कोण i को 41.8° से बढ़ाकर 52° करें। अपवर्तित किरण का क्या होता है?',
        },
        hint: { en: 'sin(i_c) = 1/1.5 = 0.667 gives i_c = 41.8°.', hi: 'sin(i_c) = 1/1.5 से क्रांतिक कोण 41.8° आता है।' },
        answer: {
          en: 'The refracted ray vanishes completely and 100% of the beam reflects back into the glass at 52° (Total Internal Reflection)!',
          hi: 'अपवर्तित किरण पूरी तरह गायब हो जाती है और 100% प्रकाश 52° पर काँच के भीतर ही परावर्तित हो जाता है (TIR)!',
        },
        targetParams: { n1: 1.5, n2: 1.0, iDeg: 52 },
      },
    ],
    graphTitle: { en: 'Refraction Angle r vs Incidence Angle i (Cutoff at i_c)', hi: 'अपवर्तन कोण r बनाम आपतन कोण i' },
    graphXLabel: 'Incidence i (°)',
    graphYLabel: 'Refraction r (°)',
  },

  // 18. COMPOUND MICROSCOPE & ASTRONOMICAL TELESCOPE — Ch 24
  {
    id: 'microscope-telescope',
    chapterId: 'ray-optics',
    supports3D: true,
    shortTabLabel: { en: 'Microscope & Telescope', hi: 'सूक्ष्मदर्शी व दूरदर्शी' },
    title: {
      en: 'Compound Microscope & Astronomical Telescope',
      hi: 'संयुक्त सूक्ष्मदर्शी और खगोलीय दूरदर्शी',
    },
    subtitle: {
      en: 'Two-lens optical tube ray trace showing angular magnification M and tube length L',
      hi: 'द्वि-लेंस प्रकाशिक यंत्र: कोणीय आवर्धन M और नली की लंबाई L',
    },
    formulaDisplay: 'M_mic = (L / f_o)·(1 + D / f_e)   |   M_tel = f_o / f_e',
    secondaryFormulas: [
      { label: { en: 'Telescope Tube Length', hi: 'दूरदर्शी नली लंबाई' }, formula: 'L_tel = f_o + f_e' },
      { label: { en: 'Least Distance of Vision', hi: 'स्पष्ट दृष्टि की न्यूनतम दूरी' }, formula: 'D = 25 cm' },
    ],
    variables: [
      { key: 'mode', symbol: 'mode', label: { en: 'Instrument (0=Microscope, 1=Telescope)', hi: 'यंत्र (0=सूक्ष्मदर्शी, 1=दूरदर्शी)' }, unit: '', min: 0, max: 1, step: 1, defaultValue: 0 },
      { key: 'fo', symbol: 'f_o', label: { en: 'Objective Focal Length', hi: 'अभिदृश्यक फोकस दूरी (f_o)' }, unit: 'cm', min: 0.5, max: 100, step: 0.5, defaultValue: 2.0 },
      { key: 'fe', symbol: 'f_e', label: { en: 'Eyepiece Focal Length', hi: 'नेत्रिका फोकस दूरी (f_e)' }, unit: 'cm', min: 1, max: 15, step: 0.5, defaultValue: 5.0 },
      { key: 'L', symbol: 'L', label: { en: 'Microscope Tube Length', hi: 'नली लंबाई (L)' }, unit: 'cm', min: 10, max: 30, step: 1, defaultValue: 20 },
    ],
    presets: [
      { id: 'bio-microscope', label: { en: 'Bio Microscope (f_o=2, f_e=5)', hi: 'सूक्ष्मदर्शी (f_o=2, f_e=5)' }, params: { mode: 0, fo: 2.0, fe: 5.0, L: 20 } },
      { id: 'high-microscope', label: { en: 'High-Power Microscope', hi: 'उच्च आवर्धन सूक्ष्मदर्शी' }, params: { mode: 0, fo: 1.0, fe: 2.5, L: 20 } },
      { id: 'telescope', label: { en: 'Astronomical Telescope', hi: 'खगोलीय दूरदर्शी' }, params: { mode: 1, fo: 80, fe: 4.0, L: 20 } },
    ],
    comparePresetB: {
      label: { en: 'Astronomical Telescope', hi: 'खगोलीय दूरदर्शी' },
      params: { mode: 1, fo: 80, fe: 4.0, L: 20 },
    },
    explanation: {
      en: 'A compound microscope needs a SHORT objective focal length f_o for high magnification M ≈ (L/f_o)(1+D/f_e), whereas an astronomical telescope needs a LONG, wide objective f_o (M = f_o/f_e) to collect starlight and maximize angular magnification.',
      hi: 'संयुक्त सूक्ष्मदर्शी में उच्च आवर्धन के लिए अभिदृश्यक f_o छोटा होता है, जबकि खगोलीय दूरदर्शी में दूर के तारों से अधिक प्रकाश व बड़ा आवर्धन M = f_o/f_e पाने के लिए f_o बड़ा रखा जाता है।',
    },
    realLife: {
      en: 'Pathology lab microscopes magnify blood cells 400×–1000×, while refracting telescopes resolve Jupiter’s moons and Saturn’s rings.',
      hi: 'चिकित्सा प्रयोगशाला के सूक्ष्मदर्शी कोशिकाओं को 400× तक बड़ा दिखाते हैं और दूरदर्शी से बृहस्पति के चंद्रमा व शनि के वलय देखे जाते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'opt-telescope',
        question: {
          en: 'Switch to Telescope mode with f_o = 80 cm and f_e = 4 cm. What are its angular magnification and total tube length?',
          hi: 'दूरदर्शी मोड में f_o = 80 cm और f_e = 4 cm रखें। कोणीय आवर्धन और नली की कुल लंबाई क्या होगी?',
        },
        hint: { en: 'M = f_o/f_e and L = f_o + f_e in normal adjustment.', hi: 'सामान्य समायोजन में M = f_o/f_e और L = f_o + f_e होता है।' },
        answer: {
          en: 'Magnification M = 80/4 = 20×, and total tube length L = 80 + 4 = 84 cm!',
          hi: 'आवर्धन M = 20× और नली की कुल लंबाई L = 84 cm प्राप्त होती है!',
        },
        targetParams: { mode: 1, fo: 80, fe: 4.0, L: 20 },
      },
    ],
    graphTitle: { en: 'Angular Magnification M vs Eyepiece Focal Length f_e', hi: 'कोणीय आवर्धन M बनाम नेत्रिका f_e' },
    graphXLabel: 'f_e (cm)',
    graphYLabel: 'Magnification (×)',
  },

  // 19. SINGLE-SLIT DIFFRACTION & MALUS'S POLARIZATION LAW — Ch 25
  {
    id: 'diffraction-polarization',
    chapterId: 'wave-optics',
    shortTabLabel: { en: 'Diffraction & Polarization', hi: 'विवर्तन व ध्रुवण' },
    title: {
      en: 'Single-Slit Diffraction & Malus’s Law of Polarization',
      hi: 'एकल झिरी विवर्तन और मैलस का ध्रुवण नियम',
    },
    subtitle: {
      en: 'Central bright diffraction width W = 2λD/a and analyzer intensity I = I₀·cos²θ',
      hi: 'केंद्रीय उच्चिष्ठ की चौड़ाई W = 2λD/a और विश्लेषक तीव्रता I = I₀·cos²θ',
    },
    formulaDisplay: 'a·sin(θ) = m·λ   |   W_0 = 2λD / a   |   I = I₀·cos²(φ)',
    secondaryFormulas: [
      { label: { en: 'Brewster’s Law', hi: 'ब्रूस्टर का नियम' }, formula: 'tan(i_p) = n' },
      { label: { en: 'Diffraction Intensity', hi: 'विवर्तन तीव्रता' }, formula: 'I(θ) = I₀·(sinβ / β)²' },
    ],
    variables: [
      { key: 'lambda', symbol: 'λ', label: { en: 'Wavelength', hi: 'तरंगदैर्घ्य (λ)' }, unit: 'nm', min: 400, max: 700, step: 10, defaultValue: 550 },
      { key: 'a', symbol: 'a', label: { en: 'Slit Width', hi: 'झिरी की चौड़ाई (a)' }, unit: 'mm', min: 0.1, max: 1.0, step: 0.05, defaultValue: 0.3 },
      { key: 'D', symbol: 'D', label: { en: 'Screen Distance', hi: 'पर्दे की दूरी (D)' }, unit: 'm', min: 0.5, max: 3.0, step: 0.1, defaultValue: 1.5 },
      { key: 'phi', symbol: 'φ', label: { en: 'Polarizer-Analyzer Angle', hi: 'ध्रुवक-विश्लेषक कोण (φ)' }, unit: '°', min: 0, max: 90, step: 5, defaultValue: 45 },
    ],
    presets: [
      { id: 'narrow-slit', label: { en: 'Narrow Slit (Wide Central Peak)', hi: 'पतली झिरी (चौड़ा केंद्र)' }, params: { lambda: 600, a: 0.15, D: 1.5, phi: 0 } },
      { id: 'crossed-pol', label: { en: 'Crossed Polarizers (φ = 90°)', hi: 'क्रॉस्ड ध्रुवक (φ = 90°)' }, params: { lambda: 550, a: 0.3, D: 1.5, phi: 90 } },
      { id: 'half-int', label: { en: 'Malus Half Intensity (45°)', hi: 'आधी तीव्रता (φ = 45°)' }, params: { lambda: 550, a: 0.3, D: 1.5, phi: 45 } },
    ],
    comparePresetB: {
      label: { en: 'Half Slit Width (a = 0.15 mm)', hi: 'आधी झिरी चौड़ाई (0.15 mm)' },
      params: { lambda: 550, a: 0.15, D: 1.5, phi: 45 },
    },
    explanation: {
      en: 'Counter-intuitively, making a single slit NARROWER makes the central bright diffraction maximum WIDER (W₀ = 2λD/a). Meanwhile, rotating an analyzer polarizer to angle φ transmits I = I₀·cos²φ, proving light is a transverse wave.',
      hi: 'झिरी की चौड़ाई a जितनी कम की जाती है, केंद्रीय दीप्त फ्रिंज उतनी ही अधिक चौड़ी (W₀ = 2λD/a) होती जाती है। विश्लेषक को कोण φ घुमाने पर तीव्रता I = I₀·cos²φ रहती है, जो प्रकाश की अनुप्रस्थ प्रकृति सिद्ध करती है।',
    },
    realLife: {
      en: 'Polarized sunglasses block horizontal road glare at Brewster’s angle, and LCD screens modulate every pixel brightness using crossed polarizers.',
      hi: 'पोलराइज़्ड धूप के चश्मे सड़क की चकाचौंध रोकते हैं और LCD स्क्रीन क्रॉस्ड ध्रुवकों द्वारा चित्र की चमक नियंत्रित करती हैं।',
    },
    whatIfPrompts: [
      {
        id: 'diff-narrow',
        question: {
          en: 'Cut slit width a in half (0.30 mm → 0.15 mm). Does the central bright band shrink or double in width?',
          hi: 'झिरी की चौड़ाई a आधी (0.30 → 0.15 mm) करने पर केंद्रीय दीप्त पट्टी सिकुड़ती है या दोगुनी चौड़ी होती है?',
        },
        hint: { en: 'W₀ = 2λD / a is INVERSELY proportional to a!', hi: 'W₀ = 2λD / a में a हर (denominator) में है!' },
        answer: {
          en: 'It DOUBLES in width (from 5.5 mm to 11.0 mm) because tighter confinement forces the wave to spread out more sharply!',
          hi: 'यह दोगुनी चौड़ी (5.5 mm से 11.0 mm) हो जाती है क्योंकि संकीर्ण छिद्र से तरंग अधिक फैलती है!',
        },
        targetParams: { lambda: 550, a: 0.15, D: 1.5, phi: 45 },
      },
    ],
    graphTitle: { en: 'Single-Slit Diffraction Intensity Profile I(θ)/I₀', hi: 'एकल झिरी विवर्तन तीव्रता ग्राफ I(θ)/I₀' },
    graphXLabel: 'Position y (mm)',
    graphYLabel: 'Relative I / I₀',
  },

  // 20. DE BROGLIE MATTER WAVE — Ch 26
  {
    id: 'de-broglie',
    chapterId: 'dual-nature',
    shortTabLabel: { en: 'de Broglie Matter Wave', hi: 'डी-ब्रॉग्ली द्रव्य तरंग' },
    title: {
      en: 'de Broglie Wavelength & Electron Matter Waves',
      hi: 'डी-ब्रॉग्ली तरंगदैर्घ्य और इलेक्ट्रॉन द्रव्य तरंगें',
    },
    subtitle: {
      en: 'Accelerating voltage V shrinks electron matter wavelength λ = 1.227 / √V nm',
      hi: 'त्वरक विभव V बढ़ाने पर इलेक्ट्रॉन की द्रव्य तरंगदैर्घ्य λ = 1.227 / √V nm में कमी',
    },
    formulaDisplay: 'λ = h / p = h / √(2·m·q·V) = 1.227 / √V  nm',
    secondaryFormulas: [
      { label: { en: 'Electron Momentum', hi: 'इलेक्ट्रॉन संवेग' }, formula: 'p = √(2·m_e·e·V)' },
      { label: { en: 'Kinetic Energy', hi: 'गतिज ऊर्जा' }, formula: 'K = e·V = p² / (2m)' },
    ],
    variables: [
      { key: 'V', symbol: 'V', label: { en: 'Accelerating Voltage', hi: 'त्वरक विभव (V)' }, unit: 'V', min: 10, max: 1000, step: 10, defaultValue: 54 },
      { key: 'massRatio', symbol: 'm/m_e', label: { en: 'Particle Mass (1=e⁻, 1836=p⁺)', hi: 'कण द्रव्यमान गुणांक' }, unit: 'm_e', min: 1, max: 20, step: 1, defaultValue: 1 },
    ],
    presets: [
      { id: 'davisson', label: { en: 'Davisson-Germer (54 V)', hi: 'डेविसन-जर्मर प्रयोग (54 V)' }, params: { V: 54, massRatio: 1 } },
      { id: '100v', label: { en: '100 V Electron (0.123 nm)', hi: '100 V इलेक्ट्रॉन' }, params: { V: 100, massRatio: 1 } },
      { id: '1000v', label: { en: '1000 V Microscope Beam', hi: '1000 V इलेक्ट्रॉन सूक्ष्मदर्शी' }, params: { V: 1000, massRatio: 1 } },
    ],
    comparePresetB: {
      label: { en: '4× Voltage (216 V → ½λ)', hi: '4× विभव (216 V → ½λ)' },
      params: { V: 216, massRatio: 1 },
    },
    explanation: {
      en: 'Louis de Broglie proposed that every moving particle exhibits a wave with λ = h/p. For an electron accelerated through V = 54 V, λ = 0.167 nm—matching atomic crystal spacing, which Davisson & Germer confirmed by diffracting electrons off nickel!',
      hi: 'डी-ब्रॉग्ली के अनुसार प्रत्येक गतिमान कण के साथ तरंगदैर्घ्य λ = h/p जुड़ी होती है। V = 54 V पर त्वरित इलेक्ट्रॉन की λ = 0.167 nm आती है जिसे डेविसन-जर्मर ने निकल क्रिस्टल से विवर्तन द्वारा सिद्ध किया!',
    },
    realLife: {
      en: 'Transmission Electron Microscopes accelerate electrons to 100 kV+ so λ shrinks to picometers, letting scientists image individual atoms and viruses.',
      hi: 'इलेक्ट्रॉन सूक्ष्मदर्शी उच्च विभव से इलेक्ट्रॉन की तरंगदैर्घ्य अत्यंत छोटी कर देते हैं जिससे वायरस और परमाणु तक स्पष्ट दिखते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'db-4x-v',
        question: {
          en: 'Quadruple the accelerating voltage V from 54 V to 216 V. What happens to the de Broglie wavelength λ?',
          hi: 'त्वरक विभव V को 54 V से 4 गुना (216 V) करने पर डी-ब्रॉग्ली तरंगदैर्घ्य λ का क्या होगा?',
        },
        hint: { en: 'λ ∝ 1 / √V, so √4 = 2 in the denominator.', hi: 'λ ∝ 1/√V में √4 = 2 आता है।' },
        answer: {
          en: 'Wavelength cuts exactly in HALF (from 0.167 nm down to 0.0835 nm) as crests pack twice as tightly!',
          hi: 'तरंगदैर्घ्य ठीक आधी (0.167 nm से 0.0835 nm) रह जाती है!',
        },
        targetParams: { V: 216, massRatio: 1 },
      },
    ],
    graphTitle: { en: 'de Broglie Wavelength λ (nm) vs Accelerating Voltage V', hi: 'डी-ब्रॉग्ली तरंगदैर्घ्य λ बनाम विभव V' },
    graphXLabel: 'Voltage V (V)',
    graphYLabel: 'λ (nm)',
  },

  // 21. MASS-ENERGY EQUIVALENCE & BINDING ENERGY — Ch 28
  {
    id: 'binding-energy',
    chapterId: 'nuclei',
    shortTabLabel: { en: 'Mass-Energy & Binding', hi: 'द्रव्यमान-ऊर्जा व बंधन ऊर्जा' },
    title: {
      en: 'Mass-Energy Equivalence & Nuclear Binding Energy Curve',
      hi: 'द्रव्यमान-ऊर्जा तुल्यता और नाभिकीय बंधन ऊर्जा वक्र',
    },
    subtitle: {
      en: 'Einstein’s E = Δm·c², mass defect (1 u = 931.5 MeV), and Fusion vs Fission along the BE/A curve',
      hi: 'आइंस्टीन समीकरण E = Δm·c², द्रव्यमान क्षति (1 u = 931.5 MeV), संलयन और विखंडन',
    },
    formulaDisplay: 'E = Δm · c² = Δm(u) × 931.5 MeV   |   BE/A = E_b / A',
    secondaryFormulas: [
      { label: { en: 'Mass Defect', hi: 'द्रव्यमान क्षति' }, formula: 'Δm = Z·m_p + (A−Z)·m_n − M_nuc' },
      { label: { en: 'Nuclear Radius', hi: 'नाभिकीय त्रिज्या' }, formula: 'R = R₀ · A^(1/3)  (R₀ = 1.2 fm)' },
    ],
    variables: [
      { key: 'A', symbol: 'A', label: { en: 'Mass Number (Nucleons)', hi: 'द्रव्यमान संख्या (A)' }, unit: '', min: 2, max: 238, step: 2, defaultValue: 56 },
      { key: 'dm', symbol: 'Δm', label: { en: 'Reaction Mass Defect', hi: 'अभिक्रिया द्रव्यमान क्षति (Δm)' }, unit: 'u', min: 0.01, max: 0.5, step: 0.01, defaultValue: 0.21 },
    ],
    presets: [
      { id: 'iron-56', label: { en: 'Iron-56 (Peak Stability)', hi: 'लोहा Fe-56 (अधिकतम स्थायित्व)' }, params: { A: 56, dm: 0.5 } },
      { id: 'fusion-he', label: { en: 'Solar Fusion (A = 4)', hi: 'सौर संलयन (He-4)' }, params: { A: 4, dm: 0.03 } },
      { id: 'fission-u', label: { en: 'Uranium-236 Fission', hi: 'यूरेनियम-236 विखंडन' }, params: { A: 236, dm: 0.21 } },
    ],
    comparePresetB: {
      label: { en: 'Uranium-236 (Fission Zone)', hi: 'यूरेनियम-236 (विखंडन क्षेत्र)' },
      params: { A: 236, dm: 0.21 },
    },
    explanation: {
      en: 'A bound nucleus weighs slightly less than its separate protons and neutrons; this mass defect Δm converts into Binding Energy E = Δm·c² (1 u = 931.5 MeV). Light nuclei release energy by FUSION and heavy nuclei (A > 170) release energy by FISSION because both climb toward the Iron-56 stability peak (8.75 MeV/nucleon)!',
      hi: 'नाभिक का द्रव्यमान उसके अलग-अलग न्यूक्लिऑनों के कुल द्रव्यमान से कम होता है; यह क्षति Δm बंधन ऊर्जा E = Δm·c² में बदलती है। हल्के नाभिक संलयन से और भारी नाभिक विखंडन से Fe-56 के शिखर (8.75 MeV/न्यूक्लिऑन) की ओर बढ़कर अपार ऊर्जा मुक्त करते हैं!',
    },
    realLife: {
      en: 'Splitting just 1 Uranium-235 nucleus converts Δm ≈ 0.21 u into ~200 MeV—millions of times more energy per atom than burning coal or petrol.',
      hi: 'केवल एक यूरेनियम-235 नाभिक के विखंडन से Δm ≈ 0.21 u लगभग 200 MeV ऊर्जा देता है, जो रासायनिक ईंधन से लाखों गुना अधिक है।',
    },
    whatIfPrompts: [
      {
        id: 'be-fission',
        question: {
          en: 'Compare BE/A of Uranium (A = 236, ~7.6 MeV) vs Iron-56 (A = 56, ~8.75 MeV). Why does splitting Uranium release ~200 MeV?',
          hi: 'यूरेनियम (A=236, ~7.6 MeV) और Fe-56 (~8.75 MeV) के BE/A की तुलना करें। यूरेनियम टूटने पर ~200 MeV ऊर्जा क्यों निकलती है?',
        },
        hint: { en: 'Daughter fragments sit near A ≈ 100–140 with ~0.85 MeV/nucleon HIGHER binding energy.', hi: 'खंडों की प्रति न्यूक्लिऑन बंधन ऊर्जा ~0.85 MeV अधिक होती है; 236 × 0.85 ≈ 200 MeV।' },
        answer: {
          en: '236 nucleons each gain ~0.85 MeV of tighter binding (Δm ≈ 0.21 u × 931.5 = 196 MeV), releasing massive kinetic & gamma energy!',
          hi: '236 न्यूक्लिऑनों में से प्रत्येक की बंधन ऊर्जा ~0.85 MeV बढ़ती है जिससे लगभग 200 MeV ऊर्जा मुक्त होती है!',
        },
        targetParams: { A: 236, dm: 0.21 },
      },
    ],
    graphTitle: { en: 'Binding Energy per Nucleon (BE / A) vs Mass Number A', hi: 'प्रति न्यूक्लिऑन बंधन ऊर्जा (BE / A) बनाम A' },
    graphXLabel: 'Mass Number A',
    graphYLabel: 'BE / A (MeV)',
  },

  // 22. LOGIC GATES LIVE CIRCUIT SIMULATOR — Ch 29
  {
    id: 'logic-gates',
    chapterId: 'semiconductors',
    shortTabLabel: { en: 'Logic Gates (Digital)', hi: 'लॉजिक गेट (Digital)' },
    title: {
      en: 'Digital Logic Gates & Live Truth Table',
      hi: 'डिजिटल लॉजिक गेट और सजीव सत्य सारणी (Truth Table)',
    },
    subtitle: {
      en: 'Interactive AND, OR, NOT, NAND, NOR, and XOR gate circuit with real-time binary signal flow',
      hi: 'AND, OR, NOT, NAND, NOR तथा XOR गेट का सजीव परिपथ और बाइनरी सत्य सारणी',
    },
    formulaDisplay: 'AND: A·B  |  OR: A+B  |  NOT: Ā  |  NAND: (A·B)′  |  NOR: (A+B)′  |  XOR: A⊕B',
    secondaryFormulas: [
      { label: { en: 'De Morgan’s Law 1', hi: 'डी-मॉर्गन नियम 1' }, formula: '(A · B)′ = A′ + B′' },
      { label: { en: 'Universal Gates', hi: 'सार्वत्रिक गेट' }, formula: 'NAND and NOR build any circuit' },
    ],
    variables: [
      { key: 'gate', symbol: 'Gate', label: { en: 'Gate Type (0:AND 1:OR 2:NOT 3:NAND 4:NOR 5:XOR)', hi: 'गेट प्रकार (0:AND 1:OR 2:NOT 3:NAND 4:NOR 5:XOR)' }, unit: '', min: 0, max: 5, step: 1, defaultValue: 3 },
      { key: 'A', symbol: 'A', label: { en: 'Input A (0=LOW, 1=HIGH)', hi: 'इनपुट A (0 या 1)' }, unit: 'bit', min: 0, max: 1, step: 1, defaultValue: 1 },
      { key: 'B', symbol: 'B', label: { en: 'Input B (0=LOW, 1=HIGH)', hi: 'इनपुट B (0 या 1)' }, unit: 'bit', min: 0, max: 1, step: 1, defaultValue: 0 },
    ],
    presets: [
      { id: 'and-gate', label: { en: 'AND Gate (A=1, B=1)', hi: 'AND गेट (1, 1)' }, params: { gate: 0, A: 1, B: 1 } },
      { id: 'nand-univ', label: { en: 'NAND Gate (Universal)', hi: 'NAND गेट (सार्वत्रिक)' }, params: { gate: 3, A: 1, B: 1 } },
      { id: 'nor-univ', label: { en: 'NOR Gate (A=0, B=0)', hi: 'NOR गेट (0, 0)' }, params: { gate: 4, A: 0, B: 0 } },
      { id: 'xor-gate', label: { en: 'XOR Gate (A=1, B=0)', hi: 'XOR गेट (1, 0)' }, params: { gate: 5, A: 1, B: 0 } },
    ],
    comparePresetB: {
      label: { en: 'Both HIGH (A = 1, B = 1)', hi: 'दोनों HIGH (A = 1, B = 1)' },
      params: { gate: 3, A: 1, B: 1 },
    },
    explanation: {
      en: 'Logic gates are transistor switches implementing Boolean algebra (0 = 0 V, 1 = +5 V). NAND and NOR are Universal Gates because combining them builds NOT, AND, OR, and complete computer processors.',
      hi: 'लॉजिक गेट ट्रांजिस्टर स्विच होते हैं जो बूलियन बीजगणित (0 = निम्न, 1 = उच्च) पर कार्य करते हैं। NAND और NOR सार्वत्रिक गेट हैं क्योंकि इनसे कोई भी अन्य डिजिटल परिपथ बनाया जा सकता है।',
    },
    realLife: {
      en: 'Every smartphone CPU and memory chip packs billions of microscopic NAND, NOR, and XOR transistor gates performing binary arithmetic at billions of cycles per second.',
      hi: 'हर स्मार्टफोन प्रोसेसर और कंप्यूटर चिप में अरबों सूक्ष्म NAND, NOR और XOR लॉजिक गेट प्रति सेकंड अरबों बाइनरी गणनाएँ करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'gate-nand-zero',
        question: {
          en: 'On a NAND gate (Gate = 3), set BOTH inputs A = 1 and B = 1. Why does the output lamp turn OFF (Y = 0)?',
          hi: 'NAND गेट (Gate = 3) में दोनों इनपुट A = 1 और B = 1 करें। आउटपुट लैंप बंद (Y = 0) क्यों हो जाता है?',
        },
        hint: { en: 'NAND = NOT(AND). Since 1 AND 1 = 1, inverting it yields 0.', hi: 'NAND = NOT(AND); 1 AND 1 = 1 का व्युत्क्रम 0 होता है।' },
        answer: {
          en: 'NAND outputs HIGH (1) for every input pair EXCEPT A = 1, B = 1, where it drops to LOW (0)!',
          hi: 'NAND गेट केवल A = 1, B = 1 पर ही 0 देता है; अन्य सभी अवस्थाओं में आउटपुट 1 रहता है!',
        },
        targetParams: { gate: 3, A: 1, B: 1 },
      },
    ],
    graphTitle: { en: 'Digital Timing Waveform: Output Y across All 4 Input States', hi: 'डिजिटल समय तरंग: चारों अवस्थाओं में आउटपुट Y' },
    graphXLabel: 'State (00,01,10,11)',
    graphYLabel: 'Logic Output Y',
  },
];
