
import { BrandDNA, CampaignAsset, UserStory, HealingReport } from "../types";
import { validateAssetStrict, regenerateAsset } from "./geminiService";

/**
 * Strict Self-Healing Loop
 * Attempts to fix an asset based on user-defined maxRetries.
 */
export const healAsset = async (
  brand: BrandDNA,
  asset: Partial<CampaignAsset>,
  story: UserStory,
  maxRetries = 3,
  onLog?: (msg: string) => void
): Promise<{ asset: Partial<CampaignAsset>, report: HealingReport }> => {
  
  let currentAsset = { ...asset };
  let attempts = 0;
  
  // Initial Validation
  if (onLog) onLog("Validating generated asset alignment...");
  let validation = await validateAssetStrict(brand, currentAsset, story);
  
  const initialScore = validation.score;
  const history: string[] = [];

  while (validation.score < 85 && attempts < maxRetries) {
    attempts++;
    const issues = validation.issues.join(', ');
    if (onLog) onLog(`Quality Check: ${validation.score}/100. Fixing identified vulnerabilities (Cycle ${attempts}/${maxRetries})...`);
    
    history.push(`Cycle ${attempts}: ${issues}`);

    // Recursive Refinement
    try {
      const fixedAsset = await regenerateAsset(brand, currentAsset, validation.issues);
      currentAsset = { ...currentAsset, ...fixedAsset };
      
      // Re-validate against brand matrix
      validation = await validateAssetStrict(brand, currentAsset, story);
    } catch (e) {
      if (onLog) onLog("Neural link disruption in recursion cycle. Finalizing current state...");
      break;
    }
  }

  const finalReport: HealingReport = {
    attempt: attempts,
    originalScore: initialScore,
    finalScore: validation.score,
    issuesDetected: history,
    fixApplied: attempts > 0 ? "Neural Matrix Refinement" : "None required",
    timestamp: new Date().toISOString()
  };

  if (onLog) {
    if (validation.score >= 85) {
      onLog(`Asset APPROVED. Final Quality Index: ${validation.score}`);
    } else {
      onLog(`Asset accepted at Quality Index ${validation.score}. Limit reached.`);
    }
  }

  return {
    asset: currentAsset,
    report: finalReport
  };
};
