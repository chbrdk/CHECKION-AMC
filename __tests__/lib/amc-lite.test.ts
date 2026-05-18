import { describe, expect, it } from 'vitest';
import {
  isAmcLiteNavHrefEnabled,
  isAmcLitePublicPath,
  isAmcGeoEeatCompetitiveSelectorEnabled,
  isAmcGeminiCompetitiveBenchmarkEnabled,
  isAmcGeoEeatQuickScanEnabled,
  isAmcScanProjectSelectorEnabled,
  isAmcScanRunnerSelectorEnabled,
  isAmcScanWcagStandardSelectorEnabled,
  isAmcSettingsAboutEnabled,
  isAmcSettingsApiTokensEnabled,
  isAmcGeoEeatRoute,
  isAmcResultsRoute,
  isAmcMobileMainFlushHorizontal,
  isAmcScanPageHeaderEnabled,
  isAmcResultsViewModeSelectorOnMobileEnabled,
  isAmcScanRoute,
  isAmcSettingsScanConfigEnabled,
  normalizePathnameForAmcLite,
  shouldRedirectHomeToScan,
} from '@/lib/amc-lite';

describe('amc-lite routes', () => {
  it('allows scan, results, geo-eeat, settings, auth, and api', () => {
    expect(isAmcLitePublicPath('/scan')).toBe(true);
    expect(isAmcLitePublicPath('/scan/domain')).toBe(true);
    expect(isAmcLitePublicPath('/results/abc')).toBe(true);
    expect(isAmcLitePublicPath('/geo-eeat/job-123')).toBe(true);
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
    expect(isAmcLitePublicPath('/journey-agent/job')).toBe(false);
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

  it('disables Gemini in competitive benchmark for AMC', () => {
    expect(isAmcGeminiCompetitiveBenchmarkEnabled()).toBe(false);
  });

  it('hides WCAG standard selector on scan (fixed AA)', () => {
    expect(isAmcScanWcagStandardSelectorEnabled()).toBe(false);
  });

  it('hides scan engine selector on scan (fixed axe + htmlcs)', () => {
    expect(isAmcScanRunnerSelectorEnabled()).toBe(false);
  });

  it('hides extended settings sections on /settings', () => {
    expect(isAmcSettingsScanConfigEnabled()).toBe(false);
    expect(isAmcSettingsApiTokensEnabled()).toBe(false);
    expect(isAmcSettingsAboutEnabled()).toBe(false);
  });

  it('merges scan page title into config card (no duplicate header)', () => {
    expect(isAmcScanPageHeaderEnabled()).toBe(false);
  });

  it('hides results view-mode dropdown on mobile', () => {
    expect(isAmcResultsViewModeSelectorOnMobileEnabled()).toBe(false);
  });

  it('flushes horizontal padding on /scan, /geo-eeat, and /results for mobile main content', () => {
    expect(isAmcScanRoute('/scan')).toBe(true);
    expect(isAmcScanRoute('/scan/domain')).toBe(true);
    expect(isAmcScanRoute('/settings')).toBe(false);
    expect(isAmcGeoEeatRoute('/geo-eeat/job-1')).toBe(true);
    expect(isAmcGeoEeatRoute('/settings')).toBe(false);
    expect(isAmcResultsRoute('/results/abc')).toBe(true);
    expect(isAmcResultsRoute('/settings')).toBe(false);
    expect(isAmcMobileMainFlushHorizontal('/scan')).toBe(true);
    expect(isAmcMobileMainFlushHorizontal('/geo-eeat/abc')).toBe(true);
    expect(isAmcMobileMainFlushHorizontal('/results/abc')).toBe(true);
    expect(isAmcMobileMainFlushHorizontal('/settings')).toBe(false);
  });
});
