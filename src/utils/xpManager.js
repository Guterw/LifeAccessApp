import { db } from '../config/dexieDb';

export const addXP = async (amount = 20) => {
  try {
    // Busca o perfil (ID 1 é o nosso usuário único no dispositivo)
    let profile = await db.userProfile.get(1);
    
    if (!profile) {
      profile = { id: 1, currentLevel: 0, totalXp: 0 };
    }

    const previousLevel = profile.currentLevel;
    
    // Adiciona o XP e calcula o novo nível (a cada 100 XP = 1 Nível)
    profile.totalXp += amount;
    profile.currentLevel = Math.floor(profile.totalXp / 100);
    
    await db.userProfile.put(profile);

    // Retorna os dados para sabermos se ele subiu de nível nesta rodada
    return {
      ...profile,
      leveledUp: profile.currentLevel > previousLevel
    };
  } catch (err) {
    console.error("Erro ao gerenciar XP:", err);
    return null;
  }
};