import { AirforcePYQ } from '../types/physics';

/**
 * 64 Authentic Year-Tagged Indian Air Force X Group (Agniveer Vayu Science) PYQs
 * Covering Class 12 Chapters 16–30 (including Transistors, Potentiometer, Eye Defects & Communication Systems)
 */
export const AIRFORCE_PYQS_CLASS12: AirforcePYQ[] = [
  // CH 16: ELECTRIC CHARGES & FIELDS
  {
    id: 'afx-16-1',
    chapterId: 'electric-charges',
    simId: 'coulombs-law',
    yearTag: 'IAF 2024',
    questionType: 'Ratio Trick',
    question: {
      en: 'Two point charges exert force F in air. When immersed in a medium of dielectric constant K = 4 at the same separation, the new force is:',
      hi: 'वायु में दो आवेशों के बीच बल F है। समान दूरी पर K = 4 परावैद्युतांक के माध्यम में रखने पर नया बल होगा:',
    },
    options: [
      { en: '4F', hi: '4F' },
      { en: 'F / 4', hi: 'F / 4' },
      { en: 'F / 16', hi: 'F / 16' },
      { en: 'F', hi: 'F' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'F_medium = F_air / K ⇒ F / 4! Dielectric always reduces electrostatic force by factor K.',
      hi: 'F_माध्यम = F_वायु / K ⇒ F / 4।',
    },
    solution: {
      en: 'Since permittivity becomes K·ε₀, Coulomb force reduces to F′ = F / K = F / 4.',
      hi: 'माध्यम में वैद्युतशीलता Kε₀ होने से बल F/K = F/4 रह जाता है।',
    },
  },
  {
    id: 'afx-16-2',
    chapterId: 'electric-charges',
    simId: 'gauss-dipole',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'Electric field intensity E inside a charged hollow conducting sphere is always:',
      hi: 'आवेशित खोखले चालक गोले के भीतर विद्युत क्षेत्र की तीव्रता E सदैव होती है:',
    },
    options: [
      { en: 'Maximum at the center', hi: 'केंद्र पर अधिकतम' },
      { en: 'Zero everywhere inside', hi: 'भीतर सर्वत्र शून्य' },
      { en: 'Proportional to r', hi: 'r के समानुपाती' },
      { en: 'Inversely proportional to r²', hi: 'r² के व्युत्क्रमानुपाती' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Inside hollow conductor: E = 0, while Potential V = CONSTANT (same as surface)!',
      hi: 'खोखले चालक के भीतर E = 0, जबकि विभव V नियत रहता है!',
    },
    solution: {
      en: 'All charge resides on the outer surface; by Gauss’s Law q_enclosed = 0 so E_inside = 0.',
      hi: 'संपूर्ण आवेश बाहरी सतह पर रहता है, अतः गॉस नियम से भीतर E = 0।',
    },
  },
  {
    id: 'afx-16-3',
    chapterId: 'electric-charges',
    simId: 'gauss-dipole',
    yearTag: 'IAF 2022',
    questionType: 'Ratio Trick',
    question: {
      en: 'For a short electric dipole at equal large distance r, the ratio of Axial field (E_axial) to Equatorial field (E_eq) is:',
      hi: 'लघु विद्युत द्विध्रुव के लिए समान दूरी r पर अक्षीय क्षेत्र (E_axial) और निरक्षीय क्षेत्र (E_eq) का अनुपात है:',
    },
    options: [
      { en: '1 : 2', hi: '1 : 2' },
      { en: '2 : 1', hi: '2 : 1' },
      { en: '1 : 1', hi: '1 : 1' },
      { en: '4 : 1', hi: '4 : 1' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'E_axial = 2kp/r³, E_eq = kp/r³ ⇒ Ratio = 2 : 1 (Same 2 : 1 for Magnetic Dipole!).',
      hi: 'E_अक्षीय / E_निरक्षीय = 2 : 1 (चुंबकीय द्विध्रुव में भी 2 : 1!)।',
    },
    solution: {
      en: 'Axial electric field is twice the equatorial field at the same distance r from a short dipole.',
      hi: 'समान दूरी पर अक्षीय क्षेत्र निरक्षीय क्षेत्र का ठीक दोगुना (2 : 1) होता है।',
    },
  },
  {
    id: 'afx-16-4',
    chapterId: 'electric-charges',
    simId: 'coulombs-law',
    yearTag: 'IAF 2021',
    questionType: 'Direct Formula',
    question: {
      en: 'The SI unit of permittivity of free space (ε₀) is:',
      hi: 'निर्वात की वैद्युतशीलता (ε₀) का SI मात्रक है:',
    },
    options: [
      { en: 'N·m² / C²', hi: 'N·m² / C²' },
      { en: 'C² / (N·m²)', hi: 'C² / (N·m²)' },
      { en: 'N·C / m²', hi: 'N·C / m²' },
      { en: 'V·m / C', hi: 'V·m / C' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'ε₀ = q₁q₂ / (4πFr²) ⇒ C² / (N·m²) or F/m.',
      hi: 'ε₀ का मात्रक C²/(N·m²) या F/m है।',
    },
    solution: {
      en: 'Rearranging Coulomb’s Law gives ε₀ = q₁q₂ / (4πFr²), whose SI unit is C²·N⁻¹·m⁻² (also F/m).',
      hi: 'कूलॉम नियम से ε₀ = q₁q₂/(4πFr²) ⇒ मात्रक C²/(N·m²)।',
    },
  },

  // CH 17: CAPACITANCE & POTENTIAL
  {
    id: 'afx-17-1',
    chapterId: 'capacitance',
    simId: 'capacitance',
    yearTag: 'IAF 2024',
    questionType: 'Ratio Trick',
    question: {
      en: 'Three identical capacitors of 6 μF each are connected in SERIES. Their equivalent capacitance is:',
      hi: '6 μF के तीन समान संधारित्र श्रेणीक्रम (Series) में जुड़े हैं। तुल्य धारिता होगी:',
    },
    options: [
      { en: '18 μF', hi: '18 μF' },
      { en: '2 μF', hi: '2 μF' },
      { en: '3 μF', hi: '3 μF' },
      { en: '9 μF', hi: '9 μF' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Capacitors are OPPOSITE of Resistors: Series of n equal C ⇒ C/n = 6/3 = 2 μF; Parallel ⇒ nC = 18 μF.',
      hi: 'संधारित्र श्रेणीक्रम में C/n = 6/3 = 2 μF।',
    },
    solution: {
      en: '1/C_eq = 1/6 + 1/6 + 1/6 = 3/6 ⇒ C_eq = 2 μF.',
      hi: 'श्रेणीक्रम में C_eq = C/n = 6/3 = 2 μF।',
    },
  },
  {
    id: 'afx-17-2',
    chapterId: 'capacitance',
    simId: 'capacitance',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'Inserting a dielectric slab of constant K completely between the plates of a parallel-plate capacitor makes its capacitance:',
      hi: 'समांतर प्लेट संधारित्र की प्लेटों के बीच K परावैद्युतांक की पट्टी पूरी तरह भरने पर धारिता हो जाती है:',
    },
    options: [
      { en: 'K times larger', hi: 'K गुनी बढ़ जाती है' },
      { en: '1/K times smaller', hi: '1/K गुनी घट जाती है' },
      { en: 'Unchanged', hi: 'अपरिवर्तित' },
      { en: 'Zero', hi: 'शून्य' },
    ],
    correctIndex: 0,
    shortcut20s: {
      en: 'C = K·ε₀A/d ⇒ Dielectric ALWAYS multiplies capacitance by K! (Metal slab K = ∞ ⇒ C = ∞).',
      hi: 'C = K·ε₀A/d ⇒ परावैद्युत डालने से धारिता K गुनी हो जाती है!',
    },
    solution: {
      en: 'Dielectric polarization lowers internal field by K, reducing V for the same Q and raising C = K·C₀.',
      hi: 'परावैद्युत ध्रुवण से विभव घटता है और धारिता K·C₀ हो जाती है।',
    },
  },
  {
    id: 'afx-17-3',
    chapterId: 'capacitance',
    simId: 'electric-potential',
    yearTag: 'IAF 2022',
    questionType: 'Concept Trap',
    question: {
      en: 'Work done in moving a 5 C charge between two points on an EQUIPOTENTIAL surface is:',
      hi: 'समविभव पृष्ठ के दो बिंदुओं के बीच 5 C आवेश ले जाने में किया गया कार्य है:',
    },
    options: [
      { en: '5 J', hi: '5 J' },
      { en: '25 J', hi: '25 J' },
      { en: 'Zero (0 J)', hi: 'शून्य (0 J)' },
      { en: 'Depends on path length', hi: 'पथ की लंबाई पर निर्भर' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'W = q·ΔV. On equipotential surface ΔV = 0 ⇒ W = 0 J ALWAYS!',
      hi: 'समविभव पृष्ठ पर ΔV = 0 ⇒ कार्य W = 0!',
    },
    solution: {
      en: 'Since potential difference ΔV = 0 across any equipotential surface, W = q·ΔV = 0.',
      hi: 'ΔV = 0 होने के कारण समविभव पृष्ठ पर किया गया कार्य सदैव शून्य होता है।',
    },
  },
  {
    id: 'afx-17-4',
    chapterId: 'capacitance',
    simId: 'capacitance',
    yearTag: 'IAF 2020',
    questionType: 'Direct Formula',
    question: {
      en: 'Energy stored in a 10 μF capacitor charged to 100 V is:',
      hi: '100 V तक आवेशित 10 μF संधारित्र में संचित ऊर्जा है:',
    },
    options: [
      { en: '0.05 J', hi: '0.05 J' },
      { en: '0.50 J', hi: '0.50 J' },
      { en: '5.0 J', hi: '5.0 J' },
      { en: '50 J', hi: '50 J' },
    ],
    correctIndex: 0,
    shortcut20s: {
      en: 'U = ½CV² = ½ × 10×10⁻⁶ × 10⁴ = 5 × 10⁻² = 0.05 J!',
      hi: 'U = ½CV² = ½ × 10⁻⁵ × 10⁴ = 0.05 J।',
    },
    solution: {
      en: 'U = ½CV² = 0.5 × (10 × 10⁻⁶ F) × (100 V)² = 0.05 J.',
      hi: 'U = ½ × 10×10⁻⁶ × 10000 = 0.05 जूल।',
    },
  },

  // CH 18: CURRENT ELECTRICITY, POTENTIOMETER & CELLS
  {
    id: 'afx-18-1',
    chapterId: 'current-electricity',
    simId: 'ohms-law',
    yearTag: 'IAF 2024',
    questionType: 'Ratio Trick',
    question: {
      en: 'A metallic wire of resistance 10 Ω is STRETCHED to double its length (constant volume). Its new resistance is:',
      hi: '10 Ω प्रतिरोध के तार को खींचकर उसकी लंबाई दोगुनी कर दी जाती है। उसका नया प्रतिरोध होगा:',
    },
    options: [
      { en: '20 Ω', hi: '20 Ω' },
      { en: '40 Ω', hi: '40 Ω' },
      { en: '5 Ω', hi: '5 Ω' },
      { en: '10 Ω', hi: '10 Ω' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Stretching wire n times ⇒ R′ = n²·R = 2² × 10 = 40 Ω! (Resistivity ρ stays unchanged!).',
      hi: 'तार n गुना खींचने पर R′ = n²R = 4 × 10 = 40 Ω!',
    },
    solution: {
      en: 'Stretching L → 2L halves area A → A/2 at constant volume, so R′ = ρ(2L)/(A/2) = 4R = 40 Ω.',
      hi: 'आयतन नियत रहने से क्षेत्रफल आधा हो जाता है, अतः R′ = n²R = 40 Ω।',
    },
  },
  {
    id: 'afx-18-2',
    chapterId: 'current-electricity',
    simId: 'potentiometer-cells',
    yearTag: 'IAF 2024',
    questionType: 'Concept Trap',
    question: {
      en: 'A potentiometer measures cell EMF more accurately than a moving-coil voltmeter because at the null point it:',
      hi: 'विभवमापी, वोल्टमीटर की तुलना में सेल का EMF अधिक यथार्थ मापता है क्योंकि शून्य-विक्षेप पर यह:',
    },
    options: [
      { en: 'Draws maximum current from the cell', hi: 'सेल से अधिकतम धारा लेता है' },
      { en: 'Draws ZERO current from the cell (infinite effective resistance)', hi: 'सेल से शून्य धारा लेता है (अनंत प्रभावी प्रतिरोध)' },
      { en: 'Has zero resistance', hi: 'शून्य प्रतिरोध रखता है' },
      { en: 'Uses AC power', hi: 'AC शक्ति पर चलता है' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Potentiometer = Ideal Voltmeter (draws I = 0 at balance ⇒ measures true EMF E, not V = E − Ir!).',
      hi: 'विभवमापी संतुलन पर शून्य धारा लेता है = आदर्श वोल्टमीटर!',
    },
    solution: {
      en: 'Since zero current flows through the test cell at null deflection, there is no I·r internal voltage drop.',
      hi: 'शून्य धारा के कारण आंतरिक विभव पतन Ir = 0 होता है, जिससे वास्तविक EMF प्राप्त होता है।',
    },
  },
  {
    id: 'afx-18-3',
    chapterId: 'current-electricity',
    simId: 'potentiometer-cells',
    yearTag: 'IAF 2023',
    questionType: 'Direct Formula',
    question: {
      en: 'Kirchhoff’s First Law (Junction Rule, ΣI = 0) and Second Law (Loop Rule, ΣV = 0) represent conservation of:',
      hi: 'किरचॉफ़ का प्रथम नियम (संधि नियम) और द्वितीय नियम (लूप नियम) क्रमशः किसके संरक्षण पर आधारित हैं?',
    },
    options: [
      { en: 'Energy and Charge', hi: 'ऊर्जा और आवेश' },
      { en: 'Charge and Energy', hi: 'आवेश और ऊर्जा' },
      { en: 'Momentum and Charge', hi: 'संवेग और आवेश' },
      { en: 'Current and Resistance', hi: 'धारा और प्रतिरोध' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'KCL (1st) = CHARGE; KVL (2nd) = ENERGY! (Alphabetical: C before E!).',
      hi: 'प्रथम नियम = आवेश संरक्षण; द्वितीय नियम = ऊर्जा संरक्षण।',
    },
    solution: {
      en: 'Junction law conserves electric charge; Loop voltage law conserves electrostatic energy.',
      hi: 'संधि नियम आवेश संरक्षण तथा पाश नियम ऊर्जा संरक्षण व्यक्त करता है।',
    },
  },
  {
    id: 'afx-18-4',
    chapterId: 'current-electricity',
    simId: 'charge-current-power',
    yearTag: 'IAF 2022',
    questionType: 'Ratio Trick',
    question: {
      en: 'Two bulbs rated 220 V–60 W and 220 V–100 W are connected in SERIES to 220 V. Which glows BRIGHTER?',
      hi: '220 V–60 W और 220 V–100 W के दो बल्ब 220 V से श्रेणीक्रम में जोड़े गए हैं। कौन अधिक चमकेगा?',
    },
    options: [
      { en: '100 W bulb', hi: '100 W का बल्ब' },
      { en: '60 W bulb (higher resistance R = V²/P)', hi: '60 W का बल्ब (अधिक प्रतिरोध)' },
      { en: 'Both glow equally', hi: 'दोनों समान चमकेंगे' },
      { en: 'Neither glows', hi: 'कोई नहीं जलेगा' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'SERIES ⇒ Lower Wattage glows BRIGHTER (60 W has larger R)! PARALLEL ⇒ Higher Wattage glows brighter!',
      hi: 'श्रेणीक्रम में कम वाट वाला (60 W) अधिक चमकेगा; समांतर क्रम में अधिक वाट वाला!',
    },
    solution: {
      en: 'Resistance R = V²/P_rated, so 60 W has larger resistance. In series (same I), heat I²R is larger in the 60 W bulb.',
      hi: '60 W बल्ब का प्रतिरोध अधिक है; श्रेणीक्रम में समान धारा पर P = I²R अधिक होने से 60 W अधिक चमकेगा।',
    },
  },

  // CH 19: MOVING CHARGES & MAGNETISM
  {
    id: 'afx-19-1',
    chapterId: 'moving-charges',
    simId: 'lorentz-force',
    yearTag: 'IAF 2024',
    questionType: 'Concept Trap',
    question: {
      en: 'Work done by a magnetic Lorentz force F⃗ = q(v⃗ × B⃗) on a moving charged particle is ALWAYS:',
      hi: 'गतिमान आवेशित कण पर चुंबकीय बल F⃗ = q(v⃗ × B⃗) द्वारा किया गया कार्य सदैव होता है:',
    },
    options: [
      { en: 'q·v·B', hi: 'q·v·B' },
      { en: '½mv²', hi: '½mv²' },
      { en: 'Zero', hi: 'शून्य' },
      { en: 'Depends on radius', hi: 'त्रिज्या पर निर्भर' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Magnetic force ⊥ velocity ALWAYS ⇒ Work = 0 ⇒ Speed & KE NEVER change!',
      hi: 'चुंबकीय बल सदैव वेग के लंबवत ⇒ कार्य = 0, चाल व गतिज ऊर्जा नियत!',
    },
    solution: {
      en: 'Since F⃗ = q(v⃗ × B⃗) is perpendicular to displacement v⃗ dt, instantaneous power F⃗·v⃗ = 0 and W = 0.',
      hi: 'F⃗ ⊥ v⃗ होने से F⃗·v⃗ = 0 तथा कार्य सदैव शून्य होता है।',
    },
  },
  {
    id: 'afx-19-2',
    chapterId: 'moving-charges',
    simId: 'solenoid-wires',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'Two long parallel wires carrying steady currents in the SAME direction:',
      hi: 'समान दिशा में धारा ले जाने वाले दो लंबे समांतर तार आपस में:',
    },
    options: [
      { en: 'Repel each other', hi: 'एक-दूसरे को प्रतिकर्षित करते हैं' },
      { en: 'Attract each other', hi: 'एक-दूसरे को आकर्षित करते हैं' },
      { en: 'Exert no force', hi: 'कोई बल नहीं लगाते' },
      { en: 'Rotate perpendicularly', hi: 'लंबवत घूम जाते हैं' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Parallel Currents: SAME direction → ATTRACT; OPPOSITE direction → REPEL!',
      hi: 'समान दिशा धाराएँ → आकर्षण; विपरीत दिशा धाराएँ → प्रतिकर्षण!',
    },
    solution: {
      en: 'By right-hand rule and F = IL×B, parallel currents in the same direction attract with F/L = μ₀I₁I₂/(2πd).',
      hi: 'दाएँ हाथ के नियम से समान दिशा की समांतर धाराएँ परस्पर आकर्षित होती हैं।',
    },
  },
  {
    id: 'afx-19-3',
    chapterId: 'moving-charges',
    simId: 'lorentz-force',
    yearTag: 'IAF 2022',
    questionType: 'Concept Trap',
    question: {
      en: 'To convert a moving-coil galvanometer into an AMMETER, we connect a:',
      hi: 'धारामापी (Galvanometer) को अमीटर (Ammeter) में बदलने के लिए जोड़ा जाता है:',
    },
    options: [
      { en: 'High resistance in series', hi: 'श्रेणीक्रम में उच्च प्रतिरोध' },
      { en: 'Low resistance (Shunt) in parallel', hi: 'समांतर क्रम में अल्प प्रतिरोध (शंट)' },
      { en: 'High resistance in parallel', hi: 'समांतर क्रम में उच्च प्रतिरोध' },
      { en: 'Low resistance in series', hi: 'श्रेणीक्रम में अल्प प्रतिरोध' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Ammeter = Low R in PARALLEL (Ideal R = 0); Voltmeter = High R in SERIES (Ideal R = ∞)!',
      hi: 'अमीटर: समांतर में अल्प प्रतिरोध; वोल्टमीटर: श्रेणीक्रम में उच्च प्रतिरोध!',
    },
    solution: {
      en: 'A small parallel shunt bypasses heavy current so total ammeter resistance stays nearly zero.',
      hi: 'समांतर में अल्प शंट जोड़ने से अधिकांश धारा बाईपास हो जाती है और अमीटर बनता है।',
    },
  },
  {
    id: 'afx-19-4',
    chapterId: 'moving-charges',
    simId: 'lorentz-force',
    yearTag: 'IAF 2021',
    questionType: 'Direct Formula',
    question: {
      en: 'The time period T of a charged particle moving perpendicular to a uniform magnetic field B is:',
      hi: 'एकसमान चुंबकीय क्षेत्र B के लंबवत घूमते आवेशित कण का आवर्तकाल T होता है:',
    },
    options: [
      { en: '2πm / (qB) — independent of speed v', hi: '2πm / (qB) — चाल v से स्वतंत्र' },
      { en: '2πmv / (qB)', hi: '2πmv / (qB)' },
      { en: 'qB / (2πm)', hi: 'qB / (2πm)' },
      { en: 'mv / (qB)', hi: 'mv / (qB)' },
    ],
    correctIndex: 0,
    shortcut20s: {
      en: 'T = 2πm/(qB) is COMPLETELY INDEPENDENT of speed v and radius r!',
      hi: 'T = 2πm/(qB) — यह चाल v और त्रिज्या r से पूरी तरह स्वतंत्र है!',
    },
    solution: {
      en: 'Faster particles trace larger circles r = mv/(qB), so T = 2πr/v = 2πm/(qB) stays strictly constant.',
      hi: 'v कट जाने के कारण आवर्तकाल T = 2πm/(qB) वेग पर निर्भर नहीं करता।',
    },
  },

  // CH 20: MAGNETISM & MATTER
  {
    id: 'afx-20-1',
    chapterId: 'magnetism-matter',
    simId: 'magnetism-matter',
    yearTag: 'IAF 2024',
    questionType: 'Direct Formula',
    question: {
      en: 'The angle of dip (inclination δ) at Earth’s magnetic POLES and magnetic EQUATOR are respectively:',
      hi: 'पृथ्वी के चुंबकीय ध्रुवों और चुंबकीय विषुवत रेखा पर नमन कोण क्रमशः होते हैं:',
    },
    options: [
      { en: '0° and 90°', hi: '0° और 90°' },
      { en: '90° and 0°', hi: '90° और 0°' },
      { en: '45° and 0°', hi: '45° और 0°' },
      { en: '90° and 45°', hi: '90° और 45°' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Poles → Vertical needle (90°); Equator → Horizontal needle (0°)!',
      hi: 'ध्रुवों पर नमन कोण = 90°; विषुवत रेखा पर = 0°!',
    },
    solution: {
      en: 'Magnetic field lines enter vertically at poles (δ = 90°) and run horizontally at the magnetic equator (δ = 0°).',
      hi: 'ध्रुवों पर चुंबकीय क्षेत्र ऊर्ध्वाधर (90°) और विषुवत रेखा पर क्षैतिज (0°) होता है।',
    },
  },
  {
    id: 'afx-20-2',
    chapterId: 'magnetism-matter',
    simId: 'magnetism-matter',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'Above the Curie Temperature, a ferromagnetic substance (like Iron) turns into a:',
      hi: 'क्यूरी ताप (Curie Temperature) से ऊपर लौह-चुंबकीय पदार्थ किसमें बदल जाता है?',
    },
    options: [
      { en: 'Diamagnetic substance', hi: 'प्रतिचुंबकीय पदार्थ' },
      { en: 'Paramagnetic substance', hi: 'अनुचुंबकीय (Paramagnetic) पदार्थ' },
      { en: 'Superconductor', hi: 'अतिचालक' },
      { en: 'Permanent magnet', hi: 'स्थायी चुंबक' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Above Curie Temp T_c: Ferro → Para! (Thermal agitation breaks magnetic domains).',
      hi: 'क्यूरी ताप के ऊपर: लौह-चुंबकीय → अनुचुंबकीय!',
    },
    solution: {
      en: 'Heating beyond Curie temperature destroys aligned ferromagnetic domains, leaving paramagnetic behavior.',
      hi: 'क्यूरी ताप से ऊपर चुंबकीय डोमेन टूट जाते हैं और पदार्थ अनुचुंबकीय बन जाता है।',
    },
  },
  {
    id: 'afx-20-3',
    chapterId: 'magnetism-matter',
    simId: 'magnetism-matter',
    yearTag: 'IAF 2022',
    questionType: 'Concept Trap',
    question: {
      en: 'Magnetic susceptibility χ of a DIAMAGNETIC material is:',
      hi: 'प्रतिचुंबकीय (Diamagnetic) पदार्थ की चुंबकीय प्रवृत्ति χ होती है:',
    },
    options: [
      { en: 'Small and negative, independent of temperature', hi: 'अल्प व ऋणात्मक, ताप से स्वतंत्र' },
      { en: 'Small and positive', hi: 'अल्प व धनात्मक' },
      { en: 'Very large and positive', hi: 'बहुत बड़ी व धनात्मक' },
      { en: 'Inversely proportional to T', hi: 'ताप T के व्युत्क्रमानुपाती' },
    ],
    correctIndex: 0,
    shortcut20s: {
      en: 'Dia: χ small NEGATIVE (independent of T); Para: small positive (χ ∝ 1/T); Ferro: huge positive.',
      hi: 'प्रतिचुंबकीय: χ अल्प ऋणात्मक तथा ताप से स्वतंत्र!',
    },
    solution: {
      en: 'Diamagnetic substances (Bi, Cu, Water) weakly oppose external fields (χ < 0) regardless of temperature.',
      hi: 'प्रतिचुंबकीय पदार्थ क्षेत्र का विरोध करते हैं, अतः χ ऋणात्मक व ताप-स्वतंत्र होती है।',
    },
  },
  {
    id: 'afx-20-4',
    chapterId: 'magnetism-matter',
    simId: 'magnetism-matter',
    yearTag: 'IAF 2021',
    questionType: 'Direct Formula',
    question: {
      en: 'At a place where horizontal (B_H) and vertical (B_V) components of Earth’s magnetic field are equal, the angle of dip is:',
      hi: 'जिस स्थान पर पृथ्वी के चुंबकीय क्षेत्र के क्षैतिज व ऊर्ध्वाधर घटक बराबर हों, वहाँ नमन कोण है:',
    },
    options: [
      { en: '30°', hi: '30°' },
      { en: '45°', hi: '45°' },
      { en: '60°', hi: '60°' },
      { en: '90°', hi: '90°' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'tan δ = B_V / B_H = 1 ⇒ δ = 45°!',
      hi: 'tan δ = B_V / B_H = 1 ⇒ δ = 45°!',
    },
    solution: {
      en: 'Using tan δ = B_V / B_H, when B_V = B_H we get tan δ = 1, so δ = 45°.',
      hi: 'B_V = B_H होने पर tan δ = 1 ⇒ नमन कोण δ = 45°।',
    },
  },

  // CH 21: ELECTROMAGNETIC INDUCTION & TRANSFORMER
  {
    id: 'afx-21-1',
    chapterId: 'emi',
    simId: 'emi',
    yearTag: 'IAF 2024',
    questionType: 'Concept Trap',
    question: {
      en: 'Lenz’s Law is a direct consequence of the law of conservation of:',
      hi: 'लेंज़ का नियम (Lenz’s Law) सीधे किसके संरक्षण नियम का पालन करता है?',
    },
    options: [
      { en: 'Charge', hi: 'आवेश' },
      { en: 'Momentum', hi: 'संवेग' },
      { en: 'Energy', hi: 'ऊर्जा' },
      { en: 'Mass', hi: 'द्रव्यमान' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Lenz’s Law = CONSERVATION OF ENERGY!',
      hi: 'लेंज़ का नियम = ऊर्जा संरक्षण नियम!',
    },
    solution: {
      en: 'Induced current opposes the magnetic flux change so mechanical work must be done to generate electrical energy.',
      hi: 'प्रेरित धारा कारण का विरोध करती है; इसी विरोध के विरुद्ध यांत्रिक कार्य विद्युत ऊर्जा बनता है।',
    },
  },
  {
    id: 'afx-21-2',
    chapterId: 'emi',
    simId: 'transformer',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'A transformer core is made of laminated soft iron sheets mainly to minimize:',
      hi: 'ट्रांसफ़ॉर्मर का क्रोड पटलित (Laminated) नर्म लोहे का क्यों बनाया जाता है?',
    },
    options: [
      { en: 'Copper loss', hi: 'ताम्र हानि कम करने हेतु' },
      { en: 'Eddy current loss', hi: 'भँवर धारा (Eddy Current) हानि कम करने हेतु' },
      { en: 'Flux leakage', hi: 'फ्लक्स क्षरण हेतु' },
      { en: 'Weight of transformer', hi: 'भार कम करने हेतु' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Lamination cuts EDDY CURRENTS; Soft iron cuts HYSTERESIS loss; Thick wire cuts copper loss!',
      hi: 'पटलित क्रोड → भँवर धारा हानि कम; नर्म लोहा → शैथिल्य हानि कम!',
    },
    solution: {
      en: 'Insulated thin laminations break up circulating eddy current loops, sharply reducing core heating.',
      hi: 'पटलित पत्तियाँ भँवर धाराओं का पथ तोड़कर ऊष्मा हानि को न्यूनतम करती हैं।',
    },
  },
  {
    id: 'afx-21-3',
    chapterId: 'emi',
    simId: 'transformer',
    yearTag: 'IAF 2022',
    questionType: 'Concept Trap',
    question: {
      en: 'Which quantity does NOT change between primary and secondary coils of an ideal transformer?',
      hi: 'आदर्श ट्रांसफ़ॉर्मर की प्राथमिक व द्वितीयक कुंडली में कौन-सी राशि नहीं बदलती?',
    },
    options: [
      { en: 'Voltage', hi: 'वोल्टेज' },
      { en: 'Current', hi: 'धारा' },
      { en: 'Frequency (and Power in ideal case)', hi: 'आवृत्ति (तथा आदर्श स्थिति में शक्ति)' },
      { en: 'Number of turns', hi: 'फेरों की संख्या' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Transformer works ONLY on AC; changes V & I inversely, NEVER changes Frequency f!',
      hi: 'ट्रांसफ़ॉर्मर केवल AC पर कार्य करता है और आवृत्ति f कभी नहीं बदलता!',
    },
    solution: {
      en: 'Mutual induction transfers the exact AC frequency f from primary to secondary; only V and I are stepped up/down.',
      hi: 'अन्योन्य प्रेरण में AC की आवृत्ति अपरिवर्तित रहती है।',
    },
  },
  {
    id: 'afx-21-4',
    chapterId: 'emi',
    simId: 'emi',
    yearTag: 'IAF 2021',
    questionType: 'Direct Formula',
    question: {
      en: 'The SI unit of Magnetic Flux (Φ) and Self-Inductance (L) are respectively:',
      hi: 'चुंबकीय फ्लक्स (Φ) और स्वप्रेरकत्व (L) के SI मात्रक क्रमशः हैं:',
    },
    options: [
      { en: 'Tesla and Henry', hi: 'टेस्ला और हेनरी' },
      { en: 'Weber and Henry', hi: 'वेबर और हेनरी' },
      { en: 'Weber and Farad', hi: 'वेबर और फैरड' },
      { en: 'Henry and Weber', hi: 'हेनरी और वेबर' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Field B → Tesla; Flux Φ → Weber (Wb); Inductance L → Henry (H)!',
      hi: 'क्षेत्र B → टेस्ला; फ्लक्स Φ → वेबर; प्रेरकत्व L → हेनरी।',
    },
    solution: {
      en: 'Magnetic flux Φ = B·A is measured in Weber (Wb), and self-inductance L = Φ/I is measured in Henry (H).',
      hi: 'फ्लक्स का मात्रक वेबर (Wb) और प्रेरकत्व का हेनरी (H) है।',
    },
  },

  // CH 22: ALTERNATING CURRENT
  {
    id: 'afx-22-1',
    chapterId: 'ac-circuits',
    simId: 'ac-circuits',
    yearTag: 'IAF 2024',
    questionType: 'Direct Formula',
    question: {
      en: 'At resonance in a series LCR AC circuit, the phase difference between voltage and current and the power factor cos φ are:',
      hi: 'श्रेणी LCR AC परिपथ में अनुनाद की स्थिति में कलांतर φ और शक्ति गुणांक cos φ होते हैं:',
    },
    options: [
      { en: '90° and 0', hi: '90° और 0' },
      { en: '0° and 1 (maximum)', hi: '0° और 1 (अधिकतम)' },
      { en: '45° and 0.707', hi: '45° और 0.707' },
      { en: '180° and −1', hi: '180° और −1' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'At Resonance: X_L = X_C ⇒ Z = R (min) ⇒ I = max ⇒ φ = 0° ⇒ cos φ = 1!',
      hi: 'अनुनाद पर X_L = X_C, Z = R (न्यूनतम), φ = 0° तथा cos φ = 1!',
    },
    solution: {
      en: 'Inductive and capacitive reactances cancel (X_L = X_C), making the circuit purely resistive (φ = 0°, cos φ = 1).',
      hi: 'X_L = X_C कट जाने से परिपथ शुद्ध प्रतिरोधी हो जाता है, अतः φ = 0° और cos φ = 1।',
    },
  },
  {
    id: 'afx-22-2',
    chapterId: 'ac-circuits',
    simId: 'ac-circuits',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'Average power consumed over a complete AC cycle in a PURELY inductive or PURELY capacitive circuit (wattless current) is:',
      hi: 'शुद्ध प्रेरक या शुद्ध संधारित्र AC परिपथ में एक पूर्ण चक्र में औसत व्यय शक्ति (वाटहीन धारा) होती है:',
    },
    options: [
      { en: 'V_rms · I_rms', hi: 'V_rms · I_rms' },
      { en: '½ V_0 · I_0', hi: '½ V_0 · I_0' },
      { en: 'Zero', hi: 'शून्य' },
      { en: 'Infinite', hi: 'अनंत' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Pure L or C ⇒ Phase φ = 90° ⇒ cos 90° = 0 ⇒ P_avg = 0 (Wattless!).',
      hi: 'शुद्ध L या C में φ = 90° ⇒ cos 90° = 0 ⇒ औसत शक्ति शून्य!',
    },
    solution: {
      en: 'Because current and voltage are 90° out of phase, cos φ = 0 and average power dissipation is strictly zero.',
      hi: 'कलांतर 90° होने से P = V_rms I_rms cos 90° = 0।',
    },
  },
  {
    id: 'afx-22-3',
    chapterId: 'ac-circuits',
    simId: 'ac-circuits',
    yearTag: 'IAF 2022',
    questionType: 'Direct Formula',
    question: {
      en: 'If domestic Indian AC supply is 220 V (rms), its peak voltage V₀ is approximately:',
      hi: 'भारत में घरेलू AC सप्लाई 220 V (rms) है। इसका शिखर वोल्टेज V₀ लगभग कितना है?',
    },
    options: [
      { en: '220 V', hi: '220 V' },
      { en: '311 V', hi: '311 V' },
      { en: '440 V', hi: '440 V' },
      { en: '155 V', hi: '155 V' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'V₀ = √2 · V_rms = 1.414 × 220 ≈ 311 V!',
      hi: 'V₀ = √2 × 220 ≈ 311 V!',
    },
    solution: {
      en: 'Peak voltage V₀ = √2 × V_rms = 1.414 × 220 V ≈ 311.1 V.',
      hi: 'शिखर मान V₀ = √2 × V_rms = 1.414 × 220 ≈ 311 V।',
    },
  },
  {
    id: 'afx-22-4',
    chapterId: 'ac-circuits',
    simId: 'ac-circuits',
    yearTag: 'IAF 2021',
    questionType: 'Concept Trap',
    question: {
      en: 'A capacitor BLOCKS DC (f = 0) and passes high-frequency AC because its capacitive reactance X_C is:',
      hi: 'संधारित्र DC (f = 0) को रोकता है और उच्च आवृत्ति AC को गुजरने देता है क्योंकि इसका प्रतिघात X_C:',
    },
    options: [
      { en: 'X_C = 2πfC', hi: 'X_C = 2πfC' },
      { en: 'X_C = 1 / (2πfC) → ∞ for DC', hi: 'X_C = 1 / (2πfC) → DC के लिए ∞' },
      { en: 'Zero for DC', hi: 'DC के लिए शून्य' },
      { en: 'Independent of frequency', hi: 'आवृत्ति से स्वतंत्र' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'DC (f = 0): X_L = 0 (Inductor passes DC), X_C = ∞ (Capacitor blocks DC)!',
      hi: 'DC (f=0) पर: X_C = ∞ (रोकता है), X_L = 0 (गुजरने देता है)।',
    },
    solution: {
      en: 'X_C = 1/(2πfC). Putting f = 0 for steady DC gives infinite reactance.',
      hi: 'f = 0 रखने पर X_C = 1/(2πfC) = ∞ हो जाता है।',
    },
  },

  // CH 23: ELECTROMAGNETIC WAVES
  {
    id: 'afx-23-1',
    chapterId: 'em-waves',
    simId: 'em-waves',
    yearTag: 'IAF 2024',
    questionType: 'Direct Formula',
    question: {
      en: 'The speed of electromagnetic waves in vacuum in terms of μ₀ and ε₀ is:',
      hi: 'निर्वात में विद्युत-चुंबकीय तरंगों की चाल c का μ₀ व ε₀ के पदों में सूत्र है:',
    },
    options: [
      { en: '√(μ₀ ε₀)', hi: '√(μ₀ ε₀)' },
      { en: '1 / √(μ₀ ε₀)', hi: '1 / √(μ₀ ε₀)' },
      { en: 'μ₀ / ε₀', hi: 'μ₀ / ε₀' },
      { en: '1 / (μ₀ ε₀)', hi: '1 / (μ₀ ε₀)' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'c = 1/√(μ₀ε₀) = E₀/B₀ = 3×10⁸ m/s!',
      hi: 'c = 1/√(μ₀ε₀) = E₀/B₀ = 3×10⁸ m/s!',
    },
    solution: {
      en: 'Maxwell’s equations yield vacuum EM wave speed c = 1/√(μ₀ε₀) ≈ 3×10⁸ m/s.',
      hi: 'मैक्सवेल समीकरण से c = 1/√(μ₀ε₀) प्राप्त होता है।',
    },
  },
  {
    id: 'afx-23-2',
    chapterId: 'em-waves',
    simId: 'em-waves',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'Which of the following electromagnetic waves has the HIGHEST frequency (and shortest wavelength)?',
      hi: 'निम्नलिखित में से किस विद्युत-चुंबकीय तरंग की आवृत्ति सर्वाधिक (व तरंगदैर्घ्य न्यूनतम) है?',
    },
    options: [
      { en: 'X-rays', hi: 'X-किरणें' },
      { en: 'Ultraviolet rays', hi: 'पराबैंगनी किरणें' },
      { en: 'Gamma rays (γ-rays)', hi: 'गामा किरणें (γ-rays)' },
      { en: 'Microwaves', hi: 'सूक्ष्म तरंगें' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Order (Low → High freq): R-M-I-V-U-X-G! Gamma rays have MAX frequency & MIN wavelength.',
      hi: 'क्रम: Radio → Micro → IR → Visible → UV → X → Gamma!',
    },
    solution: {
      en: 'Gamma rays lie at the highest-frequency, highest-energy end of the electromagnetic spectrum.',
      hi: 'गामा किरणों की आवृत्ति व भेदन क्षमता सर्वाधिक होती है।',
    },
  },
  {
    id: 'afx-23-3',
    chapterId: 'em-waves',
    simId: 'em-waves',
    yearTag: 'IAF 2022',
    questionType: 'Concept Trap',
    question: {
      en: 'In an electromagnetic wave propagating along the +Z axis, E⃗ and B⃗ vectors are:',
      hi: '+Z अक्ष के अनुदिश संचरित विद्युत-चुंबकीय तरंग में E⃗ और B⃗ सदिश होते हैं:',
    },
    options: [
      { en: 'Parallel to each other and in phase', hi: 'परस्पर समांतर व समान कला में' },
      { en: 'Mutually perpendicular (E⃗ × B⃗ along +Z) and in the SAME phase', hi: 'परस्पर लंबवत (E⃗ × B⃗ दिशा +Z) और समान कला में' },
      { en: 'Mutually perpendicular with 90° phase difference', hi: 'लंबवत और 90° कलांतर में' },
      { en: 'Along the Z axis', hi: 'Z अक्ष के अनुदिश' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Direction = E⃗ × B⃗; E ⊥ B ⊥ c; Phase difference between E and B is ZERO (in phase!).',
      hi: 'E⃗ ⊥ B⃗ ⊥ संचरण दिशा (E⃗×B⃗), तथा E व B समान कला में होते हैं!',
    },
    solution: {
      en: 'EM waves are transverse with E ⊥ B, direction given by E⃗ × B⃗, and both fields reaching peaks simultaneously.',
      hi: 'E व B परस्पर लंबवत होते हैं तथा एक साथ अधिकतम व शून्य होते हैं।',
    },
  },
  {
    id: 'afx-23-4',
    chapterId: 'em-waves',
    simId: 'em-waves',
    yearTag: 'IAF 2020',
    questionType: 'Concept Trap',
    question: {
      en: 'Which radiation is primarily responsible for the greenhouse heating effect and night-vision thermal cameras?',
      hi: 'ग्रीनहाउस ऊष्मन प्रभाव और नाइट-विज़न थर्मल कैमरे में मुख्यतः किस विकिरण का उपयोग होता है?',
    },
    options: [
      { en: 'Infrared (IR) waves', hi: 'अवरक्त (Infrared) तरंगें' },
      { en: 'Ultraviolet waves', hi: 'पराबैंगनी तरंगें' },
      { en: 'Radio waves', hi: 'रेडियो तरंगें' },
      { en: 'X-rays', hi: 'X-किरणें' },
    ],
    correctIndex: 0,
    shortcut20s: {
      en: 'IR = Heat waves (Greenhouse, TV remotes); UV = Ozone absorbed; Micro = RADAR!',
      hi: 'IR = ऊष्मा तरंगें; सूक्ष्म तरंगें = रडार (RADAR)।',
    },
    solution: {
      en: 'Infrared radiation excites molecular vibrations producing heat, making it ideal for thermal imaging and greenhouse trapping.',
      hi: 'अवरक्त किरणें ऊष्मीय प्रभाव उत्पन्न करती हैं।',
    },
  },

  // CH 24: RAY OPTICS & HUMAN EYE DEFECTS
  {
    id: 'afx-24-1',
    chapterId: 'ray-optics',
    simId: 'eye-defects',
    yearTag: 'IAF 2024',
    questionType: 'Direct Formula',
    question: {
      en: 'A person with Myopia (short-sightedness) cannot see objects clearly beyond 50 cm. The power of the corrective lens needed is:',
      hi: 'निकट-दृष्टि दोष से पीड़ित व्यक्ति 50 cm से दूर स्पष्ट नहीं देख सकता। संशोधक लेंस की क्षमता है:',
    },
    options: [
      { en: '+2.0 D (Convex)', hi: '+2.0 D (उत्तल)' },
      { en: '−2.0 D (Concave)', hi: '−2.0 D (अवतल)' },
      { en: '−0.5 D (Concave)', hi: '−0.5 D (अवतल)' },
      { en: '+0.5 D (Convex)', hi: '+0.5 D (उत्तल)' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Myopia → Concave (−) ⇒ P = −100 / d_far(cm) = −100 / 50 = −2.0 D!',
      hi: 'निकट-दृष्टि (अवतल): P = −100/50 = −2.0 D!',
    },
    solution: {
      en: 'To form virtual image of ∞ at 50 cm, f = −50 cm = −0.5 m, so P = 1/f = −2.0 D (Concave lens).',
      hi: 'f = −50 cm ⇒ क्षमता P = −100/50 = −2.0 D (अवतल लेंस)।',
    },
  },
  {
    id: 'afx-24-2',
    chapterId: 'ray-optics',
    simId: 'snell-prism-tir',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'Optical fibers used in high-speed telecommunications work on the principle of:',
      hi: 'उच्च गति दूरसंचार में प्रयुक्त प्रकाशिक तंतु (Optical Fiber) किस सिद्धांत पर कार्य करते हैं?',
    },
    options: [
      { en: 'Diffraction', hi: 'विवर्तन' },
      { en: 'Total Internal Reflection (TIR)', hi: 'पूर्ण आंतरिक परावर्तन (TIR)' },
      { en: 'Polarization', hi: 'ध्रुवण' },
      { en: 'Scattering', hi: 'प्रकीर्णन' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'TIR Applications: Optical fiber, Brilliance of diamond, Mirage!',
      hi: 'TIR के उदाहरण: प्रकाशिक तंतु, हीरे की चमक, मरीचिका!',
    },
    solution: {
      en: 'Light enters the high-index core and reflects repeatedly without loss via Total Internal Reflection.',
      hi: 'सघन क्रोड से विरल आवरण की सीमा पर पूर्ण आंतरिक परावर्तन द्वारा प्रकाश बिना हानि आगे बढ़ता है।',
    },
  },
  {
    id: 'afx-24-3',
    chapterId: 'ray-optics',
    simId: 'thin-lens',
    yearTag: 'IAF 2022',
    questionType: 'Concept Trap',
    question: {
      en: 'An air bubble trapped inside water behaves like a:',
      hi: 'पानी के भीतर फँसा वायु का बुलबुला किसकी भाँति व्यवहार करता है?',
    },
    options: [
      { en: 'Converging (Convex) lens', hi: 'अभिसारी (उत्तल) लेंस' },
      { en: 'Diverging (Concave) lens', hi: 'अपसारी (अवतल) लेंस' },
      { en: 'Plane mirror', hi: 'समतल दर्पण' },
      { en: 'Glass prism', hi: 'काँच का प्रिज्म' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Bubble has LOWER index (n_air = 1) than water (1.33) ⇒ flips sign ⇒ DIVERGING (Concave)!',
      hi: 'वायु का अपवर्तनांक पानी से कम है, अतः बुलबुला अपसारी (अवतल) लेंस की तरह कार्य करता है!',
    },
    solution: {
      en: 'Since n_lens < n_medium (1.0 < 1.33), (n_l/n_m − 1) turns negative, making the spherical air bubble diverge rays.',
      hi: 'माध्यम का अपवर्तनांक अधिक होने से लेंस की प्रकृति उलटकर अपसारी (अवतल) हो जाती है।',
    },
  },
  {
    id: 'afx-24-4',
    chapterId: 'ray-optics',
    simId: 'eye-defects',
    yearTag: 'IAF 2021',
    questionType: 'Direct Formula',
    question: {
      en: 'Astigmatism in the human eye is corrected using a:',
      hi: 'मानव नेत्र में अबिंदुकता (Astigmatism) दोष को किस लेंस से ठीक किया जाता है?',
    },
    options: [
      { en: 'Convex lens', hi: 'उत्तल लेंस' },
      { en: 'Concave lens', hi: 'अवतल लेंस' },
      { en: 'Cylindrical lens', hi: 'बेलनाकार (Cylindrical) लेंस' },
      { en: 'Plano-convex lens', hi: 'समतलोत्तल लेंस' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Myopia → Concave | Hypermetropia → Convex | Presbyopia → Bifocal | Astigmatism → Cylindrical!',
      hi: 'निकट-दृष्टि: अवतल | दूर-दृष्टि: उत्तल | जरा-दृष्टि: द्विफोकसी | अबिंदुकता: बेलनाकार!',
    },
    solution: {
      en: 'Uneven corneal curvature along horizontal vs vertical axes is corrected with a cylindrical lens.',
      hi: 'कॉर्निया की असमान वक्रता के कारण उत्पन्न अबिंदुकता बेलनाकार लेंस से सुधारी जाती है।',
    },
  },

  // CH 25: WAVE OPTICS
  {
    id: 'afx-25-1',
    chapterId: 'wave-optics',
    simId: 'wave-optics',
    yearTag: 'IAF 2024',
    questionType: 'Ratio Trick',
    question: {
      en: 'If the entire Young’s Double Slit (YDSE) apparatus is immersed in water (n = 4/3), the fringe width β:',
      hi: 'यदि यंग के द्वि-स्लिट (YDSE) उपकरण को पूरी तरह पानी (n = 4/3) में डुबो दिया जाए, तो फ्रिंज चौड़ाई β:',
    },
    options: [
      { en: 'Increases by factor 4/3', hi: '4/3 गुना बढ़ जाएगी' },
      { en: 'Decreases to 3/4 of its air value (β′ = β/n)', hi: 'घटकर वायु के मान की 3/4 (β/n) रह जाएगी' },
      { en: 'Remains unchanged', hi: 'अपरिवर्तित रहेगी' },
      { en: 'Becomes zero', hi: 'शून्य हो जाएगी' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'In medium n, λ′ = λ/n ⇒ Fringe width β′ = β/n (shrinks to 3/4 in water!).',
      hi: 'माध्यम में λ घटकर λ/n ⇒ फ्रिंज चौड़ाई β′ = β/n = 3β/4!',
    },
    solution: {
      en: 'Since β = λD/d and wavelength in water shrinks to λ/n, new fringe width β′ = β/n = (3/4)β.',
      hi: 'पानी में तरंगदैर्घ्य λ/n हो जाने से β′ = β/n रह जाती है।',
    },
  },
  {
    id: 'afx-25-2',
    chapterId: 'wave-optics',
    simId: 'diffraction-polarization',
    yearTag: 'IAF 2023',
    questionType: 'Direct Formula',
    question: {
      en: 'According to Brewster’s Law, at the polarizing angle i_p, the angle between reflected and refracted rays is:',
      hi: 'ब्रूस्टर के नियम के अनुसार ध्रुवण कोण i_p पर परावर्तित और अपवर्तित किरणों के बीच कोण होता है:',
    },
    options: [
      { en: '0°', hi: '0°' },
      { en: '45°', hi: '45°' },
      { en: '90°', hi: '90°' },
      { en: '180°', hi: '180°' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Brewster Law: μ = tan(i_p) AND reflected ray ⊥ refracted ray (90°)!',
      hi: 'ब्रूस्टर नियम: μ = tan(i_p) तथा परावर्तित ⊥ अपवर्तित (90°)!',
    },
    solution: {
      en: 'At Brewster angle i_p + r = 90°, so reflected and refracted rays are strictly perpendicular (90°).',
      hi: 'ध्रुवण कोण पर i_p + r = 90°, अतः परावर्तित व अपवर्तित किरणें परस्पर 90° पर होती हैं।',
    },
  },
  {
    id: 'afx-25-3',
    chapterId: 'wave-optics',
    simId: 'wave-optics',
    yearTag: 'IAF 2022',
    questionType: 'Ratio Trick',
    question: {
      en: 'Two coherent waves of intensity ratio 9 : 1 interfere. The ratio of maximum to minimum intensity (I_max : I_min) is:',
      hi: '9 : 1 तीव्रता अनुपात की दो कला-संबद्ध तरंगें व्यतिकरण करती हैं। I_max : I_min का अनुपात है:',
    },
    options: [
      { en: '9 : 1', hi: '9 : 1' },
      { en: '4 : 1', hi: '4 : 1' },
      { en: '2 : 1', hi: '2 : 1' },
      { en: '16 : 9', hi: '16 : 9' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Amplitude ratio = √9 : √1 = 3 : 1 ⇒ I_max/I_min = (3+1)²/(3−1)² = 16/4 = 4 : 1!',
      hi: 'आयाम अनुपात 3:1 ⇒ I_max/I_min = (3+1)²/(3−1)² = 16/4 = 4 : 1!',
    },
    solution: {
      en: 'a₁/a₂ = √(I₁/I₂) = 3/1. Thus I_max/I_min = (a₁ + a₂)² / (a₁ − a₂)² = 4² / 2² = 4 : 1.',
      hi: '(√9 + √1)² / (√9 − √1)² = 16 / 4 = 4 : 1।',
    },
  },
  {
    id: 'afx-25-4',
    chapterId: 'wave-optics',
    simId: 'diffraction-polarization',
    yearTag: 'IAF 2020',
    questionType: 'Direct Formula',
    question: {
      en: 'Unpolarized light of intensity I₀ passes through a Polaroid. The emerging light intensity is:',
      hi: 'I₀ तीव्रता का अध्रुवित प्रकाश एक पोलरॉइड से गुजरता है। निर्गत प्रकाश की तीव्रता होगी:',
    },
    options: [
      { en: 'I₀', hi: 'I₀' },
      { en: 'I₀ / 2', hi: 'I₀ / 2' },
      { en: 'I₀ / 4', hi: 'I₀ / 4' },
      { en: 'Zero', hi: 'शून्य' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'First Polaroid ALWAYS cuts unpolarized light to EXACTLY I₀/2; second Polaroid follows Malus Law I = (I₀/2)cos²θ!',
      hi: 'प्रथम पोलरॉइड अध्रुवित प्रकाश को ठीक आधा (I₀/2) कर देता है!',
    },
    solution: {
      en: 'Averaging cos²θ over all random orientations gives ½, so transmitted intensity is I₀/2.',
      hi: 'cos²θ का औसत मान ½ होने से निर्गत तीव्रता I₀/2 होती है।',
    },
  },

  // CH 26: DUAL NATURE OF MATTER & RADIATION
  {
    id: 'afx-26-1',
    chapterId: 'dual-nature',
    simId: 'dual-nature',
    yearTag: 'IAF 2024',
    questionType: 'Concept Trap',
    question: {
      en: 'In the photoelectric effect, the maximum kinetic energy of emitted photoelectrons depends on the incident light’s:',
      hi: 'प्रकाश-विद्युत प्रभाव में उत्सर्जित इलेक्ट्रॉनों की अधिकतम गतिज ऊर्जा आपतित प्रकाश की किस राशि पर निर्भर करती है?',
    },
    options: [
      { en: 'Intensity only', hi: 'केवल तीव्रता पर' },
      { en: 'Frequency only (above threshold ν₀)', hi: 'केवल आवृत्ति पर (देहली ν₀ से ऊपर)' },
      { en: 'Time of illumination', hi: 'आपतन समय पर' },
      { en: 'Area of plate', hi: 'प्लेट के क्षेत्रफल पर' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Frequency → controls K_max & Stopping Potential V₀! Intensity → controls Photoelectric Current ONLY!',
      hi: 'आवृत्ति → गतिज ऊर्जा व निरोधी विभव; तीव्रता → केवल प्रकाश-विद्युत धारा!',
    },
    solution: {
      en: 'By Einstein’s equation K_max = hν − φ₀, maximum KE rises linearly with frequency ν and is independent of intensity.',
      hi: 'आइंस्टीन समीकरण K_max = hν − φ₀ से K_max केवल आवृत्ति पर निर्भर है।',
    },
  },
  {
    id: 'afx-26-2',
    chapterId: 'dual-nature',
    simId: 'de-broglie',
    yearTag: 'IAF 2023',
    questionType: 'Direct Formula',
    question: {
      en: 'The de Broglie wavelength λ of an electron accelerated from rest through potential difference V = 100 V is:',
      hi: '100 V विभवांतर से त्वरित इलेक्ट्रॉन का डी-ब्रॉग्ली तरंगदैर्घ्य λ है:',
    },
    options: [
      { en: '12.27 Å', hi: '12.27 Å' },
      { en: '1.227 Å', hi: '1.227 Å' },
      { en: '0.1227 Å', hi: '0.1227 Å' },
      { en: '100 Å', hi: '100 Å' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Electron Shortcut: λ = 12.27 / √V Å! For V = 100 V ⇒ 12.27 / 10 = 1.227 Å!',
      hi: 'इलेक्ट्रॉन शॉर्टकट: λ = 12.27 / √V Å = 12.27 / 10 = 1.227 Å!',
    },
    solution: {
      en: 'Using λ = 12.27 / √V Å for an electron, putting V = 100 gives 12.27 / 10 = 1.227 Å.',
      hi: 'λ = 12.27 / √100 = 1.227 Å।',
    },
  },
  {
    id: 'afx-26-3',
    chapterId: 'dual-nature',
    simId: 'dual-nature',
    yearTag: 'IAF 2022',
    questionType: 'Concept Trap',
    question: {
      en: 'The rest mass of a photon moving at speed c is:',
      hi: 'प्रकाश चाल c से गतिमान फोटॉन का विराम द्रव्यमान (Rest Mass) होता है:',
    },
    options: [
      { en: 'Zero', hi: 'शून्य' },
      { en: '9.1 × 10⁻³¹ kg', hi: '9.1 × 10⁻³¹ kg' },
      { en: 'hν / c', hi: 'hν / c' },
      { en: 'Infinite', hi: 'अनंत' },
    ],
    correctIndex: 0,
    shortcut20s: {
      en: 'Photon rest mass m₀ = 0, charge = 0 (undeflected by E or B fields!), momentum p = h/λ!',
      hi: 'फोटॉन का विराम द्रव्यमान शून्य तथा आवेश शून्य होता है; संवेग p = h/λ।',
    },
    solution: {
      en: 'Photons always travel at c and carry zero rest mass, zero electric charge, and momentum p = h/λ.',
      hi: 'फोटॉन का विराम द्रव्यमान व आवेश दोनों शून्य होते हैं।',
    },
  },
  {
    id: 'afx-26-4',
    chapterId: 'dual-nature',
    simId: 'de-broglie',
    yearTag: 'IAF 2021',
    questionType: 'Ratio Trick',
    question: {
      en: 'An electron and a proton have the SAME kinetic energy. Which has the LONGER de Broglie wavelength?',
      hi: 'एक इलेक्ट्रॉन और एक प्रोटॉन की गतिज ऊर्जा समान है। किसका डी-ब्रॉग्ली तरंगदैर्घ्य अधिक होगा?',
    },
    options: [
      { en: 'Proton', hi: 'प्रोटॉन' },
      { en: 'Electron (smaller mass m)', hi: 'इलेक्ट्रॉन (कम द्रव्यमान m)' },
      { en: 'Both equal', hi: 'दोनों बराबर' },
      { en: 'Cannot be determined', hi: 'निर्धारित नहीं' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'λ = h / √(2mK) ⇒ For same K, λ ∝ 1/√m ⇒ LIGHTER particle (Electron) has LONGER wavelength!',
      hi: 'λ ∝ 1/√m ⇒ हल्के कण (इलेक्ट्रॉन) का तरंगदैर्घ्य अधिक होता है!',
    },
    solution: {
      en: 'Since electron mass is ~1836 times smaller than proton mass, λ_e = √1836 · λ_p ≈ 42.8 · λ_p.',
      hi: 'इलेक्ट्रॉन का द्रव्यमान कम होने से λ = h/√(2mK) अधिक होता है।',
    },
  },

  // CH 27: ATOMS (BOHR MODEL)
  {
    id: 'afx-27-1',
    chapterId: 'atoms',
    simId: 'atoms',
    yearTag: 'IAF 2024',
    questionType: 'Ratio Trick',
    question: {
      en: 'In Bohr’s Hydrogen atom, the radius r_n of the n-th stationary orbit is proportional to:',
      hi: 'बोहर के हाइड्रोजन परमाणु में n-वीं कक्षा की त्रिज्या r_n किसके समानुपाती होती है?',
    },
    options: [
      { en: 'n', hi: 'n' },
      { en: 'n²', hi: 'n²' },
      { en: '1 / n', hi: '1 / n' },
      { en: '1 / n²', hi: '1 / n²' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Bohr Trio: Radius r ∝ n² (0.53 n² Å) | Speed v ∝ 1/n | Energy E ∝ −1/n² (−13.6/n² eV)!',
      hi: 'बोहर तिकड़ी: r ∝ n² | v ∝ 1/n | E ∝ −1/n²!',
    },
    solution: {
      en: 'For Hydrogen (Z = 1), r_n = 0.529 × n² Å, so orbit radii scale as 1 : 4 : 9.',
      hi: 'हाइड्रोजन में r_n = 0.529 n² Å, अतः r_n ∝ n²।',
    },
  },
  {
    id: 'afx-27-2',
    chapterId: 'atoms',
    simId: 'atoms',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'The Balmer spectral series of Hydrogen lies in which region of the electromagnetic spectrum?',
      hi: 'हाइड्रोजन की बामर (Balmer) स्पेक्ट्रम श्रेणी किस क्षेत्र में पड़ती है?',
    },
    options: [
      { en: 'Ultraviolet (Lyman)', hi: 'पराबैंगनी (लाइमन)' },
      { en: 'Visible region', hi: 'दृश्य क्षेत्र (Visible)' },
      { en: 'Infrared (Paschen/Brackett/Pfund)', hi: 'अवरक्त क्षेत्र' },
      { en: 'Microwave region', hi: 'सूक्ष्म तरंग क्षेत्र' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Lyman (n=1) → UV | Balmer (n=2) → VISIBLE | Paschen, Brackett, Pfund (n≥3) → IR!',
      hi: 'लाइमन → UV | बामर → दृश्य (Visible) | पाश्चन/ब्रैकेट/फुंड → अवरक्त (IR)!',
    },
    solution: {
      en: 'Transitions ending at n = 2 emit photons between 365 nm and 656 nm, right inside visible light.',
      hi: 'n = 2 स्तर पर संक्रमण दृश्य प्रकाश क्षेत्र (बामर श्रेणी) में होता है।',
    },
  },
  {
    id: 'afx-27-3',
    chapterId: 'atoms',
    simId: 'atoms',
    yearTag: 'IAF 2022',
    questionType: 'Direct Formula',
    question: {
      en: 'The ionization energy of a Hydrogen atom in its ground state (n = 1) is:',
      hi: 'मूल अवस्था (n = 1) में हाइड्रोजन परमाणु की आयनन ऊर्जा (Ionization Energy) है:',
    },
    options: [
      { en: '−13.6 eV', hi: '−13.6 eV' },
      { en: '+13.6 eV', hi: '+13.6 eV' },
      { en: '+3.4 eV', hi: '+3.4 eV' },
      { en: '+10.2 eV', hi: '+10.2 eV' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Ground state energy = −13.6 eV; Energy REQUIRED to ionize = +13.6 eV! (1st excitation = +10.2 eV).',
      hi: 'आयनन ऊर्जा = +13.6 eV (उत्तेजन ऊर्जा = +10.2 eV)।',
    },
    solution: {
      en: 'Removing an electron from E₁ = −13.6 eV to E_∞ = 0 requires +13.6 eV of work.',
      hi: 'E₁ = −13.6 eV से 0 eV तक ले जाने हेतु +13.6 eV ऊर्जा आवश्यक है।',
    },
  },
  {
    id: 'afx-27-4',
    chapterId: 'atoms',
    simId: 'atoms',
    yearTag: 'IAF 2021',
    questionType: 'Direct Formula',
    question: {
      en: 'If total energy of a Bohr electron is E = −3.4 eV, its Kinetic Energy (K) and Potential Energy (U) are:',
      hi: 'यदि बोहर इलेक्ट्रॉन की कुल ऊर्जा E = −3.4 eV है, तो उसकी गतिज (K) और स्थितिज (U) ऊर्जाएँ हैं:',
    },
    options: [
      { en: 'K = +3.4 eV, U = −6.8 eV', hi: 'K = +3.4 eV, U = −6.8 eV' },
      { en: 'K = −3.4 eV, U = +6.8 eV', hi: 'K = −3.4 eV, U = +6.8 eV' },
      { en: 'K = +6.8 eV, U = −3.4 eV', hi: 'K = +6.8 eV, U = −3.4 eV' },
      { en: 'K = +1.7 eV, U = −5.1 eV', hi: 'K = +1.7 eV, U = −5.1 eV' },
    ],
    correctIndex: 0,
    shortcut20s: {
      en: 'Virial Shortcut: K = −E (+3.4 eV) and U = 2E (−6.8 eV)! Works for Bohr & Satellite orbits!',
      hi: 'शॉर्टकट: K = −E (+3.4 eV) और U = 2E (−6.8 eV)!',
    },
    solution: {
      en: 'In Coulomb/gravitational circular orbits, K = −E = +3.4 eV and U = 2E = −6.8 eV (check: K + U = −3.4 eV).',
      hi: 'K = −E = +3.4 eV और U = 2E = −6.8 eV।',
    },
  },

  // CH 28: NUCLEI & RADIOACTIVITY
  {
    id: 'afx-28-1',
    chapterId: 'nuclei',
    simId: 'nuclei',
    yearTag: 'IAF 2024',
    questionType: 'Ratio Trick',
    question: {
      en: 'The half-life of a radioactive element is 10 days. What fraction of the sample remains UNDECAYED after 30 days?',
      hi: 'एक रेडियोधर्मी तत्व की अर्ध-आयु 10 दिन है। 30 दिन बाद नमूने का कितना भाग अविघटित शेष रहेगा?',
    },
    options: [
      { en: '1 / 4', hi: '1 / 4' },
      { en: '1 / 8', hi: '1 / 8' },
      { en: '7 / 8', hi: '7 / 8' },
      { en: '1 / 16', hi: '1 / 16' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'n = t / T½ = 30 / 10 = 3 half-lives ⇒ Remaining = (1/2)³ = 1/8! (Decayed fraction = 7/8!).',
      hi: 'n = 30/10 = 3 अर्ध-आयु ⇒ शेष = (1/2)³ = 1/8! (क्षय भाग = 7/8)।',
    },
    solution: {
      en: 'N / N₀ = (1/2)^(t/T½) = (1/2)³ = 1/8 remains undecayed.',
      hi: 'N/N₀ = (1/2)³ = 1/8 भाग शेष बचता है।',
    },
  },
  {
    id: 'afx-28-2',
    chapterId: 'nuclei',
    simId: 'nuclei',
    yearTag: 'IAF 2023',
    questionType: 'Direct Formula',
    question: {
      en: 'Emission of one α-particle from a nucleus reduces its atomic number Z and mass number A by:',
      hi: 'नाभिक से एक α-कण के उत्सर्जन पर परमाणु क्रमांक Z और द्रव्यमान संख्या A में क्रमशः कमी होती है:',
    },
    options: [
      { en: 'Z by 2, A by 4', hi: 'Z में 2, A में 4 की कमी' },
      { en: 'Z by 4, A by 2', hi: 'Z में 4, A में 2 की कमी' },
      { en: 'Z increases by 1, A unchanged', hi: 'Z में 1 की वृद्धि, A अपरिवर्तित' },
      { en: 'Both unchanged', hi: 'दोनों अपरिवर्तित' },
    ],
    correctIndex: 0,
    shortcut20s: {
      en: 'α = ₂He⁴ (Z−2, A−4) | β⁻ (Z+1, A same) | γ (Z same, A same)!',
      hi: 'α: (Z−2, A−4) | β⁻: (Z+1, A समान) | γ: कोई परिवर्तन नहीं!',
    },
    solution: {
      en: 'An alpha particle is a Helium-4 nucleus (₂He⁴), reducing Z by 2 and A by 4.',
      hi: 'α-कण हीलियम नाभिक (₂He⁴) है, अतः Z में 2 और A में 4 की कमी होती है।',
    },
  },
  {
    id: 'afx-28-3',
    chapterId: 'nuclei',
    simId: 'binding-energy',
    yearTag: 'IAF 2022',
    questionType: 'Direct Formula',
    question: {
      en: 'Energy equivalent to 1 atomic mass unit (1 amu / 1 u) is approximately:',
      hi: '1 परमाणु द्रव्यमान मात्रक (1 amu) के तुल्य ऊर्जा लगभग होती है:',
    },
    options: [
      { en: '931.5 eV', hi: '931.5 eV' },
      { en: '931.5 MeV', hi: '931.5 MeV' },
      { en: '13.6 MeV', hi: '13.6 MeV' },
      { en: '0.511 MeV', hi: '0.511 MeV' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: '1 amu = 931.5 MeV (Watch out for eV vs MeV trap!).',
      hi: '1 amu = 931.5 MeV (eV और MeV में भ्रम न रखें!)।',
    },
    solution: {
      en: 'E = (1.66 × 10⁻²⁷ kg) × c² / (1.602 × 10⁻¹³ J/MeV) ≈ 931.5 MeV.',
      hi: 'E = Δm·c² से 1 amu ≈ 931.5 MeV प्राप्त होता है।',
    },
  },
  {
    id: 'afx-28-4',
    chapterId: 'nuclei',
    simId: 'nuclei',
    yearTag: 'IAF 2021',
    questionType: 'Concept Trap',
    question: {
      en: 'Nuclear density ρ of a nucleus depends on its mass number A as:',
      hi: 'नाभिकीय घनत्व ρ द्रव्यमान संख्या A पर कैसे निर्भर करता है?',
    },
    options: [
      { en: 'Proportional to A', hi: 'A के समानुपाती' },
      { en: 'Proportional to A^(1/3)', hi: 'A^(1/3) के समानुपाती' },
      { en: 'INDEPENDENT of A (constant ~2.3×10¹⁷ kg/m³)', hi: 'A से स्वतंत्र (सदैव नियत ~2.3×10¹⁷ kg/m³)' },
      { en: 'Inversely proportional to A', hi: 'A के व्युत्क्रमानुपाती' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'R = R₀·A^(1/3) ⇒ Volume ∝ A ⇒ Density = Mass/Volume = CONSTANT for all nuclei!',
      hi: 'R ∝ A^(1/3) ⇒ आयतन ∝ A ⇒ नाभिकीय घनत्व A से स्वतंत्र (नियत) है!',
    },
    solution: {
      en: 'Because nuclear volume (4/3)πR₀³A scales linearly with mass A, A cancels and nuclear density stays constant.',
      hi: 'आयतन और द्रव्यमान दोनों A के समानुपाती होने से A कट जाता है और घनत्व नियत रहता है।',
    },
  },

  // CH 29: SEMICONDUCTORS, TRANSISTORS, ZENER & LOGIC GATES (6 PYQs)
  {
    id: 'afx-29-1',
    chapterId: 'semiconductors',
    simId: 'transistor-zener',
    yearTag: 'IAF 2024',
    questionType: 'Direct Formula',
    question: {
      en: 'For a transistor, if common-base current gain α = 0.98, the common-emitter current gain β is:',
      hi: 'यदि किसी ट्रांजिस्टर का α = 0.98 है, तो उसका उभयनिष्ठ-उत्सर्जक धारा लाभ β होगा:',
    },
    options: [
      { en: '49', hi: '49' },
      { en: '50', hi: '50' },
      { en: '98', hi: '98' },
      { en: '100', hi: '100' },
    ],
    correctIndex: 0,
    shortcut20s: {
      en: 'β = α / (1 − α) = 0.98 / 0.02 = 49! (α = 0.99 → β = 99; α = 0.95 → β = 19!).',
      hi: 'β = 0.98 / (1 − 0.98) = 0.98 / 0.02 = 49!',
    },
    solution: {
      en: 'Using β = α / (1 − α) = 0.98 / (1 − 0.98) = 0.98 / 0.02 = 49.',
      hi: 'β = α/(1−α) = 0.98/0.02 = 49।',
    },
  },
  {
    id: 'afx-29-2',
    chapterId: 'semiconductors',
    simId: 'transistor-zener',
    yearTag: 'IAF 2024',
    questionType: 'Concept Trap',
    question: {
      en: 'A Zener diode is specifically designed to work as a Voltage Regulator in:',
      hi: 'ज़ेनर डायोड (Zener Diode) वोल्टेज रेगुलेटर के रूप में किस बायस में कार्य करता है?',
    },
    options: [
      { en: 'Forward bias', hi: 'अग्र बायस में' },
      { en: 'Reverse breakdown region', hi: 'पश्च भंजन (Reverse Breakdown) क्षेत्र में' },
      { en: 'Zero bias', hi: 'शून्य बायस में' },
      { en: 'AC saturation only', hi: 'केवल AC संतृप्ति में' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Zener Diode = Reverse Breakdown → Voltage Regulator! LED = Forward Bias; Photodiode = Reverse Bias!',
      hi: 'ज़ेनर डायोड = पश्च बायस (वोल्टेज रेगुलेटर); LED = अग्र बायस!',
    },
    solution: {
      en: 'In reverse breakdown, heavily doped Zener junctions maintain nearly constant voltage V_Z across wide current swings.',
      hi: 'पश्च भंजन क्षेत्र में धारा बदलने पर भी ज़ेनर वोल्टता V_Z नियत रहती है।',
    },
  },
  {
    id: 'afx-29-3',
    chapterId: 'semiconductors',
    simId: 'logic-gates',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'Which pair of digital logic gates are known as UNIVERSAL GATES?',
      hi: 'निम्न में से किन लॉजिक गेटों को सार्वत्रिक गेट (Universal Gates) कहा जाता है?',
    },
    options: [
      { en: 'AND and OR', hi: 'AND और OR' },
      { en: 'NAND and NOR', hi: 'NAND और NOR' },
      { en: 'XOR and NOT', hi: 'XOR और NOT' },
      { en: 'AND and NOT', hi: 'AND और NOT' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'NAND & NOR are Universal Gates (any other gate can be constructed from NAND alone or NOR alone!).',
      hi: 'NAND और NOR सार्वत्रिक (Universal) गेट हैं!',
    },
    solution: {
      en: 'Using combinations of only NAND gates (or only NOR gates), one can build NOT, AND, OR, and XOR logic.',
      hi: 'केवल NAND या केवल NOR गेट से सभी अन्य लॉजिक गेट बनाए जा सकते हैं।',
    },
  },
  {
    id: 'afx-29-4',
    chapterId: 'semiconductors',
    simId: 'semiconductors',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'On increasing temperature, the electrical resistance of a pure SEMICONDUCTOR:',
      hi: 'तापमान बढ़ाने पर शुद्ध अर्धचालक (Semiconductor) का विद्युत प्रतिरोध:',
    },
    options: [
      { en: 'Increases linearly', hi: 'रैखिक रूप से बढ़ता है' },
      { en: 'Decreases (negative temperature coefficient)', hi: 'घटता है (ऋणात्मक ताप गुणांक)' },
      { en: 'Remains constant', hi: 'नियत रहता है' },
      { en: 'First increases then drops', hi: 'पहले बढ़ता है फिर घटता है' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Metal: T↑ ⇒ R↑ (+α). Semiconductor: T↑ ⇒ more free e⁻/hole pairs ⇒ R↓ (−α)!',
      hi: 'धातु: ताप↑ ⇒ प्रतिरोध↑; अर्धचालक: ताप↑ ⇒ प्रतिरोध↓!',
    },
    solution: {
      en: 'Higher thermal energy breaks covalent bonds in Si/Ge, exponentially raising carrier density and lowering resistance.',
      hi: 'ताप बढ़ने से सहसंयोजक बंध टूटते हैं, मुक्त आवेश वाहक बढ़ते हैं और प्रतिरोध घटता है।',
    },
  },
  {
    id: 'afx-29-5',
    chapterId: 'semiconductors',
    simId: 'transistor-zener',
    yearTag: 'IAF 2022',
    questionType: 'Direct Formula',
    question: {
      en: 'If a 50 Hz AC signal is fed into a FULL-WAVE rectifier, the fundamental ripple frequency of the DC output is:',
      hi: '50 Hz की AC को पूर्ण-तरंग दिष्टकारी (Full-Wave Rectifier) में देने पर निर्गत उर्मिका आवृत्ति होगी:',
    },
    options: [
      { en: '25 Hz', hi: '25 Hz' },
      { en: '50 Hz', hi: '50 Hz' },
      { en: '100 Hz', hi: '100 Hz' },
      { en: '200 Hz', hi: '200 Hz' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Half-Wave output ripple = f (50 Hz); Full-Wave output ripple = 2f (100 Hz)!',
      hi: 'अर्ध-तरंग: f (50 Hz); पूर्ण-तरंग दिष्टकारी: 2f (100 Hz)!',
    },
    solution: {
      en: 'A full-wave rectifier flips every negative half-cycle upward, producing 2 pulses per input cycle (2 × 50 = 100 Hz).',
      hi: 'पूर्ण-तरंग दिष्टकारी प्रत्येक अर्ध-चक्र में स्पंद देता है, अतः निर्गत आवृत्ति 2f = 100 Hz होती है।',
    },
  },
  {
    id: 'afx-29-6',
    chapterId: 'semiconductors',
    simId: 'transistor-zener',
    yearTag: 'IAF 2021',
    questionType: 'Concept Trap',
    question: {
      en: 'The phase difference between input AC voltage and output AC voltage in a Common-Emitter (CE) transistor amplifier is:',
      hi: 'उभयनिष्ठ-उत्सर्जक (CE) ट्रांजिस्टर प्रवर्धक में निवेशी और निर्गत AC वोल्टता के बीच कलांतर होता है:',
    },
    options: [
      { en: '0°', hi: '0°' },
      { en: '90°', hi: '90°' },
      { en: '180° (π radians)', hi: '180° (π रेडियन)' },
      { en: '45°', hi: '45°' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'CE Amplifier = 180° phase inversion! CB & CC Amplifiers = 0° phase shift!',
      hi: 'CE प्रवर्धक में 180° कलांतर; CB व CC में 0° कलांतर!',
    },
    solution: {
      en: 'Rising input base voltage increases I_C, increasing drop I_C R_L and lowering collector voltage V_CE = V_CC − I_C R_L (180° inverted).',
      hi: 'आधार वोल्टता बढ़ने पर I_C बढ़ता है जिससे V_CE = V_CC − I_C R_L घटता है (180° विपरीत कला)।',
    },
  },

  // CH 30: COMMUNICATION SYSTEMS (6 HIGH-YIELD AIRFORCE X PYQs)
  {
    id: 'afx-30-1',
    chapterId: 'communication-systems',
    simId: 'communication-systems',
    yearTag: 'IAF 2024',
    questionType: 'Direct Formula',
    question: {
      en: 'A TV transmitting antenna is 80 m tall. Taking Earth’s radius R = 6400 km, its maximum Line-of-Sight range d is:',
      hi: 'एक टीवी प्रेषी एंटीना 80 m ऊँचा है। पृथ्वी की त्रिज्या R = 6400 km लेने पर अधिकतम परास d होगी:',
    },
    options: [
      { en: '16 km', hi: '16 km' },
      { en: '32 km', hi: '32 km' },
      { en: '64 km', hi: '64 km' },
      { en: '40 km', hi: '40 km' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'd = √(2Rh) = √(2 × 6.4×10⁶ × 80) = √(1024×10⁶) = 32 × 10³ m = 32 km!',
      hi: 'd = √(2 × 6.4×10⁶ × 80) = √(1024×10⁶) = 32 km!',
    },
    solution: {
      en: 'd = √(2·R·h) = √(2 × 6.4×10⁶ × 80) = √(1.024 × 10⁹) = 32,000 m = 32 km.',
      hi: 'd = √(2Rh) = √(1024 × 10⁶) = 32 km।',
    },
  },
  {
    id: 'afx-30-2',
    chapterId: 'communication-systems',
    simId: 'communication-systems',
    yearTag: 'IAF 2024',
    questionType: 'Direct Formula',
    question: {
      en: 'For efficient radiation of a radio wave of wavelength λ, the minimum height of a transmitting antenna should be:',
      hi: 'तरंगदैर्घ्य λ की रेडियो तरंग के प्रभावी प्रसारण के लिए एंटीना की न्यूनतम ऊँचाई होनी चाहिए:',
    },
    options: [
      { en: 'λ', hi: 'λ' },
      { en: 'λ / 2', hi: 'λ / 2' },
      { en: 'λ / 4', hi: 'λ / 4' },
      { en: 'λ / 8', hi: 'λ / 8' },
    ],
    correctIndex: 2,
    shortcut20s: {
      en: 'Minimum Antenna Height = λ / 4! (Radiated power P ∝ (l/λ)²).',
      hi: 'न्यूनतम एंटीना ऊँचाई = λ / 4!',
    },
    solution: {
      en: 'A quarter-wave antenna (h = λ/4) allows full time variation of the signal across the antenna length.',
      hi: 'प्रभावी विकिरण हेतु एंटीना की लंबाई कम से कम λ/4 होनी चाहिए।',
    },
  },
  {
    id: 'afx-30-3',
    chapterId: 'communication-systems',
    simId: 'communication-systems',
    yearTag: 'IAF 2023',
    questionType: 'Direct Formula',
    question: {
      en: 'If a 10 kHz audio message amplitude-modulates a 1000 kHz carrier wave, the AM bandwidth required is:',
      hi: 'यदि 10 kHz का ऑडियो सिग्नल 1000 kHz की वाहक तरंग को आयाम-मॉडुलित करता है, तो आवश्यक AM बैंडचौड़ाई है:',
    },
    options: [
      { en: '10 kHz', hi: '10 kHz' },
      { en: '20 kHz', hi: '20 kHz' },
      { en: '1000 kHz', hi: '1000 kHz' },
      { en: '1010 kHz', hi: '1010 kHz' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'AM Bandwidth = 2 · f_m = 2 × 10 = 20 kHz (USB = 1010 kHz, LSB = 990 kHz)!',
      hi: 'AM बैंडचौड़ाई = 2 × f_m = 2 × 10 = 20 kHz!',
    },
    solution: {
      en: 'AM spans from lower sideband (f_c − f_m = 990 kHz) to upper sideband (f_c + f_m = 1010 kHz), giving BW = 2f_m = 20 kHz.',
      hi: 'BW = (f_c + f_m) − (f_c − f_m) = 2f_m = 20 kHz।',
    },
  },
  {
    id: 'afx-30-4',
    chapterId: 'communication-systems',
    simId: 'communication-systems',
    yearTag: 'IAF 2023',
    questionType: 'Concept Trap',
    question: {
      en: 'Sky-wave propagation used in short-wave AM radio broadcasting relies on reflection from Earth’s:',
      hi: 'शॉर्ट-वेव रेडियो प्रसारण में प्रयुक्त व्योम तरंग (Sky-Wave) संचरण किस परत से परावर्तन पर निर्भर है?',
    },
    options: [
      { en: 'Troposphere', hi: 'क्षोभमंडल' },
      { en: 'Ionosphere (frequency range ~3 MHz to 30 MHz)', hi: 'आयनमंडल (Ionosphere, 3–30 MHz)' },
      { en: 'Ozone layer', hi: 'ओज़ोन परत' },
      { en: 'Ocean surface', hi: 'समुद्र तल' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Ground wave (<2 MHz) | Sky wave (3–30 MHz → IONOSPHERE) | Space wave (>40 MHz → TV/Satellite LOS)!',
      hi: 'व्योम तरंग (3–30 MHz) → आयनमंडल से परावर्तन; अंतरिक्ष तरंग (>40 MHz) → टीवी/उपग्रह!',
    },
    solution: {
      en: 'Ionized layers in the ionosphere reflect 3–30 MHz sky waves back to Earth for long-distance radio links.',
      hi: 'आयनमंडल 3 से 30 MHz की रेडियो तरंगों को पृथ्वी पर वापस परावर्तित करता है।',
    },
  },
  {
    id: 'afx-30-5',
    chapterId: 'communication-systems',
    simId: 'communication-systems',
    yearTag: 'IAF 2022',
    questionType: 'Ratio Trick',
    question: {
      en: 'In an AM wave, maximum amplitude is 15 V and minimum amplitude is 5 V. The modulation index m_a is:',
      hi: 'किसी AM तरंग का अधिकतम आयाम 15 V और न्यूनतम आयाम 5 V है। मॉडुलन सूचकांक m_a है:',
    },
    options: [
      { en: '0.25', hi: '0.25' },
      { en: '0.50', hi: '0.50' },
      { en: '0.75', hi: '0.75' },
      { en: '1.00', hi: '1.00' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'm_a = (A_max − A_min) / (A_max + A_min) = (15 − 5) / (15 + 5) = 10 / 20 = 0.50!',
      hi: 'm_a = (15 − 5) / (15 + 5) = 10/20 = 0.50!',
    },
    solution: {
      en: 'Modulation index m_a = (A_max − A_min)/(A_max + A_min) = 10/20 = 0.50 (50% modulation).',
      hi: 'm_a = (A_max − A_min)/(A_max + A_min) = 0.50।',
    },
  },
  {
    id: 'afx-30-6',
    chapterId: 'communication-systems',
    simId: 'communication-systems',
    yearTag: 'IAF 2021',
    questionType: 'Concept Trap',
    question: {
      en: 'Why is Frequency Modulation (FM) preferred over Amplitude Modulation (AM) for high-fidelity music broadcasting?',
      hi: 'उच्च गुणवत्ता वाले संगीत प्रसारण में AM की तुलना में FM को क्यों प्राथमिकता दी जाती है?',
    },
    options: [
      { en: 'FM has smaller bandwidth', hi: 'FM की बैंडचौड़ाई कम होती है' },
      { en: 'FM is far less affected by atmospheric electrical noise', hi: 'FM पर वायुमंडलीय विद्युत शोर का प्रभाव बहुत कम होता है' },
      { en: 'FM travels farther via ionosphere', hi: 'FM आयनमंडल से अधिक दूर जाता है' },
      { en: 'FM requires no carrier wave', hi: 'FM को वाहक तरंग नहीं चाहिए' },
    ],
    correctIndex: 1,
    shortcut20s: {
      en: 'Electrical noise spikes distort AMPLITUDE — since FM encodes sound in FREQUENCY, noise is easily clipped off!',
      hi: 'शोर आयाम को बिगाड़ता है; FM में सूचना आवृत्ति में होती है इसलिए ध्वनि स्पष्ट रहती है!',
    },
    solution: {
      en: 'Atmospheric noise adds amplitude spikes; FM receivers use amplitude limiters to reject noise cleanly.',
      hi: 'FM में आयाम नियत रहता है जिससे शोर को आसानी से हटाया जा सकता है।',
    },
  },
];
