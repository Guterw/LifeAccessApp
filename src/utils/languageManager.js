// src/utils/languageManager.js
import { db } from '../config/dexieDb';

// Função à prova de balas para timezone local (Zera as horas, focando só no dia civil)
const getLocalDayStart = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const registerLanguageActivity = async () => {
  let record = await db.languageStreak.get(1);
  if (!record) record = { id: 1, streak: 0, lastLanguageActivity: null };

  const now = new Date();
  const today = getLocalDayStart(now);

  const oldStreak = record.streak || 0;
  let newStreak = oldStreak;
  let increased = false;

  if (record.lastLanguageActivity) {
    const lastDate = getLocalDayStart(new Date(record.lastLanguageActivity));
    const diffTime = today - lastDate;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); // Pega a diferença exata de dias

    if (diffDays === 0) {
      // Já estudou hoje — nada muda
      return { increased: false, oldStreak, newStreak: oldStreak };
    } else if (diffDays === 1) {
      // Estudou ontem, a ofensiva cresce!
      newStreak = oldStreak + 1;
      increased = true;
    } else {
      // Pulou um dia ou mais, reseta a ofensiva
      newStreak = 1;
      increased = true;
    }
  } else {
    // Primeira atividade no aplicativo
    newStreak = 1;
    increased = true;
  }

  // Atualiza no banco
  await db.languageStreak.put({
    id: 1,
    streak: newStreak,
    lastLanguageActivity: now.toISOString(),
  });

  return { increased, oldStreak, newStreak };
};

export const getLanguageStreak = async () => {
  const record = await db.languageStreak.get(1);
  return record?.streak || 0;
};