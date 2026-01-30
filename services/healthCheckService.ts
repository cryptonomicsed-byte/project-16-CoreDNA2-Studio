
export interface ProviderStatus {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'down' | 'unauthorized' | 'quota_exceeded';
  latency: number;
}

export const healthCheckService = {
  // Generic helper for OpenAI-compatible model listing endpoints
  async checkOAICompatible(id: string, name: string, baseUrl: string, key: string): Promise<ProviderStatus> {
    const start = Date.now();
    try {
      const res = await fetch(`${baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${key}` }
      });
      if (res.status === 401) return { id, name, status: 'unauthorized', latency: 0 };
      if (res.status === 429) return { id, name, status: 'quota_exceeded', latency: 0 };
      if (!res.ok) throw new Error();
      return { id, name, status: 'operational', latency: Date.now() - start };
    } catch {
      return { id, name, status: 'down', latency: 0 };
    }
  },

  async checkGemini(key: string): Promise<ProviderStatus> {
    const start = Date.now();
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      if (res.status === 400 || res.status === 403) return { id: 'gemini', name: 'Google Gemini', status: 'unauthorized', latency: 0 };
      if (res.status === 429) return { id: 'gemini', name: 'Google Gemini', status: 'quota_exceeded', latency: 0 };
      if (!res.ok) throw new Error();
      return { id: 'gemini', name: 'Google Gemini', status: 'operational', latency: Date.now() - start };
    } catch {
      return { id: 'gemini', name: 'Google Gemini', status: 'down', latency: 0 };
    }
  },

  async checkOpenAI(key: string): Promise<ProviderStatus> {
    return this.checkOAICompatible('openai', 'OpenAI', 'https://api.openai.com/v1', key);
  },

  async checkAnthropic(key: string): Promise<ProviderStatus> {
    const start = Date.now();
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-3-haiku-20240307', max_tokens: 1, messages: [{ role: 'user', content: 'ping' }] })
      });
      if (res.status === 401) return { id: 'anthropic', name: 'Anthropic', status: 'unauthorized', latency: 0 };
      if (res.status === 429) return { id: 'anthropic', name: 'Anthropic', status: 'quota_exceeded', latency: 0 };
      return { id: 'anthropic', name: 'Anthropic', status: 'operational', latency: Date.now() - start };
    } catch {
      return { id: 'anthropic', name: 'Anthropic', status: 'down', latency: 0 };
    }
  },

  async checkDeepSeek(key: string): Promise<ProviderStatus> {
    return this.checkOAICompatible('deepseek', 'DeepSeek', 'https://api.deepseek.com', key);
  },

  async checkGroq(key: string): Promise<ProviderStatus> {
    return this.checkOAICompatible('groq', 'Groq', 'https://api.groq.com/openai/v1', key);
  },

  async checkMistral(key: string): Promise<ProviderStatus> {
    return this.checkOAICompatible('mistral', 'Mistral', 'https://api.mistral.ai/v1', key);
  },

  async checkStability(key: string): Promise<ProviderStatus> {
    const start = Date.now();
    try {
      const res = await fetch('https://api.stability.ai/v1/user/account', {
        headers: { 'Authorization': `Bearer ${key}` }
      });
      if (res.status === 401) return { id: 'stability', name: 'Stability AI', status: 'unauthorized', latency: 0 };
      if (res.status === 429) return { id: 'stability', name: 'Stability AI', status: 'quota_exceeded', latency: 0 };
      return { id: 'stability', name: 'Stability AI', status: 'operational', latency: Date.now() - start };
    } catch {
      return { id: 'stability', name: 'Stability AI', status: 'down', latency: 0 };
    }
  },

  async checkFal(key: string): Promise<ProviderStatus> {
    const start = Date.now();
    try {
      const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
        method: 'POST',
        headers: { 'Authorization': `Key ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'ping' })
      });
      if (res.status === 401) return { id: 'fal', name: 'Fal.ai', status: 'unauthorized', latency: 0 };
      if (res.status === 429) return { id: 'fal', name: 'Fal.ai', status: 'quota_exceeded', latency: 0 };
      return { id: 'fal', name: 'Fal.ai', status: 'operational', latency: Date.now() - start };
    } catch {
      return { id: 'fal', name: 'Fal.ai', status: 'down', latency: 0 };
    }
  }
};
