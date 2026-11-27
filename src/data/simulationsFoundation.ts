import { PhysicsSimulation } from '../types/physics';

/**
 * 8 Fundamental / Basic Physics Foundation Live Simulations
 * Covers: Speed & Velocity, Impulse & Linear Momentum, Moment of Inertia & Torque,
 * Work & Power, Uniform Circular Motion, Density & Archimedes Buoyancy,
 * Fundamental Wave Speed (v = fλ), and Charge/Current/Joule Heating.
 */
export const FOUNDATION_SIMULATIONS: PhysicsSimulation[] = [
  {
    id: 'speed-velocity',
    chapterId: 'motion-1d',
    isFoundation: true,
    shortTabLabel: { en: 'Speed vs Velocity (Basic)', hi: 'चाल बनाम वेग (बेसिक)' },
    title: {
      en: 'Speed, Velocity & Distance–Displacement',
      hi: 'चाल, वेग और दूरी–विस्थापन (Speed vs Velocity)',
    },
    subtitle: {
      en: 'Compare scalar path length (d = v·t) with vector displacement (Δx⃗) along a circular track.',
      hi: 'वृत्ताकार पथ पर अदिश दूरी (d = v·t) और सदिश विस्थापन (Δx⃗) की सीधी तुलना।',
    },
    formulaDisplay: 'Speed = d / t   |   |v⃗_avg| = |Δx⃗| / t   |   |Δx⃗| = 2·R·sin(θ/2)',
    secondaryFormulas: [
      { label: { en: 'Average Speed', hi: 'औसत चाल' }, formula: 'v_avg = Total Distance (d) / Total Time (t)' },
      { label: { en: 'Average Velocity', hi: 'औसत वेग' }, formula: 'v⃗_avg = Displacement (Δx⃗) / Time (t)' },
      { label: { en: 'Full Lap Result', hi: 'पूर्ण चक्कर परिणाम' }, formula: 'After 1 full lap: d = 2πR, Δx⃗ = 0 ⇒ v⃗_avg = 0' },
    ],
    variables: [
      { key: 'R', symbol: 'R', label: { en: 'Track Radius', hi: 'पथ त्रिज्या' }, unit: 'm', min: 10, max: 100, step: 5, defaultValue: 50 },
      { key: 'v', symbol: 'v', label: { en: 'Constant Speed', hi: 'नियत चाल' }, unit: 'm/s', min: 2, max: 30, step: 1, defaultValue: 10 },
      { key: 't', symbol: 't', label: { en: 'Elapsed Time', hi: 'समय अंतराल' }, unit: 's', min: 1, max: 40, step: 0.5, defaultValue: 15.5 },
    ],
    presets: [
      { id: 'half-lap', label: { en: 'Half Lap (d = πR, |Δx| = 2R)', hi: 'आधा चक्कर' }, params: { R: 50, v: 10, t: 15.7 } },
      { id: 'full-lap', label: { en: 'Full Lap (Zero Velocity!)', hi: 'पूरा चक्कर (शून्य वेग!)' }, params: { R: 50, v: 10, t: 31.4 } },
      { id: 'quarter-lap', label: { en: 'Quarter Lap (√2·R)', hi: 'चौथाई चक्कर' }, params: { R: 50, v: 10, t: 7.85 } },
    ],
    explanation: {
      en: 'Speed is scalar (total path length divided by time) and is always positive when moving. Velocity is a vector (shortest straight-line displacement divided by time) and drops to zero whenever the runner returns to the starting point!',
      hi: 'चाल अदिश राशि है (कुल तय दूरी / समय) जो गति के दौरान हमेशा धनात्मक होती है। वेग सदिश राशि है (सीधा विस्थापन / समय) और प्रारंभिक बिंदु पर लौटते ही शून्य हो जाता है!',
    },
    realLife: {
      en: 'A runner completing a 400 m stadium lap in 50 s has an average speed of 8 m/s, yet their average velocity is 0 m/s.',
      hi: '400 m का स्टेडियम चक्कर 50 s में पूरा करने वाले धावक की औसत चाल 8 m/s है, पर औसत वेग 0 m/s होता है।',
    },
    whatIfPrompts: [
      {
        id: 'sv-1',
        question: { en: 'What happens to average velocity when the object completes 1 full circle?', hi: 'एक पूरा चक्कर लगाने पर औसत वेग कितना हो जाता है?' },
        hint: { en: 'Look at the straight dashed displacement chord connecting Start to Current position.', hi: 'प्रारंभिक और वर्तमान बिंदु के बीच की सीधी विस्थापन रेखा देखें।' },
        answer: { en: 'Displacement becomes 0 m, so Average Velocity = 0 m/s even though Speed = 10 m/s!', hi: 'विस्थापन 0 m हो जाता है, इसलिए चाल 10 m/s होने पर भी औसत वेग = 0 m/s!' },
        targetParams: { R: 50, v: 10, t: 31.4 },
      },
      {
        id: 'sv-2',
        question: { en: 'At half a revolution, compare Distance d with Displacement |Δx⃗|.', hi: 'आधे चक्कर पर दूरी d और विस्थापन |Δx⃗| की तुलना करें।' },
        hint: { en: 'Distance is the semicircle πR while displacement is the diameter 2R.', hi: 'दूरी अर्धवृत्त πR है जबकि विस्थापन व्यास 2R है।' },
        answer: { en: 'Distance = πR ≈ 157 m, while Displacement = 2R = 100 m (always |Δx⃗| ≤ d).', hi: 'दूरी = πR ≈ 157 m, जबकि विस्थापन = 2R = 100 m (हमेशा |Δx⃗| ≤ d)।' },
        targetParams: { R: 50, v: 10, t: 15.7 },
      },
    ],
    graphTitle: { en: 'Distance d (Solid) vs Displacement |Δx⃗| (Dashed) over Time', hi: 'समय के साथ दूरी d बनाम विस्थापन |Δx⃗|' },
    graphXLabel: 'Time t (s)',
    graphYLabel: 'Length (m)',
  },

  {
    id: 'impulse-momentum',
    chapterId: 'momentum',
    isFoundation: true,
    shortTabLabel: { en: 'Impulse & p = mv (Basic)', hi: 'आवेग व संवेग (बेसिक)' },
    title: {
      en: 'Linear Momentum & Impulse–Momentum Theorem',
      hi: 'रैखिक संवेग और आवेग–संवेग प्रमेय (p = mv, J = FΔt)',
    },
    subtitle: {
      en: 'See why lengthening impact time Δt drastically lowers peak collision force F for the same Δp.',
      hi: 'देखें कि समान संवेग परिवर्तन Δp के लिए टक्कर का समय Δt बढ़ाने से बल F कैसे घट जाता है।',
    },
    formulaDisplay: 'p = m · v   |   J = F_avg · Δt = Δp = m·(v − u)',
    secondaryFormulas: [
      { label: { en: 'Linear Momentum', hi: 'रैखिक संवेग' }, formula: 'p = m · v  (kg·m/s)' },
      { label: { en: 'Impulse Area', hi: 'आवेग (F–t क्षेत्रफल)' }, formula: 'J = ∫ F dt = F_avg · Δt = Δp' },
      { label: { en: 'Average Force', hi: 'औसत आघात बल' }, formula: 'F_avg = m·(v − u) / Δt' },
    ],
    variables: [
      { key: 'm', symbol: 'm', label: { en: 'Ball Mass', hi: 'गेंद का द्रव्यमान' }, unit: 'kg', min: 0.1, max: 5, step: 0.1, defaultValue: 0.5 },
      { key: 'u', symbol: 'u', label: { en: 'Incoming Speed', hi: 'प्रारंभिक वेग' }, unit: 'm/s', min: 2, max: 40, step: 1, defaultValue: 20 },
      { key: 'dtImpact', symbol: 'Δt', label: { en: 'Contact Time', hi: 'संपर्क समय' }, unit: 's', min: 0.02, max: 0.5, step: 0.02, defaultValue: 0.1 },
    ],
    presets: [
      { id: 'hard-catch', label: { en: 'Stiff Hands (Δt = 0.02 s)', hi: 'सख्त हाथ (अधिक बल)' }, params: { m: 0.2, u: 25, dtImpact: 0.02 } },
      { id: 'soft-catch', label: { en: 'Pulling Hands Back (Δt = 0.20 s)', hi: 'हाथ पीछे खींचना (कम बल)' }, params: { m: 0.2, u: 25, dtImpact: 0.2 } },
    ],
    explanation: {
      en: 'Linear momentum p = m·v measures quantity of motion. Stopping a ball requires a fixed impulse J = Δp = m·u. Extending the stopping time Δt reduces the average force F_avg = Δp / Δt by the exact same factor.',
      hi: 'रैखिक संवेग p = m·v गति की मात्रा बताता है। गेंद को रोकने के लिए आवश्यक आवेग J = Δp नियत है; संपर्क समय Δt बढ़ाने से औसत बल F_avg = Δp / Δt उतना ही कम हो जाता है।',
    },
    realLife: {
      en: 'Cricket fielders pull their hands backward while catching a fast ball, and car airbags stretch collision time Δt to protect passengers.',
      hi: 'क्रिकेट खिलाड़ी कैच लेते समय हाथ पीछे खींचते हैं और कार के एयरबैग टक्कर का समय Δt बढ़ाकर बल कम करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'imp-1',
        question: { en: 'If a fielder increases catch time Δt by 5×, how does stopping force F_avg change?', hi: 'कैच का समय Δt 5 गुना बढ़ाने पर बल F_avg पर क्या प्रभाव पड़ता है?' },
        hint: { en: 'Impulse J = F_avg × Δt stays constant for the same ball speed.', hi: 'आवेग J = F_avg × Δt नियत रहता है।' },
        answer: { en: 'Average impact force drops to 1/5th (80% less force on the hands) while area J stays identical!', hi: 'औसत आघात बल 1/5 भाग रह जाता है जबकि आवेग क्षेत्रफल J समान रहता है!' },
        targetParams: { m: 0.5, u: 20, dtImpact: 0.5 },
      },
    ],
    graphTitle: { en: 'Collision Force F(t) Pulse — Shaded Area = Impulse J = Δp', hi: 'टक्कर बल F(t) ग्राफ — क्षेत्रफल = आवेग J' },
    graphXLabel: 'Time t (s)',
    graphYLabel: 'Force F (N)',
  },

  {
    id: 'moment-of-inertia',
    chapterId: 'rotational',
    isFoundation: true,
    shortTabLabel: { en: 'Moment of Inertia & Torque', hi: 'जड़त्व आघूर्ण व बल आघूर्ण' },
    title: {
      en: 'Moment of Inertia (I = kMR²) & Torque (τ = Iα)',
      hi: 'जड़त्व आघूर्ण (I = kMR²) और बल आघूर्ण (τ = Iα)',
    },
    subtitle: {
      en: 'Compare rotational inertia across Solid Sphere, Disc, Hollow Sphere, and Ring under the same torque.',
      hi: 'समान बल आघूर्ण पर ठोस गोला, चकती, खोखला गोला और वलय के जड़त्व आघूर्ण की लाइव तुलना।',
    },
    formulaDisplay: 'I = k · M · R²   |   τ = r · F · sin(θ) = I · α',
    secondaryFormulas: [
      { label: { en: 'Solid Sphere (k = 2/5)', hi: 'ठोस गोला' }, formula: 'I = (2/5)·M·R² = 0.4·MR²' },
      { label: { en: 'Solid Disc / Cylinder (k = 1/2)', hi: 'ठोस चकती / बेलन' }, formula: 'I = (1/2)·M·R² = 0.5·MR²' },
      { label: { en: 'Hollow Sphere (k = 2/3)', hi: 'खोखला गोला' }, formula: 'I = (2/3)·M·R² ≈ 0.67·MR²' },
      { label: { en: 'Thin Ring / Hoop (k = 1)', hi: 'पतला वलय' }, formula: 'I = M·R² = 1.0·MR²' },
    ],
    variables: [
      { key: 'shape', symbol: 'k', label: { en: 'Shape (1:Sphere 2:Disc 3:Hollow 4:Ring)', hi: 'आकृति (1:गोला 2:चकती 3:खोखला 4:वलय)' }, unit: '', min: 1, max: 4, step: 1, defaultValue: 2 },
      { key: 'M', symbol: 'M', label: { en: 'Body Mass', hi: 'पिंड द्रव्यमान' }, unit: 'kg', min: 1, max: 20, step: 1, defaultValue: 6 },
      { key: 'R', symbol: 'R', label: { en: 'Radius', hi: 'त्रिज्या' }, unit: 'm', min: 0.2, max: 2.0, step: 0.1, defaultValue: 0.8 },
      { key: 'F', symbol: 'F', label: { en: 'Tangential Force', hi: 'स्पर्शरेखीय बल' }, unit: 'N', min: 2, max: 40, step: 2, defaultValue: 12 },
    ],
    presets: [
      { id: 'solid-sphere', label: { en: 'Solid Sphere (k = 0.4)', hi: 'ठोस गोला (0.4 MR²)' }, params: { shape: 1, M: 6, R: 0.8, F: 12 } },
      { id: 'solid-disc', label: { en: 'Solid Disc (k = 0.5)', hi: 'ठोस चकती (0.5 MR²)' }, params: { shape: 2, M: 6, R: 0.8, F: 12 } },
      { id: 'thin-ring', label: { en: 'Thin Ring (k = 1.0)', hi: 'पतला वलय (1.0 MR²)' }, params: { shape: 4, M: 6, R: 0.8, F: 12 } },
    ],
    explanation: {
      en: 'Moment of Inertia I = Σm·r² measures resistance to angular acceleration. Putting mass farther from the axis (like a thin ring, k = 1) maximizes I and makes angular acceleration α = τ/I smallest for the same torque!',
      hi: 'जड़त्व आघूर्ण I = Σm·r² घूर्णन गति में परिवर्तन का विरोध करता है। अक्ष से द्रव्यमान जितना दूर होगा (जैसे वलय में k = 1), I उतना ही अधिक और कोणीय त्वरण α = τ/I उतना ही कम होगा।',
    },
    realLife: {
      en: 'Flywheels concentrate heavy mass on their outer rim to maximize I, while bicycle wheels keep rims light for quick acceleration.',
      hi: 'इंजन के फ्लाईव्हील का द्रव्यमान बाहरी किनारे पर अधिक रखा जाता है ताकि जड़त्व आघूर्ण I अधिकतम हो।',
    },
    whatIfPrompts: [
      {
        id: 'moi-1',
        question: { en: 'Switch from Solid Sphere (k=0.4) to Thin Ring (k=1.0) with same M, R, F. How does α change?', hi: 'समान M, R, F के लिए ठोस गोले से पतले वलय पर जाने पर α कैसे बदलता है?' },
        hint: { en: 'I rises by 2.5× while torque τ = F·R stays constant.', hi: 'जड़त्व आघूर्ण I 2.5 गुना बढ़ जाता है।' },
        answer: { en: 'Moment of Inertia increases 2.5× so angular acceleration α = τ/I drops to 40%!', hi: 'जड़त्व आघूर्ण 2.5 गुना बढ़ने से कोणीय त्वरण α घटकर 40% रह जाता है!' },
        targetParams: { shape: 4, M: 6, R: 0.8, F: 12 },
      },
    ],
    graphTitle: { en: 'Moment of Inertia I vs Radius R (Quadratic I ∝ R²)', hi: 'त्रिज्या R के साथ जड़त्व आघूर्ण I (I ∝ R²)' },
    graphXLabel: 'Radius R (m)',
    graphYLabel: 'I (kg·m²)',
  },

  {
    id: 'work-power-basic',
    chapterId: 'work-energy',
    isFoundation: true,
    shortTabLabel: { en: 'Work & Power (Basic)', hi: 'कार्य व शक्ति (बेसिक)' },
    title: {
      en: 'Work Done (W = Fd cos θ) & Mechanical Power (P = W/t)',
      hi: 'कार्य (W = Fd cos θ) और यांत्रिक शक्ति (P = W/t)',
    },
    subtitle: {
      en: 'Vary pull angle θ to see positive, zero (90°), and negative work plus live power rate.',
      hi: 'बल का कोण θ बदलकर धनात्मक, शून्य (90°) और ऋणात्मक कार्य तथा शक्ति की दर देखें।',
    },
    formulaDisplay: 'W = F · d · cos(θ)   |   P = W / t = F · v · cos(θ)',
    secondaryFormulas: [
      { label: { en: 'Zero Work Condition', hi: 'शून्य कार्य शर्त' }, formula: 'θ = 90° ⇒ cos(90°) = 0 ⇒ W = 0 J' },
      { label: { en: 'Instantaneous Power', hi: 'तात्क्षणिक शक्ति' }, formula: 'P = F⃗ · v⃗ = F·v·cos(θ)  (Watts)' },
    ],
    variables: [
      { key: 'F', symbol: 'F', label: { en: 'Applied Force', hi: 'आरोपित बल' }, unit: 'N', min: 5, max: 100, step: 5, defaultValue: 40 },
      { key: 'd', symbol: 'd', label: { en: 'Displacement', hi: 'विस्थापन' }, unit: 'm', min: 2, max: 30, step: 1, defaultValue: 12 },
      { key: 'theta', symbol: 'θ', label: { en: 'Force Angle', hi: 'बल का कोण' }, unit: '°', min: 0, max: 180, step: 5, defaultValue: 30 },
      { key: 't', symbol: 't', label: { en: 'Time Taken', hi: 'लिया गया समय' }, unit: 's', min: 1, max: 20, step: 1, defaultValue: 4 },
    ],
    presets: [
      { id: 'max-work', label: { en: 'Horizontal Pull (θ = 0°)', hi: 'क्षैतिज खिंचाव (0°)' }, params: { F: 40, d: 12, theta: 0, t: 4 } },
      { id: 'zero-work', label: { en: 'Perpendicular (θ = 90° → W = 0)', hi: 'लंबवत बल (90° → W = 0)' }, params: { F: 40, d: 12, theta: 90, t: 4 } },
      { id: 'neg-work', label: { en: 'Opposing Brake (θ = 180°)', hi: 'विपरीत बल (180°)' }, params: { F: 40, d: 12, theta: 180, t: 4 } },
    ],
    explanation: {
      en: 'Only the force component parallel to displacement (F cos θ) performs mechanical work. When θ = 90°, work is strictly zero; when θ > 90°, work is negative and slows the object down. Power measures how fast work is done.',
      hi: 'केवल विस्थापन की दिशा में बल का घटक (F cos θ) ही कार्य करता है। θ = 90° पर कार्य शून्य होता है और θ > 90° पर कार्य ऋणात्मक होता है। शक्ति कार्य करने की दर है।',
    },
    realLife: {
      en: 'A coolie carrying a heavy suitcase horizontally on a flat platform does zero work against gravity because weight acts at 90° to motion.',
      hi: 'समतल प्लेटफॉर्म पर सिर पर बोझ लेकर चलने वाला कुली गुरुत्व के विरुद्ध शून्य कार्य करता है क्योंकि बल और विस्थापन के बीच कोण 90° है।',
    },
    whatIfPrompts: [
      {
        id: 'wp-1',
        question: { en: 'Set θ = 90°. How much work is done even when F = 40 N and d = 12 m?', hi: 'θ = 90° करने पर F = 40 N होने के बावजूद कार्य कितना होता है?' },
        hint: { en: 'Evaluate cos(90°).', hi: 'cos(90°) का मान देखें।' },
        answer: { en: 'W = 0 J and Power P = 0 W because force has zero component along displacement!', hi: 'W = 0 J और शक्ति P = 0 W क्योंकि विस्थापन की दिशा में बल का घटक शून्य है!' },
        targetParams: { F: 40, d: 12, theta: 90, t: 4 },
      },
    ],
    graphTitle: { en: 'Work Done W vs Angle θ (Cosine Law)', hi: 'कोण θ के साथ कार्य W' },
    graphXLabel: 'Angle θ (°)',
    graphYLabel: 'Work W (J)',
  },

  {
    id: 'circular-motion',
    chapterId: 'kinematics',
    isFoundation: true,
    shortTabLabel: { en: 'Circular Motion (Basic)', hi: 'वृत्तीय गति (बेसिक)' },
    title: {
      en: 'Uniform Circular Motion & Centripetal Force',
      hi: 'एकसमान वृत्तीय गति और अभिकेंद्र बल (a_c = v²/r)',
    },
    subtitle: {
      en: 'Observe tangential velocity v = ωr perpendicular to inward centripetal force F_c = mv²/r.',
      hi: 'स्पर्शरेखीय वेग v = ωr और केंद्र की ओर लगने वाले अभिकेंद्र बल F_c = mv²/r का सजीव आरेख।',
    },
    formulaDisplay: 'v = ω · r   |   a_c = v² / r = ω² · r   |   F_c = m · v² / r',
    secondaryFormulas: [
      { label: { en: 'Time Period', hi: 'आवर्तकाल' }, formula: 'T = 2π / ω = 2πr / v' },
      { label: { en: 'Centripetal Force', hi: 'अभिकेंद्र बल' }, formula: 'F_c = m · ω² · r (Always directed toward center)' },
    ],
    variables: [
      { key: 'm', symbol: 'm', label: { en: 'Mass', hi: 'द्रव्यमान' }, unit: 'kg', min: 0.5, max: 10, step: 0.5, defaultValue: 2 },
      { key: 'r', symbol: 'r', label: { en: 'Orbit Radius', hi: 'वृत्त त्रिज्या' }, unit: 'm', min: 1, max: 12, step: 0.5, defaultValue: 4 },
      { key: 'omega', symbol: 'ω', label: { en: 'Angular Speed', hi: 'कोणीय चाल' }, unit: 'rad/s', min: 0.5, max: 6, step: 0.25, defaultValue: 2.5 },
    ],
    presets: [
      { id: 'gentle-spin', label: { en: 'Gentle Rotation', hi: 'धीमा घूर्णन' }, params: { m: 2, r: 4, omega: 1.5 } },
      { id: 'high-g', label: { en: 'High Centripetal Force', hi: 'उच्च अभिकेंद्र बल' }, params: { m: 3, r: 6, omega: 5.0 } },
    ],
    explanation: {
      en: 'Even when speed v is constant in circular motion, velocity direction changes continuously, requiring an inward centripetal acceleration a_c = v²/r and inward force F_c = mv²/r always at 90° to velocity.',
      hi: 'एकसमान वृत्तीय गति में चाल नियत रहने पर भी वेग की दिशा लगातार बदलती है, जिसके लिए केंद्र की ओर अभिकेंद्र त्वरण a_c = v²/r और बल F_c = mv²/r आवश्यक है।',
    },
    realLife: {
      en: 'String tension pulls a whirling stone inward, friction holds cars on flat turns, and gravity keeps the Moon orbiting Earth.',
      hi: 'डोरी का तनाव घूमते पत्थर को केंद्र की ओर खींचता है और गुरुत्वाकर्षण चंद्रमा को पृथ्वी की कक्षा में रखता है।',
    },
    whatIfPrompts: [
      {
        id: 'cm-1',
        question: { en: 'If angular speed ω doubles while radius r stays fixed, how much does F_c increase?', hi: 'त्रिज्या r नियत रखकर ω दोगुना करने पर अभिकेंद्र बल F_c कितना बढ़ता है?' },
        hint: { en: 'Check F_c = m · ω² · r.', hi: 'सूत्र F_c = m · ω² · r देखें।' },
        answer: { en: 'Centripetal force quadruples (4×) because F_c is proportional to ω²!', hi: 'अभिकेंद्र बल 4 गुना हो जाता है क्योंकि F_c ∝ ω²!' },
        targetParams: { m: 2, r: 4, omega: 5.0 },
      },
    ],
    graphTitle: { en: 'Centripetal Force F_c vs Linear Speed v (F_c ∝ v²)', hi: 'वेग v के साथ अभिकेंद्र बल F_c' },
    graphXLabel: 'Speed v (m/s)',
    graphYLabel: 'F_c (N)',
  },

  {
    id: 'density-buoyancy',
    chapterId: 'fluids',
    isFoundation: true,
    shortTabLabel: { en: 'Density & Buoyancy (Basic)', hi: 'घनत्व व उत्प्लावन (बेसिक)' },
    title: {
      en: 'Density, Hydrostatic Pressure & Archimedes Buoyancy',
      hi: 'घनत्व, द्रव दाब और आर्किमिडीज़ उत्प्लावन बल',
    },
    subtitle: {
      en: 'Test floating vs sinking by comparing object density ρ_obj against fluid density ρ_f.',
      hi: 'पिंड के घनत्व ρ_obj और द्रव के घनत्व ρ_f की तुलना कर तैरने या डूबने का सिद्धांत देखें।',
    },
    formulaDisplay: 'ρ = m / V   |   P = P₀ + ρ·g·h   |   F_b = ρ_fluid · V_sub · g',
    secondaryFormulas: [
      { label: { en: 'Float Condition', hi: 'तैरने की शर्त' }, formula: 'ρ_obj ≤ ρ_fluid ⇒ Fraction Submerged = ρ_obj / ρ_fluid' },
      { label: { en: 'Apparent Weight', hi: 'आभासी भार' }, formula: 'W_app = W − F_b = (ρ_obj − ρ_fluid)·V·g' },
    ],
    variables: [
      { key: 'rhoObj', symbol: 'ρ_obj', label: { en: 'Object Density', hi: 'पिंड का घनत्व' }, unit: 'kg/m³', min: 200, max: 3000, step: 50, defaultValue: 750 },
      { key: 'rhoFluid', symbol: 'ρ_f', label: { en: 'Fluid Density', hi: 'द्रव का घनत्व' }, unit: 'kg/m³', min: 600, max: 2000, step: 50, defaultValue: 1000 },
      { key: 'vol', symbol: 'V', label: { en: 'Object Volume', hi: 'पिंड का आयतन' }, unit: 'm³', min: 0.01, max: 0.2, step: 0.01, defaultValue: 0.05 },
      { key: 'depth', symbol: 'h', label: { en: 'Gauge Depth', hi: 'द्रव गहराई' }, unit: 'm', min: 0.5, max: 10, step: 0.5, defaultValue: 2.0 },
    ],
    presets: [
      { id: 'wood-water', label: { en: 'Wood in Water (Floats 70%)', hi: 'पानी में लकड़ी (तैरती है)' }, params: { rhoObj: 700, rhoFluid: 1000, vol: 0.05, depth: 2 } },
      { id: 'ice-water', label: { en: 'Iceberg (92% Submerged)', hi: 'हिमखंड (92% डूबा)' }, params: { rhoObj: 920, rhoFluid: 1000, vol: 0.05, depth: 2 } },
      { id: 'alum-water', label: { en: 'Aluminium Block (Sinks)', hi: 'एल्युमीनियम (डूबता है)' }, params: { rhoObj: 2700, rhoFluid: 1000, vol: 0.05, depth: 4 } },
    ],
    explanation: {
      en: 'Archimedes’ Principle states that upward buoyant force equals the weight of displaced fluid (F_b = ρ_f·V_sub·g). If ρ_obj < ρ_f, the block floats with fraction ρ_obj/ρ_f underwater; if ρ_obj > ρ_f, it sinks.',
      hi: 'आर्किमिडीज़ के सिद्धांत के अनुसार उत्प्लावन बल हटाए गए द्रव के भार (F_b = ρ_f·V_sub·g) के बराबर होता है। यदि ρ_obj < ρ_f तो पिंड तैरता है, अन्यथा डूब जाता है।',
    },
    realLife: {
      en: 'Ships float despite steel hulls because their hollow interior lowers average density below seawater (1025 kg/m³).',
      hi: 'स्टील के जहाज खोखले आकार के कारण औसत घनत्व पानी से कम रखकर तैरते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'db-1',
        question: { en: 'What happens when object density exceeds water (2700 kg/m³ > 1000 kg/m³)?', hi: 'पिंड का घनत्व पानी से अधिक होने पर क्या होता है?' },
        hint: { en: 'Compare weight W = ρ_obj·V·g against max buoyancy F_b = ρ_f·V·g.', hi: 'भार W और अधिकतम उत्प्लावन बल F_b की तुलना करें।' },
        answer: { en: 'Weight exceeds maximum buoyant force, so the block sinks to the tank floor with positive apparent weight.', hi: 'भार अधिकतम उत्प्लावन बल से अधिक हो जाता है और पिंड तल पर बैठ जाता है।' },
        targetParams: { rhoObj: 2700, rhoFluid: 1000, vol: 0.05, depth: 4 },
      },
    ],
    graphTitle: { en: 'Hydrostatic Gauge Pressure ΔP = ρ·g·h vs Depth h', hi: 'गहराई h के साथ द्रव दाब ΔP = ρgh' },
    graphXLabel: 'Depth h (m)',
    graphYLabel: 'ΔP (kPa)',
  },

  {
    id: 'wave-speed-basic',
    chapterId: 'waves',
    isFoundation: true,
    shortTabLabel: { en: 'Wave Speed v = fλ (Basic)', hi: 'तरंग वेग v = fλ (बेसिक)' },
    title: {
      en: 'Wave Speed, Frequency, Wavelength & Period (v = f·λ)',
      hi: 'तरंग वेग, आवृत्ति, तरंगदैर्ध्य और आवर्तकाल (v = f·λ)',
    },
    subtitle: {
      en: 'Measure crest-to-crest wavelength λ, oscillation period T = 1/f, and propagation speed v live.',
      hi: 'दो श्रृंगों के बीच तरंगदैर्ध्य λ, आवर्तकाल T = 1/f और तरंग वेग v का प्रत्यक्ष मापन।',
    },
    formulaDisplay: 'v = f · λ   |   T = 1 / f   |   ω = 2π·f   |   k = 2π / λ',
    secondaryFormulas: [
      { label: { en: 'Traveling Wave Equation', hi: 'प्रगामी तरंग समीकरण' }, formula: 'y(x, t) = A · sin(k·x − ω·t)' },
      { label: { en: 'Period & Frequency', hi: 'आवर्तकाल व आवृत्ति' }, formula: 'T = 1 / f   ⇒   v = λ / T' },
    ],
    variables: [
      { key: 'f', symbol: 'f', label: { en: 'Frequency', hi: 'आवृत्ति' }, unit: 'Hz', min: 0.5, max: 8, step: 0.5, defaultValue: 2 },
      { key: 'lam', symbol: 'λ', label: { en: 'Wavelength', hi: 'तरंगदैर्ध्य' }, unit: 'm', min: 1, max: 10, step: 0.5, defaultValue: 4 },
      { key: 'amp', symbol: 'A', label: { en: 'Amplitude', hi: 'आयाम' }, unit: 'm', min: 0.5, max: 3, step: 0.25, defaultValue: 1.5 },
    ],
    presets: [
      { id: 'slow-long', label: { en: 'Long Slow Wave (f=1 Hz, λ=8 m)', hi: 'लंबी धीमी तरंग' }, params: { f: 1, lam: 8, amp: 2 } },
      { id: 'fast-short', label: { en: 'High Frequency (f=6 Hz, λ=2 m)', hi: 'उच्च आवृत्ति तरंग' }, params: { f: 6, lam: 2, amp: 1.25 } },
    ],
    explanation: {
      en: 'Every full oscillation (period T = 1/f) advances the wave profile by exactly one wavelength λ, giving the universal wave relation v = f·λ. Notice that changing amplitude A alters wave energy but does not change wave speed v.',
      hi: 'प्रत्येक पूर्ण दोलन (आवर्तकाल T = 1/f) में तरंग ठीक एक तरंगदैर्ध्य λ आगे बढ़ती है, जिससे v = f·λ प्राप्त होता है। आयाम A बदलने से चाल v नहीं बदलती।',
    },
    realLife: {
      en: 'FM radio waves at 100 MHz travel at c = 3×10⁸ m/s, giving a wavelength of λ = 3 m.',
      hi: '100 MHz की FM रेडियो तरंगें c = 3×10⁸ m/s से चलती हैं, जिनका तरंगदैर्ध्य λ = 3 m होता है।',
    },
    whatIfPrompts: [
      {
        id: 'ws-1',
        question: { en: 'Double frequency f from 2 Hz to 4 Hz while keeping λ = 4 m. What happens to T and v?', hi: 'λ = 4 m नियत रखकर f दोगुना करने पर T और v कैसे बदलते हैं?' },
        hint: { en: 'T = 1/f and v = f·λ.', hi: 'T = 1/f और v = f·λ लागू करें।' },
        answer: { en: 'Period T halves (0.5 s → 0.25 s) while wave speed v doubles (8 m/s → 16 m/s)!', hi: 'आवर्तकाल T आधा हो जाता है और तरंग वेग v दोगुना हो जाता है!' },
        targetParams: { f: 4, lam: 4, amp: 1.5 },
      },
    ],
    graphTitle: { en: 'Instantaneous Wave Snapshot y(x) Showing λ & Amplitude A', hi: 'तरंग प्रोफ़ाइल y(x) — λ और आयाम A' },
    graphXLabel: 'Position x (m)',
    graphYLabel: 'Displacement y (m)',
  },

  {
    id: 'charge-current-power',
    chapterId: 'current-electricity',
    isFoundation: true,
    shortTabLabel: { en: 'Charge, Current & Heat (Basic)', hi: 'आवेश, धारा व ऊष्मा (बेसिक)' },
    title: {
      en: 'Electric Charge, Current & Joule Heating (Q = It, H = I²Rt)',
      hi: 'विद्युत आवेश, धारा और जूल तापन नियम (Q = It, H = I²Rt)',
    },
    subtitle: {
      en: 'Track electron count n = Q/e, steady current I = Q/t, electrical power P = I²R, and heat energy.',
      hi: 'इलेक्ट्रॉन संख्या n = Q/e, धारा I = Q/t, विद्युत शक्ति P = I²R और जूल ऊष्मा का सजीव मॉडल।',
    },
    formulaDisplay: 'Q = I · t = n · e   |   P = V · I = I² · R   |   H = I² · R · t',
    secondaryFormulas: [
      { label: { en: 'Charge Quantization', hi: 'आवेश क्वांटमीकरण' }, formula: 'Q = n · e  (e = 1.6 × 10⁻¹⁹ C)' },
      { label: { en: 'Commercial Energy Unit', hi: 'व्यावसायिक ऊर्जा मात्रक' }, formula: '1 kWh = 3.6 × 10⁶ J' },
    ],
    variables: [
      { key: 'I', symbol: 'I', label: { en: 'Current', hi: 'विद्युत धारा' }, unit: 'A', min: 0.5, max: 15, step: 0.5, defaultValue: 4 },
      { key: 'R', symbol: 'R', label: { en: 'Heater Resistance', hi: 'हीटर प्रतिरोध' }, unit: 'Ω', min: 2, max: 50, step: 2, defaultValue: 10 },
      { key: 't', symbol: 't', label: { en: 'Duration', hi: 'समय' }, unit: 's', min: 5, max: 120, step: 5, defaultValue: 30 },
    ],
    presets: [
      { id: 'lamp', label: { en: 'Desk Lamp (I=1 A, R=20 Ω)', hi: 'टेबल लैंप' }, params: { I: 1, R: 20, t: 60 } },
      { id: 'kettle', label: { en: 'Electric Kettle (I=10 A, R=22 Ω)', hi: 'इलेक्ट्रिक केतली' }, params: { I: 10, R: 22, t: 60 } },
    ],
    explanation: {
      en: 'Electric current I = Q/t measures charge passing per second (1 A = 6.25×10¹⁸ electrons/s). As charge flows through resistance R, electrical energy converts to Joule heat H = I²Rt proportional to the square of current.',
      hi: 'विद्युत धारा I = Q/t प्रति सेकंड प्रवाहित आवेश है। प्रतिरोध R से धारा बहने पर जूल ऊष्मा H = I²Rt उत्पन्न होती है, जो धारा के वर्ग के समानुपाती होती है।',
    },
    realLife: {
      en: 'Electric fuses melt rapidly during a short circuit because doubling current quadruples heat generation H = I²Rt.',
      hi: 'शॉर्ट सर्किट में धारा दोगुनी होते ही जूल ऊष्मा H = I²Rt चार गुनी हो जाती है जिससे फ्यूज़ तार तुरंत पिघल जाता है।',
    },
    whatIfPrompts: [
      {
        id: 'ccp-1',
        question: { en: 'Double current I from 4 A to 8 A at constant R and t. How much does Heat H increase?', hi: 'R और t नियत रखकर धारा I दोगुनी करने पर ऊष्मा H कितनी बढ़ती है?' },
        hint: { en: 'Check the exponent of I in H = I²·R·t.', hi: 'H = I²·R·t में I की घात देखें।' },
        answer: { en: 'Heat H increases 4× (from 4.8 kJ to 19.2 kJ) while total charge Q doubles!', hi: 'जूल ऊष्मा H चार गुनी हो जाती है जबकि आवेश Q दोगुना होता है!' },
        targetParams: { I: 8, R: 10, t: 30 },
      },
    ],
    graphTitle: { en: 'Joule Power P = I²·R vs Current I (Quadratic Heating)', hi: 'धारा I के साथ जूल शक्ति P = I²R' },
    graphXLabel: 'Current I (A)',
    graphYLabel: 'Power P (W)',
  },
];
