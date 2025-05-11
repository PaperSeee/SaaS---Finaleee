import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Create supabase middleware client
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Performance optimization: Only refresh token if URL is not for static assets
  const isStaticAsset = req.nextUrl.pathname.startsWith('/_next/') || 
                        req.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js)$/);
  
  if (session && !isStaticAsset) {
    await supabase.auth.refreshSession();
  }
  
  return res;
}

// Only run the middleware on specific paths
export const config = {
  matcher: [
    // Apply to all routes except static assets, api routes, and resources
    '/((?!_next/static|_next/image|favicon.ico|api/public|resources).*)',
  ],
};
