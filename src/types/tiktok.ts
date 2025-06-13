export interface TikTokProfile {
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  likes: number;
}

export interface TikTokVideo {
  id: string;
  thumbnail: string;
  views: number;
  likes: number;
  description: string;
  createdAt: string;
} 