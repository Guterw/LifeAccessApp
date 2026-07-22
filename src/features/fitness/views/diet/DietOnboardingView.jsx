// src/features/fitness/views/diet/DietOnboardingView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Salad, Loader2, Sparkles, ArrowRight, ChevronLeft, X, Droplets, Utensils, Timer, Info } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { db } from '../../../../config/dexieDb';
import { saveDietProfile } from '../../../../utils/dietManager';
import { generateDietPlan } from '../../../../services/aiService';
import { calculateDailyCalorieNeed, calculateGoalCalorieTarget, FASTING_PROTOCOLS, startFast } from '../../../../utils/fitnessManager';
import FooterBrand from '../../../../components/FooterBrand';

const MEAL_OPTIONS = [1, 2, 3, 4, 5, 6];
const FASTING_PROTOCOL_IDS = Object.keys(FASTING_PROTOCOLS); // '16:8', '18:6', '20:4', 'OMAD'

// Rótulos amigáveis para o objetivo já definido no perfil de Fitness —
// usados apenas para EXIBIÇÃO (não perguntamos de novo ao usuário).
const GOAL_LABELS = {
  lose_weight: { pt: 'Perder peso', en: 'Lose weight', es: 'Perder peso' },
  gain_muscle: { pt: 'Ganhar músculo', en: 'Gain muscle', es: 'Ganar músculo' },
  maintain: { pt: 'Manter a forma', en: 'Maintain fitness', es: 'Mantener la forma' },
  endurance: { pt: 'Melhorar resistência', en: 'Improve endurance', es: 'Mejorar resistencia' },
};

// ==========================================
// Cálculo de meta de água recomendada por nutricionistas: ~35ml por kg de
// peso corporal para adultos saudáveis (referência comum: 30-40ml/kg).
// Ajustamos um pouco para cima quando o nível de atividade é maior, já que
// a perda de líquidos por suor aumenta a necessidade hídrica diária.
// ==========================================
const ACTIVITY_WATER_BONUS_ML = {
  sedentary: 0,
  light: 150,
  moderate: 350,
  active: 600,
};

const calculateWaterGoalMl = (weightKg, activityLevel) => {
  const w = Number(weightKg) || 70; // fallback razoável se não houver peso
  const base = w * 35;
  const bonus = ACTIVITY_WATER_BONUS_ML[activityLevel] || 0;
  // Arredonda para o múltiplo de 50ml mais próximo, fica mais "redondo" na UI
  return Math.round((base + bonus) / 50) * 50;
};

export default function DietOnboardingView() {
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  // Dados vindos do perfil de Fitness (objetivo, peso, atividade) — nunca
  // perguntados de novo aqui, só extraídos e usados nos cálculos/prompts.
  const [fitnessProfile, setFitnessProfile] = useState(null);
  const [isLoadingFitness, setIsLoadingFitness] = useState(true);

  const [answers, setAnswers] = useState({
    mealsPerDay: 4,
    wantsFasting: null, // null = ainda não respondeu, true/false
    fastingProtocol: '16:8',
    startFastingNow: false,
    restrictions: '',
    likedFoods: '',
    dislikedFoods: '',
    difficultyFoods: '',
  });

  const getLabel = (obj) => obj[uiLang] || obj.pt;

  useEffect(() => {
    const loadFitness = async () => {
      try {
        const profile = await db.fitnessProfile.get(1);
        setFitnessProfile(profile || null);
      } catch (err) {
        console.warn('[DietOnboardingView] Não foi possível ler o fitnessProfile:', err);
      } finally {
        setIsLoadingFitness(false);
      }
    };
    loadFitness();
  }, []);

  const hasFitnessGoal = !!fitnessProfile?.goal;
  const goalLabel = hasFitnessGoal
    ? getLabel(GOAL_LABELS[fitnessProfile.goal] || { pt: fitnessProfile.goal, en: fitnessProfile.goal, es: fitnessProfile.goal })
    : null;

  // A etapa de escolha de protocolo só existe se o usuário disser "sim" ao jejum
  const needsFastingProtocolStep = answers.wantsFasting === true;

  const steps = [
    {
      key: 'intro',
      render: () => (
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center">
            <Salad size={48} className="text-orange-400" />
          </div>
          <h2 className="text-2xl font-black text-white">{t('diet.introTitle', 'Vamos montar sua dieta')}</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t('diet.introDesc', 'Responda algumas perguntas rápidas. No final, nossa IA vai montar uma sugestão de dieta personalizada — e você pode editar tudo depois.')}
          </p>

          {/* Mostra o objetivo já vindo do perfil de Fitness, sem perguntar de novo */}
          {hasFitnessGoal && (
            <div className="w-full bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3 text-left">
              <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-200 leading-relaxed">
                {t('diet.usingFitnessGoal', 'Vamos usar o objetivo já definido no seu perfil de Fitness')}:{' '}
                <span className="font-black text-blue-100">{goalLabel}</span>
              </p>
            </div>
          )}
          {!hasFitnessGoal && !isLoadingFitness && (
            <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 text-left">
              <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200 leading-relaxed">
                {t('diet.noFitnessGoalWarning', 'Você ainda não configurou seu perfil de Fitness. Recomendamos configurá-lo primeiro para termos um objetivo e metas calóricas mais precisas — mas você pode continuar mesmo assim.')}
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'meals',
      render: () => (
        <div className="flex flex-col gap-4 w-full text-center">
          <Utensils className="text-orange-400 mx-auto" size={28} />
          <h3 className="text-xl font-bold text-white">{t('diet.mealsQuestion', 'Quantas refeições você faz por dia?')}</h3>
          <p className="text-gray-500 text-xs -mt-2">{t('diet.mealsHint', 'Inclui até quem prefere fazer só 1 ou 2 refeições por dia (OMAD/jejum).')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {MEAL_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setAnswers((a) => ({ ...a, mealsPerDay: n }))}
                className={`w-14 h-14 rounded-2xl border-2 font-black text-lg transition-all ${
                  answers.mealsPerDay === n ? 'bg-orange-500/20 border-orange-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'fasting',
      render: () => (
        <div className="flex flex-col gap-4 w-full text-center">
          <Timer className="text-indigo-400 mx-auto" size={28} />
          <h3 className="text-xl font-bold text-white">{t('diet.fastingQuestion', 'Você pratica ou quer praticar jejum intermitente?')}</h3>
          <p className="text-gray-500 text-xs -mt-2">
            {t('diet.fastingDesc', 'Isso ajuda a IA a organizar melhor a janela das suas refeições.')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setAnswers((a) => ({ ...a, wantsFasting: true }))}
              className={`p-4 rounded-2xl border-2 font-bold transition-all ${
                answers.wantsFasting === true ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-300'
              }`}
            >
              {t('diet.fastingYes', 'Sim, quero')}
            </button>
            <button
              onClick={() => setAnswers((a) => ({ ...a, wantsFasting: false }))}
              className={`p-4 rounded-2xl border-2 font-bold transition-all ${
                answers.wantsFasting === false ? 'bg-gray-700/60 border-gray-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-300'
              }`}
            >
              {t('diet.fastingNo', 'Não, obrigado')}
            </button>
          </div>
        </div>
      ),
    },
    {
      key: 'fastingProtocol',
      render: () => (
        <div className="flex flex-col gap-4 w-full text-center">
          <Timer className="text-indigo-400 mx-auto" size={28} />
          <h3 className="text-xl font-bold text-white">{t('diet.fastingProtocolQuestion', 'Escolha o protocolo de jejum')}</h3>
          <div className="grid grid-cols-2 gap-3">
            {FASTING_PROTOCOL_IDS.map((p) => (
              <button
                key={p}
                onClick={() => setAnswers((a) => ({ ...a, fastingProtocol: p }))}
                className={`p-4 rounded-2xl border-2 font-black transition-all ${
                  answers.fastingProtocol === p ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'
                }`}
              >
                {p}
                <p className="text-[10px] font-bold text-gray-500 mt-1">{FASTING_PROTOCOLS[p].fastHours}h {t('fasting.fasting', 'jejum')}</p>
              </button>
            ))}
          </div>

          <label className="flex items-center justify-between bg-gray-800/60 p-4 rounded-xl border border-gray-700 mt-2">
            <span className="text-sm text-gray-300 text-left">
              {t('diet.startFastingNow', 'Ativar meu jejum agora mesmo (iniciar a contagem)')}
            </span>
            <button
              type="button"
              onClick={() => setAnswers((a) => ({ ...a, startFastingNow: !a.startFastingNow }))}
              className={`w-11 h-6 rounded-full p-1 transition-all duration-300 shrink-0 ml-3 ${
                answers.startFastingNow ? 'bg-indigo-600' : 'bg-gray-700'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${answers.startFastingNow ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </label>
        </div>
      ),
    },
    {
      key: 'restrictions',
      render: () => (
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-xl font-bold text-white text-center">{t('diet.restrictionsQuestion', 'Alguma restrição ou alergia alimentar?')}</h3>
          <textarea
            value={answers.restrictions}
            onChange={(e) => setAnswers((a) => ({ ...a, restrictions: e.target.value }))}
            placeholder={t('diet.restrictionsPlaceholder', 'Ex: lactose, glúten, vegetariano... (opcional)')}
            className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-orange-500 focus:outline-none min-h-[90px] text-sm"
          />
        </div>
      ),
    },
    {
      key: 'liked',
      render: () => (
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-xl font-bold text-white text-center">{t('diet.likedQuestion', 'Do que você mais gosta de comer?')}</h3>
          <textarea
            value={answers.likedFoods}
            onChange={(e) => setAnswers((a) => ({ ...a, likedFoods: e.target.value }))}
            placeholder={t('diet.likedPlaceholder', 'Ex: frango grelhado, arroz, frutas...')}
            className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-orange-500 focus:outline-none min-h-[90px] text-sm"
          />
        </div>
      ),
    },
    {
      key: 'disliked',
      render: () => (
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-xl font-bold text-white text-center">{t('diet.dislikedQuestion', 'Do que você NÃO gosta / não quer comer?')}</h3>
          <textarea
            value={answers.dislikedFoods}
            onChange={(e) => setAnswers((a) => ({ ...a, dislikedFoods: e.target.value }))}
            placeholder={t('diet.dislikedPlaceholder', 'Ex: peixe, brócolis...')}
            className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-orange-500 focus:outline-none min-h-[90px] text-sm"
          />
        </div>
      ),
    },
    {
      key: 'difficulty',
      render: () => (
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-xl font-bold text-white text-center">{t('diet.difficultyQuestion', 'Que alimentos você tem dificuldade de abandonar?')}</h3>
          <p className="text-gray-500 text-xs text-center -mt-2">{t('diet.difficultyDesc', 'Sem julgamentos! Vamos incluir com moderação para o plano ser sustentável.')}</p>
          <textarea
            value={answers.difficultyFoods}
            onChange={(e) => setAnswers((a) => ({ ...a, difficultyFoods: e.target.value }))}
            placeholder={t('diet.difficultyPlaceholder', 'Ex: refrigerante, doces, fast food...')}
            className="w-full bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-orange-500 focus:outline-none min-h-[90px] text-sm"
          />
        </div>
      ),
    },
  ];

  // Remove a etapa de protocolo de jejum caso o usuário tenha dito "não"
  // ou ainda não tenha respondido a pergunta anterior.
  const activeSteps = steps.filter((s) => s.key !== 'fastingProtocol' || needsFastingProtocolStep);

  const isStepValid = () => {
    const key = activeSteps[step].key;
    if (key === 'fasting') return answers.wantsFasting !== null;
    if (key === 'fastingProtocol') return !!answers.fastingProtocol;
    return true;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // O objetivo NUNCA é perguntado aqui — é extraído direto do perfil de
      // Fitness já existente. Se o usuário não tiver perfil de Fitness ainda,
      // usamos "maintain" como padrão neutro para não travar o fluxo.
      const goal = fitnessProfile?.goal || 'maintain';

      // TDEE real e meta calórica de OBJETIVO (considerando déficit/superávit
      // planejado no Fitness) — usados como âncora obrigatória para a IA,
      // exatamente como calculado no módulo de Fitness (BMI + objetivo + prazo).
      let referenceTdee = null;
      let goalCalorieTarget = null;
      if (fitnessProfile?.isOnboarded) {
        referenceTdee = calculateDailyCalorieNeed(fitnessProfile);
        const goalInfo = calculateGoalCalorieTarget(fitnessProfile);
        goalCalorieTarget = goalInfo.dailyTarget;
      }

      // Meta de água calculada com a fórmula padrão de nutrição
      // (35ml x peso corporal em kg, com bônus por nível de atividade),
      // em vez de deixar a IA "chutar" um valor genérico.
      const waterGoalMl = calculateWaterGoalMl(fitnessProfile?.weightKg, fitnessProfile?.activityLevel);

      const plan = await generateDietPlan(
        {
          ...answers,
          goal,
          referenceTdee,
          goalCalorieTarget,
          waterGoalMl,
          weightKg: fitnessProfile?.weightKg || null,
          heightCm: fitnessProfile?.heightCm || null,
          age: fitnessProfile?.age || null,
          gender: fitnessProfile?.gender || null,
          activityLevel: fitnessProfile?.activityLevel || null,
        },
        uiLang
      );

      // GARANTIAS DE CONSISTÊNCIA: tanto a meta calórica quanto a meta de
      // água NUNCA devem divergir dos cálculos nutricionais reais — mesmo
      // que a IA tenha sugerido outro número, o valor calculado localmente
      // sempre prevalece.
      if (goalCalorieTarget) {
        plan.dailyCalorieTarget = goalCalorieTarget;
      } else if (!plan.dailyCalorieTarget && referenceTdee) {
        plan.dailyCalorieTarget = referenceTdee;
      }
      plan.waterGoalMl = waterGoalMl;

      setGeneratedPlan({ ...plan, referenceTdee, goalCalorieTarget, goal });
    } catch (err) {
      console.error(err);
      const fallbackWater = calculateWaterGoalMl(fitnessProfile?.weightKg, fitnessProfile?.activityLevel);
      setGeneratedPlan({
        summary: t('diet.generateError', 'Não foi possível gerar automaticamente. Você pode editar manualmente depois.'),
        dailyCalorieTarget: 2000, waterGoalMl: fallbackWater, meals: [], tips: [],
        goal: fitnessProfile?.goal || 'maintain',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (step < activeSteps.length - 1) setStep(step + 1);
    else handleGenerate();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleExit = () => {
    navigate('/fitness');
  };

  const confirmPlan = async () => {
    await saveDietProfile({
      goal: generatedPlan.goal || fitnessProfile?.goal || 'maintain',
      mealsPerDay: answers.mealsPerDay,
      restrictions: answers.restrictions,
      likedFoods: answers.likedFoods,
      dislikedFoods: answers.dislikedFoods,
      difficultyFoods: answers.difficultyFoods,
      dailyCalorieTarget: generatedPlan.dailyCalorieTarget || 2000,
      waterGoalMl: generatedPlan.waterGoalMl || 2000,
      referenceTdee: generatedPlan.referenceTdee || null,
      goalCalorieTarget: generatedPlan.goalCalorieTarget || null,
      fastingEnabled: answers.wantsFasting === true,
      fastingProtocol: answers.wantsFasting === true ? answers.fastingProtocol : null,
      generatedPlan,
      isOnboarded: true,
    });

    // Se o usuário pediu para já ativar o jejum, iniciamos a sessão de jejum
    // reaproveitando a mesma lógica/tabela usada pelo módulo de Fitness.
    if (answers.wantsFasting === true && answers.startFastingNow) {
      try {
        await startFast(answers.fastingProtocol);
      } catch (err) {
        console.error('[DietOnboardingView] Erro ao iniciar jejum:', err);
      }
    }

    navigate('/fitness/diet');
  };

  // ============ TELA DE RESULTADO GERADO PELA IA ============
  if (generatedPlan) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col overflow-y-auto p-6 animate-fade-in">
        <div className="w-full max-w-sm mx-auto flex items-center justify-between mb-2 shrink-0">
          <button
            onClick={() => setGeneratedPlan(null)}
            className="p-2.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:text-white transition-colors"
            title={t('diet.editAnswers', 'Voltar e editar respostas')}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleExit}
            className="p-2.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-red-400 transition-colors"
            title={t('cancel', 'Cancelar')}
          >
            <X size={20} />
          </button>
        </div>

        <div className="w-full max-w-sm mx-auto flex-1">
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <Sparkles className="text-orange-400" size={32} />
            <h2 className="text-2xl font-black text-white">{t('diet.planReadyTitle', 'Sua dieta sugerida')}</h2>
            <p className="text-gray-400 text-sm">{generatedPlan.summary}</p>
          </div>

          {generatedPlan.goalCalorieTarget && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-4 w-full text-center">
              <p className="text-[11px] text-blue-200 leading-relaxed">
                {t('diet.tdeeReferenceNote', 'Meta baseada na meta calórica do seu perfil de Fitness:')}{' '}
                <span className="font-black text-blue-100">{generatedPlan.goalCalorieTarget} kcal/dia</span>
              </p>
            </div>
          )}

          <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3 mb-4 w-full text-center">
            <p className="text-[11px] text-sky-200 leading-relaxed">
              {t('diet.waterFormulaNote', 'Meta de água calculada com base no seu peso (35ml por kg)')}
            </p>
          </div>

          {answers.wantsFasting === true && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 mb-4 w-full text-center flex items-center justify-center gap-2">
              <Timer size={14} className="text-indigo-400" />
              <p className="text-[11px] text-indigo-200">
                {t('diet.fastingLinkedNote', 'Jejum intermitente vinculado')}: <span className="font-black text-indigo-100">{answers.fastingProtocol}</span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase">{t('diet.dailyTarget', 'Meta Diária')}</p>
              <p className="text-xl font-black text-orange-400">{generatedPlan.dailyCalorieTarget} kcal</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center justify-center gap-1"><Droplets size={12} /> {t('diet.waterGoal', 'Meta de Água')}</p>
              <p className="text-xl font-black text-sky-400">{(generatedPlan.waterGoalMl / 1000).toFixed(2)}L</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {(generatedPlan.meals || []).map((meal, i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white text-sm">{meal.name}</span>
                  <span className="text-xs font-bold text-orange-400">{meal.estimatedCalories} kcal</span>
                </div>
                <p className="text-xs text-gray-400">{meal.suggestion}</p>
              </div>
            ))}
          </div>

          {(generatedPlan.tips || []).length > 0 && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 mb-6">
              <p className="text-[10px] font-bold text-orange-400 uppercase mb-2">{t('diet.tips', 'Dicas')}</p>
              <ul className="space-y-1.5">
                {generatedPlan.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-orange-100">• {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="w-full max-w-sm mx-auto shrink-0 space-y-3">
          <button onClick={confirmPlan} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black p-4 rounded-2xl shadow-lg">
            {t('diet.confirmPlan', 'Usar esta dieta')}
          </button>
          <button onClick={() => setGeneratedPlan(null)} className="w-full bg-gray-800 text-gray-300 font-bold p-3 rounded-2xl">
            {t('diet.editAnswers', 'Voltar e editar respostas')}
          </button>
        </div>
      </div>
    );
  }

  // ============ FLUXO DE PERGUNTAS ============
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-between p-6 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-sm flex items-center justify-between gap-3 mt-4 shrink-0">
        {/* Botão Voltar (esconde na primeira etapa, onde "voltar" = sair) */}
        {step > 0 ? (
          <button
            onClick={handleBack}
            className="p-2.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:text-white transition-colors shrink-0"
            title={t('general.back', 'Voltar')}
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div className="w-10 shrink-0" />
        )}

        <div className="flex-1 flex gap-1.5">
          {activeSteps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-orange-500' : 'bg-gray-700'}`} />
          ))}
        </div>

        <button
          onClick={handleExit}
          className="p-2.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-red-400 transition-colors shrink-0"
          title={t('cancel', 'Cancelar')}
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center w-full max-w-sm py-6">
        {activeSteps[step].render()}
      </div>

      <div className="w-full max-w-sm shrink-0">
        <button
          onClick={handleNext}
          disabled={!isStepValid() || isGenerating}
          className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black p-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          {isGenerating ? (
            <><Loader2 className="animate-spin" size={20} /> {t('diet.generating', 'Gerando sua dieta com IA...')}</>
          ) : step === activeSteps.length - 1 ? (
            <><Sparkles size={20} /> {t('diet.generateBtn', 'Gerar minha dieta')}</>
          ) : (
            <>{t('general.continue', 'Continuar')} <ArrowRight size={20} /></>
          )}
        </button>
        <div className="mt-4"><FooterBrand direction="flex-col" textSize="text-xs" textColor="text-gray-500" /></div>
      </div>
    </div>
  );
}