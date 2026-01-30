
import { GoogleGenAI, Type } from "@google/genai";
import { LeadProfile, CloserPortfolio } from "../types";
import { universalAiService } from "./universalAiService";

const MOCK_LEADS: any[] = [
  {
    companyName: "Nexus Digital Solutions",
    website: "https://nexus-digi-sol.io",
    opportunityScore: 92,
    painPointDescription: "Outdated brand identity that fails to communicate their high-tech AI capabilities. Website lacks consistent design language and has no clear CTA on mobile.",
    vulnerabilities: ["Broken mobile UX", "No conversion tracking", "Brand-messaging mismatch"],
    estimatedRevenue: "$2M - $5M",
    headcount: "25-50",
    founderName: "Alex Rivera",
    techStack: ["WordPress 5.4", "Legacy jQuery", "No SSL"]
  },
  {
    companyName: "Summit Peak Wellness",
    website: "https://summitpeakwellness.com",
    opportunityScore: 88,
    painPointDescription: "Marketing copy is overly technical and dry, failing to resonate with their wellness-focused target audience. Social presence is non-existent.",
    vulnerabilities: ["Low social engagement", "Dry copy", "Generic stock imagery"],
    estimatedRevenue: "$1M - $2M",
    headcount: "10-20",
    founderName: "Sarah Jenkins",
    techStack: ["Squarespace", "Mailchimp"]
  },
  {
    companyName: "Titan Logistics Corp",
    website: "https://titan-logistics.net",
    opportunityScore: 85,
    painPointDescription: "Extremely dated visual identity from the early 2000s. The brand feels 'heavy' and slow in an industry moving towards digital agility.",
    vulnerabilities: ["Ancient visual DNA", "No SEO structure", "Slow page load speed"],
    estimatedRevenue: "$10M+",
    headcount: "100+",
    founderName: "Robert Vance",
    techStack: ["Custom PHP", "Apache 2.4"]
  }
];

export const huntLeads = async (industry: string, location: string): Promise<LeadProfile[]> => {
  const prompt = `
    Act as an advanced B2B Lead Scraper & Qualifier.
    Generate 5 HIGH-FIDELITY, DEEP BUSINESS LEADS for the "${industry}" industry in "${location}".
    Return a JSON array.
  `;

  try {
    const response = await universalAiService.generateText({
      prompt,
      responseMimeType: 'application/json',
      featureId: 'lead-hunter'
    });

    if (response === "FALLBACK_TRIGGERED") {
      return MOCK_LEADS.map(l => ({ id: crypto.randomUUID(), industry, location, status: 'new', ...l })) as LeadProfile[];
    }

    const rawLeads = JSON.parse(response || '[]');
    return rawLeads.map((lead: any) => ({
      id: crypto.randomUUID(),
      industry,
      location,
      status: 'new',
      companyName: lead.companyName || 'Unknown Company',
      website: lead.website || '',
      rating: lead.rating || 0,
      contactEmail: lead.contactEmail || `contact@${lead.companyName.toLowerCase().replace(/\s/g, '')}.com`,
      techStack: Array.isArray(lead.techStack) ? lead.techStack : [],
      vulnerabilities: Array.isArray(lead.vulnerabilities) ? lead.vulnerabilities : [],
      opportunityScore: lead.opportunityScore || 50,
      estimatedRevenue: lead.estimatedRevenue || '$500k - $1M',
      headcount: lead.headcount || '1-10',
      painPointDescription: lead.painPointDescription || 'General branding inconsistencies.',
      founderName: lead.founderName || 'Decision Maker'
    })) as LeadProfile[];

  } catch (error) {
    console.warn("Lead hunting AI failed, returning mock leads.", error);
    return MOCK_LEADS.map(l => ({ id: crypto.randomUUID(), industry, location, status: 'new', ...l })) as LeadProfile[];
  }
};

export const generateCloserPortfolio = async (lead: LeadProfile): Promise<CloserPortfolio> => {
  const prompt = `
    Act as a World-Class Sales Strategist.
    Create a "Closer Portfolio" for ${lead.companyName}.
    Vulnerabilities: ${lead.vulnerabilities.join(', ')}
    Return JSON.
  `;

  try {
    const response = await universalAiService.generateText({
      prompt,
      responseMimeType: 'application/json'
    });

    const data = JSON.parse(response || '{}');
    return data as CloserPortfolio;
  } catch (error) {
    console.error("Portfolio generation failed", error);
    // Generic fallback for portfolio if needed
    return {
       subjectLine: "Quick question about Nexus Digital's brand positioning",
       emailBody: `Hi ${lead.founderName},\n\nI was reviewing Nexus Digital's online presence and noticed some significant friction points in your brand DNA that might be capping your current growth.\n\nSpecifically, your mobile UX and visual identity seem to be at odds with the high-tech nature of your actual services. I've forged a strategy to align these.\n\nBest,\n[Strategist]`,
       closingScript: "Establish authority immediately. Don't ask if they are busy; assume they are making room for growth.",
       objections: [{ objection: "We already have an agency", rebuttal: "We aren't an agency. We are a neural architecture for your brand." }],
       followUpSequence: ["Day 3: Social Proof", "Day 7: The Gap Analysis", "Day 14: Final Invitation"]
    };
  }
};
