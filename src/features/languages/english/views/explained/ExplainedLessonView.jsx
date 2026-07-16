// src/features/languages/english/views/explained/ExplainedLessonView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, BookOpen, CheckCircle2, XCircle, PartyPopper,
  Volume2, VolumeX, Mic, StopCircle, Pause, Play, SkipForward,
} from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { EXPLAINED_LESSONS } from '../../../../../data/explainedLessons';
import { db } from '../../../../../config/dexieDb';
import { addXP } from '../../../../../utils/xpManager';
import BackButton from '../../../../../components/BackButton';
import { speakInUiLang, speakInEnglish, speakSequence, primeVoices } from '../../../../../utils/speechHelper';
import { useSpeech } from '../../../../../hooks/useSpeech';
import SpeechToast from '../../../../../components/SpeechToast';
import { useError } from '../../../../../contexts/ErrorContext';

export default function ExplainedLessonView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();
  const { showError } = useError();
  const lesson = EXPLAINED_LESSONS.find(l => l.id === lessonId);

  const getText = (obj) => obj?.[uiLang] || obj?.pt || '';

  const [phase, setPhase] = useState('theory');
  const [slideIndex, setSlideIndex] = useState(0);
  const [queue, setQueue] = useState(lesson ? [...lesson.exercises] : []);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [selectedOption, setSelectedOption] = useState(null); // opção que o usuário clicou (fill_choice)
  const location = useLocation();

  // ── Controles de voz: mudo e pausar/continuar ──────────────────────────
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // ── Reconhecimento de voz (mesmo padrão usado em AlphaNumbersExerciseView / ai-voice) ──
  const {
    transcript,
    isListening,
    speechStatus,
    startListening,
    stopListening,
    resetTranscript,
    hasSupport,
  } = useSpeech('en-IE');

  const [micLoading, setMicLoading] = useState(false);
  const [toastStatus, setToastStatus] = useState(null);
  const [turnTranscript, setTurnTranscript] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const silenceDebounceRef = useRef(null);

  const backRoute = location.state?.fromTrail ? '/english/trail' : '/english/explained';

  useEffect(() => {
    primeVoices();
    // Ao desmontar a tela, garante que nada continue falando
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  useEffect(() => {
    setToastStatus(speechStatus);
  }, [speechStatus]);

  useEffect(() => {
    if (hasInteracted) setTurnTranscript(transcript);
  }, [transcript, hasInteracted]);

  // Reseta o estado de fala sempre que a questão muda
  useEffect(() => {
    if (isListening) stopListening();
    if (resetTranscript) resetTranscript();
    setTurnTranscript('');
    setHasInteracted(false);
    setToastStatus(null);
    setSelectedOption(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue[0]?.id]);

  // Auto-stop após silêncio, igual ao resto do app
  useEffect(() => {
    if (isListening) {
      if (silenceDebounceRef.current) clearTimeout(silenceDebounceRef.current);
      silenceDebounceRef.current = setTimeout(() => {
        stopListening();
      }, 3000);
    } else if (silenceDebounceRef.current) {
      clearTimeout(silenceDebounceRef.current);
      silenceDebounceRef.current = null;
    }
    return () => clearTimeout(silenceDebounceRef.current);
  }, [transcript, isListening, stopListening]);

  if (!lesson) return <div className="p-8 text-center text-gray-400">{t('general.notFound', 'Não encontrado.')}</div>;

  const current = lesson.theory[slideIndex];
  const isLastSlide = slideIndex === lesson.theory.length - 1;
  const currentQuestion = queue[0];
  const isVoiceExercise = currentQuestion?.type === 'voice_dictation';

  const getTargetsDisplay = (question) => {
    if (!question) return '';
    const targets = Array.isArray(question.target) ? question.target : [question.target];
    return targets.join(' / ');
  };

  // ── Fala: respeita o estado de mudo ──────────────────────────────────
  const playTheorySlide = () => {
    if (isMuted) return;
    setIsPaused(false);
    const segments = [
      { text: String(getText(current.title)), lang: uiLang },
      { text: String(getText(current.body)), lang: uiLang },
    ];
    (current.examples || []).forEach((ex) => {
      segments.push({ text: String(ex), lang: 'en' });
    });
    speakSequence(segments);
  };

  const playExercisePrompt = () => {
    if (isMuted) return;
    setIsPaused(false);
    speakInUiLang(String(getText(currentQuestion?.question)), uiLang);
  };

  // Alterna mudo/som. Se estiver mudando para mudo enquanto fala, cancela a fala atual.
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        window.speechSynthesis?.cancel();
        setIsPaused(false);
      }
      return next;
    });
  };

  // Pausa/retoma a fala em andamento (usa a própria API nativa de pause/resume)
  const togglePause = () => {
    if (!window.speechSynthesis) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  // REPRODUÇÃO AUTOMÁTICA
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMuted) return;
      if (phase === 'theory' && current) {
        playTheorySlide();
      } else if (phase === 'practice' && currentQuestion && !feedback) {
        playExercisePrompt();
      }
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIndex, currentQuestion, phase, feedback, isMuted]);

  const nextSlide = () => {
    window.speechSynthesis?.cancel();
    setIsPaused(false);
    if (isLastSlide) setPhase('practice');
    else setSlideIndex(i => i + 1);
  };

  const checkAnswer = (rawAnswer) => {
    if (feedback) return;
    const option = String(rawAnswer || '').trim().toLowerCase();
    const targets = Array.isArray(currentQuestion.target) ? currentQuestion.target : [currentQuestion.target];
    const isCorrect = targets.some((tg) => String(tg).trim().toLowerCase() === option);
    resolveAnswer(isCorrect);
  };

  const handleAnswer = async (option) => {
    if (feedback) return;
    setSelectedOption(option);
    const isCorrect = String(option) === String(currentQuestion.target) ||
      (Array.isArray(currentQuestion.target) && currentQuestion.target.includes(option));
    resolveAnswer(isCorrect);
  };

  const resolveAnswer = (isCorrect) => {
    window.speechSynthesis?.cancel();
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(async () => {
      setFeedback(null);
      setSelectedOption(null);
      let newQueue = [...queue];
      if (isCorrect) newQueue.shift();
      else { const failed = newQueue.shift(); newQueue.push(failed); }

      if (newQueue.length === 0) {
        await db.completedExplainedLessons.put({ lessonId: lesson.id, completedAt: new Date().toISOString() });
        const cache = JSON.parse(localStorage.getItem('completedExplainedLessonsCache') || '[]');
        if (!cache.includes(lesson.id)) {
          cache.push(lesson.id);
          localStorage.setItem('completedExplainedLessonsCache', JSON.stringify(cache));
        }
        await addXP(25);
        setPhase('done');
      } else {
        setQueue(newQueue);
      }
    }, isCorrect ? 1400 : 2200);
  };

  // Pular pergunta: conta como errada e vai para o final da fila (mesmo padrão do vocabulário)
  const handleSkip = () => {
    if (feedback || !currentQuestion) return;
    if (isListening) stopListening();
    setSelectedOption(null);
    resolveAnswer(false);
  };

  // Mesmo fluxo de permissão de microfone usado em AlphaNumbersExerciseView
  const handleMicClick = async () => {
    if (feedback) return;

    if (isListening) {
      stopListening();
      return;
    }

    if (!hasSupport) {
      showError('Seu navegador não suporta reconhecimento de voz. Use Chrome ou Safari.');
      return;
    }

    setMicLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((tr) => tr.stop());
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

  const handleVoiceCheck = () => {
    if (isListening) stopListening();
    checkAnswer(turnTranscript);
  };

  // Componente reutilizável dos controles de voz (mudo / pausar)
  const VoiceControls = ({ onReplay }) => (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={togglePause}
        className="p-2.5 rounded-full bg-gray-700/60 text-gray-300 hover:bg-gray-700 transition-colors"
        title={isPaused ? t('explained.resumeAudio', 'Continuar áudio') : t('explained.pauseAudio', 'Pausar áudio')}
      >
        {isPaused ? <Play size={16} /> : <Pause size={16} />}
      </button>
      <button
        onClick={toggleMute}
        className={`p-2.5 rounded-full transition-colors ${
          isMuted ? 'bg-red-500/20 text-red-400' : 'bg-fuchsia-500/15 text-fuchsia-400 hover:bg-fuchsia-500/25'
        }`}
        title={isMuted ? t('explained.unmute', 'Ativar som') : t('explained.mute', 'Silenciar')}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
      {!isMuted && (
        <button
          onClick={onReplay}
          className="p-2.5 rounded-full bg-fuchsia-500/15 text-fuchsia-400 hover:bg-fuchsia-500/25 transition-colors"
          title={t('explained.listenSlide', 'Ouvir explicação')}
        >
          <Volume2 size={18} className="opacity-0 absolute" />
          <Volume2 size={18} />
        </button>
      )}
    </div>
  );

  // ============ TELA: TEORIA ============
  if (phase === 'theory') {
    return (
      <div className="w-full pt-8 px-4 min-h-screen flex flex-col animate-fade-in">
        <BackButton to={backRoute} label={t('general.back', 'Voltar')} />

        <div className="flex items-center gap-2 mb-6">
          {lesson.theory.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= slideIndex ? 'bg-fuchsia-500' : 'bg-gray-700'}`} />
          ))}
        </div>

        <div className="flex-1 bg-gray-800 border border-gray-700 rounded-3xl p-6 flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-fuchsia-400">
              <BookOpen size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('explained.theoryLabel', 'Explicação')} {slideIndex + 1}/{lesson.theory.length}</span>
            </div>

            {/* Controles: Pausar/Continuar, Mutar, Ouvir de novo */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={togglePause}
                className="p-2.5 rounded-full bg-gray-700/60 text-gray-300 hover:bg-gray-700 transition-colors"
                title={isPaused ? t('explained.resumeAudio', 'Continuar áudio') : t('explained.pauseAudio', 'Pausar áudio')}
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
              <button
                onClick={toggleMute}
                className={`p-2.5 rounded-full transition-colors ${
                  isMuted ? 'bg-red-500/20 text-red-400' : 'bg-gray-700/60 text-gray-300 hover:bg-gray-700'
                }`}
                title={isMuted ? t('explained.unmute', 'Ativar som') : t('explained.mute', 'Silenciar')}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button
                onClick={playTheorySlide}
                disabled={isMuted}
                className="p-2.5 rounded-full bg-fuchsia-500/15 text-fuchsia-400 hover:bg-fuchsia-500/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title={t('explained.listenSlide', 'Ouvir explicação')}
              >
                <Volume2 size={18} />
              </button>
            </div>
          </div>
          <h3 className="text-2xl font-black text-white mb-4">{getText(current.title)}</h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-6 flex-1">{getText(current.body)}</p>

          {current.examples?.length > 0 && (
            <div className="bg-gray-900/60 rounded-2xl p-4 space-y-2 mb-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('explained.examples', 'Exemplos')}</span>
              {current.examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => !isMuted && speakInEnglish(String(ex))}
                  className="w-full text-left flex items-center gap-2 group"
                >
                  <Volume2 size={12} className="text-fuchsia-400 shrink-0 opacity-60 group-hover:opacity-100" />
                  <p className="text-sm text-fuchsia-200 italic">"{ex}"</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6 mb-4">
          {slideIndex > 0 && (
            <button onClick={() => setSlideIndex(i => i - 1)} className="p-4 rounded-2xl bg-gray-800 border border-gray-700 text-white">
              <ChevronLeft size={22} />
            </button>
          )}
          <button
            onClick={nextSlide}
            className="flex-1 py-4 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            {isLastSlide ? t('explained.understoodBtn', 'Entendi, deixe-me praticá-lo!') : t('general.continue', 'Continuar')}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // ============ TELA: PRÁTICA ============
  if (phase === 'practice') {
    return (
      <div className="w-full pt-8 px-4 min-h-screen flex flex-col animate-fade-in">
        <SpeechToast status={toastStatus} transcript={isListening ? transcript : ''} duration={3500} />

        <BackButton to={backRoute} label={t('general.saveAndExit', 'Salvar e Sair')} />

        <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-4 block bg-fuchsia-500/10 py-1 px-3 rounded-full w-max mx-auto">
          {t('general.remaining', 'Faltam')} {queue.length} {queue.length === 1 ? t('general.question', 'questão') : t('general.questions', 'questões')}
        </span>

        <div className="flex items-center justify-center gap-2 mb-8 px-2">
          <h2 className="text-2xl font-black text-white text-center">{getText(currentQuestion?.question)}</h2>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={togglePause}
              className="p-2 rounded-full bg-gray-700/60 text-gray-300"
              title={isPaused ? t('explained.resumeAudio', 'Continuar áudio') : t('explained.pauseAudio', 'Pausar áudio')}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>
            <button
              onClick={toggleMute}
              className={`p-2 rounded-full ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-gray-700/60 text-gray-300'}`}
              title={isMuted ? t('explained.unmute', 'Ativar som') : t('explained.mute', 'Silenciar')}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <button
              onClick={playExercisePrompt}
              disabled={isMuted}
              className="p-2 rounded-full bg-fuchsia-500/15 text-fuchsia-400 disabled:opacity-40"
            >
              <Volume2 size={16} />
            </button>
          </div>
        </div>

        {currentQuestion?.type === 'fill_choice' && (
          <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto w-full">
            {currentQuestion.options.map((opt) => {
              const targets = Array.isArray(currentQuestion.target) ? currentQuestion.target : [currentQuestion.target];
              const isThisCorrect = targets.includes(opt);
              const isThisSelected = selectedOption === opt;

              let colorClasses = 'bg-gray-800 border-gray-700 hover:border-fuchsia-400 text-white';
              if (feedback) {
                if (isThisCorrect) {
                  colorClasses = 'bg-green-600/20 border-green-500 text-green-300';
                } else if (isThisSelected) {
                  colorClasses = 'bg-red-600/20 border-red-500 text-red-300';
                } else {
                  colorClasses = 'bg-gray-800 border-gray-700 text-gray-500 opacity-60';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  onDoubleClick={() => !isMuted && speakInEnglish(String(opt))}
                  disabled={!!feedback}
                  className={`p-4 rounded-2xl border-2 font-bold text-left transition-colors disabled:cursor-not-allowed ${colorClasses}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{opt}</span>
                    {feedback && isThisCorrect && <CheckCircle2 size={18} className="text-green-400 shrink-0" />}
                    {feedback && isThisSelected && !isThisCorrect && <XCircle size={18} className="text-red-400 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* EXERCÍCIO DE VOZ — mesmo padrão usado em ai-voice / AlphaNumbersExerciseView */}
        {isVoiceExercise && (
          <div className="max-w-sm mx-auto w-full flex flex-col items-center">
            <p className="text-gray-400 text-sm mb-4 text-center">{getText(currentQuestion.instructions)}</p>

            {!hasSupport ? (
              <p className="text-amber-400 text-xs text-center bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                {t('ai.micNotSupportedDesc', 'Seu navegador não suporta a API de voz.')}
              </p>
            ) : (
              <>
                {/* Balão de transcrição, mesmo visual usado no resto do app */}
                <div className="mb-6 p-5 bg-gray-800/80 border border-gray-700 rounded-3xl w-full text-center min-h-[90px] flex flex-col items-center justify-center shadow-inner gap-2">
                  {isListening && !turnTranscript && (
                    <div className="flex gap-1.5 items-center">
                      {[0, 0.15, 0.3].map((delay) => (
                        <span
                          key={delay}
                          className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce"
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
                  disabled={!!feedback || micLoading}
                  className={`
                    p-8 rounded-full mb-4 transition-all shadow-xl
                    ${isListening
                      ? 'bg-red-500/20 text-red-400 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse'
                      : micLoading
                        ? 'bg-gray-700 text-gray-400 cursor-wait'
                        : 'bg-gradient-to-tr from-fuchsia-600 to-purple-500 text-white hover:scale-105 shadow-[0_10px_20px_rgba(192,38,211,0.4)]'
                    }
                    ${feedback ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {micLoading ? (
                    <svg className="w-10 h-10 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : isListening ? (
                    <StopCircle size={40} />
                  ) : (
                    <Mic size={40} />
                  )}
                </button>

                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider text-center mb-4">
                  {isListening
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
              </>
            )}
          </div>
        )}

        {/* BOTÃO DE PULAR — mesmo padrão usado nos vocabulários */}
        {!feedback && (
          <div className="max-w-sm mx-auto w-full mt-6">
            <button
              type="button"
              onClick={handleSkip}
              className="w-full flex flex-col items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-yellow-950 p-2.5 rounded-xl transition-colors shadow-md"
            >
              <span className="text-sm font-black uppercase tracking-wider">
                {t('level.skipBtnMain', 'Pular')}
              </span>
              <span className="text-[10px] font-bold opacity-80">
                {t('level.skipBtnSub', '(Não sei)')}
              </span>
            </button>
          </div>
        )}

        {/* MODAL DE ACERTO/ERRO — igual ao padrão usado nos vocabulários */}
        {feedback && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className={`bg-gray-900 border rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center ${
              feedback === 'correct' ? 'border-green-500/40' : 'border-red-500/40'
            }`}>
              {feedback === 'correct' ? (
                <CheckCircle2 size={56} className="text-green-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
              ) : (
                <XCircle size={56} className="text-red-500 mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
              )}
              <h3 className="text-xl font-black text-white mb-2">
                {feedback === 'correct' ? t('general.correct', 'Você acertou!') : t('general.almostThere', 'Quase lá!')}
              </h3>

              {/* Só mostra a resposta correta explicitamente para ditado por voz.
                  Para múltipla escolha, os botões acima já mostram vermelho/verde. */}
              {isVoiceExercise && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 w-full mt-2">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                    {t('level.validOptions', 'Resposta correta')}
                  </p>
                  <p className="text-white text-lg font-black">
                    {getTargetsDisplay(currentQuestion)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============ TELA: CONCLUÍDO ============
  return (
    <div className="w-full pt-8 px-4 min-h-screen flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <PartyPopper size={48} />
      </div>
      <h2 className="text-3xl font-black text-white mb-3">{t('level.completedTitle', 'Nível Concluído!')}</h2>
      <p className="text-gray-400 mb-8">+25 XP</p>
      <button
        onClick={() => navigate(backRoute)}
        className="px-8 py-4 bg-white text-black font-black rounded-full shadow-xl active:scale-95"
      >
        {t('general.backToMenu', 'Voltar para o Menu')}
      </button>
    </div>
  );
}