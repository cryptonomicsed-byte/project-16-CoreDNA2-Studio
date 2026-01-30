
import React, { useState } from 'react';
import { useStore } from '../store';
import { enhanceBrandExtraction } from '../services/enhancedExtractionService';
import { checkApiKey } from '../services/geminiService';
import { DNAHelix } from '../components/DNAHelix';
import { ProcessingState } from '../types';
import { Search, AlertCircle, CheckCircle2, BrainCircuit, Activity, Sparkles, Globe, Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ExtractPage = () => {
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const [progressMsg, setProgressMsg] = useState('Initializing...');
  const [error, setError] = useState<{message: string, code?: string}>({ message: '' });
  
  const { addBrand, currentBrand } = useStore();
  const navigate = useNavigate();

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({ message: '' });

    if (!checkApiKey()) {
      setError({ message: "System Error: Neural Core Disconnected (Missing API Key). Check Settings." });
      return;
    }

    setStatus(ProcessingState.ANALYZING);
    setProgressMsg("Connecting to extraction grid...");

    try {
      const brand = await enhanceBrandExtraction(url, desc, (msg) => {
        setProgressMsg(msg);
      });
      
      addBrand(brand);
      setStatus(ProcessingState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError({ 
        message: err.message || "Extraction Failed: The target refused connection or analysis timed out.",
        code: err.code
      });
      setStatus(ProcessingState.ERROR);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
       <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-brand-500" /> Extraction Protocol <span className="text-xs bg-brand-500/20 text-brand-400 px-2 py-1 rounded font-mono border border-brand-500/30">LIVE SCRAPER</span>
        </h1>
        <p className="text-zinc-400">Enter target coordinates (URL) to fetch live data and perform recursive analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <form onSubmit={handleExtract} className="space-y-6 bg-dark-surface p-6 rounded-xl border border-dark-border shadow-2xl">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Target URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-black/40 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Contextual Data (Optional)</label>
              <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Paste mission statement or brief description to aid the neural engine..."
                className="w-full h-32 bg-black/40 border border-zinc-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none transition-all"
              />
            </div>

            <button 
              type="submit"
              disabled={status === ProcessingState.ANALYZING}
              className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 text-white rounded-lg font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(13,148,136,0.3)] hover:shadow-[0_0_30px_rgba(13,148,136,0.5)] flex items-center justify-center gap-2"
            >
              {status === ProcessingState.ANALYZING ? (
                 <>
                   <Activity className="w-5 h-5 animate-pulse" />
                   RUNNING PROTOCOLS...
                 </>
              ) : (
                 <>
                   <Sparkles className="w-5 h-5" />
                   INITIATE EXTRACTION
                 </>
              )}
            </button>
            
            {status === ProcessingState.ANALYZING && (
               <div className="bg-black/30 rounded-lg p-3 border border-brand-500/20">
                  <div className="flex justify-between text-xs font-mono text-brand-400 mb-1">
                     <span>STATUS</span>
                     <span className="animate-pulse">ACTIVE</span>
                  </div>
                  <div className="text-sm text-zinc-300 font-mono">
                     {">"} {progressMsg}
                  </div>
                  <div className="mt-2 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-brand-500 w-1/3 animate-[progress_2s_ease-in-out_infinite]"></div>
                  </div>
               </div>
            )}

            {error.message && (
              <div className="space-y-3 p-4 bg-red-900/10 border border-red-900/30 rounded-xl animate-in shake duration-300">
                <div className="flex items-start gap-3 text-red-400">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold uppercase tracking-wide mb-1">Protocol Failure</p>
                    <p className="text-xs leading-relaxed opacity-80">{error.message}</p>
                  </div>
                </div>
                {error.code === 'QUOTA_EXCEEDED' && (
                  <Link to="/settings" className="flex items-center justify-center gap-2 w-full py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 text-[10px] font-black uppercase rounded-lg border border-red-900/30 transition-all">
                    <Settings className="w-3 h-3" /> Change Neural Provider in Settings
                  </Link>
                )}
              </div>
            )}
          </form>

          <div className="p-4 border border-brand-900/30 bg-brand-900/5 rounded-lg">
            <h4 className="text-brand-400 text-sm font-bold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Real-time Scraper Active
            </h4>
            <p className="text-xs text-brand-200/60 leading-relaxed">
              The engine will visit the live URL, parse the DOM structure, extract meta-tags and body content, and feed it into the <strong>Gemini RLM</strong> for synthesis.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <DNAHelix dna={currentBrand} loading={status === ProcessingState.ANALYZING} />
          
          {status === ProcessingState.COMPLETE && (
            <div className="bg-green-900/10 border border-green-900/30 p-4 rounded-xl animate-in fade-in slide-in-from-bottom-4 shadow-lg">
              <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5" /> Analysis Complete
              </h3>
              <p className="text-sm text-zinc-400 mb-4">Brand DNA has been successfully mapped from live site data.</p>
              <div className="flex gap-3">
                <button onClick={() => navigate('/campaigns')} className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-bold transition-colors">
                  Forge Campaign
                </button>
                <button onClick={() => navigate('/')} className="px-5 py-2.5 text-zinc-400 hover:text-white text-sm font-bold transition-colors">
                  Return to Hub
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); width: 50%; }
          100% { transform: translateX(200%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default ExtractPage;
