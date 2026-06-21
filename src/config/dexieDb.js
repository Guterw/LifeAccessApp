import Dexie from 'dexie';

export const db = new Dexie('LifeAccessDB');

// Subimos para a versão 7: novo módulo de progresso para Alfabeto/Números (Fundamentos),
// substituindo o controle que antes vivia solto no localStorage.
db.version(7).stores({
  // ==========================================
  // ⚙️ MÓDULO: CONFIGURAÇÕES DO SISTEMA
  // ==========================================
  appSettings: 'id, uiLanguage, isFirstAccess, userName', // id será sempre 1 para termos um registro único
  // ==========================================

  // 📚 MÓDULO: INGLÊS & APRENDIZADO
  // ==========================================
  learnedWords: 'en, translation, level, category, learnedAt',
  mistakesLog: '++id, word, level, category, timestamp',
  levelProgress: 'level, correctCount, total, pendingQueue',
  completedLevels: 'level, completedAt',
  chatHistory: '++id, timestamp, role, content',

  // ==========================================
  // 🔤 MÓDULO: FUNDAMENTOS (Alfabeto & Números)
  // ==========================================
  // Chave composta [mode+exerciseIndex] identifica cada exercício de forma única
  // e estável, igual ao padrão já usado em levelProgress/completedLevels.
  alphaNumProgress: '[mode+exerciseIndex], mode, exerciseIndex, pendingQueue, correctCount, total, updatedAt',
  completedAlphaNum: '[mode+exerciseIndex], mode, exerciseIndex, completedAt, xp',

  // ==========================================
  // ⚔️ MÓDULO: TAREFAS & RPG (Em Breve)
  // ==========================================
  // tasks: '++id, title, xpReward, isCompleted, date',
  // userProfile: 'id, currentLevel, totalXp, bodyRanks',

  // ==========================================
  // 🏋️‍♂️ MÓDULO: FITNESS & SAÚDE (Em Breve)
  // ==========================================
  // fitnessLogs: '++id, date, weight, workoutType, calories',

  // ==========================================
  // 💰 MÓDULO: FINANCEIRO (Em Breve)
  // ==========================================
  // transactions: '++id, date, amount, type, category',
});