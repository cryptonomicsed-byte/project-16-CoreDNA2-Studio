
import React, { useEffect, useState } from 'react';
import { BrandDNA, TrendItem } from '../types';
import { getBrandTrends } from '../services/rocketNewService';
import { TrendingUp, RefreshCw, ArrowUpRight, Sparkles, Flame, AlertCircle, Settings, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrendPulseProps {
  currentBrand: BrandDNA | null;
}

export const TrendPulse: React.FC<TrendPulseProps> = ({ currentBrand }) => {
  const [trends, setTrends] = useState<(TrendItem & { isSimulated?: boolean })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string, code?: string} | null>(null);

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBrandTrends(currentBrand || undefined);
      setTrends(data);
    } catch (e: any) {
      console.error(e);
      setError({ message: e.message || "Failed to pulse trends", code: e.code });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [currentBrand?.id]);

  const hasSimulatedData = trends.some(t => t.isSimulated);

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> Trend Pulse
          </h2>
          {hasSimulatedData && !loading && (
             <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Simulated Intelligence Active</span>
             </div>
          )}
        </div>
        <button 
          onClick={fetchTrends} 
          disabled={loading}
          className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 space-y-3 min-h-[200px]">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-500" />
          <p className="text-xs">Scanning global signals...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-4">
           <AlertCircle className="w-10 h-10 text-red-500/50" />
           <div className="space-y-1">
              <p className="text-sm font-bold text-zinc-300">Analysis Halted</p>
              <p className="text-xs text-zinc-500 leading-relaxed">{error.message}</p>
           </div>
           {(error.code === 'QUOTA_EXCEEDED' || error.code === 'BILLING_ISSUE') && (
              <Link to="/settings" className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 text-[10px] font-black uppercase rounded-lg border border-red-900/30 transition-all flex items-center gap-2">
                <Settings className="w-3 h-3" /> Change Provider
              </Link>
           )}
           <button onClick={fetchTrends} className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest">Retry Pulse</button>
        </div>
      ) : (
        <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {trends.map((trend) => (
            <div key={trend.id} className={`group bg-black/20 hover:bg-black/40 border ${trend.isSimulated ? 'border-amber-900/20 hover:border-amber-500/30' : 'border-zinc-800 hover:border-brand-500/30'} rounded-lg p-4 transition-all relative overflow-hidden`}>
              {trend.isSimulated && (
                <div className="absolute top-0 right-0 p-1 bg-amber-950/20">
                   <Cpu className="w-3 h-3 text-amber-500/30" />
                </div>
              )}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{trend.topic}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {trend.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {trend.volume} Volume
                  </p>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded ${
                  trend.relevanceScore > 80 ? 'bg-green-900/20 text-green-400' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {trend.relevanceScore}% Match
                </div>
              </div>
              
              <p className="text-xs text-zinc-400 mb-3 leading-relaxed">{trend.summary}</p>
              
              <div className="border-t border-zinc-800/50 pt-3">
                <p className="text-[10px] text-brand-500 uppercase font-bold mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Content Angles
                </p>
                <div className="space-y-1">
                  {trend.suggestedAngles.map((angle, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-300 hover:text-white cursor-default">
                      <ArrowUpRight className="w-3 h-3 mt-0.5 text-zinc-600 group-hover:text-brand-500 transition-colors" />
                      {angle}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {trends.length === 0 && !loading && (
             <p className="text-center text-zinc-500 text-sm py-4">No trends detected.</p>
          )}
          {hasSimulatedData && (
             <div className="p-3 bg-amber-950/10 border border-amber-900/20 rounded-lg">
                <p className="text-[10px] text-amber-500/80 leading-relaxed font-medium">
                   <strong>Neural Cache Active:</strong> The current AI provider is reporting quota exhaustion. Showing high-relevance cached trends to ensure continuous strategy workflow.
                </p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};
