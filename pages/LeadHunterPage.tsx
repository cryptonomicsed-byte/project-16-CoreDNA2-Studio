
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { huntLeads, generateCloserPortfolio } from '../services/advancedScraperService';
import { LeadProfile, ProcessingState, CloserPortfolio } from '../types';
import { 
  Target, 
  MapPin, 
  Search, 
  Briefcase, 
  AlertTriangle, 
  CheckCircle2, 
  Mail, 
  PhoneCall, 
  ShieldAlert,
  Zap,
  RefreshCw,
  Download,
  Trash2,
  ExternalLink,
  Star,
  ChevronRight,
  DollarSign,
  Users,
  UserCheck,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LeadCard: React.FC<{ lead: LeadProfile }> = ({ lead }) => {
  const { updateLead, deleteLead } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [error, setError] = useState('');

  const handleGeneratePortfolio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lead.portfolio) {
      setExpanded(!expanded);
      return;
    }
    
    setExpanded(true);
    setLoadingPortfolio(true);
    setError('');
    try {
      const data = await generateCloserPortfolio(lead);
      updateLead(lead.id, { portfolio: data, status: 'contacted' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to forge portfolio.");
    } finally {
      setLoadingPortfolio(false);
    }
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden hover:border-brand-500/30 transition-all shadow-lg animate-in fade-in zoom-in-95 duration-300">
      <div onClick={() => setExpanded(!expanded)} className="p-6 cursor-pointer bg-black/20 hover:bg-black/30 transition-colors">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${lead.opportunityScore > 80 ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'}`}>{lead.companyName.charAt(0)}</div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-black text-white leading-none">{lead.companyName}</h3>
                <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${lead.opportunityScore > 80 ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>Score: {lead.opportunityScore}</div>
              </div>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-zinc-500 mt-2 font-medium">
                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {lead.industry}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {lead.location}</span>
                <span className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-brand-500" /> {lead.founderName}</span>
                {lead.website && (<a href={lead.website} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline flex items-center gap-1.5" onClick={e => e.stopPropagation()}><ExternalLink className="w-3.5 h-3.5" /> Site</a>)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:grid grid-cols-2 gap-2 pr-4 border-r border-zinc-800">
                <div className="text-right"><div className="text-[10px] text-zinc-500 uppercase font-black">Revenue</div><div className="text-xs text-zinc-200 font-bold">{lead.estimatedRevenue}</div></div>
                <div className="text-right pl-4"><div className="text-[10px] text-zinc-500 uppercase font-black">Team</div><div className="text-xs text-zinc-200 font-bold">{lead.headcount}</div></div>
             </div>
             <button onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }} className="p-2 text-zinc-700 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-black/40 p-3 rounded-lg border border-zinc-800/50"><p className="text-[10px] font-black text-brand-500 uppercase mb-1 tracking-widest">Pain Point Intelligence</p><p className="text-xs text-zinc-400 leading-relaxed italic line-clamp-2">"{lead.painPointDescription}"</p></div>
           <div className="flex flex-wrap content-start gap-2 pt-1">
              {lead.vulnerabilities.map((v, i) => (<span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-red-950/20 border border-red-900/30 text-red-400 text-[10px] font-bold uppercase rounded-md"><AlertTriangle className="w-3 h-3" /> {v}</span>))}
              <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-md border ${lead.status === 'new' ? 'bg-blue-900/20 text-blue-400 border-blue-900/30' : 'bg-green-900/20 text-green-400 border-green-900/30'}`}>{lead.status}</span>
           </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-dark-border animate-in slide-in-from-top-2">
          {error && (
            <div className="p-4 bg-red-900/10 border-b border-red-900/20 flex items-center gap-3 text-red-400 text-xs">
              <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}
          {!lead.portfolio && !loadingPortfolio && (
             <div className="p-12 text-center bg-black/10">
               <p className="text-zinc-400 mb-6 text-sm max-w-lg mx-auto leading-relaxed font-medium">Analyze this lead's dossiers to generate a deep-dive outreach strategy, closing script, and objection defense kit.</p>
               <button onClick={handleGeneratePortfolio} className="px-10 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-black flex items-center gap-2 mx-auto shadow-xl shadow-brand-900/40 transition-all hover:scale-105 active:scale-95"><Zap className="w-5 h-5 fill-current" /> Forge Outreach Portfolio</button>
             </div>
          )}
          {loadingPortfolio && (
             <div className="p-16 text-center flex flex-col items-center gap-4 bg-black/5">
               <div className="relative"><RefreshCw className="w-12 h-12 text-brand-500 animate-spin" /><div className="absolute inset-0 flex items-center justify-center"><Target className="w-4 h-4 text-brand-400" /></div></div>
               <p className="text-sm text-brand-400 animate-pulse font-black uppercase tracking-[0.2em]">Executing Strategic Matrix Formulation...</p>
             </div>
          )}
          {lead.portfolio && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-dark-border">
               <div className="p-8 bg-zinc-900/40">
                 <h4 className="text-sm font-black text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2"><Mail className="w-4 h-4 text-blue-400" /> OUTREACH ARCHITECTURE</h4>
                 <div className="space-y-6">
                   <div>
                     <div className="text-[10px] text-zinc-500 uppercase font-black mb-1.5 tracking-widest">Cold Email Subject</div>
                     <div className="text-sm text-white font-bold bg-black/60 p-4 rounded-xl border border-zinc-800 flex justify-between items-center group/copy"><span className="italic">"{lead.portfolio.subjectLine}"</span><button className="text-zinc-600 hover:text-white transition-opacity"><Download className="w-4 h-4"/></button></div>
                   </div>
                   <div>
                     <div className="text-[10px] text-zinc-500 uppercase font-black mb-1.5 tracking-widest">Hyper-Personalized Content</div>
                     <div className="text-sm text-zinc-300 leading-loose whitespace-pre-wrap bg-black/60 p-5 rounded-xl border border-zinc-800 max-h-80 overflow-y-auto custom-scrollbar font-medium">{lead.portfolio.emailBody}</div>
                   </div>
                   <div>
                     <div className="text-[10px] text-zinc-500 uppercase font-black mb-2 tracking-widest">Multi-Touch Sequence</div>
                     <div className="grid grid-cols-3 gap-3">{lead.portfolio.followUpSequence.map((step: string, i: number) => (<div key={i} className="bg-zinc-800/50 p-3 rounded-lg text-[10px] text-zinc-400 border border-zinc-700/50"><span className="block font-black text-brand-500 mb-1.5 uppercase">T-{i * 3 + 2} DAYS</span><span className="line-clamp-3">{step}</span></div>))}</div>
                   </div>
                 </div>
               </div>
               <div className="p-8 bg-zinc-900/40">
                  <h4 className="text-sm font-black text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2"><ShieldAlert className="w-4 h-4 text-purple-400" /> CLOSING LOGIC & OBJECTIONS</h4>
                 <div className="space-y-6">
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase font-black mb-1.5 tracking-widest">Exploration Call Pivot</div>
                      <div className="bg-purple-950/20 border border-purple-500/30 p-5 rounded-xl"><p className="text-sm text-purple-100 font-medium leading-relaxed italic">"{lead.portfolio.closingScript}"</p></div>
                    </div>
                    <div className="space-y-3">
                       <div className="text-[10px] text-zinc-500 uppercase font-black mb-2 tracking-widest">Live Resistance Handling</div>
                       {lead.portfolio.objections.map((obj: any, i: number) => (<div key={i} className="bg-red-950/10 border border-red-900/20 p-4 rounded-xl group/obj"><div className="text-xs text-red-400 font-black mb-2 uppercase flex items-center gap-2"><span className="w-4 h-4 bg-red-500 text-black flex items-center justify-center rounded-full text-[8px] font-black">!</span>"{obj.objection}"</div><div className="text-xs text-zinc-300 leading-relaxed font-medium pl-6 border-l border-red-900/50"><span className="text-green-500 font-bold uppercase mr-1">RESPONSE:</span> {obj.rebuttal}</div></div>))}
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg"><Download className="w-4 h-4" /> EXPORT CSV</button>
                      <button className="flex-[2] py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-green-900/30 transition-all hover:scale-[1.02] active:scale-95"><PhoneCall className="w-4 h-4" /> INITIATE CRM INTEGRATION</button>
                    </div>
                 </div>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LeadHunterPage = () => {
  const { leads, addLeads } = useStore();
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted'>('all');
  const [error, setError] = useState<{message: string, code?: string}>({ message: '' });

  const filteredLeads = useMemo(() => {
    if (filter === 'all') return leads;
    return leads.filter(l => l.status === filter);
  }, [leads, filter]);

  const handleHunt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry || !location) return;

    setStatus(ProcessingState.ANALYZING);
    setError({ message: '' });
    
    try {
      const results = await huntLeads(industry, location);
      addLeads(results);
      setStatus(ProcessingState.COMPLETE);
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    } catch (err: any) {
      console.error(err);
      setError({ message: err.message || "Lead hunting failed", code: err.code });
      setStatus(ProcessingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <section className="p-8 max-w-7xl mx-auto border-b border-dark-border bg-dark-bg/50 backdrop-blur-sm relative z-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-5xl font-black text-white mb-2 flex items-center gap-4 tracking-tighter">
              <Target className="w-12 h-12 text-brand-500" /> LEAD HUNTER
            </h1>
            <p className="text-zinc-500 font-medium max-w-xl">Autonomous B2B data extraction and vulnerability mapping engine. Identifies weak points in target organizations and generates precision closing kits.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex bg-black/40 border border-zinc-800 rounded-xl p-1.5">{(['all', 'new', 'contacted'] as const).map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-lg text-xs font-black uppercase transition-all tracking-widest ${filter === f ? 'bg-zinc-800 text-white shadow-xl shadow-black/20' : 'text-zinc-600 hover:text-zinc-300'}`}>{f}</button>))}</div>
             <button className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all shadow-lg" title="Export All Data"><Download className="w-6 h-6" /></button>
          </div>
        </div>

        <div className="bg-dark-surface p-10 rounded-3xl border border-dark-border shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleHunt} className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 relative group">
              <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2.5 tracking-[0.2em] group-focus-within:text-brand-500 transition-colors pl-1">Target Sector / Niche</label>
              <div className="relative"><Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 transition-colors group-focus-within:text-brand-500" /><input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Fintech Series A, Dental Practices" className="w-full bg-black/60 border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-white font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-zinc-700" required /></div>
            </div>
            <div className="md:col-span-4 relative group">
              <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2.5 tracking-[0.2em] group-focus-within:text-brand-500 transition-colors pl-1">Geographic Perimeter</label>
              <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 transition-colors group-focus-within:text-brand-500" /><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. San Francisco, Global SaaS" className="w-full bg-black/60 border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-white font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-zinc-700" required /></div>
            </div>
            <div className="md:col-span-3 flex items-end">
              <button type="submit" disabled={status === ProcessingState.ANALYZING} className="w-full py-4 bg-gradient-to-r from-brand-700 to-brand-500 hover:from-brand-600 hover:to-brand-400 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white font-black rounded-2xl transition-all shadow-2xl shadow-brand-900/30 flex items-center justify-center gap-3 group h-[58px]">{status === ProcessingState.ANALYZING ? (<RefreshCw className="w-6 h-6 animate-spin" />) : (<Search className="w-6 h-6 group-hover:scale-110 transition-transform" />)}<span className="tracking-widest">{status === ProcessingState.ANALYZING ? 'HUNTING...' : 'INITIATE HUNT'}</span></button>
            </div>
            {error.message && (
              <div className="md:col-span-12 mt-4 p-4 bg-red-900/10 border border-red-900/30 rounded-2xl animate-in slide-in-from-top-2">
                 <div className="flex items-start gap-3 text-red-400">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                       <p className="text-xs font-black uppercase tracking-widest mb-1">Extraction Matrix Error</p>
                       <p className="text-[11px] opacity-80">{error.message}</p>
                    </div>
                    {(error.code === 'QUOTA_EXCEEDED' || error.code === 'BILLING_ISSUE') && (
                       <Link to="/settings" className="px-4 py-1.5 bg-red-900/30 hover:bg-red-900/50 border border-red-900/40 text-red-400 text-[9px] font-black uppercase rounded-lg transition-all flex items-center gap-2">
                         <Settings className="w-3 h-3" /> Fix in Settings
                       </Link>
                    )}
                 </div>
              </div>
            )}
          </form>
        </div>
      </section>

      <section id="results-section" className="p-8 max-w-7xl mx-auto pb-32">
        <div className="flex justify-between items-center mb-10 px-4">
           <div className="flex items-center gap-3"><span className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">INTELLIGENCE GRID <ChevronRight className="w-5 h-5 text-zinc-700" /></span><span className="px-4 py-1 bg-brand-950/40 text-brand-400 text-[10px] font-black rounded-full border border-brand-500/20 shadow-lg">{filteredLeads.length} PROSPECTS IDENTIFIED</span></div>
           <div className="flex items-center gap-3 text-[10px] font-black text-zinc-700 uppercase tracking-widest bg-black/20 px-4 py-2 rounded-full border border-zinc-900"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>Deep-Scraper Mesh Online</div>
        </div>
        {filteredLeads.length > 0 ? (<div className="grid grid-cols-1 gap-8">{filteredLeads.map(lead => (<LeadCard key={lead.id} lead={lead} />))}</div>) : (<div className="py-40 flex flex-col items-center justify-center text-zinc-800 bg-black/10 rounded-[3rem] border border-dashed border-zinc-900 group"><Target className="w-24 h-24 mb-8 opacity-20 group-hover:scale-110 transition-transform duration-700" /><p className="text-xl font-black opacity-30 uppercase tracking-[0.2em]">Target Required</p><p className="text-xs opacity-20 mt-3 uppercase tracking-widest font-bold max-w-xs text-center leading-loose">Enter industry and geographic coordinates to initialize autonomous extraction.</p></div>)}
      </section>
    </div>
  );
};

export default LeadHunterPage;
