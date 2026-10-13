import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';

interface GRWMStep {
  id: string;
  stepName: string;
  stepNameAr?: string;
  category: 'prep' | 'base' | 'cheeks' | 'eyes' | 'lips' | 'finish';
  durationMinutes: number;
  instructions: string;
  instructionsAr?: string;
  skippable: boolean;
  completed: boolean;
}

export const GRWMPlannerView: React.FC = () => {
  const { profile, shelf, language, isRTL, t } = useBeauty();

  const [occasion, setOccasion] = useState<'casual' | 'work_study' | 'date_night' | 'party' | 'wedding'>('casual');
  const [durationTier, setDurationTier] = useState<10 | 25 | 45>(25);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Dynamic steps generated based on occasion + duration
  const [steps, setSteps] = useState<GRWMStep[]>([]);

  useEffect(() => {
    let generated: GRWMStep[] = [];

    if (durationTier === 10) {
      generated = [
        {
          id: 's-1',
          stepName: 'Skin Hydration & Broad-Spectrum SPF',
          stepNameAr: 'ترطيب سريع وواقي شمس واسع المدى',
          category: 'prep',
          durationMinutes: 2,
          instructions: 'Massage lightweight moisturizer and non-pilling sunscreen with clean hands.',
          instructionsAr: 'تدليك مرطب خفيف وواقي شمس جل غير دهني باليدين النظيفتين.',
          skippable: false,
          completed: false,
        },
        {
          id: 's-2',
          stepName: 'Spot Concealing (Inner Corners & Redness)',
          stepNameAr: 'كونسيلر موضعي لمحيط العين واحمرار الأنف',
          category: 'base',
          durationMinutes: 3,
          instructions: 'Dot concealer on inner eye corners and around nostrils. Tap to blend with damp sponge.',
          instructionsAr: 'تنقيط كونسيلر في الزاوية الداخلية للعين وجوانب الأنف والدمج بإسفنجة رطبة.',
          skippable: false,
          completed: false,
        },
        {
          id: 's-3',
          stepName: 'Cheek & Lip Tint Duo (Amanda or Bobana)',
          stepNameAr: 'تنت وبلاشر سائل سريع للخدود والشفاه',
          category: 'cheeks',
          durationMinutes: 2,
          instructions: 'Dab cream or liquid blush on cheekbones, then tap residual color onto lips.',
          instructionsAr: 'طبطبة نقطة بلاشر سائل على عظام الخد ولمسة خفيفة على الشفاه.',
          skippable: false,
          completed: false,
        },
        {
          id: 's-4',
          stepName: 'Lash Curl & Lengthening Mascara',
          stepNameAr: 'ثني الرموش وماسكارا لاش برنسيس سريعة',
          category: 'eyes',
          durationMinutes: 2,
          instructions: 'Curl lashes at root and apply 1 swift coat of mascara.',
          instructionsAr: 'ثني الرموش بالكباس وتمرير طبقة ماسكارا سريعة.',
          skippable: false,
          completed: false,
        },
        {
          id: 's-5',
          stepName: 'T-Zone Translucent Dusting',
          stepNameAr: 'تثبيت خفيف بالبودرة على منطقة T',
          category: 'finish',
          durationMinutes: 1,
          instructions: 'Quick powder press between brows and chin to lock oil.',
          instructionsAr: 'لمسة بودرة شفافة سريعة بين الحاجبين والذقن لمنع اللمعان.',
          skippable: true,
          completed: false,
        },
      ];
    } else if (durationTier === 25) {
      generated = [
        {
          id: 's-1',
          stepName: 'Thermal Mist & Hyaluronic Hydration Prep',
          stepNameAr: 'تهيئة الوجه بماء الورد وسيروم الهيالورونيك',
          category: 'prep',
          durationMinutes: 3,
          instructions: 'Mist face with rose water, pat hydrating serum, follow with moisturizer.',
          instructionsAr: 'رش ماء ورد طبيعي ثم طبطبة سيروم هيالورونيك ومرطب خفيف.',
          skippable: false,
          completed: false,
        },
        {
          id: 's-2',
          stepName: 'Daily Sun Protection (SPF 50+)',
          stepNameAr: 'حماية كاملة بواقي الشمس SPF 50+',
          category: 'prep',
          durationMinutes: 2,
          instructions: 'Apply 2 fingers of sunscreen gel (Bobana or Infinity) and let absorb for 2 minutes.',
          instructionsAr: 'وضع مقدار إصبعين كاملين من واقي الشمس وتركه دقيقتين ليمتصه الجلد.',
          skippable: false,
          completed: false,
        },
        {
          id: 's-3',
          stepName: 'Skin Tint or Lightweight Foundation (Amanda)',
          stepNameAr: 'فاونديشن ناعم أو فلتر إشراقة (أماندا/إيلف)',
          category: 'base',
          durationMinutes: 5,
          instructions: 'Dot base over center of face and buff outward with a damp sponge.',
          instructionsAr: 'توزيع الفاونديشن من منتصف الوجه للخارج بإسفنجة مبللة لمظهر فلتر طبيعي.',
          skippable: false,
          completed: false,
        },
        {
          id: 's-4',
          stepName: 'Under-Eye Brightening & Spot Coverage',
          stepNameAr: 'تفتيح الهالات وتغطية الحبوب بالكونسيلر',
          category: 'base',
          durationMinutes: 4,
          instructions: 'Place pinpoint drops on inner corners and blemishes. Set with translucent powder.',
          instructionsAr: 'وضع كونسيلر عند زاوية العين والعيوب والتثبيت بلمسة بودرة خفيفة.',
          skippable: false,
          completed: false,
        },
        {
          id: 's-5',
          stepName: 'Liquid Blush & Warm Bronzer Sweep',
          stepNameAr: 'بلاشر سائل ولمسة برونزر دافئة للوجه',
          category: 'cheeks',
          durationMinutes: 4,
          instructions: 'Blend liquid blush upwards, sweep warm baked powder along forehead and cheekbones.',
          instructionsAr: 'دمج البلاشر السائل للأعلى، وتمرير بودرة برونزر سيبيل على الجبين والخدين.',
          skippable: false,
          completed: false,
        },
        {
          id: 's-6',
          stepName: 'Defined Brows & Full Flutter Mascara',
          stepNameAr: 'تمشيط الحواجب وماسكارا الرموش الكثيفة',
          category: 'eyes',
          durationMinutes: 4,
          instructions: 'Brush brows upward with brow gel. Apply 2 coats of mascara.',
          instructionsAr: 'تمشيط شعر الحواجب بجل شفاف، ووضع طبقتين من ماسكارا إيسنس.',
          skippable: false,
          completed: false,
        },
        {
          id: 's-7',
          stepName: 'Velvet Lip Combo & Setting Mist',
          stepNameAr: 'تحديد الشفاه والروج المخملي وبخاخ التثبيت',
          category: 'lips',
          durationMinutes: 3,
          instructions: 'Line lips with nude pencil, fill with Amanda velvet lipstick, mist with setting spray.',
          instructionsAr: 'تحديد الشفاه بلون نود، وملؤها بروج أماندا المخملي، ورش مثبت المكياج.',
          skippable: false,
          completed: false,
        },
      ];
    } else {
      // 45-Minute Event Look
      generated = [
        {
          id: 's-1',
          stepName: 'Luxury Barrier Prep Mask & Cooling Eye Patches',
          stepNameAr: 'قناع ترطيب مكثف للوجه ولصقات تبريد تحت العين',
          category: 'prep',
          durationMinutes: 8,
          instructions: 'Pre-hydrate skin for flawless makeup adherence under bright event lights.',
          instructionsAr: 'ترطيب عميق تحت العين والوجه لضمان ثبات الأساس طوال السهرة.',
          skippable: false,
          completed: false,
        },
        {
          id: 's-2',
          stepName: 'Primer & Longwear Matte Foundation',
          stepNameAr: 'برايمر وفاونديشن أماندا ميلانو عالي الثبات',
          category: 'base',
          durationMinutes: 8,
          instructions: 'Press pore-blurring primer into T-zone. Layer buildable matte foundation.',
          instructionsAr: 'تثبيت البرايمر بالمسام، وتوزيع فاونديشن التغطية الكاملة بإسفنجة ناعمة.',
          skippable: false,
          completed: false,
        },
        {
          id: 's-3',
          stepName: 'Sculpting Contour, Conceal & Baking',
          stepNameAr: 'كونتور نحت الوجه والبيكنج باللوس باودر',
          category: 'base',
          durationMinutes: 8,
          instructions: 'Chisel cheekbones with cool taupe contour. Bake under-eyes with loose powder.',
          instructionsAr: 'تحديد عظام الخد بالكونتور البارد، وعمل بيكنج خفيف تحت العين.',
          skippable: false,
          completed: false,
        },
        {
          id: 's-4',
          stepName: 'Soft Glam Eyeshadow & Winged Liner',
          stepNameAr: 'شادو سهرة سموكي ناعم وآيلاينر سيبيل المقاوم للماء',
          category: 'eyes',
          durationMinutes: 10,
          instructions: 'Buff neutral browns in crease, add champagne lid shimmer, flick waterproof liner.',
          instructionsAr: 'دمج درجات البني في كسرة العين، إضافة شيمر الشامبانيا، ورسم جناح آيلاينر دقيق.',
          skippable: false,
          completed: false,
        },
        {
          id: 's-5',
          stepName: 'Radiant Blush, Candlelight Glow & Locked Lips',
          stepNameAr: 'بلاشر مشرق وهايلايتر وروج مخملي فخم',
          category: 'finish',
          durationMinutes: 7,
          instructions: 'Layer baked blush, candlelight highlight, longwear velvet lip and dual setting spray.',
          instructionsAr: 'دمج بلاشر أماندا والهايلايتر، تطبيق الروج المخملي وبخاخ التثبيت النهائي.',
          skippable: false,
          completed: false,
        },
      ];
    }

    setSteps(generated);
    setTimerSeconds(durationTier * 60);
    setIsTimerRunning(false);
  }, [durationTier]);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleStepCompleted = (id: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#8C7D73] font-medium tracking-wide">
          <Clock className="w-4 h-4 text-[#C87D87]" />
          <span>{language === 'ar' ? 'مخطط الوقت اليومي للمكياج والعناية' : 'Timed Routine Execution Engine'}</span>
          <span aria-hidden="true">·</span>
          <span>{durationTier} {language === 'ar' ? 'دقيقة محسوبة' : 'Min Scheduled'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#28231D] tracking-tight mt-1">
          {t('grwmHeading')}
        </h1>
        <p className="text-sm text-[#544B46] mt-1 max-w-xl leading-relaxed">
          {t('grwmSub')}
        </p>
      </div>

      {/* Selectors & Live Timer Bar */}
      <div className="bg-white border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#F2ECE4]">
          {/* Duration Selector Buttons */}
          <div>
            <label className="block text-xs font-semibold text-[#8C7D73] uppercase tracking-wider mb-2">
              {t('timeAvailableLabel')}
            </label>
            <div className="flex items-center gap-2">
              {[
                { tier: 10, label: language === 'ar' ? '10 دقائق (سريع للجامعة)' : '10 Min Express' },
                { tier: 25, label: language === 'ar' ? '25 دقيقة (يومي متكامل)' : '25 Min Standard' },
                { tier: 45, label: language === 'ar' ? '45 دقيقة (سهرة ومناسبات)' : '45 Min Event Glam' },
              ].map((item) => (
                <button
                  key={item.tier}
                  onClick={() => setDurationTier(item.tier as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    durationTier === item.tier
                      ? 'bg-[#28231D] text-white shadow-2xs'
                      : 'bg-[#FAF7F2] text-[#544B46] hover:bg-[#F2ECE4] border border-[#EAE3DA]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Timer Clock Widget */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE3DA] flex items-center gap-4">
            <div>
              <span className="text-[10px] text-[#8C7D73] block uppercase tracking-wider font-semibold">
                {language === 'ar' ? 'العداد التنازلي' : 'Live Countdown'}
              </span>
              <span className="font-mono text-3xl font-bold text-[#28231D]">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer shadow-sm ${
                  isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#C87D87] hover:bg-[#B76E78]'
                }`}
                title={isTimerRunning ? 'Pause' : 'Start'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(durationTier * 60);
                }}
                className="w-10 h-10 rounded-full bg-white hover:bg-[#F2ECE4] border border-[#EAE3DA] flex items-center justify-center text-[#544B46] cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Step-by-Step Checklist */}
        <div className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-[#28231D]">
            {language === 'ar' ? 'الجدول الزمني المرتب للخطوات:' : 'Chronological Timeline Steps:'}
          </h3>
          <div className="space-y-3">
            {steps.map((st, idx) => {
              const name = language === 'ar' && st.stepNameAr ? st.stepNameAr : st.stepName;
              const instr = language === 'ar' && st.instructionsAr ? st.instructionsAr : st.instructions;
              return (
                <div
                  key={st.id}
                  onClick={() => toggleStepCompleted(st.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    st.completed
                      ? 'bg-emerald-50/40 border-emerald-200 opacity-70'
                      : 'bg-[#FAF7F2] border-[#EAE3DA] hover:border-[#C87D87]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white border border-[#EAE3DA] flex items-center justify-center font-mono text-xs font-bold text-[#28231D] shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-serif text-base font-bold ${st.completed ? 'line-through text-[#8C7D73]' : 'text-[#28231D]'}`}>
                          {name}
                        </h4>
                        <span className="text-[10px] text-[#8C7D73] font-mono">
                          ({st.durationMinutes} {language === 'ar' ? 'د' : 'min'})
                        </span>
                      </div>
                      <p className="text-xs text-[#544B46] mt-0.5 leading-relaxed">{instr}</p>
                    </div>
                  </div>

                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 ${
                      st.completed ? 'text-emerald-600 fill-emerald-100' : 'text-[#8C7D73]'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
