// src/features/languages/english/views/explained/ExplainedLessonView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, BookOpen, CheckCircle2, XCircle, PartyPopper, Volume2 } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { EXPLAINED_LESSONS } from '../../../../../data/explainedLessons';
import { db } from '../../../../../config/dexieDb';
import { addXP } from '../../../../../utils/xpManager';
import BackButton from '../../../../../components/BackButton';
import { speakInUiLang, speakInEnglish, speakSequence } from '../../../../../utils/speechHelper';

export default function ExplainedLessonView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();
  const lesson = EXPLAINED_LESSONS.find(l => l.id === lessonId);

  const getText = (obj) => obj?.[uiLang] || obj?.pt || '';

  const [phase, setPhase] = useState('theory');
  const [slideIndex, setSlideIndex] = useState(0);
  const [queue, setQueue] = useState(lesson ? [...lesson.exercises] : []);
  const [feedback, setFeedback] = useState(null);

  if (!lesson) return <div className="p-8 text-center text-gray-400">{t('general.notFound', 'Não encontrado.')}</div>;

  const current = lesson.theory[slideIndex];
  const isLastSlide = slideIndex === lesson.theory.length - 1;
  const currentQuestion = queue[0];

  // Lógica blindada contra letras maiúsculas no iOS (toLowerCase)
  const playTheorySlide = () => {
    const segments = [
      { text: String(getText(current.title)).toLowerCase(), lang: uiLang },
      { text: String(getText(current.body)).toLowerCase(), lang: uiLang },
    ];
    (current.examples || []).forEach((ex) => {
      segments.push({ text: String(ex).toLowerCase(), lang: 'en' });
    });
    speakSequence(segments);
  };

  const playExercisePrompt = () => {
    speakInUiLang(String(getText(currentQuestion?.question)).toLowerCase(), uiLang);
  };

  // REPRODUÇÃO AUTOMÁTICA
  useEffect(() => {
    const timer = setTimeout(() => {
      if (phase === 'theory' && current) {
        playTheorySlide();
      } else if (phase === 'practice' && currentQuestion && !feedback) {
        playExercisePrompt();
      }
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIndex, currentQuestion, phase, feedback]);
   
  const nextSlide = () => {
    window.speechSynthesis?.cancel();
    if (isLastSlide) setPhase('practice');
    else setSlideIndex(i => i + 1);
  };

  const handleAnswer = async (option) => {
    if (feedback) return;
    const isCorrect = String(option) === String(currentQuestion.target) ||
      (Array.isArray(currentQuestion.target) && currentQuestion.target.includes(option));
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(async () => {
      setFeedback(null);
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
    }, isCorrect ? 1200 : 1800);
  };

  // ============ TELA: TEORIA ============
  if (phase === 'theory') {
    return (
      <div className="w-full pt-8 px-4 min-h-screen flex flex-col animate-fade-in">
        <BackButton to="/english/explained" label={t('general.back', 'Voltar')} />

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
            <button
              onClick={playTheorySlide}
              className="p-2.5 rounded-full bg-fuchsia-500/15 text-fuchsia-400 hover:bg-fuchsia-500/25 transition-colors shrink-0"
              title={t('explained.listenSlide', 'Ouvir explicação')}
            >
              <Volume2 size={18} />
            </button>
          </div>
          <h3 className="text-2xl font-black text-white mb-4">{getText(current.title)}</h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-6 flex-1">{getText(current.body)}</p>

          {current.examples?.length > 0 && (
            <div className="bg-gray-900/60 rounded-2xl p-4 space-y-2 mb-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('explained.examples', 'Exemplos')}</span>
              {current.examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => speakInEnglish(String(ex).toLowerCase())} // BLINDAGEM AQUI
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
        <BackButton to="/english/explained" label={t('general.saveAndExit', 'Salvar e Sair')} />

        <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-4 block bg-fuchsia-500/10 py-1 px-3 rounded-full w-max mx-auto">
          {t('general.remaining', 'Faltam')} {queue.length} {queue.length === 1 ? t('general.question', 'questão') : t('general.questions', 'questões')}
        </span>

        <div className="flex items-center justify-center gap-2 mb-8 px-2">
          <h2 className="text-2xl font-black text-white text-center">{getText(currentQuestion?.question)}</h2>
          <button onClick={playExercisePrompt} className="p-2 rounded-full bg-fuchsia-500/15 text-fuchsia-400 shrink-0">
            <Volume2 size={16} />
          </button>
        </div>

        {currentQuestion?.type === 'fill_choice' && (
          <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto w-full">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                onDoubleClick={() => speakInEnglish(String(opt).toLowerCase())} // BLINDAGEM AQUI
                disabled={!!feedback}
                className="p-4 bg-gray-800 rounded-2xl border-2 border-gray-700 hover:border-fuchsia-400 text-white font-bold text-left disabled:opacity-60"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {currentQuestion?.type === 'voice_dictation' && (
          <div className="max-w-sm mx-auto w-full text-center">
            <p className="text-gray-400 text-sm mb-4">{getText(currentQuestion.instructions)}</p>
            <p className="text-gray-500 text-xs italic">
              {t('explained.voiceFallback', 'Digite abaixo o que você falaria (versão simplificada):')}
            </p>
            <input
              type="text"
              onKeyDown={(e) => { if (e.key === 'Enter') handleAnswer(e.target.value.trim().toLowerCase()); }}
              className="w-full mt-3 bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-fuchsia-500 focus:outline-none text-center"
              placeholder={t('level.placeholder', 'Sua resposta aqui...')}
            />
          </div>
        )}

        {feedback && (
          <div className={`fixed inset-x-0 bottom-[80px] p-6 z-50 border-t-4 rounded-t-[2.5rem] ${feedback === 'correct' ? 'bg-green-950/95 border-green-500' : 'bg-red-950/95 border-red-500'}`}>
            <div className="flex items-center gap-3 max-w-md mx-auto">
              {feedback === 'correct' ? <CheckCircle2 className="text-green-500" size={32} /> : <XCircle className="text-red-500" size={32} />}
              <span className="text-white font-black text-lg">
                {feedback === 'correct' ? t('general.correct', 'Você acertou!') : t('general.almostThere', 'Quase lá!')}
              </span>
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
        onClick={() => navigate('/english/explained')}
        className="px-8 py-4 bg-white text-black font-black rounded-full shadow-xl active:scale-95"
      >
        {t('general.backToMenu', 'Voltar para o Menu')}
      </button>
    </div>
  );
}