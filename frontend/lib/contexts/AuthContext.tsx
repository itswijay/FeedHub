'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { authAPI, UserData } from '@/lib/api'

interface AuthContextType {
  user: UserData | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string) => Promise<boolean>
  logout: () => void
  getCurrentUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      if (authAPI.isAuthenticated()) {
        await getCurrentUser()
      } else {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // Set up periodic token validation (every 5 minutes)
  useEffect(() => {
    if (!isAuthenticated) return

    const tokenCheckInterval = setInterval(async () => {
      if (authAPI.isAuthenticated()) {
        // Attempt to validate token by fetching user data
        const response = await authAPI.getCurrentUser()
        if (!response.success) {
          // Token is invalid, logout user
          logout()
        }
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(tokenCheckInterval)
  }, [isAuthenticated])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authAPI.login({
        username: email,
        password,
      })

      if (response.success) {
        await getCurrentUser()
        return true
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authAPI.register({
        email,
        password,
      })

      if (response.success) {
        // After signup, try to login automatically
        return await login(email, password)
      }

      return false
    } catch (error) {
      console.error('Signup error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser()
      if (response.success && response.data) {
        setUser(response.data)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
        authAPI.logout()
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
