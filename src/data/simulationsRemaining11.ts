import { PhysicsSimulation } from '../types/physics';

export const REMAINING_SIMULATIONS_11: PhysicsSimulation[] = [
  // 1. RELATIVE VELOCITY (RIVER-BOAT) — Ch 03
  {
    id: 'relative-velocity',
    chapterId: 'kinematics',
    shortTabLabel: { en: 'Relative Velocity (River-Boat)', hi: 'सापेक्ष वेग (नदी-नाव)' },
    title: {
      en: 'Relative Velocity (River-Boat Crossing)',
      hi: 'सापेक्ष वेग (नदी-नाव पार करना)',
    },
    subtitle: {
      en: 'Vector addition v_net = v_boat + v_river, crossing time, and downstream drift',
      hi: 'सदिश योग v_net = v_boat + v_river, पार करने का समय और बहाव (drift)',
    },
    formulaDisplay: 'v_net = √(v_b² + v_r² + 2v_bv_r·sinθ)  |  t = d / (v_b·cosθ)',
    secondaryFormulas: [
      { label: { en: 'Shortest Path Angle', hi: 'न्यूनतम पथ कोण' }, formula: 'sin(θ) = v_r / v_b' },
      { label: { en: 'Downstream Drift', hi: 'नदी बहाव (Drift)' }, formula: 'x = (v_r − v_b·sinθ)·t' },
    ],
    variables: [
      { key: 'vb', symbol: 'v_b', label: { en: 'Boat Speed (Still Water)', hi: 'शांत जल में नाव की चाल' }, unit: 'm/s', min: 2, max: 15, step: 0.5, defaultValue: 6 },
      { key: 'vr', symbol: 'v_r', label: { en: 'River Current Speed', hi: 'नदी की धारा की चाल' }, unit: 'm/s', min: 0, max: 10, step: 0.5, defaultValue: 3 },
      { key: 'theta', symbol: 'θ', label: { en: 'Upstream Heading Angle', hi: 'धारा के विरुद्ध कोण (θ)' }, unit: '°', min: 0, max: 75, step: 5, defaultValue: 0 },
      { key: 'width', symbol: 'd', label: { en: 'River Width', hi: 'नदी की चौड़ाई (d)' }, unit: 'm', min: 40, max: 200, step: 10, defaultValue: 120 },
    ],
    presets: [
      { id: 'shortest-time', label: { en: 'Shortest Time (θ=0°)', hi: 'न्यूनतम समय (θ=0°)' }, params: { vb: 6, vr: 3, theta: 0, width: 120 } },
      { id: 'shortest-path', label: { en: 'Zero Drift (θ=30°)', hi: 'शून्य बहाव (θ=30°)' }, params: { vb: 6, vr: 3, theta: 30, width: 120 } },
      { id: 'fast-river', label: { en: 'Fast Flood River', hi: 'तेज़ बहाव नदी' }, params: { vb: 5, vr: 8, theta: 35, width: 150 } },
    ],
    comparePresetB: {
      label: { en: 'Zero Drift (θ = 30°)', hi: 'शून्य बहाव (θ = 30°)' },
      params: { vb: 6, vr: 3, theta: 30, width: 120 },
    },
    explanation: {
      en: 'Crossing time depends ONLY on the perpendicular velocity component v_b·cosθ. Aiming straight across (θ = 0°) minimizes time, whereas aiming upstream at sinθ = v_r/v_b cancels river drift for the shortest straight-line path.',
      hi: 'नदी पार करने का समय केवल लंबवत वेग घटक v_b·cosθ पर निर्भर करता है। सीधे पार (θ = 0°) जाने पर समय न्यूनतम होता है, जबकि sinθ = v_r/v_b कोण पर तिरछा चलने से बहाव शून्य हो जाता है।',
    },
    realLife: {
      en: 'Pilots flying in crosswinds crab the aircraft nose into the wind using the exact same vector cancellation triangle to stay aligned with the runway.',
      hi: 'क्रॉसविंड (तेज़ बगल की हवा) में हवाई जहाज़ के पायलट रनवे की सीध में रहने के लिए इसी सापेक्ष वेग त्रिभुज का उपयोग करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'rv-zero-drift',
        question: {
          en: 'With v_b = 6 m/s and v_r = 3 m/s, aim upstream at θ = 30°. What happens to downstream drift?',
          hi: 'v_b = 6 m/s और v_r = 3 m/s के साथ नाव को θ = 30° ऊपर की ओर मोड़ें। बहाव (drift) का क्या होता है?',
        },
        hint: { en: 'Check v_b·sin(30°) = 6 × 0.5 = 3 m/s against v_r = 3 m/s.', hi: 'v_b·sin(30°) = 6 × 0.5 = 3 m/s की तुलना v_r = 3 m/s से करें।' },
        answer: {
          en: 'Horizontal components cancel completely (drift x = 0 m)! The boat crosses straight to the opposite bank in t = 23.1 s.',
          hi: 'क्षैतिज घटक पूरी तरह रद्द हो जाते हैं (बहाव x = 0 m)! नाव सीधे सामने वाले किनारे पर t = 23.1 s में पहुँचती है।',
        },
        targetParams: { vb: 6, vr: 3, theta: 30, width: 120 },
      },
    ],
    graphTitle: { en: 'Crossing Time t & Drift vs Heading Angle θ', hi: 'पार करने का समय t बनाम कोण θ' },
    graphXLabel: 'Angle θ (°)',
    graphYLabel: 'Time t (s)',
  },

  // 2. BANKING OF ROADS & CENTRIPETAL FRICTION — Ch 04
  {
    id: 'banking-roads',
    chapterId: 'laws-of-motion',
    shortTabLabel: { en: 'Banking of Roads', hi: 'सड़क का बंकन (Banking)' },
    title: {
      en: 'Banking of Roads & Safe Turning Speed',
      hi: 'सड़क का बंकन और सुरक्षित मोड़ चाल',
    },
    subtitle: {
      en: 'Normal reaction component N·sinθ + static friction supplying centripetal force mv²/R',
      hi: 'अभिलंब प्रतिक्रिया N·sinθ व घर्षण द्वारा अभिकेंद्रीय बल mv²/R प्रदान करना',
    },
    formulaDisplay: 'v_max = √(R·g·(μ + tanθ) / (1 − μ·tanθ))',
    secondaryFormulas: [
      { label: { en: 'Optimum Speed (Zero Friction)', hi: 'आदर्श चाल (शून्य घर्षण)' }, formula: 'v_opt = √(R·g·tanθ)' },
      { label: { en: 'Centripetal Force', hi: 'अभिकेंद्रीय बल' }, formula: 'F_c = m·v² / R' },
    ],
    variables: [
      { key: 'R', symbol: 'R', label: { en: 'Curve Radius', hi: 'मोड़ की त्रिज्या (R)' }, unit: 'm', min: 20, max: 200, step: 10, defaultValue: 80 },
      { key: 'theta', symbol: 'θ', label: { en: 'Banking Angle', hi: 'बंकन कोण (θ)' }, unit: '°', min: 0, max: 35, step: 1, defaultValue: 15 },
      { key: 'mu', symbol: 'μ_s', label: { en: 'Static Friction', hi: 'स्थैतिक घर्षण (μ_s)' }, unit: '', min: 0, max: 0.8, step: 0.05, defaultValue: 0.25 },
      { key: 'v', symbol: 'v', label: { en: 'Car Speed', hi: 'कार की चाल (v)' }, unit: 'm/s', min: 5, max: 50, step: 1, defaultValue: 18 },
    ],
    presets: [
      { id: 'ideal-bank', label: { en: 'Optimum Speed (No Wear)', hi: 'आदर्श चाल (शून्य घर्षण)' }, params: { R: 80, theta: 15, mu: 0.25, v: 14.5 } },
      { id: 'flat-wet', label: { en: 'Flat Wet Road (θ=0°)', hi: 'समतल गीली सड़क' }, params: { R: 60, theta: 0, mu: 0.2, v: 14 } },
      { id: 'race-track', label: { en: 'Steep Race Track (30°)', hi: 'रेस ट्रैक (30° बंकन)' }, params: { R: 120, theta: 30, mu: 0.4, v: 36 } },
    ],
    comparePresetB: {
      label: { en: 'Flat Road (θ = 0°)', hi: 'समतल सड़क (θ = 0°)' },
      params: { R: 80, theta: 0, mu: 0.25, v: 18 },
    },
    explanation: {
      en: 'Tilting the outer edge of a curved road angles the normal force N inward so N·sinθ helps supply the required centripetal force mv²/R even when tires have zero friction on wet or icy roads.',
      hi: 'मोड़ पर सड़क का बाहरी किनारा ऊँचा करने से अभिलंब बल का घटक N·sinθ केंद्र की ओर अभिकेंद्रीय बल mv²/R प्रदान करता है, जिससे गीली सड़क पर भी वाहन नहीं फिसलता।',
    },
    realLife: {
      en: 'Highway expressway ramps, velodrome cycling tracks, and railway curves are always banked so vehicles turn safely at high speed without excessive tire wear.',
      hi: 'एक्सप्रेसवे के मोड़, साइकिल वेलोड्रोम और रेलवे पटरियों पर बाहरी किनारा ऊँचा (बंकित) रखा जाता है ताकि तेज़ गति पर सुरक्षित मोड़ मिल सके।',
    },
    whatIfPrompts: [
      {
        id: 'bank-ice',
        question: {
          en: 'On a frictionless icy road (μ_s = 0) banked at θ = 15° with R = 80 m, can a car still safely turn at v = 14.5 m/s?',
          hi: 'बर्फीली घर्षणरहित सड़क (μ_s = 0) पर θ = 15° बंकन व R = 80 m के साथ, क्या कार 14.5 m/s पर सुरक्षित मुड़ सकती है?',
        },
        hint: { en: 'Evaluate v_opt = √(R·g·tanθ) = √(80 × 9.8 × tan 15°).', hi: 'v_opt = √(R·g·tanθ) का मान निकालें।' },
        answer: {
          en: 'YES! At v_opt = 14.5 m/s, N·sinθ supplies 100% of the centripetal force so zero friction is needed.',
          hi: 'हाँ! v_opt = 14.5 m/s पर N·sinθ पूरा अभिकेंद्रीय बल प्रदान करता है और घर्षण की आवश्यकता शून्य होती है।',
        },
        targetParams: { R: 80, theta: 15, mu: 0, v: 14.5 },
      },
    ],
    graphTitle: { en: 'Maximum Safe Speed v_max vs Banking Angle θ', hi: 'अधिकतम सुरक्षित चाल v_max बनाम बंकन कोण θ' },
    graphXLabel: 'Angle θ (°)',
    graphYLabel: 'v_max (m/s)',
  },

  // 3. ATWOOD PULLEY MACHINE & TENSION — Ch 04
  {
    id: 'atwood-pulley',
    chapterId: 'laws-of-motion',
    shortTabLabel: { en: 'Atwood Pulley', hi: 'एटवुड घिरनी (Pulley)' },
    title: {
      en: 'Atwood Pulley Machine & String Tension',
      hi: 'एटवुड घिरनी और डोरी में तनाव (Tension)',
    },
    subtitle: {
      en: 'Coupled Newton’s Second Law equations for two hanging masses over a frictionless pulley',
      hi: 'घर्षणरहित घिरनी पर लटके दो द्रव्यमानों के लिए त्वरण और तनाव',
    },
    formulaDisplay: 'a = (m₂ − m₁)·g / (m₁ + m₂)  |  T = 2·m₁·m₂·g / (m₁ + m₂)',
    secondaryFormulas: [
      { label: { en: 'Pulley Support Force', hi: 'घिरनी पर कुल भार' }, formula: 'F_hook = 2·T' },
      { label: { en: 'Free-Body Equations', hi: 'मुक्त पिंड समीकरण' }, formula: 'm₂g − T = m₂a,  T − m₁g = m₁a' },
    ],
    variables: [
      { key: 'm1', symbol: 'm₁', label: { en: 'Left Mass', hi: 'बायाँ द्रव्यमान (m₁)' }, unit: 'kg', min: 1, max: 20, step: 0.5, defaultValue: 4 },
      { key: 'm2', symbol: 'm₂', label: { en: 'Right Mass', hi: 'दायाँ द्रव्यमान (m₂)' }, unit: 'kg', min: 1, max: 20, step: 0.5, defaultValue: 8 },
      { key: 'g', symbol: 'g', label: { en: 'Gravity', hi: 'गुरुत्वीय त्वरण (g)' }, unit: 'm/s²', min: 1.6, max: 15, step: 0.2, defaultValue: 9.8 },
    ],
    presets: [
      { id: 'balanced', label: { en: 'Balanced (m₁ = m₂)', hi: 'संतुलित (m₁ = m₂)' }, params: { m1: 6, m2: 6, g: 9.8 } },
      { id: 'unbalanced', label: { en: 'Heavy Right (4 vs 12 kg)', hi: 'असंतुलित (4 बनाम 12 kg)' }, params: { m1: 4, m2: 12, g: 9.8 } },
      { id: 'moon', label: { en: 'Lunar Atwood (g = 1.6)', hi: 'चंद्रमा पर (g = 1.6)' }, params: { m1: 4, m2: 10, g: 1.6 } },
    ],
    comparePresetB: {
      label: { en: 'Heavier Right (14 kg)', hi: 'अधिक भारी दायाँ (14 kg)' },
      params: { m1: 4, m2: 14, g: 9.8 },
    },
    explanation: {
      en: 'The net driving force is the weight difference (m₂ − m₁)g while the total inertia being accelerated is (m₁ + m₂). Notice that string tension T always lies strictly between the lighter weight m₁g and heavier weight m₂g.',
      hi: 'शुद्ध प्रेरक बल भारों का अंतर (m₂ − m₁)g है जबकि कुल जड़त्व (m₁ + m₂) है। डोरी का तनाव T हमेशा हल्के भार m₁g और भारी भार m₂g के बीच रहता है।',
    },
    realLife: {
      en: 'Building elevators use a counterweight hanging over overhead sheaves exactly like an Atwood machine so the motor only overcomes the net load difference.',
      hi: 'इमारतों की लिफ्ट (Elevator) में विपरीत भार (counterweight) घिरनी के दूसरी ओर लटका होता है ताकि मोटर को कम बल लगाना पड़े।',
    },
    whatIfPrompts: [
      {
        id: 'atwood-hook',
        question: {
          en: 'Compare the ceiling hook force 2T when m₁ = 4 kg, m₂ = 12 kg against the static total weight (m₁ + m₂)g = 156.8 N.',
          hi: 'm₁ = 4 kg, m₂ = 12 kg पर घिरनी हुक पर बल 2T की तुलना कुल भार (m₁ + m₂)g = 156.8 N से करें।',
        },
        hint: { en: 'Compute T = 2m₁m₂g/(m₁+m₂) and then 2T.', hi: 'T = 2m₁m₂g/(m₁+m₂) निकालें और 2T से तुलना करें।' },
        answer: {
          en: '2T = 117.6 N, which is LESS than the total static weight 156.8 N because the center of mass accelerates downward!',
          hi: '2T = 117.6 N आता है जो कुल भार 156.8 N से कम है, क्योंकि निकाय का द्रव्यमान केंद्र नीचे की ओर त्वरित हो रहा है!',
        },
        targetParams: { m1: 4, m2: 12, g: 9.8 },
      },
    ],
    graphTitle: { en: 'Acceleration a vs Right Mass m₂', hi: 'त्वरण a बनाम द्रव्यमान m₂' },
    graphXLabel: 'm₂ (kg)',
    graphYLabel: 'a (m/s²)',
  },

  // 4. ROLLING WITHOUT SLIPPING ON AN INCLINE — Ch 07
  {
    id: 'rolling-incline',
    chapterId: 'rotational',
    shortTabLabel: { en: 'Rolling on Incline', hi: 'नत तल पर लोटनिक गति' },
    title: {
      en: 'Rolling Without Slipping Race (Moment of Inertia)',
      hi: 'नत तल पर लोटनिक गति दौड़ (जड़त्व आघूर्ण)',
    },
    subtitle: {
      en: 'Compare Solid Sphere, Solid Cylinder, Hollow Sphere, and Ring racing down the same incline',
      hi: 'ठोस गोला, ठोस बेलन, खोखला गोला और वलय की एक साथ लोटनिक दौड़',
    },
    formulaDisplay: 'a = g·sin(θ) / (1 + k²/R²)  |  v = √(2gh / (1 + k²/R²))',
    secondaryFormulas: [
      { label: { en: 'Solid Sphere (k²/R² = 2/5)', hi: 'ठोस गोला (2/5)' }, formula: 'a = (5/7)·g·sinθ' },
      { label: { en: 'Thin Ring (k²/R² = 1)', hi: 'पतला वलय (1)' }, formula: 'a = (1/2)·g·sinθ' },
    ],
    variables: [
      { key: 'theta', symbol: 'θ', label: { en: 'Incline Angle', hi: 'नत तल कोण (θ)' }, unit: '°', min: 10, max: 45, step: 1, defaultValue: 25 },
      { key: 'beta', symbol: 'I/mR²', label: { en: 'Shape Factor (0.4=Sphere, 0.5=Disc, 1=Ring)', hi: 'आकृति गुणांक (0.4=गोला, 0.5=बेलन, 1=वलय)' }, unit: '', min: 0.4, max: 1.0, step: 0.1, defaultValue: 0.4 },
      { key: 'L', symbol: 'L', label: { en: 'Ramp Length', hi: 'नत तल की लंबाई (L)' }, unit: 'm', min: 4, max: 20, step: 1, defaultValue: 10 },
      { key: 'g', symbol: 'g', label: { en: 'Gravity', hi: 'गुरुत्वीय त्वरण (g)' }, unit: 'm/s²', min: 4, max: 15, step: 0.2, defaultValue: 9.8 },
    ],
    presets: [
      { id: 'solid-sphere', label: { en: 'Solid Sphere (2/5 = 0.4)', hi: 'ठोस गोला (0.4)' }, params: { theta: 25, beta: 0.4, L: 10, g: 9.8 } },
      { id: 'solid-cylinder', label: { en: 'Solid Cylinder (1/2 = 0.5)', hi: 'ठोस बेलन (0.5)' }, params: { theta: 25, beta: 0.5, L: 10, g: 9.8 } },
      { id: 'hollow-ring', label: { en: 'Hollow Ring (1.0)', hi: 'खोखला वलय (1.0)' }, params: { theta: 25, beta: 1.0, L: 10, g: 9.8 } },
    ],
    comparePresetB: {
      label: { en: 'Hollow Ring (I/mR² = 1.0)', hi: 'खोखला वलय (1.0)' },
      params: { theta: 25, beta: 1.0, L: 10, g: 9.8 },
    },
    explanation: {
      en: 'Gravitational potential energy splits into translational KE (½mv²) and rotational KE (½Iω²). Objects with smaller shape factor k²/R² = I/(mR²) keep more energy in forward motion—so a Solid Sphere ALWAYS beats a Cylinder and Ring, independent of mass or radius!',
      hi: 'स्थितिज ऊर्जा स्थानांतरीय (½mv²) और घूर्णन गतिज ऊर्जा (½Iω²) में बँटती है। जिसका आकृति गुणांक I/(mR²) सबसे कम हो (ठोस गोला = 0.4), वह द्रव्यमान या त्रिज्या की परवाह किए बिना हमेशा दौड़ जीतता है!',
    },
    realLife: {
      en: 'Lightweight bicycle wheels concentrate less mass at the outer rim (smaller I/mR²) so cyclists accelerate faster uphill with the same pedal effort.',
      hi: 'रेसिंग साइकिल के पहियों के बाहरी रिम को हल्का रखा जाता है ताकि जड़त्व आघूर्ण कम रहे और चढ़ाई पर त्वरण तेज़ मिले।',
    },
    whatIfPrompts: [
      {
        id: 'roll-ring-vs-sphere',
        question: {
          en: 'Switch Shape Factor from Solid Sphere (0.4) to Hollow Ring (1.0). Why does the ring arrive much slower?',
          hi: 'आकृति गुणांक को ठोस गोले (0.4) से बदलकर खोखला वलय (1.0) करें। वलय इतनी देर से नीचे क्यों पहुँचता है?',
        },
        hint: { en: 'Check the fraction of energy locked in rotation: β / (1 + β).', hi: 'घूर्णन ऊर्जा का अंश β/(1+β) देखें।' },
        answer: {
          en: 'For a ring (β = 1), 50% of all potential energy goes into spinning instead of moving forward, cutting acceleration to 0.5·g·sinθ vs 0.714·g·sinθ for a solid sphere!',
          hi: 'वलय (β = 1) में 50% ऊर्जा केवल घूमने में खर्च हो जाती है, जिससे त्वरण घटकर 0.5·g·sinθ रह जाता है जबकि ठोस गोले में 0.714·g·sinθ होता है!',
        },
        targetParams: { theta: 25, beta: 1.0, L: 10, g: 9.8 },
      },
    ],
    graphTitle: { en: 'Rolling Acceleration a vs Shape Factor I/(mR²)', hi: 'लोटनिक त्वरण a बनाम आकृति गुणांक I/(mR²)' },
    graphXLabel: 'I / (mR²)',
    graphYLabel: 'a (m/s²)',
  },

  // 5. ESCAPE VELOCITY & ORBITAL VELOCITY — Ch 08 (3D DEFAULT!)
  {
    id: 'escape-velocity',
    chapterId: 'gravitation',
    supports3D: true,
    default3D: true,
    shortTabLabel: { en: 'Escape & Orbital Velocity', hi: 'पलायन व कक्षीय वेग' },
    title: {
      en: 'Escape Velocity & Orbital Velocity',
      hi: 'पलायन वेग और कक्षीय वेग (Escape & Orbital Velocity)',
    },
    subtitle: {
      en: 'Launch a rocket from a planet to visualize sub-orbital fall, circular orbit, elliptical orbit, and parabolic/hyperbolic escape',
      hi: 'ग्रह से रॉकेट प्रक्षेपण द्वारा कक्षीय वेग v_o और पलायन वेग v_e का सजीव 2D/3D प्रदर्शन',
    },
    formulaDisplay: 'v_e = √(2·G·M / R) = √2 · v_o   |   v_o = √(G·M / R)',
    secondaryFormulas: [
      { label: { en: 'Surface Gravity Form', hi: 'गुरुत्वीय त्वरण रूप' }, formula: 'v_e = √(2·g·R)' },
      { label: { en: 'Total Specific Energy', hi: 'कुल विशिष्ट ऊर्जा' }, formula: 'E / m = ½v² − G·M / R' },
    ],
    variables: [
      { key: 'M', symbol: 'M', label: { en: 'Planet Mass', hi: 'ग्रह का द्रव्यमान (M)' }, unit: '×10²⁴ kg', min: 0.5, max: 20, step: 0.5, defaultValue: 6.0 },
      { key: 'R', symbol: 'R', label: { en: 'Planet Radius', hi: 'ग्रह की त्रिज्या (R)' }, unit: '×10⁶ m', min: 1.5, max: 12, step: 0.2, defaultValue: 6.4 },
      { key: 'vLaunch', symbol: 'v', label: { en: 'Launch Speed', hi: 'प्रक्षेपण वेग (v)' }, unit: 'km/s', min: 2, max: 20, step: 0.2, defaultValue: 11.2 },
    ],
    presets: [
      { id: 'earth-escape', label: { en: 'Earth Escape (11.2 km/s)', hi: 'पृथ्वी पलायन (11.2 km/s)' }, params: { M: 6.0, R: 6.4, vLaunch: 11.2 } },
      { id: 'earth-orbit', label: { en: 'Earth Circular Orbit (7.9 km/s)', hi: 'पृथ्वी कक्षीय (7.9 km/s)' }, params: { M: 6.0, R: 6.4, vLaunch: 7.9 } },
      { id: 'moon-escape', label: { en: 'Moon Escape (2.4 km/s)', hi: 'चंद्रमा पलायन (2.4 km/s)' }, params: { M: 0.5, R: 1.7, vLaunch: 6.4 } },
      { id: 'suborbital', label: { en: 'Sub-Orbital Fall (5.0 km/s)', hi: 'उप-कक्षीय पतन (5.0 km/s)' }, params: { M: 6.0, R: 6.4, vLaunch: 5.0 } },
    ],
    comparePresetB: {
      label: { en: 'Circular Orbit (v = 7.9 km/s)', hi: 'वृत्ताकार कक्षा (7.9 km/s)' },
      params: { M: 6.0, R: 6.4, vLaunch: 7.9 },
    },
    explanation: {
      en: 'Escape velocity v_e = √(2GM/R) is the minimum launch speed needed to make total mechanical energy E = ½mv² − GMm/R equal to zero so the rocket never falls back. Notice v_e = √2 · v_o and it is completely independent of the rocket’s mass or launch angle!',
      hi: 'पलायन वेग v_e = √(2GM/R) वह न्यूनतम वेग है जिस पर कुल यांत्रिक ऊर्जा E = ½mv² − GMm/R शून्य हो जाती है और रॉकेट गुरुत्व क्षेत्र से सदा के लिए बाहर निकल जाता है। यह रॉकेट के द्रव्यमान पर निर्भर नहीं करता!',
    },
    realLife: {
      en: 'ISRO’s Mangalyaan and Chandrayaan missions first enter elliptical Earth parking orbits near v_o ≈ 7.9 km/s, then fire boosters at perigee to cross Earth’s 11.2 km/s escape threshold.',
      hi: 'इसरो के चंद्रयान और मंगलयान मिशन पहले पृथ्वी की कक्षा (v_o ≈ 7.9 km/s) में स्थापित होते हैं और फिर वेग बढ़ाकर 11.2 km/s पलायन वेग पार करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'esc-double-mass',
        question: {
          en: 'Keep Earth’s radius R = 6.4×10⁶ m, but quadruple planet mass M from 5 to 20 (×10²⁴ kg). How much does v_e increase?',
          hi: 'त्रिज्या R वही रखते हुए ग्रह का द्रव्यमान 4 गुना (5 से 20) कर दें। पलायन वेग v_e कितना बढ़ेगा?',
        },
        hint: { en: 'v_e ∝ √M, so multiplying M by 4 multiplies v_e by √4 = 2.', hi: 'v_e ∝ √M होने से M को 4 गुना करने पर v_e दोगुना हो जाता है।' },
        answer: {
          en: 'Escape velocity DOUBLES (from 10.2 km/s to 20.4 km/s), turning the 11.2 km/s launch from escape back into a bound orbit!',
          hi: 'पलायन वेग दोगुना (10.2 से 20.4 km/s) हो जाता है, जिससे 11.2 km/s वाला रॉकेट बाहर नहीं निकल पाता!',
        },
        targetParams: { M: 20, R: 6.4, vLaunch: 11.2 },
      },
    ],
    graphTitle: { en: 'Escape Velocity v_e & Orbital Velocity v_o vs Radius R', hi: 'पलायन वेग v_e और कक्षीय वेग v_o बनाम त्रिज्या R' },
    graphXLabel: 'Radius R (×10⁶ m)',
    graphYLabel: 'Speed (km/s)',
  },

  // 6. KEPLER'S LAWS & GRAVITATIONAL POTENTIAL ENERGY — Ch 08
  {
    id: 'keplers-laws',
    chapterId: 'gravitation',
    shortTabLabel: { en: 'Kepler’s Laws & Energy', hi: 'केप्लर के नियम व ऊर्जा' },
    title: {
      en: 'Kepler’s Laws & Elliptical Orbit Energy',
      hi: 'केप्लर के ग्रह गति नियम और कक्षीय ऊर्जा',
    },
    subtitle: {
      en: 'Equal areas swept in equal times (dA/dt = L/2m) and harmonic law T² ∝ a³',
      hi: 'समान समय में समान क्षेत्रफल (dA/dt = नियत) और T² ∝ a³ नियम',
    },
    formulaDisplay: 'T² = (4π² / GM)·a³   |   dA / dt = L / (2m) = const',
    secondaryFormulas: [
      { label: { en: 'Vis-Viva Speed', hi: 'कक्षीय वेग समीकरण' }, formula: 'v = √(GM·(2/r − 1/a))' },
      { label: { en: 'Total Orbital Energy', hi: 'कुल कक्षीय ऊर्जा' }, formula: 'E = −G·M·m / (2a)' },
    ],
    variables: [
      { key: 'a', symbol: 'a', label: { en: 'Semi-Major Axis', hi: 'अर्ध-दीर्घ अक्ष (a)' }, unit: 'AU', min: 0.5, max: 4.0, step: 0.1, defaultValue: 1.5 },
      { key: 'e', symbol: 'e', label: { en: 'Eccentricity', hi: 'उत्केंद्रता (e)' }, unit: '', min: 0, max: 0.75, step: 0.05, defaultValue: 0.55 },
      { key: 'Mstar', symbol: 'M', label: { en: 'Central Star Mass', hi: 'तारे का द्रव्यमान (M)' }, unit: 'M☉', min: 0.5, max: 3.0, step: 0.1, defaultValue: 1.0 },
    ],
    presets: [
      { id: 'earth', label: { en: 'Earth Orbit (a=1 AU, e=0.02)', hi: 'पृथ्वी कक्षा (a=1 AU)' }, params: { a: 1.0, e: 0.05, Mstar: 1.0 } },
      { id: 'comet', label: { en: 'Comet Orbit (e=0.70)', hi: 'धूमकेतु कक्षा (e=0.70)' }, params: { a: 2.2, e: 0.7, Mstar: 1.0 } },
      { id: 'mars', label: { en: 'Mars Orbit (a=1.52 AU)', hi: 'मंगल कक्षा (a=1.52 AU)' }, params: { a: 1.5, e: 0.1, Mstar: 1.0 } },
    ],
    comparePresetB: {
      label: { en: 'Outer Planet (a = 3.0 AU)', hi: 'बाहरी ग्रह (a = 3.0 AU)' },
      params: { a: 3.0, e: 0.55, Mstar: 1.0 },
    },
    explanation: {
      en: 'Because gravitational torque about the Sun is zero, angular momentum L = mvr is conserved. The planet sweeps equal areas in equal time intervals—moving fastest at perihelion (closest) and slowest at aphelion (farthest).',
      hi: 'सूर्य के सापेक्ष गुरुत्वीय बल-आघूर्ण शून्य होने से कोणीय संवेग L संरक्षित रहता है। ग्रह समान समय में समान क्षेत्रफल तय करता है—सूर्य के निकटतम बिंदु (उपसौर) पर सबसे तेज़ और दूरतम (अपसौर) पर सबसे धीमा चलता है।',
    },
    realLife: {
      en: 'Halley’s Comet whips rapidly around the Sun in a few months near perihelion, then spends decades drifting slowly beyond Neptune.',
      hi: 'हैली का धूमकेतु सूर्य के पास कुछ महीनों में तेज़ी से चक्कर लगाकर दशकों तक दूर धीमी गति से यात्रा करता है।',
    },
    whatIfPrompts: [
      {
        id: 'kepler-4x',
        question: {
          en: 'Increase semi-major axis a from 1.0 AU to 4.0 AU (4× larger). How many Earth years is the new orbital period T?',
          hi: 'अर्ध-दीर्घ अक्ष a को 1.0 AU से 4.0 AU (4 गुना) बढ़ाएँ। नया आवर्तकाल T कितने वर्ष होगा?',
        },
        hint: { en: 'Use T = a^(3/2) = 4^(3/2) = (√4)³.', hi: 'T = a^(3/2) = 4^(3/2) सूत्र का प्रयोग करें।' },
        answer: {
          en: 'T = 8.0 years! Because T² ∝ a³, quadrupling distance multiplies the year length by 4^(3/2) = 8×.',
          hi: 'T = 8.0 वर्ष! क्योंकि T² ∝ a³, दूरी 4 गुना करने पर आवर्तकाल 8 गुना हो जाता है।',
        },
        targetParams: { a: 4.0, e: 0.1, Mstar: 1.0 },
      },
    ],
    graphTitle: { en: 'Kepler’s Third Law: Period T vs Semi-Major Axis a', hi: 'केप्लर का तृतीय नियम: आवर्तकाल T बनाम अक्ष a' },
    graphXLabel: 'a (AU)',
    graphYLabel: 'Period T (yr)',
  },

  // 7. STOKES' LAW & TERMINAL VELOCITY — Ch 10
  {
    id: 'stokes-terminal',
    chapterId: 'fluids',
    shortTabLabel: { en: 'Stokes’ Law & Terminal v', hi: 'स्टोक्स नियम व सीमांत वेग' },
    title: {
      en: 'Stokes’ Law & Terminal Velocity in Viscous Fluid',
      hi: 'स्टोक्स का नियम और सीमांत वेग (Terminal Velocity)',
    },
    subtitle: {
      en: 'Sphere falling through oil/glycerin as viscous drag 6πηrv balances net weight',
      hi: 'श्यान द्रव में गिरते गोले पर श्यान कर्षण बल 6πηrv और सीमांत वेग v_t',
    },
    formulaDisplay: 'F_v = 6π·η·r·v   |   v_t = 2·r²·(ρ − σ)·g / (9·η)',
    secondaryFormulas: [
      { label: { en: 'Buoyant Upthrust', hi: 'उत्प्लावन बल' }, formula: 'F_B = (4/3)·πr³·σ·g' },
      { label: { en: 'Velocity Approach', hi: 'वेग समीकरण' }, formula: 'v(t) = v_t·(1 − e^(−t/τ))' },
    ],
    variables: [
      { key: 'r', symbol: 'r', label: { en: 'Sphere Radius', hi: 'गोले की त्रिज्या (r)' }, unit: 'mm', min: 0.5, max: 6, step: 0.25, defaultValue: 2.5 },
      { key: 'eta', symbol: 'η', label: { en: 'Fluid Viscosity', hi: 'श्यानता गुणांक (η)' }, unit: 'Pa·s', min: 0.1, max: 2.5, step: 0.1, defaultValue: 0.9 },
      { key: 'rho', symbol: 'ρ', label: { en: 'Sphere Density', hi: 'गोले का घनत्व (ρ)' }, unit: 'kg/m³', min: 1500, max: 9000, step: 250, defaultValue: 7800 },
      { key: 'sigma', symbol: 'σ', label: { en: 'Fluid Density', hi: 'द्रव का घनत्व (σ)' }, unit: 'kg/m³', min: 700, max: 1400, step: 50, defaultValue: 1250 },
    ],
    presets: [
      { id: 'steel-glycerin', label: { en: 'Steel in Glycerin', hi: 'ग्लिसरीन में स्टील बॉल' }, params: { r: 2.5, eta: 0.9, rho: 7800, sigma: 1250 } },
      { id: 'glass-oil', label: { en: 'Glass Bead in Oil', hi: 'तेल में काँच की गोली' }, params: { r: 3.0, eta: 0.3, rho: 2500, sigma: 900 } },
      { id: 'raindrop', label: { en: 'Large Drop (Fast v_t)', hi: 'बड़ी बूँद (तेज़ v_t)' }, params: { r: 5.0, eta: 0.5, rho: 7800, sigma: 1000 } },
    ],
    comparePresetB: {
      label: { en: 'Double Radius (2r)', hi: 'दोगुनी त्रिज्या (2r)' },
      params: { r: 5.0, eta: 0.9, rho: 7800, sigma: 1250 },
    },
    explanation: {
      en: 'As a sphere accelerates downward, viscous drag F_v = 6πηrv increases linearly with speed until F_v + Buoyancy equals Weight. At that instant acceleration becomes zero and the sphere falls at constant terminal velocity v_t ∝ r².',
      hi: 'जैसे-जैसे गोला नीचे गिरता है, वेग के साथ श्यान बल F_v = 6πηrv बढ़ता है। जब श्यान बल + उत्प्लावन = भार हो जाता है, तब त्वरण शून्य होकर गोला नियत सीमांत वेग v_t ∝ r² से गिरता है।',
    },
    realLife: {
      en: 'Raindrops falling from clouds 3 km high would hit like bullets without air drag; Stokes’ drag caps their terminal speed to a safe gentle fall, and Millikan used it to measure electron charge.',
      hi: 'वायु के श्यान कर्षण के कारण ही बादलों से गिरती वर्षा की बूँदें खतरनाक गति नहीं पकड़तीं और नियत सीमांत वेग से गिरती हैं।',
    },
    whatIfPrompts: [
      {
        id: 'stokes-r2',
        question: {
          en: 'Double the sphere radius r from 2.5 mm to 5.0 mm in the same glycerin. How many times faster is terminal velocity v_t?',
          hi: 'उसी ग्लिसरीन में गोले की त्रिज्या 2.5 mm से दोगुनी 5.0 mm करने पर सीमांत वेग v_t कितने गुना बढ़ेगा?',
        },
        hint: { en: 'v_t ∝ r² because weight grows as r³ while Stokes drag grows as r.', hi: 'भार r³ के समानुपाती और श्यान बल r के समानुपाती है, अतः v_t ∝ r²।' },
        answer: {
          en: 'Terminal velocity quadruples (4× faster) because r² increases by 2² = 4!',
          hi: 'सीमांत वेग 4 गुना (2² = 4) बढ़ जाता है!',
        },
        targetParams: { r: 5.0, eta: 0.9, rho: 7800, sigma: 1250 },
      },
    ],
    graphTitle: { en: 'Falling Speed v(t) Approaching Terminal Velocity v_t', hi: 'समय के साथ वेग v(t) और सीमांत वेग v_t' },
    graphXLabel: 'Time t (s)',
    graphYLabel: 'Speed v (m/s)',
  },

  // 8. SURFACE TENSION & CAPILLARY RISE — Ch 10
  {
    id: 'capillary-rise',
    chapterId: 'fluids',
    shortTabLabel: { en: 'Capillary Rise', hi: 'केशिकत्व (Capillary)' },
    title: {
      en: 'Surface Tension & Capillary Rise (Ascent Formula)',
      hi: 'पृष्ठ तनाव और केशिकीय उन्नयन (Capillary Rise)',
    },
    subtitle: {
      en: 'Concave vs convex meniscus, contact angle θ, and inverse radius relation h ∝ 1/r',
      hi: 'अवतल व उत्तल नवचंद्रक (meniscus), स्पर्श कोण θ और h ∝ 1/r संबंध',
    },
    formulaDisplay: 'h = (2·T·cosθ) / (r·ρ·g)',
    secondaryFormulas: [
      { label: { en: 'Excess Pressure (Drop)', hi: 'बूँद में अतिरिक्त दाब' }, formula: 'ΔP = 2·T / R' },
      { label: { en: 'Excess Pressure (Soap Bubble)', hi: 'साबुन के बुलबुले में दाब' }, formula: 'ΔP = 4·T / R' },
    ],
    variables: [
      { key: 'T', symbol: 'T', label: { en: 'Surface Tension', hi: 'पृष्ठ तनाव (T)' }, unit: 'mN/m', min: 20, max: 500, step: 5, defaultValue: 73 },
      { key: 'r', symbol: 'r', label: { en: 'Tube Radius', hi: 'नलिका की त्रिज्या (r)' }, unit: 'mm', min: 0.2, max: 2.5, step: 0.1, defaultValue: 0.5 },
      { key: 'theta', symbol: 'θ', label: { en: 'Contact Angle', hi: 'स्पर्श कोण (θ)' }, unit: '°', min: 0, max: 145, step: 5, defaultValue: 0 },
      { key: 'rho', symbol: 'ρ', label: { en: 'Liquid Density', hi: 'द्रव का घनत्व (ρ)' }, unit: 'kg/m³', min: 700, max: 13600, step: 100, defaultValue: 1000 },
    ],
    presets: [
      { id: 'water-glass', label: { en: 'Water in Glass (Rise)', hi: 'काँच में जल (उन्नयन)' }, params: { T: 73, r: 0.5, theta: 0, rho: 1000 } },
      { id: 'mercury-glass', label: { en: 'Mercury in Glass (Depression)', hi: 'काँच में पारा (अवनमन)' }, params: { T: 465, r: 0.5, theta: 135, rho: 13600 } },
      { id: 'narrow-tube', label: { en: 'Ultra-Narrow Capillary', hi: 'अति पतली केशनली' }, params: { T: 73, r: 0.2, theta: 0, rho: 1000 } },
    ],
    comparePresetB: {
      label: { en: 'Mercury (θ = 135°, Fall)', hi: 'पारा (θ = 135°, अवनमन)' },
      params: { T: 465, r: 0.5, theta: 135, rho: 13600 },
    },
    explanation: {
      en: 'When adhesive force exceeds cohesive force (θ < 90°, e.g., water in glass), the meniscus curves concave upward and surface tension pulls the liquid column UP. For mercury (θ > 90°), cosθ is negative so the liquid column depresses DOWN.',
      hi: 'जब स्पर्श कोण θ < 90° (जैसे काँच में जल) हो तो cosθ धनात्मक होने से द्रव नली में ऊपर चढ़ता है। पारे में θ > 90° होने से cosθ ऋणात्मक होता है और द्रव नीचे दब जाता है।',
    },
    realLife: {
      en: 'Oil rises through a cotton lamp wick, blotting paper absorbs ink, and groundwater climbs through tiny soil pores to plant roots by capillary action.',
      hi: 'दीपक की बाती में तेल का चढ़ना, तौलिये द्वारा पानी सोखना और मिट्टी से पौधों की जड़ों तक नमी पहुँचना केशिकत्व के उदाहरण हैं।',
    },
    whatIfPrompts: [
      {
        id: 'cap-mercury',
        question: {
          en: 'Set contact angle θ = 135° (Mercury in glass). Why does height h become NEGATIVE?',
          hi: 'स्पर्श कोण θ = 135° (काँच में पारा) करें। ऊँचाई h ऋणात्मक क्यों हो जाती है?',
        },
        hint: { en: 'Compute cos(135°) = −0.707.', hi: 'cos(135°) = −0.707 का चिह्न देखें।' },
        answer: {
          en: 'Because cos(135°) < 0, the downward surface-tension component depresses the mercury level below the surrounding dish with a convex meniscus!',
          hi: 'cos(135°) < 0 होने के कारण पृष्ठ तनाव पारे को नीचे दबाता है और उत्तल नवचंद्रक (convex meniscus) बनता है!',
        },
        targetParams: { T: 465, r: 0.5, theta: 135, rho: 13600 },
      },
    ],
    graphTitle: { en: 'Capillary Height h vs Tube Radius r (h ∝ 1/r)', hi: 'केशिकीय ऊँचाई h बनाम त्रिज्या r' },
    graphXLabel: 'Radius r (mm)',
    graphYLabel: 'Height h (cm)',
  },

  // 9. CARNOT HEAT ENGINE & EFFICIENCY — Ch 12
  {
    id: 'carnot-engine',
    chapterId: 'thermodynamics',
    shortTabLabel: { en: 'Carnot Heat Engine', hi: 'कार्नोट ऊष्मा इंजन' },
    title: {
      en: 'Carnot Heat Engine & Reversible Efficiency',
      hi: 'कार्नोट ऊष्मा इंजन और अधिकतम दक्षता',
    },
    subtitle: {
      en: '4-stroke reversible P–V cycle (2 isotherms + 2 adiabats) and heat flow Q₁ → W + Q₂',
      hi: '4-चरणीय उत्क्रमणीय P–V चक्र और ऊष्मा रूपांतरण Q₁ → W + Q₂',
    },
    formulaDisplay: 'η = 1 − (T₂ / T₁) = W / Q₁   |   Q₂ / Q₁ = T₂ / T₁',
    secondaryFormulas: [
      { label: { en: 'Net Work Done', hi: 'किया गया शुद्ध कार्य' }, formula: 'W = Q₁ − Q₂ = η·Q₁' },
      { label: { en: 'Refrigerator COP', hi: 'प्रशीतक गुणांक (COP)' }, formula: 'β = T₂ / (T₁ − T₂)' },
    ],
    variables: [
      { key: 'T1', symbol: 'T₁', label: { en: 'Hot Source Temp', hi: 'गर्म स्रोत ताप (T₁)' }, unit: 'K', min: 350, max: 1200, step: 10, defaultValue: 600 },
      { key: 'T2', symbol: 'T₂', label: { en: 'Cold Sink Temp', hi: 'ठंडे सिंक ताप (T₂)' }, unit: 'K', min: 150, max: 500, step: 10, defaultValue: 300 },
      { key: 'Q1', symbol: 'Q₁', label: { en: 'Heat Absorbed', hi: 'अवशोषित ऊष्मा (Q₁)' }, unit: 'J', min: 200, max: 2000, step: 50, defaultValue: 1000 },
    ],
    presets: [
      { id: 'half-eff', label: { en: '50% Engine (600K → 300K)', hi: '50% दक्षता (600K → 300K)' }, params: { T1: 600, T2: 300, Q1: 1000 } },
      { id: 'power-plant', label: { en: 'Steam Plant (900K → 300K)', hi: 'भाप संयंत्र (900K → 300K)' }, params: { T1: 900, T2: 300, Q1: 1500 } },
      { id: 'low-diff', label: { en: 'Low ΔT (400K → 320K)', hi: 'कम तापांतर (400K → 320K)' }, params: { T1: 400, T2: 320, Q1: 1000 } },
    ],
    comparePresetB: {
      label: { en: 'Hotter Source (T₁ = 1000 K)', hi: 'अधिक गर्म स्रोत (1000 K)' },
      params: { T1: 1000, T2: 300, Q1: 1000 },
    },
    explanation: {
      en: 'Carnot’s theorem proves NO heat engine operating between temperatures T₁ and T₂ can exceed efficiency η = 1 − T₂/T₁. Achieving 100% efficiency is physically impossible because a sink at absolute zero (T₂ = 0 K) cannot be reached.',
      hi: 'कार्नोट प्रमेय के अनुसार T₁ और T₂ के बीच काम करने वाले किसी भी इंजन की दक्षता η = 1 − T₂/T₁ से अधिक नहीं हो सकती। 100% दक्षता असंभव है क्योंकि परम शून्य (T₂ = 0 K) प्राप्त नहीं किया जा सकता।',
    },
    realLife: {
      en: 'Jet turbines and thermal power stations operate at the highest metallurgically safe source temperature T₁ precisely to push up the Carnot efficiency ceiling.',
      hi: 'थर्मल पावर प्लांट और जेट इंजन अधिकतम सुरक्षित तापमान T₁ पर चलाए जाते हैं ताकि कार्नोट दक्षता सीमा बढ़ाई जा सके।',
    },
    whatIfPrompts: [
      {
        id: 'carnot-sink-vs-source',
        question: {
          en: 'From T₁ = 600 K, T₂ = 300 K (η = 50%), compare lowering T₂ by 100 K (to 200 K) vs raising T₁ by 100 K (to 700 K). Which boosts η more?',
          hi: 'T₁ = 600 K, T₂ = 300 K से T₂ को 100 K घटाने (200 K) बनाम T₁ को 100 K बढ़ाने (700 K) में किसे अधिक दक्षता मिलेगी?',
        },
        hint: { en: 'Compare 1 − 200/600 = 66.7% against 1 − 300/700 = 57.1%.', hi: '1 − 200/600 और 1 − 300/700 की तुलना करें।' },
        answer: {
          en: 'Lowering the cold sink T₂ by 100 K gives η = 66.7%—much higher than raising T₁ by 100 K (57.1%)!',
          hi: 'ठंडे सिंक T₂ को 100 K घटाने से दक्षता 66.7% हो जाती है, जो T₁ बढ़ाने (57.1%) से काफी अधिक है!',
        },
        targetParams: { T1: 600, T2: 200, Q1: 1000 },
      },
    ],
    graphTitle: { en: 'Carnot Efficiency η (%) vs Source Temperature T₁', hi: 'कार्नोट दक्षता η (%) बनाम स्रोत ताप T₁' },
    graphXLabel: 'T₁ (K)',
    graphYLabel: 'Efficiency η (%)',
  },

  // 10. SIMPLE PENDULUM & EFFECTIVE GRAVITY — Ch 14
  {
    id: 'simple-pendulum',
    chapterId: 'oscillations',
    shortTabLabel: { en: 'Simple Pendulum', hi: 'सरल लोलक (Pendulum)' },
    title: {
      en: 'Simple Pendulum & Time Period Law',
      hi: 'सरल लोलक और आवर्तकाल का नियम',
    },
    subtitle: {
      en: 'Swinging bob with restoring torque −mgL·sinθ, tension vector, and T = 2π√(L/g)',
      hi: 'प्रत्यानयन बल −mg·sinθ, तनाव सदिश और आवर्तकाल T = 2π√(L/g)',
    },
    formulaDisplay: 'T = 2π·√(L / g)   |   F_t = −m·g·sin(θ)',
    secondaryFormulas: [
      { label: { en: 'Seconds Pendulum (T = 2 s)', hi: 'सेकंड लोलक (T = 2 s)' }, formula: 'L ≈ 0.994 m' },
      { label: { en: 'Bottom Speed', hi: 'निम्नतम बिंदु पर चाल' }, formula: 'v_max = √(2gL(1 − cosθ₀))' },
    ],
    variables: [
      { key: 'L', symbol: 'L', label: { en: 'String Length', hi: 'डोरी की लंबाई (L)' }, unit: 'm', min: 0.4, max: 4.0, step: 0.1, defaultValue: 1.0 },
      { key: 'g', symbol: 'g', label: { en: 'Effective Gravity', hi: 'प्रभावी गुरुत्व (g)' }, unit: 'm/s²', min: 1.6, max: 20, step: 0.2, defaultValue: 9.8 },
      { key: 'theta0', symbol: 'θ₀', label: { en: 'Release Angle', hi: 'प्रारंभिक कोण (θ₀)' }, unit: '°', min: 5, max: 45, step: 1, defaultValue: 20 },
      { key: 'm', symbol: 'm', label: { en: 'Bob Mass', hi: 'गोलक द्रव्यमान (m)' }, unit: 'kg', min: 0.5, max: 5, step: 0.5, defaultValue: 1.0 },
    ],
    presets: [
      { id: 'seconds', label: { en: 'Seconds Pendulum (L = 1 m)', hi: 'सेकंड लोलक (L = 1 m)' }, params: { L: 1.0, g: 9.8, theta0: 15, m: 1.0 } },
      { id: 'moon', label: { en: 'On Moon (g = 1.6 m/s²)', hi: 'चंद्रमा पर (g = 1.6)' }, params: { L: 1.0, g: 1.6, theta0: 20, m: 1.0 } },
      { id: 'long', label: { en: '4× Length (T Doubles)', hi: '4 गुना लंबाई (T दोगुना)' }, params: { L: 4.0, g: 9.8, theta0: 20, m: 1.0 } },
    ],
    comparePresetB: {
      label: { en: '4× Length (L = 4.0 m)', hi: '4 गुना लंबाई (L = 4.0 m)' },
      params: { L: 4.0, g: 9.8, theta0: 20, m: 1.0 },
    },
    explanation: {
      en: 'For small angles, sinθ ≈ θ produces simple harmonic motion with period T = 2π√(L/g). Notice mass m cancels completely—heavy and light bobs of the same length swing in perfect synchrony!',
      hi: 'छोटे कोणों पर sinθ ≈ θ के कारण सरल आवर्त गति होती है जिसका आवर्तकाल T = 2π√(L/g) है। इसमें द्रव्यमान m नहीं आता—अतः भारी व हल्के गोलक समान समय में दोलन करते हैं।',
    },
    realLife: {
      en: 'Grandfather clocks regulate time with a 1-meter seconds pendulum; Foucault’s giant pendulum in Paris proved Earth’s rotation directly.',
      hi: 'पेंडुलम घड़ियों में समय मापन और फूको लोलक (Foucault pendulum) द्वारा पृथ्वी के घूर्णन का प्रमाण इसी सिद्धांत पर आधारित है।',
    },
    whatIfPrompts: [
      {
        id: 'pend-moon',
        question: {
          en: 'Carry a 1-meter seconds pendulum from Earth (g = 9.8) to the Moon (g = 1.6 m/s²). Does the clock run faster or slower?',
          hi: '1 मीटर के सेकंड लोलक को पृथ्वी (g = 9.8) से चंद्रमा (g = 1.6) ले जाने पर घड़ी तेज़ चलेगी या धीमी?',
        },
        hint: { en: 'T ∝ 1/√g, and g on the Moon is 1/6th of Earth.', hi: 'T ∝ 1/√g है और चंद्रमा पर g लगभग 1/6 होता है।' },
        answer: {
          en: 'It runs ~2.47× SLOWER (T jumps from 2.0 s to 4.97 s) because weaker gravity supplies a weaker restoring torque!',
          hi: 'यह लगभग √6 ≈ 2.47 गुना धीमी चलती है (आवर्तकाल 2.0 s से बढ़कर 4.97 s हो जाता है)!',
        },
        targetParams: { L: 1.0, g: 1.6, theta0: 15, m: 1.0 },
      },
    ],
    graphTitle: { en: 'Time Period T vs Pendulum Length L (T ∝ √L)', hi: 'आवर्तकाल T बनाम लंबाई L (T ∝ √L)' },
    graphXLabel: 'Length L (m)',
    graphYLabel: 'Period T (s)',
  },

  // 11. DOPPLER EFFECT IN SOUND — Ch 15
  {
    id: 'doppler-effect',
    chapterId: 'waves',
    shortTabLabel: { en: 'Doppler Effect', hi: 'डॉपलर प्रभाव (Doppler)' },
    title: {
      en: 'Doppler Effect & Moving Wavefronts',
      hi: 'डॉपलर प्रभाव और गतिमान तरंगाग्र (Doppler Effect)',
    },
    subtitle: {
      en: 'Wavefront compression ahead of a moving siren raising apparent pitch f′',
      hi: 'गतिमान ध्वनि स्रोत के आगे तरंगाग्र संकुचन और आभासी आवृत्ति f′ में परिवर्तन',
    },
    formulaDisplay: "f' = f · (v + v_o) / (v − v_s)   |   λ' = (v − v_s) / f",
    secondaryFormulas: [
      { label: { en: 'Source Receding', hi: 'स्रोत दूर जाते समय' }, formula: "f' = f · v / (v + v_s)" },
      { label: { en: 'Mach Number', hi: 'मैक संख्या' }, formula: 'M = v_s / v' },
    ],
    variables: [
      { key: 'f0', symbol: 'f', label: { en: 'Source Frequency', hi: 'मूल आवृत्ति (f)' }, unit: 'Hz', min: 200, max: 1000, step: 20, defaultValue: 500 },
      { key: 'vs', symbol: 'v_s', label: { en: 'Source Velocity (+ toward)', hi: 'स्रोत का वेग (v_s)' }, unit: 'm/s', min: -150, max: 250, step: 10, defaultValue: 80 },
      { key: 'vo', symbol: 'v_o', label: { en: 'Observer Velocity (+ toward)', hi: 'श्रोता का वेग (v_o)' }, unit: 'm/s', min: -100, max: 100, step: 10, defaultValue: 0 },
      { key: 'v', symbol: 'v', label: { en: 'Speed of Sound', hi: 'ध्वनि की चाल (v)' }, unit: 'm/s', min: 300, max: 360, step: 5, defaultValue: 340 },
    ],
    presets: [
      { id: 'ambulance-toward', label: { en: 'Ambulance Approaching', hi: 'पास आती एम्बुलेंस' }, params: { f0: 500, vs: 80, vo: 0, v: 340 } },
      { id: 'ambulance-away', label: { en: 'Ambulance Receding', hi: 'दूर जाती एम्बुलेंस' }, params: { f0: 500, vs: -80, vo: 0, v: 340 } },
      { id: 'near-sonic', label: { en: 'Near Sonic (v_s = 240)', hi: 'ध्वनि के निकट (240 m/s)' }, params: { f0: 500, vs: 240, vo: 0, v: 340 } },
    ],
    comparePresetB: {
      label: { en: 'Source Receding (−80 m/s)', hi: 'स्रोत दूर जा रहा (−80 m/s)' },
      params: { f0: 500, vs: -80, vo: 0, v: 340 },
    },
    explanation: {
      en: 'When a sound source moves toward an observer, it chases its own emitted crests, shortening the wavelength λ′ = (v − v_s)/f and raising the perceived pitch f′. Behind the source, crests stretch apart and pitch drops.',
      hi: 'जब ध्वनि स्रोत श्रोता की ओर आता है, तो आगे के तरंगाग्र पास-पास (संपीड़ित) हो जाते हैं जिससे तरंगदैर्घ्य λ′ घटती है और आवृत्ति f′ बढ़ जाती है। दूर जाते समय तरंगाग्र फैल जाते हैं और आवृत्ति घट जाती है।',
    },
    realLife: {
      en: 'Highway radar speed guns, medical Doppler ultrasound measuring blood flow, and astronomical redshift proving the expanding universe all use the Doppler shift.',
      hi: 'ट्रैफिक स्पीड रडार, रक्त प्रवाह जाँचने वाला डॉपलर अल्ट्रासाउंड और ब्रह्मांड के विस्तार का रेडशिफ्ट प्रमाण इसी पर आधारित है।',
    },
    whatIfPrompts: [
      {
        id: 'doppler-recede',
        question: {
          en: 'Reverse the ambulance from approaching (+80 m/s) to receding (−80 m/s). How does apparent frequency f′ change?',
          hi: 'एम्बुलेंस का वेग +80 m/s से बदलकर −80 m/s (दूर जाते हुए) करें। आभासी आवृत्ति f′ कैसे बदलती है?',
        },
        hint: { en: 'Compare 500×340/(340−80) with 500×340/(340+80).', hi: '500×340/260 और 500×340/420 की तुलना करें।' },
        answer: {
          en: 'Frequency drops sharply from 653.8 Hz (high pitch) down to 404.8 Hz (low pitch)—the classic siren drop you hear as an ambulance passes!',
          hi: 'आवृत्ति 653.8 Hz से गिरकर 404.8 Hz हो जाती है—यही कारण है कि एम्बुलेंस के गुजरते समय आवाज़ अचानक भारी सुनाई देती है!',
        },
        targetParams: { f0: 500, vs: -80, vo: 0, v: 340 },
      },
    ],
    graphTitle: { en: 'Apparent Frequency f′ vs Source Velocity v_s', hi: 'आभासी आवृत्ति f′ बनाम स्रोत वेग v_s' },
    graphXLabel: 'v_s (m/s)',
    graphYLabel: "f' (Hz)",
  },
];
