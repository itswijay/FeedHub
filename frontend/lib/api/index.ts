/**
 * Centralized API exports
 * Import specific APIs from this file for cleaner imports throughout the app
 */

export { API, API_BASE_URL } from './client'
export type { ApiError, ApiResponse } from './client'

export { authAPI } from './auth'
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserData,
} from './auth'

export { postsAPI } from './posts'
export type {
  Post,
  FeedResponse,
  UploadResponse,
  DeleteResponse,
} from './posts'

export { usersAPI } from './users'
export type {
  UserProfile,
  UpdateUserRequest,
  UpdateUserResponse,
} from './users'
