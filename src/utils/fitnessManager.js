// src/utils/fitnessManager.js
import { db } from '../config/dexieDb';
import { addXP } from './xpManager';
import { toDateKey, diffInDays } from './calendarUtils';

export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
};

export const getBMICategory = (bmi) => {
  if (!bmi) return 'unknown';
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
};

// Fórmula de Mifflin-St Jeor — estimativa padrão de taxa metabólica basal (BMR)
export const calculateBMR = ({ weightKg, heightCm, age, gender }) => {
  if (!weightKg || !heightCm || !age) return 1600; // fallback conservador
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') return Math.round(base + 5);
  if (gender === 'female') return Math.round(base - 161);
  return Math.round(base - 78); // média neutra para "other"
};

const ACTIVITY_MULTIPLIER = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

export const calculateDailyCalorieNeed = (profile) => {
  const bmr = calculateBMR(profile);
  const mult = ACTIVITY_MULTIPLIER[profile.activityLevel] || 1.3;
  return Math.round(bmr * mult);
};

// ==========================================
// META DE PESO (Perda/Ganho) + PRAZO REALISTA
// ==========================================
// Regra de segurança: no máximo ~1kg de variação de peso por semana.
// Isso evita que o usuário defina prazos irreais (ex: perder 10kg em 1 semana).
const MAX_SAFE_KG_PER_WEEK = 1;
const MIN_SAFE_KG_PER_WEEK = 0.25; // abaixo disso, o prazo fica longo demais / pouco eficaz
const KCAL_PER_KG = 7700; // aproximação padrão: 1kg de gordura ≈ 7700 kcal

// Retorna { minWeeks, maxWeeks, diffKg } — o prazo (em semanas) considerado
// realista para atingir a diferença de peso informada.
export const getRealisticWeekRange = (currentWeightKg, targetWeightKg) => {
  const diff = Math.abs(Number(targetWeightKg) - Number(currentWeightKg));
  if (!diff || diff <= 0) return { minWeeks: 1, maxWeeks: 1, diffKg: 0 };

  const minWeeks = Math.ceil(diff / MAX_SAFE_KG_PER_WEEK);
  const maxWeeks = Math.ceil(diff / MIN_SAFE_KG_PER_WEEK);
  return { minWeeks, maxWeeks, diffKg: Number(diff.toFixed(1)) };
};

// Valida se o número de semanas informado pelo usuário está dentro da faixa segura
export const isRealisticTimeframe = (currentWeightKg, targetWeightKg, weeks) => {
  const { minWeeks, maxWeeks } = getRealisticWeekRange(currentWeightKg, targetWeightKg);
  const w = Number(weeks);
  if (!w || w <= 0) return false;
  return w >= minWeeks && w <= maxWeeks;
};

// Calcula a meta diária de calorias (consumo recomendado) considerando o
// gasto diário total (TDEE) e o déficit/superávit necessário para atingir
// o peso alvo dentro do prazo escolhido pelo usuário.
export const calculateGoalCalorieTarget = (profile) => {
  const tdee = calculateDailyCalorieNeed(profile);

  if (!profile?.targetWeightKg || !profile?.targetWeeks || !profile?.weightKg) {
    return { dailyTarget: tdee, dailyAdjustment: 0, direction: 'maintain', tdee };
  }

  const diffKg = Number(profile.targetWeightKg) - Number(profile.weightKg);
  if (Math.abs(diffKg) < 0.1) {
    return { dailyTarget: tdee, dailyAdjustment: 0, direction: 'maintain', tdee };
  }

  const totalKcalNeeded = Math.abs(diffKg) * KCAL_PER_KG;
  const totalDays = Number(profile.targetWeeks) * 7;
  const dailyAdjustment = Math.round(totalKcalNeeded / totalDays);

  const isLoss = diffKg < 0;
  const dailyTarget = isLoss ? tdee - dailyAdjustment : tdee + dailyAdjustment;

  const getLocalDayStart = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  return {
    dailyTarget: Math.max(1200, dailyTarget), // nunca sugere abaixo de 1200 kcal (segurança)
    dailyAdjustment,
    direction: isLoss ? 'loss' : 'gain',
    tdee,
  };
};

// ==========================================
// OFENSIVA DE TREINO
// ==========================================
// ==========================================
// OFENSIVA DE TREINO — CORRIGIDA (data civil, sem hora/minuto/segundo)
// Usa a MESMA lógica de toDateKey/diffInDays já usada no languageManager.js
// e no calendário, em vez de comparar objetos Date com horário embutido.
// ==========================================
export const registerWorkoutActivity = async () => {
  let record = await db.fitnessStreak.get(1);
  if (!record) record = { id: 1, streak: 0, lastWorkoutActivity: null };

  const todayStr = toDateKey(new Date());
  const oldStreak = record.streak || 0;
  let newStreak = oldStreak;
  let increased = false;

  if (record.lastWorkoutActivity) {
    const lastKey = toDateKey(new Date(record.lastWorkoutActivity));
    const diffDays = diffInDays(lastKey, todayStr);

    if (diffDays === 0) {
      return { increased: false, oldStreak, newStreak: oldStreak };
    } else if (diffDays === 1) {
      newStreak = oldStreak + 1;
      increased = true;
    } else {
      newStreak = 1;
      increased = true;
    }
  } else {
    newStreak = 1;
    increased = true;
  }

  await db.fitnessStreak.put({
    id: 1,
    streak: newStreak,
    lastWorkoutActivity: new Date().toISOString(),
  });

  return { increased, oldStreak, newStreak };
};

// ==========================================
// CALORIAS: DIA / SEMANA / MÊS / TOTAL
// ==========================================
// Cada exercício concluído (completeFitnessExercise) e cada jejum concluído
// (endFast) agora também gravam um registro leve em `fitnessCalorieLog`
// (ver dexieDb.js) com a data (YYYY-MM-DD) e as calorias daquele evento.
// Isso permite calcular "calorias de hoje", "desta semana", "deste mês" e
// resetar cada uma dessas janelas independentemente do total acumulado.

const logCalorieEvent = async (amount, source = 'exercise') => {
  if (!amount) return;
  await db.fitnessCalorieLog.add({
    date: toDateKey(new Date()),
    amount,
    source, // 'exercise' | 'fasting'
    createdAt: new Date().toISOString(),
  });
};

// Retorna { today, week, month, total } calculado a partir do log +
// do total histórico salvo em fitnessProfile.caloriesBurnedTotal (que
// serve de "piso" caso o log tenha sido parcialmente limpo no passado).
export const getCalorieBreakdown = async () => {
  const profile = await db.fitnessProfile.get(1) || { caloriesBurnedTotal: 0 };
  const allLogs = await db.fitnessCalorieLog.toArray();

  const now = new Date();
  const todayKeyStr = toDateKey(now);

  // Início da semana (Domingo) e do mês, em formato YYYY-MM-DD
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfWeekKey = toDateKey(startOfWeek);

  const startOfMonthKey = toDateKey(new Date(now.getFullYear(), now.getMonth(), 1));

  let today = 0, week = 0, month = 0, logTotal = 0;
  allLogs.forEach((entry) => {
    logTotal += entry.amount || 0;
    if (entry.date === todayKeyStr) today += entry.amount || 0;
    if (entry.date >= startOfWeekKey) week += entry.amount || 0;
    if (entry.date >= startOfMonthKey) month += entry.amount || 0;
  });

  return {
    today,
    week,
    month,
    total: profile.caloriesBurnedTotal || 0,
  };
};

// Reseta as calorias de HOJE: remove os logs de hoje e subtrai do total
export const resetTodayCalories = async () => {
  const todayKeyStr = toDateKey(new Date());
  const todayLogs = await db.fitnessCalorieLog.where('date').equals(todayKeyStr).toArray();
  const amountToSubtract = todayLogs.reduce((sum, l) => sum + (l.amount || 0), 0);

  await db.fitnessCalorieLog.where('date').equals(todayKeyStr).delete();

  const profile = await db.fitnessProfile.get(1) || { id: 1, caloriesBurnedTotal: 0 };
  profile.caloriesBurnedTotal = Math.max(0, (profile.caloriesBurnedTotal || 0) - amountToSubtract);
  await db.fitnessProfile.put(profile);
};

// Reseta as calorias da SEMANA atual (domingo até hoje)
export const resetWeekCalories = async () => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfWeekKey = toDateKey(startOfWeek);

  const weekLogs = await db.fitnessCalorieLog.where('date').aboveOrEqual(startOfWeekKey).toArray();
  const amountToSubtract = weekLogs.reduce((sum, l) => sum + (l.amount || 0), 0);

  await db.fitnessCalorieLog.where('date').aboveOrEqual(startOfWeekKey).delete();

  const profile = await db.fitnessProfile.get(1) || { id: 1, caloriesBurnedTotal: 0 };
  profile.caloriesBurnedTotal = Math.max(0, (profile.caloriesBurnedTotal || 0) - amountToSubtract);
  await db.fitnessProfile.put(profile);
};

// Reseta as calorias do MÊS atual
export const resetMonthCalories = async () => {
  const now = new Date();
  const startOfMonthKey = toDateKey(new Date(now.getFullYear(), now.getMonth(), 1));

  const monthLogs = await db.fitnessCalorieLog.where('date').aboveOrEqual(startOfMonthKey).toArray();
  const amountToSubtract = monthLogs.reduce((sum, l) => sum + (l.amount || 0), 0);

  await db.fitnessCalorieLog.where('date').aboveOrEqual(startOfMonthKey).delete();

  const profile = await db.fitnessProfile.get(1) || { id: 1, caloriesBurnedTotal: 0 };
  profile.caloriesBurnedTotal = Math.max(0, (profile.caloriesBurnedTotal || 0) - amountToSubtract);
  await db.fitnessProfile.put(profile);
};

// Reseta TUDO (histórico completo de calorias)
export const resetTotalCalories = async () => {
  await db.fitnessCalorieLog.clear();
  const profile = await db.fitnessProfile.get(1) || { id: 1 };
  profile.caloriesBurnedTotal = 0;
  await db.fitnessProfile.put(profile);
};

// ==========================================
// EXERCÍCIOS — agora também grava no log de calorias
// ==========================================
export const completeFitnessExercise = async ({ groupId, exerciseId, caloriesBurned = 0, xp = 15 }) => {
  await db.completedFitnessExercises.put({
    groupId, exerciseId,
    completedAt: new Date().toISOString(),
    caloriesBurned, xp
  });

  const profile = await db.fitnessProfile.get(1) || { id: 1, caloriesBurnedTotal: 0 };
  profile.caloriesBurnedTotal = (profile.caloriesBurnedTotal || 0) + caloriesBurned;
  await db.fitnessProfile.put(profile);
  await logCalorieEvent(caloriesBurned, 'exercise');

  await addXP(xp);
  const streakResult = await registerWorkoutActivity();

  return { profile, streakResult };
};

export const resetFitnessExercise = async (groupId, exerciseId) => {
  await db.completedFitnessExercises.delete([groupId, exerciseId]);
  await db.fitnessExerciseProgress.delete([groupId, exerciseId]);
};

export const saveFitnessProfile = async (data) => {
  const existing = await db.fitnessProfile.get(1) || { id: 1 };
  const merged = { ...existing, ...data, id: 1 };
  merged.bmi = calculateBMI(merged.weightKg, merged.heightCm);
  await db.fitnessProfile.put(merged);
  return merged;
};

// ==========================================
// JEJUM INTERMITENTE
// ==========================================
export const FASTING_PROTOCOLS = {
  '16:8': { fastHours: 16 },
  '18:6': { fastHours: 18 },
  '20:4': { fastHours: 20 },
  'OMAD': { fastHours: 23 },
};

export const getActiveFast = async () => {
  const all = await db.fastingSessions.toArray();
  return all.find(f => !f.completed) || null;
};

export const startFast = async (protocol = '16:8') => {
  const active = await getActiveFast();
  if (active) return active;

  const targetHours = FASTING_PROTOCOLS[protocol]?.fastHours || 16;
  const id = await db.fastingSessions.add({
    startTime: new Date().toISOString(),
    endTime: null,
    targetHours,
    protocol,
    completed: false,
    caloriesBurnedEstimate: 0,
  });
  return db.fastingSessions.get(id);
};

// Estimativa simples: durante o jejum, o corpo continua queimando calorias no ritmo do BMR,
// então calculamos a fração do BMR proporcional às horas jejuadas (não é um "extra", é o gasto
// real acumulado no período — deixamos claro na UI que é uma estimativa).
export const calculateFastingCaloriesBurned = (hoursElapsed, profile) => {
  const bmr = calculateBMR(profile || {});
  const caloriesPerHour = bmr / 24;
  return Math.round(caloriesPerHour * hoursElapsed);
};

export const endFast = async (sessionId, profile) => {
  const session = await db.fastingSessions.get(sessionId);
  if (!session) return null;

  const start = new Date(session.startTime);
  const end = new Date();
  const hoursElapsed = (end - start) / (1000 * 60 * 60);
  const caloriesBurnedEstimate = calculateFastingCaloriesBurned(hoursElapsed, profile);
  const completed = hoursElapsed >= session.targetHours * 0.9;

  await db.fastingSessions.update(sessionId, {
    endTime: end.toISOString(),
    completed: true,
    caloriesBurnedEstimate,
  });

  const fitnessProfile = await db.fitnessProfile.get(1) || { id: 1, caloriesBurnedTotal: 0 };
  fitnessProfile.caloriesBurnedTotal = (fitnessProfile.caloriesBurnedTotal || 0) + caloriesBurnedEstimate;
  await db.fitnessProfile.put(fitnessProfile);
  await logCalorieEvent(caloriesBurnedEstimate, 'fasting');

  if (completed) await addXP(10);

  return { hoursElapsed, caloriesBurnedEstimate, metGoal: completed };
};

export const cancelFast = async (sessionId) => {
  await db.fastingSessions.delete(sessionId);
};