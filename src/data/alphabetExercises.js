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
    title: { pt: 'Desafio Master (Mistura Total)', en: 'Master Challenge (Total Mix)', es: 'Desafío Maestro (Mezcla Total)' },
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: { pt: 'Qual você ouviu?', en: 'Which one did you hear?', es: '¿Cuál escuchaste?' }, target: 'A', options: ['E', 'I', 'A', 'Y'], audio_hint: 'A' },
      { id: 'q2', type: 'listen_and_identify', question: { pt: 'Qual você ouviu?', en: 'Which one did you hear?', es: '¿Cuál escuchaste?' }, target: 'E', options: ['E', 'I', 'A', 'Y'], audio_hint: 'E' },
      { id: 'q3', type: 'listen_and_identify', question: { pt: 'Qual você ouviu?', en: 'Which one did you hear?', es: '¿Cuál escuchaste?' }, target: 'I', options: ['E', 'I', 'A', 'Y'], audio_hint: 'I' },
      { id: 'q4', type: 'voice_repetition', question: { pt: 'Diga a letra "J"', en: 'Say the letter "J"', es: 'Di la letra "J"' }, target: ['J', 'j'], instructions: { pt: 'Cuidado para não confundir com G!', en: 'Be careful not to confuse it with G!', es: '¡Cuidado con no confundirla con G!' } },
      { id: 'q5', type: 'voice_repetition', question: { pt: 'Diga a letra "G"', en: 'Say the letter "G"', es: 'Di la letra "G"' }, target: ['G', 'g'], instructions: { pt: 'Lembre-se: "dji".', en: 'Remember: "dji".', es: 'Recuerda: "dji".' } },
      { id: 'q6', type: 'listen_and_identify', question: { pt: 'Identifique:', en: 'Identify:', es: 'Identifica:' }, target: 'H', options: ['8', 'A', 'R', 'H'], audio_hint: 'H' },
      { id: 'q7', type: 'voice_repetition', question: { pt: 'Diga a letra "R"', en: 'Say the letter "R"', es: 'Di la letra "R"' }, target: ['R', 'r'], instructions: { pt: 'Fale "ar".', en: 'Say "ar".', es: 'Di "ar".' } },
      { id: 'q8', type: 'listen_and_identify', question: { pt: 'Identifique:', en: 'Identify:', es: 'Identifica:' }, target: 'W', options: ['W', 'M', 'U', 'V'], audio_hint: 'W' },
      { id: 'q9', type: 'voice_repetition', question: { pt: 'Diga a letra "Y"', en: 'Say the letter "Y"', es: 'Di la letra "Y"' }, target: ['Y', 'y'], instructions: { pt: 'A letra do mineiro: "uai".', en: 'Say "uai".', es: 'Di "uai".' } },
      { id: 'q10', type: 'phonetic_match', question: { pt: 'A fonética "kei" pertence à letra:', en: 'The phonetic "kei" belongs to the letter:', es: 'La fonética "kei" pertenece a la letra:' }, target: 'K', options: ['Q', 'C', 'K', 'T'] }
    ]
  },
  {
    id: 'alpha_level_6',
    title: { pt: 'Spelling Bee (Soletração)', en: 'Spelling Bee Challenge', es: 'Concurso de Deletreo' },
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: { pt: 'Ouça a soletração e marque a palavra:', en: 'Listen to the spelling and select the word:', es: 'Escucha el deletreo y selecciona la palabra:' }, target: 'BOOK', options: ['BACK', 'BOOK', 'BOOT', 'LOOK'], audio_hint: 'B. O. O. K.' },
      { id: 'q2', type: 'voice_dictation', question: { pt: 'Soletre a palavra: WATER', en: 'Spell the word: WATER', es: 'Deletrea la palabra: WATER' }, target: ['water', 'w a t e r'], instructions: { pt: 'Diga letra por letra (W - A - T - E - R).', en: 'Say letter by letter (W - A - T - E - R).', es: 'Di letra por letra (W - A - T - E - R).' } },
      { id: 'q3', type: 'listen_and_identify', question: { pt: 'Qual palavra foi soletrada?', en: 'Which word was spelled?', es: '¿Qué palabra fue deletreada?' }, target: 'DUBLIN', options: ['LONDON', 'DUBLIN', 'BERLIN', 'CORK'], audio_hint: 'D. U. B. L. I. N.' },
      { id: 'q4', type: 'voice_dictation', question: { pt: 'Soletre a palavra: COFFEE', en: 'Spell the word: COFFEE', es: 'Deletrea la palabra: COFFEE' }, target: ['coffee', 'c o f f e e'], instructions: { pt: 'Cuidado com as letras duplas!', en: 'Watch out for double letters!', es: '¡Cuidado con las letras dobles!' } },
      { id: 'q5', type: 'listen_and_identify', question: { pt: 'Ouça a soletração e marque a palavra:', en: 'Listen to the spelling and select the word:', es: 'Escucha el deletreo y selecciona la palabra:' }, target: 'MANAGER', options: ['MANAGE', 'MANAGER', 'MANGER', 'MANUAL'], audio_hint: 'M. A. N. A. G. E. R.' },
      { id: 'q6', type: 'voice_dictation', question: { pt: 'Soletre a sigla: HACCP', en: 'Spell the acronym: HACCP', es: 'Deletrea las siglas: HACCP' }, target: ['haccp', 'h a c c p'], instructions: { pt: 'Sigla de segurança alimentar!', en: 'Food safety acronym!', es: '¡Siglas de seguridad alimentaria!' } },
      { id: 'q7', type: 'listen_and_identify', question: { pt: 'Qual palavra foi soletrada?', en: 'Which word was spelled?', es: '¿Qué palabra fue deletreada?' }, target: 'PINT', options: ['PINT', 'PANT', 'POINT', 'PINK'], audio_hint: 'P. I. N. T.' },
      { id: 'q8', type: 'voice_dictation', question: { pt: 'Soletre a palavra: TICKET', en: 'Spell the word: TICKET', es: 'Deletrea la palabra: TICKET' }, target: ['ticket', 't i c k e t'], instructions: { pt: 'Diga letra por letra.', en: 'Say it letter by letter.', es: 'Dilo letra por letra.' } },
      { id: 'q9', type: 'listen_and_identify', question: { pt: 'Ouça com atenção:', en: 'Listen carefully:', es: 'Escucha con atención:' }, target: 'IRELAND', options: ['ISLAND', 'IRELAND', 'ENGLAND', 'ICELAND'], audio_hint: 'I. R. E. L. A. N. D.' },
      { id: 'q10', type: 'voice_dictation', question: { pt: 'Soletre o nome: LUCCAS', en: 'Spell the name: LUCCAS', es: 'Deletrea el nombre: LUCCAS' }, target: ['luccas', 'l u c c a s'], instructions: { pt: 'Cuidado com o duplo C!', en: 'Watch out for the double C!', es: '¡Cuidado con la doble C!' } },
      { id: 'q11', type: 'listen_and_identify', question: { pt: 'Qual palavra foi soletrada?', en: 'Which word was spelled?', es: '¿Qué palabra fue deletreada?' }, target: 'AIRPORT', options: ['AIRPLANE', 'AIRPORT', 'EXPORT', 'REPORT'], audio_hint: 'A. I. R. P. O. R. T.' },
      { id: 'q12', type: 'voice_dictation', question: { pt: 'Soletre a palavra: FLIGHT', en: 'Spell the word: FLIGHT', es: 'Deletrea la palabra: FLIGHT' }, target: ['flight', 'f l i g h t'], instructions: { pt: 'Voo em inglês. F - L - I - G - H - T.', en: 'Flight. F - L - I - G - H - T.', es: 'Vuelo en inglés. F - L - I - G - H - T.' } },
      { id: 'q13', type: 'listen_and_identify', question: { pt: 'Ouça a cor e selecione:', en: 'Listen to the color and select:', es: 'Escucha el color y selecciona:' }, target: 'YELLOW', options: ['HELLO', 'YELLOW', 'PILLOW', 'MELLOW'], audio_hint: 'Y. E. L. L. O. W.' },
      { id: 'q14', type: 'voice_dictation', question: { pt: 'Soletre: BROTHER', en: 'Spell: BROTHER', es: 'Deletrea: BROTHER' }, target: ['brother', 'b r o t h e r'], instructions: { pt: 'Irmão em inglês.', en: 'Brother in English.', es: 'Hermano en inglés.' } },
      { id: 'q15', type: 'listen_and_identify', question: { pt: 'A última! Qual palavra é?', en: 'The last one! Which word is it?', es: '¡La última! ¿Qué palabra es?' }, target: 'TROLLEY', options: ['VALLEY', 'TROLLEY', 'ALLEY', 'VOLLEY'], audio_hint: 'T. R. O. L. L. E. Y.' }
    ]
  }
];