// src/components/SyncPreferenceGuard.jsx
import React, { useState, useEffect } from 'react';
import { RefreshCw, Zap, CloudOff } from 'lucide-react';
import { db } from '../config/dexieDb';
import { useLanguage } from '../contexts/LanguageContext';

export default function SyncPreferenceGuard({ children }) {
  const { t } = useLanguage();
  const [done, setDone] = useState(localStorage.getItem('lifeaccess_syncpref_set') === 'true');
  const [choice, setChoice] = useState(true);

  useEffect(() => {
    const loadDefault = async () => {
      const settings = await db.appSettings.get(1);
      if (settings?.autoSyncEnabled !== undefined) setChoice(settings.autoSyncEnabled);
    };
    loadDefault();
  }, []);

  const confirmChoice = async (value) => {
    setChoice(value);
    const settings = await db.appSettings.get(1) || { id: 1 };
    settings.autoSyncEnabled = value;
    await db.appSettings.put(settings);
    localStorage.setItem('lifeaccess_syncpref_set', 'true');
    setDone(true);
  };

  if (done) return children;

  return (
    <div className="fixed inset-0 bg-gray-950 text-white flex flex-col p-6 items-center justify-center z-[9998] animate-fade-in">
      <div className="absolute top-32 -right-20 w-56 h-56 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30">
        <RefreshCw size={36} className="text-blue-400" />
      </div>

      <h1 className="text-2xl font-black mb-3 text-center z-10">
        {t('sync.onboardTitle', 'Sincronização automática')}
      </h1>
      <p className="text-gray-400 text-center mb-10 z-10 max-w-sm text-sm leading-relaxed">
        {t('sync.onboardDesc', 'Se você conectar sua conta Google, o LifeAccess pode enviar seu progresso para a nuvem automaticamente a cada poucos minutos, sempre que algo relevante for concluído ou alterado (exercícios, finanças, tarefas). Você pode mudar isso depois em Configurações.')}
      </p>

      <div className="w-full max-w-sm space-y-4 z-10">
        <button
          onClick={() => confirmChoice(true)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-4 rounded-2xl flex items-center gap-3 transition-colors shadow-lg"
        >
          <Zap size={20} />
          <div className="text-left">
            <p className="font-black">{t('sync.enableBtn', 'Ativar sincronização automática')}</p>
            <p className="text-[11px] text-blue-100 font-medium">{t('sync.enableSub', 'Recomendado')}</p>
          </div>
        </button>

        <button
          onClick={() => confirmChoice(false)}
          className="w-full bg-gray-800 border-2 border-gray-700 hover:border-gray-600 text-white font-bold p-4 rounded-2xl flex items-center gap-3 transition-colors"
        >
          <CloudOff size={20} className="text-gray-400" />
          <div className="text-left">
            <p className="font-black">{t('sync.disableBtn', 'Prefiro sincronizar manualmente')}</p>
            <p className="text-[11px] text-gray-400 font-medium">{t('sync.disableSub', 'Você poderá enviar/baixar quando quiser')}</p>
          </div>
        </button>
      </div>
    </div>
  );
}