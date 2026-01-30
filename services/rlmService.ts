
import { universalAiService } from "./universalAiService";

export interface RLMStep {
  step: 'root' | 'critique' | 'refinement' | 'synthesis';
  content: string;
}

/**
 * Recursive Language Model (RLM) Executor
 * Performs a Chain-of-Thought style recursive analysis to improve quality.
 * Now routed through universalAiService for failover and provider support.
 */
export const executeRLMAnalysis = async (
  prompt: string, 
  onStep?: (step: string) => void
): Promise<string> => {
  
  // Step 1: Root Analysis
  if (onStep) onStep("Initializing Neural Core (Root Analysis)...");
  
  const rootText = await universalAiService.generateText({
    prompt: `Phase 1: Root Analysis. Task: ${prompt}. Provide a comprehensive initial analysis.`,
    featureId: 'rlm-root'
  });

  if (rootText === "FALLBACK_TRIGGERED") return "FALLBACK_TRIGGERED";

  // Step 2: Strategic Critique
  if (onStep) onStep("Running Adversarial Critique...");
  
  const critiqueText = await universalAiService.generateText({
    prompt: `Phase 2: Adversarial Critique. Review the following analysis and identify weaknesses: "${rootText}". Output strictly the critique points.`,
    featureId: 'rlm-critique'
  });

  // Step 3: Synthesis & Refinement
  if (onStep) onStep("Synthesizing Final DNA Sequence...");

  return await universalAiService.generateText({
    prompt: `Phase 3: Synthesis. Original Task: ${prompt}. Initial Analysis: "${rootText}". Critique: "${critiqueText}". Generate the FINAL high-fidelity JSON output.`,
    responseMimeType: 'application/json',
    featureId: 'rlm-synthesis'
  });
};
