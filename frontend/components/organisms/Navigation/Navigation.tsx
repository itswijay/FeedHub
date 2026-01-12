'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/atoms'
import { cn } from '@/lib/utils'
import { Home, Upload, Share2, User, MoreHorizontal } from 'lucide-react'

interface NavItem {
  label: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
  active?: boolean
  badge?: number
}

interface NavigationProps {
  items: NavItem[]
  collapsed?: boolean
  className?: string
}

function Navigation({ items, collapsed = false, className }: NavigationProps) {
  return (
    <nav
      className={cn(
        'flex flex-col gap-2 p-3',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {items.map((item, index) => (
        <Button
          key={index}
          variant={item.active ? 'default' : 'ghost'}
          size={collapsed ? 'icon' : 'lg'}
          onClick={item.onClick}
          className={cn('justify-start gap-4', collapsed && 'justify-center')}
          asChild={!!item.href}
        >
          {item.href ? (
            <a href={item.href}>
              {item.icon}
              {!collapsed && (
                <span className="flex-1 text-left">
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2">
                      {item.badge}
                    </span>
                  )}
                </span>
              )}
            </a>
          ) : (
            <>
              {item.icon}
              {!collapsed && (
                <span className="flex-1 text-left">
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2">
                      {item.badge}
                    </span>
                  )}
                </span>
              )}
            </>
          )}
        </Button>
      ))}
    </nav>
  )
}

// Sidebar - A specific layout of Navigation
interface SidebarProps {
  onLogout?: () => void
  userName?: string
  collapsed?: boolean
  className?: string
}

function Sidebar({
  onLogout,
  userName = 'User',
  collapsed = false,
  className,
}: SidebarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const navItems: NavItem[] = [
    {
      label: 'Home',
      icon: <Home className="size-5" />,
      href: '/',
      active: mounted && pathname === '/',
    },
    {
      label: 'Upload',
      icon: <Upload className="size-5" />,
      href: '/upload',
      active: mounted && pathname === '/upload',
    },
    {
      label: 'Shared with Me',
      icon: <Share2 className="size-5" />,
      href: '/shared',
      active: mounted && pathname === '/shared',
    },
    {
      label: 'Profile',
      icon: <User className="size-5" />,
      href: '/profile',
      active: mounted && pathname === '/profile',
    },
  ]

  return (
    <aside
      className={cn(
        'sticky top-0 h-screen border-r bg-background overflow-y-auto flex flex-col',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Navigation Items */}
      <Navigation items={navItems} collapsed={collapsed} />

      {/* Bottom Menu */}
      <div className="mt-auto border-t p-3 space-y-2">
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'lg'}
          className={cn(
            'justify-start gap-4 w-full',
            collapsed && 'justify-center'
          )}
          onClick={onLogout}
        >
          <MoreHorizontal className="size-5" />
          {!collapsed && 'More'}
        </Button>
      </div>
    </aside>
  )
}

export { Navigation, Sidebar }
