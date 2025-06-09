import { NextResponse } from 'next/server';
import { scrapeCreatorProfile, scrapeCreatorVideos } from '@/services/tiktok-scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  try {
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
    return NextResponse.json(
      { error: 'Failed to fetch creator data' },
      { status: 500 }
    );
  }
} 