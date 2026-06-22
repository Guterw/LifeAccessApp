// src/features/languages/english/views/alpha-numbers/ExerciseSelectionView.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Play, ChevronRight, BookOpenText, CheckCircle2, RotateCcw, AlertTriangle, Trophy } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { ALPHABET_EXERCISES } from '../../../../../data/alphabetExercises';
import { NUMBER_EXERCISES } from '../../../../../data/numberExercises';
import { db } from '../../../../../config/dexieDb';
import BackButton from '../../../../../components/BackButton';
import FooterBrand from '../../../../../components/FooterBrand';

export default function ExerciseSelectionView() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();

  // CORREÇÃO APLICADA: Substituído 'textData.pt' por 'textObj.pt'
  const getTranslated = (textObj) => {
    if (!textObj) return '';
    if (typeof textObj === 'string') return textObj;
    return textObj[uiLang] || textObj.pt || '';
  };

  const exercises = mode === 'alphabet' ? ALPHABET_EXERCISES : NUMBER_EXERCISES;
  const [pendingReset, setPendingReset] = useState(null);

  const completedList = useLiveQuery(async () => {
    const allCompleted = await db.completedAlphaNum.toArray();
    return allCompleted.filter(c => c.mode === mode);
  }, [mode]) || [];

  const progressList = useLiveQuery(async () => {
    const allProgress = await db.alphaNumProgress.toArray();
    return allProgress.filter(p => p.mode === mode);
  }, [mode]) || [];

  const completedIndexes = new Set(completedList.map((c) => c.exerciseIndex));
  const completedCount = completedIndexes.size;
  
  const progressMap = progressList.reduce((acc, curr) => {
    acc[curr.exerciseIndex] = curr;
    return acc;
  }, {});

  const requestRestart = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setPendingReset(index);
  };

  const confirmRestart = async () => {
    if (pendingReset === null) return;
    try {
      await db.completedAlphaNum.delete([mode, pendingReset]);
      await db.alphaNumProgress.delete([mode, pendingReset]);
    } catch (err) {
      console.error("Erro ao deletar progresso:", err);
    }
    setPendingReset(null);
  };

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 min-h-screen -mt-5 -mb-20">
      <BackButton to="/english/alpha-numbers" label={t('general.back', 'Voltar')} />

      <div className="flex items-center justify-between gap-3 my-8 px-1">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl">
            <BookOpenText size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white capitalize">
              {mode === 'alphabet' ? t('alpha.alphabet', 'Alfabeto') : t('alpha.numbers', 'Números')}
            </h2>
            <p className="text-sm font-bold text-gray-500 tracking-wider uppercase mt-1">
              {t('alpha.trainingMode', 'Modo Treino')}
            </p>
          </div>
        </div>

        {exercises.length > 0 && (
          <div className="shrink-0 flex flex-col items-center bg-gray-800 border border-gray-700 rounded-2xl px-4 py-2 shadow-md">
            <Trophy size={18} className={completedCount > 0 ? 'text-yellow-500' : 'text-gray-600'} />
            <span className="text-xs font-black text-white mt-1">{completedCount}/{exercises.length}</span>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {exercises.map((ex, index) => {
          const isCompleted = completedIndexes.has(index);
          const currentProgress = progressMap[index];
          
          const totalWords = ex.questions.length;
          const currentCorrect = isCompleted ? totalWords : (currentProgress?.correctCount || 0);
          const progressPercentage = (currentCorrect / totalWords) * 100;
          const barColor = isCompleted ? 'bg-green-500' : 'bg-indigo-500';

          return (
            <button
              key={ex.id ?? index}
              onClick={() => navigate(`/english/alpha-numbers/exercise/${mode}/${index}`)}
              className={`w-full text-left p-5 rounded-[2rem] border transition-all shadow-lg group relative overflow-hidden block
                ${isCompleted
                  ? 'bg-gray-800/50 border-green-500/30'
                  : 'bg-gray-800 border-gray-700 hover:border-indigo-400'
                }`}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              <div className="flex items-center justify-between mb-4 gap-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl transition-all
                    ${isCompleted
                      ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                      : 'bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={24} /> : <Play size={20} fill="currentColor" />}
                  </div>
                  <div className="text-left">
                    <span className="font-black text-white text-lg block">{t('general.exercise', 'Exercício')} {index + 1}</span>
                    {ex.title && (
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isCompleted ? 'text-green-400' : 'text-gray-400'}`}>
                        {isCompleted ? `${t('general.completed', 'Concluído')} · ` : ''}{getTranslated(ex.title)}
                      </span>
                    )}
                  </div>
                </div>

                {isCompleted ? (
                  <div
                    onClick={(e) => requestRestart(e, index)}
                    className="p-3 -mr-2 shrink-0 rounded-full bg-black/20 hover:bg-black/50 text-green-300 hover:text-white transition-all z-20"
                    title={t('general.restartExercise', 'Reiniciar Exercício')}
                  >
                    <RotateCcw size={20} />
                  </div>
                ) : (
                  <ChevronRight className="text-gray-600 shrink-0 group-hover:text-indigo-400 transition-colors" />
                )}
              </div>

              {/* BARRA DE PROGRESSO */}
              <div className="w-full bg-gray-900 rounded-full h-2 relative z-10">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${barColor}`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider text-right relative z-10">
                {currentCorrect} / {totalWords}
              </div>
            </button>
          );
        })}
      </div>

      <div className="shrink-0 mt-10">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>

      {pendingReset !== null && (
        <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-md flex items-center justify-center px-6 animate-fade-in">
          <div className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-3xl p-6 shadow-2xl">
            <div className="w-14 h-14 bg-amber-500/15 text-amber-400 rounded-2xl flex items-center justify-center mb-5">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-xl font-black text-white mb-2">{t('general.restartConfirmation', 'Reiniciar exercício?')}</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {t('general.restartWarning', 'Todo o seu progresso neste exercício será apagado e você vai começar do zero. Essa ação não pode ser desfeita.')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingReset(null)}
                className="flex-1 py-3 rounded-2xl bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors"
              >
                {t('cancel', 'Cancelar')}
              </button>
              <button
                onClick={confirmRestart}
                className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-bold transition-colors shadow-lg shadow-red-500/20"
              >
                {t('general.restart', 'Reiniciar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}