
import React from 'react';
import { BarChart, TrendingUp, Users, Activity } from 'lucide-react';

interface AnalyticsSectionProps {
  className?: string;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ className }) => {
  // Mock Data Visualization
  const bars = [45, 60, 35, 70, 55, 80, 65, 85, 75, 90, 60, 50];

  return (
    <div className={`bg-dark-surface border border-dark-border rounded-xl p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-500" /> Performance Velocity
        </h3>
        <select className="bg-black/30 text-xs text-zinc-400 border border-zinc-700 rounded px-2 py-1 outline-none">
           <option>Last 30 Days</option>
           <option>Last 7 Days</option>
        </select>
      </div>

      <div className="flex items-end justify-between h-40 gap-2 mb-6">
         {bars.map((h, i) => (
           <div key={i} className="flex-1 bg-zinc-800 rounded-t hover:bg-brand-900/50 transition-colors relative group" style={{ height: `${h}%` }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                 {h}%
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
         <div className="p-3 bg-black/20 rounded-lg border border-zinc-800">
            <div className="text-[10px] text-zinc-500 uppercase mb-1">Engagement</div>
            <div className="text-lg font-bold text-white">+24.5%</div>
         </div>
         <div className="p-3 bg-black/20 rounded-lg border border-zinc-800">
            <div className="text-[10px] text-zinc-500 uppercase mb-1">Conversion</div>
            <div className="text-lg font-bold text-white">4.2%</div>
         </div>
         <div className="p-3 bg-black/20 rounded-lg border border-zinc-800">
            <div className="text-[10px] text-zinc-500 uppercase mb-1">Reach</div>
            <div className="text-lg font-bold text-white">125k</div>
         </div>
      </div>
    </div>
  );
};
