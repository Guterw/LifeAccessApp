// src/utils/healthSync.js
//
// IMPORTANTE: Um app web (PWA) rodando dentro do navegador NÃO tem acesso
// direto à API nativa do app "Fitness"/Health do iPhone ou Google Fit — isso
// exige empacotamento nativo (ex: Capacitor + plugin de saúde). Este módulo
// expõe o ponto de integração correto (window.LifeAccessHealthBridge) para
// quando o app for empacotado dessa forma. Por segurança, TODO valor vindo
// de qualquer fonte (nativa ou simulada) passa por um limite (clamp) sensato,
// porque um app de saúde do sistema pode devolver leituras erradas/absurdas
// (ex: 5000 kcal em um clique) e isso não pode contaminar o total do usuário.
import { db } from '../config/dexieDb';

const hasNativeHealthBridge = () =>
  typeof window !== 'undefined' && !!window.LifeAccessHealthBridge;

export const isHealthBridgeNative = () => hasNativeHealthBridge();

// Limites de segurança para uma única sincronização diária de uma pessoa comum.
// Mesmo um atleta de alta performance raramente ultrapassa isso em um dia.
const MAX_REALISTIC_STEPS_PER_DAY = 25000;
const MAX_REALISTIC_CALORIES_PER_DAY = 1200;

const clamp = (value, max) => {
  const num = Number(value) || 0;
  if (num < 0) return 0;
  return Math.min(num, max);
};

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

// Traz dados do app de saúde do sistema (passos e calorias de hoje).
// Idempotente: se já sincronizou hoje, não soma calorias de novo.
// Todo valor é limitado (clamp) a uma faixa humanamente realista antes de
// ser somado, para blindar contra leituras bugadas do app nativo.
export const pullHealthData = async () => {
  let data;
  let simulated = false;
  let wasClamped = false;

  const profile = await db.fitnessProfile.get(1) || { id: 1, caloriesBurnedTotal: 0 };
  const todayKeyStr = new Date().toISOString().split('T')[0];
  const alreadySyncedToday = profile.lastHealthSyncDate === todayKeyStr;

  if (hasNativeHealthBridge()) {
    const raw = await window.LifeAccessHealthBridge.getTodayStats();
    const rawSteps = Number(raw?.steps) || 0;
    const rawCalories = Number(raw?.caloriesBurned) || 0;

    const steps = clamp(rawSteps, MAX_REALISTIC_STEPS_PER_DAY);
    const caloriesBurned = clamp(rawCalories, MAX_REALISTIC_CALORIES_PER_DAY);

    wasClamped = steps !== rawSteps || caloriesBurned !== rawCalories;
    data = { steps, caloriesBurned };
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

  return { ...data, simulated, alreadyCountedToday: alreadySyncedToday, wasClamped };
};

// Envia os dados do LifeAccess (total de calorias queimadas em treinos/jejum)
// de volta para o app de saúde do sistema.
export const pushHealthData = async () => {
  const profile = await db.fitnessProfile.get(1);
  const payload = { caloriesBurnedTotal: profile?.caloriesBurnedTotal || 0 };

  if (hasNativeHealthBridge()) {
    await window.LifeAccessHealthBridge.writeStats(payload);
    return { simulated: false };
  }

  // Sem a ponte nativa, não há como escrever de fato no app de saúde a partir
  // do navegador — apenas confirmamos visualmente que a ação "rodou".
  return { simulated: true };
};

// NOVO: permite ao usuário zerar/corrigir manualmente um valor de calorias
// que tenha entrado errado (ex: de uma sincronização anterior ao clamp),
// sem precisar apagar todos os dados do app.
export const correctCaloriesTotal = async (newTotal) => {
  const profile = await db.fitnessProfile.get(1) || { id: 1 };
  profile.caloriesBurnedTotal = Math.max(0, Number(newTotal) || 0);
  await db.fitnessProfile.put(profile);
  return profile;
};