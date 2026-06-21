// src/features/languages/english/views/alpha-numbers/NumbersLearnView.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, Hash } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import BackButton from '../../../../../components/BackButton';
import FooterBrand from '../../../../../components/FooterBrand';

const NUMBER_GROUPS = [
  {
    title: 'Unidades (0 - 9)',
    items: [
      { num: '0', word: 'Zero', phonetic: 'zírou' }, { num: '1', word: 'One', phonetic: 'uân' },
      { num: '2', word: 'Two', phonetic: 'tchu' }, { num: '3', word: 'Three', phonetic: 'th-ri' },
      { num: '4', word: 'Four', phonetic: 'fór' }, { num: '5', word: 'Five', phonetic: 'faiv' },
      { num: '6', word: 'Six', phonetic: 'siks' }, { num: '7', word: 'Seven', phonetic: 'sévén' },
      { num: '8', word: 'Eight', phonetic: 'eit' }, { num: '9', word: 'Nine', phonetic: 'nain' }
    ]
  },
  {
    title: 'Dezenas Irregulares (10 - 19)',
    items: [
      { num: '10', word: 'Ten', phonetic: 'ten' }, { num: '11', word: 'Eleven', phonetic: 'iléven' },
      { num: '12', word: 'Twelve', phonetic: 'tchuélv' }, { num: '13', word: 'Thirteen', phonetic: 'th-rtín' },
      { num: '14', word: 'Fourteen', phonetic: 'fortín' }, { num: '15', word: 'Fifteen', phonetic: 'fiftín' },
      { num: '16', word: 'Sixteen', phonetic: 'sikstín' }, { num: '17', word: 'Seventeen', phonetic: 'seventín' },
      { num: '18', word: 'Eighteen', phonetic: 'eitín' }, { num: '19', word: 'Nineteen', phonetic: 'naintín' }
    ]
  },
  {
    title: 'Dezenas (20 - 90)',
    items: [
      { num: '20', word: 'Twenty', phonetic: 'tchuênti' }, { num: '30', word: 'Thirty', phonetic: 'th-rti' },
      { num: '40', word: 'Forty', phonetic: 'fórti' }, { num: '50', word: 'Fifty', phonetic: 'fifti' },
      { num: '60', word: 'Sixty', phonetic: 'siksti' }, { num: '70', word: 'Seventy', phonetic: 'séventi' },
      { num: '80', word: 'Eighty', phonetic: 'eiti' }, { num: '90', word: 'Ninety', phonetic: 'nainti' }
    ]
  },
  {
    title: 'Números Grandes',
    items: [
      { num: '100', word: 'One hundred', phonetic: 'uân rândred' },
      { num: '1,000', word: 'One thousand', phonetic: 'uân tháuzand' }
    ]
  }
];

export default function NumbersLearnView() {
  const { t } = useLanguage();
  const navigate = useNavigate();

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
          {t('numbers.title', 'Os Números')}
        </h2>
      </div>

      {/* ÁREA DE ROLAGEM */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
        
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
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest bg-gray-900/50 px-2 py-0.5 rounded-full">
                    {item.phonetic}
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