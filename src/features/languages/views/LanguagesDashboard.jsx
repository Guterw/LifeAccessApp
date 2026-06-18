import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Lock } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import BackButton from '../../../components/BackButton';
import FlagIcon from '../../../components/FlagIcon';
import FooterBrand from '../../../components/FooterBrand';

export default function LanguagesDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const languages = [
    { code: 'en', name: t('languages.english'), desc: t('languages.englishDesc'), flag: 'gb', active: true, path: '/english' },
    { code: 'es', name: t('languages.spanish'), desc: t('inDev'), flag: 'es', active: false },
    { code: 'fr', name: t('languages.french'), desc: t('inDev'), flag: 'fr', active: false },
    { code: 'pt', name: t('languages.portuguese'), desc: t('inDev'), flag: 'br', active: false },
  ];

  return (
    <div className="w-full pt-8 animate-fade-in -mt-5">
      <BackButton to="/" label={t('backToHome')} />

      <div className="mb-8 text-center -mt-5">
        <h2 className="text-3xl font-black text-blue-400 mb-2 tracking-tight">{t('languages.title')}</h2>
        <p className="text-gray-400 text-sm">{t('languages.subtitle')}</p>
      </div>

      <div className="space-y-4">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => lang.active ? navigate(lang.path) : null}
            disabled={!lang.active}
            className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all text-left relative overflow-hidden
              ${lang.active 
                ? 'bg-gradient-to-r from-gray-800 to-gray-800/80 border border-blue-500/30 hover:border-blue-400 shadow-xl cursor-pointer' 
                : 'bg-gray-800/30 border border-gray-700/30 opacity-60 cursor-not-allowed grayscale-[40%]'
              }
            `}
          >
            {lang.active && (
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            )}

            <div className="flex items-center gap-4 pl-2">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-700/50 shadow-inner flex-shrink-0 bg-gray-900">
                <FlagIcon code={lang.flag} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${lang.active ? 'text-white' : 'text-gray-300'}`}>{lang.name}</h3>
                <p className={`text-sm ${lang.active ? 'text-gray-400' : 'text-gray-500'}`}>{lang.desc}</p>
              </div>
            </div>

            {lang.active ? <ChevronRight className="text-blue-400" size={24} /> : <Lock className="text-gray-600" size={20} />}
          </button>
        ))}
      </div>
      <div className="shrink-0 mt-3 -mb-4">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>
    </div>
  );
}