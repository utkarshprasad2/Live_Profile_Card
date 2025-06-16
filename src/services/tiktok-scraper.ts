import puppeteer from 'puppeteer';
import { TikTokProfile, TikTokVideo } from '@/types/tiktok';
import fetch from 'node-fetch';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

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

// TikTok GraphQL API endpoint for 2025
const GRAPHQL_URL = 'https://www.tiktok.com/api/graphql';

// GraphQL queries
const USER_QUERY = `
  query UserInfo($username: String!) {
    user(username: $username) {
      id
      uniqueId
      nickname
      avatarLarger
      signature
      stats {
        followerCount
        followingCount
        heartCount
      }
    }
  }
`;

const VIDEOS_QUERY = `
  query UserVideos($userId: String!, $cursor: String) {
    user(id: $userId) {
      posts(first: 30, after: $cursor) {
        edges {
          node {
            id
            desc
            createTime
            video {
              cover
              playCount
              diggCount
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

async function fetchGraphQL(query: string, variables: any) {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.tiktok.com/',
        'Origin': 'https://www.tiktok.com',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return data.data;
  } catch (error) {
    console.error('GraphQL error:', error);
    throw error;
  }
}

export async function scrapeCreatorProfile(username: string): Promise<TikTokProfile> {
  const cacheKey = `profile:${username}`;
  const cached = getCached<TikTokProfile>(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchGraphQL(USER_QUERY, { username });

    if (!data.user) {
      throw new Error('Failed to fetch profile data');
    }

    const profile: TikTokProfile = {
      username: data.user.uniqueId,
      displayName: data.user.nickname,
      avatar: data.user.avatarLarger,
      bio: data.user.signature,
      followers: data.user.stats.followerCount,
      following: data.user.stats.followingCount,
      likes: data.user.stats.heartCount
    };

    setCache(cacheKey, profile);
    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Failed to fetch profile data');
  }
}

export async function scrapeCreatorVideos(username: string): Promise<TikTokVideo[]> {
  const cacheKey = `videos:${username}`;
  const cached = getCached<TikTokVideo[]>(cacheKey);
  if (cached) return cached;

  try {
    // First get the user's data
    const userData = await fetchGraphQL(USER_QUERY, { username });

    if (!userData.user) {
      throw new Error('User not found');
    }

    // Then get their videos
    const videosData = await fetchGraphQL(VIDEOS_QUERY, { 
      userId: userData.user.id,
      cursor: null
    });

    if (!videosData.user?.posts?.edges) {
      console.log('No videos found for user:', username);
      return [];
    }

    const videos: TikTokVideo[] = videosData.user.posts.edges.map((edge: any) => ({
      id: edge.node.id,
      thumbnail: edge.node.video.cover,
      views: edge.node.video.playCount,
      likes: edge.node.video.diggCount,
      description: edge.node.desc,
      createdAt: new Date(edge.node.createTime * 1000).toISOString()
    }));

    setCache(cacheKey, videos);
    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
} 