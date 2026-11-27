import { BilingualText, ChapterInfo, PhysicsSimulation } from '../types/physics';
import { EXTRA_SIMULATIONS } from './simulationsExtra';
import { REMAINING_SIMULATIONS_11 } from './simulationsRemaining11';
import { REMAINING_SIMULATIONS_12 } from './simulationsRemaining12';
import { FOUNDATION_SIMULATIONS } from './simulationsFoundation';
import { AIRFORCE_X_SIMULATIONS } from './simulationsAirforceX';

export const CHAPTERS: ChapterInfo[] = [
  // ================= CLASS 11 (15 CHAPTERS) =================
  {
    id: 'units-measurements',
    number: '01',
    classLevel: 'Class 11',
    name: { en: 'Units & Measurements', hi: 'मात्रक और मापन' },
    summary: {
      en: 'SI units, Vernier least count, dimensional analysis, and error propagation.',
      hi: 'SI मात्रक, वर्नियर अल्पतमांक, विमीय विश्लेषण और त्रुटि संचरण।',
    },
  },
  {
    id: 'motion-1d',
    number: '02',
    classLevel: 'Class 11',
    name: { en: 'Motion in a Straight Line', hi: 'सरल रेखा में गति' },
    summary: {
      en: 'Uniformly accelerated 1D kinematics, v–t / s–t graphs, and braking motion.',
      hi: 'एकसमान त्वरित एकविमीय गति, v–t तथा s–t ग्राफ और गति के समीकरण।',
    },
  },
  {
    id: 'kinematics',
    number: '03',
    classLevel: 'Class 11',
    name: { en: 'Motion in a Plane (Projectile)', hi: 'समतल में गति (प्रक्षेप्य गति)' },
    summary: {
      en: '2D parabolic trajectories, horizontal range, peak height, and velocity vectors.',
      hi: 'द्विविमीय परवलयाकार पथ, क्षैतिज परास, अधिकतम ऊँचाई और वेग सदिश।',
    },
  },
  {
    id: 'laws-of-motion',
    number: '04',
    classLevel: 'Class 11',
    name: { en: 'Laws of Motion & Friction', hi: 'गति के नियम और घर्षण' },
    summary: {
      en: 'Newton’s 2nd Law, friction, incline components, and live free-body diagrams.',
      hi: 'न्यूटन का दूसरा नियम, घर्षण, आनत तल और सजीव मुक्त-पिंड आरेख (FBD)।',
    },
  },
  {
    id: 'work-energy',
    number: '05',
    classLevel: 'Class 11',
    name: { en: 'Work, Energy & Power', hi: 'कार्य, ऊर्जा और शक्ति' },
    summary: {
      en: 'Live exchange between Kinetic Energy (½mv²) and Potential Energy (mgh).',
      hi: 'गतिज ऊर्जा (½mv²) और स्थितिज ऊर्जा (mgh) के बीच सजीव रूपांतरण।',
    },
  },
  {
    id: 'momentum',
    number: '06',
    classLevel: 'Class 11',
    name: { en: 'Linear Momentum & Collisions', hi: 'रैखिक संवेग और टक्कर' },
    summary: {
      en: 'Conservation of linear momentum and elastic vs inelastic collisions.',
      hi: 'रैखिक संवेग संरक्षण और प्रत्यास्थ बनाम अप्रत्यास्थ टक्कर।',
    },
  },
  {
    id: 'rotational',
    number: '07',
    classLevel: 'Class 11',
    name: { en: 'System of Particles & Rotational Motion', hi: 'कणों के निकाय तथा घूर्णी गति' },
    summary: {
      en: '3D gyroscopic moment of inertia, angular velocity, torque, and conservation of L = Iω.',
      hi: '3D जड़त्व आघूर्ण, कोणीय वेग, बल आघूर्ण और L = Iω का संरक्षण।',
    },
  },
  {
    id: 'gravitation',
    number: '08',
    classLevel: 'Class 11',
    name: { en: 'Gravitation & Orbits', hi: 'गुरुत्वाकर्षण और कक्षीय गति' },
    summary: {
      en: '3D Newton’s Universal Law of Gravitation, inverse-square force, and satellite orbits.',
      hi: '3D न्यूटन का सार्वत्रिक गुरुत्वाकर्षण नियम, व्युत्क्रम-वर्ग बल और उपग्रह कक्षाएँ।',
    },
  },
  {
    id: 'solids-elasticity',
    number: '09',
    classLevel: 'Class 11',
    name: { en: 'Mechanical Properties of Solids', hi: 'ठोसों के यांत्रिक गुण (प्रत्यास्थता)' },
    summary: {
      en: 'Hooke’s Law, Young’s modulus Y, tensile stress–strain curves, and elastic energy.',
      hi: 'हुक का नियम, यंग का प्रत्यास्थता गुणांक, प्रतिबल-विकृति वक्र और प्रत्यास्थ ऊर्जा।',
    },
  },
  {
    id: 'fluids',
    number: '10',
    classLevel: 'Class 11',
    name: { en: 'Mechanical Properties of Fluids', hi: 'तरलों के यांत्रिक गुण (बर्नौली)' },
    summary: {
      en: 'Continuity equation A₁v₁ = A₂v₂, Bernoulli’s principle, and Venturi pressure drop.',
      hi: 'सांतत्य समीकरण, बर्नौली का सिद्धांत और वेंचुरीमीटर में दाबांतर।',
    },
  },
  {
    id: 'thermal-matter',
    number: '11',
    classLevel: 'Class 11',
    name: { en: 'Thermal Properties of Matter', hi: 'द्रव्य के तापीय गुण' },
    summary: {
      en: 'Linear thermal expansion ΔL = L₀αΔT and Fourier steady-state heat conduction.',
      hi: 'रेखीय ऊष्मीय प्रसार ΔL = L₀αΔT और स्थायी अवस्था ऊष्मा चालन।',
    },
  },
  {
    id: 'thermodynamics',
    number: '12',
    classLevel: 'Class 11',
    name: { en: 'Thermodynamics', hi: 'ऊष्मागतिकी' },
    summary: {
      en: 'First Law ΔQ = ΔU + W, isothermal vs adiabatic P–V curves, and piston work.',
      hi: 'ऊष्मागतिकी का प्रथम नियम, समतापी बनाम रुद्धोष्म प्रक्रम और P–V आरेख।',
    },
  },
  {
    id: 'kinetic-theory',
    number: '13',
    classLevel: 'Class 11',
    name: { en: 'Kinetic Theory of Gases', hi: 'अणुगति सिद्धांत' },
    summary: {
      en: 'Ideal gas law PV = nRT, RMS molecular speed v_rms, and Maxwell speed distribution.',
      hi: 'आदर्श गैस समीकरण PV = nRT, वर्ग माध्य मूल चाल और अणुओं की टक्कर।',
    },
  },
  {
    id: 'oscillations',
    number: '14',
    classLevel: 'Class 11',
    name: { en: 'Oscillations & SHM', hi: 'दोलन और सरल आवर्त गति' },
    summary: {
      en: 'Hooke’s Law restoring force, spring-mass resonance, and sinusoidal phase.',
      hi: 'हुक का नियम, प्रत्यानयन बल, स्प्रिंग-द्रव्यमान दोलन और ज्यावक्रीय ग्राफ।',
    },
  },
  {
    id: 'waves',
    number: '15',
    classLevel: 'Class 11',
    name: { en: 'Waves & Superposition', hi: 'तरंगें और अध्यारोपण' },
    summary: {
      en: 'Wave speed v = fλ, phase shift, constructive and destructive interference.',
      hi: 'तरंग वेग v = fλ, कलांतर, संपोषी और विनाशी व्यतिकरण।',
    },
  },

  // ================= CLASS 12 (14 CHAPTERS) =================
  {
    id: 'electric-charges',
    number: '16',
    classLevel: 'Class 12',
    name: { en: 'Electric Charges & Fields', hi: 'वैद्युत आवेश तथा क्षेत्र' },
    summary: {
      en: '3D Coulomb’s electrostatic force, dipole field shells, and inverse-square law.',
      hi: '3D कूलॉम का नियम, विद्युत द्विध्रुव क्षेत्र और व्युत्क्रम-वर्ग बल।',
    },
  },
  {
    id: 'capacitance',
    number: '17',
    classLevel: 'Class 12',
    name: { en: 'Electrostatic Potential & Capacitance', hi: 'स्थिरवैद्युत विभव तथा धारिता' },
    summary: {
      en: 'Parallel-plate capacitor C = κε₀A/d, dielectric slabs, and stored electrostatic energy.',
      hi: 'समांतर प्लेट संधारित्र, परावैद्युत पट्टी का प्रभाव और संचित ऊर्जा U = ½CV²।',
    },
  },
  {
    id: 'current-electricity',
    number: '18',
    classLevel: 'Class 12',
    name: { en: 'Current Electricity', hi: 'विद्युत धारा (ओम का नियम)' },
    summary: {
      en: 'Ohm’s Law V = IR, drift current visualization, Joule heating, and circuit power.',
      hi: 'ओम का नियम V = IR, धारा प्रवाह, जूल तापन और विद्युत शक्ति।',
    },
  },
  {
    id: 'moving-charges',
    number: '19',
    classLevel: 'Class 12',
    name: { en: 'Moving Charges & Magnetism', hi: 'गतिमान आवेश और चुंबकत्व' },
    summary: {
      en: '3D Helical Lorentz force F = q(v × B) and cyclotron radius r = mv/(qB).',
      hi: '3D सर्पिलाकार लॉरेंत्ज़ बल F = q(v × B) और साइक्लोट्रॉन कक्षा।',
    },
  },
  {
    id: 'magnetism-matter',
    number: '20',
    classLevel: 'Class 12',
    name: { en: 'Magnetism & Matter', hi: 'चुंबकत्व एवं द्रव्य' },
    summary: {
      en: 'Bar magnet dipole torque τ = MB·sinθ, dipole potential energy, and oscillation.',
      hi: 'छड़ चुंबक पर बल आघूर्ण τ = MB·sinθ, द्विध्रुव स्थितिज ऊर्जा और दोलन।',
    },
  },
  {
    id: 'emi',
    number: '21',
    classLevel: 'Class 12',
    name: { en: 'Electromagnetic Induction (EMI)', hi: 'वैद्युतचुंबकीय प्रेरण' },
    summary: {
      en: '3D AC generator coil, Faraday’s Law ε = −NdΦ/dt, and Lenz’s opposing flux.',
      hi: '3D प्रत्यावर्ती जनरेटर, फैराडे का नियम ε = −NdΦ/dt और लेंज़ का नियम।',
    },
  },
  {
    id: 'ac-circuits',
    number: '22',
    classLevel: 'Class 12',
    name: { en: 'Alternating Current (AC Circuits)', hi: 'प्रत्यावर्ती धारा (LCR परिपथ)' },
    summary: {
      en: 'Series LCR impedance Z, phasor diagrams, power factor cosφ, and resonance f₀.',
      hi: 'श्रेणी LCR प्रतिबाधा Z, फेज़र आरेख, शक्ति गुणांक और अनुनाद आवृत्ति f₀।',
    },
  },
  {
    id: 'em-waves',
    number: '23',
    classLevel: 'Class 12',
    name: { en: 'Electromagnetic Waves', hi: 'वैद्युतचुंबकीय तरंगें' },
    summary: {
      en: '3D orthogonal transverse E ⊥ B ⊥ c wave propagation and refractive index speed c/n.',
      hi: '3D परस्पर लंबवत E ⊥ B ⊥ c अनुप्रस्थ तरंग संचरण और अपवर्तनांक।',
    },
  },
  {
    id: 'ray-optics',
    number: '24',
    classLevel: 'Class 12',
    name: { en: 'Ray Optics & Optical Instruments', hi: 'किरण प्रकाशिकी एवं प्रकाशिक यंत्र' },
    summary: {
      en: 'Thin lens formula 1/f = 1/v − 1/u, convex/concave ray tracing, and magnification.',
      hi: 'पतले लेंस का सूत्र, उत्तल/अवतल लेंस किरण आरेख और आवर्धन।',
    },
  },
  {
    id: 'wave-optics',
    number: '25',
    classLevel: 'Class 12',
    name: { en: 'Wave Optics (Interference)', hi: 'तरंग प्रकाशिकी (व्यतिकरण)' },
    summary: {
      en: 'Young’s Double Slit Experiment (YDSE), fringe width β = λD/d, and intensity peaks.',
      hi: 'यंग का द्वि-स्लिट प्रयोग, फ्रिंज चौड़ाई β = λD/d और तीव्रता वितरण।',
    },
  },
  {
    id: 'dual-nature',
    number: '26',
    classLevel: 'Class 12',
    name: { en: 'Dual Nature of Radiation & Matter', hi: 'विकिरण तथा द्रव्य की द्वैत प्रकृति' },
    summary: {
      en: 'Photoelectric effect K_max = hν − φ₀, threshold cutoff, and de Broglie wavelength.',
      hi: 'प्रकाश-विद्युत प्रभाव, देहली आवृत्ति, निरोधी विभव और डी-ब्रॉग्ली तरंगदैर्घ्य।',
    },
  },
  {
    id: 'atoms',
    number: '27',
    classLevel: 'Class 12',
    name: { en: 'Atoms (Bohr Model & Spectra)', hi: 'परमाणु (बोहर मॉडल और स्पेक्ट्रम)' },
    summary: {
      en: '3D Bohr quantized electron shells, energy levels −13.6/n² eV, and photon transitions.',
      hi: '3D बोहर परमाणु कक्षाएँ, ऊर्जा स्तर −13.6/n² eV और स्पेक्ट्रमी रेखाएँ।',
    },
  },
  {
    id: 'nuclei',
    number: '28',
    classLevel: 'Class 12',
    name: { en: 'Nuclei & Radioactivity', hi: 'नाभिक और रेडियोधर्मिता' },
    summary: {
      en: 'Exponential radioactive decay N = N₀(½)^(t/T½), half-life, and nuclear activity.',
      hi: 'चरघातांकी रेडियोधर्मी क्षय, अर्ध-आयु T½ और नाभिकीय सक्रियता।',
    },
  },
  {
    id: 'semiconductors',
    number: '29',
    classLevel: 'Class 12',
    name: { en: 'Semiconductor Electronics', hi: 'अर्धचालक इलेक्ट्रॉनिकी (P–N डायोड)' },
    summary: {
      en: 'P–N junction diode forward/reverse bias, depletion layer width, and I–V curve.',
      hi: 'P–N संधि डायोड अग्र/पश्च बायस, अवक्षय परत और I–V अभिलाक्षणिक वक्र।',
    },
  },
  {
    id: 'communication-systems',
    number: '30',
    classLevel: 'Class 12',
    name: { en: 'Communication Systems (Airforce X)', hi: 'संचार व्यवस्था (एयरफोर्स X)' },
    summary: {
      en: 'AM/FM modulation index, sideband power, λ/4 antenna height, and line-of-sight range d = √(2Rh).',
      hi: 'AM/FM मॉडुलन सूचकांक, साइडबैंड शक्ति, λ/4 एंटीना ऊँचाई और रेडियो क्षितिज परास d = √(2Rh)।',
    },
  },
];

const CORE_SIMULATIONS: PhysicsSimulation[] = [
  // 1. GRAVITATION
  {
    id: 'gravitation',
    chapterId: 'gravitation',
    supports3D: true,
    title: {
      en: 'Universal Gravitation & Orbital Motion',
      hi: 'सार्वत्रिक गुरुत्वाकर्षण और कक्षीय गति',
    },
    subtitle: {
      en: 'Inverse-square gravitational attraction and satellite orbits around a planet',
      hi: 'ग्रह के चारों ओर व्युत्क्रम-वर्ग गुरुत्वाकर्षण बल और उपग्रह की कक्षा',
    },
    formulaDisplay: 'F = G · (M · m) / r²',
    secondaryFormulas: [
      { label: { en: 'Orbital Speed', hi: 'कक्षीय चाल' }, formula: 'v_orb = √(G·M / r)' },
      { label: { en: 'Escape Speed', hi: 'पलायन वेग' }, formula: 'v_esc = √(2·G·M / r)' },
    ],
    variables: [
      {
        key: 'M',
        symbol: 'M',
        label: { en: 'Planet Mass', hi: 'ग्रह का द्रव्यमान' },
        unit: '×10²⁴ kg',
        min: 1,
        max: 20,
        step: 0.5,
        defaultValue: 6,
      },
      {
        key: 'm',
        symbol: 'm',
        label: { en: 'Satellite Mass', hi: 'उपग्रह का द्रव्यमान' },
        unit: '×10³ kg',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 5,
      },
      {
        key: 'r',
        symbol: 'r',
        label: { en: 'Orbital Distance', hi: 'कक्षीय दूरी (त्रिज्या)' },
        unit: '×10⁶ m',
        min: 5,
        max: 25,
        step: 0.5,
        defaultValue: 10,
      },
      {
        key: 'vFactor',
        symbol: 'v/v₀',
        label: { en: 'Launch Speed Ratio', hi: 'प्रक्षेपण चाल अनुपात' },
        unit: '× v_orb',
        min: 0.65,
        max: 1.45,
        step: 0.05,
        defaultValue: 1.0,
      },
    ],
    presets: [
      { id: 'circular', label: { en: 'Circular Orbit', hi: 'वृत्ताकार कक्षा' }, params: { M: 6, m: 5, r: 10, vFactor: 1.0 } },
      { id: 'elliptical', label: { en: 'Elliptical Orbit', hi: 'दीर्घवृत्ताकार कक्षा' }, params: { M: 6, m: 5, r: 9, vFactor: 1.2 } },
      { id: 'heavy-planet', label: { en: 'Heavy Planet (2×M)', hi: 'भारी ग्रह (2×M)' }, params: { M: 12, m: 5, r: 10, vFactor: 1.0 } },
      { id: 'escape', label: { en: 'Escape Trajectory', hi: 'पलायन पथ' }, params: { M: 6, m: 5, r: 10, vFactor: 1.42 } },
    ],
    explanation: {
      en: 'Every two masses attract each other with a force proportional to the product of their masses and inversely proportional to the square of the distance between their centers. Gravity provides the exact centripetal force needed to curve a satellite continuously around the planet.',
      hi: 'किन्हीं भी दो द्रव्यमानों के बीच लगने वाला गुरुत्वाकर्षण बल उनके द्रव्यमानों के गुणनफल के अनुक्रमानुपाती तथा उनके बीच की दूरी के वर्ग के व्युत्क्रमानुपाती होता है। यही बल उपग्रह को ग्रह के चारों ओर घुमाने के लिए आवश्यक अभिकेंद्रीय बल प्रदान करता है।',
    },
    realLife: {
      en: 'ISRO’s Chandrayaan and GPS satellites stay in orbit by matching their horizontal speed precisely to Earth’s gravitational pull at that altitude.',
      hi: 'ISRO का चंद्रयान और GPS उपग्रह अपनी क्षैतिज चाल को उस ऊँचाई पर पृथ्वी के गुरुत्वाकर्षण खिंचाव के बराबर रखकर कक्षा में टिके रहते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'grav-double-r',
        question: {
          en: 'If we double the orbital distance r from 10 to 20 (×10⁶ m), what happens to gravitational force F?',
          hi: 'यदि हम कक्षीय दूरी r को 10 से दोगुना करके 20 (×10⁶ m) कर दें, तो गुरुत्वाकर्षण बल F पर क्या असर होगा?',
        },
        hint: {
          en: 'Look at r² in the denominator: (2r)² = 4r².',
          hi: 'सूत्र के हर में r² को देखें: (2r)² = 4r² होता है।',
        },
        answer: {
          en: 'The force drops to exactly ONE-FOURTH (¼) of its original value! Notice how the red force vector shrinks sharply on the F vs r curve.',
          hi: 'बल घटकर ठीक एक-चौथाई (¼) रह जाता है! लाल बल सदिश और F बनाम r वक्र पर अचानक गिरावट देखें।',
        },
        targetParams: { M: 6, m: 5, r: 20, vFactor: 1.0 },
      },
      {
        id: 'grav-escape',
        question: {
          en: 'What happens if the satellite’s speed reaches √2 ≈ 1.42 times its circular orbital speed?',
          hi: 'यदि उपग्रह की चाल उसकी वृत्ताकार कक्षीय चाल की √2 ≈ 1.42 गुना हो जाए तो क्या होगा?',
        },
        hint: {
          en: 'Compare kinetic energy ½mv² with gravitational potential energy GMm/r.',
          hi: 'गतिज ऊर्जा ½mv² और गुरुत्वीय स्थितिज ऊर्जा GMm/r की तुलना करें।',
        },
        answer: {
          en: 'Total mechanical energy becomes zero and the satellite achieves Escape Velocity, breaking free from the planet’s gravity forever!',
          hi: 'कुल यांत्रिक ऊर्जा शून्य हो जाती है और उपग्रह पलायन वेग प्राप्त कर ग्रह के गुरुत्वाकर्षण से हमेशा के लिए बाहर निकल जाता है!',
        },
        targetParams: { M: 6, m: 5, r: 10, vFactor: 1.42 },
      },
    ],
    graphTitle: { en: 'Inverse-Square Law: F vs Distance r', hi: 'व्युत्क्रम-वर्ग नियम: बल F बनाम दूरी r' },
    graphXLabel: 'r (×10⁶ m)',
    graphYLabel: 'F (kN)',
  },

  // 2. NEWTON'S 2ND LAW & FRICTION
  {
    id: 'newtons-force',
    chapterId: 'laws-of-motion',
    title: {
      en: 'Newton’s Second Law & Friction',
      hi: 'न्यूटन का दूसरा नियम और घर्षण बल',
    },
    subtitle: {
      en: 'Net force, mass, kinetic friction, incline angle, and live free-body vectors',
      hi: 'परिणामी बल, द्रव्यमान, गतिक घर्षण, आनत कोण और सजीव मुक्त-पिंड सदिश',
    },
    formulaDisplay: 'F_net = F_app − f_k − mg·sin(θ) = m · a',
    secondaryFormulas: [
      { label: { en: 'Normal Force', hi: 'अभिलंब बल' }, formula: 'N = m·g·cos(θ)' },
      { label: { en: 'Friction Force', hi: 'घर्षण बल' }, formula: 'f = μ · N' },
    ],
    variables: [
      {
        key: 'F',
        symbol: 'F_app',
        label: { en: 'Applied Force', hi: 'आरोपित बल' },
        unit: 'N',
        min: 0,
        max: 120,
        step: 2,
        defaultValue: 50,
      },
      {
        key: 'm',
        symbol: 'm',
        label: { en: 'Block Mass', hi: 'ब्लॉक का द्रव्यमान' },
        unit: 'kg',
        min: 1,
        max: 20,
        step: 0.5,
        defaultValue: 5,
      },
      {
        key: 'mu',
        symbol: 'μ',
        label: { en: 'Friction Coefficient', hi: 'घर्षण गुणांक' },
        unit: '',
        min: 0,
        max: 0.8,
        step: 0.05,
        defaultValue: 0.2,
      },
      {
        key: 'angle',
        symbol: 'θ',
        label: { en: 'Incline Angle', hi: 'आनत कोण' },
        unit: '°',
        min: 0,
        max: 35,
        step: 1,
        defaultValue: 0,
      },
    ],
    presets: [
      { id: 'frictionless', label: { en: 'Ice (μ = 0)', hi: 'बर्फ (घर्षण रहित)' }, params: { F: 40, m: 5, mu: 0, angle: 0 } },
      { id: 'rough-flat', label: { en: 'Rough Floor', hi: 'खुरदरी सतह' }, params: { F: 50, m: 5, mu: 0.35, angle: 0 } },
      { id: 'uphill', label: { en: 'Push Uphill', hi: 'ढलान पर ऊपर धकेलना' }, params: { F: 70, m: 5, mu: 0.15, angle: 25 } },
      { id: 'balanced', label: { en: 'Zero Acceleration', hi: 'शून्य त्वरण (संतुलित)' }, params: { F: 20, m: 5, mu: 0.5, angle: 0 } },
    ],
    explanation: {
      en: 'Acceleration depends on the NET unbalanced force divided by mass (a = F_net / m). Friction always opposes relative sliding motion with magnitude up to μN, while an inclined plane adds a downhill gravity component mg·sin(θ).',
      hi: 'त्वरण हमेशा कुल असंतुलित बल और द्रव्यमान के अनुपात (a = F_net / m) पर निर्भर करता है। घर्षण हमेशा फिसलने की गति का विरोध करता है (f = μN), जबकि ढलान पर गुरुत्वाकर्षण का घटक mg·sin(θ) ब्लॉक को नीचे खींचता है।',
    },
    realLife: {
      en: 'Pushing a heavy crate across a rough wooden floor requires overcoming static friction first, whereas the same push accelerates a lighter cart much faster.',
      hi: 'खुरदरे फर्श पर भारी बक्से को धकेलने में अधिक बल लगता है, जबकि उसी बल से हल्की गाड़ी बहुत तेज़ी से त्वरित हो जाती है।',
    },
    whatIfPrompts: [
      {
        id: 'force-double-mass',
        question: {
          en: 'With Applied Force F = 50 N on a frictionless surface, what happens to acceleration if mass m doubles from 5 kg to 10 kg?',
          hi: 'घर्षण रहित सतह पर 50 N बल लगाते हुए यदि द्रव्यमान 5 kg से दोगुना 10 kg कर दें, तो त्वरण पर क्या प्रभाव पड़ेगा?',
        },
        hint: {
          en: 'Use a = F / m: mass is in the denominator.',
          hi: 'a = F / m देखें: द्रव्यमान हर में है।',
        },
        answer: {
          en: 'Acceleration is cut exactly in HALF (from 10 m/s² to 5 m/s²). Greater inertia resists changes in velocity.',
          hi: 'त्वरण ठीक आधा रह जाता है (10 m/s² से 5 m/s²)। अधिक जड़त्व वेग में बदलाव का विरोध करता है।',
        },
        targetParams: { F: 50, m: 10, mu: 0, angle: 0 },
      },
      {
        id: 'force-incline-stall',
        question: {
          en: 'Tilt the ramp to 25° with μ = 0.25 and F = 35 N on a 5 kg block. Does the block climb up or stay stuck?',
          hi: '5 kg के ब्लॉक पर 35 N बल और μ = 0.25 के साथ ढलान को 25° झुकाएँ। क्या ब्लॉक ऊपर चढ़ पाएगा?',
        },
        hint: {
          en: 'Compare F_app with mg·sin(25°) + μ·mg·cos(25°).',
          hi: 'F_app की तुलना mg·sin(25°) + μ·mg·cos(25°) से करें।',
        },
        answer: {
          en: 'The block stays balanced at zero net force because downhill gravity (~20.7 N) plus friction resistance (~11.1 N) nearly cancels the push!',
          hi: 'ब्लॉक लगभग रुक जाता है क्योंकि नीचे की ओर गुरुत्व घटक (~20.7 N) और घर्षण (~11.1 N) मिलकर लगाए गए बल का विरोध करते हैं!',
        },
        targetParams: { F: 30, m: 5, mu: 0.25, angle: 25 },
      },
    ],
    graphTitle: { en: 'Live Velocity v(t) vs Time', hi: 'सजीव वेग v(t) बनाम समय' },
    graphXLabel: 't (s)',
    graphYLabel: 'v (m/s)',
  },

  // 3. LINEAR MOMENTUM & COLLISIONS
  {
    id: 'linear-momentum',
    chapterId: 'momentum',
    title: {
      en: 'Linear Momentum & 1D Collisions',
      hi: 'रैखिक संवेग और एकविमीय टक्कर',
    },
    subtitle: {
      en: 'Elastic & inelastic cart collisions proving p₁ + p₂ stays conserved',
      hi: 'प्रत्यास्थ और अप्रत्यास्थ टक्कर में कुल संवेग p₁ + p₂ का संरक्षण',
    },
    formulaDisplay: 'm₁u₁ + m₂u₂ = m₁v₁ + m₂v₂',
    secondaryFormulas: [
      { label: { en: 'Momentum', hi: 'संवेग' }, formula: 'p = m · v' },
      { label: { en: 'Restitution', hi: 'प्रत्यावस्थान गुणांक' }, formula: 'e = (v₂ − v₁) / (u₁ − u₂)' },
    ],
    variables: [
      {
        key: 'm1',
        symbol: 'm₁',
        label: { en: 'Cart 1 Mass', hi: 'गाड़ी 1 का द्रव्यमान' },
        unit: 'kg',
        min: 1,
        max: 12,
        step: 0.5,
        defaultValue: 4,
      },
      {
        key: 'u1',
        symbol: 'u₁',
        label: { en: 'Cart 1 Initial Velocity', hi: 'गाड़ी 1 का प्रारंभिक वेग' },
        unit: 'm/s',
        min: 1,
        max: 10,
        step: 0.5,
        defaultValue: 6,
      },
      {
        key: 'm2',
        symbol: 'm₂',
        label: { en: 'Cart 2 Mass', hi: 'गाड़ी 2 का द्रव्यमान' },
        unit: 'kg',
        min: 1,
        max: 12,
        step: 0.5,
        defaultValue: 4,
      },
      {
        key: 'u2',
        symbol: 'u₂',
        label: { en: 'Cart 2 Initial Velocity', hi: 'गाड़ी 2 का प्रारंभिक वेग' },
        unit: 'm/s',
        min: -8,
        max: 4,
        step: 0.5,
        defaultValue: 0,
      },
      {
        key: 'e',
        symbol: 'e',
        label: { en: 'Elasticity (Restitution)', hi: 'प्रत्यास्थता गुणांक (e)' },
        unit: '',
        min: 0,
        max: 1,
        step: 0.1,
        defaultValue: 1,
      },
    ],
    presets: [
      { id: 'equal-elastic', label: { en: 'Newton’s Cradle (m₁=m₂)', hi: 'समान द्रव्यमान प्रत्यास्थ' }, params: { m1: 4, u1: 6, m2: 4, u2: 0, e: 1 } },
      { id: 'stick-together', label: { en: 'Perfectly Inelastic (e=0)', hi: 'पूर्णतः अप्रत्यास्थ (e=0)' }, params: { m1: 4, u1: 6, m2: 4, u2: 0, e: 0 } },
      { id: 'head-on', label: { en: 'Head-On Crash', hi: 'आमने-सामने टक्कर' }, params: { m1: 3, u1: 6, m2: 6, u2: -3, e: 0.9 } },
      { id: 'heavy-hits-light', label: { en: 'Heavy Hits Light', hi: 'भारी की हल्के से टक्कर' }, params: { m1: 10, u1: 5, m2: 2, u2: 0, e: 1 } },
    ],
    explanation: {
      en: 'In an isolated system with no external net force, total linear momentum (P = m₁v₁ + m₂v₂) is strictly conserved before and after EVERY collision—whether elastic (e = 1, kinetic energy conserved) or inelastic (e = 0, carts stick together and some kinetic energy converts to heat/sound).',
      hi: 'बाह्य बल की अनुपस्थिति में किसी भी टक्कर से पहले और बाद में कुल रैखिक संवेग (P = m₁v₁ + m₂v₂) हमेशा संरक्षित रहता है—चाहे टक्कर प्रत्यास्थ (e = 1) हो या अप्रत्यास्थ (e = 0, जिसमें दोनों गाड़ियाँ चिपक जाती हैं)।',
    },
    realLife: {
      en: 'Billiard balls exchange velocities almost elastically, while car crumple zones make collisions inelastic to absorb kinetic energy and reduce impact force.',
      hi: 'बिलियर्ड्स की गेंदें लगभग प्रत्यास्थ टक्कर करती हैं, जबकि कार के क्रम्पल ज़ोन टक्कर को अप्रत्यास्थ बनाकर झटके की ऊर्जा सोख लेते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'mom-equal-swap',
        question: {
          en: 'When two equal masses collide elastically (e = 1) and Cart 2 starts at rest, what happens to Cart 1 after impact?',
          hi: 'जब दो समान द्रव्यमानों की प्रत्यास्थ टक्कर (e = 1) हो और गाड़ी 2 रुकी हो, तो टक्कर के बाद गाड़ी 1 का क्या होगा?',
        },
        hint: {
          en: 'Both momentum AND kinetic energy must stay unchanged.',
          hi: 'संवेग और गतिज ऊर्जा दोनों को संरक्षित रहना होगा।',
        },
        answer: {
          en: 'Cart 1 stops completely dead in its tracks and transfers 100% of its velocity and momentum to Cart 2!',
          hi: 'गाड़ी 1 वहीं रुक जाती है और अपना 100% वेग और संवेग गाड़ी 2 को हस्तांतरित कर देती है!',
        },
        targetParams: { m1: 4, u1: 6, m2: 4, u2: 0, e: 1 },
      },
      {
        id: 'mom-inelastic-stick',
        question: {
          en: 'Set elasticity e = 0 (perfectly inelastic) with m₁ = m₂ = 4 kg and u₁ = 6 m/s, u₂ = 0. What is the combined speed after impact?',
          hi: 'e = 0 (पूर्णतः अप्रत्यास्थ) पर m₁ = m₂ = 4 kg और u₁ = 6 m/s, u₂ = 0 रखें। चिपकने के बाद संयुक्त वेग क्या होगा?',
        },
        hint: {
          en: 'Total momentum 24 kg·m/s is now shared by total mass (4 + 4) = 8 kg.',
          hi: 'कुल संवेग 24 kg·m/s अब कुल द्रव्यमान (4 + 4) = 8 kg में बंट जाएगा।',
        },
        answer: {
          en: 'Both carts move together at 3.0 m/s! Total momentum stays 24 kg·m/s, while half the kinetic energy transforms into heat/deformation.',
          hi: 'दोनों गाड़ियाँ मिलकर 3.0 m/s से चलती हैं! कुल संवेग 24 kg·m/s बना रहता है, पर आधी गतिज ऊर्जा ऊष्मा में बदल जाती है।',
        },
        targetParams: { m1: 4, u1: 6, m2: 4, u2: 0, e: 0 },
      },
    ],
    graphTitle: { en: 'Momentum p₁, p₂ & Total P_total vs Time', hi: 'संवेग p₁, p₂ और कुल संवेग P बनाम समय' },
    graphXLabel: 't (s)',
    graphYLabel: 'p (kg·m/s)',
  },

  // 4. ROTATIONAL MOTION & ANGULAR MOMENTUM
  {
    id: 'angular-momentum',
    chapterId: 'rotational',
    supports3D: true,
    title: {
      en: 'Conservation of Angular Momentum',
      hi: 'कोणीय संवेग संरक्षण (L = I·ω)',
    },
    subtitle: {
      en: 'Retractable rotating masses demonstrating I·ω = constant like a spinning ice skater',
      hi: 'घूमते द्रव्यमानों की त्रिज्या बदलने पर I·ω = नियतांक (आइस स्केटर प्रभाव)',
    },
    formulaDisplay: 'L = I · ω = (I_hub + 2·m·r²) · ω',
    secondaryFormulas: [
      { label: { en: 'Moment of Inertia', hi: 'जड़त्व आघूर्ण' }, formula: 'I = I₀ + 2·m·r²' },
      { label: { en: 'Rotational KE', hi: 'घूर्णन गतिज ऊर्जा' }, formula: 'K_rot = ½·I·ω² = L² / (2I)' },
    ],
    variables: [
      {
        key: 'r',
        symbol: 'r',
        label: { en: 'Arm Radius', hi: 'भुजा की त्रिज्या (r)' },
        unit: 'm',
        min: 0.3,
        max: 1.8,
        step: 0.05,
        defaultValue: 1.4,
      },
      {
        key: 'm',
        symbol: 'm',
        label: { en: 'Each Hand Mass', hi: 'प्रत्येक सिरे का द्रव्यमान' },
        unit: 'kg',
        min: 1,
        max: 10,
        step: 0.5,
        defaultValue: 3,
      },
      {
        key: 'L',
        symbol: 'L',
        label: { en: 'Conserved Angular Momentum', hi: 'संरक्षित कोणीय संवेग (L)' },
        unit: 'kg·m²/s',
        min: 5,
        max: 50,
        step: 1,
        defaultValue: 24,
      },
    ],
    presets: [
      { id: 'arms-out', label: { en: 'Arms Wide Out', hi: 'बाँहें पूरी खुली' }, params: { r: 1.6, m: 3, L: 24 } },
      { id: 'arms-in', label: { en: 'Arms Pulled Tight', hi: 'बाँहें अंदर खींचीं' }, params: { r: 0.4, m: 3, L: 24 } },
      { id: 'heavy-weights', label: { en: 'Heavy Weights', hi: 'भारी डंबल के साथ' }, params: { r: 1.2, m: 8, L: 36 } },
    ],
    explanation: {
      en: 'When no external torque acts on a spinning body (τ_ext = 0), its angular momentum L = I·ω stays constant. Pulling the masses closer to the axis shrinks Moment of Inertia I = I₀ + 2mr² dramatically, forcing angular speed ω to skyrocket!',
      hi: 'जब किसी घूर्णनशील वस्तु पर कोई बाह्य बल-आघूर्ण (τ = 0) न लगे, तो उसका कोणीय संवेग L = I·ω नियत रहता है। द्रव्यमान को अक्ष के पास लाने से जड़त्व आघूर्ण I तेजी से घटता है, जिससे कोणीय वेग ω बहुत बढ़ जाता है!',
    },
    realLife: {
      en: 'Figure skaters and Olympic divers pull their arms and legs tight toward their chest mid-spin to rotate several times faster.',
      hi: 'आइस स्केटर और गोताखोर हवा में घूमते समय अपनी बाँहें शरीर से चिपका लेते हैं ताकि उनके घूमने की रफ्तार कई गुना बढ़ जाए।',
    },
    whatIfPrompts: [
      {
        id: 'ang-pull-in',
        question: {
          en: 'Keep L = 24 kg·m²/s constant and pull the arm radius r inward from 1.6 m down to 0.4 m. What happens to spin speed ω?',
          hi: 'L = 24 kg·m²/s स्थिर रखते हुए त्रिज्या r को 1.6 m से घटाकर 0.4 m करें। घूर्णन वेग ω पर क्या प्रभाव पड़ेगा?',
        },
        hint: {
          en: 'Because I depends on r², shrinking r by 4× cuts mr² by 16×!',
          hi: 'चूँकि I में r² आता है, त्रिज्या को एक-चौथाई करने पर mr² सोलह गुना घट जाता है!',
        },
        answer: {
          en: 'Angular velocity ω surges dramatically (more than 6× faster!) while L remains flat and conserved, and rotational KE rises from the internal work done pulling the masses inward.',
          hi: 'कोणीय वेग ω अचानक 6 गुना से भी अधिक बढ़ जाता है, जबकि कोणीय संवेग L पूरी तरह नियत रहता है!',
        },
        targetParams: { r: 0.4, m: 3, L: 24 },
      },
      {
        id: 'ang-extend-out',
        question: {
          en: 'Now extend the weights back out to r = 1.75 m. How do the tangential velocity and angular speed behave?',
          hi: 'अब द्रव्यमानों को बाहर r = 1.75 m तक फैला दें। कोणीय चाल ω पर क्या असर होगा?',
        },
        hint: {
          en: 'Increasing r pushes mass farther from the pivot, maximizing inertia I.',
          hi: 'r बढ़ने से द्रव्यमान अक्ष से दूर जाता है और जड़त्व आघूर्ण I अधिकतम हो जाता है।',
        },
        answer: {
          en: 'Moment of Inertia I increases sharply, slowing the spin rate ω right back down smoothly.',
          hi: 'जड़त्व आघूर्ण I बहुत बढ़ जाता है और घूमने की गति ω तुरंत धीमी हो जाती है।',
        },
        targetParams: { r: 1.75, m: 3, L: 24 },
      },
    ],
    graphTitle: { en: 'Angular Speed ω vs Arm Radius r (Fixed L)', hi: 'कोणीय वेग ω बनाम त्रिज्या r (नियत L)' },
    graphXLabel: 'r (m)',
    graphYLabel: 'ω (rad/s)',
  },

  // 5. PROJECTILE MOTION (KINEMATICS)
  {
    id: 'projectile',
    chapterId: 'kinematics',
    title: {
      en: 'Projectile Motion (2D Kinematics)',
      hi: 'प्रक्षेप्य गति (द्विविमीय गतिकी)',
    },
    subtitle: {
      en: 'Parabolic trajectory with live horizontal vx and vertical vy velocity components',
      hi: 'सजीव क्षैतिज vx और ऊर्ध्वाधर vy वेग घटकों के साथ परवलयाकार पथ',
    },
    formulaDisplay: 'R = (u² · sin 2θ) / g',
    secondaryFormulas: [
      { label: { en: 'Max Height', hi: 'अधिकतम ऊँचाई' }, formula: 'H = (u²·sin²θ) / (2g)' },
      { label: { en: 'Time of Flight', hi: 'उड्डयन काल' }, formula: 'T = (2u·sinθ) / g' },
    ],
    variables: [
      {
        key: 'u',
        symbol: 'u',
        label: { en: 'Launch Speed', hi: 'प्रक्षेपण वेग (u)' },
        unit: 'm/s',
        min: 10,
        max: 45,
        step: 1,
        defaultValue: 28,
      },
      {
        key: 'theta',
        symbol: 'θ',
        label: { en: 'Launch Angle', hi: 'प्रक्षेपण कोण (θ)' },
        unit: '°',
        min: 10,
        max: 85,
        step: 1,
        defaultValue: 45,
      },
      {
        key: 'g',
        symbol: 'g',
        label: { en: 'Gravity', hi: 'गुरुत्वीय त्वरण (g)' },
        unit: 'm/s²',
        min: 1.6,
        max: 24.8,
        step: 0.2,
        defaultValue: 9.8,
      },
    ],
    presets: [
      { id: 'max-range', label: { en: 'Max Range (45°)', hi: 'अधिकतम परास (45°)' }, params: { u: 28, theta: 45, g: 9.8 } },
      { id: 'comp-30', label: { en: 'Complementary 30°', hi: 'पूरक कोण 30°' }, params: { u: 28, theta: 30, g: 9.8 } },
      { id: 'comp-60', label: { en: 'Complementary 60°', hi: 'पूरक कोण 60°' }, params: { u: 28, theta: 60, g: 9.8 } },
      { id: 'moon', label: { en: 'On the Moon', hi: 'चंद्रमा पर (g=1.6)' }, params: { u: 16, theta: 45, g: 1.6 } },
    ],
    explanation: {
      en: 'A projectile moves simultaneously with constant horizontal velocity (vx = u·cosθ) and constant downward gravitational acceleration (ay = -g). At the highest peak, vy becomes zero while vx remains completely unchanged.',
      hi: 'प्रक्षेप्य एक साथ नियत क्षैतिज वेग (vx = u·cosθ) और नीचे की ओर नियत गुरुत्वीय त्वरण (-g) के अंतर्गत चलता है। सबसे ऊँचे बिंदु पर ऊर्ध्वाधर वेग vy शून्य हो जाता है, पर क्षैतिज वेग vx हमेशा नियत रहता है।',
    },
    realLife: {
      en: 'Javelin throwers and cricketers hitting a six aim near 45° (adjusted slightly for air drag) to maximize horizontal distance.',
      hi: 'भाला फेंक (जैवलिन थ्रो) और क्रिकेट में छक्का मारते समय अधिकतम दूरी के लिए लगभग 45° के कोण पर प्रक्षेपण किया जाता है।',
    },
    whatIfPrompts: [
      {
        id: 'proj-comp',
        question: {
          en: 'Compare launch angle 30° vs 60° at the same speed u = 28 m/s. Which one lands farther?',
          hi: 'समान वेग u = 28 m/s पर 30° और 60° कोण की तुलना करें। कौन अधिक दूर गिरेगा?',
        },
        hint: {
          en: 'Check sin(2 × 30°) = sin(60°) vs sin(2 × 60°) = sin(120°).',
          hi: 'sin(2×30°) = sin(60°) और sin(2×60°) = sin(120°) के मान देखें।',
        },
        answer: {
          en: 'BOTH land at the exact SAME horizontal Range R! Complementary angles (θ and 90°−θ) share identical range, though 60° goes higher and stays airborne longer.',
          hi: 'दोनों ठीक एक ही क्षैतिज परास (Range) पर गिरते हैं! पूरक कोणों (θ और 90°−θ) का परास हमेशा समान होता है, बस 60° अधिक ऊँचाई लेता है।',
        },
        targetParams: { u: 28, theta: 60, g: 9.8 },
      },
      {
        id: 'proj-peak-vel',
        question: {
          en: 'Launch almost vertically at 75°. Does total speed ever become zero at the very top?',
          hi: '75° के ऊँचे कोण पर प्रक्षेपण करें। क्या सबसे ऊँचे बिंदु पर कुल चाल शून्य होती है?',
        },
        hint: {
          en: 'Watch the blue horizontal arrow vx at the peak.',
          hi: 'शीर्ष बिंदु पर नीले क्षैतिज वेग सदिश vx को ध्यान से देखें।',
        },
        answer: {
          en: 'No! Vertical velocity vy hits 0 at the peak, but horizontal velocity vx = u·cos(75°) keeps pushing the ball forward.',
          hi: 'नहीं! शीर्ष पर केवल ऊर्ध्वाधर वेग vy शून्य होता है, क्षैतिज वेग vx = u·cos(75°) लगातार बना रहता है।',
        },
        targetParams: { u: 30, theta: 75, g: 9.8 },
      },
    ],
    graphTitle: { en: 'Range R vs Launch Angle θ', hi: 'परास R बनाम प्रक्षेपण कोण θ' },
    graphXLabel: 'θ (°)',
    graphYLabel: 'R (m)',
  },

  // 6. WORK, ENERGY & POWER
  {
    id: 'work-energy',
    chapterId: 'work-energy',
    title: {
      en: 'Conservation of Mechanical Energy',
      hi: 'यांत्रिक ऊर्जा संरक्षण (K + U = E)',
    },
    subtitle: {
      en: 'Roller-coaster parabolic track transforming Potential Energy mgh into Kinetic Energy ½mv²',
      hi: 'ट्रैक पर स्थितिज ऊर्जा mgh और गतिज ऊर्जा ½mv² का सजीव रूपांतरण',
    },
    formulaDisplay: 'E = K + U = ½mv² + mgh',
    secondaryFormulas: [
      { label: { en: 'Max Speed at Bottom', hi: 'निचले बिंदु पर अधिकतम चाल' }, formula: 'v_max = √(2·g·h)' },
      { label: { en: 'Thermal Loss', hi: 'घर्षण से ऊष्मा हानि' }, formula: 'ΔE_th = E_initial − (K + U)' },
    ],
    variables: [
      {
        key: 'm',
        symbol: 'm',
        label: { en: 'Skater Mass', hi: 'वस्तु का द्रव्यमान' },
        unit: 'kg',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 5,
      },
      {
        key: 'h0',
        symbol: 'h₀',
        label: { en: 'Release Height', hi: 'प्रारंभिक ऊँचाई (h₀)' },
        unit: 'm',
        min: 2,
        max: 12,
        step: 0.5,
        defaultValue: 9,
      },
      {
        key: 'g',
        symbol: 'g',
        label: { en: 'Gravity', hi: 'गुरुत्वीय त्वरण (g)' },
        unit: 'm/s²',
        min: 1.6,
        max: 20,
        step: 0.2,
        defaultValue: 9.8,
      },
      {
        key: 'damping',
        symbol: 'μ_d',
        label: { en: 'Track Friction', hi: 'ट्रैक का घर्षण' },
        unit: '',
        min: 0,
        max: 0.15,
        step: 0.01,
        defaultValue: 0,
      },
    ],
    presets: [
      { id: 'ideal', label: { en: 'Frictionless Track', hi: 'घर्षण रहित ट्रैक' }, params: { m: 5, h0: 9, g: 9.8, damping: 0 } },
      { id: 'damped', label: { en: 'With Friction Loss', hi: 'घर्षण सहित' }, params: { m: 5, h0: 10, g: 9.8, damping: 0.08 } },
      { id: 'high-drop', label: { en: 'Max Drop (12 m)', hi: 'अधिकतम ऊँचाई (12 m)' }, params: { m: 8, h0: 12, g: 9.8, damping: 0 } },
    ],
    explanation: {
      en: 'Without friction, total mechanical energy E = K + U stays constant at every point on the track. As the ball descends, gravitational potential energy mgh converts seamlessly into kinetic energy ½mv², reaching maximum speed at the lowest point.',
      hi: 'घर्षण के बिना कुल यांत्रिक ऊर्जा E = K + U ट्रैक के हर बिंदु पर नियत रहती है। नीचे आते समय स्थितिज ऊर्जा mgh पूरी तरह गतिज ऊर्जा ½mv² में बदलती है और सबसे निचले बिंदु पर चाल अधिकतम होती है।',
    },
    realLife: {
      en: 'Roller coasters climb one tall lift hill at the start to store potential energy, then coast through every loop using energy conversion alone.',
      hi: 'रोलर कोस्टर शुरुआत में ऊँचाई पर चढ़कर स्थितिज ऊर्जा संचित करता है और फिर उसी ऊर्जा के रूपांतरण से पूरे ट्रैक पर दौड़ता है।',
    },
    whatIfPrompts: [
      {
        id: 'energy-mass-speed',
        question: {
          en: 'Triple the mass from 5 kg to 15 kg at the same height h₀ = 9 m. Does the maximum speed at the bottom change?',
          hi: 'समान ऊँचाई h₀ = 9 m पर द्रव्यमान को 5 kg से तिगुना 15 kg करें। क्या निचले बिंदु पर अधिकतम चाल बदलेगी?',
        },
        hint: {
          en: 'In ½mv² = mgh, notice that mass m cancels out from both sides!',
          hi: '½mv² = mgh में दोनों तरफ से द्रव्यमान m कट जाता है!',
        },
        answer: {
          en: 'Total energy triples, but maximum speed v_max = √(2gh) stays IDENTICAL (13.3 m/s) because mass cancels out!',
          hi: 'कुल ऊर्जा तिगुनी हो जाती है, पर अधिकतम चाल v_max = √(2gh) बिल्कुल वही (13.3 m/s) रहती है क्योंकि द्रव्यमान कट जाता है!',
        },
        targetParams: { m: 15, h0: 9, g: 9.8, damping: 0 },
      },
      {
        id: 'energy-friction',
        question: {
          en: 'Add track friction μ_d = 0.08. Where does the missing mechanical energy go?',
          hi: 'ट्रैक में घर्षण μ_d = 0.08 जोड़ें। कम होती यांत्रिक ऊर्जा कहाँ जा रही है?',
        },
        hint: {
          en: 'Watch the peak height shrink each swing while total energy converts.',
          hi: 'हर दोलन में ऊँचाई कम होते हुए और ऊष्मा ऊर्जा बढ़ते हुए देखें।',
        },
        answer: {
          en: 'Friction converts mechanical energy gradually into Thermal Energy (heat), reducing swing amplitude until the ball settles at the bottom.',
          hi: 'घर्षण यांत्रिक ऊर्जा को धीरे-धीरे ऊष्मीय ऊर्जा (गर्मी) में बदल देता है, जिससे आयाम घटते-घटते वस्तु नीचे रुक जाती है।',
        },
        targetParams: { m: 5, h0: 10, g: 9.8, damping: 0.08 },
      },
    ],
    graphTitle: { en: 'Kinetic Energy K & Potential Energy U vs Time', hi: 'गतिज ऊर्जा K और स्थितिज ऊर्जा U बनाम समय' },
    graphXLabel: 't (s)',
    graphYLabel: 'Energy (J)',
  },

  // 7. OSCILLATIONS & SHM
  {
    id: 'shm-spring',
    chapterId: 'oscillations',
    title: {
      en: 'Simple Harmonic Motion (Spring-Mass)',
      hi: 'सरल आवर्त गति (स्प्रिंग-द्रव्यमान)',
    },
    subtitle: {
      en: 'Hooke’s Law restoring force F = −kx and real-time sinusoidal oscilloscope',
      hi: 'हुक का प्रत्यानयन बल F = −kx और सजीव ज्यावक्रीय ग्राफ',
    },
    formulaDisplay: 'F = −k · x   |   T = 2π·√(m / k)',
    secondaryFormulas: [
      { label: { en: 'Angular Frequency', hi: 'कोणीय आवृत्ति' }, formula: 'ω = √(k / m)' },
      { label: { en: 'Max Velocity', hi: 'अधिकतम वेग' }, formula: 'v_max = ω · A' },
    ],
    variables: [
      {
        key: 'k',
        symbol: 'k',
        label: { en: 'Spring Constant', hi: 'स्प्रिंग नियतांक (k)' },
        unit: 'N/m',
        min: 5,
        max: 100,
        step: 5,
        defaultValue: 35,
      },
      {
        key: 'm',
        symbol: 'm',
        label: { en: 'Block Mass', hi: 'द्रव्यमान (m)' },
        unit: 'kg',
        min: 0.5,
        max: 10,
        step: 0.5,
        defaultValue: 2,
      },
      {
        key: 'A',
        symbol: 'A',
        label: { en: 'Amplitude', hi: 'आयाम (A)' },
        unit: 'm',
        min: 0.2,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.2,
      },
      {
        key: 'c',
        symbol: 'b',
        label: { en: 'Damping', hi: 'अवमंदन (Damping)' },
        unit: 'N·s/m',
        min: 0,
        max: 2.0,
        step: 0.1,
        defaultValue: 0,
      },
    ],
    presets: [
      { id: 'stiff', label: { en: 'Stiff Fast Spring', hi: 'कठोर तेज़ स्प्रिंग' }, params: { k: 80, m: 1, A: 1.2, c: 0 } },
      { id: 'heavy-slow', label: { en: 'Heavy Slow Mass', hi: 'भारी धीमा दोलन' }, params: { k: 20, m: 8, A: 1.4, c: 0 } },
      { id: 'shock-absorber', label: { en: 'Car Shock Absorber', hi: 'अवमंदित (Shock Absorber)' }, params: { k: 40, m: 2, A: 1.5, c: 1.2 } },
    ],
    explanation: {
      en: 'In SHM, the restoring force F = −kx always points back toward equilibrium (x = 0) and is proportional to displacement. Remarkably, the time period T = 2π√(m/k) does NOT depend on amplitude A!',
      hi: 'सरल आवर्त गति में प्रत्यानयन बल F = −kx हमेशा साम्यावस्था (x = 0) की ओर लगता है। विशेष बात यह है कि आवर्तकाल T = 2π√(m/k) आयाम A पर निर्भर नहीं करता!',
    },
    realLife: {
      en: 'Vehicle suspension springs, quartz watch crystals, and vibrating guitar strings all follow simple harmonic restoring forces.',
      hi: 'वाहनों के शॉक एब्जॉर्बर, घड़ियों के क्रिस्टल और गिटार के तार सरल आवर्त गति के सिद्धांत पर काम करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'shm-amp-period',
        question: {
          en: 'Double the amplitude A from 0.8 m to 1.6 m. Does the Time Period T become longer?',
          hi: 'आयाम A को 0.8 m से दोगुना 1.6 m करने पर क्या आवर्तकाल T बढ़ जाएगा?',
        },
        hint: {
          en: 'Look at the formula T = 2π√(m/k). Is A anywhere inside it?',
          hi: 'सूत्र T = 2π√(m/k) में देखें—क्या इसमें कहीं A है?',
        },
        answer: {
          en: 'NO! Time period T stays unchanged because larger stretch produces a proportionally stronger restoring force and higher speed!',
          hi: 'नहीं! आवर्तकाल T वही रहता है क्योंकि अधिक खिंचाव पर प्रत्यानयन बल और वेग दोनों समान अनुपात में बढ़ जाते हैं!',
        },
        targetParams: { k: 35, m: 2, A: 1.6, c: 0 },
      },
      {
        id: 'shm-quad-mass',
        question: {
          en: 'Increase mass m by 4× (from 2 kg to 8 kg). How does the Time Period T change?',
          hi: 'द्रव्यमान m को 4 गुना (2 kg से 8 kg) बढ़ाने पर आवर्तकाल T कितना बदलेगा?',
        },
        hint: {
          en: 'T is proportional to √m, and √4 = 2.',
          hi: 'T, √m के समानुपाती होता है, और √4 = 2 होता है।',
        },
        answer: {
          en: 'Time period T exactly DOUBLES, making the oscillation half as frequent!',
          hi: 'आवर्तकाल T ठीक दोगुना हो जाता है और दोलन की आवृत्ति आधी रह जाती है!',
        },
        targetParams: { k: 35, m: 8, A: 1.2, c: 0 },
      },
    ],
    graphTitle: { en: 'Displacement x(t) & Velocity v(t) Oscilloscope', hi: 'विस्थापन x(t) और वेग v(t) ग्राफ' },
    graphXLabel: 't (s)',
    graphYLabel: 'x (m)',
  },

  // 8. WAVES & SUPERPOSITION
  {
    id: 'wave-superposition',
    chapterId: 'waves',
    title: {
      en: 'Wave Motion & Superposition',
      hi: 'तरंग गति और अध्यारोपण (व्यतिकरण)',
    },
    subtitle: {
      en: 'Two traveling waves interfering constructively or destructively in real time',
      hi: 'दो तरंगों का सजीव संपोषी और विनाशी व्यतिकरण',
    },
    formulaDisplay: 'v = f · λ   |   y = y₁ + y₂',
    secondaryFormulas: [
      { label: { en: 'Resultant Amplitude', hi: 'परिणामी आयाम' }, formula: 'A_net = √(A₁² + A₂² + 2A₁A₂cosφ)' },
      { label: { en: 'Wave Number', hi: 'तरंग संख्या' }, formula: 'k = 2π / λ' },
    ],
    variables: [
      {
        key: 'f',
        symbol: 'f',
        label: { en: 'Frequency', hi: 'आवृत्ति (f)' },
        unit: 'Hz',
        min: 0.5,
        max: 4.0,
        step: 0.1,
        defaultValue: 1.5,
      },
      {
        key: 'lambda',
        symbol: 'λ',
        label: { en: 'Wavelength', hi: 'तरंगदैर्घ्य (λ)' },
        unit: 'm',
        min: 1.0,
        max: 6.0,
        step: 0.2,
        defaultValue: 3.0,
      },
      {
        key: 'A',
        symbol: 'A',
        label: { en: 'Wave Amplitude', hi: 'तरंग का आयाम (A)' },
        unit: 'm',
        min: 0.2,
        max: 1.5,
        step: 0.1,
        defaultValue: 0.9,
      },
      {
        key: 'phase',
        symbol: 'φ',
        label: { en: 'Phase Difference', hi: 'कलांतर (φ)' },
        unit: '°',
        min: 0,
        max: 360,
        step: 15,
        defaultValue: 0,
      },
    ],
    presets: [
      { id: 'constructive', label: { en: 'Constructive (0°)', hi: 'संपोषी व्यतिकरण (0°)' }, params: { f: 1.5, lambda: 3.0, A: 0.9, phase: 0 } },
      { id: 'destructive', label: { en: 'Destructive (180°)', hi: 'विनाशी व्यतिकरण (180°)' }, params: { f: 1.5, lambda: 3.0, A: 0.9, phase: 180 } },
      { id: 'quadrature', label: { en: '90° Phase Shift', hi: '90° कलांतर' }, params: { f: 1.5, lambda: 3.0, A: 0.9, phase: 90 } },
    ],
    explanation: {
      en: 'By the Principle of Superposition, when two waves overlap at a point, their displacements add algebraically (y = y₁ + y₂). At phase difference φ = 0°, crests align to double the amplitude; at φ = 180°, crests meet troughs and cancel out completely!',
      hi: 'अध्यारोपण के सिद्धांत के अनुसार जब दो तरंगें मिलती हैं, तो उनका कुल विस्थापन दोनों के योग (y = y₁ + y₂) के बराबर होता है। φ = 0° पर आयाम दोगुना (संपोषी) और φ = 180° पर शून्य (विनाशी) हो जाता है!',
    },
    realLife: {
      en: 'Active Noise-Canceling headphones record outside sound and generate an exact 180°-inverted wave to cancel noise through destructive interference.',
      hi: 'नॉइज़-कैंसलिंग हेडफ़ोन बाहरी शोर की ठीक 180° विपरीत तरंग बनाकर विनाशी व्यतिकरण द्वारा शोर को शांत कर देते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'wave-cancel',
        question: {
          en: 'Set the phase difference φ to 180° between two identical waves. What happens to the resultant wave?',
          hi: 'दो समान तरंगों के बीच कलांतर φ = 180° रखने पर परिणामी तरंग कैसी दिखेगी?',
        },
        hint: {
          en: 'cos(180°) = −1 inside A_net = √(A² + A² + 2A²cosφ).',
          hi: 'A_net सूत्र में cos(180°) = −1 रखकर देखें।',
        },
        answer: {
          en: 'Complete Destructive Interference! Every crest cancels a trough, producing a flat zero-amplitude line.',
          hi: 'पूर्ण विनाशी व्यतिकरण! हर श्रृंग गर्त को काट देता है और परिणामी तरंग पूरी तरह सपाट (शून्य) हो जाती है।',
        },
        targetParams: { f: 1.5, lambda: 3.0, A: 0.9, phase: 180 },
      },
      {
        id: 'wave-double-f',
        question: {
          en: 'Double frequency f from 1.5 Hz to 3.0 Hz while keeping λ = 3.0 m. How does wave speed v change?',
          hi: 'तरंगदैर्घ्य λ = 3.0 m स्थिर रखकर आवृत्ति f को 1.5 Hz से 3.0 Hz करें। तरंग वेग v कितना होगा?',
        },
        hint: {
          en: 'Apply v = f · λ directly.',
          hi: 'सीधे v = f · λ लागू करें।',
        },
        answer: {
          en: 'Wave speed v doubles from 4.5 m/s to 9.0 m/s as peaks travel twice as fast across the medium.',
          hi: 'तरंग वेग v दोगुना होकर 4.5 m/s से 9.0 m/s हो जाता है।',
        },
        targetParams: { f: 3.0, lambda: 3.0, A: 0.9, phase: 0 },
      },
    ],
    graphTitle: { en: 'Resultant Amplitude A_net vs Phase φ', hi: 'परिणामी आयाम बनाम कलांतर φ' },
    graphXLabel: 'φ (°)',
    graphYLabel: 'A_net (m)',
  },

  // 9. COULOMB'S LAW & ELECTRIC FIELD
  {
    id: 'coulombs-law',
    chapterId: 'electric-charges',
    supports3D: true,
    title: {
      en: 'Coulomb’s Law & Electric Field',
      hi: 'कूलॉम का नियम और विद्युत क्षेत्र',
    },
    subtitle: {
      en: 'Electrostatic attraction/repulsion vectors and live electric field lines',
      hi: 'स्थिरवैद्युत आकर्षण/प्रतिकर्षण बल सदिश और सजीव विद्युत क्षेत्र रेखाएँ',
    },
    formulaDisplay: 'F = k · |q₁ · q₂| / r²',
    secondaryFormulas: [
      { label: { en: 'Coulomb Constant', hi: 'कूलॉम नियतांक' }, formula: 'k = 8.99 × 10⁹ N·m²/C²' },
      { label: { en: 'Electric Field at q₂', hi: 'q₂ पर विद्युत क्षेत्र' }, formula: 'E₁ = k·|q₁| / r²' },
    ],
    variables: [
      {
        key: 'q1',
        symbol: 'q₁',
        label: { en: 'Charge 1', hi: 'आवेश 1 (q₁)' },
        unit: 'μC',
        min: -10,
        max: 10,
        step: 1,
        defaultValue: 6,
      },
      {
        key: 'q2',
        symbol: 'q₂',
        label: { en: 'Charge 2', hi: 'आवेश 2 (q₂)' },
        unit: 'μC',
        min: -10,
        max: 10,
        step: 1,
        defaultValue: -6,
      },
      {
        key: 'r',
        symbol: 'r',
        label: { en: 'Separation Distance', hi: 'दोनों आवेशों की दूरी (r)' },
        unit: 'cm',
        min: 10,
        max: 60,
        step: 2,
        defaultValue: 24,
      },
    ],
    presets: [
      { id: 'dipole', label: { en: 'Electric Dipole (+ / −)', hi: 'विद्युत द्विध्रुव (+ / −)' }, params: { q1: 6, q2: -6, r: 24 } },
      { id: 'repel-pos', label: { en: 'Like Charges (+ / +)', hi: 'समान आवेश प्रतिकर्षण (+ / +)' }, params: { q1: 6, q2: 6, r: 24 } },
      { id: 'close-strong', label: { en: 'Close Range (r=12cm)', hi: 'अत्यंत निकट (12 cm)' }, params: { q1: 8, q2: -8, r: 12 } },
    ],
    explanation: {
      en: 'Like charges repel and opposite charges attract with a force following the inverse-square law F = k|q₁q₂|/r². Electric field lines always emerge from positive (+) charges and terminate on negative (−) charges.',
      hi: 'समान आवेश एक-दूसरे को प्रतिकर्षित तथा विपरीत आवेश आकर्षित करते हैं और बल व्युत्क्रम-वर्ग नियम F = k|q₁q₂|/r² का पालन करता है। विद्युत क्षेत्र रेखाएँ धनावेश (+) से निकलकर ऋणावेश (−) पर समाप्त होती हैं।',
    },
    realLife: {
      en: 'Photocopiers, laser printers, and electrostatic air purifiers use Coulomb attraction to pull charged toner or dust particles precisely onto target surfaces.',
      hi: 'फोटोकॉपी मशीन और एयर प्यूरीफायर आवेशित कणों को आकर्षित करने के लिए कूलॉम के नियम का उपयोग करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'coulomb-sign-flip',
        question: {
          en: 'Flip q₂ from −6 μC to +6 μC. What happens to the force direction and field lines between them?',
          hi: 'q₂ को −6 μC से बदलकर +6 μC करें। बल की दिशा और बीच की क्षेत्र रेखाओं में क्या बदलाव होगा?',
        },
        hint: {
          en: 'Like charges push outward, creating a zero-field neutral point right between them.',
          hi: 'समान आवेश एक-दूसरे को बाहर धकेलते हैं और बीच में उदासीन बिंदु बनता है।',
        },
        answer: {
          en: 'The force magnitude stays identical, but the force arrows reverse outward into REPULSION and the field lines bend away from the center!',
          hi: 'बल का परिमाण वही रहता है, पर बल सदिश बाहर की ओर प्रतिकर्षण दिखाते हैं और क्षेत्र रेखाएँ एक-दूसरे से दूर मुड़ जाती हैं!',
        },
        targetParams: { q1: 6, q2: 6, r: 24 },
      },
      {
        id: 'coulomb-half-r',
        question: {
          en: 'Cut the separation distance r in half (from 24 cm to 12 cm). How much stronger does the force get?',
          hi: 'दूरी r को आधा (24 cm से 12 cm) करने पर विद्युत बल कितना गुना बढ़ जाएगा?',
        },
        hint: {
          en: 'Dividing r by 2 multiplies 1/r² by 4.',
          hi: 'r को आधा करने पर 1/r² चार गुना हो जाता है।',
        },
        answer: {
          en: 'The electrostatic force jumps by 4× (quadruples)!',
          hi: 'स्थिरवैद्युत बल ठीक 4 गुना बढ़ जाता है!',
        },
        targetParams: { q1: 6, q2: -6, r: 12 },
      },
    ],
    graphTitle: { en: 'Electrostatic Force F vs Distance r', hi: 'विद्युत बल F बनाम दूरी r' },
    graphXLabel: 'r (cm)',
    graphYLabel: 'F (N)',
  },

  // 10. OHM'S LAW & CIRCUIT POWER
  {
    id: 'ohms-law',
    chapterId: 'current-electricity',
    title: {
      en: 'Ohm’s Law & Electric Power',
      hi: 'ओम का नियम और विद्युत शक्ति',
    },
    subtitle: {
      en: 'Live DC circuit showing electron drift speed, filament glow, and V–I graph',
      hi: 'सजीव DC परिपथ: धारा प्रवाह, बल्ब की चमक और V–I ग्राफ',
    },
    formulaDisplay: 'V = I · R   |   P = V · I = I²·R',
    secondaryFormulas: [
      { label: { en: 'Current', hi: 'विद्युत धारा' }, formula: 'I = V / R' },
      { label: { en: 'Heat in 10s', hi: '10 सेकंड में ऊष्मा' }, formula: 'H = I²·R·t' },
    ],
    variables: [
      {
        key: 'V',
        symbol: 'V',
        label: { en: 'Battery Voltage', hi: 'बैटरी विभवांतर (V)' },
        unit: 'V',
        min: 1,
        max: 24,
        step: 1,
        defaultValue: 12,
      },
      {
        key: 'R',
        symbol: 'R',
        label: { en: 'Resistance', hi: 'प्रतिरोध (R)' },
        unit: 'Ω',
        min: 2,
        max: 30,
        step: 1,
        defaultValue: 6,
      },
    ],
    presets: [
      { id: 'bright', label: { en: 'High Power Glow', hi: 'अधिक चमक (उच्च शक्ति)' }, params: { V: 20, R: 4 } },
      { id: 'nominal', label: { en: '12V Standard', hi: '12V सामान्य परिपथ' }, params: { V: 12, R: 6 } },
      { id: 'high-res', label: { en: 'High Resistance Dim', hi: 'उच्च प्रतिरोध (कम धारा)' }, params: { V: 12, R: 24 } },
    ],
    explanation: {
      en: 'At constant temperature, current I flowing through a metallic conductor is directly proportional to potential difference V and inversely proportional to resistance R. Dissipated power P = V²/R determines how brightly the lamp glows.',
      hi: 'नियत ताप पर किसी चालक में प्रवाहित धारा I, विभवांतर V के अनुक्रमानुपाती और प्रतिरोध R के व्युत्क्रमानुपाती होती है। बल्ब की चमक विद्युत शक्ति P = V·I पर निर्भर करती है।',
    },
    realLife: {
      en: 'Fan regulators and dimmer switches insert variable resistance/impedance to smoothly control current and power delivery.',
      hi: 'पंखे का रेगुलेटर और डिमर स्विच धारा को नियंत्रित कर गति और प्रकाश की तीव्रता कम-ज्यादा करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'ohm-double-v',
        question: {
          en: 'Double the Voltage V from 12 V to 24 V with fixed R = 6 Ω. How much does Power P increase?',
          hi: 'प्रतिरोध R = 6 Ω स्थिर रखकर वोल्टेज V को 12 V से दोगुना 24 V करें। शक्ति P कितनी गुना बढ़ेगी?',
        },
        hint: {
          en: 'Both V AND current I double, so P = V·I = V²/R scales with V²!',
          hi: 'V के साथ-साथ धारा I भी दोगुनी होती है, इसलिए P = V²/R होता है!',
        },
        answer: {
          en: 'Current doubles (2 A → 4 A), while Power P QUADRUPLES (24 W → 96 W), making the bulb glow fiercely bright!',
          hi: 'धारा दोगुनी (2 A → 4 A) और शक्ति P चार गुना (24 W → 96 W) हो जाती है, जिससे बल्ब अत्यंत तेज़ चमकता है!',
        },
        targetParams: { V: 24, R: 6 },
      },
      {
        id: 'ohm-triple-r',
        question: {
          en: 'Increase Resistance R to 24 Ω at V = 12 V. Watch the moving charge dots—how does current change?',
          hi: 'V = 12 V पर प्रतिरोध R को 24 Ω तक बढ़ाएँ। परिपथ में बहते आवेश कणों की गति देखें।',
        },
        hint: {
          en: 'I = 12 / 24 = 0.5 A.',
          hi: 'I = 12 / 24 = 0.5 A होगा।',
        },
        answer: {
          en: 'Higher resistance bottlenecks electron flow, dropping current to 0.5 A and dimming the filament to just 6 W.',
          hi: 'उच्च प्रतिरोध धारा प्रवाह को रोकता है, जिससे धारा घटकर 0.5 A और चमक केवल 6 W रह जाती है।',
        },
        targetParams: { V: 12, R: 24 },
      },
    ],
    graphTitle: { en: 'Ohm’s Characteristic: Current I vs Voltage V', hi: 'ओम ग्राफ: धारा I बनाम विभवांतर V' },
    graphXLabel: 'V (Volts)',
    graphYLabel: 'I (Amps)',
  },

  // 11. LORENTZ MAGNETIC FORCE (CYCLOTRON)
  {
    id: 'lorentz-force',
    chapterId: 'moving-charges',
    supports3D: true,
    title: {
      en: 'Lorentz Magnetic Force & Cyclotron Path',
      hi: 'लॉरेंत्ज़ चुंबकीय बल और साइक्लोट्रॉन पथ',
    },
    subtitle: {
      en: 'Charged particle curving inside a uniform magnetic field B with perpendicular force F',
      hi: 'समान चुंबकीय क्षेत्र B में आवेशित कण का वृत्ताकार पथ और लंबवत बल F',
    },
    formulaDisplay: 'F = q·v·B   |   r = (m·v) / (q·B)',
    secondaryFormulas: [
      { label: { en: 'Cyclotron Frequency', hi: 'साइक्लोट्रॉन आवृत्ति' }, formula: 'f = (q·B) / (2π·m)' },
      { label: { en: 'Work Done by B', hi: 'चुंबकीय बल द्वारा कार्य' }, formula: 'W = F·d·cos(90°) = 0' },
    ],
    variables: [
      {
        key: 'v',
        symbol: 'v',
        label: { en: 'Particle Speed', hi: 'कण की चाल (v)' },
        unit: '×10⁶ m/s',
        min: 1,
        max: 10,
        step: 0.5,
        defaultValue: 5,
      },
      {
        key: 'B',
        symbol: 'B',
        label: { en: 'Magnetic Field (Into Page ⊗)', hi: 'चुंबकीय क्षेत्र B (अंदर की ओर ⊗)' },
        unit: 'T',
        min: 0.2,
        max: 2.0,
        step: 0.1,
        defaultValue: 0.8,
      },
      {
        key: 'q',
        symbol: 'q',
        label: { en: 'Charge Sign & Magnitude', hi: 'आवेश (q)' },
        unit: 'e',
        min: -3,
        max: 3,
        step: 1,
        defaultValue: 1,
      },
      {
        key: 'm',
        symbol: 'm',
        label: { en: 'Particle Mass', hi: 'कण का द्रव्यमान' },
        unit: 'u',
        min: 1,
        max: 6,
        step: 0.5,
        defaultValue: 2,
      },
    ],
    presets: [
      { id: 'proton', label: { en: 'Positive Charge (+1e)', hi: 'धनावेश (+1e)' }, params: { v: 5, B: 0.8, q: 1, m: 2 } },
      { id: 'negative', label: { en: 'Negative Charge (−1e)', hi: 'ऋणावेश (−1e)' }, params: { v: 5, B: 0.8, q: -1, m: 2 } },
      { id: 'strong-b', label: { en: 'Strong Field (Tight Loop)', hi: 'प्रबल क्षेत्र (छोटा वृत्त)' }, params: { v: 5, B: 1.8, q: 2, m: 2 } },
    ],
    explanation: {
      en: 'A magnetic force F = q(v × B) always acts perpendicular to velocity v, so it never speeds up or slows down the particle—it only bends the trajectory into a circle of radius r = mv/(qB). Reversing the charge sign flips the curving direction!',
      hi: 'चुंबकीय बल F = q(v × B) हमेशा वेग v के लंबवत लगता है, इसलिए यह चाल नहीं बदलता बल्कि कण को r = mv/(qB) त्रिज्या के वृत्त में मोड़ देता है। आवेश का चिह्न बदलने पर घूमने की दिशा उलट जाती है!',
    },
    realLife: {
      en: 'Mass spectrometers separate isotopes by their circular path radius, and Earth’s magnetic field deflects solar wind particles toward the poles to create auroras.',
      hi: 'मास स्पेक्ट्रोमीटर इसी त्रिज्या के अंतर से समस्थानिकों को अलग करते हैं और पृथ्वी का चुंबकीय क्षेत्र सौर कणों को मोड़कर ध्रुवों पर ऑरोरा बनाता है।',
    },
    whatIfPrompts: [
      {
        id: 'lorentz-strong-b',
        question: {
          en: 'Double the Magnetic Field B from 0.8 T to 1.6 T. Does the circular orbit radius get larger or tighter?',
          hi: 'चुंबकीय क्षेत्र B को 0.8 T से दोगुना 1.6 T करने पर वृत्ताकार कक्षा बड़ी होगी या छोटी?',
        },
        hint: {
          en: 'Look at B in the denominator of r = mv / (qB).',
          hi: 'r = mv / (qB) में हर के अंदर B को देखें।',
        },
        answer: {
          en: 'The circle becomes HALF as wide (tighter loop!) because stronger magnetic force bends the path twice as sharply.',
          hi: 'वृत्त की त्रिज्या ठीक आधी रह जाती है क्योंकि प्रबल चुंबकीय बल कण को दोगुनी तेज़ी से मोड़ देता है!',
        },
        targetParams: { v: 5, B: 1.6, q: 1, m: 2 },
      },
      {
        id: 'lorentz-neg',
        question: {
          en: 'Change charge q from +1 to −1. How does the direction of circulation change?',
          hi: 'आवेश q को +1 से बदलकर −1 करने पर कण के घूमने की दिशा पर क्या असर होगा?',
        },
        hint: {
          en: 'Use Fleming’s Left-Hand Rule for opposite charge sign.',
          hi: 'विपरीत आवेश के लिए फ्लेमिंग का वाम-हस्त नियम लगाएँ।',
        },
        answer: {
          en: 'The magnetic force flips 180°, curving the negative particle in the exact OPPOSITE sense (clockwise vs counter-clockwise)!',
          hi: 'चुंबकीय बल की दिशा उलट जाती है और ऋणावेश ठीक विपरीत दिशा में वृत्त बनाने लगता है!',
        },
        targetParams: { v: 5, B: 0.8, q: -1, m: 2 },
      },
    ],
    graphTitle: { en: 'Orbit Radius r vs Magnetic Field B', hi: 'कक्षीय त्रिज्या r बनाम चुंबकीय क्षेत्र B' },
    graphXLabel: 'B (Tesla)',
    graphYLabel: 'r (scaled)',
  },

  // 12. THIN LENS FORMULA & RAY OPTICS
  {
    id: 'thin-lens',
    chapterId: 'ray-optics',
    title: {
      en: 'Thin Lens Formula & Ray Tracing',
      hi: 'पतले लेंस का सूत्र और किरण आरेख',
    },
    subtitle: {
      en: 'Interactive convex/concave lens with live principal rays, real & virtual images',
      hi: 'उत्तल/अवतल लेंस में सजीव मुख्य किरणें, वास्तविक और आभासी प्रतिबिंब',
    },
    formulaDisplay: '1/f = 1/v − 1/u   |   m = v / u',
    secondaryFormulas: [
      { label: { en: 'Lens Power', hi: 'लेंस की क्षमता' }, formula: 'P = 100 / f(cm) Dioptre' },
      { label: { en: 'Image Height', hi: 'प्रतिबिंब की ऊँचाई' }, formula: 'hᵢ = m · hₒ' },
    ],
    variables: [
      {
        key: 'f',
        symbol: 'f',
        label: { en: 'Focal Length (+Convex / −Concave)', hi: 'फोकस दूरी (+उत्तल / −अवतल)' },
        unit: 'cm',
        min: -25,
        max: 25,
        step: 1,
        defaultValue: 15,
      },
      {
        key: 'uAbs',
        symbol: '|u|',
        label: { en: 'Object Distance (Left)', hi: 'वस्तु की दूरी (बाईं ओर)' },
        unit: 'cm',
        min: 6,
        max: 55,
        step: 1,
        defaultValue: 30,
      },
      {
        key: 'ho',
        symbol: 'hₒ',
        label: { en: 'Object Height', hi: 'वस्तु की ऊँचाई' },
        unit: 'cm',
        min: 2,
        max: 10,
        step: 0.5,
        defaultValue: 6,
      },
    ],
    presets: [
      { id: 'at-2f', label: { en: 'Object at 2F (m = −1)', hi: '2F पर वस्तु (समान आकार)' }, params: { f: 15, uAbs: 30, ho: 6 } },
      { id: 'magnifier', label: { en: 'Magnifying Glass (u < f)', hi: 'आवर्धक लेंस (आभासी प्रतिबिंब)' }, params: { f: 18, uAbs: 10, ho: 5 } },
      { id: 'projector', label: { en: 'Projector (f < u < 2f)', hi: 'प्रोजेक्टर (बड़ा वास्तविक)' }, params: { f: 14, uAbs: 20, ho: 5 } },
      { id: 'concave', label: { en: 'Concave Diverging', hi: 'अवतल लेंस (अपसारी)' }, params: { f: -16, uAbs: 28, ho: 6 } },
    ],
    explanation: {
      en: 'Using Cartesian sign convention (u is negative), a convex lens (+f) forms real, inverted images when the object is beyond F, and a magnified virtual upright image when placed inside the focal length (|u| < f). A concave lens (−f) always forms a diminished virtual upright image.',
      hi: 'चिह्न परिपाटी के अनुसार उत्तल लेंस (+f) फोकस के बाहर रखी वस्तु का वास्तविक और उल्टा प्रतिबिंब बनाता है, जबकि फोकस के अंदर रखने पर बड़ा आभासी और सीधा प्रतिबिंब बनता है। अवतल लेंस (−f) सदैव छोटा और आभासी प्रतिबिंब बनाता है।',
    },
    realLife: {
      en: 'Human eyes, camera lenses, classroom projectors, and eyeglasses (myopia/hypermetropia correction) all rely directly on the thin lens equation.',
      hi: 'मानव नेत्र, कैमरा, प्रोजेक्टर और निकट/दूर दृष्टि दोष के चश्मे सीधे पतले लेंस के सूत्र पर काम करते हैं।',
    },
    whatIfPrompts: [
      {
        id: 'lens-magnifier',
        question: {
          en: 'Move the object INSIDE the focal length (f = 18 cm, |u| = 10 cm). Where does the image form?',
          hi: 'वस्तु को फोकस के अंदर (f = 18 cm, |u| = 10 cm) लाएँ। प्रतिबिंब कहाँ और कैसा बनेगा?',
        },
        hint: {
          en: 'Check the sign of v from 1/v = 1/f + 1/u where u = −10.',
          hi: '1/v = 1/18 − 1/10 से v का चिह्न देखें।',
        },
        answer: {
          en: 'Rays diverge after the lens, tracing backward to form a LARGE, UPRIGHT, VIRTUAL image on the same side—this is how a magnifying glass works!',
          hi: 'किरणें अपसारित होती हैं और पीछे बढ़ाने पर उसी ओर बड़ा, सीधा और आभासी प्रतिबिंब बनाती हैं—यही आवर्धक काँच (Magnifying Glass) का सिद्धांत है!',
        },
        targetParams: { f: 18, uAbs: 10, ho: 5 },
      },
      {
        id: 'lens-concave',
        question: {
          en: 'Switch to a Concave Lens (f = −16 cm). Can it ever produce an inverted real image?',
          hi: 'अवतल लेंस (f = −16 cm) चुनें। क्या यह कभी वास्तविक उल्टा प्रतिबिंब बना सकता है?',
        },
        hint: {
          en: 'Both 1/f and 1/u are negative, so 1/v is always negative!',
          hi: '1/f और 1/u दोनों ऋणात्मक हैं, अतः v हमेशा ऋणात्मक होगा!',
        },
        answer: {
          en: 'No! A diverging concave lens always produces an upright, diminished, virtual image between the lens and its focus.',
          hi: 'नहीं! अवतल लेंस हमेशा सीधा, छोटा और आभासी प्रतिबिंब बनाता है।',
        },
        targetParams: { f: -16, uAbs: 28, ho: 6 },
      },
    ],
    graphTitle: { en: 'Image Distance v vs Object Distance |u|', hi: 'प्रतिबिंब दूरी v बनाम वस्तु दूरी |u|' },
    graphXLabel: '|u| (cm)',
    graphYLabel: 'v (cm)',
  },
];

// Order all 66 built-in simulations cleanly to match CHAPTERS order (Class 11 Ch 01–15 → Class 12 Ch 16–30)
const ALL_RAW_SIMS: PhysicsSimulation[] = [
  ...CORE_SIMULATIONS,
  ...EXTRA_SIMULATIONS,
  ...REMAINING_SIMULATIONS_11,
  ...REMAINING_SIMULATIONS_12,
  ...FOUNDATION_SIMULATIONS,
  ...AIRFORCE_X_SIMULATIONS,
];
const chapterOrderMap = new Map(CHAPTERS.map((c, idx) => [c.id, idx]));
export const BUILTIN_SIMULATIONS: PhysicsSimulation[] = [...ALL_RAW_SIMS].sort(
  (a, b) => (chapterOrderMap.get(a.chapterId) ?? 999) - (chapterOrderMap.get(b.chapterId) ?? 999)
);

export function getDefaultParams(sim: PhysicsSimulation): Record<string, number> {
  const result: Record<string, number> = {};
  for (const v of sim.variables) {
    result[v.key] = v.defaultValue;
  }
  return result;
}

export function getSimulationsByChapter(
  chapterId: string,
  allSims: PhysicsSimulation[] = BUILTIN_SIMULATIONS
): PhysicsSimulation[] {
  return allSims.filter((s) => s.chapterId === chapterId);
}

const DEFAULT_SHORT_LABELS: Record<string, BilingualText> = {
  projectile: { en: 'Projectile Motion', hi: 'प्रक्षेप्य गति' },
  'newtons-force': { en: 'Newton’s Law & Friction', hi: 'न्यूटन नियम व घर्षण' },
  'angular-momentum': { en: 'Angular Momentum (L = Iω)', hi: 'कोणीय संवेग (L = Iω)' },
  gravitation: { en: 'Universal Gravitation', hi: 'सार्वत्रिक गुरुत्वाकर्षण' },
  fluids: { en: 'Bernoulli & Continuity', hi: 'बर्नौली व सांतत्य' },
  thermodynamics: { en: '1st Law & P–V Curves', hi: 'प्रथम नियम व P–V' },
  'shm-spring': { en: 'Spring–Mass SHM', hi: 'स्प्रिंग SHM' },
  'wave-superposition': { en: 'Wave Superposition', hi: 'तरंग अध्यारोपण' },
  'coulombs-law': { en: 'Coulomb’s Law', hi: 'कूलॉम नियम' },
  capacitance: { en: 'Parallel-Plate Capacitor', hi: 'समांतर प्लेट संधारित्र' },
  'ohms-law': { en: 'Ohm’s Law & Power', hi: 'ओम का नियम व शक्ति' },
  'lorentz-force': { en: 'Lorentz Force (Cyclotron)', hi: 'लॉरेंत्ज़ बल' },
  emi: { en: 'Faraday EMI & Generator', hi: 'फैराडे प्रेरण व जनरेटर' },
  'thin-lens': { en: 'Thin Lens Formula', hi: 'पतले लेंस का सूत्र' },
  'wave-optics': { en: 'Young’s Double Slit', hi: 'यंग द्वि-स्लिट (YDSE)' },
  'dual-nature': { en: 'Photoelectric Effect', hi: 'प्रकाश-विद्युत प्रभाव' },
  nuclei: { en: 'Radioactive Half-Life', hi: 'रेडियोधर्मी अर्ध-आयु' },
  semiconductors: { en: 'P–N Junction Diode', hi: 'P–N संधि डायोड' },
};

export function getSimShortTabLabel(sim: PhysicsSimulation): BilingualText {
  if (sim.shortTabLabel) return sim.shortTabLabel;
  if (DEFAULT_SHORT_LABELS[sim.id]) return DEFAULT_SHORT_LABELS[sim.id];
  return {
    en: sim.title.en.split('(')[0].trim().slice(0, 28),
    hi: sim.title.hi.split('(')[0].trim().slice(0, 28),
  };
}

export function getComparePresetB(sim: PhysicsSimulation): { label: BilingualText; params: Record<string, number> } {
  if (sim.comparePresetB) return sim.comparePresetB;
  if (sim.presets && sim.presets.length > 1) {
    return { label: sim.presets[1].label, params: { ...getDefaultParams(sim), ...sim.presets[1].params } };
  }
  const base = getDefaultParams(sim);
  const firstVar = sim.variables[0];
  if (firstVar) {
    const span = firstVar.max - firstVar.min;
    const shifted =
      firstVar.defaultValue + span * 0.35 <= firstVar.max
        ? firstVar.defaultValue + span * 0.35
        : Math.max(firstVar.min, firstVar.defaultValue - span * 0.35);
    const snapped = Math.round(shifted / firstVar.step) * firstVar.step;
    base[firstVar.key] = Number(snapped.toFixed(4));
  }
  return {
    label: { en: 'Variant B', hi: 'परिदृश्य B' },
    params: base,
  };
}
