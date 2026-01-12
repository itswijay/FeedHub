'use client'

import React from 'react'
import Image from 'next/image'
import { Card } from '@/components/atoms'
import { Download, Share2, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/atoms'
import { cn } from '@/lib/utils'

interface MediaCardProps {
  id: string
  thumbnail: string
  title: string
  uploadedAt?: string
  size?: string
  type?: 'image' | 'video' | 'document'
  onView?: () => void
  onDownload?: () => void
  onShare?: () => void
  onDelete?: () => void
  className?: string
}

function MediaCard({
  id,
  thumbnail,
  title,
  uploadedAt,
  size,
  type = 'image',
  onView,
  onDownload,
  onShare,
  onDelete,
  className,
}: MediaCardProps) {
  const [showActions, setShowActions] = React.useState(false)

  return (
    <Card
      className={cn(
        'overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group',
        className
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />

        {/* Type Badge */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {type}
        </div>

        {/* Actions Overlay */}
        {showActions && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 hover:bg-white/40"
              onClick={onView}
            >
              <Eye className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 hover:bg-white/40"
              onClick={onDownload}
            >
              <Download className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 hover:bg-white/40"
              onClick={onShare}
            >
              <Share2 className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 hover:bg-white/40"
              onClick={onDelete}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate" title={title}>
          {title}
        </h3>
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          {uploadedAt && <span>{uploadedAt}</span>}
          {size && <span>{size}</span>}
        </div>
      </div>
    </Card>
  )
}

export { MediaCard }
