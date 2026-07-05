// src/utils/calendarUtils.js

// Formata uma Date em 'YYYY-MM-DD' respeitando o horário LOCAL (evita bug de fuso do toISOString)
export const toDateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const todayKey = () => toDateKey(new Date());

// Diferença em dias inteiros entre duas datas (ignorando horário)
export const diffInDays = (fromKey, toKeyStr) => {
  const [fy, fm, fd] = fromKey.split('-').map(Number);
  const [ty, tm, td] = toKeyStr.split('-').map(Number);
  const fromUTC = Date.UTC(fy, fm - 1, fd);
  const toUTC = Date.UTC(ty, tm - 1, td);
  return Math.round((toUTC - fromUTC) / (1000 * 60 * 60 * 24));
};

// Monta a matriz de dias visíveis no calendário para um dado mês/ano,
// incluindo os dias "fantasmas" do mês anterior/seguinte para completar as semanas.
export const buildMonthMatrix = (year, month) => {
  // month é 0-indexado (0 = Janeiro)
  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = firstDayOfMonth.getDay(); // 0 = Domingo

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  // Dias do mês anterior (cinza/desabilitados)
  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day);
    cells.push({ date, inMonth: false, key: toDateKey(date) });
  }

  // Dias do mês atual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    cells.push({ date, inMonth: true, key: toDateKey(date) });
  }

  // Completa até fechar múltiplos de 7 (geralmente 5 ou 6 semanas)
  while (cells.length % 7 !== 0) {
    const lastDate = cells[cells.length - 1].date;
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + 1);
    cells.push({ date: nextDate, inMonth: false, key: toDateKey(nextDate) });
  }

  return cells;
};

export const MONTH_NAMES = {
  pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
};

export const WEEKDAY_SHORT = {
  pt: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  es: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
};

// Paleta de cores disponível para os contadores
export const COUNTER_COLORS = [
  { id: 'purple', bg: 'bg-purple-500', text: 'text-purple-400', ring: 'ring-purple-500', soft: 'bg-purple-500/10 border-purple-500/30' },
  { id: 'green', bg: 'bg-green-500', text: 'text-green-400', ring: 'ring-green-500', soft: 'bg-green-500/10 border-green-500/30' },
  { id: 'blue', bg: 'bg-blue-500', text: 'text-blue-400', ring: 'ring-blue-500', soft: 'bg-blue-500/10 border-blue-500/30' },
  { id: 'orange', bg: 'bg-orange-500', text: 'text-orange-400', ring: 'ring-orange-500', soft: 'bg-orange-500/10 border-orange-500/30' },
  { id: 'pink', bg: 'bg-pink-500', text: 'text-pink-400', ring: 'ring-pink-500', soft: 'bg-pink-500/10 border-pink-500/30' },
  { id: 'yellow', bg: 'bg-yellow-500', text: 'text-yellow-500', ring: 'ring-yellow-500', soft: 'bg-yellow-500/10 border-yellow-500/30' },
  { id: 'red', bg: 'bg-red-500', text: 'text-red-400', ring: 'ring-red-500', soft: 'bg-red-500/10 border-red-500/30' },
  { id: 'teal', bg: 'bg-teal-500', text: 'text-teal-400', ring: 'ring-teal-500', soft: 'bg-teal-500/10 border-teal-500/30' },
];

export const getColorConfig = (colorId) => COUNTER_COLORS.find(c => c.id === colorId) || COUNTER_COLORS[0];