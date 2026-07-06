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
// OFENSIVA DE TREINO
// ==========================================
export const registerWorkoutActivity = async () => {
  let record = await db.fitnessStreak.get(1);
  if (!record) record = { id: 1, streak: 0, lastWorkoutActivity: null };

  const todayStr = toDateKey(new Date());
  const oldStreak = record.streak || 0;
  const lastStr = record.lastWorkoutActivity ? toDateKey(new Date(record.lastWorkoutActivity)) : null;

  if (lastStr === todayStr) {
    return { increased: false, oldStreak, newStreak: oldStreak };
  }

  let newStreak;
  if (lastStr) {
    const diff = diffInDays(lastStr, todayStr);
    newStreak = diff === 1 ? oldStreak + 1 : 1;
  } else {
    newStreak = 1;
  }

  await db.fitnessStreak.put({ id: 1, streak: newStreak, lastWorkoutActivity: new Date().toISOString() });
  return { increased: newStreak !== oldStreak, oldStreak, newStreak };
};

// ==========================================
// EXERCÍCIOS
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
  const completed = hoursElapsed >= session.targetHours * 0.9; // tolerância de 10%

  await db.fastingSessions.update(sessionId, {
    endTime: end.toISOString(),
    completed: true,
    caloriesBurnedEstimate,
  });

  const fitnessProfile = await db.fitnessProfile.get(1) || { id: 1, caloriesBurnedTotal: 0 };
  fitnessProfile.caloriesBurnedTotal = (fitnessProfile.caloriesBurnedTotal || 0) + caloriesBurnedEstimate;
  await db.fitnessProfile.put(fitnessProfile);

  if (completed) await addXP(10);

  return { hoursElapsed, caloriesBurnedEstimate, metGoal: completed };
};

export const cancelFast = async (sessionId) => {
  await db.fastingSessions.delete(sessionId);
};