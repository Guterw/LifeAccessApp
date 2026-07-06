// src/features/fitness/views/FitnessStatsView.jsx
import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Flame, Zap, Trophy, Dumbbell } from 'lucide-react';
import { db } from '../../../config/dexieDb';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FITNESS_GROUPS } from '../../../data/fitnessGroups';
import BackButton from '../../../components/BackButton';
import FooterBrand from '../../../components/FooterBrand';

export default function FitnessStatsView() {
  const { t, uiLang } = useLanguage();

  const profile = useLiveQuery(() => db.fitnessProfile.get(1), [], null);
  const streak = useLiveQuery(() => db.fitnessStreak.get(1), [], { streak: 0 }) || { streak: 0 };
  const completed = useLiveQuery(() => db.completedFitnessExercises.toArray(), [], []) || [];

  const getText = (obj) => obj?.[uiLang] || obj?.pt || '';

  const byGroup = Object.keys(FITNESS_GROUPS).map((groupId) => {
    const group = FITNESS_GROUPS[groupId];
    const count = completed.filter(c => c.groupId === groupId).length;
    const calories = completed.filter(c => c.groupId === groupId).reduce((sum, c) => sum + (c.caloriesBurned || 0), 0);
    return { groupId, title: getText(group.title), count, calories };
  });

  const totalXp = completed.reduce((sum, c) => sum + (c.xp || 0), 0);

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 min-h-screen -mt-5 -mb-20">
      <BackButton to="/fitness" label={t('general.back', 'Voltar')} />

      <h2 className="text-3xl font-black text-white my-6">{t('fitness.statsTitle', 'Estatísticas de Treino')}</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
          <Flame className="text-orange-500 mb-2" size={26} />
          <p className="text-xs text-gray-400 font-bold uppercase">{t('fitness.streak', 'Ofensiva')}</p>
          <p className="text-2xl font-black text-white">{streak.streak} {t('settings.days', 'dias')}</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
          <Flame className="text-green-400 mb-2" size={26} />
          <p className="text-xs text-gray-400 font-bold uppercase">{t('fitness.calories', 'Calorias')}</p>
          <p className="text-2xl font-black text-white">{Math.round(profile?.caloriesBurnedTotal || 0)}</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
          <Zap className="text-yellow-400 mb-2" size={26} />
          <p className="text-xs text-gray-400 font-bold uppercase">XP Total</p>
          <p className="text-2xl font-black text-white">{totalXp}</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
          <Trophy className="text-blue-400 mb-2" size={26} />
          <p className="text-xs text-gray-400 font-bold uppercase">{t('fitness.exercisesDone', 'Exercícios')}</p>
          <p className="text-2xl font-black text-white">{completed.length}</p>
        </div>
      </div>

      <h3 className="font-bold text-gray-400 mb-3 uppercase tracking-wider text-sm">{t('fitness.byGroup', 'Por Grupo Muscular')}</h3>
      <div className="space-y-3">
        {byGroup.map(g => (
          <div key={g.groupId} className="bg-gray-800 p-4 rounded-2xl border border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 text-green-400 rounded-lg"><Dumbbell size={18} /></div>
              <span className="font-bold text-white text-sm">{g.title}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-white">{g.count}x</p>
              <p className="text-[10px] text-gray-500 font-bold">{g.calories} kcal</p>
            </div>
          </div>
        ))}
      </div>

      <div className="shrink-0 mt-10"><FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" /></div>
    </div>
  );
}