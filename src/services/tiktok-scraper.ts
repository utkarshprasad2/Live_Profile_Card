import puppeteer from 'puppeteer';
import { TikTokProfile, TikTokVideo } from '@/types/tiktok';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return cached.data as T;
}

function setCache<T>(key: string, data: T) {
  cache.set(key, { data, timestamp: Date.now() });
}

async function initBrowser() {
  return await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });
}

export async function scrapeCreatorProfile(username: string): Promise<TikTokProfile> {
  const cacheKey = `profile:${username}`;
  const cached = getCached<TikTokProfile>(cacheKey);
  if (cached) return cached;

  const browser = await initBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"'
    });

    // Add error handling for navigation
    await Promise.race([
      page.goto(`https://www.tiktok.com/@${username}`, {
        waitUntil: 'networkidle0',
        timeout: 60000 // Increase timeout to 60 seconds
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Navigation timeout')), 60000)
      )
    ]);

    // Wait for key elements with increased timeout
    await page.waitForSelector('h1[data-e2e="user-title"], h2[data-e2e="user-subtitle"]', { timeout: 10000 })
      .catch(() => console.log('Could not find title/subtitle elements'));

    const profile = await page.evaluate(() => {
      const getFollowerCount = () => {
        const elements = document.querySelectorAll('strong[data-e2e*="followers"], div[data-e2e*="followers"] strong');
        for (const el of elements) {
          const text = el.textContent?.trim();
          if (text) {
            const num = text.toLowerCase();
            if (num.endsWith('m')) return Math.round(parseFloat(num) * 1000000);
            if (num.endsWith('k')) return Math.round(parseFloat(num) * 1000);
            return parseInt(num.replace(/,/g, ''), 10);
          }
        }
        return 0;
      };

      const getFollowingCount = () => {
        const elements = document.querySelectorAll('strong[data-e2e*="following"], div[data-e2e*="following"] strong');
        for (const el of elements) {
          const text = el.textContent?.trim();
          if (text) {
            const num = text.toLowerCase();
            if (num.endsWith('m')) return Math.round(parseFloat(num) * 1000000);
            if (num.endsWith('k')) return Math.round(parseFloat(num) * 1000);
            return parseInt(num.replace(/,/g, ''), 10);
          }
        }
        return 0;
      };

      const getLikesCount = () => {
        const elements = document.querySelectorAll('strong[data-e2e*="likes"], div[data-e2e*="likes"] strong');
        for (const el of elements) {
          const text = el.textContent?.trim();
          if (text) {
            const num = text.toLowerCase();
            if (num.endsWith('m')) return Math.round(parseFloat(num) * 1000000);
            if (num.endsWith('k')) return Math.round(parseFloat(num) * 1000);
            return parseInt(num.replace(/,/g, ''), 10);
          }
        }
        return 0;
      };

      const displayName = document.querySelector('h1[data-e2e="user-title"], h2[data-e2e="user-subtitle"]')?.textContent?.trim() || '';
      const bio = document.querySelector('h2[data-e2e="user-bio"], div[data-e2e="user-bio"]')?.textContent?.trim() || '';
      const avatar = document.querySelector('img[data-e2e="user-avatar"]')?.getAttribute('src') || '';

      return {
        username: window.location.pathname.split('@')[1]?.replace('/', '') || '',
        displayName,
        avatar,
        bio,
        followers: getFollowerCount(),
        following: getFollowingCount(),
        likes: getLikesCount()
      };
    });

    if (!profile.username) {
      throw new Error('Failed to fetch profile data');
    }

    setCache(cacheKey, profile);
    return profile;
  } catch (error) {
    console.error('Error scraping profile:', error);
    throw new Error('Failed to fetch profile data');
  } finally {
    await browser.close();
  }
}

export async function scrapeCreatorVideos(username: string): Promise<TikTokVideo[]> {
  const cacheKey = `videos:${username}`;
  const cached = getCached<TikTokVideo[]>(cacheKey);
  if (cached) return cached;

  const browser = await initBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"'
    });

    // Add error handling for navigation
    await Promise.race([
      page.goto(`https://www.tiktok.com/@${username}`, {
        waitUntil: 'networkidle0',
        timeout: 60000
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Navigation timeout')), 60000)
      )
    ]);

    // Wait for videos to load with increased timeout
    await page.waitForSelector('div[data-e2e="user-post-item"]', { timeout: 10000 })
      .catch(() => console.log('Could not find video elements'));

    // Scroll multiple times to load more videos
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Extract video data with more reliable selectors
    const videos = await page.evaluate(() => {
      const parseNumber = (str: string): number => {
        if (!str) return 0;
        const multipliers: { [key: string]: number } = {
          K: 1000,
          M: 1000000,
          B: 1000000000
        };
        
        const match = str.match(/([\d.]+)([KMB])?/);
        if (!match) return 0;
        
        const num = parseFloat(match[1]);
        const multiplier = match[2] ? multipliers[match[2]] : 1;
        return Math.round(num * multiplier);
      };

      const videoElements = Array.from(document.querySelectorAll('div[data-e2e="user-post-item"], div[data-e2e="user-post-item-list"] > div'));
      return videoElements.slice(0, 12).map(video => {
        // Find all img elements and get the one with the video thumbnail
        const images = Array.from(video.querySelectorAll('img'));
        const thumbnail = images.find(img => img.src?.includes('tiktok'))?.src || '';
        
        // Get video stats
        const statsText = video.querySelector('strong')?.textContent || '0';
        const views = parseNumber(statsText);
        
        // Get video description
        const descElement = video.querySelector('div[class*="desc"], div[data-e2e="user-post-item-desc"]');
        const description = descElement?.textContent?.trim() || '';
        
        // Get video date if available
        const dateElement = video.querySelector('time');
        const createdAt = dateElement?.dateTime || new Date().toISOString();
        
        // Generate a unique ID
        const id = video.getAttribute('data-e2e-id') || 
                  thumbnail.split('?')[0].split('/').pop() || 
                  Date.now().toString();
        
        return {
          id,
          thumbnail,
          views,
          likes: Math.floor(views * 0.4), // Estimate likes based on views
          description,
          createdAt
        };
      });
    });

    if (videos.length === 0) {
      console.log('No videos found for user:', username);
      return [];
    }

    setCache(cacheKey, videos);
    return videos;
  } catch (error) {
    console.error('Error scraping videos:', error);
    return []; // Return empty array instead of throwing
  } finally {
    await browser.close();
  }
} 