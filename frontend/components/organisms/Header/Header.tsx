'use client'

import React from 'react'
import { SearchBar } from '@/components/molecules'
import { Button } from '@/components/atoms'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/atoms'
import { Menu, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onSearch?: (query: string) => void
  userAvatar?: string
  userName?: string
  onLogout?: () => void
  className?: string
}

function Header({
  onSearch,
  userAvatar,
  userName = 'User',
  onLogout,
  className,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      console.log('Header: Starting logout...')
      await logout()
      console.log('Header: Logout completed, redirecting to login...')
      router.push('/login')
      onLogout?.()
    } catch (error) {
      console.error('Header: Logout error:', error)
      // Still redirect even if logout fails
      console.log('Header: Logout failed, but redirecting anyway...')
      router.push('/login')
    }
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60',
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="font-bold text-xl text-primary">FeedHub</div>
        </div>

        {/* User Menu */}
        <div className="relative flex items-center gap-2">
          <Button size="icon" variant="ghost" className="md:hidden">
            <Menu className="size-5" />
          </Button>

          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full"
            >
              <Avatar className="size-8">
                {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
                <AvatarFallback>
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b text-sm font-medium">
                  {userName}
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-muted text-sm text-destructive"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile SearchBar */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar onSearch={onSearch} />
      </div>
    </header>
  )
}

export { Header }
