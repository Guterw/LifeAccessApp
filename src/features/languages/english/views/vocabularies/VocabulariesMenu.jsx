// src/features/languages/english/views/vocabularies/VocabulariesMenu.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpenText, Mic, Repeat, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import BackButton from '../../../../../components/BackButton';
import FooterBrand from '../../../../../components/FooterBrand';

export default function VocabulariesMenu() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const modules = [
    {
      id: 'vocab-normal',
      title: t('vocab.normalTitle', 'Vocabulário Padrão'),
      desc: t('vocab.normalDesc', 'Veja a palavra em inglês e traduza'),
      icon: <BookOpenText size={26} />,
      color: 'blue',
      path: '/english/vocabularies/vocab-normal/levels',
      glow: 'from-blue-900/40 border-blue-500/30 hover:border-blue-400',
      iconBg: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    },
    {
      id: 'vocab-speech',
      title: t('vocab.speechTitle', 'Vocabulário com Voz'),
      desc: t('vocab.speechDesc', 'Pronuncie a palavra em voz alta'),
      icon: <Mic size={26} />,
      color: 'pink',
      path: '/english/vocabularies/vocab-speech/levels',
      glow: 'from-pink-900/40 border-pink-500/30 hover:border-pink-400',
      iconBg: 'bg-pink-500/15 text-pink-400 border border-pink-500/20',
    },
    {
      id: 'vocab-reverse',
      title: t('vocab.reverseTitle', 'Vocabulário Inverso'),
      desc: t('vocab.reverseDesc', 'Veja a tradução e escreva em inglês'),
      icon: <Repeat size={26} />,
      color: 'emerald',
      path: '/english/vocabularies/vocab-reverse/levels',
      glow: 'from-emerald-900/40 border-emerald-500/30 hover:border-emerald-400',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    },
  ];

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 min-h-screen -mt-5 -mb-20">
      <BackButton to="/english" label={t('general.back', 'Voltar')} />

      <div className="flex flex-col mb-8 mt-4 px-1">
        <h2 className="text-3xl font-black text-white tracking-tight mb-1">
          {t('vocab.menuTitle', 'Vocabulário')}
        </h2>
        <p className="text-sm text-gray-400 font-medium">
          {t('vocab.menuSubtitle', 'Escolha como você quer praticar')}
        </p>
      </div>

      <div className="grid gap-4">
        {modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => navigate(mod.path)}
            className={`w-full text-left p-5 rounded-[2rem] border bg-gradient-to-br ${mod.glow} to-gray-800 backdrop-blur-xl flex items-center justify-between shadow-lg transition-all active:scale-[0.98]`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${mod.iconBg}`}>{mod.icon}</div>
              <div>
                <h3 className="text-lg font-black text-white">{mod.title}</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{mod.desc}</p>
              </div>
            </div>
            <ChevronRight className="text-gray-500 shrink-0" />
          </button>
        ))}
      </div>

      <div className="shrink-0 mt-10">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>
    </div>
  );
}