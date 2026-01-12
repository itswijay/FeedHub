'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
}

function AuthLayout({ children, title, subtitle, className }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className={cn('w-full max-w-md space-y-8', className)}>
        {/* Logo/Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">FeedHub</h1>
          {title && (
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          )}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Form Container */}
        <div className="bg-card rounded-xl border shadow-lg p-6">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          © 2024 FeedHub. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export { AuthLayout }
