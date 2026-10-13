import React, { useState } from 'react';
import { BeautyProvider, useBeauty } from './context/BeautyContext';
import { Navbar } from './components/Navbar';
import { OnboardingModal } from './components/OnboardingModal';
import { SkinAIModal } from './components/SkinAIModal';
import { DashboardView } from './components/DashboardView';
import { RoutineManagerView } from './components/RoutineManagerView';
import { ProductDiscoveryView } from './components/ProductDiscoveryView';
import { BeautyShelfView } from './components/BeautyShelfView';
import { MakeupAcademyView } from './components/MakeupAcademyView';
import { IngredientDecoderView } from './components/IngredientDecoderView';
import { MakeupMatchView } from './components/MakeupMatchView';
import { GRWMPlannerView } from './components/GRWMPlannerView';
import { DupeFinderView } from './components/DupeFinderView';
import { BodyCareView } from './components/BodyCareView';
import { JournalView } from './components/JournalView';
import { ShoppingListView } from './components/ShoppingListView';
import { AdminView } from './components/AdminView';
import { Sparkles, Heart, Shield, Droplets } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAIOpen, setIsAIOpen] = useState(false);
  const { isOnboardingOpen, setIsOnboardingOpen, profile } = useBeauty();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#28231D] flex flex-col selection:bg-[#E8C2B8] selection:text-[#28231D]">
      {/* Top Bar Contract Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAI={() => setIsAIOpen(true)}
          />
        )}
        {activeTab === 'routines' && <RoutineManagerView />}
        {activeTab === 'finder' && <ProductDiscoveryView />}
        {activeTab === 'shelf' && <BeautyShelfView />}
        {activeTab === 'academy' && <MakeupAcademyView />}
        {activeTab === 'decoder' && <IngredientDecoderView />}
        {activeTab === 'match' && <MakeupMatchView />}
        {activeTab === 'grwm' && <GRWMPlannerView />}
        {activeTab === 'dupes' && <DupeFinderView />}
        {activeTab === 'bodycare' && <BodyCareView />}
        {activeTab === 'journal' && <JournalView />}
        {activeTab === 'shopping' && <ShoppingListView />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      {/* Onboarding Questionnaire Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Skin AI Assistant Conversational Drawer */}
      <SkinAIModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      {/* Refined Footer */}
      <footer className="mt-auto border-t border-[#EAE3DA] bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#28231D]">
                Glowly AI
              </span>
              <p className="text-xs text-[#8C7D73] max-w-md leading-relaxed">
                Empowering girls and women with evidence-based skincare routines, honest ingredient decoding, and accessible beauty education.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#544B46]">
              <button
                onClick={() => setActiveTab('routines')}
                className="hover:text-[#28231D] cursor-pointer"
              >
                Routines
              </button>
              <button
                onClick={() => setActiveTab('finder')}
                className="hover:text-[#28231D] cursor-pointer"
              >
                Product Finder
              </button>
              <button
                onClick={() => setActiveTab('dupes')}
                className="hover:text-[#28231D] cursor-pointer"
              >
                Dupe Finder
              </button>
              <button
                onClick={() => setActiveTab('academy')}
                className="hover:text-[#28231D] cursor-pointer"
              >
                Makeup Academy
              </button>
              <button
                onClick={() => setActiveTab('bodycare')}
                className="hover:text-[#28231D] cursor-pointer"
              >
                Body Care
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className="hover:text-[#28231D] cursor-pointer text-[#8C7D73]"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-[#F2ECE4] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C7D73]">
            <p className="text-[11px] leading-relaxed max-w-2xl text-center sm:text-left">
              <strong>Medical Disclaimer:</strong> Glowly AI provides personalized cosmetic and self-care education. The platform does not diagnose medical diseases, prescribe pharmaceuticals, or guarantee cosmetic outcomes. For persistent, severe, or painful skin conditions, consult a board-certified dermatologist.
            </p>
            <div className="text-[11px] whitespace-nowrap">
              © {new Date().getFullYear()} Glowly AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BeautyProvider>
      <AppContent />
    </BeautyProvider>
  );
}
