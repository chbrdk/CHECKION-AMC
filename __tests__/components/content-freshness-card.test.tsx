import { describe, expect, it } from 'vitest';
import { alpha } from '@mui/material';
import { CHECKION_MUI_COLORS } from '@/lib/checkion-mui-colors';

/** Regression: ContentFreshnessCard chip bg uses alpha(confidenceColor); unknown used to return a CSS var. */
describe('ContentFreshnessCard MUI colors', () => {
  it('alpha accepts hex from CHECKION_MUI_COLORS for unknown-confidence chip background', () => {
    expect(() => alpha(CHECKION_MUI_COLORS.textMutedOnLight, 0.12)).not.toThrow();
    expect(alpha(CHECKION_MUI_COLORS.textMutedOnLight, 0.12)).toMatch(/^rgba?\(/);
  });

  it('alpha rejects CSS variables (MUI production error #9)', () => {
    expect(() => alpha('var(--color-text-muted-on-light)', 0.12)).toThrow();
  });
});
