
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

export type VideoProvider = 'veo' | 'ltx' | 'runway' | 'luma' | 'pika' | 'kling';
export type VideoEngine = 'ltx-2' | 'sora-2-pro' | 'veo-3' | 'luma' | 'kling';

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
  healingHistory: any[];
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

export interface TrendItem {
  id: string;
  topic: string;
  category: string;
  volume: string;
  relevanceScore: number;
  summary: string;
  suggestedAngles: string[];
}

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
  portfolio?: any;
  estimatedRevenue?: string;
  headcount?: string;
  painPointDescription?: string;
  founderName?: string;
}
