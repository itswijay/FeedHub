'use client'

import React from 'react'
import { MediaFilter } from '@/components/molecules'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms'
import { cn } from '@/lib/utils'

interface MediaManagerProps {
  onSearch?: (query: string) => void
  onTypeFilter?: (type: string | null) => void
  onSortChange?: (sort: string) => void
  className?: string
}

function MediaManager({
  onSearch,
  onTypeFilter,
  onSortChange,
  className,
}: MediaManagerProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle>Filter & Search</CardTitle>
      </CardHeader>
      <CardContent>
        <MediaFilter
          onSearch={onSearch}
          onTypeFilter={onTypeFilter}
          onSortChange={onSortChange}
        />
      </CardContent>
    </Card>
  )
}

export { MediaManager }
