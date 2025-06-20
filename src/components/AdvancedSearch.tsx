"use client"

import { useState, useEffect } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'

interface SearchFilters {
  query: string
  platform: string
  category: string
  followers: string
  verified: boolean
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  onClear: () => void
}

export function AdvancedSearch({ onSearch, onClear }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    platform: 'all',
    category: 'all',
    followers: 'all',
    verified: false
  })

  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'twitter', label: 'Twitter' }
  ]

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'education', label: 'Education' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'business', label: 'Business' }
  ]

  const followerRanges = [
    { value: 'all', label: 'All Followers' },
    { value: '1k-10k', label: '1K - 10K' },
    { value: '10k-100k', label: '10K - 100K' },
    { value: '100k-1m', label: '100K - 1M' },
    { value: '1m+', label: '1M+' }
  ]

  const handleFilterChange = (key: keyof SearchFilters, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateActiveFilters(newFilters)
  }

  const updateActiveFilters = (currentFilters: SearchFilters) => {
    const active: string[] = []
    
    if (currentFilters.query) active.push(`Search: ${currentFilters.query}`)
    if (currentFilters.platform !== 'all') {
      const platform = platforms.find(p => p.value === currentFilters.platform)
      if (platform) active.push(platform.label)
    }
    if (currentFilters.category !== 'all') {
      const category = categories.find(c => c.value === currentFilters.category)
      if (category) active.push(category.label)
    }
    if (currentFilters.followers !== 'all') {
      const range = followerRanges.find(r => r.value === currentFilters.followers)
      if (range) active.push(range.label)
    }
    if (currentFilters.verified) active.push('Verified Only')

    setActiveFilters(active)
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleClear = () => {
    const clearedFilters = {
      query: '',
      platform: 'all',
      category: 'all',
      followers: 'all',
      verified: false
    }
    setFilters(clearedFilters)
    setActiveFilters([])
    onClear()
  }

  const removeFilter = (filterToRemove: string) => {
    const newActiveFilters = activeFilters.filter(f => f !== filterToRemove)
    setActiveFilters(newActiveFilters)
    
    // Update filters state based on removed filter
    const newFilters = { ...filters }
    
    if (filterToRemove.startsWith('Search:')) {
      newFilters.query = ''
    } else if (filterToRemove.includes('Platform')) {
      newFilters.platform = 'all'
    } else if (filterToRemove.includes('Category')) {
      newFilters.category = 'all'
    } else if (filterToRemove.includes('Followers')) {
      newFilters.followers = 'all'
    } else if (filterToRemove === 'Verified Only') {
      newFilters.verified = false
    }
    
    setFilters(newFilters)
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search profiles, usernames, or content..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button onClick={handleSearch}>
          Search
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter(filter)}
              />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear All
          </Button>
        </div>
      )}

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid gap-4 p-4 border rounded-lg bg-muted/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <Select value={filters.platform} onValueChange={(value) => handleFilterChange('platform', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Followers</label>
              <Select value={filters.followers} onValueChange={(value) => handleFilterChange('followers', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {followerRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="verified"
              checked={filters.verified}
              onChange={(e) => handleFilterChange('verified', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="verified" className="text-sm font-medium">
              Verified accounts only
            </label>
          </div>
        </div>
      )}
    </div>
  )
} 