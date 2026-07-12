// src/features/languages/english/views/dictation/DictationSelectionView.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Play, ChevronRight, Mic, CheckCircle2, Trophy, Clock } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { DICTATION_TEXTS } from '../../../../../data/dictationTexts';
import { db } from '../../../../../config/dexieDb';
import BackButton from '../../../../../components/BackButton';
import FooterBrand from '../../../../../components/FooterBrand';

export default function DictationSelectionView() {
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();

  const getTranslated = (textObj) => {
    if (!textObj) return '';
    return textObj[uiLang] || textObj.pt || '';
  };

  const completedList = useLiveQuery(() => db.completedDictations.toArray(), [], []) || [];
  const completedIds = new Set(completedList.map((c) => c.textId));
  const completedCount = completedIds.size;

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 min-h-screen -mt-5 -mb-20">
      <BackButton to="/english" label={t('general.back', 'Voltar')} />

      <div className="flex items-center justify-between gap-3 my-8 px-1">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-500/20 text-pink-400 rounded-2xl">
            <Mic size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">
              {t('dictation.title', 'Ditado')}
            </h2>
            <p className="text-sm font-bold text-gray-500 tracking-wider uppercase mt-1">
              {t('dictation.subtitle', 'Fale o texto em voz alta')}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center bg-gray-800 border border-gray-700 rounded-2xl px-4 py-2 shadow-md">
          <Trophy size={18} className={completedCount > 0 ? 'text-yellow-500' : 'text-gray-600'} />
          <span className="text-xs font-black text-white mt-1">{completedCount}/{DICTATION_TEXTS.length}</span>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-6 px-1">
        {t('dictation.desc', 'Escolha um texto e leia em voz alta. As palavras corretas ficam verdes conforme você fala.')}
      </p>

      <div className="grid gap-4">
        {DICTATION_TEXTS.map((item) => {
          const isCompleted = completedIds.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => navigate(`/english/dictation/${item.id}`)}
              className={`w-full text-left p-5 rounded-[2rem] border transition-all shadow-lg group relative overflow-hidden block ${
                isCompleted
                  ? 'bg-gray-800/50 border-green-500/30'
                  : 'bg-gray-800 border-gray-700 hover:border-pink-400'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl transition-all ${
                    isCompleted
                      ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                      : 'bg-pink-500/20 text-pink-400 group-hover:bg-pink-500 group-hover:text-white'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={24} /> : <Play size={20} fill="currentColor" />}
                  </div>
                  <div className="text-left min-w-0">
                    <span className="font-black text-white text-lg block truncate">
                      {getTranslated(item.title)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mt-1">
                      {item.difficulty} · {item.words.length} {t('dictation.words', 'palavras')}
                      <span className="flex items-center gap-1 text-blue-400">
                        <Clock size={10} /> {item.timeLimitSeconds}s
                      </span>
                    </span>
                  </div>
                </div>
                <ChevronRight className="text-gray-600 shrink-0 group-hover:text-pink-400 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="shrink-0 mt-10">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>
    </div>
  );
}