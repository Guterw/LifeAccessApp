// src/utils/autoSync.js
import { db } from '../config/dexieDb';
import { auth } from '../config/firebaseConfig';
import { pushToCloud, pullFromCloud, getCloudLastSync } from './cloudSync';

// Tabelas que, quando alteradas (criadas/editadas/apagadas), marcam o app
// como "sujo" e elegível para o próximo ciclo de sincronização automática.
const DIRTY_TABLES = [
  'appSettings',
  'learnedWords',
  'mistakesLog',
  'levelProgress',
  'completedLevels',
  'chatHistory',
  'alphaNumProgress',
  'completedAlphaNum',
  'userProfile',
  'counters',
  'tasks',
  'financeTransactions',
  'fitnessProfile',
  'fitnessStreak',
  'fitnessExerciseProgress',
  'completedFitnessExercises',
  'fitnessWeeklyPlan',
  'fastingSessions',
  'languageStreak',
  'completedExplainedLessons',
  'completedDictations',
  'levelProgressSpeech',
  'completedLevelsSpeech',
  'levelProgressReverse',
  'completedLevelsReverse',
  'fitnessCalorieLog',
  'dietLog',
  'dietProfile',
  'waterLog',
  'customWorkoutProfile',
  'customWorkoutPlan',
  'completedAiTasks',
  'completedVoiceTasks'
];

const SYNC_INTERVAL_MS = 5 * 60 * 1000; // ciclo periódico de segurança (5 min)
const QUICK_PUSH_DEBOUNCE_MS = 4000; // tenta subir ~4s após qualquer mudança relevante

// ==========================================
// CORREÇÃO CRÍTICA: persistência do "dirty"
// ==========================================
// Antes, a flag "dirty" só existia em memória (let dirty = false). Se o app
// fosse fechado (ou o Android matasse o processo) antes do ciclo periódico
// de 5 minutos enviar os dados para a nuvem, essa informação se perdia.
// Na próxima abertura, o app achava que não havia nada pendente e fazia um
// PULL da nuvem — sobrescrevendo progresso local recém-feito (ex: ofensiva,
// XP, exercícios concluídos) com a versão antiga salva na nuvem.
//
// Agora a flag também é persistida no localStorage, que sobrevive a
// fechamentos/reaberturas do app, e o pull inicial NUNCA roda enquanto
// houver algo pendente de envio — nesse caso, primeiro tentamos enviar.
const DIRTY_STORAGE_KEY = 'lifeaccess_sync_dirty';

const readDirtyFromStorage = () => {
  try {
    return localStorage.getItem(DIRTY_STORAGE_KEY) === '1';
  } catch (_) {
    return false;
  }
};

let dirty = readDirtyFromStorage();
let intervalId = null;
let hooksAttached = false;
let quickPushTimer = null;
let visibilityHandlerAttached = false;

export const markSyncDirty = () => {
  dirty = true;
  try { localStorage.setItem(DIRTY_STORAGE_KEY, '1'); } catch (_) {}

  // Agenda um envio rápido (debounced) em vez de esperar até 5 minutos.
  // Isso reduz drasticamente a janela em que o app pode ser fechado com
  // dados ainda não enviados para a nuvem.
  if (quickPushTimer) clearTimeout(quickPushTimer);
  quickPushTimer = setTimeout(() => {
    runSyncIfNeeded();
  }, QUICK_PUSH_DEBOUNCE_MS);
};

const clearDirty = () => {
  dirty = false;
  try { localStorage.removeItem(DIRTY_STORAGE_KEY); } catch (_) {}
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

    const nowIso = new Date().toISOString();
    await pushToCloud(user.uid);
    clearDirty();
    // Ao subir com sucesso, também atualizamos "lastKnownRemoteSync" para o
    // horário atual, já que agora a nuvem reflete exatamente este estado
    // local — evita um pull desnecessário logo em seguida.
    await db.appSettings.update(1, { lastAutoSync: nowIso, lastKnownRemoteSync: nowIso });
  } catch (err) {
    // Falha silenciosa: não interrompe o uso do app por causa de um erro
    // de sincronização em segundo plano. A flag "dirty" permanece true
    // (não foi limpa), então a próxima tentativa vai tentar de novo.
    console.error('[autoSync] Falha na sincronização automática:', err);
  }
};

// Ao iniciar o app: se há mudanças locais pendentes de envio (inclusive de
// uma sessão anterior que foi fechada antes do envio terminar), a
// prioridade é subir essas mudanças primeiro. Puxar da nuvem agora
// apagaria esse progresso local ainda não sincronizado.
const runInitialPullIfNeeded = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const settings = await db.appSettings.get(1);
    if (!settings?.autoSyncEnabled) return;

    if (dirty) {
      await runSyncIfNeeded();
      return;
    }

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

// Melhor esforço: quando o app vai para segundo plano/é minimizado ou a aba
// é fechada, tenta subir imediatamente qualquer alteração pendente, em vez
// de depender só do timer de 5 minutos ou do debounce de 4s.
const attachVisibilityFlush = () => {
  if (visibilityHandlerAttached) return;
  visibilityHandlerAttached = true;
  if (typeof document === 'undefined') return;

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && dirty) {
      runSyncIfNeeded();
    }
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('pagehide', () => {
      if (dirty) runSyncIfNeeded();
    });
  }
};

export const startAutoSync = () => {
  attachDirtyHooks();
  attachVisibilityFlush();
  if (intervalId) return;

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
  if (quickPushTimer) {
    clearTimeout(quickPushTimer);
    quickPushTimer = null;
  }
};

export const getLastAutoSyncInfo = async () => {
  const settings = await db.appSettings.get(1);
  return settings?.lastAutoSync || null;
};