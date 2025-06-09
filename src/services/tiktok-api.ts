import axios from 'axios';
import { TikTokCreator, TikTokVideo, APIResponse } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
const API_HOST = 'tiktok-profile-data.p.rapidapi.com';

const tiktokApi = axios.create({
  baseURL: 'https://tiktok-profile-data.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': API_HOST,
  },
});

export async function getCreatorProfile(username: string): Promise<APIResponse<TikTokCreator>> {
  try {
    const response = await tiktokApi.get(`/profile/${username}`);
    return {
      data: response.data,
      status: response.status,
      message: 'Success',
    };
  } catch (error) {
    throw new Error('Failed to fetch creator profile');
  }
}

export async function getCreatorVideos(username: string): Promise<APIResponse<TikTokVideo[]>> {
  try {
    const response = await tiktokApi.get(`/videos/${username}`);
    return {
      data: response.data,
      status: response.status,
      message: 'Success',
    };
  } catch (error) {
    throw new Error('Failed to fetch creator videos');
  }
}

export async function getCreatorStats(username: string): Promise<APIResponse<TikTokCreator>> {
  try {
    const response = await tiktokApi.get(`/stats/${username}`);
    return {
      data: response.data,
      status: response.status,
      message: 'Success',
    };
  } catch (error) {
    throw new Error('Failed to fetch creator stats');
  }
} 