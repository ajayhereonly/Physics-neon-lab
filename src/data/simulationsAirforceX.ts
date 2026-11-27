import { PhysicsSimulation } from '../types/physics';

/**
 * 7 Dedicated Indian Air Force X Group (Agniveer Vayu Science) High-Yield Live Simulations:
 * 1. Communication Systems (AM/FM Modulation, Antenna Height & LOS Range) — Chapter 30
 * 2. BJT CE Transistor Amplifier, Zener Regulator & Rectifiers — Chapter 29
 * 3. Variation of g with Altitude, Depth & Earth Rotation — Chapter 08
 * 4. Blackbody Radiation (Wien's & Stefan-Boltzmann Laws) & Newton's Cooling — Chapter 11
 * 5. Organ Pipes (Open vs Closed Harmonics) & Acoustic Beats — Chapter 15
 * 6. Potentiometer Null Balance & Series/Parallel Cell Grouping — Chapter 18
 * 7. Human Eye Optical Defects (Myopia / Hypermetropia & Lens Power) — Chapter 24
 */
export const AIRFORCE_X_SIMULATIONS: PhysicsSimulation[] = [
  {
    id: 'communication-systems',
    chapterId: 'communication-systems',
    isAirforceX: true,
    supports3D: true,
    default3D: true,
    shortTabLabel: { en: 'AM/FM & LOS Antenna', hi: 'AM/FM व एंटीना परास' },
    title: {
      en: 'Communication Systems: AM Modulation & Line-of-Sight Range',
      hi: 'संचार व्यवस्था: आयाम मॉडुलन (AM) व एंटीना परास (Airforce X)',
    },
    subtitle: {
      en: 'Visualize AM modulation index m_a = A_m/A_c, transmitted power, λ/4 antenna height, and radio horizon d = √(2Rh).',
      hi: 'AM मॉडुलन सूचकांक m_a = A_m/A_c, प्रेषित शक्ति, λ/4 एंटीना ऊँचाई व क्षितिज परास d = √(2Rh) का सजीव अध्ययन।',
    },
    formulaDisplay: 'm_a = A_m / A_c   |   P_t = P_c·(1 + m_a²/2)   |   d = √(2·R·h_T) + √(2·R·h_R)',
    secondaryFormulas: [
      { label: { en: 'AM Bandwidth', hi: 'AM बैंडचौड़ाई' }, formula: 'BW = 2 · f_m   (USB = f_c + f_m, LSB = f_c − f_m)' },
      { label: { en: 'Minimum Antenna Height', hi: 'न्यूनतम एंटीना ऊँचाई' }, formula: 'h_min = λ / 4 = c / (4·f_c)' },
      { label: { en: 'Area Covered by TV Tower', hi: 'टीवी टावर क्षेत्रफल' }, formula: 'A = π·d² = 2·π·R·h_T   (R = 6400 km)' },
    ],
    variables: [
      { key: 'ma', symbol: 'm_a', label: { en: 'Modulation Index', hi: 'मॉडुलन सूचकांक' }, unit: '', min: 0, max: 1.4, step: 0.05, defaultValue: 0.6 },
      { key: 'fm', symbol: 'f_m', label: { en: 'Message Freq', hi: 'संदेश आवृत्ति' }, unit: 'kHz', min: 1, max: 20, step: 1, defaultValue: 5 },
      { key: 'hT', symbol: 'h_T', label: { en: 'Transmitter Tower', hi: 'प्रेषी टावर ऊँचाई' }, unit: 'm', min: 20, max: 500, step: 10, defaultValue: 160 },
      { key: 'hR', symbol: 'h_R', label: { en: 'Receiver Height', hi: 'अभिग्राही ऊँचाई' }, unit: 'm', min: 0, max: 200, step: 10, defaultValue: 40 },
    ],
    presets: [
      { id: 'clean-am', label: { en: 'Clean AM (m_a = 0.5)', hi: 'स्पष्ट AM (0.5)' }, params: { ma: 0.5, fm: 5, hT: 160, hR: 40 } },
      { id: 'full-am', label: { en: '100% Modulated (m_a = 1.0)', hi: '100% मॉडुलन (1.0)' }, params: { ma: 1.0, fm: 10, hT: 200, hR: 50 } },
      { id: 'overmod', label: { en: 'Over-Modulation Distortion', hi: 'अति-मॉडुलन विकृति' }, params: { ma: 1.3, fm: 5, hT: 160, hR: 40 } },
    ],
    explanation: {
      en: 'Modulation mounts a low-frequency audio signal onto a high-frequency carrier so antennas stay practical (h = λ/4) and signals avoid mixing. Keep m_a ≤ 1 to avoid distortion; line-of-sight range scales with √h_T.',
      hi: 'मॉडुलन द्वारा निम्न आवृत्ति संदेश को उच्च आवृत्ति वाहक तरंग पर अध्यारोपित किया जाता है ताकि एंटीना छोटा (λ/4) रहे। विकृति रोकने हेतु m_a ≤ 1 रखा जाता है।',
    },
    realLife: {
      en: 'A 160 m TV tower on Earth (R = 6400 km) reaches d_T = √(2×6.4×10⁶×160) ≈ 45.3 km in every direction!',
      hi: 'पृथ्वी पर 160 m ऊँचा टीवी टावर चारों ओर लगभग 45.3 km दूरी तक सीधा प्रसारण करता है!',
    },
    whatIfPrompts: [
      {
        id: 'comm-1',
        question: { en: 'If modulation index m_a = 1 (100% AM), what fraction of total power is in sidebands?', hi: 'm_a = 1 होने पर कुल शक्ति का कितना भाग साइडबैंड में होता है?' },
        hint: { en: 'Use P_t = P_c(1 + m_a²/2) = 1.5 P_c.', hi: 'P_t = P_c(1 + m_a²/2) लागू करें।' },
        answer: { en: 'Sideband power is 0.5 P_c out of 1.5 P_c — exactly 1/3 (33.3%) of total transmitted power!', hi: 'साइडबैंड शक्ति कुल शक्ति का ठीक 1/3 (33.3%) होती है!' },
        targetParams: { ma: 1.0, fm: 5, hT: 160, hR: 40 },
      },
      {
        id: 'comm-2',
        question: { en: 'To double a TV tower’s coverage distance d, by what factor must tower height h_T increase?', hi: 'टीवी टावर की परास d दोगुनी करने के लिए ऊँचाई h_T कितनी गुनी करनी होगी?' },
        hint: { en: 'd = √(2Rh) ⇒ h ∝ d².', hi: 'd = √(2Rh) ⇒ h ∝ d²।' },
        answer: { en: 'Height must be quadrupled (4×) to double distance, while coverage area A = 2πRh increases linearly with h!', hi: 'परास दोगुनी करने हेतु ऊँचाई 4 गुनी करनी होगी!' },
        targetParams: { ma: 0.6, fm: 5, hT: 320, hR: 0 },
      },
    ],
    graphTitle: { en: 'Radio Horizon Range d_T = √(2·R·h_T) vs Tower Height h_T', hi: 'टावर ऊँचाई h_T के साथ रेडियो क्षितिज परास d_T' },
    graphXLabel: 'Tower Height h_T (m)',
    graphYLabel: 'Range d_T (km)',
  },

  {
    id: 'transistor-zener',
    chapterId: 'semiconductors',
    isAirforceX: true,
    shortTabLabel: { en: 'Transistor & Zener (X)', hi: 'ट्रांजिस्टर व ज़ेनर (X)' },
    title: {
      en: 'BJT CE Transistor Amplifier (α, β) & Zener Voltage Regulator',
      hi: 'BJT CE ट्रांजिस्टर प्रवर्धक (α, β) व ज़ेनर वोल्टेज रेगुलेटर',
    },
    subtitle: {
      en: 'Inspect current gain β = α/(1−α), voltage gain A_v, power gain A_p, and Zener load regulation live.',
      hi: 'धारा लाभ β = α/(1−α), वोल्टेज लाभ A_v, शक्ति लाभ A_p व ज़ेनर वोल्टेज स्थिरीकरण देखें।',
    },
    formulaDisplay: 'β = I_C / I_B = α / (1 − α)   |   A_v = β·(R_L / R_in)   |   A_p = β²·(R_L / R_in)',
    secondaryFormulas: [
      { label: { en: 'Emitter Current Law', hi: 'उत्सर्जक धारा नियम' }, formula: 'I_E = I_B + I_C   |   α = β / (1 + β)' },
      { label: { en: 'CE Phase Inversion', hi: 'CE कला व्युत्क्रमण' }, formula: 'Output AC is 180° out of phase with Input AC' },
      { label: { en: 'Zener Regulator Law', hi: 'ज़ेनर रेगुलेटर नियम' }, formula: 'V_out = V_Z (Reverse Breakdown), I_S = I_Z + I_L' },
    ],
    variables: [
      { key: 'beta', symbol: 'β', label: { en: 'Current Gain (β)', hi: 'धारा लाभ (β)' }, unit: '', min: 20, max: 200, step: 5, defaultValue: 100 },
      { key: 'Ib', symbol: 'I_B', label: { en: 'Base Current', hi: 'आधार धारा' }, unit: 'μA', min: 10, max: 120, step: 5, defaultValue: 40 },
      { key: 'RL', symbol: 'R_L', label: { en: 'Load Resistance', hi: 'लोड प्रतिरोध' }, unit: 'kΩ', min: 1, max: 10, step: 0.5, defaultValue: 4 },
      { key: 'Rin', symbol: 'R_in', label: { en: 'Input Resistance', hi: 'निवेशी प्रतिरोध' }, unit: 'kΩ', min: 0.5, max: 4, step: 0.25, defaultValue: 1 },
    ],
    presets: [
      { id: 'std-ce', label: { en: 'Standard CE (β = 100)', hi: 'मानक CE (β = 100)' }, params: { beta: 100, Ib: 40, RL: 4, Rin: 1 } },
      { id: 'high-gain', label: { en: 'High-Gain Audio Amp (β = 180)', hi: 'उच्च लाभ प्रवर्धक' }, params: { beta: 180, Ib: 25, RL: 8, Rin: 1 } },
      { id: 'iaf-pyq', label: { en: 'IAF PYQ Case (β = 49 → α = 0.98)', hi: 'IAF PYQ (β = 49)' }, params: { beta: 50, Ib: 50, RL: 5, Rin: 1 } },
    ],
    explanation: {
      en: 'In a Common-Emitter (CE) NPN transistor, a tiny micro-ampere base current I_B controls a large milli-ampere collector current I_C = β·I_B, producing a 180° inverted, amplified output wave. A reverse-biased Zener diode clamps output voltage strictly to V_Z.',
      hi: 'उभयनिष्ठ-उत्सर्जक (CE) ट्रांजिस्टर में सूक्ष्म आधार धारा I_B बड़ी संग्राहक धारा I_C = βI_B को नियंत्रित करती है तथा निर्गत तरंग 180° विपरीत कला में होती है।',
    },
    realLife: {
      en: 'Audio amplifiers, radio receivers, and smartphone voltage stabilizers rely on BJT gain and Zener breakdown regulation.',
      hi: 'ऑडियो एम्पलीफायर, रेडियो रिसीवर और पावर सप्लाई स्टेबलाइज़र ट्रांजिस्टर व ज़ेनर डायोड पर आधारित हैं।',
    },
    whatIfPrompts: [
      {
        id: 'tr-1',
        question: { en: 'If current gain β = 100 and resistance ratio R_L/R_in = 4, what are α, A_v, and A_p?', hi: 'β = 100 और R_L/R_in = 4 होने पर α, A_v और A_p कितने होंगे?' },
        hint: { en: 'α = β/(1+β), A_v = β(R_L/R_in), A_p = β·A_v.', hi: 'α = β/(1+β) और A_p = β·A_v लगाएँ।' },
        answer: { en: 'α = 100/101 ≈ 0.99, Voltage Gain A_v = 400, and Power Gain A_p = 40,000!', hi: 'α ≈ 0.99, वोल्टेज लाभ A_v = 400 और शक्ति लाभ A_p = 40,000!' },
        targetParams: { beta: 100, Ib: 40, RL: 4, Rin: 1 },
      },
    ],
    graphTitle: { en: 'Current Gain Relation β = α / (1 − α) as α Approaches 1', hi: 'α के साथ धारा लाभ β = α/(1−α) का ग्राफ' },
    graphXLabel: 'Common-Base Gain α',
    graphYLabel: 'CE Gain β',
  },

  {
    id: 'gravity-variation',
    chapterId: 'gravitation',
    isAirforceX: true,
    supports3D: true,
    default3D: true,
    shortTabLabel: { en: 'Variation of g (h, d, λ)', hi: 'g का परिवर्तन (h, d, λ)' },
    title: {
      en: 'Variation of Gravity g with Altitude, Depth & Earth Rotation',
      hi: 'ऊँचाई, गहराई और पृथ्वी घूर्णन के साथ गुरुत्वीय त्वरण g का परिवर्तन',
    },
    subtitle: {
      en: 'Move a probe from Earth’s core (r = 0) through the surface (r = R) into orbit (r = 3R) and test latitude.',
      hi: 'पृथ्वी के केंद्र (r = 0) से सतह (r = R) और अंतरिक्ष (r = 3R) तक g का सजीव ग्राफ देखें।',
    },
    formulaDisplay: 'Inside: g_d = g·(1 − d/R)   |   Outside: g_h = g·R²/(R + h)²   |   g′ = g − ω²R·cos²λ',
    secondaryFormulas: [
      { label: { en: 'Small Altitude (h ≪ R)', hi: 'अल्प ऊँचाई (h ≪ R)' }, formula: 'g_h ≈ g · (1 − 2h / R)' },
      { label: { en: 'Equal Drop Shortcut (IAF Favorite!)', hi: 'समान कमी शॉर्टकट (IAF PYQ)' }, formula: 'g_h = g_d  ⇒  d = 2·h  (for h ≪ R)' },
      { label: { en: 'Poles vs Equator', hi: 'ध्रुव बनाम विषुवत रेखा' }, formula: 'At Poles (λ=90°): g_max  |  At Equator (λ=0°): g_min = g − ω²R' },
    ],
    variables: [
      { key: 'rRatio', symbol: 'r/R', label: { en: 'Radial Distance (r/R)', hi: 'केंद्र से दूरी (r/R)' }, unit: 'R', min: 0, max: 3, step: 0.05, defaultValue: 1.0 },
      { key: 'lat', symbol: 'λ', label: { en: 'Latitude Angle', hi: 'अक्षांश कोण' }, unit: '°', min: 0, max: 90, step: 5, defaultValue: 0 },
      { key: 'spinFactor', symbol: 'ω/ω₀', label: { en: 'Earth Spin Multiplier', hi: 'पृथ्वी घूर्णन गुणक' }, unit: '×', min: 0, max: 17, step: 0.5, defaultValue: 1 },
    ],
    presets: [
      { id: 'center', label: { en: 'Earth Center (g = 0)', hi: 'पृथ्वी का केंद्र (g = 0)' }, params: { rRatio: 0, lat: 0, spinFactor: 1 } },
      { id: 'surface', label: { en: 'Surface (Max g = 9.8)', hi: 'पृथ्वी सतह (अधिकतम g)' }, params: { rRatio: 1.0, lat: 45, spinFactor: 1 } },
      { id: 'alt-r', label: { en: 'Height h = R (g/4)', hi: 'ऊँचाई h = R (g/4)' }, params: { rRatio: 2.0, lat: 0, spinFactor: 1 } },
      { id: 'weightless-eq', label: { en: '17× Spin (Weightless Equator!)', hi: '17× घूर्णन (भारहीनता!)' }, params: { rRatio: 1.0, lat: 0, spinFactor: 17 } },
    ],
    explanation: {
      en: 'Gravity is strictly zero at Earth’s center, rises linearly inside the solid Earth (g ∝ r), peaks at the surface (9.8 m/s²), and decays as 1/r² outside. If Earth spun 17 times faster, bodies at the equator would become weightless!',
      hi: 'पृथ्वी के केंद्र पर g = 0 होता है, भीतर यह r के समानुपाती बढ़ता है, सतह पर अधिकतम (9.8 m/s²) और बाहर 1/r² से घटता है। यदि पृथ्वी 17 गुना तेज़ घूमे तो विषुवत रेखा पर भार शून्य हो जाएगा।',
    },
    realLife: {
      en: 'At an altitude equal to Earth’s radius (h = R = 6400 km), your weight drops to one-fourth (g/4 = 2.45 m/s²).',
      hi: 'पृथ्वी की त्रिज्या के बराबर ऊँचाई (h = R) पर किसी वस्तु का भार एक-चौथाई (W/4) रह जाता है।',
    },
    whatIfPrompts: [
      {
        id: 'gv-1',
        question: { en: 'At what altitude h = R above Earth does g drop to 25% of surface value?', hi: 'किस ऊँचाई पर g का मान सतह के मान का 25% (g/4) रह जाता है?' },
        hint: { en: 'Set r/R = 2.0 (meaning h = R).', hi: 'r/R = 2.0 (अर्थात् h = R) पर जाँचें।' },
        answer: { en: 'At h = R (r = 2R), g_h = g / (1 + 1)² = g/4 = 2.45 m/s²!', hi: 'h = R ऊँचाई पर g_h = g/4 = 2.45 m/s² हो जाता है!' },
        targetParams: { rRatio: 2.0, lat: 0, spinFactor: 1 },
      },
      {
        id: 'gv-2',
        question: { en: 'If Earth rotates 17× faster, what happens to apparent g at the Equator (λ = 0°)?', hi: 'पृथ्वी 17 गुना तेज़ घूमे तो विषुवत रेखा पर प्रभावी g कितना होगा?' },
        hint: { en: '√(g / (ω₀²R)) ≈ 17.', hi: 'ω_crit = √(g/R) ≈ 17 ω₀।' },
        answer: { en: 'Centrifugal term ω²R equals g, making apparent weight ZERO at the equator while Poles (λ = 90°) stay unaffected!', hi: 'विषुवत रेखा पर प्रभावी g शून्य (भारहीनता) हो जाता है जबकि ध्रुवों पर कोई असर नहीं होता!' },
        targetParams: { rRatio: 1.0, lat: 0, spinFactor: 17 },
      },
    ],
    graphTitle: { en: 'Gravity g(r) from Center (r = 0) through Surface (r = R) to Space (3R)', hi: 'केंद्र (0) से सतह (R) व अंतरिक्ष (3R) तक g(r) वक्र' },
    graphXLabel: 'Radial Distance r / R',
    graphYLabel: 'g (m/s²)',
  },

  {
    id: 'blackbody-cooling',
    chapterId: 'thermal-matter',
    isAirforceX: true,
    shortTabLabel: { en: 'Wien, Stefan & Cooling (X)', hi: 'वीन, स्टीफ़न व शीतलन (X)' },
    title: {
      en: 'Blackbody Radiation (Wien & Stefan–Boltzmann) & Newton’s Cooling',
      hi: 'कृष्णिका विकिरण (वीन व स्टीफ़न नियम) और न्यूटन का शीतलन नियम',
    },
    subtitle: {
      en: 'Track peak wavelength shift λ_m·T = b, fourth-power radiation E = σT⁴, and exponential cooling.',
      hi: 'शीर्ष तरंगदैर्घ्य λ_m·T = b, चतुर्थ-घात विकिरण E = σT⁴ और न्यूटन शीतलन वक्र देखें।',
    },
    formulaDisplay: 'λ_m · T = 2.9×10⁻³ m·K   |   P = e·σ·A·T⁴   |   dT/dt = −k·(T − T₀)',
    secondaryFormulas: [
      { label: { en: 'Stefan–Boltzmann Constant', hi: 'स्टीफ़न नियतांक' }, formula: 'σ = 5.67 × 10⁻⁸ W·m⁻²·K⁻⁴' },
      { label: { en: 'Doubling Kelvin Temp (IAF PYQ)', hi: 'केल्विन ताप दोगुना (IAF PYQ)' }, formula: 'T → 2T  ⇒  Radiated Power P → 16·P,  λ_m → λ_m / 2' },
      { label: { en: 'Newton Average Cooling Form', hi: 'न्यूटन शीतलन औसत रूप' }, formula: '(T₁ − T₂)/t = K · [(T₁ + T₂)/2 − T₀]' },
    ],
    variables: [
      { key: 'T', symbol: 'T', label: { en: 'Blackbody Temp', hi: 'कृष्णिका तापमान' }, unit: 'K', min: 1500, max: 8000, step: 250, defaultValue: 5000 },
      { key: 'emissivity', symbol: 'e', label: { en: 'Emissivity', hi: 'उत्सर्जकता' }, unit: '', min: 0.2, max: 1.0, step: 0.1, defaultValue: 1.0 },
      { key: 'T_init', symbol: 'T_i', label: { en: 'Hot Cup Temp', hi: 'गर्म वस्तु ताप' }, unit: '°C', min: 45, max: 100, step: 5, defaultValue: 85 },
      { key: 'T_env', symbol: 'T₀', label: { en: 'Room Temp', hi: 'कमरे का ताप' }, unit: '°C', min: 10, max: 35, step: 5, defaultValue: 25 },
    ],
    presets: [
      { id: 'red-star', label: { en: 'Red Hot (3000 K → IR/Red)', hi: 'लाल तप्त (3000 K)' }, params: { T: 3000, emissivity: 1, T_init: 85, T_env: 25 } },
      { id: 'sun', label: { en: 'Solar Surface (5800 K → Visible)', hi: 'सूर्य सतह (5800 K)' }, params: { T: 5750, emissivity: 1, T_init: 90, T_env: 25 } },
      { id: 'blue-star', label: { en: 'Blue Giant (8000 K → UV/Blue)', hi: 'नीला तारा (8000 K)' }, params: { T: 8000, emissivity: 1, T_init: 95, T_env: 20 } },
    ],
    explanation: {
      en: 'Wien’s Law proves hotter stars peak at SHORTER wavelengths (blue stars are hotter than red stars!). Stefan’s Law makes total power explode as T⁴ (doubling K gives 16× energy). Newton’s cooling slows down exponentially as a cup approaches room temperature.',
      hi: 'वीन के नियम से अधिक ताप पर λ_m घटता है (नीले तारे लाल तारों से अधिक गर्म होते हैं)। स्टीफ़न के नियम से ताप दोगुना करने पर विकिरण ऊर्जा 16 गुनी हो जाती है।',
    },
    realLife: {
      en: 'Astronomers measure distant star temperatures purely from their peak color λ_m using Wien’s Law, and infrared thermometers use Stefan’s T⁴ law.',
      hi: 'खगोलविद वीन के नियम से तारों के रंग (λ_m) द्वारा उनका ताप ज्ञात करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'bb-1',
        question: { en: 'If a blackbody’s absolute temperature T doubles from 2500 K to 5000 K, how do λ_m and Power P change?', hi: 'परम ताप T दोगुना (2500 K → 5000 K) होने पर λ_m और शक्ति P कैसे बदलते हैं?' },
        hint: { en: 'λ_m ∝ 1/T while P ∝ T⁴.', hi: 'λ_m ∝ 1/T तथा P ∝ T⁴ देखें।' },
        answer: { en: 'Peak wavelength λ_m halves (shifts left toward blue) while radiated power skyrockets by 2⁴ = 16×!', hi: 'शीर्ष तरंगदैर्घ्य λ_m आधा हो जाता है और विकिरण शक्ति 16 गुनी हो जाती है!' },
        targetParams: { T: 5000, emissivity: 1.0, T_init: 85, T_env: 25 },
      },
    ],
    graphTitle: { en: 'Blackbody Spectral Radiance Curve — Peak Shifts Left as T Rises', hi: 'कृष्णिका स्पेक्ट्रम वक्र — ताप बढ़ने पर शीर्ष बाईं ओर खिसकता है' },
    graphXLabel: 'Wavelength λ (nm)',
    graphYLabel: 'Relative Intensity',
  },

  {
    id: 'organ-pipes-beats',
    chapterId: 'waves',
    isAirforceX: true,
    supports3D: true,
    default3D: true,
    shortTabLabel: { en: 'Organ Pipes & Beats (X)', hi: 'ऑर्गन पाइप व विस्पंद (X)' },
    title: {
      en: 'Organ Pipes (Open vs Closed Harmonics) & Acoustic Beats',
      hi: 'ऑर्गन पाइप (खुला बनाम बंद संनादी) और ध्वनि विस्पंद (Beats)',
    },
    subtitle: {
      en: 'Compare standing wave nodes/antinodes in open vs closed pipes and visualize beat modulation f_b = |f₁ − f₂|.',
      hi: 'खुले व बंद ऑर्गन पाइप में अप्रगामी तरंगें तथा विस्पंद आवृत्ति f_b = |f₁ − f₂| का सजीव चित्रण।',
    },
    formulaDisplay: 'Open: f_n = n·v / (2L)  (1:2:3)   |   Closed: f_n = (2k−1)·v / (4L)  (1:3:5)   |   f_b = |f₁ − f₂|',
    secondaryFormulas: [
      { label: { en: 'Same-Length Fundamental Ratio', hi: 'समान लंबाई मूल आवृत्ति अनुपात' }, formula: 'f_open / f_closed = 2 : 1' },
      { label: { en: 'Human Ear Beat Limit', hi: 'कान की विस्पंद सीमा' }, formula: 'Distinct beats heard only when f_beat ≤ 10 Hz' },
      { label: { en: 'End Correction (Rayleigh)', hi: 'अंत्य संशोधन' }, formula: 'e = 0.6·r  (Closed: L + e, Open: L + 2e)' },
    ],
    variables: [
      { key: 'pipeType', symbol: 'Type', label: { en: 'Pipe (0:Closed 1:Open)', hi: 'पाइप (0:बंद 1:खुला)' }, unit: '', min: 0, max: 1, step: 1, defaultValue: 1 },
      { key: 'mode', symbol: 'n', label: { en: 'Mode / Overtone Index', hi: 'विधा (1:मूल, 2, 3)' }, unit: '', min: 1, max: 4, step: 1, defaultValue: 1 },
      { key: 'L', symbol: 'L', label: { en: 'Pipe Length', hi: 'पाइप की लंबाई' }, unit: 'm', min: 0.2, max: 2.0, step: 0.1, defaultValue: 0.85 },
      { key: 'df', symbol: 'Δf', label: { en: 'Tuning Fork Beat Δf', hi: 'विस्पंद अंतर Δf' }, unit: 'Hz', min: 0, max: 10, step: 1, defaultValue: 4 },
    ],
    presets: [
      { id: 'open-fund', label: { en: 'Open Fundamental (v/2L)', hi: 'खुला पाइप मूल स्वर' }, params: { pipeType: 1, mode: 1, L: 0.85, df: 4 } },
      { id: 'closed-fund', label: { en: 'Closed Fundamental (v/4L)', hi: 'बंद पाइप मूल स्वर' }, params: { pipeType: 0, mode: 1, L: 0.85, df: 4 } },
      { id: 'closed-3rd', label: { en: 'Closed 1st Overtone (3rd Harmonic)', hi: 'बंद पाइप प्रथम अधिस्वरक (3:1)' }, params: { pipeType: 0, mode: 2, L: 0.85, df: 6 } },
    ],
    explanation: {
      en: 'An open organ pipe has displacement antinodes at BOTH ends, supporting ALL harmonics (1 : 2 : 3 : 4) for a richer tone. A closed pipe forces a node at the closed end, permitting ONLY ODD harmonics (1 : 3 : 5) and halving its fundamental frequency.',
      hi: 'खुले ऑर्गन पाइप में दोनों सिरों पर प्रस्पंद बनते हैं जिससे सम व विषम सभी संनादी (1:2:3) उत्पन्न होते हैं। बंद पाइप में केवल विषम संनादी (1:3:5) बनते हैं।',
    },
    realLife: {
      en: 'Flutes act as open pipes (sweeter rich harmonics), clarinets behave like closed pipes, and musicians tune guitars by listening until beats vanish (Δf → 0).',
      hi: 'बाँसुरी खुले ऑर्गन पाइप की तरह मधुर सभी संनादी देती है और वाद्य यंत्रों को विस्पंद शून्य कर ट्यून किया जाता है।',
    },
    whatIfPrompts: [
      {
        id: 'op-1',
        question: { en: 'Close one end of an open organ pipe of length 0.85 m. What happens to its fundamental frequency?', hi: '0.85 m खुले ऑर्गन पाइप का एक सिरा बंद करने पर मूल आवृत्ति कितनी हो जाती है?' },
        hint: { en: 'Compare v/(2L) against v/(4L).', hi: 'v/(2L) और v/(4L) की तुलना करें।' },
        answer: { en: 'Fundamental frequency drops to EXACTLY HALF (200 Hz → 100 Hz) because wavelength doubles from 2L to 4L!', hi: 'मूल आवृत्ति ठीक आधी (200 Hz → 100 Hz) हो जाती है!' },
        targetParams: { pipeType: 0, mode: 1, L: 0.85, df: 4 },
      },
    ],
    graphTitle: { en: 'Acoustic Beat Envelope (f_beat = |f₁ − f₂| Beats/sec)', hi: 'ध्वनि विस्पंद तरंग पैटर्न (f_beat = |f₁ − f₂|)' },
    graphXLabel: 'Time t (s)',
    graphYLabel: 'Resultant Amp',
  },

  {
    id: 'potentiometer-cells',
    chapterId: 'current-electricity',
    isAirforceX: true,
    shortTabLabel: { en: 'Potentiometer & Cells (X)', hi: 'विभवमापी व सेल संयोजन (X)' },
    title: {
      en: 'Potentiometer Null Method & Grouping of Cells (Series / Parallel)',
      hi: 'विभवमापी शून्य-विक्षेप विधि और सेलों का श्रेणी/समांतर संयोजन',
    },
    subtitle: {
      en: 'Slide the jockey to null balance (k = V/L, r = R(l₁/l₂ − 1)) and compare Series vs Parallel cell current.',
      hi: 'जॉकी खिसकाकर शून्य विक्षेप (r = R(l₁/l₂ − 1)) और सेलों के श्रेणी/समांतर संयोजन की धारा जाँचें।',
    },
    formulaDisplay: 'E = k · l   |   r = R · (l₁ − l₂) / l₂   |   I_series = nE/(R+nr)   |   I_parallel = mE/(mR+r)',
    secondaryFormulas: [
      { label: { en: 'Potential Gradient', hi: 'विभव प्रवणता' }, formula: 'k = V / L = I · ρ / A  (Smaller k ⇒ Higher sensitivity!)' },
      { label: { en: 'EMF Comparison', hi: 'EMF तुलना' }, formula: 'E₁ / E₂ = l₁ / l₂' },
      { label: { en: 'Max Power Transfer (Mixed Cells)', hi: 'अधिकतम धारा शर्त' }, formula: 'Series best if R ≫ r  |  Parallel best if R ≪ r' },
    ],
    variables: [
      { key: 'Vwire', symbol: 'V_p', label: { en: 'Driver Wire Voltage', hi: 'विभवमापी तार वोल्टता' }, unit: 'V', min: 2, max: 12, step: 0.5, defaultValue: 6 },
      { key: 'Ecell', symbol: 'E', label: { en: 'Test Cell EMF', hi: 'परीक्षण सेल EMF' }, unit: 'V', min: 0.5, max: 5, step: 0.25, defaultValue: 2.0 },
      { key: 'rInt', symbol: 'r', label: { en: 'Cell Internal Res', hi: 'आंतरिक प्रतिरोध' }, unit: 'Ω', min: 0.5, max: 10, step: 0.5, defaultValue: 2.0 },
      { key: 'Rext', symbol: 'R', label: { en: 'Shunt / Load Res', hi: 'बाह्य प्रतिरोध' }, unit: 'Ω', min: 1, max: 20, step: 1, defaultValue: 6 },
    ],
    presets: [
      { id: 'high-sens', label: { en: 'High Sensitivity (Low k)', hi: 'उच्च सुग्राहिता (कम k)' }, params: { Vwire: 4, Ecell: 2.0, rInt: 2.0, Rext: 6 } },
      { id: 'low-r', label: { en: 'R ≫ r (Series Wins)', hi: 'R ≫ r (श्रेणीक्रम श्रेष्ठ)' }, params: { Vwire: 6, Ecell: 1.5, rInt: 0.5, Rext: 18 } },
      { id: 'high-r', label: { en: 'R ≪ r (Parallel Wins)', hi: 'R ≪ r (समांतर क्रम श्रेष्ठ)' }, params: { Vwire: 6, Ecell: 1.5, rInt: 8.0, Rext: 1 } },
    ],
    explanation: {
      en: 'A potentiometer acts as an IDEAL voltmeter (infinite resistance) because it draws ZERO current from the test cell at the null point! Sensitivity increases when potential gradient k = V/L is reduced (longer wire or lower driver voltage).',
      hi: 'विभवमापी शून्य विक्षेप स्थिति में सेल से शून्य धारा लेता है, अतः यह आदर्श वोल्टमीटर (अनंत प्रतिरोध) है। तार की लंबाई बढ़ाने या k घटाने से सुग्राहिता बढ़ती है।',
    },
    realLife: {
      en: 'Battery packs wire cells in series to boost voltage (when load R ≫ r) and in parallel to boost current capacity (when load R ≪ r).',
      hi: 'बैटरी पैक में उच्च वोल्टता के लिए सेल श्रेणीक्रम में तथा अधिक धारा के लिए समांतर क्रम में जोड़े जाते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'pot-1',
        question: { en: 'When internal resistance r = 8 Ω is much larger than load R = 1 Ω, does Series or Parallel give more current for 4 cells?', hi: 'जब आंतरिक प्रतिरोध r = 8 Ω, बाह्य प्रतिरोध R = 1 Ω से बहुत बड़ा हो, तो श्रेणी या समांतर में किसमें अधिक धारा मिलती है?' },
        hint: { en: 'Compare I_series = 4E/(1+32) vs I_parallel = 4E/(4+8).', hi: 'I_series बनाम I_parallel के लाइव रीडआउट देखें।' },
        answer: { en: 'Parallel grouping delivers nearly 3× higher current because combining cells in parallel divides internal resistance to r/4!', hi: 'समांतर संयोजन में आंतरिक प्रतिरोध r/4 हो जाता है जिससे धारा लगभग 3 गुनी अधिक मिलती है!' },
        targetParams: { Vwire: 6, Ecell: 1.5, rInt: 8.0, Rext: 1 },
      },
    ],
    graphTitle: { en: '4-Cell Load Current: Series (Solid) vs Parallel (Dashed) across Load R', hi: 'लोड R के साथ 4-सेल धारा: श्रेणी (ठोस) बनाम समांतर (डैश)' },
    graphXLabel: 'External Load R (Ω)',
    graphYLabel: 'Current I (A)',
  },

  {
    id: 'eye-defects',
    chapterId: 'ray-optics',
    isAirforceX: true,
    supports3D: true,
    default3D: true,
    shortTabLabel: { en: 'Eye Defects & Power (X)', hi: 'नेत्र दोष व लेंस क्षमता (X)' },
    title: {
      en: 'Defects of Vision: Myopia, Hypermetropia & Corrective Lens Power',
      hi: 'दृष्टि दोष: निकट-दृष्टि, दूर-दृष्टि और संशोधक लेंस की क्षमता (Diopter)',
    },
    subtitle: {
      en: 'Switch defects, toggle corrective spectacle lens on/off, and compute exact diopter power P = 100/f(cm).',
      hi: 'दोष चुनें, संशोधक चश्मा लेंस लगाएँ और डायोप्टर क्षमता P = 100/f(cm) की सजीव गणना करें।',
    },
    formulaDisplay: 'Myopia: P = −1 / d_far (Concave)   |   Hypermetropia: P = 4 − 1 / d_near (Convex)',
    secondaryFormulas: [
      { label: { en: 'Normal Eye Range', hi: 'सामान्य नेत्र परास' }, formula: 'Near Point D = 25 cm  |  Far Point = ∞' },
      { label: { en: 'Lens Power Unit', hi: 'लेंस क्षमता मात्रक' }, formula: 'P = 1 / f(m) = 100 / f(cm)  [Diopter, D]' },
      { label: { en: 'Astigmatism & Presbyopia', hi: 'अबिंदुकता व जरा-दृष्टि' }, formula: 'Astigmatism → Cylindrical Lens  |  Presbyopia → Bifocal Lens' },
    ],
    variables: [
      { key: 'defect', symbol: 'Mode', label: { en: 'Defect (0:Myopia 1:Hypermetropia)', hi: 'दोष (0:निकट-दृष्टि 1:दूर-दृष्टि)' }, unit: '', min: 0, max: 1, step: 1, defaultValue: 0 },
      { key: 'farPt', symbol: 'd_far', label: { en: 'Myopic Far Point', hi: 'दूर बिंदु (निकट-दृष्टि)' }, unit: 'cm', min: 25, max: 400, step: 25, defaultValue: 100 },
      { key: 'nearPt', symbol: 'd_near', label: { en: 'Hypermetropic Near Pt', hi: 'निकट बिंदु (दूर-दृष्टि)' }, unit: 'cm', min: 35, max: 200, step: 5, defaultValue: 50 },
      { key: 'corrected', symbol: 'Lens', label: { en: 'Corrective Lens (0:Off 1:On)', hi: 'संशोधक लेंस (0:बंद 1:चालू)' }, unit: '', min: 0, max: 1, step: 1, defaultValue: 1 },
    ],
    presets: [
      { id: 'myopia-raw', label: { en: 'Myopia Uncorrected (Focus Before Retina)', hi: 'निकट-दृष्टि (बिना लेंस)' }, params: { defect: 0, farPt: 100, nearPt: 50, corrected: 0 } },
      { id: 'myopia-fix', label: { en: 'Myopia Fixed (Concave −1.0 D)', hi: 'निकट-दृष्टि संशोधन (−1.0 D)' }, params: { defect: 0, farPt: 100, nearPt: 50, corrected: 1 } },
      { id: 'hyper-fix', label: { en: 'Hypermetropia Fixed (Convex +2.0 D)', hi: 'दूर-दृष्टि संशोधन (+2.0 D)' }, params: { defect: 1, farPt: 100, nearPt: 50, corrected: 1 } },
    ],
    explanation: {
      en: 'In Myopia (short-sightedness), parallel rays focus BEFORE the retina; a diverging Concave lens (negative power P = −1/d_far) brings the image back onto the retina. In Hypermetropia (long-sightedness), near rays focus BEHIND the retina; a converging Convex lens (positive power) fixes it.',
      hi: 'निकट-दृष्टि दोष में प्रतिबिंब रेटिना से पहले बनता है जिसे अवतल लेंस (−P) से ठीक किया जाता है। दूर-दृष्टि दोष में प्रतिबिंब रेटिना के पीछे बनता है जिसे उत्तल लेंस (+P) से सुधारा जाता है।',
    },
    realLife: {
      en: 'An eye prescription of −2.0 D means a concave lens of focal length −50 cm for myopia (far point = 50 cm); +2.0 D means a convex lens of +50 cm for hypermetropia.',
      hi: 'चश्मे का −2.0 D नंबर निकट-दृष्टि (अवतल लेंस, f = −50 cm) तथा +2.0 D दूर-दृष्टि (उत्तल लेंस, f = +50 cm) दर्शाता है।',
    },
    whatIfPrompts: [
      {
        id: 'eye-1',
        question: { en: 'A student cannot see clearly beyond 50 cm (Myopia). What corrective lens power is required?', hi: 'एक छात्र 50 cm से दूर स्पष्ट नहीं देख पाता। उसे किस क्षमता के लेंस की आवश्यकता है?' },
        hint: { en: 'Set defect = 0 (Myopia) and far point d_far = 50 cm.', hi: 'P = −100 / d_far(cm) लगाएँ।' },
        answer: { en: 'Concave lens of focal length f = −50 cm and power P = −100/50 = −2.0 Diopters!', hi: 'f = −50 cm और क्षमता P = −2.0 D का अवतल लेंस चाहिए!' },
        targetParams: { defect: 0, farPt: 50, nearPt: 50, corrected: 1 },
      },
    ],
    graphTitle: { en: 'Required Corrective Power |P| (Diopters) vs Defect Distance (cm)', hi: 'दोष दूरी (cm) के साथ आवश्यक लेंस क्षमता |P| (D)' },
    graphXLabel: 'Defect Distance (cm)',
    graphYLabel: 'Lens Power (D)',
  },
];
