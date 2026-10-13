import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';
import { RoutineStep, ProductCategory } from '../types';

export const RoutineManagerView: React.FC = () => {
  const {
    morningRoutine,
    eveningRoutine,
    bodyRoutine,
    toggleRoutineStep,
    addRoutineStep,
    removeRoutineStep,
    catalog,
    shelf,
    profile,
    formatPrice,
    language,
    isRTL,
    t,
  } = useBeauty();

  const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'body'>('morning');
  const [isAddStepOpen, setIsAddStepOpen] = useState(false);

  // New Step form state
  const [newStepName, setNewStepName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('cleanser');
  const [newPurpose, setNewPurpose] = useState('');
  const [newHowTo, setNewHowTo] = useState('');
  const [newProductTitle, setNewProductTitle] = useState('');
  const [newFrequency, setNewFrequency] = useState('Daily');
  const [newOptional, setNewOptional] = useState(false);

  const currentRoutine =
    activeTab === 'morning'
      ? morningRoutine
      : activeTab === 'evening'
      ? eveningRoutine
      : bodyRoutine;

  const handleCreateStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepName.trim()) return;

    addRoutineStep(activeTab, {
      period: activeTab,
      stepNumber: currentRoutine.length + 1,
      stepName: newStepName.trim(),
      category: newCategory,
      purpose: newPurpose.trim() || 'Daily care step',
      customProductTitle: newProductTitle.trim() || undefined,
      howToApply: newHowTo.trim() || 'Apply as directed on packaging.',
      frequency: newFrequency,
      isOptional: newOptional,
      completedToday: false,
    });

    setNewStepName('');
    setNewPurpose('');
    setNewHowTo('');
    setNewProductTitle('');
    setIsAddStepOpen(false);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8C7D73] font-medium tracking-wide">
            <ShieldCheck className="w-4 h-4 text-[#C87D87]" />
            <span>{language === 'ar' ? 'روتينات علمية مدروسة لحاجز البشرة' : 'Evidence-Based Regimens'}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.skinType.toUpperCase()}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#28231D] tracking-tight mt-1">
            {t('routinesHeading')}
          </h1>
          <p className="text-sm text-[#544B46] mt-1 max-w-xl leading-relaxed">
            {t('routinesSub')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddStepOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#28231D] bg-white border border-[#EAE3DA] hover:bg-[#FAF7F2] rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#C87D87]" />
            <span>{t('addCustomStep')}</span>
          </button>
        </div>
      </div>

      {/* Routine Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#F2ECE4] rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('morning')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'morning'
              ? 'bg-white text-[#28231D] shadow-sm'
              : 'text-[#8C7D73] hover:text-[#28231D]'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-[#C87D87]" />
          <span>{t('morningRegimen')} ({morningRoutine.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('evening')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'evening'
              ? 'bg-white text-[#28231D] shadow-sm'
              : 'text-[#8C7D73] hover:text-[#28231D]'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-[#6A5D7B]" />
          <span>{t('eveningRepair')} ({eveningRoutine.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('body')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'body'
              ? 'bg-white text-[#28231D] shadow-sm'
              : 'text-[#8C7D73] hover:text-[#28231D]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#8C7D73]" />
          <span>{t('bodyCareTab')} ({bodyRoutine.length})</span>
        </button>
      </div>

      {/* Active Ingredient Harmony Rule Advisory Banner */}
      {activeTab === 'evening' && (
        <div className="bg-[#FFF9F5] border border-[#F0E6DD] rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#C87D87] shrink-0 mt-0.5" />
          <div className="text-xs text-[#544B46] space-y-1">
            <span className="font-semibold text-[#28231D] block">
              {t('activeHarmonyRule')}
            </span>
            <p className="leading-relaxed">
              {t('harmonyRuleDetail')}
            </p>
          </div>
        </div>
      )}

      {/* Routine Steps List */}
      <div className="space-y-4">
        {currentRoutine.map((step, idx) => {
          const matchedProduct = catalog.find((p) => p.id === step.productId);
          const isOwned = shelf.some((s) => s.productId === step.productId || s.name === step.customProductTitle);
          const title = language === 'ar' && step.stepNameAr ? step.stepNameAr : step.stepName;
          const purpose = language === 'ar' && step.purposeAr ? step.purposeAr : step.purpose;
          const howTo = language === 'ar' && step.howToApplyAr ? step.howToApplyAr : step.howToApply;
          const amount = language === 'ar' && step.amountOrQuantityAr ? step.amountOrQuantityAr : step.amountOrQuantity;
          const precautions = language === 'ar' && step.precautionsAr ? step.precautionsAr : step.precautions;
          const lowerBudgetAlt = language === 'ar' && step.lowerCostAlternativeAr ? step.lowerCostAlternativeAr : step.lowerCostAlternative;

          return (
            <div
              key={step.id}
              className={`bg-white border rounded-2xl p-6 transition-all shadow-sm ${
                step.completedToday ? 'border-emerald-200 bg-emerald-50/20' : 'border-[#EAE3DA]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#EAE3DA] flex items-center justify-center text-xs font-mono font-semibold text-[#28231D]">
                      {idx + 1}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#28231D]">
                      {title}
                    </h3>
                    {step.isOptional && (
                      <span className="text-[11px] text-[#8C7D73] italic">
                        ({t('optionalBooster')})
                      </span>
                    )}
                    {isOwned && (
                      <span className="text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                        {t('inYourVanity')}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#544B46] leading-relaxed">
                    <strong className="text-[#28231D]">{t('purposeLabel')}:</strong> {purpose}
                  </p>

                  <div className="text-xs text-[#8C7D73] bg-[#FAF7F2] p-3 rounded-xl border border-[#F2ECE4] space-y-1.5">
                    <div>
                      <strong className="text-[#28231D]">{t('howToApplyLabel')}:</strong> {howTo}
                    </div>
                    {amount && (
                      <div>
                        <strong className="text-[#28231D]">{t('quantityLabel')}:</strong> {amount}
                      </div>
                    )}
                    {precautions && (
                      <div className="text-[#C87D87]">
                        <strong>{t('precautionLabel')}:</strong> {precautions}
                      </div>
                    )}
                    {lowerBudgetAlt && (
                      <div className="text-emerald-800 pt-0.5">
                        <strong>{t('budgetAlternativeLabel')}:</strong> {lowerBudgetAlt}
                      </div>
                    )}
                  </div>

                  {/* Product suggestion info */}
                  {(step.customProductTitle || matchedProduct) && (
                    <div className="text-xs text-[#544B46] pt-1 flex items-center gap-2">
                      <span className="text-[#8C7D73]">{t('recommendedItemLabel')}:</span>
                      <span className="font-medium text-[#28231D]">
                        {step.customProductTitle || `${matchedProduct?.brand} ${matchedProduct?.name}`}
                      </span>
                      {matchedProduct && (
                        <span className="text-xs font-mono text-[#8C7D73]">
                          ({formatPrice(matchedProduct.priceEGP || matchedProduct.price * 50, 'EGP')})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right action buttons */}
                <div className="flex items-center sm:flex-col items-end gap-3 shrink-0">
                  <button
                    onClick={() => toggleRoutineStep(step.id, activeTab)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      step.completedToday
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#28231D] border border-[#EAE3DA]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{step.completedToday ? t('completed') : t('markDone')}</span>
                  </button>

                  <button
                    onClick={() => removeRoutineStep(step.id, activeTab)}
                    className="p-1.5 text-[#8C7D73] hover:text-rose-600 transition-colors cursor-pointer"
                    title={t('remove')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD CUSTOM STEP MODAL */}
      {isAddStepOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-[#EAE3DA] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE4]">
              <h3 className="font-serif text-xl font-bold text-[#28231D]">
                {t('addCustomStep')} ({activeTab.toUpperCase()})
              </h3>
              <button
                onClick={() => setIsAddStepOpen(false)}
                className="text-[#8C7D73] hover:text-[#28231D] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStep} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#544B46] font-medium mb-1">
                  {t('stepTitle')} *
                </label>
                <input
                  type="text"
                  required
                  value={newStepName}
                  onChange={(e) => setNewStepName(e.target.value)}
                  placeholder="e.g. Starville Cleanser or Hyaluronic Mist"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[#544B46] font-medium mb-1">
                  {t('categoryLabel')}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs"
                >
                  <option value="cleanser">{t('catCleanser')}</option>
                  <option value="moisturizer">{t('catMoisturizer')}</option>
                  <option value="sunscreen">{t('catSunscreen')}</option>
                  <option value="serum">{t('catSerum')}</option>
                  <option value="toner">{t('catToner')}</option>
                  <option value="acne_care">{t('catAcneCare')}</option>
                  <option value="makeup_remover">{t('catMakeupRemover')}</option>
                  <option value="body_lotion">{t('catBodyLotion')}</option>
                </select>
              </div>

              <div>
                <label className="block text-[#544B46] font-medium mb-1">
                  {t('purposeLabel')}
                </label>
                <input
                  type="text"
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  placeholder="e.g. Cleanse without stripping moisture"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[#544B46] font-medium mb-1">
                  {t('howToApplyLabel')}
                </label>
                <textarea
                  rows={2}
                  value={newHowTo}
                  onChange={(e) => setNewHowTo(e.target.value)}
                  placeholder="e.g. Massage onto damp skin for 60 seconds, then rinse with lukewarm water."
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="optionalStep"
                  checked={newOptional}
                  onChange={(e) => setNewOptional(e.target.checked)}
                  className="accent-[#C87D87]"
                />
                <label htmlFor="optionalStep" className="text-[#544B46]">
                  {t('optionalBooster')}
                </label>
              </div>

              <div className="pt-4 border-t border-[#F2ECE4] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddStepOpen(false)}
                  className="px-4 py-2 text-[#8C7D73] hover:text-[#28231D] cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#28231D] hover:bg-[#3D352E] text-white font-semibold rounded-xl cursor-pointer"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
