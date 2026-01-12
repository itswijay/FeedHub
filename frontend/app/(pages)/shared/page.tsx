'use client'

import React from 'react'
import { FeedLayout } from '@/components/templates'
import { MediaGallery } from '@/components/organisms'
import { Input } from '@/components/atoms'
import { Search, X } from 'lucide-react'

// Mock shared media data
const mockSharedMedia = [
  {
    id: '1',
    thumbnail:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
    title: 'Ocean Waves - Shared by Sarah',
    uploadedAt: 'Jan 10, 2024',
    size: '2.4 MB',
    type: 'image' as const,
  },
  {
    id: '2',
    thumbnail:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    title: 'Mountain Peak - Shared by Mike',
    uploadedAt: 'Jan 8, 2024',
    size: '3.1 MB',
    type: 'image' as const,
  },
]

export default function SharedPage() {
  const [filteredItems, setFilteredItems] = React.useState(mockSharedMedia)
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query) {
      setFilteredItems(mockSharedMedia)
    } else {
      setFilteredItems(
        mockSharedMedia.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        )
      )
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setFilteredItems(mockSharedMedia)
  }

  const handleDownload = (id: string) => {
    console.log('Download shared media:', id)
  }

  return (
    <FeedLayout
      mainFeed={
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search shared media..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
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
          <div>
            <h1 className="text-2xl font-bold">Shared with Me</h1>
            <p className="text-muted-foreground">
              Media shared by other users ({filteredItems.length})
            </p>
          </div>
          <MediaGallery items={filteredItems} onDownload={handleDownload} />
        </div>
      }
    />
  )
}
