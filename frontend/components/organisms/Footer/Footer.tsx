'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
  copyrightText?: string
  year?: number
}

function Footer({
  className,
  copyrightText = 'FeedHub',
  year = new Date().getFullYear(),
}: FooterProps) {
  return (
    <footer
      className={cn(
        'border-t bg-background py-4 px-4 md:px-6 text-center text-sm text-muted-foreground',
        className
      )}
    >
      <p>
        © {year} {copyrightText}. All rights reserved.
      </p>
    </footer>
  )
}

export { Footer }
