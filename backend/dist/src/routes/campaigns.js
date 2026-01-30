"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gemini_js_1 = require("../utils/gemini.js");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
/**
 * Create a new campaign with AI-generated PRD and user stories
 */
router.post('/', async (req, res) => {
    try {
        const { brandId, name, goal, audienceSegment, timeline } = req.body;
        if (!name || !goal) {
            return res.status(400).json({ error: 'Name and goal are required' });
        }
        console.log(`[Campaigns] Creating campaign: ${name}`);
        // Generate PRD
        const prdPrompt = `
      Create a detailed Campaign PRD (Product Requirements Document) for:
      Campaign Name: ${name}
      Goal: ${goal}
      Target Audience: ${audienceSegment}
      Timeline: ${timeline}
      
      Return JSON with:
      {
        "overview": {
          "name": "${name}",
          "goal": "${goal}",
          "audienceSegment": "${audienceSegment}",
          "timeline": "${timeline}",
          "constraints": ["Constraint1", "Constraint2"]
        },
        "channelStrategies": [
          {
            "channel": "Channel Name",
            "postFrequency": "e.g. 3x per week",
            "recommendedFormat": "Format description",
            "contentLength": "Length",
            "bestTimes": ["Monday 9am", "Wednesday 2pm"]
          }
        ],
        "userStories": [
          {
            "id": "story-1",
            "description": "As a [user], I want [action] so that [benefit]",
            "channel": "social|email|blog|ad",
            "assetTypes": ["social_post", "image"],
            "acceptanceCriteria": ["Criteria1"],
            "dependencies": [],
            "priority": "high|medium|low",
            "dayOffset": 0
          }
        ],
        "totalAssetsTarget": 20,
        "sequencingPlan": "Description of how assets sequence"
      }
    `;
        const prdData = await (0, gemini_js_1.generateJSON)(prdPrompt);
        const prd = {
            overview: prdData.overview,
            channelStrategies: prdData.channelStrategies || [],
            userStories: (prdData.userStories || []).map((story, idx) => ({
                id: `${(0, uuid_1.v4)()}-${idx}`,
                description: story.description || '',
                channel: story.channel || 'social',
                assetTypes: story.assetTypes || [],
                acceptanceCriteria: story.acceptanceCriteria || [],
                dependencies: story.dependencies || [],
                priority: story.priority || 'medium',
                dayOffset: story.dayOffset || idx,
                status: 'pending'
            })),
            totalAssetsTarget: prdData.totalAssetsTarget || 20,
            sequencingPlan: prdData.sequencingPlan || ''
        };
        const campaign = {
            id: (0, uuid_1.v4)(),
            name,
            goal,
            status: 'planning',
            prd,
            assets: [],
            createdAt: new Date().toISOString()
        };
        console.log(`[Campaigns] ✓ Campaign created with ${prd.userStories.length} user stories`);
        res.json(campaign);
    }
    catch (error) {
        console.error('[Campaigns] Error:', error);
        res.status(500).json({
            error: error.message || 'Campaign creation failed',
            details: error.toString()
        });
    }
});
/**
 * Get campaign details
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // TODO: Query database
        res.json({ id, message: 'Campaign lookup not yet implemented' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=campaigns.js.map