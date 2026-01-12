'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ProfileLayout } from '@/components/templates'
import { MediaGallery } from '@/components/organisms'
import { Card, CardContent, Avatar, Button } from '@/components/atoms'
import { usersAPI, postsAPI, Post } from '@/lib/api'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useToast } from '@/lib/contexts/ToastContext'
import { ProfileSkeletons } from '@/lib/components/Skeleton'

interface MediaItem {
  id: string
  thumbnail: string
  title: string
  uploadedAt?: string
  size?: string
  type?: 'image' | 'video' | 'document'
  postId?: string
}

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const { showToast } = useToast()
  const [userMedia, setUserMedia] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mediaCount, setMediaCount] = useState(0)

  // Fetch user's posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user || authLoading) return

      try {
        setIsLoading(true)
        setError(null)
        const response = await postsAPI.getFeed()

        if (response.success && response.data?.posts) {
          // Filter posts by current user
          const userPosts = response.data.posts.filter(
            (post: Post) => post.user_id === user.id
          )

          const items: MediaItem[] = userPosts.map((post: Post) => ({
            id: post.id,
            thumbnail: post.url,
            title: post.caption || 'Untitled',
            uploadedAt: new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            type: (post.file_type === 'video' ? 'video' : 'image') as
              | 'image'
              | 'video'
              | 'document',
            postId: post.id,
          }))

          setUserMedia(items)
          setMediaCount(items.length)
        } else {
          setError(response.error?.message || 'Failed to load user posts')
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred'
        setError(message)
        showToast(message, 'error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserPosts()
  }, [user, authLoading, showToast])

  const handleDownload = (id: string) => {
    showToast('Download feature coming soon', 'info')
  }

  const handleShare = (id: string) => {
    showToast('Share feature coming soon', 'info')
  }

  const handleDelete = (id: string) => {
    showToast('Delete feature available from feed', 'info')
  }

  if (authLoading) {
    return (
      <ProfileLayout
        profileSection={<ProfileSkeletons />}
        feedSection={<ProfileSkeletons />}
      />
    )
  }

  if (!user) {
    return (
      <ProfileLayout
        profileSection={
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">User not found</p>
            </CardContent>
          </Card>
        }
        feedSection={null}
      />
    )
  }

  return (
    <ProfileLayout
      profileSection={
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-linear-to-br from-primary to-primary/50 flex items-center justify-center text-white text-3xl font-bold">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.email}</h1>
                <p className="text-muted-foreground text-sm">
                  {user.is_verified ? '✓ Verified' : 'Email not verified'}
                </p>
              </div>
              <div className="flex justify-center gap-6 py-4">
                <div className="text-center">
                  <p className="text-lg font-semibold">{mediaCount}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      }
      feedSection={
        <div className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm">
              {error}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">My Posts</h2>
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Loading...' : `${mediaCount} posts`}
            </p>
          </div>
          {isLoading ? (
            <ProfileSkeletons />
          ) : (
            <MediaGallery
              items={userMedia}
              onDownload={handleDownload}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          )}
        </div>
      }
    />
  )
}
