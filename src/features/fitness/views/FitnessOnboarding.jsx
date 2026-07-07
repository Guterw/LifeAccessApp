// src/features/fitness/views/FitnessOnboarding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Target, Scale, Ruler, Calendar, Sparkles, Loader2, ArrowRight, TrendingDown, TrendingUp, AlertTriangle, Flame } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { saveFitnessProfile, getRealisticWeekRange, isRealisticTimeframe, calculateGoalCalorieTarget } from '../../../utils/fitnessManager';
import { generateFitnessPlan } from '../../../services/aiService';
import { db } from '../../../config/dexieDb';
import FooterBrand from '../../../components/FooterBrand';

const GOALS = [
  { id: 'lose_weight', icon: '🔥', label: { pt: 'Perder peso', en: 'Lose weight', es: 'Perder peso' } },
  { id: 'gain_muscle', icon: '💪', label: { pt: 'Ganhar músculo', en: 'Gain muscle', es: 'Ganar músculo' } },
  { id: 'maintain', icon: '⚖️', label: { pt: 'Manter a forma', en: 'Maintain fitness', es: 'Mantener la forma' } },
  { id: 'endurance', icon: '🏃', label: { pt: 'Melhorar resistência', en: 'Improve endurance', es: 'Mejorar resistencia' } },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: { pt: 'Sedentário', en: 'Sedentary', es: 'Sedentario' } },
  { id: 'light', label: { pt: 'Leve (1-2x/semana)', en: 'Light (1-2x/week)', es: 'Ligero (1-2x/semana)' } },
  { id: 'moderate', label: { pt: 'Moderado (3-4x/semana)', en: 'Moderate (3-4x/week)', es: 'Moderado (3-4x/semana)' } },
  { id: 'active', label: { pt: 'Ativo (5x+/semana)', en: 'Active (5x+/week)', es: 'Activo (5x+/semana)' } },
];

export default function FitnessOnboarding() {
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [answers, setAnswers] = useState({
    goal: '', weightKg: '', heightCm: '', age: '', gender: 'other', activityLevel: '',
    targetWeightKg: '', targetWeeks: ''
  });

  const getLabel = (obj) => obj[uiLang] || obj.pt;

  // A etapa de meta de peso só existe quando o objetivo é perder peso ou ganhar músculo
  const needsWeightGoalStep = answers.goal === 'lose_weight' || answers.goal === 'gain_muscle';
  const isLossGoal = answers.goal === 'lose_weight';

  const currentWeight = Number(answers.weightKg) || 0;
  const targetWeight = Number(answers.targetWeightKg) || 0;
  const targetWeeks = Number(answers.targetWeeks) || 0;

  const weekRange = targetWeight && currentWeight
    ? getRealisticWeekRange(currentWeight, targetWeight)
    : null;

  const timeframeIsValid = !targetWeight || !targetWeeks
    ? false
    : isRealisticTimeframe(currentWeight, targetWeight, targetWeeks);

  const goalCalorieInfo = (targetWeight && targetWeeks && currentWeight && answers.age && answers.heightCm)
    ? calculateGoalCalorieTarget({
        weightKg: currentWeight,
        heightCm: Number(answers.heightCm),
        age: Number(answers.age),
        gender: answers.gender,
        activityLevel: answers.activityLevel,
        targetWeightKg: targetWeight,
        targetWeeks: targetWeeks,
      })
    : null;

  // Monta dinamicamente a lista de etapas (a de meta de peso só entra se fizer sentido)
  const steps = [
    {
      key: 'intro',
      render: () => (
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
            <Dumbbell size={48} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {t('fitness.introTitle', 'Bem-vindo ao seu Personal Trainer com IA')}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t('fitness.introDesc', 'Vou fazer algumas perguntas rápidas para montar um plano de treino sob medida para você, usando o mesmo motor de IA que te ajuda com inglês.')}
          </p>
        </div>
      )
    },
    {
      key: 'goal',
      render: () => (
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
            <Target className="text-green-400" size={22} /> {t('fitness.goalQuestion', 'Qual é o seu objetivo principal?')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map(g => (
              <button
                key={g.id}
                onClick={() => setAnswers(a => ({ ...a, goal: g.id }))}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  answers.goal === g.id ? 'bg-green-500/20 border-green-500' : 'bg-gray-800 border-gray-700'
                }`}
              >
                <span className="text-2xl">{g.icon}</span>
                <span className="text-xs font-bold text-white text-center">{getLabel(g.label)}</span>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'body',
      render: () => (
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
            <Scale className="text-green-400" size={22} /> {t('fitness.bodyQuestion', 'Seus dados físicos')}
          </h3>
          <input type="number" placeholder={t('fitness.weightPlaceholder', 'Peso (kg)')} value={answers.weightKg}
            onChange={e => setAnswers(a => ({ ...a, weightKg: e.target.value }))}
            className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-green-500 focus:outline-none text-center" />
          <input type="number" placeholder={t('fitness.heightPlaceholder', 'Altura (cm)')} value={answers.heightCm}
            onChange={e => setAnswers(a => ({ ...a, heightCm: e.target.value }))}
            className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-green-500 focus:outline-none text-center" />
          <input type="number" placeholder={t('fitness.agePlaceholder', 'Idade')} value={answers.age}
            onChange={e => setAnswers(a => ({ ...a, age: e.target.value }))}
            className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-green-500 focus:outline-none text-center" />
        </div>
      )
    },
    // ==========================================
    // NOVA ETAPA: Meta de Peso + Prazo Realista
    // Só é incluída no array de steps se needsWeightGoalStep for true
    // (ver montagem final da lista logo abaixo)
    // ==========================================
    {
      key: 'weightGoal',
      render: () => (
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
            {isLossGoal
              ? <TrendingDown className="text-red-400" size={22} />
              : <TrendingUp className="text-green-400" size={22} />}
            {isLossGoal
              ? t('fitness.targetWeightLoss', 'Meta de peso (perda)')
              : t('fitness.targetWeightGain', 'Meta de peso (ganho)')}
          </h3>
          <p className="text-gray-400 text-xs text-center -mt-2">
            {t('fitness.weightGoalStepDesc', 'Isso nos ajuda a calcular quantas calorias você deve consumir por dia.')}
          </p>

          <input
            type="number"
            placeholder={t('fitness.targetWeightPlaceholder', 'Peso alvo (kg)')}
            value={answers.targetWeightKg}
            onChange={e => setAnswers(a => ({ ...a, targetWeightKg: e.target.value }))}
            className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-green-500 focus:outline-none text-center"
          />

          <input
            type="number"
            placeholder={t('fitness.targetWeeksPlaceholder', 'Em quantas semanas? (Ex: 12)')}
            value={answers.targetWeeks}
            onChange={e => setAnswers(a => ({ ...a, targetWeeks: e.target.value }))}
            className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-green-500 focus:outline-none text-center"
          />

          {weekRange && (
            <p className="text-[11px] text-gray-500 text-center">
              {t('fitness.realisticRangeHint', 'Prazo realista e seguro para essa meta')}: {weekRange.minWeeks} {t('fitness.toWeeks', 'a')} {weekRange.maxWeeks} {t('fitness.weeksLabel', 'semanas')} ({weekRange.diffKg}kg)
            </p>
          )}

          {answers.targetWeightKg && answers.targetWeeks && !timeframeIsValid && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300 leading-relaxed">
                {t('fitness.unrealisticTimeframe', 'Esse prazo não é seguro/realista para essa quantidade de peso. Ajuste o número de semanas dentro da faixa sugerida acima.')}
              </p>
            </div>
          )}

          {goalCalorieInfo && timeframeIsValid && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Flame size={16} className="text-orange-400" />
                <span className="text-xs font-bold text-orange-300 uppercase tracking-wide">
                  {t('fitness.recommendedIntake', 'Consumo médio recomendado')}
                </span>
              </div>
              <p className="text-2xl font-black text-white">{goalCalorieInfo.dailyTarget} <span className="text-sm font-bold text-gray-400">kcal/dia</span></p>
              <p className="text-[11px] text-gray-500 mt-1">
                {goalCalorieInfo.direction === 'loss'
                  ? t('fitness.deficitHint', 'Déficit diário de ~{n} kcal em relação ao seu gasto.').replace('{n}', goalCalorieInfo.dailyAdjustment)
                  : t('fitness.surplusHint', 'Superávit diário de ~{n} kcal em relação ao seu gasto.').replace('{n}', goalCalorieInfo.dailyAdjustment)}
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'activity',
      render: () => (
        <div className="flex flex-col gap-3 w-full">
          <h3 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
            <Calendar className="text-green-400" size={22} /> {t('fitness.activityQuestion', 'Qual seu nível de atividade atual?')}
          </h3>
          {ACTIVITY_LEVELS.map(lvl => (
            <button
              key={lvl.id}
              onClick={() => setAnswers(a => ({ ...a, activityLevel: lvl.id }))}
              className={`w-full p-4 rounded-xl border-2 text-left font-bold transition-all ${
                answers.activityLevel === lvl.id ? 'bg-green-500/20 border-green-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-300'
              }`}
            >
              {getLabel(lvl.label)}
            </button>
          ))}
        </div>
      )
    },
  ];

  // Filtra a etapa "weightGoal" fora do fluxo quando o objetivo não é perda/ganho de peso
  const activeSteps = steps.filter(s => s.key !== 'weightGoal' || needsWeightGoalStep);

  const isStepValid = () => {
    const key = activeSteps[step].key;
    if (key === 'goal') return !!answers.goal;
    if (key === 'body') return answers.weightKg && answers.heightCm && answers.age;
    if (key === 'weightGoal') return !!answers.targetWeightKg && !!answers.targetWeeks && timeframeIsValid;
    if (key === 'activity') return !!answers.activityLevel;
    return true;
  };

  const handleFinish = async () => {
    setIsGenerating(true);
    try {
      const savedProfile = await saveFitnessProfile({
        weightKg: Number(answers.weightKg),
        heightCm: Number(answers.heightCm),
        age: Number(answers.age),
        gender: answers.gender,
        goal: answers.goal,
        activityLevel: answers.activityLevel,
        targetWeightKg: needsWeightGoalStep ? Number(answers.targetWeightKg) : null,
        targetWeeks: needsWeightGoalStep ? Number(answers.targetWeeks) : null,
        isOnboarded: true,
      });
      console.log('[FitnessOnboarding] Perfil salvo:', savedProfile);

      const plan = await generateFitnessPlan(answers);

      await db.fitnessWeeklyPlan.put({
        id: 1,
        generatedAt: new Date().toISOString(),
        days: plan.days || [],
      });

      await db.fitnessProfile.update(1, { aiPlanSummary: plan.summary || '' });

      navigate('/fitness');
    } catch (err) {
      console.error('[FitnessOnboarding] Erro ao finalizar (seguindo mesmo assim):', err);
      navigate('/fitness');
    }
  };

  const handleNext = () => {
    if (step < activeSteps.length - 1) setStep(step + 1);
    else handleFinish();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-between p-6 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-sm flex gap-1.5 mt-4 shrink-0">
        {activeSteps.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-green-500' : 'bg-gray-700'}`} />
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center w-full max-w-sm py-6">
        {activeSteps[step].render()}
      </div>

      <div className="w-full max-w-sm shrink-0">
        <button
          onClick={handleNext}
          disabled={!isStepValid() || isGenerating}
          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-black p-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          {isGenerating ? (
            <><Loader2 className="animate-spin" size={20} /> {t('fitness.generatingPlan', 'Montando seu plano com IA...')}</>
          ) : step === activeSteps.length - 1 ? (
            <><Sparkles size={20} /> {t('fitness.generatePlan', 'Gerar meu plano')}</>
          ) : (
            <>{t('general.continue', 'Continuar')} <ArrowRight size={20} /></>
          )}
        </button>
        <div className="mt-4"><FooterBrand direction="flex-col" textSize="text-xs" textColor="text-gray-500" /></div>
      </div>
    </div>
  );
}