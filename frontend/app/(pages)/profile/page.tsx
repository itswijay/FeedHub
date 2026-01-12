'use client'

import React from 'react'
import Image from 'next/image'
import { ProfileLayout } from '@/components/templates'
import { MediaGallery } from '@/components/organisms'
import { Card, CardContent, Avatar } from '@/components/atoms'

// Mock user data
const mockUser = {
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  name: 'Sarah Johnson',
  bio: 'Photography enthusiast | Travel lover ✨',
  mediaCount: 42,
  followers: 1523,
  following: 342,
}

const mockUserMedia = [
  {
    id: '1',
    thumbnail:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
    title: 'Beautiful Ocean Waves',
    uploadedAt: 'Jan 10, 2024',
    size: '2.4 MB',
    type: 'image' as const,
  },
  {
    id: '2',
    thumbnail:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    title: 'Mountain Peak Adventure',
    uploadedAt: 'Jan 8, 2024',
    size: '3.1 MB',
    type: 'image' as const,
  },
  {
    id: '3',
    thumbnail:
      'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=400&fit=crop',
    title: 'Sunset Photography',
    uploadedAt: 'Jan 5, 2024',
    size: '2.8 MB',
    type: 'image' as const,
  },
]

export default function ProfilePage() {
  const [userMedia] = React.useState(mockUserMedia)

  const handleDownload = (id: string) => {
    console.log('Download media:', id)
  }

  return (
    <ProfileLayout
      profileSection={
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Avatar className="w-24 h-24 mx-auto">
                <Image
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  width={96}
                  height={96}
                  className="w-full h-full rounded-full object-cover"
                />
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{mockUser.name}</h1>
                <p className="text-muted-foreground text-sm">{mockUser.bio}</p>
              </div>
              <div className="flex justify-center gap-6 py-4">
                <div className="text-center">
                  <p className="text-lg font-semibold">{mockUser.mediaCount}</p>
                  <p className="text-xs text-muted-foreground">Media</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{mockUser.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{mockUser.following}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      }
      feedSection={
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Gallery</h2>
            <p className="text-sm text-muted-foreground">
              {userMedia.length} media items
            </p>
          </div>
          <MediaGallery items={userMedia} onDownload={handleDownload} />
        </div>
      }
    />
  )
}
