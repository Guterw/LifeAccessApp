// src/utils/xpManager.js
import { db } from '../config/dexieDb';

// Fórmula única e centralizada de cálculo de nível.
// Sempre que alguém precisar saber "qual é o level", deve passar pelo totalXp
// e usar esta função — nunca confiar em um campo `currentLevel` salvo isoladamente,
// pois ele pode ficar desatualizado (import parcial, registro legado, etc.)
export const calculateLevel = (totalXp = 0) => {
  const safeXp = Number(totalXp) || 0;
  return Math.floor(safeXp / 100) + 1;
};

export const addXP = async (amount = 20) => {
  try {
    let profile = await db.userProfile.get(1);

    if (!profile) {
      profile = { id: 1, currentLevel: 1, totalXp: 0 };
    }

    const previousLevel = calculateLevel(profile.totalXp || 0);

    profile.totalXp = (profile.totalXp || 0) + amount;
    profile.currentLevel = calculateLevel(profile.totalXp);

    await db.userProfile.put(profile);

    return {
      ...profile,
      leveledUp: profile.currentLevel > previousLevel
    };
  } catch (err) {
    console.error("Erro ao gerenciar XP:", err);
    return null;
  }
};

// ==========================================
// REPARO AUTOMÁTICO DE PERFIL
// ==========================================
// Corrige qualquer registro de userProfile cujo currentLevel esteja
// desalinhado do totalXp real. Roda de forma barata e segura — não faz
// nada se o registro já estiver correto. Chamada automaticamente ao
// abrir o app (App.jsx) e também após qualquer sincronização/importação,
// para garantir que o "level travado em 1" nunca mais aconteça, mesmo
// para contas que já tinham esse problema antes desta correção.
export const repairUserProfile = async () => {
  try {
    let profile = await db.userProfile.get(1);

    if (!profile) {
      profile = { id: 1, currentLevel: 1, totalXp: 0 };
      await db.userProfile.put(profile);
      return profile;
    }

    const correctLevel = calculateLevel(profile.totalXp || 0);
    if (profile.currentLevel !== correctLevel) {
      profile.currentLevel = correctLevel;
      await db.userProfile.put(profile);
    }
    return profile;
  } catch (err) {
    console.error("Erro ao reparar perfil:", err);
    return null;
  }
};