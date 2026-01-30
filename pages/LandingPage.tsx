import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Dna, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Globe, 
  ShieldCheck, 
  Bot 
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-zinc-100 font-sans selection:bg-brand-500/30 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-dark-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Dna className="w-6 h-6 text-brand-500" />
            <span className="font-bold text-lg tracking-tight">CoreDNA<span className="text-brand-500">2</span></span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Login</Link>
            <Link to="/" className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-full text-sm font-bold transition-transform hover:scale-105">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">Enterprise Brand Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
            Extract Brand DNA. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Automate Everything.</span>
          </h1>
          
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            The first AI operating system that decodes your brand's essence and autonomously generates infinite marketing assets, websites, and sales workflows.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <Link to="/" className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-bold text-lg flex items-center gap-2 shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all hover:scale-105">
              Launch Console <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-bold text-lg transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-dark-surface border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">The Brand OS</h2>
            <p className="text-zinc-500">Complete autonomous marketing infrastructure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-black/20 border border-white/5 hover:border-brand-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-brand-900/20 flex items-center justify-center mb-6 text-brand-500 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Brand Extraction</h3>
              <p className="text-zinc-400 leading-relaxed">Instantly analyze any URL to extract core values, tone, visual identity, and strategic positioning.</p>
            </div>

            <div className="p-8 rounded-2xl bg-black/20 border border-white/5 hover:border-brand-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-purple-900/20 flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Autonomous Forge</h3>
              <p className="text-zinc-400 leading-relaxed">Generate thousands of on-brand social posts, emails, and ads with self-healing quality control.</p>
            </div>

            <div className="p-8 rounded-2xl bg-black/20 border border-white/5 hover:border-brand-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-blue-900/20 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Agent Swarm</h3>
              <p className="text-zinc-400 leading-relaxed">Deploy custom AI agents for support, sales, and creative direction trained on your brand data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Simple Pricing</h2>
            <p className="text-zinc-500">Start free, scale to enterprise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-2xl border border-white/10 bg-dark-surface/50">
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <div className="text-3xl font-black text-white mb-6">$0<span className="text-sm font-normal text-zinc-500">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['3 Extractions/mo', '10 Assets/mo', 'Basic LLMs', 'Community Support'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-zinc-600" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/" className="block w-full py-3 text-center rounded-lg border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">Start Free</Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl border border-brand-500 bg-brand-900/10 relative transform scale-105 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
              <h3 className="text-xl font-bold text-white mb-2">Hunter</h3>
              <div className="text-3xl font-black text-white mb-6">$149<span className="text-sm font-normal text-zinc-500">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Unlimited Extractions', 'Unlimited Assets', 'Video Generation', 'Agent Forge Access', 'n8n Automation'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white">
                    <CheckCircle2 className="w-4 h-4 text-brand-400" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/" className="block w-full py-3 text-center rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold transition-colors shadow-lg shadow-brand-500/20">Get Hunter</Link>
            </div>

            {/* Agency */}
            <div className="p-8 rounded-2xl border border-white/10 bg-dark-surface/50">
              <h3 className="text-xl font-bold text-white mb-2">Agency</h3>
              <div className="text-3xl font-black text-white mb-6">Custom</div>
              <ul className="space-y-4 mb-8">
                {['White Label', 'API Access', 'Custom Models', 'Dedicated Support'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-zinc-600" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/" className="block w-full py-3 text-center rounded-lg border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
            <Dna className="w-5 h-5 text-zinc-600" />
            <span className="font-bold text-zinc-500">CoreDNA2</span>
          </div>
          <div className="text-sm text-zinc-600">
            © 2025 CoreDNA AI Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;