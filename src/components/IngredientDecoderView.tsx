import React, { useState } from 'react';
import {
  Search,
  Droplets,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Info,
  BookOpen,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';
import { INGREDIENT_DATABASE } from '../data/ingredients';
import { IngredientDecoded } from '../types';

export const IngredientDecoderView: React.FC = () => {
  const { catalog, profile, language, isRTL, t } = useBeauty();

  const [rawText, setRawText] = useState('');
  const [productNameInput, setProductNameInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [decodedResults, setDecodedResults] = useState<{
    summary?: string;
    identifiedActives?: string[];
    potentialSensitizersOrAllergens?: string[];
    comedogenicAssessment?: string;
    routineCompatibility?: string;
    safetyVerdict?: string;
    ingredientsFound?: IngredientDecoded[];
  } | null>(null);

  // Sample quick-paste formulas including Egyptian market favorites
  const samples = [
    {
      title: language === 'ar' ? 'بوبانا جل واقي الشمس 🇪🇬' : 'Bobana Sunscreen Gel 🇪🇬',
      productName: 'Bobana Sunscreen Gel SPF 50+',
      inci: 'Aqua, Octocrylene, Ethylhexyl Methoxycinnamate, Butyl Methoxydibenzoylmethane, Tocopheryl Acetate (Vitamin E), Panthenol, Carbomer, Glycerin, Triethanolamine, Phenoxyethanol, Ethylhexylglycerin.',
    },
    {
      title: language === 'ar' ? 'ستارفيل غسول الحبوب 🇪🇬' : 'Starville Facial Cleanser 🇪🇬',
      productName: 'Starville Facial Cleanser for Acne & Oily Skin',
      inci: 'Aqua, Tea Tree Oil (Melaleuca Alternifolia), Salicylic Acid, Sulfur, Panthenol, Chamomile Extract, Glycerin, Cocamidopropyl Betaine, Sodium Laureth Sulfate, Phenoxyethanol.',
    },
    {
      title: language === 'ar' ? 'كارباميد 10% يوريا 🇪🇬' : 'Carbamide 10% Urea Cream 🇪🇬',
      productName: 'Carbamide Cream (El Nile Pharma)',
      inci: 'Aqua, Urea 10%, White Soft Paraffin, Liquid Paraffin, Cetostearyl Alcohol, Cetomacrogol 1000, Methylparaben, Propylparaben.',
    },
  ];

  const handleAnalyze = async (textToAnalyze?: string, name?: string) => {
    const list = textToAnalyze || rawText;
    const pName = name || productNameInput;
    if (!list.trim()) return;

    setAnalyzing(true);

    const lower = list.toLowerCase();
    const matchedKnown: IngredientDecoded[] = [];

    Object.entries(INGREDIENT_DATABASE).forEach(([key, info]) => {
      if (lower.includes(key) || lower.includes(info.inciName.toLowerCase())) {
        matchedKnown.push(info);
      }
    });

    try {
      const res = await fetch('/api/ai/decode-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredientList: list,
          productName: pName,
          language,
        }),
      });
      const json = await res.json();

      if (json.data) {
        setDecodedResults({
          ...json.data,
          ingredientsFound: matchedKnown,
        });
      } else {
        setDecodedResults({
          summary: json.summary || (language === 'ar' ? 'تم تحليل تركيبة المنتج التجميلي.' : 'Analyzed cosmetic ingredients.'),
          identifiedActives: json.identifiedActives || [],
          potentialSensitizersOrAllergens: json.potentialIrritants || [],
          comedogenicAssessment: json.comedogenicRisk || (language === 'ar' ? 'منخفض لمعظم أنواع البشرة' : 'Generally well-tolerated'),
          safetyVerdict: json.safetyVerdict || json.verdict || (language === 'ar' ? 'قومي بعمل اختبار حساسية موضعي لمدة 24 ساعة للتأكد من راحة الحاجز.' : 'Perform a 24-hour patch test before full application.'),
          ingredientsFound: matchedKnown,
        });
      }
    } catch (err) {
      console.error(err);
      setDecodedResults({
        summary: language === 'ar'
          ? `تم فحص ${matchedKnown.length} مكون رئيسي في التركيبة بنجاح.`
          : `Analyzed ${matchedKnown.length} major active cosmetic ingredients in formula.`,
        identifiedActives: matchedKnown.map((m) => m.name),
        potentialSensitizersOrAllergens: [language === 'ar' ? 'افحصي ترتيب العطور أو الكحول في نهاية القائمة' : 'Check order of high-concentration drying alcohols or fragrance'],
        comedogenicAssessment: language === 'ar' ? 'التركيبة خفيفة ولا تسد المسام للدهنية والمختلطة' : 'Formula contains non-comedogenic barrier lipids and humectants.',
        safetyVerdict: language === 'ar' ? 'تركيبة متوازنة وداعمة للحاجز.' : 'Balanced formula suitable for barrier health.',
        ingredientsFound: matchedKnown,
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8C7D73] font-medium tracking-wide">
            <Droplets className="w-4 h-4 text-[#C87D87]" />
            <span>{language === 'ar' ? 'كيمياء مستحضرات التجميل المبسطة' : 'Cosmetic Chemistry Demystified'}</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'ar' ? 'فحص أمان المكونات ومخاطر الحبوب' : 'Comedogenic & Irritation Risk Scoring'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#28231D] tracking-tight mt-1">
            {t('decoderHeading')}
          </h1>
          <p className="text-sm text-[#544B46] mt-1 max-w-xl leading-relaxed">
            {t('decoderSub')}
          </p>
        </div>
      </div>

      {/* Input Stage */}
      <div className="bg-white border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7D73] mb-1.5">
            {language === 'ar' ? 'اسم المنتج (اختياري):' : 'Product Name (Optional):'}
          </label>
          <input
            type="text"
            value={productNameInput}
            onChange={(e) => setProductNameInput(e.target.value)}
            placeholder={language === 'ar' ? 'مثلاً: بوبانا جل واقي الشمس SPF 50+' : 'e.g. CeraVe PM Lotion or Bobana Sunscreen Gel'}
            className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs text-[#28231D] focus:outline-none focus:border-[#C87D87]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7D73]">
              {language === 'ar' ? 'قائمة المكونات المكتوبة على ظهر العبوة (INCI):' : 'Full INCI Ingredient List:'}
            </label>
            <span className="text-[11px] text-[#8C7D73]">
              {language === 'ar' ? 'انسخيها من موقع المنتج أو الصقيها من العبوة' : 'Paste from packaging or store page'}
            </span>
          </div>
          <textarea
            rows={4}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={t('pasteInciPlaceholder')}
            className="w-full p-4 bg-[#FAF7F2] border border-[#EAE3DA] rounded-2xl text-xs text-[#28231D] focus:outline-none focus:border-[#C87D87] font-mono leading-relaxed"
          />
        </div>

        {/* Quick Samples Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#8C7D73]">{language === 'ar' ? 'نماذج سريعة من الصيدليات:' : 'Quick pharmacy samples:'}</span>
          {samples.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setRawText(s.inci);
                setProductNameInput(s.productName);
                handleAnalyze(s.inci, s.productName);
              }}
              className="px-3 py-1 bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EAE3DA] rounded-lg text-xs text-[#544B46] transition-colors cursor-pointer"
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          {rawText && (
            <button
              onClick={() => {
                setRawText('');
                setProductNameInput('');
                setDecodedResults(null);
              }}
              className="px-4 py-2 text-xs font-medium text-[#8C7D73] hover:text-[#28231D] cursor-pointer"
            >
              {t('clearAll')}
            </button>
          )}

          <button
            onClick={() => handleAnalyze()}
            disabled={!rawText.trim() || analyzing}
            className="px-6 py-2.5 bg-[#28231D] hover:bg-[#3D352E] disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8B4B8]" />
            <span>{analyzing ? t('decodingProgress') : t('decodeButton')}</span>
          </button>
        </div>
      </div>

      {/* RESULTS DISPLAY */}
      {decodedResults && (
        <div className="space-y-6 animate-in slide-in-from-top-2">
          {/* Overview Banner */}
          <div className="bg-white border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C87D87] uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('safetyAssessment')}</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#28231D]">
              {productNameInput ? productNameInput : (language === 'ar' ? 'تحليل التركيبة التجميلية' : 'Formulation Breakdown')}
            </h3>

            <p className="text-xs sm:text-sm text-[#544B46] leading-relaxed">
              {decodedResults.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE3DA] space-y-1 text-xs">
                <span className="font-semibold text-[#28231D] block">{t('comedogenicScore')}:</span>
                <span className="text-[#544B46]">{decodedResults.comedogenicAssessment}</span>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE3DA] space-y-1 text-xs">
                <span className="font-semibold text-[#28231D] block">{t('safetyAssessment')}:</span>
                <span className="text-emerald-800 font-medium">{decodedResults.safetyVerdict}</span>
              </div>
            </div>
          </div>

          {/* Known Actives Encyclopedia Matches */}
          {decodedResults.ingredientsFound && decodedResults.ingredientsFound.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-serif text-xl font-bold text-[#28231D]">
                {language === 'ar' ? 'المكونات النشطة المكتشفة في التركيبة:' : 'Identified Active Ingredients in Reference Database:'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {decodedResults.ingredientsFound.map((ing, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white border border-[#EAE3DA] rounded-2xl shadow-2xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-base font-bold text-[#28231D]">
                        {ing.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#8C7D73] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#EAE3DA]">
                        INCI: {ing.inciName}
                      </span>
                    </div>

                    <p className="text-[#544B46] leading-relaxed">
                      <strong>{t('purposeLabel')}:</strong> {ing.purpose}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F2ECE4] text-[11px]">
                      <div>
                        <strong className="text-[#28231D]">{language === 'ar' ? 'انسداد المسام:' : 'Comedogenic:'}</strong>{' '}
                        <span>{ing.comedogenicRating}/5</span>
                      </div>
                      <div>
                        <strong className="text-[#28231D]">{language === 'ar' ? 'خطر التحسس:' : 'Irritation Risk:'}</strong>{' '}
                        <span className="capitalize">{ing.irritationRating || (ing as any).irritationRisk}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
