// src/features/languages/english/views/ai-voice/AiVoiceTaskView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { db } from '../../../../../config/dexieDb';
import { PhoneOff, Mic, MicOff, Bot, Loader2, Volume2, Target, CheckCircle2, AlertTriangle, MessageSquare, RotateCcw, X, Globe, Sparkles, ChevronDown } from 'lucide-react';
import { generateCloudResponse } from '../../../../../services/aiService';
import { useSpeech } from '../../../../../hooks/useSpeech';
import { VOICE_SCENARIOS } from '../../../../../data/voiceScenarios';
import FooterBrand from '../../../../../components/FooterBrand';
import { addXP } from '../../../../../utils/xpManager';
import PigeonAvatar from '../../../../../components/PigeonAvatar';

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const NATIVE_LANG_NAMES = { pt: 'Brazilian Portuguese', es: 'Spanish', en: 'English' };

function buildVoiceTaskPrompt(uiLang, level, scenario) {
  const nativeLang = NATIVE_LANG_NAMES[uiLang] || 'Brazilian Portuguese';
  
  let translationInstruction = `"translation": "FULL translation of your 'reply' in ${nativeLang}"`;
  if (level === 'B1' || level === 'B2') {
    translationInstruction = `"translation": "List 2 to 3 KEYWORDS from your reply and their ${nativeLang} translation. Format as 'Word - Translation'. DO NOT translate the full sentence."`;
  } else if (level === 'C1' || level === 'C2') {
    translationInstruction = `"translation": ""`;
  }

  return `You are acting in a voice roleplay scenario.
Role: ${scenario.aiRole}
Condition for success: ${scenario.completionCondition}

English Complexity Level: ${level}

IMPORTANT RULES:
1. Speak naturally and keep answers concise like a real phone call (1-3 short sentences max).
2. Stay strictly in character. Do not break character.
3. Do not use markdown or emojis. Just plain spoken English.

Respond ONLY with a valid JSON object matching this exact structure:
{
  "reply": "your in-character spoken response in English",
  ${translationInstruction},
  "correction": "Write in ${nativeLang}: Correct any mistakes from the user's last message, and give a clear tip on exactly what they should say next to progress.",
  "isCompleted": boolean (true ONLY if objective is achieved)
}`;
}

function parseVoiceTaskJson(raw) {
  if (!raw) return { reply: '', translation: '', correction: '', isCompleted: false };
  
  const cleaned = raw.trim()
    .replace(/^`{3}json\s*/i, '')
    .replace(/^`{3}\s*/, '')
    .replace(/`{3}$/, '')
    .trim();
    
  try {
    const parsed = JSON.parse(cleaned);
    return {
      reply: parsed.reply || cleaned,
      translation: parsed.translation || '',
      correction: parsed.correction || '',
      isCompleted: !!parsed.isCompleted,
    };
  } catch {
    return { reply: raw, translation: '', correction: '', isCompleted: false };
  }
}

// NOVO: Função para descobrir qual roupa o Paddy deve usar baseado na Task
function getAccessoryForScenario(scenarioId) {
  switch(scenarioId) {
    case 'voice_coffee':
    case 'ordering_pub':
      return 'barista';
    case 'dublin_airport':
      return 'officer';
    case 'job_hunting':
    case 'hospitality_interview':
      return 'manager';
    case 'buy_ticket':
    case 'hotel_checkin':
      return 'receptionist';
    default:
      return 'teacher'; // Fallback caso seja uma task nova ainda não mapeada
  }
}

export default function AiVoiceTaskView() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, uiLang } = useLanguage();
  
  const backRoute = location.state?.fromTrail 
    ? '/english/trail' 
    : '/english/ai-voice/tasks';

  const scenario = VOICE_SCENARIOS.find(s => s.id === taskId) || VOICE_SCENARIOS[0];
  const { transcript, isListening, startListening, stopListening, hasSupport } = useSpeech('en-IE');

  const [callState, setCallState] = useState('idle'); 
  const [level, setLevel] = useState('A1');
  const [manualToggles, setManualToggles] = useState({});
  const [mainTranslationOpen, setMainTranslationOpen] = useState(false);
  
  const [taskSuccess, setTaskSuccess] = useState(() => {
    const savedCompleted = JSON.parse(localStorage.getItem('completedVoiceTasks') || '[]');
    return savedCompleted.includes(taskId);
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(`aiVoiceTaskHistory_${taskId}`);
    if (saved) return JSON.parse(saved);
    
    return [{ 
      role: 'assistant', 
      content: scenario.firstMessage.text,
      translation: scenario.firstMessage.translation[uiLang] || scenario.firstMessage.translation.pt,
      correction: scenario.firstMessage.hint[uiLang] || scenario.firstMessage.hint.pt,
      level: 'A1'
    }];
  });

  const lastAiMessageObj = history.filter(m => m.role === 'assistant').pop();
  const currentAssistantText = lastAiMessageObj?.content || "Tap the microphone to start.";
  const currentHint = lastAiMessageObj?.correction || "";
  const currentTranslation = lastAiMessageObj?.translation || "";

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const loadLevel = async () => {
      const settings = await db.appSettings.get(1);
      if (settings?.aiChatLevel) {
        setLevel(settings.aiChatLevel);
        setHistory(prev => {
          const newHistory = [...prev];
          if (newHistory.length > 0 && newHistory[0].role === 'assistant') {
            newHistory[0].level = settings.aiChatLevel;
          }
          return newHistory;
        });
      }
    };
    loadLevel();
  }, []);

  const handleLevelChange = async (newLevel) => {
    setLevel(newLevel);
    await db.appSettings.update(1, { aiChatLevel: newLevel });
  };

  useEffect(() => {
    localStorage.setItem(`aiVoiceTaskHistory_${taskId}`, JSON.stringify(history));
    if (showHistoryModal) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, showHistoryModal, taskId]);

  useEffect(() => {
    setMainTranslationOpen(false);
  }, [currentAssistantText]);

  const showMainHint = ['A1', 'A2', 'B1'].includes(level) && currentHint && (callState === 'idle' || callState === 'listening');
  const showMainTranslation = ['A1', 'A2', 'B1', 'B2'].includes(level) && currentTranslation && callState !== 'listening' && callState !== 'thinking';

  const toggleTranslation = (idx) => {
    setManualToggles(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const speakAI = (text, isCompletedFlag) => {
    if (!synth) return;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IE'; 
    utterance.rate = 0.95; 
    
    utterance.onstart = () => {
      setCallState('speaking');
    };

    utterance.onend = async () => {
      if (isCompletedFlag) {
        setCallState('idle');
        setTaskSuccess(true); 
        const savedCompleted = JSON.parse(localStorage.getItem('completedVoiceTasks') || '[]');
        if (!savedCompleted.includes(taskId)) {
          savedCompleted.push(taskId);
          localStorage.setItem('completedVoiceTasks', JSON.stringify(savedCompleted));
          
          await addXP(20);
        }
      } else {
        setCallState('idle');
        startListening(); 
      }
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  useEffect(() => {
    if (!isListening && callState === 'listening' && transcript.trim()) {
      handleSendVoice(transcript);
    } else if (!isListening && callState === 'listening' && !transcript.trim()) {
      setCallState('idle');
    }
  }, [isListening, callState, transcript]);

  const toggleMic = () => {
    if (callState === 'speaking' || callState === 'thinking' || taskSuccess) return;

    if (isListening) {
      stopListening();
    } else {
      synth.cancel();
      setCallState('listening');
      startListening();
    }
  };

  const endCall = () => {
    stopListening();
    synth.cancel();
    navigate(backRoute);
  };

  const handleSendVoice = async (userText) => {
    setCallState('thinking');
    
    const newHistory = [...history, { role: 'user', content: userText }];
    setHistory(newHistory);

    try {
      const prompt = buildVoiceTaskPrompt(uiLang, level, scenario);
      const rawReply = await generateCloudResponse(userText, newHistory, prompt);
      const { reply, translation, correction, isCompleted } = parseVoiceTaskJson(rawReply);
      
      setHistory([...newHistory, { role: 'assistant', content: reply, translation, correction, level }]);
      speakAI(reply, isCompleted);
    } catch (err) {
      console.error(err);
      setCallState('idle');
    }
  };

  const confirmRestartTask = () => {
    const savedCompleted = JSON.parse(localStorage.getItem('completedVoiceTasks') || '[]');
    const updatedCompleted = savedCompleted.filter(id => id !== taskId);
    localStorage.setItem('completedVoiceTasks', JSON.stringify(updatedCompleted));
    localStorage.removeItem(`aiVoiceTaskHistory_${taskId}`);
    
    synth.cancel();
    stopListening();
    setTaskSuccess(false);
    setMainTranslationOpen(false);
    setHistory([{ 
      role: 'assistant', 
      content: scenario.firstMessage.text,
      translation: scenario.firstMessage.translation[uiLang] || scenario.firstMessage.translation.pt,
      correction: scenario.firstMessage.hint[uiLang] || scenario.firstMessage.hint.pt,
      level 
    }]);
    setCallState('idle');
    setIsResetModalOpen(false);
  };

  useEffect(() => {
    return () => synth.cancel();
  }, []);

  if (!hasSupport) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center p-6 text-center z-50">
        <AlertTriangle className="text-yellow-500 mb-4" size={48} />
        <h2 className="text-xl text-white font-bold mb-2">Microfone não suportado</h2>
        <p className="text-gray-400">Seu navegador não suporta a API de voz.</p>
        <button onClick={endCall} className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold">Voltar</button>
      </div>
    );
  }

  const objectiveText = scenario.objective[uiLang] || scenario.objective.pt;

  if (taskSuccess) {
    return (
      <div className="fixed inset-x-0 top-0 bottom-[80px] bg-gray-950 flex flex-col items-center justify-center p-6 text-center animate-fade-in z-10">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="text-green-500" size={48} />
        </div>
        <h2 className="text-3xl text-white font-black mb-2">{t('ai.missionComplete', 'Missão Concluída!')}</h2>
        <p className="text-green-200 mb-8 max-w-sm">{t('ai.voiceMissionSuccess', 'Você conseguiu atingir o objetivo através da conversação em voz!')}</p>
        
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={endCall} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg">
            {t('ai.backToScenarios', 'Concluir e Voltar')}
          </button>
          <button onClick={() => setIsResetModalOpen(true)} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg flex items-center justify-center gap-2">
            <RotateCcw size={20} />
            Reiniciar Tarefa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 top-0 bottom-[80px] bg-gray-950 flex flex-col animate-fade-in z-10">
      
      {/* HEADER E NÍVEL */}
      <div className="flex flex-col w-full shrink-0">
        <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
          <button onClick={() => setShowHistoryModal(true)} className="p-2 bg-gray-800 text-indigo-400 rounded-full hover:bg-gray-700 transition-colors shadow-sm" title="Ver Histórico">
            <MessageSquare size={20} />
          </button>

          <h2 className="text-gray-400 font-bold tracking-widest uppercase text-[10px]">
            {callState === 'speaking' ? 'Assistant Speaking...' : 
             callState === 'listening' ? 'Listening to you...' : 
             callState === 'thinking' ? 'Connecting...' : 'Call Connected'}
          </h2>

          <button onClick={() => setIsResetModalOpen(true)} className="p-2 bg-gray-800 text-red-400 rounded-full hover:bg-gray-700 transition-colors shadow-sm" title="Reiniciar Tarefa">
            <RotateCcw size={20} />
          </button>
        </div>
        
        <div className="bg-indigo-900/40 px-6 py-3 border-b border-indigo-800/50 flex items-start gap-3 shadow-md">
          <Target className="text-indigo-400 shrink-0 mt-0.5 animate-pulse" size={18} />
          <p className="text-xs text-indigo-200 font-medium leading-relaxed">
            <span className="font-bold text-indigo-400 uppercase mr-1">{t('ai.missionLabel', 'Missão')}:</span>
            {objectiveText}
          </p>
        </div>

        <div className="bg-gray-900/60 border-b border-gray-800 px-3 py-2 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest shrink-0">
            {t('ai.levelLabel', 'Nível')}
          </span>
          <div className="flex gap-1.5">
            {CEFR_LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                  level === lvl
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.4)]'
                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ÁREA CENTRAL - FLUIDA E RESPONSIVA COM GAP */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 sm:px-8 py-6 overflow-y-auto w-full gap-6">
        
        {/* Dica */}
        {showMainHint && (
          <div className="w-full max-w-sm bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 flex items-start gap-2 shadow-lg animate-fade-in shrink-0">
            <Sparkles size={16} className="shrink-0 mt-0.5 text-amber-400" />
            <p className="text-xs text-amber-100 leading-relaxed text-left">
              <span className="font-bold text-amber-400">Dica: </span>
              {currentHint}
            </p>
          </div>
        )}

        {/* Avatar Central */}
        <div className="relative flex items-center justify-center shrink-0 my-2">
          {(callState === 'speaking' || callState === 'listening') && (
            <>
              <div className="absolute w-32 h-32 bg-indigo-500/20 rounded-full animate-ping"></div>
              <div className="absolute w-40 h-40 bg-indigo-500/10 rounded-full animate-pulse [animation-duration:2s]"></div>
            </>
          )}
          
          <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full shadow-2xl bg-slate-800 border-4 border-slate-700 overflow-hidden flex items-end justify-center">
            <PigeonAvatar accessory={getAccessoryForScenario(taskId)} className="w-25 h-25 mt-6" />
            
            <div className={`absolute inset-0 transition-opacity duration-300 ${
              callState === 'speaking' ? 'bg-indigo-500/20' : 
              callState === 'listening' ? 'bg-green-500/20' : 
              callState === 'thinking' ? 'bg-blue-500/20' : 'bg-transparent'
            }`}></div>
          </div>

          {(callState !== 'idle') && (
            <div className={`absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-[3px] border-gray-950 z-20 transition-all duration-300 ${
              callState === 'speaking' ? 'bg-indigo-600' : 
              callState === 'listening' ? 'bg-green-600' : 
              callState === 'thinking' ? 'bg-blue-600' : 'bg-gray-800'
            }`}>
              {callState === 'thinking' && <Loader2 className="text-white animate-spin" size={18} />}
              {callState === 'listening' && <Mic className="text-white animate-pulse" size={18} />}
              {callState === 'speaking' && <Volume2 className="text-white animate-pulse" size={18} />}
            </div>
          )}
        </div>

        {/* Textos */}
        <div className="w-full flex flex-col items-center justify-center text-center shrink-0">
          {callState === 'listening' ? (
            <p className="text-xl sm:text-2xl text-white font-medium italic opacity-80">
              "{transcript || '...'}"
            </p>
          ) : callState === 'thinking' ? (
            <p className="text-xl sm:text-2xl text-gray-500 font-medium opacity-50">...</p>
          ) : (
            <>
              <p className="text-lg sm:text-xl font-medium text-indigo-100 transition-opacity duration-300">
                {currentAssistantText}
              </p>
              
              {showMainTranslation && (
                <div className="mt-4 flex flex-col items-center w-full">
                  <button 
                    onClick={() => setMainTranslationOpen(!mainTranslationOpen)} 
                    className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700 transition-colors shadow-sm"
                  >
                    <Globe size={12} /> {['B1', 'B2'].includes(level) ? 'Palavras-Chave' : 'Tradução'} 
                    <ChevronDown size={12} className={`transition-transform ${mainTranslationOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {mainTranslationOpen && (
                    <div className="mt-3 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl shadow-inner animate-fade-in w-full max-w-sm">
                      <p className="text-sm text-indigo-200 font-medium leading-relaxed whitespace-pre-wrap">
                        {currentTranslation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CONTROLES INFERIORES E MARCA */}
      <div className="shrink-0 pb-safe pt-2 pb-4 flex flex-col items-center justify-center bg-gradient-to-t from-gray-950 to-transparent">
        <div className="flex items-center justify-center gap-6 sm:gap-10 mb-4 px-8">
          <button 
            onClick={toggleMic}
            disabled={callState === 'thinking'}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isListening 
                ? 'bg-gray-100 text-gray-900 hover:bg-white' 
                : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
            } ${callState === 'thinking' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? <Mic size={24} /> : <MicOff size={24} />}
          </button>

          <button 
            onClick={endCall}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-500 text-white shadow-lg transition-transform active:scale-95"
          >
            <PhoneOff size={32} />
          </button>
        </div>
        
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>

      {/* RELATÓRIO DA CHAMADA */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-md flex flex-col animate-fade-in">
          <div className="shrink-0 h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="text-indigo-400" size={20} />
              Relatório da Chamada
            </h2>
            <button onClick={() => setShowHistoryModal(false)} className="p-2 text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {history.map((msg, idx) => {
              const isAssistant = msg.role !== 'user';
              const translationOpen = manualToggles[idx] !== undefined ? manualToggles[idx] : false;

              return (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} w-full`}>
                  <div className={`flex gap-2 sm:gap-3 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    
                    {isAssistant && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center shrink-0 mt-1 shadow-sm overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>
                        <PigeonAvatar accessory={getAccessoryForScenario(taskId)} className="w-8 h-8 mt-1.5 relative z-10" />
                      </div>
                    )}

                    <div className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl shadow-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>

                  {isAssistant && (msg.translation || msg.correction) && (
                    <div className="ml-9 sm:ml-11 mt-1.5 max-w-[85%] sm:max-w-[80%] space-y-2">
                      
                      {msg.correction && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 flex items-start gap-2">
                          <Sparkles size={13} className="shrink-0 mt-0.5 text-amber-400" />
                          <p className="text-xs text-amber-100"><span className="font-bold text-amber-400">Feedback: </span>{msg.correction}</p>
                        </div>
                      )}

                      {msg.translation && (
                        <div>
                          <button onClick={() => toggleTranslation(idx)} className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase">
                            <Globe size={11} /> {['B1', 'B2'].includes(msg.level) ? 'Palavras-Chave' : 'Tradução'} <ChevronDown size={11} className={`transition-transform ${translationOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {translationOpen && (
                            <div className="mt-1 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-2.5 text-xs text-indigo-200 leading-relaxed animate-fade-in whitespace-pre-wrap">
                              {msg.translation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={chatEndRef} className="h-4" />
          </div>

          <div className="shrink-0 py-3 bg-gray-900/80 border-t border-gray-800 flex items-center justify-center">
            <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
          </div>
        </div>
      )}

      {/* MODAL DE RESET */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4 border border-red-500/20">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Reiniciar Tarefa?</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">Todo o seu progresso e histórico desta chamada serão apagados.</p>
            <div className="flex w-full gap-3">
              <button onClick={() => setIsResetModalOpen(false)} className="flex-1 py-3.5 rounded-2xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-colors">Cancelar</button>
              <button onClick={confirmRestartTask} className="flex-1 py-3.5 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors">Confirmar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}