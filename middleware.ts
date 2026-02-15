import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // PROTECTED ROUTES
  if (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/api/engine/full-report')
  ) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // ADMIN/ARCHITECT ROUTES
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const user = session?.user;
    const role = typeof user?.role === 'string' ? user.role : '';
    if (!user || !['ADMIN', 'ARCHITECT'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/engine/:path*'],
};
