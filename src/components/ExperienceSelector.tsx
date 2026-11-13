import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExperienceType } from '../types';
import { Language, I18N } from '../data/i18nData';
import { 
  Award, 
  Code2, 
  Trophy, 
  Infinity as InfinityIcon, 
  ArrowUpRight, 
  Globe, 
  Sun, 
  Moon, 
  Contrast, 
  Search, 
  Share2, 
  Check,
  Box
} from 'lucide-react';
import { useAccessibility } from '../context/ThemeAccessibilityContext';

interface ExperienceSelectorProps {
  onSelect: (experience: ExperienceType) => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
}

export const ExperienceSelector: React.FC<ExperienceSelectorProps> = ({
  onSelect,
  language,
  onToggleLanguage,
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme, highContrast, toggleHighContrast, setIsSearchOpen, open3DStudio } = useAccessibility();
  const t = I18N[language].home;

  const cards = [
    {
      id: 'cavaleiro' as ExperienceType,
      title: t.cards.cavaleiro.title,
      subtitle: t.cards.cavaleiro.subtitle,
      icon: Award,
    },
    {
      id: 'dev' as ExperienceType,
      title: t.cards.dev.title,
      subtitle: t.cards.dev.subtitle,
      icon: Code2,
    },
    {
      id: 'jogador' as ExperienceType,
      title: t.cards.jogador.title,
      subtitle: t.cards.jogador.subtitle,
      icon: Trophy,
    },
    {
      id: 'vida' as ExperienceType,
      title: t.cards.vida.title,
      subtitle: t.cards.vida.subtitle,
      icon: InfinityIcon,
    },
  ];

  // Motion variants for container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <main className="relative min-h-screen bg-[#060606] text-white flex flex-col justify-between items-center px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-14 overflow-hidden selection:bg-[#d4af37] selection:text-black">
      
      {/* Warm Golden Ambient Spotlights (zero-blur CSS radial gradients for 60fps rendering) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[780px] h-[480px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)]" />
        <div className="absolute -bottom-24 -right-24 w-[620px] h-[620px] bg-[radial-gradient(circle_at_center,rgba(158,122,43,0.14)_0%,transparent_70%)]" />
        <div className="absolute -bottom-24 -left-24 w-[520px] h-[520px] bg-[radial-gradient(circle_at_center,rgba(115,85,24,0.10)_0%,transparent_70%)]" />
      </div>

      {/* Top Header: Search, 3D Studio, Contrast, Theme, Share & Language */}
      <header className="relative z-20 w-full max-w-6xl px-3 sm:px-4 py-2.5 rounded-2xl flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0" />
          <span className="font-bold header-brand-title">
            GUILHERME M. FERREIRA
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Interactive 3D Studio Button */}
          <button
            onClick={() => open3DStudio('cavalo')}
            aria-label={language === 'pt' ? 'Abrir Estúdio 3D Interativo' : 'Open Interactive 3D Studio'}
            title={language === 'pt' ? 'Explorar Troféus & Núcleo em 3D (Three.js)' : 'Explore 3D Showcase (Three.js)'}
            className={`flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1 text-xs rounded-full border transition-all shadow-sm font-semibold ${
              theme === 'light'
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border-[#d4af37]/40 text-[#f3dfb0]'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline text-[11px]">
              {language === 'pt' ? 'Estúdio 3D' : '3D Studio'}
            </span>
          </button>

          {/* Quick Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label={language === 'pt' ? 'Busca rápida (Ctrl+K)' : 'Quick search (Ctrl+K)'}
            title={language === 'pt' ? 'Buscar no portfólio (Ctrl+K)' : 'Search portfolio (Ctrl+K)'}
            className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 text-xs rounded-full border transition-all shadow-sm ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-neutral-900/90 hover:bg-neutral-800 border-neutral-800 text-white/80 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{language === 'pt' ? 'Buscar' : 'Search'}</span>
            <kbd className={`hidden md:inline text-[9px] px-1 py-0.5 rounded font-mono border ${
              theme === 'light' ? 'bg-white border-slate-300 text-slate-600' : 'bg-black/50 border-white/10 text-neutral-400'
            }`}>
              ⌘K
            </kbd>
          </button>

          {/* High Contrast Mode */}
          <button
            onClick={toggleHighContrast}
            aria-label={language === 'pt' ? 'Alternar modo de alto contraste' : 'Toggle high contrast mode'}
            title={
              language === 'pt'
                ? (highContrast ? 'Desativar Alto Contraste (Alt+C)' : 'Ativar Alto Contraste (Alt+C)')
                : (highContrast ? 'Disable High Contrast (Alt+C)' : 'Enable High Contrast (Alt+C)')
            }
            className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 text-xs rounded-full border transition-all shadow-sm ${
              highContrast
                ? 'bg-yellow-400 text-black border-yellow-300 font-bold shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                : theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-neutral-900/90 hover:bg-neutral-800 border-neutral-800 text-white/80 hover:text-white'
            }`}
          >
            <Contrast className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">
              {highContrast ? (language === 'pt' ? 'Contraste ON' : 'Contrast ON') : (language === 'pt' ? 'Contraste' : 'Contrast')}
            </span>
          </button>

          {/* Dark / Light Mode */}
          <button
            onClick={toggleTheme}
            aria-label={language === 'pt' ? 'Alternar tema claro/escuro' : 'Toggle dark/light theme'}
            title={
              language === 'pt'
                ? (theme === 'dark' ? 'Mudar para Tema Claro (Alt+T)' : 'Mudar para Tema Escuro (Alt+T)')
                : (theme === 'dark' ? 'Switch to Light Theme (Alt+T)' : 'Switch to Dark Theme (Alt+T)')
            }
            className={`p-1.5 sm:px-2.5 sm:py-1 text-xs rounded-full border transition-all shadow-sm flex items-center gap-1 ${
              theme === 'light'
                ? 'bg-amber-400 text-black border-amber-300 font-semibold'
                : 'bg-neutral-900/90 hover:bg-neutral-800 border-neutral-800 text-white/80 hover:text-white'
            }`}
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">{language === 'pt' ? 'Claro' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">{language === 'pt' ? 'Escuro' : 'Dark'}</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            title={language === 'pt' ? 'Copiar link do portfólio' : 'Copy portfolio link'}
            className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 text-xs rounded-full border transition-all shadow-sm ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-neutral-900/90 hover:bg-neutral-800 border-neutral-800 text-white/80 hover:text-white'
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

          {/* Discreet Language Toggle (PT / EN) */}
          <div className={`flex items-center gap-1.5 p-1 rounded-full border shadow-sm ${
            theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-neutral-900 border-neutral-800/80'
          }`}>
            <Globe className="w-3.5 h-3.5 text-neutral-400 ml-1.5 shrink-0" />
            <button
              onClick={() => onToggleLanguage('pt')}
              className={`px-2.5 py-1 text-[11px] font-semibold tracking-wider rounded-full transition-all ${
                language === 'pt'
                  ? 'bg-[#d4af37] text-black shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              aria-label="Mudar para Português"
            >
              PT
            </button>
            <span className="text-neutral-700 select-none text-xs">·</span>
            <button
              onClick={() => onToggleLanguage('en')}
              className={`px-2.5 py-1 text-[11px] font-semibold tracking-wider rounded-full transition-all ${
                language === 'en'
                  ? 'bg-[#d4af37] text-black shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              aria-label="Switch to English"
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Main Center Content with Framer Motion */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center my-auto py-6 sm:py-8"
      >
        
        {/* Kicker */}
        <motion.span
          variants={{
            hidden: { opacity: 0, y: -15 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
          }}
          className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-[#d4af37] mb-5 sm:mb-7 font-cinzel"
        >
          {t.kicker}
        </motion.span>

        {/* Grand Typography Name: GUILHERME MARQUES FERREIRA */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.96 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
          }}
          className="flex flex-col items-center leading-[0.92] sm:leading-[0.9] select-none mb-6 sm:mb-8"
        >
          <span className="font-display-serif uppercase hero-main-title tracking-tight font-normal text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem]">
            GUILHERME
          </span>
          <span className="font-display-serif italic hero-main-title-accent font-normal text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem] my-0.5">
            MARQUES
          </span>
          <span className="font-display-serif uppercase hero-main-title tracking-tight font-normal text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem]">
            FERREIRA
          </span>
        </motion.div>

        {/* Subtitle Quote */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.15 } },
          }}
          className="font-display-serif italic text-[#dfd4c5] text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 sm:mb-14"
        >
          {t.quote}
        </motion.p>

        {/* Question Header */}
        <motion.span
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5, delay: 0.25 } },
          }}
          className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-neutral-400 font-cinzel mb-6 sm:mb-8"
        >
          {t.question}
        </motion.span>

        {/* 4 Golden Aesthetic Cards with Staggered Fade-in & Slide-up */}
        <motion.div
          variants={containerVariants}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            const isHovered = hoveredCard === card.id;

            return (
              <motion.button
                key={card.id}
                variants={cardVariants}
                onClick={() => onSelect(card.id)}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative flex flex-col justify-between text-left p-6 sm:p-7 min-h-[160px] sm:min-h-[175px] rounded-2xl bg-[#0f0e0d]/90 border border-neutral-800/80 transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
                  isHovered
                    ? 'border-[#d4af37]/70 shadow-[0_0_30px_rgba(212,175,55,0.2)] -translate-y-1 bg-[#151310]'
                    : 'hover:border-neutral-700'
                }`}
              >
                {/* Top Row: Icon on left, ArrowUpRight on right */}
                <div className="flex items-center justify-between w-full mb-8">
                  <div className="text-[#d4af37] transition-transform duration-300 group-hover:scale-110">
                    {card.id === 'cavaleiro' ? (
                      <div className="w-8 h-8 rounded-full border border-[#d4af37] p-0.5 overflow-hidden shadow-sm bg-black">
                        <img
                          src="/assets/aistudio/Captura_de_tela_2026-11-06_232524_c19dafd0.png"
                          alt="Haras GMF Logo"
                          className="w-full h-full object-contain rounded-full p-0.5"
                        />
                      </div>
                    ) : (
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    )}
                  </div>
                  
                  <ArrowUpRight className={`w-5 h-5 text-neutral-500 group-hover:text-[#d4af37] transition-colors duration-300 ${
                    isHovered ? 'translate-x-0.5 -translate-y-0.5' : ''
                  }`} />
                </div>

                {/* Bottom Row: Title and Subtitle */}
                <div>
                  <h3 className="font-display-serif font-normal text-xl sm:text-[1.35rem] text-white tracking-wide mb-1 group-hover:text-[#fbf2dd] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light tracking-normal">
                    {card.subtitle}
                  </p>
                </div>

                {/* Subtle Bottom Gold Highlight Line on Hover */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </motion.button>
            );
          })}
        </motion.div>

      </motion.div>

      {/* Space before fixed footer */}
      <div className="h-6 sm:h-8" />

    </main>
  );
};
