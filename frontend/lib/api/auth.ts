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
   * Sets HTTP-only cookie via CookieTransport
   */
  login: async (credentials: LoginRequest) => {
    // FastAPI-Users expects form data for login
    const formData = new FormData()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    // Use direct fetch to avoid API client's 401 redirect logic
    try {
      const response = await fetch('http://localhost:8000/auth/jwt/login', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Important: allows cookies to be set
      })

      if (response.ok) {
        // For 204 No Content, just return success (cookie is set by server)
        // For other 2xx responses, try to parse response data
        let data = { access_token: '', token_type: 'bearer' }

        if (response.status !== 204) {
          try {
            data = await response.json()
          } catch {
            // If no body, use default
          }
        }

        return {
          success: true,
          data,
        }
      }

      // Parse error response
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { detail: 'Login failed' }
      }

      return {
        success: false,
        error: {
          status: response.status,
          message: errorData.detail || 'Login failed',
        },
      }
    } catch (error) {
      return {
        success: false,
        error: {
          status: 0,
          message:
            error instanceof Error
              ? error.message
              : 'Network error during login',
        },
      }
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
   * Logout (backend clears HTTP-only cookie)
   */
  logout: async () => {
    return API.post<{ message: string }>(
      '/auth/jwt/logout',
      {},
      {
        includeAuth: true,
      }
    )
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
   * Check if user is authenticated by verifying with backend
   */
  isAuthenticated: async () => {
    const result = await authAPI.getCurrentUser()
    return result.success
  },
}
