import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { SessionUser, ChatMessage, ActivityLogItem } from '../types';
import { collabService } from '../services/collaborationService';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  Send, 
  Mic, 
  Settings, 
  Lock, 
  Edit3, 
  MoreVertical,
  Wifi,
  History,
  MousePointer2
} from 'lucide-react';

const LiveSessionPage = () => {
  const { currentBrand } = useStore();
  
  // State
  const [activeUsers, setActiveUsers] = useState<SessionUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'activity'>('chat');
  
  // Shared Canvas State (Mock Editable Fields)
  const [mission, setMission] = useState(currentBrand?.mission || '');
  const [isEditingMission, setIsEditingMission] = useState(false);

  const currentUser = activeUsers.find(u => u.id === 'u1') || { id: 'u1', name: 'You', color: '#14b8a6' };
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveUsers(collabService.getInitialUsers());
    if (currentBrand) setMission(currentBrand.mission);

    const unsubscribe = collabService.subscribe((type, data) => {
      if (type === 'chat') {
        setMessages(prev => [...prev, data]);
      } else if (type === 'activity') {
        setActivities(prev => [data, ...prev]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentBrand]);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    // Optimistic UI
    const myUser = activeUsers[0]; // Assuming index 0 is current user for demo
    collabService.sendMessage(inputMessage, myUser);
    setInputMessage('');
  };

  const handleSaveMission = () => {
    setIsEditingMission(false);
    // Simulate broadcasting the change
    // In a real app, this would send an update to the service
    setActivities(prev => [{
      id: crypto.randomUUID(),
      userId: 'u1',
      userName: 'Sarah Chen',
      action: 'updated',
      target: 'Mission Statement',
      timestamp: new Date().toISOString()
    }, ...prev]);
  };

  if (!currentBrand) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-zinc-500">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Please select or extract a Brand DNA to enter a Live Session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-dark-bg">
      {/* Session Header */}
      <div className="h-16 border-b border-dark-border bg-dark-surface px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/20 border border-red-500/30">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">LIVE</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">{currentBrand.name} Strategy Session</h1>
            <p className="text-[10px] text-zinc-500">Session ID: #LIV-8821 • {activeUsers.length} Active</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {activeUsers.map(user => (
              <div key={user.id} className="relative group cursor-help">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-dark-surface`} style={{ backgroundColor: user.color }}>
                  {user.avatar}
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                   {user.name} ({user.role})
                </div>
                {user.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-dark-surface rounded-full"></div>
                )}
              </div>
            ))}
            <button className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-dark-surface flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors text-xs">
              +
            </button>
          </div>
          
          <div className="h-6 w-px bg-zinc-800 mx-2"></div>
          
          <button className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5">
            <Settings className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg transition-colors">
            Share Link
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: SHARED CANVAS (Work Area) */}
        <div className="flex-1 bg-black/20 p-8 overflow-y-auto relative">
           {/* Mock Cursors */}
           <div className="absolute top-32 left-1/3 flex items-start gap-1 transition-all duration-1000 ease-in-out pointer-events-none opacity-50">
              <MousePointer2 className="w-4 h-4 fill-purple-500 text-purple-500" />
              <span className="bg-purple-500 text-white text-[10px] px-1 rounded">Marcus</span>
           </div>

           <div className="max-w-3xl mx-auto space-y-8">
              {/* Mission Statement Editor */}
              <div className="bg-dark-surface border border-dark-border rounded-xl shadow-lg overflow-hidden group">
                 <div className="p-4 border-b border-dark-border flex justify-between items-center bg-black/20">
                    <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Mission Statement</h3>
                    <div className="flex gap-2">
                       <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                         <Wifi className="w-3 h-3 text-green-500" /> Synced
                       </span>
                    </div>
                 </div>
                 
                 <div className="p-6">
                    {isEditingMission ? (
                      <div className="space-y-3">
                         <textarea 
                           value={mission}
                           onChange={(e) => setMission(e.target.value)}
                           className="w-full h-32 bg-black/40 border border-brand-500 rounded-lg p-4 text-white focus:outline-none resize-none"
                           autoFocus
                         />
                         <div className="flex justify-end gap-2">
                            <button onClick={() => setIsEditingMission(false)} className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white">Cancel</button>
                            <button onClick={handleSaveMission} className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded">Save Changes</button>
                         </div>
                      </div>
                    ) : (
                      <div className="relative group/edit">
                         <p className="text-xl text-zinc-200 leading-relaxed font-serif italic">"{mission}"</p>
                         <button 
                           onClick={() => setIsEditingMission(true)}
                           className="absolute -top-2 -right-2 p-2 bg-zinc-800 text-zinc-400 rounded-lg opacity-0 group-hover/edit:opacity-100 hover:text-brand-500 hover:bg-zinc-700 transition-all shadow-lg"
                         >
                           <Edit3 className="w-4 h-4" />
                         </button>
                      </div>
                    )}
                 </div>

                 {/* Comments simulated */}
                 <div className="px-6 pb-4 pt-2 border-t border-dark-border/50">
                    <div className="flex items-start gap-3">
                       <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] text-white font-bold shrink-0">MC</div>
                       <div className="bg-zinc-800/50 rounded-lg rounded-tl-none px-3 py-2 text-xs text-zinc-400">
                          <span className="font-bold text-purple-400">Marcus:</span> I think this version is much stronger. The "empowering" keyword resonates better.
                       </div>
                    </div>
                 </div>
              </div>

              {/* Core Values (Read Only for Demo) */}
              <div className="grid grid-cols-2 gap-4">
                 {currentBrand.coreValues.map((val, i) => (
                    <div key={i} className="bg-dark-surface border border-dark-border p-4 rounded-xl flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity">
                       <span className="font-bold text-zinc-300">{val}</span>
                       <Lock className="w-3 h-3 text-zinc-600" />
                    </div>
                 ))}
                 <div className="border border-dashed border-zinc-700 rounded-xl flex items-center justify-center p-4 text-zinc-500 text-sm hover:border-brand-500/50 hover:text-brand-500 cursor-pointer transition-colors">
                    + Add Value
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT: SIDEBAR (Chat/Activity) */}
        <div className="w-80 border-l border-dark-border bg-dark-surface flex flex-col shrink-0">
           {/* Tabs */}
           <div className="flex border-b border-dark-border">
              <button 
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'text-brand-500 border-b-2 border-brand-500 bg-brand-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <MessageSquare className="w-4 h-4" /> Team Chat
              </button>
              <button 
                onClick={() => setActiveTab('activity')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 ${activeTab === 'activity' ? 'text-brand-500 border-b-2 border-brand-500 bg-brand-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <History className="w-4 h-4" /> Activity
              </button>
           </div>

           <div className="flex-1 overflow-hidden relative">
              {/* CHAT VIEW */}
              {activeTab === 'chat' && (
                <div className="absolute inset-0 flex flex-col">
                   <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((msg) => {
                         const isMe = msg.userId === 'u1';
                         return (
                           <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                 {!isMe && <span className="text-[10px] font-bold text-zinc-400">{msg.userName}</span>}
                                 <span className="text-[10px] text-zinc-600">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                              <div className={`px-3 py-2 rounded-lg text-sm max-w-[90%] ${
                                 isMe 
                                   ? 'bg-brand-600 text-white rounded-tr-none' 
                                   : 'bg-zinc-800 text-zinc-200 rounded-tl-none'
                              }`}>
                                 {msg.text}
                              </div>
                           </div>
                         );
                      })}
                   </div>
                   
                   <form onSubmit={handleSendMessage} className="p-3 border-t border-dark-border bg-dark-surface">
                      <div className="relative">
                         <input 
                           type="text" 
                           value={inputMessage}
                           onChange={(e) => setInputMessage(e.target.value)}
                           placeholder="Type a message..."
                           className="w-full bg-black/40 border border-zinc-700 rounded-full py-2 pl-4 pr-10 text-white text-sm focus:border-brand-500 focus:outline-none"
                         />
                         <button type="submit" className="absolute right-1 top-1 p-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-full transition-colors">
                            <Send className="w-3 h-3" />
                         </button>
                      </div>
                   </form>
                </div>
              )}

              {/* ACTIVITY VIEW */}
              {activeTab === 'activity' && (
                <div className="absolute inset-0 overflow-y-auto p-4 space-y-4">
                   {activities.map(log => (
                      <div key={log.id} className="flex gap-3 text-sm">
                         <div className="mt-1 relative">
                            <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                            <div className="absolute top-3 left-1 w-px h-full bg-zinc-800 -z-10"></div>
                         </div>
                         <div className="pb-2">
                            <p className="text-zinc-300">
                               <span className="font-bold text-white">{log.userName}</span> {log.action} <span className="text-brand-400">{log.target}</span>
                            </p>
                            <p className="text-[10px] text-zinc-600 mt-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
                         </div>
                      </div>
                   ))}
                   {activities.length === 0 && (
                      <div className="text-center text-zinc-500 py-8 text-xs">
                         No recent activity.
                      </div>
                   )}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionPage;