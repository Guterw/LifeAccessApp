// src/features/languages/english/views/LevelView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../../../config/dexieDb';
import { vocabulariesLevels } from '../../../../data/vocabulariesLevels';
import { RotateCcw, CheckCircle2, XCircle, Flame, Volume2, Turtle } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import BackButton from '../../../../components/BackButton';
import { addXP } from '../../../../utils/xpManager';

// =========================================
// FUNÇÕES DE ÁUDIO NATIVAS
// =========================================
const speakWord = (text, rate = 0.9) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel(); 
  
  let cleanText = String(text).replace(/[^a-zA-Z0-9\s.]/g, '').toLowerCase();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'en-US';
  utterance.rate = rate; 
  window.speechSynthesis.speak(utterance);
};

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
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
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

export default function LevelView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, uiLang, registerLanguageActivity } = useLanguage();
  
  const currentLevelId = parseInt(id) || 1;
  const levelData = vocabulariesLevels[currentLevelId];

  const [queue, setQueue] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [progress, setProgress] = useState({ correct: 0, total: levelData?.words.length || 0 });
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const [streakUpdate, setStreakUpdate] = useState(null);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [fireIgnited, setFireIgnited] = useState(false);
  const [displayedStreak, setDisplayedStreak] = useState(0);
  const [numberPopped, setNumberPopped] = useState(false);

  const backRoute = location.state?.fromTrail 
    ? '/english/trail' 
    : '/levels';

  const currentValidAnswers = currentWord ? (
    (uiLang === 'es' && currentWord.es) ? currentWord.es : 
    currentWord.pt 
  ) : [];

  useEffect(() => {
    if (currentWord && currentWord.en) {
      speakWord(currentWord.en, 0.9);
    }
  }, [currentWord]);

  useEffect(() => {
    if (!levelData) return;
    const loadProgress = async () => {
      const savedState = await db.levelProgress.get(currentLevelId);
      if (savedState && savedState.pendingQueue.length > 0) {
        setQueue(savedState.pendingQueue);
        setCurrentWord(savedState.pendingQueue[0]);
        setProgress({ correct: savedState.correctCount, total: savedState.total });
      } else {
        setQueue(levelData.words);
        setCurrentWord(levelData.words[0]);
        setProgress({ correct: 0, total: levelData.words.length });
      }
    };
    loadProgress();
  }, [currentLevelId, levelData]);

  useEffect(() => {
    if (isFinished && streakUpdate?.increased) {
      setShowStreakModal(true);
      setDisplayedStreak(streakUpdate.oldStreak); 
      
      const t1 = setTimeout(() => {
        setFireIgnited(true);
      }, 500);

      const t2 = setTimeout(() => {
        setDisplayedStreak(streakUpdate.newStreak); 
        setNumberPopped(true); 
      }, 1500);

      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isFinished, streakUpdate]);

  const saveStateToDB = async (newQueue, newCorrectCount) => {
    await db.levelProgress.put({
      level: currentLevelId,
      correctCount: newCorrectCount,
      total: progress.total,
      pendingQueue: newQueue
    });
  };

  const handleCheck = async (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || !currentWord) return;

    const userAnswer = inputVal.trim().toLowerCase();
    const isCorrect = currentValidAnswers.some(ans => ans.toLowerCase() === userAnswer);

    let newQueue = [...queue];

    if (isCorrect) {
      setFeedback('correct');
      playCorrectSound(); 

      await db.learnedWords.put({
        en: currentWord.en,
        translation: currentValidAnswers[0],
        level: currentLevelId,
        category: currentWord.category || 'Geral',
        learnedAt: new Date().toISOString()
      });
      
      await db.mistakesLog.where('word').equals(currentWord.en).delete();

      newQueue.shift(); 
      const newCorrectCount = progress.correct + 1;
      setProgress({ ...progress, correct: newCorrectCount });
      await saveStateToDB(newQueue, newCorrectCount);

    } else {
      setFeedback('wrong');
      playWrongSound();

      await db.mistakesLog.add({
        word: currentWord.en,
        level: currentLevelId,
        category: currentWord.category || 'Geral',
        timestamp: new Date().toISOString()
      });
      
      const failedWord = newQueue.shift();
      newQueue.push(failedWord);
      await saveStateToDB(newQueue, progress.correct);
    }

    const delay = isCorrect ? 2500 : 3000;

    setTimeout(async () => {
      setInputVal('');
      setFeedback(null);
      
      if (newQueue.length === 0) {
        playCompletionSound();

        const streakResult = await registerLanguageActivity();
        setStreakUpdate(streakResult);

        // LÓGICA DE XP ATUALIZADA: Ganha 20 XP sempre que completar
        await addXP(20);

        // Salva a conclusão no banco para atualizar o card na tela anterior
        await db.completedLevels.put({
          level: currentLevelId,
          completedAt: new Date().toISOString()
        });

        setIsFinished(true);
      } else {
        setQueue(newQueue);
        setCurrentWord(newQueue[0]);
      }
    }, delay);
  };

  const handleSkip = async () => {
    if (feedback !== null || !currentWord) return;

    setFeedback('wrong'); 
    playWrongSound(); 

    await db.mistakesLog.add({
      word: currentWord.en,
      level: currentLevelId,
      category: currentWord.category || 'Geral',
      timestamp: new Date().toISOString()
    });

    let newQueue = [...queue];
    const skippedWord = newQueue.shift();
    newQueue.push(skippedWord); 
    await saveStateToDB(newQueue, progress.correct);

    setTimeout(async () => {
      setInputVal('');
      setFeedback(null);
      setQueue(newQueue);
      setCurrentWord(newQueue[0]);
    }, 3000);
  };

  const handleRestartLevel = async () => {
    await db.levelProgress.delete(currentLevelId);
    setQueue(levelData.words);
    setCurrentWord(levelData.words[0]);
    setProgress({ correct: 0, total: levelData.words.length });
    setIsFinished(false);
    
    setShowStreakModal(false);
    setFireIgnited(false);
    setNumberPopped(false);
    setStreakUpdate(null);
  };

  if (!levelData) return <div className="p-8 text-center">{t('level.notFound')}</div>;

  return (
    <div className="w-full pt-8 animate-fade-in relative">
      <BackButton to={backRoute} label={t('levelList.title')} />

      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-2xl font-bold text-blue-400">
          {levelData.title[uiLang] || levelData.title.pt}
        </h2>
        <button onClick={handleRestartLevel} className="text-gray-400 hover:text-white p-2 bg-gray-800 rounded-lg border border-gray-700 transition-colors shadow-sm" title="Recomeçar Level">
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{t('level.progress')}</span>
          <span className="font-bold text-white">{progress.correct} / {progress.total}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${(progress.correct / progress.total) * 100}%` }}
          ></div>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-700 text-center relative overflow-hidden">
          
          {feedback === 'correct' && (
            <div className="absolute inset-0 bg-gray-900/95 flex flex-col items-center justify-center z-10 backdrop-blur-md animate-fade-in px-4">
              <CheckCircle2 size={60} className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] mb-10" />
              <p className="text-green-400 text-sm font-bold uppercase tracking-widest mb-4">
                {t('level.excellent', 'Excelente!')}
              </p>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 w-full max-w-xs shadow-inner animate-fade-in" style={{ animationDelay: '200ms' }}>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  {t('level.validOptions', 'Opções Válidas')}
                </p>
                <p className="text-white text-xl font-black text-center">
                  {currentValidAnswers.join(' / ')}
                </p>
              </div>
            </div>
          )}
          
          {feedback === 'wrong' && (
            <div className="absolute inset-0 bg-gray-900/95 flex flex-col items-center justify-center z-10 backdrop-blur-md animate-fade-in px-4">
              <XCircle size={60} className="text-red-500 drop-shadow-lg mb-4" />
              <p className="text-gray-300 text-sm font-bold uppercase tracking-widest mb-1">
                {t('level.correctIs', 'O correto é:')}
              </p>
              <p className="text-white text-2xl sm:text-3xl font-black text-center">{currentValidAnswers.join('/')}</p>
            </div>
          )}

          <p className="text-gray-400 text-xs sm:text-sm mb-2">{t('level.translateThis', 'Traduza esta palavra')}</p>
          
          <div className="relative flex items-center justify-center w-full mb-8 min-h-[60px]">
            <div className="absolute left-0 flex items-center gap-1.5 sm:gap-2 z-10">
              <button 
                type="button"
                onClick={() => speakWord(currentWord?.en, 0.2)}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-yellow-500/20 text-yellow-500 rounded-full hover:bg-yellow-500/30 transition-colors shrink-0"
                title="Ouvir bem devagar"
              >
                <Turtle className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button 
                type="button"
                onClick={() => speakWord(currentWord?.en, 0.9)}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-yellow-500/20 text-yellow-500 rounded-full hover:bg-yellow-500/30 transition-colors shrink-0"
                title="Ouvir pronúncia"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <h3 className="text-[26px] leading-tight sm:text-4xl md:text-5xl font-black text-white tracking-wide text-center w-full break-words px-[76px] sm:px-[100px]">
              {currentWord?.en}
            </h3>
          </div>

          <form onSubmit={handleCheck} className="space-y-4">
            <input
              type="text" autoFocus disabled={feedback !== null}
              placeholder={t('level.placeholder', 'Sua resposta aqui...')}
              value={inputVal} onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-gray-900 text-white p-3 sm:p-4 rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none text-center text-base sm:text-lg transition-colors"
            />
            
            <button
              type="submit" disabled={feedback !== null}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 sm:p-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {t('level.confirm', 'Confirmar')}
            </button>

            <button
              type="button" 
              onClick={handleSkip}
              disabled={feedback !== null}
              className="w-full flex flex-col items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-yellow-950 p-2 sm:p-2.5 rounded-xl transition-colors disabled:opacity-50 shadow-md"
            >
              <span className="text-sm sm:text-base font-black uppercase tracking-wider">
                {t('level.skipBtnMain', 'Pular')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold opacity-80">
                {t('level.skipBtnSub', '(Não sei)')}
              </span>
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-2xl border border-green-500 text-center shadow-lg animate-fade-in">
          <CheckCircle2 size={60} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">{t('level.completedTitle', 'Nível Concluído!')}</h3>
          
          <div className="flex items-center justify-center gap-2 mb-4 bg-yellow-500/10 border border-yellow-500/20 py-2 px-4 rounded-xl w-max mx-auto">
            <Flame size={20} className="text-yellow-500" />
            <span className="text-yellow-400 font-black text-lg">+20 {t('level.xpReward', 'XP de Idiomas')}</span>
          </div>

          <p className="text-gray-400 mb-8">{t('level.masteredAll', 'Você dominou todas as')} {progress.total} {t('level.words', 'palavras!')}</p>

          <button 
            onClick={() => navigate(backRoute)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-xl mb-3 transition-colors shadow-lg"
          >
            {t('level.finishBtn', 'Finalizar')}
          </button>
          <button 
            onClick={handleRestartLevel}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold p-4 rounded-xl transition-colors"
          >
            {t('level.redoBtn', 'Refazer Nível')}
          </button>
        </div>
      )}

      {showStreakModal && streakUpdate && (
        <div className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-xl flex flex-col items-center justify-center px-6 animate-fade-in">
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className={`transition-all duration-1000 transform ${fireIgnited ? 'scale-110' : 'scale-90 opacity-50'}`}>
              <Flame 
                size={140} 
                className={`transition-colors duration-1000 ${fireIgnited ? 'text-orange-500 drop-shadow-[0_0_60px_rgba(249,115,22,0.8)] animate-pulse' : 'text-gray-600'}`} 
              />
            </div>
            <h2 className="text-3xl font-black text-white mt-12 mb-4 tracking-wide text-center">
              {t('level.streakUpdated', 'Ofensiva Atualizada!')}
            </h2>
            <div className="flex items-center justify-center h-32 mt-2">
              <span className={`text-8xl font-black transition-all duration-500 transform ${
                numberPopped 
                  ? 'text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.8)] scale-110 animate-bounce-once' 
                  : 'text-gray-500 scale-100'
              }`}>
                {displayedStreak}
              </span>
            </div>
          </div>
          <div className="w-full max-w-sm pb-safe pt-8 pb-12">
            <button 
              onClick={() => setShowStreakModal(false)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xl p-5 rounded-2xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] active:scale-95 uppercase tracking-wide"
            >
              {t('level.dedicateBtn', 'Continuar Focado')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}