'use client';

import { useState } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import Loading from '@/components/Loading';
import ProfileCard from '@/components/ProfileCard';
import SearchForm from '@/components/SearchForm';
import VideoGrid from '@/components/VideoGrid';
import Analytics from '@/components/Analytics';
import { TikTokCreator, TikTokVideo, ApiResponse } from '@/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creator, setCreator] = useState<TikTokCreator | null>(null);
  const [videos, setVideos] = useState<TikTokVideo[]>([]);

  const handleSearch = async (username: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/creator?username=${encodeURIComponent(username)}`);
      const result: ApiResponse<{ profile: TikTokCreator; videos: TikTokVideo[] }> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch creator data');
      }
      
      if (result.data) {
        setCreator(result.data.profile);
        setVideos(result.data.videos);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setCreator(null);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            TikTok Profile Viewer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Enter a TikTok username to view their profile, videos, and analytics
          </p>
        </div>

        <ErrorBoundary>
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
              <p className="text-red-800 dark:text-red-400">{error}</p>
            </div>
          )}

          {isLoading && <Loading />}

          {creator && !isLoading && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              <div className="xl:col-span-4">
                <ProfileCard profile={creator} />
              </div>
              
              <div className="xl:col-span-8">
                <Analytics videos={videos} />
              </div>

              <div className="xl:col-span-12">
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Recent Videos
                  </h2>
                  <VideoGrid videos={videos} />
                </div>
              </div>
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}
