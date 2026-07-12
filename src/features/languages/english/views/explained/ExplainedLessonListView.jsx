import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { CheckCircle2, ChevronRight, Sparkles, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { EXPLAINED_LESSONS } from '../../../../../data/explainedLessons';
import { db } from '../../../../../config/dexieDb';
import BackButton from '../../../../../components/BackButton';
import FooterBrand from '../../../../../components/FooterBrand';

export default function ExplainedLessonListView() {
  const { t, uiLang } = useLanguage();
  const navigate = useNavigate();
  const getText = (obj) => obj?.[uiLang] || obj?.pt || '';

  const completed = useLiveQuery(() => db.completedExplainedLessons.toArray(), []) || [];
  const isDone = (id) => completed.some(c => c.lessonId === id);

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 min-h-screen -mt-5 -mb-20">
      <BackButton to="/english" label={t('general.back', 'Voltar')} />

      <div className="flex items-center gap-3 my-8 px-1">
        <div className="p-3 bg-fuchsia-500/20 text-fuchsia-400 rounded-2xl"><Sparkles size={28} /></div>
        <div>
          <h2 className="text-3xl font-black text-white">{t('explained.title', 'Aprendizado Explicado')}</h2>
          <p className="text-sm font-bold text-gray-500 tracking-wider uppercase mt-1">
            {t('explained.subtitle', 'Verbos, tempos e gramática que ninguém explica direito')}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {EXPLAINED_LESSONS.map((lesson) => {
          const done = isDone(lesson.id);
          return (
            <button
              key={lesson.id}
              onClick={() => navigate(`/english/explained/${lesson.id}`)}
              className={`w-full text-left p-5 rounded-[2rem] border transition-all shadow-lg flex items-center justify-between ${
                done ? 'bg-gray-800/50 border-green-500/30' : 'bg-gray-800 border-gray-700 hover:border-fuchsia-400'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl ${
                  done ? 'bg-green-500 text-white' : 'bg-fuchsia-500/20 text-fuchsia-400'
                }`}>
                  {done ? <CheckCircle2 size={24} /> : <Sparkles size={20} />}
                </div>
                <span className="font-black text-white text-lg">{getText(lesson.title)}</span>
              </div>
              {done ? <RotateCcw size={20} className="text-gray-500" /> : <ChevronRight className="text-gray-600" />}
            </button>
          );
        })}
      </div>

      <div className="shrink-0 mt-10"><FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" /></div>
    </div>
  );
}