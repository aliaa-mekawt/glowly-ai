import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Product,
  RoutineStep,
  ShelfItem,
  ShoppingItem,
  JournalEntry,
  Currency,
  Language,
} from '../types';
import { INITIAL_PRODUCTS } from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';

interface BeautyContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: keyof typeof TRANSLATIONS['en'], params?: Record<string, string | number>) => string;

  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;

  catalog: Product[];
  refreshCatalog: () => Promise<void>;
  addProductToCatalog: (product: Omit<Product, 'id'>) => Promise<boolean>;
  updateProductInCatalog: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProductFromCatalog: (id: string) => Promise<boolean>;

  shelf: ShelfItem[];
  addToShelf: (item: Omit<ShelfItem, 'id'>) => void;
  updateShelfItem: (id: string, updates: Partial<ShelfItem>) => void;
  removeFromShelf: (id: string) => void;

  morningRoutine: RoutineStep[];
  eveningRoutine: RoutineStep[];
  bodyRoutine: RoutineStep[];
  weeklyRoutine: RoutineStep[];
  toggleRoutineStep: (stepId: string, period: 'morning' | 'evening' | 'body' | 'weekly') => void;
  addRoutineStep: (period: 'morning' | 'evening' | 'body' | 'weekly', step: Omit<RoutineStep, 'id'>) => void;
  removeRoutineStep: (stepId: string, period: 'morning' | 'evening' | 'body' | 'weekly') => void;

  shoppingList: ShoppingItem[];
  addToShoppingList: (item: Omit<ShoppingItem, 'id'>) => void;
  removeFromShoppingList: (id: string) => void;
  toggleShoppingItemPurchased: (id: string) => void;
  clearPurchasedShoppingItems: () => void;

  favorites: string[]; // product IDs
  toggleFavorite: (productId: string) => void;

  completedLessons: string[];
  savedLessons: string[];
  toggleLessonCompleted: (lessonId: string) => void;
  toggleLessonSaved: (lessonId: string) => void;

  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;

  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amount: number, overrideCurrency?: Currency) => string;

  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;

  clearAllUserData: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-default',
  name: 'Sophia',
  language: 'en',
  preferredMarket: 'egypt',
  ageRange: '18–24',
  skinType: 'combination',
  concerns: ['Acne & breakouts', 'Hyperpigmentation & dark spots', 'Redness & barrier repair'],
  sensitivities: [],
  currentRoutineSummary: 'غسول يومي خفيف ومرطب للبشرة، وأبحث عن واقي شمس مصري خفيف',
  makeupExperience: 'beginner',
  makeupStyle: ['Clean girl natural', 'Everyday office/study'],
  skinTone: 'light',
  undertone: 'neutral',
  bodyConcerns: ['Keratosis pilaris/strawberry skin'],
  preferredBrands: ['Bobana', 'Starville', 'Eva Cosmetics', 'CeraVe'],
  budgetTier: 'budget',
  monthlyBudget: 600,
  currency: 'EGP',
  completedOnboarding: true,
};

const INITIAL_MORNING_STEPS: RoutineStep[] = [
  {
    id: 'rt-am-1',
    period: 'morning',
    stepNumber: 1,
    stepName: 'Starville Facial Cleanser for Acne & Oily Skin',
    stepNameAr: 'ستارفيل غسول الوجه اللطيف للتحكم بالدهون',
    category: 'cleanser',
    purpose: 'Removes overnight sweat & oils without stripping moisture barrier',
    purposeAr: 'ينظف إفرازات النوم والدهون بلطف دون تجفيف الحاجز الواقي',
    productId: 'eg-prod-starville-clean',
    customProductTitle: 'Starville Facial Cleanser (150 EGP)',
    amountOrQuantity: 'Nickel-sized coin (1 pump)',
    amountOrQuantityAr: 'مقدار ضغطة واحدة (بحجم عملة معدنية)',
    howToApply: 'Massage onto damp skin for 45–60 seconds with lukewarm water; rinse cleanly.',
    howToApplyAr: 'يدلك بحركات دائرية هادئة على وجه مبلل لمدة 45-60 ثانية ويشطف بالماء الفاتر.',
    frequency: 'Daily morning',
    frequencyAr: 'يومياً كل صباح',
    lowerCostAlternative: 'Splash with plain lukewarm water if dry in winter',
    lowerCostAlternativeAr: 'الاكتفاء بالماء الفاتر إذا كانت البشرة جافة في الشتاء',
    isOptional: false,
    completedToday: false,
  },
  {
    id: 'rt-am-2',
    period: 'morning',
    stepNumber: 2,
    stepName: 'Eva Skin Clinic Hyaluronic Acid Serum',
    stepNameAr: 'إيفا سكين كلينيك سيروم الهيالورونيك لملء البشرة',
    category: 'serum',
    purpose: 'Quenches dehydrated skin with multi-depth cellular hydration',
    purposeAr: 'يرطب البشرة بعمق ويستعيد نضارتها الطبيعية',
    productId: 'eg-prod-eva-hyaluron',
    customProductTitle: 'Eva Skin Clinic Hyaluronic Serum (220 EGP)',
    amountOrQuantity: '3–4 drops onto damp skin',
    amountOrQuantityAr: '3 إلى 4 قطرات على بشرة مبللة قليلاً',
    howToApply: 'Pat gently into damp face and neck. Never rub on completely dry skin.',
    howToApplyAr: 'يطبطب برقة على الوجه والرقبة وهو ندي، ولا يفرك أبداً على بشرة جافة تماماً.',
    frequency: 'Daily morning',
    frequencyAr: 'يومياً صباحاً',
    isOptional: true,
    completedToday: false,
  },
  {
    id: 'rt-am-3',
    period: 'morning',
    stepNumber: 3,
    stepName: 'Lightweight Barrier Lotion (Ceramides & Niacinamide)',
    stepNameAr: 'لوشن مرطب خفيف لترميم الحاجز بالسيراميد والنياسيناميد',
    category: 'moisturizer',
    purpose: 'Locks in moisture with physiological ceramides and calms redness',
    purposeAr: 'يحبس الرطوبة بالسيراميد ويهدئ الاحمرار',
    productId: 'prod-moist-1',
    customProductTitle: 'CeraVe PM Lotion or Eva Skin Clinic Day Lotion',
    amountOrQuantity: 'Pea-sized to dime-sized amount',
    amountOrQuantityAr: 'بحجم حبة البازلاء إلى عملة معدنية صغيرة',
    howToApply: 'Smooth gently over face and neck until absorbed.',
    howToApplyAr: 'يوزع برقة على الوجه والرقبة حتى يمتصه الجلد.',
    frequency: 'Daily morning',
    frequencyAr: 'يومياً صباحاً',
    lowerCostAlternative: 'Eva Aloe Vera Moisturizing Gel Cream',
    lowerCostAlternativeAr: 'إيفا كريم جل الصبار المرطب الخفيف',
    isOptional: false,
    completedToday: false,
  },
  {
    id: 'rt-am-4',
    period: 'morning',
    stepNumber: 4,
    stepName: 'Bobana Sunscreen Gel SPF 50+ (Zero White Cast)',
    stepNameAr: 'بوبانا واقي شمس جل SPF 50+ بدون أثر أبيض',
    category: 'sunscreen',
    purpose: 'Non-negotiable shield against UV pigment darkening, burns, and fine lines',
    purposeAr: 'حماية ضرورية وغير قابلة للاستغناء ضد التصبغات وحروق الشمس',
    productId: 'eg-prod-bobana-sun',
    customProductTitle: 'Bobana Sunscreen Gel SPF 50+ (175 EGP)',
    amountOrQuantity: 'Two full finger-lengths (Index & Middle finger)',
    amountOrQuantityAr: 'مقدار إصبعين كاملين (السبابة والوسطى)',
    howToApply: 'Apply 15 minutes before direct sun exposure. Reapply every 2 hours when outdoors.',
    howToApplyAr: 'يوضع قبل الخروج للشمس بـ 15 دقيقة، ويعاد وضعه كل ساعتين في الخارج.',
    frequency: 'Every single morning without exception',
    frequencyAr: 'كل صباح بدون استثناء صيفاً وشتاءً',
    isOptional: false,
    completedToday: false,
  },
];

const INITIAL_EVENING_STEPS: RoutineStep[] = [
  {
    id: 'rt-pm-1',
    period: 'evening',
    stepNumber: 1,
    stepName: 'Bioderma Sensibio H2O Micellar Makeup Dissolver',
    stepNameAr: 'بيوديرما ماء ميسيلار لإذابة المكياج وواقي الشمس',
    category: 'makeup_remover',
    purpose: 'Dissolves waterproof sunscreen, pollutants, and longwear makeup without friction',
    purposeAr: 'يذيب واقي الشمس المضاد للماء والرواسب والمكياج دون شد البشرة',
    productId: 'prod-rem-1',
    customProductTitle: 'Bioderma Sensibio H2O (or Garnier Rose Micellar)',
    amountOrQuantity: 'Soaked cotton round',
    amountOrQuantityAr: 'تبليل قطنة ناعمة بالكامل',
    howToApply: 'Hold soaked cotton over eyes and face for 5 seconds, then sweep away gently.',
    howToApplyAr: 'تثبت القطنة على الوجه والعيون لمدة 5 ثوانٍ ثم تمسح بلطف بدون فرك.',
    frequency: 'Every evening when wearing SPF or makeup',
    frequencyAr: 'كل مساء عند وضع واقي الشمس أو المكياج',
    isOptional: false,
    completedToday: false,
  },
  {
    id: 'rt-pm-2',
    period: 'evening',
    stepNumber: 2,
    stepName: 'Purifying Gentle Wash (Starville / CeraVe)',
    stepNameAr: 'غسول مائي لطيف ومنظف للمسام',
    category: 'cleanser',
    purpose: 'Completes double-cleanse, washing away emulsified sunscreen residue',
    purposeAr: 'يكمل التنظيف المزدوج ويزيل بقايا الأتربة والشوائب المنحلة',
    productId: 'eg-prod-starville-clean',
    customProductTitle: 'Starville Facial Cleanser (150 EGP)',
    amountOrQuantity: '1 pump with water',
    amountOrQuantityAr: 'ضغطة واحدة بالماء',
    howToApply: 'Lather and rinse thoroughly with lukewarm water.',
    howToApplyAr: 'يرغى باليد ويشطف جيداً بالماء الفاتر.',
    frequency: 'Daily evening',
    frequencyAr: 'يومياً كل مساء',
    isOptional: false,
    completedToday: false,
  },
  {
    id: 'rt-pm-3',
    period: 'evening',
    stepNumber: 3,
    stepName: '2% BHA Pore Clarifying Exfoliant (Alternate Nights)',
    stepNameAr: 'مقشر 2% ساليسيليك لتنقية المسام والرؤوس السوداء',
    category: 'toner',
    purpose: 'Penetrates inside oily pores to clear blackheads and dissolve dead skin plugs',
    purposeAr: 'يخترق الزيوت داخل المسام لتفتيتها وإزالة الرؤوس السوداء',
    productId: 'prod-toner-2',
    customProductTitle: 'Peach Slices 2% BHA Clarifying Toner',
    amountOrQuantity: '3–4 drops',
    amountOrQuantityAr: '3 إلى 4 قطرات',
    howToApply: 'Pat lightly on dry skin. Wait 2 minutes before moisturizer. Use 2–3 nights weekly.',
    howToApplyAr: 'يطبطب على بشرة جافة تماماً، وانتظري دقيقتين قبل المرطب. مرتين إلى 3 أسبوعياً فقط.',
    frequency: '2–3 nights per week (e.g. Sunday & Wednesday)',
    frequencyAr: '2 إلى 3 ليالٍ أسبوعياً (مثلاً: الأحد والأربعاء)',
    precautions: 'Do not combine with retinol on the exact same evening to avoid peeling.',
    precautionsAr: 'لا يوضع مع الريتينول في نفس الليلة تفادياً لتحسس وتقشر البشرة.',
    gradualIntroGuide: 'Start once a week for the first 2 weeks, then increase to 2-3 nights.',
    gradualIntroGuideAr: 'ابدئي مرة واحدة أسبوعياً لأول أسبوعين، ثم ارفعيها لمرتين إلى ثلاث.',
    isOptional: true,
    completedToday: false,
  },
  {
    id: 'rt-pm-4',
    period: 'evening',
    stepNumber: 4,
    stepName: 'Restorative Barrier Repair Cream',
    stepNameAr: 'كريم ليلي لترميم وتهدئة حاجز البشرة',
    category: 'moisturizer',
    purpose: 'Deep overnight hydration with ceramides and soothing botanical lipids',
    purposeAr: 'ترطيب ليلي مكثف بالسيراميد لتقوية خلايا البشرة أثناء النوم',
    productId: 'prod-moist-1',
    customProductTitle: 'CeraVe PM or La Roche-Posay Cicaplast Baume B5+',
    amountOrQuantity: 'Dime-sized amount',
    amountOrQuantityAr: 'بحجم عملة معدنية صغيرة',
    howToApply: 'Smooth generously over face, neck, and upper chest.',
    howToApplyAr: 'يوزع بسخاء على الوجه والرقبة وأعلى الصدر.',
    frequency: 'Daily evening',
    frequencyAr: 'يومياً كل مساء',
    isOptional: false,
    completedToday: false,
  },
];

const INITIAL_BODY_STEPS: RoutineStep[] = [
  {
    id: 'rt-body-1',
    period: 'body',
    stepNumber: 1,
    stepName: 'Gentle Colloidal Oat Body Cleanser',
    stepNameAr: 'غسول الجسم المرطب بخلاصة الشوفان الطبيعي',
    category: 'body_wash',
    purpose: 'Cleanses body skin without disrupting natural lipid barrier',
    purposeAr: 'ينظف بشرة الجسم دون سحب الزيوت الطبيعية الحامية',
    productId: 'prod-body-1',
    customProductTitle: 'Aveeno Daily Wash or Eva Honey Shower Gel',
    amountOrQuantity: 'Generous lather with soft washcloth',
    amountOrQuantityAr: 'رغوة وافرة بليفة استحمام ناعمة',
    howToApply: 'Lather gently in lukewarm shower with soft washcloth.',
    howToApplyAr: 'يرغى بلطف تحت ماء فاتر وتجنبي الماء شديد السخونة.',
    frequency: 'Daily shower',
    frequencyAr: 'يومياً أثناء الاستحمام',
    isOptional: false,
    completedToday: false,
  },
  {
    id: 'rt-body-2',
    period: 'body',
    stepNumber: 2,
    stepName: 'Raw African Whipped Cocoa & Shea Butter',
    stepNameAr: 'زبدة الكاكاو والشيا المخفوقة من رو أفريكان',
    category: 'body_lotion',
    purpose: 'Deeply softens rough elbows, knees, and strawberry skin legs',
    purposeAr: 'تنعيم فائق لمظهر جلد الوزة والركب والأكواع الجافة',
    productId: 'eg-prod-rawafrican-butter',
    customProductTitle: 'Raw African Whipped Butter (230 EGP)',
    amountOrQuantity: 'Small scoop warmed in hands',
    amountOrQuantityAr: 'مقدار ملعقة صغيرة تدفأ بين اليدين',
    howToApply: 'Apply to damp arms and thighs after patting dry from shower.',
    howToApplyAr: 'تدلك على الذراعين والساقين مباشرة بعد التجفيف الخفيف من الاستحمام.',
    frequency: '3–4 times weekly',
    frequencyAr: '3 إلى 4 مرات أسبوعياً',
    isOptional: false,
    completedToday: false,
  },
];

const INITIAL_WEEKLY_STEPS: RoutineStep[] = [
  {
    id: 'rt-wk-1',
    period: 'weekly',
    stepNumber: 1,
    stepName: 'Mid-Week Exfoliation Night (BHA)',
    stepNameAr: 'ليلة التقشير وتنقية المسام (الأربعاء)',
    category: 'toner',
    purpose: 'Unclogs stubborn sebum and prevents new blemishes from forming',
    purposeAr: 'تنقية الرؤوس السوداء ومنع انسداد المسام',
    scheduledDays: ['Wed', 'Sun'],
    howToApply: 'Apply 2% Salicylic Acid on dry skin after washing. Wait 2 mins, then moisturize.',
    howToApplyAr: 'يوضع حمض الساليسيليك على بشرة جافة بعد الغسول، ثم يرطب بعد دقيقتين.',
    frequency: 'Wednesday & Sunday nights',
    frequencyAr: 'ليلتي الأربعاء والأحد',
    isOptional: false,
    completedToday: false,
  },
  {
    id: 'rt-wk-2',
    period: 'weekly',
    stepNumber: 2,
    stepName: 'Weekend Barrier Recovery & Deep Moisture Mask',
    stepNameAr: 'ليلة ترميم الحاجز والترطيب المكثف (الجمعة)',
    category: 'moisturizer',
    purpose: 'Zero active acids; focus 100% on soothing cica, ceramides, and panthenol',
    purposeAr: 'بدون أي أحماض مقشرة؛ تركيز كامل على السيراميد والبانثينول لراحة البشرة',
    scheduledDays: ['Fri'],
    howToApply: 'Generous layer of balm or sleeping mask over hydrating serum.',
    howToApplyAr: 'طبقة وافرة من المرطب المهدئ بعد سيروم الهيالورونيك.',
    frequency: 'Friday night',
    frequencyAr: 'ليلة الجمعة',
    isOptional: false,
    completedToday: false,
  },
];

const INITIAL_SHELF: ShelfItem[] = [
  {
    id: 'shelf-1',
    productId: 'eg-prod-bobana-sun',
    name: 'Sunscreen Gel SPF 50+',
    brand: 'Bobana',
    category: 'sunscreen',
    openedDate: '2026-03-01',
    expirationMonths: 12,
    status: 'in_routine',
    rating: 5,
    repurchase: true,
    notes: 'واقي شمس ممتاز وخفيف جداً للبشرة الدهنية في حر الصيف بمصر.',
  },
  {
    id: 'shelf-2',
    productId: 'eg-prod-starville-clean',
    name: 'Starville Facial Cleanser',
    brand: 'Starville',
    category: 'cleanser',
    openedDate: '2026-02-20',
    expirationMonths: 12,
    status: 'in_routine',
    rating: 5,
    repurchase: true,
    notes: 'غسول اقتصادي ممتاز بينضف الحبوب من غير ما يشد وشي.',
  },
  {
    id: 'shelf-3',
    productId: 'eg-prod-eva-hyaluron',
    name: 'Skin Clinic Hyaluronic Acid Serum',
    brand: 'Eva Cosmetics',
    category: 'serum',
    openedDate: '2026-03-05',
    expirationMonths: 12,
    status: 'in_routine',
    rating: 4,
    repurchase: true,
    notes: 'سيروم ترطيب رائع من إيفا بيسيب البشرة ناعمة وندية.',
  },
];

const INITIAL_SHOPPING: ShoppingItem[] = [
  {
    id: 'shop-1',
    productId: 'eg-prod-rawafrican-rose',
    name: 'Pure Damask Rose Water Toner',
    brand: 'Raw African',
    price: 140,
    currency: 'EGP',
    category: 'toner',
    isEssential: true,
    purchased: false,
    notes: 'ماء ورد طبيعي لتهدئة الوجه وترطيبه',
  },
  {
    id: 'shop-2',
    productId: 'prod-make-1',
    name: 'Halo Glow Liquid Filter',
    brand: 'e.l.f. Cosmetics',
    price: 690,
    currency: 'EGP',
    category: 'foundation_concealer',
    isEssential: false,
    purchased: false,
    notes: 'بديل اقتصادي لمكياج النضارة اليومي',
  },
];

const BeautyContext = createContext<BeautyContextType | null>(null);

export const BeautyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state (English default, can toggle to Arabic anytime)
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('glowly_lang');
      return saved === 'ar' ? 'ar' : 'en';
    } catch {
      return 'en';
    }
  });

  const isRTL = language === 'ar';

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('glowly_lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key: keyof typeof TRANSLATIONS['en'], params?: Record<string, string | number>) => {
    let text = TRANSLATIONS[language]?.[key] || TRANSLATIONS['en'][key] || (key as string);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };

  // 2. Profile State
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('glowly_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // 3. Catalog State
  const [catalog, setCatalog] = useState<Product[]>(INITIAL_PRODUCTS);

  // 4. Shelf State
  const [shelf, setShelf] = useState<ShelfItem[]>(() => {
    try {
      const saved = localStorage.getItem('glowly_shelf');
      return saved ? JSON.parse(saved) : INITIAL_SHELF;
    } catch {
      return INITIAL_SHELF;
    }
  });

  // 5. Routines State
  const [morningRoutine, setMorningRoutine] = useState<RoutineStep[]>(() => {
    try {
      const saved = localStorage.getItem('glowly_rt_am');
      return saved ? JSON.parse(saved) : INITIAL_MORNING_STEPS;
    } catch {
      return INITIAL_MORNING_STEPS;
    }
  });

  const [eveningRoutine, setEveningRoutine] = useState<RoutineStep[]>(() => {
    try {
      const saved = localStorage.getItem('glowly_rt_pm');
      return saved ? JSON.parse(saved) : INITIAL_EVENING_STEPS;
    } catch {
      return INITIAL_EVENING_STEPS;
    }
  });

  const [bodyRoutine, setBodyRoutine] = useState<RoutineStep[]>(() => {
    try {
      const saved = localStorage.getItem('glowly_rt_body');
      return saved ? JSON.parse(saved) : INITIAL_BODY_STEPS;
    } catch {
      return INITIAL_BODY_STEPS;
    }
  });

  const [weeklyRoutine, setWeeklyRoutine] = useState<RoutineStep[]>(() => {
    try {
      const saved = localStorage.getItem('glowly_rt_weekly');
      return saved ? JSON.parse(saved) : INITIAL_WEEKLY_STEPS;
    } catch {
      return INITIAL_WEEKLY_STEPS;
    }
  });

  // 6. Shopping List State
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem('glowly_shopping');
      return saved ? JSON.parse(saved) : INITIAL_SHOPPING;
    } catch {
      return INITIAL_SHOPPING;
    }
  });

  // 7. Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('glowly_favorites');
      return saved ? JSON.parse(saved) : ['eg-prod-bobana-sun', 'eg-prod-starville-clean'];
    } catch {
      return ['eg-prod-bobana-sun', 'eg-prod-starville-clean'];
    }
  });

  // 8. Academy Progress State
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('glowly_lessons_done');
      return saved ? JSON.parse(saved) : ['lesson-1', 'lesson-2'];
    } catch {
      return ['lesson-1', 'lesson-2'];
    }
  });

  const [savedLessons, setSavedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('glowly_lessons_saved');
      return saved ? JSON.parse(saved) : ['lesson-3', 'lesson-6'];
    } catch {
      return ['lesson-3', 'lesson-6'];
    }
  });

  // 9. Journal State
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('glowly_journal');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'journal-1',
              date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
              routineCompleted: { morning: true, evening: true, body: true },
              skinFeel: 'calm_balanced',
              notes: 'واقي شمس بوبانا الجل كان خفيف جداً وما سببش أي لمعان دهني طول اليوم!',
            },
          ];
    } catch {
      return [];
    }
  });

  // 10. Currency State (defaults to EGP for Egyptian beauty market)
  const [currency, setCurrency] = useState<Currency>(profile.currency || 'EGP');

  // 11. Admin State
  const [isAdmin, setIsAdmin] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('glowly_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('glowly_shelf', JSON.stringify(shelf));
  }, [shelf]);

  useEffect(() => {
    localStorage.setItem('glowly_rt_am', JSON.stringify(morningRoutine));
  }, [morningRoutine]);

  useEffect(() => {
    localStorage.setItem('glowly_rt_pm', JSON.stringify(eveningRoutine));
  }, [eveningRoutine]);

  useEffect(() => {
    localStorage.setItem('glowly_rt_body', JSON.stringify(bodyRoutine));
  }, [bodyRoutine]);

  useEffect(() => {
    localStorage.setItem('glowly_rt_weekly', JSON.stringify(weeklyRoutine));
  }, [weeklyRoutine]);

  useEffect(() => {
    localStorage.setItem('glowly_shopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('glowly_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('glowly_lessons_done', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('glowly_lessons_saved', JSON.stringify(savedLessons));
  }, [savedLessons]);

  useEffect(() => {
    localStorage.setItem('glowly_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // Fetch live catalog from server
  const refreshCatalog = async () => {
    try {
      const res = await fetch('/api/catalog');
      const data = await res.json();
      if (data.products && Array.isArray(data.products)) {
        setCatalog(data.products);
      }
    } catch (err) {
      console.warn('Using local catalog fallback:', err);
    }
  };

  useEffect(() => {
    refreshCatalog();
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    if (updates.currency) {
      setCurrency(updates.currency);
    }
    if (updates.language) {
      setLanguage(updates.language);
    }
  };

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
  };

  const clearAllUserData = () => {
    try {
      localStorage.removeItem('glowly_profile');
      localStorage.removeItem('glowly_shelf');
      localStorage.removeItem('glowly_rt_am');
      localStorage.removeItem('glowly_rt_pm');
      localStorage.removeItem('glowly_rt_body');
      localStorage.removeItem('glowly_rt_weekly');
      localStorage.removeItem('glowly_shopping');
      localStorage.removeItem('glowly_favorites');
      localStorage.removeItem('glowly_lessons_done');
      localStorage.removeItem('glowly_lessons_saved');
      localStorage.removeItem('glowly_journal');
    } catch (e) {
      console.warn(e);
    }
    setProfile(DEFAULT_PROFILE);
    setShelf([]);
    setMorningRoutine(INITIAL_MORNING_STEPS);
    setEveningRoutine(INITIAL_EVENING_STEPS);
    setBodyRoutine(INITIAL_BODY_STEPS);
    setWeeklyRoutine(INITIAL_WEEKLY_STEPS);
    setShoppingList([]);
    setFavorites([]);
    setCompletedLessons([]);
    setSavedLessons([]);
    setJournalEntries([]);
  };

  const addToShelf = (item: Omit<ShelfItem, 'id'>) => {
    const newItem: ShelfItem = {
      ...item,
      id: `shelf-${Date.now()}`,
    };
    setShelf((prev) => [newItem, ...prev]);
  };

  const updateShelfItem = (id: string, updates: Partial<ShelfItem>) => {
    setShelf((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeFromShelf = (id: string) => {
    setShelf((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleRoutineStep = (
    stepId: string,
    period: 'morning' | 'evening' | 'body' | 'weekly'
  ) => {
    const updater = (prev: RoutineStep[]) =>
      prev.map((s) => (s.id === stepId ? { ...s, completedToday: !s.completedToday } : s));
    if (period === 'morning') setMorningRoutine(updater);
    else if (period === 'evening') setEveningRoutine(updater);
    else if (period === 'body') setBodyRoutine(updater);
    else setWeeklyRoutine(updater);
  };

  const addRoutineStep = (
    period: 'morning' | 'evening' | 'body' | 'weekly',
    step: Omit<RoutineStep, 'id'>
  ) => {
    const newStep: RoutineStep = {
      ...step,
      id: `rt-${Date.now()}`,
    };
    if (period === 'morning') setMorningRoutine((prev) => [...prev, newStep]);
    else if (period === 'evening') setEveningRoutine((prev) => [...prev, newStep]);
    else if (period === 'body') setBodyRoutine((prev) => [...prev, newStep]);
    else setWeeklyRoutine((prev) => [...prev, newStep]);
  };

  const removeRoutineStep = (
    stepId: string,
    period: 'morning' | 'evening' | 'body' | 'weekly'
  ) => {
    if (period === 'morning') setMorningRoutine((prev) => prev.filter((s) => s.id !== stepId));
    else if (period === 'evening') setEveningRoutine((prev) => prev.filter((s) => s.id !== stepId));
    else if (period === 'body') setBodyRoutine((prev) => prev.filter((s) => s.id !== stepId));
    else setWeeklyRoutine((prev) => prev.filter((s) => s.id !== stepId));
  };

  const addToShoppingList = (item: Omit<ShoppingItem, 'id'>) => {
    const newItem: ShoppingItem = {
      ...item,
      id: `shop-${Date.now()}`,
    };
    setShoppingList((prev) => [newItem, ...prev]);
  };

  const removeFromShoppingList = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleShoppingItemPurchased = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, purchased: !item.purchased } : item))
    );
  };

  const clearPurchasedShoppingItems = () => {
    setShoppingList((prev) => prev.filter((item) => !item.purchased));
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const toggleLessonCompleted = (lessonId: string) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const toggleLessonSaved = (lessonId: string) => {
    setSavedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
  };

  const addProductToCatalog = async (product: Omit<Product, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(product),
      });
      if (res.ok) {
        await refreshCatalog();
        return true;
      }
      if (res.status === 401) {
        setIsAdmin(false);
        return false;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const updateProductInCatalog = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/catalog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await refreshCatalog();
        return true;
      }
      if (res.status === 401) {
        setIsAdmin(false);
        return false;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteProductFromCatalog = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/catalog/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) {
        await refreshCatalog();
        return true;
      }
      if (res.status === 401) {
        setIsAdmin(false);
        return false;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const formatPrice = (amount: number, overrideCurrency?: Currency): string => {
    const curr = overrideCurrency || currency;
    if (curr === 'EGP') {
      return language === 'ar' ? `${Math.round(amount)} ج.م` : `${Math.round(amount)} EGP`;
    }
    const symbols: Record<Currency, string> = {
      EGP: language === 'ar' ? 'ج.م' : 'EGP',
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'CA$',
      AUD: 'AU$',
    };
    const symbol = symbols[curr] || '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <BeautyContext.Provider
      value={{
        language,
        setLanguage,
        isRTL,
        t,
        profile,
        updateProfile,
        resetProfile,
        isOnboardingOpen,
        setIsOnboardingOpen,
        catalog,
        refreshCatalog,
        addProductToCatalog,
        updateProductInCatalog,
        deleteProductFromCatalog,
        shelf,
        addToShelf,
        updateShelfItem,
        removeFromShelf,
        morningRoutine,
        eveningRoutine,
        bodyRoutine,
        weeklyRoutine,
        toggleRoutineStep,
        addRoutineStep,
        removeRoutineStep,
        shoppingList,
        addToShoppingList,
        removeFromShoppingList,
        toggleShoppingItemPurchased,
        clearPurchasedShoppingItems,
        favorites,
        toggleFavorite,
        completedLessons,
        savedLessons,
        toggleLessonCompleted,
        toggleLessonSaved,
        journalEntries,
        addJournalEntry,
        currency,
        setCurrency,
        formatPrice,
        isAdmin,
        setIsAdmin,
        clearAllUserData,
      }}
    >
      {children}
    </BeautyContext.Provider>
  );
};

export const useBeauty = () => {
  const context = useContext(BeautyContext);
  if (!context) {
    throw new Error('useBeauty must be used within a BeautyProvider');
  }
  return context;
};
