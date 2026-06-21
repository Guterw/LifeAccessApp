import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vocabulariesLevels } from '../../../../data/vocabulariesLevels';
import { ChevronRight, Layers } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import BackButton from '../../../../components/BackButton';
import FooterBrand from '../../../../components/FooterBrand';

export default function LevelListView() {
  const { t, uiLang } = useLanguage();
  const navigate = useNavigate();

  // Agrupa os níveis pelos grupos definidos (A1, A2, B1)
  const groups = Object.values(vocabulariesLevels).reduce((acc, level) => {
  const groupList = (level.group && level.group.length) ? level.group : ['A1'];
  groupList.forEach((g) => {
    if (!acc[g]) acc[g] = [];
    acc[g].push(level);
  });
  return acc;
}, {});

  return (
    <div className="w-full pt-8 animate-fade-in pb-24 px-4 -mb-20 -mt-5">
      <BackButton to="/english" label={t('backToEnglish')} />
      
      <h2 className="text-2xl font-bold text-blue-400 mb-6 -mt-5">{t('levelList.title')}</h2>
      
      <div className="space-y-4">
        {Object.entries(groups).map(([groupName, levels]) => (
          <button
            key={groupName}
            onClick={() => navigate(`/levels/group/${groupName}`)}
            className="w-full bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center justify-between hover:border-blue-500 transition-all shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                <Layers size={28} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">Nível {groupName}</h3>
                <p className="text-sm text-gray-400">{levels.length} lições disponíveis</p>
              </div>
            </div>
            <ChevronRight className="text-gray-500" />
          </button>
        ))}
      </div>
            {/* FOOTER DA MARCA (Centralizado e fixo acima do input) */}
            <div className="shrink-0 mt-4">
                <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
            </div>
            <div className="-mb-8"></div>
    </div>
  );
}