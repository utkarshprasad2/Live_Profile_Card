"use client"

import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Eye, Heart, Share2, Calendar, Download } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface DataPoint {
  date: string
  value: number
  label: string
}

interface ChartData {
  followers: DataPoint[]
  views: DataPoint[]
  likes: DataPoint[]
  shares: DataPoint[]
  engagement: DataPoint[]
}

interface DataVisualizationProps {
  username?: string
}

export function DataVisualization({ username }: DataVisualizationProps) {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('followers')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data generation
  const generateMockData = (days: number): ChartData => {
    const data: ChartData = {
      followers: [],
      views: [],
      likes: [],
      shares: [],
      engagement: []
    }

    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      
      data.followers.push({
        date: dateStr,
        value: Math.floor(10000 + Math.random() * 5000 + i * 100),
        label: date.toLocaleDateString()
      })
      
      data.views.push({
        date: dateStr,
        value: Math.floor(50000 + Math.random() * 20000 + i * 500),
        label: date.toLocaleDateString()
      })
      
      data.likes.push({
        date: dateStr,
        value: Math.floor(1000 + Math.random() * 500 + i * 10),
        label: date.toLocaleDateString()
      })
      
      data.shares.push({
        date: dateStr,
        value: Math.floor(100 + Math.random() * 50 + i * 2),
        label: date.toLocaleDateString()
      })
      
      data.engagement.push({
        date: dateStr,
        value: Math.floor(5 + Math.random() * 3 + i * 0.1),
        label: date.toLocaleDateString()
      })
    }

    return data
  }

  const [chartData, setChartData] = useState<ChartData>(generateMockData(7))

  useEffect(() => {
    setIsLoading(true)
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    setTimeout(() => {
      setChartData(generateMockData(days))
      setIsLoading(false)
    }, 500)
  }, [timeRange])

  const getCurrentData = () => {
    const data = chartData[selectedMetric as keyof ChartData]
    return data || []
  }

  const getStats = () => {
    const data = getCurrentData()
    if (data.length === 0) return { current: 0, change: 0, trend: 'up' }

    const current = data[data.length - 1].value
    const previous = data[Math.max(0, data.length - 2)].value
    const change = ((current - previous) / previous) * 100

    return {
      current,
      change: Math.abs(change),
      trend: change >= 0 ? 'up' : 'down'
    }
  }

  const renderBarChart = () => {
    const data = getCurrentData()
    const maxValue = Math.max(...data.map(d => d.value))
    
    return (
      <div className="space-y-2">
        {data.map((point, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-16 text-xs text-muted-foreground">
              {point.label}
            </div>
            <div className="flex-1 bg-muted rounded-full h-6 relative">
              <div
                className="bg-primary h-6 rounded-full transition-all duration-300"
                style={{ width: `${(point.value / maxValue) * 100}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                {point.value.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderLineChart = () => {
    const data = getCurrentData()
    const maxValue = Math.max(...data.map(d => d.value))
    const minValue = Math.min(...data.map(d => d.value))
    const range = maxValue - minValue

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((point.value - minValue) / range) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="relative h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            points={points}
          />
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - ((point.value - minValue) / range) * 100
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="hsl(var(--primary))"
              />
            )
          })}
        </svg>
      </div>
    )
  }

  const metrics = [
    { key: 'followers', label: 'Followers', icon: Users, color: 'text-blue-500' },
    { key: 'views', label: 'Views', icon: Eye, color: 'text-green-500' },
    { key: 'likes', label: 'Likes', icon: Heart, color: 'text-red-500' },
    { key: 'shares', label: 'Shares', icon: Share2, color: 'text-purple-500' },
    { key: 'engagement', label: 'Engagement %', icon: TrendingUp, color: 'text-orange-500' }
  ]

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            {username ? `Data for @${username}` : 'Performance metrics and insights'}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const isSelected = selectedMetric === metric.key
          return (
            <Card
              key={metric.key}
              className={`cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedMetric(metric.key)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Current Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {metrics.find(m => m.key === selectedMetric)?.icon && 
              React.createElement(metrics.find(m => m.key === selectedMetric)!.icon, { className: "h-5 w-5" })
            }
            {metrics.find(m => m.key === selectedMetric)?.label}
          </CardTitle>
          <CardDescription>
            {timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'Last 90 days'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {stats.current.toLocaleString()}
                {selectedMetric === 'engagement' && '%'}
              </div>
              <div className="text-sm text-muted-foreground">Current</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                stats.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stats.trend === 'up' ? '+' : '-'}{stats.change.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Change</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.floor(stats.current / (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90)).toLocaleString()}
                {selectedMetric === 'engagement' && '%'}
              </div>
              <div className="text-sm text-muted-foreground">Daily Avg</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Bar Chart
            </CardTitle>
            <CardDescription>
              {selectedMetric} over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              renderBarChart()
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Line Chart
            </CardTitle>
            <CardDescription>
              Trend visualization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              renderLineChart()
            )}
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
          <CardDescription>
            Key performance indicators and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Top Performing Day</h4>
              <p className="text-sm text-muted-foreground">
                {(() => {
                  const data = getCurrentData()
                  const maxPoint = data.reduce((max, point) => 
                    point.value > max.value ? point : max
                  )
                  return `${maxPoint.label} with ${maxPoint.value.toLocaleString()} ${selectedMetric}`
                })()}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Growth Rate</h4>
              <p className="text-sm text-muted-foreground">
                {stats.trend === 'up' ? 'Positive' : 'Negative'} trend with {stats.change.toFixed(1)}% change
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Recommendation</h4>
              <p className="text-sm text-muted-foreground">
                {stats.trend === 'up' 
                  ? 'Continue with current strategy - it\'s working well!'
                  : 'Consider adjusting your content strategy to improve engagement'
                }
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Next Goal</h4>
              <p className="text-sm text-muted-foreground">
                Aim for {(stats.current * 1.1).toLocaleString()} {selectedMetric} in the next period
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 