import React, { useState } from 'react';
import { JOGADOR_DATA, IMAGES } from '../data/portfolioData';
import { ExperienceType, FootballPhoto } from '../types';
import { ExperienceNav } from './ExperienceNav';
import { ImageWithFallback } from './ImageWithFallback';
import { MediaLightboxModal } from './MediaLightboxModal';
import { PhotoUploaderModal } from './PhotoUploaderModal';
import {
  Trophy,
  Flame,
  Activity,
  PlusCircle,
  Maximize2,
  Calendar,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  Gamepad2,
} from 'lucide-react';

import { Language, I18N } from '../data/i18nData';

interface JogadorExperienceProps {
  onNavigate: (exp: ExperienceType) => void;
  language?: Language;
  onToggleLanguage?: (lang: Language) => void;
}

export const JogadorExperience: React.FC<JogadorExperienceProps> = ({
  onNavigate,
  language = 'pt',
  onToggleLanguage,
}) => {
  const t = I18N[language].jogador;
  const [gallery, setGallery] = useState<FootballPhoto[]>(JOGADOR_DATA.gallery);
  const [activePhoto, setActivePhoto] = useState<FootballPhoto | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filterTag, setFilterTag] = useState<'all' | 'Galo' | 'Campo' | 'Treino'>('all');

  const navSections = [
    { id: 'historia', label: t.nav.historia },
    { id: 'galo', label: t.nav.galo },
    { id: 'momentos', label: t.nav.momentos },
    { id: 'em-campo', label: t.nav.emCampo },
    { id: 'galeria', label: t.nav.galeria },
  ];

  const tags: { id: 'all' | 'Galo' | 'Campo' | 'Treino'; label: string }[] = [
    { id: 'all', label: language === 'pt' ? 'Todos' : 'All' },
    { id: 'Galo', label: 'Galo' },
    { id: 'Campo', label: language === 'pt' ? 'Campo' : 'Pitch' },
    { id: 'Treino', label: language === 'pt' ? 'Treino' : 'Training' },
  ];

  const filteredGallery = filterTag === 'all'
    ? gallery
    : gallery.filter((p) => p.tag === filterTag);

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
        id: newPhoto.id,
        url: newPhoto.url,
        title: newPhoto.title,
        description: newPhoto.subtitle,
        tag: (newPhoto.category as any) || 'Campo',
        year: newPhoto.year,
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Top Bar Navigation */}
      <ExperienceNav
        currentExperience="jogador"
        onNavigate={onNavigate}
        sections={navSections}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      {/* Hero / Minha História Section */}
      <section id="historia" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-neutral-800">
        
        {/* Stadium Floodlight Visual Beam (zero-blur CSS radial gradients) */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[820px] h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.10)_0%,transparent_70%)] pointer-events-none" />

        {/* Pitch line subtle pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 bg-emerald-400 rotate-45" />
            <span className="text-xs uppercase tracking-widest font-sport text-emerald-400 font-bold">
              {t.hero.kicker}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Athlete Story */}
            <div className="lg:col-span-7 space-y-6">
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sport font-bold uppercase tracking-tight text-white leading-none">
                {t.hero.titlePart1} <span className="text-emerald-400">{t.hero.titlePart2}</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-light">
                {t.hero.bio}
              </p>

              {/* Badges / Stats strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {t.hero.stats.map((s, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
                    <span className="block text-[11px] font-sport uppercase tracking-wider text-neutral-400">{s.label}</span>
                    <span className="text-sm font-bold text-white block mt-0.5">{s.value}</span>
                    <span className="block text-[11px] text-emerald-400 truncate mt-0.5">{s.detail}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#galo"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('galo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-sport uppercase tracking-wider font-bold transition-all shadow-lg shadow-white/10 flex items-center gap-2"
                >
                  <Flame className="w-4 h-4 text-black" />
                  <span>{t.hero.btnGalo}</span>
                </a>
                <a
                  href="#em-campo"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('em-campo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-emerald-400 text-xs font-sport uppercase tracking-wider font-bold transition-colors flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>{t.hero.btnScout}</span>
                </a>
              </div>

            </div>

            {/* Right Column: Dynamic Stadium Shot */}
            <div className="lg:col-span-5">
              <div
                className="relative rounded-2xl overflow-hidden border border-neutral-700 shadow-2xl group cursor-pointer bg-black/95"
                onClick={() => setActivePhoto(JOGADOR_DATA.gallery[0])}
              >
                <div className="h-[380px] sm:h-[450px] w-full flex items-center justify-center p-3">
                  <ImageWithFallback
                    src={IMAGES.footballStadium}
                    alt="Estádio com atmosfera noturna e torcida apaixonada"
                    domainTheme="football"
                    objectFit="contain"
                    priority
                    className="w-full h-full max-h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between photo-caption-overlay">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-emerald-400 font-sport font-bold">
                      {t.hero.photoTag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-sport uppercase font-bold text-white mt-1 tracking-wide flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>{t.hero.photoTitle}</span>
                    </h3>
                    <p className="text-xs text-neutral-300 mt-0.5">
                      {t.hero.photoSub}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-full bg-black/70 border border-neutral-600 text-white group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Paixão Alvinegra — Clube Atlético Mineiro */}
      <section id="galo" className="py-20 border-b border-neutral-800 bg-neutral-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs uppercase tracking-widest font-sport font-bold text-emerald-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-emerald-400" />
                Manto Sagrado & Alma Alvinegra
              </span>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-sport font-bold uppercase text-white leading-tight">
                Clube Atlético Mineiro: O Sentimento Que Não Para
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
                Ser atleticano é um estado de espírito. É a fé de nunca desistir até o último segundo de jogo, o orgulho de vestir o manto alvinegro nas ruas de Betim e de Belo Horizonte, e a vibração única de viver a nova casa na Arena MRV.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-xs font-sport uppercase text-neutral-400 block mb-1">Catedral Alvinegra</span>
                  <span className="text-base font-bold text-white">Arena MRV</span>
                  <p className="text-xs text-neutral-400 mt-1">A acústica, a pressão da torcida e a emoção de cada apito inicial.</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-xs font-sport uppercase text-neutral-400 block mb-1">Identidade</span>
                  <span className="text-base font-bold text-white">Galo Forte e Vingador</span>
                  <p className="text-xs text-neutral-400 mt-1">Uma herança de luta, glórias e paixão passada de geração em geração.</p>
                </div>
              </div>

            </div>

            {/* Visual Tribute Card */}
            <div className="lg:col-span-6">
              <div className="p-8 sm:p-10 rounded-2xl bg-black border-2 border-neutral-800 relative overflow-hidden shadow-2xl">
                
                {/* Diagonal stripes motif */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rotate-45 pointer-events-none" />

                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-sport uppercase tracking-widest text-emerald-400 font-bold">
                    Manifesto do Torcedor
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    CAM · 1908
                  </span>
                </div>

                <blockquote className="text-xl sm:text-2xl font-sport uppercase font-bold text-white leading-snug mb-6">
                  "Nós somos do Clube Atlético Mineiro, jogamos com muita raça e amor. Vencer, vencer, vencer!"
                </blockquote>

                <div className="pt-6 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                  <span>Guilherme · Atleticano Roxo</span>
                  <span className="text-emerald-400 font-bold">Galo Sempre</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Momentos Marcantes Section */}
      <section id="momentos" className="py-20 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-widest font-sport font-bold text-emerald-400">
              Trajetória Esportiva
            </span>
            <h2 className="text-3xl sm:text-4xl font-sport font-bold uppercase text-white mt-1">
              Momentos Marcantes Dentro & Fora de Campo
            </h2>
            <p className="text-sm text-neutral-400 mt-2 font-light">
              Partidas decisivas, jogos de estádio inesquecíveis e as clássicas peladas de fim de semana com os amigos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {JOGADOR_DATA.moments.map((moment) => (
              <div
                key={moment.id}
                className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-sport uppercase tracking-wider text-neutral-400 mb-3">
                    <span className="text-emerald-400 font-bold">{moment.type}</span>
                    <span>{moment.date}</span>
                  </div>

                  <h3 className="text-xl font-sport uppercase font-bold text-white mb-2 leading-tight tracking-wide flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{moment.title}</span>
                  </h3>
                  <span className="block text-xs text-neutral-400 mb-3 font-medium">
                    {moment.subtitle}
                  </span>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                    {moment.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800/80 space-y-1 text-xs text-neutral-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="truncate">{moment.stadiumOrPlace}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{moment.scoreOrContext}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Em Campo — Ficha Técnica do Jogador */}
      <section id="em-campo" className="py-20 border-b border-neutral-800 bg-neutral-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Pitch / Ball Image */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden border border-neutral-800 relative group">
                <div className="h-80 sm:h-96 w-full bg-black/95 flex items-center justify-center p-3">
                  <ImageWithFallback
                    src={IMAGES.footballBall}
                    alt="Em campo jogando com a camisa Cooperminas"
                    domainTheme="football"
                    objectFit="contain"
                    className="w-full h-full max-h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 photo-caption-overlay">
                  <span className="text-xs uppercase tracking-widest text-emerald-400 font-sport font-bold">
                    Estilo de Jogo
                  </span>
                  <h4 className="text-lg font-sport uppercase font-bold text-white mt-0.5">
                    Visão Panorâmica & Dinâmica de Meio-Campo
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Transição rápida da defesa para o ataque com passe qualificado.
                  </p>
                </div>
              </div>
            </div>

            {/* Player Card Technical Sheet */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              
              <div>
                <span className="text-xs uppercase tracking-widest font-sport font-bold text-emerald-400">
                  Scout & Características
                </span>
                <h2 className="text-3xl sm:text-4xl font-sport font-bold uppercase text-white mt-1">
                  Ficha Técnica do Atleta
                </h2>
                <p className="text-sm text-neutral-400 mt-2 font-light">
                  {JOGADOR_DATA.playerCard.style}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-neutral-500 block uppercase">Número da Camisa</span>
                  <span className="text-base font-bold text-white font-sport">{JOGADOR_DATA.playerCard.number}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-neutral-500 block uppercase">Pé Dominante</span>
                  <span className="text-base font-bold text-white font-sport">{JOGADOR_DATA.playerCard.preferredFoot}</span>
                </div>
              </div>

              {/* Attributes Progress Bars */}
              <div className="space-y-3 p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                {JOGADOR_DATA.playerCard.attributes.map((attr) => (
                  <div key={attr.name}>
                    <div className="flex justify-between text-xs font-sport uppercase mb-1">
                      <span className="text-neutral-300 font-bold">{attr.name}</span>
                      <span className="text-emerald-400 font-bold tabular-nums">{attr.score}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                        style={{ width: `${attr.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Galeria de Fotos e Lembranças (Com Lightbox e Uploader) */}
      <section id="galeria" className="py-20 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-sport font-bold text-emerald-400">
                Registros dos Gramados & Torcida
              </span>
              <h2 className="text-3xl sm:text-4xl font-sport font-bold uppercase text-white mt-1">
                Galeria de Fotos & Lembranças
              </h2>
              <p className="text-sm text-neutral-400 mt-2 max-w-xl font-light">
                Camisas históricas, idas a estádios, momentos jogando futebol e resenha pós-jogo. Adicione suas fotos diretamente na galeria.
              </p>
            </div>

            {/* Actions: Add Photo & Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-sport uppercase tracking-wider font-bold transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Adicionar Minha Foto / Vídeo</span>
              </button>

              <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg flex-wrap">
                {tags.map((tag) => {
                  const count = tag.id === 'all'
                    ? gallery.length
                    : gallery.filter((p) => p.tag === tag.id).length;
                  return (
                    <button
                      key={tag.id}
                      onClick={() => setFilterTag(tag.id)}
                      className={`px-3 py-1.5 text-xs font-sport uppercase rounded-md transition-colors flex items-center gap-1.5 ${
                        filterTag === tag.id
                          ? 'bg-emerald-500 text-black font-bold shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>{tag.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        filterTag === tag.id ? 'bg-black/20 text-black font-bold' : 'bg-black/50 text-neutral-300'
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
                className="group relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 cursor-pointer shadow-lg hover:border-emerald-500/60 transition-all duration-300 flex flex-col"
              >
                {/* Centered Image Container - 100% visible, no crop */}
                <div className="h-72 sm:h-80 w-full bg-black/95 flex items-center justify-center p-3 overflow-hidden relative">
                  <ImageWithFallback
                    src={photo.url}
                    alt={photo.title}
                    domainTheme="football"
                    objectFit="contain"
                    className="w-full h-full max-h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/75 border border-neutral-700 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Structured caption footer below image */}
                <div className="p-4 bg-neutral-900 border-t border-neutral-800/80 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-sport uppercase tracking-wider text-emerald-400 font-bold">
                        {photo.tag}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {photo.year}
                      </span>
                    </div>
                    <h3 className="text-base font-sport uppercase font-bold text-white line-clamp-1 tracking-wide group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <Gamepad2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{photo.title}</span>
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Clube Atlético Mineiro / Futebol</span>
                    <span className="text-emerald-400 font-sport uppercase">Ver foto</span>
                  </div>
                </div>

              </div>
            ))}

            {/* Placeholder Card inviting Guilherme to upload his match photos */}
            <div
              onClick={() => setIsUploadOpen(true)}
              className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 border-dashed border-neutral-800 hover:border-emerald-500/50 bg-neutral-950/50 cursor-pointer min-h-[260px] group transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-sport uppercase font-bold text-white mb-1">
                Adicionar Foto do Jogo ou Galo
              </h4>
              <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                Espaço preparado para fotos no estádio, com as camisas do Atlético ou lances jogando nos campos de Betim.
              </p>
            </div>

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
          subtitle={photoSubtitle(activePhoto)}
          category={activePhoto.tag}
          year={activePhoto.year}
          theme="football"
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
        defaultCategory="Campo"
        categoryOptions={['Galo', 'Campo', 'Treino']}
        theme="football"
      />

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-800 bg-black text-xs text-neutral-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Guilherme — O Jogador · Clube Atlético Mineiro · Betim/MG</span>
          <button
            onClick={() => onNavigate('home')}
            className="text-emerald-400 hover:underline transition-colors"
          >
            ← Voltar para escolha de experiências
          </button>
        </div>
      </footer>

    </div>
  );
};

function photoSubtitle(photo: FootballPhoto): string {
  return photo.description;
}
