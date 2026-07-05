// src/config/dexieDb.js
import Dexie from 'dexie';

export const db = new Dexie('LifeAccessDB');

// Mantemos a versão 8 para não quebrar quem já tem o banco criado localmente
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

// ==========================================
// 🔼 VERSÃO 9: MÓDULO DE CALENDÁRIO E CONTADORES
// ==========================================
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

  // NOVA TABELA: Contadores do Calendário
  // type: 'since'  -> "Dias sem X" (conta a partir de anchorDate até hoje)
  // type: 'until'  -> "Faltam X dias para Y" (conta de hoje até anchorDate)
  counters: '++id, title, type, anchorDate, color, icon, createdAt',
});