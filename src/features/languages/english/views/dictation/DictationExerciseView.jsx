// src/features/languages/english/views/dictation/DictationExerciseView.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Mic, MicOff, PartyPopper, TimerOff, RotateCcw, Clock, Flame } from 'lucide-react';
import { useSpeech } from '../../../../../hooks/useSpeech';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { DICTATION_TEXTS } from '../../../../../data/dictationTexts';
import { db } from '../../../../../config/dexieDb';
import { addXP } from '../../../../../utils/xpManager';
import BackButton from '../../../../../components/BackButton';
import FooterBrand from '../../../../../components/FooterBrand';
import { getContractionExpansion } from '../../../../../data/dictationTexts';

const DICTATION_XP = 15;

// ─── Sons (mesmo padrão usado em AlphaNumbersExerciseView.jsx) ─────────────
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
    playNote(392.00, now, 0.15);
    playNote(523.25, now + 0.15, 0.15);
    playNote(659.25, now + 0.30, 0.15);
    playNote(1046.50, now + 0.45, 0.8, 0.4);
  } catch (_) {}
};

// Normaliza uma palavra: minúsculas, sem pontuação/acentuação de borda
const normalizeWord = (w) =>
  String(w || '')
    .toLowerCase()
    .replace(/[.,!?;:"'`]/g, '')
    .trim();

export default function DictationExerciseView() {
  const { textId } = useParams();
  const navigate = useNavigate();
  const { t, uiLang, registerLanguageActivity } = useLanguage();

  const textData = DICTATION_TEXTS.find((d) => d.id === textId) || DICTATION_TEXTS[0];

  const { transcript, isListening, startListening, stopListening, resetTranscript, hasSupport } =
    useSpeech('en-IE');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorIndex, setErrorIndex] = useState(null); // índice piscando vermelho
  const [timeLeft, setTimeLeft] = useState(textData.timeLimitSeconds);
  const [status, setStatus] = useState('idle'); // idle | running | success | timeout
  const [lastProcessedLength, setLastProcessedLength] = useState(0);

  const timerRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  const totalWords = textData.words.length;
  const location = useLocation();

  const backRoute = location.state?.fromTrail ? '/english/trail' : '/english/dictation';

  const getTranslated = (textObj) => {
    if (!textObj) return '';
    return textObj[uiLang] || textObj.pt || '';
  };

  // ── Timer regressivo ──────────────────────────────────────────────────
  useEffect(() => {
    if (status !== 'running') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleTimeout = useCallback(() => {
    stopListening();
    setStatus('timeout');
  }, [stopListening]);

  // ── Processa o transcript em tempo real, comparando com a palavra alvo ──
  useEffect(() => {
    if (status !== 'running') return;
    if (!transcript) return;

    const spokenWords = transcript.trim().split(/\s+/).filter(Boolean);
    if (spokenWords.length <= lastProcessedLength) return;

    // Processa apenas as palavras novas faladas desde a última checagem
    const newWords = spokenWords.slice(lastProcessedLength);
    setLastProcessedLength(spokenWords.length);

    let idx = currentIndex;
    let advancedAny = false;
    let hadError = false;

    for (const spoken of newWords) {
      if (idx >= totalWords) break;
      const target = normalizeWord(textData.words[idx]);
      const said = normalizeWord(spoken);
      if (!said) continue;

      if (said === target) {
        idx += 1;
        advancedAny = true;
      } else {
        hadError = true;
      }
    }

    if (advancedAny) {
      setCurrentIndex(idx);
      if (idx >= totalWords) {
        finishSuccess();
        return;
      }
    }

    if (hadError && !advancedAny) {
      triggerErrorFlash(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, status]);

  const triggerErrorFlash = (idx) => {
    playWrongSound();
    setErrorIndex(idx);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => {
      setErrorIndex(null);
    }, 1000);
  };

  const finishSuccess = async () => {
    clearInterval(timerRef.current);
    stopListening();
    playCompletionSound();
    setStatus('success');

    try {
      await db.completedDictations.put({
        textId: textData.id,
        completedAt: new Date().toISOString(),
        xp: DICTATION_XP,
        timeTakenSeconds: textData.timeLimitSeconds - timeLeft,
      });

      // CORREÇÃO: usava "lesson.id" (variável inexistente nesta tela), o que
      // lançava um erro silencioso e nunca atualizava o cache lido pela
      // Trilha (TrailView verifica 'completedDictationsCache' no localStorage,
      // não a tabela do Dexie diretamente). Por isso o node de ditado na
      // trilha nunca ficava marcado como concluído mesmo após concluir o
      // exercício. Agora usamos textData.id, que é o identificador correto.
      const cache = JSON.parse(localStorage.getItem('completedDictationsCache') || '[]');
      if (!cache.includes(textData.id)) {
        cache.push(textData.id);
        localStorage.setItem('completedDictationsCache', JSON.stringify(cache));
      }

      await addXP(DICTATION_XP);
      await registerLanguageActivity();
    } catch (err) {
      console.error('Erro ao salvar ditado concluído:', err);
    }
  };

  const startExercise = () => {
    setCurrentIndex(0);
    setErrorIndex(null);
    setTimeLeft(textData.timeLimitSeconds);
    setLastProcessedLength(0);
    if (resetTranscript) resetTranscript();
    setStatus('running');
    startListening();
  };

  const handleMicToggle = () => {
    if (status !== 'running') return;
    if (isListening) {
      stopListening();
    } else {
      if (resetTranscript) resetTranscript();
      setLastProcessedLength(0);
      startListening();
    }
  };

  const handleRetry = () => {
    clearInterval(timerRef.current);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    stopListening();
    setStatus('idle');
    setCurrentIndex(0);
    setErrorIndex(null);
    setTimeLeft(textData.timeLimitSeconds);
    setLastProcessedLength(0);
    if (resetTranscript) resetTranscript();
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasSupport) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center p-6 text-center z-50">
        <MicOff className="text-yellow-500 mb-4" size={48} />
        <h2 className="text-xl text-white font-bold mb-2">{t('ai.micNotSupported', 'Microfone não suportado')}</h2>
        <p className="text-gray-400">{t('ai.micNotSupportedDesc', 'Seu navegador não suporta a API de voz.')}</p>
        <button
          onClick={() => navigate(backRoute)}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold"
        >
          {t('general.back', 'Voltar')}
        </button>
      </div>
    );
  }

  // ── Tela de sucesso ──────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="w-full pt-8 animate-fade-in px-4 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)] animate-bounce">
          <PartyPopper size={48} />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">
          {t('dictation.completedTitle', 'Texto Concluído!')}
        </h2>
        {/* Badge de XP no padrão amarelo/dourado usado no resto do app (não mais azul/índigo) */}
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 py-2 px-4 rounded-xl mb-10">
          <Flame size={18} className="text-yellow-500" />
          <span className="text-yellow-400 font-black">+{DICTATION_XP} {t('settings.xp', 'XP')}</span>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => navigate(backRoute)}
            className="px-8 py-4 bg-white text-black font-black rounded-full hover:bg-gray-200 transition-all shadow-xl active:scale-95"
          >
            {t('general.backToMenu', 'Voltar para o Menu')}
          </button>
          <button
            onClick={handleRetry}
            className="px-8 py-4 bg-gray-800 border border-gray-700 text-white font-black rounded-full hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} /> {t('general.restart', 'Reiniciar')}
          </button>
        </div>
      </div>
    );
  }

  // ── Tela de tempo esgotado ───────────────────────────────────────────────
  if (status === 'timeout') {
    return (
      <div className="w-full pt-8 animate-fade-in px-4 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
          <TimerOff size={48} />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">
          {t('dictation.timeoutTitle', 'Tempo Esgotado!')}
        </h2>
        <p className="text-gray-400 font-medium mb-10 max-w-sm">
          {t('dictation.timeoutDesc', 'Você não concluiu o texto a tempo. Tente novamente!')}
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={handleRetry}
            className="px-8 py-4 bg-white text-black font-black rounded-full hover:bg-gray-200 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} /> {t('general.restart', 'Tentar Novamente')}
          </button>
          <button
            onClick={() => navigate(backRoute)}
            className="px-8 py-4 bg-gray-800 border border-gray-700 text-white font-black rounded-full hover:bg-gray-700 transition-all"
          >
            {t('general.backToMenu', 'Voltar para o Menu')}
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = (currentIndex / totalWords) * 100;
  const timeCritical = timeLeft <= 10;
  const titleText = getTranslated(textData.title);

  return (
    <div className="w-full pt-8 animate-fade-in px-4 min-h-screen flex flex-col">
      {/* HEADER: Botão de voltar + Título do exercício, acima da barra de progresso */}
      <div className="flex items-center gap-3 mb-3">
        <div className="shrink-0">
          <BackButton to={backRoute} label={t('general.back', 'Voltar')} />
        </div>
        <h1 className="text-lg sm:text-xl font-black text-white truncate -mt-6">
          {titleText}
        </h1>
      </div>

      {/* Barra de progresso + Timer */}
      <div className="mb-6 max-w-lg w-full mx-auto flex items-center gap-3">
        <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {status === 'running' && (
          <div className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-sm border ${
            timeCritical
              ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
              : 'bg-gray-800 text-gray-300 border-gray-700'
          }`}>
            <Clock size={14} />
            {timeLeft}s
          </div>
        )}
      </div>

      <div className="max-w-lg w-full mx-auto flex-1 flex flex-col items-center justify-center">
        {/* Texto */}
        <div className="bg-gray-800 border border-gray-700 rounded-[2rem] p-6 sm:p-8 shadow-xl w-full mb-8">
          <p className="text-xl sm:text-2xl leading-relaxed font-bold text-center flex flex-wrap justify-center gap-x-2 gap-y-1">
            {textData.words.map((word, idx) => {
              let colorClass = 'text-white';
              if (idx < currentIndex) colorClass = 'text-green-500';
              else if (idx === currentIndex && errorIndex === idx) colorClass = 'text-red-500';
              else if (idx === currentIndex) colorClass = 'text-yellow-400';

              const expansion = getContractionExpansion(word);

              return (
                <span key={idx} className={`transition-colors duration-200 ${colorClass}`}>
                  {word}
                  {expansion && (
                    <span className={`text-[10px] font-normal align-super ml-0.5 ${idx < currentIndex ? 'text-green-500/70' : 'text-gray-500'}`}>
                      ({expansion})
                    </span>
                  )}
                </span>
              );
            })}
          </p>

          {/* Tradução apagadinha, sempre visível, no idioma do app */}
          {textData.translation && (
            <p className="text-[10px] text-gray-600 text-center mt-4 italic leading-snug opacity-70">
              {textData.translation[uiLang] || textData.translation.pt}
            </p>
          )}
        </div>

        {status === 'idle' && (
          <button
            onClick={startExercise}
            className="w-full py-5 bg-pink-600 hover:bg-pink-500 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
          >
            <Mic size={22} /> {t('dictation.startBtn', 'Iniciar Ditado')}
          </button>
        )}

        {status === 'running' && (
          <>
            <button
              onClick={handleMicToggle}
              className={`p-8 rounded-full mb-4 transition-all shadow-xl ${
                isListening
                  ? 'bg-red-500/20 text-red-400 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse'
                  : 'bg-gradient-to-tr from-pink-600 to-purple-500 text-white hover:scale-105 shadow-[0_10px_20px_rgba(219,39,119,0.4)]'
              }`}
            >
              {isListening ? <Mic size={40} /> : <MicOff size={40} />}
            </button>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider text-center mb-2">
              {isListening
                ? t('dictation.listening', 'Ouvindo... fale o texto')
                : t('dictation.tapToResume', 'Toque para continuar falando')}
            </p>
            <p className="text-xs text-gray-600 text-center">
              {currentIndex} / {totalWords} {t('dictation.words', 'palavras')}
            </p>
          </>
        )}
      </div>

      <div className="shrink-0 mt-8">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>
    </div>
  );
}