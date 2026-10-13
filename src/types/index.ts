export type AgeRange = '15–17' | '18–24' | '25–30' | '31–35';
export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive' | 'unsure' | 'all' | 'dehydrated';
export type MakeupLevel = 'beginner' | 'intermediate' | 'advanced';
export type BudgetTier = 'budget' | 'mid_range' | 'luxury';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'EGP';
export type Language = 'en' | 'ar';
export type ProductOrigin = 'egyptian' | 'imported';
export type ProductDataStatus = 'verified' | 'unverified' | 'demo';
export type Undertone = 'cool' | 'warm' | 'neutral' | 'olive' | 'unsure';
export type SkinTone = 'fair' | 'light' | 'medium' | 'tan' | 'deep';

export interface UserProfile {
  id: string;
  name: string;
  language?: Language;
  preferredMarket?: 'egypt' | 'global';
  ageRange: AgeRange;
  skinType: SkinType;
  concerns: string[];
  sensitivities: string[];
  currentRoutineSummary: string;
  makeupExperience: MakeupLevel;
  makeupStyle: string[];
  foundationShade?: string;
  skinTone: SkinTone;
  undertone: Undertone;
  bodyConcerns: string[];
  preferredBrands: string[];
  budgetTier: BudgetTier;
  monthlyBudget: number;
  currency: Currency;
  completedOnboarding: boolean;
  notes?: string;
}

export type ProductCategory = 
  | 'cleanser'
  | 'moisturizer'
  | 'sunscreen'
  | 'serum'
  | 'toner'
  | 'acne_care'
  | 'makeup_remover'
  | 'lip_care'
  | 'body_wash'
  | 'body_lotion'
  | 'body_treatment'
  | 'hair_care'
  | 'foundation_concealer'
  | 'blush_powder'
  | 'eye_lip_makeup'
  | 'tools_brushes';

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  brand: string;
  brandAr?: string;
  category: ProductCategory;
  categoryAr?: string;
  subcategory: string;
  price: number;
  priceEGP?: number;
  currency: Currency;
  rating: number;
  reviewsCount: number;
  image: string;
  verified: boolean;
  verifiedDate?: string;
  priceVerificationDate?: string;
  origin?: ProductOrigin;
  dataStatus?: ProductDataStatus;
  description: string;
  descriptionAr?: string;
  targetSkinTypes: SkinType[];
  targetConcerns: string[];
  activeIngredients: string[];
  fullIngredients?: string;
  precautions?: string;
  precautionsAr?: string;
  howToUse: string;
  howToUseAr?: string;
  whyItFits?: string;
  whyItFitsAr?: string;
  size: string;
  retailerUrl?: string;
  retailerName?: string;
  sourceUrl?: string;
  isAlternativeTo?: string; // e.g. "Charlotte Tilbury Flawless Filter"
  dupeSavings?: number;
  dupeSavingsEGP?: number;
}

export interface RoutineStep {
  id: string;
  period: 'morning' | 'evening' | 'body' | 'weekly';
  stepNumber: number;
  stepName: string;
  stepNameAr?: string;
  category: ProductCategory;
  purpose: string;
  purposeAr?: string;
  productId?: string;
  customProductTitle?: string;
  howToApply: string;
  howToApplyAr?: string;
  amountOrQuantity?: string;
  amountOrQuantityAr?: string;
  frequency: string;
  frequencyAr?: string;
  precautions?: string;
  precautionsAr?: string;
  gradualIntroGuide?: string;
  gradualIntroGuideAr?: string;
  lowerCostAlternative?: string;
  lowerCostAlternativeAr?: string;
  scheduledDays?: string[];
  isOptional: boolean;
  completedToday?: boolean;
}

export interface ShelfItem {
  id: string;
  productId?: string;
  name: string;
  brand: string;
  category: ProductCategory;
  openedDate?: string;
  expirationMonths?: number;
  status: 'active' | 'in_routine' | 'backup' | 'finished';
  notes?: string;
  rating?: number;
  repurchase?: boolean;
  ingredientsSummary?: string;
}

export interface IngredientDecoded {
  name: string;
  inciName: string;
  purpose: string;
  benefits: string[];
  comedogenicRating: number; // 0-5
  irritationRating: 'low' | 'moderate' | 'high';
  suitableFor: string[];
  cautionFor: string[];
  compatibilityNotes: string;
  scientificSummary: string;
  references: string[];
}

export interface AcademyLesson {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  titleAr?: string;
  durationMinutes: number;
  category: 'prep' | 'base' | 'eyes' | 'cheeks' | 'lips' | 'looks' | 'removal';
  overview: string;
  overviewAr?: string;
  steps: {
    title: string;
    titleAr?: string;
    instruction: string;
    instructionAr?: string;
    proTip?: string;
    proTipAr?: string;
  }[];
  requiredTools: string[];
  requiredToolsAr?: string[];
  practiceExercise: string;
  practiceExerciseAr?: string;
  commonMistakes: string[];
  commonMistakesAr?: string[];
  image: string;
  completed?: boolean;
  saved?: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  routineCompleted: {
    morning: boolean;
    evening: boolean;
    body: boolean;
  };
  newProductIntroduced?: string;
  patchTestStatus?: 'not_needed' | 'patch_testing' | 'well_tolerated' | 'irritation_observed';
  skinFeel: 'calm_balanced' | 'dry_tight' | 'oily_congested' | 'sensitive_reactive';
  notes: string;
}

export interface ShoppingItem {
  id: string;
  productId?: string;
  name: string;
  brand: string;
  price: number;
  currency: Currency;
  category: ProductCategory;
  isEssential: boolean;
  purchased: boolean;
  notes?: string;
  retailerUrl?: string;
}

export interface DupeComparison {
  id: string;
  prestigeProduct: {
    name: string;
    brand: string;
    price: number;
    priceEGP?: number;
    size: string;
    image: string;
    keyIngredients: string[];
    texture: string;
    finish: string;
  };
  budgetDupe: {
    name: string;
    nameAr?: string;
    brand: string;
    brandAr?: string;
    price: number;
    priceEGP?: number;
    size: string;
    image: string;
    keyIngredients: string[];
    texture: string;
    finish: string;
    isEgyptianBrand?: boolean;
  };
  savings: number;
  savingsEGP?: number;
  savingsPercentage: number;
  ingredientSimilarity: string;
  ingredientSimilarityAr?: string;
  formulaComparison: string;
  formulaComparisonAr?: string;
  bestChoiceFor: string;
  bestChoiceForAr?: string;
}

export interface GRWMPlan {
  id: string;
  occasion: 'casual' | 'work_study' | 'date_night' | 'party' | 'special_event';
  targetDurationMinutes: number;
  skinPrepSteps: { step: string; productType: string; durationMin: number; skippable: boolean }[];
  makeupSteps: { step: string; productType: string; durationMin: number; tips: string; skippable: boolean }[];
  finishNotes: string;
}
