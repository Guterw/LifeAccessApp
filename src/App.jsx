// src/App.jsx
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { checkAllNotifications } from './utils/notificationService';
import { db } from './config/dexieDb';
import { repairUserProfile } from './utils/xpManager';
import BottomNav from './components/BottomNav';
import { useLanguage } from './contexts/LanguageContext';
import FirstLaunchGuard from './components/FirstLaunchGuard';
import SyncPreferenceGuard from './components/SyncPreferenceGuard';
import { startAutoSync } from './utils/autoSync';
import { startAutoHealthSync } from './utils/autoHealthSync';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebaseConfig';

import WelcomeView from './features/onboarding/views/WelcomeView';
import SyncChoiceView from './features/onboarding/views/SyncChoiceView';
import NameView from './features/onboarding/views/NameView';
import SyncPrefStepView from './features/onboarding/views/SyncPrefStepView'; // <-- NOVA ETAPA

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

// Módulo Calendário
import CalendarView from './features/calendar/views/CalendarView';

// Módulo Financias
import { checkTaskNotifications } from './utils/taskNotifications';
import FinanceView from './features/finance/views/FinanceView';
import FinanceTransactionsView from './features/finance/views/FinanceTransactionsView';

// Módulo Fitness
import FitnessDashboard from './features/fitness/views/FitnessDashboard';
import FitnessGroupView from './features/fitness/views/FitnessGroupView';
import FitnessExerciseView from './features/fitness/views/FitnessExerciseView';
import FitnessProfileView from './features/fitness/views/FitnessProfileView';
import FitnessStatsView from './features/fitness/views/FitnessStatsView';
import FastingView from './features/fitness/views/FastingView';
import FitnessWorkoutsView from './features/fitness/views/FitnessWorkoutsView';

function App() {
  const { isFirstAccess } = useLanguage();
  const [onboardingStep, setOnboardingStep] = useState(1);

  useEffect(() => {
    repairUserProfile();

    // Sincronização automática de saúde (Health/Fit) — roda independente de login,
    // pois é uma sincronização local/estimada no próprio dispositivo.
    startAutoHealthSync();

    // Sincronização automática com a nuvem — só ativa de fato quando há uma
    // conta Google conectada (checado dentro de autoSync.js a cada ciclo).
    // Reagimos ao login/logout para (re)iniciar o pull inicial imediatamente.
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) startAutoSync();
    });
    startAutoSync();

    const interval = setInterval(async () => {
      const settings = await db.appSettings.get(1);
      if (settings) {
        checkAllNotifications(settings, [], {});
      }
    }, 1000 * 60 * 30);

    // NOVO: checagem de tarefas/lembretes a cada 1 minuto (mais preciso)
    checkTaskNotifications();
    const taskInterval = setInterval(() => {
      checkTaskNotifications();
    }, 1000 * 60);

    return () => {
      clearInterval(interval);
      clearInterval(taskInterval);
      unsubscribeAuth();
    };
  }, []);

  // ==========================================
  // FLUXO DE ONBOARDING ATUALIZADO
  // Passo 1: Idioma
  // Passo 2: Google vs Offline
  //   -> Se escolher Google: login + pull/push da nuvem, depois vai para o Passo 4
  //      (escolha de sincronização automática), SEM recarregar a página no meio do caminho.
  //   -> Se escolher Offline: vai para o Passo 3 (digitar nome) e finaliza direto,
  //      já com autoSyncEnabled = false (não tem nuvem pra sincronizar).
  // Passo 3: Digitar Nome (apenas fluxo offline)
  // Passo 4: Escolha de Sincronização Automática (apenas fluxo Google)
  // ==========================================
  if (isFirstAccess) {
    if (onboardingStep === 1) return <WelcomeView onNext={() => setOnboardingStep(2)} />;
    if (onboardingStep === 2) {
      return (
        <SyncChoiceView
          onOffline={() => setOnboardingStep(3)}
          onGoogleSuccess={() => setOnboardingStep(4)}
        />
      );
    }
    if (onboardingStep === 3) return <NameView />;
    if (onboardingStep === 4) return <SyncPrefStepView />;
  }

  return (
    <HashRouter>
      {/* Guardião de Permissões: Aparece só DEPOIS do Onboarding e ANTES de liberar o app principal */}
      <FirstLaunchGuard>
        <SyncPreferenceGuard>
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

              {/* Fitness */}
              <Route path="/fitness" element={<FitnessDashboard />} />
              <Route path="/fitness/profile" element={<FitnessProfileView />} />
              <Route path="/fitness/stats" element={<FitnessStatsView />} />
              <Route path="/fitness/fasting" element={<FastingView />} />
              <Route path="/fitness/workouts" element={<FitnessWorkoutsView />} />
              <Route path="/fitness/group/:groupId" element={<FitnessGroupView />} />
              <Route path="/fitness/group/:groupId/exercise/:exerciseId" element={<FitnessExerciseView />} />

              {/* Financias */}
              <Route path="/finance" element={<FinanceView />} />
              <Route path="/finance/transactions" element={<FinanceTransactionsView />} />
              
              {/* Calendario */}
              <Route path="/calendar" element={<CalendarView />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
        </SyncPreferenceGuard>
      </FirstLaunchGuard>
    </HashRouter>
  );
}

export default App;