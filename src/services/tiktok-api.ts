import { TikTokProfile, TikTokVideo } from '@/types/tiktok';

const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v2';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

// Cache helper functions
function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return cached.data as T;
}

function setCache<T>(key: string, data: T) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Types for API responses
interface TikTokApiResponse<T> {
  data: T;
  error: {
    code: string;
    message: string;
    log_id: string;
  };
}

interface UserInfoResponse {
  user: {
    avatar_url: string;
    open_id: string;
    union_id: string;
    display_name: string;
  };
}

interface VideoListResponse {
  videos: Array<{
    id: string;
    title: string;
    video_description: string;
    duration: number;
    cover_image_url: string;
    share_url: string;
    embed_link: string;
  }>;
  cursor: number;
  has_more: boolean;
}

// Helper function to get the access token
async function getAccessToken(): Promise<string> {
  // For now, return null - this will be implemented when you provide the API credentials
  return process.env.TIKTOK_ACCESS_TOKEN || '';
}

// Helper function to make authenticated requests to TikTok API
async function makeAuthenticatedRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: any
): Promise<TikTokApiResponse<T>> {
  const accessToken = await getAccessToken();
  
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(`${TIKTOK_API_BASE}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getUserProfile(username: string): Promise<TikTokProfile> {
  const cacheKey = `profile:${username}`;
  const cached = getCached<TikTokProfile>(cacheKey);
  if (cached) return cached;

  try {
    const response = await makeAuthenticatedRequest<UserInfoResponse>(
      '/user/info/',
      'GET'
    );

    if (!response.data.user) {
      throw new Error('Failed to fetch profile data');
    }

    const profile: TikTokProfile = {
      username: username,
      displayName: response.data.user.display_name,
      avatar: response.data.user.avatar_url,
      bio: '', // Bio is not available in the basic scope
      followers: 0, // These metrics require additional scopes
      following: 0,
      likes: 0
    };

    setCache(cacheKey, profile);
    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Failed to fetch profile data');
  }
}

export async function getUserVideos(username: string): Promise<TikTokVideo[]> {
  const cacheKey = `videos:${username}`;
  const cached = getCached<TikTokVideo[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await makeAuthenticatedRequest<VideoListResponse>(
      '/video/list/',
      'POST',
      {
        max_count: 20,
        fields: [
          'id',
          'title',
          'video_description',
          'duration',
          'cover_image_url',
          'embed_link'
        ]
      }
    );

    if (!response.data.videos) {
      console.log('No videos found for user:', username);
      return [];
    }

    const videos: TikTokVideo[] = response.data.videos.map(video => ({
      id: video.id,
      thumbnail: video.cover_image_url,
      views: 0, // Views count requires additional scope
      likes: 0, // Likes count requires additional scope
      description: video.video_description || video.title,
      createdAt: new Date().toISOString(), // Creation time requires additional scope
      embedLink: video.embed_link
    }));

    setCache(cacheKey, videos);
    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

// Function to refresh access token using refresh token
export async function refreshAccessToken(): Promise<void> {
  // This will be implemented when you provide the API credentials
  // It should use the refresh token to get a new access token
  // and update it in the environment/configuration
} 