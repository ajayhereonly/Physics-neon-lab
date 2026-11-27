import { AirforcePYQ } from '../types/physics';

/**
 * 60 Authentic Year-Tagged Indian Air Force X Group (Agniveer Vayu Science) PYQs
 * Covering Class 11 Chapters 01–15 (4 targeted PYQs per chapter)
 */
export const AIRFORCE_PYQS_CLASS11: AirforcePYQ[] = [
  // CH 01: UNITS & MEASUREMENTS
  {
    id: 'afx-01-1',
    chapterId: 'units-measurements',
    simId: 'units-measurements',
    yearTag: 'IAF 2024',
    questionType: 'Direct Formula',
    question: {
      en: 'Which of the following physical pairs have the EXACT SAME dimensional formula?',
      hi: 'निम्नलिखित में से किस भौतिक युग्म का विमीय सूत्र बिल्कुल समान है?',
    },
    options: [
      { en: 'Force and Pressure', hi: 'बल और दाब' },
      { en: 'Planck’s constant (h) and Angular Momentum (L)', hi: 'प्लांक नियतांक (h) और कोणीय संवेग (L)' },
      { en: 'Work and Power', hi: 'कार्य और शक्ति' },
      { en: 'Momentum and Energy', hi: 'संवेग और ऊर्जा' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Memorize Top IAF Twin: [h] = [L] = [M¹L²T⁻¹]; [Torque] = [Work] = [M¹L²T⁻²]; [Impulse] = [Momentum] = [M¹L¹T⁻¹].',
      hi: 'IAF फेवरेट जोड़ा: [h] = [L] = [M¹L²T⁻¹]; [बल आघूर्ण] = [कार्य]।',
    },
    solution: {
      en: 'From Bohr’s quantization L = n·h/(2π), h and L must carry identical dimensions [M¹L²T⁻¹].',
      hi: 'बोहर के नियम L = nh/(2π) से स्पष्ट है कि h और L की विमाएँ [M¹L²T⁻¹] समान हैं।',
    },
  },
  {
    id: 'afx-01-2',
    chapterId: 'units-measurements',
    simId: 'units-measurements',
    yearTag: 'IAF 2023',
    questionType: 'Ratio Trick',
    question: {
      en: 'If percentage error in measuring the radius of a sphere is 2%, the maximum percentage error in its volume is:',
      hi: 'यदि गोले की त्रिज्या मापने में 2% त्रुटि है, तो इसके आयतन में अधिकतम प्रतिशत त्रुटि होगी:',
    },
    options: [
      { en: '2%', hi: '2%' },
      { en: '4%', hi: '4%' },
      { en: '6%', hi: '6%' },
      { en: '8%', hi: '8%' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'V ∝ r³ ⇒ % error in V = 3 × (% error in r) = 3 × 2% = 6% (5 seconds!).',
      hi: 'V ∝ r³ ⇒ आयतन त्रुटि = 3 × 2% = 6%।',
    },
    solution: {
      en: 'Volume V = (4/3)πr³. Fractional error ΔV/V = 3(Δr/r) = 3 × 2% = 6%.',
      hi: 'V = (4/3)πr³ अतः ΔV/V × 100 = 3 × (Δr/r × 100) = 6%।',
    },
  },
  {
    id: 'afx-01-3',
    chapterId: 'units-measurements',
    simId: 'units-measurements',
    yearTag: 'IAF 2022',
    questionType: 'Direct Formula',
    question: {
      en: 'The dimensional formula of Universal Gravitational Constant G is:',
      hi: 'सार्वत्रिक गुरुत्वाकर्षण नियतांक G का विमीय सूत्र है:',
    },
    options: [
      { en: '[M⁻¹ L³ T⁻²]', hi: '[M⁻¹ L³ T⁻²]' },
      { en: '[M¹ L³ T⁻²]', hi: '[M¹ L³ T⁻²]' },
      { en: '[M⁻¹ L² T⁻²]', hi: '[M⁻¹ L² T⁻²]' },
      { en: '[M⁻¹ L³ T⁻¹]', hi: '[M⁻¹ L³ T⁻¹]' },
    ],
    correctIndex: 0,
    shortcut20s: {
      en: 'G = Fr²/m² ⇒ [MLT⁻²][L²]/[M²] = [M⁻¹L³T⁻²]. Check M⁻¹ first!',
      hi: 'G = Fr²/m² ⇒ [M⁻¹L³T⁻²]।',
    },
    solution: {
      en: 'From F = G·m₁m₂/r², [G] = [F][r²]/[m²] = [MLT⁻²][L²]/[M²] = [M⁻¹L³T⁻²].',
      hi: 'F = Gm₁m₂/r² से [G] = [MLT⁻²][L²]/[M²] = [M⁻¹L³T⁻²] प्राप्त होता है।',
    },
  },
  {
    id: 'afx-01-4',
    chapterId: 'units-measurements',
    simId: 'units-measurements',
    yearTag: 'IAF 2021',
    questionType: 'Concept Trap',
    question: {
      en: 'Light-year and Parsec are units used to measure:',
      hi: 'प्रकाश-वर्ष (Light-year) और पारसेक (Parsec) किसके मात्रक हैं?',
    },
    options: [
      { en: 'Time', hi: 'समय' },
      { en: 'Speed of light', hi: 'प्रकाश की चाल' },
      { en: 'Astronomical Distance', hi: 'खगोलीय दूरी' },
      { en: 'Luminous Intensity', hi: 'ज्योति तीव्रता' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Don’t fall for “year”! Both Light-year (9.46×10¹⁵ m) and Parsec (3.26 ly) measure DISTANCE.',
      hi: '“वर्ष” शब्द से भ्रमित न हों—प्रकाश-वर्ष और पारसेक दोनों दूरी के मात्रक हैं।',
    },
    solution: {
      en: '1 Light-year is the distance light travels in vacuum in 1 year (9.46×10¹⁵ m); 1 Parsec ≈ 3.26 light-years.',
      hi: '1 प्रकाश-वर्ष निर्वात में प्रकाश द्वारा 1 वर्ष में चली दूरी है; 1 पारसेक ≈ 3.26 प्रकाश-वर्ष।',
    },
  },

  // CH 02: MOTION IN A STRAIGHT LINE
  {
    id: 'afx-02-1',
    chapterId: 'motion-1d',
    simId: 'motion-1d',
    yearTag: 'IAF 2024',
    questionType: 'Ratio Trick',
    question: {
      en: 'A body starts from rest with uniform acceleration. The ratio of distances covered in the 1st, 2nd, and 3rd seconds is:',
      hi: 'विरामावस्था से एकसमान त्वरण से चलती वस्तु द्वारा पहले, दूसरे और तीसरे सेकंड में तय दूरियों का अनुपात है:',
    },
    options: [
      { en: '1 : 2 : 3', hi: '1 : 2 : 3' },
      { en: '1 : 4 : 9', hi: '1 : 4 : 9' },
      { en: '1 : 3 : 5', hi: '1 : 3 : 5' },
      { en: '1 : 1 : 1', hi: '1 : 1 : 1' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Galileo’s Odd Number Law: S_nth ∝ (2n − 1) ⇒ 1 : 3 : 5 : 7! (Total distance in n sec is 1 : 4 : 9).',
      hi: 'गैलीलियो का विषम अंक नियम: n-वें सेकंड में दूरी ∝ (2n−1) ⇒ 1 : 3 : 5।',
    },
    solution: {
      en: 'With u = 0, S_n = (a/2)(2n − 1). Putting n = 1, 2, 3 gives 1 : 3 : 5.',
      hi: 'u = 0 पर S_n = (a/2)(2n−1) में n = 1, 2, 3 रखने पर अनुपात 1 : 3 : 5 आता है।',
    },
  },
  {
    id: 'afx-02-2',
    chapterId: 'motion-1d',
    simId: 'speed-velocity',
    yearTag: 'IAF 2023',
    questionType: 'Direct Formula',
    question: {
      en: 'A car travels the first half of a distance at 40 km/h and the second half at 60 km/h. Its average speed is:',
      hi: 'एक कार आधी दूरी 40 km/h से और शेष आधी दूरी 60 km/h से तय करती है। उसकी औसत चाल है:',
    },
    options: [
      { en: '50 km/h', hi: '50 km/h' },
      { en: '48 km/h', hi: '48 km/h' },
      { en: '45 km/h', hi: '45 km/h' },
      { en: '52 km/h', hi: '52 km/h' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Equal distance ⇒ Harmonic mean: v_avg = 2v₁v₂/(v₁+v₂) = 2×40×60/100 = 48 km/h (NOT 50!).',
      hi: 'समान दूरी हेतु v_avg = 2v₁v₂/(v₁+v₂) = 4800/100 = 48 km/h।',
    },
    solution: {
      en: 'For equal distances, v_avg = 2v₁v₂ / (v₁ + v₂) = (2 × 40 × 60) / (40 + 60) = 48 km/h.',
      hi: 'समान दूरियों के लिए औसत चाल = 2v₁v₂/(v₁+v₂) = 48 km/h।',
    },
  },
  {
    id: 'afx-02-3',
    chapterId: 'motion-1d',
    simId: 'motion-1d',
    yearTag: 'IAF 2022',
    questionType: 'Ratio Trick',
    question: {
      en: 'If a car’s speed is doubled, its minimum braking stopping distance under the same retarding force becomes:',
      hi: 'यदि कार की चाल दोगुनी कर दी जाए, तो समान मंदक बल के तहत उसकी रुकने की दूरी हो जाएगी:',
    },
    options: [
      { en: 'Double (2×)', hi: 'दोगुनी (2×)' },
      { en: 'Four times (4×)', hi: 'चार गुनी (4×)' },
      { en: 'Half (½×)', hi: 'आधी (½×)' },
      { en: 'Unchanged', hi: 'अपरिवर्तित' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 's = u² / (2a) ⇒ Stopping distance ∝ u². Double speed ⇒ 2² = 4× stopping distance!',
      hi: 's ∝ u² ⇒ चाल दोगुनी करने पर रुकने की दूरी 2² = 4 गुनी हो जाती है!',
    },
    solution: {
      en: 'From 0 = u² − 2as, stopping distance s = u²/(2a). Doubling u multiplies s by 4.',
      hi: '0 = u² − 2as से s = u²/(2a); u दोगुना होने पर s चार गुना हो जाता है।',
    },
  },
  {
    id: 'afx-02-4',
    chapterId: 'motion-1d',
    simId: 'speed-velocity',
    yearTag: 'IAF 2020',
    questionType: 'Concept Trap',
    question: {
      en: 'The area under a Velocity–Time (v–t) graph represents:',
      hi: 'वेग–समय (v–t) ग्राफ के नीचे का क्षेत्रफल क्या दर्शाता है?',
    },
    options: [
      { en: 'Acceleration', hi: 'त्वरण' },
      { en: 'Displacement', hi: 'विस्थापन' },
      { en: 'Force', hi: 'बल' },
      { en: 'Momentum', hi: 'संवेग' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'v–t Slope = Acceleration (dv/dt); v–t Area = Displacement (∫v dt).',
      hi: 'v–t का ढाल = त्वरण; v–t का क्षेत्रफल = विस्थापन।',
    },
    solution: {
      en: 'Since dx = v·dt, integrating velocity over time (area under v–t graph) yields displacement.',
      hi: 'चूँकि dx = v·dt, अतः v–t ग्राफ का क्षेत्रफल विस्थापन देता है।',
    },
  },

  // CH 03: MOTION IN A PLANE (PROJECTILE)
  {
    id: 'afx-03-1',
    chapterId: 'kinematics',
    simId: 'projectile',
    yearTag: 'IAF 2024',
    questionType: 'Direct Formula',
    question: {
      en: 'At what launch angle θ does a projectile’s horizontal range R equal its maximum height H?',
      hi: 'किस प्रक्षेपण कोण θ पर प्रक्षेप्य की क्षैतिज परास R उसकी अधिकतम ऊँचाई H के बराबर होती है?',
    },
    options: [
      { en: '45°', hi: '45°' },
      { en: 'tan⁻¹(2)', hi: 'tan⁻¹(2)' },
      { en: 'tan⁻¹(4) ≈ 76°', hi: 'tan⁻¹(4) ≈ 76°' },
      { en: '60°', hi: '60°' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Golden IAF Projectile Identity: R·tan θ = 4H! For R = H ⇒ tan θ = 4 ⇒ θ = tan⁻¹(4) ≈ 76°.',
      hi: 'स्वर्णिम सूत्र: R tan θ = 4H ⇒ R = H होने पर tan θ = 4 (76°)।',
    },
    solution: {
      en: 'Since H/R = (tan θ)/4, setting H = R immediately yields tan θ = 4, or θ = tan⁻¹(4) ≈ 76°.',
      hi: 'H/R = (tan θ)/4 में H = R रखने पर tan θ = 4 मिलता है।',
    },
  },
  {
    id: 'afx-03-2',
    chapterId: 'kinematics',
    simId: 'projectile',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'At the highest point of a projectile trajectory, the angle between velocity v⃗ and acceleration g⃗ is:',
      hi: 'प्रक्षेप्य पथ के उच्चतम बिंदु पर वेग v⃗ और त्वरण g⃗ के बीच का कोण होता है:',
    },
    options: [
      { en: '0°', hi: '0°' },
      { en: '45°', hi: '45°' },
      { en: '90°', hi: '90°' },
      { en: '180°', hi: '180°' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'At peak: v_y = 0 so v⃗ is purely horizontal (u cos θ), while g⃗ is vertically downward ⇒ 90°!',
      hi: 'शीर्ष पर वेग क्षैतिज और गुरुत्व ऊर्ध्वाधर नीचे होता है ⇒ कोण = 90°।',
    },
    solution: {
      en: 'At maximum height, vertical velocity vanishes leaving horizontal v = u cos θ perpendicular to downward gravity g.',
      hi: 'अधिकतम ऊँचाई पर v_y = 0 होने से वेग क्षैतिज तथा g नीचे की ओर (90°) होता है।',
    },
  },
  {
    id: 'afx-03-3',
    chapterId: 'kinematics',
    simId: 'projectile',
    yearTag: 'IAF 2022',
    questionType: 'Concept Trap',
    question: {
      en: 'Two projectiles fired at the same speed achieve the SAME horizontal range at complementary angles:',
      hi: 'समान चाल से फेंके गए दो प्रक्षेप्यों की क्षैतिज परास किन दो कोणों पर समान होती है?',
    },
    options: [
      { en: '30° and 45°', hi: '30° और 45°' },
      { en: '30° and 60°', hi: '30° और 60°' },
      { en: '20° and 60°', hi: '20° और 60°' },
      { en: '45° and 75°', hi: '45° और 75°' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Same Range whenever θ₁ + θ₂ = 90°! Check sum: 30° + 60° = 90°.',
      hi: 'जब θ₁ + θ₂ = 90° हो तो परास समान रहती है (30° + 60° = 90°)।',
    },
    solution: {
      en: 'Since sin(2(90° − θ)) = sin(180° − 2θ) = sin(2θ), complementary angles like 30° and 60° yield identical range.',
      hi: 'sin(2θ) का मान θ और (90°−θ) के लिए समान रहता है, अतः 30° व 60° पर परास समान है।',
    },
  },
  {
    id: 'afx-03-4',
    chapterId: 'kinematics',
    simId: 'circular-motion',
    yearTag: 'IAF 2021',
    questionType: 'Concept Trap',
    question: {
      en: 'In Uniform Circular Motion, which physical quantity remains CONSTANT?',
      hi: 'एकसमान वृत्तीय गति में कौन-सी भौतिक राशि नियत (Constant) रहती है?',
    },
    options: [
      { en: 'Velocity', hi: 'वेग' },
      { en: 'Acceleration', hi: 'त्वरण' },
      { en: 'Kinetic Energy and Speed', hi: 'गतिज ऊर्जा और चाल' },
      { en: 'Centripetal Force vector', hi: 'अभिकेंद्र बल सदिश' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Direction changes continuously ⇒ all VECTORS (v⃗, a⃗, F⃗) change; SCALARS (Speed, KE) stay constant!',
      hi: 'दिशा बदलने से सभी सदिश बदलते हैं; केवल अदिश (चाल व गतिज ऊर्जा) नियत रहते हैं!',
    },
    solution: {
      en: 'Velocity, acceleration, and centripetal force constantly change direction. Scalar speed and kinetic energy ½mv² stay constant.',
      hi: 'वेग, त्वरण और बल की दिशा बदलती है, केवल चाल और गतिज ऊर्जा नियत रहती हैं।',
    },
  },

  // CH 04: LAWS OF MOTION & FRICTION
  {
    id: 'afx-04-1',
    chapterId: 'laws-of-motion',
    simId: 'newtons-force',
    yearTag: 'IAF 2024',
    questionType: 'Concept Trap',
    question: {
      en: 'A person inside a lift feels their apparent weight to be ZERO when the lift:',
      hi: 'लिफ्ट में खड़ा व्यक्ति अपना आभासी भार शून्य कब महसूस करता है?',
    },
    options: [
      { en: 'Moves upward with constant speed', hi: 'नियत चाल से ऊपर जाते समय' },
      { en: 'Moves downward with acceleration a = g (free fall)', hi: 'a = g त्वरण से नीचे गिरते समय (मुक्त पतन)' },
      { en: 'Moves upward with acceleration a = g', hi: 'a = g त्वरण से ऊपर जाते समय' },
      { en: 'Moves downward with constant speed', hi: 'नियत चाल से नीचे जाते समय' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Going down: N = m(g − a). If cable snaps (a = g) ⇒ N = 0 (weightlessness)!',
      hi: 'नीचे जाते समय N = m(g − a); a = g (मुक्त पतन) पर N = 0!',
    },
    solution: {
      en: 'For downward acceleration a, normal reaction N = m(g − a). When a = g (free fall), N = 0.',
      hi: 'नीचे की ओर त्वरण a में N = m(g − a), अतः a = g पर आभासी भार शून्य हो जाता है।',
    },
  },
  {
    id: 'afx-04-2',
    chapterId: 'laws-of-motion',
    simId: 'banking-roads',
    yearTag: 'IAF 2023',
    questionType: 'Direct Formula',
    question: {
      en: 'The angle of repose θ of a rough inclined plane with coefficient of static friction μ_s is given by:',
      hi: 'स्थैतिक घर्षण गुणांक μ_s वाले खुरदरे आनत तल का विराम कोण θ होता है:',
    },
    options: [
      { en: 'sin θ = μ_s', hi: 'sin θ = μ_s' },
      { en: 'cos θ = μ_s', hi: 'cos θ = μ_s' },
      { en: 'tan θ = μ_s', hi: 'tan θ = μ_s' },
      { en: 'cot θ = μ_s', hi: 'cot θ = μ_s' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Angle of Repose = Angle of Friction ⇒ tan θ = μ_s!',
      hi: 'विराम कोण = घर्षण कोण ⇒ tan θ = μ_s।',
    },
    solution: {
      en: 'At limiting equilibrium on an incline, mg sin θ = μ_s mg cos θ ⇒ tan θ = μ_s.',
      hi: 'सीमांत संतुलन में mg sin θ = μ_s mg cos θ ⇒ tan θ = μ_s।',
    },
  },
  {
    id: 'afx-04-3',
    chapterId: 'laws-of-motion',
    simId: 'banking-roads',
    yearTag: 'IAF 2022',
    questionType: 'Direct Formula',
    question: {
      en: 'Maximum safe speed of a car on a flat circular road of radius r with friction coefficient μ is:',
      hi: 'त्रिज्या r तथा घर्षण गुणांक μ वाली समतल वृत्ताकार सड़क पर कार की अधिकतम सुरक्षित चाल है:',
    },
    options: [
      { en: '√(μ·r·g)', hi: '√(μ·r·g)' },
      { en: 'μ·r·g', hi: 'μ·r·g' },
      { en: '√(r·g / μ)', hi: '√(r·g / μ)' },
      { en: '√(2·μ·r·g)', hi: '√(2·μ·r·g)' },
    ],
    correctIndex: 0,
    shortcut20s: {
      en: 'mv²/r = μmg ⇒ v_max = √(μrg) (independent of car mass m!).',
      hi: 'mv²/r = μmg ⇒ v_max = √(μrg)।',
    },
    solution: {
      en: 'Friction supplies centripetal force: mv²/r ≤ μmg ⇒ v_max = √(μrg).',
      hi: 'अभिकेंद्र बल घर्षण से मिलता है: mv²/r = μmg ⇒ v_max = √(μrg)।',
    },
  },
  {
    id: 'afx-04-4',
    chapterId: 'laws-of-motion',
    simId: 'newtons-force',
    yearTag: 'IAF 2021',
    questionType: 'Concept Trap',
    question: {
      en: 'Rocket propulsion works on the principle of conservation of:',
      hi: 'रॉकेट नोदन (Rocket Propulsion) किस संरक्षण नियम पर कार्य करता है?',
    },
    options: [
      { en: 'Mass', hi: 'द्रव्यमान' },
      { en: 'Energy', hi: 'ऊर्जा' },
      { en: 'Linear Momentum', hi: 'रैखिक संवेग' },
      { en: 'Angular Momentum', hi: 'कोणीय संवेग' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Rocket exhaust goes down, rocket pushes up ⇒ Conservation of Linear Momentum (Newton’s 3rd Law).',
      hi: 'रॉकेट नोदन रैखिक संवेग संरक्षण पर आधारित है।',
    },
    solution: {
      en: 'High-speed exhaust gases carry downward momentum, imparting equal upward momentum to the rocket.',
      hi: 'नीचे निकलती गैसें रॉकेट को विपरीत दिशा में समान संवेग प्रदान करती हैं।',
    },
  },

  // CH 05: WORK, ENERGY & POWER
  {
    id: 'afx-05-1',
    chapterId: 'work-energy',
    simId: 'work-energy',
    yearTag: 'IAF 2024',
    questionType: 'Ratio Trick',
    question: {
      en: 'If linear momentum of a body is increased by 50%, its kinetic energy increases by:',
      hi: 'यदि किसी पिंड का रैखिक संवेग 50% बढ़ा दिया जाए, तो उसकी गतिज ऊर्जा कितने प्रतिशत बढ़ेगी?',
    },
    options: [
      { en: '50%', hi: '50%' },
      { en: '100%', hi: '100%' },
      { en: '125%', hi: '125%' },
      { en: '225%', hi: '225%' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'K ∝ p²! Successive trick: ΔK% = 2x + x²/100 = 2(50) + 2500/100 = 125%!',
      hi: 'शॉर्टकट: ΔK% = 2x + x²/100 = 100 + 25 = 125%!',
    },
    solution: {
      en: 'p′ = 1.5p ⇒ K′ = (1.5)²K = 2.25K ⇒ Increase = (2.25 − 1) × 100% = 125%.',
      hi: 'p′ = 1.5p होने पर K′ = 2.25K, अतः वृद्धि = 125%।',
    },
  },
  {
    id: 'afx-05-2',
    chapterId: 'work-energy',
    simId: 'work-power-basic',
    yearTag: 'IAF 2023',
    questionType: 'Direct Formula',
    question: {
      en: '1 kilowatt-hour (1 kWh) is a unit of energy equal to:',
      hi: '1 किलोवाट-घंटा (1 kWh) ऊर्जा का मात्रक है, जिसका मान होता है:',
    },
    options: [
      { en: '3.6 × 10⁵ J', hi: '3.6 × 10⁵ J' },
      { en: '3.6 × 10⁶ J', hi: '3.6 × 10⁶ J' },
      { en: '3.6 × 10⁷ J', hi: '3.6 × 10⁷ J' },
      { en: '1000 W', hi: '1000 W' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: '1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ J = 3.6 MJ (Unit of ENERGY, not power!).',
      hi: '1 kWh = 1000 × 3600 = 3.6 × 10⁶ J (ऊर्जा का मात्रक)।',
    },
    solution: {
      en: '1 kWh = (1000 J/s) × (3600 s) = 3.6 × 10⁶ Joules.',
      hi: '1 kWh = 1000 J/s × 3600 s = 3.6 × 10⁶ जूल।',
    },
  },
  {
    id: 'afx-05-3',
    chapterId: 'work-energy',
    simId: 'work-power-basic',
    yearTag: 'IAF 2022',
    questionType: 'Concept Trap',
    question: {
      en: 'Work done by a conservative force over any closed round-trip path is always:',
      hi: 'किसी बंद पथ पर संरक्षी बल (Conservative Force) द्वारा किया गया कुल कार्य सदैव होता है:',
    },
    options: [
      { en: 'Positive', hi: 'धनात्मक' },
      { en: 'Negative', hi: 'ऋणात्मक' },
      { en: 'Zero', hi: 'शून्य' },
      { en: 'Infinite', hi: 'अनंत' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Conservative force (Gravity, Spring, Electrostatic): Path-independent ⇒ Closed loop work = 0!',
      hi: 'संरक्षी बल पथ से स्वतंत्र होता है ⇒ बंद पथ में कुल कार्य = 0।',
    },
    solution: {
      en: 'Work by a conservative force depends only on initial and final states; when they coincide, ΔU = 0 so W = 0.',
      hi: 'प्रारंभिक व अंतिम बिंदु समान होने से स्थितिज ऊर्जा परिवर्तन शून्य तथा कार्य शून्य होता है।',
    },
  },
  {
    id: 'afx-05-4',
    chapterId: 'work-energy',
    simId: 'work-energy',
    yearTag: 'IAF 2020',
    questionType: 'Ratio Trick',
    question: {
      en: 'A light body and a heavy body have the SAME linear momentum. Which one has greater kinetic energy?',
      hi: 'एक हल्के और एक भारी पिंड का रैखिक संवेग समान है। किसकी गतिज ऊर्जा अधिक होगी?',
    },
    options: [
      { en: 'The heavier body', hi: 'भारी पिंड की' },
      { en: 'The lighter body', hi: 'हल्के पिंड की' },
      { en: 'Both have equal KE', hi: 'दोनों की समान होगी' },
      { en: 'Depends on gravity', hi: 'गुरुत्व पर निर्भर' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'K = p²/(2m). For equal p: K ∝ 1/m ⇒ LIGHTER body has MORE kinetic energy!',
      hi: 'K = p²/(2m) ⇒ समान p पर K ∝ 1/m ⇒ हल्के पिंड की गतिज ऊर्जा अधिक!',
    },
    solution: {
      en: 'Since K = p²/(2m), for constant momentum p, kinetic energy is inversely proportional to mass m.',
      hi: 'समान संवेग के लिए K ∝ 1/m, अतः कम द्रव्यमान वाले पिंड की गतिज ऊर्जा अधिक होती है।',
    },
  },

  // CH 06: LINEAR MOMENTUM & COLLISIONS
  {
    id: 'afx-06-1',
    chapterId: 'momentum',
    simId: 'linear-momentum',
    yearTag: 'IAF 2024',
    questionType: 'Concept Trap',
    question: {
      en: 'In a perfectly INELASTIC collision between two bodies:',
      hi: 'दो पिंडों की पूर्णतः अप्रत्यास्थ (Inelastic) टक्कर में:',
    },
    options: [
      { en: 'Both Momentum and Kinetic Energy are conserved', hi: 'संवेग व गतिज ऊर्जा दोनों संरक्षित रहते हैं' },
      { en: 'Only Linear Momentum is conserved; KE is lost', hi: 'केवल रैखिक संवेग संरक्षित रहता है; KE घटती है' },
      { en: 'Only Kinetic Energy is conserved', hi: 'केवल गतिज ऊर्जा संरक्षित रहती है' },
      { en: 'Coefficient of restitution e = 1', hi: 'प्रत्यावस्थान गुणांक e = 1 होता है' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'ALL collisions conserve Linear Momentum! Inelastic (e = 0) loses KE; Elastic (e = 1) conserves both.',
      hi: 'हर टक्कर में संवेग संरक्षित रहता है; अप्रत्यास्थ (e=0) में गतिज ऊर्जा की हानि होती है।',
    },
    solution: {
      en: 'Without external force, momentum is always conserved, while inelastic collisions convert part of KE into heat/deformation (e = 0).',
      hi: 'बाह्य बल न होने पर संवेग सदैव संरक्षित रहता है, जबकि अप्रत्यास्थ टक्कर में KE ऊष्मा में बदलती है।',
    },
  },
  {
    id: 'afx-06-2',
    chapterId: 'momentum',
    simId: 'impulse-momentum',
    yearTag: 'IAF 2023',
    questionType: 'Direct Formula',
    question: {
      en: 'Impulse (J) is dimensionally and physically identical to:',
      hi: 'आवेग (Impulse) का विमीय सूत्र और भौतिक अर्थ किसके समान है?',
    },
    options: [
      { en: 'Rate of change of momentum', hi: 'संवेग परिवर्तन की दर' },
      { en: 'Change in linear momentum (Δp)', hi: 'रैखिक संवेग में परिवर्तन (Δp)' },
      { en: 'Force × Distance', hi: 'बल × दूरी' },
      { en: 'Torque', hi: 'बल आघूर्ण' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'J = F·Δt = Δp [M¹L¹T⁻¹]. Note: Rate of change of p is Force, total change in p is Impulse!',
      hi: 'आवेग J = F·Δt = संवेग परिवर्तन Δp।',
    },
    solution: {
      en: 'By Impulse–Momentum theorem, J = ∫F dt = Δp = m(v − u).',
      hi: 'आवेग–संवेग प्रमेय से J = F·Δt = Δp होता है।',
    },
  },
  {
    id: 'afx-06-3',
    chapterId: 'momentum',
    simId: 'linear-momentum',
    yearTag: 'IAF 2022',
    questionType: 'Direct Formula',
    question: {
      en: 'A 10 g bullet is fired at 400 m/s from a 4 kg rifle. The recoil speed of the rifle is:',
      hi: '4 kg की राइफल से 10 g की गोली 400 m/s से दागी जाती है। राइफल का प्रतिक्षेप वेग है:',
    },
    options: [
      { en: '0.5 m/s', hi: '0.5 m/s' },
      { en: '1.0 m/s', hi: '1.0 m/s' },
      { en: '2.0 m/s', hi: '2.0 m/s' },
      { en: '4.0 m/s', hi: '4.0 m/s' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'V = m·v / M = (0.01 × 400) / 4 = 4 / 4 = 1.0 m/s!',
      hi: 'V = mv/M = (0.01 × 400)/4 = 1.0 m/s।',
    },
    solution: {
      en: 'By conservation of momentum, M·V = m·v ⇒ V = (0.01 kg × 400 m/s) / 4 kg = 1.0 m/s.',
      hi: 'संवेग संरक्षण से V = mv/M = 4/4 = 1.0 m/s।',
    },
  },
  {
    id: 'afx-06-4',
    chapterId: 'momentum',
    simId: 'linear-momentum',
    yearTag: 'IAF 2020',
    questionType: 'Concept Trap',
    question: {
      en: 'Two identical billiard balls collide head-on elastically. After impact, they:',
      hi: 'दो समान द्रव्यमान की गेंदें सम्मुख पूर्णतः प्रत्यास्थ टक्कर करती हैं। टक्कर के बाद वे:',
    },
    options: [
      { en: 'Stick together', hi: 'आपस में चिपक जाती हैं' },
      { en: 'Simply exchange their velocities', hi: 'अपना वेग आपस में बदल लेती हैं' },
      { en: 'Both come to rest', hi: 'दोनों रुक जाती हैं' },
      { en: 'Double their speed', hi: 'चाल दोगुनी कर लेती हैं' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Equal mass + Elastic head-on collision (e = 1) ⇒ Complete velocity exchange!',
      hi: 'समान द्रव्यमान + प्रत्यास्थ टक्कर ⇒ वेगों का पूर्ण आदान-प्रदान!',
    },
    solution: {
      en: 'When m₁ = m₂ and e = 1, the collision equations simplify to v₁ = u₂ and v₂ = u₁.',
      hi: 'm₁ = m₂ और e = 1 होने पर v₁ = u₂ तथा v₂ = u₁ हो जाता है।',
    },
  },

  // CH 07: ROTATIONAL MOTION
  {
    id: 'afx-07-1',
    chapterId: 'rotational',
    simId: 'angular-momentum',
    yearTag: 'IAF 2024',
    questionType: 'Concept Trap',
    question: {
      en: 'An ice skater spinning with outstretched arms pulls them inward. Her angular speed ω increases because:',
      hi: 'घूमती हुई स्केटर अपनी बाहें अंदर खींचती है तो उसकी कोणीय चाल ω बढ़ जाती है क्योंकि:',
    },
    options: [
      { en: 'External torque increases', hi: 'बाह्य बल आघूर्ण बढ़ जाता है' },
      { en: 'Moment of inertia I decreases while L = Iω stays conserved', hi: 'जड़त्व आघूर्ण I घटता है और L = Iω संरक्षित रहता है' },
      { en: 'Mass increases', hi: 'द्रव्यमान बढ़ जाता है' },
      { en: 'Kinetic energy stays constant', hi: 'गतिज ऊर्जा नियत रहती है' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'τ_ext = 0 ⇒ L = Iω = const! Pulling arms in ↓I ⇒ ↑ω (and rotational KE = L²/2I actually INCREASES!).',
      hi: 'L = Iω नियत! बाहें खींचने से I घटता है ⇒ ω बढ़ता है।',
    },
    solution: {
      en: 'With zero external torque, L = Iω is conserved; reducing radius reduces I, forcing angular speed ω to increase.',
      hi: 'बाह्य बल आघूर्ण शून्य होने से L = Iω नियत रहता है; I घटने पर ω बढ़ जाता है।',
    },
  },
  {
    id: 'afx-07-2',
    chapterId: 'rotational',
    simId: 'moment-of-inertia',
    yearTag: 'IAF 2023',
    questionType: 'Ratio Trick',
    question: {
      en: 'A solid sphere, a solid disc, and a thin ring of equal mass and radius roll down an incline without slipping. Which reaches the bottom FIRST?',
      hi: 'समान द्रव्यमान व त्रिज्या का ठोस गोला, चकती और पतला वलय आनत तल से बिना फिसले लुढ़कते हैं। सबसे पहले नीचे कौन पहुँचेगा?',
    },
    options: [
      { en: 'Thin Ring', hi: 'पतला वलय' },
      { en: 'Solid Disc', hi: 'ठोस चकती' },
      { en: 'Solid Sphere', hi: 'ठोस गोला' },
      { en: 'All reach simultaneously', hi: 'सभी एक साथ पहुँचेंगे' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Smaller k²/R² wins! Sphere (0.4) < Disc (0.5) < Hollow Sphere (0.67) < Ring (1.0) ⇒ Solid Sphere ALWAYS wins!',
      hi: 'जिसका k²/R² सबसे कम वही जीतेगा: ठोस गोला (0.4) < चकती (0.5) < वलय (1.0)।',
    },
    solution: {
      en: 'Rolling acceleration a = g sin θ / (1 + k²/R²). Solid sphere has the smallest k²/R² = 2/5, hence maximum acceleration.',
      hi: 'a = g sin θ / (1 + k²/R²) के अनुसार ठोस गोले (k²/R² = 2/5) का त्वरण अधिकतम होता है।',
    },
  },
  {
    id: 'afx-07-3',
    chapterId: 'rotational',
    simId: 'moment-of-inertia',
    yearTag: 'IAF 2022',
    questionType: 'Direct Formula',
    question: {
      en: 'The ratio of radii of gyration of a thin ring to a solid disc of the same radius R about their central axis is:',
      hi: 'समान त्रिज्या R वाले पतले वलय और ठोस चकती की घूर्णन त्रिज्याओं (k) का अनुपात है:',
    },
    options: [
      { en: '1 : √2', hi: '1 : √2' },
      { en: '√2 : 1', hi: '√2 : 1' },
      { en: '2 : 1', hi: '2 : 1' },
      { en: '1 : 2', hi: '1 : 2' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'k_ring = R, k_disc = R/√2 ⇒ k_ring / k_disc = √2 : 1!',
      hi: 'k_वलय = R, k_चकती = R/√2 ⇒ अनुपात = √2 : 1।',
    },
    solution: {
      en: 'Since I = Mk², for ring k = R and for disc k = R/√2, giving ratio √2 : 1.',
      hi: 'वलय के लिए k = R और चकती के लिए k = R/√2, अतः अनुपात √2 : 1 है।',
    },
  },
  {
    id: 'afx-07-4',
    chapterId: 'rotational',
    simId: 'angular-momentum',
    yearTag: 'IAF 2021',
    questionType: 'Ratio Trick',
    question: {
      en: 'If Earth suddenly shrinks to HALF its present radius without changing its mass, the duration of a day will become:',
      hi: 'यदि द्रव्यमान अपरिवर्तित रखते हुए पृथ्वी की त्रिज्या अचानक आधी हो जाए, तो दिन की अवधि हो जाएगी:',
    },
    options: [
      { en: '12 hours', hi: '12 घंटे' },
      { en: '6 hours', hi: '6 घंटे' },
      { en: '48 hours', hi: '48 घंटे' },
      { en: '24 hours', hi: '24 घंटे' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'I·ω = const ⇒ R² / T = const ⇒ T ∝ R²! Half R ⇒ T = 24 × (1/2)² = 6 hours!',
      hi: 'T ∝ R² ⇒ त्रिज्या आधी करने पर दिन T = 24 / 4 = 6 घंटे हो जाएगा!',
    },
    solution: {
      en: 'By conservation of angular momentum (2/5)MR²(2π/T) = const ⇒ T ∝ R². With R′ = R/2, T′ = 24/4 = 6 hours.',
      hi: 'L = Iω नियत होने से T ∝ R² ⇒ नया दिन = 24 / 4 = 6 घंटे।',
    },
  },

  // CH 08: GRAVITATION & VARIATION OF g
  {
    id: 'afx-08-1',
    chapterId: 'gravitation',
    simId: 'escape-velocity',
    yearTag: 'IAF 2024',
    questionType: 'Direct Formula',
    question: {
      en: 'The relation between Escape Velocity (v_e) and Orbital Velocity (v_o) near Earth’s surface is:',
      hi: 'पृथ्वी की सतह के निकट पलायन वेग (v_e) और कक्षीय वेग (v_o) के बीच संबंध है:',
    },
    options: [
      { en: 'v_e = 2 · v_o', hi: 'v_e = 2 · v_o' },
      { en: 'v_e = √2 · v_o', hi: 'v_e = √2 · v_o' },
      { en: 'v_e = v_o / √2', hi: 'v_e = v_o / √2' },
      { en: 'v_e = v_o', hi: 'v_e = v_o' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'v_e = √(2gR) = √2 · √(gR) = √2 · v_o (≈ 41.4% higher speed needed to escape!).',
      hi: 'v_e = √2 · v_o (पृथ्वी पर 11.2 km/s = √2 × 7.9 km/s)।',
    },
    solution: {
      en: 'Near surface, v_o = √(gR) ≈ 7.9 km/s and v_e = √(2gR) ≈ 11.2 km/s, so v_e = √2·v_o.',
      hi: 'v_o = √(gR) और v_e = √(2gR), अतः v_e = √2·v_o।',
    },
  },
  {
    id: 'afx-08-2',
    chapterId: 'gravitation',
    simId: 'gravity-variation',
    yearTag: 'IAF 2024',
    questionType: 'Ratio Trick',
    question: {
      en: 'At what height h above Earth’s surface (radius R) does the value of g become one-fourth (g/4) of its surface value?',
      hi: 'पृथ्वी की सतह से किस ऊँचाई h पर गुरुत्वीय त्वरण g का मान सतह के मान का एक-चौथाई (g/4) रह जाएगा?',
    },
    options: [
      { en: 'h = R / 2', hi: 'h = R / 2' },
      { en: 'h = R', hi: 'h = R' },
      { en: 'h = 2R', hi: 'h = 2R' },
      { en: 'h = 4R', hi: 'h = 4R' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'g/n occurs at h = (√n − 1)R! For g/4 (n = 4): h = (√4 − 1)R = R!',
      hi: 'शॉर्टकट: g/n के लिए h = (√n − 1)R ⇒ n = 4 पर h = (2−1)R = R!',
    },
    solution: {
      en: 'g_h = g / (1 + h/R)² = g/4 ⇒ (1 + h/R) = 2 ⇒ h = R.',
      hi: 'g/(1 + h/R)² = g/4 ⇒ 1 + h/R = 2 ⇒ h = R।',
    },
  },
  {
    id: 'afx-08-3',
    chapterId: 'gravitation',
    simId: 'gravity-variation',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'The weight of a 60 kg body taken to the exact CENTER of Earth is:',
      hi: '60 kg द्रव्यमान के पिंड को पृथ्वी के ठीक केंद्र पर ले जाने पर उसका भार होगा:',
    },
    options: [
      { en: '588 N', hi: '588 N' },
      { en: '294 N', hi: '294 N' },
      { en: 'Zero (0 N)', hi: 'शून्य (0 N)' },
      { en: 'Infinite', hi: 'अनंत' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'At depth d = R (center), g_d = g(1 − R/R) = 0 ⇒ Weight = 0 N (Mass still stays 60 kg!).',
      hi: 'पृथ्वी के केंद्र पर g = 0 ⇒ भार = 0 N (द्रव्यमान 60 kg ही रहता है)।',
    },
    solution: {
      en: 'Inside Earth, g_d = g(1 − d/R). At Earth’s center d = R, so g_center = 0 and W = mg = 0.',
      hi: 'केंद्र पर d = R रखने से g = 0 तथा भार W = mg = 0 हो जाता है।',
    },
  },
  {
    id: 'afx-08-4',
    chapterId: 'gravitation',
    simId: 'keplers-laws',
    yearTag: 'IAF 2022',
    questionType: 'Direct Formula',
    question: {
      en: 'The time period and orbital height of a Geostationary satellite above Earth’s equator are:',
      hi: 'भूसमकालिक (Geostationary) उपग्रह का आवर्तकाल और पृथ्वी सतह से ऊँचाई होती है:',
    },
    options: [
      { en: '24 hours, ~36,000 km', hi: '24 घंटे, ~36,000 km' },
      { en: '12 hours, ~18,000 km', hi: '12 घंटे, ~18,000 km' },
      { en: '84.6 minutes, ~6,400 km', hi: '84.6 मिनट, ~6,400 km' },
      { en: '24 hours, ~6,400 km', hi: '24 घंटे, ~6,400 km' },
    ],
    correctIndex: 0,
    shortcut20s: {
      en: 'Geostationary: T = 24 hr, h ≈ 36,000 km (West → East). Close-Earth satellite: T ≈ 84.6 min.',
      hi: 'भूसमकालिक उपग्रह: T = 24 घंटे, ऊँचाई ≈ 36,000 km (पश्चिम से पूर्व)।',
    },
    solution: {
      en: 'A geostationary satellite matches Earth’s 24-hour rotation in the equatorial plane at altitude h ≈ 35,800–36,000 km.',
      hi: 'भूसमकालिक उपग्रह विषुवत तल में 24 घंटे के आवर्तकाल के साथ ~36,000 km ऊँचाई पर घूमता है।',
    },
  },

  // CH 09: SOLIDS & ELASTICITY
  {
    id: 'afx-09-1',
    chapterId: 'solids-elasticity',
    simId: 'solids-elasticity',
    yearTag: 'IAF 2024',
    questionType: 'Concept Trap',
    question: {
      en: 'Between Steel and Rubber, which is MORE elastic in physics?',
      hi: 'भौतिकी के अनुसार स्टील (Steel) और रबर (Rubber) में कौन अधिक प्रत्यास्थ (Elastic) है?',
    },
    options: [
      { en: 'Rubber, because it stretches more', hi: 'रबर, क्योंकि यह अधिक खिंचती है' },
      { en: 'Steel, because its Young’s modulus Y is much larger', hi: 'स्टील, क्योंकि इसका यंग गुणांक Y बहुत अधिक है' },
      { en: 'Both are equally elastic', hi: 'दोनों समान प्रत्यास्थ हैं' },
      { en: 'Neither is elastic', hi: 'कोई नहीं' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Higher Young’s Modulus Y = Higher Elasticity! Steel resists deformation far better than rubber.',
      hi: 'अधिक यंग गुणांक Y = अधिक प्रत्यास्थता ⇒ स्टील रबर से अधिक प्रत्यास्थ है!',
    },
    solution: {
      en: 'For the same tensile stress, steel suffers far smaller strain than rubber, so Y_steel ≫ Y_rubber.',
      hi: 'समान प्रतिबल पर स्टील में विकृति कम होती है, अतः Y_स्टील ≫ Y_रबर।',
    },
  },
  {
    id: 'afx-09-2',
    chapterId: 'solids-elasticity',
    simId: 'solids-elasticity',
    yearTag: 'IAF 2023',
    questionType: 'Direct Formula',
    question: {
      en: 'The SI unit and dimensional formula of Young’s Modulus Y are identical to those of:',
      hi: 'यंग प्रत्यास्थता गुणांक Y का SI मात्रक और विमीय सूत्र किसके समान है?',
    },
    options: [
      { en: 'Force', hi: 'बल' },
      { en: 'Pressure / Stress (N/m² or Pa)', hi: 'दाब / प्रतिबल (N/m² या Pa)' },
      { en: 'Surface Tension', hi: 'पृष्ठ तनाव' },
      { en: 'Energy', hi: 'ऊर्जा' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Strain is dimensionless ⇒ [Y] = [Stress] = [Pressure] = [M¹L⁻¹T⁻²] (Pa).',
      hi: 'विकृति विमाहीन है ⇒ [Y] = [प्रतिबल] = [दाब] = [M¹L⁻¹T⁻²]।',
    },
    solution: {
      en: 'Y = Stress / Strain. Since strain ΔL/L has no unit, Y shares Pressure’s unit N/m² (Pascal).',
      hi: 'Y = प्रतिबल / विकृति; विकृति मात्रकहीन होने से Y का मात्रक दाब (N/m²) के समान है।',
    },
  },
  {
    id: 'afx-09-3',
    chapterId: 'solids-elasticity',
    simId: 'solids-elasticity',
    yearTag: 'IAF 2021',
    questionType: 'Concept Trap',
    question: {
      en: 'The theoretical value of Poisson’s ratio σ lies between:',
      hi: 'पॉइसन अनुपात (Poisson’s ratio σ) का सैद्धांतिक मान किनके बीच होता है?',
    },
    options: [
      { en: '−1 and +0.5', hi: '−1 और +0.5' },
      { en: '0 and +1', hi: '0 और +1' },
      { en: '−0.5 and +1', hi: '−0.5 और +1' },
      { en: '0.5 and 2.0', hi: '0.5 और 2.0' },
    ],
    correctIndex: 0,
    shortcut20s: {
      en: 'Theoretical: −1 to +0.5; Practical metals: 0 to +0.5 (most metals ~0.2–0.4).',
      hi: 'सैद्धांतिक सीमा: −1 से +0.5; व्यावहारिक सीमा: 0 से +0.5।',
    },
    solution: {
      en: 'From Y = 3K(1 − 2σ) = 2η(1 + σ), positive K and η require −1 < σ < 0.5.',
      hi: 'Y = 3K(1−2σ) = 2η(1+σ) से सैद्धांतिक सीमा −1 से +0.5 प्राप्त होती है।',
    },
  },
  {
    id: 'afx-09-4',
    chapterId: 'solids-elasticity',
    simId: 'solids-elasticity',
    yearTag: 'IAF 2020',
    questionType: 'Direct Formula',
    question: {
      en: 'Elastic potential energy stored per unit volume (energy density) in a stretched wire is:',
      hi: 'खिंचे हुए तार के प्रति एकांक आयतन में संचित प्रत्यास्थ स्थितिज ऊर्जा है:',
    },
    options: [
      { en: 'Stress × Strain', hi: 'प्रतिबल × विकृति' },
      { en: '½ × Stress × Strain', hi: '½ × प्रतिबल × विकृति' },
      { en: '2 × Stress × Strain', hi: '2 × प्रतिबल × विकृति' },
      { en: 'Stress / Strain', hi: 'प्रतिबल / विकृति' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'u = ½ × Stress × Strain = ½·Y·(Strain)² = (Stress)²/(2Y).',
      hi: 'ऊर्जा घनत्व u = ½ × प्रतिबल × विकृति।',
    },
    solution: {
      en: 'Work done per unit volume is the triangular area under the linear stress–strain curve: u = ½ × Stress × Strain.',
      hi: 'प्रतिबल–विकृति ग्राफ के नीचे त्रिभुज का क्षेत्रफल u = ½ × प्रतिबल × विकृति होता है।',
    },
  },

  // CH 10: FLUIDS, SURFACE TENSION & CAPILLARITY
  {
    id: 'afx-10-1',
    chapterId: 'fluids',
    simId: 'capillary-rise',
    yearTag: 'IAF 2024',
    questionType: 'Ratio Trick',
    question: {
      en: 'The excess pressure inside a SOAP BUBBLE of radius R and surface tension T is:',
      hi: 'त्रिज्या R और पृष्ठ तनाव T वाले साबुन के बुलबुले के भीतर अतिरिक्त दाब होता है:',
    },
    options: [
      { en: '2T / R', hi: '2T / R' },
      { en: '4T / R', hi: '4T / R' },
      { en: 'T / R', hi: 'T / R' },
      { en: '8T / R', hi: '8T / R' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Liquid drop (1 surface) = 2T/R; Soap bubble in air (2 free surfaces) = 4T/R! Smaller bubble has HIGHER pressure!',
      hi: 'द्रव बूँद = 2T/R; साबुन का बुलबुला (2 मुक्त पृष्ठ) = 4T/R!',
    },
    solution: {
      en: 'A soap bubble has both inner and outer air-liquid interfaces, doubling excess pressure to ΔP = 4T/R.',
      hi: 'साबुन के बुलबुले में दो मुक्त पृष्ठ होते हैं, अतः ΔP = 4T/R होता है।',
    },
  },
  {
    id: 'afx-10-2',
    chapterId: 'fluids',
    simId: 'stokes-terminal',
    yearTag: 'IAF 2023',
    questionType: 'Ratio Trick',
    question: {
      en: 'Terminal velocity v_t of a small spherical raindrop falling through viscous air depends on its radius r as:',
      hi: 'श्यान वायु में गिरती छोटी गोलाकार वर्षा की बूँद का सीमांत वेग v_t उसकी त्रिज्या r पर कैसे निर्भर करता है?',
    },
    options: [
      { en: 'v_t ∝ r', hi: 'v_t ∝ r' },
      { en: 'v_t ∝ r²', hi: 'v_t ∝ r²' },
      { en: 'v_t ∝ 1/r', hi: 'v_t ∝ 1/r' },
      { en: 'v_t ∝ 1/r²', hi: 'v_t ∝ 1/r²' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Stokes Law: v_t = (2r²(ρ−σ)g)/(9η) ⇒ v_t ∝ r²! Double radius ⇒ 4× terminal speed!',
      hi: 'स्टोक्स नियम से v_t ∝ r² (त्रिज्या दोगुनी ⇒ सीमांत वेग 4 गुना)।',
    },
    solution: {
      en: 'Equating net weight to viscous drag 6πηrv_t gives v_t = 2r²(ρ − σ)g / (9η), so v_t ∝ r².',
      hi: 'भार को श्यान बल 6πηrv_t के बराबर करने पर v_t ∝ r² प्राप्त होता है।',
    },
  },
  {
    id: 'afx-10-3',
    chapterId: 'fluids',
    simId: 'fluids',
    yearTag: 'IAF 2022',
    questionType: 'Concept Trap',
    question: {
      en: 'Bernoulli’s theorem is a direct consequence of the conservation of:',
      hi: 'बर्नौली की प्रमेय किसके संरक्षण नियम का सीधा परिणाम है?',
    },
    options: [
      { en: 'Mass', hi: 'द्रव्यमान' },
      { en: 'Momentum', hi: 'संवेग' },
      { en: 'Energy', hi: 'ऊर्जा' },
      { en: 'Angular Momentum', hi: 'कोणीय संवेग' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Continuity (A₁v₁ = A₂v₂) = Conservation of MASS; Bernoulli (P + ½ρv² + ρgh = C) = Conservation of ENERGY!',
      hi: 'सांतत्य समीकरण = द्रव्यमान संरक्षण; बर्नौली प्रमेय = ऊर्जा संरक्षण!',
    },
    solution: {
      en: 'Bernoulli’s equation states that pressure energy + kinetic energy + potential energy per unit volume remains constant.',
      hi: 'बर्नौली समीकरण एकांक आयतन की दाब, गतिज व स्थितिज ऊर्जाओं के योग को नियत बताता है।',
    },
  },
  {
    id: 'afx-10-4',
    chapterId: 'fluids',
    simId: 'capillary-rise',
    yearTag: 'IAF 2021',
    questionType: 'Concept Trap',
    question: {
      en: 'As temperature of a liquid increases, its Surface Tension generally:',
      hi: 'किसी द्रव का तापमान बढ़ाने पर उसका पृष्ठ तनाव (Surface Tension) सामान्यतः:',
    },
    options: [
      { en: 'Increases', hi: 'बढ़ता है' },
      { en: 'Decreases (becomes zero at critical temperature)', hi: 'घटता है (क्रांतिक ताप पर शून्य हो जाता है)' },
      { en: 'Remains unchanged', hi: 'अपरिवर्तित रहता है' },
      { en: 'Becomes infinite', hi: 'अनंत हो जाता है' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Higher Temp ⇒ weaker cohesion ⇒ LOWER surface tension (that’s why hot soup tastes better & hot water cleans better!).',
      hi: 'ताप बढ़ने पर ससंजक बल घटता है ⇒ पृष्ठ तनाव घटता है।',
    },
    solution: {
      en: 'Rising thermal agitation weakens cohesive intermolecular forces, lowering surface tension until it vanishes at critical temperature.',
      hi: 'ताप बढ़ने से अणुओं के बीच आकर्षण घटता है, जिससे पृष्ठ तनाव घटता है।',
    },
  },

  // CH 11: THERMAL PROPERTIES, WIEN & STEFAN
  {
    id: 'afx-11-1',
    chapterId: 'thermal-matter',
    simId: 'blackbody-cooling',
    yearTag: 'IAF 2024',
    questionType: 'Ratio Trick',
    question: {
      en: 'If the absolute temperature (in Kelvin) of a blackbody is DOUBLED, its radiated power increases by a factor of:',
      hi: 'यदि किसी कृष्णिका का परम ताप (केल्विन में) दोगुना कर दिया जाए, तो उसकी विकिरण शक्ति कितने गुना हो जाएगी?',
    },
    options: [
      { en: '2 times', hi: '2 गुना' },
      { en: '4 times', hi: '4 गुना' },
      { en: '8 times', hi: '8 गुना' },
      { en: '16 times', hi: '16 गुना' },
    ],
    correctIndex: 3,
    shortcut20s: {
      en: 'Stefan–Boltzmann Law: E = σT⁴ ⇒ 2⁴ = 16 times! (Be sure T is in Kelvin, not °C!)',
      hi: 'स्टीफ़न नियम: E ∝ T⁴ ⇒ 2⁴ = 16 गुना!',
    },
    solution: {
      en: 'By Stefan–Boltzmann law, E = σT⁴. Doubling T multiplies radiated energy by 2⁴ = 16.',
      hi: 'E = σT⁴ के अनुसार परम ताप दोगुना होने पर ऊर्जा 2⁴ = 16 गुनी हो जाती है।',
    },
  },
  {
    id: 'afx-11-2',
    chapterId: 'thermal-matter',
    simId: 'blackbody-cooling',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'The color of a star directly indicates its surface temperature according to:',
      hi: 'किसी तारे का रंग सीधे उसके पृष्ठ तापमान को किस नियम के अनुसार दर्शाता है?',
    },
    options: [
      { en: 'Newton’s law of cooling', hi: 'न्यूटन का शीतलन नियम' },
      { en: 'Wien’s displacement law (λ_m · T = b)', hi: 'वीन का विस्थापन नियम (λ_m · T = b)' },
      { en: 'Kirchhoff’s current law', hi: 'किरचॉफ़ का धारा नियम' },
      { en: 'Boyle’s law', hi: 'बॉयल का नियम' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Wien’s Law: λ_m·T = const ⇒ Shorter λ (Blue star) = HOTTER than Red star!',
      hi: 'वीन का विस्थापन नियम: λ_m ∝ 1/T (नीला तारा लाल तारे से अधिक गर्म)।',
    },
    solution: {
      en: 'Wien’s displacement law relates peak emission wavelength (color) inversely to surface temperature: λ_m·T = 2.898×10⁻³ m·K.',
      hi: 'वीन के नियम λ_m·T = b से तारे के रंग द्वारा उसका तापमान ज्ञात किया जाता है।',
    },
  },
  {
    id: 'afx-11-3',
    chapterId: 'thermal-matter',
    simId: 'thermal-matter',
    yearTag: 'IAF 2022',
    questionType: 'Direct Formula',
    question: {
      en: 'At what temperature do Celsius (°C) and Fahrenheit (°F) scales show the exact same numerical reading?',
      hi: 'किस तापमान पर सेल्सियस (°C) और फ़ारेनहाइट (°F) पैमाने एक ही पाठ्यांक दर्शाते हैं?',
    },
    options: [
      { en: '0°', hi: '0°' },
      { en: '−40°', hi: '−40°' },
      { en: '−273°', hi: '−273°' },
      { en: '+40°', hi: '+40°' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Classic IAF 3-second recall: −40°C = −40°F! (Also 574.25 for °F = K).',
      hi: 'सीधा याद रखें: −40°C = −40°F!',
    },
    solution: {
      en: 'Setting C = F in C/5 = (F − 32)/9 gives 9x = 5x − 160 ⇒ 4x = −160 ⇒ x = −40°.',
      hi: 'C/5 = (C−32)/9 हल करने पर C = F = −40° आता है।',
    },
  },
  {
    id: 'afx-11-4',
    chapterId: 'thermal-matter',
    simId: 'thermal-matter',
    yearTag: 'IAF 2021',
    questionType: 'Ratio Trick',
    question: {
      en: 'The ratio of linear (α), superficial (β), and volumetric (γ) expansion coefficients of an isotropic solid is:',
      hi: 'किसी ठोस के रेखीय (α), क्षेत्रीय (β) और आयतन (γ) प्रसार गुणांकों का अनुपात है:',
    },
    options: [
      { en: '1 : 1 : 1', hi: '1 : 1 : 1' },
      { en: '1 : 2 : 3', hi: '1 : 2 : 3' },
      { en: '1 : 3 : 2', hi: '1 : 3 : 2' },
      { en: '3 : 2 : 1', hi: '3 : 2 : 1' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'α : β : γ = 1 : 2 : 3 (Remember β = 2α and γ = 3α).',
      hi: 'α : β : γ = 1 : 2 : 3 (β = 2α, γ = 3α)।',
    },
    solution: {
      en: 'For small thermal expansion of isotropic solids, β = 2α and γ = 3α, giving 1 : 2 : 3.',
      hi: 'समदैशिक ठोस के लिए β = 2α और γ = 3α, अतः अनुपात 1 : 2 : 3 है।',
    },
  },

  // CH 12: THERMODYNAMICS
  {
    id: 'afx-12-1',
    chapterId: 'thermodynamics',
    simId: 'carnot-engine',
    yearTag: 'IAF 2024',
    questionType: 'Direct Formula',
    question: {
      en: 'A Carnot engine operates between 327°C and 27°C. Its maximum theoretical efficiency is:',
      hi: 'एक कार्नोट इंजन 327°C और 27°C के बीच कार्य करता है। इसकी अधिकतम दक्षता है:',
    },
    options: [
      { en: '25%', hi: '25%' },
      { en: '50%', hi: '50%' },
      { en: '75%', hi: '75%' },
      { en: '91.7%', hi: '91.7%' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'ALWAYS convert to Kelvin! T₁ = 600 K, T₂ = 300 K ⇒ η = 1 − 300/600 = 50%!',
      hi: 'हमेशा केल्विन में बदलें: T₁ = 600 K, T₂ = 300 K ⇒ η = 1 − 300/600 = 50%!',
    },
    solution: {
      en: 'T₁ = 327 + 273 = 600 K, T₂ = 27 + 273 = 300 K. Efficiency η = (1 − T₂/T₁) × 100% = 50%.',
      hi: 'T₁ = 600 K और T₂ = 300 K, अतः η = (1 − 300/600) × 100% = 50%।',
    },
  },
  {
    id: 'afx-12-2',
    chapterId: 'thermodynamics',
    simId: 'thermodynamics',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'In an ISOTHERMAL process of an ideal gas, which quantity remains zero?',
      hi: 'आदर्श गैस के समतापी (Isothermal) प्रक्रम में कौन-सी राशि शून्य रहती है?',
    },
    options: [
      { en: 'Work done W', hi: 'किया गया कार्य W' },
      { en: 'Change in internal energy ΔU', hi: 'आंतरिक ऊर्जा में परिवर्तन ΔU' },
      { en: 'Heat exchanged ΔQ', hi: 'ऊष्मा विनिमय ΔQ' },
      { en: 'Pressure change ΔP', hi: 'दाब परिवर्तन ΔP' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Isothermal ⇒ ΔT = 0 ⇒ ΔU = 0 ⇒ ΔQ = W! (Adiabatic ⇒ ΔQ = 0; Isochoric ⇒ W = 0).',
      hi: 'समतापी: ΔT = 0 ⇒ ΔU = 0; रुद्धोष्म: ΔQ = 0; समआयतनी: W = 0।',
    },
    solution: {
      en: 'Internal energy of an ideal gas depends purely on temperature. At constant T, ΔU = 0 so ΔQ = W.',
      hi: 'आदर्श गैस की आंतरिक ऊर्जा केवल ताप पर निर्भर करती है, अतः समतापी में ΔU = 0 होता है।',
    },
  },
  {
    id: 'afx-12-3',
    chapterId: 'thermodynamics',
    simId: 'thermodynamics',
    yearTag: 'IAF 2022',
    questionType: 'Direct Formula',
    question: {
      en: 'Mayer’s relation between molar specific heats C_p and C_v of an ideal gas is:',
      hi: 'आदर्श गैस की मोलर विशिष्ट ऊष्माओं C_p और C_v के बीच मेयर का संबंध है:',
    },
    options: [
      { en: 'C_p + C_v = R', hi: 'C_p + C_v = R' },
      { en: 'C_p − C_v = R', hi: 'C_p − C_v = R' },
      { en: 'C_p / C_v = R', hi: 'C_p / C_v = R' },
      { en: 'C_v − C_p = R', hi: 'C_v − C_p = R' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'C_p > C_v always because constant-pressure heating also does expansion work ⇒ C_p − C_v = R.',
      hi: 'मेयर सूत्र: C_p − C_v = R (हमेशा C_p > C_v)।',
    },
    solution: {
      en: 'For 1 mole of ideal gas, C_p − C_v = R (8.314 J·mol⁻¹·K⁻¹), and γ = C_p / C_v.',
      hi: '1 मोल आदर्श गैस के लिए C_p − C_v = R होता है।',
    },
  },
  {
    id: 'afx-12-4',
    chapterId: 'thermodynamics',
    simId: 'thermodynamics',
    yearTag: 'IAF 2021',
    questionType: 'Concept Trap',
    question: {
      en: 'The ratio of the slope of an Adiabatic P–V curve to an Isothermal P–V curve at the same point is:',
      hi: 'एक ही बिंदु पर रुद्धोष्म वक्र और समतापी वक्र के ढालों (slopes) का अनुपात होता है:',
    },
    options: [
      { en: '1 / γ', hi: '1 / γ' },
      { en: 'γ', hi: 'γ' },
      { en: 'γ²', hi: 'γ²' },
      { en: '1', hi: '1' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Adiabatic slope = −γ(P/V), Isothermal slope = −(P/V) ⇒ Ratio = γ (Adiabatic is ALWAYS steeper!).',
      hi: 'रुद्धोष्म ढाल = γ × समतापी ढाल ⇒ अनुपात = γ।',
    },
    solution: {
      en: 'Differentiating PV^γ = C and PV = C yields (dP/dV)_adia / (dP/dV)_iso = γ > 1.',
      hi: 'रुद्धोष्म वक्र का ढाल समतापी वक्र के ढाल का γ गुना अधिक खड़ा होता है।',
    },
  },

  // CH 13: KINETIC THEORY OF GASES
  {
    id: 'afx-13-1',
    chapterId: 'kinetic-theory',
    simId: 'kinetic-theory',
    yearTag: 'IAF 2024',
    questionType: 'Ratio Trick',
    question: {
      en: 'If the absolute temperature of an ideal gas is made 4 times, the RMS speed of its molecules becomes:',
      hi: 'यदि आदर्श गैस का परम ताप 4 गुना कर दिया जाए, तो उसके अणुओं की वर्ग माध्य मूल (RMS) चाल हो जाएगी:',
    },
    options: [
      { en: 'Half', hi: 'आधी' },
      { en: 'Double (2×)', hi: 'दोगुनी (2×)' },
      { en: '4 times', hi: '4 गुनी' },
      { en: '16 times', hi: '16 गुनी' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'v_rms = √(3RT/M) ⇒ v_rms ∝ √T! 4× Kelvin temp ⇒ √4 = 2× RMS speed!',
      hi: 'v_rms ∝ √T ⇒ ताप 4 गुना करने पर RMS चाल √4 = 2 गुनी हो जाती है!',
    },
    solution: {
      en: 'Since v_rms = √(3RT/M), quadrupling Kelvin temperature T doubles v_rms.',
      hi: 'v_rms = √(3RT/M) के अनुसार T को 4 गुना करने पर v_rms दोगुनी हो जाती है।',
    },
  },
  {
    id: 'afx-13-2',
    chapterId: 'kinetic-theory',
    simId: 'kinetic-theory',
    yearTag: 'IAF 2023',
    questionType: 'Direct Formula',
    question: {
      en: 'The adiabatic index γ = C_p / C_v for a monoatomic ideal gas (like Helium or Argon) is:',
      hi: 'एकपरमाणुक आदर्श गैस (जैसे He, Ar) के लिए रुद्धोष्म गुणांक γ = C_p / C_v का मान है:',
    },
    options: [
      { en: '1.67 (5/3)', hi: '1.67 (5/3)' },
      { en: '1.40 (7/5)', hi: '1.40 (7/5)' },
      { en: '1.33 (4/3)', hi: '1.33 (4/3)' },
      { en: '1.00', hi: '1.00' },
    ],
    correctIndex: 0,
    shortcut20s: {
      en: 'γ = 1 + 2/f! Mono (f=3) → 1.67; Diatomic (f=5) → 1.40; Poly (f=6) → 1.33.',
      hi: 'γ = 1 + 2/f: एकपरमाणुक (f=3) → 5/3 = 1.67; द्विपरमाणुक → 1.40।',
    },
    solution: {
      en: 'Monoatomic gas has f = 3 translational degrees of freedom, so γ = 1 + 2/3 = 5/3 ≈ 1.67.',
      hi: 'f = 3 होने के कारण γ = 1 + 2/3 = 5/3 = 1.67।',
    },
  },
  {
    id: 'afx-13-3',
    chapterId: 'kinetic-theory',
    simId: 'kinetic-theory',
    yearTag: 'IAF 2022',
    questionType: 'Direct Formula',
    question: {
      en: 'Average translational kinetic energy per molecule of an ideal gas at absolute temperature T is:',
      hi: 'परम ताप T पर आदर्श गैस के प्रति अणु की औसत स्थानांतरीय गतिज ऊर्जा है:',
    },
    options: [
      { en: '½ k_B T', hi: '½ k_B T' },
      { en: '(3/2) k_B T', hi: '(3/2) k_B T' },
      { en: '(5/2) k_B T', hi: '(5/2) k_B T' },
      { en: '(3/2) R T', hi: '(3/2) R T' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Per MOLECULE uses Boltzmann k_B → (3/2)k_B T! Per MOLE uses R → (3/2)RT!',
      hi: 'प्रति अणु = (3/2)k_B T; प्रति मोल = (3/2)RT (विकल्प ध्यान से देखें!)।',
    },
    solution: {
      en: 'By equipartition across 3 translational axes, each molecule carries 3 × (½ k_B T) = (3/2)k_B T.',
      hi: 'ऊर्जा समविभाजन नियम से प्रति अणु गतिज ऊर्जा (3/2)k_B T होती है।',
    },
  },
  {
    id: 'afx-13-4',
    chapterId: 'kinetic-theory',
    simId: 'kinetic-theory',
    yearTag: 'IAF 2020',
    questionType: 'Concept Trap',
    question: {
      en: 'For a given gas at temperature T, the correct ascending order of molecular speeds is:',
      hi: 'नियत ताप T पर गैस के अणुओं की चालों का सही बढ़ता क्रम है:',
    },
    options: [
      { en: 'v_rms < v_avg < v_mp', hi: 'v_rms < v_avg < v_mp' },
      { en: 'v_mp < v_avg < v_rms', hi: 'v_mp < v_avg < v_rms' },
      { en: 'v_avg < v_mp < v_rms', hi: 'v_avg < v_mp < v_rms' },
      { en: 'All three are equal', hi: 'तीनों समान हैं' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Mnemonic “MAR” (reverse): RMS > Avg > Most Probable (√3 > √2.55 > √2 ⇒ 1.73 > 1.60 > 1.41).',
      hi: 'v_mp (√2) < v_avg (√2.55) < v_rms (√3) — RMS हमेशा सबसे बड़ा!',
    },
    solution: {
      en: 'v_mp = √(2RT/M), v_avg = √(8RT/πM), v_rms = √(3RT/M), so v_mp < v_avg < v_rms.',
      hi: '√2 < √(8/π) < √3 होने के कारण v_mp < v_avg < v_rms।',
    },
  },

  // CH 14: OSCILLATIONS & SHM
  {
    id: 'afx-14-1',
    chapterId: 'oscillations',
    simId: 'simple-pendulum',
    yearTag: 'IAF 2024',
    questionType: 'Concept Trap',
    question: {
      en: 'A simple pendulum with a hollow bob filled with water leaks slowly. Its time period T will:',
      hi: 'पानी से भरे खोखले गोलक वाले सरल लोलक से पानी धीरे-धीरे रिसता है। इसका आवर्तकाल T:',
    },
    options: [
      { en: 'Continuously decrease', hi: 'लगातार घटेगा' },
      { en: 'Continuously increase', hi: 'लगातार बढ़ेगा' },
      { en: 'First increase, then decrease back to its original value', hi: 'पहले बढ़ेगा, फिर घटकर मूल मान पर आ जाएगा' },
      { en: 'Stay strictly constant', hi: 'बिल्कुल नियत रहेगा' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Top IAF Classic! Center of mass drops as water drains (L↑ ⇒ T↑), then jumps back to center when empty (T returns)!',
      hi: 'पानी गिरने से द्रव्यमान केंद्र नीचे जाता है (L↑ ⇒ T↑), खाली होने पर पुनः केंद्र पर लौट आता है!',
    },
    solution: {
      en: 'Effective length L is measured to the center of mass. As water drains, COM lowers (increasing L & T), then returns to the geometric center when completely empty.',
      hi: 'प्रभावी लंबाई L पहले बढ़ती है (T बढ़ता है) और गोलक खाली होने पर पुनः प्रारंभिक मान पर लौट आती है।',
    },
  },
  {
    id: 'afx-14-2',
    chapterId: 'oscillations',
    simId: 'simple-pendulum',
    yearTag: 'IAF 2023',
    questionType: 'Direct Formula',
    question: {
      en: 'The length of a Seconds Pendulum (time period T = 2 s) on Earth’s surface is approximately:',
      hi: 'पृथ्वी की सतह पर सेकंड लोलक (T = 2 s) की लंबाई लगभग होती है:',
    },
    options: [
      { en: '0.25 m', hi: '0.25 m' },
      { en: '0.50 m', hi: '0.50 m' },
      { en: '1.00 m (~99.3 cm)', hi: '1.00 m (~99.3 cm)' },
      { en: '2.00 m', hi: '2.00 m' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'T = 2 = 2π√(L/g) ⇒ L = g/π² ≈ 9.8/9.87 ≈ 0.993 m ≈ 1 m!',
      hi: 'L = g/π² ≈ 9.8/9.87 ≈ 1 मीटर (सेकंड लोलक)!',
    },
    solution: {
      en: 'For T = 2 s, 4 = 4π²L/g ⇒ L = g/π² ≈ 0.993 m ≈ 1 m.',
      hi: 'T = 2 s रखने पर L = g/π² ≈ 0.993 m ≈ 1 m आता है।',
    },
  },
  {
    id: 'afx-14-3',
    chapterId: 'oscillations',
    simId: 'simple-pendulum',
    yearTag: 'IAF 2022',
    questionType: 'Concept Trap',
    question: {
      en: 'If a simple pendulum is taken inside an artificial satellite orbiting Earth, its time period becomes:',
      hi: 'यदि सरल लोलक को पृथ्वी की परिक्रमा करते कृत्रिम उपग्रह में ले जाया जाए, तो उसका आवर्तकाल हो जाएगा:',
    },
    options: [
      { en: 'Zero', hi: 'शून्य' },
      { en: 'Infinite (does not oscillate)', hi: 'अनंत (दोलन नहीं करेगा)' },
      { en: '2 seconds', hi: '2 सेकंड' },
      { en: 'Half its Earth value', hi: 'पृथ्वी के मान का आधा' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Inside satellite g_eff = 0 ⇒ T = 2π√(L/0) = ∞ (weightlessness stops pendulum, but spring-mass still oscillates!).',
      hi: 'उपग्रह में g_eff = 0 ⇒ T = ∞ (किंतु स्प्रिंग-लोलक चलता रहता है!)।',
    },
    solution: {
      en: 'Due to free fall inside an orbiting satellite, g_eff = 0, making T = 2π√(L/g_eff) → ∞.',
      hi: 'भारहीनता (g_eff = 0) के कारण सरल लोलक का आवर्तकाल अनंत हो जाता है।',
    },
  },
  {
    id: 'afx-14-4',
    chapterId: 'oscillations',
    simId: 'shm-spring',
    yearTag: 'IAF 2021',
    questionType: 'Ratio Trick',
    question: {
      en: 'In SHM of amplitude A, at what displacement x from mean position are Kinetic Energy and Potential Energy EQUAL?',
      hi: 'आयाम A की सरल आवर्त गति में माध्य स्थिति से किस विस्थापन x पर गतिज व स्थितिज ऊर्जा बराबर होती हैं?',
    },
    options: [
      { en: 'A / 2', hi: 'A / 2' },
      { en: 'A / √2', hi: 'A / √2' },
      { en: 'A / 4', hi: 'A / 4' },
      { en: '√3·A / 2', hi: '√3·A / 2' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'U = ½E ⇒ ½kx² = ½(½kA²) ⇒ x = A/√2 ≈ 0.707A!',
      hi: 'KE = PE होने पर x = A/√2 (सदा याद रखें!)।',
    },
    solution: {
      en: 'Setting ½mω²(A² − x²) = ½mω²x² gives 2x² = A² ⇒ x = ±A/√2.',
      hi: 'A² − x² = x² हल करने पर x = A/√2 प्राप्त होता है।',
    },
  },

  // CH 15: WAVES, ORGAN PIPES & DOPPLER
  {
    id: 'afx-15-1',
    chapterId: 'waves',
    simId: 'organ-pipes-beats',
    yearTag: 'IAF 2024',
    questionType: 'Ratio Trick',
    question: {
      en: 'The ratio of fundamental frequency of an OPEN organ pipe to a CLOSED organ pipe of the same length L is:',
      hi: 'समान लंबाई L वाले खुले ऑर्गन पाइप और बंद ऑर्गन पाइप की मूल आवृत्तियों का अनुपात है:',
    },
    options: [
      { en: '1 : 2', hi: '1 : 2' },
      { en: '2 : 1', hi: '2 : 1' },
      { en: '1 : 3', hi: '1 : 3' },
      { en: '4 : 1', hi: '4 : 1' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'f_open = v/(2L), f_closed = v/(4L) ⇒ f_open / f_closed = 2 : 1!',
      hi: 'f_खुला / f_बंद = (v/2L) / (v/4L) = 2 : 1!',
    },
    solution: {
      en: 'Open pipe fundamental is v/(2L), which is twice the closed pipe fundamental v/(4L).',
      hi: 'खुले पाइप की मूल आवृत्ति बंद पाइप की ठीक दोगुनी (2 : 1) होती है।',
    },
  },
  {
    id: 'afx-15-2',
    chapterId: 'waves',
    simId: 'doppler-effect',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'Which phenomenon is shown by LIGHT waves (transverse) but NOT by SOUND waves in air (longitudinal)?',
      hi: 'कौन-सी घटना प्रकाश तरंगों (अनुप्रस्थ) में होती है लेकिन वायु में ध्वनि तरंगों (अनुदैर्ध्य) में नहीं?',
    },
    options: [
      { en: 'Interference', hi: 'व्यतिकरण' },
      { en: 'Diffraction', hi: 'विवर्तन' },
      { en: 'Polarization', hi: 'ध्रुवण (Polarization)' },
      { en: 'Doppler effect', hi: 'डॉपलर प्रभाव' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'POLARIZATION is the exclusive signature of TRANSVERSE waves (Light/EM) — longitudinal sound CANNOT be polarized!',
      hi: 'ध्रुवण केवल अनुप्रस्थ तरंगों (प्रकाश) में होता है, ध्वनि में नहीं!',
    },
    solution: {
      en: 'Sound waves in air vibrate parallel to propagation (longitudinal), so they cannot be polarized.',
      hi: 'ध्वनि अनुदैर्ध्य तरंग है, अतः इसका ध्रुवण संभव नहीं है।',
    },
  },
  {
    id: 'afx-15-3',
    chapterId: 'waves',
    simId: 'wave-speed-basic',
    yearTag: 'IAF 2022',
    questionType: 'Concept Trap',
    question: {
      en: 'If atmospheric pressure increases at CONSTANT temperature, the speed of sound in air:',
      hi: 'नियत तापमान पर वायुमंडलीय दाब बढ़ाने से वायु में ध्वनि की चाल:',
    },
    options: [
      { en: 'Increases', hi: 'बढ़ती है' },
      { en: 'Decreases', hi: 'घटती है' },
      { en: 'Remains unchanged', hi: 'अपरिवर्तित रहती है' },
      { en: 'Becomes zero', hi: 'शून्य हो जाती है' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'v = √(γP/ρ) = √(γRT/M)! At constant T, P/ρ stays constant ⇒ NO effect of pressure on sound speed!',
      hi: 'नियत ताप पर दाब का ध्वनि की चाल पर कोई प्रभाव नहीं पड़ता (v = √(γRT/M))!',
    },
    solution: {
      en: 'Since P/ρ = RT/M depends solely on temperature, pressure changes at fixed T leave sound speed completely unchanged.',
      hi: 'नियत ताप पर P/ρ नियत रहता है, अतः ध्वनि वेग दाब से स्वतंत्र है।',
    },
  },
  {
    id: 'afx-15-4',
    chapterId: 'waves',
    simId: 'organ-pipes-beats',
    yearTag: 'IAF 2021',
    questionType: 'Direct Formula',
    question: {
      en: 'Two tuning forks of frequencies 256 Hz and 260 Hz are sounded together. The number of beats heard per second is:',
      hi: '256 Hz और 260 Hz के दो स्वरित्र एक साथ बजाए जाते हैं। प्रति सेकंड सुनाई देने वाले विस्पंदों की संख्या है:',
    },
    options: [
      { en: '2', hi: '2' },
      { en: '4', hi: '4' },
      { en: '8', hi: '8' },
      { en: '516', hi: '516' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'f_beat = |f₁ − f₂| = |260 − 256| = 4 beats/sec!',
      hi: 'विस्पंद आवृत्ति = |260 − 256| = 4 प्रति सेकंड।',
    },
    solution: {
      en: 'Beat frequency equals the absolute frequency difference: |260 − 256| = 4 Hz.',
      hi: 'विस्पंद संख्या = |f₁ − f₂| = 260 − 256 = 4।',
    },
  },
];
