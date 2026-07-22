// src/features/fitness/views/customPlan/CustomWorkoutPlanView.jsx
import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit3, Settings, Play } from 'lucide-react';
import { db } from '../../../../config/dexieDb';
import WorkoutPlanOnboardingView from './WorkoutPlanOnboardingView';
import BackButton from '../../../../components/BackButton';

// 1. Criamos a flag de carregamento
const LOADING = '__LOADING__';

export default function CustomWorkoutPlanView() {
  const navigate = useNavigate();
  
  // 2. Passamos o LOADING como terceiro argumento (valor inicial)
  const profile = useLiveQuery(() => db.customWorkoutProfile.get(1), [], LOADING);
  const planData = useLiveQuery(() => db.customWorkoutPlan.get(1), [], LOADING);
  
  const [editingDay, setEditingDay] = useState(null);
  const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '', notes: '' });

  // 3. Modificamos a verificação para comparar com a flag
  if (profile === LOADING || planData === LOADING) {
    return <div className="p-8 text-white text-center">Carregando...</div>;
  }

  // 4. Se terminou de carregar e não há perfil ou não fez onboarding, abre a tela de perguntas
  if (!profile || !profile.isOnboarded) {
    return <WorkoutPlanOnboardingView onComplete={() => navigate(0)} />;
  }

  const plan = planData?.plan || { days: [] };

  const handleRemoveExercise = async (dayIndex, exerciseIndex) => {
    const updatedPlan = { ...plan };
    updatedPlan.days[dayIndex].exercises.splice(exerciseIndex, 1);
    await db.customWorkoutPlan.update(1, { plan: updatedPlan, updatedAt: new Date().toISOString() });
  };

  const handleAddExercise = async () => {
    if (!newExercise.name) return;
    const updatedPlan = { ...plan };
    if (!updatedPlan.days[editingDay].exercises) updatedPlan.days[editingDay].exercises = [];
    updatedPlan.days[editingDay].exercises.push({ ...newExercise });
    
    await db.customWorkoutPlan.update(1, { plan: updatedPlan, updatedAt: new Date().toISOString() });
    setEditingDay(null);
    setNewExercise({ name: '', sets: '', reps: '', notes: '' });
  };

  const handleRemakePlan = async () => {
    if(window.confirm('Isso apagará o plano atual. Deseja refazer o questionário?')){
      await db.customWorkoutProfile.delete(1);
      await db.customWorkoutPlan.delete(1);
      navigate(0);
    }
  };

  return (
    <div className="w-full pt-8 px-4 pb-24 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <BackButton to="/fitness" label="Voltar" />
        <button onClick={handleRemakePlan} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white">
          <Settings size={20} />
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-black text-white">Meu Plano de Treino</h1>
        <p className="text-sm text-teal-400 mt-2">{plan.summary}</p>
      </div>

      <div className="space-y-6">
        {plan.days.map((day, dIdx) => (
          <div key={dIdx} className="bg-gray-800/60 rounded-3xl p-5 border border-gray-700">
            <h3 className="text-xl font-black text-white mb-4 border-b border-gray-700 pb-2">{day.dayName}</h3>
            
            {day.isRestDay ? (
              <p className="text-gray-500 italic">Dia de Descanso Ativo / Recuperação.</p>
            ) : (
              <div className="space-y-3">
                {day.exercises?.map((ex, eIdx) => (
                  <div key={eIdx} className="bg-gray-900 rounded-xl p-3 flex justify-between items-start border border-gray-800">
                    <div>
                      <h4 className="font-bold text-gray-200 text-sm">{ex.name}</h4>
                      <p className="text-xs text-teal-400 font-bold mt-1">
                        {ex.sets} séries {ex.reps && `x ${ex.reps}`}
                      </p>
                      {ex.notes && <p className="text-[10px] text-gray-500 mt-1">{ex.notes}</p>}
                    </div>
                    <button 
                      onClick={() => handleRemoveExercise(dIdx, eIdx)}
                      className="p-1.5 text-gray-600 hover:text-red-400 bg-gray-800 rounded-md"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {/* Área para adicionar novo exercício naquele dia */}
                {editingDay === dIdx ? (
                  <div className="bg-teal-900/20 border border-teal-500/30 rounded-xl p-3 flex flex-col gap-2 mt-3">
                    <input type="text" placeholder="Nome do exercício" className="w-full bg-gray-800 text-white p-2 rounded text-sm" value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})} />
                    <div className="flex gap-2">
                      <input type="text" placeholder="Séries (Ex: 3)" className="w-1/2 bg-gray-800 text-white p-2 rounded text-sm" value={newExercise.sets} onChange={e => setNewExercise({...newExercise, sets: e.target.value})} />
                      <input type="text" placeholder="Reps (Ex: 10-12)" className="w-1/2 bg-gray-800 text-white p-2 rounded text-sm" value={newExercise.reps} onChange={e => setNewExercise({...newExercise, reps: e.target.value})} />
                    </div>
                    <input type="text" placeholder="Notas (opcional)" className="w-full bg-gray-800 text-white p-2 rounded text-sm" value={newExercise.notes} onChange={e => setNewExercise({...newExercise, notes: e.target.value})} />
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setEditingDay(null)} className="px-3 py-1 text-xs text-gray-400">Cancelar</button>
                      <button onClick={handleAddExercise} className="px-3 py-1 bg-teal-600 text-white rounded text-xs font-bold">Salvar</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setEditingDay(dIdx)} className="w-full flex items-center justify-center gap-2 py-2 mt-2 border border-dashed border-gray-600 rounded-xl text-gray-400 hover:text-teal-400 hover:border-teal-500 transition-colors text-xs font-bold">
                    <Plus size={14} /> Adicionar Exercício
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}