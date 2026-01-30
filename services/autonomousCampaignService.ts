
import { BrandDNA, CampaignPRD, CampaignAsset, UserStory } from "../types";
import { generateAssetFromStory, generateCampaignImage } from "./geminiService";
import { healAsset } from "./selfHealingService";

export type LogCallback = (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
export type ProgressCallback = (completed: number, total: number) => void;
export type AssetCallback = (asset: CampaignAsset) => void;
export type StoryUpdateCallback = (storyId: string, status: UserStory['status']) => void;

export class AutonomousCampaignEngine {
  private brand: BrandDNA;
  private prd: CampaignPRD;
  private onLog: LogCallback;
  private onProgress: ProgressCallback;
  private onAssetGenerated: AssetCallback;
  private onStoryUpdate: StoryUpdateCallback;
  private maxRetries: number;
  private stopSignal = false;
  private completedStoryIds: Set<string> = new Set();

  constructor(
    brand: BrandDNA,
    prd: CampaignPRD,
    onLog: LogCallback,
    onProgress: ProgressCallback,
    onAssetGenerated: AssetCallback,
    onStoryUpdate: StoryUpdateCallback,
    maxRetries: number = 3
  ) {
    this.brand = brand;
    this.prd = prd;
    this.onLog = onLog;
    this.onProgress = onProgress;
    this.onAssetGenerated = onAssetGenerated;
    this.onStoryUpdate = onStoryUpdate;
    this.maxRetries = maxRetries;
  }

  public stop() {
    this.stopSignal = true;
  }

  public async start() {
    this.onLog(`Initializing Autonomous Forge for ${this.brand.name} with ${this.maxRetries} healing cycles...`, 'info');
    const total = this.prd.userStories.length;
    let completedCount = 0;

    while (completedCount < total && !this.stopSignal) {
      const executableStories = this.prd.userStories.filter(story => {
        if (this.completedStoryIds.has(story.id)) return false;
        if (story.status === 'generating' || story.status === 'healing') return false;
        const allDependenciesMet = story.dependencies.every(depId => this.completedStoryIds.has(depId));
        return allDependenciesMet;
      });

      if (executableStories.length === 0 && completedCount < total) {
        this.onLog("Campaign dependency sequence reached a synchronization point...", 'warning');
        break; 
      }

      const batch = executableStories.slice(0, 2); // Small batch for stability
      const promises = batch.map(story => this.executeStory(story));
      await Promise.all(promises);

      completedCount = this.completedStoryIds.size;
      this.onProgress(completedCount, total);
    }

    if (this.stopSignal) {
      this.onLog("Campaign Forge Halted.", 'warning');
    } else {
      this.onLog("Full-Scale Campaign Generation Complete.", 'success');
    }
  }

  private async executeStory(story: UserStory) {
    this.onStoryUpdate(story.id, 'generating');
    this.onLog(`[${story.channel}] Generating content for Story: ${story.id}...`, 'info');

    try {
      // 1. Generate Content & Prompt
      const rawAsset = await generateAssetFromStory(this.brand, story);
      
      // 2. Recursive Self-Healing (User defined limit)
      this.onStoryUpdate(story.id, 'healing');
      const { asset: finalAssetData, report } = await healAsset(
        this.brand, 
        rawAsset, 
        story, 
        this.maxRetries,
        (msg) => this.onLog(`[RECURSION] ${msg}`, 'info')
      );

      // 3. Actual Image Generation (gemini-2.5-flash-image)
      let imageUrl = undefined;
      if (finalAssetData.imagePrompt) {
        this.onLog(`[VISUALS] Synthesizing image with Gemini Flash...`, 'info');
        imageUrl = await generateCampaignImage(finalAssetData.imagePrompt, this.brand);
      }

      // 4. Finalize
      const finalAsset: CampaignAsset = {
        id: crypto.randomUUID(),
        storyId: story.id,
        title: finalAssetData.title || 'Untitled',
        headline: finalAssetData.headline,
        content: finalAssetData.content || '',
        cta: finalAssetData.cta,
        imagePrompt: finalAssetData.imagePrompt,
        imageUrl: imageUrl,
        hashtags: finalAssetData.hashtags || [],
        videoPrompt: finalAssetData.videoPrompt,
        emailSubject: finalAssetData.emailSubject,
        metadata: {
          channel: story.channel,
          type: story.assetTypes[0],
          status: 'approved',
          qualityScore: report.finalScore,
          scheduledAt: this.calculateScheduleTime(story.dayOffset)
        },
        healingHistory: [report]
      };

      this.onAssetGenerated(finalAsset);
      this.onStoryUpdate(story.id, 'completed');
      this.completedStoryIds.add(story.id);

    } catch (error) {
      this.onLog(`Story ${story.id} Failed: ${error}`, 'error');
      this.onStoryUpdate(story.id, 'failed');
    }
  }

  private calculateScheduleTime(dayOffset: number = 0): string {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    date.setHours(9, 0, 0, 0);
    return date.toISOString();
  }
}
