import { describe, expect, it } from 'vitest';
import { AMC_FIXED_LOCALE, isAmcGermanOnlyLocale, resolveAmcLocale } from '@/lib/amc-locale';
import { createTranslator, normalizeLocale, resolveLocale, SUPPORTED_LOCALES } from '@/lib/i18n';

describe('amc locale (German-only)', () => {
  it('fixes locale to de', () => {
    expect(isAmcGermanOnlyLocale()).toBe(true);
    expect(resolveAmcLocale()).toBe('de');
    expect(AMC_FIXED_LOCALE).toBe('de');
  });

  it('ignores en cookie and accept-language', () => {
    expect(normalizeLocale('en')).toBe('de');
    expect(normalizeLocale('en-US')).toBe('de');
    expect(resolveLocale('en', 'en-US,en;q=0.9')).toBe('de');
  });

  it('exposes only German as supported locale', () => {
    expect(SUPPORTED_LOCALES).toEqual(['de']);
  });

  it('translates nav keys in German', () => {
    const t = createTranslator('en');
    expect(t('nav.newScan')).toBe('Neuer Scan');
    expect(t('nav.history')).toBe('Verlauf');
  });
});
