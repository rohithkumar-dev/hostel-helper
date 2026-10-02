import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'hh_srm_secure_jwt_secret_key_production_2026_x87b92';
const key = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'hh_admin_session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Allow /admin/login freely
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check session token
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, key, { algorithms: ['HS256'] });
      return NextResponse.next();
    } catch {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
