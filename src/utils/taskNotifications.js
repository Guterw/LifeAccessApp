// src/utils/taskNotifications.js
import { db } from '../config/dexieDb';
import { sendNotification } from './notificationService';
import { todayKey } from './calendarUtils';

const TYPE_LABELS = {
  task: { icon: '📋', pt: 'Tarefa' },
  reminder: { icon: '🔔', pt: 'Lembrete' },
  workout: { icon: '💪', pt: 'Treino' },
};

export const checkTaskNotifications = async () => {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

  const now = new Date();
  const currentKey = todayKey();
  const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  try {
    const todayTasks = await db.tasks.where('date').equals(currentKey).toArray();

    for (const task of todayTasks) {
      if (task.done || task.notified || task.notify === false) continue;

      const taskTime = task.time && task.time.length === 5 ? task.time : '09:00';

      if (taskTime <= currentHM) {
        const meta = TYPE_LABELS[task.type] || TYPE_LABELS.task;
        sendNotification(`${meta.icon} ${meta.pt}`, task.title);
        await db.tasks.update(task.id, { notified: true });
      }
    }
  } catch (err) {
    console.error('Erro ao checar notificações de tarefas:', err);
  }
};