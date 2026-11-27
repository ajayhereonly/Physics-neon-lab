import { BilingualText, LiveSimTelemetry, PhysicsSimulation, SceneMode, SimplicityLevel } from '../types/physics';

export type RealLifeArchetype =
  | 'drifting-car-gyro'
  | 'highway-car'
  | 'f1-banked-turn'
  | 'cricket-bat-impact'
  | 'car-crash-bumper'
  | 'roller-coaster'
  | 'submarine-buoyancy'
  | 'airplane-wing'
  | 'eyeglasses-reading'
  | 'ambulance-doppler'
  | 'concert-flute'
  | 'city-tv-tower'
  | 'power-substation'
  | 'solar-roof'
  | 'cannon-cricket-loft'
  | 'river-ferry'
  | 'carousel-merry'
  | 'elevator-crane'
  | 'tire-rolling-hill'
  | 'ice-skater-spin'
  | 'satellite-orbit'
  | 'bridge-cable-stretch'
  | 'raindrop-parachute'
  | 'plant-stem-wick'
  | 'railway-track-gap'
  | 'hot-tea-cooling'
  | 'car-engine-piston'
  | 'power-plant-turbine'
  | 'pressure-cooker-gas'
  | 'car-shock-absorber'
  | 'grandfather-clock'
  | 'ocean-harbor-waves'
  | 'guitar-string-wave'
  | 'lightning-cloud'
  | 'camera-flash-cap'
  | 'electric-kettle-grid'
  | 'home-circuit-panel'
  | 'compass-earth-field'
  | 'mri-cyclotron-beam'
  | 'wind-turbine-gen'
  | 'radio-tuner-lc'
  | 'camera-projector'
  | 'diamond-fiber-cable'
  | 'stargazing-observatory'
  | 'soap-bubble-slits'
  | 'polarized-sunglasses'
  | 'electron-microscope'
  | 'neon-sign-atom'
  | 'nuclear-power-core'
  | 'medical-tracer-decay'
  | 'led-phone-charger'
  | 'smart-home-logic'
  | 'audio-amplifier'
  | 'precision-caliper';

export interface RealLifeScenarioSpec {
  title: BilingualText;
  archetype: RealLifeArchetype;
  /** Level 1: Exam/Board precision, Level 2: Everyday friendly, Level 3: Super simple analogy */
  levels: {
    1: BilingualText;
    2: BilingualText;
    3: BilingualText;
  };
  realLifeStory: BilingualText;
}

const SCENARIO_OVERRIDES: Record<string, RealLifeScenarioSpec> = {
  'angular-momentum': {
    title: { en: 'Drifting Sports Car Turn & Spinning Wheel Gyro', hi: 'ड्रिफ्ट करती स्पोर्ट्स कार और घूमता पहिया (गायरो)' },
    archetype: 'drifting-car-gyro',
    levels: {
      1: {
        en: 'Angular momentum L = Iω remains conserved when net external torque is zero. Reducing the radius r lowers moment of inertia I = mr², forcing angular velocity ω to rise inversely so Iω stays constant.',
        hi: 'जब बाहरी बलाघूर्ण शून्य हो, तो कोणीय संवेग L = Iω नियत रहता है। त्रिज्या r घटने पर जड़त्व आघूर्ण I = mr² घटता है, इसलिए कोणीय वेग ω बढ़ जाता है।',
      },
      2: {
        en: 'When the mass pulls closer to the center, it becomes easier to spin, so the rotation speeds up automatically to keep the total spin momentum unchanged.',
        hi: 'जब द्रव्यमान केंद्र के पास आता है तो घूमना आसान हो जाता है, इसलिए कुल घुमाव बनाए रखने के लिए गति अपने आप तेज हो जाती है।',
      },
      3: {
        en: 'Think of a spinning office chair or a sports car tightening a drift circle: pull your arms or turn radius inward and you immediately whip around much faster!',
        hi: 'घूमती कुर्सी या मोड़ पर स्पोर्ट्स कार की तरह सोचें: जैसे ही हाथ या मोड़ की त्रिज्या अंदर खींचते हैं, चक्कर तुरंत बहुत तेज हो जाते हैं!',
      },
    },
    realLifeStory: {
      en: 'Watch the sports car tighten its turn radius while its spinning flywheel speeds up—just like an ice skater pulling in their arms or a car taking a tight hairpin drift.',
      hi: 'देखें कैसे मोड़ छोटा करते ही स्पोर्ट्स कार और उसका फ्लाईव्हील तेजी से घूमता है—ठीक वैसे ही जैसे आइस स्केटर हाथ मोड़कर तेज घूमता है।',
    },
  },
  'speed-velocity': {
    title: { en: 'Highway Sports Car Track & Speedometer', hi: 'हाईवे स्पोर्ट्स कार ट्रैक और स्पीडोमीटर' },
    archetype: 'highway-car',
    levels: {
      1: {
        en: 'Average speed equals total path distance divided by time, whereas average velocity equals straight-line displacement divided by time. Completing a full circular lap yields zero net displacement and zero average velocity.',
        hi: 'औसत चाल कुल दूरी बटा समय है, जबकि औसत वेग सीधी विस्थापन दूरी बटा समय है। पूरा चक्कर लगाने पर विस्थापन और औसत वेग शून्य हो जाते हैं।',
      },
      2: {
        en: 'The car speedometer always shows distance covered along the curved road, while velocity only cares about the straight shortcut arrow from Start to where the car is right now.',
        hi: 'कार का स्पीडोमीटर हमेशा पूरी चली गई सड़क की दूरी दिखाता है, जबकि वेग केवल शुरुआत से अभी तक के सीधे शॉर्टकट तीर को देखता है।',
      },
      3: {
        en: 'If you drive a sports car all the way around a roundabout back to your starting gate, your odometer ticked up kilometers, yet you ended up right where you started—zero displacement!',
        hi: 'अगर आप गोल चक्कर लगाकर वापस उसी गेट पर आ जाएँ, तो गाड़ी के मीटर ने दूरी तो चली, पर आप वहीं के वहीं हैं—यानी विस्थापन शून्य है!',
      },
    },
    realLifeStory: {
      en: 'A sports car cruising around a circular highway track demonstrates why your odometer measures path length while GPS straight-line distance shrinks back to zero at the finish line.',
      hi: 'गोल हाईवे ट्रैक पर चलती स्पोर्ट्स कार दिखाती है कि मीटर पूरी दूरी मापता है, पर वापस शुरुआती बिंदु पर पहुँचते ही सीधा विस्थापन शून्य हो जाता है।',
    },
  },
  'motion-1d': {
    title: { en: 'Highway Car Acceleration & Braking', hi: 'हाईवे पर कार का त्वरण और ब्रेकिंग' },
    archetype: 'highway-car',
    levels: {
      1: {
        en: 'Under constant acceleration a, velocity changes linearly as v = u + at while displacement grows quadratically as s = ut + ½at², giving a parabolic position-time graph.',
        hi: 'नियत त्वरण a में वेग v = u + at के अनुसार रैखिक रूप से बदलता है और विस्थापन s = ut + ½at² के अनुसार परवलयिक रूप से बढ़ता है।',
      },
      2: {
        en: 'Pressing the accelerator adds the same extra speed every second, which makes the car cover a bigger jump in distance during each new second.',
        hi: 'एक्सीलेटर दबाने पर हर सेकंड एक जैसी अतिरिक्त चाल जुड़ती है, जिससे कार हर अगले सेकंड में पहले से ज्यादा दूरी तय करती है।',
      },
      3: {
        en: 'Imagine pressing a car gas pedal steadily on an empty highway: in second one you roll a few meters, and by second five you are zooming past lampposts!',
        hi: 'खाली हाईवे पर लगातार एक्सीलेटर दबाने जैसा है: पहले सेकंड में थोड़ी दूरी चलती है, और पाँचवें सेकंड तक कार बहुत तेज भागने लगती है!',
      },
    },
    realLifeStory: {
      en: 'A highway sports car accelerating from a toll booth—or slamming its brakes with negative acceleration—traces exact kinematic equations in real time.',
      hi: 'टोल बूथ से रफ्तार पकड़ती या ब्रेक लगाती हाईवे कार गति के समीकरणों को सीधे दिखाती है।',
    },
  },
  'banking-roads': {
    title: { en: 'F1 Race Car on a Banked Track Curve', hi: 'बैंक किए हुए ट्रैक मोड़ पर F1 रेस कार' },
    archetype: 'f1-banked-turn',
    levels: {
      1: {
        en: 'Tilting the highway at banking angle θ directs a horizontal component of the normal reaction N sinθ inward, providing centripetal force mv²/R even without tire friction.',
        hi: 'सड़क को कोण θ पर झुकाने से अभिलंब बल का क्षैतिज घटक N sinθ केंद्र की ओर अभिकेंद्रीय बल mv²/R देता है।',
      },
      2: {
        en: 'A tilted road pushes the race car sideways toward the inside of the turn so it does not skid off even at very high speed.',
        hi: 'झुकी हुई सड़क रेस कार को मोड़ के अंदर की ओर सहारा देती है जिससे तेज रफ्तार पर भी कार फिसलती नहीं।',
      },
      3: {
        en: 'Like a marble spinning inside a slanted bowl, the sloped race track cradles the car so it can zoom around sharp curves safely!',
        hi: 'कटोरे के तिरछे किनारे पर घूमते कंचे की तरह, झुका हुआ ट्रैक कार को सुरक्षित रूप से मोड़ पर घुमा लेता है!',
      },
    },
    realLifeStory: {
      en: 'Formula 1 circuits and mountain expressways bank their curves upward on the outer edge so cars can corner fast without relying only on tire grip.',
      hi: 'F1 रेस ट्रैक और पहाड़ी हाईवे के मोड़ बाहर से ऊँचे बनाए जाते हैं ताकि कारें बिना फिसले तेज मुड़ सकें।',
    },
  },
  'eye-defects': {
    title: { en: 'Reading Book & Highway Sign through Eyeglasses', hi: 'चश्मे से किताब पढ़ना और हाईवे बोर्ड देखना' },
    archetype: 'eyeglasses-reading',
    levels: {
      1: {
        en: 'In myopia, distant rays converge in front of the retina and require a diverging concave lens of power P = −1/d_far. In hypermetropia, near rays focus behind the retina and need a converging convex lens.',
        hi: 'निकट दृष्टिदोष में दूर की किरणें रेटिना से पहले मिलती हैं जिसे अवतल लेंस ठीक करता है। दूर दृष्टिदोष में पास की किरणें रेटिना के पीछे मिलती हैं जिसे उत्तल लेंस ठीक करता है।',
      },
      2: {
        en: 'Your eye lens bends incoming light to paint a sharp picture right on the retina screen at the back. Glasses simply pre-bend the light slightly so the focal spot lands cleanly on the retina.',
        hi: 'आँख का लेंस प्रकाश को मोड़कर रेटिना के पर्दे पर साफ तस्वीर बनाता है। चश्मा किरणों को थोड़ा पहले ही सही कोण पर मोड़ देता है ताकि फोकस ठीक रेटिना पर बने।',
      },
      3: {
        en: 'Think of a movie projector that is slightly out of focus: a minus concave lens nudges the focus backward onto the screen, while a plus convex lens pulls it forward until the letters turn crisp!',
        hi: 'धुंधले प्रोजेक्टर की तरह सोचें: माइनस अवतल चश्मा फोकस को पीछे रेटिना पर खिसकाता है और प्लस उत्तल चश्मा उसे आगे खींचकर अक्षर एकदम साफ कर देता है!',
      },
    },
    realLifeStory: {
      en: 'See how wearing the exact prescription eyeglasses turns a blurry highway road sign or a close-up book page razor-sharp right on the retina.',
      hi: 'देखें कैसे सही नंबर का चश्मा पहनते ही धुंधला हाईवे बोर्ड या किताब के अक्षर रेटिना पर बिल्कुल साफ दिखने लगते हैं।',
    },
  },
  'doppler-effect': {
    title: { en: 'Passing Emergency Ambulance Siren', hi: 'गुजरती एम्बुलेंस का सायरन' },
    archetype: 'ambulance-doppler',
    levels: {
      1: {
        en: 'Relative motion compresses wavefronts ahead of the moving source and stretches them behind, shifting observed frequency according to f_obs = f₀(v ± v_o)/(v ∓ v_s).',
        hi: 'स्रोत की गति से आगे की ओर तरंगाग्र सिकुड़ जाते हैं और पीछे फैल जाते हैं, जिससे सुनाई देने वाली आवृत्ति f_obs = f₀(v ± v_o)/(v ∓ v_s) के अनुसार बदल जाती है।',
      },
      2: {
        en: 'As the ambulance rushes toward you, each sound crest arrives sooner, making the pitch sound higher; the instant it passes you, the crests spread out and the siren drops in pitch.',
        hi: 'जब एम्बुलेंस पास आती है तो ध्वनि तरंगें दबकर ऊँची तीखी लगती हैं; और जैसे ही वह आगे निकल जाती है, तरंगें फैलने से आवाज भारी हो जाती है।',
      },
      3: {
        en: 'That famous "WEE-ooo" sound when a siren zooms past you happens because the speeding truck bunches up its own sound ripples in front and stretches them behind!',
        hi: 'एम्बुलेंस के गुजरते समय जो "ईई-ऊऊ" आवाज सुनाई देती है, वह इसलिए क्योंकि तेज चलती गाड़ी आगे की ध्वनि लहरों को दबा देती है और पीछे फैला देती है!',
      },
    },
    realLifeStory: {
      en: 'An ambulance racing past a roadside listener compresses sound ripples in front and stretches them behind—enable Sound to hear the real pitch drop live.',
      hi: 'सड़क किनारे खड़े व्यक्ति के पास से गुजरती एम्बुलेंस आगे ध्वनि तरंगें दबाती है और पीछे फैलाती है—ध्वनि चालू कर असली बदलाव सुनें।',
    },
  },
  'organ-pipes-beats': {
    title: { en: 'Concert Flute & Bamboo Bansuri Harmonics', hi: 'कंसर्ट बाँसुरी के संनादी स्वर और विस्पंद' },
    archetype: 'concert-flute',
    levels: {
      1: {
        en: 'An open organ pipe supports all integer harmonics f_n = nv/(2L) with antinodes at both ends, whereas a closed pipe supports only odd harmonics f_n = (2k−1)v/(4L).',
        hi: 'खुले आर्गन पाइप में सभी पूर्णांक संनादी f_n = nv/(2L) बनते हैं, जबकि बंद पाइप में केवल विषम संनादी f_n = (2k−1)v/(4L) बनते हैं।',
      },
      2: {
        en: 'Shortening the vibrating air column raises the musical note, while covering one end cuts the base pitch in half and changes the flute tone.',
        hi: 'हवा के स्तंभ की लंबाई कम करने से सुर ऊँचा हो जाता है, और एक सिरा बंद करने से मूल आवृत्ति आधी होकर ध्वनि का रंग बदल जाता है।',
      },
      3: {
        en: 'Blowing across a bamboo flute traps bouncing air ripples inside the tube: a short tube makes a bright high whistle, while a long tube sings a deep low note!',
        hi: 'बाँसुरी में फूँक मारने पर हवा की लहरें अंदर टकराकर गूँजती हैं: छोटी बाँसुरी तीखी ऊँची आवाज और लंबी बाँसुरी गहरी मीठी आवाज निकालती है!',
      },
    },
    realLifeStory: {
      en: 'A concert flute changes musical pitch by shortening or lengthening the standing air wave trapped inside its hollow bore.',
      hi: 'बाँसुरी के छेद खोलने या बंद करने से अंदर की अप्रगामी वायु तरंग की लंबाई बदलती है और अलग-अलग सुर बजते हैं।',
    },
  },
  'transformer': {
    title: { en: 'City Power Grid Substation Transformer', hi: 'शहर का पावर ग्रिड सबस्टेशन ट्रांसफार्मर' },
    archetype: 'power-substation',
    levels: {
      1: {
        en: 'By Faraday induction across a laminated iron core, V_s/V_p = N_s/N_p. For an ideal transformer, power V_p I_p = V_s I_s is conserved, so stepping voltage up reduces current proportionally.',
        hi: 'लैमिनेटेड लौह क्रोड में फैराडे प्रेरण से V_s/V_p = N_s/N_p होता है। आदर्श ट्रांसफार्मर में शक्ति नियत रहती है, इसलिए वोल्टेज बढ़ने पर धारा घटती है।',
      },
      2: {
        en: 'More wire turns on the output coil multiply the voltage while reducing the current so electricity can travel across cities with far less heat wasted in cables.',
        hi: 'आउटपुट कॉइल में ज्यादा फेरे वोल्टेज बढ़ा देते हैं और धारा कम कर देते हैं, जिससे शहर की तारों में बिजली की बर्बादी बहुत घट जाती है।',
      },
      3: {
        en: 'Think of a bicycle gear for electricity: a step-up transformer trades big current for high voltage to send power miles away, then a neighborhood pole transformer steps it safely down for your home!',
        hi: 'इसे बिजली का साइकिल गियर समझें: स्टेप-अप ट्रांसफार्मर दूर तक बिजली भेजने को वोल्टेज बढ़ाता है, और मोहल्ले का ट्रांसफार्मर घर के लिए उसे सुरक्षित कम कर देता है!',
      },
    },
    realLifeStory: {
      en: 'Every neighborhood electricity substation uses laminated iron cores and copper windings to step grid voltage down safely for homes and schools.',
      hi: 'हर शहर के पावर सबस्टेशन में यही ट्रांसफार्मर हाई-वोल्टेज बिजली को घरों के लिए सुरक्षित स्तर पर लाता है।',
    },
  },
  'density-buoyancy': {
    title: { en: 'Diving Submarine & Ballast Tanks', hi: 'पनडुब्बी (सबमरीन) का डूबना और तैरना' },
    archetype: 'submarine-buoyancy',
    levels: {
      1: {
        en: 'Archimedes principle states buoyant upthrust F_B = ρ_fluid V_sub g equals the weight of displaced fluid. The body floats if ρ_obj < ρ_fluid and sinks if ρ_obj > ρ_fluid.',
        hi: 'आर्किमिडीज के सिद्धांत के अनुसार उत्प्लावन बल F_B = ρ_fluid V_sub g हटाए गए द्रव के भार के बराबर होता है। यदि वस्तु का घनत्व कम है तो वह तैरती है।',
      },
      2: {
        en: 'Water pushes upward on anything dipped into it. When the object is lighter than an equal volume of water, that upward push wins and lifts it to the surface.',
        hi: 'पानी हर डूबी चीज को ऊपर धकेलता है। जब वस्तु उतने ही पानी से हल्की होती है, तो ऊपर का धक्का जीतता है और वह तैरने लगती है।',
      },
      3: {
        en: 'A submarine dives by filling its tanks with seawater to become heavier than water, and rises right back up by blowing air into the tanks to make itself light again!',
        hi: 'पनडुब्बी टैंक में पानी भरकर भारी हो जाती है और नीचे डूबती है, फिर हवा भरकर हल्की होते ही वापस सतह पर आ जाती है!',
      },
    },
    realLifeStory: {
      en: 'Submarines control their average density with water ballast tanks so Archimedes upward buoyant push either lifts them to the surface or lets them dive deep.',
      hi: 'पनडुब्बी अपने टैंकों में पानी व हवा का संतुलन बदलकर घनत्व नियंत्रित करती है और आसानी से ऊपर-नीचे जाती है।',
    },
  },
  'fluids': {
    title: { en: 'Airplane Wing Lift & Garden Hose Nozzle', hi: 'हवाई जहाज का पंख और गार्डन पाइप नोजल' },
    archetype: 'airplane-wing',
    levels: {
      1: {
        en: 'By the equation of continuity A₁v₁ = A₂v₂, fluid accelerates in a narrower cross-section. By Bernoulli theorem P + ½ρv² = constant, faster flow creates lower static pressure.',
        hi: 'सांतत्य समीकरण A₁v₁ = A₂v₂ से संकरे भाग में वेग बढ़ता है। बर्नौली प्रमेय P + ½ρv² = नियतांक के अनुसार तेज प्रवाह में दाब घट जाता है।',
      },
      2: {
        en: 'Squeezing a pipe forces water or air to speed up, and wherever fluid rushes faster, its sideways pressure drops noticeably.',
        hi: 'पाइप को दबाने पर पानी या हवा तेज भागती है, और जहाँ बहाव तेज होता है वहाँ दाब कम हो जाता है।',
      },
      3: {
        en: 'Put your thumb over a garden hose and water shoots faster—an airplane wing does the exact same trick with air on top so higher pressure underneath lifts the whole plane!',
        hi: 'पाइप के मुँह पर अंगूठा रखने से पानी तेज निकलता है—हवाई जहाज का पंख ऊपर की हवा तेज करके दाब घटाता है और नीचे का ज्यादा दाब जहाज को उड़ा देता है!',
      },
    },
    realLifeStory: {
      en: 'Curved airplane wings speed up air over their upper surface, lowering pressure above so the higher pressure below generates real aerodynamic lift.',
      hi: 'हवाई जहाज के पंख के ऊपर से हवा तेज गुजरती है जिससे ऊपर दाब घटता है और नीचे का दाब जहाज को ऊपर उठाता है।',
    },
  },
  'work-energy': {
    title: { en: 'Theme Park Roller Coaster Track', hi: 'रोलर कोस्टर ट्रैक और ऊर्जा रूपांतरण' },
    archetype: 'roller-coaster',
    levels: {
      1: {
        en: 'Mechanical energy E = K + U = ½mv² + mgh is conserved in the absence of non-conservative damping. Potential energy lost on descent converts directly into kinetic energy.',
        hi: 'अवमंदन न होने पर कुल यांत्रिक ऊर्जा E = K + U = ½mv² + mgh संरक्षित रहती है। नीचे उतरते समय स्थितिज ऊर्जा सीधे गतिज ऊर्जा में बदलती है।',
      },
      2: {
        en: 'At the top of the hill all energy is stored as height; as the cart drops, stored height turns into pure speed at the valley bottom.',
        hi: 'ऊँची चोटी पर सारी ऊर्जा ऊँचाई के रूप में जमा होती है; नीचे उतरते ही वही ऊर्जा तेज रफ्तार में बदल जाती है।',
      },
      3: {
        en: 'A roller coaster uses no engine after the first hill—climbing stores energy like a piggy bank, and dropping spends that height for thrilling speed!',
        hi: 'रोलर कोस्टर को पहली चढ़ाई के बाद इंजन नहीं चाहिए—ऊँचाई पर ऊर्जा जमा होती है और ढलान पर वही ऊर्जा तेज रफ्तार बन जाती है!',
      },
    },
    realLifeStory: {
      en: 'A roller coaster car racing up and down hills continuously swaps height energy for speed without needing an onboard motor.',
      hi: 'रोलर कोस्टर की गाड़ी बिना मोटर के ऊँचाई की ऊर्जा को रफ्तार में और रफ्तार को फिर ऊँचाई में बदलती रहती है।',
    },
  },
  'linear-momentum': {
    title: { en: 'Highway Car Bumper & Pool Ball Collision', hi: 'कार बम्पर और पूल बॉल की टक्कर' },
    archetype: 'car-crash-bumper',
    levels: {
      1: {
        en: 'Total linear momentum m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂ is conserved in every isolated collision. Coefficient of restitution e governs how much kinetic energy rebounds versus dissipates.',
        hi: 'बाहरी बल न होने पर कुल रेखीय संवेग m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂ हमेशा संरक्षित रहता है। प्रत्यावस्थान गुणांक e उछाल तय करता है।',
      },
      2: {
        en: 'When two vehicles collide, the total push-momentum before impact equals the total momentum after—a heavier car changes speed much less than a lighter one.',
        hi: 'दो गाड़ियों के टकराने पर कुल संवेग वही रहता है—भारी गाड़ी की गति कम बदलती है जबकि हल्की गाड़ी ज्यादा पीछे हटती है।',
      },
      3: {
        en: 'Like billiard balls clacking on a table, momentum simply passes from the moving ball into the target ball; sticky clay bumpers (e = 0) lock together and move as one!',
        hi: 'कैरम या बिलियर्ड्स के स्ट्राइकर की तरह गति एक से दूसरे में चली जाती है; और नरम बम्पर (e = 0) टकराकर साथ चिपक जाते हैं!',
      },
    },
    realLifeStory: {
      en: 'Crash-test car bumpers and billiard breaks show why total momentum before and after impact always stays balanced.',
      hi: 'क्रैश-टेस्ट कार बम्पर और कैरम की टक्कर दिखाती है कि टक्कर से पहले और बाद का कुल संवेग बराबर रहता है।',
    },
  },
  'impulse-momentum': {
    title: { en: 'Cricket Catch Cushioning & Car Airbag', hi: 'क्रिकेट कैच और कार एयरबैग का झटका कम करना' },
    archetype: 'cricket-bat-impact',
    levels: {
      1: {
        en: 'Impulse J = F_avg Δt = Δp equals the total change in momentum. Stretching collision time Δt inversely reduces peak impact force F_avg = Δp / Δt.',
        hi: 'आवेग J = F_avg Δt = Δp संवेग में कुल परिवर्तन के बराबर है। संपर्क समय Δt बढ़ाने से औसत आघात बल F_avg घट जाता है।',
      },
      2: {
        en: 'Stopping a fast ball requires the same total momentum change, so pulling your hands back stretches the stopping time and makes the impact much gentler.',
        hi: 'तेज गेंद को रोकने के लिए संवेग परिवर्तन वही रहता है, पर हाथ पीछे खींचकर समय बढ़ाने से चोट का बल बहुत कम हो जाता है।',
      },
      3: {
        en: 'Why does a car airbag save lives and why do cricketers pull their hands back? Because a longer, softer landing spreads the exact same stop over more time so the force stays gentle!',
        hi: 'क्रिकेटर कैच लेते समय हाथ पीछे क्यों खींचता है और कार में एयरबैग क्यों होता है? क्योंकि रुकने का समय बढ़ने से झटका बहुत हल्का हो जाता है!',
      },
    },
    realLifeStory: {
      en: 'Watch how extending the impact cushion time like a cricket fielder pulling hands back or a car airbag dramatically slashes peak impact force.',
      hi: 'देखें कैसे क्रिकेटर के हाथ पीछे खींचने या एयरबैग से संपर्क समय बढ़ते ही आघात बल तेजी से घट जाता है।',
    },
  },
  'communication-systems': {
    title: { en: 'City TV Broadcast Tower & Horizon Coverage', hi: 'शहर का टीवी टावर और सिग्नल कवरेज क्षेत्र' },
    archetype: 'city-tv-tower',
    levels: {
      1: {
        en: 'Line-of-sight horizon range over curved Earth is d = √(2Rh_T) + √(2Rh_R), and broadcast coverage area scales linearly with tower height as A = 2πRh_T.',
        hi: 'पृथ्वी की वक्रता के कारण दृष्टि-रेखा परास d = √(2Rh_T) + √(2Rh_R) है और कवरेज क्षेत्रफल A = 2πRh_T टावर की ऊँचाई के अनुक्रमानुपाती है।',
      },
      2: {
        en: 'Because the Earth curves away below the horizon, building a taller TV or mobile antenna lets radio signals see farther across the city before hitting the curve.',
        hi: 'पृथ्वी गोल होने के कारण ऊँचा टीवी या मोबाइल टावर ज्यादा दूर तक सीधी नजर से सिग्नल पहुँचा सकता है।',
      },
      3: {
        en: 'Just like climbing onto a rooftop lets you spot buildings far away, raising a TV broadcast tower pushes the horizon back so thousands more homes get crisp reception!',
        hi: 'जैसे छत पर चढ़कर दूर तक के घर दिखते हैं, वैसे ही टीवी टावर ऊँचा करने से सिग्नल ज्यादा बड़े शहर तक आसानी से पहुँचता है!',
      },
    },
    realLifeStory: {
      en: 'City TV and 5G broadcast towers stand atop hills and skyscrapers because doubling tower height doubles the ground coverage area.',
      hi: 'टीवी और 5G टावर ऊँची इमारतों या पहाड़ियों पर लगाए जाते हैं क्योंकि ऊँचाई दोगुनी करने पर कवरेज क्षेत्रफल दोगुना हो जाता है।',
    },
  },
  'dual-nature': {
    title: { en: 'Rooftop Solar Panel & Sunlight Photons', hi: 'छत का सोलर पैनल और सूर्य के फोटॉन' },
    archetype: 'solar-roof',
    levels: {
      1: {
        en: 'By Einstein photoelectric equation K_max = hc/λ − φ₀, electrons are emitted only if photon energy exceeds work function φ₀. Intensity sets current while wavelength sets kinetic energy.',
        hi: 'आइंस्टीन समीकरण K_max = hc/λ − φ₀ के अनुसार इलेक्ट्रॉन तभी निकलते हैं जब फोटॉन ऊर्जा कार्य-फलन φ₀ से अधिक हो। तीव्रता धारा और तरंगदैर्ध्य गतिज ऊर्जा तय करती है।',
      },
      2: {
        en: 'Each tiny packet of light acts like a bullet hitting a solar cell: only high-energy short-wavelength light can knock electrons free to create electricity.',
        hi: 'प्रकाश का हर छोटा कण (फोटॉन) सोलर प्लेट से टकराकर इलेक्ट्रॉन निकालता है—केवल पर्याप्त ऊर्जा वाला प्रकाश ही बिजली बना सकता है।',
      },
      3: {
        en: 'Think of knocking coconuts off a tree: throwing a hundred light ping-pong balls (red light) will not knock one down, but one energetic blue photon pops an electron right out of the solar panel!',
        hi: 'नारियल गिराने जैसा समझें: सौ हल्की गेंदें (लाल रोशनी) एक भी इलेक्ट्रॉन नहीं निकाल सकतीं, पर एक तेज नीला फोटॉन तुरंत सोलर पैनल से बिजली निकाल देता है!',
      },
    },
    realLifeStory: {
      en: 'Rooftop solar panels and automatic elevator door sensors rely directly on Einstein photoelectric effect to turn incoming photons into electric current.',
      hi: 'घरों के सोलर पैनल और ऑटोमैटिक लिफ्ट सेंसर इसी प्रकाश-विद्युत प्रभाव से धूप को सीधे बिजली में बदलते हैं।',
    },
  },
  'projectile': {
    title: { en: 'Cricket Six Loft & Stadium Arc', hi: 'क्रिकेट का लंबा छक्का और स्टेडियम आर्क' },
    archetype: 'cannon-cricket-loft',
    levels: {
      1: {
        en: 'A projectile combines uniform horizontal velocity u cosθ with constant downward gravity g, yielding range R = u² sin(2θ)/g which peaks at θ = 45°.',
        hi: 'प्रक्षेप्य गति में क्षैतिज वेग u cosθ नियत रहता है और ऊर्ध्वाधर वेग पर गुरुत्व g लगता है। परास R = u² sin(2θ)/g, 45° पर अधिकतम होता है।',
      },
      2: {
        en: 'Horizontal speed carries the ball forward while gravity curves it down into a clean parabola—45 degrees gives the best balance between height and forward distance.',
        hi: 'क्षैतिज गति गेंद को आगे ले जाती है और गुरुत्व उसे नीचे मोड़ता है—45 डिग्री पर सबसे लंबा छक्का लगता है।',
      },
      3: {
        en: 'Hit a cricket ball too flat and it lands early; hit it straight up and it comes right back down; hit at 45 degrees and it sails cleanly over the stadium boundary!',
        hi: 'बहुत नीचा शॉट जल्दी गिर जाएगा और सीधा ऊपर मारने पर वहीं गिरेगा—45 डिग्री पर मारा गया शॉट सबसे दूर बाउंड्री पार जाता है!',
      },
    },
    realLifeStory: {
      en: 'A batsman lofting a cricket six or a javelin thrower chooses near 45° launch angle to maximize horizontal range.',
      hi: 'क्रिकेट में लंबा छक्का या भाला फेंकने में खिलाड़ी अधिकतम दूरी के लिए 45° के आसपास कोण चुनते हैं।',
    },
  },
  'simple-pendulum': {
    title: { en: 'Antique Grandfather Wall Clock Pendulum', hi: 'पुरानी दीवार घड़ी का पेंडुलम' },
    archetype: 'grandfather-clock',
    levels: {
      1: {
        en: 'For small angles, the simple pendulum time period T = 2π√(L/g) depends only on length L and gravity g, completely independent of bob mass.',
        hi: 'छोटे कोणों के लिए सरल लोलक का आवर्तकाल T = 2π√(L/g) केवल लंबाई L और गुरुत्व g पर निर्भर करता है, गोलक के द्रव्यमान पर नहीं।',
      },
      2: {
        en: 'Making the pendulum rod longer makes each swing slower, while moving the clock to weaker gravity like the Moon slows it down even more.',
        hi: 'पेंडुलम की छड़ लंबी करने से दोलन धीमा हो जाता है और चाँद पर कम गुरुत्व में घड़ी और धीरे चलती है।',
      },
      3: {
        en: 'Think of a park swing: a taller swing takes longer to go back and forth, and whether a light kid or heavy adult sits on it, the swing rhythm stays almost the exact same!',
        hi: 'पार्क के झूले जैसा समझें: लंबी रस्सी का झूला धीरे झूलता है, और उस पर हल्का बच्चा बैठे या भारी व्यक्ति, झूलने का समय वही रहता है!',
      },
    },
    realLifeStory: {
      en: 'A grandfather clock keeps time by adjusting the bob screw up or down to change pendulum length L by millimeters.',
      hi: 'पुरानी पेंडुलम घड़ी में समय ठीक करने के लिए गोलक को थोड़ा ऊपर या नीचे खिसकाकर लंबाई L बदली जाती है।',
    },
  },
  'gravity-variation': {
    title: { en: 'Mountain Peak, Mine Shaft & Earth Satellite', hi: 'पहाड़ की चोटी, गहरी खान और पृथ्वी उपग्रह' },
    archetype: 'satellite-orbit',
    levels: {
      1: {
        en: 'Gravity g peaks at Earth surface (r = R), falls linearly inside as g_d = g₀(1 − d/R), and decays inversely squared above as g_h = g₀(R/(R+h))².',
        hi: 'पृथ्वी की सतह पर गुरुत्व g अधिकतम होता है; अंदर गहराई में रैखिक रूप से घटता है और ऊपर ऊँचाई पर वर्ग के व्युत्क्रमानुपाती घटता है।',
      },
      2: {
        en: 'Whether you climb high into space or dig deep toward Earth center, gravity becomes weaker—reaching zero right at the very center of our planet.',
        hi: 'चाहे आप अंतरिक्ष में ऊपर जाएँ या धरती के केंद्र की ओर गहरी खान में उतरें, दोनों तरफ गुरुत्वाकर्षण कम होता जाता है।',
      },
      3: {
        en: 'Earth pulls strongest right where your shoes touch the ground! Go up in a rocket and Earth is farther away; go to Earth center and rock pulls equally from all sides, so weight vanishes!',
        hi: 'धरती की सतह पर खिंचाव सबसे तेज है! ऊपर जाने पर दूरी बढ़ती है, और ठीक केंद्र पर चारों तरफ की मिट्टी बराबर खींचती है इसलिए भार शून्य हो जाता है!',
      },
    },
    realLifeStory: {
      en: 'Compare astronauts orbiting above Earth with miners deep underground—both feel weaker gravity than standing at sea level.',
      hi: 'अंतरिक्ष यात्री और गहरी खदान में काम करने वाले दोनों ही समुद्र तल की तुलना में थोड़ा कम गुरुत्व महसूस करते हैं।',
    },
  },
};

const ARCHETYPE_BY_SIM: Record<string, RealLifeArchetype> = {
  'units-measurements': 'precision-caliper',
  'motion-1d': 'highway-car',
  'speed-velocity': 'highway-car',
  projectile: 'cannon-cricket-loft',
  'relative-velocity': 'river-ferry',
  'circular-motion': 'carousel-merry',
  'newtons-force': 'highway-car',
  'banking-roads': 'f1-banked-turn',
  'atwood-pulley': 'elevator-crane',
  'work-energy': 'roller-coaster',
  'work-power-basic': 'elevator-crane',
  'linear-momentum': 'car-crash-bumper',
  'impulse-momentum': 'cricket-bat-impact',
  'angular-momentum': 'drifting-car-gyro',
  'rolling-incline': 'tire-rolling-hill',
  'moment-of-inertia': 'ice-skater-spin',
  gravitation: 'satellite-orbit',
  'escape-velocity': 'satellite-orbit',
  'keplers-laws': 'satellite-orbit',
  'gravity-variation': 'satellite-orbit',
  'solids-elasticity': 'bridge-cable-stretch',
  fluids: 'airplane-wing',
  'stokes-terminal': 'raindrop-parachute',
  'capillary-rise': 'plant-stem-wick',
  'density-buoyancy': 'submarine-buoyancy',
  'thermal-matter': 'railway-track-gap',
  'blackbody-cooling': 'hot-tea-cooling',
  thermodynamics: 'car-engine-piston',
  'carnot-engine': 'power-plant-turbine',
  'kinetic-theory': 'pressure-cooker-gas',
  'shm-spring': 'car-shock-absorber',
  'simple-pendulum': 'grandfather-clock',
  'wave-superposition': 'ocean-harbor-waves',
  'wave-speed-basic': 'guitar-string-wave',
  'organ-pipes-beats': 'concert-flute',
  'doppler-effect': 'ambulance-doppler',
  'coulombs-law': 'lightning-cloud',
  'electric-dipole': 'lightning-cloud',
  capacitance: 'camera-flash-cap',
  'electric-potential': 'lightning-cloud',
  'ohms-law': 'electric-kettle-grid',
  'wheatstone-bridge': 'home-circuit-panel',
  'charge-current-power': 'electric-kettle-grid',
  'potentiometer-cells': 'home-circuit-panel',
  'lorentz-force': 'mri-cyclotron-beam',
  'magnetism-matter': 'compass-earth-field',
  emi: 'wind-turbine-gen',
  transformer: 'power-substation',
  'ac-circuits': 'radio-tuner-lc',
  'em-waves': 'city-tv-tower',
  'communication-systems': 'city-tv-tower',
  'thin-lens': 'camera-projector',
  'snell-prism-tir': 'diamond-fiber-cable',
  'microscope-telescope': 'stargazing-observatory',
  'eye-defects': 'eyeglasses-reading',
  'wave-optics': 'soap-bubble-slits',
  'diffraction-polarization': 'polarized-sunglasses',
  'dual-nature': 'solar-roof',
  'de-broglie': 'electron-microscope',
  atoms: 'neon-sign-atom',
  nuclei: 'medical-tracer-decay',
  'binding-energy': 'nuclear-power-core',
  semiconductors: 'led-phone-charger',
  'logic-gates': 'smart-home-logic',
  'transistor-zener': 'audio-amplifier',
  'rutherford-scattering': 'nuclear-power-core',
};

const REAL_LIFE_TITLES: Record<string, BilingualText> = {
  'units-measurements': { en: 'Vernier Caliper Quality Check on Factory Parts', hi: 'फ़ैक्टरी पुर्ज़ों की वर्नियर कैलिपर जाँच' },
  'relative-velocity': { en: 'Motorboat Crossing a Flowing River', hi: 'बहती नदी पार करती मोटरबोट' },
  'circular-motion': { en: 'Amusement Park Carousel & Turning Car', hi: 'मेले का झूला और मुड़ती कार' },
  'newtons-force': { en: 'Pushing a Heavy Crate Across a Ramp', hi: 'ढलान पर भारी बक्सा धकेलना' },
  'atwood-pulley': { en: 'Building Elevator & Counterweight System', hi: 'बिल्डिंग लिफ्ट और काउंटरवेट पुली' },
  'work-power-basic': { en: 'Construction Crane Lifting Steel Beams', hi: 'निर्माण क्रेन द्वारा भारी सामान उठाना' },
  'rolling-incline': { en: 'Car Tire vs Solid Barrel Rolling Downhill', hi: 'ढलान पर लुढ़कता कार का टायर व ड्रम' },
  'moment-of-inertia': { en: 'Flywheel & Bicycle Wheel Spin Resistance', hi: 'साइकिल पहिया व फ्लाईव्हील का घुमाव' },
  gravitation: { en: 'Earth–Moon & GPS Satellite Gravity Pull', hi: 'पृथ्वी–चंद्रमा और GPS उपग्रह गुरुत्वाकर्षण' },
  'escape-velocity': { en: 'ISRO Space Rocket Launching to Deep Space', hi: 'ISRO रॉकेट का अंतरिक्ष प्रक्षेपण' },
  'keplers-laws': { en: 'Planet & Comet Orbiting the Sun', hi: 'सूर्य की परिक्रमा करते ग्रह व धूमकेतु' },
  'solids-elasticity': { en: 'Suspension Bridge Steel Cable Tension', hi: 'सस्पेंशन ब्रिज की स्टील केबल का खिंचाव' },
  'stokes-terminal': { en: 'Falling Raindrop & Skydiver Parachute', hi: 'गिरती बारिश की बूँद और पैराशूट' },
  'capillary-rise': { en: 'Water Climbing Inside Plant Stems & Oil Wick', hi: 'पौधे के तने और दीपक की बाती में द्रव चढ़ना' },
  'thermal-matter': { en: 'Railway Track Expansion Gaps in Summer', hi: 'गर्मियों में रेल पटरियों के बीच का गैप' },
  'blackbody-cooling': { en: 'Hot Cup of Masala Tea Cooling on a Table', hi: 'मेज़ पर ठंडी होती गर्म चाय का कप' },
  thermodynamics: { en: 'Car Engine Cylinder & Bicycle Pump Compression', hi: 'कार इंजन पिस्टन और साइकिल पंप' },
  'carnot-engine': { en: 'Thermal Power Plant Steam Turbine Cycle', hi: 'थर्मल पावर प्लांट की भाप टर्बाइन' },
  'kinetic-theory': { en: 'Pressure Cooker Steam & Inflated Car Tire', hi: 'प्रेशर कुकर की भाप और कार टायर दाब' },
  'shm-spring': { en: 'Car Shock Absorber Bouncing Over a Bump', hi: 'स्पीड ब्रेकर पर कार का शॉक एब्जॉर्बर' },
  'wave-superposition': { en: 'Noise-Canceling Headphones & Ocean Ripples', hi: 'नॉइज़-कैंसलिंग हेडफ़ोन और समुद्र की लहरें' },
  'wave-speed-basic': { en: 'Plucked Acoustic Guitar String Vibrations', hi: 'गिटार के तार में दौड़ती तरंग' },
  'coulombs-law': { en: 'Static Lightning Clouds & Comb Picking Paper', hi: 'बिजली के बादल और कंघी का स्थैतिक आकर्षण' },
  'electric-dipole': { en: 'Water Molecules Aligning in a Microwave Oven', hi: 'माइक्रोवेव ओवन में घूमते जल के अणु' },
  capacitance: { en: 'Camera Flash Capacitor & Touchscreen Sensor', hi: 'कैमरा फ्लैश कैपेसिटर और टचस्क्रीन' },
  'electric-potential': { en: 'High-Voltage Power Line Equipotenial Zones', hi: 'हाई-वोल्टेज लाइन के समविभव क्षेत्र' },
  'ohms-law': { en: 'Electric Kettle Heater & Dimmer Switch', hi: 'इलेक्ट्रिक केतली हीटर और फैन रेगुलेटर' },
  'wheatstone-bridge': { en: 'Digital Weighing Scale Strain-Gauge Bridge', hi: 'डिजिटल तराजू का व्हीटस्टोन ब्रिज' },
  'charge-current-power': { en: 'Home Electricity Meter & Geyser Power Bill', hi: 'घरेलू बिजली मीटर और गीजर की खपत' },
  'potentiometer-cells': { en: 'Precision Car Battery Voltage Tester', hi: 'कार बैटरी का सटीक वोल्टेज परीक्षण' },
  'lorentz-force': { en: 'Hospital MRI / Particle Therapy Cyclotron', hi: 'अस्पताल का साइक्लोट्रॉन और चुंबकीय बीम' },
  'magnetism-matter': { en: 'Ship Navigation Magnetic Compass in Earth Field', hi: 'जहाज़ का चुंबकीय कम्पास और पृथ्वी क्षेत्र' },
  emi: { en: 'Wind Turbine & Hydroelectric Power Generator', hi: 'पवन चक्की और जल-विद्युत जनरेटर' },
  'ac-circuits': { en: 'FM Radio Channel Tuner (LCR Resonance)', hi: 'FM रेडियो स्टेशन ट्यूनर (LCR अनुनाद)' },
  'em-waves': { en: 'Wi-Fi Router & Satellite Radio Waves', hi: 'Wi-Fi राउटर और सैटेलाइट रेडियो तरंगें' },
  'thin-lens': { en: 'DSLR Camera Lens & Classroom Projector', hi: 'DSLR कैमरा लेंस और क्लासरूम प्रोजेक्टर' },
  'snell-prism-tir': { en: 'Sparkling Diamond & Fiber-Optic Internet Cable', hi: 'चमकता हीरा और ऑप्टिकल फाइबर इंटरनेट' },
  'microscope-telescope': { en: 'Backyard Stargazing Telescope & Bio Lab', hi: 'आकाशीय दूरबीन और जीव-विज्ञान सूक्ष्मदर्शी' },
  'wave-optics': { en: 'Rainbow Colors on Soap Bubbles & Laser Slits', hi: 'साबुन के बुलबुले के रंग और लेज़र व्यतिकरण' },
  'diffraction-polarization': { en: 'Anti-Glare Polarized Sunglasses on Wet Road', hi: 'गीली सड़क पर पोलराइज़्ड धूप का चश्मा' },
  'de-broglie': { en: 'Electron Microscope Viewing Virus Structures', hi: 'वायरस देखने वाला इलेक्ट्रॉन माइक्रोस्कोप' },
  atoms: { en: 'Glowing Neon Shop Signs & Starlight Spectra', hi: 'चमकते नियॉन बोर्ड और तारों का स्पेक्ट्रम' },
  nuclei: { en: 'Carbon-14 Fossil Dating & Medical Tracer Scan', hi: 'कार्बन-14 डेटिंग और मेडिकल स्कैन' },
  'binding-energy': { en: 'Nuclear Power Reactor & Sun Fusion Energy', hi: 'परमाणु ऊर्जा संयंत्र और सूर्य की ऊर्जा' },
  semiconductors: { en: 'LED Bulb & Phone Charger Rectifier Diode', hi: 'LED बल्ब और मोबाइल चार्जर डायोड' },
  'logic-gates': { en: 'Smart Home Security Alarm & CPU Microchips', hi: 'स्मार्ट होम अलार्म और कंप्यूटर चिप' },
  'transistor-zener': { en: 'Concert Microphone Amplifier & Voltage Guard', hi: 'माइक एम्प्लीफायर और वोल्टेज स्टेबलाइजर' },
  'rutherford-scattering': { en: 'Nuclear Atomic Probing & Gold Foil Discovery', hi: 'स्वर्ण पन्नी प्रयोग और परमाणु नाभिक खोज' },
};

export function getRealLifeScenario(sim: PhysicsSimulation): RealLifeScenarioSpec {
  const override = SCENARIO_OVERRIDES[sim.id];
  if (override) return override;

  const archetype = ARCHETYPE_BY_SIM[sim.id] || 'highway-car';
  const title = REAL_LIFE_TITLES[sim.id] || {
    en: `Real-Life: ${sim.title.en}`,
    hi: `वास्तविक उदाहरण: ${sim.title.hi}`,
  };

  return {
    title,
    archetype,
    levels: {
      1: {
        en: `${sim.title.en} follows ${sim.formulaDisplay}. ${sim.explanation.en}`,
        hi: `${sim.title.hi} सूत्र ${sim.formulaDisplay} पर आधारित है। ${sim.explanation.hi}`,
      },
      2: {
        en: `In everyday terms, ${sim.explanation.en} Try moving the sliders to watch how each quantity immediately responds.`,
        hi: `सरल शब्दों में, ${sim.explanation.hi} स्लाइडर बदलकर देखें कि मान तुरंत कैसे बदलते हैं।`,
      },
      3: {
        en: `Everyday picture: ${sim.realLife.en} Whenever you change an input slider here, watch the live model react just like that real-world object!`,
        hi: `आसान उदाहरण: ${sim.realLife.hi} जब भी आप स्लाइडर बदलते हैं, यह मॉडल बिल्कुल उसी असली चीज की तरह काम करता है!`,
      },
    },
    realLifeStory: sim.realLife,
  };
}

/**
 * Generates an instant, live parameter-aware cause-and-effect explanation
 * for the "Why Did That Happen?" button in English & Hindi.
 */
export function buildWhyDidThatHappen(
  sim: PhysicsSimulation,
  params: Record<string, number>,
  telemetry: LiveSimTelemetry | null,
  sceneMode: SceneMode,
  lastChangedVarKey?: string | null
): BilingualText {
  const primaryReadout = telemetry?.readouts?.[0];
  const secondaryReadout = telemetry?.readouts?.[1];
  const readoutEn = primaryReadout
    ? `${primaryReadout.label.en} (${primaryReadout.symbol}) is now ${primaryReadout.value} ${primaryReadout.unit}`.trim()
    : '';
  const readoutHi = primaryReadout
    ? `${primaryReadout.label.hi} (${primaryReadout.symbol}) अभी ${primaryReadout.value} ${primaryReadout.unit} है`.trim()
    : '';

  const changedVar = lastChangedVarKey
    ? sim.variables.find((v) => v.key === lastChangedVarKey)
    : sim.variables[0];
  const changedVal = changedVar ? params[changedVar.key] ?? changedVar.defaultValue : null;

  // High-impact custom explanations for key topics
  if (sim.id === 'angular-momentum') {
    const r = params.r ?? 1.5;
    const tight = r < 1.2;
    return {
      en: tight
        ? `Because you pulled the radius down to ${r.toFixed(2)} m, the moment of inertia I = mr² dropped sharply. To keep angular momentum L = Iω conserved, the spin speed ω had to jump up (${readoutEn})—just like a car tightening a drift or a skater pulling in their arms!`
        : `With a wider radius of ${r.toFixed(2)} m, the mass sits farther from the axis, raising moment of inertia I = mr². Because total angular momentum L stays conserved, rotation speed ω slows down (${readoutEn}).`,
      hi: tight
        ? `क्योंकि आपने त्रिज्या घटाकर ${r.toFixed(2)} m कर दी, जड़त्व आघूर्ण I = mr² तेजी से घट गया। कोणीय संवेग L = Iω को नियत रखने के लिए घूर्णन गति ω बढ़ गई (${readoutHi})—बिल्कुल जैसे मोड़ छोटा करते ही कार या स्केटर तेज घूमता है!`
        : `${r.toFixed(2)} m की बड़ी त्रिज्या पर द्रव्यमान अक्ष से दूर है, जिससे जड़त्व आघूर्ण बढ़ जाता है और संवेग संरक्षण के कारण घूर्णन गति धीमी हो जाती है (${readoutHi})।`,
    };
  }

  if (sim.id === 'eye-defects') {
    const defect = Math.round(params.defectType ?? 0);
    const lensP = params.lensPower ?? 0;
    const isMyopia = defect === 0;
    return {
      en: isMyopia
        ? `In this myopic eye, the eyeball lens focuses too strongly, so light rays meet BEFORE the retina. ${
            lensP < -0.1
              ? `Your diverging concave eyeglass (${lensP.toFixed(2)} D) spreads the rays slightly so the focus lands cleanly on the retina!`
              : `Without enough negative concave power (${lensP.toFixed(2)} D), the image stays blurry in front of the retina.`
          }`
        : `In this hypermetropic eye, nearby rays focus BEHIND the retina. ${
            lensP > 0.1
              ? `Your converging convex eyeglass (+${lensP.toFixed(2)} D) bends rays inward so the focus pulls right onto the retina!`
              : `Add positive convex power (+D) so the near object comes into crisp focus on the retina.`
          }`,
      hi: isMyopia
        ? `निकट दृष्टिदोष में आँख का लेंस किरणों को रेटिना से पहले ही मिला देता है। ${
            lensP < -0.1
              ? `आपका अवतल चश्मा (${lensP.toFixed(2)} D) किरणों को हल्का फैलाकर फोकस को ठीक रेटिना पर पहुँचा रहा है!`
              : `पर्याप्त माइनस अवतल पावर न होने के कारण छवि रेटिना के आगे धुंधली बन रही है।`
          }`
        : `दूर दृष्टिदोष में पास की वस्तु की किरणें रेटिना के पीछे मिलती हैं। ${
            lensP > 0.1
              ? `आपका उत्तल चश्मा (+${lensP.toFixed(2)} D) किरणों को अंदर मोड़कर फोकस ठीक रेटिना पर ला रहा है!`
              : `पास के अक्षर साफ करने के लिए प्लस उत्तल पावर (+D) बढ़ाएँ।`
          }`,
    };
  }

  if (sim.id === 'doppler-effect') {
    const vs = params.vs ?? 35;
    return {
      en: `Because the ${sceneMode === 'reallife' ? 'ambulance' : 'source'} moves at ${vs} m/s, it chases the sound waves in front of it, squishing their wavelength shorter and raising the heard frequency (${readoutEn}). Behind it, waves stretch out and pitch drops!`,
      hi: `चूँकि ${sceneMode === 'reallife' ? 'एम्बुलेंस' : 'ध्वनि स्रोत'} ${vs} m/s से चल रहा है, वह आगे की ध्वनि तरंगों को दबा देता है जिससे सुनाई देने वाली आवृत्ति बढ़ जाती है (${readoutHi}), जबकि पीछे तरंगें फैलने से सुर नीचे चला जाता है।`,
    };
  }

  if (sim.id === 'density-buoyancy') {
    const rhoObj = params.rhoObj ?? 600;
    const rhoFluid = params.rhoFluid ?? 1000;
    const floats = rhoObj < rhoFluid;
    return {
      en: floats
        ? `The ${sceneMode === 'reallife' ? 'submarine' : 'block'} floats because its density (${rhoObj} kg/m³) is LESS than the liquid density (${rhoFluid} kg/m³). Water pushes upward strongly enough to balance its weight (${readoutEn}).`
        : `The ${sceneMode === 'reallife' ? 'submarine' : 'block'} sinks because its density (${rhoObj} kg/m³) exceeds the liquid density (${rhoFluid} kg/m³), so downward weight beats the upward buoyant push (${readoutEn}).`,
      hi: floats
        ? `${sceneMode === 'reallife' ? 'पनडुब्बी' : 'वस्तु'} तैर रही है क्योंकि इसका घनत्व (${rhoObj} kg/m³) द्रव के घनत्व (${rhoFluid} kg/m³) से कम है और उत्प्लावन बल इसे ऊपर थामे रखता है (${readoutHi})।`
        : `${sceneMode === 'reallife' ? 'पनडुब्बी' : 'वस्तु'} डूब रही है क्योंकि इसका घनत्व (${rhoObj} kg/m³) द्रव से ज्यादा है, इसलिए नीचे का भार उत्प्लावन बल से अधिक है (${readoutHi})।`,
    };
  }

  if (sim.id === 'banking-roads') {
    const theta = params.theta ?? 18;
    const v = params.v ?? 22;
    return {
      en: `At ${v} m/s on a ${theta}° banked curve, the tilted track supplies an inward normal-force component to keep the car turning safely (${readoutEn}). Increase speed beyond the safe maximum and tire friction can no longer prevent outward skidding!`,
      hi: `${theta}° झुके मोड़ पर ${v} m/s की चाल से चलती कार को सड़क का अभिलंब बल अंदर की ओर मोड़ता है (${readoutHi})। अधिकतम सुरक्षित चाल से तेज जाने पर कार बाहर फिसलने लगेगी!`,
    };
  }

  if (sim.id === 'transformer') {
    const np = params.Np ?? 200;
    const ns = params.Ns ?? 600;
    const stepUp = ns > np;
    return {
      en: `Because secondary turns (${ns}) are ${stepUp ? 'greater' : 'fewer'} than primary turns (${np}), this ${stepUp ? 'step-up' : 'step-down'} transformer ${stepUp ? 'multiplies' : 'reduces'} the output voltage while shifting current inversely so total power stays balanced (${readoutEn}).`,
      hi: `द्वितीयक फेरे (${ns}) प्राथमिक फेरों (${np}) से ${stepUp ? 'ज्यादा' : 'कम'} होने के कारण यह ${stepUp ? 'स्टेप-अप' : 'स्टेप-डाउन'} ट्रांसफार्मर वोल्टेज को ${stepUp ? 'बढ़ाता' : 'घटाता'} है और शक्ति को संतुलित रखने के लिए धारा उल्टे अनुपात में बदलती है (${readoutHi})।`,
    };
  }

  const varPartEn = changedVar && changedVal !== null
    ? `Setting ${changedVar.label.en} (${changedVar.symbol} = ${changedVal} ${changedVar.unit}) directly updates ${sim.formulaDisplay}. `
    : `Following ${sim.formulaDisplay}, `;
  const varPartHi = changedVar && changedVal !== null
    ? `${changedVar.label.hi} (${changedVar.symbol} = ${changedVal} ${changedVar.unit}) बदलने पर सूत्र ${sim.formulaDisplay} तुरंत बदलता है। `
    : `सूत्र ${sim.formulaDisplay} के अनुसार, `;

  const secEn = secondaryReadout ? ` Meanwhile, ${secondaryReadout.label.en} is ${secondaryReadout.value} ${secondaryReadout.unit}.` : '';
  const secHi = secondaryReadout ? ` साथ ही, ${secondaryReadout.label.hi} का मान ${secondaryReadout.value} ${secondaryReadout.unit} है।` : '';

  const modeHintEn =
    sceneMode === 'reallife'
      ? ` In real life: ${sim.realLife.en}`
      : ` ${sim.explanation.en}`;
  const modeHintHi =
    sceneMode === 'reallife'
      ? ` वास्तविक जीवन में: ${sim.realLife.hi}`
      : ` ${sim.explanation.hi}`;

  return {
    en: `${varPartEn}${readoutEn ? `As a result, ${readoutEn}.` : ''}${secEn}${modeHintEn}`.trim(),
    hi: `${varPartHi}${readoutHi ? `इसके परिणामस्वरूप ${readoutHi}।` : ''}${secHi}${modeHintHi}`.trim(),
  };
}
