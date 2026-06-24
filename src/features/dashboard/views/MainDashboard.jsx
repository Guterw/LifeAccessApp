// src/features/dashboard/views/MainDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Dumbbell, Wallet, Calendar, Settings, Flame, Download, X, Share } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import ModuleCard from '../../../components/ModuleCard';
import FooterBrand from '../../../components/FooterBrand';
import PigeonAvatar from '../../../components/PigeonAvatar'; 

export default function MainDashboard() {
  const navigate = useNavigate();
  const { t, userName, uiLang, languageStreak } = useLanguage();

  const rawDate = new Intl.DateTimeFormat(uiLang, { dateStyle: 'full' }).format(new Date());
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const isStreakActive = languageStreak > 0;
  
  // ==========================================
  // LÓGICA DO BOTÃO DE INSTALAR (PWA & MODAL)
  // ==========================================
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  
  // Estados do nosso novo Modal Customizado
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('generic'); // 'ios' ou 'generic'

  useEffect(() => {
    // 1. IDENTIFICA SE JÁ ESTÁ RODANDO COMO APP (STANDALONE)
    // Se o usuário abriu pelo ícone da tela inicial, isso aqui dá TRUE.
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsInstalled(checkStandalone);

    // 2. Verifica se é iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOSDevice(ios);

    // 3. Captura o evento nativo (Chrome/Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); 
      setDeferredPrompt(e); 
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Abre o pop-up NATIVO do Android/PC
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true); 
      }
      setDeferredPrompt(null);
    } else if (isIOSDevice) {
      // Abre o NOSSO Modal Customizado para iOS
      setModalType('ios');
      setShowModal(true);
    } else {
      // Abre o NOSSO Modal Customizado Genérico
      setModalType('generic');
      setShowModal(true);
    }
  };

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
    <div className="w-full min-h-screen relative overflow-hidden pt-12 pb-24 animate-fade-in -mt-5 -mb-20">

      {/* Glows ambiente */}
      <div className="absolute -top-24 -right-16 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-40 -left-20 w-56 h-56 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* HEADER: Título e Botões */}
      <div className="px-4"> 
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
          
          <div className="flex gap-2 shrink-0">
            {/* O BOTÃO SOME AUTOMATICAMENTE SE ESTIVER RODANDO COMO APP */}
            {!isInstalled && (
              <button 
                onClick={handleInstallClick}
                className="p-3.5 bg-blue-600 hover:bg-blue-500 rounded-2xl border border-blue-500 transition-all shadow-lg text-white shrink-0"
                title="Instalar Aplicativo"
              >
                <Download size={22} />
              </button>
            )}

            <button 
              onClick={() => navigate('/settings')}
              className="p-3.5 bg-gray-800 hover:bg-gray-700 rounded-2xl border border-gray-700 transition-all shadow-lg text-gray-400 hover:text-white shrink-0"
            >
              <Settings size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-2 mt-10"> 
        {/* CONTAINER DO PADDY */}
        <div className="relative">
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

          <ModuleCard 
            icon={Dumbbell} 
            title={t('home.fitnessModule')} 
            subtitle={t('inDev')} isActive={false} 
            customBgClass="bg-gray-800/40 border border-gray-700/40" 
            iconBgClass="bg-green-500/10 text-green-400" 
          />
          <ModuleCard 
            icon={Wallet} 
            title={t('home.financeModule')} 
            subtitle={t('inDev')} isActive={false} 
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

      {/* ========================================== */}
      {/* MODAL CUSTOMIZADO DE INSTALAÇÃO            */}
      {/* ========================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/50">
                <Download size={32} className="text-blue-400" />
              </div>
              
              <h3 className="text-xl font-black text-white mb-2">Instalar Aplicativo</h3>
              
              {modalType === 'ios' ? (
                <div className="text-gray-400 text-sm space-y-4">
                  <p>Para instalar o LifeAccess no seu iPhone ou iPad:</p>
                  <ol className="text-left bg-gray-900/50 p-4 rounded-xl space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-800 rounded-md text-blue-400 border border-gray-700"><Share size={16} /></div>
                      <span>1. Toque em <strong>Compartilhar</strong> no rodapé do Safari.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-800 rounded-md text-white border border-gray-700"><Download size={16} /></div>
                      <span>2. Escolha <strong>Adicionar à Tela de Início</strong>.</span>
                    </li>
                  </ol>
                </div>
              ) : (
                <p className="text-gray-400 text-sm bg-gray-900/50 p-4 rounded-xl">
                  Para instalar, abra o menu de opções do seu navegador (geralmente os três pontinhos) e toque em <strong>"Adicionar à Tela Inicial"</strong> ou <strong>"Instalar Aplicativo"</strong>.
                </p>
              )}

              <button 
                onClick={() => setShowModal(false)}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}