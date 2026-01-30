import { BrandDNA, WebsiteData, SiteSection } from "../types";
import { universalAiService } from "./universalAiService";

export const generateWebsiteStructure = async (brand: BrandDNA): Promise<WebsiteData> => {
  const prompt = `Act as a UX Designer. Create landing page content for "${brand.name}". Return JSON for hero, features, about, and cta sections.`;

  try {
    const response = await universalAiService.generateText({
      prompt,
      responseMimeType: 'application/json',
      featureId: 'site-builder'
    });
    
    let content: any = {};
    if (response === "FALLBACK_TRIGGERED") {
      content = {
        hero: { headline: `Future of ${brand.name}`, subheadline: brand.mission, cta: "Discover DNA" },
        features: [{ title: "Intelligence", desc: "Neural processing power." }, { title: "Scale", desc: "Enterprise readiness." }, { title: "Speed", desc: "Instant deployment." }],
        about: { title: "Our Story", text: brand.elevatorPitch },
        cta: { headline: "Ready to Forge?", button: "Initialize" }
      };
    } else {
      try {
        content = JSON.parse(response || '{}');
      } catch (e) {
        content = {};
      }
    }

    const sections: SiteSection[] = [
      { id: 'sec_hero', type: 'hero', order: 0, isVisible: true, content: content.hero || { headline: brand.name, subheadline: '', cta: 'Get Started' } },
      { id: 'sec_features', type: 'features', order: 1, isVisible: true, content: { items: content.features || [] } },
      { id: 'sec_about', type: 'about', order: 2, isVisible: true, content: content.about || { title: 'About Us', text: brand.elevatorPitch } },
      { id: 'sec_cta', type: 'cta', order: 3, isVisible: true, content: content.cta || { headline: 'Join Us Today', button: 'Contact' } },
      { id: 'sec_footer', type: 'footer', order: 4, isVisible: true, content: { copyright: content.footer?.copyright || `© ${new Date().getFullYear()} ${brand.name}.` } }
    ];

    return {
      id: crypto.randomUUID(),
      brandId: brand.id,
      subdomain: brand.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random()*1000),
      sections,
      status: 'draft'
    };
  } catch (e) {
    console.error("Site generation error", e);
    throw e;
  }
};

export const deployWebsite = async (site: WebsiteData): Promise<string> => {
  return new Promise((resolve) => setTimeout(() => resolve(`https://${site.subdomain}.coredna.sites.ai`), 2000));
};