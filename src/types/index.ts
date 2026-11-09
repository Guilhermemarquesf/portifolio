export type ExperienceType = 'home' | 'dev' | 'cavaleiro' | 'jogador' | 'vida';

export interface TechSkill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Linguagens' | 'Fundamentos';
  level: string;
  iconName?: string;
  description: string;
}

export interface DevProject {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: 'Acadêmico' | 'Pessoal' | 'Full-Stack';
  githubUrl: string;
  liveUrl?: string;
  date: string;
  highlights: string[];
  codeSnippet?: string;
}

export interface TimelineMilestone {
  year: string;
  period: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
}

export interface EquestrianAchievement {
  id: string;
  title: string;
  competition: string;
  category: string;
  placement: string;
  year: string;
  horse?: string;
  location?: string;
  awardType?: string;
  highlight?: boolean;
  description: string;
}

export interface EquestrianPhoto {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  category: 'Marchador' | 'Competições' | 'Haras GMF';
  year: string;
  location: string;
}

export interface FootballMoment {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  type: 'Galo' | 'Pelada' | 'Torneio';
  description: string;
  stadiumOrPlace: string;
  scoreOrContext: string;
}

export interface FootballPhoto {
  id: string;
  url: string;
  title: string;
  description: string;
  tag: 'Galo' | 'Campo' | 'Treino' | 'Mantos';
  year: string;
}
