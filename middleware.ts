import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAppBasePath } from '@/lib/constants';
import { isAmcLitePublicPath, shouldRedirectHomeToScan } from '@/lib/amc-lite';

function withBasePath(path: string): string {
  const base = getAppBasePath();
  if (!base) return path;
  if (path === '/') return base;
  return `${base}${path}`;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldRedirectHomeToScan(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = withBasePath('/scan');
    return NextResponse.redirect(url);
  }

  if (isAmcLitePublicPath(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = withBasePath('/scan');
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
