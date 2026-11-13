import React, { useState } from 'react';
import { ExperienceType } from '../types';
import { Language, I18N } from '../data/i18nData';
import { 
  ArrowLeft, 
  Terminal, 
  Award, 
  Trophy, 
  Infinity as InfinityIcon, 
  Globe, 
  Share2, 
  Check, 
  Sun, 
  Moon, 
  Contrast, 
  Search,
  Box 
} from 'lucide-react';
import { useAccessibility } from '../context/ThemeAccessibilityContext';

interface ExperienceNavProps {
  currentExperience: ExperienceType;
  onNavigate: (exp: ExperienceType) => void;
  sections?: { id: string; label: string }[];
  language?: Language;
  onToggleLanguage?: (lang: Language) => void;
}

export const ExperienceNav: React.FC<ExperienceNavProps> = ({
  currentExperience,
  onNavigate,
  sections = [],
  language = 'pt',
  onToggleLanguage,
}) => {
  const t = I18N[language].nav;
  const [copied, setCopied] = useState(false);
  const { theme: currentTheme, toggleTheme, highContrast, toggleHighContrast, setIsSearchOpen, open3DStudio } = useAccessibility();

  const getNavTheme = () => {
    switch (currentExperience) {
      case 'dev':
        return {
          headerBg: 'bg-[#080d1a]/95 border-slate-800/80 text-slate-100',
          brandColor: 'text-white font-bold',
          accentBadge: 'text-indigo-400 font-code',
          activeLink: 'text-indigo-400',
          buttonStyle: 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30',
        };
      case 'cavaleiro':
        return {
          headerBg: 'bg-[#18120c]/95 border-[#453222]/80 text-[#f6f1ea]',
          brandColor: 'text-[#f6f1ea] font-serif-luxury font-bold tracking-wider',
          accentBadge: 'text-[#d4af37] font-serif-luxury',
          activeLink: 'text-[#d4af37]',
          buttonStyle: 'bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/40',
        };
      case 'jogador':
        return {
          headerBg: 'bg-[#0a0a0a]/95 border-neutral-800 text-white',
          brandColor: 'text-white font-sport uppercase tracking-widest text-lg font-bold',
          accentBadge: 'text-emerald-400 font-sport',
          activeLink: 'text-emerald-400',
          buttonStyle: 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40',
        };
      case 'vida':
        return {
          headerBg: 'bg-[#0e0c0a]/95 border-[#382b1d] text-[#f6f1ea]',
          brandColor: 'text-[#d4af37] font-display-serif tracking-wider font-bold',
          accentBadge: 'text-[#d4af37] font-display-serif',
          activeLink: 'text-[#d4af37]',
          buttonStyle: 'bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] border border-[#d4af37]/40',
        };
      default:
        return {
          headerBg: 'bg-black/95 border-neutral-800 text-white',
          brandColor: 'text-white font-bold',
          accentBadge: 'text-neutral-400',
          activeLink: 'text-white',
          buttonStyle: 'bg-neutral-800 text-white',
        };
    }
  };

  const theme = getNavTheme();

  const getPersonaLabel = () => {
    if (currentExperience === 'dev') return language === 'pt' ? 'O Programador' : 'The Developer';
    if (currentExperience === 'cavaleiro') return language === 'pt' ? 'O Cavaleiro' : 'The Horseman';
    if (currentExperience === 'jogador') return language === 'pt' ? 'O Jogador' : 'The Footballer';
    if (currentExperience === 'vida') return language === 'pt' ? 'Minha Vida' : 'My Life';
    return 'Guilherme Marques Ferreira';
  };

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-colors ${theme.headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 md:gap-8">
        
        {/* Zone 1: Return to Home & Persona Wordmark */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 text-xs md:text-sm font-medium opacity-80 hover:opacity-100 transition-opacity px-2.5 py-1.5 rounded-md hover:bg-white/5 whitespace-nowrap shrink-0"
            title={t.backToHome}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{t.home}</span>
          </button>
          <span className={`${currentTheme === 'light' ? 'text-slate-300' : 'text-white/20'} select-none`}>/</span>
          {currentExperience === 'cavaleiro' && (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#d4af37] overflow-hidden shrink-0 shadow-sm bg-black">
              <img
                src="/assets/aistudio/Captura_de_tela_2026-11-06_232524_c19dafd0.png"
                alt="Logo Haras GMF"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span className={`text-sm sm:text-base md:text-lg ${theme.brandColor} truncate max-w-[130px] sm:max-w-none`}>
            {getPersonaLabel()}
          </span>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean typography) */}
        {sections.length > 0 && (
          <nav className="hidden lg:flex items-center gap-6 text-xs md:text-sm font-medium opacity-75">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:opacity-100 hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {section.label}
              </a>
            ))}
          </nav>
        )}

        {/* Zone 3: Quick Persona Switcher & Discreet Language Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="text-[11px] uppercase tracking-wider opacity-50 hidden xl:inline">
              {t.switch}
            </span>
            
            <button
              onClick={() => onNavigate('dev')}
              className={`px-2 sm:px-2.5 py-1 text-xs rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                currentExperience === 'dev'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
              title="O Desenvolvedor / Developer"
            >
              <Terminal className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{t.dev}</span>
            </button>

            <button
              onClick={() => onNavigate('cavaleiro')}
              className={`px-2 sm:px-2.5 py-1 text-xs rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                currentExperience === 'cavaleiro'
                  ? 'bg-[#c59b27] text-black shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
              title="O Cavaleiro / Horseman"
            >
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{t.cavaleiro}</span>
            </button>

            <button
              onClick={() => onNavigate('jogador')}
              className={`px-2 sm:px-2.5 py-1 text-xs rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                currentExperience === 'jogador'
                  ? 'bg-emerald-500 text-black shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
              title="O Jogador / Footballer"
            >
              <Trophy className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{t.jogador}</span>
            </button>

            <button
              onClick={() => onNavigate('vida')}
              className={`px-2 sm:px-2.5 py-1 text-xs rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                currentExperience === 'vida'
                  ? 'bg-[#d4af37] text-black shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
              title="Minha Vida / My Life"
            >
              <InfinityIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{t.vida}</span>
            </button>
          </div>

          {/* Interactive 3D Studio Button */}
          <button
            onClick={() => open3DStudio(currentExperience === 'dev' ? 'nucleo' : 'cavalo')}
            aria-label={language === 'pt' ? 'Abrir Estúdio 3D' : 'Open 3D Studio'}
            title={language === 'pt' ? 'Explorar em 3D (Three.js)' : 'Explore in 3D (Three.js)'}
            className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 text-xs rounded-md border transition-all shrink-0 ${
              currentTheme === 'light'
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                : 'bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border-[#d4af37]/40 text-[#f3dfb0]'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden xl:inline text-[11px]">3D</span>
          </button>

          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label={language === 'pt' ? 'Busca rápida (Ctrl+K)' : 'Quick search (Ctrl+K)'}
            title={language === 'pt' ? 'Buscar no portfólio (Ctrl+K)' : 'Search portfolio (Ctrl+K)'}
            className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 text-xs rounded-md border transition-all shrink-0 ${
              currentTheme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">{language === 'pt' ? 'Buscar' : 'Search'}</span>
            <kbd className={`hidden lg:inline text-[9px] px-1 py-0.5 rounded font-mono border ${
              currentTheme === 'light' ? 'bg-white border-slate-300 text-slate-600' : 'bg-black/40 border-white/15 text-neutral-400'
            }`}>
              ⌘K
            </kbd>
          </button>

          {/* High Contrast Mode Toggle */}
          <button
            onClick={toggleHighContrast}
            aria-label={language === 'pt' ? 'Alternar modo de alto contraste' : 'Toggle high contrast mode'}
            title={
              language === 'pt' 
                ? (highContrast ? 'Desativar Alto Contraste (Alt+C)' : 'Ativar Alto Contraste (Alt+C)')
                : (highContrast ? 'Disable High Contrast (Alt+C)' : 'Enable High Contrast (Alt+C)')
            }
            className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 text-xs rounded-md border transition-all shrink-0 ${
              highContrast
                ? 'bg-yellow-400 text-black border-yellow-300 font-bold shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                : currentTheme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80 hover:text-white'
            }`}
          >
            <Contrast className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">
              {highContrast 
                ? (language === 'pt' ? 'Contraste: ON' : 'Contrast: ON') 
                : (language === 'pt' ? 'Contraste' : 'Contrast')}
            </span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={language === 'pt' ? 'Alternar tema claro/escuro' : 'Toggle dark/light theme'}
            title={
              language === 'pt'
                ? (currentTheme === 'dark' ? 'Mudar para Tema Claro (Alt+T)' : 'Mudar para Tema Escuro (Alt+T)')
                : (currentTheme === 'dark' ? 'Switch to Light Theme (Alt+T)' : 'Switch to Dark Theme (Alt+T)')
            }
            className={`p-1.5 sm:px-2 sm:py-1 text-xs rounded-md border transition-all shrink-0 flex items-center gap-1 ${
              currentTheme === 'light'
                ? 'bg-amber-400 text-black border-amber-300 font-semibold'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80 hover:text-white'
            }`}
          >
            {currentTheme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px]">{language === 'pt' ? 'Claro' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px]">{language === 'pt' ? 'Escuro' : 'Dark'}</span>
              </>
            )}
          </button>

          {/* Share Button for Visitors */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            title={language === 'pt' ? 'Copiar link do portfólio' : 'Copy portfolio link'}
            className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 text-xs rounded-md border transition-all shrink-0 ${
              currentTheme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80 hover:text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline text-[11px] text-emerald-500 font-semibold">{language === 'pt' ? 'Copiado!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">{language === 'pt' ? 'Compartilhar' : 'Share'}</span>
              </>
            )}
          </button>

          {/* Discreet language toggle */}
          {onToggleLanguage && (
            <div className={`flex items-center gap-1 p-0.5 rounded-full border shrink-0 ${
              currentTheme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-black/40 border-white/10'
            }`}>
              <button
                onClick={() => onToggleLanguage('pt')}
                className={`px-2 py-0.5 text-[10px] rounded-full transition-all ${
                  language === 'pt'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Português"
              >
                PT
              </button>
              <button
                onClick={() => onToggleLanguage('en')}
                className={`px-2 py-0.5 text-[10px] rounded-full transition-all ${
                  language === 'en'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
