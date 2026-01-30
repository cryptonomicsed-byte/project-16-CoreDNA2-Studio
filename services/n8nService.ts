import { WorkflowTemplate, Workflow } from "../types";

// Mock Data for Templates
const TEMPLATES: WorkflowTemplate[] = [
  {
    id: 't1',
    name: 'Social Media Auto-Poster',
    description: 'Automatically posts generated assets to LinkedIn & Twitter on schedule.',
    provider: 'n8n',
    category: 'social',
    icon: 'Share2'
  },
  {
    id: 't2',
    name: 'CRM Lead Sync (HubSpot)',
    description: 'Syncs extracted lead data and email drafts directly to HubSpot contacts.',
    provider: 'n8n',
    category: 'crm',
    icon: 'Users'
  },
  {
    id: 't3',
    name: 'Weekly Analytics Report',
    description: 'Aggregates engagement metrics and sends a PDF summary via Slack.',
    provider: 'n8n',
    category: 'analytics',
    icon: 'BarChart'
  },
  {
    id: 't4',
    name: 'Email Drip Sequencer',
    description: 'Orchestrates a 5-step email campaign with delay logic and open tracking.',
    provider: 'make',
    category: 'email',
    icon: 'Mail'
  }
];

// In-memory storage for demo purposes (would be in Store/DB in real app)
let activeWorkflows: Workflow[] = [
  {
    id: 'w1',
    templateId: 't1',
    name: 'Main Brand Auto-Poster',
    status: 'active',
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    webhookUrl: 'https://n8n.coredna.ai/webhook/auto-post',
    runCount: 142
  }
];

export const getWorkflowTemplates = (): WorkflowTemplate[] => {
  return TEMPLATES;
};

export const getActiveWorkflows = (): Workflow[] => {
  return activeWorkflows;
};

export const createWorkflow = async (templateId: string, name: string, webhookUrl: string): Promise<Workflow> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const newWorkflow: Workflow = {
    id: crypto.randomUUID(),
    templateId,
    name,
    status: 'active',
    webhookUrl,
    runCount: 0,
    lastRun: undefined
  };

  activeWorkflows = [newWorkflow, ...activeWorkflows];
  return newWorkflow;
};

export const toggleWorkflowStatus = async (id: string): Promise<Workflow | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const wf = activeWorkflows.find(w => w.id === id);
  if (wf) {
    wf.status = wf.status === 'active' ? 'inactive' : 'active';
  }
  return wf;
};

export const deleteWorkflow = (id: string) => {
  activeWorkflows = activeWorkflows.filter(w => w.id !== id);
};

export const triggerWorkflowWebhook = async (url: string, payload: any) => {
  console.log(`[n8n] Triggering webhook: ${url}`, payload);
  // In a real app, this would be fetch(url, { method: 'POST', body: JSON.stringify(payload) })
  return { success: true };
};