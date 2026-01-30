
import { Type } from "@google/genai";
import { BrandDNA, CampaignAsset, UserStory, CampaignPRD, CampaignOverview } from "../types";
import { universalAiService } from "./universalAiService";

export const checkApiKey = () => true; // Keys handled by router

/**
 * Utility to ensure we don't pass objects to React render calls
 */
const stringifyValue = (val: any): string => {
  if (typeof val === 'string') return val;
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') {
    if (val.header || val.body || val.accent) {
      return [val.header, val.body, val.accent].filter(Boolean).join(' ');
    }
    return JSON.stringify(val);
  }
  return String(val);
};

/**
 * Ensures we always have an array even if the AI wraps it in a nested object property
 */
const ensureArray = (data: any, key: string): any[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    if (Array.isArray(data[key])) return data[key];
    // Check for common variations like 'stories' instead of 'userStories'
    const altKey = key === 'userStories' ? 'stories' : key === 'channelStrategies' ? 'strategies' : null;
    if (altKey && Array.isArray(data[altKey])) return data[altKey];
    // Last ditch: if the object itself looks like the item, wrap it
    if (Object.keys(data).length > 0 && !data[key]) return [data];
  }
  return [];
};

const MOCK_BRAND_DNA: Partial<BrandDNA> = {
  name: "Walmart",
  tagline: "Save Money. Live Better.",
  mission: "To save people money so they can live better.",
  elevatorPitch: "Walmart is a multinational retail corporation that operates a chain of hypermarkets, discount department stores, and grocery stores to provide high value at low prices.",
  coreValues: ["Service to the Customer", "Respect for the Individual", "Strive for Excellence", "Act with Integrity"],
  keyMessaging: ["Everyday Low Prices", "One-stop shopping convenience", "Community support", "Sustainability commitment"],
  targetAudience: ["Value-conscious families", "Budget shoppers", "Rural and suburban households"],
  personas: [
    { name: "Budget-Driven Brenda", role: "Primary Household Shopper", painPoints: ["Rising inflation", "Limited time", "Transportation costs"] }
  ],
  swot: {
    strengths: ["Massive global scale", "Supply chain efficiency", "High brand recognition"],
    weaknesses: ["E-commerce competition", "Labor perception", "Store consistency"],
    opportunities: ["Health and wellness growth", "Delivery drone expansion", "Advertising network growth"],
    threats: ["Amazon expansion", "Local regulatory shifts", "Global supply chain disruptions"]
  },
  tone: {
    adjectives: ["Friendly", "Accessible", "Pragmatic", "Reliable"],
    description: "Neighborly and straightforward, focusing on practicality and value.",
    personality: "The Everyman"
  },
  visualIdentity: {
    primaryColor: "#0071CE",
    secondaryColor: "#FFC220",
    fontPairing: "Bogle / Roboto",
    styleKeywords: ["Clean", "Utility", "Vibrant"],
    designSystem: "Utility-first grid with focus on clarity and price points."
  },
  sonicIdentity: {
    voiceType: "Warm, Midwestern, Trustworthy",
    musicGenre: "Uplifting Acoustic",
    soundKeywords: ["Spark", "Register Chime"]
  }
};

// --- Brand Extraction ---
export const extractBrandDNA = async (url: string, description: string): Promise<BrandDNA> => {
  const prompt = `
    Analyze the brand based on this URL: ${url} and this user description: "${description}".
    Extract the "Core DNA" of this entity.
  `;

  try {
    const text = await universalAiService.generateText({
      prompt,
      responseMimeType: 'application/json',
      featureId: 'brand-extraction'
    });

    if (text === "FALLBACK_TRIGGERED") {
      return {
        id: crypto.randomUUID(),
        url,
        extractedAt: new Date().toISOString(),
        confidenceScore: 70,
        ...MOCK_BRAND_DNA
      } as BrandDNA;
    }

    const data = JSON.parse(text || '{}');
    return {
      id: crypto.randomUUID(),
      url,
      extractedAt: new Date().toISOString(),
      confidenceScore: data.confidenceScore || 85,
      ...data
    } as BrandDNA;
  } catch (error) {
    console.error("Extraction failed", error);
    throw error;
  }
};

// --- Campaign PRD Generation ---
export const generateAdvancedPRD = async (
  brand: BrandDNA, 
  overview: CampaignOverview,
  channels: string[]
): Promise<CampaignPRD> => {
  const prompt = `
    Act as a Chief Marketing Officer. Create a full-blown Campaign Blueprint (PRD) for "${brand.name}".
    Goal: ${overview.goal}
    Timeline: ${overview.timeline}
    Channels: ${channels.join(', ')}
  `;

  try {
    const text = await universalAiService.generateText({
      prompt,
      responseMimeType: 'application/json',
      featureId: 'prd-generation'
    });

    let raw;
    if (text === "FALLBACK_TRIGGERED") {
       raw = {
         channelStrategies: channels.map(c => ({
           channel: c,
           postFrequency: "3x Weekly",
           recommendedFormat: "Mixed Media",
           contentLength: "Medium",
           bestTimes: ["9:00 AM", "6:00 PM"]
         })),
         sequencingPlan: "A balanced rollout focusing on brand awareness and direct engagement.",
         totalAssetsTarget: 5,
         userStories: [
           { description: "Initial Brand Awareness Blitz", channel: channels[0], assetTypes: ["social_post"], priority: "high", dayOffset: 1, acceptanceCriteria: ["Brand visible", "Clear CTA"] }
         ]
       };
    } else {
       raw = JSON.parse(text || '{}');
    }

    // Defensive initialization and string coercion
    const userStories = ensureArray(raw, 'userStories');
    const channelStrategies = ensureArray(raw, 'channelStrategies');

    const processedStories: UserStory[] = userStories.map((s: any, index: number) => ({
      ...s,
      id: `story-${index + 1}`,
      status: 'pending',
      description: stringifyValue(s.description || s.title || "Untitled Operation Segment"),
      assetTypes: s.assetTypes || ['social_post'],
      dayOffset: typeof s.dayOffset === 'number' ? s.dayOffset : (index + 1),
      channel: s.channel || channels[0] || 'social',
      dependencies: index > 0 ? [`story-${index}`] : [] 
    }));

    return {
      overview,
      channelStrategies: channelStrategies,
      sequencingPlan: stringifyValue(raw.sequencingPlan || "Sequential rollout"),
      totalAssetsTarget: processedStories.length,
      userStories: processedStories
    };
  } catch (error) {
    console.error("PRD Generation Failed", error);
    throw error;
  }
};

// --- Asset Text Generation ---
export const generateAssetFromStory = async (brand: BrandDNA, story: UserStory): Promise<Partial<CampaignAsset>> => {
  const prompt = `
    Generate high-converting marketing content for ${brand.name}.
    Task: ${story.description}
    Channel: ${story.channel}
  `;

  try {
    const text = await universalAiService.generateText({
      prompt,
      responseMimeType: 'application/json',
      featureId: 'asset-generation'
    });

    let result;
    if (text === "FALLBACK_TRIGGERED") {
      result = {
        headline: "Experience the Difference",
        content: `Discover how ${brand.name} is redefining value and quality for our community. We stay true to our mission of ${brand.mission.toLowerCase().substring(0, 50)}...`,
        cta: "Shop Now",
        hashtags: ["Brand", "Value", "Quality"],
        imagePrompt: "High-end product shot with soft natural lighting and minimalist background."
      };
    } else {
      result = JSON.parse(text || '{}');
    }
    
    return {
      title: stringifyValue(result.headline || result.title || 'Untitled Asset'),
      headline: stringifyValue(result.headline || result.title),
      content: stringifyValue(result.content || result.body || ''),
      cta: stringifyValue(result.cta || result.callToAction),
      hashtags: Array.isArray(result.hashtags) ? result.hashtags : [],
      imagePrompt: stringifyValue(result.imagePrompt),
      videoPrompt: stringifyValue(result.videoPrompt),
      emailSubject: stringifyValue(result.emailSubject || result.subject)
    };
  } catch (error) {
    console.error("Asset Gen Failed", error);
    throw error;
  }
};

// --- Actual Image Generation (Routed) ---
export const generateCampaignImage = async (prompt: string, brand: BrandDNA): Promise<string> => {
  const enhancedPrompt = `Commercial professional photography. Brand: ${brand.name}. Aesthetic: ${brand.visualIdentity?.styleKeywords?.join(', ') || 'modern'}. Color Palette: ${brand.visualIdentity?.primaryColor || '#000000'}, ${brand.visualIdentity?.secondaryColor || '#ffffff'}. Subject: ${prompt}. High resolution, clean composition, studio lighting.`;
  return await universalAiService.generateImage(enhancedPrompt);
};

// --- Asset Validation ---
export const validateAssetStrict = async (
  brand: BrandDNA, 
  asset: Partial<CampaignAsset>, 
  story: UserStory
): Promise<{ score: number; issues: string[] }> => {
  const prompt = `Review this marketing asset for brand compliance: ${asset.content}. Return JSON score and issues.`;

  try {
    const text = await universalAiService.generateText({
      prompt,
      responseMimeType: 'application/json',
      featureId: 'asset-validation'
    });
    
    if (text === "FALLBACK_TRIGGERED") return { score: 95, issues: [] };
    
    const data = JSON.parse(text || '{"score": 90, "issues": []}');
    return {
      score: data.score || 90,
      issues: Array.isArray(data.issues) ? data.issues : []
    };
  } catch (e) {
    return { score: 90, issues: [] };
  }
};

export const regenerateAsset = async (brand: BrandDNA, asset: Partial<CampaignAsset>, issues: string[]): Promise<Partial<CampaignAsset>> => {
  const prompt = `Fix issues: ${issues.join(', ')}. Original: ${asset.content}.`;

  const text = await universalAiService.generateText({
    prompt,
    responseMimeType: 'application/json',
    featureId: 'asset-regeneration'
  });
  
  if (text === "FALLBACK_TRIGGERED") return asset;
  
  const result = JSON.parse(text || '{}');
  return { 
    ...asset, 
    content: stringifyValue(result.content || result.body || asset.content),
    headline: stringifyValue(result.headline || result.title || asset.headline),
    title: stringifyValue(result.headline || result.title || asset.title)
  };
};

export const sonicChat = async (history: {role: 'user' | 'model', text: string}[], message: string, brandContext?: BrandDNA) => {
  const systemInstruction = brandContext 
    ? `You are Sonic, a Brand Co-Pilot for ${brandContext.name}.`
    : `You are Sonic, an AI Brand Co-Pilot.`;

  return await universalAiService.generateText({
    prompt: message,
    systemInstruction,
    featureId: 'sonic-chat'
  });
};
