/**
 * User profile API endpoints
 */

import { API } from './client'

export interface UserProfile {
  id: string
  email: string
  is_active: boolean
  is_superuser: boolean
  is_verified: boolean
}

export interface UpdateUserRequest {
  email?: string
  password?: string
}

export interface UpdateUserResponse {
  id: string
  email: string
  is_active: boolean
  is_superuser: boolean
  is_verified: boolean
}

export const usersAPI = {
  /**
   * Get current user profile
   */
  getProfile: async () => {
    return API.get<UserProfile>('/users/me')
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateUserRequest) => {
    return API.put<UpdateUserResponse>('/users/me', data)
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId: string) => {
    return API.get<UserProfile>(`/users/${userId}`)
  },
}
