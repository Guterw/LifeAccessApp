import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { db } from '../../../../../config/dexieDb';
import BackButton from '../../../../../components/BackButton';
import { Send, Bot, MessageSquare, AlertCircle, Globe, Sparkles, ChevronDown, Target, CheckCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { generateCloudResponse } from '../../../../../services/aiService';
import FooterBrand from '../../../../../components/FooterBrand';
import { useKeyboardOpen } from '../../../../../hooks/useKeyboardOpen';
import { TASK_SCENARIOS } from './taskScenarios';

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const NATIVE_LANG_NAMES = { pt: 'Brazilian Portuguese', es: 'Spanish', en: 'English' };

const LEVEL_GUIDANCE = {
  A1: (lang) => `Write in very simple English (A1). Add short ${lang} glosses in parentheses often.`,
  A2: (lang) => `Write in simple English (A2). Add a ${lang} gloss occasionally for difficult words.`,
  B1: (lang) => `Write in intermediate English (B1). Rarely add a ${lang} gloss.`,
  B2: (lang) => `Write upper-intermediate English (B2). Very rarely add a ${lang} gloss.`,
  C1: (lang) => `Write fluently (C1). Do not include any ${lang} words in your reply.`,
  C2: (lang) => `Write at native level (C2). Do not include any ${lang} words in your reply.`,
};

function buildTaskPrompt(uiLang, level, scenario) {
  const nativeLang = NATIVE_LANG_NAMES[uiLang] || 'Brazilian Portuguese';
  const guidance = (LEVEL_GUIDANCE[level] || LEVEL_GUIDANCE.A1)(nativeLang);

  return `You are acting in a roleplay scenario.
Role: ${scenario.aiRole}
Condition for success: ${scenario.completionCondition}

Student Level Guidance:
${guidance}

IMPORTANT RULES:
1. Stay strictly in character. Never break character.
2. The "reply" must be your in-character dialogue ONLY.
3. If the user makes a grammar mistake, explain it IN ${nativeLang} inside the "correction" field.

Respond ONLY with a valid JSON object:
{
  "reply": "your in-character response",
  "translation": "a complete ${nativeLang} translation of the 'reply'",
  "correction": "short explanation of any user grammar mistake, or empty string",
  "isCompleted": boolean (true ONLY if objective is achieved)
}`;
}

function parseTaskJson(raw) {
  if (!raw) return { reply: '', translation: '', correction: '', isCompleted: false };
  const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
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

export default function AiChatTaskView() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { t, uiLang } = useLanguage();
  const isKeyboardOpen = useKeyboardOpen();
  
  const scenario = TASK_SCENARIOS.find(s => s.id === taskId) || TASK_SCENARIOS[0];

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`aiTaskHistory_${taskId}`);
    if (saved) return JSON.parse(saved);
    
    // Inicia a primeira mensagem já com as traduções e dicas do arquivo taskScenarios.js
    return [{
      role: 'assistant',
      content: scenario.firstMessage.text,
      translation: scenario.firstMessage.translation[uiLang] || scenario.firstMessage.translation.pt,
      correction: scenario.firstMessage.hint[uiLang] || scenario.firstMessage.hint.pt,
      level: 'A1' // O default, que será atualizado pelo useEffect
    }];
  });

  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [level, setLevel] = useState('A1');
  const [manualToggles, setManualToggles] = useState({});
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const chatEndRef = useRef(null);

  const [taskSuccess, setTaskSuccess] = useState(() => {
    const savedCompleted = JSON.parse(localStorage.getItem('completedAiTasks') || '[]');
    return savedCompleted.includes(taskId);
  });

  // Carrega o level salvo e aplica na primeira mensagem para adaptar a UI dinamicamente
  useEffect(() => {
    const loadLevel = async () => {
      const settings = await db.appSettings.get(1);
      if (settings?.aiChatLevel) {
        setLevel(settings.aiChatLevel);
        setMessages(prev => {
          const newMsgs = [...prev];
          if (newMsgs.length > 0) newMsgs[0].level = settings.aiChatLevel;
          return newMsgs;
        });
      }
    };
    loadLevel();
  }, []);

  // Ao mudar de level na UI, atualiza a primeira mensagem pra esconder/mostrar a dica dinamicamente
  const handleLevelChange = async (newLevel) => {
    setLevel(newLevel);
    await db.appSettings.update(1, { aiChatLevel: newLevel });
    setMessages(prev => {
      const newMsgs = [...prev];
      if (newMsgs.length > 0) newMsgs[0].level = newLevel;
      return newMsgs;
    });
  };

  useEffect(() => {
    localStorage.setItem(`aiTaskHistory_${taskId}`, JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, hasError, taskSuccess, taskId]);

  const isTranslationOpen = (msg, idx) => {
    if (idx in manualToggles) return manualToggles[idx];
    return msg.level === 'A1';
  };

  const toggleTranslation = (idx, currentlyOpen) => {
    setManualToggles(prev => ({ ...prev, [idx]: !currentlyOpen }));
  };

  const confirmRestartChat = () => {
    const savedCompleted = JSON.parse(localStorage.getItem('completedAiTasks') || '[]');
    const updatedCompleted = savedCompleted.filter(id => id !== taskId);
    localStorage.setItem('completedAiTasks', JSON.stringify(updatedCompleted));
    localStorage.removeItem(`aiTaskHistory_${taskId}`);
    
    setTaskSuccess(false);
    setMessages([{ 
      role: 'assistant', 
      content: scenario.firstMessage.text,
      translation: scenario.firstMessage.translation[uiLang] || scenario.firstMessage.translation.pt,
      correction: scenario.firstMessage.hint[uiLang] || scenario.firstMessage.hint.pt,
      level 
    }]);
    setIsResetModalOpen(false);
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isThinking || taskSuccess) return;

    setHasError(false);
    const userText = inputVal.trim();
    setInputVal('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsThinking(true);

    try {
      const history = newMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));
      const systemPrompt = buildTaskPrompt(uiLang, level, scenario);
      
      const rawReply = await generateCloudResponse(userText, history, systemPrompt);
      const { reply, translation, correction, isCompleted } = parseTaskJson(rawReply);

      setMessages([...newMessages, { role: 'assistant', content: reply, translation, correction, level }]);
      
      if (isCompleted) {
        setTaskSuccess(true);
        const savedCompleted = JSON.parse(localStorage.getItem('completedAiTasks') || '[]');
        if (!savedCompleted.includes(taskId)) {
          savedCompleted.push(taskId);
          localStorage.setItem('completedAiTasks', JSON.stringify(savedCompleted));
        }
      }
    } catch (err) {
      setHasError(true);
      setMessages(messages);
      setInputVal(userText);
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const titleText = scenario.title[uiLang] || scenario.title.pt;
  const objectiveText = scenario.objective[uiLang] || scenario.objective.pt;

  return (
    <div className={`fixed inset-x-0 top-0 flex flex-col bg-gray-950 z-10 animate-fade-in transition-all duration-200 ${isKeyboardOpen ? 'bottom-0' : 'bottom-[80px]'}`}>

      {/* HEADER PRINCIPAL */}
      <div className="shrink-0 h-16 w-full bg-gray-900 border-b border-gray-800 z-20 flex items-center justify-between px-2 sm:px-4 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="shrink-0 mt-8">
            <BackButton to="/english/ai-chat/tasks" label="" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h2 className="text-base sm:text-lg font-black text-white tracking-wide leading-tight truncate">
              {titleText}
            </h2>
          </div>
        </div>
        {taskSuccess && (
           <button onClick={() => setIsResetModalOpen(true)} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
             <RotateCcw size={18} />
           </button>
        )}
      </div>

      {/* BANNER DE MISSÃO */}
      <div className="shrink-0 bg-indigo-900/40 px-4 py-2.5 border-b border-indigo-800/50 flex items-start gap-2 shadow-md z-10">
        <Target size={16} className="text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
        <p className="text-xs text-indigo-200 font-medium leading-relaxed">
          <span className="font-bold text-indigo-400 uppercase mr-1">
            {t('ai.missionLabel', 'Missão')}:
          </span>
          {objectiveText}
        </p>
      </div>

      {/* SELETOR DE NÍVEL CEFR */}
      <div className="shrink-0 bg-gray-900/60 border-b border-gray-800 px-3 py-2 flex items-center gap-2 overflow-x-auto hide-scrollbar">
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
                  ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600 hover:text-gray-300'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* ÁREA DE MENSAGENS */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-6 bg-gradient-to-b from-gray-950 to-gray-900 hide-scrollbar">
        {messages.map((msg, idx) => {
          const isAssistant = msg.role !== 'user';
          const translationOpen = isAssistant && isTranslationOpen(msg, idx);

          return (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} w-full`}>
              <div className={`flex gap-2 sm:gap-3 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {isAssistant && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot size={14} />
                  </div>
                )}
                <div className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl shadow-lg ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>

              {isAssistant && (msg.translation || msg.correction) && (
                <div className="ml-9 sm:ml-11 mt-1.5 max-w-[85%] sm:max-w-[80%] space-y-1.5">
                  {msg.translation && (
                    <div>
                      <button onClick={() => toggleTranslation(idx, translationOpen)} className="flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase">
                        <Globe size={11} /> {t('ai.translationLabel', 'Tradução')} <ChevronDown size={11} className={`transition-transform ${translationOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {translationOpen && (
                        <div className="mt-1 bg-blue-500/10 border border-blue-500/20 rounded-xl p-2.5 text-xs text-blue-200 leading-relaxed">{msg.translation}</div>
                      )}
                    </div>
                  )}
                  {msg.correction && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 flex items-start gap-2">
                      <Sparkles size={13} className="shrink-0 mt-0.5 text-amber-400" />
                      <p className="text-xs text-amber-100"><span className="font-bold text-amber-400">{t('ai.correctionLabel', 'Dica')}: </span>{msg.correction}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isThinking && <p className="text-blue-400 text-xs ml-11 animate-pulse">{t('ai.thinking', 'Pensando...')}</p>}
        <div ref={chatEndRef} className="h-4" />
      </div>

      {/* INPUT OU TELA DE SUCESSO */}
      <div className="shrink-0 bg-gray-900 border-t border-gray-800 p-3 pb-[env(safe-area-inset-bottom)]">
        <div className="shrink-0 -mt-4">
                  <FooterBrand direction="flex-row" textSize="text-[11px]" textColor="text-white-400" />
                </div>
        {taskSuccess ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 text-center animate-bounce-in max-w-4xl mx-auto">
            <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
            <h3 className="text-green-400 font-bold mb-1">{t('ai.missionComplete', 'Missão Concluída!')}</h3>
            <p className="text-xs text-green-200 mb-3">{t('ai.missionCompleteDesc', 'Você atingiu o objetivo desta tarefa de forma excelente.')}</p>
            <button 
              onClick={() => navigate('/english/ai-chat/tasks')}
              className="bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 px-6 rounded-xl w-full transition-colors"
            >
              {t('ai.backToScenarios', 'Voltar aos Cenários')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-end gap-2 w-full max-w-4xl mx-auto">
            <div className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl">
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
                }}
                disabled={isThinking}
                placeholder={t('ai.typeMessage', 'Digite sua mensagem...')}
                className="w-full bg-transparent text-white p-3 sm:p-4 max-h-32 min-h-[48px] resize-none focus:outline-none text-sm"
                rows="1"
              />
            </div>
            <button type="submit" disabled={!inputVal.trim() || isThinking} className="p-3 sm:p-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white rounded-2xl">
              <Send size={18} />
            </button>
          </form>
        )}
      </div>

      {/* MODAL DE CONFIRMAÇÃO CUSTOMIZADO */}
      {isResetModalOpen && (
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
                onClick={() => setIsResetModalOpen(false)}
                className="flex-1 py-3.5 rounded-2xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-colors"
              >
                {t('cancel', 'Cancelar')}
              </button>
              <button
                onClick={confirmRestartChat}
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