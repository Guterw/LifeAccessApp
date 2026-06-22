// src/features/settings/views/SettingsView.jsx
import React, { useState, useEffect } from 'react';
import { User, Flame, Dumbbell, Receipt, CalendarCheck, Globe, Bell, Moon, Mic, Zap } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import BackButton from '../../../components/BackButton';
import { db } from '../../../config/dexieDb';
import FooterBrand from '../../../components/FooterBrand';
import PigeonAvatar from '../../../components/PigeonAvatar';

export default function SettingsView() {
  const { t, userName, uiLang, changeLanguage, languageStreak } = useLanguage();
  const today = new Intl.DateTimeFormat(uiLang, { dateStyle: 'full' }).format(new Date());
  
  const [permission, setPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'default');
  const [micPermission, setMicPermission] = useState('prompt');
  
  // Preferências
  const [notifLang, setNotifLang] = useState(true);
  const [notifTasks, setNotifTasks] = useState(true);
  const [notifFitness, setNotifFitness] = useState(false);

  // Status Globais (XP e Streaks)
  const [englishXP, setEnglishXP] = useState(0);
  const [fitnessXP, setFitnessXP] = useState(0);
  const [fitnessStreak, setFitnessStreak] = useState(0);

  useEffect(() => {
    const loadSettingsAndStats = async () => {
      // 1. Carrega preferências de notificação do Dexie
      const settings = await db.appSettings.get(1);
      if (settings) {
        setNotifLang(settings.notifLang ?? true);
        setNotifTasks(settings.notifTasks ?? true);
        setNotifFitness(settings.notifFitness ?? false);
      }

      // 2. Carrega as permissões do microfone silenciosamente
      if (navigator.permissions) {
        try {
           const mStatus = await navigator.permissions.query({ name: 'microphone' });
           setMicPermission(mStatus.state);
           mStatus.onchange = () => setMicPermission(mStatus.state);
        } catch(e) {}
      }

      // 3. Carrega o XP e as Ofensivas do LocalStorage
      const eXP = parseInt(localStorage.getItem('userXP') || localStorage.getItem('englishXP') || '0', 10);
      const fXP = parseInt(localStorage.getItem('fitnessXP') || '0', 10);
      const fStreak = parseInt(localStorage.getItem('fitnessStreak') || '0', 10);

      setEnglishXP(eXP);
      setFitnessXP(fXP);
      setFitnessStreak(fStreak);
    };

    loadSettingsAndStats();
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
      alert(t('settings.revokeAlert', "Para remover, vá nas configurações do seu navegador (ícone de cadeado na barra de endereço)."));
    } else {
      const status = await Notification.requestPermission();
      setPermission(status);
    }
  };

  const handleMicPermission = async () => {
    if (micPermission === 'granted') {
      alert(t('settings.revokeAlert', "Para remover, vá nas configurações do seu navegador (ícone de cadeado na barra de endereço)."));
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
        setMicPermission('granted');
      } catch(e) {
        setMicPermission('denied');
      }
    }
  };

  // Lógica do Level Global
  const totalXP = englishXP + fitnessXP;
  const userLevel = Math.floor(totalXP / 100) + 1;
  const currentLevelXP = totalXP % 100; // Quanto de XP ele tem no level atual
  const nextLevelXP = 100; // Meta de cada level
  const progressPercentage = (currentLevelXP / nextLevelXP) * 100; // % da barra

  return (
    <div className="w-full pt-8 animate-fade-in pb-20 px-4 -mb-20 -mt-5">
      <BackButton to="/" label={t('backToHome')} />

      <h2 className="text-3xl font-black text-white -mt-4 mb-6 tracking-wide">{t('settings.title')}</h2>

      {/* SEÇÃO DE PERFIL COM O LEVEL GLOBAL E BARRA DE PROGRESSO */}
      <div className="bg-gray-800 p-5 sm:p-6 rounded-3xl border border-gray-700 flex items-center gap-4 sm:gap-5 shadow-lg mb-8">
        
        {/* Avatar */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/20 rounded-full border-2 border-blue-500 flex items-center justify-center shrink-0">
             <PigeonAvatar accessory="none" className="w-8 h-8 sm:w-10 sm:h-10 mt-1" />
        </div>
        
        {/* Infos e Progresso */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 truncate">
            <span className="truncate">{userName}</span>
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1 font-black shrink-0">
              Lv. {userLevel}
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-blue-400 font-semibold uppercase tracking-wider mb-2">LifeAccess Member</p>
          
          {/* BARRA DE PROGRESSO */}
          <div className="w-full pr-2">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {t('settings.progress', 'Progresso')}
              </span>
              <span className="text-[10px] font-bold text-blue-400">
                {currentLevelXP} / {nextLevelXP} XP
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

      {/* VISÃO GERAL (ESTATÍSTICAS INTEGRADAS) */}
      <h3 className="font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm">{t('settings.statsSection', 'Visão Geral')}</h3>
      <div className="grid grid-cols-2 gap-4 mb-8">
        
        {/* Card de Estatísticas do Inglês */}
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-md flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="text-blue-400" size={20} />
            <h4 className="text-white font-bold">{t('settings.langStat', 'Inglês')}</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1"><Flame size={14} className={languageStreak > 0 ? "text-orange-500" : "text-gray-500"}/>{t('settings.offensive', 'Ofensiva')}</span>
              <span className={`text-sm font-bold ${languageStreak > 0 ? 'text-orange-400' : 'text-gray-500'}`}>{languageStreak}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1"><Zap size={14} className={englishXP > 0 ? "text-yellow-400" : "text-gray-500"}/> XP</span>
              <span className={`text-sm font-bold ${englishXP > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>{englishXP}</span>
            </div>
          </div>
        </div>

        {/* Card de Estatísticas do Fitness (Treino) */}
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-md flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="text-green-400" size={20} />
            <h4 className="text-white font-bold">{t('settings.fitnessStat', 'Treino')}</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1"><Flame size={14} className={fitnessStreak > 0 ? "text-orange-500" : "text-gray-500"}/>{t('settings.offensive', 'Ofensiva')}</span>
              <span className={`text-sm font-bold ${fitnessStreak > 0 ? 'text-orange-400' : 'text-gray-500'}`}>{fitnessStreak}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1"><Zap size={14} className={fitnessXP > 0 ? "text-yellow-400" : "text-gray-500"}/> XP</span>
              <span className={`text-sm font-bold ${fitnessXP > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>{fitnessXP}</span>
            </div>
          </div>
        </div>

        {/* Cards de Módulos Futuros */}
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

      {/* Preferências */}
      <h3 className="font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm">{t('settings.prefsSection')}</h3>
      <div className="bg-gray-800 rounded-3xl border border-gray-700 divide-y divide-gray-700 overflow-hidden shadow-lg">
        
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

        {/* Permissão de Microfone */}
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

        {/* Notificações Moderna */}
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
      
      {/* FOOTER DA MARCA */}
      <div className="shrink-0 mt-4">
          <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-gray-500" />
      </div>
      <div className="-mb-3"></div>
    </div>
  );
}