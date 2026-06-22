// src/features/languages/english/views/EnglishDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../../config/dexieDb';
import { BookOpen, Sparkles, AlertTriangle, Trophy, PlayCircle, Flame, ChevronRight, Rocket, BookOpenText } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import BackButton from '../../../../components/BackButton';
import FlagIcon from '../../../../components/FlagIcon';
import FooterBrand from '../../../../components/FooterBrand';
import PigeonAvatar from '../../../../components/PigeonAvatar';

export default function EnglishDashboard() {
  const navigate = useNavigate();
  const { t, languageStreak } = useLanguage();

  const learnedCount = useLiveQuery(() => db.learnedWords?.count() ?? 0, []) || 0;
  const mistakesCount = useLiveQuery(() => db.mistakesLog?.count() ?? 0, []) || 0;
  const isStreakActive = languageStreak > 0;

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 -mt-5 -mb-20">
      <BackButton to="/languages" label={t('backToLanguages', 'Voltar')} />

      {/* CABEÇALHO */}
      <div className="flex flex-col items-center mb-8 -mt-5">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-800 shadow-xl mb-6">
          <FlagIcon code="gb" />
        </div>

        <h1 className="text-3xl bg-gradient-to-br from-blue-400 to-red-400 text-transparent bg-clip-text font-black mb-5 tracking-wide text-center">
          {t('english.title', 'Módulo de Inglês')}
        </h1>
        
        <div className={`flex items-center gap-2 px-5 py-1.5 rounded-full border shadow-sm relative z-10 -mb-4 ${
          isStreakActive ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-gray-800 text-gray-500 border-gray-700'
        }`}>
          <Flame size={16} className={isStreakActive ? 'text-orange-500' : 'text-gray-600'} />
          <span className="font-bold text-xs tracking-wide">{languageStreak} {t('settings.days', 'dias')}</span>
        </div>
      </div>
      
      <div className="w-full space-y-6">
        
        {/* ========================================= */}
        {/* CARD ESTATÍSTICAS COM O PADDY SENTADO */}
        {/* ========================================= */}
        <div className="relative mt-12">
          
          {/* O Paddy Intelectual */}
          <div className="absolute -top-[52px] right-6 z-20 pointer-events-none drop-shadow-[0_10px_8px_rgba(0,0,0,0.5)]">
            <PigeonAvatar accessory="reading" className="w-20 h-20" />
          </div>

          <button 
            onClick={() => navigate('/english/stats')}
            className="w-full bg-gray-800 rounded-[2rem] p-5 border border-gray-700 shadow-xl block text-left hover:border-blue-500 transition-all group relative z-10"
          >
            <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                {t('stats.myProgress', 'Meu Progresso')}
              </h3>
              <ChevronRight size={16} className="text-gray-500 group-hover:text-blue-400" />
            </div>

            <div className="flex justify-between items-center px-2">
              <div className="flex flex-col items-center flex-1">
                <Trophy className="text-yellow-500 mb-1" size={20} />
                <span className="text-white font-black text-lg">{languageStreak}</span>
                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{t('stats.streak', 'Ofensiva')}</span>
              </div>
              <div className="w-px h-8 bg-gray-700"></div>
              <div className="flex flex-col items-center flex-1">
                <BookOpen className="text-green-500 mb-1" size={20} />
                <span className="text-white font-black text-lg">{learnedCount}</span>
                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{t('stats.learned', 'Aprendidas')}</span>
              </div>
              <div className="w-px h-8 bg-gray-700"></div>
              <div className="flex flex-col items-center flex-1">
                <AlertTriangle className="text-red-400 mb-1" size={20} />
                <span className="text-white font-black text-lg">{mistakesCount}</span>
                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{t('stats.toReview', 'Revisar')}</span>
              </div>
            </div>
          </button>
        </div>

        {/* TRILHA E BOTÕES */}
        <button
          onClick={() => navigate('/english/trail')}
          className="w-full text-left p-5 rounded-3xl border bg-gradient-to-br from-indigo-900/40 to-gray-800 flex items-center justify-between border-indigo-500/30 hover:border-indigo-400 shadow-lg group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"><Rocket size={22} /></div>
            <div>
              <h3 className="text-base font-black text-white">{t('english.guidedJourney', 'Jornada Guiada')}</h3>
              <p className="text-[9px] font-bold tracking-widest text-indigo-300 uppercase">{t('english.followTrail', 'Siga a Trilha')}</p>
            </div>
          </div>
          <ChevronRight className="text-indigo-400" />
        </button>

        <button 
          onClick={() => navigate('/english/alpha-numbers')}
          className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 p-5 rounded-2xl flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 text-white rounded-xl"><BookOpenText size={22} /></div>
            <div className="text-left">
              <h3 className="text-base font-black text-white">{t('english.fundamentals', 'Fundamentos')}</h3>
              <p className="text-[10px] text-blue-100 font-medium">{t('english.alphaAndNumbers', 'Alfabeto e Números')}</p>
            </div>
          </div>
          <ChevronRight className="text-white/70" />
        </button>

        <button 
          onClick={() => navigate('/english/ai-hub')}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-5 rounded-2xl flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 text-white rounded-xl"><Sparkles size={22} /></div>
            <div className="text-left">
              <h3 className="text-base font-black text-white">{t('ai.teacherTitle', 'Professor IA')}</h3>
              <p className="text-[10px] text-purple-100 font-medium">{t('english.conversationTrain', 'Conversação e Treino')}</p>
            </div>
          </div>
          <ChevronRight className="text-white/70" />
        </button>

        <button 
          onClick={() => navigate('/levels')}
          className="w-full bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20 border-b-4 border-blue-800 active:border-b-0 active:mt-1"
        >
          <PlayCircle size={20} />
          {t('english.practiceBtn', 'Praticar Vocabulário')}
        </button>
      </div>

      <div className="shrink-0 mt-8">
          <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>
    </div>
  );
}