// src/App.jsx
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { checkAllNotifications } from './utils/notificationService';
import { db } from './config/dexieDb';
import BottomNav from './components/BottomNav';
import { useLanguage } from './contexts/LanguageContext';
import FirstLaunchGuard from './components/FirstLaunchGuard';

import WelcomeView from './features/onboarding/views/WelcomeView';
import NameView from './features/onboarding/views/NameView';
import MainDashboard from './features/dashboard/views/MainDashboard';
import LanguagesDashboard from './features/languages/views/LanguagesDashboard';
import SettingsView from './features/settings/views/SettingsView';
import EnglishDashboard from './features/languages/english/views/EnglishDashboard';
import LevelListView from './features/languages/english/views/LevelListView';
import LevelView from './features/languages/english/views/LevelView';
import StatsView from './features/languages/english/views/StatsView';
import LevelGroupView from './features/languages/english/views/LevelGroupView';

// Módulo Alpha-Numbers
import AlphaNumbersMenu from './features/languages/english/views/alpha-numbers/AlphaNumbersMenu';
import AlphabetLearnView from './features/languages/english/views/alpha-numbers/AlphabetLearnView';
import NumbersLearnView from './features/languages/english/views/alpha-numbers/NumbersLearnView';
import ExerciseSelectionView from './features/languages/english/views/alpha-numbers/ExerciseSelectionView';
import AlphaNumbersExerciseView from './features/languages/english/views/alpha-numbers/AlphaNumbersExerciseView';

// IA Inglês Área
import AiHubView from './features/languages/english/views/AiHubView';
import AiChatFreeView from './features/languages/english/views/ai-chat/AiChatFreeView';
import AiTaskSelectionView from './features/languages/english/views/ai-chat/AiTaskSelectionView';
import AiChatTaskView from './features/languages/english/views/ai-chat/AiChatTaskView';
import AiVoiceFreeView from './features/languages/english/views/ai-voice/AiVoiceFreeView';
import AiVoiceTaskView from './features/languages/english/views/ai-voice/AiVoiceTaskView';
import AiVoiceTaskSelectionView from './features/languages/english/views/ai-voice/AiVoiceTaskSelectionView';
import TrailView from './features/languages/english/views/TrailView';

function App() {
  const { isFirstAccess } = useLanguage();
  const [onboardingStep, setOnboardingStep] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const settings = await db.appSettings.get(1);
      if (settings) {
        checkAllNotifications(settings, [], {});
      }
    }, 1000 * 60 * 30);
    return () => clearInterval(interval);
  }, []);
  
  // Telas iniciais (Idioma -> Nome). Após finalizar isFirstAccess vira false
  if (isFirstAccess) {
    if (onboardingStep === 1) return <WelcomeView onNext={() => setOnboardingStep(2)} />;
    if (onboardingStep === 2) return <NameView />;
  }
  
  return (
    <HashRouter>
      {/* Guardião de Permissões: Aparece só DEPOIS do Onboarding e ANTES de liberar o app principal */}
      <FirstLaunchGuard>
        <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500/30">
          <div className="max-w-md mx-auto w-full px-4 pb-28">
            <Routes>
              <Route path="/" element={<MainDashboard />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/languages" element={<LanguagesDashboard />} />
              
              {/* Rotas do Módulo de Inglês */}
              <Route path="/english" element={<EnglishDashboard />} />
              <Route path="/levels" element={<LevelListView />} />
              <Route path="/levels/group/:groupName" element={<LevelGroupView />} />
              <Route path="/level/:id" element={<LevelView />} />
              <Route path="/english/stats" element={<StatsView />} />
              
              {/* Fundamentos: Alfabeto e Números */}
              <Route path="/english/alpha-numbers" element={<AlphaNumbersMenu />} />
              <Route path="/english/alpha-numbers/alphabet" element={<AlphabetLearnView />} />
              <Route path="/english/alpha-numbers/numbers" element={<NumbersLearnView />} />
              {/* Fluxo de Treino: Seleção e Exercício */}
              <Route path="/english/alpha-numbers/exercises/:mode" element={<ExerciseSelectionView />} />
              <Route path="/english/alpha-numbers/exercise/:mode/:index" element={<AlphaNumbersExerciseView />} />
              
              {/* IA Inglês */}
              <Route path="/english/ai-hub" element={<AiHubView />} />
              <Route path="/english/ai-chat/free" element={<AiChatFreeView />} />
              <Route path="/english/ai-chat/tasks" element={<AiTaskSelectionView />} />
              <Route path="/english/ai-chat/tasks/:taskId" element={<AiChatTaskView />} />
              <Route path="/english/ai-voice/free" element={<AiVoiceFreeView />} />
              <Route path="/english/ai-voice/tasks/:taskId" element={<AiVoiceTaskView />} />
              <Route path="/english/ai-voice/tasks" element={<AiVoiceTaskSelectionView />} />
              
              <Route path="/english/trail" element={<TrailView />} />

              <Route path="/fitness" element={<div className="pt-8 text-center text-gray-400">Em breve</div>} />
              <Route path="/finance" element={<div className="pt-8 text-center text-gray-400">Em breve</div>} />
              <Route path="/tasks" element={<div className="pt-8 text-center text-gray-400">Em breve</div>} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </FirstLaunchGuard>
    </HashRouter>
  );
}

export default App;