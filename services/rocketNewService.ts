
import { BrandDNA, TrendItem } from "../types";
import { universalAiService } from "./universalAiService";

const MOCK_TRENDS: any[] = [
  {
    "topic": "Autonomous AI Agents",
    "category": "Technology",
    "volume": "1.8M+",
    "relevanceScore": 98,
    "summary": "AI agents are transitioning from simple chatbots to autonomous systems capable of complex task execution.",
    "suggestedAngles": ["How agents scale brand operations", "Integrating agents into customer support"]
  },
  {
    "topic": "Silent Luxury Branding",
    "category": "Culture",
    "volume": "850K+",
    "relevanceScore": 92,
    "summary": "Brands are shifting away from loud logos towards minimalist, high-quality material-focused marketing.",
    "suggestedAngles": ["Minimalist visual strategies", "The power of understated messaging"]
  },
  {
    "topic": "Social Commerce 2.0",
    "category": "Social Media",
    "volume": "2.4M+",
    "relevanceScore": 95,
    "summary": "Direct-to-consumer sales within short-form video apps are seeing record-breaking conversion rates.",
    "suggestedAngles": ["Short-form video for sales", "Optimizing for social checkout"]
  },
  {
    "topic": "Zero-Party Data Strategy",
    "category": "Privacy",
    "volume": "600K+",
    "relevanceScore": 88,
    "summary": "With cookies disappearing, brands are focused on data provided directly and voluntarily by consumers.",
    "suggestedAngles": ["Building trust through transparency", "Creating interactive data collection tools"]
  }
];

export const getBrandTrends = async (brand?: BrandDNA): Promise<TrendItem[]> => {
  const contextPrompt = brand 
    ? `The user is managing a brand called "${brand.name}" which operates in the industry related to: ${brand.mission}. Target audience: ${brand.targetAudience.join(', ')}.`
    : `The user has not selected a specific brand yet. Provide general high-impact marketing/tech/business trends.`;

  const prompt = `
    ${contextPrompt}
    Act as a "Trend Pulse" engine (Real-time News & Cultural Analysis).
    Identify 3-4 "Rising Trends" that are relevant RIGHT NOW.
    Return a JSON array of objects with this structure:
    [
      {
        "topic": "Topic Name",
        "category": "Category",
        "volume": "Search Volume",
        "relevanceScore": 0-100,
        "summary": "Summary of why it's trending.",
        "suggestedAngles": ["Angle 1", "Angle 2"]
      }
    ]
  `;

  try {
    const jsonString = await universalAiService.generateText({
      prompt,
      responseMimeType: 'application/json',
      featureId: 'trend-pulse'
    });

    if (jsonString === "FALLBACK_TRIGGERED") {
       return MOCK_TRENDS.map(t => ({ id: crypto.randomUUID(), isSimulated: true, ...t })) as TrendItem[];
    }

    let rawTrends = JSON.parse(jsonString || '[]');
    if (!Array.isArray(rawTrends)) {
       rawTrends = rawTrends.trends || [];
    }
    
    return rawTrends.map((t: any) => ({
      id: crypto.randomUUID(),
      topic: t.topic || 'Unknown Trend',
      category: t.category || 'General',
      volume: t.volume || 'N/A',
      relevanceScore: t.relevanceScore || 50,
      summary: t.summary || '',
      suggestedAngles: Array.isArray(t.suggestedAngles) ? t.suggestedAngles : [],
      isSimulated: false
    })) as TrendItem[];

  } catch (error) {
    console.warn("Trend Pulse AI failed, returning static pulse.", error);
    return MOCK_TRENDS.map(t => ({ id: crypto.randomUUID(), isSimulated: true, ...t })) as TrendItem[];
  }
};
