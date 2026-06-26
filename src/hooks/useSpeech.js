// src/hooks/useSpeech.js
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useSpeech — hook de reconhecimento de voz refinado
 * 
 * Melhorias v2:
 * - Timeout configurável (padrão 8s) antes de auto-parar
 * - Retry automático quando o reconhecimento cai sem resultado (até MAX_RETRIES)
 * - continuous=true para capturar frases mais longas sem parar no silêncio
 * - interimResults=true para feedback visual em tempo real
 * - onStatus callback: 'listening' | 'stopped' | 'no_speech' | 'error'
 * - Limpeza segura de instâncias antigas antes de criar novas (crítico no iOS)
 */

const MAX_RETRIES = 2;
const SILENCE_TIMEOUT_MS = 8000; // 8 segundos sem fala → para automaticamente

export function useSpeech(lang = 'en-IE') {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechStatus, setSpeechStatus] = useState(null); // 'listening'|'stopped'|'no_speech'|'error'

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const retryCountRef = useRef(0);
  const isListeningRef = useRef(false); // ref espelho para uso nos callbacks
  const accumulatedTranscriptRef = useRef('');

  const hasSupport =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Limpa o timer de silêncio
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Para o reconhecimento de forma segura
  const stopSafely = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (_) {}
      recognitionRef.current = null;
    }
    isListeningRef.current = false;
    setIsListening(false);
  }, [clearSilenceTimer]);

  // Inicia (ou reinicia) o reconhecimento
  const startListening = useCallback(() => {
    if (!hasSupport) return;

    // Destrói instância anterior para evitar conflitos (crítico no iOS)
    stopSafely();
    retryCountRef.current = 0;
    accumulatedTranscriptRef.current = '';
    setTranscript('');
    setSpeechStatus('listening');

    const launch = () => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();

      // ── Configurações de sensibilidade ──────────────────────────
      rec.continuous = true;        // não para em pausas curtas
      rec.interimResults = true;    // mostra resultado parcial em tempo real
      rec.maxAlternatives = 3;      // considera até 3 alternativas (maior chance de acerto)
      rec.lang = lang;
      // ────────────────────────────────────────────────────────────

      rec.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
        setSpeechStatus('listening');

        // Reinicia o timer de silêncio a cada nova sessão
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            setSpeechStatus('no_speech');
            stopSafely();
          }
        }, SILENCE_TIMEOUT_MS);
      };

      rec.onresult = (event) => {
        // Reinicia o timer de silêncio ao detectar qualquer fala
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            setSpeechStatus('no_speech');
            stopSafely();
          }
        }, SILENCE_TIMEOUT_MS);

        let finalText = '';
        let interimText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            // Pega a melhor alternativa entre as maxAlternatives
            finalText += result[0].transcript;
          } else {
            interimText += result[0].transcript;
          }
        }

        // Acumula o texto final e exibe interim imediatamente
        if (finalText) {
          accumulatedTranscriptRef.current =
            (accumulatedTranscriptRef.current + ' ' + finalText).trim();
        }

        const displayText =
          accumulatedTranscriptRef.current +
          (interimText ? ' ' + interimText : '');
        setTranscript(displayText.trim());
        retryCountRef.current = 0; // reset retry após fala detectada
      };

      rec.onnomatch = () => {
        setSpeechStatus('no_speech');
      };

      rec.onerror = (event) => {
        // 'no-speech' é comum e não é um erro fatal
        if (event.error === 'no-speech') {
          setSpeechStatus('no_speech');
          // Tenta reiniciar automaticamente se não atingiu o limite
          if (retryCountRef.current < MAX_RETRIES && isListeningRef.current) {
            retryCountRef.current += 1;
            stopSafely();
            setTimeout(() => {
              if (!isListeningRef.current) {
                isListeningRef.current = true;
                setIsListening(true);
                launch();
              }
            }, 300);
          } else {
            stopSafely();
          }
          return;
        }

        // 'aborted' acontece quando paramos manualmente — não é erro
        if (event.error === 'aborted') return;

        console.warn('[useSpeech] erro:', event.error);
        setSpeechStatus('error');
        stopSafely();
      };

      rec.onend = () => {
        // Se ainda deveria estar ouvindo e não houve erro → reinicia (keepalive)
        if (isListeningRef.current && retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current += 1;
          try {
            rec.start();
            return; // Continua sem alterar estados
          } catch (_) {}
        }
        // Se não conseguiu reiniciar, encerra oficialmente
        clearSilenceTimer();
        isListeningRef.current = false;
        setIsListening(false);
        if (!accumulatedTranscriptRef.current) {
          setSpeechStatus('no_speech');
        } else {
          setSpeechStatus('stopped');
        }
      };

      recognitionRef.current = rec;
      try {
        rec.start();
      } catch (err) {
        console.error('[useSpeech] falha ao iniciar:', err);
        setSpeechStatus('error');
        stopSafely();
      }
    };

    launch();
  }, [lang, hasSupport, stopSafely, clearSilenceTimer]);

  const stopListening = useCallback(() => {
    if (!isListeningRef.current) return;
    setSpeechStatus('stopped');
    stopSafely();
  }, [stopSafely]);

  const resetTranscript = useCallback(() => {
    accumulatedTranscriptRef.current = '';
    setTranscript('');
    setSpeechStatus(null);
    retryCountRef.current = 0;
  }, []);

  // Limpeza ao desmontar o componente
  useEffect(() => {
    return () => {
      stopSafely();
    };
  }, [stopSafely]);

  return {
    transcript,
    isListening,
    speechStatus, // novo: permite mostrar toasts/logs na UI
    startListening,
    stopListening,
    resetTranscript,
    hasSupport,
  };
}