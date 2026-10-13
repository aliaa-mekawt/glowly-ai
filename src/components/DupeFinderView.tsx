import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';
import { POPULAR_DUPES } from '../data/dupes';

export const DupeFinderView: React.FC = () => {
  const { addToShoppingList, addToShelf, formatPrice, language, isRTL, t } = useBeauty();

  const [activeDupeId, setActiveDupeId] = useState<string>(POPULAR_DUPES[0].id);

  const selectedDupe = POPULAR_DUPES.find((d) => d.id === activeDupeId) || POPULAR_DUPES[0];

  const dupeTitle =
    language === 'ar' && selectedDupe.budgetDupe.nameAr
      ? selectedDupe.budgetDupe.nameAr
      : selectedDupe.budgetDupe.name;

  const formulaComp =
    language === 'ar' && selectedDupe.formulaComparisonAr
      ? selectedDupe.formulaComparisonAr
      : selectedDupe.formulaComparison;

  const ingSimilarity =
    language === 'ar' && selectedDupe.ingredientSimilarityAr
      ? selectedDupe.ingredientSimilarityAr
      : selectedDupe.ingredientSimilarity;

  const bestChoice =
    language === 'ar' && selectedDupe.bestChoiceForAr
      ? selectedDupe.bestChoiceForAr
      : selectedDupe.bestChoiceFor;

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#8C7D73] font-medium tracking-wide">
          <ShieldCheck className="w-4 h-4 text-[#C87D87]" />
          <span>{language === 'ar' ? 'بدائل ذكية موثقة بالسوق المصري' : 'Smart Beauty Economics'}</span>
          <span aria-hidden="true">·</span>
          <span>{POPULAR_DUPES.length} {language === 'ar' ? 'بدائل تطابق الماركات العالمية' : 'Verified Cosmetic Twins'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#28231D] tracking-tight mt-1">
          {t('dupeHeading')}
        </h1>
        <p className="text-sm text-[#544B46] mt-1 max-w-xl leading-relaxed">
          {t('dupeSub')}
        </p>
      </div>

      {/* Dupe Selection Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {POPULAR_DUPES.map((item) => {
          const name = language === 'ar' && item.budgetDupe.nameAr ? item.budgetDupe.nameAr : item.budgetDupe.name;
          return (
            <button
              key={item.id}
              onClick={() => setActiveDupeId(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isRTL ? 'text-right' : 'text-left'
              } ${
                activeDupeId === item.id
                  ? 'border-[#C87D87] bg-white shadow-sm ring-1 ring-[#C87D87]'
                  : 'border-[#EAE3DA] bg-white hover:border-[#D9C5B2]'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  {t('savingsPill', { percent: item.savingsPercentage })}
                </span>
                <div className="font-serif font-bold text-xs text-[#28231D] line-clamp-1 mt-1">
                  {name}
                </div>
                <div className="text-[11px] text-[#8C7D73]">
                  {language === 'ar' ? `بديل لـ ${item.prestigeProduct.brand}` : `Swap for ${item.prestigeProduct.brand}`}
                </div>
              </div>
              <div className="text-xs font-mono font-bold text-[#C87D87] pt-2 mt-2 border-t border-[#F2ECE4]">
                {item.savingsEGP
                  ? `${language === 'ar' ? 'توفير ' : 'Saves '}${item.savingsEGP} ج.م`
                  : `Saves ${formatPrice(item.savings)}`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Side-by-Side Comparison Stage */}
      <div className="bg-white border border-[#EAE3DA] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F2ECE4]">
          <div>
            <span className="text-xs text-[#C87D87] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'مقارنة التركيبة جنباً إلى جنب' : 'Head-to-Head Formula Match'}</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#28231D] mt-1">
              {selectedDupe.prestigeProduct.name} <span className="text-[#C87D87]">vs.</span> {dupeTitle}
            </h2>
          </div>

          <div className="bg-[#FAF7F2] px-5 py-3 rounded-2xl border border-[#EAE3DA]">
            <span className="text-[10px] text-[#8C7D73] block uppercase tracking-wider font-semibold">
              {language === 'ar' ? 'إجمالي التوفير في العبوة' : 'Net Routine Savings'}
            </span>
            <span className="font-mono text-2xl font-bold text-emerald-700">
              {selectedDupe.savingsEGP ? `${selectedDupe.savingsEGP} EGP` : formatPrice(selectedDupe.savings)}
            </span>
            <span className="text-[11px] text-[#8C7D73] block">
              ({selectedDupe.savingsPercentage}% {language === 'ar' ? 'أوفر' : 'Cheaper'})
            </span>
          </div>
        </div>

        {/* 2 Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Prestige Product Card */}
          <div className="border border-[#EAE3DA] rounded-2xl p-6 bg-[#FAF7F2] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8C7D73]">
                <span className="uppercase font-semibold tracking-wider">{t('prestigeItem')}</span>
                <span className="font-mono text-base font-bold text-[#28231D]">
                  {selectedDupe.prestigeProduct.priceEGP ? `${selectedDupe.prestigeProduct.priceEGP} EGP` : formatPrice(selectedDupe.prestigeProduct.price)}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-[#28231D]">
                  {selectedDupe.prestigeProduct.name}
                </h3>
                <span className="text-xs text-[#8C7D73]">
                  {selectedDupe.prestigeProduct.brand} · {selectedDupe.prestigeProduct.size}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <strong className="text-[#28231D]">{language === 'ar' ? 'القوام والملمس:' : 'Texture & Slip:'}</strong>{' '}
                  <span className="text-[#544B46]">{selectedDupe.prestigeProduct.texture}</span>
                </div>
                <div>
                  <strong className="text-[#28231D]">{language === 'ar' ? 'اللمسة النهائية:' : 'Finish:'}</strong>{' '}
                  <span className="text-[#544B46]">{selectedDupe.prestigeProduct.finish}</span>
                </div>
                <div>
                  <strong className="text-[#28231D]">{t('keyActives')}:</strong>{' '}
                  <span className="text-[#544B46]">{selectedDupe.prestigeProduct.keyIngredients.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Hero Dupe Card */}
          <div className="border-2 border-[#C87D87]/50 rounded-2xl p-6 bg-white space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8C7D73]">
                <span className="uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('affordableDupe')}</span>
                </span>
                <span className="font-mono text-base font-bold text-emerald-700">
                  {selectedDupe.budgetDupe.priceEGP ? `${selectedDupe.budgetDupe.priceEGP} EGP` : formatPrice(selectedDupe.budgetDupe.price)}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-[#28231D]">
                  {dupeTitle}
                </h3>
                <span className="text-xs text-[#8C7D73]">
                  {language === 'ar' && selectedDupe.budgetDupe.brandAr ? selectedDupe.budgetDupe.brandAr : selectedDupe.budgetDupe.brand} · {selectedDupe.budgetDupe.size}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <strong className="text-[#28231D]">{language === 'ar' ? 'القوام والملمس:' : 'Texture & Slip:'}</strong>{' '}
                  <span className="text-[#544B46]">{selectedDupe.budgetDupe.texture}</span>
                </div>
                <div>
                  <strong className="text-[#28231D]">{language === 'ar' ? 'اللمسة النهائية:' : 'Finish:'}</strong>{' '}
                  <span className="text-[#544B46]">{selectedDupe.budgetDupe.finish}</span>
                </div>
                <div>
                  <strong className="text-[#28231D]">{t('keyActives')}:</strong>{' '}
                  <span className="text-[#544B46]">{selectedDupe.budgetDupe.keyIngredients.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F2ECE4] flex items-center gap-3">
              <button
                onClick={() =>
                  addToShoppingList({
                    name: selectedDupe.budgetDupe.name,
                    brand: selectedDupe.budgetDupe.brand,
                    price: selectedDupe.budgetDupe.priceEGP || selectedDupe.budgetDupe.price * 50,
                    currency: 'EGP',
                    category: 'foundation_concealer',
                    isEssential: false,
                    purchased: false,
                  })
                }
                className="flex-1 py-2 text-xs font-semibold bg-[#28231D] hover:bg-[#3D352E] text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t('addToList')}</span>
              </button>

              <button
                onClick={() =>
                  addToShelf({
                    name: selectedDupe.budgetDupe.name,
                    brand: selectedDupe.budgetDupe.brand,
                    category: 'foundation_concealer',
                    status: 'in_routine',
                    openedDate: new Date().toISOString().split('T')[0],
                    expirationMonths: 12,
                  })
                }
                className="px-4 py-2 text-xs font-semibold bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EAE3DA] text-[#28231D] rounded-xl transition-colors cursor-pointer"
              >
                {t('addToShelf')}
              </button>
            </div>
          </div>
        </div>

        {/* Clinical Deep Dive Analysis */}
        <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#EAE3DA] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#C87D87] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{t('whyItWorks')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#544B46] leading-relaxed">
            <div>
              <strong className="text-[#28231D] block mb-1">
                {language === 'ar' ? 'مقارنة الأداء والتركيبة:' : 'Formula Breakdown:'}
              </strong>
              <p>{formulaComp}</p>
            </div>

            <div>
              <strong className="text-[#28231D] block mb-1">
                {language === 'ar' ? 'نسبة تطابق المكونات:' : 'Ingredient Overlap:'}
              </strong>
              <p>{ingSimilarity}</p>
              <div className="mt-3 p-3 bg-white rounded-xl border border-[#EAE3DA]">
                <strong className="text-[#28231D] block mb-0.5">
                  {language === 'ar' ? 'أفضل اختيار لـ:' : 'Best Choice For:'}
                </strong>
                <p>{bestChoice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
