/**
 * Real Video Generation Service
 * Supports: Luma, LTX-2 (Fal.ai), Kling
 */

interface VideoGenerationParams {
  prompt: string;
  duration?: number;
  apiKey?: string;
  engine?: 'luma' | 'ltx-2' | 'kling' | 'veo-3' | 'sora-2-pro';
}

interface VideoJob {
  id: string;
  status: 'generating' | 'completed' | 'failed';
  videoUrl?: string;
  progress?: number;
}

/**
 * Generate video via Luma.ai (most stable, photorealistic)
 */
export async function generateWithLuma(
  prompt: string,
  apiKey: string,
  duration: number = 10
): Promise<VideoJob> {
  try {
    // Request generation
    const response = await fetch(
      'https://api.lumalabs.ai/dream-machine/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          prompt,
          duration: Math.min(duration, 120) // Luma max 120 seconds
        })
      }
    );

    if (!response.ok) {
      const error: any = await response.json();
      throw new Error(`Luma error: ${error.message || response.statusText}`);
    }

    const data: any = await response.json();
    const generationId = data.id || data.generation_id;

    if (!generationId) {
      throw new Error('No generation ID returned from Luma');
    }

    // Poll for completion
    return await pollLumaStatus(generationId, apiKey);
  } catch (error: any) {
    return {
      id: Date.now().toString(),
      status: 'failed',
      videoUrl: undefined
    };
  }
}

/**
 * Poll Luma video status
 */
async function pollLumaStatus(
  generationId: string,
  apiKey: string,
  maxAttempts: number = 60
): Promise<VideoJob> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(
        `https://api.lumalabs.ai/dream-machine/${generationId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      if (!response.ok) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      const data: any = await response.json();

      if (data.state === 'completed') {
        return {
          id: generationId,
          status: 'completed',
          videoUrl: data.download_url || data.video_url
        };
      }

      if (data.state === 'failed') {
        return {
          id: generationId,
          status: 'failed'
        };
      }

      // Still generating
      const progress = Math.round((i / maxAttempts) * 100);
      console.log(`[Video] Luma progress: ${progress}%`);

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`[Video] Poll error:`, error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return {
    id: generationId,
    status: 'failed',
    videoUrl: undefined
  };
}

/**
 * Generate video via LTX-2 (Fal.ai) - fastest
 */
export async function generateWithLTX2(
  prompt: string,
  apiKey: string,
  duration: number = 10
): Promise<VideoJob> {
  try {
    const response = await fetch(
      'https://api.fal.ai/v1/video/ltx-2',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          prompt,
          duration: Math.min(duration, 120)
        })
      }
    );

    if (!response.ok) {
      const error: any = await response.json();
      throw new Error(`LTX-2 error: ${error.message || response.statusText}`);
    }

    const data: any = await response.json();

    return {
      id: data.request_id,
      status: 'completed',
      videoUrl: data.video?.url || data.output?.video_url
    };
  } catch (error: any) {
    return {
      id: Date.now().toString(),
      status: 'failed'
    };
  }
}

/**
 * Generate video via Kling AI
 */
export async function generateWithKling(
  prompt: string,
  apiKey: string,
  duration: number = 10
): Promise<VideoJob> {
  try {
    const response = await fetch(
      'https://api.klingai.com/v1/video/generation',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          prompt,
          duration: Math.min(duration, 60) // Kling max 60 seconds
        })
      }
    );

    if (!response.ok) {
      const error: any = await response.json();
      throw new Error(`Kling error: ${error.message || response.statusText}`);
    }

    const data: any = await response.json();
    const taskId = data.task_id;

    if (!taskId) {
      throw new Error('No task ID from Kling');
    }

    // Poll Kling status
    return await pollKlingStatus(taskId, apiKey);
  } catch (error: any) {
    return {
      id: Date.now().toString(),
      status: 'failed'
    };
  }
}

/**
 * Poll Kling video status
 */
async function pollKlingStatus(
  taskId: string,
  apiKey: string,
  maxAttempts: number = 60
): Promise<VideoJob> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(
        `https://api.klingai.com/v1/video/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      if (!response.ok) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      const data: any = await response.json();

      if (data.status === 'success' || data.status === 'completed') {
        return {
          id: taskId,
          status: 'completed',
          videoUrl: data.video_url || data.output?.video_url
        };
      }

      if (data.status === 'failed') {
        return {
          id: taskId,
          status: 'failed'
        };
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`[Video] Kling poll error:`, error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return {
    id: taskId,
    status: 'failed'
  };
}

/**
 * Main function: Generate video with any engine
 */
export async function generateVideo(params: VideoGenerationParams): Promise<VideoJob> {
  const {
    prompt,
    apiKey,
    engine = 'luma',
    duration = 10
  } = params;

  if (!apiKey) {
    throw new Error(`No API key provided for ${engine}`);
  }

  if (!prompt) {
    throw new Error('Prompt is required');
  }

  console.log(`[Video] Generating with ${engine}: ${prompt.substring(0, 50)}...`);

  switch (engine) {
    case 'ltx-2':
      return await generateWithLTX2(prompt, apiKey, duration);
    case 'kling':
      return await generateWithKling(prompt, apiKey, duration);
    case 'luma':
    default:
      return await generateWithLuma(prompt, apiKey, duration);
  }
}
