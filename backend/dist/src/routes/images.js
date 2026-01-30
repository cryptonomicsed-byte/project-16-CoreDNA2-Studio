"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const image_service_js_1 = require("../utils/image-service.js");
const router = (0, express_1.Router)();
/**
 * Generate REAL images using Stability AI, Fal.ai, or Leonardo.ai
 */
router.post('/generate', async (req, res) => {
    try {
        const { prompt, style = 'realistic', size = '1024x1024', provider = 'stability', apiKey } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        console.log(`[Images] Generating with ${provider}: ${prompt.substring(0, 50)}...`);
        // Get API key from request or environment
        const key = apiKey || process.env[`${provider.toUpperCase()}_API_KEY`];
        if (!key) {
            console.warn(`[Images] No API key for ${provider}, using placeholder`);
            // Fallback to placeholder
            const placeholderUrl = `https://picsum.photos/${size.split('x')[0]}/${size.split('x')[1]}?random=${(0, uuid_1.v4)()}`;
            return res.json({
                id: (0, uuid_1.v4)(),
                prompt,
                style,
                size,
                imageUrl: placeholderUrl,
                status: 'completed',
                provider,
                createdAt: new Date().toISOString(),
                note: `No ${provider} API key. Using placeholder. Configure in settings.`
            });
        }
        // Call real API
        const result = await (0, image_service_js_1.generateImage)({
            prompt,
            apiKey: key,
            provider: provider,
            style
        });
        console.log(`[Images] ✓ Image generated with ${provider}`);
        res.json({
            id: (0, uuid_1.v4)(),
            prompt,
            style,
            size,
            imageUrl: result.imageUrl,
            status: 'completed',
            provider: result.provider,
            createdAt: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('[Images] Error:', error);
        res.status(500).json({
            error: error.message || 'Image generation failed',
            provider: 'stability'
        });
    }
});
/**
 * Placeholder endpoint for batch image generation
 */
router.post('/batch', async (req, res) => {
    try {
        const { prompts } = req.body;
        if (!prompts || !Array.isArray(prompts)) {
            return res.status(400).json({ error: 'Prompts array is required' });
        }
        console.log(`[Images] Batch generating ${prompts.length} images`);
        const images = prompts.map(prompt => ({
            id: (0, uuid_1.v4)(),
            prompt,
            imageUrl: `https://picsum.photos/1024/1024?random=${(0, uuid_1.v4)()}`,
            status: 'completed',
            createdAt: new Date().toISOString()
        }));
        res.json({
            count: images.length,
            images,
            note: 'Placeholder images. Ready for batch API integration'
        });
    }
    catch (error) {
        console.error('[Images] Error:', error);
        res.status(500).json({
            error: error.message || 'Batch generation failed'
        });
    }
});
exports.default = router;
//# sourceMappingURL=images.js.map