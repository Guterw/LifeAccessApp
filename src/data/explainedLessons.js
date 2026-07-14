// src/data/explainedLessons.js
// Estrutura de uma "lição explicada": cada lição tem slides de teoria (theory)
// e depois um bloco de exercícios de fixação (exercises), reaproveitando os
// mesmos "types" já usados em numberExercises/alphabetExercises quando possível
// (listen_and_identify, voice_dictation) + um novo tipo "fill_choice" para
// múltipla escolha de gramática/sentido.

export const EXPLAINED_LESSONS = [
  {
    id: 'lesson_get',
    title: { pt: 'O verbo GET (todos os sentidos)', en: 'The verb GET (all meanings)', es: 'El verbo GET (todos los sentidos)' },
    icon: 'Sparkles',
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
      { id: 'q4', type: 'fill_choice', question: { pt: 'GET UP significa:', en: 'GET UP means:', es: 'GET UP significa:' }, target: 'Levantar da cama', options: ['Levantar da cama', 'Sair', 'Superar algo', 'Se dar bem'] },
      { id: 'q5', type: 'voice_dictation', question: { pt: 'Fale: "I get along with my sister."', en: 'Say: "I get along with my sister."', es: 'Di: "I get along with my sister."' }, target: ['i get along with my sister'], instructions: { pt: 'Fale a frase inteira devagar.', en: 'Say the whole sentence slowly.', es: 'Di la frase entera despacio.' } },
      { id: 'q6', type: 'fill_choice', question: { pt: '"She got over the breakup" significa:', en: '"She got over the breakup" means:', es: '"She got over the breakup" significa:' }, target: 'Ela superou o término', options: ['Ela superou o término', 'Ela terminou', 'Ela ficou triste', 'Ela voltou'] }
    ]
  },
// ==========================================
  // LIÇÃO: PAST TENSE (Regular e Irregular)
  // ==========================================
  {
    id: 'lesson_past_tense',
    title: { pt: 'Past Tense: Verbos Regulares e Irregulares', en: 'Past Tense: Regular and Irregular Verbs', es: 'Past Tense: Verbos Regulares e Irregulares' },
    icon: 'History',
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
        title: { pt: 'A pronúncia do -ED: /t/, /d/ ou /Id/', en: 'Pronouncing -ED: /t/, /d/ or /ɪd/', es: 'La pronunciación del -ED: /t/, /d/ o /ɪd/' },
        body: {
          pt: 'O "-ed" tem 3 sons diferentes, e isso é um dos maiores erros de pronúncia de brasileiros!\n\n1️⃣ Som de /t/ — quando o verbo termina em som SURDO (p, k, s, sh, ch, f): \n   walk → walked (uóktid ❌ / uókt ✅)\n\n2️⃣ Som de /d/ — quando termina em som SONORO (b, g, v, z, m, n, l, r, e vogais):\n   play → played (pléid)\n\n3️⃣ Som de /ɪd/ — APENAS quando o verbo termina em "t" ou "d":\n   want → wanted (uóntid)\n   need → needed (nídid)',
          en: 'The "-ed" ending has 3 different sounds, and this is one of the most common pronunciation mistakes!\n\n1️⃣ /t/ sound — when the verb ends in a VOICELESS sound (p, k, s, sh, ch, f):\n   walk → walked\n\n2️⃣ /d/ sound — when it ends in a VOICED sound (b, g, v, z, m, n, l, r, and vowels):\n   play → played\n\n3️⃣ /ɪd/ sound — ONLY when the verb ends in "t" or "d":\n   want → wanted\n   need → needed',
          es: 'La terminación "-ed" tiene 3 sonidos diferentes, ¡y este es uno de los errores más comunes!\n\n1️⃣ Sonido /t/ — cuando el verbo termina en sonido SORDO (p, k, s, sh, ch, f):\n   walk → walked\n\n2️⃣ Sonido /d/ — cuando termina en sonido SONORO (b, g, v, z, m, n, l, r, y vocales):\n   play → played\n\n3️⃣ Sonido /ɪd/ — SOLO cuando el verbo termina en "t" o "d":\n   want → wanted\n   need → needed'
        },
        examples: ['walked (uókt)', 'played (pléid)', 'wanted (uóntid)', 'needed (nídid)', 'watched (uótcht)']
      },
      {
        id: 'past_4',
        title: { pt: 'Verbos Irregulares: não seguem regra', en: 'Irregular Verbs: no fixed rule', es: 'Verbos Irregulares: sin regla fija' },
        body: {
          pt: 'Muitos dos verbos MAIS usados em inglês são irregulares — precisam ser decorados um por um.\n\ngo → went\nsee → saw\nhave → had\ndo → did\nmake → made\ntake → took\nget → got\nsay → said\nknow → knew\ncome → came\n\nNão existe atalho aqui: praticar bastante é o único caminho!',
          en: 'Many of the MOST used verbs in English are irregular — they need to be memorized one by one.\n\ngo → went\nsee → saw\nhave → had\ndo → did\nmake → made\ntake → took\nget → got\nsay → said\nknow → knew\ncome → came\n\nThere\'s no shortcut here: lots of practice is the only way!',
          es: 'Muchos de los verbos MÁS usados en inglés son irregulares — hay que memorizarlos uno por uno.\n\ngo → went\nsee → saw\nhave → had\ndo → did\nmake → made\ntake → took\nget → got\nsay → said\nknow → knew\ncome → came\n\n¡No hay atajo aquí: mucha práctica es el único camino!'
        },
        examples: ['I went to the shop.', 'She saw a bird.', 'We had breakfast.', 'He said hello.']
      },
      {
        id: 'past_5',
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
      { id: 'q3', type: 'fill_choice', question: { pt: '"Walked" tem som de -ed igual a:', en: '"Walked" has the same -ed sound as:', es: '"Walked" tiene el mismo sonido -ed que:' }, target: 'watched', options: ['watched', 'played', 'needed', 'lived'] },
      { id: 'q4', type: 'fill_choice', question: { pt: 'Complete: "I ___ to the shop yesterday." (go)', en: 'Complete: "I ___ to the shop yesterday." (go)', es: 'Completa: "I ___ to the shop yesterday." (go)' }, target: 'went', options: ['went', 'goed', 'go', 'gone'] },
      { id: 'q5', type: 'fill_choice', question: { pt: 'Negativa correta de "She worked":', en: 'Correct negative of "She worked":', es: 'Negativa correcta de "She worked":' }, target: 'She didn\'t work.', options: ['She didn\'t work.', 'She didn\'t worked.', 'She not worked.', 'She no worked.'] },
      { id: 'q6', type: 'fill_choice', question: { pt: '"Wanted" se pronuncia com o som:', en: '"Wanted" is pronounced with the sound:', es: '"Wanted" se pronuncia con el sonido:' }, target: '/ɪd/', options: ['/ɪd/', '/t/', '/d/', '/s/'] },
      { id: 'q7', type: 'voice_dictation', question: { pt: 'Fale: "I didn\'t see her yesterday."', en: 'Say: "I didn\'t see her yesterday."', es: 'Di: "I didn\'t see her yesterday."' }, target: ['i didnt see her yesterday', 'i didn\'t see her yesterday'], instructions: { pt: 'Fale a frase inteira devagar, prestando atenção no "didn\'t".', en: 'Say the whole sentence slowly, paying attention to "didn\'t".', es: 'Di la frase entera despacio, prestando atención a "didn\'t".' } },
      { id: 'q8', type: 'fill_choice', question: { pt: 'Pergunta correta no passado sobre "you call":', en: 'Correct past question about "you call":', es: 'Pregunta correcta en pasado sobre "you call":' }, target: 'Did you call?', options: ['Did you call?', 'Did you called?', 'You called?', 'Call you did?'] }
    ]
  },

  // ==========================================
  // LIÇÃO: WOULD / COULD / SHOULD
  // ==========================================
  {
    id: 'lesson_modals_ould',
    title: { pt: 'Would, Could e Should (os "OULD")', en: 'Would, Could and Should', es: 'Would, Could y Should' },
    icon: 'Wand2',
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
      { id: 'q3', type: 'fill_choice', question: { pt: 'Um conselho de saúde usaria:', en: 'Health advice would use:', es: 'Un consejo de salud usaría:' }, target: 'should', options: ['should', 'would', 'could', 'did'] },
      { id: 'q4', type: 'fill_choice', question: { pt: '"I\'d like a coffee" significa:', en: '"I\'d like a coffee" means:', es: '"I\'d like a coffee" significa:' }, target: 'I would like', options: ['I would like', 'I had like', 'I did like', 'I will like'] },
      { id: 'q5', type: 'fill_choice', question: { pt: 'Pedido educado e formal para passar o sal:', en: 'Polite formal request to pass the salt:', es: 'Pedido educado y formal para pasar la sal:' }, target: 'Could you pass the salt?', options: ['Could you pass the salt?', 'You pass salt?', 'Pass me salt now.', 'Should you pass salt?'] },
      { id: 'q6', type: 'fill_choice', question: { pt: '"I\'d better go now" indica:', en: '"I\'d better go now" indicates:', es: '"I\'d better go now" indica:' }, target: 'Um aviso urgente', options: ['Um aviso urgente', 'Uma pergunta', 'Uma habilidade passada', 'Uma hipótese distante'] },
      { id: 'q7', type: 'voice_dictation', question: { pt: 'Fale: "You should drink more water."', en: 'Say: "You should drink more water."', es: 'Di: "You should drink more water."' }, target: ['you should drink more water'], instructions: { pt: 'Fale a frase devagar e claramente.', en: 'Say the sentence slowly and clearly.', es: 'Di la frase despacio y claramente.' } },
      { id: 'q8', type: 'fill_choice', question: { pt: 'Negativa de "should" (não deveria):', en: 'Negative of "should" (shouldn\'t):', es: 'Negativa de "should" (no debería):' }, target: 'shouldn\'t', options: ['shouldn\'t', 'not should', 'don\'t should', 'no should'] }
    ]
  },

  // ==========================================
  // LIÇÃO: PARTÍCULAS UP e ON
  // ==========================================
  {
    id: 'lesson_particles_up_on',
    title: { pt: 'UP e ON: sozinhos vs. em Phrasal Verbs', en: 'UP and ON: alone vs. in Phrasal Verbs', es: 'UP y ON: solos vs. en Phrasal Verbs' },
    icon: 'ArrowUpRight',
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
      },
      {
        id: 'updon_4',
        title: { pt: 'Mesmo verbo, partícula diferente = sentido diferente', en: 'Same verb, different particle = different meaning', es: 'Mismo verbo, partícula diferente = sentido diferente' },
        body: {
          pt: 'Um mesmo verbo pode formar phrasal verbs BEM diferentes dependendo da partícula:\n\nGET UP = levantar da cama\nGET ON = entrar/embarcar, ou se dar bem com alguém\nGET OVER = superar\nGET OUT = sair\n\nPor isso não adianta decorar só o verbo — o phrasal verb inteiro (verbo + partícula) é uma palavra nova, com som e sentido próprios.',
          en: 'The same verb can form VERY different phrasal verbs depending on the particle:\n\nGET UP = to rise from bed\nGET ON = to board, or to have a good relationship\nGET OVER = to overcome\nGET OUT = to leave\n\nThat\'s why memorizing just the verb isn\'t enough — the whole phrasal verb (verb + particle) is a new word, with its own sound and meaning.',
          es: 'Un mismo verbo puede formar phrasal verbs MUY diferentes según la partícula:\n\nGET UP = levantarse de la cama\nGET ON = subir, o llevarse bien\nGET OVER = superar\nGET OUT = salir\n\nPor eso no basta memorizar solo el verbo — el phrasal verb entero es una palabra nueva.'
        },
        examples: ['I get up at 6am.', 'We get on well.', 'She got over it.', 'Get out now!']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: '"Look up the word" significa:', en: '"Look up the word" means:', es: '"Look up the word" significa:' }, target: 'Pesquisar a palavra', options: ['Pesquisar a palavra', 'Olhar para cima', 'Gritar a palavra', 'Esquecer a palavra'] },
      { id: 'q2', type: 'fill_choice', question: { pt: '"Wake up" significa:', en: '"Wake up" means:', es: '"Wake up" significa:' }, target: 'Acordar', options: ['Acordar', 'Dormir', 'Levantar peso', 'Cansar'] },
      { id: 'q3', type: 'fill_choice', question: { pt: 'Complete: "Please turn ___ the lights." (ligar)', en: 'Complete: "Please turn ___ the lights." (switch on)', es: 'Completa: "Please turn ___ the lights." (encender)' }, target: 'on', options: ['on', 'up', 'over', 'out'] },
      { id: 'q4', type: 'fill_choice', question: { pt: '"Give up" significa:', en: '"Give up" means:', es: '"Give up" significa:' }, target: 'Desistir', options: ['Desistir', 'Dar um presente', 'Levantar', 'Continuar'] },
      { id: 'q5', type: 'fill_choice', question: { pt: '"Hold on a second" significa:', en: '"Hold on a second" means:', es: '"Hold on a second" significa:' }, target: 'Espere um momento', options: ['Espere um momento', 'Segure firme para sempre', 'Vá embora', 'Ligue o aparelho'] },
      { id: 'q6', type: 'fill_choice', question: { pt: '"We get on well" significa:', en: '"We get on well" means:', es: '"We get on well" significa:' }, target: 'Nós nos damos bem', options: ['Nós nos damos bem', 'Nós subimos rápido', 'Nós saímos bem', 'Nós vestimos roupa'] },
      { id: 'q7', type: 'voice_dictation', question: { pt: 'Fale: "I woke up and picked up my phone."', en: 'Say: "I woke up and picked up my phone."', es: 'Di: "I woke up and picked up my phone."' }, target: ['i woke up and picked up my phone'], instructions: { pt: 'Fale a frase inteira, com atenção aos dois "up".', en: 'Say the whole sentence, paying attention to both "up"s.', es: 'Di la frase entera, prestando atención a los dos "up".' } },
      { id: 'q8', type: 'fill_choice', question: { pt: '"Put on your jacket" significa:', en: '"Put on your jacket" means:', es: '"Put on your jacket" significa:' }, target: 'Vista seu casaco', options: ['Vista seu casaco', 'Jogue fora seu casaco', 'Compre um casaco', 'Lave o casaco'] }
    ]
  },

  // ==========================================
  // LIÇÃO: THROUGH / THOUGH / THOUGHT / THROUGHOUT / TOUGH
  // ==========================================
  {
    id: 'lesson_through_though',
    title: { pt: 'Through, Though, Thought, Throughout e Tough', en: 'Through, Though, Thought, Throughout and Tough', es: 'Through, Though, Thought, Throughout y Tough' },
    icon: 'AlertOctagon',
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
      },
      {
        id: 'thru_5',
        title: { pt: 'THROUGHOUT e TOUGH', en: 'THROUGHOUT and TOUGH', es: 'THROUGHOUT y TOUGH' },
        body: {
          pt: 'THROUGHOUT (pronuncia: "thru-áut") = "durante todo / por toda parte de" — é "through" + intensidade de tempo/espaço todo.\n"They talked throughout the movie." (Eles conversaram durante o filme todo.)\n\nTOUGH (pronuncia: "tâf", rima com "stuff") = "difícil" ou "resistente" — nada a ver com os outros!\n"This exam is tough." (Essa prova é difícil.)\n"He\'s a tough guy." (Ele é um cara durão.)',
          en: 'THROUGHOUT (pronounced "thru-out") = "during the whole / all over" — it\'s "through" + full time/space intensity.\n"They talked throughout the movie."\n\nTOUGH (pronounced "tuff", rhymes with "stuff") = "difficult" or "resistant" — nothing to do with the others!\n"This exam is tough."\n"He\'s a tough guy."',
          es: 'THROUGHOUT (se pronuncia "thru-aut") = "durante todo / por toda parte" — es "through" + intensidad de tiempo/espacio.\n"They talked throughout the movie."\n\nTOUGH (se pronuncia "taf", rima con "stuff") = "difícil" o "resistente" — ¡nada que ver con los otros!\n"This exam is tough."\n"He\'s a tough guy."'
        },
        examples: ['It rained throughout the day.', 'This meat is tough.', 'Learning a language is tough sometimes.']
      }
    ],
    exercises: [
      { id: 'q1', type: 'fill_choice', question: { pt: '"I walked ___ the park." (através de)', en: '"I walked ___ the park." (across)', es: '"I walked ___ the park." (a través de)' }, target: 'through', options: ['through', 'though', 'thought', 'tough'] },
      { id: 'q2', type: 'fill_choice', question: { pt: 'Qual rima com "go"?', en: 'Which one rhymes with "go"?', es: '¿Cuál rima con "go"?' }, target: 'though', options: ['though', 'through', 'tough', 'thought'] },
      { id: 'q3', type: 'fill_choice', question: { pt: '"I ___ about it all day." (pensei)', en: '"I ___ about it all day." (past of think)', es: '"I ___ about it all day." (pensé)' }, target: 'thought', options: ['thought', 'though', 'through', 'tough'] },
      { id: 'q4', type: 'fill_choice', question: { pt: '"This exam is really ___." (difícil)', en: '"This exam is really ___." (difficult)', es: '"This exam is really ___." (difícil)' }, target: 'tough', options: ['tough', 'though', 'thought', 'throughout'] },
      { id: 'q5', type: 'fill_choice', question: { pt: '"They talked ___ the whole movie." (durante todo)', en: '"They talked ___ the whole movie." (during all of)', es: '"They talked ___ the whole movie." (durante todo)' }, target: 'throughout', options: ['throughout', 'through', 'though', 'thought'] },
      { id: 'q6', type: 'fill_choice', question: { pt: 'Qual dessas palavras significa "mas/apesar disso" e geralmente vai no fim da frase?', en: 'Which of these words means "but/nevertheless" and usually goes at the end?', es: '¿Cuál de estas palabras significa "pero/sin embargo" y suele ir al final?' }, target: 'though', options: ['though', 'through', 'thought', 'tough'] },
      { id: 'q7', type: 'voice_dictation', question: { pt: 'Fale: "It was tough, though I got through it."', en: 'Say: "It was tough, though I got through it."', es: 'Di: "It was tough, though I got through it."' }, target: ['it was tough though i got through it'], instructions: { pt: 'Fale devagar, prestando atenção na diferença entre "tough" e "through".', en: 'Say it slowly, paying attention to the difference between "tough" and "through".', es: 'Di despacio, prestando atención a la diferencia entre "tough" y "through".' } },
      { id: 'q8', type: 'fill_choice', question: { pt: '"That\'s a good ___." (pensamento/ideia)', en: '"That\'s a good ___." (idea/thought)', es: '"That\'s a good ___." (idea/pensamiento)' }, target: 'thought', options: ['thought', 'though', 'through', 'tough'] }
    ]
  },
  // ==========================================
  // NOVAS LIÇÕES BÁSICAS (FUNDAÇÃO TOTAL)
  // ==========================================
  {
    id: 'lesson_pronouns',
    title: { pt: 'Quem é quem? (Os Pronomes)', en: 'Who is who? (Pronouns)', es: '¿Quién es quién? (Pronombres)' },
    icon: 'Users',
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
    id: 'lesson_this_that',
    title: { pt: 'Apontando o Dedo (This, That...)', en: 'Pointing Fingers (This, That...)', es: 'Señalando (This, That...)' },
    icon: 'Hand',
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
    id: 'lesson_do_make',
    title: { pt: 'Fazer vs Fabricar (Do / Make)', en: 'Do vs Make', es: 'Hacer vs Fabricar (Do / Make)' },
    icon: 'Hammer',
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
    id: 'lesson_simple_present',
    title: { pt: 'A Regra do S (Presente)', en: 'The S Rule (Present)', es: 'La Regla de la S (Presente)' },
    icon: 'Sun',
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
];