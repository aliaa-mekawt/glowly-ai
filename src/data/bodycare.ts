export interface BodyCareGuide {
  id: string;
  topic: string;
  subtitle: string;
  summary: string;
  causes: string[];
  recommendedSteps: { step: number; name: string; frequency: string; instruction: string }[];
  keyIngredients: string[];
  ingredientsToAvoid: string[];
  medicalDisclaimer: string;
}

export const BODY_CARE_GUIDES: BodyCareGuide[] = [
  {
    id: 'kp-strawberry-skin',
    topic: 'Keratosis Pilaris & "Strawberry Legs"',
    subtitle: 'Gentle smoothing protocol for rough, bumpy arm and leg texture',
    summary: 'Keratosis Pilaris is a harmless genetic condition where keratin builds up and forms microscopic plugs around hair follicles. Harsh physical scrubbing only inflames it; gentle chemical exfoliation and lipid hydration are the true keys.',
    causes: [
      'Excess keratin protein accumulation in hair follicles',
      'Dry winter weather or low humidity stripping skin lipids',
      'Over-scrubbing with aggressive loofahs causing follicular inflammation',
    ],
    recommendedSteps: [
      {
        step: 1,
        name: 'Sulfate-Free Cream Body Wash',
        frequency: 'Daily in shower',
        instruction: 'Cleanse with a nourishing colloidal oat or glycerin-based body wash. Keep shower water lukewarm, never scalding hot.',
      },
      {
        step: 2,
        name: 'Chemical Exfoliating Lotion (AHA / Lactic Acid or 2% BHA)',
        frequency: '3–4 times per week',
        instruction: 'Apply a targeted lotion containing 10% Lactic Acid or 2% Salicylic Acid to slightly damp arms and legs after showering. This dissolves keratin plugs without friction.',
      },
      {
        step: 3,
        name: 'Barrier-Replenishing Cream or Urea Balm',
        frequency: 'Daily',
        instruction: 'Seal with a ceramide-rich cream or 5-10% Urea lotion to keep follicles soft and pliable.',
      },
    ],
    keyIngredients: ['Lactic Acid (AHA)', 'Salicylic Acid (BHA)', 'Urea (5–10%)', 'Ceramides', 'Colloidal Oatmeal'],
    ingredientsToAvoid: ['Harsh walnut shell physical scrubs', 'High alcohol drying toners', 'Scrubbing with rough loofahs on dry skin'],
    medicalDisclaimer: 'Keratosis pilaris is benign and requires persistent ongoing maintenance. If bumps become painful, hot, or show pus, consult a healthcare professional to rule out folliculitis.',
  },
  {
    id: 'body-acne-bacne',
    topic: 'Back & Chest Breakouts (Body Acne)',
    subtitle: 'Clarifying protocol for active perspiration and friction breakouts',
    summary: 'Body skin has thicker stratum corneum and larger sebaceous glands than the face. Workout sweat, friction from tight activewear, and hair conditioner residue are common triggers.',
    causes: [
      'Pore blockage from dried sweat and workout fabric friction',
      'Hair conditioner containing heavy waxes running down the back during showering',
      'C. acnes bacteria and Malassezia yeast overgrowth in warm, humid microclimates',
    ],
    recommendedSteps: [
      {
        step: 1,
        name: 'Hair Rinse Order Strategy',
        frequency: 'Every wash day',
        instruction: 'Rinse conditioner out of hair first and clip it up. Wash your back and chest last with body cleanser to remove conditioner residue completely.',
      },
      {
        step: 2,
        name: '2% Salicylic Acid or Benzoyl Peroxide Cleanser',
        frequency: '3–5 times per week',
        instruction: 'Lather onto back and chest and let it sit on the skin for 2 minutes before rinsing to allow the active ingredient to penetrate pores.',
      },
      {
        step: 3,
        name: 'Immediate Post-Workout Clothes Change',
        frequency: 'After every workout',
        instruction: 'Change out of damp sports bras and gym shirts immediately. If you cannot shower immediately, wipe chest and back with a clarifying BHA body wipe.',
      },
    ],
    keyIngredients: ['Salicylic Acid 2%', 'Benzoyl Peroxide (2.5%–5%)', 'Zinc PCA', 'Tea Tree Leaf Extract (diluted)'],
    ingredientsToAvoid: ['Heavy coconut oil body lotions on chest/back', 'Occlusive body balms', 'Scented synthetic body glitters'],
    medicalDisclaimer: 'Persistent painful cystic nodules on the back or chest may require evaluation by a dermatologist for prescription topical or oral therapies.',
  },
  {
    id: 'fragrance-layering',
    topic: 'Fragrance Layering & All-Day Scent Longevity',
    subtitle: 'The art of building harmonious, long-lasting scent trails without skin irritation',
    summary: 'Fragrance molecules evaporate quickly on dry skin. By establishing a hydrated, lipid-rich skin base and layering complementary scent notes, you dramatically extend fragrance longevity while preventing perfume dryness.',
    causes: [
      'Dry skin lacking lipids absorbs alcohol-based perfumes too fast',
      'Rubbing wrists together breaks delicate top notes (citrus/florals)',
    ],
    recommendedSteps: [
      {
        step: 1,
        name: 'Hydrating Unscented or Neutral Base Lotion',
        frequency: 'Immediately after shower',
        instruction: 'Smooth an unscented body lotion or delicate vanilla/amber body oil over pulse points (collarbones, wrists, inner elbows). Moisture creates an anchor for perfume molecules.',
      },
      {
        step: 2,
        name: 'Layer Complimentary Notes (Base + Heart)',
        frequency: 'Special occasions & daily',
        instruction: 'Pair a gourmand base (e.g. warm vanilla or salted caramel lotion) with a fresh floral or woody Eau de Parfum mist.',
      },
      {
        step: 3,
        name: 'Spray Pulse Points & Do Not Rub',
        frequency: 'Final step',
        instruction: 'Mist 2-3 sprays on pulse points and let it air-dry naturally. Friction heats the fragrance and ruins the top notes.',
      },
    ],
    keyIngredients: ['Squalane oil base', 'Jojoba seed oil', 'Shea butter', 'Gourmand & floral botanical extracts'],
    ingredientsToAvoid: ['Spraying alcohol perfumes directly on broken or freshly shaved underarm skin'],
    medicalDisclaimer: 'If you have eczema, rosacea, or known fragrance allergies, always use fragrance-free body products on sensitive barrier zones.',
  },
];
