import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../contexts/LanguageContext';
import BackButton from '../../../../components/BackButton';
import { MessageSquare, ListTodo, Mic, Headphones, ChevronRight, Sparkles, Cloud } from 'lucide-react';
import FooterBrand from '../../../../components/FooterBrand';

export default function AiHubView() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const safeT = (key, fallback) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  const aiOptions = [
    { id: 'chat-free', path: '/english/ai-chat/free', icon: <MessageSquare size={26} />, color: 'blue', title: safeT('ai.chatFreeTitle', 'Chat Livre'), desc: safeT('ai.chatFreeDesc', 'Reading & Writing'), glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] border-blue-500/20 hover:border-blue-400', iconBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
    { id: 'chat-tasks', path: '/english/ai-chat/tasks', icon: <ListTodo size={26} />, color: 'indigo', title: safeT('ai.chatTasksTitle', 'Tarefas por Chat'), desc: safeT('ai.chatTasksDesc', 'Reading and Writing (Cenários)'), glow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] border-indigo-500/20 hover:border-indigo-400', iconBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' },
    { id: 'voice-free', path: '/english/ai-voice/free', icon: <Mic size={26} />, color: 'purple', title: safeT('ai.voiceFreeTitle', 'Treino de Voz'), desc: safeT('ai.voiceFreeDesc', 'Speaking and Listening'), glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] border-purple-500/20 hover:border-purple-400', iconBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
    { id: 'voice-tasks', path: '/english/ai-voice/tasks', icon: <Headphones size={26} />, color: 'pink', title: safeT('ai.voiceTasksTitle', 'Tarefas por Voz'), desc: safeT('ai.voiceTasksDesc', 'Speaking and Listening (Cenários)'), glow: 'shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] border-pink-500/20 hover:border-pink-400', iconBg: 'bg-pink-500/10 text-pink-400 border border-pink-500/20' }
  ];

  return (
    <div className="w-full pt-8 animate-fade-in pb-24 px-4 min-h-screen selection:bg-purple-500/30 relative -mt-5 -mb-20">

      <div className="flex items-center justify-between z-10 relative -mb-2">
        <BackButton to="/english" label={safeT('backToEnglish', 'Voltar')} />
        <div className="flex items-center mb-6 gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.2)]">
          <Cloud size={14} className="text-blue-400" />
          <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">Cloud AI</span>
        </div>
      </div>
      
      <div className="flex flex-col mb-10 px-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full animate-pulse"></div>
            <Sparkles className="text-purple-400 relative z-10 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" size={32} />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{safeT('ai.hubTitlePre', 'Central')}</span>
            <span className="bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-500 text-transparent bg-clip-text font-black drop-shadow-[0_2px_15px_rgba(168,85,247,0.5)] tracking-tighter">
              IA
            </span>
          </h2>
        </div>
        <p className="mt-1 text-gray-400 text-sm font-medium tracking-wide border-l-2 border-purple-500/30 pl-3 py-0.5">
          {safeT('ai.hubSubtitle', 'Aprimore sua fluência operacional por meio de inteligência artificial na nuvem.')}
        </p>
        {/* BANNER DE AVISO DE CONEXÃO */}
        <div className="mt-5 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-start gap-3 backdrop-blur-sm">
          <div className="bg-blue-500/20 p-1.5 rounded-lg shrink-0">
            <Cloud size={16} className="text-blue-400" />
          </div>
          <p className="text-[11px] text-blue-200/80 leading-relaxed font-medium">
            {safeT('ai.connectivityNote', 'Atenção: Os recursos de IA utilizam processamento em nuvem. É necessária uma conexão ativa com a internet para conversar com os professores.')}
          </p>
        </div>
      
      </div>

      <div className="grid gap-5">
        {aiOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => navigate(option.path)}
            className={`w-full text-left p-6 rounded-2xl border bg-gray-800 flex items-center justify-between transition-all duration-300 transform active:scale-[0.99] group ${option.glow}`}
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl transition-all duration-300 group-hover:scale-105 group-hover:bg-opacity-20 ${option.iconBg}`}>
                {option.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors tracking-wide mb-1">
                  {option.title}
                </h3>
                <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase transition-all duration-300">
                  {option.desc}
                </span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-500 group-hover:text-white group-hover:border-purple-500/40 group-hover:bg-purple-500/10 transition-all duration-300">
              <ChevronRight size={20} />
            </div>
          </button>
        ))}
            {/* FOOTER DA MARCA (Centralizado e fixo acima do input) */}
            <div className="shrink-0">
              <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
            </div>
      </div>
      <div className="-mb-5"></div>
    </div>
  );
}