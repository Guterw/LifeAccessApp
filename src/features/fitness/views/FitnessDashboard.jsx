// src/features/fitness/views/FitnessDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Flame, Dumbbell, ChevronRight, Footprints, Zap, ArrowUpFromLine, HeartPulse, Settings2, Timer } from 'lucide-react';
import { db } from '../../../config/dexieDb';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FITNESS_GROUPS } from '../../../data/fitnessGroups';
import { calculateLevel } from '../../../utils/xpManager';
import { getBMICategory } from '../../../utils/fitnessManager';
import BackButton from '../../../components/BackButton';
import FooterBrand from '../../../components/FooterBrand';
import PigeonAvatar from '../../../components/PigeonAvatar';
import FitnessOnboarding from './FitnessOnboarding';

const ICONS = { Footprints, Zap, ArrowUpFromLine, Dumbbell, HeartPulse };

// Sentinela: enquanto o Dexie ainda não respondeu, mostramos isso.
// Assim distinguimos "carregando" de "carregou e não existe perfil" (undefined em ambos os casos sem isso).
const LOADING = '__LOADING__';

export default function FitnessDashboard() {
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();

  const profile = useLiveQuery(() => {
    console.log('[Fitness] Buscando fitnessProfile no Dexie...');
    return db.fitnessProfile.get(1);
  }, [], LOADING);

  const streak = useLiveQuery(() => db.fitnessStreak.get(1), [], { streak: 0 }) || { streak: 0 };
  const userProfile = useLiveQuery(() => db.userProfile.get(1), [], { totalXp: 0 }) || { totalXp: 0 };
  const completedCount = useLiveQuery(() => db.completedFitnessExercises.count(), [], 0) ?? 0;

  if (profile === LOADING) {
    console.log('[Fitness] Ainda carregando perfil...');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 text-sm animate-pulse">{t('general.loading', 'Carregando...')}</p>
      </div>
    );
  }

  if (!profile?.isOnboarded) {
    console.log('[Fitness] Nenhum perfil onboarded encontrado — exibindo Onboarding.', profile);
    return <FitnessOnboarding />;
  }

  console.log('[Fitness] Perfil carregado com sucesso:', profile);

  const bmiCategory = getBMICategory(profile.bmi);
  const level = calculateLevel(userProfile.totalXp || 0);
  const getTitle = (obj) => obj[uiLang] || obj.pt;

  return (
    <div className="w-full pt-8 animate-fade-in pb-24 px-4 -mt-5 -mb-20 min-h-screen">
      <BackButton to="/" label={t('backToHome', 'Voltar')} />

      {/* PERFIL NO TOPO */}
      <button
        onClick={() => navigate('/fitness/profile')}
        className="w-full bg-gray-800 p-5 rounded-3xl border border-gray-700 flex items-center gap-4 shadow-lg mb-4 hover:border-green-500 transition-all"
      >
        <div className="w-16 h-16 bg-green-500/20 rounded-full border-2 border-green-500 flex items-center justify-center shrink-0">
          <PigeonAvatar accessory="none" className="w-10 h-10 mt-1" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <h3 className="text-lg font-black text-white">{t('fitness.myProfile', 'Meu Perfil Fitness')}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {profile.weightKg}kg • {profile.heightCm}cm • IMC {profile.bmi} ({t(`fitness.bmi.${bmiCategory}`, bmiCategory)})
          </p>
        </div>
        <Settings2 className="text-gray-500 shrink-0" size={20} />
      </button>

      {/* CARD STATUS */}
      <button
        onClick={() => navigate('/fitness/stats')}
        className="w-full bg-gradient-to-r from-green-900/40 to-gray-800 border border-green-500/30 p-5 rounded-3xl flex items-center justify-between shadow-lg mb-4 hover:border-green-400 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/20 rounded-2xl">
            <Flame className={streak.streak > 0 ? 'text-orange-500' : 'text-gray-500'} size={24} />
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">{t('fitness.streak', 'Ofensiva de Treino')}</p>
            <p className="text-xl font-black text-white">{streak.streak} {t('settings.days', 'dias')}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">{t('fitness.calories', 'Calorias')}</p>
          <p className="text-lg font-black text-green-400">{Math.round(profile.caloriesBurnedTotal || 0)} kcal</p>
        </div>
      </button>

      {/* JEJUM INTERMITENTE */}
      <button
        onClick={() => navigate('/fitness/fasting')}
        className="w-full bg-gradient-to-r from-indigo-900/40 to-gray-800 border border-indigo-500/30 p-5 rounded-3xl flex items-center justify-between shadow-lg mb-6 hover:border-indigo-400 transition-all"
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

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-400 uppercase tracking-wider text-sm">{t('fitness.workoutGroups', 'Grupos de Treino')}</h3>
        <span className="text-xs text-gray-500 font-bold">Lv. {level} • {completedCount} {t('fitness.exercisesDone', 'exercícios feitos')}</span>
      </div>

      <div className="grid gap-4 mb-8">
        {Object.values(FITNESS_GROUPS).map((group) => {
          const Icon = ICONS[group.icon] || Dumbbell;
          return (
            <button
              key={group.id}
              onClick={() => navigate(`/fitness/group/${group.id}`)}
              className="w-full bg-gray-800 p-5 rounded-2xl border border-gray-700 flex items-center justify-between hover:border-green-500 transition-all shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 text-green-400 rounded-xl"><Icon size={24} /></div>
                <div className="text-left">
                  <h4 className="font-bold text-white">{getTitle(group.title)}</h4>
                  <p className="text-xs text-gray-400">{group.exercises.length} {t('fitness.exercises', 'exercícios')}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-500" />
            </button>
          );
        })}
      </div>

      <div className="w-full bg-gray-800/40 border border-gray-700 border-dashed p-5 rounded-2xl flex items-center justify-between opacity-70 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-700 text-gray-400 rounded-xl">🥗</div>
          <div>
            <h4 className="font-bold text-gray-300">{t('fitness.dietModule', 'Dieta Orientada por IA')}</h4>
            <p className="text-xs text-gray-500">{t('inDev', 'Em desenvolvimento...')}</p>
          </div>
        </div>
      </div>

      <div className="shrink-0"><FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" /></div>
    </div>
  );
}