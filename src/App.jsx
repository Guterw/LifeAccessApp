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

// Principais Telas
import WelcomeView from './features/onboarding/views/WelcomeView';
import SyncChoiceView from './features/onboarding/views/SyncChoiceView';
import NameView from './features/onboarding/views/NameView';
import SyncPrefStepView from './features/onboarding/views/SyncPrefStepView'; // <-- NOVA ETAPA
import SettingsView from './features/settings/views/SettingsView';
import MainDashboard from './features/dashboard/views/MainDashboard';
import LanguagesDashboard from './features/languages/views/LanguagesDashboard';

// Módulo de Inglês
import EnglishDashboard from './features/languages/english/views/EnglishDashboard';
import StatsView from './features/languages/english/views/StatsView';

// Módulo de Vocabularios do Inglês
import VocabulariesMenu from './features/languages/english/views/vocabularies/VocabulariesMenu';
import LevelListView from './features/languages/english/views/vocabularies/vocab-normal/LevelListView';
import LevelView from './features/languages/english/views/vocabularies/vocab-normal/LevelView';
import LevelGroupView from './features/languages/english/views/vocabularies/vocab-normal/LevelGroupView';

import VocabSpeechLevelListView from './features/languages/english/views/vocabularies/vocab-speech/LevelListView';
import VocabSpeechLevelGroupView from './features/languages/english/views/vocabularies/vocab-speech/LevelGroupView';
import VocabSpeechView from './features/languages/english/views/vocabularies/vocab-speech/VocabSpeechView';

import VocabReverseLevelListView from './features/languages/english/views/vocabularies/vocab-reverse/LevelListView';
import VocabReverseLevelGroupView from './features/languages/english/views/vocabularies/vocab-reverse/LevelGroupView';
import VocabReverseView from './features/languages/english/views/vocabularies/vocab-reverse/VocabReverseView';

// Módulo Alpha-Numbers do Inglês
import AlphaNumbersMenu from './features/languages/english/views/alpha-numbers/AlphaNumbersMenu';
import AlphabetLearnView from './features/languages/english/views/alpha-numbers/AlphabetLearnView';
import NumbersLearnView from './features/languages/english/views/alpha-numbers/NumbersLearnView';
import ExerciseSelectionView from './features/languages/english/views/alpha-numbers/ExerciseSelectionView';
import AlphaNumbersExerciseView from './features/languages/english/views/alpha-numbers/AlphaNumbersExerciseView';

// IA de Inglês Área
import AiHubView from './features/languages/english/views/AiHubView';
import AiChatFreeView from './features/languages/english/views/ai-chat/AiChatFreeView';
import AiTaskSelectionView from './features/languages/english/views/ai-chat/AiTaskSelectionView';
import AiChatTaskView from './features/languages/english/views/ai-chat/AiChatTaskView';
import AiVoiceFreeView from './features/languages/english/views/ai-voice/AiVoiceFreeView';
import AiVoiceTaskView from './features/languages/english/views/ai-voice/AiVoiceTaskView';
import AiVoiceTaskSelectionView from './features/languages/english/views/ai-voice/AiVoiceTaskSelectionView';
import TrailView from './features/languages/english/views/TrailView';

// Explained Module do Inglês
import ExplainedLessonListView from './features/languages/english/views/explained/ExplainedLessonListView';
import ExplainedLessonGroupView from './features/languages/english/views/explained/ExplainedLessonGroupView';
import ExplainedLessonView from './features/languages/english/views/explained/ExplainedLessonView';

// Módulo de Ditado do Inglês
import DictationSelectionView from './features/languages/english/views/dictation/DictationSelectionView';
import DictationExerciseView from './features/languages/english/views/dictation/DictationExerciseView';

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

import { checkWaterReminder } from './utils/notificationService';

// Módulo Treino Personalizado do Módulo Fitness
import CustomWorkoutPlanView from './features/fitness/views/customPlan/CustomWorkoutPlanView';

// Módulo Dieta do Módulo Fitness
import DietOnboardingView from './features/fitness/views/diet/DietOnboardingView';
import DietDashboardView from './features/fitness/views/diet/DietDashboardView';
import FoodScannerView from './features/fitness/views/diet/FoodScannerView';
import DietReportView from './features/fitness/views/diet/DietReportView';
import DietProfileEditView from './features/fitness/views/diet/DietProfileEditView';
import DietSuggestionView from './features/fitness/views/diet/DietSuggestionView';

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

        if (settings.notifWaterReminders !== false) {
          try {
            const dietProfile = await db.dietProfile.get(1);
            if (dietProfile?.isOnboarded) {
              const { getWaterTotalForDate } = await import('./utils/dietManager');
              const { toDateKey } = await import('./utils/calendarUtils');
              const waterToday = await getWaterTotalForDate(toDateKey(new Date()));
              checkWaterReminder(dietProfile, waterToday);
            }
          } catch (err) {
            console.error('[App] Erro ao checar lembrete de água:', err);
          }
        }
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
          <div 
            className="min-h-screen text-white font-sans selection:bg-blue-500/30 relative"
            style={{
              backgroundColor: '#030712',
              backgroundImage: `
                radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37, 99, 235, 0.15), transparent),
                radial-gradient(ellipse 60% 40% at 85% 30%, rgba(147, 51, 234, 0.08), transparent)
              `,
              backgroundAttachment: 'fixed',
            }}
          >
            <div className="max-w-md mx-auto w-full px-4 pb-28">
              <Routes>
                {/* Rotas Principais */}
                <Route path="/" element={<MainDashboard />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="/languages" element={<LanguagesDashboard />} />
                
                {/* Rotas do Módulo de Inglês */}
                <Route path="/english" element={<EnglishDashboard />} />
                <Route path="/english/trail" element={<TrailView />} />                
                <Route path="/english/stats" element={<StatsView />} />

                {/* Vocabularios Normais de Inglês */}
                <Route path="/english/vocabularies" element={<VocabulariesMenu />} />                
                <Route path="/english/vocabularies/vocab-normal/levels" element={<LevelListView />} />
                <Route path="/english/vocabularies/vocab-normal/levels/group/:groupName" element={<LevelGroupView />} />
                <Route path="/english/vocabularies/vocab-normal/level/:id" element={<LevelView />} />
                
                {/* Vocabulário com Voz de Inglês*/}
                <Route path="/english/vocabularies/vocab-speech/levels" element={<VocabSpeechLevelListView />} />
                <Route path="/english/vocabularies/vocab-speech/levels/group/:groupName" element={<VocabSpeechLevelGroupView />} />
                <Route path="/english/vocabularies/vocab-speech/level/:id" element={<VocabSpeechView />} />

                {/* Vocabulário Inverso de Inglês */}
                <Route path="/english/vocabularies/vocab-reverse/levels" element={<VocabReverseLevelListView />} />
                <Route path="/english/vocabularies/vocab-reverse/levels/group/:groupName" element={<VocabReverseLevelGroupView />} />
                <Route path="/english/vocabularies/vocab-reverse/level/:id" element={<VocabReverseView />} />

                {/* Fundamentos: Alfabeto e Números  de Inglês */}
                <Route path="/english/alpha-numbers" element={<AlphaNumbersMenu />} />
                <Route path="/english/alpha-numbers/alphabet" element={<AlphabetLearnView />} />
                <Route path="/english/alpha-numbers/numbers" element={<NumbersLearnView />} />
                <Route path="/english/alpha-numbers/exercises/:mode" element={<ExerciseSelectionView />} />
                <Route path="/english/alpha-numbers/exercise/:mode/:index" element={<AlphaNumbersExerciseView />} />
                
                {/* IA de Inglês */}
                <Route path="/english/ai-hub" element={<AiHubView />} />
                <Route path="/english/ai-chat/free" element={<AiChatFreeView />} />
                <Route path="/english/ai-chat/tasks" element={<AiTaskSelectionView />} />
                <Route path="/english/ai-chat/tasks/:taskId" element={<AiChatTaskView />} />
                <Route path="/english/ai-voice/free" element={<AiVoiceFreeView />} />
                <Route path="/english/ai-voice/tasks/:taskId" element={<AiVoiceTaskView />} />
                <Route path="/english/ai-voice/tasks" element={<AiVoiceTaskSelectionView />} />
              
                {/* Explained Module de Inglês */}
                <Route path="/english/explained" element={<ExplainedLessonListView />} />
                <Route path="/english/explained/group/:groupName" element={<ExplainedLessonGroupView />} />
                <Route path="/english/explained/:lessonId" element={<ExplainedLessonView />} />
              
                {/* Ditado de Texto Corrido de Inglês */}
                <Route path="/english/dictation" element={<DictationSelectionView />} />
                <Route path="/english/dictation/:textId" element={<DictationExerciseView />} />

                {/* Fitness */}
                <Route path="/fitness" element={<FitnessDashboard />} />
                <Route path="/fitness/profile" element={<FitnessProfileView />} />
                <Route path="/fitness/stats" element={<FitnessStatsView />} />
                <Route path="/fitness/fasting" element={<FastingView />} />
                <Route path="/fitness/workouts" element={<FitnessWorkoutsView />} />
                <Route path="/fitness/group/:groupId" element={<FitnessGroupView />} />
                <Route path="/fitness/group/:groupId/exercise/:exerciseId" element={<FitnessExerciseView />} />
                {/* Módulo Dieta do Fitness */}
                <Route path="/fitness/diet" element={<DietDashboardView />} />
                <Route path="/fitness/diet/onboarding" element={<DietOnboardingView />} />
                <Route path="/fitness/diet/scanner" element={<FoodScannerView />} />
                <Route path="/fitness/diet/report" element={<DietReportView />} />
                <Route path="/fitness/diet/edit" element={<DietProfileEditView />} />
                <Route path="/fitness/diet/suggestions" element={<DietSuggestionView />} />
                {/* Módulo Treino Personalizado do Fitness */}
                <Route path="/fitness/custom-plan" element={<CustomWorkoutPlanView />} />
                
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