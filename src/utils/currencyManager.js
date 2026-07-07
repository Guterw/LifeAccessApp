// src/utils/currencyManager.js
import { db } from '../config/dexieDb';

const RATE_MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6 horas

// Busca a cotação real BRL -> EUR usando a API gratuita e sem chave da Frankfurter,
// e guarda em cache no appSettings para não bater na API a cada cálculo.
export const getExchangeRateBRLtoEUR = async (forceRefresh = false) => {
  const settings = await db.appSettings.get(1) || { id: 1 };
  const isStale = !settings.exchangeRateUpdatedAt ||
    (Date.now() - new Date(settings.exchangeRateUpdatedAt).getTime()) > RATE_MAX_AGE_MS;

  if (!forceRefresh && !isStale && settings.exchangeRateBRLtoEUR) {
    return settings.exchangeRateBRLtoEUR;
  }

  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=BRL&to=EUR');
    const data = await res.json();
    const rate = data?.rates?.EUR;
    if (rate) {
      settings.exchangeRateBRLtoEUR = rate;
      settings.exchangeRateUpdatedAt = new Date().toISOString();
      await db.appSettings.put(settings);
      return rate;
    }
  } catch (err) {
    console.error('[currencyManager] Erro ao buscar cotação:', err);
  }

  // Se a busca falhar, usa a última cotação salva (se houver) em vez de travar os cálculos.
  return settings.exchangeRateBRLtoEUR || 0.17;
};

export const convertCurrency = (amount, fromCurrency, toCurrency, rateBRLtoEUR) => {
  const value = Number(amount) || 0;
  if (fromCurrency === toCurrency) return value;
  if (fromCurrency === 'BRL' && toCurrency === 'EUR') return value * rateBRLtoEUR;
  if (fromCurrency === 'EUR' && toCurrency === 'BRL') return value / rateBRLtoEUR;
  return value;
};

export const getPrimaryCurrency = async () => {
  const settings = await db.appSettings.get(1);
  return settings?.primaryCurrency || 'BRL';
};

export const setPrimaryCurrency = async (currency) => {
  const settings = await db.appSettings.get(1) || { id: 1 };
  settings.primaryCurrency = currency;
  await db.appSettings.put(settings);
};

export const CURRENCY_SYMBOLS = { BRL: 'R$', EUR: '€' };

export const formatCurrencyValue = (value, currency) => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol} ${Number(value || 0).toFixed(2).replace('.', ',')}`;
};