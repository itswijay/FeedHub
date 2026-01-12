'use client'

import React from 'react'
import { Card, Button } from '@/components/atoms'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaUploadProps {
  onUpload?: (files: File[]) => void | Promise<void>
  multiple?: boolean
  disabled?: boolean
  acceptTypes?: string
  maxSize?: number
  className?: string
}

function MediaUpload({
  onUpload,
  multiple = true,
  disabled = false,
  acceptTypes = 'image/*,video/*',
  maxSize = 50 * 1024 * 1024, // 50MB
  className,
}: MediaUploadProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => file.size <= maxSize)
    setSelectedFiles((prev) =>
      multiple ? [...prev, ...validFiles] : validFiles.slice(0, 1)
    )
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      await onUpload?.(selectedFiles)
      setSelectedFiles([])
    }
  }

  return (
    <Card className={cn('p-6', className)}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25'
        )}
      >
        <Upload className="size-8 mx-auto mb-3 text-muted-foreground" />
        <h3 className="font-semibold mb-1">Drag files here to upload</h3>
        <p className="text-sm text-muted-foreground mb-4">or click to browse</p>

        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={acceptTypes}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          Select Files
        </Button>
      </div>

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-sm">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm"
            >
              <span className="truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                disabled={disabled}
                className="text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}

          <Button
            onClick={handleUpload}
            disabled={disabled}
            className="w-full mt-4"
          >
            Upload {selectedFiles.length} File
            {selectedFiles.length !== 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </Card>
  )
}

export { MediaUpload }
