// src/features/fitness/views/customPlan/WorkoutPlanOnboardingView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Wrench, ChevronLeft, X, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { db } from '../../../../config/dexieDb';
import { generateCustomWorkoutPlan } from '../../../../services/aiService';

const LOCATIONS = [
  { id: 'gym', label: 'Academia' },
  { id: 'home', label: 'Em Casa (Calistenia/Livre)' },
  { id: 'park', label: 'Parque / Ar Livre' },
  { id: 'crossfit', label: 'Box de Crossfit' }
];

const EQUIPMENT = [
  { id: 'none', label: 'Nenhum (Peso corporal)' },
  { id: 'dumbbells', label: 'Halteres / Pesos' },
  { id: 'bands', label: 'Elásticos / Bands' },
  { id: 'rope', label: 'Corda de pular' },
  { id: 'mat', label: 'Colchonete / Tatame' },
  { id: 'pullup_bar', label: 'Barra de porta/fixa' }
];

const DIFFICULTIES = ['Iniciante', 'Intermediário', 'Avançado'];
const FOCUS_AREAS = ['Full Body (Corpo todo)', 'Membros Superiores', 'Membros Inferiores', 'Core/Abdômen', 'Cardio/Emagrecimento', 'Hipertrofia Específica'];

export default function WorkoutPlanOnboardingView({ onComplete }) {
  const { uiLang } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fitnessProfile, setFitnessProfile] = useState(null);

  const [answers, setAnswers] = useState({
    locations: [],
    equipment: [],
    difficulty: '',
    focusAreas: [],
    dislikedExercises: '',
    extraComments: ''
  });

  useEffect(() => {
    db.fitnessProfile.get(1).then(setFitnessProfile);
  }, []);

  const toggleArray = (field, item) => {
    setAnswers(prev => {
      const current = prev[field];
      if (item === 'Nenhum (Peso corporal)' && field === 'equipment') {
        return { ...prev, equipment: ['Nenhum (Peso corporal)'] };
      }
      let updated = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
      if (field === 'equipment' && item !== 'Nenhum (Peso corporal)') {
        updated = updated.filter(i => i !== 'Nenhum (Peso corporal)');
      }
      return { ...prev, [field]: updated };
    });
  };

  const steps = [
    {
      key: 'locations',
      isValid: () => answers.locations.length > 0,
      render: () => (
        <div className="flex flex-col gap-4 w-full text-center">
          <MapPin className="text-teal-400 mx-auto" size={32} />
          <h3 className="text-xl font-bold text-white">Onde você planeja treinar?</h3>
          <p className="text-gray-400 text-xs">Selecione uma ou mais opções.</p>
          <div className="grid gap-3">
            {LOCATIONS.map(loc => (
              <button key={loc.id} onClick={() => toggleArray('locations', loc.label)}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${answers.locations.includes(loc.label) ? 'bg-teal-500/20 border-teal-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                {loc.label}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'equipment',
      isValid: () => answers.equipment.length > 0,
      render: () => (
        <div className="flex flex-col gap-4 w-full text-center">
          <Wrench className="text-teal-400 mx-auto" size={32} />
          <h3 className="text-xl font-bold text-white">Quais equipamentos você tem?</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {EQUIPMENT.map(eq => (
              <button key={eq.id} onClick={() => toggleArray('equipment', eq.label)}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${answers.equipment.includes(eq.label) ? 'bg-teal-500/20 border-teal-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                {eq.label}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'details',
      isValid: () => !!answers.difficulty && answers.focusAreas.length > 0,
      render: () => (
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-xl font-bold text-white text-center">Nível e Foco</h3>
          <div className="flex gap-2 justify-center mb-2">
            {DIFFICULTIES.map(d => (
              <button key={d} onClick={() => setAnswers(a => ({...a, difficulty: d}))}
                className={`px-3 py-2 rounded-lg border text-xs font-bold ${answers.difficulty === d ? 'bg-teal-500 border-teal-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                {d}
              </button>
            ))}
          </div>
          <p className="text-center text-sm font-bold text-gray-300 mt-2">Área de Foco Principal:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {FOCUS_AREAS.map(f => (
              <button key={f} onClick={() => toggleArray('focusAreas', f)}
                className={`px-3 py-1.5 rounded-lg border text-xs ${answers.focusAreas.includes(f) ? 'bg-teal-500/20 border-teal-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'preferences',
      isValid: () => true,
      render: () => (
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-xl font-bold text-white text-center">Preferências e Limitações</h3>
          <textarea
            value={answers.dislikedExercises}
            onChange={(e) => setAnswers(a => ({ ...a, dislikedExercises: e.target.value }))}
            placeholder="Exercícios que não gosta ou não pode fazer (Ex: Agachamento com barra, salto...)"
            className="w-full bg-gray-800 text-white p-4 rounded-xl border border-gray-700 focus:border-teal-500 text-sm h-24"
          />
          <textarea
            value={answers.extraComments}
            onChange={(e) => setAnswers(a => ({ ...a, extraComments: e.target.value }))}
            placeholder="Algo mais? (Ex: Tenho problema no joelho direito, treino só 3x na semana...)"
            className="w-full bg-gray-800 text-white p-4 rounded-xl border border-gray-700 focus:border-teal-500 text-sm h-24"
          />
        </div>
      )
    }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const plan = await generateCustomWorkoutPlan(answers, fitnessProfile, uiLang);
      
      await db.customWorkoutProfile.put({
        id: 1, answers, isOnboarded: true, updatedAt: new Date().toISOString()
      });
      await db.customWorkoutPlan.put({
        id: 1, plan, updatedAt: new Date().toISOString()
      });
      
      onComplete();
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar plano. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-between p-6 animate-fade-in overflow-y-auto">
      {/* topo fixo com shrink-0 */}
      <div className="w-full max-w-sm flex items-center justify-between mb-4 mt-2 shrink-0">
        {step > 0 ? (
          <button onClick={() => setStep(s => s - 1)} className="p-2 bg-gray-800 rounded-full text-white"><ChevronLeft size={20}/></button>
        ) : <div className="w-9" />}
        <div className="flex gap-1 flex-1 mx-4">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-teal-500' : 'bg-gray-700'}`} />
          ))}
        </div>
        <button onClick={() => navigate('/fitness')} className="p-2 bg-gray-800 rounded-full text-gray-400"><X size={20}/></button>
      </div>

      {/* área central de opções */}
      <div className="flex-1 flex items-center justify-center w-full max-w-sm my-auto py-4">
        {currentStep.render()}
      </div>

      {/* rodapé fixo com shrink-0 */}
      <div className="w-full max-w-sm mt-4 mb-12 shrink-0 pb-2">
        <button
          onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : handleGenerate()}
          disabled={!currentStep.isValid() || isGenerating}
          className="w-full mb-12 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-black p-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          {isGenerating ? (
            <><Loader2 className="animate-spin" size={20} /> Gerando Treino com IA...</>
          ) : step === steps.length - 1 ? (
            <><Sparkles size={20}/> Criar Plano Específico</>
          ) : (
            <><ArrowRight size={20}/> Continuar</>
          )}
        </button>
      </div>
    </div>
  );
}