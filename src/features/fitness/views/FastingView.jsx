// src/features/fitness/views/FastingView.jsx
import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Timer, Flame, CheckCircle2, XCircle, History } from 'lucide-react';
import { db } from '../../../config/dexieDb';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  FASTING_PROTOCOLS, getActiveFast, startFast, endFast, cancelFast, calculateFastingCaloriesBurned
} from '../../../utils/fitnessManager';
import BackButton from '../../../components/BackButton';
import FooterBrand from '../../../components/FooterBrand';

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function FastingView() {
  const { t } = useLanguage();
  const profile = useLiveQuery(() => db.fitnessProfile.get(1), [], null);
  const activeFast = useLiveQuery(() => getActiveFast(), [], undefined);
  const history = useLiveQuery(() => db.fastingSessions.orderBy('startTime').reverse().limit(5).toArray(), [], []) || [];

  const [now, setNow] = useState(Date.now());
  const [selectedProtocol, setSelectedProtocol] = useState('16:8');
  const [resultModal, setResultModal] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const isLoadingActiveFast = activeFast === undefined;
  const elapsedMs = activeFast ? now - new Date(activeFast.startTime).getTime() : 0;
  const targetMs = activeFast ? activeFast.targetHours * 60 * 60 * 1000 : 0;
  const progressPercent = activeFast ? Math.min(100, (elapsedMs / targetMs) * 100) : 0;
  const hoursElapsed = elapsedMs / (1000 * 60 * 60);
  const estimatedCalories = activeFast ? calculateFastingCaloriesBurned(hoursElapsed, profile) : 0;

  const handleStart = async () => {
    await startFast(selectedProtocol);
  };

  const handleEnd = async () => {
    if (!activeFast) return;
    const result = await endFast(activeFast.id, profile);
    setResultModal(result);
  };

  const handleCancel = async () => {
    if (!activeFast) return;
    await cancelFast(activeFast.id);
  };

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 min-h-screen -mt-5 -mb-20">
      <BackButton to="/fitness" label={t('general.back', 'Voltar')} />

      <div className="flex items-center gap-3 my-6">
        <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl"><Timer size={28} /></div>
        <div>
          <h2 className="text-2xl font-black text-white">{t('fasting.title', 'Jejum Intermitente')}</h2>
          <p className="text-xs text-gray-500 font-bold uppercase">{t('fasting.subtitle', 'Controle e estimativa de calorias')}</p>
        </div>
      </div>

      {isLoadingActiveFast ? (
        <p className="text-gray-500 text-sm text-center py-10">{t('general.loading', 'Carregando...')}</p>
      ) : activeFast ? (
        <div className="bg-gray-800 rounded-3xl border border-indigo-500/30 p-6 mb-6 shadow-xl text-center">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
            {t('fasting.protocolLabel', 'Protocolo')}: {activeFast.protocol}
          </p>
          <h3 className="text-4xl font-black text-white mb-4 tabular-nums">{formatDuration(elapsedMs)}</h3>

          <div className="w-full bg-gray-900 rounded-full h-3 mb-2 overflow-hidden">
            <div className="bg-indigo-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-xs text-gray-400 font-bold mb-6">
            {Math.round(progressPercent)}% {t('fasting.ofGoal', 'da meta de')} {activeFast.targetHours}h
          </p>

          <div className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 py-2 px-4 rounded-xl mb-6 w-max mx-auto">
            <Flame size={16} className="text-green-400" />
            <span className="text-green-400 font-bold text-sm">~{estimatedCalories} kcal {t('fasting.burnedSoFar', 'queimadas até agora')}</span>
          </div>

          <div className="flex gap-3">
            <button onClick={handleCancel} className="flex-1 py-3.5 rounded-2xl bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm">
              {t('fasting.cancelFast', 'Cancelar')}
            </button>
            <button onClick={handleEnd} className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm">
              {t('fasting.endFast', 'Encerrar Jejum')}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-3xl border border-gray-700 p-6 mb-6 shadow-xl">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t('fasting.chooseProtocol', 'Escolha um protocolo')}</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.keys(FASTING_PROTOCOLS).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedProtocol(p)}
                className={`p-4 rounded-2xl border-2 font-black transition-all ${
                  selectedProtocol === p ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-400'
                }`}
              >
                {p}
                <p className="text-[10px] font-bold text-gray-500 mt-1">{FASTING_PROTOCOLS[p].fastHours}h {t('fasting.fasting', 'jejum')}</p>
              </button>
            ))}
          </div>
          <button onClick={handleStart} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95">
            {t('fasting.startFast', 'Iniciar Jejum')}
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <History size={16} className="text-gray-500" />
        <h3 className="font-bold text-gray-400 uppercase tracking-wider text-sm">{t('fasting.history', 'Histórico Recente')}</h3>
      </div>
      <div className="space-y-2">
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">{t('fasting.noHistory', 'Nenhum jejum registrado ainda.')}</p>
        ) : (
          history.map((h) => (
            <div key={h.id} className="bg-gray-800/60 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {h.completed ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-500" />}
                <div>
                  <p className="text-sm font-bold text-white">{h.protocol}</p>
                  <p className="text-[10px] text-gray-500">{new Date(h.startTime).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-green-400">{h.caloriesBurnedEstimate || 0} kcal</span>
            </div>
          ))
        )}
      </div>

      <div className="shrink-0 mt-10"><FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" /></div>

      {resultModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-indigo-500/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-indigo-400" size={32} />
            </div>
            <h3 className="text-xl font-black text-white mb-2">
              {resultModal.metGoal ? t('fasting.goalMet', 'Meta Atingida!') : t('fasting.fastEnded', 'Jejum Encerrado')}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {t('fasting.duration', 'Duração')}: {resultModal.hoursElapsed.toFixed(1)}h
            </p>
            <div className="flex items-center justify-center gap-2 bg-green-500/10 py-2 px-4 rounded-xl mb-6 w-max mx-auto">
              <Flame size={16} className="text-green-400" />
              <span className="text-green-400 font-bold">+{resultModal.caloriesBurnedEstimate} kcal</span>
            </div>
            <button onClick={() => setResultModal(null)} className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
              {t('confirm', 'Confirmar')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}