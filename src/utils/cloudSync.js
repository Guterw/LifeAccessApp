// src/utils/cloudSync.js
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { dbFirestore } from '../config/firebaseConfig';
import { db } from '../config/dexieDb';

/**
 * PUSH: Pega tudo do Dexie local e sobe para o Firebase
 */
export const pushToCloud = async (uid) => {
  try {
    const data = {};
    for (const table of db.tables) {
      data[table.name] = await table.toArray();
    }
    
    // Transformamos em String JSON para driblar limites de aninhamento do Firebase
    const stringifiedData = JSON.stringify(data);
    
    // Cria ou atualiza o documento com o ID (uid) do usuário
    const userRef = doc(dbFirestore, 'users_backup', uid);
    await setDoc(userRef, {
      backup: stringifiedData,
      lastSync: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao subir para a nuvem:", error);
    throw error;
  }
};

/**
 * PULL: Baixa da nuvem e injeta no Dexie local
 */
export const pullFromCloud = async (uid) => {
  try {
    const userRef = doc(dbFirestore, 'users_backup', uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const { backup } = docSnap.data();
      if (backup) {
        const data = JSON.parse(backup);
        
        // Abre uma transação no Dexie para substituir os dados locais com segurança
        await db.transaction('rw', db.tables, async () => {
          for (const table of db.tables) {
            if (data[table.name]) {
              await table.clear();
              await table.bulkAdd(data[table.name]);
            }
          }
        });
        return true; // Tinha backup e puxou com sucesso
      }
    }
    return false; // Usuário novo, não tinha backup na nuvem
  } catch (error) {
    console.error("Erro ao puxar da nuvem:", error);
    throw error;
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