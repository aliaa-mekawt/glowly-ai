import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';
import { JournalEntry } from '../types';

export const JournalView: React.FC = () => {
  const { journalEntries, addJournalEntry, language, isRTL, t } = useBeauty();

  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [newProduct, setNewProduct] = useState('');
  const [patchStatus, setPatchStatus] = useState<'not_needed' | 'patch_testing' | 'well_tolerated' | 'irritation_observed'>('not_needed');
  const [skinFeel, setSkinFeel] = useState<'calm_balanced' | 'dry_tight' | 'oily_congested' | 'sensitive_reactive'>('calm_balanced');
  const [notes, setNotes] = useState('');

  const [amDone, setAmDone] = useState(true);
  const [pmDone, setPmDone] = useState(true);
  const [bodyDone, setBodyDone] = useState(false);

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    addJournalEntry({
      date: dateInput,
      routineCompleted: { morning: amDone, evening: pmDone, body: bodyDone },
      newProductIntroduced: newProduct.trim() || undefined,
      patchTestStatus: patchStatus,
      skinFeel,
      notes: notes.trim(),
    });

    setNotes('');
    setNewProduct('');
    setIsAddEntryOpen(false);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8C7D73] font-medium tracking-wide">
            <Calendar className="w-4 h-4 text-[#C87D87]" />
            <span>{language === 'ar' ? 'سجل تطور البشرة الخاص' : 'Private Skin Diary'}</span>
            <span aria-hidden="true">·</span>
            <span>{journalEntries.length} {language === 'ar' ? 'يوميات مسجلة' : 'Entries'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#28231D] tracking-tight mt-1">
            {t('journalHeading')}
          </h1>
          <p className="text-sm text-[#544B46] mt-1 max-w-xl leading-relaxed">
            {t('journalSub')}
          </p>
        </div>

        <button
          onClick={() => setIsAddEntryOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#28231D] hover:bg-[#3D352E] transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#E8B4B8]" />
          <span>{t('addJournalEntry')}</span>
        </button>
      </div>

      {/* Consistency Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3DA] shadow-sm">
          <span className="text-[11px] text-[#8C7D73] block mb-1">
            {language === 'ar' ? 'إجمالي الأيام المسجلة' : 'Total Entries'}
          </span>
          <span className="font-mono text-2xl font-bold text-[#28231D]">
            {journalEntries.length} {language === 'ar' ? 'يوم' : 'Days'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3DA] shadow-sm">
          <span className="text-[11px] text-[#8C7D73] block mb-1">
            {language === 'ar' ? 'الالتزام الصباحي' : 'Morning Consistency'}
          </span>
          <span className="font-mono text-2xl font-bold text-emerald-700">
            {journalEntries.filter((e) => e.routineCompleted.morning).length} {language === 'ar' ? 'يوم' : 'Days'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3DA] shadow-sm">
          <span className="text-[11px] text-[#8C7D73] block mb-1">
            {language === 'ar' ? 'الالتزام المسائي' : 'Evening Consistency'}
          </span>
          <span className="font-mono text-2xl font-bold text-[#6A5D7B]">
            {journalEntries.filter((e) => e.routineCompleted.evening).length} {language === 'ar' ? 'يوم' : 'Days'}
          </span>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {journalEntries.length === 0 ? (
          <div className="bg-white border border-[#EAE3DA] rounded-3xl p-12 text-center space-y-2">
            <Calendar className="w-8 h-8 text-[#8C7D73] mx-auto opacity-50" />
            <p className="text-xs text-[#8C7D73]">
              {language === 'ar'
                ? 'لا توجد ملاحظات مسجلة بعد. اضغطي على زر تسجيل ملاحظة جديدة لتوثيق استجابة بشرتكِ.'
                : 'No journal entries logged yet. Track your skin notes and routine completion.'}
            </p>
          </div>
        ) : (
          journalEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#F2ECE4]">
                <div className="flex items-center gap-2 font-mono font-bold text-[#28231D]">
                  <Calendar className="w-3.5 h-3.5 text-[#C87D87]" />
                  <span>{entry.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  {entry.routineCompleted.morning && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <Sun className="w-3 h-3 text-amber-500" />
                      <span>{t('morningRegimen')}</span>
                    </span>
                  )}
                  {entry.routineCompleted.evening && (
                    <span className="flex items-center gap-1 text-[11px] text-indigo-700 font-medium">
                      <Moon className="w-3 h-3 text-indigo-500" />
                      <span>{t('eveningRepair')}</span>
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#544B46] leading-relaxed">
                "{entry.notes}"
              </p>

              {entry.newProductIntroduced && (
                <div className="text-[11px] text-[#28231D] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#EAE3DA]">
                  <strong>{language === 'ar' ? 'منتج جديد تمت تجربته:' : 'New Product Tested:'}</strong> {entry.newProductIntroduced}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* NEW ENTRY MODAL */}
      {isAddEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-[#EAE3DA] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE4]">
              <h3 className="font-serif text-xl font-bold text-[#28231D]">
                {t('addJournalEntry')}
              </h3>
              <button
                onClick={() => setIsAddEntryOpen(false)}
                className="text-[#8C7D73] hover:text-[#28231D] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#544B46] font-medium mb-1">
                  {language === 'ar' ? 'التاريخ' : 'Date'}
                </label>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[#544B46] font-medium mb-1">
                  {language === 'ar' ? 'الروتين المنجز اليوم:' : 'Routines Completed Today:'}
                </label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={amDone}
                      onChange={(e) => setAmDone(e.target.checked)}
                      className="accent-[#C87D87]"
                    />
                    <span>{t('morningRegimen')}</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pmDone}
                      onChange={(e) => setPmDone(e.target.checked)}
                      className="accent-[#C87D87]"
                    />
                    <span>{t('eveningRepair')}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[#544B46] font-medium mb-1">
                  {language === 'ar' ? 'منتج جديد تمت تجربته (اختياري):' : 'New Product Introduced (Optional):'}
                </label>
                <input
                  type="text"
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  placeholder="e.g. Starville Cleanser"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[#544B46] font-medium mb-1">
                  {language === 'ar' ? 'ملاحظاتكِ عن ملمس بشرتكِ اليوم:' : 'Notes on Skin Today:'} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'ar' ? 'مثلاً: البشرة هادية ومفيش احمرار، واقي شمس بوبانا مش مبيّض...' : 'e.g. Skin felt hydrated and calm, no redness after testing the sunscreen.'}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs"
                />
              </div>

              <div className="pt-4 border-t border-[#F2ECE4] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddEntryOpen(false)}
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
