// src/features/settings/views/SettingsView.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  User, Flame, Dumbbell, Receipt, CalendarCheck, Globe, Bell, Moon, Mic, Zap,
  HardDrive, Download, Upload, Cloud, CloudDownload, LogOut, RefreshCw, Trash2,
  AlertTriangle, X, Wallet, ListChecks, Hourglass, Footprints, HeartPulse,
  ArrowDownToLine, ArrowUpFromLine as ArrowUpFromLineIcon, ToggleLeft
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import BackButton from '../../../components/BackButton';
import { db } from '../../../config/dexieDb';
import { useLiveQuery } from 'dexie-react-hooks';
import FooterBrand from '../../../components/FooterBrand';
import PigeonAvatar from '../../../components/PigeonAvatar';

import { auth, googleProvider } from '../../../config/firebaseConfig';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

import { pushToCloud, pullFromCloud, deleteCloudData, hasCloudBackup, getCloudLastSync } from '../../../utils/cloudSync';
import { calculateLevel, repairUserProfile } from '../../../utils/xpManager';
import { todayKey } from '../../../utils/calendarUtils';
import { pullHealthData, pushHealthData, isHealthBridgeNative } from '../../../utils/healthSync';
import { getExchangeRateBRLtoEUR, convertCurrency, formatCurrencyValue } from '../../../utils/currencyManager';
import { useFitness } from '../../../contexts/FitnessContext';

export default function SettingsView() {
  const { t, userName, uiLang, changeLanguage, languageStreak } = useLanguage();
  const today = new Intl.DateTimeFormat(uiLang, { dateStyle: 'full' }).format(new Date());

  const [permission, setPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'default');
  const [micPermission, setMicPermission] = useState('prompt');

  const [authUser, setAuthUser] = useState(null);
  const [cloudLastSync, setCloudLastSync] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef(null);

  const [notifLang, setNotifLang] = useState(true);
  const [notifTasks, setNotifTasks] = useState(true);
  const [notifFitness, setNotifFitness] = useState(false);
  const [notifFitnessReminders, setNotifFitnessReminders] = useState(false);

  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [lastAutoSync, setLastAutoSync] = useState(null);

  const [isHealthSyncing, setIsHealthSyncing] = useState(false);
  const [healthLastSync, setHealthLastSync] = useState(null);
  const [healthResultMsg, setHealthResultMsg] = useState(null);

  const [cloudChoiceModal, setCloudChoiceModal] = useState({ open: false, user: null, remoteDate: null });
  const [importConfirmModal, setImportConfirmModal] = useState({ open: false, data: null, exportedAt: null });

  // ==========================================
  // PERFIL / XP (já existente)
  // ==========================================
  const userProfile = useLiveQuery(() => db.userProfile.get(1)) || {
    totalXp: 0,
    equippedSkin: 'none'
  };
  const englishXP = userProfile.totalXp || 0;
  const userLevel = calculateLevel(englishXP);
  const fitnessXP = parseInt(localStorage.getItem('fitnessXP') || '0', 10);

  // ==========================================
  // NOVO: FITNESS — ofensiva/streak direto do Dexie (fonte real, não localStorage)
  // ==========================================
  const fitnessProfile = useLiveQuery(() => db.fitnessProfile.get(1)) || { caloriesBurnedTotal: 0 };
  const { fitnessStreak, isFitnessStreakActive } = useFitness();

  // ==========================================
  // NOVO: FINANÇAS — resumo (receitas, gastos, saldo)
  // ==========================================
  const financeTransactions = useLiveQuery(() => db.financeTransactions.toArray()) || [];
    const primaryCurrency = useLiveQuery(async () => {
      const settings = await db.appSettings.get(1);
      return settings?.primaryCurrency || 'BRL';
    }) || 'BRL';
    const [exchangeRateSettings, setExchangeRateSettings] = useState(0.17);

    useEffect(() => {
      getExchangeRateBRLtoEUR().then(setExchangeRateSettings);
    }, []);

  const financeSummary = React.useMemo(() => {
      let income = 0, expense = 0;
      financeTransactions.forEach((tx) => {
        const txCurrency = tx.currency || 'BRL';
        const converted = convertCurrency(tx.amount, txCurrency, primaryCurrency, exchangeRateSettings);
        if (tx.type === 'income') income += converted;
        else expense += converted;
      });
      return { income, expense, balance: income - expense };
    }, [financeTransactions, primaryCurrency, exchangeRateSettings]);

  const formatCurrency = (val) => formatCurrencyValue(val, primaryCurrency);

  // ==========================================
  // NOVO: CALENDÁRIO — tarefas pendentes, lembretes ativos, contadores ativos
  // ==========================================
  const allTasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const counters = useLiveQuery(() => db.counters.toArray()) || [];
  const calendarSummary = React.useMemo(() => {
    const pendingTasks = allTasks.filter(tk => tk.type !== 'reminder' && !tk.done).length;
    const activeReminders = allTasks.filter(tk => tk.type === 'reminder' && !tk.done).length;
    const activeCounters = counters.length;
    // Próximo evento (tarefa/lembrete não concluído mais próximo de hoje, incluindo hoje em diante)
    const tKey = todayKey();
    const upcoming = allTasks
      .filter(tk => !tk.done && tk.date >= tKey)
      .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))[0];
    return { pendingTasks, activeReminders, activeCounters, upcoming };
  }, [allTasks, counters]);

  useEffect(() => {
    repairUserProfile();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user) {
        const lastSync = await getCloudLastSync(user.uid);
        setCloudLastSync(lastSync);
      } else {
        setCloudLastSync(null);
      }
    });

    const loadSettingsAndStats = async () => {
      const settings = await db.appSettings.get(1) || { id: 1 };
      setNotifLang(settings.notifLang ?? true);
      setNotifTasks(settings.notifTasks ?? true);
      setNotifFitness(settings.notifFitness ?? false);
      setNotifFitnessReminders(settings.notifFitnessReminders ?? false);
      setAutoSyncEnabled(settings.autoSyncEnabled ?? true);
      setLastAutoSync(settings.lastAutoSync || null);
      setHealthLastSync(settings.healthLastSync || null);

      let currentMicState = 'prompt';
      if (navigator.permissions) {
        try {
           const mStatus = await navigator.permissions.query({ name: 'microphone' });
           currentMicState = mStatus.state;
           mStatus.onchange = () => {
              setMicPermission(mStatus.state);
              if (mStatus.state === 'denied') {
                  db.appSettings.update(1, { micPermissionGranted: false });
              }
           };
        } catch(e) {}
      }

      if (currentMicState === 'prompt' && settings.micPermissionGranted) {
         setMicPermission('granted');
      } else {
         setMicPermission(currentMicState);
      }
    };
    loadSettingsAndStats();

    return () => unsubscribe();
  }, []);

  const handleToggleChange = async (key, setter, value) => {
    setter(value);
    await db.appSettings.update(1, { [key]: value });
  };

  const Toggle = ({ checked, onChange, disabled = false }) => (
      <button
        onClick={() => !disabled && onChange && onChange(!checked)}
        disabled={disabled}
        className={`w-11 h-6 rounded-full p-1 transition-all duration-300 shrink-0 ${
          disabled ? 'bg-gray-800 cursor-not-allowed opacity-50' : checked ? 'bg-blue-600' : 'bg-gray-700'
        }`}
      >
        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    );

  const handlePermission = async () => {
    if (permission === 'granted') {
      alert(t('settings.revokeAlert', "Para remover, vá nas configurações do seu navegador."));
    } else {
      const status = await Notification.requestPermission();
      setPermission(status);
    }
  };

  const handleMicPermission = async () => {
    if (micPermission === 'granted') {
      alert(t('settings.revokeAlert', "Para remover, vá nas configurações do seu navegador."));
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
        setMicPermission('granted');
        const settings = await db.appSettings.get(1) || { id: 1 };
        settings.micPermissionGranted = true;
        await db.appSettings.put(settings);
      } catch(e) {
        setMicPermission('denied');
      }
    }
  };

  // ==========================================
  // NOVO: TOGGLE DE SINCRONIZAÇÃO AUTOMÁTICA
  // ==========================================
  const handleToggleAutoSync = async (value) => {
    if (!authUser) return; // sem conta conectada, o toggle não deve fazer nada
    try {
      const settings = await db.appSettings.get(1) || { id: 1 };
      const updated = { ...settings, id: 1, autoSyncEnabled: value };
      await db.appSettings.put(updated);
      setAutoSyncEnabled(value);

      // Força uma sincronização imediata ao ativar, em vez de esperar até
      // 5 minutos pelo próximo ciclo automático — isso corrige a sensação
      // de "não fez nada" ao apertar o botão.
      if (value) {
        setIsSyncing(true);
        try {
          await pushToCloud(authUser.uid);
          const lastSync = await getCloudLastSync(authUser.uid);
          setCloudLastSync(lastSync);
        } finally {
          setIsSyncing(false);
        }
      }
    } catch (err) {
      console.error('Erro ao alternar sincronização automática:', err);
      // Reverte visualmente se falhou ao salvar
      setAutoSyncEnabled(!value);
    }
  };

  // ==========================================
  // NOVO: SINCRONIZAÇÃO COM APPLE HEALTH / GOOGLE FIT
  // ==========================================
  const handlePullHealthData = async () => {
    if (isHealthSyncing) return;
    setIsHealthSyncing(true);
    setHealthResultMsg(null);
    try {
      const result = await pullHealthData();
      const settings = await db.appSettings.get(1) || { id: 1 };
      settings.healthLastSync = new Date().toISOString();
      await db.appSettings.put(settings);
      setHealthLastSync(settings.healthLastSync);

      if (result.simulated) {
        setHealthResultMsg(
          result.alreadyCountedToday
            ? t('settings.healthPullSimulatedNoDup', `Estimativa de hoje: ${result.steps} passos, ${result.caloriesBurned} kcal (já contabilizado hoje). Conecte um app nativo para dados reais.`)
            : t('settings.healthPullSimulatedNew', `Trazido (estimativa): ${result.steps} passos, ${result.caloriesBurned} kcal. Conecte um app nativo para dados reais.`)
        );
      } else {
        setHealthResultMsg(t('settings.healthPullSuccessNew', `Dados trazidos: ${result.steps} passos, ${result.caloriesBurned} kcal.`));
      }
    } catch (err) {
      setHealthResultMsg(t('settings.healthError', 'Erro ao sincronizar com o app de saúde.'));
    } finally {
      setIsHealthSyncing(false);
    }
  };

  const handlePushHealthData = async () => {
    if (isHealthSyncing) return;
    setIsHealthSyncing(true);
    setHealthResultMsg(null);
    try {
      const result = await pushHealthData();
      const settings = await db.appSettings.get(1) || { id: 1 };
      settings.healthLastSync = new Date().toISOString();
      await db.appSettings.put(settings);
      setHealthLastSync(settings.healthLastSync);
      setHealthResultMsg(
        result.simulated
          ? t('settings.healthPushSimulatedNew', 'Simulado: em um app nativo, isso enviaria suas calorias para o Health/Fit.')
          : t('settings.healthPushSuccessNew', 'Dados enviados para o app de saúde com sucesso!')
      );
    } catch (err) {
      setHealthResultMsg(t('settings.healthError', 'Erro ao sincronizar com o app de saúde.'));
    } finally {
      setIsHealthSyncing(false);
    }
  };

  // ==========================================
  // FIREBASE (mantido igual ao original)
  // ==========================================
  const handleConnectGoogle = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const settings = await db.appSettings.get(1) || { id: 1 };
      if (!settings.userName) settings.userName = user.displayName.split(' ')[0];
      settings.userEmail = user.email;
      await db.appSettings.put(settings);

      const remoteExists = await hasCloudBackup(user.uid);

      if (remoteExists) {
        const remoteDate = await getCloudLastSync(user.uid);
        setCloudChoiceModal({ open: true, user, remoteDate });
      } else {
        await pushToCloud(user.uid);
        const lastSync = await getCloudLastSync(user.uid);
        setCloudLastSync(lastSync);
        alert(t('settings.connectSuccess', 'Conectado com sucesso! Seus dados agora podem ser sincronizados.'));
      }
    } catch (error) {
      console.error(error);
      const detail = error?.message ? `\n(${error.message})` : '';
      alert(t('settings.connectError', 'Erro ao conectar. Tente novamente.') + detail);
    } finally {
      setIsSyncing(false);
    }
  };

  const confirmUseCloudData = async () => {
    const user = cloudChoiceModal.user;
    setCloudChoiceModal({ open: false, user: null, remoteDate: null });
    setIsSyncing(true);
    try {
      await pullFromCloud(user.uid);
      const lastSync = await getCloudLastSync(user.uid);
      setCloudLastSync(lastSync);
      alert(t('settings.restoreSuccess', 'Dados restaurados da nuvem com sucesso! O aplicativo será recarregado.'));
      window.location.reload();
    } catch (error) {
      alert(t('settings.syncError', 'Erro ao sincronizar. Verifique sua conexão.') + (error?.message ? `\n(${error.message})` : ''));
      setIsSyncing(false);
    }
  };

  const confirmUseLocalData = async () => {
    const user = cloudChoiceModal.user;
    setCloudChoiceModal({ open: false, user: null, remoteDate: null });
    setIsSyncing(true);
    try {
      await pushToCloud(user.uid);
      const lastSync = await getCloudLastSync(user.uid);
      setCloudLastSync(lastSync);
      alert(t('settings.connectSuccess', 'Conectado com sucesso! Seus dados agora podem ser sincronizados.'));
    } catch (error) {
      alert(t('settings.connectError', 'Erro ao conectar. Tente novamente.') + (error?.message ? `\n(${error.message})` : ''));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnectGoogle = async () => {
      if (window.confirm(t('settings.disconnectConfirm', 'Tem certeza que deseja desconectar sua conta? Seus dados não serão mais sincronizados na nuvem.'))) {
        await signOut(auth);
        const settings = await db.appSettings.get(1);
        if (settings) {
          settings.userEmail = null;
          settings.autoSyncEnabled = false; // sem conta conectada, não faz sentido manter ativo
          await db.appSettings.put(settings);
          setAutoSyncEnabled(false);
        }
      }
    };

  const handleCloudSync = async () => {
    if (!authUser || isSyncing) return;
    setIsSyncing(true);
    try {
      await pushToCloud(authUser.uid);
      const lastSync = await getCloudLastSync(authUser.uid);
      setCloudLastSync(lastSync);
      alert(t('settings.syncSuccess', 'Progresso salvo na nuvem com sucesso!'));
    } catch (error) {
      alert(t('settings.syncError', 'Erro ao sincronizar. Verifique sua conexão.') + (error?.message ? `\n(${error.message})` : ''));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCloudRestore = async () => {
    if (!authUser || isSyncing) return;
    if (!window.confirm(t('settings.restoreConfirm', 'Isso substituirá todos os dados deste dispositivo pelos dados salvos na nuvem. Deseja continuar?'))) {
      return;
    }
    setIsSyncing(true);
    try {
      const found = await pullFromCloud(authUser.uid);
      if (found) {
        alert(t('settings.restoreSuccess', 'Dados restaurados da nuvem com sucesso! O aplicativo será recarregado.'));
        window.location.reload();
      } else {
        alert(t('settings.restoreEmpty', 'Nenhum backup foi encontrado na nuvem para esta conta.'));
      }
    } catch (error) {
      alert(t('settings.syncError', 'Erro ao sincronizar. Verifique sua conexão.') + (error?.message ? `\n(${error.message})` : ''));
    } finally {
      setIsSyncing(false);
    }
  };

  // ==========================================
  // EXPORTAÇÃO / IMPORTAÇÃO MANUAL (mantido igual)
  // ==========================================
  const handleExportData = async () => {
    try {
      await repairUserProfile();
      const data = {};
      for (const table of db.tables) {
        data[table.name] = await table.toArray();
      }
      const exportedAt = new Date().toISOString();
      const payload = { _meta: { exportedAt, app: 'LifeAccessApp' }, ...data };
      const jsonStr = JSON.stringify(payload);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lifeaccess_backup_${exportedAt.split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert(t('settings.exportSuccess', 'Backup exportado com sucesso!'));
    } catch (error) {
      console.error(error);
      alert(t('settings.exportError', 'Ocorreu um erro ao exportar seus dados.'));
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const exportedAt = parsed._meta?.exportedAt || null;
        const { _meta, ...tableData } = parsed;
        setImportConfirmModal({ open: true, data: tableData, exportedAt });
      } catch (error) {
        alert(t('settings.importError', 'Arquivo de backup inválido ou corrompido.'));
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const confirmImport = async () => {
    const { data } = importConfirmModal;
    setImportConfirmModal({ open: false, data: null, exportedAt: null });
    try {
      await db.transaction('rw', db.tables, async () => {
        for (const table of db.tables) {
          if (data[table.name]) {
            await table.clear();
            await table.bulkAdd(data[table.name]);
          }
        }
      });
      await repairUserProfile();
      if (authUser) await pushToCloud(authUser.uid);
      alert(t('settings.importSuccess', 'Backup restaurado com sucesso!'));
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(t('settings.importError', 'Arquivo inválido.'));
    }
  };

  const handleDeleteAllData = async () => {
    const warningMsg = authUser
      ? t('settings.deleteCloudWarn', 'ATENÇÃO: Como você está conectado, isso apagará todos os seus dados deste dispositivo E DA NUVEM permanentemente. Tem certeza absoluta?')
      : t('settings.deleteLocalWarn', 'ATENÇÃO: Isso apagará todos os seus dados deste dispositivo permanentemente. Tem certeza absoluta?');

    if (window.confirm(warningMsg)) {
      try {
        if (authUser) {
          await deleteCloudData(authUser.uid);
          await signOut(auth);
        }
        await Promise.all(db.tables.map(table => table.clear()));
        localStorage.clear();
        alert(t('settings.deleteSuccess', 'Todos os dados foram apagados.'));
        window.location.reload();
      } catch (error) {
        alert(t('settings.deleteError', 'Erro ao tentar apagar os dados.'));
      }
    }
  };

  const totalXP = englishXP + fitnessXP;
  const currentLevelXP = totalXP % 100;
  const nextLevelXP = 100;
  const progressPercentage = (currentLevelXP / nextLevelXP) * 100;

  const formatDate = (isoStr) => {
    if (!isoStr) return null;
    try {
      return new Intl.DateTimeFormat(uiLang, { dateStyle: 'short', timeStyle: 'short' }).format(new Date(isoStr));
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="w-full pt-8 animate-fade-in pb-20 px-4 -mb-20 -mt-5">
      <BackButton to="/" label={t('general.back', 'Voltar')} />

      <h2 className="text-3xl font-black text-white -mt-4 mb-6 tracking-wide">{t('settings.title')}</h2>

      {/* SEÇÃO DE PERFIL */}
      <div className="bg-gray-800 p-5 sm:p-6 rounded-3xl border border-gray-700 flex items-center gap-4 sm:gap-5 shadow-lg mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/20 rounded-full border-2 border-blue-500 flex items-center justify-center shrink-0">
             <PigeonAvatar accessory={userProfile.equippedSkin || 'none'} className="w-8 h-8 sm:w-10 sm:h-10 mt-1" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 truncate">
            <span className="truncate">{userName}</span>
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1 font-black shrink-0">
              {t('settings.level', 'Lv.')} {userLevel}
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-blue-400 font-semibold uppercase tracking-wider mb-2">LifeAccess Member</p>
          <div className="w-full pr-2">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {t('settings.progress', 'Progresso')}
              </span>
              <span className="text-[10px] font-bold text-blue-400">
                {currentLevelXP} / {nextLevelXP} {t('settings.xp', 'XP')}
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* VISÃO GERAL — AGORA COM DADOS REAIS DE TODOS OS MÓDULOS */}
      <h3 className="font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm">{t('settings.statsSection', 'Visão Geral')}</h3>
      <div className="grid grid-cols-2 gap-4 mb-8">

        {/* IDIOMAS */}
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-md flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="text-blue-400" size={20} />
            <h4 className="text-white font-bold">{t('settings.langStat', 'Idiomas')}</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1"><Flame size={14} className={languageStreak > 0 ? "text-orange-500" : "text-gray-500"}/> {t('settings.offensive', 'Ofensiva')}</span>
              <span className={`text-sm font-bold ${languageStreak > 0 ? 'text-orange-400' : 'text-gray-500'}`}>{languageStreak}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1"><Zap size={14} className={englishXP > 0 ? "text-yellow-400" : "text-gray-500"}/> {t('settings.xp', 'XP')}</span>
              <span className={`text-sm font-bold ${englishXP > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>{englishXP}</span>
            </div>
          </div>
        </div>

        {/* FITNESS — agora com ofensiva REAL vinda do db.fitnessStreak */}
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-md flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="text-green-400" size={20} />
            <h4 className="text-white font-bold">{t('settings.fitnessStat', 'Fitness')}</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1"><Flame size={14} className={fitnessStreak > 0 ? "text-orange-500" : "text-gray-500"}/> {t('settings.offensive', 'Ofensiva')}</span>
              <span className={`text-sm font-bold ${fitnessStreak > 0 ? 'text-orange-400' : 'text-gray-500'}`}>{fitnessStreak}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1"><Flame size={14} className="text-green-400"/> {t('settings.caloriesShort', 'Kcal')}</span>
              <span className="text-sm font-bold text-green-400">{Math.round(fitnessProfile.caloriesBurnedTotal || 0)}</span>
            </div>
          </div>
        </div>

        {/* FINANÇAS — agora com dados reais: receitas, gastos, saldo */}
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-md flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="text-red-400" size={20} />
            <h4 className="text-white font-bold">{t('settings.financeStat', 'Finanças')}</h4>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400">{t('finance.income', 'Receitas')}</span>
              <span className="text-xs font-bold text-green-400">{formatCurrency(financeSummary.income)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400">{t('finance.expense', 'Gastos')}</span>
              <span className="text-xs font-bold text-red-400">{formatCurrency(financeSummary.expense)}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-gray-700/70">
              <span className="text-[11px] text-gray-400 font-bold">{t('finance.balance', 'Saldo')}</span>
              <span className={`text-xs font-black ${financeSummary.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(financeSummary.balance)}
              </span>
            </div>
          </div>
        </div>

        {/* CALENDÁRIO — tarefas pendentes, lembretes ativos, contadores ativos (espremido para caber) */}
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-md flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <CalendarCheck className="text-purple-500" size={20} />
            <h4 className="text-white font-bold">{t('settings.tasksStat', 'Tarefas')}</h4>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400 flex items-center gap-1"><ListChecks size={11} /> {t('calendar.pendingTasks', 'Pendentes')}</span>
              <span className="text-xs font-bold text-purple-300">{calendarSummary.pendingTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400 flex items-center gap-1"><Bell size={11} /> {t('calendar.typeReminder', 'Lembretes')}</span>
              <span className="text-xs font-bold text-yellow-300">{calendarSummary.activeReminders}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-gray-700/70">
              <span className="text-[11px] text-gray-400 flex items-center gap-1"><Hourglass size={11} /> {t('calendar.myCounters', 'Contadores')}</span>
              <span className="text-xs font-bold text-blue-300">{calendarSummary.activeCounters}</span>
            </div>
          </div>
        </div>

        <div className="col-span-2 text-center text-xs text-gray-500 italic mt-[-4px]">
          {today.charAt(0).toUpperCase() + today.slice(1)}
        </div>
      </div>

      {/* PREFERÊNCIAS */}
      <h3 className="font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm">{t('settings.prefsSection')}</h3>
      <div className="bg-gray-800 rounded-3xl border border-gray-700 divide-y divide-gray-700 overflow-hidden shadow-lg mb-8">

        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Globe size={20} /></div>
            <span className="font-bold text-white">{t('settings.language')}</span>
          </div>
          <select
            value={uiLang}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-gray-900 text-white p-2 rounded-lg border border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="pt">Português</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Mic size={20} /></div>
            <span className="font-bold text-white">{t('settings.microphone', 'Microfone')}</span>
          </div>
          <button
            onClick={handleMicPermission}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
              micPermission === 'granted'
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            {micPermission === 'granted' ? t('notifications.remove', 'Remover') : t('notifications.allow', 'Permitir')}
          </button>
        </div>

        <div className="p-5">
           <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><Bell size={20} /></div>
              <span className="font-bold text-white">{t('settings.notifications')}</span>
            </div>
            <button
              onClick={handlePermission}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                permission === 'granted'
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              {permission === 'granted' ? t('notifications.remove', 'Remover') : t('notifications.allow', 'Permitir')}
            </button>
          </div>

          <div className="space-y-3 pl-12">
            <label className="flex justify-between items-center text-sm text-gray-300">
              {t('notifications.language')}
              <Toggle checked={notifLang} onChange={(val) => handleToggleChange('notifLang', setNotifLang, val)} />
            </label>
            <label className="flex justify-between items-center text-sm text-gray-300">
              {t('notifications.tasks')}
              <Toggle checked={notifTasks} onChange={(val) => handleToggleChange('notifTasks', setNotifTasks, val)} />
            </label>
            {/* NOVO: Notificação de treino (lembrete diário para treinar) */}
            <label className="flex justify-between items-center text-sm text-gray-300">
              {t('notifications.fitness')}
              <Toggle checked={notifFitness} onChange={(val) => handleToggleChange('notifFitness', setNotifFitness, val)} />
            </label>
            {/* NOVO: Notificação de lembretes específicos do fitness (ex: jejum terminando, meta de calorias) */}
            <label className="flex justify-between items-center text-sm text-gray-300">
              {t('notifications.fitnessReminders', 'Lembretes de Metas Fitness')}
              <Toggle checked={notifFitnessReminders} onChange={(val) => handleToggleChange('notifFitnessReminders', setNotifFitnessReminders, val)} />
            </label>
          </div>
        </div>

        <div className="p-5 flex items-center justify-between opacity-50">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-700 rounded-lg text-gray-300"><Moon size={20} /></div>
            <span className="font-bold text-white">{t('settings.theme')}</span>
          </div>
          <Toggle checked={true} onChange={() => {}} />
        </div>
      </div>

      {/* NOVO: SINCRONIZAÇÃO COM APPLE HEALTH / GOOGLE FIT */}
      <h3 className="font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm">
        {t('settings.healthSection', 'Saúde e Atividade (Apple Health / Google Fit)')}
      </h3>
      <div className="bg-gray-800 rounded-3xl border border-gray-700 p-5 shadow-lg mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400"><HeartPulse size={20} /></div>
          <div className="min-w-0">
            <h4 className="font-bold text-white text-sm">{t('settings.healthTitle', 'Sincronizar Passos e Calorias')}</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {isHealthBridgeNative()
                ? t('settings.healthNativeDesc', 'Conectado ao app de saúde do seu dispositivo.')
                : t('settings.healthWebDesc', 'No navegador, esta função funciona em modo estimado. Em um app instalado, conecta de verdade ao Health/Fit.')}
            </p>
          </div>
        </div>

        {healthLastSync && (
          <p className="text-[10px] text-gray-500 mb-3">
            {t('settings.lastSync', 'Último backup')}: {formatDate(healthLastSync)}
          </p>
        )}

        {healthResultMsg && (
          <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-3 mb-3 text-xs text-pink-200">
            {healthResultMsg}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handlePullHealthData}
            disabled={isHealthSyncing}
            className="flex-1 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowDownToLine size={14} />
            {t('settings.healthPull', 'Trazer do Health/Fit')}
          </button>
          <button
            onClick={handlePushHealthData}
            disabled={isHealthSyncing}
            className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowUpFromLineIcon size={14} />
            {t('settings.healthPush', 'Enviar para Health/Fit')}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between bg-gray-900/40 rounded-xl p-3">
          <div className="min-w-0 pr-3">
            <p className="text-xs font-bold text-white">{t('settings.healthAutoSync', 'Sincronização automática de Saúde')}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{t('settings.healthAutoSyncDesc', 'Roda em segundo plano, é local e leve')}</p>
          </div>
          <Toggle
            checked={!!fitnessProfile.autoHealthSyncEnabled}
            onChange={async (val) => {
              const profile = await db.fitnessProfile.get(1) || { id: 1 };
              profile.autoHealthSyncEnabled = val;
              await db.fitnessProfile.put(profile);
            }}
          />
        </div>

        {fitnessProfile.lastHealthSteps !== undefined && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <Footprints size={14} className="text-pink-400" />
            {t('settings.lastKnownSteps', 'Últimos passos importados')}: <span className="font-bold text-white">{fitnessProfile.lastHealthSteps || 0}</span>
          </div>
        )}
      </div>

      {/* BACKUP, DADOS E NUVEM */}
      <h3 className="font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm">{t('settings.backupSection', 'Backup e Dados')}</h3>
      <div className="bg-gray-800 rounded-3xl border border-gray-700 divide-y divide-gray-700 overflow-hidden shadow-lg mb-8">

        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* SINCRONIZAÇÃO AUTOMÁTICA — só pode ser ativada com conta Google conectada */}
        <div className="p-5 flex items-center justify-between gap-3 bg-blue-900/10">
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shrink-0"><RefreshCw size={20} /></div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-sm">{t('settings.autoSync', 'Sincronização Automática')}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {authUser
                  ? t('settings.autoSyncDesc', 'Envia para a nuvem a cada ~5 min quando algo é concluído/alterado')
                  : t('settings.autoSyncNeedsAccount', 'Conecte-se ao Google abaixo para poder ativar a sincronização automática.')}
              </p>
              {authUser && lastAutoSync && (
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {t('settings.lastAutoSync', 'Última sinc. automática')}: {formatDate(lastAutoSync)}
                </p>
              )}
            </div>
          </div>
          <Toggle
            checked={authUser ? autoSyncEnabled : false}
            onChange={handleToggleAutoSync}
            disabled={!authUser}
          />
        </div>

        {authUser ? (
          <>
            <div className="p-5 bg-blue-900/10 flex flex-col gap-3 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Cloud size={20} /></div>
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-sm">{t('settings.cloudConnected', 'Conectado à Nuvem')}</h4>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{authUser.email}</p>
                  {cloudLastSync && (
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {t('settings.lastSync', 'Último backup')}: {formatDate(cloudLastSync)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleCloudSync}
                  disabled={isSyncing}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  title={t('settings.syncNowDesc', 'Envia os dados deste dispositivo para a nuvem')}
                >
                  <Upload size={14} />
                  {t('settings.syncNow', 'Enviar')}
                </button>
                <button
                  onClick={handleCloudRestore}
                  disabled={isSyncing}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  title={t('settings.restoreDesc', 'Baixa os dados salvos na nuvem para este dispositivo')}
                >
                  <CloudDownload size={14} />
                  {t('settings.restoreBtn', 'Baixar')}
                </button>
                <button
                  onClick={handleDisconnectGoogle}
                  disabled={isSyncing}
                  className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center transition-colors"
                  title="Desconectar"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <button
            onClick={handleConnectGoogle}
            disabled={isSyncing}
            className="w-full p-5 flex items-center justify-between hover:bg-gray-700/50 transition-colors text-left border-b border-gray-700 disabled:opacity-60"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                {isSyncing ? <RefreshCw size={20} className="animate-spin" /> : <Cloud size={20} />}
              </div>
              <div>
                <h4 className="font-bold text-white">{t('settings.connectCloud', 'Conectar à Nuvem')}</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">{t('settings.connectCloudDesc', 'Salve seu progresso com segurança no Google')}</p>
              </div>
            </div>
          </button>
        )}

        <button
          onClick={handleExportData}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-700/50 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><Download size={20} /></div>
            <div>
              <h4 className="font-bold text-white">{t('settings.exportData', 'Exportar Dados')}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{t('settings.exportDesc', 'Salvar backup no seu dispositivo')}</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleImportClick}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-700/50 transition-colors text-left border-b border-gray-700"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400"><Upload size={20} /></div>
            <div>
              <h4 className="font-bold text-white">{t('settings.importData', 'Importar Dados')}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{t('settings.importDesc', 'Restaurar de um arquivo de backup')}</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleDeleteAllData}
          className="w-full p-5 flex items-center justify-between hover:bg-red-900/20 transition-colors text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover:bg-red-500/20 transition-colors"><Trash2 size={20} /></div>
            <div>
              <h4 className="font-bold text-red-500">{t('settings.deleteData', 'Apagar Todos os Dados')}</h4>
              <p className="text-[11px] text-red-400/70 mt-0.5">{t('settings.deleteDesc', 'Ação irreversível')}</p>
            </div>
          </div>
        </button>

      </div>

      <div className="shrink-0 mt-4">
          <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-gray-500" />
      </div>
      <div className="-mb-3"></div>

      {/* MODAL: Conta já possui backup remoto */}
      {cloudChoiceModal.open && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20">
              <Cloud size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t('settings.cloudChoiceTitle', 'Já existe um backup nesta conta')}
            </h3>
            <p className="text-sm text-gray-400 mb-2 leading-relaxed">
              {t('settings.cloudChoiceDesc', 'Encontramos dados salvos na nuvem para esta conta Google. O que você deseja fazer?')}
            </p>
            {cloudChoiceModal.remoteDate && (
              <p className="text-xs text-gray-500 mb-6">
                {t('settings.lastSync', 'Último backup')}: {formatDate(cloudChoiceModal.remoteDate)}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmUseCloudData}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center justify-center gap-2"
              >
                <CloudDownload size={18} />
                {t('settings.useCloudData', 'Usar dados da nuvem (substitui este dispositivo)')}
              </button>
              <button
                onClick={confirmUseLocalData}
                className="w-full py-3.5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition-colors flex items-center justify-center gap-2 border border-gray-700"
              >
                <Upload size={18} />
                {t('settings.useLocalData', 'Usar dados deste dispositivo (substitui a nuvem)')}
              </button>
              <button
                onClick={() => setCloudChoiceModal({ open: false, user: null, remoteDate: null })}
                className="w-full py-2.5 text-gray-500 font-bold text-sm"
              >
                {t('cancel', 'Cancelar')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirmar Importação */}
      {importConfirmModal.open && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4 border border-orange-500/20">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t('settings.importConfirmTitle', 'Confirmar importação')}
            </h3>
            <p className="text-sm text-gray-400 mb-2 leading-relaxed">
              {t('settings.importConfirm', 'Isso apagará seus dados atuais e os substituirá pelo backup. Deseja continuar?')}
            </p>
            {importConfirmModal.exportedAt ? (
              <p className="text-xs font-bold text-orange-300 mb-6 bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20">
                {t('settings.backupDate', 'Este backup foi gerado em')}: {formatDate(importConfirmModal.exportedAt)}
              </p>
            ) : (
              <p className="text-xs text-gray-500 mb-6 italic">
                {t('settings.backupDateUnknown', 'Este arquivo não possui data de criação (backup de uma versão antiga do app).')}
              </p>
            )}
            <div className="flex w-full gap-3">
              <button
                onClick={() => setImportConfirmModal({ open: false, data: null, exportedAt: null })}
                className="flex-1 py-3.5 rounded-2xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-colors"
              >
                {t('cancel', 'Cancelar')}
              </button>
              <button
                onClick={confirmImport}
                className="flex-1 py-3.5 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors"
              >
                {t('confirm', 'Confirmar')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}