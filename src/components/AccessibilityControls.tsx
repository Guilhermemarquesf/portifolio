import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Contrast, 
  Search, 
  ArrowUp, 
  Type, 
  Settings2, 
  X, 
  Check, 
  ZoomIn, 
  ZoomOut
} from 'lucide-react';
import { useAccessibility } from '../context/ThemeAccessibilityContext';
import { Language } from '../data/i18nData';

interface AccessibilityControlsProps {
  language: Language;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ language }) => {
  const {
    theme,
    toggleTheme,
    highContrast,
    toggleHighContrast,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    setIsSearchOpen,
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track scroll progress for the Back-to-Top circular indicator (rAF-throttled)
  useEffect(() => {
    let rafPending = false;

    const updateScroll = () => {
      rafPending = false;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = window.scrollY;
      const nextProgress =
        totalScroll > 0 ? Math.min(100, Math.round((currentProgress / totalScroll) * 100)) : 0;
      const nextShow = currentProgress > 300;

      setScrollProgress((prev) => (prev === nextProgress ? prev : nextProgress));
      setShowScrollTop((prev) => (prev === nextShow ? prev : nextShow));
    };

    const handleScroll = () => {
      if (!rafPending) {
        rafPending = true;
        window.requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const circumference = 2 * Math.PI * 16;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-16 sm:bottom-20 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5 select-none print:hidden">
      
      {/* Expanded Accessibility Menu */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={language === 'pt' ? 'Painel de Acessibilidade e Visualização' : 'Accessibility & Display Panel'}
          className="w-72 rounded-2xl bg-neutral-900 border border-neutral-700 p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 text-white"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {language === 'pt' ? 'Acessibilidade & Visual' : 'Accessibility & Display'}
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label={language === 'pt' ? 'Fechar painel' : 'Close panel'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Theme Toggle: Dark vs Light */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/40 border border-neutral-800">
              <div className="flex items-center gap-2 text-xs">
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span>{language === 'pt' ? 'Tema Escuro / Claro' : 'Dark / Light Theme'}</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  theme === 'light'
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
                title={language === 'pt' ? 'Alternar entre tema escuro e claro' : 'Toggle dark and light theme'}
              >
                {theme === 'light' ? (
                  <>
                    <Sun className="w-3 h-3" />
                    <span>{language === 'pt' ? 'Claro' : 'Light'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3" />
                    <span>{language === 'pt' ? 'Escuro' : 'Dark'}</span>
                  </>
                )}
              </button>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/40 border border-neutral-800">
              <div className="flex items-center gap-2 text-xs">
                <Contrast className="w-4 h-4 text-yellow-400 shrink-0" />
                <div>
                  <span className="block">{language === 'pt' ? 'Alto Contraste' : 'High Contrast'}</span>
                  <span className="text-[10px] text-neutral-400">WCAG AAA</span>
                </div>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  highContrast
                    ? 'bg-yellow-400 text-black font-bold shadow-md'
                    : 'bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
                title={language === 'pt' ? 'Ativar ou desativar modo de alto contraste' : 'Toggle high contrast mode'}
              >
                {highContrast && <Check className="w-3 h-3 stroke-[3]" />}
                <span>{highContrast ? (language === 'pt' ? 'Ativo' : 'On') : (language === 'pt' ? 'Desativado' : 'Off')}</span>
              </button>
            </div>

            {/* Font Size Scaling */}
            <div className="p-2 rounded-xl bg-black/40 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === 'pt' ? 'Tamanho do Texto' : 'Text Size'}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-neutral-400">
                  {fontSize === 'normal' ? '100%' : fontSize === 'large' ? '112%' : '125%'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  onClick={decreaseFontSize}
                  className={`py-1 text-xs rounded-md border text-center transition-colors flex items-center justify-center gap-1 ${
                    fontSize === 'normal'
                      ? 'bg-neutral-800 border-neutral-700 text-neutral-500 cursor-not-allowed'
                      : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-white'
                  }`}
                  title={language === 'pt' ? 'Diminuir fonte' : 'Decrease font'}
                >
                  <ZoomOut className="w-3 h-3" />
                  <span>A-</span>
                </button>
                <button
                  onClick={resetFontSize}
                  className={`py-1 text-xs rounded-md border text-center transition-colors ${
                    fontSize === 'normal'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-bold'
                      : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-white'
                  }`}
                  title={language === 'pt' ? 'Tamanho padrão' : 'Default font size'}
                >
                  Pad.
                </button>
                <button
                  onClick={increaseFontSize}
                  className={`py-1 text-xs rounded-md border text-center transition-colors flex items-center justify-center gap-1 ${
                    fontSize === 'larger'
                      ? 'bg-neutral-800 border-neutral-700 text-neutral-500 cursor-not-allowed'
                      : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-white'
                  }`}
                  title={language === 'pt' ? 'Aumentar fonte' : 'Increase font'}
                >
                  <ZoomIn className="w-3 h-3" />
                  <span>A+</span>
                </button>
              </div>
            </div>

            {/* Quick Search trigger button */}
            <button
              onClick={() => {
                setIsOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-white flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-400" />
                <span>{language === 'pt' ? 'Busca Rápida de Conteúdo' : 'Quick Content Search'}</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-neutral-900 border border-neutral-700 rounded text-neutral-400 font-mono">
                Ctrl+K
              </kbd>
            </button>
          </div>

          <div className="mt-3 pt-2 border-t border-neutral-800 text-[10px] text-neutral-500 flex items-center justify-between">
            <span>Guilherme M. Ferreira</span>
            <span>Atalhos: Alt+C / Alt+T</span>
          </div>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2">
        {/* Quick Search Floating Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          aria-label={language === 'pt' ? 'Abrir busca rápida (Ctrl+K)' : 'Open quick search (Ctrl+K)'}
          title={language === 'pt' ? 'Busca rápida (Ctrl+K)' : 'Quick search (Ctrl+K)'}
          className={`p-3 rounded-full border shadow-xl transition-all hover:scale-105 group ${
            theme === 'light'
              ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-md'
              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-white'
          }`}
        >
          <Search className={`w-4 h-4 transition-colors ${
            theme === 'light' ? 'text-slate-700 group-hover:text-amber-600' : 'text-neutral-300 group-hover:text-amber-400'
          }`} />
        </button>

        {/* Accessibility & Theme Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={language === 'pt' ? 'Acessibilidade e temas' : 'Accessibility and themes'}
          title={language === 'pt' ? 'Opções de acessibilidade, contraste e tema' : 'Accessibility, contrast and theme options'}
          className={`p-3 rounded-full border shadow-xl transition-all hover:scale-105 flex items-center justify-center relative ${
            highContrast
              ? 'bg-yellow-400 text-black border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.4)]'
              : theme === 'light'
              ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300 shadow-md'
              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-white'
          }`}
        >
          <Contrast className={`w-4 h-4 ${highContrast ? 'text-black' : ''}`} />
          {highContrast && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-black border border-yellow-300" />
          )}
        </button>

        {/* Scroll-To-Top Button with Circular Percentage Gauge */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label={language === 'pt' ? 'Voltar ao topo da página' : 'Back to top of page'}
            title={`${language === 'pt' ? 'Voltar ao topo' : 'Back to top'} (${scrollProgress}%)`}
            className={`relative p-3 rounded-full border shadow-xl transition-all hover:scale-105 flex items-center justify-center group ${
              theme === 'light'
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-md'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-white'
            }`}
          >
            {/* SVG Circular Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                className={theme === 'light' ? 'text-slate-200' : 'text-neutral-800'}
                strokeWidth="2.5"
                stroke="currentColor"
                fill="none"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                className="text-[#d4af37] transition-all duration-150"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
              />
            </svg>
            <ArrowUp className={`w-4 h-4 transition-colors relative z-10 ${
              theme === 'light' ? 'text-slate-700 group-hover:text-amber-600' : 'text-neutral-300 group-hover:text-amber-400'
            }`} />
          </button>
        )}
      </div>
    </div>
  );
};
