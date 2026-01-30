
import { GoogleGenAI } from "@google/genai";
import { BrandDNA, DesignVariant, CopyVariant, AudienceFeedback } from "../types";
import { universalAiService } from "./universalAiService";

// --- Design Simulator ---
export const generateDesignVariants = async (brand: BrandDNA): Promise<DesignVariant[]> => {
  const prompt = `
    Act as a Creative Director. The current brand "${brand.name}" has these visuals:
    Primary: ${brand.visualIdentity.primaryColor}. Generate 3 DISTINCT alternative visual identities.
  `;

  try {
    const response = await universalAiService.generateText({
      prompt,
      responseMimeType: 'application/json',
      featureId: 'design-simulator'
    });

    if (response === "FALLBACK_TRIGGERED") {
       return [
        { id: 'v1', name: 'High Contrast', primaryColor: '#000000', secondaryColor: '#FFFF00', fontPairing: 'Helvetica / Roboto', rationale: 'Focuses on maximum legibility and industrial strength.' },
        { id: 'v2', name: 'Premium Trust', primaryColor: '#0F172A', secondaryColor: '#94A3B8', fontPairing: 'Playfair Display / Inter', rationale: 'Establishes high-end luxury through deep blues and serif typography.' },
        { id: 'v3', name: 'Cyber Neon', primaryColor: '#0D9488', secondaryColor: '#E11D48', fontPairing: 'Space Grotesk / Mono', rationale: 'Energetic digital-first palette for tech-forward audiences.' }
      ];
    }

    let data = JSON.parse(response || '[]');
    if (!Array.isArray(data)) data = data.variants || [];
    return data.map((v: any) => ({ ...v, id: crypto.randomUUID() }));
  } catch (e) {
    return [];
  }
};

// --- Copy Simulator ---
export const generateCopyVariants = async (brand: BrandDNA, originalText: string, type: 'tagline' | 'headline' | 'cta'): Promise<CopyVariant[]> => {
  const prompt = `
    Act as a Conversion Copywriter. Original ${type}: "${originalText}". Generate 3 variations.
  `;

  try {
    const response = await universalAiService.generateText({
      prompt,
      responseMimeType: 'application/json',
      featureId: 'copy-simulator'
    });

    if (response === "FALLBACK_TRIGGERED") {
      return [
        { id: 'c1', text: `Empowering ${brand.name} through Innovation`, tone: "Bold", predictedScore: 82, rationale: "Strong verb usage and direct benefit." },
        { id: 'c2', text: "Value that speaks for itself", tone: "Clear", predictedScore: 75, rationale: "Focuses on simple, direct messaging." },
        { id: 'c3', text: "Join the revolution of quality", tone: "Creative", predictedScore: 78, rationale: "Uses emotional community-driven language." }
      ];
    }

    let data = JSON.parse(response || '[]');
    if (!Array.isArray(data)) data = data.variants || [];
    return data.map((v: any) => ({ ...v, id: crypto.randomUUID() }));
  } catch (e) {
    return [];
  }
};

// --- Audience Simulator ---
export const simulateAudienceReaction = async (
  brand: BrandDNA, 
  content: string, 
  personaName: string, 
  personaRole: string
): Promise<AudienceFeedback> => {
  const prompt = `Act as persona: "${personaName}" evaluating content: "${content}".`;

  try {
    const response = await universalAiService.generateText({
      prompt,
      responseMimeType: 'application/json',
      featureId: 'audience-simulator'
    });

    if (response === "FALLBACK_TRIGGERED") {
      return {
        id: crypto.randomUUID(),
        personaName,
        sentiment: 'positive',
        score: 85,
        comments: `As a ${personaRole}, I find this messaging quite clear. It addresses my basic needs for quality and reliability, though I'd like to see more specifics on implementation.`,
        suggestedImprovement: "Try adding a clear time-frame or quantifiable metric to the value proposition."
      };
    }

    const data = JSON.parse(response || '{}');
    return {
      id: crypto.randomUUID(),
      personaName,
      ...data
    };
  } catch (e) {
    return {
      id: 'err',
      personaName,
      sentiment: 'neutral',
      score: 50,
      comments: "Simulation unavailable.",
      suggestedImprovement: "Try again later."
    };
  }
};
