import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Dumbbell, Wallet, Gamepad2, Settings, Flame } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import ModuleCard from '../../../components/ModuleCard';

export default function MainDashboard() {
  const navigate = useNavigate();
  const { t, userName, uiLang, languageStreak } = useLanguage();

  const rawDate = new Intl.DateTimeFormat(uiLang, { dateStyle: 'full' }).format(new Date());
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  // Lógica corrigida: Mostra sempre! Se for > 0 fica laranja e pulsa, se for 0 fica cinza e estático.
  const isStreakActive = languageStreak > 0;
  
  const streakBadge = (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border shadow-sm transition-colors ${
      isStreakActive 
        ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' 
        : 'bg-gray-700/50 text-gray-400 border-gray-600/50'
    }`}>
      <Flame size={14} className={isStreakActive ? 'animate-pulse text-orange-500' : 'text-gray-500'} />
      <span>{languageStreak || 0}</span>
    </div>
  );

  return (
    // Removido qualquer padding lateral da div pai
    // pt-12 garante o respiro no topo, pb-24 respiro na base
    <div className="w-full pt-12 pb-24 animate-fade-in">
      
      {/* Container agora sem px-5 nas laterais, garantindo 100% da largura */}
      <div className="px-4"> {/* Apenas um respiro mínimo para o texto não 'sumir' na dobra do vidro */}
        <div className="flex justify-between items-start mb-10">
          <div className="pr-2">
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
              {t('home.greeting')} <span className="text-blue-500">{userName}!</span>
            </h1>
            <p className="text-blue-400 font-semibold text-xs mt-2 uppercase tracking-widest">{formattedDate}</p>
            <p className="text-gray-400 mt-2 text-sm">{t('home.subtitle')}</p>
          </div>
          
          <button 
            onClick={() => navigate('/settings')}
            className="p-3.5 bg-gray-800 hover:bg-gray-700 rounded-2xl border border-gray-700 transition-all shadow-lg text-gray-400 hover:text-white flex-shrink-0"
          >
            <Settings size={22} />
          </button>
        </div>
      </div>

      {/* Os cards agora ficam sem px, ocupando toda a largura até a borda */}
      <div className="space-y-4 px-2"> 
        <ModuleCard 
          onClick={() => navigate('/languages')}
          icon={Globe}
          title={t('home.langModule')}
          subtitle={t('home.langDesc')}
          isActive={true}
          customBgClass="bg-gradient-to-r from-blue-900/40 to-gray-800 border border-blue-500/30 hover:border-blue-400 shadow-lg"
          iconBgClass="bg-blue-500/20 text-blue-400"
          badge={streakBadge}
        />

        <ModuleCard 
          icon={Dumbbell}
          title={t('home.fitnessModule')}
          subtitle={t('inDev')}
          isActive={false}
        />

        <ModuleCard 
          icon={Wallet}
          title={t('home.financeModule')}
          subtitle={t('inDev')}
          isActive={false}
        />

        <ModuleCard 
          icon={Gamepad2}
          title={t('home.tasksModule')}
          subtitle={t('inDev')}
          isActive={false}
        />
      </div>
    </div>
  );
}