// src/data/englishTrail.js

export const ENGLISH_TRAIL = [
// ==========================================
  // SEÇÃO 1: OS FUNDAMENTOS (17 Fases + 1 Boss)
  // ==========================================
  { id: 'node_1', type: 'alphabet', targetIndex: 0, 
    title: { pt: 'Vogais (A-E)', en: 'Vowels (A-E)', es: 'Vocales (A-E)' }, 
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type', 
    path: '/english/alpha-numbers/exercise/alphabet/0' 
  },
  { id: 'node_2', type: 'numbers', targetIndex: 0, 
    title: { pt: 'Números 0 a 9', en: 'Numbers 0-9', es: 'Números 0-9' }, 
    color: 'bg-indigo-600', shadow: 'shadow-indigo-600/50', icon: 'Hash', 
    path: '/english/alpha-numbers/exercise/numbers/0' 
  },
  { id: 'node_3', type: 'explained', targetId: 'lesson_pronouns', 
    title: { pt: 'Quem é quem? (Pronomes)', en: 'Who is who? (Pronouns)', es: '¿Quién es quién?' }, 
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles', 
    path: '/english/explained/lesson_pronouns' 
  },
  { id: 'node_4', type: 'vocab', targetId: 1, 
    title: { pt: 'Saudações', en: 'Greetings', es: 'Saludos' }, 
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle', 
    path: '/english/vocabularies/vocab-normal/level/1' 
  },
  // PLACEHOLDER: Futuro módulo Vocabulário com Voz (Speech)
  { id: 'node_5', type: 'vocab_speech', targetId: 1, 
    title: { pt: 'Falar: Saudações', en: 'Speak: Greetings', es: 'Hablar: Saludos' }, 
    color: 'bg-sky-600', shadow: 'shadow-sky-600/50', icon: 'Mic', 
    path: '/english/vocabularies/vocab-speech/level/1' 
  },
  { id: 'node_6', type: 'explained', targetId: 'lesson_tobe_affirmative', 
    title: { pt: 'O Verbo TO BE', en: 'Verb TO BE', es: 'Verbo TO BE' }, 
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles', 
    path: '/english/explained/lesson_tobe_affirmative' 
  },
  { id: 'node_7', type: 'alphabet', targetIndex: 1, 
    title: { pt: 'Letras F ao J', en: 'Letters F-J', es: 'Letras F-J' }, 
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type', 
    path: '/english/alpha-numbers/exercise/alphabet/1' 
  },
  { id: 'node_8', type: 'vocab', targetId: 2, 
    title: { pt: 'Pessoas e Família', en: 'People & Family', es: 'Personas y Familia' }, 
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'Users', 
    path: '/vocabularies/vocab-normal/level/2'
  },
  // PLACEHOLDER: Futuro módulo Vocabulário Inverso (Tradução)
  { id: 'node_9', type: 'vocab_reverse', targetId: 2, 
    title: { pt: 'Tradução: Pessoas', en: 'Translate: People', es: 'Traducción: Personas' }, 
    color: 'bg-purple-600', shadow: 'shadow-purple-600/50', icon: 'RotateCcw', 
    path: '/english/vocabularies/vocab-reverse/level/2' 
  },
  { id: 'node_10', type: 'numbers', targetIndex: 1, 
    title: { pt: 'Números 10 a 19', en: 'Numbers 10-19', es: 'Números 10-19' }, 
    color: 'bg-indigo-600', shadow: 'shadow-indigo-600/50', icon: 'Hash', 
    path: '/english/alpha-numbers/exercise/numbers/1' 
  },
  { id: 'node_11', type: 'explained', targetId: 'lesson_tobe_questions', 
    title: { pt: 'To Be: Perguntas', en: 'To Be: Questions', es: 'To Be: Preguntas' }, 
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles', 
    path: '/english/explained/lesson_tobe_questions' 
  },
  { id: 'node_12', type: 'alphabet', targetIndex: 2, 
    title: { pt: 'Letras K ao R', en: 'Letters K-R', es: 'Letras K-R' }, 
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type', 
    path: '/english/alpha-numbers/exercise/alphabet/2' 
  },
  { id: 'node_13', type: 'vocab', targetId: 3, 
    title: { pt: 'Objetos Diários', en: 'Everyday Objects', es: 'Objetos Diarios' }, 
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle', 
    path: '/english/vocabularies/vocab-normal/level/3' 
  },
  { id: 'node_14', type: 'explained', targetId: 'lesson_this_that', 
    title: { pt: 'This, That, These...', en: 'This, That, These...', es: 'This, That, These...' }, 
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles', 
    path: '/english/explained/lesson_this_that' 
  },
  { id: 'node_15', type: 'alphabet', targetIndex: 3, 
    title: { pt: 'Reta Final (S-Z)', en: 'Final Stretch (S-Z)', es: 'Recta Final (S-Z)' }, 
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type', 
    path: '/english/alpha-numbers/exercise/alphabet/3' 
  },
  { id: 'node_16', type: 'explained', targetId: 'lesson_have_has', 
    title: { pt: 'O verbo TO HAVE', en: 'The verb TO HAVE', es: 'El verbo TO HAVE' }, 
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles', 
    path: '/english/explained/lesson_have_has' 
  },
  { id: 'node_17', type: 'alphabet', targetIndex: 4, 
    title: { pt: 'Spelling Bee', en: 'Spelling Bee', es: 'Concurso de Deletreo' }, 
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type', 
    path: '/english/alpha-numbers/exercise/alphabet/4' 
  },
  { id: 'node_18_boss', type: 'task', targetId: 'chat_intro', 
    title: { pt: 'Boss: Apresente-se (Chat)', en: 'Boss: Introduce Yourself', es: 'Jefe: Preséntate' }, 
    color: 'bg-red-600', shadow: 'shadow-red-600/60', icon: 'Bot', 
    path: '/english/ai-chat/tasks/chat_intro' 
  },

  // ==========================================
  // SEÇÃO 2: PREPARAÇÃO PARA DUBLIN (20 Fases + 1 Boss)
  // ==========================================
  { id: 'node_19', type: 'vocab', targetId: 4, 
    title: { pt: 'Comida e Bebida', en: 'Food & Drinks', es: 'Comida y Bebida' }, 
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'Coffee', 
    path: '/english/vocabularies/vocab-normal/level/4' 
  },
  // PLACEHOLDER
  { id: 'node_20', type: 'vocab_speech', targetId: 4, 
    title: { pt: 'Falar: Comida', en: 'Speak: Food', es: 'Hablar: Comida' }, 
    color: 'bg-sky-600', shadow: 'shadow-sky-600/50', icon: 'Mic', 
    path: '/english/vocabularies/vocab-speech/level/4' 
  },
  { id: 'node_21', type: 'numbers', targetIndex: 2, 
    title: { pt: 'Dezenas 20 a 100', en: 'Tens 20 to 100', es: 'Decenas 20 a 100' }, 
    color: 'bg-indigo-600', shadow: 'shadow-indigo-600/50', icon: 'Hash', 
    path: '/english/alpha-numbers/exercise/numbers/2' 
  },
  { id: 'node_22', type: 'explained', targetId: 'lesson_question_words', 
    title: { pt: 'Question Words (What...)', en: 'Question Words', es: 'Question Words' }, 
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles', 
    path: '/english/explained/lesson_question_words' 
  },
  { id: 'node_23', type: 'alphabet', targetIndex: 5, 
    title: { pt: 'Spelling: Intermediário', en: 'Spelling: Intermediate', es: 'Deletreo: Intermedio' }, 
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type', 
    path: '/english/alpha-numbers/exercise/alphabet/5' 
  },
  { id: 'node_24', type: 'vocab', targetId: 5, 
    title: { pt: 'Empregos e Rotina', en: 'Jobs & Routine', es: 'Trabajos y Rutina' }, 
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'Users', 
    path: '/english/vocabularies/vocab-normal/level/5' 
  },
  // PLACEHOLDER
  { id: 'node_25', type: 'vocab_reverse', targetId: 5, 
    title: { pt: 'Tradução: Empregos', en: 'Translate: Jobs', es: 'Traducción: Trabajos' }, 
    color: 'bg-purple-600', shadow: 'shadow-purple-600/50', icon: 'RotateCcw', 
    path: '/english/vocabularies/vocab-reverse/level/5' 
  },
  { id: 'node_26', type: 'explained', targetId: 'lesson_articles', 
    title: { pt: 'A, An, The', en: 'A, An, The', es: 'A, An, The' }, 
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles', 
    path: '/english/explained/lesson_articles' 
  },
  { id: 'node_27', type: 'numbers', targetIndex: 3, 
    title: { pt: 'Centenas e Milhares', en: 'Hundreds & Thousands', es: 'Cientos y Miles' }, 
    color: 'bg-indigo-600', shadow: 'shadow-indigo-600/50', icon: 'Hash', 
    path: '/english/alpha-numbers/exercise/numbers/3' 
  },
  { id: 'node_28', type: 'vocab', targetId: 6, 
    title: { pt: 'Viagem e Aeroporto', en: 'Travel & Airport', es: 'Viaje y Aeropuerto' }, 
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle', 
    path: '/english/vocabularies/vocab-normal/level/6' 
  },
  { id: 'node_29', type: 'explained', targetId: 'lesson_plurals', 
    title: { pt: 'Plurais e Regra do S', en: 'Plurals & S Rule', es: 'Plurales' }, 
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles', 
    path: '/english/explained/lesson_plurals' 
  },
  { id: 'node_30', type: 'alphabet', targetIndex: 6, 
    title: { pt: 'Spelling: Avançado', en: 'Spelling: Advanced', es: 'Deletreo: Avanzado' }, 
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type', 
    path: '/english/alpha-numbers/exercise/alphabet/6' 
  },
  { id: 'node_31', type: 'vocab', targetId: 7, 
    title: { pt: 'Tempo e Datas', en: 'Time & Dates', es: 'Tiempo y Fechas' }, 
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle', 
    path: '/english/vocabularies/vocab-normal/level/7' 
  },
  { id: 'node_32', type: 'explained', targetId: 'lesson_do_make', 
    title: { pt: 'Do vs Make', en: 'Do vs Make', es: 'Do vs Make' }, 
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles', 
    path: '/english/explained/lesson_do_make' 
  },
  { id: 'node_33', type: 'alphabet', targetIndex: 7, 
    title: { pt: 'Spelling: Master', en: 'Spelling: Master', es: 'Deletreo: Maestro' }, 
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type', 
    path: '/english/alpha-numbers/exercise/alphabet/7' 
  },
  { id: 'node_34', type: 'vocab', targetId: 8, 
    title: { pt: 'Direções e Lugares', en: 'Directions & Places', es: 'Direcciones y Lugares' }, 
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle', 
    path: '/english/vocabularies/vocab-normal/level/8' 
  },
  { id: 'node_35', type: 'explained', targetId: 'lesson_simple_present', 
    title: { pt: 'Simple Present (Rotina)', en: 'Simple Present', es: 'Simple Present' }, 
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles', 
    path: '/english/explained/lesson_simple_present' 
  },
  // Boss seção 2
  { id: 'node_36_boss', type: 'task', targetId: 'voice_coffee', 
    title: { pt: 'Boss: Peça um Café (Voz)', en: 'Boss: Order a Coffee', es: 'Jefe: Pide un Café' }, 
    color: 'bg-red-600', shadow: 'shadow-red-600/60', icon: 'Bot', 
    path: '/english/ai-voice/tasks/voice_coffee' 
  },
  // ==========================================
  // SEÇÃO 3: TRABALHO E CANDIDATURA (10 Fases + 1 Boss)
  // ==========================================
  { id: 'node_37', type: 'alphabet', targetIndex: 5,
    title: { pt: 'Spelling: Intermediário', en: 'Spelling: Intermediate', es: 'Deletreo: Intermedio' },
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type',
    path: '/english/alpha-numbers/exercise/alphabet/5' 
  },
  { id: 'node_38', type: 'vocab', targetId: 9,
    title: { pt: 'Existência e Quantidade', en: 'Existence & Quantity', es: 'Existencia y Cantidad' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle',
    path: '/english/vocabularies/vocab-normal/level/9' 
  },
  { id: 'node_39', type: 'numbers', targetIndex: 4,
    title: { pt: 'Centenas e Milhares', en: 'Hundreds & Thousands', es: 'Cientos y Miles' },
    color: 'bg-indigo-600', shadow: 'shadow-indigo-600/50', icon: 'Hash',
    path: '/english/alpha-numbers/exercise/numbers/4' 
  },
  { id: 'node_40', type: 'explained', targetId: 'lesson_past_tense',
    title: { pt: 'Past Tense Explicado', en: 'Past Tense Explained', es: 'Past Tense Explicado' },
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles',
    path: '/english/explained/lesson_past_tense' 
  },
  { id: 'node_41', type: 'vocab', targetId: 10,
    title: { pt: 'Perguntas Abertas', en: 'Open Questions', es: 'Preguntas Abiertas' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle',
    path: '/english/vocabularies/vocab-normal/level/10' 
  },
  { id: 'node_42', type: 'alphabet', targetIndex: 6,
    title: { pt: 'Spelling: Avançado', en: 'Spelling: Advanced', es: 'Deletreo: Avanzado' },
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type',
    path: '/english/alpha-numbers/exercise/alphabet/6' 
  },
  { id: 'node_43', type: 'vocab', targetId: 11,
    title: { pt: 'Procurando Emprego', en: 'Job Hunting', es: 'Búsqueda de Empleo' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'Users',
    path: '/level/11' 
  },
  { id: 'node_44', type: 'explained', targetId: 'lesson_modals_ould',
    title: { pt: 'Would, Could, Should', en: 'Would, Could, Should', es: 'Would, Could, Should' },
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles',
    path: '/english/explained/lesson_modals_ould' 
  },
  { id: 'node_45', type: 'vocab', targetId: 12,
    title: { pt: 'A Entrevista de Emprego', en: 'The Job Interview', es: 'La Entrevista de Trabajo' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'Users',
    path: '/english/vocabularies/vocab-normal/level/12' 
  },
  { id: 'node_46', type: 'alphabet', targetIndex: 7,
    title: { pt: 'Spelling: Master', en: 'Spelling: Master', es: 'Deletreo: Maestro' },
    color: 'bg-blue-600', shadow: 'shadow-blue-600/50', icon: 'Type',
    path: '/english/alpha-numbers/exercise/alphabet/7' 
  },
  // Boss seção 3
  { id: 'node_47_boss', type: 'task', targetId: 'advanced_negotiation',
    title: { pt: 'Boss: Negocie um Aumento', en: 'Boss: Negotiate a Raise', es: 'Jefe: Negocia un Aumento' },
    color: 'bg-red-600', shadow: 'shadow-red-600/60', icon: 'Bot',
    path: '/english/ai-chat/tasks/advanced_negotiation' 
  },

  // ==========================================
  // SEÇÃO 4: MORADIA E VIDA SOCIAL (10 Fases + 1 Boss)
  // ==========================================
  { id: 'node_48', type: 'vocab', targetId: 13,
    title: { pt: 'No Ambiente de Trabalho', en: 'In the Workplace', es: 'En el Entorno de Trabajo' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'Users',
    path: '/english/vocabularies/vocab-normal/level/13' 
  },
  { id: 'node_49', type: 'vocab', targetId: 14,
    title: { pt: 'Moradia e Burocracia', en: 'Housing & Bureaucracy', es: 'Vivienda y Burocracia' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle',
    path: '/english/vocabularies/vocab-normal/level/14' 
  },
  { id: 'node_50', type: 'explained', targetId: 'lesson_particles_up_on',
    title: { pt: 'UP e ON Explicados', en: 'UP and ON Explained', es: 'UP y ON Explicados' },
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles',
    path: '/english/explained/lesson_particles_up_on' 
  },
  { id: 'node_51', type: 'vocab', targetId: 15,
    title: { pt: 'Vida Social e Lazer', en: 'Social Life & Leisure', es: 'Vida Social y Ocio' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'Users',
    path: '/english/vocabularies/vocab-normal/level/15' 
  },
  { id: 'node_52', type: 'dictation', targetId: 'dictation_basic_1',
    title: { pt: 'Ditado: Rotina Matinal', en: 'Dictation: Morning Routine', es: 'Dictado: Rutina Matutina' },
    color: 'bg-amber-600', shadow: 'shadow-amber-600/50', icon: 'Mic',
    path: '/english/dictation/dictation_basic_1' 
  },
  { id: 'node_53', type: 'vocab', targetId: 16,
    title: { pt: 'Gerenciamento e Problemas', en: 'Management & Issues', es: 'Gestión y Problemas' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'Users',
    path: '/english/vocabularies/vocab-normal/level/16' 
  },
  { id: 'node_54', type: 'explained', targetId: 'lesson_through_though',
    title: { pt: 'Through, Though, Tough', en: 'Through, Though, Tough', es: 'Through, Though, Tough' },
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles',
    path: '/english/explained/lesson_through_though' 
  },
  { id: 'node_55', type: 'vocab', targetId: 17,
    title: { pt: 'Burocracia e Saúde', en: 'Bureaucracy & Health', es: 'Burocracia y Salud' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle',
    path: '/english/vocabularies/vocab-normal/level/17' 
  },
  { id: 'node_56', type: 'task', targetId: 'room_rent',
    title: { pt: 'Alugando um Quarto', en: 'Renting a Room', es: 'Alquilando una Habitación' },
    color: 'bg-pink-600', shadow: 'shadow-pink-600/50', icon: 'MessageCircle',
    path: '/english/ai-chat/tasks/room_rent' 
  },
  { id: 'node_57', type: 'task', targetId: 'job_hunting',
    title: { pt: 'Entregando Currículo (Voz)', en: 'Dropping off CV (Voice)', es: 'Entregando Currículo (Voz)' },
    color: 'bg-teal-600', shadow: 'shadow-teal-600/50', icon: 'Bot',
    path: '/english/ai-voice/tasks/job_hunting' 
  },
  // Boss seção 4
  { id: 'node_58_boss', type: 'task', targetId: 'advanced_dublin_emergency',
    title: { pt: 'Boss: Carteira Perdida (Voz)', en: 'Boss: Lost Wallet (Voice)', es: 'Jefe: Billetera Perdida (Voz)' },
    color: 'bg-red-600', shadow: 'shadow-red-600/60', icon: 'Bot',
    path: '/english/ai-voice/tasks/advanced_dublin_emergency' 
  },

  // ==========================================
  // SEÇÃO 5: GÍRIAS E FLUÊNCIA (10 Fases + 1 Boss de Ditado)
  // ==========================================
  { id: 'node_59', type: 'vocab', targetId: 18,
    title: { pt: 'Slang e Expressões Avançadas', en: 'Advanced Slang & Expressions', es: 'Jerga y Expresiones Avanzadas' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'Users',
    path: '/english/vocabularies/vocab-normal/level/18' 
  },
  { id: 'node_60', type: 'vocab', targetId: 19,
    title: { pt: 'Números e Cores (Revisão)', en: 'Numbers & Colors (Review)', es: 'Números y Colores (Repaso)' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle',
    path: '/english/vocabularies/vocab-normal/level/19' 
  },
  { id: 'node_61', type: 'vocab', targetId: 20,
    title: { pt: 'Tempo e Calendário', en: 'Time & Calendar', es: 'Tiempo y Calendario' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle',
    path: '/english/vocabularies/vocab-normal/level/20' 
  },
  { id: 'node_62', type: 'vocab', targetId: 21,
    title: { pt: 'Adjetivos e Sensações', en: 'Adjectives & Feelings', es: 'Adjetivos y Sensaciones' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'Users',
    path: '/english/vocabularies/vocab-normal/level/21' 
  },
  { id: 'node_63', type: 'vocab', targetId: 22,
    title: { pt: 'Verbos e Objetos Comuns', en: 'Verbs & Common Objects', es: 'Verbos y Objetos Comunes' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle',
    path: '/english/vocabularies/vocab-normal/level/22' 
  },
  { id: 'node_64', type: 'task', targetId: 'irish_pub',
    title: { pt: 'No Pub Irlandês', en: 'At the Irish Pub', es: 'En el Pub Irlandés' },
    color: 'bg-pink-600', shadow: 'shadow-pink-600/50', icon: 'MessageCircle',
    path: '/english/ai-chat/tasks/irish_pub' 
  },
  { id: 'node_65', type: 'task', targetId: 'dublin_airport',
    title: { pt: 'Imigração em Dublin (Chat)', en: 'Dublin Immigration (Chat)', es: 'Inmigración en Dublín (Chat)' },
    color: 'bg-pink-600', shadow: 'shadow-pink-600/50', icon: 'MessageCircle',
    path: '/english/ai-chat/tasks/dublin_airport' 
  },
  { id: 'node_66', type: 'task', targetId: 'hotel_checkin',
    title: { pt: 'Check-in no Hostel (Voz)', en: 'Hostel Check-in (Voice)', es: 'Check-in en el Hostal (Voz)' },
    color: 'bg-teal-600', shadow: 'shadow-teal-600/50', icon: 'Bot',
    path: '/english/ai-voice/tasks/hotel_checkin' 
  },
  { id: 'node_67', type: 'dictation', targetId: 'dictation_basic_2',
    title: { pt: 'Ditado: No Café', en: 'Dictation: At the Cafe', es: 'Dictado: En el Café' },
    color: 'bg-amber-600', shadow: 'shadow-amber-600/50', icon: 'Mic',
    path: '/english/dictation/dictation_basic_2' 
  },
  { id: 'node_68', type: 'task', targetId: 'ordering_pub',
    title: { pt: 'Pedido no Pub (Voz)', en: 'Ordering at a Pub (Voice)', es: 'Pedido en el Pub (Voz)' },
    color: 'bg-teal-600', shadow: 'shadow-teal-600/50', icon: 'Bot',
    path: '/english/ai-voice/tasks/ordering_pub' 
  },
  // Boss seção 5
  { id: 'node_69_boss', type: 'dictation', targetId: 'dictation_boss_advanced',
    title: { pt: 'Boss: Um Dia em Dublin (Ditado)', en: 'Boss: A Day in Dublin (Dictation)', es: 'Jefe: Un Día en Dublín (Dictado)' },
    color: 'bg-red-600', shadow: 'shadow-red-600/60', icon: 'Mic',
    path: '/english/dictation/dictation_boss_advanced' 
  },

  // ==========================================
  // SEÇÃO 6: FLUÊNCIA FINAL (10 Fases + Boss Final)
  // ==========================================
  { id: 'node_70', type: 'task', targetId: 'shopping_clothes',
    title: { pt: 'Comprando Roupas (Chat)', en: 'Clothes Shopping (Chat)', es: 'Comprando Ropa (Chat)' },
    color: 'bg-pink-600', shadow: 'shadow-pink-600/50', icon: 'MessageCircle',
    path: '/english/ai-chat/tasks/shopping_clothes' 
  },
  { id: 'node_71', type: 'task', targetId: 'directions_bus',
    title: { pt: 'Pedindo Informações (Chat)', en: 'Asking for Directions (Chat)', es: 'Pidiendo Direcciones (Chat)' },
    color: 'bg-pink-600', shadow: 'shadow-pink-600/50', icon: 'MessageCircle',
    path: '/english/ai-chat/tasks/directions_bus' 
  },
  { id: 'node_72', type: 'vocab', targetId: 3,
    title: { pt: 'Família e Pessoas (Revisão)', en: 'Family & People (Review)', es: 'Familia y Personas (Repaso)' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'Users',
    path: '/english/vocabularies/vocab-normal/level/3' 
  },
  { id: 'node_73', type: 'explained', targetId: 'lesson_modals_ould',
    title: { pt: 'Would/Could/Should (Revisão)', en: 'Would/Could/Should (Review)', es: 'Would/Could/Should (Repaso)' },
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles',
    path: '/english/explained/lesson_modals_ould' 
  },
  { id: 'node_74', type: 'task', targetId: 'dublin_airport',
    title: { pt: 'Imigração em Dublin (Voz)', en: 'Dublin Immigration (Voice)', es: 'Inmigración en Dublín (Voz)' },
    color: 'bg-teal-600', shadow: 'shadow-teal-600/50', icon: 'Bot',
    path: '/english/ai-voice/tasks/dublin_airport' 
  },
  { id: 'node_75', type: 'explained', targetId: 'lesson_particles_up_on',
    title: { pt: 'UP e ON (Revisão)', en: 'UP and ON (Review)', es: 'UP y ON (Repaso)' },
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles',
    path: '/english/explained/lesson_particles_up_on' 
  },
  { id: 'node_76', type: 'vocab', targetId: 8,
    title: { pt: 'Direções e Lugares (Revisão)', en: 'Directions & Places (Review)', es: 'Direcciones y Lugares (Repaso)' },
    color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50', icon: 'MessageCircle',
    path: '/english/vocabularies/vocab-normal/level/8' 
  },
  { id: 'node_77', type: 'task', targetId: 'hospitality_interview',
    title: { pt: 'Entrevista de Emprego (Voz)', en: 'Job Interview (Voice)', es: 'Entrevista de Trabajo (Voz)' },
    color: 'bg-teal-600', shadow: 'shadow-teal-600/50', icon: 'Bot',
    path: '/english/ai-voice/tasks/hospitality_interview' 
  },
  { id: 'node_78', type: 'dictation', targetId: 'dictation_basic_3',
    title: { pt: 'Ditado: Fim de Semana', en: 'Dictation: The Weekend', es: 'Dictado: Fin de Semana' },
    color: 'bg-amber-600', shadow: 'shadow-amber-600/50', icon: 'Mic',
    path: '/english/dictation/dictation_basic_3' 
  },
  { id: 'node_79', type: 'explained', targetId: 'lesson_get',
    title: { pt: 'O Verbo GET (Revisão Final)', en: 'The Verb GET (Final Review)', es: 'El Verbo GET (Repaso Final)' },
    color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-600/50', icon: 'Sparkles',
    path: '/english/explained/lesson_get' 
  },
  // Boss seção 6
  { id: 'node_80_boss', type: 'task', targetId: 'final_boss_life_in_dublin',
    title: { pt: 'Boss Final: Um Dia Inteiro (Voz)', en: 'Final Boss: A Full Day (Voice)', es: 'Jefe Final: Un Día Entero (Voz)' },
    color: 'bg-red-600', shadow: 'shadow-red-600/60', icon: 'Bot',
    path: '/english/ai-voice/tasks/final_boss_life_in_dublin' 
  },
];