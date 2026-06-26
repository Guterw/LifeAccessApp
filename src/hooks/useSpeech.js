// src/hooks/useSpeech.js
import { useState, useCallback, useRef } from 'react';

export function useSpeech(lang = 'en-IE') { // Padrão Irlandês ativado!
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Usamos useRef em vez de state para guardar o motor do microfone,
  // pois não queremos causar re-renders desnecessários.
  const recognitionRef = useRef(null);

  // Verificação de suporte em tempo real
  const hasSupport = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = useCallback(() => {
    if (!hasSupport) {
      console.warn('Reconhecimento de voz não suportado neste navegador.');
      return;
    }

    try {
      // 1. CRIAMOS A INSTÂNCIA NA HORA DO CLIQUE (Obrigatório para iOS)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();

      rec.continuous = false; // Para de gravar nas pausas (ideal para iOS)
      rec.interimResults = true; 
      rec.lang = lang; 

      rec.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      rec.onerror = (event) => {
        console.error('Erro no microfone:', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      // 2. Limpamos o estado antigo e atualizamos as referências
      setTranscript('');
      setIsListening(true);
      recognitionRef.current = rec;

      // 3. DISPARAMOS O GRAVADOR (Protegido por try/catch para evitar crashes mudos da Apple)
      rec.start();
      
    } catch (error) {
      console.error('Falha ao iniciar o reconhecimento de voz:', error);
      setIsListening(false);
    }
  }, [lang, hasSupport]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignora erros ao tentar parar uma gravação que já caiu
      }
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return { 
    transcript, 
    isListening, 
    startListening, 
    stopListening, 
    resetTranscript, 
    hasSupport 
  };
}