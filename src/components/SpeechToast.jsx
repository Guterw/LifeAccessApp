// src/components/SpeechToast.jsx
import React, { useEffect, useState } from 'react';
import { Mic, MicOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

/**
 * SpeechToast — mini-balão flutuante de status do microfone
 * 
 * status: 'listening' | 'stopped' | 'no_speech' | 'error' | null
 * 
 * Aparece por cima do conteúdo, some automaticamente após `duration` ms
 * (exceto enquanto status === 'listening').
 */
export default function SpeechToast({ status, transcript = '', duration = 3000 }) {
  const [visible, setVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);

  useEffect(() => {
    if (!status) {
      setVisible(false);
      return;
    }

    setCurrentStatus(status);
    setVisible(true);

    // Enquanto estiver ouvindo, mantém visível
    if (status === 'listening') return;

    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [status, duration]);

  if (!visible || !currentStatus) return null;

  const config = {
    listening: {
      icon: <Mic size={13} className="animate-pulse" />,
      text: transcript ? `"${transcript.slice(0, 40)}${transcript.length > 40 ? '…' : ''}"` : 'Ouvindo…',
      className: 'bg-blue-600/90 text-white border-blue-500/50',
    },
    stopped: {
      icon: <CheckCircle2 size={13} />,
      text: transcript ? `"${transcript.slice(0, 40)}${transcript.length > 40 ? '…' : ''}"` : 'Gravação encerrada',
      className: 'bg-gray-800/95 text-gray-200 border-gray-600/50',
    },
    no_speech: {
      icon: <MicOff size={13} />,
      text: 'Não reconheceu — tente falar mais devagar',
      className: 'bg-amber-600/90 text-white border-amber-500/50',
    },
    error: {
      icon: <AlertCircle size={13} />,
      text: 'Erro no microfone — toque novamente',
      className: 'bg-red-700/90 text-white border-red-500/50',
    },
  };

  const { icon, text, className } = config[currentStatus] || config.stopped;

  return (
    <div
      className={`
        fixed bottom-[100px] left-1/2 -translate-x-1/2 z-[200]
        flex items-center gap-2 px-4 py-2 rounded-full
        border shadow-xl backdrop-blur-md
        text-xs font-semibold max-w-[85vw] text-center
        animate-fade-in pointer-events-none
        ${className}
      `}
    >
      {icon}
      <span className="truncate">{text}</span>
    </div>
  );
}