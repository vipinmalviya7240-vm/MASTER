import { useState, useEffect, useCallback } from 'react';

export const useSpeech = (selectedLanguage = 'English') => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = selectedLanguage === 'Spanish' ? 'es-ES' : 
                 selectedLanguage === 'French' ? 'fr-FR' : 
                 selectedLanguage === 'German' ? 'de-DE' : 
                 selectedLanguage === 'Japanese' ? 'ja-JP' : 'en-US';

      rec.onstart = () => setIsRecording(true);
      rec.onend = () => setIsRecording(false);
      rec.onerror = (event) => {
        console.error("⚠️ Speech Recognition Error:", event.error);
        setIsRecording(false);
      };
      rec.onresult = (event) => {
        const resultText = event.results[0][0].transcript;
        setTranscript(resultText);
      };

      setRecognition(rec);
    }
  }, [selectedLanguage]);

  const startListening = useCallback(() => {
    if (recognition && !isRecording) {
      setTranscript('');
      try {
        recognition.start();
      } catch (err) {
        console.warn("Speech recognition already running or pending reset:", err);
      }
    }
  }, [recognition, isRecording]);

  const stopListening = useCallback(() => {
    if (recognition && isRecording) {
      try {
        recognition.stop();
      } catch (err) {
        console.warn("Speech recognition error during stop sequence:", err);
      }
    }
  }, [recognition, isRecording]);

  const speakText = useCallback((text) => {
    if (!window.speechSynthesis) return;
    
    // Cancel any active audio stream output
    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/[*#`_\-]/g, '').slice(0, 250); // Clean markdown tokens
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    utterance.lang = selectedLanguage === 'Spanish' ? 'es-ES' : 
                     selectedLanguage === 'French' ? 'fr-FR' : 
                     selectedLanguage === 'German' ? 'de-DE' : 
                     selectedLanguage === 'Japanese' ? 'ja-JP' : 'en-US';

    window.speechSynthesis.speak(utterance);
  }, [selectedLanguage]);

  return {
    isRecording,
    transcript,
    startListening,
    stopListening,
    speakText,
    speechSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  };
};
