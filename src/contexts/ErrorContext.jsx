// src/contexts/ErrorContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { AlertTriangle, X, Copy, Check } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);

export function ErrorProvider({ children }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const showError = (msg) => {
    // Extrai a mensagem de erro se for um objeto de erro do JS/Firebase
    const text = typeof msg === 'string' ? msg : msg?.message || t('general.defaultError', 'Algo inesperado aconteceu.');
    setErrorMsg(text);
  };

  const closeError = () => {
    setErrorMsg(null);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (errorMsg) {
      navigator.clipboard.writeText(errorMsg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    // Captura erros gerais de JavaScript
    const handleGlobalError = (event) => {
      showError(event.error?.message || event.message);
    };

    // Captura erros de promessas (Dexie, Firebase, APIs) que não foram tratados
    const handleUnhandledRejection = (event) => {
      showError(event.reason?.message || event.reason || 'Erro de conexão/promessa.');
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}

      {/* MODAL DE ERRO ESTILIZADO (Flutuante) */}
      {errorMsg && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-red-500/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl shadow-red-900/20 relative">
            
            <button
              onClick={closeError}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4 text-red-400">
              <div className="p-3 bg-red-500/10 rounded-2xl">
                <AlertTriangle size={28} />
              </div>
              <h2 className="text-xl font-black">
                {t('general.errorTitle', 'Ops! Ocorreu um erro')}
              </h2>
            </div>

            <div className="bg-gray-950 rounded-xl p-4 mb-5 max-h-40 overflow-y-auto border border-gray-800 custom-scrollbar">
              <p className="text-sm text-gray-300 font-mono break-words selection:bg-red-500/30">
                {errorMsg}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold transition-colors text-sm"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                {copied ? t('general.errorCopied', 'Copiado!') : t('general.copyError', 'Copiar Log')}
              </button>
              <button
                onClick={closeError}
                className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors shadow-lg shadow-red-600/20 text-sm active:scale-95"
              >
                {t('general.close', 'Fechar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </ErrorContext.Provider>
  );
}