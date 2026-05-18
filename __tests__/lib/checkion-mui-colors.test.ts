import { describe, expect, it } from 'vitest';
import { CHECKION_MUI_COLORS } from '@/lib/checkion-mui-colors';

describe('CHECKION_MUI_COLORS', () => {
  it('uses hex values MUI can parse (no CSS variables)', () => {
    for (const value of Object.values(CHECKION_MUI_COLORS)) {
      expect(value).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
