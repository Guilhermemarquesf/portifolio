/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ExperienceType } from './types';
import { Language } from './data/i18nData';
import { ExperienceSelector } from './components/ExperienceSelector';
import { DeveloperExperience } from './components/DeveloperExperience';
import { CavaleiroExperience } from './components/CavaleiroExperience';
import { JogadorExperience } from './components/JogadorExperience';
import { MinhaVidaExperience } from './components/MinhaVidaExperience';
import { GlobalFooter } from './components/GlobalFooter';
import { ThemeAccessibilityProvider, useAccessibility } from './context/ThemeAccessibilityContext';
import { AccessibilityControls } from './components/AccessibilityControls';
import { QuickSearchModal } from './components/QuickSearchModal';
import { ThreeStudioModal } from './components/ThreeStudioModal';

function AppContent() {
  const [experience, setExperience] = useState<ExperienceType>('home');
  const [language, setLanguage] = useState<Language>('pt');
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const { isSearchOpen, setIsSearchOpen, is3DStudioOpen, threeExhibit, close3DStudio } = useAccessibility();

  // Listen for Google Maps quota events (Tier 1 & Tier 2 defense)
  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Sync with HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
  }, [language]);

  const navTimerRef = useRef<number | null>(null);

  // Sync with URL hash and browser history navigation (Back/Forward)
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      if (!rawHash || rawHash === 'home') {
        setExperience('home');
        return;
      }

      const validExperiences: ExperienceType[] = ['dev', 'cavaleiro', 'jogador', 'vida'];
      if (validExperiences.includes(rawHash as ExperienceType)) {
        setExperience(rawHash as ExperienceType);
        return;
      }

      const el = document.getElementById(rawHash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
      if (navTimerRef.current) window.clearTimeout(navTimerRef.current);
    };
  }, []);

  const navigateTo = (newExp: ExperienceType, sectionId?: string) => {
    if (navTimerRef.current) {
      window.clearTimeout(navTimerRef.current);
      navTimerRef.current = null;
    }

    setExperience(newExp);
    if (newExp === 'home') {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.history.pushState(null, '', `#${newExp}`);
    }

    if (sectionId) {
      navTimerRef.current = window.setTimeout(() => {
        navTimerRef.current = null;
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#060606] pb-14 sm:pb-16 flex flex-col justify-between transition-colors duration-200">
      {/* Google Maps Quota Warning Banner (Demo Key Specialization) */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <main className="w-full flex-1">
        {experience === 'home' && (
          <ExperienceSelector
            onSelect={(exp) => navigateTo(exp)}
            language={language}
            onToggleLanguage={setLanguage}
          />
        )}

        {experience === 'dev' && (
          <DeveloperExperience
            onNavigate={navigateTo}
            language={language}
            onToggleLanguage={setLanguage}
          />
        )}

        {experience === 'cavaleiro' && (
          <CavaleiroExperience
            onNavigate={navigateTo}
            language={language}
            onToggleLanguage={setLanguage}
          />
        )}

        {experience === 'jogador' && (
          <JogadorExperience
            onNavigate={navigateTo}
            language={language}
            onToggleLanguage={setLanguage}
          />
        )}

        {experience === 'vida' && (
          <MinhaVidaExperience
            onNavigate={navigateTo}
            language={language}
            onToggleLanguage={setLanguage}
          />
        )}
      </main>

      {/* Floating Accessibility Dock & Back to Top */}
      <AccessibilityControls language={language} />

      {/* Quick Search & Command Palette Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectExperience={navigateTo}
        language={language}
      />

      {/* Interactive Three.js 3D Studio Modal */}
      <ThreeStudioModal
        isOpen={is3DStudioOpen}
        onClose={close3DStudio}
        initialExhibit={threeExhibit}
      />

      {/* Rodapé Fixo e Elegante em todas as telas */}
      <GlobalFooter
        currentExperience={experience}
        onNavigate={(exp) => navigateTo(exp)}
        language={language}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeAccessibilityProvider>
      <AppContent />
    </ThemeAccessibilityProvider>
  );
}
