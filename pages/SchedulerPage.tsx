
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { CampaignAsset } from '../types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  GripVertical, 
  Clock, 
  CheckCircle2,
  MoreHorizontal,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  FileText
} from 'lucide-react';

// Platform Icons Helper
const PlatformIcon = ({ platform }: { platform: string }) => {
  const p = platform.toLowerCase();
  if (p.includes('linkedin')) return <Linkedin className="w-3 h-3 text-blue-400" />;
  if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-3 h-3 text-sky-400" />;
  if (p.includes('instagram')) return <Instagram className="w-3 h-3 text-pink-400" />;
  if (p.includes('email')) return <Mail className="w-3 h-3 text-orange-400" />;
  return <FileText className="w-3 h-3 text-zinc-400" />;
};

const SchedulerPage = () => {
  const { campaigns, scheduleAsset } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Drag State
  const [draggedAsset, setDraggedAsset] = useState<CampaignAsset | null>(null);

  // --- Calendar Logic ---
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun
  
  // Adjust for Monday start (0 = Mon, 6 = Sun)
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const handlePrevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1));

  // --- Data Aggregation ---
  const allAssets = useMemo(() => {
    return campaigns.flatMap(c => c.assets);
  }, [campaigns]);

  const scheduledAssets = useMemo(() => {
    return allAssets.filter(a => a.metadata.status === 'approved' && a.metadata.scheduledAt);
  }, [allAssets]);

  const unscheduledAssets = useMemo(() => {
    return allAssets.filter(a => a.metadata.status === 'draft' || (a.metadata.status === 'approved' && !a.metadata.scheduledAt));
  }, [allAssets]);

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, asset: CampaignAsset) => {
    setDraggedAsset(asset);
    e.dataTransfer.setData('assetId', asset.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    const assetId = e.dataTransfer.getData('assetId');
    if (assetId) {
      const scheduledDate = new Date(year, currentDate.getMonth(), day, 9, 0, 0); // Default 9 AM
      scheduleAsset(assetId, scheduledDate.toISOString());
      setDraggedAsset(null);
    }
  };

  // --- Render Helpers ---
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty padding cells
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="bg-dark-surface/30 border border-dark-border/50 min-h-[120px]"></div>);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = new Date(year, currentDate.getMonth(), day).toDateString();
      const assetsForDay = scheduledAssets.filter(a => {
         return a.metadata.scheduledAt && new Date(a.metadata.scheduledAt).toDateString() === dateKey;
      });

      const isToday = new Date().toDateString() === dateKey;

      days.push(
        <div 
          key={day}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, day)}
          className={`bg-dark-surface border border-dark-border min-h-[120px] p-2 flex flex-col gap-2 transition-colors ${
            isToday ? 'bg-brand-900/10 border-brand-500/30' : 'hover:bg-white/5'
          }`}
        >
          <div className="flex justify-between items-start">
             <span className={`text-sm font-bold ${isToday ? 'text-brand-500' : 'text-zinc-500'}`}>{day}</span>
             {assetsForDay.length > 0 && <span className="text-[10px] text-zinc-600">{assetsForDay.length} posts</span>}
          </div>

          <div className="space-y-1">
             {assetsForDay.map(asset => (
               <div key={asset.id} className="text-[10px] bg-black/40 border border-zinc-700 rounded p-1.5 cursor-grab active:cursor-grabbing hover:border-brand-500/50 group truncate flex items-center gap-1.5"
                    draggable
                    onDragStart={(e) => handleDragStart(e, asset)}
               >
                 {/* Corrected property access from asset.platform to asset.metadata.channel */}
                 <PlatformIcon platform={asset.metadata.channel} />
                 <span className="truncate text-zinc-300 group-hover:text-white">{asset.title}</span>
               </div>
             ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="p-8 max-w-full mx-auto h-full flex flex-col">
       <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-brand-500" /> Campaign Scheduler
          </h1>
          <p className="text-zinc-400">Drag and drop generated assets to schedule distribution.</p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-4">
           <div className="flex bg-dark-surface border border-dark-border rounded-lg p-1">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="px-4 py-2 font-bold text-white min-w-[140px] text-center select-none">
                {monthName} {year}
              </div>
              <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white">
                <ChevronRight className="w-5 h-5" />
              </button>
           </div>
           
           <div className="bg-black/30 px-4 py-2 rounded-lg border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
             <Clock className="w-4 h-4" /> Timezone: <span className="text-white font-mono">UTC-5 (EST)</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
         {/* Main Calendar Grid */}
         <div className="flex-1 flex flex-col h-full bg-dark-bg/50 rounded-xl overflow-hidden shadow-2xl">
            {/* Week Headers */}
            <div className="grid grid-cols-7 bg-dark-surface border-b border-dark-border">
               {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                 <div key={d} className="p-3 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider">
                   {d}
                 </div>
               ))}
            </div>
            
            {/* Days Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto">
               {renderCalendarDays()}
            </div>
         </div>

         {/* Right Sidebar: Unscheduled Queue */}
         <div className="w-80 bg-dark-surface border border-dark-border rounded-xl flex flex-col shadow-xl">
            <div className="p-4 border-b border-dark-border bg-black/20">
               <h3 className="font-bold text-white flex items-center gap-2">
                 <GripVertical className="w-4 h-4 text-brand-500" /> Asset Queue
               </h3>
               <p className="text-xs text-zinc-500 mt-1">{unscheduledAssets.length} items ready to schedule</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
               {unscheduledAssets.length === 0 ? (
                 <div className="text-center py-10 opacity-50">
                    <CheckCircle2 className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                    <p className="text-sm text-zinc-500">Queue empty</p>
                 </div>
               ) : (
                 unscheduledAssets.map(asset => (
                   <div 
                     key={asset.id}
                     draggable
                     onDragStart={(e) => handleDragStart(e, asset)}
                     className="bg-black/40 border border-zinc-800 rounded-lg p-3 cursor-grab hover:border-brand-500/50 hover:bg-black/60 transition-all group active:cursor-grabbing"
                   >
                     <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                          {/* Corrected property access from asset.platform to asset.metadata.channel */}
                          <PlatformIcon platform={asset.metadata.channel} /> {asset.metadata.channel}
                       </span>
                       <button className="text-zinc-600 hover:text-white"><MoreHorizontal className="w-3 h-3" /></button>
                     </div>
                     <p className="text-xs text-zinc-300 font-medium line-clamp-2 mb-2 group-hover:text-white">{asset.title}</p>
                     <div className="flex items-center justify-between text-[10px] text-zinc-600">
                        {/* Corrected property access from asset.qualityScore to asset.metadata.qualityScore */}
                        <span>Score: {asset.metadata.qualityScore || 'N/A'}</span>
                        <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">Draft</span>
                     </div>
                   </div>
                 ))
               )}
            </div>
            
            <div className="p-4 border-t border-dark-border bg-black/20 text-[10px] text-zinc-500 text-center">
              Drag items to calendar to schedule
            </div>
         </div>
      </div>
    </div>
  );
};

export default SchedulerPage;
