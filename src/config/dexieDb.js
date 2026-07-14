// src/config/dexieDb.js
import Dexie from 'dexie';

export const db = new Dexie('LifeAccessDB');

// ==========================================
// 🔼 VERSÃO 15: CORREÇÃO CRÍTICA DA OFENSIVA DE IDIOMAS
// ==========================================
// Motivo desta versão existir: navegadores que já tinham o banco local
// aberto em uma "versão 14" anterior a esta tabela dedicada existir
// (ex: builds de teste anteriores) NUNCA rodam o .upgrade() acima, pois
// o Dexie só executa migrações quando o NÚMERO da versão aumenta — ele
// não compara o conteúdo do .stores(). Isso fazia a tabela `languageStreak`
// nunca ser criada/preservada corretamente para esses usuários, e a
// ofensiva de Inglês "resetava" e ficava travada em 1, mesmo com a lógica
// de cálculo estando 100% correta (idêntica à do Fitness, que não sofria
// desse problema por já existir desde antes).
//
// Ao forçar esta nova versão, garantimos que TODOS os usuários, não
// importa em qual schema estavam presos, passem por uma migração real
// que garante a existência da tabela e preserva qualquer dado válido
// que já esteja nela (o upgrade abaixo é seguro e não sobrescreve nada
// se a tabela já estiver correta).
// ==========================================
// VERSÃO 16: Progresso para Vocab-Speech e Vocab-Reverse
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
  // NOVO: progresso independente para os módulos Speech e Reverse
  levelProgressSpeech: 'level, correctCount, total, pendingQueue',
  completedLevelsSpeech: 'level, completedAt',
  levelProgressReverse: 'level, correctCount, total, pendingQueue',
  completedLevelsReverse: 'level, completedAt',
});