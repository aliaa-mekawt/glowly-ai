import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Bookmark,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  AlertCircle,
  HelpCircle,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';
import { ACADEMY_LESSONS } from '../data/academy';
import { AcademyLesson } from '../types';

export const MakeupAcademyView: React.FC = () => {
  const { completedLessons, toggleLessonCompleted, savedLessons, toggleLessonSaved, language, isRTL, t } =
    useBeauty();

  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLesson, setActiveLesson] = useState<AcademyLesson | null>(null);

  const filteredLessons = ACADEMY_LESSONS.filter((l) => {
    if (selectedLevel !== 'all' && l.level !== selectedLevel) return false;
    if (selectedCategory !== 'all' && l.category !== selectedCategory) return false;
    return true;
  });

  const completionPercentage = Math.round(
    (completedLessons.length / ACADEMY_LESSONS.length) * 100
  );

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8C7D73] font-medium tracking-wide">
            <BookOpen className="w-4 h-4 text-[#C87D87]" />
            <span>{language === 'ar' ? 'دروس تطبيقية مبسطة خطوة بخطوة' : 'Step-by-Step Beauty Education'}</span>
            <span aria-hidden="true">·</span>
            <span>{ACADEMY_LESSONS.length} {language === 'ar' ? 'دروس تفصيلية' : 'Curated Masterclasses'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#28231D] tracking-tight mt-1">
            {t('academyHeading')}
          </h1>
          <p className="text-sm text-[#544B46] mt-1 max-w-xl leading-relaxed">
            {t('academySub')}
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-4 sm:p-5 min-w-[220px] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-[#28231D]">
            <span>{language === 'ar' ? 'تقدمكِ في الأكاديمية:' : 'Your Progress:'}</span>
            <span className="font-mono font-bold text-[#C87D87]">
              {completedLessons.length} / {ACADEMY_LESSONS.length} ({completionPercentage}%)
            </span>
          </div>
          <div className="w-full bg-[#FAF7F2] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#C87D87] h-2 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#EAE3DA] rounded-2xl p-4 space-y-3 shadow-sm text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#8C7D73] mr-2 font-medium">{t('filterLevel')}</span>
          {[
            { id: 'all', en: 'All Levels', ar: 'جميع المستويات' },
            { id: 'beginner', en: 'Beginner', ar: 'مبتدئة' },
            { id: 'intermediate', en: 'Intermediate', ar: 'متوسطة' },
            { id: 'advanced', en: 'Advanced', ar: 'متقدمة' },
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedLevel === lvl.id
                  ? 'bg-[#28231D] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#544B46] hover:bg-[#F2ECE4]'
              }`}
            >
              {language === 'ar' ? lvl.ar : lvl.en}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F2ECE4]">
          <span className="text-[#8C7D73] mr-2 font-medium">{language === 'ar' ? 'الموضوع:' : 'Topic:'}</span>
          {[
            { id: 'all', en: 'All Topics', ar: 'كل الموضوعات' },
            { id: 'prep', en: 'Skin Prep & Tools', ar: 'تجهيز البشرة والفرش' },
            { id: 'base', en: 'Base & Concealing', ar: 'الفاونديشن والكونسيلر' },
            { id: 'cheeks', en: 'Cheeks & Glow', ar: 'الخدود والإشراقة' },
            { id: 'looks', en: 'Complete Looks', ar: 'اللوكات المتكاملة' },
            { id: 'removal', en: 'Removal & Care', ar: 'إزالة المكياج والعناية' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#C87D87] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#544B46] hover:bg-[#F2ECE4]'
              }`}
            >
              {language === 'ar' ? cat.ar : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          const isDone = completedLessons.includes(lesson.id);
          const isSaved = savedLessons.includes(lesson.id);
          const title = language === 'ar' && lesson.titleAr ? lesson.titleAr : lesson.title;
          const overview = language === 'ar' && lesson.overviewAr ? lesson.overviewAr : lesson.overview;

          return (
            <div
              key={lesson.id}
              className={`bg-white border rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group ${
                isDone ? 'border-emerald-200' : 'border-[#EAE3DA]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF7F2] text-[#28231D] border border-[#EAE3DA]">
                      {lesson.level === 'beginner'
                        ? (language === 'ar' ? 'مبتدئة' : 'Beginner')
                        : lesson.level === 'intermediate'
                        ? (language === 'ar' ? 'متوسطة' : 'Intermediate')
                        : (language === 'ar' ? 'متقدمة' : 'Advanced')}
                    </span>
                    <span className="text-[#8C7D73] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.durationMinutes} {language === 'ar' ? 'دقيقة' : 'min'}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => toggleLessonSaved(lesson.id)}
                    className="text-[#8C7D73] hover:text-[#C87D87] cursor-pointer"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isSaved ? 'fill-[#C87D87] text-[#C87D87]' : ''}`}
                    />
                  </button>
                </div>

                <h3
                  onClick={() => setActiveLesson(lesson)}
                  className="font-serif text-lg font-bold text-[#28231D] group-hover:text-[#C87D87] transition-colors cursor-pointer leading-snug line-clamp-2"
                >
                  {title}
                </h3>

                <p className="text-xs text-[#544B46] line-clamp-3 leading-relaxed">
                  {overview}
                </p>

                <div className="text-[11px] text-[#8C7D73] space-y-0.5 pt-1">
                  <div>
                    <strong>{language === 'ar' ? 'الأدوات المطلوبة:' : 'Tools:'}</strong>{' '}
                    <span>{lesson.requiredTools.slice(0, 3).join('، ')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F2ECE4] mt-4 flex items-center justify-between">
                <button
                  onClick={() => toggleLessonCompleted(lesson.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isDone
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'text-[#8C7D73] hover:text-[#28231D]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isDone ? t('completed') : t('markDone')}</span>
                </button>

                <button
                  onClick={() => setActiveLesson(lesson)}
                  className="text-xs font-semibold text-[#28231D] hover:text-[#C87D87] flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('startLesson')}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVE LESSON READER MODAL */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-[#EAE3DA] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-[#F2ECE4]">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#C87D87] font-semibold">
                  {language === 'ar' ? 'أكاديمية المكياج · درس تطبيقي' : 'Makeup Academy · Masterclass'}
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#28231D] mt-1">
                  {language === 'ar' && activeLesson.titleAr ? activeLesson.titleAr : activeLesson.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-[#8C7D73] mt-1">
                  <span className="capitalize">{activeLesson.level}</span>
                  <span>·</span>
                  <span>{activeLesson.durationMinutes} {language === 'ar' ? 'دقائق تطبيق' : 'min practice'}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="p-1.5 text-[#8C7D73] hover:text-[#28231D] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#544B46] leading-relaxed">
              {language === 'ar' && activeLesson.overviewAr ? activeLesson.overviewAr : activeLesson.overview}
            </p>

            {/* Step-by-Step Instructions */}
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-bold text-[#28231D]">
                {language === 'ar' ? 'خطوات التطبيق العملية:' : 'Step-by-Step Breakdown:'}
              </h4>
              {activeLesson.steps.map((st, i) => (
                <div key={i} className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE3DA] space-y-2 text-xs">
                  <div className="font-bold text-[#28231D] text-sm">
                    {st.title}
                  </div>
                  <p className="text-[#544B46] leading-relaxed">{st.instruction}</p>
                  {st.proTip && (
                    <div className="p-2.5 bg-white rounded-lg border border-[#EAE3DA] text-[11px] text-[#C87D87] flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>{language === 'ar' ? 'نصيحة الخبراء:' : 'Pro Tip:'}</strong> {st.proTip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Practice Exercise */}
            {activeLesson.practiceExercise && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <strong>{language === 'ar' ? 'تمرين تطبيقي اليوم:' : 'Practice Exercise:'}</strong>
                <p>{activeLesson.practiceExercise}</p>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#F2ECE4] flex items-center justify-between">
              <button
                onClick={() => toggleLessonCompleted(activeLesson.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  completedLessons.includes(activeLesson.id)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#28231D] text-white hover:bg-[#3D352E]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedLessons.includes(activeLesson.id) ? t('completed') : t('markDone')}
                </span>
              </button>

              <button
                onClick={() => setActiveLesson(null)}
                className="px-4 py-2 text-xs font-semibold text-[#544B46] hover:bg-[#FAF7F2] rounded-xl cursor-pointer"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
