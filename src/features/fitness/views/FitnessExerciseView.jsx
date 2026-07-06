// src/features/fitness/views/FitnessExerciseView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Flame, Timer as TimerIcon, PartyPopper, Zap } from 'lucide-react';
import { FITNESS_GROUPS } from '../../../data/fitnessGroups';
import { completeFitnessExercise } from '../../../utils/fitnessManager';
import { useLanguage } from '../../../contexts/LanguageContext';
import BackButton from '../../../components/BackButton';
import FooterBrand from '../../../components/FooterBrand';
import StreakModal from '../../../components/StreakModal';

export default function FitnessExerciseView() {
  const { groupId, exerciseId } = useParams();
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();

  const group = FITNESS_GROUPS[groupId];
  const exercise = group?.exercises.find(e => e.id === exerciseId);
  const getText = (obj) => obj?.[uiLang] || obj?.pt || '';

  const [currentSet, setCurrentSet] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercise?.isTimed ? exercise.reps : 0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [streakUpdate, setStreakUpdate] = useState(null);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsTimerRunning(false);
            handleSetComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning]);

  if (!group || !exercise) {
    return (
      <div className="w-full pt-8 text-center text-gray-400">
        {t('fitness.exerciseNotFound', 'Exercício não encontrado.')}
      </div>
    );
  }

  const handleSetComplete = () => {
    if (currentSet >= exercise.sets) {
      finishExercise();
    } else {
      setCurrentSet((s) => s + 1);
      if (exercise.isTimed) setTimeLeft(exercise.reps);
    }
  };

  const finishExercise = async () => {
    const totalCalories = exercise.sets * exercise.caloriesPerSet;
    const { streakResult } = await completeFitnessExercise({
      groupId, exerciseId,
      caloriesBurned: totalCalories,
      xp: 15,
    });
    setStreakUpdate(streakResult);
    if (streakResult?.increased) setShowStreakModal(true);
    setIsFinished(true);
  };

  const progressPercent = ((currentSet - 1) / exercise.sets) * 100;

  if (isFinished) {
    return (
      <div className="w-full pt-8 animate-fade-in px-4 min-h-screen flex flex-col items-center justify-center text-center">
        <StreakModal streakUpdate={showStreakModal ? streakUpdate : null} onClose={() => setShowStreakModal(false)} />
        <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)] animate-bounce">
          <PartyPopper size={48} />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">{t('fitness.exerciseDone', 'Exercício Concluído!')}</h2>
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 py-2 px-4 rounded-xl mb-2">
          <Flame size={18} className="text-yellow-500" />
          <span className="text-yellow-400 font-black">+{exercise.sets * exercise.caloriesPerSet} kcal</span>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 py-2 px-4 rounded-xl mb-10">
          <Zap size={18} className="text-indigo-400" />
          <span className="text-indigo-300 font-black">+15 XP</span>
        </div>
        <button
          onClick={() => navigate(`/fitness/group/${groupId}`)}
          className="px-8 py-4 bg-white text-black font-black rounded-full hover:bg-gray-200 transition-all shadow-xl active:scale-95"
        >
          {t('general.backToMenu', 'Voltar para o Menu')}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full pt-8 animate-fade-in px-4 min-h-screen flex flex-col">
      <BackButton to={`/fitness/group/${groupId}`} label={t('general.back', 'Voltar')} />

      <div className="mt-2 mb-2 max-w-sm w-full mx-auto">
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto w-full">
        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-3 bg-green-500/10 py-1 px-3 rounded-full">
          {t('fitness.setLabel', 'Série')} {currentSet} / {exercise.sets}
        </span>
        <h2 className="text-3xl font-black text-white mb-6">{getText(exercise.name)}</h2>

        {exercise.isTimed ? (
          <>
            <div className="w-40 h-40 rounded-full border-8 border-green-500/30 flex items-center justify-center mb-8 relative">
              <span className="text-5xl font-black text-white">{timeLeft}</span>
              <TimerIcon className="absolute -top-3 -right-3 text-green-400 bg-gray-900 rounded-full p-1" size={28} />
            </div>
            <button
              onClick={() => setIsTimerRunning(true)}
              disabled={isTimerRunning}
              className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95"
            >
              {isTimerRunning ? t('fitness.timerRunning', 'Cronometrando...') : t('fitness.startTimer', 'Iniciar Cronômetro')}
            </button>
          </>
        ) : (
          <>
            <div className="w-40 h-40 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center mb-8">
              <span className="text-5xl font-black text-white">{exercise.reps}</span>
            </div>
            <p className="text-gray-400 text-sm mb-8">{t('fitness.repsLabel', 'repetições nesta série')}</p>
            <button
              onClick={handleSetComplete}
              className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={22} />
              {currentSet >= exercise.sets ? t('fitness.finishExercise', 'Finalizar Exercício') : t('fitness.completeSet', 'Concluir Série')}
            </button>
          </>
        )}
      </div>

      <div className="shrink-0 mt-8"><FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" /></div>
    </div>
  );
}