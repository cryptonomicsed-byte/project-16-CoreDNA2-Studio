/**
 * API Client for CoreDNA Backend
 * All calls go to real backend, no mocks
 */

const API_BASE = process.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiError {
  error: string;
  details?: string;
  status?: number;
}

async function apiCall<T>(
  method: string,
  endpoint: string,
  body?: any
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error [${response.status}]:`, data);
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data as T;
  } catch (error: any) {
    console.error(`API Call Failed: ${method} ${endpoint}`, error);
    throw error;
  }
}

// Brand Extraction
export async function extractBrand(
  url: string,
  description?: string
): Promise<any> {
  return apiCall('POST', '/extract', { url, description });
}

// Lead Hunting
export async function huntLeads(
  industry: string,
  location: string,
  count: number = 5
): Promise<any[]> {
  return apiCall('POST', '/leads/hunt', { industry, location, count });
}

// Campaign Management
export async function createCampaign(
  name: string,
  goal: string,
  audienceSegment: string,
  timeline: string
): Promise<any> {
  return apiCall('POST', '/campaigns', {
    name,
    goal,
    audienceSegment,
    timeline,
  });
}

export async function getCampaign(id: string): Promise<any> {
  return apiCall('GET', `/campaigns/${id}`);
}

// Video Generation
export async function generateVideo(
  prompt: string,
  engine: string
): Promise<any> {
  return apiCall('POST', '/videos/generate', { prompt, engine });
}

export async function checkVideoStatus(jobId: string): Promise<any> {
  return apiCall('GET', `/videos/status/${jobId}`);
}

// Trends
export async function getTrends(industry: string): Promise<any[]> {
  return apiCall('GET', `/trends/${industry}`);
}

// Images
export async function generateImage(
  prompt: string,
  style?: string,
  size?: string
): Promise<any> {
  return apiCall('POST', '/images/generate', { prompt, style, size });
}

export async function generateImageBatch(prompts: string[]): Promise<any> {
  return apiCall('POST', '/images/batch', { prompts });
}

// Lead discovery
export async function getAvailableIndustries(): Promise<{ industries: string[] }> {
  return apiCall('GET', '/leads/industries');
}

export async function getAvailableLocations(): Promise<{ locations: string[] }> {
  return apiCall('GET', '/leads/locations');
}

// Health check
export async function healthCheck(): Promise<{ status: string }> {
  return apiCall('GET', '/health');
}
