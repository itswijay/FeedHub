'use client'

import React, { useEffect, useState } from 'react'
import { FeedLayout } from '@/components/templates'
import { MediaGallery } from '@/components/organisms'
import { MediaFilter } from '@/components/molecules'
import { ConfirmDialog } from '@/lib/components/ConfirmDialog'
import { postsAPI, Post } from '@/lib/api'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useToast } from '@/lib/contexts/ToastContext'

interface MediaItem {
  id: string
  thumbnail: string
  title: string
  uploadedAt?: string
  size?: string
  type?: 'image' | 'video' | 'document'
  postId?: string
  createdAt?: string // Raw ISO date for sorting
}

export default function DashboardPage() {
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [mediaItems, setMediaItems] = React.useState<MediaItem[]>([])
  const [filteredItems, setFilteredItems] = React.useState<MediaItem[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedType, setSelectedType] = React.useState<string | null>(null)
  const [sortBy, setSortBy] = React.useState<string>('newest')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    postId: string
  }>({
    isOpen: false,
    postId: '',
  })
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch feed data on mount
  useEffect(() => {
    const fetchFeed = async () => {
      if (!isAuthenticated) return

      try {
        setIsLoading(true)
        setError(null)
        const response = await postsAPI.getFeed()

        if (response.success && response.data?.posts) {
          const posts = response.data.posts
          const items: MediaItem[] = posts.map((post: Post) => ({
            id: post.id,
            thumbnail: post.url,
            title: post.caption || 'Untitled',
            uploadedAt: new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            createdAt: post.created_at,
            type: (post.file_type === 'video' ? 'video' : 'image') as
              | 'image'
              | 'video'
              | 'document',
            postId: post.id,
          }))
          setMediaItems(items)
          // Apply initial sort (newest first)
          const sorted = [...items].sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          )
          setFilteredItems(sorted)
        } else {
          setError(response.error?.message || 'Failed to load feed')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeed()
  }, [isAuthenticated])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterMedia(query, selectedType, sortBy)
  }

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type)
    filterMedia(searchQuery, type, sortBy)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    filterMedia(searchQuery, selectedType, sort)
  }

  const filterMedia = (query: string, type: string | null, sort: string) => {
    let filtered = [...mediaItems]

    // Apply search filter by caption
    if (query) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Apply type filter
    if (type) {
      filtered = filtered.filter((item) => item.type === type)
    }

    // Apply sorting
    switch (sort) {
      case 'oldest':
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
        )
        break
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'size':
        // Sort by title length as a proxy since size data isn't available from API
        filtered.sort((a, b) => b.title.length - a.title.length)
        break
      case 'newest':
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        break
    }

    setFilteredItems(filtered)
  }

  const handleView = (id: string) => {
    // Find the media item to get the URL
    const item = mediaItems.find((m) => m.id === id)
    if (item) {
      // Open in a new window/tab
      window.open(item.thumbnail, '_blank')
    }
  }

  const handleDownload = async (id: string) => {
    // Find the media item to get the URL and filename
    const post = mediaItems.find((m) => m.id === id)
    if (post && post.thumbnail) {
      try {
        // Fetch the image as a blob
        const response = await fetch(post.thumbnail)
        const blob = await response.blob()

        // Create a blob URL and download
        const blobUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = post.title || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Clean up the blob URL
        window.URL.revokeObjectURL(blobUrl)
        showToast('Download started', 'success')
      } catch (err) {
        showToast('Failed to download file', 'error')
        console.error('Download error:', err)
      }
    }
  }

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, postId: id })
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      const response = await postsAPI.deletePost(deleteConfirm.postId)

      if (response.success) {
        setMediaItems((prev) =>
          prev.filter((item) => item.id !== deleteConfirm.postId)
        )
        setFilteredItems((prev) =>
          prev.filter((item) => item.id !== deleteConfirm.postId)
        )
        setDeleteConfirm({ isOpen: false, postId: '' })
        showToast('Post deleted successfully', 'success')
      } else {
        setError(response.error?.message || 'Failed to delete post')
        showToast(response.error?.message || 'Failed to delete post', 'error')
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An error occurred during deletion'
      setError(message)
      showToast(message, 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <FeedLayout
        mainFeed={
          <div className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm">
                {error}
              </div>
            )}
            <MediaFilter
              onSearch={handleSearch}
              onTypeFilter={handleTypeFilter}
              onSortChange={handleSortChange}
            />
            <div>
              <h1 className="text-2xl font-bold">Feed</h1>
              <p className="text-muted-foreground">
                {isLoading ? 'Loading...' : `${filteredItems.length} posts`}
              </p>
            </div>
            <MediaGallery
              items={filteredItems}
              loading={isLoading}
              onView={handleView}
              onDownload={handleDownload}
              onDelete={handleDeleteClick}
            />
          </div>
        }
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, postId: '' })}
      />
    </>
  )
}
