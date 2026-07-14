// src/features/languages/english/views/vocabularies/vocab-speech/VocabSpeechView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../../../../../config/dexieDb';
import { vocabSpeechLevels } from '../../../../../../data/vocabSpeechLevels';
import { RotateCcw, CheckCircle2, XCircle, Flame, Mic, StopCircle, Volume2 } from 'lucide-react';
import { useLanguage } from '../../../../../../contexts/LanguageContext';
import BackButton from '../../../../../../components/BackButton';
import { addXP } from '../../../../../../utils/xpManager';
import { useSpeech } from '../../../../../../hooks/useSpeech';
import StreakModal from '../../../../../../components/StreakModal';
import SpeechToast from '../../../../../../components/SpeechToast';
import { useError } from '../../../../../../contexts/ErrorContext';

const normalize = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

export default function VocabSpeechView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, uiLang, registerLanguageActivity } = useLanguage();
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

  // Estados Visuais do Microfone
  const [turnTranscript, setTurnTranscript] = useState('');
  const [toastStatus, setToastStatus] = useState(null);
  const silenceDebounceRef = useRef(null);

  const { transcript, isListening, speechStatus, startListening, stopListening, resetTranscript, hasSupport } = useSpeech('en-IE');

  const backRoute = location.state?.fromTrail
    ? '/english/trail'
    : `/english/vocabularies/vocab-speech/levels/group/${(levelData?.group && levelData.group[0]) || 'A1'}`;

  const currentWord = queue[0];
  
  // Extrai a palavra no idioma base do app para a interface e para a voz
  const promptTranslation = currentWord
    ? ((uiLang === 'es' && currentWord.es) ? currentWord.es[0] : currentWord.pt?.[0]) || currentWord.en
    : '';

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

  // Função atualizada para ditar em Português/Espanhol e com toLowerCase()
  const speakPrompt = () => {
    if (!window.speechSynthesis || !promptTranslation) return;
    window.speechSynthesis.cancel();
    const cleanText = String(promptTranslation).toLowerCase(); 
    const utt = new SpeechSynthesisUtterance(cleanText);
    utt.lang = uiLang === 'es' ? 'es-ES' : 'pt-BR';
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  };

  // 1. REPRODUÇÃO AUTOMÁTICA (Auto-TTS em PT/ES)
  useEffect(() => {
    if (promptTranslation && !feedback && !isListening) {
      const timer = setTimeout(() => { speakPrompt(); }, 400);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promptTranslation, feedback]);

  // 2. CONTROLE DO MICROFONE E PERMISSÃO iOS
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
    setTurnTranscript('');
    startListening();
  };

  // 3. ATUALIZAÇÃO VISUAL E AUTO-STOP POR SILÊNCIO (2.5s)
  useEffect(() => {
    setToastStatus(speechStatus);
  }, [speechStatus]);

  useEffect(() => {
    if (isListening) setTurnTranscript(transcript);
  }, [transcript, isListening]);

  useEffect(() => {
    if (isListening) {
      if (silenceDebounceRef.current) clearTimeout(silenceDebounceRef.current);
      silenceDebounceRef.current = setTimeout(() => { stopListening(); }, 2500);
    } else {
      if (silenceDebounceRef.current) {
        clearTimeout(silenceDebounceRef.current);
        silenceDebounceRef.current = null;
      }
    }
    return () => clearTimeout(silenceDebounceRef.current);
  }, [transcript, isListening, stopListening]);

  // 4. GATILHO DE VALIDAÇÃO (Quando a API oficializa que parou)
  useEffect(() => {
    if (speechStatus === 'stopped' && turnTranscript.trim() && !feedback) {
      handleCheck(turnTranscript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechStatus]);

  const handleCheck = async (spokenText) => {
    if (!currentWord) return;
    const isCorrect = normalize(spokenText) === normalize(currentWord.en);
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
      resetTranscript();
      setTurnTranscript('');
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
      <SpeechToast status={toastStatus} transcript={isListening ? transcript : ''} duration={3000} />
      <BackButton to={backRoute} label={t('levelList.title')} />

      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-2xl font-bold text-pink-400">{levelData.title[uiLang] || levelData.title.pt}</h2>
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
        <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-700 text-center relative overflow-hidden flex flex-col items-center">
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
          
          <div className="flex items-center justify-center gap-3 mr-12 mb-8 w-full px-2">
            <button 
              type="button"
              onClick={speakPrompt}
              className="w-10 h-10 mt-2 flex items-center justify-center bg-pink-500/20 text-pink-400 rounded-full hover:bg-pink-500/30 transition-colors shrink-0"
              title={t('general.listenAgain', 'Ouvir novamente')}
            >
              <Volume2 size={20} />
            </button>
            <h3 className="text-3xl sm:text-4xl font-black text-white text-center break-words">
              {promptTranslation}
            </h3>
          </div>

          {/* CAIXA VISUAL DA TRANSCRIÇÃO */}
          <div className="mb-6 p-4 bg-gray-900/80 border border-gray-700 rounded-2xl w-full max-w-xs text-center min-h-[80px] flex flex-col items-center justify-center shadow-inner gap-2">
             {isListening && !turnTranscript && (
               <div className="flex gap-1.5 items-center">
                 {[0, 0.15, 0.3].map((delay) => (
                   <span key={delay} className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
                 ))}
               </div>
             )}
             <p className={`font-medium text-lg leading-snug ${turnTranscript ? 'text-white' : 'text-gray-500 italic text-sm'}`}>
               {turnTranscript ? `"${turnTranscript}"` : t('general.tapToSpeak', 'Toque no microfone e fale...')}
             </p>
          </div>

          <button
            onClick={handleMic}
            disabled={!!feedback || micLoading}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all shadow-xl ${
              isListening
                ? 'bg-red-500/20 text-red-400 border-2 border-red-500 animate-pulse'
                : micLoading 
                  ? 'bg-gray-700 text-gray-400 cursor-wait'
                  : 'bg-gradient-to-tr from-pink-600 to-purple-500 text-white hover:scale-105'
            }`}
          >
            {micLoading ? (
               <svg className="w-8 h-8 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
               </svg>
            ) : isListening ? <StopCircle size={36} /> : <Mic size={36} />}
          </button>
          
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-4">
            {isListening ? t('general.tapToSpeak', 'Toque para parar') : turnTranscript ? 'Toque para regravar' : 'Toque para falar'}
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