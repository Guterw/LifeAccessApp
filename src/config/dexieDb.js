// src/config/dexieDb.js
import Dexie from 'dexie';

export const db = new Dexie('LifeAccessDB');

// ==========================================
// VERSÃO 16 (mantida — já existia)
// ==========================================
db.version(16).stores({
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
  tasks: '++id, title, date, time, type, done, notify, notified, color, createdAt',
  financeTransactions: '++id, type, amount, category, description, date, createdAt',
  fitnessProfile: 'id, weightKg, heightCm, age, gender, goal, activityLevel, bmi, caloriesBurnedTotal, isOnboarded, aiPlanSummary',
  fitnessStreak: 'id, streak, lastWorkoutActivity',
  fitnessExerciseProgress: '[groupId+exerciseId], groupId, exerciseId, pendingQueue, correctCount, total, updatedAt',
  completedFitnessExercises: '[groupId+exerciseId], groupId, exerciseId, completedAt, caloriesBurned, xp',
  fitnessWeeklyPlan: 'id, generatedAt, days',
  fastingSessions: '++id, startTime, endTime, targetHours, protocol, completed, caloriesBurnedEstimate',
  languageStreak: 'id, streak, lastLanguageActivity',
  completedExplainedLessons: 'lessonId, completedAt',
  completedDictations: '++id, textId, completedAt, xp, timeTakenSeconds',
  levelProgressSpeech: 'level, correctCount, total, pendingQueue',
  completedLevelsSpeech: 'level, completedAt',
  levelProgressReverse: 'level, correctCount, total, pendingQueue',
  completedLevelsReverse: 'level, completedAt',
});

// ==========================================
// VERSÃO 17: Log de calorias do Fitness (exercícios + jejum)
// ==========================================
// Usado por fitnessManager.js (logCalorieEvent / getCalorieBreakdown) para
// permitir quebrar as calorias queimadas por Hoje / Semana / Mês / Total,
// sem depender apenas do acumulador único fitnessProfile.caloriesBurnedTotal.
// Compatibilidade: nenhuma tabela existente é alterada, apenas adicionada.
db.version(17).stores({
  fitnessCalorieLog: '++id, date, amount, source, createdAt',
});

// ==========================================
// VERSÃO 18: Diário Alimentar (preparação para dieta + scanner de IA futuro)
// ==========================================
// dietLog guarda cada entrada de alimento consumido em um dia. O campo
// `source` diferencia entradas manuais ('manual') de futuras leituras
// automáticas por IA ('ai_scanner'), sem precisar de nova migração quando
// esse recurso for implementado.
db.version(18).stores({
  dietLog: '++id, date, foodName, calories, source, createdAt',
});