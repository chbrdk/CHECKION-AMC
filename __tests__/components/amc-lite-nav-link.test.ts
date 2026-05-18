import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('AmcLiteNavLink', () => {
  it('wraps locked routes with tooltip and blocks navigation', () => {
    const source = readFileSync(resolve(process.cwd(), 'components/AmcLiteNavLink.tsx'), 'utf8');
    expect(source).toContain('Tooltip');
    expect(source).toContain('AMC_LITE_UPGRADE_TOOLTIP_KEY');
    expect(source).toContain('cursor: \'not-allowed\'');
    expect(source).toContain('PATH_SCAN');
  });

  it('uses AmcLiteNavLink in Sidebar', () => {
    const source = readFileSync(resolve(process.cwd(), 'components/Sidebar.tsx'), 'utf8');
    expect(source).toContain('AmcLiteNavLink');
    expect(source).toContain('PATH_SCAN');
  });
});
