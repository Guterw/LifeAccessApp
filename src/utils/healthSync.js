// src/utils/healthSync.js
//
// IMPORTANTE: Um app web (PWA) rodando dentro do navegador NÃO tem acesso
// direto à API nativa do Apple Health (HealthKit) ou Google Fit — isso exige
// um empacotamento nativo (ex: Capacitor + um plugin de saúde). Este módulo
// já expõe o ponto de integração correto (window.LifeAccessHealthBridge) para
// quando o app for empacotado dessa forma, e por enquanto usa uma simulação
// determinística e plausível para que a interface funcione.
import { db } from '../config/dexieDb';

const hasNativeHealthBridge = () =>
  typeof window !== 'undefined' && !!window.LifeAccessHealthBridge;

export const isHealthBridgeNative = () => hasNativeHealthBridge();

// Gerador pseudo-aleatório determinístico baseado numa seed (ex: a data do dia).
// Isso evita que os "passos simulados" pareçam irreais/aleatórios a cada clique —
// no mesmo dia, o valor simulado permanece sempre o mesmo, como dados reais seriam.
const seededRandom = (seedStr) => {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

// Traz dados do Health/Fit para dentro do LifeAccess (passos e calorias de hoje).
// Idempotente para o modo simulado: se já sincronizou hoje, não soma calorias de novo.
export const pullHealthData = async () => {
  let data;
  let simulated = false;

  const profile = await db.fitnessProfile.get(1) || { id: 1, caloriesBurnedTotal: 0 };
  const todayKeyStr = new Date().toISOString().split('T')[0];
  const alreadySyncedToday = profile.lastHealthSyncDate === todayKeyStr;

  if (hasNativeHealthBridge()) {
    data = await window.LifeAccessHealthBridge.getTodayStats();
  } else {
    simulated = true;
    const r1 = seededRandom(todayKeyStr + 'steps');
    // Faixa plausível de passos diários (3.000 a 9.000), estável durante o dia
    const steps = Math.round(3000 + r1 * 6000);
    // Calorias derivadas proporcionalmente aos passos (~0.04 kcal por passo),
    // em vez de um número solto e desconectado da quantidade de passos.
    const caloriesBurned = Math.round(steps * 0.04);
    data = { steps, caloriesBurned };
  }

  if (!alreadySyncedToday) {
    profile.caloriesBurnedTotal = (profile.caloriesBurnedTotal || 0) + (data.caloriesBurned || 0);
    profile.lastHealthSyncDate = todayKeyStr;
  }
  profile.lastHealthSteps = data.steps || 0;
  profile.lastHealthSyncAt = new Date().toISOString();
  await db.fitnessProfile.put(profile);

  return { ...data, simulated, alreadyCountedToday: alreadySyncedToday };
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