'use client'

import React from 'react'
import { Input, Button } from '@/components/atoms'
import { SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
  inputClassName?: string
}

function SearchBar({
  placeholder = 'Search...',
  onSearch,
  className,
  inputClassName,
}: SearchBarProps) {
  const [query, setQuery] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex gap-2 w-full', className)}
    >
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn('pr-10', inputClassName)}
        />
      </div>
      <Button type="submit" size="icon" variant="default">
        <SearchIcon className="size-4" />
      </Button>
    </form>
  )
}

export { SearchBar }
