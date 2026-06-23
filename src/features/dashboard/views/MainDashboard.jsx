import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Dumbbell, Wallet, Calendar, Settings, Flame } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import ModuleCard from '../../../components/ModuleCard';
import FooterBrand from '../../../components/FooterBrand';
import PigeonAvatar from '../../../components/PigeonAvatar'; // IMPORT DO PADDY!

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
    // relative + overflow-hidden contém os glows de fundo dentro da largura do app
    <div className="w-full min-h-screen relative overflow-hidden pt-12 pb-24 animate-fade-in -mt-5 -mb-20">

      {/* Glows ambiente: só pra tirar o aspecto "chapado" do fundo, sutil de propósito */}
      <div className="absolute -top-24 -right-16 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-40 -left-20 w-56 h-56 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Container agora sem px-5 nas laterais, garantindo 100% da largura */}
      <div className="px-4"> {/* Apenas um respiro mínimo para o texto não 'sumir' na dobra do vidro */}
        <div className="flex justify-between items-start mb-10">
          <div className="pr-2">
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
              {t('home.greeting')}{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                {userName}!
              </span>
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
      {/* Adicionado mt-10 para dar espaço para a cabeça e chapéu do Paddy */}
      <div className="space-y-4 px-2 mt-10"> 
        
        {/* CONTAINER RELATIVO DO MÓDULO DE IDIOMAS COM O PADDY */}
        <div className="relative">
          {/* O PADDY IRLANDÊS (Em pé sobre o card) */}
          <div className="absolute -top-[55px] right-6 z-20 pointer-events-none drop-shadow-[0_12px_12px_rgba(0,0,0,0.6)]">
            <PigeonAvatar accessory="irish" className="w-20 h-20" />
          </div>

          <ModuleCard 
            onClick={() => navigate('/languages')}
            icon={Globe}
            title={t('home.langModule')}
            subtitle={t('home.langDesc')}
            isActive={true}
            customBgClass="bg-gradient-to-r from-blue-900/40 to-gray-800 border border-blue-500/30 hover:border-blue-400 shadow-lg relative z-10"
            iconBgClass="bg-blue-500/20 text-blue-400"
            badge={streakBadge}
          />
        </div>

        {/* Ícones com a mesma cor de identidade usada quando o módulo está ativo na BottomNav,
            só que mais suave — pra não parecer "morto" mesmo estando em desenvolvimento */}
        <ModuleCard 
          icon={Dumbbell}
          title={t('home.fitnessModule')}
          subtitle={t('inDev')}
          isActive={false}
          customBgClass="bg-gray-800/40 border border-gray-700/40"
          iconBgClass="bg-green-500/10 text-green-400"
        />

        <ModuleCard 
          icon={Wallet}
          title={t('home.financeModule')}
          subtitle={t('inDev')}
          isActive={false}
          customBgClass="bg-gray-800/40 border border-gray-700/40"
          iconBgClass="bg-red-500/10 text-red-400"
        />

        <ModuleCard 
          icon={Calendar}
          title={t('home.calendarModule')}
          subtitle={t('inDev')}
          isActive={false}
          customBgClass="bg-gray-800/40 border border-gray-700/40"
          iconBgClass="bg-purple-500/10 text-purple-400"
        />
      </div>
      <div className="shrink-0 mt-3 -mb-4">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-500" />
      </div>
    </div>
  );
}