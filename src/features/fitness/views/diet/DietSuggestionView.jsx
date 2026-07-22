// src/features/fitness/views/diet/DietSuggestionView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Loader2, Sparkles, Plus, Wallet, Search, Check, ShoppingBag, Utensils } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { generateMealSuggestions } from '../../../../services/aiService';
import { getDietProfile, addDietEntry } from '../../../../utils/dietManager';
import BackButton from '../../../../components/BackButton';
import FooterBrand from '../../../../components/FooterBrand';

export default function DietSuggestionView() {
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();

  const [dietProfile, setDietProfile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [savedItem, setSavedItem] = useState(null);

  // Filtros Opcionais
  const [filters, setFilters] = useState({
    mealType: '',
    craving: '',
    makeOrBuy: '',
    ingredients: '',
    budget: ''
  });

  useEffect(() => {
    const load = async () => {
      const p = await getDietProfile();
      setDietProfile(p);
    };
    load();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    setSavedItem(null);
    try {
      const response = await generateMealSuggestions(filters, dietProfile, uiLang);
      setResult(response.suggestions || []);
    } catch (err) {
      console.error('Erro ao gerar sugestões:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToDiet = async (suggestion, index) => {
    try {
      await addDietEntry({
        foodName: suggestion.name,
        calories: suggestion.estimatedCalories,
        source: 'ai_suggestion',
      });
      setSavedItem(index);
      setTimeout(() => navigate('/fitness/diet'), 1500);
    } catch (err) {
      console.error('Erro ao salvar no diário:', err);
    }
  };

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 min-h-screen -mt-5 -mb-20">
      <BackButton to="/fitness/diet" label={t('general.back', 'Voltar')} />

      <div className="flex items-center gap-3 my-6">
        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
          <ChefHat size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{t('diet.suggesterTitle', 'O Que Comer?')}</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
            {t('diet.suggesterSubtitle', 'Deixe a IA sugerir algo que cabe na dieta')}
          </p>
        </div>
      </div>

      {!result && !isGenerating && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-sm text-gray-400 mb-2">
            {t('diet.suggesterDesc', 'Preencha o que quiser ou deixe tudo em branco para uma sugestão surpresa baseada no seu perfil.')}
          </p>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              {t('diet.mealType', 'Tipo de Refeição')}
            </label>
            <select
              value={filters.mealType}
              onChange={(e) => setFilters({ ...filters, mealType: e.target.value })}
              className="w-full bg-gray-900 text-white p-3 rounded-xl border border-gray-700 focus:border-emerald-500 outline-none text-sm"
            >
              <option value="">{t('diet.anyMeal', 'Qualquer (Surpresa)')}</option>
              <option value="Café da manhã">Café da manhã</option>
              <option value="Almoço">Almoço</option>
              <option value="Lanche da tarde">Lanche da tarde</option>
              <option value="Jantar">Jantar</option>
              <option value="Ceia / Lanche noturno">Ceia / Lanche noturno</option>
            </select>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              {t('diet.craving', 'Vontade Específica (Ex: Pizza, Pastel, Doce)')}
            </label>
            <input
              type="text"
              value={filters.craving}
              onChange={(e) => setFilters({ ...filters, craving: e.target.value })}
              placeholder={t('diet.cravingPlaceholder', 'O que você quer comer?')}
              className="w-full bg-gray-900 text-white p-3 rounded-xl border border-gray-700 focus:border-emerald-500 outline-none text-sm"
            />
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              {t('diet.preparation', 'Preparo')}
            </label>
            <div className="flex gap-2">
              {['Indiferente', 'Fazer em casa', 'Comprar pronto'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilters({ ...filters, makeOrBuy: opt === 'Indiferente' ? '' : opt })}
                  className={`flex-1 p-2 rounded-xl text-xs font-bold transition-all border ${
                    (filters.makeOrBuy === opt || (opt === 'Indiferente' && !filters.makeOrBuy))
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-gray-900 border-gray-700 text-gray-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase mb-2">
                <Wallet size={14} /> {t('diet.budget', 'Orçamento')}
              </label>
              <input
                type="text"
                value={filters.budget}
                onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                placeholder="Ex: R$30 ou 10€"
                className="w-full bg-gray-900 text-white p-3 rounded-xl border border-gray-700 focus:border-emerald-500 outline-none text-sm"
              />
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase mb-2">
                <Search size={14} /> {t('diet.ingredients', 'Ingredientes')}
              </label>
              <input
                type="text"
                value={filters.ingredients}
                onChange={(e) => setFilters({ ...filters, ingredients: e.target.value })}
                placeholder="Ex: Frango, ovo..."
                className="w-full bg-gray-900 text-white p-3 rounded-xl border border-gray-700 focus:border-emerald-500 outline-none text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full mt-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Sparkles size={20} />
            {t('diet.generateSuggestions', 'Gerar Ideias')}
          </button>
        </div>
      )}

      {isGenerating && (
        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 flex flex-col items-center text-center gap-4 mt-10 shadow-lg">
          <Loader2 className="text-emerald-400 animate-spin" size={40} />
          <p className="text-white font-bold">{t('diet.thinking', 'O chef IA está pensando...')}</p>
          <p className="text-xs text-gray-500">{t('diet.thinkingDesc', 'Cruzando sua dieta com seus desejos.')}</p>
        </div>
      )}

      {result && !isGenerating && (
        <div className="space-y-4 animate-fade-in">
          <button
            onClick={() => setResult(null)}
            className="text-xs font-bold text-emerald-400 mb-4 flex items-center gap-1"
          >
            ← {t('diet.changeFilters', 'Mudar filtros')}
          </button>

          {result.map((item, idx) => (
            <div key={idx} className="bg-gray-800 border border-gray-700 rounded-3xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-emerald-500/10 rounded-bl-2xl">
                <p className="text-sm font-black text-emerald-400">{item.estimatedCalories} kcal</p>
              </div>
              
              <h3 className="text-lg font-black text-white pr-16 mb-2">{item.name}</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">{item.description}</p>
              
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-700 text-[10px] font-bold text-gray-400 uppercase">
                  <Wallet size={12} /> {item.priceNote}
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-700 text-[10px] font-bold text-gray-400 uppercase">
                  {item.type?.toLowerCase().includes('comprar') ? <ShoppingBag size={12} /> : <Utensils size={12} />} 
                  {item.type}
                </span>
              </div>

              <button
                onClick={() => handleSaveToDiet(item, idx)}
                disabled={savedItem !== null}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  savedItem === idx 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {savedItem === idx ? (
                  <><Check size={18} /> {t('diet.savedToLog', 'Registrado!')}</>
                ) : (
                  <><Plus size={18} /> {t('diet.eatThis', 'Vou comer isso')}</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="shrink-0 mt-10">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>
    </div>
  );
}