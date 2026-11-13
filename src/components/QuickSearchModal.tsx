import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Trophy,
  Terminal,
  Award,
  Infinity as InfinityIcon,
  ArrowRight,
  Image as ImageIcon,
  Box,
} from 'lucide-react';
import { ExperienceType } from '../types';
import { CAVALEIRO_DATA, JOGADOR_DATA, DEV_DATA } from '../data/portfolioData';
import { Language } from '../data/i18nData';
import { useAccessibility } from '../context/ThemeAccessibilityContext';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  experience: ExperienceType;
  sectionId?: string;
  studioExhibit?: 'cavalo' | 'trofeu' | 'ferradura' | 'nucleo';
  iconType: 'cavaleiro' | 'dev' | 'jogador' | 'vida' | 'photo' | 'studio';
  badge?: string;
}

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExperience: (exp: ExperienceType, sectionId?: string) => void;
  language: Language;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectExperience,
  language,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { open3DStudio } = useAccessibility();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveIndex(0);
      return;
    }
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = '';
      window.clearTimeout(focusTimer);
    };
  }, [isOpen]);

  // Index of searchable content across all personas
  const searchableIndex = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [
      {
        id: 'studio-3d-cavalo',
        title: 'Estúdio 3D — Cavalo Mangalarga Marchador',
        subtitle: 'Escultura 3D interativa em Three.js com acabamentos Castanho, Bronze e Ébano',
        category: 'Estúdio 3D Interativo',
        experience: 'cavaleiro',
        studioExhibit: 'cavalo',
        iconType: 'studio',
        badge: 'Three.js 3D',
      },
      {
        id: 'studio-3d-nucleo',
        title: 'Estúdio 3D — Núcleo Dev & Engenharia',
        subtitle: 'Visualizador 3D com vista explodida e iluminação de estúdio',
        category: 'Estúdio 3D Interativo',
        experience: 'dev',
        studioExhibit: 'nucleo',
        iconType: 'studio',
        badge: 'Three.js 3D',
      },
    ];

    // Cavaleiro items
    CAVALEIRO_DATA.achievements.forEach((ach) => {
      items.push({
        id: `cav-ach-${ach.id}`,
        title: ach.title,
        subtitle: `${ach.placement} · ${ach.competition} · ${ach.description}`,
        category: 'Conquistas & Títulos',
        experience: 'cavaleiro',
        sectionId: 'conquistas',
        iconType: 'cavaleiro',
        badge: 'Haras GMF',
      });
    });

    CAVALEIRO_DATA.gallery.forEach((photo) => {
      items.push({
        id: `cav-photo-${photo.id}`,
        title: photo.title,
        subtitle: `${photo.subtitle} (${photo.year}) — ${photo.location}`,
        category: 'Galeria do Cavaleiro',
        experience: 'cavaleiro',
        sectionId: 'galeria',
        iconType: 'photo',
        badge: photo.category,
      });
    });

    items.push({
      id: 'cav-mapa-circuito',
      title: 'Mapa Interativo de Pistas & Conquistas (Google Maps)',
      subtitle: 'Navegação por Haras Realidade Betim, Itaúna, Catas Altas, Mariana, Itabira e Arenas de Minas',
      category: 'Geolocalização & Pistas',
      experience: 'cavaleiro',
      sectionId: 'mapa',
      iconType: 'cavaleiro',
      badge: 'Google Maps',
    });

    // Jogador items
    JOGADOR_DATA.moments.forEach((mom) => {
      items.push({
        id: `jog-mom-${mom.id}`,
        title: mom.title,
        subtitle: `${mom.subtitle} · ${mom.stadiumOrPlace} · ${mom.description}`,
        category: 'Futebol & Galo',
        experience: 'jogador',
        sectionId: 'galo',
        iconType: 'jogador',
        badge: 'Atlético-MG',
      });
    });

    JOGADOR_DATA.gallery.forEach((photo) => {
      items.push({
        id: `jog-photo-${photo.id}`,
        title: photo.title,
        subtitle: `${photo.description} (${photo.year})`,
        category: 'Galeria do Jogador',
        experience: 'jogador',
        sectionId: 'galeria',
        iconType: 'photo',
        badge: photo.tag,
      });
    });

    // Developer items
    DEV_DATA.skills.forEach((skill) => {
      items.push({
        id: `dev-skill-${skill.name}`,
        title: skill.name,
        subtitle: `${skill.category} (${skill.level}) — ${skill.description}`,
        category: 'Tecnologia & Habilidades',
        experience: 'dev',
        sectionId: 'tecnologias',
        iconType: 'dev',
        badge: skill.category,
      });
    });

    DEV_DATA.projects.forEach((proj) => {
      items.push({
        id: `dev-proj-${proj.id}`,
        title: proj.title,
        subtitle: `${proj.description} · Tecnologias: ${proj.technologies.join(', ')}`,
        category: 'Projetos de Software',
        experience: 'dev',
        sectionId: 'projetos',
        iconType: 'dev',
        badge: proj.category,
      });
    });

    DEV_DATA.timeline.forEach((milestone) => {
      items.push({
        id: `dev-time-${milestone.year}`,
        title: `${milestone.year} — ${milestone.title}`,
        subtitle: `${milestone.subtitle} · ${milestone.description}`,
        category: 'Evolução & Formação',
        experience: 'dev',
        sectionId: 'evolucao',
        iconType: 'dev',
        badge: 'PUC Minas Betim',
      });
    });

    // Minha Vida items
    items.push({
      id: 'vida-manifesto',
      title: 'Minha Vida: Trajetória, Família & Fé',
      subtitle: 'O elo entre o código, o campo e as pistas. Salmos 37:5 e a bênção de Deus em cada conquista.',
      category: 'Biografia & Filosofia',
      experience: 'vida',
      sectionId: 'biografia',
      iconType: 'vida',
      badge: 'Minha Vida',
    });

    return items;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return searchableIndex.slice(0, 8);
    }
    return searchableIndex
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.badge && item.badge.toLowerCase().includes(q))
        );
      })
      .slice(0, 15);
  }, [query, searchableIndex]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    if (item.studioExhibit) {
      open3DStudio(item.studioExhibit);
      return;
    }
    onSelectExperience(item.experience, item.sectionId);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown' && results.length > 0) {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp' && results.length > 0) {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        const chosen = results[activeIndex] || results[0];
        if (chosen) handleSelect(chosen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, results, activeIndex]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!isOpen) return null;

  const getIcon = (type: SearchResultItem['iconType']) => {
    switch (type) {
      case 'cavaleiro':
        return <Award className="w-4 h-4 text-[#d4af37]" />;
      case 'jogador':
        return <Trophy className="w-4 h-4 text-emerald-400" />;
      case 'dev':
        return <Terminal className="w-4 h-4 text-indigo-400" />;
      case 'vida':
        return <InfinityIcon className="w-4 h-4 text-[#d4af37]" />;
      case 'photo':
        return <ImageIcon className="w-4 h-4 text-amber-300" />;
      case 'studio':
        return <Box className="w-4 h-4 text-[#d4af37]" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-neutral-800 bg-black/50">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'pt'
                ? 'Buscar conquistas, fotos, Cavalo 3D, Haras GMF, Galo, C#, PUC...'
                : 'Search achievements, photos, 3D Horse, Haras GMF, Galo, C#, PUC...'
            }
            className="w-full bg-transparent text-white text-sm sm:text-base placeholder-neutral-500 focus:outline-none"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-800 rounded border border-neutral-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 sm:p-3 divide-y divide-neutral-800/60"
        >
          {results.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>{language === 'pt' ? 'Nenhum resultado encontrado para sua busca.' : 'No results found for your search.'}</p>
              <p className="text-xs text-neutral-600 mt-1">
                {language === 'pt' ? 'Tente buscar por "Cavalo 3D", "Haras", "Copa", "Galo" ou "C#".' : 'Try searching for "3D Horse", "Haras", "Copa", "Galo" or "C#".'}
              </p>
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  data-idx={idx}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-3 group ${
                    isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-black/60 border border-neutral-800 shrink-0 mt-0.5">
                      {getIcon(item.iconType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          {item.category}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <h4
                        className={`text-sm font-semibold transition-colors truncate ${
                          isSelected ? 'text-amber-400' : 'text-white group-hover:text-amber-400'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-neutral-500 group-hover:text-white transition-colors shrink-0 self-center">
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-2.5 bg-black/60 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-[10px] text-neutral-300 font-mono">
                ↑↓
              </kbd>{' '}
              {language === 'pt' ? 'navegar' : 'select'}
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-[10px] text-neutral-300 font-mono">
                Enter
              </kbd>{' '}
              {language === 'pt' ? 'para ir' : 'to navigate'}
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-[10px] text-neutral-300 font-mono">
                Esc
              </kbd>{' '}
              {language === 'pt' ? 'para fechar' : 'to close'}
            </span>
          </div>
          <span className="text-neutral-400 font-medium">
            {results.length} {language === 'pt' ? 'resultados' : 'results'}
          </span>
        </div>
      </div>
    </div>
  );
};
