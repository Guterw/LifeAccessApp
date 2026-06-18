import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import BackButton from '../../../../../components/BackButton';
import { Send, Bot, MessageSquare, AlertCircle, Trash2 } from 'lucide-react';
import { generateCloudResponse } from '../../../../../services/aiService';
import FooterBrand from '../../../../../components/FooterBrand';

export default function AiChatFreeView() {
  const { t } = useLanguage();
  
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
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, hasError]);

  const clearChat = () => {
    localStorage.removeItem('chatHistory');
    setMessages([{ 
      role: 'assistant', 
      content: t('ai.initialGreeting', "Hello! I'm your English AI Teacher. How are you doing today? We can talk about anything you want!") 
    }]);
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
      const history = newMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));
      const prompt = t('ai.systemPromptFree', "You are a friendly and supportive English teacher. Speak naturally, keep answers conversational and clear, and gently correct any major grammar mistakes at the end of your response.");
      
      const aiReply = await generateCloudResponse(userText, history, prompt);
      setMessages([...newMessages, { role: 'assistant', content: aiReply }]);
    } catch (err) {
      setHasError(true);
      setMessages(messages);
      setInputVal(userText);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 bottom-[80px] flex flex-col bg-gray-950 z-10 animate-fade-in">
      
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

      {/* ÁREA DE MENSAGENS */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-6 bg-gradient-to-b from-gray-950 to-gray-900">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-2 sm:gap-3 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role !== 'user' && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Bot size={14} />
              </div>
            )}
            <div className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl shadow-lg ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
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
        {/* FOOTER DA MARCA (Centralizado e fixo acima do input) */}
      <div className="shrink-0 -mt-4">
        <FooterBrand direction="flex-row" textSize="text-[11px]" textColor="text-white-400" />
      </div>
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