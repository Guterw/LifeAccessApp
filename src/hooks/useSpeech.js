// src/hooks/useSpeech.js
import { useState, useEffect, useCallback } from 'react';

export function useSpeech(lang = 'en-IE') { // Padrão Irlandês ativado!
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false; // Queremos que ele pare de gravar quando você fizer uma pausa
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

        setRecognition(rec);
      }
    }
  }, [lang]);

  const startListening = useCallback(() => {
    setTranscript('');
    setIsListening(true);
    recognition?.start();
  }, [recognition]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    recognition?.stop();
  }, [recognition]);

  return { transcript, isListening, startListening, stopListening, hasSupport: !!recognition };
}