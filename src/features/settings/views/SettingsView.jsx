import React, { useState } from 'react';
import { User, Flame, Dumbbell, Receipt, CalendarCheck, Globe, Bell, Moon } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import BackButton from '../../../components/BackButton';

export default function SettingsView() {
  const { t, userName, uiLang, changeLanguage, languageStreak } = useLanguage();
  const today = new Intl.DateTimeFormat(uiLang, { dateStyle: 'full' }).format(new Date());
  const [permission, setPermission] = useState(Notification.permission);
  const [notifLang, setNotifLang] = useState(true);
  const [notifTasks, setNotifTasks] = useState(true);
  const [notifFitness, setNotifFitness] = useState(false);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  // Componente auxiliar de Toggle para não poluir o JSX
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
      // Como o navegador não permite "revogar" via script, 
      // mostramos um aviso de instrução ao usuário
      alert("Para remover, vá nas configurações do seu navegador (ícone de cadeado na barra de endereço).");
    } else {
      const status = await Notification.requestPermission();
      setPermission(status);
    }
  };

  return (
    <div className="w-full pt-8 animate-fade-in pb-20 px-4">
      <BackButton to="/" label={t('backToHome')} />

      <h2 className="text-3xl font-black text-white mb-6 tracking-wide">{t('settings.title')}</h2>

      {/* Seção de Perfil (Mantida igual) */}
      <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 flex items-center gap-5 shadow-lg mb-8">
        <div className="w-20 h-20 bg-blue-500/20 rounded-full border-2 border-blue-500 flex items-center justify-center">
          <User size={40} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{userName}</h3>
          <p className="text-sm text-blue-400 font-semibold uppercase tracking-wider">LifeAccess Member</p>
        </div>
      </div>

      {/* Estatísticas */}
      <h3 className="font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm">{t('settings.statsSection')}</h3>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md">
          <Flame className={`mb-2 ${languageStreak > 0 ? 'text-orange-500' : 'text-gray-600'}`} size={28} />
          <h4 className="text-white font-bold">{t('settings.langStat')}</h4>
          <p className="text-xs text-gray-400 mt-1">
            {t('settings.streakTitle')} <span className={languageStreak > 0 ? 'text-orange-400 font-bold' : ''}>{languageStreak}</span> {t('settings.days')}
          </p>
        </div>
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md">
          <Dumbbell className="text-green-500 mb-2" size={28} />
          <h4 className="text-white font-bold">{t('settings.fitnessStat')}</h4>
          <p className="text-xs text-gray-400 mt-1">{t('settings.fitnessDesc')}</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md">
          <Receipt className="text-red-400 mb-2" size={28} />
          <h4 className="text-white font-bold">{t('settings.financeStat')}</h4>
          <p className="text-xs text-gray-400 mt-1">{t('settings.financeDesc')}</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md">
          <CalendarCheck className="text-purple-500 mb-2" size={28} />
          <h4 className="text-white font-bold">{t('settings.tasksStat')}</h4>
          <p className="text-xs text-gray-400 mt-1">{t('settings.tasksDesc')}</p>
        </div>
        <div className="col-span-2 text-center text-xs text-gray-500 italic mt-[-8px]">
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
  className="bg-gray-900 text-white p-2 rounded-lg border border-gray-600 text-sm"
>
            <option value="pt">Português</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        {/* Notificações Moderna */}
        <div className="p-5">
           <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><Bell size={20} /></div>
              <span className="font-bold text-white">{t('settings.notifications')}</span>
            </div>
            {/* Botão com lógica condicional */}
            <button 
              onClick={handlePermission}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                permission === 'granted' 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              {permission === 'granted' ? t('notifications.remove') : t('notifications.allow')}
            </button>
          </div>
          
          <div className="space-y-3 pl-12">
            <label className="flex justify-between items-center text-sm text-gray-300">
              {t('notifications.language')}
              <Toggle checked={notifLang} onChange={setNotifLang} />
            </label>
            <label className="flex justify-between items-center text-sm text-gray-300">
              {t('notifications.tasks')}
              <Toggle checked={notifTasks} onChange={setNotifTasks} />
            </label>
            <label className="flex justify-between items-center text-sm text-gray-300">
              {t('notifications.fitness')}
              <Toggle checked={notifFitness} onChange={setNotifFitness} />
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
    </div>
  );
}