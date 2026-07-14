// src/utils/dietManager.js
//
// ATENÇÃO: a parte de "consumido" (dietLog) hoje fica em 0/vazio até o
// usuário lançar manualmente uma refeição, ou até o futuro "scanner por IA"
// (funcionalidade ainda não implementada) preencher isso automaticamente.
// A tabela `dietLog` (Dexie v18) já está pronta para receber esses dados
// sem exigir nenhuma nova migração de schema quando o scanner existir —
// basta chamar addDietEntry({ ..., source: 'ai_scanner' }).
import { db } from '../config/dexieDb';
import { toDateKey, diffInDays } from './calendarUtils';
import { calculateDailyCalorieNeed, calculateGoalCalorieTarget } from './fitnessManager';

// Grava uma entrada de alimento consumido.
export const addDietEntry = async ({ date, foodName, calories, source = 'manual' }) => {
  return db.dietLog.add({
    date: date || toDateKey(new Date()),
    foodName,
    calories: Number(calories) || 0,
    source,
    createdAt: new Date().toISOString(),
  });
};

export const deleteDietEntry = async (id) => {
  await db.dietLog.delete(id);
};

// Soma as calorias consumidas (dietLog) em uma data específica ('YYYY-MM-DD').
export const getDietCaloriesForDate = async (dateKey) => {
  const entries = await db.dietLog.where('date').equals(dateKey).toArray();
  return entries.reduce((sum, e) => sum + (e.calories || 0), 0);
};

// Soma as calorias queimadas (fitnessCalorieLog) em uma data específica.
const getBurnedCaloriesForDate = async (dateKey) => {
  const entries = await db.fitnessCalorieLog.where('date').equals(dateKey).toArray();
  return entries.reduce((sum, e) => sum + (e.amount || 0), 0);
};

// Retorna o balanço calórico completo de um dia, pronto para exibição em UI.
export const getDailyCalorieBalance = async (dateKey, fitnessProfile) => {
  const targetDate = dateKey || toDateKey(new Date());
  const profile = fitnessProfile || (await db.fitnessProfile.get(1)) || {};

  const burned = await getBurnedCaloriesForDate(targetDate);
  const consumed = await getDietCaloriesForDate(targetDate);

  const tdee = calculateDailyCalorieNeed(profile);

  const hasWeightGoal = !!(profile.targetWeightKg && profile.targetWeeks && profile.weightKg);
  const goalInfo = hasWeightGoal ? calculateGoalCalorieTarget(profile) : null;
  const dailyTarget = goalInfo ? goalInfo.dailyTarget : tdee;
  const targetDeficit = tdee - dailyTarget;

  const netCalories = consumed - burned;

  const hasAnyData = consumed > 0 || burned > 0;
  const isWithinTarget = hasAnyData ? netCalories <= dailyTarget : false;

  let status = 'no_data';
  if (consumed > 0) {
    status = isWithinTarget ? 'on_track' : 'over_budget';
  }

  return {
    date: targetDate,
    burned,
    consumed,
    tdee,
    dailyTarget,
    targetDeficit,
    netCalories,
    isWithinTarget,
    status, // 'no_data' | 'on_track' | 'over_budget'
  };
};

// Conta quantos dias CONSECUTIVOS (terminando hoje ou ontem) tiveram
// isWithinTarget === true E pelo menos um registro (exercício/jejum ou
// dieta) naquele dia. Dias totalmente vazios não contam como "em foco" nem
// quebram a sequência se ainda não chegaram (ex: streak calculado até ontem
// quando hoje ainda não tem nenhum registro).
export const getFocusStreak = async () => {
  const profile = (await db.fitnessProfile.get(1)) || {};
  const todayKeyStr = toDateKey(new Date());

  // Ponto de partida: hoje, se já tiver algum dado; senão ontem.
  const todayBalance = await getDailyCalorieBalance(todayKeyStr, profile);
  const hasTodayData = todayBalance.status !== 'no_data' || todayBalance.burned > 0;

  let cursor = new Date();
  if (!hasTodayData) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  let lastFocusDate = null;

  // Limite de segurança: nunca varre mais de 365 dias para trás.
  for (let i = 0; i < 365; i++) {
    const cursorKey = toDateKey(cursor);
    const balance = await getDailyCalorieBalance(cursorKey, profile);
    const hasData = balance.status !== 'no_data' || balance.burned > 0;

    if (!hasData) break; // dia vazio encerra a sequência
    if (balance.status !== 'on_track' && !(balance.burned > 0 && balance.consumed === 0)) {
      // Se não há dado de dieta ainda (consumed === 0) mas houve exercício,
      // consideramos "em foco" pelo esforço físico registrado no dia.
      if (balance.status === 'over_budget') break;
    }

    streak += 1;
    if (!lastFocusDate) lastFocusDate = cursorKey;

    cursor.setDate(cursor.getDate() - 1);
  }

  return { streak, lastFocusDate };
};