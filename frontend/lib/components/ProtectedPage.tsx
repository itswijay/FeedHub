'use client'

import React, { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'

interface ProtectedPageProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Wrapper component to protect pages that require authentication
 * Shows fallback content while checking auth status
 */
export function ProtectedPage({ children, fallback }: ProtectedPageProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Show fallback while loading
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      )
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

/**
 * Wrapper component for pages that should only be accessible when NOT authenticated
 * Redirects to home if user is already logged in
 */
export function PublicPage({ children, fallback }: ProtectedPageProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  // Show fallback while loading
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      )
    )
  }

  // Don't render if authenticated (will redirect)
  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}
