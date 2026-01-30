
export interface BrandDNA {
  id: string;
  name: string;
  url: string;
  extractedAt: string;
  confidenceScore: number;
  tagline: string;
  mission: string;
  elevatorPitch: string;
  coreValues: string[];
  keyMessaging: string[];
  targetAudience: string[];
  personas: {
    name: string;
    role: string;
    painPoints: string[];
  }[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  competitors: string[];
  tone: {
    adjectives: string[];
    description: string;
    personality: string;
  };
  visualIdentity: {
    primaryColor: string;
    secondaryColor: string;
    fontPairing: string;
    styleKeywords: string[];
    designSystem: string;
  };
  sonicIdentity: {
    voiceType: string;
    musicGenre: string;
    soundKeywords: string[];
  };
}

export type LLMProvider = 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'groq' | 'mistral';
export type ImageProvider = 'gemini' | 'openai' | 'stability' | 'fal' | 'leonardo' | 'replicate';
/* Updated VideoEngine type to include 'luma' and 'kling' which are used in videoService.ts */
export type VideoEngine = 'ltx-2' | 'sora-2-pro' | 'veo-3' | 'luma' | 'kling';
export type WorkflowProvider = 'n8n' | 'zapier' | 'make' | 'pipedream' | 'activepieces' | 'ghl';

export interface ProviderConfig {
  activeLLM: LLMProvider;
  activeImage: ImageProvider;
  activeVideo: VideoProvider;
  activeWorkflow: WorkflowProvider;
  keys: {
    gemini?: string;
    openai?: string;
    anthropic?: string;
    stability?: string;
    runway?: string;
    deepseek?: string;
    groq?: string;
    mistral?: string;
    fal?: string;
    leonardo?: string;
    replicate?: string;
    luma?: string;
    pika?: string;
    kling?: string;
    pipedream?: string;
    activepieces?: string;
    ghl?: string;
  };
}

export interface ChannelStrategy {
  channel: string;
  postFrequency: string;
  recommendedFormat: string;
  contentLength: string;
  bestTimes: string[];
}

export interface CampaignOverview {
  name: string;
  goal: string;
  audienceSegment: string;
  timeline: string;
  constraints: string[];
}

export interface UserStory {
  id: string;
  description: string;
  channel: string;
  assetTypes: ('social_post' | 'image' | 'video_prompt' | 'email' | 'blog_section' | 'ad')[];
  acceptanceCriteria: string[];
  dependencies: string[];
  priority: 'high' | 'medium' | 'low';
  dayOffset: number;
  status: 'pending' | 'generating' | 'validating' | 'healing' | 'completed' | 'failed';
}

export interface CampaignPRD {
  overview: CampaignOverview;
  channelStrategies: ChannelStrategy[];
  userStories: UserStory[];
  totalAssetsTarget: number;
  sequencingPlan: string;
}

export interface HealingReport {
  attempt: number;
  originalScore: number;
  finalScore: number;
  issuesDetected: string[];
  fixApplied: string;
  timestamp: string;
}

export interface CampaignAsset {
  id: string;
  storyId: string;
  headline?: string;
  title: string;
  content: string;
  cta?: string;
  hashtags: string[];
  imagePrompt?: string;
  imageUrl?: string;
  videoPrompt?: string;
  videoUrl?: string;
  emailSubject?: string;
  metadata: {
    channel: string;
    type: string;
    status: 'draft' | 'healing' | 'approved' | 'published';
    qualityScore: number;
    scheduledAt?: string;
  };
  healingHistory: HealingReport[];
}

export interface Campaign {
  id: string;
  name: string;
  goal: string;
  status: 'planning' | 'running' | 'completed';
  prd?: CampaignPRD;
  assets: CampaignAsset[];
  createdAt: string;
}

export interface BattleReport {
  id: string;
  brandAId: string;
  brandBId: string;
  analyzedAt: string;
  visualAnalysis: { summary: string; winner: 'A' | 'B' | 'Tie'; };
  messagingAnalysis: { summary: string; winner: 'A' | 'B' | 'Tie'; };
  marketPositioning: { overlap: 'High' | 'Medium' | 'Low'; differentiation: string; };
  scores: { brandA: number; brandB: number; breakdown: { category: string; scoreA: number; scoreB: number }[]; };
  gapAnalysis: { brandAMissing: string[]; brandBMissing: string[]; };
  critique: string;
}

export interface CloserPortfolio {
  subjectLine: string;
  emailBody: string;
  closingScript: string;
  objections: { objection: string; rebuttal: string }[];
  followUpSequence: string[];
}

export interface LeadProfile {
  id: string;
  companyName: string;
  industry: string;
  location: string;
  website: string;
  rating: number;
  contactEmail: string;
  techStack: string[];
  vulnerabilities: string[];
  opportunityScore: number;
  status: 'new' | 'contacted' | 'converted';
  portfolio?: CloserPortfolio;
  estimatedRevenue?: string;
  headcount?: string;
  painPointDescription?: string;
  founderName?: string;
}

export interface TrendItem {
  id: string;
  topic: string;
  category: string;
  volume: string;
  relevanceScore: number;
  summary: string;
  suggestedAngles: string[];
}

export type VideoProvider = 'veo' | 'ltx' | 'runway' | 'luma' | 'pika' | 'kling';
export type UserTier = 'free' | 'pro' | 'hunter' | 'agency';

export interface VideoJob {
  id: string;
  prompt: string;
  engine: VideoEngine;
  status: 'generating' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  cost: number;
}

export interface SessionUser {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'online' | 'away' | 'busy';
  color: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  type: 'chat' | 'system';
}

export interface ActivityLogItem {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface AffiliateStats {
  totalEarnings: number;
  pendingPayout: number;
  clicks: number;
  signups: number;
  conversionRate: number;
}

export interface AffiliatePayout {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'processing';
  date: string;
  method: string;
}

export interface AffiliateTier {
  name: string;
  commission: number;
  minReferrals: number;
  currentReferrals: number;
  nextTierName: string;
}

export interface DesignVariant {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontPairing: string;
  rationale: string;
}

export interface CopyVariant {
  id: string;
  text: string;
  tone: string;
  predictedScore: number;
  rationale: string;
}

export interface AudienceFeedback {
  id: string;
  personaName: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  comments: string;
  suggestedImprovement: string;
}

export type AgentType = 'support' | 'sales' | 'content' | 'creative' | 'custom';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  role: string;
  personality: string;
  systemInstruction: string;
  guardrails: string[];
  knowledgeBase: string[];
  status: 'draft' | 'deployed';
  avatar?: string;
  deployedUrl?: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export type SiteSectionType = 'hero' | 'features' | 'about' | 'cta' | 'footer' | 'testimonials';

export interface SiteSection {
  id: string;
  type: SiteSectionType;
  content: any;
  isVisible: boolean;
  order: number;
}

export interface WebsiteData {
  id: string;
  brandId: string;
  subdomain: string;
  sections: SiteSection[];
  status: 'draft' | 'deploying' | 'live';
  liveUrl?: string;
  lastDeployedAt?: string;
}

// Added Workflow and WorkflowTemplate for automation orchestration
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  provider: string;
  category: string;
  icon: string;
}

export interface Workflow {
  id: string;
  templateId: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastRun?: string;
  webhookUrl: string;
  runCount: number;
}

export enum ProcessingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  PLANNING = 'PLANNING', 
  GENERATING = 'GENERATING',
  HEALING = 'HEALING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
