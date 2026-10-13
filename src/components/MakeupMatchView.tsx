import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Check,
  Heart,
  Droplets,
  Layers,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';
import { SkinTone, Undertone } from '../types';

export const MakeupMatchView: React.FC = () => {
  const { profile, formatPrice, addToShoppingList, language, isRTL, t } = useBeauty();

  const [tone, setTone] = useState<SkinTone>(profile.skinTone || 'light');
  const [undertone, setUndertone] = useState<Undertone>(profile.undertone || 'neutral');
  const [finish, setFinish] = useState<'dewy' | 'satin' | 'matte'>('dewy');
  const [occasion, setOccasion] = useState<'everyday' | 'evening' | 'event'>('everyday');

  // Harmonized palette recommendations calculated from skin tone + undertone
  const recommendations = React.useMemo(() => {
    let blushShades = ['Soft Petal Rose', 'Muted Peach', 'Spiced Coral'];
    let blushShadesAr = ['وردي ناعم مخملي', 'خوخي هادئ', 'كورال دافئ'];
    let lipCombos = ['Warm Nude Liner + Berry Balm', 'Peachy Gloss + Taupe Pencil'];
    let lipCombosAr = ['محدد شفاه نود دافئ + مرطب توتي', 'قلوس خوخي ناعم + محدد توب'];
    let contourGuidance = 'Neutral taupe-grey contour to mimic real facial bone shadow without orange cast.';
    let contourGuidanceAr = 'كونتور رمادي-محايد هادئ يحاكي ظل عظام الوجه الطبيعي بدون أي لون برتقالي مصطنع.';
    let highlighter = 'Champagne pearl with fine micro-milled shimmer (avoids chunky glitter).';
    let highlighterAr = 'هايلايتر لؤلؤي بلون الشامبانيا بذرات دقيقة جداً غير مبالغ فيها.';

    if (undertone === 'cool') {
      blushShades = ['Cool Baby Pink', 'Mauve Rose', 'Plum Berry'];
      blushShadesAr = ['بيبي بينك بارد', 'موف روز ناعم', 'توتي هادئ'];
      lipCombos = ['Rosy Mauve Liner + Sheer Pink Gloss', 'Cool Berry Stain + Clear Oil'];
      lipCombosAr = ['محدد شفاه روز موف + قلوس وردي خفيف', 'تنت توتي بارد + زيت ترطيب'];
      highlighter = 'Icy champagne or soft rose-gold shimmer.';
      highlighterAr = 'شامبانيا ثلجي أو لمعة روز جولد ناعمة.';
    } else if (undertone === 'warm') {
      blushShades = ['Warm Terracotta', 'Sun-Kissed Peach', 'Golden Apricot'];
      blushShadesAr = ['تيراكوتا دافئة (سيبيل)', 'خوخي مشرق', 'مشمشي ذهبي'];
      lipCombos = ['Warm Cinnamon Liner + Honey Gloss', 'Spiced Caramel Tint'];
      lipCombosAr = ['محدد قرفة دافئ + قلوس عسلي', 'تنت كراميل دافئ'];
      highlighter = 'Rich golden champagne or warm bronze sheen.';
      highlighterAr = 'شامبانيا ذهبي غني أو إشراقة برونزية دافئة.';
    } else if (undertone === 'olive') {
      blushShades = ['Muted Fig Rose', 'Tawny Amber', 'Soft Rust'];
      blushShadesAr = ['تيني هادئ مخملي', 'عنبري دافئ', 'طوبي ناعم'];
      lipCombos = ['Neutral Chestnut Liner + Muted Nude Lip Oil', 'Rosewood Velvet'];
      lipCombosAr = ['محدد بندقي محايد + زيت شفاه نود', 'روج روز وود مخملي (أماندا)'];
      contourGuidance = 'Slightly muted cool-olive contour—avoid both orange bronzers and stark ash greys.';
      contourGuidanceAr = 'كونتور زيتوني مائل للبرودة هادئ يناسب درجات البشرة العربية بدون سمرة مفرطة.';
      highlighter = 'Pale gold or warm candlelight reflection.';
      highlighterAr = 'ذهب فاتح أو انعكاس ضوء الشموع الدافئ.';
    }

    return {
      blushShades: language === 'ar' ? blushShadesAr : blushShades,
      lipCombos: language === 'ar' ? lipCombosAr : lipCombos,
      contourGuidance: language === 'ar' ? contourGuidanceAr : contourGuidance,
      highlighter: language === 'ar' ? highlighterAr : highlighter,
    };
  }, [tone, undertone, language]);

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#8C7D73] font-medium tracking-wide">
          <Sparkles className="w-4 h-4 text-[#C87D87]" />
          <span>{language === 'ar' ? 'محرك تناسق درجات المكياج والألوان' : 'Complexion Harmony Engine'}</span>
          <span aria-hidden="true">·</span>
          <span>{language === 'ar' ? 'مطابقة الفاونديشن والآندرتون' : 'Shade & Undertone Science'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#28231D] tracking-tight mt-1">
          {t('matchHeading')}
        </h1>
        <p className="text-sm text-[#544B46] mt-1 max-w-xl leading-relaxed">
          {t('matchSub')}
        </p>
      </div>

      {/* Main Interactive Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 bg-white border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#28231D]">
            {language === 'ar' ? 'تحديد درجة بشرتكِ ونغمتها' : 'Your Complexion Profile'}
          </h3>

          {/* Skin Depth */}
          <div>
            <label className="block text-xs font-semibold text-[#28231D] uppercase tracking-wider mb-2">
              {t('skinToneQuestion')}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['fair', 'light', 'medium', 'tan', 'deep'] as SkinTone[]).map((tVal) => (
                <button
                  key={tVal}
                  type="button"
                  onClick={() => setTone(tVal)}
                  className={`p-2.5 text-center rounded-xl border text-xs capitalize transition-all cursor-pointer ${
                    tone === tVal
                      ? 'border-[#C87D87] bg-[#F7EBEB] text-[#28231D] font-bold shadow-2xs'
                      : 'border-[#EAE3DA] bg-[#FAF7F2] text-[#544B46] hover:bg-[#F2ECE4]'
                  }`}
                >
                  {tVal === 'fair' ? (language === 'ar' ? 'فاتحة جداً' : 'Fair') :
                   tVal === 'light' ? (language === 'ar' ? 'فاتحة' : 'Light') :
                   tVal === 'medium' ? (language === 'ar' ? 'حنطية/متوسطة' : 'Medium') :
                   tVal === 'tan' ? (language === 'ar' ? 'قمحية/تان' : 'Tan') :
                   (language === 'ar' ? 'عميقة' : 'Deep')}
                </button>
              ))}
            </div>
          </div>

          {/* Undertone */}
          <div>
            <label className="block text-xs font-semibold text-[#28231D] uppercase tracking-wider mb-2">
              {t('undertoneQuestion')}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'cool', en: 'Cool (Pink/Blue veins)', ar: 'بارد (عروق زرقاء / نغمة وردية)' },
                { id: 'warm', en: 'Warm (Golden/Green veins)', ar: 'دافئ (عروق خضراء / نغمة ذهبية)' },
                { id: 'neutral', en: 'Neutral (Balanced mix)', ar: 'محايد (مزيج متوازن)' },
                { id: 'olive', en: 'Olive (Subtle green tint)', ar: 'زيتوني (نغمة خضراء خفيفة)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setUndertone(item.id as Undertone)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isRTL ? 'text-right' : 'text-left'
                  } ${
                    undertone === item.id
                      ? 'border-[#C87D87] bg-[#F7EBEB] text-[#28231D] font-bold shadow-2xs'
                      : 'border-[#EAE3DA] bg-[#FAF7F2] text-[#544B46] hover:bg-[#F2ECE4]'
                  }`}
                >
                  {language === 'ar' ? item.ar : item.en}
                </button>
              ))}
            </div>
          </div>

          {/* Desired Finish */}
          <div>
            <label className="block text-xs font-semibold text-[#28231D] uppercase tracking-wider mb-2">
              {language === 'ar' ? 'اللمسة النهائية المفضلة:' : 'Preferred Finish:'}
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'dewy', en: 'Dewy Glow', ar: 'نضارة وتوهج (ديوي)' },
                { id: 'satin', en: 'Natural Satin', ar: 'طبيعي ساتان' },
                { id: 'matte', en: 'Velvet Matte', ar: 'مات مخملي' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFinish(f.id as any)}
                  className={`p-2.5 text-center rounded-xl border transition-all cursor-pointer ${
                    finish === f.id
                      ? 'border-[#28231D] bg-[#28231D] text-white font-semibold shadow-2xs'
                      : 'border-[#EAE3DA] bg-[#FAF7F2] text-[#544B46] hover:bg-[#F2ECE4]'
                  }`}
                >
                  {language === 'ar' ? f.ar : f.en}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Recommendations Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-[#C87D87] uppercase tracking-wider">
                {t('undertoneResult')}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#28231D] mt-1">
                {language === 'ar'
                  ? `بشرة ${tone === 'fair' ? 'فاتحة جداً' : tone === 'light' ? 'فاتحة' : tone === 'medium' ? 'قمحية متوسطة' : 'برونزية'} بآندرتون (${undertone === 'warm' ? 'دافئ' : undertone === 'cool' ? 'بارد' : undertone === 'olive' ? 'زيتوني' : 'محايد'})`
                  : `${tone.toUpperCase()} skin with calibrated ${undertone.toUpperCase()} undertones`}
              </h3>
              <p className="text-xs text-[#544B46] mt-2 leading-relaxed">
                {language === 'ar'
                  ? 'تم ضبط توليفة ألوان الخدود والأرواج والهايلايتر لتبرز جمال ملامحكِ الطبيعية دون أن يبدو المكياج مصطنعاً أو شاحباً.'
                  : 'Harmonized cosmetic shades designed to enhance natural features without chalkiness or unwanted orange tones.'}
              </p>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE3DA] space-y-2">
                <span className="font-bold text-[#28231D] block">
                  {language === 'ar' ? 'أفضل درجات البلاشر لكِ:' : 'Flattering Blush Shades:'}
                </span>
                <div className="space-y-1">
                  {recommendations.blushShades.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-[#544B46]">
                      <span className="w-2 h-2 rounded-full bg-[#C87D87]"></span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE3DA] space-y-2">
                <span className="font-bold text-[#28231D] block">
                  {language === 'ar' ? 'تنسيقات الشفاه المتناغمة:' : 'Flattering Lip Combinations:'}
                </span>
                <div className="space-y-1">
                  {recommendations.lipCombos.map((l, i) => (
                    <div key={i} className="flex items-center gap-2 text-[#544B46]">
                      <span className="w-2 h-2 rounded-full bg-[#E8B4B8]"></span>
                      <span>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contour & Highlighter Guidance */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE3DA] space-y-3 text-xs">
              <div>
                <strong className="text-[#28231D] block mb-0.5">
                  {language === 'ar' ? 'إرشادات الكونتور ونحت الوجه:' : 'Contour Shadow Guidance:'}
                </strong>
                <p className="text-[#544B46] leading-relaxed">{recommendations.contourGuidance}</p>
              </div>
              <div className="pt-2 border-t border-[#F2ECE4]">
                <strong className="text-[#28231D] block mb-0.5">
                  {language === 'ar' ? 'انعكاس الهايلايتر المثالي:' : 'Highlighter Finish:'}
                </strong>
                <p className="text-[#544B46] leading-relaxed">{recommendations.highlighter}</p>
              </div>
            </div>

            {/* Egyptian Local Hero Product Matches */}
            <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-2 text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <span>🇪🇬</span>
                <span>{language === 'ar' ? 'ترشيحات المنتجات المصرية المطابقة:' : 'Recommended Egyptian Market Matches:'}</span>
              </span>
              <ul className="text-amber-800 space-y-1 list-disc list-inside">
                <li>
                  {language === 'ar'
                    ? 'أماندا ميلانو فاونديشن مات مخملي (درجة 02 أو 03 للبشرة الحنطية) — 240 ج.م'
                    : 'Amanda Milano Velvet Matte Foundation (Shades 02/03 for medium tones) — 240 EGP'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'أماندا ميلانو بلاشر سائل ناعم (درجة Rosewood أو Peach) — 180 ج.م'
                    : 'Amanda Milano Liquid Blush (Rosewood or Soft Peach) — 180 EGP'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'سيبيل بودرة تيراكوتا المخبوزة للمسة برونزية دافئة — 190 ج.م'
                    : 'Cybele Terracotta Baked Bronzer for warm Mediterranean glow — 190 EGP'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
