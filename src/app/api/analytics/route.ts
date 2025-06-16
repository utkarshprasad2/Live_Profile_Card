import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get analytics data from the database
    const views = await prisma.profileView.count();
    const shares = await prisma.profileShare.count();
    
    // Calculate engagement rate (example calculation)
    const engagementRate = views > 0 ? Math.round((shares / views) * 100) : 0;

    // Get daily statistics
    const dailyStats = await prisma.profileView.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: 7 // Last 7 days
    });

    const formattedDailyStats = dailyStats.map(stat => ({
      date: stat.createdAt.toISOString().split('T')[0],
      views: stat._count.id,
      shares: 0 // TODO: Implement share tracking
    }));

    return NextResponse.json({
      views,
      shares,
      engagement: engagementRate,
      dailyStats: formattedDailyStats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { type, profileId } = await request.json();

    if (type === 'view') {
      await prisma.profileView.create({
        data: {
          profileId
        }
      });
    } else if (type === 'share') {
      await prisma.profileShare.create({
        data: {
          profileId
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording analytics event:', error);
    return NextResponse.json(
      { error: 'Failed to record analytics event' },
      { status: 500 }
    );
  }
} 