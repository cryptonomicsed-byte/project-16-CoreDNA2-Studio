
import React, { useState } from 'react';
import { useStore } from '../store';
import { DNAHelix } from '../components/DNAHelix';
import { TrendPulse } from '../components/TrendPulse';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Activity, 
  Globe, 
  TrendingUp, 
  LayoutDashboard, 
  FlaskConical, 
  Calendar, 
  Swords 
} from 'lucide-react';

// Sub-pages
import BrandSimulatorPage from './BrandSimulatorPage';
import SchedulerPage from './SchedulerPage';
import BattleModePage from './BattleModePage';

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-dark-surface border border-dark-border p-5 rounded-xl">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className="text-xs text-zinc-500 font-mono">+12% vs last week</span>
    </div>
    <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
    <p className="text-sm text-zinc-500">{label}</p>
  </div>
);

const DashboardPage = () => {
  const { currentBrand, campaigns } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'scheduler' | 'battle'>('overview');

  const tabs = [
    { id: 'overview', label: 'Mission Control', icon: LayoutDashboard },
    { id: 'simulator', label: 'Brand Simulator', icon: FlaskConical },
    { id: 'scheduler', label: 'Scheduler', icon: Calendar },
    { id: 'battle', label: 'Battle Mode', icon: Swords },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Tabs - Sticky Top */}
      <div className="sticky top-0 z-40 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border px-8 pt-4">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-brand-500 text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-brand-500' : ''}`} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2">
            {/* Header */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Mission Control</h1>
                <p className="text-zinc-400">Welcome back, Strategist. Systems operational.</p>
              </div>
              {!currentBrand && (
                <Link to="/extract" className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                  Initialize New Brand <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Active Campaigns" value={campaigns.length} icon={Activity} color="bg-purple-500" />
              <StatCard label="Assets Generated" value={campaigns.reduce((acc, c) => acc + c.assets.length, 0)} icon={Globe} color="bg-blue-500" />
              <StatCard label="Engagement Score" value="94.2" icon={TrendingUp} color="bg-green-500" />
            </div>

            {/* Main Grid: DNA + Trend Pulse */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: DNA (2/3 width) */}
              <section className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-zinc-200">Active Brand DNA</h2>
                  {currentBrand && <span className="text-xs text-brand-500 font-mono animate-pulse">LIVE MONITORING</span>}
                </div>
                {currentBrand ? (
                  <DNAHelix dna={currentBrand} />
                ) : (
                  <div className="border border-dashed border-zinc-700 rounded-xl p-12 text-center bg-dark-surface/30">
                    <p className="text-zinc-500 mb-4">No Brand Identity loaded in the matrix.</p>
                    <Link to="/extract" className="text-brand-500 hover:underline">Begin Extraction Protocol</Link>
                  </div>
                )}
              </section>

              {/* Right Column: Trend Pulse (1/3 width) */}
              <section className="h-full min-h-[400px]">
                 <TrendPulse currentBrand={currentBrand} />
              </section>
            </div>

            {/* Recent Activity */}
            <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-zinc-200 mb-4">System Log</h2>
              <div className="space-y-4">
                {campaigns.length > 0 ? (
                  campaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                        <div>
                          <p className="text-sm font-medium text-zinc-200">{campaign.name}</p>
                          <p className="text-xs text-zinc-500">{campaign.goal}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-zinc-400">{new Date(campaign.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-brand-500">{campaign.assets.length} Assets</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-600 italic">No recent activity detected.</p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* TAB: SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="h-[calc(100vh-80px)]">
            <BrandSimulatorPage />
          </div>
        )}

        {/* TAB: SCHEDULER */}
        {activeTab === 'scheduler' && (
          <div className="h-[calc(100vh-80px)]">
            <SchedulerPage />
          </div>
        )}

        {/* TAB: BATTLE */}
        {activeTab === 'battle' && (
          <div className="h-[calc(100vh-80px)]">
            <BattleModePage />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
