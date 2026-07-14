// src/features/fitness/views/FitnessDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Flame, Dumbbell, ChevronRight, Settings2, Timer, MessageCircleHeart, Salad } from 'lucide-react';
import { db } from '../../../config/dexieDb';
import { useLanguage } from '../../../contexts/LanguageContext';
import { calculateLevel } from '../../../utils/xpManager';
import { getBMICategory, calculateGoalCalorieTarget } from '../../../utils/fitnessManager';
import BackButton from '../../../components/BackButton';
import FooterBrand from '../../../components/FooterBrand';
import PigeonAvatar from '../../../components/PigeonAvatar';
import FitnessOnboarding from './FitnessOnboarding';
import { useFitness } from '../../../contexts/FitnessContext';

const LOADING = '__LOADING__';

export default function FitnessDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const profile = useLiveQuery(() => db.fitnessProfile.get(1), [], LOADING);
  const { fitnessStreak, isFitnessStreakActive, caloriesToday } = useFitness();  // totalXp é COMPARTILHADO entre Idiomas e Fitness — é o mesmo contador de level da conta
  const userProfile = useLiveQuery(() => db.userProfile.get(1), [], { totalXp: 0 }) || { totalXp: 0 };

  if (profile === LOADING) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 text-sm animate-pulse">{t('general.loading', 'Carregando...')}</p>
      </div>
    );
  }

  if (!profile?.isOnboarded) {
    return <FitnessOnboarding />;
  }

  const bmiCategory = getBMICategory(profile.bmi);
  const accountLevel = calculateLevel(userProfile.totalXp || 0);
  const goalCalories = calculateGoalCalorieTarget(profile);

  return (
    <div className="w-full pt-8 animate-fade-in pb-24 px-4 -mt-5 -mb-20 min-h-screen">
      <BackButton to="/" label={t('backToHome', 'Voltar')} />

      {/* HEADER: Título "Fitness" + ícone de alteres */}
      <div className="flex items-center gap-3 mb-6 -mt-1">
        <div className="p-3 bg-green-500/20 text-green-400 rounded-2xl">
          <Dumbbell size={28} />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          {t('nav.fitness', 'Fitness')}
        </h1>
      </div>

      {/* ========================================================= */}
      {/* CARD ÚNICO: Perfil + Estatísticas — sem espaço/borda no meio */}
      {/* Cada metade tem seu próprio onClick, mas visualmente é um só bloco */}
      {/* ========================================================= */}
      <div className="metal-border-card bg-gray-800 rounded-3xl border border-gray-700 shadow-lg mb-6 overflow-hidden relative z-[1]">

        {/* METADE 1: Perfil */}
        <button
          onClick={() => navigate('/fitness/profile')}
          className="w-full p-5 flex items-center gap-4 hover:bg-gray-750/60 transition-colors text-left"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full border-2 border-green-500 flex items-center justify-center shrink-0">
            <PigeonAvatar accessory="none" className="w-10 h-10 mt-1" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-black text-white truncate">{t('fitness.myProfile', 'Meu Perfil Fitness')}</h3>
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] px-2 py-0.5 rounded-lg font-black shrink-0">
                {t('settings.level', 'Lv.')} {accountLevel}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {profile.weightKg}kg • {profile.heightCm}cm • IMC {profile.bmi} ({t(`fitness.bmi.${bmiCategory}`, bmiCategory)})
            </p>

            {/* NOVO: Meta máxima de calorias recomendada */}
            <div className="flex items-center gap-1.5 mt-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-2.5 py-1 w-max">
              <Flame size={12} className="text-orange-400" />
              <span className="text-[11px] font-bold text-orange-300">
                {t('fitness.maxCalories', 'Máx. recomendado')}: {goalCalories.dailyTarget} kcal/dia
              </span>
            </div>
          </div>
          {/* Ícone de settings com cor mais viva */}
          <Settings2 className="text-blue-400 shrink-0" size={22} />
        </button>

        {/* DIVISOR SUTIL (sem borda grossa, só uma linha fina de contexto) */}
        <div className="h-px bg-gray-700/70 mx-5" />

        {/* METADE 2: Estatísticas de Treino */}
        <button
          onClick={() => navigate('/fitness/stats')}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-750/60 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 rounded-2xl">
              <Flame className={isFitnessStreakActive ? 'text-orange-500' : 'text-gray-500'} size={24} />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">{t('fitness.streak', 'Ofensiva de Treino')}</p>
              <p className="text-xl font-black text-white">{fitnessStreak} {t('settings.days', 'dias')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">{t('fitness.caloriesToday', 'Calorias de Hoje')}</p>
            <p className="text-lg font-black text-green-400">{Math.round(caloriesToday)} kcal</p>
          </div>
        </button>
      </div>

      {/* BOTÃO ÚNICO: Treinos (leva para a lista de grupos musculares) */}
      <button
        onClick={() => navigate('/fitness/workouts')}
        className="metal-border-card w-full bg-gradient-to-r from-green-700 to-emerald-600 p-5 rounded-3xl flex items-center justify-between shadow-lg mb-4 hover:from-green-600 hover:to-emerald-500 transition-all relative z-[1]"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl text-white">
            <Dumbbell size={24} />
          </div>
          <div className="text-left">
            <h4 className="font-black text-white">{t('fitness.workoutGroups', 'Grupos de Treino')}</h4>
            <p className="text-[11px] text-green-100 font-medium">{t('fitness.workoutsDesc', 'Pernas, Core, Costas, Braços e Cardio')}</p>
          </div>
        </div>
        <ChevronRight className="text-white/80" />
      </button>

      {/* JEJUM INTERMITENTE */}
      <button
        onClick={() => navigate('/fitness/fasting')}
        className="metal-border-card w-full bg-gradient-to-r from-indigo-900/40 to-gray-800 border border-indigo-500/30 p-5 rounded-3xl flex items-center justify-between shadow-lg mb-4 hover:border-indigo-400 transition-all relative z-[1]"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl">
            <Timer className="text-indigo-400" size={24} />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-white">{t('fasting.title', 'Jejum Intermitente')}</h4>
            <p className="text-xs text-gray-400">{t('fasting.dashboardDesc', 'Controle seu jejum e ganhe calorias/XP')}</p>
          </div>
        </div>
        <ChevronRight className="text-indigo-400" />
      </button>

      {/* DIETA ORIENTADA POR IA (Em desenvolvimento) */}
      <div className="metal-border-card w-full bg-gray-800/40 border border-gray-700 border-dashed p-5 rounded-2xl flex items-center justify-between opacity-70 mb-4 relative z-[1]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-700 text-gray-400 rounded-xl"><Salad size={22} /></div>
          <div>
            <h4 className="font-bold text-gray-300">{t('fitness.dietModule', 'Dieta Orientada por IA')}</h4>
            <p className="text-xs text-gray-500">{t('inDev', 'Em desenvolvimento...')}</p>
          </div>
        </div>
      </div>

      {/* PERSONAL TRAINER IA (Chat) — Em desenvolvimento */}
      <div className="metal-border-card w-full bg-gray-800/40 border border-gray-700 border-dashed p-5 rounded-2xl flex items-center justify-between opacity-70 mb-8 relative z-[1]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-700 text-gray-400 rounded-xl"><MessageCircleHeart size={22} /></div>
          <div>
            <h4 className="font-bold text-gray-300">{t('fitness.aiTrainerChat', 'Chat com Personal Trainer IA')}</h4>
            <p className="text-xs text-gray-500">{t('inDev', 'Em desenvolvimento...')}</p>
          </div>
        </div>
      </div>

      <div className="shrink-0"><FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" /></div>
    </div>
  );
}