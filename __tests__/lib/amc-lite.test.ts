import { describe, expect, it } from 'vitest';
import {
  isAmcLiteNavHrefEnabled,
  isAmcLitePublicPath,
  isAmcGeoEeatCompetitiveSelectorEnabled,
  isAmcGeoEeatQuickScanEnabled,
  isAmcScanProjectSelectorEnabled,
  isAmcScanRunnerSelectorEnabled,
  isAmcScanWcagStandardSelectorEnabled,
  normalizePathnameForAmcLite,
  shouldRedirectHomeToScan,
} from '@/lib/amc-lite';

describe('amc-lite routes', () => {
  it('allows scan, results, settings, auth, and api', () => {
    expect(isAmcLitePublicPath('/scan')).toBe(true);
    expect(isAmcLitePublicPath('/scan/domain')).toBe(true);
    expect(isAmcLitePublicPath('/results/abc')).toBe(true);
    expect(isAmcLitePublicPath('/settings')).toBe(true);
    expect(isAmcLitePublicPath('/login')).toBe(true);
    expect(isAmcLitePublicPath('/register')).toBe(true);
    expect(isAmcLitePublicPath('/api/health')).toBe(true);
  });

  it('blocks full-product routes', () => {
    expect(isAmcLitePublicPath('/projects')).toBe(false);
    expect(isAmcLitePublicPath('/deep-scans')).toBe(false);
    expect(isAmcLitePublicPath('/developers')).toBe(false);
    expect(isAmcLitePublicPath('/domain/xyz')).toBe(false);
    expect(isAmcLitePublicPath('/geo-eeat/job')).toBe(false);
  });

  it('enables scan and settings in sidebar nav', () => {
    expect(isAmcLiteNavHrefEnabled('/scan')).toBe(true);
    expect(isAmcLiteNavHrefEnabled('/settings')).toBe(true);
    expect(isAmcLiteNavHrefEnabled('/projects')).toBe(false);
    expect(isAmcLiteNavHrefEnabled('/developers')).toBe(false);
  });

  it('redirects home to scan', () => {
    expect(shouldRedirectHomeToScan('/')).toBe(true);
    expect(shouldRedirectHomeToScan('/scan')).toBe(false);
  });

  it('strips trailing slashes', () => {
    expect(normalizePathnameForAmcLite('/scan/')).toBe('/scan');
  });

  it('disables project selector on scans for AMC demo', () => {
    expect(isAmcScanProjectSelectorEnabled()).toBe(false);
  });

  it('offers GEO/E-E-A-T full analysis only (no quick tab)', () => {
    expect(isAmcGeoEeatQuickScanEnabled()).toBe(false);
  });

  it('always runs GEO/E-E-A-T competitive benchmark (no opt-in checkbox)', () => {
    expect(isAmcGeoEeatCompetitiveSelectorEnabled()).toBe(false);
  });

  it('hides WCAG standard selector on scan (fixed AA)', () => {
    expect(isAmcScanWcagStandardSelectorEnabled()).toBe(false);
  });

  it('hides scan engine selector on scan (fixed axe + htmlcs)', () => {
    expect(isAmcScanRunnerSelectorEnabled()).toBe(false);
  });
});
