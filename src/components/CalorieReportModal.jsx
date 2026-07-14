// src/features/calendar/components/CalorieReportModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Flame, Utensils, TrendingUp, Trophy, Info } from 'lucide-react';
import { db } from '../config/dexieDb';
import { getDailyCalorieBalance, getFocusStreak } from '../utils/dietManager';
import { toDateKey } from '../utils/calendarUtils';
import { useLanguage } from '../contexts/LanguageContext';

export default function CalorieReportModal({ dateKey, onClose }) {
  const { t, uiLang } = useLanguage();
  const targetDate = dateKey || toDateKey(new Date());

  const [balance, setBalance] = useState(null);
  const [focus, setFocus] = useState({ streak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const profile = (await db.fitnessProfile.get(1)) || {};
      const b = await getDailyCalorieBalance(targetDate, profile);
      const f = await getFocusStreak();
      if (!cancelled) {
        setBalance(b);
        setFocus(f);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [targetDate]);

  const formattedDate = new Date(targetDate + 'T00:00:00').toLocaleDateString(uiLang, {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 bg-orange-500/15 text-orange-400 rounded-xl shrink-0">
              <Flame size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-black text-white truncate">
                {t('calorie.reportTitle', 'Relatório de Calorias')}
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide truncate">
                {formattedDate}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-full shrink-0">
            <X size={18} />
          </button>
        </div>

        {loading || !balance ? (
          <p className="text-gray-500 text-sm text-center py-10">{t('general.loading', 'Carregando...')}</p>
        ) : (
          <div className="space-y-4">
            {/* QUEIMADAS x CONSUMIDAS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <Flame size={18} className="text-orange-400 mb-2" />
                <p className="text-[10px] text-gray-500 font-bold uppercase">{t('calorie.burned', 'Queimadas')}</p>
                <p className="text-xl font-black text-white">{Math.round(balance.burned)} <span className="text-xs font-bold text-gray-500">kcal</span></p>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <Utensils size={18} className="text-emerald-400 mb-2" />
                <p className="text-[10px] text-gray-500 font-bold uppercase">{t('calorie.consumed', 'Consumidas')}</p>
                <p className="text-xl font-black text-white">{Math.round(balance.consumed)} <span className="text-xs font-bold text-gray-500">kcal</span></p>
              </div>
            </div>

            {balance.consumed === 0 && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2">
                <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-200 leading-relaxed">
                  {t('calorie.noDietData', 'Nenhum registro de dieta ainda. Em breve: scanner de alimentos por IA.')}
                </p>
              </div>
            )}

            {/* TDEE E META */}
            <div className="bg-gray-800/60 rounded-2xl p-4 border border-gray-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                  <TrendingUp size={13} /> {t('calorie.tdee', 'Gasto diário estimado (TDEE)')}
                </span>
                <span className="text-sm font-black text-white">{Math.round(balance.tdee)} kcal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-bold">{t('calorie.dailyTarget', 'Meta diária')}</span>
                <span className="text-sm font-black text-white">{Math.round(balance.dailyTarget)} kcal</span>
              </div>
              <div className="h-px bg-gray-700 my-1" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-bold">{t('calorie.netBalance', 'Saldo líquido do dia')}</span>
                <span className={`text-sm font-black ${balance.netCalories <= balance.dailyTarget ? 'text-emerald-400' : 'text-red-400'}`}>
                  {balance.netCalories >= 0 ? '+' : ''}{Math.round(balance.netCalories)} kcal
                </span>
              </div>
            </div>

            {/* STATUS */}
            <div className={`rounded-2xl p-4 border flex items-center gap-3 ${
              balance.status === 'on_track' ? 'bg-emerald-500/10 border-emerald-500/30' :
              balance.status === 'over_budget' ? 'bg-red-500/10 border-red-500/30' :
              'bg-gray-800 border-gray-700'
            }`}>
              <Trophy size={22} className={
                balance.status === 'on_track' ? 'text-emerald-400' :
                balance.status === 'over_budget' ? 'text-red-400' : 'text-gray-500'
              } />
              <div>
                <p className="text-sm font-bold text-white">
                  {balance.status === 'on_track' && t('calorie.statusOnTrack', 'Dentro da meta')}
                  {balance.status === 'over_budget' && t('calorie.statusOverBudget', 'Acima do déficit planejado')}
                  {balance.status === 'no_data' && t('calorie.statusNoData', 'Sem dados suficientes hoje')}
                </p>
                <p className="text-[11px] text-gray-400">
                  {t('calorie.focusStreak', 'Dias em foco')}: <span className="font-bold text-white">{focus.streak}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 py-3.5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition-colors"
        >
          {t('general.close', 'Fechar')}
        </button>
      </div>
    </div>
  );
}