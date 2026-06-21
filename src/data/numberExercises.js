// src/data/numberExercises.js

export const NUMBER_EXERCISES = [
  {
    id: 'num_level_1',
    title: 'As Unidades (0 ao 9)',
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: 'Qual número você ouviu?', target: '0', options: ['0', '1', '10', 'O'], audio_hint: 'Zero' },
      { id: 'q2', type: 'voice_dictation', question: 'Diga o número: 1', target: ['1', 'one'], instructions: 'Fale "One".' },
      { id: 'q3', type: 'listen_and_identify', question: 'Qual número você ouviu?', target: '2', options: ['2', '3', '12', '20'], audio_hint: 'Two' },
      { id: 'q4', type: 'voice_dictation', question: 'Diga o número: 3', target: ['3', 'three'], instructions: 'Toque no microfone e fale "Three".' },
      { id: 'q5', type: 'listen_and_identify', question: 'Selecione:', target: '4', options: ['14', '40', '4', '5'], audio_hint: 'Four' },
      { id: 'q6', type: 'voice_dictation', question: 'Diga o número: 5', target: ['5', 'five'], instructions: 'Fale "Faiv".' },
      { id: 'q7', type: 'listen_and_identify', question: 'Qual você ouviu?', target: '6', options: ['16', '60', '7', '6'], audio_hint: 'Six' },
      { id: 'q8', type: 'voice_dictation', question: 'Diga o número: 7', target: ['7', 'seven'], instructions: 'Fale "Seven".' },
      { id: 'q9', type: 'listen_and_identify', question: 'Selecione:', target: '8', options: ['A', '8', '18', '80'], audio_hint: 'Eight' },
      { id: 'q10', type: 'voice_dictation', question: 'Diga o número: 9', target: ['9', 'nine'], instructions: 'Fale "Nain".' }
    ]
  },
  {
    id: 'num_level_2',
    title: 'As Dezenas Irregulares (10 ao 19)',
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: 'Selecione:', target: '10', options: ['1', '10', '100', '11'], audio_hint: 'Ten' },
      { id: 'q2', type: 'voice_dictation', question: 'Diga o número: 11', target: ['11', 'eleven'], instructions: 'Fale "Eleven".' },
      { id: 'q3', type: 'listen_and_identify', question: 'Qual número você ouviu?', target: '12', options: ['20', '12', '2', '22'], audio_hint: '12' },
      { id: 'q4', type: 'voice_dictation', question: 'Diga o número: 13', target: ['13', 'thirteen'], instructions: 'Fale "Thirteen" (focando no "tín" longo).' },
      { id: 'q5', type: 'listen_and_identify', question: 'Selecione:', target: '14', options: ['40', '4', '14', '44'], audio_hint: '14' },
      { id: 'q6', type: 'voice_dictation', question: 'Diga o número: 15', target: ['15', 'fifteen'], instructions: 'Fale "Fifteen". Cuidado com o 50!' },
      { id: 'q7', type: 'listen_and_identify', question: 'Qual você ouviu?', target: '16', options: ['60', '6', '16', '66'], audio_hint: '16' },
      { id: 'q8', type: 'voice_dictation', question: 'Diga o número: 17', target: ['17', 'seventeen'], instructions: 'Fale "Seventeen".' },
      { id: 'q9', type: 'listen_and_identify', question: 'Selecione:', target: '18', options: ['8', '80', '18', '88'], audio_hint: '18' },
      { id: 'q10', type: 'voice_dictation', question: 'Diga o número: 19', target: ['19', 'nineteen'], instructions: 'Fale "Nineteen".' }
    ]
  },
  {
    id: 'num_level_3',
    title: 'As Dezenas Redondas (20 ao 90)',
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: 'Qual você ouviu?', target: '20', options: ['12', '2', '20', '22'], audio_hint: 'Twenty' },
      { id: 'q2', type: 'voice_dictation', question: 'Diga o número: 30', target: ['30', 'thirty'], instructions: 'Fale "Thirty". Som curto no final.' },
      { id: 'q3', type: 'listen_and_identify', question: 'Selecione:', target: '40', options: ['14', '40', '4', '44'], audio_hint: 'Forty' },
      { id: 'q4', type: 'voice_dictation', question: 'Diga o número: 50', target: ['50', 'fifty'], instructions: 'Fale "Fifty".' },
      { id: 'q5', type: 'listen_and_identify', question: 'Qual você ouviu?', target: '60', options: ['16', '60', '6', '66'], audio_hint: 'Sixty' },
      { id: 'q6', type: 'voice_dictation', question: 'Diga o número: 70', target: ['70', 'seventy'], instructions: 'Fale "Seventy".' },
      { id: 'q7', type: 'listen_and_identify', question: 'Selecione:', target: '80', options: ['18', '8', '80', '88'], audio_hint: 'Eighty' },
      { id: 'q8', type: 'voice_dictation', question: 'Diga o número: 90', target: ['90', 'ninety'], instructions: 'Fale "Ninety".' },
      { id: 'q9', type: 'listen_and_identify', question: 'Atenção extra! Qual é esse?', target: '50', options: ['15', '50', '5', '55'], audio_hint: 'Fifty' },
      { id: 'q10', type: 'voice_dictation', question: 'Diga o número: 20', target: ['20', 'twenty'], instructions: 'Fale "Twenty".' }
    ]
  },
  {
    id: 'num_level_4',
    title: 'O Desafio: Teen vs Ty',
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: 'É 13 ou 30?', target: '13', options: ['13', '30', '3', '33'], audio_hint: 'Thirteen' },
      { id: 'q2', type: 'listen_and_identify', question: 'É 13 ou 30?', target: '30', options: ['13', '30', '3', '33'], audio_hint: 'Thirty' },
      { id: 'q3', type: 'voice_dictation', question: 'Fale o número: 14', target: ['14', 'fourteen'], instructions: 'Lembre do TIN longo!' },
      { id: 'q4', type: 'voice_dictation', question: 'Fale o número: 40', target: ['40', 'forty'], instructions: 'Lembre do TI curto!' },
      { id: 'q5', type: 'listen_and_identify', question: 'É 15 ou 50?', target: '50', options: ['15', '50', '5', '55'], audio_hint: 'Fifty' },
      { id: 'q6', type: 'listen_and_identify', question: 'É 15 ou 50?', target: '15', options: ['15', '50', '5', '55'], audio_hint: 'Fifteen' },
      { id: 'q7', type: 'voice_dictation', question: 'Fale o número: 18', target: ['18', 'eighteen'], instructions: 'EighTEEN.' },
      { id: 'q8', type: 'voice_dictation', question: 'Fale o número: 80', target: ['80', 'eighty'], instructions: 'EighTY.' },
      { id: 'q9', type: 'listen_and_identify', question: 'Qual você ouviu?', target: '19', options: ['90', '19', '9', '99'], audio_hint: 'Nineteen' },
      { id: 'q10', type: 'listen_and_identify', question: 'Qual você ouviu?', target: '90', options: ['90', '19', '9', '99'], audio_hint: 'Ninety' }
    ]
  },
  {
    id: 'num_level_5',
    title: 'Números Compostos e Centenas',
    questions: [
      { id: 'q1', type: 'listen_and_identify', question: 'Qual é o número?', target: '21', options: ['12', '20', '21', '22'], audio_hint: 'Twenty one' },
      { id: 'q2', type: 'voice_dictation', question: 'Diga o número: 35', target: ['35', 'thirty five', 'thirty-five'], instructions: 'Fale "Thirty five".' },
      { id: 'q3', type: 'listen_and_identify', question: 'Qual é o número?', target: '42', options: ['24', '42', '40', '22'], audio_hint: 'Forty two' },
      { id: 'q4', type: 'voice_dictation', question: 'Diga o número: 55', target: ['55', 'fifty five', 'fifty-five'], instructions: 'Fale "Fifty five".' },
      { id: 'q5', type: 'listen_and_identify', question: 'Centena: One hundred', target: '100', options: ['10', '100', '1000', '1'], audio_hint: 'One hundred' },
      { id: 'q6', type: 'voice_dictation', question: 'Diga o número: 100', target: ['100', 'one hundred', 'a hundred'], instructions: 'Fale "One hundred".' },
      { id: 'q7', type: 'listen_and_identify', question: 'Qual é o número?', target: '200', options: ['20', '100', '200', '2000'], audio_hint: 'Two hundred' },
      { id: 'q8', type: 'voice_dictation', question: 'Diga o número: 500', target: ['500', 'five hundred'], instructions: 'Fale "Five hundred".' },
      { id: 'q9', type: 'listen_and_identify', question: 'Milhar: One thousand', target: '1000', options: ['100', '1000', '10000', '10'], audio_hint: 'One thousand' },
      { id: 'q10', type: 'voice_dictation', question: 'Diga o número: 1000', target: ['1000', 'one thousand', 'a thousand'], instructions: 'Fale "One thousand".' }
    ]
  }
];