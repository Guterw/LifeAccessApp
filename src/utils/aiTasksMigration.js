// src/utils/aiTasksMigration.js
// Migração única: move os IDs de tarefas de IA (Chat e Voz) que estavam
// salvos apenas em localStorage para as novas tabelas do Dexie
// (completedAiTasks / completedVoiceTasks). Isso é necessário porque o
// localStorage NUNCA foi incluído no backup/sincronização com a nuvem —
// só as tabelas do Dexie são exportadas/importadas/sincronizadas.
//
// Roda uma única vez por dispositivo (marcado por uma flag em localStorage).
// Depois de migrado, o localStorage é limpo e as telas passam a ler/escrever
// direto no Dexie.
import { db } from '../config/dexieDb';

const CHAT_KEY = 'completedAiTasks';
const VOICE_KEY = 'completedVoiceTasks';
const MIGRATION_FLAG = 'lifeaccess_ai_tasks_migrated_v1';

export const migrateAiTasksToDexie = async () => {
  try {
    if (localStorage.getItem(MIGRATION_FLAG) === 'true') return;

    let chatIds = [];
    let voiceIds = [];
    try {
      chatIds = JSON.parse(localStorage.getItem(CHAT_KEY) || '[]');
    } catch (_) { chatIds = []; }
    try {
      voiceIds = JSON.parse(localStorage.getItem(VOICE_KEY) || '[]');
    } catch (_) { voiceIds = []; }

    for (const id of chatIds) {
      const taskId = String(id);
      const existing = await db.completedAiTasks.get(taskId);
      if (!existing) {
        await db.completedAiTasks.put({ taskId, completedAt: new Date().toISOString() });
      }
    }

    for (const id of voiceIds) {
      const taskId = String(id);
      const existing = await db.completedVoiceTasks.get(taskId);
      if (!existing) {
        await db.completedVoiceTasks.put({ taskId, completedAt: new Date().toISOString() });
      }
    }

    // Limpa o localStorage antigo — a partir de agora só o Dexie é a fonte de verdade.
    localStorage.removeItem(CHAT_KEY);
    localStorage.removeItem(VOICE_KEY);
    localStorage.setItem(MIGRATION_FLAG, 'true');

    if (chatIds.length || voiceIds.length) {
      console.log(`[aiTasksMigration] Migradas ${chatIds.length} tasks de chat e ${voiceIds.length} de voz para o Dexie.`);
    }
  } catch (err) {
    console.error('[aiTasksMigration] Erro ao migrar tasks de IA para o Dexie:', err);
  }
};