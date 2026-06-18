import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { User, ArrowRight } from 'lucide-react';
import FooterBrand from '../../../components/FooterBrand';

export default function NameView() {
  const { finishOnboarding, t } = useLanguage();
  const [nameVal, setNameVal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameVal.trim().length > 1) {
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