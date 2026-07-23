// src/config/dexieDb.js
import Dexie from 'dexie';

export const db = new Dexie('LifeAccessDB');

// ==========================================
// VERSÃO 22: Tasks de IA (Chat e Voz) — migradas do localStorage para o Dexie
// ==========================================
// Antes, a conclusão das tarefas de IA (Chat e Voz) ficava só em
// localStorage ('completedAiTasks' / 'completedVoiceTasks'), que NÃO é
// incluído no backup/sync com a nuvem (só as tabelas do Dexie são).
// Isso fazia o usuário perder esse progresso ao reinstalar o app ou trocar
// de dispositivo, mesmo restaurando o backup — e a Trilha voltava a pedir
// os "bosses" de novo. Agora cada tarefa concluída vira um registro aqui.
db.version(22).stores({
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
  fitnessCalorieLog: '++id, date, amount, source, createdAt',
  dietLog: '++id, date, foodName, calories, source, createdAt',
  dietProfile: 'id',
  waterLog: '++id, date, createdAt',
  customWorkoutProfile: 'id, isOnboarded, updatedAt',
  customWorkoutPlan: 'id, updatedAt',
  completedAiTasks: 'taskId, completedAt',
  completedVoiceTasks: 'taskId, completedAt',
});