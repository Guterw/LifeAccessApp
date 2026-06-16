import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/dexieDb';
import { translations } from '../locales/translations';

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
        setLanguageStreak(settings.languageStreak || 0); // Puxa do DB
      } else {
        await db.appSettings.put({ 
          id: 1, uiLang: 'pt', isFirstAccess: true, userName: '', languageStreak: 0 
        });
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

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("Seu navegador não suporta notificações.");
      return false;
    }
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  const scheduleDailyReminder = () => {
    // Lógica para agendar os dois momentos:
    // 1. Lembrete durante o dia (se não fez atividade)
    // 2. Lembrete 2h antes de acabar o dia (22h)
    
    // NOTA: Para rodar em background real, o ideal é um Service Worker.
    // Para começar agora, criaremos um "Watcher" que verifica o estado no App.jsx.
  };
  
  // LÓGICA DE OFENSIVA (STREAK)
  const registerLanguageActivity = async () => {
    const settings = await db.appSettings.get(1);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let oldStreak = settings.languageStreak || 0;
    let newStreak = oldStreak;
    let lastDate = settings.lastLanguageActivity ? new Date(settings.lastLanguageActivity) : null;
    let increased = false;

    if (lastDate) {
      lastDate.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

      if (diffDays === 0) {
        return { increased: false, oldStreak, newStreak }; // Já estudou hoje
      } else if (diffDays === 1) {
        newStreak = oldStreak + 1;
        increased = true;
      } else {
        newStreak = 1; // Perdeu a ofensiva, recomeça do 1
        increased = true; 
      }
    } else {
      newStreak = 1; // Primeiro dia de estudo
      increased = true;
    }

    await db.appSettings.update(1, { 
      languageStreak: newStreak, 
      lastLanguageActivity: today.toISOString() 
    });
    setLanguageStreak(newStreak);

    // Agora a função retorna o que aconteceu para a tela poder animar!
    return { increased, oldStreak, newStreak }; 
  };

  // A função T() é quem vai traduzir os textos nas telas. 
  // Ex: t('home.greeting') -> "Bem-vindo,"
  const t = (path) => {
    const keys = path.split('.');
    let current = translations[uiLang] || translations['pt'];
    
    for (const key of keys) {
      if (current[key] === undefined) return path; // Se não achar a tradução, devolve a chave
      current = current[key];
    }
    return current;
  };

  if (isLoading) return <div className="min-h-screen bg-gray-900"></div>; // Tela preta rápida enquanto carrega o DB

  return (
    <LanguageContext.Provider value={{ 
      uiLang, changeLanguage, isFirstAccess, finishOnboarding, t, userName, 
      languageStreak, registerLanguageActivity // NOVOS AQUI
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook customizado para usarmos nas telas mais facilmente
export const useLanguage = () => useContext(LanguageContext);