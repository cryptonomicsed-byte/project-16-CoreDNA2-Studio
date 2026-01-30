/**
 * Real Web Scraper - Using server-side approach with fallbacks
 * In production, use Puppeteer/Playwright for JavaScript-heavy sites
 */

export interface ScrapedData {
  url: string;
  title: string;
  metaDescription: string;
  h1: string[];
  h2: string[];
  bodyText: string;
  images: string[];
  socialLinks: string[];
}

async function fetchWithTimeout(url: string, timeout = 8000): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseHTML(html: string, targetUrl: string): ScrapedData {
  // This would use cheerio or jsdom in real implementation
  // For now, regex-based parsing (basic)
  
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i);
  
  const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([^<]*)<\/h1>/gi)).map(m => m[1]);
  const h2Matches = Array.from(html.matchAll(/<h2[^>]*>([^<]*)<\/h2>/gi)).map(m => m[1]);
  
  // Extract main text (paragraphs)
  const pMatches = Array.from(html.matchAll(/<p[^>]*>([^<]*)<\/p>/gi))
    .map(m => m[1].trim())
    .filter(t => t.length > 50)
    .slice(0, 25);
  
  const images = Array.from(html.matchAll(/<img[^>]*src=["']([^"']*)/gi))
    .map(m => m[1])
    .filter(src => src.startsWith('http') || src.startsWith('/'))
    .slice(0, 8);
  
  const socialLinks = Array.from(html.matchAll(/<a[^>]*href=["']([^"']*(?:linkedin|twitter|instagram|facebook|tiktok)[^"']*)["']/gi))
    .map(m => m[1]);

  return {
    url: targetUrl,
    title: titleMatch ? titleMatch[1].trim() : '',
    metaDescription: metaDescMatch ? metaDescMatch[1].trim() : '',
    h1: h1Matches,
    h2: h2Matches,
    bodyText: pMatches.join('\n\n'),
    images,
    socialLinks: [...new Set(socialLinks)]
  };
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  try {
    const html = await fetchWithTimeout(url);
    return parseHTML(html, url);
  } catch (error) {
    console.error(`Scrape failed for ${url}:`, error);
    // Return minimal data instead of throwing
    return {
      url,
      title: '',
      metaDescription: '',
      h1: [],
      h2: [],
      bodyText: '',
      images: [],
      socialLinks: []
    };
  }
}
