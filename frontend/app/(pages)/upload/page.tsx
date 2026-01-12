'use client'

import React from 'react'
import { MainLayout } from '@/components/templates'
import { UploadForm } from '@/components/organisms'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atoms'

export default function UploadPage() {
  const handleUpload = async (files: File[]) => {
    console.log('Files to upload:', files)
    // TODO: Send to backend API
    alert(`Uploading ${files.length} file(s)...`)
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto p-6">
        <UploadForm onUpload={handleUpload} multiple={true} />

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
