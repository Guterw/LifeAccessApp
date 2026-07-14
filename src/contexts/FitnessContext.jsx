// src/contexts/FitnessContext.jsx
import React, { createContext, useContext, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../config/dexieDb';
import { toDateKey } from '../utils/calendarUtils';
import {
  registerWorkoutActivity as registerWorkoutActivityDb,
  getCalorieBreakdown,
  resetTodayCalories,
  resetWeekCalories,
  resetMonthCalories,
  resetTotalCalories,
} from '../utils/fitnessManager';

const FitnessContext = createContext();

export const FitnessProvider = ({ children }) => {
  // Mesma estratégia usada no LanguageContext: ler direto do Dexie via
  // useLiveQuery, para que qualquer .put() feito por registerWorkoutActivity
  // reflita na UI automaticamente, sem precisar de setState manual.
  const fitnessStreakRecord = useLiveQuery(() => db.fitnessStreak.get(1), [], undefined);
  const fitnessStreak = fitnessStreakRecord?.streak || 0;

  // isFitnessStreakActive: true somente se a última atividade de treino
  // foi HOJE (comparando apenas a data civil, sem hora/minuto/segundo) —
  // exatamente a mesma lógica usada para isStreakActiveToday no LanguageContext.
  const isFitnessStreakActive = useMemo(() => {
    if (!fitnessStreakRecord?.lastWorkoutActivity) return false;
    const lastKey = toDateKey(new Date(fitnessStreakRecord.lastWorkoutActivity));
    const todayKeyStr = toDateKey(new Date());
    return lastKey === todayKeyStr;
  }, [fitnessStreakRecord?.lastWorkoutActivity]);

  // Calorias: recalcula sempre que qualquer tabela relevante mudar
  const calorieBreakdown = useLiveQuery(
    () => getCalorieBreakdown(),
    [],
    { today: 0, week: 0, month: 0, total: 0 }
  );

  const registerWorkoutActivity = async () => {
    return await registerWorkoutActivityDb();
  };

  return (
    <FitnessContext.Provider value={{
      fitnessStreak,
      isFitnessStreakActive,
      registerWorkoutActivity,
      caloriesToday: calorieBreakdown?.today || 0,
      caloriesWeek: calorieBreakdown?.week || 0,
      caloriesMonth: calorieBreakdown?.month || 0,
      caloriesTotal: calorieBreakdown?.total || 0,
      resetTodayCalories,
      resetWeekCalories,
      resetMonthCalories,
      resetTotalCalories,
    }}>
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => useContext(FitnessContext);