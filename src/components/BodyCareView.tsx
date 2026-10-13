import React, { useState } from 'react';
import {
  Sparkles,
  Droplets,
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Plus,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';
import { BODY_CARE_GUIDES } from '../data/bodycare';

export const BodyCareView: React.FC = () => {
  const { bodyRoutine, toggleRoutineStep, addRoutineStep, formatPrice, language, isRTL, t } =
    useBeauty();

  const [activeGuideId, setActiveGuideId] = useState<string>(BODY_CARE_GUIDES[0].id);

  const activeGuide =
    BODY_CARE_GUIDES.find((g) => g.id === activeGuideId) || BODY_CARE_GUIDES[0];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#8C7D73] font-medium tracking-wide">
          <ShieldCheck className="w-4 h-4 text-[#C87D87]" />
          <span>{language === 'ar' ? 'العناية الطبية والجمالية ببشرة الجسم' : 'Holistic Self-Care & Dermatological Care'}</span>
          <span aria-hidden="true">·</span>
          <span>{language === 'ar' ? 'حلول لمشاكل جلد الوزة وحبوب الظهر' : 'Neck Down Skin Wellness'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#28231D] tracking-tight mt-1">
          {t('bodyCareHeading')}
        </h1>
        <p className="text-sm text-[#544B46] mt-1 max-w-xl leading-relaxed">
          {t('bodyCareSub')}
        </p>
      </div>

      {/* Guide Topic Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {BODY_CARE_GUIDES.map((guide) => {
          let topicTitle = guide.topic;
          let subTitle = guide.subtitle;
          if (language === 'ar') {
            if (guide.id === 'kp-strawberry-skin') {
              topicTitle = 'جلد الوزة وخشونة الساقين (KP) 🍓';
              subTitle = 'بروتوكول تنعيم وتذيب كيراتين المسام بكريم كارباميد 10%';
            } else if (guide.id === 'body-acne-bacne') {
              topicTitle = 'حبوب الظهر والكتفين (Bacne)';
              subTitle = 'علاج انسداد المسام من العرق واحتكاك الملابس الرياضية';
            } else if (guide.id === 'fragrance-layering') {
              topicTitle = 'تنسيق وتثبيت العطور طوال اليوم 🌸';
              subTitle = 'فن دمج الزبدة المرطبة والزيوت لتثبيت الفوحان لساعات';
            }
          }

          return (
            <button
              key={guide.id}
              onClick={() => setActiveGuideId(guide.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isRTL ? 'text-right' : 'text-left'
              } ${
                activeGuideId === guide.id
                  ? 'border-[#C87D87] bg-white shadow-sm ring-1 ring-[#C87D87]'
                  : 'border-[#EAE3DA] bg-white hover:border-[#D9C5B2]'
              }`}
            >
              <div>
                <span className="text-[10px] text-[#C87D87] font-semibold uppercase tracking-wider block mb-1">
                  {language === 'ar' ? 'بروتوكول علمي' : 'Clinical Guide'}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#28231D]">
                  {topicTitle}
                </h3>
                <p className="text-xs text-[#544B46] mt-1 line-clamp-2 leading-relaxed">
                  {subTitle}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#28231D] mt-3 block">
                {language === 'ar' ? 'عرض خطوات البروتوكول ←' : 'Read Protocol →'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Guide Content */}
      <div className="bg-white border border-[#EAE3DA] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="space-y-2 pb-6 border-b border-[#F2ECE4]">
          <span className="text-xs font-semibold text-[#C87D87]">
            {language === 'ar' ? 'إرشادات العناية العلمية المتكاملة' : 'Comprehensive Clinical Care'}
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#28231D]">
            {language === 'ar' && activeGuide.id === 'kp-strawberry-skin'
              ? 'علاج جلد الوزة وخشونة الساقين (Keratosis Pilaris)'
              : language === 'ar' && activeGuide.id === 'body-acne-bacne'
              ? 'بروتوكول علاج حبوب الظهر والكتفين'
              : language === 'ar' && activeGuide.id === 'fragrance-layering'
              ? 'تثبيت وتنسيق العطور الفواحة طوال اليوم'
              : activeGuide.topic}
          </h2>
          <p className="text-xs sm:text-sm text-[#544B46] leading-relaxed max-w-2xl">
            {language === 'ar' && activeGuide.id === 'kp-strawberry-skin'
              ? 'جلد الوزة هو تراكم غير ضار لبروتين الكيراتين حول بصيلات الشعر. الفرك العنيف بالليفة يلهب البصيلات ويزيد المشكلة؛ المفتاح الحقيقي هو التقشير الكيميائي باليوريا أو أحماض AHA والترطيب الليلي.'
              : language === 'ar' && activeGuide.id === 'body-acne-bacne'
              ? 'بشرة الجسم سميكة وبها غدد دهنية واسعة. بقايا بلسم الشعر أثناء الاستحمام وعرق التمرين واحتكاك الملابس الرياضية الضيقة هي أكثر الأسباب شيوعاً.'
              : language === 'ar' && activeGuide.id === 'fragrance-layering'
              ? 'جزيئات العطر تتبخر سريعاً على الجلد الجاف. تحضير بشرة مرطبة بالزبدة أو الزيت الطبيعي يثبت جزيئات الرائحة لأكثر من 12 ساعة.'
              : activeGuide.summary}
          </p>
        </div>

        {/* Step-by-Step Recommended Protocol */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#28231D]">
            {language === 'ar' ? 'البروتوكول المقترح (3 خطوات)' : 'Recommended 3-Step Routine'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeGuide.recommendedSteps.map((st) => (
              <div
                key={st.step}
                className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EAE3DA] space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="w-5 h-5 rounded-full bg-white border border-[#EAE3DA] font-mono font-bold flex items-center justify-center text-[#28231D]">
                      {st.step}
                    </span>
                    <span className="text-[11px] font-medium text-[#C87D87]">{st.frequency}</span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#28231D]">{st.name}</h4>
                  <p className="text-xs text-[#544B46] leading-relaxed">{st.instruction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Egyptian Heroes Spotlight */}
        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 text-xs">
          <span className="font-bold text-amber-900 flex items-center gap-1.5">
            <span>🇪🇬</span>
            <span>{language === 'ar' ? 'أفضل المنتجات المصرية الموصى بها في هذا البروتوكول:' : 'Top Egyptian Pharmacy Heroes for this Protocol:'}</span>
          </span>
          {activeGuide.id === 'kp-strawberry-skin' ? (
            <p className="text-amber-800 leading-relaxed">
              {language === 'ar'
                ? 'كريم كارباميد 10% يوريا (El Nile Pharma بـ 25 جنيه) — يوضع كل مساء على الساقين والركب مباشرة بعد الاستحمام، متبوعاً بطبقة من زبدة رو أفريكان الخام لتنعيم فائق.'
                : 'Carbamide 10% Urea Cream (~25 EGP) from Egyptian pharmacies dissolved keratin plugs overnight, sealed with Raw African Whipped Cocoa Butter.'}
            </p>
          ) : activeGuide.id === 'body-acne-bacne' ? (
            <p className="text-amber-800 leading-relaxed">
              {language === 'ar'
                ? 'ستارفيل غسول الوجه والجسم بحمض الساليسيليك وزيت شجرة الشاي (150 ج.م) — يترك على الظهر والصدر لمدة دقيقتين قبل الشطف بالماء الفاتر.'
                : 'Starville Salicylic Cleanser (~150 EGP) left on chest and back for 2 minutes before rinsing.'}
            </p>
          ) : (
            <p className="text-amber-800 leading-relaxed">
              {language === 'ar'
                ? 'زبدة الشيا والكاكاو المخفوقة من رو أفريكان (230 ج.م) — توضع كقاعدة ترطيب على عظام الترقوة والرقبة لتثبيت الفواحات والعطور.'
                : 'Raw African Whipped Cocoa & Shea Butter (~230 EGP) smoothed over pulse points to anchor fragrance oils.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
