'use client'

import React from 'react'
import { FeedLayout } from '@/components/templates'
import { MediaGallery } from '@/components/organisms'
import { MediaFilter } from '@/components/molecules'

// Mock media data
const mockMediaItems = [
  {
    id: '1',
    thumbnail:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
    title: 'Beautiful Ocean Waves',
    uploadedAt: 'Jan 10, 2024',
    size: '2.4 MB',
    type: 'image' as const,
  },
  {
    id: '2',
    thumbnail:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    title: 'Mountain Peak Adventure',
    uploadedAt: 'Jan 8, 2024',
    size: '3.1 MB',
    type: 'image' as const,
  },
  {
    id: '3',
    thumbnail:
      'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=400&fit=crop',
    title: 'Sunset Photography',
    uploadedAt: 'Jan 5, 2024',
    size: '2.8 MB',
    type: 'image' as const,
  },
  {
    id: '4',
    thumbnail:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    title: 'Forest Trail Video',
    uploadedAt: 'Jan 1, 2024',
    size: '45.2 MB',
    type: 'video' as const,
  },
]

export default function DashboardPage() {
  const [mediaItems, setMediaItems] = React.useState(mockMediaItems)
  const [filteredItems, setFilteredItems] = React.useState(mockMediaItems)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedType, setSelectedType] = React.useState<string | null>(null)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterMedia(query, selectedType)
  }

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type)
    filterMedia(searchQuery, type)
  }

  const filterMedia = (query: string, type: string | null) => {
    let filtered = mediaItems

    if (query) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    }

    if (type) {
      filtered = filtered.filter((item) => item.type === type)
    }

    setFilteredItems(filtered)
  }

  const handleView = (id: string) => {
    console.log('View media:', id)
    // TODO: Navigate to media details page
  }

  const handleDownload = (id: string) => {
    console.log('Download media:', id)
    // TODO: Implement download
  }

  const handleShare = (id: string) => {
    console.log('Share media:', id)
    // TODO: Open share dialog
  }

  const handleDelete = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id))
    setFilteredItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSortChange = (sort: string) => {
    console.log('Sort by:', sort)
    // TODO: Implement sorting
  }

  return (
    <FeedLayout
      mainFeed={
        <div className="space-y-6">
          <MediaFilter
            onSearch={handleSearch}
            onTypeFilter={handleTypeFilter}
            onSortChange={handleSortChange}
          />
          <div>
            <h1 className="text-2xl font-bold">My Gallery</h1>
            <p className="text-muted-foreground">
              {filteredItems.length} media files
            </p>
          </div>
          <MediaGallery
            items={filteredItems}
            onView={handleView}
            onDownload={handleDownload}
            onShare={handleShare}
            onDelete={handleDelete}
          />
        </div>
      }
    />
  )
}
