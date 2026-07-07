// src/utils/healthSync.js
//
// IMPORTANTE: Um app web (PWA) rodando dentro do navegador NÃO tem acesso
// direto à API nativa do Apple Health (HealthKit) ou Google Fit — isso exige
// um empacotamento nativo (ex: Capacitor + um plugin de saúde). Este módulo
// já expõe o ponto de integração correto (window.LifeAccessHealthBridge) para
// quando o app for empacotado dessa forma, e por enquanto usa uma simulação
// seguro para que a interface funcione e o usuário veja o fluxo completo.
import { db } from '../config/dexieDb';

const hasNativeHealthBridge = () =>
  typeof window !== 'undefined' && !!window.LifeAccessHealthBridge;

export const isHealthBridgeNative = () => hasNativeHealthBridge();

// Traz dados do Health/Fit para dentro do LifeAccess (passos e calorias de hoje)
export const pullHealthData = async () => {
  let data;
  let simulated = false;

  if (hasNativeHealthBridge()) {
    data = await window.LifeAccessHealthBridge.getTodayStats();
  } else {
    simulated = true;
    data = {
      steps: Math.floor(2000 + Math.random() * 6000),
      caloriesBurned: Math.floor(150 + Math.random() * 400),
    };
  }

  const profile = await db.fitnessProfile.get(1) || { id: 1, caloriesBurnedTotal: 0 };
  profile.caloriesBurnedTotal = (profile.caloriesBurnedTotal || 0) + (data.caloriesBurned || 0);
  profile.lastHealthSteps = data.steps || 0;
  profile.lastHealthSyncAt = new Date().toISOString();
  await db.fitnessProfile.put(profile);

  return { ...data, simulated };
};

// Envia os dados do LifeAccess (total de calorias queimadas em treinos/jejum)
// de volta para o Health/Fit.
export const pushHealthData = async () => {
  const profile = await db.fitnessProfile.get(1);
  const payload = { caloriesBurnedTotal: profile?.caloriesBurnedTotal || 0 };

  if (hasNativeHealthBridge()) {
    await window.LifeAccessHealthBridge.writeStats(payload);
    return { simulated: false };
  }

  // Sem a ponte nativa, não há como escrever de fato no Health/Fit a partir
  // do navegador — apenas confirmamos visualmente que a ação "rodou".
  return { simulated: true };
};