import React, { useState } from 'react';
import { useStore } from '../store';
import { generateBattleReport } from '../services/competitorAnalysisService';
import { BattleReport, ProcessingState, BrandDNA } from '../types';
import { Swords, Trophy, AlertTriangle, ArrowRight, Activity, TrendingUp, ShieldAlert, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const BattleModePage = () => {
  const { brands } = useStore();
  const [selectedA, setSelectedA] = useState<string>('');
  const [selectedB, setSelectedB] = useState<string>('');
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const [report, setReport] = useState<BattleReport | null>(null);

  const brandA = brands.find(b => b.id === selectedA);
  const brandB = brands.find(b => b.id === selectedB);

  const handleBattle = async () => {
    if (!brandA || !brandB) return;
    
    setStatus(ProcessingState.ANALYZING);
    try {
      const result = await generateBattleReport(brandA, brandB);
      setReport(result);
      setStatus(ProcessingState.COMPLETE);
    } catch (e) {
      console.error(e);
      setStatus(ProcessingState.ERROR);
    }
  };

  const reset = () => {
    setReport(null);
    setStatus(ProcessingState.IDLE);
  };

  // --- RENDERING ---

  if (brands.length < 2) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md bg-dark-surface p-8 rounded-xl border border-dark-border shadow-2xl">
          <Swords className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3">Arena Empty</h2>
          <p className="text-zinc-500 mb-6">Battle Mode requires at least two extracted Brand DNAs to perform a comparative analysis.</p>
          <Link to="/extract" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold transition-all">
            Extract More Brands <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // BATTLE REPORT VIEW
  if (report && brandA && brandB) {
    const winnerId = report.scores.brandA > report.scores.brandB ? brandA.id : 
                     report.scores.brandB > report.scores.brandA ? brandB.id : null;

    return (
      <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-bold text-white flex items-center gap-3">
             <Swords className="w-8 h-8 text-brand-500" /> Battle Report
           </h1>
           <button onClick={reset} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm">
             New Battle
           </button>
        </div>

        {/* Header Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           {/* Brand A */}
           <div className={`p-6 rounded-xl border relative overflow-hidden ${winnerId === brandA.id ? 'bg-brand-900/10 border-brand-500/50 shadow-[0_0_30px_rgba(20,184,166,0.1)]' : 'bg-dark-surface border-dark-border opacity-80'}`}>
              <h2 className="text-xl font-bold text-white mb-1">{brandA.name}</h2>
              <div className="text-4xl font-black text-brand-400 mb-2">{report.scores.brandA}</div>
              <p className="text-xs text-zinc-500">{brandA.tagline}</p>
              {winnerId === brandA.id && <Trophy className="absolute top-4 right-4 w-6 h-6 text-yellow-500 animate-bounce" />}
           </div>

           {/* VS / Outcome */}
           <div className="flex flex-col items-center justify-center text-center">
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Outcome</div>
              <div className="text-2xl font-bold text-white mb-1">
                {winnerId === brandA.id ? `${brandA.name} Wins` : 
                 winnerId === brandB.id ? `${brandB.name} Wins` : "It's a Draw"}
              </div>
              <div className="text-sm text-zinc-400">
                Overlap: <span className="text-white">{report.marketPositioning.overlap}</span>
              </div>
           </div>

           {/* Brand B */}
           <div className={`p-6 rounded-xl border relative overflow-hidden ${winnerId === brandB.id ? 'bg-brand-900/10 border-brand-500/50 shadow-[0_0_30px_rgba(20,184,166,0.1)]' : 'bg-dark-surface border-dark-border opacity-80'}`}>
              <h2 className="text-xl font-bold text-white mb-1">{brandB.name}</h2>
              <div className="text-4xl font-black text-brand-400 mb-2">{report.scores.brandB}</div>
              <p className="text-xs text-zinc-500">{brandB.tagline}</p>
              {winnerId === brandB.id && <Trophy className="absolute top-4 right-4 w-6 h-6 text-yellow-500 animate-bounce" />}
           </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           {/* Scores Chart */}
           <div className="bg-dark-surface border border-dark-border p-6 rounded-xl">
              <h3 className="text-sm font-bold text-white uppercase mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" /> Performance Breakdown
              </h3>
              <div className="space-y-6">
                {report.scores.breakdown.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>{brandA.name} ({item.scoreA})</span>
                      <span className="font-bold text-white">{item.category}</span>
                      <span>{brandB.name} ({item.scoreB})</span>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden bg-zinc-800">
                      <div className="bg-blue-500" style={{ width: `${item.scoreA}%` }} />
                      <div className="bg-zinc-900 flex-1" />
                      <div className="bg-purple-500" style={{ width: `${item.scoreB}%` }} />
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Gaps */}
           <div className="bg-dark-surface border border-dark-border p-6 rounded-xl">
              <h3 className="text-sm font-bold text-white uppercase mb-6 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" /> Vulnerability & Gaps
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-black/20 rounded-lg">
                   <div className="text-xs text-zinc-500 uppercase mb-2">Missing in {brandA.name}</div>
                   <ul className="space-y-2">
                     {report.gapAnalysis.brandAMissing.map((g, i) => (
                       <li key={i} className="text-xs text-red-300 flex items-start gap-2">
                         <span className="mt-1 w-1 h-1 rounded-full bg-red-500 shrink-0"/> {g}
                       </li>
                     ))}
                   </ul>
                 </div>
                 <div className="p-4 bg-black/20 rounded-lg">
                   <div className="text-xs text-zinc-500 uppercase mb-2">Missing in {brandB.name}</div>
                   <ul className="space-y-2">
                     {report.gapAnalysis.brandBMissing.map((g, i) => (
                       <li key={i} className="text-xs text-red-300 flex items-start gap-2">
                         <span className="mt-1 w-1 h-1 rounded-full bg-red-500 shrink-0"/> {g}
                       </li>
                     ))}
                   </ul>
                 </div>
              </div>
           </div>
        </div>

        {/* Text Analysis */}
        <div className="space-y-4 mb-8">
           <div className="bg-dark-surface border border-dark-border p-6 rounded-xl">
             <div className="flex items-center justify-between mb-2">
               <h3 className="font-bold text-white">Visual Analysis</h3>
               <span className="text-xs text-zinc-500 uppercase">Edge: {report.visualAnalysis.winner === 'A' ? brandA.name : report.visualAnalysis.winner === 'B' ? brandB.name : 'Tie'}</span>
             </div>
             <p className="text-zinc-400 text-sm leading-relaxed">{report.visualAnalysis.summary}</p>
           </div>
           
           <div className="bg-dark-surface border border-dark-border p-6 rounded-xl">
             <div className="flex items-center justify-between mb-2">
               <h3 className="font-bold text-white">Messaging & Tone</h3>
               <span className="text-xs text-zinc-500 uppercase">Edge: {report.messagingAnalysis.winner === 'A' ? brandA.name : report.messagingAnalysis.winner === 'B' ? brandB.name : 'Tie'}</span>
             </div>
             <p className="text-zinc-400 text-sm leading-relaxed">{report.messagingAnalysis.summary}</p>
           </div>

           <div className="bg-brand-900/10 border border-brand-900/30 p-6 rounded-xl">
              <h3 className="font-bold text-brand-400 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" /> Strategist's Critique
              </h3>
              <p className="text-brand-100/80 text-sm leading-relaxed">{report.critique}</p>
           </div>
        </div>

      </div>
    );
  }

  // CONFIG VIEW
  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col items-center justify-center">
       <div className="mb-12 text-center">
         <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Battle Mode</h1>
         <p className="text-zinc-400">Head-to-head competitive analysis simulation.</p>
       </div>

       <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl">
          {/* Left Corner */}
          <div className="flex-1 w-full bg-dark-surface p-6 rounded-xl border border-dark-border shadow-lg">
             <label className="block text-xs font-bold text-blue-500 uppercase mb-3">Challenger 1</label>
             <select 
               value={selectedA}
               onChange={(e) => setSelectedA(e.target.value)}
               className="w-full bg-black/40 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none mb-4"
             >
               <option value="">Select Brand...</option>
               {brands.map(b => <option key={b.id} value={b.id} disabled={b.id === selectedB}>{b.name}</option>)}
             </select>
             {brandA && (
               <div className="text-sm text-zinc-400">
                 <div className="font-bold text-white mb-1">{brandA.tagline}</div>
                 <div className="text-xs">Extracted: {new Date(brandA.extractedAt).toLocaleDateString()}</div>
               </div>
             )}
          </div>

          {/* VS */}
          <div className="shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-brand-500 text-black font-black text-xl shadow-[0_0_30px_rgba(20,184,166,0.6)] z-10">
            VS
          </div>

          {/* Right Corner */}
          <div className="flex-1 w-full bg-dark-surface p-6 rounded-xl border border-dark-border shadow-lg">
             <label className="block text-xs font-bold text-purple-500 uppercase mb-3">Challenger 2</label>
             <select 
               value={selectedB}
               onChange={(e) => setSelectedB(e.target.value)}
               className="w-full bg-black/40 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none mb-4"
             >
               <option value="">Select Brand...</option>
               {brands.map(b => <option key={b.id} value={b.id} disabled={b.id === selectedA}>{b.name}</option>)}
             </select>
             {brandB && (
               <div className="text-sm text-zinc-400">
                 <div className="font-bold text-white mb-1">{brandB.tagline}</div>
                 <div className="text-xs">Extracted: {new Date(brandB.extractedAt).toLocaleDateString()}</div>
               </div>
             )}
          </div>
       </div>

       <div className="mt-12">
         <button
           onClick={handleBattle}
           disabled={!selectedA || !selectedB || status === ProcessingState.ANALYZING}
           className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-lg tracking-wide rounded-full shadow-2xl hover:shadow-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
         >
           {status === ProcessingState.ANALYZING ? (
             <>Analyzing Data...</>
           ) : (
             <>
               <Swords className="w-6 h-6" /> FIGHT
             </>
           )}
         </button>
       </div>
    </div>
  );
};

export default BattleModePage;