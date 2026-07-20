// src/utils/notificationService.js

export const sendNotification = (title, body) => {
  if ("Notification" in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/logo192.png' });
  }
};

export const checkAllNotifications = (settings, tasks, fitnessData) => {
  const now = new Date();
  const hour = now.getHours();

  // 1. Lembrete de Idiomas (Existente)
  const lastLang = new Date(settings.lastLanguageActivity);
  if (now.toDateString() !== lastLang.toDateString()) {
    if (hour === 14) sendNotification("Hora do Inglês! 🇬🇧", "Não perca sua ofensiva! Venha praticar.");
    if (hour === 22) sendNotification("Última chance! ⚠️", "Sua ofensiva de idiomas está em risco.");
  }

  // 2. Lembrete de Tarefas / Calendário (Novo)
  // Verifica tarefas pendentes para hoje
  const todayTasks = tasks.filter(t => new Date(t.date).toDateString() === now.toDateString() && !t.done);
  if (todayTasks.length > 0 && hour === 9) { // Lembrete matinal às 09:00
    sendNotification("📅 Sua agenda hoje", `Você tem ${todayTasks.length} tarefas pendentes.`);
  }

  // 3. Lembrete de Fitness (Novo)
  if (fitnessData.needsReminder && hour === 18) { // Lembrete pós-trabalho às 18:00
    sendNotification("💪 Hora de treinar!", "O corpo alcança o que a mente acredita. Vamos ao treino?");
  }
  
  // 4. Lembrete Financeiro (Novo)
  if (fitnessData.duePayments > 0 && now.getDate() === 5) { // Exemplo: Alerta de pagamento todo dia 05
    sendNotification("💳 Atenção financeira", "Você tem pagamentos próximos. Organize-se!");
  }
};

// ==========================================
// LEMBRETE DE ÁGUA (Módulo de Dieta)
// ==========================================
// Dispara notificações em horários estratégicos do dia (11h, 15h, 19h) quando
// o usuário está muito abaixo do ritmo esperado da meta diária de água.
// A ideia não é notificar toda hora, só quando há um atraso relevante em
// relação ao que já deveria ter sido consumido até aquele horário do dia.
//
// dietProfile: precisa ter `waterGoalMl` (meta diária total, em ml).
// waterTotalToday: total já registrado hoje (em ml), vindo de getWaterTotalForDate.
//
// Estratégia: em cada "checkpoint" do dia, esperamos que uma fração da meta
// já tenha sido bebida. Se o usuário está muito abaixo dessa fração, notifica.
const WATER_REMINDER_CHECKPOINTS = [
  { hour: 11, expectedFraction: 0.3 },  // até 11h, esperado ~30% da meta
  { hour: 15, expectedFraction: 0.6 },  // até 15h, esperado ~60% da meta
  { hour: 19, expectedFraction: 0.85 }, // até 19h, esperado ~85% da meta
];

// Margem de tolerância: só notifica se estiver pelo menos 20% abaixo do
// esperado, para não incomodar por pequenas diferenças.
const WATER_REMINDER_TOLERANCE = 0.2;

// Evita notificar mais de uma vez no mesmo checkpoint/dia (mesmo que a
// função seja chamada a cada poucos minutos pelo loop de notificações).
const WATER_REMINDER_STORAGE_KEY = 'lifeaccess_water_reminder_lastcheckpoint';

const getTodayKeySafe = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const checkWaterReminder = (dietProfile, waterTotalToday) => {
  if (!dietProfile?.waterGoalMl) return; // sem meta definida, não há o que checar

  const now = new Date();
  const hour = now.getHours();
  const todayKey = getTodayKeySafe();

  const checkpoint = WATER_REMINDER_CHECKPOINTS.find((cp) => cp.hour === hour);
  if (!checkpoint) return;

  // Já notificamos este checkpoint hoje? Não repete.
  let lastCheckpointInfo = {};
  try {
    lastCheckpointInfo = JSON.parse(localStorage.getItem(WATER_REMINDER_STORAGE_KEY) || '{}');
  } catch (_) {
    lastCheckpointInfo = {};
  }
  const alreadyNotifiedKey = `${todayKey}_${checkpoint.hour}`;
  if (lastCheckpointInfo[alreadyNotifiedKey]) return;

  const expectedMl = dietProfile.waterGoalMl * checkpoint.expectedFraction;
  const shortfall = expectedMl - (waterTotalToday || 0);
  const shortfallRatio = shortfall / dietProfile.waterGoalMl;

  if (shortfallRatio >= WATER_REMINDER_TOLERANCE) {
    const remainingMl = Math.max(0, dietProfile.waterGoalMl - (waterTotalToday || 0));
    const remainingL = (remainingMl / 1000).toFixed(1);
    sendNotification(
      "💧 Hora de beber água!",
      `Você está atrasado na sua meta de hoje. Faltam ~${remainingL}L para atingir o objetivo.`
    );

    // Marca este checkpoint como notificado hoje, e limpa entradas de dias
    // anteriores para o localStorage não crescer indefinidamente.
    const cleaned = {};
    Object.keys(lastCheckpointInfo).forEach((key) => {
      if (key.startsWith(todayKey)) cleaned[key] = lastCheckpointInfo[key];
    });
    cleaned[alreadyNotifiedKey] = true;
    localStorage.setItem(WATER_REMINDER_STORAGE_KEY, JSON.stringify(cleaned));
  }
};