import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Plus, 
  MoreHorizontal, 
  Play, 
  Pause, 
  Trash2, 
  ExternalLink, 
  Share2, 
  Users, 
  BarChart, 
  Mail, 
  CheckCircle2,
  Workflow
} from 'lucide-react';
import { getWorkflowTemplates, getActiveWorkflows, createWorkflow, toggleWorkflowStatus, deleteWorkflow } from '../services/n8nService';
import { Workflow as WorkflowType, WorkflowTemplate } from '../types';

// Icon mapper
const IconMap: Record<string, any> = {
  Share2,
  Users,
  BarChart,
  Mail
};

const AutomationsPage = () => {
  const [workflows, setWorkflows] = useState<WorkflowType[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setTemplates(getWorkflowTemplates());
    setWorkflows(getActiveWorkflows());
  }, []);

  const handleToggle = async (id: string) => {
    await toggleWorkflowStatus(id);
    setWorkflows([...getActiveWorkflows()]); // refresh
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      deleteWorkflow(id);
      setWorkflows([...getActiveWorkflows()]);
    }
  };

  const handleCreate = async () => {
    if (!selectedTemplate || !newWorkflowName) return;
    setIsCreating(true);
    await createWorkflow(selectedTemplate.id, newWorkflowName, newWebhookUrl);
    setWorkflows([...getActiveWorkflows()]);
    setIsCreating(false);
    setIsModalOpen(false);
    // Reset form
    setNewWorkflowName('');
    setNewWebhookUrl('');
    setSelectedTemplate(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Zap className="w-8 h-8 text-brand-500" /> Automations
          </h1>
          <p className="text-zinc-400">Orchestrate your marketing stack with n8n, Zapier, and custom webhooks.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-brand-900/20 transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" /> New Workflow
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-surface border border-dark-border p-4 rounded-xl">
          <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Active Flows</p>
          <p className="text-2xl font-bold text-white">{workflows.filter(w => w.status === 'active').length}</p>
        </div>
        <div className="bg-dark-surface border border-dark-border p-4 rounded-xl">
          <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Total Runs (24h)</p>
          <p className="text-2xl font-bold text-brand-400">1,240</p>
        </div>
        <div className="bg-dark-surface border border-dark-border p-4 rounded-xl">
          <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-green-500">99.8%</p>
        </div>
        <div className="bg-dark-surface border border-dark-border p-4 rounded-xl flex items-center justify-between">
           <div>
              <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Platform Status</p>
              <p className="text-sm font-bold text-zinc-300">n8n Cloud</p>
           </div>
           <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
        </div>
      </div>

      {/* Active Workflows List */}
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden mb-8">
        <div className="p-4 border-b border-dark-border bg-black/20 flex justify-between items-center">
          <h3 className="font-bold text-zinc-200">Deployed Workflows</h3>
          <span className="text-xs text-zinc-500">{workflows.length} defined</span>
        </div>
        
        {workflows.length === 0 ? (
           <div className="p-12 text-center text-zinc-500">
             <Workflow className="w-12 h-12 mx-auto mb-4 opacity-20" />
             <p>No active workflows deployed.</p>
             <button onClick={() => setIsModalOpen(true)} className="text-brand-500 hover:underline text-sm mt-2">Deploy your first automation</button>
           </div>
        ) : (
          <div className="divide-y divide-dark-border">
            {workflows.map(wf => {
              const template = templates.find(t => t.id === wf.templateId);
              const Icon = template ? IconMap[template.icon] : Workflow;

              return (
                <div key={wf.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  <div className={`p-3 rounded-lg ${wf.status === 'active' ? 'bg-brand-500/10 text-brand-500' : 'bg-zinc-800 text-zinc-500'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <h4 className="font-bold text-white truncate">{wf.name}</h4>
                       {wf.status === 'error' && <span className="text-[10px] bg-red-900/30 text-red-400 px-1.5 py-0.5 rounded border border-red-900/50">ERROR</span>}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1">
                      <span>Runs: {wf.runCount}</span>
                      <span>Last: {wf.lastRun ? new Date(wf.lastRun).toLocaleString() : 'Never'}</span>
                      <span className="flex items-center gap-1 uppercase tracking-wider font-mono">
                        {template?.provider}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleToggle(wf.id)}
                      className={`p-2 rounded-full transition-colors ${
                        wf.status === 'active' 
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                      title={wf.status === 'active' ? 'Pause Workflow' : 'Resume Workflow'}
                    >
                      {wf.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(wf.id)}
                      className="p-2 rounded-full hover:bg-red-500/10 hover:text-red-500 text-zinc-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Integration Providers (Visual) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['n8n', 'Zapier', 'Make', 'ActivePieces'].map(provider => (
          <div key={provider} className="p-4 border border-zinc-800 rounded-lg bg-black/20 flex items-center justify-between group cursor-pointer hover:border-brand-500/30 transition-all">
             <span className="font-bold text-zinc-400 group-hover:text-white transition-colors">{provider}</span>
             <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-brand-500 transition-colors" />
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-dark-surface border border-dark-border rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-dark-border flex justify-between items-center">
               <h2 className="text-xl font-bold text-white">Configure Automation</h2>
               <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            
            <div className="p-6">
              {!selectedTemplate ? (
                // Step 1: Select Template
                <>
                  <p className="text-sm text-zinc-400 mb-4">Choose a starting template for your workflow:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map(t => {
                       const Icon = IconMap[t.icon] || Workflow;
                       return (
                         <div 
                           key={t.id}
                           onClick={() => { setSelectedTemplate(t); setNewWorkflowName(t.name); }}
                           className="p-4 rounded-lg border border-zinc-800 bg-black/20 hover:bg-brand-500/5 hover:border-brand-500/30 cursor-pointer transition-all group text-left"
                         >
                            <div className="flex items-center gap-3 mb-2">
                               <div className="p-2 rounded bg-zinc-800 text-zinc-400 group-hover:text-brand-400 transition-colors">
                                 <Icon className="w-5 h-5" />
                               </div>
                               <span className="font-bold text-zinc-200 group-hover:text-white">{t.name}</span>
                            </div>
                            <p className="text-xs text-zinc-500 line-clamp-2">{t.description}</p>
                         </div>
                       );
                    })}
                  </div>
                </>
              ) : (
                // Step 2: Configure
                <div className="space-y-4">
                  <div className="p-3 bg-brand-900/10 border border-brand-900/30 rounded-lg flex items-center gap-3 mb-6">
                     <CheckCircle2 className="w-5 h-5 text-brand-500" />
                     <span className="text-sm text-brand-200">Template: <strong>{selectedTemplate.name}</strong></span>
                     <button onClick={() => setSelectedTemplate(null)} className="ml-auto text-xs text-brand-500 hover:underline">Change</button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Workflow Name</label>
                    <input 
                      type="text" 
                      value={newWorkflowName}
                      onChange={(e) => setNewWorkflowName(e.target.value)}
                      className="w-full bg-black/40 border border-zinc-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Webhook URL (Optional)</label>
                    <input 
                      type="url" 
                      value={newWebhookUrl}
                      onChange={(e) => setNewWebhookUrl(e.target.value)}
                      placeholder="https://your-n8n-instance.com/webhook/..."
                      className="w-full bg-black/40 border border-zinc-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm"
                    />
                    <p className="text-[10px] text-zinc-600 mt-1">If using n8n, paste the Production Webhook URL here to trigger it from CoreDNA.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-dark-border bg-black/20 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white">Cancel</button>
              {selectedTemplate && (
                <button 
                  onClick={handleCreate}
                  disabled={!newWorkflowName || isCreating}
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-500 disabled:bg-zinc-700 text-white rounded-lg font-bold transition-all"
                >
                  {isCreating ? 'Deploying...' : 'Create Workflow'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationsPage;