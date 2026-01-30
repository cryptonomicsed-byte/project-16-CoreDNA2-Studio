
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { Agent, AgentType, AgentMessage } from '../types';
import { chatWithAgent } from '../services/agentService';
import { 
  Bot, 
  Plus, 
  Settings, 
  BookOpen, 
  Shield, 
  MessageSquare, 
  Rocket, 
  Trash2, 
  Save, 
  Upload, 
  Terminal,
  User,
  Send,
  RefreshCw,
  MoreVertical,
  Briefcase,
  Sparkles,
  Dna
} from 'lucide-react';

const AgentForgePage = () => {
  const { agents, addAgent, updateAgent, deleteAgent, currentBrand } = useStore();
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'config' | 'knowledge' | 'test'>('config');

  // Form State
  const [formData, setFormData] = useState<Partial<Agent>>({});
  const [isDirty, setIsDirty] = useState(false);
  
  // Test Chat State
  const [chatHistory, setChatHistory] = useState<AgentMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize form when selection changes
  useEffect(() => {
    const agent = agents.find(a => a.id === selectedAgentId);
    if (agent) {
      setFormData(agent);
      setIsDirty(false);
      // Reset chat
      setChatHistory([{
        id: 'init',
        role: 'model',
        text: `Hello! I am ${agent.name}. How can I assist you today?`,
        timestamp: new Date().toISOString()
      }]);
    } else {
      setFormData({}); // Creating new
    }
  }, [selectedAgentId, agents]);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, activeTab]);

  const handleCreateNew = () => {
    // If a brand is loaded, pre-configure the agent to work for that brand
    const baseName = currentBrand ? `${currentBrand.name} Rep` : 'New Agent';
    const baseRole = currentBrand ? 'Brand Representative' : 'Assistant';
    const basePersonality = currentBrand ? currentBrand.tone.personality : 'Helpful';
    
    const baseInstruction = currentBrand 
      ? `You are an official AI representative for "${currentBrand.name}".
         
         BRAND CONTEXT:
         - Mission: ${currentBrand.mission}
         - Core Values: ${currentBrand.coreValues.join(', ')}
         - Tone of Voice: ${currentBrand.tone.personality} (${currentBrand.tone.adjectives.join(', ')})
         - Key Messaging: ${currentBrand.keyMessaging.join(' | ')}
         
         Your goal is to assist users while strictly adhering to this brand identity.`
      : 'You are a helpful assistant.';

    const baseGuardrails = currentBrand 
      ? [`Never contradict the brand mission: ${currentBrand.mission.substring(0, 50)}...`, `Maintain a ${currentBrand.tone.personality} tone at all times.`] 
      : [];

    const baseKnowledge = currentBrand
      ? [`${currentBrand.name}_Brand_Guidelines.pdf`, 'Product_Catalog.csv']
      : [];

    const newAgent: Agent = {
      id: crypto.randomUUID(),
      name: baseName,
      type: 'custom',
      role: baseRole,
      personality: basePersonality,
      systemInstruction: baseInstruction,
      guardrails: baseGuardrails,
      knowledgeBase: baseKnowledge,
      status: 'draft',
      avatar: '🤖'
    };
    addAgent(newAgent);
    setSelectedAgentId(newAgent.id);
  };

  const handleAutoRecruit = () => {
    if (!currentBrand) return;
    
    const templates = [
      {
        name: `${currentBrand.name} Sales`,
        role: 'Sales Specialist',
        type: 'sales',
        personality: 'Persuasive, ' + currentBrand.tone.personality,
        avatar: '💼',
        instruction: `You are a top-tier Sales Agent for ${currentBrand.name}.
        
        Your Goal: Convert leads by pitching our unique value proposition: "${currentBrand.elevatorPitch}".
        
        Selling Points:
        ${currentBrand.keyMessaging.map(m => `- ${m}`).join('\n')}
        
        Target Audience: ${currentBrand.targetAudience.join(', ')}.
        Speak the language of our personas.`
      },
      {
        name: `${currentBrand.name} Support`,
        role: 'Customer Success',
        type: 'support',
        personality: 'Empathetic, ' + currentBrand.tone.personality,
        avatar: '🛡️',
        instruction: `You are the Head of Support for ${currentBrand.name}.
        
        Your Mission: ${currentBrand.mission}
        
        Handle inquiries with a ${currentBrand.tone.personality} tone.
        Never break character. Solve problems efficiently but warmly.`
      },
      {
        name: `${currentBrand.name} Creative`,
        role: 'Content Director',
        type: 'creative',
        personality: 'Visionary, ' + currentBrand.tone.personality,
        avatar: '🎨',
        instruction: `You are the AI Creative Director for ${currentBrand.name}.
        
        Visual Style: ${currentBrand.visualIdentity.styleKeywords.join(', ')}.
        Colors: ${currentBrand.visualIdentity.primaryColor}, ${currentBrand.visualIdentity.secondaryColor}.
        
        Review all content to ensure it matches our design system: "${currentBrand.visualIdentity.designSystem}".`
      }
    ];

    templates.forEach(t => {
      addAgent({
        id: crypto.randomUUID(),
        name: t.name,
        role: t.role,
        type: t.type as any,
        personality: t.personality,
        systemInstruction: t.instruction,
        guardrails: [`Uphold ${currentBrand.name} values: ${currentBrand.coreValues.join(', ')}`],
        knowledgeBase: [`${currentBrand.name}_Manifesto.pdf`],
        status: 'deployed',
        avatar: t.avatar
      });
    });

    alert(`Recruited 3 new agents for ${currentBrand.name}!`);
  };

  const handleSave = () => {
    if (selectedAgentId && formData) {
      updateAgent(selectedAgentId, formData);
      setIsDirty(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this agent?")) {
      deleteAgent(selectedAgentId);
      if (agents.length > 1) {
        setSelectedAgentId(agents.find(a => a.id !== selectedAgentId)?.id || '');
      } else {
        setSelectedAgentId('');
      }
    }
  };

  const handleDeploy = () => {
    if (selectedAgentId) {
      updateAgent(selectedAgentId, { 
        status: 'deployed',
        deployedUrl: `https://api.coredna.ai/agent/${selectedAgentId}`
      });
      alert(`Agent deployed! Endpoint: https://api.coredna.ai/agent/${selectedAgentId}`);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const agent = agents.find(a => a.id === selectedAgentId);
    if (!agent) return;

    const userMsg: AgentMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: chatInput,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      // Use the formData (current config) instead of saved agent to allow testing unsaved changes
      const configToTest = { ...agent, ...formData } as Agent;
      
      const response = await chatWithAgent(configToTest, chatHistory, userMsg.text);
      
      const botMsg: AgentMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: response,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const updateField = (field: keyof Agent, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const addGuardrail = () => {
    const current = formData.guardrails || [];
    updateField('guardrails', [...current, 'New Guardrail']);
  };

  const updateGuardrail = (index: number, val: string) => {
    const current = [...(formData.guardrails || [])];
    current[index] = val;
    updateField('guardrails', current);
  };

  const removeGuardrail = (index: number) => {
    const current = [...(formData.guardrails || [])];
    current.splice(index, 1);
    updateField('guardrails', current);
  };

  if (agents.length === 0 && !selectedAgentId) {
     return (
       <div className="h-full flex items-center justify-center bg-dark-bg p-8">
          <div className="text-center max-w-md">
             <Bot className="w-16 h-16 mx-auto mb-6 text-brand-500 opacity-80" />
             <h2 className="text-2xl font-bold text-white mb-2">Agent Forge Empty</h2>
             <p className="text-zinc-400 mb-8">Deploy custom AI agents tailored to your brand identity.</p>
             
             <div className="flex flex-col gap-3">
               {currentBrand && (
                 <button 
                   onClick={handleAutoRecruit}
                   className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 flex items-center justify-center gap-3 transition-all"
                 >
                   <Sparkles className="w-5 h-5" />
                   Auto-Staff for {currentBrand.name}
                 </button>
               )}
               <button 
                 onClick={handleCreateNew}
                 className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all"
               >
                 <Plus className="w-5 h-5" />
                 Create Manual Agent
               </button>
             </div>
          </div>
       </div>
     );
  }

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <div className="flex h-full">
      {/* SIDEBAR LIST */}
      <div className="w-72 bg-dark-surface border-r border-dark-border flex flex-col shrink-0">
         <div className="p-4 border-b border-dark-border bg-black/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-brand-500" /> Agents
              </h2>
              <button onClick={handleCreateNew} className="p-2 hover:bg-brand-600/20 hover:text-brand-500 rounded-lg text-zinc-400 transition-colors" title="Create New">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {currentBrand && (
              <button 
                onClick={handleAutoRecruit}
                className="w-full py-2 bg-brand-900/20 border border-brand-500/30 text-brand-400 hover:bg-brand-900/40 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all mb-2"
              >
                <Sparkles className="w-3 h-3" /> Auto-Staff {currentBrand.name}
              </button>
            )}
         </div>
         
         <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {agents.map(agent => (
               <div 
                 key={agent.id}
                 onClick={() => setSelectedAgentId(agent.id)}
                 className={`p-3 rounded-lg cursor-pointer border transition-all flex items-center gap-3 ${
                    selectedAgentId === agent.id 
                      ? 'bg-brand-900/20 border-brand-500/50 text-white' 
                      : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                 }`}
               >
                  <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-lg">
                     {agent.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="font-bold text-sm truncate">{agent.name}</div>
                     <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                        {agent.status === 'deployed' && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                        {agent.type}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* MAIN CONTENT */}
      {selectedAgent && (
        <div className="flex-1 flex flex-col min-w-0 bg-dark-bg">
           {/* Header */}
           <div className="h-16 border-b border-dark-border bg-dark-surface px-6 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-xl shadow-lg">
                    {formData.avatar}
                 </div>
                 <div>
                    <h1 className="text-lg font-bold text-white flex items-center gap-2">
                      {formData.name}
                      {isDirty && <span className="text-[10px] bg-amber-900/30 text-amber-500 px-1.5 py-0.5 rounded border border-amber-900/50">Unsaved</span>}
                    </h1>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                       <span className="uppercase font-bold tracking-wider">{formData.status}</span>
                       {formData.status === 'deployed' && <span className="text-green-500 flex items-center gap-1"><Rocket className="w-3 h-3" /> Live</span>}
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <button 
                   onClick={handleDelete}
                   className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-900/10 rounded-lg transition-colors"
                 >
                   <Trash2 className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={handleSave}
                   disabled={!isDirty}
                   className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg flex items-center gap-2"
                 >
                   <Save className="w-4 h-4" /> Save
                 </button>
                 <button 
                   onClick={handleDeploy}
                   className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-brand-900/20"
                 >
                   <Rocket className="w-4 h-4" /> Deploy
                 </button>
              </div>
           </div>

           {/* Tabs */}
           <div className="flex border-b border-dark-border bg-black/20 shrink-0">
              <button 
                onClick={() => setActiveTab('config')}
                className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'config' ? 'border-brand-500 text-brand-500 bg-brand-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                 <Settings className="w-4 h-4" /> Configuration
              </button>
              <button 
                onClick={() => setActiveTab('knowledge')}
                className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'knowledge' ? 'border-brand-500 text-brand-500 bg-brand-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                 <BookOpen className="w-4 h-4" /> Knowledge Base
              </button>
              <button 
                onClick={() => setActiveTab('test')}
                className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'test' ? 'border-brand-500 text-brand-500 bg-brand-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                 <Terminal className="w-4 h-4" /> Playground
              </button>
           </div>

           {/* Content */}
           <div className="flex-1 overflow-y-auto p-6">
              
              {/* CONFIG TAB */}
              {activeTab === 'config' && (
                 <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    {currentBrand && (
                      <div className="bg-brand-900/10 border border-brand-500/20 p-4 rounded-lg flex items-center gap-3">
                         <Dna className="w-5 h-5 text-brand-500" />
                         <div className="text-sm">
                            <span className="text-brand-400 font-bold">Brand DNA Linked: </span>
                            <span className="text-zinc-300">{currentBrand.name}</span>
                         </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Agent Name</label>
                          <input 
                            type="text" 
                            value={formData.name || ''}
                            onChange={(e) => updateField('name', e.target.value)}
                            className="w-full bg-black/40 border border-zinc-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Role / Title</label>
                          <input 
                            type="text" 
                            value={formData.role || ''}
                            onChange={(e) => updateField('role', e.target.value)}
                            className="w-full bg-black/40 border border-zinc-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                          />
                       </div>
                    </div>

                    <div>
                       <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Personality / Voice</label>
                       <input 
                         type="text" 
                         value={formData.personality || ''}
                         onChange={(e) => updateField('personality', e.target.value)}
                         placeholder="e.g. Professional, Witty, Empathetic, Concise"
                         className="w-full bg-black/40 border border-zinc-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                       />
                    </div>

                    <div>
                       <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">System Instruction (Prompt)</label>
                       <textarea 
                         value={formData.systemInstruction || ''}
                         onChange={(e) => updateField('systemInstruction', e.target.value)}
                         className="w-full h-64 bg-black/40 border border-zinc-700 rounded-lg p-3 text-white font-mono text-sm focus:border-brand-500 outline-none resize-none leading-relaxed"
                       />
                       <p className="text-xs text-zinc-500 mt-2">Core instructions that define the agent's behavior. Auto-filled from Brand DNA.</p>
                    </div>

                    <div>
                       <div className="flex justify-between items-center mb-2">
                          <label className="block text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                             <Shield className="w-4 h-4" /> Guardrails
                          </label>
                          <button onClick={addGuardrail} className="text-xs text-brand-500 hover:text-brand-400 font-bold">+ Add Rule</button>
                       </div>
                       <div className="space-y-2">
                          {formData.guardrails?.map((rail, i) => (
                             <div key={i} className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={rail}
                                  onChange={(e) => updateGuardrail(i, e.target.value)}
                                  className="flex-1 bg-black/40 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:border-red-500 outline-none"
                                />
                                <button onClick={() => removeGuardrail(i)} className="text-zinc-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                             </div>
                          ))}
                          {(!formData.guardrails || formData.guardrails.length === 0) && (
                             <p className="text-sm text-zinc-600 italic">No guardrails defined.</p>
                          )}
                       </div>
                    </div>
                 </div>
              )}

              {/* KNOWLEDGE TAB */}
              {activeTab === 'knowledge' && (
                 <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-dark-surface border border-dashed border-zinc-700 rounded-xl p-8 text-center mb-8 hover:border-brand-500/50 transition-colors bg-black/20">
                       <Upload className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
                       <h3 className="text-lg font-bold text-white mb-2">Upload Knowledge Base</h3>
                       <p className="text-zinc-500 mb-6 max-w-md mx-auto">Drag & drop PDF, TXT, or MD files here to train your agent on specific company data.</p>
                       <button className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold text-sm">Select Files</button>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-4">Attached Documents</h3>
                    <div className="space-y-2">
                       {formData.knowledgeBase?.map((doc, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-dark-surface border border-dark-border rounded-lg">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-900/20 text-blue-400 rounded">
                                   <BookOpen className="w-4 h-4" />
                                </div>
                                <span className="text-sm text-zinc-200">{doc}</span>
                             </div>
                             <button className="text-zinc-500 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       ))}
                       {(!formData.knowledgeBase || formData.knowledgeBase.length === 0) && (
                          <p className="text-zinc-500 italic text-sm">No documents attached.</p>
                       )}
                    </div>
                 </div>
              )}

              {/* TEST TAB */}
              {activeTab === 'test' && (
                 <div className="h-full flex flex-col max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 border border-dark-border rounded-xl bg-black/20 overflow-hidden">
                    <div className="p-4 border-b border-dark-border bg-dark-surface/50 flex justify-between items-center">
                       <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <span className="text-xs font-bold text-zinc-400 uppercase">Test Environment</span>
                       </div>
                       <button 
                         onClick={() => setChatHistory([])}
                         className="p-1.5 hover:bg-white/10 rounded text-zinc-500 hover:text-white"
                         title="Reset Chat"
                       >
                         <RefreshCw className="w-4 h-4" />
                       </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                       {chatHistory.map((msg) => (
                          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-700' : 'bg-brand-600'}`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                             </div>
                             <div className={`max-w-[80%] rounded-lg p-3 text-sm leading-relaxed ${
                                msg.role === 'user' 
                                  ? 'bg-zinc-800 text-zinc-200 rounded-tr-none' 
                                  : 'bg-brand-900/20 border border-brand-500/20 text-zinc-200 rounded-tl-none'
                             }`}>
                                {msg.text}
                             </div>
                          </div>
                       ))}
                       {isTyping && (
                          <div className="flex gap-3">
                             <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                                <Bot className="w-4 h-4" />
                             </div>
                             <div className="bg-brand-900/20 border border-brand-500/20 rounded-lg rounded-tl-none p-3 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce delay-200"></span>
                             </div>
                          </div>
                       )}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-dark-border bg-dark-surface/50">
                       <div className="relative">
                          <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder={`Message ${formData.name}...`}
                            className="w-full bg-black/40 border border-zinc-700 rounded-lg py-3 pl-4 pr-12 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                          />
                          <button type="submit" className="absolute right-2 top-2 p-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded transition-colors">
                             <Send className="w-4 h-4" />
                          </button>
                       </div>
                    </form>
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default AgentForgePage;
