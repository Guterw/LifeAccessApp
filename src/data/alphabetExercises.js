// src/data/alphabetExercises.js

export const ALPHABET_EXERCISES = [
  {
    id: 'alpha_level_1',
    title: { pt: 'Vogais e Primeiras Letras (A ao E)', en: 'Vowels and First Letters (A to E)', es: 'Vocales y Primeras Letras (A a la E)' },
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: { pt: 'Qual destas letras tem o som de "ei"?', en: 'Which of these letters sounds like "ei"?', es: '¿Cuál de estas letras suena como "ei"?' }, target: 'A', options: ['E', 'I', 'A', 'Y'], audio_hint: 'A' },
      { id: 'q2', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: A', en: 'Pronounce the letter: A', es: 'Pronuncia la letra: A' }, target: ['A', 'a'], instructions: { pt: 'Fale "ei" no microfone.', en: 'Say "ei" into the microphone.', es: 'Di "ei" en el micrófono.' } },
      { id: 'q3', type: 'listen_and_identify', question: { pt: 'Qual letra você ouviu?', en: 'Which letter did you hear?', es: '¿Qué letra escuchaste?' }, target: 'B', options: ['P', 'B', 'V', 'D'], audio_hint: 'B' },
      { id: 'q4', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: B', en: 'Pronounce the letter: B', es: 'Pronuncia la letra: B' }, target: ['B', 'b'], instructions: { pt: 'Fale "bi" no microfone.', en: 'Say "bi" into the microphone.', es: 'Di "bi" en el micrófono.' } },
      { id: 'q5', type: 'phonetic_match', question: { pt: 'A letra "C" tem o som de:', en: 'The letter "C" sounds like:', es: 'La letra "C" suena como:' }, target: 'si', options: ['ci', 'si', 'kei', 'qui'] },
      { id: 'q6', type: 'listen_and_identify', question: { pt: 'Ouça e selecione:', en: 'Listen and select:', es: 'Escucha y selecciona:' }, target: 'C', options: ['S', 'C', 'Z', 'X'], audio_hint: 'C' },
      { id: 'q7', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: D', en: 'Pronounce the letter: D', es: 'Pronuncia la letra: D' }, target: ['D', 'd'], instructions: { pt: 'Fale "di" no microfone.', en: 'Say "di" into the microphone.', es: 'Di "di" en el micrófono.' } },
      { id: 'q8', type: 'listen_and_identify', question: { pt: 'Qual destas letras você ouviu?', en: 'Which of these letters did you hear?', es: '¿Cuál de estas letras escuchaste?' }, target: 'E', options: ['A', 'I', 'E', 'Y'], audio_hint: 'E' },
      { id: 'q9', type: 'phonetic_match', question: { pt: 'Atenção! A letra "E" em inglês tem o som de:', en: 'Attention! The letter "E" in English sounds like:', es: '¡Atención! La letra "E" en inglés suena como:' }, target: 'i', options: ['e', 'i', 'ai', 'ou'] },
      { id: 'q10', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: E', en: 'Pronounce the letter: E', es: 'Pronuncia la letra: E' }, target: ['E', 'e'], instructions: { pt: 'Lembre-se, fale "i" no microfone!', en: 'Remember, say "i" into the microphone!', es: '¡Recuerda, di "i" en el micrófono!' } }
    ]
  },
  {
    id: 'alpha_level_2',
    title: { pt: 'Consoantes Confusas (F ao J)', en: 'Confusing Consonants (F to J)', es: 'Consonantes Confusas (F a la J)' },
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: { pt: 'Ouça e selecione:', en: 'Listen and select:', es: 'Escucha y selecciona:' }, target: 'F', options: ['F', 'S', 'X', 'H'], audio_hint: 'F' },
      { id: 'q2', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: F', en: 'Pronounce the letter: F', es: 'Pronuncia la letra: F' }, target: ['F', 'f'], instructions: { pt: 'Fale "ef".', en: 'Say "ef".', es: 'Di "ef".' } },
      { id: 'q3', type: 'listen_and_identify', question: { pt: 'Qual destas letras tem o som de "dji"?', en: 'Which of these letters sounds like "dji"?', es: '¿Cuál de estas letras suena como "dji"?' }, target: 'G', options: ['G', 'J', 'D', 'K'], audio_hint: 'G' },
      { id: 'q4', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: G', en: 'Pronounce the letter: G', es: 'Pronuncia la letra: G' }, target: ['G', 'g'], instructions: { pt: 'Fale "dji".', en: 'Say "dji".', es: 'Di "dji".' } },
      { id: 'q5', type: 'phonetic_match', question: { pt: 'Qual letra soa como "eitch"?', en: 'Which letter sounds like "eitch"?', es: '¿Qué letra suena como "eitch"?' }, target: 'H', options: ['H', 'A', '8', 'R'] },
      { id: 'q6', type: 'listen_and_identify', question: { pt: 'Ouça com atenção:', en: 'Listen carefully:', es: 'Escucha con atención:' }, target: 'H', options: ['A', 'H', 'R', 'E'], audio_hint: 'H' },
      { id: 'q7', type: 'listen_and_identify', question: { pt: 'Qual letra tem o som de "ai"?', en: 'Which letter sounds like "ai"?', es: '¿Qué letra suena como "ai"?' }, target: 'I', options: ['E', 'A', 'I', 'Y'], audio_hint: 'I' },
      { id: 'q8', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: I', en: 'Pronounce the letter: I', es: 'Pronuncia la letra: I' }, target: ['I', 'i'], instructions: { pt: 'Fale "ai". Igual quando machuca!', en: 'Say "ai". Like when it hurts!', es: 'Di "ai". ¡Como cuando te duele!' } },
      { id: 'q9', type: 'listen_and_identify', question: { pt: 'Agora, qual tem o som de "djei"?', en: 'Now, which one sounds like "djei"?', es: 'Ahora, ¿cuál suena como "djei"?' }, target: 'J', options: ['G', 'J', 'Y', 'A'], audio_hint: 'J' },
      { id: 'q10', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: J', en: 'Pronounce the letter: J', es: 'Pronuncia la letra: J' }, target: ['J', 'j'], instructions: { pt: 'Fale "djei".', en: 'Say "djei".', es: 'Di "djei".' } }
    ]
  },
  {
    id: 'alpha_level_3',
    title: { pt: 'O Meio do Alfabeto (K ao R)', en: 'The Middle of the Alphabet (K to R)', es: 'El Medio del Alfabeto (K a la R)' },
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: { pt: 'Selecione a letra ouvida:', en: 'Select the heard letter:', es: 'Selecciona la letra escuchada:' }, target: 'K', options: ['C', 'K', 'Q', 'T'], audio_hint: 'K' },
      { id: 'q2', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: K', en: 'Pronounce the letter: K', es: 'Pronuncia la letra: K' }, target: ['K', 'k'], instructions: { pt: 'Fale "kei".', en: 'Say "kei".', es: 'Di "kei".' } },
      { id: 'q3', type: 'listen_and_identify', question: { pt: 'Ouça e marque:', en: 'Listen and mark:', es: 'Escucha y marca:' }, target: 'L', options: ['L', 'M', 'N', 'R'], audio_hint: 'L' },
      { id: 'q4', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: M', en: 'Pronounce the letter: M', es: 'Pronuncia la letra: M' }, target: ['M', 'm'], instructions: { pt: 'Feche os lábios no final: "em".', en: 'Close your lips at the end: "em".', es: 'Cierra los labios al final: "em".' } },
      { id: 'q5', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: N', en: 'Pronounce the letter: N', es: 'Pronuncia la letra: N' }, target: ['N', 'n'], instructions: { pt: 'A língua vai no céu da boca: "en".', en: 'The tongue goes to the roof of the mouth: "en".', es: 'La lengua va al paladar: "en".' } },
      { id: 'q6', type: 'listen_and_identify', question: { pt: 'Qual destas você ouviu?', en: 'Which of these did you hear?', es: '¿Cuál de estas escuchaste?' }, target: 'O', options: ['A', 'U', 'O', 'E'], audio_hint: 'O' },
      { id: 'q7', type: 'phonetic_match', question: { pt: 'A letra "O" soa como:', en: 'The letter "O" sounds like:', es: 'La letra "O" suena como:' }, target: 'ou', options: ['ó', 'u', 'ou', 'au'] },
      { id: 'q8', type: 'listen_and_identify', question: { pt: 'Selecione:', en: 'Select:', es: 'Selecciona:' }, target: 'P', options: ['B', 'P', 'T', 'D'], audio_hint: 'P' },
      { id: 'q9', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: Q', en: 'Pronounce the letter: Q', es: 'Pronuncia la letra: Q' }, target: ['Q', 'q'], instructions: { pt: 'Fale "kiu".', en: 'Say "kiu".', es: 'Di "kiu".' } },
      { id: 'q10', type: 'listen_and_identify', question: { pt: 'Ouça com atenção:', en: 'Listen carefully:', es: 'Escucha con atención:' }, target: 'R', options: ['R', 'H', 'A', 'I'], audio_hint: 'R' }
    ]
  },
  {
    id: 'alpha_level_4',
    title: { pt: 'A Reta Final (S ao Z)', en: 'The Final Stretch (S to Z)', es: 'La Recta Final (S a la Z)' },
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: { pt: 'Selecione:', en: 'Select:', es: 'Selecciona:' }, target: 'S', options: ['C', 'S', 'Z', 'X'], audio_hint: 'S' },
      { id: 'q2', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: T', en: 'Pronounce the letter: T', es: 'Pronuncia la letra: T' }, target: ['T', 't'], instructions: { pt: 'Fale "ti".', en: 'Say "ti".', es: 'Di "ti".' } },
      { id: 'q3', type: 'listen_and_identify', question: { pt: 'Qual letra tem o som de "iu"?', en: 'Which letter sounds like "iu"?', es: '¿Qué letra suena como "iu"?' }, target: 'U', options: ['I', 'E', 'O', 'U'], audio_hint: 'U' },
      { id: 'q4', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: V', en: 'Pronounce the letter: V', es: 'Pronuncia la letra: V' }, target: ['V', 'v'], instructions: { pt: 'Fale "vi".', en: 'Say "vi".', es: 'Di "vi".' } },
      { id: 'q5', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: W', en: 'Pronounce the letter: W', es: 'Pronuncia la letra: W' }, target: ['W', 'w', 'double u'], instructions: { pt: 'Fale "dâbliu".', en: 'Say "dâbliu".', es: 'Di "dâbliu".' } },
      { id: 'q6', type: 'listen_and_identify', question: { pt: 'Ouça e selecione:', en: 'Listen and select:', es: 'Escucha y selecciona:' }, target: 'X', options: ['S', 'Z', 'X', 'C'], audio_hint: 'X' },
      { id: 'q7', type: 'listen_and_identify', question: { pt: 'Qual destas letras tem o som de "uai"?', en: 'Which of these letters sounds like "uai"?', es: '¿Cuál de estas letras suena como "uai"?' }, target: 'Y', options: ['I', 'Y', 'W', 'U'], audio_hint: 'Y' },
      { id: 'q8', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: Y', en: 'Pronounce the letter: Y', es: 'Pronuncia la letra: Y' }, target: ['Y', 'y'], instructions: { pt: 'Fale "uai" (igual em Minas Gerais!).', en: 'Say "uai".', es: 'Di "uai".' } },
      { id: 'q9', type: 'listen_and_identify', question: { pt: 'Ouça a última letra:', en: 'Listen to the last letter:', es: 'Escucha la última letra:' }, target: 'Z', options: ['Z', 'S', 'C', 'X'], audio_hint: 'Z' },
      { id: 'q10', type: 'voice_repetition', question: { pt: 'Pronuncie a letra: Z', en: 'Pronounce the letter: Z', es: 'Pronuncia la letra: Z' }, target: ['Z', 'z'], instructions: { pt: 'Você pode falar "zi" (EUA) ou "zed" (UK/Irlanda).', en: 'You can say "zi" (US) or "zed" (UK/Ireland).', es: 'Puedes decir "zi" (EE.UU.) o "zed" (Reino Unido/Irlanda).' } }
    ]
  },
  {
    id: 'alpha_level_5',
    title: { pt: 'Spelling Bee: Iniciante', en: 'Spelling Bee: Beginner', es: 'Concurso de Deletreo: Principiante' },
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: { pt: 'Ouça a soletração e marque:', en: 'Listen to the spelling and select:', es: 'Escucha el deletreo y marca:' }, target: 'APPLE', options: ['APPLE', 'APPLY', 'AMPLE', 'MAPLE'], audio_hint: 'A. P. P. L. E.' },
      { id: 'q2', type: 'voice_dictation', question: { pt: 'Soletre: WATER', en: 'Spell: WATER', es: 'Deletrea: WATER' }, target: ['water', 'w a t e r'], instructions: { pt: 'Diga: W - A - T - E - R', en: 'Say: W - A - T - E - R', es: 'Di: W - A - T - E - R' } },
      { id: 'q3', type: 'listen_and_identify', question: { pt: 'Qual a palavra?', en: 'Which word?', es: '¿Qué palabra es?' }, target: 'BOOK', options: ['BACK', 'BOOK', 'BOOT', 'LOOK'], audio_hint: 'B. O. O. K.' },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Soletre: HOUSE', en: 'Spell: HOUSE', es: 'Deletrea: HOUSE' }, target: ['house', 'h o u s e'], instructions: { pt: 'Diga: H - O - U - S - E', en: 'Say: H - O - U - S - E', es: 'Di: H - O - U - S - E' } },
      { id: 'q5', type: 'listen_and_identify', question: { pt: 'Identifique:', en: 'Identify:', es: 'Identifica:' }, target: 'MILK', options: ['MILD', 'MILE', 'MILK', 'SILK'], audio_hint: 'M. I. L. K.' },
      { id: 'q6', type: 'voice_dictation', question: { pt: 'Soletre: NIGHT', en: 'Spell: NIGHT', es: 'Deletrea: NIGHT' }, target: ['night', 'n i g h t'], instructions: { pt: 'Diga: N - I - G - H - T', en: 'Say: N - I - G - H - T', es: 'Di: N - I - G - H - T' } },
      { id: 'q7', type: 'listen_and_identify', question: { pt: 'Qual a palavra?', en: 'Which word?', es: '¿Qué palabra es?' }, target: 'BREAD', options: ['BREAD', 'BROAD', 'BRAIN', 'BEARD'], audio_hint: 'B. R. E. A. D.' },
      { id: 'q8', type: 'voice_dictation', question: { pt: 'Soletre: MONEY', en: 'Spell: MONEY', es: 'Deletrea: MONEY' }, target: ['money', 'm o n e y'], instructions: { pt: 'Diga: M - O - N - E - Y', en: 'Say: M - O - N - E - Y', es: 'Di: M - O - N - E - Y' } },
      { id: 'q9', type: 'listen_and_identify', question: { pt: 'Identifique:', en: 'Identify:', es: 'Identifica:' }, target: 'PINT', options: ['PINT', 'POINT', 'PAINT', 'PINK'], audio_hint: 'P. I. N. T.' },
      { id: 'q10', type: 'voice_dictation', question: { pt: 'Soletre: TICKET', en: 'Spell: TICKET', es: 'Deletrea: TICKET' }, target: ['ticket', 't i c k e t'], instructions: { pt: 'Diga: T - I - C - K - E - T', en: 'Say: T - I - C - K - E - T', es: 'Di: T - I - C - K - E - T' } }
    ]
  },
  {
    id: 'alpha_level_6',
    title: { pt: 'Spelling Bee: Intermediário', en: 'Spelling Bee: Intermediate', es: 'Concurso de Deletreo: Intermedio' },
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: { pt: 'Ouça:', en: 'Listen:', es: 'Escucha:' }, target: 'FLIGHT', options: ['FLIGHT', 'FIGHT', 'LIGHT', 'FRIGHT'], audio_hint: 'F. L. I. G. H. T.' },
      { id: 'q2', type: 'voice_dictation', question: { pt: 'Soletre: YELLOW', en: 'Spell: YELLOW', es: 'Deletrea: YELLOW' }, target: ['yellow', 'y e l l o w'], instructions: { pt: 'Y - E - L - L - O - W', en: 'Y - E - L - L - O - W', es: 'Y - E - L - L - O - W' } },
      { id: 'q3', type: 'listen_and_identify', question: { pt: 'Qual a palavra?', en: 'Which word?', es: '¿Qué palabra?' }, target: 'BROTHER', options: ['BREATHER', 'BROTHER', 'BOTHER', 'BRIGHTER'], audio_hint: 'B. R. O. T. H. E. R.' },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Soletre: TROLLEY', en: 'Spell: TROLLEY', es: 'Deletrea: TROLLEY' }, target: ['trolley', 't r o l l e y'], instructions: { pt: 'T - R - O - L - L - E - Y', en: 'T - R - O - L - L - E - Y', es: 'T - R - O - L - L - E - Y' } },
      { id: 'q5', type: 'listen_and_identify', question: { pt: 'Identifique:', en: 'Identify:', es: 'Identifica:' }, target: 'KITCHEN', options: ['KITCHEN', 'CHICKEN', 'KITTEN', 'PITCHER'], audio_hint: 'K. I. T. C. H. E. N.' },
      { id: 'q6', type: 'voice_dictation', question: { pt: 'Soletre: BARISTA', en: 'Spell: BARISTA', es: 'Deletrea: BARISTA' }, target: ['barista', 'b a r i s t a'], instructions: { pt: 'B - A - R - I - S - T - A', en: 'B - A - R - I - S - T - A', es: 'B - A - R - I - S - T - A' } },
      { id: 'q7', type: 'listen_and_identify', question: { pt: 'Qual a palavra?', en: 'Which word?', es: '¿Qué palabra?' }, target: 'MANAGER', options: ['MANAGE', 'MANAGER', 'MANGER', 'MANUAL'], audio_hint: 'M. A. N. A. G. E. R.' },
      { id: 'q8', type: 'voice_dictation', question: { pt: 'Soletre: MORNING', en: 'Spell: MORNING', es: 'Deletrea: MORNING' }, target: ['morning', 'm o r n i n g'], instructions: { pt: 'M - O - R - N - I - N - G', en: 'M - O - R - N - I - N - G', es: 'M - O - R - N - I - N - G' } },
      { id: 'q9', type: 'listen_and_identify', question: { pt: 'Ouça:', en: 'Listen:', es: 'Escucha:' }, target: 'WEEKEND', options: ['WEEKDAY', 'WEEKEND', 'WEAKEN', 'WEAKNESS'], audio_hint: 'W. E. E. K. E. N. D.' },
      { id: 'q10', type: 'voice_dictation', question: { pt: 'Soletre: COFFEE', en: 'Spell: COFFEE', es: 'Deletrea: COFFEE' }, target: ['coffee', 'c o f f e e'], instructions: { pt: 'C - O - F - F - E - E', en: 'C - O - F - F - E - E', es: 'C - O - F - F - E - E' } }
    ]
  },
  {
    id: 'alpha_level_7',
    title: { pt: 'Spelling Bee: Avançado', en: 'Spelling Bee: Advanced', es: 'Concurso de Deletreo: Avanzado' },
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: { pt: 'Ouça e marque:', en: 'Listen and mark:', es: 'Escucha y marca:' }, target: 'RESTAURANT', options: ['RESTAURANT', 'RESTART', 'RESTRAINT', 'RESTAURATE'], audio_hint: 'R. E. S. T. A. U. R. A. N. T.' },
      { id: 'q2', type: 'voice_dictation', question: { pt: 'Soletre: PASSPORT', en: 'Spell: PASSPORT', es: 'Deletrea: PASSPORT' }, target: ['passport', 'p a s s p o r t'], instructions: { pt: 'P - A - S - S - P - O - R - T', en: 'P - A - S - S - P - O - R - T', es: 'P - A - S - S - P - O - R - T' } },
      { id: 'q3', type: 'listen_and_identify', question: { pt: 'Qual a palavra?', en: 'Which word?', es: '¿Qué palabra es?' }, target: 'BEAUTIFUL', options: ['BEAUTY', 'BEAUTIFUL', 'BOUNTIFUL', 'DUTIFUL'], audio_hint: 'B. E. A. U. T. I. F. U. L.' },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Soletre: UMBRELLA', en: 'Spell: UMBRELLA', es: 'Deletrea: UMBRELLA' }, target: ['umbrella', 'u m b r e l l a'], instructions: { pt: 'U - M - B - R - E - L - L - A', en: 'U - M - B - R - E - L - L - A', es: 'U - M - B - R - E - L - L - A' } },
      { id: 'q5', type: 'listen_and_identify', question: { pt: 'Identifique:', en: 'Identify:', es: 'Identifica:' }, target: 'YESTERDAY', options: ['YESTERDAY', 'EVERYDAY', 'TODAY', 'SOMEDAY'], audio_hint: 'Y. E. S. T. E. R. D. A. Y.' },
      { id: 'q6', type: 'voice_dictation', question: { pt: 'Soletre: CHOCOLATE', en: 'Spell: CHOCOLATE', es: 'Deletrea: CHOCOLATE' }, target: ['chocolate', 'c h o c o l a t e'], instructions: { pt: 'C - H - O - C - O - L - A - T - E', en: 'C - H - O - C - O - L - A - T - E', es: 'C - H - O - C - O - L - A - T - E' } },
      { id: 'q7', type: 'listen_and_identify', question: { pt: 'Qual a palavra?', en: 'Which word?', es: '¿Qué palabra?' }, target: 'BREAKFAST', options: ['BREAKFAST', 'BREAKOUT', 'FASTING', 'BASKET'], audio_hint: 'B. R. E. A. K. F. A. S. T.' },
      { id: 'q8', type: 'voice_dictation', question: { pt: 'Soletre: APARTMENT', en: 'Spell: APARTMENT', es: 'Deletrea: APARTMENT' }, target: ['apartment', 'a p a r t m e n t'], instructions: { pt: 'A - P - A - R - T - M - E - N - T', en: 'A - P - A - R - T - M - E - N - T', es: 'A - P - A - R - T - M - E - N - T' } },
      { id: 'q9', type: 'listen_and_identify', question: { pt: 'Identifique:', en: 'Identify:', es: 'Identifica:' }, target: 'KNOWLEDGE', options: ['KNOWLEDGE', 'COLLEGE', 'ACKNOWLEDGE', 'KNOWING'], audio_hint: 'K. N. O. W. L. E. D. G. E.' },
      { id: 'q10', type: 'voice_dictation', question: { pt: 'Soletre: IRELAND', en: 'Spell: IRELAND', es: 'Deletrea: IRELAND' }, target: ['ireland', 'i r e l a n d'], instructions: { pt: 'I - R - E - L - A - N - D', en: 'I - R - E - L - A - N - D', es: 'I - R - E - L - A - N - D' } }
    ]
  },
  {
    id: 'alpha_level_8',
    title: { pt: 'Spelling Bee: Master', en: 'Spelling Bee: Master', es: 'Concurso de Deletreo: Maestro' },
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: { pt: 'Ouça o super desafio:', en: 'Listen to the super challenge:', es: 'Escucha el súper desafío:' }, target: 'CONGRATULATIONS', options: ['CONGRATULATIONS', 'CONGREGATION', 'CONSTIPATION', 'CONSTELLATION'], audio_hint: 'C. O. N. G. R. A. T. U. L. A. T. I. O. N. S.' },
      { id: 'q2', type: 'voice_dictation', question: { pt: 'Soletre: TEMPERATURE', en: 'Spell: TEMPERATURE', es: 'Deletrea: TEMPERATURE' }, target: ['temperature', 't e m p e r a t u r e'], instructions: { pt: 'T - E - M - P - E - R - A - T - U - R - E', en: 'T - E - M - P - E - R - A - T - U - R - E', es: 'T - E - M - P - E - R - A - T - U - R - E' } },
      { id: 'q3', type: 'listen_and_identify', question: { pt: 'Qual a palavra?', en: 'Which word?', es: '¿Qué palabra?' }, target: 'ENVIRONMENT', options: ['ENTERTAINMENT', 'ENVIRONMENT', 'ENLIGHTENMENT', 'GOVERNMENT'], audio_hint: 'E. N. V. I. R. O. N. M. E. N. T.' },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Soletre: PRONUNCIATION', en: 'Spell: PRONUNCIATION', es: 'Deletrea: PRONUNCIATION' }, target: ['pronunciation', 'p r o n u n c i a t i o n'], instructions: { pt: 'P - R - O - N - U - N - C - I - A - T - I - O - N', en: 'P - R - O - N - U - N - C - I - A - T - I - O - N', es: 'P - R - O - N - U - N - C - I - A - T - I - O - N' } },
      { id: 'q5', type: 'listen_and_identify', question: { pt: 'Identifique:', en: 'Identify:', es: 'Identifica:' }, target: 'DESTINATION', options: ['DESIGNATION', 'DESTINATION', 'DECLARATION', 'FASCINATION'], audio_hint: 'D. E. S. T. I. N. A. T. I. O. N.' },
      { id: 'q6', type: 'voice_dictation', question: { pt: 'Soletre: INDEPENDENT', en: 'Spell: INDEPENDENT', es: 'Deletrea: INDEPENDENT' }, target: ['independent', 'i n d e p e n d e n t'], instructions: { pt: 'I - N - D - E - P - E - N - D - E - N - T', en: 'I - N - D - E - P - E - N - D - E - N - T', es: 'I - N - D - E - P - E - N - D - E - N - T' } },
      { id: 'q7', type: 'listen_and_identify', question: { pt: 'Qual a palavra?', en: 'Which word?', es: '¿Qué palabra?' }, target: 'UNIVERSITY', options: ['UNIVERSE', 'UNIVERSITY', 'DIVERSITY', 'ADVERSITY'], audio_hint: 'U. N. I. V. E. R. S. I. T. Y.' },
      { id: 'q8', type: 'voice_dictation', question: { pt: 'Soletre: APPRECIATE', en: 'Spell: APPRECIATE', es: 'Deletrea: APPRECIATE' }, target: ['appreciate', 'a p p r e c i a t e'], instructions: { pt: 'A - P - P - R - E - C - I - A - T - E', en: 'A - P - P - R - E - C - I - A - T - E', es: 'A - P - P - R - E - C - I - A - T - E' } },
      { id: 'q9', type: 'listen_and_identify', question: { pt: 'Identifique:', en: 'Identify:', es: 'Identifica:' }, target: 'VOCABULARY', options: ['VOCABULARY', 'VOLUNTARY', 'VALUABLE', 'VERBALLY'], audio_hint: 'V. O. C. A. B. U. L. A. R. Y.' },
      { id: 'q10', type: 'voice_dictation', question: { pt: 'Soletre: PROFESSIONAL', en: 'Spell: PROFESSIONAL', es: 'Deletrea: PROFESSIONAL' }, target: ['professional', 'p r o f e s s i o n a l'], instructions: { pt: 'Cuidado: F único, SS duplo! (P - R - O - F - E - S - S - I - O - N - A - L)', en: 'Watch out: single F, double S!', es: '¡Cuidado: F sola, doble S!' } }
    ]
  }
];