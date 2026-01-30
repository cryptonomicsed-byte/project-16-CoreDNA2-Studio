
import { GoogleGenAI } from "@google/genai";

// Mock GitHub API interactions for the demo environment
// In production, this would use Octokit

export interface RepoConfig {
  name: string;
  description: string;
  isPrivate: boolean;
}

export interface CommitData {
  message: string;
  files: { path: string; content: string }[];
}

export const githubService = {
  
  /**
   * Ralph's "Snark Review" - Generates a commit message with attitude
   */
  generateSnarkyCommitMessage: async (changes: string[]): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
          Act as "Ralph", a cynical senior developer from Snark Tank.
          Generate a git commit message for these changes: ${changes.join(', ')}.
          
          Style: Snarky, brief, lowercase, brutally honest.
          Example: "fix the garbage code dave wrote last week"
        `
      });
      return result.text?.trim() || "stuff works now i guess";
    } catch {
      return "wip: fixing things";
    }
  },

  createRepository: async (config: RepoConfig): Promise<string> => {
    console.log(`[Ralph] Initializing repo: ${config.name}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (Math.random() > 0.9) {
      throw new Error("GitHub API rate limit... or maybe I just didn't feel like it.");
    }
    
    return `https://github.com/coredna-generated/${config.name}`;
  },

  pushCode: async (repoUrl: string, commit: CommitData): Promise<boolean> => {
    console.log(`[Ralph] Pushing to ${repoUrl}`);
    console.log(`[Ralph] Commit: ${commit.message}`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
  },

  /**
   * "Snark Tank" Code Review
   */
  reviewPullRequest: async (codeSnippet: string): Promise<{ score: number, roast: string }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
          Act as "Ralph" from Snark Tank. Review this code snippet.
          Be ruthless. Roast the logic.
          
          Code:
          "${codeSnippet.slice(0, 1000)}"
          
          Return JSON: { "score": number (0-10), "roast": "string" }
        `,
        config: { responseMimeType: 'application/json' }
      });
      
      return JSON.parse(result.text || '{"score": 5, "roast": "It compiles. That is the only nice thing I can say."}');
    } catch {
      return { score: 0, roast: "I refuse to look at this." };
    }
  }
};
