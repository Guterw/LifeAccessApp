// src/data/englishTrail.js

export const ENGLISH_TRAIL = [
  // ==========================================
  // SEÇÃO 1: OS FUNDAMENTOS (10 Fases + 1 Boss)
  // ==========================================
  { 
    id: 'node_1', type: 'alphabet', targetIndex: 0, 
    title: { pt: 'Vogais (A-E)', en: 'Vowels (A-E)', es: 'Vocales (A-E)' },
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type',
    path: '/english/alpha-numbers/exercise/alphabet/0'
  },
  { 
    id: 'node_2', type: 'numbers', targetIndex: 0, 
    title: { pt: 'Números 0 a 9', en: 'Numbers 0-9', es: 'Números 0-9' },
    color: 'bg-indigo-600', shadow: 'shadow-indigo-600/50', icon: 'Hash',
    path: '/english/alpha-numbers/exercise/numbers/0'
  },
  { 
    id: 'node_3', type: 'vocab', targetId: 1, 
    title: { pt: 'Saudações', en: 'Greetings', es: 'Saludos' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle',
    path: '/level/1' 
  },
  { 
    id: 'node_4', type: 'alphabet', targetIndex: 1, 
    title: { pt: 'Letras F ao J', en: 'Letters F-J', es: 'Letras F-J' },
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type',
    path: '/english/alpha-numbers/exercise/alphabet/1'
  },
  { 
    id: 'node_5', type: 'vocab', targetId: 2, 
    title: { pt: 'Pessoas e Família', en: 'People & Family', es: 'Personas y Familia' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'Users',
    path: '/level/2'
  },
  { 
    id: 'node_6', type: 'numbers', targetIndex: 1, 
    title: { pt: 'Números 10 a 19', en: 'Numbers 10-19', es: 'Números 10-19' },
    color: 'bg-indigo-600', shadow: 'shadow-indigo-600/50', icon: 'Hash',
    path: '/english/alpha-numbers/exercise/numbers/1'
  },
  { 
    id: 'node_7', type: 'alphabet', targetIndex: 2, 
    title: { pt: 'Letras K ao R', en: 'Letters K-R', es: 'Letras K-R' },
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type',
    path: '/english/alpha-numbers/exercise/alphabet/2'
  },
  { 
    id: 'node_8', type: 'vocab', targetId: 3, 
    title: { pt: 'Objetos Diários', en: 'Everyday Objects', es: 'Objetos Diarios' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle',
    path: '/level/3'
  },
  { 
    id: 'node_9', type: 'alphabet', targetIndex: 3, 
    title: { pt: 'Reta Final (S-Z)', en: 'Final Stretch (S-Z)', es: 'Recta Final (S-Z)' },
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type',
    path: '/english/alpha-numbers/exercise/alphabet/3'
  },
  { 
    id: 'node_10', type: 'alphabet', targetIndex: 4, 
    title: { pt: 'Spelling Bee', en: 'Spelling Bee', es: 'Concurso de Deletreo' },
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type',
    path: '/english/alpha-numbers/exercise/alphabet/4'
  },
  // BOSS SEÇÃO 1
  { 
    id: 'node_11_boss', type: 'task', targetId: 'chat_intro', 
    title: { pt: 'Boss: Apresente-se (Chat)', en: 'Boss: Introduce Yourself', es: 'Jefe: Preséntate' },
    color: 'bg-red-600', shadow: 'shadow-red-600/60', icon: 'Bot',
    path: '/english/ai-chat/task/chat_intro'
  },

  // ==========================================
  // SEÇÃO 2: PREPARAÇÃO PARA DUBLIN (10 Fases + 1 Boss)
  // ==========================================
  { 
    id: 'node_12', type: 'vocab', targetId: 4, 
    title: { pt: 'Comida e Bebida', en: 'Food & Drinks', es: 'Comida y Bebida' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'Coffee',
    path: '/level/4'
  },
  { 
    id: 'node_13', type: 'numbers', targetIndex: 2, 
    title: { pt: 'Dezenas 20 a 100', en: 'Tens 20 to 100', es: 'Decenas 20 a 100' },
    color: 'bg-indigo-600', shadow: 'shadow-indigo-600/50', icon: 'Hash',
    path: '/english/alpha-numbers/exercise/numbers/2'
  },
  { 
    id: 'node_14', type: 'alphabet', targetIndex: 5, 
    title: { pt: 'Spelling: Intermediário', en: 'Spelling: Intermediate', es: 'Deletreo: Intermedio' },
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type',
    path: '/english/alpha-numbers/exercise/alphabet/5'
  },
  { 
    id: 'node_15', type: 'vocab', targetId: 5, 
    title: { pt: 'Empregos e Rotina', en: 'Jobs & Routine', es: 'Trabajos y Rutina' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'Users',
    path: '/level/5'
  },
  { 
    id: 'node_16', type: 'numbers', targetIndex: 3, 
    title: { pt: 'Centenas e Milhares', en: 'Hundreds & Thousands', es: 'Cientos y Miles' },
    color: 'bg-indigo-600', shadow: 'shadow-indigo-600/50', icon: 'Hash',
    path: '/english/alpha-numbers/exercise/numbers/3'
  },
  { 
    id: 'node_17', type: 'vocab', targetId: 6, 
    title: { pt: 'Viagem e Aeroporto', en: 'Travel & Airport', es: 'Viaje y Aeropuerto' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle',
    path: '/level/6'
  },
  { 
    id: 'node_18', type: 'alphabet', targetIndex: 6, 
    title: { pt: 'Spelling: Avançado', en: 'Spelling: Advanced', es: 'Deletreo: Avanzado' },
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type',
    path: '/english/alpha-numbers/exercise/alphabet/6'
  },
  { 
    id: 'node_19', type: 'vocab', targetId: 7, 
    title: { pt: 'Tempo e Datas', en: 'Time & Dates', es: 'Tiempo y Fechas' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle',
    path: '/level/7'
  },
  { 
    id: 'node_20', type: 'alphabet', targetIndex: 7, 
    title: { pt: 'Spelling: Master', en: 'Spelling: Master', es: 'Deletreo: Maestro' },
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type',
    path: '/english/alpha-numbers/exercise/alphabet/7'
  },
  { 
    id: 'node_21', type: 'vocab', targetId: 8, 
    title: { pt: 'Direções e Lugares', en: 'Directions & Places', es: 'Direcciones y Lugares' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle',
    path: '/level/8'
  },
  // BOSS SEÇÃO 2
  { 
    id: 'node_22_boss', type: 'task', targetId: 'voice_coffee', 
    title: { pt: 'Boss: Peça um Café (Voz)', en: 'Boss: Order a Coffee (Voice)', es: 'Jefe: Pide un Café (Voz)' },
    color: 'bg-red-600', shadow: 'shadow-red-600/60', icon: 'Bot',
    path: '/english/ai-voice/task/voice_coffee'
  }
];