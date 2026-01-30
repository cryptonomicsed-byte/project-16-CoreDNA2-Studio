"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gemini_js_1 = require("../utils/gemini.js");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
/**
 * Fetch trending topics for a given industry
 * In production: integrate with Google Trends API, HN API, Twitter API, Reddit
 */
router.get('/:industry', async (req, res) => {
    try {
        const { industry } = req.params;
        console.log(`[Trends] Fetching trends for: ${industry}`);
        const prompt = `
      Generate 8 REAL, CURRENT trending topics in the ${industry} industry.
      Each should have:
      - Topic name
      - Category (Technology, Content, Market, Regulation, etc.)
      - Search volume (High/Medium/Low)
      - Relevance score (0-100)
      - Brief summary
      - 3 suggested content angles
      
      Return as JSON array of trend objects.
      Focus on trends that create content opportunities.
    `;
        const trendsData = await (0, gemini_js_1.generateJSON)(prompt);
        const trends = trendsData.map((trend) => ({
            id: (0, uuid_1.v4)(),
            topic: trend.topic || 'Unnamed Trend',
            category: trend.category || 'General',
            volume: trend.volume || 'Medium',
            relevanceScore: trend.relevanceScore || 75,
            summary: trend.summary || '',
            suggestedAngles: trend.suggestedAngles || []
        }));
        console.log(`[Trends] ✓ Generated ${trends.length} trends`);
        res.json(trends);
    }
    catch (error) {
        console.error('[Trends] Error:', error);
        res.status(500).json({
            error: error.message || 'Trend fetching failed'
        });
    }
});
exports.default = router;
//# sourceMappingURL=trends.js.map