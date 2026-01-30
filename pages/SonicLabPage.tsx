import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { SonicOrb, SonicOrbRef } from '../components/SonicOrb';
import { sonicChat } from '../services/geminiService';
import { Send, User, Bot, Sparkles, VolumeX, AlertCircle, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const SonicLabPage = () => {
  const { currentBrand } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: currentBrand 
        ? `Systems initialized. I am analyzing the ${currentBrand.name} brand matrix. How can I assist you today?` 
        : `Greetings. I am Sonic, your AI Brand Co-Pilot. Please extract a brand DNA first to unlock my full capabilities, or ask me general marketing questions.`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const orbRef = useRef<SonicOrbRef>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      // 2. Call API
      // Prepare history (excluding the welcome message if it's too generic, or keeping it)
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      
      const responseText = await sonicChat(
        history, 
        text, 
        currentBrand || undefined
      );

      // 3. Add Model Message
      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);

      // 4. Trigger Voice
      orbRef.current?.speak(responseText);

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        text: "I encountered a neural disruption. Please verify your connection and API keys.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      orbRef.current?.speak("I encountered an error.");
    } finally {
      setIsProcessing(false);
    }
  };

  const stopSpeaking = () => {
    orbRef.current?.stop();
  };

  return (
    <div className="h-full flex flex-col relative bg-dark-bg">
      {/* Background FX */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-900/5 rounded-full blur-[120px] animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-dark-border bg-dark-surface/80 backdrop-blur flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" /> Sonic Co-Pilot
          </h1>
          <p className="text-xs text-zinc-500">
            {currentBrand ? `Active Context: ${currentBrand.name}` : 'No Brand Context Loaded'}
          </p>
        </div>
        <div className="flex gap-2">
           <button onClick={stopSpeaking} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white" title="Stop Speaking">
             <VolumeX className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 relative z-10 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' 
                ? 'bg-zinc-800 text-zinc-400' 
                : 'bg-brand-600 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-5 py-4 ${
              msg.role === 'user'
                ? 'bg-zinc-800 text-zinc-100 rounded-tr-none'
                : 'bg-dark-surface border border-dark-border text-zinc-200 rounded-tl-none shadow-lg'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <p className="text-[10px] text-zinc-600 mt-2 text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex gap-4 animate-in fade-in">
             <div className="w-10 h-10 rounded-full bg-brand-600/50 flex items-center justify-center shrink-0 animate-pulse">
                <RefreshCw className="w-5 h-5 text-white animate-spin" />
             </div>
             <div className="bg-dark-surface border border-dark-border rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></span>
                <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></span>
                <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative z-20 p-6 bg-dark-bg border-t border-dark-border">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          
          {/* Sonic Orb (Input Trigger) */}
          <div className="shrink-0">
            <SonicOrb 
              ref={orbRef} 
              onCommand={handleSendMessage} 
              isProcessing={isProcessing} 
            />
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder={currentBrand ? "Ask Sonic to create, analyze, or advise..." : "Initialize brand first..."}
              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-full py-4 pl-6 pr-12 text-white placeholder-zinc-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              disabled={isProcessing}
            />
            <button 
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isProcessing}
              className="absolute right-2 top-2 p-2 bg-zinc-800 hover:bg-brand-600 text-zinc-400 hover:text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {!currentBrand && (
           <div className="flex items-center justify-center gap-2 mt-4 text-xs text-amber-500">
             <AlertCircle className="w-3 h-3" />
             <span>Limited Capability Mode: Extract Brand DNA to unlock full strategic power.</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default SonicLabPage;