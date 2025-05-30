import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/interview-setup'];

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // Check if the path is in the protected routes
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  );

  // If it's a protected route and we're on the client side, no server-side check needed
  // Client-side components will handle auth checks
  if (isProtectedRoute) {
    // For API routes, we can check Auth header
    if (pathname.startsWith('/api/') && pathname !== '/api/auth/login' && pathname !== '/api/auth/register' && pathname !== '/api/auth/verify-email') {
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Define paths that this middleware should match
  matcher: [
    '/dashboard/:path*',
    '/interview-setup/:path*',
    '/api/:path*',
  ],
}; 