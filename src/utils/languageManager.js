// src/utils/languageManager.js
import { db } from '../config/dexieDb';
import { toDateKey, diffInDays } from './calendarUtils';

// ==========================================
// OFENSIVA DE IDIOMAS (mesmo padrão usado no Fitness: tabela dedicada
// com upsert direto por chave, em vez de um campo solto dentro de
// appSettings sujeito a sobrescrita parcial/concorrência).
// ==========================================
export const registerLanguageActivity = async () => {
  let record = await db.languageStreak.get(1);
  if (!record) record = { id: 1, streak: 0, lastLanguageActivity: null };

  const todayStr = toDateKey(new Date());
  const oldStreak = record.streak || 0;
  const lastStr = record.lastLanguageActivity
    ? toDateKey(new Date(record.lastLanguageActivity))
    : null;

  if (lastStr === todayStr) {
    // Já estudou hoje — nada muda, nenhuma animação.
    return { increased: false, oldStreak, newStreak: oldStreak };
  }

  let newStreak;
  if (lastStr) {
    const diffDays = diffInDays(lastStr, todayStr);
    newStreak = diffDays === 1 ? oldStreak + 1 : 1;
  } else {
    newStreak = 1;
  }

  await db.languageStreak.put({
    id: 1,
    streak: newStreak,
    lastLanguageActivity: new Date().toISOString(),
  });

  return { increased: newStreak !== oldStreak, oldStreak, newStreak };
};

export const getLanguageStreak = async () => {
  const record = await db.languageStreak.get(1);
  return record?.streak || 0;
};