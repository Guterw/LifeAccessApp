import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Globe, Dumbbell, Wallet, Gamepad2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useKeyboardOpen } from '../hooks/useKeyboardOpen';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const currentPath = location.pathname;
  const isKeyboardOpen = useKeyboardOpen();

  // Lógica corrigida e mais abrangente (usa includes para garantir que pegue a rota certa)
  const isLanguageActive = 
    currentPath.includes('/languages') || 
    currentPath.includes('/level') || 
    currentPath.includes('/stats') ||
    currentPath.includes('/vocabulary') ||
    currentPath.includes('/english');

  const isFitnessActive = currentPath.includes('/fitness');
  const isFinanceActive = currentPath.includes('/finance');
  const isTasksActive = currentPath.includes('/tasks');
  
  // Home exata
  const isHomeActive = currentPath === '/';

  return (
    // h-20 e items-center garantem que TODOS os botões fiquem alinhados no exato meio vertical da barra
    <div className={`fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 pb-safe h-20 px-4 flex justify-between items-center z-50 transition-transform duration-200 ${isKeyboardOpen ? 'translate-y-full' : 'translate-y-0'}`}>
            
      {/* Botão Idiomas */}
      <button 
        onClick={() => navigate('/languages')} 
        className={`flex flex-col items-center justify-center w-16 transition-colors ${isLanguageActive ? 'text-blue-500' : 'text-gray-500 hover:text-gray-400'}`}
      >
        <Globe size={24} />
        <span className="text-[10px] font-bold mt-1">{t('home.langModule')}</span>
      </button>

      {/* Botão Fitness */}
      <button 
        onClick={() => navigate('/fitness')} 
        className={`flex flex-col items-center justify-center w-16 transition-colors ${isFitnessActive ? 'text-green-500' : 'text-gray-500 hover:text-gray-400'}`}
      >
        <Dumbbell size={24} />
        <span className="text-[10px] font-bold mt-1">{t('nav.fitness')}</span>
      </button>

      {/* Botão Home Central - Totalmente contido na barra, sem pular ou mudar de tamanho */}
      <button 
        onClick={() => navigate('/')} 
        className={`flex items-center justify-center w-14 h-14 rounded-2xl transition-colors ${
          isHomeActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
        }`}
      >
        <Home size={32} />
      </button>

      {/* Botão Finanças */}
      <button 
        onClick={() => navigate('/finance')} 
        className={`flex flex-col items-center justify-center w-16 transition-colors ${isFinanceActive ? 'text-red-400' : 'text-gray-500 hover:text-gray-400'}`}
      >
        <Wallet size={24} />
        <span className="text-[10px] font-bold mt-1">{t('nav.finance')}</span>
      </button>

      {/* Botão Tarefas */}
      <button 
        onClick={() => navigate('/tasks')} 
        className={`flex flex-col items-center justify-center w-16 transition-colors ${isTasksActive ? 'text-purple-500' : 'text-gray-500 hover:text-gray-400'}`}
      >
        <Gamepad2 size={24} />
        <span className="text-[10px] font-bold mt-1">{t('nav.tasks')}</span>
      </button>

    </div>
  );
}