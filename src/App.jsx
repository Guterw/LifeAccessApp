import React, { useEffect } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
//Notificação
import { checkAllNotifications } from './utils/notificationService';
// Importação do Componente
import BottomNav from './components/BottomNav';
// Importação das Views Principais
import { useLanguage } from './contexts/LanguageContext';
import WelcomeView from './features/onboarding/views/WelcomeView';
import NameView from './features/onboarding/views/NameView';
import MainDashboard from './features/dashboard/views/MainDashboard';
import LanguagesDashboard from './features/languages/views/LanguagesDashboard';
import SettingsView from './features/settings/views/SettingsView';
// Importação das Views do Módulo de Inglês (Agora dentro de languages)
import VocabularyDashboard from './features/languages/english/views/VocabularyDashboard';
import LevelListView from './features/languages/english/views/LevelListView';
import LevelView from './features/languages/english/views/LevelView';
import StatsView from './features/languages/english/views/StatsView';
import LevelGroupView from './features/languages/english/views/LevelGroupView';

function App() {
  const { isFirstAccess } = useLanguage();
  const [onboardingStep, setOnboardingStep] = useState(1); // Controla a tela 1 ou 2
  // Se for a primeira vez que a pessoa abre o app, trava ela na tela de Boas-vindas
  
  useEffect(() => {
  const interval = setInterval(async () => {
    const settings = await db.appSettings.get(1);
    if (settings?.lastLanguageActivity) {
      checkAndNotify(settings.lastLanguageActivity);
    }
  }, 1000 * 60 * 30); // Checa a cada 30 minutos

  return () => clearInterval(interval);
}, []);
  
  if (isFirstAccess) {
    if (onboardingStep === 1) return <WelcomeView onNext={() => setOnboardingStep(2)} />;
    if (onboardingStep === 2) return <NameView />;
  }
  
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500/30">
        {/* O pb-24 garante que o conteúdo não fique escondido atrás da Bottom Bar */}
        <div className="max-w-md mx-auto w-full px-4 pb-28">
          <Routes>
            {/* Rota Principal */}
            <Route path="/" element={<MainDashboard />} />
            <Route path="/settings" element={<SettingsView />} />
            {/* Nova Rota: Central de Idiomas */}
            <Route path="/languages" element={<LanguagesDashboard />} />
            
            {/* Rotas do Módulo de Inglês */}
            <Route path="/english" element={<VocabularyDashboard />} />
            <Route path="/levels" element={<LevelListView />} />
            <Route path="/levels/group/:groupName" element={<LevelGroupView />} />
            <Route path="/level/:id" element={<LevelView />} />
            <Route path="/english/stats" element={<StatsView />} />
            
            {/* Rotas futuras (deixamos cegas por enquanto para não dar erro se clicar na Bottom Bar) */}
            <Route path="/fitness" element={<div className="pt-8 text-center text-gray-400">Em breve</div>} />
            <Route path="/finance" element={<div className="pt-8 text-center text-gray-400">Em breve</div>} />
            <Route path="/tasks" element={<div className="pt-8 text-center text-gray-400">Em breve</div>} />
          </Routes>
        </div>
        
        {/* A barra de navegação fica fixa no fundo de todas as telas */}
        <BottomNav />
      </div>
    </HashRouter>
  );
}

export default App;