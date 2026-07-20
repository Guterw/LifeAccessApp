import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../config/dexieDb';
import { translations } from '../locales/translations';
import { registerLanguageActivity as registerLanguageActivityDb } from '../utils/languageManager';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  // NOVO: leitura reativa do appSettings via useLiveQuery, igual ao
  // languageStreakRecord. Isso garante que, quando o pullFromCloud (manual
  // ou automático) sobrescrever o Dexie, a UI (userName, uiLang, etc.)
  // atualiza sozinha, sem depender de um reload da página.
  const appSettingsRecord = useLiveQuery(() => db.appSettings.get(1), [], undefined);

  const uiLang = appSettingsRecord?.uiLanguage || 'pt';
  const isFirstAccess = appSettingsRecord?.isFirstAccess ?? true;
  const userName = appSettingsRecord?.userName || '';

  const languageStreakRecord = useLiveQuery(() => db.languageStreak.get(1), [], undefined);
  const languageStreak = languageStreakRecord?.streak || 0;

  // Garante que o registro appSettings exista na primeira abertura do app
  useEffect(() => {
    const ensureSettings = async () => {
      const settings = await db.appSettings.get(1);
      if (!settings) {
        await db.appSettings.put({
          id: 1, uiLanguage: 'pt', isFirstAccess: true, userName: ''
        });
      }
      try {
        const streakRecord = await db.languageStreak.get(1);
        if (!streakRecord) {
          await db.languageStreak.put({ id: 1, streak: 0, lastLanguageActivity: null });
        }
      } catch (err) {
        console.error('[LanguageContext] Erro ao garantir registro de languageStreak:', err);
      }
      setIsLoading(false);
    };
    ensureSettings();
  }, []);

  const isStreakActiveToday = React.useMemo(() => {
    if (!languageStreakRecord?.lastLanguageActivity) return false;
    const lastDate = new Date(languageStreakRecord.lastLanguageActivity);
    const today = new Date();
    return (
      lastDate.getDate() === today.getDate() &&
      lastDate.getMonth() === today.getMonth() &&
      lastDate.getFullYear() === today.getFullYear()
    );
  }, [languageStreakRecord?.lastLanguageActivity]);

  const changeLanguage = async (langCode) => {
    await db.appSettings.update(1, { uiLanguage: langCode });
  };

  const finishOnboarding = async (name) => {
    await db.appSettings.update(1, { isFirstAccess: false, userName: name });
  };

  const updateUserName = async (name) => {
    const trimmed = String(name || '').trim();
    if (!trimmed) return;
    await db.appSettings.update(1, { userName: trimmed });
  };

  const registerLanguageActivity = async () => {
    return await registerLanguageActivityDb();
  };

  const t = (path, fallback) => {
    const keys = path.split('.');
    let current = translations[uiLang] || translations['pt'];
    for (const key of keys) {
      if (current[key] === undefined) return fallback !== undefined ? fallback : path;
      current = current[key];
    }
    return current;
  };

  if (isLoading) return <div className="min-h-screen bg-gray-900"></div>;

  return (
    <LanguageContext.Provider value={{ 
      uiLang, changeLanguage, isFirstAccess, finishOnboarding, t, userName, 
      languageStreak, isStreakActiveToday, registerLanguageActivity, updateUserName
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook customizado para usarmos nas telas mais facilmente
export const useLanguage = () => useContext(LanguageContext);