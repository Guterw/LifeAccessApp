// src/features/fitness/views/diet/DietProfileEditView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Trash2, Plus, Droplets, Flame, Ban } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { getDietProfile, saveDietProfile } from '../../../../utils/dietManager';
import BackButton from '../../../../components/BackButton';
import FooterBrand from '../../../../components/FooterBrand';

export default function DietProfileEditView() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [profile, setProfile] = useState(null);
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState('');
  const [waterGoalMl, setWaterGoalMl] = useState('');
  const [restrictions, setRestrictions] = useState('');
  const [meals, setMeals] = useState([]);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const p = await getDietProfile();
      if (p) {
        setProfile(p);
        setDailyCalorieTarget(p.dailyCalorieTarget || '');
        setWaterGoalMl(p.waterGoalMl || '');
        setRestrictions(p.restrictions || '');
        setMeals(
          (p.generatedPlan?.meals || []).map((m, idx) => ({
            id: `meal_${idx}_${Date.now()}`,
            name: m.name || '',
            suggestion: m.suggestion || '',
            estimatedCalories: m.estimatedCalories || 0,
          }))
        );
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const updateMeal = (id, field, value) => {
    setMeals((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, [field]: field === 'estimatedCalories' ? Math.max(0, Number(value) || 0) : value }
          : m
      )
    );
  };

  const removeMeal = (id) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const addMeal = () => {
    setMeals((prev) => [
      ...prev,
      { id: `meal_new_${Date.now()}`, name: '', suggestion: '', estimatedCalories: 0 },
    ]);
  };

  const handleSave = async () => {
    const updatedPlan = {
      ...(profile?.generatedPlan || {}),
      dailyCalorieTarget: Number(dailyCalorieTarget) || 0,
      waterGoalMl: Number(waterGoalMl) || 0,
      meals: meals
        .filter((m) => m.name.trim())
        .map((m) => ({
          name: m.name.trim(),
          suggestion: m.suggestion.trim(),
          estimatedCalories: Number(m.estimatedCalories) || 0,
        })),
    };

    await saveDietProfile({
      dailyCalorieTarget: Number(dailyCalorieTarget) || 0,
      waterGoalMl: Number(waterGoalMl) || 0,
      restrictions: restrictions.trim(),
      generatedPlan: updatedPlan,
    });

    setSaved(true);
    setTimeout(() => navigate('/fitness/diet'), 800);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 text-sm animate-pulse">{t('general.loading', 'Carregando...')}</p>
      </div>
    );
  }

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 min-h-screen -mt-5 -mb-20">
      <BackButton to="/fitness/diet" label={t('general.back', 'Voltar')} />

      <h2 className="text-2xl font-black text-white my-6">
        {t('diet.editProfileTitle', 'Editar Minha Dieta')}
      </h2>

      <div className="space-y-5">
        {/* META DE CALORIAS */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
            <Flame size={14} className="text-orange-400" />
            {t('diet.dailyTarget', 'Meta Diária de Calorias')}
          </label>
          <div className="relative">
            <input
              type="number"
              value={dailyCalorieTarget}
              onChange={(e) => setDailyCalorieTarget(e.target.value)}
              className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-orange-500 focus:outline-none pr-16"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">kcal</span>
          </div>
        </div>

        {/* META DE ÁGUA */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
            <Droplets size={14} className="text-sky-400" />
            {t('diet.waterGoal', 'Meta de Água')}
          </label>
          <div className="relative">
            <input
              type="number"
              value={waterGoalMl}
              onChange={(e) => setWaterGoalMl(e.target.value)}
              className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-sky-500 focus:outline-none pr-16"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">ml</span>
          </div>
        </div>

        {/* RESTRIÇÕES */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
            <Ban size={14} className="text-red-400" />
            {t('diet.restrictionsQuestion', 'Restrições ou alergias')}
          </label>
          <textarea
            value={restrictions}
            onChange={(e) => setRestrictions(e.target.value)}
            placeholder={t('diet.restrictionsPlaceholder', 'Ex: lactose, glúten, vegetariano... (opcional)')}
            className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-orange-500 focus:outline-none min-h-[80px] text-sm"
          />
        </div>

        {/* REFEIÇÕES */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
            {t('diet.mealsSection', 'Refeições do Plano')}
          </label>

          <div className="space-y-3">
            {meals.map((meal) => (
              <div key={meal.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <input
                    type="text"
                    value={meal.name}
                    onChange={(e) => updateMeal(meal.id, 'name', e.target.value)}
                    placeholder={t('diet.mealNamePlaceholder', 'Ex: Café da Manhã')}
                    className="flex-1 bg-transparent text-white font-bold text-sm border-b border-gray-700 focus:border-orange-500 focus:outline-none pb-1"
                  />
                  <button
                    onClick={() => removeMeal(meal.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <textarea
                  value={meal.suggestion}
                  onChange={(e) => updateMeal(meal.id, 'suggestion', e.target.value)}
                  placeholder={t('diet.mealSuggestionPlaceholder', 'Descrição da refeição')}
                  className="w-full bg-gray-900 text-white p-2.5 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none text-xs mb-2 min-h-[50px]"
                />

                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                    {t('diet.calories', 'Calorias')}
                  </label>
                  <input
                    type="number"
                    value={meal.estimatedCalories}
                    onChange={(e) => updateMeal(meal.id, 'estimatedCalories', e.target.value)}
                    className="w-full bg-gray-900 text-white p-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none text-sm"
                  />
                </div>
              </div>
            ))}

            {meals.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-6 bg-gray-800/50 rounded-2xl border border-gray-700">
                {t('diet.noMealsYet', 'Nenhuma refeição cadastrada ainda.')}
              </div>
            )}
          </div>

          <button
            onClick={addMeal}
            className="w-full mt-3 py-3 rounded-2xl border-2 border-dashed border-gray-700 text-gray-400 hover:border-orange-500/50 hover:text-orange-400 transition-colors flex items-center justify-center gap-2 text-sm font-bold"
          >
            <Plus size={16} /> {t('diet.addMeal', 'Adicionar refeição')}
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Save size={20} /> {saved ? t('diet.saved', 'Salvo!') : t('diet.saveChanges', 'Salvar Alterações')}
        </button>
      </div>

      <div className="shrink-0 mt-10">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>
    </div>
  );
}