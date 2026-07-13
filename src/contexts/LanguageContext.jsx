import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../config/dexieDb';
import { translations } from '../locales/translations';
import { registerLanguageActivity as registerLanguageActivityDb } from '../utils/languageManager';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [uiLang, setUiLang] = useState('pt'); // Padrão é PT
  const [isFirstAccess, setIsFirstAccess] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  // ==========================================
  // CORREÇÃO CRÍTICA DA OFENSIVA DE IDIOMAS
  // ==========================================
  // Antes, a ofensiva vivia em um useState local, atualizado manualmente
  // apenas dentro da função registerLanguageActivity() do contexto. Isso
  // criava uma dependência frágil: qualquer inconsistência na tabela do
  // Dexie (ex: schema não migrado corretamente em alguns navegadores) fazia
  // a UI mostrar sempre o valor antigo/travado, mesmo que o registro no
  // banco estivesse correto (ou não).
  //
  // Agora a ofensiva é lida diretamente do Dexie com useLiveQuery — o
  // MESMO padrão já usado e comprovadamente funcional no módulo de Fitness
  // (db.fitnessStreak via useLiveQuery em FitnessDashboard/SettingsView).
  // Isso garante que, sempre que registerLanguageActivity() gravar um novo
  // valor no banco, TODA a UI que usa este contexto reflita o valor real
  // e atual automaticamente, sem depender de nenhum "setState" manual.
  const languageStreakRecord = useLiveQuery(() => db.languageStreak.get(1), [], undefined);
  const languageStreak = languageStreakRecord?.streak || 0;

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

      // Garante que o registro de ofensiva de idiomas exista. A leitura em
      // si já é feita de forma reativa acima via useLiveQuery — aqui só
      // garantimos que o registro inicial (id: 1) seja criado se for a
      // primeira vez que o app abre neste dispositivo.
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
    loadSettings();
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

  // LÓGICA DE OFENSIVA (STREAK) — delega para a tabela dedicada languageStreak.
  // Não precisa mais chamar setState manualmente: como a leitura acima é
  // reativa (useLiveQuery), assim que o .put() dentro de
  // registerLanguageActivityDb() terminar, o valor na tela atualiza sozinho.
  const registerLanguageActivity = async () => {
    const result = await registerLanguageActivityDb();
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
      languageStreak, isStreakActiveToday, registerLanguageActivity // <- Exportamos a variável
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook customizado para usarmos nas telas mais facilmente
export const useLanguage = () => useContext(LanguageContext);