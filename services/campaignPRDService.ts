
import { BrandDNA, CampaignPRD, CampaignOverview } from "../types";
import { generateAdvancedPRD } from "./geminiService";

export const createCampaignPRD = async (
  brand: BrandDNA,
  overview: CampaignOverview,
  channels: string[]
): Promise<CampaignPRD> => {
  console.log("Creating Advanced PRD for", brand.name);
  return await generateAdvancedPRD(brand, overview, channels);
};
