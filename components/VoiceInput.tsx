import React, { useState, useEffect } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = React.useRef<any>(null);

  useEffect(() => {
    // FIX: Cast window to `any` to access the non-standard SpeechRecognition API and prevent TypeScript errors.
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
      };
      recognitionRef.current = recognition;
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };
  
  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-3 rounded-full bg-[#efeeee] text-gray-500 shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] transition-colors ${isListening ? 'text-red-500 animate-pulse' : ''}`}
      aria-label="Start voice input"
    >
      <i className={`fa-solid ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
    </button>
  );
};

export default VoiceInput;