// src/features/languages/english/views/alpha-numbers/AlphabetLearnView.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, PlayCircle } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import BackButton from '../../../../../components/BackButton';
import FooterBrand from '../../../../../components/FooterBrand';

// Fonética adaptada para cada idioma (Como a letra inglesa soa lendo com as regras daquele idioma)
const ALPHABET = [
  { letter: 'A', pt: 'ei', es: 'ei', en: 'ay' },
  { letter: 'B', pt: 'bi', es: 'bi', en: 'bee' },
  { letter: 'C', pt: 'si', es: 'si', en: 'see' },
  { letter: 'D', pt: 'di', es: 'di', en: 'dee' },
  { letter: 'E', pt: 'i', es: 'i', en: 'ee' },
  { letter: 'F', pt: 'ef', es: 'ef', en: 'eff' },
  { letter: 'G', pt: 'dji', es: 'yi', en: 'jee' },
  { letter: 'H', pt: 'eitch', es: 'eich', en: 'aych' },
  { letter: 'I', pt: 'ai', es: 'ai', en: 'eye' },
  { letter: 'J', pt: 'djei', es: 'yei', en: 'jay' },
  { letter: 'K', pt: 'kei', es: 'kei', en: 'kay' },
  { letter: 'L', pt: 'el', es: 'el', en: 'ell' },
  { letter: 'M', pt: 'em', es: 'em', en: 'em' },
  { letter: 'N', pt: 'en', es: 'en', en: 'en' },
  { letter: 'O', pt: 'ou', es: 'ou', en: 'oh' },
  { letter: 'P', pt: 'pi', es: 'pi', en: 'pee' },
  { letter: 'Q', pt: 'kiu', es: 'kiu', en: 'cue' },
  { letter: 'R', pt: 'ar', es: 'ar', en: 'ar' },
  { letter: 'S', pt: 'es', es: 'es', en: 'ess' },
  { letter: 'T', pt: 'ti', es: 'ti', en: 'tee' },
  { letter: 'U', pt: 'iu', es: 'iu', en: 'you' },
  { letter: 'V', pt: 'vi', es: 'vi', en: 'vee' },
  { letter: 'W', pt: 'dâbliu', es: 'dabel iu', en: 'double-u' },
  { letter: 'X', pt: 'ex', es: 'eks', en: 'ex' },
  { letter: 'Y', pt: 'uai', es: 'uai', en: 'why' },
  { letter: 'Z', pt: 'zed / zi', es: 'zed / zi', en: 'zee / zed' }
];

export default function AlphabetLearnView() {
  const { t, uiLang } = useLanguage();
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
          {t('alpha.alphabet', 'Alfabeto')}
        </h2>
      </div>

      {/* ÁREA DE ROLAGEM */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-6 bg-blue-900/20 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <PlayCircle size={20} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-200 leading-relaxed font-medium">
            {t('alpha.alphabetBanner', 'Toque nas letras para ouvir a pronúncia. O texto embaixo é como a letra soa usando os sons do seu idioma.')}
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
              {/* O `uiLang` decide se puxa a fonética em pt, es, ou en */}
              <span aria-hidden="true" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-900/50 px-2 py-0.5 rounded-full">
                {item[uiLang] || item.pt}
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