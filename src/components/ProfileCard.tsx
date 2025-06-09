'use client';

import Image from 'next/image';
import { useState } from 'react';
import { TikTokCreator } from '@/types';

interface ProfileCardProps {
  profile: TikTokCreator;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
      <div className="relative h-32 bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800">
            {!imageError ? (
              <Image
                src={profile.profileImage}
                alt={profile.displayName}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                  {profile.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-16 pb-6 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {profile.displayName}
          </h2>
          {profile.isVerified && (
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
          )}
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 mb-4">@{profile.username}</p>
        
        <p className="text-gray-700 dark:text-gray-300 mb-6">{profile.bio}</p>
        
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {formatNumber(profile.followers)}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {formatNumber(profile.likes)}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Likes</div>
          </div>
        </div>
      </div>
    </div>
  );
} 