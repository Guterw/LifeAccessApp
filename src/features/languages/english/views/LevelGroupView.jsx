// src/features/languages/english/views/LevelGroupView.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vocabulariesLevels } from '../../../../data/vocabulariesLevels';
import { useLanguage } from '../../../../contexts/LanguageContext';
import BackButton from '../../../../components/BackButton';
import { Play, CheckCircle2, Flame, RotateCcw, AlertTriangle } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../../config/dexieDb';
import FooterBrand from '../../../../components/FooterBrand';
import UserProfileBadge from '../../../../components/UserProfileBadge';

export default function LevelGroupView() {
  const { groupName } = useParams();
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();

  const completedLevels = useLiveQuery(() => db.completedLevels.toArray(), []) || [];
  const levelsProgress = useLiveQuery(() => db.levelProgress.toArray(), []) || [];
  const userProfile = useLiveQuery(() => db.userProfile.get(1)) || { currentLevel: 0, totalXp: 0 };

  // Estado do modal de reset
  const [resetModal, setResetModal] = useState({ isOpen: false, levelId: null });

  const isCompleted = (id) => completedLevels.some(lvl => lvl.level === parseInt(id));
  const progressMap = levelsProgress.reduce((acc, curr) => {
    acc[curr.level] = curr;
    return acc;
  }, {});

  const levelsInGroup = Object.values(vocabulariesLevels).filter((l) => {
    const groupList = (l.group && l.group.length) ? l.group : ['A1'];
    return groupList.includes(groupName);
  });

  const openResetModal = (e, levelId) => {
    e.preventDefault();
    e.stopPropagation(); // Impede de abrir a lição ao clicar na lixeira
    setResetModal({ isOpen: true, levelId });
  };

  const confirmRestart = async () => {
    const lvlId = resetModal.levelId;
    // Apaga do banco o "concluído" e zera a barrinha de progresso
    await db.completedLevels.delete(lvlId);
    await db.levelProgress.delete(lvlId);
    setResetModal({ isOpen: false, levelId: null });
  };

  return (
    <div className="fixed inset-x-0 top-0 bottom-[80px] bg-gray-950 flex flex-col animate-fade-in z-10 overflow-hidden">
      
      {/* HEADER FIXO */}
      <div className="shrink-0 h-16 w-full bg-gray-900 border-b border-gray-800 z-20 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="shrink-0 mt-9 mr-3">
          <BackButton to="/levels" label="" />
        </div>
        
        <div className="w-9 h-9 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 shadow-inner flex items-center justify-center shrink-0 mr-3">
          <span className="font-black text-sm">{groupName}</span>
        </div>
        <h2 className="text-lg font-black text-white tracking-wide">
          Level {groupName}
        </h2>
        </div>
        {/* POMBO NO PERFIL */}
        <UserProfileBadge />
      </div>

      {/* ÁREA DE ROLAGEM */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {levelsInGroup.map((level) => {
          const done = isCompleted(level.id);
          const titleText = level.title[uiLang] || level.title.pt;

          // Lógica da Barra: sempre calcula
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
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-400">
                      {level.words.length} {t('levelList.wordsToMaster', 'palavras')}
                    </p>
                    
                    {/* XP BADGE: Amarelo se pendente, Verde/Apagado se concluído */}
                    {done ? (
                      <div className="flex items-center gap-1 bg-green-500/10 text-green-500/60 px-2 py-0.5 rounded-md border border-green-500/20 transition-all">
                        <CheckCircle2 size={12} />
                        <span className="text-[10px] font-bold opacity-80">+20 {t('settings.xp', 'XP')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-md border border-yellow-500/20 transition-all">
                        <Flame size={12} />
                        <span className="text-[10px] font-bold">+20 {t('settings.xp', 'XP')}</span>
                      </div>
                    )}

                  </div>
                </div>
                
                {/* BOTÕES DA DIREITA */}
                <div className="flex items-center gap-3 shrink-0">
                  {done ? (
                    <>
                      <div 
                        onClick={(e) => openResetModal(e, level.id)} 
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors z-20"
                        title={t('general.restartExercise', 'Reiniciar Nível')}
                      >
                        <RotateCcw size={20} />
                      </div>
                      <CheckCircle2 className="text-green-500 shrink-0" size={32} />
                    </>
                  ) : (
                    <Play className="text-blue-500 shrink-0" size={32} />
                  )}
                </div>
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

      <div className="shrink-0 bg-gray-900 border-t border-gray-800 py-3">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE RESET */}
      {resetModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4 border border-red-500/20">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t('level.restartLevelTitle', 'Reiniciar Nível?')}
            </h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {t('level.restartLevelWarning', 'Deseja apagar seu progresso e refazer este nível do zero?')}
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setResetModal({ isOpen: false, levelId: null })}
                className="flex-1 py-3.5 rounded-2xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-colors"
              >
                {t('cancel', 'Cancelar')}
              </button>
              <button
                onClick={confirmRestart}
                className="flex-1 py-3.5 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors"
              >
                {t('confirm', 'Confirmar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}