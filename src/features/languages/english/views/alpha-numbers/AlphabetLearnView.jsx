// src/features/languages/english/views/alpha-numbers/AlphabetLearnView.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, PlayCircle } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import BackButton from '../../../../../components/BackButton';
import FooterBrand from '../../../../../components/FooterBrand';

const ALPHABET = [
  { letter: 'A', phonetic: 'ei' }, { letter: 'B', phonetic: 'bi' },
  { letter: 'C', phonetic: 'si' }, { letter: 'D', phonetic: 'di' },
  { letter: 'E', phonetic: 'i' },  { letter: 'F', phonetic: 'ef' },
  { letter: 'G', phonetic: 'dji' }, { letter: 'H', phonetic: 'eitch' },
  { letter: 'I', phonetic: 'ai' }, { letter: 'J', phonetic: 'djei' },
  { letter: 'K', phonetic: 'kei' }, { letter: 'L', phonetic: 'el' },
  { letter: 'M', phonetic: 'em' }, { letter: 'N', phonetic: 'en' },
  { letter: 'O', phonetic: 'ou' }, { letter: 'P', phonetic: 'pi' },
  { letter: 'Q', phonetic: 'kiu' }, { letter: 'R', phonetic: 'ar' },
  { letter: 'S', phonetic: 'es' }, { letter: 'T', phonetic: 'ti' },
  { letter: 'U', phonetic: 'iu' }, { letter: 'V', phonetic: 'vi' },
  { letter: 'W', phonetic: 'dâbliu' }, { letter: 'X', phonetic: 'ex' },
  { letter: 'Y', phonetic: 'uai' }, { letter: 'Z', phonetic: 'zed / zi' }
];

export default function AlphabetLearnView() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const playAudio = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    // 1. Pega o texto e limpa sujeiras
    let cleanText = String(text).replace(/[^a-zA-Z0-9\s.]/g, ''); 
    
    // 2. A MÁGICA PARA O IPHONE: Transforma tudo em minúsculo!
    // Isso impede o iOS Safari de falar "Capital A" ou "Cap B".
    cleanText = cleanText.toLowerCase();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IE';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 bottom-[80px] bg-gray-950 flex flex-col animate-fade-in z-10 overflow-hidden">
      
      {/* HEADER */}
      <div className="shrink-0 h-16 w-full bg-gray-900 border-b border-gray-800 z-20 flex items-center px-4 shadow-lg">
        <div className="shrink-0 mt-8 mr-3">
          <BackButton to="/english/alpha-numbers" label="" />
        </div>
        <div className="w-9 h-9 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 shadow-inner flex items-center justify-center shrink-0 mr-3">
          <Volume2 size={18} />
        </div>
        <h2 className="text-lg font-black text-white tracking-wide">
          {t('alpha.title', 'O Alfabeto')}
        </h2>
      </div>

      {/* ÁREA DE ROLAGEM */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-6 bg-blue-900/20 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <PlayCircle size={20} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-200 leading-relaxed font-medium">
            Toque nas letras para ouvir a pronúncia. O texto em baixo é como a letra soa usando os sons do português.
          </p>
        </div>

        {/* GRID DO ALFABETO */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pb-8">
          {ALPHABET.map((item) => (
            <button
              key={item.letter}
              onClick={() => playAudio(item.letter)}
              className="bg-gray-800 border border-gray-700 hover:border-blue-500 hover:bg-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center transition-all shadow-lg active:scale-95 group"
            >
              <span aria-hidden="true" className="text-3xl font-black text-white mb-1 group-hover:text-blue-400 transition-colors">
                {item.letter}
              </span>
              <span aria-hidden="true" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-900/50 px-2 py-0.5 rounded-full">
                {item.phonetic}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* FOOTER DA MARCA */}
      <div className="shrink-0 bg-gray-900 border-t border-gray-800 py-3 flex items-center justify-center">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-gray-500" />
      </div>

    </div>
  );
}