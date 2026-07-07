// src/features/fitness/views/FitnessWorkoutsView.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Dumbbell, Footprints, Zap, ArrowUpFromLine, HeartPulse } from 'lucide-react';
import { FITNESS_GROUPS } from '../../../data/fitnessGroups';
import { useLanguage } from '../../../contexts/LanguageContext';
import BackButton from '../../../components/BackButton';
import FooterBrand from '../../../components/FooterBrand';

const ICONS = { Footprints, Zap, ArrowUpFromLine, Dumbbell, HeartPulse };

export default function FitnessWorkoutsView() {
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();
  const getTitle = (obj) => obj[uiLang] || obj.pt;

  return (
    <div className="w-full pt-8 animate-fade-in pb-24 px-4 -mt-5 -mb-20 min-h-screen">
      <BackButton to="/fitness" label={t('backToHome', 'Voltar')} />

      <div className="flex items-center gap-3 my-6">
        <div className="p-3 bg-green-500/20 text-green-400 rounded-2xl">
          <Dumbbell size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{t('fitness.workoutGroups', 'Grupos de Treino')}</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
            {t('fitness.chooseGroup', 'Escolha um grupo muscular para treinar')}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {Object.values(FITNESS_GROUPS).map((group) => {
          const Icon = ICONS[group.icon] || Dumbbell;
          return (
            <button
              key={group.id}
              onClick={() => navigate(`/fitness/group/${group.id}`)}
              className="metal-border-card w-full bg-gray-800 p-5 rounded-2xl border border-gray-700 flex items-center justify-between hover:border-green-500 transition-all shadow-md relative z-[1]"
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

      <div className="shrink-0 mt-10"><FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" /></div>
    </div>
  );
}