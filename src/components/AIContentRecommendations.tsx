"use client"

import React, { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Clock, Target, Zap, Lightbulb, BookOpen, Users } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

interface ContentRecommendation {
  id: string
  type: 'trending' | 'personalized' | 'timing' | 'audience'
  title: string
  description: string
  confidence: number
  category: string
  tags: string[]
  estimatedEngagement: number
  bestTimeToPost?: string
  audienceInsights?: string[]
  contentIdeas?: string[]
}

interface AIContentRecommendationsProps {
  username?: string
  userInterests?: string[]
  currentMetrics?: {
    followers: number
    avgEngagement: number
    topCategories: string[]
  }
}

export function AIContentRecommendations({ 
  username, 
  userInterests = [], 
  currentMetrics 
}: AIContentRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'confidence' | 'engagement'>('confidence')

  // Mock AI recommendations
  const generateRecommendations = (): ContentRecommendation[] => {
    const baseRecommendations: ContentRecommendation[] = [
      {
        id: '1',
        type: 'trending',
        title: 'Dance Challenge Content',
        description: 'Dance challenges are trending with 2.3M+ views. Create content around popular songs like "Vampire" by Olivia Rodrigo.',
        confidence: 95,
        category: 'entertainment',
        tags: ['dance', 'trending', 'music', 'challenge'],
        estimatedEngagement: 8.5,
        bestTimeToPost: '7-9 PM EST',
        audienceInsights: ['18-24 age group most active', 'Weekend posts perform 40% better'],
        contentIdeas: [
          'Learn the trending dance moves',
          'Create a unique variation',
          'Collaborate with other creators'
        ]
      },
      {
        id: '2',
        type: 'personalized',
        title: 'Educational Tech Tips',
        description: 'Based on your audience\'s interest in technology, create educational content about the latest tech trends.',
        confidence: 88,
        category: 'education',
        tags: ['tech', 'education', 'tips', 'tutorial'],
        estimatedEngagement: 6.2,
        bestTimeToPost: '2-4 PM EST',
        audienceInsights: ['Tech-savvy audience', 'Prefers detailed explanations'],
        contentIdeas: [
          '5-minute tech tutorials',
          'Product reviews and comparisons',
          'Behind-the-scenes tech setup'
        ]
      },
      {
        id: '3',
        type: 'timing',
        title: 'Morning Motivation Series',
        description: 'Your audience is most active in the morning. Start a daily motivation series to boost engagement.',
        confidence: 82,
        category: 'lifestyle',
        tags: ['motivation', 'morning', 'daily', 'inspiration'],
        estimatedEngagement: 7.1,
        bestTimeToPost: '6-8 AM EST',
        audienceInsights: ['Early risers', 'Self-improvement focused'],
        contentIdeas: [
          'Daily affirmations',
          'Morning routine tips',
          'Goal-setting content'
        ]
      },
      {
        id: '4',
        type: 'audience',
        title: 'Behind-the-Scenes Content',
        description: 'Your audience loves authentic content. Share behind-the-scenes moments to increase connection.',
        confidence: 90,
        category: 'lifestyle',
        tags: ['authentic', 'behind-scenes', 'personal', 'vlog'],
        estimatedEngagement: 9.3,
        bestTimeToPost: '5-7 PM EST',
        audienceInsights: ['Values authenticity', 'Wants to know the real you'],
        contentIdeas: [
          'Day-in-the-life vlogs',
          'Work process reveals',
          'Personal story sharing'
        ]
      },
      {
        id: '5',
        type: 'trending',
        title: 'Comedy Sketches',
        description: 'Comedy content is performing exceptionally well. Create relatable humor based on current trends.',
        confidence: 87,
        category: 'entertainment',
        tags: ['comedy', 'humor', 'relatable', 'trending'],
        estimatedEngagement: 8.8,
        bestTimeToPost: '8-10 PM EST',
        audienceInsights: ['Humor-loving audience', 'Prefers short-form content'],
        contentIdeas: [
          'Relatable situation comedy',
          'Trending meme reactions',
          'Character-based sketches'
        ]
      },
      {
        id: '6',
        type: 'personalized',
        title: 'Fitness Journey Updates',
        description: 'Your fitness content resonates well. Continue sharing your journey with more detailed progress updates.',
        confidence: 85,
        category: 'fitness',
        tags: ['fitness', 'journey', 'progress', 'motivation'],
        estimatedEngagement: 7.5,
        bestTimeToPost: '6-8 AM EST',
        audienceInsights: ['Fitness enthusiasts', 'Progress tracking interest'],
        contentIdeas: [
          'Weekly progress check-ins',
          'Workout routine sharing',
          'Nutrition tips and meals'
        ]
      }
    ]

    return baseRecommendations
  }

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setRecommendations(generateRecommendations())
      setIsLoading(false)
    }, 1000)
  }, [])

  const getTypeIcon = (type: ContentRecommendation['type']) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="h-5 w-5 text-orange-500" />
      case 'personalized':
        return <Target className="h-5 w-5 text-blue-500" />
      case 'timing':
        return <Clock className="h-5 w-5 text-green-500" />
      case 'audience':
        return <Users className="h-5 w-5 text-purple-500" />
    }
  }

  const getTypeLabel = (type: ContentRecommendation['type']) => {
    switch (type) {
      case 'trending':
        return 'Trending'
      case 'personalized':
        return 'Personalized'
      case 'timing':
        return 'Optimal Timing'
      case 'audience':
        return 'Audience Insight'
    }
  }

  const filteredRecommendations = recommendations.filter(rec => 
    selectedCategory === 'all' || rec.category === selectedCategory
  )

  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    if (sortBy === 'confidence') {
      return b.confidence - a.confidence
    }
    return b.estimatedEngagement - a.estimatedEngagement
  })

  const categories = ['all', 'entertainment', 'education', 'lifestyle', 'fitness', 'business']

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">AI Content Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                  <div className="h-3 bg-muted rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">AI Content Recommendations</h2>
            <p className="text-muted-foreground">
              {username ? `Personalized suggestions for @${username}` : 'AI-powered content ideas and insights'}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Zap className="h-4 w-4 mr-2" />
          Generate New Ideas
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'confidence' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('confidence')}
          >
            Sort by Confidence
          </Button>
          <Button
            variant={sortBy === 'engagement' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('engagement')}
          >
            Sort by Engagement
          </Button>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRecommendations.map((recommendation) => (
          <Card key={recommendation.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(recommendation.type)}
                  <Badge variant="secondary" className="text-xs">
                    {getTypeLabel(recommendation.type)}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {recommendation.confidence}%
                  </div>
                  <div className="text-xs text-muted-foreground">Confidence</div>
                </div>
              </div>
              <CardTitle className="text-lg">{recommendation.title}</CardTitle>
              <CardDescription>{recommendation.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {recommendation.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Engagement Estimate */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Est. Engagement</span>
                </div>
                <span className="text-lg font-bold text-green-500">
                  {recommendation.estimatedEngagement}%
                </span>
              </div>

              {/* Best Time to Post */}
              {recommendation.bestTimeToPost && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Best time: {recommendation.bestTimeToPost}</span>
                </div>
              )}

              {/* Content Ideas */}
              {recommendation.contentIdeas && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Content Ideas</span>
                  </div>
                  <ul className="space-y-1">
                    {recommendation.contentIdeas.slice(0, 2).map((idea, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {idea}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Audience Insights */}
              {recommendation.audienceInsights && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Audience Insights</span>
                  </div>
                  <ul className="space-y-1">
                    {recommendation.audienceInsights.slice(0, 2).map((insight, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendation Summary</CardTitle>
          <CardDescription>
            Overview of your content opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {recommendations.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Recommendations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {Math.round(recommendations.reduce((acc, rec) => acc + rec.confidence, 0) / recommendations.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {Math.round(recommendations.reduce((acc, rec) => acc + rec.estimatedEngagement, 0) / recommendations.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {new Set(recommendations.map(rec => rec.category)).size}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 