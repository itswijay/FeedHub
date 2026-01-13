'use client'

import React from 'react'
import { Button, Input } from '@/components/atoms'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaFilterProps {
  onSearch?: (query: string) => void
  onTypeFilter?: (type: string | null) => void
  onSortChange?: (sort: string) => void
  className?: string
}

function MediaFilter({
  onSearch,
  onTypeFilter,
  onSortChange,
  className,
}: MediaFilterProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedType, setSelectedType] = React.useState<string | null>(null)
  const [selectedSort, setSelectedSort] = React.useState('newest')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type)
    onTypeFilter?.(type)
  }

  const clearSearch = () => {
    setSearchQuery('')
    onSearch?.('')
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search media..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Type Filter */}
      <div className="flex gap-2">
        <Button
          variant={selectedType === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTypeFilter(null)}
        >
          All
        </Button>
        <Button
          variant={selectedType === 'image' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTypeFilter('image')}
        >
          Images
        </Button>
        <Button
          variant={selectedType === 'video' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTypeFilter('video')}
        >
          Videos
        </Button>
        <Button
          variant={selectedType === 'document' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTypeFilter('document')}
        >
          Documents
        </Button>
      </div>

      {/* Sort */}
      <select
        value={selectedSort}
        onChange={(e) => {
          setSelectedSort(e.target.value)
          onSortChange?.(e.target.value)
        }}
        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="name">Name (A-Z)</option>
        <option value="size">Size (Large to Small)</option>
      </select>
    </div>
  )
}

export { MediaFilter }
