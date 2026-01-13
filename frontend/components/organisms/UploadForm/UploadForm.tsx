'use client'

import React, { useState } from 'react'
import { MediaUpload } from '@/components/molecules'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms'
import { Button, Input, Label } from '@/components/atoms'
import { cn } from '@/lib/utils'

interface FileWithCaption {
  file: File
  caption: string
}

interface UploadFormProps {
  onUpload?: (files: FileWithCaption[]) => void | Promise<void>
  multiple?: boolean
  disabled?: boolean
  className?: string
}

function UploadForm({
  onUpload,
  multiple = true,
  disabled = false,
  className,
}: UploadFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithCaption[]>([])
  const [showCaptionForm, setShowCaptionForm] = useState(false)

  const handleFilesSelected = async (files: File[]) => {
    // Create FileWithCaption objects with empty captions
    const filesWithCaptions = files.map((file) => ({
      file,
      caption: '',
    }))
    setSelectedFiles(filesWithCaptions)
    setShowCaptionForm(true)
  }

  const updateCaption = (index: number, caption: string) => {
    const updated = [...selectedFiles]
    updated[index].caption = caption
    setSelectedFiles(updated)
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    await onUpload?.(selectedFiles)
    // Reset after upload
    setSelectedFiles([])
    setShowCaptionForm(false)
  }

  const handleCancel = () => {
    setSelectedFiles([])
    setShowCaptionForm(false)
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle>Upload Media</CardTitle>
      </CardHeader>
      <CardContent>
        {!showCaptionForm ? (
          <MediaUpload
            onUpload={handleFilesSelected}
            multiple={multiple}
            disabled={disabled}
            acceptTypes="image/*,video/*"
            maxSize={100 * 1024 * 1024} // 100MB
          />
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 space-y-4 max-h-96 overflow-y-auto">
              {selectedFiles.map((item, index) => (
                <div
                  key={index}
                  className="border rounded p-3 space-y-2 bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      File {index + 1}: {item.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div>
                    <Label htmlFor={`caption-${index}`} className="text-sm">
                      Caption
                    </Label>
                    <Input
                      id={`caption-${index}`}
                      placeholder="Add a caption (optional)"
                      value={item.caption}
                      onChange={(e) => updateCaption(index, e.target.value)}
                      disabled={disabled}
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={disabled}>
                Upload {selectedFiles.length} File
                {selectedFiles.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { UploadForm }
