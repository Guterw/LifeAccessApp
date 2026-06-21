// src/features/languages/english/views/ai-voice/voiceScenarios.js

export const VOICE_SCENARIOS = [
  {
    id: 'dublin_airport',
    title: { pt: 'Imigração em Dublin', es: 'Inmigración en Dublín', en: 'Dublin Immigration' },
    description: {
      pt: 'Passe pelo controle de passaporte ao chegar do seu voo.',
      es: 'Pase por el control de pasaportes al llegar de su vuelo.',
      en: 'Go through passport control upon arriving from your flight.'
    },
    objective: {
      pt: 'Responda o motivo da viagem e a sua cidade de partida.',
      es: 'Responda el motivo del viaje y su ciudad de salida.',
      en: 'Answer the purpose of the trip and your departure city.'
    },
    aiRole: 'You are an Immigration Officer at Dublin Airport. You ask the traveler about the purpose of their trip and where their flight originated from.',
    completionCondition: 'Once the user answers the purpose and mentions their departure city/country, welcome them to Ireland and set isCompleted to true.',
    firstMessage: {
      text: 'Next, please. Hand me your passport. What is the purpose of your visit, and where did your flight originate from?',
      translation: { 
        pt: 'O próximo, por favor. Entregue-me seu passaporte. Qual é o motivo da sua visita e de onde seu voo partiu?',
        es: 'El siguiente, por favor. Entrégueme su pasaporte. ¿Cuál es el motivo de su visita y de dónde partió su vuelo?',
        en: 'Next, please. Hand me your passport. What is the purpose of your visit, and where did your flight originate from?'
      },
      hint: { 
        pt: 'Diga o motivo genérico da viagem (ex: turismo, estudo) e mencione sua cidade ou país de origem.',
        es: 'Diga el motivo del viaje (ej: turismo, estudio) y mencione su ciudad o país de origen.',
        en: 'State the generic purpose of the trip (e.g., tourism, study) and mention your home city or country.'
      }
    }
  },
  {
    id: 'job_hunting',
    title: { pt: 'Entregando Currículo', es: 'Entregando Currículo', en: 'Dropping off CV' },
    description: {
      pt: 'Entre em um comércio e pergunte se estão contratando.',
      es: 'Entre en un comercio y pregunte si están contratando.',
      en: 'Enter a shop and ask if they are hiring.'
    },
    objective: {
      pt: 'Pergunte sobre vagas, entregue o currículo (CV) e diga sua disponibilidade.',
      es: 'Pregunte sobre vacantes, entregue el currículo (CV) y diga su disponibilidad.',
      en: 'Ask about vacancies, hand in your CV, and state your availability.'
    },
    aiRole: 'You are a manager at a local pub/cafe in Dublin. A person comes in. You greet them simply. If they ask if you are hiring, ask if they have a printed CV and what their availability is.',
    completionCondition: 'Once the user offers their CV and states their availability (e.g., full-time, part-time, mornings), say you will review it and set isCompleted to true.',
    firstMessage: {
      text: 'Hi, how can I help you?',
      translation: { 
        pt: 'Olá, como posso ajudar?',
        es: 'Hola, ¿cómo puedo ayudar?',
        en: 'Hi, how can I help you?'
      },
      hint: { 
        pt: 'Comece a conversa dizendo: "Hi! Are you hiring?" (Olá! Vocês estão contratando?).',
        es: 'Comienza la conversación diciendo: "Hi! Are you hiring?" (¡Hola! ¿Están contratando?).',
        en: 'Start the conversation by saying: "Hi! Are you hiring?".'
      }
    }
  },
  {
    id: 'hospitality_interview',
    title: { pt: 'Entrevista de Emprego', es: 'Entrevista de Trabajo', en: 'Job Interview' },
    description: {
      pt: 'Faça uma entrevista genérica para uma vaga de atendimento.',
      es: 'Haga una entrevista genérica para un puesto de atención.',
      en: 'Do a generic interview for a customer service position.'
    },
    objective: {
      pt: 'Destaque sua experiência prévia e habilidades.',
      es: 'Destaque su experiencia previa y habilidades.',
      en: 'Highlight your previous experience and skills.'
    },
    aiRole: 'You are a hiring manager at a busy cafe in Dublin. You are interviewing the user for a position. You value candidates with fast-paced environment experience and good customer service.',
    completionCondition: 'Once the user mentions their general management or customer service experience, offer them a trial shift and set isCompleted to true.',
    firstMessage: {
      text: 'Hi there, thanks for coming in. We need someone who can handle a fast-paced environment and knows customer service. Can you tell me a bit about your past experience?',
      translation: { 
        pt: 'Olá, obrigado por vir. Precisamos de alguém que consiga lidar com um ambiente acelerado e entenda de atendimento. Pode me falar um pouco sobre sua experiência passada?',
        es: 'Hola, gracias por venir. Necesitamos a alguien que pueda manejar un entorno acelerado. ¿Puede hablarme un poco sobre su experiencia pasada?',
        en: 'Hi there, thanks for coming in. We need someone who can handle a fast-paced environment. Can you tell me a bit about your past experience?'
      },
      hint: { 
        pt: 'Fale de forma genérica sobre suas experiências anteriores, liderança de equipe ou atendimento ao público.',
        es: 'Hable de forma genérica sobre sus experiencias anteriores o atención al público.',
        en: 'Talk generally about your past experiences with customer service or team management.'
      }
    }
  },
  {
    id: 'ordering_pub',
    title: { pt: 'Fazendo Pedido no Pub', es: 'Haciendo Pedido en el Pub', en: 'Ordering at a Pub' },
    description: {
      pt: 'Faça seu pedido de comida e bebida em um pub tradicional.',
      es: 'Haga su pedido de comida y bebida en un pub tradicional.',
      en: 'Order food and drinks at a traditional pub.'
    },
    objective: {
      pt: 'Peça uma bebida, um prato de comida e pergunte o valor total.',
      es: 'Pida una bebida, un plato de comida y pregunte el valor total.',
      en: 'Order a drink, a meal, and ask for the total price.'
    },
    aiRole: 'You are a friendly bartender/waiter at a traditional Irish pub. You ask the customer what they would like to eat and drink.',
    completionCondition: 'Once the user orders both a food item and a drink, and asks for the total price, tell them the price and set isCompleted to true.',
    firstMessage: {
      text: 'Hi there! Welcome. What can I get for you today? Would you like to start with something to drink?',
      translation: { 
        pt: 'Olá! Bem-vindo. O que posso trazer para você hoje? Gostaria de começar com algo para beber?',
        es: '¡Hola! Bienvenido. ¿Qué le puedo traer hoy? ¿Le gustaría empezar con algo de beber?',
        en: 'Hi there! Welcome. What can I get for you today? Would you like to start with something to drink?'
      },
      hint: { 
        pt: 'Peça uma bebida (ex: pint of Guinness ou água), uma comida (ex: Fish and Chips) e depois pergunte quanto custa tudo.',
        es: 'Pida una bebida, una comida y luego pregunte cuánto cuesta todo.',
        en: 'Order a drink, some food, and then ask how much it all costs.'
      }
    }
  }
];