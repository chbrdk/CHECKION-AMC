import type { Locale } from '@/lib/i18n';

/** AMC demo UI is German-only (no English locale). */
export const AMC_FIXED_LOCALE: Locale = 'de';

/** BCP 47 tag for dates/numbers in AMC surfaces. */
export const AMC_DATE_LOCALE = 'de-DE';

export function isAmcGermanOnlyLocale(): boolean {
  return true;
}

export function resolveAmcLocale(): Locale {
  return AMC_FIXED_LOCALE;
}
