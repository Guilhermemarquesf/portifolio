import React from 'react';
import { ExperienceType } from '../types';
import { Language, I18N } from '../data/i18nData';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Instagram, 
  Home, 
  Award, 
  Terminal, 
  Trophy, 
  Infinity as InfinityIcon,
  ExternalLink
} from 'lucide-react';

interface GlobalFooterProps {
  currentExperience: ExperienceType;
  onNavigate: (exp: ExperienceType) => void;
  language: Language;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({
  currentExperience,
  onNavigate,
  language,
}) => {
  const currentYear = new Date().getFullYear();
  const t = I18N[language].globalFooter;

  const socialLinks = [
    {
      name: t.socials.github,
      href: 'https://github.com/Guilhermemarquesf',
      icon: Github,
      hoverClass: 'hover:text-white hover:border-white/30 hover:bg-white/5',
      ariaLabel: 'GitHub - Guilherme Marques Ferreira',
    },
    {
      name: t.socials.linkedin,
      href: 'https://www.linkedin.com/in/guilhermemarquesff/',
      icon: Linkedin,
      hoverClass: 'hover:text-[#0a66c2] hover:border-[#0a66c2]/40 hover:bg-[#0a66c2]/10',
      ariaLabel: 'LinkedIn - Guilherme Marques Ferreira',
    },
    {
      name: t.socials.email,
      href: 'mailto:guilhermemarquesf0@gmail.com',
      icon: Mail,
      hoverClass: 'hover:text-[#d4af37] hover:border-[#d4af37]/40 hover:bg-[#d4af37]/10',
      ariaLabel: 'Email - guilhermemarquesf0@gmail.com',
    },
    {
      name: t.socials.instagram,
      href: 'https://www.instagram.com/',
      icon: Instagram,
      hoverClass: 'hover:text-pink-400 hover:border-pink-400/40 hover:bg-pink-400/10',
      ariaLabel: 'Instagram - Guilherme Marques Ferreira',
    },
  ];

  const personas = [
    {
      id: 'home' as ExperienceType,
      label: t.home,
      icon: Home,
      activeColor: 'text-[#d4af37] border-[#d4af37]/40 bg-[#d4af37]/10',
    },
    {
      id: 'cavaleiro' as ExperienceType,
      label: t.cavaleiro,
      icon: Award,
      activeColor: 'text-[#d4af37] border-[#d4af37]/50 bg-[#d4af37]/15',
    },
    {
      id: 'dev' as ExperienceType,
      label: t.dev,
      icon: Terminal,
      activeColor: 'text-indigo-400 border-indigo-500/50 bg-indigo-500/15',
    },
    {
      id: 'jogador' as ExperienceType,
      label: t.jogador,
      icon: Trophy,
      activeColor: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/15',
    },
    {
      id: 'vida' as ExperienceType,
      label: t.vida,
      icon: InfinityIcon,
      activeColor: 'text-[#d4af37] border-[#d4af37]/50 bg-[#d4af37]/15',
    },
  ];

  return (
    <footer 
      role="contentinfo"
      aria-label="Rodapé global"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#050507]/95 border-t border-neutral-800/80 shadow-[0_-6px_25px_rgba(0,0,0,0.85)]"
    >
      {/* Subtle golden accent line at the top border */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
        
        {/* Left: Copyright & Branding */}
        <div className="flex items-center gap-2 text-neutral-400 shrink-0">
          <span className="font-medium text-white/90 tracking-wide text-[11px] sm:text-xs">
            © {currentYear} Guilherme M. Ferreira
          </span>
          <span className="hidden md:inline text-neutral-600">·</span>
          <span className="hidden md:inline text-[11px] text-neutral-500">
            {t.copyright}
          </span>
          <span className="hidden xl:inline text-neutral-600">·</span>
          <span className="hidden xl:inline text-[11px] text-neutral-500">
            {t.location}
          </span>
        </div>

        {/* Center: Consistent Final Navigation between all experiences */}
        <nav 
          aria-label="Navegação entre experiências" 
          className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-1 max-w-[50%] sm:max-w-none"
        >
          {personas.map((p) => {
            const Icon = p.icon;
            const isActive = currentExperience === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onNavigate(p.id)}
                title={p.label}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 border whitespace-nowrap ${
                  isActive
                    ? p.activeColor
                    : 'text-neutral-400 border-transparent hover:text-white hover:bg-white/5 hover:border-neutral-800'
                }`}
              >
                {p.id === 'cavaleiro' ? (
                  <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0 border border-[#d4af37]/80">
                    <img
                      src="/assets/aistudio/Captura_de_tela_2026-11-06_232524_c19dafd0.png"
                      alt="Haras GMF"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="hidden sm:inline">{p.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Social Media Links */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                title={social.name}
                className={`p-1.5 rounded-lg border border-neutral-800/80 bg-neutral-900/40 text-neutral-400 transition-all duration-200 ${social.hoverClass}`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            );
          })}
        </div>

      </div>
    </footer>
  );
};
