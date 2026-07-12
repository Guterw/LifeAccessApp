// src/data/dictationTexts.js
// Textos curtos de alta frequência para o módulo de Ditado (Speech-to-Text livre)

const buildWords = (text) => text.split(/\s+/).filter(Boolean);

const RAW_TEXTS = [
  {
    id: 'dict_1',
    title: { pt: 'Minha Manhã', en: 'My Morning', es: 'Mi Mañana' },
    difficulty: 'A1',
    text: 'I wake up early. I drink coffee. I go to work. I like my job. I am happy today.',
    timeLimitSeconds: 90,
  },
  {
    id: 'dict_2',
    title: { pt: 'No Café', en: 'At the Cafe', es: 'En el Café' },
    difficulty: 'A1',
    text: 'Can I have a coffee please. I would like a water too. How much is it. Thank you very much.',
    timeLimitSeconds: 90,
  },
  {
    id: 'dict_3',
    title: { pt: 'Minha Família', en: 'My Family', es: 'Mi Familia' },
    difficulty: 'A1',
    text: 'This is my family. My mother is kind. My father works hard. I love my brother and my sister.',
    timeLimitSeconds: 100,
  },
  {
    id: 'dict_4',
    title: { pt: 'Pedindo Direções', en: 'Asking for Directions', es: 'Pidiendo Direcciones' },
    difficulty: 'A2',
    text: 'Excuse me. Where is the bus stop. Go straight and turn right. It is next to the pub. Thank you for your help.',
    timeLimitSeconds: 110,
  },
  {
    id: 'dict_5',
    title: { pt: 'Entrevista de Emprego', en: 'Job Interview', es: 'Entrevista de Trabajo' },
    difficulty: 'A2',
    text: 'I have experience in customer service. I am a fast learner. I can work under pressure. I am available full time.',
    timeLimitSeconds: 110,
  },
  {
    id: 'dict_6',
    title: { pt: 'No Trabalho', en: 'At Work', es: 'En el Trabajo' },
    difficulty: 'B1',
    text: 'My manager gave me a new task today. I need to finish it before the deadline. I can handle this problem on my own. Teamwork makes everything easier.',
    timeLimitSeconds: 130,
  },
  {
    id: 'dict_7',
    title: { pt: 'Vida em Dublin', en: 'Life in Dublin', es: 'Vida en Dublín' },
    difficulty: 'B1',
    text: 'Living in Dublin is a great experience. The weather changes very fast. People are friendly and helpful. I am learning something new every single day.',
    timeLimitSeconds: 130,
  },
];

export const DICTATION_TEXTS = RAW_TEXTS.map((item) => ({
  ...item,
  words: buildWords(item.text),
}));