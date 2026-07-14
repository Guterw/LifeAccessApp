// src/features/languages/english/views/ExplainedLessonGroupView.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { CheckCircle2, Sparkles, RotateCcw, AlertTriangle, Play, Flame } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { EXPLAINED_LESSONS } from '../../../../../data/explainedLessons';
import { db } from '../../../../../config/dexieDb';
import BackButton from '../../../../../components/BackButton';
import FooterBrand from '../../../../../components/FooterBrand';
import UserProfileBadge from '../../../../../components/UserProfileBadge';

export default function ExplainedLessonGroupView() {
  const { groupName } = useParams();
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();

  const getText = (obj) => obj?.[uiLang] || obj?.pt || '';

  const completedLessons = useLiveQuery(() => db.completedExplainedLessons.toArray(), []) || [];
  const isDone = (id) => completedLessons.some(c => c.lessonId === id);

  // Estado do modal de reset
  const [resetModal, setResetModal] = useState({ isOpen: false, lessonId: null });

  // Filtra as lições pertencentes a este grupo
  const groupLessons = EXPLAINED_LESSONS.filter(lesson => {
    const groupList = (lesson.group && lesson.group.length)
      ? lesson.group
      : (lesson.level ? [lesson.level] : ['A1']);
    return groupList.includes(groupName);
  });

  const confirmRestart = async () => {
    if (!resetModal.lessonId) return;
    try {
      await db.completedExplainedLessons.where('lessonId').equals(resetModal.lessonId).delete();
    } catch (err) {
      console.error('Erro ao reiniciar lição:', err);
    } finally {
      setResetModal({ isOpen: false, lessonId: null });
    }
  };

  return (
    <div className="w-full pt-8 animate-fade-in pb-24 px-4 -mb-20 -mt-5">
      <div className="flex items-center justify-between mb-4 -ml-4 -mr-4">
        <BackButton to="/english/explained" label={t('general.back', 'Voltar')} />
        <UserProfileBadge className="-mt-1 -mr-2 shrink-0" />
      </div>

      <div className="flex items-center gap-3 my-6 px-1">
        <div className="p-3 bg-fuchsia-500/20 text-fuchsia-400 rounded-2xl">
          <Sparkles size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">
            Lições - Nível {groupName}
          </h2>
          <p className="text-sm text-gray-400">
            {groupLessons.length} {t('explained.lessonsCount', 'lições neste módulo')}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {groupLessons.map((lesson) => {
          const done = isDone(lesson.id);

          return (
            <div
              key={lesson.id}
              className={`w-full p-5 rounded-[2rem] border transition-all shadow-lg flex items-center justify-between ${
                done ? 'bg-gray-800/50 border-green-500/30' : 'bg-gray-800 border-gray-700 hover:border-fuchsia-400'
              }`}
            >
              <div
                onClick={() => navigate(`/english/explained/${lesson.id}`)}
                className="flex items-center gap-4 flex-1 cursor-pointer pr-2"
              >
                <div className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl ${
                  done ? 'bg-green-500 text-white' : 'bg-fuchsia-500/20 text-fuchsia-400'
                }`}>
                  {done ? <CheckCircle2 size={24} /> : <Sparkles size={20} />}
                </div>
                <div>
                  <span className="font-black text-white text-lg block">{getText(lesson.title)}</span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">
                      {lesson.exercises?.length || 0} exercícios
                    </span>
                    <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-md border border-yellow-500/20">
                      <Flame size={10} />
                      <span className="text-[10px] font-bold">+30 XP</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {done ? (
                  <button
                    onClick={() => setResetModal({ isOpen: true, lessonId: lesson.id })}
                    title="Reiniciar Lição"
                    className="p-3 rounded-xl bg-gray-700/50 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-colors"
                  >
                    <RotateCcw size={20} />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/english/explained/${lesson.id}`)}
                    className="p-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold transition-all shadow-lg shadow-fuchsia-600/30 flex items-center gap-1"
                  >
                    <Play size={18} fill="currentColor" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de confirmação de Reset */}
      {resetModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4 border border-red-500/20">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t('explained.restartTitle', 'Reiniciar Lição?')}
            </h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {t('explained.restartWarning', 'Deseja apagar o status de conclusão e refazer esta lição do zero?')}
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setResetModal({ isOpen: false, lessonId: null })}
                className="flex-1 py-3.5 rounded-2xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-colors"
              >
                {t('cancel', 'Cancelar')}
              </button>
              <button
                onClick={confirmRestart}
                className="flex-1 py-3.5 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30"
              >
                {t('confirm', 'Reiniciar')}
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterBrand />
    </div>
  );
}