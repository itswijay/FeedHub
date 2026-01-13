'use client'

import React from 'react'
import { MediaCard } from '@/components/molecules'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from '@/components/atoms'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaItem {
  id: string
  thumbnail: string
  title: string
  uploadedAt?: string
  size?: string
  type?: 'image' | 'video' | 'document'
}

interface MediaGalleryProps {
  items: MediaItem[]
  loading?: boolean
  onView?: (id: string) => void
  onDownload?: (id: string) => void
  onShare?: (id: string) => void
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  columns?: number
  className?: string
}

function MediaGallery({
  items,
  loading = false,
  onView,
  onDownload,
  onShare,
  onDelete,
  onEdit,
  columns = 4,
  className,
}: MediaGalleryProps) {
  if (loading) {
    return (
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted rounded-lg animate-pulse"
            />
          ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ImageIcon />
          </EmptyMedia>
          <EmptyTitle>No media yet</EmptyTitle>
          <EmptyDescription>
            Start by uploading your first image or video to your gallery.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>{/* Additional content can go here */}</EmptyContent>
      </Empty>
    )
  }

  return (
    <div
      className={cn('grid gap-4', className)}
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))` }}
    >
      {items.map((item) => (
        <MediaCard
          key={item.id}
          {...item}
          onView={() => onView?.(item.id)}
          onDownload={() => onDownload?.(item.id)}
          onShare={() => onShare?.(item.id)}
          onDelete={() => onDelete?.(item.id)}
          onEdit={() => onEdit?.(item.id)}
        />
      ))}
    </div>
  )
}

export { MediaGallery }
