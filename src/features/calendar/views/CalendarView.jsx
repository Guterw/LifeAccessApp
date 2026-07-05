// src/features/calendar/views/CalendarView.jsx
import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  ChevronLeft, ChevronRight, Menu, X, Plus, Flame, Hourglass,
  Trash2, Pencil, CalendarDays, PartyPopper, ListChecks, Bell,
  Dumbbell, CheckCircle2, Circle, Clock
} from 'lucide-react';
import { db } from '../../../config/dexieDb';
import { useLanguage } from '../../../contexts/LanguageContext';
import BackButton from '../../../components/BackButton';
import FooterBrand from '../../../components/FooterBrand';
import {
  buildMonthMatrix, toDateKey, todayKey, diffInDays,
  MONTH_NAMES, WEEKDAY_SHORT, COUNTER_COLORS, getColorConfig
} from '../../../utils/calendarUtils';
import { addTask, updateTask, toggleTaskDone, deleteTask } from '../../../utils/taskManager';

// ==========================================
// MODAL: Criar / Editar Contador
// ==========================================
function CounterFormModal({ initialData, onClose, onSave, onDelete, t }) {
  const isEditing = !!initialData;
  const [title, setTitle] = useState(initialData?.title || '');
  const [type, setType] = useState(initialData?.type || 'since');
  const [anchorDate, setAnchorDate] = useState(initialData?.anchorDate || todayKey());
  const [color, setColor] = useState(initialData?.color || 'purple');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !anchorDate) return;
    onSave({
      id: initialData?.id,
      title: title.trim(),
      type,
      anchorDate,
      color,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-white">
            {isEditing ? t('calendar.editCounter', 'Editar Contador') : t('calendar.newCounter', 'Novo Contador')}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-full">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t('calendar.counterTitle', 'Título')}
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('calendar.counterTitlePlaceholder', 'Ex: Dias sem álcool')}
              className="w-full bg-gray-800 text-white p-3 rounded-xl border-2 border-gray-700 focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t('calendar.counterType', 'Tipo de Contagem')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('since')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                  type === 'since' ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-gray-800 border-gray-700 text-gray-400'
                }`}
              >
                <Flame size={20} />
                <span className="text-xs font-bold">{t('calendar.typeSince', 'Dias Desde')}</span>
              </button>
              <button
                type="button"
                onClick={() => setType('until')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                  type === 'until' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-gray-800 border-gray-700 text-gray-400'
                }`}
              >
                <Hourglass size={20} />
                <span className="text-xs font-bold">{t('calendar.typeUntil', 'Faltam Dias')}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              {type === 'since' ? t('calendar.startDate', 'Data de Início') : t('calendar.targetDate', 'Data Alvo')}
            </label>
            <input
              type="date"
              value={anchorDate}
              onChange={(e) => setAnchorDate(e.target.value)}
              className="w-full bg-gray-800 text-white p-3 rounded-xl border-2 border-gray-700 focus:border-purple-500 focus:outline-none text-sm [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t('calendar.color', 'Cor')}
            </label>
            <div className="flex flex-wrap gap-2.5">
              {COUNTER_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-9 h-9 rounded-full ${c.bg} transition-all ${
                    color === c.id ? 'ring-4 ring-offset-2 ring-offset-gray-900 ' + c.ring : 'opacity-60'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="p-3.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors shadow-lg"
            >
              {isEditing ? t('calendar.saveChanges', 'Salvar Alterações') : t('calendar.createCounter', 'Criar Contador')}
            </button>
          </div>
        </form>

        {confirmDelete && (
          <div className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gray-900 border border-red-500/30 rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl">
              <Trash2 size={32} className="text-red-500 mx-auto mb-3" />
              <h4 className="text-white font-bold mb-2">{t('calendar.deleteConfirmTitle', 'Excluir este contador?')}</h4>
              <p className="text-gray-400 text-xs mb-5">{t('calendar.deleteConfirmDesc', 'Essa ação não pode ser desfeita.')}</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(false)} className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-bold text-sm">
                  {t('cancel', 'Cancelar')}
                </button>
                <button onClick={() => onDelete(initialData.id)} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm">
                  {t('confirm', 'Confirmar')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// MODAL: Criar / Editar Tarefa ou Lembrete
// ==========================================
function TaskFormModal({ initialData, defaultDate, onClose, onSave, onDelete, t }) {
  const isEditing = !!initialData;
  const [title, setTitle] = useState(initialData?.title || '');
  const [type, setType] = useState(initialData?.type || 'task');
  const [date, setDate] = useState(initialData?.date || defaultDate || todayKey());
  const [time, setTime] = useState(initialData?.time || '');
  const [notify, setNotify] = useState(initialData?.notify ?? true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    onSave({
      id: initialData?.id,
      title: title.trim(),
      type,
      date,
      time,
      notify,
      color: type === 'reminder' ? 'yellow' : 'blue',
    });
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-white">
            {isEditing ? t('calendar.editTask', 'Editar Tarefa') : t('calendar.newTask', 'Nova Tarefa / Lembrete')}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-full">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t('calendar.taskTitle', 'Título')}
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('calendar.taskTitlePlaceholder', 'Ex: Pagar conta de luz')}
              className="w-full bg-gray-800 text-white p-3 rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t('calendar.taskType', 'Tipo')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('task')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                  type === 'task' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-gray-800 border-gray-700 text-gray-400'
                }`}
              >
                <ListChecks size={20} />
                <span className="text-xs font-bold">{t('calendar.typeTask', 'Tarefa')}</span>
              </button>
              <button
                type="button"
                onClick={() => setType('reminder')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                  type === 'reminder' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' : 'bg-gray-800 border-gray-700 text-gray-400'
                }`}
              >
                <Bell size={20} />
                <span className="text-xs font-bold">{t('calendar.typeReminder', 'Lembrete')}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                {t('calendar.taskDate', 'Data')}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-800 text-white p-3 rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none text-sm [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                {t('calendar.taskTime', 'Horário')}
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-gray-800 text-white p-3 rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none text-sm [color-scheme:dark]"
              />
            </div>
          </div>

          <label className="flex items-center justify-between bg-gray-800/60 p-3 rounded-xl border border-gray-700">
            <span className="text-sm text-gray-300 flex items-center gap-2">
              <Bell size={16} className="text-yellow-400" />
              {t('calendar.notifyMe', 'Notificar quando chegar a hora')}
            </span>
            <button
              type="button"
              onClick={() => setNotify(!notify)}
              className={`w-11 h-6 rounded-full p-1 transition-all duration-300 ${notify ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notify ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </label>

          <div className="flex gap-3 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="p-3.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg"
            >
              {isEditing ? t('calendar.saveChanges', 'Salvar Alterações') : t('calendar.createTask', 'Criar')}
            </button>
          </div>
        </form>

        {confirmDelete && (
          <div className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gray-900 border border-red-500/30 rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl">
              <Trash2 size={32} className="text-red-500 mx-auto mb-3" />
              <h4 className="text-white font-bold mb-2">{t('calendar.deleteTaskConfirmTitle', 'Excluir esta tarefa?')}</h4>
              <p className="text-gray-400 text-xs mb-5">{t('calendar.deleteConfirmDesc', 'Essa ação não pode ser desfeita.')}</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(false)} className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-bold text-sm">
                  {t('cancel', 'Cancelar')}
                </button>
                <button onClick={() => onDelete(initialData.id)} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm">
                  {t('confirm', 'Confirmar')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// CARD DE CONTADOR
// ==========================================
function CounterCard({ counter, onClick, t }) {
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
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border ${colorCfg.soft} hover:brightness-110 transition-all flex items-center justify-between shadow-md`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-3 h-3 rounded-full ${colorCfg.bg} shrink-0`} />
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-white truncate">{counter.title}</h4>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">
            {counter.type === 'since' ? t('calendar.typeSince', 'Dias Desde') : t('calendar.typeUntil', 'Faltam Dias')}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0 pl-2">
        <span className={`text-2xl font-black ${colorCfg.text}`}>
          {counter.type === 'until' && !isPast && value === 0 ? <PartyPopper size={22} className="inline" /> : value}
        </span>
        <p className="text-[9px] text-gray-500 font-bold uppercase">{label}</p>
      </div>
    </button>
  );
}

// ==========================================
// LINHA DE TAREFA/LEMBRETE
// ==========================================
function TaskRow({ task, onToggle, onEdit }) {
  const isWorkout = task.type === 'workout';
  const isReminder = task.type === 'reminder';
  const Icon = isWorkout ? Dumbbell : isReminder ? Bell : ListChecks;
  const colorClass = isWorkout ? 'text-green-400' : isReminder ? 'text-yellow-400' : 'text-blue-400';

  return (
    <div className={`flex items-center justify-between bg-gray-900/60 rounded-xl p-3 ${task.done ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={() => onToggle(task)} className="shrink-0">
          {task.done ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} className="text-gray-500" />}
        </button>
        <Icon size={16} className={`${colorClass} shrink-0`} />
        <div className="min-w-0">
          <p className={`text-sm text-white font-semibold truncate ${task.done ? 'line-through' : ''}`}>{task.title}</p>
          {task.time && (
            <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
              <Clock size={10} /> {task.time}
            </span>
          )}
        </div>
      </div>
      <button onClick={() => onEdit(task)} className="p-1.5 text-gray-400 hover:text-white shrink-0">
        <Pencil size={14} />
      </button>
    </div>
  );
}

// ==========================================
// TELA PRINCIPAL DO CALENDÁRIO
// ==========================================
export default function CalendarView() {
  const { t, uiLang } = useLanguage();
  const lang = ['pt', 'en', 'es'].includes(uiLang) ? uiLang : 'pt';

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDayKey, setSelectedDayKey] = useState(todayKey());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalState, setModalState] = useState({ open: false, data: null });
  const [taskModalState, setTaskModalState] = useState({ open: false, data: null });
  const [fabOpen, setFabOpen] = useState(false);

  const counters = useLiveQuery(() => db.counters.toArray(), []) || [];
  const allTasks = useLiveQuery(() => db.tasks.toArray(), []) || [];

  const monthCells = useMemo(() => buildMonthMatrix(viewYear, viewMonth), [viewYear, viewMonth]);

  const countersByDate = useMemo(() => {
    const map = {};
    counters.forEach((c) => {
      if (!map[c.anchorDate]) map[c.anchorDate] = [];
      map[c.anchorDate].push(c);
    });
    return map;
  }, [counters]);

  const tasksByDate = useMemo(() => {
    const map = {};
    allTasks.forEach((tsk) => {
      if (!map[tsk.date]) map[tsk.date] = [];
      map[tsk.date].push(tsk);
    });
    Object.values(map).forEach(arr => arr.sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99')));
    return map;
  }, [allTasks]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const goToToday = () => {
    const t0 = new Date();
    setViewYear(t0.getFullYear());
    setViewMonth(t0.getMonth());
    setSelectedDayKey(todayKey());
  };

  const handleSaveCounter = async (data) => {
    if (data.id) {
      await db.counters.update(data.id, {
        title: data.title, type: data.type, anchorDate: data.anchorDate, color: data.color,
      });
    } else {
      await db.counters.add({
        title: data.title, type: data.type, anchorDate: data.anchorDate, color: data.color,
        createdAt: data.createdAt,
      });
    }
    setModalState({ open: false, data: null });
  };

  const handleDeleteCounter = async (id) => {
    await db.counters.delete(id);
    setModalState({ open: false, data: null });
  };

  const handleSaveTask = async (data) => {
    if (data.id) {
      await updateTask(data.id, {
        title: data.title, type: data.type, date: data.date, time: data.time,
        notify: data.notify, color: data.color, notified: false,
      });
    } else {
      await addTask(data);
    }
    setTaskModalState({ open: false, data: null });
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTaskModalState({ open: false, data: null });
  };

  const handleToggleTask = async (task) => {
    await toggleTaskDone(task.id, !task.done);
  };

  const selectedDayCounters = countersByDate[selectedDayKey] || [];
  const selectedDayTasks = tasksByDate[selectedDayKey] || [];
  const todaysKey = todayKey();

  return (
    <div className="w-full pt-8 animate-fade-in pb-24 px-4 -mt-5 -mb-20 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-2 -ml-4 -mr-4">
        <BackButton to="/" label={t('backToHome', 'Voltar')} />
        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center justify-center w-11 h-11 rounded-full text-gray-300 bg-gray-800/50 hover:bg-gray-700 hover:text-white border border-gray-700/50 mb-8 transition-all shadow-sm backdrop-blur-sm relative -mt-1"
        >
          <Menu size={20} />
          {(counters.length + allTasks.filter(t => !t.done).length) > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full text-[10px] font-black text-white flex items-center justify-center border-2 border-gray-900">
              {counters.length + allTasks.filter(t => !t.done).length}
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6 -mt-3">
        <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl">
          <CalendarDays size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{t('nav.calendar', 'Calendário')}</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{t('calendar.subtitle', 'Contadores, Tarefas e Lembretes')}</p>
        </div>
      </div>

      {/* NAVEGAÇÃO DO MÊS */}
      <div className="flex items-center justify-between mb-4 bg-gray-800 rounded-2xl p-3 border border-gray-700 shadow-md">
        <button onClick={goToPrevMonth} className="p-2 rounded-xl bg-gray-900 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={goToToday} className="text-center px-2">
          <h3 className="text-lg font-black text-white capitalize">
            {MONTH_NAMES[lang][viewMonth]} {viewYear}
          </h3>
          <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">
            {t('calendar.goToToday', 'Ir para Hoje')}
          </span>
        </button>
        <button onClick={goToNextMonth} className="p-2 rounded-xl bg-gray-900 text-gray-400 hover:text-white transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* CABEÇALHO DOS DIAS DA SEMANA */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAY_SHORT[lang].map((d, idx) => (
          <div key={idx} className="text-center text-[10px] font-black text-gray-500 uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      {/* GRID DO CALENDÁRIO */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {monthCells.map((cell) => {
          const isToday = cell.key === todaysKey;
          const isSelected = cell.key === selectedDayKey;
          const dayCounters = countersByDate[cell.key] || [];
          const dayTasks = tasksByDate[cell.key] || [];
          const hasPendingTasks = dayTasks.some(tsk => !tsk.done);

          return (
            <button
              key={cell.key}
              onClick={() => setSelectedDayKey(cell.key)}
              className={`
                relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all
                ${cell.inMonth ? 'bg-gray-800' : 'bg-gray-900/40 opacity-40'}
                ${isSelected ? 'ring-2 ring-purple-500' : 'border border-gray-700/50'}
                ${isToday ? 'shadow-[0_0_12px_rgba(168,85,247,0.4)]' : ''}
                hover:border-purple-400/50
              `}
            >
              <span className={`text-xs sm:text-sm font-bold ${
                isToday ? 'text-purple-400' : cell.inMonth ? 'text-white' : 'text-gray-600'
              }`}>
                {cell.date.getDate()}
              </span>

              <div className="flex gap-0.5 mt-0.5 absolute bottom-1 items-center">
                {dayCounters.slice(0, 2).map((c) => {
                  const cfg = getColorConfig(c.color);
                  return <div key={`c-${c.id}`} className={`w-1.5 h-1.5 rounded-full ${cfg.bg}`} />;
                })}
                {hasPendingTasks && (
                  <div className="w-1.5 h-1.5 rounded-sm bg-blue-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* PAINEL DO DIA SELECIONADO */}
      <div className="bg-gray-800/60 rounded-2xl border border-gray-700 p-4 mb-4">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
          {new Date(selectedDayKey + 'T00:00:00').toLocaleDateString(lang, { day: '2-digit', month: 'long', year: 'numeric' })}
        </h4>

        {/* Contadores do dia */}
        {selectedDayCounters.length > 0 && (
          <div className="space-y-2 mb-4">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t('calendar.countersSection', 'Contadores')}</span>
            {selectedDayCounters.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-gray-900/60 rounded-xl p-2.5">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${getColorConfig(c.color).bg}`} />
                  <span className="text-sm text-white font-semibold">{c.title}</span>
                </div>
                <button onClick={() => setModalState({ open: true, data: c })} className="p-1.5 text-gray-400 hover:text-white">
                  <Pencil size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tarefas/Lembretes do dia */}
        <div className="space-y-2">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t('calendar.tasksSection', 'Tarefas e Lembretes')}</span>
          {selectedDayTasks.length === 0 ? (
            <p className="text-sm text-gray-500 pt-1">{t('calendar.noTasksOnDay', 'Nenhuma tarefa ou lembrete neste dia.')}</p>
          ) : (
            selectedDayTasks.map((tsk) => (
              <TaskRow
                key={tsk.id}
                task={tsk}
                onToggle={handleToggleTask}
                onEdit={(taskData) => setTaskModalState({ open: true, data: taskData })}
              />
            ))
          )}
        </div>
      </div>

      {/* BOTÕES FLUTUANTES */}
      <div className="space-y-3">
        <button
          onClick={() => setTaskModalState({ open: true, data: null })}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
        >
          <ListChecks size={20} />
          {t('calendar.addTask', 'Adicionar Tarefa / Lembrete')}
        </button>
        <button
          onClick={() => setModalState({ open: true, data: null })}
          className="w-full bg-gray-800 border-2 border-dashed border-purple-500/40 hover:bg-gray-700 text-purple-400 font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
        >
          <Plus size={18} />
          {t('calendar.addCounter', 'Adicionar Contador')}
        </button>
      </div>

      <div className="shrink-0 mt-8">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>

      {/* MENU LATERAL (DRAWER) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex animate-fade-in">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="w-[85%] max-w-sm bg-gray-950 border-l border-gray-800 h-full overflow-y-auto shadow-2xl animate-slide-in">
            <div className="sticky top-0 bg-gray-950 border-b border-gray-800 p-5 flex items-center justify-between z-10">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Flame className="text-orange-500" size={20} />
                {t('calendar.myItems', 'Meus Itens')}
              </h3>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* PENDENTES */}
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('calendar.pendingTasks', 'Pendentes')}</span>
                <div className="space-y-2 mt-2">
                  {allTasks.filter(tk => !tk.done).length === 0 ? (
                    <p className="text-sm text-gray-500 py-3">{t('calendar.noPending', 'Nenhuma pendência. 🎉')}</p>
                  ) : (
                    allTasks
                      .filter(tk => !tk.done)
                      .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
                      .map(tsk => (
                        <button
                          key={tsk.id}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setSelectedDayKey(tsk.date);
                            const [yy, mm] = tsk.date.split('-').map(Number);
                            setViewYear(yy); setViewMonth(mm - 1);
                          }}
                          className="w-full text-left bg-gray-900/60 rounded-xl p-3 flex items-center justify-between hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {tsk.type === 'reminder' ? <Bell size={14} className="text-yellow-400 shrink-0" /> : tsk.type === 'workout' ? <Dumbbell size={14} className="text-green-400 shrink-0" /> : <ListChecks size={14} className="text-blue-400 shrink-0" />}
                            <span className="text-sm text-white truncate">{tsk.title}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-bold shrink-0">{tsk.date.slice(5)}</span>
                        </button>
                      ))
                  )}
                </div>
              </div>

              {/* CONTADORES */}
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('calendar.myCounters', 'Meus Contadores')}</span>
                <div className="space-y-2 mt-2">
                  {counters.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Hourglass size={32} className="mx-auto mb-2 opacity-40" />
                      <p className="text-xs font-medium">{t('calendar.emptyCounters', 'Nenhum contador criado ainda.')}</p>
                    </div>
                  ) : (
                    counters
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((c) => (
                        <CounterCard
                          key={c.id}
                          counter={c}
                          t={t}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setSelectedDayKey(c.anchorDate);
                            const [yy, mm] = c.anchorDate.split('-').map(Number);
                            setViewYear(yy);
                            setViewMonth(mm - 1);
                          }}
                        />
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAIS */}
      {modalState.open && (
        <CounterFormModal
          initialData={modalState.data}
          onClose={() => setModalState({ open: false, data: null })}
          onSave={handleSaveCounter}
          onDelete={handleDeleteCounter}
          t={t}
        />
      )}

      {taskModalState.open && (
        <TaskFormModal
          initialData={taskModalState.data}
          defaultDate={selectedDayKey}
          onClose={() => setTaskModalState({ open: false, data: null })}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          t={t}
        />
      )}
    </div>
  );
}