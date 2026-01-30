
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BrandDNA, Campaign, UserTier, VideoJob, Agent, LeadProfile, ProviderConfig } from './types';

interface AppState {
  currentBrand: BrandDNA | null;
  brands: BrandDNA[];
  campaigns: Campaign[];
  leads: LeadProfile[];
  userTier: UserTier;
  credits: number;
  videoJobs: VideoJob[];
  agents: Agent[];
  providers: ProviderConfig;
  
  setBrand: (brand: BrandDNA) => void;
  addBrand: (brand: BrandDNA) => void;
  updateBrand: (id: string, updates: Partial<BrandDNA>) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => void;
  
  // Leads
  addLeads: (newLeads: LeadProfile[]) => void;
  updateLead: (id: string, updates: Partial<LeadProfile>) => void;
  deleteLead: (id: string) => void;
  
  // Scheduling
  scheduleAsset: (assetId: string, scheduledAt: string) => void;
  
  setTier: (tier: UserTier) => void;
  deductCredits: (amount: number) => void;
  addVideoJob: (job: VideoJob) => void;
  updateVideoJob: (id: string, updates: Partial<VideoJob>) => void;
  
  // Agents
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;

  // Providers
  updateProviders: (updates: Partial<ProviderConfig>) => void;
  setApiKey: (provider: keyof ProviderConfig['keys'], key: string) => void;
  
  reset: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentBrand: null,
      brands: [],
      campaigns: [],
      leads: [],
      userTier: 'pro',
      credits: 500,
      videoJobs: [],
      agents: [],
      providers: {
        activeLLM: 'gemini',
        activeImage: 'gemini',
        activeVideo: 'veo',
        activeWorkflow: 'n8n',
        keys: {
          gemini: process.env.API_KEY || ''
        }
      },
      
      setBrand: (brand) => set({ currentBrand: brand }),
      addBrand: (brand) => set((state) => ({ 
        brands: [brand, ...state.brands.filter(b => b.id !== brand.id)],
        currentBrand: brand
      })),
      updateBrand: (id, updates) => set((state) => {
        const updatedBrands = state.brands.map(b => b.id === id ? { ...b, ...updates } : b);
        const updatedCurrent = state.currentBrand?.id === id ? { ...state.currentBrand, ...updates } : state.currentBrand;
        return { brands: updatedBrands, currentBrand: updatedCurrent as BrandDNA | null };
      }),
      addCampaign: (campaign) => set((state) => ({
        campaigns: [campaign, ...state.campaigns]
      })),
      updateCampaign: (id, updates) => set((state) => ({
        campaigns: state.campaigns.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      
      addLeads: (newLeads) => set((state) => ({ leads: [...newLeads, ...state.leads] })),
      updateLead: (id, updates) => set((state) => ({
        leads: state.leads.map(l => l.id === id ? { ...l, ...updates } : l)
      })),
      deleteLead: (id) => set((state) => ({
        leads: state.leads.filter(l => l.id !== id)
      })),
      
      scheduleAsset: (assetId, scheduledAt) => set((state) => {
        const newCampaigns = state.campaigns.map(c => {
          const assetIndex = c.assets.findIndex(a => a.id === assetId);
          if (assetIndex > -1) {
            const updatedAssets = [...c.assets];
            updatedAssets[assetIndex] = {
              ...updatedAssets[assetIndex],
              metadata: { ...updatedAssets[assetIndex].metadata, status: 'approved', scheduledAt }
            };
            return { ...c, assets: updatedAssets };
          }
          return c;
        });
        return { campaigns: newCampaigns };
      }),
      
      setTier: (tier) => set({ userTier: tier }),
      deductCredits: (amount) => set((state) => ({ credits: Math.max(0, state.credits - amount) })),
      addVideoJob: (job) => set((state) => ({ videoJobs: [job, ...state.videoJobs] })),
      updateVideoJob: (id, updates) => set((state) => ({
        videoJobs: state.videoJobs.map(j => j.id === id ? { ...j, ...updates } : j)
      })),

      addAgent: (agent) => set((state) => ({ agents: [agent, ...state.agents] })),
      updateAgent: (id, updates) => set((state) => ({
        agents: state.agents.map(a => a.id === id ? { ...a, ...updates } : a)
      })),
      deleteAgent: (id) => set((state) => ({
        agents: state.agents.filter(a => a.id !== id)
      })),

      updateProviders: (updates) => set((state) => ({
        providers: { ...state.providers, ...updates }
      })),
      setApiKey: (provider, key) => set((state) => ({
        providers: {
          ...state.providers,
          keys: { ...state.providers.keys, [provider]: key }
        }
      })),
      
      reset: () => set({ currentBrand: null, brands: [], campaigns: [], videoJobs: [], agents: [], leads: [] })
    }),
    {
      name: 'coredna2-storage-v2',
    }
  )
);
