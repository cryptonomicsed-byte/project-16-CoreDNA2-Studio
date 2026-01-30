import { GoogleGenAI } from "@google/genai";
import { useStore } from "../store";

export interface TextGenerationParams {
  systemInstruction?: string;
  prompt: string;
  responseMimeType?: string;
  responseSchema?: any;
  featureId?: string;
}

export class AiServiceError extends Error {
  constructor(public message: string, public code?: string | number, public status?: string) {
    super(message);
    this.name = 'AiServiceError';
  }
}

const cleanJsonResponse = (text: string): string => {
  if (!text) return '{}';
  const cleaned = text.replace(/```json\n?|```\n?/gi, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  let start = -1;
  if (firstBrace !== -1 && firstBracket !== -1) {
    start = Math.min(firstBrace, firstBracket);
  } else {
    start = firstBrace !== -1 ? firstBrace : firstBracket;
  }
  const lastBrace = cleaned.lastIndexOf('}');
  const lastBracket = cleaned.lastIndexOf(']');
  const end = Math.max(lastBrace, lastBracket);
  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.substring(start, end + 1);
  }
  return (cleaned.startsWith('{') || cleaned.startsWith('[')) ? cleaned : '{}';
};

export const universalAiService = {
  async generateText(params: TextGenerationParams): Promise<string> {
    const { providers } = useStore.getState();
    const { activeLLM, keys } = providers;
    const finalParams = { ...params };

    if (params.responseMimeType === 'application/json' && activeLLM !== 'gemini') {
      finalParams.prompt = `${params.prompt}\n\nCRITICAL: Return ONLY raw JSON. No text before or after.`;
    }

    try {
      let result = '';
      switch (activeLLM) {
        case 'openai': result = await this.generateOpenAI(finalParams, keys.openai); break;
        case 'anthropic': result = await this.generateAnthropic(finalParams, keys.anthropic); break;
        case 'deepseek': result = await this.generateDeepSeek(finalParams, keys.deepseek); break;
        case 'groq': result = await this.generateGroq(finalParams, keys.groq); break;
        case 'mistral': result = await this.generateMistral(finalParams, keys.mistral); break;
        case 'gemini':
        default: result = await this.generateGemini(finalParams, keys.gemini || process.env.API_KEY || ''); break;
      }

      if (params.responseMimeType === 'application/json') {
        const cleaned = cleanJsonResponse(result);
        try {
          JSON.parse(cleaned);
          return cleaned;
        } catch (e) {
          console.warn("[AI Router] Invalid JSON. Failover triggered.");
          return params.featureId ? "FALLBACK_TRIGGERED" : "{}";
        }
      }
      return result;
    } catch (error: any) {
      let msg = error.message || String(error);
      try {
        const parsed = JSON.parse(msg);
        if (parsed.error?.message) msg = parsed.error.message;
      } catch (e) { /* ignore */ }

      const isQuota = /429|quota|limit|balance|insufficient|RESOURCE_EXHAUSTED/i.test(msg);
      if (isQuota && params.featureId) return "FALLBACK_TRIGGERED";
      if (isQuota) throw new AiServiceError("Neural Quota Exhausted.", "QUOTA_EXCEEDED");
      throw new AiServiceError(msg);
    }
  },

  async generateImage(prompt: string): Promise<string> {
    const { providers } = useStore.getState();
    const { activeImage, keys } = providers;
    try {
      switch (activeImage) {
        case 'openai': return await this.generateDallE(prompt, keys.openai);
        case 'fal': return await this.generateFal(prompt, keys.fal);
        default: return await this.generateGeminiImage(prompt, keys.gemini || process.env.API_KEY || '');
      }
    } catch (e) {
      return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80";
    }
  },

  async generateGemini(params: TextGenerationParams, key: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: params.prompt,
      config: {
        systemInstruction: params.systemInstruction,
        responseMimeType: params.responseMimeType,
        temperature: 0.1
      }
    });
    return response.text || '';
  },

  async generateGeminiImage(prompt: string, key: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] }
    });
    const cand = response.candidates?.[0];
    const part = cand?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    throw new Error("No image data");
  },

  async generateOpenAI(params: TextGenerationParams, key?: string): Promise<string> {
    if (!key) throw new AiServiceError("OpenAI Key Missing", "AUTH_MISSING");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          ...(params.systemInstruction ? [{ role: 'system', content: params.systemInstruction }] : []),
          { role: 'user', content: params.prompt }
        ],
        response_format: params.responseMimeType === 'application/json' ? { type: 'json_object' } : undefined
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(JSON.stringify(data));
    return data.choices[0]?.message?.content || '';
  },

  async generateDallE(prompt: string, key?: string): Promise<string> {
    if (!key) throw new AiServiceError("OpenAI Key Missing", "AUTH_MISSING");
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({ model: 'dall-e-3', prompt, n: 1, response_format: 'b64_json' })
    });
    const data = await res.json();
    return `data:image/png;base64,${data.data[0].b64_json}`;
  },

  async generateAnthropic(params: TextGenerationParams, key?: string): Promise<string> {
    if (!key) throw new AiServiceError("Anthropic Key Missing", "AUTH_MISSING");
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'dangerously-allow-browser': 'true' },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 4096,
        system: params.systemInstruction,
        messages: [{ role: 'user', content: params.prompt }]
      })
    });
    const data = await res.json();
    return data.content[0]?.text || '';
  },

  async generateDeepSeek(params: TextGenerationParams, key?: string): Promise<string> {
    if (!key) throw new AiServiceError("DeepSeek Key Missing", "AUTH_MISSING");
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          ...(params.systemInstruction ? [{ role: 'system', content: params.systemInstruction }] : []),
          { role: 'user', content: params.prompt }
        ]
      })
    });
    const data = await res.json();
    return data.choices[0]?.message?.content || '';
  },

  async generateGroq(params: TextGenerationParams, key?: string): Promise<string> {
    if (!key) throw new AiServiceError("Groq Key Missing", "AUTH_MISSING");
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          ...(params.systemInstruction ? [{ role: 'system', content: params.systemInstruction }] : []),
          { role: 'user', content: params.prompt }
        ]
      })
    });
    const data = await res.json();
    return data.choices[0]?.message?.content || '';
  },

  async generateMistral(params: TextGenerationParams, key?: string): Promise<string> {
    if (!key) throw new AiServiceError("Mistral Key Missing", "AUTH_MISSING");
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          ...(params.systemInstruction ? [{ role: 'system', content: params.systemInstruction }] : []),
          { role: 'user', content: params.prompt }
        ]
      })
    });
    const data = await res.json();
    return data.choices[0]?.message?.content || '';
  },

  async generateFal(prompt: string, key?: string): Promise<string> {
    if (!key) throw new AiServiceError("Fal Key Missing", "AUTH_MISSING");
    const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Key ${key}` },
      body: JSON.stringify({ prompt, image_size: 'square_hd' })
    });
    const data = await res.json();
    return data.images[0].url;
  }
};