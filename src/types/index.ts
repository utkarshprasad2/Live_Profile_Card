export interface TikTokCreator {
  username: string;
  displayName: string;
  profileImage: string;
  followers: number;
  likes: number;
  bio: string;
  isVerified: boolean;
}

export interface TikTokVideo {
  id: string;
  thumbnail: string;
  views: number;
  likes: number;
  description: string;
  createdAt: string;
}

export interface CreatorStats {
  followers: number;
  likes: number;
  videos: number;
}

export interface APIResponse<T> {
  data: T;
  status: number;
  message: string;
} 