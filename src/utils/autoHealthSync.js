// src/utils/autoHealthSync.js
import { db } from '../config/dexieDb';
import { pullHealthData, pushHealthData } from './healthSync';

const HEALTH_SYNC_INTERVAL_MS = 30 * 60 * 1000; // a cada 30 minutos
let intervalId = null;

const runHealthSyncIfNeeded = async () => {
  try {
    const profile = await db.fitnessProfile.get(1);
    if (!profile?.isOnboarded) return;
    if (!profile?.autoHealthSyncEnabled) return;

    await pullHealthData();
    await pushHealthData();

    const settings = await db.appSettings.get(1) || { id: 1 };
    settings.healthLastSync = new Date().toISOString();
    await db.appSettings.put(settings);
  } catch (err) {
    console.error('[autoHealthSync] Falha na sincronização automática de saúde:', err);
  }
};

export const startAutoHealthSync = () => {
  if (intervalId) return;
  intervalId = setInterval(runHealthSyncIfNeeded, HEALTH_SYNC_INTERVAL_MS);
  runHealthSyncIfNeeded();
};

export const stopAutoHealthSync = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};