import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FeedHub',
  description: 'Media Gallery Management System',
}

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
