// src/utils/speechHelper.js
// TTS que respeita o idioma do app para a "narração" (teoria/instruções),
// mas SEMPRE lê palavras/trechos em inglês (mesmo no meio de uma frase em
// português/espanhol) com voz en-IE — sem misturar pronúncia.
//
// Além disso, tenta selecionar uma voz masculina de pt-BR mais natural
// (evitando a voz robótica padrão), e usa uma taxa de fala um pouco mais
// lenta para respeitar melhor as pontuações e pausas.

const LOCALE_MAP = { pt: 'pt-BR', en: 'en-IE', es: 'es-ES' };

const cleanForSpeech = (text) =>
  String(text || '')
    .replace(/["“”]/g, '')
    .trim();

// ==========================================
// SELEÇÃO DE VOZ
// ==========================================
// Cache simples para não varrer a lista de vozes a cada chamada (getVoices()
// pode devolver array vazio na primeira chamada em alguns navegadores até o
// evento 'voiceschanged' disparar — por isso relemos toda vez que for null).
let cachedVoices = null;

const getVoices = () => {
  if (!window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length) cachedVoices = voices;
  return cachedVoices || voices || [];
};

// Nomes conhecidos de vozes MASCULINAS de pt-BR em diferentes engines
// (Chrome/Android, Edge/Windows, Safari/iOS). A ordem é a prioridade.
const MALE_PT_BR_HINTS = [
  'daniel', 'ricardo', 'felipe', 'antonio', 'diego', 'thiago', 'google português do brasil',
  'microsoft daniel', 'microsoft antonio', 'luiz', 'male',
];

const FEMALE_PT_BR_HINTS = ['luciana', 'maria', 'francisca', 'female', 'joana', 'camila'];

const pickVoiceForLocale = (localeCode) => {
  const voices = getVoices();
  if (!voices.length) return null;

  const localeMatches = voices.filter((v) => v.lang?.toLowerCase().startsWith(localeCode.toLowerCase().slice(0, 2)));
  if (!localeMatches.length) return null;

  if (localeCode.toLowerCase() === 'pt-br') {
    // 1) Tenta achar uma voz cujo nome bata com dicas de voz masculina
    const male = localeMatches.find((v) =>
      MALE_PT_BR_HINTS.some((hint) => v.name.toLowerCase().includes(hint))
    );
    if (male) return male;

    // 2) Evita explicitamente vozes conhecidas como femininas
    const notFemale = localeMatches.find((v) =>
      !FEMALE_PT_BR_HINTS.some((hint) => v.name.toLowerCase().includes(hint))
    );
    if (notFemale) return notFemale;
  }

  // Fallback: primeira voz disponível para o idioma
  return localeMatches[0];
};

const applyVoiceAndLang = (utterance, localeCode) => {
  utterance.lang = localeCode;
  const voice = pickVoiceForLocale(localeCode);
  if (voice) utterance.voice = voice;
};

// Garante que a lista de vozes já foi carregada (assíncrono em muitos navegadores)
export const primeVoices = () => {
  if (!window.speechSynthesis) return;
  getVoices();
  if (!cachedVoices || !cachedVoices.length) {
    window.speechSynthesis.onvoiceschanged = () => { getVoices(); };
  }
};

// ==========================================
// DETECÇÃO DE TRECHOS EM INGLÊS DENTRO DO TEXTO
// ==========================================
// Qualquer trecho entre aspas (simples ou duplas) é tratado como inglês,
// já que é assim que os exemplos em inglês aparecem embutidos nas
// explicações em pt/es (ex: Fale "ei" no microfone.). O restante do texto
// é lido no idioma da UI. Isso evita pronúncia errada de palavras em
// inglês no meio de uma frase em português.
const splitMixedLangSegments = (text, uiLang) => {
  const str = String(text || '');
  const regex = /["“]([^"”]+)["”]|'([^']+)'/g;
  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      const before = str.slice(lastIndex, match.index);
      if (before.trim()) segments.push({ text: before, lang: uiLang });
    }
    const inner = match[1] || match[2] || '';
    if (inner.trim()) segments.push({ text: inner, lang: 'en' });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    const rest = str.slice(lastIndex);
    if (rest.trim()) segments.push({ text: rest, lang: uiLang });
  }

  return segments.length ? segments : [{ text: str, lang: uiLang }];
};

// Fala um texto no idioma da UI (pt/es) — usado para teoria/explicações/instruções.
// Detecta automaticamente trechos entre aspas (geralmente exemplos/palavras
// em inglês) e os fala com a voz correta em inglês, preservando as pausas
// naturais entre os pedaços da frase.
export const speakInUiLang = (text, uiLang = 'pt', rate = 0.88) => {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();

  const segments = splitMixedLangSegments(cleanForSpeech(text), uiLang);

  segments.forEach(({ text: segText, lang }) => {
    if (!segText.trim()) return;
    const utt = new SpeechSynthesisUtterance(segText.trim());
    const locale = lang === 'en' ? 'en-IE' : (LOCALE_MAP[lang] || 'pt-BR');
    applyVoiceAndLang(utt, locale);
    utt.rate = lang === 'en' ? 0.92 : rate;
    utt.pitch = 1;
    window.speechSynthesis.speak(utt);
  });
};

// Fala sempre em inglês (exemplos, frases-alvo, palavras a decorar).
export const speakInEnglish = (text, rate = 0.9) => {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(cleanForSpeech(text));
  applyVoiceAndLang(utt, 'en-IE');
  utt.rate = rate;
  window.speechSynthesis.speak(utt);
};

// Fala uma sequência de utterances em fila (ex: teoria em pt, depois cada
// exemplo em en). Cada segmento de idioma 'pt'/'es' também passa pela
// detecção de trechos em inglês entre aspas, para não misturar pronúncia.
export const speakSequence = (segments = []) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  segments.forEach(({ text, lang, rate }) => {
    if (!text) return;

    if (lang === 'en') {
      const utt = new SpeechSynthesisUtterance(cleanForSpeech(text));
      applyVoiceAndLang(utt, 'en-IE');
      utt.rate = rate || 0.92;
      window.speechSynthesis.speak(utt);
      return;
    }

    const uiLangCode = lang || 'pt';
    const subSegments = splitMixedLangSegments(cleanForSpeech(text), uiLangCode);
    subSegments.forEach(({ text: subText, lang: subLang }) => {
      if (!subText.trim()) return;
      const utt = new SpeechSynthesisUtterance(subText.trim());
      const locale = subLang === 'en' ? 'en-IE' : (LOCALE_MAP[subLang] || 'pt-BR');
      applyVoiceAndLang(utt, locale);
      utt.rate = subLang === 'en' ? 0.92 : (rate || 0.88);
      window.speechSynthesis.speak(utt);
    });
  });
};