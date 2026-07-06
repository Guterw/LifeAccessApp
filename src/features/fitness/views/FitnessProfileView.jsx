// src/features/fitness/views/FitnessProfileView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Save, Target, Scale, Ruler, Calendar } from 'lucide-react';
import { db } from '../../../config/dexieDb';
import { useLanguage } from '../../../contexts/LanguageContext';
import { saveFitnessProfile, getBMICategory, calculateDailyCalorieNeed } from '../../../utils/fitnessManager';
import BackButton from '../../../components/BackButton';
import FooterBrand from '../../../components/FooterBrand';

const GOALS = ['lose_weight', 'gain_muscle', 'maintain', 'endurance'];
const ACTIVITY_LEVELS = ['sedentary', 'light', 'moderate', 'active'];

export default function FitnessProfileView() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const profile = useLiveQuery(() => db.fitnessProfile.get(1), [], null);

  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile && !form) setForm(profile);
  }, [profile, form]);

  if (!form) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-500 text-sm">{t('general.loading', 'Carregando...')}</div>;
  }

  const bmiCategory = getBMICategory(profile?.bmi);
  const dailyNeed = calculateDailyCalorieNeed(form);

  const handleSave = async () => {
    await saveFitnessProfile({
      weightKg: Number(form.weightKg),
      heightCm: Number(form.heightCm),
      age: Number(form.age),
      gender: form.gender,
      goal: form.goal,
      activityLevel: form.activityLevel,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 min-h-screen -mt-5 -mb-20">
      <BackButton to="/fitness" label={t('general.back', 'Voltar')} />

      <h2 className="text-3xl font-black text-white my-6">{t('fitness.myProfile', 'Meu Perfil Fitness')}</h2>

      {/* IMC E CALORIAS DIÁRIAS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
          <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">IMC</p>
          <p className="text-2xl font-black text-white">{profile?.bmi || '--'}</p>
          <p className="text-xs text-green-400 font-bold mt-1">{t(`fitness.bmi.${bmiCategory}`, bmiCategory)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
          <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">{t('fitness.dailyNeed', 'Gasto Diário Est.')}</p>
          <p className="text-2xl font-black text-white">{dailyNeed}</p>
          <p className="text-xs text-gray-500 font-bold mt-1">kcal/dia</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2"><Scale size={14} /> {t('fitness.weightPlaceholder', 'Peso (kg)')}</label>
          <input type="number" value={form.weightKg} onChange={e => setForm(f => ({ ...f, weightKg: e.target.value }))}
            className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-green-500 focus:outline-none" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2"><Ruler size={14} /> {t('fitness.heightPlaceholder', 'Altura (cm)')}</label>
          <input type="number" value={form.heightCm} onChange={e => setForm(f => ({ ...f, heightCm: e.target.value }))}
            className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-green-500 focus:outline-none" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2"><Calendar size={14} /> {t('fitness.agePlaceholder', 'Idade')}</label>
          <input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
            className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-green-500 focus:outline-none" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2"><Target size={14} /> {t('fitness.goalQuestion', 'Objetivo')}</label>
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map(g => (
              <button key={g} onClick={() => setForm(f => ({ ...f, goal: g }))}
                className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${form.goal === g ? 'bg-green-500/20 border-green-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                {t(`fitness.goals.${g}`, g)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('fitness.activityQuestion', 'Nível de Atividade')}</label>
          <div className="space-y-2">
            {ACTIVITY_LEVELS.map(lvl => (
              <button key={lvl} onClick={() => setForm(f => ({ ...f, activityLevel: lvl }))}
                className={`w-full p-3 rounded-xl border-2 text-left text-sm font-bold transition-all ${form.activityLevel === lvl ? 'bg-green-500/20 border-green-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                {t(`fitness.activity.${lvl}`, lvl)}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">
          <Save size={20} /> {saved ? t('fitness.saved', 'Salvo!') : t('fitness.saveProfile', 'Salvar Alterações')}
        </button>
      </div>

      <div className="shrink-0 mt-10"><FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" /></div>
    </div>
  );
}