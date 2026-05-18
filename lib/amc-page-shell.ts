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
