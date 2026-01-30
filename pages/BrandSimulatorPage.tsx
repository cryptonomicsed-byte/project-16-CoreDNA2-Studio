import React, { useState } from 'react';
import { useStore } from '../store';
import { DesignVariant, CopyVariant, AudienceFeedback, ProcessingState } from '../types';
import { generateDesignVariants, generateCopyVariants, simulateAudienceReaction } from '../services/simulationService';
import { 
  FlaskConical, 
  Palette, 
  Type, 
  Users, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare,
  Sparkles,
  TrendingUp,
  LayoutTemplate
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BrandSimulatorPage = () => {
  const { currentBrand, updateBrand } = useStore();
  const [activeTab, setActiveTab] = useState<'design' | 'copy' | 'audience'>('design');
  const [loading, setLoading] = useState(false);

  // Design State
  const [designVariants, setDesignVariants] = useState<DesignVariant[]>([]);
  
  // Copy State
  const [copyInput, setCopyInput] = useState(currentBrand?.tagline || '');
  const [copyType, setCopyType] = useState<'tagline' | 'headline' | 'cta'>('tagline');
  const [copyVariants, setCopyVariants] = useState<CopyVariant[]>([]);

  // Audience State
  const [selectedPersona, setSelectedPersona] = useState(currentBrand?.personas[0]?.name || '');
  const [audienceContent, setAudienceContent] = useState(currentBrand?.elevatorPitch || '');
  const [feedback, setFeedback] = useState<AudienceFeedback | null>(null);

  // --- Handlers ---

  const handleDesignSim = async () => {
    if (!currentBrand) return;
    setLoading(true);
    try {
      const vars = await generateDesignVariants(currentBrand);
      setDesignVariants(vars);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDesign = (v: DesignVariant) => {
    if (!currentBrand) return;
    if (confirm(`Apply "${v.name}" visuals to the live Brand DNA? This will affect future assets.`)) {
      updateBrand(currentBrand.id, {
        visualIdentity: {
          ...currentBrand.visualIdentity,
          primaryColor: v.primaryColor,
          secondaryColor: v.secondaryColor,
          fontPairing: v.fontPairing
        }
      });
      alert("Brand DNA updated successfully.");
    }
  };

  const handleCopySim = async () => {
    if (!currentBrand || !copyInput) return;
    setLoading(true);
    try {
      const vars = await generateCopyVariants(currentBrand, copyInput, copyType);
      setCopyVariants(vars);
    } finally {
      setLoading(false);
    }
  };

  const handleAudienceSim = async () => {
    if (!currentBrand || !selectedPersona || !audienceContent) return;
    setLoading(true);
    const persona = currentBrand.personas.find(p => p.name === selectedPersona);
    if (!persona) return;

    try {
      const fb = await simulateAudienceReaction(currentBrand, audienceContent, selectedPersona, persona.role);
      setFeedback(fb);
    } finally {
      setLoading(false);
    }
  };

  if (!currentBrand) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center text-zinc-500">
           <FlaskConical className="w-12 h-12 mx-auto mb-4 opacity-20" />
           <p>No Brand DNA loaded. <Link to="/extract" className="text-brand-500 underline">Extract a brand</Link> to begin simulations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FlaskConical className="w-8 h-8 text-brand-500" /> Brand Simulator
        </h1>
        <p className="text-zinc-400">Experimental lab for testing design systems, messaging, and audience resonance.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-border mb-8">
        {[
          { id: 'design', label: 'Design Lab', icon: Palette },
          { id: 'copy', label: 'Copy Lab', icon: Type },
          { id: 'audience', label: 'Audience Sim', icon: Users },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-brand-500 text-brand-500 bg-brand-500/5' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* --- DESIGN LAB --- */}
      {activeTab === 'design' && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Current Brand */}
              <div className="lg:col-span-1 bg-dark-surface border border-dark-border p-6 rounded-xl h-fit">
                 <h3 className="text-sm font-bold text-zinc-400 uppercase mb-4">Current Control</h3>
                 <div className="space-y-4">
                    <div>
                       <div className="w-full h-24 rounded-lg mb-2 shadow-lg" style={{ backgroundColor: currentBrand.visualIdentity.primaryColor }} />
                       <div className="flex justify-between text-xs text-zinc-500">
                          <span>Primary</span>
                          <span className="font-mono">{currentBrand.visualIdentity.primaryColor}</span>
                       </div>
                    </div>
                    <div>
                       <div className="w-full h-12 rounded-lg mb-2 shadow-lg" style={{ backgroundColor: currentBrand.visualIdentity.secondaryColor }} />
                       <div className="flex justify-between text-xs text-zinc-500">
                          <span>Secondary</span>
                          <span className="font-mono">{currentBrand.visualIdentity.secondaryColor}</span>
                       </div>
                    </div>
                    <div className="pt-4 border-t border-dark-border">
                       <p className="text-xs text-zinc-500 uppercase mb-1">Font Pairing</p>
                       <p className="text-white font-serif">{currentBrand.visualIdentity.fontPairing}</p>
                    </div>
                 </div>
                 
                 <button 
                   onClick={handleDesignSim}
                   disabled={loading}
                   className="w-full mt-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                 >
                   {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                   Generate Variants
                 </button>
              </div>

              {/* Variants */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                 {designVariants.length === 0 && !loading && (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-zinc-600 border border-dashed border-zinc-800 rounded-xl">
                       <LayoutTemplate className="w-12 h-12 mb-4 opacity-20" />
                       <p>Generate variants to see AI-suggested visual identities.</p>
                    </div>
                 )}
                 
                 {designVariants.map(variant => (
                   <div key={variant.id} className="bg-black/20 border border-zinc-800 rounded-xl overflow-hidden hover:border-brand-500/30 transition-colors flex flex-col">
                      <div className="h-32 relative" style={{ backgroundColor: variant.primaryColor }}>
                         <div className="absolute bottom-4 right-4 w-12 h-12 rounded-lg shadow-lg" style={{ backgroundColor: variant.secondaryColor }} />
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                         <h3 className="font-bold text-white mb-1">{variant.name}</h3>
                         <p className="text-xs text-zinc-500 font-serif mb-4">{variant.fontPairing}</p>
                         <p className="text-xs text-zinc-400 mb-6 flex-1">{variant.rationale}</p>
                         <button 
                           onClick={() => handleApplyDesign(variant)}
                           className="w-full py-2 border border-brand-500/50 text-brand-400 hover:bg-brand-500 hover:text-white rounded-lg text-xs font-bold transition-colors uppercase tracking-wide"
                         >
                           Apply to Brand
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* --- COPY LAB --- */}
      {activeTab === 'copy' && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
           <div className="bg-dark-surface border border-dark-border rounded-xl p-6 mb-8">
              <div className="flex gap-4 mb-4">
                 <select 
                   value={copyType}
                   onChange={(e) => setCopyType(e.target.value as any)}
                   className="bg-black/40 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-brand-500"
                 >
                    <option value="tagline">Tagline</option>
                    <option value="headline">Headline</option>
                    <option value="cta">Call to Action</option>
                 </select>
                 <input 
                   type="text"
                   value={copyInput}
                   onChange={(e) => setCopyInput(e.target.value)}
                   className="flex-1 bg-black/40 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-brand-500"
                   placeholder="Enter original text to test..."
                 />
                 <button 
                   onClick={handleCopySim}
                   disabled={loading || !copyInput}
                   className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
                 >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                    Run A/B Sim
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {copyVariants.map((variant, i) => (
                 <div key={variant.id} className="bg-black/20 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 bg-zinc-900 rounded-bl-xl border-l border-b border-zinc-800 text-[10px] text-zinc-500 font-mono">
                       VAR {String.fromCharCode(65 + i)}
                    </div>
                    
                    <div className="mb-4">
                       <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold mb-3 ${
                          variant.tone === 'Bold' ? 'bg-red-900/20 text-red-400' :
                          variant.tone === 'Clear' ? 'bg-blue-900/20 text-blue-400' : 'bg-green-900/20 text-green-400'
                       }`}>
                          {variant.tone} Tone
                       </span>
                       <p className="text-lg font-bold text-white leading-snug">"{variant.text}"</p>
                    </div>

                    <div className="flex items-end justify-between mt-6">
                       <div className="text-xs text-zinc-500 max-w-[70%]">{variant.rationale}</div>
                       <div className="text-right">
                          <div className={`text-2xl font-black ${
                             variant.predictedScore >= 80 ? 'text-green-500' : 'text-amber-500'
                          }`}>
                             {variant.predictedScore}
                          </div>
                          <div className="text-[10px] text-zinc-600 uppercase">Pred. Score</div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* --- AUDIENCE SIM --- */}
      {activeTab === 'audience' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
           {/* Controls */}
           <div className="space-y-6 overflow-y-auto">
              <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
                 <h3 className="font-bold text-white mb-4">Simulator Configuration</h3>
                 
                 <div className="space-y-4">
                    <div>
                       <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Target Persona</label>
                       <div className="grid grid-cols-2 gap-3">
                          {currentBrand.personas.map(p => (
                             <div 
                               key={p.name}
                               onClick={() => setSelectedPersona(p.name)}
                               className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                  selectedPersona === p.name 
                                    ? 'bg-brand-900/20 border-brand-500 text-white' 
                                    : 'bg-black/40 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                               }`}
                             >
                                <div className="font-bold text-sm">{p.name}</div>
                                <div className="text-[10px] opacity-70 truncate">{p.role}</div>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div>
                       <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Content to Test</label>
                       <textarea 
                         value={audienceContent}
                         onChange={(e) => setAudienceContent(e.target.value)}
                         className="w-full h-40 bg-black/40 border border-zinc-700 rounded-lg p-3 text-white text-sm focus:border-brand-500 outline-none resize-none"
                         placeholder="Paste ad copy, email draft, or mission statement..."
                       />
                    </div>

                    <button 
                      onClick={handleAudienceSim}
                      disabled={loading || !selectedPersona || !audienceContent}
                      className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                      Get Feedback
                    </button>
                 </div>
              </div>
           </div>

           {/* Results */}
           <div className="bg-black/20 border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
              {loading ? (
                 <div className="space-y-4 animate-pulse">
                    <div className="w-16 h-16 bg-brand-900/20 rounded-full mx-auto flex items-center justify-center">
                       <Users className="w-8 h-8 text-brand-500" />
                    </div>
                    <p className="text-zinc-500">Simulating persona reaction...</p>
                 </div>
              ) : feedback ? (
                 <div className="w-full text-left animate-in zoom-in-95">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                          {feedback.personaName.charAt(0)}
                       </div>
                       <div>
                          <h3 className="text-xl font-bold text-white">{feedback.personaName}</h3>
                          <div className={`text-xs font-bold px-2 py-0.5 rounded inline-block ${
                             feedback.sentiment === 'positive' ? 'bg-green-900/30 text-green-400' : 
                             feedback.sentiment === 'negative' ? 'bg-red-900/30 text-red-400' : 'bg-zinc-800 text-zinc-400'
                          }`}>
                             {feedback.sentiment.toUpperCase()} REACTION
                          </div>
                       </div>
                       <div className="ml-auto text-center">
                          <div className={`text-3xl font-black ${
                             feedback.score > 80 ? 'text-green-500' : 
                             feedback.score > 50 ? 'text-amber-500' : 'text-red-500'
                          }`}>
                             {feedback.score}
                          </div>
                          <div className="text-[10px] text-zinc-500 uppercase">Score</div>
                       </div>
                    </div>

                    <div className="bg-dark-surface border border-dark-border p-6 rounded-xl rounded-tl-none mb-6 relative">
                       <div className="absolute top-0 left-0 w-4 h-4 bg-dark-surface border-t border-l border-dark-border -translate-x-[9px] -translate-y-[1px] rotate-45"></div>
                       <p className="text-zinc-300 italic text-lg leading-relaxed">"{feedback.comments}"</p>
                    </div>

                    <div className="bg-brand-900/10 border border-brand-500/20 p-4 rounded-lg">
                       <p className="text-xs font-bold text-brand-500 uppercase mb-2 flex items-center gap-2">
                          <Sparkles className="w-3 h-3" /> Improvement Suggestion
                       </p>
                       <p className="text-sm text-brand-100/80">{feedback.suggestedImprovement}</p>
                    </div>
                 </div>
              ) : (
                 <div className="text-zinc-600">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Select a persona and input content to simulate feedback.</p>
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default BrandSimulatorPage;