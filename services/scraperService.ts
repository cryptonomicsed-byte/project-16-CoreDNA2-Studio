
/**
 * Real-time Website Scraper
 * Fetches raw HTML via CORS proxy and parses DOM for content.
 */

export interface ScrapedData {
  url: string;
  title: string;
  metaDescription: string;
  h1: string[];
  h2: string[];
  bodyText: string;
  links: string[];
  images: string[];
  socialLinks: string[];
}

const normalizeUrl = (url: string) => {
  let normalized = url.trim();
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }
  return normalized;
};

const parseHtml = (htmlText: string, targetUrl: string): ScrapedData => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    // Extract Data
    const title = doc.title || '';
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    
    const h1 = Array.from(doc.querySelectorAll('h1')).map(el => el.textContent?.trim() || '').filter(t => t.length > 0);
    const h2 = Array.from(doc.querySelectorAll('h2')).map(el => el.textContent?.trim() || '').filter(t => t.length > 0);
    
    // Extract main text content (heuristically filtering out nav/footer noise)
    const paragraphs = Array.from(doc.querySelectorAll('p, article, section, li'))
      .map(el => el.textContent?.trim() || '')
      .filter(t => t.length > 50) // Only keep substantial text blocks
      .slice(0, 25); // Limit context window usage
    
    const bodyText = paragraphs.join('\n\n');

    // Extract Social Links for contact info
    const socialLinks = Array.from(doc.querySelectorAll('a'))
      .map(a => a.href)
      .filter(href => href.includes('linkedin.com') || href.includes('twitter.com') || href.includes('x.com') || href.includes('instagram.com') || href.includes('facebook.com') || href.includes('tiktok.com'));

    // Extract Images (potential logos)
    const images = Array.from(doc.querySelectorAll('img'))
      .map(img => {
        const src = img.getAttribute('src');
        if (!src) return '';
        // Handle relative URLs
        try {
          return new URL(src, targetUrl).href;
        } catch {
          return src.startsWith('http') ? src : '';
        }
      })
      .filter(src => src.startsWith('http'))
      .slice(0, 8); // Grab a few more candidates

    return {
      url: targetUrl,
      title,
      metaDescription,
      h1,
      h2,
      bodyText,
      links: [],
      images,
      socialLinks: [...new Set(socialLinks)] // unique
    };
}

export const scrapeWebsite = async (rawUrl: string): Promise<ScrapedData> => {
  const targetUrl = normalizeUrl(rawUrl);
  
  // Array of proxy generators to try in sequence
  // These are public CORS proxies. In a production enterprise app, you would use your own backend proxy.
  const proxies = [
    // Primary: AllOrigins
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    // Backup 1: CorsProxy.io
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    // Backup 2: CorsBase (sometimes works better for certain headers)
    (url: string) => `https://cors-anywhere.herokuapp.com/${url}` // Note: Often requires requesting temporary access
  ];

  let lastError;

  for (const getProxyUrl of proxies) {
    const proxyUrl = getProxyUrl(targetUrl);
    try {
      console.log(`[Scraper] Attempting scrape via: ${proxyUrl}`);
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Proxy responded with status ${response.status}`);
      }
      
      const htmlText = await response.text();
      if (!htmlText || htmlText.trim().length === 0) {
         throw new Error("Empty response from proxy");
      }

      return parseHtml(htmlText, targetUrl);

    } catch (error) {
      console.warn(`[Scraper] Proxy attempt failed for ${targetUrl}`, error);
      lastError = error;
      // loop continues to next proxy
    }
  }

  console.error("[Scraper] All scraping attempts failed.");
  throw new Error(`Could not access ${targetUrl}. The site may be blocking automated access or CORS proxies.`);
};
