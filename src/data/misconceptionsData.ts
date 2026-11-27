import { BilingualText } from '../types/physics';

export interface PhysicsMisconception {
  id: string;
  category: 'Motion & Forces' | 'Energy & Rotation' | 'Thermal & Waves' | 'Electricity & Optics';
  title: BilingualText;
  wrongStatement: BilingualText;
  studentTrap: BilingualText;
  whyWrong: BilingualText;
  correctLaw: BilingualText;
  quickCheck: BilingualText;
  simId: string;
}

export const PHYSICS_MISCONCEPTIONS: PhysicsMisconception[] = [
  {
    id: 'm-speed-vel',
    category: 'Motion & Forces',
    title: { en: 'Speed vs Velocity on a Circular Track', hi: 'वृत्ताकार पथ पर चाल बनाम वेग' },
    wrongStatement: {
      en: '“A car driving steadily at 40 km/h around a circular roundabout has zero acceleration because its speed is constant.”',
      hi: '“गोल चक्कर पर 40 km/h की नियत चाल से चलती कार का त्वरण शून्य है क्योंकि चाल नहीं बदल रही।”',
    },
    studentTrap: { en: 'Confusing scalar speed with vector velocity.', hi: 'अदिश चाल और सदिश वेग में भ्रम।' },
    whyWrong: {
      en: 'Velocity has BOTH magnitude and direction. Even when speed is constant, direction changes continuously around the circle, creating an inward centripetal acceleration a_c = v²/r.',
      hi: 'वेग में परिमाण और दिशा दोनों होते हैं। चाल नियत रहने पर भी दिशा लगातार बदलती है, जिससे केंद्र की ओर अभिकेंद्र त्वरण a_c = v²/r उत्पन्न होता है।',
    },
    correctLaw: {
      en: 'Uniform Circular Motion is ALWAYS accelerated motion (a_c = v²/r directed toward the center).',
      hi: 'एकसमान वृत्तीय गति सदैव त्वरित गति होती है (a_c = v²/r केंद्र की ओर)।',
    },
    quickCheck: { en: 'After 1 full lap at 10 m/s: Average Speed = 10 m/s, Average Velocity = 0 m/s!', hi: '1 पूरे चक्कर के बाद: औसत चाल = 10 m/s, औसत वेग = 0 m/s!' },
    simId: 'speed-velocity',
  },
  {
    id: 'm-action-reaction',
    category: 'Motion & Forces',
    title: { en: 'Why Action & Reaction Don’t Cancel Out', hi: 'क्रिया और प्रतिक्रिया आपस में क्यों नहीं कटते?' },
    wrongStatement: {
      en: '“If every action has an equal and opposite reaction (F₁₂ = −F₂₁), then net force is always zero and nothing can ever accelerate!”',
      hi: '“यदि हर क्रिया की बराबर व विपरीत प्रतिक्रिया है, तो कुल बल शून्य होना चाहिए और कोई वस्तु चल ही नहीं सकती!”',
    },
    studentTrap: { en: 'Adding forces acting on two DIFFERENT bodies.', hi: 'दो अलग-अलग पिंडों पर लगने वाले बलों को जोड़ देना।' },
    whyWrong: {
      en: 'Action acts on Body B while reaction acts on Body A. Two forces can only cancel when they act on the SAME object.',
      hi: 'क्रिया पिंड B पर लगती है और प्रतिक्रिया पिंड A पर। बल केवल तभी निरस्त होते हैं जब वे एक ही पिंड पर लगें।',
    },
    correctLaw: {
      en: 'Draw the Free-Body Diagram (FBD) for ONE object at a time—only forces acting ON that body determine its acceleration.',
      hi: 'एक समय में एक ही पिंड का FBD बनाएँ—केवल उसी पिंड पर लगने वाले बल उसका त्वरण तय करते हैं।',
    },
    quickCheck: { en: 'A horse accelerates because ground pushes the horse forward harder than the cart pulls it back.', hi: 'घोड़ा इसलिए आगे बढ़ता है क्योंकि ज़मीन उसे गाड़ी के खिंचाव से अधिक आगे धकेलती है।' },
    simId: 'newtons-force',
  },
  {
    id: 'm-mass-weight',
    category: 'Motion & Forces',
    title: { en: 'Mass vs Weight on the Moon', hi: 'चंद्रमा पर द्रव्यमान बनाम भार' },
    wrongStatement: {
      en: '“An astronaut of mass 60 kg becomes 10 kg on the Moon because gravity is 1/6th of Earth’s.”',
      hi: '“60 kg द्रव्यमान का अंतरिक्ष यात्री चंद्रमा पर 10 kg का हो जाता है क्योंकि वहाँ गुरुत्व 1/6 है।”',
    },
    studentTrap: { en: 'Treating kg (mass) as Newtons (weight).', hi: 'द्रव्यमान (kg) और भार (N) को एक समझना।' },
    whyWrong: {
      en: 'Mass (kg) measures quantity of matter and inertia—it NEVER changes with location. Weight W = m·g (in Newtons) drops to 1/6th on the Moon.',
      hi: 'द्रव्यमान (kg) पदार्थ की मात्रा है जो स्थान बदलने पर कभी नहीं बदलता। केवल भार W = mg (न्यूटन में) 1/6 रह जाता है।',
    },
    correctLaw: {
      en: 'On Earth: m = 60 kg, W = 588 N. On Moon: m = 60 kg, W = 98 N.',
      hi: 'पृथ्वी पर m = 60 kg, W = 588 N; चंद्रमा पर भी m = 60 kg, पर W = 98 N।',
    },
    quickCheck: { en: 'In deep space (g = 0), Weight = 0 N, yet punching a 60 kg boulder still hurts because Mass = 60 kg!', hi: 'अंतरिक्ष में भार 0 N है, पर द्रव्यमान (जड़त्व) 60 kg ही रहता है।' },
    simId: 'gravitation',
  },
  {
    id: 'm-work-circular',
    category: 'Energy & Rotation',
    title: { en: 'Work Done by Centripetal Force', hi: 'अभिकेंद्र बल द्वारा किया गया कार्य' },
    wrongStatement: {
      en: '“Earth does enormous work every second pulling the Moon around its orbit because both force and distance are huge.”',
      hi: '“पृथ्वी चंद्रमा को कक्षा में घुमाने में हर सेकंड बहुत अधिक कार्य करती है क्योंकि बल व दूरी दोनों विशाल हैं।”',
    },
    studentTrap: { en: 'Forgetting cos θ in W = F·d·cos θ.', hi: 'W = F·d·cos θ में cos θ भूल जाना।' },
    whyWrong: {
      en: 'Centripetal force always acts radially inward at 90° to instantaneous displacement. Since cos 90° = 0, instantaneous work is strictly zero!',
      hi: 'अभिकेंद्र बल सदैव विस्थापन के 90° लंबवत लगता है और cos 90° = 0 होने से कार्य शून्य होता है।',
    },
    correctLaw: {
      en: 'W = F·d·cos(90°) = 0 J — any force perpendicular to velocity changes direction only, never kinetic energy.',
      hi: 'वेग के लंबवत बल केवल दिशा बदलता है, गतिज ऊर्जा नहीं (W = 0)।',
    },
    quickCheck: { en: 'Same reason a magnetic Lorentz force F = q(v × B) NEVER does work on a moving charge!', hi: 'इसी कारण चुंबकीय बल F = q(v × B) आवेश पर कभी कार्य नहीं करता!' },
    simId: 'work-power-basic',
  },
  {
    id: 'm-momentum-ke',
    category: 'Energy & Rotation',
    title: { en: 'Same Momentum ≠ Same Kinetic Energy', hi: 'समान संवेग ≠ समान गतिज ऊर्जा' },
    wrongStatement: {
      en: '“If a bullet and a heavy truck have the same linear momentum p, they carry the same kinetic energy.”',
      hi: '“यदि गोली और भारी ट्रक का संवेग p समान हो, तो उनकी गतिज ऊर्जा भी समान होगी।”',
    },
    studentTrap: { en: 'Ignoring inverse mass dependence in K = p² / (2m).', hi: 'K = p²/(2m) में द्रव्यमान के व्युत्क्रमानुपाती संबंध को न देखना।' },
    whyWrong: {
      en: 'Since K = p²/(2m), for equal momentum p, the LIGHTER body has vastly greater kinetic energy (K ∝ 1/m)!',
      hi: 'K = p²/(2m) के अनुसार समान संवेग होने पर हल्के पिंड की गतिज ऊर्जा बहुत अधिक होती है (K ∝ 1/m)।',
    },
    correctLaw: {
      en: 'Equal p ⇒ K₁ / K₂ = m₂ / m₁ (lighter body has higher K). Equal K ⇒ p = √(2mK) (heavier body has higher p).',
      hi: 'समान p पर हल्के पिंड की K अधिक; समान K पर भारी पिंड का संवेग p अधिक होता है।',
    },
    quickCheck: { en: 'When a gun fires, bullet and gun get equal & opposite momentum, yet the light bullet gets >99% of the kinetic energy!', hi: 'बंदूक चलने पर गोली व बंदूक का संवेग बराबर होता है, पर 99% गतिज ऊर्जा हल्की गोली को मिलती है।' },
    simId: 'impulse-momentum',
  },
  {
    id: 'm-rolling-mass',
    category: 'Energy & Rotation',
    title: { en: 'Does a Heavier Ball Roll Faster Down an Incline?', hi: 'क्या भारी गोला आनत तल पर तेज़ लुढ़कता है?' },
    wrongStatement: {
      en: '“A 10 kg solid sphere rolls down a ramp much faster than a 1 kg solid sphere, and a hollow ring ties with a solid disc of the same mass.”',
      hi: '“10 kg का ठोस गोला 1 kg के गोले से तेज़ लुढ़कता है, और समान द्रव्यमान के वलय व चकती साथ पहुँचते हैं।”',
    },
    studentTrap: { en: 'Thinking mass M controls rolling acceleration instead of geometry factor k²/R².', hi: 'आकृति गुणांक k²/R² की जगह द्रव्यमान M को कारण मानना।' },
    whyWrong: {
      en: 'In a = g sin θ / (1 + k²/R²), BOTH mass M and radius R cancel out! What matters is mass distribution: solid sphere (0.4) beats disc (0.5) which beats ring (1.0).',
      hi: 'a = g sinθ / (1 + k²/R²) में M और R दोनों कट जाते हैं! केवल द्रव्यमान का वितरण तय करता है कि कौन जीतेगा।',
    },
    correctLaw: {
      en: 'Every solid sphere ties regardless of mass or radius; a solid disc ALWAYS beats a thin ring.',
      hi: 'सभी ठोस गोले साथ पहुँचते हैं, और ठोस चकती हमेशा पतले वलय को हरा देती है।',
    },
    quickCheck: { en: 'Ratio of accelerations: Solid Sphere (5/7 g sinθ) > Disc (2/3 g sinθ) > Ring (1/2 g sinθ).', hi: 'त्वरण क्रम: ठोस गोला > चकती > खोखला गोला > वलय।' },
    simId: 'moment-of-inertia',
  },
  {
    id: 'm-heat-temp',
    category: 'Thermal & Waves',
    title: { en: 'Heat vs Temperature & Phase Change', hi: 'ऊष्मा बनाम तापमान व अवस्था परिवर्तन' },
    wrongStatement: {
      en: '“Adding heat to a substance ALWAYS increases its temperature.”',
      hi: '“किसी पदार्थ को ऊष्मा देने से उसका तापमान सदैव बढ़ता है।”',
    },
    studentTrap: { en: 'Forgetting latent heat during melting or boiling.', hi: 'गलन या क्वथन के समय गुप्त ऊष्मा को भूलना।' },
    whyWrong: {
      en: 'During a phase change (ice melting at 0°C or water boiling at 100°C), supplied heat breaks intermolecular bonds (Q = mL) while temperature stays strictly constant!',
      hi: 'अवस्था परिवर्तन (0°C पर बर्फ पिघलना या 100°C पर उबलना) में दी गई गुप्त ऊष्मा अणु बंध तोड़ती है और ताप नियत रहता है।',
    },
    correctLaw: {
      en: 'Heat is energy in transit (J); Temperature measures average molecular kinetic energy (K).',
      hi: 'ऊष्मा स्थानांतरित ऊर्जा (J) है; तापमान औसत अणु गतिज ऊर्जा (K) का माप है।',
    },
    quickCheck: { en: 'In an isothermal expansion of an ideal gas, heat ΔQ > 0 enters yet ΔT = 0 because all heat converts to work W!', hi: 'समतापी प्रसार में ΔQ > 0 होने पर भी ΔT = 0 रहता है क्योंकि संपूर्ण ऊष्मा कार्य W बन जाती है।' },
    simId: 'thermodynamics',
  },
  {
    id: 'm-wave-speed',
    category: 'Thermal & Waves',
    title: { en: 'Does Doubling Frequency Double Wave Speed?', hi: 'क्या आवृत्ति दोगुनी करने पर तरंग वेग दोगुना हो जाता है?' },
    wrongStatement: {
      en: '“Since v = f·λ, plucking a guitar string at twice the frequency doubles the speed of the wave on the string.”',
      hi: '“चूँकि v = f·λ है, इसलिए आवृत्ति दोगुनी करने पर तरंग का वेग दोगुना हो जाता है।”',
    },
    studentTrap: { en: 'Treating v as dependent on source frequency f instead of the medium.', hi: 'वेग v को माध्यम के बजाय आवृत्ति f पर निर्भर मानना।' },
    whyWrong: {
      en: 'Wave speed v is fixed strictly by medium properties (e.g. √(T/μ) on a string or √(γRT/M) in air). Doubling f halves wavelength λ so v stays unchanged!',
      hi: 'तरंग वेग v केवल माध्यम के गुणों पर निर्भर करता है। आवृत्ति f दोगुनी करने पर तरंगदैर्ध्य λ आधा हो जाता है और v नियत रहता है।',
    },
    correctLaw: {
      en: 'Source sets f; Medium sets v; Wavelength adjusts as λ = v / f.',
      hi: 'स्रोत f तय करता है; माध्यम v तय करता है; और λ = v/f समायोजित होता है।',
    },
    quickCheck: { en: 'When light enters glass from air, frequency f stays constant while both speed v and wavelength λ decrease by factor n.', hi: 'वायु से काँच में जाने पर प्रकाश की आवृत्ति f नहीं बदलती, केवल v और λ घटते हैं।' },
    simId: 'wave-speed-basic',
  },
  {
    id: 'm-emf-voltage',
    category: 'Electricity & Optics',
    title: { en: 'Battery EMF vs Terminal Potential Difference', hi: 'सेल का विद्युत वाहक बल (EMF) बनाम टर्मिनल विभवांतर' },
    wrongStatement: {
      en: '“A 12 V battery always supplies exactly 12 V across its terminals no matter how much current is drawn.”',
      hi: '“12 V की बैटरी से कितनी भी धारा ली जाए, उसके सिरों पर विभवांतर हमेशा 12 V ही रहता है।”',
    },
    studentTrap: { en: 'Ignoring internal resistance r inside real cells.', hi: 'सेल के आंतरिक प्रतिरोध r की अनदेखी करना।' },
    whyWrong: {
      en: 'Every real cell has internal resistance r. While discharging current I, potential drops inside the cell by I·r, leaving terminal voltage V = E − I·r < E.',
      hi: 'वास्तविक सेल का आंतरिक प्रतिरोध r होता है; धारा I लेने पर टर्मिनल विभवांतर घटकर V = E − Ir रह जाता है।',
    },
    correctLaw: {
      en: 'Open circuit: V = E. Discharging: V = E − I·r. Charging: V = E + I·r (greater than EMF!).',
      hi: 'खुला परिपथ: V = E; निरावेशित: V = E − Ir; आवेशित करते समय: V = E + Ir।',
    },
    quickCheck: { en: 'Car headlights dim briefly while starting the engine because huge starter current spikes I·r!', hi: 'इंजन स्टार्ट करते समय भारी धारा से I·r बढ़ने के कारण कार की हेडलाइट थोड़ी धीमी हो जाती है।' },
    simId: 'wheatstone-bridge',
  },
  {
    id: 'm-res-resistivity',
    category: 'Electricity & Optics',
    title: { en: 'Stretching a Wire: Resistance vs Resistivity', hi: 'तार खींचने पर प्रतिरोध बनाम प्रतिरोधकता' },
    wrongStatement: {
      en: '“Stretching a copper wire to double its length doubles its resistance R and also doubles its resistivity ρ.”',
      hi: '“ताँबे के तार को खींचकर लंबाई दोगुनी करने पर प्रतिरोध R और प्रतिरोधकता ρ दोनों दोगुने हो जाते हैं।”',
    },
    studentTrap: { en: 'Forgetting volume conservation (A halves) and material invariance of ρ.', hi: 'आयतन संरक्षण (क्षेत्रफल आधा होना) व ρ के पदार्थ गुण को भूलना।' },
    whyWrong: {
      en: 'Resistivity ρ depends ONLY on material and temperature—it stays unchanged! Meanwhile stretching to 2L halves area to A/2 (constant volume), making R′ = ρ(2L)/(A/2) = 4R!',
      hi: 'प्रतिरोधकता ρ केवल पदार्थ व ताप पर निर्भर है अतः अपरिवर्तित रहती है। लंबाई 2L होने पर क्षेत्रफल A/2 हो जाता है, जिससे प्रतिरोध 4 गुना (4R) हो जाता है!',
    },
    correctLaw: {
      en: 'Stretching wire by factor n at constant volume multiplies Resistance by n² (R′ = n²R) while ρ stays constant.',
      hi: 'तार को n गुना खींचने पर R′ = n²R हो जाता है और ρ नियत रहता है।',
    },
    quickCheck: { en: 'Cut a 10 Ω wire in half instead of stretching → each piece is 5 Ω (area A didn’t change).', hi: 'तार को खींचने की बजाय बीच से काटने पर प्रतिरोध आधा (5 Ω) होता है।' },
    simId: 'ohms-law',
  },
  {
    id: 'm-current-consumed',
    category: 'Electricity & Optics',
    title: { en: 'Is Current “Used Up” Inside a Bulb?', hi: 'क्या बल्ब के अंदर विद्युत धारा खर्च हो जाती है?' },
    wrongStatement: {
      en: '“Current entering a bulb is larger than the current leaving it because the bulb consumes electricity to glow.”',
      hi: '“बल्ब में प्रवेश करने वाली धारा बाहर निकलने वाली धारा से अधिक होती है क्योंकि बल्ब बिजली खर्च करता है।”',
    },
    studentTrap: { en: 'Confusing charge conservation (current I) with energy conversion (voltage drop V).', hi: 'आवेश संरक्षण (धारा I) और ऊर्जा व्यय (वोल्टेज पतन V) में भ्रम।' },
    whyWrong: {
      en: 'Charge is strictly conserved! The exact same number of coulombs per second (current I) leave the bulb as enter it. What gets converted to light & heat is electrical POTENTIAL ENERGY (voltage drop ΔV).',
      hi: 'आवेश सदैव संरक्षित रहता है—बल्ब में जितनी धारा प्रवेश करती है, उतनी ही बाहर निकलती है। केवल विद्युत ऊर्जा (विभवांतर V) प्रकाश व ऊष्मा में बदलती है।',
    },
    correctLaw: {
      en: 'Kirchhoff’s Current Law: I_in = I_out in every series component; energy dissipated is P = V·I.',
      hi: 'श्रेणीक्रम में हर घटक में धारा समान रहती है; व्यय शक्ति P = V·I है।',
    },
    quickCheck: { en: 'An ammeter placed before a resistor reads the exact same value as one placed after it!', hi: 'प्रतिरोध से पहले या बाद में लगा अमीटर एक ही पाठ्यांक देता है।' },
    simId: 'charge-current-power',
  },
  {
    id: 'm-mirror-lens-half',
    category: 'Electricity & Optics',
    title: { en: 'Covering Half of a Convex Lens', hi: 'उत्तल लेंस का आधा भाग ढकने पर प्रतिबिंब' },
    wrongStatement: {
      en: '“If you cover the bottom half of a convex lens with black paper, the bottom half of the image disappears.”',
      hi: '“उत्तल लेंस का निचला आधा भाग काले कागज़ से ढकने पर प्रतिबिंब का आधा हिस्सा गायब हो जाता है।”',
    },
    studentTrap: { en: 'Assuming top of object only uses top half of lens.', hi: 'यह मान लेना कि वस्तु के ऊपरी हिस्से की किरणें केवल लेंस के ऊपरी भाग से जाती हैं।' },
    whyWrong: {
      en: 'Every single point on the object sends rays through ALL parts of the lens. Covering half the lens still lets rays from the entire object pass through the uncovered half—so the FULL image forms at half the brightness!',
      hi: 'वस्तु के हर बिंदु से किरणें लेंस के पूरे हिस्से से गुजरती हैं। आधा लेंस ढकने पर पूरा प्रतिबिंब बनता है, बस उसकी चमक (तीव्रता) आधी रह जाती है।',
    },
    correctLaw: {
      en: 'Full image remains intact at the exact same position v; only image intensity drops proportionally to open aperture area.',
      hi: 'प्रतिबिंब पूर्ण व उसी स्थान पर बनता है, केवल तीव्रता घट जाती है।',
    },
    quickCheck: { en: 'Same holds for a concave mirror with half its aperture covered.', hi: 'अवतल दर्पण का आधा भाग ढकने पर भी यही नियम लागू होता है।' },
    simId: 'thin-lens',
  },
];
