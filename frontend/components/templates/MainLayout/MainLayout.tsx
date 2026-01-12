'use client'

import React from 'react'
import { Header } from '@/components/organisms'
import { Sidebar } from '@/components/organisms'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  sidebarCollapsed?: boolean
  onSidebarToggle?: () => void
  headerProps?: React.ComponentProps<typeof Header>
  className?: string
}

function MainLayout({
  children,
  showSidebar = true,
  sidebarCollapsed = false,
  onSidebarToggle,
  headerProps,
  className,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col bg-background">
      {/* Header */}
      <Header {...headerProps} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && <Sidebar collapsed={sidebarCollapsed} />}

        {/* Content Area */}
        <main className={cn('flex-1 overflow-y-auto', className)}>
          {children}
        </main>
      </div>
    </div>
  )
}

export { MainLayout }
