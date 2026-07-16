// src/data/explainedLessons.js
// Estrutura de uma "lição explicada": cada lição tem slides de teoria (theory)
// e depois um bloco de exercícios de fixação (exercises), reaproveitando os
// mesmos "types" já usados em numberExercises/alphabetExercises quando possível
// (listen_and_identify, voice_dictation) + um novo tipo "fill_choice" para
// múltipla escolha de gramática/sentido.
// Agora com a propriedade "group" para renderizar corretamente no ListView.

export const EXPLAINED_LESSONS = [
  // ==========================================
  // NÍVEL A1 (FUNDAMENTOS INICIAIS)
  // ==========================================
  {
    id: 'lesson_pronouns',
    title: { pt: 'Quem é quem? (Os Pronomes)', en: 'Who is who? (Pronouns)', es: '¿Quién es quién? (Pronombres)' },
    icon: 'Users',
    group: ['A1'],
    theory: [
      {
        id: 'pro_1',
        title: { pt: 'Eu, Você, Ele e Ela', en: 'I, You, He and She', es: 'Yo, Tú, Él y Ella' },
        body: {
          pt: 'Antes de aprender verbos, precisamos saber de quem estamos falando.\n\nI = Eu (Sempre escrito com letra maiúscula, mesmo no meio da frase!).\nYou = Você (Ou "Vocês", serve para os dois!).\nHe = Ele (Para homens/meninos).\nShe = Ela (Para mulheres/meninas).',
          en: 'Before verbs, we need to know who we are talking about.\n\nI = Me (Always capital!).\nYou = You (Singular or plural!).\nHe = Him (Males).\nShe = Her (Females).',
          es: 'Antes de los verbos, necesitamos saber de quién hablamos.\n\nI = Yo (¡Siempre en mayúscula!).\nYou = Tú / Ustedes.\nHe = Él.\nShe = Ella.'
        },
        examples: ['I am from Brazil.', 'You are my friend.', 'He is John.', 'She is Maria.']
      },
      {
        id: 'pro_2',
        title: { pt: 'O estranho caso do "IT"', en: 'The strange case of "IT"', es: 'El extraño caso de "IT"' },
        body: {
          pt: 'No português, a gente diz "Está chovendo" ou "A porta é azul, ela é bonita". No inglês, TUDO precisa de um sujeito.\n\nPara coisas, animais, tempo e objetos, usamos o "IT" (Ele/Ela para não-humanos).\n\nEx: "It is raining" (Está chovendo). Não pode dizer só "Is raining".',
          en: 'In English, EVERY sentence needs a subject.\n\nFor things, animals, weather, and objects, we use "IT".\n\nEx: "It is raining". You cannot just say "Is raining".',
          es: 'En inglés, TODA oración necesita un sujeto.\n\nPara cosas, animales, clima y objetos, usamos "IT".\n\nEj: "It is raining". No puedes decir solo "Is raining".'
        },
        examples: ['It is a dog.', 'It is cold today.', 'Where is the car? It is here.']
      },
      {
        id: 'pro_3',
        title: { pt: 'Nós e Eles (O Plural)', en: 'We and They (Plural)', es: 'Nosotros y Ellos (Plural)' },
        body: {
          pt: 'Para falar da galera:\n\nWe = Nós (A gente).\nThey = Eles / Elas.\n\nO "They" é super legal porque serve para TUDO no plural: homens, mulheres, objetos, cachorros... se tem mais de um, é "They"!',
          en: 'Talking about groups:\n\nWe = Us.\nThey = Them.\n\n"They" is great because it works for EVERYTHING in plural: men, women, objects, dogs...',
          es: 'Hablando de grupos:\n\nWe = Nosotros.\nThey = Ellos / Ellas.\n\n"They" sirve para TODO en plural: hombres, mujeres, objetos, perros...'
        },
        examples: ['We are family.', 'They are my brothers.', 'Where are the keys? They are on the table.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Como se diz "Eu" em inglês?', en: 'How do you say "Me" as a subject?', es: '¿Cómo se dice "Yo"?' }, target: 'I', options: ['i', 'I', 'Me', 'You'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Qual pronome usamos para um CACHORRO?', en: 'Which pronoun for a DOG?', es: '¿Qué pronombre para un PERRO?' }, target: 'It', options: ['He', 'She', 'It', 'They'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Qual pronome usamos para "Eles" ou "Elas"?', en: 'Which pronoun for plural third person?', es: '¿Qué pronombre para plural?' }, target: 'They', options: ['We', 'They', 'It', 'You'] }
    ]
  },
  {
    id: 'lesson_tobe_affirmative',
    title: { pt: 'O famoso Verbo TO BE', en: 'The famous Verb TO BE', es: 'El famoso Verbo TO BE' },
    icon: 'Sparkles',
    group: ['A1'],
    theory: [
      {
        id: 'tb_1',
        title: { pt: 'O que diabos é o To Be?', en: 'What on earth is To Be?', es: '¿Qué diablos es To Be?' },
        body: {
          pt: 'Esqueça os traumas da escola. O verbo "To Be" significa apenas duas coisas: SER ou ESTAR.\n\nEm português, você tem que adivinhar pelo contexto se "Sou" ou "Estou". No inglês, é uma palavra só que serve pros dois!\n\nI am John = Eu sou o John.\nI am in Dublin = Eu estou em Dublin.',
          en: 'Forget school trauma. "To Be" just means existing or locating.\n\nI am John = I am John.\nI am in Dublin = I am in Dublin.',
          es: 'Olvida los traumas escolares. "To Be" significa SER o ESTAR.\n\nI am John = Yo soy John.\nI am in Dublin = Yo estoy en Dublín.'
        },
        examples: ['I am happy. (Estou feliz)', 'He is my boss. (Ele é meu chefe)']
      },
      {
        id: 'tb_2',
        title: { pt: 'As 3 roupinhas do To Be', en: 'The 3 outfits of To Be', es: 'Los 3 trajes de To Be' },
        body: {
          pt: 'O verbo To Be tem apenas 3 "roupinhas" que ele veste dependendo de com quem está andando:\n\n1. AM: É a roupa exclusiva do "I" (Eu).\n2. IS: É a roupa dos solitários "He, She, It" (Ele/Ela).\n3. ARE: É a roupa da galera "You, We, They" (Plurais e Você).',
          en: 'To Be wears 3 outfits depending on the pronoun:\n\n1. AM: Only for "I".\n2. IS: For "He, She, It".\n3. ARE: For "You, We, They".',
          es: 'To Be tiene 3 trajes según el pronombre:\n\n1. AM: Solo para "I".\n2. IS: Para "He, She, It".\n3. ARE: Para "You, We, They".'
        },
        examples: ['I am...', 'He is...', 'She is...', 'We are...', 'They are...']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Complete: "I ___ from Brazil."', en: 'Complete: "I ___ from Brazil."', es: 'Completa: "I ___ from Brazil."' }, target: 'am', options: ['am', 'is', 'are', 'be'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Complete: "She ___ my sister."', en: 'Complete: "She ___ my sister."', es: 'Completa: "She ___ my sister."' }, target: 'is', options: ['am', 'is', 'are', 'be'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Complete: "We ___ in Dublin."', en: 'Complete: "We ___ in Dublin."', es: 'Completa: "We ___ in Dublin."' }, target: 'are', options: ['am', 'is', 'are', 'be'] }
    ]
  },
  {
    id: 'lesson_tobe_questions',
    title: { pt: 'To Be: Perguntas e Negativas', en: 'To Be: Questions and Negatives', es: 'To Be: Preguntas y Negativas' },
    icon: 'MessageCircle',
    group: ['A1'],
    theory: [
      {
        id: 'tbq_1',
        title: { pt: 'O truque do Espelho (Perguntas)', en: 'The Mirror Trick (Questions)', es: 'El truco del Espejo (Preguntas)' },
        body: {
          pt: 'No português, pra fazer uma pergunta a gente só muda a voz (Você é brasileiro?).\nNo inglês, a gente tem que MOVER o verbo To Be para a FRENTE da pessoa!\n\nAfirmativa: You are Brazilian. (Você é brasileiro.)\nPergunta: Are you Brazilian? (É você brasileiro?)',
          en: 'To ask a question in English, MOVE the To Be verb to the FRONT!\n\nAffirmative: You are Brazilian.\nQuestion: Are you Brazilian?',
          es: '¡Para hacer una pregunta en inglés, MUEVE el verbo To Be al FRENTE!\n\nAfirmativo: You are Brazilian.\nPregunta: Are you Brazilian?'
        },
        examples: ['Is he your brother?', 'Are they at home?', 'Am I late?']
      },
      {
        id: 'tbq_2',
        title: { pt: 'Colando o NOT (Negativas)', en: 'Gluing the NOT (Negatives)', es: 'Pegando el NOT (Negativas)' },
        body: {
          pt: 'Para negar, é a coisa mais fácil do mundo: basta colocar a palavra "NOT" DEPOIS do To Be.\n\nI am NOT.\nYou are NOT (ou You aren\'t).\nShe is NOT (ou She isn\'t).\n\nVeja que o "not" vem *depois* do verbo, diferente do português que vem antes ("não sou").',
          en: 'To negate, just put "NOT" AFTER the To Be verb.\n\nI am NOT.\nYou are NOT (or You aren\'t).\nShe is NOT (or She isn\'t).',
          es: 'Para negar, solo pon "NOT" DESPUÉS del verbo To Be.\n\nI am NOT.\nYou are NOT (o You aren\'t).\nShe is NOT (o She isn\'t).'
        },
        examples: ['I am not tired.', 'He isn\'t working today.', 'We aren\'t lost.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Qual é a pergunta certa para "He is tall"?', en: 'Correct question for "He is tall"?', es: '¿Pregunta correcta para "He is tall"?' }, target: 'Is he tall?', options: ['Is he tall?', 'He is tall?', 'Does he tall?', 'He tall is?'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Como dizer "Eles NÃO são felizes"?', en: 'How to say "They are NOT happy"?', es: '¿Cómo decir "Ellos NO son felices"?' }, target: 'They are not happy.', options: ['They are not happy.', 'They not are happy.', 'Not they are happy.', 'They don\'t be happy.'] },
      { id: 'q3', type: 'voice_dictation', question: { pt: 'Fale: "Are you from Ireland?"', en: 'Say: "Are you from Ireland?"', es: 'Di: "Are you from Ireland?"' }, target: ['are you from ireland'], instructions: { pt: 'Fale a pergunta com entonação de dúvida.', en: 'Say it like a question.', es: 'Di la pregunta con tono de duda.' } }
    ]
  },
  {
    id: 'lesson_tobe_negatives_deep',
    title: { pt: 'To Be: Contrações e Respostas Curtas', en: 'To Be: Contractions & Short Answers', es: 'To Be: Contracciones y Respuestas Cortas' },
    icon: 'MinusCircle',
    group: ['A1'],
    theory: [
      {
        id: 'tbn_1',
        title: { pt: 'Contrações do To Be', en: 'To Be Contractions', es: 'Contracciones de To Be' },
        body: {
          pt: 'No dia a dia, quase ninguém fala "I am", "you are" por extenso. Usa-se a contração:\n\nI am -> I\'m\nYou are -> You\'re\nHe is -> He\'s\nShe is -> She\'s\nIt is -> It\'s\nWe are -> We\'re\nThey are -> They\'re\n\nSão essas formas que você vai ouvir o tempo todo em conversas reais.',
          en: 'In everyday speech, almost nobody says "I am", "you are" in full. We use the contraction:\n\nI am -> I\'m\nYou are -> You\'re\nHe is -> He\'s',
          es: 'En el habla cotidiana, casi nadie dice "I am", "you are" completo. Se usa la contracción:\n\nI am -> I\'m\nYou are -> You\'re'
        },
        examples: ['I\'m tired.', 'She\'s my friend.', 'We\'re ready.']
      },
      {
        id: 'tbn_2',
        title: { pt: 'Respostas Curtas (Yes/No)', en: 'Short Answers (Yes/No)', es: 'Respuestas Cortas (Sí/No)' },
        body: {
          pt: 'Em inglês, responder só "Yes" ou "No" soa seco/rude. O normal é responder com uma resposta curta:\n\n"Are you tired?" -> "Yes, I am." / "No, I\'m not."\n"Is she your sister?" -> "Yes, she is." / "No, she isn\'t."\n\nRepare que na resposta curta NÃO se usa contração no "Yes, I am" (fica estranho falar "Yes, I\'m"), mas SIM se usa na negativa: "No, I\'m not."',
          en: 'In English, answering only "Yes" or "No" sounds a bit dry/rude. Native speakers use short answers:\n\n"Are you tired?" -> "Yes, I am." / "No, I\'m not."',
          es: 'En inglés, responder solo "Yes" o "No" suena un poco seco. Lo normal es responder con una respuesta corta.'
        },
        examples: ['Yes, I am.', 'No, I\'m not.', 'Yes, they are.', 'No, he isn\'t.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Contração de "I am":', en: 'Contraction of "I am":', es: 'Contracción de "I am":' }, target: 'I\'m', options: ['I\'m', 'I\'s', 'Im', 'I\'re'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Traduza para o inglês: "Ela é minha irmã"', en: 'Translate to English: "She is my sister"', es: 'Traduce al inglés: "Ella es mi hermana"' }, target: 'She is my sister.', options: ['She is my sister.', 'She are my sister.', 'Her is my sister.', 'She is my brother.'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Traduza para o português: "We\'re ready."', en: 'Translate to Portuguese: "We\'re ready."', es: 'Traduce al portugués: "We\'re ready."' }, target: 'Nós estamos prontos.', options: ['Nós estamos prontos.', 'Nós somos rápidos.', 'Eles estão prontos.', 'Eu estou pronto.'] },
      { id: 'q4', type: 'fill_choice', question: { pt: 'Resposta curta positiva para "Are you tired?"', en: 'Positive short answer for "Are you tired?"', es: 'Respuesta corta positiva para "Are you tired?"' }, target: 'Yes, I am.', options: ['Yes, I am.', 'Yes, I\'m.', 'Yes I do.', 'Yes, is.'] },
      { id: 'q5', type: 'fill_choice', question: { pt: 'Resposta curta negativa para "Is she your sister?"', en: 'Negative short answer for "Is she your sister?"', es: 'Respuesta corta negativa para "Is she your sister?"' }, target: 'No, she isn\'t.', options: ['No, she isn\'t.', 'No, not.', 'No, she not.', 'No, she don\'t.'] },
      { id: 'q6', type: 'voice_dictation', question: { pt: 'Fale: "Yes, I am. No, I\'m not."', en: 'Say: "Yes, I am. No, I\'m not."', es: 'Di: "Yes, I am. No, I\'m not."' }, target: ['yes i am no i am not', 'yes i am no im not'], instructions: { pt: 'Fale as duas respostas curtas seguidas.', en: 'Say both short answers in a row.', es: 'Di las dos respuestas seguidas.' } }
    ]
  },
  {
    id: 'lesson_this_that',
    title: { pt: 'Apontando o Dedo (This, That...)', en: 'Pointing Fingers (This, That...)', es: 'Señalando (This, That...)' },
    icon: 'Hand',
    group: ['A1'],
    theory: [
      {
        id: 'tt_1',
        title: { pt: 'Perto e Longe (Singular)', en: 'Near and Far (Singular)', es: 'Cerca y Lejos (Singular)' },
        body: {
          pt: 'Imagine que você está apontando para algo:\n\nTHIS = ISTO / ESTE / ESTA. Usado para o que está PERTO de você. (Toca com a mão).\n\nTHAT = AQUILO / AQUELE / AQUELA. Usado para o que está LONGE de você. (Aponta o dedo).',
          en: 'Imagine pointing at something:\n\nTHIS = Near you. (You can touch it).\nTHAT = Far from you. (You point at it).',
          es: 'Imagina que señalas algo:\n\nTHIS = Cerca de ti. (Puedes tocarlo).\nTHAT = Lejos de ti. (Lo señalas).'
        },
        examples: ['This is my phone. (Na minha mão)', 'That is a bird. (Lá no céu)']
      },
      {
        id: 'tt_2',
        title: { pt: 'Perto e Longe (Plural)', en: 'Near and Far (Plural)', es: 'Cerca y Lejos (Plural)' },
        body: {
          pt: 'E se for mais de uma coisa?\n\nTHESE = ESTES / ESTAS (Perto e plural). Pronuncia-se "Diz" sorrindo.\n\nTHOSE = AQUELES / AQUELAS (Longe e plural). Pronuncia-se "Dôuz".',
          en: 'What if it is plural?\n\nTHESE = Near and plural.\nTHOSE = Far and plural.',
          es: '¿Y si es plural?\n\nTHESE = Cerca y plural.\nTHOSE = Lejos y plural.'
        },
        examples: ['These are my shoes.', 'Those are my friends over there.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'O que está LONGE e é SINGULAR (um só):', en: 'Far and singular:', es: 'Lejos y singular:' }, target: 'That', options: ['This', 'That', 'These', 'Those'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'O que está PERTO e é PLURAL (vários):', en: 'Near and plural:', es: 'Cerca y plural:' }, target: 'These', options: ['This', 'That', 'These', 'Those'] }
    ]
  },
  {
    id: 'lesson_have_has',
    title: { pt: 'O verbo TER (Have / Has)', en: 'The verb TO HAVE', es: 'El verbo TENER' },
    icon: 'Package',
    group: ['A1'],
    theory: [
      {
        id: 'hv_1',
        title: { pt: 'A Posse: HAVE e HAS', en: 'Possession: HAVE and HAS', es: 'Posesión: HAVE y HAS' },
        body: {
          pt: 'Para dizer que você TEM alguma coisa, usamos "Have". Mas ele muda de roupa para "Has" quando falamos de Ele/Ela!\n\nI have = Eu tenho\nYou have = Você tem\nWe / They have = Nós temos / Eles têm\n\nMas cuidado com o trio parada dura (He, She, It):\nHe HAS = Ele tem\nShe HAS = Ela tem',
          en: 'To say you own something, use "Have". But it changes to "Has" for He/She/It!\n\nI have, You have, We have, They have.\n\nHe HAS, She HAS, It HAS.',
          es: 'Para decir que TIENES algo, usamos "Have". ¡Pero cambia a "Has" para Él/Ella/Eso!\n\nI have, You have, We have, They have.\n\nHe HAS, She HAS, It HAS.'
        },
        examples: ['I have a car.', 'She has a brother.', 'The house has a door. (It has)']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Complete: "My boss ___ a new car."', en: 'Complete: "My boss ___ a new car."', es: 'Completa: "My boss ___ a new car."' }, target: 'has', options: ['have', 'has', 'haves', 'having'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Complete: "I ___ a meeting."', en: 'Complete: "I ___ a meeting."', es: 'Completa: "I ___ a meeting."' }, target: 'have', options: ['has', 'have', 'haves', 'am'] }
    ]
  },
  {
    id: 'lesson_question_words',
    title: { pt: 'As Palavras com W (What, Where...)', en: 'The W-Words (Question words)', es: 'Las Palabras con W' },
    icon: 'HelpCircle',
    group: ['A1'],
    theory: [
      {
        id: 'qw_1',
        title: { pt: 'Coletando Informações', en: 'Gathering Information', es: 'Recolectando Información' },
        body: {
          pt: 'Essas palavrinhas sempre vão no COMEÇO de qualquer pergunta. Decore-as:\n\nWHAT = O que? / Qual? (Ex: What is your name?)\nWHERE = Onde? (Ex: Where is the pub?)\nWHEN = Quando? (Ex: When is the party?)\nWHO = Quem? (Ex: Who are you?)\nWHY = Por que? (Ex: Why are you late?)\nHOW = Como? (Ex: How are you?)',
          en: 'These words ALWAYS go at the BEGINNING of a question:\n\nWHAT = O que/Qual\nWHERE = Onde\nWHEN = Quando\nWHO = Quem\nWHY = Por que\nHOW = Como',
          es: 'Estas palabras van SIEMPRE al INICIO de la pregunta:\n\nWHAT = ¿Qué/Cuál?\nWHERE = ¿Dónde?\nWHEN = ¿Cuándo?\nWHO = ¿Quién?\nWHY = ¿Por qué?\nHOW = ¿Cómo?'
        },
        examples: ['What is this?', 'Where do you live?', 'Who is she?']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Qual palavra usamos para perguntar ONDE (lugar)?', en: 'Which word asks about LOCATION?', es: '¿Qué palabra para LUGAR?' }, target: 'Where', options: ['What', 'Who', 'When', 'Where'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Qual palavra usamos para perguntar QUANDO (tempo)?', en: 'Which word asks about TIME?', es: '¿Qué palabra para TIEMPO?' }, target: 'When', options: ['What', 'Who', 'When', 'Where'] }
    ]
  },
  {
    id: 'lesson_articles',
    title: { pt: 'Um, Uma, O, A (A, An, The)', en: 'A, An, The', es: 'A, An, The' },
    icon: 'Type',
    group: ['A1'],
    theory: [
      {
        id: 'art_1',
        title: { pt: 'A diferença entre A e AN', en: 'A vs AN', es: 'La diferencia entre A y AN' },
        body: {
          pt: 'Ambas significam "UM" ou "UMA". A regra é pelo som da próxima palavra:\n\nUse "A" antes de som de consoante:\nA car, A dog, A house.\n\nUse "AN" antes de som de vogal (para não gaguejar ao falar):\nAn apple, An elephant, An hour (o "h" é mudo).',
          en: 'Both mean ONE thing.\n\nUse "A" before a consonant SOUND: A car.\n\nUse "AN" before a vowel SOUND: An apple, An hour.',
          es: 'Ambos significan UN/UNA.\n\nUsa "A" antes de sonido de consonante: A car.\n\nUsa "AN" antes de sonido de vocal: An apple, An hour.'
        },
        examples: ['A book', 'An orange', 'An umbrella']
      },
      {
        id: 'art_2',
        title: { pt: 'O chefão: THE', en: 'The boss: THE', es: 'El jefe: THE' },
        body: {
          pt: 'THE significa O, A, OS, AS. Usamos para algo ESPECÍFICO, que a pessoa já sabe do que estamos falando.\n\n"I bought A car" (Comprei um carro qualquer).\n"THE car is blue" (O carro específico que comprei é azul).',
          en: 'THE is used for SPECIFIC things we both know about.\n\n"I bought A car" (Any car).\n"THE car is blue" (The specific one I bought).',
          es: 'THE se usa para cosas ESPECÍFICAS.\n\n"I bought A car" (Cualquier coche).\n"THE car is blue" (El específico).'
        },
        examples: ['The sun is hot.', 'Where is the bathroom?']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Qual o correto para "Maçã" (apple)?', en: 'Correct for "apple"?', es: '¿Correcto para "apple"?' }, target: 'An apple', options: ['A apple', 'An apple', 'The apple'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Para dizer "O sol" (específico, único):', en: 'To say "The sun" (specific, unique):', es: 'Para decir "El sol":' }, target: 'The sun', options: ['A sun', 'An sun', 'The sun'] }
    ]
  },
  {
    id: 'lesson_plurals',
    title: { pt: 'Fazendo o Plural (+ de 1)', en: 'Making Plurals', es: 'Haciendo Plurales' },
    icon: 'Layers',
    group: ['A1'],
    theory: [
      {
        id: 'plur_1',
        title: { pt: 'A Regra do S', en: 'The S Rule', es: 'La Regla del S' },
        body: {
          pt: 'Na maioria das palavras em inglês, basta colocar um "s" no final para virar plural, igualzinho no Brasil!\n\nCar -> Cars (Carros)\nDog -> Dogs (Cachorros)\nBook -> Books (Livros)',
          en: 'For most words, just add "s"!\n\nCar -> Cars\nDog -> Dogs\nBook -> Books',
          es: 'Para la mayoría, ¡solo agrega "s"!\n\nCar -> Cars\nDog -> Dogs\nBook -> Books'
        },
        examples: ['Two cars', 'Three dogs', 'Five apples']
      },
      {
        id: 'plur_2',
        title: { pt: 'Os rebeldes (Irregulares)', en: 'The Rebels (Irregulars)', es: 'Los Rebeldes (Irregulares)' },
        body: {
          pt: 'Algumas palavras mudam a palavra toda no plural! Decore estes campeões de pegadinhas:\n\nMan (Homem) -> Men (Homens)\nWoman (Mulher) -> Women (Mulheres)\nChild (Criança) -> Children (Crianças)\nPerson (Pessoa) -> People (Pessoas)',
          en: 'Some words change completely!\n\nMan -> Men\nWoman -> Women\nChild -> Children\nPerson -> People',
          es: '¡Algunas palabras cambian completamente!\n\nMan -> Men\nWoman -> Women\nChild -> Children\nPerson -> People'
        },
        examples: ['One person, two people.', 'One child, three children.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Qual o plural de "Person" (Pessoa)?', en: 'Plural of "Person"?', es: '¿Plural de "Person"?' }, target: 'People', options: ['Persons', 'Peoples', 'People', 'Persones'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Qual o plural de "Child" (Criança)?', en: 'Plural of "Child"?', es: '¿Plural de "Child"?' }, target: 'Children', options: ['Childs', 'Children', 'Childrens', 'Childes'] }
    ]
  },
  {
    id: 'lesson_simple_present',
    title: { pt: 'A Regra do S (Presente)', en: 'The S Rule (Present)', es: 'La Regla de la S (Presente)' },
    icon: 'Sun',
    group: ['A1'],
    theory: [
      {
        id: 'sp_1',
        title: { pt: 'Verbos no Dia a Dia', en: 'Everyday Verbs', es: 'Verbos Diarios' },
        body: {
          pt: 'Para falar sobre coisas que você faz na rotina (Presente), o inglês é ridículo de fácil. O verbo não muda para quase ninguém!\n\nVerbo Work (Trabalhar):\nI work (Eu trabalho)\nYou work (Você trabalha)\nWe work (Nós trabalhamos)\nThey work (Eles trabalham)',
          en: 'To talk about routine, English is super easy. The verb stays the same for almost everyone!\n\nI work, You work, We work, They work.',
          es: 'Para hablar de rutina, el inglés es muy fácil. ¡El verbo no cambia casi para nadie!\n\nI work, You work, We work, They work.'
        },
        examples: ['I drink coffee.', 'You speak English.', 'They play football.']
      },
      {
        id: 'sp_2',
        title: { pt: 'A Fofoca (He, She, It)', en: 'The Gossip (He, She, It)', es: 'El Chisme (He, She, It)' },
        body: {
          pt: 'A única regra chata é quando falamos sobre UMA outra pessoa (Ele, Ela ou Isso). \nSempre que for HE, SHE ou IT, o verbo ganha um "S" (ou "ES") no final!\n\nI work -> She workS (Ela trabalha)\nI play -> He playS (Ele joga)\nI go -> It goES (Isso vai)\n\nIsso NÃO É PLURAL! É só uma regrinha para marcar quem é o sujeito no presente.',
          en: 'When talking about ONE other person (He, She, It), the verb gets an "S" at the end!\n\nI work -> She workS\nI play -> He playS\nI go -> It goES',
          es: '¡Cuando hablamos de OTRA persona (He, She, It), el verbo lleva una "S" al final!\n\nI work -> She workS\nI play -> He playS\nI go -> It goES'
        },
        examples: ['She likes tea.', 'He runs fast.', 'The dog barks. (It barks)']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Complete: "He ___ in Dublin." (live)', en: 'Complete: "He ___ in Dublin." (live)', es: 'Completa: "He ___ in Dublin." (live)' }, target: 'lives', options: ['live', 'lives', 'living', 'lived'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Complete: "I ___ pizza." (like)', en: 'Complete: "I ___ pizza." (like)', es: 'Completa: "I ___ pizza." (like)' }, target: 'like', options: ['like', 'likes', 'liking', 'liked'] }
    ]
  },
  {
    id: 'lesson_there_is_are',
    title: { pt: 'There Is / There Are (Existência)', en: 'There Is / There Are', es: 'There Is / There Are' },
    icon: 'MapPin',
    group: ['A1'],
    theory: [
      {
        id: 'tia_1',
        title: { pt: 'Existência básica', en: 'Basic existence', es: 'Existencia básica' },
        body: {
          pt: '"There is" e "there are" significam "tem/há" — servem para dizer que algo EXISTE em um lugar.\n\nTHERE IS = singular ("tem um/uma...")\nTHERE ARE = plural ("tem vários...")\n\n"There is a book on the table." (Tem um livro na mesa.)\n"There are three books on the table." (Tem três livros na mesa.)',
          en: '"There is" and "there are" mean something EXISTS somewhere.\n\nTHERE IS = singular\nTHERE ARE = plural',
          es: '"There is" y "there are" significan que algo EXISTE en algún lugar.'
        },
        examples: ['There is a cat.', 'There are two cats.', 'There is water.']
      },
      {
        id: 'tia_2',
        title: { pt: 'Negativas e Perguntas', en: 'Negatives and Questions', es: 'Negativas y Preguntas' },
        body: {
          pt: 'Negativa: "There isn\'t" / "There aren\'t".\n"There isn\'t any milk." (Não tem leite.)\n\nPergunta: inverte a ordem.\n"Is there a bathroom here?" (Tem um banheiro aqui?)\n"Are there any seats?" (Tem alguma vaga/assento?)',
          en: 'Negative: "There isn\'t" / "There aren\'t".\nQuestion: invert the order.\n"Is there a bathroom here?"',
          es: 'Negativa: "There isn\'t" / "There aren\'t".\nPregunta: invierte el orden.'
        },
        examples: ['There isn\'t any milk.', 'Is there a bathroom?', 'Are there any seats?']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Complete: "___ a book on the table." (singular)', en: 'Complete: "___ a book on the table."', es: 'Completa: "___ a book on the table."' }, target: 'There is', options: ['There is', 'There are', 'It is', 'They are'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Complete: "___ three cats in the house."', en: 'Complete: "___ three cats in the house."', es: 'Completa: "___ three cats in the house."' }, target: 'There are', options: ['There are', 'There is', 'It are', 'Is there'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Traduza: "Tem um banheiro aqui?"', en: 'Translate: "Is there a bathroom here?"', es: 'Traduce: "Is there a bathroom here?"' }, target: 'Is there a bathroom here?', options: ['Is there a bathroom here?', 'There is a bathroom here?', 'Is a bathroom there here?', 'There a bathroom is here?'] },
      { id: 'q4', type: 'fill_choice', question: { pt: 'Negativa correta de "There are seats":', en: 'Correct negative of "There are seats":', es: 'Negativa correcta de "There are seats":' }, target: 'There aren\'t any seats.', options: ['There aren\'t any seats.', 'There isn\'t any seats.', 'There not are seats.', 'There no are seats.'] }
    ]
  },
  {
    id: 'lesson_possessives',
    title: { pt: 'De Quem É? (Possessivos)', en: 'Whose Is It? (Possessives)', es: '¿De Quién Es? (Posesivos)' },
    icon: 'Key',
    group: ['A1'],
    theory: [
      {
        id: 'poss_1',
        title: { pt: 'Adjetivos Possessivos', en: 'Possessive Adjectives', es: 'Adjetivos Posesivos' },
        body: {
          pt: 'My = meu/minha\nYour = seu/sua (de você)\nHis = dele (de um homem)\nHer = dela (de uma mulher)\nIts = dele/dela (de coisa/animal)\nOur = nosso/nossa\nTheir = deles/delas\n\nSempre vêm ANTES do substantivo: "my car", "her phone".',
          en: 'My, Your, His, Her, Its, Our, Their. They always come BEFORE the noun.',
          es: 'My, Your, His, Her, Its, Our, Their. Siempre van ANTES del sustantivo.'
        },
        examples: ['This is my car.', 'That is her phone.', 'This is their house.']
      },
      {
        id: 'poss_2',
        title: { pt: 'O apóstrofo \'S', en: 'The apostrophe \'S', es: 'El apóstrofo \'S' },
        body: {
          pt: 'Para dizer que algo é de alguém (nome próprio), usamos \'S:\n\nJohn\'s car (o carro do John)\nMaria\'s phone (o celular da Maria)\n\nSe o nome já termina em S (plural), só se coloca o apóstrofo:\nThe boys\' room (o quarto dos meninos)',
          en: 'To say something belongs to someone, use \'S:\n\nJohn\'s car\nMaria\'s phone',
          es: 'Para decir que algo pertenece a alguien, usa \'S:\n\nJohn\'s car'
        },
        examples: ['John\'s car', 'Maria\'s phone', 'The boys\' room']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Complete: "This is ___ car." (de você)', en: 'Complete: "This is ___ car." (yours)', es: 'Completa: "This is ___ car." (tuyo)' }, target: 'your', options: ['your', 'you', 'yours', 'you\'re'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Traduza: "Este é o carro do John"', en: 'Translate: "This is John\'s car"', es: 'Traduce: "This is John\'s car"' }, target: 'This is John\'s car.', options: ['This is John\'s car.', 'This is John car.', 'This is car of John.', 'This is Johns car.'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Qual possessivo usamos para um objeto/animal (it)?', en: 'Which possessive do we use for a thing/animal (it)?', es: '¿Qué posesivo usamos para un objeto/animal (it)?' }, target: 'Its', options: ['Its', 'It\'s', 'His', 'Their'] },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Fale: "This is Maria\'s phone."', en: 'Say: "This is Maria\'s phone."', es: 'Di: "This is Maria\'s phone."' }, target: ['this is marias phone', 'this is maria\'s phone'], instructions: { pt: 'Fale devagar, prestando atenção no \'s.', en: 'Say it slowly, focusing on the \'s.', es: 'Di despacio, prestando atención al \'s.' } }
    ]
  },
  {
    id: 'lesson_can_cant',
    title: { pt: 'CAN e CAN\'T (Habilidade)', en: 'CAN and CAN\'T (Ability)', es: 'CAN y CAN\'T (Habilidad)' },
    icon: 'CheckSquare',
    group: ['A1'],
    theory: [
      {
        id: 'can_1',
        title: { pt: 'CAN = Consigo/Posso', en: 'CAN = I can', es: 'CAN = Puedo' },
        body: {
          pt: 'CAN é usado para dizer que você é CAPAZ de fazer algo (habilidade) ou tem PERMISSÃO.\n\n"I can swim." (Eu sei/consigo nadar.)\n"Can you speak English?" (Você consegue falar inglês?)\n\nCAN nunca muda de forma (não vira "cans" para he/she/it) e é seguido do verbo na forma BASE.',
          en: 'CAN is used to say you are ABLE to do something, or have permission.\n\n"I can swim."\n"Can you speak English?"',
          es: 'CAN se usa para decir que eres CAPAZ de hacer algo, o tienes permiso.'
        },
        examples: ['I can drive.', 'She can cook.', 'Can you help me?']
      },
      {
        id: 'can_2',
        title: { pt: 'CAN\'T = Não consigo', en: 'CAN\'T = I cannot', es: 'CAN\'T = No puedo' },
        body: {
          pt: 'A negativa de CAN é CAN\'T (ou CANNOT, mais formal).\n\n"I can\'t swim." (Eu não sei nadar.)\n"He can\'t come today." (Ele não pode vir hoje.)\n\nCuidado com a pronúncia: "can" (fraco, quase "kn") vs "can\'t" (forte, "kænt").',
          en: 'The negative of CAN is CAN\'T (or CANNOT, more formal).\n\n"I can\'t swim."',
          es: 'La negativa de CAN es CAN\'T (o CANNOT, más formal).'
        },
        examples: ['I can\'t swim.', 'He can\'t come today.', 'We can\'t find it.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Traduza: "Eu sei nadar"', en: 'Translate: "I can swim"', es: 'Traduce: "I can swim"' }, target: 'I can swim.', options: ['I can swim.', 'I cans swim.', 'I can to swim.', 'I could swim now.'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Traduza: "Ele não pode vir hoje"', en: 'Translate: "He can\'t come today"', es: 'Traduce: "He can\'t come today"' }, target: 'He can\'t come today.', options: ['He can\'t come today.', 'He no can come today.', 'He cannot comes today.', 'He can\'t comes today.'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Pergunta correta: "Você consegue falar inglês?"', en: 'Correct question: "Can you speak English?"', es: 'Pregunta correcta: "Can you speak English?"' }, target: 'Can you speak English?', options: ['Can you speak English?', 'You can speak English?', 'Do you can speak English?', 'Can you to speak English?'] },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Fale: "I can\'t swim, but I can drive."', en: 'Say: "I can\'t swim, but I can drive."', es: 'Di: "I can\'t swim, but I can drive."' }, target: ['i cant swim but i can drive', 'i can\'t swim but i can drive'], instructions: { pt: 'Fale devagar, contrastando "can" e "can\'t".', en: 'Say it slowly, contrasting "can" and "can\'t".', es: 'Di despacio, contrastando "can" y "can\'t".' } }
    ]
  },

  // ==========================================
  // NÍVEL A2 (TEMPOS VERBAIS E DETALHES)
  // ==========================================
  {
    id: 'lesson_present_continuous',
    title: { pt: 'O que está Acontecendo Agora (-ING)', en: 'What Is Happening Now (-ING)', es: 'Lo que Está Pasando Ahora (-ING)' },
    icon: 'Play',
    group: ['A2'],
    theory: [
      {
        id: 'pc_1',
        title: { pt: 'To Be + Verbo-ING', en: 'To Be + Verb-ING', es: 'To Be + Verbo-ING' },
        body: {
          pt: 'Para dizer que algo está acontecendo NESTE momento, usamos: TO BE (am/is/are) + verbo + ING.\n\n"I am working." (Eu estou trabalhando.)\n"She is eating." (Ela está comendo.)\n"They are playing." (Eles estão jogando.)\n\nÉ o "estou fazendo" do português.',
          en: 'To say something is happening RIGHT NOW, use: TO BE (am/is/are) + verb + ING.\n\n"I am working."\n"She is eating."',
          es: 'Para decir que algo está pasando AHORA MISMO, usa: TO BE (am/is/are) + verbo + ING.'
        },
        examples: ['I am reading.', 'He is sleeping.', 'We are talking.']
      },
      {
        id: 'pc_2',
        title: { pt: 'Regras de ortografia do -ING', en: 'Spelling rules for -ING', es: 'Reglas de ortografía del -ING' },
        body: {
          pt: 'work -> working (regra normal: só adiciona ING)\nmake -> making (termina em "e" mudo -> tira o "e" e adiciona ING)\nrun -> running (verbo curto CVC -> dobra a última letra)\nlie -> lying (termina em "ie" -> vira "y" + ING)',
          en: 'work -> working (normal rule)\nmake -> making (silent "e" -> drop it and add ING)\nrun -> running (short CVC verb -> double the last letter)',
          es: 'work -> working (regla normal)\nmake -> making ("e" muda -> quítala y añade ING)\nrun -> running (verbo corto CVC -> duplica la última letra)'
        },
        examples: ['She is writing.', 'He is running.', 'They are swimming.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Complete: "I ___ working." ', en: 'Complete: "I ___ working."', es: 'Completa: "I ___ working."' }, target: 'am', options: ['am', 'is', 'are', 'be'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Gerúndio de "run":', en: 'Gerund of "run":', es: 'Gerundio de "run":' }, target: 'running', options: ['runing', 'running', 'runeing', 'runnning'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Traduza: "Eles estão jogando futebol"', en: 'Translate: "They are playing football"', es: 'Traduce: "They are playing football"' }, target: 'They are playing football.', options: ['They are playing football.', 'They play football.', 'They is playing football.', 'They are play football.'] },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Fale: "I am reading a book."', en: 'Say: "I am reading a book."', es: 'Di: "I am reading a book."' }, target: ['i am reading a book'], instructions: { pt: 'Fale a frase devagar.', en: 'Say it slowly.', es: 'Di la frase despacio.' } }
    ]
  },
  {
    id: 'lesson_past_tense',
    title: { pt: 'Past Tense: Verbos Regulares e Irregulares', en: 'Past Tense: Regular and Irregular Verbs', es: 'Past Tense: Verbos Regulares e Irregulares' },
    icon: 'History',
    group: ['A2'],
    theory: [
      {
        id: 'past_1',
        title: { pt: 'O que é o Past Tense', en: 'What is Past Tense', es: 'Qué es el Past Tense' },
        body: {
          pt: 'O "Simple Past" (passado simples) é usado para falar de ações que JÁ terminaram, em um momento específico do passado.\n\nEx: "I worked yesterday." (Eu trabalhei ontem.)\nEx: "She visited Dublin last year." (Ela visitou Dublin ano passado.)\n\nDiferente do português, o verbo no passado simples em inglês NÃO muda de acordo com a pessoa (eu, você, ele...) — é sempre a mesma forma.',
          en: 'The Simple Past is used to talk about actions that already finished at a specific point in the past.\n\nEx: "I worked yesterday."\nEx: "She visited Dublin last year."\n\nUnlike Portuguese, the past tense verb does NOT change according to the subject — it stays the same for I, you, he, she, etc.',
          es: 'El Simple Past se usa para hablar de acciones que ya terminaron en un momento específico del pasado.\n\nEj: "I worked yesterday."\nEj: "She visited Dublin last year."\n\nA diferencia del español, el verbo en pasado simple NO cambia según la persona.'
        },
        examples: ['I worked.', 'You worked.', 'He worked.', 'They worked.']
      },
      {
        id: 'past_2',
        title: { pt: 'Verbos Regulares: a regra do -ED', en: 'Regular Verbs: the -ED rule', es: 'Verbos Regulares: la regla del -ED' },
        body: {
          pt: 'A maioria dos verbos em inglês é REGULAR: basta adicionar "-ed" no final.\n\nwork → worked\nplay → played\nwant → wanted\n\nRegras de ortografia:\n• Termina em "e" → só adiciona "d" (live → lived)\n• Termina em consoante+y → troca "y" por "ied" (study → studied)\n• Verbo curto CVC (consoante-vogal-consoante) → dobra a última letra (stop → stopped)',
          en: 'Most English verbs are REGULAR: just add "-ed" at the end.\n\nwork → worked\nplay → played\nwant → wanted\n\nSpelling rules:\n• Ends in "e" → just add "d" (live → lived)\n• Ends in consonant+y → change "y" to "ied" (study → studied)\n• Short CVC verb → double the last letter (stop → stopped)',
          es: 'La mayoría de los verbos en inglés son REGULARES: solo agrega "-ed" al final.\n\nwork → worked\nplay → played\nwant → wanted\n\nReglas de ortografía:\n• Termina en "e" → solo agrega "d" (live → lived)\n• Termina en consonante+y → cambia "y" por "ied" (study → studied)\n• Verbo corto CVC → duplica la última letra (stop → stopped)'
        },
        examples: ['I lived in Brazil.', 'She studied English.', 'The car stopped suddenly.']
      },
      {
        id: 'past_3',
        title: { pt: 'Verbos Irregulares: não seguem regra', en: 'Irregular Verbs: no fixed rule', es: 'Verbos Irregulares: sin regla fija' },
        body: {
          pt: 'Muitos dos verbos MAIS usados em inglês são irregulares — precisam ser decorados um por um.\n\ngo → went\nsee → saw\nhave → had\ndo → did\nmake → made\ntake → took\nget → got\nsay → said\nknow → knew\ncome → came\n\nNão existe atalho aqui: praticar bastante é o único caminho!',
          en: 'Many of the MOST used verbs in English are irregular — they need to be memorized one by one.\n\ngo → went\nsee → saw\nhave → had\ndo → did\nmake → made\ntake → took\nget → got\nsay → said\nknow → knew\ncome → came\n\nThere\'s no shortcut here: lots of practice is the only way!',
          es: 'Muchos de los verbos MÁS usados en inglés son irregulares — hay que memorizarlos uno por uno.\n\ngo → went\nsee → saw\nhave → had\ndo → did\nmake → made\ntake → took\nget → got\nsay → said\nknow → knew\ncome → came\n\n¡No hay atajo aquí: mucha práctica es el único camino!'
        },
        examples: ['I went to the shop.', 'She saw a bird.', 'We had breakfast.', 'He said hello.']
      },
      {
        id: 'past_4',
        title: { pt: 'Negativas e Perguntas no Passado', en: 'Negatives and Questions in the Past', es: 'Negativas y Preguntas en el Pasado' },
        body: {
          pt: 'Para negar ou perguntar no passado, usamos o auxiliar "DID" — e o verbo principal VOLTA para a forma base (sem -ed, sem mudança irregular)!\n\nAfirmativa: "I worked." / "I went."\nNegativa: "I didn\'t work." / "I didn\'t go." (nunca "didn\'t worked")\nPergunta: "Did you work?" / "Did you go?"\n\nEsse é o erro nº1 de quem está aprendendo: usar "did" + verbo no passado juntos.',
          en: 'To negate or ask questions in the past, we use the auxiliary "DID" — and the main verb goes BACK to its base form (no -ed, no irregular change)!\n\nAffirmative: "I worked." / "I went."\nNegative: "I didn\'t work." / "I didn\'t go." (never "didn\'t worked")\nQuestion: "Did you work?" / "Did you go?"\n\nThis is the #1 mistake for learners: using "did" + past tense verb together.',
          es: 'Para negar o preguntar en pasado, usamos el auxiliar "DID" — ¡y el verbo principal vuelve a su forma base!\n\nAfirmativa: "I worked." / "I went."\nNegativa: "I didn\'t work." / "I didn\'t go." (nunca "didn\'t worked")\nPregunta: "Did you work?" / "Did you go?"\n\nEste es el error nº1 de quien está aprendiendo: usar "did" + verbo en pasado juntos.'
        },
        examples: ['I didn\'t see him.', 'Did she call you?', 'We didn\'t go home.', 'Did they arrive?']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Passado de "study":', en: 'Past tense of "study":', es: 'Pasado de "study":' }, target: 'studied', options: ['studyed', 'studied', 'studies', 'studing'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Qual verbo é IRREGULAR?', en: 'Which verb is IRREGULAR?', es: '¿Qué verbo es IRREGULAR?' }, target: 'go → went', options: ['go → went', 'play → played', 'walk → walked', 'want → wanted'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Complete: "I ___ to the shop yesterday." (go)', en: 'Complete: "I ___ to the shop yesterday." (go)', es: 'Completa: "I ___ to the shop yesterday." (go)' }, target: 'went', options: ['went', 'goed', 'go', 'gone'] },
      { id: 'q4', type: 'fill_choice', question: { pt: 'Negativa correta de "She worked":', en: 'Correct negative of "She worked":', es: 'Negativa correcta de "She worked":' }, target: 'She didn\'t work.', options: ['She didn\'t work.', 'She didn\'t worked.', 'She not worked.', 'She no worked.'] },
      { id: 'q5', type: 'fill_choice', question: { pt: 'Pergunta correta no passado sobre "you call":', en: 'Correct past question about "you call":', es: 'Pregunta correcta en pasado sobre "you call":' }, target: 'Did you call?', options: ['Did you call?', 'Did you called?', 'You called?', 'Call you did?'] }
    ]
  },
  {
    id: 'lesson_irregular_verbs_core',
    title: { pt: '20 Verbos Irregulares Essenciais', en: '20 Essential Irregular Verbs', es: '20 Verbos Irregulares Esenciales' },
    icon: 'ListOrdered',
    group: ['A2'],
    theory: [
      {
        id: 'irr_1',
        title: { pt: 'Os campeões de frequência', en: 'The most frequent ones', es: 'Los más frecuentes' },
        body: {
          pt: 'Estes são os verbos irregulares que você vai usar TODOS OS DIAS. Base -> Passado:\n\nbe -> was/were\nhave -> had\ndo -> did\ngo -> went\nsee -> saw\nget -> got\nmake -> made\ntake -> took\ncome -> came\nknow -> knew',
          en: 'These are the irregular verbs you will use EVERY DAY. Base -> Past:\n\nbe -> was/were, have -> had, do -> did, go -> went, see -> saw',
          es: 'Estos son los verbos irregulares que usarás TODOS LOS DÍAS.'
        },
        examples: ['I was tired.', 'She had a car.', 'We went home.']
      },
      {
        id: 'irr_2',
        title: { pt: 'Mais 10 essenciais', en: '10 more essentials', es: '10 más esenciales' },
        body: {
          pt: 'say -> said\ntell -> told\nthink -> thought\nfind -> found\ngive -> gave\ntake -> took\nfeel -> felt\nleave -> left\nput -> put (não muda!)\nread -> read (não muda a escrita, mas MUDA a pronúncia!)',
          en: 'say -> said, tell -> told, think -> thought, find -> found, give -> gave, put -> put (no change!)',
          es: 'say -> said, tell -> told, think -> thought, find -> found, give -> gave'
        },
        examples: ['I said hello.', 'She told me a secret.', 'We found the keys.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Passado de "go":', en: 'Past of "go":', es: 'Pasado de "go":' }, target: 'went', options: ['went', 'goed', 'gone', 'go'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Traduza: "Ela me contou um segredo"', en: 'Translate: "She told me a secret"', es: 'Traduce: "She told me a secret"' }, target: 'She told me a secret.', options: ['She told me a secret.', 'She telled me a secret.', 'She tells me a secret.', 'She said me a secret.'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Passado de "think":', en: 'Past of "think":', es: 'Pasado de "think":' }, target: 'thought', options: ['thought', 'thinked', 'thinken', 'think'] },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Fale: "I saw her and I felt happy."', en: 'Say: "I saw her and I felt happy."', es: 'Di: "I saw her and I felt happy."' }, target: ['i saw her and i felt happy'], instructions: { pt: 'Fale devagar.', en: 'Say it slowly.', es: 'Di despacio.' } }
    ]
  },
  {
    id: 'lesson_do_make',
    title: { pt: 'Fazer vs Fabricar (Do / Make)', en: 'Do vs Make', es: 'Hacer vs Fabricar (Do / Make)' },
    icon: 'Hammer',
    group: ['A2'],
    theory: [
      {
        id: 'dm_1',
        title: { pt: 'DO: Ações e Tarefas', en: 'DO: Actions and Tasks', es: 'DO: Acciones y Tareas' },
        body: {
          pt: 'Em português, "fazer um favor" e "fazer um bolo" usam o mesmo verbo. No inglês não!\n\nUse DO para ações abstratas, tarefas rotineiras ou trabalhos onde nada físico é criado.\n\nEx: Do your job (Faça seu trabalho).\nEx: Do me a favor (Me faça um favor).\nEx: Do the dishes (Lave a louça - a louça já existe, você só faz a ação).',
          en: 'Use DO for abstract actions, routine tasks, or work where nothing physical is created.\n\nEx: Do your job.\nEx: Do me a favor.',
          es: 'Usa DO para acciones abstractas, tareas o trabajo donde no se crea nada físico.\n\nEj: Do your job.\nEj: Do me a favor.'
        },
        examples: ['Do homework.', 'Do business.', 'Do the laundry.']
      },
      {
        id: 'dm_2',
        title: { pt: 'MAKE: Criar e Fabricar', en: 'MAKE: Create and Build', es: 'MAKE: Crear y Construir' },
        body: {
          pt: 'Use MAKE quando você vai CRIAR, CONSTRUIR ou PRODUZIR algo que não existia antes.\n\nEx: Make a cake (Fazer um bolo - você junta os ingredientes e cria o bolo).\nEx: Make coffee (Fazer café).\nEx: Make a mistake (Cometer/criar um erro).',
          en: 'Use MAKE when you CREATE, BUILD or PRODUCE something new.\n\nEx: Make a cake.\nEx: Make coffee.',
          es: 'Usa MAKE cuando CREAS, CONSTRUYES o PRODUCES algo nuevo.\n\nEj: Make a cake.\nEj: Make coffee.'
        },
        examples: ['Make breakfast.', 'Make a plan.', 'Made in China.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Qual usamos para o café? "___ coffee".', en: 'Which one for coffee? "___ coffee".', es: '¿Cuál para café? "___ coffee".' }, target: 'Make', options: ['Do', 'Make'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Para dizer "Me faça um favor": "___ me a favor".', en: 'To say "___ me a favor".', es: 'Para decir "___ me a favor".' }, target: 'Do', options: ['Do', 'Make'] }
    ]
  },
  {
    id: 'lesson_prepositions_place',
    title: { pt: 'Preposições de Lugar (In, On, At)', en: 'Prepositions of Place', es: 'Preposiciones de Lugar' },
    icon: 'Compass',
    group: ['A2'],
    theory: [
      {
        id: 'prep_1',
        title: { pt: 'IN, ON e AT', en: 'IN, ON and AT', es: 'IN, ON y AT' },
        body: {
          pt: 'IN = dentro de um espaço fechado/área grande: "in the box", "in London", "in the car".\nON = em cima de uma superfície: "on the table", "on the wall".\nAT = em um ponto específico: "at the door", "at the bus stop", "at home".',
          en: 'IN = inside an enclosed space/large area.\nON = on top of a surface.\nAT = at a specific point.',
          es: 'IN = dentro de un espacio cerrado/área grande.\nON = encima de una superficie.\nAT = en un punto específico.'
        },
        examples: ['The keys are in the box.', 'The book is on the table.', 'I am at the door.']
      },
      {
        id: 'prep_2',
        title: { pt: 'UNDER, BEHIND, BETWEEN', en: 'UNDER, BEHIND, BETWEEN', es: 'UNDER, BEHIND, BETWEEN' },
        body: {
          pt: 'UNDER = embaixo de: "The cat is under the table."\nBEHIND = atrás de: "He is behind the door."\nBETWEEN = entre (duas coisas): "The bank is between the pharmacy and the shop."',
          en: 'UNDER = below something.\nBEHIND = at the back of.\nBETWEEN = in the middle of two things.',
          es: 'UNDER = debajo de algo.\nBEHIND = detrás de.\nBETWEEN = entre dos cosas.'
        },
        examples: ['The dog is under the bed.', 'She is behind you.', 'It is between the two houses.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Complete: "The book is ___ the table." (em cima)', en: 'Complete: "The book is ___ the table." (on top)', es: 'Completa: "The book is ___ the table." (encima)' }, target: 'on', options: ['on', 'in', 'at', 'under'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Traduza: "Eu estou na porta"', en: 'Translate: "I am at the door"', es: 'Traduce: "I am at the door"' }, target: 'I am at the door.', options: ['I am at the door.', 'I am in the door.', 'I am on the door.', 'I am the door.'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Qual preposição usamos com cidades/países (dentro de uma área)?', en: 'Which preposition do we use with cities/countries?', es: '¿Qué preposición usamos con ciudades/países?' }, target: 'in', options: ['in', 'on', 'at', 'under'] },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Fale: "The dog is under the bed."', en: 'Say: "The dog is under the bed."', es: 'Di: "The dog is under the bed."' }, target: ['the dog is under the bed'], instructions: { pt: 'Fale devagar.', en: 'Say it slowly.', es: 'Di despacio.' } }
    ]
  },
  {
    id: 'lesson_comparatives',
    title: { pt: 'Comparando Coisas (-ER, -EST, MORE)', en: 'Comparing Things (-ER, -EST, MORE)', es: 'Comparando Cosas (-ER, -EST, MORE)' },
    icon: 'BarChart2',
    group: ['A2'],
    theory: [
      {
        id: 'comp_1',
        title: { pt: 'Adjetivos curtos: -ER e -EST', en: 'Short adjectives: -ER and -EST', es: 'Adjetivos cortos: -ER y -EST' },
        body: {
          pt: 'Para adjetivos curtos (1 sílaba, às vezes 2), adicionamos -ER para comparar e -EST para o superlativo:\n\ntall -> taller -> the tallest\nbig -> bigger -> the biggest (dobra a consoante)\n\n"She is taller than me." (Ela é mais alta que eu.)\n"He is the tallest in the class." (Ele é o mais alto da turma.)',
          en: 'For short adjectives, add -ER to compare and -EST for the superlative.\n\ntall -> taller -> the tallest',
          es: 'Para adjetivos cortos, agrega -ER para comparar y -EST para el superlativo.'
        },
        examples: ['She is taller than me.', 'He is the tallest.', 'This is bigger.']
      },
      {
        id: 'comp_2',
        title: { pt: 'Adjetivos longos: MORE e MOST', en: 'Long adjectives: MORE and MOST', es: 'Adjetivos largos: MORE y MOST' },
        body: {
          pt: 'Para adjetivos longos (2+ sílabas), usamos MORE + adjetivo, e THE MOST + adjetivo:\n\nexpensive -> more expensive -> the most expensive\n\n"This car is more expensive than that one." (Este carro é mais caro que aquele.)\n"It\'s the most expensive car here." (É o carro mais caro aqui.)\n\nIrregulares: good -> better -> the best / bad -> worse -> the worst.',
          en: 'For long adjectives, use MORE + adjective, and THE MOST + adjective.\n\nIrregulars: good -> better -> the best.',
          es: 'Para adjetivos largos, usa MORE + adjetivo, y THE MOST + adjetivo.'
        },
        examples: ['This is more expensive.', 'It\'s the most beautiful place.', 'This is better than that.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Comparativo de "tall":', en: 'Comparative of "tall":', es: 'Comparativo de "tall":' }, target: 'taller', options: ['taller', 'more tall', 'tallest', 'talles'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Superlativo de "big":', en: 'Superlative of "big":', es: 'Superlativo de "big":' }, target: 'the biggest', options: ['the biggest', 'the bigger', 'the most big', 'the bigest'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Traduza: "Este carro é mais caro que aquele"', en: 'Translate: "This car is more expensive than that one"', es: 'Traduce: "This car is more expensive than that one"' }, target: 'This car is more expensive than that one.', options: ['This car is more expensive than that one.', 'This car is expensiver than that one.', 'This car is the expensive than that one.', 'This car is much expensive that one.'] },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Fale: "This is the most expensive one."', en: 'Say: "This is the most expensive one."', es: 'Di: "This is the most expensive one."' }, target: ['this is the most expensive one'], instructions: { pt: 'Fale devagar.', en: 'Say it slowly.', es: 'Di despacio.' } }
    ]
  },
  {
    id: 'lesson_frequency_adverbs',
    title: { pt: 'Com que Frequência? (Always, Never...)', en: 'How Often? (Always, Never...)', es: '¿Con Qué Frecuencia? (Always, Never...)' },
    icon: 'RotateCw',
    group: ['A2'],
    theory: [
      {
        id: 'freq_1',
        title: { pt: 'A escada da frequência', en: 'The frequency ladder', es: 'La escalera de la frecuencia' },
        body: {
          pt: 'Do mais frequente ao menos frequente:\n\nAlways (sempre) 100%\nUsually (geralmente)\nOften (frequentemente)\nSometimes (às vezes)\nRarely / Seldom (raramente)\nNever (nunca) 0%',
          en: 'From most to least frequent:\n\nAlways, Usually, Often, Sometimes, Rarely/Seldom, Never.',
          es: 'De más a menos frecuente:\n\nAlways, Usually, Often, Sometimes, Rarely/Seldom, Never.'
        },
        examples: ['I always drink coffee.', 'She never smokes.', 'We sometimes go out.']
      },
      {
        id: 'freq_2',
        title: { pt: 'Onde colocar o advérbio', en: 'Where to place the adverb', es: 'Dónde colocar el adverbio' },
        body: {
          pt: 'Regra geral: o advérbio de frequência vem ANTES do verbo principal, mas DEPOIS do verbo To Be.\n\n"I always drink coffee." (antes de "drink")\n"She is always late." (depois de "is")\n\n"I drink always coffee" está ERRADO!',
          en: 'General rule: the frequency adverb comes BEFORE the main verb, but AFTER the verb To Be.\n\n"I always drink coffee."\n"She is always late."',
          es: 'Regla general: el adverbio de frecuencia va ANTES del verbo principal, pero DESPUÉS de To Be.'
        },
        examples: ['I always drink coffee.', 'She is always late.', 'He usually walks to work.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Qual advérbio significa 0% (nunca)?', en: 'Which adverb means 0% (never)?', es: '¿Qué adverbio significa 0% (nunca)?' }, target: 'Never', options: ['Never', 'Always', 'Sometimes', 'Often'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Posição correta em: "She ___ is late."', en: 'Correct position: "She ___ is late."', es: 'Posición correcta: "She ___ is late."' }, target: 'She is always late.', options: ['She is always late.', 'She always is late.', 'Always she is late.', 'She is late always.'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Traduza: "Nós às vezes saímos"', en: 'Translate: "We sometimes go out"', es: 'Traduce: "We sometimes go out"' }, target: 'We sometimes go out.', options: ['We sometimes go out.', 'We go sometimes out.', 'Sometimes we go out.', 'We go out sometimes.'] },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Fale: "I usually wake up early."', en: 'Say: "I usually wake up early."', es: 'Di: "I usually wake up early."' }, target: ['i usually wake up early'], instructions: { pt: 'Fale devagar.', en: 'Say it slowly.', es: 'Di despacio.' } }
    ]
  },
  {
    id: 'lesson_ordinals_dates',
    title: { pt: 'Ordinais e Como Falar Datas', en: 'Ordinals and Saying Dates', es: 'Ordinales y Cómo Decir Fechas' },
    icon: 'CalendarClock',
    group: ['A2'],
    theory: [
      {
        id: 'ord_1',
        title: { pt: 'Números Ordinais', en: 'Ordinal Numbers', es: 'Números Ordinales' },
        body: {
          pt: '1st = first\n2nd = second\n3rd = third\n4th = fourth\n5th = fifth\n...a partir do 4 é só adicionar "TH" ao número (fourth, fifth, sixth...), com exceção de números terminados em 1, 2, 3 (twenty-first, twenty-second, twenty-third).',
          en: '1st = first, 2nd = second, 3rd = third, 4th = fourth... from 4 onward, just add "TH".',
          es: '1st = first, 2nd = second, 3rd = third, 4th = fourth...'
        },
        examples: ['the first day', 'the third floor', 'the twenty-first of May']
      },
      {
        id: 'ord_2',
        title: { pt: 'Como falar uma data', en: 'How to say a date', es: 'Cómo decir una fecha' },
        body: {
          pt: 'Em inglês, a data é falada com o ordinal + "of" + mês:\n\n"May 21st" fala-se "the twenty-first of May" ou "May the twenty-first".\n\nPara o ano, separa-se em dois blocos de dois dígitos:\n2026 = "twenty twenty-six"\n1998 = "nineteen ninety-eight"',
          en: 'In English, dates are spoken with the ordinal + "of" + month: "May 21st" = "the twenty-first of May".',
          es: 'En inglés, las fechas se dicen con el ordinal + "of" + mes.'
        },
        examples: ['the first of January', 'March the third', 'twenty twenty-six']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Ordinal de "one":', en: 'Ordinal of "one":', es: 'Ordinal de "one":' }, target: 'first', options: ['first', 'onest', 'oneth', 'ones'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Como se fala o ano 2026 em inglês?', en: 'How do you say the year 2026 in English?', es: '¿Cómo se dice el año 2026 en inglés?' }, target: 'twenty twenty-six', options: ['twenty twenty-six', 'two thousand twenty-six only', 'twenty-o-twenty-six', 'two zero two six'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Ordinal de "twenty-one":', en: 'Ordinal of "twenty-one":', es: 'Ordinal de "twenty-one":' }, target: 'twenty-first', options: ['twenty-first', 'twenty-oneth', 'twentyone-th', 'twenty-onest'] },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Fale: "Today is the twenty-first of May."', en: 'Say: "Today is the twenty-first of May."', es: 'Di: "Today is the twenty-first of May."' }, target: ['today is the twenty first of may'], instructions: { pt: 'Fale devagar.', en: 'Say it slowly.', es: 'Di despacio.' } }
    ]
  },
  {
    id: 'lesson_future',
    title: { pt: 'O Futuro (Will vs Going To)', en: 'Future (Will vs Going To)', es: 'El Futuro (Will vs Going To)' },
    icon: 'FastForward',
    group: ['A2'],
    theory: [
      {
        id: 'fut_1',
        title: { pt: 'WILL: Promessas e Decisões Rápidas', en: 'WILL: Promises and Quick Decisions', es: 'WILL: Promesas y Decisiones Rápidas' },
        body: {
          pt: 'Usamos "WILL" para falar sobre o futuro quando acabamos de tomar uma decisão (na hora), quando fazemos promessas ou previsões incertas ("I think...").\n\n"I will help you." (Eu te ajudarei - decisão agora/promessa).\n"I think it will rain." (Eu acho que vai chover - previsão incerta).\n\nNa fala, "will" quase sempre vira a contração \'LL: "I\'ll", "You\'ll", "She\'ll".',
          en: 'We use "WILL" for future when we make a decision at the moment of speaking, for promises, or uncertain predictions.\n\n"I will help you."\n"I think it will rain."\n\nIn speech, it almost always becomes \'LL: "I\'ll", "You\'ll".',
          es: 'Usamos "WILL" para decisiones rápidas, promesas o predicciones inciertas.\n\n"I will help you."\n"I think it will rain."\n\nEn el habla, "will" casi siempre se contrae en \'LL: "I\'ll", "You\'ll".'
        },
        examples: ['I will call you tomorrow.', "I think I'll have a coffee.", "Don't worry, I won't tell anyone."]
      },
      {
        id: 'fut_2',
        title: { pt: 'GOING TO: Planos e Evidências', en: 'GOING TO: Plans and Evidence', es: 'GOING TO: Planes y Evidencia' },
        body: {
          pt: 'Usamos "Verb To Be + GOING TO" para planos que JÁ FIZEMOS antes de falar, ou para previsões com provas na nossa frente.\n\n"I am going to travel next month." (Eu vou viajar - já comprei a passagem).\n"Look at those dark clouds! It is going to rain." (Olha aquelas nuvens! Vai chover - há evidência).\n\nNo dia a dia, "going to" frequentemente vira "GONNA" na fala rápida.',
          en: 'We use "Verb To Be + GOING TO" for plans made before speaking, or predictions with clear evidence.\n\n"I am going to travel next month."\n"Look at those clouds! It is going to rain."\n\nIn daily speech, "going to" often becomes "GONNA".',
          es: 'Usamos "Verb To Be + GOING TO" para planes ya hechos o predicciones con evidencia clara.\n\n"I am going to travel next month."\n"Look at those clouds! It is going to rain."\n\nEn el habla diaria, a menudo se dice "GONNA".'
        },
        examples: ['I am going to visit my mother.', 'We are going to buy a car.', "It's gonna be a great day."]
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Qual usamos para uma decisão tomada na HORA da fala?', en: 'Which is used for a decision made at the MOMENT of speaking?', es: '¿Cuál usamos para una decisión rápida?' }, target: 'Will', options: ['Will', 'Going to', 'Did', 'Does'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Complete (você já planejou antes): "I ___ travel to Dublin next year."', en: 'Complete (you already planned it): "I ___ travel to Dublin next year."', es: 'Completa (ya lo planeaste): "I ___ travel to Dublin next year."' }, target: 'am going to', options: ['am going to', 'will', 'going to', 'will to'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'A contração "I\'ll" significa:', en: 'The contraction "I\'ll" means:', es: 'La contracción "I\'ll" significa:' }, target: 'I will', options: ['I will', 'I have', 'I am', 'I would'] },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Fale: "I am going to travel tomorrow."', en: 'Say: "I am going to travel tomorrow."', es: 'Di: "I am going to travel tomorrow."' }, target: ['i am going to travel tomorrow', 'im going to travel tomorrow', 'i am gonna travel tomorrow'], instructions: { pt: 'Fale com clareza.', en: 'Speak clearly.', es: 'Habla claro.' } }
    ]
  },

  // ==========================================
  // NÍVEL B1 (INTERMEDIÁRIO - EXPRESSÕES E PHRASAL VERBS)
  // ==========================================
  {
    id: 'lesson_get',
    title: { pt: 'O verbo GET (todos os sentidos)', en: 'The verb GET (all meanings)', es: 'El verbo GET (todos los sentidos)' },
    icon: 'Sparkles',
    group: ['B1'],
    theory: [
      {
        id: 'get_1',
        title: { pt: 'GET = Obter / Conseguir', en: 'GET = To obtain', es: 'GET = Obtener' },
        body: {
          pt: '"Get" no sentido mais básico significa "conseguir" ou "obter" algo.\n\nEx: "I need to get a new phone." (Eu preciso conseguir/comprar um celular novo.)\nEx: "Can you get me a coffee?" (Você pode me trazer um café?)',
          en: '"Get" in its most basic sense means to obtain or acquire something.\n\nEx: "I need to get a new phone."\nEx: "Can you get me a coffee?"',
          es: '"Get" en su sentido más básico significa obtener o conseguir algo.\n\nEj: "I need to get a new phone."\nEj: "Can you get me a coffee?"'
        },
        examples: ['I got a new job.', 'She got a text message.', 'Where did you get that jacket?']
      },
      {
        id: 'get_2',
        title: { pt: 'GET = Tornar-se (mudança de estado)', en: 'GET = To become', es: 'GET = Volverse' },
        body: {
          pt: '"Get" também indica uma MUDANÇA de estado — ficar de um jeito diferente do que estava.\n\nEx: "It\'s getting cold." (Está ficando frio.)\nEx: "He got angry." (Ele ficou bravo.)\nEx: "I\'m getting tired." (Estou ficando cansado.)',
          en: '"Get" also indicates a CHANGE of state — becoming different from before.\n\nEx: "It\'s getting cold."\nEx: "He got angry."',
          es: '"Get" también indica un CAMBIO de estado.\n\nEj: "It\'s getting cold."\nEj: "He got angry."'
        },
        examples: ['It got dark quickly.', 'They got married last year.', 'Don\'t get upset.']
      },
      {
        id: 'get_3',
        title: { pt: 'GET = Chegar / Ir até', en: 'GET = To arrive', es: 'GET = Llegar' },
        body: {
          pt: '"Get to" + lugar = chegar em / ir até um lugar.\n\nEx: "How do I get to the station?" (Como eu chego na estação?)\nEx: "We got home late." (Chegamos em casa tarde.)',
          en: '"Get to" + place = to arrive/travel to a place.\n\nEx: "How do I get to the station?"',
          es: '"Get to" + lugar = llegar a un lugar.\n\nEj: "How do I get to the station?"'
        },
        examples: ['I got to work at 9am.', 'How did you get here?', 'We finally got there.']
      },
      {
        id: 'get_4',
        title: { pt: 'GET = Entender', en: 'GET = To understand', es: 'GET = Entender' },
        body: {
          pt: '"Get it" é uma forma super comum de dizer "entendi" no dia a dia.\n\nEx: "Do you get it?" (Você entendeu?)\nEx: "I don\'t get this exercise." (Não entendo esse exercício.)',
          en: '"Get it" is a very common way to say "understand" in daily English.',
          es: '"Get it" es una forma común de decir "entender" en inglés cotidiano.'
        },
        examples: ['I get it now.', 'I don\'t get why he left.', 'You\'ll get it eventually.']
      },
      {
        id: 'get_5',
        title: { pt: 'Phrasal verbs com GET', en: 'Phrasal verbs with GET', es: 'Phrasal verbs con GET' },
        body: {
          pt: 'GET forma vários phrasal verbs com sentidos totalmente diferentes:\n\n• GET UP = levantar (da cama)\n• GET OUT = sair\n• GET OVER = superar algo\n• GET ALONG = se dar bem com alguém\n• GET BACK = voltar / retornar',
          en: 'GET forms several phrasal verbs with completely different meanings:\n\n• GET UP = to rise\n• GET OUT = to leave\n• GET OVER = to overcome\n• GET ALONG = to have a good relationship\n• GET BACK = to return',
          es: 'GET forma varios phrasal verbs con sentidos distintos:\n\n• GET UP = levantarse\n• GET OUT = salir\n• GET OVER = superar algo\n• GET ALONG = llevarse bien\n• GET BACK = regresar'
        },
        examples: ['I get up at 7am.', 'Get out of here!', 'She got over the breakup.', 'We get along well.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Complete: "It\'s ___ dark outside."', en: 'Complete: "It\'s ___ dark outside."', es: 'Completa: "It\'s ___ dark outside."' }, target: 'getting', options: ['getting', 'gets', 'got', 'get'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Qual frase usa GET no sentido de "entender"?', en: 'Which sentence uses GET meaning "understand"?', es: '¿Qué oración usa GET con el sentido de "entender"?' }, target: 'I don\'t get this exercise.', options: ['I don\'t get this exercise.', 'I got a new phone.', 'We got home late.', 'He got angry.'] },
      { id: 'q3', type: 'fill_choice', question: { pt: '"How do I ___ to the station?"', en: '"How do I ___ to the station?"', es: '"How do I ___ to the station?"' }, target: 'get', options: ['get', 'got', 'getting', 'gets'] },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Fale: "I get along with my sister."', en: 'Say: "I get along with my sister."', es: 'Di: "I get along with my sister."' }, target: ['i get along with my sister'], instructions: { pt: 'Fale a frase inteira devagar.', en: 'Say the whole sentence slowly.', es: 'Di la frase entera despacio.' } }
    ]
  },
  {
    id: 'lesson_modals_ould',
    title: { pt: 'Would, Could e Should (os "OULD")', en: 'Would, Could and Should', es: 'Would, Could y Should' },
    icon: 'Wand2',
    group: ['B1'],
    theory: [
      {
        id: 'ould_1',
        title: { pt: 'Os três "OULD" — visão geral', en: 'The three "OULD" words — overview', es: 'Los tres "OULD" — visión general' },
        body: {
          pt: 'Would, Could e Should são "modal verbs" — verbos auxiliares que mudam o SENTIDO do verbo principal. Todos são seguidos do verbo na forma BASE (sem "to", sem -s, sem -ed).\n\n• WOULD → usado para hipóteses, educação, "no passado do futuro"\n• COULD → capacidade no passado, possibilidade, pedidos educados\n• SHOULD → conselho, recomendação, obrigação moral (não legal)\n\nEx: "I would go." / "I could go." / "I should go." — mesma estrutura, sentidos diferentes!',
          en: 'Would, Could and Should are "modal verbs" — auxiliary verbs that change the MEANING of the main verb. They are all followed by the BASE form of the verb (no "to", no -s, no -ed).\n\n• WOULD → used for hypotheses, politeness, "future in the past"\n• COULD → past ability, possibility, polite requests\n• SHOULD → advice, recommendation, moral (not legal) obligation\n\nEx: "I would go." / "I could go." / "I should go." — same structure, different meanings!',
          es: 'Would, Could y Should son "verbos modales" — verbos auxiliares que cambian el SENTIDO del verbo principal. Todos van seguidos del verbo en forma BASE.\n\n• WOULD → hipótesis, cortesía, "futuro en el pasado"\n• COULD → capacidad en el pasado, posibilidad, pedidos educados\n• SHOULD → consejo, recomendación, obligación moral\n\nEj: "I would go." / "I could go." / "I should go." — ¡misma estructura, sentidos diferentes!'
        },
        examples: ['I would help you.', 'I could help you.', 'I should help you.']
      },
      {
        id: 'ould_2',
        title: { pt: 'WOULD: hipóteses e educação', en: 'WOULD: hypotheticals and politeness', es: 'WOULD: hipótesis y cortesía' },
        body: {
          pt: 'WOULD é usado para:\n\n1. Situações hipotéticas (o famoso "if" condicional):\n   "If I had money, I would travel." (Se eu tivesse dinheiro, eu viajaria.)\n\n2. Pedidos educados:\n   "Would you help me?" (Você poderia me ajudar?)\n\n3. Preferências educadas:\n   "I would like a coffee." (Eu gostaria de um café.)\n\nWOULD NÃO é usado para falar de habilidade ou possibilidade real — isso é papel do COULD.',
          en: 'WOULD is used for:\n\n1. Hypothetical situations (the classic "if" conditional):\n   "If I had money, I would travel."\n\n2. Polite requests:\n   "Would you help me?"\n\n3. Polite preferences:\n   "I would like a coffee."\n\nWOULD is NOT used for talking about ability or real possibility — that\'s COULD\'s job.',
          es: 'WOULD se usa para:\n\n1. Situaciones hipotéticas (el clásico condicional "if"):\n   "If I had money, I would travel."\n\n2. Pedidos educados:\n   "Would you help me?"\n\n3. Preferencias educadas:\n   "I would like a coffee."\n\nWOULD NO se usa para hablar de habilidad o posibilidad real — eso es trabajo de COULD.'
        },
        examples: ['I would love that.', 'Would you like some tea?', 'If I were rich, I would buy a house.']
      },
      {
        id: 'ould_3',
        title: { pt: 'COULD: capacidade e possibilidade', en: 'COULD: ability and possibility', es: 'COULD: capacidad y posibilidad' },
        body: {
          pt: 'COULD é usado para:\n\n1. Capacidade no PASSADO (o "can" do passado):\n   "When I was young, I could run fast." (Quando eu era jovem, eu conseguia correr rápido.)\n\n2. Possibilidade (algo que pode acontecer):\n   "It could rain later." (Pode ser que chova mais tarde.)\n\n3. Pedidos educados (mais formal que "can"):\n   "Could you pass the salt?" (Você poderia passar o sal?)',
          en: 'COULD is used for:\n\n1. Ability in the PAST (the past of "can"):\n   "When I was young, I could run fast."\n\n2. Possibility (something that might happen):\n   "It could rain later."\n\n3. Polite requests (more formal than "can"):\n   "Could you pass the salt?"',
          es: 'COULD se usa para:\n\n1. Capacidad en el PASADO (el "can" del pasado):\n   "When I was young, I could run fast."\n\n2. Posibilidad (algo que puede pasar):\n   "It could rain later."\n\n3. Pedidos educados (más formal que "can"):\n   "Could you pass the salt?"'
        },
        examples: ['I could swim when I was five.', 'This could be a problem.', 'Could you open the door?']
      },
      {
        id: 'ould_4',
        title: { pt: 'SHOULD: conselho e recomendação', en: 'SHOULD: advice and recommendation', es: 'SHOULD: consejo y recomendación' },
        body: {
          pt: 'SHOULD é usado para dar CONSELHOS ou dizer o que é a coisa certa a se fazer — não é uma obrigação legal, é uma recomendação.\n\n"You should drink more water." (Você deveria beber mais água.)\n"You shouldn\'t smoke." (Você não deveria fumar.)\n"Should I call him?" (Eu deveria ligar para ele?)\n\nCompare com "must" (obrigação forte/legal) — should é mais suave, tipo um "seria bom se você...".',
          en: 'SHOULD is used to give ADVICE or say what the right thing to do is — it\'s not a legal obligation, it\'s a recommendation.\n\n"You should drink more water."\n"You shouldn\'t smoke."\n"Should I call him?"\n\nCompare with "must" (strong/legal obligation) — should is softer, like "it would be good if you...".',
          es: 'SHOULD se usa para dar CONSEJOS o decir cuál es lo correcto — no es una obligación legal, es una recomendación.\n\n"You should drink more water."\n"You shouldn\'t smoke."\n"Should I call him?"\n\nCompara con "must" (obligación fuerte/legal) — should es más suave.'
        },
        examples: ['You should see a doctor.', 'We should leave now.', 'You shouldn\'t worry so much.']
      },
      {
        id: 'ould_5',
        title: { pt: 'Contrações: I\'d, I\'d better', en: 'Contractions: I\'d, I\'d better', es: 'Contracciones: I\'d, I\'d better' },
        body: {
          pt: 'Na fala do dia a dia, "would" quase sempre vira a contração \'D:\n\nI would → I\'d\nYou would → You\'d\nShe would → She\'d\n\n⚠️ Cuidado: "I\'d" pode ser "I would" OU "I had", dependendo do verbo seguinte!\n"I\'d like a coffee" = "I would like" (gostaria)\n"I\'d already left" = "I had already left" (eu já tinha saído)\n\nOutra expressão importante: "I\'d better" = "eu deveria/é melhor que eu" (aviso mais urgente que "should"):\n"I\'d better go now." (É melhor eu ir agora.)',
          en: 'In everyday speech, "would" almost always becomes the \'D contraction:\n\nI would → I\'d\nYou would → You\'d\nShe would → She\'d\n\n⚠️ Careful: "I\'d" can be "I would" OR "I had", depending on the following verb!\n"I\'d like a coffee" = "I would like"\n"I\'d already left" = "I had already left"\n\nAnother important expression: "I\'d better" = a more urgent warning than "should":\n"I\'d better go now."',
          es: 'En el habla cotidiana, "would" casi siempre se contrae en \'D:\n\nI would → I\'d\nYou would → You\'d\nShe would → She\'d\n\n⚠️ Cuidado: "I\'d" puede ser "I would" O "I had", ¡depende del verbo siguiente!\n"I\'d like a coffee" = "I would like"\n"I\'d already left" = "I had already left"\n\nOtra expresión importante: "I\'d better" = advertencia más urgente que "should":\n"I\'d better go now."'
        },
        examples: ['I\'d love to come.', 'She\'d help if she could.', 'I\'d better call him now.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: '"If I had money, I ___ travel." — Qual completa?', en: '"If I had money, I ___ travel." — Which completes it?', es: '"If I had money, I ___ travel." — ¿Cuál completa?' }, target: 'would', options: ['would', 'could', 'should', 'must'] },
      { id: 'q2', type: 'fill_choice', question: { pt: '"When I was young, I ___ run fast." (habilidade no passado)', en: '"When I was young, I ___ run fast." (past ability)', es: '"When I was young, I ___ run fast." (habilidad pasada)' }, target: 'could', options: ['could', 'would', 'should', 'will'] },
      { id: 'q3', type: 'fill_choice', question: { pt: '"I\'d like a coffee" significa:', en: '"I\'d like a coffee" means:', es: '"I\'d like a coffee" significa:' }, target: 'I would like', options: ['I would like', 'I had like', 'I did like', 'I will like'] },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Fale: "You should drink more water."', en: 'Say: "You should drink more water."', es: 'Di: "You should drink more water."' }, target: ['you should drink more water'], instructions: { pt: 'Fale a frase devagar e claramente.', en: 'Say the sentence slowly and clearly.', es: 'Di la frase despacio y claramente.' } }
    ]
  },
  {
    id: 'lesson_present_perfect',
    title: { pt: 'Present Perfect (A Ponte do Tempo)', en: 'Present Perfect (The Time Bridge)', es: 'Present Perfect (El Puente del Tiempo)' },
    icon: 'CheckCheck',
    group: ['B1'],
    theory: [
      {
        id: 'perf_1',
        title: { pt: 'A Ponte entre Passado e Presente', en: 'The Bridge between Past and Present', es: 'El Puente entre Pasado y Presente' },
        body: {
          pt: 'O "Present Perfect" é o tempo verbal que mais confunde! Ele funciona como uma ponte: fala de algo que aconteceu no passado, mas que ainda tem importância agora no presente.\n\nA regra de ouro: NÃO usamos para datas específicas (como "yesterday" ou "in 2010").\nSe a data não importa ou se a experiência é de vida (a qualquer momento até hoje), usamos Present Perfect.',
          en: 'The "Present Perfect" acts like a bridge: it talks about something that happened in the past but still matters now.\n\nGolden rule: We DO NOT use it for specific dates (like "yesterday").\nIf the date doesn\'t matter or it\'s a life experience, we use Present Perfect.',
          es: 'El "Present Perfect" funciona como un puente: habla de algo que ocurrió en el pasado pero que todavía importa ahora.\n\nRegla de oro: NO lo usamos para fechas específicas.\nSi la fecha no importa o es una experiencia de vida, lo usamos.'
        },
        examples: ['I have been to London.', 'She has finished her homework.', 'We have seen that movie.']
      },
      {
        id: 'perf_2',
        title: { pt: 'A Estrutura: Have/Has + Particípio', en: 'Structure: Have/Has + Participle', es: 'Estructura: Have/Has + Participio' },
        body: {
          pt: 'A fórmula é: Sujeito + HAVE (ou HAS para he/she/it) + Verbo na 3ª Coluna (Particípio).\n\nVerbos Regulares: O particípio é igual ao passado (-ed). (work -> worked -> have worked)\nVerbos Irregulares: Precisam ser decorados (see -> saw -> have seen / go -> went -> have gone).',
          en: 'The formula is: Subject + HAVE (or HAS) + Verb in 3rd Column (Participle).\n\nRegular Verbs: Participle is the same as past (-ed).\nIrregular Verbs: Need to be memorized (see -> saw -> have seen).',
          es: 'La fórmula es: Sujeto + HAVE (o HAS) + Verbo en la 3ª Columna (Participio).\n\nVerbos Regulares: Igual al pasado (-ed).\nVerbos Irregulares: Hay que memorizarlos.'
        },
        examples: ['I have worked here.', 'She has gone to the store.', 'They have eaten all the pizza.']
      },
      {
        id: 'perf_3',
        title: { pt: 'Have you ever...? (Experiências)', en: 'Have you ever...? (Experiences)', es: 'Have you ever...? (Experiencias)' },
        body: {
          pt: 'A expressão "Have you ever..." é a forma clássica de perguntar "Você alguma vez na vida já fez isso?".\n\n"Have you ever eaten sushi?" (Você já comeu sushi alguma vez?)\n"Has she ever visited Brazil?" (Ela alguma vez já visitou o Brasil?)\n\nA resposta curta é "Yes, I have." ou "No, I haven\'t." (e não "yes, I did").',
          en: 'The phrase "Have you ever..." is the classic way to ask if someone has done something at any point in their life.\n\n"Have you ever eaten sushi?"\n"Has she ever visited Brazil?"',
          es: 'La expresión "Have you ever..." es la forma clásica de preguntar si alguien ha hecho algo en su vida.\n\n"Have you ever eaten sushi?"'
        },
        examples: ['Have you ever seen a ghost?', 'Has he ever played golf?', 'No, I haven\'t.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: 'Para falar de uma experiência de vida (sem data), usamos:', en: 'To talk about a life experience (no date), we use:', es: 'Para hablar de una experiencia de vida, usamos:' }, target: 'Present Perfect', options: ['Simple Past', 'Present Perfect', 'Present Continuous', 'Future'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Complete: "___ you ever eaten sushi?"', en: 'Complete: "___ you ever eaten sushi?"', es: 'Completa: "___ you ever eaten sushi?"' }, target: 'Have', options: ['Did', 'Do', 'Have', 'Are'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Traduza: "Ela já terminou" (Present Perfect)', en: 'Translate: "She has finished"', es: 'Traduce: "She has finished"' }, target: 'She has finished.', options: ['She has finished.', 'She finished.', 'She is finish.', 'She have finished.'] },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Fale: "I have been to London."', en: 'Say: "I have been to London."', es: 'Di: "I have been to London."' }, target: ['i have been to london', 'i\'ve been to london'], instructions: { pt: 'Fale com clareza.', en: 'Speak clearly.', es: 'Habla claro.' } }
    ]
  },

  // ==========================================
  // NÍVEL B2 (AVANÇADO - PARTÍCULAS E EXCEÇÕES)
  // ==========================================
  {
    id: 'lesson_particles_up_on',
    title: { pt: 'UP e ON: sozinhos vs. em Phrasal Verbs', en: 'UP and ON: alone vs. in Phrasal Verbs', es: 'UP y ON: solos vs. en Phrasal Verbs' },
    icon: 'ArrowUpRight',
    group: ['B2'],
    theory: [
      {
        id: 'updon_1',
        title: { pt: 'O problema das partículas', en: 'The problem with particles', es: 'El problema de las partículas' },
        body: {
          pt: '"Up" e "on" sozinhos são simples: "up" = para cima, "on" = em cima de / ligado.\n\nMas quando eles se juntam a um VERBO, formam um "phrasal verb" — e o sentido pode mudar COMPLETAMENTE, sem relação nenhuma com "para cima" ou "em cima".\n\nEx: "look" (olhar) + "up" (para cima) = "look up" = PESQUISAR (num dicionário/Google)!\n\nNão dá pra traduzir palavra por palavra — precisa aprender o phrasal verb como um pacote só.',
          en: '"Up" and "on" alone are simple: "up" = upward, "on" = on top of / switched on.\n\nBut when they join a VERB, they form a "phrasal verb" — and the meaning can change COMPLETELY, with no relation at all to "upward" or "on top".\n\nEx: "look" + "up" = "look up" = to SEARCH FOR (in a dictionary/Google)!\n\nYou can\'t translate word by word — you need to learn the phrasal verb as one single package.',
          es: '"Up" y "on" solos son simples: "up" = hacia arriba, "on" = encima de / encendido.\n\nPero cuando se unen a un VERBO, forman un "phrasal verb" — ¡y el sentido puede cambiar COMPLETAMENTE!\n\nEj: "look" + "up" = "look up" = ¡BUSCAR (en un diccionario/Google)!\n\nNo se puede traducir palabra por palabra — hay que aprender el phrasal verb como un paquete.'
        },
        examples: ['The ball went up. (up sozinho)', 'The book is on the table. (on sozinho)', 'I looked up the word. (phrasal verb)']
      },
      {
        id: 'updon_2',
        title: { pt: 'Phrasal verbs com UP', en: 'Phrasal verbs with UP', es: 'Phrasal verbs con UP' },
        body: {
          pt: 'UP frequentemente indica "completar" ou "aumentar/aparecer" algo:\n\n• WAKE UP = acordar\n• GIVE UP = desistir\n• GROW UP = crescer/amadurecer\n• PICK UP = pegar (algo do chão), buscar alguém\n• BREAK UP = terminar (relacionamento)\n• SHOW UP = aparecer (num lugar)',
          en: 'UP often indicates "completing" or "increasing/appearing" something:\n\n• WAKE UP = to wake\n• GIVE UP = to quit\n• GROW UP = to mature\n• PICK UP = to pick something up, or pick someone up\n• BREAK UP = to end a relationship\n• SHOW UP = to appear somewhere',
          es: 'UP a menudo indica "completar" o "aumentar/aparecer" algo:\n\n• WAKE UP = despertar\n• GIVE UP = rendirse\n• GROW UP = madurar\n• PICK UP = recoger algo, o recoger a alguien\n• BREAK UP = terminar una relación\n• SHOW UP = aparecer en algún lugar'
        },
        examples: ['I woke up at 7am.', 'Don\'t give up!', 'He picked up the phone.', 'She showed up late.']
      },
      {
        id: 'updon_3',
        title: { pt: 'Phrasal verbs com ON', en: 'Phrasal verbs with ON', es: 'Phrasal verbs con ON' },
        body: {
          pt: 'ON frequentemente indica "continuidade" ou "ativação":\n\n• TURN ON = ligar (aparelho)\n• GET ON = entrar (ônibus/trem), se dar bem\n• GO ON = continuar\n• PUT ON = vestir/colocar\n• HOLD ON = esperar (um momento)\n• MOVE ON = seguir em frente',
          en: 'ON often indicates "continuity" or "activation":\n\n• TURN ON = to switch on\n• GET ON = to board (bus/train), or to have a good relationship\n• GO ON = to continue\n• PUT ON = to wear/put clothing on\n• HOLD ON = to wait a moment\n• MOVE ON = to move forward in life',
          es: 'ON a menudo indica "continuidad" o "activación":\n\n• TURN ON = encender\n• GET ON = subir (autobús/tren), o llevarse bien\n• GO ON = continuar\n• PUT ON = ponerse ropa\n• HOLD ON = esperar un momento\n• MOVE ON = seguir adelante'
        },
        examples: ['Turn on the lights.', 'We got on the bus.', 'Go on, I\'m listening.', 'Hold on a second!']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: '"Look up the word" significa:', en: '"Look up the word" means:', es: '"Look up the word" significa:' }, target: 'Pesquisar a palavra', options: ['Pesquisar a palavra', 'Olhar para cima', 'Gritar a palavra', 'Esquecer a palavra'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Complete: "Please turn ___ the lights." (ligar)', en: 'Complete: "Please turn ___ the lights." (switch on)', es: 'Completa: "Please turn ___ the lights." (encender)' }, target: 'on', options: ['on', 'up', 'over', 'out'] },
      { id: 'q3', type: 'fill_choice', question: { pt: '"Give up" significa:', en: '"Give up" means:', es: '"Give up" significa:' }, target: 'Desistir', options: ['Desistir', 'Dar um presente', 'Levantar', 'Continuar'] },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Fale: "I woke up and picked up my phone."', en: 'Say: "I woke up and picked up my phone."', es: 'Di: "I woke up and picked up my phone."' }, target: ['i woke up and picked up my phone'], instructions: { pt: 'Fale a frase inteira, com atenção aos dois "up".', en: 'Say the whole sentence, paying attention to both "up"s.', es: 'Di la frase entera, prestando atención a los dos "up".' } }
    ]
  },
  {
    id: 'lesson_through_though',
    title: { pt: 'Through, Though, Thought, Throughout e Tough', en: 'Through, Though, Thought, Throughout and Tough', es: 'Through, Though, Thought, Throughout y Tough' },
    icon: 'AlertOctagon',
    group: ['B2'],
    theory: [
      {
        id: 'thru_1',
        title: { pt: 'Por que essas palavras confundem tanto', en: 'Why these words are so confusing', es: 'Por qué estas palabras confunden tanto' },
        body: {
          pt: 'Through, though, thought, throughout e tough têm ortografia extremamente parecida (todas com "-ough" ou "-ough" no meio), mas se PRONUNCIAM de forma completamente diferente e têm sentidos diferentes.\n\nEssa é uma das maiores armadilhas do inglês escrito — a grafia não ajuda em nada a adivinhar o som!',
          en: 'Through, though, thought, throughout and tough have extremely similar spelling (all with "-ough" in the middle), but they are PRONOUNCED completely differently and have different meanings.\n\nThis is one of the biggest traps in written English — the spelling doesn\'t help you guess the sound at all!',
          es: 'Through, though, thought, throughout y tough tienen una ortografía extremadamente parecida, pero se PRONUNCIAN de forma completamente diferente y tienen sentidos diferentes.\n\n¡Esta es una de las mayores trampas del inglés escrito!'
        },
        examples: ['through (thru)', 'though (dhôu)', 'thought (thót)', 'tough (tâf)']
      },
      {
        id: 'thru_2',
        title: { pt: 'THROUGH = através de', en: 'THROUGH = across/via', es: 'THROUGH = a través de' },
        body: {
          pt: 'THROUGH (pronuncia: "thru", rima com "true") significa "através de", indicando movimento de um lado a outro de algo.\n\n"I walked through the park." (Eu andei através do parque.)\n"She looked through the window." (Ela olhou através da janela.)\n\nÉ a mesma pronúncia da abreviação informal "thru" que você vê em placas de drive-thru!',
          en: 'THROUGH (pronounced "thru", rhymes with "true") means moving from one side of something to the other.\n\n"I walked through the park."\n"She looked through the window."\n\nIt\'s the same pronunciation as the informal abbreviation "thru" you see on drive-thru signs!',
          es: 'THROUGH (se pronuncia "thru", rima con "true") significa "a través de", indicando movimiento de un lado a otro.\n\n"I walked through the park."\n"She looked through the window."\n\n¡Es la misma pronunciación que la abreviación informal "thru" de los carteles drive-thru!'
        },
        examples: ['I drove through the tunnel.', 'She looked through the window.', 'We got through the exam.']
      },
      {
        id: 'thru_3',
        title: { pt: 'THOUGH = "mas / apesar disso"', en: 'THOUGH = "but / nevertheless"', es: 'THOUGH = "pero / sin embargo"' },
        body: {
          pt: 'THOUGH (pronuncia: "dhôu", rima com "go") significa "embora" ou "mas/apesar disso" — é uma versão mais casual de "although" e frequentemente vai no FINAL da frase.\n\n"I like it, though it\'s expensive." (Eu gosto, embora seja caro.)\n"It\'s expensive. I like it, though." (É caro. Eu gosto, apesar disso.) — bem comum na fala!',
          en: 'THOUGH (pronounced "dhôu", rhymes with "go") means "although" or "but/nevertheless" — it\'s a more casual version of "although" and often goes at the END of the sentence.\n\n"I like it, though it\'s expensive."\n"It\'s expensive. I like it, though." — very common in speech!',
          es: 'THOUGH (se pronuncia "dhôu", rima con "go") significa "aunque" o "pero/sin embargo" — es una versión más casual de "although" y a menudo va al FINAL de la oración.\n\n"I like it, though it\'s expensive."\n"It\'s expensive. I like it, though." — ¡muy común en el habla!'
        },
        examples: ['I\'m tired, though I feel happy.', 'It\'s hard work. I enjoy it, though.', 'Even though it rained, we went out.']
      },
      {
        id: 'thru_4',
        title: { pt: 'THOUGHT = "pensei" / "pensamento"', en: 'THOUGHT = "thought" (past of think / noun)', es: 'THOUGHT = "pensé" / "pensamiento"' },
        body: {
          pt: 'THOUGHT (pronuncia: "thót", rima com "caught") é o passado do verbo "think" (pensar) OU o substantivo "pensamento".\n\n"I thought about it." (Eu pensei sobre isso.)\n"That\'s a good thought." (Esse é um bom pensamento/ideia.)\n\nRepare que a pronúncia é BEM diferente de "through" e "though", mesmo parecendo escrito de forma parecida!',
          en: 'THOUGHT (pronounced "thót", rhymes with "caught") is the past tense of "think" OR the noun "thought/idea".\n\n"I thought about it."\n"That\'s a good thought."\n\nNotice the pronunciation is VERY different from "through" and "though", even though it looks similarly spelled!',
          es: 'THOUGHT (se pronuncia "thót", rima con "caught") es el pasado de "think" O el sustantivo "pensamiento".\n\n"I thought about it."\n"That\'s a good thought."\n\n¡Nota que la pronunciación es MUY diferente de "through" y "though"!'
        },
        examples: ['I thought you knew.', 'What a great thought!', 'She thought it was funny.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: '"I walked ___ the park." (através de)', en: '"I walked ___ the park." (across)', es: '"I walked ___ the park." (a través de)' }, target: 'through', options: ['through', 'though', 'thought', 'tough'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Qual rima com "go"?', en: 'Which one rhymes with "go"?', es: '¿Cuál rima con "go"?' }, target: 'though', options: ['though', 'through', 'tough', 'thought'] },
      { id: 'q3', type: 'fill_choice', question: { pt: '"I ___ about it all day." (pensei)', en: '"I ___ about it all day." (past of think)', es: '"I ___ about it all day." (pensé)' }, target: 'thought', options: ['thought', 'though', 'through', 'tough'] },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Fale: "It was tough, though I got through it."', en: 'Say: "It was tough, though I got through it."', es: 'Di: "It was tough, though I got through it."' }, target: ['it was tough though i got through it'], instructions: { pt: 'Fale devagar, prestando atenção na diferença.', en: 'Say it slowly.', es: 'Di despacio.' } }
    ]
  }
];