import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('AmcLiteNavLink', () => {
  it('wraps locked routes with tooltip and blocks navigation', () => {
    const source = readFileSync(resolve(process.cwd(), 'components/AmcLiteNavLink.tsx'), 'utf8');
    expect(source).toContain('Tooltip');
    expect(source).toContain('AMC_LITE_UPGRADE_TOOLTIP_KEY');
    expect(source).toContain("isDrawerNav ? 'bottom' : 'right'");
    expect(source).toContain("breakpoints.down('md')");
    expect(source).toContain('cursor: \'not-allowed\'');
    expect(source).toContain('isAmcLiteNavHrefEnabled');
  });

  it('uses AmcLiteNavLink in Sidebar', () => {
    const source = readFileSync(resolve(process.cwd(), 'components/Sidebar.tsx'), 'utf8');
    expect(source).toContain('AmcLiteNavLink');
    expect(source).toContain('PATH_SCAN');
  });

  it('renders scan (search) nav icon at Material Symbols wght 600 only', () => {
    const css = readFileSync(resolve(process.cwd(), 'styles/globals.css'), 'utf8');
    expect(css).toContain('a[href$="/scan"] .msqdx-material-symbol');
    expect(css).toContain("'wght' 600");
    expect(css).not.toMatch(/\.msqdx-admin-nav \.msqdx-material-symbol \{[^[]/);
  });
});
