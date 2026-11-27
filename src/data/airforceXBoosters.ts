import {
  AirforceChapterWeightage,
  AirforceFlashcard,
  AirforceMockRecord,
  AirforcePYQ,
  AirforceShortcut,
} from '../types/physics';
import { AIRFORCE_PYQS_CLASS11 } from './airforceXPyqsPart1';
import { AIRFORCE_PYQS_CLASS12 } from './airforceXPyqsPart2';

export const AIRFORCE_X_PYQS: AirforcePYQ[] = [
  ...AIRFORCE_PYQS_CLASS11,
  ...AIRFORCE_PYQS_CLASS12,
];

const pyqsByChapterMap = new Map<string, AirforcePYQ[]>();
const pyqsByIdMap = new Map<string, AirforcePYQ>();

for (const pyq of AIRFORCE_X_PYQS) {
  pyqsByIdMap.set(pyq.id, pyq);
  const list = pyqsByChapterMap.get(pyq.chapterId);
  if (list) list.push(pyq);
  else pyqsByChapterMap.set(pyq.chapterId, [pyq]);
}

export function getAirforcePyqsByChapter(chapterId: string): AirforcePYQ[] {
  return pyqsByChapterMap.get(chapterId) ?? [];
}

export function getAirforcePyqById(id: string): AirforcePYQ | undefined {
  return pyqsByIdMap.get(id);
}

// ============================================================================
// 30-CHAPTER IAF AGNIVEER VAYU (AIRFORCE X GROUP) WEIGHTAGE MATRIX
// ============================================================================
export const AIRFORCE_X_WEIGHTAGE: AirforceChapterWeightage[] = [
  {
    chapterId: 'units-measurements',
    expectedQuestions: '1–2 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Dimensions of G, h, ε₀, μ₀, η, R; percentage error rules; Vernier/Screw Gauge LC.',
      hi: 'G, h, ε₀, μ₀, η, R की विमाएँ; प्रतिशत त्रुटि नियम; वर्नियर/स्क्रू गेज अल्पतमांक।',
    },
  },
  {
    chapterId: 'motion-1d',
    expectedQuestions: '1 Q',
    priority: 'Medium',
    keyExamFocus: {
      en: 'Stopping distance s ∝ u², free-fall odd-number ratio 1:3:5, v–t graph area & slope.',
      hi: 'रुकने की दूरी s ∝ u², मुक्त पतन 1:3:5 अनुपात, v–t ग्राफ क्षेत्रफल व ढाल।',
    },
  },
  {
    chapterId: 'kinematics',
    expectedQuestions: '1–2 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Maximum range at 45°, complementary angles (θ, 90°−θ), R = 4H at 45°, dot/cross product.',
      hi: '45° पर अधिकतम परास, पूरक कोण (θ, 90°−θ), 45° पर R = 4H, अदिश/सदिश गुणन।',
    },
  },
  {
    chapterId: 'laws-of-motion',
    expectedQuestions: '1–2 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Apparent weight in lift m(g±a), banking angle tanθ = v²/rg, angle of friction = angle of repose.',
      hi: 'लिफ्ट में आभासी भार m(g±a), बैंकिंग कोण tanθ = v²/rg, घर्षण कोण = विराम कोण।',
    },
  },
  {
    chapterId: 'work-energy',
    expectedQuestions: '1 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'KE–momentum relation K = p²/(2m), % change traps, zero work in uniform circular motion.',
      hi: 'गतिज ऊर्जा-संवेग संबंध K = p²/(2m), प्रतिशत परिवर्तन ट्रिक, वृत्तीय गति में शून्य कार्य।',
    },
  },
  {
    chapterId: 'momentum',
    expectedQuestions: '0–1 Q',
    priority: 'Medium',
    keyExamFocus: {
      en: 'Gun recoil velocity, impulse FΔt = Δp, coefficient of restitution e (e=1 elastic, e=0 inelastic).',
      hi: 'बंदूक का प्रतिक्षेप वेग, आवेग FΔt = Δp, प्रत्यावस्थान गुणांक e (e=1 प्रत्यास्थ, e=0 अप्रत्यास्थ)।',
    },
  },
  {
    chapterId: 'rotational',
    expectedQuestions: '1–2 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Moment of inertia of ring/disc/sphere/rod, L = Iω conservation (ice skater), rolling speed race.',
      hi: 'वलय/चक्ति/गोले/छड़ का जड़त्व आघूर्ण, L = Iω संरक्षण, लोटनिक गति की दौड़।',
    },
  },
  {
    chapterId: 'gravitation',
    expectedQuestions: '2 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Variation of g with h, d, latitude; g=0 at center; v_e = √2·v_o = 11.2 km/s; geostationary T = 24 h.',
      hi: 'ऊँचाई, गहराई व अक्षांश के साथ g में परिवर्तन; केंद्र पर g=0; v_e = √2·v_o = 11.2 km/s; भू-तुल्यकाली T=24h।',
    },
  },
  {
    chapterId: 'solids-elasticity',
    expectedQuestions: '1 Q',
    priority: 'Medium',
    keyExamFocus: {
      en: 'Steel more elastic than rubber, wire radius-doubling extension trap (ΔL ∝ 1/r²), Poisson ratio.',
      hi: 'स्टील रबर से अधिक प्रत्यास्थ, तार की त्रिज्या दुगुनी करने पर ΔL ∝ 1/r², पॉइसन अनुपात।',
    },
  },
  {
    chapterId: 'fluids',
    expectedQuestions: '1–2 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Capillary rise h ∝ 1/r, excess pressure in drop 2T/R vs bubble 4T/R, Stokes terminal velocity v_t ∝ r².',
      hi: 'केशिकत्व h ∝ 1/r, बूँद (2T/R) बनाम बुलबुले (4T/R) में आधिक्य दाब, स्टोक्स सीमांत वेग v_t ∝ r²।',
    },
  },
  {
    chapterId: 'thermal-matter',
    expectedQuestions: '1 Q',
    priority: 'Medium',
    keyExamFocus: {
      en: 'Wien’s law λ_m T = b, Stefan’s law E ∝ T⁴, Newton’s cooling ratio, α:β:γ = 1:2:3, water 4°C density.',
      hi: 'वीन नियम λ_m T = b, स्टीफन नियम E ∝ T⁴, न्यूटन शीतलन अनुपात, α:β:γ = 1:2:3, 4°C पर जल घनत्व।',
    },
  },
  {
    chapterId: 'thermodynamics',
    expectedQuestions: '1–2 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Carnot efficiency η = 1 − T₂/T₁ (always Kelvin!), Mayer Cp − Cv = R, isothermal vs adiabatic slope.',
      hi: 'कार्नो दक्षता η = 1 − T₂/T₁ (केल्विन में!), मेयर Cp − Cv = R, समतापी बनाम रुद्धोष्म ढाल।',
    },
  },
  {
    chapterId: 'kinetic-theory',
    expectedQuestions: '1 Q',
    priority: 'Medium',
    keyExamFocus: {
      en: 'v_rms ∝ √(T/M), average KE = (3/2)k_B T (independent of gas mass), degrees of freedom f & γ = 1 + 2/f.',
      hi: 'v_rms ∝ √(T/M), औसत KE = (3/2)k_B T (द्रव्यमान से स्वतंत्र), स्वातंत्र्य कोटि f व γ = 1 + 2/f।',
    },
  },
  {
    chapterId: 'oscillations',
    expectedQuestions: '1 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Pendulum T = 2π√(L/g) independent of bob mass, seconds pendulum L ≈ 1 m, T = ∞ in satellite, KE=PE at A/√2.',
      hi: 'लोलक T = 2π√(L/g) द्रव्यमान से स्वतंत्र, सेकंड लोलक L≈1m, उपग्रह में T=∞, A/√2 पर KE=PE।',
    },
  },
  {
    chapterId: 'waves',
    expectedQuestions: '1–2 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Open (1:2:3) vs Closed (1:3:5) organ pipe, f_open = 2·f_closed, beats f_b = |f₁−f₂|, Doppler apparent pitch.',
      hi: 'खुला (1:2:3) बनाम बंद (1:3:5) ऑर्गन पाइप, f_खुला = 2·f_बंद, विस्पंद f_b = |f₁−f₂|, डॉप्लर प्रभाव।',
    },
  },
  {
    chapterId: 'electric-charges',
    expectedQuestions: '1 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Coulomb force in medium F/K, Gauss flux Φ = q/ε₀, E = 0 inside hollow conductor, dipole torque pE sinθ.',
      hi: 'माध्यम में कूलॉम बल F/K, गॉस फ्लक्स Φ = q/ε₀, खोखले चालक के भीतर E=0, द्विध्रुव बल आघूर्ण pE sinθ।',
    },
  },
  {
    chapterId: 'capacitance',
    expectedQuestions: '1 Q',
    priority: 'Medium',
    keyExamFocus: {
      en: 'Dielectric effect (battery connected vs disconnected), series/parallel C, energy U = ½CV², drops merging C ∝ n^(1/3).',
      hi: 'परावैद्युत प्रभाव (बैटरी जुड़ी बनाम अलग), श्रेणी/समांतर C, ऊर्जा U = ½CV², बूँदों का संलयन।',
    },
  },
  {
    chapterId: 'current-electricity',
    expectedQuestions: '2 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Wire stretching R′ = n²R, potentiometer r = R(l₁−l₂)/l₂, series vs parallel cells, Kirchhoff conservation laws.',
      hi: 'तार खींचने पर R′ = n²R, विभवमापी r = R(l₁−l₂)/l₂, श्रेणी बनाम समांतर सेल, किरचॉफ संरक्षण नियम।',
    },
  },
  {
    chapterId: 'moving-charges',
    expectedQuestions: '1–2 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Lorentz work = 0, cyclotron radius r = mv/qB, galvanometer → ammeter (low shunt) & voltmeter (high series R).',
      hi: 'लॉरेंत्ज़ कार्य = 0, साइक्लोट्रॉन त्रिज्या r = mv/qB, धारामापी से अमीटर (लघु शंट) व वोल्टमीटर (उच्च श्रेणी R)।',
    },
  },
  {
    chapterId: 'magnetism-matter',
    expectedQuestions: '1 Q',
    priority: 'Medium',
    keyExamFocus: {
      en: 'Dip angle (0° equator, 90° poles), Dia/Para/Ferro susceptibility χ, Curie temperature & soft iron core.',
      hi: 'नमन कोण (विषुवत 0°, ध्रुव 90°), प्रति/अनु/लौहचुंबकीय प्रवृत्ति χ, क्यूरी ताप व नरम लोहा।',
    },
  },
  {
    chapterId: 'emi',
    expectedQuestions: '1 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Lenz’s law = conservation of energy, motional emf e = Blv, self-inductance unit Henry, eddy currents.',
      hi: 'लेंज़ का नियम = ऊर्जा संरक्षण, गतिक emf e = Blv, स्वप्रेरकत्व मात्रक हेनरी, भँवर धाराएँ।',
    },
  },
  {
    chapterId: 'ac-circuits',
    expectedQuestions: '1–2 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'LCR resonance Z = R, cosφ = 1, f₀ = 1/(2π√LC), wattless current in pure L/C, transformer works on AC only.',
      hi: 'LCR अनुनाद Z=R, cosφ=1, f₀=1/(2π√LC), शुद्ध L/C में वाटहीन धारा, ट्रांसफॉर्मर केवल AC पर।',
    },
  },
  {
    chapterId: 'em-waves',
    expectedQuestions: '1 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'EM spectrum order (Gamma → Radio), c = 1/√(μ₀ε₀) = E₀/B₀, transverse nature, ozone UV absorption.',
      hi: 'EM स्पेक्ट्रम क्रम (गामा → रेडियो), c = 1/√(μ₀ε₀) = E₀/B₀, अनुप्रस्थ प्रकृति, ओजोन द्वारा UV अवशोषण।',
    },
  },
  {
    chapterId: 'ray-optics',
    expectedQuestions: '2 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'TIR & critical angle sinC = 1/μ, Myopia (concave) vs Hypermetropia (convex), P = 1/f(m), lens in liquid.',
      hi: 'पूर्ण आंतरिक परावर्तन sinC = 1/μ, निकटदृष्टि (अवतल) बनाम दूरदृष्टि (उत्तल), P = 1/f(m), द्रव में लेंस।',
    },
  },
  {
    chapterId: 'wave-optics',
    expectedQuestions: '1 Q',
    priority: 'Medium',
    keyExamFocus: {
      en: 'YDSE fringe width β = λD/d (in water β/μ), polarization proves transverse light, Brewster law μ = tan i_p.',
      hi: 'YDSE फ्रिंज चौड़ाई β = λD/d (जल में β/μ), ध्रुवण अनुप्रस्थ प्रकृति सिद्ध करता है, ब्रूस्टर नियम μ = tan i_p।',
    },
  },
  {
    chapterId: 'dual-nature',
    expectedQuestions: '1 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Photoelectric K_max depends on frequency (not intensity), de Broglie λ = 12.27/√V Å for electrons.',
      hi: 'प्रकाश-विद्युत K_max आवृत्ति पर निर्भर (तीव्रता पर नहीं), इलेक्ट्रॉन के लिए डी-ब्रॉग्ली λ = 12.27/√V Å।',
    },
  },
  {
    chapterId: 'atoms',
    expectedQuestions: '0–1 Q',
    priority: 'Low',
    keyExamFocus: {
      en: 'Bohr radius r_n ∝ n², energy E_n = −13.6/n² eV, Lyman (UV) / Balmer (Visible) / Paschen (IR).',
      hi: 'बोहर त्रिज्या r_n ∝ n², ऊर्जा E_n = −13.6/n² eV, लाइमन (UV) / बामर (दृश्य) / पाश्चन (IR)।',
    },
  },
  {
    chapterId: 'nuclei',
    expectedQuestions: '1 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'Half-life N = N₀(½)^n, mean life τ = 1.44 T½, nuclear density independent of A, α/β/γ decay shifts.',
      hi: 'अर्ध-आयु N = N₀(½)^n, औसत आयु τ = 1.44 T½, नाभिकीय घनत्व A से स्वतंत्र, α/β/γ क्षय।',
    },
  },
  {
    chapterId: 'semiconductors',
    expectedQuestions: '1–2 Q',
    priority: 'High',
    keyExamFocus: {
      en: 'N-type (pentavalent) vs P-type (trivalent), Zener reverse regulator, β = α/(1−α), NAND/NOR universal gates.',
      hi: 'N-प्रकार (पंचसंयोजी) बनाम P-प्रकार (त्रिसंयोजी), जेनर पश्च नियंत्रक, β = α/(1−α), NAND/NOR सार्वत्रिक द्वार।',
    },
  },
  {
    chapterId: 'communication-systems',
    expectedQuestions: '1 Q',
    priority: 'Medium',
    keyExamFocus: {
      en: 'Antenna height h = λ/4, LOS range d = √(2Rh), AM bandwidth = 2f_m, AM power P_t = P_c(1 + m²/2).',
      hi: 'एंटीना ऊँचाई h = λ/4, परास d = √(2Rh), AM बैंडविड्थ = 2f_m, AM शक्ति P_t = P_c(1 + m²/2)।',
    },
  },
];

// ============================================================================
// 30 CURATED 20-SECOND AIRFORCE X SHORTCUT TRICKS & RATIO CHEAT DECK
// ============================================================================
export const AIRFORCE_X_SHORTCUTS: AirforceShortcut[] = [
  // --- MECHANICS (9) ---
  {
    id: 'sc-01',
    chapterId: 'work-energy',
    category: 'Mechanics',
    title: { en: 'KE ↔ Momentum Fast Percentage Trick', hi: 'गतिज ऊर्जा ↔ संवेग तेज प्रतिशत ट्रिक' },
    formulaTrick: 'K = p²/(2m)  ⇒  %ΔK = 2x + x²/100',
    whenToUse: {
      en: 'Use whenever momentum p changes by x% (even large changes like 20%, 50%, or 100%).',
      hi: 'जब भी संवेग p में x% परिवर्तन दिया हो (चाहे 20%, 50% या 100% जैसे बड़े मान हों)।',
    },
    workedExample: {
      en: 'p increases by 100% (doubles) ⇒ %ΔK = 2(100) + 100²/100 = 300% increase (K becomes 4K).',
      hi: 'p में 100% वृद्धि (दुगुना) ⇒ %ΔK = 2(100) + 100²/100 = 300% वृद्धि (K, 4K हो जाती है)।',
    },
    simId: 'impulse-momentum',
  },
  {
    id: 'sc-02',
    chapterId: 'kinematics',
    category: 'Mechanics',
    title: { en: 'Projectile Range–Height Golden Identity', hi: 'प्रक्षेप्य परास-ऊँचाई स्वर्णिम सूत्र' },
    formulaTrick: 'R·tanθ = 4H   (At θ = 45° ⇒ R_max = 4H)',
    whenToUse: {
      en: 'Instantaneously links range R, max height H, and launch angle θ without computing u or g.',
      hi: 'u या g निकाले बिना परास R, अधिकतम ऊँचाई H और प्रक्षेपण कोण θ को तुरंत जोड़ने के लिए।',
    },
    workedExample: {
      en: 'If R = H, then tanθ = 4 ⇒ θ = tan⁻¹(4) ≈ 76°. If R_max = 100 m, then H = 25 m.',
      hi: 'यदि R = H, तो tanθ = 4 ⇒ θ = tan⁻¹(4) ≈ 76°। यदि R_max = 100 m, तो H = 25 m।',
    },
    simId: 'projectile',
  },
  {
    id: 'sc-03',
    chapterId: 'motion-1d',
    category: 'Mechanics',
    title: { en: 'Braking Distance Square Law', hi: 'ब्रेक लगाने की दूरी का वर्ग नियम' },
    formulaTrick: 's_stop = u² / (2a)  ⇒  s₂ / s₁ = (u₂ / u₁)²',
    whenToUse: {
      en: 'Same brakes/road means constant retardation a. Just square the speed ratio!',
      hi: 'समान ब्रेक/सड़क का अर्थ है नियत मंदन a। केवल चाल के अनुपात का वर्ग करें!',
    },
    workedExample: {
      en: 'Car stops in 8 m at 40 km/h. At 80 km/h (2× speed), stopping distance = 2² × 8 = 32 m.',
      hi: '40 km/h पर कार 8 m में रुकती है। 80 km/h (2× चाल) पर दूरी = 2² × 8 = 32 m।',
    },
    simId: 'motion-1d',
  },
  {
    id: 'sc-04',
    chapterId: 'gravitation',
    category: 'Mechanics',
    title: { en: 'Altitude vs Depth Equal-g Ratio', hi: 'ऊँचाई बनाम गहराई समान-g अनुपात' },
    formulaTrick: 'g_h ≈ g(1 − 2h/R),  g_d = g(1 − d/R)  ⇒  d = 2h',
    whenToUse: {
      en: 'For small h ≪ R, gravity drops twice as fast going UP as going DOWN into a mine.',
      hi: 'छोटी ऊँचाई h ≪ R के लिए, ऊपर जाने पर g नीचे गहराई की तुलना में दोगुनी तेजी से घटता है।',
    },
    workedExample: {
      en: 'Same g as at height 32 km above Earth occurs at depth d = 2 × 32 = 64 km.',
      hi: '32 km ऊँचाई के बराबर g का मान d = 2 × 32 = 64 km गहराई पर मिलेगा।',
    },
    simId: 'gravity-variation',
  },
  {
    id: 'sc-05',
    chapterId: 'gravitation',
    category: 'Mechanics',
    title: { en: 'Escape vs Orbital Speed 41.4% Rule', hi: 'पलायन बनाम कक्षीय चाल 41.4% नियम' },
    formulaTrick: 'v_e = √2 · v_o ≈ 1.414 v_o  (+41.4% speed / +100% KE)',
    whenToUse: {
      en: 'Asked how much extra speed or KE is needed for a near-Earth satellite to escape.',
      hi: 'जब पूछा जाए कि उपग्रह को पलायन करने के लिए कितनी अतिरिक्त चाल या KE चाहिए।',
    },
    workedExample: {
      en: 'Near Earth v_o = 7.92 km/s ⇒ v_e = 11.2 km/s. Increasing speed by 41.4% makes it escape.',
      hi: 'पृथ्वी के निकट v_o = 7.92 km/s ⇒ v_e = 11.2 km/s। चाल 41.4% बढ़ाने पर उपग्रह पलायन कर जाएगा।',
    },
    simId: 'escape-velocity',
  },
  {
    id: 'sc-06',
    chapterId: 'rotational',
    category: 'Mechanics',
    title: { en: 'Earth Shrinking Day-Length Trap', hi: 'पृथ्वी सिकुड़ने पर दिन की अवधि ट्रिक' },
    formulaTrick: 'Iω = const  ⇒  R² / T = const  ⇒  T₂ = T₁ (R₂/R₁)²',
    whenToUse: {
      en: 'If Earth shrinks to 1/n of its radius with same mass, new day length becomes 24 / n² hours.',
      hi: 'यदि समान द्रव्यमान रहते हुए पृथ्वी की त्रिज्या 1/n हो जाए, तो नया दिन = 24 / n² घंटे।',
    },
    workedExample: {
      en: 'Radius becomes half (n = 2) ⇒ New day = 24 / 2² = 6 hours.',
      hi: 'त्रिज्या आधी (n = 2) होने पर ⇒ नया दिन = 24 / 2² = 6 घंटे।',
    },
    simId: 'angular-momentum',
  },
  {
    id: 'sc-07',
    chapterId: 'solids-elasticity',
    category: 'Mechanics',
    title: { en: 'Wire Stretching Radius-Square Rule', hi: 'तार खिंचाव त्रिज्या-वर्ग नियम' },
    formulaTrick: 'ΔL = FL / (πr²Y)  ⇒  ΔL ∝ L / r²',
    whenToUse: {
      en: 'Two wires of same material & load with different lengths and radii/diameters.',
      hi: 'समान पदार्थ और भार के दो तारों की लंबाई और त्रिज्या/व्यास की तुलना के लिए।',
    },
    workedExample: {
      en: 'Length doubled (2×) and radius doubled (2×) ⇒ ΔL′ = (2 / 2²) ΔL = ΔL / 2.',
      hi: 'लंबाई दुगुनी (2×) और त्रिज्या दुगुनी (2×) ⇒ ΔL′ = (2 / 2²) ΔL = ΔL / 2।',
    },
    simId: 'solids-elasticity',
  },
  {
    id: 'sc-08',
    chapterId: 'fluids',
    category: 'Mechanics',
    title: { en: 'Drop vs Soap Bubble Pressure & Terminal Speed', hi: 'बूँद बनाम बुलबुला दाब व सीमांत वेग' },
    formulaTrick: 'ΔP_drop = 2T/R,  ΔP_bubble = 4T/R,  v_t ∝ r²',
    whenToUse: {
      en: 'Quick comparison of excess pressure (bubble has 2 surfaces!) and Stokes terminal velocity.',
      hi: 'आधिक्य दाब (बुलबुले में 2 पृष्ठ!) और स्टोक्स सीमांत वेग के त्वरित अनुपात के लिए।',
    },
    workedExample: {
      en: '8 identical raindrops merge ⇒ R = 8^(1/3)r = 2r ⇒ new terminal velocity = 2² v = 4v.',
      hi: '8 समान बूँदें मिलकर बड़ी बूँद बनाती हैं ⇒ R = 2r ⇒ नया सीमांत वेग = 2² v = 4v।',
    },
    simId: 'stokes-terminal',
  },
  {
    id: 'sc-09',
    chapterId: 'laws-of-motion',
    category: 'Mechanics',
    title: { en: 'Lift Apparent Weight One-Line Rule', hi: 'लिफ्ट में आभासी भार एक-पंक्ति नियम' },
    formulaTrick: 'Up accel: N = m(g+a) | Down accel: N = m(g−a) | Free fall: N = 0',
    whenToUse: {
      en: 'Constant velocity (up or down) always gives a = 0 ⇒ N = mg! Only acceleration changes weight.',
      hi: 'नियत वेग (ऊपर या नीचे) में हमेशा a = 0 ⇒ N = mg! केवल त्वरण से भार बदलता है।',
    },
    workedExample: {
      en: '60 kg man in lift accelerating down at g/2 ⇒ N = 60(10 − 5) = 300 N (feels half weight).',
      hi: 'g/2 से नीचे त्वरित लिफ्ट में 60 kg व्यक्ति ⇒ N = 60(10 − 5) = 300 N (आधा भार)।',
    },
    simId: 'newtons-force',
  },

  // --- THERMAL & WAVES (7) ---
  {
    id: 'sc-10',
    chapterId: 'thermal-matter',
    category: 'Thermal & Waves',
    title: { en: 'Stefan T⁴ Power & Wien λT Inverse Rule', hi: 'स्टीफन T⁴ शक्ति और वीन λT नियम' },
    formulaTrick: 'E₂/E₁ = (T₂/T₁)⁴   &   λ₂/λ₁ = T₁/T₂  (Kelvin ONLY)',
    whenToUse: {
      en: 'Always convert °C to Kelvin (+273) first! Never take a ratio directly in Celsius.',
      hi: 'हमेशा पहले °C को केल्विन (+273) में बदलें! सीधे सेल्सियस में अनुपात कभी न लें।',
    },
    workedExample: {
      en: 'T rises from 27°C (300 K) to 327°C (600 K) ⇒ T doubles ⇒ Radiation E becomes 2⁴ = 16 times!',
      hi: 'T 27°C (300 K) से 327°C (600 K) हुआ ⇒ T दुगुना ⇒ विकिरण E, 2⁴ = 16 गुना हो गया!',
    },
    simId: 'blackbody-cooling',
  },
  {
    id: 'sc-11',
    chapterId: 'thermodynamics',
    category: 'Thermal & Waves',
    title: { en: 'Carnot Engine Kelvin Efficiency Shortcut', hi: 'कार्नो इंजन केल्विन दक्षता शॉर्टकट' },
    formulaTrick: 'η = 1 − (T_sink / T_source) = (T₁ − T₂) / T₁',
    whenToUse: {
      en: 'Maximum possible efficiency between two temperatures. Remember T₁ > T₂ in Kelvin.',
      hi: 'दो तापों के बीच अधिकतम संभव दक्षता। हमेशा T₁ > T₂ केल्विन में रखें।',
    },
    workedExample: {
      en: 'Between 327°C (600 K) and 27°C (300 K) ⇒ η = 1 − 300/600 = 0.5 = 50%.',
      hi: '327°C (600 K) और 27°C (300 K) के बीच ⇒ η = 1 − 300/600 = 0.5 = 50%।',
    },
    simId: 'carnot-engine',
  },
  {
    id: 'sc-12',
    chapterId: 'thermal-matter',
    category: 'Thermal & Waves',
    title: { en: 'Thermal Expansion 1 : 2 : 3 Ratio', hi: 'ऊष्मीय प्रसार 1 : 2 : 3 अनुपात' },
    formulaTrick: 'α : β : γ = 1 : 2 : 3   (β = 2α, γ = 3α)',
    whenToUse: {
      en: 'Convert linear α to area β or volume γ expansion coefficients in 3 seconds.',
      hi: 'रेखीय α को क्षेत्रीय β या आयतन γ प्रसार गुणांक में 3 सेकंड में बदलने के लिए।',
    },
    workedExample: {
      en: 'If linear expansion α = 1.2 × 10⁻⁵ /°C, then volume expansion γ = 3α = 3.6 × 10⁻⁵ /°C.',
      hi: 'यदि α = 1.2 × 10⁻⁵ /°C, तो आयतन प्रसार गुणांक γ = 3α = 3.6 × 10⁻⁵ /°C।',
    },
    simId: 'thermal-matter',
  },
  {
    id: 'sc-13',
    chapterId: 'kinetic-theory',
    category: 'Thermal & Waves',
    title: { en: 'RMS Speed Ratio of Two Gases', hi: 'दो गैसों की RMS चाल का अनुपात' },
    formulaTrick: 'v_rms ∝ √(T / M)   ⇒   v₁/v₂ = √(T₁M₂ / T₂M₁)',
    whenToUse: {
      en: 'Comparing H₂ (M=2) and O₂ (M=32) or temperature doubling traps.',
      hi: 'H₂ (M=2) व O₂ (M=32) की तुलना या ताप बढ़ाने पर चाल ज्ञात करने के लिए।',
    },
    workedExample: {
      en: 'At same T, v(H₂) / v(O₂) = √(32/2) = √16 = 4 : 1.',
      hi: 'समान ताप पर, v(H₂) / v(O₂) = √(32/2) = √16 = 4 : 1।',
    },
    simId: 'kinetic-theory',
  },
  {
    id: 'sc-14',
    chapterId: 'oscillations',
    category: 'Thermal & Waves',
    title: { en: 'Pendulum Length & Spring Cut Shortcuts', hi: 'लोलक लंबाई और स्प्रिंग काटने की ट्रिक' },
    formulaTrick: 'T ∝ √(L/g)  |  Spring cut in n equal parts ⇒ k′ = n·k',
    whenToUse: {
      en: 'For small %ΔL: %ΔT ≈ ½(%ΔL). Cutting a spring makes each piece stiffer (n times k)!',
      hi: 'छोटे %ΔL के लिए: %ΔT ≈ ½(%ΔL)। स्प्रिंग को n भागों में काटने पर प्रत्येक का k′ = nk हो जाता है!',
    },
    workedExample: {
      en: 'Pendulum length increases by 4% ⇒ Time period increases by ½ × 4% = 2%.',
      hi: 'लोलक की लंबाई 4% बढ़ी ⇒ आवर्तकाल ½ × 4% = 2% बढ़ जाएगा।',
    },
    simId: 'simple-pendulum',
  },
  {
    id: 'sc-15',
    chapterId: 'waves',
    category: 'Thermal & Waves',
    title: { en: 'Open vs Closed Organ Pipe Instant Rule', hi: 'खुला बनाम बंद ऑर्गन पाइप नियम' },
    formulaTrick: 'f_open = v/(2L) [1:2:3]  |  f_closed = v/(4L) [1:3:5]  ⇒  f_open = 2·f_closed',
    whenToUse: {
      en: 'Same length L: open pipe fundamental is double the closed pipe fundamental.',
      hi: 'समान लंबाई L के लिए खुले पाइप की मूल आवृत्ति बंद पाइप की दुगुनी होती है।',
    },
    workedExample: {
      en: 'Closed pipe fundamental = 200 Hz. If closed end is opened ⇒ new fundamental = 400 Hz.',
      hi: 'बंद पाइप की मूल आवृत्ति = 200 Hz। सिरा खोलने पर नई मूल आवृत्ति = 400 Hz।',
    },
    simId: 'organ-pipes-beats',
  },
  {
    id: 'sc-16',
    chapterId: 'waves',
    category: 'Thermal & Waves',
    title: { en: 'Waxing / Filing Tuning Fork Beat Rule', hi: 'मोम लगाने / रेतने पर विस्पंद नियम' },
    formulaTrick: 'Waxing (loading) ⇒ f ↓   |   Filing (shaving) ⇒ f ↑',
    whenToUse: {
      en: 'To identify unknown tuning fork frequency f_x = f_known ± b in 10 seconds.',
      hi: 'अज्ञात स्वरित्र की आवृत्ति f_x = f_ज्ञात ± b को 10 सेकंड में पहचानने के लिए।',
    },
    workedExample: {
      en: 'Fork A gives 4 beats with 256 Hz (so 260 or 252). Waxing A lowers beats to 2 ⇒ A must be 260 Hz.',
      hi: 'स्वरित्र A, 256 Hz संग 4 विस्पंद देता है (260 या 252)। मोम लगाने पर विस्पंद घटे (2) ⇒ A = 260 Hz।',
    },
    simId: 'organ-pipes-beats',
  },

  // --- ELECTRICITY & MAGNETISM (7) ---
  {
    id: 'sc-17',
    chapterId: 'current-electricity',
    category: 'Electricity & Magnetism',
    title: { en: 'Wire Stretching n² Resistance Shortcut', hi: 'तार खींचने पर n² प्रतिरोध शॉर्टकट' },
    formulaTrick: 'Stretched to nL: R′ = n²R   |   Radius → r/n: R′ = n⁴R',
    whenToUse: {
      en: 'Volume stays constant when stretched or melted & recast! (Different from simply cutting.)',
      hi: 'खींचने या पिघलाकर पुनः ढालने पर आयतन नियत रहता है! (केवल काटने से भिन्न।)',
    },
    workedExample: {
      en: '10 Ω wire stretched to 3× its length ⇒ R′ = 3² × 10 = 90 Ω.',
      hi: '10 Ω के तार को 3 गुना लंबा खींचा गया ⇒ R′ = 3² × 10 = 90 Ω।',
    },
    simId: 'ohms-law',
  },
  {
    id: 'sc-18',
    chapterId: 'current-electricity',
    category: 'Electricity & Magnetism',
    title: { en: 'Potentiometer Internal Resistance Formula', hi: 'विभवमापी आंतरिक प्रतिरोध सूत्र' },
    formulaTrick: 'r = R · (l₁ − l₂) / l₂',
    whenToUse: {
      en: 'l₁ = open-circuit balance length (emf E), l₂ = shunted balance length (terminal V) with resistance R.',
      hi: 'l₁ = खुले परिपथ में संतुलन लंबाई (E), l₂ = प्रतिरोध R जोड़ने पर संतुलन लंबाई (V)।',
    },
    workedExample: {
      en: 'l₁ = 60 cm, l₂ = 50 cm with R = 10 Ω ⇒ r = 10 × (60−50)/50 = 2 Ω.',
      hi: 'l₁ = 60 cm, l₂ = 50 cm व R = 10 Ω ⇒ r = 10 × (60−50)/50 = 2 Ω।',
    },
    simId: 'potentiometer-cells',
  },
  {
    id: 'sc-19',
    chapterId: 'current-electricity',
    category: 'Electricity & Magnetism',
    title: { en: 'Identical Bulbs Series vs Parallel Brightness', hi: 'बल्बों की श्रेणी बनाम समांतर चमक' },
    formulaTrick: 'R_bulb = V² / P_rated  ⇒  Series: lower W glows brighter | Parallel: higher W glows brighter',
    whenToUse: {
      en: 'Classic Airforce X trap comparing 40 W and 100 W bulbs rated for 220 V.',
      hi: '220 V के 40 W व 100 W बल्बों की चमक की तुलना वाला प्रसिद्ध एयरफोर्स X प्रश्न।',
    },
    workedExample: {
      en: '40 W has higher R than 100 W. In series (same I), P = I²R ⇒ 40 W glows brighter!',
      hi: '40 W का प्रतिरोध 100 W से अधिक है। श्रेणी में (समान I), P = I²R ⇒ 40 W अधिक चमकेगा!',
    },
    simId: 'charge-current-power',
  },
  {
    id: 'sc-20',
    chapterId: 'capacitance',
    category: 'Electricity & Magnetism',
    title: { en: 'Dielectric Slab: Battery Connected vs Disconnected', hi: 'परावैद्युत पट्टी: बैटरी जुड़ी बनाम अलग' },
    formulaTrick: 'Connected (V const): C→KC, Q→KQ, U→KU  |  Disconnected (Q const): C→KC, V→V/K, U→U/K',
    whenToUse: {
      en: 'Eliminates 100% of confusion on capacitance, voltage, and stored energy after inserting K.',
      hi: 'K डालने के बाद धारिता, विभव और संचित ऊर्जा पर 100% भ्रम समाप्त करता है।',
    },
    workedExample: {
      en: 'Battery disconnected and K = 4 slab inserted ⇒ Voltage drops to V/4 and Energy drops to U/4.',
      hi: 'बैटरी हटाकर K = 4 पट्टी डाली गई ⇒ विभव V/4 और ऊर्जा U/4 हो जाती है।',
    },
    simId: 'capacitance',
  },
  {
    id: 'sc-21',
    chapterId: 'moving-charges',
    category: 'Electricity & Magnetism',
    title: { en: 'Cyclotron Radius & Time Period Independence', hi: 'साइक्लोट्रॉन त्रिज्या व आवर्तकाल नियम' },
    formulaTrick: 'r = mv/(qB) = √(2mK)/(qB)   |   T = 2πm/(qB) (independent of v & r!)',
    whenToUse: {
      en: 'Comparing proton, deuteron, and α-particle radii or asked if T changes when speed doubles.',
      hi: 'प्रोटॉन, ड्यूटेरॉन व α-कण की त्रिज्या तुलना या चाल बदलने पर आवर्तकाल का प्रभाव।',
    },
    workedExample: {
      en: 'Same K in same B: r ∝ √m / q ⇒ r_p : r_d : r_α = 1 : √2 : 1.',
      hi: 'समान K व B में: r ∝ √m / q ⇒ r_p : r_d : r_α = 1 : √2 : 1।',
    },
    simId: 'lorentz-force',
  },
  {
    id: 'sc-22',
    chapterId: 'ac-circuits',
    category: 'Electricity & Magnetism',
    title: { en: 'AC Peak ↔ RMS & Resonance Fast Check', hi: 'AC शिखर ↔ RMS और अनुनाद जाँच' },
    formulaTrick: 'V_rms = V₀/√2 ≈ 0.707 V₀  |  At Resonance: X_L = X_C, Z = R, cosφ = 1',
    whenToUse: {
      en: 'Household 220 V AC is ALWAYS RMS; peak voltage is 220√2 ≈ 311 V.',
      hi: 'घरेलू 220 V AC हमेशा RMS मान है; शिखर वोल्टता 220√2 ≈ 311 V होती है।',
    },
    workedExample: {
      en: 'If i = 10√2 sin(100πt) A, then I_rms = 10 A and frequency f = 100π/(2π) = 50 Hz.',
      hi: 'यदि i = 10√2 sin(100πt) A, तो I_rms = 10 A और आवृत्ति f = 100π/(2π) = 50 Hz।',
    },
    simId: 'ac-circuits',
  },
  {
    id: 'sc-23',
    chapterId: 'em-waves',
    category: 'Electricity & Magnetism',
    title: { en: 'EM Wave Speed & Field Amplitude Link', hi: 'EM तरंग चाल व क्षेत्र आयाम संबंध' },
    formulaTrick: 'c = 1 / √(μ₀ε₀) = E₀ / B₀ = 3 × 10⁸ m/s',
    whenToUse: {
      en: 'Find B₀ from E₀ in 2 seconds or check dimensions of 1/√(μ₀ε₀) = [LT⁻¹].',
      hi: 'E₀ से 2 सेकंड में B₀ निकालें या 1/√(μ₀ε₀) की विमा [LT⁻¹] जाँचें।',
    },
    workedExample: {
      en: 'If E₀ = 60 V/m, then B₀ = E₀ / c = 60 / (3×10⁸) = 2 × 10⁻⁷ T.',
      hi: 'यदि E₀ = 60 V/m, तो B₀ = 60 / (3×10⁸) = 2 × 10⁻⁷ T।',
    },
    simId: 'em-waves',
  },

  // --- OPTICS & MODERN (7) ---
  {
    id: 'sc-24',
    chapterId: 'ray-optics',
    category: 'Optics & Modern',
    title: { en: 'Myopia & Hypermetropia Power One-Shot', hi: 'निकटदृष्टि व दूरदृष्टि लेंस क्षमता ट्रिक' },
    formulaTrick: 'Myopia: f = −(Far Point) ⇒ P < 0 (Concave)  |  Hypermetropia: 1/f = 1/0.25 − 1/d_near ⇒ P > 0 (Convex)',
    whenToUse: {
      en: 'Instant calculation of corrective spectacles power in diopters (f in metres).',
      hi: 'डायोप्टर में चश्मे के लेंस की क्षमता की त्वरित गणना (f मीटर में)।',
    },
    workedExample: {
      en: 'Myopic far point = 2 m ⇒ f = −2 m ⇒ P = 1/(−2) = −0.5 D (Concave lens).',
      hi: 'निकटदृष्टि दूर बिंदु = 2 m ⇒ f = −2 m ⇒ P = −0.5 D (अवतल लेंस)।',
    },
    simId: 'eye-defects',
  },
  {
    id: 'sc-25',
    chapterId: 'ray-optics',
    category: 'Optics & Modern',
    title: { en: 'Plane Mirror Image Count & Speed Rules', hi: 'समतल दर्पण प्रतिबिंब संख्या व चाल नियम' },
    formulaTrick: 'n = (360°/θ) − 1 (if even)  |  Mirror rotated by θ ⇒ Reflected ray turns 2θ',
    whenToUse: {
      en: 'Two inclined mirrors or man walking toward a plane mirror (relative image speed = 2v).',
      hi: 'दो झुके दर्पणों में प्रतिबिंब या समतल दर्पण की ओर चलते व्यक्ति के प्रतिबिंब की चाल (2v)।',
    },
    workedExample: {
      en: 'Two mirrors at θ = 60° ⇒ 360/60 = 6 (even) ⇒ n = 6 − 1 = 5 images.',
      hi: 'θ = 60° पर दो दर्पण ⇒ 360/60 = 6 (सम) ⇒ n = 6 − 1 = 5 प्रतिबिंब।',
    },
    simId: 'thin-lens',
  },
  {
    id: 'sc-26',
    chapterId: 'wave-optics',
    category: 'Optics & Modern',
    title: { en: 'YDSE Fringe Width & Brewster Angle', hi: 'YDSE फ्रिंज चौड़ाई और ब्रूस्टर कोण' },
    formulaTrick: 'β = λD/d  (In liquid: β′ = β/μ)   |   Brewster: μ = tan(i_p) & i_p + r = 90°',
    whenToUse: {
      en: 'Immersing YDSE in water shrinks fringes by 1/μ; reflected & refracted rays are at 90° at Brewster angle.',
      hi: 'YDSE को जल में डुबोने पर β, 1/μ गुना हो जाती है; ब्रूस्टर कोण पर परावर्तित व अपवर्तित किरण 90° पर।',
    },
    workedExample: {
      en: 'If μ = √3, Brewster polarizing angle i_p = tan⁻¹(√3) = 60°.',
      hi: 'यदि μ = √3, तो ब्रूस्टर ध्रुवण कोण i_p = tan⁻¹(√3) = 60°।',
    },
    simId: 'wave-optics',
  },
  {
    id: 'sc-27',
    chapterId: 'dual-nature',
    category: 'Optics & Modern',
    title: { en: 'Electron de Broglie 12.27/√V Shortcut', hi: 'इलेक्ट्रॉन डी-ब्रॉग्ली 12.27/√V शॉर्टकट' },
    formulaTrick: 'λ_electron = 12.27 / √V  Å',
    whenToUse: {
      en: 'Skip h, m, and e constants completely when an electron is accelerated through V volts.',
      hi: 'V वोल्ट से त्वरित इलेक्ट्रॉन के लिए h, m और e के मान रखे बिना सीधे तरंगदैर्घ्य निकालें।',
    },
    workedExample: {
      en: 'V = 100 V ⇒ λ = 12.27 / √100 = 1.227 Å. For V = 10,000 V ⇒ λ = 0.1227 Å.',
      hi: 'V = 100 V ⇒ λ = 12.27 / 10 = 1.227 Å। V = 10,000 V के लिए ⇒ λ = 0.1227 Å।',
    },
    simId: 'de-broglie',
  },
  {
    id: 'sc-28',
    chapterId: 'nuclei',
    category: 'Optics & Modern',
    title: { en: 'Half-Life Fraction & Mean Life Shortcut', hi: 'अर्ध-आयु अंश और औसत आयु शॉर्टकट' },
    formulaTrick: 'N/N₀ = (1/2)^n where n = t/T½   |   τ = T½ / 0.693 ≈ 1.44 T½',
    whenToUse: {
      en: 'Count how many half-lives n fit into total time t, then raise ½ to power n.',
      hi: 'कुल समय t में अर्ध-आयु की संख्या n गिनें और (½)^n निकालें।',
    },
    workedExample: {
      en: 'After 3 half-lives: Remaining = (½)³ = 1/8 (12.5%), Decayed = 7/8 (87.5%).',
      hi: '3 अर्ध-आयु के बाद: शेष = (½)³ = 1/8 (12.5%), क्षयित = 7/8 (87.5%)।',
    },
    simId: 'nuclei',
  },
  {
    id: 'sc-29',
    chapterId: 'semiconductors',
    category: 'Optics & Modern',
    title: { en: 'Transistor α ↔ β Instant Converter', hi: 'ट्रांजिस्टर α ↔ β त्वरित रूपांतरण' },
    formulaTrick: 'β = α / (1 − α)   &   α = β / (1 + β)   |   A_p = β · A_v',
    whenToUse: {
      en: 'Note α is always slightly less than 1 (0.95–0.99), while β is large (20–100).',
      hi: 'α हमेशा 1 से थोड़ा कम (0.95–0.99) होता है, जबकि β बड़ा (20–100) होता है।',
    },
    workedExample: {
      en: 'If α = 0.98 ⇒ β = 0.98 / (1 − 0.98) = 0.98 / 0.02 = 49.',
      hi: 'यदि α = 0.98 ⇒ β = 0.98 / 0.02 = 49।',
    },
    simId: 'transistor-zener',
  },
  {
    id: 'sc-30',
    chapterId: 'communication-systems',
    category: 'Optics & Modern',
    title: { en: 'TV Tower Range & AM Power Shortcuts', hi: 'TV टावर परास और AM शक्ति शॉर्टकट' },
    formulaTrick: 'd = √(2Rh)  |  Area = 2πRh  |  P_total = P_c (1 + m²/2)',
    whenToUse: {
      en: 'Use R = 6.4 × 10⁶ m. For 100% AM modulation (m = 1), P_total = 1.5 P_c (sidebands = 1/3 total).',
      hi: 'R = 6.4 × 10⁶ m लें। 100% AM मॉडुलन (m=1) पर P_total = 1.5 P_c (साइडबैंड = कुल का 1/3)।',
    },
    workedExample: {
      en: 'h = 80 m ⇒ d = √(2 × 6.4×10⁶ × 80) = √(1024×10⁶) = 32,000 m = 32 km.',
      hi: 'h = 80 m ⇒ d = √(2 × 6.4×10⁶ × 80) = 32 km।',
    },
    simId: 'communication-systems',
  },
];

// ============================================================================
// 40 HIGH-YIELD ONE-LINER RAPID REVISION FLASHCARDS
// ============================================================================
export const AIRFORCE_X_FLASHCARDS: AirforceFlashcard[] = [
  // --- UNITS & DIMENSIONS (8) ---
  {
    id: 'fc-01',
    chapterId: 'units-measurements',
    category: 'Units & Dimensions',
    prompt: { en: 'Dimensions of Universal Gravitational Constant G?', hi: 'सार्वत्रिक गुरुत्वाकर्षण नियतांक G की विमा क्या है?' },
    answer: { en: '[M⁻¹ L³ T⁻²] — derived from G = Fr²/(m₁m₂).', hi: '[M⁻¹ L³ T⁻²] — G = Fr²/(m₁m₂) से प्राप्त।' },
  },
  {
    id: 'fc-02',
    chapterId: 'units-measurements',
    category: 'Units & Dimensions',
    prompt: { en: 'Which physical quantity has the same dimensions as Planck’s constant h?', hi: 'प्लांक नियतांक h के समान विमा किस भौतिक राशि की होती है?' },
    answer: { en: 'Angular Momentum L — both have [M L² T⁻¹] (J·s).', hi: 'कोणीय संवेग L — दोनों की विमा [M L² T⁻¹] (J·s) होती है।' },
  },
  {
    id: 'fc-03',
    chapterId: 'units-measurements',
    category: 'Units & Dimensions',
    prompt: { en: 'Dimensions of Coefficient of Viscosity η and its CGS unit?', hi: 'श्यानता गुणांक η की विमा और इसका CGS मात्रक क्या है?' },
    answer: { en: '[M L⁻¹ T⁻¹]; CGS unit = Poise (1 Pa·s = 10 Poise).', hi: '[M L⁻¹ T⁻¹]; CGS मात्रक = प्वाइज़ (1 Pa·s = 10 प्वाइज़)।' },
  },
  {
    id: 'fc-04',
    chapterId: 'units-measurements',
    category: 'Units & Dimensions',
    prompt: { en: 'Light year and Parsec are units of which physical quantity?', hi: 'प्रकाश वर्ष और पारसेक किस भौतिक राशि के मात्रक हैं?' },
    answer: { en: 'Astronomical Distance (NOT time). 1 Parsec ≈ 3.26 Light Years.', hi: 'खगोलीय दूरी (समय नहीं)। 1 पारसेक ≈ 3.26 प्रकाश वर्ष।' },
  },
  {
    id: 'fc-05',
    chapterId: 'units-measurements',
    category: 'Units & Dimensions',
    prompt: { en: 'Dimensions of RC (time constant) and L/R?', hi: 'RC (समय नियतांक) और L/R की विमा क्या होती है?' },
    answer: { en: 'Both equal Time [M⁰ L⁰ T¹] (seconds).', hi: 'दोनों की विमा समय [M⁰ L⁰ T¹] (सेकंड) होती है।' },
  },
  {
    id: 'fc-06',
    chapterId: 'units-measurements',
    category: 'Units & Dimensions',
    prompt: { en: 'Which pair has identical dimensions: Impulse & Momentum, or Torque & Work?', hi: 'आवेग-संवेग और बल आघूर्ण-कार्य की विमाएँ कैसी होती हैं?' },
    answer: { en: 'BOTH pairs match! Impulse = Momentum [MLT⁻¹]; Torque = Work = Energy [ML²T⁻²].', hi: 'दोनों जोड़े समान हैं! आवेग = संवेग [MLT⁻¹]; बल आघूर्ण = कार्य [ML²T⁻²]।' },
  },
  {
    id: 'fc-07',
    chapterId: 'units-measurements',
    category: 'Units & Dimensions',
    prompt: { en: 'Dimensions of Surface Tension T and Spring Constant k?', hi: 'पृष्ठ तनाव T और स्प्रिंग नियतांक k की विमा क्या है?' },
    answer: { en: 'Both have [M L⁰ T⁻²] (N/m).', hi: 'दोनों की विमा [M L⁰ T⁻²] (N/m) होती है।' },
  },
  {
    id: 'fc-08',
    chapterId: 'units-measurements',
    category: 'Units & Dimensions',
    prompt: { en: 'Which dimensionless quantities still have SI units?', hi: 'कौन सी विमाहीन राशियाँ फिर भी SI मात्रक रखती हैं?' },
    answer: { en: 'Plane angle (radian) and Solid angle (steradian).', hi: 'समतल कोण (रेडियन) और घन कोण (स्टेरेडियन)।' },
  },

  // --- MECHANICS (8) ---
  {
    id: 'fc-09',
    chapterId: 'kinematics',
    category: 'Mechanics',
    prompt: { en: 'At the highest point of a projectile, what is the angle between velocity and acceleration?', hi: 'प्रक्षेप्य के उच्चतम बिंदु पर वेग और त्वरण के बीच कोण कितना होता है?' },
    answer: { en: '90° — velocity is purely horizontal (u·cosθ) while g points vertically downward.', hi: '90° — वेग केवल क्षैतिज (u·cosθ) और त्वरण g ऊर्ध्वाधर नीचे होता है।' },
  },
  {
    id: 'fc-10',
    chapterId: 'gravitation',
    category: 'Mechanics',
    prompt: { en: 'Value of g at the center of Earth & weight of an object there?', hi: 'पृथ्वी के केंद्र पर g का मान और वस्तु का भार कितना होता है?' },
    answer: { en: 'g = 0 and Weight = 0 (though Mass remains unchanged!).', hi: 'g = 0 और भार = 0 (लेकिन द्रव्यमान अपरिवर्तित रहता है!)।' },
  },
  {
    id: 'fc-11',
    chapterId: 'gravitation',
    category: 'Mechanics',
    prompt: { en: 'Time period and height of a Geostationary Satellite?', hi: 'भू-तुल्यकाली उपग्रह का आवर्तकाल और ऊँचाई कितनी होती है?' },
    answer: { en: 'T = 24 hours, height ≈ 36,000 km above equator, revolves West → East.', hi: 'T = 24 घंटे, विषुवत के ऊपर ऊँचाई ≈ 36,000 km, पश्चिम → पूर्व परिक्रमा।' },
  },
  {
    id: 'fc-12',
    chapterId: 'gravitation',
    category: 'Mechanics',
    prompt: { en: 'Does Escape Velocity depend on the mass of the projected body or launch angle?', hi: 'क्या पलायन वेग प्रक्षेपित पिंड के द्रव्यमान या प्रक्षेपण कोण पर निर्भर करता है?' },
    answer: { en: 'NO — v_e = √(2gR) is independent of both projectile mass and angle of projection.', hi: 'नहीं — v_e = √(2gR) पिंड के द्रव्यमान और कोण दोनों से स्वतंत्र है।' },
  },
  {
    id: 'fc-13',
    chapterId: 'rotational',
    category: 'Mechanics',
    prompt: { en: 'Rolling race down an incline: Which reaches bottom FIRST — Solid Sphere, Disc, or Ring?', hi: 'आनत तल पर लुढ़कने में पहले कौन पहुँचेगा — ठोस गोला, चक्ति या वलय?' },
    answer: { en: 'Solid Sphere FIRST (smallest k²/R² = 2/5), Disc second (1/2), Ring LAST (1).', hi: 'ठोस गोला सबसे पहले (k²/R² = 2/5), चक्ति दूसरी (1/2), वलय सबसे अंत में (1)।' },
  },
  {
    id: 'fc-14',
    chapterId: 'solids-elasticity',
    category: 'Mechanics',
    prompt: { en: 'Why is Steel more elastic than Rubber?', hi: 'स्टील रबर से अधिक प्रत्यास्थ क्यों है?' },
    answer: { en: 'For the same stress, steel develops much smaller strain ⇒ higher Young’s modulus Y.', hi: 'समान प्रतिबल के लिए स्टील में विकृति बहुत कम होती है ⇒ यंग गुणांक Y अधिक।' },
  },
  {
    id: 'fc-15',
    chapterId: 'fluids',
    category: 'Mechanics',
    prompt: { en: 'Effect of increasing temperature on viscosity of liquids vs gases?', hi: 'ताप बढ़ाने पर द्रवों बनाम गैसों की श्यानता पर क्या प्रभाव पड़ता है?' },
    answer: { en: 'Liquids: Viscosity DECREASES. Gases: Viscosity INCREASES.', hi: 'द्रवों में श्यानता घटती है। गैसों में श्यानता बढ़ती है।' },
  },
  {
    id: 'fc-16',
    chapterId: 'fluids',
    category: 'Mechanics',
    prompt: { en: 'Why are falling raindrops spherical and why does oil spread on water?', hi: 'वर्षा की बूँदें गोल क्यों होती हैं और पानी पर तेल क्यों फैलता है?' },
    answer: { en: 'Spherical drops minimize surface area due to Surface Tension; detergent/oil lowers surface tension.', hi: 'पृष्ठ तनाव न्यूनतम क्षेत्रफल के लिए बूँद को गोल बनाता है; साबुन/तेल पृष्ठ तनाव घटाता है।' },
  },

  // --- THERMAL & WAVES (8) ---
  {
    id: 'fc-17',
    chapterId: 'thermal-matter',
    category: 'Thermal & Waves',
    prompt: { en: 'At what temperature is the density of water maximum and volume minimum?', hi: 'किस ताप पर जल का घनत्व अधिकतम और आयतन न्यूनतम होता है?' },
    answer: { en: '4°C (277 K) — anomalous expansion of water.', hi: '4°C (277 K) — जल का असामान्य प्रसार।' },
  },
  {
    id: 'fc-18',
    chapterId: 'thermal-matter',
    category: 'Thermal & Waves',
    prompt: { en: 'At what temperature do Celsius and Fahrenheit scales read the exact same value?', hi: 'किस ताप पर सेल्सियस और फारेनहाइट पैमाने समान मान दर्शाते हैं?' },
    answer: { en: '−40°C = −40°F.', hi: '−40°C = −40°F।' },
  },
  {
    id: 'fc-19',
    chapterId: 'thermodynamics',
    category: 'Thermal & Waves',
    prompt: { en: 'First Law of Thermodynamics is a restatement of which conservation law?', hi: 'ऊष्मागतिकी का प्रथम नियम किस संरक्षण नियम पर आधारित है?' },
    answer: { en: 'Conservation of Energy (ΔQ = ΔU + ΔW). Zeroth law defines Temperature.', hi: 'ऊर्जा संरक्षण (ΔQ = ΔU + ΔW)। शून्यवाँ नियम ताप की परिभाषा देता है।' },
  },
  {
    id: 'fc-20',
    chapterId: 'thermodynamics',
    category: 'Thermal & Waves',
    prompt: { en: 'Ratio of Adiabatic slope to Isothermal slope on a P–V diagram?', hi: 'P–V आरेख पर रुद्धोष्म ढाल और समतापी ढाल का अनुपात कितना होता है?' },
    answer: { en: 'γ = Cp / Cv (always steeper for adiabatic since γ > 1).', hi: 'γ = Cp / Cv (रुद्धोष्म वक्र हमेशा अधिक ढालू होता है क्योंकि γ > 1)।' },
  },
  {
    id: 'fc-21',
    chapterId: 'oscillations',
    category: 'Thermal & Waves',
    prompt: { en: 'What happens to a simple pendulum’s time period inside an orbiting satellite?', hi: 'परिक्रमा करते उपग्रह के भीतर सरल लोलक के आवर्तकाल का क्या होता है?' },
    answer: { en: 'g_eff = 0 ⇒ T = ∞ (it stops oscillating altogether).', hi: 'g_eff = 0 ⇒ T = ∞ (यह दोलन करना बंद कर देता है)।' },
  },
  {
    id: 'fc-22',
    chapterId: 'waves',
    category: 'Thermal & Waves',
    prompt: { en: 'Effect of Pressure, Temperature, and Humidity on speed of sound in air?', hi: 'वायु में ध्वनि की चाल पर दाब, ताप और आर्द्रता का क्या प्रभाव है?' },
    answer: { en: 'Pressure (at const T): NO effect. Temperature ↑: v ↑. Humidity ↑: v ↑ (moist air is lighter).', hi: 'दाब (नियत T): कोई प्रभाव नहीं। ताप ↑: चाल ↑। आर्द्रता ↑: चाल ↑ (नम वायु हल्की होती है)।' },
  },
  {
    id: 'fc-23',
    chapterId: 'waves',
    category: 'Thermal & Waves',
    prompt: { en: 'Which harmonics are present in a Closed Organ Pipe vs an Open Organ Pipe?', hi: 'बंद ऑर्गन पाइप बनाम खुले ऑर्गन पाइप में कौन से संनादी उपस्थित होते हैं?' },
    answer: { en: 'Closed: ODD harmonics only (1:3:5). Open: ALL harmonics (1:2:3) — richer musical quality.', hi: 'बंद: केवल विषम संनादी (1:3:5)। खुला: सभी संनादी (1:2:3) — अधिक मधुर ध्वनि।' },
  },
  {
    id: 'fc-24',
    chapterId: 'waves',
    category: 'Thermal & Waves',
    prompt: { en: 'Why can’t sound waves in air be polarized?', hi: 'वायु में ध्वनि तरंगों का ध्रुवण क्यों नहीं किया जा सकता?' },
    answer: { en: 'Sound waves in air are longitudinal; only transverse waves (like light) can be polarized.', hi: 'वायु में ध्वनि अनुदैर्ध्य तरंग है; केवल अनुप्रस्थ तरंगों (जैसे प्रकाश) का ध्रुवण होता है।' },
  },

  // --- ELECTRICITY & MAGNETISM (8) ---
  {
    id: 'fc-25',
    chapterId: 'current-electricity',
    category: 'Electricity & Magnetism',
    prompt: { en: 'Kirchhoff’s First Law (KCL) and Second Law (KVL) are based on which conservations?', hi: 'किरचॉफ का प्रथम नियम (KCL) और द्वितीय नियम (KVL) किन संरक्षणों पर आधारित हैं?' },
    answer: { en: 'KCL = Conservation of Charge; KVL = Conservation of Energy.', hi: 'KCL = आवेश संरक्षण; KVL = ऊर्जा संरक्षण।' },
  },
  {
    id: 'fc-26',
    chapterId: 'current-electricity',
    category: 'Electricity & Magnetism',
    prompt: { en: 'Why is a Potentiometer superior to a Voltmeter for measuring EMF?', hi: 'EMF मापने के लिए विभवमापी वोल्टमीटर से श्रेष्ठ क्यों है?' },
    answer: { en: 'At null point it draws ZERO current from the cell (acts as an ideal infinite-resistance voltmeter).', hi: 'शून्य विक्षेप पर यह सेल से शून्य धारा खींचता है (आदर्श अनंत-प्रतिरोध वोल्टमीटर जैसा)।' },
  },
  {
    id: 'fc-27',
    chapterId: 'moving-charges',
    category: 'Electricity & Magnetism',
    prompt: { en: 'How is a Galvanometer converted into (a) Ammeter and (b) Voltmeter?', hi: 'धारामापी को (a) अमीटर और (b) वोल्टमीटर में कैसे बदला जाता है?' },
    answer: { en: 'Ammeter: Low resistance shunt in PARALLEL. Voltmeter: High resistance in SERIES.', hi: 'अमीटर: समांतर में लघु शंट प्रतिरोध। वोल्टमीटर: श्रेणी में उच्च प्रतिरोध।' },
  },
  {
    id: 'fc-28',
    chapterId: 'moving-charges',
    category: 'Electricity & Magnetism',
    prompt: { en: 'Force between two parallel wires carrying currents in the SAME vs OPPOSITE direction?', hi: 'समान बनाम विपरीत दिशा में धारा ले जाने वाले दो समांतर तारों के बीच बल कैसा होता है?' },
    answer: { en: 'SAME direction: ATTRACT each other. OPPOSITE direction: REPEL each other.', hi: 'समान दिशा: आकर्षण बल। विपरीत दिशा: प्रतिकर्षण बल।' },
  },
  {
    id: 'fc-29',
    chapterId: 'magnetism-matter',
    category: 'Electricity & Magnetism',
    prompt: { en: 'Angle of Dip at Magnetic Equator and Magnetic Poles?', hi: 'चुंबकीय विषुवत रेखा और चुंबकीय ध्रुवों पर नमन कोण कितना होता है?' },
    answer: { en: 'Equator: 0° (needle horizontal). Poles: 90° (needle vertical).', hi: 'विषुवत: 0° (सुई क्षैतिज)। ध्रुव: 90° (सुई ऊर्ध्वाधर)।' },
  },
  {
    id: 'fc-30',
    chapterId: 'emi',
    category: 'Electricity & Magnetism',
    prompt: { en: 'Why is a Transformer core laminated with Soft Iron?', hi: 'ट्रांसफॉर्मर का क्रोड नरम लोहे की पटलित पत्तियों से क्यों बनता है?' },
    answer: { en: 'Lamination reduces Eddy Current loss; Soft iron reduces Hysteresis loss.', hi: 'पटलन भँवर धारा हानि कम करता है; नरम लोहा शैथिल्य हानि कम करता है।' },
  },
  {
    id: 'fc-31',
    chapterId: 'ac-circuits',
    category: 'Electricity & Magnetism',
    prompt: { en: 'Average power consumed over a full AC cycle in a pure Inductor or pure Capacitor?', hi: 'शुद्ध प्रेरक या शुद्ध संधारित्र में पूर्ण AC चक्र की औसत शक्ति कितनी होती है?' },
    answer: { en: 'ZERO (φ = 90° ⇒ cosφ = 0) — called Wattless Current.', hi: 'शून्य (φ = 90° ⇒ cosφ = 0) — इसे वाटहीन धारा कहते हैं।' },
  },
  {
    id: 'fc-32',
    chapterId: 'em-waves',
    category: 'Electricity & Magnetism',
    prompt: { en: 'Which EM wave has the highest frequency and which has the longest wavelength?', hi: 'किस EM तरंग की आवृत्ति सर्वाधिक और किसकी तरंगदैर्घ्य सर्वाधिक होती है?' },
    answer: { en: 'Highest frequency: Gamma rays. Longest wavelength: Radio waves.', hi: 'सर्वाधिक आवृत्ति: गामा किरणें। सर्वाधिक तरंगदैर्घ्य: रेडियो तरंगें।' },
  },

  // --- OPTICS & MODERN (8) ---
  {
    id: 'fc-33',
    chapterId: 'ray-optics',
    category: 'Optics & Modern',
    prompt: { en: 'Optical fibers, mirage, and diamond sparkle work on which phenomenon?', hi: 'ऑप्टिकल फाइबर, मृगमरीचिका और हीरे की चमक किस परिघटना पर आधारित हैं?' },
    answer: { en: 'Total Internal Reflection (TIR) — requires denser → rarer medium and i > i_c.', hi: 'पूर्ण आंतरिक परावर्तन (TIR) — सघन से विरल माध्यम और i > i_c आवश्यक।' },
  },
  {
    id: 'fc-34',
    chapterId: 'ray-optics',
    category: 'Optics & Modern',
    prompt: { en: 'Which mirror is used as vehicle rear-view mirror vs dentist/shaving mirror?', hi: 'वाहन के पश्च-दृश्य दर्पण बनाम दंत-चिकित्सक दर्पण में कौन से दर्पण उपयोग होते हैं?' },
    answer: { en: 'Rear-view: Convex (erect, wide field). Dentist/Shaving: Concave (virtual magnified close-up).', hi: 'पश्च-दृश्य: उत्तल (सीधा, विस्तृत दृश्य)। दंत-चिकित्सक: अवतल (बड़ा आभासी प्रतिबिंब)।' },
  },
  {
    id: 'fc-35',
    chapterId: 'ray-optics',
    category: 'Optics & Modern',
    prompt: { en: 'Corrective lenses for Myopia, Hypermetropia, and Astigmatism?', hi: 'निकटदृष्टि, दूरदृष्टि और अबिंदुकता के लिए सुधारात्मक लेंस कौन से हैं?' },
    answer: { en: 'Myopia → Concave | Hypermetropia → Convex | Astigmatism → Cylindrical lens.', hi: 'निकटदृष्टि → अवतल | दूरदृष्टि → उत्तल | अबिंदुकता → बेलनाकार लेंस।' },
  },
  {
    id: 'fc-36',
    chapterId: 'dual-nature',
    category: 'Optics & Modern',
    prompt: { en: 'In Photoelectric Effect, what controls (a) Photocurrent and (b) Stopping Potential?', hi: 'प्रकाश-विद्युत प्रभाव में (a) प्रकाश-धारा और (b) निरोधी विभव किससे नियंत्रित होते हैं?' },
    answer: { en: 'Photocurrent ∝ Intensity of light; Stopping potential V₀ depends ONLY on Frequency (ν > ν₀).', hi: 'प्रकाश-धारा ∝ प्रकाश की तीव्रता; निरोधी विभव V₀ केवल आवृत्ति (ν > ν₀) पर निर्भर करता है।' },
  },
  {
    id: 'fc-37',
    chapterId: 'nuclei',
    category: 'Optics & Modern',
    prompt: { en: 'Nuclear fission reactor: What is the role of Moderator (D₂O/Graphite) vs Control Rods (Cadmium)?', hi: 'नाभिकीय रिएक्टर में मंदक (D₂O/ग्रेफाइट) बनाम नियंत्रक छड़ें (कैडमियम) क्या करती हैं?' },
    answer: { en: 'Moderator slows fast neutrons to thermal speed; Control rods absorb excess neutrons.', hi: 'मंदक तीव्र न्यूट्रॉन को धीमा करते हैं; नियंत्रक छड़ें अतिरिक्त न्यूट्रॉन अवशोषित करती हैं।' },
  },
  {
    id: 'fc-38',
    chapterId: 'semiconductors',
    category: 'Optics & Modern',
    prompt: { en: 'Effect of increasing temperature on resistance of Metals vs Semiconductors?', hi: 'ताप बढ़ाने पर धातुओं बनाम अर्धचालकों के प्रतिरोध पर क्या प्रभाव पड़ता है?' },
    answer: { en: 'Metals (conductors): Resistance INCREASES. Semiconductors: Resistance DECREASES.', hi: 'धातु (चालक): प्रतिरोध बढ़ता है। अर्धचालक: प्रतिरोध घटता है।' },
  },
  {
    id: 'fc-39',
    chapterId: 'semiconductors',
    category: 'Optics & Modern',
    prompt: { en: 'Which diode operates in Reverse Breakdown as a Voltage Regulator?', hi: 'कौन सा डायोड पश्च भंजन में वोल्टता नियंत्रक के रूप में कार्य करता है?' },
    answer: { en: 'Zener Diode (heavily doped P–N junction). LED & Solar cell use forward/zero bias.', hi: 'जेनर डायोड (अत्यधिक मादित P–N संधि)।' },
  },
  {
    id: 'fc-40',
    chapterId: 'communication-systems',
    category: 'Optics & Modern',
    prompt: { en: 'Minimum practical antenna height and propagation mode for TV/Radar (>40 MHz)?', hi: 'न्यूनतम व्यावहारिक एंटीना ऊँचाई और TV/रडार (>40 MHz) का संचरण प्रकार क्या है?' },
    answer: { en: 'Antenna height = λ / 4; TV & Radar use Space Wave (Line-of-Sight) propagation.', hi: 'एंटीना ऊँचाई = λ / 4; TV व रडार व्योम/अंतरिक्ष तरंग (रेडियो क्षितिज) संचरण उपयोग करते हैं।' },
  },
];

// ============================================================================
// DETERMINISTIC 25-QUESTION MOCK SETS & BALANCED RANDOM MOCK GENERATOR
// ============================================================================
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRng<T>(items: T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const HIGH_PRIORITY_SET = new Set(
  AIRFORCE_X_WEIGHTAGE.filter((w) => w.priority === 'High').map((w) => w.chapterId)
);

/**
 * Generates a realistic 25-question IAF Agniveer Vayu (X Group) Physics mock paper:
 * - Balanced across Class 11 (~12 Qs) and Class 12 (~13 Qs)
 * - Weighted toward High-priority IAF chapters
 * - Strictly 25 unique PYQs
 */
export function generateBalancedAirforceMock(seed: number): AirforcePYQ[] {
  const rng = mulberry32(seed);
  const pickedIds = new Set<string>();
  const selected: AirforcePYQ[] = [];

  const pickFromPool = (pool: AirforcePYQ[], count: number, maxPerChapter: number) => {
    const chapterCount = new Map<string, number>();
    for (const q of selected) {
      chapterCount.set(q.chapterId, (chapterCount.get(q.chapterId) ?? 0) + 1);
    }
    const shuffled = shuffleWithRng(pool, rng);
    for (const q of shuffled) {
      if (selected.length >= 25 || count <= 0) break;
      if (pickedIds.has(q.id)) continue;
      const cur = chapterCount.get(q.chapterId) ?? 0;
      if (cur >= maxPerChapter) continue;
      pickedIds.add(q.id);
      selected.push(q);
      chapterCount.set(q.chapterId, cur + 1);
      count--;
    }
  };

  const c11High = AIRFORCE_PYQS_CLASS11.filter((q) => HIGH_PRIORITY_SET.has(q.chapterId));
  const c11Other = AIRFORCE_PYQS_CLASS11.filter((q) => !HIGH_PRIORITY_SET.has(q.chapterId));
  const c12High = AIRFORCE_PYQS_CLASS12.filter((q) => HIGH_PRIORITY_SET.has(q.chapterId));
  const c12Other = AIRFORCE_PYQS_CLASS12.filter((q) => !HIGH_PRIORITY_SET.has(q.chapterId));

  // Target: 9 High + 3 Med/Low from Class 11 (12 Qs); 10 High + 3 Med/Low from Class 12 (13 Qs)
  pickFromPool(c11High, 9, 2);
  pickFromPool(c11Other, 3, 1);
  pickFromPool(c12High, 10, 2);
  pickFromPool(c12Other, 3, 1);

  // Backfill if needed
  if (selected.length < 25) {
    pickFromPool(AIRFORCE_X_PYQS, 25 - selected.length, 2);
  }

  return shuffleWithRng(selected, rng).slice(0, 25);
}

export interface AirforceMockPreset {
  id: string;
  label: { en: string; hi: string };
  subtitle: { en: string; hi: string };
  seed: number;
}

export const AIRFORCE_MOCK_SETS: AirforceMockPreset[] = [
  {
    id: 'mock-set-1',
    label: { en: 'Agniveer Vayu Mock 01', hi: 'अग्निवीर वायु मॉक 01' },
    subtitle: { en: '2024 Pattern · Balanced High-Yield 25 Q', hi: '2024 पैटर्न · संतुलित उच्च-अंक 25 प्रश्न' },
    seed: 202401,
  },
  {
    id: 'mock-set-2',
    label: { en: 'Agniveer Vayu Mock 02', hi: 'अग्निवीर वायु मॉक 02' },
    subtitle: { en: 'Mechanics, Gravitation & Optics Focus', hi: 'यांत्रिकी, गुरुत्वाकर्षण व प्रकाशिकी विशेष' },
    seed: 202402,
  },
  {
    id: 'mock-set-3',
    label: { en: 'Agniveer Vayu Mock 03', hi: 'अग्निवीर वायु मॉक 03' },
    subtitle: { en: 'Electricity, AC, Modern & Comm. Focus', hi: 'विद्युत, AC, आधुनिक व संचार विशेष' },
    seed: 202403,
  },
  {
    id: 'mock-set-4',
    label: { en: 'Agniveer Vayu Mock 04', hi: 'अग्निवीर वायु मॉक 04' },
    subtitle: { en: 'Speed & Concept-Trap Drill (25 Q)', hi: 'गति और कॉन्सेप्ट-ट्रैप अभ्यास (25 प्रश्न)' },
    seed: 202404,
  },
];

// ============================================================================
// LOCALSTORAGE PERSISTENCE HELPERS (ERROR BOOK, MOCK HISTORY, FLASHCARDS)
// ============================================================================
const ERROR_BOOK_KEY = 'physicalive_afx_errorbook_v1';
const MOCK_HISTORY_KEY = 'physicalive_afx_mock_history_v1';
const FLASHCARD_STATUS_KEY = 'physicalive_afx_flashcards_v1';

export type FlashcardMasteryMap = Record<string, 'known' | 'revise'>;

export function loadAirforceErrorBook(): string[] {
  try {
    const raw = window.localStorage.getItem(ERROR_BOOK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function saveAirforceErrorBook(ids: string[]): void {
  try {
    window.localStorage.setItem(ERROR_BOOK_KEY, JSON.stringify(Array.from(new Set(ids))));
  } catch {
    // ignore storage quota failures
  }
}

export function loadAirforceMockHistory(): AirforceMockRecord[] {
  try {
    const raw = window.localStorage.getItem(MOCK_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAirforceMockHistory(records: AirforceMockRecord[]): void {
  try {
    window.localStorage.setItem(MOCK_HISTORY_KEY, JSON.stringify(records.slice(0, 25)));
  } catch {
    // ignore
  }
}

export function loadFlashcardMastery(): FlashcardMasteryMap {
  try {
    const raw = window.localStorage.getItem(FLASHCARD_STATUS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveFlashcardMastery(map: FlashcardMasteryMap): void {
  try {
    window.localStorage.setItem(FLASHCARD_STATUS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}
