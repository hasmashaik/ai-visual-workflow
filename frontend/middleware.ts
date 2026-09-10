import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for token in cookies
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/';
  const isProtected = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/projects') || 
    pathname.startsWith('/generate') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/reviews') ||
    pathname.startsWith('/history') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/settings');

  // If user has token and tries to access auth pages, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user doesn't have token and tries to access protected pages, redirect to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};