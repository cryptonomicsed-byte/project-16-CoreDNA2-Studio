import { AffiliateStats, AffiliatePayout, AffiliateTier } from "../types";

export const getAffiliateStats = async (): Promise<AffiliateStats> => {
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    totalEarnings: 12450.00,
    pendingPayout: 850.50,
    clicks: 3420,
    signups: 142,
    conversionRate: 4.15
  };
};

export const getReferralLink = (): string => {
  return "https://app.coredna.ai/signup?ref=PARTNER-8821";
};

export const getAffiliateTier = async (): Promise<AffiliateTier> => {
  return {
    name: "Gold Partner",
    commission: 30,
    minReferrals: 100,
    currentReferrals: 142,
    nextTierName: "Platinum Partner"
  };
};

export const getPayoutHistory = async (): Promise<AffiliatePayout[]> => {
  return [
    { id: 'p1', amount: 1250.00, status: 'paid', date: '2025-05-01', method: 'PayPal' },
    { id: 'p2', amount: 980.50, status: 'paid', date: '2025-04-01', method: 'PayPal' },
    { id: 'p3', amount: 1100.00, status: 'paid', date: '2025-03-01', method: 'Stripe' },
    { id: 'p4', amount: 850.50, status: 'pending', date: '2025-06-01', method: 'PayPal' },
  ];
};

export const getMarketingAssets = () => {
  return [
    {
      type: 'email',
      title: 'Intro to CoreDNA',
      content: "Hey [Name],\n\nI've been using CoreDNA to automate my brand strategy and asset generation, and it's a game changer.\n\nIt extracts brand essence from any URL and auto-generates infinite social content.\n\nCheck it out here: [Link]"
    },
    {
      type: 'email',
      title: 'Agency Benefit Pitch',
      content: "Hi [Name],\n\nStop wasting hours on manual brand extraction. CoreDNA's neural engine does it in seconds.\n\nScale your agency output by 10x without hiring more staff.\n\nTry the free extraction tool: [Link]"
    },
    {
      type: 'tweet',
      title: 'Viral Thread Hook',
      content: "AI isn't replacing marketers. Marketers using AI are replacing marketers who don't.\n\nI just generated a full campaign PRD + 20 assets in 3 minutes using CoreDNA.\n\nHere's the breakdown 🧵👇\n\n[Link]"
    }
  ];
};