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

/** Inner padding for cards on flush mobile pages (content not edge-to-edge). */
export const amcMobileFlushCardSx = {
  px: { xs: 'var(--msqdx-spacing-md)', md: 0 },
} as const;
