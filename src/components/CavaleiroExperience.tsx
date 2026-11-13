import React, { useState } from 'react';
import { CAVALEIRO_DATA, IMAGES } from '../data/portfolioData';
import { EquestrianPhoto, ExperienceType } from '../types';
import { ExperienceNav } from './ExperienceNav';
import { ImageWithFallback } from './ImageWithFallback';
import { MediaLightboxModal } from './MediaLightboxModal';
import { PhotoUploaderModal } from './PhotoUploaderModal';
import {
  Award,
  Crown,
  Trophy,
  Compass,
  Maximize2,
  PlusCircle,
  Shield,
  HeartHandshake,
  Sparkles,
  ChevronRight,
  Quote,
  Medal,
  MapPin,
  Calendar,
  Star,
  LayoutGrid,
  ListOrdered,
  Box,
} from 'lucide-react';

import { Language, I18N } from '../data/i18nData';
import { InteractiveCircuitMap } from './InteractiveCircuitMap';
import { useAccessibility } from '../context/ThemeAccessibilityContext';

interface CavaleiroExperienceProps {
  onNavigate: (exp: ExperienceType) => void;
  language?: Language;
  onToggleLanguage?: (lang: Language) => void;
}

export const CavaleiroExperience: React.FC<CavaleiroExperienceProps> = ({
  onNavigate,
  language = 'pt',
  onToggleLanguage,
}) => {
  const t = I18N[language].cavaleiro;
  const { open3DStudio } = useAccessibility();
  const [gallery, setGallery] = useState<EquestrianPhoto[]>(CAVALEIRO_DATA.gallery);
  const [activePhoto, setActivePhoto] = useState<EquestrianPhoto | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'Marchador' | 'Competições' | 'Haras GMF'>('all');
  const [achievementFilter, setAchievementFilter] = useState<'todos' | 'destaques' | 'copas' | 'trofeus'>('todos');
  const [achievementView, setAchievementView] = useState<'grade' | 'cronologia'>('grade');

  const navSections = [
    { id: 'historia', label: t.nav.historia },
    { id: 'conquistas', label: t.nav.conquistas },
    { id: 'competicoes', label: t.nav.competicoes },
    { id: 'mapa', label: language === 'pt' ? 'Mapa do Circuito' : 'Circuit Map' },
    { id: 'citacoes', label: (t.nav as any).citacoes || (language === 'pt' ? 'Citações Criadoras' : 'Breeder Quotes') },
    { id: 'haras', label: t.nav.haras },
    { id: 'galeria', label: t.nav.galeria },
    { id: 'paixao', label: t.nav.paixao },
  ];

  const categories: { id: 'all' | 'Marchador' | 'Competições' | 'Haras GMF'; label: string }[] = [
    { id: 'all', label: language === 'pt' ? 'Todos' : 'All' },
    { id: 'Marchador', label: 'Marchador' },
    { id: 'Competições', label: language === 'pt' ? 'Competições' : 'Competitions' },
    { id: 'Haras GMF', label: 'Haras GMF' },
  ];

  const filteredGallery = filterCategory === 'all'
    ? gallery
    : gallery.filter((p) => p.category === filterCategory);

  const lightboxGallery =
    activePhoto && filteredGallery.some((p) => p.id === activePhoto.id)
      ? filteredGallery
      : gallery;

  const handleAddCustomPhoto = (newPhoto: {
    id: string;
    url: string;
    title: string;
    subtitle: string;
    category: string;
    year: string;
    location: string;
  }) => {
    setGallery((prev) => [
      {
        ...newPhoto,
        category: newPhoto.category as any,
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-[#110c08] text-[#f7f2ea] font-sans selection:bg-[#c59b27] selection:text-black">
      
      {/* Top Bar Navigation */}
      <ExperienceNav
        currentExperience="cavaleiro"
        onNavigate={onNavigate}
        sections={navSections}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      {/* Hero / Minha História Section */}
      <section id="historia" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-[#382618]">
        
        {/* Ambient warm amber glow (zero-blur CSS radial gradients) */}
        <div className="absolute top-10 left-1/4 w-[540px] h-[540px] bg-[radial-gradient(circle_at_center,rgba(197,155,39,0.10)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[420px] h-[420px] bg-[radial-gradient(circle_at_center,rgba(140,88,37,0.14)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header kicker with Haras GMF official emblem */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="relative group/logo">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#d4af37] p-0.5 bg-black/90 shadow-[0_0_22px_rgba(212,175,55,0.4)] shrink-0 overflow-hidden transition-transform duration-300 group-hover/logo:scale-105">
                <img
                  src={IMAGES.harasGmfLogo}
                  alt="Haras GMF - Santa Bárbara MG"
                  className="w-full h-full object-contain p-0.5 rounded-full"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1b120a] border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
                <Crown className="w-3 h-3" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-[1px] w-6 bg-[#c59b27]" />
                <span className="text-xs uppercase tracking-widest font-serif-luxury font-semibold text-[#d4af37]">
                  {t.hero.kicker}
                </span>
              </div>
              <p className="text-xs text-[#cfc2b2] font-serif-luxury tracking-wide mt-0.5">
                Haras GMF · Santa Bárbara - MG
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Story & Identity */}
            <div className="lg:col-span-6 space-y-6">
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-normal text-white leading-[1.15] tracking-tight">
                {t.hero.titlePart1} <span className="italic text-[#d4af37]">{t.hero.titlePart2}</span>
              </h1>

              <p className="text-base sm:text-lg text-[#dfd5c7] leading-relaxed font-light">
                {t.hero.bio}
              </p>

              {/* Distinction highlights */}
              <div className="pt-2 border-t border-[#382618] grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-[#d4af37]/70 overflow-hidden shrink-0 shadow-sm bg-black">
                    <img
                      src={IMAGES.harasGmfLogo}
                      alt="Haras GMF"
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-[#a89584] font-serif-luxury">{t.hero.creationLabel}</span>
                    <span className="text-sm font-semibold text-[#f7f2ea]">{t.hero.creationName}</span>
                  </div>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#a89584] font-serif-luxury">{t.hero.philosophyLabel}</span>
                  <span className="text-sm font-semibold text-[#f7f2ea]">{t.hero.philosophyName}</span>
                </div>
              </div>

              {/* Call to action */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#conquistas"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('conquistas')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-lg bg-[#c59b27] hover:bg-[#b38a1e] text-black text-xs uppercase tracking-wider font-bold transition-all shadow-lg shadow-[#c59b27]/20 flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  <span>{t.hero.btnTrophies}</span>
                </a>
                <a
                  href="#galeria"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('galeria')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-lg bg-[#1f150e] hover:bg-[#2c1e14] border border-[#4d3623] text-[#f7f2ea] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
                >
                  <Crown className="w-4 h-4 text-[#d4af37]" />
                  <span>{t.hero.btnGallery}</span>
                </a>
                <button
                  onClick={() => open3DStudio('cavalo')}
                  className="px-5 py-3 rounded-lg bg-[#25180e] hover:bg-[#342213] border border-[#d4af37]/50 text-[#f3dfb0] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
                >
                  <Box className="w-4 h-4 text-[#d4af37]" />
                  <span>{language === 'pt' ? 'Cavalo & Troféu 3D' : '3D Horse & Trophy'}</span>
                </button>
              </div>

            </div>

            {/* Right Column: Large Focal Photography */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-[#4d3623] shadow-2xl group cursor-pointer bg-black/95"
                   onClick={() => setActivePhoto(CAVALEIRO_DATA.gallery[0])}>
                
                <div className="h-[420px] sm:h-[480px] w-full flex items-center justify-center p-3">
                  <ImageWithFallback
                    src={IMAGES.horseMarchador}
                    alt="Mangalarga Marchador em movimento"
                    domainTheme="equestrian"
                    objectFit="contain"
                    priority
                    className="w-full h-full max-h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between photo-caption-overlay">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#d4af37] font-serif-luxury">
                      {t.hero.photoTag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white mt-1 tracking-wide flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#d4af37] shrink-0" />
                      <span>{t.hero.photoTitle}</span>
                    </h3>
                    <p className="text-xs text-[#d1c4b2] mt-0.5">
                      {t.hero.photoSub}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-full bg-black/60 border border-[#d4af37]/40 text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Full-width Stat Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl bg-[#1b120a] border border-[#3f2b1b]">
            {t.stats.map((stat, idx) => (
              <div key={idx} className="text-center sm:text-left px-2">
                <span className="block text-3xl sm:text-4xl font-serif-luxury font-bold text-[#d4af37] tabular-nums">
                  {stat.value}
                </span>
                <span className="block text-sm font-semibold text-white mt-1">
                  {stat.label}
                </span>
                <span className="block text-xs text-[#a38f7d] mt-0.5">
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Conquistas e Cronologia de Destaques Section */}
      <section id="conquistas" className="py-20 border-b border-[#382618] bg-gradient-to-b from-[#140e09] via-[#160f0a] to-[#120c08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22160d] border border-[#d4af37]/40 mb-3">
                <Trophy className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="text-xs uppercase tracking-widest font-serif-luxury font-semibold text-[#d4af37]">
                  Trajetória & Títulos de Pista
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-white tracking-tight">
                Conquistas & Cronologia de Destaques
              </h2>
              <p className="text-sm sm:text-base text-[#c4b5a3] mt-2.5 font-light leading-relaxed">
                Marcos históricos, títulos de campeão, troféus ferradura e rosetas oficiais conquistadas pelo circuito de Minas Gerais e nas maiores exposições do Mangalarga Marchador.
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2 p-1 bg-[#1a120b] border border-[#3f2b1b] rounded-xl self-start md:self-auto shadow-inner">
              <button
                onClick={() => setAchievementView('grade')}
                className={`px-3.5 py-2 rounded-lg text-xs font-serif-luxury font-medium transition-all flex items-center gap-2 ${
                  achievementView === 'grade'
                    ? 'bg-[#c59b27] text-black font-bold shadow-md'
                    : 'text-[#a38f7d] hover:text-white'
                }`}
                title="Exibir em Grade Elegante"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grade Elegante</span>
              </button>
              <button
                onClick={() => setAchievementView('cronologia')}
                className={`px-3.5 py-2 rounded-lg text-xs font-serif-luxury font-medium transition-all flex items-center gap-2 ${
                  achievementView === 'cronologia'
                    ? 'bg-[#c59b27] text-black font-bold shadow-md'
                    : 'text-[#a38f7d] hover:text-white'
                }`}
                title="Exibir em Cronologia de Pista"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Cronologia de Pista</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2.5 mb-10 pb-4 border-b border-[#2d1d12]">
            {[
              { id: 'todos', label: 'Todas as Conquistas', count: CAVALEIRO_DATA.achievements.length },
              { id: 'destaques', label: 'Nacionais & Destaques', count: CAVALEIRO_DATA.achievements.filter(a => a.highlight).length },
              { id: 'copas', label: 'Copas de Marcha em MG', count: CAVALEIRO_DATA.achievements.filter(a => a.competition.toLowerCase().includes('copa') || a.competition.toLowerCase().includes('festa') || a.competition.toLowerCase().includes('poeirão')).length },
              { id: 'trofeus', label: 'Troféus de Ouro & Faixas', count: CAVALEIRO_DATA.achievements.filter(a => a.awardType?.toLowerCase().includes('troféu') || a.placement.toLowerCase().includes('campeão') || a.placement.toLowerCase().includes('1º')).length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAchievementFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-serif-luxury transition-all flex items-center gap-2 border ${
                  achievementFilter === tab.id
                    ? 'bg-[#291b10] border-[#d4af37] text-[#d4af37] font-bold shadow-sm'
                    : 'bg-[#150f09] border-[#362417] text-[#9c8978] hover:text-[#f0e6d8] hover:border-[#523924]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  achievementFilter === tab.id ? 'bg-[#d4af37] text-black font-bold' : 'bg-black/40 text-[#a38f7d]'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* VIEW MODE 1: GRADE ELEGANTE */}
          {achievementView === 'grade' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CAVALEIRO_DATA.achievements
                .filter((item) => {
                  if (achievementFilter === 'destaques') return item.highlight;
                  if (achievementFilter === 'copas') {
                    return item.competition.toLowerCase().includes('copa') ||
                           item.competition.toLowerCase().includes('festa') ||
                           item.competition.toLowerCase().includes('poeirão');
                  }
                  if (achievementFilter === 'trofeus') {
                    return item.awardType?.toLowerCase().includes('troféu') ||
                           item.placement.toLowerCase().includes('campeão') ||
                           item.placement.toLowerCase().includes('1º');
                  }
                  return true;
                })
                .map((item) => {
                  const isTopWinner = item.placement.includes('Campeão') || item.placement.includes('Top') || item.placement.includes('1º');
                  const isSecond = item.placement.includes('Reservado') || item.placement.includes('2º');

                  return (
                    <div
                      key={item.id}
                      className={`group p-6 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between hover:-translate-y-1 ${
                        item.highlight
                          ? 'bg-gradient-to-b from-[#21160e] to-[#18100a] border-[#6b4c2e] hover:border-[#d4af37] shadow-xl shadow-black/50'
                          : 'bg-[#160f09] border-[#382618] hover:border-[#805933] shadow-lg'
                      }`}
                    >
                      <div>
                        {/* Top Header: Badge & Year/Stage */}
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg border flex items-center justify-center ${
                              isTopWinner
                                ? 'bg-[#2b1c11] border-[#d4af37]/60 text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                                : isSecond
                                ? 'bg-[#1f1915] border-neutral-400/50 text-neutral-200'
                                : 'bg-[#21160d] border-amber-700/50 text-amber-500'
                            }`}>
                              {isTopWinner ? <Trophy className="w-4 h-4" /> : <Medal className="w-4 h-4" />}
                            </div>
                            <div>
                              <span className={`block text-xs uppercase tracking-wider font-serif-luxury font-bold ${
                                isTopWinner ? 'text-[#d4af37]' : isSecond ? 'text-neutral-200' : 'text-amber-400'
                              }`}>
                                {item.placement}
                              </span>
                              <span className="text-[10px] text-[#a38f7d] uppercase tracking-wide">
                                {item.category}
                              </span>
                            </div>
                          </div>

                          <span className="text-[11px] font-serif-luxury text-[#e8dcce] px-2.5 py-0.5 rounded bg-black/50 border border-[#3f2b1b] shrink-0">
                            {item.year}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-serif-luxury font-bold text-white mb-2 leading-snug tracking-wide group-hover:text-[#d4af37] transition-colors flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[#d4af37] shrink-0" />
                          <span>{item.title}</span>
                        </h3>

                        {/* Award chip */}
                        {item.awardType && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#24170d] border border-[#523823] text-[11px] text-[#dfd4c5] font-serif-luxury mb-3">
                            <Star className="w-3 h-3 text-[#d4af37]" />
                            <span>{item.awardType}</span>
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-xs sm:text-[13px] text-[#cfc2b2] leading-relaxed font-light mb-4">
                          {item.description}
                        </p>
                      </div>

                      {/* Footer: Location & Competition */}
                      <div className="pt-3.5 border-t border-[#2e1f13] flex items-center justify-between text-xs text-[#a38f7d]">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#c2b2a1]">
                          <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
                          <span>{item.location || item.competition}</span>
                        </div>
                        <span className="text-[10px] text-[#d4af37] font-serif-luxury font-medium uppercase tracking-wider">
                          Mangalarga Marchador
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* VIEW MODE 2: CRONOLOGIA DE PISTA */}
          {achievementView === 'cronologia' && (
            <div className="relative pl-6 md:pl-10 border-l-2 border-[#d4af37]/40 space-y-10 py-4 max-w-4xl mx-auto">
              {CAVALEIRO_DATA.achievements
                .filter((item) => {
                  if (achievementFilter === 'destaques') return item.highlight;
                  if (achievementFilter === 'copas') {
                    return item.competition.toLowerCase().includes('copa') ||
                           item.competition.toLowerCase().includes('festa') ||
                           item.competition.toLowerCase().includes('poeirão');
                  }
                  if (achievementFilter === 'trofeus') {
                    return item.awardType?.toLowerCase().includes('troféu') ||
                           item.placement.toLowerCase().includes('campeão') ||
                           item.placement.toLowerCase().includes('1º');
                  }
                  return true;
                })
                .map((item, idx) => (
                  <div key={item.id} className="relative group">
                    {/* Glowing Axis Node Dot */}
                    <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-5 h-5 rounded-full bg-[#1b120a] border-2 border-[#d4af37] flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.6)] group-hover:scale-125 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
                    </div>

                    <div className="p-6 sm:p-7 rounded-2xl bg-[#170f09] border border-[#3b281a] hover:border-[#d4af37]/70 transition-all duration-300 shadow-xl">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase font-serif-luxury font-bold text-[#d4af37] px-2.5 py-0.5 rounded bg-[#2b1c11] border border-[#d4af37]/40">
                            {item.placement}
                          </span>
                          <span className="text-xs text-[#a38f7d]">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#d1c4b2]">
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                              {item.location}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-black/40 border border-[#3f2b1b] text-[11px] font-serif-luxury">
                            {item.year}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-serif-luxury font-bold text-white mb-2 leading-snug tracking-wide group-hover:text-[#d4af37] transition-colors flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#d4af37] shrink-0" />
                        <span>{item.title}</span>
                      </h3>

                      {item.awardType && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#24170d] border border-[#523823] text-xs text-[#e8dcce] font-serif-luxury mb-3">
                          <Trophy className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>{item.awardType}</span>
                        </div>
                      )}

                      <p className="text-sm text-[#cfc2b2] leading-relaxed font-light">
                        {item.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[#2e1f13] flex items-center justify-between text-xs text-[#8c7a6a]">
                        <span>{item.competition}</span>
                        <span className="text-[#d4af37] font-serif-luxury">Haras GMF · Santa Bárbara - MG</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

        </div>
      </section>

      {/* Competições e Pistas de Prova */}
      <section id="competicoes" className="py-20 border-b border-[#382618]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs uppercase tracking-widest font-serif-luxury font-semibold text-[#d4af37]">
                {t.competicoesSection.kicker}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white">
                {t.competicoesSection.title}
              </h2>
              <p className="text-sm text-[#cfc2b2] leading-relaxed font-light">
                {t.competicoesSection.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-4 rounded-xl bg-[#1b120a] border border-[#3f2b1b] hover:border-[#63452b] transition-colors">
                  <h4 className="text-sm font-semibold text-[#d4af37] font-serif-luxury">
                    {t.competicoesSection.box1Title}
                  </h4>
                  <p className="text-xs text-[#a38f7d] mt-1 leading-relaxed">
                    {t.competicoesSection.box1Desc}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#1b120a] border border-[#3f2b1b] hover:border-[#63452b] transition-colors">
                  <h4 className="text-sm font-semibold text-[#d4af37] font-serif-luxury">
                    {t.competicoesSection.box2Title}
                  </h4>
                  <p className="text-xs text-[#a38f7d] mt-1 leading-relaxed">
                    {t.competicoesSection.box2Desc}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#1b120a] border border-[#3f2b1b] hover:border-[#63452b] transition-colors">
                  <h4 className="text-sm font-semibold text-[#d4af37] font-serif-luxury">
                    {t.competicoesSection.box3Title}
                  </h4>
                  <p className="text-xs text-[#a38f7d] mt-1 leading-relaxed">
                    {t.competicoesSection.box3Desc}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#1b120a] border border-[#3f2b1b] hover:border-[#63452b] transition-colors">
                  <h4 className="text-sm font-semibold text-[#d4af37] font-serif-luxury">
                    {t.competicoesSection.box4Title}
                  </h4>
                  <p className="text-xs text-[#a38f7d] mt-1 leading-relaxed">
                    {t.competicoesSection.box4Desc}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-[#4d3623] shadow-2xl relative bg-black/95">
                <div className="h-80 sm:h-[460px] w-full flex items-center justify-center p-3">
                  <ImageWithFallback
                    src={IMAGES.equestrianTrophies}
                    alt="Faixas, troféus e rosetas de campeão"
                    domainTheme="equestrian"
                    objectFit="contain"
                    className="w-full h-full max-h-full"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 photo-caption-overlay">
                  <span className="text-xs text-[#d4af37] font-serif-luxury uppercase tracking-wider">
                    {t.competicoesSection.cardTag}
                  </span>
                  <h3 className="text-xl font-serif-luxury font-bold text-white mt-1 tracking-wide flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#d4af37] shrink-0" />
                    <span>{t.competicoesSection.cardTitle}</span>
                  </h3>
                  <p className="text-xs text-[#d1c4b2] mt-1">
                    {t.competicoesSection.cardSub}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive Google Map of Minas Gerais Circuit & Haras */}
      <InteractiveCircuitMap language={language} />

      {/* Citações Criadoras & Filosofia de Seleção */}
      <section id="citacoes" className="py-20 border-b border-[#382618] relative overflow-hidden bg-gradient-to-b from-[#110c08] via-[#160f0a] to-[#110c08]">
        {/* Subtle decorative background light (zero-blur CSS radial gradient) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[340px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e140c] border border-[#d4af37]/40 mb-3">
              <Quote className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-xs uppercase tracking-widest font-serif-luxury font-semibold text-[#d4af37]">
                Sabedoria & Filosofia de Sela
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-white tracking-tight">
              Citações Criadoras
            </h2>
            <p className="text-sm sm:text-base text-[#cfc2b2] mt-3 font-light leading-relaxed">
              Ensinamentos de criadores, preceitos da raça Mangalarga Marchador e os pilares de fé e paciência que guiam o dia a dia no Haras GMF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CAVALEIRO_DATA.breederQuotes.map((item, idx) => (
              <div
                key={idx}
                className="group relative p-7 sm:p-8 rounded-2xl bg-[#18110b] border border-[#3d2c1d] hover:border-[#d4af37]/60 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                {/* Gold Quote badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#24170d] border border-[#523823] flex items-center justify-center text-[#d4af37] group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-black transition-all">
                    <Quote className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] uppercase tracking-wider font-serif-luxury font-semibold text-[#a89584] group-hover:text-[#d4af37] transition-colors">
                    {item.role}
                  </span>
                </div>

                <blockquote className="text-base sm:text-lg font-serif-luxury italic text-[#f7f2ea] leading-relaxed mb-6 group-hover:text-white transition-colors">
                  {item.quote}
                </blockquote>

                <div className="pt-4 border-t border-[#2e1f13] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                    <span className="text-xs font-semibold text-[#f0e6d8] font-serif-luxury">
                      {item.author}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8f7d6d] italic font-serif-luxury">
                    Haras GMF · MM
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Haras GMF */}
      <section id="haras" className="py-20 border-b border-[#382618] bg-[#140e09]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            {/* Brasão Oficial Haras GMF */}
            <div className="inline-block relative mb-6">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-[#d4af37] p-1 bg-black shadow-[0_0_35px_rgba(212,175,55,0.4)] mx-auto overflow-hidden transition-transform duration-300 hover:scale-105">
                <img
                  src={IMAGES.harasGmfLogo}
                  alt="Logo Haras GMF - Santa Bárbara MG"
                  className="w-full h-full object-contain p-1 rounded-full"
                />
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#1b120a] border border-[#d4af37]/80 text-[#d4af37] text-[10px] sm:text-xs font-serif-luxury uppercase tracking-widest px-3.5 py-0.5 rounded-full whitespace-nowrap shadow-lg">
                Santa Bárbara · MG
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest font-serif-luxury font-semibold text-[#d4af37]">
                {t.harasSection.kicker}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white mt-1">
                {t.harasSection.title}
              </h2>
              <p className="text-sm text-[#cfc2b2] mt-2 font-light">
                {t.harasSection.subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAVALEIRO_DATA.pillars.map((pillar, i) => (
              <div
                key={i}
                className="p-7 rounded-2xl bg-[#1b120a] border border-[#3f2b1b] hover:border-[#63452b] transition-all flex flex-col justify-between"
              >
                <div>
                  {i === 1 ? (
                    <div className="w-11 h-11 rounded-full border border-[#d4af37]/70 overflow-hidden shadow-sm mb-4 bg-black">
                      <img
                        src={IMAGES.harasGmfLogo}
                        alt="Haras GMF"
                        className="w-full h-full object-contain p-0.5"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#2a1c10] border border-[#543b25] flex items-center justify-center text-[#d4af37] mb-4">
                      <Shield className="w-5 h-5" />
                    </div>
                  )}
                  <h3 className="text-lg font-serif-luxury font-bold text-white mb-2 tracking-wide flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span>{pillar.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#c7b9a7] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-[#2e1f13] flex items-center text-xs text-[#d4af37] font-serif-luxury">
                  <span>Tradição & Excelência</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Galeria de Fotografias (Com Lightbox e Uploader para Fotos Pessoais) */}
      <section id="galeria" className="py-20 border-b border-[#382618]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-serif-luxury font-semibold text-[#d4af37]">
                Memórias & Registros Visuais
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white mt-1">
                Galeria de Fotografias
              </h2>
              <p className="text-sm text-[#cfc2b2] mt-2 max-w-xl font-light">
                Momentos em pista, premiações e a vida no haras. Clique em qualquer foto para ampliá-la em alta resolução ou adicione novos registros.
              </p>
            </div>

            {/* Actions: Add Photo & Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 rounded-lg bg-[#c59b27] hover:bg-[#b38a1e] text-black text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Adicionar Minha Foto</span>
              </button>

              <div className="flex items-center gap-1 p-1 bg-[#1a120b] border border-[#3f2b1b] rounded-lg flex-wrap">
                {categories.map((cat) => {
                  const count = cat.id === 'all'
                    ? gallery.length
                    : gallery.filter((p) => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setFilterCategory(cat.id)}
                      className={`px-3 py-1.5 text-xs font-serif-luxury rounded-md transition-colors flex items-center gap-1.5 ${
                        filterCategory === cat.id
                          ? 'bg-[#c59b27] text-black font-semibold shadow-sm'
                          : 'text-[#a38f7d] hover:text-white'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        filterCategory === cat.id ? 'bg-black/20 text-black font-bold' : 'bg-black/40 text-[#c7b9a7]'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Photo Grid - Centered & Uncropped letterboxed frames */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative rounded-2xl overflow-hidden border border-[#402c1d] bg-[#0d0906] cursor-pointer shadow-lg hover:border-[#c59b27]/70 transition-all duration-300 flex flex-col"
              >
                {/* Centered Image Container - 100% visible, no crop */}
                <div className="h-72 sm:h-80 w-full bg-black/95 flex items-center justify-center p-3 overflow-hidden relative">
                  <ImageWithFallback
                    src={photo.url}
                    alt={photo.title}
                    domainTheme="equestrian"
                    objectFit="contain"
                    className="w-full h-full max-h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/75 border border-[#d4af37]/40 text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-colors shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Structured caption footer below image */}
                <div className="p-4 bg-[#17100a] border-t border-[#352316] flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-serif-luxury uppercase tracking-wider text-[#d4af37] font-semibold">
                        {photo.category}
                      </span>
                      <span className="text-[11px] text-[#a89584]">
                        {photo.year}
                      </span>
                    </div>
                    <h3 className="text-base font-serif-luxury font-bold text-white leading-snug tracking-wide line-clamp-1 group-hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                      <span className="truncate">{photo.title}</span>
                    </h3>
                    <p className="text-xs text-[#cfc2b2] mt-1 line-clamp-2 leading-relaxed">
                      {photo.subtitle}
                    </p>
                  </div>
                  {photo.location && (
                    <div className="mt-3 pt-2.5 border-t border-[#2a1b11] flex items-center justify-between text-[11px] text-[#9c8978]">
                      <span>📍 {photo.location}</span>
                      <span className="text-[#d4af37] font-serif-luxury">Ver foto completa</span>
                    </div>
                  )}
                </div>

              </div>
            ))}

            {/* Placeholder Card inviting Guilherme to upload */}
            <div
              onClick={() => setIsUploadOpen(true)}
              className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 border-dashed border-[#402c1d] hover:border-[#c59b27]/50 bg-[#160f0a]/50 cursor-pointer min-h-[260px] group transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#271a10] border border-[#543b25] flex items-center justify-center text-[#d4af37] mb-3 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-serif-luxury font-bold text-white mb-1">
                Espaço para Nova Fotografia
              </h4>
              <p className="text-xs text-[#a38f7d] max-w-xs leading-relaxed">
                Clique aqui para carregar mais fotografias pessoais de provas, animais do Haras GMF e momentos marcantes.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Minha Paixão pelos Cavalos Section */}
      <section id="paixao" className="py-20 bg-[#0d0906]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          <HeartHandshake className="w-10 h-10 text-[#d4af37] mx-auto mb-4" />
          
          <span className="text-xs uppercase tracking-widest font-serif-luxury font-semibold text-[#d4af37]">
            Manifesto
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-white mt-2 leading-tight">
            {t.paixaoSection.quote}
          </h2>

          <p className="text-sm sm:text-base text-[#cfc2b2] mt-6 leading-relaxed font-light">
            {t.paixaoSection.text}
          </p>

          <div className="mt-8 pt-6 border-t border-[#382618] flex items-center justify-center gap-4 text-xs font-serif-luxury text-[#a38f7d]">
            <span>Guilherme</span>
            <span>·</span>
            <span>Haras GMF</span>
            <span>·</span>
            <span>Santa Bárbara - MG</span>
          </div>

        </div>
      </section>

      {/* Lightbox Modal with Next / Prev */}
      {activePhoto && (
        <MediaLightboxModal
          isOpen={!!activePhoto}
          onClose={() => setActivePhoto(null)}
          imageUrl={activePhoto.url}
          title={activePhoto.title}
          subtitle={activePhoto.subtitle}
          category={activePhoto.category}
          year={activePhoto.year}
          location={activePhoto.location}
          theme="equestrian"
          currentIndex={lightboxGallery.findIndex((p) => p.id === activePhoto.id)}
          totalPhotos={lightboxGallery.length}
          hasNext={lightboxGallery.length > 1}
          hasPrev={lightboxGallery.length > 1}
          onNext={() => {
            const idx = lightboxGallery.findIndex((p) => p.id === activePhoto.id);
            if (idx !== -1) {
              const nextIdx = (idx + 1) % lightboxGallery.length;
              setActivePhoto(lightboxGallery[nextIdx]);
            }
          }}
          onPrev={() => {
            const idx = lightboxGallery.findIndex((p) => p.id === activePhoto.id);
            if (idx !== -1) {
              const prevIdx = (idx - 1 + lightboxGallery.length) % lightboxGallery.length;
              setActivePhoto(lightboxGallery[prevIdx]);
            }
          }}
        />
      )}

      {/* Photo Uploader Modal */}
      <PhotoUploaderModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddPhoto={handleAddCustomPhoto}
        defaultCategory="Marchador"
        categoryOptions={['Marchador', 'Competições', 'Haras GMF']}
        theme="equestrian"
      />

      {/* Footer */}
      <footer className="py-8 border-t border-[#382618] bg-[#0c0805] text-xs text-[#8c7a6a] text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Guilherme — O Cavaleiro · Mangalarga Marchador · Haras GMF</span>
          <button
            onClick={() => onNavigate('home')}
            className="text-[#d4af37] hover:underline transition-colors"
          >
            ← Voltar para escolha de experiências
          </button>
        </div>
      </footer>

    </div>
  );
};
