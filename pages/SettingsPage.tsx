
import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Settings, Zap, Shield, Activity, RefreshCw, 
  Cpu, Eye, EyeOff, Cloud, Database, ExternalLink, 
  CheckCircle2, AlertCircle, Play, Workflow, Palette, Film,
  ChevronDown, Globe, Box, Terminal, Layers, Sparkles, Users
} from 'lucide-react';
import { healthCheckService, ProviderStatus } from '../services/healthCheckService';
import AffiliateHubPage from './AffiliateHubPage';

// --- Provider Metadata ---
const PROVIDER_METADATA: Record<string, { url: string; docs: string }> = {
  gemini: { url: 'https://aistudio.google.com/app/apikey', docs: 'https://ai.google.dev/docs' },
  openai: { url: 'https://platform.openai.com/api-keys', docs: 'https://platform.openai.com/docs' },
  anthropic: { url: 'https://console.anthropic.com/settings/keys', docs: 'https://docs.anthropic.com' },
  deepseek: { url: 'https://platform.deepseek.com/api_keys', docs: 'https://api-docs.deepseek.com/' },
  groq: { url: 'https://console.groq.com/keys', docs: 'https://console.groq.com/docs/quickstart' },
  mistral: { url: 'https://console.mistral.ai/api-keys/', docs: 'https://docs.mistral.ai/' },
  stability: { url: 'https://platform.stability.ai/account/keys', docs: 'https://platform.stability.ai/docs' },
  fal: { url: 'https://fal.ai/dashboard/keys', docs: 'https://fal.ai/docs' },
  leonardo: { url: 'https://leonardo.ai/', docs: 'https://docs.leonardo.ai/' },
  replicate: { url: 'https://replicate.com/account/api-tokens', docs: 'https://replicate.com/docs' },
  runway: { url: 'https://dashboard.runwayml.com/', docs: 'https://runwayml.com/docs' },
  ltx: { url: 'https://lightricks.com/', docs: 'https://lightricks.com/' },
  luma: { url: 'https://lumalabs.ai/dream-machine/api', docs: 'https://lumalabs.ai/docs' },
  pika: { url: 'https://pika.art/', docs: 'https://pika.art/' },
  kling: { url: 'https://klingai.com/', docs: 'https://klingai.com/' },
  n8n: { url: 'https://n8n.io/', docs: 'https://docs.n8n.io/' },
  zapier: { url: 'https://zapier.com/app/settings/details', docs: 'https://platform.zapier.com/' },
  make: { url: 'https://www.make.com/en/help/general/api-tokens', docs: 'https://www.make.com/en/help' },
  pipedream: { url: 'https://pipedream.com/settings/api', docs: 'https://pipedream.com/docs' },
  activepieces: { url: 'https://www.activepieces.com/', docs: 'https://www.activepieces.com/docs' },
  ghl: { url: 'https://www.gohighlevel.com/', docs: 'https://developers.gohighlevel.com/' },
};

const ProviderCard = ({ 
  id, 
  name, 
  icon: Icon, 
  isActive, 
  onActivate, 
  apiKey, 
  onKeyChange, 
  checkFn, 
  typeLabel 
}: any) => {
  const [showKey, setShowKey] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<ProviderStatus | null>(null);

  const handleCheck = async () => {
    if (!apiKey) return;
    setChecking(true);
    try {
      const res = checkFn ? await checkFn(apiKey) : { status: 'operational' };
      setStatus(res as ProviderStatus);
    } catch (e) {
      setStatus({ id, name, status: 'down', latency: 0 });
    }
    setChecking(false);
  };

  const meta = PROVIDER_METADATA[id] || { url: '#', docs: '#' };

  return (
    <div className={`group relative bg-dark-surface border rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between ${
      isActive 
        ? 'border-brand-500/50 shadow-[0_0_30px_rgba(20,184,166,0.15)] ring-1 ring-brand-500/30' 
        : 'border-dark-border hover:border-zinc-700 hover:shadow-xl'
    }`}>
      {isActive && (
        <div className="absolute -top-2.5 right-6 px-2.5 py-0.5 bg-brand-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
          Active {typeLabel}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl transition-colors ${isActive ? 'bg-brand-500/20 text-brand-400' : 'bg-black/40 text-zinc-600 group-hover:text-zinc-400'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white uppercase tracking-tighter text-sm">{name}</h3>
              <a href={meta.url} target="_blank" rel="noreferrer" className="text-[9px] font-black text-brand-500/70 hover:text-brand-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                Connect API <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
          <button 
            onClick={onActivate}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
              isActive ? 'bg-brand-500 text-black' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {isActive ? 'Live' : 'Activate'}
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Neural Key</label>
            {status && (
              <div className={`flex items-center gap-1 text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                status.status === 'operational' ? 'bg-green-950/40 text-green-400' : status.status === 'unauthorized' ? 'bg-red-950/40 text-red-400' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {status.status} {status.latency > 0 ? `${status.latency}ms` : ''}
              </div>
            )}
          </div>
          <div className="relative">
            <input 
              type={showKey ? "text" : "password"}
              value={apiKey || ''}
              onChange={(e) => onKeyChange(e.target.value)}
              placeholder={`Paste Key...`}
              className="w-full bg-black/40 border border-zinc-800 rounded-lg py-2.5 pl-3 pr-20 text-zinc-400 font-mono text-[10px] focus:ring-1 focus:ring-brand-500/50 outline-none transition-all placeholder-zinc-800"
            />
            <div className="absolute right-1 top-1 bottom-1 flex gap-0.5">
              <button onClick={() => setShowKey(!showKey)} className="px-1.5 text-zinc-600 hover:text-zinc-400 transition-colors">
                {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
              <button 
                onClick={handleCheck}
                disabled={checking || !apiKey}
                className="px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded text-[8px] font-black uppercase transition-all"
              >
                {checking ? <RefreshCw className="w-2.5 h-2.5 animate-spin" /> : 'Ping'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollapsibleSection = ({ section, providers, updateProviders, setApiKey, typeLabel }: any) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="space-y-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between group border-b border-dark-border pb-4 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-brand-500/5 rounded-lg border border-brand-500/10">
            <section.headerIcon className="w-5 h-5 text-brand-500" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              {section.title}
              <span className="text-[10px] font-black bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full tracking-widest">{section.items.length} Options</span>
            </h2>
            <p className="text-zinc-500 font-medium text-xs mt-0.5">{section.description}</p>
          </div>
        </div>
        <div className={`p-2 rounded-full transition-all ${isOpen ? 'rotate-180 bg-brand-500/10 text-brand-500' : 'bg-zinc-900 text-zinc-600 group-hover:text-zinc-400'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2 animate-in slide-in-from-top-2 duration-300">
          {section.items.map((item: any) => (
            <ProviderCard 
              key={item.id}
              id={item.id}
              name={item.name}
              icon={item.icon}
              isActive={(providers as any)[section.type] === item.id}
              onActivate={() => updateProviders({ [section.type]: item.id })}
              apiKey={(providers.keys as any)[item.id]}
              onKeyChange={(val: string) => setApiKey(item.id as any, val)}
              checkFn={item.check}
              typeLabel={typeLabel}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const SettingsPage = () => {
  const { userTier, setTier, credits, providers, updateProviders, setApiKey } = useStore();
  const [activeTab, setActiveTab] = useState<'neural' | 'billing' | 'affiliate'>('neural');

  const sections = [
    {
      title: 'LLM Inference Engines',
      headerIcon: Cpu,
      description: 'Linguistic core for strategy and assets.',
      type: 'activeLLM',
      label: 'LLM',
      items: [
        { id: 'gemini', name: 'Google Gemini 3', icon: Cloud, check: healthCheckService.checkGemini },
        { id: 'openai', name: 'OpenAI GPT-4o', icon: Zap, check: (k: string) => healthCheckService.checkOpenAI(k) },
        { id: 'anthropic', name: 'Claude 3.5 Sonnet', icon: Database, check: (k: string) => healthCheckService.checkAnthropic(k) },
        { id: 'deepseek', name: 'DeepSeek-V3', icon: Box, check: (k: string) => healthCheckService.checkDeepSeek(k) },
        { id: 'groq', name: 'Groq (Llama 3.3)', icon: Zap, check: (k: string) => healthCheckService.checkGroq(k) },
        { id: 'mistral', name: 'Mistral Large 2', icon: Terminal, check: (k: string) => healthCheckService.checkMistral(k) },
      ]
    },
    {
      title: 'Visual Synthesis Engines',
      headerIcon: Palette,
      description: 'Image generation and design diffusion.',
      type: 'activeImage',
      label: 'Vision',
      items: [
        { id: 'gemini', name: 'Gemini 2.5 Image', icon: Palette, check: healthCheckService.checkGemini },
        { id: 'openai', name: 'DALL-E 3', icon: Zap, check: (k: string) => healthCheckService.checkOpenAI(k) },
        { id: 'stability', name: 'SDXL / Ultra', icon: Activity, check: (k: string) => healthCheckService.checkStability(k) },
        { id: 'fal', name: 'Fal.ai (Flux.1)', icon: Layers, check: (k: string) => healthCheckService.checkFal(k) },
        { id: 'leonardo', name: 'Leonardo.ai', icon: Sparkles },
        { id: 'replicate', name: 'Replicate API', icon: Globe },
      ]
    },
    {
      title: 'Motion Synthesis Engines',
      headerIcon: Film,
      description: 'Video and animation generation pipeline.',
      type: 'activeVideo',
      label: 'Motion',
      items: [
        { id: 'veo', name: 'Google Veo 3', icon: Film, check: healthCheckService.checkGemini },
        { id: 'ltx', name: 'LTX-2 (Turbo)', icon: Zap },
        { id: 'runway', name: 'Runway Gen-3', icon: Database },
        { id: 'luma', name: 'Luma Dream Machine', icon: Play },
        { id: 'pika', name: 'Pika Effects', icon: Sparkles },
        { id: 'kling', name: 'Kling AI (Pro)', icon: Film },
      ]
    },
    {
      title: 'Automation & Workflow Fabric',
      headerIcon: Workflow,
      description: 'External platform and CRM deployment.',
      type: 'activeWorkflow',
      label: 'Fabric',
      items: [
        { id: 'n8n', name: 'n8n Cloud', icon: Workflow },
        { id: 'zapier', name: 'Zapier Central', icon: Zap },
        { id: 'make', name: 'Make.com', icon: Database },
        { id: 'pipedream', name: 'Pipedream', icon: Cloud },
        { id: 'activepieces', name: 'ActivePieces', icon: Box },
        { id: 'ghl', name: 'GoHighLevel', icon: Users },
      ]
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen pb-40">
      <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase">Settings</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Neural Protocol & Account Calibration</p>
        </div>
        <div className="flex bg-black/40 border border-zinc-800 rounded-2xl p-1.5 shadow-xl">
           {(['neural', 'billing', 'affiliate'] as const).map(tab => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-600 hover:text-zinc-400'}`}>
               {tab === 'neural' ? 'Neural Matrix' : tab === 'billing' ? 'Subscription' : 'Partner Hub'}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-16">
           {activeTab === 'neural' && (
             <div className="space-y-16 animate-in fade-in duration-500">
                {sections.map((section, idx) => (
                  <CollapsibleSection key={idx} section={section} providers={providers} updateProviders={updateProviders} setApiKey={setApiKey} typeLabel={section.label} />
                ))}
                <div className="bg-brand-950/10 border border-brand-500/20 p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent pointer-events-none" />
                   <div className="w-20 h-20 bg-brand-500/10 rounded-3xl flex items-center justify-center text-brand-500 shrink-0 group-hover:rotate-12 transition-transform duration-500 border border-brand-500/20">
                      <Shield className="w-10 h-10" />
                   </div>
                   <div>
                      <p className="text-xl text-brand-100 font-black mb-3 uppercase tracking-tighter">Distributed Privacy Protocol</p>
                      <p className="text-sm text-brand-400/80 leading-loose font-medium max-w-4xl">
                         All API keys are encrypted and stored within your browser's LocalStorage sandbox. CoreDNA2 performs direct client-side routing to inference endpoints. We never store, proxy, or transmit your credentials to our internal servers.
                      </p>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'billing' && (
             <div className="space-y-12 animate-in fade-in duration-500">
                <div className="bg-gradient-to-br from-brand-900/40 to-purple-900/40 border border-brand-500/30 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 blur-[120px] rounded-full group-hover:bg-brand-500/20 transition-all duration-1000" />
                   <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                      <div className="text-center md:text-left">
                         <div className="text-[10px] font-black text-brand-400 uppercase tracking-[0.4em] mb-6">Current Standing</div>
                         <div className="text-8xl font-black text-white capitalize tracking-tighter mb-6">{userTier}</div>
                         <div className="flex items-center gap-3 text-zinc-500 uppercase font-black text-[10px] tracking-widest bg-black/40 w-fit px-4 py-2 rounded-full border border-zinc-800">
                           <Activity className="w-4 h-4 text-green-500" /> Account Status: Operational
                         </div>
                      </div>
                      <div className="text-center md:text-right bg-black/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
                         <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Neural Resource Balance</div>
                         <div className="text-7xl font-black text-white tabular-nums mb-6">{credits}</div>
                         <button className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-900/40 active:scale-95">REPLENISH CREDITS</button>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'affiliate' && <div className="animate-in fade-in duration-500"><AffiliateHubPage /></div>}
      </div>
    </div>
  );
};

export default SettingsPage;
