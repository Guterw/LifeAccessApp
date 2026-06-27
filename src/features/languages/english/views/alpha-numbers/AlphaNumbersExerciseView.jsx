// src/features/languages/english/views/alpha-numbers/AlphaNumbersExerciseView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Mic, CheckCircle2, XCircle, ChevronRight, PlayCircle,
  StopCircle, PartyPopper, Volume2, Turtle,
} from 'lucide-react';
import { useSpeech } from '../../../../../hooks/useSpeech';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { ALPHABET_EXERCISES } from '../../../../../data/alphabetExercises';
import { NUMBER_EXERCISES } from '../../../../../data/numberExercises';
import { db } from '../../../../../config/dexieDb';
import BackButton from '../../../../../components/BackButton';
import SpeechToast from '../../../../../components/SpeechToast';
import StreakModal from '../../../../../components/StreakModal';
import { addXP } from '../../../../../utils/xpManager';
import { useError } from '../../../../../contexts/ErrorContext';

// ─── Sons ────────────────────────────────────────────────────────────────────
const playCorrectSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, ctx.currentTime);
    osc.frequency.setValueAtTime(830.61, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
    gain.gain.setValueAtTime(0.4, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
  } catch (_) {}
};

const playWrongSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.2);
  } catch (_) {}
};

const playCompletionSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const playNote = (freq, t, dur, vol = 0.3) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + dur);
      osc.start(t); osc.stop(t + dur);
    };
    playNote(392.00, now,        0.15);
    playNote(523.25, now + 0.15, 0.15);
    playNote(659.25, now + 0.30, 0.15);
    playNote(1046.50, now + 0.45, 0.8, 0.4);
  } catch (_) {}
};
// ─────────────────────────────────────────────────────────────────────────────

// TTS helper — sempre lowercase para evitar "Capital A" no iOS
const playAudio = (text, rate = 0.85) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const clean = String(text).replace(/[^a-zA-Z0-9\s.]/g, '').toLowerCase();
  const utt = new SpeechSynthesisUtterance(clean);
  utt.lang = 'en-IE';
  utt.rate = rate;
  window.speechSynthesis.speak(utt);
};

export default function AlphaNumbersExerciseView() {
  const { mode, index } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, uiLang, registerLanguageActivity } = useLanguage();
  const { showError } = useError();

  const backRoute = location.state?.fromTrail
    ? '/english/trail'
    : `/english/alpha-numbers/exercises/${mode}`;

  const getText = (textData) => {
    if (!textData) return '';
    if (typeof textData === 'string') return textData;
    return textData[uiLang] || textData.pt || '';
  };

  const exercises = mode === 'alphabet' ? ALPHABET_EXERCISES : NUMBER_EXERCISES;
  const exerciseIndex = parseInt(index, 10);
  const levelData = exercises[exerciseIndex];

  // ── Estado ────────────────────────────────────────────────────────────────
  const [queue, setQueue] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [turnTranscript, setTurnTranscript] = useState('');
  const [micLoading, setMicLoading] = useState(false);
  const [toastStatus, setToastStatus] = useState(null);
  const [streakUpdate, setStreakUpdate] = useState(null);
  const [showStreakModal, setShowStreakModal] = useState(false);
  
  const {
    transcript,
    isListening,
    speechStatus,
    startListening,
    stopListening,
    resetTranscript,
    hasSupport,
  } = useSpeech('en-IE');

  // Sincroniza o transcript parcial com o estado local da rodada
  useEffect(() => {
    if (hasInteracted) setTurnTranscript(transcript);
  }, [transcript, hasInteracted]);

  // Propaga o speechStatus para o toast
  useEffect(() => {
    setToastStatus(speechStatus);
  }, [speechStatus]);

  // Reset quando a questão muda
  useEffect(() => {
    if (isListening) stopListening();
    if (resetTranscript) resetTranscript();
    setTurnTranscript('');
    setHasInteracted(false);
    setToastStatus(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue[0]?.id]);

  // ── Carregamento ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!levelData) { navigate(`/english/alpha-numbers/exercises/${mode}`); return; }

    const load = async () => {
      try {
        const completedRecord = await db.completedAlphaNum.get([mode, exerciseIndex]);
        const progressRecord  = await db.alphaNumProgress.get([mode, exerciseIndex]);
        setTotalQuestions(levelData.questions.length);

        if (completedRecord) {
          setIsLevelCompleted(true);
        } else if (progressRecord?.pendingQueue?.length > 0) {
          setQueue(progressRecord.pendingQueue);
        } else {
          setQueue([...levelData.questions]);
        }
      } catch (err) {
        console.error('Erro ao carregar do Dexie:', err);
        setQueue([...levelData.questions]);
      }
      setIsLoaded(true);
    };
    load();
  }, [levelData, mode, exerciseIndex, navigate]);

  const currentEx = queue[0] ?? null;
  const answeredCount = totalQuestions - queue.length;

  // Auto-play do áudio ao mudar de questão
  useEffect(() => {
    const autoplayTypes = ['listen_and_identify', 'phonetic_match', 'voice_repetition'];
    if (currentEx && autoplayTypes.includes(currentEx.type) && !feedback) {
      const timer = setTimeout(() => {
        const audioText =
          currentEx.audio_hint ||
          (Array.isArray(currentEx.target) ? currentEx.target[0] : currentEx.target);
        playAudio(audioText);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentEx, feedback]);

  // ── Microfone ─────────────────────────────────────────────────────────────
  const handleMicClick = async () => {
    if (feedback) return;

    if (isListening) {
      stopListening();
      return;
    }

    // Verifica suporte
    if (!hasSupport) {
      showError('Seu navegador não suporta reconhecimento de voz. Use Chrome ou Safari.');
      return;
    }

    // Solicita permissão explicitamente antes (crítico no iOS/Safari)
    setMicLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop()); // libera o stream logo após obter permissão
    } catch (err) {
      setMicLoading(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        showError('Acesso ao microfone negado. Verifique as permissões do navegador para este site.');
      } else {
        showError('Não foi possível acessar o microfone. Tente novamente.');
      }
      return;
    }
    setMicLoading(false);

    setHasInteracted(true);
    setTurnTranscript('');
    if (resetTranscript) resetTranscript();
    startListening();
  };

  // Verifica a resposta de voz
  const handleVoiceCheck = () => {
    if (isListening) stopListening();

    const raw = turnTranscript.toLowerCase();
    const clean = raw.replace(/[^a-z0-9]/g, '');
    const validTargets = Array.isArray(currentEx.target)
      ? currentEx.target
      : [currentEx.target];

    const isCorrect = validTargets.some((opt) => {
      const rawTarget = String(opt).toLowerCase();
      const cleanTarget = rawTarget.replace(/[^a-z0-9]/g, '');
      return clean === cleanTarget || raw.includes(rawTarget);
    });

    processAnswer(isCorrect);
  };

  // ── Lógica de resposta ────────────────────────────────────────────────────
  const handleChoice = (option) => {
    if (feedback) return;
    const validTargets = Array.isArray(currentEx.target)
      ? currentEx.target
      : [currentEx.target];
    processAnswer(validTargets.includes(option));
  };

  const processAnswer = async (isCorrect) => {
    try {
      setFeedback(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) playCorrectSound();
      else playWrongSound();

      let newQueue = [...queue];
      const answeredItem = queue[0]; // Capturamos o item atual ANTES de modificar a fila

// ── MÁGICA DOS STATS (LEVEL 0) ──
      const targetStr = Array.isArray(answeredItem.target) ? answeredItem.target[0] : answeredItem.target;
      const questionStr = getText(answeredItem.question) || targetStr;
      const categoryName = mode === 'alphabet' ? 'Alfabeto' : 'Números';

      if (isCorrect) {
        newQueue.shift();
        
        // SALVA NOS STATS (Vocabulário Aprendido)
        await db.learnedWords.put({
          en: String(targetStr),
          translation: String(questionStr),
          level: 0, // Level 0 indica Fundamentos
          category: categoryName,
          learnedAt: new Date().toISOString()
        });
        
        // NOVO: DELETA DO MISTAKES LOG AO ACERTAR!
        await db.mistakesLog.where('word').equals(String(targetStr)).delete();

      } else {
        const failed = newQueue.shift();
        newQueue.push(failed);
        
        // SALVA NOS STATS (Lista de Erros / Revisão)
        await db.mistakesLog.put({
          word: String(targetStr),
          level: 0, // Level 0 indica Fundamentos
          category: categoryName,
          timestamp: new Date().toISOString()
        });
      }
      // ────────────────────────────────

      if (newQueue.length === 0) {
        await db.completedAlphaNum.put({
          mode, exerciseIndex,
          completedAt: new Date().toISOString(),
          xp: 20,
        });
        await db.alphaNumProgress.delete([mode, exerciseIndex]);
        await addXP(20);
        
        const result = await registerLanguageActivity();
        setStreakUpdate(result);
        if (result?.increased) setShowStreakModal(true);
        
        playCompletionSound();
      } else {
        await db.alphaNumProgress.put({
          mode, exerciseIndex,
          pendingQueue: newQueue,
          correctCount: totalQuestions - newQueue.length,
          total: totalQuestions,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Erro ao processar resposta:', err);
      showError('Não foi possível salvar seu progresso. Tente novamente.');
    }
  };

  const handleNext = () => {
    let newQueue = [...queue];
    if (feedback === 'correct') {
      newQueue.shift();
    } else {
      const failed = newQueue.shift();
      newQueue.push(failed);
    }

    if (resetTranscript) resetTranscript();
    setTurnTranscript('');
    setHasInteracted(false);
    setQueue(newQueue);
    setFeedback(null);

    if (newQueue.length === 0) setIsLevelCompleted(true);
  };

  // ── Render guards ─────────────────────────────────────────────────────────
  if (!isLoaded || !levelData) return null;

  if (isLevelCompleted || (isLoaded && queue.length === 0)) {
    return (
      <div className="w-full pt-8 animate-fade-in px-4 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)] animate-bounce">
          <PartyPopper size={48} />
        </div>
        <h2 className="text-4xl font-black text-white mb-4">
          {t('level.completedTitle', 'Exercício Concluído!')}
        </h2>
        <p className="text-gray-400 font-medium mb-12">
          {t('level.masteredAll', 'Você dominou todas as questões deste nível.')}
        </p>
        <button
          onClick={() => navigate(backRoute)}
          className="px-8 py-4 bg-white text-black font-black rounded-full hover:bg-gray-200 transition-all shadow-xl active:scale-95"
        >
          {t('general.backToMenu', 'Voltar para o Menu')}
        </button>
      </div>
    );
  }

  const isVoiceExercise =
    currentEx?.type === 'voice_dictation' || currentEx?.type === 'voice_repetition';

  // Determine mic button state
  const micBusy = micLoading;
  const micActive = isListening;

  return (
    <div className="w-full pt-8 animate-fade-in px-4 min-h-screen flex flex-col relative overflow-y-auto">

      <StreakModal
        streakUpdate={showStreakModal ? streakUpdate : null}
        onClose={() => setShowStreakModal(false)}
      />

      {/* Toast de status do microfone */}
      <SpeechToast
        status={toastStatus}
        transcript={turnTranscript}
        duration={3500}
      />

      {/* Botão voltar */}
      <div className="shrink-0 mb-4">
        <BackButton to={backRoute} label={t('general.saveAndExit', 'Salvar e Sair')} />
      </div>

      {/* Barra de progresso */}
      {totalQuestions > 0 && (
        <div className="shrink-0 mb-2 max-w-sm w-full mx-auto">
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Enunciado */}
      <div className="mt-2 mb-8 text-center flex flex-col items-center shrink-0">
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 block bg-indigo-500/10 py-1 px-3 rounded-full w-max mx-auto">
          {t('general.remaining', 'Faltam')} {queue.length}{' '}
          {queue.length === 1
            ? t('general.question', 'questão')
            : t('general.questions', 'questões')}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2 animate-fade-in px-2">
          {getText(currentEx?.question)}
        </h2>
        {currentEx?.instructions && (
          <p className="text-gray-400 text-sm font-medium">
            {getText(currentEx.instructions)}
          </p>
        )}
      </div>

      {/* ── Área de resposta ─────────────────────────────────────────────── */}
      <div className="w-full max-w-sm mx-auto flex flex-col justify-start shrink-0">

        {/* Múltipla escolha ou fonética */}
        {(currentEx?.type === 'listen_and_identify' ||
          currentEx?.type === 'phonetic_match') && (
          <div className="w-full flex flex-col items-center">
            {currentEx.type === 'listen_and_identify' && (
              <div className="flex gap-3 mb-8">
                {/* Ouvir normal */}
                <button
                  onClick={() =>
                    playAudio(
                      currentEx.audio_hint ||
                        (Array.isArray(currentEx.target)
                          ? currentEx.target[0]
                          : currentEx.target)
                    )
                  }
                  className="p-5 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/40 hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse"
                >
                  <PlayCircle size={40} />
                </button>
                {/* Ouvir devagar */}
                <button
                  onClick={() =>
                    playAudio(
                      currentEx.audio_hint ||
                        (Array.isArray(currentEx.target)
                          ? currentEx.target[0]
                          : currentEx.target),
                      0.4
                    )
                  }
                  className="p-5 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/40 hover:bg-yellow-500 hover:text-white transition-all"
                  title="Ouvir devagar"
                >
                  <Turtle size={40} />
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
              {currentEx.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleChoice(opt)}
                  disabled={!!feedback}
                  className="p-3 sm:p-5 bg-gray-800 rounded-[1.5rem] border-2 border-gray-700 hover:border-indigo-400 hover:bg-gray-700 active:scale-95 transition-all text-sm sm:text-lg md:text-xl font-black shadow-lg flex items-center justify-center text-center break-words w-full min-h-[80px] leading-snug disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Exercício de voz */}
        {isVoiceExercise && (
          <div className="w-full flex flex-col items-center">
            {/* Ouvir a pronúncia alvo */}
            <div className="flex gap-3 mb-5">
              <button
                onClick={() =>
                  playAudio(
                    currentEx.audio_hint ||
                      (Array.isArray(currentEx.target)
                        ? currentEx.target[0]
                        : currentEx.target)
                  )
                }
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 hover:border-blue-400 text-gray-300 hover:text-blue-400 transition-all text-xs font-bold uppercase tracking-wide"
              >
                <Volume2 size={14} />
                {t('general.listenAgain', 'Ouvir novamente')}
              </button>
              <button
                onClick={() =>
                  playAudio(
                    currentEx.audio_hint ||
                      (Array.isArray(currentEx.target)
                        ? currentEx.target[0]
                        : currentEx.target),
                    0.4
                  )
                }
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 hover:border-yellow-400 text-gray-300 hover:text-yellow-400 transition-all text-xs font-bold uppercase tracking-wide"
              >
                <Turtle size={14} />
                Devagar
              </button>
            </div>

            {/* Área de transcrição */}
            <div className="mb-6 p-5 bg-gray-800/80 border border-gray-700 rounded-3xl w-full text-center min-h-[90px] flex flex-col items-center justify-center shadow-inner gap-2">
              {isListening && !turnTranscript && (
                <div className="flex gap-1.5 items-center">
                  {[0, 0.15, 0.3].map((delay) => (
                    <span
                      key={delay}
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}s` }}
                    />
                  ))}
                </div>
              )}
              <p
                className={`font-medium text-lg leading-snug ${
                  turnTranscript ? 'text-white' : 'text-gray-500 italic text-sm'
                }`}
              >
                {turnTranscript
                  ? `"${turnTranscript}"`
                  : t('general.tapToSpeak', 'Toque no microfone e fale...')}
              </p>
            </div>

            {/* Botão de microfone */}
            <button
              onClick={handleMicClick}
              disabled={!!feedback || micBusy}
              className={`
                p-8 rounded-full mb-6 transition-all shadow-xl
                ${micActive
                  ? 'bg-red-500/20 text-red-400 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse'
                  : micBusy
                    ? 'bg-gray-700 text-gray-400 cursor-wait'
                    : 'bg-gradient-to-tr from-indigo-600 to-blue-500 text-white hover:scale-105 shadow-[0_10px_20px_rgba(79,70,229,0.4)]'
                }
                ${feedback ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {micBusy ? (
                <svg className="w-10 h-10 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              ) : micActive ? (
                <StopCircle size={40} />
              ) : (
                <Mic size={40} />
              )}
            </button>

            {/* Label de instrução abaixo do microfone */}
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider text-center -mt-2 mb-4">
              {micActive
                ? 'Toque para parar'
                : turnTranscript
                  ? 'Toque para regravar'
                  : 'Toque para falar'}
            </p>

            {/* Botão verificar — aparece após ter algo transcrito e não estar ouvindo */}
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

      {/* Espaço para o painel de feedback não cobrir conteúdo */}
      <div className="h-48 shrink-0 w-full" />

      {/* ── Painel de feedback ──────────────────────────────────────────────── */}
      {feedback && (
        <div
          className={`
            fixed inset-x-0 bottom-[80px] p-6 animate-slide-up z-50
            border-t-4 rounded-t-[2.5rem]
            shadow-[0_-20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl
            ${feedback === 'correct'
              ? 'bg-green-950/95 border-green-500'
              : 'bg-red-950/95 border-red-500'
            }
          `}
        >
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`p-3 rounded-full text-white ${
                  feedback === 'correct'
                    ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                    : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                }`}
              >
                {feedback === 'correct'
                  ? <CheckCircle2 size={32} />
                  : <XCircle size={32} />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">
                  {feedback === 'correct'
                    ? t('general.correct', 'Você acertou!')
                    : t('general.almostThere', 'Quase lá!')}
                </h3>
                {feedback === 'wrong' && (
                  <p className="text-sm font-bold text-red-200 mt-1">
                    {t('general.goesToQueue', 'A resposta vai para o final da fila.')}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleNext}
              className={`
                w-full py-4 rounded-2xl font-black text-lg transition-all
                flex justify-center items-center gap-2 active:scale-95
                ${feedback === 'correct'
                  ? 'bg-green-500 text-white hover:bg-green-400'
                  : 'bg-red-500 text-white hover:bg-red-400'
                }
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