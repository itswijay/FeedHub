'use client'

import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/atoms'
import { cn } from '@/lib/utils'

interface UserCardProps {
  avatar?: string
  name: string
  bio?: string
  fallback?: string
  className?: string
}

function UserCard({
  avatar,
  name,
  bio,
  fallback = 'U',
  className,
}: UserCardProps) {
  return (
    <div
      data-slot="user-card"
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors',
        className
      )}
    >
      <Avatar>
        {avatar && <AvatarImage src={avatar} alt={name} />}
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{name}</p>
        {bio && <p className="text-muted-foreground text-xs truncate">{bio}</p>}
      </div>
    </div>
  )
}

export { UserCard }
