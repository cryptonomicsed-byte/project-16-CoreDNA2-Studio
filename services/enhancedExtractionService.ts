import { BrandDNA } from "../types";
import { executeRLMAnalysis } from "./rlmService";
import { scrapeWebsite, ScrapedData } from "./scraperService";

export const enhanceBrandExtraction = async (
  url: string, 
  description: string,
  onProgress?: (status: string) => void
): Promise<BrandDNA> => {
  
  // 1. PERFORM ACTUAL SCRAPING
  if (onProgress) onProgress("Deploying Scraper Bots...");
  
  let scrapedData: ScrapedData | null = null;
  let scrapeContext = "";

  try {
    scrapedData = await scrapeWebsite(url);
    if (onProgress) onProgress("Parsing HTML DOM...");
    
    scrapeContext = `
      LIVE WEBSITE DATA (SCRAPED JUST NOW):
      - Page Title: "${scrapedData.title}"
      - Meta Description: "${scrapedData.metaDescription}"
      - Main Headlines (H1/H2): ${[...scrapedData.h1, ...scrapedData.h2].join(' | ')}
      - Social Signals: ${scrapedData.socialLinks.join(', ')}
      
      CORE BODY CONTENT (From Website):
      """
      ${scrapedData.bodyText}
      """
    `;
  } catch (e) {
    console.warn("Scraping failed, falling back to AI knowledge", e);
    if (onProgress) onProgress("Scraping blocked. Falling back to Neural Memory...");
    scrapeContext = "WARNING: Direct scraping failed. Rely on internal knowledge base for this URL.";
  }

  // 2. CONSTRUCT PROMPT WITH REAL DATA
  const prompt = `
    Analyze the brand based on this URL: ${url} and this user description: "${description}".
    
    ${scrapeContext}
    
    Act as a World-Class Brand Strategist (Ogilvy/McKinsey level). 
    Extract the "Core DNA" of this entity using the LIVE WEBSITE DATA provided above.
    Do NOT hallucinate features that are not present in the scraped content if possible.
    
    You MUST return a JSON object with the following specific structure.
    
    Structure:
    {
      "name": "Brand Name (from Title/H1)",
      "tagline": "Powerful, short tagline (infer from Hero text)",
      "mission": "Mission statement (infer from About/Meta)",
      "elevatorPitch": "1-sentence pitch based on Body Content",
      "coreValues": ["Value 1", "Value 2", "Value 3", "Value 4"],
      "keyMessaging": ["Message Pillar 1", "Message Pillar 2"],
      "targetAudience": ["Segment 1", "Segment 2"],
      "personas": [
        { "name": "Persona Name (e.g. Busy Mom)", "role": "Description", "painPoints": ["Pain 1", "Pain 2"] }
      ],
      "swot": {
        "strengths": ["Strength 1", "Strength 2"],
        "weaknesses": ["Weakness 1", "Weakness 2"],
        "opportunities": ["Opp 1", "Opp 2"],
        "threats": ["Threat 1", "Threat 2"]
      },
      "competitors": ["Competitor 1", "Competitor 2"],
      "tone": {
        "adjectives": ["Adj1", "Adj2", "Adj3"],
        "description": "Full tone description",
        "personality": "Archetype (e.g. Sage, Hero, Rebel)"
      },
      "visualIdentity": {
        "primaryColor": "Hex Code (Infer from brand feel)",
        "secondaryColor": "Hex Code",
        "fontPairing": "Font names (Header / Body)",
        "styleKeywords": ["Modern", "Clean", "Bold"],
        "designSystem": "Brief description of visual style"
      },
      "sonicIdentity": {
        "voiceType": "e.g. Warm, Professional",
        "musicGenre": "e.g. Lo-fi, Orchestral",
        "soundKeywords": ["Click", "Swoosh"]
      },
      "confidenceScore": 85
    }
  `;

  try {
    // 3. EXECUTE RECURSIVE ANALYSIS
    const jsonString = await executeRLMAnalysis(prompt, onProgress);
    
    // Check for fallback token before parsing
    if (jsonString === "FALLBACK_TRIGGERED") {
      if (onProgress) onProgress("Neural Quota Limit. Using optimized heuristic extraction...");
      // Return a basic structure derived from scraping if available, otherwise generic
      return {
        id: crypto.randomUUID(),
        url,
        extractedAt: new Date().toISOString(),
        name: scrapedData?.title || url.split('/')[2] || 'New Brand',
        tagline: scrapedData?.metaDescription || 'Heuristic Tagline',
        mission: 'Mission extracted via heuristic fallback.',
        elevatorPitch: scrapedData?.metaDescription || 'Autonomous brand entity.',
        coreValues: ['Integrity', 'Innovation', 'Quality'],
        keyMessaging: ['Reliability', 'Efficiency'],
        targetAudience: ['General Market'],
        personas: [],
        swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
        competitors: [],
        tone: { adjectives: ['Professional'], description: 'Direct and efficient.', personality: 'The Everyman' },
        visualIdentity: { primaryColor: '#14b8a6', secondaryColor: '#000000', fontPairing: 'Inter / Sans', styleKeywords: ['Clean'], designSystem: 'Minimalist' },
        sonicIdentity: { voiceType: 'Neutral', musicGenre: 'Ambient', soundKeywords: [] },
        confidenceScore: 40
      } as BrandDNA;
    }

    const data = JSON.parse(jsonString);

    // Hydrate & Sanitize
    return {
      id: crypto.randomUUID(),
      url,
      extractedAt: new Date().toISOString(),
      name: data.name || scrapedData?.title || 'Unknown Brand',
      tagline: data.tagline || scrapedData?.metaDescription || 'No tagline detected',
      mission: data.mission || '',
      elevatorPitch: data.elevatorPitch || '',
      coreValues: data.coreValues || [],
      keyMessaging: data.keyMessaging || [],
      targetAudience: data.targetAudience || [],
      personas: data.personas || [],
      swot: data.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      competitors: data.competitors || [],
      tone: {
        adjectives: data.tone?.adjectives || [],
        description: data.tone?.description || '',
        personality: data.tone?.personality || 'Neutral'
      },
      visualIdentity: {
        primaryColor: data.visualIdentity?.primaryColor || '#000000',
        secondaryColor: data.visualIdentity?.secondaryColor || '#ffffff',
        fontPairing: data.visualIdentity?.fontPairing || 'Sans',
        styleKeywords: data.visualIdentity?.styleKeywords || [],
        designSystem: data.visualIdentity?.designSystem || ''
      },
      sonicIdentity: {
        voiceType: data.sonicIdentity?.voiceType || 'Neutral',
        musicGenre: data.sonicIdentity?.musicGenre || 'Ambient',
        soundKeywords: data.sonicIdentity?.soundKeywords || []
      },
      confidenceScore: scrapedData ? (data.confidenceScore || 90) : 60 // Higher confidence if scraped
    } as BrandDNA;

  } catch (e) {
    console.error("Enhanced Extraction Failed", e);
    throw e;
  }
};