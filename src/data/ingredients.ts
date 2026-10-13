import { IngredientDecoded } from '../types';

export const INGREDIENT_DATABASE: Record<string, IngredientDecoded> = {
  niacinamide: {
    name: 'Niacinamide (Vitamin B3)',
    inciName: 'Niacinamide',
    purpose: 'Multi-functional antioxidant, barrier restoration agent, and sebum regulator.',
    benefits: [
      'Stimulates skin synthesis of ceramides, strengthening the natural moisture barrier',
      'Visibly reduces pore congestion and regulates excess oil production',
      'Inhibits melanosome transfer, fading post-inflammatory dark spots and uneven tone',
      'Soothes inflammation and redness from acne or environmental stress'
    ],
    comedogenicRating: 0,
    irritationRating: 'low',
    suitableFor: ['All skin types', 'Oily & acne-prone', 'Hyperpigmentation', 'Sensitive barrier'],
    cautionFor: ['High concentrations (>10%) can trigger temporary flushing or mild tingling in very sensitive skin.'],
    compatibilityNotes: 'Extremely versatile. Can be paired with hyaluronic acid, ceramides, salicylic acid, and retinol. Safe for both AM and PM.',
    scientificSummary: 'Extensive randomized controlled trials demonstrate that 2%–5% topical niacinamide enhances epidermal barrier function and decreases facial hyperpigmentation without irritation.',
    references: ['Journal of Cosmetic Dermatology, 2004', 'Dermatologic Surgery, 2005', 'Cosmetic Ingredient Review (CIR) Safety Assessment']
  },
  'salicylic acid': {
    name: 'Salicylic Acid (Beta Hydroxy Acid / BHA)',
    inciName: 'Salicylic Acid',
    purpose: 'Oil-soluble chemical exfoliant and anti-inflammatory keratolytic agent.',
    benefits: [
      'Penetrates deep inside oily pores to dissolve stubborn sebum and dead skin plugs',
      'Reduces blackheads, whiteheads, and active blemish inflammation',
      'Refines bumpy surface texture and improves overall skin clarity'
    ],
    comedogenicRating: 0,
    irritationRating: 'moderate',
    suitableFor: ['Oily skin', 'Combination skin', 'Acne-prone skin', 'Keratosis pilaris'],
    cautionFor: ['People allergic to aspirin. Dry or severely compromised barriers should use sparingly (1-2x/week).'],
    compatibilityNotes: 'Avoid using simultaneously with strong prescription retinoids or high-strength Vitamin C in the same routine session to prevent irritation. Always apply daily SPF 30+.',
    scientificSummary: 'As a lipophilic beta-hydroxy acid, salicylic acid concentrates within sebaceous follicles, providing gentle chemical desquamation and microbial reduction.',
    references: ['Clinics in Dermatology, 2004', 'Journal of the American Academy of Dermatology (JAAD), 2008']
  },
  'hyaluronic acid': {
    name: 'Hyaluronic Acid / Sodium Hyaluronate',
    inciName: 'Sodium Hyaluronate',
    purpose: 'Premier humectant and skin plumper.',
    benefits: [
      'Binds up to 1,000 times its molecular weight in water to hydrate upper epidermal layers',
      'Temporarily plumps fine lines and restores bounce and suppleness',
      'Promotes cellular repair and moisture retention when sealed with an emollient'
    ],
    comedogenicRating: 0,
    irritationRating: 'low',
    suitableFor: ['All skin types', 'Dehydrated skin', 'Dry skin', 'Sensitive skin'],
    cautionFor: ['In very dry climates, must be applied onto damp skin and immediately followed with an occlusive moisturizer to prevent water evaporation from the skin.'],
    compatibilityNotes: 'Compatible with virtually every active ingredient. Safe for twice-daily use.',
    scientificSummary: 'A glycosaminoglycan naturally distributed throughout human connective tissue, hyaluronic acid maintains moisture balance and extracellular matrix integrity.',
    references: ['International Journal of Biological Macromolecules, 2018', 'CIR Safety Assessment 2012']
  },
  ceramides: {
    name: 'Ceramides (NP, AP, EOP)',
    inciName: 'Ceramide NP / Ceramide AP / Ceramide EOP',
    purpose: 'Essential intercellular barrier lipids.',
    benefits: [
      'Restores the skin natural protective barrier (stratum corneum lipid matrix)',
      'Prevents trans-epidermal water loss (TEWL)',
      'Shields sensitized skin against pollutants, dry weather, and irritants',
      'Accelerates healing after active exfoliation or retinoid acclimation'
    ],
    comedogenicRating: 0,
    irritationRating: 'low',
    suitableFor: ['All skin types', 'Eczema-prone', 'Dry & flaky skin', 'Barrier-compromised skin'],
    cautionFor: ['None documented; ceramides are skin-identical physiological lipids.'],
    compatibilityNotes: 'Universal compatibility. Excellent companion for retinoids, acids, and soothing routines.',
    scientificSummary: 'Ceramides constitute roughly 50% of the stratum corneum lipid bilayer. Depletion correlates directly with dry skin, atopic dermatitis, and barrier dysfunction.',
    references: ['American Journal of Clinical Dermatology, 2003', 'Skin Pharmacology and Physiology, 2011']
  },
  'centella asiatica': {
    name: 'Centella Asiatica (Cica / Madecassoside)',
    inciName: 'Centella Asiatica Extract / Madecassoside',
    purpose: 'Herbal wound healing, anti-redness, and soothing antioxidant.',
    benefits: [
      'Accelerates healing of irritated and compromised skin barriers',
      'Suppresses pro-inflammatory cytokines, reducing visible flushing and redness',
      'Provides rich antioxidant defense against free radical damage'
    ],
    comedogenicRating: 0,
    irritationRating: 'low',
    suitableFor: ['Sensitive skin', 'Redness-prone / Rosacea-prone', 'Post-blemish recovery'],
    cautionFor: ['Rare individual botanical sensitivities.'],
    compatibilityNotes: 'Blends seamlessly with all active treatments. Ideal buffer for retinol or chemical exfoliants.',
    scientificSummary: 'Triterpenoids (asiaticoside, madecassoside) stimulate collagen synthesis (type I and III) and diminish inflammatory vascular permeability.',
    references: ['Postepy Dermatologii i Alergologii, 2013', 'Planta Medica, 2011']
  },
  retinol: {
    name: 'Retinol (Vitamin A)',
    inciName: 'Retinol',
    purpose: 'Gold-standard cell turnover accelerator and collagen booster.',
    benefits: [
      'Accelerates cellular renewal, smoothing fine lines and coarse texture',
      'Helps prevent pore congestion and fades stubborn post-acne dark marks',
      'Stimulates dermal collagen production over consistent 12+ weeks of use'
    ],
    comedogenicRating: 0,
    irritationRating: 'high',
    suitableFor: ['Aging concerns', 'Adult acne', 'Texture', 'Sun damage'],
    cautionFor: ['Must be introduced gradually (the "sandwich method" with moisturizer). Strictly avoided during pregnancy or breastfeeding. Requires mandatory daytime sunscreen.'],
    compatibilityNotes: 'Do not use at the exact same moment as direct AHAs/BHAs or high-concentration L-ascorbic acid. Use on alternate evenings.',
    scientificSummary: 'Converts via retinaldehyde to retinoic acid in keratinocytes, binding to RAR nuclear receptors to regulate gene expression for epidermal differentiation and collagen matrix maintenance.',
    references: ['Archives of Dermatology, 2007', 'Clinical Interventions in Aging, 2006']
  },
  'squalane': {
    name: 'Squalane (Plant-Derived)',
    inciName: 'Squalane',
    purpose: 'Lightweight biomimetic emollient and moisture sealer.',
    benefits: [
      'Imparts weightless, non-greasy softness to the skin surface',
      'Replenishes natural sebum lipids without clogging pores',
      'Improves makeup blendability and prevents flaking'
    ],
    comedogenicRating: 1,
    irritationRating: 'low',
    suitableFor: ['All skin types', 'Fungal acne-safe (100% pure sugarcane squalane)', 'Dry skin'],
    cautionFor: ['Very rare sensitivities.'],
    compatibilityNotes: 'Works with all ingredients; fantastic as the final step of a routine to seal in hydration.',
    scientificSummary: 'The saturated and stable hydrogenated form of squalene (a natural component of human sebum), squalane exhibits remarkable oxidation resistance and non-irritating emollience.',
    references: ['Advances in Food and Nutrition Research, 2012', 'CIR Safety Review']
  },
  'l-ascorbic acid': {
    name: 'Vitamin C (L-Ascorbic Acid)',
    inciName: 'Ascorbic Acid',
    purpose: 'Potent biological antioxidant and tyrosinase inhibitor.',
    benefits: [
      'Neutralizes reactive oxygen species (ROS) induced by UVA/UVB exposure and pollution',
      'Inhibits melanin overproduction to brighten dark marks and melasma',
      'Essential cofactor in collagen enzymatic synthesis'
    ],
    comedogenicRating: 0,
    irritationRating: 'moderate',
    suitableFor: ['Sun damage', 'Dullness', 'Uneven tone', 'Normal & combination skin'],
    cautionFor: ['Requires low pH (<3.5) for absorption, which can cause temporary stinging on sensitive or broken barriers. Vulnerable to heat and light oxidation.'],
    compatibilityNotes: 'Best applied in the morning under sunscreen. Avoid mixing in the exact same application with copper peptides or strong AHAs/BHAs if skin is sensitive.',
    scientificSummary: 'Pure L-ascorbic acid operates as a potent electron donor, neutralizing environmental free radicals while directly inhibiting the tyrosinase enzyme responsible for dark melanin formation.',
    references: ['Dermatologic Surgery, 2001', 'Journal of Clinical and Aesthetic Dermatology, 2010']
  }
};
