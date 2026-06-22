// src/components/FirstLaunchGuard.jsx
import React, { useState, useEffect } from 'react';
import { Mic, BellRing, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function FirstLaunchGuard({ children }) {
  const { uiLang } = useLanguage();
  const [done, setDone] = useState(localStorage.getItem('lifeaccess_perms') === 'true');
  const [permissions, setPermissions] = useState({ mic: 'prompt', notify: 'prompt' });

  useEffect(() => {
    const checkPerms = async () => {
      if (!navigator.permissions) return;
      try {
        const m = await navigator.permissions.query({ name: 'microphone' });
        const n = await navigator.permissions.query({ name: 'notifications' });
        setPermissions({ mic: m.state, notify: n.state });
      } catch(e) {}
    };
    checkPerms();
  }, []);

  const requestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setPermissions(p => ({ ...p, mic: 'granted' }));
    } catch(e) {
      setPermissions(p => ({ ...p, mic: 'denied' }));
    }
  };

  const requestNotify = async () => {
    if ('Notification' in window) {
      const status = await Notification.requestPermission();
      setPermissions(p => ({ ...p, notify: status }));
    }
  };

  const handleFinish = () => {
    localStorage.setItem('lifeaccess_perms', 'true');
    setDone(true);
  };

  // Se o usuário já deu as permissões ou já passou por essa tela, renderiza o App
  if (done) return children;

  // Dicionário de traduções específico para este componente
  const t = {
    pt: { title: "Quase lá!", desc: "O LifeAccess precisa de algumas permissões para funcionar.", mic: "Microfone (Voz)", notif: "Notificações", allow: "Permitir", allowed: "Permitido", start: "Começar" },
    en: { title: "Almost there!", desc: "LifeAccess needs a few permissions to work.", mic: "Microphone (Voice)", notif: "Notifications", allow: "Allow", allowed: "Allowed", start: "Start" },
    es: { title: "¡Casi listo!", desc: "LifeAccess necesita algunos permisos para funcionar.", mic: "Micrófono (Voz)", notif: "Notificaciones", allow: "Permitir", allowed: "Permitido", start: "Empezar" }
  };
  const lang = t[uiLang] || t.pt;

  return (
    <div className="fixed inset-0 bg-gray-950 text-white flex flex-col p-6 items-center justify-center z-[9999] animate-fade-in">
      <div className="absolute top-40 -left-20 w-56 h-56 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <h1 className="text-3xl font-black mb-4 z-10">{lang.title}</h1>
      <p className="text-gray-400 text-center mb-10 z-10">{lang.desc}</p>
      
      <div className="w-full max-w-sm space-y-4 mb-10 z-10">
        {/* CARD MICROFONE */}
        <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg"><Mic className="text-blue-400" size={20} /></div>
            <span className="font-bold">{lang.mic}</span>
          </div>
          <button 
            onClick={requestMic}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${permissions.mic === 'granted' ? 'bg-green-500/20 text-green-400' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
          >
            {permissions.mic === 'granted' ? lang.allowed : lang.allow}
          </button>
        </div>

        {/* CARD NOTIFICAÇÕES */}
        <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg"><BellRing className="text-yellow-400" size={20} /></div>
            <span className="font-bold">{lang.notif}</span>
          </div>
          <button 
            onClick={requestNotify}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${permissions.notify === 'granted' ? 'bg-green-500/20 text-green-400' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
          >
            {permissions.notify === 'granted' ? lang.allowed : lang.allow}
          </button>
        </div>
      </div>

      <button onClick={handleFinish} className="bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl w-full max-w-sm flex justify-center items-center gap-2 hover:bg-blue-500 transition-colors shadow-lg z-10">
        {lang.start} <ArrowRight size={20} />
      </button>
    </div>
  );
}