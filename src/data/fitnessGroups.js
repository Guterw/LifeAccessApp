// src/data/fitnessGroups.js
export const FITNESS_GROUPS = {
  legs: {
    id: 'legs',
    title: { pt: 'Pernas', en: 'Legs', es: 'Piernas' },
    icon: 'Footprints',
    exercises: [
      { id: 'squat', name: { pt: 'Agachamento Livre', en: 'Bodyweight Squat', es: 'Sentadilla' }, sets: 3, reps: 15, caloriesPerSet: 8, instructions: { pt: 'Pés na largura dos ombros, desça controlando o joelho.', en: 'Feet shoulder-width apart, control the knee on the way down.', es: 'Pies al ancho de los hombros, controla la rodilla al bajar.' } },
      { id: 'lunge', name: { pt: 'Afundo', en: 'Lunge', es: 'Estocada' }, sets: 3, reps: 12, caloriesPerSet: 7 },
      { id: 'wall_sit', name: { pt: 'Cadeirinha na Parede', en: 'Wall Sit', es: 'Sentadilla en Pared' }, sets: 3, reps: 30, isTimed: true, caloriesPerSet: 6 },
    ]
  },
  core: {
    id: 'core',
    title: { pt: 'Abdômen e Laterais', en: 'Core & Obliques', es: 'Abdomen y Laterales' },
    icon: 'Zap',
    exercises: [
      { id: 'crunch', name: { pt: 'Abdominal Tradicional', en: 'Crunch', es: 'Abdominal Tradicional' }, sets: 3, reps: 20, caloriesPerSet: 5 },
      { id: 'side_plank', name: { pt: 'Prancha Lateral', en: 'Side Plank', es: 'Plancha Lateral' }, sets: 3, reps: 30, isTimed: true, caloriesPerSet: 6 },
      { id: 'russian_twist', name: { pt: 'Rotação Russa', en: 'Russian Twist', es: 'Giro Ruso' }, sets: 3, reps: 20, caloriesPerSet: 5 },
    ]
  },
  back: {
    id: 'back',
    title: { pt: 'Costas', en: 'Back', es: 'Espalda' },
    icon: 'ArrowUpFromLine',
    exercises: [
      { id: 'superman', name: { pt: 'Super-Homem', en: 'Superman', es: 'Superman' }, sets: 3, reps: 15, caloriesPerSet: 5 },
      { id: 'bird_dog', name: { pt: 'Bird Dog', en: 'Bird Dog', es: 'Bird Dog' }, sets: 3, reps: 12, caloriesPerSet: 5 },
    ]
  },
  arms: {
    id: 'arms',
    title: { pt: 'Braços', en: 'Arms', es: 'Brazos' },
    icon: 'Dumbbell',
    exercises: [
      { id: 'pushup', name: { pt: 'Flexão de Braço', en: 'Push-up', es: 'Flexión de Brazos' }, sets: 3, reps: 10, caloriesPerSet: 7 },
      { id: 'tricep_dip', name: { pt: 'Mergulho de Tríceps', en: 'Tricep Dip', es: 'Fondos de Tríceps' }, sets: 3, reps: 12, caloriesPerSet: 6 },
    ]
  },
  cardio: {
    id: 'cardio',
    title: { pt: 'Cardio', en: 'Cardio', es: 'Cardio' },
    icon: 'HeartPulse',
    exercises: [
      { id: 'jumping_jacks', name: { pt: 'Polichinelo', en: 'Jumping Jacks', es: 'Saltos de Tijera' }, sets: 4, reps: 30, isTimed: true, caloriesPerSet: 9 },
      { id: 'high_knees', name: { pt: 'Corrida no Lugar', en: 'High Knees', es: 'Rodillas Altas' }, sets: 4, reps: 30, isTimed: true, caloriesPerSet: 9 },
    ]
  }
};