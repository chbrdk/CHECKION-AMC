import { describe, expect, it } from 'vitest';
import {
  amcMobileFlushCardSx,
  amcMobileFlushNestedCardSx,
  amcMobileFlushPageShellSx,
} from '@/lib/amc-page-shell';

describe('amc-page-shell', () => {
  it('removes horizontal padding on xs for page shell', () => {
    const sx = amcMobileFlushPageShellSx(1200);
    expect(sx).toMatchObject({
      px: { xs: 0, md: 'var(--msqdx-spacing-md)' },
      maxWidth: 1200,
      width: '100%',
    });
    expect(sx).not.toHaveProperty('pb');
  });

  it('uses single inset on flush shell cards via inner content box', () => {
    expect(amcMobileFlushCardSx).toMatchObject({
      px: { xs: 0, md: 0 },
      py: { xs: 0, md: 0 },
      '& > div': { p: { xs: 'var(--msqdx-spacing-md)' } },
    });
  });

  it('bleeds nested cards on xs with one horizontal inset', () => {
    expect(amcMobileFlushNestedCardSx).toMatchObject({
      mx: { xs: 'calc(-1 * var(--msqdx-spacing-md))', md: 0 },
      '& > div': { px: { xs: 'var(--msqdx-spacing-md)' } },
    });
  });
});
