// src/utils/autoSync.js
import { db } from '../config/dexieDb';
import { auth } from '../config/firebaseConfig';
import { pushToCloud, pullFromCloud, getCloudLastSync } from './cloudSync';

// Tabelas que, quando alteradas (criadas/editadas/apagadas), marcam o app
// como "sujo" e elegível para o próximo ciclo de sincronização automática.
// Cobre: idiomas, fitness, jejum, finanças, calendário e configurações/perfil.
const DIRTY_TABLES = [
  'completedLevels',
  'completedAlphaNum',
  'alphaNumProgress',
  'levelProgress',
  'learnedWords',
  'mistakesLog',
  'completedFitnessExercises',
  'fitnessExerciseProgress',
  'fitnessWeeklyPlan',
  'fastingSessions',
  'financeTransactions',
  'tasks',
  'counters',
  'fitnessProfile',
  'fitnessStreak',
  'appSettings',
  'userProfile',
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

// Ao iniciar o app, se houver algo mais novo salvo na nuvem (feito em outro
// dispositivo) e não houver mudanças locais pendentes de envio, traz
// automaticamente esses dados para este dispositivo.
const runInitialPullIfNeeded = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const settings = await db.appSettings.get(1);
    if (!settings?.autoSyncEnabled) return;
    if (dirty) return; // se há mudanças locais não enviadas, prioriza push antes de puxar

    const remoteLastSync = await getCloudLastSync(user.uid);
    if (!remoteLastSync) return;

    const localKnownRemote = settings.lastKnownRemoteSync || null;
    const remoteIsNewer = !localKnownRemote || new Date(remoteLastSync) > new Date(localKnownRemote);

    if (remoteIsNewer) {
      await pullFromCloud(user.uid);
      await db.appSettings.update(1, { lastKnownRemoteSync: remoteLastSync });
    }
  } catch (err) {
    console.error('[autoSync] Falha no pull automático inicial:', err);
  }
};

export const startAutoSync = () => {
  attachDirtyHooks();
  if (intervalId) return;

  // Primeiro tenta trazer o que houver de mais novo na nuvem, depois liga
  // o ciclo periódico de envio automático quando algo mudar localmente.
  runInitialPullIfNeeded().then(() => {
    runSyncIfNeeded();
  });

  intervalId = setInterval(() => {
    runSyncIfNeeded();
  }, SYNC_INTERVAL_MS);
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