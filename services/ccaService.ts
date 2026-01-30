
import { executeRLMAnalysis } from "./rlmService";
import { BrandDNA } from "../types";

/**
 * Confucius Code Agent (CCA)
 * A specialized RLM implementation that focuses on "Structural Wisdom" and "Architectural Harmony".
 */

export interface WisdomPacket {
  aphorism: string;
  architecturalAdvice: string;
  technicalDirectives: string[];
  harmonyScore: number;
}

export const consultConfucius = async (
  query: string,
  context?: BrandDNA | any
): Promise<WisdomPacket> => {
  
  const contextStr = context 
    ? `Context: ${context.name || 'Unknown Project'} - ${context.mission || ''}`
    : 'Context: General Inquiry';

  const prompt = `
    Act as "Confucius Code Agent" (CCA).
    You are an ancient digital philosopher and senior systems architect.
    
    User Query: "${query}"
    ${contextStr}

    Phase 1: Deep Contemplation (Root Analysis)
    Analyze the request not just for what is asked, but for the underlying "Tao" (Way) of the system.
    
    Phase 2: Architectural Critique
    Identify where the user's intent might lead to "Technical Debt" (Disharmony) or "Scalability Issues" (Chaos).
    
    Phase 3: The Master's Synthesis
    Output a JSON object with:
    - "aphorism": A wise, slightly cryptic proverb about code/system design related to the query.
    - "architecturalAdvice": High-level strategic guidance.
    - "technicalDirectives": Specific, actionable steps (e.g., "Implement Factory Pattern", "Use Edge Caching").
    - "harmonyScore": 0-100 score of how aligned this idea is with best practices.
  `;

  try {
    // We leverage the RLM engine to think recursively about the wisdom
    const rawWisdom = await executeRLMAnalysis(prompt);
    const data = JSON.parse(rawWisdom);

    return {
      aphorism: data.aphorism || "The code that is not written has no bugs.",
      architecturalAdvice: data.architecturalAdvice || "Seek simplicity in structure.",
      technicalDirectives: data.technicalDirectives || ["Refactor", "Simplify"],
      harmonyScore: data.harmonyScore || 50
    };
  } catch (e) {
    console.error("Confucius is meditating (Error):", e);
    return {
      aphorism: "Silence is the true response to complexity.",
      architecturalAdvice: "The system is currently unreachable.",
      technicalDirectives: ["Check Logs", "Retry Later"],
      harmonyScore: 0
    };
  }
};
