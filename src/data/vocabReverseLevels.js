// src/data/vocabReverseLevels.js
import { vocabulariesLevels } from './vocabulariesLevels';

// 1. Reaproveitamos os níveis básicos (1 a 5) do vocabulário Normal
const basicLevels = {
  1: vocabulariesLevels[1],
  2: vocabulariesLevels[2],
  3: vocabulariesLevels[3],
  4: vocabulariesLevels[4],
  5: vocabulariesLevels[5],
};

// 2. Criamos níveis novos e exclusivos para o modo Reverse (Tradução Reversa)
const reverseExclusiveLevels = {
  6: {
    id: 6,
    title: {
      pt: "A2 - Falsos Cognatos e Pegadinhas",
      en: "A2 - False Friends & Tricky Words",
      es: "A2 - Falsos Amigos y Trampas"
    },
    group: ['A2'],
    words: [
      // Palavras Novas Focadas no Reverse
      { en: 'Actually', pt: ['na verdade'], es: ['en realidad'], category: 'Falsos Cognatos' },
      { en: 'Pretend', pt: ['fingir'], es: ['fingir'], category: 'Falsos Cognatos' },
      { en: 'Intend', pt: ['pretender', 'ter a intenção'], es: ['tener la intención'], category: 'Falsos Cognatos' },
      { en: 'Push', pt: ['empurrar'], es: ['empujar'], category: 'Ação' },
      { en: 'Pull', pt: ['puxar'], es: ['tirar'], category: 'Ação' },
      { en: 'Lunch', pt: ['almoço', 'almoco'], es: ['almuerzo'], category: 'Falsos Cognatos' },
      { en: 'Snack', pt: ['lanche'], es: ['merienda'], category: 'Falsos Cognatos' },
      
      // Reaproveitamento do básico (misturado para revisão)
      { en: 'To eat', pt: ['comer'], es: ['comer'], category: 'Revisão (A1)' },
      { en: 'Water', pt: ['água', 'agua'], es: ['agua'], category: 'Revisão (A1)' },
      
      // Frases aplicando as pegadinhas
      { en: 'I actually want water', pt: ['na verdade eu quero água'], es: ['en realidad quiero agua'], category: 'Frases' },
      { en: 'Do not push the door', pt: ['não empurre a porta', 'nao empurre a porta'], es: ['no empujes la puerta'], category: 'Frases' }
    ]
  },
  7: {
    id: 7,
    title: {
      pt: "A2 - Preposições de Tempo e Lugar",
      en: "A2 - Time & Place Prepositions",
      es: "A2 - Preposiciones de Tiempo y Lugar"
    },
    group: ['A2'],
    words: [
      // Palavras Novas
      { en: 'In', pt: ['em', 'dentro', 'no', 'na'], es: ['en', 'dentro'], category: 'Preposições' },
      { en: 'On', pt: ['em', 'sobre', 'em cima', 'no', 'na'], es: ['en', 'sobre'], category: 'Preposições' },
      { en: 'At', pt: ['em', 'às', 'no', 'na'], es: ['en', 'a las'], category: 'Preposições' },
      
      // Reaproveitamento do básico para criar contexto
      { en: 'House', pt: ['casa'], es: ['casa'], category: 'Revisão (A1)' },
      { en: 'Monday', pt: ['segunda-feira', 'segunda'], es: ['lunes'], category: 'Revisão (A1)' },
      { en: 'Night', pt: ['noite'], es: ['noche'], category: 'Revisão (A1)' },
      
      // Frases combinando o novo e o velho
      { en: 'I am at home', pt: ['eu estou em casa', 'estou em casa'], es: ['estoy en casa'], category: 'Frases' },
      { en: 'See you on Monday', pt: ['te vejo na segunda', 'vejo você na segunda'], es: ['te veo el lunes'], category: 'Frases' },
      { en: 'I sleep at night', pt: ['eu durmo de noite', 'eu durmo à noite'], es: ['yo duermo de noche'], category: 'Frases' }
    ]
  }
};

// 3. Juntamos tudo em um único objeto exportado
export const vocabReverseLevels = { ...basicLevels, ...reverseExclusiveLevels };