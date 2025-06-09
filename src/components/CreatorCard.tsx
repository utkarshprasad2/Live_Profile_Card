import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLynxFollowerAnimation, useLynxVideoGrid } from '@/lynx-components';
import { TikTokCreator, TikTokVideo } from '@/types';

interface CreatorCardProps {
  username: string;
}

async function fetchCreatorData(username: string) {
  const response = await fetch(`/api/creator?username=${username}`);
  if (!response.ok) {
    throw new Error('Failed to fetch creator data');
  }
  const data = await response.json();
  return data;
}

export default function CreatorCard({ username }: CreatorCardProps) {
  const [creator, setCreator] = useState<TikTokCreator | null>(null);
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [previousFollowers, setPreviousFollowers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { ref: followerCountRef, displayValue: followerCount } = useLynxFollowerAnimation({
    followers: creator?.followers || 0,
    previousFollowers
  });
  
  const videoGridRef = useLynxVideoGrid();

  useEffect(() => {
    async function loadCreatorData() {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await fetchCreatorData(username);

        if (creator) {
          setPreviousFollowers(creator.followers);
        }
        setCreator(result.data.profile);
        setVideos(result.data.videos);
      } catch (error) {
        setError('Failed to fetch creator data. Please try again.');
        console.error('Error fetching creator data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCreatorData();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(loadCreatorData, 30000);
    return () => clearInterval(interval);
  }, [username]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!creator) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img
              className="h-20 w-20 rounded-full"
              src={creator.profileImage}
              alt={creator.displayName}
            />
            <div>
              <h2 className="text-xl font-bold flex items-center">
                {creator.displayName}
                {creator.isVerified && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-5 h-5 ml-1 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </motion.svg>
                )}
              </h2>
              <p className="text-gray-500">@{creator.username}</p>
            </div>
          </motion.div>

          <div className="mt-6 flex justify-around text-center">
            <div>
              <div className="text-2xl font-bold" ref={followerCountRef}>
                {followerCount.toLocaleString()}
              </div>
              <div className="text-gray-500">Followers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {creator.likes.toLocaleString()}
              </div>
              <div className="text-gray-500">Likes</div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-gray-600"
          >
            {creator.bio}
          </motion.p>

          <div className="mt-6" ref={videoGridRef}>
            <h3 className="text-lg font-semibold mb-4">Recent Videos</h3>
            <div className="grid grid-cols-3 gap-2">
              {videos.slice(0, 6).map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square relative overflow-hidden rounded-lg video-grid-item"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.description}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                    {video.views.toLocaleString()} views
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.a
            href={`https://www.tiktok.com/@${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block w-full bg-[#FE2C55] text-white text-center py-2 rounded-lg font-semibold hover:bg-[#E62B51] transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Follow
          </motion.a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 