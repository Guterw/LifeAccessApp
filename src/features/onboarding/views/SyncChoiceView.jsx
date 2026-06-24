// src/features/onboarding/views/SyncChoiceView.jsx
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import PigeonAvatar from '../../../components/PigeonAvatar';
import { HardDrive, Sparkles } from 'lucide-react';
import FooterBrand from '../../../components/FooterBrand';

// Importações do Firebase e do Banco Local (Dexie)
import { auth, googleProvider } from '../../../config/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { db } from '../../../config/dexieDb';

// Importação do nosso Motor de Nuvem
import { pullFromCloud, pushToCloud } from '../../../utils/cloudSync';

export default function SyncChoiceView({ onOffline }) {
  const { t } = useLanguage();
  
  const handleGoogleLogin = async () => {
    try {
      // 1. Abre o popup do Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // 2. Tenta puxar o backup da nuvem (Celular novo ou reinstalação)
      const hasBackup = await pullFromCloud(user.uid);
      
      if (!hasBackup) {
        // Se não tem backup, salva o nome básico no Dexie e faz o primeiro Upload
        const settings = await db.appSettings.get(1) || { id: 1 };
        settings.userName = user.displayName.split(' ')[0]; // Pega só o primeiro nome
        settings.userEmail = user.email;
        settings.isFirstAccess = false; 
        await db.appSettings.put(settings);
        
        await pushToCloud(user.uid); // Cria a primeira versão na nuvem
      } else {
        // Se já tinha backup, ele puxou com sucesso para o Dexie.
        // Apenas garantimos que a flag de primeiro acesso seja desativada.
        const settings = await db.appSettings.get(1) || { id: 1 };
        settings.isFirstAccess = false;
        await db.appSettings.put(settings);
      }

      // 3. Redireciona o usuário direto para o app
      window.location.href = '/LifeAccessApp/'; 
      
    } catch (error) {
      console.error("Erro no login com Google:", error);
      alert(t('syncChoice.loginError', 'Erro ao conectar com o Google. Tente novamente.'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 animate-fade-in fixed inset-0 z-50 overflow-hidden">
      
      {/* Efeitos de Fundo Premium */}
      <div className="absolute top-[-10%] left-[-20%] w-[100%] h-[400px] bg-blue-600/20 rounded-[100%] blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[100%] h-[400px] bg-purple-600/20 rounded-[100%] blur-[120px] pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm relative z-10 space-y-8 mt-4">
        
        {/* Logo / Avatar */}
        <div className="relative">
          <div className="w-32 h-32 bg-gray-900 rounded-full border-4 border-gray-800 shadow-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
            <PigeonAvatar accessory="none" className="w-24 h-24 mt-4" />
          </div>
          <div className="absolute -bottom-3 -right-3 bg-blue-600 p-2 rounded-full border-4 border-gray-900 text-white animate-bounce">
            <Sparkles size={20} />
          </div>
        </div>

        {/* Textos */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
            LifeAccess
          </h1>
          <p className="text-gray-400 text-sm font-medium leading-relaxed px-4">
            {t('syncChoice.subtitle', 'Seu ecossistema completo de evolução pessoal, idiomas e organização.')}
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="w-full space-y-4 pt-4">
          
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 p-4 rounded-2xl flex items-center justify-center gap-3 font-black shadow-lg transition-transform active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t('syncChoice.googleBtn', 'Entrar com Google')}
          </button>

          <div className="flex items-center gap-3 w-full py-2">
            <div className="h-px bg-gray-700 flex-1"></div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{t('syncChoice.or', 'OU')}</span>
            <div className="h-px bg-gray-700 flex-1"></div>
          </div>

          <button 
            onClick={onOffline}
            className="w-full bg-gray-800 border-2 border-gray-700 hover:border-gray-600 text-white p-4 rounded-2xl flex flex-col items-center justify-center transition-colors active:scale-95"
          >
            <span className="font-black text-sm">{t('syncChoice.offlineBtn', 'Continuar Offline')}</span>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
              <HardDrive size={12} />
              {t('syncChoice.offlineSub', 'Salvo apenas neste dispositivo')}
            </div>
          </button>

        </div>
      </div>
      
      <div className="shrink-0 mt-4 mb-2">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-gray-500" />
      </div>
    </div>
  );
}