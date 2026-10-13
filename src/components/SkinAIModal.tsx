import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isFallback?: boolean;
  timestamp: string;
}

interface SkinAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SkinAIModal: React.FC<SkinAIModalProps> = ({ isOpen, onClose }) => {
  const { profile, shelf, language, isRTL, t } = useBeauty();

  const getInitialWelcome = (): string => {
    if (language === 'ar') {
      return `أهلاً بكِ يا ${profile.name || 'جميلتي'}! أنا Glowly AI، مرشدتكِ الذكية للعناية بالبشرة والمكياج بالسوق المصري.\n\nلقد قمت بتحميل ملف بشرتكِ (${profile.skinType === 'oily' ? 'دهنية' : profile.skinType === 'dry' ? 'جافة' : 'مختلطة'}) ولدي ${shelf.length} منتج مسجل في خزانتكِ.\n\nكيف أساعدكِ اليوم؟ يمكنكِ سؤالي بالعامية المصرية أو الفصحى عن روتين اقتصادي، فحص تعارض المنتجات، أو إيجاد بدائل مصرية للماركات الغالية!`;
    }
    return `Hello ${profile.name || 'there'}! I'm Glowly AI, your personal skincare and beauty advisor.\n\nI've loaded your profile (${profile.skinType.toUpperCase()} skin) and your ${shelf.length} shelf item(s).\n\nHow can I help you today? You can ask me in English or Arabic to build a minimal routine, check product interactions, find drugstore dupes, or explain any ingredient!`;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: getInitialWelcome(),
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When language changes, update the initial message if it is the only one
    if (messages.length === 1 && messages[0].id === 'msg-welcome') {
      setMessages([
        {
          id: 'msg-welcome',
          role: 'assistant',
          content: getInitialWelcome(),
          timestamp: 'Just now',
        },
      ]);
    }
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  const quickPrompts =
    language === 'ar'
      ? [
          'بشرتي دهنية وبتطلعلي حبوب وعايزة روتين اقتصادي من الصيدلية 🇪🇬',
          'إيه الفرق بين واقي شمس بوبانا وإنفينيتي؟',
          'عايزة بديل رخيص لشارلوت تلبوري فلوليس فلتر',
          'هل ينفع أستخدم السيراميد مع الريتينول في نفس الليلة؟',
          'عندي جلد وزة في رجلي إيه أحسن علاج من الصيدلية؟',
        ]
      : [
          'Build an affordable morning & evening routine in Egypt',
          'What is the difference between Bobana and Infinity sunscreen?',
          'Find drugstore dupes for Charlotte Tilbury and Rare Beauty',
          'Can I use Retinol and BHA exfoliant together?',
          'Best pharmacy treatment for strawberry skin on legs',
        ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          conversationHistory: messages.slice(-4),
          profile,
          ownedProducts: shelf,
        }),
      });

      const data = await response.json();
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.response || (language === 'ar' ? 'أنا جاهزة لمساعدتكِ!' : 'I am ready to help with your beauty routine!'),
        isFallback: data.isFallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'ar'
            ? 'عذراً، حدث تعثر في الاتصال. يمكنكِ مراجعة دليل المنتجات والروتينات الموثقة مباشرة.'
            : 'Sorry, communication was interrupted. You can explore the verified catalog and routines directly.',
        isFallback: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: getInitialWelcome(),
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#FAF7F2] border border-[#EAE3DA] rounded-2xl max-w-2xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE3DA] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FAF7F2] flex items-center justify-center border border-[#EAE3DA]">
              <Sparkles className="w-5 h-5 text-[#C87D87]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-[#28231D]">
                  {t('aiAssistantTitle')}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {language === 'ar' ? 'مصر 🇪🇬' : 'Bilingual'}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200" title="Gemini API Terms requirement: 18+ or adult-supervised educational guidance">
                  18+ / Adult Guide
                </span>
              </div>
              <p className="text-[11px] text-[#8C7D73]">{t('aiAssistantSub')}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={resetChat}
              className="p-2 text-[#8C7D73] hover:text-[#28231D] rounded-lg transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#8C7D73] hover:text-[#28231D] rounded-lg transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div ref={scrollRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? (isRTL ? 'flex-row' : 'flex-row-reverse') : (isRTL ? 'flex-row-reverse' : 'flex-row')}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    isUser ? 'bg-[#28231D] text-white' : 'bg-[#EAE3DA] text-[#28231D]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-[#C87D87]" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#28231D] text-white rounded-br-xs'
                      : 'bg-white border border-[#EAE3DA] text-[#28231D] shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-2">{msg.content}</div>

                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-[#F2ECE4] flex items-center justify-between text-[10px] text-[#8C7D73]">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="hover:text-[#28231D] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{language === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{language === 'ar' ? 'نسخ' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="w-7 h-7 rounded-full bg-[#EAE3DA] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#C87D87]" />
              </div>
              <div className="bg-white border border-[#EAE3DA] rounded-2xl p-4 text-xs text-[#8C7D73] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C87D87] animate-pulse"></span>
                <span>{language === 'ar' ? 'جاري استشارة Glowly AI...' : 'Glowly AI is thinking...'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Follow-up & Quick Prompts Chips */}
        <div className="px-4 py-2 border-t border-[#EAE3DA] bg-white overflow-x-auto whitespace-nowrap space-x-2 no-scrollbar">
          <span className="text-[10px] text-[#8C7D73] font-semibold uppercase tracking-wider mr-2 inline-block">
            {messages.length > 1 ? (language === 'ar' ? 'أسئلة متابعة مقترحة:' : 'Follow-up Ideas:') : t('ideasLabel')}
          </span>
          {messages.length > 1 && (
            <>
              <button
                onClick={() => handleSend(language === 'ar' ? 'هل هذه المنتجات تسبب حبوب أو تسد المسام؟' : 'Are any of these comedogenic?')}
                className="inline-block px-3 py-1 bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EAE3DA] rounded-full text-xs text-[#544B46] transition-colors cursor-pointer mr-1.5"
              >
                {language === 'ar' ? 'هل تسد المسام؟' : 'Are they non-comedogenic?'}
              </button>
              <button
                onClick={() => handleSend(language === 'ar' ? 'عايزة بدائل أرخص من هذه الخيارات' : 'Suggest even more affordable alternatives')}
                className="inline-block px-3 py-1 bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EAE3DA] rounded-full text-xs text-[#544B46] transition-colors cursor-pointer mr-1.5"
              >
                {language === 'ar' ? 'خيارات أوفر بالجنيه 💰' : 'Lower cost options 💰'}
              </button>
              <button
                onClick={() => handleSend(language === 'ar' ? 'كيف أرتب هذه المنتجات صباحاً ومساءً؟' : 'How should I layer them AM vs PM?')}
                className="inline-block px-3 py-1 bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EAE3DA] rounded-full text-xs text-[#544B46] transition-colors cursor-pointer mr-1.5"
              >
                {language === 'ar' ? 'ترتيب الخطوات بالتفصيل' : 'Layering order step-by-step'}
              </button>
            </>
          )}
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="inline-block px-3 py-1 bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EAE3DA] rounded-full text-xs text-[#544B46] transition-colors cursor-pointer mr-1.5"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-[#EAE3DA] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('aiPlaceholder')}
              className={`flex-1 py-2.5 px-4 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs sm:text-sm text-[#28231D] placeholder:text-[#8C7D73] focus:outline-none focus:border-[#C87D87] transition-all ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 bg-[#28231D] hover:bg-[#3D352E] disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <span>{t('send')}</span>
              <Send className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </form>

          {/* Medical Safeguard Disclaimer */}
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[#8C7D73]">
            <ShieldAlert className="w-3 h-3 text-[#C87D87] shrink-0" />
            <span className="line-clamp-1">{t('medicalDisclaimer')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
