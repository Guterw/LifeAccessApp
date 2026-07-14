// src/features/calendar/components/DayDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  X, Award, Flame, ListChecks, Bell, Dumbbell,
  CheckCircle2, Circle, Clock, PartyPopper, CalendarDays
} from 'lucide-react';
import { db } from '../config/dexieDb';
import { useLanguage } from '../contexts/LanguageContext';
import { getDailyCalorieBalance } from '../utils/dietManager';
import { getHoliday } from '../data/holidays';
import { toggleTaskDone } from '../utils/taskManager';
import { getColorConfig, diffInDays, todayKey } from '../utils/calendarUtils';

// Componente simplificado e otimizado para tarefas dentro do modal
function DayTaskRow({ task, onToggle }) {
  const isWorkout = task.type === 'workout';
  const isReminder = task.type === 'reminder';
  const Icon = isWorkout ? Dumbbell : isReminder ? Bell : ListChecks;
  const colorClass = isWorkout ? 'text-green-400' : isReminder ? 'text-yellow-400' : 'text-blue-400';

  return (
    <div className={`flex items-center justify-between bg-gray-900/60 rounded-xl p-3 border border-gray-800/80 ${task.done ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={() => onToggle(task)} className="shrink-0 transition-transform active:scale-95">
          {task.done ? <CheckCircle2 size={18} className="text-green-500" /> : <Circle size={18} className="text-gray-500" />}
        </button>
        <Icon size={14} className={`${colorClass} shrink-0`} />
        <div className="min-w-0">
          <p className={`text-sm text-white font-semibold truncate ${task.done ? 'line-through' : ''}`}>{task.title}</p>
          {task.time && (
            <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1 mt-0.5">
              <Clock size={10} /> {task.time}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente simplificado e otimizado para contadores dentro do modal
function DayCounterRow({ counter, t }) {
  const colorCfg = getColorConfig(counter.color);
  const today = todayKey();
  let value, label, isPast = false;
  
  if (counter.type === 'since') {
    value = Math.max(0, diffInDays(counter.anchorDate, today));
    label = t('calendar.daysCount', 'dias');
  } else {
    const remaining = diffInDays(today, counter.anchorDate);
    isPast = remaining < 0;
    value = Math.abs(remaining);
    label = isPast
      ? t('calendar.daysAgo', 'dias atrás')
      : remaining === 0
        ? t('calendar.today', 'é hoje!')
        : t('calendar.daysLeft', 'dias restantes');
  }

  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${colorCfg.soft} bg-gray-900/40`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`w-2.5 h-2.5 rounded-full ${colorCfg.bg} shrink-0`} />
        <div className="min-w-0">
          <span className="text-sm font-semibold text-white truncate block">{counter.title}</span>
          <span className="text-[9px] text-gray-400 uppercase tracking-wide block">
            {counter.type === 'since' ? t('calendar.typeSince', 'Dias Desde') : t('calendar.typeUntil', 'Faltam Dias')}
          </span>
        </div>
      </div>
      <div className="text-right pl-2">
        <span className={`text-lg font-black ${colorCfg.text}`}>
          {counter.type === 'until' && !isPast && value === 0 ? <PartyPopper size={16} className="inline" /> : value}
        </span>
        <span className="text-[9px] text-gray-500 font-bold uppercase ml-1">{label}</span>
      </div>
    </div>
  );
}

export default function DayDetailModal({ dateKey, onClose, openCalorieReport }) {
  const { t, uiLang } = useLanguage();
  const lang = ['pt', 'en', 'es'].includes(uiLang) ? uiLang : 'pt';

  // Configurações do Dexie
  const appSettings = useLiveQuery(() => db.appSettings.get(1), []) || {};
  const showCalories = appSettings.showDailyCaloriesInCalendar || false;
  const calendarCountry = appSettings.calendarCountry || 'IE';

  // Tarefas e Lembretes do dia
  const dayTasks = useLiveQuery(() =>
    db.tasks.where('date').equals(dateKey).toArray(),
    [dateKey]
  ) || [];

  // Contadores com âncora neste dia
  const dayCounters = useLiveQuery(() =>
    db.counters.where('anchorDate').equals(dateKey).toArray(),
    [dateKey]
  ) || [];

  // Perfil e logs de calorias
  const fitnessProfile = useLiveQuery(() => db.fitnessProfile?.get(1), []) || null;
  const [calData, setCalData] = useState(null);

  useEffect(() => {
    const fetchCals = async () => {
      if (showCalories && fitnessProfile) {
        const data = await getDailyCalorieBalance(dateKey, fitnessProfile);
        setCalData(data);
      }
    };
    fetchCals();
  }, [dateKey, showCalories, fitnessProfile]);

  // Formata data por extenso
  const formattedDate = new Date(dateKey + 'T00:00:00').toLocaleDateString(lang, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Feriados (calculado dinamicamente com suporte para Dublin)
  const holiday = getHoliday(dateKey, calendarCountry, calendarCountry === 'IE' ? 'DUBLIN' : null);
  const holidayName = holiday ? (holiday.name[lang] || holiday.name['en'] || holiday.name['pt']) : null;

  const handleToggleTask = async (task) => {
    await toggleTaskDone(task.id, !task.done);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[85vh] overflow-y-auto space-y-5">
        
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <CalendarDays size={12} />
              {t('calendar.dayDetail', 'Detalhes do Dia')}
            </h3>
            <p className="text-base font-black text-white capitalize leading-tight">
              {formattedDate}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-full shrink-0 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* SELO DE FERIADO */}
        {holidayName && (
          <div className="flex items-center gap-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-3.5 text-yellow-400 animate-pulse-slow">
            <Award size={20} className="shrink-0 text-yellow-500" />
            <div className="min-w-0 text-left">
              <span className="text-[9px] font-bold uppercase tracking-widest block opacity-70">
                {t('calendar.holidayBadge', 'Feriado')}
              </span>
              <span className="text-sm font-black truncate block leading-normal">
                {holidayName}
              </span>
            </div>
          </div>
        )}

        {/* CONTEÚDO PRINCIPAL: TAREFAS */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
            {t('calendar.tasksSection', 'Tarefas e Lembretes')}
          </span>
          {dayTasks.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-2 bg-gray-950/20 px-3 rounded-xl">
              {t('calendar.noTasksOnDay', 'Nenhuma tarefa ou lembrete neste dia.')}
            </p>
          ) : (
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {dayTasks
                .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
                .map((tsk) => (
                  <DayTaskRow key={tsk.id} task={tsk} onToggle={handleToggleTask} />
                ))}
            </div>
          )}
        </div>

        {/* CONTEÚDO PRINCIPAL: CONTADORES */}
        {dayCounters.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
              {t('calendar.countersSection', 'Contadores Ativos')}
            </span>
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {dayCounters.map((c) => (
                <DayCounterRow key={c.id} counter={c} t={t} />
              ))}
            </div>
          </div>
        )}

        {/* SEÇÃO EXTRA: CALORIAS */}
        {showCalories && calData && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-orange-400">
                <Flame size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t('calendar.calorieSummary', 'Resumo de Calorias')}
                </span>
              </div>
              <span className="text-[10px] font-black text-orange-300 bg-orange-500/15 px-2 py-0.5 rounded-md uppercase">
                {calData.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-900/50 p-2 rounded-xl text-center border border-gray-800">
                <span className="text-[9px] text-gray-500 block font-bold uppercase">{t('diet.consumed', 'Consumo')}</span>
                <span className="text-xs font-black text-white">{calData.consumed} <span className="text-[9px] text-gray-400 font-normal">kcal</span></span>
              </div>
              <div className="bg-gray-900/50 p-2 rounded-xl text-center border border-gray-800">
                <span className="text-[9px] text-gray-500 block font-bold uppercase">{t('fitness.burned', 'Queima')}</span>
                <span className="text-xs font-black text-white">{calData.burned} <span className="text-[9px] text-gray-400 font-normal">kcal</span></span>
              </div>
              <div className="bg-gray-900/50 p-2 rounded-xl text-center border border-gray-800">
                <span className="text-[9px] text-gray-500 block font-bold uppercase">{t('diet.net', 'Líquido')}</span>
                <span className={`text-xs font-black ${calData.isWithinTarget ? 'text-green-400' : 'text-orange-400'}`}>
                  {calData.netCalories} <span className="text-[9px] font-normal">kcal</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                openCalorieReport();
              }}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-[0.99]"
            >
              {t('calendar.viewFullReport', 'Ver relatório completo')}
            </button>
          </div>
        )}

        {/* BOTÃO DE FECHAR */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm rounded-xl transition-colors shadow-inner"
        >
          {t('close', 'Fechar')}
        </button>
        
      </div>
    </div>
  );
}