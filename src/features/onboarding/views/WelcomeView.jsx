import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CheckCircle2 } from 'lucide-react';
import FlagIcon from '../../../components/FlagIcon';

export default function WelcomeView({ onNext }) {
  // Puxamos as funções mágicas do nosso Cérebro de Idiomas
  const { uiLang, changeLanguage, t } = useLanguage();

  // As 3 opções iniciais com as bandeiras corretas (gb = Grã-Bretanha)
  const languages = [
    { code: 'pt', name: 'Português', flag: 'br' },
    { code: 'en', name: 'English', flag: 'gb' },
    { code: 'es', name: 'Español', flag: 'es' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 animate-fade-in fixed inset-0 z-50">
      
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-blue-500 mb-4 tracking-tighter">LifeAccess</h1>
        <p className="text-2xl font-bold text-white mb-2">{t('welcome')}</p>
        <p className="text-gray-400">{t('selectLanguage')}</p>
      </div>

      <div className="w-full max-w-sm space-y-4 mb-12">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border-2 ${
              uiLang === lang.code
                ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                : 'bg-gray-800 border-gray-700 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-700 shadow-inner">
                <FlagIcon code={lang.flag} />
              </div>
              <span className={`text-xl font-bold ${uiLang === lang.code ? 'text-white' : 'text-gray-300'}`}>
                {lang.name}
              </span>
            </div>
            
            {/* Ícone de check só aparece na linguagem selecionada */}
            {uiLang === lang.code && <CheckCircle2 className="text-blue-500" size={28} />}
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-xl transition-colors shadow-lg text-lg"
      >
        {t('continueBtn')}
      </button>

    </div>
  );
}