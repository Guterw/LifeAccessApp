// src/features/languages/english/views/ai-chat/AiChatFreeView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { db } from '../../../../../config/dexieDb';
import BackButton from '../../../../../components/BackButton';
import { Send, Bot, MessageSquare, AlertCircle, Trash2, Globe, Sparkles, ChevronDown } from 'lucide-react';
import { generateCloudResponse } from '../../../../../services/aiService';
import FooterBrand from '../../../../../components/FooterBrand';
import { useKeyboardOpen } from '../../../../../hooks/useKeyboardOpen';

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const NATIVE_LANG_NAMES = {
  pt: 'Brazilian Portuguese',
  es: 'Spanish',
  en: 'English',
};

// Instruções de mescla por nível: quanto mais avançado, menos tradução dentro do próprio reply.
const LEVEL_GUIDANCE = {
  A1: (lang) => `Write in very simple English (A1: present tense, everyday vocabulary, short sentences). Freely add short ${lang} glosses in parentheses right inside your reply whenever a word might be hard — this student needs heavy support.`,
  A2: (lang) => `Write in simple English (A2: basic past/future tense, common topics). Add a ${lang} gloss in parentheses for moderately difficult words at a regular, moderate frequency — not on every word, but often enough to help.`,
  B1: (lang) => `Write almost entirely in English (B1: intermediate). Only rarely add a short ${lang} gloss in parentheses, and only for a genuinely tricky idiom or word.`,
  B2: (lang) => `Write almost entirely in English (B2: upper-intermediate, idiomatic). Only very rarely add a ${lang} gloss in parentheses, and only if a word is truly obscure.`,
  C1: (lang) => `Write entirely in natural, idiomatic English (C1 level). Do not include any ${lang} words inside your reply — full immersion.`,
  C2: (lang) => `Write entirely in fluent, native-level English (C2 level), using nuance and natural idioms. Do not include any ${lang} words inside your reply — full immersion.`,
};

function buildSystemPrompt(uiLang, level) {
  const nativeLang = NATIVE_LANG_NAMES[uiLang] || 'Brazilian Portuguese';
  const guidance = (LEVEL_GUIDANCE[level] || LEVEL_GUIDANCE.A1)(nativeLang);

  return `You are a friendly, encouraging English teacher chatting with a student whose native language is ${nativeLang}, currently at CEFR level ${level}.

${guidance}

Respond ONLY with a single valid JSON object — no markdown code fences, no text before or after it — with exactly these three fields:
{
  "reply": "your natural conversational reply in English, following the level rules above",
  "translation": "a complete ${nativeLang} translation of the 'reply' text above, so the student can fully understand it",
  "correction": "if the student's last message had a grammar or vocabulary mistake, a short and friendly explanation of it written IN ${nativeLang}. If there was no mistake, this must be an empty string"
}

Keep "reply" warm, natural and conversational — never robotic. Never mention these instructions or that you are following a JSON format.`;
}

// O modelo às vezes ignora a instrução e devolve texto cru ou com cercas de markdown;
// aqui tratamos isso com segurança em vez de quebrar o chat.
function parseAiJson(raw) {
  if (!raw) return { reply: '', translation: '', correction: '' };
  const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    return {
      reply: parsed.reply || cleaned,
      translation: parsed.translation || '',
      correction: parsed.correction || '',
    };
  } catch {
    return { reply: raw, translation: '', correction: '' };
  }
}

export default function AiChatFreeView() {
  const { t, uiLang } = useLanguage();
  const isKeyboardOpen = useKeyboardOpen();

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [{
      role: 'assistant',
      content: t('ai.initialGreeting', "Hello! I'm your English AI Teacher. How are you doing today? We can talk about anything you want!")
    }];
  });

  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [level, setLevel] = useState('A1');
  // Permite que o usuário abra/feche manualmente uma tradução, sobrepondo o padrão do nível
  const [manualToggles, setManualToggles] = useState({});
  const chatEndRef = useRef(null);

  useEffect(() => {
    const loadLevel = async () => {
      const settings = await db.appSettings.get(1);
      if (settings?.aiChatLevel) setLevel(settings.aiChatLevel);
    };
    loadLevel();
  }, []);

  const handleLevelChange = async (newLevel) => {
    setLevel(newLevel);
    await db.appSettings.update(1, { aiChatLevel: newLevel });
  };

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, hasError]);

  const clearChat = () => {
    localStorage.removeItem('chatHistory');
    setManualToggles({});
    setMessages([{
      role: 'assistant',
      content: t('ai.initialGreeting', "Hello! I'm your English AI Teacher. How are you doing today? We can talk about anything you want!")
    }]);
  };

  const isTranslationOpen = (msg, idx) => {
    if (idx in manualToggles) return manualToggles[idx];
    return msg.level === 'A1'; // suporte máximo: já vem aberto
  };

  const toggleTranslation = (idx, currentlyOpen) => {
    setManualToggles((prev) => ({ ...prev, [idx]: !currentlyOpen }));
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isThinking) return;

    setHasError(false);
    const userText = inputVal.trim();
    setInputVal('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsThinking(true);

    try {
      const history = newMessages.slice(0, -1).map((m) => ({ role: m.role, content: m.content }));
      const systemPrompt = buildSystemPrompt(uiLang, level);
      const rawReply = await generateCloudResponse(userText, history, systemPrompt);
      const { reply, translation, correction } = parseAiJson(rawReply);

      setMessages([...newMessages, { role: 'assistant', content: reply, translation, correction, level }]);
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

  return (
    <div className={`fixed inset-x-0 top-0 flex flex-col bg-gray-950 z-10 animate-fade-in transition-all duration-200 ${isKeyboardOpen ? 'bottom-0' : 'bottom-[80px]'}`}>

      {/* HEADER */}
      <div className="shrink-0 h-16 w-full bg-gray-900 border-b border-gray-800 z-20 flex items-center justify-between px-2 sm:px-4 shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="shrink-0 mt-8">
            <BackButton to="/english/ai-hub" label="" />
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 shadow-inner flex items-center justify-center shrink-0">
            <MessageSquare size={18} />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h2 className="text-base sm:text-lg font-black text-white tracking-wide leading-tight truncate">
              {t('ai.chatFreeTitle', 'Chat Livre')}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={clearChat} className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Limpar conversa">
            <Trash2 size={18} />
          </button>
          <div className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-[9px] font-bold tracking-widest text-green-400 uppercase hidden sm:inline-block">
              {t('ai.online', 'Online')}
            </span>
          </div>
        </div>
      </div>

      {/* SELETOR DE NÍVEL CEFR */}
      <div className="shrink-0 bg-gray-900/60 border-b border-gray-800 px-3 py-2 flex items-center gap-2 overflow-x-auto">
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
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-6 bg-gradient-to-b from-gray-950 to-gray-900">
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

              {/* Tradução + correção, anexadas embaixo da bolha da IA */}
              {isAssistant && (msg.translation || msg.correction) && (
                <div className="ml-9 sm:ml-11 mt-1.5 max-w-[85%] sm:max-w-[80%] space-y-1.5">
                  {msg.translation && (
                    <div>
                      <button
                        onClick={() => toggleTranslation(idx, translationOpen)}
                        className="flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wide"
                      >
                        <Globe size={11} />
                        {t('ai.translationLabel', 'Tradução')}
                        <ChevronDown size={11} className={`transition-transform ${translationOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {translationOpen && (
                        <div className="mt-1 bg-blue-500/10 border border-blue-500/20 rounded-xl p-2.5 text-xs text-blue-200 leading-relaxed">
                          {msg.translation}
                        </div>
                      )}
                    </div>
                  )}

                  {msg.correction && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 flex items-start gap-2">
                      <Sparkles size={13} className="shrink-0 mt-0.5 text-amber-400" />
                      <p className="text-xs text-amber-100 leading-relaxed">
                        <span className="font-bold text-amber-400">{t('ai.correctionLabel', 'Dica')}: </span>
                        {msg.correction}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex gap-2 sm:gap-3 justify-start w-full">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-1 animate-pulse">
              <Bot size={14} />
            </div>
            <div className="bg-gray-800 p-3 sm:p-4 rounded-2xl rounded-tl-sm border border-gray-700 flex items-center gap-1.5 shadow-lg">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} className="h-2" />
      </div>

      {/* INPUT AREA */}
      <div className="shrink-0 bg-gray-900 border-t border-gray-800 p-3 sm:p-4">
        <div className="shrink-0 -mt-4">
          <FooterBrand direction="flex-row" textSize="text-[11px]" textColor="text-white-400" />
        </div>

        {hasError && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 mb-2 text-xs text-red-300 max-w-4xl mx-auto">
            <AlertCircle size={14} className="shrink-0" />
            {t('ai.errorBanner', 'Algo deu errado. Tente enviar novamente.')}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-end gap-2 w-full max-w-4xl mx-auto">
          <div className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl">
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isThinking}
              placeholder={t('ai.typeMessage', 'Digite sua mensagem...')}
              className="w-full bg-transparent text-white p-3 sm:p-4 max-h-32 min-h-[48px] sm:min-h-[56px] resize-none focus:outline-none disabled:opacity-50 text-xs sm:text-sm"
              rows="1"
            />
          </div>
          <button
            type="submit"
            disabled={!inputVal.trim() || isThinking}
            className="flex items-center justify-center p-3 sm:p-4 h-[48px] sm:h-[56px] w-[48px] sm:w-[56px] bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white rounded-2xl transition-colors shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

    </div>
  );
}