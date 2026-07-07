import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { User, ArrowRight } from 'lucide-react';
import FooterBrand from '../../../components/FooterBrand';
import { db } from '../../../config/dexieDb';

export default function NameView() {
  const { finishOnboarding, t } = useLanguage();
  const [nameVal, setNameVal] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nameVal.trim().length > 1) {
      // Fluxo OFFLINE: não há conta Google/nuvem conectada, então a
      // sincronização automática não faz sentido aqui — já deixamos
      // desativada e marcamos a preferência como "já definida" para que
      // o SyncPreferenceGuard não pergunte de novo (o usuário pode
      // ativar manualmente depois em Configurações, se conectar ao Google).
      const settings = await db.appSettings.get(1) || { id: 1 };
      settings.autoSyncEnabled = false;
      await db.appSettings.put(settings);
      localStorage.setItem('lifeaccess_syncpref_set', 'true');

      finishOnboarding(nameVal.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 animate-fade-in fixed inset-0 z-50">
      
      <div className="bg-blue-500/20 p-6 rounded-full mb-8 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
        <User size={64} className="text-blue-500" />
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-white mb-2">{t('nameTitle')}</h1>
        <p className="text-gray-400 max-w-xs mx-auto">{t('nameSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 mb-6">
        <input
          type="text"
          autoFocus
          placeholder={t('namePlaceholder')}
          value={nameVal}
          onChange={(e) => setNameVal(e.target.value)}
          className="w-full bg-gray-800 text-white p-5 rounded-2xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none text-center text-xl font-bold transition-all shadow-inner"
        />

        <button
          type="submit"
          disabled={nameVal.trim().length < 2}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-5 rounded-2xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
        >
          {t('startBtn')}
          <ArrowRight size={24} />
        </button>
      </form>
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-500" />
    </div>
  );
}