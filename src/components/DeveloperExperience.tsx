import React, { useState } from 'react';
import { DEV_DATA, IMAGES } from '../data/portfolioData';
import { DevProject, ExperienceType } from '../types';
import { ExperienceNav } from './ExperienceNav';
import { ImageWithFallback } from './ImageWithFallback';
import {
  Code2,
  Terminal,
  Cpu,
  GraduationCap,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BookOpen,
  Send,
  Layers,
  CheckCircle2,
  Mic,
  MicOff,
  Loader2,
  Upload,
} from 'lucide-react';

import { Language, I18N } from '../data/i18nData';
import { useAudioTranscription } from '../hooks/useAudioTranscription';

interface DeveloperExperienceProps {
  onNavigate: (exp: ExperienceType) => void;
  language?: Language;
  onToggleLanguage?: (lang: Language) => void;
}

export const DeveloperExperience: React.FC<DeveloperExperienceProps> = ({
  onNavigate,
  language = 'pt',
  onToggleLanguage,
}) => {
  const t = I18N[language].dev;
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeProjectModal, setActiveProjectModal] = useState<DevProject | null>(null);
  const [messageSent, setMessageSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const contactFileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    isRecording: voiceIsRecording,
    isTranscribing: voiceIsTranscribing,
    error: voiceError,
    isPermissionDenied: voicePermissionDenied,
    startRecording: voiceStart,
    stopRecording: voiceStop,
    transcribeAudioFile: voiceTranscribeFile,
    resetError: voiceResetError,
  } = useAudioTranscription();

  const navSections = [
    { id: 'sobre', label: t.nav.sobre },
    { id: 'tecnologias', label: t.nav.tecnologias },
    { id: 'projetos', label: t.nav.projetos },
    { id: 'evolucao', label: t.nav.evolucao },
    { id: 'academico', label: t.nav.academico },
    { id: 'contato', label: t.nav.contato },
  ];

  const categories = language === 'pt'
    ? ['Todos', 'Acadêmico', 'Pessoal', 'Full-Stack']
    : ['All', 'Academic', 'Personal', 'Full-Stack'];

  const filteredProjects = (selectedCategory === 'Todos' || selectedCategory === 'All')
    ? DEV_DATA.projects
    : DEV_DATA.projects.filter((p) => {
        if (selectedCategory === 'Acadêmico' || selectedCategory === 'Academic') return p.category === 'Acadêmico';
        if (selectedCategory === 'Pessoal' || selectedCategory === 'Personal') return p.category === 'Pessoal';
        if (selectedCategory === 'Full-Stack') return p.category === 'Full-Stack';
        return true;
      });

  const targetEmail = DEV_DATA.email;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    const subject = encodeURIComponent(`Contato via Portfólio: ${contactName.trim()}`);
    const body = encodeURIComponent(
      `Olá Guilherme,\n\nMeu nome é ${contactName.trim()} (${contactEmail.trim()}).\n\nMensagem:\n${contactMessage.trim()}\n\n---\nEnviado através do seu Portfólio Interativo`
    );

    const mailtoLink = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    setMessageSent(true);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Top Bar Navigation */}
      <ExperienceNav
        currentExperience="dev"
        onNavigate={onNavigate}
        sections={navSections}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      {/* Hero / Sobre Mim Section */}
      <section id="sobre" className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-slate-800/80 bg-[#060913]">
        
        {/* Clean Tech Dot Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Subtle, soft top accent highlight */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Bio & Core Info */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center gap-2 text-xs font-code tracking-wider text-indigo-400 uppercase">
                <Terminal className="w-4 h-4" />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                {t.hero.titlePart1} <span className="text-indigo-400 font-bold underline decoration-indigo-500/40 underline-offset-8">{t.hero.titleHighlight}</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
                {t.hero.bio}
              </p>

              {/* Fast Facts / Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="block text-xs text-slate-400 font-mono mb-1">{t.hero.universityLabel}</span>
                  <span className="text-sm font-semibold text-white">{t.hero.universityName}</span>
                  <span className="block text-[11px] text-indigo-400">{t.hero.universityUnit}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="block text-xs text-slate-400 font-mono mb-1">{t.hero.specLabel}</span>
                  <span className="text-sm font-semibold text-white">{t.hero.specName}</span>
                  <span className="block text-[11px] text-indigo-400">{t.hero.specSub}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="block text-xs text-slate-400 font-mono mb-1">{t.hero.coreLabel}</span>
                  <span className="text-sm font-semibold text-white">{t.hero.coreName}</span>
                  <span className="block text-[11px] text-indigo-400">{t.hero.coreSub}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#projetos"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('projetos')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4" />
                  <span>{t.hero.btnProjects}</span>
                </a>
                <a
                  href="#contato"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>{t.hero.btnContact}</span>
                </a>
              </div>

            </div>

            {/* Right Column: Code & Workspace Visual Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/80 shadow-2xl relative">
                
                {/* Terminal Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">guilherme.developer.ts</span>
                  <div className="w-12" />
                </div>

                {/* Workspace Image Preview */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-950 flex items-center justify-center p-2">
                  <ImageWithFallback
                    src={IMAGES.devWorkspace}
                    alt="Estação de Desenvolvimento"
                    domainTheme="tech"
                    objectFit="contain"
                    className="w-full h-full max-h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono">
                    <span className="text-indigo-300">PUC Minas — Betim (SI)</span>
                    <span className="text-slate-400">VS Code · Node · C#</span>
                  </div>
                </div>

                {/* Live Code Mockup */}
                <div className="p-4 sm:p-5 font-code text-xs leading-relaxed text-slate-300 bg-slate-950/90 overflow-x-auto">
                  <div className="text-slate-500">// Perfil do Desenvolvedor</div>
                  <div className="text-indigo-400">const <span className="text-white">developer</span> = &#123;</div>
                  <div className="pl-4 text-slate-400">nome: <span className="text-emerald-300">"Guilherme"</span>,</div>
                  <div className="pl-4 text-slate-400">curso: <span className="text-emerald-300">"Sistemas de Informação"</span>,</div>
                  <div className="pl-4 text-slate-400">instituicao: <span className="text-emerald-300">"PUC Minas - Unidade Betim"</span>,</div>
                  <div className="pl-4 text-slate-400">stack: [</div>
                  <div className="pl-8 text-sky-300">"HTML", "CSS", "JavaScript", "C#", "Node.js", "JSON"</div>
                  <div className="pl-4 text-slate-400">],</div>
                  <div className="pl-4 text-slate-400">foco: <span className="text-amber-300">"Criar soluções tecnológicas de impacto"</span></div>
                  <div className="text-indigo-400">&#125;;</div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tecnologias & Ferramentas Section */}
      <section id="tecnologias" className="py-20 border-b border-slate-800/60 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-code tracking-wider text-indigo-400 uppercase">
              Stack Tecnológico
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Tecnologias e Ferramentas
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Conhecimentos aplicados tanto em ambiente acadêmico quanto em projetos pessoais e profissionais.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DEV_DATA.skills.map((skill) => (
              <div
                key={skill.name}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900/40">
                    {skill.category}
                  </span>
                  <span className="text-xs font-code text-slate-400 group-hover:text-slate-300">
                    {skill.level}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white tracking-wide group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{skill.name}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Projetos Desenvolvidos Section */}
      <section id="projetos" className="py-20 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-code tracking-wider text-indigo-400 uppercase">
                Portfólio Prático
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Projetos Desenvolvidos
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Projetos acadêmicos e pessoais desenvolvidos com rigor técnico, arquitetura limpa e foco em boas práticas.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col justify-between rounded-2xl bg-slate-900/50 border border-slate-800 p-6 sm:p-7 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-3">
                    <span className="text-indigo-400">{project.category}</span>
                    <span>{project.date}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 leading-snug tracking-wide flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-indigo-400 shrink-0" />
                    <span>{project.title}</span>
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-5">
                    {project.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-1.5 mb-6">
                    {project.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technologies tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setActiveProjectModal(project)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Ver Detalhes & Código</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>Repositório</span>
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Minha Evolução na Programação (Timeline) */}
      <section id="evolucao" className="py-20 border-b border-slate-800/60 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-code tracking-wider text-indigo-400 uppercase">
              Jornada de Aprendizado
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Minha Evolução na Programação
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Da compreensão da lógica matemática e algoritmos até o desenvolvimento de sistemas completos.
            </p>
          </div>

          <div className="relative border-l border-indigo-900/60 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-12">
            {DEV_DATA.timeline.map((step, idx) => (
              <div key={idx} className="relative group">
                
                {/* Node icon dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 group-hover:bg-indigo-500 transition-colors" />

                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <span className="text-xs font-code font-bold text-indigo-400">
                    {step.year}
                  </span>
                  <span className="text-slate-600 text-xs">·</span>
                  <span className="text-xs font-mono text-slate-400">
                    {step.period}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{step.title}</span>
                </h3>
                <span className="block text-xs font-medium text-slate-400 mb-2">
                  {step.subtitle}
                </span>

                <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                  {step.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Formação Acadêmica Section */}
      <section id="academico" className="py-20 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-code tracking-wider text-indigo-400 uppercase flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                Educação Formal
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Formação Acadêmica
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                Graduação em Sistemas de Informação na conceituada Pontifícia Universidade Católica de Minas Gerais (PUC Minas – Unidade Betim), aliando rigor conceitual em computação com aplicabilidade no ecossistema corporativo e tecnológico.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                
                <div className="flex items-start justify-between border-b border-slate-800 pb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-400 shrink-0" />
                      <span>Bacharelado em Sistemas de Informação</span>
                    </h3>
                    <p className="text-sm text-indigo-400 font-medium mt-0.5">
                      PUC Minas — Unidade Betim
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
                    Em Andamento
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-slate-400 font-mono mb-1">Eixos de Estudo</span>
                    <ul className="space-y-1 text-slate-300">
                      <li>• Engenharia e Arquitetura de Software</li>
                      <li>• Algoritmos e Estruturas de Dados</li>
                      <li>• Banco de Dados Relacional & Modelagem</li>
                      <li>• Programação Orientada a Objetos (C#)</li>
                    </ul>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-mono mb-1">Diferenciais</span>
                    <ul className="space-y-1 text-slate-300">
                      <li>• Resolução analítica de problemas</li>
                      <li>• Prática em projetos reais em equipe</li>
                      <li>• Alinhamento com metodologias ágeis</li>
                      <li>• Conexão direta com mercado e inovação</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* GitHub, LinkedIn & Contato Section */}
      <section id="contato" className="py-20 bg-slate-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Social & Direct Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-code tracking-wider text-indigo-400 uppercase">
                Conecte-se
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                GitHub, LinkedIn & Contato Direto
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Estou sempre aberto a oportunidades de desenvolvimento de software, projetos acadêmicos, estágios e colaborações tecnológicas.
              </p>

              <div className="space-y-3 pt-2">
                
                <a
                  href={DEV_DATA.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-white group-hover:bg-indigo-600 transition-colors">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-white">GitHub</span>
                      <span className="text-xs text-slate-400">Repositórios e projetos de código</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </a>

                <a
                  href={DEV_DATA.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-white group-hover:bg-indigo-600 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-white">LinkedIn</span>
                      <span className="text-xs text-slate-400">Perfil profissional e trajetória</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </a>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <span className="block font-medium text-white">Email Profissional</span>
                    <span className="text-slate-400">{DEV_DATA.email}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-1 tracking-wide flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Envie uma Mensagem</span>
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Preencha o formulário abaixo para entrar em contato diretamente comigo.
                </p>

                {messageSent ? (
                  <div className="p-6 sm:p-8 rounded-xl bg-indigo-950/60 border border-indigo-800 text-center space-y-4">
                    <CheckCircle2 className="w-10 h-10 text-indigo-400 mx-auto" />
                    <div>
                      <h4 className="text-lg font-semibold text-white">Pronto para Enviar!</h4>
                      <p className="text-xs text-indigo-200 mt-1 max-w-md mx-auto">
                        Seu aplicativo de email foi aberto com a mensagem pronta para <strong className="text-white">{targetEmail}</strong>.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodeURIComponent(`Contato via Portfólio: ${contactName}`)}&body=${encodeURIComponent(`Olá Guilherme,\n\nMeu nome é ${contactName} (${contactEmail}).\n\nMensagem:\n${contactMessage}\n\n---\nEnviado através do seu Portfólio Interativo`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir no Gmail Web</span>
                      </a>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setMessageSent(false);
                          setContactName('');
                          setContactEmail('');
                          setContactMessage('');
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        Enviar Outra Mensagem
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Seu Nome
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Ex: Carlos Silva"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Seu Email
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="carlos@exemplo.com"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-slate-300">
                          Mensagem
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="file"
                            ref={contactFileInputRef}
                            accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.aac"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const text = await voiceTranscribeFile(file);
                                if (text) {
                                  setContactMessage((prev) => (prev ? `${prev} ${text}` : text));
                                }
                                e.target.value = '';
                              }
                            }}
                          />

                          <button
                            type="button"
                            onClick={async () => {
                              if (voiceIsRecording) {
                                const text = await voiceStop();
                                if (text) {
                                  setContactMessage((prev) => (prev ? `${prev} ${text}` : text));
                                }
                              } else {
                                await voiceStart();
                              }
                            }}
                            disabled={voiceIsTranscribing}
                            className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors border ${
                              voiceIsRecording
                                ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                                : voiceIsTranscribing
                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                            title="Ditar mensagem por voz usando Gemini 3.5 Transcribe"
                          >
                            {voiceIsTranscribing ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                                <span>Transcrevendo...</span>
                              </>
                            ) : voiceIsRecording ? (
                              <>
                                <MicOff className="w-3.5 h-3.5 text-red-400" />
                                <span className="font-semibold text-red-400">Gravando... (Clique para parar)</span>
                              </>
                            ) : (
                              <>
                                <Mic className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Ditar com Gemini (Voz)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {voiceError && (
                        <div className="text-[11px] text-amber-300 mb-2 p-2 rounded bg-amber-950/40 border border-amber-800/50 flex items-center justify-between gap-2">
                          <span>
                            {voicePermissionDenied
                              ? 'Microfone bloqueado pelo navegador. Libere a permissão no ícone de cadeado ou envie um áudio gravado.'
                              : voiceError}
                          </span>
                          <button
                            type="button"
                            onClick={() => contactFileInputRef.current?.click()}
                            className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 shrink-0"
                          >
                            Enviar Áudio
                          </button>
                        </div>
                      )}

                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Olá Guilherme, vi seu portfólio e gostaria de conversar sobre uma oportunidade..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar Mensagem</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Project Details Modal */}
      {activeProjectModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setActiveProjectModal(null)}
        >
          <div
            className="relative max-w-2xl w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase">
                  {activeProjectModal.category} · {activeProjectModal.date}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-wide flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>{activeProjectModal.title}</span>
                </h3>
              </div>
              <button
                onClick={() => setActiveProjectModal(null)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {activeProjectModal.longDescription}
            </p>

            {activeProjectModal.codeSnippet && (
              <div className="mb-6">
                <span className="block text-xs font-mono text-slate-400 mb-2">
                  Trecho de Código em Destaque
                </span>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-code text-indigo-300 overflow-x-auto leading-relaxed">
                  <code>{activeProjectModal.codeSnippet}</code>
                </pre>
              </div>
            )}

            <div className="space-y-2 mb-6">
              <span className="block text-xs font-mono text-slate-400">
                Pontos de Destaque da Implementação
              </span>
              {activeProjectModal.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveProjectModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Fechar
              </button>
              <a
                href={activeProjectModal.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Ver no GitHub</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800/80 bg-slate-950 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Guilherme — O Desenvolvedor · Sistemas de Informação PUC Minas</span>
          <button
            onClick={() => onNavigate('home')}
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Voltar para escolha de experiências
          </button>
        </div>
      </footer>

    </div>
  );
};
