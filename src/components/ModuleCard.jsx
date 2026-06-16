import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function ModuleCard({ 
  onClick, 
  icon: Icon, 
  title, 
  subtitle, 
  isActive = true, 
  customBgClass = "bg-gray-800/50 border border-gray-700/50 opacity-60", 
  iconBgClass = "bg-gray-700 text-gray-400",
  badge = null // Nova propriedade que aceita uma etiqueta/badge opcional
}) {
  return (
    <button 
      onClick={isActive ? onClick : undefined}
      disabled={!isActive}
      className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all text-left ${customBgClass}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl flex-shrink-0 ${iconBgClass}`}>
          <Icon size={28} />
        </div>
        <div>
          {/* O Badge agora é renderizado ao lado do título, se existir */}
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            {badge}
          </div>
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {isActive && <ChevronRight className="text-gray-500 flex-shrink-0" />}
    </button>
  );
}