// src/config/dexieDb.js
import Dexie from 'dexie';

export const db = new Dexie('LifeAccessDB');

db.version(8).stores({
  appSettings: 'id, uiLanguage, isFirstAccess, userName',
  learnedWords: 'en, translation, level, category, learnedAt',
  mistakesLog: '++id, word, level, category, timestamp',
  levelProgress: 'level, correctCount, total, pendingQueue',
  completedLevels: 'level, completedAt',
  chatHistory: '++id, timestamp, role, content',
  alphaNumProgress: '[mode+exerciseIndex], mode, exerciseIndex, pendingQueue, correctCount, total, updatedAt',
  completedAlphaNum: '[mode+exerciseIndex], mode, exerciseIndex, completedAt, xp',
  userProfile: 'id, currentLevel, totalXp, bodyRanks',
});

db.version(9).stores({
  appSettings: 'id, uiLanguage, isFirstAccess, userName',
  learnedWords: 'en, translation, level, category, learnedAt',
  mistakesLog: '++id, word, level, category, timestamp',
  levelProgress: 'level, correctCount, total, pendingQueue',
  completedLevels: 'level, completedAt',
  chatHistory: '++id, timestamp, role, content',
  alphaNumProgress: '[mode+exerciseIndex], mode, exerciseIndex, pendingQueue, correctCount, total, updatedAt',
  completedAlphaNum: '[mode+exerciseIndex], mode, exerciseIndex, completedAt, xp',
  userProfile: 'id, currentLevel, totalXp, bodyRanks',
  counters: '++id, title, type, anchorDate, color, icon, createdAt',
});

// ==========================================
// 🔼 VERSÃO 10: TAREFAS/LEMBRETES + FINANÇAS
// ==========================================
db.version(10).stores({
  appSettings: 'id, uiLanguage, isFirstAccess, userName',
  learnedWords: 'en, translation, level, category, learnedAt',
  mistakesLog: '++id, word, level, category, timestamp',
  levelProgress: 'level, correctCount, total, pendingQueue',
  completedLevels: 'level, completedAt',
  chatHistory: '++id, timestamp, role, content',
  alphaNumProgress: '[mode+exerciseIndex], mode, exerciseIndex, pendingQueue, correctCount, total, updatedAt',
  completedAlphaNum: '[mode+exerciseIndex], mode, exerciseIndex, completedAt, xp',
  userProfile: 'id, currentLevel, totalXp, bodyRanks',
  counters: '++id, title, type, anchorDate, color, icon, createdAt',

  // NOVA TABELA: Tarefas / Lembretes / (no futuro) Treinos
  // type: 'task' | 'reminder' | 'workout'
  tasks: '++id, title, date, time, type, done, notify, notified, color, createdAt',

  // NOVA TABELA: Transações Financeiras
  // type: 'income' | 'expense'
  financeTransactions: '++id, type, amount, category, description, date, createdAt',
});