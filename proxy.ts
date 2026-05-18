import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAmcLitePublicPath, shouldRedirectHomeToScan } from '@/lib/amc-lite';
import {
  getAppBasePath,
  PATH_DEEP_SCANS,
  PATH_DOMAIN,
  PATH_SCAN,
  PATH_RESULTS,
  PATH_SETTINGS,
  PATH_GEO_EEAT,
  PATH_LOGIN,
  PATH_REGISTER,
} from '@/lib/constants';

/** AMC fork: scan + results + domain deep scans + GEO/E-E-A-T + settings + auth (see lib/amc-lite.ts). */
const protectedPaths = [PATH_SCAN, PATH_RESULTS, PATH_DOMAIN, PATH_DEEP_SCANS, PATH_GEO_EEAT, PATH_SETTINGS];
const authPaths = [PATH_LOGIN, PATH_REGISTER];

const SESSION_COOKIES = ['authjs.session-token', '__Secure-authjs.session-token'];

function isProtected(pathname: string): boolean {
    return protectedPaths.some(p => pathname === p || pathname.startsWith(p + '/'));
}
function isAuthPath(pathname: string): boolean {
    return authPaths.some(p => pathname === p || pathname.startsWith(p + '/'));
}

function hasSessionCookie(req: NextRequest): boolean {
    return SESSION_COOKIES.some(name => req.cookies.has(name));
}

function redirectToScan(req: NextRequest): NextResponse {
    const basePath = getAppBasePath();
    const url = req.nextUrl.clone();
    url.pathname = `${basePath || ''}${PATH_SCAN}`;
    return NextResponse.redirect(url);
}

function redirectToRegister(req: NextRequest, redirectAfter?: string): NextResponse {
    const basePath = getAppBasePath();
    const url = req.nextUrl.clone();
    url.pathname = `${basePath || ''}${PATH_REGISTER}`;
    url.search = '';
    if (redirectAfter) {
        url.searchParams.set('redirect', redirectAfter);
    }
    return NextResponse.redirect(url);
}

export function proxy(req: NextRequest) {
    const { pathname, search } = req.nextUrl;
    const basePath = getAppBasePath();
    const normalizedPath =
        basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) || '/' : pathname;
    const hasSession = hasSessionCookie(req);

    if (normalizedPath.startsWith('/api/')) return NextResponse.next();

    if (shouldRedirectHomeToScan(pathname)) {
        if (!hasSession) {
            return redirectToRegister(req, PATH_SCAN);
        }
        return redirectToScan(req);
    }

    if (!isAmcLitePublicPath(pathname)) {
        return redirectToScan(req);
    }

    if (isAuthPath(normalizedPath)) {
        if (hasSession) {
            const url = req.nextUrl.clone();
            url.pathname = `${basePath || ''}${PATH_SCAN}`;
            url.search = '';
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    if (isProtected(normalizedPath) && !hasSession) {
        return redirectToRegister(req, `${normalizedPath}${search}`);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp)$).*)'],
};
