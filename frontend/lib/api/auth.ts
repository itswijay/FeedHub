/**
 * Authentication API endpoints
 */

import { API } from './client'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface RegisterResponse {
  id: string
  email: string
  is_active: boolean
  is_superuser: boolean
  is_verified: boolean
}

export interface UserData {
  id: string
  email: string
  is_active: boolean
  is_superuser: boolean
  is_verified: boolean
}

export const authAPI = {
  /**
   * Login with email and password
   * Returns JWT token
   */
  login: async (credentials: LoginRequest) => {
    // FastAPI-Users expects form data for login
    const formData = new FormData()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    const response = await fetch('http://localhost:8000/auth/jwt/login', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    if (response.ok) {
      const data: LoginResponse = await response.json()
      API.setToken(data.access_token)
      return {
        success: true,
        data,
      }
    }

    const error = await response.json()
    return {
      success: false,
      error: {
        status: response.status,
        message: error.detail || 'Login failed',
      },
    }
  },

  /**
   * Register a new user
   */
  register: async (credentials: RegisterRequest) => {
    return API.post<RegisterResponse>('/auth/register', credentials, {
      includeAuth: false,
    })
  },

  /**
   * Get current user information
   */
  getCurrentUser: async () => {
    return API.get<UserData>('/users/me')
  },

  /**
   * Logout (clear token)
   */
  logout: () => {
    API.clearToken()
    return {
      success: true,
    }
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string) => {
    return API.post<{ message: string }>(
      '/auth/forgot-password',
      { email },
      {
        includeAuth: false,
      }
    )
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, password: string) => {
    return API.post<{ message: string }>(
      '/auth/reset-password',
      { token, password },
      {
        includeAuth: false,
      }
    )
  },

  /**
   * Check if token is still valid
   */
  isAuthenticated: () => {
    const token = API.getToken()
    return !!token
  },
}
