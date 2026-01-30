import { Router, Request, Response } from 'express';
import { generateJSON } from '../utils/gemini.js';
import { TrendItem } from '../../types.js';
import { v4 as uuid } from 'uuid';

const router = Router();

/**
 * Fetch trending topics for a given industry
 * In production: integrate with Google Trends API, HN API, Twitter API, Reddit
 */
router.get('/:industry', async (req: Request, res: Response) => {
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

    const trendsData = await generateJSON<any[]>(prompt);

    const trends: TrendItem[] = trendsData.map((trend: any) => ({
      id: uuid(),
      topic: trend.topic || 'Unnamed Trend',
      category: trend.category || 'General',
      volume: trend.volume || 'Medium',
      relevanceScore: trend.relevanceScore || 75,
      summary: trend.summary || '',
      suggestedAngles: trend.suggestedAngles || []
    }));

    console.log(`[Trends] ✓ Generated ${trends.length} trends`);
    res.json(trends);

  } catch (error: any) {
    console.error('[Trends] Error:', error);
    res.status(500).json({
      error: error.message || 'Trend fetching failed'
    });
  }
});

export default router;
