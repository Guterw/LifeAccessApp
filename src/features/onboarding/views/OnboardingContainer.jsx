// Exemplo de como seu gerenciador de onboarding deve ficar:
import React, { useState } from 'react';
import WelcomeView from './views/WelcomeView';
import SyncChoiceView from './views/SyncChoiceView';
import NameView from './views/NameView';

export default function OnboardingContainer() {
  const [step, setStep] = useState(1);

  return (
    <>
      {/* Passo 1: Idioma */}
      {step === 1 && <WelcomeView onNext={() => setStep(2)} />}
      
      {/* Passo 2: Google vs Offline */}
      {step === 2 && <SyncChoiceView onOffline={() => setStep(3)} />}
      
      {/* Passo 3: Nome (Apenas se escolheu offline) */}
      {step === 3 && <NameView />}
    </>
  );
}