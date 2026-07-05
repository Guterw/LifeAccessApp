// src/utils/cloudSync.js
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { dbFirestore } from '../config/firebaseConfig';
import { db } from '../config/dexieDb';
import { repairUserProfile } from './xpManager';

/**
 * Verifica se já existe um backup na nuvem para este uid, SEM baixar
 * nem sobrescrever nada. Usado antes de decidir se deve subir ou puxar.
 */
export const hasCloudBackup = async (uid) => {
  try {
    const userRef = doc(dbFirestore, 'users_backup', uid);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() && !!docSnap.data()?.backup;
  } catch (error) {
    console.error("Erro ao verificar backup na nuvem:", error);
    // Em caso de dúvida (erro de rede, regra do Firestore, etc.),
    // tratamos como "não sabemos" para não arriscar sobrescrever nada.
    throw error;
  }
};

/**
 * Retorna a data do último backup salvo na nuvem (ou null se não existir).
 * Útil para mostrar ao usuário "seu último backup foi em: ..." antes de
 * qualquer ação que possa substituir dados.
 */
export const getCloudLastSync = async (uid) => {
  try {
    const userRef = doc(dbFirestore, 'users_backup', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data()?.lastSync || null;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar data do último backup:", error);
    return null;
  }
};

/**
 * PUSH: Pega tudo do Dexie local e sobe para o Firebase.
 * Antes de subir, repara o userProfile local (garante que o level
 * enviado para a nuvem está correto, mesmo que estivesse desalinhado).
 */
export const pushToCloud = async (uid) => {
  try {
    await repairUserProfile();

    const data = {};
    for (const table of db.tables) {
      data[table.name] = await table.toArray();
    }

    const stringifiedData = JSON.stringify(data);

    const userRef = doc(dbFirestore, 'users_backup', uid);
    await setDoc(userRef, {
      backup: stringifiedData,
      lastSync: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error("Erro ao subir para a nuvem:", error);
    // Relança com mensagem clara para a UI poder exibir o motivo real
    // (ex: regras do Firestore bloqueando, sem internet, etc.)
    throw new Error(error?.message || "Erro desconhecido ao subir dados para a nuvem.");
  }
};

/**
 * PULL: Baixa da nuvem e injeta no Dexie local.
 * Após baixar, repara o userProfile (garante consistência level/xp
 * mesmo que o backup remoto tenha sido salvo por uma versão antiga do app).
 */
export const pullFromCloud = async (uid) => {
  try {
    const userRef = doc(dbFirestore, 'users_backup', uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const { backup } = docSnap.data();
      if (backup) {
        const data = JSON.parse(backup);

        await db.transaction('rw', db.tables, async () => {
          for (const table of db.tables) {
            if (data[table.name]) {
              await table.clear();
              await table.bulkAdd(data[table.name]);
            }
          }
        });

        await repairUserProfile();
        return true; // Tinha backup e puxou com sucesso
      }
    }
    return false; // Usuário novo, não tinha backup na nuvem
  } catch (error) {
    console.error("Erro ao puxar da nuvem:", error);
    throw new Error(error?.message || "Erro desconhecido ao puxar dados da nuvem.");
  }
};

/**
 * DELETE: Apaga o documento do usuário do Firebase
 */
export const deleteCloudData = async (uid) => {
  try {
    const userRef = doc(dbFirestore, 'users_backup', uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Erro ao deletar da nuvem:", error);
    throw error;
  }
};