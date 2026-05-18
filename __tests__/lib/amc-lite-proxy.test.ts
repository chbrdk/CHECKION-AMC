import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('amc-lite proxy', () => {
  it('implements route guard in proxy.ts only (no middleware.ts)', () => {
    const proxy = readFileSync(resolve(process.cwd(), 'proxy.ts'), 'utf8');
    expect(proxy).toContain('isAmcLitePublicPath');
    expect(proxy).toContain('shouldRedirectHomeToScan');
    expect(proxy).toContain('redirectToScan');
  });
});
