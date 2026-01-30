import { Router, Request, Response } from 'express';
import { VideoJob } from '../../types.js';
import { v4 as uuid } from 'uuid';
import { generateVideo } from '../utils/video-service.js';

const router = Router();

interface GenerateVideoRequest {
  prompt: string;
  engine: 'ltx-2' | 'luma' | 'kling' | 'veo-3' | 'sora-2-pro';
  duration?: number;
  apiKey?: string;
}

// In-memory job storage
// In production: Use database + message queue (Bull, Redis, etc)
const jobs = new Map<string, VideoJob>();

/**
 * Generate REAL videos using Luma, LTX-2, or Kling
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, engine, duration = 10, apiKey } = req.body as GenerateVideoRequest;

    if (!prompt || !engine) {
      return res.status(400).json({ error: 'Prompt and engine are required' });
    }

    console.log(`[Videos] Starting generation: ${engine} (${duration}s)`);

    const jobId = uuid();
    const cost = calculateVideoCost(engine, duration);

    // Create job record
    const job: VideoJob = {
      id: jobId,
      prompt,
      engine: engine as any,
      status: 'generating',
      createdAt: new Date().toISOString(),
      cost
    };

    jobs.set(jobId, job);

    // Get API key
    const key = apiKey || process.env[`${engine.toUpperCase()}_API_KEY`];

    if (!key) {
      console.warn(`[Videos] No API key for ${engine}, returning mock job`);
      // Still return a job, but mark as needing API key
      return res.json({
        ...job,
        status: 'pending',
        message: `No ${engine} API key configured. Add in settings.`,
        warning: true
      });
    }

    // Start generation asynchronously
    generateVideo({
      prompt,
      apiKey: key,
      engine: engine as any,
      duration
    })
      .then((result) => {
        const stored = jobs.get(jobId);
        if (stored) {
          stored.status = result.status;
          stored.videoUrl = result.videoUrl;
        }
        console.log(`[Videos] ✓ Generation complete: ${jobId}`);
      })
      .catch((error) => {
        console.error(`[Videos] Generation failed: ${jobId}`, error);
        const stored = jobs.get(jobId);
        if (stored) {
          stored.status = 'failed';
        }
      });

    console.log(`[Videos] ✓ Job queued: ${jobId}`);

    res.json({
      ...job,
      message: 'Video generation started. Poll /status/:jobId to check progress.',
      checkStatusUrl: `/api/videos/status/${jobId}`
    });

  } catch (error: any) {
    console.error('[Videos] Error:', error);
    res.status(500).json({
      error: error.message || 'Video generation failed'
    });
  }
});

/**
 * Get video generation job status
 */
router.get('/status/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const job = jobs.get(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    console.log(`[Videos] Job ${jobId} status: ${job.status}`);
    res.json(job);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get available video engines
 */
router.get('/engines', (req: Request, res: Response) => {
  res.json({
    engines: [
      {
        name: 'ltx-2',
        provider: 'Fal.ai',
        maxDuration: 120,
        costPerMinute: 0.50,
        quality: 'High',
        description: 'Fastest video generation'
      },
      {
        name: 'luma',
        provider: 'Luma.ai',
        maxDuration: 120,
        costPerMinute: 1.00,
        quality: 'Ultra',
        description: 'Photorealistic video generation'
      },
      {
        name: 'kling',
        provider: 'Kling AI',
        maxDuration: 60,
        costPerMinute: 0.80,
        quality: 'High',
        description: 'Fast cinematic generation'
      },
      {
        name: 'veo-3',
        provider: 'Google Veo',
        maxDuration: 60,
        costPerMinute: 1.50,
        quality: 'Ultra',
        description: 'Advanced visual generation'
      },
      {
        name: 'sora-2-pro',
        provider: 'OpenAI Sora',
        maxDuration: 120,
        costPerMinute: 2.00,
        quality: 'Ultra',
        description: 'Premium cinematic video'
      }
    ]
  });
});

/**
 * Calculate cost based on engine and duration
 */
function calculateVideoCost(engine: string, duration: number): number {
  const costs: { [key: string]: number } = {
    'ltx-2': 0.50,
    'luma': 1.00,
    'kling': 0.80,
    'veo-3': 1.50,
    'sora-2-pro': 2.00
  };
  
  const costPerMinute = costs[engine] || 1.00;
  return Math.ceil((duration / 60) * costPerMinute * 100) / 100;
}

export default router;
