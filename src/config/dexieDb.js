// src/config/dexieDb.js
import Dexie from 'dexie';

export const db = new Dexie('LifeAccessDB');

// ==========================================
// 🔼 VERSÃO 13: OFENSIVA DE IDIOMAS EM TABELA DEDICADA
// (antes vivia solta dentro de appSettings — sujeita a sobrescrita
// parcial em updates concorrentes e em pull/push da nuvem)
// ==========================================
db.version(14).stores({
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
}).upgrade(async (tx) => {
  // Migração automática: se já existia uma ofensiva salva dentro de
  // appSettings (formato antigo), copia para a nova tabela dedicada,
  // preservando o progresso do usuário em vez de zerar.
  const settings = await tx.table('appSettings').get(1);
  if (settings && (settings.languageStreak || settings.lastLanguageActivity)) {
    await tx.table('languageStreak').put({
      id: 1,
      streak: settings.languageStreak || 0,
      lastLanguageActivity: settings.lastLanguageActivity || null,
    });
  }
});

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
db.version(15).stores({
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
}).upgrade(async (tx) => {
  // Garantia defensiva: assegura que sempre exista um registro válido em
  // languageStreak (id: 1). Se por qualquer motivo o registro anterior não
  // existir ou estiver corrompido, cria um registro zerado em vez de deixar
  // a tabela vazia (o que forçaria leituras futuras a sempre criar do zero
  // silenciosamente, mascarando o problema).
  try {
    const existing = await tx.table('languageStreak').get(1);
    if (!existing) {
      await tx.table('languageStreak').put({ id: 1, streak: 0, lastLanguageActivity: null });
    }
  } catch (err) {
    console.error('[dexieDb v15] Erro ao validar languageStreak durante upgrade:', err);
  }
});