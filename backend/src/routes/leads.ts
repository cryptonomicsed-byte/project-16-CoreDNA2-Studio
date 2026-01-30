import { Router, Request, Response } from 'express';
import { LeadProfile } from '../../types.js';
import { searchRealLeads, getAvailableIndustries, getAvailableLocations } from '../utils/real-leads.js';

const router = Router();

interface HuntRequest {
  industry: string;
  location: string;
  count?: number;
}

/**
 * Hunt for REAL B2B leads from verified company database
 * Uses: Real companies, real tech stacks, real pain points
 * Data sources: CrunchBase, public company data, industry reports
 */
router.post('/hunt', async (req: Request, res: Response) => {
  try {
    const { industry, location, count = 5 } = req.body as HuntRequest;

    if (!industry || !location) {
      return res.status(400).json({ error: 'Industry and location are required' });
    }

    console.log(`[Leads] Searching REAL leads: ${count} in ${industry}, ${location}`);

    // Get real leads from verified database
    const leads = await searchRealLeads(industry, location, count);

    console.log(`[Leads] ✓ Found ${leads.length} REAL leads`);
    res.json(leads);

  } catch (error: any) {
    console.error('[Leads] Error:', error);
    res.status(500).json({
      error: error.message || 'Lead hunting failed',
      details: error.toString()
    });
  }
});

/**
 * Get available industries
 */
router.get('/industries', (req: Request, res: Response) => {
  res.json({
    industries: getAvailableIndustries(),
    message: 'Supported industries for lead hunting'
  });
});

/**
 * Get available locations
 */
router.get('/locations', (req: Request, res: Response) => {
  res.json({
    locations: getAvailableLocations(),
    message: 'Supported locations for lead hunting'
  });
});

/**
 * Get a lead by ID (would query database in production)
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Query database
    res.json({ id, message: 'Lead lookup not yet implemented' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
