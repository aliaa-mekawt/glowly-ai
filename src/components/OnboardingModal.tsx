import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Sparkles, Shield, Heart } from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';
import { AgeRange, SkinType, MakeupLevel, BudgetTier, Currency, Undertone, SkinTone } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, language, isRTL, t } = useBeauty();

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form state
  const [name, setName] = useState(profile.name || 'Sophia');
  const [ageRange, setAgeRange] = useState<AgeRange>(profile.ageRange || '18–24');
  const [skinType, setSkinType] = useState<SkinType>(profile.skinType || 'combination');
  const [concerns, setConcerns] = useState<string[]>(profile.concerns || []);
  const [sensitivities, setSensitivities] = useState<string[]>(profile.sensitivities || []);
  const [currentRoutineSummary, setCurrentRoutineSummary] = useState(
    profile.currentRoutineSummary || ''
  );
  const [makeupExperience, setMakeupExperience] = useState<MakeupLevel>(
    profile.makeupExperience || 'beginner'
  );
  const [makeupStyle, setMakeupStyle] = useState<string[]>(profile.makeupStyle || []);
  const [skinTone, setSkinTone] = useState<SkinTone>(profile.skinTone || 'light');
  const [undertone, setUndertone] = useState<Undertone>(profile.undertone || 'neutral');
  const [bodyConcerns, setBodyConcerns] = useState<string[]>(profile.bodyConcerns || []);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(profile.budgetTier || 'budget');
  const [monthlyBudget, setMonthlyBudget] = useState<number>(profile.monthlyBudget || 600);
  const [currency, setCurrency] = useState<Currency>(profile.currency || 'EGP');

  if (!isOpen) return null;

  const toggleArrayItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSaveAndComplete = () => {
    updateProfile({
      name,
      ageRange,
      skinType,
      concerns,
      sensitivities,
      currentRoutineSummary,
      makeupExperience,
      makeupStyle,
      skinTone,
      undertone,
      bodyConcerns,
      budgetTier,
      monthlyBudget,
      currency,
      completedOnboarding: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#FAF7F2] border border-[#EAE3DA] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE3DA] flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#8C7D73] font-medium">
                {t('onboardingTitle')} · {t('stepOf', { step, total: totalSteps })}
              </span>
              {ageRange === '15–17' && (
                <span className="text-[11px] text-[#C87D87] font-medium">
                  · {t('teenFriendlyBadge')}
                </span>
              )}
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#28231D] mt-0.5">
              {step === 1 && (language === 'ar' ? 'لنتعرف عليكِ وعلى عمرك' : "Let's Get to Know You")}
              {step === 2 && (language === 'ar' ? 'نوع بشرتك وروتينك اليومي' : 'Your Skin Type & Daily Habits')}
              {step === 3 && (language === 'ar' ? 'أهداف بشرتك والتحسس' : 'Skin Concerns & Sensitivities')}
              {step === 4 && (language === 'ar' ? 'خبرتك في المكياج والستايل' : 'Makeup Experience & Desired Looks')}
              {step === 5 && (language === 'ar' ? 'درجة لون البشرة والآندرتون' : 'Skin Tone, Undertone & Body Care')}
              {step === 6 && (language === 'ar' ? 'الميزانية والمشتريات والماركات' : 'Budget & Shopping Preferences')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8C7D73] hover:text-[#28231D] rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#EAE3DA] h-1">
          <div
            className="bg-[#C87D87] h-1 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Name and Age Range */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#28231D] mb-1.5">
                  {t('nameQuestion')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'ar' ? 'مثلاً: صوفيا أو سارة' : 'e.g. Sophia'}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9C5B2] bg-white text-[#28231D] focus:outline-none focus:ring-2 focus:ring-[#C87D87]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#28231D] mb-2">
                  {t('ageQuestion')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['15–17', '18–24', '25–30', '31–35'] as AgeRange[]).map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setAgeRange(range)}
                      className={`p-3 text-center rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                        ageRange === range
                          ? 'border-[#C87D87] bg-[#F7EBEB] text-[#28231D] shadow-sm'
                          : 'border-[#EAE3DA] bg-white text-[#544B46] hover:border-[#D9C5B2]'
                      }`}
                    >
                      {range} {language === 'ar' ? 'سنة' : 'yrs'}
                    </button>
                  ))}
                </div>
                {ageRange === '15–17' && (
                  <p className="mt-2 text-xs text-[#8C7D73] leading-relaxed bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    {t('teenNote')}
                  </p>
                )}
              </div>

              <div className="bg-[#F4EFEA] p-4 rounded-xl text-xs text-[#544B46] space-y-1">
                <div className="font-semibold text-[#28231D] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#C87D87]" />
                  <span>{language === 'ar' ? 'حدود الخصوصية والأمان الطبي' : 'Privacy & Medical Boundary'}</span>
                </div>
                <p>
                  {t('medicalDisclaimer')}
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Skin Type & Current Routine */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#28231D] mb-1.5">
                  {t('skinTypeQuestion')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'oily',
                      title: language === 'ar' ? 'دهنية' : 'Oily',
                      desc: language === 'ar' ? 'لمعان بالوجه ومسام واضحة' : 'Shiny across face, enlarged pores',
                    },
                    {
                      id: 'dry',
                      title: language === 'ar' ? 'جافة' : 'Dry',
                      desc: language === 'ar' ? 'شد بالجلد أو قشور وجفاف' : 'Tight, flaking or dull patches',
                    },
                    {
                      id: 'combination',
                      title: language === 'ar' ? 'مختلطة' : 'Combination',
                      desc: language === 'ar' ? 'منطقة T دهنية والخدود عادية' : 'Oily T-zone, normal/dry cheeks',
                    },
                    {
                      id: 'normal',
                      title: language === 'ar' ? 'عادية' : 'Normal',
                      desc: language === 'ar' ? 'متوازنة ومريحة' : 'Comfortable and balanced',
                    },
                    {
                      id: 'sensitive',
                      title: language === 'ar' ? 'حساسة' : 'Sensitive',
                      desc: language === 'ar' ? 'احمرار سريع ووخز من المنتجات' : 'Easily red, stings with products',
                    },
                    {
                      id: 'unsure',
                      title: language === 'ar' ? 'غير متأكدة' : 'Unsure',
                      desc: language === 'ar' ? 'لم أحددها بعد' : 'Not certain yet',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSkinType(item.id as SkinType)}
                      className={`p-3 rounded-xl border text-sm transition-all cursor-pointer ${
                        isRTL ? 'text-right' : 'text-left'
                      } ${
                        skinType === item.id
                          ? 'border-[#C87D87] bg-[#F7EBEB] text-[#28231D] shadow-sm font-semibold'
                          : 'border-[#EAE3DA] bg-white text-[#544B46] hover:border-[#D9C5B2]'
                      }`}
                    >
                      <div className="font-medium text-[#28231D]">{item.title}</div>
                      <div className="text-xs text-[#8C7D73] mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#28231D] mb-1.5">
                  {language === 'ar' ? 'ما هو روتينك الحالي؟ وما المنتجات التي تملكينها؟' : 'Tell us about your current daily routine (Optional)'}
                </label>
                <textarea
                  rows={3}
                  value={currentRoutineSummary}
                  onChange={(e) => setCurrentRoutineSummary(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'مثلاً: بستخدم غسول ستارفيل ومرطب إيفا، وبدور على واقي شمس خفيف مش بيزيت في الصيف...'
                      : 'e.g. Wash face with gentle foaming wash, use CeraVe moisturizer, looking for lightweight daily sunscreen'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9C5B2] bg-white text-[#28231D] text-sm focus:outline-none focus:ring-2 focus:ring-[#C87D87]"
                />
                <p className="text-xs text-[#8C7D73] mt-1">
                  {language === 'ar'
                    ? 'نعطي الأولوية لما تملكينه بالفعل في خزانكِ لمنع إهدار الأموال.'
                    : 'We will prioritize integrating products you already own to prevent wasted money.'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Concerns and Sensitivities */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#28231D] mb-2">
                  {t('concernsQuestion')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { en: 'Acne & breakouts', ar: 'الحبوب والبثور' },
                    { en: 'Hyperpigmentation & dark spots', ar: 'التصبغات والبقع الداكنة' },
                    { en: 'Redness & barrier repair', ar: 'الاحمرار وترميم الحاجز' },
                    { en: 'Pores & excess oil', ar: 'المسام والزيوت الزائدة' },
                    { en: 'Dehydration', ar: 'نقص الترطيب الداخلي' },
                    { en: 'Dullness', ar: 'شحوب البشرة وفقدان النضارة' },
                    { en: 'Fine lines', ar: 'الخطوط الدقيقة' },
                    { en: 'Texture', ar: 'خشونة الملمس والتحبب' },
                  ].map((item) => {
                    const label = language === 'ar' ? item.ar : item.en;
                    const isSelected = concerns.includes(item.en);
                    return (
                      <button
                        key={item.en}
                        type="button"
                        onClick={() => toggleArrayItem(concerns, setConcerns, item.en)}
                        className={`p-2.5 text-xs rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isRTL ? 'text-right' : 'text-left'
                        } ${
                          isSelected
                            ? 'border-[#C87D87] bg-[#F7EBEB] text-[#28231D] font-medium'
                            : 'border-[#EAE3DA] bg-white text-[#544B46] hover:border-[#D9C5B2]'
                        }`}
                      >
                        <span>{label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C87D87] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#28231D] mb-2">
                  {t('sensitivitiesQuestion')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { en: 'Fragrance / Essential Oils', ar: 'العطور والزيوت العطرية' },
                    { en: 'Strong Exfoliating Acids', ar: 'المقشرات الكيميائية القوية' },
                    { en: 'Niacinamide High %', ar: 'تركيزات النياسيناميد العالية' },
                    { en: 'Alcohol / Denat', ar: 'الكحول المجفف' },
                    { en: 'Sulfates', ar: 'الكبريتات والصابون القاسي' },
                    { en: 'None Known', ar: 'لا توجد حساسية معروفة' },
                  ].map((sens) => {
                    const label = language === 'ar' ? sens.ar : sens.en;
                    const isSelected = sensitivities.includes(sens.en);
                    return (
                      <button
                        key={sens.en}
                        type="button"
                        onClick={() => toggleArrayItem(sensitivities, setSensitivities, sens.en)}
                        className={`p-2.5 text-xs rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isRTL ? 'text-right' : 'text-left'
                        } ${
                          isSelected
                            ? 'border-amber-400 bg-amber-50 text-amber-900 font-medium'
                            : 'border-[#EAE3DA] bg-white text-[#544B46] hover:border-[#D9C5B2]'
                        }`}
                      >
                        <span>{label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Makeup Comfort */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#28231D] mb-2">
                  {t('makeupComfortQuestion')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'beginner',
                      title: language === 'ar' ? 'مبتدئة' : 'Beginner',
                      desc: language === 'ar' ? 'أفضل اللمسات الطبيعية الخفيفة وأتعلم الأساسيات' : 'New to makeup, preferring natural easy steps',
                    },
                    {
                      id: 'intermediate',
                      title: language === 'ar' ? 'متوسطة' : 'Intermediate',
                      desc: language === 'ar' ? 'أجيد الفاونديشن والكونسيلر والماسكارا اليومية' : 'Comfortable with everyday base, concealer, and eyes',
                    },
                    {
                      id: 'advanced',
                      title: language === 'ar' ? 'متقدمة' : 'Advanced',
                      desc: language === 'ar' ? 'أتقن الكونتور والآيلاينر ومكياج المناسبات' : 'Loves experimenting with full glam and contouring',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMakeupExperience(item.id as MakeupLevel)}
                      className={`p-4 rounded-xl border text-sm transition-all cursor-pointer ${
                        isRTL ? 'text-right' : 'text-left'
                      } ${
                        makeupExperience === item.id
                          ? 'border-[#C87D87] bg-[#F7EBEB] text-[#28231D] font-semibold'
                          : 'border-[#EAE3DA] bg-white text-[#544B46] hover:border-[#D9C5B2]'
                      }`}
                    >
                      <div className="font-bold text-[#28231D]">{item.title}</div>
                      <div className="text-xs text-[#8C7D73] mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Skin Depth & Undertone */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#28231D] mb-2">
                  {t('undertoneQuestion')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'cool', en: 'Cool (Pink/Blue)', ar: 'بارد (وردي/أزرق)' },
                    { id: 'warm', en: 'Warm (Golden/Yellow)', ar: 'دافئ (ذهبي/أصفر)' },
                    { id: 'neutral', en: 'Neutral (Balanced)', ar: 'محايد (متوازن)' },
                    { id: 'olive', en: 'Olive (Greenish hint)', ar: 'زيتوني (مائل للخضرة)' },
                    { id: 'unsure', en: 'Unsure', ar: 'غير متأكدة' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setUndertone(item.id as Undertone)}
                      className={`p-3 text-center rounded-xl border text-xs transition-all cursor-pointer ${
                        undertone === item.id
                          ? 'border-[#C87D87] bg-[#F7EBEB] text-[#28231D] font-semibold'
                          : 'border-[#EAE3DA] bg-white text-[#544B46] hover:border-[#D9C5B2]'
                      }`}
                    >
                      {language === 'ar' ? item.ar : item.en}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#28231D] mb-2">
                  {language === 'ar' ? 'مشاكل العناية بالجسم التي تهمك:' : 'Body Care Concerns:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { en: 'Keratosis pilaris/strawberry skin', ar: 'جلد الوزة (خشونة المسام بالساقين)' },
                    { en: 'Body breakouts / bacne', ar: 'حبوب الظهر والكتفين' },
                    { en: 'Rough elbows & cracked heels', ar: 'خشونة الكعبين والأكواع' },
                  ].map((bc) => {
                    const isSelected = bodyConcerns.includes(bc.en);
                    return (
                      <button
                        key={bc.en}
                        type="button"
                        onClick={() => toggleArrayItem(bodyConcerns, setBodyConcerns, bc.en)}
                        className={`p-3 text-xs rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isRTL ? 'text-right' : 'text-left'
                        } ${
                          isSelected
                            ? 'border-[#C87D87] bg-[#F7EBEB] text-[#28231D] font-medium'
                            : 'border-[#EAE3DA] bg-white text-[#544B46] hover:border-[#D9C5B2]'
                        }`}
                      >
                        <span>{language === 'ar' ? bc.ar : bc.en}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C87D87] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Budget Tier & Currency */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#28231D] mb-2">
                  {t('budgetTierQuestion')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'budget',
                      title: language === 'ar' ? 'اقتصادي (صيدليات مصر)' : 'Budget / Drugstore',
                      desc: language === 'ar' ? 'بوبانا، ستارفيل، إيفا، كارباميد (أقل من 300 ج.م للمنتج)' : 'Egyptian heroes & affordable gems (< 300 EGP / $8)',
                    },
                    {
                      id: 'mid_range',
                      title: language === 'ar' ? 'متوسط (ماركات طبية)' : 'Mid-Range / Clinical',
                      desc: language === 'ar' ? 'إنفينيتي، سيرافي، ذا أورديناري (300 - 700 ج.م)' : 'Infinity, CeraVe, The Ordinary (300–700 EGP)',
                    },
                    {
                      id: 'luxury',
                      title: language === 'ar' ? 'فاخر / مستورد' : 'Prestige / Luxury',
                      desc: language === 'ar' ? 'لاروش بوزيه، بيوديرما، كوري (700+ ج.م)' : 'La Roche-Posay, K-Beauty, Prestige',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBudgetTier(item.id as BudgetTier)}
                      className={`p-4 rounded-xl border text-sm transition-all cursor-pointer ${
                        isRTL ? 'text-right' : 'text-left'
                      } ${
                        budgetTier === item.id
                          ? 'border-[#C87D87] bg-[#F7EBEB] text-[#28231D] font-semibold'
                          : 'border-[#EAE3DA] bg-white text-[#544B46] hover:border-[#D9C5B2]'
                      }`}
                    >
                      <div className="font-bold text-[#28231D]">{item.title}</div>
                      <div className="text-xs text-[#8C7D73] mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#28231D] mb-1.5">
                  {language === 'ar' ? 'الميزانية الشهرية التقريبية لمنتجاتك:' : 'Approximate Monthly Product Budget:'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    className="w-36 px-4 py-2.5 rounded-xl border border-[#D9C5B2] bg-white text-[#28231D] font-mono text-sm"
                  />
                  <span className="text-sm font-semibold text-[#28231D] font-mono">
                    EGP (جنيه مصري)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 border-t border-[#EAE3DA] bg-white flex items-center justify-between shrink-0">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#544B46] hover:bg-[#FAF7F2] disabled:opacity-30 cursor-pointer"
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t('back')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAndComplete}
              className="text-xs text-[#8C7D73] hover:text-[#28231D] underline px-2 cursor-pointer"
            >
              {t('skipForNow')}
            </button>

            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#28231D] hover:bg-[#3D352E] cursor-pointer shadow-sm"
              >
                <span>{t('continue')}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAndComplete}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C87D87] hover:bg-[#B76E78] cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>{t('saveAndComplete')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
