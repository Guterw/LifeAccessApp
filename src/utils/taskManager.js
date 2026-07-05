// src/utils/taskManager.js
import { db } from '../config/dexieDb';

// Cria uma tarefa/lembrete/treino. Usado pelo Calendário e, no futuro,
// automaticamente pelo módulo de Fitness ao agendar treinos.
export const addTask = async ({ title, date, time = '', type = 'task', notify = true, color = 'purple' }) => {
  return db.tasks.add({
    title,
    date,       // 'YYYY-MM-DD'
    time,       // 'HH:MM' ou ''
    type,       // 'task' | 'reminder' | 'workout'
    done: false,
    notify,
    notified: false,
    color,
    createdAt: new Date().toISOString(),
  });
};

export const updateTask = async (id, changes) => {
  await db.tasks.update(id, changes);
};

export const toggleTaskDone = async (id, done) => {
  await db.tasks.update(id, { done });
};

export const deleteTask = async (id) => {
  await db.tasks.delete(id);
};

// Função pública pronta para o futuro módulo de Fitness chamar:
// ao criar um treino, basta importar addWorkoutReminder(date, title, time)
// e o treino já aparece automaticamente no calendário + notificações.
export const addWorkoutReminder = async (date, title, time = '') => {
  return addTask({ title, date, time, type: 'workout', notify: true, color: 'green' });
};