import {
  TechSkill,
  DevProject,
  TimelineMilestone,
  EquestrianAchievement,
  EquestrianPhoto,
  FootballMoment,
  FootballPhoto,
} from '../types';

// Imagens geradas com alta fidelidade
export const IMAGES = {
  devWorkspace: '/src/assets/images/dev_workspace_moderno_1794012510144.jpg',
  horseMarchador: '/assets/aistudio/WhatsApp_Image_2026-11-07_at_00.02.27__2__d3c403b5.jpeg',
  equestrianTrophies: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_23.36.31__3__9fc272e5.jpeg',
  footballStadium: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_13.18.38__2__7c605241.jpeg',
  footballBall: '/assets/aistudio/WhatsApp_Image_2026-11-07_at_00.02.27__1__8b6879a9.jpeg',
  harasGmfLogo: '/assets/aistudio/Captura_de_tela_2026-11-06_232524_c19dafd0.png',
};

// -----------------------------------------------------------------------------
// DADOS DO DESENVOLVEDOR
// -----------------------------------------------------------------------------
export const DEV_DATA = {
  name: 'Guilherme',
  role: 'Desenvolvedor de Software & Estudante de Sistemas de Informação',
  institution: 'PUC Minas – Unidade Betim',
  headline: 'Transformando lógica, algoritmos e código em soluções tecnológicas funcionais e escaláveis.',
  bio: 'Sou estudante de Sistemas de Informação na PUC Minas (Unidade Betim) com foco no desenvolvimento de software e arquitetura de sistemas. Minha trajetória é impulsionada pela curiosidade técnica e pela busca constante de construir soluções eficientes que resolvem problemas reais — desde o desenvolvimento de interfaces intuitivas no Front-End até a lógica estruturada e robusta de serviços no Back-End.',
  email: 'guilhermemarquesf0@gmail.com',
  github: 'https://github.com/Guilhermemarquesf',
  linkedin: 'https://www.linkedin.com/in/guilhermemarquesff/',
  location: 'Betim, Minas Gerais, Brasil',

  skills: [
    {
      name: 'HTML5 & Semântica',
      category: 'Frontend',
      level: 'Avançado',
      description: 'Estruturação acessível, semântica web e conformidade com padrões modernos.',
    },
    {
      name: 'CSS3 & Tailwind CSS',
      category: 'Frontend',
      level: 'Avançado',
      description: 'Design responsivo, layouts flexíveis, micro-interações e custom styling.',
    },
    {
      name: 'JavaScript (ES6+)',
      category: 'Frontend',
      level: 'Avançado',
      description: 'Manipulação de DOM, assincronismo (Promises/Async-Await), ESModules e lógica reativa.',
    },
    {
      name: 'Node.js',
      category: 'Backend',
      level: 'Intermediário',
      description: 'Desenvolvimento de APIs RESTful, runtime backend, módulos de servidor e rotas.',
    },
    {
      name: 'C# (.NET)',
      category: 'Linguagens',
      level: 'Intermediário',
      description: 'Programação Orientada a Objetos, tipos estáticos, estruturas de dados e regras de negócio.',
    },
    {
      name: 'JSON & Integrações',
      category: 'Fundamentos',
      level: 'Avançado',
      description: 'Modelagem de dados, serialização, comunicação cliente-servidor e arquitetura REST.',
    },
    {
      name: 'Lógica & Algoritmos',
      category: 'Fundamentos',
      level: 'Avançado',
      description: 'Complexidade de algoritmos, estruturas de dados, modularização e resolução metódica de problemas.',
    },
    {
      name: 'Git & Controle de Versão',
      category: 'Fundamentos',
      level: 'Intermediário',
      description: 'Gerenciamento de repositórios, branching, commits atômicos e colaboração.',
    },
  ] as TechSkill[],

  projects: [
    {
      id: 'proj-1',
      title: 'Plataforma de Gestão Acadêmica Integrada',
      description: 'Aplicação web completa para acompanhamento de grade curricular, notas e horários acadêmicos desenvolvida no contexto da PUC Minas.',
      longDescription: 'Projeto acadêmico focado em resolver a organização da rotina universitária. Desenvolvido com arquitetura cliente-servidor, permitindo controle de matrículas, cálculo automatizado de coeficientes de rendimento e geração de relatórios de desempenho.',
      technologies: ['C#', 'Node.js', 'JavaScript', 'HTML5', 'CSS3', 'JSON'],
      category: 'Acadêmico',
      githubUrl: 'https://github.com/guilherme/gestao-academica-puc',
      date: '2025',
      highlights: [
        'Modelagem relacional e estruturação de endpoints RESTful',
        'Validação rigorosa de regras de negócio em C#',
        'Interface responsiva com visualização clara de métricas acadêmicas',
      ],
      codeSnippet: `// Exemplo de modelagem e validação em C#
public class AlunoMatricula 
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nome { get; set; }
    public string Curso { get; set; } = "Sistemas de Informação";
    public decimal CoeficienteRendimento { get; private set; }

    public bool ValidarAprovacao(decimal notaFinal, int frequenciaPercentual) 
    {
        return notaFinal >= 60.0m && frequenciaPercentual >= 75;
    }
}`,
    },
    {
      id: 'proj-2',
      title: 'Sistema de Catálogo e Triagem de Dados em JSON',
      description: 'API e dashboard interativo para processamento assíncrono e filtragem de grandes massas de dados em Node.js e JavaScript.',
      longDescription: 'Solução desenvolvida para estudar algoritmos eficientes de busca e indexação em memória. Fornece paginação inteligente, filtros multicritério e exportação de relatórios estruturados.',
      technologies: ['Node.js', 'JavaScript', 'JSON', 'CSS Moderno'],
      category: 'Pessoal',
      githubUrl: 'https://github.com/guilherme/catalog-data-engine',
      date: '2025',
      highlights: [
        'Algoritmos de busca com complexidade O(n log n)',
        'Endpoints otimizados com cache e tratamento de exceções',
        'Interface leve com feedback visual em tempo real',
      ],
      codeSnippet: `// Node.js REST Handler para filtragem
export function filterRecords(dataset, criteria) {
  return dataset.filter(item => {
    return Object.entries(criteria).every(([key, val]) => {
      if (!val) return true;
      return String(item[key]).toLowerCase().includes(String(val).toLowerCase());
    });
  });
}`,
    },
    {
      id: 'proj-3',
      title: 'Portfólio Interativo Multi-Experiência',
      description: 'Ambiente web moderno que orquestra três identidades visuais distintas em uma única SPA performática.',
      longDescription: 'Aplicação construída com React, TypeScript e Tailwind CSS v4 para demonstrar versatilidade em design systems, controle de estado avançado e transições fluidas.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Motion'],
      category: 'Full-Stack',
      githubUrl: 'https://github.com/guilherme/portfolio-multi-experiencia',
      date: '2026',
      highlights: [
        'Arquitetura modular de componentes desacoplados',
        'Sistemas visuais completamente únicos por persona',
        'Acessibilidade e responsividade total para todos os dispositivos',
      ],
      codeSnippet: `// Switcher de Persona em TypeScript
export type Experience = 'home' | 'dev' | 'cavaleiro' | 'jogador';

export const useExperienceNav = () => {
  const [active, setActive] = useState<Experience>('home');
  return { active, navigateTo: setActive };
};`,
    },
    {
      id: 'proj-4',
      title: 'Motor de Algoritmos & Estruturas de Dados',
      description: 'Biblioteca didática implementando grafos, árvores binárias, listas encadeadas e algoritmos de ordenação em C# e JS.',
      longDescription: 'Projeto de consolidação teórica dos estudos acadêmicos na PUC Minas, contendo testes unitários e medição empírica de complexidade de tempo de execução.',
      technologies: ['C#', 'Algoritmos', 'Lógica de Programação'],
      category: 'Acadêmico',
      githubUrl: 'https://github.com/guilherme/algoritmos-estruturas',
      date: '2024 - 2025',
      highlights: [
        'Implementação de Quicksort, Mergesort e busca binária',
        'Estruturas de dados personalizadas com tipagem estrita',
        'Documentação técnica detalhada para fins de estudo',
      ],
    },
  ] as DevProject[],

  timeline: [
    {
      year: '2023',
      period: 'O Despertar da Lógica',
      title: 'Ingresso na PUC Minas Betim',
      subtitle: 'Bacharelado em Sistemas de Informação',
      description: 'Início dos estudos formais em ciência da computação e sistemas, mergulhando nos fundamentos de lógica matemática, algoritmos e resolução estruturada de problemas.',
      tags: ['PUC Minas Betim', 'Lógica', 'Algoritmos'],
    },
    {
      year: '2024',
      period: 'Fundamentos Web & Orientação a Objetos',
      title: 'Front-End Essencial & C#',
      subtitle: 'Construindo as primeiras aplicações',
      description: 'Aprofundamento nas linguagens fundamentais da Web (HTML, CSS, JavaScript) e introdução sólida à programação orientada a objetos com C# e manipulação de arquivos JSON.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'C# POO'],
    },
    {
      year: '2025',
      period: 'Servidores & Integrações',
      title: 'Back-End com Node.js & Arquitetura',
      subtitle: 'Construção de APIs e serviços',
      description: 'Desenvolvimento de microsserviços e APIs com Node.js, compreensão de protocolos HTTP, modularização e persistência de dados em aplicações acadêmicas e pessoais.',
      tags: ['Node.js', 'APIs REST', 'JSON', 'Git'],
    },
    {
      year: '2026',
      period: 'Engenharia de Software Completa',
      title: 'Full-Stack & Soluções Tecnológicas',
      subtitle: 'Prontidão para o mercado',
      description: 'Integração de ecossistemas Front e Back-End modernos, foco em clean code, UX intuitiva e desenvolvimento contínuo de projetos com impacto prático.',
      tags: ['Full-Stack', 'TypeScript', 'Sistemas de Informação'],
    },
  ] as TimelineMilestone[],
};

// -----------------------------------------------------------------------------
// DADOS DO CAVALEIRO
// -----------------------------------------------------------------------------
export const CAVALEIRO_DATA = {
  name: 'Guilherme',
  title: 'Cavaleiro & Criador',
  heritage: 'Universo Mangalarga Marchador',
  haras: 'Haras GMF',
  headline: 'Tradição, cadência e nobreza: a conexão visceral entre o homem e a marcha do cavalo brasileiro.',
  bio: 'Minha história com os cavalos não é apenas um hobby, é uma herança de dedicação, disciplina e respeito pela tradição. No universo do cavalo Mangalarga Marchador — raça legitimamente mineira e orgulho nacional —, construí uma trajetória marcada por rigor nos treinamentos, sintonia na sela e paixão pelas pistas. O Haras GMF representa a materialização desse amor diário pelo campo, pela genética e pelo aperfeiçoamento da marcha.',
  
  stats: [
    { value: '+20', label: 'Conquistas Oficiais', sub: 'Premiações em copas e exposições' },
    { value: 'Top 10', label: 'Exposição Nacional', sub: 'Entre os melhores do Brasil no Mangalarga Marchador' },
    { value: 'Top 6', label: 'CBM', sub: 'Campeonato Brasileiro de Marcha' },
    { value: '100%', label: 'Mangalarga Marchador', sub: 'Paixão e dedicação exclusiva à raça' },
  ],

  achievements: [
    {
      id: 'ach-1',
      title: 'Top 10 na Exposição Nacional',
      competition: 'Exposição Nacional do Mangalarga Marchador',
      category: 'Marcha & Morfologia',
      placement: 'Top 10 Nacional',
      year: 'Gameleira - BH',
      location: 'Belo Horizonte - MG',
      awardType: 'Roseta Oficial Nacional',
      highlight: true,
      description: 'Uma das mais disputadas pistas do mundo equestre, reunindo os maiores criatórios e cavaleiros de todo o território brasileiro no Parque de Exposições Bolívar de Andrade.',
    },
    {
      id: 'ach-2',
      title: 'Top 6 no Campeonato Brasileiro de Marcha (CBM)',
      competition: 'CBM — Campeonato Brasileiro de Marcha',
      category: 'Concurso de Marcha Oficial',
      placement: 'Top 6 Brasileiro',
      year: 'Consagração Nacional',
      location: 'Circuito Nacional',
      awardType: 'Faixa & Roseta CBM',
      highlight: true,
      description: 'Reconhecimento técnico máximo da cadência, regularidade e comodidade na prova máxima de marcha do país.',
    },
    {
      id: 'ach-3',
      title: 'Campeão — Copa de Marcha de Nova Serrana',
      competition: 'Copa de Marcha de Nova Serrana',
      category: 'Campeonato de Marcha',
      placement: 'Campeão Oficial',
      year: 'Copa Oficial',
      location: 'Nova Serrana - MG',
      awardType: 'Faixa de Campeão & Pódio',
      highlight: true,
      description: 'Vitória expressiva em pista acirrada, comemorada com equipe, familiares e amigos sob aplausos do público.',
    },
    {
      id: 'ach-4',
      title: 'Troféu Ferradura de Ouro — Haras Cores Castanheira',
      competition: 'Haras Cores Castanheira / Haras MZE',
      category: 'Marcha & Desempenho',
      placement: 'Troféu de Ouro',
      year: 'Prova Noturna',
      location: 'Circuito Mineiro',
      awardType: 'Troféu Ferradura de Ouro',
      highlight: true,
      description: 'Consagração em pista noturna ao lado do CTE Diogo Santos, comprovando cadência regular e sintonia na sela.',
    },
    {
      id: 'ach-5',
      title: 'Campeão Juvenil — Sete Lagoas',
      competition: 'Haras Cores Castanheira / Pegasus / Guabi',
      category: 'Categoria Juvenil',
      placement: 'Campeão Juvenil',
      year: 'Etapa Oficial',
      location: 'Sete Lagoas - MG',
      awardType: 'Faixa de Campeão Juvenil',
      highlight: true,
      description: 'Conquista de alto prestígio sob julgamento técnico rigoroso, comemorando com o time CTE Diogo Santos.',
    },
    {
      id: 'ach-6',
      title: 'Campeão — Prova Técnica de Lagoa Santa',
      competition: 'Lutz\'s Jeans / Três Barras Promoções & Eventos',
      category: 'Concurso de Marcha',
      placement: 'Campeão',
      year: 'Copa Especializada',
      location: 'Lagoa Santa - MG',
      awardType: 'Faixa Oficial & Troféu',
      highlight: false,
      description: 'Harmonia absoluta de rédeas, estabilidade de tronco e marcha refinada na pista de Lagoa Santa.',
    },
    {
      id: 'ach-7',
      title: '1º Lugar — 3ª Festa do Cavalo de Pitangui',
      competition: '3ª Festa do Cavalo de Pitangui',
      category: 'Campeonato de Pista',
      placement: '1º Lugar',
      year: 'Festa Tradicional',
      location: 'Pitangui - MG',
      awardType: 'Faixa Oficial de Pista',
      highlight: false,
      description: 'Festa tradicional com arquibancada vibrante e consagração do andamento marchado autêntico.',
    },
    {
      id: 'ach-8',
      title: 'Reservado Campeão — Copa de Marcha de Esmeraldas',
      competition: 'Copa de Marcha de Esmeraldas',
      category: 'Concurso Oficial de Marcha',
      placement: 'Reservado Campeão',
      year: 'Copa Regional',
      location: 'Esmeraldas - MG',
      awardType: 'Roseta de Prata & Faixa',
      highlight: false,
      description: 'Disputa acirrada de alto nível técnico, garantindo o vice-campeonato com montaria exemplar.',
    },
    {
      id: 'ach-9',
      title: 'Reservado Campeão — Haras Slim',
      competition: 'Copa de Marcha Oficial',
      category: 'Marcha & Morfologia',
      placement: 'Reservado Campeão',
      year: 'Copa Oficial',
      location: 'Pista de Provas',
      awardType: 'Placa Oficial de Premiação',
      highlight: false,
      description: 'Desempenho marcante evidenciando morfologia impecável, aprumos alinhados e extrema comodidade de sela.',
    },
    {
      id: 'ach-10',
      title: 'Reservado Campeão — Haras Realidade (Betim - MG)',
      competition: 'Haras Realidade / Guabi & Topminas',
      category: 'Performance & Marcha',
      placement: 'Reservado Campeão',
      year: 'Betim - MG',
      location: 'Betim - MG',
      awardType: 'Troféu Ferradura & Roseta',
      highlight: true,
      description: 'Pódio oficial de Reservado Campeão no tradicional Haras Realidade em Betim - MG, ao lado da equipe e comemoração com troféu ferradura.',
    },
    {
      id: 'ach-itauna',
      title: 'Campeão — Itaúna - MG',
      competition: 'Copa de Marcha de Itaúna / Guabi & Topminas',
      category: 'Campeonato de Marcha',
      placement: 'Campeão Oficial',
      year: 'Itaúna - MG',
      location: 'Itaúna - MG',
      awardType: 'Placa Campeão Guabi & Topminas',
      highlight: true,
      description: '“Todas as coisas cooperam para o bem daqueles que amam a Deus.” Celebração no topo do pódio com equipe e amigos.',
    },
    {
      id: 'ach-catasaltas',
      title: 'Campeão Juvenil — Morro D\'Água Quente (Catas Altas)',
      competition: 'Pousada do Cowboy (1º Lugar)',
      category: 'Campeonato Juvenil',
      placement: 'Campeão Juvenil',
      year: 'Catas Altas - MG',
      location: 'Catas Altas - MG',
      awardType: 'Troféu 1º Lugar Pousada do Cowboy',
      highlight: true,
      description: 'Apresentação primorosa na sela em pista noturna iluminada, conquistando o 1º lugar juvenil sob aplausos.',
    },
    {
      id: 'ach-itabira',
      title: '1º Prêmio Juvenil — Itabira - MG',
      competition: 'NCCMMCLM (Núcleo do Centro Leste Mineiro)',
      category: 'Categoria Juvenil Oficial',
      placement: '1º Prêmio',
      year: 'Itabira - MG',
      location: 'Itabira - MG',
      awardType: 'Faixa e Placa Oficial NCCMMCLM',
      highlight: true,
      description: 'Reconhecimento oficial do Núcleo do Centro Leste Mineiro com faixa oficial de 1º prêmio em arena de exposições.',
    },
    {
      id: 'ach-santaritadurao',
      title: 'Reservado Campeão Juvenil — Santa Rita Durão - MG',
      competition: 'Marchadores dos Inconfidentes',
      category: 'Categoria Juvenil',
      placement: 'Reservado Campeão',
      year: 'Santa Rita Durão - MG',
      location: 'Santa Rita Durão - MG',
      awardType: 'Placa Reservado Vidro Box',
      highlight: false,
      description: 'Pódio em noite memorável com a comissão dos Marchadores dos Inconfidentes ao lado da família e amigos.',
    },
    {
      id: 'ach-saogoncalo',
      title: 'Reservado Campeão — São Gonçalo do Rio Abaixo - MG',
      competition: 'Pousada do Cowboy (2º Lugar)',
      category: 'Concurso Oficial de Marcha',
      placement: 'Reservado Campeão',
      year: 'São Gonçalo do Rio Abaixo - MG',
      location: 'São Gonçalo do Rio Abaixo - MG',
      awardType: 'Troféu 2º Lugar & Premiação Oficial',
      highlight: false,
      description: 'Grande prova noturna em São Gonçalo do Rio Abaixo, garantindo o vice-campeonato com faixa e roseta.',
    },
    {
      id: 'ach-12',
      title: '3º Lugar Oficial — Mariana - MG',
      competition: '2º Aniversário Amigos da Marcha',
      category: 'Prova Técnica',
      placement: '3º Lugar',
      year: 'Etapa Histórica',
      location: 'Mariana - MG',
      awardType: 'Roseta Oficial e Colete',
      highlight: false,
      description: 'Subida ao pódio com registro comovente junto à família na primeira capital histórica de Minas Gerais.',
    },
    {
      id: 'ach-13',
      title: '+20 Premiações Regionais e Títulos em Minas Gerais',
      competition: 'Exposições Especializadas, Copas de Marcha e Poeirões',
      category: 'Trajetória Contínua',
      placement: '+20 Conquistas',
      year: 'Minas Gerais',
      location: 'Diversos Municípios - MG',
      awardType: 'Troféus, Faixas & Rosetas',
      highlight: false,
      description: 'Constância nas pistas mineiras através de disciplina, ética com o animal e evolução contínua da montaria.',
    },
  ] as EquestrianAchievement[],

  pillars: [
    {
      title: 'A Raça Mangalarga Marchador',
      description: 'Nascida no sul de Minas Gerais, a raça é sinônimo de comodidade sem igual no mundo. O andamento marchado, com apoios alternados e ausência de trote, proporciona uma sela suave incomparável.',
    },
    {
      title: 'Haras GMF (Santa Bárbara - MG)',
      description: 'Onde o trabalho começa todos os dias ao amanhecer. Seleção criteriosa, bem-estar animal, nutrição balanceada e respeito absoluto ao desenvolvimento natural de cada potro e exemplar.',
    },
    {
      title: 'Manejo & Treinamento de Sela',
      description: 'Dedicação diária ao treinamento ético, à cadência natural da marcha e à harmonia entre cavaleiro e animal, sempre com respeito ao tempo e temperamento de cada cavalo.',
    },
  ],

  breederQuotes: [
    {
      author: 'Tradição dos Criadores Mineiros',
      role: 'Sabedoria da Criação',
      quote: '“Criar o cavalo Mangalarga Marchador é esculpir com genética, paciência e paixão a arte que a gente cavalga todos os dias.”',
    },
    {
      author: 'Haras GMF (Santa Bárbara - MG)',
      role: 'Filosofia de Sela',
      quote: '“A marcha não se força, ela se lapida. O melhor cavalo é aquele que anda macio para o cavaleiro e sereno no seu coração.”',
    },
    {
      author: 'Universo Mangalarga Marchador',
      role: 'Herança & Pedigree',
      quote: '“O verdadeiro pedigree não está só no papel de registro, mas na nobreza dos aprumos, na docilidade dos olhos e na cadência perfeita da pata na terra.”',
    },
    {
      author: 'Guilherme Marques Ferreira',
      role: 'Cavaleiro & Criador',
      quote: '“Cada título representa centenas de horas de treino, suor, dedicação e, acima de tudo, DEUS me abençoando.”',
    },
  ],

  gallery: [
    // 1. Nova Serrana
    {
      id: 'photo-1-novaserrana',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_23.36.31__3__9fc272e5.jpeg',
      title: '1. Copa de Marcha — Nova Serrana',
      subtitle: 'Nova Serrana - MG · Pódio oficial com equipe, amigos e família',
      category: 'Competições',
      year: 'Copa de Marcha',
      location: 'Nova Serrana - MG',
    },
    // 2. Haras Cores Castanheira
    {
      id: 'photo-2-corescastanheira',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_23.36.31__4__3d4ed82d.jpeg',
      title: '2. Haras Cores Castanheira — Campeão',
      subtitle: 'Troféu Ferradura de Ouro · Haras Cores Castanheira / Haras MZE / CTE Diogo Santos',
      category: 'Competições',
      year: 'Premiação Noturna',
      location: 'Circuito Mineiro',
    },
    // 3. Lagoa Santa
    {
      id: 'photo-3-lagoasanta',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_23.36.31__1__e4370ebb.jpeg',
      title: '3. Campeão — Lagoa Santa - MG',
      subtitle: 'Lagoa Santa - MG · Lutz\'s Jeans / Três Barras Promoções & Eventos',
      category: 'Competições',
      year: 'Lagoa Santa - MG',
      location: 'Lagoa Santa - MG',
    },
    // 4. Pitangui
    {
      id: 'photo-4-pitangui',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_23.36.30_1aca1d1e.jpeg',
      title: '4. 3ª Festa do Cavalo — Pitangui - MG',
      subtitle: 'Pitangui - MG · Celebração da vitória em pista com faixa de campeão',
      category: 'Competições',
      year: 'Festa do Cavalo',
      location: 'Pitangui - MG',
    },
    // 5. Agradecimentos
    {
      id: 'photo-5-agradecimentos',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_23.36.31_9f140f12.jpeg',
      title: '5. Agradecimentos — Fé e Devoção em Pista',
      subtitle: 'Momento de oração, agradecimento e respeito na sela ao término da prova oficial',
      category: 'Haras GMF',
      year: 'Noturna',
      location: 'Pista Oficial',
    },
    // 6. Entregue a Deus
    {
      id: 'photo-6-entregueadeus',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_23.36.31__5__cf6fa10f.jpeg',
      title: '6. Entregue a Deus — Salmos 37:5',
      subtitle: '“Entregue o seu caminho ao Senhor, confie nele, e ele tudo fará.” Devoção e bênção sobre a criação.',
      category: 'Haras GMF',
      year: 'Devoção',
      location: 'Nossa Senhora Aparecida',
    },
    // 7. Haras Cores Castanheira em Sete Lagoas
    {
      id: 'photo-8-setelagoas',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_13.34.55__6__cb5bb131.jpeg',
      title: '7. Campeão Juvenil — Haras Cores Castanheira (Sete Lagoas)',
      subtitle: 'Sete Lagoas - MG · Haras Cores Castanheira · Pegasus Promoções · CTE Diogo Santos · Guabi',
      category: 'Competições',
      year: 'Campeão Juvenil',
      location: 'Sete Lagoas - MG',
    },
    // Exposição Nacional em BH (substituindo Haras Realidade conforme instrução do usuário)
    {
      id: 'photo-9-exposicaonacional',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_23.36.31__2__b9955495.jpeg',
      title: 'Exposição Nacional em BH',
      subtitle: 'Belo Horizonte - MG · Parque da Gameleira · Exposição Nacional do Cavalo Mangalarga Marchador. A maior pista da raça no Brasil.',
      category: 'Competições',
      year: 'Nacional BH',
      location: 'Belo Horizonte - MG',
    },
    // Novas Fotos das Competições Oficiais Enviadas pelo Usuário
    {
      id: 'photo-itauna-campeao',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_22.12.11__3__50375412.jpeg',
      title: 'Campeão — Itaúna - MG',
      subtitle: 'Itaúna - MG · Guabi Equinos & Topminas · “Todas as coisas cooperam para o bem daqueles que amam a Deus.” Celebração no pódio com equipe e amigos.',
      category: 'Competições',
      year: 'Itaúna - MG',
      location: 'Itaúna - MG',
    },
    {
      id: 'photo-catasaltas-juvenil',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_22.12.11__1__ff77568c.jpeg',
      title: 'Campeão Juvenil — Morro D\'Água Quente (Catas Altas)',
      subtitle: 'Morro D\'Água Quente · Catas Altas - MG · Pousada do Cowboy (1º Lugar) · Apresentação impecável na sela e título de campeão juvenil.',
      category: 'Competições',
      year: 'Catas Altas - MG',
      location: 'Catas Altas - MG',
    },
    {
      id: 'photo-itabira-1premio',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_22.12.11_78f32fd7.jpeg',
      title: '1º Prêmio Juvenil — Itabira - MG',
      subtitle: 'Itabira - MG · NCCMMCLM (Núcleo do Centro Leste Mineiro) · Faixa oficial e pódio na arena de apresentações.',
      category: 'Competições',
      year: 'Itabira - MG',
      location: 'Itabira - MG',
    },
    {
      id: 'photo-santaritadurao-reservado',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_22.12.11__2__41b85bcf.jpeg',
      title: 'Reservado Campeão Juvenil — Santa Rita Durão - MG',
      subtitle: 'Santa Rita Durão - MG · Marchadores dos Inconfidentes · Pódio com troféu Vidro Box, comemoração com amigos e equipe.',
      category: 'Competições',
      year: 'Santa Rita Durão - MG',
      location: 'Santa Rita Durão - MG',
    },
    {
      id: 'photo-mariana-juvenil',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_22.12.11__4__71b7a41d.jpeg',
      title: 'Reservado Campeão Juvenil — Mariana - MG',
      subtitle: 'Mariana - MG · Semana do Cavalo · Amigos da Marcha · Pódio oficial noturno de Reservado Campeão Juvenil ao lado da família e treinador.',
      category: 'Competições',
      year: 'Mariana - MG',
      location: 'Mariana - MG',
    },
    {
      id: 'photo-saogoncalo-reservado',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_22.12.11__5__0fd7685c.jpeg',
      title: 'Reservado Campeão — São Gonçalo do Rio Abaixo - MG',
      subtitle: 'São Gonçalo do Rio Abaixo - MG · Pousada do Cowboy (2º Lugar) · Premiação oficial em pista noturna com faixa e roseta.',
      category: 'Competições',
      year: 'São Gonçalo do Rio Abaixo - MG',
      location: 'São Gonçalo do Rio Abaixo - MG',
    },
    // Esmeraldas
    {
      id: 'photo-10-esmeraldas',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_13.34.55__3__b4423d6d.jpeg',
      title: 'Reservado Campeão — Esmeraldas - MG',
      subtitle: 'Esmeraldas - MG · CTE Diogo Santos · Cacia Couros · Pegasus · LDA · Pódio com equipe',
      category: 'Competições',
      year: 'Esmeraldas - MG',
      location: 'Esmeraldas - MG',
    },
    // Pequi
    {
      id: 'photo-11-pequi',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_13.34.55__2__1ea73b90.jpeg',
      title: 'Reservado Campeão — Pequi - MG',
      subtitle: 'Pequi - MG · Troféu Robson Rodrigues Eventos Equestres · Comemoração com a equipe',
      category: 'Competições',
      year: 'Pequi - MG',
      location: 'Pequi - MG',
    },
    // Santa Rita da Mata
    {
      id: 'photo-12-santaritadamata',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_13.34.55__5__725beca3.jpeg',
      title: 'Reservado Campeão — Santa Rita da Mata',
      subtitle: 'Santa Rita da Mata - MG · CTE Hotel da Mata · Grande Raça Mangalarga Marchador',
      category: 'Competições',
      year: 'Santa Rita da Mata',
      location: 'Santa Rita da Mata - MG',
    },
    // Haras Slim
    {
      id: 'photo-13-harasslim',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_13.34.55_f56e3470.jpeg',
      title: 'Reservado Campeão — Haras Slim',
      subtitle: 'Morfologia exemplar e marcha de comodidade superior. Descrição do animal: porte nobre, aprumos alinhados e temperamento de sela dócil. Nutrição Soma & Pegasus.',
      category: 'Competições',
      year: 'Copa de Marcha',
      location: 'Pista de Provas',
    },
    // Reservado Campeão — Haras Realidade (Betim - MG)
    {
      id: 'photo-14-guabitopminas',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_13.34.55__4__c0df436c.jpeg',
      title: 'Reservado Campeão — Haras Realidade (Betim - MG)',
      subtitle: 'Betim - MG · Haras Realidade · Guabi Equinos & Topminas · Pódio oficial de Reservado Campeão com troféu ferradura, equipe e amigos',
      category: 'Competições',
      year: 'Betim - MG',
      location: 'Betim - MG',
    },
    // Mariana
    {
      id: 'photo-16-mariana',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_13.34.55__1__3eb4d62e.jpeg',
      title: 'Premiação Oficial em Mariana - MG',
      subtitle: 'Mariana - MG · 3º Lugar em prova técnica oficial com colete, roseta e celebração com a família',
      category: 'Competições',
      year: 'Mariana - MG',
      location: 'Mariana - MG',
    },
    // Haras GMF — Marca Oficial
    {
      id: 'photo-17-harasgmflogo',
      url: IMAGES.harasGmfLogo,
      title: 'Haras GMF — Brasão e Marca Oficial',
      subtitle: 'Santa Bárbara - MG · Seleção, Genética e Tradição do Cavalo Mangalarga Marchador',
      category: 'Haras GMF',
      year: 'Oficial',
      location: 'Santa Bárbara - MG',
    },
  ] as EquestrianPhoto[],
};

// -----------------------------------------------------------------------------
// DADOS DO JOGADOR
// -----------------------------------------------------------------------------
export const JOGADOR_DATA = {
  name: 'Guilherme',
  nickname: 'Galo Doido & Camisa 10',
  club: 'Clube Atlético Mineiro (Galo)',
  stadium: 'Arena MRV / Mineirão',
  headline: 'Raça, amor e a intensidade pura de quem vive e respira futebol a cada toque na bola.',
  bio: 'O futebol para mim é muito mais do que um jogo: é sentimento, ritmo e entrega total. Seja dentro das quatro linhas nas peladas e campeonatos de fim de semana — buscando o passe decisivo, a intensidade na marcação e a alegria do gol —, seja nas arquibancadas empurrando o Clube Atlético Mineiro com o coração na ponta da chuteira. O amor pelo Galo e a vivência do gramado moldam meu espírito coletivo e a garra para nunca desistir.',

  stats: [
    { label: 'Time do Coração', value: 'Atlético Mineiro', detail: 'Paixão Alvinegra Eterna' },
    { label: 'Templo Sagrado', value: 'Arena MRV', detail: 'Casa da Massa Atleticana' },
    { label: 'Posição em Campo', value: 'Meio-Campo', detail: 'Visão de jogo & dinâmica' },
    { label: 'Mentalidade', value: 'Raça & Entrega', detail: 'Até o apito final' },
  ],

  moments: [
    {
      id: 'mom-1',
      title: 'A Devoção pelo Clube Atlético Mineiro',
      subtitle: 'Uma paixão que corre no sangue',
      date: 'Desde Sempre',
      type: 'Galo',
      description: 'Acompanhar o Galo em cada batalha, vibrando com títulos históricos, com a força da Massa e com a nova era na Arena MRV. O hino, o manto listrado e o sentimento de orgulho que nenhuma palavra explica.',
      stadiumOrPlace: 'Arena MRV / Belo Horizonte',
      scoreOrContext: 'Paixão Incondicional',
    },
    {
      id: 'mom-2',
      title: 'A Pelada Sagrada & Torneios de Fim de Semana',
      subtitle: 'O cheiro da grama e a resenha entre amigos',
      date: 'Fins de Semana',
      type: 'Pelada',
      description: 'O momento sagrado de calçar as chuteiras, reunir a rapaziada e entrar em campo com seriedade de final de campeonato. A troca de passes rápidos, a disputa de cada bola e a resenha impagável após o apito.',
      stadiumOrPlace: 'Campos de Betim & Região Metropolitana',
      scoreOrContext: 'Futebol de Raiz',
    },
    {
      id: 'mom-3',
      title: 'Decisões Marcantes & Gols no Último Minuto',
      subtitle: 'Quando a adrenalina atinge o ápice',
      date: 'Torneios Amadores',
      type: 'Torneio',
      description: 'A sensação indescritível de balançar a rede numa partida equilibrada, acertar aquele passe milimétrico entre as linhas de defesa e celebrar a vitória com os companheiros de equipe.',
      stadiumOrPlace: 'Gramados Locais',
      scoreOrContext: 'Espírito Competitivo',
    },
  ] as FootballMoment[],

  playerCard: {
    number: '10 / 8',
    position: 'Meio-Campista (Armação & Transição)',
    preferredFoot: 'Destro',
    style: 'Visão panorâmica de jogo, passe rápido entre linhas, distribuição de jogo e dedicação defensiva no apoio.',
    attributes: [
      { name: 'Visão de Jogo', score: 90 },
      { name: 'Passe & Lançamento', score: 88 },
      { name: 'Raça & Espírito Coletivo', score: 95 },
      { name: 'Intensidade & Fôlego', score: 85 },
      { name: 'Paixão pelo Jogo', score: 100 },
    ],
  },

  gallery: [
    {
      id: 'fb-1',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-07_at_00.02.27__1__8b6879a9.jpeg',
      title: 'Em Campo: Camisa 15 Cooperminas',
      description: 'Meio-campo em ação, visão de jogo e dinamismo na transição rápida.',
      tag: 'Campo',
      year: 'Em Campo',
    },
    {
      id: 'fb-2',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-07_at_00.02.27_d2806812.jpeg',
      title: 'Treinamento & Finalização no Gol',
      description: 'Controle de bola e precisão na batida (@SoccerTrainer).',
      tag: 'Treino',
      year: 'Treinamento',
    },
    {
      id: 'fb-3',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-07_at_00.02.28_3e51390b.jpeg',
      title: 'Arena MRV: A Estátua do Galo Doido',
      description: 'Dia de jogo na esplanada da Arena MRV com a Massa Atleticana.',
      tag: 'Galo',
      year: 'Arena MRV',
    },
    {
      id: 'fb-4',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_13.18.38__2__7c605241.jpeg',
      title: 'Noite de Decisão na Arena MRV',
      description: 'A atmosfera eletrizante com fumaça branca, sinalizadores vermelhos e cantos ininterruptos.',
      tag: 'Galo',
      year: 'Noite de Copa',
    },
    {
      id: 'fb-5',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_13.18.38__1__1dedaefd.jpeg',
      title: 'A Chegada do Ônibus do Atlético Mineiro',
      description: 'Recepção calorosa da torcida cercando o ônibus do Galo com o mascote na cabine.',
      tag: 'Galo',
      year: 'Recepção',
    },
    {
      id: 'fb-6',
      url: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_13.18.38_e8de2841.jpeg',
      title: 'A Massa Atleticana nas Ruas de Acesso',
      description: 'Ruas tomadas pela torcida alvinegra em direção ao estádio da Arena MRV.',
      tag: 'Galo',
      year: 'Matchday',
    },
  ] as FootballPhoto[],
};
