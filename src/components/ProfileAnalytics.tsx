import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";

interface AnalyticsData {
  views: number;
  shares: number;
  engagement: number;
  dailyStats: {
    date: string;
    views: number;
    shares: number;
  }[];
}

export function ProfileAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    views: 0,
    shares: 0,
    engagement: 0,
    dailyStats: []
  });

  useEffect(() => {
    // TODO: Fetch analytics data from API
    const mockData: AnalyticsData = {
      views: 1234,
      shares: 56,
      engagement: 78,
      dailyStats: [
        { date: '2024-03-01', views: 100, shares: 5 },
        { date: '2024-03-02', views: 150, shares: 8 },
        { date: '2024-03-03', views: 200, shares: 12 },
        { date: '2024-03-04', views: 180, shares: 10 },
        { date: '2024-03-05', views: 250, shares: 15 },
      ]
    };
    setAnalyticsData(mockData);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.views}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.shares}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.engagement}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" />
                <Line type="monotone" dataKey="shares" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 