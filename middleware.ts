import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/contact', '/pricing', '/faq', '/auth/login', '/auth/register', '/auth/forgot-password'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get the current path
  const path = req.nextUrl.pathname;
  
  // Check if the path starts with '/dashboard'
  const isDashboardRoute = path.startsWith('/dashboard');
  
  // Allow access to public routes
  if (publicRoutes.includes(path) || path.startsWith('/api/')) {
    return res;
  }
  
  // If trying to access dashboard without authentication, redirect to login
  if (isDashboardRoute && !session) {
    const redirectUrl = new URL('/auth/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Continue for authenticated users or other routes
  return res;
}

// Specify which routes should trigger this middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
