import { describe, expect, it } from 'vitest';
import { amcMobileFlushPageShellSx } from '@/lib/amc-page-shell';

describe('amc-page-shell', () => {
  it('removes horizontal padding on xs', () => {
    const sx = amcMobileFlushPageShellSx(1200);
    expect(sx).toMatchObject({
      px: { xs: 0, md: 'var(--msqdx-spacing-md)' },
      pb: { xs: 'calc(72px + var(--msqdx-spacing-sm))', md: 'var(--msqdx-spacing-md)' },
      maxWidth: 1200,
      width: '100%',
    });
  });
});
