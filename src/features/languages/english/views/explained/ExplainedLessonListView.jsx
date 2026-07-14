// src/features/languages/english/views/ExplainedLessonListView.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronRight, Layers, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { EXPLAINED_LESSONS } from '../../../../../data/explainedLessons';
import { db } from '../../../../../config/dexieDb';
import BackButton from '../../../../../components/BackButton';
import FooterBrand from '../../../../../components/FooterBrand';

export default function ExplainedLessonListView() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const completed = useLiveQuery(() => db.completedExplainedLessons.toArray(), []) || [];
  const isDone = (id) => completed.some(c => c.lessonId === id);

  // Agrupa as lições pelos grupos definidos (A1, A2, B1, etc.)
  const groups = EXPLAINED_LESSONS.reduce((acc, lesson) => {
    const groupList = (lesson.group && lesson.group.length)
      ? lesson.group
      : (lesson.level ? [lesson.level] : ['A1']);
      
    groupList.forEach((g) => {
      if (!acc[g]) acc[g] = [];
      acc[g].push(lesson);
    });
    return acc;
  }, {});

  return (
    <div className="w-full pt-8 animate-fade-in pb-24 px-4 -mb-20 -mt-5">
      <div className="flex items-center justify-between mb-2 -ml-4 -mr-4">
        <BackButton to="/english" label={t('backToEnglish', 'Voltar')} />
      </div>

      <div className="flex items-center gap-3 my-8 px-1">
        <div className="p-3 bg-fuchsia-500/20 text-fuchsia-400 rounded-2xl">
          <Sparkles size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">
            {t('explained.title', 'Lições Explicadas')}
          </h2>
          <p className="text-sm text-gray-400">
            {t('explained.subtitle', 'Verbos, tempos e gramática que ninguém explica direito')}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {Object.entries(groups).map(([groupName, lessons]) => {
          const completedCount = lessons.filter(l => isDone(l.id)).length;
          const isGroupComplete = completedCount === lessons.length && lessons.length > 0;

          return (
            <button
              key={groupName}
              onClick={() => navigate(`/english/explained/group/${groupName}`)}
              className="w-full bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center justify-between hover:border-fuchsia-500 transition-all shadow-lg text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isGroupComplete ? 'bg-green-500/20 text-green-400' : 'bg-fuchsia-500/20 text-fuchsia-400'}`}>
                  {isGroupComplete ? <CheckCircle2 size={28} /> : <Layers size={28} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Nível {groupName}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-gray-400">
                      {completedCount}/{lessons.length} {t('explainedList.lessonsDone', 'concluídas')}
                    </p>
                    <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-md border border-yellow-500/20">
                      <Flame size={12} />
                      <span className="text-[10px] font-bold">+{lessons.length * 30} XP</span>
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="text-gray-500" />
            </button>
          );
        })}
      </div>

      <FooterBrand />
    </div>
  );
}