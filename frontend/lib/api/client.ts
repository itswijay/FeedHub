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
 * Note: Auth token is stored in HTTP-only cookies set by the backend.
 * The token is automatically included in requests via credentials: 'include'.
 * No client-side token management needed for security.
 */

/**
 * Build headers for API requests
 * Note: Auth token is automatically included via HTTP-only cookies
 */
function getHeaders(isFormData: boolean = false): Record<string, string> {
  if (isFormData) {
    // Don't set Content-Type for FormData; the browser will set it with boundary
    return {}
  }
  return {
    'Content-Type': 'application/json',
  }
}

/**
 * Make an API request with proper error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { includeAuth?: boolean; isFormData?: boolean } = {}
): Promise<ApiResponse<T>> {
  const { isFormData, ...fetchOptions } = options

  const url = `${API_BASE_URL}${endpoint}`
  const headers = getHeaders(isFormData)

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
      credentials: 'include',
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

    // Extract error message - handle both string and Pydantic validation errors
    let errorMessage = 'An error occurred'
    if (errorData.detail) {
      if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail
      } else if (Array.isArray(errorData.detail)) {
        // Handle Pydantic validation errors (array of error objects)
        errorMessage = errorData.detail
          .map((err: unknown) => {
            if (typeof err === 'string') return err
            if (
              typeof err === 'object' &&
              err !== null &&
              'msg' in err &&
              'loc' in err
            ) {
              const typedErr = err as { msg: string; loc?: string[] }
              return `${typedErr.loc?.join('.') || 'field'}: ${typedErr.msg}`
            }
            return 'Validation error'
          })
          .join('; ')
      } else if (typeof errorData.detail === 'object') {
        // Handle other object errors
        errorMessage = JSON.stringify(errorData.detail)
      }
    }

    // Handle 401 Unauthorized - likely expired token
    if (response.status === 401) {
      // Only redirect to login if not already on a public auth page
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        const isAuthPage = currentPath === '/login' || currentPath === '/signup'
        if (!isAuthPage) {
          window.location.href = '/login'
        }
      }
      return {
        success: false,
        error: {
          status: 401,
          message: 'Session expired. Please login again.',
          detail: typeof errorData.detail === 'string' ? errorData.detail : '',
        },
      }
    }

    return {
      success: false,
      error: {
        status: response.status,
        message: errorMessage,
        detail: typeof errorData.detail === 'string' ? errorData.detail : '',
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

/**
 * Make an API request with upload progress tracking using XMLHttpRequest
 */
async function apiRequestWithProgress<T>(
  endpoint: string,
  formData: FormData,
  options?: ApiRequestOptions
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  const { onUploadProgress } = options || {}

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()

    // Track upload progress
    if (onUploadProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          onUploadProgress(progress)
        }
      })
    }

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText)
          resolve({
            data,
            success: true,
          })
        } catch {
          resolve({
            success: false,
            error: {
              status: xhr.status,
              message: 'Failed to parse response',
            },
          })
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText)
          let errorMessage = 'An error occurred'
          if (errorData.detail) {
            if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail
            } else if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail
                .map((err: unknown) => {
                  if (typeof err === 'string') return err
                  if (
                    typeof err === 'object' &&
                    err !== null &&
                    'msg' in err &&
                    'loc' in err
                  ) {
                    const typedErr = err as { msg: string; loc?: string[] }
                    return `${typedErr.loc?.join('.') || 'field'}: ${
                      typedErr.msg
                    }`
                  }
                  return 'Validation error'
                })
                .join('; ')
            }
          }
          resolve({
            success: false,
            error: {
              status: xhr.status,
              message: errorMessage,
            },
          })
        } catch {
          resolve({
            success: false,
            error: {
              status: xhr.status,
              message: 'An unexpected error occurred',
            },
          })
        }
      }
    })

    // Handle errors
    xhr.addEventListener('error', () => {
      resolve({
        success: false,
        error: {
          status: 0,
          message: 'Network error. Is the backend running?',
        },
      })
    })

    // Handle abort
    xhr.addEventListener('abort', () => {
      resolve({
        success: false,
        error: {
          status: 0,
          message: 'Request timeout. Please try again.',
        },
      })
    })

    xhr.open('POST', url)
    xhr.withCredentials = true
    xhr.send(formData)
  })
}

export interface ApiRequestOptions extends RequestInit {
  includeAuth?: boolean
  onUploadProgress?: (progress: number) => void
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
  ) => apiRequestWithProgress<T>(endpoint, formData, options),
}

export { API_BASE_URL }