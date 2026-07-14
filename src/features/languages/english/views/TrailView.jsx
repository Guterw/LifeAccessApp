// src/features/languages/english/views/TrailView.jsx
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Check, Lock, Type, Hash, MessageCircle, Users, Bot, Coffee, Mic,
  Star, Rocket, Compass, Cloud, Moon, Sparkles, Map, Mountain, TreePine,
  Sun, Waves, Flame, Snowflake,
  TreePalm,
  Flag, 
} from 'lucide-react';
import { ENGLISH_TRAIL } from '../../../../data/englishTrail';
import { SECTION_THEMES, getSectionMeta } from '../../../../data/trailSections';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { db } from '../../../../config/dexieDb';
import BackButton from '../../../../components/BackButton';
import PigeonAvatar from '../../../../components/PigeonAvatar';
import UserProfileBadge from '../../../../components/UserProfileBadge';

const IconMap = { Type, Hash, MessageCircle, Users, Bot, Coffee, Sparkles, Mic };
const DecorIconMap = { Moon, TreePine, Sun, Waves, Flame, Sparkles, Mountain, Snowflake, Cloud, Rocket, Star };

// ==========================================
// SCROLL SUAVE CUSTOMIZADO (curta distância)
// ==========================================
function smoothScrollToElement(element, { duration = 900, offset = 0 } = {}) {
  if (!element) return;

  const startY = window.scrollY || window.pageYOffset;
  const elementRect = element.getBoundingClientRect();
  const elementY = elementRect.top + startY;
  const targetY = elementY - (window.innerHeight / 2) + (elementRect.height / 2) + offset;

  const distance = targetY - startY;
  let startTime = null;

  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const step = (timestamp) => {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

// Agrupa o ENGLISH_TRAIL (lista plana) em seções, cortando sempre que um
// node com id terminado em "_boss" é encontrado
function groupIntoSections(trail) {
  const sections = [];
  let current = [];
  trail.forEach((node) => {
    current.push(node);
    if (String(node.id).includes('_boss')) {
      sections.push(current);
      current = [];
    }
  });
  if (current.length > 0) sections.push(current); // seção em andamento, ainda sem boss
  return sections;
}

export default function TrailView() {
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();

  const completedAlphaNum = useLiveQuery(() => db.completedAlphaNum.toArray(), [], undefined);
  const completedVocabNormal = useLiveQuery(() => db.completedLevels.toArray(), [], undefined);
  const completedVocabSpeech = useLiveQuery(() => db.completedLevelsSpeech.toArray(), [], undefined);
  const completedVocabReverse = useLiveQuery(() => db.completedLevelsReverse.toArray(), [], undefined);

  const nodeRefs = useRef({});
  const sectionRefs = useRef({});
  const hasScrolledRef = useRef(false);

  const dataIsReady = completedAlphaNum !== undefined 
  && completedVocabNormal !== undefined 
  && completedVocabSpeech !== undefined 
  && completedVocabReverse !== undefined;

  const getText = (textObj) => {
    if (!textObj) return '';
    return textObj[uiLang] || textObj.pt || '';
  };

  const isNodeCompleted = (node) => {
    if (!dataIsReady) return false;

    if (node.type === 'alphabet' || node.type === 'numbers') {
      return completedAlphaNum.some(c => c.mode === node.type && c.exerciseIndex === node.targetIndex);
    }
    if (node.type === 'vocab') {
      return completedVocabNormal.some(c => c.level === node.targetId);
    }
    if (node.type === 'vocab_speech') {
      return completedVocabSpeech.some(c => c.level === node.targetId);
    }
    if (node.type === 'vocab_reverse') {
      return completedVocabReverse.some(c => c.level === node.targetId);
    }
    if (node.type === 'task') {
      const isVoiceTask = node.path.includes('/ai-voice/');
      const storageKey = isVoiceTask ? 'completedVoiceTasks' : 'completedAiTasks';
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
        return saved.some(id => String(id) === String(node.targetId));
      } catch {
        return false;
      }
    }
    if (node.type === 'explained') {
      try {
        const saved = JSON.parse(localStorage.getItem('completedExplainedLessonsCache') || '[]');
        return saved.some(id => String(id) === String(node.targetId));
      } catch {
        return false;
      }
    }
    if (node.type === 'dictation') {
      try {
        const saved = JSON.parse(localStorage.getItem('completedDictationsCache') || '[]');
        return saved.some(id => String(id) === String(node.targetId));
      } catch {
        return false;
      }
    }
    return false;
  };

  const currentUnlockedIndex = ENGLISH_TRAIL.findIndex(node => !isNodeCompleted(node));
  const activeIndex = currentUnlockedIndex === -1 ? ENGLISH_TRAIL.length : currentUnlockedIndex;

  // Agrupamento memoizado das seções
  const sections = useMemo(() => groupIntoSections(ENGLISH_TRAIL), []);

  // Descobre em qual seção está o node ativo
  const { activeSectionIndex } = useMemo(() => {
    let cursor = 0;
    for (let i = 0; i < sections.length; i++) {
      const len = sections[i].length;
      if (activeIndex < cursor + len) {
        return { activeSectionIndex: i, activeLocalIndex: activeIndex - cursor };
      }
      cursor += len;
    }
    return { activeSectionIndex: Math.max(0, sections.length - 1), activeLocalIndex: 0 };
  }, [sections, activeIndex]);

  // Estado para o Select de Seções
  const [selectedSection, setSelectedSection] = useState(0);

  // Sincroniza o select com a seção ativa ao carregar os dados
  useEffect(() => {
    if (dataIsReady) {
      setSelectedSection(activeSectionIndex);
    }
  }, [dataIsReady, activeSectionIndex]);

  // Função para navegar via Select para a seção desejada
  const handleSectionSelect = (e) => {
    const targetSectionIndex = Number(e.target.value);
    setSelectedSection(targetSectionIndex);

    const sectionEl = sectionRefs.current[targetSectionIndex];
    if (sectionEl) {
      const rect = sectionEl.getBoundingClientRect();
      const y = rect.top + window.scrollY - 80; // Offset para compensar o header fixo
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // ==========================================
  // AUTO-SCROLL EM DUAS ETAPAS (Entrada)
  // ==========================================
  useEffect(() => {
    if (!dataIsReady) return;
    if (hasScrolledRef.current) return;
    hasScrolledRef.current = true;

    const timer = setTimeout(() => {
      const targetGlobalIndex = activeIndex >= ENGLISH_TRAIL.length ? ENGLISH_TRAIL.length - 1 : activeIndex;
      const targetNode = ENGLISH_TRAIL[targetGlobalIndex];
      if (!targetNode) return;

      // Etapa 1: pulo instantâneo até o topo da seção ativa
      if (activeSectionIndex > 0) {
        const sectionEl = sectionRefs.current[activeSectionIndex];
        if (sectionEl) {
          const rect = sectionEl.getBoundingClientRect();
          const y = rect.top + window.scrollY - 80;
          window.scrollTo(0, y);
        }
      }

      // Etapa 2: animação curta e suave até o node exato
      requestAnimationFrame(() => {
        const el = nodeRefs.current[targetNode.id];
        if (el) smoothScrollToElement(el, { duration: 700 });
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [dataIsReady, activeIndex, activeSectionIndex]);

  const getTranslateX = (localIndex) => {
    const cycle = localIndex % 4;
    if (cycle === 0) return 'translate-x-0';
    if (cycle === 1) return 'translate-x-16';
    if (cycle === 2) return 'translate-x-0';
    if (cycle === 3) return '-translate-x-16';
    return 'translate-x-0';
  };

  const renderNode = (node, globalIndex, localIndex) => {
    const isCompleted = globalIndex < activeIndex;
    const isCurrent = globalIndex === activeIndex;
    const isLocked = globalIndex > activeIndex;

    const IconComponent = IconMap[node.icon] || Star;
    const xOffset = getTranslateX(localIndex);

    return (
      <div
        key={node.id}
        ref={(el) => { nodeRefs.current[node.id] = el; }}
        className={`relative z-10 flex flex-col items-center ${xOffset} transition-all duration-700 ease-out py-6`}
      >
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

  const renderSection = (sectionNodes, sectionIndex, globalStartIndex, isLastSection) => {
    const meta = getSectionMeta(sectionIndex);
    const theme = SECTION_THEMES[meta.theme] || SECTION_THEMES.night;
    const DecorIcon = DecorIconMap[theme.decorIcon] || Mountain;

    const localActive = activeIndex - globalStartIndex;
    const progress = sectionNodes.length > 1
      ? Math.min(1, Math.max(0, localActive / (sectionNodes.length - 1)))
      : (localActive >= sectionNodes.length ? 1 : 0);

    return (
      <div
        key={`section-${sectionIndex}`}
        ref={(el) => { sectionRefs.current[sectionIndex] = el; }}
        className={`relative w-full bg-gradient-to-b ${theme.bgGradient} pt-24 pb-32 ${isLastSection ? 'pb-48' : ''}`}
      >
        {/* Glows ambiente */}
        <div className="absolute top-[10%] left-[-10%] w-[120%] h-[300px] rounded-[100%] blur-[120px] pointer-events-none opacity-30"
          style={{ background: theme.lineGlowRgba.replace('1)', '0.08)') }}></div>

        {/* Decorações flutuantes */}
        <div className={`absolute top-[12%] right-[10%] ${theme.decorColor} animate-pulse`}><DecorIcon size={140} /></div>
        <div className={`absolute top-[20%] left-[8%] ${theme.decorColor2} animate-[bounce_8s_infinite]`}><Cloud size={100} /></div>
        <div className={`absolute top-[29%] right-[15%] ${theme.decorColor3} animate-[pulse_4s_infinite]`}><Sparkles size={50} /></div>
        <div className={`absolute top-[36%] left-[15%] ${theme.decorColor3} animate-[pulse_4s_infinite]`}><Star size={40} /></div>
        <div className={`absolute top-[42%] left-[10%] ${theme.decorColor} animate-pulse`}><DecorIcon size={70} /></div>
        <div className={`absolute top-[49%] right-[8%] ${theme.decorColor2} animate-[bounce_8s_infinite]`}><TreePalm size={70} /></div>
        <div className={`absolute top-[55%] right-[10%] ${theme.decorColor} animate-pulse`}><DecorIcon size={70} /></div>
        <div className={`absolute top-[60%] left-[15%] ${theme.decorColor3} animate-[pulse_4s_infinite]`}><Star size={50} /></div>
        <div className={`absolute top-[65%] left-[10%] ${theme.decorColor} animate-pulse`}><DecorIcon size={70} /></div>
        <div className={`absolute top-[70%] right-[8%] ${theme.decorColor2} animate-[bounce_8s_infinite]`}><Flag size={70} /></div>
        <div className={`absolute top-[75%] right-[10%] ${theme.decorColor} animate-pulse`}><DecorIcon size={70} /></div>
        <div className={`absolute top-[85%] left-[15%] ${theme.decorColor3} animate-[pulse_4s_infinite]`}><Star size={70} /></div>
        <div className={`absolute top-[90%] right-[10%] ${theme.decorColor} animate-pulse`}><DecorIcon size={70} /></div>

        {/* Card de título da seção */}
        <div className="relative z-20 w-[90%] max-w-lg mx-auto mb-20">
          <div className={`${theme.cardBg} backdrop-blur-xl border-2 ${theme.cardBorder} rounded-[2rem] p-8 text-center ${theme.cardShadow} relative overflow-hidden`}>
            <div className={`absolute -top-6 -right-6 ${theme.decorColor} transform rotate-12`}><Rocket size={110} /></div>
            <h1 className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${theme.titleGradient} tracking-tight drop-shadow-lg relative z-10`}>
              {getText(meta.title)}
            </h1>
            <p className={`text-sm ${theme.subtitleColor} font-black mt-2 tracking-[0.25em] uppercase relative z-10`}>
              {getText(meta.subtitle)}
            </p>
          </div>
        </div>

        {/* Linha do tempo + nodes */}
        <div className="relative flex flex-col items-center justify-start gap-12 w-full mx-auto py-4">
          <div className={`absolute top-10 bottom-10 left-1/2 -translate-x-1/2 border-l-[8px] border-dashed ${theme.lineColorClass} z-0`}>
            <div
              className={`absolute top-0 left-[-8px] border-l-[8px] border-dashed ${theme.lineActiveColorClass} transition-all duration-1000 ease-out`}
              style={{ height: `${progress * 100}%`, filter: `drop-shadow(0 0 12px ${theme.lineGlowRgba})` }}
            ></div>
          </div>

          {sectionNodes.map((node, i) => renderNode(node, globalStartIndex + i, i))}
        </div>

        {/* Onda de transição para a próxima seção */}
        {!isLastSection && (
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
            <svg className="relative block w-full h-[100px] sm:h-[150px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,112.33,189.92,98.33,235.19,87.69,278.43,71.25,321.39,56.44Z" fill={theme.waveFill}></path>
            </svg>
          </div>
        )}

        {/* Mensagem de rodapé na última seção */}
        {isLastSection && (
          <div className="relative z-20 w-[80%] max-w-sm mx-auto mt-24 text-center">
            <div className="p-6 bg-slate-900/80 rounded-3xl border border-white/10 text-slate-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <Star size={32} className="text-yellow-500 mx-auto mb-3 animate-pulse" />
              <p className="font-black text-lg tracking-wide">{t('trail.toBeContinued', 'CONTINUA...')}</p>
              <p className="text-xs text-slate-400 mt-2">{t('trail.newMissions', 'Novas missões chegarão em breve.')}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const sectionsWithOffsets = useMemo(() => {
    let cursor = 0;
    return sections.map((nodes) => {
      const start = cursor;
      cursor += nodes.length;
      return { nodes, start };
    });
  }, [sections]);

  return (
    <>
      {/* HEADER FIXO COM POSICIONAMENTO CENTRALIZADO */}
      <div className="fixed top-0 inset-x-0 h-20 bg-slate-950/85 backdrop-blur-xl z-[100] flex items-center justify-between px-4 sm:px-8 border-b border-white/10 shadow-lg">
        {/* Esquerda */}
        <div className="shrink-0 mt-5">
          <BackButton to="/english" label="" />
        </div>
        
        {/* Meio (Select largo atuando como Título) */}
        <div className="flex-1 flex mb-3 justify-center items-center px-2 sm:px-6">
          <select
            value={selectedSection}
            onChange={handleSectionSelect}
            className="bg-slate-900/90 text-white text-xs sm:text-sm font-black border border-white/20 rounded-2xl px-3 sm:px-5 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer w-full max-w-[180px] xs:max-w-[240px] sm:max-w-[360px] md:max-w-[420px] truncate backdrop-blur-md shadow-lg text-center"
          >
            {sections.map((_, idx) => {
              const meta = getSectionMeta(idx);
              const title = getText(meta.title) || `Seção ${idx + 1}`;
              const subtitle = getText(meta.subtitle);
              return (
                <option key={idx} value={idx} className="bg-slate-950 text-white py-1">
                  {subtitle ? `${title}: ${subtitle}` : title}
                </option>
              );
            })}
          </select>
        </div>

        {/* Direita */}
        <UserProfileBadge className="-mt-1 -mr-2 shrink-0" />
      </div>

      {/* CONTEÚDO FULL-BLEED */}
      <div
        className="w-screen min-h-screen flex flex-col overflow-x-hidden bg-slate-950 m-0 p-0"
        style={{ marginLeft: 'calc(50% - 50vw)' }}
      >
        {sectionsWithOffsets.map(({ nodes, start }, sectionIndex) =>
          renderSection(nodes, sectionIndex, start, sectionIndex === sectionsWithOffsets.length - 1)
        )}
      </div>
    </>
  );
}