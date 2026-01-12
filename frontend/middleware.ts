import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/', '/upload', '/shared', '/profile', '/media']

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token =
    request.cookies.get('authToken')?.value || localStorage.getItem('authToken')

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // If it's a protected route and no token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If it's a public auth route (login/signup) and user has token, redirect to home
  if (
    (pathname.startsWith('/login') || pathname.startsWith('/signup')) &&
    token
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
