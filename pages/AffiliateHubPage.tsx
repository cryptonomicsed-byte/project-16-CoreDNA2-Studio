import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Link as LinkIcon, 
  Copy, 
  Award, 
  Download, 
  Mail, 
  Twitter, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { 
  getAffiliateStats, 
  getReferralLink, 
  getAffiliateTier, 
  getPayoutHistory, 
  getMarketingAssets 
} from '../services/affiliateService';
import { AffiliateStats, AffiliateTier, AffiliatePayout } from '../types';

const AffiliateHubPage = () => {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [tier, setTier] = useState<AffiliateTier | null>(null);
  const [payouts, setPayouts] = useState<AffiliatePayout[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'payouts'>('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load Data
    const load = async () => {
      const s = await getAffiliateStats();
      const t = await getAffiliateTier();
      const p = await getPayoutHistory();
      setStats(s);
      setTier(t);
      setPayouts(p);
    };
    load();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(getReferralLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const marketingAssets = getMarketingAssets();

  if (!stats || !tier) return <div className="p-8 text-zinc-500">Loading Partner Data...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-brand-500" /> Affiliate Hub
          </h1>
          <p className="text-zinc-400">Manage your partnership, track commissions, and access marketing tools.</p>
        </div>
        
        <div className="bg-black/40 border border-zinc-800 rounded-lg p-1 flex items-center gap-1">
          {['overview', 'assets', 'payouts'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-all ${
                 activeTab === tab 
                   ? 'bg-brand-600 text-white shadow-lg' 
                   : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
               }`}
             >
               {tab}
             </button>
          ))}
        </div>
      </div>

      {/* Referral Link Bar */}
      <div className="bg-gradient-to-r from-brand-900/20 to-purple-900/20 border border-brand-500/20 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <h3 className="text-white font-bold mb-1">Your Unique Referral Link</h3>
            <p className="text-sm text-zinc-400">Share this link to earn <span className="text-brand-400 font-bold">{tier.commission}% recurring commission</span>.</p>
         </div>
         <div className="flex-1 w-full md:w-auto max-w-xl">
            <div className="relative flex items-center">
               <LinkIcon className="absolute left-3 w-4 h-4 text-zinc-500" />
               <input 
                 readOnly 
                 value={getReferralLink()} 
                 className="w-full bg-black/50 border border-zinc-700 rounded-lg py-3 pl-10 pr-24 text-white font-mono text-sm focus:ring-2 focus:ring-brand-500 outline-none"
               />
               <button 
                 onClick={handleCopy}
                 className="absolute right-1 top-1 bottom-1 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-bold transition-colors flex items-center gap-2"
               >
                 {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                 {copied ? 'COPIED' : 'COPY'}
               </button>
            </div>
         </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-dark-surface border border-dark-border p-5 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-green-900/20 rounded-lg text-green-500"><DollarSign className="w-5 h-5" /></div>
                 <span className="text-xs text-green-500 font-mono">+8.4%</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">${stats.totalEarnings.toLocaleString()}</h3>
              <p className="text-xs text-zinc-500 uppercase font-bold">Total Earnings</p>
            </div>

            <div className="bg-dark-surface border border-dark-border p-5 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-amber-900/20 rounded-lg text-amber-500"><TrendingUp className="w-5 h-5" /></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">${stats.pendingPayout.toLocaleString()}</h3>
              <p className="text-xs text-zinc-500 uppercase font-bold">Pending Payout</p>
            </div>

            <div className="bg-dark-surface border border-dark-border p-5 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-blue-900/20 rounded-lg text-blue-500"><Users className="w-5 h-5" /></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stats.signups}</h3>
              <p className="text-xs text-zinc-500 uppercase font-bold">Total Referrals</p>
            </div>

            <div className="bg-dark-surface border border-dark-border p-5 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-purple-900/20 rounded-lg text-purple-500"><Award className="w-5 h-5" /></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stats.conversionRate}%</h3>
              <p className="text-xs text-zinc-500 uppercase font-bold">Conversion Rate</p>
            </div>
          </div>

          {/* Tier Progress */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-8">
             <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" /> Current Status: <span className="text-yellow-400">{tier.name}</span>
                  </h3>
                  <p className="text-sm text-zinc-500">Earn {tier.commission}% commission on all referrals.</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">Next Tier: <span className="text-white font-bold">{tier.nextTierName}</span></p>
                  <p className="text-xs text-zinc-600">Requires {tier.minReferrals * 2} Referrals</p>
                </div>
             </div>

             <div className="relative pt-4">
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-zinc-800">
                   <div style={{ width: `${(tier.currentReferrals / (tier.minReferrals * 2)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-yellow-600 to-yellow-400"></div>
                </div>
                <div className="flex justify-between text-xs font-mono text-zinc-500">
                   <span>0</span>
                   <span>{tier.currentReferrals} / {tier.minReferrals * 2} Referrals</span>
                   <span>{tier.minReferrals * 2}</span>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* MARKETING ASSETS TAB */}
      {activeTab === 'assets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
           {marketingAssets.map((asset, i) => (
             <div key={i} className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-brand-500/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${asset.type === 'email' ? 'bg-blue-900/20 text-blue-400' : 'bg-sky-900/20 text-sky-400'}`}>
                        {asset.type === 'email' ? <Mail className="w-4 h-4" /> : <Twitter className="w-4 h-4" />}
                      </div>
                      <h3 className="font-bold text-white">{asset.title}</h3>
                   </div>
                   <button 
                     onClick={() => {
                        navigator.clipboard.writeText(asset.content.replace('[Link]', getReferralLink()));
                        alert('Copied to clipboard!');
                     }}
                     className="p-2 hover:bg-white/10 rounded text-zinc-400 hover:text-white"
                   >
                     <Copy className="w-4 h-4" />
                   </button>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-zinc-800 h-40 overflow-y-auto">
                   <pre className="text-sm text-zinc-400 whitespace-pre-wrap font-sans">{asset.content}</pre>
                </div>
                <div className="mt-4 flex justify-end">
                   <button 
                     onClick={() => {
                        navigator.clipboard.writeText(asset.content.replace('[Link]', getReferralLink()));
                        alert('Copied to clipboard!');
                     }}
                     className="text-xs font-bold text-brand-500 hover:text-brand-400 flex items-center gap-1"
                   >
                     COPY CONTENT <ArrowRight className="w-3 h-3" />
                   </button>
                </div>
             </div>
           ))}
           
           <div className="bg-gradient-to-br from-brand-900/20 to-purple-900/20 border border-brand-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <Download className="w-10 h-10 text-brand-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Download Media Kit</h3>
              <p className="text-sm text-zinc-400 mb-6">Get logos, banners, and product screenshots for your content.</p>
              <button className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors">
                Download .ZIP (45MB)
              </button>
           </div>
        </div>
      )}

      {/* PAYOUTS TAB */}
      {activeTab === 'payouts' && (
         <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-black/20 border-b border-dark-border text-xs uppercase text-zinc-500 font-bold">
                     <th className="p-4">Date</th>
                     <th className="p-4">Payout ID</th>
                     <th className="p-4">Method</th>
                     <th className="p-4">Status</th>
                     <th className="p-4 text-right">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-dark-border">
                  {payouts.map(p => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                       <td className="p-4 text-zinc-300 text-sm">{p.date}</td>
                       <td className="p-4 text-zinc-500 text-xs font-mono">{p.id.toUpperCase()}</td>
                       <td className="p-4 text-zinc-300 text-sm">{p.method}</td>
                       <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                             p.status === 'paid' ? 'bg-green-900/20 text-green-500' : 'bg-amber-900/20 text-amber-500'
                          }`}>
                             {p.status}
                          </span>
                       </td>
                       <td className="p-4 text-right font-bold text-white">${p.amount.toFixed(2)}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      )}
    </div>
  );
};

export default AffiliateHubPage;