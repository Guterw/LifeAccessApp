// src/utils/autoSync.js
import { db } from '../config/dexieDb';
import { auth } from '../config/firebaseConfig';
import { pushToCloud } from './cloudSync';

// Tabelas que, quando alteradas (criadas/editadas/apagadas), marcam o app
// como "sujo" e elegível para o próximo ciclo de sincronização automática.
// Cobre: exercícios de idioma concluídos, exercícios fitness concluídos,
// perfil/configurações, finanças, tarefas/lembretes/contadores do calendário.
const DIRTY_TABLES = [
  'completedLevels',
  'completedAlphaNum',
  'completedFitnessExercises',
  'financeTransactions',
  'tasks',
  'counters',
  'fitnessProfile',
  'fitnessStreak',
  'appSettings',
  'userProfile',
  'fastingSessions',
];

const SYNC_INTERVAL_MS = 5 * 60 * 1000; // a cada 5 minutos

let dirty = false;
let intervalId = null;
let hooksAttached = false;

export const markSyncDirty = () => {
  dirty = true;
};

const attachDirtyHooks = () => {
  if (hooksAttached) return;
  hooksAttached = true;

  DIRTY_TABLES.forEach((tableName) => {
    try {
      const table = db.table(tableName);
      if (!table) return;
      table.hook('creating', () => { markSyncDirty(); });
      table.hook('updating', () => { markSyncDirty(); });
      table.hook('deleting', () => { markSyncDirty(); });
    } catch (err) {
      console.warn(`[autoSync] Não foi possível anexar hook em ${tableName}:`, err);
    }
  });
};

const runSyncIfNeeded = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return; // só sincroniza quem está conectado à nuvem

    const settings = await db.appSettings.get(1);
    if (!settings?.autoSyncEnabled) return;
    if (!dirty) return;

    await pushToCloud(user.uid);
    dirty = false;
    await db.appSettings.update(1, { lastAutoSync: new Date().toISOString() });
  } catch (err) {
    // Falha silenciosa: não queremos interromper o uso do app por causa
    // de um erro de sincronização em background.
    console.error('[autoSync] Falha na sincronização automática:', err);
  }
};

export const startAutoSync = () => {
  attachDirtyHooks();
  if (intervalId) return;
  intervalId = setInterval(runSyncIfNeeded, SYNC_INTERVAL_MS);
  // Tenta uma vez ao iniciar o app, caso haja algo pendente de uma sessão anterior.
  runSyncIfNeeded();
};

export const stopAutoSync = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

export const getLastAutoSyncInfo = async () => {
  const settings = await db.appSettings.get(1);
  return settings?.lastAutoSync || null;
};