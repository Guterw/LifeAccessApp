// src/features/languages/english/views/vocabularies/vocab-reverse/VocabReverseView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../../../../../config/dexieDb';
import { vocabReverseLevels } from '../../../../../../data/vocabReverseLevels';
import { RotateCcw, CheckCircle2, XCircle, Flame, Volume2 } from 'lucide-react';
import { useLanguage } from '../../../../../../contexts/LanguageContext';
import BackButton from '../../../../../../components/BackButton';
import { addXP } from '../../../../../../utils/xpManager';
import StreakModal from '../../../../../../components/StreakModal';

export default function VocabReverseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, uiLang, registerLanguageActivity } = useLanguage();

  const currentLevelId = parseInt(id) || 1;
  const levelData = vocabReverseLevels[currentLevelId];

  const [queue, setQueue] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [progress, setProgress] = useState({ correct: 0, total: levelData?.words.length || 0 });
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [streakUpdate, setStreakUpdate] = useState(null);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const backRoute = location.state?.fromTrail
    ? '/english/trail'
    : `/english/vocabularies/vocab-reverse/levels/group/${(levelData?.group && levelData.group[0]) || 'A1'}`;

  const currentWord = queue[0];
  const promptTranslation = currentWord
    ? ((uiLang === 'es' && currentWord.es) ? currentWord.es[0] : currentWord.pt?.[0])
    : '';

  useEffect(() => {
    if (!levelData) return;
    const load = async () => {
      const saved = await db.levelProgressReverse.get(currentLevelId);
      if (saved && saved.pendingQueue.length > 0) {
        setQueue(saved.pendingQueue);
        setProgress({ correct: saved.correctCount, total: saved.total });
      } else {
        setQueue(levelData.words);
        setProgress({ correct: 0, total: levelData.words.length });
      }
    };
    load();
  }, [currentLevelId, levelData]);

  // FUNÇÃO ISOLADA DE FALA COM LOWERCASE (Corrige bug iOS para letras singulares)
  const speakPrompt = () => {
    if (!window.speechSynthesis || !promptTranslation) return;
    window.speechSynthesis.cancel();
    const cleanText = String(promptTranslation).toLowerCase();
    const utt = new SpeechSynthesisUtterance(cleanText);
    utt.lang = uiLang === 'es' ? 'es-ES' : 'pt-BR';
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  };

  // REPRODUÇÃO AUTOMÁTICA (Auto-TTS)
  useEffect(() => {
    if (promptTranslation && !feedback) {
      const timer = setTimeout(() => { speakPrompt(); }, 400);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promptTranslation, feedback, uiLang]);

  const saveState = async (newQueue, newCorrectCount) => {
    await db.levelProgressReverse.put({
      level: currentLevelId,
      correctCount: newCorrectCount,
      total: progress.total,
      pendingQueue: newQueue,
    });
  };

  const handleCheck = async (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || !currentWord) return;

    const userAnswer = inputVal.trim().toLowerCase();
    const isCorrect = userAnswer === currentWord.en.toLowerCase();

    let newQueue = [...queue];

    if (isCorrect) {
      setFeedback('correct');
      await db.learnedWords.put({
        en: currentWord.en,
        translation: promptTranslation,
        level: currentLevelId,
        category: currentWord.category || 'Geral',
        learnedAt: new Date().toISOString(),
      });
      newQueue.shift();
      const newCorrect = progress.correct + 1;
      setProgress({ ...progress, correct: newCorrect });
      await saveState(newQueue, newCorrect);
    } else {
      setFeedback('wrong');
      const failed = newQueue.shift();
      newQueue.push(failed);
      await saveState(newQueue, progress.correct);
    }

    setTimeout(async () => {
      setInputVal('');
      setFeedback(null);
      if (newQueue.length === 0) {
        await addXP(20);
        const result = await registerLanguageActivity();
        setStreakUpdate(result);
        if (result?.increased) setShowStreakModal(true);
        await db.completedLevelsReverse.put({ level: currentLevelId, completedAt: new Date().toISOString() });
        setIsFinished(true);
      } else {
        setQueue(newQueue);
      }
    }, isCorrect ? 1800 : 2400);
  };

  const handleRestartLevel = async () => {
    await db.levelProgressReverse.delete(currentLevelId);
    setQueue(levelData.words);
    setProgress({ correct: 0, total: levelData.words.length });
    setIsFinished(false);
    setShowStreakModal(false);
  };

  if (!levelData) return <div className="p-8 text-center">{t('level.notFound')}</div>;

  return (
    <div className="w-full pt-8 animate-fade-in relative px-4">
      <BackButton to={backRoute} label={t('levelList.title')} />

      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-2xl font-bold text-emerald-400">{levelData.title[uiLang] || levelData.title.pt}</h2>
        <button onClick={handleRestartLevel} className="text-gray-400 hover:text-white p-2 bg-gray-800 rounded-lg border border-gray-700 shadow-sm">
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{t('level.progress')}</span>
          <span className="font-bold text-white">{progress.correct} / {progress.total}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div className="bg-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${(progress.correct / progress.total) * 100}%` }}></div>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-700 text-center relative overflow-hidden">
          {feedback && (
            <div className="absolute inset-0 bg-gray-900/95 flex flex-col items-center justify-center z-10 backdrop-blur-md animate-fade-in px-4">
              {feedback === 'correct'
                ? <CheckCircle2 size={60} className="text-green-500 mb-4" />
                : <XCircle size={60} className="text-red-500 mb-4" />}
              <p className="text-gray-300 text-sm font-bold uppercase tracking-widest mb-1">
                {feedback === 'correct' ? t('level.excellent', 'Excelente!') : t('level.correctIs', 'A palavra correta era:')}
              </p>
              <p className="text-white text-2xl sm:text-3xl font-black">{currentWord?.en}</p>
            </div>
          )}

          <p className="text-gray-400 text-xs sm:text-sm mb-2">
            {t('vocab.reversePrompt', 'Escreva esta palavra em inglês:')}
          </p>
          
          <div className="flex items-center justify-center gap-3 mr-12 mb-8 px-2">
            <button 
              type="button"
              onClick={speakPrompt}
              className="w-10 h-10 mt-2 flex items-center justify-center bg-emerald-500/20 text-emerald-400 rounded-full hover:bg-emerald-500/30 transition-colors shrink-0"
              title={t('general.listenAgain', 'Ouvir novamente')}
            >
              <Volume2 size={20} />
            </button>
            <h3 className="text-3xl sm:text-4xl font-black text-white text-center break-words">
              {promptTranslation}
            </h3>
          </div>

          <form onSubmit={handleCheck} className="space-y-4">
            <input
              type="text" autoFocus disabled={feedback !== null}
              placeholder={t('level.placeholder', 'Sua resposta em inglês...')}
              value={inputVal} onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-gray-900 text-white p-3 sm:p-4 rounded-xl border-2 border-gray-700 focus:border-emerald-500 focus:outline-none text-center text-base sm:text-lg transition-colors"
            />
            <button
              type="submit" disabled={feedback !== null}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 sm:p-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {t('level.confirm', 'Confirmar')}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-2xl border border-green-500 text-center shadow-lg animate-fade-in">
          <CheckCircle2 size={60} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">{t('level.completedTitle', 'Nível Concluído!')}</h3>
          <div className="flex items-center justify-center gap-2 mb-4 bg-yellow-500/10 border border-yellow-500/20 py-2 px-4 rounded-xl w-max mx-auto">
            <Flame size={20} className="text-yellow-500" />
            <span className="text-yellow-400 font-black text-lg">+20 {t('level.xpReward', 'XP')}</span>
          </div>
          <button onClick={() => navigate(backRoute)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-4 rounded-xl mb-3 transition-colors shadow-lg">
            {t('level.finishBtn', 'Finalizar')}
          </button>
          <button onClick={handleRestartLevel} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold p-4 rounded-xl transition-colors">
            {t('level.redoBtn', 'Refazer Nível')}
          </button>
        </div>
      )}

      <StreakModal streakUpdate={showStreakModal ? streakUpdate : null} onClose={() => setShowStreakModal(false)} />
    </div>
  );
}