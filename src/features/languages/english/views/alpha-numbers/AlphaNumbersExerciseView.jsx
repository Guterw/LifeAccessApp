// src/features/languages/english/views/alpha-numbers/AlphaNumbersExerciseView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, CheckCircle2, XCircle, ChevronRight, PlayCircle, StopCircle, PartyPopper, Volume2 } from 'lucide-react';
import { useSpeech } from '../../../../../hooks/useSpeech';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { ALPHABET_EXERCISES } from '../../../../../data/alphabetExercises';
import { NUMBER_EXERCISES } from '../../../../../data/numberExercises';
import { db } from '../../../../../config/dexieDb';
import BackButton from '../../../../../components/BackButton';

// =========================================
// FUNÇÕES DE ÁUDIO
// =========================================
const playCorrectSound = () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine'; 
  osc.frequency.setValueAtTime(659.25, ctx.currentTime); 
  osc.frequency.setValueAtTime(830.61, ctx.currentTime + 0.1); 
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
  gain.gain.setValueAtTime(0.4, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
};

const playWrongSound = () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'triangle'; 
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
};

const playCompletionSound = () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const now = ctx.currentTime;
  const playNote = (freq, startTime, duration, vol = 0.3) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine'; 
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration);
  };
  playNote(392.00, now, 0.15);       
  playNote(523.25, now + 0.15, 0.15); 
  playNote(659.25, now + 0.30, 0.15);  
  playNote(1046.50, now + 0.45, 0.8, 0.4); 
};

export default function AlphaNumbersExerciseView() {
  const { mode, index } = useParams();
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage(); // NOVO: Trazendo o idioma atual

  // Função robusta para extrair o texto de objetos de tradução ou strings diretas
  const getText = (textData) => {
    if (!textData) return '';
    if (typeof textData === 'string') return textData;
    return textData[uiLang] || textData.pt || '';
  };

  const exercises = mode === 'alphabet' ? ALPHABET_EXERCISES : NUMBER_EXERCISES;
  const exerciseIndex = parseInt(index, 10);
  const levelData = exercises[exerciseIndex];

  const [queue, setQueue] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [turnTranscript, setTurnTranscript] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  const { transcript, isListening, startListening, stopListening, resetTranscript } = useSpeech('en-IE');

  useEffect(() => {
    if (!levelData) {
      navigate(`/english/alpha-numbers/exercises/${mode}`);
      return;
    }

    const loadProgress = async () => {
      try {
        const completedRecord = await db.completedAlphaNum.get([mode, exerciseIndex]);
        const progressRecord = await db.alphaNumProgress.get([mode, exerciseIndex]);

        setTotalQuestions(levelData.questions.length);

        if (completedRecord) {
          setIsLevelCompleted(true);
        } else if (progressRecord && progressRecord.pendingQueue && progressRecord.pendingQueue.length > 0) {
          setQueue(progressRecord.pendingQueue);
        } else {
          setQueue([...levelData.questions]);
        }
      } catch (err) {
        console.error("Erro ao carregar do Dexie:", err);
        setQueue([...levelData.questions]);
      }
      setIsLoaded(true);
    };

    loadProgress();
  }, [levelData, mode, exerciseIndex, navigate]);

  const currentEx = queue.length > 0 ? queue[0] : null;
  const answeredCount = totalQuestions - queue.length;

  useEffect(() => {
    if (hasInteracted) {
      setTurnTranscript(transcript);
    }
  }, [transcript, hasInteracted]);

  useEffect(() => {
    if (resetTranscript) resetTranscript();
    if (isListening && stopListening) stopListening();
    setTurnTranscript('');
    setHasInteracted(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEx?.id]);

  const playAudio = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = String(text).replace(/[^a-zA-Z0-9\s.]/g, '');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IE';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const autoplayTypes = ['listen_and_identify', 'phonetic_match', 'voice_repetition'];
    if (currentEx && autoplayTypes.includes(currentEx.type) && !feedback) {
      const timer = setTimeout(() => {
        const audioText = currentEx.audio_hint || (Array.isArray(currentEx.target) ? currentEx.target[0] : currentEx.target);
        playAudio(audioText);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentEx, feedback]);

  const handleChoice = (option) => {
    const validTargets = Array.isArray(currentEx.target) ? currentEx.target : [currentEx.target];
    if (validTargets.includes(option)) processAnswer(true);
    else processAnswer(false);
  };

  const handleMicClick = () => {
    if (isListening) {
      if (stopListening) stopListening();
    } else {
      setHasInteracted(true);
      setTurnTranscript('');
      if (resetTranscript) resetTranscript();
      startListening();
    }
  };

  const handleVoiceCheck = () => {
    if (isListening && stopListening) stopListening();

    const rawTranscript = turnTranscript.toLowerCase();
    const cleanTranscript = rawTranscript.replace(/[^a-z0-9]/g, '');
    const validTargets = Array.isArray(currentEx.target) ? currentEx.target : [currentEx.target];

    const isCorrect = validTargets.some(targetOption => {
      const rawTarget = String(targetOption).toLowerCase();
      const cleanTarget = rawTarget.replace(/[^a-z0-9]/g, '');
      return cleanTranscript === cleanTarget || rawTranscript.includes(rawTarget);
    });

    processAnswer(isCorrect);
  };

  const processAnswer = async (isCorrect) => {
    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) playCorrectSound();
    else playWrongSound();

    let newQueue = [...queue];
    if (isCorrect) {
      newQueue.shift();
    } else {
      const failedWord = newQueue.shift();
      newQueue.push(failedWord);
    }

    try {
      if (newQueue.length === 0) {
        await db.completedAlphaNum.put({
          mode,
          exerciseIndex,
          completedAt: new Date().toISOString(),
          xp: 0,
        });
        await db.alphaNumProgress.delete([mode, exerciseIndex]);
        playCompletionSound();
      } else {
        await db.alphaNumProgress.put({
          mode,
          exerciseIndex,
          pendingQueue: newQueue,
          correctCount: totalQuestions - newQueue.length,
          total: totalQuestions,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Falha ao salvar progresso no Dexie:", err);
    }
  };

  const handleNext = () => {
    let newQueue = [...queue];
    if (feedback === 'correct') {
      newQueue.shift();
    } else {
      const failedWord = newQueue.shift();
      newQueue.push(failedWord);
    }

    if (resetTranscript) resetTranscript();
    setTurnTranscript('');
    setHasInteracted(false);
    
    setQueue(newQueue);
    setFeedback(null);

    if (newQueue.length === 0) {
      setIsLevelCompleted(true);
    }
  };

  if (!isLoaded || !levelData) return null;

  if (isLevelCompleted || (isLoaded && queue.length === 0)) {
    return (
      <div className="w-full pt-8 animate-fade-in px-4 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)] animate-bounce">
          <PartyPopper size={48} />
        </div>
        <h2 className="text-4xl font-black text-white mb-4">{t('level.completedTitle', 'Exercício Concluído!')}</h2>
        <p className="text-gray-400 font-medium mb-12">{t('level.masteredAll', 'Você dominou todas as questões deste nível.')}</p>
        <button
          onClick={() => navigate(`/english/alpha-numbers/exercises/${mode}`)}
          className="px-8 py-4 bg-white text-black font-black rounded-full hover:bg-gray-200 transition-all shadow-xl active:scale-95"
        >
          {t('general.backToMenu', 'Voltar para o Menu')}
        </button>
      </div>
    );
  }

  const isVoiceExercise = currentEx?.type === 'voice_dictation' || currentEx?.type === 'voice_repetition';

  return (
    <div className="w-full pt-8 animate-fade-in px-4 min-h-screen flex flex-col relative overflow-y-auto">
      <div className="shrink-0 mb-4">
        <BackButton to={`/english/alpha-numbers/exercises/${mode}`} label={t('general.saveAndExit', 'Salvar e Sair')} />
      </div>

      {totalQuestions > 0 && (
        <div className="shrink-0 mb-2 max-w-sm w-full mx-auto">
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="mt-2 mb-8 text-center flex flex-col items-center shrink-0">
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 block bg-indigo-500/10 py-1 px-3 rounded-full w-max mx-auto">
          {t('general.remaining', 'Faltam')} {queue.length} {queue.length === 1 ? t('general.question', 'questão') : t('general.questions', 'questões')}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2 animate-fade-in">
          {getText(currentEx?.question)}
        </h2>
        {currentEx?.instructions && <p className="text-gray-400 text-sm font-medium">{getText(currentEx.instructions)}</p>}
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col justify-start shrink-0">
        {(currentEx?.type === 'listen_and_identify' || currentEx?.type === 'phonetic_match') && (
          <div className="w-full flex flex-col items-center">
            {currentEx.type === 'listen_and_identify' && (
              <button
                onClick={() => playAudio(currentEx.audio_hint || (Array.isArray(currentEx.target) ? currentEx.target[0] : currentEx.target))}
                className="mb-8 p-6 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/40 hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse"
              >
                <PlayCircle size={48} />
              </button>
            )}
            <div className="grid grid-cols-2 gap-4 w-full">
              {currentEx.options?.map(opt => (
                <button
                  key={opt}
                  onClick={() => !feedback && handleChoice(opt)}
                  disabled={!!feedback}
                  className="p-5 bg-gray-800 rounded-3xl border-2 border-gray-700 hover:border-indigo-400 hover:bg-gray-700 active:scale-95 transition-all text-2xl font-black shadow-lg"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {isVoiceExercise && (
          <div className="w-full flex flex-col items-center">
            <button
              onClick={() => playAudio(currentEx.audio_hint || (Array.isArray(currentEx.target) ? currentEx.target[0] : currentEx.target))}
              className="mb-5 flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 hover:border-blue-400 text-gray-300 hover:text-blue-400 transition-all text-xs font-bold uppercase tracking-wide"
            >
              <Volume2 size={14} /> {t('general.listenAgain', 'Ouvir novamente')}
            </button>

            <div className="mb-8 p-5 bg-gray-800/80 border border-gray-700 rounded-3xl w-full text-center min-h-[100px] flex items-center justify-center shadow-inner">
              <p className={`font-medium text-lg ${turnTranscript ? 'text-white' : 'text-gray-500 italic'}`}>
                {turnTranscript ? `"${turnTranscript}"` : t('general.tapToSpeak', 'Toque no microfone e fale...')}
              </p>
            </div>
            
            <button
              onClick={handleMicClick}
              disabled={!!feedback}
              className={`p-8 rounded-full mb-6 transition-all shadow-xl
                ${isListening
                  ? 'bg-red-500/20 text-red-400 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse'
                  : 'bg-gradient-to-tr from-indigo-600 to-blue-500 text-white hover:scale-105 shadow-[0_10px_20px_rgba(79,70,229,0.4)]'
                } ${feedback ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isListening ? <StopCircle size={40} /> : <Mic size={40} />}
            </button>
            
            {turnTranscript && !isListening && !feedback && (
              <button
                onClick={handleVoiceCheck}
                className="w-full py-4 bg-white hover:bg-gray-200 text-black font-black rounded-2xl shadow-lg transition-all active:scale-95"
              >
                {t('general.checkAnswer', 'Verificar Resposta')}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="h-48 shrink-0 w-full"></div>

      {feedback && (
        <div className={`fixed inset-x-0 bottom-[80px] p-6 animate-slide-up z-50 border-t-4 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl
          ${feedback === 'correct' ? 'bg-green-950/95 border-green-500' : 'bg-red-950/95 border-red-500'}
        `}>
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-full text-white ${feedback === 'correct' ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}>
                {feedback === 'correct' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">
                  {feedback === 'correct' ? t('general.correct', 'Você acertou!') : t('general.almostThere', 'Quase lá!')}
                </h3>
                {feedback === 'wrong' && (
                  <p className="text-sm font-bold text-red-200 mt-1">{t('general.goesToQueue', 'A resposta vai para o final da fila.')}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleNext}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex justify-center items-center gap-2 active:scale-95
                ${feedback === 'correct' ? 'bg-green-500 text-white hover:bg-green-400' : 'bg-red-500 text-white hover:bg-red-400'}
              `}
            >
              {t('general.continue', 'Continuar')} <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}