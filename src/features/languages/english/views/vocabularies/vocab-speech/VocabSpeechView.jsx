// src/features/languages/english/views/vocabularies/vocab-speech/VocabSpeechView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../../../../../config/dexieDb';
import { vocabSpeechLevels } from '../../../../../../data/vocabSpeechLevels';
import { RotateCcw, CheckCircle2, XCircle, Flame, Mic, StopCircle } from 'lucide-react';
import { useLanguage } from '../../../../../../contexts/LanguageContext';
import BackButton from '../../../../../../components/BackButton';
import { addXP } from '../../../../../../utils/xpManager';
import { useSpeech } from '../../../../../../hooks/useSpeech';
import StreakModal from '../../../../../../components/StreakModal';
import { useError } from '../../../../../../contexts/ErrorContext';

const normalize = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

export default function VocabSpeechView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, registerLanguageActivity } = useLanguage();
  const { showError } = useError();

  const currentLevelId = parseInt(id) || 1;
  const levelData = vocabSpeechLevels[currentLevelId];

  const [queue, setQueue] = useState([]);
  const [progress, setProgress] = useState({ correct: 0, total: levelData?.words.length || 0 });
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [micLoading, setMicLoading] = useState(false);
  const [streakUpdate, setStreakUpdate] = useState(null);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const { transcript, isListening, startListening, stopListening, resetTranscript, hasSupport } = useSpeech('en-IE');

  const backRoute = location.state?.fromTrail
    ? '/english/trail'
    : `/english/vocabularies/vocab-speech/levels/group/${(levelData?.group && levelData.group[0]) || 'A1'}`;

  const currentWord = queue[0];

  useEffect(() => {
    if (!levelData) return;
    const load = async () => {
      const saved = await db.levelProgressSpeech.get(currentLevelId);
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

  const saveState = async (newQueue, newCorrectCount) => {
    await db.levelProgressSpeech.put({
      level: currentLevelId,
      correctCount: newCorrectCount,
      total: progress.total,
      pendingQueue: newQueue,
    });
  };

  const speakTarget = () => {
    if (!window.speechSynthesis || !currentWord) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(currentWord.en);
    utt.lang = 'en-IE';
    utt.rate = 0.85;
    window.speechSynthesis.speak(utt);
  };

  const handleMic = async () => {
    if (feedback) return;
    if (isListening) { stopListening(); return; }
    if (!hasSupport) { showError('Seu navegador não suporta reconhecimento de voz.'); return; }

    setMicLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((tr) => tr.stop());
    } catch (err) {
      setMicLoading(false);
      showError('Acesso ao microfone negado.');
      return;
    }
    setMicLoading(false);
    resetTranscript();
    startListening();
  };

  useEffect(() => {
    if (!isListening && transcript && !feedback) {
      handleCheck(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const handleCheck = async (spokenText) => {
    if (!currentWord) return;
    const isCorrect = normalize(spokenText) === normalize(currentWord.en);
    let newQueue = [...queue];

    if (isCorrect) {
      setFeedback('correct');
      await db.learnedWords.put({
        en: currentWord.en,
        translation: currentWord.pt?.[0] || currentWord.en,
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
      resetTranscript();
      setFeedback(null);
      if (newQueue.length === 0) {
        await addXP(20);
        const result = await registerLanguageActivity();
        setStreakUpdate(result);
        if (result?.increased) setShowStreakModal(true);
        await db.completedLevelsSpeech.put({ level: currentLevelId, completedAt: new Date().toISOString() });
        setIsFinished(true);
      } else {
        setQueue(newQueue);
      }
    }, isCorrect ? 1800 : 2400);
  };

  const handleRestartLevel = async () => {
    await db.levelProgressSpeech.delete(currentLevelId);
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
        <h2 className="text-2xl font-bold text-pink-400">{levelData.title[t('uiLang')] || levelData.title.pt}</h2>
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
          <div className="bg-pink-500 h-3 rounded-full transition-all duration-500" style={{ width: `${(progress.correct / progress.total) * 100}%` }}></div>
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
                {feedback === 'correct' ? t('level.excellent', 'Excelente!') : t('level.correctIs', 'A palavra era:')}
              </p>
              <p className="text-white text-2xl font-black">{currentWord?.en}</p>
            </div>
          )}

          <p className="text-gray-400 text-sm mb-2">{t('vocab.speechPrompt', 'Pronuncie esta palavra em voz alta:')}</p>
          <h3 className="text-3xl sm:text-4xl font-black text-white mb-6">
            {currentWord?.pt?.[0] || currentWord?.en}
          </h3>

          <button onClick={speakTarget} className="text-xs font-bold text-pink-400 underline mb-8">
            {t('general.listenAgain', 'Ouvir a palavra')}
          </button>

          <button
            onClick={handleMic}
            disabled={!!feedback || micLoading}
            className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all shadow-xl ${
              isListening
                ? 'bg-red-500/20 text-red-400 border-2 border-red-500 animate-pulse'
                : 'bg-gradient-to-tr from-pink-600 to-purple-500 text-white hover:scale-105'
            }`}
          >
            {isListening ? <StopCircle size={40} /> : <Mic size={40} />}
          </button>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-4">
            {isListening ? t('general.tapToSpeak', 'Toque para parar') : 'Toque para falar'}
          </p>
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-2xl border border-green-500 text-center shadow-lg animate-fade-in">
          <CheckCircle2 size={60} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">{t('level.completedTitle', 'Nível Concluído!')}</h3>
          <div className="flex items-center justify-center gap-2 mb-4 bg-yellow-500/10 border border-yellow-500/20 py-2 px-4 rounded-xl w-max mx-auto">
            <Flame size={20} className="text-yellow-500" />
            <span className="text-yellow-400 font-black text-lg">+20 {t('level.xpReward', 'XP')}</span>
          </div>
          <button onClick={() => navigate(backRoute)} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold p-4 rounded-xl mb-3 transition-colors shadow-lg">
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