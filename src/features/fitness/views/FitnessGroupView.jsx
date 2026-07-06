// src/features/fitness/views/FitnessGroupView.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Play, ChevronRight, CheckCircle2, RotateCcw, Flame, Clock } from 'lucide-react';
import { db } from '../../../config/dexieDb';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FITNESS_GROUPS } from '../../../data/fitnessGroups';
import { resetFitnessExercise } from '../../../utils/fitnessManager';
import BackButton from '../../../components/BackButton';
import FooterBrand from '../../../components/FooterBrand';

export default function FitnessGroupView() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();

  const group = FITNESS_GROUPS[groupId];
  const getText = (obj) => obj?.[uiLang] || obj?.pt || '';

  const completedList = useLiveQuery(async () => {
    const all = await db.completedFitnessExercises.toArray();
    return all.filter(c => c.groupId === groupId);
  }, [groupId], []) || [];

  const [pendingReset, setPendingReset] = React.useState(null);

  if (!group) {
    return (
      <div className="w-full pt-8 text-center text-gray-400">
        {t('fitness.groupNotFound', 'Grupo de treino não encontrado.')}
      </div>
    );
  }

  const isCompletedToday = (exerciseId) => {
    const todayStr = new Date().toDateString();
    return completedList.some(c => c.exerciseId === exerciseId && new Date(c.completedAt).toDateString() === todayStr);
  };

  const confirmRestart = async () => {
    if (!pendingReset) return;
    await resetFitnessExercise(groupId, pendingReset);
    setPendingReset(null);
  };

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 min-h-screen -mt-5 -mb-20">
      <BackButton to="/fitness" label={t('general.back', 'Voltar')} />

      <div className="flex items-center gap-3 my-8 px-1">
        <div className="p-3 bg-green-500/20 text-green-400 rounded-2xl">
          <Flame size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">{getText(group.title)}</h2>
          <p className="text-sm font-bold text-gray-500 tracking-wider uppercase mt-1">
            {group.exercises.length} {t('fitness.exercises', 'exercícios')}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {group.exercises.map((ex) => {
          const done = isCompletedToday(ex.id);
          return (
            <button
              key={ex.id}
              onClick={() => navigate(`/fitness/group/${groupId}/exercise/${ex.id}`)}
              className={`w-full text-left p-5 rounded-[2rem] border transition-all shadow-lg relative overflow-hidden block ${
                done ? 'bg-gray-800/50 border-green-500/30' : 'bg-gray-800 border-gray-700 hover:border-green-400'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl ${
                    done ? 'bg-green-500 text-white' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {done ? <CheckCircle2 size={24} /> : <Play size={20} fill="currentColor" />}
                  </div>
                  <div className="text-left">
                    <span className="font-black text-white text-lg block">{getText(ex.name)}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mt-1">
                      {ex.sets}x {ex.isTimed ? `${ex.reps}s` : `${ex.reps} reps`}
                      <span className="text-yellow-500 flex items-center gap-1">
                        <Flame size={10} /> ~{ex.sets * ex.caloriesPerSet} kcal
                      </span>
                    </span>
                  </div>
                </div>

                {done ? (
                  <div
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPendingReset(ex.id); }}
                    className="p-3 rounded-full bg-black/20 hover:bg-black/50 text-green-300 hover:text-white transition-all z-20"
                  >
                    <RotateCcw size={20} />
                  </div>
                ) : (
                  <ChevronRight className="text-gray-600 shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="shrink-0 mt-10">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>

      {pendingReset && (
        <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-md flex items-center justify-center px-6 animate-fade-in">
          <div className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-black text-white mb-2">{t('fitness.restartExerciseTitle', 'Refazer exercício?')}</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {t('fitness.restartExerciseDesc', 'Isso vai desmarcar este exercício como concluído hoje.')}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setPendingReset(null)} className="flex-1 py-3 rounded-2xl bg-gray-700 hover:bg-gray-600 text-white font-bold">
                {t('cancel', 'Cancelar')}
              </button>
              <button onClick={confirmRestart} className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-bold">
                {t('general.restart', 'Reiniciar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}