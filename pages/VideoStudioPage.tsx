import React from 'react';
import { VideoProvidersSection } from '../components/VideoProvidersSection';
import { useStore } from '../store';
import { Clapperboard, CreditCard } from 'lucide-react';

const VideoStudioPage = () => {
  const { userTier, setTier, credits } = useStore();

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
       <div className="mb-8 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Clapperboard className="w-8 h-8 text-brand-500" /> Video Studio
          </h1>
          <p className="text-zinc-400">
            Generative Video Pipeline supporting <span className="text-white font-bold">Veo 3, Sora 2, and LTX-2</span>.
          </p>
        </div>

        {/* Quick Tier Toggle for Demo */}
        <div className="flex items-center gap-4 bg-black/30 p-2 rounded-lg border border-zinc-800">
           <div className="flex items-center gap-2 px-3">
              <CreditCard className="w-4 h-4 text-brand-400" />
              <div className="text-xs">
                <div className="text-zinc-500 uppercase font-bold">Credits</div>
                <div className="text-white font-mono">{credits}</div>
              </div>
           </div>
           <div className="h-8 w-px bg-zinc-700 mx-1"></div>
           <select 
             value={userTier}
             onChange={(e) => setTier(e.target.value as any)}
             className="bg-zinc-800 text-xs text-white p-2 rounded border border-zinc-700 outline-none focus:border-brand-500"
           >
             <option value="free">Free Tier</option>
             <option value="pro">Pro Tier</option>
             <option value="hunter">Hunter Tier</option>
             <option value="agency">Agency Tier</option>
           </select>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <VideoProvidersSection />
      </div>
    </div>
  );
};

export default VideoStudioPage;