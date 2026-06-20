import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../../../config/dexieDb';
import { englishLevels } from '../../../../data/englishLevels';
import { RotateCcw, CheckCircle2, XCircle, Flame } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import BackButton from '../../../../components/BackButton';
import FooterBrand from '../../../../components/FooterBrand';

export default function LevelView() {
  const { id } = useParams();
  const navigate = useNavigate();
  // uiLang já está sendo importado aqui, o que é perfeito!
  const { t, uiLang, registerLanguageActivity } = useLanguage();
  
  const currentLevelId = parseInt(id) || 1;
  const levelData = englishLevels[currentLevelId];

  const [queue, setQueue] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [progress, setProgress] = useState({ correct: 0, total: levelData?.words.length || 0 });
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  // Estados do Modal Fullscreen
  const [streakUpdate, setStreakUpdate] = useState(null);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [fireIgnited, setFireIgnited] = useState(false);
  const [displayedStreak, setDisplayedStreak] = useState(0);
  const [numberPopped, setNumberPopped] = useState(false);

  // Independente do idioma da interface, a palavra exibida é sempre em inglês,
  // então a tradução esperada nunca pode ser a própria palavra em inglês.
  const currentValidAnswers = currentWord ? (
    (uiLang === 'es' && currentWord.es) ? currentWord.es : 
    currentWord.pt 
  ) : [];

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

  // Efeito Teatral da Ofensiva (Timers)
  useEffect(() => {
    if (isFinished && streakUpdate?.increased) {
      setShowStreakModal(true);
      setDisplayedStreak(streakUpdate.oldStreak); // Começa com o número antigo
      
      // Ato 1: Acende o Fogo (0.5s)
      const t1 = setTimeout(() => {
        setFireIgnited(true);
      }, 500);

      // Ato 2: Transforma o Número (1.5s)
      const t2 = setTimeout(() => {
        setDisplayedStreak(streakUpdate.newStreak); // Muda pro número novo
        setNumberPopped(true); // Engatilha a animação CSS de pulo
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
    e.preventDefault();
    if (!inputVal.trim() || !currentWord) return;

    const userAnswer = inputVal.trim().toLowerCase();
    const isCorrect = currentValidAnswers.some(ans => ans.toLowerCase() === userAnswer);

    let newQueue = [...queue];

    if (isCorrect) {
      setFeedback('correct');

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
        // 1. Primeiro registramos a atividade do dia e pegamos o resultado da ofensiva
        const streakResult = await registerLanguageActivity();
        setStreakUpdate(streakResult);

        // 2. Depois marcamos o nível como concluído no banco
        await db.completedLevels.put({
          level: currentLevelId,
          completedAt: new Date().toISOString()
        });

        // 3. Por fim, ativamos a tela de finalizado que vai disparar o useEffect do Modal
        setIsFinished(true);
      } else {
        setQueue(newQueue);
        setCurrentWord(newQueue[0]);
      }
    }, delay);
  };

  const handleRestartLevel = async () => {
    await db.levelProgress.delete(currentLevelId);
    setQueue(levelData.words);
    setCurrentWord(levelData.words[0]);
    setProgress({ correct: 0, total: levelData.words.length });
    setIsFinished(false);
    
    // Reseta todos os estados da animação
    setShowStreakModal(false);
    setFireIgnited(false);
    setNumberPopped(false);
    setStreakUpdate(null);
  };

  if (!levelData) return <div className="p-8 text-center">{t('level.notFound')}</div>;

  return (
    <div className="w-full pt-8 animate-fade-in relative">
      <BackButton to="/levels" label={t('levelList.title')} />

      <div className="flex justify-between items-center mb-6 px-2">
        {/* CORREÇÃO DO ERRO AQUI: Ele agora escolhe o idioma certo em vez de jogar o objeto inteiro */}
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
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-center relative overflow-hidden">
          {feedback === 'correct' && (
            <div className="absolute inset-0 bg-gray-900/95 flex flex-col items-center justify-center z-10 backdrop-blur-md animate-fade-in px-4">
              <CheckCircle2 size={60} className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] mb-10" />
              <p className="text-green-400 text-sm font-bold uppercase tracking-widest mb-4">
                {t('level.excellent')}
              </p>
              
              {/* Cardzinho mostrando todas as respostas válidas */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 w-full max-w-xs shadow-inner animate-fade-in" style={{ animationDelay: '200ms' }}>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  {t('level.validOptions')}
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
              <p className="text-gray-300 text-sm font-bold uppercase tracking-widest mb-1">{t('level.correctIs')}</p>
              <p className="text-white text-3xl font-black text-center">{currentValidAnswers.join('/')}</p>
            </div>
          )}

          <p className="text-gray-400 text-sm mb-2">{t('level.translateThis')}</p>
          <h3 className="text-5xl font-black text-white mb-8 tracking-wide">{currentWord?.en}</h3>

          <form onSubmit={handleCheck} className="space-y-4">
            <input
              type="text" autoFocus disabled={feedback !== null}
              placeholder={t('level.placeholder')}
              value={inputVal} onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-gray-900 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none text-center text-lg transition-colors"
            />
            <button
              type="submit" disabled={feedback !== null}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {t('level.confirm')}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-2xl border border-green-500 text-center shadow-lg animate-fade-in">
          <CheckCircle2 size={60} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">{t('level.completedTitle')}</h3>
          <p className="text-gray-400 mb-8">{t('level.masteredAll')} {progress.total} {t('level.words')}</p>

          <button 
            onClick={() => navigate('/levels')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-xl mb-3 transition-colors shadow-lg"
          >
            {t('level.finishBtn')}
          </button>
          <button 
            onClick={handleRestartLevel}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold p-4 rounded-xl transition-colors"
          >
            {t('level.redoBtn')}
          </button>
        </div>
      )}

      {/* =========================================
          MODAL DE OFENSIVA (NÍVEL z-[100] Cobre TUDO)
          ========================================= */}
      {showStreakModal && streakUpdate && (
        <div className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-xl flex flex-col items-center justify-center px-6 animate-fade-in">
          
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            {/* O Fogo pulsa infinitamente depois de acender */}
            <div className={`transition-all duration-1000 transform ${fireIgnited ? 'scale-110' : 'scale-90 opacity-50'}`}>
              <Flame 
                size={140} 
                className={`transition-colors duration-1000 ${fireIgnited ? 'text-orange-500 drop-shadow-[0_0_60px_rgba(249,115,22,0.8)] animate-pulse' : 'text-gray-600'}`} 
              />
            </div>

            <h2 className="text-3xl font-black text-white mt-12 mb-4 tracking-wide text-center">
              {t('level.streakUpdated')}
            </h2>

            {/* Número único que se transforma */}
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
              {t('level.dedicateBtn')}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}