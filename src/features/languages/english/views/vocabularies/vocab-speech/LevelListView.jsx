// src/features/languages/english/views/vocabularies/vocab-speech/LevelListView.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { vocabSpeechLevels } from '../../../../../../data/vocabSpeechLevels';
import { ChevronRight, Layers, Flame } from 'lucide-react';
import { useLanguage } from '../../../../../../contexts/LanguageContext';
import BackButton from '../../../../../../components/BackButton';
import FooterBrand from '../../../../../../components/FooterBrand';

export default function LevelListView() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const groups = Object.values(vocabSpeechLevels).reduce((acc, level) => {
    const groupList = (level.group && level.group.length) ? level.group : ['A1'];
    groupList.forEach((g) => {
      if (!acc[g]) acc[g] = [];
      acc[g].push(level);
    });
    return acc;
  }, {});

  return (
    <div className="w-full pt-8 animate-fade-in pb-24 px-4 -mb-20 -mt-5">
      <BackButton to="/english/vocabularies" label={t('vocab.backToMenu', 'Voltar')} />

      <h2 className="text-2xl font-bold text-pink-400 mb-6 -mt-5">
        {t('vocab.speechLevelsTitle', 'Níveis — Voz')}
      </h2>

      <div className="space-y-4">
        {Object.entries(groups).map(([groupName, levels]) => (
          <button
            key={groupName}
            onClick={() => navigate(`/english/vocabularies/vocab-speech/levels/group/${groupName}`)}
            className="w-full bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center justify-between hover:border-pink-500 transition-all shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl">
                <Layers size={28} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">Level {groupName}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-gray-400">{levels.length} {t('levelList.lessonsAvailable', 'lições disponíveis')}</p>
                  <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-md border border-yellow-500/20">
                    <Flame size={12} />
                    <span className="text-[10px] font-bold">+{levels.length * 20} {t('settings.xp', 'XP')}</span>
                  </div>
                </div>
              </div>
            </div>
            <ChevronRight className="text-gray-500" />
          </button>
        ))}
      </div>

      <div className="shrink-0 mt-4">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>
      <div className="-mb-8"></div>
    </div>
  );
}