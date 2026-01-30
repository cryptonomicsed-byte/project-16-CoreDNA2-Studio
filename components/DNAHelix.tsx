import React, { useState } from 'react';
import { BrandDNA } from '../types';
import { Layers, Volume2, Target, Zap, LayoutGrid, Music, Palette, Type, Users } from 'lucide-react';

interface DNAHelixProps {
  dna: BrandDNA | null;
  loading?: boolean;
}

export const DNAHelix: React.FC<DNAHelixProps> = ({ dna, loading }) => {
  const [activeTab, setActiveTab] = useState<'identity' | 'strategy' | 'visuals' | 'sonic'>('identity');

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center relative overflow-hidden bg-black/20 rounded-xl border border-dashed border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/20 to-transparent animate-pulse"></div>
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="w-16 h-16 border-4 border-t-brand-500 border-r-transparent border-b-brand-700 border-l-transparent rounded-full animate-spin"></div>
          <p className="text-brand-500 font-mono text-xs animate-pulse tracking-widest">SEQUENCING BRAND DNA...</p>
        </div>
      </div>
    );
  }

  if (!dna) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-dark-surface rounded-xl border border-dark-border text-zinc-500">
        <p className="text-sm">No DNA Sequence Loaded</p>
      </div>
    );
  }

  // Defenses
  const primaryColor = dna.visualIdentity?.primaryColor || '#14b8a6';
  
  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
        activeTab === id
          ? 'border-brand-500 text-white bg-brand-500/5'
          : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
      }`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );

  return (
    <div className="relative w-full overflow-hidden bg-dark-surface border border-dark-border rounded-xl shadow-2xl flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-6 border-b border-dark-border bg-black/20 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">{dna.name}</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-900/30 text-brand-400 border border-brand-900/50">
              {dna.confidenceScore}% CONFIDENCE
            </span>
          </div>
          <p className="text-zinc-400 text-sm italic">"{dna.tagline}"</p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-[10px] font-mono text-zinc-600">EXTRACTED AT</div>
          <div className="text-xs text-zinc-400">{new Date(dna.extractedAt).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-border bg-black/40 overflow-x-auto">
        <TabButton id="identity" label="Core Identity" icon={Zap} />
        <TabButton id="strategy" label="Strategy & SWOT" icon={Target} />
        <TabButton id="visuals" label="Visual Matrix" icon={Palette} />
        <TabButton id="sonic" label="Sonic & Tone" icon={Volume2} />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-gradient-to-br from-dark-surface to-black">
        
        {/* TAB: IDENTITY */}
        {activeTab === 'identity' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-white/5 rounded-lg border border-white/5">
                <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3 flex items-center gap-2">
                  <LayoutGrid className="w-3 h-3" /> Mission
                </h3>
                <p className="text-zinc-200 text-sm leading-relaxed">{dna.mission}</p>
              </div>
              <div className="p-5 bg-white/5 rounded-lg border border-white/5">
                <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Elevator Pitch</h3>
                <p className="text-zinc-200 text-sm leading-relaxed italic">"{dna.elevatorPitch}"</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Core Values</h3>
              <div className="flex flex-wrap gap-2">
                {dna.coreValues?.map((val, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium">
                    {val}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Key Messaging Pillars</h3>
              <ul className="space-y-2">
                {dna.keyMessaging?.map((msg, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0"></span>
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB: STRATEGY */}
        {activeTab === 'strategy' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* SWOT */}
            <div>
               <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                 <Layers className="w-4 h-4 text-purple-500" /> Strategic Analysis (SWOT)
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-4 rounded-lg bg-green-900/10 border border-green-900/20">
                    <div className="text-xs font-bold text-green-500 uppercase mb-2">Strengths</div>
                    <ul className="list-disc list-inside text-xs text-zinc-300 space-y-1">
                      {dna.swot?.strengths?.map((s,i) => <li key={i}>{s}</li>)}
                    </ul>
                 </div>
                 <div className="p-4 rounded-lg bg-red-900/10 border border-red-900/20">
                    <div className="text-xs font-bold text-red-500 uppercase mb-2">Weaknesses</div>
                    <ul className="list-disc list-inside text-xs text-zinc-300 space-y-1">
                      {dna.swot?.weaknesses?.map((s,i) => <li key={i}>{s}</li>)}
                    </ul>
                 </div>
                 <div className="p-4 rounded-lg bg-blue-900/10 border border-blue-900/20">
                    <div className="text-xs font-bold text-blue-500 uppercase mb-2">Opportunities</div>
                    <ul className="list-disc list-inside text-xs text-zinc-300 space-y-1">
                      {dna.swot?.opportunities?.map((s,i) => <li key={i}>{s}</li>)}
                    </ul>
                 </div>
                 <div className="p-4 rounded-lg bg-orange-900/10 border border-orange-900/20">
                    <div className="text-xs font-bold text-orange-500 uppercase mb-2">Threats</div>
                    <ul className="list-disc list-inside text-xs text-zinc-300 space-y-1">
                      {dna.swot?.threats?.map((s,i) => <li key={i}>{s}</li>)}
                    </ul>
                 </div>
               </div>
            </div>

            {/* Personas */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                 <Users className="w-4 h-4 text-blue-500" /> Target Personas
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {dna.personas?.map((persona, i) => (
                   <div key={i} className="bg-white/5 border border-white/5 rounded-lg p-4 hover:border-brand-500/30 transition-colors">
                     <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                         {persona.name.charAt(0)}
                       </div>
                       <div>
                         <div className="text-sm font-bold text-white">{persona.name}</div>
                         <div className="text-xs text-zinc-500">{persona.role}</div>
                       </div>
                     </div>
                     <div className="mt-3">
                       <div className="text-[10px] text-zinc-500 uppercase mb-1">Pain Points</div>
                       <div className="flex flex-wrap gap-1.5">
                         {persona.painPoints?.map((p, idx) => (
                           <span key={idx} className="px-2 py-0.5 rounded bg-black/40 text-[10px] text-zinc-400 border border-zinc-800">
                             {p}
                           </span>
                         ))}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* TAB: VISUALS */}
        {activeTab === 'visuals' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4">Color Palette</h3>
                <div className="flex gap-6">
                  <div className="text-center group">
                    <div 
                      className="w-20 h-20 rounded-2xl mb-3 shadow-lg ring-1 ring-white/10 group-hover:scale-105 transition-transform" 
                      style={{ backgroundColor: dna.visualIdentity?.primaryColor }}
                    />
                    <span className="block text-xs font-mono text-white mb-1">{dna.visualIdentity?.primaryColor}</span>
                    <span className="block text-[10px] text-zinc-500 uppercase">Primary</span>
                  </div>
                  <div className="text-center group">
                    <div 
                      className="w-20 h-20 rounded-2xl mb-3 shadow-lg ring-1 ring-white/10 group-hover:scale-105 transition-transform" 
                      style={{ backgroundColor: dna.visualIdentity?.secondaryColor }}
                    />
                    <span className="block text-xs font-mono text-white mb-1">{dna.visualIdentity?.secondaryColor}</span>
                    <span className="block text-[10px] text-zinc-500 uppercase">Secondary</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4">Typography & Style</h3>
                <div className="bg-white/5 rounded-lg p-5 border border-white/5">
                   <div className="mb-4">
                     <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Type className="w-3 h-3"/> Font Pairing</div>
                     <div className="text-lg text-white font-serif">{dna.visualIdentity?.fontPairing}</div>
                   </div>
                   <div>
                     <div className="text-xs text-zinc-500 mb-2">Aesthetic Keywords</div>
                     <div className="flex flex-wrap gap-2">
                       {dna.visualIdentity?.styleKeywords?.map((k, i) => (
                         <span key={i} className="px-2 py-1 rounded text-xs border border-zinc-700 text-zinc-300">
                           {k}
                         </span>
                       ))}
                     </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-zinc-900 to-black rounded-lg border border-zinc-800">
              <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Design System Directive</h3>
              <p className="text-sm text-zinc-300">{dna.visualIdentity?.designSystem}</p>
            </div>
          </div>
        )}

        {/* TAB: SONIC */}
        {activeTab === 'sonic' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tone of Voice */}
              <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-brand-500" /> Tone of Voice
                </h3>
                <div className="mb-4">
                  <div className="text-xs text-zinc-500 uppercase mb-1">Archetype</div>
                  <div className="text-2xl font-bold text-brand-400">{dna.tone?.personality}</div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-zinc-500 uppercase mb-1">Adjectives</div>
                  <div className="flex flex-wrap gap-2">
                    {dna.tone?.adjectives?.map((adj, i) => (
                      <span key={i} className="text-sm text-zinc-300 bg-black/20 px-2 py-1 rounded">
                        {adj}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-zinc-400 italic border-l-2 border-zinc-700 pl-3">
                  "{dna.tone?.description}"
                </p>
              </div>

              {/* Sonic Identity */}
              <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-6 rounded-xl border border-indigo-500/20">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Music className="w-4 h-4 text-indigo-400" /> Sonic Identity
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold text-indigo-300 uppercase mb-1">Voice Type</div>
                    <div className="text-sm text-white">{dna.sonicIdentity?.voiceType}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-300 uppercase mb-1">Music Genre</div>
                    <div className="text-sm text-white">{dna.sonicIdentity?.musicGenre}</div>
                  </div>
                  <div>
                     <div className="text-xs font-bold text-indigo-300 uppercase mb-1">Sound FX Keywords</div>
                     <div className="flex gap-2">
                       {dna.sonicIdentity?.soundKeywords?.map((k, i) => (
                         <span key={i} className="text-xs px-2 py-1 rounded bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                           {k}
                         </span>
                       ))}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};