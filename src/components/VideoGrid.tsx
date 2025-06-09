'use client';

import Image from 'next/image';
import { useState } from 'react';
import { TikTokVideo } from '@/types';

interface VideoGridProps {
  videos: TikTokVideo[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleImageError = (videoId: string) => {
    setImageErrors(prev => ({ ...prev, [videoId]: true }));
  };

  if (!videos.length) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        No videos found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {videos.map((video) => (
        <div key={video.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="relative aspect-[9/16] w-full">
            {!imageErrors[video.id] ? (
              <Image
                src={video.thumbnail}
                alt={video.description}
                fill
                className="object-cover"
                onError={() => handleImageError(video.id)}
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {formatNumber(video.views)}
            </div>
          </div>
          
          <div className="p-4">
            <p className="text-gray-900 dark:text-white line-clamp-2 mb-2">
              {video.description || 'No description'}
            </p>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              {formatNumber(video.likes)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 