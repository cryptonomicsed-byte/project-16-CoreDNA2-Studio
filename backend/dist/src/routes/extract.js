"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gemini_js_1 = require("../utils/gemini.js");
const scraper_js_1 = require("../utils/scraper.js");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        const { url, description = '' } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        console.log(`[Extract] Starting brand extraction for: ${url}`);
        // Step 1: Scrape the website
        console.log('[Extract] Scraping website...');
        const scrapedData = await (0, scraper_js_1.scrapeWebsite)(url);
        // Step 2: Build context from scraped data
        const scrapeContext = `
      LIVE WEBSITE DATA (SCRAPED):
      - Title: "${scrapedData.title}"
      - Meta Description: "${scrapedData.metaDescription}"
      - Headlines: ${[...scrapedData.h1, ...scrapedData.h2].join(' | ')}
      - Social Links: ${scrapedData.socialLinks.join(', ')}
      
      BODY CONTENT:
      """
      ${scrapedData.bodyText}
      """
    `;
        // Step 3: Generate brand DNA via Gemini
        console.log('[Extract] Analyzing with Gemini...');
        const prompt = `
      Analyze the brand at ${url}.
      User description: "${description}"
      
      ${scrapeContext}
      
      Act as a brand strategist. Extract the core DNA as a JSON object with this structure:
      {
        "name": "Brand Name",
        "tagline": "Short tagline",
        "mission": "Mission statement",
        "elevatorPitch": "1-sentence pitch",
        "coreValues": ["Value1", "Value2", "Value3"],
        "keyMessaging": ["Message1", "Message2"],
        "targetAudience": ["Segment1", "Segment2"],
        "personas": [{"name": "Name", "role": "Role", "painPoints": ["Pain1"]}],
        "swot": {
          "strengths": ["S1", "S2"],
          "weaknesses": ["W1", "W2"],
          "opportunities": ["O1", "O2"],
          "threats": ["T1", "T2"]
        },
        "competitors": ["Competitor1"],
        "tone": {
          "adjectives": ["Adj1", "Adj2"],
          "description": "Description",
          "personality": "Archetype"
        },
        "visualIdentity": {
          "primaryColor": "#000000",
          "secondaryColor": "#FFFFFF",
          "fontPairing": "Font1 / Font2",
          "styleKeywords": ["Keyword1"],
          "designSystem": "Description"
        },
        "sonicIdentity": {
          "voiceType": "Type",
          "musicGenre": "Genre",
          "soundKeywords": ["Sound1"]
        },
        "confidenceScore": 85
      }
    `;
        const brandData = await (0, gemini_js_1.generateJSON)(prompt);
        const brand = {
            id: (0, uuid_1.v4)(),
            url,
            extractedAt: new Date().toISOString(),
            name: brandData.name || scrapedData.title || 'Unknown Brand',
            tagline: brandData.tagline || scrapedData.metaDescription || '',
            mission: brandData.mission || '',
            elevatorPitch: brandData.elevatorPitch || '',
            coreValues: brandData.coreValues || [],
            keyMessaging: brandData.keyMessaging || [],
            targetAudience: brandData.targetAudience || [],
            personas: brandData.personas || [],
            swot: brandData.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] },
            competitors: brandData.competitors || [],
            tone: {
                adjectives: brandData.tone?.adjectives || [],
                description: brandData.tone?.description || '',
                personality: brandData.tone?.personality || 'Neutral'
            },
            visualIdentity: {
                primaryColor: brandData.visualIdentity?.primaryColor || '#000000',
                secondaryColor: brandData.visualIdentity?.secondaryColor || '#FFFFFF',
                fontPairing: brandData.visualIdentity?.fontPairing || 'Sans',
                styleKeywords: brandData.visualIdentity?.styleKeywords || [],
                designSystem: brandData.visualIdentity?.designSystem || ''
            },
            sonicIdentity: {
                voiceType: brandData.sonicIdentity?.voiceType || 'Neutral',
                musicGenre: brandData.sonicIdentity?.musicGenre || 'Ambient',
                soundKeywords: brandData.sonicIdentity?.soundKeywords || []
            },
            confidenceScore: scrapedData.bodyText ? 90 : 60
        };
        console.log('[Extract] ✓ Brand extraction complete');
        res.json(brand);
    }
    catch (error) {
        console.error('[Extract] Error:', error);
        res.status(500).json({
            error: error.message || 'Extraction failed',
            details: error.toString()
        });
    }
});
exports.default = router;
//# sourceMappingURL=extract.js.map