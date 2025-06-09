import puppeteer from 'puppeteer';
import { TikTokCreator, TikTokVideo } from '@/types';

// Simple in-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

export async function scrapeCreatorProfile(username: string): Promise<TikTokCreator> {
  const cacheKey = `profile:${username}`;
  const cached = getCached<TikTokCreator>(cacheKey);
  if (cached) return cached;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set user agent and other headers to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });
    
    // Navigate to TikTok profile page with timeout
    await page.goto(`https://www.tiktok.com/@${username}`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Check if profile exists
    const notFound = await page.$('div[data-e2e="user-not-found"]');
    if (notFound) {
      throw new Error('Profile not found');
    }

    // Extract profile data
    const profileData = await page.evaluate(() => {
      const getFollowerCount = () => {
        const followerElement = document.querySelector('[data-e2e="followers-count"]');
        return followerElement ? parseNumber(followerElement.textContent || '0') : 0;
      };

      const getLikesCount = () => {
        const likesElement = document.querySelector('[data-e2e="likes-count"]');
        return likesElement ? parseNumber(likesElement.textContent || '0') : 0;
      };

      const parseNumber = (str: string) => {
        const num = str.toLowerCase().replace(/[km]+$/, '');
        const multiplier = str.toLowerCase().endsWith('k') ? 1000 : (str.toLowerCase().endsWith('m') ? 1000000 : 1);
        return Math.round(parseFloat(num) * multiplier);
      };

      return {
        displayName: document.querySelector('[data-e2e="user-subtitle"]')?.textContent || '',
        bio: document.querySelector('[data-e2e="user-bio"]')?.textContent || '',
        followers: getFollowerCount(),
        likes: getLikesCount(),
        isVerified: !!document.querySelector('[data-e2e="user-verified"]'),
        profileImage: document.querySelector('[data-e2e="user-avatar"] img')?.getAttribute('src') || '',
      };
    });

    const result = {
      username,
      ...profileData,
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('net::ERR_TIMED_OUT')) {
        throw new Error('Request timed out. TikTok might be blocking access.');
      }
      throw error;
    }
    throw new Error('Failed to fetch profile data');
  } finally {
    await browser.close();
  }
}

export async function scrapeCreatorVideos(username: string): Promise<TikTokVideo[]> {
  const cacheKey = `videos:${username}`;
  const cached = getCached<TikTokVideo[]>(cacheKey);
  if (cached) return cached;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  });

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
    
    await page.goto(`https://www.tiktok.com/@${username}`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for videos to load and scroll to load more
    await page.waitForSelector('div[data-e2e="user-post-item"]', { timeout: 5000 }).catch(() => null);
    
    // Scroll multiple times to load more videos
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
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

      const videoElements = Array.from(document.querySelectorAll('div[data-e2e="user-post-item"]'));
      return videoElements.slice(0, 12).map(video => {
        // Find all img elements and get the one with the video thumbnail
        const images = Array.from(video.querySelectorAll('img'));
        const thumbnail = images.find(img => img.src.includes('tiktok'))?.src || '';
        
        // Get video stats
        const statsText = video.querySelector('strong')?.textContent || '0';
        const views = parseNumber(statsText);
        
        // Get video description
        const descElement = video.querySelector('div[class*="desc"]') || video.querySelector('div[data-e2e="user-post-item-desc"]');
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

    if (videos.length > 0) {
      setCache(cacheKey, videos);
      return videos;
    }
    
    throw new Error('No videos found');
  } catch (error) {
    console.error('Error scraping videos:', error);
    if (error instanceof Error) {
      if (error.message.includes('net::ERR_TIMED_OUT')) {
        throw new Error('Request timed out. TikTok might be blocking access.');
      }
      throw error;
    }
    throw new Error('Failed to fetch video data');
  } finally {
    await browser.close();
  }
} 