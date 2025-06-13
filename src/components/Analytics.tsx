'use client';

import { TikTokVideo } from '@/types/tiktok';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface AnalyticsProps {
  videos: TikTokVideo[];
  followers?: number;
}

export function Analytics({ videos, followers = 0 }: AnalyticsProps) {
  if (!videos || videos.length === 0) return null;

  // Calculate total views and average engagement
  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
  const totalLikes = videos.reduce((sum, video) => sum + video.likes, 0);
  const averageViews = Math.round(totalViews / videos.length);
  const averageLikes = Math.round(totalLikes / videos.length);
  
  // Calculate engagement rate (average likes per video / followers * 100)
  const engagementRate = followers > 0 
    ? ((averageLikes / followers) * 100).toFixed(2)
    : 'N/A';

  // Prepare data for the views chart
  const chartData = videos.map((video, index) => ({
    index: index + 1,
    views: video.views,
    likes: video.likes,
  }));

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalViews)}</div>
          <p className="text-xs text-muted-foreground">
            Across {videos.length} videos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(averageViews)}</div>
          <p className="text-xs text-muted-foreground">Per video</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalLikes)}</div>
          <p className="text-xs text-muted-foreground">
            Across {videos.length} videos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{engagementRate}%</div>
          <p className="text-xs text-muted-foreground">Average per video</p>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => formatNumber(value)}
                labelFormatter={(label: number) => `Video ${label}`}
              />
              <Bar dataKey="views" fill="#8884d8" name="Views" />
              <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
} 