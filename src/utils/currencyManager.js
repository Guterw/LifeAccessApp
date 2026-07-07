// src/utils/currencyManager.js
import { db } from '../config/dexieDb';

const RATE_MAX_AGE_MS = 60 * 60 * 1000; // 1 hora de cache local

// Voltamos aos endpoints da ExchangeRate-API que estão validados no teu ecossistema.
// Usam CDN global de alta disponibilidade e têm CORS 100% aberto para navegadores.
const PRIMARY_API_URL = 'https://open.er-api.com/v6/latest/BRL';
const SECONDARY_API_URL = 'https://api.exchangerate-api.com/v4/latest/BRL';

// Taxa aproximada de IOF sobre operações de câmbio/cartão internacional no Brasil.
export const APPROX_IOF_RATE = 0.035; // 3,5%

export const getExchangeRates = async (forceRefresh = false) => {
  const settings = (await db.appSettings.get(1)) || { id: 1 };
  const isStale =
    !settings.exchangeRateUpdatedAt ||
    Date.now() - new Date(settings.exchangeRateUpdatedAt).getTime() > RATE_MAX_AGE_MS;

  // Estratégia Offline-First: Se o cache ainda for válido, não gasta rede
  if (!forceRefresh && !isStale && settings.exchangeRateBRLtoEUR && settings.exchangeRateEURtoBRL) {
    return {
      brlToEur: settings.exchangeRateBRLtoEUR,
      eurToBrl: settings.exchangeRateEURtoBRL,
      updatedAt: settings.exchangeRateUpdatedAt,
      source: settings.exchangeRateSource || 'ExchangeRate-API (cache)',
    };
  }

  // TENTATIVA 1: API Principal (v6 open)
  try {
    const res = await fetch(PRIMARY_API_URL);
    if (!res.ok) throw new Error(`Mecanismo principal retornou status HTTP ${res.status}`);
    const data = await res.json();

    const brlToEur = data?.rates?.EUR;
    if (brlToEur) {
      const eurToBrl = 1 / brlToEur; // Cálculo estável baseado na taxa mid-market
      const updatedAt = new Date().toISOString();
      const source = 'ExchangeRate-API (v6)';

      settings.exchangeRateBRLtoEUR = brlToEur;
      settings.exchangeRateEURtoBRL = eurToBrl;
      settings.exchangeRateUpdatedAt = updatedAt;
      settings.exchangeRateSource = source;
      await db.appSettings.put(settings);

      return { brlToEur, eurToBrl, updatedAt, source };
    }
  } catch (primaryErr) {
    console.warn('[currencyManager] API Principal falhou. A tentar endpoint de contingência...', primaryErr);

    // TENTATIVA 2: Fallback para a API Secundária (v4 que tu usavas antes)
    try {
      const res = await fetch(SECONDARY_API_URL);
      if (!res.ok) throw new Error(`Mecanismo de contingência retornou status HTTP ${res.status}`);
      const data = await res.json();

      const brlToEur = data?.rates?.EUR;
      if (brlToEur) {
        const eurToBrl = 1 / brlToEur;
        const updatedAt = new Date().toISOString();
        const source = 'ExchangeRate-API (v4 Contingência)';

        settings.exchangeRateBRLtoEUR = brlToEur;
        settings.exchangeRateEURtoBRL = eurToBrl;
        settings.exchangeRateUpdatedAt = updatedAt;
        settings.exchangeRateSource = source;
        await db.appSettings.put(settings);

        return { brlToEur, eurToBrl, updatedAt, source };
      }
    } catch (secondaryErr) {
      console.error('[currencyManager] Erro crítico: Todos os serviços de cotação falharam:', secondaryErr);
    }
  }

  // TENTATIVA 3: Fallback Offline Total (Usa os dados antigos salvos no Dexie para não quebrar o ecrã)
  return {
    brlToEur: settings.exchangeRateBRLtoEUR || null,
    eurToBrl: settings.exchangeRateEURtoBRL || null,
    updatedAt: settings.exchangeRateUpdatedAt || null,
    source: settings.exchangeRateSource ? `${settings.exchangeRateSource} (Offline)` : 'cache local indisponível',
  };
};

// Mantido por compatibilidade com quem só precisa de uma direção (BRL -> EUR)
export const getExchangeRateBRLtoEUR = async (forceRefresh = false) => {
  const { brlToEur } = await getExchangeRates(forceRefresh);
  return brlToEur;
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
  const settings = (await db.appSettings.get(1)) || { id: 1 };
  settings.primaryCurrency = currency;
  await db.appSettings.put(settings);
};

export const CURRENCY_SYMBOLS = { BRL: 'R$', EUR: '€' };

export const formatCurrencyValue = (value, currency) => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol} ${Number(value || 0).toFixed(2).replace('.', ',')}`;
};