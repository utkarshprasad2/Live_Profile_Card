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
  videoUrl: string;
  views: number;
  likes: number;
  comments: number;
  description: string;
  title: string;
  duration: string;
  createdAt: string;
  creator: {
    name: string;
    avatar: string;
  };
} 