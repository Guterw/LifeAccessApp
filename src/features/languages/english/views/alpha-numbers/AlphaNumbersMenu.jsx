import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Type, Hash, ChevronRight, BookOpenText, Play, Zap } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import BackButton from '../../../../../components/BackButton';
import FooterBrand from '../../../../../components/FooterBrand';

export default function AlphaNumbersMenu() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const learnOptions = [
    { id: 'alphabet', title: 'Alfabeto', desc: 'Letras e Fonética', icon: <Type size={24} />, color: 'blue', path: '/english/alpha-numbers/alphabet' },
    { id: 'numbers', title: 'Números', desc: 'Contagem e Dezenas', icon: <Hash size={24} />, color: 'emerald', path: '/english/alpha-numbers/numbers' }
  ];

  const exerciseOptions = [
    { id: 'ex-alphabet', title: 'Treino Alfabeto', desc: 'Soletração e Som', icon: <Zap size={20} />, path: '/english/alpha-numbers/exercises/alphabet' },
    { id: 'ex-numbers', title: 'Treino Números', desc: 'Ditado e Sequência', icon: <Zap size={20} />, path: '/english/alpha-numbers/exercises/numbers' }
  ];

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 min-h-screen">
      <BackButton to="/english" label="Voltar" />

      {/* HEADER ESTILIZADO */}
      <div className="flex flex-col mb-10 mt-6 px-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
            <BookOpenText size={28} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Fundamentos</h2>
        </div>
      </div>

      {/* SEÇÃO APRENDER (Cards com Glassmorphism) */}
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">Aprender</h3>
      <div className="grid gap-4 mb-10">
        {learnOptions.map((opt) => (
            <button
            key={opt.id}
            onClick={() => navigate(opt.path)}
            className={`w-full text-left p-5 rounded-[2rem] border transition-all shadow-lg group 
                ${opt.color === 'blue' 
                ? 'bg-gradient-to-br from-gray-800 to-blue-900/20 border-blue-500/30 hover:border-blue-400' 
                : 'bg-gradient-to-br from-gray-800 to-emerald-900/20 border-emerald-500/30 hover:border-emerald-400'}`}
            >
            <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${opt.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'} group-hover:scale-110 transition-transform`}>
                {opt.icon}
                </div>
                <div>
                <h3 className="text-lg font-black text-white">{opt.title}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{opt.desc}</p>
                </div>
            </div>
            </button>
        ))}
        </div>

      {/* SEÇÃO TREINAR (Cards com gradiente vibrante) */}
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">Treinar</h3>
      <div className="grid gap-4">
        {exerciseOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => navigate(opt.path)}
            className="w-full text-left p-5 rounded-[2rem] bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between shadow-lg shadow-indigo-900/30 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/20 text-white backdrop-blur-sm">
                {opt.icon}
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{opt.title}</h3>
                <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">{opt.desc}</p>
              </div>
            </div>
            <ChevronRight className="text-white/70" />
          </button>
        ))}
      </div>

      <div className="shrink-0 mt-12">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>
    </div>
  );
}