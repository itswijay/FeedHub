'use client'

import React from 'react'
import { MediaUpload, MediaFilter } from '@/components/molecules'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms'
import { cn } from '@/lib/utils'

interface UploadFormProps {
  onUpload?: (files: File[]) => void | Promise<void>
  multiple?: boolean
  className?: string
}

function UploadForm({ onUpload, multiple = true, className }: UploadFormProps) {
  const handleUpload = async (files: File[]) => {
    console.log('Uploading files:', files)
    await onUpload?.(files)
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle>Upload Media</CardTitle>
      </CardHeader>
      <CardContent>
        <MediaUpload
          onUpload={handleUpload}
          multiple={multiple}
          acceptTypes="image/*,video/*"
          maxSize={100 * 1024 * 1024} // 100MB
        />
      </CardContent>
    </Card>
  )
}

export { UploadForm }
