// src/features/settings/views/SettingsView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { User, Flame, Dumbbell, Receipt, CalendarCheck, Globe, Bell, Moon, Mic, Zap, HardDrive, Download, Upload, Cloud, LogOut, RefreshCw, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import BackButton from '../../../components/BackButton';
import { db } from '../../../config/dexieDb';
import { useLiveQuery } from 'dexie-react-hooks';
import FooterBrand from '../../../components/FooterBrand';
import PigeonAvatar from '../../../components/PigeonAvatar';

// Importações do Firebase
import { auth, googleProvider } from '../../../config/firebaseConfig';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// Importação do nosso Motor de Nuvem
import { pushToCloud, deleteCloudData } from '../../../utils/cloudSync';

export default function SettingsView() {
  const { t, userName, uiLang, changeLanguage, languageStreak } = useLanguage();
  const today = new Intl.DateTimeFormat(uiLang, { dateStyle: 'full' }).format(new Date());
  
  const [permission, setPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'default');
  const [micPermission, setMicPermission] = useState('prompt');
  
  // Estado de Autenticação na Nuvem
  const [authUser, setAuthUser] = useState(null);
  
  const fileInputRef = useRef(null);

  // Preferências
  const [notifLang, setNotifLang] = useState(true);
  const [notifTasks, setNotifTasks] = useState(true);
  const [notifFitness, setNotifFitness] = useState(false);

  // PUXANDO O PERFIL COMPLETO
  const userProfile = useLiveQuery(() => db.userProfile.get(1)) || { 
    currentLevel: 1, 
    totalXp: 0,
    equippedSkin: 'none'
  };
  const englishXP = userProfile.totalXp;
  
  const fitnessXP = parseInt(localStorage.getItem('fitnessXP') || '0', 10);
  const fitnessStreak = parseInt(localStorage.getItem('fitnessStreak') || '0', 10);

  useEffect(() => {
    // Escuta mudanças no login do Firebase em tempo real
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });

    const loadSettingsAndStats = async () => {
      const settings = await db.appSettings.get(1);
      if (settings) {
        setNotifLang(settings.notifLang ?? true);
        setNotifTasks(settings.notifTasks ?? true);
        setNotifFitness(settings.notifFitness ?? false);
        
        // CORREÇÃO: Lê do banco de dados local se já foi permitido antes
        if (settings.micPermissionGranted) {
           setMicPermission('granted');
        }
      }

      // Tenta observar mudanças reais no navegador também
      if (navigator.permissions) {
        try {
           const mStatus = await navigator.permissions.query({ name: 'microphone' });
           if (mStatus.state === 'denied') setMicPermission('denied');
           if (mStatus.state === 'granted') setMicPermission('granted');
           
           mStatus.onchange = () => {
              setMicPermission(mStatus.state);
              if (mStatus.state === 'denied') {
                  db.appSettings.update(1, { micPermissionGranted: false });
              }
           };
        } catch(e) {}
      }
    };
    loadSettingsAndStats();

    return () => unsubscribe();
  }, []);

  const handleToggleChange = async (key, setter, value) => {
    setter(value);
    await db.appSettings.update(1, { [key]: value });
  };

  const Toggle = ({ checked, onChange }) => (
    <button 
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full p-1 transition-all duration-300 ${checked ? 'bg-blue-600' : 'bg-gray-700'}`}
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

  // ==========================================
  // CORREÇÃO: PERMISSÃO DO MICROFONE 
  // ==========================================
  const handleMicPermission = async () => {
    if (micPermission === 'granted') {
      alert(t('settings.revokeAlert', "Para remover, vá nas configurações do seu navegador."));
    } else {
      try {
        // Regra da Web: Precisa chamar o getUserMedia para o aviso aparecer.
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop()); // Desliga na mesma hora!
        
        setMicPermission('granted');
        
        // CORREÇÃO: Salva no Dexie para não esquecer quando recarregar o app
        const settings = await db.appSettings.get(1) || { id: 1 };
        settings.micPermissionGranted = true;
        await db.appSettings.put(settings);

      } catch(e) {
        setMicPermission('denied');
      }
    }
  };

  // ==========================================
  // LÓGICA DE FIREBASE (LOGIN / LOGOUT / SYNC)
  // ==========================================
  const handleConnectGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const settings = await db.appSettings.get(1) || { id: 1 };
      settings.userName = user.displayName.split(' ')[0];
      settings.userEmail = user.email;
      await db.appSettings.put(settings);
      
      await pushToCloud(user.uid);
      
      alert(t('settings.connectSuccess', 'Conectado com sucesso! Seus dados agora podem ser sincronizados.'));
    } catch (error) {
      alert(t('settings.connectError', 'Erro ao conectar. Tente novamente.'));
    }
  };

  const handleDisconnectGoogle = async () => {
    if (window.confirm(t('settings.disconnectConfirm', 'Tem certeza que deseja desconectar sua conta? Seus dados não serão mais sincronizados na nuvem.'))) {
      await signOut(auth);
      const settings = await db.appSettings.get(1);
      if (settings) {
        settings.userEmail = null;
        await db.appSettings.put(settings);
      }
    }
  };

  const handleCloudSync = async () => {
    if (!authUser) return;
    try {
      await pushToCloud(authUser.uid);
      alert(t('settings.syncSuccess', 'Progresso salvo na nuvem com sucesso!'));
    } catch (error) {
      alert(t('settings.syncError', 'Erro ao sincronizar. Verifique sua conexão.'));
    }
  };

  // ==========================================
  // FUNÇÕES DE EXPORTAÇÃO E IMPORTAÇÃO (MANUAL)
  // ==========================================
  const handleExportData = async () => {
    try {
      const data = {};
      for (const table of db.tables) {
        data[table.name] = await table.toArray();
      }
      const jsonStr = JSON.stringify(data);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `lifeaccess_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert(t('settings.exportSuccess', 'Backup exportado com sucesso!'));
    } catch (error) {
      alert(t('settings.exportError', 'Erro ao exportar dados.'));
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!window.confirm(t('settings.importConfirm', 'Isso apagará seus dados atuais. Deseja continuar?'))) {
          e.target.value = ''; 
          return;
        }

        await db.transaction('rw', db.tables, async () => {
          for (const table of db.tables) {
            if (data[table.name]) {
              await table.clear();
              await table.bulkAdd(data[table.name]);
            }
          }
        });
        
        if (authUser) {
          await pushToCloud(authUser.uid);
        }
        
        alert(t('settings.importSuccess', 'Backup restaurado com sucesso!'));
        window.location.reload();
      } catch (error) {
        alert(t('settings.importError', 'Arquivo inválido.'));
      }
    };
    reader.readAsText(file);
    e.target.value = ''; 
  };

  // ==========================================
  // ZONA DE PERIGO: APAGAR DADOS
  // ==========================================
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

  // Lógica do Level Global
  const totalXP = englishXP + fitnessXP;
  const userLevel = userProfile.currentLevel || 1;
  const currentLevelXP = totalXP % 100;
  const nextLevelXP = 100; 
  const progressPercentage = (currentLevelXP / nextLevelXP) * 100;

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

      {/* VISÃO GERAL */}
      <h3 className="font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm">{t('settings.statsSection', 'Visão Geral')}</h3>
      <div className="grid grid-cols-2 gap-4 mb-8">
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
              <span className="text-xs text-gray-400 flex items-center gap-1"><Zap size={14} className={fitnessXP > 0 ? "text-yellow-400" : "text-gray-500"}/> {t('settings.xp', 'XP')}</span>
              <span className={`text-sm font-bold ${fitnessXP > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>{fitnessXP}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700 shadow-sm opacity-60">
          <Receipt className="text-red-400 mb-2" size={24} />
          <h4 className="text-white font-bold">{t('settings.financeStat', 'Finanças')}</h4>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{t('inDev', 'Em Breve')}</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700 shadow-sm opacity-60">
          <CalendarCheck className="text-purple-500 mb-2" size={24} />
          <h4 className="text-white font-bold">{t('settings.tasksStat', 'Tarefas')}</h4>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{t('inDev', 'Em Breve')}</p>
        </div>
        <div className="col-span-2 text-center text-xs text-gray-500 italic mt-[-4px]">
          {today.charAt(0).toUpperCase() + today.slice(1)}
        </div>
      </div>

      {/* PREFERÊNCIAS */}
      <h3 className="font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm">{t('settings.prefsSection')}</h3>
      <div className="bg-gray-800 rounded-3xl border border-gray-700 divide-y divide-gray-700 overflow-hidden shadow-lg mb-8">
        
        {/* Idioma */}
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

        {/* Microfone */}
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

        {/* Notificações */}
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
            <label className="flex justify-between items-center text-sm text-gray-300">
              {t('notifications.fitness')}
              <Toggle checked={notifFitness} onChange={(val) => handleToggleChange('notifFitness', setNotifFitness, val)} />
            </label>
          </div>
        </div>

        {/* Tema */}
        <div className="p-5 flex items-center justify-between opacity-50">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-700 rounded-lg text-gray-300"><Moon size={20} /></div>
            <span className="font-bold text-white">{t('settings.theme')}</span>
          </div>
          <Toggle checked={true} onChange={() => {}} />
        </div>
      </div>

      {/* BACKUP, DADOS E NUVEM */}
      <h3 className="font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm">{t('settings.backupSection', 'Backup e Dados')}</h3>
      <div className="bg-gray-800 rounded-3xl border border-gray-700 divide-y divide-gray-700 overflow-hidden shadow-lg mb-8">
        
        {/* Input invisível para a importação */}
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />

        {/* MÓDULO NUVEM (Firebase) */}
        {authUser ? (
          <>
            <div className="p-5 bg-blue-900/10 flex flex-col gap-3 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Cloud size={20} /></div>
                <div>
                  <h4 className="font-bold text-white text-sm">{t('settings.cloudConnected', 'Conectado à Nuvem')}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{authUser.email}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={handleCloudSync}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw size={14} />
                  {t('settings.syncNow', 'Sincronizar')}
                </button>
                <button 
                  onClick={handleDisconnectGoogle}
                  className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center transition-colors"
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
            className="w-full p-5 flex items-center justify-between hover:bg-gray-700/50 transition-colors text-left border-b border-gray-700"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Cloud size={20} /></div>
              <div>
                <h4 className="font-bold text-white">{t('settings.connectCloud', 'Conectar à Nuvem')}</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">{t('settings.connectCloudDesc', 'Salve seu progresso com segurança no Google')}</p>
              </div>
            </div>
          </button>
        )}

        {/* MÓDULO MANUAL */}
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

        {/* ZONA DE PERIGO */}
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
    </div>
  );
}