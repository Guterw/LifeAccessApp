import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/dexieDb';
import { translations } from '../locales/translations';
import { registerLanguageActivity as registerLanguageActivityDb } from '../utils/languageManager';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [uiLang, setUiLang] = useState('pt'); // Padrão é PT
  const [isFirstAccess, setIsFirstAccess] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [languageStreak, setLanguageStreak] = useState(0);
  
  // Quando o app abre, ele lê o DexieDB para ver as configurações
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await db.appSettings.get(1);
      if (settings) {
        setUiLang(settings.uiLanguage);
        setIsFirstAccess(settings.isFirstAccess);
        setUserName(settings.userName || '');
      } else {
        await db.appSettings.put({ 
          id: 1, uiLanguage: 'pt', isFirstAccess: true, userName: '' 
        });
      }

      // OFENSIVA DE IDIOMAS: agora vive em tabela dedicada (languageStreak),
      // no mesmo padrão do Fitness (fitnessStreak). Isso é mais resistente
      // a corridas de escrita e a sobrescritas parciais do que um campo
      // solto dentro de appSettings.
      const streakRecord = await db.languageStreak.get(1);
      if (streakRecord) {
        setLanguageStreak(streakRecord.streak || 0);
      } else {
        await db.languageStreak.put({ id: 1, streak: 0, lastLanguageActivity: null });
        setLanguageStreak(0);
      }

      setIsLoading(false);
    };
    loadSettings();
  }, []);

  // Função para mudar o idioma e salvar no banco
  const changeLanguage = async (langCode) => {
    setUiLang(langCode);
    await db.appSettings.update(1, { uiLanguage: langCode });
  };

  // Função para finalizar o Primeiro Acesso (esconde a tela de boas-vindas)
  const finishOnboarding = async (name) => {
    setUserName(name);
    setIsFirstAccess(false);
    await db.appSettings.update(1, { isFirstAccess: false, userName: name });
  };

  // LÓGICA DE OFENSIVA (STREAK) — delega para a tabela dedicada languageStreak
  const registerLanguageActivity = async () => {
    const result = await registerLanguageActivityDb();
    setLanguageStreak(result.newStreak);
    return result;
  };

  // A função T() é quem vai traduzir os textos nas telas. 
  // Ex: t('home.greeting') -> "Bem-vindo,"
  // Aceita um segundo parâmetro opcional de fallback: t('chave', 'Texto padrão')
  const t = (path, fallback) => {
    const keys = path.split('.');
    let current = translations[uiLang] || translations['pt'];
    
    for (const key of keys) {
      if (current[key] === undefined) return fallback !== undefined ? fallback : path; // Se não achar a tradução, usa o fallback ou devolve a chave
      current = current[key];
    }
    return current;
  };

  if (isLoading) return <div className="min-h-screen bg-gray-900"></div>; // Tela preta rápida enquanto carrega o DB

  return (
    <LanguageContext.Provider value={{ 
      uiLang, changeLanguage, isFirstAccess, finishOnboarding, t, userName, 
      languageStreak, registerLanguageActivity
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook customizado para usarmos nas telas mais facilmente
export const useLanguage = () => useContext(LanguageContext);