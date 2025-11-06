// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect all routes except public ones
        const publicPaths = [
          '/',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/verify-email',
          '/auth/error',
          '/about',
          '/contact',
          '/features',
          '/pricing',
          '/api/auth',
        ]

        const isPublicPath = publicPaths.some(path => 
          req.nextUrl.pathname.startsWith(path)
        )

        // Allow public paths and API routes
        if (isPublicPath || req.nextUrl.pathname.startsWith('/api/')) {
          return true
        }

        // Require authentication for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth pages
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}