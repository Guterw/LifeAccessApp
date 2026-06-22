// src/features/languages/english/views/alpha-numbers/NumbersLearnView.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, Hash, PlayCircle } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import BackButton from '../../../../../components/BackButton';
import FooterBrand from '../../../../../components/FooterBrand';

export default function NumbersLearnView() {
  const { t, uiLang } = useLanguage();
  const navigate = useNavigate();

  // Movido para dentro do componente para ter acesso ao `t()` e `uiLang`
  const NUMBER_GROUPS = [
    {
      title: t('alpha.units', 'Unidades (0 - 9)'),
      items: [
        { num: '0', word: 'Zero', pt: 'zírou', es: 'zirou', en: 'zee-ro' },
        { num: '1', word: 'One', pt: 'uân', es: 'uan', en: 'wun' },
        { num: '2', word: 'Two', pt: 'tchu', es: 'chu', en: 'too' },
        { num: '3', word: 'Three', pt: 'th-ri', es: 'z-ri', en: 'three' },
        { num: '4', word: 'Four', pt: 'fór', es: 'for', en: 'for' },
        { num: '5', word: 'Five', pt: 'faiv', es: 'faiv', en: 'fyv' },
        { num: '6', word: 'Six', pt: 'siks', es: 'siks', en: 'siks' },
        { num: '7', word: 'Seven', pt: 'sévén', es: 'seven', en: 'sev-en' },
        { num: '8', word: 'Eight', pt: 'eit', es: 'eit', en: 'ayt' },
        { num: '9', word: 'Nine', pt: 'nain', es: 'nain', en: 'nyn' }
      ]
    },
    {
      title: t('alpha.teens', 'Dezenas Irregulares (10 - 19)'),
      items: [
        { num: '10', word: 'Ten', pt: 'ten', es: 'ten', en: 'ten' },
        { num: '11', word: 'Eleven', pt: 'iléven', es: 'ileven', en: 'ih-lev-en' },
        { num: '12', word: 'Twelve', pt: 'tchuélv', es: 'chuelv', en: 'twelv' },
        { num: '13', word: 'Thirteen', pt: 'th-rtín', es: 'z-rtin', en: 'thur-teen' },
        { num: '14', word: 'Fourteen', pt: 'fortín', es: 'fortin', en: 'for-teen' },
        { num: '15', word: 'Fifteen', pt: 'fiftín', es: 'fiftin', en: 'fif-teen' },
        { num: '16', word: 'Sixteen', pt: 'sikstín', es: 'sikstin', en: 'siks-teen' },
        { num: '17', word: 'Seventeen', pt: 'seventín', es: 'seventin', en: 'sev-en-teen' },
        { num: '18', word: 'Eighteen', pt: 'eitín', es: 'eitin', en: 'ay-teen' },
        { num: '19', word: 'Nineteen', pt: 'naintín', es: 'naintin', en: 'nyn-teen' }
      ]
    },
    {
      title: t('alpha.tens', 'Dezenas (20 - 90)'),
      items: [
        { num: '20', word: 'Twenty', pt: 'tchuênti', es: 'chuenti', en: 'twen-tee' },
        { num: '30', word: 'Thirty', pt: 'th-rti', es: 'z-rti', en: 'thur-tee' },
        { num: '40', word: 'Forty', pt: 'fórti', es: 'forti', en: 'for-tee' },
        { num: '50', word: 'Fifty', pt: 'fifti', es: 'fifti', en: 'fif-tee' },
        { num: '60', word: 'Sixty', pt: 'siksti', es: 'siksti', en: 'siks-tee' },
        { num: '70', word: 'Seventy', pt: 'séventi', es: 'seventi', en: 'sev-en-tee' },
        { num: '80', word: 'Eighty', pt: 'eiti', es: 'eiti', en: 'ay-tee' },
        { num: '90', word: 'Ninety', pt: 'nainti', es: 'nainti', en: 'nyn-tee' }
      ]
    },
    {
      title: t('alpha.largeNumbers', 'Números Grandes'),
      items: [
        { num: '100', word: 'One hundred', pt: 'uân rândred', es: 'uan jandred', en: 'wun hun-dred' },
        { num: '1,000', word: 'One thousand', pt: 'uân tháuzand', es: 'uan zauzand', en: 'wun thou-zand' }
      ]
    }
  ];

  const playAudio = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IE'; // Sotaque Irlandês
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
        <div className="w-9 h-9 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shadow-inner flex items-center justify-center shrink-0 mr-3">
          <Hash size={18} />
        </div>
        <h2 className="text-lg font-black text-white tracking-wide">
          {t('alpha.numbersTitle', 'Os Números')}
        </h2>
      </div>

      {/* ÁREA DE ROLAGEM */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
        
        {/* BANNER AVISO */}
        <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <PlayCircle size={20} className="text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-200 leading-relaxed font-medium">
            {t('alpha.numbersBanner', 'Toque nos números para ouvir a pronúncia. O texto embaixo é como o número soa usando os sons do seu idioma.')}
          </p>
        </div>
        
        {NUMBER_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="w-full">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">
              {group.title}
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {group.items.map((item) => (
                <button
                  key={item.num}
                  onClick={() => playAudio(item.word)}
                  className="bg-gray-800 border border-gray-700 hover:border-emerald-500 hover:bg-gray-700 rounded-2xl p-3 flex flex-col items-center justify-center transition-all shadow-lg active:scale-95 group"
                >
                  <span className="text-2xl font-black text-white mb-0.5 group-hover:text-emerald-400 transition-colors">
                    {item.num}
                  </span>
                  <span className="text-xs font-bold text-gray-300 mb-1">
                    {item.word}
                  </span>
                  {/* Puxa a fonética correspondente ao idioma atual */}
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest bg-gray-900/50 px-2 py-0.5 rounded-full">
                    {item[uiLang] || item.pt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="h-4"></div>
      </div>

      {/* FOOTER DA MARCA */}
      <div className="shrink-0 bg-gray-900 border-t border-gray-800 py-3 flex items-center justify-center">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-gray-500" />
      </div>

    </div>
  );
}