// src/data/vocabSpeechLevels.js
import { vocabulariesLevels } from './vocabulariesLevels';

// 1. Reaproveitamos os níveis básicos (1 a 5) do vocabulário Normal
const basicLevels = {
  1: vocabulariesLevels[1],
  2: vocabulariesLevels[2],
  3: vocabulariesLevels[3],
  4: vocabulariesLevels[4],
  5: vocabulariesLevels[5],
};

// 2. Criamos níveis novos e exclusivos para o modo Speech (Fala e Escuta)
const speechExclusiveLevels = {
  6: {
    id: 6,
    title: {
      pt: "A2 - Sobrevivência e Conversação",
      en: "A2 - Survival & Small Talk",
      es: "A2 - Supervivencia y Charla"
    },
    group: ['A2'],
    words: [
      // Expressões Novas Focadas em Comunicação Oral
      { en: 'What do you mean?', pt: ['como assim?', 'o que você quer dizer?'], es: ['¿qué quieres decir?', '¿cómo así?'], category: 'Sobrevivência' },
      { en: 'Can you repeat, please?', pt: ['você pode repetir, por favor?'], es: ['¿puedes repetir, por favor?'], category: 'Sobrevivência' },
      { en: 'Speak slowly', pt: ['fale devagar'], es: ['habla despacio'], category: 'Sobrevivência' },
      { en: 'I don\'t understand', pt: ['eu não entendo', 'não entendi'], es: ['no entiendo'], category: 'Sobrevivência' },
      { en: 'Make sense', pt: ['faz sentido'], es: ['tiene sentido'], category: 'Expressões' },
      
      // Reaproveitamento para contexto
      { en: 'Sorry', pt: ['desculpa', 'perdão'], es: ['lo siento'], category: 'Revisão (A1)' },
      { en: 'Fast', pt: ['rápido', 'rapido'], es: ['rápido'], category: 'Revisão (A1)' },
      
      // Frases combinadas para a prática da fala
      { en: 'Sorry, I don\'t understand', pt: ['desculpa, eu não entendo', 'foi mal, não entendi'], es: ['lo siento, no entiendo'], category: 'Frases' },
      { en: 'You speak very fast', pt: ['você fala muito rápido'], es: ['tú hablas muy rápido'], category: 'Frases' },
      { en: 'That makes sense', pt: ['isso faz sentido'], es: ['eso tiene sentido'], category: 'Frases' }
    ]
  },
  7: {
    id: 7,
    title: {
      pt: "A2 - Fala Conectada (Informal)",
      en: "A2 - Connected Speech (Slang)",
      es: "A2 - Habla Conectada (Informal)"
    },
    group: ['A2'],
    words: [
      // Palavras Novas de Fala Conectada
      { en: 'Gonna', pt: ['vou', 'indo'], es: ['voy a'], category: 'Fala Conectada' },
      { en: 'Wanna', pt: ['quero'], es: ['quiero'], category: 'Fala Conectada' },
      { en: 'Gotta', pt: ['tenho que', 'preciso'], es: ['tengo que'], category: 'Fala Conectada' },
      { en: 'Lemme', pt: ['deixa eu', 'me deixa'], es: ['déjame'], category: 'Fala Conectada' },
      { en: 'Gimme', pt: ['me dá', 'me da'], es: ['dame'], category: 'Fala Conectada' },
      
      // Reaproveitamento
      { en: 'To go', pt: ['ir'], es: ['ir'], category: 'Revisão (A1)' },
      { en: 'Coffee', pt: ['café', 'cafe'], es: ['café'], category: 'Revisão (A1)' },
      { en: 'To sleep', pt: ['dormir'], es: ['dormir'], category: 'Revisão (A1)' },
      
      // Frases prontas para treinar o sotaque e fluidez
      { en: 'I am gonna go', pt: ['eu vou', 'eu irei'], es: ['yo voy a ir'], category: 'Frases' },
      { en: 'I wanna coffee', pt: ['eu quero um café', 'quero café'], es: ['yo quiero un café'], category: 'Frases' },
      { en: 'I gotta sleep', pt: ['eu tenho que dormir', 'preciso dormir'], es: ['tengo que dormir'], category: 'Frases' },
      { en: 'Gimme a coffee, please', pt: ['me dá um café por favor', 'me da um café por favor'], es: ['dame un café por favor'], category: 'Frases' }
    ]
  }
};

// 3. Juntamos tudo em um único objeto exportado
export const vocabSpeechLevels = { ...basicLevels, ...speechExclusiveLevels };