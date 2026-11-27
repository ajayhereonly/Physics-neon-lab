import { BilingualText, DerivationStep } from '../types/physics';

export type DerivationDiagramKind =
  | 'kinematics-vt'
  | 'projectile'
  | 'banking-road'
  | 'work-energy'
  | 'momentum-collision'
  | 'rolling-incline'
  | 'angular-momentum'
  | 'escape-velocity'
  | 'bernoulli'
  | 'simple-pendulum'
  | 'carnot'
  | 'gauss-wire'
  | 'electric-dipole'
  | 'drift-velocity'
  | 'biot-savart'
  | 'parallel-wires'
  | 'lcr-phasor'
  | 'transformer'
  | 'lens-maker'
  | 'prism'
  | 'ydse'
  | 'bohr-atom'
  | 'photoelectric'
  | 'radioactive-decay';

export interface CuratedBoardDerivation {
  id: string;
  simId: string;
  chapterId: string;
  chapterNumber: string;
  classLevel: 'Class 11' | 'Class 12';
  marks: '3 Marks' | '5 Marks';
  diagram: DerivationDiagramKind;
  title: BilingualText;
  finalFormula: string;
  assumptions: BilingualText[];
  markingScheme: BilingualText[];
  steps: DerivationStep[];
}

export const CURATED_BOARD_DERIVATIONS: CuratedBoardDerivation[] = [
  // ===================== CLASS 11 =====================
  {
    id: 'deriv-equations-of-motion',
    simId: 'motion-1d',
    chapterId: 'motion-1d',
    chapterNumber: '02',
    classLevel: 'Class 11',
    marks: '3 Marks',
    diagram: 'kinematics-vt',
    title: { en: 'Three Equations of Uniformly Accelerated Motion (Calculus & v–t Method)', hi: 'एकसमान त्वरित गति के तीनों समीकरण (कलन व v–t विधि)' },
    finalFormula: 'v = u + at  |  s = ut + ½at²  |  v² − u² = 2as',
    assumptions: [
      { en: 'Motion occurs along a straight line (1D).', hi: 'गति एक सरल रेखा (1D) में होती है।' },
      { en: 'Acceleration a remains strictly constant throughout time t.', hi: 'पूरे समय t में त्वरण a नियत रहता है।' },
    ],
    markingScheme: [
      { en: '1 Mark: Clean v–t trapezium diagram + definition a = dv/dt', hi: '1 अंक: स्वच्छ v–t समलंब आरेख व a = dv/dt परिभाषा' },
      { en: '1 Mark: Integration for v = u + at and s = ut + ½at²', hi: '1 अंक: समाकलन द्वारा प्रथम व द्वितीय समीकरण' },
      { en: '1 Mark: Eliminating t (or a = v·dv/ds) for v² − u² = 2as', hi: '1 अंक: तृतीय समीकरण की व्युत्पत्ति' },
    ],
    steps: [
      {
        title: { en: 'Start from Definition of Instantaneous Acceleration', hi: 'तात्क्षणिक त्वरण की परिभाषा से प्रारंभ' },
        equation: 'a = dv / dt   ⇒   dv = a · dt',
        note: { en: 'For constant acceleration a, integrate velocity from u to v as time goes from 0 to t.', hi: 'नियत त्वरण a के लिए u से v और 0 से t तक समाकलन करें।' },
      },
      {
        title: { en: 'First Equation of Motion', hi: 'गति का प्रथम समीकरण' },
        equation: '∫[u→v] dv = a · ∫[0→t] dt   ⇒   v − u = a·t   ⇒   v = u + a·t',
        note: { en: 'Graphically, a is the constant slope of the straight v–t line.', hi: 'ग्राफ़ में a, v–t रेखा की नियत ढाल (slope) है।' },
      },
      {
        title: { en: 'Integrate Velocity v = ds/dt for Displacement', hi: 'विस्थापन के लिए वेग का समाकलन' },
        equation: 'ds = v·dt = (u + a·t)·dt   ⇒   ∫[0→s] ds = ∫[0→t] (u + a·t) dt',
        note: { en: 'Area under the v–t trapezium equals displacement s.', hi: 'v–t ग्राफ़ के नीचे का क्षेत्रफल विस्थापन s के बराबर है।' },
      },
      {
        title: { en: 'Second Equation of Motion', hi: 'गति का द्वितीय समीकरण' },
        equation: 's = u·t + ½·a·t²',
        note: { en: 'Shows quadratic growth of displacement when acceleration is non-zero.', hi: 'अशून्य त्वरण पर विस्थापन समय के वर्ग के साथ बढ़ता है।' },
      },
      {
        title: { en: 'Chain Rule for Third Equation (Time-Independent)', hi: 'तृतीय समीकरण हेतु श्रृंखला नियम' },
        equation: 'a = (dv/ds)·(ds/dt) = v·(dv/ds)   ⇒   v·dv = a·ds   ⇒   v² − u² = 2·a·s',
        note: { en: 'Integrate left from u to v and right from 0 to s to obtain the timeless kinematic identity.', hi: 'u से v और 0 से s तक समाकलन कर समय-रहित तृतीय समीकरण प्राप्त होता है।' },
      },
    ],
  },
  {
    id: 'deriv-projectile-trajectory',
    simId: 'projectile',
    chapterId: 'kinematics',
    chapterNumber: '03',
    classLevel: 'Class 11',
    marks: '5 Marks',
    diagram: 'projectile',
    title: { en: 'Equation of Projectile Trajectory, Time of Flight, Peak Height & Range', hi: 'प्रक्षेप्य का परवलयाकार पथ, उड्डयन काल, अधिकतम ऊँचाई व परास' },
    finalFormula: 'y = x·tanθ − (g·x²)/(2u²cos²θ)  |  R = (u² sin 2θ)/g',
    assumptions: [
      { en: 'Air drag is neglected and gravitational acceleration g acts vertically downward.', hi: 'वायु प्रतिरोध नगण्य है और गुरुत्वीय त्वरण g ऊर्ध्वाधर नीचे की ओर है।' },
      { en: 'Horizontal velocity u_x = u cos θ stays constant (a_x = 0).', hi: 'क्षैतिज वेग u_x = u cos θ नियत रहता है।' },
    ],
    markingScheme: [
      { en: '1 Mark: Resolve initial velocity into u_x = u cos θ and u_y = u sin θ', hi: '1 अंक: वेग के घटक u_x व u_y दर्शाना' },
      { en: '2 Marks: Eliminate t to prove parabolic equation y(x)', hi: '2 अंक: t हटाकर परवलय समीकरण सिद्ध करना' },
      { en: '2 Marks: Derive T, H_max, and Range R = (u² sin 2θ)/g', hi: '2 अंक: T, H_max व परास R निकालना' },
    ],
    steps: [
      {
        title: { en: 'Resolve Initial Velocity into X and Y Components', hi: 'प्रारंभिक वेग के क्षैतिज व ऊर्ध्वाधर घटक' },
        equation: 'u_x = u·cosθ  (a_x = 0)    |    u_y = u·sinθ  (a_y = −g)',
        note: { en: 'Horizontal and vertical motions are completely independent.', hi: 'क्षैतिज और ऊर्ध्वाधर गतियाँ एक-दूसरे से स्वतंत्र हैं।' },
      },
      {
        title: { en: 'Position Coordinates at Time t', hi: 'समय t पर निर्देशांक' },
        equation: 'x = (u·cosθ)·t   ⇒   t = x / (u·cosθ)    and    y = (u·sinθ)·t − ½·g·t²',
        note: { en: 'Substitute t from the horizontal equation into the vertical equation.', hi: 'क्षैतिज समीकरण से t का मान ऊर्ध्वाधर समीकरण में रखें।' },
      },
      {
        title: { en: 'Equation of Path (Parabola)', hi: 'पथ का समीकरण (परवलय)' },
        equation: 'y = x·tanθ − [ g / (2·u²·cos²θ) ] · x²',
        note: { en: 'Matches y = ax − bx², proving the trajectory of a projectile is a parabola.', hi: 'यह y = ax − bx² रूप का है, अतः प्रक्षेप्य पथ परवलयाकार होता है।' },
      },
      {
        title: { en: 'Time of Flight (T) & Maximum Height (H)', hi: 'उड्डयन काल (T) व अधिकतम ऊँचाई (H)' },
        equation: 'T = (2·u·sinθ) / g    |    H = (u²·sin²θ) / (2·g)',
        note: { en: 'Set y = 0 for total flight time T; set v_y = 0 at the peak for height H.', hi: 'y = 0 रखकर T तथा शीर्ष पर v_y = 0 रखकर H प्राप्त होता है।' },
      },
      {
        title: { en: 'Horizontal Range (R) & Max Range Condition', hi: 'क्षैतिज परास (R) व अधिकतम परास' },
        equation: 'R = u_x · T = (u·cosθ)·(2u·sinθ / g) = (u² · sin 2θ) / g',
        note: { en: 'Range is maximum (R_max = u²/g) when sin 2θ = 1, i.e., θ = 45°.', hi: 'θ = 45° पर sin 2θ = 1 होने से परास अधिकतम (u²/g) होता है।' },
      },
    ],
  },
  {
    id: 'deriv-banking-roads',
    simId: 'banking-roads',
    chapterId: 'laws-of-motion',
    chapterNumber: '04',
    classLevel: 'Class 11',
    marks: '5 Marks',
    diagram: 'banking-road',
    title: { en: 'Maximum Safe Speed on a Banked Curved Road with Friction', hi: 'घर्षणयुक्त बंकित (झुकी हुई) सड़क पर अधिकतम सुरक्षित चाल' },
    finalFormula: 'v_max = √[ R·g · (μ_s + tanθ) / (1 − μ_s·tanθ) ]',
    assumptions: [
      { en: 'Road is banked at angle θ with horizontal; turn radius is R.', hi: 'सड़क क्षैतिज से कोण θ पर झुकी है और मोड़ की त्रिज्या R है।' },
      { en: 'At maximum speed, static friction f_max = μ_s·N acts downward along the incline.', hi: 'अधिकतम चाल पर स्थैतिक घर्षण ढाल के नीचे की ओर लगता है।' },
    ],
    markingScheme: [
      { en: '1.5 Marks: Free-body diagram showing N cos θ, N sin θ, f cos θ, f sin θ, mg', hi: '1.5 अंक: संपूर्ण मुक्त-पिंड आरेख (FBD)' },
      { en: '2 Marks: Vertical equilibrium & horizontal centripetal equations', hi: '2 अंक: ऊर्ध्वाधर संतुलन व अभिकेंद्र समीकरण' },
      { en: '1.5 Marks: Dividing equations and simplifying to v_max + optimum speed case', hi: '1.5 अंक: भाग देकर v_max व इष्टतम चाल सिद्ध करना' },
    ],
    steps: [
      {
        title: { en: 'Vertical Equilibrium (Zero Vertical Acceleration)', hi: 'ऊर्ध्वाधर संतुलन समीकरण' },
        equation: 'N·cosθ = m·g + f·sinθ   ⇒   N·(cosθ − μ_s·sinθ) = m·g',
        note: { en: 'Upward component of normal reaction balances weight plus downward friction component.', hi: 'अभिलंब प्रतिक्रिया का ऊर्ध्वाधर घटक भार और घर्षण घटक को संतुलित करता है।' },
      },
      {
        title: { en: 'Horizontal Centripetal Force Equation', hi: 'क्षैतिज अभिकेंद्र बल समीकरण' },
        equation: 'N·sinθ + f·cosθ = m·v² / R   ⇒   N·(sinθ + μ_s·cosθ) = m·v² / R',
        note: { en: 'Both horizontal components of N and static friction supply inward centripetal force.', hi: 'N और घर्षण दोनों के क्षैतिज घटक मिलकर अभिकेंद्र बल प्रदान करते हैं।' },
      },
      {
        title: { en: 'Divide Equation (2) by Equation (1)', hi: 'समीकरण (2) को समीकरण (1) से भाग दें' },
        equation: 'v² / (R·g) = (sinθ + μ_s·cosθ) / (cosθ − μ_s·sinθ)',
        note: { en: 'Normal reaction N and vehicle mass m cancel out completely!', hi: 'अभिलंब बल N और वाहन का द्रव्यमान m दोनों कट जाते हैं!' },
      },
      {
        title: { en: 'Divide Numerator & Denominator by cos θ', hi: 'अंश व हर को cos θ से भाग दें' },
        equation: 'v_max = √[ R·g · (μ_s + tanθ) / (1 − μ_s·tanθ) ]',
        note: { en: 'Special case (zero wear on tyres, μ = 0): optimum speed v_opt = √(R·g·tanθ).', hi: 'विशेष स्थिति (μ = 0): टायर घिसाव रहित इष्टतम चाल v_opt = √(Rg tanθ)।' },
      },
    ],
  },
  {
    id: 'deriv-work-energy',
    simId: 'work-energy',
    chapterId: 'work-energy',
    chapterNumber: '05',
    classLevel: 'Class 11',
    marks: '3 Marks',
    diagram: 'work-energy',
    title: { en: 'Work–Energy Theorem for a Variable Force', hi: 'परिवर्ती बल के लिए कार्य–ऊर्जा प्रमेय' },
    finalFormula: 'W_net = ∫ F·dx = ½·m·v² − ½·m·u² = ΔK',
    assumptions: [
      { en: 'Net force F(x) acts along the direction of motion on particle of constant mass m.', hi: 'नियत द्रव्यमान m पर परिणामी बल F(x) गति की दिशा में लगता है।' },
    ],
    markingScheme: [
      { en: '1 Mark: Express infinitesimal work dW = F·dx and substitute F = m·(dv/dt)', hi: '1 अंक: dW = F·dx व न्यूटन द्वितीय नियम का प्रयोग' },
      { en: '2 Marks: Chain rule substitution and integration from u to v', hi: '2 अंक: श्रृंखला नियम व समाकलन द्वारा ΔK सिद्ध करना' },
    ],
    steps: [
      {
        title: { en: 'Start from Elemental Work & Kinetic Energy Rate', hi: 'अल्पांश कार्य से प्रारंभ' },
        equation: 'dW = F · dx = m · (dv/dt) · dx',
        note: { en: 'By Newton’s Second Law, net force F = m·a = m·dv/dt.', hi: 'न्यूटन के द्वितीय नियम से F = m·dv/dt।' },
      },
      {
        title: { en: 'Rearrange dx/dt = v', hi: 'dx/dt = v प्रतिस्थापित करें' },
        equation: 'dW = m · (dx/dt) · dv = m · v · dv',
        note: { en: 'Work element depends solely on speed differential dv.', hi: 'कार्य का अल्पांश केवल वेग परिवर्तन dv पर निर्भर करता है।' },
      },
      {
        title: { en: 'Integrate from Initial Speed u to Final Speed v', hi: 'u से v तक समाकलन करें' },
        equation: 'W_net = ∫[u→v] m·v·dv = m · [v²/2]_[u→v] = ½·m·v² − ½·m·u² = K_f − K_i = ΔK',
        note: { en: 'Valid for all forces—conservative, non-conservative, constant, or variable!', hi: 'यह प्रमेय सभी बलों (संरक्षी, असंरक्षी, नियत या परिवर्ती) के लिए सत्य है।' },
      },
    ],
  },
  {
    id: 'deriv-linear-momentum',
    simId: 'linear-momentum',
    chapterId: 'momentum',
    chapterNumber: '06',
    classLevel: 'Class 11',
    marks: '3 Marks',
    diagram: 'momentum-collision',
    title: { en: 'Conservation of Linear Momentum & Elastic 1D Collision', hi: 'रैखिक संवेग संरक्षण का नियम और प्रत्यास्थ टक्कर' },
    finalFormula: 'm₁u₁ + m₂u₂ = m₁v₁ + m₂v₂   |   F_ext = 0 ⇒ p_total = const',
    assumptions: [
      { en: 'Two colliding bodies form an isolated system (F_external = 0).', hi: 'दोनों पिंड एक विलगित निकाय बनाते हैं (बाह्य बल = 0)।' },
    ],
    markingScheme: [
      { en: '1 Mark: Newton’s 3rd Law F₁₂ = −F₂₁ during impact Δt', hi: '1 अंक: न्यूटन के तृतीय नियम से क्रिया-प्रतिक्रिया बल' },
      { en: '2 Marks: Impulse equality and total momentum invariance', hi: '2 अंक: आवेग समीकरण से संवेग संरक्षण सिद्ध करना' },
    ],
    steps: [
      {
        title: { en: 'Apply Newton’s Third Law During Collision', hi: 'टक्कर के दौरान न्यूटन का तृतीय नियम' },
        equation: 'F⃗₁₂ = −F⃗₂₁   ⇒   F⃗₁₂ · Δt = −F⃗₂₁ · Δt',
        note: { en: 'Contact time Δt is identical for both bodies, so impulses are equal and opposite.', hi: 'संपर्क समय Δt समान होने से दोनों पर आवेग बराबर व विपरीत होते हैं।' },
      },
      {
        title: { en: 'Relate Impulse to Change in Momentum', hi: 'आवेग को संवेग परिवर्तन से जोड़ें' },
        equation: '(m₁·v₁ − m₁·u₁) = −(m₂·v₂ − m₂·u₂)',
        note: { en: 'Impulse on body 1 equals Δp₁; impulse on body 2 equals Δp₂.', hi: 'पिंड 1 का संवेग परिवर्तन = −(पिंड 2 का संवेग परिवर्तन)।' },
      },
      {
        title: { en: 'Total Linear Momentum Before = After Collision', hi: 'टक्कर से पहले व बाद कुल संवेग समान' },
        equation: 'm₁·u₁ + m₂·u₂ = m₁·v₁ + m₂·v₂   ⇒   p_initial = p_final',
        note: { en: 'In an elastic collision, relative speed of separation also equals relative speed of approach (u₁ − u₂ = v₂ − v₁).', hi: 'प्रत्यास्थ टक्कर में गतिज ऊर्जा भी संरक्षित रहती है।' },
      },
    ],
  },
  {
    id: 'deriv-rolling-incline',
    simId: 'rolling-incline',
    chapterId: 'rotational',
    chapterNumber: '07',
    classLevel: 'Class 11',
    marks: '5 Marks',
    diagram: 'rolling-incline',
    title: { en: 'Acceleration & Velocity of a Rigid Body Rolling Down an Incline', hi: 'आनत तल पर बिना फिसले लुढ़कते दृढ़ पिंड का त्वरण व वेग' },
    finalFormula: 'a = g·sinθ / (1 + k²/R²)   |   v = √[ 2gh / (1 + k²/R²) ]',
    assumptions: [
      { en: 'Pure rolling without slipping: v_cm = ω·R and a_cm = α·R.', hi: 'बिना फिसले शुद्ध लोटनी गति: v_cm = ωR और a_cm = αR।' },
      { en: 'Moment of inertia about center of mass is I = M·k² (k = radius of gyration).', hi: 'द्रव्यमान केंद्र के परितः जड़त्व आघूर्ण I = Mk² है।' },
    ],
    markingScheme: [
      { en: '1.5 Marks: Incline diagram + translational & rotational energy terms', hi: '1.5 अंक: आनत तल आरेख व कुल गतिज ऊर्जा समीकरण' },
      { en: '2 Marks: Energy conservation for v = √[2gh / (1 + k²/R²)]', hi: '2 अंक: ऊर्जा संरक्षण से वेग v का सूत्र' },
      { en: '1.5 Marks: Differentiating or force-torque equations for acceleration a', hi: '1.5 अंक: त्वरण a व विभिन्न आकृतियों की तुलना' },
    ],
    steps: [
      {
        title: { en: 'Total Kinetic Energy of a Rolling Body', hi: 'लोटनी गति में कुल गतिज ऊर्जा' },
        equation: 'K_total = K_trans + K_rot = ½·M·v² + ½·I·ω²',
        note: { en: 'Pure rolling combines center-of-mass translation and rotation about CM.', hi: 'लोटनी गति में स्थानांतरीय व घूर्णी दोनों गतिज ऊर्जाएँ होती हैं।' },
      },
      {
        title: { en: 'Substitute I = M·k² and ω = v / R', hi: 'I = Mk² व ω = v/R रखें' },
        equation: 'K_total = ½·M·v² + ½·(M·k²)·(v/R)² = ½·M·v² · (1 + k²/R²)',
        note: { en: 'Factor (1 + k²/R²) captures how mass distribution slows down rolling!', hi: 'गुणक (1 + k²/R²) बताता है कि द्रव्यमान वितरण गति को कैसे धीमा करता है।' },
      },
      {
        title: { en: 'Apply Conservation of Mechanical Energy from Height h', hi: 'ऊँचाई h से ऊर्जा संरक्षण लागू करें' },
        equation: 'M·g·h = ½·M·v² · (1 + k²/R²)   ⇒   v = √[ 2·g·h / (1 + k²/R²) ]',
        note: { en: 'Since Solid Sphere has smallest k²/R² = 2/5, it reaches the bottom fastest!', hi: 'ठोस गोले के लिए k²/R² = 2/5 न्यूनतम होने से यह सबसे पहले नीचे पहुँचता है।' },
      },
      {
        title: { en: 'Linear Acceleration Along Incline (s = h / sin θ)', hi: 'आनत तल के अनुदिश रैखिक त्वरण' },
        equation: 'v² = 2·a·(h / sinθ)   ⇒   a = (g · sinθ) / (1 + k²/R²)',
        note: { en: 'Notice mass M and radius R cancel out—only geometry factor k²/R² matters.', hi: 'द्रव्यमान M व त्रिज्या R कट जाते हैं—केवल आकृति गुणांक k²/R² मायने रखता है।' },
      },
    ],
  },
  {
    id: 'deriv-angular-momentum',
    simId: 'angular-momentum',
    chapterId: 'rotational',
    chapterNumber: '07',
    classLevel: 'Class 11',
    marks: '3 Marks',
    diagram: 'angular-momentum',
    title: { en: 'Relation Between Torque & Angular Momentum (τ = dL/dt) & Conservation Law', hi: 'बल आघूर्ण व कोणीय संवेग में संबंध (τ = dL/dt) व संरक्षण नियम' },
    finalFormula: 'τ⃗ = dL⃗ / dt   |   If τ_ext = 0 ⇒ I₁·ω₁ = I₂·ω₂',
    assumptions: [
      { en: 'Position vector r⃗ and momentum p⃗ are measured about the same fixed origin O.', hi: 'स्थिति सदिश r⃗ व संवेग p⃗ एक ही स्थिर मूलबिंदु O के सापेक्ष हैं।' },
    ],
    markingScheme: [
      { en: '1 Mark: Define L⃗ = r⃗ × p⃗ and differentiate with respect to time t', hi: '1 अंक: L⃗ = r⃗ × p⃗ की परिभाषा व समय के सापेक्ष अवकलन' },
      { en: '1 Mark: Show (dr⃗/dt) × p⃗ = v⃗ × mv⃗ = 0', hi: '1 अंक: v⃗ × mv⃗ = 0 सिद्ध करना' },
      { en: '1 Mark: Conclude τ⃗_ext = 0 ⇒ L = Iω = constant', hi: '1 अंक: कोणीय संवेग संरक्षण नियम' },
    ],
    steps: [
      {
        title: { en: 'Define Angular Momentum & Differentiate', hi: 'कोणीय संवेग की परिभाषा व अवकलन' },
        equation: 'L⃗ = r⃗ × p⃗   ⇒   dL⃗/dt = (dr⃗/dt) × p⃗ + r⃗ × (dp⃗/dt)',
        note: { en: 'Apply the product rule of differentiation to the cross product.', hi: 'सदिश गुणनफल पर अवकलन का गुणन नियम लागू करें।' },
      },
      {
        title: { en: 'Simplify Both Cross-Product Terms', hi: 'दोनों पदों को सरल करें' },
        equation: '(dr⃗/dt) × p⃗ = v⃗ × (m·v⃗) = 0    and    r⃗ × (dp⃗/dt) = r⃗ × F⃗ = τ⃗',
        note: { en: 'Cross product of any vector with itself (v⃗ × v⃗) is strictly zero.', hi: 'समान सदिशों का क्रॉस गुणनफल (v⃗ × v⃗) शून्य होता है।' },
      },
      {
        title: { en: 'Rotational Newton’s 2nd Law & Conservation of L', hi: 'घूर्णी द्वितीय नियम व संरक्षण' },
        equation: 'τ⃗_ext = dL⃗ / dt   ⇒   If τ⃗_ext = 0, then L = I₁·ω₁ = I₂·ω₂ = constant',
        note: { en: 'When an ice skater pulls arms inward, I decreases so angular speed ω rises dramatically!', hi: 'हाथ अंदर खींचने पर जड़त्व आघूर्ण I घटता है और कोणीय वेग ω तेजी से बढ़ जाता है!' },
      },
    ],
  },
  {
    id: 'deriv-escape-velocity',
    simId: 'escape-velocity',
    chapterId: 'gravitation',
    chapterNumber: '08',
    classLevel: 'Class 11',
    marks: '3 Marks',
    diagram: 'escape-velocity',
    title: { en: 'Escape Velocity & Orbital Velocity Relation (v_e = √2 · v_o)', hi: 'पलायन वेग व कक्षीय वेग में संबंध (v_e = √2 · v_o)' },
    finalFormula: 'v_e = √(2GM/R) = √(2gR) = √2 · v_o',
    assumptions: [
      { en: 'Planet is a uniform sphere of mass M and radius R; atmospheric drag is neglected.', hi: 'ग्रह एकसमान गोला है तथा वायु प्रतिरोध नगण्य है।' },
    ],
    markingScheme: [
      { en: '1 Mark: Total mechanical energy E_i = ½mv² − GMm/R at surface', hi: '1 अंक: सतह पर कुल यांत्रिक ऊर्जा लिखना' },
      { en: '1 Mark: Setting E_final = 0 at r → ∞ and canceling m', hi: '1 अंक: अनंत पर ऊर्जा शून्य रखकर हल करना' },
      { en: '1 Mark: Expressing in terms of g = GM/R² and linking v_e = √2 v_o', hi: '1 अंक: g व कक्षीय वेग v_o से संबंध' },
    ],
    steps: [
      {
        title: { en: 'Total Mechanical Energy at Planet Surface', hi: 'ग्रह की सतह पर कुल यांत्रिक ऊर्जा' },
        equation: 'E_surface = K + U = ½·m·v_e² − (G·M·m) / R',
        note: { en: 'Gravitational potential energy is negative because gravity is attractive.', hi: 'आकर्षण बल के कारण गुरुत्वीय स्थितिज ऊर्जा ऋणात्मक होती है।' },
      },
      {
        title: { en: 'Minimum Condition to Escape to Infinity', hi: 'अनंत तक पलायन की न्यूनतम शर्त' },
        equation: 'E_infinity = 0 + 0 = 0   ⇒   ½·m·v_e² − (G·M·m)/R = 0',
        note: { en: 'At r → ∞, both potential energy and minimum residual kinetic energy vanish.', hi: 'अनंत दूरी पर स्थितिज व न्यूनतम गतिज ऊर्जा दोनों शून्य हो जाती हैं।' },
      },
      {
        title: { en: 'Solve for Escape Velocity & Substitute GM = g·R²', hi: 'पलायन वेग का सूत्र व g के पदों में रूप' },
        equation: 'v_e = √(2·G·M / R) = √(2·g·R) ≈ 11.2 km/s (Earth)',
        note: { en: 'Independent of projectile mass m and launch angle!', hi: 'पलायन वेग प्रक्षेप्य के द्रव्यमान m व कोण से स्वतंत्र है।' },
      },
      {
        title: { en: 'Compare with Near-Surface Orbital Velocity v_o', hi: 'कक्षीय वेग v_o से तुलना' },
        equation: 'm·v_o²/R = G·M·m/R²  ⇒  v_o = √(GM/R)   ⇒   v_e = √2 · v_o',
        note: { en: 'Increasing an orbiting satellite’s speed by 41.4% (√2×) lets it escape gravity forever.', hi: 'कक्षीय वेग को √2 गुना (41.4%) बढ़ाने पर उपग्रह कक्षा छोड़कर पलायन कर जाता है।' },
      },
    ],
  },
  {
    id: 'deriv-bernoulli',
    simId: 'fluids',
    chapterId: 'fluids',
    chapterNumber: '10',
    classLevel: 'Class 11',
    marks: '5 Marks',
    diagram: 'bernoulli',
    title: { en: 'Bernoulli’s Theorem for Steady Non-Viscous Fluid Flow', hi: 'अश्यान धारा-रेखीय तरल प्रवाह हेतु बर्नौली का प्रमेय' },
    finalFormula: 'P + ½·ρ·v² + ρ·g·h = Constant',
    assumptions: [
      { en: 'Fluid is incompressible (ρ = const), non-viscous, irrotational, and steady.', hi: 'द्रव असंपीड्य, अश्यान और धारा-रेखीय प्रवाह में है।' },
    ],
    markingScheme: [
      { en: '1.5 Marks: Pipe diagram of varying cross-section A₁, A₂ and heights h₁, h₂', hi: '1.5 अंक: असमान अनुप्रस्थ काट की नली का आरेख' },
      { en: '2 Marks: Net pressure work W = (P₁ − P₂)·ΔV and ΔK, ΔU expressions', hi: '2 अंक: दाब द्वारा कार्य, ΔK तथा ΔU के व्यंजक' },
      { en: '1.5 Marks: Work–Energy Theorem & dividing by ΔV', hi: '1.5 अंक: कार्य–ऊर्जा प्रमेय से बर्नौली समीकरण' },
    ],
    steps: [
      {
        title: { en: 'Continuity Condition in Small Time Δt', hi: 'सांतत्य समीकरण (समान आयतन ΔV)' },
        equation: 'ΔV = A₁·v₁·Δt = A₂·v₂·Δt    and    Δm = ρ · ΔV',
        note: { en: 'Equal mass Δm enters at section 1 and leaves at section 2 in time Δt.', hi: 'समय Δt में सिरे 1 से प्रवेश और सिरे 2 से निकलने वाला द्रव्यमान समान है।' },
      },
      {
        title: { en: 'Net Work Done by Pressure Forces', hi: 'दाब बलों द्वारा कुल कार्य' },
        equation: 'W_net = P₁·A₁·(v₁Δt) − P₂·A₂·(v₂Δt) = (P₁ − P₂) · ΔV',
        note: { en: 'Pressure at inlet pushes fluid forward (+); outlet pressure opposes it (−).', hi: 'प्रवेश दाब धनात्मक और निर्गत दाब ऋणात्मक कार्य करता है।' },
      },
      {
        title: { en: 'Changes in Kinetic & Potential Energy', hi: 'गतिज व स्थितिज ऊर्जा में परिवर्तन' },
        equation: 'ΔK = ½·ρ·ΔV·(v₂² − v₁²)    |    ΔU = ρ·ΔV·g·(h₂ − h₁)',
        note: { en: 'Apply Conservation of Energy: W_net = ΔK + ΔU.', hi: 'ऊर्जा संरक्षण लागू करें: W_net = ΔK + ΔU।' },
      },
      {
        title: { en: 'Divide Throughout by Volume ΔV', hi: 'दोनों ओर ΔV से भाग दें' },
        equation: 'P₁ + ½·ρ·v₁² + ρ·g·h₁ = P₂ + ½·ρ·v₂² + ρ·g·h₂ = Constant',
        note: { en: 'Where fluid speeds up (narrow neck), static pressure drops!', hi: 'जहाँ तरल का वेग बढ़ता है (सँकरा भाग), वहाँ दाब कम हो जाता है!' },
      },
    ],
  },
  {
    id: 'deriv-simple-pendulum',
    simId: 'simple-pendulum',
    chapterId: 'oscillations',
    chapterNumber: '14',
    classLevel: 'Class 11',
    marks: '3 Marks',
    diagram: 'simple-pendulum',
    title: { en: 'Time Period of a Simple Pendulum Executing SHM', hi: 'सरल आवर्त गति करते सरल लोलक का आवर्तकाल' },
    finalFormula: 'T = 2π · √(L / g)',
    assumptions: [
      { en: 'Angular amplitude θ is small (θ < 10°), so sin θ ≈ θ in radians.', hi: 'कोणीय विस्थापन θ बहुत छोटा है, जिससे sin θ ≈ θ (रेडियन)।' },
    ],
    markingScheme: [
      { en: '1 Mark: Resolve bob weight mg into mg cos θ and restoring component −mg sin θ', hi: '1 अंक: भार mg के घटक दर्शाना' },
      { en: '1 Mark: Small-angle approximation to get d²θ/dt² = −(g/L)·θ', hi: '1 अंक: लघु कोण सन्निकटन से SHM समीकरण' },
      { en: '1 Mark: Comparing with ω² = g/L to deduce T = 2π√(L/g)', hi: '1 अंक: ω² की तुलना कर T प्राप्त करना' },
    ],
    steps: [
      {
        title: { en: 'Restoring Torque / Tangential Force', hi: 'प्रत्यानयन बल आघूर्ण' },
        equation: 'F_t = −m·g·sinθ    ⇒    τ = −m·g·L·sinθ',
        note: { en: 'Negative sign shows the force always pulls the bob back toward equilibrium.', hi: 'ऋणात्मक चिह्न दर्शाता है कि बल सदैव माध्य स्थिति की ओर लगता है।' },
      },
      {
        title: { en: 'Apply Small-Angle Approximation (sin θ ≈ θ)', hi: 'लघु कोण सन्निकटन लागू करें' },
        equation: 'I·α = −m·g·L·θ   ⇒   (m·L²)·(d²θ/dt²) = −m·g·L·θ',
        note: { en: 'Cancel mass m and one factor of L from both sides.', hi: 'दोनों ओर से m और L काटें।' },
      },
      {
        title: { en: 'Compare with Standard SHM Equation', hi: 'मानक SHM समीकरण से तुलना' },
        equation: 'd²θ/dt² = −(g / L)·θ = −ω²·θ   ⇒   ω = √(g / L)',
        note: { en: 'Angular frequency depends only on length L and local gravity g.', hi: 'कोणीय आवृत्ति केवल लंबाई L और गुरुत्वीय त्वरण g पर निर्भर करती है।' },
      },
      {
        title: { en: 'Final Time Period Formula', hi: 'आवर्तकाल का अंतिम सूत्र' },
        equation: 'T = 2π / ω = 2π · √(L / g)',
        note: { en: 'Independent of bob mass m and small amplitude!', hi: 'आवर्तकाल गोलक के द्रव्यमान m से स्वतंत्र है!' },
      },
    ],
  },
  {
    id: 'deriv-carnot-efficiency',
    simId: 'carnot-engine',
    chapterId: 'thermodynamics',
    chapterNumber: '12',
    classLevel: 'Class 11',
    marks: '5 Marks',
    diagram: 'carnot',
    title: { en: 'Efficiency of a Reversible Carnot Heat Engine', hi: 'उत्क्रमणीय कार्नोट ऊष्मा इंजन की दक्षता' },
    finalFormula: 'η = 1 − (Q₂ / Q₁) = 1 − (T₂ / T₁)',
    assumptions: [
      { en: 'Working substance is an ideal gas undergoing 2 isothermal + 2 adiabatic reversible processes.', hi: 'कार्यकारी पदार्थ आदर्श गैस है जो 2 समतापी व 2 रुद्धोष्म प्रक्रमों से गुजरती है।' },
    ],
    markingScheme: [
      { en: '1.5 Marks: Clean P–V indicator diagram (A→B→C→D)', hi: '1.5 अंक: स्वच्छ P–V सूचक आरेख' },
      { en: '2 Marks: Isothermal heat expressions Q₁, Q₂ and adiabatic volume ratio V₂/V₁ = V₃/V₄', hi: '2 अंक: समतापी ऊष्मा व रुद्धोष्म आयतन अनुपात' },
      { en: '1.5 Marks: Efficiency η = 1 − T₂/T₁ and Carnot theorem statement', hi: '1.5 अंक: दक्षता सूत्र व निष्कर्ष' },
    ],
    steps: [
      {
        title: { en: 'Heat Absorbed (Q₁) & Heat Rejected (Q₂) in Isothermal Legs', hi: 'समतापी प्रक्रमों में अवशोषित व निष्कासित ऊष्मा' },
        equation: 'Q₁ = n·R·T₁·ln(V₂ / V₁)    |    Q₂ = n·R·T₂·ln(V₃ / V₄)',
        note: { en: 'Along isotherms, ΔU = 0 so heat equals isothermal work done.', hi: 'समतापी प्रक्रम में ΔU = 0 होता है, अतः Q = W।' },
      },
      {
        title: { en: 'Link Volumes Using the Two Adiabatic Legs', hi: 'दोनों रुद्धोष्म प्रक्रमों से आयतन संबंध' },
        equation: 'T₁·V₂^(γ−1) = T₂·V₃^(γ−1)   and   T₁·V₁^(γ−1) = T₂·V₄^(γ−1)',
        note: { en: 'Divide the first adiabatic relation by the second.', hi: 'पहले समीकरण को दूसरे से भाग दें।' },
      },
      {
        title: { en: 'Prove Equal Expansion/Compression Ratios', hi: 'आयतन अनुपातों की समानता सिद्ध करें' },
        equation: '(V₂ / V₁)^(γ−1) = (V₃ / V₄)^(γ−1)   ⇒   V₂ / V₁ = V₃ / V₄',
        note: { en: 'Thus ln(V₂/V₁) cancels ln(V₃/V₄) cleanly!', hi: 'अतः ln(V₂/V₁) और ln(V₃/V₄) आपस में कट जाते हैं!' },
      },
      {
        title: { en: 'Carnot Efficiency Depends Only on Kelvin Temperatures', hi: 'कार्नोट दक्षता का अंतिम सूत्र' },
        equation: 'η = (Q₁ − Q₂) / Q₁ = 1 − (Q₂ / Q₁) = 1 − (T₂ / T₁)',
        note: { en: '100% efficiency is impossible because sink temperature T₂ = 0 K is unattainable.', hi: 'सिंक का तापमान T₂ = 0 K असंभव होने से 100% दक्षता संभव नहीं है।' },
      },
    ],
  },

  // ===================== CLASS 12 =====================
  {
    id: 'deriv-gauss-wire',
    simId: 'gauss-dipole',
    chapterId: 'electric-charges',
    chapterNumber: '16',
    classLevel: 'Class 12',
    marks: '3 Marks',
    diagram: 'gauss-wire',
    title: { en: 'Electric Field Due to an Infinitely Long Straight Charged Wire (Gauss’s Law)', hi: 'अनंत लंबाई के सीधे आवेशित तार के कारण विद्युत क्षेत्र (गॉस नियम)' },
    finalFormula: 'E = λ / (2π · ε₀ · r)',
    assumptions: [
      { en: 'Uniform linear charge density λ (C/m); cylindrical symmetry makes E purely radial.', hi: 'एकसमान रैखिक आवेश घनत्व λ है तथा बेलनाकार सममिति से E त्रिज्यीय है।' },
    ],
    markingScheme: [
      { en: '1 Mark: Cylindrical Gaussian surface of radius r and length l', hi: '1 अंक: बेलनाकार गॉसीय पृष्ठ का आरेख' },
      { en: '1 Mark: Zero flux through flat end-caps + curved surface flux E·(2πrl)', hi: '1 अंक: समतल सिरों पर शून्य फ्लक्स व वक्र पृष्ठ फ्लक्स' },
      { en: '1 Mark: Applying Φ = q_enc/ε₀ = λl/ε₀ to solve for E', hi: '1 अंक: गॉस नियम लगाकर E निकालना' },
    ],
    steps: [
      {
        title: { en: 'Choose a Coaxial Cylindrical Gaussian Surface', hi: 'समाक्षीय बेलनाकार गॉसीय पृष्ठ चुनें' },
        equation: 'q_enclosed = λ · l',
        note: { en: 'Draw a cylinder of radius r and length l coaxial with the wire.', hi: 'तार के चारों ओर त्रिज्या r व लंबाई l का बेलन लें।' },
      },
      {
        title: { en: 'Compute Total Electric Flux Over All 3 Faces', hi: 'तीनों पृष्ठों से कुल विद्युत फ्लक्स' },
        equation: 'Φ_E = ∮ E⃗·dA⃗ = Φ_top (0) + Φ_bottom (0) + E · (2π·r·l)',
        note: { en: 'On flat end-caps E⃗ ⊥ dA⃗ (cos 90° = 0); on curved wall E⃗ ∥ dA⃗ (cos 0° = 1).', hi: 'समतल सिरों पर कोण 90° होने से फ्लक्स 0 है; वक्र पृष्ठ पर कोण 0° है।' },
      },
      {
        title: { en: 'Apply Gauss’s Law & Solve for E', hi: 'गॉस का नियम लागू करें' },
        equation: 'E · (2π·r·l) = (λ·l) / ε₀   ⇒   E = λ / (2π·ε₀·r)',
        note: { en: 'Field falls off as 1/r (slower than 1/r² for a point charge).', hi: 'विद्युत क्षेत्र 1/r के व्युत्क्रमानुपाती घटता है।' },
      },
    ],
  },
  {
    id: 'deriv-electric-dipole-axial',
    simId: 'gauss-dipole',
    chapterId: 'electric-charges',
    chapterNumber: '16',
    classLevel: 'Class 12',
    marks: '5 Marks',
    diagram: 'electric-dipole',
    title: { en: 'Electric Field on the Axial Line of an Electric Dipole', hi: 'विद्युत द्विध्रुव की अक्षीय रेखा पर विद्युत क्षेत्र' },
    finalFormula: 'E_axial = (1 / 4πε₀) · (2·p / r³)   (for r ≫ a)',
    assumptions: [
      { en: 'Charges −q and +q separated by distance 2a; dipole moment p = q·2a directed −q → +q.', hi: 'आवेश −q और +q के बीच दूरी 2a तथा द्विध्रुव आघूर्ण p = 2qa है।' },
    ],
    markingScheme: [
      { en: '1 Mark: Clear dipole geometry with distances (r − a) and (r + a)', hi: '1 अंक: द्विध्रुव आरेख व दूरियाँ (r−a) तथा (r+a)' },
      { en: '2 Marks: Superposition E_net = E_+q − E_-q and algebraic simplification', hi: '2 अंक: अध्यारोपण व बीजगणितीय सरलीकरण' },
      { en: '2 Marks: Short-dipole approximation r ≫ a and vector direction along p⃗', hi: '2 अंक: लघु द्विध्रुव सन्निकटन व दिशा' },
    ],
    steps: [
      {
        title: { en: 'Fields Due to +q and −q at Axial Point P', hi: 'अक्षीय बिंदु P पर +q व −q के कारण क्षेत्र' },
        equation: 'E_+ = k·q / (r − a)²  (away)    |    E_− = k·q / (r + a)²  (toward)',
        note: { en: 'Since +q is closer to P, E_+ > E_− so net field points along dipole moment p⃗.', hi: '+q बिंदु P के अधिक निकट है, अतः परिणामी क्षेत्र p⃗ की दिशा में है।' },
      },
      {
        title: { en: 'Subtract Opposing Magnitudes', hi: 'विपरीत क्षेत्रों का अंतर निकालें' },
        equation: 'E_axial = k·q · [ 1/(r − a)² − 1/(r + a)² ] = k·q · [ 4·a·r / (r² − a²)² ]',
        note: { en: 'Use algebraic identity (r + a)² − (r − a)² = 4·a·r.', hi: 'सर्वसमिका (r + a)² − (r − a)² = 4ar का उपयोग करें।' },
      },
      {
        title: { en: 'Substitute Dipole Moment p = 2·q·a', hi: 'द्विध्रुव आघूर्ण p = 2qa रखें' },
        equation: 'E_axial = (1 / 4πε₀) · [ 2·p·r / (r² − a²)² ]',
        note: { en: 'Exact axial field valid at any distance r > a.', hi: 'यह किसी भी दूरी r > a के लिए सटीक सूत्र है।' },
      },
      {
        title: { en: 'Short Dipole Limit (r ≫ a ⇒ a² neglected)', hi: 'लघु द्विध्रुव स्थिति (r ≫ a)' },
        equation: 'E_axial ≈ (1 / 4πε₀) · (2·p / r³)   (= 2 · E_equatorial)',
        note: { en: 'Dipole field drops rapidly as 1/r³ and axial strength is twice the equatorial field!', hi: 'द्विध्रुव का क्षेत्र 1/r³ से घटता है और अक्षीय क्षेत्र निरक्षीय का दोगुना होता है।' },
      },
    ],
  },
  {
    id: 'deriv-drift-velocity-ohm',
    simId: 'ohms-law',
    chapterId: 'current-electricity',
    chapterNumber: '18',
    classLevel: 'Class 12',
    marks: '5 Marks',
    diagram: 'drift-velocity',
    title: { en: 'Drift Velocity, Current Relation (I = neAv_d) & Microscopic Ohm’s Law', hi: 'अपवाह वेग, धारा संबंध (I = neAv_d) व ओम के नियम की व्युत्पत्ति' },
    finalFormula: 'v_d = (e·E·τ) / m   |   I = n·e·A·v_d   |   ρ = m / (n·e²·τ)',
    assumptions: [
      { en: 'Free electron density n, mean relaxation time τ, electric field E = V/l across length l.', hi: 'मुक्त इलेक्ट्रॉन घनत्व n, विश्रांति काल τ और विद्युत क्षेत्र E = V/l है।' },
    ],
    markingScheme: [
      { en: '1.5 Marks: Acceleration a = −eE/m and averaging thermal velocities to zero', hi: '1.5 अंक: त्वरण व ऊष्मीय वेगों का औसत शून्य दर्शाना' },
      { en: '1.5 Marks: Volume charge ΔQ = neAv_dΔt ⇒ I = neAv_d', hi: '1.5 अंक: धारा व अपवाह वेग में संबंध' },
      { en: '2 Marks: Substituting v_d to derive R = ml/(ne²τA) and resistivity ρ', hi: '2 अंक: प्रतिरोध R व प्रतिरोधकता ρ की व्युत्पत्ति' },
    ],
    steps: [
      {
        title: { en: 'Electron Acceleration & Average Drift Speed', hi: 'इलेक्ट्रॉन त्वरण व औसत अपवाह वेग' },
        equation: 'a⃗ = −(e·E⃗)/m   ⇒   v⃗_d = ⟨u⃗_thermal⟩ + a⃗·τ = −(e·E⃗·τ) / m',
        note: { en: 'Random thermal velocity averages to zero; τ is average time between collisions.', hi: 'यादृच्छिक ऊष्मीय वेग का औसत शून्य होता है।' },
      },
      {
        title: { en: 'Charge Crossing Area A in Time Δt', hi: 'समय Δt में अनुप्रस्थ काट A से प्रवाहित आवेश' },
        equation: 'ΔQ = (n · A · v_d · Δt) · e   ⇒   I = ΔQ / Δt = n · e · A · v_d',
        note: { en: 'Electrons inside cylinder of length v_d·Δt all cross the plane.', hi: 'लंबाई v_d·Δt के बेलन में स्थित सभी इलेक्ट्रॉन पार कर जाते हैं।' },
      },
      {
        title: { en: 'Substitute v_d = e·(V/l)·τ / m into Current', hi: 'अपवाह वेग v_d का मान धारा समीकरण में रखें' },
        equation: 'I = n·e·A · (e·V·τ / m·l) = (n·e²·τ·A / m·l) · V',
        note: { en: 'Ratio V/I is constant at fixed temperature — proving Ohm’s Law!', hi: 'नियत ताप पर V/I नियत रहता है — यही ओम का नियम है!' },
      },
      {
        title: { en: 'Microscopic Expressions for Resistance & Resistivity', hi: 'प्रतिरोध व प्रतिरोधकता के सूक्ष्म सूत्र' },
        equation: 'R = [ m / (n·e²·τ) ] · (l / A)   ⇒   ρ = m / (n·e²·τ)',
        note: { en: 'Heating metals lowers τ (more lattice collisions), which increases resistivity ρ!', hi: 'धातु गर्म करने पर τ घटता है जिससे प्रतिरोधकता ρ बढ़ जाती है।' },
      },
    ],
  },
  {
    id: 'deriv-biot-savart-loop',
    simId: 'solenoid-wires',
    chapterId: 'moving-charges',
    chapterNumber: '19',
    classLevel: 'Class 12',
    marks: '5 Marks',
    diagram: 'biot-savart',
    title: { en: 'Magnetic Field on the Axis of a Circular Current Loop (Biot–Savart Law)', hi: 'धारावाही वृत्ताकार लूप के अक्ष पर चुंबकीय क्षेत्र (बायो-सावर्ट नियम)' },
    finalFormula: 'B_axis = (μ₀ · I · R²) / [ 2 · (R² + x²)^(3/2) ]',
    assumptions: [
      { en: 'Loop of radius R carries steady current I; observation point is at axial distance x.', hi: 'त्रिज्या R के लूप में स्थायी धारा I है और बिंदु अक्ष पर दूरी x पर है।' },
    ],
    markingScheme: [
      { en: '1.5 Marks: 3D loop geometry showing dl⃗ ⊥ r⃗ and cancellation of dB_⊥', hi: '1.5 अंक: आरेख व लंबवत घटकों का निरसन' },
      { en: '2 Marks: Integrating dB cos φ over circumference 2πR', hi: '2 अंक: परिधि 2πR पर समाकलन' },
      { en: '1.5 Marks: Final axial formula + center special case (x = 0)', hi: '1.5 अंक: अंतिम सूत्र व केंद्र पर मान B = μ₀I/2R' },
    ],
    steps: [
      {
        title: { en: 'Apply Biot–Savart Law to Element dl', hi: 'अल्पांश dl पर बायो-सावर्ट नियम' },
        equation: 'dB = (μ₀ / 4π) · (I · dl · sin 90°) / r²   where r = √(R² + x²)',
        note: { en: 'Every tangent element dl is strictly perpendicular to vector r⃗ (sin 90° = 1).', hi: 'प्रत्येक स्पर्शरेखीय अल्पांश dl सदिश r⃗ के लंबवत है।' },
      },
      {
        title: { en: 'Resolve dB into Axial & Perpendicular Components', hi: 'dB के अक्षीय व लंबवत घटक' },
        equation: 'dB_x = dB · cosφ   (add up)    |    dB_⊥ = dB · sinφ   (cancel by symmetry)',
        note: { en: 'From the right triangle, cos φ = R / √(R² + x²).', hi: 'समकोण त्रिभुज से cos φ = R / √(R² + x²)।' },
      },
      {
        title: { en: 'Integrate Around Full Circumference (∮ dl = 2πR)', hi: 'पूरी परिधि पर समाकलन करें' },
        equation: 'B_x = (μ₀·I / 4π) · [ R / (R² + x²)^(3/2) ] · (2π·R)',
        note: { en: 'All factors except dl are constant around the symmetric ring.', hi: 'सममिति के कारण dl के अतिरिक्त सभी पद नियत हैं।' },
      },
      {
        title: { en: 'Final Axial Field & Center Special Case', hi: 'अंतिम सूत्र व केंद्र की स्थिति' },
        equation: 'B_axis = (μ₀·I·R²) / [ 2·(R² + x²)^(3/2) ]   |   At center (x = 0): B = μ₀·I / (2R)',
        note: { en: 'For N turns, multiply by N: B_center = μ₀·N·I / (2R).', hi: 'N फेरों के लिए केंद्र पर B = μ₀NI / (2R)।' },
      },
    ],
  },
  {
    id: 'deriv-parallel-wires',
    simId: 'solenoid-wires',
    chapterId: 'moving-charges',
    chapterNumber: '19',
    classLevel: 'Class 12',
    marks: '3 Marks',
    diagram: 'parallel-wires',
    title: { en: 'Force Per Unit Length Between Two Parallel Current-Carrying Wires (Definition of 1 Ampere)', hi: 'दो समांतर धारावाही तारों के बीच प्रति एकांक लंबाई बल (1 एम्पियर की परिभाषा)' },
    finalFormula: 'F / L = (μ₀ · I₁ · I₂) / (2π · d)',
    assumptions: [
      { en: 'Two long straight parallel conductors separated by distance d in vacuum.', hi: 'निर्वात में दूरी d पर स्थित दो लंबे समांतर तार।' },
    ],
    markingScheme: [
      { en: '1 Mark: Magnetic field B₁ = μ₀I₁/(2πd) produced by wire 1 at wire 2', hi: '1 अंक: तार 1 द्वारा तार 2 पर चुंबकीय क्षेत्र B₁' },
      { en: '1 Mark: Lorentz force F₂ = I₂·L·B₁ and direction rule (parallel attract)', hi: '1 अंक: बल F₂ = I₂LB₁ व दिशा नियम' },
      { en: '1 Mark: Standard definition of 1 Ampere (F/L = 2×10⁻⁷ N/m)', hi: '1 अंक: 1 एम्पियर की मानक परिभाषा' },
    ],
    steps: [
      {
        title: { en: 'Magnetic Field Produced by Wire 1 at Wire 2', hi: 'तार 1 के कारण तार 2 पर चुंबकीय क्षेत्र' },
        equation: 'B₁ = (μ₀ · I₁) / (2π · d)',
        note: { en: 'By Right-Hand Thumb Rule, B₁ is perpendicular to wire 2.', hi: 'दाएँ हाथ के अंगूठे के नियम से B₁ तार 2 के लंबवत है।' },
      },
      {
        title: { en: 'Magnetic Force on Segment L of Wire 2', hi: 'तार 2 की लंबाई L पर चुंबकीय बल' },
        equation: 'F₂ = I₂ · L · B₁ · sin 90° = I₂ · L · (μ₀·I₁ / 2πd)',
        note: { en: 'Parallel currents attract each other; antiparallel currents repel!', hi: 'समान दिशा की धाराएँ आकर्षित करती हैं और विपरीत धाराएँ प्रतिकर्षित करती हैं!' },
      },
      {
        title: { en: 'Force Per Unit Length & Definition of 1 Ampere', hi: 'प्रति एकांक लंबाई बल व 1 एम्पियर' },
        equation: 'F / L = (μ₀ · I₁ · I₂) / (2π · d)   ⇒   I₁=I₂=1A, d=1m ⇒ F/L = 2×10⁻⁷ N/m',
        note: { en: 'This classic result defines the SI Ampere in board exams.', hi: 'बोर्ड परीक्षा में 1 एम्पियर की परिभाषा इसी सूत्र से दी जाती है।' },
      },
    ],
  },
  {
    id: 'deriv-lcr-impedance',
    simId: 'ac-circuits',
    chapterId: 'ac-circuits',
    chapterNumber: '22',
    classLevel: 'Class 12',
    marks: '5 Marks',
    diagram: 'lcr-phasor',
    title: { en: 'Series LCR AC Circuit Impedance, Phase Angle & Resonance Frequency', hi: 'श्रेणी LCR प्रत्यावर्ती धारा परिपथ की प्रतिबाधा, कलांतर व अनुनाद आवृत्ति' },
    finalFormula: 'Z = √[ R² + (X_L − X_C)² ]   |   f₀ = 1 / (2π√LC)',
    assumptions: [
      { en: 'Sinusoidal source V = V₀ sin(ωt) drives R, L, and C connected in series (common current I).', hi: 'R, L, C श्रेणीक्रम में जुड़े हैं अतः तीनों में धारा I समान है।' },
    ],
    markingScheme: [
      { en: '1.5 Marks: Clean phasor diagram showing V_R, V_L (+90°), V_C (−90°)', hi: '1.5 अंक: स्वच्छ कला आरेख (Phasor Diagram)' },
      { en: '2 Marks: Pythagoras theorem for V₀, Z, and tan φ = (X_L − X_C)/R', hi: '2 अंक: प्रतिबाधा Z व कलांतर φ की व्युत्पत्ति' },
      { en: '1.5 Marks: Resonance condition X_L = X_C ⇒ f₀ = 1/(2π√LC)', hi: '1.5 अंक: अनुनाद शर्त व अनुनाद आवृत्ति f₀' },
    ],
    steps: [
      {
        title: { en: 'Phase Relations of Individual Voltage Phasors', hi: 'वोल्टेज फेज़र के कला संबंध' },
        equation: 'V_R = I·R (in phase)  |  V_L = I·X_L (+90°)  |  V_C = I·X_C (−90°)',
        note: { en: 'Inductor voltage leads current by π/2; capacitor voltage lags by π/2, so V_L and V_C are 180° opposite.', hi: 'V_L धारा से 90° आगे और V_C 90° पीछे होता है, अतः दोनों परस्पर विपरीत हैं।' },
      },
      {
        title: { en: 'Resultant Voltage via Phasor Triangle', hi: 'फेज़र त्रिभुज से परिणामी वोल्टेज' },
        equation: 'V² = V_R² + (V_L − V_C)² = I² · [ R² + (X_L − X_C)² ]',
        note: { en: 'Combine horizontal V_R with net vertical reactive voltage (V_L − V_C).', hi: 'क्षैतिज V_R और ऊर्ध्वाधर (V_L − V_C) का पाइथागोरस योग करें।' },
      },
      {
        title: { en: 'Impedance Z & Phase Angle φ', hi: 'प्रतिबाधा Z व कलांतर कोण φ' },
        equation: 'Z = V / I = √[ R² + (ωL − 1/ωC)² ]   |   tan φ = (X_L − X_C) / R',
        note: { en: 'Power factor is cos φ = R / Z.', hi: 'शक्ति गुणांक cos φ = R / Z होता है।' },
      },
      {
        title: { en: 'Series Resonance Condition (Maximum Current)', hi: 'श्रेणी अनुनाद शर्त (अधिकतम धारा)' },
        equation: 'X_L = X_C   ⇒   ω₀·L = 1/(ω₀·C)   ⇒   f₀ = 1 / (2π · √(L·C))',
        note: { en: 'At resonance, Z_min = R, φ = 0°, and power factor cos φ = 1 (purely resistive)!', hi: 'अनुनाद पर Z = R न्यूनतम होता है और धारा अधिकतम हो जाती है।' },
      },
    ],
  },
  {
    id: 'deriv-transformer',
    simId: 'transformer',
    chapterId: 'emi',
    chapterNumber: '21',
    classLevel: 'Class 12',
    marks: '3 Marks',
    diagram: 'transformer',
    title: { en: 'Transformer Principle & Turns–Voltage–Current Ratio', hi: 'ट्रांसफॉर्मर का सिद्धांत व वोल्टेज–धारा अनुपात समीकरण' },
    finalFormula: 'V_s / V_p = N_s / N_p = I_p / I_s',
    assumptions: [
      { en: 'Ideal soft-iron laminated core with zero flux leakage and negligible coil resistance.', hi: 'आदर्श पटलित क्रोड जिसमें फ्लक्स क्षरण व ताम्र हानि नगण्य है।' },
    ],
    markingScheme: [
      { en: '1 Mark: Mutual induction principle + core diagram', hi: '1 अंक: अन्योन्य प्रेरण सिद्धांत व क्रोड आरेख' },
      { en: '1 Mark: Faraday’s law on primary & secondary coils for V_s/V_p = N_s/N_p', hi: '1 अंक: फैराडे नियम से वोल्टेज अनुपात' },
      { en: '1 Mark: Ideal power conservation V_p·I_p = V_s·I_s and 2 energy losses', hi: '1 अंक: शक्ति संरक्षण व ऊर्जा हानियाँ' },
    ],
    steps: [
      {
        title: { en: 'Apply Faraday’s Law to Both Windings', hi: 'दोनों कुंडलियों पर फैराडे का नियम' },
        equation: 'ε_p = −N_p · (dΦ / dt)    and    ε_s = −N_s · (dΦ / dt)',
        note: { en: 'The exact same alternating magnetic flux Φ links every turn of both coils.', hi: 'समान परिवर्ती चुंबकीय फ्लक्स Φ दोनों कुंडलियों के प्रत्येक फेरे से गुजरता है।' },
      },
      {
        title: { en: 'Divide Secondary EMF by Primary EMF', hi: 'द्वितीयक व प्राथमिक विद्युत वाहक बल का अनुपात' },
        equation: 'V_s / V_p = N_s / N_p = K  (Transformation Ratio)',
        note: { en: 'Step-Up: N_s > N_p (V_s > V_p); Step-Down: N_s < N_p (V_s < V_p).', hi: 'उच्चायी में N_s > N_p और अपचायी में N_s < N_p होता है।' },
      },
      {
        title: { en: 'Ideal Power Conservation (100% Efficiency)', hi: 'आदर्श शक्ति संरक्षण (P_in = P_out)' },
        equation: 'V_p · I_p = V_s · I_s   ⇒   I_p / I_s = V_s / V_p = N_s / N_p',
        note: { en: 'Stepping voltage UP automatically steps current DOWN, slashing I²R transmission heat!', hi: 'वोल्टेज बढ़ाने पर धारा कम हो जाती है, जिससे I²R ऊर्जा हानि बहुत कम होती है।' },
      },
    ],
  },
  {
    id: 'deriv-lens-maker',
    simId: 'thin-lens',
    chapterId: 'ray-optics',
    chapterNumber: '24',
    classLevel: 'Class 12',
    marks: '5 Marks',
    diagram: 'lens-maker',
    title: { en: 'Lens Maker’s Formula for a Thin Double-Convex Lens', hi: 'पतले लेंस के लिए लेंस निर्माता सूत्र (Lens Maker’s Formula)' },
    finalFormula: '1 / f = (n₂ / n₁ − 1) · (1 / R₁ − 1 / R₂)',
    assumptions: [
      { en: 'Lens is thin (thickness neglected compared to u, v, R₁, R₂) with paraxial rays.', hi: 'लेंस अत्यंत पतला है और किरणें उपाक्षीय (paraxial) हैं।' },
    ],
    markingScheme: [
      { en: '1.5 Marks: Clean ray diagram showing intermediate image I₁ and final image I', hi: '1.5 अंक: मध्यवर्ती प्रतिबिंब I₁ व अंतिम प्रतिबिंब I का किरण आरेख' },
      { en: '2 Marks: Spherical refraction equations at surfaces 1 and 2 + addition', hi: '2 अंक: दोनों गोलीय पृष्ठों पर अपवर्तन समीकरण व उनका योग' },
      { en: '1.5 Marks: Setting u = ∞ ⇒ v = f to obtain Lens Maker’s Formula', hi: '1.5 अंक: u = ∞ पर v = f रखकर अंतिम सूत्र' },
    ],
    steps: [
      {
        title: { en: 'Refraction at First Spherical Surface (Radius R₁)', hi: 'प्रथम गोलीय पृष्ठ (त्रिज्या R₁) पर अपवर्तन' },
        equation: '(n₂ / v₁) − (n₁ / u) = (n₂ − n₁) / R₁',
        note: { en: 'First surface forms an intermediate image at distance v₁ inside the lens medium n₂.', hi: 'प्रथम पृष्ठ माध्यम n₂ में दूरी v₁ पर मध्यवर्ती प्रतिबिंब I₁ बनाता है।' },
      },
      {
        title: { en: 'Refraction at Second Spherical Surface (Radius R₂)', hi: 'द्वितीय गोलीय पृष्ठ (त्रिज्या R₂) पर अपवर्तन' },
        equation: '(n₁ / v) − (n₂ / v₁) = (n₁ − n₂) / R₂ = −(n₂ − n₁) / R₂',
        note: { en: 'I₁ serves as a virtual object for surface 2 (thin lens ⇒ same distance v₁).', hi: 'पतले लेंस के लिए I₁ द्वितीय पृष्ठ हेतु आभासी वस्तु का कार्य करता है।' },
      },
      {
        title: { en: 'Add Both Equations (n₂/v₁ Cancels)', hi: 'दोनों समीकरणों को जोड़ें (n₂/v₁ कट जाता है)' },
        equation: 'n₁ · (1/v − 1/u) = (n₂ − n₁) · (1/R₁ − 1/R₂)',
        note: { en: 'Divide both sides by surrounding medium refractive index n₁.', hi: 'दोनों ओर n₁ से भाग दें।' },
      },
      {
        title: { en: 'Apply Focus Condition (u → ∞ ⇒ v = f)', hi: 'फोकस शर्त (u → ∞ ⇒ v = f) लागू करें' },
        equation: '1 / f = (n₂₁ − 1) · (1/R₁ − 1/R₂)    and    1/f = 1/v − 1/u',
        note: { en: 'If immersed in a liquid with n_liquid > n_lens, a convex lens behaves as diverging!', hi: 'यदि द्रव का अपवर्तनांक लेंस से अधिक हो, तो उत्तल लेंस अवतल की तरह व्यवहार करता है।' },
      },
    ],
  },
  {
    id: 'deriv-prism-formula',
    simId: 'snell-prism-tir',
    chapterId: 'ray-optics',
    chapterNumber: '24',
    classLevel: 'Class 12',
    marks: '5 Marks',
    diagram: 'prism',
    title: { en: 'Refractive Index of a Glass Prism at Minimum Deviation', hi: 'न्यूनतम विचलन पर प्रिज्म के पदार्थ का अपवर्तनांक (प्रिज्म सूत्र)' },
    finalFormula: 'n = sin[(A + D_m) / 2] / sin(A / 2)',
    assumptions: [
      { en: 'Monochromatic ray passes through a triangular prism of refracting angle A.', hi: 'एकवर्णी प्रकाश किरण अपवर्तक कोण A वाले प्रिज्म से गुजरती है।' },
    ],
    markingScheme: [
      { en: '1.5 Marks: Ray diagram marking A, i, e, r₁, r₂, and deviation δ', hi: '1.5 अंक: प्रिज्म किरण आरेख व कोण अंकन' },
      { en: '2 Marks: Proving r₁ + r₂ = A and δ = i + e − A', hi: '2 अंक: r₁ + r₂ = A व δ = i + e − A सिद्ध करना' },
      { en: '1.5 Marks: Minimum deviation symmetry i = e, r₁ = r₂ and Snell’s Law', hi: '1.5 अंक: न्यूनतम विचलन शर्त व स्नेल नियम' },
    ],
    steps: [
      {
        title: { en: 'Prism Angle Geometry (Quadrilateral & Triangle)', hi: 'प्रिज्म ज्यामिति संबंध' },
        equation: 'r₁ + r₂ = A',
        note: { en: 'Normals at the two faces enclose angle (180° − A), so interior triangle gives r₁ + r₂ = A.', hi: 'अभिलंबों के त्रिभुज से r₁ + r₂ = A प्राप्त होता है।' },
      },
      {
        title: { en: 'Total Angle of Deviation (δ)', hi: 'कुल विचलन कोण (δ)' },
        equation: 'δ = (i − r₁) + (e − r₂) = (i + e) − (r₁ + r₂) = i + e − A',
        note: { en: 'Sum of individual deviations at the two refracting faces.', hi: 'दोनों पृष्ठों पर हुए विचलनों का योग।' },
      },
      {
        title: { en: 'Apply Minimum Deviation Symmetry (δ = D_m)', hi: 'न्यूनतम विचलन की सममित शर्त' },
        equation: 'i = e   and   r₁ = r₂ = r   ⇒   r = A / 2   and   i = (A + D_m) / 2',
        note: { en: 'At minimum deviation, the refracted ray inside the prism runs parallel to the base.', hi: 'न्यूनतम विचलन पर प्रिज्म के भीतर किरण आधार के समांतर होती है।' },
      },
      {
        title: { en: 'Substitute into Snell’s Law', hi: 'स्नेल के नियम में मान रखें' },
        equation: 'n = sin(i) / sin(r) = sin[ (A + D_m) / 2 ] / sin(A / 2)',
        note: { en: 'For a thin prism (small A), D_m ≈ (n − 1)·A.', hi: 'पतले प्रिज्म के लिए न्यूनतम विचलन D_m ≈ (n − 1)A।' },
      },
    ],
  },
  {
    id: 'deriv-ydse-fringe',
    simId: 'wave-optics',
    chapterId: 'wave-optics',
    chapterNumber: '25',
    classLevel: 'Class 12',
    marks: '5 Marks',
    diagram: 'ydse',
    title: { en: 'Fringe Width in Young’s Double-Slit Experiment (YDSE)', hi: 'यंग के द्वि-स्लिट प्रयोग में फ्रिंज चौड़ाई की व्युत्पत्ति' },
    finalFormula: 'β = (λ · D) / d',
    assumptions: [
      { en: 'Coherent monochromatic light of wavelength λ; screen distance D ≫ slit separation d.', hi: 'कला-संबद्ध एकवर्णी प्रकाश और पर्दे की दूरी D ≫ स्लिट अंतराल d।' },
    ],
    markingScheme: [
      { en: '1.5 Marks: YDSE geometry diagram with S₁, S₂, P(y), d, D', hi: '1.5 अंक: द्वि-स्लिट ज्यामितीय आरेख' },
      { en: '2 Marks: Path difference Δx = S₂P − S₁P ≈ y·d / D', hi: '2 अंक: पथांतर Δx = yd/D की व्युत्पत्ति' },
      { en: '1.5 Marks: Bright/dark fringe positions and fringe width β = λD/d', hi: '1.5 अंक: दीप्त/अदीप्त फ्रिंज व फ्रिंज चौड़ाई β' },
    ],
    steps: [
      {
        title: { en: 'Distances from Slits S₁ and S₂ to Screen Point P', hi: 'स्लिट S₁ व S₂ से पर्दे के बिंदु P की दूरियाँ' },
        equation: 'S₂P² − S₁P² = [D² + (y + d/2)²] − [D² + (y − d/2)²] = 2·y·d',
        note: { en: 'Expand both squares using Pythagoras theorem.', hi: 'पाइथागोरस प्रमेय से दोनों वर्गों का अंतर निकालें।' },
      },
      {
        title: { en: 'Path Difference Approximation (D ≫ d, y)', hi: 'पथांतर सन्निकटन (D ≫ d, y)' },
        equation: '(S₂P − S₁P)(S₂P + S₁P) = 2·y·d   ⇒   Δx = S₂P − S₁P ≈ (y · d) / D',
        note: { en: 'Since D is much larger than y and d, S₂P + S₁P ≈ 2D.', hi: 'D बहुत बड़ा होने से S₂P + S₁P ≈ 2D लिया जाता है।' },
      },
      {
        title: { en: 'Positions of Bright (Constructive) Fringes', hi: 'दीप्त (संपोषी) फ्रिंजों की स्थिति' },
        equation: 'Δx = n·λ   ⇒   y_n = (n · λ · D) / d   (n = 0, 1, 2, ...)',
        note: { en: 'Dark fringes occur at Δx = (n − ½)λ ⇒ y_n = (n − ½)λD/d.', hi: 'अदीप्त फ्रिंज (n − ½)λD/d पर बनती हैं।' },
      },
      {
        title: { en: 'Fringe Width (Spacing Between Consecutive Bright Fringes)', hi: 'फ्रिंज चौड़ाई (दो क्रमागत दीप्त फ्रिंजों की दूरी)' },
        equation: 'β = y_(n+1) − y_n = (λ · D) / d',
        note: { en: 'All bright and dark fringes share the exact same width β!', hi: 'सभी दीप्त व अदीप्त फ्रिंजों की चौड़ाई β समान होती है।' },
      },
    ],
  },
  {
    id: 'deriv-bohr-hydrogen',
    simId: 'atoms',
    chapterId: 'atoms',
    chapterNumber: '27',
    classLevel: 'Class 12',
    marks: '5 Marks',
    diagram: 'bohr-atom',
    title: { en: 'Bohr’s Radius & Quantized Energy Levels of Hydrogen Atom', hi: 'बोर त्रिज्या व हाइड्रोजन परमाणु के क्वांटमीकृत ऊर्जा स्तर' },
    finalFormula: 'r_n = 0.529·n² Å   |   E_n = −13.6 / n² eV',
    assumptions: [
      { en: 'Electron orbits proton in circular orbits with quantized angular momentum L = n·h/(2π).', hi: 'इलेक्ट्रॉन वृत्तीय कक्षा में घूमता है जिसका कोणीय संवेग L = nh/2π क्वांटमीकृत है।' },
    ],
    markingScheme: [
      { en: '1.5 Marks: Centripetal = Coulomb force + Bohr quantization mvr = nh/2π', hi: '1.5 अंक: अभिकेंद्र बल व बोर क्वांटमीकरण शर्त' },
      { en: '1.5 Marks: Eliminating v to obtain r_n ∝ n²', hi: '1.5 अंक: वेग v हटाकर त्रिज्या r_n निकालना' },
      { en: '2 Marks: Total energy E = K + U = −e²/(8πε₀r_n) = −13.6/n² eV', hi: '2 अंक: कुल ऊर्जा E_n = −13.6/n² eV सिद्ध करना' },
    ],
    steps: [
      {
        title: { en: 'Electrostatic Centripetal Force & Quantization Postulate', hi: 'अभिकेंद्र बल व बोर क्वांटमीकरण अभिगृहीत' },
        equation: 'm·v² / r = (1/4πε₀)·(e² / r²)    and    m·v·r = n·h / (2π)',
        note: { en: 'From quantization, v = n·h / (2π·m·r).', hi: 'क्वांटमीकरण से v = nh / (2πmr)।' },
      },
      {
        title: { en: 'Solve for nth Orbit Radius r_n', hi: 'n-वीं कक्षा की त्रिज्या r_n' },
        equation: 'r_n = (ε₀ · h² · n²) / (π · m · e²) = 0.529 · n² Å',
        note: { en: 'Orbit radii grow quadratically: r₁ : r₂ : r₃ = 1 : 4 : 9.', hi: 'कक्षा त्रिज्याएँ n² के अनुपात में (1 : 4 : 9) बढ़ती हैं।' },
      },
      {
        title: { en: 'Total Mechanical Energy E = K + U', hi: 'कुल यांत्रिक ऊर्जा E = K + U' },
        equation: 'K = +e²/(8πε₀r)   |   U = −e²/(4πε₀r)   ⇒   E_n = K + U = −e² / (8πε₀·r_n)',
        note: { en: 'Negative total energy confirms the electron is bound to the nucleus.', hi: 'ऋणात्मक कुल ऊर्जा दर्शाती है कि इलेक्ट्रॉन नाभिक से बद्ध है।' },
      },
      {
        title: { en: 'Substitute r_n into E_n', hi: 'E_n में r_n का मान रखें' },
        equation: 'E_n = −(m·e⁴) / (8·ε₀²·h²·n²) = −13.6 / n² eV',
        note: { en: 'Ground state E₁ = −13.6 eV; first excited state E₂ = −3.4 eV.', hi: 'मूल अवस्था E₁ = −13.6 eV और प्रथम उत्तेजित अवस्था E₂ = −3.4 eV।' },
      },
    ],
  },
  {
    id: 'deriv-photoelectric',
    simId: 'dual-nature',
    chapterId: 'dual-nature',
    chapterNumber: '26',
    classLevel: 'Class 12',
    marks: '3 Marks',
    diagram: 'photoelectric',
    title: { en: 'Einstein’s Photoelectric Equation & Stopping Potential Relation', hi: 'आइंस्टीन का प्रकाश-विद्युत समीकरण व निरोधी विभव संबंध' },
    finalFormula: 'K_max = h·ν − φ₀ = h·(ν − ν₀) = e·V₀',
    assumptions: [
      { en: 'Each photon of energy E = hν transfers all its energy to a single electron.', hi: 'प्रत्येक फोटॉन अपनी संपूर्ण ऊर्जा hν एक ही इलेक्ट्रॉन को देता है।' },
    ],
    markingScheme: [
      { en: '1 Mark: Photon energy split into work function φ₀ + K_max', hi: '1 अंक: ऊर्जा संरक्षण से आइंस्टीन समीकरण' },
      { en: '1 Mark: Threshold frequency φ₀ = hν₀ and stopping potential eV₀ = K_max', hi: '1 अंक: देहली आवृत्ति व निरोधी विभव संबंध' },
      { en: '1 Mark: Linear V₀ vs ν graph slope = h/e', hi: '1 अंक: V₀ बनाम ν ग्राफ़ की ढाल = h/e' },
    ],
    steps: [
      {
        title: { en: 'Quantum Energy Conservation for Single Photon Absorption', hi: 'एकल फोटॉन अवशोषण हेतु ऊर्जा संरक्षण' },
        equation: 'h·ν = φ₀ + K_max   ⇒   K_max = h·ν − φ₀',
        note: { en: 'Work function φ₀ is the minimum energy needed to free an electron from the metal surface.', hi: 'कार्य फलन φ₀ धातु सतह से इलेक्ट्रॉन निकालने की न्यूनतम ऊर्जा है।' },
      },
      {
        title: { en: 'Threshold Frequency (ν₀) Condition', hi: 'देहली आवृत्ति (ν₀) की शर्त' },
        equation: 'At ν = ν₀, K_max = 0   ⇒   φ₀ = h·ν₀   ⇒   K_max = h·(ν − ν₀)',
        note: { en: 'No photoemission occurs for ν < ν₀ regardless of light intensity!', hi: 'प्रकाश की तीव्रता कितनी भी हो, ν < ν₀ पर इलेक्ट्रॉन उत्सर्जन नहीं होता।' },
      },
      {
        title: { en: 'Stopping Potential V₀ vs Frequency ν', hi: 'निरोधी विभव V₀ व आवृत्ति ν संबंध' },
        equation: 'e·V₀ = h·ν − φ₀   ⇒   V₀ = (h/e)·ν − (φ₀/e)',
        note: { en: 'Straight-line plot of V₀ vs ν has universal slope h/e for every metal!', hi: 'V₀ बनाम ν ग्राफ़ की ढाल h/e सभी धातुओं के लिए समान होती है।' },
      },
    ],
  },
  {
    id: 'deriv-radioactive-decay',
    simId: 'nuclei',
    chapterId: 'nuclei',
    chapterNumber: '28',
    classLevel: 'Class 12',
    marks: '3 Marks',
    diagram: 'radioactive-decay',
    title: { en: 'Law of Radioactive Decay & Half-Life Relation (T½ = 0.693 / λ)', hi: 'रेडियोधर्मी क्षय का नियम और अर्ध-आयु संबंध' },
    finalFormula: 'N(t) = N₀ · e^(−λt)   |   T½ = ln(2) / λ ≈ 0.693 / λ',
    assumptions: [
      { en: 'Rate of nuclear disintegration is directly proportional to undecayed nuclei N.', hi: 'नाभिकीय विघटन की दर शेष सक्रिय नाभिकों N के अनुक्रमानुपाती है।' },
    ],
    markingScheme: [
      { en: '1 Mark: Differential law dN/dt = −λN', hi: '1 अंक: अवकल क्षय नियम dN/dt = −λN' },
      { en: '1 Mark: Integrating from N₀ to N to prove N = N₀·e^(−λt)', hi: '1 अंक: समाकलन द्वारा घातांकीय क्षय नियम' },
      { en: '1 Mark: Setting N = N₀/2 at t = T½ to obtain T½ = 0.693/λ', hi: '1 अंक: अर्ध-आयु T½ = 0.693/λ की व्युत्पत्ति' },
    ],
    steps: [
      {
        title: { en: 'Rutherford–Soddy Radioactive Decay Law', hi: 'रदरफोर्ड–सॉडी क्षय नियम' },
        equation: 'dN / dt = −λ · N   ⇒   dN / N = −λ · dt',
        note: { en: 'Decay constant λ is the probability of decay per nucleus per second.', hi: 'क्षय नियतांक λ प्रति सेकंड प्रति नाभिक क्षय की प्रायिकता है।' },
      },
      {
        title: { en: 'Integrate from Initial Count N₀ (t = 0) to N (t)', hi: 'N₀ से N तक समाकलन करें' },
        equation: 'ln(N / N₀) = −λ · t   ⇒   N(t) = N₀ · e^(−λ·t)',
        note: { en: 'Undecayed nuclei decrease exponentially with time.', hi: 'अक्षयित नाभिक समय के साथ चरघातांकीय रूप से घटते हैं।' },
      },
      {
        title: { en: 'Derive Half-Life T½ (When N = N₀ / 2)', hi: 'अर्ध-आयु T½ का सूत्र' },
        equation: 'N₀/2 = N₀·e^(−λ·T½)   ⇒   e^(λ·T½) = 2   ⇒   T½ = ln(2)/λ ≈ 0.693 / λ',
        note: { en: 'Mean life τ = 1/λ, so T½ = 0.693 · τ.', hi: 'औसत आयु τ = 1/λ होती है, अतः T½ = 0.693 τ।' },
      },
    ],
  },
];
