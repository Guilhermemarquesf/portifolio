import React, { useState } from 'react';
import { ExperienceType } from '../types';
import { ExperienceNav } from './ExperienceNav';
import { CAVALEIRO_DATA, DEV_DATA, JOGADOR_DATA, IMAGES } from '../data/portfolioData';
import { ImageWithFallback } from './ImageWithFallback';
import {
  Award,
  Code2,
  Trophy,
  ArrowRight,
  Sparkles,
  Heart,
  Compass,
  MapPin,
  Calendar,
  Mail,
  Github,
  Linkedin,
  BookOpen,
} from 'lucide-react';

import { Language, I18N } from '../data/i18nData';

interface MinhaVidaExperienceProps {
  onNavigate: (exp: ExperienceType) => void;
  language?: Language;
  onToggleLanguage?: (lang: Language) => void;
}

export const MinhaVidaExperience: React.FC<MinhaVidaExperienceProps> = ({
  onNavigate,
  language = 'pt',
  onToggleLanguage,
}) => {
  const [readingMode, setReadingMode] = useState(false);
  const t = I18N[language].vida;
  const navSections = [
    { id: 'biografia', label: t.nav.biografia },
    { id: 'pilares', label: t.nav.pilares },
    { id: 'trajetoria', label: t.nav.trajetoria },
    { id: 'valores', label: t.nav.valores },
    { id: 'contato', label: t.nav.contato },
  ];

  const milestones = [
    {
      year: 'Infância & Raízes',
      title: 'A Descoberta das Primeiras Paixões',
      desc: 'Crescendo em Minas Gerais, a convivência familiar com o campo, o universo dos cavalos e as tardes de bola na rua forjaram o amor inicial pela marcha e pelo futebol.',
      pillar: 'Origem',
    },
    {
      year: 'Pistas & Sela',
      title: 'A Dedicação ao Mangalarga Marchador',
      desc: 'Início dos treinamentos rigorosos de andamento, provas oficiais de marcha e representação do Haras GMF, culminando em mais de 20 conquistas oficiais, Top 10 Nacional e Top 6 no CBM.',
      pillar: 'O Cavaleiro',
    },
    {
      year: 'Paixão Alvinegra',
      title: 'O Amor Incondicional pelo Galo',
      desc: 'Viver o Clube Atlético Mineiro com intensidade em cada partida, empurrando o time na Arena MRV e levando a raça de quem nunca desiste para dentro das quatro linhas em jogos e peladas.',
      pillar: 'O Jogador',
    },
    {
      year: 'O Futuro & Tecnologia',
      title: 'Sistemas de Informação na PUC Minas Betim',
      desc: 'Canalizando o raciocínio analítico para a programação. Domínio de HTML, CSS, JavaScript, C#, Node.js e desenvolvimento de soluções tecnológicas de impacto no Front e Back-End.',
      pillar: 'O Programador',
    },
    {
      year: 'Presente & Visão',
      title: 'Uma História de Coerência e Propósito',
      desc: 'Unir disciplina do esporte, nobreza da tradição da sela e rigor do desenvolvimento de software em uma única caminhada autêntica.',
      pillar: 'Síntese',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090807] text-[#f7f2ea] font-sans selection:bg-[#d4af37] selection:text-black">
      
      {/* Top Bar Navigation */}
      <ExperienceNav
        currentExperience="vida"
        onNavigate={onNavigate}
        sections={navSections}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      {/* Hero / Biografia */}
      <section id="biografia" className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-[#382b1d]">
        
        {/* Warm Golden Glows (zero-blur CSS radial gradients) */}
        <div className="absolute top-10 left-1/3 w-[640px] h-[640px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.10)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[420px] h-[420px] bg-[radial-gradient(circle_at_center,rgba(140,106,30,0.14)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#d4af37] mb-4 inline-block font-cinzel">
            {t.hero.kicker}
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display-serif font-normal text-white tracking-tight leading-[1.1] mb-6">
            Guilherme <span className="italic text-gold-gradient">Marques</span> Ferreira
          </h1>

          {/* Botão Modo Leitura */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setReadingMode(!readingMode)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-serif-luxury transition-all duration-300 border cursor-pointer ${
                readingMode
                  ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-lg shadow-[#d4af37]/30 font-bold scale-105'
                  : 'bg-[#1b1610]/90 text-[#d4af37] border-[#4d3a27] hover:border-[#d4af37]/80 hover:bg-[#251d14]'
              }`}
              title={readingMode ? (language === 'pt' ? 'Desativar Modo Leitura' : 'Turn off Reading Mode') : (language === 'pt' ? 'Ativar Modo Leitura' : 'Turn on Reading Mode')}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{readingMode ? (language === 'pt' ? 'Modo Leitura Ativado' : 'Reading Mode Enabled') : (language === 'pt' ? 'Modo Leitura' : 'Reading Mode')}</span>
            </button>
          </div>

          <div className={`transition-all duration-500 mx-auto ${
            readingMode
              ? 'max-w-4xl bg-[#14100c]/90 border border-[#d4af37]/40 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/80 my-8'
              : 'max-w-3xl mb-10'
          }`}>
            <blockquote className={`font-display-serif italic text-[#dfd4c5] mx-auto transition-all duration-500 ${
              readingMode
                ? 'text-xl sm:text-2xl md:text-3xl leading-relaxed mb-8 text-[#f7efe4]'
                : 'text-lg sm:text-xl md:text-2xl leading-relaxed mb-8'
            }`}>
              {t.hero.quote}
            </blockquote>

            <p className={`text-[#cfc2b0] mx-auto font-light transition-all duration-500 ${
              readingMode
                ? 'text-base sm:text-lg md:text-xl text-[#f3ece2] leading-loose sm:leading-[2.2] tracking-wide'
                : 'text-sm sm:text-base leading-relaxed'
            }`}>
              {t.hero.bio}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1b1610] border border-[#4d3a27] text-xs text-[#d4af37] font-display-serif">
              Betim, Minas Gerais
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#1b1610] border border-[#4d3a27] text-xs text-[#d4af37] font-display-serif">
              PUC Minas Betim (SI)
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#1b1610] border border-[#4d3a27] text-xs text-[#d4af37] font-display-serif">
              Haras GMF (Santa Bárbara - MG)
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#1b1610] border border-[#4d3a27] text-xs text-[#d4af37] font-display-serif">
              Galo Doido
            </span>
          </div>

        </div>
      </section>

      {/* Os Três Pilares Integrados */}
      <section id="pilares" className="py-20 border-b border-[#382b1d] bg-[#120f0c]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-cinzel">
              Identidades
            </span>
            <h2 className="text-3xl sm:text-4xl font-display-serif font-bold text-white mt-1">
              Os Três Pilares da Minha Vida
            </h2>
            <p className="text-sm text-[#c7b9a7] mt-2 font-light">
              Três universos aparentemente distintos que se complementam e formam quem sou por inteiro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Pillar 1: O Cavaleiro */}
            <div className="flex flex-col justify-between rounded-2xl bg-[#1a140e] border border-[#4a3623] hover:border-[#d4af37]/70 p-6 sm:p-7 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full border-2 border-[#d4af37] p-0.5 overflow-hidden shadow-md bg-black">
                    <img
                      src="/assets/aistudio/Captura_de_tela_2026-11-06_232524_c19dafd0.png"
                      alt="Haras GMF Logo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="text-[11px] font-cinzel text-[#d4af37] uppercase tracking-wider">
                    Tradição & Raça
                  </span>
                </div>

                <h3 className="text-2xl font-display-serif font-bold text-white mb-2">
                  O Cavaleiro
                </h3>

                <p className="text-xs sm:text-sm text-[#cfc2b0] leading-relaxed mb-6 font-light">
                  {t.pilaresSection.cavaleiroDesc}
                </p>
              </div>

              <button
                onClick={() => onNavigate('cavaleiro')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2a1d12] hover:bg-[#d4af37] text-[#d4af37] hover:text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-[#593f26]"
              >
                <span>Explorar O Cavaleiro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 2: O Programador */}
            <div className="flex flex-col justify-between rounded-2xl bg-[#1a140e] border border-[#4a3623] hover:border-[#d4af37]/70 p-6 sm:p-7 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#2a1d12] text-[#d4af37] border border-[#593f26]">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-cinzel text-[#d4af37] uppercase tracking-wider">
                    Código & Soluções
                  </span>
                </div>

                <h3 className="text-2xl font-display-serif font-bold text-white mb-2">
                  O Programador
                </h3>

                <p className="text-xs sm:text-sm text-[#cfc2b0] leading-relaxed mb-6 font-light">
                  Estudante de Sistemas de Informação na PUC Minas Betim. Foco em arquitetura de software, desenvolvimento Front-End e Back-End com HTML, CSS, JavaScript, C#, Node.js e manipulação estruturada de dados com JSON.
                </p>
              </div>

              <button
                onClick={() => onNavigate('dev')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2a1d12] hover:bg-[#d4af37] text-[#d4af37] hover:text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-[#593f26]"
              >
                <span>Explorar O Programador</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 3: O Jogador */}
            <div className="flex flex-col justify-between rounded-2xl bg-[#1a140e] border border-[#4a3623] hover:border-[#d4af37]/70 p-6 sm:p-7 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#2a1d12] text-[#d4af37] border border-[#593f26]">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-cinzel text-[#d4af37] uppercase tracking-wider">
                    Futebol & Galo
                  </span>
                </div>

                <h3 className="text-2xl font-display-serif font-bold text-white mb-2">
                  O Jogador
                </h3>

                <p className="text-xs sm:text-sm text-[#cfc2b0] leading-relaxed mb-6 font-light">
                  A vivência dentro de campo nas peladas e competições locais como meio-campista dinâmico, aliada à devoção incondicional pelo Clube Atlético Mineiro nas arquibancadas da Arena MRV e em cada final histórica.
                </p>
              </div>

              <button
                onClick={() => onNavigate('jogador')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2a1d12] hover:bg-[#d4af37] text-[#d4af37] hover:text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-[#593f26]"
              >
                <span>Explorar O Jogador</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Trajetória Autobiográfica Integrada */}
      <section id="trajetoria" className="py-20 border-b border-[#382b1d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-cinzel">
              História
            </span>
            <h2 className="text-3xl sm:text-4xl font-display-serif font-bold text-white mt-1">
              Trajetória Integrada
            </h2>
            <p className="text-sm text-[#c7b9a7] mt-2 font-light">
              Os momentos que moldaram minha personalidade, valores e ambições.
            </p>
          </div>

          <div className="relative border-l border-[#4a3623] ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10">
            {milestones.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#120f0c] border-2 border-[#d4af37] group-hover:bg-[#d4af37] transition-colors" />

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-cinzel text-[#d4af37] font-bold">
                    {item.year}
                  </span>
                  <span className="text-[#593f26]">·</span>
                  <span className="text-[11px] font-mono text-[#a38f7d] uppercase tracking-wider">
                    {item.pillar}
                  </span>
                </div>

                <h3 className="text-lg font-display-serif font-bold text-white">
                  {item.title}
                </h3>

                <p className="text-sm text-[#cfc2b0] mt-1.5 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Valores */}
      <section id="valores" className="py-20 border-b border-[#382b1d] bg-[#120f0c]/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-cinzel">
            Princípios
          </span>
          <h2 className="text-3xl sm:text-4xl font-display-serif font-bold text-white mt-1 mb-10">
            Valores Que Me Guiam
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[#1a140e] border border-[#3f2e1d] text-center">
              <span className="block text-2xl mb-2">🐎</span>
              <h4 className="text-base font-display-serif font-bold text-white mb-1">Disciplina</h4>
              <p className="text-xs text-[#a38f7d] font-light">
                Aprendida no manejo e nos treinos diários de sela com os animais.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#1a140e] border border-[#3f2e1d] text-center">
              <span className="block text-2xl mb-2">⚽</span>
              <h4 className="text-base font-display-serif font-bold text-white mb-1">Raça & Entrega</h4>
              <p className="text-xs text-[#a38f7d] font-light">
                A mentalidade de nunca desistir até o último segundo de jogo.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#1a140e] border border-[#3f2e1d] text-center">
              <span className="block text-2xl mb-2">💻</span>
              <h4 className="text-base font-display-serif font-bold text-white mb-1">Curiosidade</h4>
              <p className="text-xs text-[#a38f7d] font-light">
                A busca contínua por entender como sistemas e códigos funcionam.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#1a140e] border border-[#3f2e1d] text-center">
              <span className="block text-2xl mb-2">🌾</span>
              <h4 className="text-base font-display-serif font-bold text-white mb-1">Tradição</h4>
              <p className="text-xs text-[#a38f7d] font-light">
                Orgulho das raízes mineiras, da família e da história construída.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Contato & Redes */}
      <section id="contato" className="py-20 bg-[#0a0806]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-cinzel">
            Conexão
          </span>
          <h2 className="text-3xl sm:text-4xl font-display-serif font-bold text-white">
            Vamos Conversar?
          </h2>
          <p className="text-sm text-[#cfc2b0] max-w-xl mx-auto font-light leading-relaxed">
            Seja para oportunidades em desenvolvimento de software, conversas sobre o Mangalarga Marchador ou para falar sobre futebol.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={`mailto:${DEV_DATA.email}?subject=Contato%20via%20Portf%C3%B3lio%20Autobiogr%C3%A1fico`}
              className="px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#b8912e] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg shadow-[#d4af37]/20"
            >
              <Mail className="w-4 h-4" />
              <span>Enviar E-mail ({DEV_DATA.email})</span>
            </a>

            <a
              href={DEV_DATA.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-[#1f1710] hover:bg-[#2b2016] border border-[#4a3623] text-white text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Github className="w-4 h-4 text-[#d4af37]" />
              <span>GitHub</span>
            </a>

            <a
              href={DEV_DATA.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-[#1f1710] hover:bg-[#2b2016] border border-[#4a3623] text-white text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-[#d4af37]" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#382b1d] bg-[#070605] text-xs text-[#8c7a6a] text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Guilherme Marques Ferreira · Portfólio Autobiográfico · Betim/MG</span>
          <button
            onClick={() => onNavigate('home')}
            className="text-[#d4af37] hover:underline transition-colors"
          >
            ← Voltar para o início
          </button>
        </div>
      </footer>

    </div>
  );
};
