// src/features/languages/english/views/ai-voice/AiVoiceTaskSelectionView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../../../../components/BackButton';
import FooterBrand from '../../../../../components/FooterBrand';
import { Headphones, ChevronRight, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { VOICE_SCENARIOS } from '../../../../../data/voiceScenarios';

export default function AiVoiceTaskSelectionView() {
  const { t, uiLang } = useLanguage();
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [resetModal, setResetModal] = useState({ isOpen: false, taskId: null });

  useEffect(() => {
    // Memória exclusiva para as missões de voz
    const saved = JSON.parse(localStorage.getItem('completedVoiceTasks') || '[]');
    setCompletedTasks(saved);
  }, []);

  const openResetModal = (e, taskId) => {
    e.stopPropagation();
    setResetModal({ isOpen: true, taskId });
  };

  const confirmRestart = () => {
    const taskId = resetModal.taskId;
    const updatedCompleted = completedTasks.filter(id => id !== taskId);
    
    setCompletedTasks(updatedCompleted);
    localStorage.setItem('completedVoiceTasks', JSON.stringify(updatedCompleted));
    localStorage.removeItem(`aiVoiceTaskHistory_${taskId}`);
    
    setResetModal({ isOpen: false, taskId: null });
    navigate(`/english/ai-voice/tasks/${taskId}`);
  };

  return (
    <div className="fixed inset-x-0 top-0 bottom-[80px] flex flex-col bg-gray-950 overflow-hidden z-10 animate-fade-in">
      
      <div className="shrink-0 h-16 w-full bg-gray-900 border-b border-gray-800 z-20 flex items-center px-4 shadow-lg">
        <div className="shrink-0 mt-8 mr-3">
          <BackButton to="/english/ai-hub" label="" />
        </div>
        <div className="w-9 h-9 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 shadow-inner flex items-center justify-center shrink-0 mr-3">
          <Headphones size={18} />
        </div>
        <h2 className="text-lg font-black text-white tracking-wide">
          {t('ai.voiceScenariosTitle', 'Missões por Voz')}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-sm text-gray-400 mb-2">
          {t('ai.voiceScenariosDesc', 'Pratique conversação em tempo real para o dia a dia:')}
        </p>
        
        {VOICE_SCENARIOS.map((scenario) => {
          const isCompleted = completedTasks.includes(scenario.id);
          const title = scenario.title[uiLang] || scenario.title.pt;
          const description = scenario.description[uiLang] || scenario.description.pt;

          return (
            <div 
              key={scenario.id}
              onClick={() => navigate(`/english/ai-voice/tasks/${scenario.id}`)}
              className={`w-full text-left rounded-2xl p-4 flex items-center justify-between transition-colors shadow-lg cursor-pointer ${
                isCompleted 
                  ? 'bg-gray-800/50 border border-green-500/30' 
                  : 'bg-gray-800 border border-gray-700 hover:border-teal-500'
              }`}
            >
              <div className="flex-1 min-w-0 pr-4">
                <h3 className={`text-lg font-bold mb-1 truncate ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                  {title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">{description}</p>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                {isCompleted ? (
                  <>
                    <button 
                      onClick={(e) => openResetModal(e, scenario.id)} 
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title={t('ai.restartTask', 'Reiniciar Tarefa')}
                    >
                      <RotateCcw size={20} />
                    </button>
                    <CheckCircle2 className="text-green-500" size={28} />
                  </>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-gray-400">
                    <ChevronRight size={18} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className="h-6"></div>
      </div>

      <div className="shrink-0 bg-gray-900 border-t border-gray-800 py-3">
         <FooterBrand direction="flex-row" textSize="text-[11px]" textColor="text-gray-500" />
      </div>

      {resetModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4 border border-red-500/20">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t('ai.restartTaskTitle', 'Reiniciar Tarefa?')}
            </h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {t('ai.restartTaskWarning', 'Deseja reiniciar esta tarefa? Todo o seu progresso e histórico de conversa deste cenário serão apagados permanentemente.')}
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setResetModal({ isOpen: false, taskId: null })}
                className="flex-1 py-3.5 rounded-2xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-colors"
              >
                {t('cancel', 'Cancelar')}
              </button>
              <button
                onClick={confirmRestart}
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