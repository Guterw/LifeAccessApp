// src/components/UserProfileBadge.jsx
import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../config/dexieDb';
import { useLanguage } from '../contexts/LanguageContext';
import PigeonAvatar from './PigeonAvatar';
import { calculateLevel } from '../utils/xpManager';

export default function UserProfileBadge({ className = "", customAccessory }) {
  const { t } = useLanguage();
  
  // Puxa as infos do banco de dados em tempo real
  const userProfile = useLiveQuery(() => db.userProfile.get(1)) || { totalXp: 0 };
  
  // O level NUNCA é lido diretamente do campo salvo — é sempre recalculado
  // a partir do totalXp. Isso garante que o nível exibido esteja sempre
  // correto, mesmo que o campo currentLevel salvo esteja desatualizado
  // (por exemplo, após uma importação de backup antigo).
  const displayLevel = calculateLevel(userProfile.totalXp || 0);

  const accessory = customAccessory || "none";

  return (
    <div className={`flex items-center gap-3 bg-gray-800 py-1.5 px-2 pr-4 rounded-full border border-gray-700 shadow-xl ${className}`}>
      <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center border border-gray-600 shadow-inner overflow-hidden relative shrink-0">
         <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
         <PigeonAvatar accessory={accessory} className="w-8 h-8 mt-1" />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest drop-shadow-md">
          {t('trail.level', 'Nível')} {displayLevel}
        </span>
        <span className="text-[11px] font-bold text-gray-300">
          {(userProfile.totalXp || 0) % 100} / 100 {t('settings.xp', 'XP')}
        </span>
      </div>
    </div> 
  );
}