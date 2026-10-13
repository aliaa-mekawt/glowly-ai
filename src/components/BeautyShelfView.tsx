import React, { useState } from 'react';
import {
  Bookmark,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Star,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';
import { ShelfItem, ProductCategory } from '../types';

export const BeautyShelfView: React.FC = () => {
  const {
    shelf,
    addToShelf,
    updateShelfItem,
    removeFromShelf,
    language,
    isRTL,
    t,
  } = useBeauty();

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Manual Product form
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<ProductCategory>('cleanser');
  const [openedDate, setOpenedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expirationMonths, setExpirationMonths] = useState(12);
  const [status, setStatus] = useState<'active' | 'in_routine' | 'backup' | 'finished'>('in_routine');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(5);

  // Filtered shelf
  const filteredShelf = shelf.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  // Duplicate & Clash Analysis
  const duplicateAlerts = React.useMemo(() => {
    const alerts: string[] = [];
    const activeItems = shelf.filter((s) => s.status === 'in_routine' || s.status === 'active');

    const categoryCounts: Record<string, number> = {};
    activeItems.forEach((item) => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    if (categoryCounts['toner'] && categoryCounts['toner'] > 1) {
      alerts.push(
        language === 'ar'
          ? 'لديكِ أكثر من تونر أو مقشر كيميائي نشط في خزانكِ. وزعيها على ليالٍ منفصلة لتفادي حرق وتحسس حاجز البشرة.'
          : 'You have multiple active toners / chemical exfoliants. Alternate nights or mornings to avoid over-exfoliation and stinging.'
      );
    }
    if (categoryCounts['cleanser'] && categoryCounts['cleanser'] > 2) {
      alerts.push(
        language === 'ar'
          ? 'لديكِ 3 غسولات أو أكثر نشطة. خصصي واحداً صباحياً لطيفاً والآخر للمساء لتجنب إجهاد الحاجز الدهني.'
          : 'You have 3+ cleansers active. Consider designating one for morning splash and one for evening double cleansing.'
      );
    }

    return alerts;
  }, [shelf, language]);

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim()) return;

    addToShelf({
      name: name.trim(),
      brand: brand.trim(),
      category,
      openedDate,
      expirationMonths,
      status,
      notes: notes.trim() || undefined,
      rating,
    });

    setName('');
    setBrand('');
    setNotes('');
    setIsManualModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8C7D73] font-medium tracking-wide">
            <Bookmark className="w-4 h-4 text-[#C87D87]" />
            <span>{language === 'ar' ? 'خزانتكِ التجميلية المنزلية' : 'Personal Digital Vanity'}</span>
            <span aria-hidden="true">·</span>
            <span>{shelf.length} {language === 'ar' ? 'منتج مسجل' : 'Items Logged'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#28231D] tracking-tight mt-1">
            {t('shelfHeading')}
          </h1>
          <p className="text-sm text-[#544B46] mt-1 max-w-xl leading-relaxed">
            {t('shelfSub')}
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#28231D] hover:bg-[#3D352E] transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#E8B4B8]" />
          <span>{t('addNewShelfItem')}</span>
        </button>
      </div>

      {/* Duplicate / Active Clash Warnings */}
      {duplicateAlerts.length > 0 && (
        <div className="bg-[#FFF9F5] border border-[#F0E6DD] rounded-2xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C87D87]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{language === 'ar' ? 'تنبيه توافق المنتجات وتفادي التكرار' : 'Vanity Harmony Alert'}</span>
          </div>
          <ul className="text-xs text-[#544B46] space-y-1 list-disc list-inside">
            {duplicateAlerts.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Shelf Filter Status Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: language === 'ar' ? `كل المنتجات (${shelf.length})` : `All Owned (${shelf.length})` },
          { id: 'in_routine', label: language === 'ar' ? 'مستخدم في الروتين اليومي' : 'In Daily Routine' },
          { id: 'active', label: language === 'ar' ? 'قيد الاستخدام النشط' : 'In Active Rotation' },
          { id: 'backup', label: language === 'ar' ? 'مخزون إضافي وتنقّل' : 'Backups & Travel' },
          { id: 'finished', label: language === 'ar' ? 'عبوات فارغة' : 'Empties & Finished' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === tab.id
                ? 'bg-[#28231D] text-white shadow-sm'
                : 'bg-white border border-[#EAE3DA] text-[#544B46] hover:bg-[#FAF7F2]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Shelf Grid */}
      {filteredShelf.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE3DA] p-8 space-y-3">
          <Bookmark className="w-8 h-8 text-[#8C7D73] mx-auto opacity-50" />
          <h3 className="font-serif text-xl font-bold text-[#28231D]">
            {t('emptyShelfTitle')}
          </h3>
          <p className="text-xs text-[#8C7D73] max-w-md mx-auto leading-relaxed">
            {t('emptyShelfSub')}
          </p>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="mt-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#28231D] hover:bg-[#3D352E] rounded-xl cursor-pointer"
          >
            {t('addNewShelfItem')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShelf.map((item) => {
            const opened = item.openedDate ? new Date(item.openedDate) : null;
            const paoMonths = item.expirationMonths || 12;
            let daysRemaining: number | null = null;
            if (opened) {
              const expireDate = new Date(opened.getTime() + paoMonths * 30 * 24 * 60 * 60 * 1000);
              const diffMs = expireDate.getTime() - Date.now();
              daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            }

            return (
              <div
                key={item.id}
                className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#8C7D73] uppercase tracking-wider">
                      {item.brand}
                    </span>
                    <button
                      onClick={() => removeFromShelf(item.id)}
                      className="text-[#8C7D73] hover:text-rose-600 transition-colors p-1 cursor-pointer"
                      title={t('remove')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#28231D] leading-snug">
                    {item.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-[#544B46] pt-1">
                    <div className="flex items-center gap-1.5 text-[#8C7D73]">
                      <Calendar className="w-3.5 h-3.5 text-[#C87D87]" />
                      <span>
                        {t('openedOn')}: {item.openedDate || 'Recently'} ({paoMonths}M PAO)
                      </span>
                    </div>

                    {daysRemaining !== null && (
                      <div className="text-[11px]">
                        {daysRemaining < 30 ? (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {language === 'ar' ? `ينتهي خلال ${daysRemaining} يوم` : `Expires in ${daysRemaining} days`}
                          </span>
                        ) : (
                          <span className="text-emerald-700">
                            {language === 'ar' ? `متبقي ${Math.round(daysRemaining / 30)} شهر صلاحية` : `~${Math.round(daysRemaining / 30)} months remaining`}
                          </span>
                        )}
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-xs text-[#544B46] italic bg-[#FAF7F2] p-2 rounded-lg border border-[#F2ECE4]">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Switcher Footer */}
                <div className="pt-4 border-t border-[#F2ECE4] mt-4 flex items-center justify-between text-xs">
                  <select
                    value={item.status}
                    onChange={(e) => updateShelfItem(item.id, { status: e.target.value as any })}
                    className="p-1.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-lg text-xs text-[#28231D] focus:outline-none cursor-pointer"
                  >
                    <option value="in_routine">{language === 'ar' ? 'بالروتين اليومي' : 'In Routine'}</option>
                    <option value="active">{language === 'ar' ? 'نشط بالتناوب' : 'Active'}</option>
                    <option value="backup">{language === 'ar' ? 'احتياطي' : 'Backup'}</option>
                    <option value="finished">{language === 'ar' ? 'انتهى' : 'Finished'}</option>
                  </select>

                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => updateShelfItem(item.id, { rating: star })}
                        className={`w-3.5 h-3.5 cursor-pointer ${
                          (item.rating || 5) >= star ? 'fill-current' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MANUAL ADD PRODUCT MODAL */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-[#EAE3DA] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE4]">
              <h3 className="font-serif text-xl font-bold text-[#28231D]">
                {t('addNewShelfItem')}
              </h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-[#8C7D73] hover:text-[#28231D] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManual} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#544B46] font-medium mb-1">
                  {language === 'ar' ? 'اسم المنتج' : 'Product Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bobana Sunscreen Gel or CeraVe Cleanser"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#544B46] font-medium mb-1">
                    {language === 'ar' ? 'الماركة' : 'Brand'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Bobana, Eva, Starville"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#544B46] font-medium mb-1">
                    {t('categoryLabel')}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs"
                  >
                    <option value="cleanser">{t('catCleanser')}</option>
                    <option value="moisturizer">{t('catMoisturizer')}</option>
                    <option value="sunscreen">{t('catSunscreen')}</option>
                    <option value="serum">{t('catSerum')}</option>
                    <option value="toner">{t('catToner')}</option>
                    <option value="acne_care">{t('catAcneCare')}</option>
                    <option value="makeup_remover">{t('catMakeupRemover')}</option>
                    <option value="lip_care">{t('catLipCare')}</option>
                    <option value="body_lotion">{t('catBodyLotion')}</option>
                    <option value="foundation_concealer">{t('catFoundationConcealer')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#544B46] font-medium mb-1">
                    {t('openedOn')}
                  </label>
                  <input
                    type="date"
                    value={openedDate}
                    onChange={(e) => setOpenedDate(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#544B46] font-medium mb-1">
                    {language === 'ar' ? 'صلاحية بعد الفتح (شهور PAO)' : 'PAO Expiration (Months)'}
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={36}
                    value={expirationMonths}
                    onChange={(e) => setExpirationMonths(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#544B46] font-medium mb-1">
                  {language === 'ar' ? 'ملاحظاتكِ الشخصية (اختياري)' : 'Personal Notes (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'ar' ? 'مثلاً: ممتاز للبشرة في الصيف، لا يسد المسام...' : 'e.g. Love using it on damp skin, lightweight and non-greasy'}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs"
                />
              </div>

              <div className="pt-4 border-t border-[#F2ECE4] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
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
