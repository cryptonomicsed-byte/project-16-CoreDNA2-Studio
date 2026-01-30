import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { generateImage } from '../utils/image-service.js';

const router = Router();

interface GenerateImageRequest {
  prompt: string;
  style?: string;
  size?: string;
  provider?: 'stability' | 'fal' | 'leonardo';
  apiKey?: string;
}

/**
 * Generate REAL images using Stability AI, Fal.ai, or Leonardo.ai
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, style = 'realistic', size = '1024x1024', provider = 'stability', apiKey } = req.body as GenerateImageRequest;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`[Images] Generating with ${provider}: ${prompt.substring(0, 50)}...`);

    // Get API key from request or environment
    const key = apiKey || process.env[`${provider.toUpperCase()}_API_KEY`];

    if (!key) {
      console.warn(`[Images] No API key for ${provider}, using placeholder`);
      // Fallback to placeholder
      const placeholderUrl = `https://picsum.photos/${size.split('x')[0]}/${size.split('x')[1]}?random=${uuid()}`;
      return res.json({
        id: uuid(),
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
    const result = await generateImage({
      prompt,
      apiKey: key,
      provider: provider as any,
      style
    });

    console.log(`[Images] ✓ Image generated with ${provider}`);
    res.json({
      id: uuid(),
      prompt,
      style,
      size,
      imageUrl: result.imageUrl,
      status: 'completed',
      provider: result.provider,
      createdAt: new Date().toISOString()
    });

  } catch (error: any) {
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
router.post('/batch', async (req: Request, res: Response) => {
  try {
    const { prompts } = req.body as { prompts: string[] };

    if (!prompts || !Array.isArray(prompts)) {
      return res.status(400).json({ error: 'Prompts array is required' });
    }

    console.log(`[Images] Batch generating ${prompts.length} images`);

    const images = prompts.map(prompt => ({
      id: uuid(),
      prompt,
      imageUrl: `https://picsum.photos/1024/1024?random=${uuid()}`,
      status: 'completed',
      createdAt: new Date().toISOString()
    }));

    res.json({
      count: images.length,
      images,
      note: 'Placeholder images. Ready for batch API integration'
    });

  } catch (error: any) {
    console.error('[Images] Error:', error);
    res.status(500).json({
      error: error.message || 'Batch generation failed'
    });
  }
});

export default router;
