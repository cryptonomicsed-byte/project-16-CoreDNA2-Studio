import React, { useState } from 'react';
import { VideoEngine, UserTier, VideoJob } from '../types';
import { getEngineCost, generateVideo } from '../services/videoService';
import { useStore } from '../store';
import { Film, Zap, Star, Lock, Clock, Play, AlertCircle, Loader2, Download } from 'lucide-react';

const PROVIDERS: { id: VideoEngine; name: string; desc: string; cost: number; tier: string[] }[] = [
  { 
    id: 'ltx-2', 
    name: 'Lightricks LTX-2', 
    desc: 'Fastest generation, good for social clips. Efficient.', 
    cost: 1,
    tier: ['free', 'pro', 'hunter', 'agency']
  },
  { 
    id: 'sora-2-pro', 
    name: 'OpenAI Sora 2 Pro', 
    desc: 'Cinematic realism and complex physics. High cost.', 
    cost: 5,
    tier: ['hunter', 'agency']
  },
  { 
    id: 'veo-3', 
    name: 'Google Veo 3', 
    desc: 'Superior coherence and 1080p resolution. Google DeepMind.', 
    cost: 5,
    tier: ['hunter', 'agency']
  }
];

export const VideoProvidersSection = () => {
  const { userTier, credits, deductCredits, addVideoJob, videoJobs } = useStore();
  const [selectedEngine, setSelectedEngine] = useState<VideoEngine>('ltx-2');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    
    const cost = getEngineCost(selectedEngine, userTier);
    if (credits < cost && userTier !== 'agency') {
      alert("Insufficient credits. Upgrade or purchase top-up.");
      return;
    }

    const newJob: VideoJob = {
      id: crypto.randomUUID(),
      prompt,
      engine: selectedEngine,
      status: 'generating',
      createdAt: new Date().toISOString(),
      cost
    };

    addVideoJob(newJob);
    if (userTier !== 'agency') deductCredits(cost);
    setIsGenerating(true);
    setPrompt(''); // clear input

    try {
      await generateVideo(prompt, selectedEngine, (url) => {
        useStore.getState().updateVideoJob(newJob.id, { 
          status: 'completed', 
          videoUrl: url,
          thumbnailUrl: 'https://placehold.co/600x400/18181b/ffffff?text=Video+Ready' 
        });
      });
    } catch (e) {
      useStore.getState().updateVideoJob(newJob.id, { status: 'failed' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Left: Configuration */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Film className="w-5 h-5 text-brand-500" /> Engine Selection
          </h3>
          
          <div className="space-y-3">
            {PROVIDERS.map((provider) => {
              const isLocked = !provider.tier.includes(userTier);
              const isSelected = selectedEngine === provider.id;

              return (
                <div 
                  key={provider.id}
                  onClick={() => !isLocked && setSelectedEngine(provider.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected 
                      ? 'bg-brand-900/10 border-brand-500 shadow-[0_0_15px_rgba(20,184,166,0.2)]' 
                      : isLocked
                        ? 'bg-black/20 border-zinc-800 opacity-60 cursor-not-allowed'
                        : 'bg-black/40 border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{provider.name}</span>
                    {isLocked && <Lock className="w-3 h-3 text-zinc-500" />}
                    {!isLocked && isSelected && <Zap className="w-3 h-3 text-brand-500 fill-current" />}
                  </div>
                  <p className="text-xs text-zinc-500 mb-2 leading-tight">{provider.desc}</p>
                  
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
                       {provider.cost} Credit{provider.cost > 1 ? 's' : ''}
                     </span>
                     {provider.id === 'veo-3' && (
                       <span className="text-[10px] bg-blue-900/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-900/30">Google DeepMind</span>
                     )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-white text-sm">Prompt Engineering</h3>
             <span className="text-xs text-brand-400 font-mono">{credits} Credits Left</span>
          </div>
          
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your video scene in detail. Include camera movement, lighting, and style..."
            className="w-full h-32 bg-black/40 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none mb-4"
          />

          <button 
            onClick={handleGenerate}
            disabled={!prompt || isGenerating}
            className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />}
            {isGenerating ? 'Rendering...' : 'Generate Video'}
          </button>
        </div>
      </div>

      {/* Right: Gallery */}
      <div className="lg:col-span-2 flex flex-col min-h-0">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Studio Gallery</h2>
          <div className="flex gap-2 text-xs">
             <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400">Total Jobs: {videoJobs.length}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4">
           {videoJobs.length === 0 && (
             <div className="col-span-full h-64 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl bg-black/20">
               <Film className="w-12 h-12 mb-3 opacity-20" />
               <p>No video assets generated yet.</p>
             </div>
           )}

           {videoJobs.map(job => (
             <div key={job.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden group">
                <div className="aspect-video bg-black relative flex items-center justify-center">
                  {job.status === 'generating' ? (
                    <div className="flex flex-col items-center gap-2">
                       <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                       <span className="text-xs text-brand-500 animate-pulse">Processing...</span>
                    </div>
                  ) : job.status === 'failed' ? (
                    <div className="flex flex-col items-center gap-2 text-red-500">
                       <AlertCircle className="w-8 h-8" />
                       <span className="text-xs">Generation Failed</span>
                    </div>
                  ) : (
                    <video 
                      src={job.videoUrl} 
                      controls 
                      className="w-full h-full object-cover"
                      poster={job.thumbnailUrl} 
                    />
                  )}
                  
                  {job.status === 'completed' && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={job.videoUrl} download target="_blank" rel="noreferrer" className="p-2 bg-black/60 hover:bg-black/90 text-white rounded-full block">
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                        {job.engine}
                      </span>
                      <span className="text-[10px] text-zinc-600">
                        {new Date(job.createdAt).toLocaleTimeString()}
                      </span>
                   </div>
                   <p className="text-xs text-zinc-300 line-clamp-2" title={job.prompt}>{job.prompt}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};