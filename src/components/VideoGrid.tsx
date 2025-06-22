'use client';

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Heart, MessageCircle, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TikTokVideo } from '@/types';

interface VideoGridProps {
  videos: TikTokVideo[];
  columns?: 2 | 3 | 4;
  autoPlay?: boolean;
  showStats?: boolean;
  className?: string;
}

export default function VideoGrid({
  videos,
  columns = 3,
  autoPlay = false,
  showStats = true,
  className
}: VideoGridProps) {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set())
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set())
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const togglePlay = (videoId: string) => {
    const video = videoRefs.current[videoId]
    if (!video) return

    if (playingVideos.has(videoId)) {
      video.pause()
      setPlayingVideos(prev => {
        const newSet = new Set(prev)
        newSet.delete(videoId)
        return newSet
      })
    } else {
      // Pause all other videos first
      setPlayingVideos(new Set())
      Object.values(videoRefs.current).forEach(v => v?.pause())
      
      video.play()
      setPlayingVideos(new Set([videoId]))
    }
  }

  const toggleMute = (videoId: string) => {
    const video = videoRefs.current[videoId]
    if (!video) return

    video.muted = !video.muted
    setMutedVideos(prev => {
      const newSet = new Set(prev)
      if (video.muted) {
        newSet.add(videoId)
      } else {
        newSet.delete(videoId)
      }
      return newSet
    })
  }

  const handleVideoRef = (videoId: string, element: HTMLVideoElement | null) => {
    videoRefs.current[videoId] = element
  }

  const handleMouseEnter = (videoId: string) => {
    setHoveredVideo(videoId)
    if (autoPlay) {
      togglePlay(videoId)
    }
  }

  const handleMouseLeave = (videoId: string) => {
    setHoveredVideo(null)
    if (autoPlay && playingVideos.has(videoId)) {
      togglePlay(videoId)
    }
  }

  useEffect(() => {
    return () => {
      // Cleanup: pause all videos when component unmounts
      Object.values(videoRefs.current).forEach(video => video?.pause())
    }
  }, [])

  if (!videos.length) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        No videos found
      </div>
    );
  }

  return (
    <div className={cn(
      'grid gap-4 w-full',
      gridCols[columns],
      className
    )}>
      {videos.map((video) => (
        <div
          key={video.id}
          className="group relative bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          onMouseEnter={() => handleMouseEnter(video.id)}
          onMouseLeave={() => handleMouseLeave(video.id)}
        >
          {/* Video Container */}
          <div className="relative aspect-[9/16] bg-gray-900">
            <video
              ref={(el) => handleVideoRef(video.id, el)}
              src={video.videoUrl}
              poster={video.thumbnail}
              className="w-full h-full object-cover"
              loop
              muted={mutedVideos.has(video.id)}
              playsInline
            />
            
            {/* Overlay Controls */}
            <div className={cn(
              'absolute inset-0 bg-black/20 transition-opacity duration-300',
              hoveredVideo === video.id ? 'opacity-100' : 'opacity-0'
            )}>
              {/* Top Controls */}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => toggleMute(video.id)}
                  className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  {mutedVideos.has(video.id) ? (
                    <VolumeX size={16} />
                  ) : (
                    <Volume2 size={16} />
                  )}
                </button>
                <button className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                  <Maximize size={16} />
                </button>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => togglePlay(video.id)}
                  className="p-4 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  {playingVideos.has(video.id) ? (
                    <Pause size={24} />
                  ) : (
                    <Play size={24} />
                  )}
                </button>
              </div>

              {/* Bottom Stats */}
              {showStats && (
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center justify-between text-white text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart size={14} />
                        <span>{formatNumber(video.likes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        <span>{formatNumber(video.comments)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 size={14} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Duration Badge */}
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-black/70 text-white text-xs rounded">
                {video.duration}
              </span>
            </div>
          </div>

          {/* Video Info */}
          <div className="p-3 bg-white dark:bg-gray-800">
            <div className="flex items-start gap-2">
              <img
                src={video.creator.avatar}
                alt={video.creator.name}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {video.creator.name}
                </p>
                {showStats && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatNumber(video.views)} views
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 