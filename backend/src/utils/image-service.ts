/**
 * Real Image Generation Service
 * Supports: Stability AI, Fal.ai, Leonardo.ai
 */

interface ImageGenerationParams {
  prompt: string;
  style?: string;
  size?: string;
  apiKey?: string;
  provider?: 'stability' | 'fal' | 'leonardo';
}

/**
 * Generate image via Stability AI
 */
export async function generateWithStabilityAI(
  prompt: string,
  apiKey: string,
  size: string = '1024x1024'
): Promise<string> {
  const [width, height] = size.split('x').map(Number);

  const response = await fetch(
    'https://api.stability.ai/v1/generate',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        output_format: 'png',
        aspect_ratio: `${width}:${height}`
      })
    }
  );

  if (!response.ok) {
    const error: any = await response.json();
    throw new Error(`Stability AI error: ${error.message || response.statusText}`);
  }

  const data: any = await response.json();
  const imageData = data.image || data.artifacts?.[0]?.base64;

  if (!imageData) {
    throw new Error('No image data in response');
  }

  // Return base64 data URL
  return `data:image/png;base64,${imageData}`;
}

/**
 * Generate image via Fal.ai (faster, cheaper)
 */
export async function generateWithFalAI(
  prompt: string,
  apiKey: string,
  size: string = '1024x1024'
): Promise<string> {
  const response = await fetch(
    'https://api.falai.com/v1/image/generation/sd15',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        image_size: size,
        num_inference_steps: 25
      })
    }
  );

  if (!response.ok) {
    const error: any = await response.json();
    throw new Error(`Fal.ai error: ${error.message || response.statusText}`);
  }

  const data: any = await response.json();
  const imageUrl = data.image?.url || data.output?.image?.url;

  if (!imageUrl) {
    throw new Error('No image URL in response');
  }

  return imageUrl;
}

/**
 * Generate image via Leonardo.ai
 */
export async function generateWithLeonardo(
  prompt: string,
  apiKey: string,
  size: string = '1024x1024'
): Promise<string> {
  // First, create a generation request
  const createResponse = await fetch(
    'https://api.leonardo.ai/v1/generations',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        model: 'sdxl',
        width: parseInt(size.split('x')[0]),
        height: parseInt(size.split('x')[1]),
        negative_prompt: 'blurry, low quality',
        num_images: 1
      })
    }
  );

  if (!createResponse.ok) {
    const error: any = await createResponse.json();
    throw new Error(`Leonardo.ai error: ${error.message || createResponse.statusText}`);
  }

  const createData: any = await createResponse.json();
  const generationId = createData.generationId;

  if (!generationId) {
    throw new Error('No generation ID returned');
  }

  // Poll for completion
  for (let i = 0; i < 30; i++) {
    const statusResponse = await fetch(
      `https://api.leonardo.ai/v1/generations/${generationId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    if (!statusResponse.ok) continue;

    const statusData: any = await statusResponse.json();

    if (statusData.generated_images && statusData.generated_images.length > 0) {
      return statusData.generated_images[0].url;
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error('Image generation timed out');
}

/**
 * Main function: Generate image with any provider
 */
export async function generateImage(params: ImageGenerationParams): Promise<{
  imageUrl: string;
  provider: string;
  size: string;
}> {
  const {
    prompt,
    apiKey,
    provider = 'stability',
    size = '1024x1024'
  } = params;

  if (!apiKey) {
    throw new Error(`No API key provided for ${provider}`);
  }

  if (!prompt) {
    throw new Error('Prompt is required');
  }

  let imageUrl: string;

  switch (provider) {
    case 'fal':
      imageUrl = await generateWithFalAI(prompt, apiKey, size);
      break;
    case 'leonardo':
      imageUrl = await generateWithLeonardo(prompt, apiKey, size);
      break;
    case 'stability':
    default:
      imageUrl = await generateWithStabilityAI(prompt, apiKey, size);
  }

  return {
    imageUrl,
    provider,
    size
  };
}
