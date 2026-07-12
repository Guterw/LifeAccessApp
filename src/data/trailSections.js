// src/data/trailSections.js
// Metadados visuais de cada seção da trilha. Cada entrada corresponde a uma
// seção (bloco de nós terminado por um node "_boss"). Se houver mais seções
// no ENGLISH_TRAIL do que entradas aqui, o TrailView cicla os temas
// automaticamente (módulo) e gera um título genérico "Seção N" — então
// adicionar uma Seção 7, 8... no futuro NUNCA quebra a tela, mesmo sem
// editar este arquivo.

export const TRAIL_SECTIONS_META = [
  {
    title: { pt: 'Seção 1', en: 'Section 1', es: 'Sección 1' },
    subtitle: { pt: 'Os Fundamentos', en: 'The Fundamentals', es: 'Los Fundamentos' },
    theme: 'night',
  },
  {
    title: { pt: 'Seção 2', en: 'Section 2', es: 'Sección 2' },
    subtitle: { pt: 'Preparação para Dublin', en: 'Preparing for Dublin', es: 'Preparación para Dublín' },
    theme: 'forest',
  },
  {
    title: { pt: 'Seção 3', en: 'Section 3', es: 'Sección 3' },
    subtitle: { pt: 'Trabalho e Candidatura', en: 'Work & Job Hunting', es: 'Trabajo y Búsqueda de Empleo' },
    theme: 'sunset',
  },
  {
    title: { pt: 'Seção 4', en: 'Section 4', es: 'Sección 4' },
    subtitle: { pt: 'Moradia e Vida Social', en: 'Housing & Social Life', es: 'Vivienda y Vida Social' },
    theme: 'ocean',
  },
  {
    title: { pt: 'Seção 5', en: 'Section 5', es: 'Sección 5' },
    subtitle: { pt: 'Gírias e Fluência', en: 'Slang & Fluency', es: 'Jerga y Fluidez' },
    theme: 'volcano',
  },
  {
    title: { pt: 'Seção 6', en: 'Section 6', es: 'Sección 6' },
    subtitle: { pt: 'Subindo de Level', en: 'Leveling Up', es: 'Subiendo de Nivel' },
    theme: 'aurora',
  },
];

// Ordem cíclica de temas usada quando uma seção não tem metadata explícita
export const THEME_CYCLE_ORDER = ['night', 'forest', 'sunset', 'ocean', 'volcano', 'aurora'];

export const SECTION_THEMES = {
  night: {
    bgGradient: 'from-slate-950 via-indigo-950 to-[#2e1065]',
    decorColor: 'text-indigo-300/20',
    decorColor2: 'text-indigo-200/10',
    decorColor3: 'text-purple-300/30',
    cardBg: 'bg-indigo-900/50',
    cardBorder: 'border-indigo-400/30',
    cardShadow: 'shadow-[0_0_50px_rgba(79,70,229,0.3)]',
    titleGradient: 'from-blue-200 via-indigo-200 to-purple-200',
    subtitleColor: 'text-indigo-300',
    lineColorClass: 'border-indigo-900/30',
    lineActiveColorClass: 'border-indigo-400',
    lineGlowRgba: 'rgba(129, 140, 248, 1)',
    waveFill: '#022c22',
    decorIcon: 'Moon',
  },
  forest: {
    bgGradient: 'from-[#022c22] via-teal-950 to-slate-950',
    decorColor: 'text-teal-300/10',
    decorColor2: 'text-emerald-400/10',
    decorColor3: 'text-teal-200/5',
    cardBg: 'bg-teal-900/50',
    cardBorder: 'border-teal-400/30',
    cardShadow: 'shadow-[0_0_50px_rgba(20,184,166,0.3)]',
    titleGradient: 'from-emerald-200 via-teal-200 to-cyan-200',
    subtitleColor: 'text-teal-300',
    lineColorClass: 'border-teal-900/30',
    lineActiveColorClass: 'border-teal-400',
    lineGlowRgba: 'rgba(45, 212, 191, 1)',
    waveFill: '#431407',
    decorIcon: 'TreePine',
  },
  sunset: {
    bgGradient: 'from-[#431407] via-orange-950 to-[#7c2d12]',
    decorColor: 'text-orange-300/20',
    decorColor2: 'text-amber-200/10',
    decorColor3: 'text-red-300/10',
    cardBg: 'bg-orange-900/50',
    cardBorder: 'border-orange-400/30',
    cardShadow: 'shadow-[0_0_50px_rgba(234,88,12,0.3)]',
    titleGradient: 'from-amber-200 via-orange-200 to-red-200',
    subtitleColor: 'text-orange-300',
    lineColorClass: 'border-orange-900/30',
    lineActiveColorClass: 'border-orange-400',
    lineGlowRgba: 'rgba(251,146,60,1)',
    waveFill: '#0c4a6e',
    decorIcon: 'Sun',
  },
  ocean: {
    bgGradient: 'from-[#0c4a6e] via-sky-950 to-slate-950',
    decorColor: 'text-sky-300/20',
    decorColor2: 'text-cyan-200/10',
    decorColor3: 'text-blue-200/10',
    cardBg: 'bg-sky-900/50',
    cardBorder: 'border-sky-400/30',
    cardShadow: 'shadow-[0_0_50px_rgba(14,165,233,0.3)]',
    titleGradient: 'from-cyan-200 via-sky-200 to-blue-200',
    subtitleColor: 'text-sky-300',
    lineColorClass: 'border-sky-900/30',
    lineActiveColorClass: 'border-sky-400',
    lineGlowRgba: 'rgba(56,189,248,1)',
    waveFill: '#450a0a',
    decorIcon: 'Waves',
  },
  volcano: {
    bgGradient: 'from-[#450a0a] via-red-950 to-[#450a0a]',
    decorColor: 'text-red-300/20',
    decorColor2: 'text-orange-300/10',
    decorColor3: 'text-yellow-200/10',
    cardBg: 'bg-red-900/50',
    cardBorder: 'border-red-400/30',
    cardShadow: 'shadow-[0_0_50px_rgba(239,68,68,0.3)]',
    titleGradient: 'from-red-200 via-orange-200 to-yellow-200',
    subtitleColor: 'text-red-300',
    lineColorClass: 'border-red-900/30',
    lineActiveColorClass: 'border-red-400',
    lineGlowRgba: 'rgba(248,113,113,1)',
    waveFill: '#3b0764',
    decorIcon: 'Flame',
  },
  aurora: {
    bgGradient: 'from-[#3b0764] via-purple-950 to-slate-950',
    decorColor: 'text-purple-300/20',
    decorColor2: 'text-pink-300/10',
    decorColor3: 'text-indigo-200/10',
    cardBg: 'bg-purple-900/50',
    cardBorder: 'border-purple-400/30',
    cardShadow: 'shadow-[0_0_50px_rgba(168,85,247,0.3)]',
    titleGradient: 'from-pink-200 via-purple-200 to-indigo-200',
    subtitleColor: 'text-purple-300',
    lineColorClass: 'border-purple-900/30',
    lineActiveColorClass: 'border-purple-400',
    lineGlowRgba: 'rgba(216,180,254,1)',
    waveFill: '#020617',
    decorIcon: 'Sparkles',
  },
};

// Retorna sempre um tema+título válidos, mesmo para seções sem metadata
// explícita (index além do array) — cicla os temas e gera título genérico.
export function getSectionMeta(sectionIndex) {
  const explicit = TRAIL_SECTIONS_META[sectionIndex];
  if (explicit) return explicit;

  const themeKey = THEME_CYCLE_ORDER[sectionIndex % THEME_CYCLE_ORDER.length];
  return {
    title: { pt: `Seção ${sectionIndex + 1}`, en: `Section ${sectionIndex + 1}`, es: `Sección ${sectionIndex + 1}` },
    subtitle: { pt: 'Novos Desafios', en: 'New Challenges', es: 'Nuevos Desafíos' },
    theme: themeKey,
  };
}