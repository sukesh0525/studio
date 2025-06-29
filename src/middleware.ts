import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  // Only apply middleware to API routes that need authentication
  if (request.nextUrl.pathname.startsWith('/api/auth/') && 
      !request.nextUrl.pathname.includes('/login') && 
      !request.nextUrl.pathname.includes('/register')) {
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
      const payload = verifyToken(token);
      // Add user info to headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-user-type', payload.userType);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/:path*', '/api/jobs/:path*', '/api/applications/:path*', '/api/profile/:path*']
};