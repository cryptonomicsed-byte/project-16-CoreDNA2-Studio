import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Mic, Volume2, Radio } from 'lucide-react';

interface SonicOrbProps {
  onCommand?: (text: string) => void;
  isProcessing?: boolean;
}

export interface SonicOrbRef {
  speak: (text: string) => void;
  stop: () => void;
}

export const SonicOrb = forwardRef<SonicOrbRef, SonicOrbProps>(({ onCommand, isProcessing = false }, ref) => {
  const [isActive, setIsActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    speak: (text: string) => {
      if ('speechSynthesis' in window) {
        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        // Try to find a good voice
        const preferredVoice = voices.find(v => 
          (v.name.includes('Google') && v.lang.includes('en')) || 
          v.name.includes('Samantha')
        );
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.pitch = 1.0;
        utterance.rate = 1.1;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
      }
    },
    stop: () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsActive(false);
      setIsSpeaking(false);
    }
  }));

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => setIsActive(true);

      recognitionRef.current.onresult = (event: any) => {
        const t = event.results[0][0].transcript;
        setTranscript(t);
      };

      recognitionRef.current.onend = () => {
        setIsActive(false);
        // Only trigger command if we actually heard something and it wasn't manually stopped
        // We use a timeout to let the state settle, checking transcript ref/state
      };
      
      // We need to capture the transcript at the exact moment of ending
      recognitionRef.current.onspeechend = () => {
         // processing happens in onend or manually handled
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  // Effect to trigger command when active goes false and we have a transcript
  useEffect(() => {
    if (!isActive && transcript && onCommand) {
      const cmd = transcript;
      setTranscript(''); // clear for next time
      onCommand(cmd);
    }
  }, [isActive, transcript, onCommand]);

  const toggleMic = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (isActive) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Mic start failed", e);
        setIsActive(false);
      }
    }
  };

  return (
    <div className="relative group">
       {/* Transcript Floating Label */}
       {transcript && isActive && (
        <div className="absolute bottom-full right-0 mb-4 w-64 p-3 bg-black/90 backdrop-blur border border-brand-500/30 rounded-xl rounded-br-none text-sm text-white shadow-[0_0_20px_rgba(20,184,166,0.2)] animate-in fade-in slide-in-from-bottom-2">
          <p className="font-mono text-brand-400 text-[10px] uppercase mb-1">Listening...</p>
          <p>"{transcript}"</p>
        </div>
      )}

      {/* Rings & FX */}
      <button
        onClick={toggleMic}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 outline-none ${
          isActive || isSpeaking || isProcessing
            ? 'scale-110 shadow-[0_0_30px_rgba(20,184,166,0.4)]' 
            : 'hover:scale-105 hover:bg-zinc-800 shadow-lg'
        }`}
      >
        {/* Processing Ring */}
        {isProcessing && (
           <div className="absolute inset-[-8px] rounded-full border-2 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin"></div>
        )}

        {/* Active/Speaking Pulse */}
        {(isActive || isSpeaking) && (
          <>
            <div className={`absolute inset-0 rounded-full border border-brand-500 ${isActive ? 'animate-ping' : 'animate-pulse'} opacity-40`}></div>
            <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-md"></div>
          </>
        )}

        {/* Main Orb */}
        <div className={`z-10 w-full h-full rounded-full flex items-center justify-center border transition-colors duration-300 ${
          isActive ? 'bg-brand-600 border-brand-400 text-white' :
          isSpeaking ? 'bg-amber-500 border-amber-300 text-white' :
          isProcessing ? 'bg-purple-600 border-purple-400 text-white' :
          'bg-zinc-900 border-zinc-700 text-zinc-400'
        }`}>
          {isSpeaking ? <Volume2 className="w-6 h-6 animate-pulse" /> : 
           isProcessing ? <Radio className="w-6 h-6 animate-pulse" /> :
           <Mic className={`w-6 h-6 ${isActive ? 'animate-bounce' : ''}`} />
          }
        </div>
      </button>
    </div>
  );
});

SonicOrb.displayName = 'SonicOrb';