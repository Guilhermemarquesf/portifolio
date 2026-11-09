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
  Check 
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
  const { theme, toggleTheme, highContrast, toggleHighContrast, setIsSearchOpen } = useAccessibility();
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
      
      {/* Warm Golden Ambient Spotlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top subtle golden backlight */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-[#d4af37]/10 rounded-full blur-[160px]" />
        
        {/* Bottom right warm golden glow */}
        <div className="absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-[#9e7a2b]/15 rounded-full blur-[180px]" />
        
        {/* Bottom left warm glow */}
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-[#735518]/10 rounded-full blur-[160px]" />
      </div>

      {/* Top Header: Search, Contrast, Theme, Share & Language */}
      <header className="relative z-20 w-full max-w-6xl flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          <span className="text-white/80 font-bold">GUILHERME M. FERREIRA</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label={language === 'pt' ? 'Busca rápida (Ctrl+K)' : 'Quick search (Ctrl+K)'}
            title={language === 'pt' ? 'Buscar no portfólio (Ctrl+K)' : 'Search portfolio (Ctrl+K)'}
            className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 text-xs rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-white/80 hover:text-white transition-all shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline text-[11px]">{language === 'pt' ? 'Buscar' : 'Search'}</span>
            <kbd className="hidden md:inline text-[9px] px-1 py-0.2 bg-black/50 border border-white/10 rounded text-neutral-400 font-mono">
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
            className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 text-xs rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-white/80 hover:text-white transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline text-[11px] text-emerald-400 font-semibold">{language === 'pt' ? 'Copiado!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-neutral-300" />
                <span className="hidden md:inline text-[11px]">{language === 'pt' ? 'Compartilhar' : 'Share'}</span>
              </>
            )}
          </button>

          {/* Discreet Language Toggle (PT / EN) */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-neutral-900/90 border border-neutral-800/80 backdrop-blur-md shadow-sm">
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
          <span className="font-display-serif uppercase text-white tracking-tight font-normal text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem]">
            GUILHERME
          </span>
          <span className="font-display-serif italic text-gold-gradient font-normal text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem] my-0.5">
            MARQUES
          </span>
          <span className="font-display-serif uppercase text-white tracking-tight font-normal text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem]">
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
