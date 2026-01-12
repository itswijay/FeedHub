'use client'

import React from 'react'
import { MainLayout } from '@/components/templates'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/atoms'
import { Download, Share2, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface MediaDetailsParams {
  params: {
    id: string
  }
}

export default function MediaDetailsPage({ params }: MediaDetailsParams) {
  const { id } = params

  // Mock data - in real app, fetch from API
  const media = {
    id,
    title: 'Beautiful Ocean Waves',
    description: 'A stunning view of the ocean at sunset',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    uploadedAt: 'Jan 10, 2024',
    size: '2.4 MB',
    type: 'image',
    sharedWith: [
      { id: 'user1', name: 'John Doe' },
      { id: 'user2', name: 'Jane Smith' },
    ],
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>

        {/* Image Viewer */}
        <Card>
          <CardContent className="p-0">
            <div className="w-full h-96 overflow-hidden rounded-t-lg bg-muted">
              <img
                src={media.image}
                alt={media.title}
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{media.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {media.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Uploaded</p>
                  <p className="font-semibold text-sm">{media.uploadedAt}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">File Size</p>
                  <p className="font-semibold text-sm">{media.size}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full gap-2">
                <Download className="size-4" />
                Download
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Share2 className="size-4" />
                Share
              </Button>
              <Button variant="destructive" className="w-full gap-2">
                <Trash2 className="size-4" />
                Delete
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Shared With */}
        {media.sharedWith.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shared With</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {media.sharedWith.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm"
                  >
                    <span>{user.name}</span>
                    <Button size="sm" variant="ghost">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
