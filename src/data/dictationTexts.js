// src/data/dictationTexts.js
// Textos de alta frequência para o módulo de Ditado — agora bem maiores,
// cheios de contrações reais do dia a dia (I'd, wanna, gimme, etc.) com
// a forma completa entre parênteses para consulta, e tradução (exibida
// bem discreta abaixo do texto).

const buildWords = (text) => text.split(/\s+/).filter(Boolean);

// Mapa de contrações/gírias -> forma completa, usado só para EXIBIÇÃO
// (o reconhecimento de voz continua comparando a forma falada real).
const CONTRACTIONS = {
  "i'd": "I would / I had",
  "i'll": "I will",
  "i'm": "I am",
  "i've": "I have",
  "you're": "you are",
  "you'll": "you will",
  "you've": "you have",
  "he's": "he is / he has",
  "she's": "she is / she has",
  "it's": "it is / it has",
  "we're": "we are",
  "we'll": "we will",
  "we've": "we have",
  "they're": "they are",
  "they'll": "they will",
  "they've": "they have",
  "that's": "that is",
  "there's": "there is",
  "here's": "here is",
  "what's": "what is",
  "who's": "who is",
  "don't": "do not",
  "doesn't": "does not",
  "didn't": "did not",
  "can't": "cannot",
  "won't": "will not",
  "wouldn't": "would not",
  "shouldn't": "should not",
  "couldn't": "could not",
  "isn't": "is not",
  "aren't": "are not",
  "wasn't": "was not",
  "weren't": "were not",
  "hasn't": "has not",
  "haven't": "have not",
  "hadn't": "had not",
  "gonna": "going to",
  "wanna": "want to",
  "gotta": "got to",
  "gimme": "give me",
  "lemme": "let me",
  "kinda": "kind of",
  "sorta": "sort of",
  "dunno": "don't know",
  "ain't": "am not / is not / are not",
  "y'all": "you all",
  "c'mon": "come on",
  "let's": "let us",
  "how's": "how is",
  "where's": "where is",
  "could've": "could have",
  "should've": "should have",
  "would've": "would have",
  "might've": "might have",
};

const RAW_TEXTS = [
  // ==========================================
  // A1 — INICIANTES (frases completas, sem contrações pesadas)
  // ==========================================
  {
    id: 'dict_1',
    title: { pt: 'Minha Manhã', en: 'My Morning', es: 'Mi Mañana' },
    difficulty: 'A1',
    text: 'I wake up early. I drink coffee. I go to work. I like my job. I am happy today.',
    translation: {
      pt: 'Eu acordo cedo. Eu bebo café. Eu vou trabalhar. Eu gosto do meu emprego. Estou feliz hoje.',
      en: 'I wake up early. I drink coffee. I go to work. I like my job. I am happy today.',
      es: 'Me despierto temprano. Bebo café. Voy a trabajar. Me gusta mi trabajo. Estoy feliz hoy.',
    },
    timeLimitSeconds: 100,
  },
  {
    id: 'dict_2',
    title: { pt: 'No Café', en: 'At the Cafe', es: 'En el Café' },
    difficulty: 'A1',
    text: 'Can I have a coffee please. I would like a water too. How much is it. Thank you very much.',
    translation: {
      pt: 'Posso ter um café por favor. Eu gostaria de uma água também. Quanto é? Muito obrigado.',
      en: 'Can I have a coffee please. I would like a water too. How much is it. Thank you very much.',
      es: '¿Me da un café por favor? También quisiera un agua. ¿Cuánto es? Muchas gracias.',
    },
    timeLimitSeconds: 100,
  },
  {
    id: 'dict_3',
    title: { pt: 'Minha Família', en: 'My Family', es: 'Mi Familia' },
    difficulty: 'A1',
    text: 'This is my family. My mother is kind. My father works hard. I love my brother and my sister.',
    translation: {
      pt: 'Esta é minha família. Minha mãe é gentil. Meu pai trabalha duro. Eu amo meu irmão e minha irmã.',
      en: 'This is my family. My mother is kind. My father works hard. I love my brother and my sister.',
      es: 'Esta es mi familia. Mi madre es amable. Mi padre trabaja duro. Amo a mi hermano y a mi hermana.',
    },
    timeLimitSeconds: 110,
  },
  {
    id: 'dict_8',
    title: { pt: 'Meu Dia Livre', en: 'My Day Off', es: 'Mi Día Libre' },
    difficulty: 'A1',
    text: "It's Saturday. I don't work today. I'm going to the park with my friends. We're happy because it's sunny.",
    translation: {
      pt: 'É sábado. Eu não trabalho hoje. Eu vou ao parque com meus amigos. Estamos felizes porque está ensolarado.',
      en: "It's Saturday. I don't work today. I'm going to the park with my friends. We're happy because it's sunny.",
      es: 'Es sábado. No trabajo hoy. Voy al parque con mis amigos. Estamos felices porque hace sol.',
    },
    timeLimitSeconds: 120,
  },

  // ==========================================
  // A2 — COTIDIANO COM CONTRAÇÕES SIMPLES
  // ==========================================
  {
    id: 'dict_4',
    title: { pt: 'Pedindo Direções', en: 'Asking for Directions', es: 'Pidiendo Direcciones' },
    difficulty: 'A2',
    text: "Excuse me, I'm lost. Where's the bus stop? Go straight and turn right, it's next to the pub. Thanks a lot for your help.",
    translation: {
      pt: 'Com licença, estou perdido. Onde fica o ponto de ônibus? Siga reto e vire à direita, fica do lado do pub. Muito obrigado pela ajuda.',
      en: "Excuse me, I'm lost. Where's the bus stop? Go straight and turn right, it's next to the pub. Thanks a lot for your help.",
      es: 'Disculpe, estoy perdido. ¿Dónde está la parada de autobús? Siga recto y gire a la derecha, está junto al pub. Muchas gracias por su ayuda.',
    },
    timeLimitSeconds: 130,
  },
  {
    id: 'dict_5',
    title: { pt: 'Entrevista de Emprego', en: 'Job Interview', es: 'Entrevista de Trabajo' },
    difficulty: 'A2',
    text: "I've got experience in customer service. I'm a fast learner and I can work under pressure. I'm available full time and I'd love to join your team.",
    translation: {
      pt: 'Eu tenho experiência em atendimento ao cliente. Aprendo rápido e consigo trabalhar sob pressão. Estou disponível em tempo integral e adoraria entrar na sua equipe.',
      en: "I've got experience in customer service. I'm a fast learner and I can work under pressure. I'm available full time and I'd love to join your team.",
      es: 'Tengo experiencia en atención al cliente. Aprendo rápido y puedo trabajar bajo presión. Estoy disponible a tiempo completo y me encantaría unirme a su equipo.',
    },
    timeLimitSeconds: 140,
  },
  {
    id: 'dict_9',
    title: { pt: 'Fazendo Planos', en: 'Making Plans', es: 'Haciendo Planes' },
    difficulty: 'A2',
    text: "What are you doing tonight? I dunno, maybe I'll stay home. C'mon, let's go grab a bite. Ok, I'm in, gimme ten minutes.",
    translation: {
      pt: 'O que você vai fazer hoje à noite? Não sei, talvez eu fique em casa. Vamos, vamos comer algo. Ok, topo, me dá dez minutos.',
      en: "What are you doing tonight? I dunno, maybe I'll stay home. C'mon, let's go grab a bite. Ok, I'm in, gimme ten minutes.",
      es: '¿Qué haces esta noche? No sé, tal vez me quede en casa. Vamos, vamos a comer algo. Ok, me apunto, dame diez minutos.',
    },
    timeLimitSeconds: 130,
  },
  {
    id: 'dict_10',
    title: { pt: 'No Telefone', en: 'On the Phone', es: 'Por Teléfono' },
    difficulty: 'A2',
    text: "Hey, it's me. I'm running late, I'll be there in twenty minutes. Can't talk right now, I'm driving. Talk to you soon, bye!",
    translation: {
      pt: 'Ei, sou eu. Estou atrasado, chego em vinte minutos. Não posso falar agora, estou dirigindo. Falo com você em breve, tchau!',
      en: "Hey, it's me. I'm running late, I'll be there in twenty minutes. Can't talk right now, I'm driving. Talk to you soon, bye!",
      es: 'Oye, soy yo. Voy tarde, llegaré en veinte minutos. No puedo hablar ahora, estoy manejando. Hablamos pronto, ¡adiós!',
    },
    timeLimitSeconds: 130,
  },

  // ==========================================
  // B1 — TRABALHO E VIDA REAL
  // ==========================================
  {
    id: 'dict_6',
    title: { pt: 'No Trabalho', en: 'At Work', es: 'En el Trabajo' },
    difficulty: 'B1',
    text: "My manager gave me a new task today. I've gotta finish it before the deadline. I think I can handle it on my own, but teamwork makes everything easier.",
    translation: {
      pt: 'Meu gerente me deu uma nova tarefa hoje. Eu preciso terminar antes do prazo. Acho que consigo lidar com isso sozinho, mas trabalho em equipe facilita tudo.',
      en: "My manager gave me a new task today. I've gotta finish it before the deadline. I think I can handle it on my own, but teamwork makes everything easier.",
      es: 'Mi jefe me dio una nueva tarea hoy. Tengo que terminarla antes de la fecha límite. Creo que puedo manejarla solo, pero el trabajo en equipo facilita todo.',
    },
    timeLimitSeconds: 150,
  },
  {
    id: 'dict_7',
    title: { pt: 'Vida em Dublin', en: 'Life in Dublin', es: 'Vida en Dublín' },
    difficulty: 'B1',
    text: "Living in Dublin's a great experience. The weather changes really fast, one minute it's sunny, the next it's pouring rain. People here are friendly and I'm learning something new every single day.",
    translation: {
      pt: 'Viver em Dublin é uma ótima experiência. O tempo muda muito rápido, num minuto está ensolarado, no outro está chovendo forte. As pessoas aqui são simpáticas e estou aprendendo algo novo todos os dias.',
      en: "Living in Dublin's a great experience. The weather changes really fast, one minute it's sunny, the next it's pouring rain. People here are friendly and I'm learning something new every single day.",
      es: 'Vivir en Dublín es una gran experiencia. El clima cambia muy rápido, un minuto hace sol y al siguiente está lloviendo a cántaros. La gente aquí es amable y estoy aprendiendo algo nuevo cada día.',
    },
    timeLimitSeconds: 160,
  },
  {
    id: 'dict_11',
    title: { pt: 'Reclamando de um Pedido', en: 'Complaining About an Order', es: 'Reclamando un Pedido' },
    difficulty: 'B1',
    text: "Excuse me, I think there's a mistake with my order. I didn't order this, I ordered a burger, not a salad. Could you please fix it? I'd really appreciate it.",
    translation: {
      pt: 'Com licença, acho que tem um erro no meu pedido. Eu não pedi isso, pedi um hambúrguer, não uma salada. Você poderia corrigir? Eu agradeceria muito.',
      en: "Excuse me, I think there's a mistake with my order. I didn't order this, I ordered a burger, not a salad. Could you please fix it? I'd really appreciate it.",
      es: 'Disculpe, creo que hay un error con mi pedido. Yo no pedí esto, pedí una hamburguesa, no una ensalada. ¿Podría corregirlo? Se lo agradecería mucho.',
    },
    timeLimitSeconds: 150,
  },
  {
    id: 'dict_12',
    title: { pt: 'Sextou!', en: 'It\'s Friday!', es: '¡Es Viernes!' },
    difficulty: 'B1',
    text: "It's finally Friday, thank god. I'm so tired, I've been working all week. Wanna grab a pint later? I could really use a drink after this crazy week.",
    translation: {
      pt: 'Finalmente é sexta, graças a Deus. Estou tão cansado, trabalhei a semana toda. Quer ir tomar uma cerveja mais tarde? Eu realmente preciso de um drink depois dessa semana louca.',
      en: "It's finally Friday, thank god. I'm so tired, I've been working all week. Wanna grab a pint later? I could really use a drink after this crazy week.",
      es: 'Por fin es viernes, gracias a Dios. Estoy tan cansado, he estado trabajando toda la semana. ¿Quieres tomar una cerveza más tarde? De verdad me vendría bien un trago después de esta semana loca.',
    },
    timeLimitSeconds: 150,
  },

  // ==========================================
  // B2 — FLUIDEZ E CONVERSAÇÃO NATURAL
  // ==========================================
  {
    id: 'dict_13',
    title: { pt: 'Um Papo Casual', en: 'A Casual Chat', es: 'Una Charla Casual' },
    difficulty: 'B2',
    text: "Honestly, I couldn't care less about the traffic today, I've got the whole weekend off. I should've booked a trip somewhere, but I guess I'll just chill at home. What about you, what're your plans?",
    translation: {
      pt: 'Sinceramente, não me importo nem um pouco com o trânsito hoje, tenho o fim de semana todo livre. Eu deveria ter reservado uma viagem, mas acho que vou só relaxar em casa. E você, quais são seus planos?',
      en: "Honestly, I couldn't care less about the traffic today, I've got the whole weekend off. I should've booked a trip somewhere, but I guess I'll just chill at home. What about you, what're your plans?",
      es: 'Sinceramente, no me importa nada el tráfico hoy, tengo todo el fin de semana libre. Debería haber reservado un viaje, pero creo que solo me relajaré en casa. ¿Y tú, cuáles son tus planes?',
    },
    timeLimitSeconds: 170,
  },
  {
    id: 'dict_14',
    title: { pt: 'Discutindo um Projeto', en: 'Discussing a Project', es: 'Discutiendo un Proyecto' },
    difficulty: 'B2',
    text: "I've been thinking about the project, and I reckon we should change our approach. It's not that the current plan's bad, it's just that we could've done it faster. Let's talk to the team and see what they think.",
    translation: {
      pt: 'Eu venho pensando sobre o projeto, e acho que deveríamos mudar nossa abordagem. Não é que o plano atual seja ruim, é só que poderíamos ter feito mais rápido. Vamos falar com a equipe e ver o que eles acham.',
      en: "I've been thinking about the project, and I reckon we should change our approach. It's not that the current plan's bad, it's just that we could've done it faster. Let's talk to the team and see what they think.",
      es: 'He estado pensando en el proyecto, y creo que deberíamos cambiar nuestro enfoque. No es que el plan actual sea malo, es solo que podríamos haberlo hecho más rápido. Hablemos con el equipo y veamos qué piensan.',
    },
    timeLimitSeconds: 170,
  },
];

export const DICTATION_TEXTS = RAW_TEXTS.map((item) => ({
  ...item,
  words: buildWords(item.text),
}));

// Retorna a expansão de uma palavra (ou null se não for contração conhecida)
export const getContractionExpansion = (word) => {
  const clean = String(word || '').toLowerCase().replace(/[.,!?;:"]/g, '');
  return CONTRACTIONS[clean] || null;
};