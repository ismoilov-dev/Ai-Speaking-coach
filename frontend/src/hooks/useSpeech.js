// hooks/useSpeech.js - Browser Web Speech API integration
// Handles both speech-to-text (microphone) and text-to-speech (AI voice)

import { useState, useRef, useCallback } from 'react';

export function useSpeech({ onTranscript, onError }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const [ttsSupported] = useState(() => 'speechSynthesis' in window);

  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);

  // ─────────────────────────────────────────────
  //  Speech-to-Text (Microphone → Text)
  // ─────────────────────────────────────────────

  const startListening = useCallback(() => {
    if (!speechSupported) {
      onError?.('Speech recognition is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    // Create recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure recognition
    recognition.lang = 'en-US';          // English only
    recognition.continuous = false;       // Stop after one utterance
    recognition.interimResults = false;   // Only final results

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      // Get the transcript from the recognition result
      const transcript = event.results[0][0].transcript;
      onTranscript?.(transcript);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        onError?.('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (event.error === 'no-speech') {
        onError?.('No speech detected. Please try again.');
      } else {
        onError?.(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [speechSupported, onTranscript, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  // ─────────────────────────────────────────────
  //  Text-to-Speech (Text → AI Voice)
  // ─────────────────────────────────────────────

  const speak = useCallback((text) => {
    if (!ttsSupported) return;

    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Configure voice settings for natural English
    utterance.lang = 'en-US';
    utterance.rate = 0.9;     // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to use a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      v.name.includes('Samantha') ||  // macOS natural voice
      v.name.includes('Google US English') ||
      v.name.includes('Microsoft Zira') ||
      (v.lang === 'en-US' && v.localService)
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [ttsSupported]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    speechSupported,
    ttsSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
