
import { GoogleGenAI } from "@google/genai";
import { BrandDNA } from "../types";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  critique: string;
  violations: string[];
}

export const validateBrandAlignment = async (
  content: string, 
  brand: BrandDNA
): Promise<ValidationResult> => {
  const ai = getAI();
  const prompt = `
    Act as the Chief Brand Officer for "${brand.name}".
    
    Evaluate the following content against our Brand DNA.
    
    Brand Guidelines:
    - Tone: ${brand.tone.personality} (${brand.tone.adjectives.join(', ')})
    - Values: ${brand.coreValues.join(', ')}
    - Mission: ${brand.mission}
    
    Content to Review:
    "${content}"
    
    Return a JSON object:
    {
      "score": number (0-100),
      "critique": "Short summary of why",
      "violations": ["List specific misalignments or 'None'"]
    }
  `;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const data = JSON.parse(result.text || '{}');
    
    return {
      isValid: data.score >= 80,
      score: data.score || 0,
      critique: data.critique || 'Validation failed',
      violations: data.violations || []
    };
  } catch (e) {
    console.error("Brand validation failed", e);
    return {
      isValid: false,
      score: 0,
      critique: "System error during validation",
      violations: ["System offline"]
    };
  }
};
