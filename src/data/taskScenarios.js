// src/data/taskScenarios.js

export const TASK_SCENARIOS = [
  {
    id: 'chat_intro',
    title: { pt: 'Apresentação Básica', es: 'Presentación Básica', en: 'Basic Introduction' },
    description: { 
      pt: 'Você acabou de chegar e precisa se apresentar para uma pessoa nova.', 
      es: 'Acabas de llegar y necesitas presentarte a alguien nuevo.', 
      en: 'You just arrived and need to introduce yourself to someone new.' 
    },
    objective: { 
      pt: 'Diga seu nome, de onde você é e o que veio fazer.', 
      es: 'Di tu nombre, de dónde eres y qué viniste a hacer.', 
      en: 'Say your name, where you are from, and what you came to do.' 
    },
    aiRole: 'You are a friendly local in Dublin meeting someone new. Ask for their name, where they are from, and why they moved here.',
    completionCondition: 'Once the user states their name, country of origin, and purpose, warmly welcome them and set isCompleted to true.',
    firstMessage: {
      text: 'Hi there! I don\'t think we\'ve met. I\'m Sarah. What\'s your name and where are you from?',
      translation: { 
        pt: 'Olá! Acho que não nos conhecemos. Eu sou a Sarah. Qual é o seu nome e de onde você é?', 
        es: '¡Hola! Creo que no nos conocemos. Soy Sarah. ¿Cuál es tu nombre y de dónde eres?', 
        en: 'Hi there! I don\'t think we\'ve met. I\'m Sarah. What\'s your name and where are you from?' 
      },
      hint: { 
        pt: 'Responda dizendo seu nome e que você é do Brasil (ex: "Hi Sarah, my name is Luccas and I am from Brazil").', 
        es: 'Responde diciendo tu nombre y que eres de Brasil.', 
        en: 'Respond by saying your name and that you are from Brazil.' 
      }
    }
  },
  {
    id: 'directions_bus',
    title: { pt: 'Pedindo Informações', es: 'Pidiendo Direcciones', en: 'Asking for Directions' },
    description: { 
      pt: 'Você está perdido na rua e precisa encontrar transporte.', 
      es: 'Estás perdido en la calle y necesitas encontrar transporte.', 
      en: 'You are lost on the street and need to find transport.' 
    },
    objective: { 
      pt: 'Pergunte onde fica o ponto de ônibus (bus stop) mais próximo.', 
      es: 'Pregunte dónde está la parada de autobús (bus stop) más cercana.', 
      en: 'Ask where the nearest bus stop is.' 
    },
    aiRole: 'You are a helpful local walking down the street. The user looks lost. If they ask for the bus stop, give them simple directions (e.g., straight ahead and turn left).',
    completionCondition: 'Once the user clearly asks for the location of a bus stop and thanks you for the directions, set isCompleted to true.',
    firstMessage: {
      text: 'Hi! You look a bit lost. Do you need some help finding somewhere?',
      translation: { 
        pt: 'Oi! Você parece um pouco perdido. Precisa de ajuda para encontrar algum lugar?', 
        es: '¡Hola! Pareces un poco perdido. ¿Necesitas ayuda para encontrar algún lugar?', 
        en: 'Hi! You look a bit lost. Do you need some help finding somewhere?' 
      },
      hint: { 
        pt: 'Diga que sim e pergunte onde fica o ponto de ônibus (ex: "Yes, please. Where is the bus stop?").', 
        es: 'Diga que sí y pregunte dónde está la parada de autobús (ej: "Yes, please. Where is the bus stop?").', 
        en: 'Say yes and ask where the bus stop is (e.g., "Yes, please. Where is the bus stop?").' 
      }
    }
  },
  {
    id: 'shopping_clothes',
    title: { pt: 'Comprando Roupas', es: 'Comprando Ropa', en: 'Clothes Shopping' },
    description: { 
      pt: 'Você está em uma loja e precisa de um tamanho diferente.', 
      es: 'Estás en una tienda y necesitas una talla diferente.', 
      en: 'You are in a store and need a different size.' 
    },
    objective: { 
      pt: 'Pergunte se eles têm uma camiseta no tamanho Grande (Large) e qual o preço.', 
      es: 'Pregunte si tienen una camiseta en talla Grande (Large) y cuál es el precio.', 
      en: 'Ask if they have a t-shirt in Large and what the price is.' 
    },
    aiRole: 'You are a shop assistant in a clothing store in Dublin. You help customers find their sizes and tell them prices.',
    completionCondition: 'Once the user asks for a size Large and asks for the price, tell them the price (e.g., 20 euros) and set isCompleted to true.',
    firstMessage: {
      text: 'Hello! Let me know if you need any help finding your size or if you have any questions.',
      translation: { 
        pt: 'Olá! Me avise se precisar de ajuda para encontrar o seu tamanho ou se tiver alguma dúvida.', 
        es: '¡Hola! Avísame si necesitas ayuda para encontrar tu talla o si tienes alguna pregunta.', 
        en: 'Hello! Let me know if you need any help finding your size or if you have any questions.' 
      },
      hint: { 
        pt: 'Pergunte sobre uma camiseta no tamanho G e o preço (ex: "Do you have this t-shirt in Large? How much is it?").', 
        es: 'Pregunte por una camiseta en talla L y el precio (ej: "Do you have this t-shirt in Large? How much is it?").', 
        en: 'Ask about a t-shirt in size Large and the price (e.g., "Do you have this t-shirt in Large? How much is it?").' 
      }
    }
  },
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