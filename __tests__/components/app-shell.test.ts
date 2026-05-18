import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('AppShell mobile nav', () => {
  it('keeps drawer closed by default and aligns breakpoint with MsqdxAdminNav', () => {
    const source = readFileSync(resolve(process.cwd(), 'components/AppShell.tsx'), 'utf8');
    expect(source).toContain('useState(false)');
    expect(source).toContain("breakpoints.down('md')");
    expect(source).not.toContain('useState(true)');
    expect(source).toContain('isAmcMobileMainFlushHorizontal');
    expect(source).toContain("'1rem 0'");
  });

  it('defaults Sidebar open prop to false', () => {
    const source = readFileSync(resolve(process.cwd(), 'components/Sidebar.tsx'), 'utf8');
    expect(source).toContain('open = false');
  });
});
