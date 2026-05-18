/**
 * AMC demo deployment: scan-only surface. This fork always runs in lite mode.
 */

import {
  PATH_LOGIN,
  PATH_REGISTER,
  PATH_RESULTS,
  PATH_SCAN,
  getAppBasePath,
} from '@/lib/constants';

export const AMC_LITE_UPGRADE_TOOLTIP_KEY = 'nav.amcLiteUpgradeTooltip';

/** Path prefixes allowed without redirect to /scan */
const ALLOWED_PREFIXES = [
  PATH_LOGIN,
  PATH_REGISTER,
  PATH_SCAN,
  PATH_RESULTS,
  '/api',
  '/_next',
] as const;

const ALLOWED_EXACT = new Set(['/favicon.ico', '/robots.txt', '/sitemap.xml']);

function stripBasePath(pathname: string): string {
  const base = getAppBasePath();
  if (!base || base === '/') return pathname;
  if (pathname === base) return '/';
  if (pathname.startsWith(`${base}/`)) return pathname.slice(base.length) || '/';
  return pathname;
}

export function normalizePathnameForAmcLite(pathname: string): string {
  const stripped = stripBasePath(pathname);
  if (!stripped || stripped === '') return '/';
  const withoutQuery = stripped.split('?')[0] ?? stripped;
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery;
}

export function isAmcLitePublicPath(pathname: string): boolean {
  const path = normalizePathnameForAmcLite(pathname);
  if (ALLOWED_EXACT.has(path)) return true;
  return ALLOWED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function shouldRedirectHomeToScan(pathname: string): boolean {
  const path = normalizePathnameForAmcLite(pathname);
  return path === '/';
}

export type AmcLiteNavEntry = {
  labelKey: string;
  path?: string;
  icon: string;
  exact?: boolean;
  enabled: boolean;
};

export const AMC_LITE_NAV_ENTRIES: AmcLiteNavEntry[] = [
  { labelKey: 'nav.dashboard', path: '/', icon: 'dashboard', exact: true, enabled: false },
  { labelKey: 'nav.newScan', path: PATH_SCAN, icon: 'search', enabled: true },
  { labelKey: 'nav.deepScans', path: '/deep-scans', icon: 'dataset', enabled: false },
  { labelKey: 'nav.projects', path: '/projects', icon: 'folder', enabled: false },
  { labelKey: 'nav.developers', path: '/developers', icon: 'code', enabled: false },
];

export const AMC_LITE_EXTERNAL_NAV_ENTRIES: AmcLiteNavEntry[] = [
  { labelKey: 'nav.settings', path: '/settings', icon: 'settings', enabled: false },
];
