import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Trophy, Terminal, Award, Infinity as InfinityIcon, ArrowRight, Image as ImageIcon, MapPin, Calendar, Mic, MicOff, Loader2 } from 'lucide-react';
import { ExperienceType } from '../types';
import { CAVALEIRO_DATA, JOGADOR_DATA, DEV_DATA } from '../data/portfolioData';
import { Language } from '../data/i18nData';
import { useAudioTranscription } from '../hooks/useAudioTranscription';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  experience: ExperienceType;
  sectionId?: string;
  iconType: 'cavaleiro' | 'dev' | 'jogador' | 'vida' | 'photo';
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
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    error: transcriptionError,
    isPermissionDenied,
    resetError,
  } = useAudioTranscription();

  const handleToggleVoiceSearch = async () => {
    if (isRecording) {
      const text = await stopRecording();
      if (text) {
        setQuery(text);
      }
    } else {
      await startRecording();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      resetError();
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      resetError();
    }
  }, [isOpen, resetError]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Index of searchable content across all personas
  const searchableIndex = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

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
      sectionId: 'historia',
      iconType: 'vida',
      badge: 'Minha Vida',
    });

    return items;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Return top featured highlights when query is empty
      return searchableIndex.slice(0, 8);
    }
    return searchableIndex.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q))
      );
    }).slice(0, 15);
  }, [query, searchableIndex]);

  if (!isOpen) return null;

  const handleSelect = (item: SearchResultItem) => {
    onSelectExperience(item.experience, item.sectionId);
    onClose();
  };

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
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-neutral-800 bg-black/40">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isRecording
                ? (language === 'pt' ? '🎙️ Gravando... Fale o que procura e clique no microfone para parar' : '🎙️ Recording... Speak now and click microphone to stop')
                : isTranscribing
                ? (language === 'pt' ? '⚡ Transcrevendo áudio com Gemini 3.5 Transcribe...' : '⚡ Transcribing audio with Gemini 3.5 Transcribe...')
                : language === 'pt'
                ? 'Buscar conquistas, fotos, Haras GMF, Galo, projetos, C#, PUC...'
                : 'Search achievements, photos, Haras GMF, Galo, projects, C#, PUC...'
            }
            className={`w-full bg-transparent text-white text-sm sm:text-base placeholder-neutral-500 focus:outline-none ${
              isRecording ? 'text-rose-400 placeholder-rose-400/80 animate-pulse' : ''
            }`}
          />

          {/* Voice Search with Gemini 3.5 Transcribe */}
          <button
            type="button"
            onClick={handleToggleVoiceSearch}
            disabled={isTranscribing}
            className={`p-1.5 rounded-lg border transition-all flex items-center justify-center shrink-0 ${
              isRecording
                ? 'bg-rose-600 border-rose-500 text-white animate-pulse shadow-[0_0_12px_rgba(225,29,72,0.6)]'
                : isTranscribing
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 cursor-wait'
                : 'bg-neutral-800/80 hover:bg-neutral-700 border-neutral-700 text-neutral-300 hover:text-white'
            }`}
            title={
              isRecording
                ? 'Parar gravação e transcrever com Gemini'
                : 'Pesquisa por Voz (Gemini 3.5 Transcribe)'
            }
            aria-label="Pesquisa por Voz"
          >
            {isTranscribing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

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

        {/* Transcription Error Banner if any */}
        {transcriptionError && (
          <div className="px-4 py-2 bg-amber-950/70 border-b border-amber-800 text-xs text-amber-200 flex items-center justify-between gap-2">
            <span>
              {isPermissionDenied
                ? 'Microfone bloqueado: libere a permissão no ícone de cadeado do navegador.'
                : transcriptionError}
            </span>
            <button
              onClick={resetError}
              className="px-2 py-0.5 rounded text-[10px] bg-white/10 hover:bg-white/20 text-white shrink-0"
            >
              OK
            </button>
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 divide-y divide-neutral-800/60">
          {results.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>{language === 'pt' ? 'Nenhum resultado encontrado para sua busca.' : 'No results found for your search.'}</p>
              <p className="text-xs text-neutral-600 mt-1">
                {language === 'pt' ? 'Tente buscar por "Haras", "Copa", "Galo", "PUC" ou "C#".' : 'Try searching for "Haras", "Copa", "Galo", "PUC" or "C#".'}
              </p>
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all flex items-start justify-between gap-3 group"
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
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors truncate">
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
            ))
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-2.5 bg-black/60 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
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
            {results.length} {language === 'pt' ? 'resultados disponíveis' : 'results found'}
          </span>
        </div>
      </div>
    </div>
  );
};
