// src/features/onboarding/views/SyncPrefStepView.jsx
// Etapa 4 do onboarding — só é exibida quando o usuário conectou uma conta
// Google no passo anterior. Pergunta se ele quer sincronização automática
// com a nuvem. Ao confirmar, finaliza o onboarding (isFirstAccess = false).
import React, { useState } from 'react';
import { RefreshCw, Zap, CloudOff } from 'lucide-react';
import { db } from '../../../config/dexieDb';
import { useLanguage } from '../../../contexts/LanguageContext';
import FooterBrand from '../../../components/FooterBrand';

export default function SyncPrefStepView() {
  const { t, userName, finishOnboarding } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);

  const confirmChoice = async (value) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const settings = await db.appSettings.get(1) || { id: 1 };
      settings.autoSyncEnabled = value;
      await db.appSettings.put(settings);

      // Marca que a preferência já foi definida, para o SyncPreferenceGuard
      // (usado fora do onboarding, para contas já existentes) nunca mais perguntar de novo.
      localStorage.setItem('lifeaccess_syncpref_set', 'true');

      // Finaliza o onboarding oficialmente (isFirstAccess = false),
      // preservando o nome que já foi salvo (vindo do Google).
      await finishOnboarding(userName);
    } catch (err) {
      console.error('Erro ao salvar preferência de sincronização:', err);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-950 text-white flex flex-col p-6 items-center justify-center z-[9998] animate-fade-in">
      <div className="absolute top-32 -right-20 w-56 h-56 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30 z-10">
        <RefreshCw size={36} className="text-blue-400" />
      </div>

      <h1 className="text-2xl font-black mb-3 text-center z-10">
        {t('sync.onboardTitle', 'Sincronização automática')}
      </h1>
      <p className="text-gray-400 text-center mb-10 z-10 max-w-sm text-sm leading-relaxed">
        {t('sync.onboardDesc', 'Como você já conectou sua conta Google, o LifeAccess pode enviar seu progresso para a nuvem automaticamente a cada poucos minutos, sempre que algo relevante for concluído ou alterado (exercícios, finanças, tarefas). Você pode mudar isso depois em Configurações.')}
      </p>

      <div className="w-full max-w-sm space-y-4 z-10">
        <button
          onClick={() => confirmChoice(true)}
          disabled={isSaving}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold p-4 rounded-2xl flex items-center gap-3 transition-colors shadow-lg"
        >
          <Zap size={20} />
          <div className="text-left">
            <p className="font-black">{t('sync.enableBtn', 'Ativar sincronização automática')}</p>
            <p className="text-[11px] text-blue-100 font-medium">{t('sync.enableSub', 'Recomendado')}</p>
          </div>
        </button>

        <button
          onClick={() => confirmChoice(false)}
          disabled={isSaving}
          className="w-full bg-gray-800 border-2 border-gray-700 hover:border-gray-600 disabled:opacity-60 text-white font-bold p-4 rounded-2xl flex items-center gap-3 transition-colors"
        >
          <CloudOff size={20} className="text-gray-400" />
          <div className="text-left">
            <p className="font-black">{t('sync.disableBtn', 'Prefiro sincronizar manualmente')}</p>
            <p className="text-[11px] text-gray-400 font-medium">{t('sync.disableSub', 'Você poderá enviar/baixar quando quiser')}</p>
          </div>
        </button>
      </div>

      <div className="shrink-0 mt-10 z-10">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-gray-500" />
      </div>
    </div>
  );
}