'use client'

import React from 'react'
import { Header } from '@/components/organisms'
import { cn } from '@/lib/utils'

interface ProfileLayoutProps {
  children?: React.ReactNode
  profileSection: React.ReactNode
  feedSection: React.ReactNode
  headerProps?: React.ComponentProps<typeof Header>
  className?: string
  profileClassName?: string
  feedClassName?: string
}

function ProfileLayout({
  children,
  profileSection,
  feedSection,
  headerProps,
  className,
  profileClassName,
  feedClassName,
}: ProfileLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col bg-background">
      {/* Header */}
      <Header {...headerProps} />

      {/* Main Content */}
      <div className={cn('flex-1 overflow-y-auto', className)}>
        {/* Profile Hero Section */}
        <div className="w-full border-b">{profileSection}</div>

        {/* Profile Content Area */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 md:p-6">
            {/* Left Sidebar - Profile Widget */}
            <aside className={cn('md:col-span-1', profileClassName)}>
              {profileSection}
            </aside>

            {/* Main Feed */}
            <main className={cn('md:col-span-3', feedClassName)}>
              {feedSection}
            </main>
          </div>
        </div>

        {/* Additional Children */}
        {children && (
          <div className="max-w-7xl mx-auto p-4 md:p-6">{children}</div>
        )}
      </div>
    </div>
  )
}

export { ProfileLayout }
