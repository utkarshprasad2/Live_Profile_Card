import puppeteer from 'puppeteer';
import { TikTokCreator, TikTokVideo } from '@/types';

export async function scrapeCreatorProfile(username: string): Promise<TikTokCreator> {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Navigate to TikTok profile page
    await page.goto(`https://www.tiktok.com/@${username}`, {
      waitUntil: 'networkidle0',
    });

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

    return {
      username,
      ...profileData,
    };
  } finally {
    await browser.close();
  }
}

export async function scrapeCreatorVideos(username: string): Promise<TikTokVideo[]> {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto(`https://www.tiktok.com/@${username}`, {
      waitUntil: 'networkidle0',
    });

    // Extract video data
    const videos = await page.evaluate(() => {
      const parseNumber = (str: string) => {
        if (!str) return 0;
        const num = str.toLowerCase().replace(/[km]+$/, '');
        const multiplier = str.toLowerCase().endsWith('k') ? 1000 : (str.toLowerCase().endsWith('m') ? 1000000 : 1);
        return Math.round(parseFloat(num) * multiplier);
      };

      const videoElements = document.querySelectorAll('[data-e2e="user-post-item"]');
      return Array.from(videoElements).slice(0, 6).map((video) => {
        const thumbnail = video.querySelector('img')?.getAttribute('src') || '';
        const views = parseNumber(video.querySelector('[data-e2e="video-views"]')?.textContent || '0');
        const description = video.querySelector('[data-e2e="video-desc"]')?.textContent || '';
        
        return {
          id: video.getAttribute('data-video-id') || Date.now().toString(),
          thumbnail,
          views,
          likes: Math.floor(views * 0.4), // Estimate likes based on views
          description,
          createdAt: new Date().toISOString(),
        };
      });
    });

    return videos;
  } finally {
    await browser.close();
  }
} 