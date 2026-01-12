const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_TIMEOUT = 30000 // 30 seconds

export interface ApiError {
  status: number
  message: string
  detail?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  success: boolean
}

/**
 * Get the JWT token from localStorage
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken')
}

/**
 * Set the JWT token in localStorage
 */
function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('authToken', token)
}

/**
 * Clear the JWT token from localStorage
 */
function clearToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('authToken')
}

/**
 * Build headers with authentication token
 */
function getHeaders(includeAuth: boolean = true): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (includeAuth) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

/**
 * Make an API request with proper error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { includeAuth?: boolean } = {}
): Promise<ApiResponse<T>> {
  const { includeAuth = true, ...fetchOptions } = options

  const url = `${API_BASE_URL}${endpoint}`
  const headers = getHeaders(includeAuth)

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...headers,
        ...(fetchOptions.headers as Record<string, string>),
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Handle successful response
    if (response.ok) {
      const data = await response.json()
      return {
        data,
        success: true,
      }
    }

    // Handle error responses
    let errorData
    try {
      errorData = await response.json()
    } catch {
      errorData = { detail: 'An unexpected error occurred' }
    }

    // Handle 401 Unauthorized - likely expired token
    if (response.status === 401) {
      clearToken()
      // Redirect to login if in browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return {
        success: false,
        error: {
          status: 401,
          message: 'Session expired. Please login again.',
          detail: errorData.detail,
        },
      }
    }

    return {
      success: false,
      error: {
        status: response.status,
        message: errorData.detail || 'An error occurred',
        detail: errorData.detail,
      },
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return {
        success: false,
        error: {
          status: 0,
          message: 'Network error. Is the backend running?',
        },
      }
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: {
          status: 0,
          message: 'Request timeout. Please try again.',
        },
      }
    }

    return {
      success: false,
      error: {
        status: 0,
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      },
    }
  }
}

interface ApiRequestOptions extends RequestInit {
  includeAuth?: boolean
}

export const API = {
  get: <T>(endpoint: string, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),

  postForm: <T>(
    endpoint: string,
    formData: FormData,
    options?: ApiRequestOptions
  ) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData; the browser will set it with boundary
        ...(options?.headers as Record<string, string>),
      },
      body: formData,
      includeAuth: true,
    }),

  getToken,
  setToken,
  clearToken,
}

export { API_BASE_URL }
