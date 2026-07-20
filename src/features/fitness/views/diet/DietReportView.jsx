// src/features/fitness/views/diet/DietReportView.jsx
import React, { useState, useEffect } from 'react';
import { BarChart3, Droplets, ChevronDown, ChevronUp, Flame, Calendar } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { getDietHistoryReport } from '../../../../utils/dietManager';
import BackButton from '../../../../components/BackButton';
import FooterBrand from '../../../../components/FooterBrand';

const PERIOD_OPTIONS = [
  { days: 7, labelKey: 'diet.period7' },
  { days: 14, labelKey: 'diet.period14' },
  { days: 30, labelKey: 'diet.period30' },
];

export default function DietReportView() {
  const { t, uiLang } = useLanguage();
  const [period, setPeriod] = useState(7);
  const [report, setReport] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDate, setExpandedDate] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      const data = await getDietHistoryReport(period);
      if (!cancelled) {
        setReport(data);
        setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [period]);

  const formatDayLabel = (dateKey) => {
    try {
      const d = new Date(dateKey + 'T00:00:00');
      return new Intl.DateTimeFormat(uiLang, { day: '2-digit', month: 'short' }).format(d);
    } catch {
      return dateKey;
    }
  };

  const formatFullDate = (dateKey) => {
    try {
      const d = new Date(dateKey + 'T00:00:00');
      return new Intl.DateTimeFormat(uiLang, { weekday: 'long', day: '2-digit', month: 'long' }).format(d);
    } catch {
      return dateKey;
    }
  };

  // Ordena do mais antigo para o mais recente para o gráfico ficar cronológico
  const chartData = [...report].reverse();

  const maxCalorieValue = Math.max(
    ...chartData.map((d) => Math.max(d.consumed, d.target || 0)),
    1 // evita divisão por zero
  );

  const maxWaterValue = Math.max(...chartData.map((d) => d.water), 1);

  // Médias do período (só considerando dias com algum registro)
  const daysWithData = report.filter((d) => d.consumed > 0 || d.water > 0);
  const avgCalories = daysWithData.length
    ? Math.round(daysWithData.reduce((sum, d) => sum + d.consumed, 0) / daysWithData.length)
    : 0;
  const avgWater = daysWithData.length
    ? Math.round(daysWithData.reduce((sum, d) => sum + d.water, 0) / daysWithData.length)
    : 0;

  const toggleExpand = (dateKey) => {
    setExpandedDate((prev) => (prev === dateKey ? null : dateKey));
  };

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 min-h-screen -mt-5 -mb-20">
      <BackButton to="/fitness/diet" label={t('general.back', 'Voltar')} />

      <div className="flex items-center gap-3 my-6">
        <div className="p-3 bg-orange-500/20 text-orange-400 rounded-2xl">
          <BarChart3 size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{t('diet.reportTitle', 'Relatório de Consumo')}</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
            {t('diet.reportSubtitle', 'Acompanhe sua evolução ao longo do tempo')}
          </p>
        </div>
      </div>

      {/* FILTRO DE PERÍODO */}
      <div className="flex gap-2 mb-6">
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.days}
            onClick={() => setPeriod(opt.days)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
              period === opt.days
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {t(opt.labelKey, `${opt.days} dias`)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-gray-500 text-sm text-center py-10">{t('general.loading', 'Carregando...')}</p>
      ) : (
        <>
          {/* MÉDIAS DO PERÍODO */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Flame size={13} className="text-orange-400" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">{t('diet.avgCalories', 'Média de Calorias')}</span>
              </div>
              <p className="text-xl font-black text-white">{avgCalories} <span className="text-xs font-bold text-gray-500">kcal</span></p>
            </div>
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Droplets size={13} className="text-sky-400" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">{t('diet.avgWater', 'Média de Água')}</span>
              </div>
              <p className="text-xl font-black text-white">{(avgWater / 1000).toFixed(1)} <span className="text-xs font-bold text-gray-500">L</span></p>
            </div>
          </div>

          {/* GRÁFICO DE CALORIAS (barras CSS) */}
          <div className="bg-gray-800 rounded-3xl border border-gray-700 p-5 mb-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Flame size={16} className="text-orange-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wide">
                {t('diet.caloriesChart', 'Calorias Consumidas vs Meta')}
              </h3>
            </div>

            <div className="flex items-end gap-1.5 sm:gap-2 h-40 overflow-x-auto pb-1">
              {chartData.map((day) => {
                const consumedPct = Math.min(100, (day.consumed / maxCalorieValue) * 100);
                const targetPct = day.target ? Math.min(100, (day.target / maxCalorieValue) * 100) : null;
                const isOver = day.target && day.consumed > day.target;

                return (
                  <div key={day.date} className="flex flex-col items-center gap-1 shrink-0 w-9 sm:w-10">
                    <div className="relative w-full h-32 bg-gray-900/60 rounded-lg overflow-hidden flex items-end">
                      {/* Linha da meta */}
                      {targetPct !== null && (
                        <div
                          className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-500/70 z-10"
                          style={{ bottom: `${targetPct}%` }}
                        />
                      )}
                      {/* Barra de consumo */}
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isOver ? 'bg-red-500' : day.consumed > 0 ? 'bg-emerald-500' : 'bg-gray-700'
                        }`}
                        style={{ height: `${day.consumed > 0 ? Math.max(consumedPct, 3) : 0}%` }}
                      />
                    </div>
                    <span className="text-[8px] font-bold text-gray-500 uppercase whitespace-nowrap">
                      {formatDayLabel(day.date)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700/60">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span className="text-[10px] text-gray-400 font-bold">{t('diet.withinTarget', 'Dentro da meta')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
                <span className="text-[10px] text-gray-400 font-bold">{t('diet.overTarget', 'Acima da meta')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-0.5 border-t-2 border-dashed border-yellow-500" />
                <span className="text-[10px] text-gray-400 font-bold">{t('diet.targetLine', 'Meta')}</span>
              </div>
            </div>
          </div>

          {/* GRÁFICO DE ÁGUA (barras CSS) */}
          <div className="bg-gray-800 rounded-3xl border border-gray-700 p-5 mb-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Droplets size={16} className="text-sky-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wide">
                {t('diet.waterChart', 'Água Consumida por Dia')}
              </h3>
            </div>

            <div className="flex items-end gap-1.5 sm:gap-2 h-32 overflow-x-auto pb-1">
              {chartData.map((day) => {
                const pct = Math.min(100, (day.water / maxWaterValue) * 100);
                return (
                  <div key={day.date} className="flex flex-col items-center gap-1 shrink-0 w-9 sm:w-10">
                    <div className="relative w-full h-24 bg-gray-900/60 rounded-lg overflow-hidden flex items-end">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${day.water > 0 ? 'bg-sky-500' : 'bg-gray-700'}`}
                        style={{ height: `${day.water > 0 ? Math.max(pct, 3) : 0}%` }}
                      />
                    </div>
                    <span className="text-[8px] font-bold text-gray-500 uppercase whitespace-nowrap">
                      {formatDayLabel(day.date)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LISTA EXPANSÍVEL POR DIA */}
          <h3 className="font-bold text-gray-400 mb-3 uppercase tracking-wider text-xs flex items-center gap-1.5">
            <Calendar size={13} /> {t('diet.dailyBreakdown', 'Detalhamento Diário')}
          </h3>
          <div className="space-y-2">
            {report.length === 0 ? (
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 text-center text-gray-500 text-sm">
                {t('diet.noHistory', 'Nenhum registro neste período ainda.')}
              </div>
            ) : (
              report.map((day) => {
                const isExpanded = expandedDate === day.date;
                const isOver = day.target && day.consumed > day.target;
                const hasData = day.consumed > 0 || day.water > 0;

                return (
                  <div key={day.date} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleExpand(day.date)}
                      className="w-full p-4 flex items-center justify-between text-left"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white capitalize truncate">{formatFullDate(day.date)}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs font-bold ${isOver ? 'text-red-400' : hasData ? 'text-emerald-400' : 'text-gray-500'}`}>
                            {day.consumed} kcal {day.target ? `/ ${day.target}` : ''}
                          </span>
                          {day.water > 0 && (
                            <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                              <Droplets size={11} /> {(day.water / 1000).toFixed(1)}L
                            </span>
                          )}
                        </div>
                      </div>
                      {day.entries?.length > 0 ? (
                        isExpanded ? <ChevronUp className="text-gray-500 shrink-0" size={18} /> : <ChevronDown className="text-gray-500 shrink-0" size={18} />
                      ) : (
                        <span className="text-[10px] text-gray-600 shrink-0">{t('diet.noEntries', 'Sem registros')}</span>
                      )}
                    </button>

                    {isExpanded && day.entries?.length > 0 && (
                      <div className="px-4 pb-4 space-y-2 border-t border-gray-700/60 pt-3">
                        {day.entries.map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between bg-gray-900/50 rounded-xl px-3 py-2">
                            <span className="text-xs text-gray-300 font-medium truncate pr-2">{entry.foodName}</span>
                            <span className="text-xs font-bold text-orange-400 shrink-0">{entry.calories} kcal</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      <div className="shrink-0 mt-10">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>
    </div>
  );
}