import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { WebsiteData, SiteSection } from '../types';
import { generateWebsiteStructure, deployWebsite } from '../services/siteGeneratorService';
import { 
  Layout, 
  Smartphone, 
  Monitor, 
  Rocket, 
  RefreshCw, 
  Eye, 
  ChevronRight, 
  Edit3,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PreviewFrame: React.FC<{ site: WebsiteData, brand: any }> = ({ site, brand }) => {
  const styles = {
    primary: brand.visualIdentity.primaryColor,
    secondary: brand.visualIdentity.secondaryColor,
    font: 'font-sans' // Simplified
  };

  return (
    <div className="bg-white text-zinc-900 w-full h-full overflow-y-auto rounded-lg shadow-2xl">
      {/* Navbar (Static) */}
      <div className="px-6 py-4 flex justify-between items-center border-b">
         <span className="font-bold text-lg" style={{ color: styles.primary }}>{brand.name}</span>
         <div className="flex gap-4 text-sm font-medium text-zinc-600">
            <span>Features</span>
            <span>About</span>
            <span>Contact</span>
         </div>
      </div>

      {site.sections.sort((a,b) => a.order - b.order).map(section => {
        if (!section.isVisible) return null;
        
        switch(section.type) {
          case 'hero':
            return (
              <div key={section.id} className="py-20 px-6 text-center" style={{ backgroundColor: '#f9fafb' }}>
                <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight text-zinc-900">{section.content?.headline || ''}</h1>
                <p className="text-xl text-zinc-600 max-w-2xl mx-auto mb-8">{section.content?.subheadline || ''}</p>
                <button className="px-8 py-3 rounded-full text-white font-bold transition-transform hover:scale-105" style={{ backgroundColor: styles.primary }}>
                   {section.content?.cta || 'Get Started'}
                </button>
              </div>
            );
          case 'features':
            return (
              <div key={section.id} className="py-20 px-6 bg-white">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                   {section.content?.items?.map((item: any, i: number) => (
                     <div key={i} className="p-6 rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: `${styles.primary}20`, color: styles.primary }}>
                           <Layers className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
                     </div>
                   ))}
                </div>
              </div>
            );
          case 'about':
             return (
               <div key={section.id} className="py-20 px-6" style={{ backgroundColor: styles.secondary }}>
                  <div className="max-w-3xl mx-auto text-center">
                     <h2 className="text-3xl font-bold mb-6" style={{ color: styles.primary }}>{section.content?.title || ''}</h2>
                     <p className="text-lg leading-relaxed opacity-80">{section.content?.text || ''}</p>
                  </div>
               </div>
             );
          case 'cta':
             return (
               <div key={section.id} className="py-20 px-6 text-center bg-zinc-900 text-white">
                  <h2 className="text-3xl font-bold mb-6">{section.content?.headline || ''}</h2>
                  <button className="px-8 py-3 rounded-full bg-white text-black font-bold transition-transform hover:scale-105">
                     {section.content?.button || 'Join'}
                  </button>
               </div>
             );
          case 'footer':
             return (
               <div key={section.id} className="py-8 px-6 text-center border-t text-sm text-zinc-500 bg-white">
                  {section.content?.copyright || ''}
               </div>
             );
          default:
            return null;
        }
      })}
    </div>
  );
};

const SiteBuilderPage = () => {
  const { currentBrand } = useStore();
  const [site, setSite] = useState<WebsiteData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [liveUrl, setLiveUrl] = useState('');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleGenerate = async () => {
    if (!currentBrand) return;
    setIsGenerating(true);
    try {
      const data = await generateWebsiteStructure(currentBrand);
      setSite(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeploy = async () => {
    if (!site) return;
    setIsDeploying(true);
    try {
      const url = await deployWebsite(site);
      setLiveUrl(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeploying(false);
    }
  };

  if (!currentBrand) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center text-zinc-500 bg-dark-surface p-8 rounded-xl border border-dark-border">
           <Layout className="w-12 h-12 mx-auto mb-4 opacity-20" />
           <p className="mb-4">No Brand DNA loaded. Extract a brand to generate a site.</p>
           <Link to="/extract" className="text-brand-500 hover:underline">Go to Extraction</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      {/* Header */}
      <div className="h-16 border-b border-dark-border bg-dark-surface px-6 flex justify-between items-center shrink-0">
         <div className="flex items-center gap-3">
            <Layout className="w-6 h-6 text-brand-500" />
            <div>
               <h1 className="text-lg font-bold text-white">Website Builder</h1>
               <p className="text-[10px] text-zinc-500">Auto-generated from {currentBrand.name} DNA</p>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <div className="bg-black/40 border border-zinc-700 rounded-lg p-1 flex gap-1">
               <button 
                 onClick={() => setViewMode('desktop')}
                 className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'}`}
               >
                 <Monitor className="w-4 h-4" />
               </button>
               <button 
                 onClick={() => setViewMode('mobile')}
                 className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'}`}
               >
                 <Smartphone className="w-4 h-4" />
               </button>
            </div>

            <div className="h-6 w-px bg-zinc-800"></div>

            {!site ? (
              <button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg text-sm flex items-center gap-2"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Generate Site
              </button>
            ) : (
              <button 
                onClick={handleDeploy}
                disabled={isDeploying || !!liveUrl}
                className={`px-4 py-2 text-white font-bold rounded-lg text-sm flex items-center gap-2 ${
                  liveUrl ? 'bg-green-600' : 'bg-brand-600 hover:bg-brand-500'
                }`}
              >
                {isDeploying ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Deploying...</>
                ) : liveUrl ? (
                  <><Eye className="w-4 h-4" /> Deployed</>
                ) : (
                  <><Rocket className="w-4 h-4" /> Deploy to Vercel</>
                )}
              </button>
            )}
         </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
         {/* Left Sidebar: Sections */}
         <div className="w-72 bg-dark-surface border-r border-dark-border flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-dark-border font-bold text-zinc-400 text-xs uppercase tracking-wider">
               Site Sections
            </div>
            
            {site ? (
              <div className="p-2 space-y-2">
                 {site.sections.map((section) => (
                    <div key={section.id} className="p-3 bg-black/20 border border-zinc-800 rounded-lg flex items-center justify-between group cursor-pointer hover:border-brand-500/30">
                       <span className="text-sm text-zinc-300 capitalize font-medium">{section.type}</span>
                       <button className="text-zinc-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                         <Edit3 className="w-3 h-3" />
                       </button>
                    </div>
                 ))}
                 <button className="w-full py-2 border border-dashed border-zinc-700 text-zinc-500 text-xs rounded-lg mt-4 hover:border-brand-500 hover:text-brand-500">
                    + Add Section
                 </button>
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-600 text-sm italic">
                 Generate a site to see sections.
              </div>
            )}
         </div>

         {/* Preview Area */}
         <div className="flex-1 bg-black/50 p-8 flex items-center justify-center relative overflow-hidden">
            {site ? (
               <div 
                 className={`transition-all duration-300 shadow-2xl ${
                   viewMode === 'mobile' ? 'w-[375px] h-[667px]' : 'w-full h-full max-w-6xl'
                 }`}
               >
                 <PreviewFrame site={site} brand={currentBrand} />
               </div>
            ) : (
               <div className="text-center text-zinc-600">
                  <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                     <Layout className="w-8 h-8 opacity-20" />
                  </div>
                  <p>Ready to build.</p>
               </div>
            )}
            
            {/* Deployment Overlay */}
            {liveUrl && (
               <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
                  <div className="bg-dark-surface border border-brand-500/50 p-8 rounded-2xl text-center shadow-[0_0_50px_rgba(20,184,166,0.2)] max-w-md">
                     <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-900/50">
                        <Rocket className="w-8 h-8 text-white" />
                     </div>
                     <h2 className="text-2xl font-bold text-white mb-2">Website is Live!</h2>
                     <p className="text-zinc-400 mb-6">Your brand site has been successfully deployed to the edge network.</p>
                     
                     <div className="bg-black p-3 rounded-lg border border-zinc-800 flex items-center gap-3 mb-6 text-left">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-mono text-brand-400 truncate flex-1">{liveUrl}</span>
                        <a href={liveUrl} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white">
                           <Eye className="w-4 h-4" />
                        </a>
                     </div>

                     <button onClick={() => setLiveUrl('')} className="text-sm text-zinc-500 hover:text-white hover:underline">
                        Return to Editor
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default SiteBuilderPage;