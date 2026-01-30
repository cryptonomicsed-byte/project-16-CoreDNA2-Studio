
import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

interface GenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Inference Engine Router
 * Routes prompts to the appropriate decoding strategy based on the desired outcome.
 */
export const inferenceRouter = {
  
  /**
   * Standard fast generation (Direct Shot)
   */
  generateFast: async (prompt: string, options?: GenerationOptions) => {
    const ai = getAI();
    const result = await ai.models.generateContent({
      model: options?.model || 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens
      }
    });
    return result.text || '';
  },

  /**
   * Chain of Thought (CoT) - Forces the model to think step-by-step
   */
  generateWithReasoning: async (prompt: string) => {
    const ai = getAI();
    const reasoningPrompt = `
      Question: ${prompt}
      
      Let's think step by step.
      1. Analyze the user's intent.
      2. Break down the constraints.
      3. Formulate a solution.
      4. Review the solution for errors.
      
      Answer:
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: reasoningPrompt,
      config: { temperature: 0.2 } // Lower temp for logic
    });
    return result.text || '';
  },

  /**
   * Chain of Verification (CoVe) - Generates, then questions, then revises.
   */
  generateWithVerification: async (prompt: string) => {
    const ai = getAI();
    // 1. Baseline Generation
    const baseline = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    const baselineText = baseline.text || '';

    // 2. Verification Questions
    const verification = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Fact check this text: "${baselineText}"
        Identify potential hallucinations, logical errors, or brand inconsistencies.
        Output ONLY a list of specific errors or "No errors found".
      `
    });
    const verificationText = verification.text || '';

    if (verificationText.toLowerCase().includes("no errors found")) {
      return baselineText;
    }

    // 3. Final Revision
    const revision = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Original Prompt: ${prompt}
        Draft: "${baselineText}"
        Critique: "${verificationText}"
        
        Rewrite the draft to address the critique perfectly.
      `
    });
    return revision.text || baselineText;
  },

  /**
   * Self-Consistency - Generates multiple paths and selects the most common/best consensus.
   * (Simplified for client-side usage to avoid excessive tokens)
   */
  generateSelfConsistency: async (prompt: string, samples = 3) => {
    const ai = getAI();
    const promises = Array(samples).fill(null).map(() => 
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { temperature: 0.9 } // High temp for variety
      })
    );

    const results = await Promise.all(promises);
    const texts = results.map(r => r.text || '');

    // In a full implementation, we would cluster these. 
    // Here we ask the model to pick the best one.
    const selectorPrompt = `
      I have generated 3 variations for this prompt: "${prompt}"
      
      Option 1: ${texts[0]}
      Option 2: ${texts[1]}
      Option 3: ${texts[2]}
      
      Select the best, most accurate option. Return ONLY the text of the best option.
    `;

    const selection = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: selectorPrompt
    });

    return selection.text || texts[0];
  }
};
