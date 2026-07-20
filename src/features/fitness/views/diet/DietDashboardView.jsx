// src/features/fitness/views/diet/DietDashboardView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Salad, Camera, BarChart3, Pencil, Droplets, Plus, Minus, Flame,
  Timer, ChevronRight, Trash2,
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { db } from '../../../../config/dexieDb';
import {
  getDietProfile, addWaterEntry, removeLastWaterEntry, getWaterTotalForDate,
  getTodayDietEntries, deleteDietEntry, getDailyCalorieBalance,
} from '../../../../utils/dietManager';
import { toDateKey } from '../../../../utils/calendarUtils';
import BackButton from '../../../../components/BackButton';
import FooterBrand from '../../../../components/FooterBrand';
import DietOnboardingView from './DietOnboardingView';

const LOADING = '__LOADING__';
const WATER_CUP_ML = 250;

export default function DietDashboardView() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // CORREÇÃO DO BUG: "dietProfile is not defined" acontecia porque o
  // componente nunca declarava/lia o perfil de dieta do Dexie antes de
  // usá-lo no JSX. Agora lemos de forma reativa via useLiveQuery, no
  // mesmo padrão usado em FitnessDashboard.jsx (useFitness/useLiveQuery).
  const dietProfile = useLiveQuery(() => getDietProfile(), [], LOADING);

  const todayKeyStr = toDateKey(new Date());
  const waterToday = useLiveQuery(() => getWaterTotalForDate(todayKeyStr), [todayKeyStr], 0) || 0;
  const todayEntries = useLiveQuery(() => getTodayDietEntries(), [todayKeyStr], []) || [];
  const fitnessProfile = useLiveQuery(() => db.fitnessProfile.get(1), [], null);

  const [balance, setBalance] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!dietProfile || dietProfile === LOADING) return;
      const b = await getDailyCalorieBalance(todayKeyStr, fitnessProfile || {});
      if (!cancelled) setBalance(b);
    };
    load();
    return () => { cancelled = true; };
  }, [dietProfile, todayKeyStr, fitnessProfile, todayEntries, waterToday]);

  // ── Estado de carregamento ──────────────────────────────────────────────
  if (dietProfile === LOADING) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 text-sm animate-pulse">{t('general.loading', 'Carregando...')}</p>
      </div>
    );
  }

  // ── Sem perfil de dieta ainda: dispara o onboarding ─────────────────────
  if (!dietProfile?.isOnboarded) {
    return <DietOnboardingView />;
  }

  const handleAddWater = async () => {
    await addWaterEntry(WATER_CUP_ML, todayKeyStr);
  };

  const handleRemoveWater = async () => {
    await removeLastWaterEntry(todayKeyStr);
  };

  const handleDeleteEntry = async (id) => {
    await deleteDietEntry(id);
  };

  const consumed = balance?.consumed || 0;
  const target = dietProfile.dailyCalorieTarget || 2000;
  const consumedPct = Math.min(100, (consumed / target) * 100);
  const isOverTarget = consumed > target;

  const waterGoal = dietProfile.waterGoalMl || 2000;
  const waterPct = Math.min(100, (waterToday / waterGoal) * 100);

  const meals = dietProfile.generatedPlan?.meals || [];

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 min-h-screen -mt-5 -mb-20">
      <BackButton to="/fitness" label={t('backToHome', 'Voltar')} />

      <div className="flex items-center gap-3 my-6">
        <div className="p-3 bg-orange-500/20 text-orange-400 rounded-2xl">
          <Salad size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{t('diet.title', 'Dieta')}</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
            {t('diet.subtitle', 'Alimentação e Hidratação')}
          </p>
        </div>
      </div>

      {/* REFERÊNCIA CRUZADA COM O PERFIL DE FITNESS */}
      {(dietProfile.goalCalorieTarget || dietProfile.referenceTdee) && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-4 flex items-start gap-3">
          <Flame size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-200 leading-relaxed">
            {dietProfile.goalCalorieTarget
              ? t('diet.tdeeReferenceNote', 'Meta baseada na meta calórica do seu perfil de Fitness:')
              : t('diet.tdeeReferenceNoteTdee', 'Meta baseada no seu gasto calórico estimado de')}{' '}
            <span className="font-black text-blue-100">
              {dietProfile.goalCalorieTarget || dietProfile.referenceTdee} kcal/dia
            </span>
          </p>
        </div>
      )}

      {/* BADGE DE JEJUM INTERMITENTE VINCULADO */}
      {dietProfile.fastingEnabled && (
        <button
          onClick={() => navigate('/fitness/fasting')}
          className="w-full bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-400/50 rounded-2xl p-4 mb-4 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2">
            <Timer size={16} className="text-indigo-400" />
            <span className="text-xs text-indigo-200 font-bold">
              {t('diet.fastingLinkedNote', 'Jejum intermitente vinculado')}: {dietProfile.fastingProtocol}
            </span>
          </div>
          <ChevronRight size={16} className="text-indigo-400" />
        </button>
      )}

      {/* CARD DE CALORIAS DO DIA */}
      <div className="bg-gray-800 rounded-3xl border border-gray-700 p-5 mb-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <Flame size={13} className="text-orange-400" /> {t('diet.dailyTarget', 'Meta Diária')}
          </span>
          <span className="text-xs font-black text-white">{consumed} / {target} kcal</span>
        </div>
        <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${isOverTarget ? 'bg-red-500' : 'bg-emerald-500'}`}
            style={{ width: `${Math.max(consumedPct, consumed > 0 ? 3 : 0)}%` }}
          />
        </div>
      </div>

      {/* CARD DE ÁGUA */}
      <div className="bg-gray-800 rounded-3xl border border-gray-700 p-5 mb-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <Droplets size={13} className="text-sky-400" /> {t('diet.waterGoal', 'Meta de Água')}
          </span>
          <span className="text-xs font-black text-white">{(waterToday / 1000).toFixed(2)} / {(waterGoal / 1000).toFixed(1)} L</span>
        </div>
        <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden mb-4">
          <div
            className="h-3 rounded-full bg-sky-500 transition-all duration-500"
            style={{ width: `${Math.max(waterPct, waterToday > 0 ? 3 : 0)}%` }}
          />
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleRemoveWater}
            className="w-11 h-11 rounded-full bg-gray-900 border border-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <Minus size={18} />
          </button>
          <span className="text-xs text-gray-500 font-bold">+{WATER_CUP_ML}ml</span>
          <button
            onClick={handleAddWater}
            className="w-11 h-11 rounded-full bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center transition-colors shadow-lg"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* AÇÕES RÁPIDAS */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => navigate('/fitness/diet/scanner')}
          className="bg-gray-800 border border-orange-500/30 hover:border-orange-400 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Camera size={22} className="text-orange-400" />
          <span className="text-xs font-black text-white text-center">{t('diet.scannerTitle', 'Escanear Prato')}</span>
        </button>
        <button
          onClick={() => navigate('/fitness/diet/report')}
          className="bg-gray-800 border border-gray-700 hover:border-gray-500 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <BarChart3 size={22} className="text-gray-300" />
          <span className="text-xs font-black text-white text-center">{t('diet.reportTitle', 'Relatório')}</span>
        </button>
      </div>

      <button
        onClick={() => navigate('/fitness/diet/edit')}
        className="w-full bg-gray-800 border border-gray-700 hover:border-orange-500/50 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 mb-6 transition-colors"
      >
        <Pencil size={16} /> {t('diet.editMyDiet', 'Editar minha dieta')}
      </button>

      {/* REFEIÇÕES DO PLANO */}
      {meals.length > 0 && (
        <>
          <h3 className="font-bold text-gray-400 mb-3 uppercase tracking-wider text-xs">
            {t('diet.mealsSection', 'Refeições do Plano')}
          </h3>
          <div className="space-y-2 mb-6">
            {meals.map((meal, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white text-sm">{meal.name}</span>
                  <span className="text-xs font-bold text-orange-400">{meal.estimatedCalories} kcal</span>
                </div>
                <p className="text-xs text-gray-400">{meal.suggestion}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* REGISTROS DE HOJE */}
      <h3 className="font-bold text-gray-400 mb-3 uppercase tracking-wider text-xs">
        {t('diet.todayEntries', 'Consumido Hoje')}
      </h3>
      <div className="space-y-2">
        {todayEntries.length === 0 ? (
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 text-center text-gray-500 text-sm">
            {t('diet.noEntries', 'Sem registros')}
          </div>
        ) : (
          todayEntries.map((entry) => (
            <div key={entry.id} className="bg-gray-800 rounded-2xl border border-gray-700 p-3.5 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{entry.foodName}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{entry.calories} kcal</p>
              </div>
              <button
                onClick={() => handleDeleteEntry(entry.id)}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors shrink-0"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="shrink-0 mt-10">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>
    </div>
  );
}