import React from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bookmark,
  BookOpen,
  DollarSign,
  Droplets,
  Layers,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';
import { ACADEMY_LESSONS } from '../data/academy';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenAI: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenAI }) => {
  const {
    profile,
    morningRoutine,
    eveningRoutine,
    toggleRoutineStep,
    shelf,
    completedLessons,
    setIsOnboardingOpen,
    isRTL,
    language,
    t,
    clearAllUserData,
  } = useBeauty();

  const amCompletedCount = morningRoutine.filter((s) => s.completedToday).length;
  const pmCompletedCount = eveningRoutine.filter((s) => s.completedToday).length;

  const nextLesson =
    ACADEMY_LESSONS.find((l) => !completedLessons.includes(l.id)) || ACADEMY_LESSONS[0];

  const skinTypeLabel = t(
    (`st${profile.skinType.charAt(0).toUpperCase() + profile.skinType.slice(1)}` as any) || 'stCombination'
  );

  return (
    <div className="space-y-10 pb-16 animate-in fade-in">
      {/* 1. Hero Section (Split 2-Column Balanced Design with High-Fidelity Editorial Asset) */}
      <section className="bg-white rounded-3xl border border-[#EAE3DA] overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[460px]">
          {/* Text Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Unboxed Metadata kicker with typographic dots */}
              <div className="flex items-center gap-2 text-xs text-[#8C7D73] font-medium tracking-wide">
                <span>{t('heroKicker')}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{skinTypeLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.ageRange} {language === 'ar' ? 'سنة' : 'Years'}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#28231D] tracking-tight leading-[1.2]">
                {t('heroGreeting', { name: profile.name || (language === 'ar' ? 'جميلتي' : 'Beautiful') })}
              </h1>

              <p className="text-[#544B46] text-sm sm:text-base leading-relaxed max-w-xl">
                {t('heroDescription')}
              </p>
            </div>

            {/* Quick Consultation Badges & Action Buttons */}
            <div className="pt-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('routines')}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#28231D] hover:bg-[#3D352E] rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <Sun className="w-4 h-4 text-[#E8B4B8]" />
                  <span>{t('startMorningRoutine')}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180 mr-1' : 'ml-1'}`} />
                </button>

                <button
                  onClick={onOpenAI}
                  className="px-5 py-2.5 text-xs font-semibold text-[#28231D] bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EAE3DA] rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#C87D87]" />
                  <span>{t('askGlowlyAI')}</span>
                </button>

                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="text-xs text-[#8C7D73] hover:text-[#28231D] underline ml-2 cursor-pointer"
                >
                  {t('editProfile')}
                </button>
              </div>

              {/* Quiet Micro Summary */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#8C7D73] pt-2 border-t border-[#F2ECE4]">
                <span>
                  {t('activeConcerns')}:{' '}
                  <strong className="text-[#28231D] font-normal">
                    {profile.concerns.slice(0, 2).join('، ') || (language === 'ar' ? 'نضارة وحماية الحاجز' : 'Healthy Radiance')}
                  </strong>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {t('budgetTier')}:{' '}
                  <strong className="font-medium text-[#28231D] capitalize">
                    {profile.budgetTier === 'budget'
                      ? (language === 'ar' ? 'اقتصادي (صيدليات مصر)' : 'Budget / Pharmacy')
                      : profile.budgetTier.replace('_', ' ')}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative bg-[#FAF7F2] min-h-[300px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_glowly_beauty_1791894054782.jpg"
              alt="Glowly AI beauty model in morning sunlight"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </section>

      {/* 2. Today's Key Activity Dashboard */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Morning Skincare */}
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#8C7D73]">
              <div className="flex items-center gap-1.5 font-medium text-[#28231D]">
                <Sun className="w-4 h-4 text-[#C87D87]" />
                <span>{t('morningRoutineCard')}</span>
              </div>
              <span className="font-mono tabular-nums">
                {t('doneCount', { done: amCompletedCount, total: morningRoutine.length })}
              </span>
            </div>

            <div className="w-full bg-[#FAF7F2] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#C87D87] h-1.5 transition-all duration-300"
                style={{ width: `${(amCompletedCount / (morningRoutine.length || 1)) * 100}%` }}
              />
            </div>

            <div className="space-y-2 pt-2">
              {morningRoutine.slice(0, 3).map((step) => {
                const title = language === 'ar' && step.stepNameAr ? step.stepNameAr : step.stepName;
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleRoutineStep(step.id, 'morning')}
                    className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-[#FAF7F2] cursor-pointer transition-colors"
                  >
                    <span className={step.completedToday ? 'line-through text-[#8C7D73]' : 'text-[#28231D]'}>
                      {step.stepNumber}. {title}
                    </span>
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        step.completedToday ? 'text-emerald-600' : 'text-[#D9C5B2]'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#F2ECE4] mt-4 flex items-center justify-between">
            <button
              onClick={() => onNavigate('routines')}
              className="text-xs font-semibold text-[#28231D] hover:text-[#C87D87] flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'ar' ? 'عرض الروتين الصباحي بالكامل' : 'View full AM routine'}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Card 2: Evening Skincare */}
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#8C7D73]">
              <div className="flex items-center gap-1.5 font-medium text-[#28231D]">
                <Moon className="w-4 h-4 text-[#6A5D7B]" />
                <span>{t('eveningRoutineCard')}</span>
              </div>
              <span className="font-mono tabular-nums">
                {t('doneCount', { done: pmCompletedCount, total: eveningRoutine.length })}
              </span>
            </div>

            <div className="w-full bg-[#FAF7F2] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#6A5D7B] h-1.5 transition-all duration-300"
                style={{ width: `${(pmCompletedCount / (eveningRoutine.length || 1)) * 100}%` }}
              />
            </div>

            <div className="space-y-2 pt-2">
              {eveningRoutine.slice(0, 3).map((step) => {
                const title = language === 'ar' && step.stepNameAr ? step.stepNameAr : step.stepName;
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleRoutineStep(step.id, 'evening')}
                    className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-[#FAF7F2] cursor-pointer transition-colors"
                  >
                    <span className={step.completedToday ? 'line-through text-[#8C7D73]' : 'text-[#28231D]'}>
                      {step.stepNumber}. {title}
                    </span>
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        step.completedToday ? 'text-emerald-600' : 'text-[#D9C5B2]'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#F2ECE4] mt-4 flex items-center justify-between">
            <button
              onClick={() => onNavigate('routines')}
              className="text-xs font-semibold text-[#28231D] hover:text-[#C87D87] flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'ar' ? 'عرض الروتين المسائي بالكامل' : 'View full PM routine'}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Card 3: Next Lesson in Academy */}
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#8C7D73]">
              <div className="flex items-center gap-1.5 font-medium text-[#28231D]">
                <BookOpen className="w-4 h-4 text-[#C87D87]" />
                <span>{t('makeupAcademyCard')}</span>
              </div>
              <span className="capitalize">
                {nextLesson.level === 'beginner'
                  ? (language === 'ar' ? 'مبتدئة' : 'Beginner')
                  : nextLesson.level === 'intermediate'
                  ? (language === 'ar' ? 'متوسطة' : 'Intermediate')
                  : (language === 'ar' ? 'متقدمة' : 'Advanced')}
              </span>
            </div>

            <h4 className="font-serif text-base font-bold text-[#28231D] leading-snug line-clamp-2">
              {language === 'ar' && nextLesson.titleAr ? nextLesson.titleAr : nextLesson.title}
            </h4>

            <p className="text-xs text-[#544B46] line-clamp-3 leading-relaxed">
              {language === 'ar' && nextLesson.overviewAr ? nextLesson.overviewAr : nextLesson.overview}
            </p>

            <div className="text-[11px] text-[#8C7D73] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>{t('minReadPractice', { min: nextLesson.durationMinutes })}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F2ECE4] mt-4">
            <button
              onClick={() => onNavigate('academy')}
              className="w-full py-2 text-center text-xs font-semibold text-[#28231D] bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EAE3DA] rounded-xl transition-colors cursor-pointer"
            >
              {t('startLesson')}
            </button>
          </div>
        </div>
      </section>

      {/* 3. Personalized Self-Care Suites Quick Nav */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#28231D]">{t('suitesHeading')}</h3>
            <p className="text-xs text-[#8C7D73]">{t('suitesSub')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Suite 1: Smart Budget Mode */}
          <div
            onClick={() => onNavigate('finder')}
            className="p-5 bg-white border border-[#EAE3DA] rounded-2xl hover:border-[#C87D87] transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#28231D] mb-3 group-hover:bg-[#F7EBEB] group-hover:text-[#C87D87] transition-colors">
              <DollarSign className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#28231D] mb-1">
              {language === 'ar' ? 'وضع الميزانية الذكية' : 'Smart Budget Mode'}
            </h4>
            <p className="text-xs text-[#544B46] leading-relaxed">
              {language === 'ar'
                ? 'حددي ميزانيتك بالجنيه. نحسب لكِ أساسيات البشرة أولاً مع تأجيل المشتريات غير الضرورية.'
                : 'Enter your total budget in EGP. We calculate essentials vs optional buys and postpone non-critical items.'}
            </p>
          </div>

          {/* Suite 2: Ingredient Decoder */}
          <div
            onClick={() => onNavigate('decoder')}
            className="p-5 bg-white border border-[#EAE3DA] rounded-2xl hover:border-[#C87D87] transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#28231D] mb-3 group-hover:bg-[#F7EBEB] group-hover:text-[#C87D87] transition-colors">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#28231D] mb-1">
              {t('navDecoder')}
            </h4>
            <p className="text-xs text-[#544B46] leading-relaxed">
              {language === 'ar'
                ? 'الصقي قائمة المكونات لأي عبوة لمعرفة درجة انسداد المسام وخطر التحسس والفوائد الفعلية.'
                : 'Paste any INCI formula. Instantly see comedogenic scores, irritation flags, and active percentages.'}
            </p>
          </div>

          {/* Suite 3: Dupe Finder */}
          <div
            onClick={() => onNavigate('dupes')}
            className="p-5 bg-white border border-[#EAE3DA] rounded-2xl hover:border-[#C87D87] transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#28231D] mb-3 group-hover:bg-[#F7EBEB] group-hover:text-[#C87D87] transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#28231D] mb-1">
              {language === 'ar' ? 'بدائل المنتجات (الدوبس)' : 'Dupe Finder'}
            </h4>
            <p className="text-xs text-[#544B46] leading-relaxed">
              {language === 'ar'
                ? 'وفري آلاف الجنيهات مع بدائل مصرية وصيدلانية مطابقة علمياً للماركات العالمية الباهظة.'
                : 'Save up to 85% by finding clinically proven drugstore and Egyptian twins for luxury beauty.'}
            </p>
          </div>

          {/* Suite 4: GRWM Planner */}
          <div
            onClick={() => onNavigate('grwm')}
            className="p-5 bg-white border border-[#EAE3DA] rounded-2xl hover:border-[#C87D87] transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#28231D] mb-3 group-hover:bg-[#F7EBEB] group-hover:text-[#C87D87] transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#28231D] mb-1">
              {language === 'ar' ? 'مخطط استعدي معي (GRWM)' : 'GRWM Planner'}
            </h4>
            <p className="text-xs text-[#544B46] leading-relaxed">
              {language === 'ar'
                ? 'لديكِ 10 أو 25 دقيقة؟ جدول زمني بالدقائق لترتيب خطواتكِ الصباحية أو مكياج المناسبات.'
                : 'Got 10, 25, or 45 minutes? Build an ordered getting-ready plan for dates, work, or weddings.'}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Vanity Shelf Status Callout */}
      <section className="bg-[#FAF7F2] border border-[#EAE3DA] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs text-[#8C7D73] font-medium">
            <Bookmark className="w-4 h-4 text-[#C87D87]" />
            <span>{language === 'ar' ? 'خزانتكِ الرقمية' : 'Digital Vanity Cabinet'}</span>
          </div>
          <h4 className="font-serif text-xl font-bold text-[#28231D]">
            {t('vanityTitle', { count: shelf.length, s: shelf.length === 1 ? '' : 's' })}
          </h4>
          <p className="text-xs sm:text-sm text-[#544B46] leading-relaxed">
            {t('vanitySub')}
          </p>
        </div>

        <button
          onClick={() => onNavigate('shelf')}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-[#28231D] hover:bg-[#3D352E] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
        >
          {t('manageShelf')}
        </button>
      </section>

      {/* 5. Medical Disclaimer & Privacy Controls */}
      <section className="p-4 bg-white/70 border border-[#EAE3DA] rounded-xl text-xs text-[#8C7D73] leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="max-w-3xl">{t('medicalDisclaimer')}</p>
        <button
          onClick={() => {
            const confirmed = window.confirm(
              language === 'ar'
                ? 'هل أنتِ متأكدة من رغبتكِ في مسح كافة بياناتكِ المخصصة واستعادة إعدادات البداية؟'
                : 'Are you sure you want to delete all stored personal profile, routines, and shelf data?'
            );
            if (confirmed) {
              clearAllUserData();
            }
          }}
          className="text-[11px] text-[#8C7D73] hover:text-rose-700 underline shrink-0 cursor-pointer text-left sm:text-right"
        >
          {language === 'ar' ? 'حذف كافة بياناتي المحلية 🗑️' : 'Purge All My Local Data 🗑️'}
        </button>
      </section>
    </div>
  );
};
