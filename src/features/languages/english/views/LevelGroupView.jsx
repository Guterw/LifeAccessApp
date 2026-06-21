import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { englishLevels } from '../../../../data/englishLevels';
import { useLanguage } from '../../../../contexts/LanguageContext';
import BackButton from '../../../../components/BackButton';
import { Play, CheckCircle2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../../config/dexieDb';
import FooterBrand from '../../../../components/FooterBrand';

export default function LevelGroupView() {
  const { groupName } = useParams();
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();

  const completedLevels = useLiveQuery(() => db.completedLevels.toArray(), []) || [];
  const levelsProgress = useLiveQuery(() => db.levelProgress.toArray(), []) || [];

  const isCompleted = (id) => completedLevels.some(lvl => lvl.level === parseInt(id));
  const progressMap = levelsProgress.reduce((acc, curr) => {
    acc[curr.level] = curr;
    return acc;
  }, {});

  const levelsInGroup = Object.values(englishLevels).filter((l) => {
    const groupList = (l.group && l.group.length) ? l.group : ['A1'];
    return groupList.includes(groupName);
  });

  return (
    <div className="w-full pt-8 animate-fade-in pb-24 px-4 -mb-20 -mt-5">
      <BackButton to="/levels" label={t('backToEnglish', 'Voltar')} />
      <h2 className="text-3xl font-black text-white -mt-5 mb-6 tracking-wide">Nível {groupName}</h2>

      <div className="space-y-4">
        {levelsInGroup.map((level) => {
          const done = isCompleted(level.id);
          const titleText = level.title[uiLang] || level.title.pt;

          // Lógica da Barra: sempre calcula, nunca esconde
          const currentProgress = progressMap[level.id];
          const totalWords = level.words.length;
          const currentCorrect = done ? totalWords : (currentProgress?.correctCount || 0);
          const progressPercentage = (currentCorrect / totalWords) * 100;

          const barColor = done ? 'bg-green-500' : 'bg-blue-500';

          return (
            <button
              key={level.id}
              onClick={() => navigate(`/level/${level.id}`)}
              className={`w-full text-left p-6 rounded-2xl border block transition-all shadow-lg ${
                done ? 'bg-gray-800/50 border-green-500/30' : 'bg-gray-800 border-gray-700 hover:border-blue-500'
              }`}
            >
              <div className="flex items-center justify-between mb-4 gap-4">
                
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xl font-bold mb-1 break-words ${done ? 'text-green-400' : 'text-white'}`}>
                    {titleText}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {level.words.length} {t('levelList.wordsToMaster', 'palavras')}
                  </p>
                </div>
                
                {done ? (
                  <CheckCircle2 className="text-green-500 shrink-0" size={32} />
                ) : (
                  <Play className="text-blue-500 shrink-0" size={32} />
                )}
              </div>

              {/* BARRA DE PROGRESSO - SEMPRE VISÍVEL */}
              <div className="w-full bg-gray-900 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${barColor}`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider text-right">
                {currentCorrect} / {totalWords}
              </div>
            </button>
          );
        })}
      </div>
      {/* FOOTER DA MARCA (Centralizado e fixo acima do input) */}
      <div className="shrink-0 mt-4">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>
      <div className="-mb-8"></div>
    </div>
  );
}