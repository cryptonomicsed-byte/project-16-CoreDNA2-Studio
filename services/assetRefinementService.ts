
import { GoogleGenAI } from "@google/genai";
import { BrandDNA } from "../types";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

type PolishMode = 'shorten' | 'expand' | 'professional' | 'witty' | 'seo-optimize' | 'grammar-fix';

export const polishContent = async (
  content: string, 
  mode: PolishMode, 
  brand?: BrandDNA
): Promise<string> => {
  const ai = getAI();
  const brandContext = brand 
    ? `Ensure the output matches this Brand Voice: ${brand.tone.personality} (${brand.tone.adjectives.join(', ')}).`
    : '';

  let instruction = '';
  switch (mode) {
    case 'shorten': instruction = 'Make this text 30% shorter while keeping the core message.'; break;
    case 'expand': instruction = 'Expand this text with more detail and examples. Make it 25% longer.'; break;
    case 'professional': instruction = 'Rewrite this to sound ultra-professional, corporate, and trustworthy.'; break;
    case 'witty': instruction = 'Rewrite this to be witty, clever, and engaging. Use humor if appropriate.'; break;
    case 'seo-optimize': instruction = 'Optimize this text for SEO. Include relevant keywords naturally.'; break;
    case 'grammar-fix': instruction = 'Fix any grammar, spelling, or punctuation errors. Do not change the tone.'; break;
  }

  const prompt = `
    Task: ${instruction}
    ${brandContext}
    
    Input Text:
    "${content}"
    
    Output ONLY the rewritten text.
  `;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return result.text || content;
  } catch (e) {
    console.error("Refinement failed", e);
    return content;
  }
};
