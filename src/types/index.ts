export interface TikTokCreator {
  username: string;
  displayName: string;
  bio: string;
  followers: number;
  likes: number;
  isVerified: boolean;
  profileImage: string;
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

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
  message: string;
} 