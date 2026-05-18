import type { SxProps, Theme } from '@mui/material';

/** AMC demo: full-width page shell on xs (no horizontal padding). */
export function amcMobileFlushPageShellSx(maxWidth: number | string): SxProps<Theme> {
  return {
    px: { xs: 0, md: 'var(--msqdx-spacing-md)' },
    py: { xs: 'var(--msqdx-spacing-sm)', md: 'var(--msqdx-spacing-md)' },
    maxWidth,
    mx: 'auto',
    width: '100%',
  };
}

/** Extra bottom padding when a sticky mobile action bar is shown (e.g. GEO results). */
export const amcMobileActionBarPaddingSx = {
  pb: { xs: 'calc(72px + var(--msqdx-spacing-sm))', md: 'var(--msqdx-spacing-md)' },
} as const;

const flushInset = 'var(--msqdx-spacing-md)';

/**
 * Shell MsqdxCard on flush pages: single inset via inner content box (not root + inner).
 * Targets atom card `> div` padding wrapper.
 */
export const amcMobileFlushCardSx = {
  px: { xs: 0, md: 0 },
  py: { xs: 0, md: 0 },
  '& > div': {
    p: { xs: flushInset },
  },
} as const;

/** Plain Box/section on flush pages (e.g. ResultsPageHeader). */
export const amcMobileFlushBoxSx = {
  px: { xs: flushInset, md: undefined },
  py: { xs: flushInset, md: undefined },
} as const;

/**
 * Nested MsqdxCard inside a flush shell card: bleed to shell edges on xs, one content inset.
 */
export const amcMobileFlushNestedCardSx = {
  mx: { xs: `calc(-1 * ${flushInset})`, md: 0 },
  width: { xs: `calc(100% + 2 * ${flushInset})`, md: '100%' },
  maxWidth: { xs: `calc(100% + 2 * ${flushInset})`, md: '100%' },
  borderRadius: { xs: 0, md: undefined },
  borderLeftWidth: { xs: 0, md: undefined },
  borderRightWidth: { xs: 0, md: undefined },
  '& > div': {
    px: { xs: flushInset },
  },
} as const;
