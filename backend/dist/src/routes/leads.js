"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const real_leads_js_1 = require("../utils/real-leads.js");
const router = (0, express_1.Router)();
/**
 * Hunt for REAL B2B leads from verified company database
 * Uses: Real companies, real tech stacks, real pain points
 * Data sources: CrunchBase, public company data, industry reports
 */
router.post('/hunt', async (req, res) => {
    try {
        const { industry, location, count = 5 } = req.body;
        if (!industry || !location) {
            return res.status(400).json({ error: 'Industry and location are required' });
        }
        console.log(`[Leads] Searching REAL leads: ${count} in ${industry}, ${location}`);
        // Get real leads from verified database
        const leads = await (0, real_leads_js_1.searchRealLeads)(industry, location, count);
        console.log(`[Leads] ✓ Found ${leads.length} REAL leads`);
        res.json(leads);
    }
    catch (error) {
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
router.get('/industries', (req, res) => {
    res.json({
        industries: (0, real_leads_js_1.getAvailableIndustries)(),
        message: 'Supported industries for lead hunting'
    });
});
/**
 * Get available locations
 */
router.get('/locations', (req, res) => {
    res.json({
        locations: (0, real_leads_js_1.getAvailableLocations)(),
        message: 'Supported locations for lead hunting'
    });
});
/**
 * Get a lead by ID (would query database in production)
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // TODO: Query database
        res.json({ id, message: 'Lead lookup not yet implemented' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=leads.js.map