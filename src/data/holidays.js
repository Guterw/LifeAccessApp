// src/data/holidays.js

// ============================================
// Holiday utilities
// Funciona de forma dinâmica para qualquer ano
// ============================================

function pad(value) {
  return String(value).padStart(2, '0');
}

function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function nthWeekdayOfMonth(year, month, weekday, nth) {
  const first = new Date(year, month, 1);
  while (first.getDay() !== weekday) {
    first.setDate(first.getDate() + 1);
  }
  first.setDate(first.getDate() + (nth - 1) * 7);
  return first;
}

function lastWeekdayOfMonth(year, month, weekday) {
  const last = new Date(year, month + 1, 0);
  while (last.getDay() !== weekday) {
    last.setDate(last.getDate() - 1);
  }
  return last;
}

// Algoritmo Meeus/Jones/Butcher para o Domingo de Páscoa
function getEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
}

function easterMonday(year) {
  const easter = getEasterSunday(year);
  easter.setDate(easter.getDate() + 1);
  return easter;
}

function firstMondayAugust(year) {
  return nthWeekdayOfMonth(year, 7, 1, 1);
}

function addHoliday(list, date, pt, en, es, options = {}) {
  list.push({
    date: typeof date === 'string' ? date : toDateKey(date),
    national: options.national ?? true,
    region: options.region ?? null,
    name: { pt, en, es },
  });
}

// ============================================
// IRELAND
// ============================================
function getIrelandHolidays(year, region = null) {
  const list = [];

  addHoliday(list, `${year}-01-01`, 'Ano Novo', "New Year's Day", 'Año Nuevo');

  // St. Brigid's Day (1º de Fev ou primeira segunda-feira)
  const feb = new Date(year, 1, 1);
  if (feb.getDay() === 1) {
    addHoliday(list, feb, 'Dia de Santa Brígida', "St. Brigid's Day", 'Día de Santa Brígida');
  } else {
    addHoliday(list, nthWeekdayOfMonth(year, 1, 1, 1), 'Dia de Santa Brígida', "St. Brigid's Day", 'Día de Santa Brígida');
  }

  addHoliday(list, `${year}-03-17`, 'Dia de São Patrício', "St. Patrick's Day", 'Día de San Patricio');
  addHoliday(list, easterMonday(year), 'Segunda-feira de Páscoa', 'Easter Monday', 'Lunes de Pascua');
  addHoliday(list, nthWeekdayOfMonth(year, 4, 1, 1), 'Feriado Bancário de Maio', 'May Bank Holiday', 'Bank Holiday de Mayo');
  addHoliday(list, nthWeekdayOfMonth(year, 5, 1, 1), 'Feriado Bancário de Junho', 'June Bank Holiday', 'Bank Holiday de Junio');
  addHoliday(list, firstMondayAugust(year), 'Feriado Bancário de Agosto', 'August Bank Holiday', 'Bank Holiday de Agosto');
  addHoliday(list, lastWeekdayOfMonth(year, 9, 1), 'Feriado Bancário de Outubro', 'October Bank Holiday', 'Bank Holiday de Octubre');
  addHoliday(list, `${year}-12-25`, 'Natal', 'Christmas Day', 'Navidad');
  addHoliday(list, `${year}-12-26`, 'Dia de São Estêvão', "St. Stephen's Day", 'Día de San Esteban');

  // Dublin Regional
  if (region === 'DUBLIN') {
    addHoliday(list, firstMondayAugust(year), 'Festival de Dublin', 'Dublin Civic Holiday', 'Fiesta Cívica de Dublín', {
      national: false,
      region: 'DUBLIN',
    });
  }

  return list;
}

// ============================================
// BRAZIL
// ============================================
function getBrazilHolidays(year) {
  const list = [];
  addHoliday(list, `${year}-01-01`, 'Confraternização Universal', "New Year's Day", 'Año Nuevo');
  addHoliday(list, `${year}-04-21`, 'Tiradentes', "Tiradentes' Day", 'Tiradentes');
  addHoliday(list, `${year}-09-07`, 'Independência do Brasil', 'Independence Day', 'Día de la Independencia');
  addHoliday(list, `${year}-10-12`, 'Nossa Senhora Aparecida', 'Our Lady of Aparecida', 'Nuestra Señora Aparecida');
  addHoliday(list, `${year}-11-02`, 'Finados', "All Souls' Day", 'Día de los Difuntos');
  addHoliday(list, `${year}-11-15`, 'Proclamação da República', 'Republic Day', 'Proclamación de la República');
  addHoliday(list, `${year}-12-25`, 'Natal', 'Christmas', 'Navidad');
  return list;
}

// ============================================
// PORTUGAL
// ============================================
function getPortugalHolidays(year) {
  const list = [];
  addHoliday(list, `${year}-01-01`, 'Ano Novo', "New Year's Day", 'Año Nuevo');
  addHoliday(list, `${year}-06-10`, 'Dia de Portugal', 'Portugal Day', 'Día de Portugal');
  addHoliday(list, `${year}-10-05`, 'Implantação da República', 'Republic Implantation', 'Implantación de la República');
  addHoliday(list, `${year}-12-01`, 'Restauração da Independência', 'Restoration of Independence', 'Restauración de la Independencia');
  addHoliday(list, `${year}-12-25`, 'Natal', 'Christmas', 'Navidad');
  return list;
}

// ============================================
// API DINÂMICA (Para qualquer ano)
// ============================================
export function getHolidays(country, year, region = null) {
  switch ((country || 'IE').toUpperCase()) {
    case 'BR': return getBrazilHolidays(year);
    case 'PT': return getPortugalHolidays(year);
    case 'IE':
    default: return getIrelandHolidays(year, region);
  }
}

export function getHoliday(dateKey, country, region = null) {
  const year = Number(dateKey.slice(0, 4));
  return getHolidays(country, year, region).find(holiday => holiday.date === dateKey);
}

export function isHoliday(dateKey, country, region = null) {
  return !!getHoliday(dateKey, country, region);
}

// ============================================
// RETROCOMPATIBILIDADE (Objeto Estático 2026)
// Resolve erros de importação antigos (SyntaxError)
// ============================================
export const HOLIDAYS = {
  IE: getIrelandHolidays(2026, 'DUBLIN'),
  BR: getBrazilHolidays(2026),
  PT: getPortugalHolidays(2026),
};