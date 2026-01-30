
import { Agent, AgentMessage } from "../types";
import { consultConfucius } from "./ccaService";
import { githubService } from "./githubService";
import { universalAiService } from "./universalAiService";

export const chatWithAgent = async (agent: Agent, history: AgentMessage[], userMessage: string): Promise<string> => {
  
  // Specialized Agent: Confucius Code Agent
  if (agent.id === 'cca-1') {
    const wisdom = await consultConfucius(userMessage);
    return `> *"${wisdom.aphorism}"*\n\n**🏛️ Architectural Advice:**\n${wisdom.architecturalAdvice}\n\n(Harmony: ${wisdom.harmonyScore}/100)`;
  }

  // Specialized Agent: Ralph
  if (agent.id === 'ralph-1') {
    const review = await githubService.reviewPullRequest(userMessage);
    return `**🔥 Snark Score: ${review.score}/10**\n\n${review.roast}`;
  }

  // Standard Agent Chat via Router
  const systemPrompt = `IDENTITY: ${agent.name}, Role: ${agent.role}, Personality: ${agent.personality}. Instruction: ${agent.systemInstruction}`;

  try {
    return await universalAiService.generateText({
      prompt: userMessage,
      systemInstruction: systemPrompt,
      featureId: 'agent-chat'
    });
  } catch (e) {
    console.error("Agent chat error", e);
    return "Neural link disrupted. Please verify provider status in Settings.";
  }
};
