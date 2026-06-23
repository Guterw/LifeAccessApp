// src/config/dexieDb.js
import Dexie from 'dexie';

export const db = new Dexie('LifeAccessDB');

// Subimos para a versão 8: Criação oficial da tabela userProfile
// para começarmos a salvar e rastrear o XP e o Level do usuário globalmente.
db.version(8).stores({
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
  alphaNumProgress: '[mode+exerciseIndex], mode, exerciseIndex, pendingQueue, correctCount, total, updatedAt',
  completedAlphaNum: '[mode+exerciseIndex], mode, exerciseIndex, completedAt, xp',

  // ==========================================
  // ⚔️ MÓDULO: XPs & Gamificação TASKS
  // ==========================================
  // Tabela DESCOMENTADA para o XP Global funcionar perfeitamente!
  userProfile: 'id, currentLevel, totalXp, bodyRanks',
  
  // tasks: '++id, title, xpReward, isCompleted, date',

  // ==========================================
  // MÓDULO: CALENDARIO, TAREFAS E LEMBRETES
  // ==========================================
  //

  // ==========================================
  // 🏋️‍♂️ MÓDULO: FITNESS & SAÚDE (Em Breve)
  // ==========================================
  // fitnessLogs: '++id, date, weight, workoutType, calories',

  // ==========================================
  // 💰 MÓDULO: FINANCEIRO (Em Breve)
  // ==========================================
  // transactions: '++id, date, amount, type, category',
});