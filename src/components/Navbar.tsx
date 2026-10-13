import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Globe,
  Sparkle,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAI }) => {
  const {
    profile,
    shoppingList,
    setIsOnboardingOpen,
    language,
    setLanguage,
    isRTL,
    t,
  } = useBeauty();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const pendingShopCount = shoppingList.filter((i) => !i.purchased).length;

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ar' : 'en';
    setLanguage(nextLang);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE3DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly adheres to the 3-zone Top Bar Contract:
            [Zone 1: Brand title, one line] — [Zone 2: 4-5 nav links, single-line] — [Zone 3: Language switch + 1 primary action] */}
        <div className="flex items-center justify-between gap-4 lg:gap-8 h-18">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNav('dashboard')}
            className={`flex items-center gap-2 group cursor-pointer focus:outline-none ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            <span className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-[#28231D] whitespace-nowrap shrink-0 group-hover:text-[#C87D87] transition-colors">
              Glowly AI
            </span>
            <span className="text-xs text-[#8C7D73] font-normal hidden sm:inline-block">
              · {t('brandTagline')}
            </span>
          </button>

          {/* Zone 2: Concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#544B46]">
            <button
              onClick={() => handleNav('dashboard')}
              className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'border-[#C87D87] text-[#28231D] font-semibold'
                  : 'border-transparent hover:text-[#28231D]'
              }`}
            >
              {t('navDashboard')}
            </button>

            <button
              onClick={() => handleNav('routines')}
              className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'routines'
                  ? 'border-[#C87D87] text-[#28231D] font-semibold'
                  : 'border-transparent hover:text-[#28231D]'
              }`}
            >
              {t('navRoutines')}
            </button>

            <button
              onClick={() => handleNav('finder')}
              className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'finder'
                  ? 'border-[#C87D87] text-[#28231D] font-semibold'
                  : 'border-transparent hover:text-[#28231D]'
              }`}
            >
              {t('navProductFinder')}
            </button>

            <button
              onClick={() => handleNav('shelf')}
              className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'shelf'
                  ? 'border-[#C87D87] text-[#28231D] font-semibold'
                  : 'border-transparent hover:text-[#28231D]'
              }`}
            >
              {t('navMyShelf')}
            </button>

            <button
              onClick={() => handleNav('academy')}
              className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'academy'
                  ? 'border-[#C87D87] text-[#28231D] font-semibold'
                  : 'border-transparent hover:text-[#28231D]'
              }`}
            >
              {t('navAcademy')}
            </button>

            <button
              onClick={() => handleNav('decoder')}
              className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'decoder'
                  ? 'border-[#C87D87] text-[#28231D] font-semibold'
                  : 'border-transparent hover:text-[#28231D]'
              }`}
            >
              {t('navDecoder')}
            </button>

            {/* Dropdown for secondary self-care suites */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 cursor-pointer ${
                  ['grwm', 'dupes', 'bodycare', 'journal', 'match', 'shopping', 'admin'].includes(activeTab)
                    ? 'border-[#C87D87] text-[#28231D] font-semibold'
                    : 'border-transparent hover:text-[#28231D]'
                }`}
              >
                <span>{t('navMore')}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {moreDropdownOpen && (
                <div
                  className={`absolute mt-3 w-60 bg-white border border-[#EAE3DA] rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 ${
                    isRTL ? 'right-0' : 'left-0'
                  }`}
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  <button
                    onClick={() => handleNav('dupes')}
                    className={`w-full px-4 py-2 text-sm text-[#38332E] hover:bg-[#FAF7F2] hover:text-[#C87D87] transition-colors ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {t('navDupes')}
                  </button>
                  <button
                    onClick={() => handleNav('match')}
                    className={`w-full px-4 py-2 text-sm text-[#38332E] hover:bg-[#FAF7F2] hover:text-[#C87D87] transition-colors ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {t('navMatch')}
                  </button>
                  <button
                    onClick={() => handleNav('grwm')}
                    className={`w-full px-4 py-2 text-sm text-[#38332E] hover:bg-[#FAF7F2] hover:text-[#C87D87] transition-colors ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {t('navGRWM')}
                  </button>
                  <button
                    onClick={() => handleNav('bodycare')}
                    className={`w-full px-4 py-2 text-sm text-[#38332E] hover:bg-[#FAF7F2] hover:text-[#C87D87] transition-colors ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {t('navBodyCare')}
                  </button>
                  <button
                    onClick={() => handleNav('journal')}
                    className={`w-full px-4 py-2 text-sm text-[#38332E] hover:bg-[#FAF7F2] hover:text-[#C87D87] transition-colors ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {t('navJournal')}
                  </button>
                  <button
                    onClick={() => handleNav('shopping')}
                    className={`w-full px-4 py-2 text-sm text-[#38332E] hover:bg-[#FAF7F2] hover:text-[#C87D87] transition-colors flex items-center justify-between ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    <span>{t('navShoppingList')}</span>
                    {pendingShopCount > 0 && (
                      <span className="text-xs font-mono font-medium text-[#C87D87]">
                        ({pendingShopCount})
                      </span>
                    )}
                  </button>
                  <div className="border-t border-[#EAE3DA] my-1"></div>
                  <button
                    onClick={() => handleNav('admin')}
                    className={`w-full px-4 py-2 text-xs text-[#8C7D73] hover:bg-[#FAF7F2] hover:text-[#28231D] transition-colors flex items-center gap-1.5 ${
                      isRTL ? 'text-right justify-start' : 'text-left'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t('navAdmin')}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Language switch + User Profile + 1 primary action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Bilingual Switch Button */}
            <button
              onClick={toggleLanguage}
              title={language === 'en' ? 'التحويل إلى اللغة العربية' : 'Switch to English'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#28231D] bg-white hover:bg-[#F2ECE4] border border-[#D5CBC1] shadow-2xs transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#C87D87]" />
              <span className="tracking-wide">
                {language === 'en' ? 'العربية' : 'English'}
              </span>
            </button>

            {/* User Profile trigger */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              title={t('editProfile')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#544B46] hover:bg-[#F2ECE4] border border-[#EAE3DA] transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#C87D87]" />
              <span className="truncate max-w-24 font-normal">{profile.name || 'Sophia'}</span>
            </button>

            {/* Primary Action Button: Ask Glowly AI */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-medium text-white bg-[#28231D] hover:bg-[#3D352E] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E8B4B8]" />
              <span>{t('askGlowlyAI')}</span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#544B46] hover:text-[#28231D] focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#EAE3DA] space-y-1">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#EAE3DA]">
              <span className="text-xs text-[#8C7D73] font-medium">{t('languageLabel')}:</span>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#28231D] bg-white border border-[#EAE3DA] rounded-lg shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5 text-[#C87D87]" />
                <span>{language === 'en' ? 'العربية 🇪🇬' : 'English 🇬🇧'}</span>
              </button>
            </div>

            <button
              onClick={() => handleNav('dashboard')}
              className={`block w-full px-3 py-2 rounded-md text-sm font-medium text-[#28231D] hover:bg-[#F2ECE4] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {t('navDashboard')}
            </button>
            <button
              onClick={() => handleNav('routines')}
              className={`block w-full px-3 py-2 rounded-md text-sm font-medium text-[#28231D] hover:bg-[#F2ECE4] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {t('navRoutines')}
            </button>
            <button
              onClick={() => handleNav('finder')}
              className={`block w-full px-3 py-2 rounded-md text-sm font-medium text-[#28231D] hover:bg-[#F2ECE4] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {t('navProductFinder')}
            </button>
            <button
              onClick={() => handleNav('shelf')}
              className={`block w-full px-3 py-2 rounded-md text-sm font-medium text-[#28231D] hover:bg-[#F2ECE4] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {t('navMyShelf')}
            </button>
            <button
              onClick={() => handleNav('academy')}
              className={`block w-full px-3 py-2 rounded-md text-sm font-medium text-[#28231D] hover:bg-[#F2ECE4] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {t('navAcademy')}
            </button>
            <button
              onClick={() => handleNav('decoder')}
              className={`block w-full px-3 py-2 rounded-md text-sm font-medium text-[#28231D] hover:bg-[#F2ECE4] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {t('navDecoder')}
            </button>
            <button
              onClick={() => handleNav('dupes')}
              className={`block w-full px-3 py-2 rounded-md text-sm font-medium text-[#28231D] hover:bg-[#F2ECE4] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {t('navDupes')}
            </button>
            <button
              onClick={() => handleNav('match')}
              className={`block w-full px-3 py-2 rounded-md text-sm font-medium text-[#28231D] hover:bg-[#F2ECE4] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {t('navMatch')}
            </button>
            <button
              onClick={() => handleNav('grwm')}
              className={`block w-full px-3 py-2 rounded-md text-sm font-medium text-[#28231D] hover:bg-[#F2ECE4] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {t('navGRWM')}
            </button>
            <button
              onClick={() => handleNav('bodycare')}
              className={`block w-full px-3 py-2 rounded-md text-sm font-medium text-[#28231D] hover:bg-[#F2ECE4] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {t('navBodyCare')}
            </button>
            <button
              onClick={() => handleNav('journal')}
              className={`block w-full px-3 py-2 rounded-md text-sm font-medium text-[#28231D] hover:bg-[#F2ECE4] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {t('navJournal')}
            </button>
            <button
              onClick={() => handleNav('shopping')}
              className={`block w-full px-3 py-2 rounded-md text-sm font-medium text-[#28231D] hover:bg-[#F2ECE4] flex items-center justify-between ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              <span>{t('navShoppingList')}</span>
              {pendingShopCount > 0 && (
                <span className="text-xs text-[#C87D87] font-semibold">({pendingShopCount})</span>
              )}
            </button>
            <button
              onClick={() => handleNav('admin')}
              className={`block w-full px-3 py-2 rounded-md text-xs text-[#8C7D73] hover:bg-[#F2ECE4] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {t('navAdmin')}
            </button>
            <div className="pt-2 border-t border-[#EAE3DA]">
              <button
                onClick={() => {
                  setIsOnboardingOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2 text-xs font-medium text-[#28231D] border border-[#EAE3DA] rounded-lg bg-white cursor-pointer"
              >
                {t('editProfile')} ({profile.name || 'Sophia'})
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
