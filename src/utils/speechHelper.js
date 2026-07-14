// src/utils/speechHelper.js
// TTS que respeita o idioma do app para a "narração" (teoria/instruções),
// mas SEMPRE lê frases/exemplos em inglês com voz en-IE — sem misturar
// pronúncia. Cada trecho do texto é falado com o locale correto.

const LOCALE_MAP = { pt: 'pt-BR', en: 'en-IE', es: 'es-ES' };

const cleanForSpeech = (text) =>
  String(text || '')
    .replace(/\([^)]*\)/g, '') // remove "(I would)" antes de falar a abreviação
    .replace(/["“”]/g, '')
    .trim();

// Fala um texto no idioma da UI (pt/es) — usado para teoria/explicações/instruções.
export const speakInUiLang = (text, uiLang = 'pt', rate = 0.95) => {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(cleanForSpeech(text));
  utt.lang = LOCALE_MAP[uiLang] || 'pt-BR';
  utt.rate = rate;
  window.speechSynthesis.speak(utt);
};

// Fala sempre em inglês (exemplos, frases-alvo, palavras a decorar).
export const speakInEnglish = (text, rate = 0.9) => {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(cleanForSpeech(text));
  utt.lang = 'en-IE';
  utt.rate = rate;
  window.speechSynthesis.speak(utt);
};

// Fala uma sequência de utterances em fila (ex: teoria em pt, depois cada exemplo em en)
export const speakSequence = (segments = []) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  segments.forEach(({ text, lang, rate = 0.9 }) => {
    if (!text) return;
    const utt = new SpeechSynthesisUtterance(cleanForSpeech(text));
    utt.lang = lang === 'en' ? 'en-IE' : (LOCALE_MAP[lang] || 'pt-BR');
    utt.rate = rate;
    window.speechSynthesis.speak(utt);
  });
};