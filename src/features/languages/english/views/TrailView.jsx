// src/features/languages/english/views/TrailView.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  Check, Lock, Type, Hash, MessageCircle, Users, Bot, Coffee, 
  Star, Rocket, Compass, Cloud, Moon, Sparkles, Map, Mountain, TreePine
} from 'lucide-react';
import { ENGLISH_TRAIL } from '../../../../data/englishTrail';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { db } from '../../../../config/dexieDb';
import BackButton from '../../../../components/BackButton';
import PigeonAvatar from '../../../../components/PigeonAvatar';

const IconMap = { Type, Hash, MessageCircle, Users, Bot, Coffee };

export default function TrailView() {
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();

  const completedAlphaNum = useLiveQuery(() => db.completedAlphaNum.toArray()) || [];
  const completedVocab = useLiveQuery(() => db.completedLevels.toArray()) || [];
  const userProfile = useLiveQuery(() => db.userProfile.get(1)) || { currentLevel: 0, totalXp: 0 };

  const getText = (textObj) => {
    if (!textObj) return '';
    return textObj[uiLang] || textObj.pt || '';
  };

  const isNodeCompleted = (node) => {
    if (node.type === 'alphabet' || node.type === 'numbers') {
      return completedAlphaNum.some(c => c.mode === node.type && c.exerciseIndex === node.targetIndex);
    }
    if (node.type === 'vocab') {
      return completedVocab.some(c => c.level === node.targetId);
    }
    return false;
  };

  const currentUnlockedIndex = ENGLISH_TRAIL.findIndex(node => !isNodeCompleted(node));
  const activeIndex = currentUnlockedIndex === -1 ? ENGLISH_TRAIL.length : currentUnlockedIndex;

  const getTranslateX = (index) => {
    const cycle = index % 4; 
    if (cycle === 0) return 'translate-x-0';
    if (cycle === 1) return 'translate-x-16'; 
    if (cycle === 2) return 'translate-x-0';
    if (cycle === 3) return '-translate-x-16';
    return 'translate-x-0';
  };

  const section1 = ENGLISH_TRAIL.slice(0, 11);
  const section2 = ENGLISH_TRAIL.slice(11);

  const progressSec1 = Math.min(1, Math.max(0, activeIndex / (section1.length - 1)));
  const progressSec2 = Math.min(1, Math.max(0, (activeIndex - section1.length) / (section2.length - 1)));

  const renderNode = (node, globalIndex) => {
    const isCompleted = globalIndex < activeIndex;
    const isCurrent = globalIndex === activeIndex;
    const isLocked = globalIndex > activeIndex;
    
    const IconComponent = IconMap[node.icon] || Star;
    const xOffset = getTranslateX(globalIndex);

    return (
      <div key={node.id} className={`relative z-10 flex flex-col items-center ${xOffset} transition-all duration-700 ease-out py-6`}>
        
        {/* BALÃO DA FASE ATUAL COM O POMBO */}
        {isCurrent && (
          <div className="absolute -top-20 animate-bounce flex flex-col items-center z-40">
            <PigeonAvatar 
              accessory={node.type === 'task' ? 'flatcap' : 'coffee'} 
              className="w-14 h-14 -mb-2 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] relative z-10" 
            />
            <div className="bg-gradient-to-r from-yellow-100 to-white text-black px-6 py-3 rounded-2xl font-black text-sm shadow-[0_20px_40px_rgba(255,255,255,0.4)] whitespace-nowrap border-2 border-yellow-300 relative">
              {getText(node.title)}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 border-solid border-t-yellow-300 border-t-8 border-x-transparent border-x-8 border-b-0"></div>
              <Sparkles size={20} className="absolute -top-3 -right-3 text-yellow-500 animate-pulse drop-shadow-md" />
            </div>
          </div>
        )}

        {/* BOTÃO (CASA) */}
        <button
          disabled={isLocked}
          onClick={() => navigate(node.path, { state: { fromTrail: true } })}
          className={`
            w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 relative z-20
            ${isLocked ? 'bg-slate-800/60 backdrop-blur-md border-b-[6px] border-slate-900/80 cursor-not-allowed shadow-inner opacity-80' : ''}
            ${isCompleted ? `${node.color} border-b-[6px] border-black/40 shadow-[0_10px_20px_rgba(0,0,0,0.5)] ${node.shadow}` : ''}
            ${isCurrent ? `${node.color} border-b-[8px] border-black/40 shadow-[0_0_50px_rgba(255,255,255,0.6)] hover:scale-110 active:scale-95 ring-[6px] ring-white/30 ${node.shadow}` : ''}
            ${node.type === 'task' ? 'ring-4 ring-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : ''}
          `}
        >
          {isCurrent && (
            <div className="absolute inset-0 rounded-full border-[6px] border-white/50 animate-ping opacity-60 z-0 pointer-events-none"></div>
          )}

          {!isLocked && (
            <div className="absolute inset-2 border-4 border-white/20 rounded-full pointer-events-none z-10"></div>
          )}

          {isLocked ? (
            <Lock size={28} className="text-slate-500 drop-shadow-md z-20 relative" />
          ) : isCompleted ? (
            <Check size={36} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-20 relative" />
          ) : (
            <IconComponent size={36} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-20 relative" />
          )}
        </button>

        {/* TÍTULO DA FASE */}
        {!isCurrent && (
          <div className="mt-4 px-5 py-2 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/10 shadow-2xl transition-transform hover:scale-105">
            <span className={`text-[11px] font-black tracking-widest uppercase whitespace-nowrap drop-shadow-lg
              ${isLocked ? 'text-slate-500' : 'text-white'}
              ${node.type === 'task' && !isLocked ? 'text-red-300' : ''}
            `}>
              {getText(node.title)}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 min-h-screen flex flex-col overflow-x-hidden bg-slate-950 m-0 p-0">
      
      {/* HEADER FIXO SUPERIOR */}
      <div className="fixed top-0 inset-x-0 h-24 bg-slate-950/50 backdrop-blur-2xl z-[100] flex items-center px-4 sm:px-8 border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        <BackButton to="/english" label={t('general.back', 'Voltar')} />
        
        <div className="ml-auto flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl py-1.5 px-2 pr-5 rounded-full border border-white/10 shadow-2xl">
          {/* POMBO NO PERFIL */}
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600 shadow-inner overflow-hidden relative shrink-0">
             <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
             <PigeonAvatar accessory="none" className="w-10 h-10 mt-1" />
          </div>
          <div className="flex flex-col items-end ml-1">
            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest drop-shadow-md">
              {t('trail.level', 'Nível')} {userProfile.currentLevel}
            </span>
            <span className="text-xs font-bold text-gray-300">
              {userProfile.totalXp % 100} / 100 {t('settings.xp', 'XP')}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* SEÇÃO 1: OS FUNDAMENTOS (Céu Noturno/Espaço) */}
      {/* ========================================== */}
      <div className="relative w-full bg-gradient-to-b from-slate-950 via-indigo-950 to-[#2e1065] pt-36 pb-32">
        
        {/* EFEITOS FULL-BLEED */}
        <div className="absolute top-[10%] left-[-10%] w-[120%] h-[300px] bg-indigo-600/10 rounded-[100%] blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[-20%] w-[150%] h-[400px] bg-purple-600/10 rounded-[100%] blur-[150px] pointer-events-none"></div>

        {/* Ícones Galácticos Animados */}
        <div className="absolute top-[12%] right-[10%] text-indigo-300/20 animate-pulse"><Moon size={150} /></div>
        <div className="absolute top-[40%] left-[5%] text-indigo-200/10 animate-[bounce_8s_infinite]"><Cloud size={180} /></div>
        <div className="absolute top-[60%] right-[15%] text-white/20 animate-[ping_3s_infinite]"><Star size={24} /></div>
        <div className="absolute top-[25%] left-[15%] text-purple-300/30 animate-[pulse_4s_infinite]"><Sparkles size={50} /></div>

        {/* Banner Seção 1 */}
        <div className="relative z-20 w-[90%] max-w-lg mx-auto mb-20">
          <div className="bg-indigo-900/50 backdrop-blur-xl border-2 border-indigo-400/30 rounded-[2rem] p-8 text-center shadow-[0_0_50px_rgba(79,70,229,0.3)] relative overflow-hidden">
            <div className="absolute -top-6 -right-6 text-indigo-400/20 transform rotate-12"><Rocket size={120} /></div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 tracking-tight drop-shadow-lg relative z-10">
              {t('trail.section1', 'Seção 1')}
            </h1>
            <p className="text-sm text-indigo-300 font-black mt-2 tracking-[0.3em] uppercase relative z-10">
              {t('trail.fundamentals', 'Os Fundamentos')}
            </p>
          </div>
        </div>

        {/* Tabuleiro Seção 1 */}
        <div className="relative flex flex-col items-center justify-start gap-12 w-full mx-auto py-4">
          
          {/* CAMINHO NEON (LINHA TRACEJADA) */}
          <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 border-l-[8px] border-dashed border-indigo-900/30 z-0">
            <div 
              className="absolute top-0 left-[-8px] border-l-[8px] border-dashed border-indigo-400 transition-all duration-1000 ease-out"
              style={{ 
                height: `${progressSec1 * 100}%`,
                filter: 'drop-shadow(0 0 12px rgba(129, 140, 248, 1))' 
              }}
            ></div>
          </div>
          
          {section1.map((node, i) => renderNode(node, i))}
        </div>

        {/* ONDA DE TRANSIÇÃO (SVG DIVIDER) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-full h-[100px] sm:h-[150px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,112.33,189.92,98.33,235.19,87.69,278.43,71.25,321.39,56.44Z" className="fill-[#022c22]"></path>
          </svg>
        </div>
      </div>

      {/* ========================================== */}
      {/* SEÇÃO 2: PREPARAÇÃO PARA DUBLIN (Floresta/Terrestre) */}
      {/* ========================================== */}
      <div className="relative w-full bg-gradient-to-b from-[#022c22] via-teal-950 to-slate-950 pt-24 pb-48">
        
        {/* EFEITOS FULL-BLEED */}
        <div className="absolute top-[30%] left-[-20%] w-[150%] h-[500px] bg-emerald-600/10 rounded-[100%] blur-[150px] pointer-events-none"></div>

        {/* Ícones Terrestres Animados */}
        <div className="absolute top-[10%] left-[5%] text-teal-300/10 animate-[pulse_6s_infinite]"><Mountain size={160} /></div>
        <div className="absolute top-[40%] right-[10%] text-emerald-400/10 animate-[bounce_10s_infinite]"><TreePine size={120} /></div>
        <div className="absolute bottom-[20%] left-[15%] text-teal-200/5"><Map size={200} /></div>

        {/* Banner Seção 2 */}
        <div className="relative z-20 w-[90%] max-w-lg mx-auto mb-20">
          <div className="bg-teal-900/50 backdrop-blur-xl border-2 border-teal-400/30 rounded-[2rem] p-8 text-center shadow-[0_0_50px_rgba(20,184,166,0.3)] relative overflow-hidden">
            <div className="absolute -top-4 -left-6 text-teal-400/20 transform -rotate-12"><Compass size={140} /></div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 tracking-tight drop-shadow-lg relative z-10">
              {t('trail.section2', 'Seção 2')}
            </h1>
            <p className="text-sm text-teal-300 font-black mt-2 tracking-[0.2em] uppercase relative z-10">
              {t('trail.dublinPrep', 'Preparação para Dublin')}
            </p>
          </div>
        </div>

        {/* Tabuleiro Seção 2 */}
        <div className="relative flex flex-col items-center justify-start gap-12 w-full mx-auto py-4">
          
          {/* CAMINHO NEON TERRESTRE */}
          <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 border-l-[8px] border-dashed border-teal-900/30 z-0">
            <div 
              className="absolute top-0 left-[-8px] border-l-[8px] border-dashed border-teal-400 transition-all duration-1000 ease-out"
              style={{ 
                height: `${progressSec2 * 100}%`,
                filter: 'drop-shadow(0 0 12px rgba(45, 212, 191, 1))' 
              }}
            ></div>
          </div>
          
          {section2.map((node, i) => {
            const globalIndex = i + 11;
            return renderNode(node, globalIndex);
          })}
        </div>
        
        {/* Placa de Fim da Trilha */}
        <div className="relative z-20 w-[80%] max-w-sm mx-auto mt-24 text-center">
           <div className="p-6 bg-slate-900/80 rounded-3xl border border-white/10 text-slate-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
             <Star size={32} className="text-yellow-500 mx-auto mb-3 animate-pulse" />
             <p className="font-black text-lg tracking-wide">{t('trail.toBeContinued', 'CONTINUA...')}</p>
             <p className="text-xs text-slate-400 mt-2">{t('trail.newMissions', 'Novas missões chegarão em breve.')}</p>
           </div>
        </div>

      </div>

    </div>
  );
}