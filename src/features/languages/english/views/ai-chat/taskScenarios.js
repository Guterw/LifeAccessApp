// src/features/languages/english/views/ai-chat/taskScenarios.js

export const TASK_SCENARIOS = [
  {
    id: 'dublin_airport',
    title: { pt: 'Imigração em Dublin', es: 'Inmigración en Dublín', en: 'Dublin Immigration' },
    description: { 
      pt: 'Passe pelo controle de passaporte no aeroporto.', 
      es: 'Pase por el control de pasaportes en el aeropuerto.', 
      en: 'Go through passport control at the airport.' 
    },
    objective: { 
      pt: 'Responda as perguntas do oficial de imigração e consiga a permissão de entrada.', 
      es: 'Responda las preguntas del oficial de inmigración y obtenga permiso para entrar.', 
      en: 'Answer the immigration officer\'s questions and get permission to enter.' 
    },
    aiRole: 'You are a strict but fair Immigration Officer at Dublin Airport. You ask questions one by one: purpose of the trip, where they will stay, and how they will support themselves.',
    completionCondition: 'Once the user answers the 3 basic questions satisfactorily, welcome them to Ireland and set isCompleted to true.',
    firstMessage: {
      text: 'Next in line, please. Step forward. Passport and reason for entering the country?',
      translation: { 
        pt: 'O próximo da fila, por favor. Dê um passo à frente. Passaporte e motivo de entrada no país?', 
        es: 'El siguiente en la fila, por favor. Dé un paso adelante. ¿Pasaporte y motivo de entrada al país?', 
        en: 'Next in line, please. Step forward. Passport and reason for entering the country?' 
      },
      hint: { 
        pt: 'Cumprimente o oficial e diga o motivo da viagem (ex: "Hi, I am here to study" ou "I am here for tourism").', 
        es: 'Salude al oficial y diga el motivo de su viaje (ej: "Hi, I am here to study" o "I am here for tourism").', 
        en: 'Greet the officer and state the purpose of your trip (e.g., "Hi, I am here to study" or "I am here for tourism").' 
      }
    }
  },
  {
    id: 'irish_pub',
    title: { pt: 'No Pub Irlandês', es: 'En el Pub Irlandés', en: 'At the Irish Pub' },
    description: { 
      pt: 'Peça uma bebida e interaja com o bartender.', 
      es: 'Pida una bebida e interactúe con el barman.', 
      en: 'Order a drink and interact with the bartender.' 
    },
    objective: { 
      pt: 'Peça uma pint de Guinness, pergunte o preço e pague a conta.', 
      es: 'Pida una pinta de Guinness, pregunte el precio y pague.', 
      en: 'Order a pint of Guinness, ask for the price, and pay.' 
    },
    aiRole: 'You are a friendly, fast-paced bartender at a busy traditional pub in Temple Bar, Dublin. You use some Irish slang naturally (like "craic", "grand", "lads").',
    completionCondition: 'Once the user successfully orders a drink, asks for the price, and pays, say thanks and set isCompleted to true.',
    firstMessage: {
      text: 'Alright there! What can I get for ya?',
      translation: { 
        pt: 'Olá! O que vai ser?', 
        es: '¡Hola! ¿Qué le sirvo?', 
        en: 'Hello! What can I get for you?' 
      },
      hint: { 
        pt: 'Peça a sua bebida favorita. (ex: "Can I have a pint of Guinness, please?").', 
        es: 'Pida su bebida favorita. (ej: "Can I have a pint of Guinness, please?").', 
        en: 'Ask for your favorite drink. (e.g., "Can I have a pint of Guinness, please?").' 
      }
    }
  },
  {
    id: 'room_rent',
    title: { pt: 'Alugando um Quarto', es: 'Alquilando una Habitación', en: 'Renting a Room' },
    description: { 
      pt: 'Negocie com o landlord (senhorio).', 
      es: 'Negocie con el landlord (propietario).', 
      en: 'Negotiate with the landlord.' 
    },
    objective: { 
      pt: 'Pergunte sobre as contas (bills), o depósito e confirme o aluguel.', 
      es: 'Pregunte por los gastos (bills), el depósito y confirme el alquiler.', 
      en: 'Ask about the bills, the deposit, and confirm the rent.' 
    },
    aiRole: 'You are a cautious landlord renting out a double room in a shared house in Dublin. You want to make sure the tenant is responsible.',
    completionCondition: 'Once the user asks about the bills, the deposit, and agrees to take the room, welcome them to the house and set isCompleted to true.',
    firstMessage: {
      text: 'Hi there, you must be here to view the room. Have a look around. Any questions?',
      translation: { 
        pt: 'Olá, você deve estar aqui para ver o quarto. Dê uma olhada. Alguma pergunta?', 
        es: 'Hola, debe estar aquí para ver la habitación. Eche un vistazo. ¿Alguna pregunta?', 
        en: 'Hi there, you must be here to view the room. Have a look around. Any questions?' 
      },
      hint: { 
        pt: 'Diga que gostou do quarto e pergunte sobre as contas (ex: "I like it. Are the bills included?").', 
        es: 'Diga que le gustó y pregunte por los gastos (ej: "I like it. Are the bills included?").', 
        en: 'Say you like the room and ask about the bills (e.g., "I like it. Are the bills included?").' 
      }
    }
  }
];