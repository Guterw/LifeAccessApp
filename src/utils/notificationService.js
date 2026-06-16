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