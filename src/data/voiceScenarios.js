// src/data/voiceScenarios.js

export const VOICE_SCENARIOS = [
  {
    id: 'voice_coffee',
    title: { pt: 'Pedindo no Café', es: 'Pidiendo en el Café', en: 'Ordering at the Cafe' },
    description: { 
      pt: 'Faça um pedido em um café movimentado.', 
      es: 'Haz un pedido en un café concurrido.', 
      en: 'Place an order in a busy cafe.' 
    },
    objective: { 
      pt: 'Faça seu pedido para o barista e pergunte o preço total.', 
      es: 'Haz tu pedido al barista y pregunta el precio total.', 
      en: 'Place your order with the barista and ask for the total price.' 
    },
    aiRole: 'You are a busy but polite barista at a popular Dublin cafe. Ask the customer what they would like to have.',
    completionCondition: 'Once the user orders a drink and asks for the total price, tell them the price and set isCompleted to true.',
    firstMessage: {
      text: 'Next, please! Hi, what can I get for you today?',
      translation: { 
        pt: 'O próximo, por favor! Olá, o que posso preparar para você hoje?', 
        es: '¡El siguiente, por favor! Hola, ¿qué te puedo preparar hoy?', 
        en: 'Next, please! Hi, what can I get for you today?' 
      },
      hint: { 
        pt: 'Faça o seu pedido. Para manter a sua promessa de tomar apenas água, experimente: "Can I have a bottle of water, please? How much is it?".', 
        es: 'Haz tu pedido de agua. (ej: "Can I have a bottle of water, please? How much is it?").', 
        en: 'Place your order for water and ask the price. (e.g., "Can I have a bottle of water, please? How much is it?").' 
      }
    }
  },
  {
    id: 'buy_ticket',
    title: { pt: 'Comprando Passagem', es: 'Comprando Billete', en: 'Buying a Ticket' },
    description: { 
      pt: 'Compre uma passagem de ônibus ou trem.', 
      es: 'Compra un billete de autobús o tren.', 
      en: 'Buy a bus or train ticket.' 
    },
    objective: { 
      pt: 'Peça uma passagem para o centro da cidade (City Centre).', 
      es: 'Pide un billete para el centro de la ciudad (City Centre).', 
      en: 'Ask for a ticket to the City Centre.' 
    },
    aiRole: 'You are a ticket agent at a station in Dublin. Ask the customer where they are going and issue the ticket when they say "City Centre".',
    completionCondition: 'Once the user asks for a ticket to the City Centre, tell them the platform number and set isCompleted to true.',
    firstMessage: {
      text: 'Next! Hello, where would you like to go today?',
      translation: { 
        pt: 'Próximo! Olá, para onde você gostaria de ir hoje?', 
        es: '¡Siguiente! Hola, ¿a dónde le gustaría ir hoy?', 
        en: 'Next! Hello, where would you like to go today?' 
      },
      hint: { 
        pt: 'Peça uma passagem para o centro da cidade (ex: "One ticket to the City Centre, please.").', 
        es: 'Pida un billete para el centro (ej: "One ticket to the City Centre, please.").', 
        en: 'Ask for a ticket to the city centre (e.g., "One ticket to the City Centre, please.").' 
      }
    }
  },
  {
    id: 'hotel_checkin',
    title: { pt: 'Check-in no Hostel', es: 'Check-in en el Hostal', en: 'Hostel Check-in' },
    description: { 
      pt: 'Chegue na acomodação e faça o check-in.', 
      es: 'Llega al alojamiento y haz el check-in.', 
      en: 'Arrive at the accommodation and check in.' 
    },
    objective: { 
      pt: 'Diga que tem uma reserva e informe seu nome.', 
      es: 'Di que tienes una reserva e informa tu nombre.', 
      en: 'Say you have a reservation and state your name.' 
    },
    aiRole: 'You are a friendly receptionist at a busy Dublin hostel. Ask the guest if they have a reservation and what their name is.',
    completionCondition: 'Once the user says they have a reservation and provides a name, welcome them and set isCompleted to true.',
    firstMessage: {
      text: 'Hi, welcome to Dublin City Hostel! How can I help you today?',
      translation: { 
        pt: 'Oi, bem-vindo ao Dublin City Hostel! Como posso ajudar você hoje?', 
        es: '¡Hola, bienvenido a Dublin City Hostel! ¿Cómo puedo ayudarte hoy?', 
        en: 'Hi, welcome to Dublin City Hostel! How can I help you today?' 
      },
      hint: { 
        pt: 'Diga que você tem uma reserva e fale seu nome (ex: "Hi, I have a reservation under the name Luccas.").', 
        es: 'Diga que tiene una reserva y su nombre (ej: "Hi, I have a reservation under the name Luccas.").', 
        en: 'Say you have a reservation and your name (e.g., "Hi, I have a reservation under the name Luccas.").' 
      }
    }
  },
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