"use client"

import React, { useState, useEffect } from 'react'
import { Settings, Plus, Calendar, Clock, Zap, Users, Globe, Shield, Edit3, Trash2, Copy, ExternalLink } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'

interface Profile {
  id: string
  name: string
  username: string
  platform: string
  avatar: string
  bio: string
  isActive: boolean
  isVerified: boolean
  followers: number
  following: number
  posts: number
  lastUpdated: Date
  settings: ProfileSettings
}

interface ProfileSettings {
  autoPost: boolean
  autoReply: boolean
  privacyLevel: 'public' | 'private' | 'friends'
  notifications: boolean
  analytics: boolean
  crossPosting: boolean
}

interface ScheduledPost {
  id: string
  profileId: string
  content: string
  media?: string[]
  scheduledTime: Date
  status: 'scheduled' | 'posted' | 'failed'
  platform: string
}

interface AutomationRule {
  id: string
  name: string
  type: 'auto_reply' | 'auto_like' | 'auto_follow' | 'content_rotation'
  isActive: boolean
  conditions: string[]
  actions: string[]
  schedule: string
}

interface AdvancedProfileManagementProps {
  userId?: string
}

export function AdvancedProfileManagement({ userId }: AdvancedProfileManagementProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([])
  const [activeTab, setActiveTab] = useState<'profiles' | 'scheduling' | 'automation' | 'analytics'>('profiles')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data generation
  useEffect(() => {
    const mockProfiles: Profile[] = [
      {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        platform: 'tiktok',
        avatar: '/default-avatar.svg',
        bio: 'Content creator and tech enthusiast',
        isActive: true,
        isVerified: true,
        followers: 125000,
        following: 850,
        posts: 342,
        lastUpdated: new Date(),
        settings: {
          autoPost: true,
          autoReply: false,
          privacyLevel: 'public',
          notifications: true,
          analytics: true,
          crossPosting: true
        }
      },
      {
        id: '2',
        name: 'Jane Smith',
        username: 'janesmith',
        platform: 'instagram',
        avatar: '/default-avatar.svg',
        bio: 'Lifestyle blogger and fitness coach',
        isActive: true,
        isVerified: false,
        followers: 89000,
        following: 1200,
        posts: 567,
        lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2),
        settings: {
          autoPost: false,
          autoReply: true,
          privacyLevel: 'friends',
          notifications: true,
          analytics: false,
          crossPosting: false
        }
      },
      {
        id: '3',
        name: 'Tech Guru',
        username: 'techguru',
        platform: 'youtube',
        avatar: '/default-avatar.svg',
        bio: 'Tech reviews and tutorials',
        isActive: false,
        isVerified: true,
        followers: 250000,
        following: 150,
        posts: 89,
        lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24),
        settings: {
          autoPost: true,
          autoReply: true,
          privacyLevel: 'public',
          notifications: true,
          analytics: true,
          crossPosting: true
        }
      }
    ]

    const mockScheduledPosts: ScheduledPost[] = [
      {
        id: '1',
        profileId: '1',
        content: 'Check out my latest tech review! 🔥 #tech #review #viral',
        scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 2),
        status: 'scheduled',
        platform: 'tiktok'
      },
      {
        id: '2',
        profileId: '2',
        content: 'Morning workout routine 💪 #fitness #motivation #healthy',
        scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 6),
        status: 'scheduled',
        platform: 'instagram'
      }
    ]

    const mockAutomationRules: AutomationRule[] = [
      {
        id: '1',
        name: 'Auto Reply to Comments',
        type: 'auto_reply',
        isActive: true,
        conditions: ['Comment contains question', 'Comment is positive'],
        actions: ['Reply with thank you message', 'Like the comment'],
        schedule: 'Always'
      },
      {
        id: '2',
        name: 'Content Rotation',
        type: 'content_rotation',
        isActive: true,
        conditions: ['Post is 24 hours old', 'Engagement is low'],
        actions: ['Repost with different caption', 'Add trending hashtags'],
        schedule: 'Daily at 9 AM'
      }
    ]

    setTimeout(() => {
      setProfiles(mockProfiles)
      setScheduledPosts(mockScheduledPosts)
      setAutomationRules(mockAutomationRules)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return <Globe className="h-5 w-5 text-black" />
      case 'instagram':
        return <Globe className="h-5 w-5 text-pink-500" />
      case 'youtube':
        return <Globe className="h-5 w-5 text-red-500" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: ScheduledPost['status']) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-500'
      case 'posted':
        return 'text-green-500'
      case 'failed':
        return 'text-red-500'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleString()
  }

  const toggleProfileStatus = (profileId: string) => {
    setProfiles(prev => 
      prev.map(profile => 
        profile.id === profileId 
          ? { ...profile, isActive: !profile.isActive }
          : profile
      )
    )
  }

  const updateProfileSettings = (profileId: string, settings: Partial<ProfileSettings>) => {
    setProfiles(prev => 
      prev.map(profile => 
        profile.id === profileId 
          ? { ...profile, settings: { ...profile.settings, ...settings } }
          : profile
      )
    )
  }

  const addScheduledPost = () => {
    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      profileId: profiles[0]?.id || '',
      content: '',
      scheduledTime: new Date(Date.now() + 1000 * 60 * 60),
      status: 'scheduled',
      platform: 'tiktok'
    }
    setScheduledPosts(prev => [...prev, newPost])
  }

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, isActive: !rule.isActive }
          : rule
      )
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Profile Management</h2>
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
          <Settings className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Advanced Profile Management</h2>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Profile
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {[
          { key: 'profiles', label: 'Profiles', icon: Users },
          { key: 'scheduling', label: 'Scheduling', icon: Calendar },
          { key: 'automation', label: 'Automation', icon: Zap },
          { key: 'analytics', label: 'Analytics', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.key as any)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Profiles Tab */}
      {activeTab === 'profiles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">@{profile.username}</span>
                          {profile.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(profile.platform)}
                      <Button
                        variant={profile.isActive ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleProfileStatus(profile.id)}
                      >
                        {profile.isActive ? 'Active' : 'Inactive'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">{profile.followers.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{profile.following.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Following</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{profile.posts.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Posts</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto Post</span>
                      <Button
                        variant={profile.settings.autoPost ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateProfileSettings(profile.id, { autoPost: !profile.settings.autoPost })}
                      >
                        {profile.settings.autoPost ? 'On' : 'Off'}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto Reply</span>
                      <Button
                        variant={profile.settings.autoReply ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateProfileSettings(profile.id, { autoReply: !profile.settings.autoReply })}
                      >
                        {profile.settings.autoReply ? 'On' : 'Off'}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Privacy</span>
                      <Select
                        value={profile.settings.privacyLevel}
                        onValueChange={(value) => updateProfileSettings(profile.id, { privacyLevel: value as any })}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="friends">Friends</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Scheduling Tab */}
      {activeTab === 'scheduling' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Scheduled Posts</h3>
            <Button onClick={addScheduledPost}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Post
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scheduledPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Scheduled Post</span>
                    </div>
                    <Badge variant="secondary" className={getStatusColor(post.status)}>
                      {post.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{post.content}</p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Platform: {post.platform}</span>
                    <span>{formatTime(post.scheduledTime)}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Automation Tab */}
      {activeTab === 'automation' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Automation Rules</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {automationRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    <Button
                      variant={rule.isActive ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleAutomationRule(rule.id)}
                    >
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </Button>
                  </div>
                  <CardDescription>Type: {rule.type.replace('_', ' ')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Conditions</h4>
                    <ul className="space-y-1">
                      {rule.conditions.map((condition, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="text-primary">•</span>
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Actions</h4>
                    <ul className="space-y-1">
                      {rule.actions.map((action, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="text-green-500">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Schedule: {rule.schedule}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Profile Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Total Followers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {profiles.reduce((acc, profile) => acc + profile.followers, 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Across all profiles</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Active Profiles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {profiles.filter(p => p.isActive).length}
                </div>
                <p className="text-sm text-muted-foreground">Out of {profiles.length} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Scheduled Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {scheduledPosts.filter(p => p.status === 'scheduled').length}
                </div>
                <p className="text-sm text-muted-foreground">Pending posts</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
} 