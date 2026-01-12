'use client'

import React from 'react'
import { Header, Sidebar, Footer } from '@/components/organisms'
import { cn } from '@/lib/utils'

interface FeedLayoutProps {
  children?: React.ReactNode
  mainFeed: React.ReactNode
  sidebar?: React.ReactNode
  showSidebar?: boolean
  sidebarCollapsed?: boolean
  headerProps?: React.ComponentProps<typeof Header>
  className?: string
  feedClassName?: string
  sidebarClassName?: string
}

function FeedLayout({
  children,
  mainFeed,
  sidebar,
  showSidebar = true,
  sidebarCollapsed = false,
  headerProps,
  className,
  feedClassName,
  sidebarClassName,
}: FeedLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col bg-background">
      {/* Header */}
      <Header {...headerProps} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Navigation */}
        {showSidebar && <Sidebar collapsed={sidebarCollapsed} />}

        {/* Center Feed */}
        <main className={cn('flex-1 overflow-y-auto', feedClassName)}>
          <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-4">
            {mainFeed}
          </div>
          {children}
        </main>

        {/* Right Sidebar - Optional */}
        {sidebar && showSidebar && (
          <aside
            className={cn(
              'hidden lg:flex lg:flex-col w-72 border-l overflow-y-auto p-4 space-y-4',
              sidebarClassName
            )}
          >
            {sidebar}
          </aside>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export { FeedLayout }
