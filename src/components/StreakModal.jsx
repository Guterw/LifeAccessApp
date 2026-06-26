// src/components/StreakModal.jsx
import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * StreakModal — exibe a animação de ofensiva atualizada
 * 
 * Props:
 * - streakUpdate: { increased, oldStreak, newStreak } | null
 * - onClose: () => void
 */
export default function StreakModal({ streakUpdate, onClose }) {
  const { t } = useLanguage();
  const [fireIgnited, setFireIgnited] = useState(false);
  const [displayedStreak, setDisplayedStreak] = useState(0);
  const [numberPopped, setNumberPopped] = useState(false);

  useEffect(() => {
    if (!streakUpdate?.increased) return;

    setFireIgnited(false);
    setNumberPopped(false);
    setDisplayedStreak(streakUpdate.oldStreak);

    const t1 = setTimeout(() => setFireIgnited(true), 500);
    const t2 = setTimeout(() => {
      setDisplayedStreak(streakUpdate.newStreak);
      setNumberPopped(true);
    }, 1500);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [streakUpdate]);

  if (!streakUpdate?.increased) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-xl flex flex-col items-center justify-center px-6 animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className={`transition-all duration-1000 transform ${fireIgnited ? 'scale-110' : 'scale-90 opacity-50'}`}>
          <Flame
            size={140}
            className={`transition-colors duration-1000 ${
              fireIgnited
                ? 'text-orange-500 drop-shadow-[0_0_60px_rgba(249,115,22,0.8)] animate-pulse'
                : 'text-gray-600'
            }`}
          />
        </div>
        <h2 className="text-3xl font-black text-white mt-12 mb-4 tracking-wide text-center">
          {t('level.streakUpdated', 'Ofensiva Atualizada!')}
        </h2>
        <div className="flex items-center justify-center h-32 mt-2">
          <span className={`text-8xl font-black transition-all duration-500 transform ${
            numberPopped
              ? 'text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.8)] scale-110 animate-bounce-once'
              : 'text-gray-500 scale-100'
          }`}>
            {displayedStreak}
          </span>
        </div>
      </div>
      <div className="w-full max-w-sm pb-safe pt-8 pb-12">
        <button
          onClick={onClose}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xl p-5 rounded-2xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] active:scale-95 uppercase tracking-wide"
        >
          {t('level.dedicateBtn', 'Continuar Focado')}
        </button>
      </div>
    </div>
  );
}