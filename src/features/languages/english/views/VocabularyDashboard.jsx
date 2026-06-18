import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../../config/dexieDb';
import { BookOpen, AlertTriangle, Trophy, PlayCircle, Flame, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import BackButton from '../../../../components/BackButton';
import FlagIcon from '../../../../components/FlagIcon';

export default function VocabularyDashboard() {
  const navigate = useNavigate();
  const { t, languageStreak } = useLanguage();

  // Buscas blindadas contra "undefined" usando "?." e "??"
  const learnedCount = useLiveQuery(() => db.learnedWords?.count() ?? 0, []) || 0;
  const mistakesCount = useLiveQuery(() => db.mistakesLog?.count() ?? 0, []) || 0;

  const isStreakActive = languageStreak > 0;

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24">
      <BackButton to="/languages" label={t('backToLanguages', 'Voltar')} />

      {/* Cabeçalho Identitário (Seu design original mantido!) */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-800 shadow-xl mb-6">
          <FlagIcon code="gb" />
        </div>

        <h1 className="text-3xl font-black text-blue-400 mb-5 tracking-wide text-center">
          {t('english.title', 'Módulo de Inglês')}
        </h1>
        
        {/* Badge da Ofensiva isolado e com a margem negativa */}
        <div className={`flex items-center gap-2 px-5 py-2 rounded-full border shadow-sm relative z-10 -mb-4 ${
          isStreakActive 
            ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' 
            : 'bg-gray-800 text-gray-500 border-gray-700'
        }`}>
          <Flame size={18} className={isStreakActive ? 'text-orange-500' : 'text-gray-600'} />
          <span className="font-bold text-sm tracking-wide">
            {languageStreak} {t('settings.days', 'dias')}
          </span>
        </div>
      </div>
      
      <div className="w-full">
        {/* PAINEL CONSOLIDADO DE ESTATÍSTICAS (O Novo Card que abre o StatsView) */}
        <button 
          onClick={() => navigate('/english/stats')}
          className="w-full bg-gray-800 rounded-[2rem] p-6 border border-gray-700 shadow-xl mb-8 block text-left hover:border-blue-500 transition-all group"
        >
          <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-5">
            <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
              {t('stats.myProgress', 'Meu Progresso')}
            </h3>
            <ChevronRight className="text-gray-500 group-hover:text-blue-400 transition-colors" />
          </div>

          <div className="flex justify-between items-center px-1">
            {/* Ofensiva (Troféu) */}
            <div className="flex flex-col items-center flex-1">
              <Trophy className="text-yellow-500 mb-2" size={28} />
              <span className="text-white font-black text-2xl">{languageStreak}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 text-center">
                {t('stats.streak', 'Ofensiva')}
              </span>
            </div>

            <div className="w-px h-12 bg-gray-700 mx-1"></div>

            {/* Aprendidas (Livro) */}
            <div className="flex flex-col items-center flex-1">
              <BookOpen className="text-green-500 mb-2" size={28} />
              <span className="text-white font-black text-2xl">{learnedCount}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 text-center">
                {t('stats.learned', 'Aprendidas')}
              </span>
            </div>

            <div className="w-px h-12 bg-gray-700 mx-1"></div>

            {/* Erros / Revisar (Triângulo) */}
            <div className="flex flex-col items-center flex-1">
              <AlertTriangle className="text-red-400 mb-2" size={28} />
              <span className="text-white font-black text-2xl">{mistakesCount}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 text-center">
                {t('stats.toReview', 'Revisar')}
              </span>
            </div>
          </div>
        </button>

        {/* Botão de Prática Funcional apontando para /levels */}
        <button 
          onClick={() => navigate('/levels')}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-4 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-blue-500/30 text-lg"
        >
          <PlayCircle size={24} />
          {t('english.practiceBtn', 'Praticar Vocabulário')}
        </button>
      </div>
    </div>
  );
}