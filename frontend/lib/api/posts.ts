/**
 * Posts/Media API endpoints
 */

import { API } from './client'

export interface Post {
  id: string
  user_id: string
  caption: string
  url: string
  file_type: 'image' | 'video'
  file_name: string
  created_at: string
  is_owner: boolean
  email: string
}

export interface FeedResponse {
  posts: Post[]
}

export interface UploadResponse {
  id: string
  user_id: string
  caption: string
  url: string
  file_type: 'image' | 'video'
  file_name: string
  created_at: string
}

export interface DeleteResponse {
  success: boolean
  message: string
}

export const postsAPI = {
  /**
   * Get all posts from the feed
   */
  getFeed: async () => {
    return API.get<FeedResponse>('/feed')
  },

  /**
   * Upload a media file (image or video)
   * @param file - The media file to upload
   * @param caption - Optional caption for the post
   */
  uploadMedia: async (file: File, caption: string = '') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('caption', caption)

    return API.postForm<UploadResponse>('/upload', formData)
  },

  /**
   * Delete a post by ID
   * @param postId - UUID of the post to delete
   */
  deletePost: async (postId: string) => {
    return API.delete<DeleteResponse>(`/posts/${postId}`)
  },

  /**
   * Get a single post by ID (if endpoint exists)
   */
  getPost: async (postId: string) => {
    return API.get<Post>(`/posts/${postId}`)
  },
}
