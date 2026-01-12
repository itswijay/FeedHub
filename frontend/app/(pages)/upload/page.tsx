'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/templates'
import { UploadForm } from '@/components/organisms'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atoms'
import { postsAPI } from '@/lib/api'

export default function UploadPage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleUpload = async (files: File[]) => {
    setError(null)
    setSuccess(false)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Upload files sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const response = await postsAPI.uploadMedia(
          file,
          `Uploaded: ${file.name}`
        )

        if (!response.success) {
          setError(response.error?.message || 'Upload failed')
          break
        }

        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100))
      }

      if (files.length > 0 && !error) {
        setSuccess(true)
        // Redirect to feed after successful upload
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during upload'
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto p-6">
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-800 p-4 rounded-md text-sm mb-6">
            ✓ Upload successful! Redirecting to feed...
          </div>
        )}

        <UploadForm
          onUpload={handleUpload}
          multiple={true}
          disabled={isUploading}
        />

        {isUploading && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Uploading files...</p>
              <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Supported Formats</CardTitle>
              <CardDescription>Upload any image or video</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>
                <p className="font-semibold">Images:</p>
                <p className="text-muted-foreground">JPG, PNG, GIF, WebP</p>
              </div>
              <div>
                <p className="font-semibold">Videos:</p>
                <p className="text-muted-foreground">MP4, WebM, MOV</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">File Limits</CardTitle>
              <CardDescription>Maximum file sizes</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>
                <p className="font-semibold">Per file:</p>
                <p className="text-muted-foreground">100 MB</p>
              </div>
              <div>
                <p className="font-semibold">Storage:</p>
                <p className="text-muted-foreground">5 GB total</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
