import { NextResponse } from 'next/server';
import { scrapeCreatorProfile, scrapeCreatorVideos } from '@/services/tiktok-scraper';

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = requestLog.get(ip) || [];
  
  // Clean up old requests
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  // Update request log
  recentRequests.push(now);
  requestLog.set(ip, recentRequests);
  return false;
}

export async function GET(request: Request) {
  try {
    // Get client IP (in production, you'd get this from headers)
    const ip = '127.0.0.1'; // Placeholder for demo
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Validate username format
    if (!/^[\w.]{2,24}$/.test(username)) {
      return NextResponse.json(
        { error: 'Invalid username format' },
        { status: 400 }
      );
    }

    const [profile, videos] = await Promise.all([
      scrapeCreatorProfile(username),
      scrapeCreatorVideos(username)
    ]);

    return NextResponse.json({
      data: {
        profile,
        videos
      },
      status: 200,
      message: 'Success'
    });
  } catch (error) {
    console.error('Error scraping TikTok data:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'TikTok profile not found' },
          { status: 404 }
        );
      }
      
      if (error.message.includes('blocked')) {
        return NextResponse.json(
          { error: 'Access to TikTok is currently restricted. Please try again later.' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch creator data' },
      { status: 500 }
    );
  }
} 