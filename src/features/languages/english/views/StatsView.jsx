import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../../config/dexieDb';
import { useLanguage } from '../../../../contexts/LanguageContext';
import BackButton from '../../../../components/BackButton';
import { Trophy, BookOpen, AlertTriangle, ChevronRight, ArrowLeft, Library, Bookmark } from 'lucide-react';
import { englishLevels } from '../../../../data/englishLevels';

// ==========================================
// TELA FULLSCREEN DE EXPLORAÇÃO
// ==========================================
function WordGroupViewer({ wordsList, onClose, title }) {
  const { uiLang, t } = useLanguage();
  const [viewStep, setViewStep] = useState('LEVELS');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const safeT = (key, fallback) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  // Dicionário interno para traduzir as categorias que vêm do englishLevels.js
  const categoryTranslations = {
    'Pronomes': { en: 'Pronouns', es: 'Pronombres', pt: 'Pronomes' },
    'Pronomes (Irlanda/Informal)': { en: 'Pronouns (Ireland/Slang)', es: 'Pronombres (Irlanda/Informal)', pt: 'Pronomes (Irlanda/Informal)' },
    'Verbos': { en: 'Verbs', es: 'Verbos', pt: 'Verbos' },
    'To Be': { en: 'To Be', es: 'To Be', pt: 'To Be' },
    'To Be (Irlanda)': { en: 'To Be (Ireland)', es: 'To Be (Irlanda)', pt: 'To Be (Irlanda)' },
    'Fundamentais': { en: 'Fundamentals', es: 'Fundamentales', pt: 'Fundamentais' },
    'Substantivos': { en: 'Nouns', es: 'Sustantivos', pt: 'Substantivos' },
    'Frases': { en: 'Phrases', es: 'Frases', pt: 'Frases' },
    'Família': { en: 'Family', es: 'Familia', pt: 'Família' },
    'Possessivos': { en: 'Possessives', es: 'Posesivos', pt: 'Possessivos' },
    'Cumprimentos': { en: 'Greetings', es: 'Saludos', pt: 'Cumprimentos' },
    'Cumprimentos (Irlanda/UK)': { en: 'Greetings (Ireland/UK)', es: 'Saludos (Irlanda/UK)', pt: 'Cumprimentos (Irlanda/UK)' },
    'Gíria (Irlanda)': { en: 'Slang (Ireland)', es: 'Jerga (Irlanda)', pt: 'Gíria (Irlanda)' },
    'Lugares': { en: 'Places', es: 'Lugares', pt: 'Lugares' },
    'Viagem': { en: 'Travel', es: 'Viajes', pt: 'Viagem' },
    'Geral': { en: 'General', es: 'General', pt: 'Geral' }
  };

  const getTranslatedCategory = (cat) => {
    return categoryTranslations[cat]?.[uiLang] || cat;
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const groupedData = wordsList.reduce((acc, wordObj) => {
    const wordEn = typeof wordObj === 'string' ? wordObj : wordObj.word || wordObj.en;
    let levelId = 'unknown';
    let levelTitle = { pt: 'Outros', en: 'Others', es: 'Otros' };
    let category = 'Geral';
    let fullWordData = { en: wordEn, pt: ['Tradução indisponível'] };

    for (const [key, levelData] of Object.entries(englishLevels)) {
      const found = levelData.words.find(w => w.en === wordEn);
      if (found) {
        levelId = key;
        levelTitle = levelData.title;
        category = found.category || 'Geral';
        fullWordData = found;
        break;
      }
    }

    if (!acc[levelId]) acc[levelId] = { title: levelTitle, categories: {} };
    if (!acc[levelId].categories[category]) acc[levelId].categories[category] = [];
    
    acc[levelId].categories[category].push(fullWordData);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-gray-900 z-[100] flex flex-col animate-slide-up overflow-hidden">
      <div className="pt-12 pb-4 px-6 bg-gray-900 border-b border-gray-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (viewStep === 'WORDS') { setSelectedCategory(null); setViewStep('CATEGORIES'); }
              else if (viewStep === 'CATEGORIES') { setSelectedLevel(null); setViewStep('LEVELS'); }
              else onClose();
            }} 
            className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <h3 className="text-xl font-bold text-white tracking-wide">
            {viewStep === 'LEVELS' && title}
            {viewStep === 'CATEGORIES' && groupedData[selectedLevel]?.title[uiLang]}
            {viewStep === 'WORDS' && getTranslatedCategory(selectedCategory)}
          </h3>
        </div>
      </div>

      <div className="p-6 overflow-y-auto flex-1 space-y-4 pb-32">
        {viewStep === 'LEVELS' && Object.keys(groupedData).map(levelId => {
          const levelInfo = groupedData[levelId];
          const totalWordsInLevel = Object.values(levelInfo.categories).flat().length;
          return (
            <button key={levelId} onClick={() => { setSelectedLevel(levelId); setViewStep('CATEGORIES'); }} className="w-full bg-gray-800 p-5 rounded-2xl border border-gray-700 flex justify-between items-center hover:border-blue-500 transition-all shadow-md">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl"><Library size={28} /></div>
                <div className="text-left">
                  <h4 className="font-bold text-white text-lg">{levelInfo.title[uiLang] || levelInfo.title.pt}</h4>
                  {/* TEXTO "PALAVRAS" AGORA TRADUZIDO */}
                  <p className="text-sm text-gray-400">{totalWordsInLevel} {safeT('stats.words', 'palavras')}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-500" />
            </button>
          )
        })}

        {viewStep === 'CATEGORIES' && selectedLevel && Object.keys(groupedData[selectedLevel].categories).map(cat => {
          const wordsInCat = groupedData[selectedLevel].categories[cat].length;
          return (
            <button key={cat} onClick={() => { setSelectedCategory(cat); setViewStep('WORDS'); }} className="w-full bg-gray-800 p-5 rounded-2xl border border-gray-700 flex justify-between items-center hover:border-blue-500 transition-all shadow-md ml-4 w-[calc(100%-1rem)]">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl"><Bookmark size={24} /></div>
                <div className="text-left">
                  {/* CATEGORIA AGORA TRADUZIDA */}
                  <h4 className="font-bold text-white text-lg">{getTranslatedCategory(cat)}</h4>
                  <p className="text-sm text-gray-400">{wordsInCat} {safeT('stats.words', 'palavras')}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-500" />
            </button>
          )
        })}

        {viewStep === 'WORDS' && selectedLevel && selectedCategory && 
          groupedData[selectedLevel].categories[selectedCategory].map((word, idx) => (
            <div key={idx} className="bg-gray-800 p-5 rounded-2xl border border-gray-700 flex items-center justify-between shadow-md ml-8 w-[calc(100%-2rem)]">
              <div className="flex items-center gap-4">
                <BookOpen size={20} className="text-blue-400" />
                <span className="font-bold text-white text-xl">{word.en}</span>
              </div>
              <span className="text-sm font-semibold text-gray-400">{word[uiLang]?.[0] || word.pt?.[0]}</span>
            </div>
        ))}
        
        {Object.keys(groupedData).length === 0 && (
          <div className="text-center text-gray-500 py-20 font-bold text-lg">{safeT('stats.noData', 'Nenhum dado encontrado.')}</div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// TELA PRINCIPAL DE ESTATÍSTICAS
// ==========================================
export default function StatsView() {
  const { t, languageStreak } = useLanguage();
  
  const safeT = (key, fallback) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };
  
  const learnedWords = useLiveQuery(() => db.learnedWords?.toArray() ?? [], []) || [];
  const wrongWords = useLiveQuery(() => db.mistakesLog?.toArray() ?? [], []) || [];

  const [modalType, setModalType] = useState(null); 

  return (
    <div className="w-full pt-8 animate-fade-in pb-24 px-4">
      <BackButton to="/english" label={safeT('backToEnglish', 'Voltar')} />
      
      <h2 className="text-3xl font-black text-white mt-6 mb-8 tracking-wide">
        {safeT('stats.title', 'Meu Progresso')}
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md">
          <Trophy className="text-yellow-500 mb-2" size={28} />
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{safeT('stats.streak', 'Ofensiva')}</h4>
          <p className="text-2xl font-black text-white mt-1">{languageStreak} dias</p>
        </div>
        
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md">
          <BookOpen className="text-green-500 mb-2" size={28} />
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{safeT('stats.learned', 'Vocabulário')}</h4>
          <p className="text-2xl font-black text-white mt-1">{learnedWords.length}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md mb-8 flex items-center gap-5">
        <AlertTriangle className="text-red-400" size={32} />
        <div>
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{safeT('stats.errors', 'Erros Recentes')}</h4>
          <p className="text-xl font-black text-white mt-0.5">{wrongWords.length} {safeT('stats.words', 'palavras')}</p>
        </div>
      </div>

      <h3 className="font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm">
        {safeT('stats.exploreWords', 'Explorar Palavras')}
      </h3>
      
      <div className="space-y-4">
        <button 
          onClick={() => setModalType('learned')}
          className="w-full bg-gray-800 p-5 rounded-2xl border border-green-500/30 flex items-center justify-between hover:bg-gray-750 transition-colors shadow-lg"
        >
          <div className="flex items-center gap-5">
            <div className="p-3 bg-green-500/20 text-green-400 rounded-xl"><BookOpen size={24} /></div>
            <div className="text-left">
              <h4 className="font-bold text-white text-lg">{safeT('stats.learnedWords', 'Palavras Aprendidas')}</h4>
              <p className="text-sm text-gray-400">{safeT('stats.learnedDesc', 'Ver vocabulário dominado')}</p>
            </div>
          </div>
          <ChevronRight className="text-gray-500" />
        </button>

        <button 
          onClick={() => setModalType('wrong')}
          className="w-full bg-gray-800 p-5 rounded-2xl border border-red-500/30 flex items-center justify-between hover:bg-gray-750 transition-colors shadow-lg"
        >
          <div className="flex items-center gap-5">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-xl"><AlertTriangle size={24} /></div>
            <div className="text-left">
              <h4 className="font-bold text-white text-lg">{safeT('stats.reviewWords', 'Palavras a Revisar')}</h4>
              <p className="text-sm text-gray-400">{safeT('stats.reviewDesc', 'Ver erros recentes')}</p>
            </div>
          </div>
          <ChevronRight className="text-gray-500" />
        </button>
      </div>

      {modalType && (
        <WordGroupViewer 
          wordsList={modalType === 'learned' ? learnedWords : wrongWords}
          title={modalType === 'learned' ? safeT('stats.learnedWords', 'Vocabulário Dominado') : safeT('stats.reviewWords', 'Palavras para Revisão')}
          onClose={() => setModalType(null)} 
        />
      )}
    </div>
  );
}